/**
 * Cross-palace similarity by graph shape.
 *
 * Implements FRAME FORGE step 5's "reduce to a known problem" at the
 * palace level: given the current palace's structural signature, find
 * other palaces with similar shapes so the solver can borrow strategies
 * already used there.
 *
 * Similarity = cosine over a numeric feature vector + Jaccard over the
 * set of motif kinds present. The blend is intentional: cosine catches
 * "this graph is dense like X", Jaccard catches "this graph has the same
 * named patterns as X".
 *
 * Pure — no React, no editor, no repository.
 */

import type { GraphAnalysisResult } from "./graphAnalysis";
import type { MotifGroups, MotifKind } from "./castMotifs";

export type PalaceSignature = {
  palaceId: string;
  palaceName: string;
  nodeCount: number;
  edgeCount: number;
  /**
   * Numeric features in fixed order:
   *   density            edges / max(1, nodes)
   *   hubFraction        |{nodes with role=hub}| / max(1, nodes)
   *   avgBetweenness     mean betweenness across nodes
   *   bridgeFraction     bridges / max(1, edges)
   *   sccFraction        |non-trivial SCCs| / max(1, nodes)
   *   motif/cascade      |cascades|
   *   motif/diamond      |diamonds|
   *   motif/hubSpoke     |hub-spokes|
   *   motif/feedbackLoop |loops|
   *   motif/bottleneck   |bottlenecks|
   *   motif/bipartite    |bipartite components|
   */
  features: number[];
  motifKindsPresent: Set<MotifKind>;
};

const ALL_MOTIF_KINDS: MotifKind[] = [
  "cascade",
  "diamond",
  "hubSpoke",
  "feedbackLoop",
  "bottleneck",
  "bipartite",
];

export function palaceSignature(
  palaceId: string,
  palaceName: string,
  analysis: GraphAnalysisResult,
  groups: MotifGroups,
): PalaceSignature {
  const nodes = Math.max(1, analysis.nodeCount);
  const edges = Math.max(1, analysis.edgeCount);
  const hubCount = Object.values(analysis.roleByNode).filter((r) => r === "hub").length;
  const sumBetween = Object.values(analysis.betweenness).reduce((a, b) => a + b, 0);
  const avgBetween = sumBetween / nodes;
  const nonTrivialSccs = analysis.sccs.filter((c) => c.length > 1).length;

  const motifKindsPresent = new Set<MotifKind>();
  for (const kind of ALL_MOTIF_KINDS) {
    if (groups[kind].length > 0) motifKindsPresent.add(kind);
  }

  const features = [
    analysis.edgeCount / nodes,
    hubCount / nodes,
    avgBetween,
    analysis.bridges.length / edges,
    nonTrivialSccs / nodes,
    groups.cascade.length,
    groups.diamond.length,
    groups.hubSpoke.length,
    groups.feedbackLoop.length,
    groups.bottleneck.length,
    groups.bipartite.length,
  ];

  return {
    palaceId,
    palaceName,
    nodeCount: analysis.nodeCount,
    edgeCount: analysis.edgeCount,
    features,
    motifKindsPresent,
  };
}

function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i]! * b[i]!;
    na += a[i]! ** 2;
    nb += b[i]! ** 2;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function jaccard(a: Set<MotifKind>, b: Set<MotifKind>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const k of a) if (b.has(k)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * Similarity score in [0, 1]. 0.6 * cosine(features) + 0.4 * jaccard(motif kinds).
 * Cosine weight is higher so dense-but-different palaces still get
 * meaningful scores, but Jaccard provides a sharp bonus when palaces share
 * the same motif vocabulary.
 */
export function similarityScore(a: PalaceSignature, b: PalaceSignature): number {
  return 0.6 * cosine(a.features, b.features) + 0.4 * jaccard(a.motifKindsPresent, b.motifKindsPresent);
}

/** Top-N most similar palaces to `current`, excluding `current` itself. */
export function topSimilarPalaces(
  current: PalaceSignature,
  others: readonly PalaceSignature[],
  limit = 3,
): { signature: PalaceSignature; score: number }[] {
  const scored = others
    .filter((sig) => sig.palaceId !== current.palaceId)
    .map((sig) => ({ signature: sig, score: similarityScore(current, sig) }))
    .filter((entry) => entry.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
