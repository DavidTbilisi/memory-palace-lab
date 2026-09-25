import { describe, expect, it } from "vitest";
import type { NedfSlot, RecallRating } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import { buildSlotRetention } from "./reviewMetrics";

const rated = (rating: RecallRating, slot: NedfSlot | null, routeId = "r1") =>
  createAnalyticsEvent({
    eventType: "walk_recall_rated",
    eventGroup: "review",
    palaceId: "p1",
    routeId,
    nodeId: "n1",
    payload: { rating, slot },
  });

describe("buildSlotRetention", () => {
  it("reports each slot's retention separately, ignoring plain stops", () => {
    const events = [
      rated("good", "failure"),
      rated("again", "failure"),
      rated("again", "failure"),
      rated("easy", "failure"),
      rated("hard", "essence"),
      rated("again", null),
    ];
    const bySlot = Object.fromEntries(buildSlotRetention(events).map((row) => [row.slot, row]));
    expect(bySlot.failure).toMatchObject({ reviews: 4, recalled: 2, retentionPct: 50 });
    expect(bySlot.failure!.ratings).toEqual({ again: 2, hard: 0, good: 1, easy: 1 });
    expect(bySlot.essence).toMatchObject({ reviews: 1, recalled: 1, retentionPct: 100 });
    expect(bySlot.nameHook).toMatchObject({ reviews: 0, retentionPct: null });
    expect(buildSlotRetention(events).map((row) => row.slot)).toEqual(["nameHook", "essence", "distinguisher", "failure"]);
  });

  it("honours the palace and route filter", () => {
    const events = [rated("good", "essence", "r1"), rated("again", "essence", "r2")];
    const essence = buildSlotRetention(events, { routeId: "r2" }).find((row) => row.slot === "essence")!;
    expect(essence).toMatchObject({ reviews: 1, retentionPct: 0 });
  });
});
