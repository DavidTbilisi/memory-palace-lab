---
palace: meta-knowledge
level: 4
domain: 10
room: 1
semantic_mode: 5
wiki_source: wiki/problem-solving/orient-method.md
---

# ORIENT Method

**Summary**: ORIENT is a six-slot capture protocol for unfamiliar live environments — Objects, Roles, Indexes, Edges, Norms, Threads — that produces a working action map and routes its findings into [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), and [HEART](./heart-overview.md).

**Sources**:
- raw/Neural OS Book/New Environments.md
- raw/Neural OS Book/manuscript.md (§ The ORIENT Method)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [bridge-load](./bridge-load.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)

**Last updated**: 2026-05-05

---

## Purpose

ORIENT is not a standalone encoding framework. Its job is to convert a *live, partially known, time-pressured* environment (new workplace, city, software system, social group) into structured material that the main encoding frameworks can absorb. (source: New Environments.md)

It belongs in the **capture / scoping layer** alongside [RAPID](./rapid-in-neural-os.md) (control loop), [BRIDGE LOAD](./bridge-load.md) (analogy gate), and [semantic input](./semantic-input-cheat-sheet.md) (reading and listening). It runs *before* NEDF/CAST/SPEAR/HEART, not in competition with them.

Compressed pipeline:

- enter unfamiliar environment
- run ORIENT to extract a working map
- route each slot's output to the correct downstream framework
- encode for retention only what the action map demands

## The Six Slots

(source: New Environments.md § The ORIENT Method)

- **O — Objects**: the important things — tools, rooms, systems, documents, devices
- **R — Roles**: people, teams, authority figures, helpers, blockers
- **I — Indexes**: stable reference points — entrances, dashboards, menus, landmarks, schedules
- **E — Edges**: boundaries, constraints, permissions, forbidden zones
- **N — Norms**: explicit rules and implicit expectations
- **T — Threads**: dependencies, causal chains, delays, who needs whom

The fastest useful output of ORIENT is not a perfect description. It is a compressed action map: categories, importance, order, relations.

## Disambiguation: ORIENT.E vs CAST edges

ORIENT and [CAST](./cast-overview.md) both use the word *edge*, with different meanings. Keep them separate:

| Term | Framework | Meaning |
|---|---|---|
| **ORIENT.E (Edges)** | ORIENT capture | Boundaries, constraints, permissions, forbidden zones — *what you cannot do or cross* |
| **CAST edges** | CAST encoding | Graph relations between nodes — *how things connect* |

When ORIENT.E is later encoded into CAST, an ORIENT *edge* typically becomes either a **CAST edge attribute** ("requires badge") or a **CAST node property** ("restricted zone"), not a CAST edge itself. Threads (ORIENT.T) are what usually become CAST edges.

## Handoff Table

Each ORIENT slot has a natural downstream destination. Capture in ORIENT, then encode where it belongs.

| ORIENT slot | Captures | Hands off to | Why |
|---|---|---|---|
| **O** Objects | Important things in the environment | [NEDF](./nedf-overview.md) (per object) | Each object is a "What is this?" question |
| **R** Roles | People with authority, help, blocking power | [HEART](./heart-overview.md) (per person) | Each person needs recognition, pattern, treatment |
| **I** Indexes | Stable landmarks and reference points | [Memory Palace](./memory-palace-architecture-for-neural-os.md) anchors / [CAST](./cast-overview.md) nodes | Indexes become palace loci |
| **E** Edges | Constraints, permissions, forbidden zones | CAST node attributes / [SPEAR](./spear-overview.md) preconditions | Constraints gate procedures and qualify nodes |
| **N** Norms | Official and unofficial rules | SPEAR preconditions / CAST edge attributes | Rules govern what action is valid when |
| **T** Threads | Dependencies, delays, causal chains | [CAST](./cast-overview.md) edges + [delay-encoding-in-cast](./delay-encoding-in-cast.md) | Threads are the actual graph — relations and timing |

## Three-Pass Build Order

Do not try to absorb the full environment at once. Use the layered pass from New Environments.md:

