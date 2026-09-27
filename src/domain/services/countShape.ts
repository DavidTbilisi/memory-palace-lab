/**
 * Count-shape layout: an unordered set of 2–7 members sits on the vertices of the polygon of its
 * own size, so a missing member shows as an empty corner before any label is read. Above seven the
 * polygon stops being readable at a glance, and the set takes an ordered ladder instead.
 */

export type Point = { x: number; y: number };
export type Size = { w: number; h: number };
export type CountShapeKind = "polygon" | "ladder";

/** The largest set a polygon can hold and still be read as a checksum. */
export const COUNT_SHAPE_MAX = 7;

export const COUNT_SHAPE_NAMES: Record<number, string> = {
  2: "axis",
  3: "triangle",
  4: "square",
  5: "pentagon",
  6: "hexagon",
  7: "ring of 7",
};

export const LADDER_REASON =
  "Above seven, a polygon stops being readable at a glance, so an empty corner no longer shows a missing member. An ordered ladder is used instead.";

/** Space kept between neighbouring members, beyond their own size. */
const MEMBER_GAP = 60;
/** The hub sits at the centre; members never come closer to it than this. */
const MIN_RADIUS = 260;

export function canUsePolygon(count: number): boolean {
  return count >= 2 && count <= COUNT_SHAPE_MAX;
}

/** Radius at which neighbouring members of `size` clear each other on a polygon of `count` vertices. */
export function polygonRadius(count: number, size: Size): number {
  const chord = Math.max(size.w, size.h) + MEMBER_GAP;
  return Math.max(MIN_RADIUS, chord / (2 * Math.sin(Math.PI / count)));
}

/**
 * Vertices of the regular polygon of `count` sides around `center`, first vertex at the top and
 * going clockwise. Two members make an axis: one above the centre and one below.
 */
export function polygonVertices(count: number, center: Point, radius: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
}

/** Rungs of a vertical ladder to the right of the hub, centred on it, top to bottom. */
export function ladderRungs(count: number, hubCenter: Point, hubSize: Size, size: Size): Point[] {
  const step = size.h + MEMBER_GAP / 1.5;
  const x = hubCenter.x + hubSize.w / 2 + MEMBER_GAP * 2 + size.w / 2;
  const top = hubCenter.y - ((count - 1) * step) / 2;
  return Array.from({ length: count }, (_, i) => ({ x, y: top + i * step }));
}
