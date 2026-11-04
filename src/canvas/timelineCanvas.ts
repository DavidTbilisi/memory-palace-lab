import type { Editor } from "@tldraw/editor";
import { createShapeId, toRichText, type TLShapeId } from "@tldraw/tlschema";
import {
  TIMELINE_NODE_SIZE,
  dateImagePlaceholder,
  layoutTimeline,
  orderEvents,
  parseTimelineDate,
  resolveEras,
  type Box,
  type DatedEvent,
  type TimelineDate,
  type TimelineEra,
} from "../domain/services/timeline";
import { createGeoMemoryNode } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape, nodeShapeHasLabel, type MemoryNodeShapeType } from "./memoryNodeShape";
import { isStoreNodeFilledOnCanvas, type StoreNode } from "./storeNodes";

/** A timeline node as found on the canvas. */
type TimelineNode = Omit<StoreNode, "role" | "address">;

export type TimelineEventOnCanvas = TimelineNode & {
  /** Null when the event's address no longer reads as a date. */
  date: TimelineDate | null;
  image: TimelineNode | null;
};

/** Every event on the canvas with its date image, plus date images whose event is gone. */
export function readTimeline(editor: Editor): { events: TimelineEventOnCanvas[]; orphanImages: TimelineNode[] } {
  const events: TimelineEventOnCanvas[] = [];
  const images = new Map<string, TimelineNode>();
  const orphanImages: TimelineNode[] = [];
  for (const shape of editor.getCurrentPageShapes()) {
    if (!isMemoryNodeShape(shape)) continue;
    const meta = shape.meta as MemoryPalaceMeta;
    const node: TimelineNode = { shapeId: shape.id, nodeId: meta.mpNodeId!, type: shape.type, meta };
    if (meta.mpStoreRole === "event") {
      events.push({ ...node, date: parseTimelineDate(meta.mpAddress ?? ""), image: null });
    } else if (meta.mpStoreRole === "date-image") {
      if (meta.mpPairNodeId && !images.has(meta.mpPairNodeId)) images.set(meta.mpPairNodeId, node);
      else orphanImages.push(node);
    }
  }
  for (const event of events) {
    event.image = images.get(event.nodeId) ?? null;
    images.delete(event.nodeId);
  }
  orphanImages.push(...images.values());
  return { events, orphanImages };
}

/** Whether a date image holds the learner's own image rather than its placeholder. */
export function isDateImageFilled(image: TimelineNode, date: TimelineDate | null): boolean {
  const fallback = date ? dateImagePlaceholder(date.label) : "";
  return isStoreNodeFilledOnCanvas({ ...image, role: "date-image", address: image.meta.mpAddress ?? null }, fallback);
}

function setTitle(editor: Editor, node: TimelineNode, title: string, extra: MemoryPalaceMeta = {}) {
  editor.updateShape({ id: node.shapeId, type: node.type, meta: { ...node.meta, ...extra, mpTitle: title } });
  if (nodeShapeHasLabel({ type: node.type })) {
    editor.updateShape({ id: node.shapeId, type: "geo", props: { richText: toRichText(title) } });
  }
}

function drawDateImage(editor: Editor, palaceId: string, eventNodeId: string, date: TimelineDate) {
  const title = dateImagePlaceholder(date.label);
  return createGeoMemoryNode(editor, palaceId, { x: 0, y: 0 }, {
    title,
    size: TIMELINE_NODE_SIZE.dateImage,
    meta: { mpStoreRole: "date-image", mpAddress: date.label, mpPlaceholder: title, mpPairNodeId: eventNodeId },
    select: false,
  });
}

/** Draw a new event and its date image. The caller lays the timeline out again to place them. */
export function drawTimelineEvent(editor: Editor, palaceId: string, title: string, date: TimelineDate): string {
  const event = createGeoMemoryNode(editor, palaceId, { x: 0, y: 0 }, {
    title,
    size: TIMELINE_NODE_SIZE.event,
    meta: { mpStoreRole: "event", mpAddress: date.label },
    select: false,
  });
  drawDateImage(editor, palaceId, event.nodeId, date);
  return event.nodeId;
}

/**
 * Give an event a new date. Its date image follows: one still showing its placeholder is renamed
 * to the new date's, while one the learner has renamed keeps their name.
 */
export function redateTimelineEvent(editor: Editor, eventNodeId: string, date: TimelineDate): boolean {
  const event = readTimeline(editor).events.find((candidate) => candidate.nodeId === eventNodeId);
  if (!event) return false;
  editor.updateShape({ id: event.shapeId, type: event.type, meta: { ...event.meta, mpAddress: date.label } });
  if (event.image) {
    if (isDateImageFilled(event.image, event.date)) {
      editor.updateShape({ id: event.image.shapeId, type: event.image.type, meta: { ...event.image.meta, mpAddress: date.label } });
    } else {
      const title = dateImagePlaceholder(date.label);
      setTitle(editor, event.image, title, { mpAddress: date.label, mpPlaceholder: title });
    }
  }
  return true;
}

