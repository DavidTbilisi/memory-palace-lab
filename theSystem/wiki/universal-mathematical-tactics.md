---
palace: strategic-memory
level: 6
domain: 10
room: 5
wiki_source: wiki/logic/universal-mathematical-tactics.md
---

# Universal Mathematical Tactics

**Summary**: Four cross-domain mathematical tactics that work across algebra, geometry, combinatorics, number theory, and calculus: **Symmetry · Extreme Principle · Pigeonhole Principle · Invariants** (with sub-tactics: parity, modular arithmetic, coloring, monovariants). From Paul Zeitz's *The Art and Craft of Problem Solving* Ch 3. Tactic-level moves per [problem-solving-three-levels](./problem-solving-three-levels.md) — they fire after the [startup quartet](./zeitz-startup-strategies.md) has produced traction. The wiki's first load-bearing **proof-discovery methodology** layer, sister to the proof-*shape* compression in [math-proof-glyph-grammar](./math-proof-glyph-grammar.md).

**Sources**:
- Paul Zeitz, *The Art and Craft of Problem Solving*, 3rd ed. (Wiley 2017), Ch 3.1–3.4 — Symmetry, Extreme Principle, Pigeonhole Principle, Invariants (with worked examples from Hungarian / IMO / USAMO / Putnam / Russia / Korea / Bay Area / Colorado Springs Olympiads).
- [zeitz-art-and-craft](./zeitz-art-and-craft.md) — source-summary page.
- George Pólya, *How to Solve It* (1945) — the named ancestor of "look for symmetry" as a heuristic.

**Last updated**: 2026-05-24

---

## The four tactics

| # | Tactic | One-line | Trigger signal | Worked example (from Zeitz) |
|---|---|---|---|---|
| 1 | **Symmetry** | Exploit transformations that leave the object unchanged | Object/expression has rotational, reflectional, cyclic, or pairing structure | Inscribed square = ½ outer square's area (rotate 45°); Gaussian pairing 1+2+…+100 = 50·101; Wilson's Theorem via multiplicative-inverse pairs |
| 2 | **Extreme Principle** | Assume elements are in order; focus on the largest/smallest | Set is finite (or well-ordered); minimal/maximal element is "free information" | Affirmative Action problem ("maximize balanced wires"); GCD-LCM erase-and-replace; smallest triangle proof |
| 3 | **Pigeonhole Principle** | If pigeons > holes, some hole has ≥2 pigeons (extends to ⌈p/h⌉) | Statement involves "two of them share a property" or "must exist" + finite cases | Two points 1 mile apart same color; n+1 integers, two with difference divisible by n; IMO-1972 disjoint subsets with equal sum |
| 4 | **Invariants** | Find a quantity that doesn't change (or changes monotonically) under the problem's operations | Operation repeats; question asks whether some final state is reachable | Three-particle bubble chamber (population gaps ≡ const mod 3); checker problem (Conway sum); de Bruijn rectangle (parity of lattice-corner count) |

## Tactic #1 — Symmetry

**Formal definition** (Zeitz Ch 3.1): An object is **symmetric** if there are one or more non-trivial actions that leave it unchanged. The actions are its **symmetries**.

Why it pays: symmetry gives **free information**. If something is symmetric under 90° rotation, you only need to look at one quarter. Fixed points and fixed axes are always worthy of special investigation.

**Sub-types Zeitz exercises:**

- **Geometric symmetry** (rotation, reflection, translation). Stream-and-Grandma problem solved by reflecting Grandma across the stream → straight-line minimization. Four-bug problem solved by recognizing rotational symmetry → rotating reference frame.
- **Algebraic symmetry** in expressions and equations. Cyclic substitution u := x + 1/x reduces x⁴+x³+x²+x+1=0 to a quadratic.
- **Symmetric functions** (Σ_σ notation). The cyclic-sum operator captures permutation symmetries in inequalities; pairs with AM-GM.
- **Gaussian pairing** (the 10-year-old Gauss trick). Pair 1 with 100, 2 with 99, etc. The pattern generalizes to any sum with reversal symmetry; foundational for the Locker problem (d(n) odd iff n square) and Wilson's Theorem.

**Detection rule**: ask three questions. *Is symmetry present? Can it be imposed? How can it be exploited?* If the answer to (1) is no, (2) is often yes — the **strategic principle of imposing symmetry** is what unlocks the river-and-Grandma problem.

