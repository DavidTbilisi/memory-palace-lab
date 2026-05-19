/**
 * Motif detection over CAST graphs.
 *
 * Per `Neural-OS-Research/wiki/cast-overview.md` ("Pattern" tag) the named
 * motifs are: hub-spoke, cascade, bottleneck, bridge, diamond, loop. The
 * first three (cascade, diamond, hub-spoke) are not covered by the
 * graph-analysis primitives, so they live here. `feedbackLoop` is a thin
 * convenience that re-exposes non-trivial SCCs in the same shape.
 *
 * `FRAME FORGE` step 5 ("Generate Moves") lists "reduce to a known problem"
 * as a standard move — this module is the mechanism for finding that known
 * problem by matching the live graph against a typed motif library.
 *
 * Pure: no React, no editor.
 */

import { analyzeGraph, type GraphAnalysisInput } from "./graphAnalysis";

export type Motif =
  | { kind: "cascade"; nodeIds: string[] }
  | { kind: "diamond"; source: string; left: string; right: string; sink: string }
  | { kind: "hubSpoke"; hub: string; spokes: string[]; direction: "out" | "in" }
  | { kind: "feedbackLoop"; nodeIds: string[] }
  | { kind: "bottleneck"; node: string; isolatedSides: string[][] }
  | { kind: "bipartite"; sideA: string[]; sideB: string[] };

export type MotifKind = Motif["kind"];

const MIN_CASCADE_EDGES = 3; // ≥ 3 hops = 4 nodes — shorter chains aren't a motif
const MIN_HUB_SPOKES = 3;    // ≥ 3 leaves before we call it a hub-spoke

type Adjacency = {
  succ: Map<string, string[]>;
  pred: Map<string, string[]>;
};

function buildAdjacency(input: GraphAnalysisInput): Adjacency {
  const succ = new Map<string, string[]>();
  const pred = new Map<string, string[]>();
  for (const node of input.nodes) {
    succ.set(node.id, []);
    pred.set(node.id, []);
  }
  for (const edge of input.edges) {
    if (!succ.has(edge.sourceNodeId) || !succ.has(edge.targetNodeId)) continue;
    succ.get(edge.sourceNodeId)!.push(edge.targetNodeId);
    pred.get(edge.targetNodeId)!.push(edge.sourceNodeId);
  }
  return { succ, pred };
}

/**
 * Maximal directed simple paths n0 → n1 → … → nk where every intermediate
 * node has exactly one in-edge and one out-edge. Skips cascades fully
 * contained inside a feedback loop (those are reported as loops instead).
 */
function detectCascades(adj: Adjacency): Motif[] {
  const { succ, pred } = adj;
  const isStraightThrough = (id: string) =>
    (pred.get(id)?.length ?? 0) === 1 && (succ.get(id)?.length ?? 0) === 1;

  const visited = new Set<string>();
  const result: Motif[] = [];

  for (const start of succ.keys()) {
    // Anchor cascades at non-straight-through nodes so we always extend to
    // the maximal chain.
    if (isStraightThrough(start)) continue;
    for (const firstHop of succ.get(start) ?? []) {
      if (!isStraightThrough(firstHop)) continue;
      const path: string[] = [start, firstHop];
      let cursor = firstHop;
      // Walk while the next node is also straight-through; stop one node
      // *after* the last straight-through (the cascade's tail anchor).
      while (true) {
        const nexts = succ.get(cursor) ?? [];
        if (nexts.length !== 1) break;
        const next = nexts[0]!;
        if (path.includes(next)) break; // bail if we loop
        path.push(next);
        if (!isStraightThrough(next)) break;
        cursor = next;
      }
      if (path.length - 1 >= MIN_CASCADE_EDGES) {
        const key = path.join("→");
        if (!visited.has(key)) {
          visited.add(key);
          result.push({ kind: "cascade", nodeIds: path });
        }
      }
    }
  }
  return result;
}

/**
 * Diamonds: a → b, a → c, b → d, c → d (b ≠ c, a ≠ d). The b/c pair is
 * deduplicated by ordering them lexicographically so each diamond surfaces
 * once.
 */
function detectDiamonds(adj: Adjacency): Motif[] {
  const { succ, pred } = adj;
  const result: Motif[] = [];
  const seen = new Set<string>();

  for (const a of succ.keys()) {
    const outs = succ.get(a) ?? [];
    if (outs.length < 2) continue;
    for (let i = 0; i < outs.length; i += 1) {
      for (let j = i + 1; j < outs.length; j += 1) {
        const b = outs[i]!;
        const c = outs[j]!;
        if (b === c) continue;
        // Find common successors of b and c.
        const cSuccs = new Set(succ.get(c) ?? []);
        for (const d of succ.get(b) ?? []) {
          if (d === a) continue;
          if (!cSuccs.has(d)) continue;
          // Skip degenerate diamonds where b and c are the same as a or d.
          if (b === a || b === d || c === a || c === d) continue;
          const [left, right] = b < c ? [b, c] : [c, b];
          const key = `${a}|${left}|${right}|${d}`;
          if (seen.has(key)) continue;
          seen.add(key);
          result.push({ kind: "diamond", source: a, left, right, sink: d });
        }
      }
    }
  }
  // Silence unused-var warning while keeping pred in the adjacency object —
  // future motifs (fan-in mirror of hub-spoke) will need it.
  void pred;
  return result;
}

