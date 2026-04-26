# Memory Palace ROI Backlog

This backlog ranks the highest-ROI feature work from the current product state, not from zero.

Execution rule:
- Work top to bottom.
- Finish one file before starting the next.
- Run tests before every commit.
- Do not commit if verification is red.

Ranking logic:
- `ROI` favors features that improve recall, reduce forgetting, or turn telemetry into better study behavior.
- `Psych` captures memory-science leverage: retrieval, spacing, elaboration, distinctiveness, dual coding, chunking, and interference reduction.
- `Tech` captures infrastructure leverage: features that reuse analytics, review state, and graph primitives instead of adding isolated UI.

## Core Already Delivered

1. [Analytics Foundation](./01-analytics-foundation.feature)
2. [Recall-First Walk Mode](./02-recall-first-walk-mode.feature)
3. [Spaced Review Queue](./03-spaced-review-queue.feature)
4. [Memory Strength Dashboard](./04-memory-strength-dashboard.feature)

Why this matters:
- The app can now measure review behavior.
- The app can force retrieval instead of passive rereading.
- The app can schedule due work.
- The app can show weak and unstable memory areas.

## Next Highest ROI

5. [Adaptive Review Interventions](./05-adaptive-review-interventions.feature)
   Why next: analytics should not stop at observation. The highest payoff now is converting weak signals into direct actions like re-encode, split a route, add confusion contrast, or shorten a cognitively expensive sequence.

6. [Encoding Assistant](./06-encoding-assistant.feature)
   Why here: once the system knows what is weak, it should help convert dry material into vivid, memorable imagery and action.

7. [Contrast and Confusion Nodes](./07-contrast-and-confusion-nodes.feature)
   Why here: many failures are interference failures. Explicit contrast structure improves discrimination, not just storage.

8. [Semantic Magic Theme Engine](./08-semantic-magic-theme-engine.feature)
   Why here: neon, glow, and magic become high value only when tied to actual meaning, weakness, danger, or importance.

9. [Media Cues](./09-media-cues.feature)
   Why here: dual coding helps, but should come after the app already knows what deserves extra sensory reinforcement.

## Delivery Notes

- `01` through `04` are the cognitive core and are already in place.
- `05` through `07` are the highest-ROI learning loop extensions.
- `08` is where the interface becomes more magical without losing mnemonic precision.
- `09` expands sensory encoding once the graph and review loop know where media is worth the cost.
