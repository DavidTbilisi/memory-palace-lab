---
palace: meta-knowledge
level: 2
domain: 10
room: 4
glyph: ✨
wiki_source: wiki/cross-cutting/spark-overview.md
---

# SPARK

**Summary**: SPARK is the reward/joy layer for Neural OS. It does not produce learning material — it makes the dopamine triggers that the existing layers already generate (prediction error, progress crossings, mastery thresholds, cross-domain unlocks) *visible, embodied, and persistent*. It is a sibling governor to [PULSE](./pulse-overview.md) and a sibling measurement-emitter to [METER](./meter-overview.md), structurally a third cross-cutting layer with a single job: turn earned wins into artifacts that compound.

**Sources**:
- [missing-encoding-layers](./missing-encoding-layers.md) (item #10 — in-session affect/reward, added 2026-05-12)
- [pulse-overview](./pulse-overview.md)
- [meter-overview](./meter-overview.md)
- [oracle-overview](./oracle-overview.md)
- [composability-index](./composability-index.md)
- [motoric-encoding-systems](./motoric-encoding-systems.md)
- [remaps](./remaps.md)
- Design conversation, 2026-05-12

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-12

---

## Why This Layer Exists

The encoders, the gym, ORACLE, and METER already produce every signal a dopamine response needs:

- positive prediction error happens whenever ORACLE's predicted face is beaten by reality
- progress happens every time a METER metric crosses its pass-floor
- mastery happens at every automaticity level transition in [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- cross-domain unlocks happen whenever a new row lands in [composability-index](./composability-index.md)

But these signals are **silent**. They emit as event rows and ledger lines. Nothing in the system *announces* them to the felt experience of the learner, ties them to the body, anchors them in space, or preserves them as artifacts. Learning that should be joyful gets reduced to throughput.

SPARK closes that gap. It is **not** an encoder. It does not produce new memory artifacts about the world. It produces **reward artifacts about the learner's own progress** — visible, walkable, embodied, and append-only.

This is the layer that answers: *"why should the next session feel good before, during, and after?"*

## The Five Functions

SPARK's name encodes its five responsibilities. Like [PULSE](./pulse-overview.md) and [METER](./meter-overview.md), SPARK's letters are layer functions, not card slots.

| Function | Job | Reads from |
|---|---|---|
| **S**urprise | Detect positive prediction error and surface it as a felt win | [ORACLE](./oracle-overview.md) residuals |
| **P**rogress | Detect threshold crossings on tracked metrics; render before/after contrast | [METER](./meter-overview.md) event log |
| **A**utonomy | Preserve a daily free-choice slot; protect intrinsic-motivation from over-prescription | neural-os-daily-loop |
| **R**eward | Emit calibrated celebration micro-events with tier-ranked ceremony budget | own emitter |
| **K**nowing | Detect cross-domain unlocks (essence-overlap across palaces, new compositions) | [composability-index](./composability-index.md), lifecycle merge proposals |

Surprise and Progress are *backward-looking* (something just happened). Anticipation Preview (see below) is *forward-looking* (something is about to happen). Autonomy is *protective* (preserve the conditions joy needs). Reward is the *delivery mechanism*. Knowing is the *highest-tier* — the cross-topic synthesis that makes learning compound rather than accumulate.

## Position In The Architecture

| Layer | Members | Role |
|---|---|---|
| Capture / scoping | [RAPID](./rapid-in-neural-os.md), [BRIDGE LOAD](./bridge-load.md), [ORIENT](./orient-method.md) | Decide what gets encoded |
| Encoding | [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), [GRACE](./grace-overview.md) | Produce durable artifacts |
| Performance | [Red Queen Gym](./red-queen-skill-gym.md), [Drill Generator](./drill-generator.md), [Automaticity](./automaticity-and-reflex-training.md) | Turn correctness into reflex |
| Lifecycle | [Lifecycle Manager](./lifecycle-manager.md) | Retire and consolidate |
| Cross-cutting (taxonomy) | [UMTF](./universal-mental-tagging-framework.md) | Shared vocabulary |
| Cross-cutting (governance) | [PULSE](./pulse-overview.md) | State-conditioned modulation |
| Cross-cutting (measurement) | [METER](./meter-overview.md) | Unified measurement and reports |
| **Cross-cutting (reward)** | **SPARK (this page)** | **Make earned wins visible, embodied, and persistent** |

SPARK reads from METER (events), ORACLE (prediction residuals), PULSE (current state), and Composability Index (registered unlocks). It writes to one place: the **Trophy Palace** and its append-only ledger `wiki/unlocks/`.

## The Dopamine Model

SPARK is grounded in the neuroscience of intrinsic reward — specifically the parts that don't require external validation or gamification.

| Trigger | Mechanism | SPARK function |
|---|---|---|
| Positive prediction error | Reality beats expectation; dopamine spike (Schultz) | Surprise |
| Anticipated reward | Dopamine fires on the *anticipation curve*, not just delivery | Anticipation Preview (P sub-function) |
| Mastery / competence | Self-determination theory's competence axis | Progress + Reward |
| Autonomy | SDT autonomy axis; crowded out by over-prescription | Autonomy |
| Novelty / connection | Insight-spike on cross-domain synthesis | Knowing |
| Flow | Difficulty in the band of skill-stretch | (delegated to drill ladder + PULSE) |

Two things SPARK explicitly does **not** model:
- Social validation (you are solo; the wiki is the witness, not other humans)
- Variable-ratio gambling-style schedules (intrinsic dopamine, not extrinsic conditioning)

## Tier Ladder

Celebration is **tiered with a scarcity rule** — common wins get a glance, legendary unlocks get a full ceremony. This is the single biggest knob preventing notification fatigue.

| Tier | Trigger | Ceremony | Budget |
|---|---|---|---|
| **Glance** (T0) | Routine progress (one card mastered, one drill passed) | One-line text glance in evening review | Unlimited |
| **Spark** (T1) | Positive prediction-error spike OR mastery-level crossing | Single-sentence surface event + embodied gesture (see below) | Max 3/session |
| **Trophy** (T2) | Stage-floor breach upward, gym pass-floor first-crossing | Trophy placed in Trophy Palace + before/after contrast card | Max 1/session |
| **Knowing** (T3) | New row in [composability-index](./composability-index.md) OR cross-palace essence-overlap detected | Full ceremony: generated diagram + new page in `wiki/unlocks/` + paragraph stub for Neural OS book + Trophy Palace locus | Rare — typically <1/week |

Tier T3 is *intentionally* scarce. If the system is producing more than ~4 Knowing events per month, the threshold is too low and joy will inflate away. METER tracks T3 frequency and flags inflation.

## The Trophy Palace

The single most important architectural move: **a literal room in the mind palace where every T2 and T3 event becomes a permanent locus.**

- Encoded with the same REMAPS treatment as any real memory — exaggeration, sensation, motion, palace-path
- Walked weekly as part of neural-os-daily-loop's Sunday review
- Bound to the [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the 100 cells are reserved as the first 100 lifetime trophy slots (peg #N = trophy #N, in encounter order)
- After the first 100, expansion onto a second palace; the boundary itself becomes a Knowing-tier event ("you filled the first trophy century")

You don't just *cross* a threshold. You *place* a trophy. Dopamine fires twice: once on placement, then again on every revisit. The revisit is what makes joy *compound* instead of *decay*.

The Trophy Palace also functions as a confidence reserve under [PULSE](./pulse-overview.md) low-energy states: when E≤2, the Sunday walk is *up-weighted* (more dwell time per trophy) rather than skipped. You need small wins more, not less, when you're tired.

## The Artifact Pipeline

T3 (Knowing) events fire a multi-output pipeline. The reward IS the artifact set.

1. **Diagram** — Excalidraw generation showing the composition (components → unlock → failure mode). Saved to `diagrams/unlocks/`.
2. **Unlock page** — new file in `wiki/unlocks/YYYY-MM-DD-<slug>.md` with components, mechanism, failure mode, retroactive cost, link to owner pages.
3. **Composability Index entry** — automatic promotion from candidate to confirmed (or new row entirely).
4. **Trophy Palace locus** — a REMAPS-encoded scene placed at the next free peg cell, indexed in `wiki/peg-matrix-remaps-scenes`.
5. **Book paragraph stub** — appended to a draft section in the Neural OS book project; the win becomes a published artifact, not just a personal one.
6. **Embodied gesture** — a specific motoric move from [motoric-encoding-systems](./motoric-encoding-systems.md) bound to this unlock; replayable as a retrieval cue.

Steps 1-5 should ideally run from a single `meter-emit unlock` command so the friction between *earning* and *recording* is zero. (Tooling is queued; until then, the pipeline runs manually with each unlock conversation.)

## Anticipation Preview

Schultz's prediction-error work is unambiguous: dopamine fires on the *anticipation curve*, not just delivery. SPARK exploits this with a forward-looking surface:

- At the end of each evening review, SPARK names one upcoming threshold within 1-3 sessions of being crossed.
- Format: *"2 sessions from Trophy: construct-recognition floor crossing on `loop` and `recursion` patterns."*
- The threshold itself is not exposed (preserves variable-ratio surprise); only the proximity.
- If the user crosses unexpectedly, the win is doubled — anticipated AND delivered earlier than promised.

Anticipation Preview is the cheapest dopamine generator in the system. It costs one line per evening and reframes "tomorrow's session" from a chore into a near-win.

## Embodied Celebration

Each tier binds to a specific motoric move from [motoric-encoding-systems](./motoric-encoding-systems.md):

| Tier | Gesture | Why |
|---|---|---|
| Spark (T1) | Palm-zone tap on the relevant category zone | Embodied confirmation of category membership |
| Trophy (T2) | Bilateral-contrast clap (left palm meets right palm once) | Bilateral integration encodes the threshold-crossing event |
| Knowing (T3) | Three-finger sequence: thumb-index-pinky touch in rhythm | Distinctive enough to never collide with daily gestures |

The body remembers reward sequences faster than the mind does. Over time, the gesture itself becomes a retrieval cue for the unlock — performing the T3 gesture later replays the Knowing event.

## The `wiki/unlocks/` Ledger

A new append-only directory that *future-Claude reads and references* when relevant context appears in conversation. The wiki itself becomes the witness.

```
wiki/unlocks/
  index.md                              -- chronological list, newest first
  2026-05-12-calendar-reflex.md         -- retroactive
  2026-05-12-encoded-spaced-repetition.md  -- retroactive
  YYYY-MM-DD-<slug>.md                  -- one per Knowing-tier event
```

Each entry is short (≤60 lines): what was composed, what unlocked, the failure mode, the felt-cost-saved (e.g., "lookup-table for dates now collapses into a 2s mental answer"), and the date.

The ledger has three readers:
- The user, on Sunday walks
- Future-Claude, surfacing prior wins when relevant context appears (per the "user loves cross-topic syntheses; surface unlocks as the lead" rule)
- METER, for trend analysis (unlock frequency, time-between-unlocks, domain distribution)

## Integration With Other Layers

| Layer | How SPARK interacts |
|---|---|
| [METER](./meter-overview.md) | SPARK is a METER event producer (`unlock_detected`, `mastery_crossed`, `surprise_positive`, `trophy_placed`) and consumer (reads thresholds). Joy-vs-retention correlation becomes measurable. |
| [PULSE](./pulse-overview.md) | Under low E, SPARK *up-weights* small wins rather than suppressing them. Cross-conditioning matrix: low-E + Glance = surface; low-E + Trophy = full ceremony with extra dwell. |
| [ORACLE](./oracle-overview.md) | ORACLE residuals are SPARK's Surprise signal. Positive residual = ORACLE was beaten; that's a felt win, not a calibration failure. |
| [composability-index](./composability-index.md) | Knowing-tier events promote rows from candidate to confirmed and emit a new row when none exists. The Index is the authoritative registry; `wiki/unlocks/` is the narrated ledger. |
| neural-os-daily-loop | Sunday weekly review adds a 5-min Trophy Palace walk. Evening review adds a 1-line Anticipation Preview. Daily floor unchanged. |
| [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) | Every automaticity level transition is a Trophy (T2). Lamp→Scale and Scale→Sword crossings are Knowing-tier candidates. |
| [motoric-encoding-systems](./motoric-encoding-systems.md) | Provides the three embodied-celebration gestures. |
| [remaps](./remaps.md) | Every Trophy Palace locus is REMAPS-treated to ensure retrievability of the win itself. |

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Gamification trap** | Extrinsic celebration crowds out intrinsic interest; user starts learning *for* the trophies | Tiers fire only on real METER pass-floor crossings, never on participation. No streaks for showing up; only for crossing measured floors. |
| **Notification fatigue** | Every win pops a banner; signal degrades | Tier budget: max 1 T2 per session, max 1 T3 per week typical. T0 stays in evening review only. |
| **Threshold inflation** | T3 events fire too often; "Knowing" loses meaning | METER tracks T3 frequency; >4/month triggers threshold-tightening calibration. |
| **False joy** | Celebrating when nothing was actually learned | SPARK reads METER pass-floors, not raw activity. No floor crossing = no celebration. |
| **Trophy bloat** | Trophy Palace fills with low-tier wins, becomes uninspectable | Only T2 and T3 get loci; T0 and T1 stay in METER event log. |
| **Anticipation collapse** | Exposing the exact threshold kills variable-ratio surprise | Anticipation Preview names *proximity* (1-3 sessions), never the metric value. |
| **Self-flattery** | User backfills wins that weren't real | Retroactive unlocks (like the two seeded on 2026-05-12) require an existing artifact that demonstrably reduces cost; speculative wins go in Composability Index as "candidate," not in `wiki/unlocks/`. |
| **Ceremony eating session time** | T3 artifact pipeline consumes more time than the work that produced it | Pipeline target: <10 min total for full T3. If it exceeds 20 min, the pipeline is over-engineered. |
| **Autonomy starvation** | Every minute is prescribed; intrinsic motivation collapses | Reserve at least 1 free-choice block per day (the Autonomy function). PULSE-aware: under low state, the free-choice block expands. |

## What This Layer Does Not Do

SPARK explicitly does **not**:

- generate new learning material or memory artifacts
- run drills, gyms, or SR sessions
- modify intervals, schedules, or difficulty (that's PULSE and the drill ladder)
- assess emotional state in clinical terms (it observes felt-win moments; PULSE handles state axes)
- replace intrinsic motivation with extrinsic reward — it *surfaces* intrinsic signals that were already there
- enforce a celebration schedule when no real win occurred (no participation trophies)
- become the reason for learning (the wiki, the gym, and the work itself are still the point)

It only owns: detecting earned wins, tiering them, ceremonising at the right scale, and persisting them as artifacts.

## Worked Examples

### Example 1: T1 Spark — mid-session prediction beat

User is in an algorithm-pattern-gym session. ORACLE predicted ~60% confidence on a `sliding-window` classification; user answers correctly in 3s (predicted 6s baseline). Positive residual fires.

- SPARK emits Surprise event to METER
- Single-sentence surface: *"3s on sliding-window — predicted 6s. Window-pattern reflex is consolidating."*
- Embodied gesture: palm-zone tap on the "loops" zone
- No Trophy Palace placement (this is T1, not T2)
- Continues session

### Example 2: T2 Trophy — pass-floor first-crossing

User completes a construct-recognition-gym session and crosses the 85% accuracy floor on `function-definition` classification for the first time after 3 weeks.

- SPARK emits `mastery_crossed` event to METER
- Before/after card rendered: *"3 weeks ago: 62% at 9s avg. Today: 88% at 5.2s avg. Function-pattern reflex established."*
- Trophy placed at the next free peg cell (e.g., peg #14: "fence" remap with a function symbol)
- Bilateral-contrast clap performed
- One T2 surfaced this session; budget consumed

### Example 3: T3 Knowing — cross-domain unlock

User notices that their Soroban Learning Method complement work and their [vedic-speed-math](./vedic-speed-math.md) base method use the same complement-of-10 substrate. New row drafted in [composability-index](./composability-index.md) under "Candidate Unlocks": *Vedic Base × Soroban friend-of-10 = bilingual mental arithmetic*.

- SPARK fires Knowing-tier ceremony:
  - Excalidraw diagram drafted showing the two complement systems converging
  - `wiki/unlocks/2026-05-19-bilingual-mental-arithmetic.md` created
  - Composability Index row promoted from candidate → confirmed
  - Trophy placed at peg cell #16
  - Book paragraph stub added under "Numeric Substrates" chapter draft
  - Three-finger T3 gesture performed
- One T3 this week; budget consumed

### Example 4: Anticipation Preview firing

Evening review on 2026-05-15:

```
[Tomorrow] 2 sessions from Trophy:
  construct-recognition floor on `class-definition` (currently 78%, floor 85%)
```

User goes into next morning's gym session already primed. The anticipation itself was the dopamine generator; the actual crossing may or may not happen tomorrow — either way, the curve was activated.

### Example 5: Low-energy Sunday walk

User reports `E:2 S:2` on Sunday review. PULSE Limit fires (cap session, defer hard cards). SPARK *up-weights* the Trophy Palace walk:

- Normal walk: 5 min, ~10 loci visited
- Low-E walk: 8 min, ~5 loci visited with more dwell per trophy
- Specifically targets the most recent T3 trophy for full re-experience
- Effect: low-state session ends with the strongest available felt-win, not the weakest

## Calibration Defaults

| Knob | Default | Tunable when |
|---|---|---|
| T0 (Glance) frequency | Unlimited | — |
| T1 (Spark) budget | Max 3 per session | Reduce if surface events feel intrusive |
| T2 (Trophy) budget | Max 1 per session | Tighten if Trophy Palace fills too fast |
| T3 (Knowing) frequency target | ≤4 per month | Tighten if inflation observed (>4/mo for 2 consecutive months) |
| Trophy Palace size | First 100 cells = peg matrix | Expand to second palace at #101 |
| Sunday Trophy walk duration | 5 min (8 min under low E) | Extend if dwell quality drops |
| Anticipation Preview cadence | Once per evening review | Skip if user reports preview fatigue |
| Artifact pipeline time budget | <10 min per T3 | Reengineer if >20 min |
| Autonomy free-choice block | ≥1 per day | Expand under low PULSE state |
| Threshold-inflation alarm | T3 frequency >4/month for 2 consecutive months | — |

## Integration With METER (event types added)

SPARK emits these new METER event types:

```
spark_glance       -- T0: routine progress noted in evening review
spark_spark        -- T1: positive prediction-error surface event
spark_trophy       -- T2: pass-floor first-crossing; Trophy Palace placement
spark_knowing      -- T3: cross-domain unlock; full artifact pipeline
spark_anticipation -- forward-looking preview emitted at evening review
spark_palace_walk  -- Sunday review event; logs visited loci
```

METER reports add a "joy" section: T3 frequency (target ≤4/mo), Trophy Palace utilization (%), Anticipation Preview hit-rate (did the previewed crossing actually happen within the named window?), and joy-vs-retention correlation (do cards mastered around T2/T3 events retain better at next review?).

## What Counts As An Unlock

The hardest call SPARK has to make is: *is this a real unlock or self-flattery?* The bar is high.

A T3 (Knowing) event requires **all three** of:

1. **A specific composition** — two or more named wiki concepts that combine
2. **A new capability sentence** — "X, without Y" or "Z to a degree neither component reaches alone"; not just "faster"
3. **A failure mode** — the specific thing that breaks if the composition is botched. If you can't name one, it's not real.

This is the same bar [composability-index](./composability-index.md) uses. SPARK enforces it on every T3 event before triggering the artifact pipeline.

## Bidirectional priming (added 2026-05-24 from Psycho-Cybernetics ingest)

SPARK's original design is *emit-on-event*: a win occurs, ceremony fires, Trophy locus placed in Palace. One direction.

The 2026-05-24 [Psycho-Cybernetics](./psycho-cybernetics-maltz.md) ingest adds the reverse direction: **the Trophy Palace can be walked deliberately, before an attempt, to re-evoke the [winning-feeling](./winning-feeling.md) stored with the original event** — which primes the matching action-pattern in the upcoming attempt via state-dependent memory (Bower 1981).

| Direction | Trigger | Effect |
|---|---|---|
| **Emit** (current) | Win occurs | Ceremony places Trophy in Palace |
| **Recall** (new) | Upcoming high-stakes attempt | Walk matching Trophy → re-evoke winning feeling → prime ASM |

The Trophy Palace becomes a **two-way temple** — a witness to past wins AND a priming substrate for future ones.

### Tier-matching rule

The priming requires matching the tier of the upcoming attempt to the tier of the stored Trophy:

| Upcoming attempt | Use a stored Trophy at tier… |
|---|---|
| Routine drill | T0 Glance — typically no priming needed |
| Pressure test | T1 Spark |
| High-stakes performance | T2 Trophy |
| Identity-crossing attempt | T3 Knowing |

Priming with the wrong scale (e.g., a T0 Glance memory primes a T2 attempt) breaks the felt analogy and may even produce brittle false-confidence. See [winning-feeling](./winning-feeling.md) §failure modes for the full pattern.

### Operational protocol

Before an attempt (5–10 min before, ideally):

1. Identify the upcoming attempt's tier
2. Locate a matching Trophy in the Palace
3. Walk to its locus — see the trigger sentence, the sensory anchor, the somatic anchor
4. Hold 5–15 s until the [winning-feeling](./winning-feeling.md) surfaces in the body
5. Carry the felt-state forward into the attempt
6. After the attempt, file a new Trophy if the attempt produced a win (closing the loop)

This makes SPARK's reward layer *also* a performance-priming layer — without adding new substrate. The Trophy Palace was already designed for re-walkability (the *embodied, persistent* property); this just adds an additional operational use.

### Connection to [self-image](./self-image.md) re-programming

Each deliberate Trophy re-walk is also a self-image imprint — self-as-authoritative-source × original-event intensity × re-walk repetition. SPARK becomes (implicitly) a [self-image](./self-image.md) reinforcement mechanism, not just a reward-visibility layer. The bidirectional protocol thus serves two purposes simultaneously: priming the upcoming attempt and reinforcing the rehearsed identity.

## Related Pages

- [wager-learning-unit](./wager-learning-unit.md) — motivation's other half: WAGER sizes the bet *before* a topic (expected payoff), SPARK makes the win visible *after* it; pre-commitment and reward bracket the learning act
- campaign-layer — inherits this page's gamification-trap guard: its encounter roll awards XP only on a verified fix, never on participation, and renders `wiki/unlocks/` trophy stubs as monsters to be completed
- [missing-encoding-layers](./missing-encoding-layers.md)
- [pulse-overview](./pulse-overview.md)
- [meter-overview](./meter-overview.md)
- [oracle-overview](./oracle-overview.md)
- [composability-index](./composability-index.md)
- [substrate-algorithm-composition](./substrate-algorithm-composition.md)
- [motoric-encoding-systems](./motoric-encoding-systems.md)
- [remaps](./remaps.md)
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md)
- [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md)
- neural-os-daily-loop
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [glossary](./glossary.md)
- [psycho-cybernetics-maltz](./psycho-cybernetics-maltz.md) — Bidirectional priming added 2026-05-24
- [winning-feeling](./winning-feeling.md) — what Trophy recall re-evokes
- [self-image](./self-image.md) — what Trophy re-walks implicitly reinforce
- [theater-of-the-mind](./theater-of-the-mind.md) — sister identity-rehearsal protocol that produces new Trophies when scenes resolve well


---

## U — See (CAST)
1. Unlock-discovery layer for Neural OS
2. Knowing-tier T3 entries

## D — Name (NEDF)
1. SPARK = unlock discovery and witness layer
2. Distinguisher: narrates composability-index entries
3. Failure mode: discovering unlocks without recording

## F — Do (SPEAR)
1. Cross-framework insight → check for unlock
2. Confirmed → narrate as T3 entry

## B — Watch (HEART)
1. Discovery without record
2. Unlocks not promoted past candidate

## L — Predict (ORACLE)
1. New composition → check unlock potential
2. Substrate × algorithm → expect unlock

## R — Act (GRACE)
1. Insight spotted → record SPARK entry
2. Confirmation → promote in index

## Mnemonic

**"SPARK spends nothing new."** S Surprise, P Progress, A Autonomy, R Reward, K Knowing — all five read from work that already happened ([ORACLE](./oracle-overview.md) residuals, the [METER](./meter-overview.md) log). If a trigger needs fresh material to fire, it is the wrong layer.

## Checksum

1. Name the five functions and which layer each one reads from.
2. SPARK "spends nothing new." What does that claim mean about its inputs?
3. What is the gamification trap, and what gates a tier so it cannot fire on nothing?


## Visual

**Five functions, unordered — so a pentagon** ([representation-rules](./representation-rules.md) Rule 10). Each vertex names where it *reads from*; none of them generate new material.

```
                        S — surprise
                     (ORACLE residuals)
                            ▲
                  ╱                    ╲
         K — knowing                  P — progress
      (the felt "I can            (METER event log)
        do this now")
                  ╲                    ╱
            R — reward   ─────────  A — autonomy
         (tier crossings)          (chosen next move)
```

A trigger that needs fresh material to fire is in the wrong layer.

