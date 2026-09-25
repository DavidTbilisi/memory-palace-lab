import type { NedfSlot } from "../domain/entities/types";
import { walkOrderedLoci } from "../domain/services/walkService";
import { usePalaceStore } from "../store/palaceStore";
import { requestNavigation } from "./navigationEvents";

export type ReviewStart = {
  palaceId: string;
  routeId: string;
  locusId?: string;
  nodeId?: string;
  /** The NEDF slot to ask at that stop, as the due queue chose it; picked afresh when omitted. */
  slot?: NedfSlot | null;
};

/**
 * The one way to begin a recall-first walk: open the palace if needed, arm
 * the route in walk mode, jump to the requested locus, and land on the graph.
 * Reads the store again after the palace loads so the index is computed from
 * the loci that actually exist.
 */
export async function startReviewAt({ palaceId, routeId, locusId, nodeId, slot }: ReviewStart): Promise<void> {
  const before = usePalaceStore.getState();
  if (before.currentPalace?.id !== palaceId) {
    await before.openPalace(palaceId);
  }
  const store = usePalaceStore.getState();
  store.setWalkRoute(routeId);
  store.setWalkRecallMode(true);
  store.setWalkCueOnly(true);
  store.setWalkOpen(true);

  const { loci, walkDirection } = usePalaceStore.getState();
  const routeLoci = walkOrderedLoci(
    loci.filter((locus) => locus.routeId === routeId),
    walkDirection,
  );
  const targetIndex = routeLoci.findIndex(
    (locus) => (locusId !== undefined && locus.id === locusId) || (nodeId !== undefined && locus.nodeId === nodeId),
  );
  if (targetIndex >= 0) {
    usePalaceStore.setState({ walkIndex: targetIndex });
    usePalaceStore.getState().selectWalkSlot(slot);
  }
  requestNavigation("graph");
}
