---
palace: strategic-memory
level: 6
domain: 10
room: 6
semantic_mode: 5
wiki_source: wiki/logic/math-learning-with-neural-os.md
---

# Math Learning With Neural OS

**Summary**: A practical operating manual for learning mathematics with Neural OS by separating process control (`RAPID`) from representation (`NEDF`, `CAST`, `SPEAR`) and by matching each kind of math material to the right layer and review loop.

**Sources**:
- raw/01 Core_Memory/Math/Math Index.md
- raw/01 Core_Memory/Math/Trigonometry.md
- raw/01 Core_Memory/Math/Elementary School Math/Proof.md
- raw/03 Tactical_Memory/RAPID Framework.md
- raw/Index - Neural OS.md
- framework-comparison-matrix.md
- rapid-in-neural-os.md
- memory-palace-architecture-for-neural-os.md
- trigonometry-compass-palace.md
- missing-encoding-layers.md

**Last updated**: 2026-05-02

---

## Core Claim

To learn math well in Neural OS, do **not** treat all math as one thing.

Math contains at least four different jobs:

- concepts and definitions
- relations and dependency structures
- procedures and symbolic manipulations
- proofs and problem-solving decisions

Neural OS works best when each job is routed to the smallest framework that fits it:

- `RAPID` controls the learning project
- `NEDF` encodes concepts
- `CAST` encodes structures and dependency maps
- `SPEAR` encodes procedures and solve-routes
- the folder layers decide where the knowledge should live long term

This follows the system rule that process, encoding method, and storage layer should stay separate. (source: rapid-in-neural-os.md; framework-comparison-matrix.md; memory-palace-architecture-for-neural-os.md)

## Drill Readiness Status

This page is a **composite operating manual**, not one drill ladder.

That means it is still partly theory-heavy under the new drill declaration bar.

Use it to organize math learning at the system level.

Do not treat it as a single drill-ready skill page.

For the current audit status, see [drill-readiness-audit](./drill-readiness-audit.md).

## What Goes Where

### Layer Placement

Use the folder layers like this:

- `Core_Memory/Math` for stable truths, definitions, formulas, theorems, and canonical examples
- `Strategic_Memory` for transferable math models such as proof methods, function thinking, invariants, symmetry, and graph-like dependency maps
- `Tactical_Memory` for procedures, drills, worked problem types, calculator/tool usage, and exam workflows
- `Reflective_Memory` for error logs, recurring confusions, emotional barriers, and lessons from failed attempts
- `Meta_Knowledge` for study protocols, review policies, and math-learning governance
- `Buffer` for unprocessed exercises, source captures, and unresolved questions

This matches the existing district model of Neural OS. (source: raw/Index - Neural OS.md; memory-palace-architecture-for-neural-os.md)

### Framework Selection Rule

Use this decision rule:

- if the question is `What is this?` use `NEDF`
- if the question is `What depends on what?` use `CAST`
- if the question is `How do I execute this?` use `SPEAR`
- if the question is `Why does this proof work?` usually use `NEDF + CAST`, and sometimes `SPEAR` for proof flow

Math examples:

- `function`, `limit`, `group`, `derivative` -> `NEDF`
- prerequisite map for algebra -> precalculus -> calculus -> linear algebra -> discrete math -> `CAST`
- solving linear equations, factoring, differentiation rules, induction template -> `SPEAR`
- theorem vs axiom vs proof dependency -> `NEDF + CAST`
- trig sign behavior on the unit circle -> `NEDF + spatial reinforcement`, already shown in [trigonometry-compass-palace](./trigonometry-compass-palace.md)

This is a direct application of the framework-comparison rules to math material. (source: framework-comparison-matrix.md; trigonometry-compass-palace.md; raw/01 Core_Memory/Math/Elementary School Math/Proof.md)

## Minimal Setup

Before starting a math topic, create five things:

1. a `Learning Contract`
2. one source hub
3. one dependency map
4. one drill bank
5. one error log

Recommended metadata:

```yaml
topic: calculus_limits
layer: Core_Memory
rapid_phase: define
framework: NEDF
maturity: 1
review_rule: D1/D3/D7/D21
transfer_target: physics | programming | finance
```

The point is to make the math topic visible to RAPID, not just store notes passively. (source: raw/03 Tactical_Memory/RAPID Framework.md; rapid-in-neural-os.md)

## End-to-End Workflow

## Phase 0: Define

Write a short contract before studying:

