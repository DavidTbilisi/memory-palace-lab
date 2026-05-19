import { describe, it, expect } from "vitest";
import {
  CAST_AXES,
  CAST_BIT_PAIRS,
  CAST_HOW,
  CAST_LEXICON,
  CAST_WHAT,
  CAST_WHEN,
  CAST_WHO,
  castBitsFor,
  castRow,
} from "./castLexicon";

describe("castLexicon", () => {
  it("has exactly four rows per axis in 00/01/10/11 order", () => {
    for (const axis of CAST_AXES) {
      expect(axis.rows).toHaveLength(4);
      expect(axis.rows.map((r) => r.bits)).toEqual([...CAST_BIT_PAIRS]);
    }
  });

  it("preserves the legacy CAST_WHO/HOW/WHAT/WHEN labels", () => {
    // These values are stored in palace data; renaming requires migration.
    expect([...CAST_WHO]).toEqual(["Giant", "Mermaid", "Mage", "Dragon"]);
    expect([...CAST_HOW]).toEqual(["Crushing", "Flowing", "Spreading", "Exploding"]);
    expect([...CAST_WHAT]).toEqual(["Rock", "Water", "Cloud", "Lightning"]);
    expect([...CAST_WHEN]).toEqual(["Red cave", "Blue ocean", "Green sky", "Purple storm"]);
  });

  it("fills every gloss / profile / useWhen / bilingual field with non-empty text", () => {
    for (const axis of CAST_AXES) {
      for (const row of axis.rows) {
        expect(row.english).toMatch(/\S/);
        expect(row.gloss).toMatch(/\S/);
        expect(row.profile).toMatch(/\S/);
        expect(row.useWhen).toMatch(/\S/);
        expect(row.georgian).toMatch(/\S/);
        expect(row.russian).toMatch(/\S/);
        expect(row.simpleEnglish).toMatch(/\S/);
      }
    }
  });

  it("looks up rows by axis + english label", () => {
    expect(castRow("who", "Giant")?.bits).toBe("00");
    expect(castRow("how", "Exploding")?.bits).toBe("11");
    expect(castRow("what", "Cloud")?.gloss).toBe("signals or information");
    expect(castRow("when", "Green sky")?.useWhen).toMatch(/condition/i);
    expect(castRow("who", "NotAReal")).toBeNull();
  });

  it("castBitsFor returns null for unknown labels", () => {
    expect(castBitsFor("who", "Giant")).toBe("00");
    expect(castBitsFor("how", "nope")).toBeNull();
  });

  it("CAST_LEXICON exposes the four named axes", () => {
    expect(Object.keys(CAST_LEXICON).sort()).toEqual(["how", "what", "when", "who"]);
    expect(CAST_LEXICON.who.slot).toBe("C");
    expect(CAST_LEXICON.how.slot).toBe("A");
    expect(CAST_LEXICON.what.slot).toBe("S");
    expect(CAST_LEXICON.when.slot).toBe("T");
  });
});
