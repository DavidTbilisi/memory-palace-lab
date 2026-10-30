import type { Editor } from "@tldraw/editor";
import { toRichText, type TLShapeId } from "@tldraw/tlschema";
import { CAST_HOW, CAST_WHAT, CAST_WHEN, CAST_WHO } from "../domain/entities/types";
import { normalizeAttributes } from "../domain/services/attributes";
import { isStoreNodeFilled, type BlockSlot, type StoreRole } from "../domain/services/generatedStore";
import { normalizeNedf } from "../domain/services/nedf";
import { createGeoMemoryNode, createMemoryArrow } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape, nodeShapeHasLabel, type MemoryNodeShapeType } from "./memoryNodeShape";

/** A node of a generated store, as found on the canvas. */
export type StoreNode = {
  shapeId: TLShapeId;
  nodeId: string;
  type: MemoryNodeShapeType;
  role: StoreRole;
  address: string | null;
  meta: MemoryPalaceMeta;
};

export const slotKey = (role: StoreRole, address: string | null) => `${role}:${address ?? ""}`;

export function storeNodes(editor: Editor): Map<string, StoreNode> {
  const nodes = new Map<string, StoreNode>();
  for (const shape of editor.getCurrentPageShapes()) {
    if (!isMemoryNodeShape(shape)) continue;
    const meta = shape.meta as MemoryPalaceMeta;
    if (!meta.mpStoreRole) continue;
    const address = meta.mpAddress ?? null;
    nodes.set(slotKey(meta.mpStoreRole, address), {
      shapeId: shape.id,
      nodeId: meta.mpNodeId!,
      type: shape.type,
      role: meta.mpStoreRole,
      address,
      meta,
    });
  }
  return nodes;
}

/** The node at a store address, e.g. "2.3.4" in a block or "47.3" in a table. */
export function findNodeByAddress(editor: Editor, address: string): string | null {
  for (const node of storeNodes(editor).values()) {
    if (node.address === address) return node.nodeId;
  }
  return null;
}

/**
 * Whether a store node holds the learner's material. The node's own recorded placeholder is what
 * "untouched" means; `fallback` covers nodes generated before placeholders were recorded.
 */
export function isStoreNodeFilledOnCanvas(node: StoreNode, fallback: string): boolean {
  return isStoreNodeFilled({
    title: node.meta.mpTitle ?? "",
    placeholder: node.meta.mpPlaceholder ?? fallback,
    content: node.meta.mpContent,
    imageUrl: node.meta.mpImageUrl,
    hasNedf: !!normalizeNedf(node.meta.mpNedf),
    hasAttributes: !!normalizeAttributes(node.meta.mpAttributes),
  });
}

export const DEFAULT_CAST = { ab: CAST_WHO[0], cd: CAST_HOW[0], ef: CAST_WHAT[0], gh: CAST_WHEN[0] };

/** Draw one store node at `slot`, titled `title`, which is also its recorded placeholder. */
export function drawStoreSlot(
  editor: Editor,
  palaceId: string,
  slot: BlockSlot,
  title: string,
  origin: { x: number; y: number } = { x: 0, y: 0 },
) {
  return createGeoMemoryNode(editor, palaceId, { x: origin.x + slot.x, y: origin.y + slot.y }, {
    title,
    size: { w: slot.w, h: slot.h },
    meta: { mpStoreRole: slot.role, mpPlaceholder: title, ...(slot.address ? { mpAddress: slot.address } : {}) },
    select: false,
  });
}

/** Put a store node back in its slot and reset it to `title`, clearing whatever it held. */
export function resetStoreNode(editor: Editor, node: StoreNode, slot: BlockSlot, title: string, origin = { x: 0, y: 0 }) {
  const position = { x: origin.x + slot.x - slot.w / 2, y: origin.y + slot.y - slot.h / 2 };
  // tldraw merges meta key by key, so null is what clears a field.
  const meta: MemoryPalaceMeta = {
    ...node.meta,
    mpTitle: title,
    mpPlaceholder: title,
    mpContent: "",
    mpImageUrl: null,
    mpNedf: null,
    mpAttributes: null,
    mpGlyph: null,
  };
  editor.updateShape({ id: node.shapeId, type: node.type, ...position, meta });
  // Only a geo node draws its title; an image node keeps it in meta alone.
  if (nodeShapeHasLabel({ type: node.type })) {
    editor.updateShape({ id: node.shapeId, type: "geo", props: { richText: toRichText(title), w: slot.w, h: slot.h } });
  }
}

/** Move a store node back to its slot, leaving what it holds alone. */
export function placeStoreNode(editor: Editor, node: StoreNode, slot: BlockSlot, origin = { x: 0, y: 0 }) {
  editor.updateShape({
    id: node.shapeId,
    type: node.type,
    x: origin.x + slot.x - slot.w / 2,
    y: origin.y + slot.y - slot.h / 2,
  });
}

/** Draw the arrows among store nodes that are missing, by slot key. */
export function drawMissingLinks(editor: Editor, palaceId: string, links: readonly { from: string; to: string }[]) {
  const nodes = storeNodes(editor);
  const existing = new Set<string>();
  for (const shape of editor.getCurrentPageShapes()) {
    const meta = shape.meta as MemoryPalaceMeta;
    // A confusion link between two cells is not the store's link, so it does not stand in for one.
    if (meta.mpEdgeKind === "confusion") continue;
    if (meta.mpEdgeId && meta.mpSourceNodeId && meta.mpTargetNodeId) existing.add(`${meta.mpSourceNodeId}>${meta.mpTargetNodeId}`);
  }
  for (const link of links) {
    const from = nodes.get(link.from);
    const to = nodes.get(link.to);
    if (!from || !to || existing.has(`${from.nodeId}>${to.nodeId}`)) continue;
    createMemoryArrow(editor, palaceId, from.shapeId, to.shapeId, from.nodeId, to.nodeId, DEFAULT_CAST);
  }
}
