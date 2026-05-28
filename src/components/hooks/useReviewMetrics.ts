import { useMemo } from "react";
import type { AnalyticsEvent, Locus } from "../../domain/entities/types";
import {
  buildReviewHeatmap,
  buildRetentionSeries,
  retentionTrendDown,
  type ReviewFilter,
} from "../../domain/services/reviewMetrics";
import { normalizeLocusSchedule } from "../../domain/services/spacedRepetition";

/**
 * Derives spaced-review health metrics from analytics events and the current
 * loci: retention curve, consistency heatmap, due count, and average interval.
 * Pure derivation from the supplied inputs.
 */
export function useReviewMetrics(events: AnalyticsEvent[], loci: Locus[], filter: ReviewFilter) {
  const retentionSeries = useMemo(() => buildRetentionSeries(events, 30, filter), [events, filter]);
  const trendDown = useMemo(() => retentionTrendDown(retentionSeries), [retentionSeries]);
  const heatmapCells = useMemo(
    () => buildReviewHeatmap(events, 52, new Date().toISOString(), filter),
    [events, filter],
  );

  const dueCount = useMemo(() => {
    const nowIso = new Date().toISOString();
    const nowMs = Date.parse(nowIso);
    return loci
      .map((locus) => normalizeLocusSchedule(locus, nowIso))
      .filter((locus) => Date.parse(locus.nextReviewAt ?? nowIso) <= nowMs).length;
  }, [loci]);

  const averageInterval = useMemo(() => {
    if (loci.length === 0) return null;
    const intervals = loci.map((locus) => normalizeLocusSchedule(locus).interval ?? 0).filter((value) => value > 0);
    if (intervals.length === 0) return null;
    return Math.round(intervals.reduce((total, value) => total + value, 0) / intervals.length);
  }, [loci]);

  return { retentionSeries, trendDown, heatmapCells, dueCount, averageInterval };
}
