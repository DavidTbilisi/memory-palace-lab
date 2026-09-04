---
palace: strategic-memory
level: 3
domain: 10
room: 3
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/clocks24.md
---

# Clocks24

**Summary**: David's canonical 24-clock memory system. Each hour of the day (00–23) is pegged to a real named clock; the 24 clocks are sorted oldest→newest, each clock's founding year is encoded in the [Major System](./mnemonic-methods-master.md), and the whole set is chained by a dark poem-cycle. It is the *frozen* instantiation of [calendar-memory](./calendar-memory.md)'s hour slot, and doubles as a standalone historical-date palace.

**Sources**:
- `https://github.com/DavidTbilisi/Clocks24` — `clocks.json` is the canonical data (24 entries: `time`, `date`, image `src`, `desc`, Wikipedia `link`, Major-System `mnemonic`, `poetry`).
- David's corrected mapping (2026-07-03 chat) — resolved four data issues in the then-current `clocks.json`: 07:00 = **Binns Clock, Edinburgh (1960)** (had been a duplicate of the 09:00 Berlin World Clock); 12:00 = **Wells, 1392** (the `date`/`link` were wrong); 03:00 Grand Central = **1913** (the `date` field said 1910); the 07:00/09:00 de-duplication.
- Authored artifact (2026-07-03 session).

