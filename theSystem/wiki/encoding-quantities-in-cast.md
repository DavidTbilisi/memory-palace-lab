---
palace: strategic-memory
level: 6
domain: 10
room: 2
para: resource
semantic_mode: 5
wiki_source: wiki/encoders/encoding-quantities-in-cast.md
---

# Encoding Quantities in CAST

**Summary**: An **additive, opt-in modifier** for [CAST](./cast-overview.md) edges carrying the dimension the four Tier 2 slots cannot express: **magnitude** — how much moves through this relation, and at what rate. Quantity rides on the **Stream**, the slot that already answers *what moves*; it is never a fifth slot. Three cost-ordered tiers (volume · magnitude · vessel), and a **flow-balance checksum** that makes the encoded numbers verify each other.

**Sources**:
- CAST and Georgian Node System.md §Major system and SEM3 — encoding node metrics (the node-side mechanism this extends to edges, and the scope rule it inherits verbatim)
- stocks-and-flows-foundations §REPRESENT — `Flow = d(Stock)/dt`, the identity behind the category correction below
- [edge-sign](./edge-sign.md) — the sibling additive modifier whose OCP shape this follows
- 2026-08-31 session filling the stub declared 2026-04-30

**Last updated**: 2026-08-31 — stub filled.

**Status**: 🟡 **Candidate** — adopted structure, vessel imagery pending David's pick, promotion gated (see §Promotion gate).

---

## The gap this closes

An edge scene says *what* moves and *how* — it does not say *how much*. `Eagle feeds Pig` is the same scene whether the gateway writes two rows an hour or forty thousand a second, and those are different systems with different failure modes. Three specific losses:

- **Comparative magnitude is invisible.** Which of a hub's five outgoing edges carries the load? The bundle looks flat.
- **Rate and total collapse.** *Transfers 500 GB* (a one-shot migration) and *transfers 500 GB/day* (a steady drain) encode identically, and confusing them is the canonical systems-thinking error.
- **Nothing checks anything.** [nodes-and-edges](./nodes-and-edges.md) verifies structure by counting nodes; there is no equivalent check on the numbers.

## The category correction (why the stub's own title was half wrong)

The 2026-04-30 stub asked for "stock vs. flow **edges**". That is a category error, and naming it is what makes the rest of the design fall out. Per stocks-and-flows-foundations, a flow *is a rate* and a stock *is a level* — `Flow = d(Stock)/dt`. So in any CAST graph:

```
      stock  =  a LEVEL  =  a node property     (how much is here)
      flow   =  a RATE   =  an edge property    (how fast it moves)
```

**Every CAST edge is already a flow.** There is no such thing as a stock edge, so the axis never existed. The question splits cleanly instead:

- on an **edge** — what is the rate? *(this page)*
- on a **node** — what is the level? *(already answered: CAST and Georgian Node System.md §Major system and SEM3 — "bake it into the node scene", worked with in-degree)*

The node half is written and this page does not restate it. This is the same shape as the 2026-08-20 finding that relations cannot be concept-card corners because relations are edges — an axis proposed on the wrong object.

## The rule

> **Quantity is a property of the Stream. It is never a new slot.**

The Stream slot (`Ro` Rock · `Wa` Water · `Cl` Cloud · `Li` Lightning) already answers *what moves*; *how much of it* is an adjective on that noun, not a new question. This keeps the modifier additive — the canonical Character · Action · Stream · Time slots are untouched, nothing is renamed, and every existing edge stays a valid unmarked edge. Same Open/Closed shape as [edge-sign](./edge-sign.md), for the same reason: a slot change would fail OCP, [UMTF](./universal-mental-tagging-framework.md) assign-once, and the dialect orthogonality lock.

## The three tiers

