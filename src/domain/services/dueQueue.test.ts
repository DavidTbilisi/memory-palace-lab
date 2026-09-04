import { describe, expect, it } from "vitest";
import type { Locus } from "../entities/types";
import { averageLocusInterval, buildDueQueue, countDueLoci } from "./dueQueue";

const NOW = "2026-09-03T12:00:00.000Z";
const locus = (id: string, routeId: string, nodeId: string, nextReviewAt: string, interval?: number): Locus =>
  ({ id, routeId, nodeId, orderIndex: 0, label: `L-${id}`, nextReviewAt, interval, easeFactor: 2.5, repetitions: 1, lastReviewedAt: NOW }) as Locus;

const palaceA = {
  palace: { id: "a", name: "Alpha", createdAt: NOW },
  routes: [{ id: "r1", palaceId: "a", name: "Route 1" }],
  nodes: [{ id: "n1", palaceId: "a", title: "Node one", content: "" }],
  loci: [
    locus("l1", "r1", "n1", "2026-09-03T11:00:00.000Z", 3),
    locus("l2", "r1", "n1", "2026-09-04T11:00:00.000Z", 5),
    locus("l3", "missing-route", "n1", "2026-09-01T00:00:00.000Z", 1),
  ],
} as never;

const palaceB = {
  palace: { id: "b", name: "Beta", createdAt: NOW },
  routes: [{ id: "r2", palaceId: "b", name: "Route 2" }],
  nodes: [],
  loci: [locus("l4", "r2", "n9", "2026-09-02T00:00:00.000Z", 2)],
} as never;

describe("buildDueQueue", () => {
  it("collects due loci across palaces, sorted by due time, skipping orphaned routes", () => {
    const queue = buildDueQueue([palaceA, palaceB], NOW);
    expect(queue.items.map((item) => item.locusId)).toEqual(["l4", "l1"]);
    expect(queue.items[0]).toMatchObject({ palaceName: "Beta", routeName: "Route 2", nodeTitle: "Untitled node" });
    expect(queue.items[1]).toMatchObject({ palaceName: "Alpha", nodeTitle: "Node one", locusLabel: "L-l1" });
    expect(queue.countByPalace.get("a")).toBe(1);
    expect(queue.countByPalace.get("b")).toBe(1);
    expect(queue.countByRoute.get("r1")).toBe(1);
  });

  it("averages intervals across every locus, not just due ones", () => {
    const queue = buildDueQueue([palaceA, palaceB], NOW);
    expect(queue.averageInterval).toBe(3); // (3 + 5 + 1 + 2) / 4 = 2.75 → 3
    expect(averageLocusInterval([], NOW)).toBeNull();
  });

  it("counts due loci for one set and handles empty input", () => {
    expect(countDueLoci(palaceA.loci, NOW)).toBe(2);
    const empty = buildDueQueue([], NOW);
    expect(empty.items).toEqual([]);
    expect(empty.averageInterval).toBeNull();
  });
});
