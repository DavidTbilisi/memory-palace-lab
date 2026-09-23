import { beforeEach, describe, expect, it } from "vitest";
import type { PalaceSnapshot } from "../entities/types";
import type { PalaceRepository } from "../repositories/palaceRepository";
import type { AARRecord } from "../services/cast/aarRecords";
import { createInMemoryPalaceRepository } from "../../infrastructure/memory/inMemoryPalaceRepository";
import { createMemoryVaultRemote, type MemoryVaultRemote } from "../../infrastructure/sync/memoryVaultRemote";
import {
  createMemoryAssetStore,
  type MemoryAssetStore,
} from "../../infrastructure/sync/memoryAssetStore";
import { createVaultDescriptor, unlockVault } from "./vaultCrypto";
import { VAULT_DESCRIPTOR_PATH, vaultPaths } from "../repositories/vaultRemote";
import {
  createVaultSyncEngine,
  type ConflictChoice,
  type SyncStateStore,
} from "./vaultSyncEngine";

/**
 * Two engines over one vault: a genuine two-device simulation with no Tauri and no
 * filesystem. This is where the design is proven or found wanting.
 */

const DIR = "/vault";

function memorySyncState(): SyncStateStore {
  let states: Awaited<ReturnType<SyncStateStore["load"]>>["states"] = [];
  let tombstones: Awaited<ReturnType<SyncStateStore["load"]>>["tombstones"] = [];
  let foreignAnalyticsIds: string[] = [];
  let foreignAarIds: string[] = [];

  return {
    async load() {
      return { states, tombstones, foreignAnalyticsIds, foreignAarIds };
    },
    async apply(patch) {
      if (patch.states) {
        const byId = new Map(states.map((s) => [s.palaceId, s]));
        for (const state of patch.states) byId.set(state.palaceId, state);
        states = [...byId.values()];
      }
      if (patch.tombstones) {
        const byId = new Map(tombstones.map((t) => [t.palaceId, t]));
        for (const t of patch.tombstones) byId.set(t.palaceId, t);
        tombstones = [...byId.values()];
      }
      if (patch.foreignAnalyticsIds) {
        foreignAnalyticsIds = [...new Set([...foreignAnalyticsIds, ...patch.foreignAnalyticsIds])];
      }
      if (patch.foreignAarIds) {
        foreignAarIds = [...new Set([...foreignAarIds, ...patch.foreignAarIds])];
      }
    },
  };
}

type Device = {
  name: string;
  repo: PalaceRepository;
  aarRecords: AARRecord[];
  syncState: SyncStateStore;
  assets: MemoryAssetStore;
  engine: ReturnType<typeof createVaultSyncEngine>;
  sync(choices?: Map<string, ConflictChoice>): Promise<Awaited<ReturnType<ReturnType<typeof createVaultSyncEngine>["apply"]>>>;
};

function makeDevice(name: string, remote: MemoryVaultRemote, key: CryptoKey): Device {
  const repo = createInMemoryPalaceRepository();
  const syncState = memorySyncState();
  // Each device keeps its images under its own root, so a path from one means nothing on
  // the other — which is the whole reason asset syncing exists.
  const assets = createMemoryAssetStore(`/${name}/backgrounds`);
  const device: Device = {
    name,
    repo,
    aarRecords: [],
    syncState,
    assets,
    engine: null as never,
    async sync(choices) {
      const built = await device.engine.plan();
      return device.engine.apply(built, choices);
    },
  };
  device.engine = createVaultSyncEngine({
    remote,
    dir: DIR,
    key,
    repo,
    syncState,
    assets,
    aar: {
      load: () => device.aarRecords,
      saveAll: (records) => {
        device.aarRecords = records;
      },
    },
    deviceId: `device-${name}`,
    deviceName: name,
  });
  return device;
}

/** Puts a background image on a device and points the palace's canvas at it. */
async function addBackground(
  device: Device,
  palaceId: string,
  bytes: Uint8Array,
): Promise<string> {
  const localPath = `/${device.name}/backgrounds/${crypto.randomUUID()}.png`;
  device.assets.seed(localPath, { bytes, mimeType: "image/png" });

  const snapshot = await device.repo.loadPalace(palaceId);
  if (!snapshot) throw new Error("missing palace");
  const blob = JSON.parse(snapshot.palace.editorSnapshot!);
  blob.store["asset:bg"] = {
    id: "asset:bg",
    typeName: "asset",
    props: { src: `asset://localhost${localPath}` },
  };
  blob.store["shape:bg"] = {
    id: "shape:bg",
    meta: { mpPalaceId: palaceId, mpBackground: true, mpBackgroundAssetPath: localPath },
  };
  snapshot.palace.editorSnapshot = JSON.stringify(blob);
  await device.repo.savePalace(snapshot);
  return localPath;
}

