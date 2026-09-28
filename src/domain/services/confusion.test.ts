import { describe, expect, it } from "vitest";
import {
  confusionLinkBetween,
  confusionNeighbours,
  discriminationChoices,
  hasConfusionLink,
  isConfusionEdge,
  meaningEdges,
} from "./confusion";

const edge = (sourceNodeId: string, targetNodeId: string, kind?: "confusion") => ({
  sourceNodeId,
  targetNodeId,
  ...(kind ? { kind } : {}),
});

describe("confusion links", () => {
  const edges = [edge("a", "b"), edge("b", "a", "confusion"), edge("c", "a", "confusion"), edge("a", "d")];

  it("tells a confusion link from an ordinary edge", () => {
    expect(isConfusionEdge(edges[1]!)).toBe(true);
    expect(isConfusionEdge(edges[0]!)).toBe(false);
    expect(isConfusionEdge({ kind: "" })).toBe(false);
    expect(meaningEdges(edges)).toEqual([edge("a", "b"), edge("a", "d")]);
  });

  it("finds a link whichever way it was drawn", () => {
    expect(hasConfusionLink(edges, "a", "b")).toBe(true);
    expect(hasConfusionLink(edges, "b", "a")).toBe(true);
    expect(confusionLinkBetween(edges, "a", "c")).toBe(edges[2]);
    // An ordinary edge between the pair is not a confusion link.
    expect(hasConfusionLink(edges, "a", "d")).toBe(false);
  });

  it("lists a node's confusion neighbours once each", () => {
    expect(confusionNeighbours(edges, "a")).toEqual(["b", "c"]);
    expect(confusionNeighbours([...edges, edge("a", "b", "confusion")], "a")).toEqual(["b", "c"]);
    expect(confusionNeighbours(edges, "b")).toEqual(["a"]);
    expect(confusionNeighbours(edges, "d")).toEqual([]);
  });

  it("orders the two choices alphabetically, whichever is the answer", () => {
    expect(discriminationChoices("Effect", "affect")).toEqual(["affect", "Effect"]);
    expect(discriminationChoices("affect", "Effect")).toEqual(["affect", "Effect"]);
  });
});
