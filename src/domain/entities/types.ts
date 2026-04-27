export type CanvasObjectType = "node" | "edge" | "region" | "note" | "drawing" | "route";

export interface Palace {
  id: string;
  name: string;
  createdAt: string;
  alias?: string | null;
  atlasPath?: string | null;
  editorSnapshot?: string | null;
}

export interface CanvasObject {
  id: string;
  palaceId: string;
  type: CanvasObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  payloadJson: string;
}

export type MemoryNodeKind = "memory" | "portal";

export interface PalacePortalRef {
  targetPalaceId?: string;
  targetPalaceName?: string;
  targetAtlasPath?: string | null;
  targetRouteId?: string;
  targetRouteName?: string;
  targetNodeId?: string;
}

export interface MemoryNode {
  id: string;
  objectId: string;
  title: string;
  alias?: string;
  content: string;
  kind: MemoryNodeKind;
  portal: PalacePortalRef | null;
}

export interface MemoryEdge {
  id: string;
  objectId: string;
  sourceNodeId: string;
  targetNodeId: string;
  alias?: string;
  castAb: string;
  castCd: string;
  castEf: string;
  castGh: string;
}

export interface MemoryRoute {
  id: string;
  palaceId: string;
  name: string;
}

export interface Locus {
  id: string;
  routeId: string;
  nodeId: string;
  orderIndex: number;
  label: string;
  interval?: number;
  easeFactor?: number;
  nextReviewAt?: string;
  repetitions?: number;
  lastReviewedAt?: string | null;
}

export type AnalyticsEventGroup = "palace" | "graph" | "review" | "system";

export type AnalyticsEventType =
  | "palace_created"
  | "palace_opened"
  | "palace_saved"
  | "draft_saved"
  | "node_created"
  | "node_updated"
  | "edge_created"
  | "edge_updated"
  | "route_created"
  | "locus_added"
  | "locus_updated"
  | "walk_started"
  | "walk_stepped"
  | "walk_answer_revealed"
  | "walk_recall_rated"
  | "walk_closed"
  | "walk_completed"
  | "system_run_materialized";

export type RecallRating = "again" | "hard" | "good" | "easy";

export interface AnalyticsEvent {
  id: string;
  sessionId?: string | null;
  palaceId?: string | null;
  routeId?: string | null;
  nodeId?: string | null;
  eventType: AnalyticsEventType;
  eventGroup: AnalyticsEventGroup;
  createdAt: string;
  payloadJson: string;
}

export interface PalaceSnapshot {
  palace: Palace;
  canvasObjects: CanvasObject[];
  nodes: MemoryNode[];
  edges: MemoryEdge[];
  routes: MemoryRoute[];
  loci: Locus[];
}

export const CAST_WHO = ["Giant", "Mermaid", "Mage", "Dragon"] as const;
export const CAST_HOW = ["Crushing", "Flowing", "Spreading", "Exploding"] as const;
export const CAST_WHAT = ["Rock", "Water", "Cloud", "Lightning"] as const;
export const CAST_WHEN = ["Red cave", "Blue ocean", "Green sky", "Purple storm"] as const;

export type CastWho = (typeof CAST_WHO)[number];
export type CastHow = (typeof CAST_HOW)[number];
export type CastWhat = (typeof CAST_WHAT)[number];
export type CastWhen = (typeof CAST_WHEN)[number];

export function encodeCastEdge(ab: string, cd: string, ef: string, gh: string): string {
  return [ab, cd, ef, gh].join("|");
}

export function decodeCastEdge(encoded: string): { ab: string; cd: string; ef: string; gh: string } {
  const [ab = "", cd = "", ef = "", gh = ""] = encoded.split("|");
  return { ab, cd, ef, gh };
}
