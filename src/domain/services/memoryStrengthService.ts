import type { AnalyticsEvent, Locus, NedfSlot, RecallRating } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";
import { buildDueQueue, isRouteInReview, nedfLookup, reviewedLoci, type DueQueueSnapshot } from "./dueQueue";
import { dueStopCards, stopCards, type StopCard } from "./nedf";
import { eventPhase } from "./reviewMetrics";

/**
 * Memory strength (backlog 04): which stops are weak, how healthy each palace
 * is, whether recall is trending up or down, and which routes are expensive to
 * walk. The unit of strength is a stop; due-ness comes from `buildDueQueue`,
 * and only Siege ratings count (a Storm is a burst of encoding, not a measure
 * of what has stuck).
 */

const DAY_MS = 24 * 60 * 60 * 1000;
/** A due card becomes overdue once it has waited this long past its review time. */
const OVERDUE_AFTER_MS = DAY_MS;
/** Score of a card with no rating yet: unknown, so neither strong nor critical. */
const UNRATED_SCORE = 58;

const RATING_SCORES: Record<RecallRating, number> = {
  again: 15,
  hard: 45,
  good: 78,
  easy: 96,
};

export type TrendDirection = "improving" | "stagnating" | "decaying" | "insufficient";
export type DashboardUrgency = "critical" | "weak" | "stable" | "strong";
export type RouteFrictionStatus = "cognitively_expensive" | "unstable" | "steady";
/** Where a card stands against its schedule; `fresh` has never been reviewed. */
export type StrengthState = "overdue" | "due_now" | "fresh" | "scheduled";

export type StopStrengthItem = {
  locusId: string;
  palaceId: string;
  palaceName: string;
  routeId: string;
  routeName: string;
  nodeId: string;
  title: string;
  locusLabel: string;
  /** The weakest card's slot, which a review of this stop should ask; null for a stop without slots. */
  slot: NedfSlot | null;
  /** How many cards the stop reviews (one per filled NEDF slot, or one). */
  cardCount: number;
  /** Whether `buildDueQueue` lists the stop. */
  due: boolean;
  state: StrengthState;
  latestRating: RecallRating | null;
  reviewedAt: string | null;
  dueAt: string;
  strengthScore: number;
  urgency: DashboardUrgency;
};

export type PalaceHealthItem = {
  palaceId: string;
  palaceName: string;
  /** Null when the palace has no stops in review. */
  healthScore: number | null;
  trendDirection: TrendDirection;
  trendDelta: number | null;
  dueCount: number;
  overdueCount: number;
  weakItems: number;
  totalTrackedItems: number;
  reviewCount: number;
  /** The weakest stop that is weak or critical: where this palace fails most. */
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
  palaceId: string;
  palaceName: string;
  attemptCount: number;
  averageRevealLatencyMs: number | null;
  failureRate: number;
  hardRate: number;
  frictionScore: number;
  status: RouteFrictionStatus;
  dueState: StrengthState | null;
  /** Why the route scored as it did, in plain words. */
  reasons: string[];
};

export type MemoryStrengthDashboard = {
  overview: {
    totalDue: number;
    totalOverdue: number;
    averageStrength: number | null;
    activePalaces: number;
    reviewSessions: number;
    siegeRatings: number;
    trendDirection: TrendDirection;
    trendDelta: number | null;
    /** Mean score of the recent and the earlier days the trend compares; null without a verdict. */
    trendRecentScore: number | null;
    trendPreviousScore: number | null;
  };
  actionItems: StopStrengthItem[];
  palaceHealth: PalaceHealthItem[];
  trend: TrendPoint[];
  routeFriction: RouteFrictionItem[];
};

