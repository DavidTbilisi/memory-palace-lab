import {
  NEDF_SLOTS,
  type Locus,
  type NedfEncoding,
  type NedfSlot,
  type RecallRating,
  type SlotSchedule,
} from "../entities/types";
import { applySm2Schedule, normalizeLocusSchedule } from "./spacedRepetition";

export const NEDF_SLOT_LABELS: Record<NedfSlot, string> = {
  nameHook: "Name-hook",
  essence: "Essence",
  distinguisher: "Distinguisher",
  failure: "Failure",
};

/** The memory operation each slot drills when it is reviewed. */
export const NEDF_SLOT_OPERATIONS: Record<NedfSlot, string> = {
  nameHook: "Recognition",
  essence: "Recall",
  distinguisher: "Discrimination",
  failure: "Diagnosis",
};

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function pair<K extends string>(value: unknown, first: K, second: K): Record<K, string> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const a = typeof raw[first] === "string" ? (raw[first] as string).trim() : "";
  const b = typeof raw[second] === "string" ? (raw[second] as string).trim() : "";
  if (!a && !b) return undefined;
  return { [first]: a, [second]: b } as Record<K, string>;
}

/**
 * Tolerant reader and normalizer: trims every field and drops empty ones. A half-written pair
 * (a prompt with no reason) is kept, so the inspector can show it, but it does not count as filled.
 * Returns `null` when nothing is left.
 */
export function normalizeNedf(value: unknown): NedfEncoding | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const nedf: NedfEncoding = {};
  const nameHook = text(raw.nameHook);
  if (nameHook) nedf.nameHook = nameHook;
  const essence = text(raw.essence);
  if (essence) nedf.essence = essence;
  const distinguisher = pair(raw.distinguisher, "prompt", "reason");
  if (distinguisher) nedf.distinguisher = distinguisher;
  const failure = pair(raw.failure, "scenario", "correction");
  if (failure) nedf.failure = failure;
  return Object.keys(nedf).length > 0 ? nedf : null;
}

/** Whether a slot is complete enough to review: text slots need text, pairs need both halves. */
export function isSlotFilled(nedf: NedfEncoding | null | undefined, slot: NedfSlot): boolean {
  if (!nedf) return false;
  switch (slot) {
    case "nameHook":
      return !!text(nedf.nameHook);
    case "essence":
      return !!text(nedf.essence);
    case "distinguisher":
      return !!text(nedf.distinguisher?.prompt) && !!text(nedf.distinguisher?.reason);
    case "failure":
      return !!text(nedf.failure?.scenario) && !!text(nedf.failure?.correction);
  }
}

export function filledNedfSlots(nedf: NedfEncoding | null | undefined): NedfSlot[] {
  return NEDF_SLOTS.filter((slot) => isSlotFilled(nedf, slot));
}

/** The slots a partly encoded node still lacks, reported rather than failed. */
export function unencodedNedfSlots(nedf: NedfEncoding | null | undefined): NedfSlot[] {
  return NEDF_SLOTS.filter((slot) => !isSlotFilled(nedf, slot));
}

/** A node with any slot filled is NEDF-encoded and reviews per slot. */
export function isNedfEncoded(nedf: NedfEncoding | null | undefined): boolean {
  return filledNedfSlots(nedf).length > 0;
}

/**
 * One reviewable card on a stop. `slot` is null for a stop whose node has no NEDF slots, which
 * keeps reviewing on the stop's own (legacy) schedule.
 */
export interface StopCard {
  slot: NedfSlot | null;
  schedule: SlotSchedule;
}

function stopSchedule(locus: Locus, nowIso: string): SlotSchedule {
  const normalized = normalizeLocusSchedule(locus, nowIso);
  return {
    interval: normalized.interval!,
    easeFactor: normalized.easeFactor!,
    repetitions: normalized.repetitions!,
    nextReviewAt: normalized.nextReviewAt!,
    lastReviewedAt: normalized.lastReviewedAt ?? null,
  };
}

