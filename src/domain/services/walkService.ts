import type { MemoryRoute, WalkDirection } from "../entities/types";

/** Pure walk navigation over ordered loci (by orderIndex ascending). */

export function orderedLoci<T extends { orderIndex: number }>(loci: T[]): T[] {
  return [...loci].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function clampWalkIndex(index: number, locusCount: number): number {
  if (locusCount <= 0) return 0;
  return Math.max(0, Math.min(index, locusCount - 1));
}

export function walkNext(currentIndex: number, locusCount: number): number {
  return clampWalkIndex(currentIndex + 1, locusCount);
}

export function walkPrevious(currentIndex: number, locusCount: number): number {
  return clampWalkIndex(currentIndex - 1, locusCount);
}

export function locusAtOrderedIndex<T extends { orderIndex: number }>(
  loci: T[],
  orderedPosition: number,
): T | undefined {
  const ordered = [...loci].sort((a, b) => a.orderIndex - b.orderIndex);
  return ordered[orderedPosition];
}

/** The direction the next walk of a route takes; `alternate` flips the previous walk's. */
export function nextWalkDirection(
  route: Pick<MemoryRoute, "direction" | "lastWalkDirection"> | null | undefined,
): WalkDirection {
  if (route?.direction === "reverse") return "reverse";
  if (route?.direction === "alternate") return route.lastWalkDirection === "forward" ? "reverse" : "forward";
  return "forward";
}

/** A route's stops in the order a walk visits them. */
export function walkOrderedLoci<T extends { orderIndex: number }>(loci: T[], direction: WalkDirection): T[] {
  const ordered = orderedLoci(loci);
  return direction === "reverse" ? ordered.reverse() : ordered;
}

/** Map a walk step to the stop's position in the route's own order, and back (it is symmetric). */
export function routeIndexOfWalkStep(walkIndex: number, count: number, direction: WalkDirection): number {
  return direction === "reverse" ? count - 1 - walkIndex : walkIndex;
}
