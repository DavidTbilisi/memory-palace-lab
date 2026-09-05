---
palace: strategic-memory
level: 7
domain: 10
room: 4
wiki_source: wiki/problem-solving/zeitz-startup-strategies.md
---

# Zeitz Startup Strategies — the unblock quartet

**Summary**: Four named strategies for unblocking initial problem-solving paralysis, drawn from Paul Zeitz's *The Art and Craft of Problem Solving* Ch 2.2: **Get your hands dirty · Penultimate step · Wishful thinking · Make it easier**. Each is a strategy-level move (per [problem-solving-three-levels](./problem-solving-three-levels.md)); together they form a checklist for the first 10 minutes of any problem. Sit between [ORIENT](./orient-method.md) (capture unfamiliar environments) and [FRAME FORGE](./frame-forge.md) (build structured frame) — ORIENT/FRAME FORGE are for *unfamiliar territory*; these four are for *problem-specific unblock when the territory is already understood*.

**Sources**:
- Paul Zeitz, *The Art and Craft of Problem Solving*, 3rd ed. (Wiley 2017), Ch 2.2 "Strategies for Getting Started" + Ch 2.4 "Other Important Strategies" (Draw a Picture · Recast · Change Point of View — secondary strategies that fire mid-investigation).
- [zeitz-art-and-craft](./zeitz-art-and-craft.md) — source-summary page.

**Last updated**: 2026-05-24

---

## The quartet

| # | Strategy | One-line | When it fires | Typical output |
|---|---|---|---|---|
| 1 | **Get your hands dirty** | Compute concrete cases until a pattern shows up | Always usable; especially when no theoretical entry point | An empirical conjecture |
| 2 | **Penultimate step** | Ask: what would yield the conclusion in *one more move*? | When the conclusion is specific and you want to plan backward | A subproblem whose solution closes the proof |
| 3 | **Wishful thinking** | Identify what makes the problem hard; pretend that difficulty isn't there | When you're stuck on a specific obstacle | A simpler version, or insight into the real obstacle |
| 4 | **Make it easier** | Solve the problem for smaller numbers, fewer constraints, lower dimensions | When the general problem is too abstract | A worked simpler case that scales up |

These are run *in any order* — but the typical sequence is: hands-dirty (to generate signal) → make-it-easier (to find a workable analog) → penultimate-step (to plan the closing) → wishful-thinking (to identify the remaining obstacle when stuck).

## The full inventory (Ch 2.2 + Ch 2.4)

### Primary quartet (Ch 2.2)

1. **Get your hands dirty.** Compute. Plug in numbers. Draw the first 5 cases. Build a table. The empirical pattern is often the [crux move](./crux-move.md) in disguise. Zeitz: *"a well-kept secret that much high-level mathematical research is the result of low-tech 'plug and chug' methods. Carl Gauss painstakingly computed the number of integer solutions to x² + y² ≤ 90,000."*

2. **Penultimate step.** Ask: *what would yield the conclusion in a single step?* Plan backward from the goal. Often the penultimate step is obvious once named — and that *is* the crux. If you need to show A = B with no obvious connection, the penultimate step might be: argue A ≥ B AND B ≥ A separately. If you need to show A ≠ B, the penultimate step might be: show A always even, B always odd.

3. **Wishful thinking.** Identify *what about this problem makes it hard*. Pretend that hard part is removed. Solve the easier problem. Sometimes the simplification leads directly back to the original via a recovery move (Example 2.1.1 in Zeitz: the box-connection puzzle that becomes trivial once boxes can be moved, then solvable by pushing them back). Sometimes the simplification clarifies what the *real* obstacle is.

4. **Make it easier.** Replace big numbers with small ones. Replace 1995 with 5. Replace n with 3. Replace infinite with finite. Solve the smaller version completely, then generalize. This is *the most reliable startup move for novices*; the cost of trying it is near zero, and the empirical traction is high.

### Secondary strategies (Ch 2.4) — fire mid-investigation, not at the start

5. **Draw a picture.** Turn algebraic statements into geometric ones. Turn time-and-distance problems into distance-time graphs. The Pólya monk problem (Ch 2.1) has a stunning one-line solution by inventing a second monk; it also has a trivial solution by drawing two overlapping distance-time curves. The latter generalizes; the former is brilliant but unrepeatable. **Draw the picture first; reach for the brilliant move only when the picture isn't enough.**

6. **Recast the problem.** Convert combinatorial questions into number-theory ones, geometric into algebraic, discrete into continuous. The locker problem (Ch 2.2.3) is combinatorial on its surface but reduces to "prove d(n) is odd iff n is a perfect square," which is number theory. The crossover-tactic chapter of Zeitz (Ch 4: Graph Theory · Complex Numbers · Generating Functions) is essentially a catalog of recasts.

