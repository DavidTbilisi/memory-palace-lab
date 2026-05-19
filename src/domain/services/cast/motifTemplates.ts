/**
 * Motif scaffolding templates for FRAME FORGE step 3 (Represent).
 *
 * Where `castMotifs.ts` *detects* motifs in an existing graph, this module
 * goes the other way: given a problem shape, it produces a starter graph
 * (nodes + CAST-edged connections) the solver can refine. Each template
 * encodes a sensible default CAST signature per edge so the scaffold is
 * usable without further editing.
 *
 * Pure — no React, no editor.
 */

import type { MotifKind } from "./castMotifs";
import type { AARRecord } from "./aarRecords";
import {
  CAST_HOW,
  CAST_WHAT,
  CAST_WHEN,
  CAST_WHO,
} from "../../../data/castLexicon";

export type ScaffoldNode = {
  /** Stable key within this scaffold — not a node id. */
  slot: string;
  title: string;
};

export type ScaffoldEdge = {
  fromSlot: string;
  toSlot: string;
  /** Tier-1 verb that becomes the arrow label. */
  label: string;
  /** Tier-2 CAST signature (canonical English labels per axis). */
  cast: { ab: string; cd: string; ef: string; gh: string };
};

export type MotifScaffold = {
  kind: MotifKind;
  nodes: ScaffoldNode[];
  edges: ScaffoldEdge[];
};

export type MotifTemplateMeta = {
  kind: MotifKind;
  /** Short name shown on the chip. */
  title: string;
  /** One-line description of the structure. */
  blurb: string;
  /** Default placeholder titles, in slot order. */
  defaultTitles: string[];
};

/**
 * Per-kind metadata: default titles, descriptions. The `instantiateMotif`
 * function turns one of these (plus optional overrides) into a full
 * scaffold with edges.
 */
export const MOTIF_TEMPLATES: Record<MotifKind, MotifTemplateMeta> = {
  cascade: {
    kind: "cascade",
    title: "Cascade",
    blurb: "Linear chain: A → B → C → D. One entry, one exit, deterministic flow.",
    defaultTitles: ["Step 1", "Step 2", "Step 3", "Step 4"],
  },
  diamond: {
    kind: "diamond",
    title: "Diamond",
    blurb: "Two paths converge: source ⇉ left/right ⇉ sink.",
    defaultTitles: ["Source", "Left", "Right", "Sink"],
  },
  hubSpoke: {
    kind: "hubSpoke",
    title: "Hub-spoke",
    blurb: "Central node with 3+ leaf branches. Controller / dispatcher pattern.",
    defaultTitles: ["Hub", "Spoke 1", "Spoke 2", "Spoke 3"],
  },
  feedbackLoop: {
    kind: "feedbackLoop",
    title: "Feedback loop",
    blurb: "Mutual cycle: A → B → C → A. Reinforces or stabilizes a quantity.",
    defaultTitles: ["Node A", "Node B", "Node C"],
  },
  bottleneck: {
    kind: "bottleneck",
    title: "Bottleneck",
    blurb: "Hourglass: two clusters connected only through one choke node.",
    defaultTitles: ["Left A", "Left B", "Choke", "Right A", "Right B"],
  },
  bipartite: {
    kind: "bipartite",
    title: "Bipartite",
    blurb: "Two sets with edges only across — assignment / matching shape.",
    defaultTitles: ["Source 1", "Source 2", "Source 3", "Target 1", "Target 2", "Target 3"],
  },
};

/**
 * Build a full scaffold (nodes + edges with CAST signatures) for a motif
 * kind. If `titles` is provided it overrides the placeholder names; extra
 * titles are ignored, missing ones fall back to the defaults.
 */