**Looking for "harmony"** — Zeitz's informal alternate definition. If you can make something more harmonious or more beautiful, you are usually on the right track.

## Tactic #2 — Extreme Principle (Monotonize!)

**Formal rule**: *If possible, assume the elements of your problem are in order. Focus on the largest and smallest elements; they may be constrained in interesting ways.*

The Affirmative Action problem (Zeitz Ch 2.1.9) is the canonical example: given a network of black-and-white balls, prove there's a coloring where each ball has ≥ as many opposite-color as same-color neighbors. **One-line solution: maximize balanced wires.** The coloring that achieves the maximum is integrated; the proof is by contradiction.

**Underlying mechanism**: the **Well-Ordering Principle** — every non-empty set of positive integers has a least element. For real-number sets, careful: infinite sets may have no extreme value (e.g., {1, 2, ½, 4, ¼, 8, ⅛, …} has neither min nor max).

**Sub-types:**

- **Maximize/minimize a derived quantity** (Affirmative Action; sum of balanced wires)
- **Smallest counterexample** for contradiction proofs (√2 irrational via smallest denominator)
- **Extreme in a sequence** (Zeitz Ch 3.2.4: GCD-LCM erase-and-replace — track smallest least element over time)
- **Geometric extreme** (smallest triangle; largest enclosed area)

**Combines with**: contradiction (assume the conclusion fails, then extreme + induction often produces a smaller counterexample); induction (the extreme element is the natural base case).

## Tactic #3 — Pigeonhole Principle

**Basic statement**: more pigeons than holes ⟹ ≥2 pigeons share a hole.

**Intermediate statement**: p pigeons, h holes ⟹ some hole has ≥ ⌈p/h⌉ pigeons.

**Three-part solution pattern** (Zeitz, after a few worked problems):

1. **Recognize the problem may need pigeonhole.** Signals: "show that some two…" or "must exist…" or a finite-cases count.
2. **Decide what the pigeons are, what the holes are.** This is the **crux move**. E.g., for "any 10 distinct 2-digit numbers have two disjoint subsets with equal sum": pigeons = subsets (2¹⁰ = 1024), holes = possible sums (10 to 945, so 936). 1024 > 936 → done (modulo a small disjointness fixup).
3. **After the conclusion fires, there's often more work.** The pigeonhole conclusion is frequently just the **penultimate step** — additional argument may be needed.

**Worked examples (Zeitz Ch 3.3):**

- 5 points in a unit square ⟹ two within √2/2 of each other (partition into 4 sub-squares).
- 41 rooks on 10×10 board ⟹ 5 mutually non-attacking (repeated pigeonhole: ⌈41/10⌉=5, then ⌈31/9⌉=4, etc.).
- IMO 1972 disjoint-subsets-with-equal-sum.
- IMO 1985: 1985 integers with no prime factor > 23 ⟹ 4 with product = 4th power (parity 9-tuple + double pigeonhole).

**Combines with**: **modular arithmetic** (pigeonholes are residue classes); **parity** (binary pigeonholes); **multiple iterations** (extract pigeon, repeat on remainder).

## Tactic #4 — Invariants

**Definition**: a quantity that *does not change* (or changes only monotonically) as the operations of the problem are applied. The most powerful single tactic in the wiki's math vocabulary — Zeitz: *"underlies many seemingly different tactics and tools."*

**Four sub-tactics:**

### 4a. Parity (binary invariant)

