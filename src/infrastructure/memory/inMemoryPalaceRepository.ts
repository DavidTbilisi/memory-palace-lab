import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { AnalyticsEvent, Palace, PalaceSnapshot } from "../../domain/entities/types";

const PALACES_STORAGE_KEY = "memory-palace:palace-snapshots";
const ANALYTICS_STORAGE_KEY = "memory-palace:analytics-events";
const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

function readStoredPalaceSnapshots() {
  if (typeof window === "undefined") return [] as PalaceSnapshot[];
  try {
    const raw = window.localStorage.getItem(PALACES_STORAGE_KEY);
    if (!raw) return [] as PalaceSnapshot[];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PalaceSnapshot[]) : [];
  } catch {
    return [] as PalaceSnapshot[];
  }
}

function readStoredAnalyticsEvents() {
  if (typeof window === "undefined") return [] as AnalyticsEvent[];
  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return [] as AnalyticsEvent[];
    const parsed = JSON.parse(raw) as AnalyticsEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as AnalyticsEvent[];
  }
}

function writeStoredAnalyticsEvents(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
}

function writeStoredPalaceSnapshots(snapshots: PalaceSnapshot[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PALACES_STORAGE_KEY, JSON.stringify(snapshots));
}

function cloneSnapshot(snapshot: PalaceSnapshot) {
  return JSON.parse(JSON.stringify(snapshot)) as PalaceSnapshot;
}

function purgeExpiredPalaces(palaces: Map<string, PalaceSnapshot>, now = Date.now()) {
  for (const [palaceId, snapshot] of palaces) {
    const purgeAt = snapshot.palace.purgeAt ? Date.parse(snapshot.palace.purgeAt) : Number.NaN;
    if (snapshot.palace.deletedAt && Number.isFinite(purgeAt) && purgeAt <= now) {
      palaces.delete(palaceId);
    }
  }
}

/** Browser-only fallback when Tauri APIs are unavailable (e.g. `vite` without `tauri dev`). */
export function createInMemoryPalaceRepository(): PalaceRepository {
  const palaces = new Map<string, PalaceSnapshot>(
    readStoredPalaceSnapshots().map((snapshot) => [snapshot.palace.id, cloneSnapshot(snapshot)]),
  );
  let analyticsEvents = readStoredAnalyticsEvents();

  const persistPalaces = () => {
    writeStoredPalaceSnapshots([...palaces.values()].map((snapshot) => cloneSnapshot(snapshot)));
  };

  const purgeAndPersistIfNeeded = () => {
    const before = palaces.size;
    purgeExpiredPalaces(palaces);
    if (palaces.size !== before) {
      persistPalaces();
    }
  };

  return {
    async listPalaces() {
      purgeAndPersistIfNeeded();
      return [...palaces.values()].map((s) => s.palace).filter((palace) => !palace.deletedAt);
    },
    async listTrashedPalaces() {
      purgeAndPersistIfNeeded();
      return [...palaces.values()].map((s) => s.palace).filter((palace) => !!palace.deletedAt);
    },
    async createPalace(name: string, atlasPath?: string | null) {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const palace: Palace = {
        id,
        name,
        createdAt,
        alias: null,
        atlasPath: atlasPath?.trim() || null,
        deletedAt: null,
        purgeAt: null,
      };
      const snap: PalaceSnapshot = {
        palace,
        canvasObjects: [],
        nodes: [],
        edges: [],
        routes: [],
        loci: [],
      };
      palaces.set(id, snap);
      persistPalaces();
      return palace;
    },
    async loadPalace(palaceId: string) {
      purgeAndPersistIfNeeded();
      const snapshot = palaces.get(palaceId) ?? null;
      if (!snapshot || snapshot.palace.deletedAt) return null;
      return cloneSnapshot(snapshot);
    },
    async savePalace(snapshot: PalaceSnapshot) {
      palaces.set(snapshot.palace.id, cloneSnapshot(snapshot));
      persistPalaces();
    },
    async softDeletePalace(palaceId: string) {
      purgeAndPersistIfNeeded();
      const snapshot = palaces.get(palaceId);
      if (!snapshot) return;
      const deletedAt = new Date().toISOString();
      snapshot.palace.deletedAt = deletedAt;
      snapshot.palace.purgeAt = new Date(Date.parse(deletedAt) + TRASH_RETENTION_MS).toISOString();
      persistPalaces();
    },
    async restorePalace(palaceId: string) {
      purgeAndPersistIfNeeded();
      const snapshot = palaces.get(palaceId);
      if (!snapshot) return;
      snapshot.palace.deletedAt = null;
      snapshot.palace.purgeAt = null;
      persistPalaces();
    },
    async purgePalace(palaceId: string) {
      palaces.delete(palaceId);
      persistPalaces();
    },
    async listAnalyticsEvents(limit) {
      const list = analyticsEvents
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return typeof limit === "number" ? list.slice(0, limit) : list;
    },
    async appendAnalyticsEvents(events) {
      analyticsEvents = [...analyticsEvents, ...(JSON.parse(JSON.stringify(events)) as AnalyticsEvent[])];
      writeStoredAnalyticsEvents(analyticsEvents);
    },
    async exportJson(snapshot: PalaceSnapshot) {
      return JSON.stringify({ version: 1, snapshot }, null, 2);
    },
    async importJson(json: string) {
      const o = JSON.parse(json) as { snapshot: PalaceSnapshot };
      return o.snapshot;
    },
  };
}
