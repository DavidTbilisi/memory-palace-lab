import { describe, expect, it } from "vitest";
import type { Locus } from "../entities/types";
import {
  appendStops,
  deleteLocus,
  detachLociForNodes,
  moveLocus,
  moveLocusTo,
  reassignLocusRoute,
  removeLocus,
  restoreLoci,
} from "./routeEditing";

const locus = (id: string, routeId: string, orderIndex: number): Locus => ({
  id,
  routeId,
  nodeId: `node-${id}`,
  orderIndex,
  label: `Step ${id}`,
});

describe("routeEditing", () => {
  it("moves a route step up and normalizes sibling order", () => {
    const next = moveLocus(
      [locus("a", "route-1", 0), locus("b", "route-1", 1), locus("c", "route-1", 2)],
      "c",
      "up",
    );

    expect(next.filter((entry) => entry.routeId === "route-1").map((entry) => entry.id)).toEqual(["a", "c", "b"]);
    expect(next.map((entry) => entry.orderIndex)).toEqual([0, 1, 2]);
  });

  it("moves a route step down without crossing into another route", () => {
    const next = moveLocus(
      [locus("a", "route-1", 0), locus("b", "route-1", 1), locus("x", "route-2", 0)],
      "a",
      "down",
    );

    expect(next.filter((entry) => entry.routeId === "route-1").map((entry) => entry.id)).toEqual(["b", "a"]);
    expect(next.find((entry) => entry.id === "x")?.orderIndex).toBe(0);
  });

  it("deletes a step and compacts the remaining route order", () => {
    const next = deleteLocus([locus("a", "route-1", 0), locus("b", "route-1", 1), locus("c", "route-1", 2)], "b");

    expect(next.map((entry) => [entry.id, entry.orderIndex])).toEqual([
      ["a", 0],
      ["c", 1],
    ]);
  });

  it("reassigns a step to another route at the end of that route", () => {
    const next = reassignLocusRoute(
      [locus("a", "route-1", 0), locus("b", "route-1", 1), locus("x", "route-2", 0)],
      "b",
      "route-2",
    );

    expect(next.filter((entry) => entry.routeId === "route-1").map((entry) => [entry.id, entry.orderIndex])).toEqual([
      ["a", 0],
    ]);
    expect(next.filter((entry) => entry.routeId === "route-2").map((entry) => [entry.id, entry.orderIndex])).toEqual([
      ["x", 0],
      ["b", 1],
    ]);
  });
});

