---
palace: meta-knowledge
level: 7
domain: 10
room: 6
semantic_mode: 5
glyph: 🔭
wiki_source: wiki/encoders/oracle-overview.md
---

# ORACLE

**Summary**: ORACLE is the predictive-encoding layer for Neural OS. It owns *anticipation* — turning encoded knowledge into the kind of "knowing what comes next" that fires before deliberation. Where [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), and [HEART](./heart-overview.md) encode *what is*, ORACLE encodes *what is likely* and *what would feel wrong*. It closes gap #2 from [missing-encoding-layers](./missing-encoding-layers.md).

**Sources**:
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [semantic-listening-system](./semantic-listening-system.md)
- [semantic-reading-system](./semantic-reading-system.md)
- algorithm-pattern-gym
- Design conversation, 2026-05-06

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-07 (auto-generation tooling at `tools/meter-oracle/` v0.2.0 — sequential + conditional modes)

---

## Why This Layer Exists

The existing encoders are retrieval-centered. NEDF tells you what merge sort is; SPEAR walks you through how to execute it; CAST shows how it relates to other algorithms; HEART models the people you'd ship it with. None of them train the move where, given a half-typed line of code, you *expect* the next character before you read it. None train the moment in a code review when you sense something is wrong before you can name what.

That predictive move is most of expert performance. It is what fluency feels like in language, debugging, music, sports, social reading, security, and medical diagnosis. Without a layer that owns it, Neural OS is strong at correct retrieval and weak at fluent anticipation.

ORACLE is that layer.

## The Four Flavors

ORACLE handles four distinct kinds of prediction. They are unified into one layer because they share the same encoding contract, but each flavor uses the slots differently and trains under a different workout.

| Flavor             | What gets predicted                        | Typical domains                                         |
| ------------------ | ------------------------------------------ | ------------------------------------------------------- |
| **Sequential**     | The next token / move / step in a sequence | Language fluency, code, music, mid-procedure execution  |
| **Conditional**    | What state X transitions to next           | Systems thinking, debugging, social dynamics            |
| **Distributional** | Of N options, which is most/least likely   | Medical diagnosis, debugging, decision-making           |
| **Anomaly**        | Wrongness sense before explicit analysis   | Proofreading, code review, security, social cue reading |

Every ORACLE card carries a mode tag declaring which flavor it is. The mode determines slot emphasis, workout type, and failure mode.

## ORACLE Slot Structure

Each ORACLE card has six slots whose initials spell the layer's name:

| Slot | Purpose | Required? |
|---|---|---|
| **O**bservation | The situation, preceding state, or input that triggers prediction | Required |
| **R**eading | Your interpretation — the model you have of this situation | Optional |
| **A**nomaly | What would feel wrong; negative cues; wrongness signal | Optional |
| **C**ue | The specific trigger inside the observation that fires the prediction | Required |
| **L**ikelihood | Distribution awareness — what is likely vs. unlikely | Optional |
| **E**stimate | The actual predicted next state, token, distribution top, or right/wrong verdict | Required |

The minimum viable prediction is **O / C / E**: given the observation, when the cue fires, expect the estimate. R, A, and L are the polish that turns rote prediction into robust prediction.

### Slot interpretation per mode

| Mode | O | R | A | C | L | E |
|---|---|---|---|---|---|---|
| **Sequential** | Preceding sequence | Grammar / syntax model | Wrong-token feel | Current position | Base rates | Next token |
| **Conditional** | Current state | State model / mechanism | Impossible state | Transition trigger | Transition probability | Next state |
| **Distributional** | Constraints / evidence | Domain model | Wrong-option flag | Decision point | Full distribution (the load-bearing slot here) | Top option |
| **Anomaly** | Candidate item | What the correct version looks like | Perturbation pattern (the load-bearing slot here) | "Is this right?" trigger | Confidence | Right / wrong verdict |

Notice the load-bearing slot rotates by mode: distributional cards must populate L; anomaly cards must populate A. Sequential and conditional cards can be minimal (O/C/E only) and still work.

