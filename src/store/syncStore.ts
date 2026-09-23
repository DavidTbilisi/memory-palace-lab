import { create } from "zustand";
import { VAULT_DESCRIPTOR_PATH, type VaultRemote } from "../domain/repositories/vaultRemote";
import {
  createVaultDescriptor,
  parseVaultDescriptor,
  unlockVault,
} from "../domain/sync/vaultCrypto";
import {
  createVaultSyncEngine,
  type ConflictChoice,
  type SyncReport,
} from "../domain/sync/vaultSyncEngine";
import type { SyncAction } from "../domain/sync/syncPlan";
import {
  loadDeviceName,
  loadLastSyncedAt,
  loadOrCreateDeviceId,
  loadSyncConnection,
  saveDeviceName,
  saveLastSyncedAt,
  saveSyncConnection,
} from "../domain/services/syncPreferences";
import { loadAARRecords, saveAllAARRecords } from "../infrastructure/aarStorage";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { createTauriVaultRemote } from "../infrastructure/sync/tauriVaultRemote";
import { createTauriSyncStateStore } from "../infrastructure/sync/syncStateStore";
import { usePalaceStore } from "./palaceStore";

/**
 * Sync as the UI sees it. A separate store rather than a slice of palaceStore, which is
 * already ~2000 lines and has no business knowing the vault exists.
 *
 * The derived key is held in a module-level variable, never in the store's state: zustand
 * state is serialized by devtools, and a key that leaks there defeats the point of
 * encrypting the vault at all.
 */

let sessionKey: CryptoKey | null = null;

/** Overridable so tests, and the Playwright spec, can drive a fake vault. */
let remoteFactory: () => VaultRemote = createTauriVaultRemote;
export function setVaultRemoteFactory(factory: () => VaultRemote) {
  remoteFactory = factory;
  sessionKey = null;
}

export type SyncStatus = "disconnected" | "locked" | "ready" | "working" | "error";

export type SyncStore = {
  status: SyncStatus;
  dir: string | null;
  deviceName: string;
  lastSyncedAt: string | null;
  /** Non-conflict work the last plan found, for the "N to push, M to pull" summary. */
  pending: SyncAction[];
  conflicts: Extract<SyncAction, { kind: "conflict" }>[];
  choices: Record<string, ConflictChoice>;
  report: SyncReport | null;
  error: string | null;

  connect(dir: string, passphrase: string): Promise<void>;
  unlock(passphrase: string): Promise<void>;
  disconnect(): void;
  setDeviceName(name: string): void;
  chooseConflict(palaceId: string, choice: ConflictChoice): void;
  syncNow(): Promise<void>;
  dismissReport(): void;
};

