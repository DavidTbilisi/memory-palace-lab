import { describe, expect, it } from "vitest";
import type { Locus, MemoryEdge, MemoryNode } from "../entities/types";
import { computePalaceDifficulty, difficultyLevel } from "./palaceDifficulty";

function node(
  id: string,
  title: string,
  content = "",
  difficulty?: MemoryNode["difficulty"],
): MemoryNode {
  return {
    id,
    objectId: `o-${id}`,
    title,
    content,
    kind: "memory",
    portal: null,
    difficulty,
  };
}
function edge(id: string, source: string, target: string): MemoryEdge {
  return {
    id,
    objectId: `e-${id}`,
    sourceNodeId: source,
    targetNodeId: target,
    castAb: "",
    castCd: "",
    castEf: "",
    castGh: "",
  };
}
function locus(nodeId: string, repetitions: number): Locus {
  return {
    id: `l-${nodeId}`,
    routeId: "r1",
    nodeId,
    orderIndex: 0,
    label: nodeId,
    repetitions,
  };
}

describe("computePalaceDifficulty", () => {
  const nodes = [
    node("a", "Arrays"),
    node("b", "Linked lists"),
    node("c", "Trees"),
  ];
  const edges = [edge("e1", "a", "b"), edge("e2", "b", "c")]; // a→b→c

  it("derives needs from the edge graph (predecessors)", () => {
    const d = computePalaceDifficulty(nodes, edges, []);
    expect(d.byNodeId.get("a")!.result.needs).toEqual([]); // root has no prereqs
    expect(d.byNodeId.get("b")!.result.needs).toEqual(["a"]);
    expect(d.byNodeId.get("c")!.result.needs).toEqual(["b"]);
  });

  it("scores every node and rolls up the palace", () => {
    const d = computePalaceDifficulty(nodes, edges, []);
    expect(d.nodes).toHaveLength(3);
    expect(d.rollup.nodeCount).toBe(3);
    expect(d.rollup.fromZero).toBeGreaterThan(0);
    // from-zero of the deepest node includes its chain
    expect(d.byNodeId.get("c")!.result.from_zero).toBeGreaterThan(
      d.byNodeId.get("a")!.result.from_zero,
    );
  });

  it("treats well-reviewed loci as absorbed, shrinking remaining cost", () => {
    const cold = computePalaceDifficulty(nodes, edges, []);
    const warm = computePalaceDifficulty(nodes, edges, [
      locus("a", 3),
      locus("b", 3),
    ]); // a,b absorbed
    expect(warm.rollup.absorbed).toBe(2);
    expect(warm.rollup.remaining).toBeLessThan(cold.rollup.remaining);
    // c's for-you drops once its prereqs are absorbed
    expect(warm.byNodeId.get("c")!.result.for_you).toBeLessThan(
      cold.byNodeId.get("c")!.result.for_you,
    );
  });

  it("applies per-node overrides on top of auto-derivation", () => {
    const withOverride = [
      node("a", "Arrays"),
      node("b", "Linked lists"),
      node("c", "Trees", "", { juggle: 8, breaks: ["x", "y"] }),
    ];
    const d = computePalaceDifficulty(withOverride, edges, []);
    const auto = computePalaceDifficulty(nodes, edges, []);
    expect(d.byNodeId.get("c")!.overridden).toBe(true);
    expect(d.byNodeId.get("a")!.autoDerived).toBe(true);
    // higher juggle + belief-breaks ⇒ a strictly harder step than the auto baseline
    expect(d.byNodeId.get("c")!.result.step).toBeGreaterThan(
      auto.byNodeId.get("c")!.result.step,
    );
  });

  it("keys byNodeId / order by the RAW node id (nanoid ids have uppercase)", () => {
    // node ids with uppercase — norm() would lowercase them; byNodeId must still
    // be reachable by the raw id (the canvas badge + override write look up by it)
    const up = [node("Vx9", "Root"), node("Ab2", "Child")];
    const ed = [edge("e1", "Vx9", "Ab2")];
    const d = computePalaceDifficulty(up, ed, []);
    expect(d.byNodeId.has("Vx9")).toBe(true);
    expect(d.byNodeId.has("Ab2")).toBe(true);
    expect(d.byNodeId.get("Ab2")!.title).toBe("Child");
    expect(d.order).toContain("Vx9");
    // absorbed lookup must also survive normalization
    const warm = computePalaceDifficulty(up, ed, [locus("Vx9", 3)]);
    expect(warm.byNodeId.get("Vx9")!.absorbed).toBe(true);
  });

  it("bands step cost into 1–5 levels", () => {
    expect(difficultyLevel(0)).toBe(1);
    expect(difficultyLevel(20)).toBe(5); // >= default wall 15
    expect(difficultyLevel(10)).toBe(4);
  });
});
