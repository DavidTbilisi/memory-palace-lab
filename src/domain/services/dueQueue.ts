import type { Locus, MemoryNode, MemoryRoute, Palace } from "../entities/types";
import { dueLoci, normalizeLocusSchedule } from "./spacedRepetition";

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
};

export type DueQueueSnapshot = {
  palace: Palace;
  routes: MemoryRoute[];
  loci: Locus[];
  nodes: MemoryNode[];
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

/** Mean scheduled interval over loci with a positive interval, rounded. */
export function averageLocusInterval(loci: readonly Locus[], nowIso = new Date().toISOString()): number | null {
  const intervals = loci.map((locus) => normalizeLocusSchedule(locus, nowIso).interval ?? 0).filter((value) => value > 0);
  if (intervals.length === 0) return null;
  return Math.round(intervals.reduce((total, value) => total + value, 0) / intervals.length);
}

/** Number of loci due now in one set (the nav badge and stat cards). */
export function countDueLoci(loci: readonly Locus[], nowIso = new Date().toISOString()): number {
  return dueLoci([...loci], nowIso).length;
}

/** Build the cross-palace queue from already-loaded snapshots. Pure. */
export function buildDueQueue(snapshots: readonly DueQueueSnapshot[], nowIso = new Date().toISOString()): DueQueue {
  const items: GlobalDueItem[] = [];
  const countByPalace = new Map<string, number>();
  const countByRoute = new Map<string, number>();
  const allLoci: Locus[] = [];

  for (const snapshot of snapshots) {
    const routeById = new Map(snapshot.routes.map((route) => [route.id, route]));
    const nodeById = new Map(snapshot.nodes.map((node) => [node.id, node]));
    allLoci.push(...snapshot.loci);
    for (const locus of dueLoci([...snapshot.loci], nowIso)) {
      const route = routeById.get(locus.routeId);
      if (!route) continue;
      const scheduled = normalizeLocusSchedule(locus, nowIso);
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
        nextReviewAt: scheduled.nextReviewAt ?? nowIso,
      });
      countByPalace.set(snapshot.palace.id, (countByPalace.get(snapshot.palace.id) ?? 0) + 1);
      countByRoute.set(route.id, (countByRoute.get(route.id) ?? 0) + 1);
    }
  }

  items.sort(compareDueItems);
  return { items, countByPalace, countByRoute, averageInterval: averageLocusInterval(allLoci, nowIso) };
}

export const EMPTY_DUE_QUEUE: DueQueue = {
  items: [],
  countByPalace: new Map(),
  countByRoute: new Map(),
  averageInterval: null,
};
