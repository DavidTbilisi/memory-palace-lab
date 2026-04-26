import { describe, expect, it } from "vitest";
import { createAnalyticsEvent } from "./analyticsService";
import { buildReviewQueue, summarizeReviewQueue } from "./reviewQueueService";

describe("reviewQueueService", () => {
  it("orders due route and node reviews ahead of fresh and scheduled items", () => {
    const analyticsEvents = [
      createAnalyticsEvent({
        eventType: "walk_recall_rated",
        eventGroup: "review",
        sessionId: "walk-a",
        palaceId: "palace-1",
        routeId: "route-a",
        nodeId: "node-a",
        createdAt: "2026-04-26T09:00:00.000Z",
        payload: { rating: "again", routeName: "Route A" },
      }),
      createAnalyticsEvent({
        eventType: "walk_closed",
        eventGroup: "review",
        sessionId: "walk-a",
        palaceId: "palace-1",
        routeId: "route-a",
        nodeId: "node-a",
        createdAt: "2026-04-26T09:01:00.000Z",
        payload: { routeName: "Route A" },
      }),
      createAnalyticsEvent({
        eventType: "walk_recall_rated",
        eventGroup: "review",
        sessionId: "walk-b",
        palaceId: "palace-1",
        routeId: "route-b",
        nodeId: "node-b",
        createdAt: "2026-04-26T09:05:00.000Z",
        payload: { rating: "easy", routeName: "Route B" },
      }),
      createAnalyticsEvent({
        eventType: "walk_closed",
        eventGroup: "review",
        sessionId: "walk-b",
        palaceId: "palace-1",
        routeId: "route-b",
        nodeId: "node-b",
        createdAt: "2026-04-26T09:06:00.000Z",
        payload: { routeName: "Route B" },
      }),
    ];

    const queue = buildReviewQueue({
      analyticsEvents,
      palaceId: "palace-1",
      now: "2026-04-26T09:10:00.000Z",
      routes: [
        { id: "route-a", palaceId: "palace-1", name: "Route A" },
        { id: "route-b", palaceId: "palace-1", name: "Route B" },
        { id: "route-c", palaceId: "palace-1", name: "Route C" },
      ],
      nodes: [
        { id: "node-a", objectId: "object-a", title: "Node A", content: "", kind: "memory", portal: null },
        { id: "node-b", objectId: "object-b", title: "Node B", content: "", kind: "memory", portal: null },
        { id: "node-c", objectId: "object-c", title: "Node C", content: "", kind: "memory", portal: null },
      ],
    });

    expect(queue.find((item) => item.kind === "route" && item.routeId === "route-a")).toMatchObject({
      kind: "route",
      routeId: "route-a",
      state: "overdue",
      latestRating: "again",
    });
    expect(queue.find((item) => item.kind === "node" && item.nodeId === "node-a")).toMatchObject({
      kind: "node",
      nodeId: "node-a",
      state: "overdue",
      latestRating: "again",
    });
    expect(queue.some((item) => item.kind === "route" && item.routeId === "route-c" && item.state === "fresh")).toBe(true);
    expect(queue.some((item) => item.kind === "node" && item.nodeId === "node-c" && item.state === "fresh")).toBe(true);
    expect(queue.some((item) => item.kind === "route" && item.routeId === "route-b" && item.state === "scheduled")).toBe(true);

    const summary = summarizeReviewQueue(queue);
    expect(summary.dueCount).toBe(2);
    expect(summary.overdueCount).toBe(2);
    expect(summary.freshCount).toBe(2);
    expect(summary.routeItems).toBe(3);
    expect(summary.nodeItems).toBe(3);
  });
});
