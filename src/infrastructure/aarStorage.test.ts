import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  appendAARRecord,
  deleteAARRecord,
  loadAARRecords,
  saveAllAARRecords,
} from "./aarStorage";
import { buildAARRecord, type AARSignatureSnapshot } from "../domain/services/cast/aarRecords";

const SIG: AARSignatureSnapshot = {
  nodeCount: 0,
  edgeCount: 0,
  motifKindsPresent: [],
  motifCounts: { cascade: 0, diamond: 0, hubSpoke: 0, feedbackLoop: 0, bottleneck: 0, bipartite: 0 },
  features: [],
};

const FIELDS = { intent: "i", outcome: "o", gap: "g", adjustment: "a", takeaway: "t" };

describe("aarStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("round-trips records through localStorage", () => {
    const rec = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS });
    saveAllAARRecords([rec]);
    const loaded = loadAARRecords();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe(rec.id);
  });

  it("appendAARRecord adds without dropping existing", () => {
    const a = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS });
    const b = buildAARRecord({ palaceId: "p2", palaceName: "P2", signature: SIG, fields: FIELDS });
    appendAARRecord(a);
    const after = appendAARRecord(b);
    expect(after.map((r) => r.id).sort()).toEqual([a.id, b.id].sort());
  });

  it("deleteAARRecord removes by id", () => {
    const a = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS });
    const b = buildAARRecord({ palaceId: "p2", palaceName: "P2", signature: SIG, fields: FIELDS });
    saveAllAARRecords([a, b]);
    const after = deleteAARRecord(a.id);
    expect(after).toHaveLength(1);
    expect(after[0]?.id).toBe(b.id);
  });

  it("returns [] when storage is empty or malformed", () => {
    expect(loadAARRecords()).toEqual([]);
    window.localStorage.setItem("mp-aar-records", "{not json");
    expect(loadAARRecords()).toEqual([]);
    window.localStorage.setItem("mp-aar-records", "[1,2,3]");
    expect(loadAARRecords()).toEqual([]);
  });
});
