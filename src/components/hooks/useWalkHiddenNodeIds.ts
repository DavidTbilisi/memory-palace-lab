import { useMemo } from "react";
import type { MemoryPalaceMeta } from "../../canvas/memoryMeta";
import { NO_CARD_COVER, walkCardCover, walkHiddenNodeIds, type WalkCardCover } from "../../domain/services/walkReveal";
import { usePalaceStore } from "../../store/palaceStore";

/**
 * What the card being asked turns around while its answer is still hidden (`walkCardCover`):
 * nothing for most cards; for an Event → date card, the event shows and its date image and date
 * label hide.
 */
export function useWalkCardCover(): WalkCardCover {
  const asking = usePalaceStore((s) => s.walkOpen && s.walkRecallMode && !s.walkAnswerRevealed);
  const slot = usePalaceStore((s) => s.walkSlot);
  const currentNodeId = usePalaceStore((s) => (s.walkOpen && s.walkRecallMode ? s.currentWalkNodeId() : null));
  const editorRef = usePalaceStore((s) => s.editorRef);

  return useMemo(() => {
    if (!asking || slot !== "eventToDate" || !currentNodeId) return NO_CARD_COVER;
    const image = editorRef
      ?.getCurrentPageShapes()
      .find((shape) => (shape.meta as MemoryPalaceMeta | undefined)?.mpPairNodeId === currentNodeId);
    const imageNodeId = (image?.meta as MemoryPalaceMeta | undefined)?.mpNodeId ?? null;
    return walkCardCover(slot, currentNodeId, imageNodeId);
  }, [asking, currentNodeId, editorRef, slot]);
}

/** The nodes a recall-first walk keeps hidden right now; empty when no such walk is open. */
export function useWalkHiddenNodeIds(): ReadonlySet<string> {
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const recallMode = usePalaceStore((s) => s.walkRecallMode);
  const answerRevealed = usePalaceStore((s) => s.walkAnswerRevealed);
  const currentNodeId = usePalaceStore((s) => (s.walkOpen && s.walkRecallMode ? s.currentWalkNodeId() : null));
  const loci = usePalaceStore((s) => s.loci);
  const routeId = usePalaceStore((s) => s.walkRouteId ?? s.routes[0]?.id ?? null);
  const walkSessionId = usePalaceStore((s) => s.walkSessionId);
  const revealedSessionId = usePalaceStore((s) => s.walkRevealedSessionId);
  const revealedNodeIds = usePalaceStore((s) => s.walkRevealedNodeIds);
  const cardCover = useWalkCardCover();

  return useMemo(
    () =>
      walkHiddenNodeIds({
        walkOpen,
        recallMode,
        answerRevealed,
        currentNodeId,
        routeNodeIds: loci.filter((locus) => locus.routeId === routeId).map((locus) => locus.nodeId),
        revealedNodeIds: revealedSessionId === walkSessionId ? revealedNodeIds : [],
        cardCover,
      }),
    [answerRevealed, cardCover, currentNodeId, loci, recallMode, revealedNodeIds, revealedSessionId, routeId, walkOpen, walkSessionId],
  );
}
