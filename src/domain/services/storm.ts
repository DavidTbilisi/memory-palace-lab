import type { AnalyticsEvent } from "../entities/types";

/**
 * Storm: one large push that encodes new material, as opposed to the daily Siege drip the review
 * queue runs. Its count is new nodes encoded; the reviews come afterwards, in the normal queue.
 */

/** The wiki's ramp, used as target presets. It is a sequence of volumes, not skill levels. */
export const STORM_TARGET_PRESETS = [100, 200, 400, 700, 1000] as const;
export const DEFAULT_STORM_TARGET = 100;
export const MAX_STORM_TARGET = 5000;
export const DEFAULT_WAKE_TIME = "07:00";

/** A learner's day starts this long before wake time, so an encode at 2am still belongs to the night before. */
const DAY_STARTS_BEFORE_WAKE_MS = 3 * 60 * 60 * 1000;

export function clampStormTarget(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_STORM_TARGET;
  return Math.max(1, Math.min(MAX_STORM_TARGET, Math.round(value)));
}

/** "HH:MM" in 24-hour time, or null. */
export function parseWakeTime(value: string | null | undefined): { hours: number; minutes: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() ?? "");
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

/**
 * When material encoded at `encodedAt` is first reviewed: at wake time after the next night's
 * sleep, not a fixed number of hours later. Local time throughout. A learner's day runs from
 * three hours before wake time, so something encoded at 22:30 or at 02:00 is first due at wake
 * time that morning after, and something encoded at 06:30 waits for the night ahead.
 */
export function firstReviewAfterSleep(encodedAt: Date, wakeTime: string = DEFAULT_WAKE_TIME): Date {
  const wake = parseWakeTime(wakeTime) ?? parseWakeTime(DEFAULT_WAKE_TIME)!;
  const wakeOffsetMs = (wake.hours * 60 + wake.minutes) * 60 * 1000;
  const dayOf = new Date(encodedAt.getTime() - wakeOffsetMs + DAY_STARTS_BEFORE_WAKE_MS);
  const due = new Date(dayOf.getFullYear(), dayOf.getMonth(), dayOf.getDate() + 1, wake.hours, wake.minutes);
  return due;
}

/** Items per hour over the Storm's active time; null when there is no measured time. */
export function stormRatePerHour(count: number, activeMs: number | null): number | null {
  if (activeMs === null || activeMs <= 0) return null;
  return Math.round((count / activeMs) * 3_600_000 * 10) / 10;
}

export type StormResult = {
  stormId: string;
  routeId: string;
  target: number;
  count: number;
  activeMs: number | null;
  wallMs: number;
  ratePerHour: number | null;
  /** Why it ended: the target was reached, or the learner stopped it. */
  endedBy: "target" | "stopped";
  personalBest: boolean;
};

/** The largest count among recorded Storms, or 0 when there are none. */
export function bestStormCount(events: readonly AnalyticsEvent[]): number {
  return stormRecords(events).bestCount;
}

/** A Storm sets a personal best when it encoded something and beat every earlier Storm. */
export function isPersonalBest(count: number, previousBest: number): boolean {
  return count > 0 && count > previousBest;
}

export type StormRecord = {
  at: string;
  routeName: string;
  target: number;
  count: number;
  activeMs: number | null;
  ratePerHour: number | null;
  personalBest: boolean;
};

export type StormRecords = {
  /** Newest first. */
  storms: StormRecord[];
  bestCount: number;
  bestRatePerHour: number | null;
};

const finite = (value: unknown): number | null => (typeof value === "number" && Number.isFinite(value) ? value : null);

/** Every recorded Storm, with the best count and the best rate among them. */
export function stormRecords(events: readonly AnalyticsEvent[]): StormRecords {
  const storms: StormRecord[] = [];
  for (const event of events) {
    if (event.eventType !== "storm_completed") continue;
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(event.payloadJson) as Record<string, unknown>;
    } catch {
      continue;
    }
    const count = finite(payload.count);
    if (count === null) continue;
    storms.push({
      at: event.createdAt,
      routeName: typeof payload.routeName === "string" ? payload.routeName : "Storm",
      target: finite(payload.target) ?? count,
      count,
      activeMs: finite(payload.activeMs),
      ratePerHour: finite(payload.ratePerHour),
      personalBest: payload.personalBest === true,
    });
  }
  storms.sort((a, b) => b.at.localeCompare(a.at));
  const rates = storms.map((storm) => storm.ratePerHour).filter((rate): rate is number => rate !== null);
  return {
    storms,
    bestCount: storms.reduce((best, storm) => Math.max(best, storm.count), 0),
    bestRatePerHour: rates.length > 0 ? Math.max(...rates) : null,
  };
}
