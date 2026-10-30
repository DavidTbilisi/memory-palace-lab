import type { Editor } from "@tldraw/editor";
import { CAST_HOW, CAST_WHAT, CAST_WHEN, CAST_WHO } from "../domain/entities/types";
import { normalizeAttributes } from "../domain/services/attributes";
import { createGeoMemoryNode, createMemoryArrow } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

const NODE_GAP_X = 220;
const ROW_GAP_Y = 160;

/**
 * The dissolve route: one attribute's values become separate nodes, each linked from the node that
 * held them, and the attribute is removed. One `editor.run`, so a single undo puts it back.
 * Returns the new node ids, or null when the node or attribute is gone.
 */
export function dissolveAttribute(editor: Editor, palaceId: string, nodeId: string, index: number): string[] | null {
  const shape = editor
    .getCurrentPageShapes()
    .find((candidate) => isMemoryNodeShape(candidate) && (candidate.meta as MemoryPalaceMeta).mpNodeId === nodeId);
  if (!shape) return null;
  const attributes = normalizeAttributes((shape.meta as MemoryPalaceMeta).mpAttributes) ?? [];
  const attribute = attributes[index];
  if (!attribute || attribute.values.length === 0) return null;
  const bounds = editor.getShapePageBounds(shape.id);
  if (!bounds) return null;

  const created: string[] = [];
  // Without a stopping point, undo would also take back the edits made before the split.
  editor.markHistoryStoppingPoint("dissolve attribute");
  editor.run(() => {
    const rowWidth = (attribute.values.length - 1) * NODE_GAP_X;
    attribute.values.forEach((value, i) => {
      const point = { x: bounds.center.x - rowWidth / 2 + i * NODE_GAP_X, y: bounds.maxY + ROW_GAP_Y };
      const node = createGeoMemoryNode(editor, palaceId, point, { title: value });
      createMemoryArrow(editor, palaceId, shape.id, node.shapeId, nodeId, node.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[0],
        ef: CAST_WHAT[0],
        gh: CAST_WHEN[0],
        label: attribute.name || undefined,
      });
      created.push(node.nodeId);
    });
    const remaining = attributes.filter((_, i) => i !== index);
    const meta: MemoryPalaceMeta = { ...(shape.meta as MemoryPalaceMeta), mpAttributes: remaining.length > 0 ? remaining : null };
    editor.updateShape({ id: shape.id, type: shape.type, meta });
    editor.select(shape.id);
  });
  return created;
}
