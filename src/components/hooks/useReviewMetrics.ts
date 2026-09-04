import { useMemo } from "react";
import type { AnalyticsEvent, Locus } from "../../domain/entities/types";
import { averageLocusInterval, countDueLoci } from "../../domain/services/dueQueue";
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
export function useReviewMetrics(events: AnalyticsEvent[], loci: Locus[], filter: ReviewFilter) {
  const retentionSeries = useMemo(() => buildRetentionSeries(events, 30, filter), [events, filter]);
  const trendDown = useMemo(() => retentionTrendDown(retentionSeries), [retentionSeries]);
  const heatmapCells = useMemo(
    () => buildReviewHeatmap(events, 52, new Date().toISOString(), filter),
    [events, filter],
  );

  const scopedLoci = useMemo(
    () => (filter.routeId ? loci.filter((locus) => locus.routeId === filter.routeId) : loci),
    [filter.routeId, loci],
  );
  const dueCount = useMemo(() => countDueLoci(scopedLoci), [scopedLoci]);
  const averageInterval = useMemo(() => averageLocusInterval(scopedLoci), [scopedLoci]);

  return { retentionSeries, trendDown, heatmapCells, dueCount, averageInterval };
}
