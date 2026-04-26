import type { AnalyticsEvent, MemoryNode, MemoryRoute, Palace, RecallRating } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";
import { buildReviewQueue, type ReviewQueueItem, type ReviewQueueState } from "./reviewQueueService";

const DAY_MS = 24 * 60 * 60 * 1000;
const UNKNOWN_PALACE_ID = "__unknown_palace__";

const RATING_SCORES: Record<RecallRating, number> = {
  again: 15,
  hard: 45,
  good: 78,
  easy: 96,
};

export type TrendDirection = "improving" | "stagnating" | "decaying" | "insufficient";
export type DashboardUrgency = "critical" | "weak" | "stable" | "strong";
export type RouteFrictionStatus = "cognitively_expensive" | "unstable" | "steady";

export type MemoryStrengthActionItem = {
  id: string;
  kind: "node" | "route";
  palaceId: string | null;
  palaceName: string;
  palaceAtlasPath: string | null;
  routeId: string | null;
  nodeId: string | null;
  title: string;
  subtitle: string;
  state: ReviewQueueState;
  latestRating: RecallRating | null;
  reviewedAt: string | null;
  dueAt: string | null;
  strengthScore: number;
  urgency: DashboardUrgency;
};

export type PalaceHealthItem = {
  palaceId: string;
  palaceName: string;
  atlasPath: string | null;
  healthScore: number;
  trendDirection: TrendDirection;
  trendDelta: number | null;
  dueCount: number;
  overdueCount: number;
  weakItems: number;
  totalTrackedItems: number;
  reviewCount: number;
  hotspotTitle: string | null;
};

export type TrendPoint = {
  dayKey: string;
  label: string;
  reviewCount: number;
  averageScore: number | null;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
};

export type RouteFrictionItem = {
  routeId: string;
  routeName: string;
  palaceId: string | null;
  palaceName: string;
  palaceAtlasPath: string | null;
  attemptCount: number;
  averageRevealLatencyMs: number | null;
  failureRate: number;
  hardRate: number;
  frictionScore: number;
  status: RouteFrictionStatus;
  dueState: ReviewQueueState | null;
};

export type MemoryStrengthDashboard = {
  overview: {
    totalDue: number;
    totalOverdue: number;
    averageStrength: number | null;
    activePalaces: number;
    reviewSessions: number;
    trendDirection: TrendDirection;
    trendDelta: number | null;
  };
  actionItems: MemoryStrengthActionItem[];
  palaceHealth: PalaceHealthItem[];
  trend: TrendPoint[];
  routeFriction: RouteFrictionItem[];
};

type PalaceMeta = {
  id: string;
  name: string;
  atlasPath: string | null;
};

type NodeMeta = {
  id: string;
  palaceId: string | null;
  title: string;
};

