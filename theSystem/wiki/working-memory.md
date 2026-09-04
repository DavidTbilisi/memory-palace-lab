---
palace: core-memory
level: 8
domain: 10
room: 10
semantic_mode: 5
wiki_source: wiki/learning-systems/working-memory.md
---

# Working Memory — Capacity, Decay, and Cognitive Load

**Summary**: Working memory is the small, fast, decay-prone workspace that holds and manipulates information during a task — the substrate the wiki silently assumes whenever it says "hold this in mind." It is capacity-limited (Miller's "magical number seven, plus or minus two"; Cowan's tighter ~4 chunks), time-limited (decays in seconds without rehearsal), and the bottleneck that [chunking](./chunking.md) and the [memory-palace](./memory-palace.md) exist to defeat. It is the *upstream* gate of the [memory-systems](./memory-systems.md) pipeline: nothing reaches [long-term-memory](./long-term-memory.md) without first surviving here.

**Sources**:
- George A. Miller, "The Magical Number Seven, Plus or Minus Two" (*Psychological Review*, 1956) — the capacity claim.
- Alan Baddeley & Graham Hitch, working-memory model (1974); Baddeley's central-executive / phonological-loop / visuospatial-sketchpad / episodic-buffer components.
- Nelson Cowan, "The magical number 4 in short-term memory" (*Behavioral and Brain Sciences*, 2001) — the chunk-limited revision.
- John Sweller, Cognitive Load Theory (1988) — instructional implications.
- [memory-systems](./memory-systems.md) — the hub this page anchors.

**Last updated**: 2026-06-05

---

## Why this page exists

The wiki is full of techniques that *manage* working memory — [chunking](./chunking.md) groups items so more fit; the [memory-palace](./memory-palace.md) offloads the load onto spatial locations; the encoder spine ([NEDF](./nedf-overview.md), [CAST](./cast-overview.md)) compresses a wide concept into a single retrievable image. All of them are answers to the same constraint, and that constraint never had its own page. This is it.

Working memory is the **bottleneck before storage**. The pipeline in [memory-systems](./memory-systems.md) is *attention → working memory → consolidation → [long-term store](./long-term-memory.md) → retrieval*. Everything the wiki does to "encode" is really a maneuver to get past the narrow second stage.

## The two capacity claims (and why both matter)

| Claim | Source | Number | What it counts |
|---|---|---|---|
| Magical number 7 | Miller 1956 | 7 ± 2 | *items* (digits, words) when rehearsal is allowed |
| Magical number 4 | Cowan 2001 | ~4 | *chunks* when rehearsal is blocked / pure capacity |

The reconciliation: Miller's 7 includes covert rehearsal and pre-existing chunking; Cowan's 4 is the floor when you strip those away. The practical lesson is the same either way — **the slot count is tiny and fixed; the only lever you control is how much each slot holds.** That lever is [chunking](./chunking.md). A chunk of "1-4-9-2" is four slots; the chunk "1492 (Columbus)" is one. The slot count didn't change; the payload per slot did.

## Baddeley's components (the structure inside the workspace)

Working memory is not one undifferentiated buffer. Baddeley & Hitch (1974) split it into:

- **Central executive** — attention controller; allocates the limited resource, switches tasks. This is the thing that thrashes under [ANT](./ants-and-lies-of-learning.md) intrusion or divided attention.
- **Phonological loop** — verbal/acoustic rehearsal ("inner voice"); decays in ~2 seconds without refresh.
- **Visuospatial sketchpad** — the "inner eye"; the substrate the [memory-palace](./memory-palace.md) and visual encoders ([remaps](./remaps.md), [clamp-render-lens](./clamp-render-lens.md)) actually run on.
- **Episodic buffer** (added 2000) — binds multimodal information into a coherent scene; the integration point where a [CAST](./cast-overview.md) graph or a palace locus becomes one held unit.

This is why the wiki encodes *visually and spatially* rather than verbally: the phonological loop is the narrowest, fastest-decaying channel, while the visuospatial sketchpad + episodic buffer can hold a rich bound scene as a single chunk.

## Cognitive load (the failure mode)

Sweller's Cognitive Load Theory names what happens when you exceed the slots: **overload**, and learning stalls. Three load types:

- **Intrinsic** — irreducible difficulty of the material itself.
- **Extraneous** — load added by poor presentation (bad notation, split attention). This is the load the wiki's visual-encoding doctrine and [show-vs-say](./show-vs-say.md) exist to cut.
- **Germane** — productive load spent building schemas in [long-term storage](./long-term-memory.md).

The design goal: minimize extraneous, respect intrinsic, maximize germane. The [memory-palace](./memory-palace.md) and chunking are extraneous-load reducers; [desirable-difficulties](./desirable-difficulties.md) deliberately tune germane load up.

## The doorway effect (event-boundary flushing)

Working memory is flushed at **event boundaries** — and crossing a doorway is one. Walking from one room to another (even an *imagined* or on-screen doorway) triggers a "location update" that clears the contents you were holding, which is why you arrive in the kitchen and forget why you came (Lawrence & Peterson 2014; Pettijohn & Radvansky 2018). (surfaced by: The Mnemonics Mind And Memory Improvement For Adults 2020.epub)

This has a two-sided lesson for the wiki's own methods:

- **For the [memory-palace](./memory-palace.md)**, boundaries are a *feature* — location changes are exactly the distinct retrieval cues loci exploit. Stable, long-term-stored content survives the crossing because it lives in [long-term-memory](./long-term-memory.md), not the workspace.
- **For volatile working-memory content**, a doorway is a *hazard*: do not cross a room boundary (physical or app-window) mid-encode while a fragile chunk is still only in the phonological loop. Finish the chunk, or externalize it, before the boundary. This is a concrete instance of the extraneous-load rule above — the boundary adds load that has nothing to do with the material.

## METER hooks

- `wm.overload_detected` — self-reported "I lost the thread" during a drill; signals the chunk size was too large or extraneous load too high.
- `wm.chunk_compression_ratio` — items-per-slot achieved after encoding vs raw count.
- `wm.boundary_flush` — content dropped after a room/window change mid-task; a doorway-effect hit rather than a capacity failure.

## Related pages

- [memory-systems](./memory-systems.md) — the hub; working memory is its second pipeline stage
- [long-term-memory](./long-term-memory.md) — the downstream store working memory feeds
- [chunking](./chunking.md) — the primary lever for beating the slot limit
- [memory-palace](./memory-palace.md) — spatial offload of working-memory load
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — central-executive thrash under intrusive thoughts
- [desirable-difficulties](./desirable-difficulties.md) — tuning germane load upward on purpose
