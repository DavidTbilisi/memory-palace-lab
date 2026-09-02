---
palace: tactical-memory
level: 5
domain: 10
room: 7
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/clocks24-visual-render.md
---

# Clocks24 Visual Render

**Summary**: The **visual** realization of [clocks24](./clocks24.md) — the 24 clocks rendered as a coherent set of [Velvet Aeon](./world-velvet-aeon.md) Environment watercolor field-journal pages, one per hour. It is to the eye what ["Hours"](./famous-clocks-mnemonic-song.md) is to the ear: the visual twin of the sung realization, and the worked instance that satisfies the **visual channel** of the [Render / Externalization layer](./framework-comparison-matrix.md). Each page carries all three Clocks24 layers at once — the clock building (hour peg), a fused Major-System year hook (the marginalia sketch), and the poem-cycle stanza (the handwritten annotation).

**Sources**:
- [clocks24](./clocks24.md) — the frozen 24-clock system: hour → clock → city → founding year → Major peg → poem stanza. All clocks, years, and Major pegs are taken verbatim from its table; poem fragments from its `clocks.json`.
- [image-pipeline](./image-pipeline.md) — the two-stage `transform → render` pipeline this instantiates: [REMAPS](./remaps.md) (Stage 1) → [CLAMP](./clamp-render-lens.md) (Stage 2) → image-gen.
- [Velvet Aeon](./world-velvet-aeon.md) — the default visual-style world; its **Environment** sub-mode + **Explorer's Diary** presentation frame + **Naturalist Precision Rule** set the render register.
- Authored artifact (2026-07-03 session); the render *specs* are original, the pegs are not. Actual watercolors are David's to generate (he picks the images), exactly as the "Hours" audio is his to render in Suno.

**Last updated**: 2026-07-03

---

## Why this exists

[clocks24](./clocks24.md) is a **three-channel** system — three encoders stacked on one address (hour peg · Major-System year · poem-cycle). Two channels already have a realization:

- the **Anki deck** drills hour ↔ clock ↔ city for fast, bidirectional, shuffled recall (verbal);
- ["Hours"](./famous-clocks-mnemonic-song.md) installs the ordered 00→23 chain and the poem-cycle (auditory).

