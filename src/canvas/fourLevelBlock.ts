import type { Editor } from "@tldraw/editor";
import { toRichText, type TLShapeId } from "@tldraw/tlschema";
import { CAST_HOW, CAST_WHAT, CAST_WHEN, CAST_WHO } from "../domain/entities/types";
import { normalizeAttributes } from "../domain/services/attributes";
import {
  blockPlaceholder,
  fourLevelBlockSlots,
  isStoreNodeFilled,
  type BlockSlot,
  type StoreRole,
} from "../domain/services/generatedStore";
import { normalizeNedf } from "../domain/services/nedf";
import { createGeoMemoryNode, createMemoryArrow } from "./createMemoryShapes";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape, nodeShapeHasLabel, type MemoryNodeShapeType } from "./memoryNodeShape";

type StoreNode = { shapeId: TLShapeId; nodeId: string; type: MemoryNodeShapeType; role: StoreRole; address: string | null; meta: MemoryPalaceMeta };

const slotKey = (role: StoreRole, address: string | null) => `${role}:${address ?? ""}`;

function storeNodes(editor: Editor): Map<string, StoreNode> {
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

function isFilled(node: StoreNode, theme: string): boolean {
  return isStoreNodeFilled({
    title: node.meta.mpTitle ?? "",
    placeholder: blockPlaceholder(node.role, node.address, theme),
    content: node.meta.mpContent,
    imageUrl: node.meta.mpImageUrl,
    hasNedf: !!normalizeNedf(node.meta.mpNedf),
    hasAttributes: !!normalizeAttributes(node.meta.mpAttributes),
  });
}

/** The store nodes that hold the learner's material, which regenerating leaves alone unless told. */
export function filledBlockNodes(editor: Editor, theme: string): { role: StoreRole; address: string | null }[] {
  return [...storeNodes(editor).values()]
    .filter((node) => isFilled(node, theme))
    .map(({ role, address }) => ({ role, address }));
}

const DEFAULT_CAST = { ab: CAST_WHO[0], cd: CAST_HOW[0], ef: CAST_WHAT[0], gh: CAST_WHEN[0] };

function drawSlot(editor: Editor, palaceId: string, slot: BlockSlot, origin: { x: number; y: number }) {
  return createGeoMemoryNode(editor, palaceId, { x: origin.x + slot.x, y: origin.y + slot.y }, {
    title: slot.placeholder,
    size: { w: slot.w, h: slot.h },
    meta: { mpStoreRole: slot.role, ...(slot.address ? { mpAddress: slot.address } : {}) },
    select: false,
  });
}

/** The theme leads to each branch's first sticker; each sticker leads to the next, nose to tail. */
function chainLinks(): { from: string; to: string }[] {
  const links: { from: string; to: string }[] = [];
  for (let b = 1; b <= 5; b++) {
    links.push({ from: slotKey("theme", null), to: slotKey("sticker", `${b}.1`) });
    for (let s = 1; s < 5; s++) links.push({ from: slotKey("sticker", `${b}.${s}`), to: slotKey("sticker", `${b}.${s + 1}`) });
  }
  return links;
}

function linkedPairs(editor: Editor): Set<string> {
  const pairs = new Set<string>();
  for (const shape of editor.getCurrentPageShapes()) {
    const meta = shape.meta as MemoryPalaceMeta;
    if (meta.mpEdgeId && meta.mpSourceNodeId && meta.mpTargetNodeId) pairs.add(`${meta.mpSourceNodeId}>${meta.mpTargetNodeId}`);
  }
  return pairs;
}

function drawMissingLinks(editor: Editor, palaceId: string) {
  const nodes = storeNodes(editor);
  const existing = linkedPairs(editor);
  for (const link of chainLinks()) {
    const from = nodes.get(link.from);
    const to = nodes.get(link.to);
    if (!from || !to || existing.has(`${from.nodeId}>${to.nodeId}`)) continue;
    createMemoryArrow(editor, palaceId, from.shapeId, to.shapeId, from.nodeId, to.nodeId, DEFAULT_CAST);
  }
}

/** The node at a store address, e.g. "2.3.4" for a cell or "2.3" for a sticker. */
export function findNodeByAddress(editor: Editor, address: string): string | null {
  for (const node of storeNodes(editor).values()) {
    if (node.address === address) return node.nodeId;
  }
  return null;
}

/** Cell node ids in address order, for the block's route. */
export function blockCellOrder(editor: Editor): string[] {
  const nodes = storeNodes(editor);
  return fourLevelBlockSlots("")
    .filter((slot) => slot.role === "cell")
    .map((slot) => nodes.get(slotKey("cell", slot.address))?.nodeId)
    .filter((id): id is string => !!id);
}

/**
 * Draw a four-level block: the theme, 25 placeholder stickers, 125 addressed cells, and the chain
 * of arrows that keeps each branch in order. One undo step.
 */
export function drawFourLevelBlock(editor: Editor, palaceId: string, theme: string, origin = { x: 0, y: 0 }) {
  editor.markHistoryStoppingPoint("generate four-level block");
  editor.run(() => {
    for (const slot of fourLevelBlockSlots(theme)) drawSlot(editor, palaceId, slot, origin);
    drawMissingLinks(editor, palaceId);
  });
}

/**
 * Rebuild a block's scaffold: redraw missing nodes and links, put every node back in its place,
 * and reset empty nodes to their placeholders. Filled nodes keep what they hold unless
 * `clearFilled`, which the caller only passes after the learner has confirmed it.
 */
export function regenerateFourLevelBlock(
  editor: Editor,
  palaceId: string,
  theme: string,
  options: { clearFilled: boolean; origin?: { x: number; y: number } },
): { redrawn: number; cleared: number } {
  const origin = options.origin ?? { x: 0, y: 0 };
  let redrawn = 0;
  let cleared = 0;
  editor.markHistoryStoppingPoint("regenerate four-level block");
  editor.run(() => {
    const nodes = storeNodes(editor);
    for (const slot of fourLevelBlockSlots(theme)) {
      const node = nodes.get(slotKey(slot.role, slot.address));
      if (!node) {
        drawSlot(editor, palaceId, slot, origin);
        redrawn += 1;
        continue;
      }
      const position = { x: origin.x + slot.x - slot.w / 2, y: origin.y + slot.y - slot.h / 2 };
      const filled = isFilled(node, theme);
      if (filled && !options.clearFilled) {
        editor.updateShape({ id: node.shapeId, type: node.type, ...position });
        continue;
      }
      if (filled) cleared += 1;
      // tldraw merges meta key by key, so null is what clears a field.
      const meta: MemoryPalaceMeta = {
        ...node.meta,
        mpTitle: slot.placeholder,
        mpContent: "",
        mpImageUrl: null,
        mpNedf: null,
        mpAttributes: null,
      };
      editor.updateShape({ id: node.shapeId, type: node.type, ...position, meta });
      // Only a geo node draws its title; an image node keeps it in meta alone.
      if (nodeShapeHasLabel({ type: node.type })) {
        editor.updateShape({ id: node.shapeId, type: "geo", props: { richText: toRichText(slot.placeholder), w: slot.w, h: slot.h } });
      }
    }
    drawMissingLinks(editor, palaceId);
  });
  return { redrawn, cleared };
}
