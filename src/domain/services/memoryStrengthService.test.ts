import { describe, expect, it } from "vitest";
import type { RecallRating } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import { buildMemoryStrengthDashboard } from "./memoryStrengthService";

function makeRouteCreated(palaceId: string, routeId: string, name: string, createdAt: string) {
  return createAnalyticsEvent({
    eventType: "route_created",
    eventGroup: "graph",
    palaceId,
    routeId,
    createdAt,
    payload: { name },
  });
}

function makeReviewSession(input: {
  palaceId: string;
  routeId: string;
  routeName: string;
  nodeId: string;
  nodeTitle: string;
  sessionId: string;
  createdAt: string;
  rating: RecallRating;
  timeToRevealMs: number;
}) {
  return [
    createAnalyticsEvent({
      eventType: "walk_recall_rated",
      eventGroup: "review",
      sessionId: input.sessionId,
      palaceId: input.palaceId,
      routeId: input.routeId,
      nodeId: input.nodeId,
      createdAt: input.createdAt,
      payload: {
        rating: input.rating,
        routeName: input.routeName,
        nodeTitle: input.nodeTitle,
        timeToRevealMs: input.timeToRevealMs,
      },
    }),
    createAnalyticsEvent({
      eventType: "walk_closed",
      eventGroup: "review",
      sessionId: input.sessionId,
      palaceId: input.palaceId,
      routeId: input.routeId,
      nodeId: input.nodeId,
      createdAt: new Date(Date.parse(input.createdAt) + 60_000).toISOString(),
      payload: {
        routeName: input.routeName,
        nodeTitle: input.nodeTitle,
      },
    }),
  ];
}

describe("memoryStrengthService", () => {
  it("prioritizes weak overdue material and marks fragile routes", () => {
    const palaces = [
      { id: "palace-weak", name: "Weak Palace", createdAt: "2026-04-20T08:00:00.000Z", atlasPath: "Georgia/Tbilisi" },
      { id: "palace-strong", name: "Strong Palace", createdAt: "2026-04-20T08:00:00.000Z", atlasPath: "Georgia/Batumi" },
    ];
    const events = [
      makeRouteCreated("palace-weak", "route-weak", "Weak Route", "2026-04-20T08:00:00.000Z"),
      ...makeReviewSession({
        palaceId: "palace-weak",
        routeId: "route-weak",
        routeName: "Weak Route",
        nodeId: "node-weak",
        nodeTitle: "Weak Node",
        sessionId: "weak-1",
        createdAt: "2026-04-20T09:00:00.000Z",
        rating: "again",
        timeToRevealMs: 18_000,
      }),
      makeRouteCreated("palace-strong", "route-strong", "Strong Route", "2026-04-24T08:00:00.000Z"),
      ...makeReviewSession({
        palaceId: "palace-strong",
        routeId: "route-strong",
        routeName: "Strong Route",
        nodeId: "node-strong",
        nodeTitle: "Strong Node",
        sessionId: "strong-1",
        createdAt: "2026-04-24T09:00:00.000Z",
        rating: "easy",
        timeToRevealMs: 900,
      }),
    ];

    const dashboard = buildMemoryStrengthDashboard({
      analyticsEvents: events,
      palaces,
      now: "2026-04-26T12:00:00.000Z",
    });

    expect(dashboard.overview.totalDue).toBe(2);
    expect(dashboard.actionItems.some((item) => item.title === "Weak Route" && item.palaceName === "Weak Palace")).toBe(true);
    expect(dashboard.actionItems.some((item) => item.title === "Weak Node" && item.urgency === "critical")).toBe(true);
    expect(dashboard.palaceHealth[0]).toMatchObject({
      palaceName: "Weak Palace",
      dueCount: 2,
      overdueCount: 2,
    });
    expect(dashboard.routeFriction[0]).toMatchObject({
      routeName: "Weak Route",
      palaceName: "Weak Palace",
      status: "cognitively_expensive",
    });
  });

  it("tracks improving and decaying palace trends from repeated review history", () => {
    const palaces = [
      { id: "palace-up", name: "Improving Palace", createdAt: "2026-04-20T08:00:00.000Z" },
      { id: "palace-down", name: "Decaying Palace", createdAt: "2026-04-20T08:00:00.000Z" },
    ];
    const improvingRatings: RecallRating[] = ["again", "hard", "good", "good", "easy", "easy"];
    const decayingRatings: RecallRating[] = ["easy", "easy", "good", "good", "hard", "again"];
    const events = [
      makeRouteCreated("palace-up", "route-up", "Improving Route", "2026-04-20T08:00:00.000Z"),
      makeRouteCreated("palace-down", "route-down", "Decaying Route", "2026-04-20T08:00:00.000Z"),
      ...improvingRatings.flatMap((rating, index) =>
        makeReviewSession({
          palaceId: "palace-up",
          routeId: "route-up",
          routeName: "Improving Route",
          nodeId: `node-up-${index}`,
          nodeTitle: `Improving Node ${index}`,
          sessionId: `up-${index}`,
          createdAt: `2026-04-${String(20 + index).padStart(2, "0")}T09:00:00.000Z`,
          rating,
          timeToRevealMs: 5_000 - index * 500,
        }),
      ),
      ...decayingRatings.flatMap((rating, index) =>
        makeReviewSession({
          palaceId: "palace-down",
          routeId: "route-down",
          routeName: "Decaying Route",
          nodeId: `node-down-${index}`,
          nodeTitle: `Decaying Node ${index}`,
          sessionId: `down-${index}`,
          createdAt: `2026-04-${String(20 + index).padStart(2, "0")}T11:00:00.000Z`,
          rating,
          timeToRevealMs: 1_500 + index * 1_500,
        }),
      ),
    ];

    const dashboard = buildMemoryStrengthDashboard({
      analyticsEvents: events,
      palaces,
      now: "2026-04-26T12:00:00.000Z",
    });

    const improving = dashboard.palaceHealth.find((item) => item.palaceId === "palace-up");
    const decaying = dashboard.palaceHealth.find((item) => item.palaceId === "palace-down");

    expect(improving?.trendDirection).toBe("improving");
    expect(decaying?.trendDirection).toBe("decaying");
    expect(dashboard.trend).toHaveLength(7);
  });
});
