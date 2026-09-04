/**
 * METER bridge preferences, read and written from one place so the live
 * bridge and the Settings page agree on keys and semantics.
 *
 * The enabled preference is tri-state: "on" and "off" are explicit choices;
 * unset means "auto", which turns the bridge on only when the desktop app was
 * launched with METER_DATA_DIR set (a machine that clearly runs METER) or a
 * data directory was typed in Settings. That keeps the app from creating
 * ~/.neural-os/meter on machines that never asked for it.
 */
export const METER_BRIDGE_ENABLED_KEY = "mp-meter-bridge";
export const METER_DATA_DIR_KEY = "mp-meter-data-dir";

export type MeterBridgePreference = "on" | "off" | "auto";

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadMeterBridgePreference(): MeterBridgePreference {
  const raw = storage()?.getItem(METER_BRIDGE_ENABLED_KEY);
  return raw === "on" || raw === "off" ? raw : "auto";
}

export function saveMeterBridgePreference(value: MeterBridgePreference) {
  const store = storage();
  if (!store) return;
  if (value === "auto") store.removeItem(METER_BRIDGE_ENABLED_KEY);
  else store.setItem(METER_BRIDGE_ENABLED_KEY, value);
}

export function loadMeterDataDir(): string | null {
  const raw = storage()?.getItem(METER_DATA_DIR_KEY)?.trim();
  return raw ? raw : null;
}

export function saveMeterDataDir(dir: string | null) {
  const store = storage();
  if (!store) return;
  const trimmed = dir?.trim();
  if (trimmed) store.setItem(METER_DATA_DIR_KEY, trimmed);
  else store.removeItem(METER_DATA_DIR_KEY);
}
