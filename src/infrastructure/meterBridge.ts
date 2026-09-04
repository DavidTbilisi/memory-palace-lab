import type { AnalyticsEvent } from "../domain/entities/types";
import { mapAppEvent, type MeterEvent } from "../domain/services/meterBridge";
import {
  loadMeterBridgePreference,
  loadMeterDataDir,
  type MeterBridgePreference,
} from "../domain/services/meterPreferences";
import { IS_TAURI_RUNTIME } from "./appUpdater";

/**
 * Live METER bridge (backlog item 10): after the app persists analytics rows,
 * mirror them into METER's events.jsonl right away. Desktop only; the file
 * write is a Tauri command so the webview needs no filesystem scope.
 *
 * Ids are the same deterministic ones `palace meter backfill` writes, so the
 * two never duplicate: a row the live bridge could not append stays in the
 * app's database and the next backfill picks it up.
 */

export type MeterDataDirSource = "setting" | "env" | "project" | "home";

export interface MeterDataDir {
  dir: string;
  via: MeterDataDirSource;
}

export interface MeterBridgeStatus {
  /** Desktop runtime with the Tauri commands available. */
  available: boolean;
  preference: MeterBridgePreference;
  enabled: boolean;
  target: MeterDataDir | null;
  lastError: string | null;
  /** METER events written this app session. */
  emitted: number;
}

export interface MeterBridgeDeps {
  available: boolean;
  defaultDataDir: () => Promise<{ dir: string; via: "env" | "project" | "home" }>;
  appendLines: (dir: string, lines: string[]) => Promise<void>;
  preference: () => MeterBridgePreference;
  dataDirSetting: () => string | null;
  warn?: (message: string) => void;
}

export interface MirrorResult {
  emitted: number;
  /** Set on the first failure only; later failures go to `warn`. */
  surfaceError?: string;
}

export function createMeterBridge(deps: MeterBridgeDeps) {
  let defaultDir: Promise<{ dir: string; via: "env" | "project" | "home" }> | null = null;
  let errorSurfaced = false;
  let lastError: string | null = null;
  let emitted = 0;

  async function resolveTarget(): Promise<MeterDataDir | null> {
    if (!deps.available) return null;
    const preference = deps.preference();
    if (preference === "off") return null;
    const setting = deps.dataDirSetting();
    if (setting) return { dir: setting, via: "setting" };
    defaultDir ??= deps.defaultDataDir();
    const fallback = await defaultDir;
    // "auto" only follows an explicit METER_DATA_DIR; never create ~/.neural-os on its own.
    if (preference === "auto" && fallback.via !== "env") return null;
    return fallback;
  }

  async function mirror(
    events: AnalyticsEvent[],
    palaceNameOf: (palaceId: string | null | undefined) => string | null,
  ): Promise<MirrorResult> {
    try {
      const target = await resolveTarget();
      if (!target) return { emitted: 0 };
      const mapped: MeterEvent[] = [];
      for (const event of events) mapped.push(...(await mapAppEvent(event, palaceNameOf(event.palaceId))));
      if (mapped.length === 0) return { emitted: 0 };
      await deps.appendLines(target.dir, mapped.map((m) => JSON.stringify(m)));
      emitted += mapped.length;
      lastError = null;
      return { emitted: mapped.length };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastError = message;
      if (errorSurfaced) {
        deps.warn?.(`METER bridge: ${message}`);
        return { emitted: 0 };
      }
      errorSurfaced = true;
      return {
        emitted: 0,
        surfaceError:
          `METER bridge could not append to events.jsonl (${message}). ` +
          "Events stay in the app; run `palace meter backfill` later to catch up.",
      };
    }
  }

  /** Forget the resolved default and re-arm the one-time error after a Settings change. */
  function settingsChanged() {
    defaultDir = null;
    errorSurfaced = false;
    lastError = null;
  }

  async function status(): Promise<MeterBridgeStatus> {
    const preference = deps.preference();
    let target: MeterDataDir | null = null;
    try {
      target = await resolveTarget();
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    return { available: deps.available, preference, enabled: target !== null, target, lastError, emitted };
  }

  return { mirror, status, settingsChanged };
}

async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(command, args);
}

export const meterBridge = createMeterBridge({
  available: IS_TAURI_RUNTIME,
  defaultDataDir: () => tauriInvoke("meter_default_data_dir"),
  appendLines: (dir, lines) => tauriInvoke("meter_append_events", { dir, lines }),
  preference: loadMeterBridgePreference,
  dataDirSetting: loadMeterDataDir,
  warn: (message) => console.warn(message),
});
