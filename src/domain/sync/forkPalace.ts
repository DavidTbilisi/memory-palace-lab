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
 * Every row gets a fresh id, not just the palace. `canvas_objects`, `nodes`, `edges`,
 * `routes` and `loci` each declare `id TEXT PRIMARY KEY` in db.rs — the keys are global, not
 * scoped to a palace — so a copy that reused them collides with the palace it was copied
 * from and the whole save is rejected. That is not hypothetical: it failed on the first real
 * two-device run with `UNIQUE constraint failed: canvas_objects.id`, having passed in
 * simulation because the in-memory repository keeps one map per palace and cannot see a
 * collision between two.
 *
 * The subtle part is the tldraw blob. Every memory shape carries `meta.mpPalaceId` plus the
 * row ids it stands for, and `registerMemoryIdGuard` (src/canvas/memoryIds.ts) regenerates
 * the object/node/edge ids of any shape whose `mpPalaceId` does not match the palace being
 * edited. So a fork that kept the blob verbatim would look fine until the user's next edit,
 * at which point every node would silently get new ids and every locus — and with it every
 * SM-2 review schedule — would point at nothing. Hence the blob is parsed and rewritten key
 * by key, with the same id map used for the rows so the two stay in step.
 *
 * It must stay a structural walk, never a string replace over the serialized blob: shapes
 * also carry `mpPortalPalaceId`, `mpPortalRouteId` and `mpPortalNodeId`, which point into
 * *other* palaces and are still correct after a fork. Replacing every occurrence would
 * silently redirect those portals — and a portal aimed back at the original palace
 * legitimately holds the old id.
 */
export function forkPalaceSnapshot(
  snapshot: PalaceSnapshot,
  options: { newId: string; newName: string },
): PalaceSnapshot {
  const { newId, newName } = options;
  const clone = JSON.parse(JSON.stringify(snapshot)) as PalaceSnapshot;

  const objects = remap(clone.canvasObjects);
  const nodes = remap(clone.nodes);
  const edges = remap(clone.edges);
  const routes = remap(clone.routes);
  const loci = remap(clone.loci);

  clone.palace.id = newId;
  clone.palace.name = newName;
  // A fork is new here, and has never been in the vault under this id.
  clone.palace.rev = 0;
  clone.palace.deletedAt = null;
  clone.palace.purgeAt = null;

  for (const object of clone.canvasObjects) {
    object.id = objects.get(object.id)!;
    object.palaceId = newId;
  }
  for (const node of clone.nodes) {
    node.id = nodes.get(node.id)!;
    node.objectId = objects.get(node.objectId) ?? node.objectId;
  }
  for (const edge of clone.edges) {
    edge.id = edges.get(edge.id)!;
    edge.objectId = objects.get(edge.objectId) ?? edge.objectId;
    edge.sourceNodeId = nodes.get(edge.sourceNodeId) ?? edge.sourceNodeId;
    edge.targetNodeId = nodes.get(edge.targetNodeId) ?? edge.targetNodeId;
  }
  for (const route of clone.routes) {
    route.id = routes.get(route.id)!;
    route.palaceId = newId;
  }
  for (const locus of clone.loci) {
    locus.id = loci.get(locus.id)!;
    locus.routeId = routes.get(locus.routeId) ?? locus.routeId;
    locus.nodeId = nodes.get(locus.nodeId) ?? locus.nodeId;
  }

  clone.palace.editorSnapshot = rewriteBlobIds(clone.palace.editorSnapshot ?? null, {
    palaceId: newId,
    objects,
    nodes,
    edges,
  });

  return clone;
}

/** Fresh ids for a set of rows, as a map from the old id to the new one. */
function remap(rows: { id: string }[]): Map<string, string> {
  return new Map(rows.map((row) => [row.id, crypto.randomUUID()]));
}

export type BlobIdRewrite = {
  palaceId: string;
  objects: Map<string, string>;
  nodes: Map<string, string>;
  edges: Map<string, string>;
};

/**
 * Which meta key is rewritten from which map. Anything absent here — every `mpPortal*` key
 * above all — is left exactly as it is.
 */
const KEY_SOURCE: Record<string, keyof Omit<BlobIdRewrite, "palaceId">> = {
  mpObjectId: "objects",
  mpNodeId: "nodes",
  mpSourceNodeId: "nodes",
  mpTargetNodeId: "nodes",
  mpEdgeId: "edges",
};

/**
 * Rewrites the palace id and every row id in a serialized tldraw store. Returns the blob
 * unchanged if it cannot be parsed, so a fork of an unopenable palace degrades instead of
 * throwing.
 */
export function rewriteBlobIds(editorSnapshot: string | null, rewrite: BlobIdRewrite): string | null {
  if (!editorSnapshot) return editorSnapshot;
  let parsed: unknown;
  try {
    parsed = JSON.parse(editorSnapshot);
  } catch {
    return editorSnapshot;
  }
  const changed = visit(parsed, rewrite);
  return changed ? JSON.stringify(parsed) : editorSnapshot;
}

/** Kept for the palace-id-only case; the fork itself rewrites row ids too. */
export function rewriteBlobPalaceId(editorSnapshot: string | null, newId: string): string | null {
  return rewriteBlobIds(editorSnapshot, {
    palaceId: newId,
    objects: new Map(),
    nodes: new Map(),
    edges: new Map(),
  });
}

function visit(value: unknown, rewrite: BlobIdRewrite): boolean {
  if (Array.isArray(value)) {
    let changed = false;
    for (const item of value) changed = visit(item, rewrite) || changed;
    return changed;
  }
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;
  let changed = false;

  if (typeof record.mpPalaceId === "string" && record.mpPalaceId !== rewrite.palaceId) {
    record.mpPalaceId = rewrite.palaceId;
    changed = true;
  }
  for (const [key, source] of Object.entries(KEY_SOURCE)) {
    const current = record[key];
    if (typeof current !== "string") continue;
    const replacement = rewrite[source].get(current);
    if (replacement) {
      record[key] = replacement;
      changed = true;
    }
  }

  for (const key of Object.keys(record)) {
    if (key === "mpPalaceId" || key in KEY_SOURCE) continue;
    changed = visit(record[key], rewrite) || changed;
  }
  return changed;
}
