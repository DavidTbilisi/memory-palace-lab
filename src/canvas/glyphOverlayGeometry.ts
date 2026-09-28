import type { NodeBox } from "./routeOverlayGeometry";

/** Below this on-screen height a node's label can no longer be read, so the glyph takes its place. */
export const GLYPH_FILL_BELOW_PX = 44;
const CHIP_FONT_PX = 18;
const CHIP_PAD_PX = 4;
const MIN_FILL_FONT_PX = 12;

export type GlyphPlacement = {
  /** "chip": a fixed-size mark above the node. "fill": the glyph fills the node, zoomed out. */
  mode: "chip" | "fill";
  /** Centre of the glyph, in viewport pixels. */
  x: number;
  y: number;
  fontPx: number;
};

/**
 * Where a node's concept glyph goes on screen. Zoomed in, it sits as a chip centred on the node's
 * top edge, the one corner-free place, at a size that does not change with zoom. Zoomed out, once
 * the label is unreadable, it grows to fill the node, because that is when it is needed.
 */
export function glyphPlacement(box: NodeBox): GlyphPlacement {
  if (box.h < GLYPH_FILL_BELOW_PX) {
    return {
      mode: "fill",
      x: box.x + box.w / 2,
      y: box.y + box.h / 2,
      fontPx: Math.max(MIN_FILL_FONT_PX, Math.min(box.w, box.h) * 0.8),
    };
  }
  return { mode: "chip", x: box.x + box.w / 2, y: box.y - (CHIP_FONT_PX / 2 + CHIP_PAD_PX), fontPx: CHIP_FONT_PX };
}
