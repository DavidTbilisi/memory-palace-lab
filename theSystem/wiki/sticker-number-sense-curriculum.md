---
palace: strategic-memory
level: 3
domain: 10
room: 20
semantic_mode: 5
wiki_source: wiki/learning-systems/sticker-number-sense-curriculum.md
---

# Sticker — Number Sense via Graded Drill

**Summary**: Henry Sticker's *How to Calculate Quickly* (1945, Dover ed. 1955) is the third mental-arithmetic substrate beyond [vedic-speed-math](./vedic-speed-math.md) and [trachtenberg-system](./trachtenberg-system.md) — but unlike them it is **method-free**. Sticker rejects per-operation rules and instead builds *number sense* by ~15,000 graded exercises designed to compound a single skill at a time. The curriculum walks a small ladder: **pairs summing to 10** → **trios summing to 10** → **adding 11–18 to any 1–99 number** → **two-column simultaneous addition**, then mirror-image ladders for subtraction, multiplication, and division. The book's premise: skill is acquired by recognising patterns within whole-number relationships, not by applying memorised algorithms. This makes Sticker the canonical **substrate-builder** for the other two systems — graded automaticity of pair-sums and trio-sums is exactly what makes Trachtenberg's 11-rule and Vedic's cross-add reflexive in practice.

**Sources**:
- Sticker, H. (1945). *How to Calculate Quickly: The Art of Calculation*. Essential Books / Dover Publications. PDF at `raw/01 Core_Memory/Math/Books/sticker-how-to-calculate-quickly.pdf`.

**Last updated**: 2026-05-22

![Sticker number-sense curriculum ladder](diagrams/math/sticker-curriculum-ladder.png)

---

## The thesis

> Arithmetic is a science, but calculation is an art. Science is knowledge — art is skill.
> — Sticker, Preface

The book's distinguishing claim: calculation speed comes from **number sense**, defined as "the ability to recognise the relations that exist between numbers considered as whole quantities". This is opposed to two other paradigms:

| Paradigm | Source | Approach |
|---|---|---|
| **Rule-based** | [trachtenberg-system](./trachtenberg-system.md) | Memorise a specific rule per multiplier (×3, ×4, …); operate digit-by-digit |
| **Identity-based** | [vedic-speed-math](./vedic-speed-math.md) | Apply algebraic identities (cross-add, complement) anchored to base-10 powers |
| **Drill-based** | Sticker | Build pattern recognition through massive graded exposure; no formulas |

Sticker's analogy: how an accountant or storekeeper instantly answers "twelve at $11.625" with `$139.50` (using 11×12=132 plus 5/8 of 12) — without applying any formula. They *see* the structure. The book engineers that "seeing" by drilling at a single increment of difficulty at a time.

---

## The curriculum's structural shape

### Addition track

```
   Level 1:  Pairs of digits summing to 10 (e.g. 7+3, 6+4, 5+5)
   Level 2:  Pairs of digits summing to less than 10
   Level 3:  Trios summing to 10 or less
   Level 4:  Mentally adding any 11-18 to any 1-99 (single move)
   Level 5:  Mentally adding any 19-27 to any 1-99 (compound trio-step)
   Level 6:  Two-column simultaneous addition (any 2-digit + 2-digit)
   Level 7:  Three-column simultaneous (demonstration; few exercises)
```

The progression is engineered so each level requires only one new skill on top of the previous. By level 6, a 12-row column of 2-digit numbers can be added top-to-bottom in one pass.

### Subtraction track

