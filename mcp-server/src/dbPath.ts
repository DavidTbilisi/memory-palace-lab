import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

/** Must match `identifier` in src-tauri/tauri.conf.json. */
const APP_IDENTIFIER = "com.memorypalace.lab";
/** Must match the file name created in src-tauri/src/lib.rs. */
const DB_FILE_NAME = "memory_palace_lab.sqlite3";

/** Mirrors Tauri's `app_data_dir()` for this app's identifier. */
export function resolveAppDataDir(): string {
  if (process.platform === "win32") {
    const base = process.env.APPDATA ?? join(homedir(), "AppData", "Roaming");
    return join(base, APP_IDENTIFIER);
  }
  if (process.platform === "darwin") {
    return join(homedir(), "Library", "Application Support", APP_IDENTIFIER);
  }
  const base = process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share");
  return join(base, APP_IDENTIFIER);
}

/**
 * Resolve the SQLite database the desktop app writes to.
 * `MEMORY_PALACE_DB` overrides the per-OS default (useful for tests
 * and non-standard installs).
 */
export function resolveDbPath(): string {
  const override = process.env.MEMORY_PALACE_DB;
  if (override) return override;
  return join(resolveAppDataDir(), DB_FILE_NAME);
}

export function assertDbExists(dbPath: string): void {
  if (!existsSync(dbPath)) {
    throw new Error(
      `Memory Palace database not found at "${dbPath}". ` +
        `Run the desktop app once (npm run tauri dev) to create it, ` +
        `or point the MEMORY_PALACE_DB environment variable at the sqlite3 file.`,
    );
  }
}

/** Directory where the live-refresh sentinel file lives (same dir as the DB). */
export function sentinelDirFor(dbPath: string): string {
  return dirname(dbPath);
}
