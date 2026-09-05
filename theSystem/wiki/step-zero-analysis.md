---
palace: strategic-memory
level: 7
domain: 10
room: TBD
para: resource
semantic_mode: 5
glyph: 🛰️
wiki_source: wiki/encoders/step-zero-analysis.md
---

# Step 0 Analysis — read the graph before encoding any of it

**Summary**: The four checks that run **before** a single Georgian animal is assigned — in-degree · bridges · feedback loops · edge-tier classification. Encoding a misunderstood graph wastes the whole encode, because the palace ends up shaped like your misreading rather than like the system. This page owns the four checks and the deterministic letter-assignment rule that falls out of the first one.

**Sources**:
- `raw/Neural OS Book/CAST and Georgian Node System.md` §Step 0 — Analyze the graph before encoding anything (lines 45–82) — the four checks, the in-degree sort, and the never-reassign rule; §SCAMPER (lines 1162–1176) — the simplification pass that runs *before* Step 0
- [lego-skills-patterns](./lego-skills-patterns.md) §Recognition — the pattern scan added to this phase after the source was written
- [cast-example-city-streets](./cast-example-city-streets.md) §Step 0: count edges, not streets — the worked instance
- 2026-09-04 session: page written to close a four-month orphan-by-omission (10 inbound links from 6 live pages, never authored)

**Last updated**: 2026-09-04 — page created.

---

## Why there is a step before step one

> Never start encoding until you have done four checks. Encoding a misunderstood graph wastes all the work. (source: CAST and Georgian Node System.md)

The cost is asymmetric and that is the whole argument. A wrong reading discovered *during* Step 0 costs a minute. The same wrong reading discovered after placement has already been baked into letter assignments, room choices, and merged scenes — and per [image-merging](./image-merging.md) a merged scene is deliberately hard to take apart. You cannot cheaply revise what you correctly made irreversible.

[cast-overview](./cast-overview.md) lists **skipping Step 0** as a named failure mode for exactly this reason.

## The four checks

Four independent readings of the same graph — a checklist, so it takes a square ([representation-rules](./representation-rules.md) Rule 10). An empty corner is a check you skipped.

```
         IN-DEGREE ────────────── BRIDGES
         who is a hub?            what disconnects it?
             │                        │
             │                        │
         LOOPS ────────────────── EDGE TIER
         what returns?            what collides?
```

### 1. In-degree — find the hubs

In-degree is how many nodes point at this one. High in-degree = hub = **encode first**, because everything else depends on it being stable.

This check pays a second dividend the others don't: it makes letter assignment *deterministic*. Sort nodes by in-degree descending; the highest gets ა, and ties break by reading order top-to-bottom, left-to-right. Two people encoding the same graph get the same animals, and so do you and your future self. Once assigned, **never reassign** — stability is the point. ([georgian-animals](./georgian-animals.md) carries the letter→animal table.)

### 2. Bridges — find the single points of failure

A bridge is an edge whose removal disconnects the graph. Forget a bridge and you lose the structural meaning of everything on the far side of it, so bridges get priority encoding.

The fast manual test: remove each edge mentally and ask *does the graph fall into two separate pieces?* Formal treatment and the algorithmic version live at graph-theory-overview.

### 3. Feedback loops — find what comes back

Follow any chain of arrows; if you return to a node you have already visited, that is a loop. Mark loops **separately, before** encoding individual edges — linear encoding hides them, and what they hide is amplification and instability. feedback-loop-taxonomy owns the dynamics; [lego-skills-patterns](./lego-skills-patterns.md) supplies the spiral/leash pair the loop is encoded as, and [edge-sign](./edge-sign.md) supplies the check that verifies the choice.

### 4. Edge tier — find the collisions

Sort every edge into one of two tiers ([nodes-and-edges](./nodes-and-edges.md) owns both):

- **Tier 1** — distinct from every other edge by verb alone. Encode verb-only.
- **Tier 2** — looks like another edge (same verb, same direction). Encode with full CAST.

