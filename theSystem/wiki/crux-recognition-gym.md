---
palace: strategic-memory
level: 7
domain: 10
room: 5
semantic_mode: 5
wiki_source: wiki/problem-solving/crux-recognition-gym.md
---

# Crux Recognition Gym

**Summary**: A [Red Queen Gym](./red-queen-skill-gym.md) instance that drills **per-problem [crux](./crux-move.md) recognition under time pressure** — given a problem, identify (a) which archetype, (b) which tactic applies, (c) where the crux lives (Strategy / Tactic / Tool level) — in <60 s. The second registered instance of the **recognition-gym pattern** after construct-recognition-gym (which drills code-construct recognition in 6 s). Surfaced from the [Livingstone-Thomson Brain Teasers](./livingstone-thomson-brain-teasers.md) ingest 2026-05-24, where the 211 puzzles are *structurally* a crux-recognition training set compressed into paragraphs.

**Sources**:
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — the 211-puzzle training set this gym is built on
- [crux-move](./crux-move.md) §"Crux-detection drill (queued for [red-queen-skill-gym](./red-queen-skill-gym.md))" — the Lamp/Scale/Sword drill structure
- [red-queen-skill-gym](./red-queen-skill-gym.md) — the parent gym pattern
- construct-recognition-gym — sister recognition-gym instance on the code axis

**Last updated**: 2026-05-24

---

## Why a recognition gym, not a solving gym

The 211 puzzles in [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) do not test mathematical depth. Most are computationally trivial *once you've recognized the right tactic*. The hard part — the part that takes 80% of solution time on first encounter and drops to 5% after drilling — is **recognizing which of ~12 tactics applies** before computing.

This is exactly the *recognition-gym* substrate construct-recognition-gym built for code constructs. The substrate transfers:

| Recognition gym | Material | Recognition floor | Telemetry |
|---|---|---|---|
| construct-recognition-gym | Code snippets in 12 classes | <6 s @ ≥80% | per-construct accuracy + latency |
| **This gym** | Brain-teaser problems in ~12 tactic classes | <60 s @ ≥70% | per-archetype accuracy + named-tactic accuracy + red-herring rate |

The 10× longer recognition window reflects that brain teasers carry **embedded narrative noise** (Dark Lords, Roman emperors, Wild Bill, Indiana Flynn) that must be parsed and discarded before the crux surfaces. Code snippets have minimal narrative.

### Feeder corpora

| Corpus | Source | Count | Calibration | Notes |
|---|---|---|---|---|
| Brain Teasers (canonical) | [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) | 211 puzzles | 17 archetypes A–R · timing labels · difficulty labels | The original Lamp/Scale/Sword training set; recognition-gym pattern's 2nd instance |
| Heart-of-Math Ch 1 "silly stories" | [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) §1.1–1.3 (pp. 47–73) | 8 stories | 3-section staging (story · nudge · punch-line) — Lamp/Scale/Sword-equivalent | Added 2026-05-27 Burger ingest. Each story's narrative includes Burger's "find the right question to the wrong answer" reframe in the §1.3 commentary — useful for Fire-habit pairing (see [fail-to-succeed-habit](./fail-to-succeed-habit.md)) |

The Heart-of-Math Ch 1 corpus is a *natural addition* because its 3-section structure (silly story → nudge → punch line) maps directly onto the gym's Lamp (recognition) → Scale (discrimination with hints) → Sword (full solution under pressure) phases. Burger and Starbird already built the staging the gym needs.

## The drill structure (Lamp / Scale / Sword)

Inherited from [red-queen-skill-gym](./red-queen-skill-gym.md):

### Lamp phase — retrospective recognition

Given a fully-solved puzzle (problem + answer + reasoning), identify:
- The **crux** (the qualitative inflection point)
- The **tactic** used (one of [Symmetry · Extreme · Pigeonhole · Invariants](./universal-mathematical-tactics.md) or a startup strategy or a tool)
- The **level** (Strategy / Tactic / Tool per [problem-solving-three-levels](./problem-solving-three-levels.md))
- The **archetype** (one of the 17 in [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md))

