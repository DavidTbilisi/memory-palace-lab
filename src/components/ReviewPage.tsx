import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Clock3,
  Footprints,
  Layers3,
} from "lucide-react";
import { startReviewAt } from "../app/reviewNavigation";
import type { GlobalDueItem } from "../domain/services/dueQueue";
import { usePalaceStore } from "../store/palaceStore";
import { useDueQueue } from "./hooks/useDueQueue";
import { Button } from "./ui/button";

type Props = {
  onOpenPalaceWorkspace: () => void;
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

export function ReviewPage({ onOpenPalaceWorkspace }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const {
    items: dueItems,
    loading: loadingDue,
    streak,
    reviewedToday,
    dailyReviewGoal,
    goalProgress,
  } = useDueQueue();
  const [palaceFilter, setPalaceFilter] = useState("all");

  const filteredDueItems = useMemo(() => {
    if (palaceFilter === "all") return dueItems;
    return dueItems.filter((item) => item.palaceId === palaceFilter);
  }, [dueItems, palaceFilter]);

  const topRoute = filteredDueItems[0] ?? null;

  const startDueReview = (item: GlobalDueItem) =>
    startReviewAt({
      palaceId: item.palaceId,
      routeId: item.routeId,
      locusId: item.locusId,
      nodeId: item.nodeId,
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Footprints className="h-4 w-4" />
          Global Review Queue
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Due loci are aggregated across all palaces. Start from the top and the
          app will open the correct palace automatically before walk mode
          starts.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {topRoute ? (
            <Button type="button" onClick={() => void startDueReview(topRoute)}>
              <ArrowRight className="h-4 w-4" />
              Start top due review
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenPalaceWorkspace}
          >
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
          <StatCard
            label="Total Due"
            value={String(filteredDueItems.length)}
            icon={<Layers3 className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Streak"
            value={`${streak} day${streak === 1 ? "" : "s"}`}
            icon={<Activity className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Today Reviewed"
            value={String(reviewedToday)}
            icon={<Footprints className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Daily Goal"
            value={`${reviewedToday}/${dailyReviewGoal}`}
            icon={<Clock3 className="h-3.5 w-3.5" />}
          />
        </div>

        <section className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
            <span>Daily goal progress</span>
            <span>
              {reviewedToday}/{dailyReviewGoal}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-violet-400 transition-all"
              style={{ width: `${Math.round(goalProgress * 100)}%` }}
            />
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
                No due loci right now. Review activity will appear here as items
                become due.
              </div>
            ) : (
              filteredDueItems.map((item) => (
                <div
                  key={`${item.palaceId}:${item.locusId}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-medium text-zinc-100">
                        {item.locusLabel || item.nodeTitle}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {item.palaceName} | {item.routeName} | {item.nodeTitle}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Due {new Date(item.nextReviewAt).toLocaleDateString()}{" "}
                        {new Date(item.nextReviewAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void startDueReview(item)}
                    >
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
