---
palace: meta-knowledge
level: 6
domain: 10
room: 1
para: resource
semantic_mode: 5
glyph: ⚗️
wiki_source: wiki/encoders/when-not-to-cast-a-graph.md
---

# When Not to CAST a Graph

**Summary**: The prior question [CAST](./cast-overview.md) never asks about itself — *does a rule produce the edges?* If one does, the rule is the encode and the edges are its trace, and this holds no matter how large the graph is. Plus the two ceilings (node count, and the density reformulation that says the real budget is scenes) and the three cells where graph-shaped material routes to another encoder.

**Sources**:
- [cast-overview](./cast-overview.md) §When to use CAST and §Adjacent but excluded — the five questions this one sits in front of, and the exclusions it generalizes
- [cast-research-roadmap](./cast-research-roadmap.md) §5 Graph Compression and §Impact Timeline — the ~50-node ceiling, and *symmetry exploitation* listed as an unbuilt gap
- [dynamic-edge-encoding](./dynamic-edge-encoding.md) §Dyn0 derive — generator-over-trace applied to *time*; this page is the same rule applied to *structure*
- compression-for-comprehension-framework — the rule both instantiate: keep the generator, derive the behaviour
- systems-thinking-and-cast-integration §Two questions, four cells — the Encode test, this page's per-property sibling one altitude down
- 2026-09-05 session — *"is CAST the best method for memorizing graphs?"*

**Note on provenance**: wiki-side design. The CAST raw source (`CAST and Georgian Node System.md`) carries nothing on declining a graph; it assumes the graph has already been accepted.

**Last updated**: 2026-09-05 (authored)

---

## The question this page answers

[cast-overview](./cast-overview.md) §When to use CAST routes material *into* CAST by asking whether the difficulty is relational — what calls it, what flows through it, what breaks if it changes. Every one of those questions presumes the material is a graph.

So they cannot catch the case where the material **is** a graph and CAST is still the wrong move. That case is common, and it has one cause.

## The generator test

Four cells, so [representation-rules](./representation-rules.md) Rule 10 gives a square, and the two mullions **are** the two questions — the same shape the Encode test uses one altitude down (declared Rule 10 instance at n=4):

```
                        DOES A RULE PRODUCE THE EDGES?

                     no                          yes
          ┌─────────────────────────┬─────────────────────────┐
   ≤ 50   │   CAST                  │   NEDF THE RULE         │
   nodes  │   ◄── home cell         │                         │
          │   every edge is a       │   Petersen: 15 edges,   │
          │   contingent fact       │   one card              │
          ├─────────────────────────┼─────────────────────────┤
   > 50   │   COMPRESS FIRST        │   NEDF THE RULE         │
   nodes  │   sub-palaces, motifs   │                         │
          │   — unbuilt, see        │   Q₁₀: 1024 nodes,      │
          │   §The two ceilings     │   still one card        │
          └─────────────────────────┴─────────────────────────┘
```

**Test** (Rule 10): cover the labels. The right column is one cell wearing a horizontal line, and that redundancy *is* the finding — **with a generator, size stops mattering**. An empty corner would mean a graph that has a rule and a size that changes the answer, which is exactly what the page denies exists.

## Why the generator row collapses

The Petersen graph has 10 vertices and 15 edges. Encoded edge-by-edge that is 15 scenes, a palace of 10 loci, and a bundle on every animal.

Its definition is one sentence: *vertices are the 2-element subsets of {1,2,3,4,5}; two are joined when the subsets are disjoint.* Ten subsets, three disjoint partners each, 30/2 = 15 edges — the whole edge set falls out of the rule, on demand, exactly. (source: standard graph-theory canon; see graph-theory-overview)

The 15 scenes are a **trace**. The sentence is the **generator**. Storing the trace when you hold the generator is the defect [dynamic-edge-encoding](./dynamic-edge-encoding.md) names Dyn0 and compression-for-comprehension-framework owns — this page is that rule rotated from the time axis onto the structure axis. The same reading kills edge-by-edge encoding of Kₙ (*everything to everything*), the hypercube Q\_n (*binary strings of length n, joined when they differ in one bit*), grids, tori, and Cayley graphs.

**The tell**: if you can answer *"is there an edge between x and y?"* by computing rather than by walking, the graph has a generator and does not want a palace.

**The escape hatch**: a generated graph with *exceptions* — a grid with three links cut, a complete graph minus a perfect matching — splits. The rule goes to [NEDF](./nedf-overview.md); the exceptions, and only the exceptions, go to CAST. Encode the diff, not the graph.

