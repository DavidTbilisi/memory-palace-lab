---
palace: meta-knowledge
level: 7
domain: 10
room: 6
para: resource
glyph: 🎞
wiki_source: wiki/problem-solving/constraint-game-board.md
---

# Constraint Game Board

**Summary**: The **representation** for a puzzle that states a scenario once and then asks several questions about it — the board you draw, the notation you write the constraints in, and the rule for when *not* to draw a board at all. [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) archetypes **L** (matching) and **S** (ordering) name this puzzle family and supply a *tactic* — assume a case, derive a contradiction — but no board to run it on. This page is that missing half. Its governing claim: on a shared-scenario set, **the board is built once and mined N times, so an error in the board costs N questions, not one** — which is exactly why the board is worth the minute it takes, and exactly why the cheapest question type is the one where you skip it.

**Sources**:
- `raw/masters-exam-2025/ლოგიკური მსჯელობა - I ვარიანტი.pdf` — NAEC 2025, items 12–17: one grouping scenario and one ordering scenario, three questions each. Every constraint form and question form below is taken from these two sets.
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — archetypes L and S; the taxonomy that names the family
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Wishful Thinking — the case-elimination tactic the board carries
- [logic-atomic-design](./logic-atomic-design.md) §Template tier — the enumeration that proved the absence: nine templates, none of them a constraint board

**Last updated**: 2026-09-23.

---

## What it is

A **constraint game** is a puzzle where one block of text fixes a situation — *seven volunteers across three sections*, *eight sessions across four days* — and a run of questions then asks what must, might, or cannot follow. The scenario is read once. The questions mine it.

Two facts about that shape decide everything on this page.

**The board is shared.** Whatever you extract from the scenario serves every question in the set. Build it well and the questions get cheaper as you go. Misread one constraint and you lose the whole set — [step-zero-analysis](./step-zero-analysis.md)'s asymmetry, in miniature: a wrong reading caught while drawing costs seconds; the same wrong reading caught three questions later has already been spent three times.

**The questions are not alike.** They differ in whether they want the board at all. Treating all of them as "solve the puzzle" is the single largest waste available in this family, and §Question tactics is where the time is actually won.

## The two layouts

There are only two boards. Which one you draw is decided by a single question: **do the positions have an order?**

**BINS — for matching and distribution.** Labelled containers, each with a capacity, and a pool of items to place. Draw the bins as columns with their capacity in the header and one underscore per seat, so an unfilled seat is visible without counting:

```
  Chveli(3)   Kala(3)   Latpari(1)
  _ _ _       _ _ _     _
```

Pool: `A B C D E F G`. The capacities are part of the board, not a note beside it — a distribution question is usually decided by capacity before it is decided by any stated rule.

**SLOTS — for ordering and scheduling.** Positions in a fixed sequence, drawn left to right, with the axis labelled. When the schedule is two-dimensional — four days × morning/evening — draw it as one line of eight slots, not a grid, because every ordering constraint you are given (*later than*, *immediately after*) is about the line, and a grid hides the line:

```
  Tue-m  Tue-e  Wed-m  Wed-e  Thu-m  Thu-e  Fri-m  Fri-e
   __     __     __     __     __     __     __     __
                 ^Nunisi (fixed)
```

Keep the grid's second dimension as a *property* of each slot (`m` / `e`), so a rule like *never in a morning session* becomes a mark on slots, not a separate diagram.

## The constraint notation

Eight forms cover every constraint in both 2025 scenarios. Write them in a column beside the board, never as prose.

| Form | Notation | From the paper |
|---|---|---|
| Fixed placement | `A@Chveli` · `Nunisi@Wed-m` | "A will work on the Chveli section" |
| Same container | `C=G` | "C and G will work on the same section" |
| Different containers | `A≠B` | "A and B will work on different sections" |
| Relative order | `Borjomi < Tsqaltubo` | "Tsqaltubo presents later than Borjomi" |
| Adjacency / block | `[Abastumani·Borjomi]` | "Borjomi presents in the session immediately after Abastumani" |
| Slot-type exclusion | `Grigoleti ∉ m` · `Tbilisi ∉ m` | "neither Grigoleti nor Tbilisi presents in a morning session" |
| Conditional | `F@Kala → E@Chveli` | "if F works on Kala, then E works on Chveli" |
| Capacity | written into the board header | "three each on two of them, one on the third" |

