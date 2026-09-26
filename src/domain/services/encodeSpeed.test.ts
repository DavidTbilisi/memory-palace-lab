import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../entities/types";
import {
  buildEncodeTrend,
  encodeSamples,
  median,
  nodeEncodeSpeeds,
  speedBandOf,
  speedBandThresholds,
} from "./encodeSpeed";

const NOW = "2026-09-25T12:00:00.000Z";
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.parse(NOW) - days * DAY).toISOString();
let seq = 0;

function nodeEncode(nodeId: string, activeMs: number | null, days: number, first = true, palaceId = "p1"): AnalyticsEvent {
  return {
    id: `e${seq++}`,
    palaceId,
    nodeId,
    eventType: "node_encoded",
    eventGroup: "graph",
    createdAt: daysAgo(days),
    payloadJson: JSON.stringify({ first, activeMs, fields: ["title"] }),
  };
}

function edgeEncode(edgeId: string, activeMs: number, days: number, first = true): AnalyticsEvent {
  return {
    id: `e${seq++}`,
    palaceId: "p1",
    nodeId: "src",
    eventType: "edge_encoded",
    eventGroup: "graph",
    createdAt: daysAgo(days),
    payloadJson: JSON.stringify({ edgeId, first, activeMs }),
  };
}

/** Twelve first encodes at 10s, 20s ... 120s. */
const twelve = Array.from({ length: 12 }, (_, index) => nodeEncode(`n${index}`, (index + 1) * 10_000, index + 1));

describe("encode samples", () => {
  it("reads node and edge encodes oldest first and skips other events", () => {
    const samples = encodeSamples([
      nodeEncode("a", 5000, 1),
      edgeEncode("e1", 7000, 3, false),
      { ...nodeEncode("b", 1, 0), eventType: "node_updated" },
    ]);
    expect(samples).toEqual([
      { kind: "edge", id: "e1", palaceId: "p1", first: false, activeMs: 7000, at: daysAgo(3) },
      { kind: "node", id: "a", palaceId: "p1", first: true, activeMs: 5000, at: daysAgo(1) },
    ]);
  });

  it("takes the median of an even or odd list", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([])).toBeNull();
  });
});

describe("speed bands", () => {
  it("has no band before twelve timed first encodes", () => {
    expect(speedBandThresholds(encodeSamples(twelve.slice(0, 11)), NOW)).toBeNull();
    expect(nodeEncodeSpeeds(twelve.slice(0, 11), NOW).get("n0")).toEqual({ activeMs: 10_000, band: null });
  });

  it("splits the learner's own first encodes into thirds", () => {
    const thresholds = speedBandThresholds(encodeSamples(twelve), NOW)!;
    expect(thresholds.samples).toBe(12);
    expect(thresholds.fastMs).toBeCloseTo(46_667, -1);
    expect(thresholds.slowMs).toBeCloseTo(83_333, -1);
    const speeds = nodeEncodeSpeeds(twelve, NOW);
    expect(speeds.get("n0")?.band).toBe("fast");
    expect(speeds.get("n5")?.band).toBe("typical");
    expect(speeds.get("n11")?.band).toBe("slow");
    expect([...speeds.values()].filter((speed) => speed.band === "fast")).toHaveLength(4);
  });

  it("follows the learner, so the same time bands differently for a faster learner", () => {
    const quick = Array.from({ length: 12 }, (_, index) => nodeEncode(`q${index}`, (index + 1) * 1000, 1));
    expect(speedBandOf(30_000, speedBandThresholds(encodeSamples(twelve), NOW)!)).toBe("fast");
    expect(speedBandOf(30_000, speedBandThresholds(encodeSamples(quick), NOW)!)).toBe("slow");
  });

  it("leaves out re-edits, unmeasured encodes, and encodes older than 90 days", () => {
    const noise = [
      nodeEncode("r", 999_000, 1, false),
      nodeEncode("u", null, 1),
      nodeEncode("old", 999_000, 91),
    ];
    expect(speedBandThresholds(encodeSamples([...twelve.slice(0, 11), ...noise]), NOW)).toBeNull();
    expect(speedBandThresholds(encodeSamples([...twelve, ...noise]), NOW)?.samples).toBe(12);
    // A node timed long ago still gets a band from today's thresholds.
    expect(nodeEncodeSpeeds([...twelve, ...noise], NOW).get("old")?.band).toBe("slow");
    expect(nodeEncodeSpeeds([...twelve, ...noise], NOW).has("u")).toBe(false);
    expect(nodeEncodeSpeeds([...twelve, ...noise], NOW).has("r")).toBe(false);
  });
});

describe("encode trend", () => {
  it("takes weekly medians with first encodes and re-edits apart", () => {
    const trend = buildEncodeTrend(
      [
        nodeEncode("a", 10_000, 1),
        nodeEncode("b", 30_000, 2),
        nodeEncode("a", 4_000, 3, false),
        edgeEncode("e1", 8_000, 9),
        nodeEncode("c", 60_000, 30),
      ],
      NOW,
      { weeks: 5 },
    );
    expect(trend.weeks).toHaveLength(5);
    expect(trend.weeks[4].node).toEqual({ first: 20_000, reedit: 4_000, firstCount: 2, reeditCount: 1 });
    expect(trend.weeks[3].edge).toMatchObject({ first: 8_000, firstCount: 1 });
    expect(trend.weeks[0].node).toMatchObject({ first: 60_000 });
    expect(trend.weeks[2].node).toEqual({ first: null, reedit: null, firstCount: 0, reeditCount: 0 });
    expect(trend.spanDays).toBe(30);
    // The headline median is over raw first encodes of the last four weeks (10s, 30s, 8s edge).
    expect(trend.recent).toEqual({ node: { median: 20_000, count: 2 }, edge: { median: 8_000, count: 1 } });
    expect(trend.ready).toBe(true);
  });

  it("waits for four weeks of encodes, and leaves out unmeasured ones", () => {
    expect(buildEncodeTrend([nodeEncode("a", 10_000, 27), nodeEncode("u", null, 60)], NOW).ready).toBe(false);
    expect(buildEncodeTrend([], NOW)).toMatchObject({ spanDays: 0, ready: false });
  });

  it("can keep to one palace", () => {
    const trend = buildEncodeTrend([nodeEncode("a", 10_000, 1), nodeEncode("b", 90_000, 1, true, "p2")], NOW, {
      weeks: 1,
      palaceId: "p2",
    });
    expect(trend.weeks[0].node.first).toBe(90_000);
  });
});
