# Changelog

## Unreleased

### Fixes

- **The Linux AppImage starts on newer systems again.** On Fedora 44 and other systems with Mesa 26, the AppImage opened an empty window because its web page process crashed on start. The AppImage now uses the system's display libraries (Wayland, xkbcommon, and some X11 libraries) instead of the older copies it bundled.

## v0.9.0 — 2026-09-17

### Route builder

- **Build routes by clicking.** Press **Route**, then click nodes in walk order; each click adds the next stop, and a first route is created if the palace has none.
  - Double-clicking empty canvas adds a new node as the next stop.
  - **Add selected** appends the canvas selection in selection order, left to right, top to bottom, or as the shortest walk.
  - A node already on the route is not added again by accident.
- **Each stop keeps a view.** Zoom and pan before clicking a node, and walks return to that view, like the scenes of a film.
  - The camera button in the Route mode banner turns this off.
  - A stop's view can be saved, replaced, or removed later from the Routes tab.
- **Routes tab** beside the node inspector.
  - It lists every route with its color, stop and due counts, and controls to show/hide, walk, rename, reorder, and delete it.
  - Drag stops (or use the arrow keys) to reorder them, give a stop its own label, and undo a removal.
- **Routes on the canvas:** arrows in each route's color with numbered stops. Hidden routes stay off the canvas, and a walk shows only the walked route.
- **Inspector and walk bar.** The node inspector lists a node's routes and can add it to one. The walk bar picks which route to walk.
- **Route data fixes.**
  - Deleting a node removes its stops, and undo brings them back.
  - The desktop app keeps route order after a reload instead of sorting by name.
  - Applying the DSL keeps the active route and a running walk.
  - A node listed twice in a DSL route gets two stops.
  - The last rating of a walk is recorded with its walk session.

### Library, navigation, and settings

- **One Library** (Start here, Guides, Wiki, Glossary, Reference) with a single search, including a mirror of the ~420-page Neural OS wiki. **Encode this** turns any document into a runnable pipeline.
- **Grouped navigation** (Graph, Review, Insights, System, Library) and one **Settings** page: review goal, AI key, idle tips, atlas level names, backup and restore, updates, and the METER bridge.
- **One definition of "due"** now drives the navigation badge, the Review page, Insights, and the Next-up card.

### Cleaner workspace

- **Secondary controls stay out of the way.**
  - One **Storage and save status** button replaces three status popovers.
  - Navigation group labels expand on hover.
  - The version shows when you hover the title.
  - The content formatting bar appears while you edit a node's content.
- **The formatting buttons work.** Bold, Italic, Underline, and the list buttons now format the selection; before, pressing one dropped the selection.

### Learning tools

- **Difficulty** (Insights → Difficulty) estimates the learner-relative cost of each node and each palace: walls, learning order, and what's left to learn. It adds colored badges on the canvas and lets you override a node's estimate.
- **New System pipeline:** How to Learn a Language (12 loci).

### METER bridge

- **Live mirroring.** The desktop app can copy analytics events into METER's `events.jsonl` as they happen (Settings › METER bridge). It is on only when the app was started with `METER_DATA_DIR`, or when a directory is set in Settings.
- **No duplicates.** `palace meter backfill` writes past events with the same ids as the live bridge, so the two never duplicate each other.

### Palace CLI

- **New `palace` command** (`npm run palace -- <cmd>`, or `bin/palace`).
  - It offers the MCP server's database operations on the command line.
  - It also has `lint`, `fmt`, `hash`, and `cast decode | encode | table` for DSL files.
  - See `docs/cli.md`.

### Fixes

- **Background image.** It can now be adjusted, locked, replaced, and removed. Replacing it no longer stacks a second image, and a new background goes behind the graph.
- **DSL editor.** Documents that create nodes apply again.
- **`?path` queries** find multi-word node titles. The new warning W805 flags an ambiguous path; quote the titles to choose.
- **MCP imports.** Palaces imported through MCP now record a `palace_created` event.
- **Import notes.** The placeholders read as examples instead of looking like pasted data.
- **Dropdowns on macOS.** Their text is readable in the macOS app (WebKit).
- **DSL docs.** The Palace DSL reference now describes edge tokens and alias forms the way the parser reads them.

### Database

- **New columns.** On first start, the desktop app adds three database columns: `routes.sort_index`, `routes.settings_json`, and `loci.settings_json`. The MCP server adds them when it opens an older database, and older app versions ignore them.

## v0.8.0 — 2026-06-11

### Self-update

- The desktop app now updates itself: it checks GitHub releases on startup and offers a one-click **Install & restart** when a newer version is published. Updates are cryptographically signed and verified (tauri-plugin-updater).
- This is the first updater-enabled build — installs of v0.8.0 and newer update in-app automatically; v0.7.0 and older need one final manual install.

### Small improvements

- The app version is shown in the header and the Help Center.
- Release/signing flow documented in `docs/releasing.md`.

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
