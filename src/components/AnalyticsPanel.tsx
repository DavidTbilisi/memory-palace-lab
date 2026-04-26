import { useEffect, useMemo, type ReactNode } from "react";
import { Activity, BarChart3, Brain, Clock3, ShieldCheck } from "lucide-react";
import type { AnalyticsEvent } from "../domain/entities/types";
import {
  humanizeAnalyticsEventType,
  parseAnalyticsPayload,
  summarizeAnalytics,
} from "../domain/services/analyticsService";
import { usePalaceStore } from "../store/palaceStore";

function formatEventDetail(event: AnalyticsEvent) {
  const payload = parseAnalyticsPayload(event);
  if (event.eventType === "walk_recall_rated") {
    const rating = typeof payload.rating === "string" ? payload.rating : "unrated";
    const latency = typeof payload.timeToRevealMs === "number" ? `${payload.timeToRevealMs} ms` : "no timer";
    return `${rating} • ${latency}`;
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

export function AnalyticsPanel() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  const allSummary = useMemo(() => summarizeAnalytics(analyticsEvents), [analyticsEvents]);
  const palaceEvents = useMemo(() => {
    if (!currentPalace) return [] as AnalyticsEvent[];
    return analyticsEvents.filter((event) => event.palaceId === currentPalace.id);
  }, [analyticsEvents, currentPalace]);
  const palaceSummary = useMemo(() => summarizeAnalytics(palaceEvents), [palaceEvents]);
  const recentEvents = useMemo(() => analyticsEvents.slice(0, 12), [analyticsEvents]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Local-first telemetry for encoding and retrieval. Events stay on this device by default, are stored in SQLite
          in the app and `localStorage` in the browser fallback, and can be inspected here.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <div className="grid gap-3 md:grid-cols-3">
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
        </div>

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
          </section>

          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-sm font-medium text-zinc-100">Current session</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Nodes</div>
                <div className="font-semibold text-zinc-100">
                  {(allSummary.currentSessionCounts.node_created ?? 0) + (allSummary.currentSessionCounts.node_updated ?? 0)}
                </div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Edges</div>
                <div className="font-semibold text-zinc-100">
                  {(allSummary.currentSessionCounts.edge_created ?? 0) + (allSummary.currentSessionCounts.edge_updated ?? 0)}
                </div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Routes</div>
                <div className="font-semibold text-zinc-100">{allSummary.currentSessionCounts.route_created ?? 0}</div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Review actions</div>
                <div className="font-semibold text-zinc-100">
                  {(allSummary.currentSessionCounts.walk_stepped ?? 0) +
                    (allSummary.currentSessionCounts.walk_answer_revealed ?? 0) +
                    (allSummary.currentSessionCounts.walk_recall_rated ?? 0)}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Session id: {allSummary.currentSessionId ? allSummary.currentSessionId.slice(0, 8) : "not started"}
            </div>
          </section>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.15fr]">
          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="text-sm font-medium text-zinc-100">Current palace snapshot</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Nodes created</div>
                <div className="font-semibold text-zinc-100">{palaceSummary.countsByType.node_created ?? 0}</div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Edges created</div>
                <div className="font-semibold text-zinc-100">{palaceSummary.countsByType.edge_created ?? 0}</div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Recall again</div>
                <div className="font-semibold text-zinc-100">{palaceSummary.recallRatings.again}</div>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                <div className="text-zinc-500">Recall easy</div>
                <div className="font-semibold text-zinc-100">{palaceSummary.recallRatings.easy}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Palace: {currentPalace ? currentPalace.name : "Open a palace to see palace-scoped analytics."}
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
