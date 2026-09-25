import { describe, expect, it } from "vitest";
import type { Locus } from "../entities/types";
import { averageLocusInterval, buildDueQueue, countDueLoci, reviewedLoci } from "./dueQueue";

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

  it("never lists a draft route's stops, and lists them again once review is back on", () => {
    const withDraft = (inReview: boolean | undefined) =>
      ({
        palace: { id: "d", name: "Drafts", createdAt: NOW },
        routes: [
          { id: "r1", palaceId: "d", name: "Reviewed" },
          { id: "draft", palaceId: "d", name: "Draft", inReview },
        ],
        nodes: [],
        loci: [
          locus("l1", "r1", "n1", "2026-09-02T00:00:00.000Z", 2),
          locus("l2", "draft", "n2", "2026-09-01T00:00:00.000Z", 6),
        ],
      }) as never;

    const drafted = buildDueQueue([withDraft(false)], NOW);
    expect(drafted.items.map((item) => item.locusId)).toEqual(["l1"]);
    expect(drafted.countByRoute.get("draft")).toBeUndefined();
    expect(drafted.averageInterval).toBe(2);

    const reviewed = buildDueQueue([withDraft(undefined)], NOW);
    expect(reviewed.items.map((item) => item.locusId)).toEqual(["l2", "l1"]);
  });

  it("filters loci by their route's review setting", () => {
    const loci = [locus("l1", "r1", "n1", NOW), locus("l2", "draft", "n2", NOW), locus("l3", "gone", "n3", NOW)];
    const routes = [
      { id: "r1", inReview: true },
      { id: "draft", inReview: false },
    ];
    expect(reviewedLoci(loci, routes).map((l) => l.id)).toEqual(["l1", "l3"]);
  });

  it("lists an NEDF stop once, asking its most overdue slot, and counts its cards", () => {
    const palace = {
      palace: { id: "n", name: "NEDF", createdAt: NOW },
      routes: [{ id: "r", palaceId: "n", name: "Walk" }],
      nodes: [
        {
          id: "mutex",
          title: "Mutex",
          nedf: {
            nameHook: "Mute-X",
            essence: "One key to the bathroom",
            failure: { scenario: "Forgot to unlock", correction: "Release in finally" },
          },
        },
      ],
      loci: [
        {
          ...locus("l1", "r", "mutex", "2026-09-02T12:00:00.000Z", 4),
          slotSchedules: {
            nameHook: { interval: 30, easeFactor: 2.5, repetitions: 4, nextReviewAt: "2026-10-01T00:00:00.000Z", lastReviewedAt: NOW },
            failure: { interval: 1, easeFactor: 2.1, repetitions: 0, nextReviewAt: "2026-09-02T00:00:00.000Z", lastReviewedAt: NOW },
          },
        },
      ],
    } as never;

    const queue = buildDueQueue([palace], NOW);
    // Failure is most overdue; Essence, never rated, follows the stop's own date; Name-hook is not due.
    expect(queue.items).toHaveLength(1);
    expect(queue.items[0]).toMatchObject({ slot: "failure", dueCards: 2, nextReviewAt: "2026-09-02T00:00:00.000Z" });
    expect(queue.countByRoute.get("r")).toBe(1);
    expect(queue.averageInterval).toBe(12); // (30 + 1 + 4) / 3 ≈ 11.7
    expect(countDueLoci((palace as { loci: Locus[] }).loci, NOW, () => null)).toBe(1);
  });
});
