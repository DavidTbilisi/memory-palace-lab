---
palace: tactical-memory
level: 4
domain: 10
room: 5
wiki_source: wiki/problem-solving/proof-reconstruction-drill-ladder.md
---

# Proof Reconstruction Drill Ladder

**Summary**: A worked drill-generator instantiation for rebuilding proofs from statement, assumptions, target, bridge idea, and template choice rather than treating proofs as opaque finished text.

**Sources**:
- math-learning-with-neural-os.md
- raw/01 Core_Memory/Math/Elementary School Math/Proof.md
- raw/01 Core_Memory/Problem Solving Maturity Levels.md
- raw/01 Core_Memory/PELIA - problem solving.md
- drill-generator.md

**Last updated**: 2026-05-02

---

## Purpose

This page extracts one narrow math sub-skill from the broader math operating manual:

- reconstruct a proof skeleton from memory
- choose an appropriate proof template
- fill the steps without losing the logical thread

## Skill Definition

```yaml
skill: proof reconstruction
skill_type: judgment
real_target: rebuild a proof skeleton and complete the argument without depending on verbatim memorization
real_use_case: discrete math, algebra, number theory, geometry, theorem study
time_horizon: 3-8 weeks
session_length: 20-40m
weekly_frequency: 4-5x
```

## Real Target

Zenith for this skill is not:

- remembering a proof word-for-word
- recognizing the proof after reading it

Zenith means:

- state the claim clearly
- name the assumptions and target
- choose the likely proof template
- find the bridge idea
- reconstruct the skeleton from memory

## Core Reconstruction Frame

For each proof, store:

- statement
- assumptions
- target
- key bridge idea
- failure mode

Typical templates:

- direct proof
- contradiction
- contrapositive
- induction
- case split

## Current-Stage Map

| Drill stage | Focus |
|---|---|
| `0 Orientation` | understand what a proof is trying to do |
| `1 Isolation` | identify statement, assumptions, and target |
| `2 Clean Repetition` | rebuild short proof skeletons with one template |
| `3 Controlled Variation` | compare direct, contradiction, induction, and case split on similar claims |
| `4 Automaticity` | choose template and bridge idea faster |
| `5 Mixing` | classify and reconstruct mixed proof types |
| `6 Pressure And Noise` | rebuild after forgetting one step or under time pressure |
| `7 Transfer And Zenith` | use the skill on unseen proofs and live theorem work |

## Primary Failure Modes

- `cannot recognize` -> does not know what type of proof the claim suggests
- `cannot recall` -> loses assumptions, target, or bridge idea
- `cannot execute` -> knows the template name but cannot run the structure
- `confuses neighbors` -> direct, contradiction, and contrapositive blur together
- `too slow` -> spends too long choosing a template
- `fails when mixed` -> collapses when theorem types vary
- `fails after disruption` -> one missing line breaks the whole proof
- `fails in real conditions` -> works on textbook examples only

## Stage 0: Orientation

Goal:

- stop treating proofs as magic paragraphs

Best drills:

- label statement, assumptions, and target in 5 tiny proofs
- identify whether the proof is showing existence, implication, impossibility, or equality

Pass rule:

- 5 clean examples labeled correctly

## Stage 1: Isolation

Goal:

- own the smallest proof skeleton parts

Best drills:

- given a theorem, state assumptions
- given a theorem, state target
- given a short proof, name the bridge idea

Daily block:

1. 5 theorem statements
2. extract assumptions and target
3. name one likely bridge move

Pass rule:

- assumptions and target extracted correctly in 8 out of 10 cases

## Stage 2: Clean Repetition

Goal:

- rebuild short proofs of one type

Best drills:

- direct proof skeleton completion
- contradiction skeleton completion
- induction skeleton completion

Anchor drill:

- fill missing steps in one clean proof family only

Stretch drill:

- restate the full skeleton from memory after reading once

Repair drill:

- isolate the missing bridge line and rewrite only that part

Pass rule:

- can reconstruct the skeleton of a short proof from memory