- what math topic are you learning
- why now
- how deep you need to go
- what success looks like
- what prerequisites are required
- when to stop or pause

Example:

```yaml
Skill: Trigonometry
Use-case(s): pass exam, support calculus and physics
Deadline: 8 weeks
Depth: working
Success_criteria:
  - Solve mixed unit-circle, identity, and graph problems at 80%+
  - Explain sine/cosine/tangent from the unit-circle model
  - Complete one cheat sheet from memory
Constraints:
  - Time_per_week: 5h
Stop_rule: pause if prerequisite algebra gaps block progress for 3 sessions in a row
```

This prevents fake progress where you collect pretty math notes without performance targets. (source: raw/03 Tactical_Memory/RAPID Framework.md)

## Phase 1: Research

For each topic, collect only a few sources:

- 1 primary explanation source
- 1 exercise-heavy source
- 1 alternate explanation source

Then build a dependency map.

Examples:

- `fractions -> ratios -> equations -> functions`
- `functions -> limits -> derivatives -> applications`
- `logic -> implication -> proof -> induction -> discrete math`

Use `CAST` when the main problem is prerequisite structure. The map should show:

- prerequisites
- common confusions
- canonical problem types
- downstream uses

If you cannot explain the dependency graph, you are often trying to study too high in the stack. (source: raw/03 Tactical_Memory/RAPID Framework.md; framework-comparison-matrix.md)

## Phase 2: Absorb

During reading, do not just copy formulas.

For every important math object, capture:

- definition
- intuition
- non-example
- typical use
- common confusion
- one small drill

Use `NEDF` for core concepts.

Example targets:

- variable
- function
- proof
- theorem
- limit
- derivative
- matrix
- graph

The note is finished only when you can tell what the object is, what it is not, and why it matters. (source: framework-comparison-matrix.md; raw/01 Core_Memory/Math/Elementary School Math/Proof.md)

## Phase 2.5: Encode

This is where Neural OS becomes useful rather than decorative.

### Use `NEDF` For Concepts

Encode terms that are semantically slippery:

- proof
- implication
- necessary vs sufficient
- function
- vector
- derivative
- integral
- eigenvector

Your `NEDF` scene should distinguish the concept from nearby confusions, not just make it memorable.

### Use `CAST` For Structure

Encode maps such as:

- prerequisite graphs
- theorem dependency trees
- algebraic structure families
- function transformations
- equivalence between representations
- problem-type taxonomy

Good math `CAST` objects usually answer:

- what must be known first
- what unlocks what
- which ideas are siblings or contrasts
- where students typically branch wrong

### Use `SPEAR` For Procedures

Encode:

- solving equations
- factoring patterns
- derivative workflows
- integration techniques
- proof templates
- graph sketching routines

A math `SPEAR` note should include:

- trigger: what kind of problem starts this method
- preconditions: when the method is valid
- execution: the steps
- alternatives: what to do if the standard route fails
- repair: what common mistake to check first

This is essential because many math failures are execution failures, not comprehension failures. (source: framework-comparison-matrix.md; raw/03 Tactical_Memory/RAPID Framework.md)

## Phase 3: Practice

Math requires both retrieval and controlled manipulation.

Split drills into four buckets:

- concept recall
- symbolic manipulation
- mixed problem recognition
- proof completion

Good drill design:

- short and frequent
- timed once accuracy is acceptable
- mixed across nearby topics
- corrected immediately

Suggested pass rules:

- concept cards: answer in under 2 seconds
- atomic procedures: 9/10 correct
- mixed sets: 80%+ without hints
- proof outlines: can reconstruct the skeleton from memory

This is the point where `automaticity` begins to matter. (source: raw/03 Tactical_Memory/RAPID Framework.md; missing-encoding-layers.md)

For the dedicated ladder behind `mixed problem recognition`, use [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md).
For the dedicated ladder behind `proof completion`, use [proof-reconstruction-drill-ladder](./proof-reconstruction-drill-ladder.md).
For the dedicated ladder behind `symbolic manipulation`, use [symbolic-fluency-drill-ladder](./symbolic-fluency-drill-ladder.md).

## Phase 3.5: Apply

Math should not stay as isolated worksheet performance.

Create mini-missions such as:

- explain a theorem simply from memory
- derive one formula instead of memorizing it blindly
- connect a math idea to programming, physics, finance, or logic
- solve one unfamiliar problem with written reasoning
- teach one concept using your own palace or map

