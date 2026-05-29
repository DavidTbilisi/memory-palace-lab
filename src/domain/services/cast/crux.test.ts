import { describe, expect, it } from "vitest";
import { analyzeGraph, type GraphAnalysisResult } from "./graphAnalysis";
import { selectCrux } from "./crux";

const nodes = (...ids: string[]) => ids.map((id) => ({ id }));
const edge = (sourceNodeId: string, targetNodeId: string) => ({ sourceNodeId, targetNodeId });

describe("selectCrux", () => {
  it("returns null for an empty graph", () => {
    expect(selectCrux(analyzeGraph({ nodes: [], edges: [] }))).toBeNull();
  });

  it("returns null when there are nodes but no edges", () => {
    expect(selectCrux(analyzeGraph({ nodes: nodes("a", "b"), edges: [] }))).toBeNull();
  });

  it("picks the highest-betweenness node as the crux on a chain", () => {
    // a → b → c → d → e: every cross-path runs through the middle, c.
    const analysis = analyzeGraph({
      nodes: nodes("a", "b", "c", "d", "e"),
      edges: [edge("a", "b"), edge("b", "c"), edge("c", "d"), edge("d", "e")],
    });
    expect(selectCrux(analysis)).toEqual({ nodeId: "c", reason: "betweenness" });
  });

  it("falls back to the highest-degree bridge endpoint when betweenness is all zero", () => {
    // a → b ← c: two single-hop edges, no node sits between two others, so
    // betweenness is zero. Both edges are bridges and b is the shared endpoint.
    const analysis = analyzeGraph({
      nodes: nodes("a", "b", "c"),
      edges: [edge("a", "b"), edge("c", "b")],
    });
    expect(selectCrux(analysis)).toEqual({ nodeId: "b", reason: "bridge" });
  });

  it("returns the highest-degree bridge endpoint on an in-star", () => {
    // Star edges are all bridges; the hub is the highest-degree endpoint.
    const analysis = analyzeGraph({
      nodes: nodes("hub", "a", "b", "c"),
      edges: [edge("a", "hub"), edge("b", "hub"), edge("c", "hub")],
    });
    expect(selectCrux(analysis)).toEqual({ nodeId: "hub", reason: "bridge" });
  });

  it("falls back to the highest-degree hub when there is no betweenness and no bridge", () => {
    // Synthetic shape that isolates the hub branch: zero betweenness, no bridges,
    // two hub-role nodes where h2 has the higher degree.
    const analysis: GraphAnalysisResult = {
      nodeCount: 3,
      edgeCount: 4,
      inDegree: { h1: 2, h2: 3, x: 0 },
      outDegree: { h1: 0, h2: 0, x: 0 },
      betweenness: {},
      bridges: [],
      sccs: [],
      roleByNode: { h1: "hub", h2: "hub", x: "leaf" },
    };
    expect(selectCrux(analysis)).toEqual({ nodeId: "h2", reason: "hub" });
  });
});
