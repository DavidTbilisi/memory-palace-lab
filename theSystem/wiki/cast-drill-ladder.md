---
palace: tactical-memory
level: 5
domain: 10
room: 4
glyph: 🧗
wiki_source: wiki/encoders/cast-drill-ladder.md
---

# CAST Drill Ladder

**Summary**: A worked drill-generator instantiation for learning [CAST](./cast-overview.md) from zero familiarity to transferable graph encoding skill.

**Sources**:
- drill-generator.md
- cast-overview.md
- maturity-levels-overview.md
- nodes-and-edges.md
- georgian-animals.md
- system-onboarding-levels.md

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-07-09 — [edge-sign](./edge-sign.md) 16→18 pool note added (gated on its promotion); 2026-07-06 — Stage 4 gained the two measured automaticity flashes (`cast::pattern_flash`, `cast::tier2_vocab_flash`) with METER floors; 2026-05-02 original.

---

## Purpose

This page turns the generic [drill-generator](./drill-generator.md) into a concrete training ladder for CAST.

It answers:

- what to drill first when CAST feels opaque
- how to progress without skipping levels
- what daily practice should look like
- what counts as promotion

## Skill Definition

```yaml
skill: CAST graph encoding
skill_type: graph
why_this_skill_now: encode relations, not isolated facts
target_performance: encode and walk real graphs from memory with low confusion
real_use_case: systems, codebases, arguments, timelines, dependency maps
time_horizon: 3 months
session_length: 30-45m
weekly_frequency: 5x
```

## Real Target

Zenith for CAST does not mean memorizing the animal table only.

It means:

- seeing when a subject is graph-shaped
- assigning node identities cleanly
- encoding edges with the smallest sufficient tier
- placing graphs in a stable palace
- walking the graph without dropping hubs, branches, or loops
- adapting the method to new graph types

## Current-Stage Map

Use this mapping between drill stages and CAST maturity.

| Drill stage | CAST focus | Rough maturity |
|---|---|---|
| `0 Orientation` | why relations matter, node vs edge | 1 |
| `1 Isolation` | animal recall, one Tier 1 edge, one palace stop | 1-2 |
| `2 Clean Repetition` | several nodes and distinct Tier 1 edges | 2-3 |
| `3 Controlled Variation` | small flat graphs with changed surface forms | 3-4 |
| `4 Automaticity` | faster analysis and edge-bundle recall | 4 |
| `5 Mixing` | choose Tier 1 vs Tier 2, hubs vs leaves, graph type shifts | 5-6 |
| `6 Pressure And Noise` | encode while time-boxed, interrupted, or on unfamiliar graphs | 6-8 |
| `7 Transfer And Zenith` | teach, redesign, and encode novel graph classes | 8-10 |

## Primary Failure Modes In CAST

Most beginners fail for one of these reasons:

- `cannot recognize graph shape` -> they memorize terms but miss relations
- `cannot recall animals` -> node identity remains slow
- `cannot execute Tier 1` -> edge scenes stay verbal, not visual
- `confuses neighbors` -> similar edges collide
- `too slow` -> analysis and assignment take too long
- `fails when mixed` -> tree, DAG, loop, and flat network all blur together
- `fails after disruption` -> one missing node breaks the whole walk
- `fails in real conditions` -> can do toy graphs but not real material

## Stage 0: Orientation

Goal:

- understand why CAST exists
- distinguish node from edge
- see that relations are the hard part

Best drills:

- classify 10 statements as `node`, `edge`, or `not a graph item`
- mark source and target in 10 tiny relation pairs
- explain CAST in one sentence from memory

Pass rule:

- 8 out of 10 classifications correct
- one-sentence explanation without notes

Fallback rule:

- if node and edge still blur together, stay here

## Stage 1: Isolation

Goal:

- own the smallest CAST atoms

Best drills:

- recall animals `1-10`
- encode one Tier 1 scene: `source + verb + target`
- walk one 3-locus mini-palace

Daily block:

- 5 min animal flash
- 10 min one-edge scene generation
- 10 min simple loci walk

