# Memory Palace ROI Backlog

This backlog ranks high-ROI features from both technical and psychological perspectives.

Execution rule:
- Work top to bottom.
- Finish one file before starting the next.
- Run tests before every commit.
- Do not commit if verification is red.

Ranking logic:
- `ROI` favors features that improve recall, reduce loss of work, or create measurable learning gains.
- `Psych` captures memory science leverage: retrieval, spacing, distinctiveness, dual coding, chunking, and interference reduction.
- `Tech` captures platform leverage: reusable infrastructure, observability, and features that unlock later work.

## Rank Order

1. [Analytics Foundation](./01-analytics-foundation.feature)
   Why first: everything after this gets smarter if we can measure what actually helps.

2. [Recall-First Walk Mode](./02-recall-first-walk-mode.feature)
   Why second: forced retrieval is the strongest direct memory upgrade.

3. [Spaced Review Queue](./03-spaced-review-queue.feature)
   Why third: retrieval becomes durable only when the schedule adapts over time.

4. [Memory Strength Dashboard](./04-memory-strength-dashboard.feature)
   Why fourth: analytics becomes actionable only when weak areas are visible.

5. [Semantic Magic Theme Engine](./05-semantic-magic-theme-engine.feature)
   Why fifth: neon and magic become useful when they encode meaning instead of decoration.

6. [Encoding Assistant](./06-encoding-assistant.feature)
   Why sixth: dry facts need help becoming vivid, image-rich memory material.

7. [Contrast and Confusion Nodes](./07-contrast-and-confusion-nodes.feature)
   Why seventh: confusion is often a discrimination problem, not a storage problem.

8. [Media Cues](./08-media-cues.feature)
   Why eighth: images and audio add dual coding, but only after the core review loop exists.

## Delivery Notes

- `01` through `04` are the cognitive core.
- `05` is where the interface becomes more magical without sacrificing precision.
- `06` through `08` expand encoding power once analytics and review loops are stable.

## Wiki-Derived Additions (2026-09)

Items `09`–`15` come from a diff between this app and the Neural OS wiki. The app's last
feature commit is 2026-06-26; the wiki added 213 files after that date, roughly 70 of them
in `learning-systems/` and `encoders/`. Each item below names the wiki page that owns the
idea, and those pages now ship in `theSystem/wiki/` (see `npm run sync:thesystem`).

Ranked by the same ROI logic as `01`–`08`:

9. [NEDF Slots and Four Schedules](./09-nedf-slots-and-four-schedules.feature)
   Why first: `grep -ri nedf src/` returns nothing, while NEDF appears in ten `theSystem/`
   docs. Per `encoded-spaced-repetition`, giving each slot its own schedule buys 4× retrieval
   pressure per concept at roughly 1× authoring cost — and the scheduling machinery is already built.

10. [METER Event Bridge](./10-meter-event-bridge.feature)
    Why second: cheapest item here. The app's `AnalyticsEvent` maps almost one-to-one onto
    METER's event schema, an Anki bridge already exists, and until this ships palace work is
    invisible to every Neural OS report.

11. [Encode-Speed Telemetry](./11-encode-speed-telemetry.feature)
    Why third: the app times recall and never times encoding, so half the loop is unmeasured —
    and it is the half that decides whether a graph can be built live.

12. [Attribute Channels and Count-Shape](./12-attribute-channels-and-count-shape.feature)
    Why fourth: the newest wiki pages (`multi-attribute-encoding`, `multi-valued-attributes`)
    have no home in a single content blob. The count-shape half is a canvas layout command —
    something the wiki cannot do and this app can.

13. [Storm and Siege Sessions](./13-storm-and-siege-sessions.feature)
    Why fifth: the review queue implements Siege only. Storm is the accumulation phase, and
    without it the app cannot get a learner to volume.

14. [Generated Loci Stores](./14-generated-loci-stores.feature)
    Why sixth: palaces that build themselves from a number code. Removes the hand-placement
    ceiling, and generating palaces is this app's unique capability.

15. [Concept Glyphs](./15-concept-glyphs.feature)
    Why last of the new set: smallest change, real payoff at zoom, but it depends on nothing
    and can be picked up whenever.

`07-contrast-and-confusion-nodes` is unbuilt and now has wiki material behind it —
`confusion-triage`, `word-knowledge-links`, `tip-of-the-tongue`, and a seeded confusion map at
`wiki/assets/confusion-map-fr-seed.json` in the wiki repo. Treat it as ranked alongside `12`
rather than after `08`.

