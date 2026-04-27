import type { AnalyticsEvent, Palace, PalaceSnapshot } from "../entities/types";

export interface PalaceRepository {
  listPalaces(): Promise<Palace[]>;
  listTrashedPalaces(): Promise<Palace[]>;
  createPalace(name: string, atlasPath?: string | null): Promise<Palace>;
  loadPalace(palaceId: string): Promise<PalaceSnapshot | null>;
  savePalace(snapshot: PalaceSnapshot): Promise<void>;
  softDeletePalace(palaceId: string): Promise<void>;
  restorePalace(palaceId: string): Promise<void>;
  purgePalace(palaceId: string): Promise<void>;
  listAnalyticsEvents(limit?: number): Promise<AnalyticsEvent[]>;
  appendAnalyticsEvents(events: AnalyticsEvent[]): Promise<void>;
  exportJson(snapshot: PalaceSnapshot): Promise<string>;
  importJson(json: string): Promise<PalaceSnapshot>;
}
