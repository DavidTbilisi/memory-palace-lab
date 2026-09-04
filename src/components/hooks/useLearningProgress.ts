import { useEffect, useMemo, useReducer } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import { buildProgressChecks, type ProgressCheck } from "../../content/lessons";
import { usePalaceStore } from "../../store/palaceStore";

export type LearningProgress = {
  checks: ProgressCheck[];
  allDone: boolean;
  nodeCount: number;
  edgeCount: number;
};

/**
 * First-session progress derived from the store plus a live scan of the
 * canvas. Re-renders on document changes so node/edge counts stay current.
 */
export function useLearningProgress(): LearningProgress {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const [revision, bumpRevision] = useReducer((value: number) => value + 1, 0);

  useEffect(() => {
    if (!editorRef) return;
    const unlisten = editorRef.store.listen(
      () => {
        bumpRevision();
      },
      { source: "all", scope: "document" },
    );
    return () => {
      unlisten();
    };
  }, [editorRef]);

  const counts = useMemo(() => {
    void revision;
    if (!editorRef) return { nodeCount: 0, edgeCount: 0 };
    let nodeCount = 0;
    let edgeCount = 0;
    for (const id of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(id as TLShapeId);
      if (!shape) continue;
      const meta = shape.meta as { mpNodeId?: string; mpEdgeId?: string };
      if (shape.type === "geo" && meta.mpNodeId) nodeCount += 1;
      if (shape.type === "arrow" && meta.mpEdgeId) edgeCount += 1;
    }
    return { nodeCount, edgeCount };
  }, [editorRef, revision]);

  const checks = useMemo(
    () =>
      buildProgressChecks({
        palaceCount: palaces.length,
        hasOpenPalace: !!currentPalace,
        nodeCount: counts.nodeCount,
        edgeCount: counts.edgeCount,
        routeCount: routes.length,
        locusCount: loci.length,
      }),
    [counts.edgeCount, counts.nodeCount, currentPalace, loci.length, palaces.length, routes.length],
  );

  return { checks, allDone: checks.every((check) => check.ok), ...counts };
}
