# Command line: `palace`

`palace` is a shell surface over the same domain tool functions the [MCP server](mcp.md) exposes (`mcp-server/src/tools/*`). Both are thin transports: the CLI parses arguments, calls the tool function, and prints the result. Writes go through the same transaction, row re-derivation, analytics, and live-refresh sentinel as MCP edits, tagged `source: "cli"` in the analytics payload.

**Which to use.** For interactive encoding sessions inside Claude Code, prefer the MCP server: typed schemas with inline CAST guidance, `palace://` resources, and prompts. Use the CLI where MCP is out of reach or too chatty: hooks, pre-commit and CI, other repositories, cron, batch work over many files or palaces, and any agent that has a shell but no MCP client.

## Running

```bash
npm run palace -- <command> [args]     # inside the repo
bin/palace <command> [args]            # from any directory (bash wrapper; alias it or add bin/ to PATH)
npx tsx mcp-server/src/cli/main.ts …   # what both of the above run
```

Requirements match the MCP server: Node ≥ 23.4 (built-in `node:sqlite`) and `npm install` done once. The database rule is the same too: the desktop app's own database must already exist, unless you point at another file with `--db PATH` or `MEMORY_PALACE_DB`, which is created with the schema if missing. The `lint`, `fmt`, `hash`, and `cast` commands never open a database.

Global options may go before or after the command:

| Option | Meaning |
| --- | --- |
| `--db PATH` | SQLite file to use (default: the desktop app's, or `$MEMORY_PALACE_DB`) |
| `--json` | JSON output where text is the default (`export`, `lint`, `hash`, `cast …`) |
| `-h`, `--help` | Global or per-command help |
| `--version` | Print the app version |

## Commands

Palace references accept an id, exact name, or alias, exactly like the MCP tools.

### Palace (needs the database)

| Command | Does | MCP equivalent |
| --- | --- | --- |
| `list [--trashed]` | List palaces, optionally with the 30-day trash | `palace_list` |
| `get <palace>` | Metadata, counts, route names | `palace_get` |
| `create <name> [--atlas PATH]` | New empty palace | `palace_create` |
| `update <palace> [--name N] [--alias A] [--atlas P]` | Rename or re-file; empty string clears | `palace_update_meta` |
| `delete <palace>` / `restore <palace>` | Soft-delete, restore from trash | `palace_delete`, `palace_restore` |
| `export <palace> [--json] [--out FILE]` | Palace DSL text, or the JSON bundle | `palace_export_dsl`, `palace_export_json` |
| `import <file\|-> [--atlas PATH]` | New palace from a DSL document (name from `@header`) | `palace_import_dsl` |
| `apply <palace> <file\|-> [--force]` | Diff-apply DSL to an existing palace | `palace_apply_dsl` |
| `nodes <palace> [--query TEXT]` / `node <palace> <ref>` | List or inspect nodes | `node_list`, `node_get` |
| `edges <palace>` / `routes <palace>` | List CAST edges, routes with loci | `edge_list`, `route_list` |
| `analyze` / `crux` / `motifs` / `review <palace>` | Graph analysis, crux with nine-dive questions, motifs, review queue | `graph_*`, `review_queue` |
| `events [--palace P] [--type T] [--limit N]` | Analytics events, newest first | `analytics_list` |

### METER bridge (needs the database)

| Command | Does |
| --- | --- |
| `meter backfill [--data-dir DIR] [--palace REF] [--dry-run] [--json]` | Mirror the app's analytics rows into METER's append-only `events.jsonl` (backlog item 10). Chronological, idempotent, never rewrites a line. |

The log location follows the same precedence as the `meter` CLI in Neural-OS-Research: `--data-dir`, then `$METER_DATA_DIR`, then `<project root>/meter-data` where the project root is the first ancestor of the current directory containing `wiki/` or `.git/`, then `~/.neural-os/meter`. Run it from the wiki checkout, or set the variable, so events land in the wiki's `meter-data/`; the summary prints which rule chose the path.

Idempotency comes from deterministic ids: the primary METER event reuses the app event's id and the latency event derives its id from it, so a second run appends nothing. Each run reports what was appended, what was already present, and which app event types have no mapping.

**Live bridge.** The desktop app can mirror events as they happen (Settings › METER bridge). It is on automatically when the app was launched with `METER_DATA_DIR` set, or when a data directory is typed in Settings; otherwise it stays off so the app never creates `~/.neural-os/meter` on its own. The live bridge and `backfill` share the mapping in `src/domain/services/meterBridge.ts` and the same ids, so they never duplicate each other: a row the live bridge could not append (the first failure is shown once in the app) stays in the app's database and the next `backfill` picks it up. Events written by the MCP server or the CLI itself are not mirrored live; `backfill` covers them.

Mapping (everything else is skipped and counted, on purpose: METER wants signal, not a UI trace):

| App event | layer / operation | metric_type | metric_value | artifact_id | mode |
| --- | --- | --- | --- | --- | --- |
| `walk_recall_rated` | performance / review | `hit` (Hard, Good, Easy) or `miss` (Again), plus a separate `latency_ms` event when the reveal time is known | 1 / 0, ms | node | `palace::walk` |
| `walk_started`, `walk_completed` | performance / review | `walk.started`, `walk.completed` | route length, reviewed count | route | `palace::walk` |
| `palace_created`, `node_created`, `edge_created`, `route_created`, `system_run_materialized` | encoding / encode | `palace.<event>` | 1 | palace, node, node, route, palace | null |

Conventions mirror the Anki bridge so METER's reports need no changes: `hit`/`miss` feed the Daily Glance hit rate, `latency_ms` events feed its latency line, `mode` gives palace walks their own row in the per-mode breakdown, and `context.topic` is the palace name for the per-topic roll-up. `context` also carries `source`, the app event id and type, palace and route ids, and the app's full payload.

### DSL files (no database)

| Command | Does |
| --- | --- |
| `lint <file\|->… [--strict] [--json]` | Parse and print diagnostics as `file:line:col: severity CODE message`. Exit 1 on errors; `--strict` fails on warnings too. |
| `fmt <file\|->… [--check \| --write]` | Rewrite in the canonical serializer form (the same form `export` emits). Prints to stdout, checks, or writes in place. |
| `hash <file\|->… [--json]` | Canonical SHA-256 of the document's logical content: stable across whitespace, node order, and tag order. |

`fmt` refuses a document rather than silently dropping content when it uses constructs the canonical serializer does not emit yet: `~alias` declarations, `!import`, `?queries`, `[id]` node identifiers, route `#metadata`, `--` comments, or edges and loci to unknown targets. Fix or remove those first, or leave the file as it is.

### CAST lexicon

| Command | Does |
| --- | --- |
| `cast decode <token> [--json]` | Explain a token in any notation: compact `1231`, theSystem's eight bits `00 01 10 00` or `00011000`, or named `who:Giant how:Flowing`. Prints the scene sentence and each axis with its bits, gloss, and "use when" hint. |
| `cast encode [--who W] [--how H] [--what T] [--when N] [--json]` | Build a token from English labels (case-insensitive); unset axes stay `0`. |
| `cast table [--json]` | The full lexicon, four axes by four rows, with bits and bilingual glosses. |

## Exit codes and output

| Code | Meaning |
| --- | --- |
| 0 | Done |
| 1 | The operation failed or was refused (tool error, lint errors, import/apply with DSL errors, `fmt --check` differences) |
| 2 | Usage error (unknown command or option, wrong argument count) |

Structured results print as pretty JSON on stdout. `export` and `fmt` print DSL text. Diagnostics and refusal reasons go to stderr, so stdout stays pipeable. Pass `-` as a file to read stdin.

## Examples

```bash
# Lint every palace file before committing (pre-commit, CI, or a Claude Code PostToolUse hook)
bin/palace lint --strict palaces/*.dsl

# Keep palaces in git: export, then detect logical (not textual) change
bin/palace export "SOLID Citadel" --out palaces/solid-citadel.dsl
bin/palace hash palaces/*.dsl

# Round-trip an edit: export, edit the text, apply the diff back
bin/palace export "SOLID Citadel" > /tmp/solid.dsl && $EDITOR /tmp/solid.dsl
bin/palace apply "SOLID Citadel" /tmp/solid.dsl

# Any script that emits Palace DSL can pipe straight in
some-generator | bin/palace import -

# Put palace walks and encoding work into METER's Daily Glance beside Anki reviews
cd ~/code/Neural-OS-Research && ~/code/memory-palace-lab/bin/palace meter backfill --dry-run
cd ~/code/Neural-OS-Research && ~/code/memory-palace-lab/bin/palace meter backfill

# Translate between theSystem's bit notation and the app's compact token
bin/palace cast decode "10 11 10 00"
bin/palace cast encode --who Mage --how Exploding --what Cloud --when "Red cave"

# Batch analysis across every palace, one shell loop instead of one tool call each
bin/palace list | jq -r '.palaces[].id' | while read id; do bin/palace crux "$id"; done
```

The running desktop app live-refreshes after CLI writes exactly as it does after MCP writes (same sentinel file; see [mcp.md](mcp.md#live-refresh-in-the-running-app)).

The Neural OS wiki repository already runs `lint` from both of its hook surfaces (`.claude/palace-lint-hook.py` there): as a Claude Code PostToolUse hook on every edited `.dsl`/`.palace` file, and as a pre-commit gate on staged ones. That script finds this repo through `$MEMORY_PALACE_LAB` or the sibling checkout `../memory-palace-lab` and skips silently when neither exists, so moving this checkout means setting that variable, not breaking the wiki.

## Not exposed as CLI verbs

Fine-grained canvas mutations stay MCP-only for now: `node_create`, `node_update`, `node_delete`, `edge_create`, `edge_update`, `edge_delete`, `route_create`, `route_update`, `route_delete`, `locus_add`, `locus_remove`, `locus_reorder`. From the shell, make those edits in bulk with `apply` and a DSL file. The list lives in `MCP_TOOLS_WITHOUT_CLI_VERB` (`mcp-server/src/cli/commands.ts`); a test asserts that every tool registered in the MCP server is either a CLI verb or on that list, so the two surfaces cannot drift silently.

## Layout

| File | Role |
| --- | --- |
| `mcp-server/src/cli/main.ts` | Entry point: opens the database lazily, flushes output, exits explicitly |
| `mcp-server/src/cli/commands.ts` | Verb registry, argument parsing (`node:util` `parseArgs`), dispatch, help |
| `mcp-server/src/cli/dslVerbs.ts` | `lint` / `fmt` / `hash` over the parser, serializer, and normalize pass |
| `mcp-server/src/cli/cast.ts` | CAST notation conversion and lexicon rendering |
| `mcp-server/src/cli/meterVerbs.ts` | METER backfill: data-dir resolution and idempotent append over the shared mapping |
| `src/domain/services/meterBridge.ts` | METER mapping shared by the CLI backfill and the app's live bridge (`src/infrastructure/meterBridge.ts`) |
| `mcp-server/src/cli/cli.test.ts` | In-process tests, including the MCP parity check |
| `bin/palace` | Bash wrapper for use outside the repo |
