---
palace: meta-knowledge
level: 5
domain: 10
room: 10
semantic_mode: 5
wiki_source: wiki/problem-solving/frame-forge.md
---

# FRAME FORGE

**Summary**: An 8-step pipeline for reducing uncertainty in search problems, from framing through distillation, with four specialized fast sub-pipelines for unknown structure, proofs, design/algorithm problems, and stuck recovery.

**Sources**: raw/01 Core_Memory/PELIA - problem solving.md

**Last updated**: 2026-05-04

---

## Core Claim

Problem solving is the act of reducing uncertainty until the next valid move becomes clear.

FRAME FORGE is primarily for **search problems** — when you do not know the path. If you already know the next move but are not executing it, or if something external is blocking you, classify first using [problem-type-classifier](./problem-type-classifier.md) before running FRAME FORGE.

The name reflects the two phases:
- **FRAME** — set the problem up correctly (Frame, Inventory, Represent)
- **FORGE** — work the solution (Probe, Generate, Evaluate, Formalize, Distill)

---

## Three Core Definitions

**Problem** — a gap between current state, desired state, and allowed operations. If any of the three is unclear, the first job is clarification, not solving.

**Move** — any action that changes your understanding of the problem: rewriting it, extracting a fact, testing an example, changing representation, splitting into cases.

**Progress** — at least one of these happened: search space shrank, a constraint became explicit, a useless path was eliminated, a stronger pattern appeared, solution structure became clearer. If none of that happened, you generated activity, not progress.

---

## The 8-Step Pipeline

### FRAME Phase

#### 1. Frame
Write down: what is given, what is unknown, what counts as a solution, what operations are allowed, what constraints are fixed.

**Output:** one-paragraph problem statement in your own words.

#### 2. Inventory
Extract all visible facts. Look for: quantities, relationships, symmetries, invariants, bounds, edge conditions.

**Output:** flat list of facts, assumptions, and constraints.

#### 3. Represent
Choose a model that makes structure visible. Ask: is this a graph, algebra, search, optimization, or proof problem? Should it be states, transitions, or constraints?

**Output:** one or two candidate representations.

### FORGE Phase

#### 4. Probe
Run cheap experiments before committing. Try: smallest cases, extreme cases, random cases, hand simulation, simplified versions.

**Output:** observed patterns and failed intuitions.

#### 5. Generate Moves
Ask: what can I do from here? Standard moves:
- move forward from givens
- work backward from the goal
- split into cases
- assume the opposite
- construct an example
- search for an invariant
- reduce to a known problem
- introduce notation

**Output:** short list of plausible next moves.

#### 6. Evaluate
For each candidate move, ask: does it reduce uncertainty? expose structure? eliminate cases? can I test it cheaply? Keep moves that compress the problem. Drop moves that create noise.

**Output:** one active line of attack.

#### 7. Formalize
Once a line of attack works, turn it into an explicit solution — derivation, proof, algorithm, construction, or decision rule.

**Output:** complete argument or procedure.

#### 8. Distill
After solving, ask: why did this work? what was the key representation? what general pattern does this belong to? what would I reuse next time?

**Output:** reusable principle, heuristic, or template.

---

## Operating Loop

Problem solving is not linear:

```
Frame -> Inventory -> Represent -> Probe -> Generate -> Evaluate
                  ^                                         |
                  |                                         v
                  +------------- Reframe if stuck <---------+
```

When stuck, do not push harder. Change one of: the representation, the scale, the direction, the assumptions.

---

## Four Fast Sub-Pipelines

### Pipeline A: Unknown Structure
Use when you do not yet know what kind of problem it is.
1. Restate in plain language
2. List givens, unknowns, constraints
3. Build two representations
4. Test small cases
5. Look for repeated structure
6. Pick the representation that makes prediction easiest

### Pipeline B: Proof Problem
Use when the task is to show something must or cannot happen.
1. State the claim precisely
2. Identify what would count as a counterexample
3. Search for invariants, bounds, parity, or contradiction
4. Test the claim on small instances
5. Choose proof style: direct, contradiction, induction, construction
6. Write the proof with every implication explicit

### Pipeline C: Design or Algorithm Problem
Use when you must build a method, not just explain one.
1. Define target behavior
2. Define input, output, constraints
3. Build a toy version
4. Propose a naive method
5. Find where the naive method fails
6. Add structure, pruning, caching, or decomposition
7. Test on edge cases
8. Extract the final procedure

### Pipeline D: Stuck Recovery
Use when effort is high and insight is low.
1. Stop pushing the current path
2. Write what is actually known
3. Identify the exact point of ambiguity
4. Shrink the problem
5. Change representation
6. Reverse direction: work backward from the goal
7. Ask what would make the problem trivial
8. Import one known technique from a nearby domain

---

## Decision Rules

- If the problem feels vague, clarify the success condition
- If the facts are messy, build a table or graph
- If you have too many cases, search for symmetry or invariants
- If no move looks promising, test smaller versions
- If small cases behave differently, find the threshold where behavior changes
- If a proof feels impossible, try to construct a counterexample
- If construction feels impossible, derive necessary conditions first
- If you keep looping, your representation is probably wrong

---

## Failure Modes

