import { describe, expect, it } from "vitest";
import type { Locus, NedfEncoding } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import {
  hasLoggedConfusion,
  pullDistinguishersForward,
  readLoggedConfusion,
  unorderedPairKey,
} from "./confusionReview";
import { buildDueQueue, nedfLookup } from "./dueQueue";

const AT = "2026-09-29T10:00:00.000Z";
const LATER = "2026-10-05T10:00:00.000Z";
const EARLIER = "2026-09-20T10:00:00.000Z";

const WITH_D: NedfEncoding = {
  essence: "Lets one thread in",
  distinguisher: { prompt: "One key or many?", reason: "one owner" },
};
const WITHOUT_D: NedfEncoding = { essence: "Counts free slots" };

function locus(id: string, nodeId: string, routeId = "r1", extra: Partial<Locus> = {}): Locus {
  return {
    id,
    routeId,
    nodeId,
    orderIndex: 0,
    label: id,
    interval: 6,
    easeFactor: 2.5,
    repetitions: 2,
    nextReviewAt: LATER,
    lastReviewedAt: "2026-09-23T10:00:00.000Z",
    ...extra,
  };
}

const nedfOf = (map: Record<string, NedfEncoding | null>) => (nodeId: string) => map[nodeId] ?? null;

describe("pullDistinguishersForward", () => {
  it("brings both nodes' Distinguisher cards due at the rating time, leaving other slots alone", () => {
    const essence = { interval: 6, easeFactor: 2.3, repetitions: 2, nextReviewAt: LATER, lastReviewedAt: EARLIER };
    const loci = [
      locus("l-a", "a", "r1", { slotSchedules: { essence } }),
      locus("l-b", "b"),
      locus("l-c", "c"),
    ];
    const result = pullDistinguishersForward(loci, [{ id: "r1" }], nedfOf({ a: WITH_D, b: WITH_D, c: WITH_D }), ["a", "b"], AT);
    expect(result.pulledLocusIds).toEqual(["l-a", "l-b"]);
    expect(result.withoutDistinguisher).toEqual([]);
    const [a, b, c] = result.loci;
    expect(a!.slotSchedules?.distinguisher).toEqual({
      interval: 6,
      easeFactor: 2.5,
      repetitions: 2,
      nextReviewAt: AT,
      lastReviewedAt: "2026-09-23T10:00:00.000Z",
    });
    expect(a!.slotSchedules?.essence).toBe(essence);
    // The stop's own schedule and the other node are untouched.
    expect(a!.nextReviewAt).toBe(LATER);
    expect(b!.slotSchedules?.distinguisher?.nextReviewAt).toBe(AT);
    expect(c).toBe(loci[2]);
  });

  it("keeps the Distinguisher's own ease and interval when it has a schedule of its own", () => {
    const own = { interval: 12, easeFactor: 2.1, repetitions: 4, nextReviewAt: LATER, lastReviewedAt: EARLIER };
    const result = pullDistinguishersForward(
      [locus("l-a", "a", "r1", { slotSchedules: { distinguisher: own } })],
      [{ id: "r1" }],
      nedfOf({ a: WITH_D }),
      ["a"],
      AT,
    );
    expect(result.loci[0]!.slotSchedules?.distinguisher).toEqual({ ...own, nextReviewAt: AT });
  });

  it("never pushes a card back", () => {
    const due = { interval: 1, easeFactor: 2.5, repetitions: 0, nextReviewAt: EARLIER, lastReviewedAt: null };
    const loci = [locus("l-a", "a", "r1", { slotSchedules: { distinguisher: due } })];
    const result = pullDistinguishersForward(loci, [{ id: "r1" }], nedfOf({ a: WITH_D }), ["a"], AT);
    expect(result.pulledLocusIds).toEqual([]);
    expect(result.loci[0]).toBe(loci[0]);
  });

  it("skips draft routes and reports nodes without a filled Distinguisher", () => {
    const half: NedfEncoding = { distinguisher: { prompt: "One key?", reason: "" } };
    const loci = [locus("l-a", "a", "draft"), locus("l-b", "b"), locus("l-c", "c")];
    const result = pullDistinguishersForward(
      loci,
      [{ id: "r1" }, { id: "draft", inReview: false }],
      nedfOf({ a: WITH_D, b: WITHOUT_D, c: half }),
      ["a", "b", "c"],
      AT,
    );
    expect(result.pulledLocusIds).toEqual([]);
    expect(result.withoutDistinguisher).toEqual(["b", "c"]);
  });

  it("moves every stop of the node, one per route", () => {
    const loci = [locus("l-1", "a", "r1"), locus("l-2", "a", "r2")];
    const result = pullDistinguishersForward(loci, [{ id: "r1" }, { id: "r2" }], nedfOf({ a: WITH_D }), ["a"], AT);
    expect(result.pulledLocusIds).toEqual(["l-1", "l-2"]);
  });

  it("makes the due queue list the pulled cards", () => {
    const nodes = [
      { id: "a", objectId: "oa", title: "Mutex", content: "", kind: "memory" as const, portal: null, nedf: WITH_D },
      { id: "b", objectId: "ob", title: "Semaphore", content: "", kind: "memory" as const, portal: null, nedf: WITH_D },
    ];
    const routes = [{ id: "r1", palaceId: "p", name: "Locks" }];
    const palace = { id: "p", name: "P", createdAt: EARLIER };
    const before = [locus("l-a", "a"), locus("l-b", "b")];
    expect(buildDueQueue([{ palace, routes, nodes, loci: before }], AT).items).toHaveLength(0);
    const { loci } = pullDistinguishersForward(before, routes, nedfLookup(nodes), ["a", "b"], AT);
    const items = buildDueQueue([{ palace, routes, nodes, loci }], AT).items;
    expect(items.map((item) => [item.nodeTitle, item.slot])).toEqual([
      ["Mutex", "distinguisher"],
      ["Semaphore", "distinguisher"],
    ]);
  });
});

describe("logged confusions", () => {
  const miss = (nodeId: string, payload: Record<string, unknown>) =>
    createAnalyticsEvent({ eventType: "recall_miss_explained", eventGroup: "review", nodeId, payload });

  it("reads a confusion and ignores blanks and self-pairs", () => {
    const logged = readLoggedConfusion(
      miss("a", { cause: "confusion", confusedWithNodeId: "b", confusedWithTitle: "Semaphore", nodeTitle: "Mutex" }),
    );
    expect(logged).toMatchObject({ nodeId: "a", otherNodeId: "b", nodeTitle: "Mutex", otherTitle: "Semaphore" });
    expect(readLoggedConfusion(miss("a", { cause: "blank", confusedWithNodeId: null }))).toBeNull();
    expect(readLoggedConfusion(miss("a", { cause: "confusion", confusedWithNodeId: "a" }))).toBeNull();
  });

  it("matches a pair whichever node was missed", () => {
    const events = [miss("b", { cause: "confusion", confusedWithNodeId: "a" })];
    expect(hasLoggedConfusion(events, "a", "b")).toBe(true);
    expect(hasLoggedConfusion(events, "a", "c")).toBe(false);
    expect(unorderedPairKey("a", "b")).toBe(unorderedPairKey("b", "a"));
  });
});
