---
palace: tactical-memory
level: 4
domain: 10
room: 2
wiki_source: wiki/learning-systems/palace-classification-drill-ladder.md
---

# Palace Classification Drill Ladder

**Summary**: A worked [drill-generator](./drill-generator.md) instantiation for the palace classification reflex — taking the 3-axis address scheme from [Memory Palace](./memory-palace-architecture-for-neural-os.md) and [Mind Palace - Personal Layout](../raw/05 Meta_Knowledge/Mind Palace - Personal Layout.md) from explicit deliberation into automatic emission of `Palace x Level x Domain?` for any new concept in under 12 seconds. Drill companion to [palace-classification-gym](./palace-classification-gym.md).

**Sources**:
- [Mind Palace - Personal Layout](../raw/05 Meta_Knowledge/Mind Palace - Personal Layout.md)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [drill-generator](./drill-generator.md)
- [drill-ladder-patterns](./drill-ladder-patterns.md)
- [palace-classification-gym](./palace-classification-gym.md)
- design-patterns-drill-ladder

**Last updated**: 2026-05-17

---

## Purpose

This page turns the generic [drill-generator](./drill-generator.md) into a concrete training ladder for *automatic note classification* — picking palace, level, and domain at capture time without stopping the rest of the workflow to deliberate.

It answers:

- how to make the changeability question the *only* question that picks palace
- how to default new concepts to Level 1 without ego inflation
- how to default to no-domain unless retrieval would actually benefit
- how to resolve the predictable neighbor confusions (`Strategic ↔ Tactical`, `Reflective ↔ Meta`, `Core ↔ Strategic`, `Buffer ↔ Tactical`) under speed
- how to handle multi-valid items where the same concept legitimately fits two palaces

Most users stop at "I know the 6 palaces." The ladder closes the gap to capture-speed reflex — at which point the system becomes self-organizing rather than a maintenance burden.

## Skill Definition

```yaml
skill: palace classification reflex
skill_type: judgment
why_this_skill_now: every new concept needs an address at capture time; deliberating each one breaks the capture flow, and skipping classification means notes pile up uncategorized in Buffer forever
target_performance: emit Palace x Level x Domain? for any one-line concept in under 12 seconds, with palace accuracy ≥85%, level discipline ≥90%, domain restraint ≥85%, over-promote rate ≤10%
real_use_case: real-time note capture, inbox processing, daily-loop review, ingest of new raw/ files
time_horizon: 4-6 weeks
session_length: 12-20m
weekly_frequency: 5x
```

## Real Target

Zenith for palace classification is not:

- memorizing the 6 palace names
- reciting the 10 Wheel of Life domains in order
- being able to argue palace assignments in long-form
- producing a thoughtful `Why here:` paragraph for each note

Zenith means:

- a fresh concept arrives → address emerges in under 12s without breaking flow
- "how changeable is this?" is the *only* question asked for palace selection
- Level defaults to 1 unless promotion is genuinely earned
- Domain defaults to `skip` unless retrieval would actually benefit
- multi-valid concepts are recognized as such (not stalled on)
- the address gets written and the next note begins

## Current-Stage Map

| Drill stage | Palace classification focus |
|---|---|
| `0 Orientation` | the 6 palaces by changeability, the 10 levels, the 10 default domains |
| `1 Isolation` | one axis at a time, untimed, single-valid items only |
| `2 Clean Repetition` | one axis, timed (12s → 6s), single-valid items |
| `3 Controlled Variation` | one axis, mixed stability levels and domains within the prompt set |
| `4 Automaticity` | mixed across axes per round (sub-drills fire randomly) |
| `5 Mixing` | full address per round, all 3 axes; introduce multi-valid items |
| `6 Pressure And Noise` | full address under 12s with decoys (importance-bias traps), real-inbox load |
| `7 Transfer And Zenith` | classify a fresh concept *as it arrives in life* (not in the gym), without stopping the capture |

## Primary Failure Modes In Palace Classification

- `cannot recognize` → reads the concept, cannot locate the palace
- `cannot recall` → knows the palace exists, blanks on which 6 they are
- `importance bias` → picks `Strategic` because the concept feels important, when changeability says `Tactical`
- `ego inflation` → promotes new concepts to Level 5+ on first capture (over-promote)
- `decoration habit` → picks a domain on every note, against the source's "only if retrieval benefits" rule (over-domain)
- `confuses neighbors` → `Strategic ↔ Tactical` (importance vs operationality), `Reflective ↔ Meta` (self-interpretation vs learning-architecture), `Core ↔ Strategic` (immutable vs slowly-revisable), `Buffer ↔ Tactical` (unknown vs known-tool)
- `buffer overflow` → defaults everything to `Buffer` to dodge the changeability question
- `multi-valid stall` → freezes on concepts that legitimately fit two palaces
- `too slow` → can produce the right address eventually, but breaks capture flow doing it
- `slogan only` → cites the system in conversation without actually addressing own notes

