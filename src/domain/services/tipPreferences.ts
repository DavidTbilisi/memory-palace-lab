/**
 * Idle-tip preferences, read and written from one place so the tip card and
 * the Settings page agree on keys and semantics.
 */
export const IDLE_DELAY_STORAGE_KEY = "mp-idle-tip-delay-ms";
export const DISMISSED_TIPS_STORAGE_KEY = "mp-dismissed-tip-ids";
export const TIPS_DISABLED_KEY = "mp-tips-disabled";
export const DEFAULT_IDLE_DELAY_MS = 60000;
export const MIN_IDLE_DELAY_MS = 50;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function areTipsDisabled(): boolean {
  return storage()?.getItem(TIPS_DISABLED_KEY) === "true";
}

export function setTipsDisabled(disabled: boolean) {
  const store = storage();
  if (!store) return;
  if (disabled) store.setItem(TIPS_DISABLED_KEY, "true");
  else store.removeItem(TIPS_DISABLED_KEY);
}

export function loadIdleDelayMs(): number {
  const raw = storage()?.getItem(IDLE_DELAY_STORAGE_KEY);
  if (!raw) return DEFAULT_IDLE_DELAY_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= MIN_IDLE_DELAY_MS ? parsed : DEFAULT_IDLE_DELAY_MS;
}

export function saveIdleDelayMs(delayMs: number) {
  const store = storage();
  if (!store) return;
  if (!Number.isFinite(delayMs) || delayMs < MIN_IDLE_DELAY_MS) store.removeItem(IDLE_DELAY_STORAGE_KEY);
  else store.setItem(IDLE_DELAY_STORAGE_KEY, String(Math.round(delayMs)));
}

export function loadDismissedTipIds(): Set<string> {
  try {
    const raw = storage()?.getItem(DISMISSED_TIPS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

export function addDismissedTipId(id: string): Set<string> {
  const next = loadDismissedTipIds();
  next.add(id);
  storage()?.setItem(DISMISSED_TIPS_STORAGE_KEY, JSON.stringify([...next]));
  return next;
}

/** Re-enable tips and forget per-tip dismissals. */
export function resetTipPreferences() {
  const store = storage();
  if (!store) return;
  store.removeItem(TIPS_DISABLED_KEY);
  store.removeItem(DISMISSED_TIPS_STORAGE_KEY);
}
