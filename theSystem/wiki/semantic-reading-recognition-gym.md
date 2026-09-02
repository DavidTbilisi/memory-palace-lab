---
palace: tactical-memory
level: 4
domain: 10
room: 9
wiki_source: wiki/learning-systems/semantic-reading-recognition-gym.md
---

# Semantic Reading Recognition Gym

**Summary**: Design spec for the first runnable gym targeting [semantic-reading-system](./semantic-reading-system.md). Trains the recognition layer of semantic reading — function-tag classification, mode selection, and framework routing — under timed conditions with auto-scored MCQ output. Conforms to [web-gym-generation-schema](./web-gym-generation-schema.md) and is the first of four planned semantic-reading sub-gyms.

**Sources**:
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [web-gym-generation-schema](./web-gym-generation-schema.md)
- [semantic-reading-system](./semantic-reading-system.md)
- [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md)
- [drill-generator](./drill-generator.md)
- [david-professional-profile](../raw/david-professional-profile.md) (finance reading list as v1 corpus seed)
- Live design conversation, 2026-05-06

**Last updated**: 2026-05-20

---

## Purpose

[semantic-reading-system](./semantic-reading-system.md) defines the framework. [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md) defines the pedagogy. This page defines the **runnable gym** — the web app that compiles those layers into a measured, latency-tracked, auto-scored training loop.

It is the first per-skill gym in Neural OS to formally apply [web-gym-generation-schema](./web-gym-generation-schema.md). Treat it as the reference instantiation that future gym pages will copy.

## Position In The Architecture

```
red-queen-skill-gym       <- pedagogy (universal)
        |
semantic-reading-system   <- framework (skill-specific)
        |
semantic-reading-drill-ladder   <- progression (8 stages, pass rules)
        |
this page                 <- gym design spec (compilation contract)
        |
gyms/semantic-reading-recognition-gym.html   <- runnable artifact (not yet built)
```

This page exists at the **compilation contract** layer. It is detailed enough that turning the YAML into a working HTML/JS app is near-mechanical.

## Why Recognition First

Semantic reading is a `judgment + expression` skill. Most outputs (one-sentence compressions, chunk lists, retrieval prompts) are open-ended and cannot be auto-scored without an LLM judge or rubric ceremony. Building the full skill as one gym would either degrade into a notebook with extra steps, or hit the [yak-shaving trap](wiki/david-google-prep-protocol.md:50) named in the prep protocol.

Instead, split semantic reading into four sub-gyms by gym mode:

| Sub-gym | Trains | Scorability | Build cost |
|---|---|---|---|
| **Recognition** (this page) | function-tag classification, mode selection, routing decision | Fully auto-scored MCQ + latency | 1 day |
| Execution | one-sentence compression, 3-chunk decomposition | Partial — compression ratio + self-rate vs reference | 2-3 days |
| Retrieval | regenerate paragraph from memory after delay | Partial — word overlap or LLM judge | 2 days |
| Stress | mixed types under time, interrupted reading, dense prose | Inherits from above + timing | 1 day on top |

Recognition is the only fully auto-scorable mode and therefore the only one that honors the *"computer measures automatically"* rule. It also targets Stages 1-3 of the existing drill ladder, which is where any new semantic-reading learner starts.

## Target Reflex (Three Variants)

The gym trains **three sub-reflexes**, one per "track." The learner picks one track per session.

### Track A: Function-Tag Reflex

> Given a paragraph, identify its **primary** function tag from `{Def, R, A, M, Q}` in under 10 seconds.

Maps to drill-ladder Stages `1 Isolation` and `2 Clean Repetition`.

### Track B: Mode-Selection Reflex

> Given a paragraph, identify the **lowest mode (1-5)** that adequately handles it in under 8 seconds.

Maps to drill-ladder Stage `3 Controlled Variation`.

### Track C: Routing Reflex

> Given a paragraph already classified as needing structural work, identify whether the hard part routes to `NEDF`, `CAST`, `SPEAR`, or `none` in under 12 seconds.

Maps to drill-ladder Stage `3-4 Controlled Variation -> Automaticity`.

The three tracks share the same engine and UI but differ in `prompt_shape`, `answer_shape`, and `latency_target_ms`.