1. **Layout pass** — where are things? what are the stable landmarks? (covers I, partial O)
2. **People pass** — who are the important actors? what are their roles? (covers R)
3. **System pass** — what are the rules, constraints, flows, dependencies, and delays? (covers E, N, T)

This is [Zoom In / Zoom Out](./zoom-in-zoom-out.md) applied to orientation, and the layout-pass-first order is [structure-first](./structure-first.md) specialized to physical space — spatial structure before its contents. (source: New Environments.md)

## Output: minimal note format

A short capture template (source: New Environments.md):

- place / environment:
- mental markers (see [mental-markers-category-importance-order](./mental-markers-category-importance-order.md)):
- key people:
- key tools / objects:
- rules / constraints:
- relations / dependencies:
- delays / risks:
- next questions:

That already gives you a working model. Encode further only where retention or transfer demands it.

## UMTF coverage

ORIENT touches all seven [UMTF](./universal-mental-tagging-framework.md) dimensions:

| UMTF dimension | Where it shows up in ORIENT |
|---|---|
| Spatial | I (Indexes), three-pass layout |
| Sensory | O (Objects, observed surfaces) |
| State | E (constraints), N (rules in force) |
| Relation | R (authority lines), T (dependencies) |
| Pattern | N (norm patterns), repeated R behaviors |
| Temporal | T (delays, causal chains over time) |
| Priority | Mental markers (importance ranking) |

This is one reason ORIENT belongs in the capture layer rather than as a peer encoder: it scans every UMTF dimension before deciding *what* to encode and *with which* framework.

## Common failure modes

(source: New Environments.md § Common failure modes)

- **Details without structure** — fix by asking relation questions: what connects to what? what causes what? what happens later?
- **Official rules without real rules** — fix by comparing stated rules vs repeated behavior; notice what actually triggers approval, conflict, or delay
- **Overwhelm** — fix by shrinking the task to layout → people → system; chunk the environment into zones

## Practical rule

In a new environment, memory should serve orientation first, detail second. Do not ask: *how do I remember everything?* Ask: *what is the smallest map that will let me act competently here?* (source: New Environments.md § Practical rule)

## Architectural placement

ORIENT is a **capture protocol**, not an encoder. It pairs with:

- [RAPID](./rapid-in-neural-os.md) — the control loop above all encoding
- [BRIDGE LOAD](./bridge-load.md) — comprehension gate for analogy-bearing material
- [Semantic Input](./semantic-input-cheat-sheet.md) — capture from reading and listening
- [mental-markers-category-importance-order](./mental-markers-category-importance-order.md) — indexing sub-protocol used inside ORIENT and reusable elsewhere

Together these form the layer that feeds NEDF, CAST, SPEAR, and HEART with usable material.

## Related pages

- [mental-markers-category-importance-order](./mental-markers-category-importance-order.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [bridge-load](./bridge-load.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [NEDF](./nedf-overview.md)
- [CAST](./cast-overview.md)
- [SPEAR](./spear-overview.md)
- [HEART](./heart-overview.md)
- [chunking](./chunking.md)
- [semantic-input-cheat-sheet](./semantic-input-cheat-sheet.md)
- unfamiliar-codebase-protocol — named downstream instance of ORIENT applied to a software system (this page's own §Purpose already names "software system" as a target environment); Phase M runs the six-slot pass on a repository


---

## U — See (CAST)
1. 6-slot capture protocol: Objects, Roles, Indexes, Edges, Norms, Threads
2. For unfamiliar live environments

## D — Name (NEDF)
1. ORIENT = 6-slot live-environment capture
2. Distinguisher: produces action map + routes findings
3. Failure mode: capturing without routing

## F — Do (SPEAR)
1. Enter new environment → run 6 slots
2. Route findings to NEDF/CAST/SPEAR/HEART

## B — Watch (HEART)
1. Slot-skipping
2. Skipping the routing step

## L — Predict (ORACLE)
1. Environment type → predict slot weights
2. Slot output → predict downstream framework

## R — Act (GRACE)
1. New environment → run ORIENT
2. Findings collected → route immediately