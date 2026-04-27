import type { AnalyticsEvent, RecallRating } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";

const DAY_MS = 24 * 60 * 60 * 1000;

type ReviewFilter = {
  palaceId?: string | null;
  routeId?: string | null;
};

export type DailyReviewPoint = {
  dayKey: string;
  date: string;
  count: number;
  averageScorePct: number;
  routeCount: number;
};

function ratingToValue(rating: RecallRating) {
  switch (rating) {
    case "again":
      return 1;
    case "hard":
      return 2;
    case "good":
      return 3;
    case "easy":
      return 4;
    default:
      return 1;
  }
}

function toDayKey(dateIso: string) {
  const date = new Date(dateIso);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDayKeyLabel(dayKey: string) {
  const parsed = new Date(`${dayKey}T00:00:00`);
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function filteredRatingEvents(events: AnalyticsEvent[], filter?: ReviewFilter) {
  return events.filter((event) => {
    if (event.eventType !== "walk_recall_rated") return false;
    if (filter?.palaceId && event.palaceId !== filter.palaceId) return false;
    if (filter?.routeId && event.routeId !== filter.routeId) return false;
    return true;
  });
}

export function buildDailyReviewPoints(events: AnalyticsEvent[], filter?: ReviewFilter) {
  const points = new Map<
    string,
    {
      totalValue: number;
      count: number;
      routes: Set<string>;
    }
  >();

  for (const event of filteredRatingEvents(events, filter)) {
    const payload = parseAnalyticsPayload(event);
    const rating = payload.rating;
    if (rating !== "again" && rating !== "hard" && rating !== "good" && rating !== "easy") continue;
    const dayKey = toDayKey(event.createdAt);
    const current = points.get(dayKey) ?? { totalValue: 0, count: 0, routes: new Set<string>() };
    current.totalValue += ratingToValue(rating);
    current.count += 1;
    if (event.routeId) current.routes.add(event.routeId);
    points.set(dayKey, current);
  }

  return [...points.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dayKey, value]) => ({
      dayKey,
      date: `${dayKey}T00:00:00`,
      count: value.count,
      averageScorePct: Math.round((value.totalValue / value.count) * 25),
      routeCount: value.routes.size,
    }));
}

export function computeDailyStreak(events: AnalyticsEvent[], todayIso = new Date().toISOString()) {
  const daySet = new Set(buildDailyReviewPoints(events).map((point) => point.dayKey));
  if (daySet.size === 0) return 0;
  const today = new Date(todayIso);
  let streak = 0;
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  for (;;) {
    const key = toDayKey(cursor.toISOString());
    if (!daySet.has(key)) break;
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

export function countReviewedToday(events: AnalyticsEvent[], todayIso = new Date().toISOString(), filter?: ReviewFilter) {
  const todayKey = toDayKey(todayIso);
  return filteredRatingEvents(events, filter).filter((event) => toDayKey(event.createdAt) === todayKey).length;
}

export function buildRetentionSeries(events: AnalyticsEvent[], days = 30, filter?: ReviewFilter, nowIso = new Date().toISOString()) {
  const all = buildDailyReviewPoints(events, filter);
  const nowMs = Date.parse(nowIso);
  const floorMs = nowMs - (days - 1) * DAY_MS;
  return all.filter((point) => {
    const ms = Date.parse(point.date);
    return ms >= floorMs && ms <= nowMs;
  });
}

export type HeatmapCell = {
  dayKey: string;
  date: string;
  count: number;
  routeCount: number;
  isToday: boolean;
};

export function buildReviewHeatmap(events: AnalyticsEvent[], weeks = 52, nowIso = new Date().toISOString(), filter?: ReviewFilter) {
  const byDay = new Map(buildDailyReviewPoints(events, filter).map((point) => [point.dayKey, point]));
  const end = new Date(nowIso);
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const startDate = new Date(endDate.getTime() - (weeks * 7 - 1) * DAY_MS);
  const todayKey = toDayKey(nowIso);
  const cells: HeatmapCell[] = [];

  for (let i = 0; i < weeks * 7; i += 1) {
    const date = new Date(startDate.getTime() + i * DAY_MS);
    const dayKey = toDayKey(date.toISOString());
    const point = byDay.get(dayKey);
    cells.push({
      dayKey,
      date: date.toISOString(),
      count: point?.count ?? 0,
      routeCount: point?.routeCount ?? 0,
      isToday: dayKey === todayKey,
    });
  }

  return cells;
}

export function retentionTrendDown(points: DailyReviewPoint[]) {
  if (points.length < 3) return false;
  const last = points.slice(-3);
  return last[0].averageScorePct > last[1].averageScorePct && last[1].averageScorePct > last[2].averageScorePct;
}
