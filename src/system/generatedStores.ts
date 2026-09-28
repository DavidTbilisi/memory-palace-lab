import { blockCellOrder, drawFourLevelBlock, filledBlockNodes, regenerateFourLevelBlock } from "../canvas/fourLevelBlock";
import type { Locus, MemoryRoute } from "../domain/entities/types";
import { parseStore, serializeStore, type FourLevelBlock } from "../domain/services/generatedStore";
import { usePalaceStore } from "../store/palaceStore";
import { waitForEditorReady } from "./examplePalaces";

/**
 * The block's route: its cells in address order. A store is found by address, not walked, so the
 * route starts hidden and as a draft; the learner can show it or turn review on from the Routes
 * tab. Stops already on it keep their schedules.
 */
function syncBlockRoute(block: FourLevelBlock, cellOrder: string[]): string {
  const state = usePalaceStore.getState();
  const existing = block.routeId ? state.routes.find((route) => route.id === block.routeId) : undefined;
  const route: MemoryRoute = existing ?? {
    id: crypto.randomUUID(),
    palaceId: state.currentPalace!.id,
    name: `${block.theme} · block`,
    inReview: false,
    hidden: true,
  };
  const previous = new Map(state.loci.filter((locus) => locus.routeId === route.id).map((locus) => [locus.nodeId, locus]));
  const stops: Locus[] = cellOrder.map((nodeId, orderIndex) => ({
    ...(previous.get(nodeId) ?? { id: crypto.randomUUID(), routeId: route.id, nodeId, label: "" }),
    orderIndex,
  }));
  const routes = existing ? state.routes : [...state.routes, route];
  state.replaceRoutesAndLoci(routes, [...state.loci.filter((locus) => locus.routeId !== route.id), ...stops]);
  return route.id;
}

/** Create a palace holding a new four-level block on `theme`, open it, and save it. */
export async function generateFourLevelBlock(theme: string): Promise<{ palaceId: string }> {
  const name = `${theme.trim()} · block`;
  const previousEditor = usePalaceStore.getState().editorRef;
  await usePalaceStore.getState().createPalace(name);
  const { editor, palaceId } = await waitForEditorReady({ expectPalaceName: name, previousEditor });
  drawFourLevelBlock(editor, palaceId, theme.trim());
  const block: FourLevelBlock = { kind: "four-level-block", theme: theme.trim(), generatedAt: new Date().toISOString(), routeId: null };
  block.routeId = syncBlockRoute(block, blockCellOrder(editor));
  usePalaceStore.getState().setCurrentStore(serializeStore(block));
  await usePalaceStore.getState().saveCurrent();
  return { palaceId };
}

/** The open palace's block, if it is one. */
export function currentBlock(): FourLevelBlock | null {
  const store = parseStore(usePalaceStore.getState().currentPalace?.storeJson);
  return store?.kind === "four-level-block" ? store : null;
}

/** How many of the open block's nodes hold material; regenerating asks before clearing them. */
export function currentBlockFilledCount(): number {
  const block = currentBlock();
  const editor = usePalaceStore.getState().editorRef;
  return block && editor ? filledBlockNodes(editor, block.theme).length : 0;
}

/** Rebuild the open block's scaffold; filled nodes are cleared only with `clearFilled`. */
export function regenerateCurrentBlock(options: { clearFilled: boolean }): { redrawn: number; cleared: number } | null {
  const block = currentBlock();
  const { editorRef: editor, currentPalace } = usePalaceStore.getState();
  if (!block || !editor || !currentPalace) return null;
  const result = regenerateFourLevelBlock(editor, currentPalace.id, block.theme, options);
  const routeId = syncBlockRoute(block, blockCellOrder(editor));
  if (routeId !== block.routeId) usePalaceStore.getState().setCurrentStore(serializeStore({ ...block, routeId }));
  return result;
}
