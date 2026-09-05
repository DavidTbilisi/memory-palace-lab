---
palace: strategic-memory
level: 6
domain: 10
room: 2
para: resource
semantic_mode: 5
wiki_source: wiki/encoders/delay-encoding-in-cast.md
---

# Delay Encoding in CAST

**Summary**: An **additive, opt-in modifier** for [CAST](./cast-overview.md) edges carrying **latency** — how long this relation takes to make its effect appear. Delay is a **gap inside the edge scene**, never a distance across the palace, because the palace's spatial axis is already fully allocated. Three moves (decompose · gap · peg), and the gap holds something real: the material in flight, which equals rate × delay.

**Sources**:
- system-delays-and-lags — owner of delay, the perception/decision/response taxonomy, time constants, and the oscillation result; this page encodes what that page defines and redefines none of it
- CAST and Georgian Node System.md §Palace placement rules — the six existing claims on the spatial axis that rule out the declared mechanism
- [edge-sign](./edge-sign.md) and [encoding-quantities-in-cast](./encoding-quantities-in-cast.md) — the sibling additive modifiers whose OCP shape this follows
- 2026-08-31 session filling the stub declared 2026-04-30

**Note on provenance**: the CAST raw source says **nothing about delay** — the term does not appear in it. Unlike [edge quantity](./encoding-quantities-in-cast.md), which extends a node-side mechanism the source already specifies, everything below is wiki-side design and is marked as such rather than cited to a source that does not carry it.

**Last updated**: 2026-09-04 — §Related pages: first worked instance recorded (st-example-financial-system, maturity mismatch); 2026-08-31 — stub filled.

**Status**: 🟡 **Candidate** — adopted structure, D2 unit imagery pending David's pick, promotion gated (see §Promotion gate).

---

## The gap this closes

An edge scene says what moves, how much, and in which direction — never *when the effect lands*. `Eagle feeds Pig` reads identically whether the database sees the write in a millisecond or next quarter, and per system-delays-and-lags that difference is "the hidden culprit in system dysfunction": it is what turns a stable loop into an oscillating one. Three losses:

- **Lag is invisible**, so a graph that looks controllable and one that will overshoot encode the same.
- **In-flight material is unrepresented.** Between cause and effect, work exists that neither endpoint holds.
- **Loop behaviour cannot be read.** [lego-skills-patterns](./lego-skills-patterns.md) names a loop as spiral or leash; whether that leash *oscillates* depends on delay, which the encoding drops.

## The declared mechanism does not survive contact

Both the 2026-04-30 stub and system-delays-and-lags §CAST Encoding of Delays declare the same first mechanism: **palace distance — spatial separation = temporal separation.** It cannot be implemented as written, and saying why is what produces the rest of this page.

**The palace's spatial axis is already allocated six ways** (CAST and Georgian Node System.md §Palace placement rules): hubs take the central stops · clusters share an area · bridges sit in doorways · leaves go to corners · feedback loops get a circular path · cascade chains run downhill in causal order. That page also states the axis is load-bearing — *"spatial separation is the primary tool"* for telling nodes apart.

A seventh claim on a fully-booked axis produces direct contradictions, not ambiguity:

| Situation | Placement rule says | "Delay = distance" says |
|---|---|---|
| Two nodes in one cluster, slow edge between them | same room *(rule 2)* | far apart |
| Cascade A→B→C, slow then fast | descending, evenly, in causal order *(rule 6)* | A far from B, B touching C |
| Fast edge between two clusters | doorway, on the threshold *(rule 3)* | adjacent — but the doorway is fixed |

This breaks orthogonality in the form [UMTF](./universal-mental-tagging-framework.md) §Orthogonality Rules states it: *do not let the same cue mean two different things inside the same local system.* Palace distance already means **topological relatedness**. It cannot also mean duration.

