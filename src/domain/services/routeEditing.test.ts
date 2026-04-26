import { describe, expect, it } from "vitest";
import type { Locus } from "../entities/types";
import { deleteLocus, moveLocus, reassignLocusRoute } from "./routeEditing";

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