**Last updated**: 2026-09-02 (§Read as a multi-attribute set added — [multi-attribute-encoding](./multi-attribute-encoding.md)'s worked instance; two defects surfaced by arithmetic over the table: the 2011 peg collision sits exactly where the monotone year-check is structurally blind, and city is a forward-only channel); 2026-07-03

---

## What it is — three stacked layers

Clocks24 is one address, three encoders stacked on it:

1. **Hour peg** — the hour of day `HH` (00–23) *is* the index. `HH` → one fixed clock. No modular arithmetic. This is the retrieval key.
2. **Major-System year** — each clock carries its real founding year, encoded as a [Major System](./mnemonic-methods-master.md) word-peg (e.g. Big Ben 1859 → *Tough Lip*). This turns the palace into a **historical-date** store: 24 real dates from 1392 to 2011, each nailed to an hour.
3. **Poem-cycle** — a continuous surreal narrative binds the 24 clocks into one story (a wanderer chasing his lost love, whose soul is *"scattered through clocks across the world"*), so the pegs are linked, not isolated.

Heterogeneous layers on orthogonal [UMTF](./universal-mental-tagging-framework.md) channels: number (hour), phonetic (Major year), narrative (poem). That is why they don't collide.

## The design — an age-ladder with two anchors

The 24 clocks are **sorted by construction date**, oldest to newest, and laid onto the hours starting at **noon**:

- **12:00 = the oldest clock** (Wells Cathedral, 1392).
- Every following hour is the next-newest clock — 13:00, 14:00 … wrapping past midnight … up to **11:00 = the newest** (Makkah, 2011).
- The founding years climb monotonically along that hour sequence (1392 → 1405 → 1410 → … → 2011). So the **hour also encodes the clock's age-rank**, and neighbouring hours are neighbouring in time.

Two hours are special anchors:
- **Noon (12:00)** = the head of the age-ladder (oldest).
- **Midnight (00:00, Philadelphia)** = the poem-cycle's bookend — both the prologue (*"he walks for a soul… scattered through clocks across the world"*) and the finale (*"their hands meet, time stops, the clocks fall silent"*).

## The 24 clocks

In the system's native **age order** (rank = age; the `Hour` column is the retrieval key):

| # | Hour | Clock | Location | Founded | Major peg |
|--|--|--|--|--|--|
| 1 | **12:00** | Wells Cathedral clock | England | 1392 | DuMB Nun · *oldest / noon anchor* |
| 2 | 13:00 | Zytglogge | Bern, Switzerland | 1405 | Tears Lollipop |
| 3 | 14:00 | Prague Astronomical Clock | Prague, Czechia | 1410 | Tart sauce |
| 4 | 15:00 | St Mark's Clock | Venice, Italy | 1499 | Drop Baby |
| 5 | 16:00 | Ulm Town Hall Astronomical Clock | Ulm, Germany | 1520 | TeLeNewS |
| 6 | 17:00 | Sighișoara Clock Tower | Romania | 1648 | DJ roof |
| 7 | 18:00 | Astronomical Clock of Lyon | Lyon, France | 1661 | Attach Judah |
| 8 | 19:00 | Spasskaya Tower Clock | Moscow, Russia | 1852 | Devil Nail |
| 9 | 20:00 | Atlas Clock (Tiffany) | New York City | 1853 | Diva Lamb |
| 10 | 21:00 | Big Ben | London | 1859 | Tough Lip |
| 11 | 22:00 | Église Sainte-Croix | Nantes, France | 1860 | TV jazz |
| 12 | 23:00 | Dolmabahçe Clock Tower | Istanbul, Türkiye | 1895 | Diva Pail |
| 13 | **00:00** | City Hall Clock | Philadelphia | 1898 | Dive Buffet · *midnight / story bookend* |
| 14 | 01:00 | Orsay Station Clock | Paris | 1900 | Top Sauce |
| 15 | 02:00 | Edwardian Clock & Tower | Dorchester | 1905 | shTePSeLi |
| 16 | 03:00 | Grand Central Terminal Clock | New York City | 1913 | Top Dome |
| 17 | 04:00 | Anker Clock | Vienna, Austria | 1914 | Debater |
| 18 | 05:00 | Peace Tower | Ottawa, Canada | 1920 | Top news |
| 19 | 06:00 | Selfridges Clock | London (Oxford St) | 1931 | Dope mad |
| 20 | 07:00 | Binns Clock | Edinburgh, Scotland | 1960 | Top Jazz |
| 21 | 08:00 | Allen-Bradley Clock Tower | Milwaukee, USA | 1962 | BaBaJaN |
| 22 | 09:00 | World Clock (Weltzeituhr) | Alexanderplatz, Berlin | 1969 | Top Shop |
| 23 | 10:00 | Leaning Clock Tower | Tbilisi, Georgia | 2011 | Nasty Date |
| 24 | **11:00** | Makkah Royal Clock Tower | Mecca, Saudi Arabia | 2011 | Nasty Date · *newest* |

*(Note: 10:00 and 11:00 share the year 2011 and therefore the same Major peg — the hour disambiguates them.)*

## Layer 1 — the hour peg (retrieval)

This is the operational overlap with [calendar-memory](./calendar-memory.md): its hour slot needed "1 of 24 famous clocks for the hour (0–23, direct map to `HH`)." Its own table was explicitly a *suggested* anchor list to be swapped and frozen. **Clocks24 is that frozen list.** Time-of-day recall runs `HH` → clock directly.

## Layer 2 — the Major-System year (the date encoder)

Every clock carries its founding year as a [Major System](./mnemonic-methods-master.md) peg, so Clocks24 is also a **history palace**: 24 real dates spanning 1392–2011, each welded to an hour and to a vivid building. Because the years are age-sorted along the hours, the sequence is self-checking — a peg that breaks the monotonic climb is misfiled. This is the same digits-only discipline [calendar-memory](./calendar-memory.md) uses for the year scale; drill the year pegs separately from the hour→clock map so the two channels stay independent. The same number-image code vocabulary generalizes to non-date payloads: [mnemonic-pin-password-encoding](./mnemonic-pin-password-encoding.md) runs the identical three-digit-chunk move on PINs, passwords, and account numbers instead of founding years.

## Layer 3 — the poem-cycle (narrative glue)

Each clock owns a short surreal stanza; together they tell one story — a wanderer travelling the world's clocks to gather his love, whose soul lies *"shattered, scattered through clocks across the world."* The stanzas **cross-reference** each other into a journey (Wells "points… to Venice"; the Berlin World Clock drops him "beneath a sky full of fire" in Prague), and the Philadelphia midnight stanza frames the whole cycle:

> At midnight in Philadelphia, the City Hall Clock bleeds green light… He walks not for glory, not for gold. He walks for a soul — his love — shattered, scattered through clocks across the world.
> *…Finale — Midnight:* …From every bell, every gear, her fragments return. She steps from the dark… Their hands meet. Time stops. The clocks fall silent.

This is the **story / linking method** doing the binding: the emotional narrative is what makes 24 arbitrary buildings cohere and stick. The full 24 stanzas live in `clocks.json` (the repo is the source of truth; they are not duplicated here).

## Read as a multi-attribute set

Clocks24 is the worked instance of [multi-attribute-encoding](./multi-attribute-encoding.md) — that page runs the full analysis; this section keeps the two operational findings, because both change what to drill.

**What the analysis confirms.** Eight stated attributes per clock (hour · name · city · year · age-rank · Major peg · visual hook · stanza) reduce to **three irreducible bindings**: hour ↔ clock, clock → city, clock → year. The rest were never encoded, by design — age-rank is a consequence of the age-sort, the Major peg *is* the year in another representation, and the stanza's place in the story follows the hour. The design deleted more than the encoding ever had to carry, which is the intended shape.

**Finding 1 — the monotone check is slack exactly where the clocks cluster.** The self-check named above ("a peg that breaks the climb is misfiled") is an error-detecting code whose power is the size of the gap between neighbours. Median adjacent gap is 7 years, largest 191 — but seven seams are three years or less, and one is **zero**:

| Seam | Years | Gap |
|---|---|:--:|
| 19:00 Spasskaya → 20:00 Atlas | 1852 → 1853 | 1 |
| 21:00 Big Ben → 22:00 Sainte-Croix | 1859 → 1860 | 1 |
| 03:00 Grand Central → 04:00 Anker | 1913 → 1914 | 1 |
| 07:00 Binns → 08:00 Allen-Bradley | 1960 → 1962 | 2 |
| 00:00 City Hall → 01:00 Orsay | 1898 → 1900 | 2 |
| 23:00 Dolmabahçe → 00:00 City Hall | 1895 → 1898 | 3 |
| **10:00 Tbilisi → 11:00 Makkah** | **2011 → 2011** | **0** |

At a gap of zero the check is **structurally blind** — equal years cannot violate an ordering in either direction — and that pair is also the set's only Major-peg collision (*Nasty Date* twice). "The hour disambiguates them" holds forward and fails backward: given the peg, no clock is named. So the 2011 pair is the single highest-value Distinguisher in the deck: one deliberate contrast, welded to the hours (the **leaning** tower at 10:00 against the **tallest clock face on earth** at 11:00), closes the only defect the checksum cannot catch. Everything else in the 1852→2011 half is milder but the same shape — a swapped adjacent pair breaks the climb by a year or two, which is inside the noise of a half-remembered peg.

**Finding 2 — city is a forward-only channel.** City is not a key. **London** holds Big Ben (21:00) *and* Selfridges (06:00); **New York City** holds the Atlas clock (20:00) *and* Grand Central (03:00); France holds three (Lyon 18:00 · Nantes 22:00 · Paris 01:00). Clock → city is sound and always will be; "which clock is in London?" has no answer, and drilling cannot produce one, because the ambiguity is in the encoding rather than the retrieval. Either accept city as forward-only, or drill the duplicated cities **as pairs bound to their hours** ("London is Big Ben at 21 and Selfridges at 6") instead of as two independent facts. This is the sorted/unsorted channel split in [multi-attribute-encoding](./multi-attribute-encoding.md) §Rule B, showing up in a real set.

Neither finding needed a recall attempt — both fall out of arithmetic over the table above, which is the argument for computing where a checksum goes slack before drilling rather than after.

## How it composes

- **[calendar-memory](./calendar-memory.md)** — Clocks24 *is* its hour slot's frozen instantiation. Everything else in that page (SEM3+Major year, Jungian months, Georgian-animal days, peg-matrix minutes) composes with it unchanged.
- **[famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md)** ("Hours") — the sung realization of Clocks24: the poem-cycle set to music in hour order (00→23), number-led, built to loop (midnight → midnight). It teaches Layer 1 (hour→clock) and Layer 3 (story); the Layer-2 year pegs stay in the flashcard layer.
- **[clocks24-visual-render](./clocks24-visual-render.md)** — the *visual* realization of Clocks24: the 24 clocks as [Velvet Aeon](./world-velvet-aeon.md) watercolor field-journal pages, one per hour, each fusing all three layers (clock = central watercolor · Major-peg year = marginalia · poem stanza = annotation). The eye's twin of the song; it adds see→recall recognition and the fused founding year. Song (ear) + render (eye) are Clocks24's two externalized channels.
- **Anki** — build one deck for hour ↔ clock ↔ city (Layer 1) and a second for clock ↔ year via its Major peg (Layer 2); drill each to fluency before mixing, per [anki-reflex-deck-builder](./anki-reflex-deck-builder.md).

## Data & provenance

The canonical data is the `clocks.json` array in `DavidTbilisi/Clocks24` — one object per hour with the clock, its date, a Wikipedia link, an image, the Major peg, and the poem. As of 2026-07-03 the file still carries the pre-correction values for a few entries (07:00, 12:00, 03:00); the table above reflects David's corrections, and a corrected `clocks.json` is a pending follow-up.

## Related pages

- [calendar-memory](./calendar-memory.md) — the parent system; Clocks24 is its hour slot, frozen
- [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) — the "Hours" song, Clocks24 set to music
- [clocks24-visual-render](./clocks24-visual-render.md) — the "Hours" render set, Clocks24 as Velvet Aeon watercolor pages (the visual twin of the song)
- [mnemonic-methods-master](./mnemonic-methods-master.md) — the Major System (Layer 2) and the story/linking method (Layer 3)
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the *minute* encoder that sits beside this hour encoder in [calendar-memory](./calendar-memory.md)
- [UMTF](./universal-mental-tagging-framework.md) — why the three layers ride orthogonal channels
- [multi-attribute-encoding](./multi-attribute-encoding.md) — the full multi-attribute analysis of this set; Clocks24 is its worked instance
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — how to build the two drill decks
- [daily-planner-as-clock-palace](./daily-planner-as-clock-palace.md) — Clocks24 loaded as the schedule column of a daily planner
- [mnemonic-pin-password-encoding](./mnemonic-pin-password-encoding.md) — sibling application of the same number-image codes, to credentials instead of founding years

---

## U — See (CAST)
1. 24 real clocks, one per hour, sorted oldest→newest from noon
2. Three layers on one address: hour peg · Major-System year · poem-cycle

## D — Name (NEDF)
1. Clocks24 = David's frozen 24-clock hour palace + date store + story
2. Distinguisher: age-sorted (noon oldest → 11:00 newest); midnight = narrative bookend
3. Failure mode: collapsing the three layers, or drilling year pegs on the same channel as hour→clock

## F — Do (SPEAR)
1. Time-of-day → `HH` → clock (Layer 1); clock → Major peg → year (Layer 2)
2. Chain the clocks by walking the poem-cycle from midnight (Layer 3)

## B — Watch (HEART)
1. A year peg that breaks the 1392→2011 climb → the clock is misfiled
2. Can name the clock but not its year → Layer 2 deck under-drilled

## L — Predict (ORACLE)
1. All three layers installed → hour↔clock↔year recall in any direction, plus age-rank for free
2. Story skipped → the 24 buildings feel arbitrary and decay

## R — Act (GRACE)
1. Reverse lookup (clock→hour) slow → drill the shuffled Anki deck
2. A clock won't stick → re-anchor it inside its poem stanza, not in isolation

## Mnemonic

**Noon is oldest, midnight is the story.** Start at 12:00 with the oldest clock (Wells, 1392) and walk the hours forward as time marches to 2011 at 11:00; the wanderer's hunt begins and ends at the Philadelphia midnight.

## Checksum

1. Which hour holds the oldest clock, and which the newest? (12:00 = Wells, 1392; 11:00 = Makkah, 2011 — the age-ladder runs noon → 11:00.)
2. What are the three layers stacked on each hour? (Hour peg · Major-System founding year · poem-cycle stanza.)
3. Why is midnight special beyond being hour 0? (00:00 Philadelphia is the poem-cycle's bookend — both prologue and finale, where the wanderer reaches her and "the clocks fall silent.")
4. What self-checks the year layer? (The founding years climb monotonically along the hours; a peg that breaks the climb is misfiled.)
