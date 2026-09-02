---
type: concept
glyph: 🪜
palace: core-memory
level: 8
domain: 10
room: 2
wiki_source: wiki/learning-systems/structure-first.md
---

# Structure First

**Summary**: The principle that when material has multiple parts, you encode the **structure before the content** — the skeleton of parts and relations first, the details poured in afterward. It is the parent of several named methods that are each the same rule specialized to one input mode: [zoom-in-zoom-out](./zoom-in-zoom-out.md) for text, [CAST](./cast-overview.md)'s top-level-graph-first order for systems, [SCREAM](./semantic-listening-system.md)'s subject-buckets-first for live speech, and [ORIENT](./orient-method.md)'s layout pass for physical space. The book states it as a rule; [bedrock](./bedrock.md) supplies the mechanism — a detail met inside a structure arrives with an *address* and a *contrast set*, and a detail met in isolation has neither and gets pruned.

**Sources**:
- raw/Neural OS Book/Overview.md (the memory-resistant-input table: "arguments, long text, chapters → memorize structure first")
- raw/Neural OS Book/CAST and Georgian Node System.md (encode step 20: "encode top-level structure first, then zoom in")
- raw/CAST_MATURITY_LEVELS.md (Level 4: "reading the structure first, then encoding it — not rushing to scenes")
- raw/Neural OS Book/Active Listening.md (the SCREAM listening method: "capture structure first")

**Last updated**: 2026-08-27

---

## The principle

Most real material is not a flat list — it is parts connected by relations. Structure-first says: **capture the connection pattern before the contents of the nodes.** Build the frame, confirm the frame, then fill it. The move is deliberately staged so that no detail is ever encoded before it has a place to live. (source: Overview.md; CAST_MATURITY_LEVELS.md)

The wiki treats *structure* and *content* as separately storable layers — the same split that lets compression-for-comprehension-framework learn a batch of similar materials by storing the shared structure once and only the per-item content separately. Structure-first is the encoding-order consequence of that split: structure is the cheaper, more reusable, more load-bearing layer, so it goes first.

## Same rule, four input modes

The principle is stated once and then repeated per input mode across the book. Each row is the same instruction wearing a different method name.

| Input mode | Structure-first takes the form of… | Owner / source |
|---|---|---|
| **Text, chapters, courses** | Build the map (TOC / headings / section purposes) before any detail; descend one level at a time | [zoom-in-zoom-out](./zoom-in-zoom-out.md) |
| **Systems, graphs** | Encode the top-level graph first, then zoom into sub-nodes; read the structure before rushing to scenes | [CAST](./cast-overview.md) step 20; [CAST Maturity](./maturity-levels-overview.md) Level 4 |
| **Live speech** | Capture the 3–7 subject buckets first, then fill each with the details as they arrive | [SCREAM](./semantic-listening-system.md) |
| **Physical / new environments** | Layout pass first (stable landmarks and zones) before people and rules; spatial structure before contents | [ORIENT](./orient-method.md) |

Reading down the "form" column is a good self-check: if you have a named method for one mode but not another, you have a coverage gap, not a different skill.

## Why structure has to come first

The book asserts the rule; [bedrock](./bedrock.md) explains why it is load-bearing rather than merely tidy. A detail encoded before its structure exists fails for two linked reasons (source: bedrock §The survival filter):

1. **No address.** Retrieval is competition for a shared cue. A detail with no parent in a structure has no address of its own, competes with its neighbours for the same cue, and is quietly pruned — the failure looks like weak memory and is actually an *ambiguous address*.
2. **No contrast set.** You cannot draw the distinction that makes a detail worth keeping — the [NEDF](./nedf-overview.md) Distinguisher slot — unless its nearest neighbour is in the same frame. Structure puts the neighbours in the frame; the distinction then comes almost free (see [interleaving](./interleaving.md)).

So structure-first is not an aesthetic preference for tidiness. It is the precondition under which details are addressable and separable at all — which is exactly [CAST](./cast-overview.md)'s structural claim that a node acquires meaning from its edges rather than carrying it alone.

## The strong version vs the weak version

Structure-first is easy to do badly, in the direction of a passive overview. The rule inherits [bedrock](./bedrock.md)'s correction: the operative ingredient is the *discrimination the structure enables* and the fact that you *built* it, not the overview itself.

