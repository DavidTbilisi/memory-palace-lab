import type { CardKey } from "../entities/types";
import { CARD_LABELS } from "./nedf";

/**
 * What a recall-first walk keeps hidden. Walking a palace means standing at a place and saying
 * what is stored there, so every node on the walked route stays hidden until the learner has
 * revealed it in this walk: its title on the canvas, its image caption and glyph, its name in the
 * Routes list, and the edges that would name it through a neighbour. A node off the route is not
 * an answer the walk asks for, so it stays visible.
 *
 * Pure: no React, no store.
 */

export type WalkRevealInput = {
  walkOpen: boolean;
  recallMode: boolean;
  /** Whether the current stop's answer has been revealed. */
  answerRevealed: boolean;
  currentNodeId: string | null;
  /** The node of every stop on the walked route. */
  routeNodeIds: readonly string[];
  /** Nodes revealed earlier in this walk. */
  revealedNodeIds: readonly string[];
  /** What the current card turns around: see `walkCardCover`. */
  cardCover?: WalkCardCover;
};

/**
 * Most cards ask for the node at a stop, so the node is what stays hidden. An Event → date card
 * turns that round: it shows the event and asks for its date, so the event is the cue and its
 * date image, and the stop's label (which is the date), are what stay hidden until Reveal.
 */
export type WalkCardCover = {
  /** Shown although on the route: the cue the card asks from. */
  shownNodeIds: readonly string[];
  /** Hidden until the answer is revealed although not on the route: part of the answer. */
  hiddenNodeIds: readonly string[];
  /** The stop whose label is part of the answer, by node; null when labels are cues as usual. */
  labelHiddenNodeId: string | null;
};

export const NO_CARD_COVER: WalkCardCover = { shownNodeIds: [], hiddenNodeIds: [], labelHiddenNodeId: null };

export function walkCardCover(
  slot: CardKey | null,
  currentNodeId: string | null,
  dateImageNodeId: string | null,
): WalkCardCover {
  if (slot !== "eventToDate" || !currentNodeId) return NO_CARD_COVER;
  return {
    shownNodeIds: [currentNodeId],
    hiddenNodeIds: dateImageNodeId ? [dateImageNodeId] : [],
    labelHiddenNodeId: currentNodeId,
  };
}

const NOTHING_HIDDEN: ReadonlySet<string> = new Set();

export function walkHiddenNodeIds({
  walkOpen,
  recallMode,
  answerRevealed,
  currentNodeId,
  routeNodeIds,
  revealedNodeIds,
  cardCover = NO_CARD_COVER,
}: WalkRevealInput): ReadonlySet<string> {
  if (!walkOpen || !recallMode || routeNodeIds.length === 0) return NOTHING_HIDDEN;
  const revealed = new Set(revealedNodeIds);
  if (answerRevealed && currentNodeId) revealed.add(currentNodeId);
  const shown = answerRevealed ? new Set<string>() : new Set(cardCover.shownNodeIds);
  const hidden = new Set<string>();
  for (const nodeId of routeNodeIds) if (!revealed.has(nodeId) && !shown.has(nodeId)) hidden.add(nodeId);
  if (!answerRevealed) for (const nodeId of cardCover.hiddenNodeIds) hidden.add(nodeId);
  return hidden;
}

/**
 * The cue a hidden stop can show without naming what is stored there: the place's own label when
 * the stop has one, otherwise the question itself.
 */
export function hiddenStopCue(label: string | null | undefined): string {
  return label?.trim() || "What is stored at this stop?";
}

/**
 * How a due stop is named before its review starts (the Review page, Next up): by its place and
 * the card it asks, never by the node stored there, which is the answer the review asks for. A
 * stop with no label goes by its number on the route, which callers show beside the route name.
 */
export function dueStopName(
  locusLabel: string | null | undefined,
  slot: CardKey | null,
  stopNumber?: number | null,
): string {
  // A timeline stop is labelled with its date, which is the answer an Event → date card asks for.
  const label = slot === "eventToDate" ? "" : locusLabel?.trim();
  const place = label || (stopNumber ? `Stop ${stopNumber}` : "Unlabelled stop");
  return slot ? `${place} · ${CARD_LABELS[slot]} card` : place;
}
