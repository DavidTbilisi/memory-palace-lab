import { describe, expect, it } from "vitest";
import { createAnalyticsEvent, parseAnalyticsPayload, summarizeAnalytics } from "./analyticsService";

describe("analyticsService", () => {
  it("serializes payloads and summarizes session activity", () => {
    const events = [
      createAnalyticsEvent({
        eventType: "palace_opened",
        eventGroup: "palace",
        sessionId: "session-1",
        palaceId: "palace-a",
        createdAt: "2026-04-26T09:00:00.000Z",
      }),
      createAnalyticsEvent({
        eventType: "node_created",
        eventGroup: "graph",
        sessionId: "session-1",
        palaceId: "palace-a",
        nodeId: "node-1",
        createdAt: "2026-04-26T09:01:00.000Z",
        payload: { title: "Gateway" },
      }),
      createAnalyticsEvent({
        eventType: "walk_recall_rated",
        eventGroup: "review",
        sessionId: "session-1",
        palaceId: "palace-a",
        routeId: "route-1",
        nodeId: "node-1",
        createdAt: "2026-04-26T09:02:00.000Z",
        payload: { rating: "good", timeToRevealMs: 1800 },
      }),
      createAnalyticsEvent({
        eventType: "palace_opened",
        eventGroup: "palace",
        sessionId: "session-2",
        palaceId: "palace-b",
        createdAt: "2026-04-26T10:00:00.000Z",
      }),
      createAnalyticsEvent({
        eventType: "walk_recall_rated",
        eventGroup: "review",
        sessionId: "session-2",
        palaceId: "palace-b",
        routeId: "route-2",
        nodeId: "node-2",
        createdAt: "2026-04-26T10:02:00.000Z",
        payload: { rating: "easy", timeToRevealMs: 900 },
      }),
    ];

    const summary = summarizeAnalytics(events);

    expect(summary.totalEvents).toBe(5);
    expect(summary.currentSessionId).toBe("session-2");
    expect(summary.countsByGroup.review).toBe(2);
    expect(summary.countsByType.walk_recall_rated).toBe(2);
    expect(summary.currentSessionCounts.walk_recall_rated).toBe(1);
    expect(summary.recallRatings.good).toBe(1);
    expect(summary.recallRatings.easy).toBe(1);
    expect(summary.averageRecallLatencyMs).toBe(1350);
    expect(parseAnalyticsPayload(events[1]).title).toBe("Gateway");
  });

  it("ignores malformed payload json", () => {
    const summary = summarizeAnalytics([
      {
        id: "broken",
        sessionId: "session-1",
        palaceId: "palace-a",
        routeId: "route-1",
        nodeId: "node-1",
        eventType: "walk_recall_rated",
        eventGroup: "review",
        createdAt: "2026-04-26T09:02:00.000Z",
        payloadJson: "{not-json",
      },
    ]);

    expect(summary.recallRatings.good).toBe(0);
    expect(summary.averageRecallLatencyMs).toBeNull();
  });
});
