import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import type { NodeAttribute } from "../domain/entities/types";
import { normalizeAttributes } from "../domain/services/attributes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

/**
 * Write a node's attributes into the shape that backs it, as writeNodeNedf does for its slots.
 * Empty attributes are dropped; with none left the attributes are cleared.
 */
export function writeNodeAttributes(editor: Editor, nodeId: string, attributes: NodeAttribute[] | null): boolean {
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!isMemoryNodeShape(shape)) continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (meta.mpNodeId !== nodeId) continue;
    // tldraw merges meta key by key, so only `null` clears the attributes.
    const nextMeta: MemoryPalaceMeta = { ...meta, mpAttributes: normalizeAttributes(attributes) };
    editor.updateShape({ id: shape.id as TLShapeId, type: shape.type, meta: nextMeta });
    return true;
  }
  return false;
}
