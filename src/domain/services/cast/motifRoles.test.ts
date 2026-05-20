import { describe, expect, it } from "vitest";
import {
  MOTIF_ROLE_VISUALS,
  motifRolesByNode,
  primaryRoleFor,
  type MotifRole,
} from "./motifRoles";
import type { Motif } from "./castMotifs";

const ALL_ROLES: MotifRole[] = [
  "hub",
  "spoke",
  "bottleneck",
  "diamondSource",
  "diamondSink",
  "diamondMiddle",
  "feedbackLoop",
  "cascadeStart",
  "cascadeEnd",
  "cascadeMiddle",
  "bipartiteA",
  "bipartiteB",
];

describe("motifRolesByNode", () => {
  it("motifRolesByNode handles empty input", () => {
    expect(motifRolesByNode([])).toEqual(new Map());
  });

  it("motifRolesByNode maps hub-spoke roles", () => {
    const motifs: Motif[] = [
      { kind: "hubSpoke", hub: "n1", spokes: ["n2", "n3", "n4"], direction: "out" },
    ];
    const out = motifRolesByNode(motifs);
    expect(out.get("n1")).toContain("hub");
    expect(out.get("n2")).toContain("spoke");
    expect(out.get("n3")).toContain("spoke");
    expect(out.get("n4")).toContain("spoke");
  });

  it("motifRolesByNode maps diamond source/sink/middle distinctly", () => {
    const motifs: Motif[] = [
      { kind: "diamond", source: "a", left: "b", right: "c", sink: "d" },
    ];
    const out = motifRolesByNode(motifs);
    expect(out.get("a")).toContain("diamondSource");
    expect(out.get("d")).toContain("diamondSink");
    expect(out.get("b")).toContain("diamondMiddle");
    expect(out.get("c")).toContain("diamondMiddle");
  });

  it("motifRolesByNode maps cascade endpoints vs middles", () => {
    const motifs: Motif[] = [
      { kind: "cascade", nodeIds: ["a", "b", "c", "d"] },
    ];
    const out = motifRolesByNode(motifs);
    expect(out.get("a")).toContain("cascadeStart");
    expect(out.get("d")).toContain("cascadeEnd");
    expect(out.get("b")).toContain("cascadeMiddle");
    expect(out.get("c")).toContain("cascadeMiddle");
  });

  it("motifRolesByNode maps bottleneck and feedback loop members", () => {
    const motifs: Motif[] = [
      { kind: "bottleneck", node: "choke", isolatedSides: [["a"], ["b"]] },
      { kind: "feedbackLoop", nodeIds: ["x", "y", "z"] },
      { kind: "bipartite", sideA: ["s1", "s2"], sideB: ["t1", "t2"] },
    ];
    const out = motifRolesByNode(motifs);
    expect(out.get("choke")).toContain("bottleneck");
    expect(out.get("x")).toContain("feedbackLoop");
    expect(out.get("s1")).toContain("bipartiteA");
    expect(out.get("t1")).toContain("bipartiteB");
  });
});

describe("primaryRoleFor", () => {
  it("primaryRoleFor prefers bottleneck over hub when both present", () => {
    expect(primaryRoleFor(["hub", "bottleneck"])).toBe("bottleneck");
    expect(primaryRoleFor(["bottleneck", "hub"])).toBe("bottleneck");
  });

  it("primaryRoleFor returns null on empty role list", () => {
    expect(primaryRoleFor([])).toBeNull();
  });
});

describe("MOTIF_ROLE_VISUALS", () => {
  it("MOTIF_ROLE_VISUALS covers every MotifRole", () => {
    for (const role of ALL_ROLES) {
      const visual = MOTIF_ROLE_VISUALS[role];
      expect(visual).toBeDefined();
      expect(visual.icon.length).toBeGreaterThan(0);
      expect(visual.tone.length).toBeGreaterThan(0);
    }
  });
});
