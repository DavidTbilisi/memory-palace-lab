---
palace: core-memory
level: 7
domain: 10
room: 4
wiki_source: wiki/learning-systems/named-color-palette.md
---

# Named Color Palette

**Summary**: A 22-color categorical palette with stable common names, re-chunked into 6 memorable families (each with a concrete anchor image) so that many items can be color-differentiated without overloading the pre-attentive hue channel. Two coexisting indexes: a 6-stop **memory walk** for recall and **Kelly priority order** for assignment; David's own **19 object pegs** (a ROYGBIV ring, 4 neutrals, 8 extras) are the operative anchors, with the 22 filed under them.

**Sources**:
- Kelly, K. L. (1965) — *Twenty-Two Colors of Maximum Contrast* (Color Engineering 3(6)). The ordered max-contrast set; first 9 survive color-vision deficiency.
- Boynton, R. M. (1989) — the 11 reliably-named basic colors (the short, high-nameability subset).
- Session synthesis (2026-06-04) — chunking + anchor images added per the wiki's memory discipline.
- Session (2026-09-21) — David's statement that colours can't be held directly, and his own pegs (red = tomato, yellow = banana, black = cat); the 19-peg palette and the filing of Kelly's 22 and of the CSS names under it were built from that. CSS named colours: W3C CSS Color Module (148 names, read from matplotlib's `CSS4_COLORS`).

