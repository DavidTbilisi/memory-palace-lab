import { describe, it, expect } from "vitest";
import { MOTIF_TEMPLATES, instantiateMotif, suggestMotif } from "./motifTemplates";
import type { MotifKind } from "./castMotifs";

describe("motifTemplates", () => {
  it("each kind has metadata and default titles", () => {
    const kinds: MotifKind[] = [
      "cascade",
      "diamond",
      "hubSpoke",
      "feedbackLoop",
      "bottleneck",
      "bipartite",
    ];
    for (const kind of kinds) {
      const meta = MOTIF_TEMPLATES[kind];
      expect(meta.kind).toBe(kind);
      expect(meta.title).toMatch(/\S/);
      expect(meta.blurb).toMatch(/\S/);
      expect(meta.defaultTitles.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("cascade scaffold is a 4-node linear chain", () => {
    const s = instantiateMotif("cascade");
    expect(s.kind).toBe("cascade");
    expect(s.nodes).toHaveLength(4);
    expect(s.edges).toHaveLength(3);
    // Each edge connects neighbors in slot order
    for (let i = 0; i < 3; i += 1) {
      expect(s.edges[i]!.fromSlot).toBe(s.nodes[i]!.slot);
      expect(s.edges[i]!.toSlot).toBe(s.nodes[i + 1]!.slot);
    }
  });

  it("diamond scaffold has 4 nodes and 4 edges (a→b/c, b/c→d)", () => {
    const s = instantiateMotif("diamond");
    expect(s.nodes).toHaveLength(4);
    expect(s.edges).toHaveLength(4);
    const froms = s.edges.map((e) => e.fromSlot).sort();
    const tos = s.edges.map((e) => e.toSlot).sort();
    expect(froms).toEqual(["l", "r", "src", "src"]);
    expect(tos).toEqual(["l", "r", "snk", "snk"]);
  });

  it("hub-spoke scaffold has hub → 3 spokes", () => {
    const s = instantiateMotif("hubSpoke");
    expect(s.nodes).toHaveLength(4);
    expect(s.edges).toHaveLength(3);
    for (const edge of s.edges) {
      expect(edge.fromSlot).toBe("hub");
    }
  });

  it("feedback loop scaffold is a directed cycle of 3 nodes", () => {
    const s = instantiateMotif("feedbackLoop");
    expect(s.nodes).toHaveLength(3);
    expect(s.edges).toHaveLength(3);
    // Last edge wraps back to first node
    expect(s.edges[2]!.toSlot).toBe(s.nodes[0]!.slot);
  });

  it("instantiateMotif respects custom titles", () => {
    const s = instantiateMotif("cascade", ["Read", "Validate", "Transform", "Write"]);
    expect(s.nodes.map((n) => n.title)).toEqual(["Read", "Validate", "Transform", "Write"]);
  });

  it("instantiateMotif falls back to defaults for missing or blank titles", () => {
    const s = instantiateMotif("cascade", ["Read", "", "  ", "Write"]);
    expect(s.nodes.map((n) => n.title)).toEqual(["Read", "Step 2", "Step 3", "Write"]);
  });

  it("bottleneck scaffold has 5 nodes with a single choke", () => {
    const s = instantiateMotif("bottleneck");
    expect(s.nodes).toHaveLength(5);
    expect(s.nodes.map((n) => n.slot)).toContain("choke");
    const intoChoke = s.edges.filter((e) => e.toSlot === "choke");
    const outOfChoke = s.edges.filter((e) => e.fromSlot === "choke");
    expect(intoChoke.length).toBeGreaterThanOrEqual(1);
    expect(outOfChoke.length).toBeGreaterThanOrEqual(1);
  });

  it("bipartite scaffold has edges only across sides", () => {
    const s = instantiateMotif("bipartite");
    expect(s.nodes.length).toBeGreaterThanOrEqual(4);
    for (const edge of s.edges) {
      const fromIsA = edge.fromSlot.startsWith("a");
      const toIsA = edge.toSlot.startsWith("a");
      expect(fromIsA).not.toBe(toIsA);
    }
  });

  it("every edge has a complete CAST signature", () => {
    const kinds: MotifKind[] = [
      "cascade",
      "diamond",
      "hubSpoke",
      "feedbackLoop",
      "bottleneck",
      "bipartite",
    ];
    for (const kind of kinds) {
      const s = instantiateMotif(kind);
      for (const edge of s.edges) {
        expect(edge.cast.ab).toMatch(/\S/);
        expect(edge.cast.cd).toMatch(/\S/);
        expect(edge.cast.ef).toMatch(/\S/);
        expect(edge.cast.gh).toMatch(/\S/);
        expect(edge.label).toMatch(/\S/);
      }
    }
  });
});

describe("suggestMotif", () => {
  it("returns null on empty input", () => {
    expect(suggestMotif("")).toBeNull();
    expect(suggestMotif("   ")).toBeNull();
  });

  it("returns null when no keyword matches", () => {
    expect(suggestMotif("a generic problem with no graph words")).toBeNull();
  });

  it("suggests cascade for pipeline-like statements", () => {
    const s = suggestMotif("a data pipeline with sequential steps");
    expect(s?.kind).toBe("cascade");
    expect(s?.reasoning).toMatch(/pipeline|sequence|steps/i);
  });

  it("suggests diamond for converging-path statements", () => {
    const s = suggestMotif("two paths that converge at a single conclusion");
    expect(s?.kind).toBe("diamond");
  });

  it("suggests hub-spoke for centralized dispatcher statements", () => {
    const s = suggestMotif("a central dispatcher that fan outs to many clients");
    expect(s?.kind).toBe("hubSpoke");
  });

  it("suggests feedback loop for cycle/feedback statements", () => {
    const s = suggestMotif("a self-reinforcing feedback loop");
    expect(s?.kind).toBe("feedbackLoop");
  });

  it("picks the kind with the most keyword matches when multiple apply", () => {
    // "pipeline" → cascade; "central" + "dispatcher" → hubSpoke. Hub-spoke wins.
    const s = suggestMotif("a pipeline driven by a central dispatcher controller");
    expect(s?.kind).toBe("hubSpoke");
  });
});