export function instantiateMotif(kind: MotifKind, titles?: readonly string[]): MotifScaffold {
  const tpl = MOTIF_TEMPLATES[kind];
  const names = tpl.defaultTitles.map((dflt, i) => {
    const candidate = titles?.[i]?.trim();
    return candidate && candidate.length > 0 ? candidate : dflt;
  });

  switch (kind) {
    case "cascade":
      return buildCascade(names);
    case "diamond":
      return buildDiamond(names);
    case "hubSpoke":
      return buildHubSpoke(names);
    case "feedbackLoop":
      return buildFeedbackLoop(names);
    case "bottleneck":
      return buildBottleneck(names);
    case "bipartite":
      return buildBipartite(names);
  }
}

// CAST_WHO  = [Giant, Mermaid, Mage, Dragon]
// CAST_HOW  = [Crushing, Flowing, Spreading, Exploding]
// CAST_WHAT = [Rock, Water, Cloud, Lightning]
// CAST_WHEN = [Red cave, Blue ocean, Green sky, Purple storm]

function buildCascade(names: string[]): MotifScaffold {
  // Soft propagation through a chain: helper role, feeding signals.
  const sig = { ab: CAST_WHO[2], cd: CAST_HOW[1], ef: CAST_WHAT[2], gh: CAST_WHEN[1] };
  const nodes = names.map((title, i) => ({ slot: `n${i}`, title }));
  const edges: ScaffoldEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    edges.push({ fromSlot: nodes[i]!.slot, toSlot: nodes[i + 1]!.slot, label: "feeds", cast: sig });
  }
  return { kind: "cascade", nodes, edges };
}

function buildDiamond(names: string[]): MotifScaffold {
  const [source, left, right, sink] = names;
  // Source dispatches to both middles (Giant · Spreading · Cloud), middles
  // converge into sink with peer / mutual signature.
  const dispatch = { ab: CAST_WHO[0], cd: CAST_HOW[2], ef: CAST_WHAT[2], gh: CAST_WHEN[1] };
  const converge = { ab: CAST_WHO[1], cd: CAST_HOW[1], ef: CAST_WHAT[0], gh: CAST_WHEN[1] };
  const nodes = [
    { slot: "src", title: source! },
    { slot: "l", title: left! },
    { slot: "r", title: right! },
    { slot: "snk", title: sink! },
  ];
  return {
    kind: "diamond",
    nodes,
    edges: [
      { fromSlot: "src", toSlot: "l", label: "branches", cast: dispatch },
      { fromSlot: "src", toSlot: "r", label: "branches", cast: dispatch },
      { fromSlot: "l", toSlot: "snk", label: "merges", cast: converge },
      { fromSlot: "r", toSlot: "snk", label: "merges", cast: converge },
    ],
  };
}

function buildHubSpoke(names: string[]): MotifScaffold {
  const [hub, ...spokes] = names;
  // Hub controls each spoke: Giant · Crushing · Rock · Red cave (permanent).
  const sig = { ab: CAST_WHO[0], cd: CAST_HOW[0], ef: CAST_WHAT[0], gh: CAST_WHEN[0] };
  const nodes = [
    { slot: "hub", title: hub! },
    ...spokes.map((title, i) => ({ slot: `s${i}`, title })),
  ];
  const edges: ScaffoldEdge[] = spokes.map((_, i) => ({
    fromSlot: "hub",
    toSlot: `s${i}`,
    label: "controls",
    cast: sig,
  }));
  return { kind: "hubSpoke", nodes, edges };
}

