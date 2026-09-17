import type { Editor, TLShapeId } from "@tldraw/editor";
import { describe, expect, it, vi } from "vitest";
import { captureStopView, memoryNodeShapeId, stopViewPageBounds, zoomToStop } from "./routeCanvas";

type Box = { x: number; y: number; w: number; h: number };

function fakeEditor(nodes: Record<string, Box>, viewport: Box) {
  const container = document.createElement("div");
  container.innerHTML = '<div class="tl-canvas"></div>';
  const shapes = Object.entries(nodes).map(([nodeId, bounds], index) => ({
    id: `shape:${index}`,
    type: "geo",
    meta: { mpNodeId: nodeId },
    bounds,
  }));
  const fake = {
    getCurrentPageShapeIds: () => new Set(shapes.map((shape) => shape.id)),
    getShape: (id: string) => shapes.find((shape) => shape.id === id),
    getShapePageBounds: (id: string) => shapes.find((shape) => shape.id === id)?.bounds,
    getViewportPageBounds: () => viewport,
    getContainer: () => container,
    updateViewportScreenBounds: vi.fn(),
    zoomToBounds: vi.fn(),
    zoomToSelection: vi.fn(),
  };
  return { fake, editor: fake as unknown as Editor };
}

const shapeId = (id: string) => id as TLShapeId;

describe("captureStopView", () => {
  it("saves the visible area relative to the node's center, rounded", () => {
    const { editor } = fakeEditor(
      { n1: { x: 100, y: 50, w: 200, h: 100 } },
      { x: -100.123, y: -50, w: 800.456, h: 600 },
    );
    expect(captureStopView(editor, "n1")).toEqual({ x: -300.12, y: -150, w: 800.46, h: 600 });
  });

  it("takes no view of a node that is missing or out of sight", () => {
    const { editor } = fakeEditor({ n1: { x: 2000, y: 0, w: 200, h: 100 } }, { x: 0, y: 0, w: 800, h: 600 });
    expect(captureStopView(editor, "n1")).toBeNull();
    expect(captureStopView(editor, "n2")).toBeNull();
  });
});

describe("zoomToStop", () => {
  const view = { x: -300, y: -150, w: 800, h: 600 };

  it("places a saved view around the node's current center", () => {
    const { fake, editor } = fakeEditor({ n1: { x: 500, y: 500, w: 200, h: 100 } }, { x: 0, y: 0, w: 1, h: 1 });
    const id = memoryNodeShapeId(editor, "n1")!;
    expect(stopViewPageBounds(editor, id, view)).toEqual({ x: 300, y: 400, w: 800, h: 600 });

    zoomToStop(editor, id, view);
    // Measured first: a walk resizes the canvas in the same render that moves the camera.
    expect(fake.updateViewportScreenBounds).toHaveBeenCalledWith(
      editor.getContainer().querySelector(".tl-canvas"),
    );
    expect(fake.updateViewportScreenBounds.mock.invocationCallOrder[0]).toBeLessThan(
      fake.zoomToBounds.mock.invocationCallOrder[0]!,
    );
    expect(fake.zoomToBounds).toHaveBeenCalledWith(
      { x: 300, y: 400, w: 800, h: 600 },
      { inset: 0, animation: { duration: 320 } },
    );
    expect(fake.zoomToSelection).not.toHaveBeenCalled();
  });

  it("zooms to the selected node when there is no view to show", () => {
    const { fake, editor } = fakeEditor({ n1: { x: 0, y: 0, w: 200, h: 100 } }, { x: 0, y: 0, w: 1, h: 1 });
    zoomToStop(editor, shapeId("shape:0"), null);
    zoomToStop(editor, shapeId("shape:gone"), view);

    expect(fake.zoomToSelection).toHaveBeenCalledTimes(2);
    expect(fake.zoomToSelection).toHaveBeenCalledWith({ animation: { duration: 320 } });
    expect(fake.zoomToBounds).not.toHaveBeenCalled();
  });
});
