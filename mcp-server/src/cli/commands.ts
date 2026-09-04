import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs, type ParseArgsConfig } from "node:util";
import { parseDsl } from "../../../src/domain/services/palaceDsl/parser";
import { setWriterSource } from "../palaceWriter";
import * as analysis from "../tools/analysis";
import * as dslTools from "../tools/dsl";
import * as edges from "../tools/edges";
import * as nodes from "../tools/nodes";
import * as palaces from "../tools/palaces";
import * as routes from "../tools/routes";
import type { ServerContext } from "../tools/shared";
import {
  castFromLabels,
  castTable,
  describeCast,
  parseCastInput,
  renderCastTable,
  renderCastText,
} from "./cast";
import {
  errorsOf,
  formatDiagnosticLine,
  formatSource,
  hashSource,
  lintSource,
  unformattableConstructs,
} from "./dslVerbs";

/**
 * The `palace` command line: a second thin transport over the same tool
 * functions the MCP server exposes (mcp-server/src/tools/*). Verbs that need
 * the database open it lazily; `lint`, `fmt`, `hash` and `cast` never do.
 */

export const PROGRAM = "palace";

export interface CliDeps {
  /** Open the app database. Called at most once per run, and only by verbs that need it. */
  openContext: (dbOverride?: string) => ServerContext;
  readStdin: () => Promise<string>;
  version: string;
}

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

type OptionValues = Record<string, string | boolean | undefined>;
type Options = NonNullable<ParseArgsConfig["options"]>;

interface VerbInput {
  positionals: string[];
  values: OptionValues;
  json: boolean;
  ctx: () => ServerContext;
  readStdin: () => Promise<string>;
}

interface VerbOutput {
  stdout?: string;
  stderr?: string;
  code?: number;
}

export interface Verb {
  name: string;
  group: "palace" | "dsl" | "cast";
  summary: string;
  usage: string;
  options?: Options;
  /** Inclusive positional count bounds; use Infinity for variadic. */
  arity: [number, number];
  /** MCP tools this verb covers (parity-checked in cli.test.ts). */
  mcpTools: string[];
  run: (input: VerbInput) => VerbOutput | Promise<VerbOutput>;
}

/**
 * MCP tools deliberately without a CLI verb. Fine-grained canvas edits belong
 * to the interactive MCP surface; the CLI does bulk edits through `apply`.
 * Adding a tool to the MCP server without deciding its CLI fate fails the
 * parity test.
 */
export const MCP_TOOLS_WITHOUT_CLI_VERB = [
  "node_create",
  "node_update",
  "node_delete",
  "edge_create",
  "edge_update",
  "edge_delete",
  "route_create",
  "route_update",
  "route_delete",
  "locus_add",
  "locus_remove",
  "locus_reorder",
];

