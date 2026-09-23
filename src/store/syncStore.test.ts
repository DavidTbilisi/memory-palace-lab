import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryVaultRemote, type MemoryVaultRemote } from "../infrastructure/sync/memoryVaultRemote";
import { VAULT_DESCRIPTOR_PATH } from "../domain/repositories/vaultRemote";
import { parseVaultDescriptor } from "../domain/sync/vaultCrypto";
import {
  SYNC_VAULT_DIR_KEY,
  SYNC_VAULT_ID_KEY,
  loadSyncConnection,
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
    remote = createMemoryVaultRemote();
    setVaultRemoteFactory(() => remote);
    useSyncStore.setState({
      status: "disconnected",
      dir: null,
      pending: [],
      conflicts: [],
      choices: {},
      report: null,
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

  it("disconnecting forgets the vault without touching it", async () => {
    await useSyncStore.getState().connect("/vault", "shared passphrase");
    const fileCount = remote.files.size;

    useSyncStore.getState().disconnect();

    expect(useSyncStore.getState().status).toBe("disconnected");
    expect(loadSyncConnection()).toBeNull();
    expect(remote.files.size).toBe(fileCount);
  });
});
