import type { AnalyticsEvent } from "../entities/types";
import { parseAnalyticsPayload } from "./analyticsService";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

/** Speed bands come from the learner's own recent first encodes, never a fixed threshold. */
export const SPEED_BAND_WINDOW_DAYS = 90;
export const SPEED_BAND_MIN_SAMPLES = 12;
/** The trend is shown once encodes span four weeks. */
export const TREND_MIN_DAYS = 28;

export type SpeedBand = "fast" | "typical" | "slow";

export const SPEED_BAND_LABELS: Record<SpeedBand, string> = { fast: "Fast", typical: "Typical", slow: "Slow" };

export type EncodeSample = {
  kind: "node" | "edge";
  /** The node, or the edge's id. */
  id: string;
  palaceId: string | null;
  first: boolean;
  /** Null when the encode could not be timed honestly. */
  activeMs: number | null;
  at: string;
};

export type SpeedBandThresholds = {
  /** At or under this, an encode is fast. */
  fastMs: number;
  /** Over this, an encode is slow. */
  slowMs: number;
  samples: number;
};

export type NodeEncodeSpeed = {
  activeMs: number;
  /** Null until there are enough timed encodes to say what is fast for this learner. */
  band: SpeedBand | null;
};

/** node_encoded and edge_encoded events, oldest first. */
export function encodeSamples(events: readonly AnalyticsEvent[]): EncodeSample[] {
  const samples: EncodeSample[] = [];
  for (const event of events) {
    if (event.eventType !== "node_encoded" && event.eventType !== "edge_encoded") continue;
    const payload = parseAnalyticsPayload(event);
    const kind = event.eventType === "node_encoded" ? "node" : "edge";
    const id = kind === "node" ? event.nodeId : typeof payload.edgeId === "string" ? payload.edgeId : null;
    if (!id) continue;
    const activeMs = typeof payload.activeMs === "number" && Number.isFinite(payload.activeMs) ? payload.activeMs : null;
    samples.push({ kind, id, palaceId: event.palaceId ?? null, first: payload.first === true, activeMs, at: event.createdAt });
  }
  return samples.sort((a, b) => a.at.localeCompare(b.at));
}

/** Linear-interpolated percentile of sorted values, p in [0, 1]. */
function percentile(sorted: readonly number[], p: number): number {
  const rank = (sorted.length - 1) * p;
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  return sorted[low] + (sorted[high] - sorted[low]) * (rank - low);
}

export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  return percentile([...values].sort((a, b) => a - b), 0.5);
}

/**
 * The learner's thirds: the 33rd and 67th percentiles of timed first node encodes over the
 * last 90 days. Null with fewer than 12 of them.
 */
export function speedBandThresholds(samples: readonly EncodeSample[], nowIso: string): SpeedBandThresholds | null {
  const floor = Date.parse(nowIso) - SPEED_BAND_WINDOW_DAYS * DAY_MS;
  const times = samples
    .filter((sample) => sample.kind === "node" && sample.first && sample.activeMs !== null && Date.parse(sample.at) >= floor)
    .map((sample) => sample.activeMs as number)
    .sort((a, b) => a - b);
  if (times.length < SPEED_BAND_MIN_SAMPLES) return null;
  return { fastMs: percentile(times, 1 / 3), slowMs: percentile(times, 2 / 3), samples: times.length };
}

export function speedBandOf(activeMs: number, thresholds: SpeedBandThresholds): SpeedBand {
  if (activeMs <= thresholds.fastMs) return "fast";
  if (activeMs > thresholds.slowMs) return "slow";
  return "typical";
}

/** Each node's timed first encode (the latest, should there be more than one) and its band. */
export function nodeEncodeSpeeds(events: readonly AnalyticsEvent[], nowIso: string): Map<string, NodeEncodeSpeed> {
  const samples = encodeSamples(events);
  const thresholds = speedBandThresholds(samples, nowIso);
  const speeds = new Map<string, NodeEncodeSpeed>();
  for (const sample of samples) {
    if (sample.kind !== "node" || !sample.first || sample.activeMs === null) continue;
    speeds.set(sample.id, {
      activeMs: sample.activeMs,
      band: thresholds ? speedBandOf(sample.activeMs, thresholds) : null,
    });
  }
  return speeds;
}

export type EncodeTrendWeek = {
  /** Start of the seven days, ISO. */
  start: string;
  node: { first: number | null; reedit: number | null; firstCount: number; reeditCount: number };
  edge: { first: number | null; reedit: number | null; firstCount: number; reeditCount: number };
};

export type EncodeTrend = {
  weeks: EncodeTrendWeek[];
  /** Median first encode over the last four weeks, from the raw times. */
  recent: Record<"node" | "edge", { median: number | null; count: number }>;
  /** Days since the oldest timed encode; the chart waits for four weeks. */
  spanDays: number;
  ready: boolean;
};

/**
 * Median encode time per week for the last `weeks` weeks (seven-day windows ending now), for
 * nodes and edges, with first encodes and re-edits apart.
 */
export function buildEncodeTrend(
  events: readonly AnalyticsEvent[],
  nowIso: string,
  options: { weeks?: number; palaceId?: string | null } = {},
): EncodeTrend {
  const weeks = options.weeks ?? 12;
  const now = Date.parse(nowIso);
  const timed = encodeSamples(events).filter(
    (sample) => sample.activeMs !== null && (!options.palaceId || sample.palaceId === options.palaceId),
  );
  const oldest = timed.length > 0 ? Date.parse(timed[0].at) : now;
  const spanDays = Math.max(0, Math.floor((now - oldest) / DAY_MS));

  const buckets = Array.from({ length: weeks }, (_, index) => {
    const start = now - (weeks - index) * WEEK_MS;
    return { start, node: { first: [] as number[], reedit: [] as number[] }, edge: { first: [] as number[], reedit: [] as number[] } };
  });
  for (const sample of timed) {
    const at = Date.parse(sample.at);
    const index = weeks - 1 - Math.floor((now - at) / WEEK_MS);
    if (index < 0 || index >= weeks || at > now) continue;
    buckets[index][sample.kind][sample.first ? "first" : "reedit"].push(sample.activeMs as number);
  }
  const summarize = (lists: { first: number[]; reedit: number[] }) => ({
    first: median(lists.first),
    reedit: median(lists.reedit),
    firstCount: lists.first.length,
    reeditCount: lists.reedit.length,
  });
  const recentFloor = now - TREND_MIN_DAYS * DAY_MS;
  const recentFirst = (kind: "node" | "edge") => {
    const times = timed
      .filter((sample) => sample.kind === kind && sample.first && Date.parse(sample.at) >= recentFloor)
      .map((sample) => sample.activeMs as number);
    return { median: median(times), count: times.length };
  };
  return {
    recent: { node: recentFirst("node"), edge: recentFirst("edge") },
    weeks: buckets.map((bucket) => ({
      start: new Date(bucket.start).toISOString(),
      node: summarize(bucket.node),
      edge: summarize(bucket.edge),
    })),
    spanDays,
    ready: spanDays >= TREND_MIN_DAYS,
  };
}
