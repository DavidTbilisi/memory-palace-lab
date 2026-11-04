import type { CardKey, Locus, MemoryEdge, MemoryNode, MemoryRoute, Palace } from "../entities/types";
import { cardNodeOf, dueStopCards, stopCards, type CardNode, type StopCard } from "./nedf";

/**
 * Looks up what decides a node's cards: its NEDF slots and whether it is a timeline event. Stops
 * on nodes with no cards review on their single schedule.
 */
export type CardLookup = (nodeId: string) => CardNode;

const NO_CARDS: CardLookup = () => null;

/** A lookup over a snapshot's nodes. */
export function cardLookup(nodes: readonly Pick<MemoryNode, "id" | "nedf" | "storeRole" | "address">[]): CardLookup {
  const byId = new Map(nodes.map((node) => [node.id, cardNodeOf(node)]));
  return (nodeId) => byId.get(nodeId);
}

/**
 * The one definition of "what is due": every consumer (nav badge, Review
 * page, Insights stat cards, Next-up card) derives from `buildDueQueue`.
 */
export type GlobalDueItem = {
  palaceId: string;
  palaceName: string;
  routeId: string;
  routeName: string;
  nodeId: string;
  locusId: string;
  locusLabel: string;
  nodeTitle: string;
  nextReviewAt: string;
  /** The card a review of this stop asks (its most overdue); null for a stop without cards. */
  slot: CardKey | null;
  /** How many of the stop's cards are due; 1 for a stop without slots. */
  dueCards: number;
  /** The stop's place on its route, from 1: names a stop with no label without giving away its node. */
  stopNumber: number;
};

export type DueQueueSnapshot = {
  palace: Palace;
  routes: MemoryRoute[];
  loci: Locus[];
  nodes: MemoryNode[];
  /** Not needed for due-ness; the Strength tab reads confusion links from them. */
  edges?: Pick<MemoryEdge, "sourceNodeId" | "targetNodeId" | "kind">[];
};

export type DueQueue = {
  items: GlobalDueItem[];
  countByPalace: Map<string, number>;
  countByRoute: Map<string, number>;
  /** Mean scheduled interval (days) across loci that have one; null when none do. */
  averageInterval: number | null;
};

export function compareDueItems(a: GlobalDueItem, b: GlobalDueItem): number {
  const dueCmp = Date.parse(a.nextReviewAt) - Date.parse(b.nextReviewAt);
  if (dueCmp !== 0) return dueCmp;
  if (a.palaceName !== b.palaceName) return a.palaceName.localeCompare(b.palaceName);
  if (a.routeName !== b.routeName) return a.routeName.localeCompare(b.routeName);
  return a.nodeTitle.localeCompare(b.nodeTitle);
}

/** A route marked "not in review" is a draft: its stops keep their schedule but are never due. */
export function isRouteInReview(route: Pick<MemoryRoute, "inReview"> | null | undefined): boolean {
  return route?.inReview !== false;
}

/** The loci that count toward review: every stop except those on draft routes. */
export function reviewedLoci<T extends Pick<Locus, "routeId">>(
  loci: readonly T[],
  routes: readonly Pick<MemoryRoute, "id" | "inReview">[],
): T[] {
  const drafts = new Set(routes.filter((route) => !isRouteInReview(route)).map((route) => route.id));
  return drafts.size === 0 ? [...loci] : loci.filter((locus) => !drafts.has(locus.routeId));
}

function meanInterval(cards: readonly StopCard[]): number | null {
  const intervals = cards.map((card) => card.schedule.interval).filter((value) => value > 0);
  if (intervals.length === 0) return null;
  return Math.round(intervals.reduce((total, value) => total + value, 0) / intervals.length);
}

/** Mean scheduled interval over every card (one per NEDF slot, or the stop's own), rounded. */
export function averageLocusInterval(
  loci: readonly Locus[],
  nowIso = new Date().toISOString(),
  cardsOf: CardLookup = NO_CARDS,
): number | null {
  return meanInterval(loci.flatMap((locus) => stopCards(locus, cardsOf(locus.nodeId), nowIso)));
}

/** Number of stops with anything due now (the nav badge and stat cards). */
export function countDueLoci(
  loci: readonly Locus[],
  nowIso = new Date().toISOString(),
  cardsOf: CardLookup = NO_CARDS,
): number {
  return loci.filter((locus) => dueStopCards(locus, cardsOf(locus.nodeId), nowIso).length > 0).length;
}

/** Build the cross-palace queue from already-loaded snapshots. Pure. */
export function buildDueQueue(snapshots: readonly DueQueueSnapshot[], nowIso = new Date().toISOString()): DueQueue {
  const items: GlobalDueItem[] = [];
  const countByPalace = new Map<string, number>();
  const countByRoute = new Map<string, number>();
  const cards: StopCard[] = [];

  for (const snapshot of snapshots) {
    const routeById = new Map(snapshot.routes.map((route) => [route.id, route]));
    const nodeById = new Map(snapshot.nodes.map((node) => [node.id, node]));
    const cardsOf = cardLookup(snapshot.nodes);
    const loci = reviewedLoci(snapshot.loci, snapshot.routes);
    const stopNumberById = new Map<string, number>();
    for (const route of snapshot.routes) {
      snapshot.loci
        .filter((locus) => locus.routeId === route.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .forEach((locus, index) => stopNumberById.set(locus.id, index + 1));
    }
    cards.push(...loci.flatMap((locus) => stopCards(locus, cardsOf(locus.nodeId), nowIso)));
    for (const locus of loci) {
      const due = dueStopCards(locus, cardsOf(locus.nodeId), nowIso);
      if (due.length === 0) continue;
      const route = routeById.get(locus.routeId);
      if (!route) continue;
      const node = nodeById.get(locus.nodeId);
      items.push({
        palaceId: snapshot.palace.id,
        palaceName: snapshot.palace.name,
        routeId: route.id,
        routeName: route.name,
        nodeId: locus.nodeId,
        locusId: locus.id,
        locusLabel: locus.label,
        nodeTitle: node?.title?.trim() || "Untitled node",
        nextReviewAt: due[0]!.schedule.nextReviewAt,
        slot: due[0]!.slot,
        dueCards: due.length,
        stopNumber: stopNumberById.get(locus.id) ?? locus.orderIndex + 1,
      });
      countByPalace.set(snapshot.palace.id, (countByPalace.get(snapshot.palace.id) ?? 0) + 1);
      countByRoute.set(route.id, (countByRoute.get(route.id) ?? 0) + 1);
    }
  }

  items.sort(compareDueItems);
  return { items, countByPalace, countByRoute, averageInterval: meanInterval(cards) };
}

export const EMPTY_DUE_QUEUE: DueQueue = {
  items: [],
  countByPalace: new Map(),
  countByRoute: new Map(),
  averageInterval: null,
};
