# Delivery Process

This file defines how backlog items in this folder should be delivered.

## Rules

1. Only implement one ranked backlog item at a time.
2. Do not begin the next item until the current item is verified and committed.
3. Always preserve existing user data and current workflows unless the story explicitly changes them.
4. Prefer infrastructure that can support later items over one-off hacks.

## Required Verification Before Commit

Run at minimum:

```powershell
npm.cmd run typecheck
npm.cmd test
npx.cmd playwright test --workers=1
npm.cmd run build
```

If Tauri config, commands, or database code changed, also run:

```powershell
cargo check
```

## Commit Gate

Do not commit unless:
- the target feature is complete enough to be useful
- the acceptance scenarios in its `.feature` file are satisfied
- the verification commands above are green
- no unrelated regressions were introduced

## Execution Order

1. `01-analytics-foundation.feature`
2. `02-recall-first-walk-mode.feature`
3. `03-spaced-review-queue.feature`
4. `04-memory-strength-dashboard.feature`
5. `05-semantic-magic-theme-engine.feature`
6. `06-encoding-assistant.feature`
7. `07-contrast-and-confusion-nodes.feature`
8. `08-media-cues.feature`
9. `09-nedf-slots-and-four-schedules.feature`
10. `10-meter-event-bridge.feature`
11. `11-encode-speed-telemetry.feature`
12. `12-attribute-channels-and-count-shape.feature`
13. `13-storm-and-siege-sessions.feature`
14. `14-generated-loci-stores.feature`
15. `15-concept-glyphs.feature`
16. `16-information-architecture.feature`

