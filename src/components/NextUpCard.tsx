import { useState } from "react";
import { ArrowRight, Footprints, X } from "lucide-react";
import { requestNavigation } from "../app/navigationEvents";
import { startReviewAt } from "../app/reviewNavigation";
import { usePalaceStore } from "../store/palaceStore";
import { useDueQueue } from "./hooks/useDueQueue";
import { Button } from "./ui/button";

const DISMISSED_KEY = "mp-next-up-dismissed";

function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

function writeDismissed() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
  } catch {
    // ignore
  }
}

export function describeDue(nextReviewAt: string, nowMs = Date.now()): string {
  const days = Math.floor((nowMs - Date.parse(nextReviewAt)) / 86_400_000);
  if (days <= 0) return "due now";
  return `overdue ${days} day${days === 1 ? "" : "s"}`;
}

/**
 * A one-line strip on the graph page showing the next due locus across every
 * palace, so a review is one click away from where the user already is.
 */
export function NextUpCard() {
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const appMode = usePalaceStore((s) => s.appMode);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const { items, dueCountAll } = useDueQueue();
  const [dismissed, setDismissed] = useState(() => readDismissed());

  if (dismissed || walkOpen || appMode === "comprehend" || items.length === 0) return null;
  const next = items[0];
  const remaining = dueCountAll - 1;
  const elsewhere = currentPalace?.id !== next.palaceId;

  return (
    <div
      data-testid="next-up-card"
      role="status"
      className="flex flex-wrap items-center gap-2 border-b border-zinc-800 bg-violet-950/30 px-3 py-1.5 text-xs text-zinc-300"
    >
      <Footprints className="h-3.5 w-3.5 text-violet-300" />
      <span className="font-semibold uppercase tracking-wide text-violet-300">Next up</span>
      <span className="min-w-0 truncate">
        <span className="text-zinc-100">{next.routeName}</span> · {next.locusLabel || next.nodeTitle}
        {elsewhere ? <span className="text-zinc-500"> · {next.palaceName}</span> : null}
        <span className="text-zinc-500"> · {describeDue(next.nextReviewAt)}</span>
        {remaining > 0 ? <span className="text-zinc-500"> · {remaining} more due</span> : null}
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Button
          size="sm"
          type="button"
          onClick={() =>
            void startReviewAt({
              palaceId: next.palaceId,
              routeId: next.routeId,
              locusId: next.locusId,
              nodeId: next.nodeId,
            })
          }
        >
          <ArrowRight className="h-3.5 w-3.5" />
          Start
        </Button>
        <Button size="sm" type="button" variant="ghost" onClick={() => requestNavigation("review")}>
          See all
        </Button>
        <Button
          size="icon"
          type="button"
          variant="ghost"
          aria-label="Hide next up for this session"
          onClick={() => {
            writeDismissed();
            setDismissed(true);
          }}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