## Failure Modes Targeted

Pulled directly from [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md) section "Primary Failure Modes":

- `cannot recognize` — the gym forces an explicit classification per rep, so this collapses fast
- `confuses neighbors` — Track A specifically logs Def/R, R/A, M/A, Def/Q confusion pairs in the summary
- `too slow` — the timer enforces a hard ceiling per rep
- `fails when mixed` — the corpus interleaves text types within one session

The gym does NOT directly target `cannot recall`, `cannot execute`, `fails after disruption`, or `fails in real conditions`. Those are owned by the Execution / Retrieval / Stress sub-gyms.

## Corpus Strategy

### v1 Seed (~50 paragraphs)

Pull the corpus from David's [finance / fintech reading list](wiki/david-professional-profile.md:154) plus adjacent technical reading the user already needs to absorb. This kills two birds: training the upstream skill on the exact text whose content matters for follow-up depth probes.

Recommended sources:
- 10 paragraphs from idempotency-key articles
- 10 paragraphs from Stripe/Square engineering blog on double-entry accounting
- 10 paragraphs from reconciliation pattern articles
- 10 paragraphs from Symfony 6 docs (Routing, DI, Doctrine)
- 10 paragraphs from a DDIA chapter (foundational long-term Google prep)

Each paragraph should be **3-5 sentences**, self-contained, and have an unambiguous primary tag / mode / routing target. Ambiguous paragraphs go to the Execution sub-gym, not this one.

### Item Format

```yaml
- id: idem-01
  text: |
    An idempotency key is a unique client-generated identifier that the server
    associates with the result of a request. If the same key arrives twice, the
    server returns the stored result instead of re-executing the operation.
  primary_tag: Def
  mode: 2
  routing: NEDF
  difficulty: easy
  source: stripe-engineering-blog
  near_miss_tags: [R]
  near_miss_reason: contains a relation but the dominant function is definition
  latency_target_ms: 10000
```

`near_miss_tags` exists so the summary screen can show neighbor-confusion analytics — the user sees not just "wrong" but specifically which neighbor they confused with which.

### Corpus Growth Rule

Add ~10 paragraphs per week. Tag each with one of `easy / medium / hard`. Stages 1-2 use `easy + medium`. Stage 3+ rotates in `hard` and mixes domains.

## RISE Block

```yaml
rise:
  reflex: classify the dominant function of a paragraph immediately
  intensity: timed 20-round mixed-domain set with 8-12s ceiling per rep
  sparring: near-miss paragraphs where two tags compete and the wrong one is plausible
  evaluation:
    accuracy: >= 0.85
    median_latency_ms: <= 8000
    neighbor_confusion: <= 2 per session
```

The `sparring` line is what makes this a gym and not a flashcard app. Half the corpus should be deliberately near-miss.

## Full Spec (YAML)

This is the compilation contract. Feed this directly into the AI prompt described in [web-gym-generation-schema](./web-gym-generation-schema.md) section "Prompt Contract For AI" to generate the HTML.

