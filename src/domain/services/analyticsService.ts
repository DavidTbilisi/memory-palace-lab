import type { AnalyticsEvent, AnalyticsEventGroup, AnalyticsEventType, RecallRating } from "../entities/types";

export type AnalyticsPayload = Record<string, unknown>;

export type AnalyticsSummary = {
  totalEvents: number;
  countsByType: Partial<Record<AnalyticsEventType, number>>;
  countsByGroup: Partial<Record<AnalyticsEventGroup, number>>;
  currentSessionId: string | null;
  currentSessionCounts: Partial<Record<AnalyticsEventType, number>>;
  recallRatings: Record<RecallRating, number>;
  averageRecallLatencyMs: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function serializeAnalyticsPayload(payload?: AnalyticsPayload) {
  return JSON.stringify(payload ?? {});
}

export function parseAnalyticsPayload(eventOrJson: AnalyticsEvent | string | null | undefined): AnalyticsPayload {
  const raw = typeof eventOrJson === "string" ? eventOrJson : eventOrJson?.payloadJson;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function createAnalyticsEvent(input: {
  eventType: AnalyticsEventType;
  eventGroup: AnalyticsEventGroup;
  sessionId?: string | null;
  palaceId?: string | null;
  routeId?: string | null;
  nodeId?: string | null;
  createdAt?: string;
  payload?: AnalyticsPayload;
}): AnalyticsEvent {
  return {
    id: crypto.randomUUID(),
    sessionId: input.sessionId ?? null,
    palaceId: input.palaceId ?? null,
    routeId: input.routeId ?? null,
    nodeId: input.nodeId ?? null,
    eventType: input.eventType,
    eventGroup: input.eventGroup,
    createdAt: input.createdAt ?? new Date().toISOString(),
    payloadJson: serializeAnalyticsPayload(input.payload),
  };
}

function increment<T extends string>(counts: Partial<Record<T, number>>, key: T) {
  counts[key] = (counts[key] ?? 0) + 1;
}

export function humanizeAnalyticsEventType(eventType: AnalyticsEventType) {
  return eventType.replace(/_/g, " ");
}

export function summarizeAnalytics(events: AnalyticsEvent[]): AnalyticsSummary {
  const sorted = events.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const countsByType: Partial<Record<AnalyticsEventType, number>> = {};
  const countsByGroup: Partial<Record<AnalyticsEventGroup, number>> = {};
  const recallRatings: Record<RecallRating, number> = {
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  };
  const currentSessionId = sorted.find((event) => event.sessionId)?.sessionId ?? null;
  const currentSessionCounts: Partial<Record<AnalyticsEventType, number>> = {};

  let recallLatencyTotal = 0;
  let recallLatencyCount = 0;

  for (const event of sorted) {
    increment(countsByType, event.eventType);
    increment(countsByGroup, event.eventGroup);

    if (currentSessionId && event.sessionId === currentSessionId) {
      increment(currentSessionCounts, event.eventType);
    }

    if (event.eventType !== "walk_recall_rated") continue;
    const payload = parseAnalyticsPayload(event);
    const rating = payload.rating;
    if (rating === "again" || rating === "hard" || rating === "good" || rating === "easy") {
      recallRatings[rating] += 1;
    }
    const latencyMs = payload.timeToRevealMs;
    if (typeof latencyMs === "number" && Number.isFinite(latencyMs) && latencyMs >= 0) {
      recallLatencyTotal += latencyMs;
      recallLatencyCount += 1;
    }
  }

  return {
    totalEvents: sorted.length,
    countsByType,
    countsByGroup,
    currentSessionId,
    currentSessionCounts,
    recallRatings,
    averageRecallLatencyMs: recallLatencyCount > 0 ? Math.round(recallLatencyTotal / recallLatencyCount) : null,
  };
}
