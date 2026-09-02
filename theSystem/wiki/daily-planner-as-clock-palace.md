---
palace: strategic-memory
level: 3
domain: 10
room: 3
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/daily-planner-as-clock-palace.md
---

# Daily Planner as Clock-Palace

**Summary**: The daily-planner artifact rebuilt as an instance of the [clocks24](./clocks24.md) hour-palace — the schedule column's 24 hours are not labels but 24 fixed clock-loci, so a day plan becomes a walkable [memory-palace](./memory-palace.md) with today's intentions placed as scenes at each clock. Composes three existing systems ([calendar-memory](./calendar-memory.md) spine · [REMAPS](./remaps.md) payload · neural-os-daily-loop governance) under one artifact, with a [prospective-memory](./prospective-memory.md) cue discipline overlaid.

**Sources**:
- Composes: [calendar-memory](./calendar-memory.md), [clocks24](./clocks24.md), [prospective-memory](./prospective-memory.md), neural-os-daily-loop, circadian-rhythm-and-chronotypes, [memory-palace](./memory-palace.md)
- Design conversation, 2026-07-03
- Visual asset: `Excalidraw/Daily_Planner_Clock_Palace.excalidraw.md`

**Last updated**: 2026-07-04

---

## What this page is

An **instance**, not a new protocol. It takes a generic daily-planner layout (hourly schedule + big-goal + meals + notes) and shows that, inside Neural OS, every region already has an owner elsewhere in the wiki. Nothing here redefines those systems; it wires them into one artifact you can print or draw. The named systems keep their owners — this page only specifies the *composition*.

## The core move — the hour column is already a palace

A generic planner treats the schedule column (e.g. 03:00–24:00) as dead time-labels. Under [clocks24](./clocks24.md), every hour 00–23 is permanently pegged to one real named clock — David's frozen instantiation of [calendar-memory](./calendar-memory.md)'s hour slot. So the schedule column is not blank rows; it is **24 pre-installed loci of a [memory-palace](./memory-palace.md)**, already drilled in Anki.

The consequence: you own the hard part of a mnemonic planner for free. An entry at 14:00 is not text — it is a scene placed at the Prague Astronomical Clock (hour 14). To recall the day, walk the clocks from your wake-hour forward; each locus hands back what you placed there. Two anchors carry extra weight: **noon / Wells (1392)** is the head of the age-ladder — the day's spine — and **midnight / Philadelphia** is the poem-cycle bookend (both per [clocks24](./clocks24.md)).

## Chunk the spine into a day-phase grid

Twenty-four loci is more than working memory holds at once, so the column runs easier when its hours are grouped. Apply [chunking](./chunking.md)'s *visual-container* move — divide one container into regions and merge items into them in a fixed scan order — to the clock spine: cut the 24 hours into **four day-phase chunks of six**.

| Chunk | Hours | Head locus | Character |
|---|---|---|---|
| **Night** | 00–05 | 00 Philadelphia · bookend | sleep / pre-dawn |
| **Morning** | 06–11 | 06 Selfridges → 11 Makkah | rise / climb |
| **Afternoon** | 12–17 | 12 Wells · spine | post-lunch |
| **Evening** | 18–23 | 18 Lyon | wind-down; core-temp peak ~19:00 |

Now you hold **four handles**, not twenty-four rows — inside the 4–7 range [chunking](./chunking.md) prescribes — and each handle unpacks to a six-clock walk. The grid delivers both properties visual-container chunking promises at once: **chunking** (four regions) and **order** (the hour labels fix the scan direction). Both [clocks24](./clocks24.md) anchors land on chunk-heads — noon / Wells heads Afternoon, midnight / Philadelphia heads Night — so each chunk's entry point is its most vivid, self-checking locus.

The phase boundaries carry the cue and circadian structure for free: meals ([prospective-memory](./prospective-memory.md) event-cues) distribute across the waking chunks — breakfast in Morning; lunch (at the Wells head) and snack in Afternoon; dinner in Evening — and the deep-work block belongs in whichever chunk holds your chronotype's peak (see circadian-rhythm-and-chronotypes).

## The three layers

