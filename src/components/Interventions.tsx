import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Lightbulb, Link2, RefreshCw, Scale, Scissors } from "lucide-react";
import { requestNavigation } from "../app/navigationEvents";
import { IMPACT_MIN_AFTER, formatRecall, measureInterventions } from "../domain/services/interventionImpact";
import { buildInterventions, INTERVENTION_LABELS, type Intervention, type InterventionKind } from "../domain/services/interventions";
import { buildMemoryStrengthDashboard } from "../domain/services/memoryStrengthService";
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

  return useMemo(() => {
    const dashboard = buildMemoryStrengthDashboard({ snapshots, analyticsEvents });
    return buildInterventions({
      snapshots,
      analyticsEvents,
      hotspots: dashboard.confusionHotspots,
      routeFriction: dashboard.routeFriction,
    });
  }, [snapshots, analyticsEvents]);
}

const ICONS: Record<InterventionKind, typeof RefreshCw> = {
  "re-encode": RefreshCw,
  "link-confusion": Link2,
  "add-distinguisher": Scale,
  "route-surgery": Scissors,
};

function subject(intervention: Intervention): string {
  if (intervention.kind === "link-confusion") return `${intervention.nodes[0].title} and ${intervention.nodes[1].title}`;
  if (intervention.kind === "route-surgery") return `Route ${intervention.routeName}`;
  return intervention.title;
}

function InterventionRow({ intervention, onAct }: { intervention: Intervention; onAct: (i: Intervention) => void }) {
  const Icon = ICONS[intervention.kind];
  // A route change is proposed, never made at once: the learner sees exactly what it does first.
  const [confirming, setConfirming] = useState(false);
  const act = () => (intervention.kind === "route-surgery" ? setConfirming(true) : onAct(intervention));
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
        {confirming && intervention.kind === "route-surgery" ? (
          <div role="group" aria-label="Proposed change" className="mt-1.5 rounded border border-amber-800/60 bg-zinc-950 p-2">
            <p className="text-xs leading-5 text-amber-100">{intervention.proposal}</p>
            <p className="text-[11px] leading-4 text-zinc-500">Stops keep their review schedules. Undo puts it back.</p>
            <div className="mt-1.5 flex gap-1.5">
              <Button
                size="sm"
                type="button"
                onClick={() => {
                  setConfirming(false);
                  onAct(intervention);
                }}
              >
                Apply
              </Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      {confirming ? null : (
        <Button size="sm" variant="secondary" type="button" className="shrink-0" onClick={act}>
          {INTERVENTION_LABELS[intervention.kind]}
        </Button>
      )}
    </li>
  );
}

/** Run a suggestion and keep any line it reports for the learner, with Undo after a route change. */
function useLaunch() {
  const [notice, setNotice] = useState<string | null>(null);
  const [undoable, setUndoable] = useState(false);
  const undoRouteSurgery = usePalaceStore((s) => s.undoRouteSurgery);
  const act = (intervention: Intervention) => {
    setNotice(null);
    setUndoable(false);
    const before = usePalaceStore.getState().routeSurgeryUndo;
    void launchIntervention(intervention).then((message) => {
      setNotice(message);
      const after = usePalaceStore.getState().routeSurgeryUndo;
      setUndoable(intervention.kind === "route-surgery" && after !== null && after !== before);
    });
  };
  const undo = () => {
    setUndoable(false);
    setNotice(undoRouteSurgery() ? "Undone: the route is back as it was." : "Nothing to undo in the open palace.");
  };
  return { notice, act, undoable, undo };
}

function Notice({ notice, undoable, undo }: { notice: string | null; undoable: boolean; undo: () => void }) {
  if (!notice) return null;
  return (
    <p role="status" className="mt-2 flex flex-wrap items-center gap-2 text-xs text-emerald-300">
      {notice}
      {undoable ? (
        <Button size="sm" variant="outline" type="button" className="h-6 px-2 text-[11px]" onClick={undo}>
          Undo
        </Button>
      ) : null}
    </p>
  );
}

/** Insights › Strength: every suggestion, most urgent first. */
export function SuggestedInterventions({ items }: { items: Intervention[] }) {
  const { notice, act, undoable, undo } = useLaunch();
  return (
    <section aria-label="Suggested next" className="mt-3 rounded-md border border-amber-900/50 bg-amber-950/10 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
        <Lightbulb className="h-3.5 w-3.5" />
        Suggested next
      </div>
      <p className="mt-1 text-xs leading-5 text-zinc-400">
        Where reviewing again is not enough: a node that keeps failing needs a new image, two nodes you keep mixing up
        need telling apart, and a route that costs too much to walk needs splitting or trimming.
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
      <Notice notice={notice} undoable={undoable} undo={undo} />
    </section>
  );
}

/** The Review page's top card: the most urgent suggestion, when there is one. */
export function TopIntervention() {
  const items = useInterventions();
  const { notice, act, undoable, undo } = useLaunch();
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
      <Notice notice={notice} undoable={undoable} undo={undo} />
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

const DONE_LABELS: Record<string, string> = {
  "re-encode": "Re-encoded",
  "link-confusion": "Linked",
  "add-distinguisher": "Distinguisher for",
  "route-surgery": "Fixed route",
};

/** Insights › Strength: whether the interventions taken so far helped, latest first. */
export function InterventionImpacts({ limit = 8 }: { limit?: number }) {
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const impacts = useMemo(() => measureInterventions(analyticsEvents).slice(0, limit), [analyticsEvents, limit]);
  if (impacts.length === 0) return null;
  return (
    <section aria-label="Did it help" className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-300">Did it help?</div>
      <p className="mt-1 text-xs leading-5 text-zinc-400">
        Recall (Good or Easy) on what each intervention touched, over the reviews just before it and just after.
      </p>
      <ul className="mt-2 space-y-1">
        {impacts.map((impact) => {
          const label = `${DONE_LABELS[impact.kind] ?? "Changed"} ${impact.title}`.trim();
          const better = impact.ready && impact.after.good / impact.after.total > (impact.before.total ? impact.before.good / impact.before.total : 0);
          return (
            <li key={impact.eventId} data-testid="intervention-impact" className="flex flex-wrap items-baseline gap-x-2 text-xs">
              <span className="text-zinc-100">{label}</span>
              {impact.ready ? (
                <span className={better ? "text-emerald-300" : "text-amber-300"}>
                  {formatRecall(impact.before)} → {formatRecall(impact.after)} Good or Easy
                </span>
              ) : (
                <span className="text-zinc-500">
                  {impact.after.total} of {IMPACT_MIN_AFTER} reviews since, so too early to tell
                </span>
              )}
              <span className="text-zinc-600">
                {impact.before.total} before · {impact.after.total} after · {new Date(impact.acceptedAt).toLocaleDateString()}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
