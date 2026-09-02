---
palace: meta-knowledge
level: 4
domain: 10
room: 3
semantic_mode: 5
wiki_source: wiki/learning-systems/peg-audio-visual-matrix.md
---

# Peg Audio × Visual Matrix

**Summary**: 10 × 10 matrix that combines the rhyme peg (audio, tens digit) with the visual peg (units digit) into 100 multimodal percepts — one per number 00-99. Reusable wherever a 0-99 range needs single-percept retrieval at zero new-vocabulary cost. The minute slot of [calendar-memory](./calendar-memory.md) uses the first 6 rows (00-59); other applications use the full 100.

**Sources**:
- `raw/05 Meta_Knowledge/001 Memory__001 Peg.txt` (visual peg Anki import — 10 cards, 0-9)
- `raw/05 Meta_Knowledge/001 Memory__002 Peg sounds.txt` (rhyme peg Anki import — 10 cards, 0-9)
- `raw/Neural OS Book/Peg Visual.md` (background prose)
- `raw/Neural OS Book/Peg Audio.md` (background prose)

**Last updated**: 2026-07-02 — added [number-codec-ladder](./number-codec-ladder.md) consumer row and the 16×16 hex extension contract; the 12 extension pegs chosen and frozen (audio `A–F` = NATO phonetic: wolf · applause · tramp · river delta · bat · dancing fox; visual `A–F` = letterforms: tent · butterfly · crescent moon · bow · trident · flag)

---

## What This Page Is

A pure indexing structure. Each cell is a two-digit number `NN`; the cell *content* (the actual percept) lives in the two Anki decks named `peg` and `peg audio`. This page never duplicates deck content — if a card changes, this page does not need to change.

The encoding format:

```
NN = tens × 10 + units    where NN ∈ [00, 99]
tens  ∈ {0..9}   →  peg audio deck (rhyme peg), card N
units ∈ {0..9}   →  peg deck (visual peg), card N
```

The retrieved percept is a **multimodal binding**: the rhyme-peg sound layered on the visual-peg image. The brain integrates audio + visual into one perceptual unit, so retrieval feels like one image even though it is generated from two pegs.

Both source decks have exactly 10 cards (0-9), so the full Cartesian product is 10 × 10 = 100 cells. Range-restricted applications (e.g. minutes 0-59) consume a sub-rectangle of the matrix without affecting the rest.

## The Matrix

Rows = tens digit (audio peg index). Columns = units digit (visual peg index). Cell = the encoded `NN`.

| audio \ visual | **0** | **1** | **2** | **3** | **4** | **5** | **6** | **7** | **8** | **9** |
|---|---|---|---|---|---|---|---|---|---|---|
| **0** (audio[0]) | 00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 |
| **1** (audio[1]) | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
| **2** (audio[2]) | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
| **3** (audio[3]) | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
| **4** (audio[4]) | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 |
| **5** (audio[5]) | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 |
| **6** (audio[6]) | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 |
| **7** (audio[7]) | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 |
| **8** (audio[8]) | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 |
| **9** (audio[9]) | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 |

**Range restrictions per consumer**: each consumer of this matrix uses whichever sub-rectangle its range demands. The matrix itself stays at 10 × 10 — restrictions are documented at the consumer, not at the matrix.

| Consumer | Range | Rows used |
|---|---|---|
| [calendar-memory](./calendar-memory.md) minute slot | 00-59 | 0-5 (rows 6-9 unused) |
| [number-codec-ladder](./number-codec-ladder.md) L3 deep-pack object slots (2 cells per 5-digit scene) | 00-99 | full matrix |
| (future) seconds | 00-59 | 0-5 |
| (future) percentages | 00-99 | full matrix |
| (future) page numbers, ages, two-digit IDs | 00-99 | full matrix |

## Retrieval

**Forward** (number → percept):
1. Read `NN`.
2. `tens = NN // 10`, `units = NN % 10`.
3. Look up `audio[tens]` and `visual[units]` from your Anki decks.
4. Bind the rhyme sound onto the visual image. That is the percept.

**Reverse** (percept → number):
1. Identify the rhyme sound → tens.
2. Identify the visual image → units.
3. `NN = tens × 10 + units`.

## Filled-In Cells

For all 100 cells fully bound into REMAPS-encoded scenes (one impossible object per cell, with motion and sensation), see [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md). That page is the materialized cell-content layer; this page stays focused on structure, retrieval, and consumer registry.

## Worked Examples

Using your actual deck content (only `audio[0]` and `visual[0]` are currently exposed in the import files; the rest live in image attachments or are skeleton placeholders to be filled):

