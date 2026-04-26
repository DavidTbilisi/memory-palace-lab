import type { AnalyticsEvent, MemoryNode, MemoryRoute, RecallRating } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ReviewQueueItemKind = "node" | "route";
export type ReviewQueueState = "overdue" | "due_now" | "fresh" | "scheduled";

export type ReviewQueueItem = {
  id: string;
  kind: ReviewQueueItemKind;
  palaceId: string | null;
  routeId: string | null;
  nodeId: string | null;
  title: string;
  subtitle: string | null;
  state: ReviewQueueState;
  latestRating: RecallRating | null;
  reviewedAt: string | null;
  dueAt: string | null;
  dueInMs: number | null;
  sessionId: string | null;
};

type WalkRatingEvent = AnalyticsEvent & {
  routeId: string;
  nodeId: string;
};

type RouteSessionReview = {
  sessionId: string;
  routeId: string;
  reviewedAt: string;
  dueAt: string;
  latestRating: RecallRating;
};

function reviewIntervalMsForRating(rating: RecallRating) {
  switch (rating) {
    case "again":
      return 0;
    case "hard":
      return DAY_MS;
    case "good":
      return 3 * DAY_MS;
    case "easy":
      return 7 * DAY_MS;
    default:
      return MINUTE_MS;
  }
}

function ratingRank(rating: RecallRating) {
  switch (rating) {
    case "again":
      return 0;
    case "hard":
      return 1;
    case "good":
      return 2;
    case "easy":
      return 3;
    default:
      return 0;
  }
}

function coerceRecallRating(value: unknown): RecallRating | null {
  return value === "again" || value === "hard" || value === "good" || value === "easy" ? value : null;
}

function dueStateFromTime(dueAt: string | null, nowIso: string): ReviewQueueState {
  if (!dueAt) return "fresh";
  const nowMs = Date.parse(nowIso);
  const dueMs = Date.parse(dueAt);
  if (!Number.isFinite(nowMs) || !Number.isFinite(dueMs)) return "fresh";
  if (dueMs > nowMs) return "scheduled";
  if (nowMs - dueMs < MINUTE_MS) return "due_now";
  return "overdue";
}

function queuePriority(state: ReviewQueueState) {
  switch (state) {
    case "overdue":
      return 0;
    case "due_now":
      return 1;
    case "fresh":
      return 2;
    case "scheduled":
      return 3;
    default:
      return 4;
  }
}

function buildRouteSessionReviews(events: AnalyticsEvent[]) {
  const ratingsBySessionRoute = new Map<string, WalkRatingEvent[]>();
  const closeEvents: Array<AnalyticsEvent & { routeId: string; sessionId: string }> = [];
  const sessions = new Map<string, RouteSessionReview>();

  for (const event of events) {
    if (event.eventType === "walk_recall_rated" && event.routeId && event.nodeId && event.sessionId) {
      const key = `${event.sessionId}:${event.routeId}`;
      const list = ratingsBySessionRoute.get(key) ?? [];
      list.push(event as WalkRatingEvent);
      ratingsBySessionRoute.set(key, list);
      continue;
    }

    if (event.eventType === "walk_closed" && event.routeId && event.sessionId) {
      closeEvents.push(event as AnalyticsEvent & { routeId: string; sessionId: string });
    }
  }

  for (const event of closeEvents) {
    const key = `${event.sessionId}:${event.routeId}`;
    const sessionRatings = ratingsBySessionRoute.get(key) ?? [];
    const ratings = sessionRatings
      .map((ratingEvent) => coerceRecallRating(parseAnalyticsPayload(ratingEvent).rating))
      .filter((rating): rating is RecallRating => !!rating);
    if (ratings.length === 0) continue;
    const weakest = ratings.slice().sort((a, b) => ratingRank(a) - ratingRank(b))[0];
    const dueAt = new Date(Date.parse(event.createdAt) + reviewIntervalMsForRating(weakest)).toISOString();
    const existing = sessions.get(event.routeId);
    if (existing && existing.reviewedAt >= event.createdAt) continue;
    sessions.set(event.routeId, {
      sessionId: event.sessionId,
      routeId: event.routeId,
      reviewedAt: event.createdAt,
      dueAt,
      latestRating: weakest,
    });
  }

  return sessions;
}

