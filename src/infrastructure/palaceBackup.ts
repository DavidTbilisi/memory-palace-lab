import type { PalaceSnapshot } from "../domain/entities/types";
import type { AARRecord } from "../domain/services/cast/aarRecords";
import { buildAARBackupPayload, extractAARRecordsFromBackup } from "./aarBackup";
import { loadAARRecords, saveAllAARRecords } from "./aarStorage";
import { getPalaceRepository } from "./palaceRepositoryProvider";

/** Whole-app backup: every palace snapshot plus after-action-review records. */
export type BackupFile = {
  version: number;
  exportedAt: string;
  palaces: PalaceSnapshot[];
  aarRecords?: AARRecord[];
};

export const BACKUP_FORMAT_VERSION = 2;

type BackupDeps = {
  listPalaceIds: () => Promise<string[]> | string[];
  loadPalace: (id: string) => Promise<PalaceSnapshot | null>;
  savePalace: (snapshot: PalaceSnapshot) => Promise<unknown>;
  loadAARRecords: () => AARRecord[];
  saveAllAARRecords: (records: AARRecord[]) => void;
  now: () => Date;
};

function defaultDeps(): BackupDeps {
  const repo = getPalaceRepository();
  return {
    listPalaceIds: async () => (await repo.listPalaces()).map((palace) => palace.id),
    loadPalace: (id) => repo.loadPalace(id),
    savePalace: (snapshot) => repo.savePalace(snapshot),
    loadAARRecords,
    saveAllAARRecords,
    now: () => new Date(),
  };
}

export async function buildPalaceBackup(deps: Partial<BackupDeps> = {}): Promise<BackupFile> {
  const d = { ...defaultDeps(), ...deps };
  const ids = await d.listPalaceIds();
  const snapshots = await Promise.all(ids.map((id) => d.loadPalace(id)));
  const palaces = snapshots.filter((snapshot): snapshot is PalaceSnapshot => snapshot !== null);
  const aarPayload = buildAARBackupPayload(d.loadAARRecords());
  return {
    version: BACKUP_FORMAT_VERSION,
    exportedAt: d.now().toISOString(),
    palaces,
    aarRecords: aarPayload.aarRecords,
  };
}

export function backupFilename(date = new Date()): string {
  return `memory-palace-backup-${date.toISOString().slice(0, 10)}.json`;
}

/** Trigger a browser download of the backup JSON. */
export function downloadBackup(backup: BackupFile, filename = backupFilename()) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportPalaceBackup(): Promise<BackupFile> {
  const backup = await buildPalaceBackup();
  downloadBackup(backup);
  return backup;
}

export type ImportResult = { palaces: number; aarRecords: number };

/**
 * Restore palaces from backup JSON. Palaces are upserted by id; AAR records
 * are merged by id so an older backup never deletes newer reviews.
 */
export async function importPalaceBackup(text: string, deps: Partial<BackupDeps> = {}): Promise<ImportResult> {
  const d = { ...defaultDeps(), ...deps };
  const parsed = JSON.parse(text) as Partial<BackupFile>;
  if (!parsed || !Array.isArray(parsed.palaces)) throw new Error("Invalid backup file");
  for (const snapshot of parsed.palaces) {
    await d.savePalace(snapshot);
  }
  const imported = extractAARRecordsFromBackup(parsed as BackupFile);
  let addedAAR = 0;
  if (imported.length > 0) {
    const existing = d.loadAARRecords();
    const seen = new Set(existing.map((record) => record.id));
    const fresh = imported.filter((record) => !seen.has(record.id));
    addedAAR = fresh.length;
    if (fresh.length > 0) d.saveAllAARRecords([...existing, ...fresh]);
  }
  return { palaces: parsed.palaces.length, aarRecords: addedAAR };
}
