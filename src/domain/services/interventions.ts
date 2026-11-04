import type { AnalyticsEvent } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";
import { isRouteInReview, type DueQueueSnapshot } from "./dueQueue";
import { siegeRatings, type ConfusionHotspot, type RouteFrictionItem, type SiegeRating } from "./memoryStrengthService";
import { describePlan, planRouteSurgery, type RouteSurgeryPlan, type StopStats } from "./routeSurgery";

/**
 * Adaptive review interventions (backlog 19): what to do about weak material, beyond reviewing it
 * again. Each suggestion comes from a signal the Strength tab already shows and names the one
 * action that addresses it.
 *
 * Pure: no React, no store.
 */

/** A node rated Again or Hard this many times in its last `RECENT_RATINGS` is failing. */
export const FAILING_MISSES = 3;
export const RECENT_RATINGS = 5;

export type InterventionKind = "re-encode" | "link-confusion" | "add-distinguisher" | "route-surgery";

type Base = {
  /** Stable across rebuilds, for keys and for matching an accepted suggestion. */
  id: string;
  kind: InterventionKind;
  palaceId: string;
  palaceName: string;
  /** Higher first. */
  priority: number;
  /** Why the app suggests this, in plain words. */
  reason: string;
};

export type ReEncodeIntervention = Base & {
  kind: "re-encode";
  nodeId: string;
  title: string;
  misses: number;
  recent: number;
};

export type LinkConfusionIntervention = Base & {
  kind: "link-confusion";
  nodes: [{ nodeId: string; title: string }, { nodeId: string; title: string }];
  count: number;
};

export type AddDistinguisherIntervention = Base & {
  kind: "add-distinguisher";
  nodeId: string;
  title: string;
  otherTitle: string;
  count: number;
};

export type RouteSurgeryIntervention = Base & {
  kind: "route-surgery";
  routeId: string;
  routeName: string;
  plan: RouteSurgeryPlan;
  /** What applying the plan will do, in one line. */
  proposal: string;
};

export type Intervention = ReEncodeIntervention | LinkConfusionIntervention | AddDistinguisherIntervention | RouteSurgeryIntervention;

export const INTERVENTION_LABELS: Record<InterventionKind, string> = {
  "re-encode": "Re-encode",
  "link-confusion": "Link as a confusion",
  "add-distinguisher": "Add a Distinguisher",
  "route-surgery": "Fix route",
};

/** A route changed by surgery is left alone until this many ratings have landed on it since. */
export const ROUTE_SETTLE_RATINGS = 5;

/** The analytics event that records an accepted suggestion. */
export const INTERVENTION_ACCEPTED = "intervention_accepted";

/** When each node was last re-encoded through a suggestion: its ratings before that no longer count. */
function lastReEncodedAt(events: readonly AnalyticsEvent[]): Map<string, number> {
  const at = new Map<string, number>();
  for (const event of events) {
    if (event.eventType !== INTERVENTION_ACCEPTED || !event.nodeId) continue;
    if (parseAnalyticsPayload(event).kind !== "re-encode") continue;
    const time = Date.parse(event.createdAt);
    if (time > (at.get(event.nodeId) ?? Number.NEGATIVE_INFINITY)) at.set(event.nodeId, time);
  }
  return at;
}

