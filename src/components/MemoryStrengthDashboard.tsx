import { useEffect, useMemo, type ReactNode } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Flame,
  LineChart,
  Mountain,
  Orbit,
  Route,
  Target,
} from "lucide-react";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import {
  buildMemoryStrengthDashboard,
  formatDashboardUrgency,
  formatRouteFrictionStatus,
  formatTrendDirection,
  type DashboardUrgency,
  type MemoryStrengthActionItem,
  type PalaceHealthItem,
  type RouteFrictionStatus,
  type TrendPoint,
} from "../domain/services/memoryStrengthService";
import { orderedLoci } from "../domain/services/walkService";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

function StatCard({
  icon,
  label,
  value,
  tone = "zinc",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "zinc" | "amber" | "emerald" | "violet";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-700/70 bg-amber-950/20"
      : tone === "emerald"
        ? "border-emerald-700/70 bg-emerald-950/20"
        : tone === "violet"
          ? "border-violet-700/70 bg-violet-950/20"
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

function actionToneClass(urgency: DashboardUrgency) {
  switch (urgency) {
    case "critical":
      return "border-rose-700/70 bg-rose-950/20";
    case "weak":
      return "border-amber-700/70 bg-amber-950/20";
    case "stable":
      return "border-zinc-800 bg-zinc-900/40";
    case "strong":
      return "border-emerald-700/70 bg-emerald-950/20";
    default:
      return "border-zinc-800 bg-zinc-900/40";
  }
}

function frictionToneClass(status: RouteFrictionStatus) {
  switch (status) {
    case "cognitively_expensive":
      return "border-rose-700/70 bg-rose-950/20";
    case "unstable":
      return "border-amber-700/70 bg-amber-950/20";
    case "steady":
      return "border-emerald-700/70 bg-emerald-950/20";
    default:
      return "border-zinc-800 bg-zinc-900/40";
  }
}

function percent(value: number | null) {
  if (value === null) return "n/a";
  return `${value}%`;
}

function formatAtlasPath(path: string | null) {
  return path?.trim() ? path : "Ungrouped";
}

function formatDueState(state: MemoryStrengthActionItem["state"]) {
  switch (state) {
    case "overdue":
      return "Overdue";
    case "due_now":
      return "Due now";
    case "scheduled":
      return "Scheduled";
    case "fresh":
      return "Fresh";
    default:
      return "Fresh";
  }
}

function formatRevealLatency(ms: number | null) {
  if (ms === null) return "n/a";
  if (ms < 1_000) return `${ms} ms`;
  return `${(ms / 1_000).toFixed(1)} s`;
}

function trendBarHeight(point: TrendPoint) {
  if (point.averageScore === null) return 12;
  return Math.max(12, Math.round(point.averageScore));
}

export function MemoryStrengthDashboard() {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const nodes = usePalaceStore((s) => s.nodes);
  const routes = usePalaceStore((s) => s.routes);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const setWalkRecallMode = usePalaceStore((s) => s.setWalkRecallMode);
  const setWalkCueOnly = usePalaceStore((s) => s.setWalkCueOnly);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  const dashboard = useMemo(
    () =>
      buildMemoryStrengthDashboard({
        analyticsEvents,
        palaces,
        nodes,
        routes,
      }),
    [analyticsEvents, nodes, palaces, routes],
  );

  const ensurePalaceOpen = async (palaceId: string | null) => {
    if (!palaceId) return false;
    if (usePalaceStore.getState().currentPalace?.id === palaceId) return true;
    await openPalace(palaceId);
    return true;
  };

  const waitForEditor = async (palaceId: string, timeoutMs = 5_000) => {
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 50));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const state = usePalaceStore.getState();
      if (state.currentPalace?.id === palaceId && state.editorRef) {
        return state.editorRef;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return null;
  };

  const focusNode = async (palaceId: string | null, nodeId: string | null) => {
    if (!palaceId || !nodeId) return;
    const opened = await ensurePalaceOpen(palaceId);
    if (!opened) return;
    const editorRef = await waitForEditor(palaceId);
    if (!editorRef) return;
    for (const shapeId of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(shapeId);
      if (shape?.type !== "geo") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (meta.mpNodeId !== nodeId) continue;
      editorRef.setSelectedShapes([shapeId as TLShapeId]);
      usePalaceStore.getState().setSelectedShapeId(shapeId);
      editorRef.zoomToSelectionIfOffscreen(120, { animation: { duration: 220 } });
      break;
    }
  };

  const reviewRoute = async (palaceId: string | null, routeId: string | null) => {
    if (!palaceId || !routeId) return;
    const opened = await ensurePalaceOpen(palaceId);
    if (!opened) return;
    setWalkRoute(routeId);
    setWalkRecallMode(true);
    setWalkCueOnly(true);
    setWalkOpen(true);
  };

  const reviewNode = async (item: MemoryStrengthActionItem) => {
    if (!item.nodeId) return;
    if (!item.routeId) {
      await focusNode(item.palaceId, item.nodeId);
      return;
    }
    await reviewRoute(item.palaceId, item.routeId);
    const state = usePalaceStore.getState();
    const routeLoci = orderedLoci(state.loci.filter((locus) => locus.routeId === item.routeId));
    const targetIndex = routeLoci.findIndex((locus) => locus.nodeId === item.nodeId);
    if (targetIndex >= 0) {
      usePalaceStore.setState({ walkIndex: targetIndex });
    }
  };

  if (palaces.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-500">
        Create a palace and review a route to generate memory strength analytics.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <LineChart className="h-4 w-4" />
          Memory strength
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          This dashboard turns review telemetry into action. It surfaces weak material first, shows palace health and
          trend direction, and marks routes that are becoming cognitively expensive.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <div className="grid gap-3 md:grid-cols-4">
          <StatCard
            icon={<Target className="h-3.5 w-3.5" />}
            label="Average strength"
            value={percent(dashboard.overview.averageStrength)}
            tone="violet"
          />
          <StatCard
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            label="Due now"
            value={String(dashboard.overview.totalDue)}
            tone="amber"
          />
          <StatCard
            icon={<Flame className="h-3.5 w-3.5" />}
            label="Overdue"
            value={String(dashboard.overview.totalOverdue)}
            tone={dashboard.overview.totalOverdue > 0 ? "amber" : "zinc"}
          />
          <StatCard
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Trend"
            value={formatTrendDirection(dashboard.overview.trendDirection)}
            tone="emerald"
          />
        </div>

        <div className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-5 text-zinc-400">
          Active palaces: <span className="text-zinc-200">{dashboard.overview.activePalaces}</span>. Review sessions:{" "}
          <span className="text-zinc-200">{dashboard.overview.reviewSessions}</span>. Current palace:{" "}
          <span className="text-zinc-200">{currentPalace?.name ?? "none"}</span>.
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <BrainCircuit className="h-4 w-4 text-violet-300" />
              Action queue
            </div>
            <div className="mt-3 space-y-3">
              {dashboard.actionItems.length === 0 ? (
                <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-5 text-sm text-zinc-500">
                  No prioritized review items yet. Grade a recall session to start scoring strength.
                </div>
              ) : (
                dashboard.actionItems.map((item) => (
                  <section key={item.id} className={`rounded-md border p-3 ${actionToneClass(item.urgency)}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-zinc-500">
                          {item.kind === "route" ? <Route className="h-3.5 w-3.5" /> : <Orbit className="h-3.5 w-3.5" />}
                          {item.kind}
                          <span>{formatDashboardUrgency(item.urgency)}</span>
                        </div>
                        <div className="mt-1 text-sm font-semibold text-zinc-100">{item.title}</div>
                        <div className="mt-1 text-xs text-zinc-400">{item.subtitle}</div>
                        <div className="mt-2 text-xs text-zinc-500">
                          {item.palaceName} / {formatAtlasPath(item.palaceAtlasPath)}
                        </div>
                        <div className="mt-2 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
                          <div>State: {formatDueState(item.state)}</div>
                          <div>Last grade: {item.latestRating ?? "none"}</div>
                          <div>Strength: {percent(item.strengthScore)}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        {item.kind === "route" ? (
                          <Button type="button" size="sm" onClick={() => void reviewRoute(item.palaceId, item.routeId)}>
                            Review route
                          </Button>
                        ) : (
                          <Button type="button" size="sm" onClick={() => void reviewNode(item)}>
                            {item.routeId ? "Review node" : "Focus node"}
                          </Button>
                        )}
                        <Button type="button" size="sm" variant="secondary" onClick={() => void ensurePalaceOpen(item.palaceId)}>
                          Open palace
                        </Button>
                      </div>
                    </div>
                  </section>
                ))
              )}
            </div>
          </section>

          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <LineChart className="h-4 w-4 text-violet-300" />
              Recall trend
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              Overall trend: <span className="text-zinc-200">{formatTrendDirection(dashboard.overview.trendDirection)}</span>
              {dashboard.overview.trendDelta !== null ? (
                <span className="text-zinc-500"> ({dashboard.overview.trendDelta > 0 ? "+" : ""}{dashboard.overview.trendDelta})</span>
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {dashboard.trend.map((point) => (
                <div key={point.dayKey} className="flex flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end justify-center rounded-md border border-zinc-800 bg-zinc-950/40 px-1 py-2">
                    <div
                      className={`w-full rounded-sm ${
                        point.averageScore === null
                          ? "bg-zinc-700/50"
                          : point.averageScore >= 80
                            ? "bg-emerald-500/80"
                            : point.averageScore >= 60
                              ? "bg-violet-500/80"
                              : point.averageScore >= 40
                                ? "bg-amber-500/80"
                                : "bg-rose-500/80"
                      }`}
                      style={{ height: `${trendBarHeight(point)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-zinc-500">{point.label}</div>
                  <div className="text-[11px] text-zinc-400">{point.reviewCount} reviews</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Mountain className="h-4 w-4 text-violet-300" />
              Palace health
            </div>
            <div className="mt-3 space-y-3">
              {dashboard.palaceHealth.map((palace) => (
                <PalaceHealthCard key={palace.palaceId} palace={palace} onOpen={() => void ensurePalaceOpen(palace.palaceId)} />
              ))}
            </div>
          </section>

          <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
              <Route className="h-4 w-4 text-violet-300" />
              Route friction
            </div>
            <div className="mt-3 space-y-3">
              {dashboard.routeFriction.length === 0 ? (
                <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-5 text-sm text-zinc-500">
                  No route friction yet. Review more than one route step to reveal hesitation patterns.
                </div>
              ) : (
                dashboard.routeFriction.map((route) => (
                  <section key={route.routeId} className={`rounded-md border p-3 ${frictionToneClass(route.status)}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-zinc-500">
                          <Route className="h-3.5 w-3.5" />
                          {formatRouteFrictionStatus(route.status)}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-zinc-100">{route.routeName}</div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {route.palaceName} / {formatAtlasPath(route.palaceAtlasPath)}
                        </div>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className={`h-full rounded-full ${
                              route.status === "cognitively_expensive"
                                ? "bg-rose-500"
                                : route.status === "unstable"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${route.frictionScore}%` }}
                          />
                        </div>
                        <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
                          <div>Attempts: {route.attemptCount}</div>
                          <div>Fail rate: {Math.round(route.failureRate * 100)}%</div>
                          <div>Hard rate: {Math.round(route.hardRate * 100)}%</div>
                          <div>Reveal time: {formatRevealLatency(route.averageRevealLatencyMs)}</div>
                          <div>Due state: {route.dueState ? formatDueState(route.dueState) : "Fresh"}</div>
                          <div>Friction: {percent(route.frictionScore)}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button type="button" size="sm" onClick={() => void reviewRoute(route.palaceId, route.routeId)}>
                          Review route
                        </Button>
                        <Button type="button" size="sm" variant="secondary" onClick={() => void ensurePalaceOpen(route.palaceId)}>
                          Open palace
                        </Button>
                      </div>
                    </div>
                  </section>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PalaceHealthCard({ palace, onOpen }: { palace: PalaceHealthItem; onOpen: () => void }) {
  const barTone =
    palace.healthScore >= 80 ? "bg-emerald-500" : palace.healthScore >= 60 ? "bg-violet-500" : palace.healthScore >= 40 ? "bg-amber-500" : "bg-rose-500";

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-zinc-100">{palace.palaceName}</div>
          <div className="mt-1 text-xs text-zinc-500">{formatAtlasPath(palace.atlasPath)}</div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className={`h-full rounded-full ${barTone}`} style={{ width: `${palace.healthScore}%` }} />
          </div>
          <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
            <div>Health: {percent(palace.healthScore)}</div>
            <div>Trend: {formatTrendDirection(palace.trendDirection)}</div>
            <div>Reviews: {palace.reviewCount}</div>
            <div>Due: {palace.dueCount}</div>
            <div>Overdue: {palace.overdueCount}</div>
            <div>Weak items: {palace.weakItems}</div>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Hotspot: <span className="text-zinc-300">{palace.hotspotTitle ?? "none yet"}</span>
          </div>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={onOpen}>
          Open palace
        </Button>
      </div>
    </section>
  );
}
