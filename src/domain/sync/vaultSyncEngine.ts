import type { AnalyticsEvent, PalaceSnapshot } from "../entities/types";
import type { AssetStore } from "../repositories/assetStore";
import type { PalaceRepository } from "../repositories/palaceRepository";
import type { AARRecord } from "../services/cast/aarRecords";
import {
  collectLocalAssets,
  collectVaultAssetHashes,
  localizeAssets,
  portableizeAssets,
} from "./assetRefs";
import {
  classifyVaultPath,
  VAULT_DESCRIPTOR_PATH,
  vaultPaths,
  type VaultRemote,
} from "../repositories/vaultRemote";
import { palaceContentHash } from "./contentHash";
import { forkPalaceSnapshot } from "./forkPalace";
import {
  conflictsOf,
  planSync,
  type LocalPalaceMeta,
  type RemotePalaceMeta,
  type SyncAction,
  type SyncBase,
  type SyncPlan,
  type Tombstone,
} from "./syncPlan";
import { foreignIdsFrom, selectShardRows, unionById } from "./streamMerge";
import {
  fromBase64,
  openVaultFile,
  parseVaultDescriptor,
  sealVaultFile,
  toBase64,
  VaultPassphraseError,
  verifyVaultKey,
} from "./vaultCrypto";
import { parseHeaderLine, VaultFormatError, type VaultHeader } from "./vaultFile";

/**
 * Where the conflict rule meets the filesystem.
 *
 * Deliberately split into scan → plan → apply. The plan is built and shown before anything
 * is written, and conflicts block until the user has chosen a side for each. That split is
 * what makes "detect and choose" honest rather than a dialog shown after the damage.
 *
 * Everything is injected, so the two-device test drives the real engine against a memory
 * remote and two in-memory repositories.
 */

export const DEFAULT_STREAM_RETENTION_DAYS = 365;

export type ConflictChoice = "keep-mine" | "take-theirs" | "keep-both";

/** The ciphertext payload of a palace file. The device name lives here, not in the header. */
type PalacePayload = {
  snapshot: PalaceSnapshot;
  name: string;
  deviceId: string;
  deviceName: string;
};

export type VaultScanResult = {
  remote: RemotePalaceMeta[];
  /** Palace ids the vault holds a tombstone for. */
  remoteTombstones: Map<string, VaultHeader>;
  analyticsShards: string[];
  aarShards: string[];
  /** Content hashes of the images already in the vault, so they are uploaded only once. */
  remoteAssets: Set<string>;
  /** Paths that could not be classified or parsed, surfaced rather than silently dropped. */
  skipped: string[];
};

export type SyncReport = {
  pushed: string[];
  pulled: string[];
  deletedLocally: string[];
  deletedRemotely: string[];
  forked: { from: string; to: string }[];
  unresolvedConflicts: string[];
  skipped: string[];
  analyticsPulled: number;
  aarPulled: number;
  assetsPushed: number;
  assetsPulled: number;
};

/**
 * Why a run reclaimed nothing. Both mean "the evidence was incomplete", never "there was
 * nothing to do" — the difference matters, because the second would invite the user to
 * conclude their vault is tidy when it is merely unreadable.
 */
export type GarbageRefusal = "unreadable" | "undownloaded";

export type GarbageReport = {
  /** Images the vault holds. */
  assets: number;
  /** Content hashes deleted. */
  removed: string[];
  reclaimedBytes: number;
  /** Unreferenced images still inside the grace period, left for a later run. */
  keptRecent: number;
  refused: GarbageRefusal | null;
};

/**
 * How long an unreferenced image is left alone before it can be deleted. Sized for a
 * folder-sync client replicating a palace and its images independently, with a wide margin:
 * the window that matters is minutes, and a week costs only disk space.
 */
export const ASSET_GRACE_DAYS = 7;