function reEncodeSuggestions(snapshots: readonly DueQueueSnapshot[], events: readonly AnalyticsEvent[]): ReEncodeIntervention[] {
  // Only nodes still on a route in review: a node no longer reviewed has nothing to fix.
  const reviewed = new Map<string, { palaceId: string; palaceName: string; title: string }>();
  for (const snapshot of snapshots) {
    const inReview = new Set(snapshot.routes.filter(isRouteInReview).map((route) => route.id));
    const titles = new Map(snapshot.nodes.map((node) => [node.id, node.title?.trim() || "Untitled node"]));
    for (const locus of snapshot.loci) {
      if (!inReview.has(locus.routeId) || !titles.has(locus.nodeId)) continue;
      reviewed.set(locus.nodeId, { palaceId: snapshot.palace.id, palaceName: snapshot.palace.name, title: titles.get(locus.nodeId)! });
    }
  }
  const since = lastReEncodedAt(events);
  const byNode = new Map<string, { rating: string; at: number }[]>();
  for (const entry of siegeRatings(events)) {
    const nodeId = entry.event.nodeId;
    if (!nodeId || !reviewed.has(nodeId)) continue;
    const at = Date.parse(entry.event.createdAt);
    if (at <= (since.get(nodeId) ?? Number.NEGATIVE_INFINITY)) continue;
    const list = byNode.get(nodeId) ?? [];
    list.push({ rating: entry.rating, at });
    byNode.set(nodeId, list);
  }
  const suggestions: ReEncodeIntervention[] = [];
  for (const [nodeId, ratings] of byNode) {
    const recent = ratings.sort((a, b) => a.at - b.at).slice(-RECENT_RATINGS);
    const misses = recent.filter((entry) => entry.rating === "again" || entry.rating === "hard").length;
    if (misses < FAILING_MISSES) continue;
    const node = reviewed.get(nodeId)!;
    suggestions.push({
      id: `re-encode:${nodeId}`,
      kind: "re-encode",
      palaceId: node.palaceId,
      palaceName: node.palaceName,
      nodeId,
      title: node.title,
      misses,
      recent: recent.length,
      // Every miss beyond the threshold, and every Again among them, makes it more urgent.
      priority: 60 + 10 * (misses - FAILING_MISSES) + recent.filter((entry) => entry.rating === "again").length,
      reason: `Again or Hard on ${misses} of its last ${recent.length} reviews. Reviewing it again has not made it stick; a new image might.`,
    });
  }
  return suggestions;
}

function contrastSuggestions(hotspots: readonly ConfusionHotspot[]): Intervention[] {
  const suggestions: Intervention[] = [];
  for (const hotspot of hotspots) {
    const [a, b] = hotspot.nodes;
    const times = hotspot.count === 1 ? "once" : `${hotspot.count} times`;
    if (!hotspot.linked) {
      suggestions.push({
        id: `link-confusion:${[a.nodeId, b.nodeId].sort().join("+")}`,
        kind: "link-confusion",
        palaceId: hotspot.palaceId,
        palaceName: hotspot.palaceName,
        nodes: [
          { nodeId: a.nodeId, title: a.title },
          { nodeId: b.nodeId, title: b.title },
        ],
        count: hotspot.count,
        priority: 50 + 10 * hotspot.count,
        reason: `Mixed up ${times}. Linking them as a confusion makes their Distinguisher cards name each other.`,
      });
      continue;
    }
    // Linked, but the node missed most still cannot be told apart from its neighbour.
    const missing = hotspot.nodes.find((node) => !node.hasDistinguisher);
    if (!missing) continue;
    const other = missing === a ? b : a;
    suggestions.push({
      id: `add-distinguisher:${missing.nodeId}`,
      kind: "add-distinguisher",
      palaceId: hotspot.palaceId,
      palaceName: hotspot.palaceName,
      nodeId: missing.nodeId,
      title: missing.title,
      otherTitle: other.title,
      count: hotspot.count,
      priority: 45 + 10 * hotspot.count,
      reason: `Mixed up with ${other.title} ${times}, and has no Distinguisher saying how they differ.`,
    });
  }
  return suggestions;
}

/** What the reviews say about each stop, by locus. */
function stopStats(ratings: readonly SiegeRating[]): Map<string, StopStats> {
  const byLocus = new Map<string, { latest: { rating: string; at: number }; misses: number; reveals: number[] }>();
  for (const entry of ratings) {
    if (!entry.locusId) continue;
    const at = Date.parse(entry.event.createdAt);
    const current = byLocus.get(entry.locusId) ?? { latest: { rating: entry.rating, at }, misses: 0, reveals: [] };
    if (at >= current.latest.at) current.latest = { rating: entry.rating, at };
    if (entry.rating === "again" || entry.rating === "hard") current.misses += 1;
    if (entry.timeToRevealMs !== null) current.reveals.push(entry.timeToRevealMs);
    byLocus.set(entry.locusId, current);
  }
  const stats = new Map<string, StopStats>();
  for (const [locusId, entry] of byLocus) {
    stats.set(locusId, {
      weak: entry.latest.rating === "again" || entry.latest.rating === "hard",
      misses: entry.misses,
      averageRevealMs: entry.reveals.length > 0 ? entry.reveals.reduce((a, b) => a + b, 0) / entry.reveals.length : null,
    });
  }
  return stats;
}

