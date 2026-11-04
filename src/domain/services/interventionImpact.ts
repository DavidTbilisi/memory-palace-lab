import type { AnalyticsEvent } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";
import { siegeRatings } from "./memoryStrengthService";

/**
 * Whether an intervention helped (backlog 19, PR 2): recall on what it touched, before it and
 * after it. Recall is the share of Siege ratings that were Good or Easy.
 *
 * Pure: no React, no store.
 */

/** Ratings compared on each side of an intervention. */
export const IMPACT_WINDOW = 5;
/** An intervention is judged once this many ratings follow it. */
export const IMPACT_MIN_AFTER = 3;

export type RecallTally = { good: number; total: number };

export type InterventionImpact = {
  eventId: string;
  kind: string;
  title: string;
  acceptedAt: string;
  before: RecallTally;
  after: RecallTally;
  /** Enough ratings since to judge it. */
  ready: boolean;
};

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item !== "") : [];

function tally(ratings: readonly { rating: string }[]): RecallTally {
  return { good: ratings.filter((entry) => entry.rating === "good" || entry.rating === "easy").length, total: ratings.length };
}

/**
 * Every accepted intervention, latest first, with recall on its nodes (or, for route surgery, its
 * routes) over the last `IMPACT_WINDOW` ratings before it and the first `IMPACT_WINDOW` after.
 */
export function measureInterventions(events: readonly AnalyticsEvent[]): InterventionImpact[] {
  const ratings = siegeRatings(events)
    .map((entry) => ({ entry, at: Date.parse(entry.event.createdAt) }))
    .sort((a, b) => a.at - b.at);
  const impacts: InterventionImpact[] = [];
  for (const event of events) {
    if (event.eventType !== "intervention_accepted") continue;
    const payload = parseAnalyticsPayload(event);
    const nodeIds = new Set(strings(payload.nodeIds));
    const routeIds = new Set(strings(payload.routeIds));
    if (nodeIds.size === 0 && routeIds.size === 0) continue;
    const at = Date.parse(event.createdAt);
    const touched = ratings.filter(({ entry }) =>
      routeIds.size > 0 ? routeIds.has(entry.event.routeId ?? "") : nodeIds.has(entry.event.nodeId ?? ""),
    );
    const before = touched.filter((rating) => rating.at < at).slice(-IMPACT_WINDOW);
    const after = touched.filter((rating) => rating.at > at).slice(0, IMPACT_WINDOW);
    impacts.push({
      eventId: event.id,
      kind: typeof payload.kind === "string" ? payload.kind : "intervention",
      title: typeof payload.title === "string" ? payload.title : "",
      acceptedAt: event.createdAt,
      before: tally(before.map(({ entry }) => entry)),
      after: tally(after.map(({ entry }) => entry)),
      ready: after.length >= IMPACT_MIN_AFTER,
    });
  }
  return impacts.sort((a, b) => Date.parse(b.acceptedAt) - Date.parse(a.acceptedAt));
}

/** "30%", or "–" when there is nothing to count. */
export function formatRecall({ good, total }: RecallTally): string {
  return total === 0 ? "–" : `${Math.round((good / total) * 100)}%`;
}
