import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryVaultRemote, type MemoryVaultRemote } from "../infrastructure/sync/memoryVaultRemote";
import { VAULT_DESCRIPTOR_PATH } from "../domain/repositories/vaultRemote";
import { parseVaultDescriptor } from "../domain/sync/vaultCrypto";
import {
  SYNC_DEVICE_ID_KEY,
  SYNC_VAULT_DIR_KEY,
  SYNC_VAULT_ID_KEY,
  flushSyncPreferences,
  hydrateSyncPreferences,
  loadOrCreateDeviceId,
  loadSyncConnection,
  resetDurableSyncPreferences,
  type DurableSyncPreferences,
  type SyncPreferenceValues,
} from "../domain/services/syncPreferences";

// The store reaches for SQLite-backed sync state and the palace store on save; neither is
// available in jsdom, and neither is what these tests are about.
vi.mock("../infrastructure/sync/syncStateStore", () => ({
  createTauriSyncStateStore: () => ({
    load: async () => ({
      states: [],
      tombstones: [],
      foreignAnalyticsIds: [],
      foreignAarIds: [],
    }),
    apply: async () => {},
  }),
}));

// The asset store reaches for @tauri-apps/plugin-fs, which jsdom has no answer for. Image
// transfer itself is covered by the two-device simulation.
vi.mock("../infrastructure/sync/tauriAssetStore", () => ({
  createTauriAssetStore: () => ({
    read: async () => null,
    locate: async () => null,
    write: async () => ({ path: "", url: "" }),
  }),
}));

let remote: MemoryVaultRemote;

const { useSyncStore, setVaultRemoteFactory } = await import("./syncStore");

describe("syncStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetDurableSyncPreferences();
    remote = createMemoryVaultRemote();
    setVaultRemoteFactory(() => remote);
    useSyncStore.setState({
      status: "disconnected",
      dir: null,
      unlocked: false,
      pending: [],
      conflicts: [],
      choices: {},
      report: null,
      garbage: null,
      error: null,
      lastSyncedAt: null,
    });
  });

  it("creates a vault in an empty folder and remembers the connection", async () => {
    await useSyncStore.getState().connect("/vault", "a good passphrase");

    expect(useSyncStore.getState().status).toBe("ready");
    expect(remote.files.has(VAULT_DESCRIPTOR_PATH)).toBe(true);
    expect(loadSyncConnection()).toMatchObject({ dir: "/vault" });
  });

  it("joins an existing vault instead of replacing its descriptor", async () => {
    // Overwriting the descriptor would mint a new salt and make every file already in the
    // folder permanently unreadable.
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    const original = remote.files.get(VAULT_DESCRIPTOR_PATH)!;

    useSyncStore.getState().disconnect();
    await useSyncStore.getState().connect("/vault", "shared passphrase");

    expect(remote.files.get(VAULT_DESCRIPTOR_PATH)).toBe(original);
    expect(useSyncStore.getState().status).toBe("ready");
  });

  it("refuses the wrong passphrase when joining, and stays disconnected", async () => {
    await useSyncStore.getState().connect("/vault", "the real passphrase");
    useSyncStore.getState().disconnect();

    await useSyncStore.getState().connect("/vault", "a guess");

    expect(useSyncStore.getState().status).toBe("error");
    expect(useSyncStore.getState().error).toMatch(/passphrase/i);
    expect(loadSyncConnection()).toBeNull();
  });

  it("never writes the passphrase to this device", async () => {
    const passphrase = "a-very-distinctive-passphrase";
    await useSyncStore.getState().connect("/vault", passphrase);

    const stored = Object.entries(window.localStorage).map(([k, v]) => `${k}=${v}`).join("\n");
    expect(stored).not.toContain(passphrase);
    // And the descriptor in the folder must not carry it either.
    expect(remote.files.get(VAULT_DESCRIPTOR_PATH)).not.toContain(passphrase);
  });

  it("starts locked when a connection is restored from a previous launch", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    const descriptor = parseVaultDescriptor(remote.files.get(VAULT_DESCRIPTOR_PATH)!)!;

    // Simulate a fresh launch: the connection is on disk, the key is not.
    window.localStorage.setItem(SYNC_VAULT_DIR_KEY, "/vault");
    window.localStorage.setItem(SYNC_VAULT_ID_KEY, descriptor.vaultId);
    vi.resetModules();
    const reloaded = await import("./syncStore");
    reloaded.setVaultRemoteFactory(() => remote);

    expect(reloaded.useSyncStore.getState().status).toBe("locked");
  });

  it("refuses to sync while locked rather than failing silently", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    useSyncStore.setState({ status: "locked" });
    setVaultRemoteFactory(() => remote); // clears the session key

    await useSyncStore.getState().syncNow();

    expect(useSyncStore.getState().error).toMatch(/passphrase/i);
  });

  it("ignores a half-written connection from an interrupted setup", () => {
    // A directory with no vault id would otherwise let the app adopt whatever vault happens
    // to be sitting in that folder.
    window.localStorage.setItem(SYNC_VAULT_DIR_KEY, "/vault");
    expect(loadSyncConnection()).toBeNull();
  });

  it("reports a refusal to reclaim space as such, not as an empty vault", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    // A placeholder the sync app has not downloaded: its palace could refer to any image.
    remote.seed("palaces/still-downloading.mpv.icloud", "");

    await useSyncStore.getState().reclaimSpace();

    const { garbage } = useSyncStore.getState();
    expect(garbage?.refused).toBe("undownloaded");
    expect(garbage?.removed).toEqual([]);
  });

  it("refuses to reclaim space while locked rather than failing silently", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    useSyncStore.setState({ status: "locked" });
    setVaultRemoteFactory(() => remote); // clears the session key

    await useSyncStore.getState().reclaimSpace();

    expect(useSyncStore.getState().error).toMatch(/passphrase/i);
    expect(useSyncStore.getState().garbage).toBeNull();
  });

  it("disconnecting forgets the vault without touching it", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    const fileCount = remote.files.size;

    useSyncStore.getState().disconnect();

    expect(useSyncStore.getState().status).toBe("disconnected");
    expect(loadSyncConnection()).toBeNull();
    expect(remote.files.size).toBe(fileCount);
  });

  it("says whether a folder already holds a vault, so joining is never mistaken for creating", async () => {
    expect((await useSyncStore.getState().checkFolder("/vault")).kind).toBe("new");

    await useSyncStore.getState().connect("/vault", "shared passphrase");
    useSyncStore.getState().disconnect();

    expect((await useSyncStore.getState().checkFolder("/vault")).kind).toBe("existing");
  });

  it("stays locked after a wrong passphrase, even on a device that has synced before", async () => {
    await useSyncStore.getState().connect("/vault", "the real passphrase");
    setVaultRemoteFactory(() => remote); // a fresh launch: no key in memory
    useSyncStore.setState({ status: "locked", unlocked: false, lastSyncedAt: "2026-09-28T10:00:00Z" });

    await useSyncStore.getState().unlock("a guess");

    expect(useSyncStore.getState().unlocked).toBe(false);
    expect(useSyncStore.getState().error).toMatch(/passphrase/i);

    await useSyncStore.getState().unlock("the real passphrase");
    expect(useSyncStore.getState().unlocked).toBe(true);
  });
});

