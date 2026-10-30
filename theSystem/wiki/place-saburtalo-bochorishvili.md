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
hub_position: 1
lat: 41.7235
lng: 44.7572
nearest_corner: mitskevich-st-x-tandzia-st
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-bochorishvili.md
---

# Academician Vakhtang Bochorishvili Medical Center (აკადემიკოს ვახტანგ ბოჭორიშვილის სამედიცინო ცენტრი) — Saburtalo Hub 1

**Summary**: Home-locus (medical centre) for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). 0 m N of the home-locus (this *is* the home-locus); nearest CAST corner is the **Kangaroo** (Mitskevich St x Tandzia St), 221 m away — inside the first frame. Coordinates from OpenStreetMap (2026-09-18), replacing the 2026-05-30 screenshot estimate; GPS-walk to confirm.

**Sources**:
- [neighborhood-palace](./neighborhood-palace.md) §Worked example (encoding home; OSM check + redrafted week 1, 2026-09-18)
- `tools/cast-graphs/saburtalo-skeleton.json` — © OpenStreetMap contributors, ODbL
- Tbilisi map screenshot 2026-05-30 (superseded for coordinates and roles)

**Last updated**: 2026-09-18 (rebuilt on OSM — coordinates, nearest corner, bearings, distances, walk day; hub numbering now follows the redrafted week-1 walk order; REMAPS scene kept, one street name in it corrected); 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-bochorishvili
lat: 41.7235
long: 44.7572
zoom: 16
height: 350px
width: 100%
unit: meters
marker: default, 41.7235, 44.7572, Academician Vakhtang Bochorishvili Medical Center
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Home-locus (medical centre) |
| **Walk-palace position** | Hub #1 of 7 — N of home, 0 m |
| **CAST corner** | Kangaroo — Mitskevich St x Tandzia St (221 m); the hub hangs off this corner, it is not a node itself |
| **Compass role** | N of the home-locus; inside the first frame |
| **REMAPS scene** | A bearded medieval Georgian king (Vakhtang Gorgasali, district namesake's namesake) stands at the clinic door holding a glowing alchemical beaker; steam curls upward and writes the name "Tandzia" in the air — the clinic's own corner |
| **PAO (optional)** | Person: King Vakhtang Gorgasali · Action: holding/swirling · Object: glowing beaker labelled "Saburtalo" |

## Walk Plan — Week 1 (redrafted 2026-09-18)

- **Day encoded**: **Every day.** The walks start and end here; Raccoon (Vakeli × Kazbegi), 134 m along Tandzia, is the home corner. Encode the **rule card** here on Monday before leaving.
- **Drill**: rung 0 (compass to every other hub) daily from week 1; `python3 tools/cast_encode_log.py walk saburtalo-skeleton --only kangaroo` for the corner's dial after the walk

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
| SW | [place-saburtalo-central-park](./place-saburtalo-central-park.md) | 524 m |
| N | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | 609 m |
| NE | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | 693 m |
| W | [place-saburtalo-delisi](./place-saburtalo-delisi.md) | 1013 m |
| SW | [place-saburtalo-cemetery](./place-saburtalo-cemetery.md) | 1958 m |
| NW | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | 2139 m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. A bearded medieval Georgian king (Vakhtang Gorgasali
2. The Kangaroo corner 221 m away — the hub is a landmark hanging off a node, not the node

## D — Name (NEDF)
1. Academician Vakhtang Bochorishvili Medical Center = Saburtalo hub 1, N of home, medical · home-locus
2. Distinguisher: the only hub that is *home* — every walk starts and ends here; 221 m from the Kangaroo corner (Mitskevich × Tandzia)
3. Failure mode: scene-bleed with the other medical / transport hubs — keep this hub's imagery exclusive to it

## F — Do (SPEAR)
1. Walk to the Kangaroo corner, say its dial, then the 221 m to the hub
2. Fire the scene
3. Decode: home-locus (medical centre), N of home

## B — Watch (HEART)
1. Scene-bleed with neighbouring hubs
2. Compass drift — the 2026-05-30 pages had this hub placed from a screenshot; trust the OSM bearing

## L — Predict (ORACLE)
1. N of home on the frame → predict Academician Vakhtang Bochorishvili Medical Center
2. The Kangaroo corner → predict this hub 221 m off it

## R — Act (GRACE)
1. Walking past → mutter "Academician Vakhtang Bochorishvili Medical Center · N · hub 1"
2. Recall failure → re-walk from the Kangaroo corner, not from a map
