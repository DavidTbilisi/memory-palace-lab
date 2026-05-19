import { describe, expect, it } from "vitest";
import {
  buildAARBackupPayload,
  extractAARRecordsFromBackup,
} from "./aarBackup";
import { buildAARRecord, type AARSignatureSnapshot } from "../domain/services/cast/aarRecords";

const SIG: AARSignatureSnapshot = {
  nodeCount: 1,
  edgeCount: 0,
  motifKindsPresent: [],
  motifCounts: { cascade: 0, diamond: 0, hubSpoke: 0, feedbackLoop: 0, bottleneck: 0, bipartite: 0 },
  features: [],
};

const FIELDS = { intent: "i", outcome: "o", gap: "g", adjustment: "a", takeaway: "t" };

describe("aarBackup", () => {
  it("buildAARBackupPayload stamps version 2 and preserves order", () => {
    const a = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS });
    const b = buildAARRecord({ palaceId: "p2", palaceName: "P2", signature: SIG, fields: FIELDS });
    const payload = buildAARBackupPayload([a, b]);
    expect(payload.version).toBe(2);
    expect(payload.aarRecords.map((r) => r.id)).toEqual([a.id, b.id]);
  });

  it("extractAARRecordsFromBackup returns [] when field is absent (v1)", () => {
    expect(extractAARRecordsFromBackup({ version: 1, palaces: [] })).toEqual([]);
  });

  it("extractAARRecordsFromBackup returns [] when value is not an array", () => {
    expect(extractAARRecordsFromBackup({ version: 2, aarRecords: "not-an-array" })).toEqual([]);
    expect(extractAARRecordsFromBackup({ version: 2, aarRecords: null })).toEqual([]);
    expect(extractAARRecordsFromBackup(null)).toEqual([]);
    expect(extractAARRecordsFromBackup("string")).toEqual([]);
  });

  it("extractAARRecordsFromBackup skips entries missing id or palaceId", () => {
    const good = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS });
    const bad = { ...good, id: "" };
    const alsoBad = { ...good, palaceId: undefined };
    const out = extractAARRecordsFromBackup({
      version: 2,
      aarRecords: [good, bad, alsoBad],
    });
    expect(out).toHaveLength(1);
    expect(out[0]?.id).toBe(good.id);
  });

  it("extractAARRecordsFromBackup round-trips through JSON.parse(JSON.stringify(...))", () => {
    const rec = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS });
    const payload = buildAARBackupPayload([rec]);
    const round = JSON.parse(JSON.stringify(payload));
    const out = extractAARRecordsFromBackup(round);
    expect(out).toHaveLength(1);
    expect(out[0]?.id).toBe(rec.id);
    expect(out[0]?.takeaway).toBe(rec.takeaway);
  });
});
