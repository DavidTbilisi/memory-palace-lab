import type { MemoryPalaceMeta } from "./memoryMeta";

/**
 * A memory node is backed by either a tldraw geo shape (the default box) or an
 * image shape. Both carry the same `mp*` meta, so connections, content, tags,
 * routes, and difficulty work identically; only the shape props differ (an
 * image has no `richText`, `color`, or `fill`, so its title lives in
 * `mpTitle` alone).
 *
 * Kept free of runtime imports: the MCP server's headless editor uses it too.
 */
export const MEMORY_NODE_SHAPE_TYPES = ["geo", "image"] as const;
export type MemoryNodeShapeType = (typeof MEMORY_NODE_SHAPE_TYPES)[number];

type ShapeLike = { type?: string; meta?: unknown };

/** The shape is of a type that can back a node (it may not be one yet). */
export function isNodeCapableShape<T extends ShapeLike>(
  shape: T | null | undefined,
): shape is T & { type: MemoryNodeShapeType } {
  if (!shape) return false;
  if (!(MEMORY_NODE_SHAPE_TYPES as readonly string[]).includes(shape.type ?? ""))
    return false;
  // The palace background is an image too, but never a node.
  return (shape.meta as MemoryPalaceMeta | undefined)?.mpBackground !== true;
}

/** The shape backs a memory node: node-capable and carrying an `mpNodeId`. */
export function isMemoryNodeShape<T extends ShapeLike>(
  shape: T | null | undefined,
  // `meta` is part of the asserted type so that failing the check does not
  // narrow away geo/image shapes that simply are not nodes yet.
): shape is T & { type: MemoryNodeShapeType; meta: { mpNodeId: string } } {
  return (
    isNodeCapableShape(shape) &&
    !!(shape.meta as MemoryPalaceMeta | undefined)?.mpNodeId
  );
}

/** Only geo nodes draw their title on the canvas shape itself. */
export function nodeShapeHasLabel(shape: ShapeLike): boolean {
  return shape.type === "geo";
}