## Mode Tagging

Each card declares its mode in two places:

- **Wiki side**: explicit `mode: sequential` (or `conditional` / `distributional` / `anomaly`) field at the top of the card
- **Anki side**: mirrored as `oracle::sequential` / `oracle::conditional` / `oracle::distributional` / `oracle::anomaly` tag

The wiki field is canonical. The Anki tag is a derived view used by the gym for filtering workouts. If they drift, [lifecycle-manager](./lifecycle-manager.md#source-of-truth) applies: Anki for state, wiki for content — but mode is content, so wiki wins on conflict here.

## Architecture: Encoder + Face Hybrid

ORACLE works two ways simultaneously:

**As a fifth encoder**, sitting next to NEDF / CAST / SPEAR / HEART. Material that is fundamentally predictive — language fluency drills, anomaly-detection corpora, code-completion training, move databases — gets its own ORACLE card.

**As a face on existing encoders**, where NEDF / CAST / SPEAR / HEART cards can grow a predictive face that hides one slot and asks the user to predict it. A SPEAR card for merge sort can have an ORACLE face that hides the recurrence step and asks "what comes next?" — no new card created, just an alternate review mode.

The hybrid avoids two failure shapes:
- pure-encoder-only would force redundant re-encoding of every predictive slice already covered by SPEAR or CAST
- pure-face-only would leave dedicated predictive material (anomaly corpora, language sequences) without a home

## Auto-Generation From SPEAR / CAST

SPEAR cards have implicit sequential structure (step N → step N+1). CAST temporal edges have implicit conditional structure (state A → state B). ORACLE can mint a face from either automatically — but only **on demand**, never silently at capture.

### Trigger

```
tm oracle generate <card-id>
tm oracle generate <room>
tm oracle generate <palace>
```

Running the command walks the target's SPEAR steps and CAST temporal edges, mints draft ORACLE faces, and tags them `oracle::draft`. The user reviews each draft, accepts (`oracle::accept`), edits, or rejects (`oracle::reject`). Rejected drafts cool for 90 days before re-proposal, mirroring the [lifecycle-manager](./lifecycle-manager.md#consolidation) dismissal pattern.

### Why on-demand and not automatic-at-capture

Auto-generation at capture creates noise: every SPEAR card silently grows a face the user didn't ask for, and the gym fills with low-quality drafts. On-demand keeps the user in control of when their predictive surface expands, and concentrates ORACLE faces on material the user actively wants to train predictively.

### Why not at sweep time

Coupling ORACLE generation to the [lifecycle-manager](./lifecycle-manager.md) weekly sweep would mix two concerns: lifecycle is about retiring already-encoded material, ORACLE is about expanding the predictive surface. Different concerns, different cadences, different decision logic.

## Ground Truth Sources

Where do correct predictions come from? Mode-dependent, with three sources:

| Source | Best for | Lives at |
|---|---|---|
| **Corpus** | Sequential prediction (language, code, games), anomaly detection (negative-example mining) | `raw/oracle-corpora/<domain>/` |
| **Capture-time** | Conditional prediction (you encode the transition rule), distributional (you encode the base rates from research) | The card itself |
| **Observation log** | Anomaly detection (your actual catches/misses), conditional (your actual transitions vs. predicted) | `wiki/oracle-observation-log.md` |

The observation log is the highest-signal feedback loop. Its format is append-only:

```
2026-05-08 | oracle::sequential | card-id 1714... | predicted "for x in" | actual "for x, y in" | miss
2026-05-08 | oracle::anomaly | card-id 1715... | flagged | confirmed bug | hit
2026-05-09 | oracle::conditional | card-id 1716... | predicted user-retry | actual user-abandon | miss
```

Misses feed into the [red-queen-skill-gym](./red-queen-skill-gym.md) as priority training material on the next workout.

## Gym Integration

ORACLE training runs as a new workout type inside [red-queen-skill-gym](./red-queen-skill-gym.md). It reuses the gym's existing isolation/intensity/RISE machinery rather than spawning a sibling gym.

### Default workout: mixed-mode

A standard ORACLE session pulls cards across all four flavors and mixes them. The user does not know which prediction problem each card will pose. This matches real-world conditions, where you don't know in advance whether you're being asked to complete a sequence, infer a transition, rank options, or detect wrongness.

### Isolation drills (when one mode lags)

When the gym detects one mode underperforming the others, it can switch to single-mode isolation drills:

| Workout | Format | Used when |
|---|---|---|
| **Hide-Estimate** | Show O+C, hide E; user predicts; reveal; mark hit/miss; latency-timed | Sequential or conditional mode lagging |
| **Anomaly-detection** | Show full O+C+E pairs; some correct, some perturbed; user marks right/wrong under time pressure | Anomaly mode lagging |
| **Distribution-ranking** | Show O+C, present 3-5 options; user ranks by likelihood; compare against L slot | Distributional mode lagging |

### Telemetry per card

Every workout logs:
- hit / miss
- latency to prediction
- mode
- card-id

This drives the observation log entries above, and feeds the gym's per-mode accuracy breakdown (mirroring how algorithm-pattern-gym tracks per-pattern accuracy).

## Integration With Existing Layers

| Adjacent layer | Relationship |
|---|---|
| [NEDF](./nedf-overview.md) | NEDF's Failure slot is operational ("this concept breaks in these conditions"); ORACLE's Anomaly slot is sensory ("this prediction would feel wrong"). Adjacent but distinct. A concept can have both. |
| [CAST](./cast-overview.md) | CAST temporal edges auto-generate conditional ORACLE faces on demand. Likelihood weights on edges feed the L slot. |
| [SPEAR](./spear-overview.md) | SPEAR steps auto-generate sequential ORACLE faces on demand. SPEAR's Repair slot maps to anomaly-mode recovery. |
| [HEART](./heart-overview.md) | HEART pattern tags can seed conditional and anomaly ORACLE faces ("when she's quiet on Mondays, expect..."). |
| [UMTF](./universal-mental-tagging-framework.md) | ORACLE's mode field is a new sub-taxonomy under the Pattern tag family — sequential / conditional / distributional / anomaly are all pattern shapes. |
| [red-queen-skill-gym](./red-queen-skill-gym.md) | ORACLE workouts run as a new workout type using existing gym machinery. |
| [lifecycle-manager](./lifecycle-manager.md) | ORACLE cards retire through the same Active → Cold → Archive → Drop ladder; auto-generated faces inherit the lifecycle of their source SPEAR/CAST card. |
| [semantic-listening-system](./semantic-listening-system.md) | The "predict next sentence" mode in semantic listening is a runtime user of sequential ORACLE faces. Listening *uses* ORACLE; ORACLE *encodes* the predictive structure. |
| [semantic-reading-system](./semantic-reading-system.md) | Same relationship — predictive reading consumes sequential ORACLE faces over text corpora. |
| algorithm-pattern-gym | This existing gym is, in retrospect, an instance of distributional ORACLE training (given a problem statement, rank patterns by likelihood). It can be reframed as an ORACLE workout. |

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Mode confusion** | Training a sequential card with anomaly-style perturbed pairs, or a distributional card without populating L | Mode tag is required at capture; gym refuses to schedule cards whose mode and slot population conflict |
| **O without C** | Card has a situation but no firing trigger — never knows when to predict | Capture lint: O-only cards are flagged before they enter rotation |
| **E without R** | Estimate is memorized but not understood; predicts correctly in clean conditions, breaks under perturbation | R is optional but the gym escalates an unpopulated R when prediction misses cluster on edge cases |
| **Faked Anomaly** | A slot lists "wrongness signals" that aren't actually wrong — they're just unrelated alternatives. Trains noise instead of taste | Anomaly-detection workouts surface this: if perturbed pairs are too easy or too random, the A slot needs rewriting |
| **L over-precision** | Likelihood claims "60/30/10" when the user only knows "common / less common / rare." Trains false calibration | L slot accepts ordinal (common / less common / rare) as well as numeric. Use ordinal unless the numeric is sourced |
| **Overcapture of faces** | User runs `tm oracle generate` on a whole palace, mints 200 drafts, accepts most without thought | Drafts default to `oracle::draft`. Only `oracle::accept`-tagged drafts enter gym rotation. Persistent draft backlog is itself a [lifecycle-manager](./lifecycle-manager.md) candidate |
| **Stale corpus drift** | Sequential ORACLE cards trained on an outdated corpus (old API, deprecated grammar) | Corpus files in `raw/oracle-corpora/` carry a `corpus_date`. Cards sourced from corpora older than 24 months get auto-flagged for review |
| **Calibration loss** | User's hit-rate stays high but only because all their cards are easy | Mixed-mode workouts include adversarial draws weighted toward recent misses (from the observation log) |

## What This Layer Does Not Do

To prevent framework drift, ORACLE explicitly does **not**:

- replace any existing encoder (NEDF / CAST / SPEAR / HEART still own their respective question types)
- generate the corpus (you supply the source material; ORACLE encodes predictions over it)
- model fatigue, stress, or cognitive state (that's the next gap — see [missing-encoding-layers](./missing-encoding-layers.md))
- handle social-pragmatic prediction beyond the conditional mode (politeness gradients, subtext, indirectness need their own dedicated layer eventually)
- handle long-horizon planning or strategy (those are different modes — multi-step lookahead is not the same shape as single-step prediction)
- decide what to encode predictively (that's [RAPID](./rapid-in-neural-os.md) capture-layer territory)

It only owns: encoding predictive structure, training prediction reflexes, and tracking prediction performance.

## Worked Examples

### Example 1: Sequential — Python idiom completion

```
mode: sequential
O: for x in sorted(d.items(), key=lambda kv:
C: cursor at lambda body, awaiting key expression
L: kv[1] desc — common (sort by value)
   kv[1] asc — common
   kv[0] — less common (sort by key, redundant since dict order)
E: kv[1]
A: -kv[1] when desc is intended (sign error wrongness)
   d[kv] (KeyError-shaped wrongness)
R: lambda receives a (key, value) tuple from .items(); standard sort-by-value idiom
```

Workout: hide E. Show O+C. User predicts. Compares to E. Logs to observation log.

### Example 2: Conditional — System debugging transition

```
mode: conditional
O: web app: user uploads file > 5MB, hits the /upload endpoint, no progress bar appears for 8 seconds
C: gap between request fire and any server response
L: nginx client_max_body_size rejection — common
   server timeout on synchronous handler — common
   missing Content-Length header — less common
   browser network throttling — rare
E: nginx 413 Payload Too Large response, eventually surfaces as a generic browser error
R: nginx default client_max_body_size is 1M; exceeded uploads are rejected at the proxy layer before reaching the app
A: app logs show the upload request — would mean nginx passed it through, ruling out 413
```

Workout: hide E. Show the situation. User predicts. The R slot becomes the post-mortem material if the prediction misses.

### Example 3: Distributional — Algorithm pattern recognition

This is exactly what algorithm-pattern-gym already does, reframed as ORACLE:

```
mode: distributional
O: "Given an array of integers, return the indices of the two numbers that add up to a target"
C: problem statement parsed, deciding pattern family
L: hash map / lookup — most likely (60%)
   two pointers — possible if sorted (20%)
   brute force — fallback (15%)
   binary search — only if sorted target exists (5%)
E: hash map / lookup
A: applying two-pointers without checking sorted-ness (wrongness pattern)
R: lookup pattern: store complement → index, scan once
```

Workout: distribution-ranking. Show O+C, hide L and E. User ranks the options.

### Example 4: Anomaly — Code review wrongness

```
mode: anomaly
O: Python function:
   def get_user(user_id):
       conn = db.connect()
       result = conn.query(f"SELECT * FROM users WHERE id = {user_id}")
       return result
C: reviewing for safety
L: high confidence wrongness (concrete vulnerability)
E: wrong — SQL injection via f-string interpolation
A: f-string or .format() or % directly into SQL is the perturbation pattern; safe form uses parameterized queries
R: parameterized version: conn.query("SELECT * FROM users WHERE id = ?", (user_id,))
```

Workout: anomaly-detection. Show pairs of O+C+E where some are clean and some have the perturbation. User marks right/wrong under time pressure. Latency matters as much as accuracy — the goal is wrongness sense before explicit analysis.

## Calibration Defaults

Defaults set; tune via [METER](./meter-overview.md) over time. Floor breaches surface in Weekly Review.

| Knob | Default | Floor / pass |
|---|---|---|
| Hit/miss latency (sequential mode, fluent) | <3000ms | Pass <3000ms, floor <5000ms |
| Hit/miss latency (conditional mode) | <5000ms | Pass <5000ms, floor <8000ms |
| Hit/miss latency (distributional mode) | <8000ms | Pass <8000ms, floor <12000ms |
| Hit/miss latency (anomaly mode) | <4000ms | Pass <4000ms, floor <7000ms |
| Hit rate per mode | sequential ≥85%, conditional ≥75%, distributional ≥80% top-1, anomaly ≥85% (FP <15%) | Floor 70% all modes |
| Auto-generated face retirement | <30% hit rate over 10 attempts → retire face | Tunable |
| Mode-confusion detection | Gym refuses to schedule cards whose mode and slot population conflict | Binary, not threshold |
| Distribution precision standard | Ordinal (common / less common / rare) by default; numeric only when sourced | Binary policy |
| Mixed-mode adversarial weight | 25% from recent misses, 75% uniform random | Tune if recent-miss draws over- or under-emphasized |
| Rejection cooldown (auto-generated drafts) | 90 days | Same as lifecycle-manager pattern |

## Timing Signals — C-slot vocabulary for Anticipatory mode

Five named cue types for the C-slot when ORACLE is used in Anticipatory mode (SEE + SENSE steps of the [timing-operative](./timing-operative.md) dialect). Previously unnamed; registered here as the vocabulary the C-slot was missing for environmental-window detection.

| Signal | Dominant UMTF tags | What fires the cue |
|---|---|---|
| **Inflection Point** | Temporal (6) + State (3) | A trend that was falling starts rising, or vice versa |
| **Resource Shift** | Relation (4) + Temporal (6) | Money, attention, or talent moves toward a new area |
| **Behavior Change** | Pattern (5) + State (3) | Actions no longer match the established baseline pattern |
| **Polarity** | State (3) + Priority (7) | Consensus is uniformly pessimistic or uniformly optimistic — an extreme |
| **Convergence** | Relation (4) + Pattern (5) | Multiple independent signals align simultaneously |

**ORACLE mode routing per signal** (Strategy selector): Inflection Point → Conditional mode (what state follows?); Polarity → Distributional mode (what probability mass shifted?); Convergence → Anomaly mode (something would feel wrong about missing this); Behavior Change and Resource Shift → Sequential mode (what comes after a pattern break?).

Full Composite decomposition in [timing-operative](./timing-operative.md).

---

## Integration With METER

Every workout rep emits a METER event including mode, hit/miss, latency, and PULSE state at event. Standard reports surface per-mode hit rate broken down by state (state-conditioned mastery), latency distribution, and per-mode floor/pass status. Calibration suggestions fire after ≥30 sessions of evidence per mode.

## Tooling: `tools/meter-oracle/` (v0.2.0)

The auto-generation half of ORACLE is implemented as a Python CLI at [`tools/meter-oracle/`](../tools/meter-oracle/). Reads an existing Anki note's text, recognizes either step-shaped material (sequential) or CAST temporal edges (conditional), and mints draft ORACLE faces written back to Anki via AnkiConnect.

```
meter-oracle parse --card <id>                              # inspect both extractors
meter-oracle generate --card <id> [--dry-run]               # auto mode (default)
meter-oracle generate --card <id> --mode sequential
meter-oracle generate --card <id> --mode conditional
meter-oracle generate --card <id> --mode both
```

What v0.2.0 implements:

**Sequential mode** (from v0.1.0) — three step-recognizer patterns: `step-prefix` (`Step 1: ...`), `numbered-dot` (`1. ...`), `numbered-paren` (`1) ...`).

**Conditional mode** (new in v0.2.0) — two CAST temporal-edge patterns:
- Arrow style: `A -> B`, `A → B`, `A --> B`, `A ==> B` (with optional trailing parenthesised qualifiers stripped)
- Verb style: 15 transition verbs from CAST's relation vocabulary (causes / feeds / triggers / leads to / produces / transitions to / becomes / generates / drives / results in / spawns / blocks / enables / amplifies / depends on)
- Self-edges and duplicate (source, target) pairs are discarded automatically
- Mixed-shape sources (both arrows and verbs in one card) are recognized as `arrow+verb` pattern

**Auto mode** (default) — runs both extractors, uses whichever found content; if both shapes are present, mints drafts for both.

Drafts tagged `oracle::draft` plus the mode tag (`oracle::sequential` or `oracle::conditional`). User reviews and retags `oracle::accept` to enter gym rotation. One METER event per draft created.

43 unit tests covering parser pattern recognition (numbered + arrow + verb), de-duplication and self-edge filtering, slot population, mode-tag correctness, and AnkiConnect writeback (mocked).

What's deferred:
- Distributional mode generator (v0.3.0+)
- Anomaly mode generator (v0.4.0+)
- LLM-based slot synthesis (Anomaly + Likelihood are empty by default)
- 90-day rejection cooldown enforcement (the convention is documented; tooling is v0.5.0)
- SPEAR-native field extraction (current heuristic operates on combined field text)

Prerequisites: Anki running with the [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on installed.

## Related Pages

- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [semantic-listening-system](./semantic-listening-system.md)
- [semantic-reading-system](./semantic-reading-system.md)
- algorithm-pattern-gym
- [lifecycle-manager](./lifecycle-manager.md)
- [nedf-overview](./nedf-overview.md)
- [cast-overview](./cast-overview.md)
- [spear-overview](./spear-overview.md)
- [heart-overview](./heart-overview.md)
- [meter-overview](./meter-overview.md)
- [pulse-overview](./pulse-overview.md)
- [problem-solving-os](./problem-solving-os.md)
- neural-os-daily-loop


---

## U — See (CAST)
1. Predictive-encoding layer for Neural OS
2. Closes gap #2 from missing-encoding-layers

## D — Name (NEDF)
1. ORACLE = predictive layer
2. Distinguisher: encodes "what is likely" not "what is"
3. Failure mode: building NEDF/CAST without prediction

## F — Do (SPEAR)
1. Encoded material → derive predictions
2. Test predictions in practice → calibrate

## B — Watch (HEART)
1. Prediction skipped
2. Predictions never tested

## L — Predict (ORACLE)
1. New encoding → expect ORACLE complement
2. Domain → predict prediction shape

## R — Act (GRACE)
1. Encoding pass → add ORACLE
2. Surprise → log and recalibrate

## Mnemonic

**"Look · read · notice what's off · name the tell · price it · call it."** O Observation, R Reading, A Anomaly, C Cue, L Likelihood, E Estimate — six moves from seeing to committing a number. The last two are what separate ORACLE from a hunch: an unpriced anomaly is gossip.

## Checksum

1. Name the six slots in order.
2. Which two slots turn an observation into a prediction rather than a note?
3. What is mode confusion in ORACLE, and what prevents it at capture time?


## Visual

**Six slots, one direction** — from something seen to a number you are willing to be wrong about.

```
   see it            price it
   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
   │  O   │─▶│  R   │─▶│  A   │─▶│  C   │─▶│  L   │─▶│  E   │
   │ obs. │  │ read │  │anomaly│ │ cue  │  │likeli│  │ est. │
   └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘
                                    └──── these two ────┘
                                      turn a note into
                                       a prediction
```

Stop before L and E and you have written down an observation. An unpriced anomaly is gossip.

