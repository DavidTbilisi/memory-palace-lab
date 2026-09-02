---
palace: tactical-memory
level: 3
domain: 7
room: 4
tags:
  - geography/place
  - geography/hub
  - tbilisi
  - saburtalo
city: Tbilisi
district: Saburtalo
hub_role: boundary
hub_position: 5
lat: 41.7203
lng: 44.7377
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-cemetery.md
---

# Saburtalo Cemetery (საბურთალოს სასაფლაო) — Saburtalo Hub 5

**Summary**: SW boundary anchor for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). Marks the south end of Shalva Nutsubidze St and the western edge of the district. Boundary hubs are load-bearing because they're how you know you've left the district. Coordinates approximate — replace with GPS-walked values at Phase 0.

**Sources**:
- wiki/learning-systems/neighborhood-palace.md (encoding home)
- Tbilisi map screenshot 2026-05-30

**Last updated**: 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-cemetery
lat: 41.7203
long: 44.7377
zoom: 17
height: 350px
width: 100%
unit: meters
marker: default, 41.7203, 44.7377, Saburtalo Cemetery
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Boundary anchor (SW corner) |
| **Walk-palace position** | Hub #5 of 6 |
| **Compass role** | SW boundary; marks "you have left central Saburtalo, the next district S is Vake" |
| **REMAPS scene** | Stone angels along the cemetery wall turn their heads slowly in unison toward the metro to the NE; their eyes glow faint blue; the rotation is silent but you "hear" it as a low hum |
| **PAO (optional)** | Person: stone angels (collective) · Action: turning heads · Object: their own granite wings folded behind |

## Walk Plan — Phase 1

- **Day encoded**: Saturday (Shalva Nutsubidze N→S walk reaches here as the southern terminus)
- **Reverse walk**: same Saturday (the long-walk day)
- **Drill cadence**: rung 0 from week 1; the boundary check ("am I still in Saburtalo?") fires this hub

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | | |
| NE | | |
| SW | (district boundary) | |
| SE | | |

## Bordering Hubs

| Direction | Hub | Approx distance |
|---|---|---|
| N (up Shalva Nutsubidze) | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | ~1.9km |
| NE (across district) | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | ~700m |
| S (across boundary) | (Vake / Vake Park area) | district boundary |

## Why boundary hubs matter

The district palace is bounded — knowing where it ENDS is as important as knowing where things ARE inside it. Without boundary anchors:

- You can't reliably answer "is this address inside Saburtalo?" — rung 2 fails for edge cases.
- Inter-district routing (Saburtalo → Vake) has no clean transition locus.
- The palace silently bleeds into adjacent districts during recall, corrupting the encoding.

Boundary hubs get **slightly subdued REMAPS scenes** (quieter, more contemplative — the angels' silent rotation here) to mark them tonally as "edge" rather than "centre." Contrast with the central home-locus scene (active king + glowing beaker + steam) at Bochorishvili.

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md)

---

## U — See (CAST)
1. Stone angels rotating heads NE
2. Faint blue eye-glow, low-hum audio

## D — Name (NEDF)
1. Saburtalo Cemetery = SW boundary anchor
2. Distinguisher: silent-rotating-angels (vs Mardaleishvili's NW catapulting-doctor — both boundary hubs but tonally inverted: contemplative S vs frenetic N)
3. Failure mode: boundary leak — if scene weakens, palace bleeds south into Vake

## F — Do (SPEAR)
1. Walk Shalva Nutsubidze S → terminus
2. Fire angel-rotation scene
3. Decode: SW boundary, district edge

## B — Watch (HEART)
1. Boundary leak (recall confuses Saburtalo↔Vake)
2. Tonal drift (scene becoming "exciting" — should stay contemplative)

## L — Predict (ORACLE)
1. SW corner cue → predict Cemetery + angels
2. Angel-rotation → predict S boundary (not N)

## R — Act (GRACE)
1. Walking S past cemetery → mutter "boundary · SW · angels"
2. Inter-district routing → fire this hub as the Saburtalo-side transition anchor
