---
palace: meta-knowledge
level: 5
domain: 10
room: 7
wiki_source: wiki/problem-solving/problem-solving-maturity-levels.md
---

# Problem Solving Maturity Levels

**Summary**: A six-level progression (0 Lost → 5 Expert) defining what problem-solving maturity looks like at each stage, with exit criteria and practice drills for advancing to the next level.

**Sources**: raw/01 Core_Memory/Problem Solving Maturity Levels.md

**Last updated**: 2026-05-04

---

## Core Claim

Maturity is not about IQ. It is about how well you classify problems, choose representations, reduce uncertainty, reach correct solutions, and extract reusable patterns.

The main shift across levels:

```
Beginner:  "How do I solve this?"
Expert:    "What kind of problem is this, and what is the highest-leverage move?"
```

---

## Quick Reference

| Level | Name | Main Ability | Main Failure | Upgrade Target |
|---|---|---|---|---|
| 0 | Lost | Reacts to the surface | Confuses motion with progress | Learn to frame |
| 1 | Beginner | Can state the problem | Jumps to solving too early | Learn to represent |
| 2 | Advanced Beginner | Can try standard moves | Uses moves mechanically | Learn to diagnose problem type |
| 3 | Competent | Solves ordinary problems reliably | Gets stuck on complexity shifts | Learn to choose better representations |
| 4 | Advanced | Can reframe, prune, and recover | Can still overcomplicate | Learn compression and transfer |
| 5 | Expert | Sees structure quickly and teaches it | Risks intuition without explanation | Optimize, teach, and design methods |

---

## Level 0: Lost

**What it looks like:** starts working before defining the problem, confuses reading/thinking/solving, tries random actions, cannot say what success means.

**Upgrade target:** learn to frame the problem in plain language.

**Exit criteria:** can write current state, goal state, constraints, and one concrete next question.

**Practice:** restate one problem per day in your own words. Define success before acting.

---

## Level 1: Beginner

**What it looks like:** can state the problem and list givens/unknowns. Still jumps to favorite methods. Treats every hard problem as "more effort needed."

**Typical failure:** bad representation — sees the problem only in words when it should be a table, graph, equation, or state machine.

**Upgrade target:** learn to generate multiple representations.

**Exit criteria:** can take one problem and produce at least two useful representations.

**Practice:** for each problem, force two views (verbal + visual, list + table, graph + sequence). Compare which representation makes prediction easier.

---

## Level 2: Advanced Beginner

**What it looks like:** knows common moves (small cases, working backward, case splitting, contradiction, invariants). Can make progress on familiar tasks. Still applies methods mechanically.

**Typical failure:** wrong problem type — treats tradeoff problems as search problems, execution problems as knowledge problems, constraint problems as motivation problems.

**Upgrade target:** learn to classify the dominant bottleneck correctly.

**Exit criteria:** can distinguish search / execution / constraint / tradeoff before choosing tools.

**Practice:** use [problem-type-classifier](./problem-type-classifier.md). Take five past failures and reclassify them. Ask before solving: "Do I lack the path, execution, resources, or prioritization?"

---

## Level 3: Competent

**What it looks like:** solves normal problems reliably, chooses among several moves, uses small probes instead of committing blindly, can explain why a move helps.

**Typical failure:** breakdown under complexity — handles normal cases but struggles when variables multiply, structure is hidden, problem shifts domains, or exceptions collide.

**Upgrade target:** learn to reframe aggressively and compress structure.

**Exit criteria:** can get unstuck by changing representation, scale, direction, or assumptions without emotional collapse.

**Practice:** solve the same problem in two different ways. Force one reframe when stuck for 10 minutes. Distill solved problems into reusable principles.

---

## Level 4: Advanced

**What it looks like:** sees hidden structure faster, rejects noisy moves early, manages ambiguity and branching, uses feedback from failed predictions, transfers methods across domains.

**Typical failure:** overengineering — produces elegant but heavier-than-needed solutions.

**Upgrade target:** learn compression, teaching, and method design.

**Exit criteria:** can choose the smallest sufficient method, explain tradeoffs explicitly, and teach the core pattern to someone else.

**Practice:** compress each solved problem into one principle. Compare naive vs optimized solution paths. Teach one solution out loud from memory. Log prediction failures.

---

## Level 5: Expert

**What it looks like:** classifies problem types quickly, spots leverage points early, chooses strong representations almost immediately, knows when not to solve and when to redefine the problem.

**Core strength:** experts do not just solve problems — they shape the framing, the environment, the search space, and the decision criteria so the right move becomes easier for everyone else too.

