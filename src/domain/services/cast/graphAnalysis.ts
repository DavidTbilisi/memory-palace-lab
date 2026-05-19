/**
 * Graph-level Step-0 analysis for CAST palaces.
 *
 * Per `Neural-OS-Research/wiki/cast-research-roadmap.md` Phase 1 and
 * `cast-system.md` Part 6, before encoding a graph you should know its
 * shape: who the hubs are, where the bridges live, which clusters wrap
 * back on themselves.
 *
 * This module is pure — no React, no editor, no store. It accepts a
 * `{ nodes, edges }` view of the graph and returns derived metrics.
 *
 * Algorithms:
 *   - degrees:           O(V + E)
 *   - strongly connected components (Tarjan, iterative): O(V + E)
 *   - bridges (Tarjan, on underlying undirected graph):  O(V + E)
 *   - betweenness centrality (Brandes, directed):        O(V * E)
 *
 * Brandes is the expensive one; for the lab's expected palace size
 * (dozens to a few hundred nodes) it is comfortably fast.
 */

export type GraphAnalysisNode = { id: string };
export type GraphAnalysisEdge = { sourceNodeId: string; targetNodeId: string };

export type GraphAnalysisInput = {
  nodes: readonly GraphAnalysisNode[];
  edges: readonly GraphAnalysisEdge[];
};

export type NodeRole = "hub" | "leaf" | "isolate" | "regular";

export type GraphAnalysisResult = {
  nodeCount: number;
  edgeCount: number;
  inDegree: Record<string, number>;
  outDegree: Record<string, number>;
  betweenness: Record<string, number>;
  /** Undirected bridges — edges whose removal disconnects the graph. */
  bridges: { sourceNodeId: string; targetNodeId: string }[];
  /** Each inner array is one strongly connected component (nodeIds). */
  sccs: string[][];
  roleByNode: Record<string, NodeRole>;
};

const empty = (): GraphAnalysisResult => ({
  nodeCount: 0,
  edgeCount: 0,
  inDegree: {},
  outDegree: {},
  betweenness: {},
  bridges: [],
  sccs: [],
  roleByNode: {},
});

function buildAdjacency(input: GraphAnalysisInput) {
  const out = new Map<string, string[]>();
  const undirected = new Map<string, Set<string>>();
  for (const node of input.nodes) {
    out.set(node.id, []);
    undirected.set(node.id, new Set());
  }
  for (const edge of input.edges) {
    if (!out.has(edge.sourceNodeId) || !out.has(edge.targetNodeId)) continue;
    out.get(edge.sourceNodeId)!.push(edge.targetNodeId);
    undirected.get(edge.sourceNodeId)!.add(edge.targetNodeId);
    undirected.get(edge.targetNodeId)!.add(edge.sourceNodeId);
  }
  return { out, undirected };
}

/** Iterative Tarjan's SCC. */
function tarjanSccs(nodes: readonly string[], out: Map<string, string[]>): string[][] {
  const index = new Map<string, number>();
  const lowlink = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const result: string[][] = [];
  let counter = 0;

  for (const start of nodes) {
    if (index.has(start)) continue;
    // DFS frame: (node, iterator-position)
    const frames: { node: string; next: number }[] = [{ node: start, next: 0 }];
    index.set(start, counter);
    lowlink.set(start, counter);
    counter += 1;
    stack.push(start);
    onStack.add(start);

    while (frames.length > 0) {
      const frame = frames[frames.length - 1]!;
      const neighbors = out.get(frame.node) ?? [];
      if (frame.next < neighbors.length) {
        const next = neighbors[frame.next]!;
        frame.next += 1;
        if (!index.has(next)) {
          index.set(next, counter);
          lowlink.set(next, counter);
          counter += 1;
          stack.push(next);
          onStack.add(next);
          frames.push({ node: next, next: 0 });
        } else if (onStack.has(next)) {
          lowlink.set(frame.node, Math.min(lowlink.get(frame.node)!, index.get(next)!));
        }
      } else {
        if (lowlink.get(frame.node) === index.get(frame.node)) {
          const component: string[] = [];
          for (;;) {
            const popped = stack.pop()!;
            onStack.delete(popped);
            component.push(popped);
            if (popped === frame.node) break;
          }
          result.push(component);
        }
        frames.pop();
        if (frames.length > 0) {
          const parent = frames[frames.length - 1]!;
          lowlink.set(parent.node, Math.min(lowlink.get(parent.node)!, lowlink.get(frame.node)!));
        }
      }
    }
  }
  return result;
}

