import { describe, it, expect } from "vitest";
import {
  buildAARRecord,
  isAARFieldsFilled,
  recordsForPalace,
  topMatchingAARs,
  type AARFields,
  type AARSignatureSnapshot,
} from "./aarRecords";
import type { PalaceSignature } from "./palaceSimilarity";
import type { MotifKind } from "./castMotifs";

const SIG: AARSignatureSnapshot = {
  nodeCount: 5,
  edgeCount: 4,
  motifKindsPresent: ["cascade"],
  motifCounts: { cascade: 1, diamond: 0, hubSpoke: 0, feedbackLoop: 0, bottleneck: 0, bipartite: 0 },
  features: [0.8, 0, 0, 0.5, 0, 1, 0, 0, 0, 0, 0],
};

const FIELDS = (overrides: Partial<AARFields> = {}): AARFields => ({
  intent: "Solve auth pipeline shape",
  outcome: "Resolved with hub-spoke approach",
  gap: "Initial cascade was the wrong fit",
  adjustment: "Check hub-spoke template first when central dispatcher appears",
  takeaway: "Auth → hub-spoke not cascade",
  ...overrides,
});

describe("aarRecords", () => {
  it("buildAARRecord trims fields and stamps id + createdAt", () => {
    const rec = buildAARRecord({
      palaceId: "p1",
      palaceName: "P1",
      signature: SIG,
      fields: FIELDS({ takeaway: "  trimmed  " }),
    });
    expect(rec.id).toMatch(/\S/);
    expect(rec.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T/);
    expect(rec.takeaway).toBe("trimmed");
  });

  it("recordsForPalace returns only matching palace records, newest first", () => {
    const a = buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS() });
    // Force distinct timestamps
    const b = {
      ...buildAARRecord({ palaceId: "p1", palaceName: "P1", signature: SIG, fields: FIELDS() }),
      createdAt: "2099-01-01T00:00:00Z",
    };
    const c = buildAARRecord({ palaceId: "p2", palaceName: "P2", signature: SIG, fields: FIELDS() });
    const out = recordsForPalace([a, b, c], "p1");
    expect(out).toHaveLength(2);
    expect(out[0]?.id).toBe(b.id);
    expect(out[1]?.id).toBe(a.id);
  });

  it("isAARFieldsFilled requires at least one non-empty field", () => {
    expect(isAARFieldsFilled({ intent: "", outcome: "", gap: "", adjustment: "", takeaway: "" })).toBe(
      false,
    );
    expect(
      isAARFieldsFilled({ intent: "   ", outcome: "", gap: "", adjustment: "", takeaway: "" }),
    ).toBe(false);
    expect(
      isAARFieldsFilled({ intent: "", outcome: "", gap: "", adjustment: "", takeaway: "x" }),
    ).toBe(true);
  });

  const makeCurrent = (kinds: MotifKind[], features: number[]): PalaceSignature => ({
    palaceId: "current",
    palaceName: "Current",
    nodeCount: 5,
    edgeCount: 4,
    features,
    motifKindsPresent: new Set(kinds),
  });

  const makeAAR = (palaceId: string, kinds: MotifKind[], features: number[]) =>
    buildAARRecord({
      palaceId,
      palaceName: palaceId,
      signature: {
        ...SIG,
        motifKindsPresent: kinds,
        features,
      },
      fields: FIELDS(),
    });

  it("topMatchingAARs ranks identical-shape AARs highest", () => {
    const current = makeCurrent(["hubSpoke", "cascade"], [1, 0.5, 0.3, 0, 0, 1, 0, 1, 0, 0, 0]);
    const twin = makeAAR("p1", ["hubSpoke", "cascade"], [1, 0.5, 0.3, 0, 0, 1, 0, 1, 0, 0, 0]);
    const different = makeAAR("p2", ["feedbackLoop"], [0.1, 0, 0.05, 0, 0.5, 0, 0, 0, 1, 0, 0]);
    const result = topMatchingAARs(current, [twin, different]);
    expect(result[0]?.record.palaceId).toBe("p1");
    expect(result[0]!.score).toBeGreaterThan(result[1]!.score);
  });

  it("topMatchingAARs filters out current palace when excludePalaceId is set", () => {
    const current = makeCurrent(["hubSpoke"], [1, 0.5, 0.3, 0, 0, 0, 0, 1, 0, 0, 0]);
    const selfAAR = makeAAR("current", ["hubSpoke"], [1, 0.5, 0.3, 0, 0, 0, 0, 1, 0, 0, 0]);
    const otherAAR = makeAAR("other", ["hubSpoke"], [1, 0.5, 0.3, 0, 0, 0, 0, 1, 0, 0, 0]);
    const result = topMatchingAARs(current, [selfAAR, otherAAR], { excludePalaceId: "current" });
    expect(result.map((r) => r.record.palaceId)).toEqual(["other"]);
  });

  it("topMatchingAARs respects the limit option", () => {
    const current = makeCurrent(["cascade"], [1, 0.5, 0.3, 0, 0, 1, 0, 0, 0, 0, 0]);
    const records = ["a", "b", "c", "d", "e"].map((id) =>
      makeAAR(id, ["cascade"], [1, 0.5, 0.3, 0, 0, 1, 0, 0, 0, 0, 0]),
    );
    expect(topMatchingAARs(current, records, { limit: 2 })).toHaveLength(2);
  });

  it("topMatchingAARs returns [] when nothing scores above zero", () => {
    const current = makeCurrent([], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const records = [makeAAR("a", [], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])];
    expect(topMatchingAARs(current, records)).toEqual([]);
  });
});