The clocks are **real buildings** — and the third channel, *vision*, had no realization. This page is it. It is the worked instance the [Render / Externalization layer](./framework-comparison-matrix.md) falsifier demanded for the visual channel: a case where the externalized artifact adds a retrieval path the mental scene alone cannot hold (see [[#What the render adds — the falsifier, satisfied]]).

## The convergence — Clocks24's poem-world *is* Velvet Aeon

The visual channel's default world loads for free here, because [Velvet Aeon](./world-velvet-aeon.md) and the [clocks24](./clocks24.md) poem-cycle independently landed on the same aesthetic:

> Velvet Aeon: *"Colossal clocktowers rise from the dunes like abandoned gods, gears still turning long after civilization disappeared. Time is physical there… trapped inside old bells and broken mirrors."* (source: [world-velvet-aeon](./world-velvet-aeon.md))
>
> Clocks24 poem-cycle: *"a wanderer chasing his lost love, whose soul is shattered, scattered through clocks across the world."* (source: [clocks24](./clocks24.md))

Both are **clocktowers + a lost love + time-as-grief**. The five Velvet Aeon preserves (*sacred memory · cosmic loneliness · romantic ruin · sorrow as guidance* — and the wanderer as the lone Mortal figure) are the poem's own themes. So the Clocks24 render is not a style choice imposed on the system; it is the system's own world made visible.

## The render system — one artifact, three layers per page

All 24 render through **one shared profile**, so the set reads as a single object — *the lost explorer's journal of the world's 24 clocks* — the visual analogue of the single looping song.

- **Sub-mode**: [Velvet Aeon](./world-velvet-aeon.md) **Environment** (wide, pre-modern architecture in elegant decay, sky huge, the wanderer tiny against scale).
- **Presentation frame**: **Explorer's Diary** — every clock is a watercolor page on aged cream-sepia paper, ink line work, period-script marginalia. This frame is load-bearing, because its three page-elements map exactly onto Clocks24's three layers:

| Clocks24 layer | Explorer's-Diary page element | Carries |
|---|---|---|
| **Layer 1 — hour peg** | the **central watercolor** — the clock building itself, period-correct | *which clock = which hour* (see → recall) |
| **Layer 2 — Major-System year** | a **corner marginalia ink-sketch** — the clock's Major peg drawn as a naturalist specimen study | *the founding year*, fused into the image |
| **Layer 3 — poem-cycle** | the **handwritten margin annotation** — the clock's poem stanza in the wanderer's first-person voice | *the narrative link* to the next clock |

Fusing the Major peg as the *marginalia sketch* is a [REMAPS](./remaps.md) **Associate/Merge** move: the year-word-image (e.g. Big Ben 1859 = *Tough Lip*) is welded to the building without polluting the main scene's naturalism — the [Naturalist Precision Rule](./world-velvet-aeon.md) wants those corner detail-studies anyway. One page therefore encodes hour, year, and story simultaneously — the multimodal binding [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) describes, applied to Clocks24.

## Three worked pages

Complete [REMAPS](./remaps.md)→[CLAMP](./clamp-render-lens.md) specs for the two anchors + one famous face. The remaining 21 follow the same recipe (central clock · marginalia Major-peg · annotation stanza). Building — the actual watercolor — is David's to generate.

### 12:00 — Wells Cathedral (1392, *DuMB Nun*) · the noon anchor / oldest

> **[Velvet Aeon — Environment · Explorer's Diary]**
>
> **Central watercolor**: the medieval astronomical clock face of Wells Cathedral — a 24-hour dial, sun and moon, the oldest surviving original clock mechanism — set in weathered Somerset stone, half in velvet shadow, half in pale-gold candle-dawn. A single tiny robed wanderer stands far below in the nave, dwarfed by the dial. Gold dust hangs in the still air.
> **Marginalia (corner ink-sketch)**: a naturalist specimen study of a **silent nun**, one finger raised to veiled lips — mute, "dumb" — labelled in period script. *(the Major peg* DuMB Nun *= 1392)*
> **Annotation (margin, faded brown ink, copperplate)**: *"Day I — the oldest dial still turns, though no clockmaker remains. It points me east, toward Venice."*
>
> M (override): watercolor on aged cream-sepia paper, 19th-c. explorer's field-journal; layered washes in the Velvet Aeon palette; fine ink line beneath; deckle edge, fold line, tea-spot. References: Merian, Audubon, Viollet-le-Duc (for the masonry).
> L: single candle-dawn from frame-left; deep velvet shadow right; no fill.
> C: 24–35mm wide, deep focus, patient stillness; wanderer tiny.
> A: `1536×1024` HD landscape.
> P — Preserve: period-correct Gothic masonry (visible coursing, weathering) · the 24-hour dial legible · palette locked (pale gold · velvet black · white) · *sacred memory + romantic ruin* active · the silent-nun marginalia exactly one figure. No: modern anything · daylight-clean · saturated color · vector line · named-pantheon iconography · glossy digital finish.

### 21:00 — Big Ben (1859, *Tough Lip*)

> **[Velvet Aeon — Environment · Explorer's Diary]**
>
> **Central watercolor**: the Elizabeth Tower at deep dusk over a half-drowned Westminster; the great illuminated dial the one warm light against a velvet-black sky; the wanderer a tiny silhouette on the bridge below, watching the hands. Mist off the river; gold dust in the lamplight.
> **Marginalia (corner ink-sketch)**: a specimen study of a grim, **set, tough lower lip** — a mouth drawn with anatomical precision, jaw clenched — labelled in period script. *(the Major peg* Tough Lip *= 1859)*
> **Annotation**: *"Day XXII — her face was in the dial for a moment, then the bell struck and she was gone."* *(the clock's* clocks.json *stanza)*
>
> M (override): watercolor field-journal on aged paper, Velvet Aeon palette, ink line beneath, aged-paper character.
> L: the dial as single warm source; velvet-black sky; river mist catching lamplight; no fill.
> C: 28mm wide, deep focus; tower fills the vertical, wanderer tiny on the bridge.
> A: `1536×1024` HD landscape.
> P — Preserve: period-correct Gothic-Revival stonework · dial legible and luminous · palette locked · *sacred memory + cosmic loneliness* active · marginalia lip anatomically exact. No: daylight · modern traffic/signage · neon · cheerful color · glossy finish · vector line.

### 00:00 — Philadelphia City Hall (1898, *Dive Buffet*) · midnight / the story's bookend

> **[Velvet Aeon — Environment · Explorer's Diary]**
>
> **Central watercolor**: the City Hall tower under a black sky, its clock **bleeding faint green light** (the poem's own image) down over a deserted square; the wanderer setting out — or arriving — small at the tower's foot. The green glow is the one intensified element against the locked palette.
> **Marginalia (corner ink-sketch)**: a specimen study of a shabby **dive-bar buffet** — a mean spread on a stained cloth — labelled in period script. *(the Major peg* Dive Buffet *= 1898)*
> **Annotation**: *"At midnight in Philadelphia, the City Hall Clock bleeds green light. He walks not for glory, not for gold — he walks for a soul, his love, shattered, scattered through clocks across the world."* *(the poem-cycle bookend, verbatim from* [clocks24](./clocks24.md)*)*
>
> M (override): watercolor field-journal, Velvet Aeon palette *plus* the single green accent (the bleeding dial), ink line beneath, aged paper.
> L: cold green dial-glow as the one source over a velvet-black square; no fill.
> C: 24mm wide, deep focus; tower towering, wanderer tiny at its foot.
> A: `1536×1024` HD landscape (or `2560×1440` 2K — this is the bookend, worth the premium).
> P — Preserve: pre-1900 architecture · the green glow as the sole intensified element · palette otherwise locked · *sorrow as guidance + cosmic loneliness* active · marginalia legible. No: modern city lights · cars · daylight · extra color · glossy finish.

## The full set — render note per clock

Every hour follows the recipe: **central clock (Layer 1) · marginalia = the Major peg drawn as a specimen (Layer 2) · annotation = the** `clocks.json` **stanza (Layer 3)**. The Major pegs below are from [clocks24](./clocks24.md); they are what each corner sketch depicts.

| Hour | Clock | Year | Major peg → marginalia specimen |
|--|--|--|--|
| 12:00 | Wells Cathedral | 1392 | *DuMB Nun* — a silent, veiled nun |
| 13:00 | Zytglogge, Bern | 1405 | *Tears Lollipop* — a lollipop wet with tears |
| 14:00 | Prague Astronomical | 1410 | *Tart sauce* — a jug of fruit-tart sauce |
| 15:00 | St Mark's, Venice | 1499 | *Drop Baby* — a swaddled child mid-fall |
| 16:00 | Ulm Town Hall | 1520 | *TeLeNewS* — a herald reading the news |
| 17:00 | Sighișoara Tower | 1648 | *DJ roof* — a figure spinning discs on a rooftop |
| 18:00 | Lyon Astronomical | 1661 | *Attach Judah* — a lion (Judah) chained/attached |
| 19:00 | Spasskaya, Moscow | 1852 | *Devil Nail* — a devil driving a great nail |
| 20:00 | Atlas Clock (Tiffany), NYC | 1853 | *Diva Lamb* — an operatic lamb |
| 21:00 | Big Ben, London | 1859 | *Tough Lip* — a grim, set lip |
| 22:00 | Ste-Croix, Nantes | 1860 | *TV jazz* — a jazz band inside a television |
| 23:00 | Dolmabahçe, Istanbul | 1895 | *Diva Pail* — an operatic diva with a pail |
| 00:00 | City Hall, Philadelphia | 1898 | *Dive Buffet* — a shabby dive buffet |
| 01:00 | Orsay Station, Paris | 1900 | *Top Sauce* — a spinning top in sauce |
| 02:00 | Edwardian Tower, Dorchester | 1905 | *shTePSeLi* — the Georgian peg word |
| 03:00 | Grand Central, NYC | 1913 | *Top Dome* — a spinning top on a dome |
| 04:00 | Anker Clock, Vienna | 1914 | *Debater* — a figure mid-debate |
| 05:00 | Peace Tower, Ottawa | 1920 | *Top news* — a newspaper spinning like a top |
| 06:00 | Selfridges, London | 1931 | *Dope mad* — a wild-eyed figure |
| 07:00 | Binns Clock, Edinburgh | 1960 | *Top Jazz* — a top-hatted jazzman |
| 08:00 | Allen-Bradley, Milwaukee | 1962 | *BaBaJaN* — the Georgian peg word |
| 09:00 | World Clock, Berlin | 1969 | *Top Shop* — a spinning top over a shop |
| 10:00 | Leaning Tower, Tbilisi | 2011 | *Nasty Date* — a rotten calendar date |
| 11:00 | Makkah Royal Tower, Mecca | 2011 | *Nasty Date* — (hour disambiguates the shared year) |

## What the render adds — the falsifier, satisfied

The [Render / Externalization layer](./framework-comparison-matrix.md)'s rule: a channel keeps canonical status only if it has **≥1 worked instance where the externalized artifact adds a retrieval path the mental scene lacked.** This page is that instance for vision, on two counts:

1. **See → recall recognition.** Shown the Spasskaya watercolor, you name *19:00, Moscow, 1852* — a direct visual-recognition path. The song is forward-ordered audio (to place a clock you sing up from 00:00); the deck is verbal. Neither offers image → answer. The render does.
2. **The year, fused and stable.** The bare mental image of "Big Ben" does **not** carry its founding year; it also drifts under [reconsolidation](./memory-reconsolidation.md). The rendered page welds *Tough Lip → 1859* into a fixed marginalia specimen, so re-viewing the page **re-pins a Distinguisher (the year) the mental scene cannot hold on its own.**

That is the visual channel's unique affordance — a stable, re-viewable external reference — demonstrated on real material. Auditory was already satisfied by ["Hours"](./famous-clocks-mnemonic-song.md); with this page, both channels of the layer clear the falsifier.

## Relationship to the song and the deck

Three orthogonal channels on one system; drill each to its strength, none replaces another.

| | Anki deck | "Hours" song | This render |
|---|---|---|---|
| Channel | verbal spaced-repetition | melody + narrative | image + spatial recognition |
| What it builds | fast **bidirectional** hour↔clock↔city | the ordered **00→23 chain** + poem | **see→recall** recognition + the **year**, fused |
| Direction | any, shuffled | forward-ordered only | image→answer (and building→year) |
| Blind spot it has alone | ordering untrained | reverse lookup weak | no fast blind verbal recall |

The render is strongest exactly where the other two are weakest: instant recognition of a clock you're *looking at*, and recovery of the founding year the deck and song leave to Layer 2.

## Render spec (CLAMP), compiled

The shared profile, ready to paste (per page, swap the clock, the marginalia specimen, and the stanza):

```
[Velvet Aeon — Environment · Explorer's Diary]
Central watercolor: [the clock building, period-correct, in elegant decay,
  wanderer tiny against scale, one warm/def light source].
Marginalia (corner ink specimen study): [the Major peg drawn as a naturalist detail].
Annotation (margin, faded brown ink, period script): [the clocks.json stanza].

M: watercolor on aged cream-sepia paper, 19th-c. field-journal; Velvet Aeon
   palette; ink line beneath; deckle edge, fold line, tea-spot.
L: single definite source (candle-dawn / dial-glow / moon); velvet-black; no fill.
C: 24–35mm wide, deep focus, patient stillness.
A: 1536×1024 HD landscape (2560×1440 for the noon + midnight anchors).
P — Preserve: period-correct architecture + masonry · palette locked
   (pale gold · crimson · velvet black · white · nebula blue) · one intensified
   element only · ≥1 of the five Velvet Aeon preserves · marginalia count exact.
   No: modern anything · daylight-clean · saturated/commercial color · vector line ·
   glossy digital finish · named-pantheon iconography.
```

**Meta-controls**: generate the **noon (oldest) and midnight (bookend) anchors first** and lock them as the visual key of the set; render the other 22 to match their paper, palette, and hand.

## METER hooks

Measurement events for the [METER](./meter-overview.md) layer, per the [Render / Externalization layer](./framework-comparison-matrix.md) spec:

- `render.channel_invoked {channel: visual, encoder_slot: clocks24/HH, world_profile: velvet-aeon}` — fires per page generated.
- `image_gen.lens_slot_filled` — which CLAMP slots were specified (mirrors `music_gen.lens_slot_filled`).
- `image_gen.pass_gate` — did the page clear the Velvet Aeon preserves + Naturalist Precision Rule.
- **Fit floor**: the visual channel demotes if not invoked ≥3× / ~4 weeks (same disposable-tier logic as the audio side).

## Related pages

- [clocks24](./clocks24.md) — the parent system; this is its visual realization (as [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) is its auditory one)
- [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) — the "Hours" song; the auditory twin of this page (both serve the hour slot)
- [framework-comparison-matrix](./framework-comparison-matrix.md) — the Render / Externalization layer; this is the **visual channel's** worked instance
- [image-pipeline](./image-pipeline.md) — the `transform → render` pipeline (REMAPS → CLAMP) this instantiates
- [clamp-render-lens](./clamp-render-lens.md) — the render-lens filled here
- [world-velvet-aeon](./world-velvet-aeon.md) — the default world; Environment sub-mode + Explorer's Diary frame + Naturalist Precision Rule
- [calendar-memory](./calendar-memory.md) — the grandparent system; Clocks24 is its hour slot
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the minute-slot encoder; the multimodal-binding precedent this page applies to the hour slot
- [mnemonic-methods-master](./mnemonic-methods-master.md) — the Major System (Layer 2 pegs) drawn as the marginalia specimens

---

## U — See (CAST)
1. 24 clocks as one Velvet Aeon Environment watercolor journal — the visual twin of the "Hours" song
2. Each page fuses three layers: clock (center) · Major-peg year (marginalia) · poem stanza (annotation)

## D — Name (NEDF)
1. Clocks24 Visual Render = the visual channel of the Render / Externalization layer, worked on Clocks24
2. Distinguisher: adds see→recall recognition + the fused year — retrieval paths the deck and song lack
3. Failure mode: rendering the pegs pretty but not fusing the Major-peg year (then Layer 2 rides no image)

## F — Do (SPEAR)
1. Per hour: central clock + marginalia Major-peg specimen + annotation stanza → CLAMP → generate
2. Render the noon + midnight anchors first, lock them, match the other 22 to their paper and palette

## B — Watch (HEART)
1. Can name the clock from its image but not its year → the marginalia specimen was skipped or too faint
2. Pages drift in palette/paper across the set → not one artifact; re-lock against the anchors

## L — Predict (ORACLE)
1. Deck + song + render all installed → recall in any direction, ordered chain, *and* instant visual recognition + year
2. Render only → strong recognition, weak blind verbal recall (drill the deck)

## R — Act (GRACE)
1. A clock won't stick visually → intensify its one Velvet Aeon element, don't add clutter (single-light rule)
2. The Major-peg specimen fights the scene → move it fully into the marginalia; keep the central watercolor naturalistic

## Mnemonic

**The lost explorer's clock journal.** One wanderer walks the world's 24 clocks for his scattered love; each night he draws one — the tower on the page, its year as a specimen in the corner, its stanza in the margin. Noon holds the oldest, midnight bleeds green and holds the story.

## Checksum

1. What three things does a single render page carry, and where does each sit? (Clock building = central watercolor / Layer 1; Major-peg year = corner marginalia specimen / Layer 2; poem stanza = margin annotation / Layer 3.)
2. Why is Velvet Aeon the right world for Clocks24 rather than an imposed style? (Velvet Aeon *is* clocktowers + a lost love + time-as-grief; it and the poem-cycle independently share the same world, so the default world loads for free.)
3. What retrieval path does the render add that the deck and song lack — the falsifier proof? (See→recall visual recognition of a clock you're looking at, and the founding year fused into the image; a drifting mental scene holds neither.)
