---
palace: meta-knowledge
level: 6
domain: 10
room: 23
para: resource
semantic_mode: 5
wiki_source: wiki/problem-solving/opportunity-windows.md
---

# Opportunity Windows

**Summary**: An opportunity is a **perishable resource with an expiry you do not control**. That makes it the strangest row in the personal-resource-inventory ledger: unlike hours it does not replenish on a cycle, and unlike capital it cannot be held — when the precondition that opened it stops being true, the resource is simply gone. The consequence that matters is behavioural: **the dominant failure is not choosing wrong, it is choosing nothing**, because a non-decision resolves to expiry by default. This page owns the recognition test (what makes a window a window), the two-clock model, and the review mechanism — a dated `expires` field with a deadline trigger, not a cadence.

**Sources**:
- Synthesis page (2026-07-26) — no `raw/` source. Written to close a gap surfaced by the 26-class personal-resource catalogue: opportunities/open windows were named as a load-bearing class in personal-resource-inventory with no page anywhere in the wiki.
- Parent law and register: idle-resource-is-adversarial · personal-resource-inventory.
- Neighbours it does not redefine: [timing-operative](./timing-operative.md) (owns the timing-signal vocabulary) · [decision-kernel](./decision-kernel.md) · [expected-value-and-arrows-theorem](./expected-value-and-arrows-theorem.md).

**Last updated**: 2026-07-26

---

## What makes a window a window

Not every good idea is an opportunity. The test is structural:

> A window exists when some **precondition currently holds and will stop holding**, on a schedule you do not set.

The precondition is the thing to name, because it is what dates the row. A person is available *until they take the other job*. A price exists *until the round closes*. A market gap is open *until someone fills it*. A child is at a given developmental stage *until they are not* (egw-developmental-floor). A grant, a visa cycle, a season, a renewal date, a court deadline: each is a precondition with a clock on it.

If you cannot name the precondition, you probably have a **wish**, not a window — and wishes do not expire, which is exactly why they never force a decision.

## Two clocks, only one of which you own

| Clock | Owner | What it governs | Lever |
|---|---|---|---|
| **The window's clock** | outside you — market, calendar, another party, biology | when the precondition stops holding | none; only *placement* (be where it opens) |
| **Your readiness clock** | you | whether you can act when it does | *method* — preparation, skills, capital-on-hand, relationships already warm |

This is the idle-resource-is-adversarial rate axis in its sharpest form: the window is **rate-exogenous** and your readiness is **rate-endogenous**. It also explains why opportunity is so often described as luck — the exogenous clock is visible and the endogenous one is invisible, so preparation looks like fortune from the outside.

The practical reading: **you cannot manufacture windows, so invest in the clock you own.** Warm relationships, a liquid buffer, and a rehearsed skill are all *pre-positioning* — they shorten the readiness clock so that more windows are catchable when they open.

## Non-decision is a decision

The failure mode this page exists to name:

> An unmade decision about a dated thing is not deferral. It is a decision to let it expire, made silently.

Ordinary deferral is safe because most things wait. A window does not, so the usual "I'll think about it" resolves — invisibly and by default — to *no*. That is the parent law's "idle is adversarial" restated in the time domain, and it is why an opportunity cannot be parked in the ledger's `reserve` state: reserve means *held against a named risk*, and a window cannot be held at all.

Three shapes this takes in practice:

1. **Deciding by exhaustion** — waiting until only one option remains, then calling it a choice.
2. **Optionality hoarding** — keeping several windows nominally open, acting on none. Options have a carrying cost (attention, forgone commitment, the alternatives you decline to pursue while "keeping things open"), so an unused option is not free.
3. **Readiness theatre** — preparing indefinitely for a window that is already closing, because preparation feels productive and commitment feels risky.

## Sizing the response: expiry against reversibility

Not every window deserves the same urgency. The reversibility rule that decides *how much care* a decision earns is owned by [decision-kernel](./decision-kernel.md), and its interaction with timing is already worked out as the 2×3 matrix on [timing-operative](./timing-operative.md) — this page does not restate either. What it adds is the missing axis in both: **the expiry date**.

> The **deadline** sets *when* you must decide. **Reversibility** sets *how much care* to spend before then. They are independent, and confusing them is the common error.

Reading them together produces the four practical cases:

| | near deadline | distant deadline |
|---|---|---|
| **reversible** | fast yes — the cost of deliberating exceeds the cost of being slightly wrong | act early anyway; the information from acting is the cheapest available |
| **irreversible** | the dangerous cell — real care compressed into little time, so buy information *now* or decline deliberately | the one case where waiting is genuinely correct — right up until the deadline converts it into a rushed decision |

The bottom-right cell is where most windows are lost: waiting is correct for so long that it becomes a habit, and the habit outlives the correctness. Setting the `expires` date at entry is what stops that, because it converts "not yet" into a dated commitment to decide.

For whether the window is worth entering at all, see [expected-value-and-arrows-theorem](./expected-value-and-arrows-theorem.md). Recognising that a window is *opening* — as opposed to reasoning about one already in front of you — is the anticipation problem owned by [timing-operative](./timing-operative.md) and [oracle-overview](./oracle-overview.md).

## How the ledger handles it

Opportunities were deliberately **not** given their own register in personal-resource-inventory — their deploy mode (exercise it, or let it go) is not distinct enough to earn one, and the items themselves live wherever they belong (a job offer is a Self/Relationships row; a renewal is an Obligations row). What they get instead is the **`expires` column**:

- Any row with a date in `expires` triggers a review when that date falls inside the next cycle, **regardless of its register's cadence**. This is the one deadline-driven mechanism in an otherwise cadence-driven ledger.
- The review question is not "is this deployed?" but **"exercise, or let it go — deliberately?"** A window consciously declined is a resolved row. A window that simply lapsed is the same failure as `idle-without-intent`, one layer up.

## Failure modes

1. **No named precondition.** Without it there is no date, and without a date the ledger cannot trigger. Most "missed opportunities" were never entered as rows.
2. **Treating a wish as a window** — manufacturing false urgency around something that is not actually expiring. The inverse error, and just as costly in attention.
3. **Optionality hoarding** — mistaking held options for a strong position while their carrying cost accrues.
4. **Confusing the two axes** — treating a near deadline as a reason to skip the care an irreversible move deserves, or a distant one as licence to defer a cheap reversible experiment.
5. **Blaming luck for a readiness gap** — the window was visible; the endogenous clock was the one that was not ready.

## Related pages

- idle-resource-is-adversarial — the parent law; a window is its purest perishable case, since *held* is not an available state
- personal-resource-inventory — the `expires` column and the deadline-triggered review that handle windows without a register of their own
- [timing-operative](./timing-operative.md) — owns the timing-signal vocabulary for noticing a window is opening
- [oracle-overview](./oracle-overview.md) — anticipation before deliberation; firing before the window is obvious
- [decision-kernel](./decision-kernel.md) — the choice architecture underneath a window decision
- [expected-value-and-arrows-theorem](./expected-value-and-arrows-theorem.md) — whether the window is worth entering at all
- room-for-error — the buffer that keeps a missed window survivable rather than ruinous
- egw-developmental-floor — developmental windows: the class with the hardest expiry and the least recourse

## Mnemonic

**The tide, not the tap.** A tap replenishes: turn it off and the water waits. A tide does not — the boat goes out on this water or it sits on mud until the next one, and no amount of intention refloats it. Every window is tide-shaped: *name the water, mark the hour it turns, and be at the boat.*

## Checksum

1. State the structural test for a window. *(A precondition currently holds and will stop holding, on a schedule you do not set — name the precondition or it is a wish, not a window.)*
2. Name the two clocks and say which one you can actually move. *(The window's clock, rate-exogenous, no lever but placement; your readiness clock, rate-endogenous, moved by method and pre-positioning.)*
3. What is the dominant failure mode, and why is it invisible? *(Choosing nothing. A non-decision about a dated thing resolves silently to expiry, because unlike most deferrals a window does not wait.)*
4. Why can an opportunity never be recorded as `reserve`? *(Reserve means held against a named risk; a window cannot be held at all — it is perishable, so the states are exercise or let go.)*
5. What sets urgency, and what sets care? *(The deadline sets when you must decide; reversibility — one-way vs two-way door — sets how much care to spend before then.)*
6. Why do opportunities get no register of their own? *(Their deploy mode is not distinct and the items live in other registers; they ride the `expires` column and its deadline trigger instead.)*
