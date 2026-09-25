---
palace: core-memory
level: 7
domain: 10
room: 10
para: resource
glyph: 🎨
wiki_source: wiki/learning-systems/extended-color-wheel.md
---

# Extended Colour Wheel — 12 hues × tint · tone · shade

**Summary**: The artist's 12-hue wheel (3 primaries · 3 secondaries · 6 tertiaries) crossed with the three neutral modifiers — **tint** (+ white), **tone** (+ grey), **shade** (+ black) — gives a 36-cell grid of everyday colour names. This page owns the grid and the three modifiers; it is the fixed index that plutchik-wheel-of-emotions binds its 52 emotion words into, and it turns out to be the regular lattice that [named-color-palette](./named-color-palette.md)'s 22 irregular names were sampled from.

**Sources**:
- Wikipedia, *Tint, shade and tone* (fetched 2026-09-07) — the three definitions, quoted verbatim below. Cited as (source: Wikipedia, Tint shade and tone, 2026-09-07).
- The RYB artist's colour wheel — standard art-education material (Itten's 12-part wheel); the hue names and the primary / secondary / tertiary partition are conventional and carry no single source.
- Kelly, K. L. (1965) via [named-color-palette](./named-color-palette.md) — the 22 anchors placed on the grid.
- Session 2026-09-07 — the candidate cell names are this wiki's choice for the coupled naming and are marked as candidates; the hex values are the CSS colour keywords of the same name where one exists, otherwise a conventional value.

