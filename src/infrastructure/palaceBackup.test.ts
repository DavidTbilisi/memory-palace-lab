import { describe, expect, it, vi } from "vitest";
import type { PalaceSnapshot } from "../domain/entities/types";
import type { AARRecord } from "../domain/services/cast/aarRecords";
import { BACKUP_FORMAT_VERSION, backupFilename, buildPalaceBackup, importPalaceBackup } from "./palaceBackup";

function snapshot(id: string): PalaceSnapshot {
  return {
    palace: { id, name: `Palace ${id}`, createdAt: "2026-01-01T00:00:00.000Z" },
    nodes: [],
    edges: [],
    routes: [],
    loci: [],
  } as unknown as PalaceSnapshot;
}

const aar = (id: string): AARRecord => ({ id, palaceId: "a" } as unknown as AARRecord);

describe("palaceBackup", () => {
  it("builds a versioned backup with every loadable palace and the AAR records", async () => {
    const backup = await buildPalaceBackup({
      listPalaceIds: () => ["a", "b", "missing"],
      loadPalace: async (id) => (id === "missing" ? null : snapshot(id)),
      loadAARRecords: () => [aar("r1")],
      now: () => new Date("2026-09-03T12:00:00.000Z"),
    });
    expect(backup.version).toBe(BACKUP_FORMAT_VERSION);
    expect(backup.exportedAt).toBe("2026-09-03T12:00:00.000Z");
    expect(backup.palaces.map((entry) => entry.palace.id)).toEqual(["a", "b"]);
    expect(backup.aarRecords?.map((record) => record.id)).toEqual(["r1"]);
    expect(backupFilename(new Date("2026-09-03T12:00:00.000Z"))).toBe("memory-palace-backup-2026-09-03.json");
  });

  it("restores palaces and merges AAR records by id", async () => {
    const savePalace = vi.fn(async () => undefined);
    const saveAllAARRecords = vi.fn();
    const text = JSON.stringify({
      version: 2,
      exportedAt: "x",
      palaces: [snapshot("a")],
      aarRecords: [aar("r1"), aar("r2")],
    });
    const result = await importPalaceBackup(text, {
      savePalace,
      loadAARRecords: () => [aar("r1")],
      saveAllAARRecords,
    });
    expect(savePalace).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ palaces: 1, aarRecords: 1 });
    expect(saveAllAARRecords).toHaveBeenCalledWith([aar("r1"), aar("r2")]);
  });

  it("rejects files without a palaces array", async () => {
    await expect(importPalaceBackup("{}", { savePalace: vi.fn() })).rejects.toThrow(/Invalid backup file/);
  });
});