```yaml
meta:
  title: Semantic Reading Recognition Gym
  version: 1
  author_mode: ai-generated
  target_platform: web
  offline_capable: true

skill:
  name: semantic reading recognition
  skill_type: judgment
  gym_mode: recognition
  target_reflex: classify a paragraph's primary function tag, required mode, or routing target within 8-12 seconds
  real_use_case: finance / fintech reading, DDIA prep, Symfony docs ramp, every Neural OS book research session

training:
  current_stage: 1
  failure_mode: confuses neighbors
  intensity_level: 2
  rise:
    reflex: classify the dominant function of a paragraph immediately
    intensity: timed 20-round mixed-domain set
    sparring: near-miss paragraphs with plausible wrong tags
    evaluation: accuracy + median latency + neighbor confusion

session:
  length_minutes: 10
  round_count: 20
  prompt_per_round: 1
  timer_seconds: 10
  allow_pause: true
  show_feedback_immediately: true
  show_summary_at_end: true
  track_selection: prompt_user_at_start  # A, B, or C

content:
  item_type: classification
  prompt_shape: paragraph (3-5 sentences)
  answer_shape: 5-option MCQ (Track A) | 5-option MCQ (Track B) | 4-option MCQ (Track C)
  items: ~50 v1 paragraphs from finance + Symfony + DDIA seed

ui:
  blocks:
    - header
    - track_selector            # before session starts
    - goal_panel                # what reflex is being trained this track
    - stage_panel               # current stage 1-7
    - timer                     # countdown ring
    - prompt_card               # the paragraph
    - answer_input              # 4-5 large MCQ buttons
    - feedback_panel            # correct/wrong + near-miss explanation
    - score_panel               # running accuracy + median latency
    - progress_panel            # round X / 20
    - session_summary           # confusion matrix + per-tag accuracy + recommended next track

logic:
  answer_check: exact_match_on_correct_answer
  latency_start_event: prompt_render
  latency_end_event: answer_submit
  scoring_model: accuracy_plus_latency_bonus
  feedback_model: immediate_with_near_miss_explanation
  failure_detection: neighbor_confusion_matrix + slow_latency_per_tag
  advance_rule: track-specific (see Progression Rules below)
  fallback_rule: track-specific

metrics:
  accuracy:
    enabled: true
    formula: correct / total
    target: 0.85
  latency:
    enabled: true
    formula: median response time in ms
    target: 8000  # Track A: 10000, Track B: 8000, Track C: 12000
  branch_quality:
    enabled: true
    formula: count of near-miss confusions per session
    target: <= 2
    display_name: neighbor confusion
  stability:
    enabled: true
    formula: variance of accuracy across rounds 1-10 vs 11-20
    target: low
  recovery:
    enabled: false
    formula: not_used
    target: null
  transfer_proxy:
    enabled: true
    formula: accuracy on never-seen-before paragraph types within session
    target: >= 0.75

progression:
  promote_when: accuracy >= 0.85 AND median_latency_ms <= track_target AND neighbor_confusion <= 2
  hold_when: accuracy in [0.65, 0.84] OR latency above target
  fallback_when: accuracy < 0.65 for 2 consecutive sessions
  next_stage: prompts user to advance to next drill-ladder stage or to next track
  previous_stage: returns user to easier corpus (easy-only items, no timer)

storage:
  save_local_results: true
  save_best_scores: true
  save_recent_sessions: true
  save_per_tag_accuracy: true
  save_confusion_matrix: true
  export_format: json
```

## UI Layout (Visual Sketch)

```
+------------------------------------------------------------+
| Semantic Reading Recognition Gym         [Stage 1] [Track A]|
+------------------------------------------------------------+
| Goal: classify the primary function tag of this paragraph  |
+------------------------------------------------------------+
| Round 7 / 20                              Timer: 00:08     |
+------------------------------------------------------------+
|                                                            |
|   An idempotency key is a unique client-generated          |
|   identifier that the server associates with the result    |
|   of a request. If the same key arrives twice, the server  |
|   returns the stored result instead of re-executing the    |
|   operation.                                               |
|                                                            |
+------------------------------------------------------------+
| [ Def ]  [ R ]  [ A ]  [ M ]  [ Q ]                        |
+------------------------------------------------------------+
| Accuracy: 86%   Median latency: 7.2s   Confusions: 1       |
+------------------------------------------------------------+
```

After answer submission, the prompt card swaps to a feedback panel for ~2 seconds:

```
+------------------------------------------------------------+
| ✓ Correct — Def                                            |
| Near-miss: many paragraphs about idempotency contain       |
| relations (R), but the dominant function here is defining  |
| the term itself.                                           |
+------------------------------------------------------------+
```

Session-end summary:

```
+------------------------------------------------------------+
| Session Summary — Track A — Stage 1                        |
+------------------------------------------------------------+
| Accuracy: 17/20 (85%)   Median latency: 7.4s               |
| Suggestion: PROMOTE to Stage 2                             |
+------------------------------------------------------------+
| Per-tag accuracy:                                          |
|   Def  ████████████████░░░░  85%                           |
|   R    ███████████░░░░░░░░░  60%   <- weakest              |
|   A    ███████████████████░  95%                           |
|   M    ████████████████░░░░  80%                           |
|   Q    ████████████████████ 100%                           |
+------------------------------------------------------------+
| Confusion matrix:                                          |
|   You picked R when the answer was Def: 2 times            |
|   You picked Def when the answer was R: 1 time             |
|   <- repair drill: Def vs R discrimination                 |
+------------------------------------------------------------+
| [ Run again ]  [ Switch to Track B ]  [ Repair drill ]     |
+------------------------------------------------------------+
```

