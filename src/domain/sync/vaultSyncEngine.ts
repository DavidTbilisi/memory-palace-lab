import type { AnalyticsEvent, PalaceSnapshot } from "../entities/types";
import type { PalaceRepository } from "../repositories/palaceRepository";
import type { AARRecord } from "../services/cast/aarRecords";
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
  openVaultFile,
  parseVaultDescriptor,
  sealVaultFile,
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
};

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
  aar: { load(): AARRecord[]; saveAll(records: AARRecord[]): void };
  deviceId: string;
  deviceName: string;
  now?: () => Date;
  streamRetentionDays?: number;
};

export function createVaultSyncEngine(deps: VaultSyncDeps) {
  const now = deps.now ?? (() => new Date());
  const retentionDays = deps.streamRetentionDays ?? DEFAULT_STREAM_RETENTION_DAYS;

  async function scan(): Promise<VaultScanResult> {
    const entries = await deps.remote.scan(deps.dir);
    const remote: RemotePalaceMeta[] = [];
    const remoteTombstones = new Map<string, VaultHeader>();
    const analyticsShards: string[] = [];
    const aarShards: string[] = [];
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
      }
    }

    return { remote, remoteTombstones, analyticsShards, aarShards, skipped };
  }

  /** Local metadata for every palace, trashed ones included — a delete has to propagate. */
  async function localMeta(): Promise<{ meta: LocalPalaceMeta[]; snapshots: Map<string, PalaceSnapshot> }> {
    const palaces = [...(await deps.repo.listPalaces()), ...(await deps.repo.listTrashedPalaces())];
    const meta: LocalPalaceMeta[] = [];
    const snapshots = new Map<string, PalaceSnapshot>();

    for (const palace of palaces) {
      const snapshot = await loadAnyPalace(palace.id);
      if (!snapshot) continue;
      snapshots.set(palace.id, snapshot);
      meta.push({
        palaceId: palace.id,
        name: palace.name,
        rev: palace.rev ?? 0,
        contentHash: await palaceContentHash(snapshot),
      });
    }
    return { meta, snapshots };
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
    localByHash: Map<string, LocalPalaceMeta>;
  }> {
    await assertKeyMatchesVault();
    const scanned = await scan();
    const { meta, snapshots } = await localMeta();
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
      localByHash: new Map(meta.map((m) => [m.palaceId, m])),
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
    };
    const states: SyncBase[] = [];

    for (const action of built.plan.actions) {
      const resolved = resolveAction(action, choices);
      if (!resolved) {
        report.unresolvedConflicts.push(action.palaceId);
        continue;
      }
      await runAction(resolved, built, report, states, choices);
    }

    await syncStreams(built.scanned, report);
    if (states.length > 0) await deps.syncState.apply({ states });
    return report;
  }

  function resolveAction(
    action: SyncAction,
    choices: Map<string, ConflictChoice>,
  ): SyncAction | null {
    if (action.kind !== "conflict") return action;
    const choice = choices.get(action.palaceId);
    if (!choice) return null;
    if (choice === "keep-mine") return { kind: "push", palaceId: action.palaceId };
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
          const fork = forkPalaceSnapshot(snapshot, {
            newId: crypto.randomUUID(),
            newName: `${snapshot.palace.name} (from ${deps.deviceName})`,
          });
          await deps.repo.savePalace(fork);
          report.forked.push({ from: palaceId, to: fork.palace.id });
        }

        await deps.repo.savePalace(payload.snapshot);
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

  return { scan, plan, apply, conflictsOf };
}
