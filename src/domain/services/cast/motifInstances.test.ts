import { describe, expect, it } from "vitest";
import { extractMotifInstances, type MotifInstances } from "./motifInstances";
import type { Motif } from "./castMotifs";

const titleMap = (entries: [string, string][]) => new Map(entries);

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
