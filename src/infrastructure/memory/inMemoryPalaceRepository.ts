import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { AnalyticsEvent, Palace, PalaceSnapshot } from "../../domain/entities/types";

const ANALYTICS_STORAGE_KEY = "memory-palace:analytics-events";

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

/** Browser-only fallback when Tauri APIs are unavailable (e.g. `vite` without `tauri dev`). */
export function createInMemoryPalaceRepository(): PalaceRepository {
  const palaces = new Map<string, PalaceSnapshot>();
  let analyticsEvents = readStoredAnalyticsEvents();

  return {
    async listPalaces() {
      return [...palaces.values()].map((s) => s.palace);
    },
    async createPalace(name: string, atlasPath?: string | null) {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const palace: Palace = { id, name, createdAt, atlasPath: atlasPath?.trim() || null };
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
      return palaces.get(palaceId) ?? null;
    },
    async savePalace(snapshot: PalaceSnapshot) {
      palaces.set(snapshot.palace.id, JSON.parse(JSON.stringify(snapshot)) as PalaceSnapshot);
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
