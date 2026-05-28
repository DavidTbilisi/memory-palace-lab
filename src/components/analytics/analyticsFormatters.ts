import type { AnalyticsEvent } from "../../domain/entities/types";
import { parseAnalyticsPayload } from "../../domain/services/analyticsService";

/** Human-readable one-line detail for an analytics event row. */
export function formatEventDetail(event: AnalyticsEvent): string {
  const payload = parseAnalyticsPayload(event);
  if (event.eventType === "walk_recall_rated") {
    const rating = typeof payload.rating === "string" ? payload.rating : "unrated";
    const latency = typeof payload.timeToRevealMs === "number" ? `${payload.timeToRevealMs} ms` : "no timer";
    return `${rating} - ${latency}`;
  }
  if (event.eventType === "walk_answer_revealed") {
    return typeof payload.timeToRevealMs === "number" ? `${payload.timeToRevealMs} ms to reveal` : "answer revealed";
  }
  if (event.eventType === "node_created" || event.eventType === "node_updated") {
    return typeof payload.title === "string" && payload.title.trim() ? payload.title : "memory node";
  }
  if (event.eventType === "edge_created" || event.eventType === "edge_updated") {
    return typeof payload.label === "string" && payload.label.trim() ? payload.label : "CAST edge";
  }
  if (event.eventType === "route_created") {
    return typeof payload.name === "string" && payload.name.trim() ? payload.name : "route";
  }
  if (event.eventType === "system_run_materialized") {
    return typeof payload.pipelineTitle === "string" ? payload.pipelineTitle : "theSystem run";
  }
  return typeof payload.source === "string" ? payload.source : "local event";
}

/** SVG path string for the retention line chart. */
export function retentionPath(
  points: Array<{ averageScorePct: number }>,
  width: number,
  height: number,
  padding = 24,
): string {
  if (points.length === 0) return "";
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  return points
    .map((point, index) => {
      const x = padding + (points.length === 1 ? 0 : (index / (points.length - 1)) * usableWidth);
      const y = padding + (1 - point.averageScorePct / 100) * usableHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

/** Tailwind background class for a heatmap cell given its review count. */
export function heatmapTone(count: number): string {
  if (count <= 0) return "bg-zinc-900";
  if (count <= 3) return "bg-emerald-900/60";
  if (count <= 9) return "bg-emerald-600/70";
  return "bg-emerald-400";
}
