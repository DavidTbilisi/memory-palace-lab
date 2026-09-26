import {
  COUNT_SHAPE_NAMES,
  LADDER_REASON,
  canUsePolygon,
  ladderRungs,
  polygonRadius,
  polygonVertices,
  type CountShapeKind,
  type Point,
} from "../domain/services/countShape";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

type Shape = { id: string; type: string; meta?: unknown };
type Bounds = { x: number; y: number; w: number; h: number };

/** What the layout needs from an editor; both tldraw's and the MCP server's snapshot editor fit. */
export interface CountShapeEditor {
  getCurrentPageShapeIds(): Iterable<string>;
  getShape(id: string): Shape | undefined;
  getShapePageBounds(id: string): Bounds | null | undefined;
  updateShape(patch: { id: string; type: string; x: number; y: number }): void;
  run(fn: () => void): unknown;
  markHistoryStoppingPoint?(name?: string): unknown;
}

export type CountShapeResult =
  | { ok: true; kind: CountShapeKind; count: number; shapeName: string | null; note: string | null }
  | { ok: false; message: string };

type Member = { shape: Shape; bounds: Bounds };

function center(bounds: Bounds): Point {
  return { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 };
}

function nodeShapes(editor: CountShapeEditor): Map<string, Shape> {
  const byNodeId = new Map<string, Shape>();
  for (const id of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(id);
    const nodeId = (shape?.meta as MemoryPalaceMeta | undefined)?.mpNodeId;
    if (isMemoryNodeShape(shape) && nodeId) byNodeId.set(nodeId, shape);
  }
  return byNodeId;
}

/** Distinct nodes a node has edges to, in the order the edges were drawn. The node itself is left out. */
export function outgoingTargetNodeIds(editor: CountShapeEditor, nodeId: string): string[] {
  const targets: string[] = [];
  for (const id of editor.getCurrentPageShapeIds()) {
    const meta = editor.getShape(id)?.meta as MemoryPalaceMeta | undefined;
    if (!meta?.mpEdgeId || meta.mpSourceNodeId !== nodeId) continue;
    const target = meta.mpTargetNodeId;
    if (target && target !== nodeId && !targets.includes(target)) targets.push(target);
  }
  return targets;
}

/** Clockwise angle from straight up, so members keep their places around the hub when they can. */
function angleFromTop(from: Point, to: Point): number {
  const angle = Math.atan2(to.x - from.x, -(to.y - from.y));
  return angle < 0 ? angle + 2 * Math.PI : angle;
}

/**
 * Lay a node's outgoing targets out around it: on the polygon of their count, or on an ordered
 * ladder. A polygon asked for above seven members takes the ladder and says why. One undo step.
 */
export function applyCountShape(editor: CountShapeEditor, hubNodeId: string, kind: CountShapeKind): CountShapeResult {
  const shapes = nodeShapes(editor);
  const hub = shapes.get(hubNodeId);
  const hubBounds = hub ? editor.getShapePageBounds(hub.id) : null;
  if (!hub || !hubBounds) return { ok: false, message: "That node is not on the canvas." };

  const members: Member[] = [];
  for (const nodeId of outgoingTargetNodeIds(editor, hubNodeId)) {
    const shape = shapes.get(nodeId);
    const bounds = shape ? editor.getShapePageBounds(shape.id) : null;
    if (shape && bounds) members.push({ shape, bounds });
  }
  if (members.length < 2) {
    return { ok: false, message: "Count-shape needs a node with at least two outgoing edges; its targets are the set." };
  }

  const hubCenter = center(hubBounds);
  const size = {
    w: Math.max(...members.map((m) => m.bounds.w)),
    h: Math.max(...members.map((m) => m.bounds.h)),
  };
  const fellBack = kind === "polygon" && !canUsePolygon(members.length);
  const layout: CountShapeKind = fellBack ? "ladder" : kind;

  let places: Point[];
  if (layout === "polygon") {
    members.sort((a, b) => angleFromTop(hubCenter, center(a.bounds)) - angleFromTop(hubCenter, center(b.bounds)));
    places = polygonVertices(members.length, hubCenter, polygonRadius(members.length, size));
  } else {
    // A ladder is ordered: keep the order the members already read in, top to bottom.
    members.sort((a, b) => a.bounds.y - b.bounds.y || a.bounds.x - b.bounds.x);
    places = ladderRungs(members.length, hubCenter, hubBounds, size);
  }

  editor.markHistoryStoppingPoint?.("count-shape layout");
  editor.run(() => {
    members.forEach((member, i) => {
      const place = places[i];
      editor.updateShape({
        id: member.shape.id,
        type: member.shape.type,
        x: place.x - member.bounds.w / 2,
        y: place.y - member.bounds.h / 2,
      });
    });
  });

  return {
    ok: true,
    kind: layout,
    count: members.length,
    shapeName: layout === "polygon" ? COUNT_SHAPE_NAMES[members.length] : null,
    note: fellBack ? LADDER_REASON : null,
  };
}
