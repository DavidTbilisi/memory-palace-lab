/*
 * In-app driver for the two-device sync check. See README.md in this directory.
 *
 * Why this exists rather than a Playwright spec: sync is reachable only by typing a folder
 * and a passphrase into Settings, and the folder is chosen through a native dialog that no
 * browser-level test can drive. This runs inside the real desktop app instead, so every
 * vault read and write goes through the actual Rust commands and lands on a real filesystem
 * — the one layer the vitest two-device simulation replaces with a Map.
 *
 * It drives the same store actions the Settings panel calls, so it exercises the shipping
 * code path rather than a parallel one. The only thing it reaches past the UI for is seeding
 * a palace, because building one by hand through the canvas is not something to automate.
 *
 * Steps are asynchronous but the debug bridge cannot await a script, so each one is kicked
 * off and its outcome parked on `window.__mpSync` for a later synchronous read.
 */
(() => {
  const api = {
    status: "idle",
    step: null,
    result: null,
    error: null,
  };

  const steps = {};

  /** Vite serves the app's own modules, so the driver reuses them instead of copying logic. */
  const load = {
    repo: () => import("/src/infrastructure/palaceRepositoryProvider.ts"),
    paths: () => import("/src/domain/repositories/vaultRemote.ts"),
    prefs: () => import("/src/domain/services/syncPreferences.ts"),
  };

  const syncStore = () => window.__mp_sync_store;
  const palaceStore = () => window.__mp_store;

  function fail(message) {
    throw new Error(message);
  }

  // ── Steps ──────────────────────────────────────────────────────────────────

  /**
   * Connects to the vault, creating it when the folder is empty and adopting the existing
   * descriptor when it is not. Device B joining must adopt: minting a fresh salt would make
   * every file device A already wrote permanently unreadable.
   */
  steps.connect = async ({ dir, passphrase, deviceName }) => {
    const store = syncStore();
    if (deviceName) store.getState().setDeviceName(deviceName);
    await store.getState().connect(dir, passphrase);

    const state = store.getState();
    if (state.status !== "ready") {
      fail(`connect left status "${state.status}": ${state.error ?? "no error reported"}`);
    }
    return { status: state.status, dir: state.dir, deviceName: state.deviceName };
  };

  /**
   * Supplies the passphrase to a vault this device already knows about. Every relaunch —
   * and every page reload — needs this, because the folder is remembered and the passphrase
   * deliberately is not.
   */
  steps.unlock = async ({ passphrase }) => {
    const store = syncStore();
    await store.getState().unlock(passphrase);
    const state = store.getState();
    if (state.status !== "ready") {
      fail(`unlock left status "${state.status}": ${state.error ?? "no error reported"}`);
    }
    return { status: state.status, dir: state.dir, deviceName: state.deviceName };
  };

  /** Connecting with the wrong passphrase must be refused and must remember nothing. */
  steps.connectExpectingRefusal = async ({ dir, passphrase }) => {
    const store = syncStore();
    await store.getState().connect(dir, passphrase);
    const state = store.getState();
    const { loadSyncConnection } = await load.prefs();
    return {
      status: state.status,
      error: state.error,
      remembered: loadSyncConnection(),
    };
  };

  /**
   * Builds a palace with everything that has to survive the crossing: a route, a stop
   * carrying an SM-2 schedule, a background image and a node image. The canvas blob is
   * shaped the way tldraw stores one, because that blob — not the relational rows — is
   * where the background and its asset record actually live.
   */
  steps.seed = async ({ name, tint }) => {
    const { getPalaceRepository } = await load.repo();
    const repo = getPalaceRepository();
    const palace = await repo.createPalace(name, null);

    const imagePath = await writeImage(palace.id, tint ?? "#6d28d9");
    const { convertFileSrc } = await import("@tauri-apps/api/core");
    const imageUrl = convertFileSrc(imagePath);

    const nodeId = crypto.randomUUID();
    const routeId = crypto.randomUUID();
    const objectId = crypto.randomUUID();

    const snapshot = {
      palace: {
        ...palace,
        editorSnapshot: JSON.stringify({
          document: {
            store: {
              // The background: a shape holding the absolute path, and tldraw's own asset
              // record holding the URL it draws from. Both must be rewritten to travel.
              "shape:background": {
                id: "shape:background",
                type: "image",
                meta: { mpPalaceId: palace.id, mpBackgroundAssetPath: imagePath },
              },
              "asset:background": {
                id: "asset:background",
                type: "image",
                props: { src: imageUrl },
              },
              "shape:stop": {
                id: "shape:stop",
                type: "geo",
                meta: { mpPalaceId: palace.id, mpMemoryNodeId: nodeId },
              },
            },
          },
        }),
      },
      canvasObjects: [
        {
          id: objectId,
          palaceId: palace.id,
          type: "node",
          x: 0,
          y: 0,
          width: 200,
          height: 120,
          zIndex: 0,
          payloadJson: "{}",
        },
      ],
      nodes: [
        {
          id: nodeId,
          objectId,
          title: "The stop that must arrive",
          content: "Carries a schedule and a picture.",
          kind: "memory",
          portal: null,
          imageUrl,
        },
      ],
      edges: [],
      routes: [{ id: routeId, palaceId: palace.id, name: "The walk" }],
      loci: [
        {
          id: crypto.randomUUID(),
          routeId,
          nodeId,
          orderIndex: 0,
          label: "Stop one",
          // The whole point of syncing: a schedule stranded on one machine stops being
          // reviewed at all.
          interval: 6,
          easeFactor: 2.5,
          repetitions: 3,
          nextReviewAt: "2026-10-01T00:00:00.000Z",
          lastReviewedAt: "2026-09-25T00:00:00.000Z",
        },
      ],
    };

    await repo.savePalace(snapshot);
    await palaceStore().getState().loadPalaces();
    return { palaceId: palace.id, name: palace.name, nodeId, routeId, imagePath };
  };

  /** Runs a sync and reports what moved, exactly as the Settings panel would. */
  steps.sync = async () => {
    const store = syncStore();
    await store.getState().syncNow();
    const state = store.getState();
    return {
      status: state.status,
      error: state.error,
      report: state.report,
      conflicts: state.conflicts.map((conflict) => ({
        palaceId: conflict.palaceId,
        reason: conflict.reason,
      })),
    };
  };

  /** Chooses a resolution for every open conflict, then syncs again. */
  steps.resolve = async ({ choice }) => {
    const store = syncStore();
    const open = store.getState().conflicts;
    if (open.length === 0) fail("no conflict to resolve");
    for (const conflict of open) store.getState().chooseConflict(conflict.palaceId, choice);
    await store.getState().syncNow();
    const state = store.getState();
    return {
      status: state.status,
      error: state.error,
      report: state.report,
      remainingConflicts: state.conflicts.length,
    };
  };

  /** Edits a palace so this device diverges from the vault. */
  steps.edit = async ({ palaceId, title }) => {
    const { getPalaceRepository } = await load.repo();
    const repo = getPalaceRepository();
    const snapshot = await repo.loadPalace(palaceId);
    if (!snapshot) fail(`no palace ${palaceId} on this device`);
    snapshot.nodes[0].title = title;
    snapshot.loci[0].label = title;
    await repo.savePalace(snapshot);
    await palaceStore().getState().loadPalaces();
    return { palaceId, title };
  };

  /** Deletes vault images no palace refers to any more. */
  steps.reclaim = async () => {
    const store = syncStore();
    await store.getState().reclaimSpace();
    const state = store.getState();
    return { status: state.status, error: state.error, garbage: state.garbage };
  };

  /** Moves a palace to the trash, the way the Library's delete does. */
  steps.softDelete = async ({ palaceId }) => {
    const { getPalaceRepository } = await load.repo();
    await getPalaceRepository().softDeletePalace(palaceId);
    await palaceStore().getState().loadPalaces();
    return { palaceId };
  };

  steps.restore = async ({ palaceId }) => {
    const { getPalaceRepository } = await load.repo();
    await getPalaceRepository().restorePalace(palaceId);
    await palaceStore().getState().loadPalaces();
    return { palaceId };
  };

  /** Hard delete, as emptying the trash does. Records a tombstone on the way out. */
  steps.purge = async ({ palaceId }) => {
    const { getPalaceRepository } = await load.repo();
    await getPalaceRepository().purgePalace(palaceId);
    await palaceStore().getState().loadPalaces();
    return { palaceId };
  };

  /** What is in the trash here, and whether it can still be restored. */
  steps.trash = async () => {
    const { getPalaceRepository } = await load.repo();
    const trashed = await getPalaceRepository().listTrashedPalaces();
    return trashed.map((palace) => ({
      id: palace.id,
      name: palace.name,
      rev: palace.rev,
      deletedAt: palace.deletedAt ?? null,
      purgeAt: palace.purgeAt ?? null,
    }));
  };

  /** What this device holds, in the terms the check cares about. */
  steps.local = async () => {
    const { getPalaceRepository } = await load.repo();
    const repo = getPalaceRepository();
    const palaces = await repo.listPalaces();
    const detailed = [];
    for (const palace of palaces) {
      const snapshot = await repo.loadPalace(palace.id);
      if (!snapshot) continue;
      detailed.push({
        id: palace.id,
        name: palace.name,
        rev: palace.rev,
        deletedAt: palace.deletedAt ?? null,
        routes: snapshot.routes.map((route) => route.name),
        loci: snapshot.loci.map((locus) => ({
          label: locus.label,
          interval: locus.interval,
          easeFactor: locus.easeFactor,
          repetitions: locus.repetitions,
          nextReviewAt: locus.nextReviewAt,
        })),
        nodeTitles: snapshot.nodes.map((node) => node.title),
        imageUrls: snapshot.nodes.map((node) => node.imageUrl ?? null),
        backgroundPath: backgroundPathOf(snapshot),
      });
    }
    return detailed;
  };

  /**
   * Reads the vault through the same Rust commands the app uses and checks that nothing
   * readable leaked. `secrets` are strings that must not appear anywhere in the folder.
   */
  steps.vault = async ({ dir, secrets = [] }) => {
    const { invoke } = await import("@tauri-apps/api/core");
    const entries = await invoke("vault_list", { dir });

    const leaks = [];
    for (const entry of entries) {
      const body = await invoke("vault_read", { dir, relPath: entry.relPath });
      if (!body) continue;
      for (const secret of secrets) {
        if (body.includes(secret)) leaks.push({ relPath: entry.relPath, secret });
      }
    }

    // The descriptor is meant to be cleartext, so check it says only what it should.
    const descriptor = await invoke("vault_read", { dir, relPath: "vault.json" });

    return {
      entries: entries.map((entry) => ({ relPath: entry.relPath, size: entry.size })),
      leaks,
      descriptorKeys: descriptor ? Object.keys(JSON.parse(descriptor)) : null,
      probe: await invoke("vault_probe", { dir }),
    };
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  function backgroundPathOf(snapshot) {
    if (!snapshot.palace.editorSnapshot) return null;
    try {
      const parsed = JSON.parse(snapshot.palace.editorSnapshot);
      const shape = parsed?.document?.store?.["shape:background"];
      const asset = parsed?.document?.store?.["asset:background"];
      return {
        path: shape?.meta?.mpBackgroundAssetPath ?? null,
        src: asset?.props?.src ?? null,
      };
    } catch {
      return null;
    }
  }

  /** Writes a real PNG where a background import would put one, and returns its path. */
  async function writeImage(palaceId, tint) {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    context.fillStyle = tint;
    context.fillRect(0, 0, 32, 32);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const bytes = new Uint8Array(await blob.arrayBuffer());

    const { mkdir, writeFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
    const { appDataDir, join } = await import("@tauri-apps/api/path");
    const name = `${palaceId}-${crypto.randomUUID()}.png`;
    await mkdir("palace-backgrounds", { baseDir: BaseDirectory.AppData, recursive: true });
    await writeFile(`palace-backgrounds/${name}`, bytes, { baseDir: BaseDirectory.AppData });
    return join(await appDataDir(), "palace-backgrounds", name);
  }

  // ── Bridge surface ─────────────────────────────────────────────────────────

  api.run = (name, options = {}) => {
    const step = steps[name];
    if (!step) {
      api.status = "error";
      api.error = `no step named "${name}"`;
      return `no step named "${name}"`;
    }
    api.status = "running";
    api.step = name;
    api.result = null;
    api.error = null;
    Promise.resolve()
      .then(() => step(options))
      .then((result) => {
        api.result = result ?? null;
        api.status = "done";
      })
      .catch((error) => {
        api.error = String((error && error.stack) || error);
        api.status = "error";
      });
    return `running ${name}`;
  };

  /** Synchronous read, because the bridge cannot await. */
  api.state = () =>
    JSON.stringify({ status: api.status, step: api.step, result: api.result, error: api.error });

  window.__mpSync = api;
  return "driver ready";
})();
