import { useMemo } from "react";
import { usePalaceStore } from "../store/palaceStore";
import {
  computePalaceDifficulty,
  type PalaceDifficulty,
} from "../domain/services/palaceDifficulty";
import { nodeEncodeSpeeds } from "../domain/services/encodeSpeed";

/**
 * Reactive learner-relative difficulty for the current palace. Recomputes when
 * the graph (nodes/edges) or the spaced-repetition state (loci) changes, so the
 * for-you numbers shrink as the learner reviews. Shared by the Difficulty panel
 * and the on-canvas badges so both show the same units.
 */
export function usePalaceDifficulty(): PalaceDifficulty {
  const nodes = usePalaceStore((s) => s.nodes);
  const edges = usePalaceStore((s) => s.edges);
  const loci = usePalaceStore((s) => s.loci);
  const analyticsEvents = usePalaceStore((s) => s.analyticsEvents);
  const encodeSpeeds = useMemo(
    () => nodeEncodeSpeeds(analyticsEvents, new Date().toISOString()),
    [analyticsEvents],
  );
  return useMemo(
    () => computePalaceDifficulty(nodes, edges, loci, { encodeSpeeds }),
    [nodes, edges, loci, encodeSpeeds],
  );
}