Start at Tier 1 and promote only where collisions actually exist. **Most graphs are mostly Tier 1** — reaching for Tier 2 by default is the ceremony [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §The Main Constraint rejects, and it is the same "cheapest thing that discriminates" rule that governs the edge modifiers ([nodes-and-edges](./nodes-and-edges.md) §Modifier composition).

## What runs before, and what was added after

**Before — simplification.** SCAMPER is applied to the raw graph *before* Step 0, to cut complexity without losing structural meaning: collapse a subgraph to a hub, merge behaviourally identical nodes, drop edges you would not need under pressure. The source reports it often takes a 15-node graph to 8 and a 20-edge graph to 12. SCAMPER is an external technique with no wiki page; the in-wiki move for the same job is [chunking](./chunking.md) — collapse a cluster before encoding it. (source: CAST and Georgian Node System.md)

**After — the pattern scan.** [lego-skills-patterns](./lego-skills-patterns.md) later added a fifth move to this phase: scan for known topologies (wheel, chain, spiral, leash, dominoes, funnel, diamond, bridge) before any animal is assigned — *clusters give the rooms, patterns give the chunks, and what remains is the short list*. This extends the source's four checks rather than renumbering them; the four above stay the canonical set.

```
   SCAMPER / chunking  ──▶  STEP 0 (4 checks + pattern scan)  ──▶  assign animals  ──▶  encode
        simplify                    understand                      commit          make irreversible
```

## Failure modes

- **Encoding in reading order.** Assigning animals in the order nodes appear in the diagram, rather than by in-degree, produces a palace whose prominence ordering contradicts the system's.
- **Reassigning a letter after the fact.** Breaks every scene already built on it. Accept a suboptimal early assignment over a re-sort.
- **Finding loops after encoding edges.** A loop discovered late has usually already been encoded as unrelated linear edges, and the amplification it implies is invisible in that form.
- **Defaulting to Tier 2.** Promotion is for actual collisions, not for anticipated ones.
- **Running Step 0 once on a graph with sub-palaces.** Anything with internal structure complex enough to earn its own palace earns its own Step 0, run independently. (source: CAST and Georgian Node System.md)

## METER

- `step0.run_rate` — encodes preceded by a full four-check pass ÷ all encodes (pass floor 90%)
- `step0.reassignment_count` — letters reassigned after encoding began (target 0)
- `step0.late_loop_discoveries` — loops found after edge encoding started (target 0)

## Related pages

- [CAST](./cast-overview.md) — the encoder this precedes; names skipping Step 0 as a failure mode
- [nodes-and-edges](./nodes-and-edges.md) — owner of the Tier 1 / Tier 2 distinction check 4 applies
- [georgian-animals](./georgian-animals.md) — the letter→animal table the in-degree sort feeds
- graph-theory-overview — formal centrality, bridges, and connectivity behind checks 1–2
- [lego-skills-patterns](./lego-skills-patterns.md) — the pattern scan added to this phase
- feedback-loop-taxonomy — the dynamics check 3 is looking for
- [chunking](./chunking.md) — the in-wiki simplification move that runs before this
- [cast-example-city-streets](./cast-example-city-streets.md) — Step 0 worked on a real graph
- [mnemonic-checksum](./mnemonic-checksum.md) — the recall-time counterpart; Step 0 verifies the graph before encoding, the checksum verifies the encoding after

---

## U — See (CAST)
1. A square of four readings taken before any animal lands
2. Hubs first, bridges marked, loops circled, collisions flagged

## D — Name (NEDF)
1. Step 0 = the pre-encode analysis pass over a graph
2. Distinguisher: it changes *nothing* in the graph — SCAMPER simplifies, Step 0 only reads
3. Failure mode: assigning letters in reading order instead of by in-degree

## F — Do (SPEAR)
1. New graph → simplify first, then run the four checks
2. Sort by in-degree, assign letters descending, freeze them
3. Mark bridges and loops before touching individual edges

## B — Watch (HEART)
1. Encoding begun before the loop scan
2. Letters re-sorted mid-encode "because it reads better now"
3. Sub-palaces inheriting the parent's Step 0 instead of getting their own

## L — Predict (ORACLE)
1. Graphs past ~8 nodes → skipping Step 0 shows up as palace/structure mismatch
2. Reassignment count above 0 in a month → the sort is being run too late

## R — Act (GRACE)
1. Unsure of a node's importance → count in-degree, do not estimate
2. Two edges that feel alike → classify as Tier 2 now, not at merge time