**What is actually free is the geometry *inside* the edge scene.** A scene has its own local space — how far the Stream travels before it lands — and nothing has claimed it. That keeps the palace axis untouched and the modifier additive, the same OCP shape [edge-sign](./edge-sign.md) and [edge quantity](./encoding-quantities-in-cast.md) were forced into.

> **Delay is distance inside the scene. Never distance across the palace.**

## The trap next door: delay is not the T slot

The Tier 2 **T** slot (`Re` Red cave · `Bl` Blue ocean · `Gr` Green sky · `Pu` Purple storm) is the obvious place a reader looks, and it is wrong. T encodes **stability** — permanent · normally active · conditional · temporary. Delay encodes **latency**. The two are orthogonal, and every combination is real:

```
                    fast                    slow
   permanent   a cache read              a mortgage amortizing
   temporary   a burst retry             an emergency loan maturing
```

A permanent relation can be slow; a temporary one can be instant. Putting latency in T would overwrite stability and lose both — the same axis-swap error that was rejected for polarity on 2026-07-09.

## The three moves

**D0 — Decompose, if you can name the stages.** Preferred, and it is *not a modifier at all*. system-delays-and-lags names delay's internal structure — perception, then decision, then response. When those stages are nameable, the honest encoding is **three edges through two intermediate nodes**, not one annotated edge:

```
   annotated:   Sensor ====[ slow ]===============>  Actuator

   decomposed:  Sensor ──>  Noticing ──>  Deciding ──>  Actuator
                    perception   decision    response
```

CAST can already say this — it is a graph. Decomposition makes each lag separately visible, separately fixable, and checkable by the ordinary node-count checksum, which an annotation never is. **Reach for a modifier only when the stages cannot be named or are not worth nodes.** This is DRY: do not mint a mechanism for something the encoder already expresses.

**D1 — The gap** (ordinal, free). When the delay stays atomic, the Stream **crosses visible space before it lands**. Contact = immediate; a short flight = short lag; a long, slow traverse = long lag. It renders for all four Streams: the boulder mid-arc, the water arcing before it strikes, the cloud still drifting, the bolt forked across open sky. No new element — the Stream was always there; it now has air time.

**D2 — The peg** (exact). Weld a number-peg percept into the gap, exactly as `Q1` welds one into the Stream body, routed to [peg-system](./peg-system.md) rather than minting a vocabulary. A duration needs its **unit** or it is meaningless — three *what?* — so D2 carries a unit marker beside the magnitude. *Unit imagery is pending David's pick; the natural candidates are borrowed from [calendar-memory](./calendar-memory.md)'s existing time vocabulary rather than invented, which would keep D2 at zero new installs.*

## What the gap holds

The gap is not decoration. **The material in flight equals rate × delay** — Little's Law, `L = λW`, and it is the reason this modifier composes rather than merely coexists with [edge quantity](./encoding-quantities-in-cast.md):

```
   Eagle ====[ rate ]====(  in flight = rate × delay  )====>  Pig
                              this is what the gap holds
```

A pipeline carrying a torrent across a long gap is holding a large hidden buffer that neither endpoint has — the classic *the queue is full of stale work* failure, which is invisible in an undelayed encoding and **visible on sight** once both modifiers are on the edge. Two consequences:

- **A checksum.** The material shown in the gap must agree with rate × delay. (This is a long-run average; when the rate itself varies, [edge dynamics](./dynamic-edge-encoding.md) reads the *profile* along the gap for the instantaneous picture.) Disagreement means the rate, the delay, or the unit is wrong.
- **An extension of the flow-balance checksum.** [encoding-quantities-in-cast](./encoding-quantities-in-cast.md)'s node balance silently assumes instant transfer. With delays encoded, a node's inflow must be read as *what departed one delay ago*, not what is departing now — which is precisely why delayed systems overshoot.

## The oscillation reading

