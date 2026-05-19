/**
 * Per-kind motif instance summaries keyed by node *titles* (not ids).
 *
 * Titles are the comparable unit across palaces — node ids are random
 * uuids that won't match anywhere else, but a hub-spoke around a node
 * titled "CAP" in palace A is structurally the same problem as a
 * hub-spoke around "CAP" in palace B.
 */

import type { Motif, MotifKind } from "./castMotifs";

export type HubSpokeInstance = { hub: string; spokes: string[] };
export type DiamondInstance = { source: string; left: string; right: string; sink: string };
export type CascadeInstance = { nodes: string[] };
export type FeedbackLoopInstance = { nodes: string[] };
export type BottleneckInstance = { node: string };
export type BipartiteInstance = { sideA: string[]; sideB: string[] };

export type MotifInstances = {
  cascade: CascadeInstance[];
  diamond: DiamondInstance[];
  hubSpoke: HubSpokeInstance[];
  feedbackLoop: FeedbackLoopInstance[];
  bottleneck: BottleneckInstance[];
  bipartite: BipartiteInstance[];
};

export function emptyMotifInstances(): MotifInstances {
  return {
    cascade: [],
    diamond: [],
    hubSpoke: [],
    feedbackLoop: [],
    bottleneck: [],
    bipartite: [],
  };
}

const titleOf = (titleById: Map<string, string>, id: string) => titleById.get(id) ?? id;

export function extractMotifInstances(
  motifs: readonly Motif[],
  titleById: Map<string, string>,
): MotifInstances {
  const out = emptyMotifInstances();
  for (const motif of motifs) {
    switch (motif.kind) {
      case "cascade":
        out.cascade.push({ nodes: motif.nodeIds.map((id) => titleOf(titleById, id)) });
        break;
      case "diamond":
        out.diamond.push({
          source: titleOf(titleById, motif.source),
          left: titleOf(titleById, motif.left),
          right: titleOf(titleById, motif.right),
          sink: titleOf(titleById, motif.sink),
        });
        break;
      case "hubSpoke":
        out.hubSpoke.push({
          hub: titleOf(titleById, motif.hub),
          spokes: motif.spokes.map((id) => titleOf(titleById, id)),
        });
        break;
      case "feedbackLoop":
        out.feedbackLoop.push({ nodes: motif.nodeIds.map((id) => titleOf(titleById, id)) });
        break;
      case "bottleneck":
        out.bottleneck.push({ node: titleOf(titleById, motif.node) });
        break;
      case "bipartite":
        out.bipartite.push({
          sideA: motif.sideA.map((id) => titleOf(titleById, id)),
          sideB: motif.sideB.map((id) => titleOf(titleById, id)),
        });
        break;
    }
  }
  return out;
}

/**
 * Jaccard-style overlap between two motif-instance sets. Per kind, computes
 * intersection over union of anchor titles, then averages across kinds
 * with non-zero union. Returns 0 when either side is missing.
 */
export function motifInstanceOverlap(
  a: MotifInstances | undefined,
  b: MotifInstances | undefined,
): number {
  if (!a || !b) return 0;
  const aAnchors = anchorTitlesByKind(a);
  const bAnchors = anchorTitlesByKind(b);
  let totalJaccard = 0;
  let consideredKinds = 0;
  for (const kind of Object.keys(aAnchors) as MotifKind[]) {
    const aSet = aAnchors[kind];
    const bSet = bAnchors[kind];
    if (aSet.size === 0 && bSet.size === 0) continue;
    let inter = 0;
    for (const value of aSet) if (bSet.has(value)) inter += 1;
    const union = aSet.size + bSet.size - inter;
    if (union === 0) continue;
    totalJaccard += inter / union;
    consideredKinds += 1;
  }
  return consideredKinds === 0 ? 0 : totalJaccard / consideredKinds;
}

/** Cheap signal: the set of anchor titles that uniquely identify each motif. */
export function anchorTitlesByKind(instances: MotifInstances | undefined): Record<MotifKind, Set<string>> {
  const r: Record<MotifKind, Set<string>> = {
    cascade: new Set(),
    diamond: new Set(),
    hubSpoke: new Set(),
    feedbackLoop: new Set(),
    bottleneck: new Set(),
    bipartite: new Set(),
  };
  if (!instances) return r;
  for (const c of instances.cascade) c.nodes.forEach((n) => r.cascade.add(n));
  for (const d of instances.diamond) {
    r.diamond.add(d.source);
    r.diamond.add(d.sink);
  }
  for (const h of instances.hubSpoke) r.hubSpoke.add(h.hub);
  for (const l of instances.feedbackLoop) l.nodes.forEach((n) => r.feedbackLoop.add(n));
  for (const b of instances.bottleneck) r.bottleneck.add(b.node);
  for (const bp of instances.bipartite) {
    bp.sideA.forEach((n) => r.bipartite.add(n));
    bp.sideB.forEach((n) => r.bipartite.add(n));
  }
  return r;
}
