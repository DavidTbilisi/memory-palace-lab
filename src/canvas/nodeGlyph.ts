import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import { checkGlyph, glyphHolder, glyphTakenMessage, type GlyphHolder } from "../domain/services/conceptGlyph";
import type { MemoryPalaceMeta } from "./memoryMeta";
import { isMemoryNodeShape } from "./memoryNodeShape";

/** Every node on the canvas with its concept glyph, read live so a glyph set a moment ago counts. */
export function canvasGlyphHolders(editor: Editor): GlyphHolder[] {
  const holders: GlyphHolder[] = [];
  for (const shape of editor.getCurrentPageShapes()) {
    if (!isMemoryNodeShape(shape)) continue;
    const meta = shape.meta as MemoryPalaceMeta;
    holders.push({ id: meta.mpNodeId!, title: meta.mpTitle ?? "", glyph: meta.mpGlyph ?? null });
  }
  return holders;
}

/**
 * Give a node its concept glyph, or clear it with null. Refused, with the reason, when the input
 * is not one symbol or another node in the palace already holds it.
 */
export function writeNodeGlyph(editor: Editor, nodeId: string, input: string | null): { ok: true } | { ok: false; message: string } {
  let glyph: string | null = null;
  if (input !== null) {
    const check = checkGlyph(input);
    if ("error" in check) return { ok: false, message: check.error };
    const holder = glyphHolder(canvasGlyphHolders(editor), check.glyph, nodeId);
    if (holder) return { ok: false, message: glyphTakenMessage(check.glyph, holder) };
    glyph = check.glyph;
  }
  for (const shape of editor.getCurrentPageShapes()) {
    if (!isMemoryNodeShape(shape)) continue;
    const meta = shape.meta as MemoryPalaceMeta;
    if (meta.mpNodeId !== nodeId) continue;
    // tldraw merges meta key by key, so only null clears the glyph.
    editor.updateShape({ id: shape.id as TLShapeId, type: shape.type, meta: { ...meta, mpGlyph: glyph } });
    return { ok: true };
  }
  return { ok: false, message: "That node is not on the canvas." };
}