/** A palace with a route, a stop carrying an SM-2 schedule, and a canvas blob. */
async function seedPalace(device: Device, name: string, blobX = 1): Promise<PalaceSnapshot> {
  const palace = await device.repo.createPalace(name);
  // Row ids are unique across the whole database, not per palace, so a fixture that reused
  // "route-1" could never exist on a real device — and would mask a fork that reuses ids.
  const routeId = `route-${palace.id}`;
  const snapshot: PalaceSnapshot = {
    palace: {
      ...palace,
      editorSnapshot: JSON.stringify({
        store: { "shape:a": { meta: { mpPalaceId: palace.id, mpNodeId: `node-${palace.id}` } } },
        schema: { x: blobX },
      }),
    },
    canvasObjects: [],
    nodes: [],
    edges: [],
    routes: [{ id: routeId, palaceId: palace.id, name: "Main" }],
    loci: [
      {
        id: `locus-${palace.id}`,
        routeId,
        nodeId: `node-${palace.id}`,
        orderIndex: 0,
        label: "first",
        interval: 6,
        easeFactor: 2.6,
        nextReviewAt: "2026-10-01T00:00:00.000Z",
        repetitions: 3,
        lastReviewedAt: "2026-09-25T00:00:00.000Z",
      },
    ],
  };
  await device.repo.savePalace(snapshot);
  return snapshot;
}

async function editBlob(device: Device, palaceId: string, x: number) {
  const snapshot = await device.repo.loadPalace(palaceId);
  if (!snapshot) throw new Error("missing palace");
  snapshot.palace.editorSnapshot = JSON.stringify({
    store: { "shape:a": { meta: { mpPalaceId: palaceId, mpNodeId: `node-${palaceId}` } } },
    schema: { x },
  });
  await device.repo.savePalace(snapshot);
}