function fakeFile(initial: SyncPreferenceValues | null = null) {
  const file = { contents: initial as SyncPreferenceValues | null };
  const backend: DurableSyncPreferences = {
    load: async () => file.contents,
    save: async (values) => {
      file.contents = { ...values };
    },
  };
  return { file, backend };
}

describe("sync settings outlive the webview's storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetDurableSyncPreferences();
    remote = createMemoryVaultRemote();
    setVaultRemoteFactory(() => remote);
    useSyncStore.setState({ status: "disconnected", dir: null, unlocked: false, error: null, lastSyncedAt: null });
  });

  it("brings the connection back from the app data file when localStorage was wiped", async () => {
    const { file, backend } = fakeFile();
    await hydrateSyncPreferences(backend);
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    const deviceId = loadOrCreateDeviceId();
    await flushSyncPreferences();

    // An update, a new webview origin, a cleared cache: webview storage is gone.
    window.localStorage.clear();
    resetDurableSyncPreferences();
    useSyncStore.setState({ status: "disconnected", dir: null, unlocked: false });

    await hydrateSyncPreferences(fakeFile(file.contents).backend);
    useSyncStore.getState().restore();

    expect(useSyncStore.getState().status).toBe("locked");
    expect(useSyncStore.getState().dir).toBe("/vault");
    // The same device id, or this device would orphan its own shard in the vault.
    expect(loadOrCreateDeviceId()).toBe(deviceId);
  });

  it("carries a connection made before the file existed into it", async () => {
    window.localStorage.setItem(SYNC_VAULT_DIR_KEY, "/vault");
    window.localStorage.setItem(SYNC_VAULT_ID_KEY, "vault-1");
    window.localStorage.setItem(SYNC_DEVICE_ID_KEY, "device-1");
    const { file, backend } = fakeFile();

    await hydrateSyncPreferences(backend);
    await flushSyncPreferences();

    expect(file.contents).toMatchObject({
      [SYNC_VAULT_DIR_KEY]: "/vault",
      [SYNC_VAULT_ID_KEY]: "vault-1",
      [SYNC_DEVICE_ID_KEY]: "device-1",
    });
  });

  it("keeps the passphrase out of the file", async () => {
    const passphrase = "a-very-distinctive-passphrase";
    const { file, backend } = fakeFile();
    await hydrateSyncPreferences(backend);

    await useSyncStore.getState().connect("/vault", passphrase);
    await flushSyncPreferences();

    expect(JSON.stringify(file.contents)).toContain("/vault");
    expect(JSON.stringify(file.contents)).not.toContain(passphrase);
  });

  it("forgets the folder in the file too on disconnect, but keeps the device id", async () => {
    const { file, backend } = fakeFile();
    await hydrateSyncPreferences(backend);
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    loadOrCreateDeviceId();

    useSyncStore.getState().disconnect();
    await flushSyncPreferences();

    expect(file.contents?.[SYNC_VAULT_DIR_KEY]).toBeUndefined();
    expect(file.contents?.[SYNC_DEVICE_ID_KEY]).toBeTruthy();
  });
});
