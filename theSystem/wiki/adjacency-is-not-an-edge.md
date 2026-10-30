---
palace: meta-knowledge
level: 6
domain: 10
room: 89
para: resource
semantic_mode: 5
glyph: 🧲
wiki_source: wiki/encoders/adjacency-is-not-an-edge.md
---

# Adjacency Is Not an Edge

**Summary**: Why a bare [memory-palace](./memory-palace.md) cannot do [CAST](./cast-overview.md)'s job — stated as the three properties of an edge that spatial adjacency drops (**direction · reach · type**), and why CAST's single structural move, *the edge is a verb performed by the source animal*, repairs all three at once. Both owner pages state the storage/encoder division of labour; neither argues it, and the objection survives the statement.

**Sources**:
- [memory-palace](./memory-palace.md) §What this page is and §Placement rules — the storage-layer contract and the "orthogonal to the encoders" claim this page supplies the argument for
- [cast-overview](./cast-overview.md) §Two-layer architecture and §One mental motion — the edges-live-on-the-source rule that is the whole patch
- [nodes-and-edges](./nodes-and-edges.md) §Layer 2 — edges encoded as scenes placed *inside or on* the source node's location; §The routing table for the list-vs-network split this page ends on
- [spatial-coding](./spatial-coding.md) — the free positional channels a palace owns *before* any encoder is added; the honest half of the objection
- [when-not-to-cast-a-graph](./when-not-to-cast-a-graph.md) §The home cell — the three mechanisms that make CAST the best answer rather than merely an available one; this page is that page's mirror image (it declines the graph, this one declines the *substitute*)
- [cast-example-math-program](./cast-example-math-program.md) — the worked non-adjacent cross-room edge that grounds the reach wall in a real graph
- 2026-09-18 session — *"but can't we use mind palace like CAST?"*

**Note on provenance**: wiki-side design. No raw source asks this question; it arises from reading the two owner pages in sequence and noticing that neither defends the boundary.

**Last updated**: 2026-09-18 (authored)

---

## Glyph

🧲 — a magnet. Two objects held together by proximity, with **no way to say which one acted**. That is adjacency: a real bond, and a bond that has forgotten everything about the relation except that it exists.

---

## The question this page answers

[memory-palace](./memory-palace.md) states the division of labour in one sentence: the palace "is orthogonal to the encoders — the encoder decides what shape an item takes; the palace decides where it lives." True, and stated — but not argued. The obvious challenge walks straight through it:

> A palace already puts related things near each other. Isn't near-ness a relation? Why does a *separate* relational encoder exist?

The challenge is not naive, and the answer is not "a palace can't hold relations." It can. The answer has three parts: what adjacency genuinely buys, the three walls it hits, and the fact that one patch clears all three — which is the reason CAST is a short system rather than a large one.

## What a bare palace already carries, for free

```
  door ───── counter ───── windowsill ───── pantry
  Frog        Ape            Cat             Donkey

  carried:  Frog–Ape · Ape–Cat · Cat–Donkey    ← 3 relations, zero extra images
```

Neighbourhood is a real relation channel and it costs nothing, because the loci were already paid for. [spatial-coding](./spatial-coding.md) shows the channel is deeper than most use: *position inside a locus* is a second free axis — top/bottom/left/right can carry a datum (Kozarenko's Компас reads a card's suit off the quadrant), and triangle geometry can carry operations. Its stated principle applies verbatim here: "geometry is free: the locus and the image are already paid for, so reading a coordinate off them costs no additional binding."

So the strong form of the objection is that a palace arrives with **two** structural channels before any encoder is added. The question is what those channels still cannot say.

## The three walls

Three, so [representation-rules](./representation-rules.md) Rule 10 gives a **triangle** — declared instance at n = 3. The corners are the three things an edge *is*; the centre is the one move that supplies all three.

```
                      DIRECTION
               which end of the relation acts
                          ▲
                         ╱ ╲
                        ╱   ╲
                       ╱     ╲
                      ╱  the  ╲
                     ╱ source  ╲
                    ╱  animal   ╲
                   ╱  performs   ╲
                  ╱   the verb    ╲
                 ▲─────────────────▲
             REACH                  TYPE
      how far the target may      which relation,
      sit from the source        of several possible
```

**Test** (Rule 10): cover the centre. Three unconnected complaints about palaces — a familiar, forgettable list. Restore it and the three become one claim seen from three sides. An empty corner would mean the patch is over-claimed: a wall it does not reach.

### Wall 1 — direction

Adjacency is symmetric. The corridor says Ape and Cat are *near*; it has no way to say Ape → Cat rather than Cat → Ape. For a dependency DAG, a prerequisite chain, a causal map, or a service architecture, which end acts is most of the content — it is the difference between *this breaks if that changes* and its reverse.

### Wall 2 — reach

This is the wall that actually kills the substitute. A walk is one-dimensional and a grid is two; an arbitrary graph is neither. A node with five out-edges to nodes scattered across the graph has **nowhere to put five spatial neighbours**, and no re-ordering of the walk fixes it — the edges that fail to embed simply go unwritten.

