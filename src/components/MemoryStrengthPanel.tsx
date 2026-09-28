import { useEffect, useMemo, type ReactNode } from "react";
import { Activity, AlertTriangle, Castle, Gauge, LineChart, Route, Target } from "lucide-react";
import { requestNavigation } from "../app/navigationEvents";
import { startReviewAt } from "../app/reviewNavigation";
import { NEDF_SLOT_LABELS } from "../domain/services/nedf";
import {
  buildMemoryStrengthDashboard,
  formatDashboardUrgency,
  formatRouteFrictionStatus,
  formatStrengthState,
  formatTrendDirection,
  type DashboardUrgency,
  type MemoryStrengthDashboard,
  type PalaceHealthItem,
  type RouteFrictionItem,
  type RouteFrictionStatus,
  type StopStrengthItem,
  type TrendDirection,
} from "../domain/services/memoryStrengthService";
import { usePalaceStore } from "../store/palaceStore";
import { StatCard } from "./analytics/StatCard";
import { useDueQueue } from "./hooks/useDueQueue";

const SECTION = "mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3";
const ROW_BUTTON =
  "flex w-full items-center gap-3 rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-left transition hover:border-violet-500/60 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400";

const URGENCY_BADGE: Record<DashboardUrgency, string> = {
  critical: "border-rose-700/70 bg-rose-950/40 text-rose-200",
  weak: "border-amber-700/70 bg-amber-950/40 text-amber-200",
  stable: "border-zinc-700 bg-zinc-900 text-zinc-300",
  strong: "border-emerald-700/70 bg-emerald-950/40 text-emerald-200",
};

const FRICTION_BADGE: Record<RouteFrictionStatus, string> = {
  cognitively_expensive: "border-rose-700/70 bg-rose-950/40 text-rose-200",
  unstable: "border-amber-700/70 bg-amber-950/40 text-amber-200",
  steady: "border-emerald-700/70 bg-emerald-950/40 text-emerald-200",
};

const TREND_TONE: Record<TrendDirection, string> = {
  improving: "text-emerald-300",
  stagnating: "text-zinc-200",
  decaying: "text-rose-300",
  insufficient: "text-zinc-400",
};

function Badge({ className, children }: { className: string; children: string }) {
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}>{children}</span>
  );
}

function SectionHeading({ icon, title, note }: { icon: ReactNode; title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
        {icon}
        {title}
      </div>
      {note ? <div className="text-xs text-zinc-500">{note}</div> : null}
    </div>
  );
}

function Empty({ children }: { children: string }) {
  return <p className="mt-2 text-xs text-zinc-500">{children}</p>;
}

function signed(delta: number | null) {
  if (delta === null) return "–";
  return delta > 0 ? `+${delta}` : String(delta);
}

