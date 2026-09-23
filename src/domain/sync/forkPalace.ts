import type { PalaceSnapshot } from "../entities/types";

/**
 * Makes an independent copy of a palace under a new id — what "keep both" does when two
 * devices edited the same palace and the user wants neither side thrown away.
 *
 * The *local* copy is the one that forks, never the remote. The remote id is the one every
 * other device already knows; renaming it would force each of them to fork in turn,
 * multiplying copies across the fleet. Forking locally keeps the blast radius on the one
 * device that actually hit the conflict.
 *
 * The subtle part is the tldraw blob. Every memory shape carries `meta.mpPalaceId`, and
 * `registerMemoryIdGuard` (src/canvas/memoryIds.ts) regenerates the object/node/edge ids of
 * any shape whose `mpPalaceId` does not match the palace being edited. So a fork that kept
 * the blob verbatim would look fine until the user's next edit, at which point every node
 * would silently get new ids and every locus — and with it every SM-2 review schedule —
 * would point at nothing. Hence the blob is parsed and `mpPalaceId` rewritten key by key.
 *
 * It must stay a structural walk, never a string replace over the serialized blob: shapes
 * also carry `mpPortalPalaceId`, and a portal that points at this palace legitimately holds
 * the *old* id. Replacing every occurrence would silently redirect those portals.
 *
 * Node, edge, route, locus and canvas-object ids are all preserved. They are only ever
 * looked up within a palace, and keeping them means the loci still resolve to their routes.
 */
export function forkPalaceSnapshot(
  snapshot: PalaceSnapshot,
  options: { newId: string; newName: string },
): PalaceSnapshot {
  const { newId, newName } = options;
  const clone = JSON.parse(JSON.stringify(snapshot)) as PalaceSnapshot;

  clone.palace.id = newId;
  clone.palace.name = newName;
  // A fork is new here, and has never been in the vault under this id.
  clone.palace.rev = 0;
  clone.palace.deletedAt = null;
  clone.palace.purgeAt = null;
  clone.palace.editorSnapshot = rewriteBlobPalaceId(clone.palace.editorSnapshot ?? null, newId);

  for (const object of clone.canvasObjects) object.palaceId = newId;
  for (const route of clone.routes) route.palaceId = newId;

  return clone;
}

/**
 * Rewrites `meta.mpPalaceId` everywhere it appears in a serialized tldraw store, leaving
 * every other key — `mpPortalPalaceId` above all — untouched. Returns the blob unchanged if
 * it cannot be parsed, so a fork of an unopenable palace degrades instead of throwing.
 */
export function rewriteBlobPalaceId(editorSnapshot: string | null, newId: string): string | null {
  if (!editorSnapshot) return editorSnapshot;
  let parsed: unknown;
  try {
    parsed = JSON.parse(editorSnapshot);
  } catch {
    return editorSnapshot;
  }
  const changed = visit(parsed, newId);
  return changed ? JSON.stringify(parsed) : editorSnapshot;
}

function visit(value: unknown, newId: string): boolean {
  if (Array.isArray(value)) {
    let changed = false;
    for (const item of value) changed = visit(item, newId) || changed;
    return changed;
  }
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;
  let changed = false;
  if (typeof record.mpPalaceId === "string" && record.mpPalaceId !== newId) {
    record.mpPalaceId = newId;
    changed = true;
  }
  for (const key of Object.keys(record)) {
    if (key === "mpPalaceId") continue;
    changed = visit(record[key], newId) || changed;
  }
  return changed;
}
