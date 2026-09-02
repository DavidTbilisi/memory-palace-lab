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
hub_position: 4
lat: 41.7286
lng: 44.7521
phase: 1
date: 2026-05-30
wiki_source: wiki/learning-systems/places/place-saburtalo-aversi.md
---

# Aversi Clinic — Saburtalo Hub 4

**Summary**: North-central medical anchor for the Saburtalo district palace per [neighborhood-palace](./neighborhood-palace.md). Sits just north of Bakhtrioni St between Bochorishvili and Medical University metro — the "second medical" along the central arterial. Coordinates approximate — replace with GPS-walked values at Phase 0.

**Sources**:
- wiki/learning-systems/neighborhood-palace.md (encoding home)
- Tbilisi map screenshot 2026-05-30

**Last updated**: 2026-05-30

---

## Map

```leaflet
id: place-saburtalo-aversi
lat: 41.7286
long: 44.7521
zoom: 17
height: 350px
width: 100%
unit: meters
marker: default, 41.7286, 44.7521, Aversi Clinic
```

## District Palace Encoding

| Slot | Value |
|---|---|
| **District** | Saburtalo |
| **Role** | Medical anchor (pharmacy/clinic chain) — secondary to Bochorishvili |
| **Walk-palace position** | Hub #4 of 6 |
| **Compass role** | Just north of Bakhtrioni's centre; between Bochorishvili (S, home-locus) and Medical University (E, transport hub) |
| **REMAPS scene** | Giant prescription pill bottles stacked like Jenga blocks tower above the clinic; the top bottle wobbles and topples in slow motion, scattering glowing capsules across Bakhtrioni St |
| **PAO (optional)** | Person: pharmacist-giant · Action: stacking and accidentally toppling · Object: Jenga-tower of pill bottles |

## Walk Plan — Phase 1

- **Day encoded**: Monday (Bakhtrioni E→W walk — encoded alongside Bochorishvili and Medical University; this is the "tight cluster" of three medical hubs that anchors the central arterial)
- **Reverse walk**: Tuesday
- **Drill cadence**: rung 0 daily; pair-drill with Bochorishvili from week 2 (the discriminator: King-with-beaker vs Pill-Jenga)

## Corners (capillary capture for Phase 3)

| Corner | What's there | REMAPS hook |
|---|---|---|
| NW | | |
| NE | | |
| SW | | |
| SE | | |

## Bordering Hubs

| Direction | Hub | Approx distance |
|---|---|---|
| S (across Bakhtrioni) | [place-saburtalo-bochorishvili](./place-saburtalo-bochorishvili.md) | ~150m |
| E (along Bakhtrioni) | [place-saburtalo-medical-university](./place-saburtalo-medical-university.md) | ~500m |
| N (up Shalva Nutsubidze) | [place-saburtalo-mardaleishvili](./place-saburtalo-mardaleishvili.md) | ~600m |

## Why the tight medical cluster is a discrimination risk

Three of the six Saburtalo hubs are medical (Bochorishvili, Aversi, Medical University). That's a discrimination risk per [NEDF](./nedf-overview.md) Distinguisher discipline. Mitigation: each gets a **structurally different REMAPS object class**:

- **Bochorishvili** → human + beaker (alchemy-vibe)
- **Aversi** → objects-only Jenga (kinetic-collapse vibe)
- **Medical University** → fluid wave (crowd-flow vibe)

Three distinct sensory channels (visual-alchemical / kinetic-stacked / fluid-crowd) prevent the cluster from collapsing into "the medical area" undifferentiated.

## Related Pages

- [neighborhood-palace](./neighborhood-palace.md) (encoding home)
- [geography-mnemonic-route](./geography-mnemonic-route.md)
- [nedf-overview](./nedf-overview.md) (the Distinguisher discipline that drives the discrimination design above)
- [memory-palace](./memory-palace.md) · [remaps](./remaps.md)

---

## U — See (CAST)
1. Pill-bottle Jenga toppling onto Bakhtrioni
2. Glowing capsules scattering

## D — Name (NEDF)
1. Aversi Clinic = secondary medical hub, just N of Bakhtrioni mid-point
2. Distinguisher: kinetic-Jenga (vs King-beaker / metro-wave for the other two medical hubs)
3. Failure mode: cluster-collapse with Bochorishvili — they're only ~150m apart

## F — Do (SPEAR)
1. Walk Bakhtrioni mid → glance N
2. Fire Jenga-collapse scene
3. Decode: Aversi, secondary medical, N side

## B — Watch (HEART)
1. Cluster-collapse with Bochorishvili
2. Scene fatigue (Jenga starts feeling generic) — re-vivify with bottle-label specifics

## L — Predict (ORACLE)
1. Bakhtrioni N-side mid → predict Aversi
2. Jenga imagery → predict Aversi not the other two medical hubs

## R — Act (GRACE)
1. Walk past → mutter "Aversi · N side · Jenga"
2. Recall confusion with Bochorishvili → restage discrimination (King-beaker = S of street; Jenga = N of street)
