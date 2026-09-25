---
palace: meta-knowledge
level: 6
domain: 10
room: 6
para: resource
semantic_mode: 5
glyph: 🗝
wiki_source: wiki/problem-solving/polya-how-to-solve-it.md
---

# How to Solve It (Polya)

**Summary**: Polya's 1945 book, the ancestor of every problem-solving protocol in this wiki and — until now — cited from three pages with no owner. Four phases (understand · plan · carry out · look back), one list of general questions, and a 67-entry dictionary of heuristic. This page owns the four phases and the list, states why the *generality* of the questions is the whole mechanism, and flags a naming drift between the ORIENT expansion used in the Google-prep pages and the one [orient-method](./orient-method.md) registers.

**Sources**:
- `raw/01 Core_Memory/Math/Books/polya-how-to-solve-it.pdf` — G. Polya, *How to Solve It: A New Aspect of Mathematical Method*, Princeton University Press. First published 1945; second edition 1957; expanded Princeton Science Library edition 2004 with a foreword by John H. Conway.

**Last updated**: 2026-09-21 (mnemonic expanded to sub-step level — the hand, the five R's, the four C's; Visual redrawn as a cycle); 2026-09-20

---

## Why this page exists

Polya is referenced from [understand-deeply-habit](./understand-deeply-habit.md), [universal-mathematical-tactics](./universal-mathematical-tactics.md) and [logic-among-the-atomic-design-domains](./logic-among-the-atomic-design-domains.md), and the four-phase shape recurs across the problem-solving area, but no page owned the book. Every citation was therefore a citation to nothing. This page is the owner.

## The four phases

Polya's claim is that the conception of a problem is *different at different moments of working on it*, so the questions that help are different too — and grouping them by phase is what makes a list usable rather than a heap (source: polya-how-to-solve-it.pdf).

| | Phase | The move |
|---|---|---|
| First | **Understand the problem** | See clearly what is required |
| Second | **Devise a plan** | Find the connection between the data and the unknown |
| Third | **Carry out the plan** | Check each step |
| Fourth | **Look back** | Examine the solution obtained |

Each phase earns its place by the specific failure it prevents. Polya names the worst one directly:

> the worst may happen if the student embarks upon computations or constructions without having understood the problem (source: polya-how-to-solve-it.pdf)

And the most commonly skipped one is the fourth: students who have obtained the solution and written it up neatly "shut their books and look for something else," missing the phase where the ability actually compounds (source: polya-how-to-solve-it.pdf).

## The list

The book's famous inside-cover list, in Polya's own grouping. These are the questions, not a paraphrase.

**Understanding the problem.** What is the unknown? What are the data? What is the condition? Is it possible to satisfy the condition? Is the condition sufficient to determine the unknown — or insufficient, or redundant, or contradictory? Draw a figure. Introduce suitable notation. Separate the various parts of the condition; can you write them down?

**Devising a plan.** Have you seen it before, or seen the same problem in a slightly different form? Do you know a related problem? Do you know a theorem that could be useful? Look at the unknown, and try to think of a familiar problem having the same or a similar unknown. Here is a problem related to yours and solved before — could you use it? Could you use its result? Could you use its method? Should you introduce some auxiliary element to make its use possible? Could you restate the problem? Go back to definitions. If you cannot solve the proposed problem, try to solve first some related problem — more accessible, more general, more special, or analogous. Could you solve a part of the problem? Keep only a part of the condition and drop the rest; how far is the unknown then determined? Did you use all the data? Did you use the whole condition?

**Carrying out the plan.** Check each step. Can you see clearly that the step is correct? Can you prove that it is correct?

**Looking back.** Can you check the result? Can you check the argument? Can you derive the result differently? Can you see it at a glance? Can you use the result, or the method, for some other problem?

(source: polya-how-to-solve-it.pdf)

## Generality is the mechanism, not a side effect

The single load-bearing design claim: the questions work *because* they are general and obvious, not despite it.