function buildBottleneck(names: string[]): MotifScaffold {
  const [la, lb, choke, ra, rb] = names;
  // Both sides feed into the choke, which controls both sides.
  // Side-side: peer flow. Choke is Giant on the converge edges.
  const intoChoke = { ab: CAST_WHO[0], cd: CAST_HOW[1], ef: CAST_WHAT[2], gh: CAST_WHEN[1] };
  const outOfChoke = { ab: CAST_WHO[0], cd: CAST_HOW[1], ef: CAST_WHAT[2], gh: CAST_WHEN[1] };
  const sidePeer = { ab: CAST_WHO[1], cd: CAST_HOW[2], ef: CAST_WHAT[2], gh: CAST_WHEN[1] };
  const nodes = [
    { slot: "la", title: la! },
    { slot: "lb", title: lb! },
    { slot: "choke", title: choke! },
    { slot: "ra", title: ra! },
    { slot: "rb", title: rb! },
  ];
  return {
    kind: "bottleneck",
    nodes,
    edges: [
      { fromSlot: "la", toSlot: "lb", label: "links", cast: sidePeer },
      { fromSlot: "lb", toSlot: "choke", label: "feeds", cast: intoChoke },
      { fromSlot: "choke", toSlot: "ra", label: "dispatches", cast: outOfChoke },
      { fromSlot: "ra", toSlot: "rb", label: "links", cast: sidePeer },
    ],
  };
}

function buildBipartite(names: string[]): MotifScaffold {
  // First half = side A (sources), second half = side B (targets).
  // Edges only cross sides. Default: bipartite K_{3,3}-like but with a
  // subset of crossings to keep the scaffold readable.
  const half = Math.ceil(names.length / 2);
  const sideA = names.slice(0, half).map((title, i) => ({ slot: `a${i}`, title }));
  const sideB = names.slice(half).map((title, i) => ({ slot: `b${i}`, title }));
  const sig = { ab: CAST_WHO[2], cd: CAST_HOW[1], ef: CAST_WHAT[0], gh: CAST_WHEN[1] };
  const edges: ScaffoldEdge[] = [];
  // Default crossings: each A connects to its index-matched B and the next.
  sideA.forEach((a, i) => {
    const b1 = sideB[i % sideB.length];
    const b2 = sideB[(i + 1) % sideB.length];
    if (b1) edges.push({ fromSlot: a.slot, toSlot: b1.slot, label: "assigns", cast: sig });
    if (b2 && b2 !== b1) edges.push({ fromSlot: a.slot, toSlot: b2.slot, label: "assigns", cast: sig });
  });
  return { kind: "bipartite", nodes: [...sideA, ...sideB], edges };
}

function buildFeedbackLoop(names: string[]): MotifScaffold {
  // Mutual cycle: Mermaid · Flowing · Water · Blue ocean.
  const sig = { ab: CAST_WHO[1], cd: CAST_HOW[1], ef: CAST_WHAT[1], gh: CAST_WHEN[1] };
  const nodes = names.map((title, i) => ({ slot: `n${i}`, title }));
  const edges: ScaffoldEdge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const from = nodes[i]!;
    const to = nodes[(i + 1) % nodes.length]!;
    edges.push({ fromSlot: from.slot, toSlot: to.slot, label: "feeds back", cast: sig });
  }
  return { kind: "feedbackLoop", nodes, edges };
}

/**
 * Heuristic motif suggestion from a free-text problem statement.
 *
 * This is keyword-based, not semantic — it surfaces a starting point, not
 * a verdict. The caller (UI) treats it as a default that the user can flip.
 */
export type MotifSuggestion = {
  kind: MotifKind;
  reasoning: string;
};

const MOTIF_KEYWORDS: Record<MotifKind, string[]> = {
  cascade: [
    "pipeline", "chain", "sequence", "steps", "stages", "flow",
    "after", "then", "next", "depends on", "leads to", "propagate",
  ],
  diamond: [
    "converge", "merge", "two paths", "both paths", "alternatives",
    "either", "or both", "reconcile", "combine", "compare options",
    "branch and merge", "fork and join",
  ],
  hubSpoke: [
    "central", "centralized", "dispatcher", "controller", "broker",
    "broadcast", "fan out", "fan in", "distribute", "gather", "publish",
    "subscribe", "hub", "spokes", "many clients", "one provider",
  ],
  feedbackLoop: [
    "cycle", "loop", "feedback", "recursive", "mutual", "self-reinforcing",
    "regulates", "regulate", "stabilize", "oscillate", "circular",
    "reinforcing", "balancing", "two-way",
  ],
  bottleneck: [
    "bottleneck", "choke", "choke point", "single point", "single point of failure",
    "spof", "gateway between", "must pass through", "constrained by", "throughput limited",
    "narrow", "throttle",
  ],
  bipartite: [
    "assignment", "matching", "two-sided", "two sided", "marketplace",
    "supply and demand", "buyers and sellers", "users and resources",
    "tasks and workers", "jobs to machines", "roles to people",
    "bipartite",
  ],
};

