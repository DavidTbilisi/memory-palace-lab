# Heuristic Palace — Problem-Solving at Speed

A **permanent mind palace** containing encoded problem-solving heuristics.  
**Not the same as domain storage palaces:** for **course facts, graphs, procedures** in space (palace vs locus, real vs imagined, benefits/limits, indexing tradeoffs), read **`mind-palace.md`**. This file is only the **Heuristic Palace** — fixed rooms for *moves*, not e.g. your cell-biology route map.

When you're stuck on *any* problem (code bug, math proof, strategy question,
design decision), you mentally walk this palace and let each locus fire a
move you can try.

**Goal:** Never be stuck staring at a blank wall. Always have the next move
queued, encoded, and retrievable in under 2 seconds.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-heuristic-palace) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## Design Principles

1. **Fixed layout.** The palace never changes — it's a permanent thinking tool.
2. **Ordered rooms.** Each room is a *stage* of problem-solving, walked in order when stuck.
3. **Each room has loci, each locus = one heuristic, each heuristic = one vivid scene.**
4. **Domain-agnostic core + domain-specific wings.** The 5 core rooms apply everywhere; wings add depth per domain.
5. **Walk in ~90 seconds.** The full core fits in under two minutes when practiced.

---

## The Palace Structure

```
CORE HOUSE (walk in order when stuck):
  Room 1 — Understand     → What am I actually looking at?
  Room 2 — Reframe        → How else could I see this?
  Room 3 — Classify       → What genus of problem is this?
  Room 4 — Plan           → What moves are available?
  Room 5 — Execute        → How do I do it cleanly?
  Room 6 — Review         → What did I learn? What's next?

EXPANSION WINGS (attached to Room 4, entered when needed):
  Debug Wing         → specific moves for code/system failures
  Proof Wing         → specific moves for mathematical proofs
  Design Wing        → specific moves for system/architecture design
  Strategy Wing      → specific moves for decisions under uncertainty
```

---

## Room 1 — Understand (The Entrance Hall)

You walk in. There are **5 loci**, each forcing a different kind of
understanding. The entry question is: **what is actually being asked?**

### 1.1 — The Mirror (Restate the problem)
**Scene:** A giant mirror on the wall that *rewrites* your question in plain words as you speak it. If the rewrite doesn't match your intent, you misread the problem.
**Move:** Restate in your own words. If you can't, you don't understand it yet.

### 1.2 — The Glass Case (What are the givens?)
**Scene:** A museum glass case holding exactly the facts you've been given. Everything *not* in the case is an assumption.
**Move:** List givens. List unknowns. List assumptions. Don't conflate them.

### 1.3 — The Scale (Hard vs. soft constraints)
**Scene:** A balance scale with "must" on one side and "nice-to-have" on the other. Most people over-constrain themselves.
**Move:** Separate hard constraints from soft preferences. Which are negotiable?

### 1.4 — The Example Bench (Concrete instance)
**Scene:** A workbench with one worked example laid out. If you can't produce one, the problem is still abstract in your head.
**Move:** Generate a specific example. If you can't, the problem isn't understood.

### 1.5 — The Goal Clock (What does "done" look like?)
**Scene:** A clock on the wall whose face shows the *finished state*, not the time.
**Move:** Define the success criterion concretely. "I'll know I'm done when ___."

### 1.6 — The Ideality Portrait (TRIZ)
**Scene:** A painting on the wall showing the *ideal final result* — the function being performed with no system, no cost, no side effects. A ghostly outline of the problem solving itself.
**Move:** What would this look like if it solved itself — no tool, no cost, no complexity? Describe the ideal, then work backward to the nearest achievable version. Often the ideal uses *resources already present in the system*.

---

## Room 2 — Reframe (The Gallery of Lenses)

**6 loci.** Each is a different way of seeing the same problem.

