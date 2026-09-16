import { describe, expect, it } from "vitest";
import type { Locus, MemoryRoute } from "../entities/types";
import {
  ROUTE_COLOR_HEX,
  nextRouteColor,
  nextRouteName,
  orderStops,
  routeColorHex,
  routeColorKey,
  routesContainingNode,
  stopLabel,
  uniqueRouteName,
} from "./routeBuilder";

const route = (id: string, name: string, extra: Partial<MemoryRoute> = {}): MemoryRoute => ({
  id,
  palaceId: "p",
  name,
  ...extra,
});

const stop = (id: string, routeId: string, nodeId: string, orderIndex: number): Locus => ({
  id,
  routeId,
  nodeId,
  orderIndex,
  label: "",
});

describe("route names", () => {
  it("numbers new routes after the ones already taken", () => {
    expect(nextRouteName([])).toBe("Route 1");
    expect(nextRouteName([route("a", "Route 1"), route("b", "route 2")])).toBe("Route 3");
    expect(nextRouteName([route("a", "Route 2")])).toBe("Route 1");
  });

  it("suffixes a name another route already uses", () => {
    const routes = [route("a", "Morning walk"), route("b", "Morning walk (2)")];
    expect(uniqueRouteName("Evening", routes)).toBe("Evening");
    expect(uniqueRouteName(" morning WALK ", routes)).toBe("morning WALK (3)");
    expect(uniqueRouteName("", routes)).toBe("Route");
  });

  it("lets a route keep its own name when renamed", () => {
    const routes = [route("a", "Morning walk")];
    expect(uniqueRouteName("Morning walk", routes, "a")).toBe("Morning walk");
  });
});

describe("route colors", () => {
  it("uses the route's own color, or one picked by its position", () => {
    expect(routeColorKey({ color: "amber" }, 0)).toBe("amber");
    expect(routeColorKey({}, 1)).toBe("sky");
    expect(routeColorKey({ color: null }, 9)).toBe("sky");
    expect(routeColorHex({ color: "rose" }, 3)).toBe(ROUTE_COLOR_HEX.rose);
  });

  it("gives a new route a color no existing route shows", () => {
    expect(nextRouteColor([])).toBe("violet");
    expect(nextRouteColor([{ color: null }, { color: "emerald" }])).toBe("sky");
  });
});

describe("stopLabel", () => {
  it("prefers the stop's own label and falls back to the node title", () => {
    expect(stopLabel({ label: "Coat hook" }, "Hallway mirror")).toBe("Coat hook");
    expect(stopLabel({ label: "  " }, "Hallway mirror")).toBe("Hallway mirror");
    expect(stopLabel({ label: "" }, undefined)).toBe("Untitled node");
  });
});

describe("routesContainingNode", () => {
  it("lists each route with the node's stop numbers", () => {
    const routes = [route("r1", "One"), route("r2", "Two"), route("r3", "Three")];
    const loci = [
      stop("a", "r1", "n1", 1),
      stop("b", "r1", "n2", 0),
      stop("c", "r3", "n2", 5),
      stop("d", "r3", "n1", 2),
      stop("e", "r3", "n2", 9),
    ];

    expect(routesContainingNode(routes, loci, "n2").map((m) => [m.route.id, m.routeIndex, m.positions])).toEqual([
      ["r1", 0, [1]],
      ["r3", 2, [2, 3]],
    ]);
    expect(routesContainingNode(routes, loci, "n9")).toEqual([]);
  });
});

describe("orderStops", () => {
  const points = [
    { nodeId: "c", x: 300, y: 0 },
    { nodeId: "a", x: 0, y: 100 },
    { nodeId: "b", x: 0, y: 0 },
    { nodeId: "d", x: 100, y: 300 },
  ];

  it("keeps selection order", () => {
    expect(orderStops(points, "selection")).toEqual(["c", "a", "b", "d"]);
  });

  it("sorts left to right and top to bottom", () => {
    expect(orderStops(points, "left-to-right")).toEqual(["b", "a", "d", "c"]);
    expect(orderStops(points, "top-to-bottom")).toEqual(["b", "c", "a", "d"]);
  });

  it("walks to the nearest remaining node", () => {
    expect(orderStops(points, "nearest", { x: 0, y: 90 })).toEqual(["a", "b", "c", "d"]);
    expect(orderStops(points, "nearest")).toEqual(["c", "b", "a", "d"]);
    expect(orderStops([], "nearest")).toEqual([]);
  });
});