/** Iterative Tarjan's bridges on the underlying undirected graph. */
function undirectedBridges(
  nodes: readonly string[],
  undirected: Map<string, Set<string>>,
): { sourceNodeId: string; targetNodeId: string }[] {
  const disc = new Map<string, number>();
  const low = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const bridges: { sourceNodeId: string; targetNodeId: string }[] = [];
  let counter = 0;

  for (const start of nodes) {
    if (disc.has(start)) continue;
    parent.set(start, null);
    const adj = [...(undirected.get(start) ?? [])];
    const frames: { node: string; neighbors: string[]; next: number }[] = [
      { node: start, neighbors: adj, next: 0 },
    ];
    disc.set(start, counter);
    low.set(start, counter);
    counter += 1;

    while (frames.length > 0) {
      const frame = frames[frames.length - 1]!;
      if (frame.next < frame.neighbors.length) {
        const v = frame.neighbors[frame.next]!;
        frame.next += 1;
        if (!disc.has(v)) {
          parent.set(v, frame.node);
          disc.set(v, counter);
          low.set(v, counter);
          counter += 1;
          frames.push({ node: v, neighbors: [...(undirected.get(v) ?? [])], next: 0 });
        } else if (v !== parent.get(frame.node)) {
          low.set(frame.node, Math.min(low.get(frame.node)!, disc.get(v)!));
        }
      } else {
        frames.pop();
        const p = parent.get(frame.node);
        if (p) {
          low.set(p, Math.min(low.get(p)!, low.get(frame.node)!));
          if (low.get(frame.node)! > disc.get(p)!) {
            bridges.push({ sourceNodeId: p, targetNodeId: frame.node });
          }
        }
      }
    }
  }
  return bridges;
}

/** Brandes' betweenness centrality for an unweighted directed graph. */
function brandesBetweenness(
  nodes: readonly string[],
  out: Map<string, string[]>,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const id of nodes) result[id] = 0;

  for (const s of nodes) {
    const stack: string[] = [];
    const pred = new Map<string, string[]>();
    const sigma = new Map<string, number>();
    const dist = new Map<string, number>();
    for (const v of nodes) {
      pred.set(v, []);
      sigma.set(v, 0);
      dist.set(v, -1);
    }
    sigma.set(s, 1);
    dist.set(s, 0);

    const queue: string[] = [s];
    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);
      for (const w of out.get(v) ?? []) {
        if (dist.get(w) === -1) {
          dist.set(w, dist.get(v)! + 1);
          queue.push(w);
        }
        if (dist.get(w) === dist.get(v)! + 1) {
          sigma.set(w, sigma.get(w)! + sigma.get(v)!);
          pred.get(w)!.push(v);
        }
      }
    }

    const delta = new Map<string, number>();
    for (const v of nodes) delta.set(v, 0);
    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of pred.get(w) ?? []) {
        delta.set(v, delta.get(v)! + (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!));
      }
      if (w !== s) result[w] = (result[w] ?? 0) + delta.get(w)!;
    }
  }
  return result;
}

function classifyRoles(
  nodes: readonly GraphAnalysisNode[],
  inDeg: Record<string, number>,
  outDeg: Record<string, number>,
): Record<string, NodeRole> {
  const nodeCount = nodes.length;
  const totalEdges = nodes.reduce((sum, n) => sum + (inDeg[n.id] ?? 0), 0);
  // Hub = in-degree at least double the average in-degree across all nodes,
  // and at least 2. Floor of 2 keeps small graphs from labeling every
  // 1-in-degree node as a hub.
  const avgIn = nodeCount > 0 ? totalEdges / nodeCount : 0;
  const hubThreshold = Math.max(2, Math.ceil(avgIn * 2));

  const roles: Record<string, NodeRole> = {};
  for (const node of nodes) {
    const inD = inDeg[node.id] ?? 0;
    const outD = outDeg[node.id] ?? 0;
    if (inD === 0 && outD === 0) {
      roles[node.id] = "isolate";
    } else if (nodeCount > 2 && inD >= hubThreshold) {
      // High in-degree wins, even when out-degree is 0 (terminal hub).
      roles[node.id] = "hub";
    } else if ((inD === 0 && outD > 0) || (inD > 0 && outD === 0)) {
      roles[node.id] = "leaf";
    } else {
      roles[node.id] = "regular";
    }
  }
  return roles;
}

export function analyzeGraph(input: GraphAnalysisInput): GraphAnalysisResult {
  if (input.nodes.length === 0) return empty();

  const { out, undirected } = buildAdjacency(input);
  const nodeIds = input.nodes.map((n) => n.id);

  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  for (const id of nodeIds) {
    inDegree[id] = 0;
    outDegree[id] = 0;
  }
  for (const edge of input.edges) {
    if (inDegree[edge.targetNodeId] === undefined || outDegree[edge.sourceNodeId] === undefined) continue;
    outDegree[edge.sourceNodeId] += 1;
    inDegree[edge.targetNodeId] += 1;
  }

  const sccs = tarjanSccs(nodeIds, out);
  const bridges = undirectedBridges(nodeIds, undirected);
  const betweenness = brandesBetweenness(nodeIds, out);
  const roleByNode = classifyRoles(input.nodes, inDegree, outDegree);

  return {
    nodeCount: input.nodes.length,
    edgeCount: input.edges.length,
    inDegree,
    outDegree,
    betweenness,
    bridges,
    sccs,
    roleByNode,
  };
}

/** Top-N nodes by a numeric metric, ties broken alphabetically by id. */
export function topByMetric(
  metric: Record<string, number>,
  limit: number,
): { id: string; value: number }[] {
  const entries = Object.entries(metric)
    .filter(([, value]) => value > 0)
    .map(([id, value]) => ({ id, value }));
  entries.sort((a, b) => (b.value - a.value) || a.id.localeCompare(b.id));
  return entries.slice(0, limit);
}