- Solving before framing
- Committing to the first representation
- Confusing activity with progress
- Testing only friendly examples
- Formalizing too late
- Refusing to abandon a dead path

**Diagnostic check:** "What changed in my understanding during the last 10 minutes?" If the answer is nothing clear — reframe.

---

## Compact Principle

Do not ask "How do I solve this?" Ask:
1. What is the right representation?
2. What is the next move that reduces uncertainty?
3. What evidence shows I am actually making progress?

---

## Integration With Neural OS

FRAME FORGE is the search-problem engine. It hands off to the encoding frameworks after Distill:

| Distilled output | Destination |
|---|---|
| Single concept | [NEDF](./nedf-overview.md) |
| Relational structure | [CAST](./cast-overview.md) |
| Repeatable procedure | [SPEAR](./spear-overview.md) |

Before running FRAME FORGE, verify the problem is actually a search problem using [problem-type-classifier](./problem-type-classifier.md). For comprehension failures during Represent or Inventory steps, use [self-explanation](./self-explanation.md) or [bridge-load](./bridge-load.md).

---

## External grounding — pipeline equivalence + ACH at step 6

The 8-step FRAME FORGE pipeline is one variant of a universal structured-problem-solving skeleton that appears across at least eleven major traditions, each with a different name and cosmetic variation. See [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) for the side-by-side comparison table. The skeleton: **frame → decompose → probe → generate → evaluate → formalize → distill**. FRAME FORGE's specific contribution is (a) the FRAME/FORGE phase split that names the upstream-vs-downstream divide, (b) the four fast sub-pipelines (unknown-structure / proof / design-algorithm / stuck recovery) for skipping ahead under specific failure modes, and (c) explicit composition with the [S·E·C·T](./problem-type-classifier.md) classifier upstream.

**Pólya equivalence** — Pólya 1945 "How to Solve It" 4-stage maps cleanly: Pólya stage 1 (Understand) ≈ FRAME phase steps 1+2+3; Pólya stage 2 (Devise a plan) ≈ FORGE step 5; Pólya stage 3 (Carry out) ≈ FORGE step 7; Pólya stage 4 (Look back) ≈ FORGE step 8 (Distill).

**McKinsey 7-step equivalence** — Define → Disaggregate (logic tree, MECE) → Prioritize → Workplan → Analyze → Synthesize → Recommend. McKinsey steps 1+2+3 ≈ FRAME phase; steps 4-6 ≈ FORGE Probe+Evaluate+Formalize; step 7 ≈ Distill plus a *delivery* step which FRAME FORGE leaves to [problem-solving-os](./problem-solving-os.md) step 5+ ([external-problem-solving-frameworks](./external-problem-solving-frameworks.md) N1 "Delivery layer" extension candidate covers this gap).

**ACH at step 6 (Evaluate)** — Richards Heuer's **Analysis of Competing Hypotheses** (CIA Tradecraft Primer; *Psychology of Intelligence Analysis*) is a formal matrix-based extension of FRAME FORGE step 6: list hypotheses across columns, list evidence down rows, score each cell for *consistency with the hypothesis*, then **rank hypotheses by inconsistency** (the least-disconfirmed hypothesis wins — not the most-supported, which is the confirmation-bias trap). ACH operationalizes Chamberlin/Platt multiple-working-hypotheses discipline. Recommended when step 6 has more than 2-3 viable candidates or when the cost of picking wrong is high. Listed as N36 in [external-problem-solving-frameworks](./external-problem-solving-frameworks.md).

Also worth knowing for step 5 (Generate Moves): TRIZ 40 Inventive Principles + Contradiction Matrix (Altshuller — N2); Six Thinking Hats divergence rotation (de Bono — N3); Inversion / "what would guarantee failure?" (Munger/Jacobi — N20). These are not all yet integrated as named moves in step 5's standard list; surgical extensions queued in [external-problem-solving-frameworks](./external-problem-solving-frameworks.md) §"Surgical extensions."

See [learning-sciences-validation](./learning-sciences-validation.md) for the broader learning-science grounding of the wiki.

---

## Related Pages

- [problem-type-classifier](./problem-type-classifier.md)
- [problem-solving-maturity-levels](./problem-solving-maturity-levels.md)
- [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md)
- [self-explanation](./self-explanation.md)
- [bridge-load](./bridge-load.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [NEDF](./nedf-overview.md)
- [CAST](./cast-overview.md)
- [SPEAR](./spear-overview.md)


---

## U — See (CAST)
1. 8-step uncertainty-reduction pipeline for search problems
2. Plus 4 specialized sub-pipelines

## D — Name (NEDF)
1. Frame Forge = 8-step search-problem pipeline
2. Distinguisher: framing through distillation
3. Failure mode: skipping framing step

## F — Do (SPEAR)
1. Search problem → run 8-step pipeline
2. Stuck variant → invoke specialized sub-pipeline

## B — Watch (HEART)
1. Frame-skipping
2. Wrong sub-pipeline

## L — Predict (ORACLE)
1. Problem class → predict sub-pipeline
2. Step → predict output

## R — Act (GRACE)
1. Search problem appears → run Frame Forge
2. Stuck → switch sub-pipeline