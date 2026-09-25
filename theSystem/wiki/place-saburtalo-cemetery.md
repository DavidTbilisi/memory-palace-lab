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
hub_position: 6
lat: 41.7151
lng: 44.7365
nearest_corner: kazbegi-ave-x-tamarashvili-ave
phase: 2
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-cemetery.md
---

# Saburtalo Cemetery (საბურთალოს სასაფლაო) — Saburtalo Hub 6

**Summary**: SW boundary anchor for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 1958 m SW of the home-locus; nearest CAST corner is the **Ibis** (Kazbegi Ave x Tamarashvili Ave), 1265 m away — **outside the first frame** — Phase 2. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-cemetery
lat: 41.7151
long: 44.7365
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7151, 44.7365, Saburtalo Cemetery
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | SW boundary anchor |
| **Walk-palace position** | Hub #6 of 7 — SW of home, 1958 m |
| **CAST corner** | Ibis — Kazbegi Ave x Tamarashvili Ave (1265 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | SW of the home-locus; **outside the first frame** — Phase 2 |
| **REMAPS scene** | Stone angels along the cemetery wall turn their heads slowly in unison toward the metro to the NE; their eyes glow faint blue; the rotation is silent but you "hear" it as a low hum |
| **PAO (optional)** | Person: stone angels (collective) · Action: turning heads · Object: their own granite wings folded behind |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Phase 2.** Outside the first frame — 1.9 km SW of home, 1.3 km beyond the Ibis. Its own frame's Step 0 first.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only ibis` for the corner's dial after the walk

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | | |
| NE | | |
| SW | (district boundary) | |
| SE | | |

(Fill in as you walk each corner. Each corner should get a distinguishing object — bakery, kiosk, statue, distinctive tree, weird signage. Concrete-first per [representation-rules](./representation-rules.md).)

## Bordering Hubs

Straight-line distance and compass bearing from this hub, computed from the OSM coordinates:

| Direction | Hub | Distance |
|---|---|---|
| NE | [place-saburtalo-delisi](./place-saburtalo-delisi.md) | 1369 m |
| E | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | 1491 m |
| NE | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | 1958 m |
| N | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | 2363 m |
| NE | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | 2381 m |
| NE | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | 2644 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. Stone angels along the cemetery wall turn their heads slowly
2. The Ibis corner 1265 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Saburtalo Cemetery = Saburtalo hub 6, SW of home, boundary (outside the first frame)
2. Distinguisher: SW boundary — the first hub **outside** the first frame (1.9 km from home); marks where the district ends
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Ibis corner, say its dial, then the 1265 m to the hub
2. Fire the scene
3. Decode: sw boundary anchor, SW of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 pages had this hub placed from a screenshot; trust the OSM bearing

## L — Predict (ORACLE)
1. SW of home on the frame → predict Saburtalo Cemetery
2. The Ibis corner → predict this hub 1265 m off it

## R — Act (GRACE)
1. Walking past → mutter "Saburtalo Cemetery · SW · hub 6"
2. Recall failure → re-walk from the Ibis corner, not from a map
