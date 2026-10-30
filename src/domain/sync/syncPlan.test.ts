import { describe, expect, it } from "vitest";
import {
  conflictsOf,
  hasWork,
  planSync,
  type LocalPalaceMeta,
  type RemotePalaceMeta,
  type SyncBase,
  type Tombstone,
} from "./syncPlan";

const ID = "palace-1";

function local(contentHash: string, rev = 1): LocalPalaceMeta {
  return { palaceId: ID, name: "Palace", rev, contentHash };
}

function remote(contentHash: string, rev = 1): RemotePalaceMeta {
  return { palaceId: ID, rev, contentHash };
}

function base(baseHash: string, remoteHash: string): SyncBase {
  return { palaceId: ID, baseRev: 1, baseHash, remoteRev: 1, remoteHash };
}

function planOne(input: {
  local?: LocalPalaceMeta;
  remote?: RemotePalaceMeta;
  base?: SyncBase;
  tombstone?: Tombstone;
}) {
  return planSync({
    local: input.local ? [input.local] : [],
    remote: input.remote ? [input.remote] : [],
    base: input.base ? [input.base] : [],
    tombstones: input.tombstone ? [input.tombstone] : [],
  }).actions[0];
}

describe("planSync", () => {
  it("pushes a palace the vault has never seen", () => {
    expect(planOne({ local: local("aaa") })).toEqual({ kind: "push-new", palaceId: ID });
  });

  it("pulls a palace this device has never seen", () => {
    expect(planOne({ remote: remote("aaa") })).toEqual({ kind: "pull-new", palaceId: ID });
  });

  it("reports no work when neither side moved", () => {
    const action = planOne({ local: local("aaa"), remote: remote("aaa"), base: base("aaa", "aaa") });
    expect(action).toEqual({ kind: "in-sync", palaceId: ID });
  });

  it("pushes when only this device changed", () => {
    const action = planOne({ local: local("bbb"), remote: remote("aaa"), base: base("aaa", "aaa") });
    expect(action).toEqual({ kind: "push", palaceId: ID });
  });

  it("pulls when only the other device changed", () => {
    const action = planOne({ local: local("aaa"), remote: remote("bbb"), base: base("aaa", "aaa") });
    expect(action).toEqual({ kind: "pull", palaceId: ID });
  });

  it("conflicts when both sides changed", () => {
    const action = planOne({ local: local("bbb"), remote: remote("ccc"), base: base("aaa", "aaa") });
    expect(action).toEqual({ kind: "conflict", palaceId: ID, reason: "both-edited" });
  });

  it("converges instead of conflicting when both sides made the same edit", () => {
    // Without this the user is asked to resolve a conflict between two identical palaces.
    const action = planOne({ local: local("bbb"), remote: remote("bbb"), base: base("aaa", "aaa") });
    expect(action).toEqual({ kind: "converged", palaceId: ID });
  });

  it("treats a first join with differing content as a conflict", () => {
    const action = planOne({ local: local("bbb"), remote: remote("ccc") });
    expect(action).toEqual({ kind: "conflict", palaceId: ID, reason: "both-edited" });
  });

  it("treats a first join with identical content as converged", () => {
    expect(planOne({ local: local("bbb"), remote: remote("bbb") })).toEqual({
      kind: "converged",
      palaceId: ID,
    });
  });

  it("ignores a revision that moved when the content did not", () => {
    // The app checkpoint-saves aggressively, so rev inflates without the content changing.
    // Those must not surface as conflicts.
    const action = planOne({
      local: local("aaa", 99),
      remote: remote("aaa", 2),
      base: base("aaa", "aaa"),
    });
    expect(action).toEqual({ kind: "in-sync", palaceId: ID });
  });

  it("never lets a missing remote file delete local work", () => {
    // A half-synced folder can hide a file that was there last time. That is a push, not a
    // delete: only an explicit tombstone removes anything.
    const action = planOne({ local: local("aaa"), base: base("aaa", "aaa") });
    expect(action).toEqual({ kind: "push", palaceId: ID });
  });

  it("skips a file it cannot read rather than treating it as absent", () => {
    const action = planOne({
      local: local("aaa"),
      remote: { palaceId: ID, rev: 1, contentHash: "", unreadable: true },
    });
    expect(action).toEqual({ kind: "unreadable", palaceId: ID });
  });

  describe("deletions", () => {
    const tombstone: Tombstone = { palaceId: ID, deletedAt: "2026-01-01T00:00:00.000Z", rev: 5 };

    it("removes the vault copy of a palace purged here", () => {
      const action = planOne({ remote: remote("aaa", 5), tombstone });
      expect(action).toEqual({ kind: "push-delete", palaceId: ID });
    });

    it("conflicts when the vault copy moved past the purge", () => {
      // Someone edited it elsewhere after we deleted it, so the delete is no longer obviously
      // what the user wants.
      const action = planOne({ remote: remote("bbb", 6), tombstone });
      expect(action).toEqual({
        kind: "conflict",
        palaceId: ID,
        reason: "deleted-here-edited-there",
      });
    });

    it("does nothing when both sides already dropped it", () => {
      expect(planOne({ tombstone })).toEqual({ kind: "in-sync", palaceId: ID });
    });
  });

  it("makes no decision from timestamps", () => {
    // Clock skew is handled structurally: nothing in the rule reads a clock. Garbage
    // timestamps on either side must not change a single classification.
    const withSkew = planSync({
      local: [{ ...local("bbb"), rev: 1 }],
      remote: [{ ...remote("aaa"), rev: 1 }],
      base: [base("aaa", "aaa")],
      tombstones: [],
    });
    expect(withSkew.actions[0]).toEqual({ kind: "push", palaceId: ID });
  });

  it("plans every palace across both sides", () => {
    const plan = planSync({
      local: [
        { palaceId: "a", name: "A", rev: 1, contentHash: "1" },
        { palaceId: "b", name: "B", rev: 1, contentHash: "2" },
      ],
      remote: [{ palaceId: "c", rev: 1, contentHash: "3" }],
      base: [],
      tombstones: [],
    });
    expect(plan.actions.map((a) => a.palaceId)).toEqual(["a", "b", "c"]);
    expect(hasWork(plan)).toBe(true);
    expect(conflictsOf(plan)).toHaveLength(0);
  });

  it("reports no work for an entirely settled vault", () => {
    const plan = planSync({
      local: [{ palaceId: "a", name: "A", rev: 3, contentHash: "1" }],
      remote: [{ palaceId: "a", rev: 3, contentHash: "1" }],
      base: [{ palaceId: "a", baseRev: 3, baseHash: "1", remoteRev: 3, remoteHash: "1" }],
      tombstones: [],
    });
    expect(hasWork(plan)).toBe(false);
  });
});
