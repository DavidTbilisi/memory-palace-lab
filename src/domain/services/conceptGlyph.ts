/**
 * Concept glyphs: one visible symbol that stands for one concept, so a node is recognized before
 * its label is read. Not a glyph size (a level of detail) and not an alphabet glyph (one piece of a
 * drawing grammar); the UI always says "concept glyph".
 */

const VARIATION_SELECTORS = /[\uFE0E\uFE0F]/g;

// Typed here because the project's TypeScript lib predates Intl.Segmenter; every runtime the app
// targets (current browsers, the desktop webview, Node 20+) has it.
type Segmenter = { segment: (text: string) => Iterable<{ segment: string }> };
type SegmenterConstructor = new (locale: string | undefined, options: { granularity: "grapheme" }) => Segmenter;

function graphemes(text: string): string[] {
  const Segmenter = (Intl as unknown as { Segmenter?: SegmenterConstructor }).Segmenter;
  if (Segmenter) {
    return [...new Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((part) => part.segment);
  }
  // Without Segmenter, a symbol and its variation selector still count as one.
  return [...text.replace(VARIATION_SELECTORS, "")];
}

export type GlyphCheck = { glyph: string } | { error: string };

/**
 * A glyph as the learner typed it, trimmed, when it is exactly one visible symbol. "👁️" is one
 * symbol even though it is two characters: an emoji and its variation selector.
 */
export function checkGlyph(input: string): GlyphCheck {
  const glyph = input.trim().normalize("NFC");
  if (!glyph) return { error: "A concept glyph is one symbol, such as 🔦." };
  if (graphemes(glyph).length !== 1) return { error: "A concept glyph is a single symbol, such as 🔦 or ⬟." };
  return { glyph };
}

/** What makes two glyphs the same: "👁" and "👁️" are one glyph, with or without the selector. */
export function glyphKey(glyph: string): string {
  return glyph.normalize("NFC").replace(VARIATION_SELECTORS, "");
}

export type GlyphHolder = { id: string; title: string; glyph?: string | null };

/** The node that already holds this glyph in the palace, other than `exceptId`. */
export function glyphHolder(nodes: readonly GlyphHolder[], glyph: string, exceptId?: string | null): GlyphHolder | null {
  const key = glyphKey(glyph);
  return nodes.find((node) => node.id !== exceptId && !!node.glyph && glyphKey(node.glyph) === key) ?? null;
}

/** The message a refused glyph shows: who holds it. */
export function glyphTakenMessage(glyph: string, holder: GlyphHolder): string {
  return `${glyph} is already ${holder.title.trim() || "another node"}'s concept glyph.`;
}

/** Normalise a stored glyph: a valid one symbol, or null. */
export function normalizeGlyph(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const check = checkGlyph(value);
  return "glyph" in check ? check.glyph : null;
}
