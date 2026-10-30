import type { AnalyticsEvent, Locus, MemoryRoute } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";
import { isRouteInReview, type NedfLookup } from "./dueQueue";
import { isSlotFilled, stopCards } from "./nedf";

/**
 * Confusions caught in review (backlog 07). A recall rated Again can be explained: the learner
 * mixed it up with another node (a confusion) or could not produce it at all (a blank, the
 * tip of the tongue, which is not a confusion). A logged confusion pulls both nodes'
 * Distinguisher cards forward, and repeated pairs surface as hotspots on the Strength tab.
 *
 * Pure: no React, no store.
 */

export type MissCause = "confusion" | "blank";

/** One `recall_miss_explained` event that names a confusion, read back. */
export type LoggedConfusion = {
  event: AnalyticsEvent;
  nodeId: string;
  otherNodeId: string;
  nodeTitle: string | null;
  otherTitle: string | null;
};

/** The same key for (a, b) and (b, a). */
export function unorderedPairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** The confusion an event logs, or null for a blank, another event type, or a malformed row. */
export function readLoggedConfusion(event: AnalyticsEvent): LoggedConfusion | null {
  if (event.eventType !== "recall_miss_explained" || !event.nodeId) return null;
  const payload = parseAnalyticsPayload(event);
  if (payload.cause !== "confusion") return null;
  const other = payload.confusedWithNodeId;
  if (typeof other !== "string" || !other || other === event.nodeId) return null;
  return {
    event,
    nodeId: event.nodeId,
    otherNodeId: other,
    nodeTitle: typeof payload.nodeTitle === "string" ? payload.nodeTitle : null,
    otherTitle: typeof payload.confusedWithTitle === "string" ? payload.confusedWithTitle : null,
  };
}

/** Whether this pair has been logged as a confusion before, whichever node was missed. */
export function hasLoggedConfusion(events: readonly AnalyticsEvent[], a: string, b: string): boolean {
  const key = unorderedPairKey(a, b);
  return events.some((event) => {
    const logged = readLoggedConfusion(event);
    return logged !== null && unorderedPairKey(logged.nodeId, logged.otherNodeId) === key;
  });
}

export type PullForwardResult = {
  /** Every locus, with the pulled cards moved. */
  loci: Locus[];
  /** Stops whose Distinguisher card now comes due at `at`. */
  pulledLocusIds: string[];
  /** Asked-for nodes with no filled Distinguisher: nothing of theirs moved. */
  withoutDistinguisher: string[];
};

/**
 * Bring the nodes' Distinguisher cards due now, the way a "collapse" in the phonology gym brings
 * the pair back. Only stops on routes in review move, only the Distinguisher slot moves, and only
 * forward: a card already due by `at` keeps its time, and ease, interval, and history are kept.
 */
export function pullDistinguishersForward(
  loci: readonly Locus[],
  routes: readonly Pick<MemoryRoute, "id" | "inReview">[],
  nedfOf: NedfLookup,
  nodeIds: readonly string[],
  atIso: string,
): PullForwardResult {
  const wanted = new Set(nodeIds);
  const withoutDistinguisher = [...wanted].filter((nodeId) => !isSlotFilled(nedfOf(nodeId), "distinguisher"));
  const inReview = new Set(routes.filter(isRouteInReview).map((route) => route.id));
  const at = Date.parse(atIso);
  const pulledLocusIds: string[] = [];
  const next = loci.map((locus) => {
    if (!wanted.has(locus.nodeId) || !inReview.has(locus.routeId)) return locus;
    const nedf = nedfOf(locus.nodeId);
    if (!isSlotFilled(nedf, "distinguisher")) return locus;
    // Its own schedule, or the stop's when the slot was never rated on its own.
    const card = stopCards(locus, nedf, atIso).find((candidate) => candidate.slot === "distinguisher");
    if (!card || Date.parse(card.schedule.nextReviewAt) <= at) return locus;
    pulledLocusIds.push(locus.id);
    return {
      ...locus,
      slotSchedules: { ...locus.slotSchedules, distinguisher: { ...card.schedule, nextReviewAt: atIso } },
    };
  });
  return { loci: next, pulledLocusIds, withoutDistinguisher };
}
