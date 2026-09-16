import type { Locus } from "../entities/types";
import { defaultLocusSchedule } from "./spacedRepetition";

type MoveDirection = "up" | "down";

function groupRouteIdsInEncounterOrder(loci: Locus[]) {
  const routeIds: string[] = [];
  for (const locus of loci) {
    if (!routeIds.includes(locus.routeId)) routeIds.push(locus.routeId);
  }
  return routeIds;
}

/** Group loci by route and renumber each route's stops 0..n-1 in their current order. */
export function normalizeRouteOrder(loci: Locus[]): Locus[] {
  const routeIds = groupRouteIdsInEncounterOrder(loci);
  return routeIds.flatMap((routeId) =>
    loci
      .filter((locus) => locus.routeId === routeId)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((locus, orderIndex) => ({ ...locus, orderIndex })),
  );
}

export function moveLocus(loci: Locus[], locusId: string, direction: MoveDirection): Locus[] {
  const target = loci.find((locus) => locus.id === locusId);
  if (!target) return normalizeRouteOrder(loci);

  const routeLoci = normalizeRouteOrder(loci).filter((locus) => locus.routeId === target.routeId);
  const currentIndex = routeLoci.findIndex((locus) => locus.id === locusId);
  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= routeLoci.length) {
    return normalizeRouteOrder(loci);
  }

  const reorderedRouteLoci = [...routeLoci];
  [reorderedRouteLoci[currentIndex], reorderedRouteLoci[nextIndex]] = [
    reorderedRouteLoci[nextIndex],
    reorderedRouteLoci[currentIndex],
  ];

  const byId = new Map(reorderedRouteLoci.map((locus, orderIndex) => [locus.id, { ...locus, orderIndex }]));
  return normalizeRouteOrder(loci.map((locus) => byId.get(locus.id) ?? locus));
}

export function deleteLocus(loci: Locus[], locusId: string): Locus[] {
  return normalizeRouteOrder(loci.filter((locus) => locus.id !== locusId));
}

function orderedRoute(loci: readonly Locus[], routeId: string): Locus[] {
  return loci.filter((locus) => locus.routeId === routeId).sort((a, b) => a.orderIndex - b.orderIndex);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type SkippedStop = { nodeId: string; /** 1-based stop number the node already has. */ position: number };

export type AppendStopsResult = { loci: Locus[]; added: Locus[]; skipped: SkippedStop[] };

/**
 * Append nodes to the end of a route with fresh schedules and no custom label. A node the
 * route already visits is skipped and reported with its existing stop number.
 */
export function appendStops(
  loci: Locus[],
  routeId: string,
  nodeIds: readonly string[],
  options: { makeId?: () => string; nowIso?: string } = {},
): AppendStopsResult {
  const makeId = options.makeId ?? (() => crypto.randomUUID());
  const route = orderedRoute(loci, routeId);
  const positionByNode = new Map<string, number>();
  route.forEach((locus, index) => {
    if (!positionByNode.has(locus.nodeId)) positionByNode.set(locus.nodeId, index + 1);
  });
  let nextOrderIndex = route.reduce((max, locus) => Math.max(max, locus.orderIndex), -1) + 1;
  let stopCount = route.length;
  const added: Locus[] = [];
  const skipped: SkippedStop[] = [];
  for (const nodeId of nodeIds) {
    const existing = positionByNode.get(nodeId);
    if (existing !== undefined) {
      skipped.push({ nodeId, position: existing });
      continue;
    }
    stopCount += 1;
    positionByNode.set(nodeId, stopCount);
    added.push({
      id: makeId(),
      routeId,
      nodeId,
      orderIndex: nextOrderIndex,
      label: "",
      ...defaultLocusSchedule(options.nowIso),
    });
    nextOrderIndex += 1;
  }
  return { loci: added.length > 0 ? [...loci, ...added] : loci, added, skipped };
}

/** Move a stop to a 0-based position within its route (clamped). */
export function moveLocusTo(loci: Locus[], locusId: string, toIndex: number): Locus[] {
  const target = loci.find((locus) => locus.id === locusId);
  if (!target) return loci;
  const routeLoci = orderedRoute(loci, target.routeId);
  const fromIndex = routeLoci.findIndex((locus) => locus.id === locusId);
  const destination = clamp(Math.round(toIndex), 0, routeLoci.length - 1);
  if (fromIndex === destination) return loci;
  routeLoci.splice(fromIndex, 1);
  routeLoci.splice(destination, 0, target);
  const byId = new Map(routeLoci.map((locus, orderIndex) => [locus.id, { ...locus, orderIndex }]));
  return normalizeRouteOrder(loci.map((locus) => byId.get(locus.id) ?? locus));
}

/** A stop taken out of its route, with the 0-based position it had, so it can be put back. */
export type RemovedLocus = { locus: Locus; index: number };

export function removeLocus(loci: Locus[], locusId: string): { loci: Locus[]; removed: RemovedLocus | null } {
  const target = loci.find((locus) => locus.id === locusId);
  if (!target) return { loci, removed: null };
  const index = orderedRoute(loci, target.routeId).findIndex((locus) => locus.id === locusId);
  return { loci: deleteLocus(loci, locusId), removed: { locus: target, index } };
}

/** Put removed stops back at their old positions; stops already present are left alone. */
export function restoreLoci(loci: Locus[], removed: readonly RemovedLocus[]): Locus[] {
  let next = loci;
  for (const { locus, index } of [...removed].sort((a, b) => a.index - b.index)) {
    if (next.some((existing) => existing.id === locus.id)) continue;
    const routeLoci = orderedRoute(next, locus.routeId);
    routeLoci.splice(clamp(index, 0, routeLoci.length), 0, locus);
    const byId = new Map(routeLoci.map((entry, orderIndex) => [entry.id, { ...entry, orderIndex }]));
    next = normalizeRouteOrder([...next, locus].map((entry) => byId.get(entry.id) ?? entry));
  }
  return next;
}

/** Take out every stop that points at one of `nodeIds` (e.g. nodes the user just deleted). */
export function detachLociForNodes(
  loci: Locus[],
  nodeIds: ReadonlySet<string>,
): { loci: Locus[]; detached: RemovedLocus[] } {
  const routeIds = new Set(loci.filter((locus) => nodeIds.has(locus.nodeId)).map((locus) => locus.routeId));
  if (routeIds.size === 0) return { loci, detached: [] };
  const detached: RemovedLocus[] = [];
  for (const routeId of routeIds) {
    orderedRoute(loci, routeId).forEach((locus, index) => {
      if (nodeIds.has(locus.nodeId)) detached.push({ locus, index });
    });
  }
  return { loci: normalizeRouteOrder(loci.filter((locus) => !nodeIds.has(locus.nodeId))), detached };
}

export function reassignLocusRoute(loci: Locus[], locusId: string, routeId: string): Locus[] {
  const target = loci.find((locus) => locus.id === locusId);
  if (!target || !routeId || target.routeId === routeId) return normalizeRouteOrder(loci);

  const destinationMax = loci
    .filter((locus) => locus.routeId === routeId)
    .reduce((max, locus) => Math.max(max, locus.orderIndex), -1);

  return normalizeRouteOrder(
    loci.map((locus) =>
      locus.id === locusId
        ? {
            ...locus,
            routeId,
            orderIndex: destinationMax + 1,
          }
        : locus,
    ),
  );
}
