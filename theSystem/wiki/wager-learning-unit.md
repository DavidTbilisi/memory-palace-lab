---
palace: strategic-memory
level: 7
domain: 10
room: 6
para: resource
wiki_source: wiki/learning-systems/wager-learning-unit.md
---

# WAGER — The Motivation-Aware Learning Unit

**Summary**: A per-topic pre-commitment card a learner fills in **before** starting a topic, so that motivation, effort risk, and an exit are all decided up front rather than discovered halfway through. Where [mastery-tree](./mastery-tree.md) answers *"what's the highest-leverage thing to learn?"* and [METER](./meter-overview.md) answers *"am I getting better?"*, WAGER answers the third, unowned question: *"why should I start **this** topic, and what happens if it goes badly?"* It is the missing **motivation** layer — leverage is not the same as desire.

**Sources**:
- Design conversation, 2026-06-16 (the learner-motivation gap: "I need to be sure I will enjoy it or it will be useful soon; I should not get stuck; I should know best/worst-case timeline")
- Expectancy–Value–Cost theory of motivation (Eccles & Wigfield) — engagement ≈ *expectancy of success × value − cost*
- [mastery-tree](./mastery-tree.md) (prerequisite graph + mastery gates), [meter-overview](./meter-overview.md) (measurement), productive-struggle (struggle is desirable; the cost is the *tail*, not the difficulty), [ok-plateau](./ok-plateau.md) (when to stop), [learning-resource-chassis](./learning-resource-chassis.md) (portfolio-level alignment)

**Last updated**: 2026-06-16

---

## Why this page exists

The `learning-systems/` library is rich on **how** to learn (encoders, drill ladders, spaced repetition, automaticity) and **what** to learn next ([mastery-tree](./mastery-tree.md)). It is silent on the decision *that comes before either*: should I engage with this topic at all, right now?

That decision is **motivation**, and the wiki had no owner for it. Worse, everything in `learning-systems/` measures during or after learning ([METER](./meter-overview.md), the automaticity ladder, [skill-progression-stages](./skill-progression-stages.md)). Motivation must be settled **before** the first rep — a different temporal slot entirely. WAGER fills that slot.

The failure mode WAGER prevents is concrete: a learner starts a high-leverage topic whose payoff is invisible and whose downside is unbounded ("could take an afternoon, could take three weeks, no exit") — and stalls, avoids it, or sinks unbounded time. Leverage attracted them; the missing motivation contract is what let them get stuck.

## The unit: five slots

Every topic gets one WAGER card, filled in **before** starting. Fail to fill a slot honestly → don't start the topic.

| Slot | Question it forces | Source of the answer |
|---|---|---|
| **W — Worth** | How much will I enjoy this *and* how soon is it useful? | The Worth rubric (below) — score both axes, clear the threshold |
| **A — Aim** | What concrete near target does this feed? | A named active project / use within the horizon, *or* an honest enjoyment-only declaration |
| **G — Gate** | What counts as "done enough" to stop? | The METER mastery gate for this node, pulled from [mastery-tree](./mastery-tree.md) |
| **E — Envelope** | Best / expected / worst time-to-useful? | Three numbers — P10 · P50 · P90 — not one fake point estimate |
| **R — Retreat** | When and how do I bail? | A wall-clock **time-box** set at the **E**nvelope's P90; on hit, execute the pre-declared escape |

**W** and **A** are the *value* terms of the wager; **E** and **R** are the *cost* terms (and its bound); **G** is the *success* term borrowed from the existing gate machinery. That is Expectancy–Value–Cost, made into a fillable card.

## Slot detail

### E — the effort envelope (best/worst case)

A single time estimate is a lie that hides variance — and variance is exactly what makes a topic feel risky. State three:

- **P10 (best case)** — everything clicks, no prereq gaps. Your honest floor.
- **P50 (expected)** — the realistic median.
- **P90 (worst case)** — prereqs are shakier than you thought, the material fights back. Your honest ceiling.

The spread between P10 and P90 *is* the risk profile. A topic with a tight envelope is safe to start on a whim; a wide one needs the Retreat slot to be airtight before you commit.

### R — Retreat (the anti-stuck mechanism)