**Pass floor**: <30 s per puzzle, ≥80% accuracy across a 20-puzzle batch.

This is the *easiest* phase. Use [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) answer sections to grade.

### Scale phase — mid-investigation recognition

Given a puzzle text + 30-second attempt window, **before** solving:
- Name the archetype (1 of 17)
- Predict the tactic (1 of ~12)
- Mark the crux candidate (1 sentence)

Then attempt to solve. Grade against actual crux on resolution.

**Pass floor**: <60 s recognition phase, ≥60% archetype accuracy, ≥50% tactic accuracy.

### Sword phase — under time pressure

Mixed batch of 10 puzzles spanning all 17 archetypes. 60 s per puzzle for recognition, then 4 min for solve (book's standard regular-puzzle window). Run as a *single session* with no breaks.

**Pass floor**: ≥70% crux identification within the recognition window; ≥80% tactic accuracy when crux is correctly identified; ≤1 red-herring false-positive per 10.

## What this gym measures that [crux-move](./crux-move.md) §Crux-detection drill doesn't

The drill block in [crux-move](./crux-move.md) §"How to detect a crux in real time" mentions Lamp/Scale/Sword pass-floors at the page-summary level. This page is the *operational* gym: the queue of training material, the telemetry schema, the failure-mode taxonomy, the substitution rule when material runs out.

The material queue:

1. **First pass (sessions 1-10)**: the 211 puzzles in [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md), in choose-your-own sequence. Each provides one Lamp + one Scale event.
2. **Second pass (sessions 11-30)**: same puzzles re-shuffled, blind to memory of the answer (cards spaced via [encoded-spaced-repetition](./encoded-spaced-repetition.md) schedule). Tests transfer from memorized-tactic to genuine-recognition.
3. **Third pass (sessions 31+)**: novel puzzles from external sources (Zeitz Ch 1-3 exercises, Putnam problems graded to brain-teaser difficulty, IBM Ponder This archive). Tests cross-source transfer.

## Telemetry schema

Each gym event emits per puzzle:

```yaml
puzzle_id: <source>:<number>          # e.g. "livingstone-thomson:119"
archetype_predicted: <one of 17>      # A through R
archetype_actual: <one of 17>
tactic_predicted: <one of ~12>        # symmetry|extreme|pigeonhole|invariant|hands-dirty|penultimate|wishful|easier|recast|change-pov|venn|info-theoretic|cultural-string|linguistic
tactic_actual: <one of ~12>
crux_predicted_level: <strategy|tactic|tool|none>
crux_actual_level: <strategy|tactic|tool|none>
crux_recognized_in_seconds: <number|null>
red_herring_present: <true|false>     # did the puzzle contain irrelevant data
red_herring_used: <true|false>        # did the solver use it
solved_correctly: <true|false>
solution_time_seconds: <number>
phase: <lamp|scale|sword>
```

These feed:
- **Per-archetype accuracy table** (which of 17 you most often miscategorize)
- **Per-tactic accuracy table** (which tactic you most often predict wrong)
- **Red-herring false-positive rate** (across red_herring_present=true events)
- **Crux-recognition latency distribution** (target: 80% under 60 s by session 20)

## METER pass-floors (rollup metrics)

| Metric | Pass | Floor |
|---|---|---|
| Crux identification within 60 s | ≥70% across 20-puzzle batch | 40% |
| Named-tactic accuracy when crux correct | ≥80% | 60% |
| Archetype identification accuracy | ≥75% | 50% |
| Red-herring false-positive rate | ≤1 per 10 puzzles with red-herring | ≤2 per 10 |
| Solution accuracy when recognition correct | ≥90% | 75% |
| Lateral-trap detection (archetype B) | ≥60% on first read | 40% |
| Encoder-gain vs raw recall on Gallery puzzles (archetype C) | ≥+5 items / 24 | +2 / 24 |

These compose into a single **gym-readiness score** the way the wiki's existing gym pages aggregate.

## Failure modes (anti-patterns to watch)

1. **Memorizing answers, not recognizing patterns.** The choose-your-own format makes it easy to memorize "puzzle #119 = work backward = 30 L" without recognizing the *pattern*. Defense: blind-shuffle on second pass; require tactic-naming before answer.
2. **Recognizing the *type* but applying the wrong tactic.** Common in archetypes I + J: spotting "this is an invariant problem" but using parity when modular arithmetic is needed. Defense: log `tactic_predicted` separately from `archetype_predicted`.
3. **Skipping recognition under time pressure.** Sword-phase compression tempts skipping straight to solve. Defense: hard 60 s recognition timer enforced before solve timer starts.
4. **Inflating crux-recognized-in-seconds via post-hoc rationalization.** If you only know the tactic *after* solving, you didn't recognize it — you computed it. Defense: write the predicted tactic *before* attempting.
5. **Drilling without spaced retrieval.** Without [spaced-repetition](./spaced-repetition.md) scheduling, gains decay. Defense: each missed-tactic puzzle becomes an [encoded-spaced-repetition](./encoded-spaced-repetition.md) card with the 4 NEDF slots filled (Name = puzzle ID; Essence = the tactic-pattern; Distinguisher = vs nearest sibling-tactic; Failure = the trap that fires when you misidentify).
6. **Generalizing from too-small a sample.** Per [zeitz-startup-strategies](./zeitz-startup-strategies.md) anti-pattern catalog: 5 puzzles isn't enough to conclude you're weak at tactic X. Run ≥20 per archetype before drawing conclusions.

## Position in the wiki framework stack

| Layer | Page | Role |
|---|---|---|
| Parent gym | [red-queen-skill-gym](./red-queen-skill-gym.md) | The Lamp/Scale/Sword infrastructure |
| Sister gym (code axis) | construct-recognition-gym | Same pattern, 6 s recognition window, 12 code constructs |
| **This page** | **Crux Recognition Gym** | **Same pattern, 60 s recognition window, ~12 problem tactics** |
| Material source | [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) | 211 calibrated puzzles |
| What we recognize | [crux-move](./crux-move.md) · [universal-mathematical-tactics](./universal-mathematical-tactics.md) · [zeitz-startup-strategies](./zeitz-startup-strategies.md) · [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) | The 4 alphabets of recognition |
| Why it works | [ok-plateau](./ok-plateau.md) §Crux-recognition gym as per-problem-step ladder | Forces Cognitive-stage engagement at exactly the per-step inflection points |
| Scheduling layer | [encoded-spaced-repetition](./encoded-spaced-repetition.md) | Each missed-tactic puzzle becomes an SR card |

## Why this is "the" load-bearing gym for problem-solving

The wiki has multiple gyms ([red-queen-skill-gym](./red-queen-skill-gym.md), construct-recognition-gym, algorithm-pattern gym), but each drills a single skill. **This gym is unusual** because it drills the *meta-skill* of selecting which other gym (or tool, or tactic, or strategy) to deploy.

That makes it the **operational counterpart** of [problem-solving-os](./problem-solving-os.md): the OS sequences the 6 steps; this gym drills step 3 (select tactic) at the cycle-level. A well-drilled crux-recognition reflex makes step 3 of the OS fire in <60 s; without the drill, step 3 takes 5-15 min on unfamiliar problems.

This is also why **promoting recognition-gym to a named pattern** matters: every domain in which problem-solving is the load-bearing activity (math, code, security, debugging, diagnosis, troubleshooting) deserves a recognition gym. The pattern is currently at 2 instances (construct-recognition-gym + this); a third in another domain (security-incident-pattern gym? debugging-archetype gym?) would trigger promotion to its own owner page in [composability-index](./composability-index.md).

## Mnemonic

Velvet Aeon Mode-Identity register: a **scholar in a circular gym** with **211 weight-rack stations** arranged in 17 colored rings. Above each station hangs a **paper card** showing one of 17 archetype symbols. The scholar has 60 seconds at each station — a **single hanging lantern's burn time** marks the limit (the Velvet Aeon timekeeping device, no clocks). She must **point to one of 4 scroll-banners** on the wall (Symmetry · Extreme · Pigeonhole · Invariants) or one of 4 tactic-banners (Hands · Penultimate · Wishful · Easier) before the lantern dims. A **broken brain-size measuring stick** lies discarded at the entry. The scholar has **STRONG** face archetype (angular jaw, gym is for power not fragility); preserve = **sacred memory** (each recognized crux is stored forever in the gym's vaulted ceiling, the lit constellation of solved past puzzles). Single warm light from above.

