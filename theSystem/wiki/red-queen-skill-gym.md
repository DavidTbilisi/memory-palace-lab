---
palace: tactical-memory
level: 5
domain: 10
room: 2
semantic_mode: 5
wiki_source: wiki/learning-systems/red-queen-skill-gym.md
---

# Red Queen Skill Gym

**Summary**: A Red Queen performance layer for turning comprehension and memory into reflex. It defines how to create a measurable gym for any skill by combining isolation, intensity, feedback loops, and stage-based drill progression.

**Sources**:
- raw/Neural OS Book/Intensity.md
- raw/Neural OS Book/Isolation.md
- raw/Neural OS Book/Measurements.md
- raw/06 Buffer/language_learning.md
- raw/03 Tactical_Memory/RAPID Framework.md
- drill-generator.md
- drill-ladder-patterns.md
- failure-modes-in-encoding.md
- framework-comparison-matrix.md
- rapid-in-neural-os.md
- missing-encoding-layers.md
- language-learning-architecture.md
- feedback-loop-taxonomy.md
- software-design-principles-for-neural-os.md
- User proposal in chat about reflex formation / RISE, 2026-05-05

**Last updated**: 2026-07-09 — added [visualization-gym](./visualization-gym.md) as a registered instance

---

## Core Claim

Red Queen is already strong at comprehension, compression, encoding, and retrieval. The weak point is what happens after understanding and memory exist but before the response becomes fast, stable, and usable under pressure. (source: raw/06 Buffer/language_learning.md; missing-encoding-layers.md; language-learning-architecture.md)

That missing layer is the **skill gym**.

A skill gym is not another memory framework.

It is the performance layer that converts:

- understood concept -> executable response
- remembered procedure -> low-hesitation action
- known pattern -> fast recognition
- accurate behavior -> robust behavior under pressure

In `RAPID` terms, this sits mainly inside `Practice` and `Apply`, downstream of framework selection and upstream of transfer. (source: raw/03 Tactical_Memory/RAPID Framework.md; rapid-in-neural-os.md)

## Architectural Verdict

Keep this idea, but do **not** make it a new peer encoder beside [NEDF](./nedf-overview.md), [CAST System](./cast-overview.md), [SPEAR](./spear-overview.md), or [HEART](./heart-overview.md).

The clean architecture is:

- `RAPID` = governance loop
- `NEDF / CAST / SPEAR / HEART` = representation engines
- [drill-generator](./drill-generator.md) = progression engine
- `Red Queen Skill Gym` = performance layer
- `RISE` = local workout protocol inside that performance layer

