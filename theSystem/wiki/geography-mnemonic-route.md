---
palace: tactical-memory
level: 3
domain: 7
room: 4
tags:
  - mnemonic-route
  - geography
  - spatial-memory
date: 2026-05-29
semantic_mode: 5
wiki_source: wiki/learning-systems/geography-mnemonic-route.md
---

# Geography Mnemonic Route

**Summary**: Generalization of the bible geography pipeline (BibleWorks workflow + `route-*.md` + `place-*.md` + Leaflet plugin) into a domain-agnostic protocol for memorizing world maps, country lists, capitals, regions, and journey-shaped geographies. Pairs a continent-walls [memory-palace](./memory-palace.md) for hierarchy with [PAO](./person-action-object-system.md) for capital encoding and per-place Leaflet anchors for clickable retrieval inside Obsidian.

**Sources**:
- wiki/spirituality/bible-bibleworks-workflow.md (workflow reference)
- wiki/spirituality/bible/place-jerusalem.md (place template, lifted)
- wiki/spirituality/bible/route-exodus-route.md (route template, lifted)
- wiki/career-mission/obsidian-plugin-stack.md (Leaflet syntax canon)
- wiki/learning-systems/memory-palace.md
- wiki/learning-systems/eye-movement-and-compass-mnemonics.md
- wiki/learning-systems/person-action-object-system.md

**Last updated**: 2026-09-05 (drill-ladder rung count cited); 2026-05-30

---

## Purpose

The wiki has full geography infrastructure scoped to scripture. This page lifts that infrastructure into a general-purpose protocol so the same machinery can serve world geography, country lists, regional history, travel routes, and any domain whose retrieval surface is a map.

Three problems to solve:

1. **Hierarchy** — there are ~195 countries; raw enumeration overflows working memory. Solution: [memory-palace](./memory-palace.md) keyed to continent-walls.
2. **Capitals and place-attributes** — names are abstract phonological strings; need an image bridge. Solution: [PAO](./person-action-object-system.md).
3. **Spatial relations** — which country borders which, which is north of which. Solution: Leaflet plugin renders the map *in the wiki*, so retrieval and verification share a surface.

## World Palace — Continent Walls

Use a single octagonal room with eight walls. Each wall is a continent or sub-region. Within each wall, place loci in **compass-walking order** ([eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)) so the geographic and palatial directions stay congruent.

| Wall | Region | Walking direction | Notes |
|---|---|---|---|
| N | Europe | W → E | Iberia → Russia |
| NE | Middle East + Caucasus | N → S | Georgia → Yemen |
| E | Asia (continental) | N → S | Mongolia → Indonesia |
| SE | Oceania | NW → SE | PNG → New Zealand |
| S | Sub-Saharan Africa | N → S | Sahel → Cape |
| SW | Latin America | N → S | Mexico → Patagonia |
| W | North America | N → S | Canada → Central America |
| NW | North Africa + Mediterranean rim | W → E | Morocco → Egypt |

**Why eight walls, not seven continents.** Standard 7-continent taxonomy bunches Europe + Asia in awkward ways and leaves the Middle East and North Africa without a clean home. The 8-wall split aligns palace-walking with cultural/historical clusters that survive in news, history, and trade.

**Compass congruence rule.** Inside each wall, the order you walk loci matches the order the actual map runs in that same compass direction. This costs nothing and makes the eye-movement layer of [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) available for free.

## Per-Continent Sub-Routes

Each wall hosts a **mini-route** through its countries. Use roughly one locus per country (or one per cluster for dense regions like the Balkans). Two sizing rules:

- **≤ 12 countries** in the region → one locus per country.
- **> 12 countries** → cluster by sub-region (e.g. Balkans, Maghreb, Sahel, Central America) and nest a sub-route inside the cluster locus.

This keeps any one walking sweep under [working-memory](./working-memory.md) limits.

## Capitals via PAO

Each country is a **place** in the palace; its capital is encoded as a **PAO triple** acted out at that place, per [PAO](./person-action-object-system.md).

Worked example — France · Paris:

| Slot | Value |
|---|---|
| Place (palace locus) | hexagonal stone tower on the Europe wall, position 4 |
| Person | Napoleon |
| Action | crowning |
| Object | the Eiffel tower as a sceptre |

