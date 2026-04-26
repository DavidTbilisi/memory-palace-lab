import type { Locus } from "../entities/types";

type MoveDirection = "up" | "down";

function groupRouteIdsInEncounterOrder(loci: Locus[]) {
  const routeIds: string[] = [];
  for (const locus of loci) {
    if (!routeIds.includes(locus.routeId)) routeIds.push(locus.routeId);
  }
  return routeIds;
}

function normalizeRouteOrder(loci: Locus[]): Locus[] {
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
