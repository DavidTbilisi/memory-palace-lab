import type { Palace, PalaceSnapshot } from "../entities/types";

/** Domain helpers — persistence is delegated to repositories / Tauri. */

export function renamePalace(snapshot: PalaceSnapshot, name: string): PalaceSnapshot {
  return {
    ...snapshot,
    palace: { ...snapshot.palace, name },
  };
}

export function ensurePalace(snapshot: PalaceSnapshot | null, fallback: Palace): PalaceSnapshot {
  if (snapshot) return snapshot;
  return {
    palace: fallback,
    canvasObjects: [],
    nodes: [],
    edges: [],
    routes: [],
    loci: [],
  };
}
