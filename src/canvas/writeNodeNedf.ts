import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import type { NedfEncoding } from "../domain/entities/types";
import { normalizeNedf } from "../domain/services/nedf";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

/**
 * Write a node's NEDF slots into the shape that backs it, as writeNodeDifficulty does for its
 * override. Empty slots are dropped; with none left the slots are cleared.
 */
export function writeNodeNedf(editor: Editor, nodeId: string, nedf: NedfEncoding | null): boolean {
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!isMemoryNodeShape(shape)) continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (meta.mpNodeId !== nodeId) continue;
    // tldraw merges meta key by key, so only `null` clears the slots.
    const nextMeta: MemoryPalaceMeta = { ...meta, mpNedf: normalizeNedf(nedf) };
    editor.updateShape({ id: shape.id as TLShapeId, type: shape.type, meta: nextMeta });
    return true;
  }
  return false;
}