**Last updated**: 2026-09-21 (§Mnemonic — two stale claims removed: the peg slots now take David's object pegs from [named-color-palette](./named-color-palette.md), and the slot detail stays on plutchik-wheel-of-emotions); 2026-09-07

**Drawn form**: [`pages/plutchik-colour-dial.html`](../../pages/plutchik-colour-dial.html) §04 — the wheel as two triangles and a hexagon, every spoke with its four cells, the eight emotion petals marked.

---

## Visual — three shapes, one wheel

```
            primaries (3)            secondaries (3)          tertiaries (6)
                 R                          O                    RO    YO
                / \                        / \                 RV        YG
               /   \          +           /   \        +
              B ─── Y                    V ─── G               BV        BG
          upright triangle           inverted triangle          hexagon
                                                              between them

            the three modifiers (3)
                    WHITE  → tint
                    /    \
                GREY ──── BLACK
                tone      shade
```

Three sets, three count-shapes per [representation-rules](./representation-rules.md) Rule 10: the primaries are a triangle, the secondaries the inverted triangle (together the six-pointed star every art classroom draws), the tertiaries the hexagon that fills the gaps, and the modifiers a third triangle whose corners are the three neutrals. A wheel drawn with one corner empty is visibly short before any name is read.

## The twelve hues

Read clockwise from 12 o'clock, red at the top. Tertiaries take their name from the two neighbours they sit between.

| # | Hue | Class | Hex used here | Common name |
|---|---|---|---|---|
| 1 | Red | primary | `#FF0000` | red |
| 2 | Red-orange | tertiary | `#FF4500` | vermilion |
| 3 | Orange | secondary | `#FFA500` | orange |
| 4 | Yellow-orange | tertiary | `#FFBF00` | amber |
| 5 | Yellow | primary | `#FFFF00` | yellow |
| 6 | Yellow-green | tertiary | `#7FFF00` | lime, chartreuse |
| 7 | Green | secondary | `#00A000` | green |
| 8 | Blue-green | tertiary | `#00BFBF` | turquoise, cyan |
| 9 | Blue | primary | `#0000FF` | blue |
| 10 | Blue-violet | tertiary | `#8A2BE2` | indigo |
| 11 | Violet | secondary | `#8000FF` | violet, purple |
| 12 | Red-violet | tertiary | `#FF00FF` | magenta |

Complements sit six steps apart: red ↔ green, orange ↔ blue, yellow ↔ violet, and each tertiary faces the tertiary opposite it (vermilion ↔ turquoise, amber ↔ indigo, lime ↔ magenta). The angular harmonies — analogous, triadic, split-complementary, complementary — are owned by [color-theory-mental-model](./color-theory-mental-model.md); this page only fixes the twelve names they act on.

## The three modifiers — what is mixed in

Quoted from the source so the definitions stay exact (source: Wikipedia, Tint shade and tone, 2026-09-07):

- **Tint** — "a mixture of a color with white, which increases lightness".
- **Shade** — "a mixture with black, which increases darkness".
- **Tone** — "produced either by mixing a color with gray, or by both tinting and shading".
- And the rule behind all three: "Mixing a color with any neutral color (black, gray, and white) reduces the chroma, or colorfulness."

In the three-axis model of [color-theory-mental-model](./color-theory-mental-model.md) these are the three moves off the pure hue: tint slides value **up**, shade slides value **down**, tone pulls saturation **in** at roughly the same value. That page owns the axes; the mapping is stated here only so the grid's rows and the cylinder's moves are known to be the same thing.

## The 36-cell grid

Names in the three modifier columns are **candidates** — one everyday word per cell, chosen so that each is a word people already use, never a paint-catalogue coinage. Hex values render the swatch on the drawn page; where a CSS keyword of the same name exists, that keyword's value is used.

| Hue | Tint (+ white) | Tone (+ grey) | Shade (+ black) |
|---|---|---|---|
| Red | pink `#FFC0CB` | dusty rose `#C08081` | maroon `#800000` |
| Vermilion | coral `#FF7F50` | terracotta `#E2725B` | rust `#B7410E` |
| Orange | peach `#FFDAB9` | caramel `#CD853F` | burnt orange `#CC5500` |
| Amber | apricot `#FBCEB1` | mustard `#DAA520` | bronze `#B8860B` |
| Yellow | cream `#FFFACD` | khaki `#F0E68C` | olive `#808000` |
| Lime | honeydew `#DFFFA0` | moss `#8A9A5B` | olive drab `#556B2F` |
| Green | mint `#AAF0D1` | sage `#9CAF88` | forest `#228B22` |
| Turquoise | aqua `#AFEEEE` | cadet `#5F9EA0` | teal `#008080` |
| Blue | powder blue `#B0E0E6` | steel `#4682B4` | navy `#000080` |
| Indigo | periwinkle `#CCCCFF` | slate blue `#6A5ACD` | indigo (deep) `#4B0082` |
| Violet | lilac `#C8A2C8` | mauve `#915F6D` | plum `#580F41` |
| Magenta | orchid `#DA70D6` | dusty magenta `#BA55D3` | mulberry `#8B008B` |

`12 × 3 = 36` cells, plus the twelve pure hues and the three neutrals themselves.

## Kelly's 22 on the grid — the unlock

[named-color-palette](./named-color-palette.md) chunks Kelly's 22 max-contrast colours into six anchor families. Laid on this grid they resolve exactly: the **Spine** (black · grey · white) is the three modifiers; the **Wheel** (red · orange · yellow · green · blue · purple) is the three primaries and three secondaries; and the remaining thirteen each name one cell:

| Kelly name (palette anchor) | Grid cell |
|---|---|
| Light blue (sky) | Blue · tint |
| Purplish pink (orchid) | Magenta · tint |
| Yellowish pink (salmon) | Vermilion · tint |
| Violet (amethyst) | Indigo · pure |
| Purplish red (beetroot, wine) | Magenta · shade |
| Reddish orange (terracotta) | Vermilion · tone |
| Orange yellow (marigold) | Amber · pure |
| Greenish yellow (lime) | Lime · pure |
| Yellow green (pear) | Lime · tint |
| Buff (manila) | Amber · tint |
| Reddish brown (rust) | Vermilion · shade |
| Yellowish brown (caramel) | Orange · tone |
| Olive green (olive) | Yellow · shade |

`3 + 6 + 13 = 22`. So the palette's 6-stop walk and this grid are two indexes over one set — the walk for recalling Kelly's 22, the grid for **generating** the names Kelly skipped. Two cells are read as "pure" rather than modified (amethyst, marigold) because Kelly's names are hue names there. The four rows with no Kelly member at all — Red, Yellow, Green, Blue beyond their pure cell, and Violet — are where the palette ran out and this page continues.

## Coupled use — the eight petal hues

Eight of the twelve spokes carry one primary emotion each, in Plutchik's own colours: red = anger, orange = anticipation, yellow = joy, lime = trust, green = fear, turquoise = surprise, blue = sadness, magenta = disgust. The four spokes left over — vermilion, amber, indigo, violet — are where three of the primary dyads mix to. That binding, and the reading of tint · pure · shade as mild · basic · intense, is owned by plutchik-wheel-of-emotions §The coupling grammar; this page only notes which of its spokes are taken so the free ones are visible.

## Mnemonic

The three modifiers are the palette's Spine — *a pencil sketch, coal → ash → paper* — read as add black (shade), add grey (tone), add white (tint). The twelve spokes and the three modifiers are peg slots, and they take David's own object pegs from [named-color-palette](./named-color-palette.md) §David's object pegs. The slot list, which peg sits in which slot, and the promotion gate live on plutchik-wheel-of-emotions §Mnemonic so the two pages do not keep two copies.

## Checksum

Recall is correct if all four close:

1. **Three, three, six.** The hues partition into a triangle, an inverted triangle and a hexagon; a wheel with eleven names has lost a tertiary, and the lost one is the gap between two neighbours with no name between them.
2. **Three neutrals, three moves.** White, grey, black — up, in, down. A "fourth modifier" is one of these renamed.
3. **Thirty-six.** Twelve hues times three; a grid that comes to thirty-three has an empty column somewhere, and the column is nearly always tone.
4. **Twenty-two on the grid.** Kelly's set places as 3 + 6 + 13; a placement that needs a fourteenth cell has put a Wheel colour in a cell.

## Measurement

This page mints **no new [METER](./meter-overview.md) namespace**. The grid is exercised through the dial's `emotion_wheel.redraw` event on plutchik-wheel-of-emotions (its `colour_errors` field is this page's health signal) and through the palette's existing use in diagrams.