## Memory checksum

- **2** registered instances of the recognition-gym pattern (this + construct-recognition-gym)
- **3** phases (Lamp · Scale · Sword)
- **60 s** recognition window (10× the construct gym's 6 s)
- **17** archetypes drilled (from [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md))
- **~12** tactics in the recognition alphabet
- **7** METER metrics
- **6** failure modes
- **3** material passes (book → blind shuffle → external transfer)
- **211** puzzles in the first-pass training queue

If you can recite 2-3-60-17-12-7-6-3-211 from "crux recognition gym" within 90 s, the page is encoded.

## Related pages

- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — the training queue
- [crux-move](./crux-move.md) — what gets recognized
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — the 17-class alphabet
- [universal-mathematical-tactics](./universal-mathematical-tactics.md) — the 4-tactic alphabet
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — the 4-strategy alphabet
- construct-recognition-gym — sister recognition gym (code axis)
- [red-queen-skill-gym](./red-queen-skill-gym.md) — parent gym pattern
- [ok-plateau](./ok-plateau.md) — why this gym matters at the per-problem-step layer
- [encoded-spaced-repetition](./encoded-spaced-repetition.md) — missed-tactic puzzles become SR cards
- [problem-solving-os](./problem-solving-os.md) — this gym drills step 3 of the OS at cycle-level
- [anti-tactic-detection](./anti-tactic-detection.md) — the meta-skill this gym specifically trains
- [red-herring-resistance](./red-herring-resistance.md) — the METER metric this gym tracks
- [composability-index](./composability-index.md) — recognition-gym pattern now at 2 instances

---

## U — See (CAST)

1. Circular gym with 211 stations in 17 colored rings, scholar with 60-second lantern, 4-scroll + 4-tactic wall-banners
2. Edges: station → archetype → tactic; scholar → recognition reflex

## D — Name (NEDF)

1. Crux Recognition Gym = drills per-problem crux recognition under 60-s timer
2. 2nd recognition-gym instance after construct-recognition-gym
3. Distinguisher: trains the meta-skill of *which tactic to use*, not the tactics themselves
4. Failure mode: memorizing answers instead of recognizing patterns

## F — Do (SPEAR)

1. Session start → load batch of 10–20 puzzles from [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md)
2. For each: 60-s recognition (write predicted archetype + tactic + crux level) → solve → log METER event
3. End of session → review per-archetype accuracy table → route weakest archetype to drill
4. Weekly → run 1 Sword-phase batch under full time pressure

## B — Watch (HEART)

1. Recognition done *after* solving (rationalization, not recognition)
2. High solve-accuracy + low recognition-accuracy = memorizing answers
3. Skipping the 60-s timer under fatigue
4. Drilling without [spaced-repetition](./spaced-repetition.md) scheduling

## L — Predict (ORACLE)

1. After 30 puzzles, per-archetype accuracy stabilizes; predict which archetype will be weakest from session 5 data
2. Sword-phase performance predicts real-world transfer to novel problems

## R — Act (GRACE)

1. New puzzle → 60-s recognition phase before any computation
2. Mismatch (predicted vs actual tactic) → log + add to SR queue
3. Coach another → run them through the Scale phase first, never start at Sword