## Core Practice Rule

Three modes per session:

- `slow mode` → untimed, name palace + level + domain + the one-sentence `Why here:` line
- `clean mode` → timed per sub-drill (6s palace, 6s level, 4s domain), no `Why here:` line
- `speed mode` → 12s for the full address, no `Why here:`, decoys and multi-valid mixed in

Never enter `speed mode` while `Strategic ↔ Tactical` still blurs.

## Stage 0: Orientation

Goal:

- know the 6 palaces by changeability, the 10 levels, the 10 default domains
- know the three default rules: palace by changeability only, Level 1 on capture, `skip` on domain unless retrieval benefits

Best drills:

- read the source's stability gradient ("Core → Strategic → Tactical → Reflective → Meta → Buffer") and the 5 worked examples
- restate each palace in one sentence about changeability (not importance, not domain)
- list the 10 domains by number; numbering is permanent because it locks the peg image
- restate the three defaults aloud

Pass rule:

- can recite the 6 palaces in stability order
- can give each palace's one-sentence changeability definition
- can state all 3 defaults

Fallback rule:

- if `Strategic` and `Tactical` still feel fuzzy, stay here

## Stage 1: Isolation

Goal:

- own one axis at a time on single-valid items, untimed

Best drills:

- **Palace-only**: see one concept, name palace, write one-sentence rationale. 10 items.
- **Level-only**: see one concept + claimed level, pick `stay 1` or `earn` + name the carrier. 10 items.
- **Domain-only**: see one concept, pick `skip` or one of 10. 10 items.

Daily block (15 min):

- 5 min: one axis only, 10 items, untimed
- 5 min: review the misses, name the rule violated
- 5 min: rewrite each missed rationale per the source's wording

Pass rule:

- 9/10 on a single-axis set, untimed
- can name the rule violated on every miss

Common error owner:

- `cannot recognize`
- `cannot recall`

## Stage 2: Clean Repetition

Goal:

- one axis, timed, single-valid items, accuracy stays high

Best drills:

- Palace-only, 6s timer, 15 items, palette of 5 concepts per palace
- Level-only, 6s timer, 15 items, mostly fresh-capture (correct answer = `stay 1`)
- Domain-only, 4s timer, 15 items, 80% generic (correct answer = `skip`)

Anchor drill:

- one axis, 15 items at target timer

Stretch drill:

- one axis, 20 items, mix of difficulty

Repair drill:

- on every miss, write the one-sentence rationale per the source's stability gradient or default rules

Pass rule:

- `90%+` per-axis accuracy at target timer
- per-axis confusion pair surfaces ≤2 of 15

Fallback rule:

- if accuracy drops at the timer, drop to untimed Stage 1

## Stage 3: Controlled Variation

Goal:

- one axis, varied surface forms, prove the reflex is on the rule not on memorized examples

Best drills:

- Palace-only with 5 problems each from different domains (programming, money, EGW quote, hobby, news capture)
- Level-only with 5 fresh-capture items + 5 promotion-judgment items (concept + usage history + claimed level)
- Domain-only with 50% generic + 50% domain-flavored items

Daily block (15 min):

- 5 min: warm-up on stable axis
- 8 min: target axis, 10 varied items at timer
- 2 min: log neighbor confusion

Pass rule:

- 90% accuracy across surface variations on the target axis
- no single domain category causes accuracy to collapse on that axis

## Stage 4: Automaticity

Goal:

- mixed across axes per round (Scale mode), 6-8s per sub-drill prompt

Best drills:

- 20-round session, each round randomly fires one of the three sub-drills
- timer is per-sub-drill (6s palace, 6s level, 4s domain)
- per-axis accuracy and per-axis latency tracked separately

Daily block (15 min):

- 12 min: Scale mode, 20 rounds
- 3 min: review per-axis breakdown, name the weak axis

Target metrics:

- per-axis accuracy ≥85% at sub-drill timer
- per-palace floor ≥75%
- median sub-drill latency at or under timer

Pass rule:

- all three sub-drill accuracies pass simultaneously
- per-palace floor passes

Fallback rule:

- if one axis drops below 70%, return to Stage 3 on that axis only

## Stage 5: Mixing

Goal:

- full address per round (Sword mode), all 3 axes in 12s, multi-valid items mixed in

Best drills:

- 20-round session, each round emits full address
- 15% of items are multi-valid (e.g. "spaced repetition" → Meta primary, Tactical acceptable); scorer accepts either palace
- justify each multi-valid choice in one sentence post-round

