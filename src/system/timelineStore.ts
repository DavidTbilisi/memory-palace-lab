import {
  drawTimelineEvent,
  isDateImageFilled,
  layOutTimeline,
  readTimeline,
  redateTimelineEvent,
  removeTimelineEvent,
} from "../canvas/timelineCanvas";
import type { Locus, MemoryRoute } from "../domain/entities/types";
import { parseStore, serializeStore, type TimelineStore } from "../domain/services/generatedStore";
import {
  ORDER_DRILL_MIN,
  drillRun,
  isInDateOrder,
  shuffleForDrill,
  weakestEventIndex,
} from "../domain/services/orderDrill";
import { eraSections, orderEvents, parseTimelineDate, resolveEras, type DatedEvent } from "../domain/services/timeline";
import { usePalaceStore } from "../store/palaceStore";
import { waitForEditorReady } from "./examplePalaces";

/** What a timeline action reports: done, or why not, in words the learner can act on. */
export type TimelineResult = { ok: true } | { ok: false; error: string };

const DATE_HINT = "Write a date like 1901, 1969-07-20, 490 BCE or 1910–1913.";

export function timelinePalaceName(title: string): string {
  return `${title.trim()} · timeline`;
}

/** The open palace's timeline, if it is one. */
export function currentTimeline(): TimelineStore | null {
  const store = parseStore(usePalaceStore.getState().currentPalace?.storeJson);
  return store?.kind === "timeline" ? store : null;
}

