import type { PalaceSnapshot } from "../../domain/entities/types";

export type PalaceDraftRecord = {
  version: 1;
  palaceId: string;
  savedAt: string;
  snapshot: PalaceSnapshot;
};

const DRAFT_KEY_PREFIX = "memory-palace:draft:";

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function draftKey(palaceId: string) {
  return `${DRAFT_KEY_PREFIX}${palaceId}`;
}

export function savePalaceDraft(snapshot: PalaceSnapshot, savedAt = new Date().toISOString()) {
  const storage = getStorage();
  if (!storage) return null;
  const record: PalaceDraftRecord = {
    version: 1,
    palaceId: snapshot.palace.id,
    savedAt,
    snapshot,
  };
  storage.setItem(draftKey(snapshot.palace.id), JSON.stringify(record));
  return savedAt;
}

export function loadPalaceDraft(palaceId: string): PalaceDraftRecord | null {
  const storage = getStorage();
  if (!storage) return null;
  const raw = storage.getItem(draftKey(palaceId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PalaceDraftRecord>;
    if (parsed.version !== 1) return null;
    if (parsed.palaceId !== palaceId) return null;
    if (!parsed.snapshot?.palace?.id) return null;
    if (parsed.snapshot.palace.id !== palaceId) return null;
    if (typeof parsed.savedAt !== "string") return null;
    return parsed as PalaceDraftRecord;
  } catch {
    storage.removeItem(draftKey(palaceId));
    return null;
  }
}

export function clearPalaceDraft(palaceId: string) {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(draftKey(palaceId));
}