**Risk:** unexplained intuition — if the expert cannot unpack the reasoning, others cannot learn from it.

**Exit criteria:** can solve, explain, transfer, teach, and design a repeatable workflow for others.

**Practice:** create templates. Compare rival framings. Mentor others. Codify recurring patterns.

---

## Progression Path

| Transition | Focus | Drill |
|---|---|---|
| 0 → 1 | Define problem before acting | Write one-paragraph problem statements |
| 1 → 2 | Generate better representations | Force two representations per problem |
| 2 → 3 | Classify problem type before choosing a move | Label each live problem: search / execution / constraint / tradeoff |
| 3 → 4 | Deliberate reframing and recovery | If stuck 10 min, change representation, scale, direction, or assumptions |
| 4 → 5 | Compression, transfer, and teaching | Extract one reusable rule from every solved problem |

---

## Anti-Patterns By Level

- Level 0: random activity
- Level 1: premature solving
- Level 2: method worship
- Level 3: local competence, poor adaptation
- Level 4: overcomplication
- Level 5: intuition without transmissibility

---

## Fast Self-Assessment

| Level | Question |
|---|---|
| 0 | Can I even define what the problem is? |
| 1 | Can I restate it and name the goal clearly? |
| 2 | Can I classify the problem type and try standard moves? |
| 3 | Can I solve ordinary versions reliably and recover when stuck? |
| 4 | Can I reframe, prune, and transfer methods across domains? |
| 5 | Can I teach, compress, and design a better workflow than the default? |

Your level is where you succeed **consistently**, not occasionally.

---

## Best Operating Rule

Do not ask: "Am I smart enough?"

Ask: "Which maturity jump is directly in front of me?"

---

## External grounding — Threshold Concepts + Expertise-Reversal

Two pieces of canonical learning science map directly onto this 6-level ladder:

**Threshold Concepts (Meyer & Land 2003-2006)** — Meyer & Land defined *threshold concepts* as concepts whose mastery is **troublesome / transformative / irreversible / integrative / bounded** — gateway portals into a discipline. Once crossed, the learner cannot un-see the field's structure; before crossing, they cannot see it. The **Level 3 (Competent) → Level 4 (Advanced) transition is a threshold crossing** in Meyer & Land's exact sense: the learner stops "solving normal cases" and starts "seeing hidden structure." The other transitions are gradual; this one is qualitative. The ladder's discontinuity at level 3→4 is not a Neural OS-specific oddity — it is the threshold-concept signature that learning science predicts for any discipline whose advanced practitioners see things novices literally cannot.

**Expertise-Reversal Effect (Sweller, Kalyuga 2003+)** — What helps novices (more scaffolding, more worked examples, more explicit explanation) actively *hurts* experts by adding extraneous cognitive load on top of already-automated processes. The level-appropriate "Next training" column on this page is the operational implementation: level 0-1 learners get heavy scaffolding (daily 1-line restatement drill, two-representation drill); level 4-5 experts get scaffolding-free demands (compression-and-transfer drills, method-design). The drill-generator's stage parameter (0→7) ramps scaffolding down as expertise grows. Per Sweller, this is not optional — applying level-0 scaffolding to a level-4 user reverses the effect.

See [learning-sciences-validation](./learning-sciences-validation.md) for the full mapping of Neural OS onto canonical learning science. This page is the operational home for both threshold-concept-aware progression and expertise-reversal-compliant training.

**Surgical follow-up**: cite Meyer & Land inline at the level-3→4 transition above (one-line edit); cite Sweller inline at "Next training" column (one-line edit).

---

## Related Pages

- [problem-type-classifier](./problem-type-classifier.md)
- [frame-forge](./frame-forge.md)
- [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [self-explanation](./self-explanation.md)
- [learning-sciences-validation](./learning-sciences-validation.md)
- [skill-progression-stages](./skill-progression-stages.md) — threshold-concept annotation worth adding


---

## U — See (CAST)
1. Six-level progression: 0 Lost → 5 Expert
2. Exit criteria + drills per level

## D — Name (NEDF)
1. Problem-solving maturity levels = 6-level skill ladder
2. Distinguisher: explicit exit criteria
3. Failure mode: self-assessment inflation

## F — Do (SPEAR)
1. Self-assess level
2. Drill exit-criteria for next level

## B — Watch (HEART)
1. Level-skipping
2. Drill drift

## L — Predict (ORACLE)
1. Level → predict failure modes
2. Failure mode → predict level

## R — Act (GRACE)
1. Stuck on problem → check level
2. Level uncertain → run diagnostic