Once delay is on the edges and [lego-skills-patterns](./lego-skills-patterns.md) has named the loop, its **behaviour becomes derivable rather than asserted**. system-delays-and-lags §Time Constants owns the rule and supplies the threshold — the ratio of delay to time constant decides whether a balancing loop settles or oscillates. This page adds only that both terms are now readable off the encoding: the delay from the gap, the loop from the pattern. A leash with a long gap is a loop that will overshoot, and that is a graph-level prediction made by looking.

## Composition with the other modifiers

Three modifiers, one Stream, three disjoint positions — so all three can ride one edge without collision:

```
   SOURCE  ==[ thickness = how much ]==(  gap = how long  )==  ✂  ─>  TARGET
                    quantity                   delay          edge-sign
                  (stream body)              (air time)      (target end)
```

The worst edge in any system is now a single readable picture: **thick stream, long gap, interceptor** — a high-volume, slow, inhibitory path. That is the edge to find first in a live graph, and it is exactly the [CAST](./cast-overview.md) design brief of seeing rather than deriving.

## Worked example

The [nodes-and-edges](./nodes-and-edges.md) running graph, with a fourth edge added:

| Edge | Reality | Encoding |
|---|---|---|
| Eagle → Cache | 40,000 reads/sec, sub-millisecond | torrent, **contact** — no air time |
| Eagle → Pig (Database) | 200 writes/sec, replicated | thin stream, **short flight** |
| Pig → Analytics | 200 rows/sec, batched hourly | thin stream, **long traverse**; in flight ≈ 720,000 rows |
| Analytics → Eagle (autoscaling signal) | acts on hour-old data | **long gap** closing the loop |

Read back: the loop Analytics → Eagle → Pig → Analytics is a leash (stabilizing) carrying a long gap, so the reading is *this controller will oscillate* — it scales on hour-old data. Nothing about that is stored; it falls out of the gap plus the pattern. And the analytics edge is visibly holding three quarters of a million rows nobody has, which is what a batch window actually is.

## Rejected: walk speed

The declared second mechanism — *slow walk = long delay, fast walk = short delay* — is not adopted. Three reasons, recorded so it is not re-proposed:

1. **It is not storage.** Walk tempo is a property of the rehearsal, not of the artifact. Close the palace and it is gone; the gap survives.
2. **It cannot be checked.** There is no readback that fails when a walk speed is wrong, so it can never be verified, and per [encoding-quantities-in-cast](./encoding-quantities-in-cast.md)'s standard an unverifiable annotation is decoration.
3. **It fights automaticity.** Timed palace walks are a drill instrument and the target is *fast*. Encoding meaning into slowness makes the drill and the encoding pull against each other.

## Failure modes

| Failure | Looks like | Counter |
|---|---|---|
| **Palace-distance relapse** | moving nodes apart to show a slow edge | the axis is booked six ways; the gap is inside the scene |
| **Latency in the T slot** | encoding "slow" as Purple storm | T is stability, not latency; they are orthogonal and both are needed |
| **Annotating what should decompose** | one slow edge where perception/decision/response are all nameable | D0 first — a modifier is the fallback, not the default |
| **Unitless durations** | a peg reading "three" with no unit | D2 carries its unit or the in-flight arithmetic is meaningless |
| **Stale delays** | a lag encoded once, the system since re-architected | the scope rule from [encoding-quantities-in-cast](./encoding-quantities-in-cast.md) applies unchanged — encode only what must be recalled under pressure |
| **Instant-transfer balance** | walking a flow balance across delayed edges as if inflow were simultaneous | inflow is what departed one delay ago; that offset *is* the overshoot mechanism |

## METER

Events (`cast::*` namespace, per [METER](./meter-overview.md)):

- `cast.delay_move_used {edge, move}` — D0 · D1 · D2; a distribution dominated by D2 means decomposition is being skipped
- `cast.delay_decomposed {edge, stages}` — a delay converted into intermediate nodes, the preferred outcome
- `cast.inflight_check {edge, passed}` — the rate × delay agreement
- `cast.loop_oscillation_called {loop, correct}` — a behaviour prediction read off gap + pattern, scored against reality