## The home cell, and why nothing beats CAST inside it

Irregular graphs whose every edge is a contingent fact — dependency DAGs, service architectures, causal maps, prerequisite chains, theme graphs. There is no rule to hold, so the edges are the only encodable object, and three mechanisms make CAST the best available answer rather than merely an available one:

| Mechanism | What it buys | What the alternatives do instead |
|---|---|---|
| **Edges live on the source node** ([cast-overview](./cast-overview.md)) | retrieval is a walk, in an order the palace supplies | an adjacency list has no traversal order; you re-read it every time |
| **[mnemonic-checksum](./mnemonic-checksum.md)** — four nested levels | the scene *breaks obviously* when a piece is missing | rote edge lists lose edges silently, which is the failure that matters |
| **[lego-skills-patterns](./lego-skills-patterns.md)** — 8 pre-encoded topologies (wheel · chain · spiral · leash · dominoes · funnel · diamond · bridge) | a recognized pattern encodes 5–10 edges as one chunk | mind maps are radial only; ER/UML is accurate but disembodied |

Those three are also the reason the §Adjacent but excluded list on [cast-overview](./cast-overview.md) reads the way it does. Every rejected alternative fails at the second row.

## The two ceilings

**Node count — sourced.** [cast-research-roadmap](./cast-research-roadmap.md) §Impact Timeline: current capability is 5–50 nodes, overload at ~50, and *"encode 100+ node systems formally"* sits behind the graph-compression phase (weeks 12–15, marked VERY CRITICAL, unstarted). Above ~50 nodes CAST is not worse than the alternatives — it is **not yet finished**, which is a different claim and a different fix.

**Density — wiki-side derivation, needs measurement.** The node-count ceiling is a proxy, and it only holds while graphs stay sparse. Palace loci scale with *n*; scenes scale with *edges*, up to n(n−1)/2. A 20-node graph at density 0.5 carries 95 edges — 95 scenes against 20 loci, blowing the scene budget while the node count still looks comfortable.

The reformulation this suggests: **the budget is scenes, not nodes, and the per-node budget is out-degree.** [mnemonic-checksum](./mnemonic-checksum.md)'s bundle level already assumes this — the bundle is a peg object for a node's *out-degree*, fused to its animal — so a node with out-degree 12 is asking one peg object to hold twelve things, which is a chunking failure long before the palace is full.

⚠️ **Unverified.** No page in the wiki states a per-node edge cap, and the ~50 figure was never qualified by density. Two numbers are missing and only measurement supplies them: the total-scene ceiling, and the out-degree cap at which the bundle checksum stops firing. Until then the node count stays the operational rule and this is a hypothesis with a gate (below).

## Three cells that route elsewhere

| Graph-shaped material | Goes to | Why not CAST |
|---|---|---|
| Graph **theory** — Menger, max-flow min-cut, Ramsey bounds, chromatic results | [NEDF](./nedf-overview.md) for the statement, [SPEAR](./spear-overview.md) for the proof | These are concepts and procedures *about* graphs, not topologies. `wiki/graph-theory/` correctly sits outside the encoder: graph-connectivity and network-flows **formalize CAST's vocabulary** (bridge, bottleneck, throughput) rather than being encoded by it |
| **Generated** graphs — Petersen, Kₙ, Q\_n, grids, Cayley | [NEDF](./nedf-overview.md) on the construction rule | §Why the generator row collapses |
| Graphs **> ~50 nodes** with no generator | compress to sub-palaces first, or park | §The two ceilings; the compression phase that would make this a real cell is unstarted |

A fourth boundary is already owned elsewhere and is not repeated here: graphs *below* 5 nodes, where [cast-overview](./cast-overview.md) §Adjacent but excluded says plain NEDF cards are cheaper and the network structure is not yet load-bearing.

## Relation to the Encode test

Same shape, same logic, two altitudes. Running them in the wrong order wastes the work:

| | Encode test | Generator test (this page) |
|---|---|---|
| **Scope** | one property, on one edge | one whole graph, before any of it is encoded |
| **Asks** | does it vary edge to edge? × can it be re-derived? | does a rule produce the edges? × how many nodes? |
| **Rejects** | a mark that duplicates a formula | a palace that duplicates a definition |
| **When to run** | while encoding | **before** encoding |

The generator test runs first. A graph that fails it never reaches the point where per-property questions matter.

## Failure modes