type SiegeRating = {
  event: AnalyticsEvent;
  rating: RecallRating;
  locusId: string | null;
  slot: NedfSlot | null;
  timeToRevealMs: number | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function statePenalty(state: StrengthState) {
  switch (state) {
    case "overdue":
      return 25;
    case "due_now":
      return 15;
    case "fresh":
      return 0;
    case "scheduled":
      return -4;
  }
}

function statePriority(state: StrengthState) {
  switch (state) {
    case "overdue":
      return 0;
    case "due_now":
      return 1;
    case "fresh":
      return 2;
    case "scheduled":
      return 3;
  }
}

export function scoreFromRating(rating: RecallRating | null) {
  return rating ? RATING_SCORES[rating] : UNRATED_SCORE;
}

export function urgencyFromScore(score: number): DashboardUrgency {
  if (score < 35) return "critical";
  if (score < 60) return "weak";
  if (score < 85) return "stable";
  return "strong";
}

export function trendDirectionFromDelta(delta: number | null): TrendDirection {
  if (delta === null) return "insufficient";
  if (delta >= 8) return "improving";
  if (delta <= -8) return "decaying";
  return "stagnating";
}

function coerceRecallRating(value: unknown): RecallRating | null {
  return value === "again" || value === "hard" || value === "good" || value === "easy" ? value : null;
}

function coerceSlot(value: unknown): NedfSlot | null {
  return value === "nameHook" || value === "essence" || value === "distinguisher" || value === "failure" ? value : null;
}

/** Walk ratings made in Siege (the daily drip); Storm ratings are left out. */
function siegeRatings(events: readonly AnalyticsEvent[]): SiegeRating[] {
  const ratings: SiegeRating[] = [];
  for (const event of events) {
    if (event.eventType !== "walk_recall_rated" || eventPhase(event) === "storm") continue;
    const payload = parseAnalyticsPayload(event);
    const rating = coerceRecallRating(payload.rating);
    if (!rating) continue;
    const reveal = payload.timeToRevealMs;
    ratings.push({
      event,
      rating,
      locusId: typeof payload.locusId === "string" ? payload.locusId : null,
      slot: coerceSlot(payload.slot),
      timeToRevealMs: typeof reveal === "number" && Number.isFinite(reveal) && reveal >= 0 ? reveal : null,
    });
  }
  return ratings;
}

function startOfUtcDayMs(iso: string) {
  const date = new Date(iso);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function makeTrendLabel(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map((part) => Number(part));
  const date = new Date(Date.UTC(year!, (month || 1) - 1, day || 1));
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function buildTrendSeries(ratings: readonly SiegeRating[], now: string, days: number): TrendPoint[] {
  const buckets = new Map<string, RecallRating[]>();
  for (const { event, rating } of ratings) {
    const dayKey = new Date(event.createdAt).toISOString().slice(0, 10);
    const values = buckets.get(dayKey) ?? [];
    values.push(rating);
    buckets.set(dayKey, values);
  }

  const endDayMs = startOfUtcDayMs(now);
  const points: TrendPoint[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const dayKey = new Date(endDayMs - offset * DAY_MS).toISOString().slice(0, 10);
    const day = buckets.get(dayKey) ?? [];
    const scores = day.map(scoreFromRating);
    points.push({
      dayKey,
      label: makeTrendLabel(dayKey),
      reviewCount: day.length,
      averageScore: scores.length ? Math.round(average(scores) ?? 0) : null,
      againCount: day.filter((rating) => rating === "again").length,
      hardCount: day.filter((rating) => rating === "hard").length,
      goodCount: day.filter((rating) => rating === "good").length,
      easyCount: day.filter((rating) => rating === "easy").length,
    });
  }
  return points;
}

/** The last three days with reviews against the up-to-three before them; needs four such days. */
function trendSummaryFromPoints(points: TrendPoint[]) {
  const scored = points.filter((point) => point.averageScore !== null);
  const recent = average(scored.slice(-3).map((point) => point.averageScore ?? 0));
  const previous = average(scored.slice(Math.max(0, scored.length - 6), -3).map((point) => point.averageScore ?? 0));
  if (recent === null || previous === null) {
    return { direction: "insufficient" as TrendDirection, delta: null, recent: null, previous: null };
  }
  const delta = Math.round(recent - previous);
  return { direction: trendDirectionFromDelta(delta), delta, recent: Math.round(recent), previous: Math.round(previous) };
}

/** The newest Siege rating for each stop card, keyed by locus and slot. */
function latestRatingsIndex(ratings: readonly SiegeRating[]) {
  const byLocus = new Map<string, SiegeRating>();
  const byRouteNode = new Map<string, SiegeRating>();
  const keep = (map: Map<string, SiegeRating>, key: string, entry: SiegeRating) => {
    const current = map.get(key);
    if (!current || Date.parse(entry.event.createdAt) >= Date.parse(current.event.createdAt)) map.set(key, entry);
  };
  for (const entry of ratings) {
    const slotKey = entry.slot ?? "";
    if (entry.locusId) keep(byLocus, `${entry.locusId}|${slotKey}`, entry);
    else if (entry.event.routeId && entry.event.nodeId) {
      keep(byRouteNode, `${entry.event.routeId}|${entry.event.nodeId}|${slotKey}`, entry);
    }
  }
  /**
   * A slot card never rated on its own carries its stop's history, as its schedule does
   * (`stopCards`), so it falls back to the stop's slot-less rating.
   */
  return (locus: Locus, slot: NedfSlot | null): SiegeRating | null => {
    const find = (slotKey: string) =>
      byLocus.get(`${locus.id}|${slotKey}`) ?? byRouteNode.get(`${locus.routeId}|${locus.nodeId}|${slotKey}`) ?? null;
    return (slot ? find(slot) : null) ?? find("");
  };
}

type CardStrength = {
  card: StopCard;
  state: StrengthState;
  rating: SiegeRating | null;
  score: number;
};

function cardState(card: StopCard, isDue: boolean, rated: boolean, nowMs: number): StrengthState {
  if (!rated && card.schedule.lastReviewedAt === null) return "fresh";
  if (!isDue) return "scheduled";
  return nowMs - Date.parse(card.schedule.nextReviewAt) >= OVERDUE_AFTER_MS ? "overdue" : "due_now";
}

function scoreCard(rating: SiegeRating | null, state: StrengthState) {
  if (!rating && state === "fresh") return UNRATED_SCORE;
  return clamp(Math.round(scoreFromRating(rating?.rating ?? null) - statePenalty(state)), 0, 100);
}

function compareStops(a: StopStrengthItem, b: StopStrengthItem) {
  return (
    a.strengthScore - b.strengthScore ||
    statePriority(a.state) - statePriority(b.state) ||
    Date.parse(a.dueAt) - Date.parse(b.dueAt) ||
    a.title.localeCompare(b.title)
  );
}

function buildStopItems(
  snapshots: readonly DueQueueSnapshot[],
  dueLocusIds: ReadonlySet<string>,
  latestRating: ReturnType<typeof latestRatingsIndex>,
  now: string,
): StopStrengthItem[] {
  const nowMs = Date.parse(now);
  const items: StopStrengthItem[] = [];
  for (const snapshot of snapshots) {
    const routeById = new Map(snapshot.routes.map((route) => [route.id, route]));
    const nodeById = new Map(snapshot.nodes.map((node) => [node.id, node]));
    const nedfOf = nedfLookup(snapshot.nodes);
    for (const locus of reviewedLoci(snapshot.loci, snapshot.routes)) {
      const route = routeById.get(locus.routeId);
      if (!route) continue;
      const nedf = nedfOf(locus.nodeId);
      const isDue = dueLocusIds.has(locus.id);
      const dueSlots = new Set(isDue ? dueStopCards(locus, nedf, now).map((card) => card.slot) : []);
      const cards: CardStrength[] = stopCards(locus, nedf, now).map((card) => {
        const rating = latestRating(locus, card.slot);
        const state = cardState(card, dueSlots.has(card.slot), rating !== null, nowMs);
        return { card, state, rating, score: scoreCard(rating, state) };
      });
      // A stop is as strong as its weakest card.
      const weakest = cards.reduce((worst, card) =>
        card.score < worst.score ||
        (card.score === worst.score &&
          Date.parse(card.card.schedule.nextReviewAt) < Date.parse(worst.card.schedule.nextReviewAt))
          ? card
          : worst,
      );
      items.push({
        locusId: locus.id,
        palaceId: snapshot.palace.id,
        palaceName: snapshot.palace.name,
        routeId: route.id,
        routeName: route.name,
        nodeId: locus.nodeId,
        title: nodeById.get(locus.nodeId)?.title?.trim() || "Untitled node",
        locusLabel: locus.label,
        slot: weakest.card.slot,
        cardCount: cards.length,
        due: isDue,
        state: weakest.state,
        latestRating: weakest.rating?.rating ?? null,
        reviewedAt: weakest.rating?.event.createdAt ?? weakest.card.schedule.lastReviewedAt,
        dueAt: weakest.card.schedule.nextReviewAt,
        strengthScore: weakest.score,
        urgency: urgencyFromScore(weakest.score),
      });
    }
  }
  return items.sort(compareStops);
}

/** Rated or scheduled stops first; never-reviewed stops only when nothing else is tracked. */
function buildActionItems(stops: readonly StopStrengthItem[], limit: number) {
  const known = stops.filter((stop) => stop.latestRating !== null || stop.state !== "fresh");
  return (known.length > 0 ? known : stops).slice(0, limit);
}

function isWeak(stop: StopStrengthItem) {
  return stop.urgency === "critical" || stop.urgency === "weak";
}

function buildPalaceHealthItems(input: {
  snapshots: readonly DueQueueSnapshot[];
  stops: readonly StopStrengthItem[];
  ratings: readonly SiegeRating[];
  dueByPalace: ReadonlyMap<string, number>;
  now: string;
  trendDays: number;
}): PalaceHealthItem[] {
  const items = input.snapshots.map(({ palace }): PalaceHealthItem => {
    const stops = input.stops.filter((stop) => stop.palaceId === palace.id);
    const ratings = input.ratings.filter((entry) => entry.event.palaceId === palace.id);
    const dueCount = input.dueByPalace.get(palace.id) ?? 0;
    const overdueCount = stops.filter((stop) => stop.state === "overdue").length;
    const weakItems = stops.filter(isWeak).length;
    const averageStrength = average(stops.map((stop) => stop.strengthScore));
    const penalty = stops.length > 0 ? Math.round((overdueCount * 18 + dueCount * 8 + weakItems * 5) / stops.length) : 0;
    const trend = trendSummaryFromPoints(buildTrendSeries(ratings, input.now, input.trendDays));
    // Stops are sorted weakest first.
    const hotspot = stops.find(isWeak) ?? null;
    return {
      palaceId: palace.id,
      palaceName: palace.name,
      healthScore: averageStrength === null ? null : clamp(Math.round(averageStrength - penalty), 0, 100),
      trendDirection: trend.direction,
      trendDelta: trend.delta,
      dueCount,
      overdueCount,
      weakItems,
      totalTrackedItems: stops.length,
      reviewCount: ratings.length,
      hotspotTitle: hotspot?.title ?? null,
    };
  });
  return items.sort(
    (a, b) =>
      (a.healthScore ?? Number.POSITIVE_INFINITY) - (b.healthScore ?? Number.POSITIVE_INFINITY) ||
      b.overdueCount - a.overdueCount ||
      a.palaceName.localeCompare(b.palaceName),
  );
}

function routeDueState(stops: readonly StopStrengthItem[]): StrengthState | null {
  if (stops.some((stop) => stop.due && stop.state === "overdue")) return "overdue";
  if (stops.some((stop) => stop.due)) return "due_now";
  return null;
}

function percent(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

function frictionReasons(input: {
  failureRate: number;
  lowConfidenceRate: number;
  averageRevealLatencyMs: number | null;
  dueState: StrengthState | null;
  dueStops: number;
}): string[] {
  const reasons: string[] = [];
  if (input.failureRate >= 0.3) reasons.push(`${percent(input.failureRate)} of recalls failed`);
  else if (input.lowConfidenceRate >= 0.5) reasons.push(`${percent(input.lowConfidenceRate)} rated Hard or Again`);
  if (input.averageRevealLatencyMs !== null && input.averageRevealLatencyMs >= 8_000) {
    reasons.push(`slow to recall: ${(input.averageRevealLatencyMs / 1_000).toFixed(1)} s before reveal`);
  }
  if (input.dueState === "overdue") reasons.push(`${input.dueStops} ${input.dueStops === 1 ? "stop" : "stops"} overdue or due`);
  else if (input.dueState === "due_now") reasons.push(`${input.dueStops} ${input.dueStops === 1 ? "stop" : "stops"} due`);
  return reasons;
}

function buildRouteFrictionItems(input: {
  snapshots: readonly DueQueueSnapshot[];
  stops: readonly StopStrengthItem[];
  ratings: readonly SiegeRating[];
  dueByRoute: ReadonlyMap<string, number>;
}): RouteFrictionItem[] {
  const byRoute = new Map<string, SiegeRating[]>();
  for (const entry of input.ratings) {
    if (!entry.event.routeId) continue;
    const list = byRoute.get(entry.event.routeId) ?? [];
    list.push(entry);
    byRoute.set(entry.event.routeId, list);
  }

  const items: RouteFrictionItem[] = [];
  for (const { palace, routes } of input.snapshots) {
    for (const route of routes) {
      const ratings = byRoute.get(route.id);
      if (!ratings || ratings.length === 0 || !isRouteInReview(route)) continue;
      const attempts = ratings.length;
      const count = (rating: RecallRating) => ratings.filter((entry) => entry.rating === rating).length;
      const averageScore = average(ratings.map((entry) => scoreFromRating(entry.rating))) ?? 0;
      const averageRevealLatencyMs = average(
        ratings.map((entry) => entry.timeToRevealMs).filter((ms): ms is number => ms !== null),
      );
      const failureRate = count("again") / attempts;
      const hardRate = count("hard") / attempts;
      const lowConfidenceRate = failureRate + hardRate;
      const latencyPenalty =
        averageRevealLatencyMs === null ? 0 : clamp(((averageRevealLatencyMs - 4_000) / 12_000) * 18, 0, 18);
      const dueState = routeDueState(input.stops.filter((stop) => stop.routeId === route.id));
      const duePenalty = dueState === "overdue" ? 15 : dueState === "due_now" ? 8 : 0;
      const frictionScore = clamp(
        Math.round((100 - averageScore) * 0.72 + lowConfidenceRate * 22 + latencyPenalty + duePenalty),
        0,
        100,
      );
      const status: RouteFrictionStatus =
        frictionScore >= 70 ? "cognitively_expensive" : frictionScore >= 45 ? "unstable" : "steady";
      items.push({
        routeId: route.id,
        routeName: route.name,
        palaceId: palace.id,
        palaceName: palace.name,
        attemptCount: attempts,
        averageRevealLatencyMs: averageRevealLatencyMs === null ? null : Math.round(averageRevealLatencyMs),
        failureRate: Number(failureRate.toFixed(2)),
        hardRate: Number(hardRate.toFixed(2)),
        frictionScore,
        status,
        dueState,
        reasons:
          status === "steady"
            ? []
            : frictionReasons({
                failureRate,
                lowConfidenceRate,
                averageRevealLatencyMs,
                dueState,
                dueStops: input.dueByRoute.get(route.id) ?? 0,
              }),
      });
    }
  }
  return items.sort((a, b) => b.frictionScore - a.frictionScore || a.routeName.localeCompare(b.routeName));
}

export function buildMemoryStrengthDashboard(input: {
  snapshots: readonly DueQueueSnapshot[];
  analyticsEvents: readonly AnalyticsEvent[];
  now?: string;
  trendDays?: number;
  actionItemLimit?: number;
}): MemoryStrengthDashboard {
  const now = input.now ?? new Date().toISOString();
  const trendDays = input.trendDays ?? 7;
  const actionItemLimit = input.actionItemLimit ?? 8;

  const queue = buildDueQueue(input.snapshots, now);
  const dueLocusIds = new Set(queue.items.map((item) => item.locusId));
  const ratings = siegeRatings(input.analyticsEvents);
  const stops = buildStopItems(input.snapshots, dueLocusIds, latestRatingsIndex(ratings), now);

  const palaceHealth = buildPalaceHealthItems({
    snapshots: input.snapshots,
    stops,
    ratings,
    dueByPalace: queue.countByPalace,
    now,
    trendDays,
  });
  const trend = buildTrendSeries(ratings, now, trendDays);
  const trendSummary = trendSummaryFromPoints(trend);
  const averageStrength = average(stops.map((stop) => stop.strengthScore));

  return {
    overview: {
      totalDue: queue.items.length,
      totalOverdue: stops.filter((stop) => stop.due && stop.state === "overdue").length,
      averageStrength: averageStrength === null ? null : Math.round(averageStrength),
      activePalaces: palaceHealth.filter((item) => item.totalTrackedItems > 0 || item.reviewCount > 0).length,
      reviewSessions: new Set(ratings.map((entry) => entry.event.sessionId).filter(Boolean)).size,
      siegeRatings: ratings.length,
      trendDirection: trendSummary.direction,
      trendDelta: trendSummary.delta,
      trendRecentScore: trendSummary.recent,
      trendPreviousScore: trendSummary.previous,
    },
    actionItems: buildActionItems(stops, actionItemLimit),
    palaceHealth,
    trend,
    routeFriction: buildRouteFrictionItems({ snapshots: input.snapshots, stops, ratings, dueByRoute: queue.countByRoute }),
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
  }
}

export function formatStrengthState(state: StrengthState) {
  switch (state) {
    case "overdue":
      return "Overdue";
    case "due_now":
      return "Due now";
    case "fresh":
      return "Not reviewed yet";
    case "scheduled":
      return "Scheduled";
  }
}