The escape trigger is **wall-clock time** — when cumulative time on the topic hits the **E**nvelope's **P90**, the Retreat fires automatically. No "just five more minutes" — the bound was set when you were calm, not when you were frustrated. This deliberately bounds the *cost tail*; it does **not** remove difficulty. productive-struggle is still wanted *inside* the envelope — Retreat only caps the tail beyond it.

On trigger, execute one pre-declared escape (decided up front, not in the moment):

- **Park** — shelve with a note on where you stuck; revisit only if **A**im resurfaces.
- **Downgrade** — drop the depth target (e.g. recognition instead of recall); re-gate at the lower **G**.
- **Ask** — the blocker is a single missing prereq; get unblocked, then resume the same box.
- **Skip** — the **A**im was weaker than it looked; abandon and reclaim the slot.

Retreat is the operational opposite of the [ok-plateau](./ok-plateau.md): the plateau is about a skill you've *mastered* and should stop improving; Retreat is about a topic you *haven't* cracked and should stop grinding. Both are stop-rules; they fire at opposite ends.

### W — Worth (the payoff gate)

Worth is scored on **two axes**, each rated, with a **combined threshold** a topic must clear to qualify. The exact rubric — the axis scales, any weighting, and the floor — is defined in the next section.

<!-- WORTH-RUBRIC: defined below; the one knob owned by the learner -->

## Worth rubric

Score each topic on two axes, **0–3**:

- **Useful** — how soon and how strongly this feeds a real **A**im. `0` = no near use · `1` = vaguely instrumental someday · `2` = feeds an active project this quarter · `3` = needed for something I'm doing within the **E**nvelope's horizon.
- **Enjoy** — honest intrinsic pull. `0` = dread · `1` = neutral · `2` = genuinely interested · `3` = can't wait.

**Pass rule (weighted-useful):**

```
2 · Useful + Enjoy ≥ 5   →  Worth clears; the topic may be started
```

Usefulness is double-weighted; enjoyment is a tiebreaker. This biases the gate toward *useful-soon* as the stronger motivator while still letting a high-enjoyment topic qualify on its own (a `useful 1, enjoy 3` topic scores `5` and passes). Worked verdicts:

| Useful | Enjoy | `2·U + E` | Verdict | Reading |
|:---:|:---:|:---:|:---:|---|
| 3 | 1 | 7 | **pass** | high-value grind — usefulness carries it |
| 2 | 1 | 5 | **pass** | solid project work, mild interest |
| 1 | 3 | 5 | **pass** | pure delight, barely useful — still qualifies |
| 1 | 2 | 4 | **fail** | not useful enough and not fun enough — skip it |
| 0 | 3 | 3 | **fail** | candy with no Aim — fails despite max enjoyment |

The `useful 0, enjoy 3 → fail` row is the rule's spine: enjoyment alone cannot clear the bar unless it's *maximal* paired with at least minimal use. That is the deliberate anti-rabbit-hole bias — it keeps "fun but pointless" topics from eating slots that an active **A**im deserves.

## How WAGER composes with the rest of the system

- **Before** a learning session: fill a WAGER card. No card → no start.
- **A → [mastery-tree](./mastery-tree.md)**: the Aim's prerequisites and the **G**ate are read straight off the mastery tree; WAGER does not re-derive them.
- **G → [METER](./meter-overview.md)**: "done enough" is a METER threshold, so Worth's promised payoff is checkable, not vibes.
- **R → productive-struggle / [ok-plateau](./ok-plateau.md)**: Retreat bounds the cost tail without suppressing desirable struggle; it is the un-mastered counterpart to the plateau stop-rule.
- **Portfolio**: at the resource level, [learning-resource-chassis](./learning-resource-chassis.md) can require a WAGER before a candidate gets a repo — the same pre-commitment gate, one altitude up.

## Mnemonic

**Place a WAGER before you learn.** You *Worth*-it, name the *Aim*, set the *Gate*, draw the *Envelope*, and pre-load the *Retreat* — then you've sized the bet and can never lose more than the box.

## Checksum

If a learner ever sinks unbounded time into a topic, or can't say why they started it, a WAGER slot was skipped: no Retreat (unbounded cost), or no Worth/Aim (invisible payoff).

## Related pages

- [mastery-tree](./mastery-tree.md)
- [meter-overview](./meter-overview.md)
- productive-struggle
- [ok-plateau](./ok-plateau.md)
- [skill-progression-stages](./skill-progression-stages.md)
- [learning-resource-chassis](./learning-resource-chassis.md)
