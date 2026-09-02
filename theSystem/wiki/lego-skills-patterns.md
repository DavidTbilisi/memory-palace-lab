---
palace: strategic-memory
level: 7
domain: 10
room: TBD
para: resource
semantic_mode: 5
wiki_source: wiki/encoders/lego-skills-patterns.md
---

# Lego Skills — Pre-Encoded Graph Patterns

**Summary**: Eight reusable graph topologies, each pre-encoded as a named scene with a one-word recall cue. Recognizing a pattern encodes 5–10 edges as **one unit** — the chunking mechanism that lets [CAST](./cast-overview.md) scale from toy graphs to large connected systems without per-edge cognitive load.

**Sources**:
- CAST and Georgian Node System.md §Lego Skills — pre-encoded graph patterns
- CAST and Georgian Node System.md §Chunking — cluster detection as compression

**Last updated**: 2026-07-09 — loop-sign checksum sentence + [edge-sign](./edge-sign.md) link (candidate); 2026-07-06 — page authored (was an orphan-by-omission; linked from 6+ pages since the 2026-04-30 CAST ingest).

---

## Why patterns, not edges

Certain topologies appear across many different systems. Pre-encoding them as named chunks means **recognition = encoding**: spotting a pattern instantly encodes its 5–10 edges as one unit, and only the *deviations* from the pattern need individual scenes. (source: CAST and Georgian Node System.md)

The compression is what makes large graphs mentally tractable: a graph with 3 hub-and-spoke clusters connected by bridges is 3 wheel chunks + 2 bridge edges — **5 encoding units instead of 25**. (source: CAST and Georgian Node System.md)

This is [chunking](./chunking.md) applied to graph structure — the same move chess masters make when a board position resolves into a handful of known configurations instead of 32 pieces. Load then scales with the number of *chunks and deviations*, not nodes and edges.

## The core pattern library

| # | Pattern | Structure | Pre-built scene | Recall cue | Common in |
|---|---|---|---|---|---|
| 1 | **Hub and spoke** | one central node; all others connect only to it | a giant animal at the center of a wheel, smaller animals chained to its body at the rim | **the wheel** | API gateways, central databases, team leads, root concepts |
| 2 | **Linear chain** | A → B → C → D → E, no branching | animals in a queue, each one's tail held by the animal in front | **the chain** | causal sequences, pipelines, proof steps, historical progression |
| 3 | **Amplifying feedback loop** | A → B → A, each cycle strengthens A | two animals feeding each other, growing larger each time — both already enormous | **the spiral** | financial bubbles, viral growth, arms races, addiction |
| 4 | **Stabilizing feedback loop** | A → B → −A, B dampens A | one animal holds the other's leash — the second always pulls back when the first runs too far | **the leash** | thermostats, homeostasis, negative feedback in circuits, market corrections |
| 5 | **Cascade failure** | A breaks → B breaks → C breaks → D breaks | animals in a line, each knocking the next off a cliff — Dragon scenes throughout | **the dominoes** | system outages, financial crises, military defeats, ecosystem collapse |
| 6 | **Bottleneck** | many nodes → one narrow node → many nodes | a crowd of large animals squeezing through a single tiny animal | **the funnel** | single points of failure, rate limiters, shared resources, court systems |
| 7 | **Diamond DAG** | A → B, A → C, B → D, C → D | one animal on top, two in the middle, one at the bottom receiving from both | **the diamond** | multiple inheritance, shared conclusions from different premises, river deltas |
| 8 | **Cluster with bridge** | two dense groups joined by a single edge | two crowds of animals connected by a single thin rope — cut the rope and the crowds separate | **the bridge** | modular systems, political blocs, separated departments |

(source: CAST and Georgian Node System.md)

**Bridge rule**: always encode the bridge edge with Tier 2 CAST — it is the structurally most valuable edge in the graph, and the one whose loss disconnects everything. (source: CAST and Georgian Node System.md)

The two feedback-loop patterns (spiral, leash) are the CAST-native encodings of the systems-thinking loop archetypes — see archetype-encoding-in-cast and feedback-loops for the systems-dynamics side. With the [edge-sign](./edge-sign.md) modifier (🟡 candidate), the spiral/leash choice becomes *checkable*: walk the loop and multiply the edge signs — an even count of − must land on the spiral, an odd count on the leash.

## The recognition procedure

When you recognize a pattern:

1. **Name it** (the recall cue is the name)
2. **Encode the entire pattern as one chunk** using its pre-built scene
3. **Note which specific animals fill which roles** in the pattern
4. **Only encode the deviations** from the pattern individually

