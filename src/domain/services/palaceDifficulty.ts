/**
 * palaceDifficulty.ts — bridge a palace graph into the /difficulty estimator.
 *
 * Every node becomes a topic; the directed edge graph becomes the prerequisite
 * (`needs`) graph (an edge A→B means A is a prerequisite of B). The four
 * judgment fields are AUTO-DERIVED from graph structure + node content so every
 * node scores with zero data entry, and any field a learner sets in
 * node.difficulty overrides just that field (the hybrid model).
 *
 * "Absorbed" (which makes the for-you roll-up shrink) is read from spaced-
 * repetition state: a node whose locus has been reviewed enough counts as known.
 */
import type { Locus, MemoryEdge, MemoryNode } from "../entities/types";
import {
  DEFAULT_CAPACITY,
  DEFAULT_WALL,
  evaluate,
  learningOrder,
  norm,
  type DifficultyBatch,
  type DifficultyResult,
  type DifficultyRow,
} from "./difficulty";

export interface NodeDifficulty {
  nodeId: string;
  title: string;
  result: DifficultyResult; // result.topic === nodeId
  row: DifficultyRow; // the effective inputs (auto-derived + any override), for editing
  absorbed: boolean;
  overridden: boolean; // had at least one manual override field
  autoDerived: boolean; // no override at all
}

export interface PalaceDifficulty {
  capacity: number;
  wall: number;
  nodes: NodeDifficulty[];
  byNodeId: Map<string, NodeDifficulty>;
  order: string[]; // node ids, gentlest on-ramp first
  rollup: {
    nodeCount: number;
    fromZero: number; // total intrinsic cost to learn the whole palace from scratch
    remaining: number; // cost left for THIS learner (sum of step over un-absorbed nodes)
    walls: number; // count of intrinsically-hard nodes
    absorbed: number; // count of absorbed nodes
    hardest: NodeDifficulty | null;
  };
}

export interface PalaceDifficultyOptions {
  capacity?: number;
  wall?: number;
  /** Min successful repetitions for a locus to count its node as "absorbed". */
  absorbedRepetitions?: number;
}

const wordCount = (s: string): number =>
  s.trim() ? s.trim().split(/\s+/).length : 0;
const clamp = (n: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, n));

/** Auto-derive the four fields + counts from graph structure and content. */
function autoRow(
  node: MemoryNode,
  inDegree: number,
  needs: string[],
): DifficultyRow {
  const words = wordCount(node.content ?? "");
  return {
    topic: node.id,
    needs,
    // more prose ≈ more new ideas to hold; bounded so it stays ordinal
    new_ideas: clamp(1 + Math.floor(words / 15), 1, 8),
    // ordinary dependencies ≈ how many things it builds on
    normal_links: inDegree,
    // belief-breakers need human judgment; none auto-assumed
    breaks: [],
    analogy_links: 0,
    // ideas juggled at once ≈ prerequisites to hold simultaneously (cliff at capacity)
    juggle: clamp(2 + inDegree, 2, 8),
  };
}

/** Merge a per-node override onto the auto-derived row (field by field). */
function applyOverride(
  auto: DifficultyRow,
  node: MemoryNode,
): { row: DifficultyRow; overridden: boolean } {
  const o = node.difficulty;
  if (!o) return { row: auto, overridden: false };
  const row: DifficultyRow = { ...auto };
  let overridden = false;
  if (o.new_ideas !== undefined) {
    row.new_ideas = o.new_ideas;
    overridden = true;
  }
  if (o.normal_links !== undefined) {
    row.normal_links = o.normal_links;
    overridden = true;
  }
  if (o.breaks !== undefined) {
    row.breaks = o.breaks;
    overridden = true;
  }
  if (o.analogy_links !== undefined) {
    row.analogy_links = o.analogy_links;
    overridden = true;
  }
  if (o.juggle !== undefined) {
    row.juggle = o.juggle;
    overridden = true;
  }
  if (o.key_idea !== undefined && o.key_idea !== null && o.key_idea !== "") {
    row.key_idea = o.key_idea;
    overridden = true;
  }
  if (o.extra_needs && o.extra_needs.length) {
    row.needs = [...new Set([...(row.needs ?? []), ...o.extra_needs])];
    overridden = true;
  }
  return { row, overridden };
}

