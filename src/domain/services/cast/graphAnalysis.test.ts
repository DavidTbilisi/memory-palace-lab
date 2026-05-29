import { describe, it, expect } from "vitest";
import { analyzeGraph, topByMetric } from "./graphAnalysis";

const nodes = (...ids: string[]) => ids.map((id) => ({ id }));
const edge = (sourceNodeId: string, targetNodeId: string) => ({ sourceNodeId, targetNodeId });

describe("analyzeGraph", () => {
  it("handles empty input", () => {
    const r = analyzeGraph({ nodes: [], edges: [] });
    expect(r.nodeCount).toBe(0);
    expect(r.edgeCount).toBe(0);
    expect(r.sccs).toEqual([]);
    expect(r.bridges).toEqual([]);
  });

  it("ignores edges referencing unknown nodes", () => {
    const r = analyzeGraph({ nodes: nodes("a", "b"), edges: [edge("a", "ghost")] });
    expect(r.edgeCount).toBe(1); // edgeCount = input length; degrees stay zero
    expect(r.inDegree).toEqual({ a: 0, b: 0 });
    expect(r.outDegree).toEqual({ a: 0, b: 0 });
  });

  it("computes in/out degrees on a hub-and-spoke (hub = a)", () => {
    const r = analyzeGraph({
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("a", "c"), edge("a", "d")],
    });
    expect(r.outDegree.a).toBe(3);
    expect(r.inDegree.b).toBe(1);
    expect(r.inDegree.c).toBe(1);
    expect(r.inDegree.d).toBe(1);
  });

  it("classifies a star with high in-degree center as a hub", () => {
    const r = analyzeGraph({
      nodes: nodes("hub", "a", "b", "c", "d"),
      edges: [edge("a", "hub"), edge("b", "hub"), edge("c", "hub"), edge("d", "hub")],
    });
    expect(r.roleByNode.hub).toBe("hub");
    expect(r.roleByNode.a).toBe("leaf");
  });

  it("marks isolated nodes", () => {
    const r = analyzeGraph({ nodes: nodes("alone", "x", "y"), edges: [edge("x", "y")] });
    expect(r.roleByNode.alone).toBe("isolate");
    expect(r.roleByNode.x).toBe("leaf");
    expect(r.roleByNode.y).toBe("leaf");
  });

  it("finds SCCs on a triangle plus a tail", () => {
    // a → b → c → a (cycle), c → d (tail)
    const r = analyzeGraph({
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("b", "c"), edge("c", "a"), edge("c", "d")],
    });
    const nonTrivial = r.sccs.filter((c) => c.length > 1);
    expect(nonTrivial).toHaveLength(1);
    expect([...nonTrivial[0]!].sort()).toEqual(["a", "b", "c"]);
  });

  it("finds bridges across two clusters connected by one edge", () => {
    // Cluster 1: a-b-c (triangle), Cluster 2: d-e-f (triangle), bridge: c-d
    const r = analyzeGraph({
      nodes: nodes("a", "b", "c", "d", "e", "f"),
      edges: [
        edge("a", "b"),
        edge("b", "c"),
        edge("c", "a"),
        edge("d", "e"),
        edge("e", "f"),
        edge("f", "d"),
        edge("c", "d"),
      ],
    });
    expect(r.bridges).toHaveLength(1);
    const b = r.bridges[0]!;
    expect([b.sourceNodeId, b.targetNodeId].sort()).toEqual(["c", "d"]);
  });

  it("Brandes betweenness ranks a chain's middle node highest", () => {
    // a → b → c → d → e
    const r = analyzeGraph({
      nodes: nodes("a", "b", "c", "d", "e"),
      edges: [edge("a", "b"), edge("b", "c"), edge("c", "d"), edge("d", "e")],
    });
    const top = topByMetric(r.betweenness, 1)[0];
    expect(top?.id).toBe("c");
  });

  it("finds two disjoint strongly connected components", () => {
    // a ⇄ b and c ⇄ d, with no edge between the pairs.
    const r = analyzeGraph({
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("b", "a"), edge("c", "d"), edge("d", "c")],
    });
    const nonTrivial = r.sccs.filter((c) => c.length > 1).map((c) => [...c].sort());
    expect(nonTrivial).toHaveLength(2);
    expect(nonTrivial).toContainEqual(["a", "b"]);
    expect(nonTrivial).toContainEqual(["c", "d"]);
  });

  it("assigns exact Brandes betweenness on a short chain", () => {
    // a → b → c: only the a→c shortest path runs through b.
    const r = analyzeGraph({ nodes: nodes("a", "b", "c"), edges: [edge("a", "b"), edge("b", "c")] });
    expect(r.betweenness.b).toBe(1);
    expect(r.betweenness.a).toBe(0);
    expect(r.betweenness.c).toBe(0);
  });

  it("topByMetric breaks ties alphabetically and drops zeros", () => {
    const m = { z: 0, b: 5, a: 5, c: 3 };
    expect(topByMetric(m, 3)).toEqual([
      { id: "a", value: 5 },
      { id: "b", value: 5 },
      { id: "c", value: 3 },
    ]);
  });
});
