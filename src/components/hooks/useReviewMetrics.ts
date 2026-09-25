import { useMemo } from "react";
import type { AnalyticsEvent, Locus, MemoryNode, MemoryRoute } from "../../domain/entities/types";
import { averageLocusInterval, countDueLoci, nedfLookup, reviewedLoci } from "../../domain/services/dueQueue";
import {
  buildReviewHeatmap,
  buildRetentionSeries,
  retentionTrendDown,
  type ReviewFilter,
} from "../../domain/services/reviewMetrics";

/**
 * Derives spaced-review health metrics from analytics events and the current
 * loci: retention curve, consistency heatmap, due count, and average interval.
 * Pure derivation from the supplied inputs; the route filter applies to loci
 * as well as events.
 */
export function useReviewMetrics(
  events: AnalyticsEvent[],
  loci: Locus[],
  routes: MemoryRoute[],
  filter: ReviewFilter,
  /** The palace's nodes, so NEDF-encoded stops count each slot's schedule. */
  nodes: readonly MemoryNode[] = [],
) {
  const retentionSeries = useMemo(() => buildRetentionSeries(events, 30, filter), [events, filter]);
  const trendDown = useMemo(() => retentionTrendDown(retentionSeries), [retentionSeries]);
  const heatmapCells = useMemo(
    () => buildReviewHeatmap(events, 52, new Date().toISOString(), filter),
    [events, filter],
  );

  const scopedLoci = useMemo(
    () => {
      const reviewed = reviewedLoci(loci, routes);
      return filter.routeId ? reviewed.filter((locus) => locus.routeId === filter.routeId) : reviewed;
    },
    [filter.routeId, loci, routes],
  );
  const nedfOf = useMemo(() => nedfLookup(nodes), [nodes]);
  const dueCount = useMemo(() => countDueLoci(scopedLoci, undefined, nedfOf), [scopedLoci, nedfOf]);
  const averageInterval = useMemo(() => averageLocusInterval(scopedLoci, undefined, nedfOf), [scopedLoci, nedfOf]);

  return { retentionSeries, trendDown, heatmapCells, dueCount, averageInterval };
}
