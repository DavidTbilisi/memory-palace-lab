import type { Editor } from "@tldraw/editor";
import { describe, expect, it } from "vitest";
import { ensureUniqueMemoryIds, registerMemoryIdGuard } from "./memoryIds";
import type { MemoryPalaceMeta } from "./memoryMeta";

type FakeShape = { id: string; type: "geo" | "arrow"; meta: MemoryPalaceMeta };
type FakeBinding = { fromId: string; toId: string; props: { terminal: "start" | "end" } };

const PALACE = "palace-1";

/** Shapes are listed bottom to top, the order tldraw hands out and copies sit on top of. */
function fakeEditor(shapes: FakeShape[], bindings: FakeBinding[] = []) {
  let handler: ((shape: FakeShape) => FakeShape) | null = null;
  const fake = {
    getCurrentPageShapeIds: () => new Set(shapes.map((shape) => shape.id)),
    getCurrentPageShapesSorted: () => [...shapes],
    getShape: (id: string) => shapes.find((shape) => shape.id === id),
    getBindingsToShape: (id: string) => bindings.filter((binding) => binding.toId === id),
    run: (fn: () => void) => fn(),
    updateShapes: (updates: Array<{ id: string; meta: MemoryPalaceMeta }>) => {
      for (const update of updates) {
        const shape = shapes.find((candidate) => candidate.id === update.id);
        if (shape) shape.meta = update.meta;
      }
    },
    sideEffects: {
      registerBeforeCreateHandler: (_type: string, fn: (shape: FakeShape) => FakeShape) => {
        handler = fn;
        return () => {
          handler = null;
        };
      },
    },
  };
  return {
    shapes,
    editor: fake as unknown as Editor,
    create: (shape: FakeShape) => (handler ? handler(shape) : shape),
  };
}

function node(id: string, meta: Partial<MemoryPalaceMeta>): FakeShape {
  return {
    id,
    type: "geo",
    meta: { mpPalaceId: PALACE, mpObjectId: "obj-1", mpNodeId: "node-1", ...meta },
  };
}

describe("ensureUniqueMemoryIds", () => {
  it("gives every copy of a node ids of its own and leaves the lowest one alone", () => {
    const { shapes, editor } = fakeEditor([
      node("shape:1", { mpTitle: "The Law" }),
      node("shape:2", { mpTitle: "History" }),
      node("shape:3", { mpTitle: "Wisdom" }),
    ]);

    expect(ensureUniqueMemoryIds(editor, PALACE)).toBe(2);
    expect(shapes[0].meta).toMatchObject({ mpObjectId: "obj-1", mpNodeId: "node-1" });
    const objectIds = shapes.map((shape) => shape.meta.mpObjectId);
    const nodeIds = shapes.map((shape) => shape.meta.mpNodeId);
    expect(new Set(objectIds).size).toBe(3);
    expect(new Set(nodeIds).size).toBe(3);
    expect(shapes.map((shape) => shape.meta.mpTitle)).toEqual(["The Law", "History", "Wisdom"]);
    expect(shapes.every((shape) => shape.meta.mpPalaceId === PALACE)).toBe(true);
  });

  it("leaves a page without copies as it is", () => {
    const { shapes, editor } = fakeEditor([
      node("shape:1", {}),
      node("shape:2", { mpObjectId: "obj-2", mpNodeId: "node-2" }),
    ]);
    const before = shapes.map((shape) => ({ ...shape.meta }));

    expect(ensureUniqueMemoryIds(editor, PALACE)).toBe(0);
    expect(shapes.map((shape) => shape.meta)).toEqual(before);
  });

  it("points an arrow that hangs on a copy at the copy", () => {
    const arrow: FakeShape = {
      id: "shape:arrow",
      type: "arrow",
      meta: {
        mpPalaceId: PALACE,
        mpObjectId: "obj-arrow",
        mpEdgeId: "edge-1",
        mpSourceNodeId: "node-1",
        mpTargetNodeId: "node-2",
      },
    };
    const { shapes, editor } = fakeEditor(
      [
        node("shape:1", {}),
        node("shape:2", { mpObjectId: "obj-2", mpNodeId: "node-2" }),
        node("shape:copy", {}),
        arrow,
      ],
      [{ fromId: "shape:arrow", toId: "shape:copy", props: { terminal: "start" } }],
    );

    expect(ensureUniqueMemoryIds(editor, PALACE)).toBe(2);
    const copyNodeId = shapes[2].meta.mpNodeId;
    expect(copyNodeId).not.toBe("node-1");
    expect(shapes[3].meta.mpSourceNodeId).toBe(copyNodeId);
    expect(shapes[3].meta.mpTargetNodeId).toBe("node-2");
    expect(shapes[3].meta.mpEdgeId).toBe("edge-1");
  });

  it("separates two arrows that carry the same edge id", () => {
    const edge = (id: string): FakeShape => ({
      id,
      type: "arrow",
      meta: {
        mpPalaceId: PALACE,
        mpObjectId: "obj-arrow",
        mpEdgeId: "edge-1",
        mpSourceNodeId: "node-1",
        mpTargetNodeId: "node-2",
      },
    });
    const { shapes, editor } = fakeEditor([edge("shape:a"), edge("shape:b")]);

    expect(ensureUniqueMemoryIds(editor, PALACE)).toBe(1);
    expect(shapes[0].meta.mpEdgeId).toBe("edge-1");
    expect(shapes[1].meta.mpEdgeId).not.toBe("edge-1");
    expect(shapes[1].meta.mpObjectId).not.toBe("obj-arrow");
    expect(shapes[1].meta.mpSourceNodeId).toBe("node-1");
  });
});

describe("registerMemoryIdGuard", () => {
  it("gives a node copied on the canvas ids of its own", () => {
    const { editor, create } = fakeEditor([node("shape:1", { mpTitle: "The Law" })]);
    registerMemoryIdGuard(editor, () => PALACE);

    const created = create(node("shape:2", { mpTitle: "The Law" }));

    expect(created.meta.mpObjectId).not.toBe("obj-1");
    expect(created.meta.mpNodeId).not.toBe("node-1");
    expect(created.meta.mpTitle).toBe("The Law");
  });

  it("gives a node pasted from another palace ids of its own", () => {
    const { editor, create } = fakeEditor([]);
    registerMemoryIdGuard(editor, () => PALACE);

    const created = create(
      node("shape:2", { mpPalaceId: "palace-2", mpObjectId: "obj-9", mpNodeId: "node-9" }),
    );

    expect(created.meta.mpPalaceId).toBe(PALACE);
    expect(created.meta.mpObjectId).not.toBe("obj-9");
    expect(created.meta.mpNodeId).not.toBe("node-9");
  });

  it("leaves a new node and shapes without ids alone", () => {
    const { editor, create } = fakeEditor([node("shape:1", {})]);
    registerMemoryIdGuard(editor, () => PALACE);

    const fresh = node("shape:2", { mpObjectId: "obj-2", mpNodeId: "node-2" });
    expect(create(fresh)).toBe(fresh);

    const drawing = { id: "shape:3", type: "geo" as const, meta: {} };
    expect(create(drawing)).toBe(drawing);
  });
});
