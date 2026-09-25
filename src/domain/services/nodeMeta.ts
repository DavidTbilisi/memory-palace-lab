import type { MemoryNode, NedfEncoding, PalacePortalRef } from "../entities/types";
import { normalizeNedf } from "./nedf";

/** Node fields stored together in the `nodes.node_meta_json` column. */
export type NodeMetaFields = { portal: PalacePortalRef | null; imageUrl: string | null; nedf?: NedfEncoding };

/** JSON for `nodes.node_meta_json`. `portal` and `imageUrl` are always written; `nedf` only when set. */
export function encodeNodeMeta(node: Pick<MemoryNode, "portal" | "imageUrl" | "nedf">): string {
  const nedf = normalizeNedf(node.nedf);
  return JSON.stringify({ portal: node.portal ?? null, imageUrl: node.imageUrl ?? null, ...(nedf ? { nedf } : {}) });
}

/**
 * Tolerant reader. The oldest rows hold a bare portal object instead of `{ portal, imageUrl }`;
 * malformed JSON reads as a plain node.
 */
export function decodeNodeMeta(json: string | null | undefined): NodeMetaFields {
  const empty: NodeMetaFields = { portal: null, imageUrl: null };
  if (!json) return empty;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return empty;
  }
  if (!parsed || typeof parsed !== "object") return empty;
  const raw = parsed as Record<string, unknown>;
  if (!("portal" in raw)) return { portal: raw as unknown as PalacePortalRef, imageUrl: null };
  const nedf = normalizeNedf(raw.nedf);
  return {
    portal: (raw.portal ?? null) as PalacePortalRef | null,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : null,
    ...(nedf ? { nedf } : {}),
  };
}