export type SyncStateStore = {
  load(): Promise<{
    states: SyncBase[];
    tombstones: Tombstone[];
    foreignAnalyticsIds: string[];
    foreignAarIds: string[];
  }>;
  apply(patch: {
    states?: SyncBase[];
    tombstones?: Tombstone[];
    /**
     * Tombstones to forget. Needed because a tombstone otherwise keeps asserting "deleted
     * here" for ever: resolving a delete-versus-edit conflict in the remote's favour would
     * restore the palace, and the very next sync would delete it again.
     */
    clearedTombstones?: string[];
    foreignAnalyticsIds?: string[];
    foreignAarIds?: string[];
  }): Promise<void>;
};

export type VaultSyncDeps = {
  remote: VaultRemote;
  dir: string;
  key: CryptoKey;
  repo: PalaceRepository;
  syncState: SyncStateStore;
  assets: AssetStore;
  aar: { load(): AARRecord[]; saveAll(records: AARRecord[]): void };
  deviceId: string;
  deviceName: string;
  now?: () => Date;
  streamRetentionDays?: number;
  /** Overridable so the grace period can be exercised without waiting a week. */
  assetGraceDays?: number;
};

export function createVaultSyncEngine(deps: VaultSyncDeps) {
  const now = deps.now ?? (() => new Date());
  const retentionDays = deps.streamRetentionDays ?? DEFAULT_STREAM_RETENTION_DAYS;
  const retentionMs = (deps.assetGraceDays ?? ASSET_GRACE_DAYS) * 24 * 60 * 60 * 1000;

  async function scan(): Promise<VaultScanResult> {
    const entries = await deps.remote.scan(deps.dir);
    const remote: RemotePalaceMeta[] = [];
    const remoteTombstones = new Map<string, VaultHeader>();
    const analyticsShards: string[] = [];
    const aarShards: string[] = [];
    const remoteAssets = new Set<string>();
    const skipped: string[] = [];

    for (const entry of entries) {
      const info = classifyVaultPath(entry.relPath);
      if (!info) continue;
      const header = entry.headerLine ? parseHeaderLine(entry.headerLine) : null;

      if (info.kind === "palace") {
        if (!header) {
          // Unreadable, not absent. The plan turns this into "skip and report"; treating it
          // as missing would look like a brand-new palace and re-push over a real one.
          remote.push({ palaceId: info.palaceId, rev: 0, contentHash: "", unreadable: true });
          skipped.push(entry.relPath);
          continue;
        }
        remote.push({
          palaceId: info.palaceId,
          rev: header.rev,
          contentHash: header.contentHash,
        });
      } else if (info.kind === "tombstone") {
        if (header) remoteTombstones.set(info.palaceId, header);
        else skipped.push(entry.relPath);
      } else if (info.kind === "analytics") {
        if (info.deviceId !== deps.deviceId) analyticsShards.push(entry.relPath);
      } else if (info.kind === "aar") {
        if (info.deviceId !== deps.deviceId) aarShards.push(entry.relPath);
      } else if (info.kind === "asset") {
        remoteAssets.add(info.contentHash);
      }
    }

    return { remote, remoteTombstones, analyticsShards, aarShards, remoteAssets, skipped };
  }

  /**
   * Rewrites a palace's image references into vault form, and reports where each image can
   * be read from should it need uploading.
   *
   * This happens *before* hashing, not at push time, and that ordering is load-bearing. The
   * content hash has to mean the same thing on every device, and a local image path does
   * not: two machines holding the identical palace would hash differently, each would see
   * the other as changed, and the pair would push back and forth for ever. Hashing the
   * portable form — where an image is its own content hash — makes them agree.
   *
   * Reading bytes is only paid for by palaces that actually contain images, and the per-run
   * cache means an image shared by several palaces is hashed once.
   */
  const hashByLocalPath = new Map<string, string>();

  async function toPortable(
    snapshot: PalaceSnapshot,
  ): Promise<{ portable: PalaceSnapshot; sources: Map<string, string> }> {
    const refs = collectLocalAssets(snapshot);
    if (refs.length === 0) return { portable: snapshot, sources: new Map() };

    const hashByValue = new Map<string, string>();
    const sources = new Map<string, string>();
    for (const ref of refs) {
      let hash = hashByLocalPath.get(ref.localPath);
      if (!hash) {
        const file = await deps.assets.read(ref.localPath);
        // An image whose file has gone is left referring to where it always did, rather
        // than being erased from the palace.
        if (!file) continue;
        hash = await hashBytes(file.bytes);
        hashByLocalPath.set(ref.localPath, hash);
      }
      hashByValue.set(ref.value, hash);
      sources.set(hash, ref.localPath);
    }
    return { portable: portableizeAssets(snapshot, hashByValue), sources };
  }

  /** Turns vault image references back into files on this device. */
  async function toLocal(snapshot: PalaceSnapshot, report: SyncReport): Promise<PalaceSnapshot> {
    const hashes = collectVaultAssetHashes(snapshot);
    if (hashes.length === 0) return snapshot;

    const refByHash = new Map<string, { path: string; url: string }>();
    for (const hash of hashes) {
      const existing = await deps.assets.locate(hash);
      if (existing) {
        refByHash.set(hash, existing);
        continue;
      }
      const relPath = vaultPaths.asset(hash);
      try {
        const text = await deps.remote.read(deps.dir, relPath);
        if (!text) {
          if (!report.skipped.includes(relPath)) report.skipped.push(relPath);
          continue;
        }
        const opened = await openVaultFile<{ mimeType: string; bytesBase64: string }>(deps.key, text);
        const ref = await deps.assets.write(hash, {
          bytes: fromBase64(opened.payload.bytesBase64),
          mimeType: opened.payload.mimeType,
        });
        refByHash.set(hash, ref);
        report.assetsPulled += 1;
      } catch {
        // The palace still lands; the picture is missing until the file downloads.
        if (!report.skipped.includes(relPath)) report.skipped.push(relPath);
      }
    }
    return localizeAssets(snapshot, refByHash);
  }

  /** Uploads the images a palace needs, skipping any the vault already holds. */
  async function pushAssets(
    sources: Map<string, string>,
    remoteAssets: Set<string>,
    report: SyncReport,
  ) {
    for (const [hash, localPath] of sources) {
      if (remoteAssets.has(hash)) continue;
      const file = await deps.assets.read(localPath);
      if (!file) continue;
      const sealed = await sealVaultFile(
        deps.key,
        {
          kind: "asset",
          rev: 0,
          updatedAt: now().toISOString(),
          contentHash: hash,
          writerDeviceId: deps.deviceId,
        },
        // The media type travels inside the ciphertext, so the vault does not even reveal
        // what kind of file each asset is.
        { mimeType: file.mimeType, bytesBase64: toBase64(file.bytes) },
      );
      await deps.remote.write(deps.dir, vaultPaths.asset(hash), sealed);
      remoteAssets.add(hash);
      report.assetsPushed += 1;
    }
  }

  /**
   * Local metadata for every palace, trashed ones included — a delete has to propagate.
   * The snapshots handed back are in portable form, which is what both the hash and any
   * subsequent push are built from.
   */
  async function localMeta(): Promise<{
    meta: LocalPalaceMeta[];
    snapshots: Map<string, PalaceSnapshot>;
    assetSources: Map<string, Map<string, string>>;
  }> {
    const palaces = [...(await deps.repo.listPalaces()), ...(await deps.repo.listTrashedPalaces())];
    const meta: LocalPalaceMeta[] = [];
    const snapshots = new Map<string, PalaceSnapshot>();
    const assetSources = new Map<string, Map<string, string>>();

    for (const palace of palaces) {
      const snapshot = await loadAnyPalace(palace.id);
      if (!snapshot) continue;
      const { portable, sources } = await toPortable(snapshot);
      snapshots.set(palace.id, portable);
      assetSources.set(palace.id, sources);
      meta.push({
        palaceId: palace.id,
        name: palace.name,
        rev: palace.rev ?? 0,
        contentHash: await palaceContentHash(portable),
      });
    }
    return { meta, snapshots, assetSources };
  }

  async function hashBytes(bytes: Uint8Array): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /** `loadPalace` hides trashed palaces, but a trashed palace still has to sync. */
  async function loadAnyPalace(palaceId: string): Promise<PalaceSnapshot | null> {
    const direct = await deps.repo.loadPalace(palaceId);
    if (direct) return direct;
    const trashed = (await deps.repo.listTrashedPalaces()).find((p) => p.id === palaceId);
    if (!trashed) return null;
    await deps.repo.restorePalace(palaceId);
    const snapshot = await deps.repo.loadPalace(palaceId);
    await deps.repo.softDeletePalace(palaceId);
    if (!snapshot) return null;
    return { ...snapshot, palace: { ...snapshot.palace, deletedAt: trashed.deletedAt ?? null } };
  }

  /**
   * Confirms the key belongs to this vault before anything else happens. Without it, a wrong
   * passphrase would make every palace fail to decrypt, each one would be skipped as a
   * damaged file, and the run would cheerfully report an empty, quiet vault.
   */
  async function assertKeyMatchesVault() {
    const text = await deps.remote.read(deps.dir, VAULT_DESCRIPTOR_PATH);
    if (!text) return; // A vault that has not been created yet has nothing to verify against.
    const descriptor = parseVaultDescriptor(text);
    if (!descriptor) throw new VaultFormatError("The vault descriptor is unreadable.");
    if (!(await verifyVaultKey(deps.key, descriptor))) {
      throw new VaultPassphraseError("Wrong passphrase for this vault.");
    }
  }

  async function plan(): Promise<{
    plan: SyncPlan;
    scanned: VaultScanResult;
    snapshots: Map<string, PalaceSnapshot>;
    assetSources: Map<string, Map<string, string>>;
    localByHash: Map<string, LocalPalaceMeta>;
    /** This device's own tombstones, as distinct from ones read out of the vault. */
    ownTombstones: Tombstone[];
  }> {
    await assertKeyMatchesVault();
    const scanned = await scan();
    const { meta, snapshots, assetSources } = await localMeta();
    const state = await deps.syncState.load();

    // A tombstone in the vault counts alongside our own: another device purged it.
    const tombstones: Tombstone[] = [...state.tombstones];
    for (const [palaceId, header] of scanned.remoteTombstones) {
      if (!tombstones.some((t) => t.palaceId === palaceId)) {
        tombstones.push({ palaceId, deletedAt: header.updatedAt, rev: header.rev });
      }
    }

    return {
      plan: planSync({ local: meta, remote: scanned.remote, base: state.states, tombstones }),
      scanned,
      snapshots,
      assetSources,
      localByHash: new Map(meta.map((m) => [m.palaceId, m])),
      ownTombstones: state.tombstones,
    };
  }

  /**
   * Returns null for anything unreadable — a file a sync client is still writing, a
   * corrupted body, a read that failed. One bad palace must not abort the run: the rest of
   * the plan still applies and the bad one is reported and retried next time.
   *
   * The deliberate exception is a wrong key. If the vault cannot be decrypted at all, that
   * is not one damaged palace, it is the wrong passphrase, and pressing on would quietly
   * report "nothing to do" for a vault full of data.
   */
  async function readPalacePayload(palaceId: string): Promise<PalacePayload | null> {
    let text: string | null;
    try {
      text = await deps.remote.read(deps.dir, vaultPaths.palace(palaceId));
    } catch {
      return null;
    }
    if (!text) return null;
    try {
      const opened = await openVaultFile<PalacePayload>(deps.key, text);
      return opened.payload;
    } catch {
      return null;
    }
  }

  async function writePalace(snapshot: PalaceSnapshot, rev: number, contentHash: string) {
    const payload: PalacePayload = {
      snapshot,
      name: snapshot.palace.name,
      deviceId: deps.deviceId,
      deviceName: deps.deviceName,
    };
    const file = await sealVaultFile(
      deps.key,
      {
        kind: "palace",
        palaceId: snapshot.palace.id,
        rev,
        updatedAt: now().toISOString(),
        contentHash,
        writerDeviceId: deps.deviceId,
      },
      payload,
    );
    await deps.remote.write(deps.dir, vaultPaths.palace(snapshot.palace.id), file);
  }

  async function apply(
    built: Awaited<ReturnType<typeof plan>>,
    choices: Map<string, ConflictChoice> = new Map(),
  ): Promise<SyncReport> {
    const report: SyncReport = {
      pushed: [],
      pulled: [],
      deletedLocally: [],
      deletedRemotely: [],
      forked: [],
      unresolvedConflicts: [],
      skipped: [...built.scanned.skipped],
      analyticsPulled: 0,
      aarPulled: 0,
      assetsPushed: 0,
      assetsPulled: 0,
    };
    const states: SyncBase[] = [];
    const clearedTombstones: string[] = [];

    for (const action of built.plan.actions) {
      const resolved = resolveAction(action, choices, (id) => built.localByHash.has(id));
      if (!resolved) {
        report.unresolvedConflicts.push(action.palaceId);
        continue;
      }
      // Taking the remote's side of a delete-versus-edit argument has to retract our own
      // tombstone. Leaving it would restore the palace now and delete it again on the next
      // run, quietly undoing what the user just chose. Only our own is retracted: a
      // tombstone read from the vault is another device's statement, not ours to withdraw.
      if (
        action.kind === "conflict" &&
        resolved.kind !== "push-delete" &&
        built.ownTombstones.some((t) => t.palaceId === action.palaceId)
      ) {
        clearedTombstones.push(action.palaceId);
      }
      await runAction(resolved, built, report, states, choices);
    }

    await syncStreams(built.scanned, report);
    if (states.length > 0 || clearedTombstones.length > 0) {
      await deps.syncState.apply({ states, clearedTombstones });
    }
    return report;
  }

  function resolveAction(
    action: SyncAction,
    choices: Map<string, ConflictChoice>,
    hasLocal: (palaceId: string) => boolean,
  ): SyncAction | null {
    if (action.kind !== "conflict") return action;
    const choice = choices.get(action.palaceId);
    if (!choice) return null;
    if (choice === "keep-mine") {
      // "Mine" is a deletion when the palace is no longer here. Pushing would find nothing
      // to send and silently do nothing, leaving the same conflict to be answered again on
      // every future sync. Presence of the palace, not of a tombstone, is what separates the
      // two cases: a tombstone read from the vault means somebody *else* purged it, and
      // keeping mine then means keeping the copy I still have.
      const stillHere = hasLocal(action.palaceId);
      return { kind: stillHere ? "push" : "push-delete", palaceId: action.palaceId };
    }
    // Both "take theirs" and "keep both" pull; the difference is that "keep both" first
    // saves the local side under a new id, which the pull branch handles by reading the
    // choice back out of the map.
    return { kind: "pull", palaceId: action.palaceId };
  }

  async function runAction(
    action: SyncAction,
    built: Awaited<ReturnType<typeof plan>>,
    report: SyncReport,
    states: SyncBase[],
    choices: Map<string, ConflictChoice>,
  ) {
    const palaceId = action.palaceId;
    const local = built.localByHash.get(palaceId);
    const snapshot = built.snapshots.get(palaceId);
    const remote = built.scanned.remote.find((r) => r.palaceId === palaceId);

    switch (action.kind) {
      case "unreadable":
      case "in-sync":
        return;

      case "converged": {
        if (!local || !remote) return;
        states.push(agree(palaceId, local.rev, local.contentHash, remote.rev, remote.contentHash));
        return;
      }

      case "push":
      case "push-new": {
        if (!local || !snapshot) return;
        // Images first: a palace whose file lands before its pictures do would show a
        // broken background on the other device until the next run.
        await pushAssets(
          built.assetSources.get(palaceId) ?? new Map(),
          built.scanned.remoteAssets,
          report,
        );
        const rev = Math.max(local.rev, remote?.rev ?? 0) + 1;
        await writePalace(snapshot, rev, local.contentHash);
        report.pushed.push(palaceId);
        states.push(agree(palaceId, local.rev, local.contentHash, rev, local.contentHash));
        return;
      }

      case "pull":
      case "pull-new": {
        const payload = await readPalacePayload(palaceId);
        if (!payload) {
          // Unreadable right now. Report it, leave the local palace exactly as it is, and
          // let the next run pick it up once the file is whole.
          const path = vaultPaths.palace(palaceId);
          if (!report.skipped.includes(path)) report.skipped.push(path);
          return;
        }

        // "Keep both" saves the local side under a new id first, so nothing is lost before
        // the remote overwrites the original. The local copy forks, not the remote one: the
        // remote id is what every other device already knows.
        if (choices.get(palaceId) === "keep-both" && snapshot) {
          // Fork the palace as it stands on this device, not the portable form held in
          // `built.snapshots`. That one has every image rewritten to `mpvault://<hash>` for
          // the vault's benefit; saving it here would leave the copy pointing at references
          // this device cannot draw, so the kept-both palace would open with no pictures
          // even though the files are sitting on disk.
          const mine = (await loadAnyPalace(palaceId)) ?? snapshot;
          const fork = forkPalaceSnapshot(mine, {
            newId: crypto.randomUUID(),
            newName: `${mine.palace.name} (from ${deps.deviceName})`,
          });
          await deps.repo.savePalace(fork);
          report.forked.push({ from: palaceId, to: fork.palace.id });
        }

        // Save the localized form — the vault's image references mean nothing here — but
        // hash the portable one, so this device agrees with every other on what the palace
        // contains.
        const localized = await toLocal(payload.snapshot, report);
        await deps.repo.savePalace(localized);
        if (payload.snapshot.palace.deletedAt) await deps.repo.softDeletePalace(palaceId);
        report.pulled.push(palaceId);

        // Read the revision back: savePalace bumped it, and the base has to describe the
        // row that now exists rather than the one we started from.
        const hash = await palaceContentHash(payload.snapshot);
        const landed = (await deps.repo.listPalaces()).find((p) => p.id === palaceId);
        states.push(
          agree(palaceId, landed?.rev ?? 0, hash, remote?.rev ?? 0, remote?.contentHash ?? hash),
        );
        return;
      }

      case "pull-delete": {
        await deps.repo.purgePalace(palaceId);
        report.deletedLocally.push(palaceId);
        return;
      }

      case "push-delete": {
        const tombstone = await sealVaultFile(
          deps.key,
          {
            kind: "tombstone",
            palaceId,
            rev: (remote?.rev ?? 0) + 1,
            updatedAt: now().toISOString(),
            contentHash: "",
            writerDeviceId: deps.deviceId,
          },
          { palaceId, deletedAt: now().toISOString() },
        );
        await deps.remote.write(deps.dir, vaultPaths.tombstone(palaceId), tombstone);
        await deps.remote.remove(deps.dir, vaultPaths.palace(palaceId));
        report.deletedRemotely.push(palaceId);
        return;
      }

      case "conflict":
        report.unresolvedConflicts.push(palaceId);
        return;
    }
  }

  /**
   * Records what this device now agrees with the vault on.
   *
   * The MCP server and the CLI write the same database, so one of them can commit between
   * the moment a palace is read and the moment it is pushed. That race is harmless *because
   * the agreement is recorded by content hash rather than by revision*: `baseHash` is the
   * hash of what was actually pushed, so a concurrent edit leaves the local content
   * differing from it, and the next run correctly classifies the palace as changed here.
   *
   * It would not be harmless with a revision-based base, which would record "local is at
   * rev N" for a revision that already includes someone else's edit — making that edit look
   * synced and stopping it from ever pushing. That is the reason for hashing.
   */
  function agree(
    palaceId: string,
    baseRev: number,
    baseHash: string,
    remoteRev: number,
    remoteHash: string,
  ): SyncBase {
    return { palaceId, baseRev, baseHash, remoteRev, remoteHash };
  }

  async function syncStreams(scanned: VaultScanResult, report: SyncReport) {
    const state = await deps.syncState.load();

    // Analytics
    const localEvents = await deps.repo.listAnalyticsEvents();
    const incomingEvents: AnalyticsEvent[] = [];
    for (const relPath of scanned.analyticsShards) {
      const text = await deps.remote.read(deps.dir, relPath);
      if (!text) continue;
      try {
        const opened = await openVaultFile<{ rows: AnalyticsEvent[] }>(deps.key, text);
        incomingEvents.push(...opened.payload.rows);
      } catch {
        report.skipped.push(relPath);
      }
    }
    const newEvents = incomingEvents.filter(
      (event) => !localEvents.some((existing) => existing.id === event.id),
    );
    if (newEvents.length > 0) {
      await deps.repo.appendAnalyticsEvents(newEvents);
      report.analyticsPulled = newEvents.length;
    }

    const foreignAnalytics = new Set([...state.foreignAnalyticsIds, ...foreignIdsFrom(incomingEvents)]);
    await writeShard(
      vaultPaths.analyticsShard(deps.deviceId),
      selectShardRows(unionById(localEvents, newEvents), foreignAnalytics, {
        retentionDays: retentionDays,
        now: now(),
      }),
      "analytics",
    );

    // AAR records
    const localAar = deps.aar.load();
    const incomingAar: AARRecord[] = [];
    for (const relPath of scanned.aarShards) {
      const text = await deps.remote.read(deps.dir, relPath);
      if (!text) continue;
      try {
        const opened = await openVaultFile<{ rows: AARRecord[] }>(deps.key, text);
        incomingAar.push(...opened.payload.rows);
      } catch {
        report.skipped.push(relPath);
      }
    }
    const mergedAar = unionById(localAar, incomingAar);
    report.aarPulled = mergedAar.length - localAar.length;
    if (report.aarPulled > 0) deps.aar.saveAll(mergedAar);

    const foreignAar = new Set([...state.foreignAarIds, ...foreignIdsFrom(incomingAar)]);
    await writeShard(
      vaultPaths.aarShard(deps.deviceId),
      selectShardRows(mergedAar, foreignAar, { retentionDays, now: now() }),
      "aar",
    );

    await deps.syncState.apply({
      foreignAnalyticsIds: foreignIdsFrom(incomingEvents),
      foreignAarIds: foreignIdsFrom(incomingAar),
    });
  }

  /**
   * Writes a shard only when its contents changed. Without this check every sync rewrites
   * every shard, every peer then sees a new file, and "Sync now" never reports a quiet vault.
   */
  async function writeShard(
    relPath: string,
    rows: { id: string }[],
    kind: "analytics" | "aar",
  ) {
    const contentHash = await hashRows(rows);
    const existing = await deps.remote.read(deps.dir, relPath);
    if (existing) {
      const header = parseHeaderLine(existing.slice(0, Math.max(existing.indexOf("\n"), 0)));
      if (header?.contentHash === contentHash) return;
    }
    const file = await sealVaultFile(
      deps.key,
      {
        kind,
        rev: rows.length,
        updatedAt: now().toISOString(),
        contentHash,
        writerDeviceId: deps.deviceId,
      },
      { rows },
    );
    await deps.remote.write(deps.dir, relPath, file);
  }

  async function hashRows(rows: { id: string }[]): Promise<string> {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(JSON.stringify(rows)),
    );
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /**
   * Deletes images in the vault that no palace refers to any more — what is left behind when
   * a palace is purged, or when its background is replaced.
   *
   * Deleting is irreversible and the vault is the only copy those bytes have in common, so
   * the whole of this function is a safety argument:
   *
   *  - **An unreadable file means stop.** A palace that could not be parsed might refer to
   *    anything, so its images cannot be told from rubbish. The same goes for a vault still
   *    downloading: an `.icloud` placeholder is not even listed, so its references are
   *    invisible. Either one abandons the run rather than deleting on partial evidence.
   *  - **Recently written images are left alone.** A folder-sync client replicates files
   *    independently, so another device's new palace and its images arrive separately and in
   *    no fixed order. An image can sit here for minutes looking unreferenced simply because
   *    the palace that needs it has not landed yet. The grace period covers that window with
   *    room to spare.
   *  - **Local palaces count too.** A palace pulled before its image finished downloading
   *    still says `mpvault://<hash>`, waiting. Deleting that hash would strand it for good.
   *  - **Nothing on this device is touched**, only the vault. Any device that still holds a
   *    palace using an image re-uploads it on its next push, because `pushAssets` sends
   *    whatever the vault is missing.
   */
  async function collectGarbage(): Promise<GarbageReport> {
    const scanned = await scan();
    const probe = await deps.remote.probe(deps.dir);

    const report: GarbageReport = {
      assets: scanned.remoteAssets.size,
      removed: [],
      reclaimedBytes: 0,
      keptRecent: 0,
      refused: null,
    };

    if (scanned.skipped.length > 0) {
      report.refused = "unreadable";
      return report;
    }
    if (probe.undownloadedFiles > 0) {
      report.refused = "undownloaded";
      return report;
    }

    const referenced = new Set<string>();
    for (const remote of scanned.remote) {
      const payload = await readPalacePayload(remote.palaceId);
      if (!payload) {
        // It listed cleanly a moment ago and will not open now. Something is changing under
        // us; that is not a moment to be deleting things.
        report.refused = "unreadable";
        return report;
      }
      for (const hash of collectVaultAssetHashes(payload.snapshot)) referenced.add(hash);
    }
    for (const palace of [
      ...(await deps.repo.listPalaces()),
      ...(await deps.repo.listTrashedPalaces()),
    ]) {
      const snapshot = await deps.repo.loadPalace(palace.id);
      if (!snapshot) continue;
      for (const hash of collectVaultAssetHashes(snapshot)) referenced.add(hash);
    }

    const cutoff = now().getTime() - retentionMs;
    const sizeByHash = new Map<string, { size: number; modifiedMs: number | null }>();
    for (const entry of await deps.remote.scan(deps.dir)) {
      const info = classifyVaultPath(entry.relPath);
      if (info?.kind === "asset") {
        sizeByHash.set(info.contentHash, {
          size: entry.size,
          modifiedMs: entry.modifiedMs ?? null,
        });
      }
    }

    for (const hash of scanned.remoteAssets) {
      if (referenced.has(hash)) continue;
      const meta = sizeByHash.get(hash);
      // An unknown age is treated as new. Guessing "old" here would delete on the strength
      // of a filesystem that declined to answer.
      if (meta?.modifiedMs == null || meta.modifiedMs > cutoff) {
        report.keptRecent += 1;
        continue;
      }
      await deps.remote.remove(deps.dir, vaultPaths.asset(hash));
      report.removed.push(hash);
      report.reclaimedBytes += meta.size;
    }

    return report;
  }

  return { scan, plan, apply, conflictsOf, collectGarbage };
}
