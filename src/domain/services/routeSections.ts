import type { Locus } from "../entities/types";

/** Routes longer than this are easier to rehearse in named sections ("rooms"). */
export const SECTIONED_ROUTE_STOPS = 12;

/** The name of the section a stop falls in, given its position in route order. */
export function sectionNameAt<T extends Pick<Locus, "section">>(
  orderedStops: readonly T[],
  routeIndex: number,
): string | null {
  for (let index = Math.min(routeIndex, orderedStops.length - 1); index >= 0; index--) {
    const name = orderedStops[index]?.section?.trim();
    if (name) return name;
  }
  return null;
}
