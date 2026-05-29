import { describe, expect, it } from "vitest";
import {
  anchorTitlesByKind,
  emptyMotifInstances,
  extractMotifInstances,
  motifInstanceOverlap,
  type MotifInstances,
} from "./motifInstances";
import type { Motif } from "./castMotifs";

const titleMap = (entries: [string, string][]) => new Map(entries);

const instances = (overrides: Partial<MotifInstances>): MotifInstances => ({
  ...emptyMotifInstances(),
  ...overrides,
});

describe("extractMotifInstances", () => {
  it("extractMotifInstances builds title-keyed anchors per motif kind", () => {
    const titles = titleMap([
      ["n1", "CAP"],
      ["n2", "PartitionTolerance"],
      ["n3", "Availability"],
      ["n4", "Consistency"],
      ["n5", "Source"],
      ["n6", "Left"],
      ["n7", "Right"],
      ["n8", "Sink"],
    ]);
    const motifs: Motif[] = [
      { kind: "hubSpoke", hub: "n1", spokes: ["n2", "n3", "n4"], direction: "out" },
      { kind: "diamond", source: "n5", left: "n6", right: "n7", sink: "n8" },
      { kind: "bottleneck", node: "n1", isolatedSides: [["n2"], ["n3"]] },
    ];

    const result: MotifInstances = extractMotifInstances(motifs, titles);
    expect(result.hubSpoke).toEqual([{ hub: "CAP", spokes: ["PartitionTolerance", "Availability", "Consistency"] }]);
    expect(result.diamond).toEqual([{ source: "Source", left: "Left", right: "Right", sink: "Sink" }]);
    expect(result.bottleneck).toEqual([{ node: "CAP" }]);
    expect(result.cascade).toEqual([]);
  });
});

describe("emptyMotifInstances", () => {
  it("returns every motif kind as an empty array", () => {
    expect(emptyMotifInstances()).toEqual({
      cascade: [],
      diamond: [],
      hubSpoke: [],
      feedbackLoop: [],
      bottleneck: [],
      bipartite: [],
    });
  });
});

describe("anchorTitlesByKind", () => {
  it("returns empty sets for every kind when given undefined", () => {
    const r = anchorTitlesByKind(undefined);
    for (const kind of Object.keys(r) as (keyof typeof r)[]) {
      expect(r[kind].size).toBe(0);
    }
  });

  it("uses only source and sink as diamond anchors, not the middles", () => {
    const r = anchorTitlesByKind(
      instances({ diamond: [{ source: "S", left: "L", right: "R", sink: "K" }] }),
    );
    expect(r.diamond).toEqual(new Set(["S", "K"]));
  });

  it("collects anchors across kinds", () => {
    const r = anchorTitlesByKind(
      instances({
        cascade: [{ nodes: ["A", "B"] }],
        hubSpoke: [{ hub: "CAP", spokes: ["x", "y"] }],
        bottleneck: [{ node: "Choke" }],
        bipartite: [{ sideA: ["a1"], sideB: ["b1"] }],
      }),
    );
    expect(r.cascade).toEqual(new Set(["A", "B"]));
    expect(r.hubSpoke).toEqual(new Set(["CAP"])); // spokes are not anchors
    expect(r.bottleneck).toEqual(new Set(["Choke"]));
    expect(r.bipartite).toEqual(new Set(["a1", "b1"]));
  });
});

describe("motifInstanceOverlap", () => {
  const a = instances({ hubSpoke: [{ hub: "CAP", spokes: ["x"] }], cascade: [{ nodes: ["A", "B"] }] });

  it("returns 0 when either side is missing", () => {
    expect(motifInstanceOverlap(undefined, a)).toBe(0);
    expect(motifInstanceOverlap(a, undefined)).toBe(0);
  });

  it("scores identical instance sets as 1", () => {
    expect(motifInstanceOverlap(a, a)).toBe(1);
  });

  it("scores disjoint anchors as 0", () => {
    const b = instances({ hubSpoke: [{ hub: "REST", spokes: ["q"] }], cascade: [{ nodes: ["C", "D"] }] });
    expect(motifInstanceOverlap(a, b)).toBe(0);
  });

  it("averages per-kind Jaccard across kinds with a non-zero union", () => {
    // Shared hub-spoke anchor (Jaccard 1), but b has no cascade (Jaccard 0).
    const b = instances({ hubSpoke: [{ hub: "CAP", spokes: ["x"] }] });
    expect(motifInstanceOverlap(a, b)).toBeCloseTo(0.5);
  });
});
