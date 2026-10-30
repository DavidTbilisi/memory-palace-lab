import { useValue } from "@tldraw/editor";
import type { Editor } from "@tldraw/editor";
import { isMemoryNodeShape } from "../../canvas/memoryNodeShape";
import { resolveMemoryNodeTitle } from "../../canvas/readShapeText";

const EMPTY = new Map<string, string>();

/**
 * Current title of every memory node on the canvas, keyed by node id. Re-renders when shapes
 * change, so stop labels that follow their node update as the node is renamed.
 */
export function useCanvasNodeTitles(editor: Editor | null): ReadonlyMap<string, string> {
  return useValue(
    "canvas memory node titles",
    () => {
      if (!editor) return EMPTY;
      const titles = new Map<string, string>();
      for (const shapeId of editor.getCurrentPageShapeIds()) {
        const shape = editor.getShape(shapeId);
        if (!isMemoryNodeShape(shape)) continue;
        const nodeId = shape.meta.mpNodeId;
        if (!titles.has(nodeId)) titles.set(nodeId, resolveMemoryNodeTitle(shape));
      }
      return titles;
    },
    [editor],
  );
}
