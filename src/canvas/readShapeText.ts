import type { MemoryPalaceMeta } from "./memoryMeta";

export function plainTextFromRichText(value: unknown): string {
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const text = (node as { text?: unknown }).text;
    if (typeof text === "string") out.push(text);
    const content = (node as { content?: unknown }).content;
    if (Array.isArray(content)) {
      for (const child of content) walk(child);
    }
  };
  walk(value);
  return out.join("").trim();
}

/** Geo nodes show their title as the shape label; image nodes have no label, so `mpTitle` is all there is. */
export function resolveMemoryNodeTitle(shape: { meta?: unknown; props?: object }) {
  const canvasTitle = plainTextFromRichText((shape.props as { richText?: unknown } | undefined)?.richText);
  if (canvasTitle) return canvasTitle;
  const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
  return meta.mpTitle?.trim() || "Untitled";
}