**Every conditional is written twice.** Beneath `F@Kala → E@Chveli` write its contrapositive `¬E@Chveli → ¬F@Kala`. This is not decoration: questions in this family are overwhelmingly triggered from the *negative* side — you will be told where E is *not*, and the contrapositive is the only form that fires on that. A conditional recorded once is a conditional you will fail to use. The equivalence is [methods-of-deduction](./methods-of-deduction.md) **Trans**; the trap on either side of it is [fallacy-taxonomy](./fallacy-taxonomy.md)'s pair of formal fallacies, since concluding `F@Kala` from `E@Chveli` is affirming the consequent.

## Inference before questions

After writing the constraints and before reading any question, spend thirty seconds pushing them together. Anything that falls out is now free for every question in the set.

On the 2025 grouping scenario the deductions available before question 12 are worth having: `A@Chveli` is given, so `A≠B` puts **B in Kala or Latpari**; `C=G` needs a container holding at least two, so **C and G are not in Latpari** — Latpari seats one. Two constraints, two placements narrowed, no question read yet.

Stop when the deductions stop coming. Exhaustive solving is not the goal and is usually impossible — a well-built scenario is deliberately underdetermined, which is *why* it can support three different questions.

## Question tactics

Three question forms appear, and they want three different amounts of work. Recognising which one you are holding is worth more than any solving skill on this page.

**"Which could be an acceptable arrangement?"** — the five options are each a complete assignment. **Do not use the board.** Take one constraint, sweep all five options, strike the ones that violate it; take the next constraint, sweep the survivors. Each constraint typically kills exactly one option, and the last one standing is the answer. This runs in about sixty seconds and needs no deduction whatsoever. It is the cheapest item in the whole logic section, and building a board for it is the classic way to lose four minutes on a question designed to take one.

**"If X, then which must be false?"** (or *must be true*, or *could be true*) — a local hypothetical. **Copy** the relevant strip of the master board, add X, propagate, read the answer off. The copy matters: the assumption holds for this question only, and the most expensive error in the family is carrying a hypothetical's deductions into the next question as though they were given.

**"Which would be sufficient to determine the full arrangement?"** — the options are candidate extra facts. Test each by adding it and asking whether the board is now forced. This is the slowest form; take it last, and use the deductions you already made — an option that does not interact with an existing constraint almost never forces anything.

## Failure modes

1. **Drawing a board for a sweep item.** The "which could be acceptable" question is answered *against the options*, never against a board. This is the failure that costs the most seconds per occurrence.
2. **Recording a conditional in one direction.** The question fires from the negative side and the rule does not trigger, so the item looks underdetermined when it is not. Write the contrapositive every time.
3. **Writing on the master board during a hypothetical.** The assumption leaks forward and poisons the remaining questions in the set. Copy, then assume.
4. **Trying to solve the scenario completely.** It is built to be underdetermined. Chasing a unique arrangement burns the set's whole budget before the first answer.
5. **Drawing a two-dimensional schedule as a grid.** Ordering constraints are statements about a line; a day × time grid makes *immediately after* and *later than* invisible at exactly the moment you need them.
6. **Reading the questions before the constraints.** The reverse of the reading section's economics — here the scenario is shared and the questions are not, so the scenario is what repays a careful first pass.

## METER

| Event | Measures | Pass floor |
|---|---|---|
| `cgb.board_build` | seconds from finishing the scenario text to a board with all constraints written and the contrapositives filled | **≤ 90 s**, zero transcription errors |
| `cgb.sweep_item` | seconds on a "which could be acceptable" item, answered by option-sweep without a board | **≤ 75 s**, ≥90% correct |
| `cgb.set_yield` | correct answers per three-question scenario set, under the section clock | **≥ 2 of 3**, and 3 of 3 on any set whose board was built error-free |

`cgb.set_yield` is the one that matters, and it is deliberately set per *set* rather than per item. The claim this page rests on is that errors in this family are correlated — a bad board loses three — so an item-level accuracy figure would average away the exact structure the page exists to protect. A run of 2-of-3 scores with a *different* item wrong each time is healthy; a single 0-of-3 is the failure this page is trying to prevent, and it must not be allowed to hide inside a 67% average.

The floors are first-draft and uncalibrated: no timed sitting has been run. Under [meter-overview](./meter-overview.md)'s own convention they stay provisional until there are enough readings to calibrate, and the 90-second build floor in particular is a guess at what a clean board costs.

## Related pages

- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — archetypes **L** (matching) and **S** (ordering); this page is the representation both of them route to
- common-masters-exam — the exam whose items 12–17 are this family, at 4:07 per question
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — §Wishful Thinking, the case-elimination tactic the board carries
- [methods-of-deduction](./methods-of-deduction.md) — **Trans**, the equivalence behind writing every conditional twice
- [fallacy-taxonomy](./fallacy-taxonomy.md) — affirming the consequent and denying the antecedent, the two ways a conditional gets misfired
- [step-zero-analysis](./step-zero-analysis.md) — the asymmetry argument: a misreading is cheap while drawing and expensive afterwards
- [crux-recognition-gym](./crux-recognition-gym.md) — where archetype classification is drilled against the clock
- [red-herring-resistance](./red-herring-resistance.md) — the sibling skill for items 1–11; constraint scenarios carry almost no decorative material, so it is spent elsewhere
- [logic-atomic-design](./logic-atomic-design.md) — the template tier this board joins
- [meter-overview](./meter-overview.md) — the measurement layer the provisional floors belong to

---

## Mnemonic

**🎞 One filmstrip, many frames.**

The scenario is a strip of film: you develop it once, then hold it up to the light three times and read a different frame each time. Nobody re-develops the film for each look — and nobody scribbles on the negative to answer a question about one frame.

*Develop once. Copy before you write. And when the answer is already printed on the five options, don't develop at all.*

## Checksum

1. The page says a shared-scenario board is worth building *and* that the cheapest question type skips it entirely. Reconcile those without appealing to either rule as an exception.
2. Why is every conditional written twice, and which question form makes the single-direction version fail silently?
3. `cgb.set_yield` is measured per set rather than per item. Name the property of this puzzle family that makes an item-level accuracy figure misleading.
4. A schedule is four days × morning/evening. Give the reason for drawing eight slots in a line rather than a 4×2 grid, in terms of a specific constraint form.
5. What makes the scenario deliberately underdetermined, and what does a solver lose by not noticing?

## Visual

```diagram
  WHICH BOARD — one question decides it (axis)

    do the positions have an order?
         no │ yes
            │
     BINS ──┴── SLOTS
   capacity      a line, left to right
   per column    grid dimensions become slot properties


  THE SET — build once, mine three times

                  ┌──────────────┐
    scenario ───► │  THE BOARD   │ ───► Q1  sweep the options (no board!)
    read once     │ + constraints│ ───► Q2  copy · assume · propagate
                  │ + contrapos. │ ───► Q3  test each for forced completion
                  └──────────────┘
                         ▲
              one error here costs THREE answers


  CONSTRAINT FORMS — eight cover both 2025 scenarios

    A@Chveli        fixed        Borjomi < Tsqaltubo   relative order
    C=G             same         [Abastumani·Borjomi]  adjacency block
    A≠B             different    Grigoleti ∉ m         slot-type exclusion
    F@Kala → E@Chveli            capacity in the header
      ¬E@Chveli → ¬F@Kala   ← never omit this line
```

---

The six faces — [CAST](./cast-overview.md) · [NEDF](./nedf-overview.md) · [SPEAR](./spear-overview.md) · [HEART](./heart-overview.md) · [ORACLE](./oracle-overview.md) · [GRACE](./grace-overview.md) — for this page:

## U — See (CAST)

1. Scenario → board → three questions: one node feeding three, which is why the in-edge is the expensive one
2. Two layouts at a fork; eight constraint forms hanging off whichever board was chosen

## D — Name (NEDF)

1. Constraint game board = the drawn representation of a once-stated scenario that several questions then mine
2. Distinguisher: vs a logic *grid*, which is archetype N's pre-printed puzzle surface — this board is one **you** draw, and its shape is chosen, not given
3. Failure mode: building it for the question type that is answered faster against the options

## F — Do (SPEAR)

1. Read the scenario → pick BINS or SLOTS → write constraints in notation → fill every contrapositive
2. Thirty seconds of free deduction → then read question 1
3. Classify each question into sweep · hypothetical · sufficiency before answering it

## B — Watch (HEART)

1. A board being drawn for a "which could be acceptable" item
2. Ink on the master board during a hypothetical
3. The solver chasing a unique arrangement in a scenario built not to have one

## L — Predict (ORACLE)

1. Board built error-free → predict 3 of 3 on the set; board with one bad constraint → predict 0 or 1, not 2
2. Conditionals written one-way → predict the failure lands on the question that fires from the negative side

## R — Act (GRACE)

1. New shared-scenario block encountered → board first, questions second, always
2. Hypothetical question → copy the strip before writing a single mark
