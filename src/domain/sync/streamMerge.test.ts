import { describe, expect, it } from "vitest";
import { foreignIdsFrom, selectShardRows, unionById } from "./streamMerge";

type Row = { id: string; createdAt: string };

const NOW = new Date("2026-09-23T00:00:00.000Z");

function row(id: string, createdAt = "2026-09-01T00:00:00.000Z"): Row {
  return { id, createdAt };
}

describe("unionById", () => {
  it("merges two sets without duplicating shared rows", () => {
    const merged = unionById([row("a"), row("b")], [row("b"), row("c")]);
    expect(merged.map((r) => r.id).sort()).toEqual(["a", "b", "c"]);
  });

  it("does not depend on which side is which", () => {
    const left = unionById([row("a")], [row("b")]).map((r) => r.id).sort();
    const right = unionById([row("b")], [row("a")]).map((r) => r.id).sort();
    expect(left).toEqual(right);
  });

  it("is idempotent", () => {
    const once = unionById([row("a"), row("b")], [row("b")]);
    const twice = unionById(once, [row("b")]);
    expect(twice).toEqual(once);
  });
});

describe("selectShardRows", () => {
  it("publishes only what this device originated", () => {
    // The whole point: rows pulled from a peer stay out of our shard, so pulling them does
    // not make us re-publish them.
    const all = [row("mine-1"), row("theirs-1"), row("mine-2")];
    const shard = selectShardRows(all, new Set(["theirs-1"]), { retentionDays: 365, now: NOW });

    expect(shard.map((r) => r.id)).toEqual(["mine-1", "mine-2"]);
  });

  it("settles after one round rather than growing every sync", () => {
    // Round one: we hold our own rows. Round two: we have pulled a peer's rows and recorded
    // them as foreign. The shard we publish must be byte-identical, or sync never finishes.
    const mine = [row("mine-1"), row("mine-2")];
    const theirs = [row("theirs-1")];

    const first = selectShardRows(mine, new Set(), { retentionDays: 365, now: NOW });

    const afterPull = unionById(mine, theirs);
    const foreign = new Set(foreignIdsFrom(theirs));
    const second = selectShardRows(afterPull, foreign, { retentionDays: 365, now: NOW });

    expect(second).toEqual(first);
  });

  it("trims rows older than the retention window", () => {
    const all = [row("recent", "2026-09-20T00:00:00.000Z"), row("ancient", "2020-01-01T00:00:00.000Z")];
    const shard = selectShardRows(all, new Set(), { retentionDays: 30, now: NOW });

    expect(shard.map((r) => r.id)).toEqual(["recent"]);
  });

  it("keeps a row whose timestamp cannot be parsed", () => {
    // Dropping a row is worse than carrying one retention should have trimmed.
    const shard = selectShardRows([row("odd", "not-a-date")], new Set(), {
      retentionDays: 1,
      now: NOW,
    });
    expect(shard.map((r) => r.id)).toEqual(["odd"]);
  });

  it("orders rows deterministically so an unchanged shard hashes the same", () => {
    const forward = selectShardRows([row("b"), row("a")], new Set(), {
      retentionDays: 365,
      now: NOW,
    });
    const backward = selectShardRows([row("a"), row("b")], new Set(), {
      retentionDays: 365,
      now: NOW,
    });
    expect(forward).toEqual(backward);
  });
});
