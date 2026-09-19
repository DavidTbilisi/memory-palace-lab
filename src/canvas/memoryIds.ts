import type { Editor, TLShape, TLShapeId } from "@tldraw/editor";
import type { MemoryPalaceMeta } from "./memoryMeta";

/**
 * Node and edge ids are primary keys in the database, and copying a shape copies its meta.
 * A duplicated or pasted node therefore arrived with the ids of the node it came from, and
 * saving the palace failed with "UNIQUE constraint failed: canvas_objects.id" until the copy
 * was deleted. Both functions here give copies ids of their own.
 */

type Patch = { type: TLShape["type"]; meta: MemoryPalaceMeta };

function metaOf(shape: { meta?: unknown }): MemoryPalaceMeta {
  return (shape.meta ?? {}) as MemoryPalaceMeta;
}

/** A node or an edge; other shapes (drawings, the background) have no ids to keep apart. */
function isMemoryShape(meta: MemoryPalaceMeta): boolean {
  return Boolean(meta.mpObjectId) && Boolean(meta.mpNodeId ?? meta.mpEdgeId);
}

function withFreshIds(
  meta: MemoryPalaceMeta,
  palaceId: string | null,
): MemoryPalaceMeta {
  return {
    ...meta,
    ...(palaceId ? { mpPalaceId: palaceId } : {}),
    mpObjectId: crypto.randomUUID(),
    ...(meta.mpNodeId ? { mpNodeId: crypto.randomUUID() } : {}),
    ...(meta.mpEdgeId ? { mpEdgeId: crypto.randomUUID() } : {}),
  };
}

function idsAreTaken(editor: Editor, meta: MemoryPalaceMeta): boolean {
  for (const id of editor.getCurrentPageShapeIds()) {
    const other = metaOf(editor.getShape(id) ?? {});
    if (!other.mpObjectId) continue;
    if (other.mpObjectId === meta.mpObjectId) return true;
    if (meta.mpNodeId && other.mpNodeId === meta.mpNodeId) return true;
    if (meta.mpEdgeId && other.mpEdgeId === meta.mpEdgeId) return true;
  }
  return false;
}

/**
 * Gives a copy its own ids the moment it appears, so a duplicated node counts as a new node
 * straight away: clicking it in Route mode adds it as its own stop, and editing it leaves the
 * node it came from alone. Shapes of a palace being opened do not reach this, because tldraw
 * turns side effects off while it loads a snapshot.
 *
 * Returns the function that unregisters it.
 */
export function registerMemoryIdGuard(
  editor: Editor,
  getPalaceId: () => string | null,
): () => void {
  return editor.sideEffects.registerBeforeCreateHandler("shape", (shape) => {
    const meta = metaOf(shape);
    if (!isMemoryShape(meta)) return shape;
    const palaceId = getPalaceId();
    const fromAnotherPalace =
      Boolean(meta.mpPalaceId) &&
      Boolean(palaceId) &&
      meta.mpPalaceId !== palaceId;
    if (!fromAnotherPalace && !idsAreTaken(editor, meta)) return shape;
    return { ...shape, meta: withFreshIds(meta, palaceId) };
  });
}

/** An arrow attached to a copy describes the copy, not the node the copy came from. */
function retargetArrows(
  editor: Editor,
  shapeId: TLShapeId,
  nodeId: string,
  patches: Map<TLShapeId, Patch>,
) {
  for (const binding of editor.getBindingsToShape(shapeId, "arrow")) {
    const arrow = editor.getShape(binding.fromId);
    if (!arrow) continue;
    const patch = patches.get(arrow.id) ?? { type: arrow.type, meta: metaOf(arrow) };
    if (!patch.meta.mpEdgeId) continue;
    const terminal = (binding.props as { terminal?: unknown }).terminal;
    if (terminal !== "start" && terminal !== "end") continue;
    patches.set(arrow.id, {
      type: patch.type,
      meta:
        terminal === "start"
          ? { ...patch.meta, mpSourceNodeId: nodeId }
          : { ...patch.meta, mpTargetNodeId: nodeId },
    });
  }
}

/**
 * Gives every copy already on the page ids of its own, for canvases built before the guard
 * above, and returns how many shapes it changed. The shape lowest in the stack keeps its ids:
 * that is the one the database and the routes already know, and tldraw puts copies on top of it.
 */
export function ensureUniqueMemoryIds(editor: Editor, palaceId: string): number {
  const objectIds = new Set<string>();
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  const patches = new Map<TLShapeId, Patch>();

  for (const shape of editor.getCurrentPageShapesSorted()) {
    const meta = patches.get(shape.id)?.meta ?? metaOf(shape);
    if (!isMemoryShape(meta)) continue;

    const taken =
      objectIds.has(meta.mpObjectId as string) ||
      Boolean(meta.mpNodeId && nodeIds.has(meta.mpNodeId)) ||
      Boolean(meta.mpEdgeId && edgeIds.has(meta.mpEdgeId));

    let kept = meta;
    if (taken) {
      kept = withFreshIds(meta, palaceId);
      patches.set(shape.id, { type: shape.type, meta: kept });
      if (kept.mpNodeId) retargetArrows(editor, shape.id, kept.mpNodeId, patches);
    }

    objectIds.add(kept.mpObjectId as string);
    if (kept.mpNodeId) nodeIds.add(kept.mpNodeId);
    if (kept.mpEdgeId) edgeIds.add(kept.mpEdgeId);
  }

  if (patches.size === 0) return 0;
  const updates = [...patches].map(([id, patch]) => ({
    id,
    type: patch.type,
    meta: patch.meta,
  }));
  // Outside the undo stack: these ids are a repair, not something the user did.
  editor.run(() => editor.updateShapes(updates), { history: "ignore" });
  return updates.length;
}