The simplest non-trivial invariant: each operation either preserves parity or flips it. Zeitz Ch 3.4 gives the canonical example: 127-person tennis tournament, prove an even number of players have played an odd number of games. (Sum of games = 2 × number of games played; the sum is even; can't have an odd count of odd numbers summing to an even total.)

Other landmarks: chessboard minus two opposite corners can't be tiled by 31 dominos (white-square count differs from black-square count); the 1997-vertex line-cutting problem (parity of side-of-line determines impossibility for odd n).

### 4b. Modular arithmetic (Z/m invariant)

When parity isn't enough, use mod m for cleverly chosen m. The bubble-chamber problem (Zeitz 3.4.12): X/Y/Z particles colliding pairwise; population gaps invariant mod 3 ⟹ can't reach single-type state from (10, 11, 111).

The "divisibility by 9" trick (n − digit-sum(n) ≡ 0 mod 9) is a modular invariant in service of arithmetic check-digits.

### 4c. Coloring (custom invariant beyond Z/m)

When modular arithmetic isn't expressive enough, invent a coloring whose homogeneity is the invariant. Zeitz Ch 3.4.13: a 66×62 rectangle cannot be tiled by 12×1 strips, even though 66·62 = 12·341 (color the squares with 12 colors in a diagonal cyclic pattern; show the would-be tile-count per color is inhomogeneous → contradiction).

The de Bruijn rectangle theorem (Zeitz 3.4.11): if a rectangle is tiled by smaller rectangles each of which has at least one integer side, then the big rectangle also has at least one integer side. The Gnepp solution colors lattice-point corners and counts them with parity — a coloring argument *whose invariant is the parity of the count*.

### 4d. Monovariants (semi-invariants)

A monovariant changes only in one direction. Zeitz Ch 3.4 gives the deck-reversal problem (if top card is k, reverse first k cards; prove eventually top is 1): the largest 1st-place value ever attained is a strictly-decreasing sequence over time → must hit 1.

Conway's checker problem (Zeitz 3.4.16) is the most elaborate: define a Conway sum ζ^(distance to goal) where ζ = (√5−1)/2 satisfies ζ² + ζ − 1 = 0; show the sum decreases or stays equal under any move; starting sum equals 1; therefore reaching y = 5 (sum = 1 only at that single goal point) is impossible.

**Detection rule for invariants**: ask *what stays the same as the operation runs?* If you can find a function of the state that's preserved (or monotonically changing), and the question is whether some target state is reachable, the invariant immediately answers it.

## How the four interact

The four tactics are not exclusive; they compose:

| Pair | Composition pattern | Worked example |
|---|---|---|
| Symmetry + Extreme | Symmetric problem ⟹ extreme element is often *unique* | Smallest counterexample in symmetric setup |
| Symmetry + Pigeonhole | Symmetry creates the natural pigeon/hole partition | Coloring the plane with 2 colors ⟹ vertices of an equilateral triangle pigeonhole into 2 colors |
| Extreme + Invariants | Extreme element + monovariant = "eventually halts" proof | GCD-LCM erase-and-replace; deck-reversal |
| Pigeonhole + Invariants | Pigeonhole over residue classes (modular invariant) | n+1 integers ⟹ two with difference divisible by n |
| Invariants + Extreme | Maximum value of a monovariant is reached eventually | Many of Zeitz Ch 3.4's monovariant examples |

The pairs that produce **load-bearing breakthroughs** in classical contest mathematics are: Extreme + Invariant; Pigeonhole + Modular; Symmetry + Algebraic substitution.

## Beyond mathematics

The four tactics generalize beyond math problems:

| Tactic | Non-math instance |
|---|---|
| **Symmetry** | Code-design: exploit symmetric problem structure (e.g., bidirectional graph traversal). Architecture: symmetric services (request-response symmetry) simplify reasoning. |
| **Extreme Principle** | System design: design for the worst-case user; security: assume the adversary picks the extreme input. Performance: profile the hottest 1%. |
| **Pigeonhole** | Database design: with N rows and M buckets, ~N/M rows per bucket on average; hash collisions; load-balancer fairness arguments. |
| **Invariants** | Software: class invariants, loop invariants (Hoare logic), monotonic counters (Lamport timestamps). Distributed systems: monotonic clocks, vector clocks. |

The cross-domain transfer is what makes these load-bearing for the wiki: a learner who internalizes the four tactics gains *transferable* problem-solving moves, not just math-contest tricks.

## Cross-link to wiki layers

| Tactic | Wiki layers it touches |
|---|---|
| Symmetry | [remaps](./remaps.md) §Rotate move (the REMAPS rotate is a *small case* of mathematical symmetry); [representation-rules](./representation-rules.md) (recasting via symmetry); code-glyph-grammar (silhouettes have rotational/reflectional families) |
| Extreme | [ok-plateau](./ok-plateau.md) (the *maximum sustained intensity* before regression); [meter-overview](./meter-overview.md) (extreme metric values trigger PULSE-style alerts); [problem-solving-os](./problem-solving-os.md) (extreme-bad performance ⟹ reclassify) |
| Pigeonhole | [lifecycle-manager](./lifecycle-manager.md) (more cards than active-slots ⟹ promotion/retirement); [encoded-spaced-repetition](./encoded-spaced-repetition.md) (more reviews than time-slots ⟹ scheduling conflict) |
| Invariants | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) §"Never automate before feedback" is an invariance condition; [UMTF](./universal-mental-tagging-framework.md) tags are invariants of meaning across encoders; [pulse-overview](./pulse-overview.md) is an invariance check (run the same diagnostic regardless of state) |