/**
 * Hub-spoke: a node with ≥ 3 spokes that are pure leaves on the hub's side.
 * "out" direction = hub → many sinks; "in" direction = many sources → hub.
 * A spoke must have degree 1 in the relevant direction and connect only to
 * the hub (no other neighbors in that direction).
 */
function detectHubSpokes(adj: Adjacency): Motif[] {
  const { succ, pred } = adj;
  const result: Motif[] = [];

  for (const hub of succ.keys()) {
    // Out-direction: hub → leaves
    const outs = succ.get(hub) ?? [];
    if (outs.length >= MIN_HUB_SPOKES) {
      const spokes = outs.filter((s) => {
        const sPred = pred.get(s) ?? [];
        const sSucc = succ.get(s) ?? [];
        return sPred.length === 1 && sPred[0] === hub && sSucc.length === 0;
      });
      if (spokes.length >= MIN_HUB_SPOKES) {
        result.push({ kind: "hubSpoke", hub, spokes, direction: "out" });
      }
    }
    // In-direction: leaves → hub
    const ins = pred.get(hub) ?? [];
    if (ins.length >= MIN_HUB_SPOKES) {
      const spokes = ins.filter((s) => {
        const sPred = pred.get(s) ?? [];
        const sSucc = succ.get(s) ?? [];
        return sSucc.length === 1 && sSucc[0] === hub && sPred.length === 0;
      });
      if (spokes.length >= MIN_HUB_SPOKES) {
        result.push({ kind: "hubSpoke", hub, spokes, direction: "in" });
      }
    }
  }
  return result;
}

/** Re-exposes non-trivial SCCs (size ≥ 2) as `feedbackLoop` motifs. */
function detectFeedbackLoops(input: GraphAnalysisInput): Motif[] {
  const result: Motif[] = [];
  const { sccs } = analyzeGraph(input);
  for (const component of sccs) {
    if (component.length >= 2) {
      result.push({ kind: "feedbackLoop", nodeIds: component });
    }
  }
  return result;
}

/**
 * Undirected articulation points (cut vertices): nodes whose removal
 * increases the number of connected components on the underlying
 * undirected graph. For each such node, reports the connected components
 * that would result from removing it.
 */
function detectBottlenecks(input: GraphAnalysisInput): Motif[] {
  const undirected = new Map<string, Set<string>>();
  for (const node of input.nodes) undirected.set(node.id, new Set());
  for (const edge of input.edges) {
    if (!undirected.has(edge.sourceNodeId) || !undirected.has(edge.targetNodeId)) continue;
    undirected.get(edge.sourceNodeId)!.add(edge.targetNodeId);
    undirected.get(edge.targetNodeId)!.add(edge.sourceNodeId);
  }

  // Iterative Tarjan articulation points.
  const disc = new Map<string, number>();
  const low = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const articulation = new Set<string>();
  let counter = 0;

  for (const start of input.nodes) {
    if (disc.has(start.id)) continue;
    parent.set(start.id, null);
    disc.set(start.id, counter);
    low.set(start.id, counter);
    counter += 1;
    const frames: { node: string; neighbors: string[]; next: number; children: number }[] = [
      { node: start.id, neighbors: [...(undirected.get(start.id) ?? [])], next: 0, children: 0 },
    ];

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
          frame.children += 1;
          frames.push({ node: v, neighbors: [...(undirected.get(v) ?? [])], next: 0, children: 0 });
        } else if (v !== parent.get(frame.node)) {
          low.set(frame.node, Math.min(low.get(frame.node)!, disc.get(v)!));
        }
      } else {
        frames.pop();
        const p = parent.get(frame.node);
        if (p !== undefined && p !== null) {
          low.set(p, Math.min(low.get(p)!, low.get(frame.node)!));
          // Non-root parent is articulation when any child has low ≥ disc(parent).
          if (parent.get(p) !== null && low.get(frame.node)! >= disc.get(p)!) {
            articulation.add(p);
          }
        }
      }
    }

    // Root is articulation iff it has ≥ 2 DFS-tree children.
    let rootChildCount = 0;
    for (const par of parent.values()) {
      if (par === start.id) rootChildCount += 1;
    }
    if (rootChildCount >= 2) articulation.add(start.id);
  }

  // For each articulation point, compute the connected components after removal.
  const result: Motif[] = [];
  for (const cut of articulation) {
    const sides = connectedComponentsExcluding(undirected, cut);
    if (sides.length >= 2) {
      result.push({ kind: "bottleneck", node: cut, isolatedSides: sides });
    }
  }
  return result;
}