**Last updated**: 2026-09-21 (§David's object pegs added — 19 object pegs as a ROYGBIV ring + 4 neutrals + 8 extras, Kelly's 22 filed under 16 of them, Anchor-vs-peg precedence stated, related links; Plutchik's peg slots now use the pegs); 2026-09-07 (the 22 placed on the [extended-color-wheel](./extended-color-wheel.md) grid — they resolve as the 3 modifiers + the 6 pures + 13 cells; §The 22 on the 12 × 3 grid added, related link added); 2026-06-04

---

## Why this page exists

When one mnemonic or diagram needs to color-differentiate more than ~7 items, the rainbow (the [ROYGBIV](./cultural-string-sequences.md) sequence) runs out. The wrong fix is to keep inventing hues — pre-attentive vision categorizes only ~7±2 hues reliably, so an 8th or 9th hue stops being instantly distinguishable. The right fixes are (a) extend along the orthogonal axes of [color-theory-mental-model](./color-theory-mental-model.md) (Value · Saturation · Temperature), and (b) when you genuinely need *named categorical* colors, draw from a max-contrast set that already has stable names. This page owns that named set.

Raw Kelly order is unmemorable (it is sorted by contrast, not meaning), so the 22 are re-grouped here by family with one concrete anchor image each, per the concrete-first discipline in [representation-rules](./representation-rules.md) Rule 5 and the floor-rule in [chunking](./chunking.md).

## The 22, chunked (memory order)

Six families, each inside 7±2. Recover the *family* first (via its anchor scene), then the members.

> **Anchor vs peg.** The Anchor column below is a generic default (session 2026-06-04). David's own object for each colour is in §David's object pegs; where the two differ, his wins.

### ① The Spine — 3 neutrals · *a pencil sketch: coal → ash → paper*
| Color | Anchor |
|---|---|
| Black | coal / raven |
| Grey | ash / elephant |
| White | snow / milk |

### ② The Wheel — 6 pures · *the dial you spin in [color-theory-mental-model](./color-theory-mental-model.md)*
| Color | Anchor |
|---|---|
| Red | fire truck |
| Orange | the fruit |
| Yellow | lemon |
| Green | grass |
| Blue | cobalt / deep sea |
| Purple | eggplant |

### ③ The Softs — 3 tints · *a pastel nursery*
| Color | Anchor |
|---|---|
| Light blue | sky |
| Purplish pink | orchid / fuchsia |
| Yellowish pink | salmon (the fish) |

### ④ The Deeps — 2 jewels · *an open jewellery box*
| Color | Anchor |
|---|---|
| Violet | amethyst |
| Purplish red | red wine / beetroot |

### ⑤ The Sunrise — 4 betweens · *a gradient dawn → leaf (clustered around yellow, where the eye sees finest)*
| Color | Anchor |
|---|---|
| Reddish orange | terracotta / persimmon |
| Orange yellow | egg yolk / marigold |
| Greenish yellow | lime / chartreuse |
| Yellow green | spring leaf / pear |

### ⑥ The Ground — 4 earths · *walking on soil*
| Color | Anchor |
|---|---|
| Buff | manila folder / suede |
| Reddish brown | rust / chestnut |
| Yellowish brown | caramel / camel |
| Olive green | olive / army jacket |

`3 + 6 + 3 + 2 + 4 + 4 = 22` ✓

## The 6-stop micro-walk

The chunk names themselves form one walkable scene — one peg per family:

> **Sketch** it (Spine) → **spin the Wheel** → into the pastel **nursery** (Softs) → open the **jewellery box** (Deeps) → watch **sunrise over leaves** (Betweens) → walk on **soil** (Ground).

## Two indexes, two jobs

- **Memory order** = the 6-stop walk above — for *recalling* the set.
- **Priority order** = Kelly's original numbering — for *assigning* colors. When you need only *N* categories, pull in Kelly sequence so the set stays maximally distinguishable:

  `1 Black · 2 White · 3 Yellow · 4 Purple · 5 Orange · 6 Light blue · 7 Red · 8 Buff · 9 Grey · 10 Green · 11 Purplish pink · 12 Blue · 13 Yellowish pink · 14 Violet · 15 Orange yellow · 16 Purplish red · 17 Greenish yellow · 18 Reddish brown · 19 Yellow green · 20 Yellowish brown · 21 Reddish orange · 22 Olive green` (source: Kelly 1965)

  **The first 9 remain distinguishable under color-vision deficiency** (source: Kelly 1965) — if a diagram must survive color-blindness, cap at 9.

So: **walk to remember them, Kelly-number to assign them.**

## Shorter option — Boynton's 11

For ≤11 categories, prefer the colors people can label without hesitation (nameability aids recall): red · green · yellow · blue · orange · purple · pink · brown · black · white · grey (source: Boynton 1989). These are families ①–③ minus the betweens.

## The 22 on the 12 × 3 grid

Kelly's set is an irregular sample of a regular lattice. On the [extended-color-wheel](./extended-color-wheel.md) — 12 artist's hues × tint · tone · shade — the Spine is the three modifiers (coal = shade, ash = tone, paper = tint), the Wheel is the three primaries and three secondaries, and the remaining 13 each name exactly one cell (`3 + 6 + 13 = 22`). So the 6-stop walk above and that grid are two indexes over one set: walk to recall these 22, read the grid to **generate** the names Kelly skipped. The cell-by-cell placement is on that page; nothing here is redefined by it.

## David's object pegs — the operative anchors

**Why they exist.** David cannot hold a colour directly, so he hooks each one to an object he can picture — red = tomato, yellow = banana, black = cat (source: David, session 2026-09-21). The band of colour around the peg *is* the colour; the object is the part he remembers. That is a different job from the Anchor column above, a generic default from 2026-06-04 (fire truck, lemon, grass). **The two sources contradict, and David's peg wins**: they differ on the Wheel's red, orange, yellow and green, and agree on grey (elephant), white (milk) and purplish red (red wine). The Anchor column stays as the fallback for any colour without a peg. Plutchik's dial no longer reuses it: that page's 15 peg slots take the pegs below.

### The 19

Each is a peg in the [peg-system](./peg-system.md) sense — a colour bound to one image — though not yet an instance of it (see §Status below). The **Swap** column is the runner-up if the first object fails in use.

| Set | Colour | Peg | Swap | Status | Kelly's colours filed here |
|---|---|---|---|---|---|
| **Ring** (7) | red | 🍅 tomato | — | David's | Red · Reddish orange |
| | orange | 🥕 carrot | 🦊 fox | proposed | Orange |
| | yellow | 🍌 banana | — | David's | Yellow |
| | green | 🐸 frog | 🥦 broccoli | proposed | Green |
| | blue | 🐳 blue whale | Smurf | proposed | Blue |
| | indigo | 👖 jeans | 👮 police uniform | proposed | — |
| | violet | 🍇 grapes | 🍆 eggplant | proposed | Purple · Violet |
| **Neutrals** (4) | white | 🥛 milk | ⛄ snowman | proposed | White |
| | grey | 🐘 elephant | 🪨 rock | proposed | Grey |
| | black | 🐈‍⬛ black cat | 🕷️ spider | David's | Black |
| | brown | 🍫 chocolate | 🐻 bear | proposed | Buff · Reddish brown · Yellowish brown |
| **Extras** (8) | pink | 🌸 cherry blossom | 🐷 pig | proposed | Purplish pink · Yellowish pink |
| | maroon | 🍷 red wine | 🍒 cherries | proposed | Purplish red |
| | gold | 🥇 gold medal | 👑 crown | proposed | Orange yellow |
| | light green | 🍏 green apple | 🥝 kiwi | proposed | Greenish yellow · Yellow green |
| | dark green | 🌲 pine tree | 🐊 crocodile | proposed | Olive green |
| | light blue | 🧊 ice cube | swimming pool | proposed | Light blue |
| | turquoise | 🦚 peacock | 🏝️ lagoon | proposed | — |
| | silver | 🥄 spoon | 🤖 robot | proposed | — |

`7 + 4 + 8 = 19` ✓ · `2 + 1 + 1 + 1 + 1 + 0 + 2 + 1 + 1 + 1 + 3 + 2 + 1 + 1 + 2 + 1 + 1 + 0 + 0 = 22` ✓ (Kelly's colours, row by row).

### The ring

```
                          RED 🍅
                    ╱                ╲
          VIOLET 🍇                    ORANGE 🥕
              │                            │
              │                            │
          INDIGO 👖                    YELLOW 🍌
                    ╲                ╱
                BLUE 🐳 ──────────── 🐸 GREEN
```

Seven pegs, so the outline is a ring ([representation-rules](./representation-rules.md) Rule 10, n = 7), clockwise from the top in ROYGBIV order — the hue wheel's own order, which closes on itself ([extended-color-wheel](./extended-color-wheel.md)). The ring is the ~7-hue ceiling this page opens with. The four neutrals (a square: the Spine's three plus brown) and the eight extras are how the palette goes past it without inventing a hue; eight is above seven, so the extras take a ladder, not a polygon.

### How the 22 file under the pegs

Each of Kelly's colours files under its **nearest peg — hue family first, then lightness** (last column above). Sixteen pegs receive a Kelly colour; **indigo, turquoise and silver receive none**, which is what the pegs add to Kelly's set: the rainbow's seventh hue, a blue-green, and a metal. All eleven of Boynton's are pegs (purple files under violet). Nearest-by-colour-distance was tried for the filing and rejected: it put pure CSS blue under violet.

### Beyond the 22

The CSS named colours — 148 names, 141 once the seven gray/grey spellings are merged — file the same way, each with an object of its own: **19 are the pegs themselves, 53 take their object from their own name** (tomato, coral, firebrick, lavender), and **69 are drafts** (source: session 2026-09-21, filed by hand). They are browsable in a private Colour Peg Wheel artifact (https://claude.ai/artifact/3PbfgKc1ER4BVXe67AuQ7Z) and are **not transcribed here**: 69 objects are unreviewed, and the 27 near-white names are almost identical in colour, so the object is their only discriminator — a wrong pick costs most there.

### Where they are used

The `041 World Flags` Anki deck (world-flags-deck) draws every flag's colour chain as these pegs, using nine of them — red, orange, yellow, green, blue, indigo, light blue, white, black — with gold riding yellow and saffron riding orange. `PEG` in `tools/world-flags/build_anki.py` mirrors this table: change a peg here first, then there.

### Status

These are a peg set *in installation*: the index is fixed (nineteen slots), but sixteen of the images are proposals, so the set is not yet an instance in [peg-system](./peg-system.md). **Freeze gate** (falsifiable, shaped like the one on plutchik-wheel-of-emotions): a peg is frozen when David has chosen it and held it two weeks, and a blank redraw — the ring, the square of neutrals, then the eight extras — comes back with **zero empty vertices twice, a week apart**. The ring is the checksum: an empty vertex shows before a label is read (Rule 10). Nothing is measured yet, and no [METER](./meter-overview.md) event is registered for the redraw.

## Boundary — when NOT to reach for a new color

- The new distinction is a **kind** → new hue (this page).
- The new distinction is an **attribute / process / structure** → spend a different channel instead: Value/Saturation/Temperature ([color-theory-mental-model](./color-theory-mental-model.md)), motion or shape ([representation-rules](./representation-rules.md) Rule 4), texture. "I ran out of colors" usually means one channel is overloaded — see the type-vs-effect split in code-memorization.
- Past ~12 named colors you need a swatch beside the label anyway; that is the signal to switch to the axis-extension approach, not to add color #13.

## Relationship to the global palettes

This palette is the **differentiation reservoir** (arbitrary categories that just need to be told apart). It is distinct from — and must not silently overwrite — the two **semantic** palettes already reserved in the wiki:

- [representation-rules](./representation-rules.md) Rule 4 (global): Red=constraint · Blue=input · Green=goal · Yellow=decision · Gray=context.
- code-memorization type/effect colors: Blue=number · Green=string · Red=side-effect · Yellow=boolean · Grey=null · Purple=async · Brown=collection.

Those are fixed-meaning namespaces; this page is for when meaning is "category 1 vs category 2 vs …". Keep the namespaces separate per the [UMTF](./universal-mental-tagging-framework.md)-style discipline noted on those pages.

The object pegs (§David's object pegs) are neither: they are a *recall handle* for a hue, not a colour to draw with and not a meaning, so they reserve and change nothing in either namespace.

## Related pages

- [color-theory-mental-model](./color-theory-mental-model.md) — the axis model; orthogonal extension (Value/Saturation/Temperature) is the alternative to adding hues
- [cultural-string-sequences](./cultural-string-sequences.md) — ROYGBIV is sequence #1 there; this page is what you reach for when 7 isn't enough
- [chunking](./chunking.md) — the floor rule: 22 items become 6 chunks
- [representation-rules](./representation-rules.md) — Rule 4 global semantic palette + the channel-allocation discipline
- code-memorization — type/effect color namespace; example of color-as-one-channel-among-many
- [scene-grammar](./scene-grammar.md) — Color is one of the 7 Elements of Art
- [memory-palace](./memory-palace.md) — the 6-stop walk is a minimal worked example of one
- [extended-color-wheel](./extended-color-wheel.md) — the 12 × 3 grid these 22 sample: Spine = the three modifiers, Wheel = primaries + secondaries, the other 13 one cell each; reach for it when the 22 run out
- plutchik-wheel-of-emotions — six of these anchors (fire truck · the fruit · lemon · lime · grass · cobalt) were its peg candidates for the emotion dial until 2026-09-21; that page's slots now take David's own pegs (§David's object pegs) — 14 of 15 filled, vermilion open — so one object serves both systems
- [peg-system](./peg-system.md) — the trunk method; the 19 object pegs are a peg set in installation, not yet an instance
- world-flags-deck — the first consumer: its Anki deck draws every flag's colours as nine of these pegs