7. **Change point of view.** A swimmer chasing her lost hat: solvable by setting up equations, but trivial from *the hat's point of view* (the hat thinks it isn't moving). Four bugs chasing each other on a square: solvable in fixed coordinates, but trivial in a *rotating* reference frame. Changing POV is the most "creative-looking" move in the inventory; it usually only fires after the simpler strategies have produced enough understanding to spot which alternate POV is natural.

### Recast in the wild — the lateral-thinking case (added 2026-05-24)

The [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) ingest surfaced that **Recast is the load-bearing strategy for ~40 of the 211 puzzles** — every lateral-thinking puzzle (archetype B in [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md)) is structurally a Recast problem: the puzzle is *primed* in one category (physics, arithmetic, family relations) but the answer requires reading in another category (astronomy/rotation; identity-encoding; cardinality). See [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) for the 7-trap-class taxonomy.

This volume of evidence elevates Recast from one of three *secondary* strategies (per Zeitz's own taxonomy) to a **co-primary** strategy for the brain-teaser domain — Zeitz wrote for math-contest problems where Recast is rare-but-elegant; the broader puzzle domain uses Recast as default. Glossary entry [external canon](./glossary.md#external-canon-citations) retains Zeitz's lineage, but the wiki's operational ranking shifts.

The sister meta-skill [anti-tactic-detection](./anti-tactic-detection.md) (added in the same ingest) fires *before* Recast — it's the recognition that the puzzle is asking to be recast at all.

## Position in the wiki framework stack

| Layer | Page | When it fires |
|---|---|---|
| Top-level sequencer | [problem-solving-os](./problem-solving-os.md) | Always (6-step pipeline) |
| Type-classifier | [problem-type-classifier](./problem-type-classifier.md) | Step 2 of pipeline |
| Unfamiliar-environment capture | [orient-method](./orient-method.md) | When the *territory* is unknown (live environment, codebase, new project) |
| Structured frame-building | [frame-forge](./frame-forge.md) | Search-type problems with deep structure |
| **Problem-specific unblock** | **this page** | **When territory is understood but specific problem won't start** |
| Three-level decomposition | [problem-solving-three-levels](./problem-solving-three-levels.md) | Within step 4 (Solve), to label moves S/T/X |
| Tactic-level moves | [universal-mathematical-tactics](./universal-mathematical-tactics.md) | After startup yields traction; at the tactic level |
| Argument construction | [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) | After tactic chosen; to construct the proof |

The four startup strategies are the *Cognitive-stage on-ramp* of [problem-solving-os](./problem-solving-os.md) step 4. They are intentionally cheap and undirected — their job is to *produce signal*, not to solve.

## The "Pólya's mouse" anchor — why these strategies work psychologically

Zeitz opens Ch 2 with Pólya's mouse story (the mouse who escapes the trap by trying-and-varying until it finds the one slightly wider opening). The four startup strategies are operationalizations of *try-and-vary*:

- **Hands dirty** = vary the input (concrete cases).
- **Penultimate step** = vary the direction (work backward).
- **Wishful thinking** = vary the constraints (drop one, see what changes).
- **Make it easier** = vary the scale (small version, generalize back).

The discipline is **not to give up after the first few failures**. The mouse threw itself against the bars many times; only the variation eventually found the opening. Problem solving lives at the [ANT-resistance](./ants-and-lies-of-learning.md) threshold: 2-3 failed attempts is *normal*, not a signal to quit. See [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) §"BS check at session level" for the Belief-System audit that runs against premature quitting.

## How the quartet feeds the crux

All four strategies are *crux-discovery* tools (per [crux-move](./crux-move.md) §"How it interacts with startup strategies"):

| Startup strategy | Crux-discovery mechanism |
|---|---|
| Get your hands dirty | The empirical pattern often *is* the crux conjecture |
| Penultimate step | Directly asks: "what's the crux?" (one-step-from-conclusion is the definition of penultimate) |
| Wishful thinking | The thing you wish were easier is exactly the crux |
| Make it easier | The small case exposes the structural crux in microcosm |

Once the crux surfaces, the user shifts modes — from startup (discovery) to tactic + argument construction (resolution).

## Anti-patterns

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| Skipping straight to a tool | "I'll try integration by parts" without orientation | Force step 1 of pipeline (frame); force startup strategy before tool |
| Endless hands-dirty without conjecture | Computing 50 cases but not stopping to look for the pattern | Cap hands-dirty at 5-10 cases; force a conjecture attempt at that point |
| Wishful thinking that ignores constraint | Pretending the hard part isn't there *and forgetting to come back* | The dropped constraint must be re-introduced before the solution is accepted |
| Make-it-easier that doesn't generalize | Solving n=3 with a trick that only works for n=3 | After the easy case, ask: "does my method scale?" If not, the easy case taught nothing |
| Strategy-paralysis (running all 4 in parallel) | Each strategy half-attempted, none deep | Pick one. Drive it 5-10 min. Switch only on lack of traction. |

## METER pass-floors

| Test | Pass floor |
|---|---|
| Recall all 4 startup strategies | <6 s, 100% |
| Recall all 3 secondary strategies | <8 s, 100% |
| Recall the Pólya's mouse moral | <6 s |
| Given a stuck problem, pick the most-likely-useful startup strategy | <10 s, ≥70% (judged by hindsight) |
| Apply hands-dirty: produce 5 cases of a sequence in <2 min | 5 cases, ≥1 conjecture |
| Apply penultimate step: state what would close a given proof in 1 step | <60 s |
| Cap discipline: stop hands-dirty after 10 cases without a conjecture | 90% compliance |

## Mnemonic

The Velvet Aeon Mode-Identity register: a **scholar at a dawn desk** (single warm light, otherwise empty sky). The scholar has four open scrolls weighted at the corners. **Scroll 1** is covered in inky **hand-prints** (Get your hands dirty — literally compute, the hand is dirty). **Scroll 2** has a chess-board diagram with a single move marked in red one move before checkmate (Penultimate step). **Scroll 3** shows a beautiful palace floating in the sky with all its walls erased (Wishful thinking — what would the problem look like without the hard part?). **Scroll 4** is a Russian-doll diagram: the same problem nested at sizes 1, 3, 9, 27 (Make it easier — solve the smallest, scale up). Above the scholar, a **small mouse** sits on a beam, watching — the Pólya mouse. The scholar has the **STRONG** face archetype (per [feedback-image-face-and-hair](./feedback-image-face-and-hair.md)), angular jaw set against a long night of trying-and-varying. Hair flows down to the desk.

## Memory checksum

- **4** primary startup strategies (Hands · Penultimate · Wishful · Easier)
- **3** secondary strategies (Draw a Picture · Recast · Change POV)
- **1** anchor story (Pólya's mouse, try-and-vary)
- **4** crux-discovery mappings (one per startup strategy)
- **5** anti-patterns to avoid
- **1** position rule (between ORIENT and FRAME FORGE in the framework stack)

If you can recite 4-3-1-4-5-1 from "Zeitz startup strategies" within 60 seconds, the page is encoded.

## Related pages

- [zeitz-art-and-craft](./zeitz-art-and-craft.md) — source-summary
- [problem-solving-three-levels](./problem-solving-three-levels.md) — the strategic level where these live
- [crux-move](./crux-move.md) — what the startup strategies surface
- [orient-method](./orient-method.md) — the *unfamiliar-environment* sister (different job)
- [frame-forge](./frame-forge.md) — the *structured-frame* sister (different job)
- [problem-solving-os](./problem-solving-os.md) — the sequencer; the startup quartet runs inside step 4
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — the BS check that prevents premature quitting
- [representation-rules](./representation-rules.md) — Draw a Picture / Recast operationalize these
- [universal-mathematical-tactics](./universal-mathematical-tactics.md) — what fires *after* startup yields traction
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — what fires *after* tactic chosen
- [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) — the 7-trap taxonomy that elevates Recast to co-primary status (2026-05-24)
- [anti-tactic-detection](./anti-tactic-detection.md) — meta-skill that fires *before* Recast; recognizes a Recast is needed
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — 211-puzzle corpus exercising the quartet
- [crux-recognition-gym](./crux-recognition-gym.md) — where startup-strategy recognition is drilled

---

## U — See (CAST)

1. Scholar at dawn desk with 4 scrolls (hand-prints · chess-mate · floating palace · Russian doll) and a watching mouse on a beam
2. Edges: each scroll → a crux-discovery mechanism; mouse → try-and-vary discipline

## D — Name (NEDF)

1. Startup quartet = Hands dirty · Penultimate · Wishful · Easier
2. Plus 3 secondary (Picture · Recast · POV) for mid-investigation
3. Distinguisher: cheap, undirected, signal-producing — not solving moves
4. Failure mode: running all 4 in parallel, none deep

## F — Do (SPEAR)

1. Stuck on a problem ≥ 5 min → pick one startup strategy
2. Drive it for 5-10 min until traction or clear no-go
3. Switch if no traction; do not abandon the meta-protocol
4. Once traction appears → exit startup; enter tactic-search

## B — Watch (HEART)

1. Skipping startup and reaching for a familiar tool
2. Hands-dirty without ever forming a conjecture
3. Wishful thinking without returning to the dropped constraint
4. Make-it-easier with non-generalizable tricks

## L — Predict (ORACLE)

1. Problem similar to a class seen before → predict which startup strategy worked then
2. Strategy 4 (make it easier) most likely to fire for unfamiliar problem class

## R — Act (GRACE)

1. New problem → pick one startup strategy first, before any tactic
2. Stall ≥ 10 min → switch startup strategy, don't escalate to tactic prematurely
3. Coach another → name *which* startup strategy you're suggesting
