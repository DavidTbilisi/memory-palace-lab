import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Lightbulb, Link2, RefreshCw, Scale } from "lucide-react";
import { requestNavigation } from "../app/navigationEvents";
import { buildInterventions, INTERVENTION_LABELS, type Intervention, type InterventionKind } from "../domain/services/interventions";
import { confusionHotspots } from "../domain/services/memoryStrengthService";
import { usePalaceStore } from "../store/palaceStore";
import { launchIntervention } from "../system/interventions";
import { useDueQueue } from "./hooks/useDueQueue";
import { Button } from "./ui/button";

/** Every suggestion across all palaces, most urgent first, from the same data as the Strength tab. */
export function useInterventions(): Intervention[] {
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const analyticsLoaded = usePalaceStore((s) => s.analyticsLoaded);
  const loadAnalyticsEvents = usePalaceStore((s) => s.loadAnalyticsEvents);
  const { snapshots } = useDueQueue();

  useEffect(() => {
    if (!analyticsLoaded) void loadAnalyticsEvents();
  }, [analyticsLoaded, loadAnalyticsEvents]);

  return useMemo(
    () =>
      buildInterventions({
        snapshots,
        analyticsEvents,
        hotspots: confusionHotspots(snapshots, analyticsEvents),
      }),
    [snapshots, analyticsEvents],
  );
}

const ICONS: Record<InterventionKind, typeof RefreshCw> = {
  "re-encode": RefreshCw,
  "link-confusion": Link2,
  "add-distinguisher": Scale,
};

function subject(intervention: Intervention): string {
  return intervention.kind === "link-confusion"
    ? `${intervention.nodes[0].title} and ${intervention.nodes[1].title}`
    : intervention.title;
}

function InterventionRow({ intervention, onAct }: { intervention: Intervention; onAct: (i: Intervention) => void }) {
  const Icon = ICONS[intervention.kind];
  return (
    <li
      data-testid="intervention"
      data-kind={intervention.kind}
      className="flex items-start gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-2.5 py-2"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-zinc-100">
          {subject(intervention)}
          <span className="text-xs text-zinc-500"> · {intervention.palaceName}</span>
        </div>
        <p className="text-xs leading-5 text-zinc-400">{intervention.reason}</p>
      </div>
      <Button size="sm" variant="secondary" type="button" className="shrink-0" onClick={() => onAct(intervention)}>
        {INTERVENTION_LABELS[intervention.kind]}
      </Button>
    </li>
  );
}

/** Run a suggestion and keep any line it reports for the learner. */
function useLaunch() {
  const [notice, setNotice] = useState<string | null>(null);
  const act = (intervention: Intervention) => {
    setNotice(null);
    void launchIntervention(intervention).then(setNotice);
  };
  return { notice, act };
}

/** Insights › Strength: every suggestion, most urgent first. */
export function SuggestedInterventions({ items }: { items: Intervention[] }) {
  const { notice, act } = useLaunch();
  return (
    <section aria-label="Suggested next" className="mt-3 rounded-md border border-amber-900/50 bg-amber-950/10 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
        <Lightbulb className="h-3.5 w-3.5" />
        Suggested next
      </div>
      <p className="mt-1 text-xs leading-5 text-zinc-400">
        Where reviewing again is not enough: a node that keeps failing needs a new image, and two nodes you keep mixing
        up need telling apart.
      </p>
      {items.length === 0 ? (
        <p data-testid="interventions-empty" className="mt-2 text-xs text-zinc-500">
          Nothing to fix right now.
        </p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {items.map((intervention) => (
            <InterventionRow key={intervention.id} intervention={intervention} onAct={act} />
          ))}
        </ul>
      )}
      {notice ? (
        <p role="status" className="mt-2 text-xs text-emerald-300">
          {notice}
        </p>
      ) : null}
    </section>
  );
}

/** The Review page's top card: the most urgent suggestion, when there is one. */
export function TopIntervention() {
  const items = useInterventions();
  const { notice, act } = useLaunch();
  const top = items[0];
  if (!top && !notice) return null;
  return (
    <section aria-label="Fix first" className="mt-4 rounded-md border border-amber-900/50 bg-amber-950/10 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
        <Lightbulb className="h-3.5 w-3.5" />
        Fix first
        {items.length > 1 ? (
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-zinc-400 hover:text-zinc-100"
            onClick={() => requestNavigation("strength")}
          >
            All {items.length} suggestions
            <ArrowRight className="h-3 w-3" />
          </button>
        ) : null}
      </div>
      {top ? (
        <ul className="mt-2">
          <InterventionRow intervention={top} onAct={act} />
        </ul>
      ) : null}
      {notice ? (
        <p role="status" className="mt-2 text-xs text-emerald-300">
          {notice}
        </p>
      ) : null}
    </section>
  );
}

/** Over the canvas while a node is re-encoded: what to do, and Done, which restarts its schedule. */
export function ReEncodeBanner() {
  const reEncoding = usePalaceStore((s) => s.reEncoding);
  const currentPalaceId = usePalaceStore((s) => s.currentPalace?.id ?? null);
  const finishReEncode = usePalaceStore((s) => s.finishReEncode);
  const cancelReEncode = usePalaceStore((s) => s.cancelReEncode);
  const setFocusNodeId = usePalaceStore((s) => s.setFocusNodeId);
  if (!reEncoding || reEncoding.palaceId !== currentPalaceId) return null;
  return (
    <div
      role="region"
      aria-label="Re-encoding"
      data-testid="re-encode-banner"
      className="flex flex-wrap items-center gap-2 border-b border-amber-900/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-100"
    >
      <RefreshCw className="h-3.5 w-3.5 text-amber-300" />
      <span className="min-w-0 flex-1">
        Re-encoding <button type="button" className="font-semibold underline-offset-2 hover:underline" onClick={() => setFocusNodeId(reEncoding.nodeId)}>{reEncoding.title}</button>:
        give it a new, more vivid image, or rework its NEDF slots. Done restarts its review schedule as a new memory.
      </span>
      <Button size="sm" type="button" onClick={() => finishReEncode()}>
        Done
      </Button>
      <Button size="sm" variant="ghost" type="button" onClick={() => cancelReEncode()}>
        Cancel
      </Button>
    </div>
  );
}
