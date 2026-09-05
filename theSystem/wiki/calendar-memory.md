---
palace: strategic-memory
level: 3
domain: 10
room: 3
semantic_mode: 5
wiki_source: wiki/learning-systems/calendar-memory.md
---

# Calendar Memory

**Summary**: Single operating method for encoding any year, month, day, and time-of-day as one composite scene. Each scale uses a different encoder so the four channels stay orthogonal under [UMTF](./universal-mental-tagging-framework.md) and any datetime collapses into one retrievable image.

**Sources**:
- raw/Neural OS Book/Calendar.md
- raw/Neural OS Book/Months.md
- [sem3](./sem3.md) — owner page for the year slot's encoder; `raw/Neural OS Book/SEM3.md` is the format spec behind it
- raw/03 Tactical_Memory/Jungian 12 Archetypes as Month Mnemonics.md

**Last updated**: 2026-09-03 ([SEM3](./sem3.md) now has an owner page, so the year slot links to a method rather than to a raw source; the deck inventory's two SEM3 `TODO` rows were false and are flipped to the decks that actually exist, plus the new production deck); 2026-09-02 (the multi-attribute pattern named here now has an owner page — [multi-attribute-encoding](./multi-attribute-encoding.md)); 2026-05-09

---

## What This Page Is

This is the operating method for calendar memory. It is not a replacement for a digital calendar; it is the encoding spec that lets any datetime live as one mental scene rather than four disconnected numbers.

A datetime has four scales (year, month, day, time-of-day). Each scale uses a different encoder so they ride on orthogonal [UMTF](./universal-mental-tagging-framework.md) channels and never collide. The encoders are deliberately heterogeneous — numerical for year, archetypal for month, alphabetic for day, spatial for time — because heterogeneity is what keeps the channels independent.

## The Four-Scale Encoding

| Scale | Encoder | What it produces | Drill |
|---|---|---|---|
| **Year** (4 digits) | [SEM3](./sem3.md) + Major | sensory prefix `CI` + Major image `XX` | SEM3 prefix Anki deck + Major suffix Anki deck |
| **Month** (1-12) | [Jungian 12 archetypes](./jungian-12-archetypes-as-month-mnemonics.md) | one fixed archetype scene per month | Jungian-month Anki deck (12 cards) |
| **Day** (1-31) | [Georgian animal](./georgian-animals.md) | first 31 letters of the Georgian alphabet, one animal per day | Georgian-animals Anki deck, 1-31 subset |
| **Time-of-day** (HH:MM) | famous clocks (hour) + peg audio × peg matrix (minute) | 1 of 24 famous clocks for the hour (0-23, direct map to `HH`); 1 multimodal percept (rhyme peg × visual peg) for the minute, 1-minute resolution | Famous-clocks Anki deck + `peg` + `peg audio` decks |

## Year — SEM3 + Major

A year is a 4-digit chunk and goes through SEM3 unchanged: first two digits become a sensory `CI` prefix (category × 10 + item), last two become a Major peg `XX` (00-99).

Example: **1859** → `18` (Sound, item 8) + `59` (Major peg) → one scene where sound-8 is the atmosphere and Major-59 is the prop.

This page does not redefine SEM3 or the Major system. Drill them via dedicated Anki decks; for the method itself, see the owner page.

- Owner page: [sem3](./sem3.md) — the `CI` + `XX` format, and the derivation rule that makes the prefix grid cheap (the item digit is its own first Major consonant, so 80 of the 100 cells regenerate rather than being stored)
- Format reference: `raw/Neural OS Book/SEM3.md`
- **SEM3 prefix decks** — `001 Memory::015 Beyond 100 (SEM3)` (99 cards, cell ↔ item) and `001 Memory::017 SEM3 + Major` (100 cards, merged prefix + prop). Both exist and carry review history
- **SEM3 production deck** — `tools/reflex-anki/examples/sem3_reflexes.yaml`, 31 cards drilling 4-digit → scene and scene → 4-digit under time pressure, plus the rule and its two ordinal exceptions
- **Major suffix deck** — 100 cards covering all `XX` 00-99 pegs (build with `tools/reflex-anki`)

The page-author rule: never inline SEM3 prefix tables or Major peg tables on calendar pages — always link to the deck.

## Month — Jungian 12 Archetypes

Fixed mapping, do not relabel: January = Innocent, February = Lover, March = Hero, April = Caregiver, May = Explorer, June = Creator, July = Ruler, August = Magician, September = Sage, October = Everyman, November = Jester, December = Outlaw.

Full scene definitions: [jungian-12-archetypes-as-month-mnemonics](./jungian-12-archetypes-as-month-mnemonics.md).

Drill: 12-card Anki deck, month name ↔ archetype scene.

## Day — Georgian Animal

Days 1-31 map to the first 31 letters of the Georgian alphabet, each carrying its CAST animal. Day 1 = ა Eagle, day 2 = ბ Owl, ..., day 15 = პ Panther, ..., day 31 = ხ Hyena. Letters 32-33 (ჯ Jaguar, ჰ Horse) are unused for calendar purposes.

Full table: [georgian-animals](./georgian-animals.md).

Drill: the Georgian-animals deck already covers all 33 entries; drill the 1-31 subset for day-number fluency.

## Time-of-day — Famous Clocks + Compass

Two slots, composed: hour rides on a clock identity, minute rides on a compass direction.

### Hour (0-23) → famous clock

One stable list of 24 clocks, never reassigned. The index matches `HH` directly: hour 0 = midnight, hour 12 = noon, hour 23 = 11pm. No modular arithmetic. Each clock has its own location, name, and era — those attributes come along for free (this is the [multi-attribute pattern](./multi-attribute-encoding.md) built on [UMTF](./universal-mental-tagging-framework.md)'s channels: location → spatial channel, name → primary scene, era → temporal channel, hand position → state channel — four attributes carried free because four channels were empty).

**David's frozen instantiation of this slot is [clocks24](./clocks24.md)** — the real 24-clock list, with each clock's founding year encoded in the Major System and a poem-cycle over the set. The table below is the original *suggested* anchor list (swap any entry for a clock you know better, but freeze once chosen). Aim for visual distinctiveness — avoid two clocks of the same architectural type next to each other:

| Hour | Clock | City | Visual hook |
|---|---|---|---|
| 0 | Big Ben | London | Westminster tower at midnight |
| 1 | Spasskaya Tower | Moscow | red Kremlin tower, gold star |
| 2 | Prague Astronomical Clock | Prague | medieval blue + gold dial, parading apostles |
| 3 | Rajabai Clock Tower | Mumbai | Venetian Gothic spire |
| 4 | Makkah Royal Clock Tower | Mecca | tallest clock tower, four faces |
| 5 | Zytglogge | Bern | medieval gate clock with figures |
| 6 | Grand Central Terminal Clock | New York | brass four-face on info booth |
| 7 | Allen-Bradley Clock | Milwaukee | factory's giant four-face |
| 8 | Cosmo Clock 21 | Yokohama | Ferris wheel that *is* the clock |
| 9 | Torre dell'Orologio | Venice | St. Mark's blue + gold zodiac |
| 10 | Shepherd Gate Clock | Greenwich | 24-hour dial, GMT origin |
| 11 | Strasbourg Astronomical Clock | Strasbourg | Renaissance figures parading |
| 12 | Munich Glockenspiel | Munich | dancing figures at noon |
| 13 | Wells Cathedral Clock | Wells | jousting knights every hour |
| 14 | Corpus Clock | Cambridge | gold disk + Chronophage grasshopper |
| 15 | Eastgate Clock | Chester | ornate ironwork over a stone arch |
| 16 | Flower Clock | Geneva | clock made of living flowers |
| 17 | Wako Clock Tower | Tokyo (Ginza) | art-deco department-store landmark |
| 18 | Wrigley Building Clock | Chicago | white terracotta tower |
| 19 | Sahat Kula | Sarajevo | Ottoman lunar clock |
| 20 | Custom House Tower | Boston | early American skyscraper clock |
| 21 | Conciergerie Clock | Paris | oldest public clock in Paris (1370) |
| 22 | Royal Liver Building Clock | Liverpool | Liver Birds on top |
| 23 | Salisbury Cathedral Clock | Salisbury | oldest working mechanical clock in the world |

Drill: famous-clocks Anki deck — hour ↔ clock ↔ city ↔ era, mixed direction.

Melodic companion: [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) encodes all 24 clocks as a single time-loop story-song with the hours in order 0→23 — a second retrieval channel (melody + narrative) that installs the ordered chain the shuffled deck doesn't train. Drill the deck for bidirectional speed; play the song to lay down the sequence.

### Minute → peg audio × peg matrix

Full structure on [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) (the 10 × 10 generic encoder). Minutes are a **range-restricted consumer** of that matrix: minutes max at 59, so only the first 6 rows (audio pegs 0-5) are used. Rows 6-9 of the matrix are untouched here and remain available for other 0-99 consumers (page numbers, percentages, ages, two-digit IDs).

| Dimension | Range | Deck | Cards used |
|---|---|---|---|
| **Tens** (0-5) | 6 values | `peg audio` (rhyme peg) | first 6 entries (rows 0-5 of the matrix) |
| **Units** (0-9) | 10 values | `peg` (visual peg) | all 10 entries (full column span) |

Each minute is one **multimodal percept** — the rhyme sound and the peg image bound into a single integrated unit. The brain integrates audio + visual into one perceptual chunk, so retrieval feels like one image even though it is generated from two pegs.

This page does not redefine either [peg system](./peg-system.md). Drill from the existing Anki decks:

- **`peg`** — visual peg deck (shape / symbolic / stable-object pegs). Source: `raw/05 Meta_Knowledge/001 Memory__001 Peg.txt` (Anki tab-import file, 10 cards 0-9). Background prose: `raw/Neural OS Book/Peg Visual.md`.
- **`peg audio`** — rhyme peg deck (e.g. 0 = Hero / Superman, with imagery on each card). Source: `raw/05 Meta_Knowledge/001 Memory__002 Peg sounds.txt` (Anki tab-import file, 10 cards 0-9, image-backed). Background prose: `raw/Neural OS Book/Peg Audio.md`.

Same Anki-first discipline as SEM3: the calendar page never duplicates peg content — the deck is the source of truth.

Why this replaces the compass-for-minute approach:

| | Compass + finger (old) | Peg audio × peg (new) |
|---|---|---|
| Resolution | ~7.5min | 1min |
| Retrieval steps | 2 (compass anchor → finger count) | 1 (multimodal percept) |
| New installs | finger system + compass | none — both decks already exist |
| UMTF channel | spatial (collides with month/day) | sensory-audio + sensory-visual (orthogonal to every other calendar component) |
| Boundary ambiguity | "is :08 NE or N+1?" | none |

The compass remains the right tool for trig (see [trigonometry-compass-palace](./trigonometry-compass-palace.md)) — it is only retired from the calendar method, not deleted.

## Composing a Datetime

Walk from largest to smallest scale and let each component land in its own [UMTF](./universal-mental-tagging-framework.md) channel:

**Example: 1859-03-15 14:30**

- year `1859` → SEM3(`18` sound-8 + `59` Major prop)
- month `March` → Hero archetype
- day `15` → Panther (პ)
- hour `14` (= 2pm) → Corpus Clock (Cambridge)
- minute `30` → tens=3 × units=0 → rhyme-peg[3] × visual-peg[0]

Composed scene: *"the Hero (March) leads a 15-day Panther through Cambridge to face the gold Chronophage of the Corpus Clock as it strikes 14:00, the rhyme-peg[3] sound ringing through the visual-peg[0] image at the clock's foot, while the sound-8 ram with the Major-59 prop crashes past behind them."*

(The actual rhyme-peg[3] sound and visual-peg[0] image are whatever lives in your `peg audio` and `peg` Anki decks — the calendar page deliberately does not pin them down.)

Recall is bidirectional:
- date+time → walk the scene → read each channel
- scene → decompose to date+time

## Anki Deck Inventory

This method depends on six decks. Some already exist; the rest are the build queue.

| Deck | Status | Cards | Notes |
|---|---|---|---|
| Major suffix (00-99) | TODO | 100 | prerequisite for [SEM3](./sem3.md) |
| SEM3 prefix (CI 00-99) | **exists** — `015 Beyond 100 (SEM3)` | 99 + `00` fill | sensory category × item; `00` = Vision · Snow, added 2026-09-03 to close the grid |
| SEM3 + Major merged | **exists** — `017 SEM3 + Major` | 100 | prefix + prop on one note; `Number / SEM3 / MajorWord / MajorImage` |
| SEM3 production reflexes | **exists** — `tools/reflex-anki/examples/sem3_reflexes.yaml` | 31 | 4 digits → scene and back, timed; drills the rule rather than the cells |
| Jungian months | TODO | 12 | month ↔ archetype |
| Georgian animals | exists (CAST) | 33 | drill 1-31 subset for day fluency |
| Famous clocks | TODO | 24 | hour (0-23) ↔ clock ↔ city ↔ era ↔ visual hook; melodic companion [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) |
| `peg` (visual) | exists | 10 (0-9) | minute units (0-9); source: `raw/05 Meta_Knowledge/001 Memory__001 Peg.txt` |
| `peg audio` (rhyme) | exists | 10 (0-9) | minute tens (0-5 = first 6 entries); source: `raw/05 Meta_Knowledge/001 Memory__002 Peg sounds.txt` |

Build new decks with `tools/reflex-anki` per [anki-reflex-deck-builder](./anki-reflex-deck-builder.md). Drill per-component first; only mix once each component clears its own pass-floor.

## Optional Overlay: 52-Card Year

The original calendar source defines an optional 52-card week-of-year overlay:

- `Clubs` = January-March
- `Hearts` = April-June
- `Spades` = July-September
- `Diamonds` = October-December

Within each suit, `Ace`-`King` map the thirteen weeks of that quarter. Useful when you want quarter awareness or week-of-year recall on top of the four-scale encoding above. Skip if a single layer is enough.

## How To Use It

- Keep the external calendar as the source of truth.
- Use this encoding to preload the current month and coming week into mental form.
- Attach important dates (birthdays, deadlines, payments, anchor events) inside the composite scene rather than as floating numbers.
- Review the month at start, midpoint, and end so the structure stays live.
- If one mnemonic layer is enough for your purpose, stop there. Do not stack systems just because you can.

## Related Pages

- [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) — the 24-clock hour system rendered as a memorization story-song
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — full structure of the minute encoder
- [jungian-12-archetypes-as-month-mnemonics](./jungian-12-archetypes-as-month-mnemonics.md)
- [georgian-animals](./georgian-animals.md)
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- psychology-os-framework
- [trigonometry-compass-palace](./trigonometry-compass-palace.md) — compass lives here for trig; not used in this method
- Systems for Calculating Calendar Dates
- [daily-planner-as-clock-palace](./daily-planner-as-clock-palace.md) — the hour-slot rendered as an actual, usable day planner


---

## U — See (CAST)
1. Single operating method for encoding any year/month/day/time-of-day
2. Each scale uses different encoder so channels stay orthogonal

## D — Name (NEDF)
1. Calendar memory = full datetime encoder
2. Distinguisher: orthogonal channels under UMTF
3. Failure mode: collapsing scales onto one encoder

## F — Do (SPEAR)
1. Datetime → split into year/month/day/time
2. Encode each scale via its encoder → bind into composite scene

## B — Watch (HEART)
1. Scale collapse
2. Composite collision

## L — Predict (ORACLE)
1. Date → predict composite scene
2. Scene → predict date components

## R — Act (GRACE)
1. Date encoding → use method
2. Composite weak → check channel orthogonality