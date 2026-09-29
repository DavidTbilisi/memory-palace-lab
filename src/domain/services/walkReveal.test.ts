import { describe, expect, it } from "vitest";
import { hiddenStopCue, walkHiddenNodeIds, type WalkRevealInput } from "./walkReveal";

const base: WalkRevealInput = {
  walkOpen: true,
  recallMode: true,
  answerRevealed: false,
  currentNodeId: "a",
  routeNodeIds: ["a", "b", "c"],
  revealedNodeIds: [],
};

describe("walkHiddenNodeIds", () => {
  it("hides every node on the route until it is revealed", () => {
    expect([...walkHiddenNodeIds(base)]).toEqual(["a", "b", "c"]);
  });

  it("shows the current node once its answer is revealed", () => {
    expect([...walkHiddenNodeIds({ ...base, answerRevealed: true })]).toEqual(["b", "c"]);
  });

  it("keeps nodes revealed earlier in the walk visible", () => {
    expect([...walkHiddenNodeIds({ ...base, currentNodeId: "b", revealedNodeIds: ["a"] })]).toEqual(["b", "c"]);
  });

  it("hides nothing outside a recall-first walk", () => {
    expect(walkHiddenNodeIds({ ...base, walkOpen: false }).size).toBe(0);
    expect(walkHiddenNodeIds({ ...base, recallMode: false }).size).toBe(0);
  });

  it("leaves nodes off the route alone", () => {
    expect(walkHiddenNodeIds({ ...base, routeNodeIds: ["a"] }).has("z")).toBe(false);
  });
});

describe("hiddenStopCue", () => {
  it("names the place when the stop has a label, and never the node", () => {
    expect(hiddenStopCue("  by the door ")).toBe("by the door");
    expect(hiddenStopCue("")).toBe("What is stored at this stop?");
    expect(hiddenStopCue(null)).toBe("What is stored at this stop?");
  });
});
