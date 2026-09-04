import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import type { NodeDifficultyOverride } from "../domain/entities/types";
import type { MemoryPalaceMeta } from "./memoryMeta";

/**
 * Write a per-node /difficulty override into the tldraw shape that backs the
 * node, mirroring how NodeInspector persists title/content. The editor change
 * propagates to the store snapshot and queues a draft save. Pass `null` to
 * clear the override (back to auto-derived).
 */
export function writeNodeDifficulty(
  editor: Editor,
  nodeId: string,
  override: NodeDifficultyOverride | null,
): boolean {
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!shape || shape.type !== "geo") continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (meta.mpNodeId !== nodeId) continue;
    const nextMeta: MemoryPalaceMeta = { ...meta };
    if (override && Object.keys(override).length > 0) {
      nextMeta.mpDifficulty = override;
    } else {
      // tldraw merges meta key by key, so a missing key would leave the old
      // override in place; `null` is the only way to clear it.
      nextMeta.mpDifficulty = null;
    }
    editor.updateShape({
      id: shape.id as TLShapeId,
      type: "geo",
      meta: nextMeta,
    });
    return true;
  }
  return false;
}