> All the questions and suggestions of our list are natural, simple, obvious, just plain common sense; but they state plain common sense in general terms (source: polya-how-to-solve-it.pdf)

Polya's argument is that a person seriously working on a problem already behaves this way but cannot say so, and that naming the behaviour in general terms is what makes it repeatable and teachable. Generality also buys transfer: "What is the unknown? What are the data? What is the condition?" apply whether the problem is algebraic, geometric, mathematical, non-mathematical, serious or a puzzle (source: polya-how-to-solve-it.pdf). The one real restriction is not subject matter but problem *type* — some questions serve "problems to find" and not "problems to prove."

The corollary he draws for teaching is the one that matters for self-study:

> Solving problems is a practical skill like, let us say, swimming. We acquire any practical skill by imitation and practice (source: polya-how-to-solve-it.pdf)

Which puts this book on the same side of the line as [deliberate-practice](./deliberate-practice.md) and against reading-as-preparation.

## Three entries from the dictionary worth naming

Part III is a ~67-entry *Short Dictionary of Heuristic*, alphabetical, cross-referenced. Three carry most of the operational weight.

**Inventor's paradox** — *the more ambitious plan may have more chances of success.* The more general theorem can be easier to prove than the special case it contains, because the stronger statement is more precise, more tangible, and more accessible to testing. Polya is careful about the limit: this holds only when the ambition rests "on some vision of the things beyond those immediately present" rather than on pretension (source: polya-how-to-solve-it.pdf).

**Analogy** — the move is to solve a simpler analogous problem and then use **its method, or its result, or both**. Polya works the centre of gravity of a tetrahedron by first doing the triangle, then shows the two uses are genuinely distinct: imitating the solution point by point, versus consuming the result without caring how it was reached (source: polya-how-to-solve-it.pdf). Inference by analogy yields conjectures, never certainty — "it would be foolish to regard the plausibility of such conjectures as certainty, but it would be just as foolish, or even more foolish, to disregard such plausible conjectures."

**Look at the unknown** — the Latin is *respice finem*, look at the end. Keep the goal in view, and use it as the index into memory: think of a familiar problem with the same or a similar unknown. This is the single question Polya returns to most often across Part I.

## Naming drift, flagged not fixed

The Google-prep pages (david-google-prep-protocol, david-google-prep-system) route "first-pass on a new problem" to [ORIENT](./orient-method.md) and expand its letters as data structures · constraints · invariants · edge cases · complexity bounds · recurrence. [orient-method](./orient-method.md) itself registers a different expansion — Objects, Roles, Indexes, Edges, Norms, Threads — for capture in unfamiliar live *environments*.

Those are two different protocols sharing one name. The problem-oriented expansion is much closer to Polya's first phase than to ORIENT's registered slots. **Not resolved here**, because this page does not own either term: the resolution order puts the glossary first on names and the owner page first on definitions. Recorded so the next editor of either page sees it.

## Where it lands

Routed by google-prep-source-routing to Track 1 as a capture source. The honest scope: Polya supplies the *method* for the minutes before the first line of code — the phase a timed coding interview compresses hardest and candidates skip first. Phase four, looking back, is what the re-solve queue and [spaced-repetition](./spaced-repetition.md) already operationalise.

## Mnemonic

**"Understand, plan, do, look back — and the last one is the one you will skip."** The four phases in order, with the failure mode attached to the phase that suffers it. Polya's own worst case attaches to the first: computing before understanding.

### The hand — four phases, four pegs

Four fingers, always present, no props. Each peg carries the phase, the question that actually fires in the moment, and the reason that finger fits.

| Finger | Phase | The question it fires | Why this finger |
|---|---|---|---|
| **Index** | Understand | *What is the unknown?* | You **point** at the target — *respice finem*. Fire without pointing and you get Polya's worst case: computing before understanding. |
| **Middle** | Devise a plan | *Have I seen this before?* | **Longest reach** — the plan spans from the data across to the unknown. |
| **Ring** | Carry out | *Is this step correct?* | The **committed** finger, and the least independently controllable — which is why each step needs checking deliberately rather than by feel. |
| **Little** | Look back | *Can I check the result — and reuse the method?* | Smallest, weakest, **the one you forget**. The pinky *is* the skipped rung in §Visual. |