Anchor drill:

- 10 full-address rounds, single-valid only, 12s timer

Stretch drill:

- 10 full-address rounds, 20% multi-valid

Repair drill:

- on multi-valid items, write which palace you'd choose if forced to single-home it and why (anticipating the source's cross-palace linking rule)

Pass rule:

- ≥85% on single-valid items
- recognizes multi-valid (no stall, picks one acceptable answer in time)
- median full-address latency ≤12s

This is where palace classification stops being a checklist and becomes capture-speed reflex.

## Stage 6: Pressure And Noise

Goal:

- full address under 12s with decoys + inbox-realistic load

Best drills:

- 20-round Sword mode with 25% decoy items (sound Strategic but are operationally Tactical; sound deep but are Buffer-level captures; sound generic but have a clear domain)
- 5-minute inbox drill: take 10 actual unaddressed notes from `raw/` or recent captures, address them under 30s each, log per-axis accuracy after the fact

Good pressure variants:

- decoys planted in synthetic seed
- mined-from-`raw/` items where the answer leaks if you've seen the file
- multi-valid + decoy combined (the trickiest)
- live inbox sweep with real fatigue (end of day, after a long task)

Pass rule:

- ≥80% on decoy items (importance-bias defeated)
- ≥85% on multi-valid (recognized, not stalled)
- ≤10% over-promote rate
- ≤15% over-domain rate

Common error owner:

- `importance bias`
- `ego inflation`
- `decoration habit`

## Stage 7: Transfer And Zenith

Goal:

- classify fresh concepts *as they arrive in life*, without opening the gym, without breaking capture flow

Best drills:

- during the neural-os-daily-loop review, address every new note from the day in real time (no batching, no deferring)
- weekly review: take any note addressed during the week and audit the address against the source's rules; flag any miss-classifications for sideways movement
- monthly: scan addresses for systematic drift (e.g. "everything keeps landing in Tactical lately" — is the system actually changing, or is the reflex drifting?)

Zenith tests:

- address 20 fresh captures during one week with ≤2 later-corrected misses
- can teach the `Strategic ↔ Tactical` distinction using two own-notes that landed in each
- can name when a sideways move (palace change) is genuinely warranted vs when the classification was just inflated

Pass rule:

- 1 week of inbox capture with ≤2 corrected misses
- 1 teaching pass on the dominant neighbor pair using own examples

## First Two Weeks

Use this if you can recite the 6 palaces but don't yet address notes automatically.

### Week 1: One Axis Per Day

- Day 1: Palace only, untimed → timed, 30 items total. 50% should be operational (Tactical), 25% generic (multiple palaces possible), 25% mixed.
- Day 2: Level only, untimed → timed, 30 items. 80% should be fresh-capture (correct = `stay 1`). The 20% promotion items train the carrier-naming branch.
- Day 3: Domain only, untimed → timed, 30 items. 70% should be generic (correct = `skip`).
- Day 4: Palace only, 6s timer, 30 items, with `Strategic ↔ Tactical` neighbor pairs.
- Day 5: Palace + Level only, two-axis Mixed mode, 20 items.

Exit test:

- 90% palace accuracy at 6s on single-valid items
- 90% level discipline at 6s (over-promote ≤10%)
- 90% domain restraint at 4s (over-domain ≤15%)

### Week 2: Full Address And Real Inbox

