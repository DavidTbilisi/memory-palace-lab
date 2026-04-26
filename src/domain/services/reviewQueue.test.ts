import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, Locus, MemoryNode, MemoryRoute } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import { buildReviewQueue } from "./reviewQueue";

const routes: MemoryRoute[] = [
  { id: "route-a", palaceId: "palace-1", name: "Route A" },
  { id: "route-b", palaceId: "palace-1", name: "Route B" },
];

const loci: Locus[] = [
  { id: "l1", routeId: "route-a", nodeId: "node-1", orderIndex: 0, label: "A1" },
  { id: "l2", routeId: "route-a", nodeId: "node-2", orderIndex: 1, label: "A2" },
  { id: "l3", routeId: "route-b", nodeId: "node-3", orderIndex: 0, label: "B1" },
];

const nodes: MemoryNode[] = [
  { id: "node-1", objectId: "o1", title: "Gateway", content: "", kind: "memory", portal: null },
  { id: "node-2", objectId: "o2", title: "Router", content: "", kind: "memory", portal: null },
  { id: "node-3", objectId: "o3", title: "Cache", content: "", kind: "memory", portal: null },
];

function recall(nodeId: string, routeId: string, rating: "again" | "hard" | "good" | "easy", createdAt: string): AnalyticsEvent {
  return createAnalyticsEvent({
    eventType: "walk_recall_rated",
    eventGroup: "review",
    palaceId: "palace-1",
    routeId,
    nodeId,
    createdAt,
    payload: { rating, routeName: routeId },
  });
}

describe("buildReviewQueue", () => {
  it("prioritizes unseen and weak routes ahead of stable ones", () => {
    const result = buildReviewQueue({
      currentPalaceId: "palace-1",
      routes,
      loci,
      nodes,
      analyticsEvents: [
        recall("node-1", "route-a", "again", "2026-01-04T10:00:00.000Z"),
        recall("node-2", "route-a", "good", "2026-01-04T10:01:00.000Z"),
        recall("node-3", "route-b", "easy", "2026-01-05T10:00:00.000Z"),
      ],
    });

    expect(result.queue[0]?.routeId).toBe("route-a");
    expect(result.summary.weakNodes).toBe(1);
    expect(result.summary.stableNodes).toBe(2);
  });

  it("marks nodes without recall data as unseen", () => {
    const result = buildReviewQueue({
      currentPalaceId: "palace-1",
      routes,
      loci,
      nodes,
      analyticsEvents: [],
    });

    expect(result.queue[0]?.unseenCount).toBeGreaterThan(0);
    expect(result.summary.unseenNodes).toBe(3);
    expect(result.weakestNodes[0]?.rating).toBe("unseen");
  });
});
