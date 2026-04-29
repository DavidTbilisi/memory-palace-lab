import type { Locus, MemoryRoute } from "../../entities/types";
import type { DslDiagnostic, DslRoute } from "./types";

export interface RouteReconcileResult {
  routes: MemoryRoute[];
  loci: Locus[];
  added: { routes: number; loci: number };
  deleted: { routes: number; loci: number };
  errors: DslDiagnostic[];
}

export interface ReconcileRoutesInput {
  palaceId: string;
  currentRoutes: MemoryRoute[];
  currentLoci: Locus[];
  intent: DslRoute[];
  titleToNodeId: Map<string, string>;
  uuid?: () => string;
}

export function reconcileRoutes(input: ReconcileRoutesInput): RouteReconcileResult {
  const {
    palaceId,
    currentRoutes,
    currentLoci,
    intent,
    titleToNodeId,
    uuid = () => crypto.randomUUID(),
  } = input;

  const errors: DslDiagnostic[] = [];
  const intentNames = new Set(intent.map((r) => r.name));
  const currentByName = new Map(currentRoutes.map((r) => [r.name, r]));

  const nextRoutes: MemoryRoute[] = [];
  const nextLoci: Locus[] = [];
  let addedRoutes = 0;
  let addedLoci = 0;

  for (const intentRoute of intent) {
    const existing = currentByName.get(intentRoute.name);
    const route: MemoryRoute = existing ?? {
      id: uuid(),
      palaceId,
      name: intentRoute.name,
    };
    if (!existing) addedRoutes += 1;
    nextRoutes.push(route);

    const prevForRoute = existing
      ? currentLoci.filter((l) => l.routeId === existing.id)
      : [];

    intentRoute.loci.forEach((title, idx) => {
      const nodeId = titleToNodeId.get(title);
      if (!nodeId) {
        errors.push({
          severity: "error",
          code: "unknown-target",
          line: intentRoute.sourceLine,
          column: 1,
          length: 1,
          message: `Locus "${title}" maps to no node on the canvas`,
        });
        return;
      }
      const matched = prevForRoute.find((l) => l.nodeId === nodeId);
      const locus: Locus = matched
        ? { ...matched, orderIndex: idx }
        : {
            id: uuid(),
            routeId: route.id,
            nodeId,
            orderIndex: idx,
            label: "",
          };
      if (!matched) addedLoci += 1;
      nextLoci.push(locus);
    });
  }

  const deletedRoutes = currentRoutes.filter(
    (r) => !intentNames.has(r.name),
  ).length;

  const survivingLocusIds = new Set(nextLoci.map((l) => l.id));
  const deletedLoci = currentLoci.filter((l) => !survivingLocusIds.has(l.id))
    .length;

  return {
    routes: nextRoutes,
    loci: nextLoci,
    added: { routes: addedRoutes, loci: addedLoci },
    deleted: { routes: deletedRoutes, loci: deletedLoci },
    errors,
  };
}