const idsOf = (loci: Locus[], routeId: string) =>
  loci
    .filter((entry) => entry.routeId === routeId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((entry) => entry.id);

describe("appendStops", () => {
  let n = 0;
  const makeId = () => `new-${++n}`;

  it("appends new nodes with blank labels and fresh schedules", () => {
    n = 0;
    const result = appendStops([locus("a", "r", 0)], "r", ["node-x", "node-y"], {
      makeId,
      nowIso: "2026-09-16T00:00:00.000Z",
    });

    expect(result.added.map((entry) => [entry.id, entry.nodeId, entry.orderIndex, entry.label])).toEqual([
      ["new-1", "node-x", 1, ""],
      ["new-2", "node-y", 2, ""],
    ]);
    expect(result.added[0]).toMatchObject({ repetitions: 0, nextReviewAt: "2026-09-17T00:00:00.000Z" });
    expect(result.skipped).toEqual([]);
    expect(idsOf(result.loci, "r")).toEqual(["a", "new-1", "new-2"]);
  });

  it("skips nodes the route already visits, including repeats within the batch", () => {
    n = 0;
    const result = appendStops([locus("a", "r", 0), locus("b", "r", 1)], "r", ["node-b", "node-z", "node-z"], {
      makeId,
    });

    expect(result.added.map((entry) => entry.nodeId)).toEqual(["node-z"]);
    expect(result.skipped).toEqual([
      { nodeId: "node-b", position: 2 },
      { nodeId: "node-z", position: 3 },
    ]);
  });

  it("leaves the array untouched when nothing is added", () => {
    const loci = [locus("a", "r", 0)];
    expect(appendStops(loci, "r", ["node-a"]).loci).toBe(loci);
  });

  it("gives each new stop the view returned for its node", () => {
    const view = { x: -300, y: -200, w: 600, h: 400 };
    const result = appendStops([locus("a", "r", 0)], "r", ["node-a", "node-x", "node-y"], {
      viewFor: (nodeId) => (nodeId === "node-x" ? view : null),
    });

    expect(result.added.map((entry) => entry.view)).toEqual([view, undefined]);
    expect(result.added[1]).not.toHaveProperty("view");
  });
});

describe("moveLocusTo", () => {
  const route = [locus("a", "r", 0), locus("b", "r", 1), locus("c", "r", 2), locus("d", "r", 3), locus("x", "q", 0)];

  it("moves a stop to any position and renumbers the route", () => {
    const next = moveLocusTo(route, "a", 2);
    expect(idsOf(next, "r")).toEqual(["b", "c", "a", "d"]);
    expect(next.filter((entry) => entry.routeId === "r").map((entry) => entry.orderIndex)).toEqual([0, 1, 2, 3]);
    expect(idsOf(next, "q")).toEqual(["x"]);
  });

  it("clamps the destination", () => {
    expect(idsOf(moveLocusTo(route, "b", 99), "r")).toEqual(["a", "c", "d", "b"]);
    expect(idsOf(moveLocusTo(route, "d", -5), "r")).toEqual(["d", "a", "b", "c"]);
  });

  it("is a no-op for an unknown stop or the same position", () => {
    expect(moveLocusTo(route, "nope", 0)).toBe(route);
    expect(moveLocusTo(route, "c", 2)).toBe(route);
  });
});

describe("removeLocus and restoreLoci", () => {
  it("puts a removed stop back where it was", () => {
    const route = [locus("a", "r", 0), locus("b", "r", 1), locus("c", "r", 2)];
    const { loci, removed } = removeLocus(route, "b");

    expect(idsOf(loci, "r")).toEqual(["a", "c"]);
    expect(removed).toMatchObject({ index: 1, locus: { id: "b" } });
    expect(idsOf(restoreLoci(loci, [removed!]), "r")).toEqual(["a", "b", "c"]);
  });

  it("reports nothing for an unknown stop and ignores stops already present", () => {
    const route = [locus("a", "r", 0)];
    expect(removeLocus(route, "zzz")).toEqual({ loci: route, removed: null });
    expect(restoreLoci(route, [{ locus: route[0]!, index: 0 }])).toBe(route);
  });
});

describe("detachLociForNodes", () => {
  it("detaches every stop of the removed nodes and restores them in order", () => {
    const loci = [
      locus("a", "r", 0),
      locus("b", "r", 1),
      locus("c", "r", 2),
      locus("d", "r", 3),
      { ...locus("q1", "q", 0), nodeId: "node-b" },
    ];
    const { loci: kept, detached } = detachLociForNodes(loci, new Set(["node-b", "node-d"]));

    expect(idsOf(kept, "r")).toEqual(["a", "c"]);
    expect(idsOf(kept, "q")).toEqual([]);
    expect(detached.map((entry) => [entry.locus.id, entry.index])).toEqual([
      ["b", 1],
      ["d", 3],
      ["q1", 0],
    ]);
    const restored = restoreLoci(kept, detached);
    expect(idsOf(restored, "r")).toEqual(["a", "b", "c", "d"]);
    expect(idsOf(restored, "q")).toEqual(["q1"]);
  });

  it("returns the same array when no stop matches", () => {
    const loci = [locus("a", "r", 0)];
    expect(detachLociForNodes(loci, new Set(["node-zzz"]))).toEqual({ loci, detached: [] });
  });
});
