import { describe, expect, it } from "vitest";
import type { Locus, MemoryRoute } from "../domain/entities/types";
import { ROUTE_COLOR_HEX } from "../domain/services/routeBuilder";
import {
  STOP_BADGE_SIZE,
  buildRouteOverlay,
  edgeToEdgeSegment,
  type NodeBox,
  type RouteSegment,
} from "./routeOverlayGeometry";

function expectSegment(actual: RouteSegment | null, expected: RouteSegment) {
  expect(actual).not.toBeNull();
  for (const key of ["x1", "y1", "x2", "y2"] as const) {
    expect(actual![key]).toBeCloseTo(expected[key]);
  }
}

describe("edgeToEdgeSegment", () => {
  it("runs between the facing edges of two boxes, minus the gap", () => {
    const a: NodeBox = { x: 0, y: 0, w: 100, h: 40 };
    const b: NodeBox = { x: 300, y: 0, w: 100, h: 40 };
    expectSegment(edgeToEdgeSegment(a, b, 5), { x1: 105, y1: 20, x2: 295, y2: 20 });
  });

  it("handles vertical and diagonal lines", () => {
    const a: NodeBox = { x: 0, y: 0, w: 40, h: 40 };
    expectSegment(edgeToEdgeSegment(a, { x: 0, y: 200, w: 40, h: 40 }, 0), { x1: 20, y1: 40, x2: 20, y2: 200 });
    expectSegment(edgeToEdgeSegment(a, { x: 200, y: 200, w: 40, h: 40 }, 0), {
      x1: 40,
      y1: 40,
      x2: 200,
      y2: 200,
    });
  });

  it("returns null for overlapping or coincident boxes", () => {
    const a: NodeBox = { x: 0, y: 0, w: 100, h: 40 };
    expect(edgeToEdgeSegment(a, { x: 60, y: 10, w: 100, h: 40 })).toBeNull();
    expect(edgeToEdgeSegment(a, a)).toBeNull();
  });
});

const route = (id: string, extra: Partial<MemoryRoute> = {}): MemoryRoute => ({ id, palaceId: "p", name: id, ...extra });
const stop = (id: string, routeId: string, nodeId: string, orderIndex: number): Locus => ({
  id,
  routeId,
  nodeId,
  orderIndex,
  label: "",
});

const boxes = new Map<string, NodeBox>([
  ["n1", { x: 0, y: 0, w: 100, h: 40 }],
  ["n2", { x: 300, y: 0, w: 100, h: 40 }],
  ["n3", { x: 300, y: 200, w: 100, h: 40 }],
]);

describe("buildRouteOverlay", () => {
  const routes = [route("r1", { color: "amber" }), route("r2"), route("r3", { hidden: true })];
  const loci = [
    stop("a", "r1", "n1", 0),
    stop("b", "r1", "n2", 1),
    stop("c", "r1", "gone", 2),
    stop("d", "r1", "n3", 3),
    stop("e", "r2", "n2", 0),
    stop("f", "r2", "n1", 1),
    stop("g", "r3", "n3", 0),
  ];

  it("draws visible routes with numbered badges, skipping missing nodes and hidden routes", () => {
    const { paths, badges } = buildRouteOverlay({ routes, loci, boxes, activeRouteId: "r1", walk: null });

    expect(paths.map((path) => [path.routeId, path.active, path.segments.length])).toEqual([
      ["r2", false, 1],
      ["r1", true, 1],
    ]);
    expect(paths[1]!.color).toBe(ROUTE_COLOR_HEX.amber);
    expect(paths[0]!.color).toBe(ROUTE_COLOR_HEX.sky);
    expect(badges.map((badge) => [badge.routeId, badge.nodeId, badge.number])).toEqual([
      ["r2", "n2", 1],
      ["r2", "n1", 2],
      ["r1", "n1", 1],
      ["r1", "n2", 2],
      ["r1", "n3", 4],
    ]);
  });

  it("stacks badges sideways when a node is a stop in more than one route", () => {
    const { badges } = buildRouteOverlay({ routes, loci, boxes, activeRouteId: "r1", walk: null });
    const onN2 = badges.filter((badge) => badge.nodeId === "n2");

    expect(onN2.map((badge) => badge.x)).toEqual([304, 304 + STOP_BADGE_SIZE + 3]);
    expect(onN2.every((badge) => badge.y === 40 - STOP_BADGE_SIZE / 2)).toBe(true);
  });

  it("shows only the walked route during a walk and marks the current stop", () => {
    const { paths, badges } = buildRouteOverlay({
      routes,
      loci,
      boxes,
      activeRouteId: "r3",
      walk: { routeId: "r3", index: 0 },
    });

    expect(paths.map((path) => path.routeId)).toEqual(["r3"]);
    expect(badges).toHaveLength(1);
    expect(badges[0]).toMatchObject({ nodeId: "n3", number: 1, current: true, active: true });
  });
});
