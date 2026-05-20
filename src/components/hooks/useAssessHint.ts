import { useEffect, useMemo, useState } from "react";
import { usePalaceStore } from "../../store/palaceStore";
import { getPalaceRepository } from "../../infrastructure/palaceRepositoryProvider";
import { analyzeGraph } from "../../domain/services/cast/graphAnalysis";
import { detectMotifs, groupMotifs } from "../../domain/services/cast/castMotifs";
import { extractMotifInstances } from "../../domain/services/cast/motifInstances";
import {
  palaceSignature,
  type PalaceSignature,
} from "../../domain/services/cast/palaceSimilarity";
import {
  topMatchingAARs,
  type AARRecord,
} from "../../domain/services/cast/aarRecords";

const ASSESS_THRESHOLD = 0.7;

export type AssessHint = {
  record: AARRecord;
  score: number;
  sourcePalaceName: string;
  dismiss: () => void;
  /** Caller-supplied jump action — set by consumers via setJump. */
  jump: () => void;
};

/**
 * Shared Assess-banner data source. Returns the top-matching past AAR
 * against the current palace's live graph shape, gated by:
 *   - score ≥ 0.7
 *   - palace not in the session's dismissed set
 *   - AAR comes from a different palace (current-palace AARs already show
 *     in the Past AARs tile)
 *
 * Callers pass `onJump` so the banner's "Jump to source" reuses the same
 * navigation behavior as the Related AARs row.
 */
export function useAssessHint(onJump: (record: AARRecord) => void): AssessHint | null {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const palaces = usePalaceStore((s) => s.palaces);
  const palaceNodes = usePalaceStore((s) => s.nodes);
  const palaceEdges = usePalaceStore((s) => s.edges);
  const aarRecords = usePalaceStore((s) => s.aarRecords);
  const aarRecordsLoaded = usePalaceStore((s) => s.aarRecordsLoaded);
  const loadAARRecords = usePalaceStore((s) => s.loadAARRecords);
  const dismissedByPalaceIdRaw = usePalaceStore((s) => s.dismissedAssessByPalaceId);
  const dismissedByPalaceId = useMemo(() => dismissedByPalaceIdRaw ?? [], [dismissedByPalaceIdRaw]);
  const dismissAssessForPalace = usePalaceStore((s) => s.dismissAssessForPalace);

  useEffect(() => {
    if (!aarRecordsLoaded && typeof loadAARRecords === "function") loadAARRecords();
  }, [aarRecordsLoaded, loadAARRecords]);

  const currentSignature = useMemo<PalaceSignature | null>(() => {
    if (!currentPalace) return null;
    const input = {
      nodes: (palaceNodes ?? []).map((n) => ({ id: n.id })),
      edges: (palaceEdges ?? []).map((e) => ({
        sourceNodeId: e.sourceNodeId,
        targetNodeId: e.targetNodeId,
      })),
    };
    const analysis = analyzeGraph(input);
    const motifs = detectMotifs(input);
    const groups = groupMotifs(motifs);
    const titleById = new Map<string, string>();
    for (const n of palaceNodes ?? []) titleById.set(n.id, n.title || "Untitled");
    const instances = extractMotifInstances(motifs, titleById);
    const sig = palaceSignature(currentPalace.id, currentPalace.name, analysis, groups);
    return { ...sig, motifInstances: instances };
  }, [currentPalace, palaceNodes, palaceEdges]);

  const palaceNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of palaces) map.set(p.id, p.name);
    return map;
  }, [palaces]);

  const top = useMemo(() => {
    if (!currentPalace || !currentSignature) return null;
    if (dismissedByPalaceId.includes(currentPalace.id)) return null;
    const scored = topMatchingAARs(currentSignature, aarRecords, {
      limit: 1,
      excludePalaceId: currentSignature.palaceId,
    });
    const best = scored[0];
    if (!best || best.score < ASSESS_THRESHOLD) return null;
    return best;
  }, [currentPalace, currentSignature, aarRecords, dismissedByPalaceId]);

  // We track palace snapshots separately so the hook is reactive but the
  // load happens only when palaces/aarRecords change, not on every render.
  const [otherSignaturesLoaded, setOtherSignaturesLoaded] = useState(false);
  void otherSignaturesLoaded;
  useEffect(() => {
    let cancelled = false;
    if (!currentPalace) {
      setOtherSignaturesLoaded(false);
      return;
    }
    void (async () => {
      const repo = getPalaceRepository();
      // We don't currently *use* the loaded snapshots in this hook because
      // the Assess banner only needs AAR signatures (already in
      // localStorage). The load remains here as a placeholder for future
      // cross-palace signal sources.
      await Promise.all(
        palaces
          .filter((p) => p.id !== currentPalace.id)
          .slice(0, 0) // intentionally 0 — keep the call shape, skip the work
          .map((p) => repo.loadPalace(p.id)),
      );
      if (!cancelled) setOtherSignaturesLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPalace, palaces]);

  if (!top || !currentPalace) return null;

  return {
    record: top.record,
    score: top.score,
    sourcePalaceName: palaceNameById.get(top.record.palaceId) ?? top.record.palaceName,
    dismiss: () => {
      if (typeof dismissAssessForPalace === "function") dismissAssessForPalace(currentPalace.id);
    },
    jump: () => onJump(top.record),
  };
}
