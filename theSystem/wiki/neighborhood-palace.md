---
palace: tactical-memory
level: 3
domain: 7
room: 4
tags:
  - mnemonic-route
  - geography
  - spatial-memory
  - navigation
  - hippocampus
date: 2026-05-30
semantic_mode: 5
wiki_source: wiki/learning-systems/neighborhood-palace.md
---

# Neighborhood Palace

**Summary**: Local-scale sister of [geography-mnemonic-route](./geography-mnemonic-route.md). Protocol for holding the street network of a district — and eventually a whole city — in your head with cabbie-grade fluency: hear any address, know where it is; given any two points, route between them; reroute around blockages on demand. Layers physical walking (the biological substrate, per Maguire 2000) with [CAST](./cast-overview.md) graph encoding, [memory-palace](./memory-palace.md) walk-routes, [REMAPS](./remaps.md) junction scenes, and a compass-discipline at every intersection. Mnemonic: **PACE** (Physical-walking · Anchor-hubs · CAST-graph · Eye-compass).

**Sources**:
- Maguire E A et al. 2000, *Navigation-related structural change in the hippocampi of taxi drivers*, PNAS 97(8):4398–4403 (London cabbie posterior-hippocampus finding)
- Woollett K & Maguire E A 2011, *Acquiring "the Knowledge" of London's layout drives structural brain changes*, Current Biology 21(24):2109–2114 (longitudinal — change is acquired, not selected)
- Maguire E A et al. 2006, *London taxi drivers and bus drivers: a structural MRI and neuropsychological analysis*, Hippocampus 16(12):1091–1101 (bus drivers — fixed routes — don't show the change)
- wiki/learning-systems/geography-mnemonic-route.md (parent at city/world scale)
- wiki/learning-systems/memory-palace.md
- wiki/encoders/cast-overview.md
- wiki/learning-systems/eye-movement-and-compass-mnemonics.md
- wiki/learning-systems/bdnf-and-neurogenesis.md (biological substrate)
- wiki/learning-systems/sleep-dependent-memory-consolidation.md

**Last updated**: 2026-05-30

---

## Purpose

[geography-mnemonic-route](./geography-mnemonic-route.md) sits at world/country scale (~195 capitals, continent walls, PAO per country). This page sits one zoom level deeper: the street network you actually walk through every day. The end-state goal is **operational, not academic** — orient and route like a taxi driver, without a map, in real time, under stress.

The neuroscience grounding matters because it sets the floor. Maguire et al. found that licensed London taxi drivers — who pass "The Knowledge" (~25,000 streets + ~20,000 landmarks) — have **measurably larger posterior hippocampi** than controls. Woollett & Maguire 2011 showed longitudinally that the change is *acquired during 3–4 years of training*, not selected for. Maguire 2006 showed London bus drivers (who run fixed routes) **do not** show the change — it's the active-graph-traversal that drives the hippocampal growth, not just being on the streets.

This rules in three things and rules out three things.

**Rules in**: (1) physical walking is the substrate; (2) graph topology (not just spatial location) is what the hippocampus is wiring; (3) sleep consolidation is non-negotiable per day-of-encoding.

**Rules out**: (1) map study alone — doesn't build the substrate; (2) one-direction route memorization — bus drivers proved this insufficient; (3) crash courses — the biological consolidation rate is a hard floor.

## PACE — the four primitives

| Letter | Primitive | What it means operationally |
|---|---|---|
| **P** | **Physical walking** | You walk every street you encode. No exceptions. This is what builds the hippocampal substrate (Maguire). Reading street names off a map ≠ knowing them. |
| **A** | **Anchor hubs** | Pick 5–8 vivid landmarks (square, metro, church, park, school, hospital). Each becomes a palace locus with a [REMAPS](./remaps.md) scene. All other streets hang off these anchors. |
| **C** | **CAST graph** | Junctions are [CAST](./cast-overview.md) nodes; streets are CAST edges. Encoding the graph (not just the loci) is what makes routing possible. |
| **E** | **Eye-compass** | At every junction, name N/S/E/W out loud. This is the orientation discipline that turns spatial recall into navigation, per [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md). |

Drop any one of PACE and the method degrades into a different (weaker) method:

- Drop **P** → map-study; no hippocampal growth.
- Drop **A** → flat street list; collapses past ~30 items.
- Drop **C** → palace of unconnected loci; you remember streets but can't route between them.
- Drop **E** → recall without orientation; you know where things are but can't say which way to turn.

## The four phases — district build-out

A district = 100–200 streets, walkable in 1–3 weeks of evening walks. This is the unit the method is designed around.

### Phase 1 — Skeleton (week 1)

1. **Pick the 5–8 hubs.** Main square, metro/bus terminal, biggest church, biggest park, biggest school/hospital, main intersection.
2. **Identify 3–5 arterials.** The big streets the whole district hangs off — usually those carrying public transport.
3. **Walk each arterial end-to-end**, saying every cross-street name out loud as you reach it.
4. **REMAPS each hub** as a vivid scene. Metro = waterfall of commuters. Church = bell-tower with a fox inside. Concrete, kinetic, weird.
5. **End-of-phase test**: stand at any hub, point to every other hub without looking. Pass = 100% in under 30s.

### Phase 2 — Edge list (weeks 2–3)

For each arterial, build a [memory-palace](./memory-palace.md) walking route through its cross-streets:

```
arterial            = palace corridor
cross-street #1     = first locus (one block)
cross-street #2     = next locus
…
walking N→S         = walking the corridor in order
```

Per cross-street locus:

- **REMAPS scene** keyed to the name ([SPM](./substitute-word-system.md) for hard phonologies)
- **Compass tag** — does this cross-street run E–W, N–S, diagonal?
- **One-block CAST sub-graph** — what's at each of the four corners (bakery, kiosk, statue, dead tree)

You can now: hear any cross-street name → know which arterial it crosses → know roughly where on the arterial → know what's at the corner.

### Phase 3 — Capillaries (weeks 4–7)

The non-arterial streets. Walk them in **systematic sweeps** — every Saturday morning, cover one sub-zone, naming every street as you go. Add each as a sub-locus of its nearest hub or arterial.

Don't try to encode all at once. The hippocampus needs **multiple physical exposures with sleep in between** ([bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) + [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md)) — that's why cabbies take 3–4 years for the full 25,000-street Knowledge, not 3–4 weeks.

### Phase 4 — Reverse walks (ongoing, non-optional)

Walk every encoded route **in reverse** at least once. This is the discipline that makes the encoding bidirectional. Without it you'll be a one-way taxi — capable of "home to bakery" but not "bakery to home" without re-deriving from scratch.

This phase is what separates the Neural OS protocol from the Maguire bus-driver baseline: bus drivers walk fixed routes one direction; cabbies walk the graph from arbitrary start to arbitrary end. Reverse-walking is the cheapest way to force the bidirectional encoding the cabbie hippocampus is built from.

## Drill ladder

| Rung | Cue | Response | Pass-floor | METER event |
|---|---|---|---|---|
| 0 | Hub name | Compass direction to every other hub | 100% in 30s | `nbh.hub_compass_pass` |
| 1 | Arterial name | List cross-streets in order | 90% in 60s per arterial | `nbh.arterial_traversal_pass` |
| 2 | Street name | Arterial it crosses + neighborhood | 90% in 5s | `nbh.street_locate_pass` |
| 3 | Two addresses | Walking route between them (turn-by-turn) | <60s, no backtrack | `nbh.route_synthesis_pass` |
| 4 | Address | Three different routes to get there | <90s | `nbh.route_diversity_pass` |
| 5 | "At X, blocked at Y" | Detour route around blockage | <30s | `nbh.detour_pass` |
| 6 | Address heard cold | Point to rough location on imaginary district map (eyes closed) | ±50m | `nbh.blind_locate_pass` |
| 7 | New street you've never walked | Predict from name + cross-street pattern where it sits | ±200m | `nbh.inference_pass` |

Rung 7 is the cabbie-grade. Cabbies can do it because the encoded graph has enough density that new edges slot into known regions by interpolation.

## Time-to-fluency — what the encoder stack buys you

The Neural OS stack ([CAST](./cast-overview.md) + [NEDF](./nedf-overview.md) + [REMAPS](./remaps.md) + glyph grammar for junctions + recognition gym for names + [motoric](./hand-to-letter-system.md) for walked-mutter + [BDNF](./bdnf-and-neurogenesis.md) substrate) compresses **active encoding hours** by roughly **2.5–3.5×** vs naive walk-only learning. It does **not** compress the **calendar floor** — that's set by hippocampal consolidation, which is biological and non-negotiable.

| Streets | What that gets you | Naive active hours | With full stack | Calendar floor (biology) |
|---|---|---|---|---|
| 5 | Your block + corners | 2 | ~1 | one session |
| 20 | Micro-neighborhood | 10 | ~4 | ~1 week |
| 50 | "Where I live" — 15-min radius | 30 | ~12 | 2–3 weeks |
| **100** | **A full district** — first cabbie-grade unit | **80** | **~30** | **6–8 weeks** |
| 200 | District + 1 adjacent | 200 | ~70 | 3–4 months |
| 500 | Small-city core (3–4 districts) | 600 | ~200 | 8–10 months |
| 1,000 | Mid-sized district capital | 1,500 | ~500 | 1.5–2 years |
| 5,000 | Mid-sized city, full coverage | 5,000 | ~1,800 | 4–5 years |
| 25,000 | London-cabbie / megacity | 5,000–8,000 (Maguire) | ~3,000–4,000 | 3–4 years (full-time) |

**The honest framing**: the stack moves a 100-street district from a 5-month project to a 6–8 week project at 30 min/day. It does **not** turn you into a cabbie in a month. The floor at the top (25,000-street regime) compresses by ~30–50% rather than 3× because the cabbie figure already includes informal mnemonics; the stack adds *structure* (CAST topology, NEDF distinguisher discipline, drill rung floors, METER instrumentation) on top of what cabbies have always done informally.

### Two practice rates

| Track | Hours/day | Sustainable ceiling |
|---|---|---|
| Hobby | 30 min/day | ~500–1,000 streets before maintenance treadmill catches up |
| Serious | 2 hr/day | ~5,000–25,000 (cabbie regime) |

The maintenance treadmill: ~1 minute review/day per 100 streets encoded. At 2,000 streets you spend 20 min/day *before* any new learning. This is the actual reason cabbies do full-time — past ~1,000 streets, hobby pace can't out-encode the decay.

## City scale — the layer above district

Once you have one district fluently, the city becomes a **graph of districts**, not a graph of streets. Re-use the [World Palace](./geography-mnemonic-route.md) pattern at city scale:

1. **Each district = one locus** in the city palace. The whole district is now a single chunk (the way locals talk: "I live in Vake," not "I live at 47 Chavchavadze Ave").
2. **District-spanning arterials** (boulevards crossing 3+ districts) become **routes** in the route-*.md sense — multi-stop journeys. Each "stop" is a district boundary or major intersection.
3. **Districts adjacent to yours** get **partial encoding** — hubs + arterials only, no capillaries. (Cabbies have full Knowledge for central London but degraded resolution for outer zones — same pattern.)
4. **Cross-district routing** uses the arterial graph: source district → arterial to bridge district → arterial to destination district. You don't memorize every cross-city route; you memorize the **arterial transfer rules**.

A city is therefore: ~10 fully-encoded districts (your home district + immediate neighbors) + ~20 hub-only districts (further out) + the arterial graph that binds them.

## W3W — precision layer for personal anchors

Per [geography-mnemonic-route](./geography-mnemonic-route.md#what3words), use [W3W](https://what3words.com) for **personal anchors only** — not for streets themselves:

| Anchor | W3W earns its place? |
|---|---|
| Your apartment door | ✅ |
| Corner café you go to daily | ✅ |
| Bus stop / metro entrance you use | ✅ |
| Spouse's office, kids' school | ✅ |
| Whole neighborhood (e.g. "Vake") | ❌ — too big, use the name |
| Whole street (e.g. "Chavchavadze Avenue") | ❌ — streets are linear, W3W is point |

## Worked example — Tbilisi · Saburtalo (primary)

Locked 2026-05-30. Saburtalo is the primary worked example for the first district build-out; Vake is queued as the adjacent-district step in Phase 2 of the city-scale rollout. Rationale: Soviet-era grid gives cleaner topology → faster path to rung 4 → better morale through the 6–8 week build. The avatar pin in the source screenshot sits on Bakhtrioni St, confirming Saburtalo as the home district.

### Saburtalo (Soviet-era grid; primary district)

**Scale**: ~150–250 named streets, ~5 km² walkable. Wider, more orthogonal streets — Soviet-era planning shows. Easier first district because the grid is more regular and most streets actually run N–S or E–W (vs Vake's organic spurs).

```leaflet
id: nbh-saburtalo
lat: 41.7270
long: 44.7480
zoom: 14
height: 500px
width: 100%
unit: meters
marker: default, 41.7311, 44.7457, [[place-saburtalo-medical-university|Medical University metro]]
marker: default, 41.7261, 44.7558, [[place-saburtalo-bochorishvili|Vakhtang Bochorishvili Clinic]]
marker: default, 41.7223, 44.7510, [[place-saburtalo-central-park|Central Park]]
marker: default, 41.7286, 44.7521, [[place-saburtalo-aversi|Aversi Clinic]]
marker: default, 41.7203, 44.7377, [[place-saburtalo-cemetery|Saburtalo Cemetery]]
marker: default, 41.7370, 44.7405, [[place-saburtalo-mardaleishvili|Mardaleishvili Medical Centre]]
```

*(Coordinates approximate from screenshot triangulation — verify in OSM/Maps before locking; Phase 0 of district build-out is to walk to each hub and replace lat/lng with the GPS-anchored value.)*

**Hubs (Phase 1)** — 6 anchors:

1. **Medical University metro** (NE) — transport hub; daily commuter wave. REMAPS scene: a wall of white-coated medical students pouring out of the turnstiles like a foam wave.
2. **Vakhtang Bochorishvili Clinic** (centre, near the avatar pin) — medical/landmark anchor. REMAPS: bearded medieval Georgian king (the historical Vakhtang Gorgasali) holding a glowing beaker.
3. **Central Park / ცენტრალური პარკი** (centre-south) — green space anchor. REMAPS: a giant fountain spraying upward with children-shaped water droplets.
4. **Aversi Clinic** (N of Bakhtrioni) — second medical anchor on the north spine. REMAPS: giant pill bottles stacked like Jenga blocks toppling onto the street.
5. **Saburtalo Cemetery** (SW corner) — south/west boundary anchor. REMAPS: stone angels turning their heads in unison toward the metro.
6. **Mardaleishvili Medical Centre** (NW corner, top-left) — north boundary anchor. REMAPS: a doctor in a red cross hat catapulting bandages over the rooftops.

**Arterials (Phase 1)** — 4 spines:

| Arterial | Direction | Notes |
|---|---|---|
| **University Street** | E ↔ W | Southern boundary spine; runs along Central Park's north side; named for the Tech University at its W end |
| **Bakhtrioni Street** | E ↔ W | Central spine; runs east into the Bochorishvili Clinic area; the avatar pin sits on this street |
| **Shalva Nutsubidze Street** | N ↔ S | Western boundary spine; runs from Mardaleishvili down past Saburtalo Cemetery |
| **Elguja Amashukeli Street** | E ↔ W | Northern spine; runs across the top below the M-Tsereteli/Mardaleishvili area |

(Also crossing: Mukhran Machavariani St in the extreme N; Viktor Dolidze St as a southern cross-link; Kazbegi Ave further W as the major outbound to Vazha-Pshavela.)

**Week-1 walk plan** (30 min/day track):

| Day | Walk | Encode | Drill |
|---|---|---|---|
| Mon | Bakhtrioni E → W end-to-end | REMAPS hubs Bochorishvili + Aversi; name every cross-street out loud | Rung 0: point hub→hub |
| Tue | Bakhtrioni W → E (REVERSE) | Same hubs from the other direction; lock bidirectional | Rung 0 + Rung 1 (Bakhtrioni cross-street list) |
| Wed | Rest — sleep consolidation. **Drill only**, no new encoding. | — | Rungs 0 + 1 from memory |
| Thu | University Street W → E | REMAPS Central Park + Medical University metro | Rung 0 |
| Fri | University E → W (REVERSE) + brief side-trip to Saburtalo Cemetery | REMAPS hub 5 | Rung 1 (both arterials) |
| Sat | Long walk: Shalva Nutsubidze N → S then E across Bakhtrioni | REMAPS Mardaleishvili (hub 6); first N–S arterial encoded | Rungs 0–2 |
| Sun | Rest + integrative drill — walk to one hub from another by memory, eyes-mostly-down | — | Rungs 0–2 mixed |

**Week-1 end-state**: 6 hubs encoded, 3 arterials walked bidirectionally with all cross-streets named, ~40–60 streets in the graph. Rungs 0–2 passing. Phase 2 (full edge-list) begins week 2.

### Vake — queued adjacent district (Phase 2)

After Saburtalo passes rung 4, Vake comes online as the adjacent-district encoding (cheap, because Heroes' Square is already encoded as Saburtalo's SE boundary hub). Full hubs + arterials retained below as the ready-to-execute Phase-2 plan.

**Scale**: ~200–350 named streets, ~6 km² walkable. More organic street network (older), Chavchavadze Avenue is the unambiguous central spine, side streets fan off it on both sides.

```leaflet
id: nbh-vake
lat: 41.7100
long: 44.7600
zoom: 14
height: 500px
width: 100%
unit: meters
marker: default, 41.7085, 44.7525, [[place-vake-park|Vake Park]]
marker: default, 41.7064, 44.7686, [[place-vake-mziuri|Mziuri Park]]
marker: default, 41.7089, 44.7740, [[place-vake-zoo|Tbilisi Zoo]]
marker: default, 41.7114, 44.7621, [[place-vake-pullman|Pullman / Axis Towers]]
marker: default, 41.7041, 44.7472, [[place-vake-ethnography-museum|Open Air Ethnography Museum]]
marker: default, 41.7159, 44.7610, [[place-vake-heroes-sq|Heroes' Square]]
```

*(Coordinates approximate — verify in OSM/Maps; lock by GPS-walk at Phase 0.)*

**Hubs (Phase 1)** — 6 anchors:

1. **Vake Park entrance** (NW of district) — iconic green anchor. REMAPS: Soviet-era stone heroes' fountain coming alive and marching down Chavchavadze.
2. **Mziuri Park** (E end, near zoo) — second green anchor along the southern spur. REMAPS: a river of children's laughter literally streaming through the trees.
3. **Tbilisi Zoo** (E) — landmark + somber 2015-flood memorial anchor. REMAPS: an elephant trumpeting on a tiled river-flood memorial floor.
4. **Pullman Tbilisi (Axis Towers)** (centre-N) — high-rise landmark visible from most of the district. REMAPS: twin glass mirrors reflecting each other into infinity.
5. **Giorgi Chitaia Open Air Museum of Ethnography** (SW, on the hill) — south boundary anchor. REMAPS: wooden Svan houses walking like giant chickens on stilts.
6. **Heroes' Square / Vake-Saburtalo junction** (NW corner) — the transit anchor between this district and Saburtalo. REMAPS: an enormous statue holding a metro sign in one hand and a road sign in the other.

**Arterials (Phase 1)** — 3 spines:

| Arterial | Direction | Notes |
|---|---|---|
| **Ilia Chavchavadze Avenue** | NE ↔ SW | THE Vake spine; runs from Heroes' Sq down to Vake Park area; the named poet's avenue and the district's identity |
| **Irakli Abashidze Street** | parallel to Chavchavadze | Quieter parallel — café-and-restaurant street; great for capillary REMAPS practice because the corners have vivid storefronts |
| **Petre Melikishvili / Vasil Barnov axis** | E ↔ W | Southern spine running toward the river embankment and into the Vera district |

(Also crossing: Titsian Tabidze St — short connector with a famous-poet name; Tsinandali; Kipshidze.)

**Week-1 walk plan**: same shape as Saburtalo above, swapping in:
- Mon/Tue: **Chavchavadze NE → SW then reverse** (the daily spine — encode this first or nothing else sticks)
- Thu/Fri: **Abashidze parallel walk** (cross-references half of Chavchavadze's cross-streets from one block south)
- Sat: **Petre Melikishvili E–W** to wire in the southern half + the Vera embankment connection

### Arterial polylines — GeoJSON file-overlay pattern

Per obsidian-plugin-stack canon, `geojson:` is a **file-path overlay**, not inline JSON. Store arterial polylines and district boundaries as `.geojson` files under `wiki/assets/geojson/` and reference by path:

````markdown
```leaflet
id: nbh-saburtalo-arterials
lat: 41.7270
long: 44.7480
zoom: 14
height: 500px
width: 100%
geojson: assets/geojson/saburtalo-arterials.geojson
```
````

File `wiki/assets/geojson/saburtalo-arterials.geojson` (standard GeoJSON 2008 — RFC 7946; longitude FIRST in coordinates, opposite of the `marker:` DSL):

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Bakhtrioni St", "stroke": "#e03131", "stroke-width": 4 },
      "geometry": { "type": "LineString", "coordinates": [[44.7385, 41.7261], [44.7558, 41.7261]] }
    },
    {
      "type": "Feature",
      "properties": { "name": "Shalva Nutsubidze St", "stroke": "#1971c2", "stroke-width": 4 },
      "geometry": { "type": "LineString", "coordinates": [[44.7405, 41.7370], [44.7377, 41.7203]] }
    },
    {
      "type": "Feature",
      "properties": { "name": "Saburtalo district boundary", "stroke": "#868e96", "stroke-width": 2, "fill": "#dee2e6", "fill-opacity": 0.15 },
      "geometry": { "type": "Polygon", "coordinates": [[[44.7355, 41.7385], [44.7585, 41.7385], [44.7585, 41.7195], [44.7355, 41.7195], [44.7355, 41.7385]]] }
    }
  ]
}
```

Colour-by-direction convention (so compass-congruence stays visible at a glance):

| Direction | Stroke | Hex |
|---|---|---|
| N–S | blue | `#1971c2` |
| E–W | red | `#e03131` |
| Diagonal / curved | purple | `#9c36b5` |
| District boundary | grey outline + light fill | `#868e96` stroke, `#dee2e6` fill |

**One file per district, plus one global file for city-spanning arterials.** Suggested layout:

```
wiki/assets/geojson/
├── tbilisi-city-arterials.geojson      # Chavchavadze ↔ Heroes' Sq ↔ Pekini ↔ Vazha-Pshavela; river embankment; Rustaveli
├── saburtalo-arterials.geojson         # Bakhtrioni, Shalva Nutsubidze, etc. + district polygon
├── vake-arterials.geojson              # Chavchavadze (Vake portion), Abashidze, Melikishvili + district polygon
└── …
```

This keeps the markdown clean (district pages just `geojson: …` once) and the geometry version-controlled in standard files any GIS tool can open.

### City-scale next step (after one district is fluent)

Once one district passes rung 4 (route synthesis), promote that district to a **single locus** in your city palace and start the adjacent district. Likely sequence given the screenshot:

1. **District 1**: Saburtalo or Vake (one of the above)
2. **District 2**: the other of the two (cheap — you'll already know the boundary at Heroes' Sq / Vake Park)
3. **District 3**: Vera / Tsereteli embankment (E across the river) — already partly visible in the screenshot: Art Palace, Karvasla, Ninia's Garden, Caucasus University, Nikoloz Baratashvili Bank as the embankment arterial
4. **District 4**: Mtatsminda (S, the funicular hill) and Old Tbilisi (further SE)
5. **District 5+**: Avlabari, Isani, Didube, Gldani, Nadzaladevi as hub-only encodings (no capillaries) until you decide one matters

The arterial graph that binds them: **Chavchavadze ↔ Heroes' Sq ↔ Pekini ↔ Vazha-Pshavela** (W backbone), **the river embankment** (E backbone), **Rustaveli Avenue** (S–N through Old Tbilisi up to Freedom Sq) as the historic spine.

### Recommendation (locked)

**Saburtalo locked as primary 2026-05-30**. Six hub stubs created under `wiki/learning-systems/places/` (each with Leaflet zoom-in + District Palace Encoding block + Phase-1 walk slot + capillary corners table); arterial GeoJSON at `wiki/assets/geojson/saburtalo-arterials.geojson` with 4 LineStrings (Bakhtrioni, Shalva Nutsubidze, University, Elguja Amashukeli) + district-boundary Polygon. All coordinates approximate from screenshot triangulation — Phase 0 of the build-out is to walk to each hub and replace with GPS-anchored values.

## Mnemonic

**PACE** — Physical-walking · Anchor-hubs · CAST-graph · Eye-compass

- **P** — Physical walking IS the substrate. No walk, no Knowledge.
- **A** — Anchor hubs are the load-bearing loci. 5–8 vivid REMAPS scenes per district.
- **C** — CAST graph: junctions = nodes, streets = edges. The graph is what enables routing.
- **E** — Eye-compass at every junction. Name N/S/E/W out loud. Turns recall into navigation.

## Memory Checksum

1. Name the four phases of district build-out (Skeleton · Edges · Capillaries · Reverse) and which one is non-optional for bidirectional traversal.
2. State the hard biological floor — what biological process can the Neural OS stack NOT speed up, and roughly how many weeks does it impose for a 100-street district?
3. For a real district you know, name 3 hub candidates, 2 arterials, and state the cabbie-grade test (rung 7) that proves you have it.

Pass-floor: all three answered in under 90 seconds without re-reading. Failure on (2) is the most diagnostic — if you don't internalize the biological floor, you'll over-promise yourself encoding speed and burn out at week 3.

## Visual — Two Layers

A neighborhood needs two complementary visual encodings, not one:

| Layer | Format | What it shows | Purpose |
|---|---|---|---|
| **Geo layer** | [Obsidian Leaflet plugin](https://github.com/javalent/obsidian-leaflet) per obsidian-plugin-stack | Real map, real coordinates, hubs as markers, arterials as polylines, district boundary as polygon | Clickable, accurate, verifiable in Maps/Google/OSM; used for verification, route-tracing rehearsal, and `place-*.md` linking |
| **Palace layer** | Excalidraw schematic (mirrors [geography-mnemonic-route](./geography-mnemonic-route.md) world palace visual) | Octagonal or rectangular floor plan with hubs as palace loci, arterials as labeled corridors, compass rose at centre | Encoding-friendly; what the brain actually rehearses; non-geographic distortion (a hub at a corner of the room, regardless of its real lat/lng) is a feature |

Both ship per district. The Leaflet block is canonical for **what is true on the ground**; the Excalidraw is canonical for **what is true in the palace**. They will deliberately disagree on layout — that's the whole point of palace encoding.

### Leaflet rendering pattern

The plugin supports four primitives we use at neighborhood scale:

| Primitive | Syntax | Use for |
|---|---|---|
| `marker:` | `marker: default, <lat>, <lng>, <label>` (label can be `wiki-link`) | The 5–8 hubs; major junctions; each landmark inside a hub's REMAPS scene |
| `geojson:` block (LineString) | embedded GeoJSON `LineString` | Arterials (3–5 per district); coloured by direction (N–S, E–W, diagonal) |
| `geojson:` block (Polygon) | embedded GeoJSON `Polygon` | District boundary; sub-zone clusters within district (Phase 3 capillary sweeps) |
| `image:` overlay | `image: <path>, <lat1>,<lng1>, <lat2>,<lng2>` | Compass rose at centre (rare; usually drawn into the Excalidraw layer instead) |

Frontmatter convention per `place-<district-name>.md`:

```yaml
---
palace: tactical-memory
level: 3
domain: 7
tags: [geography/place, geography/district]
city: Tbilisi
district: <district-name>
lat: <centre-lat>
lng: <centre-lng>
zoom: 14   # district scale — 13-15 typical; 16-17 for sub-zone deep-dives
date: <date>
---
```

### Palace-layer visual (Saburtalo, primary)

![Saburtalo District Palace floor plan](../diagrams/neighborhood-palace-saburtalo.png)

6 hubs as palace loci with REMAPS scene sketches; 4 arterials colour-coded by direction (red E–W, blue N–S); Bochorishvili home-locus highlighted in green with star marker ("fire FIRST in every drill"); compass rose at centre; PACE mnemonic + 4-phase ladder + week-1 walk plan + Phase-0 reminder shipped in side panels. Schematic — *not* geographic; the Leaflet block above is canonical for ground-truth, this floor plan is canonical for palace structure. They deliberately disagree on positioning.

### Hub-page fork

For dense districts, each hub becomes its own `places/place-<district>-<hub-slug>.md` modelled on [place-paris](./place-paris.md) — so the hub's Leaflet block can zoom in further, list per-corner landmarks, and carry its REMAPS scene description. The district page links to the hub pages; the hub pages link back. Same fractal pattern as bible: bible-study → place-jerusalem → place-jerusalem-temple-mount.

(Default narrative-scene style for hub REMAPS expansions is [world-velvet-aeon](./world-velvet-aeon.md).)

## Anti-Patterns

- **Map study without walking** — builds fragile visual recall, not the hippocampal substrate Maguire measured. Bus drivers do this; they don't grow hippocampi. *Walk the streets.*
- **Skipping Phase 4 (reverse walks)** — produces one-way fluency. You'll be a bus driver, not a cabbie.
- **Drilling capitals before walls** at the analogous level — drilling street names from a list before the hub-and-spoke skeleton is in place. The names encode fine in isolation; you can't *find* them under time pressure because the topology isn't fluent.
- **No compass discipline** at junctions — recall without orientation. You'll know where streets are but not which way to turn.
- **Trying to encode the whole district in one push** — sleep consolidation can't be rushed. 3–7 nights per district minimum, regardless of how many hours you spend encoding.
- **Grid encoding instead of walk-palace** (per the user-raised idea, validated against architecture and rejected as primary): grids fragment streets across cell boundaries, destroy topology, and use arbitrary cell names. Use named neighborhoods as the index layer; use walked routes as the encoding layer.
- **Pure mnemonic without physical practice** — encoder stack 2.5–3.5× speedup is on *active hours*; the calendar floor is biology. Mnemonics without walking buy you nothing.

## Related Pages

- [geography-mnemonic-route](./geography-mnemonic-route.md) — parent at world/city scale; this page is the local sister
- [memory-palace](./memory-palace.md) · [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md)
- [cast-overview](./cast-overview.md) — the graph encoder this method relies on
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) — the E in PACE
- [remaps](./remaps.md) · [scene-grammar](./scene-grammar.md) — junction scene construction
- [person-action-object-system](./person-action-object-system.md) — alternative encoder at major junctions
- [substitute-word-system](./substitute-word-system.md) — for hard street-name phonologies
- [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) · [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md) — the biological substrate
- mind-palace---personal-layout — David's personal palace this should bind into
- [palace-classification-drill-ladder](./palace-classification-drill-ladder.md) — drill ladder pattern this borrows
- [meter-overview](./meter-overview.md) — instrumentation
- [mnemonic-methods-master](./mnemonic-methods-master.md) (Tier 4 — domain overlay at local scale)
- [world-velvet-aeon](./world-velvet-aeon.md) — default style for narrative-scene hub expansions

---

## U — See (CAST)
1. District as graph: junctions = nodes, streets = edges
2. 5–8 hubs as anchor loci with REMAPS scenes
3. Compass rose burned into every junction

## D — Name (NEDF)
1. Neighborhood Palace = PACE protocol (Physical-walk · Anchor-hubs · CAST-graph · Eye-compass)
2. Distinguisher: physical-traversal-required (vs map study); reverse-walked (vs bus-driver one-way); CAST graph (vs flat locus list)
3. Failure mode: map study without walking; skip reverse walks; no compass at junctions; one-push encoding without sleep

## F — Do (SPEAR)
1. Phase 1: 5–8 hubs + 3–5 arterials, REMAPS each hub
2. Phase 2: per-arterial cross-street palace walk, compass + corner per locus
3. Phase 3: capillaries via systematic Saturday sweeps
4. Phase 4: reverse-walk every encoded route
5. Drill ladder rungs 0 → 7

## B — Watch (HEART)
1. Skipped sleep between encoding days → fragile retention
2. Reverse walks skipped → one-way fluency
3. Compass discipline drift → orientation collapse under stress
4. Maintenance treadmill catching up → past ~500 streets at hobby pace, decay outpaces encoding

## L — Predict (ORACLE)
1. Hub → predict next hub by compass
2. Address → predict arterial + neighborhood + nearest hub
3. Two-point cue → predict 2–3 alternative routes
4. New street name → predict location by name pattern + neighbor context (rung 7)

## R — Act (GRACE)
1. New street encountered on walk → mutter name, note compass, attach to nearest hub
2. Recall failure mid-route → restage to nearest hub, re-derive
3. Detour required → fire rung-5 drill in real time
4. District extended (e.g. new building changes a junction) → edit the locus, not the whole palace
