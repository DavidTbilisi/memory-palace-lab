---
palace: tactical-memory
level: 5
domain: 10
room: 1
semantic_mode: 5
wiki_source: wiki/learning-systems/drill-generator.md
---

# Drill Generator

**Summary**: A system-level method for generating drills that start from zero knowledge, progress through clean isolation and automaticity, and end in transfer-ready performance under pressure.

**Sources**:
- rapid-in-neural-os.md
- language-learning-protocol.md
- math-learning-with-neural-os.md
- soroban-learning-method.md
- semantic-reading-system.md
- maturity-levels-overview.md
- framework-comparison-matrix.md
- missing-encoding-layers.md
- raw/03 Tactical_Memory/RAPID/Precision Drills.md

**Last updated**: 2026-06-22

---

## Core Claim

A good drill generator is not a random exercise maker.

It is a **progression engine** that answers four questions:

1. what is the smallest stable unit
2. what failure mode is blocking performance
3. what is the next harder variation
4. what pass rule allows promotion

The generator becomes "perfect" when it keeps producing the **next right drill**, not when it produces infinite variety.

## Bottom-Line Rule

When the learner knows nothing, do **not** start with pressure.

Start with:

- orientation
- vocabulary
- discrimination
- one clean unit

Only later add:

- speed
- mixing
- distraction
- transfer

This is the central anti-chaos rule for drill design.

## What The Generator Must Produce

Every generated drill should output:

- one target skill
- one unit of difficulty
- one drill family
- one constraint
- one pass rule
- one promotion rule
- one fallback rule

If any of these are missing, the drill is too vague to govern learning.

## Generator Inputs

Before generating drills, define:

```yaml
skill:
skill_type: concept | discrimination | procedure | graph | expression | judgment
target_performance:
current_stage:
failure_mode:
environment: clean | mixed | timed | noisy | live
session_time:
pass_rule:
review_rule:
```

Interpretation:

- `skill` = what is being built
- `skill_type` = what kind of performance logic applies
- `target_performance` = what "good" looks like in the real world
- `current_stage` = how advanced the learner is
- `failure_mode` = what is actually collapsing
- `environment` = how hostile the conditions are

## Start From Zero

When someone knows nothing, the goal is not mastery.

The goal is:

1. know the object exists
2. name it
3. distinguish it from nearby confusion
4. perform one tiny clean version

That means the first drills should usually be:

- identification drills
- contrast drills
- copy drills
- completion drills
- one-step execution drills

Examples:

- language: hear `r` vs `l`
- math: identify variable vs constant
- soroban: flash one rod digit
- reading: tag `Def` vs `A` vs `Q`
- CAST: identify node vs edge

The learner is not yet solving the whole domain. The learner is building the first handles.

## The Eight Drill Stages

### Stage 0: Orientation

Goal:

- remove total unfamiliarity

Best drill families:

- label
- point
- match
- copy

Pass signal:

- learner no longer feels the domain is shapeless
- can identify the core parts without guessing

Do not add time pressure here.

### Stage 1: Isolation

Goal:

- own one small atomic move

Best drill families:

- single-unit recall
- minimal contrast
- one-step execution
- guided reproduction

Pass signal:

- one unit can be done correctly several times in a row

This is where most fake learners try to skip ahead and break themselves.

### Stage 2: Clean Repetition

Goal:

- make the unit stable, not lucky

Best drill families:

- same pattern with different surface values
- short fixed sets
- immediate correction

Pass signal:

- accuracy stays high across a small clean set

Do not confuse repetition with mindless volume. The point is stable form.

### Stage 3: Controlled Variation

Goal:

- prove the learner owns the pattern, not one memorized example

Best drill families:

- substitution
- transformation
- near-miss discrimination
- reverse direction

Pass signal:

- learner succeeds when the surface changes but the deep pattern stays the same

This is where schema starts to form.

### Stage 4: Automaticity

Goal:

