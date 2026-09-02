---
palace: core-memory
level: 8
domain: 10
room: 10
semantic_mode: 5
wiki_source: wiki/learning-systems/memory-systems.md
---

# Memory Systems — The Architecture of Human Memory

**Summary**: The root hub for the wiki's entire memory layer — the page every memory spoke points back at. It names the standard architecture of human memory (the *stages* a memory passes through and the *stores* it lives in) and routes each existing wiki page to its place in that architecture. This is a **map, not a redefinition**: working-memory capacity is owned by [working-memory](./working-memory.md), the durable store by [long-term-memory](./long-term-memory.md), the spacing effect by [spaced-repetition](./spaced-repetition.md), and so on. This page exists so a learner reading any single memory page can first answer "*which part of the machine is this?*"

**Sources**:
- Richard Atkinson & Richard Shiffrin, multi-store model (1968) — sensory → short-term → long-term stages.
- Endel Tulving (1972); Larry Squire (1992) — the long-term taxonomy.
- Lisa Genova, *Remember* (2021), Ch 1 — the encoding/consolidation/storage/retrieval process framing (glossary-registered to this page).
- [working-memory](./working-memory.md) · [long-term-memory](./long-term-memory.md) — the two anchor sub-pages.

**Last updated**: 2026-06-05

---

## Why this page exists

The wiki grew dozens of *leaf* pages about specific memory phenomena — [active-recall](./active-recall.md), [spaced-repetition](./spaced-repetition.md), [memory-reconsolidation](./memory-reconsolidation.md), [prospective-memory](./prospective-memory.md), [tip-of-the-tongue](./tip-of-the-tongue.md), [chunking](./chunking.md), the whole [memory-palace](./memory-palace.md) cluster, the six encoders — but never the page that says *how human memory is organized* so those leaves have a trunk. Thirteen pages link to `[memory-systems](./memory-systems.md)`; until now it was a ghost. This is the trunk.

Two complementary frames organize the layer. **Structure** asks *where does the information sit* (which store); **process** asks *what is happening to it* (which operation). Both are below.

## Frame 1 — Structure (the stores)

Information flows through three stores of increasing durability and capacity:

| Store | Capacity | Duration | Owner page |
|---|---|---|---|
| **Sensory register** | very high | < 1 second | (substrate; not yet owned) |
| **Working memory** | ~4–7 chunks | seconds | [working-memory](./working-memory.md) |
| **Long-term memory** | effectively unlimited | up to lifetime | [long-term-memory](./long-term-memory.md) |

The narrow middle store — [working-memory](./working-memory.md) — is the bottleneck the entire wiki maneuvers around. The branching taxonomy of the durable store (declarative/episodic/semantic vs non-declarative/procedural) lives in [long-term-memory](./long-term-memory.md) and decides which encoder applies to a given target.

## Frame 2 — Process (the operations)

The wiki commits to the **four-stage Genova pipeline** (encoding → consolidation → storage → retrieval). Consolidation is kept as a first-class stage rather than folded into storage, because the wiki treats it as load-bearing (it is where [sleep](./sleep-dependent-memory-consolidation.md) and [BDNF](./bdnf-and-neurogenesis.md) do their work). Each stage names the wiki page/operation that owns it:

1. **Encode** — capture incoming information into a memory trace; the moment of attention-plus-transformation that decides whether anything is laid down at all. *Owned by* the encoder spine ([NEDF](./nedf-overview.md) · [CAST](./cast-overview.md) · [SPEAR](./spear-overview.md)) and the load-beating methods ([memory-palace](./memory-palace.md) · [chunking](./chunking.md)). The precondition beneath this stage — that nothing is encoded unless it was genuinely attended to in the first place — is owned by [memory-is-residue-of-thought](./memory-is-residue-of-thought.md); debugging a failed encode should check that precondition before blaming the encoder.
2. **Consolidate** — stabilize the fragile fresh trace into a durable one over hours-to-years; the write that actually commits, largely during sleep. *Owned by* [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md) (process) and [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) (biological substrate).
3. **Store** — hold the consolidated trace in the durable, high-capacity, branching long-term store. *Owned by* [long-term-memory](./long-term-memory.md) (and [memory-reconsolidation](./memory-reconsolidation.md), which governs how a re-opened store is re-stored).
4. **Retrieve** — reconstruct the trace on demand; the strongest write of all, since pulling a memory out strengthens it. *Owned by* [active-recall](./active-recall.md) · retrieval-practice · [spaced-repetition](./spaced-repetition.md) (and the failure case [tip-of-the-tongue](./tip-of-the-tongue.md)).

The pipeline is the wiki's master ordering: a target is not "learned" until it has passed all four stages at least once at a scheduled interval (see the `memory.pipeline_complete` METER event below).

## Spoke registry — which page lives where

Every memory page in the wiki, routed to its stage/store. Read a memory page → find its row → know what kind of thing it is.

| Wiki page | Stage / store it belongs to |
|---|---|
| [nedf-overview](./nedf-overview.md) · [cast-overview](./cast-overview.md) · [spear-overview](./spear-overview.md) · [remaps](./remaps.md) | Encode (into long-term) |
| [memory-palace](./memory-palace.md) · [chunking](./chunking.md) | Encode — beating the [working-memory](./working-memory.md) bottleneck |
| [memory-is-residue-of-thought](./memory-is-residue-of-thought.md) | Encode — the attention precondition beneath the stage |
| [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md) · [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) | Consolidate |
| [long-term-memory](./long-term-memory.md) · [memory-reconsolidation](./memory-reconsolidation.md) | Store (and re-store) |
| [active-recall](./active-recall.md) · retrieval-practice · [spaced-repetition](./spaced-repetition.md) · [tip-of-the-tongue](./tip-of-the-tongue.md) | Retrieve |
| [prospective-memory](./prospective-memory.md) | Retrieve — future-intention variant |
| [memory-paradox](./memory-paradox.md) · mild-cognitive-impairment | Calibration / whole-system stance |

## METER hooks

- `memory.stage_identified` — on opening any memory drill, can the learner name which stage it trains? (the discipline this hub enforces)
- `memory.pipeline_complete` — a target that has passed encode → consolidate → store → retrieve at least once at a scheduled interval.

## Related pages

- [working-memory](./working-memory.md) — the capacity-limited middle store
- [long-term-memory](./long-term-memory.md) — the durable store and its taxonomy
- [memory-atomic-design](./memory-atomic-design.md) — the *tier* lens (atom/molecule/organism) over the same kit; this page is the *stage* lens
- [memory-palace](./memory-palace.md) — the wiki's flagship encoding method
- [spaced-repetition](./spaced-repetition.md) · [active-recall](./active-recall.md) — the two highest-utility retrieval strategies
- [memory-paradox](./memory-paradox.md) — the take-seriously / hold-lightly calibration stance over the whole system
- [memory-is-residue-of-thought](./memory-is-residue-of-thought.md) — the attention precondition upstream of the Encode stage; a failed encode is usually a failure here, not in the encoder
