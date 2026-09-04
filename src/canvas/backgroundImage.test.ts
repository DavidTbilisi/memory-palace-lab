import { describe, expect, it, vi } from "vitest";
import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import {
  getBackgroundState,
  isBackgroundShape,
  removeBackground,
  sendBackgroundToBack,
  setBackgroundEditable,
} from "./backgroundImage";

type FakeShape = {
  id: TLShapeId;
  type: string;
  isLocked: boolean;
  index: string;
  meta: Record<string, unknown>;
};

const BG_ID = "shape:bg" as TLShapeId;
const NODE_ID = "shape:node" as TLShapeId;

function backgroundShape(isLocked = true): FakeShape {
  return { id: BG_ID, type: "image", isLocked, index: "a2", meta: { mpBackground: true } };
}

function nodeShape(): FakeShape {
  return { id: NODE_ID, type: "geo", isLocked: false, index: "a1", meta: { mpNodeId: "n1" } };
}

/**
 * Just enough of tldraw's Editor to exercise the lock rules: locked shapes
 * ignore updates (other than an unlock), deletes, and reordering unless the
 * mutation runs inside `run(..., { ignoreShapeLock: true })`.
 */
function createFakeEditor(shapes: FakeShape[]) {
  const byId = new Map(shapes.map((shape) => [shape.id, shape]));
  let ignoreShapeLock = false;
  let selected: TLShapeId[] = [];
  const setCurrentTool = vi.fn();
  const editor = {
    getCurrentPageShapeIds: () => new Set(byId.keys()),
    getShape: (id: TLShapeId) => byId.get(id),
    getSelectedShapeIds: () => selected,
    setSelectedShapes: (ids: TLShapeId[]) => {
      selected = [...ids];
    },
    select: (...ids: TLShapeId[]) => {
      selected = [...ids];
    },
    setCurrentTool,
    run: (fn: () => void, opts?: { ignoreShapeLock?: boolean }) => {
      const previous = ignoreShapeLock;
      ignoreShapeLock = opts?.ignoreShapeLock ?? previous;
      try {
        fn();
      } finally {
        ignoreShapeLock = previous;
      }
    },
    updateShapes: (partials: Array<{ id: TLShapeId; isLocked?: boolean; index?: string }>) => {
      for (const partial of partials) {
        const shape = byId.get(partial.id);
        if (!shape) continue;
        if (!ignoreShapeLock && shape.isLocked && partial.isLocked !== false) continue;
        Object.assign(shape, partial);
      }
    },
    deleteShapes: (ids: TLShapeId[]) => {
      for (const id of ids) {
        const shape = byId.get(id);
        if (!shape) continue;
        if (!ignoreShapeLock && shape.isLocked) continue;
        byId.delete(id);
        selected = selected.filter((selectedId) => selectedId !== id);
      }
    },
    sendToBack: (ids: TLShapeId[]) => {
      editor.updateShapes(ids.map((id) => ({ id, index: "a0" })));
    },
  };
  return {
    editor: editor as unknown as Editor,
    byId,
    setCurrentTool,
    selected: () => selected,
  };
}

describe("backgroundImage", () => {
  it("recognises only image shapes flagged as backgrounds", () => {
    expect(isBackgroundShape(backgroundShape() as never)).toBe(true);
    expect(isBackgroundShape(nodeShape() as never)).toBe(false);
    expect(
      isBackgroundShape({ ...nodeShape(), type: "image", meta: {} } as never),
    ).toBe(false);
    expect(isBackgroundShape(undefined)).toBe(false);
  });

  it("reports whether a background exists and whether it is unlocked", () => {
    expect(getBackgroundState(null)).toEqual({ present: false, editable: false });
    expect(getBackgroundState(createFakeEditor([nodeShape()]).editor)).toEqual({
      present: false,
      editable: false,
    });
    expect(
      getBackgroundState(createFakeEditor([nodeShape(), backgroundShape(true)]).editor),
    ).toEqual({ present: true, editable: false });
    expect(
      getBackgroundState(createFakeEditor([backgroundShape(false)]).editor),
    ).toEqual({ present: true, editable: true });
  });

  it("unlocks and selects the background so it can be adjusted", () => {
    const fake = createFakeEditor([nodeShape(), backgroundShape(true)]);
    expect(setBackgroundEditable(fake.editor, true)).toBe(true);
    expect(fake.byId.get(BG_ID)?.isLocked).toBe(false);
    expect(fake.selected()).toEqual([BG_ID]);
    expect(fake.setCurrentTool).toHaveBeenCalledWith("select");
  });

  it("locks the background again, deselects it, and sends it to the back", () => {
    const fake = createFakeEditor([nodeShape(), backgroundShape(false)]);
    fake.editor.select(BG_ID);
    expect(setBackgroundEditable(fake.editor, false)).toBe(true);
    const background = fake.byId.get(BG_ID);
    expect(background?.isLocked).toBe(true);
    expect(background?.index).toBe("a0");
    expect(fake.selected()).toEqual([]);
  });

  it("does nothing without a background", () => {
    const fake = createFakeEditor([nodeShape()]);
    expect(setBackgroundEditable(fake.editor, true)).toBe(false);
    expect(removeBackground(fake.editor)).toBe(false);
    expect(fake.byId.has(NODE_ID)).toBe(true);
  });

  it("removes a locked background and leaves nodes alone", () => {
    const fake = createFakeEditor([nodeShape(), backgroundShape(true)]);
    expect(removeBackground(fake.editor)).toBe(true);
    expect(fake.byId.has(BG_ID)).toBe(false);
    expect(fake.byId.has(NODE_ID)).toBe(true);
  });

  it("sends a locked background behind the graph", () => {
    const fake = createFakeEditor([nodeShape(), backgroundShape(true)]);
    sendBackgroundToBack(fake.editor, [BG_ID]);
    expect(fake.byId.get(BG_ID)?.index).toBe("a0");
  });
});
