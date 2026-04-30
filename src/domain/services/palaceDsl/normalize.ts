import type { DslSnapshot } from "./types";

/**
 * Result of running the normalization pass over a DslSnapshot.
 */
export interface NormalizeResult {
  snapshot: DslSnapshot;
  /** ISO-8601 timestamp of this normalization run. */
  normalizedAt: string;
  /**
   * Deterministic canonical hash of the snapshot's logical content.
   *
   * Invariants:
   * - Same logical content (regardless of node order in source) → same hash
   * - Whitespace-only edits to source → same hash
   * - Tag reordering → same hash
   *
   * Format: hex string of the SHA-256 of the canonical JSON payload.
   * Computed via Web Crypto (SubtleCrypto) for browser/Tauri compatibility.
   */
  canonicalHash: string;
}

// ---------------------------------------------------------------------------
// Step 1 — Tag normalization and canonical ordering
//
// Canonical order: reserved keys (alpha) → custom keys (alpha) → plain tags (alpha)
// ---------------------------------------------------------------------------

const RESERVED_TAG_KEYS = new Set(["prereq", "difficulty", "domain", "duration", "mode", "status"]);

function normalizeTagList(tags: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const t of tags) {
    const lower = t.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      deduped.push(lower);
    }
  }
  const reserved = deduped.filter((t) => {
    const colonIdx = t.indexOf(":");
    return colonIdx > 0 && RESERVED_TAG_KEYS.has(t.slice(0, colonIdx));
  }).sort();
  const custom = deduped.filter((t) => {
    const colonIdx = t.indexOf(":");
    return colonIdx > 0 && !RESERVED_TAG_KEYS.has(t.slice(0, colonIdx));
  }).sort();
  const plain = deduped.filter((t) => !t.includes(":")).sort();
  return [...reserved, ...custom, ...plain];
}

// ---------------------------------------------------------------------------
// Step 2 — Edge canonical ordering
//
// Within a node, edges are sorted by targetTitle then by resolvedCast for
// deterministic comparison. Duplicates (same targetTitle + same resolvedCast)
// are retained but flagged by the caller.
// ---------------------------------------------------------------------------

function normalizeEdges<E extends { targetTitle: string; semantic: { resolvedCast: string | null } }>(
  edges: E[],
): E[] {
  return [...edges].sort((a, b) => {
    const tCmp = a.targetTitle.localeCompare(b.targetTitle);
    if (tCmp !== 0) return tCmp;
    return (a.semantic.resolvedCast ?? "").localeCompare(b.semantic.resolvedCast ?? "");
  });
}

// ---------------------------------------------------------------------------
// Step 3 — Node canonical ordering (by implicitId)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Canonical payload builder (used for hashing)
// ---------------------------------------------------------------------------

interface CanonicalNode {
  id: string;
  title: string;
  tags: string[];
  edges: { target: string; cast: string | null }[];
}

interface CanonicalPayload {
  palace: string;
  atlasPath: string | null;
  nodes: CanonicalNode[];
  routeNames: string[];
}

function buildCanonicalPayload(snapshot: DslSnapshot): CanonicalPayload {
  const nodes: CanonicalNode[] = snapshot.nodes
    .map((n) => ({
      id: n.implicitId,
      title: n.title,
      tags: normalizeTagList(n.tags),
      edges: normalizeEdges(n.edges).map((e) => ({
        target: e.targetTitle,
        cast: e.semantic.resolvedCast,
      })),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    palace: snapshot.palaceName,
    atlasPath: snapshot.atlasPath,
    nodes,
    routeNames: snapshot.routes.map((r) => r.normalizedName).sort(),
  };
}

// ---------------------------------------------------------------------------
// SHA-256 via Web Crypto (browser/Tauri/Vite compatible)
// ---------------------------------------------------------------------------

async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Runs the normalization pass over a DslSnapshot. The pass is idempotent:
 * calling it twice on the same snapshot produces an identical result.
 *
 * The returned snapshot has:
 * - Tags deduplicated and canonically ordered on every node
 * - Edges sorted deterministically within each node
 * - Nodes sorted by implicitId (routes retain declaration order)
 * - structuredTags sorted to match the tag ordering
 */
export async function normalize(snapshot: DslSnapshot): Promise<NormalizeResult> {
  const normalizedNodes = snapshot.nodes
    .map((n) => {
      const normalizedTags = normalizeTagList(n.tags);
      // Re-derive structuredTags order to match tag order
      const tagKeyOrder = new Map(normalizedTags.map((t, i) => [t, i]));
      const normalizedStructuredTags = [...n.structuredTags].sort((a, b) => {
        const ka = `${a.key}:${a.value ?? ""}`;
        const kb = `${b.key}:${b.value ?? ""}`;
        return (tagKeyOrder.get(ka) ?? 999) - (tagKeyOrder.get(kb) ?? 999);
      });
      return {
        ...n,
        tags: normalizedTags,
        structuredTags: normalizedStructuredTags,
        edges: normalizeEdges(n.edges),
      };
    })
    .sort((a, b) => a.implicitId.localeCompare(b.implicitId));

  const normalizedSnapshot: DslSnapshot = {
    ...snapshot,
    nodes: normalizedNodes,
  };

  const payload = buildCanonicalPayload(normalizedSnapshot);
  const canonicalJson = JSON.stringify(payload);
  const canonicalHash = await sha256Hex(canonicalJson);
  const normalizedAt = new Date().toISOString();

  return { snapshot: normalizedSnapshot, normalizedAt, canonicalHash };
}