- Subtraction in general
- **Left-to-right subtraction** (Sticker's signature shift — conventional right-to-left is replaced)

### Multiplication track

```
   Multiplying by single digits → factoring large multipliers
   Three-figure × one-figure → mental
   Two-figure × two-figure
   Three-figure × two-figure
   Three-figure × three-figure (Exercise 371: 696 × 858 mental)
```

### Division track

```
   Direct division by numbers >12 (no long-division layout)
   Mental division of large numbers
   Division by 3-figure divisors → 2-figure divisors
```

### Short cuts

The final section is a catalog of named tricks (multiplying by 11, by 21/31/41…, squaring numbers, multiplying when "corresponding orders are alike", aliquot parts in division). These are introduced *after* number sense is built, on the principle that a shortcut without sense is brittle.

---

## What makes this a substrate (not a method)

Sticker's drills don't teach you how to multiply `463 × 27` directly. They teach you the *sub-skills* that compose into a fluent multiplication:
- Instant pair-sums (so the carry chain in any method runs at reflex speed)
- Instant trio-sums (so the Criss-Cross middle-column in [vedic-speed-math](./vedic-speed-math.md) doesn't bottleneck)
- 11-to-18 addition to any 1-99 (so Trachtenberg's "never count higher than 11" cap is immediate)

This is why Sticker pairs well with the other two systems: he builds the substrate; they provide the algorithm.

### The "substrate × algorithm" composition

Per [substrate-algorithm-composition](./substrate-algorithm-composition.md):
- Substrate: graded number-sense drills (Sticker)
- Algorithm: structural rules (Trachtenberg) or algebraic identity (Vedic) or polynomial cross-multiply (Criss-Cross)

The cleanest mental-arithmetic stack uses **Sticker for the substrate, Vedic for near-base cases, Trachtenberg for arbitrary cases, Soroban for streaming sums** — see [trachtenberg-system](./trachtenberg-system.md) §"How this complements" for the comparative reasoning.

---

## Engineering of the exercise design

A few design choices worth noting (Sticker, "The Plan of This Book"):

1. **No section walls.** "Several branches proceed simultaneously". You do addition exercises while also doing multiplication exercises. Progress is measured by difficulty, not subject. The book interleaves them deliberately.
2. **One table, many exercises.** A single list of numbers (e.g. Table I, p. 7) is used for additions, subtractions, and multiplications. Reusing the table across operations means you build pattern memory for those *specific* digit-combinations, accelerating future encounters.
3. **Alternating direction.** Addition exercises alternate top-down and bottom-up. Building bidirectional facility prevents motion-direction lock-in.
4. **Hidden answers.** Answers are at the back (pp. 154 onwards). You're expected to write your answers on a strip of paper folded under as you go, so you cannot see "the next problem" while computing the current.
5. **No worked examples.** Sticker introduces a technique briefly (1-2 paragraphs) then drops the reader into the exercises immediately. This forces pattern extraction rather than recipe-following.

---

## Worked example — Sticker's flagship Exercise 371

> Multiplying Three Figures by Three (mental):
> Exercise 371, p. 191: 696 × 858, 858 × 878, 696 × 878, …

The student is expected to do this **mentally**, without writing anything except the final answer. This is the highest difficulty level in the book.

How is it possible? By this point, the student has internalised:
- Three-digit × three-digit Criss-Cross pattern (5 partial sums)
- Each pair-product is instant
- Each trio-sum (the middle column) is instant
- Carry propagation is instant

There is no special trick for `696 × 858`. The pattern is the same as `12 × 34` — only with more partial sums. The drill has compressed each sub-step to a millisecond, leaving working memory free for the bookkeeping.

For comparison: Bathia's book (see [vedic-speed-math](./vedic-speed-math.md)) achieves the same result via the Criss-Cross algorithm without the underlying drill discipline. The two approaches converge on the same physical action; they differ in *which substrate is doing the work*.

---

## When Sticker is the right choice

- **Foundation building.** Before adopting Vedic or Trachtenberg, run the Sticker drills to bring the substrate to automaticity.
- **Mental arithmetic without algebraic comfort.** Sticker doesn't require the user to manipulate algebraic identities. Number-sense is purely empirical.
- **Working in a calculation context where shortcuts are unavailable.** Long columns of mixed numbers, pen-and-paper accounting, mental ledger work — Sticker's drills cover these directly.

## When Sticker is *not* the right choice

- **Near-base arithmetic.** Vedic's Base Method is faster than any drill-based approach for `89 × 92` type problems.
- **Closed-form patterns.** Squaring numbers ending in 5, multiplying by 11 — these have one-step rules in Vedic/Handley/Trachtenberg that the Sticker drill doesn't beat.

---

## How this overlaps with [handley-speed-mathematics](./handley-speed-mathematics.md)

Bill Handley's *Speed Mathematics* (2003) is a synthesis of Trachtenberg's rule-based methods, Vedic's near-base methods (rebranded as "Reference Numbers"), and a Sticker-like emphasis on building reflex. Handley credits Trachtenberg directly. Of the four books in this corpus, **Sticker is the only one that does not borrow from Vedic or Trachtenberg** — it's the independent drill-paradigm anchor.

---

## Related pages

- [vedic-speed-math](./vedic-speed-math.md) — algebraic-identity method system
- [trachtenberg-system](./trachtenberg-system.md) — rule-based method system
- [handley-speed-mathematics](./handley-speed-mathematics.md) — Western synthesis combining all three approaches
- [substrate-algorithm-composition](./substrate-algorithm-composition.md) — the architectural primitive Sticker exemplifies (substrate-only)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — Sticker is a worked instance of automaticity engineering
- [symbolic-fluency-drill-ladder](./symbolic-fluency-drill-ladder.md) — wiki's structural drill ladder; Sticker's curriculum is one instance
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) — Sticker's no-visual-substrate-required approach pairs naturally with aphantasic users
- [singapore-math](./singapore-math.md) — independent convergence: Singapore's *number bonds* are Sticker's pair-sums/trio-sums rungs, reached forty years later by curriculum sequencing rather than graded drill

---

## U — See (CAST)
1. Graded exercise ladder: pair-sums → trio-sums → big-number addition
2. Number sense as pattern recognition, not formula application

## D — Name (NEDF)
1. Sticker = drill-based number-sense substrate
2. Distinguisher: no per-operation algorithm; only graded exposure
3. Failure mode: skipping low-level drills, expecting algorithmic shortcut to substitute

## F — Do (SPEAR)
1. Pair-sums to reflex → trio-sums → bigger
2. Run ~15,000 exercises by difficulty progression

## B — Watch (HEART)
1. Treating Sticker as just a "tricks book" (it isn't)
2. Building algorithm fluency before substrate

## L — Predict (ORACLE)
1. Substrate gap → predict Vedic/Trachtenberg execution slowdown
2. Drill-only stack → predict no near-base shortcut

## R — Act (GRACE)
1. Building mental-arithmetic stack → Sticker as first layer
2. Stuck on speed despite knowing method → drill substrate
