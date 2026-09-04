import { useEffect, useMemo } from "react";
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { computeDailyStreak, countReviewedToday } from "../domain/services/reviewMetrics";
import { startReviewAt } from "../app/reviewNavigation";
import { useDueQueue } from "./hooks/useDueQueue";

type Props = {
  onReviewAnother: () => void;
  onBackToPalace: () => void;
};

export function SessionSummaryModal({ onReviewAnother, onBackToPalace }: Props) {
  const walkSummary = usePalaceStore((s) => s.walkSummary);
  const dismissWalkSummary = usePalaceStore((s) => s.dismissWalkSummary);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const dailyReviewGoal = usePalaceStore((s) => s.dailyReviewGoal);
  const { items: dueItems } = useDueQueue();
  const nextDue = dueItems.find((item) => item.routeId !== walkSummary?.routeId) ?? dueItems[0] ?? null;

  const streak = useMemo(() => computeDailyStreak(analyticsEvents), [analyticsEvents]);
  const reviewedToday = useMemo(() => countReviewedToday(analyticsEvents), [analyticsEvents]);

  useEffect(() => {
    if (!walkSummary) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissWalkSummary();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismissWalkSummary, walkSummary]);

  if (!walkSummary) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 text-violet-200">
          <CheckCircle2 className="h-5 w-5" />
          <div className="text-lg font-semibold">Session Summary</div>
        </div>
        <div className="mt-4 text-sm text-zinc-300">
          Route: <span className="text-zinc-100">{walkSummary.routeName}</span>
        </div>
        <div className="mt-1 text-sm text-zinc-300">
          {walkSummary.reviewedCount} loci reviewed
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">Again: {walkSummary.ratings.again}</div>
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">Hard: {walkSummary.ratings.hard}</div>
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">Good: {walkSummary.ratings.good}</div>
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">Easy: {walkSummary.ratings.easy}</div>
        </div>
        <div className="mt-3 text-sm text-zinc-300">
          Next review for this route:{" "}
          <span className="text-zinc-100">
            {walkSummary.nextReviewAt ? new Date(walkSummary.nextReviewAt).toLocaleDateString() : "Not scheduled yet"}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-amber-300">
          <Trophy className="h-4 w-4" />
          {streak}-day streak • {reviewedToday}/{dailyReviewGoal} today
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              dismissWalkSummary();
              if (nextDue) {
                void startReviewAt({
                  palaceId: nextDue.palaceId,
                  routeId: nextDue.routeId,
                  locusId: nextDue.locusId,
                  nodeId: nextDue.nodeId,
                });
                return;
              }
              onReviewAnother();
            }}
          >
            <ArrowRight className="h-4 w-4" />
            {nextDue ? "Review next due" : "Review another route"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              dismissWalkSummary();
              onBackToPalace();
            }}
          >
            Back to palace
          </Button>
          <Button type="button" onClick={dismissWalkSummary}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
