/**
 * localStorage-backed persistence for AAR records.
 *
 * Records are stored under a single key as a JSON array. The schema is
 * forward-compatible: unknown fields on records are preserved on round
 * trip, missing fields produce sane defaults in `parseRecord`.
 */

import type { AARRecord } from "../domain/services/cast/aarRecords";

const STORAGE_KEY = "mp-aar-records";

function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function parseRecord(raw: unknown): AARRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.palaceId !== "string") return null;
  return {
    id: r.id,
    palaceId: r.palaceId,
    palaceName: typeof r.palaceName === "string" ? r.palaceName : "",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date(0).toISOString(),
    signature: (r.signature as AARRecord["signature"]) ?? {
      nodeCount: 0,
      edgeCount: 0,
      motifKindsPresent: [],
      motifCounts: { cascade: 0, diamond: 0, hubSpoke: 0, feedbackLoop: 0, bottleneck: 0, bipartite: 0 },
      features: [],
    },
    intent: typeof r.intent === "string" ? r.intent : "",
    outcome: typeof r.outcome === "string" ? r.outcome : "",
    gap: typeof r.gap === "string" ? r.gap : "",
    adjustment: typeof r.adjustment === "string" ? r.adjustment : "",
    takeaway: typeof r.takeaway === "string" ? r.takeaway : "",
  };
}

export function loadAARRecords(): AARRecord[] {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseRecord).filter((r): r is AARRecord => r !== null);
  } catch {
    return [];
  }
}

export function saveAllAARRecords(records: readonly AARRecord[]): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Silently swallow quota errors — the user will see the missing record
    // in the UI and re-saving in another session is harmless.
  }
}

export function appendAARRecord(record: AARRecord): AARRecord[] {
  const current = loadAARRecords();
  const next = [...current, record];
  saveAllAARRecords(next);
  return next;
}

export function deleteAARRecord(id: string): AARRecord[] {
  const next = loadAARRecords().filter((r) => r.id !== id);
  saveAllAARRecords(next);
  return next;
}
