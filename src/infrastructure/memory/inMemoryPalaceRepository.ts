import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { Palace, PalaceSnapshot } from "../../domain/entities/types";

/** Browser-only fallback when Tauri APIs are unavailable (e.g. `vite` without `tauri dev`). */
export function createInMemoryPalaceRepository(): PalaceRepository {
  const palaces = new Map<string, PalaceSnapshot>();

  return {
    async listPalaces() {
      return [...palaces.values()].map((s) => s.palace);
    },
    async createPalace(name: string) {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const palace: Palace = { id, name, createdAt };
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
    async exportJson(snapshot: PalaceSnapshot) {
      return JSON.stringify({ version: 1, snapshot }, null, 2);
    },
    async importJson(json: string) {
      const o = JSON.parse(json) as { snapshot: PalaceSnapshot };
      return o.snapshot;
    },
  };
}
