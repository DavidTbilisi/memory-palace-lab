import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { AnalyticsEvent, Palace, PalaceSnapshot } from "../../domain/entities/types";

const ANALYTICS_STORAGE_KEY = "memory-palace:analytics-events";
const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

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
  const palaces = new Map<string, PalaceSnapshot>();
  let analyticsEvents = readStoredAnalyticsEvents();

  return {
    async listPalaces() {
      purgeExpiredPalaces(palaces);
      return [...palaces.values()].map((s) => s.palace).filter((palace) => !palace.deletedAt);
    },
    async listTrashedPalaces() {
      purgeExpiredPalaces(palaces);
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
      return palace;
    },
    async loadPalace(palaceId: string) {
      purgeExpiredPalaces(palaces);
      const snapshot = palaces.get(palaceId) ?? null;
      if (!snapshot || snapshot.palace.deletedAt) return null;
      return cloneSnapshot(snapshot);
    },
    async savePalace(snapshot: PalaceSnapshot) {
      palaces.set(snapshot.palace.id, cloneSnapshot(snapshot));
    },
    async softDeletePalace(palaceId: string) {
      purgeExpiredPalaces(palaces);
      const snapshot = palaces.get(palaceId);
      if (!snapshot) return;
      const deletedAt = new Date().toISOString();
      snapshot.palace.deletedAt = deletedAt;
      snapshot.palace.purgeAt = new Date(Date.parse(deletedAt) + TRASH_RETENTION_MS).toISOString();
    },
    async restorePalace(palaceId: string) {
      purgeExpiredPalaces(palaces);
      const snapshot = palaces.get(palaceId);
      if (!snapshot) return;
      snapshot.palace.deletedAt = null;
      snapshot.palace.purgeAt = null;
    },
    async purgePalace(palaceId: string) {
      palaces.delete(palaceId);
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
