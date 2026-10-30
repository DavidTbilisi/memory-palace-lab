import { describe, expect, it } from "vitest";
import { LADDER_REASON } from "../domain/services/countShape";
import { applyCountShape, outgoingTargetNodeIds, type CountShapeEditor } from "./applyCountShape";

type FakeShape = { id: string; type: string; x: number; y: number; w: number; h: number; meta: Record<string, unknown> };

/** Page-level shapes with plain bounds, like the MCP server's snapshot editor. */
function fakeEditor(shapes: FakeShape[]) {
  const marks: string[] = [];
  const editor: CountShapeEditor & { marks: string[] } = {
    marks,
    getCurrentPageShapeIds: () => shapes.map((s) => s.id),
    getShape: (id) => shapes.find((s) => s.id === id),
    getShapePageBounds: (id) => {
      const s = shapes.find((shape) => shape.id === id);
      return s ? { x: s.x, y: s.y, w: s.w, h: s.h } : null;
    },
    updateShape: ({ id, x, y }) => {
      const s = shapes.find((shape) => shape.id === id)!;
      s.x = x;
      s.y = y;
    },
    run: (fn) => fn(),
    markHistoryStoppingPoint: (name) => marks.push(name ?? ""),
  };
  return editor;
}

const node = (nodeId: string, x: number, y: number): FakeShape => ({
  id: `shape:${nodeId}`,
  type: "geo",
  x,
  y,
  w: 180,
  h: 100,
  meta: { mpNodeId: nodeId },
});

const edge = (from: string, to: string): FakeShape => ({
  id: `shape:${from}-${to}`,
  type: "arrow",
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  meta: { mpEdgeId: `${from}-${to}`, mpSourceNodeId: from, mpTargetNodeId: to },
});

/** A hub centred on the origin with `count` targets scattered to its right. */
function hubWith(count: number) {
  const members = Array.from({ length: count }, (_, i) => node(`m${i}`, 400 + i * 10, -300 + i * 90));
  const shapes = [node("hub", -90, -50), ...members, ...members.map((m) => edge("hub", m.meta.mpNodeId as string))];
  return { editor: fakeEditor(shapes), members };
}

const centreOf = (s: FakeShape) => ({ x: Math.round(s.x + s.w / 2), y: Math.round(s.y + s.h / 2) });

describe("applyCountShape", () => {
  it("finds a node's distinct outgoing targets, not its incoming ones or itself", () => {
    const editor = fakeEditor([node("a", 0, 0), node("b", 0, 0), node("c", 0, 0), edge("a", "b"), edge("a", "b"), edge("c", "a"), edge("a", "a")]);
    expect(outgoingTargetNodeIds(editor, "a")).toEqual(["b"]);
  });

  it("puts five targets on a pentagon around the hub, one undo step", () => {
    const { editor, members } = hubWith(5);
    expect(applyCountShape(editor, "hub", "polygon")).toEqual({ ok: true, kind: "polygon", count: 5, shapeName: "pentagon", note: null });
    const radii = members.map((m) => Math.round(Math.hypot(centreOf(m).x, centreOf(m).y)));
    expect(new Set(radii).size).toBe(1);
    expect(members.some((m) => centreOf(m).x === 0 && centreOf(m).y < 0)).toBe(true); // a vertex at the top
    expect(editor.marks).toEqual(["count-shape layout"]);
  });

  it("keeps members in their clockwise order around the hub", () => {
    const shapes = [node("hub", -90, -50), node("left", -600, -50), node("right", 500, -50), node("below", -90, 500)];
    const editor = fakeEditor([...shapes, edge("hub", "left"), edge("hub", "right"), edge("hub", "below")]);
    applyCountShape(editor, "hub", "polygon");
    // Clockwise from the top they read right, below, left; the triangle keeps that cycle.
    const [left, right, below] = [shapes[1], shapes[2], shapes[3]].map(centreOf);
    expect(right).toEqual({ x: 0, y: -260 });
    expect(below.x).toBeGreaterThan(0);
    expect(left.x).toBeLessThan(0);
    expect(below.y).toBe(left.y);
  });

  it("lays out an ordered ladder in the order the members read top to bottom", () => {
    const { editor, members } = hubWith(3);
    members.reverse().forEach((m, i) => (m.y = i * 200)); // m2 is now on top
    expect(applyCountShape(editor, "hub", "ladder")).toMatchObject({ ok: true, kind: "ladder", shapeName: null, note: null });
    const ys = members.map((m) => centreOf(m).y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    expect(new Set(members.map((m) => centreOf(m).x)).size).toBe(1);
  });

  it("takes a ladder for a polygon of more than seven, and says why", () => {
    const { editor } = hubWith(9);
    expect(applyCountShape(editor, "hub", "polygon")).toEqual({ ok: true, kind: "ladder", count: 9, shapeName: null, note: LADDER_REASON });
  });

  it("refuses a node with fewer than two targets, and a missing node", () => {
    const { editor } = hubWith(1);
    expect(applyCountShape(editor, "hub", "polygon")).toMatchObject({ ok: false, message: expect.stringContaining("at least two") });
    expect(applyCountShape(editor, "nope", "polygon")).toMatchObject({ ok: false });
    expect(editor.marks).toEqual([]);
  });
});