If you cannot transfer the topic, maturity is lower than it feels. (source: raw/03 Tactical_Memory/RAPID Framework.md; memory-palace-architecture-for-neural-os.md)

## Phase 4: Integrate

Promote topics when they start connecting across layers.

Examples:

- `Core -> Tactical`: algebra supports coding, spreadsheets, or physics calculations
- `Core -> Strategic`: induction becomes a general reasoning pattern
- `Strategic -> Tactical`: graph theory informs algorithms
- `Reflective -> Meta`: repeated mistakes produce a new study rule

This is where math stops being a school subject and becomes part of the operating system. (source: memory-palace-architecture-for-neural-os.md)

## Phase 5: Distill

Each serious topic should eventually produce:

- one cheat sheet
- one dependency map
- one misconception list
- one small set of canonical problems
- one compressed review route

If a topic cannot be compressed, you probably still do not understand its invariants. (source: raw/03 Tactical_Memory/RAPID Framework.md)

## Phase 6: Review And Optimize

Weekly review should ask:

- which concepts are still vague
- which procedures are too slow
- which mistakes repeat
- which topics fail under mixing
- which notes are bloated and should be compressed

Monthly review should ask:

- what can be retired
- what needs deeper encoding
- what deserves cross-domain transfer
- what prerequisite gap is still poisoning the stack

This keeps math learning cumulative instead of leaky. (source: raw/03 Tactical_Memory/RAPID Framework.md)

## How To Study Different Kinds Of Math

## 1. Definitions And Foundations

Use `NEDF` first.

Examples:

- set
- function
- theorem
- proof
- implication
- limit

Goal:

- exact meaning
- contrast with near-misses
- one strong mental scene
- one sentence explanation

## 2. Formula Families

Use `NEDF + drill + cheat sheet`.

Examples:

- exponent rules
- trig identities
- derivative rules
- area and volume formulas

Goal:

- know what the formula means
- know when it applies
- know the units or geometric interpretation
- know the common misuse

Do not memorize formula strings without interpretation.

## 3. Procedures

Use `SPEAR`.

Examples:

- long division
- solving systems of equations
- factoring quadratics
- taking derivatives
- matrix row reduction

Goal:

- low-latency execution
- condition checking
- branch awareness
- error repair

## 4. Dependency-Heavy Topics

Use `CAST`.

Examples:

- calculus prerequisite graph
- discrete math proof toolkit
- linear algebra concept graph
- theorem networks inside geometry

Goal:

- navigate what depends on what
- identify bottlenecks
- prevent studying topics out of order

## 5. Proofs

Use `NEDF + CAST + SPEAR`.

Why:

- `NEDF` clarifies each logical object
- `CAST` shows dependency and theorem structure
- `SPEAR` stores the execution route of a proof template

Typical proof templates to encode procedurally:

- direct proof
- contradiction
- contrapositive
- induction
- case split

For each proof, store:

- statement
- assumptions
- target
- key bridge idea
- failure mode

The current raw proof note is minimal, which means proof deserves much richer treatment in the wiki layer. (source: raw/01 Core_Memory/Math/Elementary School Math/Proof.md)

## Worked Example: Trigonometry

The trig material already demonstrates a good Neural OS fit.

Use:

- `NEDF` for sine, cosine, tangent, radians, identity, amplitude
- spatial mnemonic reinforcement from [trigonometry-compass-palace](./trigonometry-compass-palace.md)
- `SPEAR` for solving trig equations or graph transformations
- `CAST` for relations between unit circle, triangle ratios, graphs, identities, and inverse trig

A good trig stack is:

1. compass anchors
2. quadrant signs
3. coordinate rule `(x, y) = (cos theta, sin theta)`
4. special-angle values
5. graph behavior
6. identity transformations
7. problem-solving procedures

This shows how one domain can move from `Core` meaning to `Tactical` execution without changing frameworks arbitrarily. (source: trigonometry-compass-palace.md; raw/01 Core_Memory/Math/Trigonometry.md)

## Recommended Math Note Types

Keep the note types simple:

- `Concept Note` -> one `NEDF` concept
- `Map Note` -> one `CAST` graph or dependency map
- `Procedure Note` -> one `SPEAR` routine
- `Drill Note` -> one exercise set with pass rule
- `Error Log` -> one recurring failure pattern
- `Cheat Sheet` -> one compressed review page

Do not mix all of these into one giant note.

## Review Cadence

Good default:

- `D0`: encode and do 3-5 immediate drills
- `D1`: retrieve from memory, then solve a few atomic problems
- `D3`: mix with neighboring topics
- `D7`: do one timed set
- `D21`: do one transfer task or teach-back
- `Monthly`: compress or refactor notes

Use slower cadence for stable concepts and faster cadence for fragile procedures. (source: raw/03 Tactical_Memory/RAPID Framework.md)

## Missing Layers For Math

The system is already good at concept, relation, and procedure encoding. The main gaps for math are performance layers rather than another static framework.

### 1. Automaticity Layer

Math often fails because retrieval or manipulation is too slow.

Needed:

- reaction-time targets
- timed symbolic drills
- hesitation tracking
- pressure testing

This is the math form of the general automaticity gap already identified in [missing-encoding-layers](./missing-encoding-layers.md). (source: missing-encoding-layers.md)

### 2. Symbol Layout Exactness Layer

This is a math-specific synthesis judgment.

The system has exact letter-level encoders, but math also needs reliable encoding for:

- superscripts and subscripts
- fraction structure
- parentheses and scope
- sign placement
- equation layout

If this layer stays weak, students may understand the idea and still miswrite the notation.

### 3. Proof Strategy Layer

The current system can store proof ingredients, but it still underweights:

- choosing the right proof method
- sensing when induction is appropriate
- spotting contradiction triggers
- searching for invariants or intermediate lemmas

This is partly a predictive layer and partly a procedural search layer.

### 4. Diagram And Visualization Layer

Math uses spatial intuition heavily in:

- geometry
- graphs
- vectors
- linear algebra
- calculus

The trig pages show the direction, but the system does not yet have a first-class general protocol for mathematical diagrams.

### 5. Robustness Layer

A topic may seem learned in clean drills but fail during:

- mixed problem sets
- word problems
- notation noise
- exam pressure
- multi-step proofs

This is the math version of the transfer and hostile-condition gap from [missing-encoding-layers](./missing-encoding-layers.md). (source: missing-encoding-layers.md)

## What Not To Do

- do not use one giant memory palace for all of mathematics
- do not memorize formulas before understanding the objects inside them
- do not put procedures into `Core` without separate drill notes
- do not study advanced topics while prerequisite graphs are still broken
- do not confuse `having notes` with `being able to solve`
- do not solve automaticity problems by writing more concept notes

## Minimal Weekly Protocol

If you want one compact operating loop:

1. pick one topic and define the success test
2. map prerequisites with `CAST`
3. encode key concepts with `NEDF`
4. encode procedures with `SPEAR`
5. run drills every day
6. log recurring mistakes
7. do one transfer task each week
8. distill the topic to one cheat sheet

That is the smallest complete Neural OS workflow for mathematics.

## Bottom Line

To use Neural OS for math:

- let `RAPID` run the project
- use `NEDF` for meaning
- use `CAST` for structure
- use `SPEAR` for execution
- store stable truths in `Core`, procedures in `Tactical`, and failures in `Reflective`
- review until the topic becomes fast, transferable, and compressible

The main missing pieces are not another framework, but stronger layers for:

- automaticity
- notation exactness
- proof strategy
- visual math encoding
- robustness under pressure

## Related Pages

- [drill-readiness-audit](./drill-readiness-audit.md)
- [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md)
- [proof-reconstruction-drill-ladder](./proof-reconstruction-drill-ladder.md)
- [symbolic-fluency-drill-ladder](./symbolic-fluency-drill-ladder.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [missing-encoding-layers](./missing-encoding-layers.md)
- Soroban Learning Method
- [trigonometry-compass-palace](./trigonometry-compass-palace.md)
- [unit-circle-as-compass](./unit-circle-as-compass.md)
- [quadrant-sign-patterns](./quadrant-sign-patterns.md)


---

## U — See (CAST)
1. Math learning manual separating process (RAPID) from representation (NEDF/CAST/SPEAR)
2. Material type → layer + review loop matching

## D — Name (NEDF)
1. Math learning with Neural OS = math operating manual
2. Distinguisher: process / representation separation
3. Failure mode: applying one encoder to all math material

## F — Do (SPEAR)
1. Math material → match to layer
2. Apply layer-appropriate review loop

## B — Watch (HEART)
1. Encoder mismatch
2. Skipping RAPID control

## L — Predict (ORACLE)
1. Math type → predict encoder
2. Layer → predict review cadence

## R — Act (GRACE)
1. New math → consult manual
2. Stuck → check layer fit