[cast-example-math-program](./cast-example-math-program.md) carries the case in a real graph: Numerical Methods' only prerequisite sits in "a *different, non-adjacent* room," the edge skipping from the Algebra & Foundations wing into Applied & Capstone without passing through Analysis. Under adjacency alone that prerequisite cannot be recorded at all.

### Wall 3 — type

Near is one bit. Two nodes can stand in several relations at once, and the interesting one is usually the qualified one: in [cast-overview](./cast-overview.md)'s kitchen graph, Ape → Cat is *cache lookup* while Cat → Donkey is *cache miss, only when the cat has no treat*. Proximity cannot separate those, and the conditional is the part worth holding.

**The quiet fourth cost**: adjacency **loses edges silently**. [when-not-to-cast-a-graph](./when-not-to-cast-a-graph.md) §The home cell makes this the row on which every alternative fails — "rote edge lists lose edges silently, which is the failure that matters" — and it is the failure a palace-only encode inherits, because a corridor with a missing neighbour still looks like a corridor.

## One patch, three walls

CAST does not answer the three walls with three mechanisms. It is, in its own words, "palace + animal-nodes + verb-edges" — the palace is kept, and two rules are added:

| Rule | What it is | Which wall it clears |
|---|---|---|
| **Fixed animal identity per node** | a node is a [Georgian animal](./georgian-animals.md), not a position | makes walls 1–3 stop depending on geography at all: a node keeps its identity far from its neighbours |
| **Edges live ON the source node** | the edge is a gesture the source animal *performs* ([cast-overview](./cast-overview.md) §One mental motion) | all three at once — the actor supplies **direction**, a gesture needs no proximity so **reach** is unbounded, and the verb is the **type** |

The second rule is the load-bearing one, and its payoff is larger than it looks: it **decouples graph topology from palace topology**. Once the edge rides the animal rather than the floor plan, the palace is free to be laid out for walkability while the graph is free to be any shape. That is why [cast-overview](./cast-overview.md)'s mnemonic is *"every animal carries its own leash"* — the leash is exactly the thing a corridor cannot hold.

Adding [mnemonic-checksum](./mnemonic-checksum.md) on top repairs the fourth cost: a bundle is a peg object for a node's out-degree, so a dropped edge makes the scene *break* rather than quietly shrink.

## When the bare palace is the right answer anyway

None of this makes CAST a default, and the wiki does not treat it as one. [nodes-and-edges](./nodes-and-edges.md) routes the two explicitly: *a list in order* → a simple loci palace; *a whole network* → full CAST with palace. [CAST maturity level 2](./maturity-levels-overview.md) **is** simple memory palaces — a rung to stand on, not a stage to leave behind.

| Material | Encode | Why |
|---|---|---|
| Sequence, set, or classification | bare palace (+ [spatial-coding](./spatial-coding.md) if a second axis is needed) | order or membership *is* the whole relation; none of the three walls is hit |
| Irregular graph, ≤ ~50 nodes | [CAST](./cast-overview.md) | every edge a contingent fact; all three walls are live |
| Graph with a rule behind its edges | [NEDF](./nedf-overview.md) the rule | the [generator test](./when-not-to-cast-a-graph.md) — if you can *compute* whether x–y is an edge, neither a palace nor CAST should store it |

The middle row is the only one where this page's argument does any work. The third row is the sharper reminder: the answer to *"can a palace do CAST's job?"* is sometimes *neither should* — check for a generator before reaching for either.

## Mnemonic

**"A magnet cannot point."** Two things stuck together by proximity is a real bond that has forgotten which one acted, how far it could have reached, and what kind of bond it was. Hand the bond to one of the two animals, as a gesture, and all three come back.

## Checksum

1. Name the three properties of an edge that adjacency drops — and which one alone is enough to sink a palace-only encode.
2. CAST adds two rules to a palace. Which one clears all three walls, and what does it decouple?
3. A palace and CAST both lose to a third answer on some graphs. Which answer, and what question detects it?

## Related pages

- [memory-palace](./memory-palace.md) — the storage layer whose "orthogonal to the encoders" claim this page argues
- [cast-overview](./cast-overview.md) — the encoder whose two rules are the patch
- [nodes-and-edges](./nodes-and-edges.md) — the two-layer model, and the list-vs-network routing table
- [when-not-to-cast-a-graph](./when-not-to-cast-a-graph.md) — the mirror page: that one declines the graph, this one declines the substitute
- [spatial-coding](./spatial-coding.md) — the free positional channels the objection's strongest form rests on
- [mnemonic-checksum](./mnemonic-checksum.md) — the repair for the silent-loss cost
- [lego-skills-patterns](./lego-skills-patterns.md) — pattern chunking, the third mechanism on the home-cell table
- [maturity-levels-overview](./maturity-levels-overview.md) — where simple palaces sit as a prerequisite rung
- [representation-rules](./representation-rules.md) — Rule 10, the triangle above
- [georgian-animals](./georgian-animals.md) — the node identity layer that makes reach possible
