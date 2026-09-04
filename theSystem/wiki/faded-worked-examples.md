---
palace: meta-knowledge
level: 8
domain: 10
room: 53
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/faded-worked-examples.md
---

# Faded Worked Examples

**Summary**: A **faded worked example** is a solution that is handed to the learner complete, then re-handed with its *last* step blanked, then its last two, and so on until nothing is supplied and the learner solves from the problem statement alone. It is the solution-axis counterpart to [concreteness fading](./singapore-math.md) — same [expertise-reversal effect](./problem-solving-maturity-levels.md) mechanism, different object withdrawn — and it is the evidenced technique for procedural domains such as algorithms, proof, and programming, where the thing to withdraw is not a picture but *how much of the answer is given*. Three findings make it operational rather than obvious: fading **backward** (blank the last steps first) beats fading forward; fading **alone** reliably buys near transfer but *not* far transfer, and only recovers far transfer when each retained step carries a prompt to name the principle it instantiates; and fading paced **adaptively** on the learner's own performance beats any fixed schedule. This page owns "faded worked examples", "backward fading", "completion problem", and the **step budget** notation in this wiki.

**Sources**:
- Renkl, A., Atkinson, R. K., Maier, U. H., & Staley, R. (2002). "From Example Study to Problem Solving: Smooth Transitions Help Learning." *Journal of Experimental Education*, 70(4), 293–315 — establishes backward > forward fading; effects reliable on near transfer, not far ([UNC summary](https://cdr.lib.unc.edu/downloads/np193b25t))
- Atkinson, R. K., Renkl, A., & Merrill, M. M. (2003). "Transitioning From Studying Examples to Solving Problems: Effects of Self-Explanation Prompts and Fading Worked-Out Steps." *Journal of Educational Psychology*, 95(4), 774–783. [doi:10.1037/0022-0663.95.4.774](https://doi.org/10.1037/0022-0663.95.4.774) ([ERIC EJ678596](https://eric.ed.gov/?id=EJ678596) · [full text](https://mrbartonmaths.com/resourcesnew/8.%20Research/Making%20the%20most%20of%20examples/Fading%20out%20and%20Prompts.pdf))
- Renkl, A., Atkinson, R. K., & Große, C. S. "How Fading Worked Solution Steps Works — A Cognitive Load Perspective." *Instructional Science*. ([Springer](https://link.springer.com/article/10.1023/B:TRUC.0000021815.74806.f6))
- Salden, R. J. C. M., Aleven, V., Schwonke, R., & Renkl, A. (2010). "The Expertise Reversal Effect and Worked Examples in Tutored Problem Solving." *Instructional Science*, 38(3), 289–307. [doi:10.1007/s11251-009-9107-8](https://doi.org/10.1007/s11251-009-9107-8) ([PDF](http://www.cee.uma.pt/ron/Salden%20et%20al.%20-%20The%20Expertise%20Reversal%20Effect%20and%20Worked%20Examples.pdf))
- Van Merriënboer, J. J. G. (1990). "Strategies for Programming Instruction in High School: Program Completion vs. Program Generation." *Journal of Educational Computing Research*, 6(3), 265–285. [doi:10.2190/4NK5-17L7-TWQV-1EHL](https://doi.org/10.2190/4NK5-17L7-TWQV-1EHL) ([ERIC EJ417022](https://eric.ed.gov/?id=EJ417022)) — the completion strategy, tested directly on programming
- Koedinger, K. R., & Aleven, V. (2007). "Exploring the Assistance Dilemma in Experiments with Cognitive Tutors." *Educational Psychology Review*, 19(3), 239–264. ([Springer](https://link.springer.com/article/10.1007/s10648-007-9049-0) · [ERIC EJ785065](https://eric.ed.gov/?id=EJ785065)) — names the general tension this page sits inside
- Kapur, M. (2008). "Productive Failure." *Cognition and Instruction*, 26(3), 379–424. [doi:10.1080/07370000802212669](https://doi.org/10.1080/07370000802212669) ([PDF](https://arch.kuleuven.be/studeren/tall/artikels/productive-failure-kapur.pdf/@@download/file/Productive%20Failure%20Kapur.pdf)) — the counter-current, read carefully in §The tension with productive struggle
- Sweller, J., & Cooper, G. A. (1985) — the worked-example effect this technique extends; already registered as external canon in [glossary](./glossary.md) §External canon citations
- Conversation with David, 2026-08-13 — *"can I learn other things using same method? for example algorithms?"* The answer is §Applying it to algorithms; this page is the piece [singapore-math](./singapore-math.md) did not supply.

**Last updated**: 2026-08-13

---

## The technique

Take a problem type with a stable solution procedure — solving a probability word problem, writing a proof by induction, implementing a sliding-window scan. Write out one complete solution, step by step. Then present a sequence of problems of the same type in which the amount supplied shrinks:

```
problem 1   [step 1] [step 2] [step 3] [step 4]        k = 0 blanked  ← study only
problem 2   [step 1] [step 2] [step 3] [  ??  ]        k = 1
problem 3   [step 1] [step 2] [  ??  ] [  ??  ]        k = 2
problem 4   [step 1] [  ??  ] [  ??  ] [  ??  ]        k = 3
problem 5   [  ??  ] [  ??  ] [  ??  ] [  ??  ]        k = full  ← unaided solve

            └─ still supplied ─┘└──── you write ────┘
                each carries a prompt:
                "which principle does this step instantiate?"
```

The intermediate rows — part supplied, part blank — are **completion problems**. The learner is never asked to leap from reading solutions to producing them; the leap is cut into as many small steps as the procedure has.

The *step budget* `k` is the notation this page uses for how many trailing steps are blanked. It is a per-problem-type count, not a fixed ladder: a four-step procedure has five rungs, a nine-step procedure has ten. This is deliberately **not** a stage numbering in the sense [skill-progression-stages](./skill-progression-stages.md) owns, and it should never be cited as one.

## Backward, not forward

Two fade directions are possible. **Backward fading** blanks the *last* solution step first, then the last two. **Forward fading** blanks the *first* step first, then the first two. They are not equivalent — Renkl et al. found it more advantageous to omit the last solution steps first (source: Renkl, Atkinson, Maier & Staley 2002).

The wiki's reading of why (this mechanism is an interpretation, not a claim from the source): the final step is the one whose goal is most tightly pinned by everything above it. When you complete the tail, the entire chain is sitting in front of you and the blank has exactly one plausible filler — the smallest possible increment of independence. Forward fading blanks the step with the *least* context available, which is the hardest step to reconstruct and the one whose failure poisons everything after it. Backward fading orders the withdrawals from cheapest to dearest; forward fading orders them from dearest to cheapest.

## Fading alone buys near transfer only

This is the finding that makes the technique easy to get wrong, and it is the reason this page exists rather than a one-line note.

Fading, on its own, produced reliable effects on **near**-transfer items and **not** on far-transfer items (source: Renkl et al. 2002). A learner who is faded through a problem type gets faster and more accurate at *that* problem type and does not necessarily get better at anything adjacent. That is procedure-copying with the training wheels removed — real, useful, and not what anyone actually wants from it.

The fix is a **self-explanation prompt** attached to each retained step: the learner must name the underlying principle that step instantiates. Atkinson, Renkl & Merrill combined fading with such prompts and found medium-to-large effects on **both** near and far transfer across two experiments, *without additional time on task* (source: Atkinson, Renkl & Merrill 2003). They describe the procedure as highly recommendable on exactly those grounds — cheap to implement, no extra time, and it fixes the transfer hole.

**Operational rule for this wiki: a fade set without per-step principle prompts is not implemented, it is half-implemented.** The prompt is the load-bearing half. Naming the principle is what turns a supplied step from something read into something classified, and classification is the thing that travels to a new surface.

## Fade on performance, not on a calendar

The obvious way to run a fade set is to fix the schedule in advance — problem 2 gets `k=1`, problem 3 gets `k=2`. Salden et al. tested exactly that against a version in which the fade was paced by each student's demonstrated understanding, in one lab and one classroom experiment. Both experiments found **adaptive fading beat fixed fading, and fixed fading beat straight tutored problem solving** (source: Salden, Aleven, Schwonke & Renkl 2010).

This is the finding that makes fading a natural fit for this wiki specifically rather than a technique borrowed from a classroom. Adaptive fading needs a per-attempt performance record to pace against, which is what a solo learner normally lacks and what [METER](./meter-overview.md) already is. The pacing rule lives in §METER below.

## Three fading axes, kept apart

The wiki now withdraws support along three different axes. They are orthogonal — a learner can be mid-fade on all three at once — and each has exactly one owner. Confusing them is the predictable failure mode, so:

| Axis | What gets withdrawn | Notation | Owner |
|---|---|---|---|
| **Representation** | the picture you look at | declared exit state | [representation-rules](./representation-rules.md) Rule 9 |
| **Substrate** | where intermediate state is held | R1 → R4 | [soroban-learning-method](./soroban-learning-method.md) §Stage 6 Scaffold Fade |
| **Solution** | how much of the answer is supplied | step budget `k` → full | **this page** |

Two guardrails follow. This page deliberately does **not** reuse the `R1–R4` notation — those rungs answer *where the state lives* and belong to Scaffold Fade; `k` answers *how much of the answer is given*, and the two can hold different values simultaneously. And the mechanism underneath all three is the same single registered effect, the [expertise-reversal effect](./problem-solving-maturity-levels.md): support that helps a novice actively harms an expert, so every kind of support needs an exit. Three axes, one reason.

A faded worked example is the solution-axis analogue of a **Type B scaffold visual** — a medium you reason inside and are meant to outgrow — and it is arguably the cleanest instance of the type anywhere in the wiki, because its exit is *quantified* (`k` reaching full) rather than merely declared. [representation-rules](./representation-rules.md) Rule 9 governs visuals and this page governs solutions; neither extends over the other.

## The tension with productive struggle

productive-struggle states flatly that "mimicking a worked example is not struggle, because the answer is already on the page," and it is right. Kapur's productive-failure experiments push harder in the same direction: students who worked ill-structured problems *without* support structures produced poor solutions and then **outperformed** the well-structured group afterwards (source: Kapur 2008). Koedinger & Aleven gave the general problem its name — the **assistance dilemma**: giving information and withholding it both help, and the open question is when to do which (source: Koedinger & Aleven 2007).

The resolution is that faded worked examples are not a third camp in this argument. They are the **bridge between the two camps**, which is what Renkl and Atkinson's own framing says — their paper on the technique is titled *structuring the transition from example study to problem solving*.

Read the completion problem against productive-struggle's own definition and the conflict dissolves. That page draws its line between productive struggle and unproductive flailing at two properties: feedback that eventually arrives, and a bound on the effort. A blanked step has both — the worked steps above it are the bound, and the full solution is the feedback that closes the loop. The blanked portion is genuine struggle: the outcome is unknown to the learner at the moment of effort, which is that page's defining epistemic property. A faded example is therefore a **machine for keeping struggle inside the Zone of Proximal Development while the zone moves** — the supplied steps are the rope, and `k` is how much rope is left.

The two literatures also agree on shape more than they disagree. Kapur's design has two phases, generation followed by consolidation; the generation phase only pays off *because* instruction follows it. Productive failure without the consolidation phase is just failure. Fading is the mirror image: it needs an opening example, and it converges on unaided solving. One starts at struggle and ends at instruction, the other starts at instruction and ends at struggle, and both are wrong at their own extremes.

**Routing rule.** Use faded examples when the domain has a stable solution procedure the learner is meant to end up executing fluently — algorithms, proof technique, arithmetic method, code patterns. Use unsupported struggle first when the goal is a *concept* whose structure the learner should discover rather than execute, and always follow it with the consolidation step. Where ibl-pedagogy applies, fading is the wrong tool; where a drill ladder applies, it is the right one.

## Applying it to algorithms

This is the domain that generated the page, and the direct evidence lives here. Van Merriënboer ran completion against generation on a ten-lesson high-school programming course: the completion group came out **superior on program construction** and had a **lower dropout rate** (source: Van Merriënboer 1990). The dropout result matters at least as much as the learning result for a solo learner with no instructor and no cohort — a technique that keeps you in the chair is doing work that a technique with a marginally better learning curve does not.

A worked example for a pattern-family problem has four natural steps, which gives a five-row fade:

| `k` | Supplied | You write | Principle prompt |
|---|---|---|---|
| 0 | pattern name · invariant · code · complexity | nothing — study and self-explain | "why *this* pattern and not its nearest neighbour?" |
| 1 | pattern name · invariant · code | the complexity argument | "what does each element cost, and how many times is it touched?" |
| 2 | pattern name · invariant | the code | "which line maintains the invariant?" |
| 3 | pattern name | the invariant, then the code | "what is true of each region at the top of every iteration?" |
| full | the problem statement | everything | "which of the twelve families, and what rules the other eleven out?" |

Three things fall out of this that the wiki already owns:

1. **The invariant row is a real rung, not filler.** `loop-invariants` gives the abstract layer its own three obligations, so `k=3` — derive the invariant unaided, then the code — is a checkable step rather than a vague "understand it better."
2. **The principle prompt already has a gym.** The prompt at `k=full` is *name the pattern family and the distinguishers that rule out its neighbours*, which is precisely what `algorithm-pattern-gym` trains to under 8 seconds and what the D slot of every card in `algorithm-pattern-nedf-deck` supplies. The self-explanation half of the technique is already built here; only the fade schedule was missing.
3. **The deck cards separate the two visual types for free.** Each card carries an **N (name-hook)** slot — the addressing image that must never fade — beside a diagram you reason inside, which should. That the split falls out of a card format designed two months before the split was named is independent support for it.

## Mnemonic

A solved problem on paper, and the ink is **fading from the bottom up**. The last line goes first — ghost-grey, then gone — and your own handwriting climbs to meet the fade line. Each new sheet, the fade has crept one line higher. In the margin beside every line still printed, a small red **"why?"** demands the principle's name before you're allowed to read on. And the fade line only rises when the last two sheets came back clean; one bad sheet and the ink comes *back*.

Four features, four findings: bottom-up = backward fading · your handwriting = completion · the red "why?" = self-explanation prompts, the far-transfer carrier · the ink returning = adaptive pacing, never a fixed calendar.

## Checksum

- **1** direction: backward — blank the *last* steps first.
- **1** thing fading alone buys: near transfer. It does **not** buy far transfer.
- **1** thing that recovers far transfer: a per-step prompt to name the principle, at no extra time on task.
- **2** orders in the adaptive result: adaptive > fixed, fixed > plain problem solving.
- **3** fading axes, one owner each: representation (Rule 9) · substrate (Scaffold Fade R1–R4) · solution (step budget `k`).

If you can recite 1-1-1-2-3 from the page name — direction, what fading buys, what fixes the gap, the two orderings, the three axes — the page is encoded. Failing the second item is the failure this page exists to prevent: a fade set that makes you fast at one problem type and no better at its neighbours.

## METER

Three events, per [METER](./meter-overview.md) naming conventions. The first is a state variable, not a score.

- `fade.step_budget` — how many trailing steps are blanked on the current attempt (`0 … full`). Logged per problem type, not globally; a learner sits at different budgets in different families.
- `fade.completion_pass` — did the blanked portion come out correct **without consulting the full solution**? **Adaptive pacing rule** (the implementation of Salden et al. 2010): two consecutive passes raise the budget by one step; a single failure lowers it by one. Never advance on a fixed schedule — the fixed schedule is the condition that lost in both of their experiments.
- `fade.principle_named` — was the self-explanation prompt answered with the *principle*, or with a restatement of the step? Restating the step scores fail. A set logging high `completion_pass` alongside low `principle_named` is the documented near-transfer-only signature: procedure copied, principle not extracted. **Floor**: ≥3 such cycles routes to re-encoding the concept, not to more problems.

**Pass-floor for a problem type**: `fade.step_budget` at full, with `fade.completion_pass` and `fade.principle_named` both passing on the first attempt, twice running.

## Related pages

- [singapore-math](./singapore-math.md) — concreteness fading, the same mechanism withdrawing a representation instead of a solution
- [representation-rules](./representation-rules.md) — Rule 9, the representation axis of the three
- [soroban-learning-method](./soroban-learning-method.md) — §Stage 6 Scaffold Fade, the substrate axis of the three
- productive-struggle — the tension this page resolves rather than overrides
- [problem-solving-maturity-levels](./problem-solving-maturity-levels.md) — the expertise-reversal effect this technique implements
- ibl-pedagogy — the pedagogy that owns the other side of the routing rule
- loop-invariants — the abstract layer the `k=3` rung asks for
- algorithm-pattern-nedf-deck — the twelve families a fade set for algorithms runs over
- algorithm-pattern-gym — where the principle prompt is already drilled
- [drill-generator](./drill-generator.md) — the sibling apparatus; drill ladders vary difficulty, fade sets vary support
- [skill-progression-stages](./skill-progression-stages.md) — the stage numbering `k` is deliberately *not* part of