| Layer | What it is | Owner |
|---|---|---|
| **Spine (time)** | the 24 clocks = fixed loci; the retrieval key | [clocks24](./clocks24.md) |
| **Payload (intentions)** | each block = a [REMAPS](./remaps.md) scene placed at its clock (plus the clock's Major-peg year, drilled on its own channel) | [calendar-memory](./calendar-memory.md) |
| **Governance (rhythm)** | what *fills* the blocks and reviews the signal | neural-os-daily-loop |

The spine is fixed and never redesigned; the payload changes daily; the governance layer is the loop you already run.

## Region-by-region mapping

Every region of a standard planner maps to an existing owner:

| Planner region | Becomes | Owner |
|---|---|---|
| Hourly schedule 00–23 | the clock-palace spine; time-cued intentions as scenes at each clock | [clocks24](./clocks24.md) |
| Today's Big Goal | the keystone = tomorrow's first action, anchored at noon / Wells | neural-os-daily-loop |
| Breakfast · Lunch · Dinner · Snack | event-cues — the most reliable prospective anchors; habit-stack drills here | [prospective-memory](./prospective-memory.md) |
| Notes | the [RAPID](./rapid-in-neural-os.md) capture buffer | [rapid-in-neural-os](./rapid-in-neural-os.md) |
| M T W T F S S strip | week overlay — the day-of-month and month scales | [calendar-memory](./calendar-memory.md) |

## The rule that makes it work — prospective-memory discipline

A day planner is, functionally, a [prospective-memory](./prospective-memory.md) prosthesis: its whole job is to make an intention fire at the right future moment, which is the entire failure surface. The operating rule:

> Every entry is **time-cued** (it lives at its clock-hour) or **event-cued** (it hangs on a meal or fixed transition). An entry that is "sometime today" with no cue is a **dead intention** — it will not fire.

Meals earn their place because eating is a near-certain event-cue; hanging a drill on lunch as a Gollwitzer implementation intention (time + place + exact action, per [prospective-memory](./prospective-memory.md)) is far more reliable than "review cards today."

## Two refinements the generic template misses

- **Don't schedule flat.** Uniform hour-rows ignore that cognition peaks and dips across the day. Put the Big-Goal deep-work in your chronotype's peak and let meals anchor the troughs (core-temp peak ~19:00; lark / owl / intermediate ≈ 40/30/30 shift the whole curve). See circadian-rhythm-and-chronotypes.
- **The sleep slots are planner slots.** The pre-sleep card rinse and the mid-morning retrieval test are fixed blocks, not afterthoughts (see neural-os-daily-loop §Sleep-windowed additions).

## Minute precision (optional)

When a block needs sub-hour placement, the minute rides the [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) (rhyme-peg tens × visual-peg units = one multimodal percept), exactly as in [calendar-memory](./calendar-memory.md)'s time-of-day encoder. Skip it unless a plan genuinely needs the resolution.

## Falsifiable promotion gate

This page enters as a **candidate instance**. It promotes to an adopted method only if, across **7 consecutive planned days**:

1. **Recall** — blocks placed against clock-hours are reconstructable from the clock-loci alone (walk the clocks, read the scene) at ≥80%, <5s each.
2. **Use** — the planner is actually run on ≥5 of the 7 days (a prosthesis that isn't used is decorative).
3. **Catch** — the cue rule catches ≥1 intention that would otherwise have floated (a dead intention converted to a time- or event-cue).

[METER](./meter-overview.md) emit-spec: `planner::block-placed` · `planner::clock-recall` (pass ≥80%) · `planner::dead-intention-caught`. Two failed 7-day attempts → demote to sketch: the palace-as-planner overhead isn't paying off, fall back to a plain calendar. The gate is the [clocks24](./clocks24.md) × [prospective-memory](./prospective-memory.md) × neural-os-daily-loop composition earning its keep, or not.

## Visual

Full poster — 24 clock-rows (colour-banded by day-phase) + payload panels + theory zones: `Excalidraw/Daily_Planner_Clock_Palace.excalidraw.md` (open in Obsidian's Excalidraw view).

Chunked grid — the structural companion: the spine cut into four day-phase handles (6 clocks each), spine anchors in red, meal event-cues in orange: `Excalidraw/Daily_Planner_Chunk_Grid.excalidraw.md`.

## Related pages

- [clocks24](./clocks24.md) — the spine; the frozen 24-clock hour palace
- [calendar-memory](./calendar-memory.md) — the parent encoder; hour / minute / day / month / year scales
- [prospective-memory](./prospective-memory.md) — the cue discipline (time-cued vs event-cued vs dead)
- neural-os-daily-loop — the governance rhythm this planner renders
- circadian-rhythm-and-chronotypes — why not to schedule flat
- [memory-palace](./memory-palace.md) — the method-of-loci this instantiates
- [chunking](./chunking.md) — the spine grouped into a four-phase grid (its visual-container move)
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the optional minute encoder
- [REMAPS](./remaps.md) — how each block becomes a retrievable scene

---

## U — See (CAST)
1. A planner's hour column drawn as 24 clock-loci; today's intentions sit as scenes at each clock
2. Noon / Wells = spine anchor; midnight / Philadelphia = bookend

## D — Name (NEDF)
1. Daily-planner-as-clock-palace = the planner artifact rebuilt on the Clocks24 loci
2. Distinguisher: not a new protocol — a composition of clocks24 + calendar-memory + daily-loop under a prospective-memory overlay
3. Failure mode: floating intentions with no cue; treating hour-rows as labels not loci

## F — Do (SPEAR)
1. Place each block as a REMAPS scene at its clock-hour
2. Tag every entry time-cued or event-cued; route dead intentions or drop them
3. Hold the day as four day-phase chunks, not 24 rows — walk each chunk from its head clock

## B — Watch (HEART)
1. An entry with no time- or event-cue (won't fire)
2. Hour-rows used as a flat to-do list instead of loci (no recall benefit)

## L — Predict (ORACLE)
1. Cues installed → the day is walkable from the clocks at day's end
2. Flat scheduling → deep-work lands in a trough and stalls

## R — Act (GRACE)
1. New intention → place it at a clock-hour or hang it on a meal within 30s
2. Recall breaks → re-anchor the block inside its clock's scene, not as bare text

## Mnemonic

**The day is a clock you walk.** Start at your wake-hour's clock and step forward hour by hour; whatever you placed there is waiting. Noon (Wells) is the spine; midnight (Philadelphia) closes the loop.

## Checksum

1. What are the three layers? (Spine = clocks / loci · Payload = REMAPS scenes · Governance = daily loop.)
2. Where does the Big Goal anchor, and why? (Noon / Wells — head of the age-ladder, the day's spine.)
3. What makes an entry "dead"? (No time-cue and no event-cue — it can't fire.)
4. Why are meals load-bearing? (Eating is a near-certain event-cue; habit-stacked drills hang on it reliably.)
