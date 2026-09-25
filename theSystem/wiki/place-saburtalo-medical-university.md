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
hub_position: 4
lat: 41.7273
lng: 44.7638
nearest_corner: budapest-st-x-panjikidze-st
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-medical-university.md
---

# Medical University metro (სამედიცინო უნივერსიტეტი) — Saburtalo Hub 4

**Summary**: Transport hub (metro, east exit) for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 693 m NE of the home-locus; nearest CAST corner is the **Lion** (Budapest St x Panjikidze St), 250 m away — inside the first frame. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-medical-university
lat: 41.7273
long: 44.7638
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7273, 44.7638, Medical University metro
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Transport hub (metro, east exit) |
| **Walk-palace position** | Hub #4 of 7 — NE of home, 693 m |
| **CAST corner** | Lion — Budapest St x Panjikidze St (250 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | NE of the home-locus; inside the first frame |
| **REMAPS scene** | A wall of white-coated medical students pours out of the turnstiles like a foam wave; the wave crashes against an invisible glass that is the metro-station boundary |
| **PAO (optional)** | Person: Vakhtang Bochorishvili (the namesake of the home hub, 700 m SW) · Action: lecturing · Object: a giant pulsing brain held up like a globe |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Thursday**, the end of the east-rung walk: Owl → Lion (274 m along Budapest), station 250 m off the Lion corner. Metro home.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only lion` for the corner's dial after the walk

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
| W | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | 483 m |
| SW | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | 693 m |
| SW | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | 1208 m |
| W | [place-saburtalo-delisi](./place-saburtalo-delisi.md) | 1550 m |
| NW | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | 2366 m |
| SW | [place-saburtalo-cemetery](./place-saburtalo-cemetery.md) | 2644 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. A wall of white-coated medical students pours out of the tur
2. The Lion corner 250 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Medical University metro = Saburtalo hub 4, NE of home, transport
2. Distinguisher: the metro at the frame's **east** exit (past the Owl along Budapest, the Lion) — vs Delisi at the west exit
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Lion corner, say its dial, then the 250 m to the hub
2. Fire the scene
3. Decode: transport hub (metro, east exit), NE of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 page put this station 1.6 km west of where it is (the metro near the old pin is Delisi); trust the OSM bearing

## L — Predict (ORACLE)
1. NE of home on the frame → predict Medical University metro
2. The Lion corner → predict this hub 250 m off it

## R — Act (GRACE)
1. Walking past → mutter "Medical University metro · NE · hub 4"
2. Recall failure → re-walk from the Lion corner, not from a map
