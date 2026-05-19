/**
 * Backup serialization helpers for AAR records. Pure JSON shape; no IO.
 *
 * The backup format is forward-compatible:
 * - v1 backups (palaces only) import as zero AARs.
 * - v2 backups carry an `aarRecords` array alongside palaces.
 * - Malformed entries are silently dropped so a partially-corrupt backup
 *   doesn't reject the whole import.
 */

import type { AARRecord } from "../domain/services/cast/aarRecords";

export type AARBackupPayload = {
  version: 2;
  aarRecords: AARRecord[];
};

export function buildAARBackupPayload(records: readonly AARRecord[]): AARBackupPayload {
  return { version: 2, aarRecords: [...records] };
}

/**
 * Tolerant extractor: accepts the parsed JSON of any backup file and
 * returns whatever AAR records it can. Returns `[]` for v1 backups or any
 * malformed input.
 */
export function extractAARRecordsFromBackup(parsed: unknown): AARRecord[] {
  if (!parsed || typeof parsed !== "object") return [];
  const maybeArray = (parsed as { aarRecords?: unknown }).aarRecords;
  if (!Array.isArray(maybeArray)) return [];

  const out: AARRecord[] = [];
  for (const entry of maybeArray) {
    if (!entry || typeof entry !== "object") continue;
    const r = entry as Record<string, unknown>;
    if (typeof r.id !== "string" || r.id.length === 0) continue;
    if (typeof r.palaceId !== "string" || r.palaceId.length === 0) continue;
    out.push(entry as AARRecord);
  }
  return out;
}
