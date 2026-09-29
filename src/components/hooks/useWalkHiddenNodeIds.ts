import { useMemo } from "react";
import { walkHiddenNodeIds } from "../../domain/services/walkReveal";
import { usePalaceStore } from "../../store/palaceStore";

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

  return useMemo(
    () =>
      walkHiddenNodeIds({
        walkOpen,
        recallMode,
        answerRevealed,
        currentNodeId,
        routeNodeIds: loci.filter((locus) => locus.routeId === routeId).map((locus) => locus.nodeId),
        revealedNodeIds: revealedSessionId === walkSessionId ? revealedNodeIds : [],
      }),
    [answerRevealed, currentNodeId, loci, recallMode, revealedNodeIds, revealedSessionId, routeId, walkOpen, walkSessionId],
  );
}
