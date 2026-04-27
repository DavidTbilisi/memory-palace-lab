import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, ArrowRight, Clock3, Footprints, Layers3 } from "lucide-react";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { Button } from "./ui/button";
import { usePalaceStore } from "../store/palaceStore";
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";
import { computeDailyStreak, countReviewedToday } from "../domain/services/reviewMetrics";
import { orderedLoci } from "../domain/services/walkService";

type Props = {
  onStartRouteReview: (routeId: string) => void;
  onOpenPalaceWorkspace: () => void;
};

type GlobalDueItem = {
  palaceId: string;
  palaceName: string;
  routeId: string;
  routeName: string;
  nodeId: string;
  locusId: string;
  locusLabel: string;
  nodeTitle: string;
  nextReviewAt: string;
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

const repo = getPalaceRepository();

export function ReviewPage({ onStartRouteReview, onOpenPalaceWorkspace }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const nodes = usePalaceStore((s) => s.nodes);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const setWalkRecallMode = usePalaceStore((s) => s.setWalkRecallMode);
  const setWalkCueOnly = usePalaceStore((s) => s.setWalkCueOnly);
  const dailyReviewGoal = usePalaceStore((s) => s.dailyReviewGoal);

  const [dueItems, setDueItems] = useState<GlobalDueItem[]>([]);
  const [loadingDue, setLoadingDue] = useState(false);
  const [palaceFilter, setPalaceFilter] = useState("all");

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  useEffect(() => {
    let cancelled = false;
    const nowIso = new Date().toISOString();
    const nowMs = Date.parse(nowIso);
    async function loadDueQueue() {
      setLoadingDue(true);
      const result: GlobalDueItem[] = [];
      for (const palace of palaces) {
        const snapshot =
          currentPalace?.id === palace.id
            ? { palace, routes, loci, nodes }
            : await repo.loadPalace(palace.id).then((loaded) => {
                if (!loaded) return null;
                return {
                  palace: loaded.palace,
                  routes: loaded.routes,
                  loci: loaded.loci,
                  nodes: loaded.nodes,
                };
              });
        if (!snapshot) continue;
        const routeById = new Map(snapshot.routes.map((route) => [route.id, route]));
        const nodeById = new Map(snapshot.nodes.map((node) => [node.id, node]));
        for (const locus of snapshot.loci.map((entry) => normalizeLocusSchedule(entry, nowIso))) {
          const nextReviewAt = locus.nextReviewAt ?? nowIso;
          if (Date.parse(nextReviewAt) > nowMs) continue;
          const route = routeById.get(locus.routeId);
          if (!route) continue;
          const node = nodeById.get(locus.nodeId);
          result.push({
            palaceId: snapshot.palace.id,
            palaceName: snapshot.palace.name,
            routeId: route.id,
            routeName: route.name,
            nodeId: locus.nodeId,
            locusId: locus.id,
            locusLabel: locus.label,
            nodeTitle: node?.title?.trim() || "Untitled node",
            nextReviewAt,
          });
        }
      }
      if (cancelled) return;
      setDueItems(
        result.sort((a, b) => {
          const dueCmp = Date.parse(a.nextReviewAt) - Date.parse(b.nextReviewAt);
          if (dueCmp !== 0) return dueCmp;
          if (a.palaceName !== b.palaceName) return a.palaceName.localeCompare(b.palaceName);
          if (a.routeName !== b.routeName) return a.routeName.localeCompare(b.routeName);
          return a.nodeTitle.localeCompare(b.nodeTitle);
        }),
      );
      setLoadingDue(false);
    }
    if (palaces.length === 0) {
      setDueItems([]);
      return;
    }
    void loadDueQueue();
    return () => {
      cancelled = true;
    };
  }, [currentPalace?.id, loci, nodes, palaces, routes]);

  const filteredDueItems = useMemo(() => {
    if (palaceFilter === "all") return dueItems;
    return dueItems.filter((item) => item.palaceId === palaceFilter);
  }, [dueItems, palaceFilter]);

  const reviewedToday = useMemo(() => countReviewedToday(analyticsEvents), [analyticsEvents]);
  const streak = useMemo(() => computeDailyStreak(analyticsEvents), [analyticsEvents]);
  const goalProgress = Math.min(1, reviewedToday / Math.max(1, dailyReviewGoal));
  const topRoute = filteredDueItems[0] ?? null;

  const startDueReview = async (item: GlobalDueItem) => {
    if (currentPalace?.id !== item.palaceId) {
      await openPalace(item.palaceId);
    }
    const state = usePalaceStore.getState();
    setWalkRoute(item.routeId);
    setWalkRecallMode(true);
    setWalkCueOnly(true);
    setWalkOpen(true);
    const routeLoci = orderedLoci(state.loci.filter((locus) => locus.routeId === item.routeId));
    const targetIndex = routeLoci.findIndex((locus) => locus.id === item.locusId || locus.nodeId === item.nodeId);
    if (targetIndex >= 0) {
      usePalaceStore.setState({ walkIndex: targetIndex });
    }
    onStartRouteReview(item.routeId);
    onOpenPalaceWorkspace();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Footprints className="h-4 w-4" />
          Global Review Queue
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Due loci are aggregated across all palaces. Start from the top and the app will open the correct palace
          automatically before walk mode starts.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {topRoute ? (
            <Button type="button" onClick={() => void startDueReview(topRoute)}>
              <ArrowRight className="h-4 w-4" />
              Start top due review
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={onOpenPalaceWorkspace}>
            Back to palace
          </Button>
          <div className="ml-auto">
            <select
              value={palaceFilter}
              onChange={(event) => setPalaceFilter(event.target.value)}
              className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs text-zinc-100"
              aria-label="Filter review queue by palace"
            >
              <option value="all">All palaces</option>
              {palaces.map((palace) => (
                <option key={palace.id} value={palace.id}>
                  {palace.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard label="Total Due" value={String(filteredDueItems.length)} icon={<Layers3 className="h-3.5 w-3.5" />} />
          <StatCard label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} icon={<Activity className="h-3.5 w-3.5" />} />
          <StatCard label="Today Reviewed" value={String(reviewedToday)} icon={<Footprints className="h-3.5 w-3.5" />} />
          <StatCard label="Daily Goal" value={`${reviewedToday}/${dailyReviewGoal}`} icon={<Clock3 className="h-3.5 w-3.5" />} />
        </div>

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
            <span>Daily goal progress</span>
            <span>
              {reviewedToday}/{dailyReviewGoal}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full bg-violet-400 transition-all" style={{ width: `${Math.round(goalProgress * 100)}%` }} />
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {reviewedToday >= dailyReviewGoal
              ? "Goal reached. Solid consistency."
              : streak === 0
                ? "Start your streak again today."
                : "Keep the chain alive today."}
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="text-sm font-semibold text-zinc-100">Due Loci</div>
          <div className="mt-4 space-y-3">
            {loadingDue ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-sm text-zinc-500">
                Loading global review queue...
              </div>
            ) : filteredDueItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-sm text-zinc-500">
                No due loci right now. Review activity will appear here as items become due.
              </div>
            ) : (
              filteredDueItems.map((item) => (
                <div key={`${item.palaceId}:${item.locusId}`} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-medium text-zinc-100">{item.locusLabel || item.nodeTitle}</div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {item.palaceName} | {item.routeName} | {item.nodeTitle}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Due {new Date(item.nextReviewAt).toLocaleDateString()} {new Date(item.nextReviewAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <Button type="button" size="sm" onClick={() => void startDueReview(item)}>
                      Review now
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