export function buildReviewQueue(input: {
  analyticsEvents: AnalyticsEvent[];
  nodes: MemoryNode[];
  routes: MemoryRoute[];
  palaceId?: string | null;
  now?: string;
}) {
  const now = input.now ?? new Date().toISOString();
  const events = input.palaceId
    ? input.analyticsEvents.filter((event) => event.palaceId === input.palaceId)
    : input.analyticsEvents.slice();

  const latestNodeRatingById = new Map<string, WalkRatingEvent>();
  for (const event of events) {
    if (event.eventType !== "walk_recall_rated" || !event.nodeId || !event.routeId) continue;
    const current = latestNodeRatingById.get(event.nodeId);
    if (!current || current.createdAt < event.createdAt) {
      latestNodeRatingById.set(event.nodeId, event as WalkRatingEvent);
    }
  }

  const latestRouteReviewById = buildRouteSessionReviews(events);
  const knownNodes = new Map(input.nodes.map((node) => [node.id, node]));

  for (const [nodeId, latest] of latestNodeRatingById.entries()) {
    if (knownNodes.has(nodeId)) continue;
    const payload = parseAnalyticsPayload(latest);
    const fallbackTitle =
      typeof payload.nodeTitle === "string" && payload.nodeTitle.trim() ? payload.nodeTitle.trim() : nodeId.slice(0, 8);
    knownNodes.set(nodeId, {
      id: nodeId,
      objectId: `analytics:${nodeId}`,
      title: fallbackTitle,
      content: "",
      kind: "memory",
      portal: null,
    });
  }

  const nodeItems: ReviewQueueItem[] = [...knownNodes.values()]
    .filter((node) => node.kind !== "portal")
    .map((node) => {
      const latest = latestNodeRatingById.get(node.id);
      if (!latest) {
        return {
          id: `node:${node.id}`,
          kind: "node",
          palaceId: input.palaceId ?? null,
          routeId: null,
          nodeId: node.id,
          title: node.title || "Untitled node",
          subtitle: "Fresh concept review",
          state: "fresh",
          latestRating: null,
          reviewedAt: null,
          dueAt: null,
          dueInMs: null,
          sessionId: null,
        };
      }

      const payload = parseAnalyticsPayload(latest);
      const latestRating = coerceRecallRating(payload.rating) ?? "again";
      const dueAt = new Date(Date.parse(latest.createdAt) + reviewIntervalMsForRating(latestRating)).toISOString();
      const state = dueStateFromTime(dueAt, now);
      const payloadNodeTitle = typeof payload.nodeTitle === "string" && payload.nodeTitle.trim() ? payload.nodeTitle : null;
      return {
        id: `node:${node.id}`,
        kind: "node",
        palaceId: latest.palaceId ?? input.palaceId ?? null,
        routeId: latest.routeId,
        nodeId: node.id,
        title: payloadNodeTitle ?? node.title ?? "Untitled node",
        subtitle: typeof payload.routeName === "string" ? payload.routeName : "Single concept review",
        state,
        latestRating,
        reviewedAt: latest.createdAt,
        dueAt,
        dueInMs: Date.parse(dueAt) - Date.parse(now),
        sessionId: latest.sessionId ?? null,
      };
    });

  const routeItems: ReviewQueueItem[] = input.routes.map((route) => {
    const latest = latestRouteReviewById.get(route.id);
    if (!latest) {
      return {
        id: `route:${route.id}`,
        kind: "route",
        palaceId: input.palaceId ?? route.palaceId,
        routeId: route.id,
        nodeId: null,
        title: route.name,
        subtitle: "Fresh route review",
        state: "fresh",
        latestRating: null,
        reviewedAt: null,
        dueAt: null,
        dueInMs: null,
        sessionId: null,
      };
    }

    const state = dueStateFromTime(latest.dueAt, now);
    return {
      id: `route:${route.id}`,
      kind: "route",
      palaceId: input.palaceId ?? route.palaceId,
      routeId: route.id,
      nodeId: null,
      title: route.name,
      subtitle: "Whole-route review",
      state,
      latestRating: latest.latestRating,
      reviewedAt: latest.reviewedAt,
      dueAt: latest.dueAt,
      dueInMs: Date.parse(latest.dueAt) - Date.parse(now),
      sessionId: latest.sessionId,
    };
  });

  const items = [...routeItems, ...nodeItems].sort((a, b) => {
    const priorityDelta = queuePriority(a.state) - queuePriority(b.state);
    if (priorityDelta !== 0) return priorityDelta;
    const dueA = a.dueAt ? Date.parse(a.dueAt) : Number.POSITIVE_INFINITY;
    const dueB = b.dueAt ? Date.parse(b.dueAt) : Number.POSITIVE_INFINITY;
    if (dueA !== dueB) return dueA - dueB;
    if (a.kind !== b.kind) return a.kind === "route" ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  return items;
}

export function summarizeReviewQueue(items: ReviewQueueItem[]) {
  return items.reduce(
    (summary, item) => {
      summary.total += 1;
      if (item.kind === "route") summary.routeItems += 1;
      if (item.kind === "node") summary.nodeItems += 1;
      if (item.state === "overdue" || item.state === "due_now") summary.dueCount += 1;
      if (item.state === "overdue") summary.overdueCount += 1;
      if (item.state === "fresh") summary.freshCount += 1;
      if (item.state === "scheduled") summary.scheduledCount += 1;
      return summary;
    },
    {
      total: 0,
      dueCount: 0,
      overdueCount: 0,
      freshCount: 0,
      scheduledCount: 0,
      routeItems: 0,
      nodeItems: 0,
    },
  );
}
