import { describe, it, expect } from "vitest";
import { analyzeGraph } from "./graphAnalysis";
import { detectMotifs, groupMotifs } from "./castMotifs";
import { palaceSignature, similarityScore, topSimilarPalaces } from "./palaceSimilarity";

const nodes = (...ids: string[]) => ids.map((id) => ({ id }));
const edge = (s: string, t: string) => ({ sourceNodeId: s, targetNodeId: t });

function makeSig(id: string, name: string, input: { nodes: { id: string }[]; edges: { sourceNodeId: string; targetNodeId: string }[] }) {
  const analysis = analyzeGraph(input);
  const motifs = detectMotifs(input);
  const groups = groupMotifs(motifs);
  return palaceSignature(id, name, analysis, groups);
}

describe("palaceSimilarity", () => {
  it("a palace is perfectly similar to itself", () => {
    const sig = makeSig("p1", "P1", {
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("a", "c"), edge("b", "d"), edge("c", "d")],
    });
    expect(similarityScore(sig, sig)).toBeCloseTo(1, 5);
  });

  it("scores two diamond palaces more similar than diamond vs hub-spoke", () => {
    const diamond1 = makeSig("d1", "Diamond1", {
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("a", "c"), edge("b", "d"), edge("c", "d")],
    });
    const diamond2 = makeSig("d2", "Diamond2", {
      nodes: nodes("w", "x", "y", "z"),
      edges: [edge("w", "x"), edge("w", "y"), edge("x", "z"), edge("y", "z")],
    });
    const hub = makeSig("h", "Hub", {
      nodes: nodes("h", "s1", "s2", "s3"),
      edges: [edge("h", "s1"), edge("h", "s2"), edge("h", "s3")],
    });
    const diamondScore = similarityScore(diamond1, diamond2);
    const hubScore = similarityScore(diamond1, hub);
    expect(diamondScore).toBeGreaterThan(hubScore);
  });

  it("empty palace produces a defined signature with zeros", () => {
    const sig = makeSig("empty", "Empty", { nodes: [], edges: [] });
    expect(sig.features.every((f) => Number.isFinite(f))).toBe(true);
    expect(sig.motifKindsPresent.size).toBe(0);
  });

  it("topSimilarPalaces excludes the current palace and orders by score", () => {
    const current = makeSig("c", "Current", {
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("a", "c"), edge("b", "d"), edge("c", "d")],
    });
    const twin = makeSig("twin", "Twin", {
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("a", "c"), edge("b", "d"), edge("c", "d")],
    });
    const unrelated = makeSig("u", "Unrelated", {
      nodes: nodes("x", "y"),
      edges: [edge("x", "y")],
    });

    const top = topSimilarPalaces(current, [current, twin, unrelated], 3);
    expect(top.map((t) => t.signature.palaceId)).not.toContain("c");
    expect(top[0]?.signature.palaceId).toBe("twin");
  });

  it("topSimilarPalaces filters out zero-score matches", () => {
    const a = makeSig("a", "A", { nodes: [], edges: [] });
    const b = makeSig("b", "B", { nodes: [], edges: [] });
    // both empty → similarity 0 → filtered
    expect(topSimilarPalaces(a, [b])).toEqual([]);
  });

  it("similarityScore favors instance-overlap palaces over kind-only matches", () => {
    // Build two palaces with the same kind composition (one hub-spoke each).
    // Inject motifInstances so anchor labels differ.
    const baseInput = {
      nodes: nodes("CAP", "A", "B", "C"),
      edges: [edge("CAP", "A"), edge("CAP", "B"), edge("CAP", "C")],
    };
    const otherInput = {
      nodes: nodes("Latency", "X", "Y", "Z"),
      edges: [edge("Latency", "X"), edge("Latency", "Y"), edge("Latency", "Z")],
    };
    const current = makeSig("c", "Current", baseInput);
    const twinByAnchor = makeSig("twin", "Twin", baseInput);
    const otherAnchor = makeSig("other", "Other", otherInput);
    // Inject motifInstances on each signature
    current.motifInstances = {
      cascade: [],
      diamond: [],
      hubSpoke: [{ hub: "CAP", spokes: ["A", "B", "C"] }],
      feedbackLoop: [],
      bottleneck: [],
      bipartite: [],
    };
    twinByAnchor.motifInstances = {
      cascade: [],
      diamond: [],
      hubSpoke: [{ hub: "CAP", spokes: ["A", "B", "C"] }],
      feedbackLoop: [],
      bottleneck: [],
      bipartite: [],
    };
    otherAnchor.motifInstances = {
      cascade: [],
      diamond: [],
      hubSpoke: [{ hub: "Latency", spokes: ["X", "Y", "Z"] }],
      feedbackLoop: [],
      bottleneck: [],
      bipartite: [],
    };

    const sameAnchor = similarityScore(current, twinByAnchor);
    const differentAnchor = similarityScore(current, otherAnchor);
    expect(sameAnchor).toBeGreaterThan(differentAnchor);
  });
});
