import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { initDb, openDb } from "../palaceDb";
import { type CliDeps, MCP_TOOLS_WITHOUT_CLI_VERB, runCli, VERBS } from "./commands";

const FIXTURES = resolve(__dirname, "../../../src/domain/services/palaceDsl/fixtures");
const citadel = () =>
  readFileSync(join(FIXTURES, "solid-citadel.dsl"), "utf8").replace(/\r\n/g, "\n");

describe("palace CLI", () => {
  let dir: string;
  let dbPath: string;
  let stdin = "";
  const deps: CliDeps = {
    openContext: () => {
      const db = openDb(dbPath);
      initDb(db);
      return { db, sentinelDir: dir };
    },
    readStdin: async () => stdin,
    version: "test",
  };
  const run = (...argv: string[]) => runCli(argv, deps);
  const file = (name: string, text: string) => {
    const path = join(dir, name);
    writeFileSync(path, text, "utf8");
    return path;
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "mpl-cli-"));
    dbPath = join(dir, "test.sqlite3");
    stdin = "";
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  describe("dispatch", () => {
    it("prints help with no arguments and exits 0", async () => {
      const out = await run();
      expect(out.code).toBe(0);
      expect(out.stdout).toContain("Usage: palace <command>");
      for (const verb of VERBS) expect(out.stdout).toContain(verb.name);
    });

    it("rejects unknown commands and unknown options with exit 2", async () => {
      expect((await run("frobnicate")).code).toBe(2);
      const cast = await run("cast");
      expect(cast.code).toBe(2);
      expect(cast.stderr).toContain("cast decode");
      const bad = await run("list", "--nope");
      expect(bad.code).toBe(2);
      expect(bad.stderr).toContain("Usage: palace list");
    });

    it("enforces positional arity", async () => {
      const out = await run("get");
      expect(out.code).toBe(2);
      expect(out.stderr).toContain("expected 1 argument(s), got 0");
    });

    it("accepts global options before or after the command", async () => {
      const before = await run("--json", "--db", dbPath, "cast", "table");
      const after = await run("cast", "table", "--json");
      expect(before.code).toBe(0);
      expect(before.stdout).toBe(after.stdout);
      expect((await run("--db", dbPath, "list")).code).toBe(0);
      expect((await run("--db")).code).toBe(0);
      expect((await run("list", "--db")).code).toBe(2);
    });

    it("shows per-command help", async () => {
      const out = await run("export", "--help");
      expect(out.code).toBe(0);
      expect(out.stdout).toContain("MCP equivalent: palace_export_dsl");
    });
  });

  describe("cast", () => {
    it("decodes the compact token with lexicon glosses", async () => {
      const out = await run("cast", "decode", "1231", "--json");
      expect(out.code).toBe(0);
      const view = JSON.parse(out.stdout);
      expect(view.compact).toBe("1231");
      expect(view.bits).toBe("00 01 10 00");
      expect(view.axes.map((a: { english: string }) => a.english)).toEqual([
        "Giant",
        "Flowing",
        "Cloud",
        "Red cave",
      ]);
      expect(view.scene).toBe("A Giant flowing a cloud in a red cave.");
      expect(view.axes[0].georgian).toBeTruthy();
    });

    it("decodes theSystem's eight-bit form, spaced or not, and named axes", async () => {
      const spaced = JSON.parse((await run("cast", "decode", "00", "01", "10", "00", "--json")).stdout);
      const packed = JSON.parse((await run("cast", "decode", "00011000", "--json")).stdout);
      const named = JSON.parse(
        (await run("cast", "decode", "who:Giant how:Flowing what:Cloud", "--json")).stdout,
      );
      expect(spaced.compact).toBe("1231");
      expect(packed.compact).toBe("1231");
      expect(named.compact).toBe("1230");
      expect(named.bits).toBeNull();
    });

    it("renders a text form by default and fails on garbage", async () => {
      const out = await run("cast", "decode", "4444");
      expect(out.stdout).toContain("A Dragon exploding a lightning in a purple storm.");
      expect(out.stdout).toContain("11 Dragon");
      const bad = await run("cast", "decode", "12345");
      expect(bad.code).toBe(1);
      expect(bad.stderr).toContain("Unrecognised CAST token");
    });

    it("encodes from case-insensitive labels and rejects unknown ones", async () => {
      const out = JSON.parse(
        (await run("cast", "encode", "--who", "giant", "--when", "red cave", "--json")).stdout,
      );
      expect(out.compact).toBe("1001");
      const bad = await run("cast", "encode", "--what", "Stone");
      expect(bad.code).toBe(1);
      expect(bad.stderr).toContain("Allowed: Rock, Water, Cloud, Lightning");
    });

    it("prints the whole lexicon", async () => {
      const table = JSON.parse((await run("cast", "table", "--json")).stdout);
      expect(table).toHaveLength(4);
      expect(table.every((axis: { rows: unknown[] }) => axis.rows.length === 4)).toBe(true);
      expect((await run("cast", "table")).stdout).toContain("WHO (C)");
    });
  });

  describe("lint", () => {
    it("is silent and exits 0 on a clean document", async () => {
      const out = await run("lint", file("ok.dsl", citadel()));
      expect(out).toEqual({ code: 0, stdout: "", stderr: "" });
    });

    it("prints compiler-style lines and exits 1 on errors", async () => {
      const path = file("dup.dsl", "@P\n\nA\n\nA\n>Missing\n");
      const out = await run("lint", path);
      expect(out.code).toBe(1);
      expect(out.stdout).toContain(`${path}:5:1: error E002`);
      expect(out.stdout).toContain("warning W007");
      expect(out.stderr).toBe("1 error(s), 1 warning(s) in 1 file(s)\n");
    });

    it("treats warnings as failures only with --strict, and reads stdin", async () => {
      stdin = "@P\n\nA\n>Missing\n";
      expect((await run("lint", "-")).code).toBe(0);
      const strict = await run("lint", "-", "--strict");
      expect(strict.code).toBe(1);
      expect(strict.stdout).toContain("<stdin>:4:");
    });

    it("emits structured diagnostics with --json", async () => {
      const path = file("dup.dsl", "@P\n\nA\n\nA\n");
      const [result] = JSON.parse((await run("lint", path, "--json")).stdout);
      expect(result.file).toBe(path);
      expect(result.errors).toBe(1);
      expect(result.diagnostics[0]).toMatchObject({ numericCode: "E002", line: 5, column: 1 });
    });
  });

  describe("hash", () => {
    it("is stable across whitespace, node order and tag order, and changes with content", async () => {
      const a = file("a.dsl", "@P\n\nAlpha\n#x #y\n>Beta\n\nBeta\n");
      const b = file("b.dsl", "@P\n\n\nBeta\n\nAlpha\n#y   #x\n>Beta\n\n");
      const c = file("c.dsl", "@P\n\nAlpha\n#x #y\n>Beta 1000\n\nBeta\n");
      const out = await run("hash", a, b, c);
      expect(out.code).toBe(0);
      const [ha, hb, hc] = out.stdout.trim().split("\n").map((l) => l.split("  ")[0]);
      expect(ha).toMatch(/^[0-9a-f]{64}$/);
      expect(hb).toBe(ha);
      expect(hc).not.toBe(ha);
    });

    it("refuses documents with errors", async () => {
      const out = await run("hash", file("bad.dsl", "Orphan\n"));
      expect(out.code).toBe(1);
      expect(out.stderr).toContain("E001");
      expect(out.stdout).toBe("");
    });
  });

  describe("fmt", () => {
    it("leaves a canonical fixture byte-identical", async () => {
      const path = file("citadel.dsl", citadel());
      expect((await run("fmt", path)).stdout).toBe(citadel());
      expect(await run("fmt", "--check", path)).toEqual({ code: 0, stdout: "", stderr: "" });
    });

    it("normalizes spacing, tag order and cast notation", async () => {
      const path = file("messy.dsl", "@P\n  Alpha\n  #zeta #alpha\n  >Beta 0000\n  >Gamma 1100\nBeta\nGamma\n");
      const out = await run("fmt", path);
      expect(out.code).toBe(0);
      expect(out.stdout).toBe("@P\n\nAlpha\n#alpha #zeta\n>Beta\n>Gamma 1100\n\nBeta\n\nGamma\n");
      const check = await run("fmt", "--check", path);
      expect(check.code).toBe(1);
      expect(check.stderr).toBe(`would reformat ${path}\n`);
      const write = await run("fmt", "--write", path);
      expect(write.code).toBe(0);
      expect(readFileSync(path, "utf8")).toBe(out.stdout);
      expect(await run("fmt", "--write", path)).toEqual({ code: 0, stdout: "", stderr: "" });
    });

    it("refuses documents whose constructs the serializer would drop", async () => {
      const path = file("alias.dsl", "@P\n~dep:1000 depends on\n\nAlpha\n>Beta dep\n\nBeta\n-- note\n");
      const out = await run("fmt", path);
      expect(out.code).toBe(1);
      expect(out.stdout).toBe("");
      expect(out.stderr).toContain("~alias declarations");
      expect(out.stderr).toContain("-- comments");
    });
  });

  describe("database verbs", () => {
    it("import → list → get → export → analyze → apply → events, tagged source:cli", async () => {
      const imported = await run("import", file("citadel.dsl", citadel()), "--atlas", "/eng/oop");
      expect(imported.code).toBe(0);
      const created = JSON.parse(imported.stdout);
      expect(created.created).toBe(true);
      expect(created.name).toBe("SOLID Citadel");

      const list = JSON.parse((await run("list")).stdout);
      expect(list.palaces).toHaveLength(1);
      expect(list.palaces[0].atlasPath).toBe("/eng/oop");

      const got = JSON.parse((await run("get", "SOLID Citadel")).stdout);
      expect(got.nodeCount).toBeGreaterThan(5);
      expect(got.edgeCount).toBeGreaterThan(5);

      const exported = await run("export", created.palaceId);
      expect(exported.code).toBe(0);
      expect(exported.stdout).toContain("@SOLID Citadel");
      expect(exported.stdout).toContain(">Single Responsibility Forge 0001");
      const bundle = JSON.parse((await run("export", created.palaceId, "--json")).stdout);
      expect(bundle.version).toBe(1);
      expect(bundle.snapshot.nodes.length).toBe(got.nodeCount);

      const outPath = join(dir, "out.dsl");
      const written = await run("export", created.palaceId, "--out", outPath);
      expect(written.stdout).toBe("");
      expect(readFileSync(outPath, "utf8")).toBe(exported.stdout);

      const analyzed = JSON.parse((await run("analyze", "SOLID Citadel")).stdout);
      expect(analyzed.nodeCount).toBe(got.nodeCount);
      expect(JSON.parse((await run("crux", "SOLID Citadel")).stdout).crux).not.toBeNull();
      expect(JSON.parse((await run("edges", "SOLID Citadel")).stdout).edges.length).toBe(got.edgeCount);
      expect(JSON.parse((await run("routes", "SOLID Citadel")).stdout).routes).toBeDefined();
      expect(JSON.parse((await run("review", "SOLID Citadel")).stdout).summary).toBeDefined();
      expect(JSON.parse((await run("motifs", "SOLID Citadel")).stdout).counts).toBeDefined();

      stdin = `${exported.stdout}\nBrand New Node\n: appended from stdin\n`;
      const applied = await run("apply", "SOLID Citadel", "-");
      expect(applied.code).toBe(0);
      expect(JSON.parse(applied.stdout).added.nodes).toBe(1);
      const nodeList = JSON.parse((await run("nodes", "SOLID Citadel", "-q", "stdin")).stdout);
      expect(nodeList.nodes).toHaveLength(1);
      const node = JSON.parse((await run("node", "SOLID Citadel", "Brand New Node")).stdout);
      expect(node.title).toBe("Brand New Node");

      const events = JSON.parse((await run("events", "--palace", "SOLID Citadel")).stdout);
      expect(events.events.length).toBeGreaterThan(0);
      const sources = new Set(
        events.events.map((e: { payloadJson: string }) => JSON.parse(e.payloadJson).source),
      );
      expect(sources).toEqual(new Set(["cli"]));
    });

    it("refuses to import or apply a document with errors unless forced", async () => {
      const bad = file("bad.dsl", "@Broken\n\nA\n\nA\n");
      const refused = await run("import", bad);
      expect(refused.code).toBe(1);
      expect(refused.stdout).toBe("");
      expect(refused.stderr).toContain(`${bad}:5: error E002`);
      expect(refused.stderr).toContain("palace: DSL has errors");
      expect(JSON.parse((await run("list")).stdout).palaces).toHaveLength(0);

      const asJson = await run("import", bad, "--json");
      expect(asJson.code).toBe(1);
      expect(JSON.parse(asJson.stdout).created).toBe(false);

      const target = JSON.parse((await run("create", "Target")).stdout);
      expect((await run("apply", target.id, bad)).code).toBe(1);
      const forced = await run("apply", target.id, bad, "--force");
      expect(forced.code).toBe(0);
      expect(JSON.parse(forced.stdout).applied).toBe(true);
    });

    it("create → update → delete → restore", async () => {
      const created = JSON.parse((await run("create", "Temp")).stdout);
      expect((await run("update", created.id)).code).toBe(2);
      const updated = JSON.parse(
        (await run("update", created.id, "--name", "Renamed", "--alias", "rn")).stdout,
      );
      expect(updated).toMatchObject({ name: "Renamed", alias: "rn" });
      const cleared = JSON.parse((await run("update", "rn", "--alias", "")).stdout);
      expect(cleared.alias).toBeUndefined();

      expect(JSON.parse((await run("delete", "Renamed")).stdout).deleted).toBe(true);
      const trash = JSON.parse((await run("list", "--trashed")).stdout);
      expect(trash.palaces).toHaveLength(0);
      expect(trash.trashed).toHaveLength(1);
      expect(JSON.parse((await run("restore", "Renamed")).stdout).restored).toBe(true);
      expect(JSON.parse((await run("list")).stdout).palaces).toHaveLength(1);
    });

    it("reports tool errors on stderr with exit 1", async () => {
      const out = await run("get", "nope");
      expect(out.code).toBe(1);
      expect(out.stdout).toBe("");
      expect(out.stderr).toMatch(/^palace: /);
      expect((await run("events", "--limit", "0")).code).toBe(2);
    });
  });

  describe("meter backfill", () => {
    it("mirrors the palace's analytics into the given data dir and reports what it skipped", async () => {
      // import records palace_created (mapped) and the apply's palace_saved (no mapping).
      await run("import", file("citadel.dsl", citadel()));
      const dataDir = join(dir, "meter-data");
      const out = await run("meter", "backfill", "--data-dir", dataDir, "--json");
      expect(out.code).toBe(0);
      const summary = JSON.parse(out.stdout);
      expect(summary).toMatchObject({
        dataDir,
        dataDirVia: "flag",
        dryRun: false,
        appendedByMetric: { "palace.created": 1 },
        skippedByType: { palace_saved: 1 },
      });
      const lines = readFileSync(join(dataDir, "events.jsonl"), "utf8").trimEnd().split("\n");
      expect(lines).toHaveLength(1);
      expect(JSON.parse(lines[0]!)).toMatchObject({
        layer: "encoding",
        operation: "encode",
        metric_type: "palace.created",
        context: { source: "memory-palace-lab", topic: "SOLID Citadel" },
      });

      const again = await run("meter", "backfill", "--data-dir", dataDir, "--palace", "SOLID Citadel");
      expect(again.code).toBe(0);
      expect(again.stdout).toContain("appended:         0");
      expect(again.stdout).toContain("already present:  1");
      expect(again.stdout).toContain("(--data-dir)");
    });
  });

  it("covers every MCP tool with a verb or an explicit exclusion", () => {
    const source = readFileSync(resolve(__dirname, "../index.ts"), "utf8");
    const mcpTools = [...source.matchAll(/registerTool\(\s*"([a-z_]+)"/g)].map((m) => m[1]!);
    expect(mcpTools.length).toBeGreaterThan(20);

    const covered = VERBS.flatMap((v) => v.mcpTools);
    const excluded = MCP_TOOLS_WITHOUT_CLI_VERB;
    expect(covered.filter((t) => excluded.includes(t))).toEqual([]);
    expect(mcpTools.filter((t) => !covered.includes(t) && !excluded.includes(t))).toEqual([]);
    expect([...covered, ...excluded].filter((t) => !mcpTools.includes(t))).toEqual([]);
  });
});
