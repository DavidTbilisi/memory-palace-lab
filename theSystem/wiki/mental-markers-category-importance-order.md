---
palace: meta-knowledge
level: 4
domain: 10
room: 2
wiki_source: wiki/logic/mental-markers-category-importance-order.md
---

# Mental Markers: Category → Importance → Order

**Summary**: A general-purpose indexing sub-protocol that turns raw locations, items, or nodes into an indexed action map by tagging each one with a category, an importance level, and a position in action sequence. First introduced inside [ORIENT](./orient-method.md) but reusable across [palaces](./memory-palace-architecture-for-neural-os.md), [CAST](./cast-overview.md) graphs, and any spatial or relational structure.

**Sources**:
- raw/Neural OS Book/New Environments.md (§ Mental Markers)
- [orient-method](./orient-method.md)
- [chunking](./chunking.md)
- [UMTF](./universal-mental-tagging-framework.md)

**Last updated**: 2026-05-05

---

## Purpose

A place, node, or object is rarely useful as a bare label. To act inside a structure you need three things at once:

1. what kind of thing it is (**category**)
2. how much it matters (**importance**)
3. when it matters in the flow of action (**order**)

Mental markers provide that triple. They are internal tags, not physical signs. They turn a layout, a graph, or a route into a *script you can execute*. (source: New Environments.md § Mental Markers)

This is [chunking](./chunking.md) + Order applied to space, people, or systems.

## The three layers

### 1. Category

Use a small, stable set of categories. Reuse them across environments rather than inventing new ones each time. (source: New Environments.md)

A workable default set:

- entrance / exit
- help / information
- authority / approval
- danger / risk
- resource / supply
- waiting / queue
- transition / connector
- restricted / forbidden

The point is *reuse*, not creativity. A small fixed taxonomy lets you see the same shapes in unrelated environments.

**Class-level counterpart**: this page's Category layer tags each item *individually*. [МегаЛоция](./vocabulary-word-type-routing.md) (from the Advance/Yagodkin lineage) is a class-level alternative — instead of attaching a category tag to every item, it re-skins the whole environment in a class-specific genre, so class membership is read off the scene at zero extra per-item cost. The two are the same job (mark which class a thing belongs to) at different granularities.

### 2. Importance

Not every marked place deserves the same weight. Ask:

- is this central or peripheral?
- do I need it often or rarely?
- does missing it create friction or failure?

Use a 3-level scale:

- **high** — must know immediately
- **medium** — should know soon
- **low** — useful later, not urgent

### 3. Order

Place each marker into action sequence:

- first stop
- second stop
- fallback stop
- final destination
- emergency alternative

Order is what turns a map into behavior. A place is not only "important." It also has a position.

## Worked example (building entry)

(source: New Environments.md)

| Place | Category | Importance | Order |
|---|---|---|---|
| Entrance | transition point | high | first |
| Reception desk | help point | high | second |
| Manager office | authority point | medium | only on escalation |
| Back stairwell | alternative exit | high | emergency only |

Now the place is no longer a label. It is a position in a script.

## Behavior tags for graphs

When the structure is a graph rather than a route (see hierarchical-graphs), mental markers extend naturally. Each node carries a *navigation role*: (source: New Environments.md)

- default path
- alternative path
- emergency path
- blocked path
- authority path

This is the difference between *knowing* a place and being able to *act* inside it.

## UMTF mapping

| Layer | Dominant UMTF dimension |
|---|---|
| Category | Pattern (reused taxonomy) |
| Importance | Priority |
| Order | Temporal + Spatial |

Mental markers are essentially a pre-packaged Priority + Pattern + Temporal stack from [UMTF](./universal-mental-tagging-framework.md), applied at index time.

## Where to use it

- inside [ORIENT](./orient-method.md) when capturing a new environment (its original home)
- inside any [palace](./memory-palace-architecture-for-neural-os.md) when loci start to feel undifferentiated
- inside any [CAST](./cast-overview.md) graph when nodes blur together — tag each node with category + importance + order in a typical traversal
- inside [SPEAR](./spear-overview.md) when alternatives and repair branches need ranking
- in any system with multiple paths, fallbacks, or escalation rules

## Why split it from ORIENT

The marker triple is independent of the "new environment" use case. It applies to any indexed structure where actors must navigate and act. Keeping it as its own page lets [CAST](./cast-overview.md), [Memory Palace](./memory-palace-architecture-for-neural-os.md), and other pages reference it without dragging in ORIENT-specific framing.

## Related pages

- [orient-method](./orient-method.md)
- [chunking](./chunking.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [CAST](./cast-overview.md)
- hierarchical-graphs
- [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) — owner of МегаЛоция, the class-level (environment-re-skin) counterpart to this page's per-item Category tag


---

## U — See (CAST)
1. Indexing sub-protocol: category + importance + order
2. Turns raw items into action map

## D — Name (NEDF)
1. Mental markers (Category-Importance-Order) = indexing sub-protocol
2. Distinguisher: reusable across palaces and CAST graphs
3. Failure mode: skipping importance level

## F — Do (SPEAR)
1. Raw item set → tag each with C-I-O
2. Sort by importance + order

## B — Watch (HEART)
1. Importance inflation
2. Order drift

## L — Predict (ORACLE)
1. Category mix → predict ordering need
2. Importance distribution → predict action map

## R — Act (GRACE)
1. New item set → apply C-I-O
2. Confusion → re-tag