## METER pass-floors

| Test | Pass floor |
|---|---|
| Recall all 4 universal tactics in order | <8 s, 100% |
| Recall the 4 sub-tactics of Invariants | <8 s, 100% |
| Given a problem statement, name the dominant tactic | <8 s, ≥80% |
| Define Symmetry formally | <8 s |
| Define Extreme Principle | <6 s |
| State Pigeonhole + Intermediate Pigeonhole | <8 s |
| Distinguish invariant from monovariant | <8 s |
| Apply Symmetry: find a non-obvious symmetry in a given problem | <2 min, ≥60% |
| Apply Extreme: monotonize a given problem and state what becomes free | <60 s |
| Apply Pigeonhole: name the pigeons and holes for a given problem | <60 s |
| Apply Invariant: identify the invariant for a given operation | <90 s, ≥70% |

## Drill ladder (queued in [red-queen-skill-gym](./red-queen-skill-gym.md))

The 4-tactic drill ladder:

- **Lamp**: vocabulary recognition. Show a problem statement; pick the tactic from a 4-list. Pass floor <8 s @ ≥80%.
- **Scale**: tactic discrimination. Show two problem statements that both involve sets; one needs Pigeonhole, one needs Extreme. Distinguish which. Pass floor <15 s @ ≥75%.
- **Sword**: solve under time pressure. Given a Putnam-A1-or-easier problem, identify and apply the dominant tactic. Pass floor 50% complete-solutions on a 20-problem set.

This drill ladder is the *first proof-discovery drill ladder in the wiki*. All prior math drills ([vedic-speed-math](./vedic-speed-math.md), [trachtenberg-system](./trachtenberg-system.md), [calendar-reflex](./calendar-reflex.md), [Soroban](./soroban-learning-method.md)) train computation, not discovery.

## Anti-patterns

| Anti-pattern | Symptom | Fix |
|---|---|---|
| Forcing a tactic that doesn't fit | "I'll use pigeonhole" when there's no finite-cases structure | The trigger signals are load-bearing; if no signal fires, don't force |
| Stopping at the tactic | Naming the tactic but not constructing the argument | The tactic is the *plan*; you still need to execute with [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) |
| Missing the recursive pigeonhole | Apply pigeonhole once, miss the second iteration | Always ask "can I extract more information from the remainder?" |
| Missing the monovariant inside an apparent invariant | Treating a quantity as fixed when it monotonically changes | Compute the change explicitly under one operation; check sign |
| Symmetry only at geometric level | Missing algebraic, cyclic, pairing symmetries | The 4 sub-types of Symmetry are *all* worth checking |

## Mnemonic

A four-quarter **heraldic shield** in Velvet Aeon Mode-Cosmic register: pale-gold field, crimson devices, velvet-black border. Pale-gold light from a single high source.

- **Top-left quarter**: a perfect **mirror** with a hand pressed against its surface; reflection meets at the centerline (Symmetry).
- **Top-right quarter**: a **mountain peak** with a single climber at the summit, no other peaks visible above (Extreme).
- **Bottom-left quarter**: a wooden **cubbyhole grid** (3×4) with one cubby containing two folded letters, the rest containing one each (Pigeonhole).
- **Bottom-right quarter**: a heavy **brass dial** locked in one position with three rotational keys around it; the dial does not turn (Invariant).

The shield is held by a figure with **STRONG** face archetype (per [feedback-image-face-and-hair](./feedback-image-face-and-hair.md)) — the four tactics are *power moves*, not fragile ones. Hair flows past the waist. Long-exposure feel; the climber, the mirror, the cubbies, the dial all share the single warm light.

## Systematic enumeration — a meta-tactic, not promoted (added 2026-05-24)

The [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) ingest surfaced **systematic enumeration by size class** as a candidate 5th tactic. Examples from the corpus: #187 Square Bashing ("count all squares of all sizes" — answer 18), #197 Dots & Squares (16), #200 Dots & Triangles, #396 Triangles & Squares (12 squares + 24 triangles). The recipe is "Σ over size class k of count(k-element subobject)".

