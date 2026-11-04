import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, RecallRating } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import { formatRecall, measureInterventions } from "./interventionImpact";

let minute = 0;
const at = () => new Date(Date.UTC(2026, 10, 1, 9, ++minute)).toISOString();

function rated(nodeId: string, rating: RecallRating, routeId = "r", extra: Record<string, unknown> = {}): AnalyticsEvent {
  return {
    ...createAnalyticsEvent({ eventType: "walk_recall_rated", eventGroup: "review", routeId, nodeId, payload: { rating, ...extra } }),
    createdAt: at(),
  };
}

function accepted(payload: Record<string, unknown>): AnalyticsEvent {
  return { ...createAnalyticsEvent({ eventType: "intervention_accepted", eventGroup: "review", payload }), createdAt: at() };
}

describe("measureInterventions", () => {
  it("compares recall on the node before and after it was re-encoded, five ratings each side", () => {
    const events = [
      rated("a", "good"),
      ...(["again", "hard", "again", "good", "again"] as RecallRating[]).map((r) => rated("a", r)),
      rated("b", "again"),
      accepted({ kind: "re-encode", nodeIds: ["a"], title: "Closure" }),
      ...(["good", "easy", "hard", "good", "good", "again"] as RecallRating[]).map((r) => rated("a", r)),
    ];
    const [impact] = measureInterventions(events);
    expect(impact).toMatchObject({ kind: "re-encode", title: "Closure", ready: true });
    expect(impact!.before).toEqual({ good: 1, total: 5 });
    expect(impact!.after).toEqual({ good: 4, total: 5 });
    expect(formatRecall(impact!.before)).toBe("20%");
    expect(formatRecall(impact!.after)).toBe("80%");
  });

  it("waits for three ratings after before judging, and ignores Storm ratings", () => {
    const events = [
      rated("a", "again"),
      accepted({ kind: "re-encode", nodeIds: ["a"], title: "Closure" }),
      rated("a", "good"),
      rated("a", "good", "r", { phase: "storm" }),
      rated("a", "good"),
    ];
    expect(measureInterventions(events)[0]).toMatchObject({ ready: false, after: { good: 2, total: 2 } });
  });

  it("measures a route fix on its routes, both the old and the new", () => {
    const events = [
      rated("a", "again", "r"),
      rated("x", "hard", "elsewhere"),
      accepted({ kind: "route-surgery", nodeIds: [], routeIds: ["r", "r2"], title: "Basics" }),
      rated("a", "good", "r"),
      rated("b", "good", "r2"),
      rated("c", "again", "r2"),
    ];
    expect(measureInterventions(events)[0]).toMatchObject({
      before: { good: 0, total: 1 },
      after: { good: 2, total: 3 },
      ready: true,
    });
  });

  it("lists the latest first, and skips events that touched nothing", () => {
    const events = [accepted({ kind: "re-encode", nodeIds: ["a"], title: "First" }), accepted({ kind: "link-confusion" }), accepted({ kind: "add-distinguisher", nodeIds: ["b"], title: "Second" })];
    expect(measureInterventions(events).map((i) => i.title)).toEqual(["Second", "First"]);
    expect(formatRecall({ good: 0, total: 0 })).toBe("–");
  });
});
