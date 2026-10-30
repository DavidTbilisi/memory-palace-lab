import { describe, expect, it } from "vitest";
import type { NedfSlot, RecallRating } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import {
  buildRetentionSeries,
  buildSlotRetention,
  computeDailyStreak,
  countReviewedToday,
  countStormReviewedToday,
  eventPhase,
} from "./reviewMetrics";

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

describe("Storm and Siege reviews", () => {
  const NOW = new Date(2026, 8, 28, 20).toISOString();
  const at = (daysAgo: number) => new Date(2026, 8, 28 - daysAgo, 12).toISOString();
  const review = (daysAgo: number, phase?: "storm") =>
    createAnalyticsEvent({
      eventType: "walk_recall_rated",
      eventGroup: "review",
      palaceId: "p1",
      routeId: "r1",
      nodeId: "n1",
      createdAt: at(daysAgo),
      payload: { rating: "good", ...(phase ? { phase } : {}) },
    });

  it("reads the phase from the payload, Siege unless marked Storm", () => {
    expect(eventPhase(review(0))).toBe("siege");
    expect(eventPhase(review(0, "storm"))).toBe("storm");
  });

  it("counts only Siege reviews toward today's goal, and reports the Storm ones apart", () => {
    const events = [review(0), ...Array.from({ length: 30 }, () => review(0, "storm"))];
    expect(countReviewedToday(events, NOW)).toBe(1);
    expect(countStormReviewedToday(events, NOW)).toBe(30);
  });

  it("does not keep a streak alive on Storm reviews alone", () => {
    expect(computeDailyStreak([review(0), review(1), review(2)], NOW)).toBe(3);
    expect(computeDailyStreak([review(0), review(1, "storm"), review(2)], NOW)).toBe(1);
  });

  it("filters retention by phase, and counts both when no phase is asked for", () => {
    const events = [review(1), review(1, "storm"), review(1, "storm")];
    const count = (phase?: "siege" | "storm") => buildRetentionSeries(events, 30, { phase }, NOW)[0]?.count;
    expect(count()).toBe(3);
    expect(count("siege")).toBe(1);
    expect(count("storm")).toBe(2);
  });
});