function dominantMotifKind(record: AARRecord): MotifKind | null {
  let best: MotifKind | null = null;
  let bestCount = 0;
  for (const kind of Object.keys(record.signature.motifCounts) as MotifKind[]) {
    const count = record.signature.motifCounts[kind];
    if (count > bestCount) {
      bestCount = count;
      best = kind;
    }
  }
  return best;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "to", "of", "for", "and", "or", "with", "without",
  "is", "are", "be", "in", "on", "at", "by", "as", "it", "this", "that",
  "from", "into", "via", "build", "design", "create",
]);

function significantTokens(statement: string): string[] {
  return statement
    .toLowerCase()
    .split(/[^a-z0-9-]+/)
    .filter((tok) => tok.length >= 3 && !STOP_WORDS.has(tok));
}

function aarMatchScore(record: AARRecord, tokens: readonly string[]): number {
  if (tokens.length === 0) return 0;
  const corpus = `${record.intent} ${record.takeaway}`.toLowerCase();
  if (corpus.trim().length === 0) return 0;
  let hits = 0;
  for (const token of tokens) {
    if (corpus.includes(token)) hits += 1;
  }
  return hits;
}

export type MotifSuggestionSource = "keyword" | "aar";

export type MotifSuggestionFull = {
  kind: MotifKind;
  reasoning: string;
  source: MotifSuggestionSource;
  recordId?: string;
};

/**
 * Like `suggestMotif` but folds in past AAR records as an additional
 * signal source. AAR matches win over keyword matches when both fire,
 * because past AAR text is solver-authored and more semantically rich
 * than the fixed keyword corpus.
 */
export function suggestMotifWithAARs(
  statement: string,
  aarRecords: readonly AARRecord[],
): MotifSuggestionFull | null {
  const trimmed = statement.trim();
  if (trimmed.length === 0) return null;

  // AAR pass: find the AAR whose intent/takeaway text best matches the
  // statement's significant tokens.
  const tokens = significantTokens(trimmed);
  let bestAARScore = 0;
  let bestAAR: AARRecord | null = null;
  for (const record of aarRecords) {
    const score = aarMatchScore(record, tokens);
    if (score > bestAARScore) {
      bestAARScore = score;
      bestAAR = record;
    }
  }
  if (bestAAR) {
    const kind = dominantMotifKind(bestAAR);
    if (kind) {
      return {
        kind,
        reasoning: `matched past AAR — ${bestAAR.takeaway || bestAAR.intent || "(no text)"}`,
        source: "aar",
        recordId: bestAAR.id,
      };
    }
  }

  // Keyword pass: same as legacy suggestMotif.
  const keyword = suggestMotif(statement);
  if (!keyword) return null;
  return { ...keyword, source: "keyword" };
}

export function suggestMotif(statement: string): MotifSuggestion | null {
  const text = statement.toLowerCase();
  if (text.trim().length === 0) return null;

  const scores: { kind: MotifKind; matches: string[] }[] = [];
  for (const kind of Object.keys(MOTIF_KEYWORDS) as MotifKind[]) {
    const matches = MOTIF_KEYWORDS[kind].filter((kw) => text.includes(kw));
    if (matches.length > 0) scores.push({ kind, matches });
  }
  if (scores.length === 0) return null;

  scores.sort((a, b) => b.matches.length - a.matches.length);
  const winner = scores[0]!;
  return {
    kind: winner.kind,
    reasoning: `matched ${winner.matches.map((m) => `"${m}"`).join(", ")}`,
  };
}