The "Repair drill" button auto-generates a 10-round set drawing only from the top-2 confusion pairs. This is the one feature that turns the gym from a quiz into a coach.

## Scoring Model

```
score_per_round = correctness * (1 + latency_bonus)

where:
  correctness = 1 if correct, else 0
  latency_bonus = max(0, (target_ms - actual_ms) / target_ms) capped at 0.5
```

So a correct answer in 4 seconds against a 10-second target scores `1 * (1 + 0.5) = 1.5`. A correct answer at 9.9 seconds scores `1 * (1 + 0.01) = 1.01`. Wrong answers score 0 regardless of speed — speed never compensates for inaccuracy. This is the [Do Not Time Broken Form](wiki/red-queen-skill-gym.md) rule applied at scoring level.

Total session score = sum / round_count, displayed on a 0-1.5 scale.

## Progression Rules

### Track A (Function-Tag)

| Stage | Corpus | Timer | Pass Rule | Promote To |
|---|---|---|---|---|
| 1 | easy only, single domain | none | 8/10 correct, 5 paragraphs in a row | Stage 2 |
| 2 | easy + medium, single domain | 15s | 17/20 correct, median latency <= 12s | Stage 3 |
| 3 | easy + medium, mixed domain | 10s | 17/20 correct, median latency <= 8s, confusion <= 2 | Track B |

### Track B (Mode Selection)

| Stage | Corpus | Timer | Pass Rule | Promote To |
|---|---|---|---|---|
| 1 | mode 1-2 only | 10s | 16/20 correct | Stage 2 |
| 2 | mode 1-3 | 8s | 16/20 correct, median latency <= 7s | Stage 3 |
| 3 | mode 1-5, mixed | 8s | 17/20 correct, median latency <= 6s | Track C |

### Track C (Routing)

| Stage | Corpus | Timer | Pass Rule | Promote To |
|---|---|---|---|---|
| 1 | only items where routing target is unambiguous | 15s | 8/10 correct | Stage 2 |
| 2 | items including `none` (no routing needed) | 12s | 17/20 correct | Stage 3 |
| 3 | full mix including ambiguous routing | 10s | 17/20 correct, median latency <= 9s | gym complete; advance to Execution sub-gym |

### Fallback Rule (all tracks)

If accuracy < 65% for two consecutive sessions, drop one stage and remove timer. Per the universal [Do Not Time Broken Form](wiki/red-queen-skill-gym.md) rule.

## Build Plan

### Stack

- single-file `gyms/semantic-reading-recognition-gym.html`
- vanilla `HTML / CSS / JS`, no CDN, no build step
- match the visual style of `gyms/algorithm-pattern-gym.html` and `gyms/design-patterns-gym.html`
- corpus inlined as a JSON literal at the top of the file
- `localStorage` for session history (last 50 sessions)

### Build Sequence

1. Author the v1 corpus (~50 items) as a JSON file outside the gym, then inline.
2. Build the engine: timer, MCQ rendering, scoring, progress.
3. Build the track selector and stage gating.
4. Build the summary screen with confusion matrix and per-tag accuracy.
5. Build the repair-drill auto-generator from the confusion matrix.
6. Smoke test with 2-3 sessions, tune timers based on real performance.

### Estimated Effort

- corpus authoring: 3-4 hours (one finance article per 10 items, mostly read-and-tag)
- engine build: 4-6 hours (mostly cribbed from existing gyms)
- summary + repair drill: 2-3 hours (new logic)
- total: 1-1.5 days for v1

### Yak-Shaving Filter (per [david-google-prep-protocol.md:55](wiki/david-google-prep-protocol.md:55))

Do NOT build before:
- the v1 corpus (~50 items) is fully authored, not stub data
- one full session has been run on paper / index cards to validate the loop manually

If the manual version is awkward (e.g., latency under 10s feels rushed even on easy items), the gym build is premature — the timer or corpus is wrong, not the engine.

