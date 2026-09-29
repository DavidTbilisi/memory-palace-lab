import type { NedfSlot } from "../entities/types";
import { NEDF_SLOT_LABELS } from "./nedf";

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
};

const NOTHING_HIDDEN: ReadonlySet<string> = new Set();

export function walkHiddenNodeIds({
  walkOpen,
  recallMode,
  answerRevealed,
  currentNodeId,
  routeNodeIds,
  revealedNodeIds,
}: WalkRevealInput): ReadonlySet<string> {
  if (!walkOpen || !recallMode || routeNodeIds.length === 0) return NOTHING_HIDDEN;
  const revealed = new Set(revealedNodeIds);
  if (answerRevealed && currentNodeId) revealed.add(currentNodeId);
  const hidden = new Set<string>();
  for (const nodeId of routeNodeIds) if (!revealed.has(nodeId)) hidden.add(nodeId);
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
 * the card it asks, never by the node stored there, which is the answer the review asks for.
 */
export function dueStopName(locusLabel: string | null | undefined, slot: NedfSlot | null): string {
  const place = locusLabel?.trim() || "Unlabelled stop";
  return slot ? `${place} · ${NEDF_SLOT_LABELS[slot]} card` : place;
}
