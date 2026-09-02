---
palace: strategic-memory
level: 6
domain: 10
room: 2
para: resource
semantic_mode: 5
wiki_source: wiki/encoders/dynamic-edge-encoding.md
---

# Dynamic Edge Encoding

**Summary**: How to encode a CAST edge whose magnitude **changes over time**. The short answer is usually **don't** — most variation is already derivable from structure the graph carries, and storing it duplicates the generator. What remains is narrow, and it is free: the delay gap is a time axis, so a varying rate is the *shape* of the material in flight.

**Sources**:
- systems-thinking-foundations §System Behavior Patterns — the structure→behaviour table that makes most edge dynamics derivable rather than storable
- [encoding-quantities-in-cast](./encoding-quantities-in-cast.md) and [delay-encoding-in-cast](./delay-encoding-in-cast.md) — the two modifiers this composes; the gap-as-time-axis is the delay page's result
- CAST and Georgian Node System.md §CAST cheat sheet — the **T** slot, which already owns on/off variation
- 2026-08-31 session filling the last of the four extension stubs declared 2026-04-30

**Note on provenance**: as with [delay-encoding-in-cast](./delay-encoding-in-cast.md), the CAST raw source carries nothing on edge dynamics. Wiki-side design.

**Last updated**: 2026-08-31 — stub filled.

**Status**: 🟡 **Candidate**, and the thinnest of the three edge modifiers by design — see §Most of this page's brief was already delivered.

---

## Most of this page's brief was already delivered

The 2026-04-30 stub asked for three things: *changing edge strength · bottleneck visualization · stress patterns.* Two were delivered by other pages earlier today, and rebuilding them here would violate DRY:

| Declared deliverable | Where it actually lives |
|---|---|
| **Bottleneck visualization** | A *reading* of [Q0 volume](./encoding-quantities-in-cast.md), not a mechanism — a thick stream feeding a thin one **is** the bottleneck, and accumulation upstream follows |
| **Stress / oscillation patterns** | The [delay](./delay-encoding-in-cast.md) × [lego-skills-patterns](./lego-skills-patterns.md) unlock — loop type plus gap gives the oscillation reading |
| **Changing edge strength** | The genuine remainder, and the only subject of this page |

Naming this is the point rather than an apology: an extension slot declared before its neighbours were built will overlap them, and the honest move on arriving last is to shrink to the gap that is left.

## The default: do not encode it

systems-thinking-foundations §System Behavior Patterns states the result this page turns on — **behaviour comes from structure**. A reinforcing loop alone gives exponential growth; a balancing loop gives approach-to-goal; the two together give S-shaped growth; a balancing loop with a long delay oscillates. So if an edge's rate varies *because the graph makes it vary*, the variation is already encoded — in the loops, the signs, and the gaps — and storing the resulting curve stores a **trace** where the graph already holds the **generator**. That is the compression rule compression-for-comprehension-framework owns, applied to time: keep the generator, derive the behaviour.

Three checks before any dynamic annotation. Each one, if it fires, means the answer is elsewhere and this page is done with you:

1. **Is it driven by a loop in the graph?** → the loop already says so. [lego-skills-patterns](./lego-skills-patterns.md) names it; §System Behavior Patterns reads it.
2. **Is the edge sometimes simply off?** → that is the **T** slot, which already owns exactly this: `Re` permanent · `Bl` normally active, occasionally paused · `Gr` conditional · `Pu` unstable. On/off variation is not a missing mechanism, it is a slot people forget they have.
3. **Is it a lag effect — overshoot, ringing, a full pipeline?** → [the gap](./delay-encoding-in-cast.md) plus the loop pattern already predicts it.

**What survives all three is narrow: variation nothing inside the graph explains.** Diurnal traffic, seasonal demand, a batch window, an external market. That is the case worth encoding, precisely because no generator is present to derive it from.

## When it does survive: the gap is already a time axis

[delay-encoding-in-cast](./delay-encoding-in-cast.md) established that an edge's gap holds material **in flight** — so the near end of the gap is what departed just now, and the far end is what is landing, having left one delay ago. **The gap is therefore a time axis, and it is already drawn.** A varying rate is the *shape* of the material along it. No new element, which is why this modifier costs nothing:

```
                    ← time ago ──────── now →

   uniform     Eagle ==========================>  Pig     steady
   beaded      Eagle ==o===o===o===o===o========>  Pig     bursty
   thickening  Eagle ====------========#########>  Pig     rising
   thinning    Eagle ####========------==========>  Pig     falling
   alternating Eagle ==####====####====####======>  Pig     cyclic
```

Read the profile from the target end backwards and it is a behaviour-over-time graph the scene was already carrying. Nothing is added; something already present is simply *read*.

**The naming move — Dyn0 · Dyn1 · Dyn2** — mirrors its two siblings, and the doctrine is identical across all three: **prefer structure to annotation.**

- **Dyn0 — derive.** The default, above. Not a modifier.
- **Dyn1 — the profile.** The shape of the in-flight material along the gap. Ordinal and free.
- **Dyn2 — name the driver as a node.** If the variation is exogenous, *the graph is incomplete*. Adding the driver — the clock, the season, the market — as a node with an edge converts a mystery into structure, and the variation becomes derivable by Dyn0. This is D0-decompose's twin: the strongest move is the one that stops needing the modifier.

## The constraint that keeps this honest

**Dyn1 requires a gap.** A contact edge — no delay — has no time axis, so no profile can be drawn on it. This is not an encoding limitation but a physical fact: with no lag, no recent history is in flight anywhere, and there is nothing to look at.

