import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, AnalyticsEventGroup, AnalyticsEventType } from "../../domain/entities/types";
import { formatEventDetail, heatmapTone, retentionPath } from "./analyticsFormatters";

function event(eventType: AnalyticsEventType, payload: Record<string, unknown>, group: AnalyticsEventGroup = "graph"): AnalyticsEvent {
  return {
    id: "e1",
    eventType,
    eventGroup: group,
    createdAt: new Date().toISOString(),
    payloadJson: JSON.stringify(payload),
  };
}

describe("formatEventDetail", () => {
  it("formats a recall rating with latency", () => {
    expect(formatEventDetail(event("walk_recall_rated", { rating: "good", timeToRevealMs: 1200 }, "review"))).toBe(
      "good - 1200 ms",
    );
  });

  it("falls back to unrated / no timer when fields are missing", () => {
    expect(formatEventDetail(event("walk_recall_rated", {}, "review"))).toBe("unrated - no timer");
  });

  it("formats an answer reveal with and without timer", () => {
    expect(formatEventDetail(event("walk_answer_revealed", { timeToRevealMs: 800 }, "review"))).toBe("800 ms to reveal");
    expect(formatEventDetail(event("walk_answer_revealed", {}, "review"))).toBe("answer revealed");
  });

  it("uses node title or a sensible default", () => {
    expect(formatEventDetail(event("node_created", { title: "Front Door" }))).toBe("Front Door");
    expect(formatEventDetail(event("node_updated", { title: "   " }))).toBe("memory node");
  });

  it("uses edge label, route name, and pipeline title", () => {
    expect(formatEventDetail(event("edge_created", { label: "causes" }))).toBe("causes");
    expect(formatEventDetail(event("route_created", { name: "Grand Tour" }))).toBe("Grand Tour");
    expect(formatEventDetail(event("system_run_materialized", { pipelineTitle: "P1" }, "system"))).toBe("P1");
  });

  it("falls back to payload source or a generic label", () => {
    expect(formatEventDetail(event("palace_opened", { source: "import" }, "palace"))).toBe("import");
    expect(formatEventDetail(event("palace_opened", {}, "palace"))).toBe("local event");
  });
});

describe("retentionPath", () => {
  it("returns an empty string for no points", () => {
    expect(retentionPath([], 640, 220)).toBe("");
  });

  it("starts with a move command and places a single point at the left padding", () => {
    const path = retentionPath([{ averageScorePct: 100 }], 640, 220);
    expect(path.startsWith("M 24")).toBe(true);
  });

  it("emits one segment per point", () => {
    const path = retentionPath([{ averageScorePct: 100 }, { averageScorePct: 50 }, { averageScorePct: 0 }], 640, 220);
    expect((path.match(/[ML]/g) ?? []).length).toBe(3);
  });

  it("maps a higher score to a higher position (smaller y)", () => {
    const high = retentionPath([{ averageScorePct: 100 }], 100, 100, 10);
    const low = retentionPath([{ averageScorePct: 0 }], 100, 100, 10);
    const yHigh = Number(high.split(" ")[2]);
    const yLow = Number(low.split(" ")[2]);
    expect(yHigh).toBeLessThan(yLow);
  });
});

describe("heatmapTone", () => {
  it("buckets counts into tone classes", () => {
    expect(heatmapTone(0)).toBe("bg-zinc-900");
    expect(heatmapTone(-5)).toBe("bg-zinc-900");
    expect(heatmapTone(2)).toBe("bg-emerald-900/60");
    expect(heatmapTone(3)).toBe("bg-emerald-900/60");
    expect(heatmapTone(5)).toBe("bg-emerald-600/70");
    expect(heatmapTone(9)).toBe("bg-emerald-600/70");
    expect(heatmapTone(20)).toBe("bg-emerald-400");
  });
});