- Day 1: Full address Sword mode, 15 items, single-valid only, 12s timer
- Day 2: Full address Sword mode, 20 items with 15% multi-valid
- Day 3: Full address Sword mode, 20 items with 25% decoys
- Day 4: 5-minute live inbox sweep: take 10 actual unaddressed notes, address each in ≤30s, audit after
- Day 5: full audit — pick 20 already-addressed notes from the wiki, re-address blind, compare; flag any mismatches as either reflex error (re-train) or genuine sideways-movement candidates (move the note per the source's sideways-movement rule)

Exit test:

- one full inbox sweep with ≤2 corrected misses
- one neighbor-pair distinction (`Strategic ↔ Tactical`) defended using two own-notes

## Minimum Daily Session

If time is limited, do only this:

1. 2 min: one axis Lamp-mode warmup, 5 items, untimed
2. 8 min: Sword-mode full address, 15 items, 12s timer
3. 3 min: log dominant per-axis failure mode for the day
4. 2 min: address any actual unaddressed notes from the day's captures

That is enough to keep the reflex alive.

## Weekly Review Questions

- Which palace neighbor pair still confuses me: `Strategic ↔ Tactical`, `Reflective ↔ Meta`, `Core ↔ Strategic`, `Buffer ↔ Tactical`?
- Did I over-promote any new captures this week (called `earn` without naming a real carrier)?
- Did I decorate any generic notes with a domain that didn't help retrieval?
- Did I correctly recognize multi-valid concepts as multi-valid, or did I force-pick one palace?
- Did I move any note sideways this week — and if so, was the move warranted by genuine changeability re-evaluation, or was the original classification just inflated?
- Did `Buffer` swallow more captures than usual? (could mean either real growth in raw input or reflex avoidance of the changeability question)

## Worked Drill-Generator Snapshot

```yaml
skill: palace classification reflex
skill_type: judgment
target_performance: emit Palace x Level x Domain? for any one-line concept in under 12 seconds
current_stage: 4
failure_mode: importance bias on palace + ego inflation on level

anchor_drill:
  family: classification
  prompt_shape: 15 one-line concepts, palace-only, 6s timer
  reps: 15
  constraint: single-valid items, one-sentence rationale optional
  pass_rule: 90% accuracy at timer

stretch_drill:
  family: classification under multi-axis pressure
  prompt_shape: 10 full-address rounds, all 3 axes, 12s timer
  reps: 10
  constraint: 20% multi-valid, 20% decoy
  pass_rule: 85% on single-valid, recognizes multi-valid without stalling

repair_drill:
  family: ego-inflation diagnosis
  prompt_shape: 5 fresh-capture concepts where the "obviously important" trap is set
  reps: 5
  constraint: must default to Level 1; if claiming earn, must name carrier
  pass_rule: 0 over-promote calls; if any, name the failed default rule out loud
```

## How This Composes With The Rest Of The System

This drill ladder sits beneath [palace-classification-gym](./palace-classification-gym.md) (which is the runnable instantiation) and is consumed by:

- **neural-os-daily-loop** — the daily review uses the reflex during inbox sweep; the ladder is the upstream training that makes the sweep fast.
- **Ingest workflow** (per CLAUDE.md §Ingest workflow) — every new `raw/` source needs an address; the ladder makes it automatic.
- **TagManager** (per CLAUDE.md §TagManager) — the palace tag (`core-memory`, `strategic-memory`, etc.) is the same axis trained by sub-drill A; passing the ladder means TagManager tagging at ingest time also speeds up.
- **[practice-loop](./practice-loop.md)** — a single ladder session is one micro-cycle: Orient (warmup) · Execute (gym round) · Measure (METER event) · Repair (rationale rewrite on misses) · Close (failure-mode log).

The drill ladder does *not* train the cube-internal `(face, cell)` placement from [rubiks-cube-palace](./rubiks-cube-palace.md) — that is one layer deeper and gets its own ladder once the address-level reflex stabilizes.

## Bottom Line

The correct way to learn palace classification is not:

- memorize 6 palace names + 10 levels + 10 domains
- write thoughtful rationales for every note
- argue addresses in long-form
- promote concepts to Level 5+ because they "feel important"
- decorate every note with a domain

The correct order is:

1. learn the 6 palaces by changeability only — *not* by importance, *not* by domain
2. learn that every capture starts at Level 1 and `earn` is rare
3. learn that domain defaults to `skip` unless retrieval benefits
4. drill each axis in isolation, then mixed, then full address
5. introduce multi-valid items so cross-palace concepts don't stall the reflex
6. introduce decoys to defeat importance bias
7. transfer to live inbox capture without breaking flow

That is the palace classification drill ladder for Neural OS.

## Related pages

- [palace-classification-gym](./palace-classification-gym.md)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [rubiks-cube-palace](./rubiks-cube-palace.md)
- [drill-generator](./drill-generator.md)
- [drill-ladder-patterns](./drill-ladder-patterns.md)
- design-patterns-drill-ladder
- solid-drill-ladder
- [practice-loop](./practice-loop.md)
- neural-os-daily-loop
- [red-queen-skill-gym](./red-queen-skill-gym.md)


---

## U — See (CAST)
1. Drill ladder for 3-axis palace classification reflex
2. Emit Palace × Level × Domain in <12 seconds

## D — Name (NEDF)
1. Palace classification drill ladder = address-reflex ladder
2. Distinguisher: time-pressured (12 sec), reflex-grade
3. Failure mode: explicit deliberation past 12 sec

## F — Do (SPEAR)
1. Concept presented → emit P×L×D in <12 sec
2. Log + check accuracy

## B — Watch (HEART)
1. Over-thinking past 12 sec
2. Skipping the address scheme

## L — Predict (ORACLE)
1. Concept → predict address
2. Confusion → predict missing axis

## R — Act (GRACE)
1. New concept → emit address
2. Slow → drill ladder