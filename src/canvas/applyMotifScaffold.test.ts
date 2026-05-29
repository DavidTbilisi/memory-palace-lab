import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Editor } from "@tldraw/editor";
import { applyMotifScaffold } from "./applyMotifScaffold";
import { createGeoMemoryNode, createMemoryArrow } from "./createMemoryShapes";
import { instantiateMotif, type MotifScaffold } from "../domain/services/cast/motifTemplates";

vi.mock("./createMemoryShapes", () => ({
  createGeoMemoryNode: vi.fn(),
  createMemoryArrow: vi.fn(),
}));

const editor = {} as Editor;
const PALACE = "palace-1";

beforeEach(() => {
  vi.clearAllMocks();
  let n = 0;
  vi.mocked(createGeoMemoryNode).mockImplementation(() => {
    n += 1;
    return { shapeId: `shape-${n}`, objectId: `obj-${n}`, nodeId: `node-${n}` } as ReturnType<
      typeof createGeoMemoryNode
    >;
  });
});

/** Position passed to createGeoMemoryNode for each scaffold slot (calls run in node order). */
function positionsBySlot(scaffold: MotifScaffold): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  scaffold.nodes.forEach((node, i) => {
    map.set(node.slot, vi.mocked(createGeoMemoryNode).mock.calls[i]![2] as { x: number; y: number });
  });
  return map;
}

describe("applyMotifScaffold", () => {
  it("creates one node per scaffold slot, in order, and returns their handles", () => {
    const scaffold = instantiateMotif("cascade");
    const created = applyMotifScaffold(editor, PALACE, scaffold);

    expect(created).toHaveLength(scaffold.nodes.length);
    expect(created.map((c) => c.slot)).toEqual(scaffold.nodes.map((n) => n.slot));
    expect(created[0]).toEqual({ slot: "n0", shapeId: "shape-1", nodeId: "node-1" });
    expect(vi.mocked(createGeoMemoryNode)).toHaveBeenCalledTimes(scaffold.nodes.length);
    // Titles flow through to the created node.
    expect(vi.mocked(createGeoMemoryNode).mock.calls[0]![3]).toEqual({ title: "Step 1" });
  });

  it("draws one arrow per edge, wiring handles and the edge's CAST signature", () => {
    const scaffold = instantiateMotif("cascade");
    applyMotifScaffold(editor, PALACE, scaffold);

    expect(vi.mocked(createMemoryArrow)).toHaveBeenCalledTimes(scaffold.edges.length);
    const firstEdge = scaffold.edges[0]!;
    // n0 → n1 ⇒ first/second created handles.
    expect(vi.mocked(createMemoryArrow)).toHaveBeenNthCalledWith(
      1,
      editor,
      PALACE,
      "shape-1",
      "shape-2",
      "node-1",
      "node-2",
      {
        ab: firstEdge.cast.ab,
        cd: firstEdge.cast.cd,
        ef: firstEdge.cast.ef,
        gh: firstEdge.cast.gh,
        label: firstEdge.label,
      },
    );
  });

  it("lays out a cascade as a horizontal row from the origin", () => {
    const scaffold = instantiateMotif("cascade");
    applyMotifScaffold(editor, PALACE, scaffold, { x: 100, y: 100 });
    const pos = positionsBySlot(scaffold);
    expect(pos.get("n0")).toEqual({ x: 100, y: 100 });
    expect(pos.get("n1")).toEqual({ x: 360, y: 100 });
    expect(pos.get("n2")).toEqual({ x: 620, y: 100 });
  });

  it("lays out a diamond as four corners", () => {
    const scaffold = instantiateMotif("diamond");
    applyMotifScaffold(editor, PALACE, scaffold, { x: 0, y: 0 });
    const pos = positionsBySlot(scaffold);
    expect(pos.get("src")).toEqual({ x: 0, y: 0 });
    expect(pos.get("l")).toEqual({ x: 260, y: -180 });
    expect(pos.get("r")).toEqual({ x: 260, y: 180 });
    expect(pos.get("snk")).toEqual({ x: 520, y: 0 });
  });

  it("centers a hub-spoke hub and rings the spokes around it", () => {
    const scaffold = instantiateMotif("hubSpoke");
    applyMotifScaffold(editor, PALACE, scaffold, { x: 0, y: 0 });
    const pos = positionsBySlot(scaffold);
    expect(pos.get("hub")).toEqual({ x: 0, y: 0 });
    // First spoke sits straight above the hub (radius 260).
    expect(pos.get("s0")!.x).toBeCloseTo(0);
    expect(pos.get("s0")!.y).toBeCloseTo(-260);
    // All spokes lie on the ring.
    for (const s of scaffold.nodes.slice(1)) {
      const p = pos.get(s.slot)!;
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(260);
    }
  });

  it("places feedback-loop nodes on a circle", () => {
    const scaffold = instantiateMotif("feedbackLoop");
    applyMotifScaffold(editor, PALACE, scaffold, { x: 0, y: 0 });
    const pos = positionsBySlot(scaffold);
    const radius = 260 * 0.8;
    for (const node of scaffold.nodes) {
      const p = pos.get(node.slot)!;
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(radius);
    }
  });

  it("lays out a bottleneck as an hourglass through the choke", () => {
    const scaffold = instantiateMotif("bottleneck");
    applyMotifScaffold(editor, PALACE, scaffold, { x: 0, y: 0 });
    const pos = positionsBySlot(scaffold);
    expect(pos.get("choke")).toEqual({ x: 0, y: 0 });
    expect(pos.get("la")!.x).toBeLessThan(0);
    expect(pos.get("rb")!.x).toBeGreaterThan(0);
  });

  it("splits a bipartite scaffold into two columns", () => {
    const scaffold = instantiateMotif("bipartite");
    applyMotifScaffold(editor, PALACE, scaffold, { x: 0, y: 0 });
    const pos = positionsBySlot(scaffold);
    for (const node of scaffold.nodes) {
      const p = pos.get(node.slot)!;
      if (node.slot.startsWith("a")) expect(p.x).toBe(-260);
      if (node.slot.startsWith("b")) expect(p.x).toBe(260);
    }
  });

  it("skips edges whose endpoints have no created node", () => {
    const scaffold: MotifScaffold = {
      kind: "cascade",
      nodes: [
        { slot: "n0", title: "A" },
        { slot: "n1", title: "B" },
      ],
      edges: [
        { fromSlot: "n0", toSlot: "n1", label: "feeds", cast: { ab: "a", cd: "c", ef: "e", gh: "g" } },
        { fromSlot: "n1", toSlot: "ghost", label: "feeds", cast: { ab: "a", cd: "c", ef: "e", gh: "g" } },
      ],
    };
    applyMotifScaffold(editor, PALACE, scaffold);
    expect(vi.mocked(createMemoryArrow)).toHaveBeenCalledTimes(1);
  });
});
