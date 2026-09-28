import type { MemoryNode, NedfEncoding, NodeAttribute, PalacePortalRef } from "../entities/types";
import { normalizeAttributes } from "./attributes";
import { isStoreRole, type StoreRole } from "./generatedStore";
import { normalizeNedf } from "./nedf";

/** Node fields stored together in the `nodes.node_meta_json` column. */
export type NodeMetaFields = {
  portal: PalacePortalRef | null;
  imageUrl: string | null;
  nedf?: NedfEncoding;
  attributes?: NodeAttribute[];
  address?: string;
  storeRole?: StoreRole;
};

/** JSON for `nodes.node_meta_json`. `portal` and `imageUrl` are always written; `nedf` and `attributes` only when set. */
export function encodeNodeMeta(
  node: Pick<MemoryNode, "portal" | "imageUrl" | "nedf" | "attributes" | "address" | "storeRole">,
): string {
  const nedf = normalizeNedf(node.nedf);
  const attributes = normalizeAttributes(node.attributes);
  return JSON.stringify({
    portal: node.portal ?? null,
    imageUrl: node.imageUrl ?? null,
    ...(nedf ? { nedf } : {}),
    ...(attributes ? { attributes } : {}),
    ...(node.address ? { address: node.address } : {}),
    ...(isStoreRole(node.storeRole) ? { storeRole: node.storeRole } : {}),
  });
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
  const attributes = normalizeAttributes(raw.attributes);
  return {
    portal: (raw.portal ?? null) as PalacePortalRef | null,
    imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : null,
    ...(nedf ? { nedf } : {}),
    ...(attributes ? { attributes } : {}),
    ...(typeof raw.address === "string" && raw.address ? { address: raw.address } : {}),
    ...(isStoreRole(raw.storeRole) ? { storeRole: raw.storeRole } : {}),
  };
}
