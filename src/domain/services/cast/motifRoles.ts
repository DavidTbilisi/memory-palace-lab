/**
 * Per-node motif role assignment for canvas badge rendering.
 *
 * Where `castMotifs.ts` describes motifs as a whole, this module flips
 * the index: given a list of motifs, return a map of node id → roles.
 * The `MotifRole` union is finer-grained than `MotifKind` so the canvas
 * can distinguish hub vs spoke, diamond source vs sink, cascade endpoint
 * vs middle, etc.
 */

import type { Motif } from "./castMotifs";

export type MotifRole =
  | "hub"
  | "spoke"
  | "bottleneck"
  | "diamondSource"
  | "diamondSink"
  | "diamondMiddle"
  | "feedbackLoop"
  | "cascadeStart"
  | "cascadeEnd"
  | "cascadeMiddle"
  | "bipartiteA"
  | "bipartiteB";

export type MotifRoleVisual = {
  icon: string;
  tone: "hub" | "bottleneck" | "loop" | "diamond" | "cascade" | "bipartite";
};

/**
 * Single-character icon + tonal color group per role. Kept pure so the
 * badge component is data-driven — replacing icons or recoloring tones
 * is a one-file change.
 */
export const MOTIF_ROLE_VISUALS: Record<MotifRole, MotifRoleVisual> = {
  hub: { icon: "★", tone: "hub" },
  spoke: { icon: "·", tone: "hub" },
  bottleneck: { icon: "⌛", tone: "bottleneck" },
  diamondSource: { icon: "◆", tone: "diamond" },
  diamondSink: { icon: "◇", tone: "diamond" },
  diamondMiddle: { icon: "◈", tone: "diamond" },
  feedbackLoop: { icon: "↺", tone: "loop" },
  cascadeStart: { icon: "▶", tone: "cascade" },
  cascadeEnd: { icon: "■", tone: "cascade" },
  cascadeMiddle: { icon: "→", tone: "cascade" },
  bipartiteA: { icon: "A", tone: "bipartite" },
  bipartiteB: { icon: "B", tone: "bipartite" },
};

/**
 * Priority list — higher index = more informative. When a node carries
 * multiple roles, the role highest on this list wins for a single-badge
 * render.
 */
const ROLE_PRIORITY: MotifRole[] = [
  "spoke",
  "cascadeMiddle",
  "diamondMiddle",
  "bipartiteA",
  "bipartiteB",
  "cascadeEnd",
  "cascadeStart",
  "feedbackLoop",
  "diamondSink",
  "diamondSource",
  "hub",
  "bottleneck",
];

const ROLE_PRIORITY_INDEX: Record<MotifRole, number> = Object.fromEntries(
  ROLE_PRIORITY.map((role, i) => [role, i]),
) as Record<MotifRole, number>;

function pushRole(target: Map<string, MotifRole[]>, nodeId: string, role: MotifRole) {
  const list = target.get(nodeId);
  if (list) {
    if (!list.includes(role)) list.push(role);
  } else {
    target.set(nodeId, [role]);
  }
}

export function motifRolesByNode(motifs: readonly Motif[]): Map<string, MotifRole[]> {
  const out = new Map<string, MotifRole[]>();
  for (const motif of motifs) {
    switch (motif.kind) {
      case "hubSpoke":
        pushRole(out, motif.hub, "hub");
        for (const spoke of motif.spokes) pushRole(out, spoke, "spoke");
        break;
      case "bottleneck":
        pushRole(out, motif.node, "bottleneck");
        break;
      case "diamond":
        pushRole(out, motif.source, "diamondSource");
        pushRole(out, motif.sink, "diamondSink");
        pushRole(out, motif.left, "diamondMiddle");
        pushRole(out, motif.right, "diamondMiddle");
        break;
      case "feedbackLoop":
        for (const id of motif.nodeIds) pushRole(out, id, "feedbackLoop");
        break;
      case "cascade":
        motif.nodeIds.forEach((id, i) => {
          if (i === 0) pushRole(out, id, "cascadeStart");
          else if (i === motif.nodeIds.length - 1) pushRole(out, id, "cascadeEnd");
          else pushRole(out, id, "cascadeMiddle");
        });
        break;
      case "bipartite":
        for (const id of motif.sideA) pushRole(out, id, "bipartiteA");
        for (const id of motif.sideB) pushRole(out, id, "bipartiteB");
        break;
    }
  }
  return out;
}

export function primaryRoleFor(roles: readonly MotifRole[]): MotifRole | null {
  if (roles.length === 0) return null;
  let best: MotifRole = roles[0]!;
  let bestPriority = ROLE_PRIORITY_INDEX[best];
  for (let i = 1; i < roles.length; i += 1) {
    const role = roles[i]!;
    const priority = ROLE_PRIORITY_INDEX[role];
    if (priority > bestPriority) {
      best = role;
      bestPriority = priority;
    }
  }
  return best;
}
