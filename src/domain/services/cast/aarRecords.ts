/**
 * After-Action Review records — the Close phase of ARC.
 *
 * Per `Neural-OS-Research/wiki/arc-framework.md` §C, the Close phase asks
 * four questions: intent, outcome, gap, and adjustment. This module models
 * an AAR record so the lab can persist them and let future Assess phases
 * recognize "I've seen this topology before."
 *
 * The signature snapshot captures the graph shape at close time so we can
 * match new problems against solved ones structurally, even after the
 * source palace has been edited away.
 *
 * Pure — no React, no storage, no editor.
 */

import type { MotifKind } from "./castMotifs";
import { similarityScore, type PalaceSignature } from "./palaceSimilarity";
import { motifInstanceOverlap, type MotifInstances } from "./motifInstances";

export { motifInstanceOverlap };

/** Compact frozen-in-time copy of `PalaceSignature`. */
export type AARSignatureSnapshot = {
  nodeCount: number;
  edgeCount: number;
  motifKindsPresent: MotifKind[];
  motifCounts: Record<MotifKind, number>;
  /** Numeric features in `palaceSignature.ts` order. */
  features: number[];
  /**
   * Optional. Per-kind motif anchors keyed by node *titles* — lets
   * cross-palace matching say "both palaces share a hub-spoke around CAP"
   * rather than just "both have a hub-spoke". Legacy records lack this.
   */
  motifInstances?: MotifInstances;
};

export type AARRecord = {
  id: string;
  palaceId: string;
  palaceName: string;
  createdAt: string;
  signature: AARSignatureSnapshot;
  /** ARC's four AAR questions, in order. */
  intent: string;
  outcome: string;
  gap: string;
  adjustment: string;
  /** Optional one-line takeaway summarizing the loop. */
  takeaway: string;
};

export type AARFields = Pick<AARRecord, "intent" | "outcome" | "gap" | "adjustment" | "takeaway">;

const isoNow = () => new Date().toISOString();
const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `aar_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Build a fresh AAR record. Pure — caller provides the palace identity and
 * signature snapshot; this function only normalizes the payload and stamps
 * id + createdAt.
 */
export function buildAARRecord(args: {
  palaceId: string;
  palaceName: string;
  signature: AARSignatureSnapshot;
  fields: AARFields;
}): AARRecord {
  const { palaceId, palaceName, signature, fields } = args;
  return {
    id: randomId(),
    palaceId,
    palaceName,
    createdAt: isoNow(),
    signature,
    intent: fields.intent.trim(),
    outcome: fields.outcome.trim(),
    gap: fields.gap.trim(),
    adjustment: fields.adjustment.trim(),
    takeaway: fields.takeaway.trim(),
  };
}

/** Records belonging to a specific palace, newest first. */
export function recordsForPalace(records: readonly AARRecord[], palaceId: string): AARRecord[] {
  return [...records]
    .filter((r) => r.palaceId === palaceId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/** Returns true when at least one of the four question fields is non-empty. */
export function isAARFieldsFilled(fields: AARFields): boolean {
  return (
    fields.intent.trim().length > 0 ||
    fields.outcome.trim().length > 0 ||
    fields.gap.trim().length > 0 ||
    fields.adjustment.trim().length > 0 ||
    fields.takeaway.trim().length > 0
  );
}

/**
 * Adapter: treat a frozen AAR signature snapshot as a `PalaceSignature` so
 * the existing `similarityScore` can compare it to the current palace's
 * live shape.
 */
function aarToPseudoSignature(record: AARRecord): PalaceSignature {
  return {
    palaceId: record.palaceId,
    palaceName: record.palaceName,
    nodeCount: record.signature.nodeCount,
    edgeCount: record.signature.edgeCount,
    features: record.signature.features,
    motifKindsPresent: new Set(record.signature.motifKindsPresent),
    motifInstances: record.signature.motifInstances,
  };
}


/**
 * Top-N AAR records whose frozen graph shape most resembles the current
 * palace. Filters out zero-score matches and (when `excludePalaceId` is
 * provided) records belonging to that palace — the "Past AARs · this
 * palace" tile already shows those.
 */
export function topMatchingAARs(
  currentSignature: PalaceSignature,
  records: readonly AARRecord[],
  options: { limit?: number; excludePalaceId?: string } = {},
): { record: AARRecord; score: number }[] {
  const limit = options.limit ?? 3;
  const scored = records
    .filter((r) => !options.excludePalaceId || r.palaceId !== options.excludePalaceId)
    .map((r) => ({ record: r, score: similarityScore(currentSignature, aarToPseudoSignature(r)) }))
    .filter((entry) => entry.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
