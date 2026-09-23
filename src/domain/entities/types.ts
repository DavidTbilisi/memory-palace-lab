export type CanvasObjectType = "node" | "edge" | "region" | "note" | "drawing" | "route";

export interface Palace {
  id: string;
  name: string;
  createdAt: string;
  alias?: string | null;
  atlasPath?: string | null;
  editorSnapshot?: string | null;
  deletedAt?: string | null;
  purgeAt?: string | null;
  /**
   * Bumped by every save, in the app, the MCP server and the CLI alike. Sync compares it
   * against the revision this device last agreed on to tell "moved ahead" from "untouched".
   * Optional because rows written before revision tracking, and older backup files, have none.
   */
  rev?: number;
  /** When `rev` last changed. Display only — no sync decision reads a peer's clock. */
  updatedAt?: string | null;
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

/**
 * Optional, learner-judged inputs for the /difficulty estimator. When absent,
 * the difficulty adapter auto-derives every field from the palace graph and the
 * node's content (so every node still gets a unit). Setting any field here
 * overrides just that field — the "hybrid" model.
 */
export type NodeDifficultyOverride = {
  new_ideas?: number;
  normal_links?: number;
  breaks?: string[];
  analogy_links?: number;
  juggle?: number;
  key_idea?: string | null;
  extra_needs?: string[];
};

export interface MemoryNode {
  id: string;
  objectId: string;
  title: string;
  alias?: string;
  content: string;
  kind: MemoryNodeKind;
  portal: PalacePortalRef | null;
  imageUrl?: string | null;
  tags?: string[];
  difficulty?: NodeDifficultyOverride | null;
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

/** Palette for route paths and stop badges on the canvas. */
export const ROUTE_COLORS = ["violet", "sky", "emerald", "amber", "rose", "cyan", "orange", "fuchsia"] as const;
export type RouteColor = (typeof ROUTE_COLORS)[number];

/** A `#key:value` tag written under a route's header in the DSL, e.g. `#prereq:Gate of SOLID`. */
export interface RouteMetadataTag {
  key: string;
  value: string | null;
}

export interface MemoryRoute {
  id: string;
  palaceId: string;
  name: string;
  /** Unset routes take a palette color from their position in the route list. */
  color?: RouteColor | null;
  /** Hidden routes are not drawn on the canvas. */
  hidden?: boolean;
  /** Route metadata from the DSL (`#difficulty:advanced #prereq:…`), in the order written. */
  metadata?: RouteMetadataTag[];
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
  /** What a walk shows at this stop; without one it zooms to the node. */
  view?: StopView | null;
}

/**
 * A stop's saved view: the page area that was visible, positioned relative to the center of
 * the stop's node so the view moves with the node.
 */
export interface StopView {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type AnalyticsEventGroup = "palace" | "graph" | "review" | "system";

export type AnalyticsEventType =
  | "palace_created"
  | "palace_opened"
  | "palace_saved"
  | "palace_deleted"
  | "palace_restored"
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

export { CAST_WHO, CAST_HOW, CAST_WHAT, CAST_WHEN } from "../../data/castLexicon";
import { CAST_WHO, CAST_HOW, CAST_WHAT, CAST_WHEN } from "../../data/castLexicon";

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
