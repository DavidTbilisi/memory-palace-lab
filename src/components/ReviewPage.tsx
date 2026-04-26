import { useEffect, useMemo, type ReactNode } from "react";
import { Activity, ArrowRight, Clock3, Footprints, Layers3 } from "lucide-react";
import { buildReviewQueue } from "../domain/services/reviewQueue";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

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

type Props = {
  onStartRouteReview: (routeId: string) => void;
  onOpenPalaceWorkspace: () => void;
};

export function ReviewPage({ onStartRouteReview, onOpenPalaceWorkspace }: Props) {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const nodes = usePalaceStore((s) => s.nodes);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);

  useEffect(() => {
    if (!analyticsLoaded) {
      void loadAnalyticsEvents();
    }
  }, [analyticsLoaded, loadAnalyticsEvents]);

  const reviewQueue = useMemo(
    () =>
      buildReviewQueue({
        currentPalaceId: currentPalace?.id,
        routes,
        loci,
        nodes,
        analyticsEvents,
      }),
    [analyticsEvents, currentPalace?.id, loci, nodes, routes],
  );

  if (!currentPalace) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-xl rounded-[32px] border border-zinc-800 bg-zinc-900/40 p-6 text-center">
          <div className="text-xl font-semibold text-zinc-100">Review needs an active palace</div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Open a palace first so the queue can derive routes, loci, and recent retrieval signals.
          </p>
          <div className="mt-5">
            <Button type="button" onClick={onOpenPalaceWorkspace}>
              Open palace workspace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const topRoute = reviewQueue.queue.find((item) => item.locusCount > 0) ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Footprints className="h-4 w-4" />
          Review
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Retrieval work lives here. The queue is built from routes, loci, and your recent recall ratings so weak or
          untouched paths rise to the top.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {topRoute ? (
            <Button type="button" onClick={() => onStartRouteReview(topRoute.routeId)}>
              <ArrowRight className="h-4 w-4" />
              Start top review
            </Button>
          ) : null}
          <Button type="button" variant="secondary" onClick={onOpenPalaceWorkspace}>
            Back to palace
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <StatCard
            label="Reviewable routes"
            value={String(reviewQueue.summary.reviewableRoutes)}
            icon={<Layers3 className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Total loci"
            value={String(reviewQueue.summary.totalLoci)}
            icon={<Footprints className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Unseen loci"
            value={String(reviewQueue.summary.unseenNodes)}
            icon={<Clock3 className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Weak recall"
            value={String(reviewQueue.summary.weakNodes)}
            icon={<Activity className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="text-sm font-semibold text-zinc-100">Queue</div>
            <div className="mt-4 space-y-3">
              {reviewQueue.queue.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-6 text-sm text-zinc-500">
                  Create a route and add loci before the review queue can rank anything.
                </div>
              ) : (
                reviewQueue.queue.map((item) => (
                  <div key={item.routeId} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-medium text-zinc-100">{item.routeName}</div>
                        <div className="mt-1 text-sm text-zinc-400">{item.primaryReason}</div>
                      </div>
                      <div className="rounded-full border border-violet-500/40 bg-violet-950/30 px-3 py-1 text-xs font-medium text-violet-200">
                        Score {item.dueScore}
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-500">
                      <span>{item.locusCount} loci</span>
                      <span>{item.unseenCount} unseen</span>
                      <span>{item.weakCount} weak</span>
                      <span>{item.stableCount} stable</span>
                      <span>
                        {item.lastActivityAt
                          ? `Last activity ${new Date(item.lastActivityAt).toLocaleString()}`
                          : "No review activity yet"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Button type="button" size="sm" disabled={item.locusCount === 0} onClick={() => onStartRouteReview(item.routeId)}>
                        Review now
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-[28px] border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="text-sm font-semibold text-zinc-100">Weakest nodes</div>
              <div className="mt-4 space-y-2">
                {reviewQueue.weakestNodes.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-5 text-sm text-zinc-500">
                    Walk a route and grade recall to populate this list.
                  </div>
                ) : (
                  reviewQueue.weakestNodes.map((item) => (
                    <div key={`${item.nodeId}:${item.rating}`} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                      <div className="text-sm font-medium text-zinc-100">{item.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">{item.rating}</div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[28px] border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="text-sm font-semibold text-zinc-100">Recent walk sessions</div>
              <div className="mt-4 space-y-2">
                {reviewQueue.recentSessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-5 text-sm text-zinc-500">
                    No walk sessions recorded yet.
                  </div>
                ) : (
                  reviewQueue.recentSessions.map((session) => (
                    <div key={`${session.createdAt}:${session.routeId ?? "none"}:${session.source}`} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 px-4 py-3">
                      <div className="text-sm font-medium text-zinc-100">{session.routeName}</div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {session.source} | {new Date(session.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
