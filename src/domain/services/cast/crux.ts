/**
 * Crux selection for Comprehend mode.
 *
 * The "crux move" (Zeitz, via Neural-OS-Research `wiki/problem-solving/crux-move.md`)
 * is the single obstacle whose negotiation determines whether the whole problem
 * succeeds. For a memory palace, the structural analogue is the node that most
 * gates the graph — so we read it straight off the existing `analyzeGraph` output
 * rather than computing anything new.
 *
 * Heuristic, in priority order:
 *   1. betweenness — the node the most shortest paths route through;
 *   2. bridge      — an endpoint of a bridge edge (removal disconnects the graph);
 *   3. hub         — the highest-degree node classified as a hub.
 * When the graph is empty or has no edges, there is no crux.
 */
import type { GraphAnalysisResult } from "./graphAnalysis";
import { topByMetric } from "./graphAnalysis";

export type CruxReason = "betweenness" | "bridge" | "hub";

export type Crux = {
  nodeId: string;
  reason: CruxReason;
};

const degreeOf = (analysis: GraphAnalysisResult, id: string) =>
  (analysis.inDegree[id] ?? 0) + (analysis.outDegree[id] ?? 0);

/** Pick the id with the highest degree, breaking ties alphabetically for determinism. */
function topByDegree(analysis: GraphAnalysisResult, ids: Iterable<string>): string | null {
  let best: string | null = null;
  let bestDegree = -1;
  for (const id of ids) {
    const degree = degreeOf(analysis, id);
    if (degree > bestDegree || (degree === bestDegree && best !== null && id < best)) {
      best = id;
      bestDegree = degree;
    }
  }
  return best;
}

export function selectCrux(analysis: GraphAnalysisResult): Crux | null {
  const topBetweenness = topByMetric(analysis.betweenness, 1)[0];
  if (topBetweenness) return { nodeId: topBetweenness.id, reason: "betweenness" };

  if (analysis.bridges.length > 0) {
    const endpoints = new Set<string>();
    for (const bridge of analysis.bridges) {
      endpoints.add(bridge.sourceNodeId);
      endpoints.add(bridge.targetNodeId);
    }
    const nodeId = topByDegree(analysis, endpoints);
    if (nodeId) return { nodeId, reason: "bridge" };
  }

  const hubs = Object.keys(analysis.roleByNode).filter((id) => analysis.roleByNode[id] === "hub");
  const hub = topByDegree(analysis, hubs);
  if (hub) return { nodeId: hub, reason: "hub" };

  return null;
}