| `NN` | tens | units | Percept (full text in [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md)) |
|---|---|---|---|
| `00` | 0 | 0 | Hero × Donut — "a generic cape hero dives through a giant donut portal, frosting splashing outward" |
| `30` | 3 | 0 | Tree × Donut — "a tree grows through the hole of a giant donut, branches covered in frosting" |
| `47` | 4 | 7 | Door × Axe — "an axe is mounted across a door like a bold warning sign" |
| `52` | 5 | 2 | Hive × Swan — "a swan carries a buzzing hive on its back across a pond" |
| `83` | 8 | 3 | Gate × Sideways Heart — "a gate has a sideways heart-shaped lock glowing at its center" (out of scope for minutes; full-range consumers only) |
| `99` | 9 | 9 | Vine × Balloon — "a vine ties itself to a balloon and climbs upward into the sky" (out of scope for minutes) |

Full 100-cell descriptions live on [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md).

## Stable Peg Set

The 10 audio + 10 visual pegs below are **frozen** as the canonical naming for this matrix. All cells in [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) are built from this exact set; the underlying Anki decks (`peg`, `peg audio`) should be filled to match.

**Audio pegs (rhyme, tens digit)**:

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Hero | Sun | Shoe | Tree | Door | Hive | Sticks | Heaven | Gate | Vine |

**Visual pegs (shape/object, units digit)**:

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Donut | Magic Wand | Swan | Sideways Heart | Sail | Hook | Cartoon Bomb | Axe | Hourglass | Balloon |

**Conventions** (load-bearing):

- **Hero** is the generic cape archetype, not Superman or any branded character.
- **Cartoon Bomb** is the comic-style visual symbol (round black ball with a sparking fuse), not a realistic weapon. All bomb cells use harmless / comic / absurd framing.

Drift toward branded or realistic imagery is a regression — refactor the offending cell in [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md).

### 16×16 extension contract (hex cells)

Registered 2026-07-02 for [number-codec-ladder](./number-codec-ladder.md) §Wide pack Stage 1b. The frozen 10×10 core above is **untouched**; indices `A–F` on each axis (audio 10–15, visual 10–15) are extension slots, taking the matrix to 16×16 = 256 cells — one percept per **byte** `00–FF`. Rules: (1) existing cell assignments never change — this is extension, not modification; (2) **cells encode symbol pairs; the radix is carried by the consumer's mode, never by the image** (cell `47` is decimal forty-seven to a decimal consumer and 0x47 to a hex consumer — same percept, exactly as soroban rods hold digits while base is an overlay); (3) the 12 extension pegs below (user-chosen 2026-07-02, collision-checked against every installed image family) are **frozen** like the core set, and the extension is usable once they are drilled to the same atomic floors.

**Audio extension pegs (hex tens, `A`–`F`) — NATO phonetic.** The rhyme scheme cannot extend to letters (B/C/D/E all rhyme "-ee" — zero discriminability), so the letter rows switch to the radio alphabet, which is engineered for auditory distinctness and pre-installed for networking/cybersec use:

| `A` | `B` | `C` | `D` | `E` | `F` |
|---|---|---|---|---|---|
| Alpha — gray wolf, howling | Bravo — thunderous applause, standing ovation | Charlie — silent-film tramp (bowler hat + cane) | Delta — river delta from above, branching water triangle | Echo — bat (echolocation) | Foxtrot — fox, dancing |

**Visual extension pegs (hex units, `A`–`F`) — letterform objects.** Same logic as donut=0 / wand=1 / swan=2: the object *is* the letter's shape:

| `A` | `B` | `C` | `D` | `E` | `F` |
|---|---|---|---|---|---|
| Tent (A-frame) | Butterfly, wings folded (stacked loops) | Crescent moon, glowing | Archery bow, string as the straight stroke | Trident (E rotated) | Red flag (pole + two arms) |

