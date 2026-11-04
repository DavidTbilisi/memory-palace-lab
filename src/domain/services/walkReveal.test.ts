import { describe, expect, it } from "vitest";
import { dueStopName, hiddenStopCue, walkCardCover, walkHiddenNodeIds, type WalkRevealInput } from "./walkReveal";

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

describe("dueStopName", () => {
  it("names a due stop by its place and card, never its node", () => {
    expect(dueStopName("by the door", null)).toBe("by the door");
    expect(dueStopName("", null)).toBe("Unlabelled stop");
    expect(dueStopName(" ", "distinguisher")).toBe("Unlabelled stop · Distinguisher card");
  });

  it("calls a stop with no label by its number on the route", () => {
    expect(dueStopName("", null, 3)).toBe("Stop 3");
    expect(dueStopName("", "distinguisher", 2)).toBe("Stop 2 · Distinguisher card");
    expect(dueStopName("by the door", null, 3)).toBe("by the door");
  });
});

describe("an Event → date card", () => {
  const cover = walkCardCover("eventToDate", "a", "a-image");

  it("shows the event, and hides its date image and its date label until the answer is revealed", () => {
    expect(cover).toEqual({ shownNodeIds: ["a"], hiddenNodeIds: ["a-image"], labelHiddenNodeId: "a" });
    expect([...walkHiddenNodeIds({ ...base, cardCover: cover })].sort()).toEqual(["a-image", "b", "c"]);
    expect([...walkHiddenNodeIds({ ...base, answerRevealed: true, cardCover: cover })]).toEqual(["b", "c"]);
  });

  it("changes nothing for any other card", () => {
    expect(walkCardCover("dateToEvent", "a", "a-image").shownNodeIds).toEqual([]);
    expect(walkCardCover(null, "a", null).labelHiddenNodeId).toBeNull();
  });

  it("is named before review by its stop number, since its label is the date it asks for", () => {
    expect(dueStopName("1901", "eventToDate", 3)).toBe("Stop 3 · Event → date card");
    expect(dueStopName("1901", "dateToEvent", 3)).toBe("1901 · Date → event card");
  });
});