describe("vaultSyncEngine (two devices, one vault)", () => {
  let remote: MemoryVaultRemote;
  let key: CryptoKey;
  let a: Device;
  let b: Device;

  beforeEach(async () => {
    // The repositories persist to localStorage, which is shared across the whole file, so
    // without this a palace seeded in one test reappears in the next one's "devices".
    window.localStorage.clear();
    remote = createMemoryVaultRemote();
    // Connecting to a vault means creating (or reading) its descriptor, then deriving the
    // key from the passphrase. Both devices go through the same door.
    const created = await createVaultDescriptor("shared passphrase");
    remote.seed(VAULT_DESCRIPTOR_PATH, JSON.stringify(created.descriptor));
    key = (await unlockVault("shared passphrase", created.descriptor))!;
    a = makeDevice("Laptop", remote, key);
    b = makeDevice("Desktop", remote, key);
  });

  it("gives each simulated device its own storage", async () => {
    // The whole suite is meaningless if the two repositories share state, and they are
    // isolated by a property of the adapter rather than by design — each snapshots
    // localStorage once at construction and then caches in memory, and jsdom has no
    // IndexedDB. Assert it, so the day that changes this fails loudly instead of every test
    // below passing for the wrong reason. (The corollary, and why beforeEach clears
    // localStorage: a repository built *after* another has written inherits that state.)
    await seedPalace(a, "Only on A");
    expect((await b.repo.listPalaces()).map((p) => p.name)).toEqual([]);
  });

  it("carries a palace and its review schedule from one device to the other", async () => {
    const seeded = await seedPalace(a, "Palace of Memory");
    const pushReport = await a.sync();
    expect(pushReport.pushed).toEqual([seeded.palace.id]);

    const pullReport = await b.sync();
    expect(pullReport.pulled).toEqual([seeded.palace.id]);

    const landed = await b.repo.loadPalace(seeded.palace.id);
    expect(landed?.palace.name).toBe("Palace of Memory");
    expect(landed?.routes).toHaveLength(1);
    // The SM-2 fields are the point: your schedule follows you between machines.
    expect(landed?.loci[0]).toMatchObject({
      interval: 6,
      easeFactor: 2.6,
      repetitions: 3,
      nextReviewAt: "2026-10-01T00:00:00.000Z",
    });
  });

  it("settles: a second sync on both devices writes nothing", async () => {
    await seedPalace(a, "Settled");
    await a.sync();
    await b.sync();

    const writesBefore = remote.writeCount;
    const againA = await a.sync();
    const againB = await b.sync();

    expect(againA.pushed).toEqual([]);
    expect(againA.pulled).toEqual([]);
    expect(againB.pushed).toEqual([]);
    expect(againB.pulled).toEqual([]);
    expect(remote.writeCount).toBe(writesBefore);
  });

  it("stores nothing readable in the vault", async () => {
    await seedPalace(a, "Very Secret Palace");
    await a.sync();

    const everything = [...remote.files.values()].join("\n");
    expect(everything).not.toContain("Very Secret Palace");
    expect(everything).not.toContain("shared passphrase");
  });

  describe("when both devices edit the same palace", () => {
    let palaceId: string;

    beforeEach(async () => {
      const seeded = await seedPalace(a, "Contested");
      palaceId = seeded.palace.id;
      await a.sync();
      await b.sync();

      await editBlob(a, palaceId, 10);
      await editBlob(b, palaceId, 20);
      await a.sync(); // A pushes first; B is now behind with its own changes
    });

    it("raises a conflict instead of silently overwriting", async () => {
      const built = await b.engine.plan();
      const conflicts = built.plan.actions.filter((x) => x.kind === "conflict");
      expect(conflicts).toEqual([
        { kind: "conflict", palaceId, reason: "both-edited" },
      ]);

      // Applying without a choice must change nothing.
      const report = await b.engine.apply(built);
      expect(report.unresolvedConflicts).toEqual([palaceId]);
      expect(report.pulled).toEqual([]);
      expect(report.pushed).toEqual([]);
      const untouched = await b.repo.loadPalace(palaceId);
      expect(untouched?.palace.editorSnapshot).toContain('"x":20');
    });

    it("keep mine pushes the local side and wins", async () => {
      await b.sync(new Map([[palaceId, "keep-mine"]]));
      await a.sync();

      const onA = await a.repo.loadPalace(palaceId);
      expect(onA?.palace.editorSnapshot).toContain('"x":20');
    });

    it("take theirs adopts the vault copy", async () => {
      await b.sync(new Map([[palaceId, "take-theirs"]]));

      const onB = await b.repo.loadPalace(palaceId);
      expect(onB?.palace.editorSnapshot).toContain('"x":10');
    });

    it("keep both keeps each side, under separate palaces", async () => {
      const report = await b.sync(new Map([[palaceId, "keep-both"]]));

      expect(report.forked).toHaveLength(1);
      const forkId = report.forked[0].to;
      expect(forkId).not.toBe(palaceId);

      // The original id now holds the vault's copy...
      const original = await b.repo.loadPalace(palaceId);
      expect(original?.palace.editorSnapshot).toContain('"x":10');

      // ...and B's own work survives beside it, under a new id, with its schedule.
      const fork = await b.repo.loadPalace(forkId);
      expect(fork?.palace.editorSnapshot).toContain('"x":20');
      expect(fork?.palace.name).toContain("Desktop");
      expect(fork?.loci[0]).toMatchObject({ interval: 6, repetitions: 3 });

      // The fork's blob must claim the new palace, or the id guard re-ids every shape on the
      // next edit and orphans the loci.
      const meta = JSON.parse(fork!.palace.editorSnapshot!).store["shape:a"].meta;
      expect(meta.mpPalaceId).toBe(forkId);
    });

    it("keep both leaves the copy's pictures readable on this device", async () => {
      // The engine carries a portable form of each palace, with every image rewritten to
      // `mpvault://<hash>` for the vault. Forking that one instead of the palace as it
      // stands here would hand the copy references this device cannot draw, so it would
      // open blank while the files sat on disk.
      const localPath = await addBackground(b, palaceId, new Uint8Array([1, 2, 3, 4]));

      const report = await b.sync(new Map([[palaceId, "keep-both"]]));
      const fork = await b.repo.loadPalace(report.forked[0].to);

      const blob = fork!.palace.editorSnapshot!;
      expect(blob).not.toContain("mpvault://");
      expect(JSON.parse(blob).store["shape:bg"].meta.mpBackgroundAssetPath).toBe(localPath);
    });

    it("converges after the conflict is resolved", async () => {
      await b.sync(new Map([[palaceId, "take-theirs"]]));
      await a.sync();

      const writesBefore = remote.writeCount;
      await a.sync();
      await b.sync();
      expect(remote.writeCount).toBe(writesBefore);
    });
  });

  it("does not resurrect a palace that was purged on the other device", async () => {
    const seeded = await seedPalace(a, "Doomed");
    await a.sync();
    await b.sync();
    expect(await b.repo.loadPalace(seeded.palace.id)).not.toBeNull();

    await a.repo.purgePalace(seeded.palace.id);
    await a.syncState.apply({
      tombstones: [{ palaceId: seeded.palace.id, deletedAt: "2026-09-23T00:00:00.000Z", rev: 99 }],
    });
    await a.sync();

    const report = await b.sync();
    expect(report.deletedLocally).toEqual([seeded.palace.id]);
    expect(await b.repo.loadPalace(seeded.palace.id)).toBeNull();

    // And a later sync must not bring it back from B's side.
    await b.sync();
    await a.sync();
    expect(await a.repo.loadPalace(seeded.palace.id)).toBeNull();
  });

  it("skips a half-written file instead of treating the palace as gone", async () => {
    const kept = await seedPalace(a, "Kept");
    const other = await seedPalace(a, "Other");
    await a.sync();
    await b.sync();

    // A edits both, so B has two real pulls to do.
    await editBlob(a, kept.palace.id, 42);
    await editBlob(a, other.palace.id, 43);
    await a.sync();

    // The sync client is still writing one of them when B reads it.
    remote.truncateNext(vaultPaths.palace(kept.palace.id));

    const report = await b.sync();

    // The damaged one is reported, not silently dropped and not treated as a deletion...
    expect(report.skipped).toContain(vaultPaths.palace(kept.palace.id));
    expect(report.deletedLocally).toEqual([]);
    expect(await b.repo.loadPalace(kept.palace.id)).not.toBeNull();
    // ...while the rest of the plan still applied.
    expect(report.pulled).toEqual([other.palace.id]);
    expect((await b.repo.loadPalace(other.palace.id))?.palace.editorSnapshot).toContain('"x":43');

    // And the next run, with the file whole again, picks it up.
    const recovered = await b.sync();
    expect(recovered.pulled).toEqual([kept.palace.id]);
  });

  it("never deletes local work just because the vault lost a file", async () => {
    const seeded = await seedPalace(a, "Resilient");
    await a.sync();
    await b.sync();

    // Someone empties the vault folder. That is "not pushed yet", never "deleted".
    remote.files.clear();

    const report = await b.sync();
    expect(report.deletedLocally).toEqual([]);
    expect(await b.repo.loadPalace(seeded.palace.id)).not.toBeNull();
    expect(report.pushed).toContain(seeded.palace.id);
  });

  it("merges analytics from both devices and then stops republishing them", async () => {
    await a.repo.appendAnalyticsEvents([
      {
        id: "ev-a1",
        eventType: "palace_created",
        eventGroup: "palace",
        createdAt: "2026-09-20T00:00:00.000Z",
        payloadJson: "{}",
      },
    ]);
    await b.repo.appendAnalyticsEvents([
      {
        id: "ev-b1",
        eventType: "walk_started",
        eventGroup: "review",
        createdAt: "2026-09-21T00:00:00.000Z",
        payloadJson: "{}",
      },
    ]);

    await a.sync();
    await b.sync();
    await a.sync();

    const onA = (await a.repo.listAnalyticsEvents()).map((e) => e.id).sort();
    const onB = (await b.repo.listAnalyticsEvents()).map((e) => e.id).sort();
    expect(onA).toEqual(["ev-a1", "ev-b1"]);
    expect(onB).toEqual(["ev-a1", "ev-b1"]);

    // The loop test: once both sides know everything, neither shard may change again.
    const writesBefore = remote.writeCount;
    await a.sync();
    await b.sync();
    expect(remote.writeCount).toBe(writesBefore);
  });

  describe("images", () => {
    const PIXELS = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4]);

    it("carries a background image to the other device", async () => {
      const seeded = await seedPalace(a, "Illustrated");
      await addBackground(a, seeded.palace.id, PIXELS);

      const push = await a.sync();
      expect(push.assetsPushed).toBe(1);

      const pull = await b.sync();
      expect(pull.assetsPulled).toBe(1);

      // B holds the bytes, under its own path...
      const stored = [...b.assets.files.entries()];
      expect(stored).toHaveLength(1);
      expect(stored[0][1].bytes).toEqual(PIXELS);
      expect(stored[0][0]).toContain("/Desktop/backgrounds/");

      // ...and the palace on B points at B's copy, not at A's path.
      const blob = JSON.parse((await b.repo.loadPalace(seeded.palace.id))!.palace.editorSnapshot!);
      expect(blob.store["shape:bg"].meta.mpBackgroundAssetPath).toBe(stored[0][0]);
      expect(blob.store["asset:bg"].props.src).toContain("/Desktop/backgrounds/");
      expect(JSON.stringify(blob)).not.toContain("/Laptop/backgrounds/");
    });

    it("settles instead of pushing the palace back and forth for ever", async () => {
      // The trap this guards: hashing the palace with a machine-local image path makes two
      // devices holding the identical palace disagree, so each sees the other as changed.
      const seeded = await seedPalace(a, "Illustrated");
      await addBackground(a, seeded.palace.id, PIXELS);
      await a.sync();
      await b.sync();

      const writesBefore = remote.writeCount;
      const againA = await a.sync();
      const againB = await b.sync();

      expect(againA.pushed).toEqual([]);
      expect(againB.pushed).toEqual([]);
      expect(remote.writeCount).toBe(writesBefore);
    });

    it("uploads one copy of an image two palaces share", async () => {
      const first = await seedPalace(a, "First");
      const second = await seedPalace(a, "Second");
      const shared = await addBackground(a, first.palace.id, PIXELS);
      // The second palace points at the very same file.
      const snapshot = await a.repo.loadPalace(second.palace.id);
      const blob = JSON.parse(snapshot!.palace.editorSnapshot!);
      blob.store["shape:bg"] = {
        id: "shape:bg",
        meta: { mpPalaceId: second.palace.id, mpBackgroundAssetPath: shared },
      };
      snapshot!.palace.editorSnapshot = JSON.stringify(blob);
      await a.repo.savePalace(snapshot!);

      const report = await a.sync();

      expect(report.assetsPushed).toBe(1);
      const assetFiles = [...remote.files.keys()].filter((p) => p.startsWith("assets/"));
      expect(assetFiles).toHaveLength(1);
    });

    it("does not store the image bytes readably in the vault", async () => {
      const seeded = await seedPalace(a, "Illustrated");
      await addBackground(a, seeded.palace.id, PIXELS);
      await a.sync();

      const assetPath = [...remote.files.keys()].find((p) => p.startsWith("assets/"))!;
      const contents = remote.files.get(assetPath)!;
      // Neither the pixels nor the media type are in the clear.
      expect(contents).not.toContain(btoa(String.fromCharCode(...PIXELS)));
      expect(contents.split("\n")[0]).not.toContain("image/png");
    });

    it("lands the palace even when its image cannot be fetched", async () => {
      const seeded = await seedPalace(a, "Illustrated");
      await addBackground(a, seeded.palace.id, PIXELS);
      await a.sync();

      // The asset blob has not downloaded to B yet.
      const assetPath = [...remote.files.keys()].find((p) => p.startsWith("assets/"))!;
      remote.files.delete(assetPath);

      const report = await b.sync();

      expect(report.pulled).toEqual([seeded.palace.id]);
      expect(report.skipped).toContain(assetPath);
      // The picture is missing for now, not erased: the reference survives, so it resolves
      // once the file arrives.
      const blob = (await b.repo.loadPalace(seeded.palace.id))!.palace.editorSnapshot!;
      expect(blob).toContain("mpvault://");
    });

    it("leaves a palace whose image file has gone alone", async () => {
      const seeded = await seedPalace(a, "Illustrated");
      const localPath = await addBackground(a, seeded.palace.id, PIXELS);
      a.assets.files.delete(localPath); // the user moved or deleted it

      const report = await a.sync();

      expect(report.pushed).toEqual([seeded.palace.id]);
      expect(report.assetsPushed).toBe(0);
      // The reference is left pointing where it always did rather than being dropped.
      const pushed = remote.files.get(vaultPaths.palace(seeded.palace.id))!;
      expect(pushed).toBeDefined();
    });
  });

  it("cannot read a vault sealed with a different passphrase", async () => {
    await seedPalace(a, "Private");
    await a.sync();
    const writesBefore = remote.writeCount;

    const stranger = makeDevice(
      "Stranger",
      remote,
      (await createVaultDescriptor("a different passphrase")).key,
    );
    // It fails at the door, before planning: otherwise every palace would fail to decrypt,
    // each would be written off as a damaged file, and a vault full of data would be
    // reported as nothing to do.
    await expect(stranger.engine.plan()).rejects.toThrow(/passphrase/i);
    // Nothing was read into the stranger and nothing was written to the vault.
    expect(remote.writeCount).toBe(writesBefore);
  });
});
