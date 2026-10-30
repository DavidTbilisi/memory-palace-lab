/**
 * Confusion links: two look-alike nodes the learner mixes up.
 *
 * A confusion link is stored as an edge whose `kind` is "confusion", but it is not a CAST
 * relationship. It is undirected in meaning (A↔B), there is at most one per pair, and it carries
 * nothing the graph reasons about — difficulty, graph analysis, motifs, and the crux all skip it
 * (see `meaningEdges`). Its one job is to name the neighbour on the Distinguisher card, so the walk
 * can ask "Which is it: A or B?" instead of a bare recall prompt.
 *
 * Pure: no React, no editor.
 */

export const CONFUSION_KIND = "confusion" as const;

/** The least an edge needs for the helpers below; `MemoryEdge` and plain graph edges both fit. */
export type ConfusionEdgeLike = {
  sourceNodeId: string;
  targetNodeId: string;
  kind?: string | null;
};

export function isConfusionEdge(edge: { kind?: string | null }): boolean {
  return edge.kind === CONFUSION_KIND;
}

/** The edges that carry meaning: every edge except confusion links. */
export function meaningEdges<T extends { kind?: string | null }>(edges: readonly T[]): T[] {
  return edges.filter((e) => !isConfusionEdge(e));
}

/** The confusion link between two nodes, whichever way it was drawn. */
export function confusionLinkBetween<T extends ConfusionEdgeLike>(
  edges: readonly T[],
  a: string,
  b: string,
): T | undefined {
  return edges.find(
    (e) =>
      isConfusionEdge(e) &&
      ((e.sourceNodeId === a && e.targetNodeId === b) || (e.sourceNodeId === b && e.targetNodeId === a)),
  );
}

export function hasConfusionLink(edges: readonly ConfusionEdgeLike[], a: string, b: string): boolean {
  return confusionLinkBetween(edges, a, b) !== undefined;
}

/** The nodes linked to `nodeId` as a confusion, in the order the links appear, each once. */
export function confusionNeighbours(edges: readonly ConfusionEdgeLike[], nodeId: string): string[] {
  const out: string[] = [];
  for (const e of edges) {
    if (!isConfusionEdge(e)) continue;
    const other = e.sourceNodeId === nodeId ? e.targetNodeId : e.targetNodeId === nodeId ? e.sourceNodeId : null;
    if (other && other !== nodeId && !out.includes(other)) out.push(other);
  }
  return out;
}

/**
 * The two names a discrimination card offers, in alphabetical order, so the answer is not always
 * first and the order does not change from walk to walk.
 */
export function discriminationChoices(answer: string, neighbour: string): [string, string] {
  const cmp = answer.localeCompare(neighbour, undefined, { sensitivity: "base" });
  return cmp <= 0 ? [answer, neighbour] : [neighbour, answer];
}