The consequence is useful rather than awkward. If a zero-delay edge appears to vary, the variation is not in the edge — it is in **what feeds it**, and it belongs to the *source node*, encoded there by the node-metric mechanism the raw source already specifies (CAST and Georgian Node System.md §Major system and SEM3). A pipe does not fluctuate; the thing pouring into it does. Reaching for Dyn2 is usually the better answer.

## Refinement to the in-flight arithmetic

[delay-encoding-in-cast](./delay-encoding-in-cast.md) gives in-flight material as **rate × delay** (Little's Law, `L = λW`). That remains correct — Little's Law is a statement about **long-run averages**, and it holds for any arrival pattern. Dyn1 adds only the instantaneous reading: at any moment the material in the gap is the *integral of the rate over the delay window*, which is why a bursty edge with the same average rate can present a full pipeline and an empty one minutes apart. Use rate × delay for the steady check; read the profile when the question is *why is it full right now*.

## Worked example

Extending the [encoding-quantities-in-cast](./encoding-quantities-in-cast.md) / [delay-encoding-in-cast](./delay-encoding-in-cast.md) running graph:

| Edge | Variation | Verdict |
|---|---|---|
| Analytics → Eagle (autoscaling) | rate swings on a cycle | **Dyn0** — it is the delayed balancing loop oscillating; already encoded, do not annotate |
| Eagle → Cache | idle at night, saturated at noon | **Dyn2** — nothing in the graph explains a clock, so the graph is missing a node; add the diurnal driver |
| Pig → Analytics | hourly batch: nothing, then a flood | **Dyn1** — beaded stream across the long gap, and the beads are why the pipeline is alternately empty and full |

Only one of the three earns an annotation. That ratio is the point, and the [METER](./meter-overview.md) floor below makes it falsifiable rather than a slogan.

## Failure modes

| Failure | Looks like | Counter |
|---|---|---|
| **Trace instead of generator** | drawing the curve a loop already produces | the three checks; if a loop drives it, the loop is the encoding |
| **Forgetting the T slot** | inventing a mechanism for "sometimes off" | `Bl` normally active and `Gr` conditional already say it |
| **Profile without a gap** | a varying shape drawn on a contact edge | no lag, no time axis — the variation belongs to the source node |
| **Exogenous shrug** | annotating "it just varies" | that is a missing node, not a missing annotation (Dyn2) |
| **Average/instant conflation** | reading a beaded pipeline as over-full | rate × delay is the average; the profile is the instant |
| **Decorative dynamism** | every edge given a texture | if the profile changes no decision, it is ornament — the scope rule from [encoding-quantities-in-cast](./encoding-quantities-in-cast.md) applies unchanged |

## METER

Events (`cast::*` namespace, per [METER](./meter-overview.md)):

- `cast.dynamics_check_passed {edge, which}` — which of the three checks diverted the annotation (the *good* outcome)
- `cast.dynamics_annotated {edge, move}` — Dyn1 or Dyn2 actually used
- `cast.dynamics_driver_added {edge, driver}` — a Dyn2 conversion of exogenous variation into a node

Proposed floor, and it is deliberately hostile to this page's own mechanism: **Dyn0 must divert the clear majority of dynamic questions.** If `dynamics_annotated` outpaces `dynamics_check_passed`, the modifier is being used to store traces the structure already generates, and it should be parked rather than tuned.

## Promotion gate

🟡 Candidate. Within ~4 weeks of first real use, **either**:

1. a **Dyn2** conversion adds a driver node that then explains variation on *more than one* edge — the test that exogenous-shrug was hiding real structure; **or**
2. a **Dyn1** profile answers a *why is it full right now* question that rate × delay could not.

Otherwise park it. Given how much of this page routes elsewhere, parking costs almost nothing — which is the correct risk profile for the last stub in a set whose neighbours already do most of the work.

## Related pages

- [Edge quantity](./encoding-quantities-in-cast.md) — the thickness this varies; also owns the scope rule and the bottleneck reading the stub misattributed here
- [Edge delay](./delay-encoding-in-cast.md) — the gap this reads as a time axis; source of the in-flight arithmetic refined above
- [edge-sign](./edge-sign.md) — the third modifier; polarity, at the target end
- systems-thinking-foundations — §System Behavior Patterns, the structure→behaviour table behind Dyn0
- [lego-skills-patterns](./lego-skills-patterns.md) — the loop patterns Dyn0's first check reads
- [nodes-and-edges](./nodes-and-edges.md) — the two-layer model; the **T** slot lives in Tier 2 there
- compression-for-comprehension-framework — generator over trace, the rule Dyn0 instantiates
- [CAST](./cast-overview.md) — the encoder

---

## U — See (CAST)
1. Most edge variation is derivable — the loop, the T slot, or the gap already says it
2. The gap is a time axis, so a profile costs nothing to read
3. Exogenous variation means a missing node, not a missing annotation

## D — Name (NEDF)
1. Dynamic edge encoding = the shape of the material in flight
2. Distinguisher: quantity is thickness, delay is length, dynamics is thickness *along* the length
3. Failure mode: storing a trace the structure already generates

## F — Do (SPEAR)
1. Run the three checks — loop? T slot? lag effect? — and stop if any fires
2. Survives all three and has a gap? read the profile (Dyn1)
3. Nothing in the graph explains it? add the driver as a node (Dyn2)
4. No gap at all? the variation belongs to the source node, not the edge

## B — Watch (HEART)
1. Curves drawn for behaviour a loop already produces
2. New mechanisms invented for "sometimes off"
3. Every edge acquiring a texture

## L — Predict (ORACLE)
1. Beaded profile on a long gap → predict a pipeline alternately empty and full
2. Exogenous variation left unannotated → predict a node is missing, and that it explains more than one edge
3. `dynamics_annotated` outpacing `dynamics_check_passed` → predict the modifier has become ornament
