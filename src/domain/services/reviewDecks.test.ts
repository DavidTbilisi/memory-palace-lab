import { describe, expect, it } from "vitest";
import type { GlobalDueItem } from "./dueQueue";
import {
  dueItemTitle,
  firstDueInDeck,
  groupDueItemsByDeck,
  isDeckPaused,
  UNGROUPED_DECK_NAME,
} from "./reviewDecks";

const due = (locusId: string, palaceId: string, palaceName: string, nextReviewAt: string): GlobalDueItem => ({
  palaceId,
  palaceName,
  routeId: `r-${palaceId}`,
  routeName: "Route 1",
  nodeId: `n-${locusId}`,
  locusId,
  locusLabel: "",
  nodeTitle: `Node ${locusId}`,
  nextReviewAt,
});

const palaces = [
  { id: "law", atlasPath: "Bible/OT" },
  { id: "nt", atlasPath: "Bible" },
  { id: "nmap", atlasPath: "CyberSec" },
  { id: "loose", atlasPath: null },
];

// Queue order: soonest due first, as buildDueQueue returns it.
const items = [
  due("l1", "nmap", "Nmap", "2026-09-01T00:00:00.000Z"),
  due("l2", "law", "01 Law", "2026-09-02T00:00:00.000Z"),
  due("l3", "loose", "Loose", "2026-09-03T00:00:00.000Z"),
  due("l4", "nt", "New Testament", "2026-09-04T00:00:00.000Z"),
  due("l5", "law", "01 Law", "2026-09-05T00:00:00.000Z"),
];

describe("groupDueItemsByDeck", () => {
  it("nests decks by atlas path and counts every stop below a deck", () => {
    const decks = groupDueItemsByDeck(items, palaces);
    expect(decks.map((deck) => [deck.name, deck.dueCount])).toEqual([
      ["Bible", 3],
      ["CyberSec", 1],
      [UNGROUPED_DECK_NAME, 1],
    ]);
    const bible = decks[0]!;
    expect(bible.palaces.map((palace) => palace.palaceName)).toEqual(["New Testament"]);
    expect(bible.decks.map((deck) => [deck.path, deck.dueCount])).toEqual([["Bible/OT", 2]]);
    expect(bible.decks[0]!.palaces[0]!.items.map((item) => item.locusId)).toEqual(["l2", "l5"]);
  });

  it("puts palaces it does not know about in Ungrouped", () => {
    const [deck] = groupDueItemsByDeck([due("x", "gone", "Gone", "2026-09-01T00:00:00.000Z")], []);
    expect(deck).toMatchObject({ name: UNGROUPED_DECK_NAME, path: "", dueCount: 1 });
  });

  it("returns no decks for an empty queue", () => {
    expect(groupDueItemsByDeck([], palaces)).toEqual([]);
  });
});

describe("firstDueInDeck", () => {
  it("starts a deck from its soonest-due stop, nested decks included", () => {
    const [bible] = groupDueItemsByDeck(items, palaces);
    expect(firstDueInDeck(bible!)?.locusId).toBe("l2");
  });
});

describe("isDeckPaused", () => {
  it("pauses a palace when its deck or any deck above it is paused", () => {
    expect(isDeckPaused("Bible/OT", ["Bible"])).toBe(true);
    expect(isDeckPaused("Bible/OT", ["Bible/OT"])).toBe(true);
    expect(isDeckPaused("Bible", ["Bible/OT"])).toBe(false);
    expect(isDeckPaused("Biblical", ["Bible"])).toBe(false);
  });

  it("pauses palaces in no group only through the Ungrouped deck", () => {
    expect(isDeckPaused(null, [""])).toBe(true);
    expect(isDeckPaused(null, ["Bible"])).toBe(false);
    expect(isDeckPaused("Bible", [""])).toBe(false);
  });
});

describe("dueItemTitle", () => {
  it("prefers the stop's own label and falls back to the node title", () => {
    expect(dueItemTitle({ locusLabel: "Front door", nodeTitle: "Genesis" })).toBe("Front door");
    expect(dueItemTitle({ locusLabel: "  ", nodeTitle: "Genesis" })).toBe("Genesis");
  });
});
