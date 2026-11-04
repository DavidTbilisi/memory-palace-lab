import type { Locus, MemoryRoute } from "../entities/types";
import { isRouteInReview } from "./dueQueue";
import { stopCards, type StopCard } from "./nedf";
import type { DatedEvent } from "./timeline";

/**
 * The timeline order drill (backlog 20): a run of neighbouring events, shuffled, put back in date
 * order by the learner. Events out of place have their Event → date card pulled forward.
 *
 * Pure: no React, no store.
 */

/** Up to this many neighbouring events per drill. */
export const ORDER_DRILL_SIZE = 5;
/** Fewer events than this make no ordering to drill. */
export const ORDER_DRILL_MIN = 3;

const TIMELINE_CARD_NODE = { timelineEvent: true };

/** A stop's Event → date card: its own schedule, or the stop's while it has never been rated. */
export function eventToDateCard(locus: Locus, nowIso: string): StopCard {
  return stopCards(locus, TIMELINE_CARD_NODE, nowIso).find((card) => card.slot === "eventToDate")!;
}

/**
 * Which of `events` (in date order) is weakest: the most overdue Event → date card, then the
 * lowest ease, then the one due soonest. An event with no stop counts as never reviewed, which is
 * as weak as an event can be. Null for no events.
 */
export function weakestEventIndex(
  events: readonly DatedEvent[],
  stopOf: (nodeId: string) => Locus | undefined,
  nowIso: string,
): number | null {
  if (events.length === 0) return null;
  const score = (event: DatedEvent): [number, number, number] => {
    const locus = stopOf(event.nodeId);
    if (!locus) return [Number.NEGATIVE_INFINITY, 0, 0];
    const { schedule } = eventToDateCard(locus, nowIso);
    const due = Date.parse(schedule.nextReviewAt);
    const overdue = Math.max(0, Date.parse(nowIso) - due);
    // Lower sorts weaker: more overdue, then lower ease, then due sooner.
    return [-overdue, schedule.easeFactor, due];
  };
  let weakest = 0;
  let weakestScore = score(events[0]!);
  events.forEach((event, index) => {
    const candidate = score(event);
    for (let i = 0; i < 3; i++) {
      if (candidate[i]! < weakestScore[i]!) {
        weakest = index;
        weakestScore = candidate;
        return;
      }
      if (candidate[i]! > weakestScore[i]!) return;
    }
  });
  return weakest;
}

/** A run of up to `size` neighbouring events centred on `centre`, kept inside the timeline. */
export function drillRun<T>(events: readonly T[], centre: number, size = ORDER_DRILL_SIZE): T[] {
  const length = Math.min(size, events.length);
  const start = Math.min(Math.max(centre - Math.floor(length / 2), 0), events.length - length);
  return events.slice(start, start + length);
}

/**
 * A shuffled order of `items` that is never the right one, so the drill always has work in it.
 * Items whose order cannot be wrong (one item, or all on one date) come back as they are.
 */
export function shuffleForDrill<T>(items: readonly T[], isCorrect: (order: readonly T[]) => boolean, random = Math.random): T[] {
  const order = [...items];
  for (let attempt = 0; attempt < 20; attempt++) {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    if (!isCorrect(order)) return order;
  }
  // Every shuffle came out right; reversing is wrong whenever any order can be.
  const reversed = [...items].reverse();
  return isCorrect(reversed) ? order : reversed;
}

/**
 * Which events the learner put out of place. An event is in place when its position is one the
 * date order allows: events on the same date may come in either order among themselves.
 */
export function misplacedEvents(answer: readonly DatedEvent[]): string[] {
  const keys = answer.map((event) => event.date.startKey).sort((a, b) => a - b);
  return answer.flatMap((event, position) => {
    const first = keys.indexOf(event.date.startKey);
    const last = keys.lastIndexOf(event.date.startKey);
    return position < first || position > last ? [event.nodeId] : [];
  });
}

export function isInDateOrder(answer: readonly DatedEvent[]): boolean {
  return misplacedEvents(answer).length === 0;
}

/**
 * Bring misplaced events' Event → date cards due now. Only stops on routes in review move, only
 * that card moves, and only forward: a card already due keeps its time, ease and history.
 */
export function pullEventsForward(
  loci: readonly Locus[],
  routes: readonly Pick<MemoryRoute, "id" | "inReview">[],
  nodeIds: readonly string[],
  atIso: string,
): { loci: Locus[]; pulledLocusIds: string[] } {
  const wanted = new Set(nodeIds);
  const inReview = new Set(routes.filter(isRouteInReview).map((route) => route.id));
  const at = Date.parse(atIso);
  const pulledLocusIds: string[] = [];
  const next = loci.map((locus) => {
    if (!wanted.has(locus.nodeId) || !inReview.has(locus.routeId)) return locus;
    const card = eventToDateCard(locus, atIso);
    if (Date.parse(card.schedule.nextReviewAt) <= at) return locus;
    pulledLocusIds.push(locus.id);
    return { ...locus, slotSchedules: { ...locus.slotSchedules, eventToDate: { ...card.schedule, nextReviewAt: atIso } } };
  });
  return { loci: next, pulledLocusIds };
}
