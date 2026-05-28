import { useMemo } from "react";
import { analyzeGraph, topByMetric } from "../../domain/services/cast/graphAnalysis";
import { detectMotifs, groupMotifs } from "../../domain/services/cast/castMotifs";
import { extractMotifInstances } from "../../domain/services/cast/motifInstances";
import { palaceSignature, type PalaceSignature } from "../../domain/services/cast/palaceSimilarity";

type GraphNode = { id: string; title?: string };
type GraphEdge = { sourceNodeId: string; targetNodeId: string };
type PalaceRef = { id: string; name: string } | null;

/**
 * Derives the full "graph shape" analysis for a palace: topology metrics,
 * motif detection, and the comparable palace signature. Pure derivation from
 * the supplied nodes/edges so it can be exercised in isolation; the caller
 * owns where the graph data comes from.
 */
export function useGraphAnalysis(nodes: GraphNode[], edges: GraphEdge[], currentPalace: PalaceRef) {
  const graphInput = useMemo(
    () => ({
      nodes: nodes.map((n) => ({ id: n.id })),
      edges: edges.map((e) => ({ sourceNodeId: e.sourceNodeId, targetNodeId: e.targetNodeId })),
    }),
    [nodes, edges],
  );

  const analysis = useMemo(() => analyzeGraph(graphInput), [graphInput]);

  const nodeTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of nodes) map.set(n.id, n.title || "Untitled");
    return map;
  }, [nodes]);

  const topHubs = useMemo(() => topByMetric(analysis.inDegree, 3), [analysis.inDegree]);
  const topBetween = useMemo(() => topByMetric(analysis.betweenness, 3), [analysis.betweenness]);

  const largestScc = useMemo(() => {
    let largest = 0;
    for (const c of analysis.sccs) if (c.length > largest) largest = c.length;
    return largest;
  }, [analysis.sccs]);

  const nonTrivialSccCount = useMemo(() => analysis.sccs.filter((c) => c.length > 1).length, [analysis.sccs]);

  const motifs = useMemo(() => detectMotifs(graphInput), [graphInput]);
  const motifGroups = useMemo(() => groupMotifs(motifs), [motifs]);
  const motifInstances = useMemo(() => extractMotifInstances(motifs, nodeTitleById), [motifs, nodeTitleById]);

  const motifTotal =
    motifGroups.cascade.length +
    motifGroups.diamond.length +
    motifGroups.hubSpoke.length +
    motifGroups.feedbackLoop.length +
    motifGroups.bottleneck.length +
    motifGroups.bipartite.length;

  const currentSignature = useMemo<PalaceSignature | null>(() => {
    if (!currentPalace) return null;
    const sig = palaceSignature(currentPalace.id, currentPalace.name, analysis, motifGroups);
    return { ...sig, motifInstances };
  }, [currentPalace, analysis, motifGroups, motifInstances]);

  return {
    analysis,
    nodeTitleById,
    topHubs,
    topBetween,
    largestScc,
    nonTrivialSccCount,
    motifs,
    motifGroups,
    motifInstances,
    motifTotal,
    currentSignature,
  };
}
