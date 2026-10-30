import { useEffect } from "react";
import { Trophy, Zap } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import { formatStormTime } from "./StormBar";
import { Button } from "./ui/button";

function formatFirstReview(iso: string): string {
  const at = new Date(iso);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const time = at.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (at.toDateString() === new Date().toDateString()) return `today at ${time}`;
  if (at.toDateString() === tomorrow.toDateString()) return `tomorrow at ${time}`;
  return `${at.toLocaleDateString()} at ${time}`;
}

/** The result of a finished Storm, and how its material hands over to the daily reviews. */
export function StormSummaryModal() {
  const summary = usePalaceStore((s) => s.stormSummary);
  const dismiss = usePalaceStore((s) => s.dismissStormSummary);

  useEffect(() => {
    if (!summary) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismiss, summary]);

  if (!summary) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-label="Storm summary"
        className="w-full max-w-xl rounded-3xl border border-zinc-700 bg-zinc-950 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2 text-amber-200">
          <Zap className="h-5 w-5" />
          <div className="text-lg font-semibold">{summary.endedBy === "target" ? "Storm target reached" : "Storm ended"}</div>
        </div>
        <div className="mt-4 text-3xl font-semibold tabular-nums text-zinc-100" data-testid="storm-summary-count">
          {summary.count} <span className="text-base font-normal text-zinc-400">of {summary.target} encoded</span>
        </div>
        {summary.personalBest ? (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-amber-900/50 px-2 py-0.5 text-xs font-medium text-amber-200">
            <Trophy className="h-3.5 w-3.5" />
            Personal best
          </div>
        ) : null}
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">
            Active time: <span className="tabular-nums text-zinc-100">{formatStormTime(summary.activeMs)}</span>
          </div>
          <div className="rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-2">
            Rate: <span className="tabular-nums text-zinc-100">{summary.ratePerHour !== null ? `${Math.round(summary.ratePerHour)} per hour` : "—"}</span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {summary.count > 0 && summary.firstReviewAt ? (
            <>
              The {summary.count} {summary.count === 1 ? "node is a stop" : "nodes are stops"} on{" "}
              <span className="text-zinc-100">{summary.routeName}</span>, first due{" "}
              <span className="text-zinc-100">{formatFirstReview(summary.firstReviewAt)}</span>, after you have slept on
              them. From there the daily reviews take over.
            </>
          ) : (
            <>Nothing was encoded, so there is nothing new to review.</>
          )}
        </p>
        <div className="mt-5 flex justify-end">
          <Button type="button" onClick={dismiss}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