/** Routes changed by surgery that have not had `ROUTE_SETTLE_RATINGS` ratings since. */
function unsettledRoutes(events: readonly AnalyticsEvent[], ratings: readonly SiegeRating[]): Set<string> {
  const unsettled = new Set<string>();
  for (const event of events) {
    if (event.eventType !== INTERVENTION_ACCEPTED) continue;
    const payload = parseAnalyticsPayload(event);
    if (payload.kind !== "route-surgery" || !Array.isArray(payload.routeIds)) continue;
    const at = Date.parse(event.createdAt);
    for (const routeId of payload.routeIds) {
      if (typeof routeId !== "string") continue;
      const since = ratings.filter((entry) => entry.event.routeId === routeId && Date.parse(entry.event.createdAt) > at).length;
      if (since < ROUTE_SETTLE_RATINGS) unsettled.add(routeId);
    }
  }
  return unsettled;
}

function routeSuggestions(
  snapshots: readonly DueQueueSnapshot[],
  events: readonly AnalyticsEvent[],
  friction: readonly RouteFrictionItem[],
): RouteSurgeryIntervention[] {
  const ratings = siegeRatings(events);
  const stats = stopStats(ratings);
  const unsettled = unsettledRoutes(events, ratings);
  const suggestions: RouteSurgeryIntervention[] = [];
  for (const item of friction) {
    if (item.status === "steady" || unsettled.has(item.routeId)) continue;
    const snapshot = snapshots.find((candidate) => candidate.palace.id === item.palaceId);
    const route = snapshot?.routes.find((candidate) => candidate.id === item.routeId);
    if (!snapshot || !route) continue;
    const titles = new Map(snapshot.nodes.map((node) => [node.id, node.title?.trim() || "Untitled node"]));
    const plan = planRouteSurgery({
      route,
      stops: snapshot.loci.filter((locus) => locus.routeId === route.id),
      stats,
      titleOf: (nodeId) => titles.get(nodeId) ?? "Untitled node",
    });
    if (!plan) continue;
    const expensive = item.status === "cognitively_expensive";
    suggestions.push({
      id: `route-surgery:${route.id}`,
      kind: "route-surgery",
      palaceId: item.palaceId,
      palaceName: item.palaceName,
      routeId: route.id,
      routeName: item.routeName,
      plan,
      proposal: describePlan(plan),
      priority: (expensive ? 55 : 40) + Math.round(item.frictionScore / 10),
      reason: `${expensive ? "Costs a lot to walk" : "Unsteady"}: ${item.reasons.join("; ") || "recall on it is weak"}.`,
    });
  }
  return suggestions;
}

/**
 * Every suggestion, most urgent first. A node re-encoded through a suggestion starts afresh: only
 * ratings after that count toward suggesting it again.
 */
export function buildInterventions(input: {
  snapshots: readonly DueQueueSnapshot[];
  analyticsEvents: readonly AnalyticsEvent[];
  hotspots: readonly ConfusionHotspot[];
  /** The Strength tab's route friction; routes off it get no surgery. */
  routeFriction?: readonly RouteFrictionItem[];
}): Intervention[] {
  return [
    ...reEncodeSuggestions(input.snapshots, input.analyticsEvents),
    ...contrastSuggestions(input.hotspots),
    ...routeSuggestions(input.snapshots, input.analyticsEvents, input.routeFriction ?? []),
  ].sort(
    (a, b) => b.priority - a.priority || a.id.localeCompare(b.id),
  );
}

/** The nodes an intervention is about, for the analytics event that records it. */
export function interventionNodeIds(intervention: Intervention): string[] {
  if (intervention.kind === "route-surgery") return [];
  return intervention.kind === "link-confusion" ? intervention.nodes.map((node) => node.nodeId) : [intervention.nodeId];
}
