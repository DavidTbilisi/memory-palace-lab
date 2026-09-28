import { describe, expect, it } from "vitest";
import type { AnalyticsEvent, Locus, MemoryNode, MemoryRoute, NedfEncoding, RecallRating } from "../entities/types";
import { createAnalyticsEvent } from "./analyticsService";
import type { DueQueueSnapshot } from "./dueQueue";
import {
  buildMemoryStrengthDashboard,
  formatRouteFrictionStatus,
  formatTrendDirection,
  trendDirectionFromDelta,
  urgencyFromScore,
} from "./memoryStrengthService";

const NOW = "2026-04-26T12:00:00.000Z";

type StopSpec = {
  locusId: string;
  nodeId: string;
  title: string;
  routeId: string;
  nextReviewAt: string;
  lastReviewedAt?: string | null;
  nedf?: NedfEncoding;
  slotSchedules?: Locus["slotSchedules"];
};

function snapshot(
  palace: { id: string; name: string },
  routes: Array<Pick<MemoryRoute, "id" | "name"> & { inReview?: boolean }>,
  stops: StopSpec[] = [],
): DueQueueSnapshot {
  return {
    palace: { ...palace, createdAt: "2026-04-01T00:00:00.000Z" },
    routes: routes.map((route) => ({ ...route, palaceId: palace.id })),
    nodes: stops.map(
      (stop): MemoryNode => ({
        id: stop.nodeId,
        objectId: `obj-${stop.nodeId}`,
        title: stop.title,
        content: "",
        kind: "memory",
        portal: null,
        nedf: stop.nedf ?? null,
      }),
    ),
    loci: stops.map(
      (stop, index): Locus => ({
        id: stop.locusId,
        routeId: stop.routeId,
        nodeId: stop.nodeId,
        orderIndex: index,
        label: `Stop ${index + 1}`,
        interval: 1,
        easeFactor: 2.5,
        repetitions: stop.lastReviewedAt === null ? 0 : 1,
        nextReviewAt: stop.nextReviewAt,
        lastReviewedAt: stop.lastReviewedAt === undefined ? "2026-04-20T09:00:00.000Z" : stop.lastReviewedAt,
        slotSchedules: stop.slotSchedules,
      }),
    ),
  };
}

function rated(input: {
  palaceId: string;
  routeId: string;
  nodeId: string;
  createdAt: string;
  rating: RecallRating;
  locusId?: string;
  sessionId?: string;
  timeToRevealMs?: number;
  slot?: string;
  phase?: "storm";
}): AnalyticsEvent {
  return createAnalyticsEvent({
    eventType: "walk_recall_rated",
    eventGroup: "review",
    sessionId: input.sessionId ?? `s-${input.createdAt}`,
    palaceId: input.palaceId,
    routeId: input.routeId,
    nodeId: input.nodeId,
    createdAt: input.createdAt,
    payload: {
      rating: input.rating,
      locusId: input.locusId ?? null,
      slot: input.slot ?? null,
      timeToRevealMs: input.timeToRevealMs,
      ...(input.phase ? { phase: input.phase } : {}),
    },
  });
}

