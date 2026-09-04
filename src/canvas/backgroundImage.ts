import type { Editor } from "@tldraw/editor";
import type { TLImageShape, TLShape, TLShapeId } from "@tldraw/tlschema";
import type { MemoryPalaceMeta } from "./memoryMeta";

/**
 * A palace background is a tldraw image shape flagged with `mpBackground`.
 *
 * It stays locked so everyday canvas work (selecting nodes, double-click to
 * create) passes straight through it. "Adjust" unlocks it so tldraw's select
 * tool can move, resize, and crop it; "lock" restores the passive state.
 *
 * tldraw silently skips locked shapes in `updateShapes`, `deleteShapes`, and
 * `sendToBack`, so every mutation here runs with `ignoreShapeLock`.
 */

export type BackgroundState = {
  /** A background image exists on the current page. */
  present: boolean;
  /** The background is unlocked so it can be moved, resized, or cropped. */
  editable: boolean;
};

const NO_BACKGROUND: BackgroundState = { present: false, editable: false };

export function isBackgroundShape(
  shape: TLShape | null | undefined,
): shape is TLImageShape {
  if (!shape || shape.type !== "image") return false;
  return (shape.meta as MemoryPalaceMeta | undefined)?.mpBackground === true;
}

export function findBackgroundShapes(editor: Editor): TLImageShape[] {
  const shapes: TLImageShape[] = [];
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (isBackgroundShape(shape)) shapes.push(shape);
  }
  return shapes;
}

export function getBackgroundState(
  editor: Editor | null | undefined,
): BackgroundState {
  if (!editor) return NO_BACKGROUND;
  const shapes = findBackgroundShapes(editor);
  if (shapes.length === 0) return NO_BACKGROUND;
  return { present: true, editable: shapes.some((shape) => !shape.isLocked) };
}

/**
 * Unlock the background and select it so tldraw's select tool can move,
 * resize, and crop it (`editable: true`), or lock it again and push it back
 * behind the graph. Returns false when there is no background to change.
 */
export function setBackgroundEditable(editor: Editor, editable: boolean) {
  const ids = findBackgroundShapes(editor).map((shape) => shape.id);
  if (ids.length === 0) return false;
  editor.run(
    () => {
      editor.updateShapes(
        ids.map((id) => ({ id, type: "image" as const, isLocked: !editable })),
      );
      if (editable) {
        editor.setCurrentTool("select");
        editor.select(...ids);
        return;
      }
      editor.sendToBack(ids);
      editor.setSelectedShapes(
        editor.getSelectedShapeIds().filter((id) => !ids.includes(id)),
      );
    },
    { ignoreShapeLock: true },
  );
  return true;
}

/** Delete the background, locked or not. Returns false when there is none. */
export function removeBackground(editor: Editor) {
  const ids = findBackgroundShapes(editor).map((shape) => shape.id);
  if (ids.length === 0) return false;
  editor.run(() => editor.deleteShapes(ids), { ignoreShapeLock: true });
  return true;
}

/** Move background shapes behind everything else, even while locked. */
export function sendBackgroundToBack(editor: Editor, ids: TLShapeId[]) {
  editor.run(() => editor.sendToBack(ids), { ignoreShapeLock: true });
}
