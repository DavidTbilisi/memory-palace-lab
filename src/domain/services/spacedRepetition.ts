import type { Locus, RecallRating } from "../entities/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_INTERVAL = 1;
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

function addDays(iso: string, days: number) {
  return new Date(Date.parse(iso) + Math.max(1, days) * DAY_MS).toISOString();
}

export type LocusScheduleState = Pick<Locus, "interval" | "easeFactor" | "repetitions" | "nextReviewAt" | "lastReviewedAt">;

export function defaultLocusSchedule(nowIso = new Date().toISOString()): LocusScheduleState {
  return {
    interval: DEFAULT_INTERVAL,
    easeFactor: DEFAULT_EASE_FACTOR,
    repetitions: 0,
    nextReviewAt: addDays(nowIso, DEFAULT_INTERVAL),
    lastReviewedAt: null,
  };
}

export function normalizeLocusSchedule(locus: Locus, nowIso = new Date().toISOString()): Locus {
  const normalized = defaultLocusSchedule(nowIso);
  return {
    ...locus,
    interval: Number.isFinite(locus.interval) && (locus.interval ?? 0) > 0 ? locus.interval : normalized.interval,
    easeFactor:
      Number.isFinite(locus.easeFactor) && (locus.easeFactor ?? 0) >= MIN_EASE_FACTOR
        ? locus.easeFactor
        : normalized.easeFactor,
    repetitions:
      Number.isFinite(locus.repetitions) && (locus.repetitions ?? -1) >= 0 ? Math.floor(locus.repetitions!) : normalized.repetitions,
    nextReviewAt:
      typeof locus.nextReviewAt === "string" && !Number.isNaN(Date.parse(locus.nextReviewAt))
        ? locus.nextReviewAt
        : normalized.nextReviewAt,
    lastReviewedAt:
      typeof locus.lastReviewedAt === "string" && !Number.isNaN(Date.parse(locus.lastReviewedAt))
        ? locus.lastReviewedAt
        : null,
  };
}

export function applySm2Schedule(locus: Locus, rating: RecallRating, reviewedAtIso = new Date().toISOString()): Locus {
  const current = normalizeLocusSchedule(locus, reviewedAtIso);
  let interval = current.interval ?? DEFAULT_INTERVAL;
  let easeFactor = current.easeFactor ?? DEFAULT_EASE_FACTOR;
  let repetitions = current.repetitions ?? 0;

  if (rating === "again") {
    interval = 1;
    repetitions = 0;
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
  } else if (rating === "hard") {
    repetitions += 1;
    interval = repetitions <= 1 ? 1 : Math.max(2, Math.round(interval * 1.2));
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
  } else if (rating === "good") {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor));
    }
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 2;
    } else if (repetitions === 2) {
      interval = 8;
    } else {
      interval = Math.max(1, Math.round(interval * easeFactor * 1.3));
    }
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor + 0.15);
  }

  return {
    ...current,
    interval,
    easeFactor,
    repetitions,
    lastReviewedAt: reviewedAtIso,
    nextReviewAt: addDays(reviewedAtIso, interval),
  };
}

export function dueLoci(loci: Locus[], nowIso = new Date().toISOString()) {
  const nowMs = Date.parse(nowIso);
  return loci.filter((locus) => {
    const next = normalizeLocusSchedule(locus, nowIso).nextReviewAt;
    return typeof next === "string" && Date.parse(next) <= nowMs;
  });
}
