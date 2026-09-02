---
palace: meta-knowledge
level: 6
domain: 10
room: 1
semantic_mode: 5
wiki_source: wiki/learning-systems/memory-palace.md
---

# Memory Palace

**Summary**: Canonical owner page for the *memory palace* concept (Method of Loci) as used across this wiki — placement rules, palace structure, and the registry of named palace instances and architectural variants.

**Sources**:
- [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) (architecture)
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) (constraint variant)
- [mental-markers-category-importance-order](./mental-markers-category-importance-order.md) (indexing sub-protocol)
- [representation-rules](./representation-rules.md) (encoding constraints applied at loci)
- [remaps](./remaps.md) (transformation moves that make loci-bound images retrievable)
- raw/Index - Neural OS.md
- raw/templates/FRAMEWORK_OVERVIEW.md

**Last updated**: 2026-05-20

> **Note**: This page does not yet carry a `palace / level / domain / room` cube address. It was promoted from a ghost reference and needs slot assignment in the next NeuralOS-3D tagging pass; the `meta-knowledge × domain-10` triple is full from levels 3 through 8, so a slot at level 2 (room 6 is the first free one) or a new level is the likely destination.

---

## What this page is

A **memory palace** is a learned spatial structure used as the storage layer for encoded content. Material encoded by [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), or [GRACE](./grace-overview.md) is *placed at loci* inside a palace so that retrieval becomes a walk rather than a search.

In the Neural OS framework, the palace is **Phase 3: Store** in the standard encode → store → retrieve pipeline (source: raw/templates/FRAMEWORK_OVERVIEW.md). It is orthogonal to the encoders — the encoder decides what shape an item takes; the palace decides where it lives.

This page covers (a) the placement rules every palace shares and (b) the palette of structural patterns used in this wiki's concrete palace instances.

## Placement rules

The placement rules are the contract a palace must satisfy so that the encoded items inside it stay retrievable.

1. **One item per locus**, by default. A locus that holds two distinct concepts blurs both on recall. If two items must share a locus, [remaps](./remaps.md) Modify-Merge-Move is the licensed way to fuse them into one image. Ordinary loci carry *order*, not classification; when a whole class of items needs marking, [МегаЛоция](./vocabulary-word-type-routing.md) is the sibling device that re-skins the environment itself to carry class membership, composing with (not replacing) the walk order below.
2. **Loci are pre-learned**, not invented at encoding time. The palace skeleton — rooms, sequences, adjacencies — must already be over-learned before content is placed. Otherwise the search cost during recall exceeds the storage benefit.
3. **A fixed walk order**. Loci are visited in a deterministic sequence. If the order is ambiguous, retrieval becomes unordered and the palace degrades into a tag cloud.
4. **Index the loci** with [category · importance · order](./mental-markers-category-importance-order.md) when the palace gets dense, so each locus carries its own retrieval handle rather than relying on the walk alone.
5. **Encoding lives inside the encoder, not the palace**. Don't redefine NEDF/CAST/SPEAR inside a palace page; the palace stores the encoder's output, it does not replace the encoder.
6. **Apply [REMAPS](./remaps.md) at placement**, not at recall. Rotate · Exaggerate · Modify-Merge-Move · Associate · Play-Palace-Path · Sensations are the transformation moves that make a locus-bound image robust; they are part of *placing*, not *retrieving*.

## Palace structure — the structural patterns in use

The wiki contains several concrete palace instances. Each picks one of a small set of structural patterns:

| Pattern | What it is | Example pages |
|---|---|---|
| **Building-route palace** | Real-world building walked in fixed sequence; rooms = loci. The classical Method-of-Loci form. | [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) (districts mapped to Neural OS folder layers) |
| **Domain-grid palace** | Regular grid (e.g. 3×3, 5×5) with cells as loci. Geometry-first; no narrative walk required. | [rubiks-cube-palace](./rubiks-cube-palace.md) (6 faces × 9 cells), [trigonometry-compass-palace](./trigonometry-compass-palace.md) (9-point compass) |
| **City-district palace** | Multiple districts, each a sub-palace, federated under one map. | aws-city-palace |
| **Body-palace** | Body parts as loci. Works for short sequences and under [aphantasia constraints](./memory-palace-for-aphantasia.md) where external palaces are unavailable. | [tier3-motoric-backlog](./tier3-motoric-backlog.md) |
| **Domain-content palace** | Palace whose loci are *named anchors from the domain itself* (books, scenes, equations) rather than generic rooms. | bible-canonical-palace, exodus-book-palace, genesis-book-palace, abraham-heart-room |
| **Calendar / curriculum palace** | Time-ordered loci — weeks, lectures, days — as the walk skeleton. | university-semester-palace |
| **Domain-specific instance** | Palace built around a specific learning target. | x86-memory-palace |
| **Diagnostic / training palace** | Not for storage; for *classifying* palace instances or training the underlying skill. | [palace-classification-gym](./palace-classification-gym.md), [palace-classification-drill-ladder](./palace-classification-drill-ladder.md), [vivid-palace-fast-experiment](./vivid-palace-fast-experiment.md) |

