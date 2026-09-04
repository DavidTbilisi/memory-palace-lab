# MCP Support

Memory Palace Lab ships two MCP (Model Context Protocol) servers, both registered in the project-scoped [.mcp.json](../.mcp.json) so Claude Code picks them up automatically when working in this repo.

| Server | Purpose | Works without the app running? |
| --- | --- | --- |
| `memory-palace` | Domain server: palaces, nodes, CAST edges, routes, graph analysis, DSL, review queue | Yes |
| `tauri-debug-bridge` | Dev tooling: drive/debug the running Tauri app (screenshots, DOM, IPC) | No — needs a **debug** build running |

The domain tools also have a shell surface, the `palace` CLI, for hooks, CI, other repositories, and batch work — see [cli.md](cli.md). Same functions, same database rules, same live refresh; analytics payloads say which surface wrote (`source: "mcp"` or `"cli"`).

---

## memory-palace (domain server)

A standalone stdio server (`mcp-server/`) that reads and writes the same SQLite database as the desktop app and reuses the app's own domain logic (graph analysis, DSL parser/serializer, shape factories) imported directly from `src/`.

### Running

Registered via `.mcp.json` (`npx tsx mcp-server/src/index.ts`); or run manually:

```bash
npm run mcp          # start the server (stdio)
npm run test:mcp     # unit/integration tests
node mcp-server/smoke.mjs   # end-to-end stdio smoke test against a temp DB
```

Requirements:

- Node ≥ 23.4 (uses the built-in `node:sqlite`; the repo currently runs Node 25).
- The app's database must exist — run the desktop app once (`npm run tauri dev`), or point the `MEMORY_PALACE_DB` env var at a sqlite3 file (it will be created with the right schema if missing).

The DB lives at the Tauri app-data dir for identifier `com.memorypalace.lab`:

- Windows: `%APPDATA%\com.memorypalace.lab\memory_palace_lab.sqlite3`
- macOS: `~/Library/Application Support/com.memorypalace.lab/memory_palace_lab.sqlite3`
- Linux: `~/.local/share/com.memorypalace.lab/memory_palace_lab.sqlite3`

### Tools

Palace references accept an id, exact name, or alias. Node/route references accept id or title/name.

- **Palaces** — `palace_list`, `palace_get`, `palace_create`, `palace_update_meta`, `palace_delete` (soft, 30-day trash), `palace_restore`, `palace_export_dsl`, `palace_export_json`
- **Nodes** — `node_list`, `node_get`, `node_create`, `node_update`, `node_delete`
- **Edges** — `edge_list`, `edge_create`, `edge_update`, `edge_delete` (CAST values are the canonical English labels: who=Giant/Mermaid/Mage/Dragon, how=Crushing/Flowing/Spreading/Exploding, what=Rock/Water/Cloud/Lightning, when=Red cave/Blue ocean/Green sky/Purple storm)
- **Routes & loci** — `route_list`, `route_create`, `route_update`, `route_delete`, `locus_add`, `locus_remove`, `locus_reorder`
- **DSL** — `palace_apply_dsl` (diff-based apply to an existing palace), `palace_import_dsl` (new palace from a DSL document)
- **Analysis** — `graph_analyze`, `graph_crux`, `graph_motifs`, `review_queue`, `analytics_list`

### Linking node content to source notes (Obsidian)

Node content is stored as HTML, and the inspector renders anchors as clickable links (Ctrl+click to open; `obsidian://` opens the note in Obsidian, scoped in `src-tauri/capabilities/default.json`). The convention for palaces encoded from wiki notes is a final sources paragraph:

```html
<p>📖 <a href="obsidian://open?vault=Neural%20OS&file=wiki/wealth-money/rich-dad-poor-dad">rich-dad-poor-dad</a> · <a href="...">second-note</a></p>
```

- URL-encode spaces in the vault name (`Neural%20OS`); the `file` path is vault-relative without the `.md` extension.
- Works from `node_create`/`node_update` content, from DSL body lines (`: <p>📖 <a ...>` passes through verbatim), or hand-edited in the inspector.
- Walk mode and search strip the HTML, so links never pollute recall prompts.

When encoding a palace from wiki/knowledge-base material, always add source links — they make every node a two-way bridge between the palace and the note it came from.

### Resources

- `spec://palace-dsl` — the Palace DSL specification ([docs/palace-dsl.md](palace-dsl.md))
- `palace://{palaceId}/dsl` — any palace serialized as DSL text (listable)
- `thesystem://{slug}` — the memory-science docs from `theSystem/` (cast-system, comprehension-protocol, …)

### Prompts

- `nine-dive-drill(palace, node?)` — interrogate one node (default: the crux) with the content/process/premise drill
- `comprehension-protocol(palace)` — run the five-gate protocol against a palace
- `encoding-assistant(topic, palace?)` — design nodes/CAST edges/routes for a topic, then build them via the write tools

### How writes work (and why they're safe)

The canvas source of truth is the tldraw snapshot blob in `palaces.editor_snapshot`; the `nodes`/`edges` tables are a derived projection. Every MCP mutation therefore:

1. opens an immediate SQLite transaction (5s busy timeout),
2. mutates the blob through a headless editor adapter using the **app's own shape factories** (`src/canvas/createMemoryShapes.ts`) and DSL sync (`src/domain/services/palaceDsl/sync.ts`),
3. re-derives the row projection exactly like the app's save does,
4. appends analytics events (session-tagged, payload `source: "mcp"`, or `"cli"` when written by the [CLI](cli.md)),
5. commits and writes a sentinel file (`mcp-sync.json` next to the DB).

### Live refresh in the running app

The app watches the sentinel file (`src/app/useExternalMcpSync.ts`):

- Palace list refreshes on any external change.
- If the **open** palace was changed and you have no unsaved work, it reloads in place.
- If you *do* have unsaved work, a banner offers **Reload (discard my changes)** vs **Keep mine**. Keeping yours means your next save overwrites the external edit — last write wins. MCP edits are auditable via `analytics_list` (payload `source: "mcp"`).

---

## tauri-debug-bridge (dev tooling)

The [`tauri-plugin-mcp-bridge`](https://github.com/hypothesi/mcp-server-tauri) plugin is initialized in **debug builds only** (`src-tauri/src/lib.rs`, behind `cfg!(debug_assertions)`); release builds never expose it. While `npm run tauri dev` is running, the plugin listens on a local WebSocket (port 9223+) and the companion `@hypothesi/tauri-mcp-server` (registered in `.mcp.json`) bridges it to MCP.

It provides generic app-driving tools: window management, webview screenshots, DOM queries, simulated input, log reading, and `ipc_execute_command` (invoke any Tauri command). Useful for UI debugging and end-to-end verification; not for palace content work — use the domain server for that.

**Security note:** the bridge can execute arbitrary IPC against the app. It is deliberately compiled out of release builds — keep it that way.
