import { glyphPlacement } from "./glyphOverlayGeometry";
import type { NodeBox } from "./routeOverlayGeometry";

/**
 * Every node's concept glyph, drawn over the canvas at a size that stays legible when zoomed out.
 * A node a recall walk keeps hidden shows none, since the glyph would give the concept away.
 */
export function ConceptGlyphOverlay({
  boxes,
  glyphs,
  hidden,
}: {
  boxes: ReadonlyMap<string, NodeBox>;
  glyphs: ReadonlyMap<string, string>;
  hidden: ReadonlySet<string>;
}) {
  if (glyphs.size === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {[...glyphs].map(([nodeId, glyph]) => {
        const box = boxes.get(nodeId);
        if (!box || hidden.has(nodeId)) return null;
        const place = glyphPlacement(box);
        return (
          <span
            key={nodeId}
            data-testid="canvas-glyph"
            data-node-id={nodeId}
            data-mode={place.mode}
            className={
              place.mode === "chip"
                ? "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/90 px-1 leading-none shadow"
                : "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center leading-none"
            }
            style={{ left: place.x, top: place.y, fontSize: place.fontPx, minWidth: place.mode === "chip" ? place.fontPx + 8 : undefined, height: place.mode === "chip" ? place.fontPx + 8 : undefined }}
          >
            {glyph}
          </span>
        );
      })}
    </div>
  );
}
