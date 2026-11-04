import type { Locus, MemoryRoute } from "../entities/types";
import { sectionNameAt } from "./routeSections";
import { orderedLoci } from "./walkService";

/**
 * Route surgery (backlog 19, PR 2): a concrete change to a route that costs too much to walk. The
 * app proposes it; the learner applies it, and can undo it. Stops keep their schedules: a stop
 * moved to another route moves with its history.
 *
 * Pure: no React, no store.
 */

/** A route this long is split in two rather than trimmed. */
export const SPLIT_MIN_STOPS = 8;
/** Fewer weak stops than this are not worth a route of their own. */
export const WEAK_MIN = 2;
/** At most this many weak stops go into their own route. */
export const WEAK_MAX = 5;

/** What the reviews say about one stop, by locus. */
export type StopStats = {
  /** The latest Siege rating was Again or Hard. */
  weak: boolean;
  misses: number;
  averageRevealMs: number | null;
};

export type SplitPlan = {
  kind: "split";
  routeId: string;
  routeName: string;
  /** The first stop of the second part. */
  cutLocusId: string;
  firstName: string;
  secondName: string;
  firstStops: number;
  secondStops: number;
  /** The section the second part starts with, when the cut is at a section boundary. */
  atSection: string | null;
};

export type ExtractWeakPlan = {
  kind: "extract-weak";
  routeId: string;
  routeName: string;
  newRouteName: string;
  locusIds: string[];
  titles: string[];
};

export type RouteSurgeryPlan = SplitPlan | ExtractWeakPlan;

/**
 * Where to cut a long route: at the section boundary nearest its middle, or, without sections,
 * before the slowest stop in its middle half (the middle itself when no stop has been timed).
 * Each part keeps at least two stops.
 */
function cutIndex(stops: readonly Locus[], stats: ReadonlyMap<string, StopStats>): number {
  const n = stops.length;
  const middle = n / 2;
  const sectionCuts = stops.map((stop, index) => (index >= 2 && index <= n - 2 && stop.section?.trim() ? index : -1)).filter((i) => i >= 0);
  if (sectionCuts.length > 0) {
    return sectionCuts.reduce((best, index) => (Math.abs(index - middle) < Math.abs(best - middle) ? index : best));
  }
  let best = Math.round(middle);
  let slowest = -1;
  for (let index = Math.max(2, Math.ceil(n / 4)); index <= Math.min(n - 2, Math.floor((3 * n) / 4)); index++) {
    const ms = stats.get(stops[index]!.id)?.averageRevealMs ?? null;
    if (ms !== null && ms > slowest) {
      slowest = ms;
      best = index;
    }
  }
  return best;
}

/** The change to propose for a route, or null when neither a split nor a trim would help. */
export function planRouteSurgery(input: {
  route: Pick<MemoryRoute, "id" | "name">;
  stops: readonly Locus[];
  stats: ReadonlyMap<string, StopStats>;
  titleOf: (nodeId: string) => string;
}): RouteSurgeryPlan | null {
  const stops = orderedLoci([...input.stops]);
  const name = input.route.name.trim() || "Route";
  if (stops.length >= SPLIT_MIN_STOPS) {
    const cut = cutIndex(stops, input.stats);
    const section = stops[cut]!.section?.trim() || null;
    return {
      kind: "split",
      routeId: input.route.id,
      routeName: name,
      cutLocusId: stops[cut]!.id,
      firstName: `${name} · part 1`,
      secondName: `${name} · part 2`,
      firstStops: cut,
      secondStops: stops.length - cut,
      atSection: section,
    };
  }
  const weak = stops
    .filter((stop) => input.stats.get(stop.id)?.weak)
    .sort((a, b) => (input.stats.get(b.id)?.misses ?? 0) - (input.stats.get(a.id)?.misses ?? 0) || a.orderIndex - b.orderIndex)
    .slice(0, WEAK_MAX);
  // A trim that took every stop would only rename the route.
  if (weak.length < WEAK_MIN || weak.length >= stops.length) return null;
  const moved = orderedLoci(weak);
  return {
    kind: "extract-weak",
    routeId: input.route.id,
    routeName: name,
    newRouteName: `${name} · weak spots`,
    locusIds: moved.map((stop) => stop.id),
    titles: moved.map((stop) => input.titleOf(stop.nodeId)),
  };
}

/** One line saying what a plan will do, for the learner to confirm. */
export function describePlan(plan: RouteSurgeryPlan): string {
  if (plan.kind === "split") {
    const where = plan.atSection ? ` where section ${plan.atSection} starts` : "";
    return `Split ${plan.routeName} into ${plan.firstName} (${plan.firstStops} stops) and ${plan.secondName} (${plan.secondStops} stops)${where}.`;
  }
  return `Move ${plan.titles.join(", ")} out of ${plan.routeName} into ${plan.newRouteName}, a short route of their own.`;
}

const renumber = (stops: readonly Locus[], routeId: string): Locus[] =>
  orderedLoci([...stops]).map((stop, orderIndex) => ({ ...stop, routeId, orderIndex }));

/**
 * Apply a plan to a palace's routes and stops. Returns null when the route or its stops are no
 * longer as planned. The new route takes the old one's review, direction and visibility settings.
 */
export function applyRouteSurgery(
  plan: RouteSurgeryPlan,
  routes: readonly MemoryRoute[],
  loci: readonly Locus[],
  newRouteId: string,
): { routes: MemoryRoute[]; loci: Locus[]; newRouteId: string } | null {
  const route = routes.find((candidate) => candidate.id === plan.routeId);
  if (!route) return null;
  const stops = orderedLoci(loci.filter((locus) => locus.routeId === route.id));
  const others = loci.filter((locus) => locus.routeId !== route.id);
  const newRoute: MemoryRoute = {
    id: newRouteId,
    palaceId: route.palaceId,
    name: plan.kind === "split" ? plan.secondName : plan.newRouteName,
    inReview: route.inReview,
    direction: route.direction,
    hidden: route.hidden,
  };

  if (plan.kind === "split") {
    const cut = stops.findIndex((stop) => stop.id === plan.cutLocusId);
    if (cut < 1 || cut >= stops.length) return null;
    const first = stops.slice(0, cut);
    const second = stops.slice(cut);
    // The second part starts in the section it was cut from, so it keeps its name.
    const opening = sectionNameAt(stops, cut);
    const secondStops = renumber(second, newRouteId).map((stop, index) =>
      index === 0 && !stop.section?.trim() && opening ? { ...stop, section: opening } : stop,
    );
    const index = routes.indexOf(route);
    return {
      routes: [...routes.slice(0, index), { ...route, name: plan.firstName }, newRoute, ...routes.slice(index + 1)],
      loci: [...others, ...renumber(first, route.id), ...secondStops],
      newRouteId,
    };
  }

  const moving = new Set(plan.locusIds);
  const moved = stops.filter((stop) => moving.has(stop.id));
  if (moved.length !== plan.locusIds.length || moved.length === stops.length) return null;
  const kept = stops.filter((stop) => !moving.has(stop.id));
  const index = routes.indexOf(route);
  return {
    routes: [...routes.slice(0, index + 1), newRoute, ...routes.slice(index + 1)],
    loci: [...others, ...renumber(kept, route.id), ...renumber(moved, newRouteId).map((stop) => ({ ...stop, section: null }))],
    newRouteId,
  };
}
