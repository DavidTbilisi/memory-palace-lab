import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePalaceStore } from "../store/palaceStore";
import { CountShapeControls } from "./CountShapeControls";

// The selector is read once per render; the tests re-render after changing the canvas.
vi.mock("@tldraw/editor", () => ({
  useValue: (_name: string, fn: () => unknown) => fn(),
}));

type FakeShape = { id: string; type: string; x: number; y: number; meta: Record<string, unknown> };

function fakeEditor(targets: number) {
  const shapes: FakeShape[] = [{ id: "shape:hub", type: "geo", x: 0, y: 0, meta: { mpNodeId: "hub" } }];
  for (let i = 0; i < targets; i++) {
    shapes.push({ id: `shape:m${i}`, type: "geo", x: 400, y: i * 150, meta: { mpNodeId: `m${i}` } });
    shapes.push({ id: `shape:e${i}`, type: "arrow", x: 0, y: 0, meta: { mpEdgeId: `e${i}`, mpSourceNodeId: "hub", mpTargetNodeId: `m${i}` } });
  }
  return {
    getCurrentPageShapeIds: () => shapes.map((s) => s.id),
    getShape: (id: string) => shapes.find((s) => s.id === id),
    getShapePageBounds: (id: string) => {
      const s = shapes.find((shape) => shape.id === id);
      return s ? { x: s.x, y: s.y, w: 180, h: 100 } : null;
    },
    updateShape: ({ id, x, y }: { id: string; x: number; y: number }) => {
      const s = shapes.find((shape) => shape.id === id)!;
      s.x = x;
      s.y = y;
    },
    run: (fn: () => void) => fn(),
    markHistoryStoppingPoint: () => undefined,
  };
}

function mount(targets: number) {
  act(() => usePalaceStore.setState({ editorRef: fakeEditor(targets) as never }));
  return render(<CountShapeControls nodeId="hub" />);
}

beforeEach(() => {
  act(() => usePalaceStore.setState({ editorRef: null }));
});

describe("CountShapeControls", () => {
  it("stays hidden until a node has two outgoing edges", () => {
    const { container } = mount(1);
    expect(container).toBeEmptyDOMElement();
  });

  it("asks whether the set is ordered, and lays out a polygon of its size", async () => {
    const user = userEvent.setup();
    mount(5);
    expect(screen.getByText(/5 linked nodes\. Is this set ordered\?.*pentagon/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Polygon (unordered)" }));
    expect(screen.getByRole("status")).toHaveTextContent("Laid out as a pentagon. An empty corner is a missing member.");
  });

  it("offers only the ladder above seven, and says why", async () => {
    const user = userEvent.setup();
    mount(9);
    expect(screen.queryByRole("button", { name: "Polygon (unordered)" })).toBeNull();
    expect(screen.getByText(/More than 7: Above seven, a polygon stops being readable/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ladder (ordered)" }));
    expect(screen.getByRole("status")).toHaveTextContent("Laid out as a ladder of 9, top to bottom.");
  });
});
