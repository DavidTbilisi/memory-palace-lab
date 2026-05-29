import { useEffect, useMemo } from "react";
import { usePalaceStore } from "../../store/palaceStore";
import { selectCrux, type Crux } from "../../domain/services/cast/crux";
import { useGraphAnalysis } from "./useGraphAnalysis";

export type ComprehendCrux = {
  /** Null when the palace is empty or has no gating structure yet. */
  crux: Crux | null;
  cruxTitle: string | null;
  /** Counts that orient the reader before they dive on the crux. */
  nodeCount: number;
  edgeCount: number;
  motifTotal: number;
};

/**
 * Derives the Comprehend-mode crux from the open palace's graph and mirrors its
 * node id into the store so the canvas can spotlight it. Returns the crux plus a
 * small structural summary for the panel header.
 */
export function useComprehendCrux(): ComprehendCrux {
  const nodes = usePalaceStore((s) => s.nodes);
  const edges = usePalaceStore((s) => s.edges);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const setComprehendCruxNodeId = usePalaceStore((s) => s.setComprehendCruxNodeId);

  const palaceRef = useMemo(
    () => (currentPalace ? { id: currentPalace.id, name: currentPalace.name } : null),
    [currentPalace],
  );

  const { analysis, nodeTitleById, motifTotal } = useGraphAnalysis(nodes ?? [], edges ?? [], palaceRef);

  const crux = useMemo(() => selectCrux(analysis), [analysis]);

  useEffect(() => {
    setComprehendCruxNodeId(crux?.nodeId ?? null);
  }, [crux, setComprehendCruxNodeId]);

  return {
    crux,
    cruxTitle: crux ? nodeTitleById.get(crux.nodeId) ?? "Untitled" : null,
    nodeCount: analysis.nodeCount,
    edgeCount: analysis.edgeCount,
    motifTotal,
  };
}