function routeStops(routeId: string | null): Locus[] {
  if (!routeId) return [];
  return usePalaceStore
    .getState()
    .loci.filter((locus) => locus.routeId === routeId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * The timeline's route: its events in date order, each stop labelled with its date and the first
 * stop of each era starting a section. Unlike a block's, it is walked, so it is visible and in
 * review from the start. Stops already on it keep their schedules.
 */
function syncTimelineRoute(store: TimelineStore, ordered: readonly DatedEvent[]): string {
  const state = usePalaceStore.getState();
  const existing = store.routeId ? state.routes.find((route) => route.id === store.routeId) : undefined;
  const route: MemoryRoute = existing ?? {
    id: crypto.randomUUID(),
    palaceId: state.currentPalace!.id,
    name: timelinePalaceName(store.title),
    inReview: true,
  };
  const previous = new Map(routeStops(route.id).map((locus) => [locus.nodeId, locus]));
  const sections = eraSections(
    ordered.map((event) => event.date.startKey),
    resolveEras(store.eras),
  );
  const stops: Locus[] = ordered.map((event, orderIndex) => ({
    ...(previous.get(event.nodeId) ?? { id: crypto.randomUUID(), routeId: route.id, nodeId: event.nodeId }),
    orderIndex,
    label: event.date.label,
    section: sections[orderIndex] ?? null,
  }));
  const routes = existing ? state.routes : [...state.routes, route];
  state.replaceRoutesAndLoci(routes, [...state.loci.filter((locus) => locus.routeId !== route.id), ...stops]);
  return route.id;
}

/** Lay the open timeline out again and bring its route in line; `change` runs first, in the same undo step. */
function relayout(label: string, change?: () => void, nextStore?: TimelineStore): boolean {
  const store = nextStore ?? currentTimeline();
  const { editorRef: editor, currentPalace } = usePalaceStore.getState();
  if (!store || !editor || !currentPalace) return false;
  editor.markHistoryStoppingPoint(label);
  let ordered: DatedEvent[] = [];
  editor.run(() => {
    change?.();
    ordered = layOutTimeline(
      editor,
      currentPalace.id,
      store.eras,
      routeStops(store.routeId).map((locus) => locus.nodeId),
    );
  });
  const routeId = syncTimelineRoute(store, ordered);
  const next = { ...store, routeId };
  if (serializeStore(next) !== currentPalace.storeJson) usePalaceStore.getState().setCurrentStore(serializeStore(next));
  return true;
}

/** Create an empty timeline in a palace of its own, open it, and save it. */
export async function createTimeline(title: string): Promise<{ palaceId: string }> {
  const name = timelinePalaceName(title);
  const previousEditor = usePalaceStore.getState().editorRef;
  await usePalaceStore.getState().createPalace(name);
  const { palaceId } = await waitForEditorReady({ expectPalaceName: name, previousEditor });
  const store: TimelineStore = { kind: "timeline", title: title.trim(), generatedAt: new Date().toISOString(), routeId: null, eras: [] };
  usePalaceStore.getState().setCurrentStore(serializeStore(store));
  relayout("create timeline", undefined, store);
  await usePalaceStore.getState().saveCurrent();
  return { palaceId };
}

/** Add a dated event to the open timeline, with a placeholder for its date image. */
export function addTimelineEvent(title: string, dateText: string): TimelineResult & { nodeId?: string } {
  const date = parseTimelineDate(dateText);
  if (!title.trim()) return { ok: false, error: "Name the event." };
  if (!date) return { ok: false, error: DATE_HINT };
  const { editorRef: editor, currentPalace } = usePalaceStore.getState();
  if (!currentTimeline() || !editor || !currentPalace) return { ok: false, error: "Open a timeline first." };
  let nodeId = "";
  relayout("add timeline event", () => {
    nodeId = drawTimelineEvent(editor, currentPalace.id, title.trim(), date);
  });
  return { ok: true, nodeId };
}

/** Move an event to a new date; its placeholder date image is renamed with it. */
export function redateEvent(nodeId: string, dateText: string): TimelineResult {
  const date = parseTimelineDate(dateText);
  if (!date) return { ok: false, error: DATE_HINT };
  const editor = usePalaceStore.getState().editorRef;
  if (!currentTimeline() || !editor) return { ok: false, error: "Open a timeline first." };
  let found = false;
  relayout("change event date", () => {
    found = redateTimelineEvent(editor, nodeId, date);
  });
  return found ? { ok: true } : { ok: false, error: "That event is no longer on the timeline." };
}

/** Whether removing this event would also remove a date image the learner has made their own. */
export function eventImageIsFilled(nodeId: string): boolean {
  const editor = usePalaceStore.getState().editorRef;
  if (!editor) return false;
  const event = readTimeline(editor).events.find((candidate) => candidate.nodeId === nodeId);
  return !!event?.image && isDateImageFilled(event.image, event.date);
}

/** Remove an event; its date image goes too only with `withImage`. */
export function removeEvent(nodeId: string, options: { withImage: boolean }): boolean {
  const editor = usePalaceStore.getState().editorRef;
  if (!editor) return false;
  let removed = false;
  relayout("remove timeline event", () => {
    removed = removeTimelineEvent(editor, nodeId, options);
  });
  return removed;
}

/** Name a new era; it is drawn as a room and starts a route section. */
export function addEra(name: string, from: string, to: string): TimelineResult {
  const store = currentTimeline();
  if (!store) return { ok: false, error: "Open a timeline first." };
  if (!name.trim()) return { ok: false, error: "Name the era." };
  const start = parseTimelineDate(from);
  const end = parseTimelineDate(to);
  if (!start || !end) return { ok: false, error: DATE_HINT };
  if (end.endKey <= start.startKey) return { ok: false, error: "An era must end after it starts." };
  const next: TimelineStore = {
    ...store,
    eras: [...store.eras, { id: crypto.randomUUID(), name: name.trim(), from: start.label, to: end.label }],
  };
  usePalaceStore.getState().setCurrentStore(serializeStore(next));
  relayout("add era", undefined, next);
  return { ok: true };
}

export function removeEra(eraId: string): boolean {
  const store = currentTimeline();
  if (!store || !store.eras.some((era) => era.id === eraId)) return false;
  const next: TimelineStore = { ...store, eras: store.eras.filter((era) => era.id !== eraId) };
  usePalaceStore.getState().setCurrentStore(serializeStore(next));
  return relayout("remove era", undefined, next);
}

/** Put every event back in its place, redraw missing date images, and bring the route in line. */
export function relayoutTimeline(): boolean {
  return relayout("lay out timeline");
}

/** One event in an order drill, as the learner sees it before checking: no date shown. */
export type DrillEvent = DatedEvent & { title: string };

export type OrderDrill = { routeId: string | null; events: DrillEvent[] };

/**
 * Start an order drill on the open timeline: up to five neighbouring events centred on the
 * weakest, shuffled out of date order.
 */
export function startOrderDrill(random = Math.random): OrderDrill | { error: string } {
  const store = currentTimeline();
  const editor = usePalaceStore.getState().editorRef;
  if (!store || !editor) return { error: "Open a timeline first." };
  const stops = routeStops(store.routeId);
  const dated = readTimeline(editor).events.flatMap((event) =>
    event.date ? [{ nodeId: event.nodeId, date: event.date, title: event.meta.mpTitle?.trim() || "Untitled event" }] : [],
  );
  const ordered = orderEvents(
    dated,
    stops.map((locus) => locus.nodeId),
  );
  if (ordered.length < ORDER_DRILL_MIN) {
    return { error: `An order drill needs at least ${ORDER_DRILL_MIN} dated events.` };
  }
  const stopByNode = new Map(stops.map((locus) => [locus.nodeId, locus]));
  const centre = weakestEventIndex(ordered, (nodeId) => stopByNode.get(nodeId), new Date().toISOString()) ?? 0;
  const run = drillRun(ordered, centre);
  return { routeId: store.routeId, events: shuffleForDrill(run, isInDateOrder, random) };
}
