import type { Locus, RecallRating } from "../domain/entities/types";
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";
import { DEFAULT_STORM_TARGET, DEFAULT_WAKE_TIME, clampStormTarget, parseWakeTime } from "../domain/services/storm";

export const DRAFT_SAVE_DELAY_MS = 900;
export const DAILY_REVIEW_GOAL_STORAGE_KEY = "mp-daily-review-goal";
export const ATLAS_LEVEL_LABELS_STORAGE_KEY = "mp-atlas-level-labels";
export const SAVE_STOP_VIEWS_STORAGE_KEY = "mp-route-save-views";
export const DEFAULT_DAILY_REVIEW_GOAL = 10;

export const RECALL_RATING_VALUES: Record<RecallRating, number> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 4,
};

export type WalkRatingCounts = Record<RecallRating, number>;

export const EMPTY_WALK_RATINGS: WalkRatingCounts = {
  again: 0,
  hard: 0,
  good: 0,
  easy: 0,
};

/** Milliseconds elapsed since an ISO timestamp, or null if absent/invalid. */
export function safeElapsedMs(isoTimestamp: string | null, now: number): number | null {
  if (!isoTimestamp) return null;
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) return null;
  return Math.max(0, now - parsed);
}

/** Normalize every locus's spaced-repetition schedule against a single "now". */
export function normalizeLoci(loci: Locus[], nowIso = new Date().toISOString()): Locus[] {
  return loci.map((locus) => normalizeLocusSchedule(locus, nowIso));
}

/** Read the persisted daily review goal, clamped to [1, 200]. */
export function loadDailyReviewGoal(): number {
  if (typeof window === "undefined") return DEFAULT_DAILY_REVIEW_GOAL;
  try {
    const raw = window.localStorage.getItem(DAILY_REVIEW_GOAL_STORAGE_KEY);
    const parsed = raw ? Number(raw) : DEFAULT_DAILY_REVIEW_GOAL;
    if (!Number.isFinite(parsed)) return DEFAULT_DAILY_REVIEW_GOAL;
    return Math.max(1, Math.min(200, Math.round(parsed)));
  } catch {
    return DEFAULT_DAILY_REVIEW_GOAL;
  }
}

/** Read the user's atlas level names, falling back to the defaults. */
export function loadAtlasLevelLabels(defaults: readonly string[]): string[] {
  if (typeof window === "undefined") return [...defaults];
  try {
    const raw = window.localStorage.getItem(ATLAS_LEVEL_LABELS_STORAGE_KEY);
    if (!raw) return [...defaults];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string") && parsed.length > 0) {
      return parsed;
    }
    return [...defaults];
  } catch {
    return [...defaults];
  }
}

export function saveAtlasLevelLabels(labels: readonly string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ATLAS_LEVEL_LABELS_STORAGE_KEY, JSON.stringify(labels));
  } catch {
    // Storage unavailable; the in-memory value still applies for this session.
  }
}

/** Whether Route mode saves the current view with each stop. On unless the user turned it off. */
export function loadSaveStopViews(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SAVE_STOP_VIEWS_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function persistSaveStopViews(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_STOP_VIEWS_STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Storage unavailable; the in-memory value still applies for this session.
  }
}

export const STORM_TARGET_STORAGE_KEY = "mp-storm-target";
export const WAKE_TIME_STORAGE_KEY = "mp-wake-time";

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStoredValue(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the value just is not remembered.
  }
}

/** The last Storm target the learner chose. */
export function loadStormTarget(): number {
  const raw = readStorage(STORM_TARGET_STORAGE_KEY);
  return clampStormTarget(raw ? Number(raw) : DEFAULT_STORM_TARGET);
}

/** The learner's wake time, "HH:MM", used to schedule first reviews after sleep. */
export function loadWakeTime(): string {
  const raw = readStorage(WAKE_TIME_STORAGE_KEY);
  return raw && parseWakeTime(raw) ? raw : DEFAULT_WAKE_TIME;
}