- reduce latency and hesitation

Best drill families:

- short timed responses
- flash recognition
- rapid completion
- constrained speaking or symbolic manipulation

Pass signal:

- correct response appears quickly with low search cost

Only add timing after Stage 2 or 3 accuracy is real.

### Stage 5: Mixing

Goal:

- choose correctly among competing patterns

Best drill families:

- mixed sets
- problem-type identification
- branch-choice drills
- interrupted sequence drills

Pass signal:

- learner does not collapse when the answer type is no longer announced

This stage prevents brittle fluency.

### Stage 6: Pressure And Noise

Goal:

- keep performance alive under friction

Best drill families:

- distraction drills
- noisy input drills
- movement plus execution
- low-time-budget drills
- repair-after-error drills

Pass signal:

- learner recovers without full reset
- performance degrades gracefully instead of breaking completely

This is where usable skill begins.

### Stage 7: Transfer And Zenith

Goal:

- use the skill in reality, not only in drills

Best drill families:

- teach it
- explain it from memory
- apply it to a new domain
- solve an unseen problem
- build or generate examples

Pass signal:

- learner can adapt the skill without waiting for the original training format

Zenith is not infinite speed.

Zenith means:

- the core patterns are compressed
- the right response arrives quickly
- failure is diagnosable
- transfer is possible
- maintenance cost is low

## Difficulty Ladder

Use this order unless the domain strongly disagrees:

1. recognize
2. recall
3. reproduce
4. transform
5. choose
6. perform under time
7. perform under noise
8. perform in the wild
9. teach or generate

This is the safest default ladder for most skills.

## Drill Families

These are reusable generator primitives.

### Recognition

- identify the right item
- spot the contrast
- match label to object

### Recall

- answer from cue
- rebuild from memory
- fill a missing part

### Reproduction

- copy the form
- execute one exact procedure
- restate or redraw

### Transformation

- change tense, form, notation, representation, or direction
- hold meaning constant while changing form

### Discrimination

- choose between near neighbors
- explain why one option is wrong

### Branching

- decide which method applies
- select route from a mixed set

### Repair

- detect the error
- recover without restarting
- name the first correction step

### Compression

- summarize
- chunk
- regenerate from skeleton

### Transfer

- use the pattern in a new context
- teach it
- make your own examples

## Generator Logic By Failure Mode

If the learner fails because:

- `cannot recognize` -> generate recognition and contrast drills
- `cannot recall` -> generate short cue-based retrieval drills
- `cannot execute` -> generate one-step procedure drills
- `too slow` -> generate short timed drills on already-clean material
- `confuses neighbors` -> generate discrimination drills
- `fails when mixed` -> generate branching and mixed-set drills
- `fails after disruption` -> generate repair drills
- `fails in real conditions` -> generate transfer and noise drills

Never solve a Stage 1 problem with a Stage 6 drill.

## Generator Logic By Skill Type

Use the smallest framework that fits.

- `concept` -> favor `NEDF` plus recall, contrast, and explanation drills
- `graph` -> favor `CAST` plus node-edge recognition, path walking, and pattern drills
- `procedure` -> favor `SPEAR` plus trigger, step, branch, and repair drills
- `discrimination` -> favor contrast, minimal-pair, and near-miss drills
- `expression` -> favor output, latency, transform, and pragmatic drills
- `judgment` -> favor case comparison, tradeoff, and explanation drills

The drill generator should not ignore framework selection. It should inherit it.

## Pass Rules

Every stage needs a promotion threshold.

Examples:

- `orientation`: identify 8 out of 10 correctly
- `isolation`: 5 correct in a row
- `clean repetition`: 9 out of 10 on a clean set
- `automaticity`: correct under a short response limit
- `mixing`: 80 percent correct with unannounced pattern changes
- `pressure`: recover within one move, one clause, or one branch
- `transfer`: solve one novel case without scaffold

