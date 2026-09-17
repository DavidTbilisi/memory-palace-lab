import { ROUTE_COLORS, type Locus, type MemoryRoute, type RouteColor } from "../entities/types";
import { orderedLoci } from "./walkService";

/** Stroke and badge colors for each route palette key (Tailwind 400 shades, readable on the dark canvas chrome). */
export const ROUTE_COLOR_HEX: Record<RouteColor, string> = {
  violet: "#a78bfa",
  sky: "#38bdf8",
  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
  cyan: "#22d3ee",
  orange: "#fb923c",
  fuchsia: "#e879f9",
};

/** The route's own color, or the palette entry for its position when it has none. */
export function routeColorKey(route: Pick<MemoryRoute, "color">, routeIndex: number): RouteColor {
  if (route.color) return route.color;
  const index = ((routeIndex % ROUTE_COLORS.length) + ROUTE_COLORS.length) % ROUTE_COLORS.length;
  return ROUTE_COLORS[index]!;
}

export function routeColorHex(route: Pick<MemoryRoute, "color">, routeIndex: number): string {
  return ROUTE_COLOR_HEX[routeColorKey(route, routeIndex)];
}

/** First palette color no existing route shows, so a new route stands apart from the others. */
export function nextRouteColor(routes: readonly Pick<MemoryRoute, "color">[]): RouteColor {
  const used = new Set(routes.map((route, index) => routeColorKey(route, index)));
  return ROUTE_COLORS.find((color) => !used.has(color)) ?? ROUTE_COLORS[routes.length % ROUTE_COLORS.length]!;
}

function nameKey(name: string) {
  return name.trim().toLocaleLowerCase();
}

/** "Route 1", "Route 2", … — the first numbered name no route uses yet. */
export function nextRouteName(routes: readonly Pick<MemoryRoute, "name">[], base = "Route"): string {
  const taken = new Set(routes.map((route) => nameKey(route.name)));
  for (let n = 1; ; n += 1) {
    const candidate = `${base} ${n}`;
    if (!taken.has(nameKey(candidate))) return candidate;
  }
}

/**
 * `desired`, or `desired (2)`, `desired (3)`, … when another route already has that name.
 * Route names are identities in the DSL and MCP, so two routes must never share one.
 */
export function uniqueRouteName(
  desired: string,
  routes: readonly Pick<MemoryRoute, "id" | "name">[],
  excludeRouteId?: string,
): string {
  const base = desired.trim() || "Route";
  const taken = new Set(routes.filter((route) => route.id !== excludeRouteId).map((route) => nameKey(route.name)));
  if (!taken.has(nameKey(base))) return base;
  for (let n = 2; ; n += 1) {
    const candidate = `${base} (${n})`;
    if (!taken.has(nameKey(candidate))) return candidate;
  }
}

/** A stop's display text: its own label when set, otherwise its node's current title. */
export function stopLabel(locus: Pick<Locus, "label">, nodeTitle: string | null | undefined): string {
  return locus.label?.trim() || nodeTitle?.trim() || "Untitled node";
}

export type RouteMembership = {
  route: MemoryRoute;
  routeIndex: number;
  /** 1-based stop numbers of the node in this route (usually one). */
  positions: number[];
};

/** Every route the node is a stop in, in route-list order. */
export function routesContainingNode(
  routes: readonly MemoryRoute[],
  loci: readonly Locus[],
  nodeId: string,
): RouteMembership[] {
  const memberships: RouteMembership[] = [];
  routes.forEach((route, routeIndex) => {
    const positions = orderedLoci(loci.filter((locus) => locus.routeId === route.id))
      .map((locus, index) => (locus.nodeId === nodeId ? index + 1 : 0))
      .filter((position) => position > 0);
    if (positions.length > 0) memberships.push({ route, routeIndex, positions });
  });
  return memberships;
}

export type StopOrder = "selection" | "left-to-right" | "top-to-bottom" | "nearest";

export const STOP_ORDER_LABELS: Record<StopOrder, string> = {
  selection: "In selection order",
  "left-to-right": "Left to right",
  "top-to-bottom": "Top to bottom",
  nearest: "Shortest walk",
};

export type StopPoint = { nodeId: string; x: number; y: number };

/**
 * Order nodes for appending to a route. "nearest" walks greedily to the closest remaining
 * node, starting from `start` (usually the route's last stop) or the first point given.
 */
export function orderStops(
  points: readonly StopPoint[],
  order: StopOrder,
  start?: { x: number; y: number } | null,
): string[] {
  if (order === "selection") return points.map((point) => point.nodeId);
  if (order === "left-to-right") {
    return [...points].sort((a, b) => a.x - b.x || a.y - b.y).map((point) => point.nodeId);
  }
  if (order === "top-to-bottom") {
    return [...points].sort((a, b) => a.y - b.y || a.x - b.x).map((point) => point.nodeId);
  }
  const remaining = [...points];
  const result: string[] = [];
  let cursor = start ?? remaining[0] ?? null;
  while (remaining.length > 0 && cursor) {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    remaining.forEach((point, index) => {
      const distance = Math.hypot(point.x - cursor!.x, point.y - cursor!.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    const [next] = remaining.splice(bestIndex, 1);
    result.push(next!.nodeId);
    cursor = next!;
  }
  return result;
}
