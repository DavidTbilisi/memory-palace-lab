import type { DatabaseSync } from "node:sqlite";
import { CAST_HOW, CAST_WHAT, CAST_WHEN, CAST_WHO } from "../../../src/domain/entities/types";
import type {
  CanvasObject,
  MemoryNode,
  MemoryRoute,
  PalaceSnapshot,
} from "../../../src/domain/entities/types";
import type { SnapshotEditor } from "../snapshotEditor";

export type ServerContext = {
  db: DatabaseSync;
  sentinelDir: string;
};

/** Resolve a node by id, or by exact title / alias (case-insensitive, unique). */
export function resolveNodeRef(nodes: MemoryNode[], ref: string): MemoryNode {
  const byId = nodes.find((n) => n.id === ref);
  if (byId) return byId;
  const lower = ref.toLowerCase();
  const matches = nodes.filter(
    (n) => n.title.toLowerCase() === lower || (n.alias ?? "").toLowerCase() === lower,
  );
  if (matches.length === 1) return matches[0]!;
  if (matches.length > 1) {
    throw new Error(
      `Node reference "${ref}" is ambiguous between ids: ${matches.map((m) => m.id).join(", ")}. Use the id.`,
    );
  }
  throw new Error(`No node found matching "${ref}" (tried id, title, alias).`);
}

/** Resolve a route by id or exact name (case-insensitive, unique). */
export function resolveRouteRef(routes: MemoryRoute[], ref: string): MemoryRoute {
  const byId = routes.find((r) => r.id === ref);
  if (byId) return byId;
  const lower = ref.toLowerCase();
  const matches = routes.filter((r) => r.name.toLowerCase() === lower);
  if (matches.length === 1) return matches[0]!;
  if (matches.length > 1) {
    throw new Error(
      `Route reference "${ref}" is ambiguous between ids: ${matches.map((m) => m.id).join(", ")}. Use the id.`,
    );
  }
  throw new Error(`No route found matching "${ref}" (tried id, name).`);
}

export function shapeIdForNode(editor: SnapshotEditor, nodeId: string): string {
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (shape?.type === "geo" && shape.meta?.mpNodeId === nodeId) return shapeId;
  }
  throw new Error(`No canvas shape found for node "${nodeId}".`);
}

export function shapeIdForEdge(editor: SnapshotEditor, edgeId: string): string {
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (shape?.type === "arrow" && shape.meta?.mpEdgeId === edgeId) return shapeId;
  }
  throw new Error(`No canvas arrow found for edge "${edgeId}".`);
}

/**
 * Default placement for a new node: to the right of the existing shapes'
 * bounding box (createGeoMemoryNode treats the point as the rect center).
 */
export function nextNodePosition(editor: SnapshotEditor): { x: number; y: number } {
  let maxRight = -Infinity;
  let topY = Infinity;
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (shape?.type !== "geo") continue;
    const b = editor.getShapePageBounds(shapeId);
    if (!b) continue;
    maxRight = Math.max(maxRight, b.x + b.w);
    topY = Math.min(topY, b.y);
  }
  if (!Number.isFinite(maxRight)) return { x: 290, y: 230 };
  return { x: maxRight + 120 + 90, y: topY + 50 };
}

export const CAST_AXIS_VALUES = {
  who: CAST_WHO,
  how: CAST_HOW,
  what: CAST_WHAT,
  when: CAST_WHEN,
} as const;

export function validateCastValue(axis: keyof typeof CAST_AXIS_VALUES, value: string): string {
  if (value === "") return value;
  const allowed = CAST_AXIS_VALUES[axis] as readonly string[];
  if (!allowed.includes(value)) {
    throw new Error(
      `Invalid CAST ${axis} value "${value}". Allowed: ${allowed.join(", ")} (or "" for unset).`,
    );
  }
  return value;
}

export function nodeView(node: MemoryNode, canvasObjects: CanvasObject[]) {
  const obj = canvasObjects.find((c) => c.id === node.objectId);
  return {
    id: node.id,
    title: node.title,
    alias: node.alias || undefined,
    content: node.content,
    kind: node.kind,
    portal: node.portal ?? undefined,
    imageUrl: node.imageUrl ?? undefined,
    tags: node.tags && node.tags.length > 0 ? node.tags : undefined,
    position: obj ? { x: obj.x, y: obj.y, width: obj.width, height: obj.height } : undefined,
  };
}

export function snapshotStats(snapshot: PalaceSnapshot) {
  return {
    nodeCount: snapshot.nodes.length,
    edgeCount: snapshot.edges.length,
    routeCount: snapshot.routes.length,
    locusCount: snapshot.loci.length,
  };
}