const GLOBAL_OPTIONS: Options = {
  db: { type: "string" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" },
};

// ── helpers ──────────────────────────────────────────────────────────

function json(value: unknown, code = 0, stderr = ""): VerbOutput {
  return { stdout: `${JSON.stringify(value, null, 2)}\n`, stderr, code };
}

function text(value: string): VerbOutput {
  return { stdout: value.endsWith("\n") ? value : `${value}\n` };
}

function str(value: string | boolean | undefined): string | undefined {
  return value === undefined ? undefined : String(value);
}

function usageError(message: string): VerbOutput {
  return { stderr: `${PROGRAM}: ${message}\n`, code: 2 };
}

function label(ref: string): string {
  return ref === "-" ? "<stdin>" : ref;
}

async function readDocument(ref: string, readStdin: () => Promise<string>): Promise<string> {
  return ref === "-" ? readStdin() : readFileSync(ref, "utf8");
}

type ToolDiagnostic = { code: string; severity: string; line: number; message: string };

/** Render an import/apply result: JSON when it went through, diagnostics + exit 1 when refused. */
function outcome(
  result: { reason?: string; diagnostics?: ToolDiagnostic[] },
  ok: boolean,
  file: string,
  asJson: boolean,
): VerbOutput {
  if (ok) return json(result);
  if (asJson) return json(result, 1);
  const lines = (result.diagnostics ?? []).map(
    (d) => `${file}:${d.line}: ${d.severity} ${d.code} ${d.message}`,
  );
  lines.push(`${PROGRAM}: ${result.reason ?? "refused"}`);
  return { stderr: `${lines.join("\n")}\n`, code: 1 };
}

const palaceArg = "<palace>  (id, exact name, or alias)";

// ── verbs ────────────────────────────────────────────────────────────

export const VERBS: Verb[] = [
  // Palace (database)
  {
    name: "list",
    group: "palace",
    summary: "List palaces; --trashed adds the 30-day trash.",
    usage: "list [--trashed]",
    options: { trashed: { type: "boolean" } },
    arity: [0, 0],
    mcpTools: ["palace_list"],
    run: ({ ctx, values }) =>
      json(palaces.palaceList(ctx(), { includeTrashed: Boolean(values.trashed) })),
  },
  {
    name: "get",
    group: "palace",
    summary: "Palace metadata, counts, and route names.",
    usage: `get ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["palace_get"],
    run: ({ ctx, positionals: [palace] }) => json(palaces.palaceGet(ctx(), { palace: palace! })),
  },
  {
    name: "create",
    group: "palace",
    summary: "Create an empty palace.",
    usage: "create <name> [--atlas /domain/place]",
    options: { atlas: { type: "string" } },
    arity: [1, 1],
    mcpTools: ["palace_create"],
    run: ({ ctx, positionals: [name], values }) =>
      json(palaces.palaceCreate(ctx(), { name: name!, atlasPath: str(values.atlas) })),
  },
  {
    name: "update",
    group: "palace",
    summary: "Rename a palace or change its alias / atlas path (empty string clears).",
    usage: `update ${palaceArg} [--name NAME] [--alias ALIAS] [--atlas PATH]`,
    options: { name: { type: "string" }, alias: { type: "string" }, atlas: { type: "string" } },
    arity: [1, 1],
    mcpTools: ["palace_update_meta"],
    run: async ({ ctx, positionals: [palace], values }) => {
      if (values.name === undefined && values.alias === undefined && values.atlas === undefined) {
        return usageError("update: pass at least one of --name, --alias, --atlas");
      }
      return json(
        await palaces.palaceUpdateMeta(ctx(), {
          palace: palace!,
          name: str(values.name),
          alias: str(values.alias),
          atlasPath: str(values.atlas),
        }),
      );
    },
  },
  {
    name: "delete",
    group: "palace",
    summary: "Soft-delete a palace (restorable for 30 days).",
    usage: `delete ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["palace_delete"],
    run: ({ ctx, positionals: [palace] }) => json(palaces.palaceDelete(ctx(), { palace: palace! })),
  },
  {
    name: "restore",
    group: "palace",
    summary: "Restore a soft-deleted palace from the trash.",
    usage: "restore <trashed palace id or name>",
    arity: [1, 1],
    mcpTools: ["palace_restore"],
    run: ({ ctx, positionals: [palace] }) =>
      json(palaces.palaceRestore(ctx(), { palace: palace! })),
  },
  {
    name: "export",
    group: "palace",
    summary: "Export a palace as Palace DSL text (or the JSON bundle with --json).",
    usage: `export ${palaceArg} [--json] [--out FILE]`,
    options: { out: { type: "string", short: "o" } },
    arity: [1, 1],
    mcpTools: ["palace_export_dsl", "palace_export_json"],
    run: ({ ctx, positionals: [palace], values, json: asJson }) => {
      const body = asJson
        ? `${JSON.stringify(palaces.palaceExportJson(ctx(), { palace: palace! }), null, 2)}\n`
        : palaces.palaceExportDsl(ctx(), { palace: palace! }).dsl;
      if (values.out) {
        writeFileSync(String(values.out), body, "utf8");
        return { stderr: `wrote ${values.out}\n` };
      }
      return { stdout: body };
    },
  },
  {
    name: "import",
    group: "palace",
    summary: "Create a new palace from a DSL file (name from its @header).",
    usage: "import <file|-> [--atlas PATH]",
    options: { atlas: { type: "string" } },
    arity: [1, 1],
    mcpTools: ["palace_import_dsl"],
    run: async ({ ctx, positionals: [file], values, json: asJson, readStdin }) => {
      const dsl = await readDocument(file!, readStdin);
      const result = await dslTools.palaceImportDsl(ctx(), { dsl, atlasPath: str(values.atlas) });
      return outcome(result, result.created, label(file!), asJson);
    },
  },
  {
    name: "apply",
    group: "palace",
    summary: "Diff-apply a DSL file to an existing palace (adds, updates, deletes to match).",
    usage: `apply ${palaceArg} <file|-> [--force]`,
    options: { force: { type: "boolean" } },
    arity: [2, 2],
    mcpTools: ["palace_apply_dsl"],
    run: async ({ ctx, positionals: [palace, file], values, json: asJson, readStdin }) => {
      const dsl = await readDocument(file!, readStdin);
      const result = await dslTools.palaceApplyDsl(ctx(), {
        palace: palace!,
        dsl,
        force: Boolean(values.force),
      });
      return outcome(result, result.applied, label(file!), asJson);
    },
  },
  {
    name: "nodes",
    group: "palace",
    summary: "List nodes, optionally filtered by a search over title/content/tags.",
    usage: `nodes ${palaceArg} [--query TEXT]`,
    options: { query: { type: "string", short: "q" } },
    arity: [1, 1],
    mcpTools: ["node_list"],
    run: ({ ctx, positionals: [palace], values }) =>
      json(nodes.nodeList(ctx(), { palace: palace!, query: str(values.query) })),
  },
  {
    name: "node",
    group: "palace",
    summary: "One node with content, in/out edges, and route memberships.",
    usage: `node ${palaceArg} <node id, title, or alias>`,
    arity: [2, 2],
    mcpTools: ["node_get"],
    run: ({ ctx, positionals: [palace, node] }) =>
      json(nodes.nodeGet(ctx(), { palace: palace!, node: node! })),
  },
  {
    name: "edges",
    group: "palace",
    summary: "List CAST edges.",
    usage: `edges ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["edge_list"],
    run: ({ ctx, positionals: [palace] }) => json(edges.edgeList(ctx(), { palace: palace! })),
  },
  {
    name: "routes",
    group: "palace",
    summary: "List routes with ordered loci and review schedule state.",
    usage: `routes ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["route_list"],
    run: ({ ctx, positionals: [palace] }) => json(routes.routeList(ctx(), { palace: palace! })),
  },
  {
    name: "analyze",
    group: "palace",
    summary: "Graph structure: betweenness, degree, bridges, cycles, roles.",
    usage: `analyze ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["graph_analyze"],
    run: ({ ctx, positionals: [palace] }) =>
      json(analysis.graphAnalyze(ctx(), { palace: palace! })),
  },
  {
    name: "crux",
    group: "palace",
    summary: "The node that most gates the graph, with nine-dive drill questions.",
    usage: `crux ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["graph_crux"],
    run: ({ ctx, positionals: [palace] }) => json(analysis.graphCrux(ctx(), { palace: palace! })),
  },
  {
    name: "motifs",
    group: "palace",
    summary: "Structural motifs (cascade, diamond, hub-spoke, loop, bottleneck, bipartite).",
    usage: `motifs ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["graph_motifs"],
    run: ({ ctx, positionals: [palace] }) =>
      json(analysis.graphMotifs(ctx(), { palace: palace! })),
  },
  {
    name: "review",
    group: "palace",
    summary: "Spaced-repetition review queue (overdue / due / fresh).",
    usage: `review ${palaceArg}`,
    arity: [1, 1],
    mcpTools: ["review_queue"],
    run: ({ ctx, positionals: [palace] }) =>
      json(analysis.reviewQueue(ctx(), { palace: palace! })),
  },
  {
    name: "events",
    group: "palace",
    summary: "Analytics events, newest first (payload.source says who wrote: app, mcp, cli).",
    usage: "events [--palace REF] [--type EVENT_TYPE] [--limit N]",
    options: { palace: { type: "string" }, type: { type: "string" }, limit: { type: "string" } },
    arity: [0, 0],
    mcpTools: ["analytics_list"],
    run: ({ ctx, values }) => {
      const limit = values.limit === undefined ? undefined : Number(values.limit);
      if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
        return usageError("events: --limit must be a positive integer");
      }
      return json(
        analysis.analyticsList(ctx(), {
          palace: str(values.palace),
          eventType: str(values.type),
          limit,
        }),
      );
    },
  },

  // DSL files (no database)
  {
    name: "lint",
    group: "dsl",
    summary: "Parse DSL files and print diagnostics. Exit 1 on errors (--strict: warnings too).",
    usage: "lint <file|->... [--strict] [--json]",
    options: { strict: { type: "boolean" } },
    arity: [1, Infinity],
    mcpTools: [],
    run: async ({ positionals, values, json: asJson, readStdin }) => {
      const results = [];
      for (const ref of positionals) {
        results.push(lintSource(label(ref), await readDocument(ref, readStdin)));
      }
      const strict = Boolean(values.strict);
      const failed = results.some((r) => r.errors > 0 || (strict && r.warnings > 0));
      const code = failed ? 1 : 0;
      if (asJson) return json(results, code);
      const lines = results.flatMap((r) => r.diagnostics.map((d) => formatDiagnosticLine(r.file, d)));
      const errors = results.reduce((n, r) => n + r.errors, 0);
      const warnings = results.reduce((n, r) => n + r.warnings, 0);
      const summary =
        lines.length > 0
          ? `${errors} error(s), ${warnings} warning(s) in ${results.length} file(s)\n`
          : "";
      return { stdout: lines.length > 0 ? `${lines.join("\n")}\n` : "", stderr: summary, code };
    },
  },
  {
    name: "fmt",
    group: "dsl",
    summary: "Rewrite DSL in the canonical serializer form. Refuses constructs it cannot preserve.",
    usage: "fmt <file|->... [--check | --write]",
    options: { check: { type: "boolean" }, write: { type: "boolean", short: "w" } },
    arity: [1, Infinity],
    mcpTools: [],
    run: async ({ positionals, values, readStdin }) => {
      const check = Boolean(values.check);
      const write = Boolean(values.write);
      if (check && write) return usageError("fmt: --check and --write are mutually exclusive");
      if (!check && !write && positionals.length > 1) {
        return usageError("fmt: pass one file (or -) to print; use --check or --write for several");
      }
      if (write && positionals.includes("-")) return usageError("fmt: --write needs a file path, not -");
      let stdout = "";
      let stderr = "";
      let code = 0;
      for (const ref of positionals) {
        const source = await readDocument(ref, readStdin);
        const parsed = parseDsl(source);
        const errors = errorsOf(parsed);
        if (errors.length > 0) {
          stderr += `${errors.map((d) => formatDiagnosticLine(label(ref), d)).join("\n")}\n`;
          code = 1;
          continue;
        }
        const blockers = unformattableConstructs(source, parsed);
        if (blockers.length > 0) {
          stderr += `${PROGRAM}: fmt: refusing ${label(ref)}: the canonical form would drop ${blockers.join(", ")}\n`;
          code = 1;
          continue;
        }
        const formatted = formatSource(parsed);
        if (check) {
          if (formatted !== source) {
            stderr += `would reformat ${label(ref)}\n`;
            code = 1;
          }
        } else if (write) {
          if (formatted !== source) {
            writeFileSync(ref, formatted, "utf8");
            stderr += `formatted ${ref}\n`;
          }
        } else {
          stdout += formatted;
        }
      }
      return { stdout, stderr, code };
    },
  },
  {
    name: "hash",
    group: "dsl",
    summary: "Canonical SHA-256 of a DSL document (stable across whitespace, node and tag order).",
    usage: "hash <file|->... [--json]",
    arity: [1, Infinity],
    mcpTools: [],
    run: async ({ positionals, json: asJson, readStdin }) => {
      const rows: Array<{ file: string; canonicalHash: string }> = [];
      let stderr = "";
      let code = 0;
      for (const ref of positionals) {
        const parsed = parseDsl(await readDocument(ref, readStdin));
        const errors = errorsOf(parsed);
        if (errors.length > 0) {
          stderr += `${errors.map((d) => formatDiagnosticLine(label(ref), d)).join("\n")}\n`;
          code = 1;
          continue;
        }
        rows.push({ file: label(ref), canonicalHash: await hashSource(parsed) });
      }
      if (asJson) return json(rows, code, stderr);
      const lines = rows.map((r) => `${r.canonicalHash}  ${r.file}`);
      return { stdout: lines.length > 0 ? `${lines.join("\n")}\n` : "", stderr, code };
    },
  },

  // CAST lexicon
  {
    name: "cast decode",
    group: "cast",
    summary: "Explain a CAST token: compact (1231), eight bits (00 01 10 00), or who:Giant how:Flowing.",
    usage: "cast decode <token> [--json]",
    arity: [1, Infinity],
    mcpTools: [],
    run: ({ positionals, json: asJson }) => {
      const view = describeCast(parseCastInput(positionals.join(" ")));
      return asJson ? json(view) : text(renderCastText(view));
    },
  },
  {
    name: "cast encode",
    group: "cast",
    summary: "Build a CAST token from English labels; unset axes stay 0.",
    usage: 'cast encode [--who Giant] [--how Flowing] [--what Cloud] [--when "Red cave"] [--json]',
    options: {
      who: { type: "string" },
      how: { type: "string" },
      what: { type: "string" },
      when: { type: "string" },
    },
    arity: [0, 0],
    mcpTools: [],
    run: ({ values, json: asJson }) => {
      const view = describeCast(
        castFromLabels({
          who: str(values.who),
          how: str(values.how),
          what: str(values.what),
          when: str(values.when),
        }),
      );
      return asJson ? json(view) : text(renderCastText(view));
    },
  },
  {
    name: "cast table",
    group: "cast",
    summary: "The full CAST lexicon: four axes, four rows each, with bits and glosses.",
    usage: "cast table [--json]",
    arity: [0, 0],
    mcpTools: [],
    run: ({ json: asJson }) => (asJson ? json(castTable()) : text(renderCastTable())),
  },
];

// ── dispatch ─────────────────────────────────────────────────────────

const GROUP_TITLES: Array<[Verb["group"], string]> = [
  ["palace", "Palace (needs the app database)"],
  ["dsl", "DSL files (no database needed)"],
  ["cast", "CAST lexicon"],
];

export function globalHelp(version: string): string {
  const width = Math.max(...VERBS.map((v) => v.name.length)) + 2;
  const lines = [
    `${PROGRAM} ${version}: Memory Palace Lab command line`,
    "",
    `Usage: ${PROGRAM} <command> [arguments] [options]`,
  ];
  for (const [group, title] of GROUP_TITLES) {
    lines.push("", `${title}:`);
    for (const verb of VERBS.filter((v) => v.group === group)) {
      lines.push(`  ${verb.name.padEnd(width)}${verb.summary}`);
    }
  }
  lines.push(
    "",
    "Global options:",
    "  --db PATH     SQLite database (default: the desktop app's, or $MEMORY_PALACE_DB)",
    "  --json        JSON output where text is the default",
    "  -h, --help    Help for a command",
    "",
    `Run "${PROGRAM} <command> --help" for the command's arguments.`,
  );
  return `${lines.join("\n")}\n`;
}

function verbHelp(verb: Verb): string {
  const lines = [`Usage: ${PROGRAM} ${verb.usage}`, "", verb.summary];
  if (verb.mcpTools.length > 0) lines.push("", `MCP equivalent: ${verb.mcpTools.join(", ")}`);
  return `${lines.join("\n")}\n`;
}

function findVerb(name: string): Verb | undefined {
  return VERBS.find((v) => v.name === name);
}

/** Global options may precede the command (`palace --db x list`); peel them off so the verb is found. */
function splitLeadingGlobals(argv: string[]): { leading: string[]; args: string[] } {
  const leading: string[] = [];
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i]!;
    if (arg === "--json" || arg.startsWith("--db=")) {
      leading.push(arg);
      i += 1;
    } else if (arg === "--db") {
      leading.push(arg);
      if (i + 1 < argv.length) leading.push(argv[i + 1]!);
      i += 2;
    } else {
      break;
    }
  }
  return { leading, args: argv.slice(i) };
}