## v1 Exclusions

Explicitly out of scope:

- Execution sub-gym (compression, chunking)
- Retrieval sub-gym (delayed regeneration)
- Stress sub-gym (interruption, mixed-medium)
- LLM-judged free-text scoring
- Multi-paragraph passages
- Cross-session spaced repetition (the gym is rep-based, not SR-based; SR lives in Anki)
- User-authored corpus uploads (v1 corpus is hardcoded)
- Mobile-optimized layout (desktop only for v1)
- Multi-user / cloud sync

These are noted explicitly so v1 stays bounded. Each is a candidate for a v2+ feature page if v1 passes its bar.

## Future Sub-Gyms (Brief Sketch)

### Semantic Reading Execution Gym

- one-sentence compression of a paragraph
- 3-chunk decomposition of a page
- self-rate vs reference answer
- key new metric: `compression ratio` (target: 4-8 source words per output word)

### Semantic Reading Retrieval Gym

- read paragraph, distractor task for 60s, regenerate from memory
- score: word overlap with original, with optional LLM judge for semantic similarity
- key new metric: `regeneration fidelity`

### Semantic Reading Stress Gym

- mixed text types under hard time
- paragraph cut off mid-sentence (the user must continue or recover)
- low-quality scanned PDF text
- key new metrics: `recovery time`, `interruption tolerance`

Each future sub-gym gets its own design page modeled on this one.

## Open Questions

1. **Track selection per session vs forced rotation.** Should the gym let the user pick a track each session, or rotate `A -> B -> C` automatically across sessions to force mixed exposure? Tentative answer: user picks until Track A passes Stage 3, then auto-rotation kicks in.
2. **Corpus drift over time.** Once the user has seen all ~50 items multiple times, recognition becomes pattern-recall instead of paragraph-recognition. Need a corpus refresh rule. Tentative answer: rotate 20% of the corpus per month.
3. **Confusion-pair repair drill.** Is the auto-generated repair drill drawn from the top-2 confusion pairs sufficient, or does it need to also generate explicit contrast pairs (e.g., one Def + one R about the same topic, side by side)? Tentative answer: side-by-side contrast goes into v2.
4. **Domain weighting in the corpus.** Finance reading dominates the v1 seed. When DDIA / Symfony exposure rebalances, how much non-finance content stays? Tentative answer: maintain ~50% finance until immediate fintech-interview pressure passes, then rebalance.

## Bottom Line

The gym is the **first runnable Neural OS gym page** that fully applies [web-gym-generation-schema](./web-gym-generation-schema.md). It targets the upstream skill identified as highest-ROI (semantic reading) on the corpus that doubles as fintech-interview prep (finance reading). It honors the auto-scoring rule by limiting v1 to recognition-mode reflexes, and explicitly defers the open-ended sub-gyms to follow-up pages.

If the v1 build clears its Stage 3 bar in Track A within ~4 weeks, it validates the per-skill-gym pattern across Neural OS and unlocks the same treatment for soroban, language production, design patterns, SOLID, and the algorithm-pattern gym retrofit.

## Related Pages

- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [web-gym-generation-schema](./web-gym-generation-schema.md)
- [semantic-reading-system](./semantic-reading-system.md)
- [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md)
- [drill-generator](./drill-generator.md)
- [drill-ladder-patterns](./drill-ladder-patterns.md)
- david-google-prep-system
- [david-professional-profile](../raw/david-professional-profile.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)


---

## U — See (CAST)
1. First runnable gym for semantic reading
2. Function-tag classification + mode selection + framework routing

## D — Name (NEDF)
1. Semantic reading recognition gym = first sub-gym
2. Distinguisher: timed MCQ format with auto-scoring
3. Failure mode: untimed practice — no reflex pressure

## F — Do (SPEAR)
1. Open gym → tag function under time
2. Log score + confusion

## B — Watch (HEART)
1. Untimed drift
2. Skipping mode-selection

## L — Predict (ORACLE)
1. Paragraph → predict tag in <X sec
2. Confusion → predict drill focus

## R — Act (GRACE)
1. Reading prep → run gym
2. Confusion → targeted drill