Memorising the four nouns is nearly worthless — "devise a plan" does not fire when you are stuck. The question fires. The nouns ride along behind it.

### The sub-steps — 3-4-3 | 5 | 2 | 4

The full list in §The list is 28 items. The count per finger is the skeleton; the contents hang off it.

> **Polya groups by phase; the chunking below is an encoding layer over his list, not his own grouping.** The item text is his (source: polya-how-to-solve-it.pdf); the five R's and the four C's are this page's compression and carry no authority from the book.

**Index · Understand — 3 questions, 4 verdicts, 3 moves**

- **3 questions**: **U**nknown · **D**ata · **C**ondition — what I want, what I have, what ties them
- **4 verdicts** on the condition, read as a Goldilocks scale rather than a flat list: **insufficient** (too little) · **sufficient** (just right) · **redundant** (too much) · **contradictory** (broken)
- **3 moves**: **draw** it (figure) · **name** it (notation) · **split** it (separate the parts of the condition)

**Middle · Devise a plan — the five R's**

| R | Covers |
|---|---|
| **RECALL** | Seen it before? A related problem? A useful theorem? Look at the unknown and find a familiar problem with the same unknown. |
| **REUSE** | A neighbour was found — take its **result**, or its **method**, or add an **auxiliary element** so it fits. |
| **RESTATE** | Restate it. Go back to definitions. Solve a related problem instead: more accessible, more general, more special, analogous. |
| **RELAX** | Solve only part of it. Or keep part of the condition and drop the rest — how far is the unknown determined now? |
| **RECHECK** | Did you use all the **data**? Did you use the whole **condition**? |

**RECHECK audits exactly the D and C named on the index finger.** The list loops back on itself, which is the cheapest structural fact about it to hold. *More general* inside RESTATE is the inventor's paradox named above.

**Ring · Carry out — two bars, applied per step**

> Every step gets **seen**. Every step gets **shown**.

Three items collapse to one rule applied twice, and the separation is Polya's own: *can you see clearly that the step is correct* is a weaker bar than *can you prove that it is correct*. Most step-errors clear the first and fail the second.

**Little · Look back — the four C's**

| C | The question |
|---|---|
| **CHECK** | the result — and, separately, the argument |
| **CHANGE** | can you derive it a different way? |
| **COMPRESS** | can you see it at a glance? |
| **CARRY** | can you use the result, or the method, on another problem? |

### Why the hand is a cycle, not a row

**CARRY on the pinky stocks the memory that RECALL on the middle finger searches.** That is the compounding described in §The four phases, stated as a loop: every skipped look-back is a problem that will not be findable next time. The weakest finger feeds the longest one, which is the argument for phase four that does not depend on diligence.

## Checksum

1. **Name the four phases in order.** Understand · devise a plan · carry out · look back. Three of four is a fail; the missing one is almost always the fourth.
2. **Why does Polya insist the questions be general?** Because generality is what buys transfer and unobtrusiveness — a general question indicates a direction and leaves the work to the solver. If the answer is "so they fit on one page," the mechanism has been read as a convenience.
3. **State the inventor's paradox and its limit.** The more ambitious plan may have more chances of success — provided the ambition rests on some vision beyond what is immediately present.
4. **What are the two distinct ways to use a simpler analogous problem?** Its method, or its result. Polya separates them deliberately; collapsing them loses the second, which is the cheaper one.
5. **What does this page deliberately not resolve?** The two expansions of ORIENT. Naming is the glossary's call and definition is the owner page's.
6. **Recite the sub-step counts, per finger, in order.** 3-4-3 | 5 | 2 | 4 — understand (3 questions, 4 verdicts, 3 moves) · plan (five R's) · carry out (two bars) · look back (four C's). If only the four phase nouns come back, the skeleton is missing and the 28 items of §The list have nothing to hang on.
7. **Give the four verdicts on the condition as a scale, not a list.** Insufficient (too little) · sufficient (just right) · redundant (too much) · contradictory (broken). Recited flat, the ordering is lost — and the ordering is the part that survives time pressure.
8. **Which R audits which letters of the first phase?** RECHECK audits **D** and **C**: did you use all the data, did you use the whole condition. Held as five unrelated R's, the loop back to the index finger is gone, and that loop is the cheapest structural fact the list offers.
9. **Name the two bars every step must clear in phase three, and say which one catches the error.** See it clearly, then prove it. Most step-errors clear the first and fail the second. Collapsing them into "check your work" discards a separation Polya made deliberately.
10. **Which C feeds which R, and what follows for phase four?** CARRY feeds RECALL. Every skipped look-back is a problem that will not be findable next time — which is an argument for phase four that does not rely on diligence, only on wanting phase two to be cheap later.