function connectedComponentsExcluding(
  undirected: Map<string, Set<string>>,
  excluded: string,
): string[][] {
  const visited = new Set<string>();
  visited.add(excluded);
  const components: string[][] = [];
  for (const start of undirected.keys()) {
    if (visited.has(start)) continue;
    const stack: string[] = [start];
    const component: string[] = [];
    while (stack.length > 0) {
      const v = stack.pop()!;
      if (visited.has(v)) continue;
      visited.add(v);
      component.push(v);
      for (const neighbor of undirected.get(v) ?? []) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
    if (component.length > 0) components.push(component);
  }
  return components;
}

/**
 * Bipartite weakly-connected components: components 2-colorable by BFS,
 * where both sides are non-empty. Reports each as { sideA, sideB }.
 * Components with a single node are skipped (trivially bipartite but not
 * a useful motif).
 */
function detectBipartite(input: GraphAnalysisInput): Motif[] {
  const undirected = new Map<string, Set<string>>();
  for (const node of input.nodes) undirected.set(node.id, new Set());
  for (const edge of input.edges) {
    if (!undirected.has(edge.sourceNodeId) || !undirected.has(edge.targetNodeId)) continue;
    undirected.get(edge.sourceNodeId)!.add(edge.targetNodeId);
    undirected.get(edge.targetNodeId)!.add(edge.sourceNodeId);
  }

  const color = new Map<string, 0 | 1>();
  const result: Motif[] = [];

  for (const start of input.nodes) {
    if (color.has(start.id)) continue;
    if ((undirected.get(start.id) ?? new Set()).size === 0) continue;
    const queue: string[] = [start.id];
    color.set(start.id, 0);
    const sideA: string[] = [];
    const sideB: string[] = [];
    let isBipartite = true;

    while (queue.length > 0) {
      const v = queue.shift()!;
      const c = color.get(v)!;
      if (c === 0) sideA.push(v);
      else sideB.push(v);
      for (const neighbor of undirected.get(v) ?? []) {
        if (!color.has(neighbor)) {
          color.set(neighbor, c === 0 ? 1 : 0);
          queue.push(neighbor);
        } else if (color.get(neighbor) === c) {
          isBipartite = false;
        }
      }
    }

    if (isBipartite && sideA.length > 0 && sideB.length > 0 && sideA.length + sideB.length >= 3) {
      result.push({ kind: "bipartite", sideA, sideB });
    }
  }
  return result;
}

export function detectMotifs(input: GraphAnalysisInput): Motif[] {
  if (input.nodes.length === 0) return [];
  const adj = buildAdjacency(input);
  return [
    ...detectCascades(adj),
    ...detectDiamonds(adj),
    ...detectHubSpokes(adj),
    ...detectFeedbackLoops(input),
    ...detectBottlenecks(input),
    ...detectBipartite(input),
  ];
}

export type MotifGroups = {
  [K in MotifKind]: Extract<Motif, { kind: K }>[];
};

/**
 * Per-motif FRAME FORGE step-5 ("Generate Moves") suggestion. Each hint
 * names one or two of the standard moves from `frame-forge.md` and tells
 * the solver how to apply it given the motif's shape. The hint is
 * per-*kind*, not per-instance — every cascade gets the same suggestion.
 *
 * Source moves (see `Neural-OS-Research/wiki/frame-forge.md` §5):
 *   forward / backward / split into cases / invariant / reduce-to-known.
 */
export const MOTIF_MOVES: Record<MotifKind, { label: string; hint: string }> = {
  cascade: {
    label: "Move forward — or backward from the tail",
    hint: "Linear dependency chain with one entry and one exit. Pick the easier endpoint and propagate deterministically; if forward gets stuck, work backward from the tail.",
  },
  diamond: {
    label: "Split into cases, then reconcile at the sink",
    hint: "Two paths converge. Work backward from the sink; analyze each branch independently; the answer is the case where both reconcile.",
  },
  hubSpoke: {
    label: "Find one invariant on the hub, specialize per spoke",
    hint: "The hub carries the leverage; the spokes are special cases of the same relation. Solve the hub-side invariant once, then derive each spoke as an instance.",
  },
  feedbackLoop: {
    label: "Search for an invariant or fixed point",
    hint: "A cycle preserves some quantity (invariant) or settles at a stable value (fixed point). If neither exists, the loop diverges — that itself is the answer.",
  },
  bottleneck: {
    label: "Solve each side separately, route through the choke",
    hint: "Removing the bottleneck splits the graph. Solve each isolated side on its own; the bottleneck's job is to route between them. The choke node usually carries the dominant constraint.",
  },
  bipartite: {
    label: "Match by side — assignment, not traversal",
    hint: "Two disjoint sets with edges only across. Treat it as an assignment / matching problem rather than walking the graph. Side cardinalities and edge density determine feasibility.",
  },
};

/** Group motifs by kind — convenient for UI rendering. */
export function groupMotifs(motifs: readonly Motif[]): MotifGroups {
  const groups: MotifGroups = {
    cascade: [],
    diamond: [],
    hubSpoke: [],
    feedbackLoop: [],
    bottleneck: [],
    bipartite: [],
  };
  for (const motif of motifs) {
    // Discriminated union narrowing: cast to the specific bucket type.
    (groups[motif.kind] as Motif[]).push(motif);
  }
  return groups;
}