The same content can be stored in more than one palace — that is the point of the [UMTF](./universal-mental-tagging-framework.md) tag spine, which lets a single tagged item be indexed across multiple palaces without re-encoding.

## Relationship to the encoders

| Encoder | What it places into a palace | Owner |
|---|---|---|
| [NEDF](./nedf-overview.md) | One vivid four-slot scene per concept | [nedf-overview](./nedf-overview.md) |
| [CAST](./cast-overview.md) | Animal-nodes + verb-edges; palace is the substrate where the graph is laid out | [cast-overview](./cast-overview.md) |
| [SPEAR](./spear-overview.md) | One runnable five-slot scene per procedure | [spear-overview](./spear-overview.md) |
| [HEART](./heart-overview.md) | One room per person; the palace gives every HEART card a fixed address | [heart-overview](./heart-overview.md) |
| [ORACLE](./oracle-overview.md) | Predictions in time-ordered loci | [oracle-overview](./oracle-overview.md) |
| [GRACE](./grace-overview.md) | Social-pragmatic scenes anchored to social-context loci | [grace-overview](./grace-overview.md) |

[REMAPS](./remaps.md) sits *underneath* this table — it operates on whatever the encoder produced, regardless of which palace receives it.

## When *not* to use a palace

- Items already automatic via [red-queen-skill-gym](./red-queen-skill-gym.md) reflex training don't need a locus.
- Short ad-hoc lists (≤7 items, decaying within the day) can ride [motoric encoding](./tier3-motoric-backlog.md) without ever entering a palace.
- Under the [aphantasia constraint](./memory-palace-for-aphantasia.md) some imagery-heavy palace types degrade; that page replaces the default placement rules with constraint-aware variants.
- When the underlying skill demand is *recognition under pressure* rather than *recall*, route through [red-queen-skill-gym](./red-queen-skill-gym.md) instead of building palace depth.

## Related pages

- [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) — two-axis layer × encoder palace architecture
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) — constraint-aware operating layer
- [mental-markers-category-importance-order](./mental-markers-category-importance-order.md) — indexing sub-protocol applied inside palaces
- [remaps](./remaps.md) — transformation moves at placement time
- [representation-rules](./representation-rules.md) — encoding constraints that hold inside loci
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) — cross-palace tag spine
- [lifecycle-manager](./lifecycle-manager.md) — retirement and consolidation of palace content
- [observer-inside-method](./observer-inside-method.md) — the egocentric/interior frame as a *spatial-reasoning* method: the palace's reasoning twin (you stand inside, faces/loci around you)
- [memory-atomic-design](./memory-atomic-design.md) — Memory Palace is one of the lens's flagship *molecules* (atoms WLK + IDX + LOC + MARK); Memory Palace layout is the *template* it realizes; every worked palace page (AWS, Bible-canonical, Exodus, …) is a *page* instance
- **2026-05-29 learning-canon cross-links**: [foer-moonwalking-with-einstein](./foer-moonwalking-with-einstein.md) (primary popular consolidation; the Foer-championship narrative) · [buzan-your-memory](./buzan-your-memory.md) (Buzan's Roman Room System variant) · [person-action-object-system](./person-action-object-system.md) (championship-tier composition) · [serial-position-curve](./serial-position-curve.md) (loci selection: distinctive loci are more memorable, Von Restorff principle)
- **2026-07-10 Kozarenko GMS cross-links**: [spatial-coding](./spatial-coding.md) (an encoder primitive that adds a positional channel — quadrant, reading order, triangle geometry — on top of loci already placed; stores nothing on its own) · [four-level-blocks](./four-level-blocks.md) (a second self-generating addressable-loci store, built by Matryoshka-nesting empty stickers rather than walking a route; sibling of [table-of-support-images](./table-of-support-images.md))
- **2026-07-16 Yagodkin/Advance cross-link**: [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) (owner of МегаЛоция — a whole-environment re-skin per class, carrying *classification* where ordinary loci carry *order*; the two axes compose)