function NeedsAttention({ items, onStart }: { items: StopStrengthItem[]; onStart: (item: StopStrengthItem) => void }) {
  return (
    <section aria-label="Needs attention" className={SECTION}>
      <SectionHeading
        icon={<Target className="h-4 w-4 text-rose-300" />}
        title="Needs attention"
        note="Weakest stops first; click one to review it now"
      />
      {items.length === 0 ? (
        <Empty>No stops in review yet. Add nodes to a route to start tracking their strength.</Empty>
      ) : (
        <ol className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item.locusId}>
              <button
                type="button"
                data-testid="strength-stop"
                className={ROW_BUTTON}
                title={`Start a recall walk at ${item.title}`}
                onClick={() => onStart(item)}
              >
                <Badge className={URGENCY_BADGE[item.urgency]}>{formatDashboardUrgency(item.urgency)}</Badge>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-zinc-100">
                    {item.title}
                    {item.slot ? <span className="text-zinc-400"> · {NEDF_SLOT_LABELS[item.slot]}</span> : null}
                  </div>
                  <div className="truncate text-xs text-zinc-500">
                    {item.routeName} · {item.palaceName}
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs text-zinc-400">
                  <div>{formatStrengthState(item.state)}</div>
                  <div className="tabular-nums text-zinc-500">
                    {item.latestRating ? `last: ${item.latestRating}` : "no rating"} · {item.strengthScore}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function PalaceHealth({ items, onOpen }: { items: PalaceHealthItem[]; onOpen: (palaceId: string) => void }) {
  return (
    <section aria-label="Palace health" className={SECTION}>
      <SectionHeading
        icon={<Castle className="h-4 w-4 text-violet-300" />}
        title="Palace health"
        note="Strength, review load, and failure hotspots"
      />
      {items.length === 0 ? (
        <Empty>No palaces yet.</Empty>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item.palaceId}>
              <button
                type="button"
                data-testid="strength-palace"
                className={ROW_BUTTON}
                title={`Open ${item.palaceName}`}
                onClick={() => onOpen(item.palaceId)}
              >
                <div className="w-12 shrink-0 text-center text-xl font-semibold tabular-nums text-zinc-100">
                  {item.healthScore ?? "–"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-zinc-100">{item.palaceName}</div>
                  <div className="truncate text-xs text-zinc-500">
                    {item.totalTrackedItems} {item.totalTrackedItems === 1 ? "stop" : "stops"} · {item.dueCount} due ·{" "}
                    {item.overdueCount} overdue · {item.weakItems} weak
                    {item.hotspotTitle ? ` · hotspot: ${item.hotspotTitle}` : ""}
                  </div>
                </div>
                <div className={`shrink-0 text-xs ${TREND_TONE[item.trendDirection]}`}>
                  {formatTrendDirection(item.trendDirection)}
                  {item.trendDelta !== null ? ` (${signed(item.trendDelta)})` : ""}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Trend({ dashboard }: { dashboard: MemoryStrengthDashboard }) {
  const { trendDirection, trendDelta, trendRecentScore, trendPreviousScore } = dashboard.overview;
  const reviews = dashboard.trend.reduce((total, point) => total + point.reviewCount, 0);
  return (
    <section aria-label="Trend" className={SECTION}>
      <SectionHeading
        icon={<LineChart className="h-4 w-4 text-sky-300" />}
        title="Trend"
        note={`Last ${dashboard.trend.length} days · Siege reviews only`}
      />
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <div data-testid="strength-trend-verdict" className={`text-xl font-semibold ${TREND_TONE[trendDirection]}`}>
          {formatTrendDirection(trendDirection)}
        </div>
        <div className="text-xs text-zinc-400 tabular-nums">
          {trendDirection === "insufficient"
            ? "Needs reviews on at least four days to compare."
            : `Recent days ${trendRecentScore} vs earlier ${trendPreviousScore} (${signed(trendDelta)})`}
        </div>
      </div>
      {reviews === 0 ? (
        <Empty>No reviews in this window yet.</Empty>
      ) : (
        <div role="img" aria-label="Average recall score per day" className="mt-3 flex h-20 items-end gap-1.5">
          {dashboard.trend.map((point) => (
            <div key={point.dayKey} className="flex flex-1 flex-col items-center gap-1" title={`${point.label}: ${point.reviewCount} reviews`}>
              <div
                className={`w-full rounded-sm ${point.averageScore === null ? "bg-zinc-800" : "bg-sky-500/70"}`}
                style={{ height: `${Math.max(4, point.averageScore ?? 4) * 0.56}px` }}
              />
              <div className="text-[10px] text-zinc-500">{point.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RouteFriction({ items, onStart }: { items: RouteFrictionItem[]; onStart: (item: RouteFrictionItem) => void }) {
  return (
    <section aria-label="Route friction" className={SECTION}>
      <SectionHeading
        icon={<Route className="h-4 w-4 text-amber-300" />}
        title="Route friction"
        note="Routes that cause hesitation or failure; click one to walk it"
      />
      {items.length === 0 ? (
        <Empty>No rated walks yet. Friction shows once a route has recall ratings.</Empty>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item.routeId}>
              <button
                type="button"
                data-testid="strength-route"
                className={ROW_BUTTON}
                title={`Walk ${item.routeName}`}
                onClick={() => onStart(item)}
              >
                <Badge className={FRICTION_BADGE[item.status]}>{formatRouteFrictionStatus(item.status)}</Badge>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-zinc-100">
                    {item.routeName} <span className="text-zinc-500">· {item.palaceName}</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    {item.reasons.length > 0 ? item.reasons.join(" · ") : "Recalled smoothly"}
                  </div>
                </div>
                <div className="shrink-0 text-right text-xs tabular-nums text-zinc-500">
                  <div>friction {item.frictionScore}</div>
                  <div>
                    {item.attemptCount} {item.attemptCount === 1 ? "rating" : "ratings"}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export type StrengthDashboardViewProps = {
  dashboard: MemoryStrengthDashboard;
  onStartStop: (item: StopStrengthItem) => void;
  onStartRoute: (item: RouteFrictionItem) => void;
  onOpenPalace: (palaceId: string) => void;
};

/** The Strength tab's body for a computed dashboard. */
export function StrengthDashboardView({ dashboard, onStartStop, onStartRoute, onOpenPalace }: StrengthDashboardViewProps) {
  const { overview } = dashboard;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Gauge className="h-4 w-4" />
          Memory strength
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Which stops are weak or overdue, how each palace is holding up, whether recall is improving, and which routes
          cost the most effort. Built from your daily (Siege) review ratings; Storm reviews are left out.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        {overview.siegeRatings === 0 ? (
          <p
            data-testid="strength-no-history"
            className="mb-3 rounded-md border border-violet-800/60 bg-violet-950/30 p-3 text-xs text-violet-100"
          >
            No review history yet. Walk a route recall-first and rate each stop; strength, trend, and friction build up
            from those ratings.
          </p>
        ) : null}
        <div className="grid gap-3 md:grid-cols-4">
          <StatCard icon={<Activity className="h-3.5 w-3.5" />} label="Due stops" value={String(overview.totalDue)} tone="violet" />
          <StatCard icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Overdue" value={String(overview.totalOverdue)} />
          <StatCard
            icon={<Gauge className="h-3.5 w-3.5" />}
            label="Avg strength"
            value={overview.averageStrength === null ? "n/a" : String(overview.averageStrength)}
            tone="emerald"
          />
          <StatCard icon={<LineChart className="h-3.5 w-3.5" />} label="Review sessions" value={String(overview.reviewSessions)} />
        </div>
        <NeedsAttention items={dashboard.actionItems} onStart={onStartStop} />
        <div className="grid gap-x-3 lg:grid-cols-2">
          <PalaceHealth items={dashboard.palaceHealth} onOpen={onOpenPalace} />
          <Trend dashboard={dashboard} />
        </div>
        <RouteFriction items={dashboard.routeFriction} onStart={onStartRoute} />
      </div>
    </div>
  );
}

/** Insights › Strength: memory strength across every palace, driving straight into review. */
export function MemoryStrengthPanel() {
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const currentPalaceId = usePalaceStore((s) => s.currentPalace?.id ?? null);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const { snapshots } = useDueQueue();

  useEffect(() => {
    if (!analyticsLoaded) void loadAnalyticsEvents();
  }, [analyticsLoaded, loadAnalyticsEvents]);

  const dashboard = useMemo(
    () => buildMemoryStrengthDashboard({ snapshots, analyticsEvents }),
    [snapshots, analyticsEvents],
  );

  return (
    <StrengthDashboardView
      dashboard={dashboard}
      onStartStop={(item) =>
        void startReviewAt({
          palaceId: item.palaceId,
          routeId: item.routeId,
          locusId: item.locusId,
          nodeId: item.nodeId,
          slot: item.slot,
        })
      }
      onStartRoute={(item) => void startReviewAt({ palaceId: item.palaceId, routeId: item.routeId })}
      onOpenPalace={async (palaceId) => {
        if (currentPalaceId !== palaceId) await openPalace(palaceId);
        requestNavigation("graph");
      }}
    />
  );
}