## Stage 3: Controlled Variation

Goal:

- see how the same claim shape can invite different proof routes

Best drills:

- compare direct vs contrapositive
- compare contradiction vs direct impossibility proof
- compare induction vs repeated direct argument

Pass rule:

- can justify why one template is stronger than another on the same problem family

## Stage 4: Automaticity

Goal:

- choose proof templates faster

Best drills:

- 30-second template selection
- 1-minute skeleton outline
- fast bridge-idea naming

Pass rule:

- chooses a plausible template quickly on medium examples

## Stage 5: Mixing

Goal:

- reconstruct across different proof types without collapse

Best drills:

- mixed theorem packet
- dominant template classification
- skeleton completion on varied proof families

Pass rule:

- 8 out of 10 mixed proofs classified with plausible template and skeleton

## Stage 6: Pressure And Noise

Goal:

- keep logical control after forgetting one line or under time pressure

Best drills:

- rebuild a proof after one key step is removed
- explain the proof aloud under time limit
- continue after interruption without restarting from the top

Pass rule:

- can recover the missing line or rebuild the route without total collapse

## Stage 7: Transfer And Zenith

Goal:

- use reconstruction on unseen proofs

Best drills:

- take an unseen theorem and propose a proof route
- compress a solved proof into one reusable template note
- teach the skeleton to someone else

Pass rule:

- one unseen proof reconstructed with a plausible route and coherent skeleton

## First Two Weeks

### Week 1

- Day 1: statement vs assumption vs target
- Day 2: bridge idea spotting
- Day 3: short direct proof skeletons
- Day 4: short contradiction skeletons
- Day 5: rebuild one short proof from memory

Exit test:

- can label proof parts
- can rebuild one short skeleton

### Week 2

- Day 1: induction template basics
- Day 2: direct vs contrapositive comparison
- Day 3: mixed short proofs
- Day 4: timed template choice
- Day 5: one unseen mini-proof reconstruction

Exit test:

- template choice is no longer random
- mixed short proofs stay coherent

## Minimum Daily Session

1. classify 3 proof statements
2. extract assumptions and target
3. reconstruct one short skeleton
4. repair the weakest missing step

## Worked Drill-Generator Snapshot

```yaml
skill: proof reconstruction
skill_type: judgment
real_target: rebuild short proof skeletons without verbatim memorization
current_stage: 2
failure_mode: confuses neighbors

anchor_drill:
  family: reconstruction
  prompt_shape: fill missing steps in 5 direct proofs
  reps: 5
  constraint: name assumptions and target first
  pass_rule: 4/5 coherent skeletons

stretch_drill:
  family: variation
  prompt_shape: compare direct and contradiction routes for 3 claims
  reps: 3
  constraint: justify template choice
  pass_rule: 3/3 plausible justifications

repair_drill:
  family: bridge repair
  prompt_shape: recover the missing key line in 3 broken proofs
  reps: 3
  constraint: explain why that line is the bridge
  pass_rule: 3/3 repaired
```

## Bottom Line

The right order here is:

1. identify proof parts
2. rebuild clean skeletons
3. compare templates
4. choose faster
5. mix proof families
6. recover after breaks
7. use it on unseen theorems

This is the dedicated proof reconstruction ladder for Neural OS.


---

## U — See (CAST)
1. Drill for rebuilding proofs from statement + assumptions + target
2. Bridge idea + template choice

## D — Name (NEDF)
1. Proof reconstruction drill ladder = proof-rebuild ladder
2. Distinguisher: builds from skeleton, not memorizes finished proof
3. Failure mode: treating proofs as opaque text

## F — Do (SPEAR)
1. Statement → extract assumptions + target
2. Choose bridge idea → instantiate template

## B — Watch (HEART)
1. Template forcing
2. Skipping bridge-idea selection

## L — Predict (ORACLE)
1. Statement → predict template
2. Bridge idea → predict proof shape

## R — Act (GRACE)
1. Proof needed → reconstruct skeleton
2. Stuck → revisit bridge idea