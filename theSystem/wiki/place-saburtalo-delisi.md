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
hub_role: transport
hub_position: 2
lat: 41.7255
lng: 44.7453
nearest_corner: kazbegi-ave-x-tamarashvili-ave
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-delisi.md
---

# Delisi metro (დელისი) — Saburtalo Hub 2

**Summary**: Transport hub (metro, west exit) for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 1013 m W of the home-locus; nearest CAST corner is the **Ibis** (Kazbegi Ave x Tamarashvili Ave), 147 m away — inside the first frame. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-delisi
lat: 41.7255
long: 44.7453
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7255, 44.7453, Delisi metro
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Transport hub (metro, west exit) |
| **Walk-palace position** | Hub #2 of 7 — W of home, 1013 m |
| **CAST corner** | Ibis — Kazbegi Ave x Tamarashvili Ave (147 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | W of the home-locus; inside the first frame |
| **REMAPS scene** | *(pick the scene — David's call; see [remaps](./remaps.md))* |
| **PAO (optional)** | — |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Tuesday**, extending Monday's Kazbegi walk west past the Eagle: Eagle → Ibis is 391 m, the station is 147 m off the Ibis corner. Take the metro home or walk back drilling.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only ibis` for the corner's dial after the walk

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
| SE | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | 919 m |
| E | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | 1013 m |
| E | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | 1152 m |
| NW | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | 1347 m |
| SW | [place-saburtalo-cemetery](./place-saburtalo-cemetery.md) | 1369 m |
| E | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | 1550 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. *(pick the scene — David's call
2. The Ibis corner 147 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Delisi metro = Saburtalo hub 2, W of home, transport
2. Distinguisher: the metro at the frame's **west** exit (Kazbegi × Tamarashvili, the Ibis) — vs Medical University at the east exit
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Ibis corner, say its dial, then the 147 m to the hub
2. Fire the scene
3. Decode: transport hub (metro, west exit), W of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 pages had this hub placed from a screenshot; trust the OSM bearing

## L — Predict (ORACLE)
1. W of home on the frame → predict Delisi metro
2. The Ibis corner → predict this hub 147 m off it

## R — Act (GRACE)
1. Walking past → mutter "Delisi metro · W · hub 2"
2. Recall failure → re-walk from the Ibis corner, not from a map
