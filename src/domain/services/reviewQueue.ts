import type { AnalyticsEvent, Locus, MemoryNode, MemoryRoute, RecallRating } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";
import { normalizeLocusSchedule } from "./spacedRepetition";

export type ReviewQueueItem = {
  routeId: string;
  routeName: string;
  locusCount: number;
  unseenCount: number;
  weakCount: number;
  stableCount: number;
  dueCount: number;
  overdueCount: number;
  dueScore: number;
  primaryReason: string;
  lastActivityAt: string | null;
};

export type ReviewSession = {
  routeId: string | null;
  routeName: string;
  createdAt: string;
  source: string;
};

export type ReviewQueueSummary = {
  reviewableRoutes: number;
  routesWithoutLoci: number;
  totalLoci: number;
  unseenNodes: number;
  weakNodes: number;
  stableNodes: number;
  dueNodes: number;
};

export type ReviewQueueResult = {
  summary: ReviewQueueSummary;
  queue: ReviewQueueItem[];
  recentSessions: ReviewSession[];
  weakestNodes: Array<{ nodeId: string; title: string; rating: RecallRating | "unseen" }>;
};

const DAY_MS = 24 * 60 * 60 * 1000;

type NodeReviewState = {
  rating: RecallRating | "unseen";
  createdAt: string | null;
};

function nodeTitleMap(nodes: MemoryNode[]) {
  return new Map(nodes.map((node) => [node.id, node.title.trim() || "Untitled node"]));
}

