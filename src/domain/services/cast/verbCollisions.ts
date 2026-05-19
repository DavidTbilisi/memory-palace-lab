/**
 * Tier-1 verb collision detection for CAST edges.
 *
 * Per `theSystem/cast-system.md` and `cast-overview.md:147`, Tier 1 fails when
 * two outgoing edges from the same source share a verb (exact match) or use
 * verbs from the same semantic family (e.g. "feeds" vs "supplies"). When that
 * happens the spec says: keep both edges, but promote *only the colliding one*
 * to Tier 2 so the CAST bytes break the tie.
 *
 * This module is pure — no React, no editor. It powers both the in-dialog
 * warning UI and any future graph-wide audit.
 */

export type Tier1VerbGroup = {
  label: string;
  verbs: readonly string[];
};

/**
 * Canonical Tier-1 verb suggestions. Verbs in the *same* group are treated as
 * confusable: picking two of them on different edges from one source means the
 * recall scene won't disambiguate them.
 *
 * This list is the source of truth — `CastEdgeDialog` imports it for its
 * suggestion buttons too.
 */
export const TIER1_VERB_GROUPS: readonly Tier1VerbGroup[] = [
  { label: "Control", verbs: ["commands", "owns", "governs", "locks"] },
  { label: "Supply", verbs: ["feeds", "sends", "delivers", "supplies"] },
  { label: "Trigger", verbs: ["triggers", "activates", "fires", "launches"] },
  { label: "Block", verbs: ["blocks", "stops", "freezes", "prevents"] },
  { label: "Transform", verbs: ["converts", "transforms", "encodes", "breaks"] },
  { label: "Inform", verbs: ["signals", "notifies", "warns", "informs"] },
  { label: "Depend", verbs: ["requires", "depends on", "needs"] },
  { label: "Amplify", verbs: ["amplifies", "inflates", "multiplies"] },
] as const;

export type VerbCollision = {
  /** The verb the user is about to add (already normalized). */
  candidate: string;
  /** The conflicting sibling verb already in use. */
  sibling: string;
  kind: "exact" | "confusable";
  /** Group label when kind === "confusable", undefined otherwise. */
  group?: string;
};

const norm = (raw: string) => raw.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Index every known verb to the label of the group it belongs to. Unknown
 * verbs (free-form user input) simply don't appear and can only collide
 * via exact match.
 */
const VERB_TO_GROUP: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const group of TIER1_VERB_GROUPS) {
    for (const verb of group.verbs) {
      map.set(norm(verb), group.label);
    }
  }
  return map;
})();

/**
 * Return every collision between the user's candidate verbs and the verbs
 * already in use on sibling edges (other outgoing edges from the same source).
 *
 * - Exact match (case- and whitespace-insensitive) → kind "exact".
 * - Both verbs are in the same TIER1_VERB_GROUPS family → kind "confusable".
 *
 * Multi-label edges (e.g. "supplies; sends") split on `;` and `,` to match
 * how the dialog stores tier-1 labels.
 */
export function detectVerbCollisions(
  candidates: readonly string[],
  siblings: readonly string[],
): VerbCollision[] {
  const collisions: VerbCollision[] = [];

  const candidateList = candidates
    .flatMap((raw) => raw.split(/[;,]/))
    .map(norm)
    .filter((v) => v.length > 0);

  const siblingList = siblings
    .flatMap((raw) => raw.split(/[;,]/))
    .map(norm)
    .filter((v) => v.length > 0);

  if (candidateList.length === 0 || siblingList.length === 0) return collisions;

  for (const candidate of candidateList) {
    const candidateGroup = VERB_TO_GROUP.get(candidate);
    for (const sibling of siblingList) {
      if (candidate === sibling) {
        collisions.push({ candidate, sibling, kind: "exact" });
        continue;
      }
      const siblingGroup = VERB_TO_GROUP.get(sibling);
      if (candidateGroup && siblingGroup && candidateGroup === siblingGroup) {
        collisions.push({
          candidate,
          sibling,
          kind: "confusable",
          group: candidateGroup,
        });
      }
    }
  }

  return collisions;
}

/**
 * Human-readable one-liner describing a collision. Used by the dialog warning.
 */
export function describeCollision(c: VerbCollision): string {
  if (c.kind === "exact") {
    return `"${c.candidate}" is already used by another edge from this source.`;
  }
  return `"${c.candidate}" and "${c.sibling}" are both ${c.group} verbs — recall will blur them.`;
}
