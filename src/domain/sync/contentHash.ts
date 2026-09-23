import type { Locus, MemoryRoute, PalaceSnapshot } from "../entities/types";
import { encodeRouteSettings, encodeStopSettings } from "../services/routeSettings";

/**
 * The content hash a sync run compares to decide whether a side actually changed.
 *
 * Two deliberate choices:
 *
 * 1. It is computed here and nowhere else. `palaces.rev` is a counter every writer bumps in
 *    SQL, which is trivially correct in Rust, in node:sqlite and in the memory repository.
 *    A hash is not: three canonical serializers that have to agree byte-for-byte would drift
 *    and manufacture conflicts between two devices holding identical palaces. So the counter
 *    answers "did anyone touch this?" and the hash — computed once, at sync time, from a
 *    loaded snapshot — answers "did the content actually change?".
 *
 * 2. It covers only what a person edited: the tldraw blob, the palace's own fields, and the
 *    routes and loci (which carry the SM-2 review schedule). It deliberately skips
 *    `canvasObjects`, `nodes` and `edges`, because those are a *projection* of the blob,
 *    rebuilt on every save — by `buildPalaceSnapshot` in the app and `buildRowsFromShapes` in
 *    the MCP server. Those two could drift, and a tldraw upgrade could change the projection
 *    without changing anything the user did. Hashing them would turn either into a phantom
 *    conflict. The blob is the source of truth, so the blob is what gets hashed.
 *
 * The cost of (2): an edit that somehow changed only the projection and not the blob would
 * look like no change at all. That cannot happen through the app, because the projection is
 * derived from the blob every time it is written.
 */

/** Sorted, fixed-shape text for one route — key order can't drift with the object literal. */
function canonicalRoute(route: MemoryRoute): string {
  return JSON.stringify([route.id, route.palaceId, route.name, encodeRouteSettings(route)]);
}

/** Includes every SM-2 field, so a review on one device is a real change on the other. */
function canonicalLocus(locus: Locus): string {
  return JSON.stringify([
    locus.id,
    locus.routeId,
    locus.nodeId,
    locus.orderIndex,
    locus.label,
    locus.interval ?? null,
    locus.easeFactor ?? null,
    locus.nextReviewAt ?? null,
    locus.repetitions ?? null,
    locus.lastReviewedAt ?? null,
    encodeStopSettings(locus),
  ]);
}

/**
 * Stable text for a snapshot. Arrays are sorted by identity rather than trusted in the order
 * SQLite happened to return them, so a row-order change is not a content change.
 */
export function canonicalPalaceContent(snapshot: PalaceSnapshot): string {
  const { palace } = snapshot;
  const routes = snapshot.routes.map(canonicalRoute).sort();
  const loci = snapshot.loci.map(canonicalLocus).sort();
  return JSON.stringify({
    id: palace.id,
    name: palace.name,
    alias: palace.alias ?? null,
    atlasPath: palace.atlasPath ?? null,
    deletedAt: palace.deletedAt ?? null,
    editorSnapshot: palace.editorSnapshot ?? null,
    routes,
    loci,
  });
}

export async function palaceContentHash(snapshot: PalaceSnapshot): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalPalaceContent(snapshot)),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
