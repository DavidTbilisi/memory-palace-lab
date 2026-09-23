import { invoke } from "@tauri-apps/api/core";
import type { SyncStateStore } from "../../domain/sync/vaultSyncEngine";

/** Matches SyncStateBundleDto in src-tauri/src/db.rs. */
type InvokeSyncStateBundle = {
  states: {
    palaceId: string;
    baseRev: number;
    baseHash: string;
    remoteRev: number;
    remoteHash: string;
    syncedAt: string;
  }[];
  tombstones: { palaceId: string; deletedAt: string; rev: number }[];
  foreignAnalyticsIds: string[];
  foreignAarIds: string[];
};

/**
 * Sync bookkeeping in SQLite beside the palaces it describes.
 *
 * Not localStorage: it is per-palace data that has to survive a cleared browser store, and
 * keeping it out of `PalaceSnapshot` means it can never leak into a backup file or a DSL
 * export.
 */
export function createTauriSyncStateStore(): SyncStateStore {
  return {
    async load() {
      const bundle = await invoke<InvokeSyncStateBundle>("sync_state_load");
      return {
        states: bundle.states.map((state) => ({
          palaceId: state.palaceId,
          baseRev: state.baseRev,
          baseHash: state.baseHash,
          remoteRev: state.remoteRev,
          remoteHash: state.remoteHash,
        })),
        tombstones: bundle.tombstones,
        foreignAnalyticsIds: bundle.foreignAnalyticsIds,
        foreignAarIds: bundle.foreignAarIds,
      };
    },
    async apply(patch) {
      const syncedAt = new Date().toISOString();
      await invoke("sync_state_apply", {
        patch: {
          states: (patch.states ?? []).map((state) => ({ ...state, syncedAt })),
          tombstones: patch.tombstones ?? [],
          foreignAnalyticsIds: patch.foreignAnalyticsIds ?? [],
          foreignAarIds: patch.foreignAarIds ?? [],
        },
      });
    },
  };
}