/** Delete an event, and its date image too when `withImage`. */
export function removeTimelineEvent(editor: Editor, eventNodeId: string, options: { withImage: boolean }): boolean {
  const event = readTimeline(editor).events.find((candidate) => candidate.nodeId === eventNodeId);
  if (!event) return false;
  const ids = [event.shapeId, ...(options.withImage && event.image ? [event.image.shapeId] : [])];
  editor.deleteShapes(ids);
  return true;
}

const ERA_COLORS = ["light-blue", "light-green", "yellow", "light-violet", "orange", "light-red"] as const;
const AXIS_THICKNESS = 4;
const TICK_HEIGHT = 12;
const TICK_LABEL_WIDTH = 90;
/** Era rooms start this far above the axis, leaving room for their names. */
const ERA_TOP = -64;

function decorIds(editor: Editor): TLShapeId[] {
  return editor
    .getCurrentPageShapes()
    .filter((shape) => (shape.meta as MemoryPalaceMeta | undefined)?.mpTimelineDecor)
    .map((shape) => shape.id);
}

function bar(
  editor: Editor,
  decor: NonNullable<MemoryPalaceMeta["mpTimelineDecor"]>,
  box: { x: number; y: number; w: number; h: number },
  props: Record<string, unknown> = {},
): TLShapeId {
  const id = createShapeId();
  editor.createShape({
    id,
    type: "geo",
    x: box.x,
    y: box.y,
    isLocked: true,
    meta: { mpTimelineDecor: decor },
    props: {
      geo: "rectangle",
      w: Math.max(box.w, 1),
      h: Math.max(box.h, 1),
      color: "grey",
      fill: "solid",
      dash: "solid",
      size: "s",
      ...props,
    },
  });
  return id;
}

function place(editor: Editor, node: { shapeId: TLShapeId; type: MemoryNodeShapeType }, box: Box) {
  editor.updateShape({ id: node.shapeId, type: node.type, x: box.x - box.w / 2, y: box.y - box.h / 2 });
}

/**
 * Lay the timeline out from its events' dates: move every event and its date image to its place,
 * redraw a missing date image as a placeholder, and redraw the axis, ticks, era rooms and span
 * bars. Events whose address no longer reads as a date are left where they are. Returns the
 * dated events in route order. Callers mark the undo step, so a change and its layout undo together.
 */
export function layOutTimeline(
  editor: Editor,
  palaceId: string,
  eras: readonly TimelineEra[],
  previousOrder: readonly string[],
): DatedEvent[] {
  let ordered: DatedEvent[] = [];
  editor.run(
    () => {
      const { events } = readTimeline(editor);
      for (const event of events) {
        if (event.date && !event.image) drawDateImage(editor, palaceId, event.nodeId, event.date);
      }
      const byId = new Map(readTimeline(editor).events.map((event) => [event.nodeId, event]));
      ordered = orderEvents(
        [...byId.values()].flatMap((event) => (event.date ? [{ nodeId: event.nodeId, date: event.date }] : [])),
        previousOrder,
      );
      const layout = layoutTimeline(ordered, resolveEras(eras));

      editor.deleteShapes(decorIds(editor));
      const back: TLShapeId[] = [];
      layout.eras.forEach((era, index) => {
        back.push(
          bar(editor, "era", { x: era.x1, y: ERA_TOP, w: era.x2 - era.x1, h: layout.bottom - ERA_TOP }, {
            color: ERA_COLORS[index % ERA_COLORS.length],
            fill: "semi",
            dash: "dashed",
            align: "start",
            verticalAlign: "start",
            font: "sans",
            labelColor: "black",
            richText: toRichText(era.name),
          }),
        );
      });
      back.push(bar(editor, "axis", { x: layout.axis.x1, y: -AXIS_THICKNESS / 2, w: layout.axis.x2 - layout.axis.x1, h: AXIS_THICKNESS }));
      for (const tick of layout.ticks) {
        bar(editor, "tick", { x: tick.x - 1, y: -TICK_HEIGHT / 2, w: 2, h: TICK_HEIGHT });
        editor.createShape({
          id: createShapeId(),
          type: "text",
          x: tick.x - TICK_LABEL_WIDTH / 2,
          y: TICK_HEIGHT,
          isLocked: true,
          meta: { mpTimelineDecor: "tick" },
          props: { richText: toRichText(tick.label), w: TICK_LABEL_WIDTH, autoSize: false, textAlign: "middle", size: "s", font: "sans", color: "grey" },
        });
      }
      for (const placement of layout.events) {
        const event = byId.get(placement.nodeId)!;
        place(editor, event, placement.event);
        if (event.image) place(editor, event.image, placement.dateImage);
        if (placement.span) {
          bar(editor, "span", { x: placement.span.x1, y: placement.span.y, w: placement.span.x2 - placement.span.x1, h: 4 }, { color: "blue" });
        }
      }
      editor.sendToBack(back);
    },
    { ignoreShapeLock: true },
  );
  return ordered;
}