This preserves separation of concerns and avoids framework drift. The user proposal is correct about the missing layer, but the strongest version is a gym protocol nested inside the existing architecture rather than a competing meta-system. (source: rapid-in-neural-os.md; framework-comparison-matrix.md; software-design-principles-for-neural-os.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## Why The Gym Is Necessary

The current architecture already has clear owners for:

- concept identity via [NEDF](./nedf-overview.md)
- relation and system structure via [CAST System](./cast-overview.md)
- procedure execution via [SPEAR](./spear-overview.md)
- people models via [HEART](./heart-overview.md)

What it underweights is automaticity, reaction time, hostile-condition execution, and adaptation. Those are performance gaps, not representation gaps. (source: missing-encoding-layers.md; raw/06 Buffer/language_learning.md)

That means Red Queen does **not** mainly need more note structure.

It needs a universal way to build gyms.

## Definition

A Red Queen skill gym is:

- **isolated** enough to expose one sub-skill cleanly
- **intense** enough to force full attention on the bottleneck
- **feedback-driven** enough to correct errors immediately
- **measured** enough to guide the next action
- **progressive** enough to move from clean reps to pressure and transfer

This follows directly from the book rules:

- `Isolation` says separate the complex skill into a small drillable unit so the active dependency graph shrinks and errors become obvious. (source: raw/Neural OS Book/Isolation.md)
- `Intensity` says use short, focused blocks with a clear pass rule and immediate correction so comfortable fake practice is rejected. (source: raw/Neural OS Book/Intensity.md)
- `Measurements` says define the system, the control goal, the metric class, the useful number form, and the time dimension before optimizing. (source: raw/Neural OS Book/Measurements.md)

## Position In The Red Queen Stack

The clean stack is:

1. comprehension
2. compression
3. encoding
4. retrieval
5. gym / automaticity
6. prediction
7. intuition
8. adaptation

This preserves the conclusion already reached elsewhere: the system is strongest in the early layers and weaker in the later performance layers. The gym is the first missing bridge. (source: raw/06 Buffer/language_learning.md; missing-encoding-layers.md; language-learning-architecture.md)

An expanded expertise pipeline therefore looks like:

1. understand
2. encode
3. retrieve
4. execute
5. compress
6. automatize
7. adapt

That is the missing shift from "knowledgeable person" to "fluid operator." (source: User proposal in chat about reflex formation / RISE, 2026-05-05; raw/06 Buffer/language_learning.md)

## The Compilation Claim

The deepest claim of the gym layer is that expertise is not just retained knowledge.

It is **compiled knowledge**.

The progression is:

- beginner -> conscious search for the right move
- intermediate -> explicit recognition plus delayed selection
- advanced -> chunked pattern fires with low search cost

This is why memory strength alone is insufficient. You can recall the right idea and still miss the time window for competent execution. The gym exists to compile declarative knowledge into procedural chunks through repeated retrieval plus execution under constraints. (source: raw/06 Buffer/language_learning.md; drill-generator.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## The Seven Reflex Dimensions

A real gym should not treat automaticity as one vague property. At minimum, it should distinguish:

| Dimension | Core question | Example |
|---|---|---|
| Recognition speed | "What is this?" | spot dynamic programming in seconds |
| Recall latency | "How fast can I recover it?" | retrieve a formula in under one second |
| Execution fluency | "Can I run it without stalls?" | write a routine without syntax-search pauses |
| Branch reflex | "Do I choose the next move quickly?" | pick BFS instead of DFS immediately |
| Error reflex | "Do I detect deviation early?" | notice a sign error or bad branch fast |
| Compression | "Has the pattern chunked?" | see 12 facts as one reusable structure |
| Stress stability | "Does it survive hostile conditions?" | maintain performance under pressure or interruption |

These dimensions are partly visible in the existing ladders, but the gym layer makes them first-class targets instead of side effects. (source: drill-ladder-patterns.md; missing-encoding-layers.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## RISE: The Workout Protocol

Within the gym layer, use `RISE` as the simplest operational loop:

- `R` = `Reflex`
- `I` = `Intensity`
- `S` = `Sparring`
- `E` = `Evaluation`

This does not replace the drill ladder. It defines how a gym session is structured and how automaticity work is framed.

### R - Reflex

Define the exact cognitive action that should become automatic.

Good targets:

- recognize overlapping-subproblem structure within `3s`
- derive the chain rule without reconstructing the whole proof
- detect cache invalidation risk on sight

Bad targets:

- "learn dynamic programming"
- "get better at calculus"
- "know system design"

The reflex must be narrow enough to fire from a trigger, not broad enough to become a study project.

### I - Intensity

Automaticity requires load, not just repetition.

Useful overload sources:

- time pressure
- closed-note recall
- mixed topics
- ambiguity
- interference
- fatigue
- context switching

The goal is progressive overload without corrupting form. (source: raw/Neural OS Book/Intensity.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

### S - Sparring

Reflexes stabilize through confrontation, not through passive familiarity.

Useful sparring forms:

- rapid-fire classification
- adversarial examples
- mixed retrieval
- branch-choice drills
- generation under uncertainty
- interruption-and-repair reps

This is where the skill proves it can survive contact with reality.

### E - Evaluation

The gym must measure more than eventual correctness.

Track:

- time-to-first-correct
- branch errors
- hesitation rate
- interruption recovery
- confidence under load
- retention after delay

This is the latency-focused extension of the broader measurement framework. (source: raw/Neural OS Book/Measurements.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## Intensity Levels

The gym should escalate by condition, not only by content:

| Level | Condition |
|---|---|
| 1 | open notes |
| 2 | closed notes |
| 3 | timed |
| 4 | mixed topics |
| 5 | adversarial |
| 6 | interrupted or context-switched |
| 7 | live application |

This is the cleanest overload ladder because it separates "can do it" from "can do it under cost." (source: raw/Neural OS Book/Intensity.md; drill-generator.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## Four Gym Modes

Most serious skills need some combination of four gyms.

### 1. Recognition Gym

Goal:

- fast pattern identification

Examples:

- algorithm class
- proof technique
- bug category
- grammar structure

### 2. Execution Gym

Goal:

- fast procedural execution with low hesitation

Examples:

- SPEAR branch drills
- derivation drills
- implementation sprints

### 3. Retrieval Gym

Goal:

- low-latency recall, not merely eventual recall

Examples:

- formula flash
- command recall under time
- rapid concept regeneration

### 4. Stress Gym

Goal:

- maintain function under pressure, fatigue, ambiguity, or interruption

Examples:

- noisy listening
- interrupted proof continuation
- context-switch debugging

These modes are not mutually exclusive. A mature skill often rotates through all four. (source: missing-encoding-layers.md; drill-generator.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## The Feedback-Loop View

The gym should be designed as a feedback system, not as a pile of exercises.

### Balancing Loop

The main loop is balancing:

`error or hesitation -> correction drill -> cleaner performance -> less error`

This loop exists to reduce deviation from the target response. (source: feedback-loop-taxonomy.md)

### Reinforcing Loop

Once the sub-skill is stable, a reinforcing loop appears:

`more clean reps -> lower search cost -> faster response -> more successful reps`

This is useful only after the form is correct. If reinforcement starts too early, you reinforce bad movement. (source: feedback-loop-taxonomy.md; drill-generator.md)

### Delay Rule

Do not judge transfer too early.

A gym has delays between:

- practice and automaticity
- automaticity and live transfer
- transfer and durable retention

If you ignore delay, you will either abandon a good gym too early or keep a bad gym too long. (source: raw/Neural OS Book/Measurements.md; feedback-loop-taxonomy.md)

## The Universal Gym-Creation Framework

Use this whenever a skill exists in the vault but does not yet have a real practice engine.

### 1. Define The Target Reflex

Write the response you want to become automatic.

Examples:

- semantic reading -> classify and compress a paragraph without rereading
- soroban -> execute the correct complement move without counting
- SOLID -> name the dominant violation and minimum fix quickly

If the target still sounds like "get better at X," the gym is not defined yet.

### 2. Isolate The Atomic Unit

Shrink the skill until one rep is cleanly observable.

Examples:

- one paragraph function tag
- one phoneme contrast
- one compensation family
- one code smell family
- one proof move

This is the non-negotiable anti-chaos rule. Isolation comes before mixing. (source: raw/Neural OS Book/Isolation.md; drill-generator.md)

### 3. Name The Trigger And Correct Response

Every gym needs:

- the cue that should trigger the skill
- the correct response pattern
- the most likely wrong response

Without this, the rep is too vague to coach.

### 4. Diagnose The Current Failure Mode

Use the common failure grammar already visible across the drill ladders:

- `cannot recognize`
- `cannot recall`
- `cannot execute`
- `confuses neighbors`
- `too slow`
- `fails when mixed`
- `fails after disruption`
- `fails in real conditions`

Generate drills against the actual collapse, not the ego's preferred exercise. (source: drill-generator.md; drill-ladder-patterns.md; failure-modes-in-encoding.md)

### 5. Choose The Measurement Stack

At minimum, every gym should track:

- `accuracy` - is the response correct
- `latency` - how long until the correct response appears
- `branch_quality` - did the learner choose the right next move
- `stability` - does performance hold across a clean set
- `recovery` - can the learner repair after a miss
- `transfer` - does the pattern survive in live conditions

This is just the universal measurement logic applied to skill training: define the system, pick dimensions, choose useful metric classes, and add time. (source: raw/Neural OS Book/Measurements.md)

### 6. Build The Session Around Three Drill Roles

Every normal session should contain:

- `anchor drill` - stable work at the current level
- `stretch drill` - one step harder
- `repair drill` - direct attack on today's main collapse

This is the safest default block across skill types. (source: drill-generator.md; drill-ladder-patterns.md)

### 7. Use Stage Progression, Not Random Variety

The default drill ladder is (canonical numbering at [skill-progression-stages](./skill-progression-stages.md)):

0. orientation
1. isolation
2. clean repetition
3. controlled variation
4. automaticity
5. mixing
6. pressure and noise
7. transfer and zenith

Do not add time pressure before clean control.
Do not add mixing before isolation.
Do not add noise before recoverability. (source: drill-generator.md; drill-ladder-patterns.md)

### 8. Set Promotion And Fallback Rules

Every gym must state:

- pass rule
- promotion rule
- fallback rule

Examples:

- `9/10` correct on one clean family
- dominant principle identified in under `60s`
- one interruption repaired without full reset

The threshold can vary by domain. Explicit promotion cannot. (source: drill-generator.md; raw/Neural OS Book/Intensity.md)

### 9. Add Pressure Only After Stability

Pressure can mean:

- timer
- noise
- interruption
- partial context
- movement
- real-world task constraints

Pressure is where the skill stops being classroom-only. But introduced too early, it corrupts form instead of testing it. (source: drill-generator.md; raw/06 Buffer/language_learning.md)

### 10. Convert Mature Skills To Maintenance

A gym is not meant to stay heavy forever.

Once a sub-skill is stable:

- reduce frequency
- keep one transfer rep
- bring it back only when metrics slip

This follows `Measurements` and `RAPID`: the system should reduce cost while preserving usable performance. (source: raw/Neural OS Book/Measurements.md; raw/03 Tactical_Memory/RAPID Framework.md)

## The Minimum Declaration Every Skill Should Have

If Neural OS is to "write a gym for every skill," each serious skill page should eventually declare at least this:

```yaml
skill:
skill_type:
target_reflex:
real_use_case:
current_stage:
failure_mode:
anchor_drill:
stretch_drill:
repair_drill:
metrics:
  accuracy:
  latency:
  branch_quality:
  stability:
  recovery:
  transfer:
pass_rule:
fallback_rule:
review_rule:
session_length:
weekly_frequency:
```

If the skill is large or strategically important, it should also get its own dedicated `*-drill-ladder` page.

## Example RISE Declaration

```yaml
skill: dynamic programming pattern recognition
skill_type: judgment
target_reflex: recognize overlapping subproblems and state compression opportunities within 3 seconds
gym_mode: recognition
rise:
  reflex: classify the problem shape immediately
  intensity: timed mixed set
  sparring: adversarial near-miss problem set
  evaluation:
    accuracy: 16/20 correct
    latency_p50: <3s
    latency_p90: <5s
    branch_errors: <=2
current_stage: 4
failure_mode: confuses neighbors
anchor_drill:
  family: pattern classification
  prompt_shape: 10 clean DP vs non-DP cases
stretch_drill:
  family: mixed classification
  prompt_shape: 10 mixed graph/greedy/DP cases under time
repair_drill:
  family: neighbor contrast
  prompt_shape: explain why 3 near-miss problems are not DP
pass_rule: 16/20 correct with median latency under 3 seconds
fallback_rule: remove timer and return to clean discrimination
review_rule: D1/D3/D7
session_length: 20m
weekly_frequency: 5x
```

## Skill-Type Routing

The gym framework is universal, but the drill family should inherit the skill type:

- `concept` -> recall, contrast, explanation, regeneration
- `graph` -> node-edge control, path walking, pattern recognition
- `procedure` -> trigger, step, branch, repair, timing
- `judgment` -> case comparison, dominant-choice selection, minimum-fix defense
- `expression` -> latency, repair, rhythm, pragmatics, live variation

This keeps the gym aligned with the existing framework family instead of inventing a new mega-system. (source: drill-generator.md; rapid-in-neural-os.md)

## What AI Should Produce For Any New Skill

When asked to build a gym for a skill, the default output should be:

1. a one-paragraph statement of the real target
2. the primary gym mode: recognition, execution, retrieval, or stress
3. the target reflex in precise trigger-response form
4. the `RISE` block
5. a stage `0-7` map
6. the dominant failure modes
7. a minimum daily session
8. pass and fallback rules
9. a first-two-weeks block
10. one worked generator snapshot

That is the smallest format that reliably turns a static skill note into a training system. (source: drill-ladder-patterns.md)

## Relationship To Existing Systems

To avoid overlap, keep the boundaries explicit:

- use [NEDF](./nedf-overview.md) when the problem is concept identity
- use [CAST System](./cast-overview.md) when the problem is structure
- use [SPEAR](./spear-overview.md) when the problem is process execution
- use [drill-generator](./drill-generator.md) when the problem is progression logic
- use `Red Queen Skill Gym` when the problem is low-latency performance
- use `RISE` when designing the inner loop of a gym session
- use [web-gym-generation-schema](./web-gym-generation-schema.md) when AI must compile the gym into a concrete web interface

This is the cleanest interpretation of your proposal because it adds the missing compiler layer without blurring the rest of the framework family. (source: framework-comparison-matrix.md; rapid-in-neural-os.md; User proposal in chat about reflex formation / RISE, 2026-05-05)

## Three Hard Rules

### Do Not Solve Reflex Problems With More Notes

If the bottleneck is speed, hesitation, or recovery, the answer is usually not another explanation page. (source: missing-encoding-layers.md; raw/06 Buffer/language_learning.md)

### Do Not Time Broken Form

Speed should reinforce stable movement, not unstable guessing. (source: drill-generator.md; raw/Neural OS Book/Intensity.md)

### Do Not Train The Whole Skill At Once

If the dependency graph is still too large, isolate again. (source: raw/Neural OS Book/Isolation.md)

## Bottom Line

Red Queen does not mainly need another comprehension framework or another memory encoder.

It needs a **gym-creation framework** that systematically turns:

- understanding into response
- memory into procedure
- accuracy into speed
- speed into robustness
- drills into transfer

The existing [drill-generator](./drill-generator.md) is the exercise engine.
This page defines where that engine sits in Red Queen and what every serious skill gym must contain.

## Workout Types Hosted In The Gym

Three of the four 2026-05 layer additions run their training inside this gym rather than spawning sibling gyms:

- **ORACLE workouts** — predictive-encoding drills in four flavors (sequential / conditional / distributional / anomaly), with mixed-mode default and three single-mode isolation variants (Hide-Estimate, Anomaly-detection, Distribution-ranking). See [oracle-overview](./oracle-overview.md).
- **PULSE modulation** — the gym does not run PULSE workouts; instead PULSE *reads* the user's state and modulates this gym's intensity, volume, and workout selection. Under low energy (E≤2) it switches mixed-mode to single-mode isolation and cuts volume ~50%; under high stress (S≥4) it avoids time-pressure workouts and switches to format-only drills. See [pulse-overview](./pulse-overview.md).
- **GRACE workouts** — social-pragmatic move drills with read-mode (recognize cues), produce-mode (write the calibrated move), and mixed-mode default. See [grace-overview](./grace-overview.md).

The shared isolation / intensity / RISE / measurement infrastructure on this page applies uniformly to all three. New workout types may be added in future without restructuring the gym.

## External grounding — Retrieval practice + Interleaving + Desirable difficulties

The gym is the operational implementation of three converging strands of learning-science research:

- **Retrieval practice / testing effect** (Roediger & Karpicke 2006; Karpicke & Blunt 2011; Dunlosky 2013 strategy #2) — the gym tests, it does not tell. The Lamp / Scale / Sword phases are graded retrieval-practice intensities. See [active-recall](./active-recall.md) for the canonical citation; this page is the operational implementation across all encoders.
- **Interleaving** (Rohrer & Taylor 2007; Birnbaum et al. 2013; Dunlosky 2013 strategy #3) — mixed-mode workouts interleave problem types within a session rather than blocking. Empirically, interleaving produces better discrimination and transfer at the cost of slower in-session feel ("interleaving feels harder, performs better"). [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md) is the canonical interleaving drill. PULSE's low-state switch from mixed-mode to single-mode isolation is the *exception* — when the user is depleted, the desirable difficulty becomes too costly.
- **Desirable difficulties** (Bjork 1994; Bjork & Bjork 2011) — the gym deliberately introduces difficulty (time pressure, mixed modes, format variation) because difficulty *during* practice produces storage-strength gains that easy practice does not. This is why the gym tracks not just accuracy but recovery-after-stall and the "rotting-fact" detector — Bjork's distinction between storage strength and retrieval strength operationalized.

The Lamp / Scale / Sword phase naming (replacing the retired "Stages 1→2→3" wording in [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)) maps directly onto Sweller's **expertise-reversal effect**: Lamp = high-scaffolding recognition for novices, Scale = mid-scaffolding discrimination for intermediates, Sword = low-scaffolding pressure for experts. Per Sweller (2003+), running Sword on a Lamp-stage learner overloads working memory; running Lamp on a Sword-stage learner adds extraneous load. Phase-appropriate intensity is not optional.

See [learning-sciences-validation](./learning-sciences-validation.md) for the broader mapping of Neural OS onto canonical learning science. The gym is the load-bearing implementation of retrieval-practice + interleaving + desirable-difficulties.

## Related Pages

- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [drill-generator](./drill-generator.md)
- [l2-phonology-gym](./l2-phonology-gym.md) — runnable phonology/speaking instance
- [visualization-gym](./visualization-gym.md) — self-administered imagery-vividness instance (execution mode); wires [visualization-training](./visualization-training.md)'s 8-stage ladder into RISE + Lamp/Scale/Sword
- [drill-ladder-patterns](./drill-ladder-patterns.md)
- [missing-encoding-layers](./missing-encoding-layers.md)
- feedback-loop-taxonomy
- [language-learning-architecture](./language-learning-architecture.md)
- [language-learning-protocol](./language-learning-protocol.md)
- [web-gym-generation-schema](./web-gym-generation-schema.md)
- [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md)
- [soroban-drill-ladder](./soroban-drill-ladder.md)
- solid-drill-ladder
- [oracle-overview](./oracle-overview.md)
- [pulse-overview](./pulse-overview.md)
- [grace-overview](./grace-overview.md)
- [lifecycle-manager](./lifecycle-manager.md)

---

## U — See (CAST)
1. Performance layer above the encoders
2. Edges: isolation + intensity + feedback + measurement

## D — Name (NEDF)
1. Red Queen Skill Gym = "run faster to stay in place"
2. Turns comprehension + memory into reflex
3. Sister to Drill Generator (gym = runtime; generator = design)

## F — Do (SPEAR)
1. Spec gym for the skill → isolate it
2. Add intensity progression
3. Wire feedback + measurement

## B — Watch (HEART)
1. Gym without measurement → unfalsifiable
2. Intensity flat → no Red Queen pressure
3. Isolation missing → noise dominates signal

## L — Predict (ORACLE)
1. Gym-trained skill → survives field deployment
2. No gym → skill stays comprehension-only

## R — Act (GRACE)
1. Skill identified → spin up a gym
2. Skill decay → re-enter the gym

## Related pages

- **2026-05-29 learning-canon cross-links**: [interleaving](./interleaving.md) (Stage 7 Mixed-pressure operationalizes this) · [desirable-difficulties](./desirable-difficulties.md) (Bjork; the gym's design principle) · [making-smaller-circles](./making-smaller-circles.md) (Waitzkin; upper-stage compression) · [deliberate-practice](./deliberate-practice.md) (the 4 components map onto stage design) · [brown-make-it-stick](./brown-make-it-stick.md) · [ericsson-peak](./ericsson-peak.md)