## Visual

**A ladder you can fall off at any rung, but only one rung gets skipped on purpose.** The bracketed counts are the skeleton — 3·4·3 | 5 | 2 | 4 — and the return arrow is why it is a cycle rather than a row.

```
     ┌─ 1 · UNDERSTAND ─────────────────────────────────────── index ─┐
     │ [3] ask       unknown? · data? · condition?                    │
     │ [4] verdict   insufficient · sufficient · redundant ·          │
     │               contradictory                                    │
     │               too little / just right / too much / broken      │
     │ [3] do        draw it · name it · split it                     │
     │ ⚠ Polya's worst case: computing before any of this             │
     └────────────────────────────────┬───────────────────────────────┘
                                      ▼
     ┌─ 2 · DEVISE A PLAN ─────────────────────────────────── middle ─┐
  ┌─►│ RECALL     seen it? related problem? same unknown?             │
  │  │ REUSE      its METHOD or its RESULT, or both                   │
  │  │            └ auxiliary element makes it fit                    │
  │  │ RESTATE    redefine · accessible · general · special ·         │
  │  │            analogous                                           │
  │  │ RELAX      solve a part · drop part of the condition           │
  │  │ RECHECK    used all the data? the whole condition?             │
  │  │            ↑ re-reads the D and C named on rung 1              │
  │  └────────────────────────────────┬───────────────────────────────┘
  │                                   ▼
  │  ┌─ 3 · CARRY OUT ───────────────────────────────────────── ring ─┐
  │  │ [2] per step  can you SEE the step is correct —                │
  │  │               then can you PROVE it                            │
  │  └────────────────────────────────┬───────────────────────────────┘
  │                                   ▼
  │  ┌─ 4 · LOOK BACK ─────────────────────────────────────── little ─┐
  │  │ CHECK      the result — and, separately, the argument          │
  │  │ CHANGE     derive the result a different way                   │
  │  │ COMPRESS   see it at a glance                                  │
  └──┤ CARRY      use the result, or the method, elsewhere            │
     │ ✗ THE SKIPPED RUNG — where ability compounds                   │
     └────────────────────────────────────────────────────────────────┘

     3·4·3 │ 5 │ 2 │ 4   the counts, one rung each
     CARRY stocks the memory that RECALL searches next time —
     which is why this is a cycle and not a row

     generality is the engine: the questions transfer because
     they name nothing about the subject matter
```

## Related pages

- [understand-deeply-habit](./understand-deeply-habit.md) · [universal-mathematical-tactics](./universal-mathematical-tactics.md) — pages that cited Polya before this owner existed
- [orient-method](./orient-method.md) — the registered ORIENT; see the drift note above before reconciling
- google-prep-source-routing — where this book sits in the prep tracks
- [deliberate-practice](./deliberate-practice.md) — the modern statement of Polya's "imitation and practice"
- productive-struggle · [problem-solving-os](./problem-solving-os.md) — the problem-solving area this grounds
- grokking-algorithms — ingested in the same pass; its divide-and-conquer chapter is Polya's second phase applied to one family
- [spaced-repetition](./spaced-repetition.md) — what operationalises phase four across sessions
