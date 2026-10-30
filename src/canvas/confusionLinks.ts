import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import { confusionLinkBetween, type ConfusionEdgeLike } from "../domain/services/confusion";
import { createConfusionLink } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

export type CanvasConfusionEdge = ConfusionEdgeLike & { shapeId: TLShapeId; edgeId: string };

/** Every confusion link drawn on the current page, read live from arrow meta. */
export function canvasConfusionEdges(editor: Editor): CanvasConfusionEdge[] {
  const out: CanvasConfusionEdge[] = [];
  for (const id of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(id);
    if (!shape || shape.type !== "arrow") continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (meta.mpEdgeKind !== "confusion" || !meta.mpEdgeId || !meta.mpSourceNodeId || !meta.mpTargetNodeId) continue;
    out.push({
      shapeId: shape.id,
      edgeId: meta.mpEdgeId,
      sourceNodeId: meta.mpSourceNodeId,
      targetNodeId: meta.mpTargetNodeId,
      kind: "confusion",
    });
  }
  return out;
}

function nodeShapeId(editor: Editor, nodeId: string): TLShapeId | null {
  for (const id of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(id);
    if (isMemoryNodeShape(shape) && (shape.meta as MemoryPalaceMeta).mpNodeId === nodeId) return shape.id;
  }
  return null;
}

export type LinkConfusionResult = { ok: true; edgeId: string } | { ok: false; message: string };

/** Link two nodes as a confusion. A pair has at most one link, whichever way it was drawn. */
export function linkConfusion(editor: Editor, palaceId: string, nodeId: string, otherNodeId: string): LinkConfusionResult {
  if (nodeId === otherNodeId) return { ok: false, message: "A node cannot be confused with itself." };
  if (confusionLinkBetween(canvasConfusionEdges(editor), nodeId, otherNodeId)) {
    return { ok: false, message: "These two nodes are already linked as a confusion." };
  }
  const from = nodeShapeId(editor, nodeId);
  const to = nodeShapeId(editor, otherNodeId);
  if (!from || !to) return { ok: false, message: "Both nodes must be on the canvas." };
  const created = createConfusionLink(editor, palaceId, from, to, nodeId, otherNodeId);
  if (!created) return { ok: false, message: "Could not draw the link." };
  return { ok: true, edgeId: created.edgeId };
}

/** Remove the confusion link between two nodes. Returns whether there was one. */
export function unlinkConfusion(editor: Editor, nodeId: string, otherNodeId: string): boolean {
  const link = confusionLinkBetween(canvasConfusionEdges(editor), nodeId, otherNodeId);
  if (!link) return false;
  editor.deleteShape(link.shapeId);
  return true;
}
