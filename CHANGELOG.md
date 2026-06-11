# Changelog

## v0.7.0 — 2026-06-11

### MCP support (Model Context Protocol)

- **New `memory-palace` MCP server** (`mcp-server/`, run with `npm run mcp`): Claude and other MCP clients can now read, build, and analyze palaces directly.
  - 31 tools: palace/node/edge/route/locus CRUD, `palace_apply_dsl` / `palace_import_dsl`, `graph_analyze` / `graph_crux` / `graph_motifs`, `review_queue`, `analytics_list`, DSL/JSON export.
  - Resources: any palace as DSL (`palace://{id}/dsl`), the DSL spec, and all theSystem memory-science docs.
  - Prompts: `nine-dive-drill`, `comprehension-protocol`, `encoding-assistant`.
  - Writes go through the same canvas-snapshot semantics as the app itself (the row tables are re-derived from the tldraw blob), inside a single SQLite transaction.
- **Live refresh**: the running app watches for external MCP edits and reloads the open palace in place; a conflict banner protects unsaved work. A manual **Refresh** toolbar button uses the same path.
- Project-scoped `.mcp.json` registers both the domain server and the dev-only Tauri debug bridge. Docs in `docs/mcp.md`.

### App improvements

- Node content links are clickable (**Ctrl+click**) and open externally — including `obsidian://` links back to source notes.
- Persistence failures (save/open/create/reload) now show an error banner instead of failing silently; a failed save no longer pretends to be saved.
- Node content HTML is sanitized (DOMPurify) and the webview runs under a Content Security Policy.
- Route deletion asks for confirmation; browser/web mode warns that storage is temporary; the Review tab shows a due-loci badge.
- DSL apply failures surface as diagnostics in the DSL pane.
- AI encoding suggestions use the current Claude model (`claude-sonnet-4-6`).

### Build

- Dev builds link on the windows-gnu toolchain again: the app lib builds as `rlib` only, and the debug bridge plugin is behind an opt-in `mcp-bridge` cargo feature (requires MSVC).
- Dependency security fixes (`npm audit` clean).

## v0.6.0 and earlier

See the [release notes on GitHub](https://github.com/DavidTbilisi/memory-palace-lab/releases).