Retrieval flow: walk to the Europe wall → step 4 → see Napoleon crowning himself with a tower-sceptre → decode: France · Paris.

Worked instance: [place-paris](./place-paris.md) (pressure-tests the template under non-bible conditions).

**Pronunciation hooks** for non-obvious capitals (e.g. Ulaanbaatar, Ouagadougou, Antananarivo) belong in NEDF Name-hook slots; use [SPM](./substitute-word-system.md) to bridge phonology before slotting into the PAO.

## Place Pages — Lifted From Bible Template

For any place that needs its own depth (a capital you're studying, a city you've visited, a region with sub-structure), create a `place-*.md` modeled on the bible template:

```markdown
---
palace: tactical-memory
level: 3
domain: 7
tags:
  - geography/place
lat: <decimal>
lng: <decimal>
date: <date>
---

# <Place name> — Geographic Location

**Summary**: <one line>

**Sources**: <atlas / source URLs>

**Last updated**: <date>

---

## Map

```leaflet
id: place-<slug>
lat: <decimal>
long: <decimal>
zoom: 10
height: 400px
width: 100%
marker: default, <lat>, <lng>, <Place name>
```

## Description

- Region:
- Coordinates: <lat> N, <lng> E
- Elevation:
- Climate band:

## Significance

1.
2.
3.

## Key landmarks

| Landmark | Lat | Lng | Significance |
|---|---|---|---|
| | | | |

## Related pages

- [[geography-mnemonic-route]]
```

(Lifted near-verbatim from bible-bibleworks-workflow § place template. Pressure-test deltas surfaced by [place-paris](./place-paris.md): `tags: bible/place` → `geography/place`; `## Biblical Significance` → `## Significance`; `## Key Events Here` → `## Key Landmarks`; `## People Associated` and `## CAST Connections` dropped for city-as-itself pages.)

## Route Pages — For Journeys

For multi-stop geographies (Silk Road, Trans-Siberian, Inca Empire frontier, the 7 wonders), create a `route-*.md` modeled on `route-exodus-route.md`:

```markdown
---
palace: tactical-memory
level: 3
domain: 7
tags:
  - geography/route
route: <name>
date: <date>
---

# <Route name> — Journey Route

```leaflet
id: route-<slug>
lat: <center-lat>
long: <center-lng>
zoom: 5
height: 500px
width: 100%
marker: default, <lat1>, <lng1>, 1. <waypoint1>
marker: default, <lat2>, <lng2>, 2. <waypoint2>
...
```

## Waypoints
1. <waypoint1>
2. <waypoint2>

## Stage notes
| Stage | From | To | Distance | Key event |
|---|---|---|---|---|
```

## Static Fallback

Every Leaflet block also gets a PNG fallback in `wiki/diagrams/` per obsidian-plugin-stack discipline. The PNG is the canonical artifact when the plugin isn't installed or when the page is read on GitHub.

## Drill Ladder

The retrieval gym for this route — modeled on [palace-classification-drill-ladder](./palace-classification-drill-ladder.md):

| Rung | Cue | Response | Pass-floor |
|---|---|---|---|
| 0 | Continent name | List walls in order (8) | 100% in 30s |
| 1 | Wall | Walk locus order, name countries | 90% in 60s per wall |
| 2 | Country | Capital (decode PAO) | 90% in 5s per item |
| 3 | Capital | Country | 90% in 5s per item |
| 4 | Two countries | Compass direction between them | 90% in 3s |
| 5 | Country | All bordering countries | 90% in 15s |
| 6 | Region | Trace a route through ≥5 capitals | <60s, no backtrack |
| 7 | Blind map | Place 20 cities on lat/lng grid | ±2° per city |

## METER Integration

This page is a [METER](./meter-overview.md)-instrumented protocol. Events to fire:

- `geo.palace_walk_complete` — full 8-wall sweep finished, time + miss-count
- `geo.pao_capital_pass` — capital decoded correctly inside pass-floor time
- `geo.compass_relation_pass` — country-to-country direction correct
- `geo.route_trace_pass` — multi-stop route traced without backtrack
- `geo.blind_map_drift` — lat/lng error in degrees (rung 7)

Substrate-layer reads ([bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) · [PULSE](./pulse-overview.md)) apply as elsewhere — geography drills are spatial-memory-heavy and degrade fast under sleep debt.

