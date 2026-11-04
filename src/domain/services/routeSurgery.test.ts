import { describe, expect, it } from "vitest";
import type { Locus, MemoryRoute } from "../entities/types";
import { applyRouteSurgery, describePlan, planRouteSurgery, type StopStats } from "./routeSurgery";

const route: MemoryRoute = { id: "r", palaceId: "p", name: "Basics", inReview: true, direction: "alternate", hidden: false };

function stops(n: number, sections: Record<number, string> = {}): Locus[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `l${i}`,
    routeId: "r",
    nodeId: `n${i}`,
    orderIndex: i,
    label: "",
    interval: 3,
    easeFactor: 2.3,
    repetitions: 2,
    nextReviewAt: "2026-11-10T00:00:00.000Z",
    lastReviewedAt: "2026-11-01T00:00:00.000Z",
    section: sections[i] ?? null,
  }));
}

const titleOf = (nodeId: string) => `Node ${nodeId.slice(1)}`;
const stats = (entries: Record<string, Partial<StopStats>>) =>
  new Map(Object.entries(entries).map(([id, s]) => [id, { weak: false, misses: 0, averageRevealMs: null, ...s }]));

describe("planRouteSurgery", () => {
  it("splits a long route at the section boundary nearest its middle", () => {
    const plan = planRouteSurgery({ route, stops: stops(10, { 3: "Hall", 6: "Kitchen" }), stats: new Map(), titleOf });
    expect(plan).toMatchObject({ kind: "split", cutLocusId: "l6", firstStops: 6, secondStops: 4, atSection: "Kitchen" });
    expect(describePlan(plan!)).toBe(
      "Split Basics into Basics · part 1 (6 stops) and Basics · part 2 (4 stops) where section Kitchen starts.",
    );
  });

  it("without sections, cuts before the slowest stop in the middle half, or at the middle", () => {
    expect(planRouteSurgery({ route, stops: stops(12), stats: new Map(), titleOf })).toMatchObject({ cutLocusId: "l6" });
    const slow = stats({ l4: { averageRevealMs: 9000 }, l7: { averageRevealMs: 4000 }, l1: { averageRevealMs: 20000 } });
    expect(planRouteSurgery({ route, stops: stops(12), stats: slow, titleOf })).toMatchObject({ cutLocusId: "l4" });
  });

  it("moves a shorter route's weakest stops into their own route, most missed first, at most five", () => {
    const weak = stats({ l1: { weak: true, misses: 1 }, l3: { weak: true, misses: 4 }, l4: { weak: false, misses: 6 } });
    const plan = planRouteSurgery({ route, stops: stops(6), stats: weak, titleOf });
    expect(plan).toMatchObject({ kind: "extract-weak", newRouteName: "Basics · weak spots", locusIds: ["l1", "l3"] });
    expect(describePlan(plan!)).toBe("Move Node 1, Node 3 out of Basics into Basics · weak spots, a short route of their own.");
  });

  it("proposes nothing when one stop is weak, or when every stop is", () => {
    expect(planRouteSurgery({ route, stops: stops(5), stats: stats({ l1: { weak: true } }), titleOf })).toBeNull();
    const all = stats({ l0: { weak: true }, l1: { weak: true }, l2: { weak: true } });
    expect(planRouteSurgery({ route, stops: stops(3), stats: all, titleOf })).toBeNull();
  });
});

describe("applyRouteSurgery", () => {
  it("splits into two routes, keeping schedules and carrying the section into the second part", () => {
    const loci = stops(10, { 0: "Hall", 3: "Kitchen" });
    const plan = planRouteSurgery({ route, stops: loci, stats: stats({ l5: { averageRevealMs: 9000 } }), titleOf })!;
    expect(plan).toMatchObject({ kind: "split", cutLocusId: "l3" });
    const result = applyRouteSurgery(plan, [route], loci, "r2")!;
    expect(result.routes.map((r) => [r.id, r.name, r.inReview, r.direction])).toEqual([
      ["r", "Basics · part 1", true, "alternate"],
      ["r2", "Basics · part 2", true, "alternate"],
    ]);
    const second = result.loci.filter((l) => l.routeId === "r2").sort((a, b) => a.orderIndex - b.orderIndex);
    expect(second.map((l) => [l.id, l.orderIndex])).toEqual([0, 1, 2, 3, 4, 5, 6].map((i) => [`l${i + 3}`, i]));
    expect(second[0]).toMatchObject({ section: "Kitchen", interval: 3, easeFactor: 2.3, repetitions: 2 });
  });

  it("names the section a cut lands inside, so the second part does not start unnamed", () => {
    const loci = stops(10, { 0: "Hall" });
    const plan = planRouteSurgery({ route, stops: loci, stats: new Map(), titleOf })!;
    const second = applyRouteSurgery(plan, [route], loci, "r2")!.loci.find((l) => l.routeId === "r2" && l.orderIndex === 0)!;
    expect(second.section).toBe("Hall");
  });

  it("moves weak stops out, renumbering both routes, and refuses a plan the route no longer fits", () => {
    const loci = stops(6, { 1: "Hall" });
    const plan = planRouteSurgery({ route, stops: loci, stats: stats({ l1: { weak: true }, l4: { weak: true } }), titleOf })!;
    const result = applyRouteSurgery(plan, [route], loci, "r2")!;
    expect(result.loci.filter((l) => l.routeId === "r").map((l) => [l.id, l.orderIndex])).toEqual([
      ["l0", 0],
      ["l2", 1],
      ["l3", 2],
      ["l5", 3],
    ]);
    expect(result.loci.filter((l) => l.routeId === "r2").map((l) => [l.id, l.orderIndex, l.section])).toEqual([
      ["l1", 0, null],
      ["l4", 1, null],
    ]);
    expect(applyRouteSurgery(plan, [route], loci.filter((l) => l.id !== "l4"), "r2")).toBeNull();
    expect(applyRouteSurgery(plan, [], loci, "r2")).toBeNull();
  });
});