(source: CAST and Georgian Node System.md)

## Relation to chunking

[chunking](./chunking.md) (cluster detection) and Lego Skills are the two halves of graph compression:

- **Chunking** finds *density* — groups more connected internally than externally; each cluster becomes one palace room, and between-cluster edges land on the room threshold. (source: CAST and Georgian Node System.md)
- **Lego Skills** find *shape* — known topologies inside or across those clusters, each collapsing to one pre-built scene.

Run both during Step 0 analysis, before any animal is assigned: clusters give the rooms, patterns give the chunks, and what remains is the short list of edges that actually need individual encoding.

## Automaticity target

The library only pays off when recognition is **reflex, not analysis** — the goal is to *see* "the funnel" the way you see a face, not to derive it. The drill lives in [cast-drill-ladder](./cast-drill-ladder.md) Stage 4 (`cast::pattern_flash`: sketch → cue, ≤3s). Until the eight cues fire on sight, pattern-matching is itself a System-2 step and adds load instead of removing it.

## Mnemonic

One story-walk threads all eight cues in library order:

> A **wheel** rolls down a **chain**, winds up into a **spiral**; a **leash** yanks it back — too late: the **dominoes** fall, pour into a **funnel**, are pressed into a **diamond**, and the diamond is carried across the **bridge**.

Walk it once forward and once backward; each cue is one pattern, and the story's physics (rolling → chaining → amplifying → damping → cascading → constricting → converging → connecting) mirrors each pattern's behavior.

## Checksum

1. Which pattern's connecting edge must *always* be encoded with Tier 2 CAST, and why? *(the bridge — losing it disconnects the graph)*
2. A graph of 3 hub-and-spoke clusters joined by bridges: how many encoding units, versus naive per-edge encoding? *(5 vs 25)*
3. Name the two feedback-loop patterns, their cues, and which one dampens. *(amplifying = the spiral; stabilizing = the leash — the leash dampens)*

## Visual

The eight cue-objects in a 2×4 grid, each drawn as its miniature topology (nodes as circles, the cue-object as the edge shape): `Excalidraw/Lego_Skills_Patterns.excalidraw.md` — built by `tools/excalidraw_libs/build_lego_skills_plate.py` (regenerate from there; the plate is a rendering of this page, not a second source of truth). The cascade panel is tinted red ("Dragon scenes throughout") and the bridge edge is drawn red with its "Tier 2, always" rule inline. Since the shape *is* the retrieval cue, the plate doubles as the drill deck for `cast::pattern_flash`.

## Related pages

- [CAST](./cast-overview.md) — the encoder this library serves; lists the 8 patterns in its UMTF Pattern row
- [chunking](./chunking.md) — the density half of graph compression (clusters → rooms)
- [cast-drill-ladder](./cast-drill-ladder.md) — Stage 4 hosts the `cast::pattern_flash` recognition drill
- archetype-encoding-in-cast — systems-thinking archetypes expressed through these patterns
- feedback-loops — the dynamics behind the spiral and the leash
- [image-merging](./image-merging.md) — the within-scene compression that pairs with this between-scene compression
- [nodes-and-edges](./nodes-and-edges.md) — the two-layer model the patterns are built from
- [edge-sign](./edge-sign.md) — per-edge polarity (🟡 candidate); makes the spiral/leash classification verifiable via the loop-sign checksum
- [problem-solving-os](./problem-solving-os.md) — tracks per-archetype solution rate against this library

---

## U — See (CAST)
1. 8 named topologies, each a pre-built scene + one-word cue
2. Recognition = encoding: pattern spotted → 5–10 edges become one chunk

## D — Name (NEDF)
1. Lego Skills = the CAST pattern library
2. Wheel · chain · spiral · leash · dominoes · funnel · diamond · bridge
3. Encode the chunk, then only the deviations

## F — Do (SPEAR)
1. Step 0 → scan for known shapes before assigning animals
2. Pattern found → name it, place its pre-built scene, cast the roles
3. Encode deviations individually; bridge edges get Tier 2

## B — Watch (HEART)
1. Forcing a pattern onto a near-miss topology (deviations ignored)
2. Recognition still analytical (counting edges instead of seeing the shape)
3. Bridge edge encoded as Tier 1 — the one edge that must not blur

## L — Predict (ORACLE)
1. Cues at reflex → large graphs feel like a handful of objects
2. Cues absent → per-edge encoding and overload past ~12 nodes

## R — Act (GRACE)
1. New graph → pattern scan first, animals second
2. Overloaded mid-encode → stop, re-run the pattern scan, chunk what matches