Pass rule:

- animal `1-10` under 1 second each
- 5 correct Tier 1 scenes in a row
- can walk 3 loci without losing order

Common error owner:

- `cannot recall`

## Stage 2: Clean Repetition

Goal:

- stabilize small clean CAST actions

Best drills:

- animals `1-20` in mixed order
- 10 distinct Tier 1 edges with no collisions
- 5-node flat graph with named edge bundle at each node

Anchor drill:

- given 5 node labels, assign top 5 animals in order

Stretch drill:

- encode one 5-node graph using Tier 1 only

Repair drill:

- if a scene is weak, rewrite it as one merged image

Pass rule:

- 9 out of 10 animal recalls correct
- 5-node graph walked with all nodes and edges intact

Fallback rule:

- if you lose order or need verbal translation, return to Stage 1

## Stage 3: Controlled Variation

Goal:

- prove you own the pattern, not one memorized example

Best drills:

- re-encode the same graph with different domain labels
- swap one verb and explain how the meaning changes
- take the same 5-node graph and place it in a new palace

Daily block:

- one graph from software
- one graph from history or argument
- one reverse drill: hear a scene, name the relation

Pass rule:

- can encode 3 small graphs from different domains with the same workflow
- can decode Tier 1 scenes back into explicit relations

Common error owner:

- `cannot execute`
- `confuses neighbors`

## Stage 4: Automaticity

Goal:

- reduce analysis and encoding latency

Best drills:

- 2-minute in-degree sort
- 3-minute animal assignment
- 5-minute edge-bundle generation
- timed palace walk from hub outward
- pattern flash: rough graph sketch (or one-line structure description) → name the [Lego Skills](./lego-skills-patterns.md) cue (wheel, chain, spiral, leash, dominoes, funnel, diamond, bridge)
- Tier 2 vocab flash: slot question → imagery item and reverse (e.g. "reactive source?" → Dragon; "Water carries what?" → resources/energy) across all 16 Tier 2 options

Target metrics:

- assign top 10 nodes quickly without table lookup
- identify hub, leaves, and bridge nodes on sight
- speak the graph walk with low hesitation
- see the pattern, don't derive it — the 8 cues and 16 Tier 2 items must fire before deliberation starts

Measured drills (`cast::*` namespace, logged per [METER](./meter-overview.md); floor format mirrors the `edge_peg::*` events in [dozenal-edge-peg](./dozenal-edge-peg.md)):

| Event | Operational form | Floor | Working | Target |
|---|---|---|---|---|
| `cast::pattern_flash` | Graph sketch or one-line structure → Lego cue named | ≤3s / ≥80% | ≤5s / ≥70% | ≤2s / ≥95% |
| `cast::tier2_vocab_flash` | Slot question → imagery item, both directions, 16-item pool | ≤2s / ≥90% | ≤3s / ≥80% | ≤1s / ≥95% |

These two flashes are the automaticity gate for large-graph work: until they pass floor, pattern-matching and Tier 2 assembly are still System-2 steps and add load instead of removing it (see [lego-skills-patterns](./lego-skills-patterns.md) §Automaticity target).

If [edge-sign](./edge-sign.md) promotes from candidate status, the `cast::tier2_vocab_flash` pool grows 16 → 18 (interceptor form ↔ inhibits; unmarked ↔ promotes); floors unchanged. Do not add the items before promotion.

Pass rule:

- complete a 5-8 node flat graph in one timed session with no major omissions
- both `cast::*` flash drills at floor or better

Fallback rule:

- if timing breaks accuracy below 80 percent, remove time and return to Stage 3

## Stage 5: Mixing

Goal:

- choose the right CAST move when graph conditions vary

Best drills:

- decide `Tier 1` vs `Tier 2`
- decide `flat palace` vs `nested palace`
- decide `single scene` vs `pattern chunk`
- identify loop, tree, DAG, and hub-spoke from mixed examples

Anchor drill:

- classify 10 edges as `distinct` or `collision`

Stretch drill:

- take one small graph and upgrade only the colliding edges

Repair drill:

- explain exactly why an upgraded edge needed Tier 2

Pass rule:

- 8 out of 10 correct tier decisions
- mixed-tier graph can still be walked cleanly

This is where many learners fake competence. They know Tier 1 but cannot choose tools.

## Stage 6: Pressure And Noise

Goal:

- keep control on unfamiliar or hostile material

Best drills:

- encode a graph from a paragraph under time limit
- continue after a forced interruption
- walk the graph backward from a leaf
- rebuild the missing node after someone hides one scene

Good pressure variants:

- 10-minute encode limit
- switch domains mid-session
- explain while walking
- rebuild from partial cues only

Pass rule:

- can recover after one missing node or interruption
- can encode an unfamiliar 8-12 node graph without collapse

Common error owner:

- `fails after disruption`
- `fails in real conditions`

## Stage 7: Transfer And Zenith

Goal:

- apply CAST beyond drill format

Best drills:

- teach CAST to a beginner using one tiny graph
- compare two encodings of the same graph and justify tradeoffs
- encode one novel graph type not previously practiced
- compress a repeated structure into a pattern chunk

Zenith tests:

- encode a real page from your own vault as a graph
- explain why CAST is better or worse than another framework for that case
- redesign a weak encoding after one review failure

Pass rule:

- one successful real-world encoding plus one teaching or redesign exercise

## First Two Weeks

Use this if you are starting almost from zero.

### Week 1

- Day 1: node vs edge classification, CAST one-sentence explanation
- Day 2: animals `1-5`, one-edge scenes
- Day 3: animals `1-10`, one-edge scenes, 3-locus walk
- Day 4: animals `1-10` mixed, 3-node graph
- Day 5: animals `1-10` timed, 5-node Tier 1 graph

Exit test:

- can explain node vs edge
- can recall animals `1-10`
- can walk one 3-5 node graph

### Week 2

- Day 1: animals `1-15`, edge bundles
- Day 2: 5-node graph from software
- Day 3: 5-node graph from non-software domain
- Day 4: same graph, new palace
- Day 5: timed encode plus verbal graph walk

Exit test:

- 5-node Tier 1 graph encoded and recalled from memory
- no dropped nodes
- no major edge confusion

## Minimum Daily Session

If time is limited, do only this:

1. 5 min animal recall
2. 10 min one small graph encode
3. 5 min graph walk from memory
4. 5 min repair of the weakest scene

That is enough to keep growth moving.

## Weekly Review Questions

- Which stage am I actually in?
- What fails first: identity, relation, placement, or recovery?
- Which animal assignments are still too slow?
- Which edge scenes still collapse into words?
- Am I timing material that is not yet accurate?
- What should be promoted from deliberate drill to lighter maintenance?

## Worked Drill-Generator Snapshot

```yaml
skill: CAST graph encoding
skill_type: graph
target_performance: encode and walk 5-8 node flat graphs from memory
current_stage: 2
failure_mode: cannot execute

anchor_drill:
  family: one-step graph encoding
  prompt_shape: encode 5 Tier 1 edges from a tiny graph
  reps: 5
  constraint: distinct verbs only
  pass_rule: 5/5 scenes retrievable

stretch_drill:
  family: clean graph walk
  prompt_shape: encode and walk one 5-node graph
  reps: 1
  constraint: start at highest in-degree node
  pass_rule: all nodes and edges recalled

repair_drill:
  family: merged-scene repair
  prompt_shape: strengthen the weakest edge by merging source, action, and target
  reps: 3
  constraint: no abstract verbs without imagery
  pass_rule: 3/3 repaired scenes vivid on recall
```

## External reference curve — the Giordano graded curriculum

This ladder's stage volumes and pass-floors were, until now, internally invented. The [Giordano graded curriculum](./giordano-graded-curriculum.md) ("Мнемотехника шаг за шагом") supplies a **decades-run external reference curve** to tune them against — a 5-course / 60-lesson progression (its stage counts cited per [skill-progression-stages](./skill-progression-stages.md)) delivered commercially since the 1990s. (source: Мнемотехника шаг за шагом.pdf)

