import { describe, expect, it } from "vitest";
import { GLYPH_FILL_BELOW_PX, glyphPlacement } from "./glyphOverlayGeometry";

describe("glyphPlacement", () => {
  it("puts a chip of a fixed size above the node's top edge while the label is readable", () => {
    const near = glyphPlacement({ x: 100, y: 200, w: 180, h: 100 });
    const nearer = glyphPlacement({ x: 100, y: 200, w: 360, h: 200 });
    expect(near).toMatchObject({ mode: "chip", x: 190, fontPx: 18 });
    expect(near.y).toBeLessThan(200);
    expect(nearer.fontPx).toBe(near.fontPx);
  });

  it("fills the node once it is too small on screen to read its label", () => {
    const far = glyphPlacement({ x: 10, y: 20, w: 36, h: 20 });
    expect(far).toEqual({ mode: "fill", x: 28, y: 30, fontPx: 16 });
    expect(glyphPlacement({ x: 0, y: 0, w: 180, h: GLYPH_FILL_BELOW_PX - 1 }).mode).toBe("fill");
  });

  it("never draws a filled glyph too small to tell apart", () => {
    expect(glyphPlacement({ x: 0, y: 0, w: 6, h: 3 }).fontPx).toBe(12);
  });
});
