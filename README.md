# Memory Palace Lab

Memory Palace Lab is a local-first graph workspace for building, rehearsing, and reviewing memory structures.
It combines an infinite canvas, CAST semantic edges, route-based recall, spaced review queues, and analytics in one desktop-first app.

## What You Can Do

- Build memory palaces as graph-native maps (nodes + semantic edges on top of `tldraw`).
- Encode relationships with CAST edge profiles (Causal, Associative, Structural, Temporal).
- Turn graph structure into ordered routes and run recall-first walk sessions.
- Use a due-based review queue that prioritizes weak or unseen loci.
- Track local telemetry in the Insights page (node/edge/route/review/session events).
- Run theSystem pipelines and materialize them into ready-to-walk graph runs.
- Organize multiple palaces with Atlas hierarchy paths (`Domain/Place/Section`).
- Use portal nodes to jump between palaces and start linked routes.
- Work safely with draft autosave and explicit save checkpoints.

## Screenshots

### Graph empty state
![Graph empty state](docs/screenshots/01-graph-empty.png)

### Graph workspace (tutorial palace)
![Graph workspace](docs/screenshots/02-graph-workspace.png)

### Review queue
![Review queue](docs/screenshots/03-review.png)

### Insights analytics
![Insights analytics](docs/screenshots/04-insights.png)

### System Workbench
![System Workbench](docs/screenshots/05-system-workbench.png)

### Atlas hierarchy
![Atlas hierarchy](docs/screenshots/06-atlas.png)

### Routes editor
![Routes editor](docs/screenshots/07-routes.png)

### Help center
![Help center](docs/screenshots/08-help-center.png)

## Tech Stack

- React 19 + TypeScript + Vite
- `tldraw` canvas runtime
- Zustand state store
- Tauri v2 desktop shell
- SQLite (desktop persistence)
- Vitest + Testing Library + Playwright

## Project Structure

```text
src/
  app/              App shell and top-level page routing
  canvas/           tldraw integration and shape/snapshot helpers
  components/       UI pages and feature panels
  domain/           Pure business services and entities
  infrastructure/   Repository adapters (Tauri + in-memory fallback)
  store/            Zustand app state
src-tauri/
  src/              Rust commands, DB access, and app wiring
docs/
  backlog/          Ranked feature backlog and delivery notes
  screenshots/      README screenshots
tests/ui/           Playwright end-to-end coverage
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Rust toolchain (`rustup`) and Tauri prerequisites for desktop builds: <https://tauri.app/start/prerequisites/>

### Install

```bash
npm install
```

### Run (web mode)

```bash
npm run dev
```

Web mode is useful for UI development and tests. Desktop persistence features rely on Tauri runtime.

### Run (desktop mode, recommended)

```bash
npm run tauri dev
```

This runs Vite + Tauri and stores palace snapshots and analytics in SQLite via Rust commands.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server (web mode). |
| `npm run tauri dev` | Start desktop app with Tauri + Vite. |
| `npm run build` | Type-check and build production bundle. |
| `npm run preview` | Preview production web build. |
| `npm test` | Run Vitest unit/integration tests. |
| `npm run test:ui` | Run Playwright UI tests. |
| `npm run test:ui:headed` | Run Playwright tests with headed browser. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript checks (`tsc --noEmit`). |
| `npm run format` | Run Prettier write mode. |

## Quick Workflow

1. Create or open a palace.
2. Add nodes (double-click canvas or use node tools).
3. Edit node title/content in the inspector and apply changes.
4. Connect nodes with CAST edges from the Connect workflow.
5. Create a route and add selected nodes as loci.
6. Start Walk mode and grade recall honestly.
7. Open Review for due queue prioritization.
8. Open Insights to inspect learning and graph telemetry.
9. Save checkpoint when draft state is ready to persist.

## Persistence Model

- Desktop (`npm run tauri dev`): SQLite-backed palace snapshots and analytics.
- Web (`npm run dev`): in-memory palace repository fallback with browser-local fallback behavior for some client-side state.

## Testing

```bash
npm test
npm run test:ui
```

UI tests cover key workflows including palace creation, routes/walk mode, review queue behavior, CAST edges, atlas hierarchy, command palette, and theSystem materialization.

## Generate README Screenshots

The repository includes an automated capture script:

```bash
node scripts/capture-readme-screenshots.mjs
```

Defaults:
- Base URL: `http://127.0.0.1:4173`
- Output folder: `docs/screenshots`

Optional environment variables:
- `MP_BASE_URL`
- `MP_SCREENSHOT_DIR`

## Backlog and Delivery Notes

- Ranked ROI backlog: [docs/backlog/README.md](docs/backlog/README.md)
- Process notes: [docs/backlog/DELIVERY_PROCESS.md](docs/backlog/DELIVERY_PROCESS.md)
- Palace DSL reference: [docs/palace-dsl.md](docs/palace-dsl.md)