describe("memoryStrengthService", () => {
  it("prioritizes weak overdue material and marks fragile routes", () => {
    const snapshots = [
      snapshot({ id: "palace-strong", name: "Strong Palace" }, [{ id: "route-strong", name: "Strong Route" }], [
        {
          locusId: "l-strong",
          nodeId: "node-strong",
          title: "Strong Node",
          routeId: "route-strong",
          nextReviewAt: "2026-05-02T09:00:00.000Z",
          lastReviewedAt: "2026-04-24T09:00:00.000Z",
        },
      ]),
      snapshot({ id: "palace-weak", name: "Weak Palace" }, [{ id: "route-weak", name: "Weak Route" }], [
        {
          locusId: "l-weak",
          nodeId: "node-weak",
          title: "Weak Node",
          routeId: "route-weak",
          nextReviewAt: "2026-04-21T09:00:00.000Z",
        },
      ]),
    ];
    const events = [
      rated({ palaceId: "palace-weak", routeId: "route-weak", nodeId: "node-weak", locusId: "l-weak", createdAt: "2026-04-20T09:00:00.000Z", rating: "again", timeToRevealMs: 18_000 }),
      rated({ palaceId: "palace-strong", routeId: "route-strong", nodeId: "node-strong", locusId: "l-strong", createdAt: "2026-04-24T09:00:00.000Z", rating: "easy", timeToRevealMs: 900 }),
    ];

    const dashboard = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: events, now: NOW });

    expect(dashboard.overview).toMatchObject({ totalDue: 1, totalOverdue: 1, reviewSessions: 2, siegeRatings: 2 });
    expect(dashboard.actionItems.map((item) => item.title)).toEqual(["Weak Node", "Strong Node"]);
    expect(dashboard.actionItems[0]).toMatchObject({
      palaceName: "Weak Palace",
      routeName: "Weak Route",
      state: "overdue",
      due: true,
      urgency: "critical",
      latestRating: "again",
      slot: null,
    });
    expect(dashboard.actionItems[1]).toMatchObject({ state: "scheduled", urgency: "strong", due: false });
    expect(dashboard.palaceHealth[0]).toMatchObject({
      palaceName: "Weak Palace",
      dueCount: 1,
      overdueCount: 1,
      weakItems: 1,
      hotspotTitle: "Weak Node",
    });
    expect(dashboard.palaceHealth[1]).toMatchObject({ palaceName: "Strong Palace", healthScore: 100, hotspotTitle: null });
    expect(dashboard.routeFriction[0]).toMatchObject({
      routeName: "Weak Route",
      palaceName: "Weak Palace",
      status: "cognitively_expensive",
      dueState: "overdue",
      averageRevealLatencyMs: 18_000,
    });
    expect(dashboard.routeFriction[0]!.reasons).toEqual([
      "100% of recalls failed",
      "slow to recall: 18.0 s before reveal",
      "1 stop overdue or due",
    ]);
    expect(dashboard.routeFriction[1]).toMatchObject({ routeName: "Strong Route", status: "steady", reasons: [] });
  });

  it("tracks improving and decaying palace trends from repeated review history", () => {
    const snapshots = [
      snapshot({ id: "palace-up", name: "Improving Palace" }, [{ id: "route-up", name: "Improving Route" }]),
      snapshot({ id: "palace-down", name: "Decaying Palace" }, [{ id: "route-down", name: "Decaying Route" }]),
    ];
    const improvingRatings: RecallRating[] = ["again", "hard", "good", "good", "easy", "easy"];
    const decayingRatings: RecallRating[] = ["easy", "easy", "good", "good", "hard", "again"];
    const day = (index: number, hour: string) => `2026-04-${String(20 + index).padStart(2, "0")}T${hour}:00:00.000Z`;
    const events = [
      ...improvingRatings.map((rating, index) =>
        rated({ palaceId: "palace-up", routeId: "route-up", nodeId: `node-up-${index}`, createdAt: day(index, "09"), rating }),
      ),
      ...decayingRatings.map((rating, index) =>
        rated({ palaceId: "palace-down", routeId: "route-down", nodeId: `node-down-${index}`, createdAt: day(index, "11"), rating }),
      ),
    ];

    const dashboard = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: events, now: NOW });

    const improving = dashboard.palaceHealth.find((item) => item.palaceId === "palace-up");
    const decaying = dashboard.palaceHealth.find((item) => item.palaceId === "palace-down");
    expect(improving).toMatchObject({ trendDirection: "improving", reviewCount: 6, healthScore: null });
    expect(decaying?.trendDirection).toBe("decaying");
    expect(dashboard.trend).toHaveLength(7);
    // Across both palaces the ups and downs cancel out.
    expect(dashboard.overview).toMatchObject({ trendDirection: "stagnating", trendDelta: 0 });
  });

  it("scores a stop with NEDF slots by its weakest slot and asks that slot", () => {
    const nedf: NedfEncoding = { nameHook: "Lock-and-key", essence: "One owner at a time" };
    const snapshots = [
      snapshot({ id: "p", name: "Palace" }, [{ id: "r", name: "Route" }], [
        {
          locusId: "l-mutex",
          nodeId: "n-mutex",
          title: "Mutex",
          routeId: "r",
          nextReviewAt: "2026-04-30T00:00:00.000Z",
          nedf,
          slotSchedules: {
            nameHook: { interval: 8, easeFactor: 2.6, repetitions: 2, nextReviewAt: "2026-05-04T00:00:00.000Z", lastReviewedAt: "2026-04-24T00:00:00.000Z" },
            essence: { interval: 1, easeFactor: 2.3, repetitions: 0, nextReviewAt: "2026-04-23T00:00:00.000Z", lastReviewedAt: "2026-04-22T00:00:00.000Z" },
          },
        },
      ]),
    ];
    const events = [
      rated({ palaceId: "p", routeId: "r", nodeId: "n-mutex", locusId: "l-mutex", slot: "nameHook", createdAt: "2026-04-24T00:00:00.000Z", rating: "easy" }),
      rated({ palaceId: "p", routeId: "r", nodeId: "n-mutex", locusId: "l-mutex", slot: "essence", createdAt: "2026-04-22T00:00:00.000Z", rating: "again" }),
    ];

    const [stop] = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: events, now: NOW }).actionItems;
    expect(stop).toMatchObject({
      title: "Mutex",
      cardCount: 2,
      slot: "essence",
      latestRating: "again",
      state: "overdue",
      due: true,
      dueAt: "2026-04-23T00:00:00.000Z",
      urgency: "critical",
    });
  });

  it("lets a slot never rated on its own carry the stop's earlier rating", () => {
    const snapshots = [
      snapshot({ id: "p", name: "Palace" }, [{ id: "r", name: "Route" }], [
        { locusId: "l", nodeId: "n", title: "Node", routeId: "r", nextReviewAt: "2026-05-01T00:00:00.000Z", nedf: { essence: "Gist" } },
      ]),
    ];
    const events = [rated({ palaceId: "p", routeId: "r", nodeId: "n", locusId: "l", createdAt: "2026-04-20T00:00:00.000Z", rating: "hard" })];
    const [stop] = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: events, now: NOW }).actionItems;
    expect(stop).toMatchObject({ slot: "essence", latestRating: "hard", state: "scheduled", strengthScore: 49, urgency: "weak" });
  });

  it("leaves draft routes out of strength, due counts, and friction", () => {
    const snapshots = [
      snapshot(
        { id: "p", name: "Palace" },
        [
          { id: "reviewed", name: "Reviewed" },
          { id: "draft", name: "Draft", inReview: false },
        ],
        [
          { locusId: "l1", nodeId: "n1", title: "Kept", routeId: "reviewed", nextReviewAt: "2026-05-01T00:00:00.000Z" },
          { locusId: "l2", nodeId: "n2", title: "Drafted", routeId: "draft", nextReviewAt: "2026-04-20T00:00:00.000Z" },
        ],
      ),
    ];
    const events = [
      rated({ palaceId: "p", routeId: "draft", nodeId: "n2", locusId: "l2", createdAt: "2026-04-19T00:00:00.000Z", rating: "again" }),
      rated({ palaceId: "p", routeId: "reviewed", nodeId: "n1", locusId: "l1", createdAt: "2026-04-19T00:00:00.000Z", rating: "good" }),
    ];
    const dashboard = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: events, now: NOW });
    expect(dashboard.actionItems.map((item) => item.title)).toEqual(["Kept"]);
    expect(dashboard.overview.totalDue).toBe(0);
    expect(dashboard.palaceHealth[0]).toMatchObject({ totalTrackedItems: 1, dueCount: 0 });
    expect(dashboard.routeFriction.map((item) => item.routeName)).toEqual(["Reviewed"]);
  });

  it("counts Siege ratings only: a Storm rating changes no score, trend, or friction", () => {
    const snapshots = [
      snapshot({ id: "p", name: "Palace" }, [{ id: "r", name: "Route" }], [
        { locusId: "l", nodeId: "n", title: "Node", routeId: "r", nextReviewAt: "2026-05-01T00:00:00.000Z" },
      ]),
    ];
    const siege = rated({ palaceId: "p", routeId: "r", nodeId: "n", locusId: "l", createdAt: "2026-04-24T00:00:00.000Z", rating: "easy" });
    const storm = rated({ palaceId: "p", routeId: "r", nodeId: "n", locusId: "l", createdAt: "2026-04-26T00:00:00.000Z", rating: "again", phase: "storm", timeToRevealMs: 30_000 });
    const dashboard = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: [siege, storm], now: NOW });
    expect(dashboard.actionItems[0]).toMatchObject({ latestRating: "easy", urgency: "strong" });
    expect(dashboard.overview.siegeRatings).toBe(1);
    expect(dashboard.trend.reduce((total, point) => total + point.reviewCount, 0)).toBe(1);
    expect(dashboard.routeFriction[0]).toMatchObject({ attemptCount: 1, status: "steady", averageRevealLatencyMs: null });
    expect(dashboard.palaceHealth[0]!.reviewCount).toBe(1);
  });

  it("flags a hesitant route unstable and explains why", () => {
    const snapshots = [snapshot({ id: "p", name: "Palace" }, [{ id: "r", name: "Wobbly" }])];
    const events = (["hard", "hard", "good"] as RecallRating[]).map((rating, index) =>
      rated({ palaceId: "p", routeId: "r", nodeId: `n${index}`, createdAt: `2026-04-2${index}T00:00:00.000Z`, rating }),
    );
    const [route] = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: events, now: NOW }).routeFriction;
    expect(route).toMatchObject({ frictionScore: 46, status: "unstable", hardRate: 0.67, failureRate: 0 });
    expect(route!.reasons).toEqual(["67% rated Hard or Again"]);
    expect(formatRouteFrictionStatus("cognitively_expensive")).toBe("Cognitively expensive");
  });

  it("puts a never-reviewed stop in view only when nothing has been reviewed, and reports no trend without data", () => {
    const snapshots = [
      snapshot({ id: "p", name: "Palace" }, [{ id: "r", name: "Route" }], [
        { locusId: "l", nodeId: "n", title: "New", routeId: "r", nextReviewAt: "2026-04-25T00:00:00.000Z", lastReviewedAt: null },
      ]),
    ];
    const dashboard = buildMemoryStrengthDashboard({ snapshots, analyticsEvents: [], now: NOW });
    expect(dashboard.actionItems[0]).toMatchObject({ state: "fresh", due: true, strengthScore: 58, urgency: "weak" });
    expect(dashboard.overview).toMatchObject({ totalDue: 1, siegeRatings: 0, trendDirection: "insufficient", trendDelta: null });
    expect(dashboard.routeFriction).toEqual([]);
    expect(formatTrendDirection("insufficient")).toBe("Not enough data");
  });

  it("keeps the urgency bands and trend thresholds", () => {
    expect([34, 35, 59, 60, 84, 85].map(urgencyFromScore)).toEqual(["critical", "weak", "weak", "stable", "stable", "strong"]);
    expect([8, 7, -7, -8, null].map(trendDirectionFromDelta)).toEqual([
      "improving",
      "stagnating",
      "stagnating",
      "decaying",
      "insufficient",
    ]);
  });
});
