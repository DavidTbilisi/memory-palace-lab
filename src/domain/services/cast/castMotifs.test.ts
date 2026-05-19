import { describe, it, expect } from "vitest";
import { MOTIF_MOVES, detectMotifs, groupMotifs, type Motif, type MotifKind } from "./castMotifs";

const nodes = (...ids: string[]) => ids.map((id) => ({ id }));
const edge = (sourceNodeId: string, targetNodeId: string) => ({ sourceNodeId, targetNodeId });

const ofKind = <K extends Motif["kind"]>(motifs: Motif[], kind: K) =>
  motifs.filter((m): m is Extract<Motif, { kind: K }> => m.kind === kind);

describe("detectMotifs", () => {
  it("returns nothing on empty input", () => {
    expect(detectMotifs({ nodes: [], edges: [] })).toEqual([]);
  });

  it("finds a maximal cascade and not its sub-chains", () => {
    // a → b → c → d → e, with a having extra fan-in (so it's the cascade anchor)
    // Add a stray predecessor X so `a` itself is straight-through? We *want*
    // `a` to be a non-straight-through anchor for the cascade. Easiest: leave
    // a with in=0, out=1 (anchor); intermediates b/c/d have in=out=1; e is
    // the tail with out=0.
    const motifs = detectMotifs({
      nodes: nodes("a", "b", "c", "d", "e"),
      edges: [edge("a", "b"), edge("b", "c"), edge("c", "d"), edge("d", "e")],
    });
    const cascades = ofKind(motifs, "cascade");
    expect(cascades).toHaveLength(1);
    expect(cascades[0]?.nodeIds).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("does not report cascades shorter than 3 hops", () => {
    // a → b → c is only 2 hops — below threshold.
    const motifs = detectMotifs({
      nodes: nodes("a", "b", "c"),
      edges: [edge("a", "b"), edge("b", "c")],
    });
    expect(ofKind(motifs, "cascade")).toEqual([]);
  });

  it("finds a diamond a→b/c→d once, not twice", () => {
    const motifs = detectMotifs({
      nodes: nodes("a", "b", "c", "d"),
      edges: [edge("a", "b"), edge("a", "c"), edge("b", "d"), edge("c", "d")],
    });
    const diamonds = ofKind(motifs, "diamond");
    expect(diamonds).toHaveLength(1);
    expect(diamonds[0]?.source).toBe("a");
    expect(diamonds[0]?.sink).toBe("d");
    expect([diamonds[0]?.left, diamonds[0]?.right].sort()).toEqual(["b", "c"]);
  });

  it("finds out-direction hub-spoke", () => {
    const motifs = detectMotifs({
      nodes: nodes("hub", "s1", "s2", "s3"),
      edges: [edge("hub", "s1"), edge("hub", "s2"), edge("hub", "s3")],
    });
    const hubs = ofKind(motifs, "hubSpoke");
    expect(hubs).toHaveLength(1);
    expect(hubs[0]?.hub).toBe("hub");
    expect(hubs[0]?.direction).toBe("out");
    expect([...hubs[0]!.spokes].sort()).toEqual(["s1", "s2", "s3"]);
  });

  it("finds in-direction hub-spoke (fan-in)", () => {
    const motifs = detectMotifs({
      nodes: nodes("hub", "s1", "s2", "s3"),
      edges: [edge("s1", "hub"), edge("s2", "hub"), edge("s3", "hub")],
    });
    const hubs = ofKind(motifs, "hubSpoke");
    expect(hubs).toHaveLength(1);
    expect(hubs[0]?.direction).toBe("in");
  });

  it("rejects hub-spoke when a spoke has other neighbors", () => {
    // s2 is also linked to extra — disqualifies the whole pattern unless
    // we still have ≥ 3 *qualifying* spokes.
    const motifs = detectMotifs({
      nodes: nodes("hub", "s1", "s2", "s3", "extra"),
      edges: [edge("hub", "s1"), edge("hub", "s2"), edge("hub", "s3"), edge("s2", "extra")],
    });
    expect(ofKind(motifs, "hubSpoke")).toEqual([]);
  });

  it("does not report hub-spoke with only 2 spokes", () => {
    const motifs = detectMotifs({
      nodes: nodes("hub", "s1", "s2"),
      edges: [edge("hub", "s1"), edge("hub", "s2")],
    });
    expect(ofKind(motifs, "hubSpoke")).toEqual([]);
  });

  it("reports feedback loops as SCCs of size ≥ 2", () => {
    // Triangle cycle a → b → c → a
    const motifs = detectMotifs({
      nodes: nodes("a", "b", "c"),
      edges: [edge("a", "b"), edge("b", "c"), edge("c", "a")],
    });
    const loops = ofKind(motifs, "feedbackLoop");
    expect(loops).toHaveLength(1);
    expect([...loops[0]!.nodeIds].sort()).toEqual(["a", "b", "c"]);
  });

  it("composes multiple motif kinds on a mixed graph", () => {
    // Cascade x→y→z→w plus hub h with 3 spokes p1,p2,p3
    const motifs = detectMotifs({
      nodes: nodes("x", "y", "z", "w", "h", "p1", "p2", "p3"),
      edges: [
        edge("x", "y"),
        edge("y", "z"),
        edge("z", "w"),
        edge("h", "p1"),
        edge("h", "p2"),
        edge("h", "p3"),
      ],
    });
    const grouped = groupMotifs(motifs);
    expect(grouped.cascade).toHaveLength(1);
    expect(grouped.hubSpoke).toHaveLength(1);
    expect(grouped.diamond).toHaveLength(0);
    expect(grouped.feedbackLoop).toHaveLength(0);
  });

  it("groupMotifs returns all six kinds even when empty", () => {
    expect(groupMotifs([])).toEqual({
      cascade: [],
      diamond: [],
      hubSpoke: [],
      feedbackLoop: [],
      bottleneck: [],
      bipartite: [],
    });
  });

  it("MOTIF_MOVES has a non-empty label and hint for every motif kind", () => {
    const kinds: MotifKind[] = ["cascade", "diamond", "hubSpoke", "feedbackLoop"];
    for (const kind of kinds) {
      expect(MOTIF_MOVES[kind].label).toMatch(/\S/);
      expect(MOTIF_MOVES[kind].hint).toMatch(/\S/);
    }
  });

  it("MOTIF_MOVES hints reference at least one FRAME FORGE move family", () => {
    // Sanity check the wording roots each hint in step-5's named moves —
    // forward/backward, cases, invariant, fixed-point, reconcile, etc.
    const moveWords = /forward|backward|case|invariant|fixed point|reconcile|specialize|propagate|side|match|route|choke/i;
    for (const { hint } of Object.values(MOTIF_MOVES)) {
      expect(hint).toMatch(moveWords);
    }
  });

  it("detects a bottleneck (cut vertex) joining two clusters", () => {
    // Triangle a-b-c — choke — Triangle d-e-f. choke is the only path.
    const motifs = detectMotifs({
      nodes: nodes("a", "b", "c", "choke", "d", "e", "f"),
      edges: [
        edge("a", "b"), edge("b", "c"), edge("c", "a"),
        edge("c", "choke"),
        edge("choke", "d"),
        edge("d", "e"), edge("e", "f"), edge("f", "d"),
      ],
    });
    const bottlenecks = ofKind(motifs, "bottleneck");
    expect(bottlenecks.map((b) => b.node)).toContain("choke");
    const choke = bottlenecks.find((b) => b.node === "choke")!;
    expect(choke.isolatedSides.length).toBe(2);
    const allLeft = choke.isolatedSides.flat().sort();
    expect(allLeft).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  it("does not flag a leaf as a bottleneck", () => {
    // hub → leaf chain: leaf has degree 1, not articulation.
    const motifs = detectMotifs({
      nodes: nodes("hub", "leaf"),
      edges: [edge("hub", "leaf")],
    });
    expect(ofKind(motifs, "bottleneck")).toHaveLength(0);
  });

  it("detects a bipartite component (3+3)", () => {
    // sources s1/s2/s3 link to tasks t1/t2/t3 — bipartite by construction.
    const motifs = detectMotifs({
      nodes: nodes("s1", "s2", "s3", "t1", "t2", "t3"),
      edges: [
        edge("s1", "t1"), edge("s1", "t2"),
        edge("s2", "t2"), edge("s2", "t3"),
        edge("s3", "t1"), edge("s3", "t3"),
      ],
    });
    const bips = ofKind(motifs, "bipartite");
    expect(bips).toHaveLength(1);
    const sizes = [bips[0]!.sideA.length, bips[0]!.sideB.length].sort();
    expect(sizes).toEqual([3, 3]);
  });

  it("rejects bipartite when an odd cycle exists", () => {
    // Triangle a-b-c is an odd cycle — not bipartite.
    const motifs = detectMotifs({
      nodes: nodes("a", "b", "c"),
      edges: [edge("a", "b"), edge("b", "c"), edge("c", "a")],
    });
    expect(ofKind(motifs, "bipartite")).toHaveLength(0);
  });
});
