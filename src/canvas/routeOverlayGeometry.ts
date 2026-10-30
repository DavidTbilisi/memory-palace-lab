import type { Locus, MemoryRoute } from "../domain/entities/types";
import { routeColorHex } from "../domain/services/routeBuilder";
import { orderedLoci } from "../domain/services/walkService";

/** A node's box in viewport pixels. */
export type NodeBox = { x: number; y: number; w: number; h: number };

export type RouteSegment = { x1: number; y1: number; x2: number; y2: number };

export type RoutePath = {
  routeId: string;
  color: string;
  active: boolean;
  segments: RouteSegment[];
};

export type StopBadge = {
  key: string;
  routeId: string;
  locusId: string;
  nodeId: string;
  number: number;
  x: number;
  y: number;
  color: string;
  active: boolean;
  current: boolean;
};

export const STOP_BADGE_SIZE = 18;
const STOP_BADGE_GAP = 3;

/**
 * The part of the line between two box centers that lies outside both boxes, pulled back by
 * `gap` px at each end so arrowheads stay clear of the node borders. Null when the boxes
 * overlap along that line or leave no visible length.
 */
export function edgeToEdgeSegment(a: NodeBox, b: NodeBox, gap = 6): RouteSegment | null {
  const ax = a.x + a.w / 2;
  const ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2;
  const by = b.y + b.h / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);
  if (length < 1) return null;
  const exitFraction = (box: NodeBox) =>
    Math.min(
      dx === 0 ? Number.POSITIVE_INFINITY : box.w / 2 / Math.abs(dx),
      dy === 0 ? Number.POSITIVE_INFINITY : box.h / 2 / Math.abs(dy),
    );
  const start = exitFraction(a) + gap / length;
  const end = 1 - exitFraction(b) - gap / length;
  if (end - start <= 0) return null;
  return {
    x1: ax + dx * start,
    y1: ay + dy * start,
    x2: ax + dx * end,
    y2: ay + dy * end,
  };
}

export type RouteOverlayInput = {
  routes: readonly MemoryRoute[];
  loci: readonly Locus[];
  boxes: ReadonlyMap<string, NodeBox>;
  activeRouteId: string | null;
  /**
   * During a walk only the walked route is drawn, and its current stop is marked. `index` is the
   * stop's position in the route's own order; a reverse walk points the arrows back along it.
   */
  walk: { routeId: string; index: number; reverse?: boolean } | null;
};

/**
 * Paths and numbered badges for every visible route. Badges sit along a node's bottom-left
 * edge and stack sideways when the node is a stop more than once; the active route is last so
 * it draws on top.
 */
export function buildRouteOverlay(input: RouteOverlayInput): { paths: RoutePath[]; badges: StopBadge[] } {
  const { routes, loci, boxes, activeRouteId, walk } = input;
  const visible = routes
    .map((route, index) => ({ route, index }))
    .filter(({ route }) => (walk ? route.id === walk.routeId : !route.hidden));
  visible.sort((a, b) => Number(a.route.id === activeRouteId) - Number(b.route.id === activeRouteId));

  const paths: RoutePath[] = [];
  const badges: StopBadge[] = [];
  const badgesPerNode = new Map<string, number>();

  for (const { route, index } of visible) {
    const color = routeColorHex(route, index);
    const active = route.id === activeRouteId;
    const stops = orderedLoci(loci.filter((locus) => locus.routeId === route.id));
    const segments: RouteSegment[] = [];
    stops.forEach((stop, stopIndex) => {
      const box = boxes.get(stop.nodeId);
      if (!box) return;
      const nextStop = stops[stopIndex + 1];
      const nextBox = nextStop ? boxes.get(nextStop.nodeId) : undefined;
      if (nextBox) {
        const reverse = walk?.routeId === route.id && walk.reverse === true;
        const segment = reverse ? edgeToEdgeSegment(nextBox, box) : edgeToEdgeSegment(box, nextBox);
        if (segment) segments.push(segment);
      }
      const slot = badgesPerNode.get(stop.nodeId) ?? 0;
      badgesPerNode.set(stop.nodeId, slot + 1);
      badges.push({
        key: `${route.id}:${stop.id}`,
        routeId: route.id,
        locusId: stop.id,
        nodeId: stop.nodeId,
        number: stopIndex + 1,
        x: box.x + 4 + slot * (STOP_BADGE_SIZE + STOP_BADGE_GAP),
        y: box.y + box.h - STOP_BADGE_SIZE / 2,
        color,
        active,
        current: walk !== null && walk.routeId === route.id && walk.index === stopIndex,
      });
    });
    paths.push({ routeId: route.id, color, active, segments });
  }
  return { paths, badges };
}
