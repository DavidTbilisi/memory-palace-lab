# Memory Palace Lab

Local-first desktop app: infinite **tldraw** canvas, graph nodes/edges (CAST), ordered routes, and walk mode. Data lives in **SQLite** via the Tauri backend.

## Prerequisites

- Node.js 20+
- [Rust](https://rustup.rs/) and [Tauri prerequisites](https://tauri.app/start/prerequisites/) (for the desktop shell)

## Commands

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run tauri dev` | Run the desktop app (Vite + Tauri) |
| `npm run dev` | Web-only Vite dev (in-memory persistence, no SQLite) |
| `npm run build` | Typecheck + Vite production bundle |
| `npm test` | Vitest unit tests |
| `npm run test:ui` | Playwright UI smoke tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## MVP usage

1. Create a palace, open it.
2. **Double-click** empty canvas to add memory nodes (geo shapes).
3. Select a node → right panel: title/content → **Apply**.
4. **Connect** tool: click node A, then node B → CAST dialog → edge arrow.
5. **Routes**: add a route, select it, select a node → **Add selected node to route**.
6. **Walk**: turn Walk on, use prev/next; current locus is highlighted.
7. **Save** toolbar button writes canvas + graph to SQLite.

## Architecture

- `src/domain/` — pure types and services (tested without UI).
- `src/canvas/` — tldraw integration, snapshot build, shape helpers.
- `src/infrastructure/` — Tauri invoke repository + in-memory fallback.
- `src-tauri/` — SQLite schema, `palace_*` commands.
