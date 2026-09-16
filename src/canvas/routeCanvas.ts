import type { Editor, TLShape } from "@tldraw/editor";
import type { StopPoint } from "../domain/services/routeBuilder";
import type { MemoryPalaceMeta } from "./memoryMeta";
import type { NodeBox } from "./routeOverlayGeometry";

function memoryNodeIdOf(shape: TLShape | undefined): string | null {
  if (!shape || shape.type !== "geo") return null;
  return ((shape.meta ?? {}) as MemoryPalaceMeta).mpNodeId ?? null;
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
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    if (memoryNodeIdOf(editor.getShape(shapeId)) !== nodeId) continue;
    const bounds = editor.getShapePageBounds(shapeId);
    if (bounds) return { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 };
  }
  return null;
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
