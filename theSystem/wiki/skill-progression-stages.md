---
wiki_source: wiki/cross-cutting/skill-progression-stages.md
---

---
palace: meta-knowledge
level: 8
domain: 10
room: 2
semantic_mode: 5
---

# Skill Progression Stages

**Summary**: The single source of truth for stage and level numbering across the gym, reflex, Anki, and automaticity pages. Three orthogonal axes — **Pipeline stage** (where in the lifecycle), **Drill ladder stage** (where in a gym session), and **Automaticity level** (how reflexive the skill is for the learner) — share the word "stage" but mean different things. Always cite the axis.

**Sources**:
- automaticity-and-reflex-training.md
- red-queen-skill-gym.md
- anki-reflex-deck-builder.md
- drill-generator.md

**Last updated**: 2026-05-12

---

## Why this page exists

Three different numbering systems were drifting apart because each lived on its own page and used the bare word "stage". A reader hitting "stage 4" got different answers depending on which page they were on. This page owns all three axes; other pages should link here instead of redefining.

| Axis | Range | Question it answers | Source-of-truth page |
|---|---|---|---|
| **Pipeline stage** | 1–8 | Where in the lifecycle is this skill? | This page |
| **Drill ladder stage** | 0–7 | Where in a gym session is the learner working? | [red-queen-skill-gym](./red-queen-skill-gym.md) |
| **Automaticity level** | 0–9 | How reflexive is the skill for this learner? | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |

**Citation rule**: never write "stage 4" alone. Write `pipeline stage 4`, `drill stage 4`, or `automaticity level 4`.

---

## Axis 1 — Pipeline stage (1–8)

Where the skill sits in the lifecycle from raw input to durable transfer. Used by [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) to decide which tool fits.

| Stage | Phase | Primary tool |
|---|---|---|
| 1 | Understand concept | Notes / Red Queen comprehension |
| 2 | Encode concept | Mnemonics / [NEDF](./nedf-overview.md) / [CAST](./cast-overview.md) |
| 3 | Remember cue → action | Anki reflex cards |
| 4 | Distinguish similar cases | Anki + mixed review |
| 5 | Execute action | Labs / exercises |
| 6 | Execute fast | Gym timed drills (Blocked progression) |
| 7 | Execute under pressure | Gym random drills / simulators |
| 8 | Transfer | Projects / teaching / production |

(source: anki-reflex-deck-builder.md)

---

## Axis 2 — Drill ladder stage (0–7)

Where the learner is *inside a single gym session*, regardless of which pipeline phase the skill is at. Owned by [red-queen-skill-gym](./red-queen-skill-gym.md) and [drill-generator](./drill-generator.md).

| Stage | Inside-session focus |
|---|---|
| 0 | Orientation |
| 1 | Isolation |
| 2 | Clean repetition |
| 3 | Controlled variation |
| 4 | Automaticity |
| 5 | Mixing |
| 6 | Pressure and noise |
| 7 | Transfer and zenith |

(source: red-queen-skill-gym.md; drill-generator.md)

---

## Axis 3 — Automaticity level (0–9)

How reflexive the skill is for one specific learner. Owned by [automaticity-and-reflex-training](./automaticity-and-reflex-training.md).

| Level | State | Gate |
|---|---|---|
| 0 | Unknown | Cannot explain |
| 1 | Understands | Can explain slowly |
| 2 | Recognizes with help | Needs reference |
| 3 | Recognizes alone | No reference needed |
| 4 | Acts correctly slowly | Untimed performance |
| 5 | Acts correctly under time | Timer present |
| 6 | Acts correctly under variation | Different surface forms |
| 7 | Acts correctly under pressure | Noise, fatigue, partial info |
| 8 | Transfers | Works in new context |
| 9 | Teaches / debugs others | Can diagnose errors in others |

This axis has **10 states (0 through 9)**. Earlier prose called this a "9-level scale"; that wording is incorrect — it is 10 levels indexed 0–9. Use `automaticity level N`, not "9-level scale".

(source: automaticity-and-reflex-training.md)

---

## Practice-progression triad (sub-axis, not a fourth stage system)

Inside drill ladder stages 2–5, intensity escalates through three practice modes:

| Mode | What it trains |
|---|---|
| Blocked | Building the base pattern |
| Mixed | Discrimination between similar categories |
| Random | Reflex / pure automatic response |

