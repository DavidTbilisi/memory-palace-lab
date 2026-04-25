import { describe, expect, it } from "vitest";
import {
  clampWalkIndex,
  locusAtOrderedIndex,
  orderedLoci,
  walkNext,
  walkPrevious,
} from "./walkService";
import { encodeCastEdge as encEdge, decodeCastEdge as decEdge } from "../entities/types";

describe("walkService", () => {
  it("clamps walk index", () => {
    expect(clampWalkIndex(-1, 3)).toBe(0);
    expect(clampWalkIndex(10, 3)).toBe(2);
    expect(clampWalkIndex(1, 3)).toBe(1);
  });

  it("walk next and previous", () => {
    expect(walkNext(0, 3)).toBe(1);
    expect(walkNext(2, 3)).toBe(2);
    expect(walkPrevious(2, 3)).toBe(1);
    expect(walkPrevious(0, 3)).toBe(0);
  });

  it("orders loci by orderIndex", () => {
    const l = [
      { id: "a", orderIndex: 2 },
      { id: "b", orderIndex: 0 },
      { id: "c", orderIndex: 1 },
    ];
    expect(orderedLoci(l).map((x) => x.id)).toEqual(["b", "c", "a"]);
  });

  it("picks locus at ordered position", () => {
    const l = [
      { id: "a", orderIndex: 1, nodeId: "n1" },
      { id: "b", orderIndex: 0, nodeId: "n0" },
    ];
    expect(locusAtOrderedIndex(l, 0)?.nodeId).toBe("n0");
    expect(locusAtOrderedIndex(l, 1)?.nodeId).toBe("n1");
  });
});

describe("CAST encoding (domain types)", () => {
  it("round-trips CAST pipe encoding", () => {
    const s = encEdge("Giant", "Flowing", "Cloud", "Red cave");
    expect(s).toBe("Giant|Flowing|Cloud|Red cave");
    expect(decEdge(s)).toEqual({
      ab: "Giant",
      cd: "Flowing",
      ef: "Cloud",
      gh: "Red cave",
    });
  });

  it("encodeCastEdge matches pipe format", () => {
    expect(encEdge("a", "b", "c", "d")).toBe("a|b|c|d");
    expect(decEdge("a|b|c|d").ab).toBe("a");
  });
});
