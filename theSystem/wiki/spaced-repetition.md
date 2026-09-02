---
palace: meta-knowledge
level: 8
domain: 10
room: 2
semantic_mode: 5
wiki_source: wiki/learning-systems/spaced-repetition.md
---

# Spaced Repetition

**Summary**: Spaced repetition is the practice of distributing study sessions over time with expanding intervals between reviews, rather than massing study in one block. The **spacing effect** is one of the oldest and most replicated findings in psychology — Ebbinghaus (1885) first formalized it; Cepeda et al.'s (2008) optimal-spacing review confirmed it across 254 conditions; Dunlosky et al. (2013) rated it (with [retrieval practice](./active-recall.md)) as one of two "high utility" strategies across age, ability, material, and assessment. SuperMemo's SM-2 algorithm and its descendants (Anki, Mnemosyne, FSRS) operationalized spaced repetition into the most widely-deployed memory technology in use today. In Neural OS, spaced repetition is the *default substrate* for every encoded artifact across all six encoders; [encoded-spaced-repetition](./encoded-spaced-repetition.md) is the Neural OS extension that adds encoder-aware scheduling. This page is the canonical owner for the term.

**Sources**:
- Ebbinghaus, H. (1885). *Über das Gedächtnis* — original forgetting-curve experiments demonstrating that distributed practice outperforms massed practice.
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). "Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention." *Psychological Science*, 19(11), 1095-1102.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). "Improving Students' Learning With Effective Learning Techniques." *Psychological Science in the Public Interest*, 14(1), 4-58.
- Bjork, R. A. & Bjork, E. L. (1992). "A New Theory of Disuse and an Old Theory of Stimulus Fluctuation." — Bjork's *desirable difficulties* and the disuse-vs-retrieval-strength distinction.
- Wozniak, P. A. (1990). "Optimization of Learning" — SM-2 algorithm origin (SuperMemo).
- Ягодкин, Н. А. & Згода, А. Н. (2023). *Учись учиться* — Advance's method book; source for the nine-step repetition cycle, the [Воронка](./yagodkin-advance-mnemonics.md) funnel, the Загрузка/Закрепление/Сохранение model, and the throughput figures. Commercial method book, not peer-reviewed: its internal claims carry no external citation and are flagged inline.
- Internal: [learning-sciences-validation](./learning-sciences-validation.md) (strategy #1 of the canonical six).

**Last updated**: 2026-07-31 (§The schedule has a finish line → [bedrock](./bedrock.md)); 2026-07-16

---

## Core claim

Two sessions of study separated by time produce more durable memory than the same two sessions held back-to-back. The optimal spacing is *task-dependent* but follows a predictable shape: longer retention intervals call for longer inter-study intervals, with an optimal ratio around 10-20% (Cepeda et al. 2008). A study session reviewing material 1 day before a 1-week test gets ~30% performance; reviewing the same material 1 week before a 1-month test gets ~50% — same amount of study, much better retention.

The mechanism (Bjork's *new theory of disuse*): two distinct memory parameters — **storage strength** (long-term durability) and **retrieval strength** (current accessibility). Restudy raises retrieval strength but barely touches storage strength when retrieval strength is already high. Allowing forgetting (retrieval strength to drop) before the next study raises *storage strength* — the durable parameter.

This is why **massed practice feels productive but produces fragile fluency**, and spaced practice feels harder but produces durable knowledge. The desirable difficulty is real and counter-intuitive.

## The SM-2 family

Wozniak's 1990 SM-2 algorithm is the operational form of the spacing effect:

```
1. Show card; user grades retrieval (typically 0-5 or Again/Hard/Good/Easy).
2. If fail: reset interval; show again soon.
3. If pass: schedule next review at interval = previous interval × ease factor.
4. Update ease factor based on grade.
```

SM-2 and its descendants (Anki's default algorithm, FSRS, Mnemosyne) are remarkably close to optimal under the Cepeda ridgeline for individual items. Their main weakness is treating items independently (no fan-out modeling, no spacing-effect interactions across related items) — see [encoded-spaced-repetition](./encoded-spaced-repetition.md) for the Neural OS attempt to address this.

## Operational forms

- **Anki-style flashcard SR** — most common; one fact per card; SM-2 / FSRS scheduling
- **Mnemosyne / SuperMemo native** — SM-2 family with richer review history
- **Mind-palace + scheduled revisits** — palace tour at expanding intervals
- **Course-level spacing** — Bjork's "interleaving" within a curriculum (see also retrieval practice + interleaving in [learning-sciences-validation](./learning-sciences-validation.md))
- **Latency-only manual triage** — Advance's [Воронка](./yagodkin-advance-mnemonics.md) funnel: sort a physical deck into piles by recall speed without ever flipping a card; see §External case below
- **Lifecycle-driven SR** — Neural OS's [lifecycle-manager](./lifecycle-manager.md) retires/promotes cards based on SR performance, not just calendar
- **Encoder-aware SR** — Neural OS's [encoded-spaced-repetition](./encoded-spaced-repetition.md) schedules differently per encoder type (NEDF Distinguisher slot has different optimal spacing than SPEAR Execution slot)

## Neural OS implementations

| Where | What it implements |
|---|---|
| [encoded-spaced-repetition](./encoded-spaced-repetition.md) | Encoder-aware SR scheduling (the Neural OS extension to plain SM-2) |
| neural-os-daily-loop | Daily SR slot as part of the ~30-min floor |
| [lifecycle-manager](./lifecycle-manager.md) | 4-tier ladder (Active → Cold → Archive → Drop) with SR-performance-driven transitions |
| [bridge-load-sr](./bridge-load-sr.md) | SR deck specifically for [bridge-load](./bridge-load.md) analogy-construction skill |
| [GRACE](./grace-overview.md) | SR cadence built into the social-encoding 5-slot card |
| [HEART](./heart-overview.md) | People-model SR with relationship-decay scheduling |
| [SPEAR](./spear-overview.md) | Procedure SR (Preconditions / Execution / Repair slots have different optimal intervals) |
| [ORACLE](./oracle-overview.md) | Prediction SR (calibration-tracking adjusts schedule) |
| [red-queen-knowledge-ladder](./red-queen-knowledge-ladder.md) | Cross-domain SR with archetype-stability scheduling |
| algorithm-pattern-nedf-deck | Algorithm-pattern SR deck instance |

The Neural OS commitment: **every encoded artifact has a default SR schedule**; encoder type determines the initial parameters; performance and lifecycle stage modulate them.

## Failure modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Massed practice / cramming** | *Unencoded, unreviewed* massed practice: all study in one block before a deadline, with no encoding step and no follow-up schedule; high in-session feel, near-zero 1-month retention | Cepeda ridgeline explicitly; neural-os-daily-loop daily floor prevents single-block cramming. Carve-out: a massed *encoding* session followed by a review schedule is a different animal — see §Storm without Siege is still cramming |
| **Fragile fluency** | Restudy raises confidence without raising storage strength | Bjork's distinction; restudy without retrieval is suspect; pair with [active-recall](./active-recall.md) |
| **Schedule drift** | Falling behind on SR creates exponentially-growing backlog | [lifecycle-manager](./lifecycle-manager.md) Cold/Archive tiers absorb backlog; daily floor bounds it |
| **Card fan-out** | One concept fragmented across many cards; review burden grows non-linearly | Encoder spine collapses fragmentation: one NEDF card per concept, one CAST graph per system |
| **Plain-SM-2 limitations** | Treats items independently; misses spacing-effect interactions between related items | [encoded-spaced-repetition](./encoded-spaced-repetition.md) adds encoder-aware grouping; FSRS adds individual-difficulty estimation |
| **All-cards-equal scheduling** | Treating a peripheral fact and a load-bearing concept identically | Lifecycle-manager priority tiers; UMTF Priority tag modulates schedule |
| **Cloze without context** | Cards that test isolated phrases drift from meaning | Scene-anchored cards (NEDF Scene slot, SPEAR Scene slot) preserve context |

## External case: Advance's repetition protocol (Yagodkin & Zgoda 2023)

Advance is a Russian commercial memory-training school; *Учись учиться* is its 2023 method book. It ships a fully-specified repetition protocol, which makes it a useful external case for this page: concrete enough to compare against the Cepeda ridgeline, and uncited enough to need flagging. Recorded here as a **named case with loose attribution flagged**, not as a validated derivation. Advance's named protocols are owned by [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md) and [storm-and-siege-protocol](./storm-and-siege-protocol.md); this section covers only what the protocol asserts about *spacing*.

### The nine-step cycle (quoted external protocol)

Quoted as Advance's own operational protocol. It is not a wiki ladder and is deliberately not mapped onto [skill-progression-stages](./skill-progression-stages.md) — no Neural OS stage count is being claimed or restated here.

| # | Interval |
|---|---|
| 1 | 20 minutes after loading |
| 2 | 1 hour |
| 3 | 2 hours |
| 4 | before sleep |
| 5 | on waking + midday the next day |
| 6 | daily for 5 days, any time |
| 7 | weekly for 3 weeks |
| 8 | monthly for 3 months |
| 9 | yearly for 3 years |

(source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

Advance claims that following this cycle exactly retains **more than 99%** of learned vocabulary (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). **Needs verification** — Advance-internal, with no external citation, no stated sample, no retention-test methodology, and no definition of what counts as "retained." Do not propagate it as a finding.

### The attribution correction

The book introduces the Ebbinghaus forgetting curve, then presents the nine-step cycle immediately afterwards as the answer to its own rhetorical question — what if we repeat the material at the moment it is being forgotten fastest? (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). The structure presents the schedule as *following from* Ebbinghaus. It does not.

- Ebbinghaus (1885) established the **shape** of the forgetting curve — a general decay regularity, steep in the first hours and flattening thereafter. The book states this part correctly, and correctly calls the curve a general regularity rather than a prescription (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).
- A curve shape does not entail a step-list. Nothing in Ebbinghaus specifies "20 minutes, then 1 hour, then 2 hours." Those numbers are Advance's own operational choice.
- This page's actual quantitative anchor for spacing is Cepeda et al. (2008): an optimal inter-study interval of roughly **10–20% of the target retention interval** — a *ratio rule*, not a fixed calendar (see §Core claim).

So the nine-step cycle is **Advance's protocol, loosely inspired by Ebbinghaus** — not an Ebbinghaus finding. Attribution flagged.

**The book undercuts its own schedule.** Later in the same chapter it states that precise intervals between repetitions are determined individually, and supplies a self-experiment protocol: take blocks of 20–50 words, run them on different cycles, log time-per-cycle, repetitions-to-max-speed, and the speed drop at the first repetition, then keep the sparsest schedule that still stabilizes day-7 speed — with a one-month check afterwards (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). That advice is compatible with Cepeda's ratio rule and is the more defensible half of the chapter. The fixed nine-step table is the part that travels badly.

**Consistency check against the ridgeline** (wiki-internal arithmetic, not a source claim): at the tail, Advance prescribes yearly review against a 3-year horizon — roughly a 33% ratio, where Cepeda would suggest something closer to 4–7 months. The early steps (20 min → 1 hr → 2 hrs → before sleep) are far denser than any ridgeline value, and are better read as *consolidation of a fresh mnemonic encoding* than as spaced retrieval in Cepeda's sense. The schedule is not absurd; it is simply not derived.

### How Advance's Воронка applies this page's fail→reset mechanic

**Not a new mechanism.** The funnel is a manual, latency-only instance of the SM-2 mechanic already on this page (§The SM-2 family, step 2: fail → reset interval → show again soon). What Advance strips out is the grading interface: instead of reading the answer and grading it 0–5, you sort by **recall latency alone**.

The procedure (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf):

1. Pass through the deck once. Cards recalled instantly go in pile 1; cards you hesitated over, doubted, or missed entirely go in pile 2.
2. Pile 1 drops out of the current cycle — no further time is spent on it until the next repetition. Pile 2 is repeated more often.
3. After several cycles on pile 2, re-apply the split: newly solid cards join pile 1, the rest stay in active repetition.

The point is throughput, not precision. Latency is a cheap, noisy proxy for retrieval strength — and, crucially, it is available *without flipping the card*.

**The failure mode the source names itself.** In Yagodkin's Korean case the operative detail is explicit: "для скорости я не переворачивал карточку" — for speed, I did not flip the card over and look at the translation (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). Flipping to verify **during the triage pass** destroys the entire time saving: checking each answer puts you back at full [active-recall](./active-recall.md) speed, which is precisely the cost the funnel exists to avoid. Triage and verification are different passes. Merge them and you have run a slow review that you have also mislabelled as triage.

**Case data**: returning to 5,000+ Korean flashcards untouched for two years, Yagodkin re-sorted the entire deck in about an hour by recall speed alone, with a familiar film playing (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

Two honest caveats on that case. First, it used **three** piles, not two — he added a *relevance* cut orthogonal to recall: (a) remembered and will need, (b) remembered but certainly won't need, (c) not remembered. Only afterwards did he flip the "not remembered" pile and re-sort it by need (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). That relevance axis is doing real work in the hour-long figure, and it belongs closer to [lifecycle-manager](./lifecycle-manager.md)'s concerns than to scheduling. Second, the book's *general* statement of the algorithm is the 2-pile version; the 3-pile sort is the case, not the method (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

The same triage logic appears at encode time in a later chapter: when loading new words, skip anything that resists encoding during the first half of the session and mark it as skipped, then return to the skipped items in the second half — writing those straight onto cards (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). Defer the expensive items; protect the throughput of the cheap ones.

### Загрузка → Закрепление → Сохранение (three-stage model)

| Stage | What it is | When |
|---|---|---|
| **Загрузка** (load) | Repeat the block straight after encoding until two consecutive passes run at the same speed and effort — the current maximum | Day 0, immediately after memorizing |
| **Закрепление** (consolidate) | "Re-loading": strengthen the links by adding further images or replacing weak associations; max speed returns by repetition 2–3, faster each time; the gap grows after each pass | Within the first week |
| **Сохранение** (maintain) | Rare maintenance; may be passive; ideally automated | After week 1 |

(source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). The book's own analogy: construction (load) → finishing (consolidate) → building maintenance (maintain) (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). Загрузка presupposes an encoding step — in Advance's method, mnemonic image-encoding of the kind owned by [substitute-word-system](./substitute-word-system.md) and paralleled in the Russian school documented at [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) — which is why stage 1 is "loading" rather than "learning."

**Cross-map onto [lifecycle-manager](./lifecycle-manager.md): it does not map cleanly.** Stating that honestly rather than forcing a 3-to-4 correspondence:

- The two ladders run in **opposite directions and measure different things**. Advance's three stages are an *acquisition* sequence — durability increasing over time. Lifecycle-manager's Active → Cold → Archive → Drop is a *retirement* ladder — relevance decreasing, ending in deletion.
- In lifecycle terms, **all three Advance stages sit inside the Active tier**. Cold, Archive and Drop have no Advance counterpart at all, because Advance's model has no concept of retiring material: its terminal state is "maintained indefinitely, cheaply."
- So this is **not a 3-vs-4 off-by-one**. The axes are orthogonal. Advance answers *how hard is this card being driven right now*; lifecycle-manager answers *does this card still deserve to exist*. A card can sit in Сохранение and be a Cold candidate at the same time, with no contradiction.
- The one genuine touch-point: Advance's Закрепление → Сохранение boundary (end of week 1) is a plausible *earliest* eligibility line for lifecycle-manager's Active → Cold transition. A card still in Загрузка or Закрепление should never be cooled — it has not yet been given its chance to stick.

### Throughput claims (needs verification)

| Claim | Figure |
|---|---|
| Loading 1,000 foreign words | ~8 hours |
| Maintaining those 1,000 words | ~10 min/day |
| Total maintenance across a year | ~3 hours |

(source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). **All three are Advance-internal**, with no external citation and no methodology — treat as marketing-adjacent until replicated.

A precision note on the internal arithmetic: the ~10 min/day and ~3h/year figures reconcile only if "10 min/day" is read as the per-session cost during the early daily phase, not as a daily-for-a-year commitment. Taken literally, 10 min × 365 days is ~60 hours, not 3. Under the nine-step cycle a year's reviews come to roughly 5 daily + 3 weekly + 3 monthly + 1 yearly ≈ 12 sessions, which at ~10 minutes each does land near the stated total. The figures are consistent; the phrasing is not. (Wiki-internal arithmetic, not a source claim.)

### Tooling

| Tool | Use | Figures |
|---|---|---|
| **Paper flashcards** | Recommended starting point; word on the front, translation on the back; business-card size for handling and storage; written at load time, one per word | — |
| **Quizlet** | Full active-repetition cycle; carries the funnel as a built-in swipe gesture — easy right, hesitant or hard left — and re-serves the left pile at the end | — |
| **Spritz / RSVP** | Speed-reading technology for *passive* review once active recall is already fast and error-free; scrolls words past a fixed eye position | ~300 wpm untrained, up to ~900 wpm trained |
| **Audio word lists** | Passive review; also trains listening comprehension and models pronunciation. Best recorded in someone else's voice — your own bakes in your pronunciation errors | recommended 60–130 wpm |

(source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

Two constraints Advance attaches to the passive tools matter more than the tools themselves. Passive review is licensed **only after several error-free active cycles at high speed** — the book's line is that three active reproductions beat a hundred passive perceptions — and repetitions should run in **short bursts of 30 seconds to a few minutes**, stopping when attention degrades (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). This is [active-recall](./active-recall.md)-first, with passive review as a maintenance-cost optimization rather than a substitute, and the ordering matches §Spacing + retrieval = compound interest below.

### Storm without Siege is still cramming

Advance's Штурм (Storm) — a single massed session claiming durable gains — looks like a counterexample to this page's massed-practice failure row. It is a **carve-out, not a reversal**. Both protocols are owned by [storm-and-siege-protocol](./storm-and-siege-protocol.md); what matters here is only the effect on the row.

- Storm is an **encoding event**; Осада (Siege) is the spacing and review layer. Advance always pairs them: its closing instruction is to combine the two — accumulation with preservation — and it holds that even short daily sessions consisting only of review are what keep what the storms acquired (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). The two phases are arguably **orthogonal rather than competing**: one gets material in, the other keeps it there.
- **Storm without a Siege-phase review schedule is just cramming**, and this page's existing row stands unchanged for that case. Advance does not claim otherwise — by its own account, a load with no repetition cycle loses a significant part of the information (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).
- Advance draws one further line worth recording: it treats *memorization loading* as storm-able but *skill training* as not. For language skills it holds that an hour daily beats seven hours weekly in a single storm, because skills roll back toward baseline across the gap (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). So even inside Advance's own framework, massed practice is licensed only for the loading step.

Net: the row needs **qualification, not reversal**, and now carries it. Cepeda et al. (2008) is not refuted here — nothing in the Storm/Siege pair tests massed *review* against spaced *review*, which is what the ridgeline actually measures. Advance's own model concedes the spacing effect; it simply front-loads the encoding.

## Spacing + retrieval = compound interest

[active-recall](./active-recall.md) and spaced repetition are the two highest-utility strategies in Dunlosky et al.'s 2013 meta-review, and they compound rather than add. Retrieval at expanding intervals (the SM-2 mechanism) is *the* operational implementation of both strategies simultaneously. Either alone is good; both together is the default learning substrate of Neural OS.

## The schedule has a finish line

Spaced repetition is usually presented as open-ended: review forever, at ever-widening intervals. Bahrick's fifty-year retention studies say otherwise. Past a critical level of original learning the curve stops falling, which is the condition [bedrock](./bedrock.md) owns and this page defers to.

What this page contributes is the parameter, not the definition. Bjork's distinction (§Core claim) says retrieval strength decays while storage strength accumulates; expanding intervals are the mechanism that raises the durable parameter far enough that the decay of the accessible one stops costing you the item. The schedule is the vehicle. Where it is heading is [bedrock](./bedrock.md)'s to state.

Two consequences for how this page's system is run:

- **An interval that keeps doubling is a signal, not just a scheduling outcome.** A card at a nine-month interval with no lapses is a candidate for leaving the deck entirely, not merely for a longer interval. [lifecycle-manager](./lifecycle-manager.md) §The Graduation Path owns that exit.
- **"Review forever" is a claim, and it is testable.** If graduated cards survive cold probes at long delay, the forever-framing is wrong for those cards. If they do not, the graduation criterion is too loose. Either way the answer comes from measurement — see [bedrock](./bedrock.md) §Measurement for the falsifier.

This does not weaken the case for spacing; it is the payoff argument for it. The reason to pay the review cost now is that the cost terminates.

## External grounding

See [learning-sciences-validation](./learning-sciences-validation.md) for the broader argument that Neural OS implements all six canonical Learning Sciences strategies (Dunlosky/Weinstein synthesis). This page covers strategy #1 (spaced practice). The wiki's commitment to spaced retrieval is not invented — it is the oldest and most-replicated finding in memory research, from Ebbinghaus in 1885 to Cepeda's 254-condition ridgeline in 2008.

## Related pages

- georgian-driving-exam-b-sr-deck — ~200-card distractor-aware deck scheduled by this page's system
- georgian-driving-exam-b-admin-law-rules — penalty/duty rows feeding that deck
- [active-recall](./active-recall.md) — the partner strategy
- [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md) — Advance's method; owner of Воронка as a named instance, which this page owns the mechanism for
- [storm-and-siege-protocol](./storm-and-siege-protocol.md) — Штурм/Осада; the encoding-vs-review pair that carves out the massed-practice row
- [substitute-word-system](./substitute-word-system.md) — the encoding step Advance's Загрузка stage presupposes
- [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) — the sibling Russian mnemotechnics school
- [encoded-spaced-repetition](./encoded-spaced-repetition.md) — Neural OS extension
- [bedrock](./bedrock.md) — the finish line of this schedule; where the review cost terminates
- [lifecycle-manager](./lifecycle-manager.md) — SR-driven retirement
- neural-os-daily-loop — daily SR slot
- [bridge-load-sr](./bridge-load-sr.md) — analogy-construction SR deck
- [learning-sciences-validation](./learning-sciences-validation.md)
- [memory-systems](./memory-systems.md)
- [long-term-memory](./long-term-memory.md)
- [chunking](./chunking.md)


---

- **2026-05-29 learning-canon cross-links**: [brown-make-it-stick](./brown-make-it-stick.md) (Ch 3 + Ch 4 popular synthesis) · [desirable-difficulties](./desirable-difficulties.md) (Bjork: spacing is desirable difficulty #1) · [interleaving](./interleaving.md) (sister difficulty; pair with spacing) · [serial-position-curve](./serial-position-curve.md) (short sessions maximize primacy/recency windows)

## U — See (CAST)
1. Review schedule expanding over time
2. Each successful recall → longer next interval

## D — Name (NEDF)
1. Spaced repetition = expanding-interval review
2. Distinguisher: leverages forgetting curve
3. Failure mode: re-reading without testing
4. Contested: Advance's nine-step cycle is a protocol, not an Ebbinghaus finding — curve gives shape, not step-list

## F — Do (SPEAR)
1. Card → test recall → mark grade
2. Next review scheduled by algorithm
3. Triage pass: sort by recall latency only — never flip the card

## B — Watch (HEART)
1. Passive re-reading
2. Skipping bad-recall cards
3. Flipping cards during a triage pass — collapses triage speed back to review speed
4. Storm with no review schedule — that is just cramming

## L — Predict (ORACLE)
1. Recall interval → predict retention probability
2. Grade pattern → predict mastery

## R — Act (GRACE)
1. New facts → put in SR
2. Daily → run reviews