Refer to it by name (Blocked / Mixed / Random), **never** as "stage 1/2/3" — that collides with the other axes.

(source: automaticity-and-reflex-training.md)

---

## Cross-axis correlation (orientation only, not definitions)

The three axes are independent measurements of the same skill. Approximate alignment:

| Pipeline stage | Drill ladder stage | Automaticity level |
|---|---|---|
| 1–2 (understand, encode) | 0–1 (orientation, isolation) | 1–2 |
| 3–4 (remember, distinguish) | 2–3 (clean rep, controlled variation) | 3–4 |
| 5–6 (execute, execute fast) | 4–5 (automaticity, mixing) | 4–6 |
| 7 (under pressure) | 6 (pressure and noise) | 7 |
| 8 (transfer) | 7 (transfer and zenith) | 8–9 |

These rows are correlations, not equivalences. A skill can sit at pipeline stage 6 and automaticity level 4 if drill quality is poor. (synthesis from the three source pages above; verify before relying on a specific row)

---

## Citation rule for other pages

When referencing a stage from another wiki page:

- write the axis explicitly: `pipeline stage 4`, `drill stage 4`, `automaticity level 4`
- link this page on first mention: `[pipeline stage 4](./skill-progression-stages.md)`
- do not redefine the axes locally; link instead

Pages that currently restate stages inline and could eventually migrate to linking here:

- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — owns nothing; restates pipeline stages 1–8
- [red-queen-skill-gym](./red-queen-skill-gym.md) — owns drill ladder; should link here for any pipeline-stage references
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — owns automaticity levels; should fix the "9-level" wording and link here for pipeline-stage references

Migrate when next editing those pages, not as a standalone refactor.

---

## Diagrams

Three orthogonal axes side-by-side — pipeline (1–8), drill ladder (0–7), automaticity (0–9):

![skill-progression-stages schematic](../diagrams/11-skill-progression-stages.png)

Hero — the three-stairwell atelier metaphor: a single craftsman ascending three parallel staircases simultaneously, each with a different step count, harnessed by three brass ropes that each read his height on a different scale:

![skill-progression-stages hero](../diagrams/heroes/skill-progression-stages.png)

## Related pages

- georgian-driving-exam-b-drill-ladder — exam drill rungs mapped onto the canonical drill-stage axis
- georgian-driving-exam-b-overview — licensed-exam corpus whose ladder cites this page
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md)
- [drill-generator](./drill-generator.md)
- [drill-ladder-patterns](./drill-ladder-patterns.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [giordano-graded-curriculum](./giordano-graded-curriculum.md) — external 60-lesson mnemonics curriculum whose stage/volume counts are cited against these axes (2026-07-10 GMS ingest)
- [glossary](./glossary.md)

---

- **2026-05-29 learning-canon cross-links**: [deliberate-practice](./deliberate-practice.md) (Ericsson's 3-tier naive/purposeful/deliberate hierarchy as a sibling axis to the wiki's automaticity/knowledge ladders) · [novice-vs-expert-cognition](./novice-vs-expert-cognition.md) (Willingham #6: surface-vs-deep features) · [practice-is-required-not-optional](./practice-is-required-not-optional.md) (Willingham #5: the Whitehead 1911 anchor) · [10000-hour-rule-mythbusting](./10000-hour-rule-mythbusting.md) (Ericsson's correction of Gladwell)

## U — See (CAST)
1. Three orthogonal stage axes sharing one word
2. Edges: Pipeline ↔ Drill ladder ↔ Automaticity

## D — Name (NEDF)
1. Single source of truth for stage/level numbering
2. "Stage" without axis = ambiguous
3. Always cite the axis when mentioning a stage

## F — Do (SPEAR)
1. Writing "stage N"? Pick axis: Pipeline / Drill / Auto
2. New stage system? Register here first
3. Linting? Cross-check page counts against this page

## B — Watch (HEART)
1. Pages saying "stage 5" with no axis
2. Counts that disagree across pages
3. Pipeline-7 vs Drill-7 vs Auto-7 confusion

## L — Predict (ORACLE)
1. Stage counts drift fast if not gated here
2. Cross-axis correlation surfaces patterns

## R — Act (GRACE)
1. Citing a stage → name the axis in the same sentence
2. Counting steps in a ladder → look here first