| Failure | Looks like | Caught by |
|---|---|---|
| **Trace instead of generator** | 15 animal scenes for the Petersen graph | the compute-vs-walk tell — if you can *calculate* adjacency, don't encode it |
| **Generator blindness** | "it's a graph, so it's CAST" | this page's first question, run before §When to use CAST's five |
| **Theory/topology conflation** | trying to place Menger's theorem in a palace as a graph | a theorem is a claim about all graphs; it has no topology to walk |
| **Node-count comfort** | a 20-node graph judged safe, then collapsing | count edges and max out-degree, not nodes (⚠️ unmeasured) |
| **All-or-nothing on exceptions** | a grid-minus-three-links encoded from scratch | encode the diff; the rule is still the rule |
| **Declining too eagerly** | rejecting an irregular 30-node DAG as "too big" | that is the home cell — 30 < 50 and no rule produces it |

## METER

Events (`cast::*` namespace, per [METER](./meter-overview.md)):

- `cast.generator_test_run {graph, cell}` — which of the four cells the graph landed in
- `cast.graph_declined {graph, reason}` — an encode *not* started because a generator was found (the good outcome)
- `cast.out_degree_max {graph, k}` — max out-degree at encode time; the measurement the density hypothesis needs
- `cast.scene_count {graph, edges, nodes}` — scenes vs loci, to test whether the ceiling is better stated in edges

Proposed floor, deliberately hostile to this page: **`graph_declined` must fire at least once per ten `generator_test_run` events.** A test that never declines anything is not being run — it is being logged after the decision was already made.

## Promotion gate

🟡 Candidate. Within ~4 weeks of first real use, **either**:

1. one graph is **declined** that would otherwise have been encoded edge-by-edge, *and* its generator rule regenerates the edge set correctly ≥1 week later — the test that the rule really carried the graph; **or**
2. `out_degree_max` / `scene_count` are logged at ≥3 encodes, either supporting the density reformulation or killing it — at which point §The two ceilings loses its ⚠️ and gains a number, or loses its second half.

Otherwise park it and keep the node-count rule, which costs nothing and is already sourced.

## Related pages

- [CAST](./cast-overview.md) — the encoder; §When to use CAST now points here for the prior question
- [cast-research-roadmap](./cast-research-roadmap.md) — §5 Graph Compression, the unbuilt work that would move the bottom-left cell
- [dynamic-edge-encoding](./dynamic-edge-encoding.md) — Dyn0 derive; the same generator-over-trace rule on the time axis
- compression-for-comprehension-framework — generator over trace, the rule both pages instantiate
- systems-thinking-and-cast-integration — the Encode test, one altitude down
- [mnemonic-checksum](./mnemonic-checksum.md) — the bundle level, which is why out-degree is a budget
- [lego-skills-patterns](./lego-skills-patterns.md) — the chunking that raises the real ceiling inside the home cell
- [NEDF](./nedf-overview.md) — where a generator rule goes
- graph-theory-overview — the theory lane, deliberately outside the encoder
- [framework-comparison-matrix](./framework-comparison-matrix.md) — §Why not one encoder?, the horizontal form of this page's refusal
- [representation-rules](./representation-rules.md) — Rule 10, the square above

---

## U — See (CAST)

1. Four cells; the right column collapses because a generator makes size irrelevant
2. The home cell is irregular graphs, 5–50 nodes, no rule
3. Edges live on the source node — that is what the alternatives cannot do

## D — Name (NEDF)

1. Generator test = does a rule produce the edges, asked before any encoding starts
2. Distinguisher: the Encode test judges one *property*; this judges the whole *graph*
3. Failure mode: storing 15 scenes where one sentence regenerates them

## F — Do (SPEAR)

1. Ask *can I compute adjacency instead of walking to it?* — if yes, stop and NEDF the rule
2. Rule with exceptions? encode the diff only
3. No rule — count nodes: <5 → NEDF · 5–50 → CAST · >50 → compress or park
4. Only now run [cast-overview](./cast-overview.md) §When to use CAST's five questions

## B — Watch (HEART)

1. "It's a graph, so it's CAST" said before anyone asked where the edges came from
2. A node whose bundle is holding more than a handful of outgoing edges
3. Theorems being fitted into palaces

## L — Predict (ORACLE)

1. A regular or symmetric-looking graph → predict a generator exists and the encode is about to be wasted
2. Node count comfortable but scene count high → predict collapse before the ~50 ceiling is reached
3. `graph_declined` never firing → predict the test is being logged, not run