export function computePalaceDifficulty(
  nodes: MemoryNode[],
  edges: MemoryEdge[],
  loci: Locus[],
  options: PalaceDifficultyOptions = {},
): PalaceDifficulty {
  const capacity = options.capacity ?? DEFAULT_CAPACITY;
  const wall = options.wall ?? DEFAULT_WALL;
  const absorbedReps = options.absorbedRepetitions ?? 2;

  const nodeIds = new Set(nodes.map((n) => n.id));

  // prerequisites: predecessors in the directed edge graph (edge A→B ⇒ B needs A)
  const needsByNode = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  const inDegree = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  for (const e of edges) {
    if (!nodeIds.has(e.sourceNodeId) || !nodeIds.has(e.targetNodeId)) continue;
    if (e.sourceNodeId === e.targetNodeId) continue;
    const list = needsByNode.get(e.targetNodeId)!;
    if (!list.includes(e.sourceNodeId)) {
      list.push(e.sourceNodeId);
      inDegree.set(e.targetNodeId, (inDegree.get(e.targetNodeId) ?? 0) + 1);
    }
  }

  // absorbed set from spaced-repetition state (best locus per node)
  const repsByNode = new Map<string, number>();
  for (const l of loci) {
    const reps = l.repetitions ?? 0;
    repsByNode.set(l.nodeId, Math.max(repsByNode.get(l.nodeId) ?? 0, reps));
  }
  // evaluate() canonicalises topic keys via norm() (lowercases, etc.), but node
  // ids (nanoid) contain uppercase — so results are keyed by norm(id). Keep a
  // map back to the raw id so byNodeId / order / badge lookups use the real id.
  const rawByCanon = new Map(nodes.map((n) => [norm(n.id), n.id]));

  const known = new Set<string>();
  for (const n of nodes)
    if ((repsByNode.get(n.id) ?? 0) >= absorbedReps) known.add(norm(n.id));

  // build the batch (auto-derive + overrides)
  const overriddenSet = new Set<string>();
  const rows: DifficultyRow[] = nodes.map((node) => {
    const auto = autoRow(
      node,
      inDegree.get(node.id) ?? 0,
      needsByNode.get(node.id) ?? [],
    );
    const { row, overridden } = applyOverride(auto, node);
    if (overridden) overriddenSet.add(node.id);
    return row;
  });
  const batch: DifficultyBatch = { capacity, rows };
  // rows have topic = raw node.id; evaluate keys results by norm(topic), so key
  // the row lookup the same way to line them back up.
  const rowByCanon = new Map(rows.map((r) => [norm(r.topic), r]));

  const results = evaluate(batch, known, wall);
  const order = learningOrder(results);

  const titleById = new Map(nodes.map((n) => [n.id, n.title || "Untitled"]));
  const nodeDifficulties: NodeDifficulty[] = results.map((result) => {
    const rawId = rawByCanon.get(result.topic) ?? result.topic;
    return {
      nodeId: rawId,
      title: titleById.get(rawId) ?? rawId,
      result,
      row: rowByCanon.get(result.topic) ?? { topic: rawId },
      absorbed: known.has(result.topic),
      overridden: overriddenSet.has(rawId),
      autoDerived: !overriddenSet.has(rawId),
    };
  });
  const byNodeId = new Map(nodeDifficulties.map((d) => [d.nodeId, d]));
  const orderRaw = order.map((t) => rawByCanon.get(t) ?? t);

  let fromZero = 0;
  let remaining = 0;
  let walls = 0;
  let absorbed = 0;
  let hardest: NodeDifficulty | null = null;
  for (const d of nodeDifficulties) {
    fromZero += d.result.step;
    if (!d.absorbed) remaining += d.result.step;
    if (d.result.wall) walls += 1;
    if (d.absorbed) absorbed += 1;
    if (!hardest || d.result.step > hardest.result.step) hardest = d;
  }

  return {
    capacity,
    wall,
    nodes: nodeDifficulties,
    byNodeId,
    order: orderRaw,
    rollup: {
      nodeCount: nodeDifficulties.length,
      fromZero,
      remaining,
      walls,
      absorbed,
      hardest,
    },
  };
}

/** A 1–5 banding of a step cost, for badge colouring. 1 = trivial, 5 = wall. */
export function difficultyLevel(
  step: number,
  wall: number = DEFAULT_WALL,
): 1 | 2 | 3 | 4 | 5 {
  if (step >= wall) return 5;
  if (step >= Math.round(wall * 0.66)) return 4;
  if (step >= Math.round(wall * 0.4)) return 3;
  if (step >= Math.round(wall * 0.2)) return 2;
  return 1;
}
