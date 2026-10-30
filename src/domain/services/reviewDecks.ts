import type { Palace } from "../entities/types";
import { composeAtlasPath, splitAtlasPath } from "./atlasHierarchy";
import type { GlobalDueItem } from "./dueQueue";

export type ReviewDeckPalace = {
  palaceId: string;
  palaceName: string;
  /** Due stops of this palace, in queue (due-date) order. */
  items: GlobalDueItem[];
};

export type ReviewDeck = {
  /** Atlas path of the group the deck stands for; "" for palaces in no group. */
  path: string;
  name: string;
  /** Due stops in this deck and every deck under it. */
  dueCount: number;
  decks: ReviewDeck[];
  palaces: ReviewDeckPalace[];
};

export const UNGROUPED_DECK_NAME = "Ungrouped";

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, undefined, { numeric: true });

/**
 * Groups the due queue into decks by palace atlas path, nested like Anki
 * decks (Bible › OT › 01 Law). Only decks holding due stops appear, and
 * palaces in no group gather in an "Ungrouped" deck at the end.
 */
export function groupDueItemsByDeck(
  items: readonly GlobalDueItem[],
  palaces: readonly Pick<Palace, "id" | "atlasPath">[],
): ReviewDeck[] {
  type DeckDraft = {
    path: string;
    name: string;
    dueCount: number;
    decks: Map<string, DeckDraft>;
    palaces: Map<string, ReviewDeckPalace>;
  };
  const draft = (path: string, name: string): DeckDraft => ({
    path,
    name,
    dueCount: 0,
    decks: new Map(),
    palaces: new Map(),
  });
  const segmentsById = new Map(palaces.map((palace) => [palace.id, splitAtlasPath(palace.atlasPath)]));
  const root = draft("", "");
  const ungrouped = draft("", UNGROUPED_DECK_NAME);

  for (const item of items) {
    const segments = segmentsById.get(item.palaceId) ?? [];
    let deck = segments.length > 0 ? root : ungrouped;
    if (segments.length === 0) ungrouped.dueCount += 1;
    segments.forEach((segment, index) => {
      let child = deck.decks.get(segment);
      if (!child) {
        child = draft(segments.slice(0, index + 1).join("/"), segment);
        deck.decks.set(segment, child);
      }
      deck = child;
      deck.dueCount += 1;
    });
    let palace = deck.palaces.get(item.palaceId);
    if (!palace) {
      palace = { palaceId: item.palaceId, palaceName: item.palaceName, items: [] };
      deck.palaces.set(item.palaceId, palace);
    }
    palace.items.push(item);
  }

  const finalize = (deck: DeckDraft): ReviewDeck => ({
    path: deck.path,
    name: deck.name,
    dueCount: deck.dueCount,
    decks: [...deck.decks.values()].sort(byName).map(finalize),
    palaces: [...deck.palaces.values()].sort((a, b) =>
      a.palaceName.localeCompare(b.palaceName, undefined, { numeric: true }),
    ),
  });
  const decks = [...root.decks.values()].sort(byName).map(finalize);
  if (ungrouped.dueCount > 0) decks.push(finalize(ungrouped));
  return decks;
}

/**
 * Whether a palace's stops are held out of review: its deck, or any deck
 * above it, is paused. The Ungrouped deck pauses under "".
 */
export function isDeckPaused(atlasPath: string | null | undefined, pausedDecks: readonly string[]) {
  if (pausedDecks.length === 0) return false;
  const segments = splitAtlasPath(atlasPath);
  if (segments.length === 0) return pausedDecks.includes("");
  return segments.some((_, index) => pausedDecks.includes(segments.slice(0, index + 1).join("/")));
}

/**
 * Every palace in a deck or the decks under it, due or not; "" is the
 * Ungrouped deck, which holds the palaces in no group.
 */
export function palacesInDeck<T extends Pick<Palace, "id" | "atlasPath">>(
  deckPath: string,
  palaces: readonly T[],
): T[] {
  return palaces.filter((palace) => {
    const path = composeAtlasPath(splitAtlasPath(palace.atlasPath));
    if (deckPath === "") return path === "";
    return path === deckPath || path.startsWith(`${deckPath}/`);
  });
}

/** The stop to start a deck's review from: the soonest-due one anywhere in it. */
export function firstDueInDeck(deck: ReviewDeck): GlobalDueItem | null {
  const candidates = [
    ...deck.palaces.map((palace) => palace.items[0]),
    ...deck.decks.map(firstDueInDeck),
  ].filter((item): item is GlobalDueItem => !!item);
  return candidates.reduce<GlobalDueItem | null>(
    (soonest, item) =>
      !soonest || Date.parse(item.nextReviewAt) < Date.parse(soonest.nextReviewAt) ? item : soonest,
    null,
  );
}