## Mnemonic

**WALL · WALK · PAO · LEAF** (W·W·P·L)

- **WALL** — assign continents to the eight walls of the world palace
- **WALK** — sub-route inside each wall runs in real compass order
- **PAO** — country (place) + Person + Action + Object encodes the capital
- **LEAF** — Leaflet plugin renders the map inside the wiki so retrieval and verification share a surface

## Memory Checksum

1. Name the 8 walls of the world palace in order (N · NE · E · SE · S · SW · W · NW; pair each with its region).
2. State the compass congruence rule.
3. Give one country, the PAO triple for its capital, and the wall + position it sits at.

Pass-floor: all three answered in under 60 seconds. If you can do (1) and (3) but blank on (2), the page is mechanically encoded but the *why* (free eye-movement layer) hasn't landed.

## Visual

![World Palace 8-wall floor plan](../diagrams/geography-world-palace.png)

Top-down floor plan of the octagonal World Palace. 8 walls labeled with continent + walking direction; central WORLD PALACE block; the Europe-wall worked example (FRANCE at position 4, Napoleon-crowning-with-Eiffel-sceptre PAO scene) called out in orange; mnemonic block (W·W·P·L); compass congruence rule; 8-rung drill ladder (rungs numbered per [skill-progression-stages](./skill-progression-stages.md)). Cardinal walls in blue (#1971c2), intercardinal in purple (#9c36b5), worked PAO scene in orange (#e8590c). Built via Excalidraw. Default world style for narrative scene expansions of individual PAO loci is [world-velvet-aeon](./world-velvet-aeon.md).

## Anti-Patterns

- **One mega-route through 195 countries.** Breaks at locus ~30. Always cluster by continent first.
- **Random walking order inside a wall.** Loses the free eye-movement layer. Always walk in real compass direction.
- **Skipping PAO and relying on raw country-capital pairs.** Works for ~20 well-known capitals; collapses past that. PAO is non-negotiable for the long tail.
- **Leaflet-only with no PNG fallback.** Page becomes unreadable on GitHub and in any Obsidian install missing the plugin. Always ship both.
- **Drilling at rung 2 (capitals) without rung 0–1 (palace structure).** Capitals encode fine but you can't *find* them under time pressure because the room layout isn't fluent.

## Related Pages

- [memory-palace](./memory-palace.md) · [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md)
- [person-action-object-system](./person-action-object-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) · [trigonometry-compass-palace](./trigonometry-compass-palace.md)
- [mnemonic-methods-master](./mnemonic-methods-master.md) (Tier 4 — domain overlay)
- obsidian-plugin-stack (Leaflet canon)
- bible-bibleworks-workflow (source workflow)
- [substitute-word-system](./substitute-word-system.md) (for non-obvious capital phonology)
- [palace-classification-drill-ladder](./palace-classification-drill-ladder.md) (drill ladder pattern)
- [meter-overview](./meter-overview.md)
- [place-paris](./place-paris.md) (first non-bible worked place)
- world-flags-deck (flag-recall instance — the visual-emblem layer this route doesn't cover; same World-Palace chunking, confusability-first encoding)

---

## U — See (CAST)
1. World map as palace; continents as walls; countries as loci
2. Capitals as PAO triples acted out at each locus

## D — Name (NEDF)
1. Geography mnemonic route = world palace + PAO + Leaflet
2. Distinguisher: compass-congruent walking order (vs arbitrary loci sequence)
3. Failure mode: skipping palace structure, drilling capitals on raw lists

## F — Do (SPEAR)
1. Assign continent → wall
2. Walk wall in compass order, place country loci
3. Encode each capital as PAO at its locus
4. Render with Leaflet + PNG fallback
5. Drill ladder rungs 0 → 7

## B — Watch (HEART)
1. Locus collision inside dense regions (Balkans, Central America)
2. PAO drift — same Person reused across countries
3. Compass-congruence breaks when re-walking from memory

## L — Predict (ORACLE)
1. Wall → predict country sweep order
2. Country → predict bordering countries by walking neighbors
3. Capital → predict country via PAO inversion

## R — Act (GRACE)
1. New country to learn → place in correct wall, assign PAO
2. Capital recall failure → restage walk to that wall, re-fire PAO scene
3. Atlas update / border change → edit the locus, not the whole palace