- **Built, not handed over** — sketch the frame yourself ([generation-effect](./generation-effect.md)); a frame you read passively is nearly free of retention value and feels deceptively comprehensible ([fluency-illusion](./fluency-illusion.md)).
- **Cheap and early, never complete** — the frame is a ten-minute rough structure with neighbours in it, not a finished map; being wrong early costs nothing and it will be revised.
- **A frame with contrast, not just an outline** — its job is to make neighbours visible so you can tell them apart, which is a [desirable difficulty](./desirable-difficulties.md), not a comprehension aid.

## Failure modes

- **Premature content** — encoding vivid details before the structure exists (CAST Maturity Level 4's named anti-pattern: rushing to scenes before understanding the graph). The details have no address and are pruned.
- **Structure pursued to completeness** — the frame becomes a research project that delays all use; a complete frame read passively is [fluency-illusion](./fluency-illusion.md) with extra steps.
- **Structure read, not built** — accepting a handed-over outline; loses the [generation-effect](./generation-effect.md) and the contrast work.
- **Wrong layer compressed** — compression-for-comprehension-framework's rule "topology is sacred — compress nodes, never edges": you may simplify the *contents* of a part, but destroying the *relations* destroys the structure that the whole method depends on.

## Visual

```diagram
   STRUCTURE  (encode first)          then  CONTENT  (pour in)
   ┌───────────────────────────┐            ·  ·  ·  ·  ·  ·
   │  ·──────·        ·         │            fill each node/slot
   │  │      │       /│\        │            once it has a place
   │  ·──────·      · · ·       │
   │  parts + relations, the    │      each detail now arrives with:
   │  frame with neighbours in   │        • an ADDRESS  (a parent)
   │  it — cheap & early, ~10min │        • a CONTRAST SET (its neighbours)
   └───────────────────────────┘

   one principle · four input modes
   text ─────────▶ zoom-in-zoom-out   (map → section → detail)
   systems ──────▶ CAST top-graph-first
   live speech ──▶ SCREAM subject-buckets-first
   space ────────▶ ORIENT layout pass
```

The frame goes up before anything is poured in; a detail set down before the frame exists has no address and no neighbours, and is pruned.

## Mnemonic

A **scaffold** (🪜) goes up before a single wall is filled in. You never plaster a surface that has no frame behind it — and you never memorize a detail that has no structure to hang from. *Frame first, fill second.*

## Checksum

- **Name-hook**: scaffold before the fill — skeleton, then flesh.
- **Essence**: for any multi-part material, encode the parts-and-relations structure before the contents of the parts.
- **Distinguisher**: vs [chunking](./chunking.md) — chunking *reduces the count of units at one level*; structure-first *orders the encoding across levels* (structure before content). vs a passive "read the overview first" — the load-bearing version is built, cheap-and-early, and used for contrast.
- **Failure**: premature content — rushing to details before the frame exists, leaving them address-less and prune-bound.

## Measurement ([METER](./meter-overview.md))

- `structure.frame_before_fill` — per encoding session, a binary gate: was the parts-and-relations frame laid before any content was encoded? A "no" is premature content, the CAST-Maturity-Level-4 anti-pattern.
- `structure.mode_routing` — given a new piece of material, name which of the four methods applies (text → zoom · systems → CAST · speech → SCREAM · space → ORIENT) in **<3 s**. A recognition floor; a miss means the parent principle isn't yet reflex.

## Related pages

- [zoom-in-zoom-out](./zoom-in-zoom-out.md) — the text/course instance (build the map, then zoom in)
- [CAST](./cast-overview.md) — top-level-graph-first encoding; the "meaning lives in edges" claim
- [SCREAM](./semantic-listening-system.md) — subject-buckets-first for live speech
- [ORIENT](./orient-method.md) — layout-pass-first for new environments
- [bedrock](./bedrock.md) — the address / contrast mechanism and the built-not-handed correction
- compression-for-comprehension-framework — the structure/content split; "topology is sacred"
- [NEDF](./nedf-overview.md) — the Distinguisher slot structure makes fillable
- [chunking](./chunking.md) — reduces the unit count at each level structure-first exposes