**Decision: NOT promoted to a 5th universal tactic.** Systematic enumeration is a *meta-tactic* that operates *inside* Pigeonhole + Invariants (the size-class partition is itself an Invariant; the counting-by-size is Pigeonhole-adjacent). Promoting it to peer-of-the-four would dilute the alphabet without adding discriminating power.

When it fires: archetype K (geometric counting) in [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md); treat as a *technique inside Invariants* rather than a standalone tactic. The METER `tactic_predicted` field should accept it as `invariant:systematic-enumeration` (a sub-tactic, analogous to `parity` / `modular` / `coloring` / `monovariant`).

## Memory checksum

- **4** tactics (Symmetry · Extreme · Pigeonhole · Invariant)
- **4** sub-tactics of Invariants (Parity · Modular · Coloring · Monovariant) — 2026-05-24: optionally add `systematic-enumeration` as a 5th Invariant sub-tactic for archetype K puzzles
- **3** detection questions for Symmetry (Present? Imposable? Exploitable?)
- **3** parts of the Pigeonhole solution pattern (Recognize · Decide pigeons-and-holes · After-work)
- **1** Well-Ordering Principle anchor for Extreme
- **5** load-bearing tactic-pair compositions

If you can recite 4-4-3-3-1-5 from "universal mathematical tactics" within 60 seconds, the page is encoded.

## Related pages

- [zeitz-art-and-craft](./zeitz-art-and-craft.md) — source-summary
- [problem-solving-three-levels](./problem-solving-three-levels.md) — the tactic level lives here
- [crux-move](./crux-move.md) — tactics resolve cruxes once surfaced
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — what fires *before* the tactic
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — what fires *after* the tactic
- [math-proof-glyph-grammar](./math-proof-glyph-grammar.md) — sister; proof *shape* compression vs proof *discovery* methodology
- [red-queen-skill-gym](./red-queen-skill-gym.md) — hosts the 4-tactic drill ladder
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — drilling these tactics to recognition reflex
- [vedic-speed-math](./vedic-speed-math.md) · [trachtenberg-system](./trachtenberg-system.md) · [calendar-reflex](./calendar-reflex.md) · [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) · [Soroban](./soroban-learning-method.md) — math-substrate sisters; these teach computation, this page teaches discovery
- [remaps](./remaps.md) — REMAPS Rotate is a small case of Symmetry
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — 211-puzzle corpus exercising all 4 tactics; surfaced systematic-enumeration as a candidate-not-promoted 5th
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — archetype K (geometric counting) is where systematic enumeration fires
- [crux-recognition-gym](./crux-recognition-gym.md) — sword-phase requires tactic-recognition in <60 s

---

## U — See (CAST)

1. Four-quarter heraldic shield (mirror · peak · cubbyhole · locked dial) on pale-gold field
2. Edges: Symmetry → algebraic substitution; Extreme → smallest counterexample; Pigeonhole → modular; Invariant → monovariant

## D — Name (NEDF)

1. 4 universal mathematical tactics = Symmetry · Extreme · Pigeonhole · Invariants
2. 4 sub-tactics of Invariants = Parity · Modular · Coloring · Monovariant
3. Distinguisher: tactic-level (mid-abstraction), not strategy and not tool
4. Failure mode: forcing a tactic without its trigger signal

## F — Do (SPEAR)

1. Startup yielded traction → scan the 4 tactics for fit
2. Multiple tactics fit → try the cheapest first (typically Pigeonhole, then Extreme)
3. Tactic chosen → check trigger signal is present
4. Apply → if no progress in 5 min, try the next tactic

## B — Watch (HEART)

1. Forcing a tactic without its trigger signal
2. Stopping at "I see the tactic" without constructing the argument
3. Missing recursive pigeonhole opportunities
4. Treating monovariants as invariants

## L — Predict (ORACLE)

1. Problem mentions "any two of them…" → predict Pigeonhole
2. Problem has rotational or cyclic structure → predict Symmetry
3. Problem asks "can we reach state X?" → predict Invariant
4. Problem has finite set and asks "show some element…" → predict Extreme

## R — Act (GRACE)

1. Stuck on a tactic-level move → cycle through all 4 in order
2. Built a worked solution → label which tactic powered it (METER event)
3. Teach another → ask "which of the 4 fires here?" as the first diagnostic
