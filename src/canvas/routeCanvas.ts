import type { Editor, TLShape, TLShapeId } from "@tldraw/editor";
import type { StopView } from "../domain/entities/types";
import type { StopPoint } from "../domain/services/routeBuilder";
import { isMemoryNodeShape } from "./memoryNodeShape";
import type { NodeBox } from "./routeOverlayGeometry";

function memoryNodeIdOf(shape: TLShape | undefined): string | null {
  return isMemoryNodeShape(shape) ? shape.meta.mpNodeId : null;
}

/** Selected memory nodes in selection order, with their page-space centers. */
export function selectedMemoryNodePoints(editor: Editor): StopPoint[] {
  const points: StopPoint[] = [];
  const seen = new Set<string>();
  for (const shapeId of editor.getSelectedShapeIds()) {
    const nodeId = memoryNodeIdOf(editor.getShape(shapeId));
    if (!nodeId || seen.has(nodeId)) continue;
    const bounds = editor.getShapePageBounds(shapeId);
    if (!bounds) continue;
    seen.add(nodeId);
    points.push({ nodeId, x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 });
  }
  return points;
}

/** Page-space center of the memory node with this id, if it is on the current page. */
export function memoryNodeCenter(editor: Editor, nodeId: string): { x: number; y: number } | null {
  const shapeId = memoryNodeShapeId(editor, nodeId);
  const bounds = shapeId ? editor.getShapePageBounds(shapeId) : undefined;
  return bounds ? { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 } : null;
}

export function memoryNodeShapeId(editor: Editor, nodeId: string): TLShapeId | null {
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    if (memoryNodeIdOf(editor.getShape(shapeId)) === nodeId) return shapeId;
  }
  return null;
}

const roundView = (value: number) => Math.round(value * 100) / 100;

/**
 * The current view, saved relative to this node's center. Null when the node is not on the
 * page or not in view, because a walk would then show a view without the stop in it.
 */
export function captureStopView(editor: Editor, nodeId: string): StopView | null {
  const shapeId = memoryNodeShapeId(editor, nodeId);
  const node = shapeId ? editor.getShapePageBounds(shapeId) : undefined;
  if (!node) return null;
  const viewport = editor.getViewportPageBounds();
  const inView =
    node.x < viewport.x + viewport.w &&
    node.x + node.w > viewport.x &&
    node.y < viewport.y + viewport.h &&
    node.y + node.h > viewport.y;
  if (!inView) return null;
  return {
    x: roundView(viewport.x - (node.x + node.w / 2)),
    y: roundView(viewport.y - (node.y + node.h / 2)),
    w: roundView(viewport.w),
    h: roundView(viewport.h),
  };
}

/** The page area a saved view shows, placed around the node shape's current center. */
export function stopViewPageBounds(editor: Editor, shapeId: TLShapeId, view: StopView): StopView | null {
  const node = editor.getShapePageBounds(shapeId);
  if (!node) return null;
  return { x: node.x + node.w / 2 + view.x, y: node.y + node.h / 2 + view.y, w: view.w, h: view.h };
}

/**
 * Animate the camera to a stop: its saved view, or else the node itself. Select the node
 * first, since the fallback zooms to the selection.
 */
export function zoomToStop(editor: Editor, shapeId: TLShapeId, view: StopView | null | undefined) {
  // tldraw re-measures the canvas up to 200 ms after a resize, and starting a walk resizes it
  // (the walk bar grows) in the same render that moves the camera. Fit against the new size.
  const container = editor.getContainer();
  editor.updateViewportScreenBounds(container.querySelector<HTMLElement>(".tl-canvas") ?? container);
  const animation = { duration: 320 };
  const bounds = view ? stopViewPageBounds(editor, shapeId, view) : null;
  if (bounds) editor.zoomToBounds(bounds, { inset: 0, animation });
  else editor.zoomToSelection({ animation });
}

/** The memory node under a page point, as used by the Connect and Route tools. */
export function memoryNodeIdAt(editor: Editor, point: { x: number; y: number }): string | null {
  const hit = editor.getShapeAtPoint(point, { hitInside: true, margin: 8 });
  return hit ? memoryNodeIdOf(editor.getShape(hit.id)) : null;
}

export function liveMemoryNodeIds(editor: Editor): Set<string> {
  const ids = new Set<string>();
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const nodeId = memoryNodeIdOf(editor.getShape(shapeId));
    if (nodeId) ids.add(nodeId);
  }
  return ids;
}

/** Every memory node's box in viewport pixels, for the route overlay. */
export function viewportBoxesByNode(editor: Editor): Map<string, NodeBox> {
  const boxes = new Map<string, NodeBox>();
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const nodeId = memoryNodeIdOf(editor.getShape(shapeId));
    if (!nodeId || boxes.has(nodeId)) continue;
    const bounds = editor.getShapePageBounds(shapeId);
    if (!bounds) continue;
    const topLeft = editor.pageToViewport({ x: bounds.x, y: bounds.y });
    const bottomRight = editor.pageToViewport({ x: bounds.x + bounds.w, y: bounds.y + bounds.h });
    boxes.set(nodeId, {
      x: topLeft.x,
      y: topLeft.y,
      w: bottomRight.x - topLeft.x,
      h: bottomRight.y - topLeft.y,
    });
  }
  return boxes;
}

/** Memory node ids among the shape records of a store change. */
export function memoryNodeIdsInRecords(records: Iterable<unknown>): string[] {
  const ids: string[] = [];
  for (const record of records) {
    const shape = record as Partial<TLShape> & { typeName?: string };
    if (shape.typeName !== "shape") continue;
    const nodeId = memoryNodeIdOf(shape as TLShape);
    if (nodeId) ids.push(nodeId);
  }
  return ids;
}
