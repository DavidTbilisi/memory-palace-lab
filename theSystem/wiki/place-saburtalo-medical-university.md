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
hub_position: 1
lat: 41.7311
lng: 44.7457
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-medical-university.md
---

# Medical University Metro — Saburtalo Hub 1

**Summary**: NE-corner transport anchor for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). Daily commuter wave makes this the natural Phase-1 first hub to encode. Coordinates approximate — replace with GPS-walked values at Phase 0.

**Sources**:
- wiki/learning-systems/neighborhood-palace.md (encoding home)
- Tbilisi map screenshot 2026-05-30 (approximate coordinates pending GPS verification)

**Last updated**: 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-medical-university
lat: 41.7311
long: 44.7457
zoom: 17
height: 350px
width: 100%
unit: meters
marker: default, 41.7311, 44.7457, Medical University metro entrance
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Transport hub (metro entrance) |
| **Walk-palace position** | Hub #1 of 6 — NE corner |
| **Compass role** | NE boundary; first hub encountered walking N up Shalva Nutsubidze + E along Bakhtrioni |
| **REMAPS scene** | A wall of white-coated medical students pours out of the turnstiles like a foam wave; the wave crashes against an invisible glass that is the metro-station boundary |
| **PAO (optional)** | Person: Vakhtang Bochorishvili (the namesake of the next hub south) · Action: lecturing · Object: a giant pulsing brain held up like a globe |

## Walk Plan — Phase 1

- **Day encoded**: Monday (Bakhtrioni E→W walk passes here as the eastern endpoint of the arterial; encode together with Bochorishvili)
- **Reverse walk**: Tuesday (Bakhtrioni W→E)
- **Drill cadence**: rung 0 daily from week 1

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | | |
| NE | | |
| SW | | |
| SE | | |

(Fill in as you walk each corner. Each corner should get a distinguishing object — bakery, kiosk, statue, distinctive tree, weird signage. Concrete-first per [representation-rules](./representation-rules.md).)

## Bordering Hubs

| Direction | Hub | Approx distance |
|---|---|---|
| W (along Bakhtrioni) | [place-saburtalo-aversi](./place-saburtalo-aversi.md) | ~500m |
| SW (down side street) | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | ~600m |
| N (Shalva Nutsubidze) | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | ~700m |

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md) (parent at world scale)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md) · [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)

---

## U — See (CAST)
1. White-coated wave pouring from turnstiles
2. Glass-boundary metro station as palace locus

## D — Name (NEDF)
1. Medical University metro = NE corner transport hub of Saburtalo
2. Distinguisher: only metro entrance in Saburtalo (vs Bochorishvili = clinic, Aversi = pharmacy chain)
3. Failure mode: collision with other "medical-themed" hub scenes (Aversi pill bottles, Bochorishvili king-beaker) — keep wave-imagery exclusive to this hub

## F — Do (SPEAR)
1. Approach via Bakhtrioni from W or Shalva Nutsubidze from S
2. Fire wave-scene
3. Decode: transport hub, NE corner, Saburtalo

## B — Watch (HEART)
1. Scene-bleed with neighbouring medical hubs
2. Compass drift (am I sure this is NE not NW?)

## L — Predict (ORACLE)
1. NE-most marker on Saburtalo map → predict Medical University
2. Wave imagery → predict turnstile / metro

## R — Act (GRACE)
1. Walking past → mutter "Medical University · NE · wave"
2. Recall failure → restage Bakhtrioni walk from W end
