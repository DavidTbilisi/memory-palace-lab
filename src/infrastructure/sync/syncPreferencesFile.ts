import type {
  DurableSyncPreferences,
  SyncPreferenceValues,
} from "../../domain/services/syncPreferences";

export const SYNC_PREFERENCES_FILE = "sync-settings.json";

/**
 * The sync connection as a small JSON file in the app data folder, beside the palace
 * database. Holds the vault folder, vault id, device id and name, and last run time — never
 * the passphrase. The file name is granted in capabilities/default.json.
 */
export function createTauriSyncPreferencesFile(): DurableSyncPreferences {
  return {
    async load() {
      const { exists, readTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
      if (!(await exists(SYNC_PREFERENCES_FILE, { baseDir: BaseDirectory.AppData }))) return null;
      const parsed: unknown = JSON.parse(
        await readTextFile(SYNC_PREFERENCES_FILE, { baseDir: BaseDirectory.AppData }),
      );
      return parsed && typeof parsed === "object" ? (parsed as SyncPreferenceValues) : null;
    },
    async save(values) {
      const { writeTextFile, BaseDirectory } = await import("@tauri-apps/plugin-fs");
      await writeTextFile(SYNC_PREFERENCES_FILE, JSON.stringify(values, null, 2), {
        baseDir: BaseDirectory.AppData,
      });
    },
  };
}
