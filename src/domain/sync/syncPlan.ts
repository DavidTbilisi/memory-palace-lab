/**
 * The conflict rule. Pure, synchronous, and the only place that decides what a sync run does.
 *
 * Two invariants hold every case together:
 *
 *  - **No clock is ever consulted.** `updatedAt` travels in the header for display, but no
 *    branch below reads it. That is the structural answer to clock skew between devices:
 *    not "we handle skew carefully" but "skew cannot reach a decision".
 *  - **Absence never deletes.** A palace missing from the vault means "not pushed yet". Only
 *    an explicit tombstone removes anything.
 */

export type LocalPalaceMeta = {
  palaceId: string;
  name: string;
  rev: number;
  contentHash: string;
};

export type RemotePalaceMeta = {
  palaceId: string;
  rev: number;
  contentHash: string;
  /** Set when the file could not be parsed or decrypted; such a palace is skipped. */
  unreadable?: boolean;
};

export type SyncBase = {
  palaceId: string;
  baseRev: number;
  baseHash: string;
  remoteRev: number;
  remoteHash: string;
};

export type Tombstone = {
  palaceId: string;
  deletedAt: string;
  rev: number;
};

export type SyncAction =
  /** Nothing to do; bookkeeping may still need refreshing. */
  | { kind: "in-sync"; palaceId: string }
  /** Both sides changed to the same content — record agreement, write nothing. */
  | { kind: "converged"; palaceId: string }
  | { kind: "push"; palaceId: string }
  | { kind: "push-new"; palaceId: string }
  | { kind: "pull"; palaceId: string }
  | { kind: "pull-new"; palaceId: string }
  /** The vault says this palace was hard-deleted; remove it locally. */
  | { kind: "pull-delete"; palaceId: string }
  /** We hard-deleted it; remove the vault's copy. */
  | { kind: "push-delete"; palaceId: string }
  | { kind: "conflict"; palaceId: string; reason: ConflictReason }
  | { kind: "unreadable"; palaceId: string };

export type ConflictReason = "both-edited" | "deleted-here-edited-there" | "deleted-there-edited-here";

export type SyncPlan = {
  actions: SyncAction[];
};

export function conflictsOf(plan: SyncPlan): Extract<SyncAction, { kind: "conflict" }>[] {
  return plan.actions.filter((a): a is Extract<SyncAction, { kind: "conflict" }> => a.kind === "conflict");
}

export function hasWork(plan: SyncPlan): boolean {
  return plan.actions.some((a) => a.kind !== "in-sync" && a.kind !== "unreadable");
}

function classify(
  palaceId: string,
  local: LocalPalaceMeta | undefined,
  remote: RemotePalaceMeta | undefined,
  base: SyncBase | undefined,
  tombstone: Tombstone | undefined,
): SyncAction {
  if (remote?.unreadable) return { kind: "unreadable", palaceId };

  // Hard-deleted here. The tombstone remembers the revision the palace was at, which is what
  // separates "this was deleted" from "someone edited it after the delete".
  if (tombstone && !local) {
    if (!remote) return { kind: "in-sync", palaceId };
    if (remote.rev > tombstone.rev) return { kind: "conflict", palaceId, reason: "deleted-here-edited-there" };
    return { kind: "push-delete", palaceId };
  }

  if (!local && !remote) return { kind: "in-sync", palaceId };

  if (!local) {
    // Nothing local and no tombstone: this is simply a palace we have never seen.
    return { kind: "pull-new", palaceId };
  }

  if (!remote) {
    // Never in the vault, or removed from it. A vault that removed it would have left a
    // tombstone, so this is a palace we have not pushed yet.
    if (base) {
      // We synced this before and the vault no longer has it. Treat a vanished file as a
      // push, never a delete — a half-synced folder must not be able to erase local work.
      return { kind: "push", palaceId };
    }
    return { kind: "push-new", palaceId };
  }

  const localChanged = !base || local.contentHash !== base.baseHash;
  const remoteChanged = !base || remote.contentHash !== base.remoteHash;

  if (local.contentHash === remote.contentHash) {
    // Identical content. Common on a first join, or when both devices made the same edit;
    // without this branch it would surface as an infuriating conflict over two equal things.
    return base && !localChanged && !remoteChanged
      ? { kind: "in-sync", palaceId }
      : { kind: "converged", palaceId };
  }

  if (localChanged && remoteChanged) return { kind: "conflict", palaceId, reason: "both-edited" };
  if (localChanged) return { kind: "push", palaceId };
  if (remoteChanged) return { kind: "pull", palaceId };
  return { kind: "in-sync", palaceId };
}

export function planSync(input: {
  local: readonly LocalPalaceMeta[];
  remote: readonly RemotePalaceMeta[];
  base: readonly SyncBase[];
  tombstones: readonly Tombstone[];
}): SyncPlan {
  const localById = new Map(input.local.map((item) => [item.palaceId, item]));
  const remoteById = new Map(input.remote.map((item) => [item.palaceId, item]));
  const baseById = new Map(input.base.map((item) => [item.palaceId, item]));
  const tombstoneById = new Map(input.tombstones.map((item) => [item.palaceId, item]));

  const ids = new Set<string>([
    ...localById.keys(),
    ...remoteById.keys(),
    ...tombstoneById.keys(),
  ]);

  const actions = [...ids]
    .sort()
    .map((id) =>
      classify(id, localById.get(id), remoteById.get(id), baseById.get(id), tombstoneById.get(id)),
    );

  return { actions };
}