type RouteMeta = {
  id: string;
  palaceId: string | null;
  name: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function reviewStatePenalty(state: ReviewQueueState) {
  switch (state) {
    case "overdue":
      return 25;
    case "due_now":
      return 15;
    case "fresh":
      return 0;
    case "scheduled":
      return -4;
    default:
      return 0;
  }
}

function scoreFromRating(rating: RecallRating | null) {
  if (!rating) return 58;
  return RATING_SCORES[rating];
}

function scoreFromReviewItem(item: ReviewQueueItem) {
  const base = scoreFromRating(item.latestRating);
  if (item.latestRating === null && item.state === "fresh") {
    return 58;
  }
  return clamp(Math.round(base - reviewStatePenalty(item.state)), 0, 100);
}

function urgencyFromScore(score: number): DashboardUrgency {
  if (score < 35) return "critical";
  if (score < 60) return "weak";
  if (score < 85) return "stable";
  return "strong";
}

function trendDirectionFromDelta(delta: number | null): TrendDirection {
  if (delta === null) return "insufficient";
  if (delta >= 8) return "improving";
  if (delta <= -8) return "decaying";
  return "stagnating";
}

function formatPalaceFallback(palaceId: string | null) {
  if (!palaceId) return "Unknown palace";
  return `Palace ${palaceId.slice(0, 8)}`;
}

function makeTrendLabel(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map((part) => Number(part));
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function startOfUtcDayMs(iso: string) {
  const date = new Date(iso);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function coerceRecallRating(value: unknown): RecallRating | null {
  return value === "again" || value === "hard" || value === "good" || value === "easy" ? value : null;
}

function trendSummaryFromPoints(points: TrendPoint[]) {
  const scored = points.filter((point) => point.averageScore !== null);
  if (scored.length < 2) {
    return { direction: "insufficient" as TrendDirection, delta: null };
  }
  const recent = scored.slice(-3).map((point) => point.averageScore ?? 0);
  const previous = scored.slice(Math.max(0, scored.length - 6), scored.length - 3).map((point) => point.averageScore ?? 0);
  if (previous.length === 0) {
    return { direction: "insufficient" as TrendDirection, delta: null };
  }
  const delta = Math.round((average(recent) ?? 0) - (average(previous) ?? 0));
  return {
    direction: trendDirectionFromDelta(delta),
    delta,
  };
}

function buildTrendSeries(events: AnalyticsEvent[], now: string, days: number) {
  const buckets = new Map<string, Array<{ score: number; rating: RecallRating }>>();
  const endDayMs = startOfUtcDayMs(now);

  for (const event of events) {
    if (event.eventType !== "walk_recall_rated") continue;
    const payload = parseAnalyticsPayload(event);
    const rating = coerceRecallRating(payload.rating);
    if (!rating) continue;
    const dayKey = event.createdAt.slice(0, 10);
    const values = buckets.get(dayKey) ?? [];
    values.push({ score: scoreFromRating(rating), rating });
    buckets.set(dayKey, values);
  }

  const points: TrendPoint[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const dayMs = endDayMs - offset * DAY_MS;
    const dayKey = new Date(dayMs).toISOString().slice(0, 10);
    const ratings = buckets.get(dayKey) ?? [];
    const scores = ratings.map((entry) => entry.score);
    points.push({
      dayKey,
      label: makeTrendLabel(dayKey),
      reviewCount: ratings.length,
      averageScore: scores.length ? Math.round(average(scores) ?? 0) : null,
      againCount: ratings.filter((entry) => entry.rating === "again").length,
      hardCount: ratings.filter((entry) => entry.rating === "hard").length,
      goodCount: ratings.filter((entry) => entry.rating === "good").length,
      easyCount: ratings.filter((entry) => entry.rating === "easy").length,
    });
  }

  return points;
}

function buildEntityMetadata(input: {
  analyticsEvents: AnalyticsEvent[];
  palaces: Palace[];
  nodes: MemoryNode[];
  routes: MemoryRoute[];
}) {
  const palaceById = new Map<string, PalaceMeta>();
  const nodeById = new Map<string, NodeMeta>();
  const routeById = new Map<string, RouteMeta>();

  for (const palace of input.palaces) {
    palaceById.set(palace.id, {
      id: palace.id,
      name: palace.name,
      atlasPath: palace.atlasPath ?? null,
    });
  }

  for (const node of input.nodes) {
    nodeById.set(node.id, {
      id: node.id,
      palaceId: null,
      title: node.title,
    });
  }

  for (const route of input.routes) {
    routeById.set(route.id, {
      id: route.id,
      palaceId: route.palaceId,
      name: route.name,
    });
  }

  for (const event of input.analyticsEvents) {
    const payload = parseAnalyticsPayload(event);

    if (event.eventType === "palace_created" && event.palaceId) {
      const fallback = palaceById.get(event.palaceId);
      const name =
        typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : fallback?.name ?? formatPalaceFallback(event.palaceId);
      const atlasPath =
        typeof payload.atlasPath === "string" && payload.atlasPath.trim()
          ? payload.atlasPath.trim()
          : fallback?.atlasPath ?? null;
      palaceById.set(event.palaceId, {
        id: event.palaceId,
        name,
        atlasPath,
      });
    }

    if (event.nodeId) {
      const fallback = nodeById.get(event.nodeId);
      const titleFromPayload =
        typeof payload.nodeTitle === "string" && payload.nodeTitle.trim()
          ? payload.nodeTitle.trim()
          : typeof payload.title === "string" && payload.title.trim()
            ? payload.title.trim()
            : fallback?.title ?? event.nodeId.slice(0, 8);
      nodeById.set(event.nodeId, {
        id: event.nodeId,
        palaceId: fallback?.palaceId ?? event.palaceId ?? null,
        title: titleFromPayload,
      });
    }

    if (event.routeId) {
      const fallback = routeById.get(event.routeId);
      const nameFromPayload =
        typeof payload.routeName === "string" && payload.routeName.trim()
          ? payload.routeName.trim()
          : typeof payload.name === "string" && payload.name.trim()
            ? payload.name.trim()
            : fallback?.name ?? event.routeId.slice(0, 8);
      routeById.set(event.routeId, {
        id: event.routeId,
        palaceId: fallback?.palaceId ?? event.palaceId ?? null,
        name: nameFromPayload,
      });
    }
  }

  return { palaceById, nodeById, routeById };
}

function synthesizeNodes(nodeById: Map<string, NodeMeta>): MemoryNode[] {
  return [...nodeById.values()].map((node) => ({
    id: node.id,
    objectId: `analytics:${node.id}`,
    title: node.title,
    content: "",
    kind: "memory",
    portal: null,
  }));
}

function synthesizeRoutes(routeById: Map<string, RouteMeta>): MemoryRoute[] {
  return [...routeById.values()].map((route) => ({
    id: route.id,
    palaceId: route.palaceId ?? UNKNOWN_PALACE_ID,
    name: route.name,
  }));
}

function buildActionItems(
  queue: ReviewQueueItem[],
  palaceById: Map<string, PalaceMeta>,
  limit: number,
): MemoryStrengthActionItem[] {
  const prioritized = queue.filter((item) => item.latestRating !== null || item.state !== "fresh");
  const source = prioritized.length > 0 ? prioritized : queue;
  return source.slice(0, limit).map((item) => {
    const palace = item.palaceId ? palaceById.get(item.palaceId) : null;
    const strengthScore = scoreFromReviewItem(item);
    return {
      id: item.id,
      kind: item.kind,
      palaceId: item.palaceId && item.palaceId !== UNKNOWN_PALACE_ID ? item.palaceId : null,
      palaceName: palace?.name ?? formatPalaceFallback(item.palaceId ?? null),
      palaceAtlasPath: palace?.atlasPath ?? null,
      routeId: item.routeId,
      nodeId: item.nodeId,
      title: item.title,
      subtitle: item.subtitle ?? (item.kind === "route" ? "Route review" : "Node review"),
      state: item.state,
      latestRating: item.latestRating,
      reviewedAt: item.reviewedAt,
      dueAt: item.dueAt,
      strengthScore,
      urgency: urgencyFromScore(strengthScore),
    };
  });
}

function buildPalaceHealthItems(input: {
  queue: ReviewQueueItem[];
  analyticsEvents: AnalyticsEvent[];
  palaces: Map<string, PalaceMeta>;
  actionItems: MemoryStrengthActionItem[];
  now: string;
  trendDays: number;
}) {
  const palaceIds = new Set<string>();
  for (const item of input.queue) {
    if (item.palaceId && item.palaceId !== UNKNOWN_PALACE_ID) {
      palaceIds.add(item.palaceId);
    }
  }
  for (const palaceId of input.palaces.keys()) {
    palaceIds.add(palaceId);
  }

  const items: PalaceHealthItem[] = [];
  for (const palaceId of palaceIds) {
    const palace = input.palaces.get(palaceId);
    const queueItems = input.queue.filter((item) => item.palaceId === palaceId);
    const reviewEvents = input.analyticsEvents.filter(
      (event) => event.palaceId === palaceId && event.eventType === "walk_recall_rated",
    );
    const strengths = queueItems.map((item) => scoreFromReviewItem(item));
    const dueCount = queueItems.filter((item) => item.state === "due_now" || item.state === "overdue").length;
    const overdueCount = queueItems.filter((item) => item.state === "overdue").length;
    const weakItems = queueItems.filter((item) => urgencyFromScore(scoreFromReviewItem(item)) === "critical" || urgencyFromScore(scoreFromReviewItem(item)) === "weak").length;
    const averageStrength = average(strengths);
    const penalty =
      queueItems.length > 0 ? Math.round((overdueCount * 18 + dueCount * 8 + weakItems * 5) / queueItems.length) : 0;
    const trendPoints = buildTrendSeries(
      input.analyticsEvents.filter((event) => event.palaceId === palaceId),
      input.now,
      input.trendDays,
    );
    const trendSummary = trendSummaryFromPoints(trendPoints);
    const hotspot = input.actionItems.find((item) => item.palaceId === palaceId)?.title ?? null;
    items.push({
      palaceId,
      palaceName: palace?.name ?? formatPalaceFallback(palaceId),
      atlasPath: palace?.atlasPath ?? null,
      healthScore: clamp(Math.round((averageStrength ?? 58) - penalty), 0, 100),
      trendDirection: trendSummary.direction,
      trendDelta: trendSummary.delta,
      dueCount,
      overdueCount,
      weakItems,
      totalTrackedItems: queueItems.length,
      reviewCount: reviewEvents.length,
      hotspotTitle: hotspot,
    });
  }

  return items.sort((a, b) => a.healthScore - b.healthScore || b.overdueCount - a.overdueCount || a.palaceName.localeCompare(b.palaceName));
}

function buildRouteFrictionItems(input: {
  analyticsEvents: AnalyticsEvent[];
  routeById: Map<string, RouteMeta>;
  palaceById: Map<string, PalaceMeta>;
  routeDueStateById: Map<string, ReviewQueueState>;
}) {
  const ratingsByRoute = new Map<
    string,
    {
      palaceId: string | null;
      scoreTotal: number;
      attempts: number;
      againCount: number;
      hardCount: number;
      revealLatencies: number[];
    }
  >();

  for (const event of input.analyticsEvents) {
    if (event.eventType !== "walk_recall_rated" || !event.routeId) continue;
    const payload = parseAnalyticsPayload(event);
    const rating = coerceRecallRating(payload.rating);
    if (!rating) continue;
    const entry = ratingsByRoute.get(event.routeId) ?? {
      palaceId: event.palaceId ?? null,
      scoreTotal: 0,
      attempts: 0,
      againCount: 0,
      hardCount: 0,
      revealLatencies: [],
    };
    entry.scoreTotal += scoreFromRating(rating);
    entry.attempts += 1;
    if (rating === "again") entry.againCount += 1;
    if (rating === "hard") entry.hardCount += 1;
    if (typeof payload.timeToRevealMs === "number" && Number.isFinite(payload.timeToRevealMs) && payload.timeToRevealMs >= 0) {
      entry.revealLatencies.push(payload.timeToRevealMs);
    }
    ratingsByRoute.set(event.routeId, entry);
  }

  const items: RouteFrictionItem[] = [];
  for (const [routeId, entry] of ratingsByRoute.entries()) {
    if (entry.attempts === 0) continue;
    const averageScore = entry.scoreTotal / entry.attempts;
    const averageRevealLatencyMs = average(entry.revealLatencies);
    const lowConfidenceRate = (entry.againCount + entry.hardCount) / entry.attempts;
    const failureRate = entry.againCount / entry.attempts;
    const hardRate = entry.hardCount / entry.attempts;
    const latencyPenalty =
      averageRevealLatencyMs === null ? 0 : clamp(((averageRevealLatencyMs - 4_000) / 12_000) * 18, 0, 18);
    const dueState = input.routeDueStateById.get(routeId) ?? null;
    const duePenalty = dueState === "overdue" ? 15 : dueState === "due_now" ? 8 : 0;
    const frictionScore = clamp(Math.round((100 - averageScore) * 0.72 + lowConfidenceRate * 22 + latencyPenalty + duePenalty), 0, 100);
    const status: RouteFrictionStatus =
      frictionScore >= 70 ? "cognitively_expensive" : frictionScore >= 45 ? "unstable" : "steady";
    const route = input.routeById.get(routeId);
    const palace = route?.palaceId ? input.palaceById.get(route.palaceId) : null;
    items.push({
      routeId,
      routeName: route?.name ?? routeId.slice(0, 8),
      palaceId: route?.palaceId ?? entry.palaceId ?? null,
      palaceName: palace?.name ?? formatPalaceFallback(route?.palaceId ?? entry.palaceId ?? null),
      palaceAtlasPath: palace?.atlasPath ?? null,
      attemptCount: entry.attempts,
      averageRevealLatencyMs: averageRevealLatencyMs === null ? null : Math.round(averageRevealLatencyMs),
      failureRate: Number(failureRate.toFixed(2)),
      hardRate: Number(hardRate.toFixed(2)),
      frictionScore,
      status,
      dueState,
    });
  }

  return items.sort((a, b) => b.frictionScore - a.frictionScore || a.routeName.localeCompare(b.routeName));
}

export function buildMemoryStrengthDashboard(input: {
  analyticsEvents: AnalyticsEvent[];
  palaces: Palace[];
  nodes?: MemoryNode[];
  routes?: MemoryRoute[];
  now?: string;
  trendDays?: number;
  actionItemLimit?: number;
}): MemoryStrengthDashboard {
  const now = input.now ?? new Date().toISOString();
  const trendDays = input.trendDays ?? 7;
  const actionItemLimit = input.actionItemLimit ?? 8;
  const nodes = input.nodes ?? [];
  const routes = input.routes ?? [];
  const metadata = buildEntityMetadata({
    analyticsEvents: input.analyticsEvents,
    palaces: input.palaces,
    nodes,
    routes,
  });
  const queue = buildReviewQueue({
    analyticsEvents: input.analyticsEvents,
    nodes: synthesizeNodes(metadata.nodeById),
    routes: synthesizeRoutes(metadata.routeById),
    now,
  }).map((item) => {
    const routePalaceId = item.routeId ? metadata.routeById.get(item.routeId)?.palaceId ?? null : null;
    const nodePalaceId = item.nodeId ? metadata.nodeById.get(item.nodeId)?.palaceId ?? null : null;
    const palaceId = item.palaceId && item.palaceId !== UNKNOWN_PALACE_ID ? item.palaceId : routePalaceId ?? nodePalaceId ?? null;
    return {
      ...item,
      palaceId,
    };
  });

  const actionItems = buildActionItems(queue, metadata.palaceById, actionItemLimit);
  const routeDueStateById = new Map<string, ReviewQueueState>(
    queue.filter((item) => item.kind === "route" && item.routeId).map((item) => [item.routeId!, item.state]),
  );
  const palaceHealth = buildPalaceHealthItems({
    queue,
    analyticsEvents: input.analyticsEvents,
    palaces: metadata.palaceById,
    actionItems,
    now,
    trendDays,
  });
  const trend = buildTrendSeries(input.analyticsEvents, now, trendDays);
  const trendSummary = trendSummaryFromPoints(trend);
  const routeFriction = buildRouteFrictionItems({
    analyticsEvents: input.analyticsEvents,
    routeById: metadata.routeById,
    palaceById: metadata.palaceById,
    routeDueStateById,
  });
  const averageStrength = average(actionItems.map((item) => item.strengthScore));
  const reviewSessions = new Set(
    input.analyticsEvents
      .filter((event) => (event.eventType === "walk_closed" || event.eventType === "walk_started") && event.sessionId)
      .map((event) => event.sessionId as string),
  ).size;

  return {
    overview: {
      totalDue: queue.filter((item) => item.state === "due_now" || item.state === "overdue").length,
      totalOverdue: queue.filter((item) => item.state === "overdue").length,
      averageStrength: averageStrength === null ? null : Math.round(averageStrength),
      activePalaces: palaceHealth.filter((item) => item.totalTrackedItems > 0 || item.reviewCount > 0).length,
      reviewSessions,
      trendDirection: trendSummary.direction,
      trendDelta: trendSummary.delta,
    },
    actionItems,
    palaceHealth,
    trend,
    routeFriction,
  };
}

export function formatTrendDirection(direction: TrendDirection) {
  switch (direction) {
    case "improving":
      return "Improving";
    case "decaying":
      return "Decaying";
    case "stagnating":
      return "Stagnating";
    case "insufficient":
      return "Not enough data";
    default:
      return "Not enough data";
  }
}

export function formatDashboardUrgency(urgency: DashboardUrgency) {
  switch (urgency) {
    case "critical":
      return "Critical";
    case "weak":
      return "Weak";
    case "stable":
      return "Stable";
    case "strong":
      return "Strong";
    default:
      return "Stable";
  }
}

export function formatRouteFrictionStatus(status: RouteFrictionStatus) {
  switch (status) {
    case "cognitively_expensive":
      return "Cognitively expensive";
    case "unstable":
      return "Unstable";
    case "steady":
      return "Steady";
    default:
      return "Steady";
  }
}
