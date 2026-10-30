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
hub_role: green-space
hub_position: 5
lat: 41.7198
lng: 44.7533
nearest_corner: kartozia-st-x-tsintsadze-st
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-central-park.md
---

# Central Park (ცენტრალური პარკი) — Saburtalo Hub 5

**Summary**: Green-space hub (OSM: construction) for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 524 m SW of the home-locus; nearest CAST corner is the **Dinosaur** (Kartozia St x Tsintsadze St), 197 m away — inside the first frame. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-central-park
lat: 41.7198
long: 44.7533
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7198, 44.7533, Central Park
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Green-space hub (OSM: construction) |
| **Walk-palace position** | Hub #5 of 7 — SW of home, 524 m |
| **CAST corner** | Dinosaur — Kartozia St x Tsintsadze St (197 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | SW of the home-locus; inside the first frame |
| **REMAPS scene** | A giant fountain at the park centre sprays upward; instead of water it sprays **children-shaped droplets** that fall back giggling; the giggling is the audio anchor |
| **PAO (optional)** | Person: child-droplet · Action: erupting upward · Object: fountain basin of polished stone |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Saturday**, on the south spur: Eagle → Tiger → Dinosaur along Kartozia, then 197 m to the park. The spur's two field questions (the Tiger interchange, the Kartozia bend) are settled on the same walk.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only dinosaur` for the corner's dial after the walk

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | (park entrance?) | |
| NE | | |
| SW | | |
| SE | | |

(Fill in as you walk each corner. Each corner should get a distinguishing object — bakery, kiosk, statue, distinctive tree, weird signage. Concrete-first per [representation-rules](./representation-rules.md).)

## Bordering Hubs

Straight-line distance and compass bearing from this hub, computed from the OSM coordinates:

| Direction | Hub | Distance |
|---|---|---|
| NE | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | 524 m |
| NW | [place-saburtalo-delisi](./place-saburtalo-delisi.md) | 919 m |
| NE | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | 1098 m |
| NE | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | 1208 m |
| W | [place-saburtalo-cemetery](./place-saburtalo-cemetery.md) | 1491 m |
| NW | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | 2234 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. A giant fountain at the park centre sprays upward
2. The Dinosaur corner 197 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Central Park = Saburtalo hub 5, SW of home, green-space (OSM: under construction)
2. Distinguisher: the only green-space hub, and the only one OSM tags as *under construction* — verify on Saturday what is actually there
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Dinosaur corner, say its dial, then the 197 m to the hub
2. Fire the scene
3. Decode: green-space hub (osm: construction), SW of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 pages had this hub placed from a screenshot; trust the OSM bearing

## L — Predict (ORACLE)
1. SW of home on the frame → predict Central Park
2. The Dinosaur corner → predict this hub 197 m off it

## R — Act (GRACE)
1. Walking past → mutter "Central Park · SW · hub 5"
2. Recall failure → re-walk from the Dinosaur corner, not from a map
