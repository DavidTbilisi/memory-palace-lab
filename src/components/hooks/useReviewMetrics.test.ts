import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, Locus } from "../../domain/entities/types";
import { useReviewMetrics } from "./useReviewMetrics";

function ratingEvent(id: string, createdAt: string, rating: string): AnalyticsEvent {
  return {
    id,
    eventType: "walk_recall_rated",
    eventGroup: "review",
    createdAt,
    payloadJson: JSON.stringify({ rating }),
  };
}

function locus(id: string, overrides: Partial<Locus> = {}): Locus {
  return {
    id,
    routeId: "r1",
    nodeId: "n1",
    orderIndex: 0,
    label: "",
    ...overrides,
  } as Locus;
}

describe("useReviewMetrics", () => {
  it("returns null averages and empty series with no data", () => {
    const { result } = renderHook(() => useReviewMetrics([], [], {}));
    expect(result.current.retentionSeries).toEqual([]);
    expect(result.current.dueCount).toBe(0);
    expect(result.current.averageInterval).toBeNull();
    expect(result.current.trendDown).toBe(false);
  });

  it("counts loci that are due now", () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    const future = new Date(Date.now() + 86_400_000).toISOString();
    const { result } = renderHook(() =>
      useReviewMetrics(
        [],
        [locus("a", { nextReviewAt: past }), locus("b", { nextReviewAt: future })],
        {},
      ),
    );
    expect(result.current.dueCount).toBe(1);
  });

  it("builds a heatmap covering 52 weeks of days", () => {
    const { result } = renderHook(() => useReviewMetrics([ratingEvent("e1", new Date().toISOString(), "good")], [], {}));
    expect(result.current.heatmapCells.length).toBeGreaterThan(300);
    expect(result.current.heatmapCells.some((c) => c.count > 0)).toBe(true);
  });
});