## Related pages

- plutchik-wheel-of-emotions — the emotion words bound into this grid; owner of the coupling
- [color-theory-mental-model](./color-theory-mental-model.md) — hue / value / saturation, the harmony angles, the Čižiková four-axis refinement
- [named-color-palette](./named-color-palette.md) — Kelly's 22, now placed as 3 + 6 + 13 cells of this grid
- [peg-system](./peg-system.md) — the trunk the twelve spokes join once their images are frozen
- [representation-rules](./representation-rules.md) — Rule 4 reserves five colours for semantic roles wiki-wide; this grid is a naming index, not a competing semantic palette
- [scene-grammar](./scene-grammar.md) — Colour as one of the seven Elements of Art

## U — See (CAST)
1. A wheel of 12 spokes, each spoke four cells: shade · pure · tint, tone off to the side
2. Edges: neighbour → tertiary between; six steps → complement; neutral → modifier

## D — Name (NEDF)
1. 12 hues (3 + 3 + 6) × 3 modifiers (white · grey · black) = 36 named cells
2. Distinguisher: tone changes saturation, tint and shade change value
3. Failure: names learned as a list, wheel not held

## F — Do (SPEAR)
1. Draw the star, add the hexagon, name the twelve
2. For any hue, say its tint, tone, shade
3. Place a new colour name: which spoke, which modifier

## B — Watch (HEART)
1. A "new" colour name that is really a cell already filled
2. Tone confused with shade (dull vs dark)
3. The Rule-4 semantic palette silently bent by this grid

## L — Predict (ORACLE)
1. Grid held → any colour name met in the wild places itself in seconds
2. List only → names past the twelve pures stay unplaceable

## R — Act (GRACE)
1. Reaching for a 13th categorical colour → check the grid's tint and shade rows first
2. A colour name with no cell → it is a hue name or a tone; place it before storing it