Proposed floors: **D0 attempted before any D1/D2 on edges whose stages are nameable**; **in-flight check walked on every edge carrying both a rate and a gap**; **loop-oscillation calls ≥ 70% correct** before the reading is trusted in a live setting.

## Promotion gate

🟡 Candidate. Within ~4 weeks of first real use on a live graph, **either**:

1. a `cast.inflight_check` disagreement catches a genuine error — a wrong rate, a wrong lag, or a dropped unit; **or**
2. an oscillation call is made off gap + pattern *before* the behaviour was observed, and proves right.

Otherwise park it, the same standard applied to the codebook layer on 2026-07-06 and to [edge quantity](./encoding-quantities-in-cast.md) today. Criterion 2 is the sharper one: it is the only test that distinguishes an encoding that *predicts* from one that merely records.

## Related pages

- archetype-encoding-in-cast — where the oscillation reading is named: a lone leash with a long gap *is* the Balancing-with-Delay archetype, one of five loop couplings
- st-example-financial-system — a worked instance: maturity mismatch passes the Encode test into this modifier, and two gaps of visibly different width in one scene set carry the whole difference between a fast and a slow loop
- system-delays-and-lags — owner of delay, the perception/decision/response taxonomy, time constants, and the oscillation result; its §CAST Encoding of Delays points here for the mechanism
- [Edge quantity](./encoding-quantities-in-cast.md) — the sibling modifier; composes via in-flight = rate × delay
- [edge-sign](./edge-sign.md) — the third modifier; the interceptor sits at the target end, past the gap
- [nodes-and-edges](./nodes-and-edges.md) — the two-layer model this modifies; also owns the edge codes
- [CAST](./cast-overview.md) — the encoder; owner of the palace placement rules the lead finding turns on
- [lego-skills-patterns](./lego-skills-patterns.md) — spiral/leash; the loop half of the oscillation reading
- [peg-system](./peg-system.md) — the number-peg abstraction D2 depends on
- [calendar-memory](./calendar-memory.md) — existing time vocabulary D2's unit markers should borrow from rather than reinvent
- [Edge dynamics](./dynamic-edge-encoding.md) — magnitude changing *over* time (written 2026-08-31), where quantity and delay meet: it reads this page's gap as a **time axis** and plots the rate's recent history along it. It also refines §What the gap holds — rate × delay is the long-run average (Little's Law holds for any arrival pattern), while the profile answers *why is it full right now*
- [UMTF](./universal-mental-tagging-framework.md) — §Orthogonality Rules, the rule the declared mechanism breaks

---

## U — See (CAST)
1. Delay as a gap inside the edge scene, never a palace distance
2. Decompose first; annotate only atomic lags
3. The gap holds the in-flight material — rate × delay

## D — Name (NEDF)
1. Delay encoding in CAST = air time before the Stream lands
2. Distinguisher: T is stability, the gap is latency — orthogonal, both needed
3. Failure mode: moving nodes apart, on an axis already booked six ways

## F — Do (SPEAR)
1. Can you name perception / decision / response? → make them nodes, stop
2. Atomic lag? → give the Stream air time (D1)
3. Exact duration needed? → weld a peg *and its unit* into the gap (D2)
4. Rate also encoded? → check the in-flight material against rate × delay
5. Gap inside a loop? → read the oscillation before it happens

## B — Watch (HEART)
1. Nodes drifting apart in the palace to signal slowness
2. Slow edges parked in the T slot
3. Flow balances walked as if transfer were instant

## L — Predict (ORACLE)
1. Long gap on a leash loop → predict overshoot and oscillation
2. Torrent across a long gap → predict a large hidden buffer of stale work
3. D2 dominating the move distribution → predict decomposition is being skipped