Cost-ordered — use the cheapest one that discriminates. This is Interface Segregation applied to encoding effort ([software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §I): most graphs never need past Q0.

| Tier | Question it answers | Scene move | Cost |
|---|---|---|---|
| **Q0 Volume** | *which edge is bigger?* | scale the Stream itself — a trickle vs a torrent of Water, a pebble vs a boulder of Rock, a wisp vs a thunderhead of Cloud, a flicker vs a forked bolt of Lightning | **zero** — no new element, and every unmarked edge is already a valid mid-volume edge |
| **Q1 Magnitude** | *how much, exactly?* | fuse a number-peg percept into the Stream | one element |
| **Q2 Vessel** | *rate, or one-shot total?* | the Stream arrives **in a container** = a fixed amount delivered once; arriving as an open current = a rate | one element, only on the exception |

```
   Q0    Eagle ~~~~~~~~~~~~~~~~~~~~~~~~~>  Pig        thin stream, low volume
         Eagle ============================>  Pig        thick stream, high volume

   Q1    Eagle ====[peg]================>  Pig        the number, welded into the stream

   Q2    Eagle ====(  vessel  )=========>  Pig        a total, delivered once
         Eagle =====================>  Pig            unmarked = a rate (the default)
```

**Q0 is the default and usually the whole job.** Nearly every live question about a graph is comparative — *is the cache hotter than the database?* — not absolute. Q0 answers those by looking, which is the [CAST](./cast-overview.md) design brief; Q1 answers them by decoding, which is slower. Do not pay for Q1 to answer a Q0 question.

**Q0 is REMAPS's E.** Scaling one element to the extreme is *Exaggerate* ([REMAPS](./remaps.md)), which CAST already uses on node features. Q0 is that move pointed at the Stream, so it installs nothing new.

**Q1 routes to the peg layer; it does not mint one.** The percept comes from whichever peg set is installed — the abstraction is [peg-system](./peg-system.md), the built instance is [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) (one image per `00`–`99`), and the classical instance the raw source uses is Major. Depending on *a number-peg* rather than on one peg set is Dependency Inversion ([software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §D) and keeps this page from going stale when the peg ruling moves.

**The rule Q1 inherits verbatim** from CAST and Georgian Node System.md §Major system and SEM3: *the peg is part of the scene, not floating beside it.* A number standing next to an edge is a caption; a number welded into the Stream is an edge.

**Q2 marks the exception, not the rule.** An edge is a flow, so a **rate is the default and stays unmarked**; only a one-shot total takes the vessel. This mirrors [edge-sign](./edge-sign.md)'s asymmetry, where promotion is unmarked and only inhibition costs an element — the common case must stay free. *Vessel imagery is pending David's pick; a bucket, an amphora, and a sealed crate are all live and none is drilled yet.*

## The flow-balance checksum

Quantity has a verification structure that structure alone does not, and it is the strongest argument for encoding it at all. At any node:

```
        Σ(in-edge rates)  −  Σ(out-edge rates)  =  rate of change of the node's level
```

Walk a node, sum what arrives, subtract what leaves, and compare against the level you encoded on the node. A mismatch means an edge is missing, a rate is wrong, or a Q2 vessel was read as a rate. This is the quantity analogue of the total-node-count checksum CAST already runs, and it is what turns the numbers from decoration into a self-checking layer.

**The checksum is also a generator.** Because the three quantities are related by one equation, encoding any two makes the third *derivable* — so quantity encoding can reduce what you store rather than add to it. If the gateway sends 40,000 reads/sec at the cache and the cache sends 200/sec on to the database, the hit rate was never encoded and never needs to be. That is the spanning-tree move from compression-for-comprehension-framework applied to magnitudes: store the generators, derive the leaves.

## Composition with edge-sign

The two modifiers occupy different positions in the same scene and cannot collide:

```
        SOURCE  ====[ quantity rides HERE ]====  ✂ interceptor  ─>  TARGET
                     the stream body                at the target end
                     (how much)                     (which direction, per edge-sign)
```

[edge-sign](./edge-sign.md) marks *direction of effect* by cutting the Stream just before the target; quantity modifies the *body* of the Stream. A single edge can carry both: a thick stream (high volume) meeting an interceptor is a large inhibitory flow — a throttle on a hot path, which is exactly the edge worth finding first in a live system.

## Worked example

The [nodes-and-edges](./nodes-and-edges.md) running graph, with quantities:

| Edge | Reality | Encoding | Tier |
|---|---|---|---|
| Eagle → Pig (Gateway → Database) | 200 writes/sec | thin stream | Q0 |
| Eagle → Cache | 40,000 reads/sec | torrent | Q0 |
| Pig → object store (nightly export) | 500 GB, once a night | stream arriving in a vessel | Q2 |

Read back: the cache edge visibly dwarfs the database edge, so the hot path is obvious without a single number being recalled — Q0 doing the whole job. The export edge is the only one wearing a vessel, so it is the only total rather than a rate, which is precisely the distinction that would otherwise be lost. If the graph later needs the actual figures, Q1 welds pegs into those same two streams without re-encoding anything.

## Scope rule — when not to encode quantity

Inherited verbatim from the raw source's node-metric rule, because it applies identically to edges:

> Only encode metrics that you would actually need to recall under pressure.

Encoding a rate that governs a decision is useful. Encoding a throughput figure that changes weekly is waste, and worse than waste — it decays, and a decayed number that still looks precise is more dangerous than no number. When in doubt, Q0: an ordering stays true far longer than a value does.

## Failure modes

| Failure | Looks like | Counter |
|---|---|---|
| **Tier escalation** | reaching for Q1 pegs when the question was comparative | ask what question the number answers; if it is *bigger or smaller*, stop at Q0 |
| **Rate/total conflation** | a one-shot migration encoded as a steady flow | the vessel is not optional on totals — an unmarked stream is a *claim* that this is a rate |
| **Precision decay** | an exact peg on a figure that moves weekly | the scope rule; re-read it before every Q1 |
| **Floating numbers** | the peg sits beside the edge rather than inside the Stream | the raw source's welding rule — if the element could be deleted without breaking the scene, it is a caption |
| **Unchecked balance** | quantities encoded, checksum never walked | the checksum is the payoff; encoding without it is decoration |
| **Peg debt** | Q1 used before the peg set is drilled to reflex | Q1 has a prerequisite — [peg-system](./peg-system.md) fluency; without it Q1 is slower than looking the number up |

## METER

Events (`cast::*` namespace, per [METER](./meter-overview.md)):

- `cast.quantity_tier_used {edge, tier}` — which tier fired; the distribution is the anti-ceremony signal
- `cast.flow_balance_check {node, passed, delta}` — a checksum walk and its result
- `cast.quantity_recall {edge, tier, correct, latency_ms}` — read-back accuracy

Proposed floors: **Q0 ≥ 70% of all quantity-bearing edges** (if Q1 dominates, the tiering is being ignored and the modifier has become ceremony); **flow-balance walked on every hub node with ≥3 quantity-bearing edges**; **Q0 comparative read-back < 2 s** without decoding, since a Q0 that needs decoding has failed its own purpose.

## Promotion gate

🟡 Candidate. Within ~4 weeks of first real use on a live graph, **either**:

1. a `cast.flow_balance_check` mismatch catches a genuine encoding error — an edge that was actually missing or mis-encoded, not an arithmetic slip; **or**
2. a comparative magnitude question is answered straight off a Q0 scene, under live conditions, with no lookup and no decode.

Otherwise park it, as the codebook layer was parked on 2026-07-06 — the same standard, for the same reason. Neither criterion is met by drilling; both require a real graph.

## Related pages

- [nodes-and-edges](./nodes-and-edges.md) — the two-layer model this modifies; also owns the edge codes
- [edge-sign](./edge-sign.md) — the sibling additive modifier (polarity); composes, see §Composition
- [CAST](./cast-overview.md) — the encoder
- stocks-and-flows-foundations — owner of stock, flow, and the `Flow = d(Stock)/dt` identity the category correction turns on
- [peg-system](./peg-system.md) — the number-peg abstraction Q1 depends on; [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) is the built instance
- [REMAPS](./remaps.md) — Q0 is its Exaggerate move pointed at the Stream
- [Edge delay](./delay-encoding-in-cast.md) — the sibling modifier for *latency* (written 2026-08-31). The two compose: the material an edge holds **in flight equals rate × delay**, so a rate encoded here plus a gap encoded there makes a hidden buffer visible. It also corrects the flow-balance checksum below, which assumes instant transfer — across a delayed edge, inflow is what departed one delay ago
- [Edge dynamics](./dynamic-edge-encoding.md) — magnitude changing over time (written 2026-08-31); Q0 is its static special case, and it reads a varying rate as the *profile* of the in-flight material. It also relocates the bottleneck reading to this page, where it belongs — a thick stream feeding a thin one is a Q0 reading, not a mechanism of its own
- compression-for-comprehension-framework — the generator rule behind "encode two, derive the third"
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) — §I (tiering), §D (peg abstraction), §The Main Constraint (the scope rule)

---

## U — See (CAST)
1. Quantity as a property of the Stream, never a fifth slot
2. Three cost-ordered tiers: volume → magnitude → vessel
3. Edges carry rates; nodes carry levels; the checksum joins them

## D — Name (NEDF)
1. Encoding quantities in CAST = magnitude welded into the Stream
2. Distinguisher: quantity modifies the Stream body; [edge-sign](./edge-sign.md) cuts it at the target end
3. Failure mode: a floating number beside the edge — a caption, not an encoding

## F — Do (SPEAR)
1. Ask what question the number answers — comparative stops at Q0
2. Exact figure needed? weld a peg into the Stream (Q1)
3. One-shot total, not a rate? add the vessel (Q2)
4. Hub node? walk the flow balance and compare against its level

## B — Watch (HEART)
1. Q1 pegs on figures that change weekly
2. Totals encoded as unmarked streams
3. Quantities encoded but the balance never walked

## L — Predict (ORACLE)
1. Thick stream into a thin one → predict a bottleneck and accumulation upstream
2. Flow-balance mismatch → predict a missing edge before looking for one
3. Q1 dominating the tier distribution → predict the modifier is drifting into ceremony
