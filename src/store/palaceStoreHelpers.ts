import type { Locus, RecallRating } from "../domain/entities/types";
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";

export const DRAFT_SAVE_DELAY_MS = 900;
export const DAILY_REVIEW_GOAL_STORAGE_KEY = "mp-daily-review-goal";
export const ATLAS_LEVEL_LABELS_STORAGE_KEY = "mp-atlas-level-labels";
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
