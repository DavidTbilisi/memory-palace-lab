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
- CAST Atlas artifact, Ureki room (David's proposal in conversation, 2026-09-07; 12 corners drawn with clock dials) — https://claude.ai/code/artifact/380f2ce1-de72-4490-bb6c-e0f880672593

**Last updated**: 2026-09-18 (§Worked example rebuilt on OpenStreetMap — hub coordinates were off by up to ~1.6 km, Nutsubidze runs E–W not N–S, Bakhtrioni is not a spine; the district is a rails × rungs lattice with a generator, so week 1 now opens with the **rule card** and the **hub** and closes the lattice on Friday; 13-corner first frame in `tools/cast-graphs/saburtalo-skeleton.json`, dials computed, two corners flagged for field verification); 2026-09-07 (§Clock dials added — every junction is a clock with 12 at north, one hand per street leaving; the E primitive now speaks hours; [METER](./meter-overview.md) `nbh.corner_dial_pass`. Later the same day: *Walk dial, car dial* — one dial per travel mode, the car dial a subset with in-degree recounted; Ureki driven, and its frame splits by car); 2026-05-30

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
| **E** | **Eye-compass** | At every junction, say out loud the hour each street leaves at, 12 = north — see §Clock dials below. The four compass letters stay for hub-to-hub bearings (rung 0). This is the orientation discipline that turns spatial recall into navigation, per [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md). |

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

## Clock dials — a corner's bundle read as hours

Proposed by David on 2026-09-07 while the Ureki room of the CAST Atlas was being drawn; this section is the wiki's record of the convention, and the E primitive above now points here. 🟡 Candidate until the gate at the end opens.

**The rule.** Every junction — a [CAST](./cast-overview.md) node — is drawn as a small clock: a twelve-tick dial around the node, **12 fixed at north**, and one **hand** for each street that leaves it, set at the hour the street actually leaves at. The hour is the first segment of the road as you step off the corner, not the straight line to the next junction, because it is the turn your body makes. The hour is written beside the hand. The compass rose stays on the map once, as the legend for every dial, and its points are landmarks rather than letters: in Ureki, 12 is Poti, 6 is Kobuleti, 9 is the sea, 3 is the railway.

```
          12 · Poti
      11           1
   10                 2
  9 · sea     ●     3 · railway
   8                  4
      7            5
           6 · Kobuleti

  Football corner   3 · 6 · 9    a T
  Villa            12 · 6 · 9    a T, turned
  Guest House       5 · 9        a bend
```

**Why an hour and not a letter.** Three reasons, all about speed at the corner:

1. *Resolution.* Twelve positions at 30° instead of four at 90°. Ureki's east road leaves the Guest House corner at 5; no compass word says that in one breath.
2. *One token.* "Three" is one word said while the hand points. "East-south-east" is three words and a decode.
3. *Order for free.* A bundle read clockwise from 12 has one canonical order, so the bundle table and the dial agree, and a missing hand is a visible gap. That is [representation-rules](./representation-rules.md) Rule 10's count-shape with the vertices fixed by geography instead of spaced evenly: a T-junction is three hands, a crossroads four, and an empty position is seen before any name is read.

**What the hour is not.** It is a bearing, never a time of day. [clocks24](./clocks24.md) owns the hours of the day, and the two dials must not share an image: 12 means north here and midnight there. Keeping the two meanings apart is the [orthogonality lock](./software-design-principles-for-neural-os.md) applied to a shape. A two-way street shows as two hours six apart, one hand at each end — the same "pay double for symmetry" that [cast-example-city-streets](./cast-example-city-streets.md) counts in edges, now visible on the dials.

**Where the hour lives.** CAST's one motion is *point at the source animal, watch it perform the verb on the target*; the hour is that pointing gesture, written down. It sits in the bundle, before the verb, and touches neither the animal nor the scene:

| Corner | Bundle, clockwise from 12 |
|---|---|
| Football · 🦅 | **3** headers to Dumbadze · **6** plunges to Laimi · **9** punts to Lika |
| Villa · 🦉 | **12** climbs to lane top · **6** glides to Rio · **9** sidles to spur |
| Guest House · 🐷 | **5** wanders to road end · **9** trots to Dumbadze |

**Walk dial, car dial — one dial per travel mode.** A corner's dial is drawn once per mode of travel, and the car dial is a **subset** of the walk dial: a two-way street keeps both hands, a one-way street keeps only the hand at the end you may leave from, a footpath keeps none. The animals never move between modes, a letter once given is never reassigned, but in-degree is **recounted per mode**, so the hub can move and a bridge can vanish. This is the [cast-example-city-streets](./cast-example-city-streets.md) lesson, a two-way street is two edges and a one-way street is one, run once per mode instead of once. Under Rule 10 the difference is visible as empty positions: a car dial with fewer hands than its walk dial shows exactly which streets you lose.

Ureki, driven 2026-09-07: every encoded street is two-way by car except the spur and the bridge (Rio ⇄ Laimi), which are footpaths. By car the frame therefore splits in two. The town keeps the Eagle at Football; the home cluster (Villa · Rio · lane top) is reached by no encoded street at all, and the car route home is one of the two roads that leave the frame on the home lane, both still unknown. The walk's open question, *does the home lane reach the coast leg*, is by car the only door.

| Corner | Walk in-degree | Car in-degree |
|---|---|---|
| Football · 🦅 | 3 | 3 |
| Villa · 🦉 | 3 (tied Football, lost on reading order) | 2 (the tie is gone) |
| Laimi · 🐅 | 2 | 1 |
| Rio · 🦓 | 2 | 1 |

**Drill and measurement.** The corner-level twin of rung 0, which stays hub-to-hub and in compass letters; run it once per travel mode and log the mode on the event:

| Cue | Response | Pass-floor | METER event |
|---|---|---|---|
| Corner name | The hour of every street leaving it, clockwise from 12, then the animal at the far end of each | 100% in 10s per corner | `nbh.corner_dial_pass` (`mode` = walk · car) |

**Promotion gate.** The convention leaves 🟡 when `nbh.corner_dial_pass` holds for every corner of one walked district frame (Ureki's 12, or Saburtalo's first 12) on two drills a week apart, and one full frame is redrawn from memory with every hand at its hour. If a redraw keeps placing hands at the straight-line bearing instead of the street's first segment, the rule is wrong about which one the body remembers, and this section changes to say so.

Worked instance: the Ureki room of the CAST Atlas — 12 corners, 22 directed edges, every one dialed, with the bundle table in dial order, and a Walk / Car switch whose per-street rules are the ones David drove (source: David's artifact, 2026-09-07).

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
lat: 41.7245
long: 44.7540
zoom: 15
height: 500px
width: 100%
unit: meters
marker: default, 41.7235, 44.7572, [[place-saburtalo-bochorishvili|Bochorishvili Clinic — home-locus]]
marker: default, 41.7289, 44.7584, [[place-saburtalo-aversi|Aversi Clinic]]
marker: default, 41.7273, 44.7638, [[place-saburtalo-medical-university|Medical University metro]]
marker: default, 41.7255, 44.7453, [[place-saburtalo-delisi|Delisi metro]]
marker: default, 41.7198, 44.7533, [[place-saburtalo-central-park|Central Park]]
marker: default, 41.7151, 44.7365, [[place-saburtalo-cemetery|Saburtalo Cemetery]]
marker: default, 41.7363, 44.7380, [[place-saburtalo-mardaleishvili|Mardaleishvili Medical Centre]]
```

*(Coordinates from OpenStreetMap, 2026-09-18 — © OpenStreetMap contributors. The seven `place-saburtalo-*` hub pages were rebuilt on the same data the same day; [place-saburtalo-delisi](./place-saburtalo-delisi.md) is new.)*

**The first frame** — 1 km around the home-locus, built from OSM by `tools/cast_graph_from_osm.py` into `tools/cast-graphs/saburtalo-skeleton.json`: **13 corners, 30 walk edges** (21 drivable). Six of the corners are one rule; seven are exceptions. `python3 tools/cast_encode_log.py step0 saburtalo-skeleton` prints the whole Step 0, dials included.

**The rule card (encode this before the first walk — it is the generator, not an edge):**

> *Three rails run east–west — Nutsubidze (north), Vazha-Pshavela (middle), Kazbegi (south). Two rungs run north–south — Asatiani (west), Vakeli (east). Every rail meets every rung.*

That one sentence is six corners. It goes on a [NEDF](./nedf-overview.md) card per [when-not-to-cast-a-graph](./when-not-to-cast-a-graph.md) §The escape hatch; the CAST work is the *rest*.

**Corners (letters locked at first encode, in-degree order — [step-zero-analysis](./step-zero-analysis.md))**:

| # | Animal | Corner | Role | Hub |
|---|---|---|---|---|
| ა | Eagle | Asatiani × Kartozia × Kazbegi | **the hub** (in 5) — rule corner, SW of the lattice | |
| ბ | Owl | Vakeli × Nutsubidze (+ Budapest, Kandelaki) | rule corner, NE | Aversi Clinic 148 m |
| გ | Pig | Asatiani × Vazha-Pshavela | rule corner, W-middle | |
| დ | Dinosaur | Kartozia × Tsintsadze | exception — Kartozia **bends** here | Central Park 197 m |
| ე | Raccoon | Vakeli × Kazbegi (+ Tandzia) | rule corner, SE — **the home corner**, 134 m from the clinic | |
| ვ | Whale | Vakeli × Vazha-Pshavela | rule corner, E-middle | |
| ზ | Zebra | Asatiani × Nutsubidze | rule corner, NW | |
| თ | Tiger | Kartozia × Choloqashvili Hwy | exception — an **interchange**; verify on the ground which arm is the through road | |
| ი | Ibis | Kazbegi × Tamarashvili | exception — west exit of the frame | Delisi metro 147 m |
| კ | Kangaroo | Mitskevich × Tandzia | exception — the clinic's own corner | Bochorishvili Clinic 221 m |
| ლ | Lion | Budapest × Panjikidze | exception — east exit toward the metro | Medical University metro 250 m |
| მ | Mammoth | Tsintsadze × Choloqashvili Hwy | exception — south exit | |
| ნ | Narwhal | Budapest × Beritashvili | exception — north exit | |

Two corners are flagged for field verification because OSM cannot settle them: at **Tiger** the tool finds both *Eagle → Tiger → Dinosaur* (316 + 277 m) and a direct *Eagle → Dinosaur* (470 m) on Kartozia — one is the through road and one is a ramp; and **Dinosaur**'s dial reads Kartozia at 9, meaning the street turns west there. Both are exactly what Step 0 is for.

**Week-1 walk plan** (30 min/day; every street walked in both directions across two days; hub first, per Step 0):

| Day | Walk (from the clinic) | Encode | Drill at the desk afterwards |
|---|---|---|---|
| **Mon** | Kangaroo → **Raccoon** → *Kazbegi west* → **Eagle** → *Asatiani north* → **Pig**, and back the same way (≈ 1.0 km out) | The rule card first, at home. Then the home corner (Raccoon), **the hub** (Eagle), Pig. Say each dial aloud on the corner, 12 = north | `walk saburtalo-skeleton --only raccoon,eagle,pig` — dials + bundles. Rung 0: point clinic → Delisi, → Aversi |
| **Tue** | Same route **reversed** — out drilling Monday's dials, back encoding the reverse hours; extend *Kazbegi west* past Eagle to **Ibis** and Delisi metro (391 + 147 m). Metro or walk home | Ibis; the west exit hands (Tamarashvili 12 / 6, Kazbegi 9>) | `--only raccoon,eagle,pig,ibis`. Rung 1: Kazbegi's cross-streets east → west |
| **Wed** | **Rest — sleep consolidation. No new encoding** ([sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md)) | — | Full `walk --only raccoon,eagle,pig,ibis` from memory; rungs 0–1. Anything under 100 % on a dial → re-walk that corner Thursday, do not re-study it |
| **Thu** | Raccoon → *Vakeli north* → **Whale** → **Owl** → Aversi (148 m) → *Budapest east* → **Lion** → Medical University metro (250 m). Metro or walk home (≈ 1.3 km out) | The east rung: Whale, Owl (Owl has **five hands**, the densest dial — take it slowly), Lion | `--only …,whale,owl,lion`. Rung 0: all four hubs so far from the clinic |
| **Fri** | **Close the lattice**: Raccoon → Whale → Owl → *Nutsubidze west* → **Zebra** → *Asatiani south* → Pig → Eagle → *Kazbegi east* → Raccoon (≈ 2.5 km; the long day) | Zebra, and the rule *walked*: at each of the six rule corners say the rail and the rung. Kazbegi eastbound and Vakeli/Asatiani southbound are the reverse hours from Mon/Thu | `--only` all rule corners + ibis, lion. Rung 1: Nutsubidze, Vazha-Pshavela, Kazbegi cross-streets both directions |
| **Sat** | The south spur: Raccoon → Eagle → *Kartozia south* → **Tiger** (the interchange — walk both arms) → **Dinosaur** → Central Park (197 m) → *Tsintsadze east* → **Mammoth**; return Dinosaur → Eagle by whichever arm is the through road (≈ 2 km) | Tiger, Dinosaur, Mammoth; **settle the two field questions** and correct the graph file if OSM was wrong | `--only tiger,dinosaur,mammoth`. Narwhal (Budapest north, 544 m from Owl) is the one corner not walked — leave it for week 2 or take it Sunday |
| **Sun** | **Rest + integrative**: to Aversi and back by a route you have not walked as a whole (e.g. via Zebra), eyes mostly down | — | Full `walk saburtalo-skeleton` — all 13 dials and bundles, one pass. Rungs 0–2 mixed. Then `report` |

**Week-1 end-state**: the rule card fluent; 12 of 13 corners walked in both directions with dials said aloud (Narwhal pending); 5 hubs anchored; `nbh.corner_dial_pass` logged for every walked corner, which starts the clock on §Clock dials' promotion gate (every corner of one frame, two drills a week apart). Rungs 0–2 passing. Phase 2 (the full edge list — cross-streets between the rule corners) begins week 2, and the 30 walk edges are the density hypothesis's first real reading.

**What changed from the screenshot plan, and why it matters**: the old week 1 walked Bakhtrioni "end-to-end" on day one as the central spine. Bakhtrioni is a 0.9 km side street that meets no arterial in this frame; the walk would have encoded a corridor with nothing hanging off it. The new plan puts the **hub** (Eagle) and the **rule** on day one, which is what Step 0 says to do, and reaches every hub from the home corner within the 30-minute budget except the two that lie outside the frame (Cemetery, Mardaleishvili — Phase 2 frames).

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
- **E** — Eye-compass at every junction. Say the hours out loud, 12 at north, one per street leaving. Turns recall into navigation.

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
- **No compass discipline** at junctions — no hour said, no letter said; recall without orientation. You'll know where streets are but not which way to turn.
- **Trying to encode the whole district in one push** — sleep consolidation can't be rushed. 3–7 nights per district minimum, regardless of how many hours you spend encoding.
- **Grid encoding instead of walk-palace** (per the user-raised idea, validated against architecture and rejected as primary): grids fragment streets across cell boundaries, destroy topology, and use arbitrary cell names. Use named neighborhoods as the index layer; use walked routes as the encoding layer.
- **Pure mnemonic without physical practice** — encoder stack 2.5–3.5× speedup is on *active hours*; the calendar floor is biology. Mnemonics without walking buy you nothing.

## Related Pages

- [geography-mnemonic-route](./geography-mnemonic-route.md) — parent at world/city scale; this page is the local sister
- [memory-palace](./memory-palace.md) · [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md)
- [cast-overview](./cast-overview.md) — the graph encoder this method relies on
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) — the E in PACE
- [cast-example-city-streets](./cast-example-city-streets.md) — the Level 4 sibling; the Ureki room of the CAST Atlas applies §Clock dials to a real corner set
- [clocks24](./clocks24.md) — owns the *other* clock, the hours of the day; a dial hour here is a bearing, never a time
- [representation-rules](./representation-rules.md) — Rule 10: a corner's hands are its bundle's count-shape
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
3. A clock dial at every junction: 12 at north, one hand per street leaving; the rose is the legend

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
5. Mode drift → a car dial read with the walk's hands; recount in-degree per mode before trusting the hub

## L — Predict (ORACLE)
1. Hub → predict next hub by compass
2. Address → predict arterial + neighborhood + nearest hub
3. Two-point cue → predict 2–3 alternative routes
4. New street name → predict location by name pattern + neighbor context (rung 7)
5. A footpath where the walk had its bridge → predict the cluster behind it has no car door inside the frame

## R — Act (GRACE)
1. New street encountered on walk → mutter name, say its hour, attach to nearest hub
2. Recall failure mid-route → restage to nearest hub, re-derive
3. Detour required → fire rung-5 drill in real time
4. District extended (e.g. new building changes a junction) → edit the locus, not the whole palace