export async function runCli(argv: string[], deps: CliDeps): Promise<CliResult> {
  setWriterSource("cli");
  const { leading, args } = splitLeadingGlobals(argv);
  const [first, second] = args;
  if (!first || first === "-h" || first === "--help" || first === "help") {
    return { code: 0, stdout: globalHelp(deps.version), stderr: "" };
  }
  if (first === "--version" || first === "-V") {
    return { code: 0, stdout: `${PROGRAM} ${deps.version}\n`, stderr: "" };
  }

  let verb = second === undefined ? undefined : findVerb(`${first} ${second}`);
  let rest = [...leading, ...args.slice(2)];
  if (!verb) {
    verb = findVerb(first);
    rest = [...leading, ...args.slice(1)];
  }
  if (!verb) {
    const subverbs = VERBS.filter((v) => v.name.startsWith(`${first} `)).map((v) => v.name);
    const hint =
      subverbs.length > 0
        ? `Did you mean: ${subverbs.join(", ")}?`
        : `Run "${PROGRAM} --help" for the command list.`;
    return {
      code: 2,
      stdout: "",
      stderr: `${PROGRAM}: unknown command "${args.slice(0, second === undefined ? 1 : 2).join(" ")}". ${hint}\n`,
    };
  }

  let parsed: ReturnType<typeof parseArgs>;
  try {
    parsed = parseArgs({
      args: rest,
      options: { ...GLOBAL_OPTIONS, ...(verb.options ?? {}) },
      allowPositionals: true,
      strict: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: 2, stdout: "", stderr: `${PROGRAM}: ${message}\n${verbHelp(verb)}` };
  }
  if (parsed.values.help) return { code: 0, stdout: verbHelp(verb), stderr: "" };

  const [min, max] = verb.arity;
  const count = parsed.positionals.length;
  if (count < min || count > max) {
    const expected = min === max ? `${min}` : max === Infinity ? `at least ${min}` : `${min} to ${max}`;
    return {
      code: 2,
      stdout: "",
      stderr: `${PROGRAM}: ${verb.name}: expected ${expected} argument(s), got ${count}\n${verbHelp(verb)}`,
    };
  }

  const values = parsed.values as OptionValues;
  let ctx: ServerContext | undefined;
  const input: VerbInput = {
    positionals: parsed.positionals,
    values,
    json: Boolean(values.json),
    ctx: () => (ctx ??= deps.openContext(str(values.db))),
    readStdin: deps.readStdin,
  };
  try {
    const out = await verb.run(input);
    return { code: out.code ?? 0, stdout: out.stdout ?? "", stderr: out.stderr ?? "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: 1, stdout: "", stderr: `${PROGRAM}: ${message}\n` };
  } finally {
    ctx?.db.close();
  }
}