### 2.1 — The Inverter (Turn it upside-down)
**Scene:** A painting hanging upside-down. To understand it, you have to invert everything.
**Move:** Instead of "how do I achieve X?", ask "what would guarantee I fail at X?" then avoid those things. (Munger's inversion.)

### 2.2 — The Analogy Window (What is this like?)
**Scene:** A window showing a *different* problem that has the same shape. Different surface, same skeleton.
**Move:** What known problem does this resemble? Reduce to it. Transfer its solution.

### 2.3 — The Base Rate Jar (What's the reference class?)
**Scene:** A jar full of marbles — the reference class — with your case highlighted. Most of the marbles are *not* special.
**Move:** How do problems like this usually resolve? What's the outside view?

### 2.4 — The Zoom Lens (Change the scale)
**Scene:** A camera lens zooming from atomic to planetary. The same problem looks different at every scale.
**Move:** Zoom in (look at one component). Zoom out (look at the system). Problem often lives at a different scale than you first looked.

### 2.5 — The Backward Arrow (Work from the goal)
**Scene:** An arrow painted backward on the wall — pointing from the end to the start.
**Move:** Assume the conclusion holds. What must be true for it to hold? Work backward to premises. Often faster than forward search.

### 2.6 — The Steel Mask (Steelman the opposite)
**Scene:** A knight's helmet on a pedestal, gleaming. To remove it, you must *become* the opposite position.
**Move:** Construct the *strongest* version of the view opposite to yours. If it holds up, you've been wrong. If it doesn't, your position is now *earned*.

### 2.7 — The Time Splitter (TRIZ Separation-in-Time)
**Scene:** A clock cut in half — one side shows A, the other side shows ¬A. The same property holds differently at different times.
**Move:** If something must be A *and* ¬A, let it be A at one time and ¬A at another. (Wing large for takeoff, small for cruise; system optimized for reads by day, writes by night.)

### 2.8 — The Space Splitter (TRIZ Separation-in-Space)
**Scene:** A room divided by a wall — A on one side, ¬A on the other. Same system, different properties in different regions.
**Move:** If something must be A *and* ¬A, let it be A in one location and ¬A in another. (Thick wall at the bottom, thin at the top; CPU-optimized module here, memory-optimized there.)

### 2.9 — The Condition Switch (TRIZ Separation-on-Condition)
**Scene:** A light switch with two positions labeled A and ¬A. The property flips based on a trigger.
**Move:** If something must be A *and* ¬A, let it be A under one condition and ¬A under another. (Umbrella rigid when open, flexible when closed; cache when stable, compute when volatile.)

### 2.10 — The Russian Doll (TRIZ Separation-Between-Levels)
**Scene:** A nested set of Russian dolls — each doll has different properties from the one inside or outside it.
**Move:** If something must be A *and* ¬A, let it be A at one system level and ¬A at another. (Rigid chain link, flexible chain; pure individual functions, stateful whole system.)

---

## Room 3 — Classify (The Taxonomist's Study)

**New room.** Before planning, identify the *genus* of the problem. Most
problem-solving speed comes from recognizing structure.

**5 loci.**

### 3.1 — The Specimen Jars (Problem genus)
**Scene:** A wall of glass jars, each labeled with a problem type (search, optimization, fixed-point, composition, decision-under-uncertainty, constraint satisfaction…). You hold your problem up and see which jar it fits.
**Move:** What class of problem is this? The class determines the toolkit.

Common classes worth recognizing:
- **Search** — explore a space for a target
- **Optimization** — find the best element under a metric
- **Constraint satisfaction** — find any element meeting all constraints
- **Fixed-point** — find X where f(X) = X
- **Composition** — assemble a result from smaller pieces
- **Decomposition** — break something into parts
- **Classification** — assign an item to a category
- **Causal inference** — what caused what
- **Pattern extrapolation** — what's next given this sequence
- **Equivalence / transformation** — show two things are the same

### 3.2 — The Shape Chart (Structural features)
**Scene:** A chart on the wall showing symbols: ∞ (infinite), ↻ (recursive), ⇄ (symmetric), → (linear), ⊥ (independent), ∩ (intersecting).
**Move:** What structural features does this problem have? Symmetry? Recursion? Independence? Locality? Each feature suggests specific tools.

### 3.3 — The Dimension Dial (How many dimensions?)
**Scene:** A dial with settings 1D, 2D, 3D, ∞D. Each "click" changes what tools are available.
**Move:** How many dimensions/variables? 1D problems have monotonicity. 2D have geometry. High-dimensional has curse-of-dimensionality. Dimensionality dictates method.

### 3.4 — The Conservation Ledger (What's preserved?)
**Scene:** A ledger book in which every row is an invariant — something that doesn't change as the problem evolves.
**Move:** What quantity is conserved? Invariants are often the key to proofs and correct algorithms. If you can find one, the problem usually collapses.

### 3.5 — The Dimensional Stamp (Unit check)
**Scene:** A rubber stamp that prints units on every quantity. If the units don't match across an equation, the stamp glows red.
**Move:** Do the units / types / dimensions match? Dimensional analysis catches errors instantly in physics AND in any typed system.

---

## Room 4 — Plan (The War Room)

**7 loci.** Each is a concrete move you can try. Augmented from the original.

### 4.1 — The Toolbox (Pattern match)
**Scene:** A toolbox open on the floor, each tool labeled with a known pattern (DP, binary search, divide-and-conquer, sliding window, graph traversal, proof by contradiction, Fermi estimate…).
**Move:** Does this match a known pattern? Reach for the tool.

### 4.2 — The Drawbridge (Decompose)
**Scene:** A castle drawbridge lowering in segments. Each segment is a sub-problem.
**Move:** Break it into pieces you can solve independently. Solve each. Reassemble.

### 4.3 — The Simpler World (Relax a constraint)
**Scene:** A door labeled "Easier Problem" — same room but smaller, cleaner, or with one rule removed.
**Move:** Solve a simplified version first. Then add the constraint back. (Solve n=1, n=2, before n.)

### 4.4 — The Bridge (Find the invariant)
**Scene:** A bridge made of unchanging stones over a shifting river. The stones are the invariants.
**Move:** What doesn't change as the problem evolves? Invariants often crack the problem.

### 4.5 — The Fermi Napkin (Estimate orders of magnitude)
**Scene:** A crumpled napkin with back-of-envelope math on it. Answer within a factor of 10 before committing.
**Move:** Guess the answer's order of magnitude. If the real answer is far off, you misunderstood something.

### 4.6 — The Renaming Table (Change of variables)
**Scene:** A table where you place a problem, press a button, and it comes out with new variable names. Sometimes the renaming makes the structure obvious.
**Move:** Substitute variables, change coordinates, reparameterize. The right coordinate system makes hard problems easy.

### 4.7 — The Contradiction Room (Assume the opposite)
**Scene:** A small closet with a sign: "Assume the opposite. Walk in. If it burns down, the original was true."
**Move:** Assume the negation. Derive a contradiction. Proof by contradiction. Particularly good for impossibility results.

---

## Room 5 — Execute (The Workshop)

**5 loci.** Heuristics for *doing* cleanly.

### 5.1 — The Anvil (Smallest working version first)
**Scene:** A blacksmith forging the tiniest possible working blade before sharpening. Tiny → works → grow.
**Move:** Build the smallest version that works end-to-end before optimizing any part.

### 5.2 — The Checkpoint Flags (Test at each step)
**Scene:** A series of checkpoint flags along the workshop floor. At each flag, you verify.
**Move:** Test / sanity-check after every meaningful step. Don't wait for the end.

### 5.3 — The Rubber Duck (Explain aloud)
**Scene:** A yellow rubber duck sitting on a stool, listening.
**Move:** Explain your current plan aloud. The bug / flaw usually surfaces during explanation.

### 5.4 — The Stopwatch (Timebox)
**Scene:** A stopwatch on the wall ticking loudly. If it goes off before progress, the approach is wrong.
**Move:** Set a time limit per attempt. If exceeded, stop and return to Room 2 (reframe).

### 5.5 — The Error Log (Track what failed)
**Scene:** A clipboard by the door. Every time something breaks, you write the exact failure mode.
**Move:** Keep a live log of what's failing. Patterns emerge by the third entry.

---

## Room 6 — Review (The Library)

**5 loci.** Post-mortem and consolidation — expanded from the original 3.

### 6.1 — The Journal (What actually worked?)
**Scene:** An open journal with the solution taped in and annotated in red.
**Move:** Record what worked and *why*. This builds your personal pattern library.

### 6.2 — The Graveyard (What failed?)
**Scene:** A small graveyard of crossed-out attempts, each with a tombstone noting *why* it failed.
**Move:** Record failed approaches so you don't repeat them. Failure modes are as valuable as the solution.

### 6.3 — The Generalizer (What else does this solve?)
**Scene:** A machine that takes the solution and prints nearby problems it also solves.
**Move:** What class of problem does this solve? Look for the next problem you can apply it to.

### 6.4 — The Assumption Audit (What did I assume?)
**Scene:** A long list tacked to the wall, labeled "things I assumed without checking."
**Move:** List the assumptions your solution depends on. These are the places it could break later.

### 6.5 — The Delta Note (Next-time improvement)
**Scene:** A small card slotted into the door on the way out: "Next time I face a problem like this, I will ___."
**Move:** Write the one-line improvement for your future self. Compounds over years.

---

## EXPANSION WINGS

Each wing attaches to **Room 4 (Plan)** — when no generic toolbox tool fits,
walk into the relevant wing for domain-specific moves.

### Debug Wing (code / systems / failures)

When something is broken and you don't know why.

- **4.D1 — The Bisector** — binary-search the change set (git bisect, comment-out halves)
- **4.D2 — The Minimum Reproducer** — shrink input until the failure is trivially visible
- **4.D3 — The Assumption Check** — print every assumption explicitly; one is wrong
- **4.D4 — The State Dump** — log the entire state at the moment of failure
- **4.D5 — The Reverse Tape** — trace backward from the failure to the last known-good state
- **4.D6 — The Environment Differ** — what's different about the failing environment vs. working?
- **4.D7 — The Rubber Duck Stack Trace** — read the full trace, one frame at a time, aloud
- **4.D8 — The Reading-Before-Writing Rule** — read the code you're about to change, twice, before changing it

### Proof Wing (math / logic)

When you need to prove something.

- **4.P1 — Direct** — assume premises, derive conclusion
- **4.P2 — Contradiction** — assume negation, derive absurdity
- **4.P3 — Induction** — base case + inductive step
- **4.P4 — Construction** — build an explicit example
- **4.P5 — Pigeonhole** — more items than slots forces collision
- **4.P6 — Generating functions / bijection** — transform the problem into a different domain
- **4.P7 — Extremal principle** — consider the maximum/minimum element
- **4.P8 — Probabilistic argument** — existence via nonzero probability
- **4.P9 — Infinite descent** — if X exists, a smaller X exists — impossible in naturals
- **4.P10 — Symmetry exploitation** — if the problem is symmetric, assume WLOG

### Design Wing (architecture / systems / products)

When you're building something.

- **4.X1 — Separate concerns** — one thing per module, clear interfaces
- **4.X2 — Make illegal states unrepresentable** — push invariants into types / schemas
- **4.X3 — Prefer composition over inheritance**
- **4.X4 — Design for the common case; plan the rare case** — don't over-engineer for edge cases that never happen
- **4.X5 — Minimize mutable shared state**
- **4.X6 — Explicit > implicit** — no magic, no spooky action at a distance
- **4.X7 — Errors are data** — not exceptions hidden in control flow
- **4.X8 — Observability by default** — logs, metrics, tracing as first-class
- **4.X9 — TRIZ Contradiction Matrix** — when you have a clear "improving X worsens Y" conflict, look up the matrix cell for 2–4 historically successful principles (see `triz.md`)
- **4.X10 — TRIZ 20 Principles** — pattern library for inventive solutions across domains (segmentation, asymmetry, nesting, feedback, etc. — see `triz.md`)

### Strategy Wing (decisions under uncertainty)

When you're choosing a path with incomplete information.

- **4.S1 — Pre-mortem** — assume the decision failed; why did it fail?
- **4.S2 — Reversibility check** — is this a one-way door or a two-way door? Two-way → move faster
- **4.S3 — Identify the constraint** — systems are limited by one bottleneck; find it, focus there
- **4.S4 — Second-order effects** — and then what? And then what again?
- **4.S5 — Expected value vs. expected regret** — sometimes minimize worst-case instead of maximize average
- **4.S6 — Asymmetric payoffs** — is the downside bounded while the upside is unbounded? (Or vice versa?)
- **4.S7 — The cheap experiment** — what's the smallest test that would update your beliefs?
- **4.S8 — Kill criteria upfront** — before starting, write when you'd stop

---

## Usage in Practice

### When stuck on a problem:

1. **Room 1 (Understand)** — walk all 5 loci. Often the problem clarifies here.
2. **Room 3 (Classify)** — walk all 5 loci. Identifies the problem's genus.
3. **Room 2 (Reframe)** — if still stuck, walk all 6 loci for a view shift.
4. **Room 4 (Plan)** — pick 1–2 matching tools. If none fit, enter the relevant wing.
5. **Room 5 (Execute)** — smallest version, check each step, use the stopwatch.
6. **Room 6 (Review)** — when done, walk all 5 loci to consolidate.

### Time budget:
- Core 6-room walk (no wing): ~90 seconds when practiced
- With a wing walk: ~3 minutes
- First month: 2–3× slower until rooms are reflexive

### Build-up schedule:
- **Week 1:** Memorize Room 1 only. Walk it on every problem.
- **Week 2:** Add Room 3 (Classify). Critical room — most speed is here.
- **Week 3:** Add Room 2 (Reframe).
- **Week 4:** Add Room 4 core (toolbox + drawbridge + simpler world + bridge).
- **Week 5:** Add Rooms 5 and 6.
- **Week 6+:** Add the wings relevant to your current domain.

Don't try to memorize all ~50 loci at once. Let each room become automatic
before adding the next.

---

## Anki Cards for the Palace

### Format A — locus recall
Front: "Room 3, Locus 3.4"
Back: The Conservation Ledger — find the invariant

### Format B — heuristic retrieval from symptom
Front: "I'm grinding on the same approach and not progressing."
Back: Room 5 Locus 5.4 — the Stopwatch — timebox and return to Room 2

### Format C — inverse (symptom → locus)
Front: "I can't generate a concrete example of the problem."
Back: Room 1 Locus 1.4 — the Example Bench — problem isn't understood yet

### Format D — class → toolkit
Front: "I have a fixed-point problem."
Back: Banach iteration / Brouwer-style / constructive fixed-point tools

Format C and D are the highest-yield — they train *retrieval from symptom*
and *toolkit lookup*, which is how real fast problem-solving works.

---

## Integration with Other Systems

- **Comprehension Protocol** handles "I don't understand the problem." This palace handles "I understand but can't solve."
- **Confusion Triage** is for understanding failures. This palace is for solving failures.
- **Domain Patterns** (separate file) are the *content* that fills the expansion wings. Maintain those libraries.
- **NEDF** encodes concepts; this palace encodes *moves*. Different kinds of knowledge, different storage.

---

## Key Principles

1. **The palace is fixed.** Never change layout or scenes — that's what makes it reflexive.
2. **Classify before plan.** Room 3 is the highest-leverage addition; knowing the problem's genus collapses the search space.
3. **Walk in order when stuck.** Random access is for experts; sequential for reliability.
4. **Retrieval from symptom is the goal.** Hear a stuck-symptom → locus fires automatically.
5. **Failure modes belong in the palace.** Room 6's Graveyard is your mini-palace of your own mistakes.
6. **Wings extend, don't replace.** The core 6 rooms stay fixed; domain depth goes sideways into wings.
7. **Build domain wings as you need them.** Don't pre-build a wing for a domain you don't work in yet.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-heuristic-palace)**.

