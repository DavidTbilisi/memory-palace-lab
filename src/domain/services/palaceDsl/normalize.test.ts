import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseDsl } from "./parser";
import { normalize } from "./normalize";
import type { DslSnapshot } from "./types";

function fixture(name: string) {
  return readFileSync(resolve(__dirname, "fixtures", name), "utf8");
}

describe("normalize — result structure", () => {
  it("returns a snapshot, normalizedAt, and canonicalHash", async () => {
    const { snapshot, normalizedAt, canonicalHash } = await normalize(parseDsl("@P\n\nAuth\n").snapshot);
    expect(snapshot).toBeDefined();
    expect(typeof normalizedAt).toBe("string");
    expect(typeof canonicalHash).toBe("string");
    expect(canonicalHash.length).toBeGreaterThan(0);
  });

  it("normalizedAt is a valid ISO-8601 timestamp", async () => {
    const { normalizedAt } = await normalize(parseDsl("@P\n").snapshot);
    expect(() => new Date(normalizedAt)).not.toThrow();
    expect(new Date(normalizedAt).toISOString()).toBe(normalizedAt);
  });

  it("canonicalHash is a 64-character hex string (SHA-256)", async () => {
    const { canonicalHash } = await normalize(parseDsl("@P\n\nAuth\n").snapshot);
    expect(canonicalHash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("normalize — tag normalization", () => {
  it("deduplicates plain tags", async () => {
    const snapshot: DslSnapshot = {
      ...parseDsl("@P\n\nAuth\n#security #security #auth\n").snapshot,
    };
    const { snapshot: out } = await normalize(snapshot);
    const tags = out.nodes[0]!.tags;
    const unique = new Set(tags);
    expect(unique.size).toBe(tags.length);
  });

  it("sorts plain tags alphabetically", async () => {
    const { snapshot } = await normalize(parseDsl("@P\n\nAuth\n#zebra #apple #mango\n").snapshot);
    expect(snapshot.nodes[0]!.tags).toEqual(["apple", "mango", "zebra"]);
  });

  it("reserved structured tags sort before custom keys", async () => {
    const { snapshot } = await normalize(
      parseDsl("@P\n\nAuth\n#custom:val #difficulty:beginner\n").snapshot,
    );
    const keys = snapshot.nodes[0]!.structuredTags.map((t) => t.key);
    const diffIdx = keys.indexOf("difficulty");
    const customIdx = keys.indexOf("custom");
    expect(diffIdx).toBeLessThan(customIdx);
  });

  it("tag normalization is idempotent — second pass produces same result", async () => {
    const base = parseDsl("@P\n\nAuth\n#zebra #apple #domain:security\n").snapshot;
    const { snapshot: once } = await normalize(base);
    const { snapshot: twice } = await normalize(once);
    expect(twice.nodes[0]!.tags).toEqual(once.nodes[0]!.tags);
  });
});

describe("normalize — edge ordering", () => {
  it("edges sorted by targetTitle within each node", async () => {
    const { snapshot } = await normalize(
      parseDsl("@P\n\nA\n>C\n>B\n\nB\n\nC\n").snapshot,
    );
    const targets = snapshot.nodes.find((n) => n.title === "A")!.edges.map((e) => e.targetTitle);
    expect(targets).toEqual(["B", "C"]);
  });

  it("edge sort is idempotent", async () => {
    const base = parseDsl("@P\n\nA\n>C\n>B\n\nB\n\nC\n").snapshot;
    const { snapshot: once } = await normalize(base);
    const { snapshot: twice } = await normalize(once);
    expect(twice.nodes.find((n) => n.title === "A")!.edges.map((e) => e.targetTitle)).toEqual(
      once.nodes.find((n) => n.title === "A")!.edges.map((e) => e.targetTitle),
    );
  });
});

describe("normalize — node ordering", () => {
  it("nodes sorted by implicitId", async () => {
    const { snapshot } = await normalize(parseDsl("@P\n\nZebra\n\nApple\n\nMango\n").snapshot);
    expect(snapshot.nodes.map((n) => n.implicitId)).toEqual(["apple", "mango", "zebra"]);
  });

  it("node sort is idempotent", async () => {
    const base = parseDsl("@P\n\nZebra\n\nApple\n").snapshot;
    const { snapshot: once } = await normalize(base);
    const { snapshot: twice } = await normalize(once);
    expect(twice.nodes.map((n) => n.implicitId)).toEqual(once.nodes.map((n) => n.implicitId));
  });
});

describe("normalize — canonical hash invariants", () => {
  it("same logical content produces same hash", async () => {
    const src = "@P\n\nAuth\n: body\n#security\n\nLogin\n>Auth\n\n/Main\n1 Auth\n2 Login\n";
    const { canonicalHash: h1 } = await normalize(parseDsl(src).snapshot);
    const { canonicalHash: h2 } = await normalize(parseDsl(src).snapshot);
    expect(h1).toBe(h2);
  });

  it("whitespace-only edits do not change hash", async () => {
    const src1 = "@P\n\nAuth\n#security\n";
    const src2 = "@P\n\n\nAuth\n#security\n\n";
    const { canonicalHash: h1 } = await normalize(parseDsl(src1).snapshot);
    const { canonicalHash: h2 } = await normalize(parseDsl(src2).snapshot);
    expect(h1).toBe(h2);
  });

  it("tag reordering does not change hash", async () => {
    const src1 = "@P\n\nAuth\n#apple #zebra #mango\n";
    const src2 = "@P\n\nAuth\n#zebra #mango #apple\n";
    const { canonicalHash: h1 } = await normalize(parseDsl(src1).snapshot);
    const { canonicalHash: h2 } = await normalize(parseDsl(src2).snapshot);
    expect(h1).toBe(h2);
  });

  it("node reordering in source does not change hash", async () => {
    const src1 = "@P\n\nAuth\n>Login\n\nLogin\n>Auth\n";
    const src2 = "@P\n\nLogin\n>Auth\n\nAuth\n>Login\n";
    const { canonicalHash: h1 } = await normalize(parseDsl(src1).snapshot);
    const { canonicalHash: h2 } = await normalize(parseDsl(src2).snapshot);
    expect(h1).toBe(h2);
  });

  it("different content produces different hashes", async () => {
    const { canonicalHash: h1 } = await normalize(parseDsl("@P\n\nAuth\n").snapshot);
    const { canonicalHash: h2 } = await normalize(parseDsl("@P\n\nLogin\n").snapshot);
    expect(h1).not.toBe(h2);
  });

  it("normalization is idempotent — hash stable across two passes", async () => {
    const base = parseDsl(fixture("mechanics.dsl")).snapshot;
    const { snapshot: once, canonicalHash: h1 } = await normalize(base);
    const { canonicalHash: h2 } = await normalize(once);
    expect(h2).toBe(h1);
  });
});