function engineFor(dir: string, key: CryptoKey) {
  return createVaultSyncEngine({
    remote: remoteFactory(),
    dir,
    key,
    repo: getPalaceRepository(),
    syncState: createTauriSyncStateStore(),
    aar: { load: loadAARRecords, saveAll: saveAllAARRecords },
    deviceId: loadOrCreateDeviceId(),
    deviceName: loadDeviceName(),
  });
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const connection = loadSyncConnection();

export const useSyncStore = create<SyncStore>((set, get) => ({
  // A stored connection means "locked", never "ready": the passphrase is not persisted, so
  // every launch starts locked and the user types it once.
  status: connection ? "locked" : "disconnected",
  dir: connection?.dir ?? null,
  deviceName: loadDeviceName(),
  lastSyncedAt: loadLastSyncedAt(),
  pending: [],
  conflicts: [],
  choices: {},
  report: null,
  error: null,

  async connect(dir, passphrase) {
    set({ status: "working", error: null });
    try {
      const remote = remoteFactory();
      const canonicalDir = await remote.init(dir);
      const existing = await remote.read(canonicalDir, VAULT_DESCRIPTOR_PATH);

      if (existing) {
        // Joining a vault that already exists. Adopt its descriptor rather than writing a
        // new one, which would replace the salt and make every existing file unreadable.
        const descriptor = parseVaultDescriptor(existing);
        if (!descriptor) throw new Error("That folder holds a vault this version cannot read.");
        const key = await unlockVault(passphrase, descriptor);
        if (!key) throw new Error("Wrong passphrase for the vault in that folder.");
        sessionKey = key;
        saveSyncConnection({ dir: canonicalDir, vaultId: descriptor.vaultId });
      } else {
        const { descriptor, key } = await createVaultDescriptor(passphrase);
        await remote.write(canonicalDir, VAULT_DESCRIPTOR_PATH, JSON.stringify(descriptor, null, 2));
        sessionKey = key;
        saveSyncConnection({ dir: canonicalDir, vaultId: descriptor.vaultId });
      }

      set({ status: "ready", dir: canonicalDir, error: null });
    } catch (error) {
      sessionKey = null;
      set({ status: "error", error: messageOf(error) });
    }
  },

  async unlock(passphrase) {
    const dir = get().dir;
    if (!dir) return;
    set({ status: "working", error: null });
    try {
      const text = await remoteFactory().read(dir, VAULT_DESCRIPTOR_PATH);
      if (!text) throw new Error("The vault folder is missing or has not finished downloading.");
      const descriptor = parseVaultDescriptor(text);
      if (!descriptor) throw new Error("The vault descriptor is unreadable.");
      const key = await unlockVault(passphrase, descriptor);
      if (!key) throw new Error("Wrong passphrase.");
      sessionKey = key;
      set({ status: "ready", error: null });
    } catch (error) {
      sessionKey = null;
      set({ status: "error", error: messageOf(error) });
    }
  },

  disconnect() {
    // Forgets the vault on this device only. The folder and everything in it is left alone,
    // and the local palaces are untouched — disconnecting is not a delete.
    sessionKey = null;
    saveSyncConnection(null);
    set({
      status: "disconnected",
      dir: null,
      pending: [],
      conflicts: [],
      choices: {},
      report: null,
      error: null,
      lastSyncedAt: null,
    });
  },

  setDeviceName(name) {
    saveDeviceName(name);
    set({ deviceName: loadDeviceName() });
  },

  chooseConflict(palaceId, choice) {
    set((state) => ({ choices: { ...state.choices, [palaceId]: choice } }));
  },

  async syncNow() {
    const { dir } = get();
    if (!dir || !sessionKey) {
      set({ status: "locked", error: "Enter your passphrase to sync." });
      return;
    }

    // Flush unsaved canvas work first, or the run pushes the last checkpoint and instantly
    // conflicts with the edit still sitting in the editor.
    const palaceStore = usePalaceStore.getState();
    if (palaceStore.persistenceState !== "clean" && palaceStore.currentPalace) {
      await palaceStore.saveCurrent();
    }

    set({ status: "working", error: null, report: null });
    try {
      const engine = engineFor(dir, sessionKey);
      const built = await engine.plan();
      const conflicts = built.plan.actions.filter(
        (action): action is Extract<SyncAction, { kind: "conflict" }> => action.kind === "conflict",
      );
      const choices = new Map(Object.entries(get().choices));
      const unresolved = conflicts.filter((conflict) => !choices.has(conflict.palaceId));

      // Stop and ask. Anything already decided still applies, so resolving conflicts one at
      // a time makes progress instead of blocking the whole run.
      if (unresolved.length > 0) {
        set({
          status: "ready",
          conflicts,
          pending: built.plan.actions.filter(
            (a) => a.kind !== "in-sync" && a.kind !== "conflict" && a.kind !== "unreadable",
          ),
        });
        return;
      }

      const report = await engine.apply(built, choices);
      const syncedAt = new Date().toISOString();
      saveLastSyncedAt(syncedAt);

      // Pulls landed behind the app's back, so refresh what the user is looking at.
      await usePalaceStore.getState().loadPalaces();
      if (report.pulled.length > 0) {
        const current = usePalaceStore.getState().currentPalace;
        if (current && report.pulled.includes(current.id)) {
          await usePalaceStore.getState().reloadCurrentPalaceFromDisk();
        }
      }

      set({
        status: "ready",
        report,
        conflicts: [],
        choices: {},
        pending: [],
        lastSyncedAt: syncedAt,
        error: null,
      });
    } catch (error) {
      set({ status: "error", error: messageOf(error) });
    }
  },

  dismissReport() {
    set({ report: null });
  },
}));