Three transferable calibration points for this ladder:

- **Volume ramp.** Session volume scales roughly `5 → 25 → 75 → 100` items; number-image codes are drilled ~10 per lesson across lessons 2–11 to a **0.5s recognition floor** before volume climbs. The wiki's Stage 1–4 gates can borrow this curve rather than guessing. (source: Мнемотехника шаг за шагом.pdf)
- **Attention precedes volume.** The curriculum trains sustained attention (*устойчивость внимания*) *before* raising item volume, because ramping volume first causes silent association-overwrite (the [затирание collision](./nodes-and-edges.md)). This validates keeping Stage 0–1 isolation work non-negotiable before Stage 4 automaticity timing. (source: Мнемотехника шаг за шагом.pdf)
- **Graded checkpoint template.** Its 30-item timed test with a 4-band rubric (0–3 excellent · 4–6 good · 7–9 satisfactory · >9 fail) is a ready-made [METER](./meter-overview.md) checkpoint shape for any stage gate here that currently lacks a numeric rubric.

This is a **reference curve, not a replacement ladder** — CAST drills graph-shaped material the Giordano courses never touch; only the volume/attention/checkpoint *pacing* transfers.

## Bottom Line

The correct way to learn CAST is not:

- memorize all tables first
- jump to giant graphs
- time yourself before scenes are stable

The correct order is:

1. orientation
2. animals and one-edge scenes
3. small clean graphs
4. varied small graphs
5. faster analysis
6. mixed graph decisions
7. pressure and recovery
8. transfer into real domains

That is the first real drill ladder for CAST inside Neural OS.

---

## U — See (CAST)
1. Drill ladder for learning CAST itself (zero → transfer)
2. Worked instantiation of the Drill Generator

## D — Name (NEDF)
1. CAST Drill Ladder = how to learn CAST
2. Stages 0..7 specific to graph encoding
3. Reference instantiation of the drill-generator pattern

## F — Do (SPEAR)
1. Learning CAST → enter at stage 0
2. Advance only on stage gate
3. Stuck → drop back one stage

## B — Watch (HEART)
1. Skipping isolation → CAST fundamentals fragile
2. No transfer test → fake mastery
3. Animal / verb choices without contrast

## L — Predict (ORACLE)
1. Ladder completion → CAST fluency on novel graphs
2. Skipping stages → retreat under pressure

## R — Act (GRACE)
1. New CAST learner → start at stage 0
2. CAST failure in the field → re-enter the ladder

## Mnemonic

**"Zero to transferable, one rung at a time."** The ladder runs from no familiarity to graph encoding that carries to material you have never seen — and *transferable* is the bar, not *completed*. Drilling inside one worked example forever is the failure mode the rungs exist to prevent. Stage numbering is owned by [skill-progression-stages](./skill-progression-stages.md).

## Checksum

1. What is the bar the ladder aims at — completion, or transfer to unseen material?
2. Name the three primary beginner failure modes in CAST.
3. What does drilling forever inside one worked example cost you?


## Visual

**Zero to transferable** — and *transferable* is the bar, not *completed*. Stage numbering is owned by [skill-progression-stages](./skill-progression-stages.md).

```
   ▲  TRANSFER      encode a graph you have never seen, cold
   │  ────────────────────────────────────────────────────
   │  VARIATION     same move, deliberately changed inputs
   │  ────────────────────────────────────────────────────
   │  REPETITION    the move, clean, many times
   │  ────────────────────────────────────────────────────
   │  ISOLATION     one move, nothing else in the frame
   │  ────────────────────────────────────────────────────
   └─ ORIENTATION   what a CAST graph even is

   the three beginner failures, by rung:
     cannot recognise graph shape  → stuck at ORIENTATION
     cannot recall animals         → stuck at ISOLATION
     cannot execute Tier 1         → stuck at REPETITION
```

Drilling forever inside one worked example feels like progress and buys none — the top rung is the only one that tests transfer.

