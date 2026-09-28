import type { Editor } from "@tldraw/editor";
import { blockPlaceholder, fourLevelBlockSlots, type StoreRole } from "../domain/services/generatedStore";
import {
  drawMissingLinks,
  drawStoreSlot,
  isStoreNodeFilledOnCanvas,
  placeStoreNode,
  resetStoreNode,
  slotKey,
  storeNodes,
} from "./storeNodes";

/** The store nodes that hold the learner's material, which regenerating leaves alone unless told. */
export function filledBlockNodes(editor: Editor, theme: string): { role: StoreRole; address: string | null }[] {
  return [...storeNodes(editor).values()]
    .filter((node) => isStoreNodeFilledOnCanvas(node, blockPlaceholder(node.role, node.address, theme)))
    .map(({ role, address }) => ({ role, address }));
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
    for (const slot of fourLevelBlockSlots(theme)) drawStoreSlot(editor, palaceId, slot, slot.placeholder, origin);
    drawMissingLinks(editor, palaceId, chainLinks());
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
        drawStoreSlot(editor, palaceId, slot, slot.placeholder, origin);
        redrawn += 1;
        continue;
      }
      const filled = isStoreNodeFilledOnCanvas(node, slot.placeholder);
      if (filled && !options.clearFilled) {
        placeStoreNode(editor, node, slot, origin);
        continue;
      }
      if (filled) cleared += 1;
      resetStoreNode(editor, node, slot, slot.placeholder, origin);
    }
    drawMissingLinks(editor, palaceId, chainLinks());
  });
  return { redrawn, cleared };
}
