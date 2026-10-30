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
hub_role: medical
hub_position: 3
lat: 41.7289
lng: 44.7584
nearest_corner: budapest-st-x-kandelaki-st-x-nutsubidze-st-x-vakeli-st
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-aversi.md
---

# Aversi Clinic (ავერსის კლინიკა) — Saburtalo Hub 3

**Summary**: Medical hub on the Owl corner for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 609 m N of the home-locus; nearest CAST corner is the **Owl** (Budapest St x Kandelaki St x Nutsubidze St x Vakeli St), 148 m away — inside the first frame. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept, one street name in it corrected); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-aversi
lat: 41.7289
long: 44.7584
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7289, 44.7584, Aversi Clinic
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Medical hub on the Owl corner |
| **Walk-palace position** | Hub #3 of 7 — N of home, 609 m |
| **CAST corner** | Owl — Budapest St x Kandelaki St x Nutsubidze St x Vakeli St (148 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | N of the home-locus; inside the first frame |
| **REMAPS scene** | Giant prescription pill bottles stacked like Jenga blocks tower above the clinic; the top bottle wobbles and topples in slow motion, scattering glowing capsules across Nutsubidze St |
| **PAO (optional)** | Person: pharmacist-giant · Action: stacking and accidentally toppling · Object: Jenga-tower of pill bottles |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Thursday**, on the east rung: Raccoon → Whale → Owl (513 m), then 148 m to the clinic. Continue east along Budapest to the Lion and Medical University metro.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only owl` for the corner's dial after the walk

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | | |
| NE | | |
| SW | | |
| SE | | |

(Fill in as you walk each corner. Each corner should get a distinguishing object — bakery, kiosk, statue, distinctive tree, weird signage. Concrete-first per [representation-rules](./representation-rules.md).)

## Bordering Hubs

Straight-line distance and compass bearing from this hub, computed from the OSM coordinates:

| Direction | Hub | Distance |
|---|---|---|
| E | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | 483 m |
| S | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | 609 m |
| SW | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | 1098 m |
| W | [place-saburtalo-delisi](./place-saburtalo-delisi.md) | 1152 m |
| NW | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | 1884 m |
| SW | [place-saburtalo-cemetery](./place-saburtalo-cemetery.md) | 2381 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. Giant prescription pill bottles stacked like Jenga blocks to
2. The Owl corner 148 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Aversi Clinic = Saburtalo hub 3, N of home, medical
2. Distinguisher: the medical hub that sits on a **rule corner** — Vakeli × Nutsubidze, the Owl, the densest dial in the frame (five hands)
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Owl corner, say its dial, then the 148 m to the hub
2. Fire the scene
3. Decode: medical hub on the owl corner, N of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 pages had this hub placed from a screenshot; trust the OSM bearing

## L — Predict (ORACLE)
1. N of home on the frame → predict Aversi Clinic
2. The Owl corner → predict this hub 148 m off it

## R — Act (GRACE)
1. Walking past → mutter "Aversi Clinic · N · hub 3"
2. Recall failure → re-walk from the Owl corner, not from a map
