---
palace: core-memory
level: 7
domain: 10
room: 4
wiki_source: wiki/learning-systems/named-color-palette.md
---

# Named Color Palette

**Summary**: A 22-color categorical palette with stable common names, re-chunked into 6 memorable families (each with a concrete anchor image) so that many items can be color-differentiated without overloading the pre-attentive hue channel. Two coexisting indexes: a 6-stop **memory walk** for recall and **Kelly priority order** for assignment.

**Sources**:
- Kelly, K. L. (1965) — *Twenty-Two Colors of Maximum Contrast* (Color Engineering 3(6)). The ordered max-contrast set; first 9 survive color-vision deficiency.
- Boynton, R. M. (1989) — the 11 reliably-named basic colors (the short, high-nameability subset).
- Session synthesis (2026-06-04) — chunking + anchor images added per the wiki's memory discipline.

**Last updated**: 2026-06-04

---

## Why this page exists

When one mnemonic or diagram needs to color-differentiate more than ~7 items, the rainbow (the [ROYGBIV](./cultural-string-sequences.md) sequence) runs out. The wrong fix is to keep inventing hues — pre-attentive vision categorizes only ~7±2 hues reliably, so an 8th or 9th hue stops being instantly distinguishable. The right fixes are (a) extend along the orthogonal axes of [color-theory-mental-model](./color-theory-mental-model.md) (Value · Saturation · Temperature), and (b) when you genuinely need *named categorical* colors, draw from a max-contrast set that already has stable names. This page owns that named set.

Raw Kelly order is unmemorable (it is sorted by contrast, not meaning), so the 22 are re-grouped here by family with one concrete anchor image each, per the concrete-first discipline in [representation-rules](./representation-rules.md) Rule 5 and the floor-rule in [chunking](./chunking.md).

## The 22, chunked (memory order)

Six families, each inside 7±2. Recover the *family* first (via its anchor scene), then the members.

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

## Boundary — when NOT to reach for a new color

- The new distinction is a **kind** → new hue (this page).
- The new distinction is an **attribute / process / structure** → spend a different channel instead: Value/Saturation/Temperature ([color-theory-mental-model](./color-theory-mental-model.md)), motion or shape ([representation-rules](./representation-rules.md) Rule 4), texture. "I ran out of colors" usually means one channel is overloaded — see the type-vs-effect split in code-memorization.
- Past ~12 named colors you need a swatch beside the label anyway; that is the signal to switch to the axis-extension approach, not to add color #13.

## Relationship to the global palettes

This palette is the **differentiation reservoir** (arbitrary categories that just need to be told apart). It is distinct from — and must not silently overwrite — the two **semantic** palettes already reserved in the wiki:

- [representation-rules](./representation-rules.md) Rule 4 (global): Red=constraint · Blue=input · Green=goal · Yellow=decision · Gray=context.
- code-memorization type/effect colors: Blue=number · Green=string · Red=side-effect · Yellow=boolean · Grey=null · Purple=async · Brown=collection.

Those are fixed-meaning namespaces; this page is for when meaning is "category 1 vs category 2 vs …". Keep the namespaces separate per the [UMTF](./universal-mental-tagging-framework.md)-style discipline noted on those pages.

## Related pages

- [color-theory-mental-model](./color-theory-mental-model.md) — the axis model; orthogonal extension (Value/Saturation/Temperature) is the alternative to adding hues
- [cultural-string-sequences](./cultural-string-sequences.md) — ROYGBIV is sequence #1 there; this page is what you reach for when 7 isn't enough
- [chunking](./chunking.md) — the floor rule: 22 items become 6 chunks
- [representation-rules](./representation-rules.md) — Rule 4 global semantic palette + the channel-allocation discipline
- code-memorization — type/effect color namespace; example of color-as-one-channel-among-many
- [scene-grammar](./scene-grammar.md) — Color is one of the 7 Elements of Art
- [memory-palace](./memory-palace.md) — the 6-stop walk is a minimal worked example of one
