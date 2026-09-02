---
palace: meta-knowledge
level: 8
domain: 10
room: 43
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/giordano-graded-curriculum.md
---

# Giordano Graded Curriculum (Мнемотехника шаг за шагом)

**Summary**: The 5-course / 60-lesson distance-learning progression of *Мнемотехника шаг за шагом* — a decades-run, empirically-delivered mnemonics curriculum from the Giordano ([Kozarenko](./kozarenko-mnemotechnics.md)) school. It is logged here as an **external reference curve** the wiki can tune its home-grown drill ladders against, not as an operational drill the user must run.

**Sources**:
- `Мнемотехника шаг за шагом.pdf` — the distance-course text (five interlinked sub-courses, lesson plans, control tests).
- Internal: [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) (same Giordano school; owner of БЦК), [cast-drill-ladder](./cast-drill-ladder.md) (the wiki's own ladder this compares against), [skill-progression-stages](./skill-progression-stages.md) (registry for stage/level/count claims), neural-os-30-day-rollout (the wiki's calendarized ramp).

**Last updated**: 2026-07-10

---

## What this page is — an external reference curve

This is **comparanda**, not curriculum-to-follow. The value of ingesting *Мнемотехника шаг за шагом* is that it is a real, delivered, graded course with a fixed lesson count, an explicit volume ramp, a numeric pass rubric, and a named failure mode — exactly the four things a home-grown drill ladder needs to be tuned against. Treat every number below as a **measured external data point**, not a target to copy.

The course is a distance-learning program built from five different but interlinked sub-courses whose exercises "ensure a gradual increase in the volume and complexity of the material to be memorized" (source: Мнемотехника шаг за шагом.pdf). That single design sentence is the reason it earns a page: it is the ramp made explicit.

When this page states counts and ladders, it is framing them against the wiki's own progression ladders, whose registry is [skill-progression-stages](./skill-progression-stages.md) — the counts below are the *external* curve, [skill-progression-stages](./skill-progression-stages.md) holds the *internal* one.

## The five courses (lesson map)

Sixty numbered lessons split 12 / 12 / 12 / 16 / 8 across five sub-courses (source: Мнемотехника шаг за шагом.pdf). Framed against the wiki's own ladders in [skill-progression-stages](./skill-progression-stages.md), this is the external counterpart curve:

| # | Course (RU) | Focus | Lessons |
|:--:|---|---|:--:|
| 1 | Интенсивный тренинг (intensive training) | Single techniques drilled in isolation; attention ("устойчивость внимания") trained; session volume ramped toward 100 items | 12 (1–12) |
| 2 | Ваша первая база данных (your first database) | 25 named information types (phones, historical/exact dates, constants, schedules, names, formulas…); terminal 100-unit graded test | 12 (13–24) |
| 3 | Иностранные слова (foreign words) | Foreign vocabulary, on the example of English; phonetic image-code cards | 12 (25–36) |
| 4 | Текстовая информация (text) | From anecdotes and short texts up to books, textbooks with complex terminology (and legal statutes) | 16 (37–52) |
| 5 | Коды и пароли (codes & passwords) | Numeric secrets: PINs, card numbers, bank accounts, passwords | 8 (53–60) |
| — | **Total** | | **60** |

`12 + 12 + 12 + 16 + 8 = 60` (source: Мнемотехника шаг за шагом.pdf). Course 1 is a hard prerequisite: its exercises "form the initial skill of memorization, without which study of the other courses is impossible" (source: Мнемотехника шаг за шагом.pdf).

Course 4's own ramp — anecdote → short factual text → book-length material with complex terminology — is the external counterpart to the wiki's [prose-memorization](./prose-memorization.md) routing guide, which orders training the same way (anecdote first, factual конспект second, verbatim last).

## The volume ramp

The ramp is explicit and monotone: session volume climbs from a handful of items to a full hundred while the *techniques* stay fixed — only load increases (source: Мнемотехника шаг за шагом.pdf). This is the load axis the wiki's [cast-drill-ladder](./cast-drill-ladder.md) and [skill-progression-stages](./skill-progression-stages.md) describe internally; here it is delivered on a real cohort.

| Stage | Session volume | Where in the course |
|---|:--:|---|
| Entry | 5 items | Short sequences drilled "по 5 образов" in Course 1 |
| Base | 25 items | A group of 25 (foreign-word groups; database rows) |
| Ramp | 75 items | "Memorize 75 images at once and recall them all whole" (Course 1) |
| Terminal | 100 items | The 100-unit database + graded test at the end of Course 2 |

(source: Мнемотехника шаг за шагом.pdf)

