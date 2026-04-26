import type { Palace, PalaceSnapshot } from "../entities/types";

export interface PalaceRepository {
  listPalaces(): Promise<Palace[]>;
  createPalace(name: string, atlasPath?: string | null): Promise<Palace>;
  loadPalace(palaceId: string): Promise<PalaceSnapshot | null>;
  savePalace(snapshot: PalaceSnapshot): Promise<void>;
  exportJson(snapshot: PalaceSnapshot): Promise<string>;
  importJson(json: string): Promise<PalaceSnapshot>;
}