**Conventions** (load-bearing, same force as the core set's):

- **Charlie is the generic tramp archetype**, not Chaplin — identical rule to "Hero is the generic cape archetype, not Superman."
- **Canine guard**: Alpha wolf vs Foxtrot fox disambiguate by color + motion — *gray and howling* vs *orange and dancing* (the bowl-silhouette precedent from the alphabet food pegs).
- **Crescent guard**: the moon *glows in a night sky*; the croissant (food peg `C`) is baked, on a plate — silhouette-similar, never role-adjacent.
- **Flag guard**: visual-`F` is *the* generic red flag; country flags belong to the world-flags deck and never serve as this peg.

Sample bytes: `0xA3` = Alpha-wolf × Sideways Heart · `0xEB` = Echo-bat × Butterfly · `0xFF` = Foxtrot-fox × Flag (*a fox dancing while waving a flag*) · `0x4F` = Door × Flag — mixed digit-letter pairs compose across core and extension pegs seamlessly. Mnemonic for the split: **"Radio says the tens, shape shows the units."**

Sample fully-resolved cells under the stable set:

- `00` → Hero × Donut → "a generic cape hero dives through a giant donut portal" (cell 00)
- `13` → Sun × Sideways Heart → "a sideways heart burns like a small sun" (cell 13)
- `47` → Door × Axe → "an axe is mounted across a door like a bold warning sign" (cell 47)
- `58` → Hive × Hourglass → "honey drips through an hourglass instead of sand, bees buzzing inside" (cell 58)

Full 100-cell index: [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md).

## Pass Criteria

| Skill | Pass-floor |
|---|---|
| Single audio peg recall (0-5) | <1s |
| Single visual peg recall (0-9) | <1s |
| Multimodal percept binding (one cell) | <1.5s |
| Forward (minute → percept) | <2s |
| Reverse (percept → minute) | <2s |
| Mixed drill, both directions | <3s composite |

Drill atomic pegs first (10 audio + 10 visual = 20 cards). Once each clears its floor, drill the 60-cell matrix mixed. Do not skip the atomic stage — the multimodal binding only stabilizes if both pegs are independently fluent.

## Why This Matrix

**Compression**: 100 percepts (00-99) from 20 atomic items — a 5× compression ratio. Both decks already exist, so installation cost is zero new vocabulary. Compare to a flat Major-100 deck (100 installs) or any single-modality 0-99 system.

**Orthogonality**: audio sub-channel + visual sub-channel are both [UMTF](./universal-mental-tagging-framework.md) Sensory tags but perceptually distinct enough to function as independent retrieval dimensions. In the [calendar-memory](./calendar-memory.md) stack, the audio dimension is unused by every other encoder (year, month, day, hour are all visual / archetypal / locational), so the minute consumer of this matrix occupies a clean channel.

**Anki-first discipline**: structure on this page, content in the deck. The page survives any deck rewrite.

**Range-flexible**: consumers pick the sub-rectangle they need. A 0-59 consumer (minutes, seconds) uses rows 0-5. A 0-99 consumer uses the full matrix. The matrix itself is consumer-agnostic.

## Diagrams

The 10×10 indexing grid (rows = audio peg / tens digit, columns = visual peg / units digit) with the minutes sub-rectangle highlighted, three example cells (13, 47, 58), and the binding walkthrough on the right:

![peg-matrix schematic](../diagrams/17-peg-audio-visual-matrix.png)

<!-- Hero illustration to be regenerated: apothecary-cabinet metaphor (10×10 windowed compartments, sound-icons on row margins, object-icons on column margins, docent at one binding cell). The first generation completed but the ChatGPT A/B image-preference workflow didn't trigger a save-to-disk; resubmit prompt and place at diagrams/heroes/peg-audio-visual-matrix.png. -->


## Capacity-subtracting consumers

This matrix has finite capacity (100 cells). Consumers that **reserve cells for non-digit purposes** subtract from the digit pool. Document each such reservation explicitly so the user knows which cells are still available for ad-hoc encoding:

- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — STEM users encoding physical constants may reserve up to ~6 cells for operator icons (decimal point, minus, exponent arrows, repetition marker, approximation). Each reserved cell is removed from the digit pool. Discipline rule on that page: ≤6 reservations total to keep the pool usable.

When a future consumer surfaces (e.g. unit-icons for kg/m/s, mathematical-relation icons for `=`/`<`/`>`/`∈`), it belongs here as a sibling so the running tally of reserved cells stays visible.

## Related Pages

- georgian-driving-exam-b-numeric-table — worked consumer: speed limits, gap grid, and distance cells encoded via pegs from this matrix (Phase 1 of the B/B1 learning protocol)
- [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) — all 100 cells filled with REMAPS-encoded scenes
- [calendar-memory](./calendar-memory.md) — primary consumer (minute slot, rows 0-5)
- [UMTF](./universal-mental-tagging-framework.md) — sensory sub-channel rationale
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — for building the `peg`, `peg audio`, and `peg matrix` decks
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — capacity-subtracting consumer reserving cells for operator icons


---

## U — See (CAST)
1. 10×10 audio-visual peg matrix → 100 multimodal percepts
2. Rhyme peg (tens) + visual peg (units)

## D — Name (NEDF)
1. Peg audio-visual matrix = 0-99 dual-modality peg set
2. Distinguisher: zero new-vocabulary cost
3. Failure mode: using only one modality

## F — Do (SPEAR)
1. Number 0-99 → combined peg
2. Scene → bind percept

## B — Watch (HEART)
1. Single-modality drift
2. Peg collision

## L — Predict (ORACLE)
1. Number → predict peg
2. Peg → predict modality combo

## R — Act (GRACE)
1. Need 0-99 percepts → use matrix
2. Calendar minute → use first 6 rows