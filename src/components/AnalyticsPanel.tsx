import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BarChart3, Brain, Clock3, Settings2, ShieldCheck } from "lucide-react";
import type { AnalyticsEvent } from "../domain/entities/types";
import { humanizeAnalyticsEventType, parseAnalyticsPayload, summarizeAnalytics } from "../domain/services/analyticsService";
import { buildReviewHeatmap, buildRetentionSeries, formatDayKeyLabel, retentionTrendDown } from "../domain/services/reviewMetrics";
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

const AI_KEY_STORAGE = "mp-ai-anthropic-key";

function formatEventDetail(event: AnalyticsEvent) {
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

function StatCard({
  icon,
  label,
  value,
  tone = "zinc",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "zinc" | "violet" | "emerald";
}) {
  const toneClass =
    tone === "violet"
      ? "border-violet-800/60 bg-violet-950/30"
      : tone === "emerald"
        ? "border-emerald-800/60 bg-emerald-950/30"
        : "border-zinc-800 bg-zinc-900/40";

  return (
    <div className={`rounded-md border p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

function retentionPath(points: Array<{ averageScorePct: number }>, width: number, height: number, padding = 24) {
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

function heatmapTone(count: number) {
  if (count <= 0) return "bg-zinc-900";
  if (count <= 3) return "bg-emerald-900/60";
  if (count <= 9) return "bg-emerald-600/70";
  return "bg-emerald-400";
}

export function AnalyticsPanel() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const loci = usePalaceStore((s) => s.loci);
  const dailyReviewGoal = usePalaceStore((s) => s.dailyReviewGoal);
  const setDailyReviewGoal = usePalaceStore((s) => s.setDailyReviewGoal);

  const [selectedPalaceFilter, setSelectedPalaceFilter] = useState<string>("all");
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>("all");
  const [hoveredDayKey, setHoveredDayKey] = useState<string | null>(null);
  const [anthropicKey, setAnthropicKey] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(AI_KEY_STORAGE) ?? "",
  );

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const trimmed = anthropicKey.trim();
    if (!trimmed) {
      window.localStorage.removeItem(AI_KEY_STORAGE);
      return;
    }
    window.localStorage.setItem(AI_KEY_STORAGE, trimmed);
  }, [anthropicKey]);

  const allSummary = useMemo(() => summarizeAnalytics(analyticsEvents), [analyticsEvents]);
  const recentEvents = useMemo(() => analyticsEvents.slice(0, 12), [analyticsEvents]);
  const filter = useMemo(
    () => ({
      palaceId: selectedPalaceFilter === "all" ? undefined : selectedPalaceFilter,
      routeId: selectedRouteFilter === "all" ? undefined : selectedRouteFilter,
    }),
    [selectedPalaceFilter, selectedRouteFilter],
  );

  const retentionSeries = useMemo(() => buildRetentionSeries(analyticsEvents, 30, filter), [analyticsEvents, filter]);
  const trendDown = useMemo(() => retentionTrendDown(retentionSeries), [retentionSeries]);
  const heatmapCells = useMemo(() => buildReviewHeatmap(analyticsEvents, 52, new Date().toISOString(), filter), [analyticsEvents, filter]);
  const hoveredCell = useMemo(() => heatmapCells.find((cell) => cell.dayKey === hoveredDayKey) ?? null, [heatmapCells, hoveredDayKey]);

  const dueCount = useMemo(() => {
    const nowIso = new Date().toISOString();
    return loci
      .map((locus) => normalizeLocusSchedule(locus, nowIso))
      .filter((locus) => Date.parse(locus.nextReviewAt ?? nowIso) <= Date.now()).length;
  }, [loci]);

  const averageInterval = useMemo(() => {
    if (loci.length === 0) return null;
    const intervals = loci.map((locus) => normalizeLocusSchedule(locus).interval ?? 0).filter((value) => value > 0);
    if (intervals.length === 0) return null;
    return Math.round(intervals.reduce((total, value) => total + value, 0) / intervals.length);
  }, [loci]);

  const routeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const event of analyticsEvents) {
      if (event.routeId) set.add(event.routeId);
    }
    return [...set].sort();
  }, [analyticsEvents]);

  const palaceOptions = useMemo(() => {
    const set = new Set<string>();
    for (const event of analyticsEvents) {
      if (event.palaceId) set.add(event.palaceId);
    }
    return [...set].sort();
  }, [analyticsEvents]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BarChart3 className="h-4 w-4" />
          Insights
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Local-first telemetry for encoding and retrieval. This dashboard includes retention trends, consistency
          heatmaps, and scheduling health.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <div className="grid gap-3 md:grid-cols-5">
          <StatCard icon={<Activity className="h-3.5 w-3.5" />} label="Total events" value={String(allSummary.totalEvents)} />
          <StatCard
            icon={<Brain className="h-3.5 w-3.5" />}
            label="Review ratings"
            value={String(allSummary.countsByType.walk_recall_rated ?? 0)}
            tone="violet"
          />
          <StatCard
            icon={<Clock3 className="h-3.5 w-3.5" />}
            label="Avg reveal time"
            value={allSummary.averageRecallLatencyMs === null ? "n/a" : `${allSummary.averageRecallLatencyMs} ms`}
            tone="emerald"
          />
          <StatCard icon={<Clock3 className="h-3.5 w-3.5" />} label="Due loci" value={String(dueCount)} />
          <StatCard
            icon={<Clock3 className="h-3.5 w-3.5" />}
            label="Avg interval"
            value={averageInterval === null ? "n/a" : `${averageInterval}d`}
          />
        </div>

        <section className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div id="insights-settings" className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Settings2 className="h-4 w-4 text-violet-300" />
              Review Settings
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span>Daily loci goal</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={dailyReviewGoal}
                  onChange={(event) => setDailyReviewGoal(Number(event.target.value))}
                  className="h-8 w-20 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-zinc-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>Anthropic API key</span>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(event) => setAnthropicKey(event.target.value)}
                  className="h-8 w-56 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-zinc-100"
                  placeholder="sk-ant-..."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium text-zinc-100">Memory Strength Over Time</div>
            <div className="flex flex-wrap gap-2">
              <select
                className="h-8 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                value={selectedPalaceFilter}
                onChange={(event) => setSelectedPalaceFilter(event.target.value)}
              >
                <option value="all">All palaces</option>
                {palaceOptions.map((palaceId) => (
                  <option key={palaceId} value={palaceId}>
                    {palaceId}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
                value={selectedRouteFilter}
                onChange={(event) => setSelectedRouteFilter(event.target.value)}
              >
                <option value="all">All routes</option>
                {routeOptions.map((routeId) => (
                  <option key={routeId} value={routeId}>
                    {routeId}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {retentionSeries.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
              Review some loci to see your retention curve.
            </div>
          ) : (
            <>
              <svg viewBox="0 0 640 220" className="mt-3 h-[220px] w-full rounded-md border border-zinc-800 bg-zinc-950/50">
                <path d={retentionPath(retentionSeries, 640, 220)} fill="none" stroke="#a78bfa" strokeWidth={2.5} />
                {retentionSeries.map((point, index) => {
                  const x = 24 + (retentionSeries.length === 1 ? 0 : (index / (retentionSeries.length - 1)) * (640 - 48));
                  const y = 24 + (1 - point.averageScorePct / 100) * (220 - 48);
                  return (
                    <circle key={point.dayKey} cx={x} cy={y} r={4} fill="#c4b5fd">
                      <title>{`${formatDayKeyLabel(point.dayKey)}: ${point.averageScorePct}% (${point.count} loci)`}</title>
                    </circle>
                  );
                })}
              </svg>
              {trendDown ? (
                <div className="mt-2 rounded-md border border-amber-700/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
                  Your retention is trending down - consider shorter, more frequent sessions.
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="text-sm font-medium text-zinc-100">Review Consistency (52 weeks)</div>
          {heatmapCells.every((cell) => cell.count === 0) ? (
            <div className="mt-3 rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
              Your review history will appear here after your first walk session.
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("mp-open-review"))}
                >
                  Start reviewing
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-3 overflow-x-auto pb-2">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {heatmapCells.map((cell) => (
                    <button
                      key={cell.dayKey}
                      type="button"
                      onMouseEnter={() => setHoveredDayKey(cell.dayKey)}
                      onMouseLeave={() => setHoveredDayKey((current) => (current === cell.dayKey ? null : current))}
                      className={`h-3 w-3 rounded-sm ${heatmapTone(cell.count)} ${cell.isToday ? "ring-1 ring-violet-300" : ""}`}
                      title={`${formatDayKeyLabel(cell.dayKey)} - ${cell.count} loci reviewed across ${cell.routeCount} routes`}
                      aria-label={`${cell.dayKey}: ${cell.count} reviewed`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {hoveredCell
                  ? `${formatDayKeyLabel(hoveredCell.dayKey)} - ${hoveredCell.count} loci reviewed across ${hoveredCell.routeCount} routes`
                  : "Hover a day to inspect review volume."}
              </div>
            </>
          )}
        </section>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <ShieldCheck className="h-4 w-4 text-violet-300" />
              What is tracked
            </div>
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              <li>- Palace lifecycle: created, opened, draft-saved, checkpoint-saved.</li>
              <li>- Graph work: node create/update, edge create/update, route create, locus add/update.</li>
              <li>- Review flow: walk start, step changes, answer reveals, recall ratings, walk close.</li>
              <li>- theSystem runs: pipeline materialization into graph structure.</li>
            </ul>
            <div className="mt-3 text-xs text-zinc-500">
              Palace: {currentPalace ? currentPalace.name : "Open a palace to inspect palace-scoped metrics."}
            </div>
          </section>

          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-sm font-medium text-zinc-100">Recent events</div>
            <div className="mt-3 space-y-2">
              {recentEvents.length === 0 ? (
                <div className="rounded border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-4 text-sm text-zinc-500">
                  No analytics events yet.
                </div>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="font-medium capitalize text-zinc-100">{humanizeAnalyticsEventType(event.eventType)}</div>
                      <div className="text-[11px] text-zinc-500">{new Date(event.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">{formatEventDetail(event)}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