In parallel, the **image-code vocabulary 00–99** (100 fixed number-images) is over-learned on continuously-growing random-order tables, roughly 10 codes per lesson across the early Course-1 lessons, driven to a **~0.5-second recognition floor** — at which point the codes "will never be forgotten, because formed direct reflex connections are not destroyed" (source: Мнемотехника шаг за шагом.pdf). The 00–99 image-code table itself is byte-identical to the БЦК Cyrillic number alphabet owned by [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) — it is **not re-documented here**; see that page for the mapping and the "only «ц» is memorized raw" load-reduction claim.

## The graded test — a reusable [METER](./meter-overview.md) checkpoint

At the end of Course 2 (and as an early diagnostic, lessons 2 and 24) the course runs a **30-item, timed control test** with a four-band error rubric (source: Мнемотехника шаг за шагом.pdf):

| Errors (of 30) | Band (RU) | English |
|:--:|---|---|
| 0–3 | отлично | excellent |
| 4–6 | хорошо | good |
| 7–9 | удовлетворительно | satisfactory |
| > 9 | неудовлетворительно | fail |

Rules: you are given 30 support-image ordinals in random order and must write the information fixed on each; recalling correct information but against the *wrong* ordinal counts as an error, and a single missing or wrong obligatory element counts as an error. Time budget: **≤ 1 hour** (the course author writes it out in 10 minutes — the physical floor for transcription) (source: Мнемотехника шаг за шагом.pdf).

This 30-item / 4-band / timed structure is a ready-made **[METER](./meter-overview.md) checkpoint template**: it measures two axes at once — *retention* (error count) and *free navigation* through the store (elapsed time) — with a bright pass line. The wiki can lift the rubric shape directly: a fixed-N recall test, a graded error band, and a per-item speed floor (here the 0.5-second image-code recognition floor doubles as the encode-side METER threshold) (source: Мнемотехника шаг за шагом.pdf).

## The named failure mode — attention before volume

The most useful thing the course validates for the wiki is a **sequencing constraint**. It names attention instability ("неустойчивость внимания") as one of the main problems in memorization, and trains attention/concentration via relaxation and psychotechnic exercises as a running prerequisite *before and during* the volume ramp, not after (source: Мнемотехника шаг за шагом.pdf).

The mechanism it guards against: image codes must be memorized **in isolation**, "so that no connections are created with the image codes" — if you weld fresh associations onto the code-images while ramping volume, the codes get corrupted (source: Мнемотехника шаг за шагом.pdf). The structural fix is the **Приём возврата (return technique)** introduced in lesson 9 — explicitly "a combination of the Chain technique and the memorize-on-different-parts-of-the-image technique" — which lets a long sequence be linked *without* overwriting the underlying codes (source: Мнемотехника шаг за шагом.pdf).

Read against the wiki's own ladder in [cast-drill-ladder](./cast-drill-ladder.md) and [skill-progression-stages](./skill-progression-stages.md), this is external confirmation of the sequencing rule: **stabilize attention and isolate the base vocabulary before raising session volume**, or associations silently overwrite. A ramp that increases load before the substrate is over-learned is the anti-pattern the course was built to avoid.

## A sibling Russian curriculum — Advance / Yagodkin

A different Russian training centre, [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md) (Advance), runs the same kind of source-to-wiki reading: a real, delivered curriculum logged as an external reference — this time a one-hour "learn 50 words" practicum rather than a 60-lesson distance course — with its own volume ramp (the Storm/Siege scheduling in [storm-and-siege-protocol](./storm-and-siege-protocol.md)) and its own graded checkpoint shape. Read the two together as independent Russian mnemonics lineages that both earned a "source, not framework" verdict, not as competing systems.

## Same school as Kozarenko — link, don't re-derive

*Мнемотехника шаг за шагом* is the same Giordano tradition documented in [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md): lesson 7 credits **В.Козаренко** as the compiler of the 3-digit image-code reference, and the letter→digit code table is byte-identical to БЦК (source: Мнемотехника шаг за шагом.pdf). So the constructs here already have owners in the wiki — the image codes, the loci/support-image systems, the image-combination moves, the metronome — are the same layer mapped in [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md). This page adds only the **graded-curriculum shape** (the ramp, the rubric, the failure-mode sequencing); it does not re-document any of those constructs.

## What the wiki tunes against it

Three internal artifacts get an external calibration point:

- **[cast-drill-ladder](./cast-drill-ladder.md)** — the 0.5s recognition floor and the 5→25→75→100 volume ramp are external anchors for the wiki's own drill floors (which count and pace live in [skill-progression-stages](./skill-progression-stages.md), not restated here).
- **neural-os-30-day-rollout** — 60 lessons over a multi-month distance course is a *decompression* reference: it shows how much wall-clock a real cohort spends per unit of automaticity, a sanity check on any compressed 30-day plan.
- **[METER](./meter-overview.md)** — the 30-item / 4-band rubric is a reusable checkpoint template (see above).

