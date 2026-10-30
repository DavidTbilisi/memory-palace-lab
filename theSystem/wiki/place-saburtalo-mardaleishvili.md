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
hub_position: 7
lat: 41.7363
lng: 44.738
nearest_corner: asatiani-st-x-nutsubidze-st
phase: 2
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-mardaleishvili.md
---

# Mardaleishvili Medical Center (მარდალეიშვილის სამედიცინო ცენტრი) — Saburtalo Hub 7

**Summary**: NW boundary anchor for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 2139 m NW of the home-locus; nearest CAST corner is the **Zebra** (Asatiani St x Nutsubidze St), 1253 m away — **outside the first frame** — Phase 2. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-mardaleishvili
lat: 41.7363
long: 44.738
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7363, 44.738, Mardaleishvili Medical Center
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | NW boundary anchor |
| **Walk-palace position** | Hub #7 of 7 — NW of home, 2139 m |
| **CAST corner** | Zebra — Asatiani St x Nutsubidze St (1253 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | NW of the home-locus; **outside the first frame** — Phase 2 |
| **REMAPS scene** | A doctor in a red-cross hat stands on the medical centre roof catapulting bandages over the rooftops to the SE; the bandages unfurl mid-air like white streamers writing route-lines back toward the home-locus |
| **PAO (optional)** | Person: doctor with cross-hat · Action: catapulting · Object: bandages unspooling into route-streamers |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Phase 2.** Outside the first frame — 2.1 km NW of home, 1.3 km beyond the Zebra along Nutsubidze. Its own frame's Step 0 first.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only zebra` for the corner's dial after the walk

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | (district boundary) | |
| NE | | |
| SW | | |
| SE | | |

(Fill in as you walk each corner. Each corner should get a distinguishing object — bakery, kiosk, statue, distinctive tree, weird signage. Concrete-first per [representation-rules](./representation-rules.md).)

## Bordering Hubs

Straight-line distance and compass bearing from this hub, computed from the OSM coordinates:

| Direction | Hub | Distance |
|---|---|---|
| SE | [place-saburtalo-delisi](./place-saburtalo-delisi.md) | 1347 m |
| SE | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | 1884 m |
| SE | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | 2139 m |
| SE | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | 2234 m |
| S | [place-saburtalo-cemetery](./place-saburtalo-cemetery.md) | 2363 m |
| SE | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | 2366 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. A doctor in a red-cross hat stands on the medical centre roo
2. The Zebra corner 1253 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Mardaleishvili Medical Center = Saburtalo hub 7, NW of home, boundary (outside the first frame)
2. Distinguisher: NW boundary — the second hub outside the first frame (2.1 km from home); the far end of Nutsubidze's rail
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Zebra corner, say its dial, then the 1253 m to the hub
2. Fire the scene
3. Decode: nw boundary anchor, NW of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 pages had this hub placed from a screenshot; trust the OSM bearing

## L — Predict (ORACLE)
1. NW of home on the frame → predict Mardaleishvili Medical Center
2. The Zebra corner → predict this hub 1253 m off it

## R — Act (GRACE)
1. Walking past → mutter "Mardaleishvili Medical Center · NW · hub 7"
2. Recall failure → re-walk from the Zebra corner, not from a map