/**
 * The cards a stop reviews: one per filled slot, or the stop's single schedule when its node has
 * none. A slot never rated yet starts from the stop's schedule, so a new stop comes due as it
 * always has and an older stop's history carries over to its slots.
 */
export function stopCards(
  locus: Locus,
  nedf: NedfEncoding | null | undefined,
  nowIso = new Date().toISOString(),
): StopCard[] {
  const base = stopSchedule(locus, nowIso);
  const slots = filledNedfSlots(nedf);
  if (slots.length === 0) return [{ slot: null, schedule: base }];
  return slots.map((slot) => {
    const own = locus.slotSchedules?.[slot];
    return { slot, schedule: own ? normalizeLocusSchedule(own, nowIso) : base };
  });
}

const dueMs = (card: StopCard) => Date.parse(card.schedule.nextReviewAt);

/** The cards on a stop that are due now, most overdue first. */
export function dueStopCards(
  locus: Locus,
  nedf: NedfEncoding | null | undefined,
  nowIso = new Date().toISOString(),
): StopCard[] {
  const now = Date.parse(nowIso);
  return stopCards(locus, nedf, nowIso)
    .filter((card) => dueMs(card) <= now)
    .sort((a, b) => dueMs(a) - dueMs(b));
}

/**
 * The one card a walk asks at a stop: the most overdue, or when nothing is due the one that
 * comes due soonest. Ties keep the N·E·D·F order.
 */
export function walkCardFor(
  locus: Locus,
  nedf: NedfEncoding | null | undefined,
  nowIso = new Date().toISOString(),
): StopCard {
  const cards = stopCards(locus, nedf, nowIso);
  return cards.reduce((best, card) => (dueMs(card) < dueMs(best) ? card : best), cards[0]!);
}

/** When the stop next has something to review: its earliest card. */
export function stopNextReviewAt(
  locus: Locus,
  nedf: NedfEncoding | null | undefined,
  nowIso = new Date().toISOString(),
): string {
  return walkCardFor(locus, nedf, nowIso).schedule.nextReviewAt;
}

/**
 * Rate one card. A slot's rating moves only that slot's schedule (siblings are independent);
 * a stop without slots moves its own schedule as before.
 */
export function rateStopCard(
  locus: Locus,
  slot: NedfSlot | null,
  rating: RecallRating,
  ratedAtIso = new Date().toISOString(),
): Locus {
  if (slot === null) return applySm2Schedule(locus, rating, ratedAtIso);
  const start = locus.slotSchedules?.[slot] ?? stopSchedule(locus, ratedAtIso);
  return {
    ...locus,
    slotSchedules: { ...locus.slotSchedules, [slot]: applySm2Schedule(start, rating, ratedAtIso) },
  };
}

function isSlotSchedule(value: unknown): value is SlotSchedule {
  if (!value || typeof value !== "object") return false;
  const raw = value as Record<string, unknown>;
  const finite = (key: string) => typeof raw[key] === "number" && Number.isFinite(raw[key]);
  return (
    finite("interval") &&
    finite("easeFactor") &&
    finite("repetitions") &&
    typeof raw.nextReviewAt === "string" &&
    !Number.isNaN(Date.parse(raw.nextReviewAt)) &&
    (raw.lastReviewedAt === null || typeof raw.lastReviewedAt === "string")
  );
}

/** Tolerant reader for stored slot schedules: unknown slots and malformed entries are dropped. */
export function decodeSlotSchedules(value: unknown): Locus["slotSchedules"] {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const schedules: Partial<Record<NedfSlot, SlotSchedule>> = {};
  for (const slot of NEDF_SLOTS) {
    const entry = raw[slot];
    if (isSlotSchedule(entry)) {
      const { interval, easeFactor, repetitions, nextReviewAt, lastReviewedAt } = entry;
      schedules[slot] = { interval, easeFactor, repetitions, nextReviewAt, lastReviewedAt };
    }
  }
  return Object.keys(schedules).length > 0 ? schedules : undefined;
}