## Mnemonic

**"5 courses, 60 rungs, 5→25→75→100, attention first."** Five sub-courses stack into sixty lessons; the load climbs a fixed quadruple ramp; and the iron rule underneath is *train attention and isolate the codes before you raise the volume.* One count (5), one count (60), one ramp (5·25·75·100), one law (attention-first) — the whole external curve in a breath.

## Checksum

- If you treat this page as an operational drill the user must run → **wrong**; it is an external reference curve for tuning the wiki's own ladders (source: Мнемотехника шаг за шагом.pdf).
- If you think the graded rubric is 3 bands, or the pass line is 0 errors → **wrong**; it is **four** bands (0–3 / 4–6 / 7–9 / >9 of 30 items) and "excellent" tolerates up to 3 errors (source: Мнемотехника шаг за шагом.pdf).
- If you think the course ramps volume first and trains attention later → **wrong**; attention/isolation come *before* the volume ramp, and the return technique exists precisely to stop association-overwrite (source: Мнемотехника шаг за шагом.pdf).

## Visual

```chart height=320
{"title":{"text":"Giordano graded curriculum — session-volume ramp","subtext":"Techniques stay fixed; only load increases — attention & code-isolation first, ramp after"},"xAxis":{"type":"category","data":["Entry","Base","Ramp","Terminal"]},"yAxis":{"type":"value","name":"session volume (items)","max":110},"series":[{"type":"line","step":"end","symbol":"circle","symbolSize":8,"lineStyle":{"color":"#5c7a54","width":2},"itemStyle":{"color":"#5c7a54"},"label":{"show":true,"position":"top","formatter":"{c} items"},"data":[5,25,75,100]}]}
```

*Across the five courses — **C1** Интенсивный тренинг (12 lessons, attention FIRST) · **C2** Ваша первая база данных (12, +codes 00–99) · **C3** Иностранные слова (12, foreign vocab) · **C4** Текстовая информация (16, jokes → statutes) · **C5** Коды и пароли (8, PINs / passwords) · Σ = 60. The ramp climbs only after attention is stable and the codes are isolated (prereq); the Приём возврата (return technique, lesson 9) is the structural fix. Terminal: the 100-unit database with a 30-item graded test, ≤ 1h, error bands 0–3 / 4–6 / 7–9 / >9.*

## Related pages

- [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) — same Giordano school; owner of БЦК and the image-code / loci constructs (do not re-derive them here)
- [prose-memorization](./prose-memorization.md) — the wiki's routing guide for Course 4's material (text memorization), same anecdote→factual→verbatim training order
- [cast-drill-ladder](./cast-drill-ladder.md) — the wiki's own drill ladder this external curve calibrates
- [skill-progression-stages](./skill-progression-stages.md) — registry for every stage / level / count claim
- neural-os-30-day-rollout — the compressed internal ramp, sanity-checked against this decades-run course
- [meter-overview](./meter-overview.md) — the 30-item / 4-band rubric as a reusable checkpoint template
- [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md) — sibling Russian mnemonics lineage (Advance), same "external reference curve, not framework" verdict

---

## U — See (CAST)
1. One real, delivered course: 5 sub-courses, 60 lessons, a monotone volume ramp
2. Edges: each construct points to an owner in [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md); only the graded shape is new here

## D — Name (NEDF)
1. Giordano graded curriculum = external reference curve (ramp + rubric + failure-mode sequencing)
2. Distinguisher: the 30-item / 4-band graded test and the 5→25→75→100 volume ramp
3. Failure mode: reading it as an operational drill, or re-documenting БЦК instead of linking

## F — Do (SPEAR)
1. Calibrating a wiki drill floor → pull the 0.5s recognition floor and the ramp as external anchors
2. Designing a checkpoint → lift the 30-item / 4-band / ≤1h rubric as a [METER](./meter-overview.md) template

## B — Watch (HEART)
1. Drift toward treating this comparanda as a prescription the user must follow
2. Restating a count bare (60 / 25 / 100 / 00–99) without the [skill-progression-stages](./skill-progression-stages.md) citation

## L — Predict (ORACLE)
1. Any home-grown ladder that ramps load before over-learning its base vocabulary → predict silent overwrite
2. A compressed 30-day plan measured against 60 delivered lessons → predict the compression cost surfaces as a lower automaticity floor

## R — Act (GRACE)
1. New external mnemonics curriculum → log as a reference curve feeding existing owners, don't mint a framework
2. "Copy this ramp" request → route through [cast-drill-ladder](./cast-drill-ladder.md) + [skill-progression-stages](./skill-progression-stages.md), not this page's raw numbers