function latestRecallByNode(events: AnalyticsEvent[]) {
  const sorted = events
    .filter((event) => event.eventType === "walk_recall_rated" && event.nodeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const latest = new Map<string, NodeReviewState>();
  for (const event of sorted) {
    const nodeId = event.nodeId;
    if (!nodeId || latest.has(nodeId)) continue;
    const payload = parseAnalyticsPayload(event);
    const rating = payload.rating;
    if (rating === "again" || rating === "hard" || rating === "good" || rating === "easy") {
      latest.set(nodeId, { rating, createdAt: event.createdAt });
    }
  }
  return latest;
}

function lastRouteActivity(events: AnalyticsEvent[]) {
  const latest = new Map<string, string>();
  const sorted = events
    .filter((event) => !!event.routeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  for (const event of sorted) {
    if (!event.routeId || latest.has(event.routeId)) continue;
    latest.set(event.routeId, event.createdAt);
  }
  return latest;
}

function reasonForRoute(item: Omit<ReviewQueueItem, "primaryReason">) {
  if (item.overdueCount > 0) {
    return `${item.overdueCount} overdue ${item.overdueCount === 1 ? "locus is" : "loci are"} waiting`;
  }
  if (item.dueCount > 0) {
    return `${item.dueCount} due ${item.dueCount === 1 ? "locus needs" : "loci need"} review today`;
  }
  if (item.unseenCount > 0) {
    return `${item.unseenCount} unwalked ${item.unseenCount === 1 ? "locus needs" : "loci need"} first retrieval`;
  }
  if (item.locusCount === 0) {
    return "Add loci before this route can be rehearsed";
  }
  return "No due loci for today";
}

export function buildReviewQueue(input: {
  currentPalaceId?: string | null;
  routes: MemoryRoute[];
  loci: Locus[];
  nodes: MemoryNode[];
  analyticsEvents: AnalyticsEvent[];
  now?: string;
}) {
  const nowIso = input.now ?? new Date().toISOString();
  const nowMs = Date.parse(nowIso);
  const { currentPalaceId, routes, loci, nodes, analyticsEvents } = input;
  const palaceRoutes = currentPalaceId ? routes.filter((route) => route.palaceId === currentPalaceId) : [];
  const routeLoci = new Map<string, Locus[]>();

  for (const route of palaceRoutes) {
    routeLoci.set(
      route.id,
      loci
        .filter((locus) => locus.routeId === route.id)
        .map((locus) => normalizeLocusSchedule(locus, nowIso))
        .sort((a, b) => a.orderIndex - b.orderIndex),
    );
  }

  const latestRecall = latestRecallByNode(analyticsEvents);
  const lastActivity = lastRouteActivity(analyticsEvents);
  const titles = nodeTitleMap(nodes);

  let unseenNodes = 0;
  let weakNodes = 0;
  let stableNodes = 0;
  let dueNodes = 0;

  const weakestNodes: Array<{ nodeId: string; title: string; rating: RecallRating | "unseen"; score: number }> = [];
  const queue: ReviewQueueItem[] = palaceRoutes.map((route) => {
    const list = routeLoci.get(route.id) ?? [];
    let unseenCount = 0;
    let weakCount = 0;
    let stableCount = 0;
    let dueCount = 0;
    let overdueCount = 0;
    let dueScore = 0;

    for (const locus of list) {
      const state = latestRecall.get(locus.nodeId) ?? { rating: "unseen" as const, createdAt: null };
      const dueAtMs = Date.parse(locus.nextReviewAt ?? nowIso);
      const isDue = dueAtMs <= nowMs;
      const isOverdue = dueAtMs < nowMs;
      const overdueDays = isOverdue ? Math.max(1, Math.floor((nowMs - dueAtMs) / DAY_MS)) : 0;

      if (state.rating === "unseen") {
        unseenCount += 1;
        unseenNodes += 1;
      }
      if (isDue) {
        dueCount += 1;
        dueNodes += 1;
      }
      if (isOverdue) {
        overdueCount += 1;
      }

      const lowScheduleStrength = (locus.easeFactor ?? 2.5) <= 2.1 || (locus.interval ?? 1) <= 2;
      const weakRecallRating = state.rating === "again" || state.rating === "hard";
      const isWeak = weakRecallRating || (isDue && lowScheduleStrength);
      if (isWeak) {
        weakCount += 1;
        weakNodes += 1;
      } else {
        stableCount += 1;
        stableNodes += 1;
      }

      dueScore += isDue ? 5 : 0;
      dueScore += overdueDays;
      dueScore += isWeak ? 3 : 0;
      dueScore += state.rating === "again" ? 2 : 0;

      weakestNodes.push({
        nodeId: locus.nodeId,
        title: titles.get(locus.nodeId) ?? "Untitled node",
        rating: state.rating,
        score: (isDue ? 10 : 0) + overdueDays + (isWeak ? 10 : 0),
      });
    }

    const base = {
      routeId: route.id,
      routeName: route.name,
      locusCount: list.length,
      unseenCount,
      weakCount,
      stableCount,
      dueCount,
      overdueCount,
      dueScore,
      lastActivityAt: lastActivity.get(route.id) ?? null,
    };

    return {
      ...base,
      primaryReason: reasonForRoute(base),
    };
  });

  queue.sort((a, b) => {
    const aHasDue = a.dueCount > 0 ? 1 : 0;
    const bHasDue = b.dueCount > 0 ? 1 : 0;
    if (aHasDue !== bHasDue) return bHasDue - aHasDue;
    if (b.dueScore !== a.dueScore) return b.dueScore - a.dueScore;
    if ((a.lastActivityAt ?? "") !== (b.lastActivityAt ?? "")) {
      return (a.lastActivityAt ?? "").localeCompare(b.lastActivityAt ?? "");
    }
    return a.routeName.localeCompare(b.routeName);
  });

  const recentSessions = analyticsEvents
    .filter(
      (event) =>
        (event.eventType === "walk_started" || event.eventType === "walk_closed") &&
        (event.routeId ? palaceRoutes.some((route) => route.id === event.routeId) : true),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)
    .map((event) => {
      const payload = parseAnalyticsPayload(event);
      const routeName =
        (typeof payload.routeName === "string" && payload.routeName.trim()) ||
        palaceRoutes.find((route) => route.id === event.routeId)?.name ||
        "Unnamed route";
      return {
        routeId: event.routeId ?? null,
        routeName,
        createdAt: event.createdAt,
        source: event.eventType === "walk_started" ? "Started" : "Closed",
      };
    });

  weakestNodes.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return {
    summary: {
      reviewableRoutes: queue.filter((item) => item.locusCount > 0).length,
      routesWithoutLoci: queue.filter((item) => item.locusCount === 0).length,
      totalLoci: queue.reduce((total, item) => total + item.locusCount, 0),
      unseenNodes,
      weakNodes,
      stableNodes,
      dueNodes,
    },
    queue,
    recentSessions,
    weakestNodes: weakestNodes.slice(0, 6).map((item) => ({
      nodeId: item.nodeId,
      title: item.title,
      rating: item.rating,
    })),
  } satisfies ReviewQueueResult;
}
