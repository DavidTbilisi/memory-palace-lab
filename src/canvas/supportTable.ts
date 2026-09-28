import type { Editor } from "@tldraw/editor";
import {
  TABLE_IMAGE_LETTERS,
  formatTableNumber,
  numberClusterSlots,
  type NumberClusterInput,
  type StoreRole,
} from "../domain/services/generatedStore";
import {
  drawMissingLinks,
  drawStoreSlot,
  isStoreNodeFilledOnCanvas,
  placeStoreNode,
  resetStoreNode,
  slotKey,
  storeNodes,
} from "./storeNodes";

/** The number codes the table already holds, ascending. */
export function tableNumbers(editor: Editor): number[] {
  return [...storeNodes(editor).values()]
    .filter((node) => node.role === "number" && node.address)
    .map((node) => Number(node.address))
    .sort((a, b) => a - b);
}

/** Nodes of one number's cluster that hold the learner's material. */
export function filledClusterNodes(editor: Editor, number: number): { role: StoreRole; address: string | null }[] {
  const code = formatTableNumber(number);
  return [...storeNodes(editor).values()]
    .filter((node) => node.address === code || node.address?.startsWith(`${code}.`))
    .filter((node) => isStoreNodeFilledOnCanvas(node, node.address ?? ""))
    .map(({ role, address }) => ({ role, address }));
}

/** Filled cells across the whole table. */
export function filledTableCells(editor: Editor): number {
  return [...storeNodes(editor).values()].filter(
    (node) => node.role === "cell" && isStoreNodeFilledOnCanvas(node, node.address ?? ""),
  ).length;
}

/** The number leads to its first association, and each association to the next: S → R(S) → R(S). */
function clusterLinks(code: string): { from: string; to: string }[] {
  const [a, b, c] = TABLE_IMAGE_LETTERS.map((letter) => slotKey("image", `${code}.${letter}`));
  return [
    { from: slotKey("number", code), to: a! },
    { from: a!, to: b! },
    { from: b!, to: c! },
  ];
}

/**
 * Add a number to the table, or rewrite one it already holds: its image, three associations, and
 * their nine parts as cells. Nodes that hold the learner's material keep it unless
 * `replaceFilled`, which the caller only passes once the learner has confirmed it. One undo step.
 */
export function writeNumberCluster(
  editor: Editor,
  palaceId: string,
  input: NumberClusterInput,
  options: { replaceFilled: boolean },
): { added: number; updated: number; kept: number } {
  let added = 0;
  let updated = 0;
  let kept = 0;
  const code = formatTableNumber(input.number);
  editor.markHistoryStoppingPoint(`write number ${code}`);
  editor.run(() => {
    const nodes = storeNodes(editor);
    for (const slot of numberClusterSlots(input)) {
      const node = nodes.get(slotKey(slot.role, slot.address));
      if (!node) {
        drawStoreSlot(editor, palaceId, slot, slot.title);
        added += 1;
        continue;
      }
      if (isStoreNodeFilledOnCanvas(node, slot.address ?? "") && !options.replaceFilled) {
        placeStoreNode(editor, node, slot);
        kept += 1;
        continue;
      }
      resetStoreNode(editor, node, slot, slot.title);
      updated += 1;
    }
    drawMissingLinks(editor, palaceId, clusterLinks(code));
  });
  return { added, updated, kept };
}

/** What a number already in the table says, to edit it; blanks where the learner left placeholders. */
export function readNumberCluster(editor: Editor, number: number): NumberClusterInput | null {
  const code = formatTableNumber(number);
  const nodes = storeNodes(editor);
  const base = nodes.get(slotKey("number", code));
  if (!base) return null;
  const titleOf = (role: StoreRole, address: string, placeholder: string) => {
    const title = nodes.get(slotKey(role, address))?.meta.mpTitle?.trim() ?? "";
    return title === placeholder ? "" : title;
  };
  const associations = TABLE_IMAGE_LETTERS.map((letter) => titleOf("image", `${code}.${letter}`, `${code} · image ${letter}`));
  const parts = [0, 1, 2].map((i) =>
    [0, 1, 2].map((p) => {
      const address = `${code}.${i * 3 + p + 1}`;
      return titleOf("cell", address, address);
    }),
  );
  return {
    number,
    image: titleOf("number", code, `${code} · number image`),
    associations: associations as NumberClusterInput["associations"],
    parts: parts as NumberClusterInput["parts"],
  };
}
