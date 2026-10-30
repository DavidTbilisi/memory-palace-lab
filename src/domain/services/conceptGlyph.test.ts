import { describe, expect, it } from "vitest";
import { checkGlyph, glyphHolder, glyphKey, glyphTakenMessage, normalizeGlyph } from "./conceptGlyph";

describe("concept glyphs", () => {
  it("takes exactly one visible symbol, however many characters it is made of", () => {
    for (const glyph of ["🔦", "👁️", "👁", "⬟", "🇬🇪", "👩‍🔬", "Ω", "A"]) {
      expect(checkGlyph(` ${glyph} `)).toEqual({ glyph });
    }
  });

  it("refuses nothing, and more than one symbol", () => {
    expect(checkGlyph("  ")).toEqual({ error: expect.stringContaining("one symbol") });
    for (const input of ["ab", "🔦🔦", "Na", "🔦 x"]) {
      expect(checkGlyph(input)).toEqual({ error: expect.stringContaining("single symbol") });
    }
  });

  it("treats a symbol with and without its variation selector as the same glyph", () => {
    expect(glyphKey("👁️")).toBe(glyphKey("👁"));
    expect(glyphKey("❄️")).toBe(glyphKey("❄"));
    expect(glyphKey("🔦")).not.toBe(glyphKey("👁"));
  });

  it("finds the node already holding a glyph, but not the node being edited", () => {
    const nodes = [
      { id: "a", title: "Attention", glyph: "👁️" },
      { id: "b", title: "Focus", glyph: null },
    ];
    expect(glyphHolder(nodes, "👁")).toEqual(nodes[0]);
    expect(glyphHolder(nodes, "👁", "a")).toBeNull();
    expect(glyphHolder(nodes, "🔦")).toBeNull();
    expect(glyphTakenMessage("👁", nodes[0]!)).toBe("👁 is already Attention's concept glyph.");
  });

  it("normalizes stored values, dropping anything that is not one symbol", () => {
    expect(normalizeGlyph("🔦")).toBe("🔦");
    expect(normalizeGlyph("ab")).toBeNull();
    expect(normalizeGlyph(3)).toBeNull();
    expect(normalizeGlyph(undefined)).toBeNull();
  });
});