The exact numbers can vary by domain. The non-negotiable rule is that promotion must be explicit.

## Daily And Weekly Generator Rhythm

### Daily

Generate:

- one anchor drill from the current stable stage
- one stretch drill from the next stage
- one repair drill from the most common failure

This creates stability, challenge, and correction in one session.

### Weekly

Review:

- what stage the learner is truly in
- which failure mode repeats
- which drill family is no longer needed
- what should be promoted to maintenance

The generator should shrink cost over time, not grow forever.

## Anti-Rules

Do not:

- randomize too early
- time inaccurate behavior
- mix before isolation
- add noise before clean control
- confuse note-making with drilling
- keep stable material in heavy practice forever

A large part of drill design is refusing the wrong next challenge.

## Minimum Viable Drill Generator

If you want the smallest usable version inside Neural OS, use this algorithm:

1. define the target performance
2. classify the skill type
3. locate the current failure mode
4. select the smallest drill family that attacks it
5. set one pass rule
6. generate 5 easy reps, 5 medium reps, 1 transfer rep
7. log errors
8. regenerate tomorrow from the new weakest point

This already gets you most of the value.

## Example Generator Template

```yaml
skill: english conditional responses
skill_type: expression
target_performance: answer common what-if questions in under 3 seconds
current_stage: 3
failure_mode: too slow
environment: clean
session_time: 15m
pass_rule: 8/10 correct under 3 seconds
review_rule: D1/D3/D7
generated_drills:
  - family: transformation
    prompt: convert direct answer to conditional answer
    reps: 5
  - family: timed response
    prompt: answer what-if cue under 3 seconds
    reps: 5
  - family: repair
    prompt: restart after deliberate interruption
    reps: 3
  - family: transfer
    prompt: answer one novel social scenario aloud
    reps: 1
```

## Integration With RAPID

Best placement inside Neural OS:

- `RAPID` decides when a skill deserves drill investment
- `NEDF / CAST / SPEAR` define what kind of thing is being drilled
- [red-queen-skill-gym](./red-queen-skill-gym.md) defines why the drills exist: compiling understanding into low-latency performance
- `RISE` can be used inside a session as the local workout protocol: reflex, intensity, sparring, evaluation
- this drill generator decides the next exercise shape
- review rules decide whether the skill stays in focus, moves to maintenance, or gets promoted to transfer work

That keeps the generator narrow and useful.

## Bottom Line

The right way to start drilling when you know nothing is:

1. orient
2. isolate
3. stabilize
4. vary
5. speed up
6. mix
7. add pressure
8. transfer
9. teach

That is the path from zero to zenith.

The generator should exist to choose the next rung automatically.

## Diagrams

Eight-stage zero-to-zenith pipeline with each stage's goal, drill families, and pass rule, plus the nine-family primitive sidebar, failure-mode routing, and anti-rules:

![drill-generator schematic](../diagrams/16-drill-generator.png)

Hero — the progressive forge metaphor: eight workstations span a smithy, the same piece of metal advances station by station from raw ore through clean repetition, controlled variation, automaticity, pressure, and finally a teaching apprentice at the zenith:

![drill-generator hero](../diagrams/heroes/drill-generator.png)

## External grounding — Interleaving as a first-class generator parameter

The drill generator's **mixed-mode** parameter is the operational implementation of **interleaving** (Rohrer & Taylor 2007; Birnbaum et al. 2013; Dunlosky 2013 strategy #3). The empirical finding: interleaving problems of different types within a session produces better discrimination and far better transfer than blocked practice — at the cost of slower in-session feel and lower in-session confidence. Bjork's *desirable difficulty* terminology captures the trade-off.

What this means for generator design:

- **Default to mixed-mode** when generating drill ladders that touch multiple problem types ([problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md) is the canonical example — search/execution/constraint/tradeoff interleaved is the *whole point*).
- **Single-mode isolation** is the *exception*, used when (a) the user is in low PULSE state and the desirable difficulty becomes too costly, (b) a specific subskill is hitting a floor and needs isolation under intensity to expose what's broken, or (c) the gym is in Lamp phase and adding inter-type variation would prevent the recognition pattern from forming.
- **Stage parameter (0→7)** implements Sweller's **expertise-reversal effect** for scaffolding: stages 0-2 give worked-example-heavy drills (novice-appropriate); stages 3-5 demand production; stages 6-7 demand generation under pressure (expert-appropriate). Applying stage-0 scaffolding to a stage-7 user adds extraneous load; applying stage-7 demands to a stage-0 user overloads working memory. The stage parameter is the load-balancing knob.

See [learning-sciences-validation](./learning-sciences-validation.md) for the broader mapping. The drill generator + the [gym](./red-queen-skill-gym.md) together cover three of the six canonical Learning Sciences strategies (retrieval practice, interleaving, and via stage-appropriate scaffolding, the workload side of expertise-reversal).

**Independent convergence — Advance's Isolation and Intensity.** [cognitive-house-model](./cognitive-house-model.md) documents two skill-installation principles from a different tradition (Yagodkin's Advance training centre) that land on the same shape as Stage 1 (Isolation) through Stage 4 (Automaticity) above: train one sub-skill at 100% attention with everything else already automatic, then add speed only in short sprints stopped at the first sign of fatigue or error — not driven to failure. The convergence is worth noting as corroboration from an unrelated lineage; the ladder itself stays owned here.

## Worked example — Georgian driving-exam B/B1 [restored 2026-06-12]

First finite licensed-exam corpus run through the generator: georgian-driving-exam-b-drill-ladder instantiates the stages over a 1,032-question bank (30 random questions per sitting, official pass 25/30 per https://www.sa.gov.ge/p/driver-license/theoretical-test). Distinctive features: per-theme [METER](./meter-overview.md) weighting (weak themes drive next-session selection), a derive-don't-memorize stage (intersections resolved via the georgian-driving-exam-b-priority-lattice CAST lattice rather than recalled), and a verdict gate deliberately above the official floor (≥27/30 on 3 consecutive simulations). Stage numbering maps onto [skill-progression-stages](./skill-progression-stages.md) — see the ladder page for the rung↔stage table.

## Related Pages

- georgian-driving-exam-b-drill-ladder — worked example: first finite licensed-exam corpus instantiation
- [drill-ladder-patterns](./drill-ladder-patterns.md)
- [pattern-drilling](./pattern-drilling.md) — the expression-skill drill types (substitution / transformation / …) that fill the rungs for language structure
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [cast-drill-ladder](./cast-drill-ladder.md)
- [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md)
- [language-production-drill-ladder](./language-production-drill-ladder.md)
- [soroban-drill-ladder](./soroban-drill-ladder.md)
- [learning-sciences-validation](./learning-sciences-validation.md)
- [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md) — canonical interleaving drill
- [cognitive-house-model](./cognitive-house-model.md) — independent convergence on isolation → automaticity via Advance's Isolation/Intensity principles

---

## U — See (CAST)
1. Method for moving zero → automatic → transferable
2. Inputs: skill spec; output: full drill ladder

## D — Name (NEDF)
1. Drill Generator = system-level drill design method
2. Output = a complete ladder (stages 0..7)
3. Zero knowledge → transfer-ready performance

## F — Do (SPEAR)
1. New skill → specify zero-state and target
2. Generate ladder: isolation → automaticity → transfer
3. Wire to METER for measurement

## B — Watch (HEART)
1. Ladder skipping isolation stage → fragile reflex
2. No transfer test → false mastery
3. Drills without intensity → no Red Queen pressure

## L — Predict (ORACLE)
1. Full ladder → reliable transfer
2. Skipping rungs → regression under load

## R — Act (GRACE)
1. New skill identified → run the generator first
2. Stuck plateau → re-isolate