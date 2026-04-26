import { useMemo, type ReactNode } from "react";
import { AlarmClockCheck, BrainCircuit, Clock3, Route, Sparkles } from "lucide-react";
import type { ReviewQueueItem } from "../domain/services/reviewQueueService";
import { buildReviewQueue, summarizeReviewQueue } from "../domain/services/reviewQueueService";
import { orderedLoci } from "../domain/services/walkService";
import { usePalaceStore } from "../store/palaceStore";
import type { TLShapeId } from "@tldraw/tlschema";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { Button } from "./ui/button";

function relativeDueLabel(item: ReviewQueueItem) {
  if (item.state === "fresh") return "Fresh";
  if (!item.dueAt) return "Fresh";
  if (item.state === "due_now") return "Due now";
  const dueMs = Date.parse(item.dueAt);
  const deltaMs = dueMs - Date.now();
  if (item.state === "overdue") {
    const overdueMinutes = Math.max(1, Math.round(Math.abs(deltaMs) / 60_000));
    if (overdueMinutes < 60) return `${overdueMinutes}m overdue`;
    const overdueHours = Math.max(1, Math.round(overdueMinutes / 60));
    if (overdueHours < 48) return `${overdueHours}h overdue`;
    return `${Math.max(1, Math.round(overdueHours / 24))}d overdue`;
  }
  const dueMinutes = Math.max(1, Math.round(deltaMs / 60_000));
  if (dueMinutes < 60) return `Due in ${dueMinutes}m`;
  const dueHours = Math.max(1, Math.round(dueMinutes / 60));
  if (dueHours < 48) return `Due in ${dueHours}h`;
  return `Due in ${Math.max(1, Math.round(dueHours / 24))}d`;
}

function ratingLabel(item: ReviewQueueItem) {
  if (!item.latestRating) return "No prior grade";
  return `Last grade: ${item.latestRating}`;
}

function toneClass(item: ReviewQueueItem) {
  switch (item.state) {
    case "overdue":
      return "border-rose-700/70 bg-rose-950/20";
    case "due_now":
      return "border-amber-700/70 bg-amber-950/20";
    case "fresh":
      return "border-zinc-800 bg-zinc-900/40";
    case "scheduled":
      return "border-emerald-700/60 bg-emerald-950/20";
    default:
      return "border-zinc-800 bg-zinc-900/40";
  }
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

export function ReviewQueuePanel() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const nodes = usePalaceStore((s) => s.nodes);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const setWalkRecallMode = usePalaceStore((s) => s.setWalkRecallMode);
  const setWalkCueOnly = usePalaceStore((s) => s.setWalkCueOnly);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);

  const queue = useMemo(
    () =>
      buildReviewQueue({
        analyticsEvents,
        palaceId: currentPalace?.id ?? null,
        nodes,
        routes,
      }),
    [analyticsEvents, currentPalace?.id, nodes, routes],
  );
  const summary = useMemo(() => summarizeReviewQueue(queue), [queue]);

  const reviewRoute = (item: ReviewQueueItem) => {
    if (!item.routeId) return;
    setWalkRoute(item.routeId);
    setWalkRecallMode(true);
    setWalkCueOnly(true);
    setWalkOpen(true);
  };

  const focusNode = (item: ReviewQueueItem) => {
    if (!editorRef || !item.nodeId) return;
    for (const shapeId of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(shapeId);
      if (shape?.type !== "geo") continue;
      const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
      if (meta.mpNodeId !== item.nodeId) continue;
      editorRef.setSelectedShapes([shapeId as TLShapeId]);
      usePalaceStore.getState().setSelectedShapeId(shapeId);
      editorRef.zoomToSelectionIfOffscreen(120, { animation: { duration: 220 } });
      break;
    }
  };

  const reviewNodeInRoute = (item: ReviewQueueItem) => {
    if (!item.routeId || !item.nodeId) return;
    setWalkRoute(item.routeId);
    setWalkRecallMode(true);
    setWalkCueOnly(true);
    setWalkOpen(true);
    const routeLoci = orderedLoci(loci.filter((locus) => locus.routeId === item.routeId));
    const targetIndex = routeLoci.findIndex((locus) => locus.nodeId === item.nodeId);
    if (targetIndex >= 0) {
      usePalaceStore.setState({ walkIndex: targetIndex });
    }
  };

  if (!currentPalace) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-sm text-zinc-500">
        Open a palace to build its spaced review queue.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <AlarmClockCheck className="h-4 w-4" />
          Review Queue
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Spaced review stays local and schedules route-level and node-level reviews from actual recall performance.
          Due work stays visible here without blocking normal graph editing.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3">
        <div className="grid gap-3 md:grid-cols-4">
          <Stat icon={<Clock3 className="h-3.5 w-3.5" />} label="Due now" value={String(summary.dueCount)} />
          <Stat icon={<AlarmClockCheck className="h-3.5 w-3.5" />} label="Overdue" value={String(summary.overdueCount)} />
          <Stat icon={<Sparkles className="h-3.5 w-3.5" />} label="Fresh" value={String(summary.freshCount)} />
          <Stat icon={<BrainCircuit className="h-3.5 w-3.5" />} label="Scheduled" value={String(summary.scheduledCount)} />
        </div>

        <div className="mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-xs leading-5 text-zinc-400">
          Current palace: <span className="text-zinc-200">{currentPalace.name}</span>. Route sessions schedule whole-path
          reviews, while node grades keep single concepts from being silently neglected.
        </div>

        <div className="mt-3 space-y-3">
          {queue.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-800 bg-zinc-950/40 px-3 py-6 text-sm text-zinc-500">
              No review items yet. Walk a route in recall-first mode and grade recall to seed the queue.
            </div>
          ) : (
            queue.map((item) => (
              <section key={item.id} className={`rounded-md border p-3 ${toneClass(item)}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">
                      {item.kind === "route" ? <Route className="h-3.5 w-3.5" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                      {item.kind}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-100">{item.title}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      {item.subtitle ? `${item.subtitle} • ` : ""}
                      {ratingLabel(item)} • {relativeDueLabel(item)}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {item.kind === "route" ? (
                      <Button type="button" size="sm" onClick={() => reviewRoute(item)}>
                        Review route
                      </Button>
                    ) : (
                      <>
                        <Button type="button" size="sm" variant="secondary" onClick={() => focusNode(item)}>
                          Focus node
                        </Button>
                        {item.routeId ? (
                          <Button type="button" size="sm" onClick={() => reviewNodeInRoute(item)}>
                            Review in route
                          </Button>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
