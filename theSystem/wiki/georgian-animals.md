---
palace: core-memory
level: 8
domain: 10
room: 7
wiki_source: wiki/learning-systems/georgian-animals.md
---

# Georgian Animals: The Identity System

**Summary**: The 33 Georgian animals form the foundation of [CAST](./cast-overview.md) node encoding. Each letter gets a unique animal with an environment and adjective. Assignment follows in-degree ordering to ensure deterministic, repeatable encoding.

**Sources**: CAST and Georgian Node System.md (lines 78-119)

**Last updated**: 2026-09-04 (2026-04-30 ingest-ghost pass: dead `links` from that ingest's navigation skeleton repointed to the pages that actually own the content, or named as gaps); 2026-04-29

---

## Why Georgian Animals?

Each node needs a **distinctive, memorable identity** that carries meaning:
- **Animal** = what the node IS (identity)
- **Environment** = what group/layer it belongs to (cluster)
- **Adjective** = its current state or characteristic

Georgian letters provide a **universal, ordered system** that ensures:
- ✅ Deterministic assignment (always the same letter gets the same animal)
- ✅ Repeatability (others can encode the same graph identically)
- ✅ Cultural richness (each animal has vivid personality)

---

## The Complete Table (1-33)

Learn the **animal column first**. That is the identity. Add environment and adjective once animals are automatic.

| # | Letter | Animal | Environment | Adjective | Notes |
|---|--------|--------|-------------|-----------|-------|
| 1 | ა | Eagle | Mountain peak | Sharp | **Highest in-degree gets this** |
| 2 | ბ | Owl | Night forest | Watchful | Second-highest |
| 3 | გ | Pig | Farm mud | Hungry | |
| 4 | დ | Dinosaur | Swamp | Ancient | |
| 5 | ე | Raccoon | Alley | Crafty | |
| 6 | ვ | Whale | Deep ocean | Vast | |
| 7 | ზ | Zebra | Savanna | Striped | |
| 8 | თ | Tiger | Dense jungle | Fierce | |
| 9 | ი | Ibis | River delta | Elegant | |
| 10 | კ | Kangaroo | Red desert | Leaping | |
| 11 | ლ | Lion | Golden grassland | Proud | |
| 12 | მ | Mammoth | Frozen tundra | Massive | |
| 13 | ნ | Narwhal | Arctic ice | Spiraling | |
| 14 | ო | Octopus | Coral reef | Flexible | |
| 15 | პ | Panther | Rainforest | Silent | |
| 16 | ჟ | Jellyfish | Dark abyss | Glowing | |
| 17 | რ | Raven | Clifftop | Cunning | |
| 18 | ს | Snake | Sand dunes | Patient | |
| 19 | ტ | Tortoise | Rocky coast | Steady | |
| 20 | უ | Unicorn | Misty meadow | Rare | |
| 21 | ფ | Falcon | Windswept cliff | Swift | |
| 22 | ქ | Quetzal | Cloud forest | Colorful | |
| 23 | ღ | Gorilla | Mountain jungle | Powerful | |
| 24 | ყ | Yak | High plateau | Rugged | |
| 25 | შ | Shark | Open sea | Cutting | |
| 26 | ჩ | Cheetah | Flat plains | Blazing | |
| 27 | ც | Crane | Wetland | Graceful | |
| 28 | ძ | Dodo | Volcanic island | Stubborn | |
| 29 | წ | Wasp | Garden hedge | Precise | |
| 30 | ჭ | Crocodile | Muddy riverbank | Prehistoric | |
| 31 | ხ | Hyena | Dry savanna | Ravenous | |
| 32 | ჯ | Jaguar | Dark rainforest | Spotted | |
| 33 | ჰ | Horse | Open field | Free | |

---

## How to Assign Letters

### Step 1: Calculate In-Degree

For each node in your graph, count **how many other nodes point to it** (how many incoming edges).

Example: API Gateway has 1 incoming edge (from Client) → in-degree = 1

### Step 2: Sort by In-Degree Descending

List all nodes highest in-degree first:

| Node | In-degree | Gets |
|---|---|---|
| A | 5 | ა (Eagle) |
| B | 3 | ბ (Owl) |
| C | 2 | გ (Pig) |
| D | 1 | დ (Dinosaur) |
| E | 0 | ე (Raccoon) |

### Step 3: Break Ties (if two nodes have same in-degree)

If nodes A and B both have in-degree 3, assign letters by the order they appear when reading the graph **top-to-bottom, left-to-right**.

### Step 4: Never Reassign

Once a node gets a letter, it **never changes**. Stability is the point. Even if the graph evolves and a node's in-degree changes, keep the original letter.

---

## Building a Node Scene

Each node becomes a vivid scene with four slots:

| Slot | What it answers | Example |
|------|-----------------|---------|
| Animal | What node is this? | Eagle |
| Environment | What group does it belong to? | Mountain peak (top-level hub) |
| Adjective | What is its current state? | Sharp (tense, critical) |
| Modifier | Which specific instance? | Wearing a crown (primary), caged (disabled), glowing (hot path) |

**Example scene**: *A sharp eagle on a mountain peak* (Standard: Eagle at ა, environment = mountain, adjective = sharp, no modifier yet)

**With modifier**: *A sharp eagle on a mountain peak, perched on a door handle* (Modifier = door = 4 outgoing edges in the [Peg System](./peg-system.md))

---

## Modifiers (Optional)

Only add a modifier when **two nodes would produce the same letter** (collision).

| Modifier | Meaning |
|----------|---------|
| Wearing a crown | Primary / main instance |
| Chained / caged | Disabled / deprecated |
| Glowing / on fire | Hot path / critical |
| Tiny (miniature) | Secondary / clone |
| Holding a flag | Public / exported |
| Underground / buried | Hidden / private |
| Wearing armor | Hardened / protected |

**Rule**: One modifier per collision pair. If a third node collides, reassign a letter instead—do not stack modifiers.

---

## Fluency Goal

The animals should become **automatic**. When you see the letter ბ, you should instantly visualize an *owl in a night forest*—no translation step, no searching.

This is the same standard as language fluency. Fluent speakers don't "recall" words; the word IS the meaning.

**Practice**: 
- Learn animals 1-10 first (until instant recall)
- Then 11-20
- Then 21-33
- Then mixed random order
- Then backward from 33 to 1

Aim for under 1 second per animal recall.

---

## Why In-Degree Ordering?

**High in-degree nodes are hubs**—everything else depends on them. Encoding them first ensures:

1. **Stability**: if the hub is wrong, everything downstream cascades
2. **Verification**: you can walk the graph starting from the hub and check nothing is missing
3. **Prioritization**: if you run out of time, you've encoded the most important nodes
4. **Recognition**: you always start from the same place (the eagle, highest in-degree)

[Step 0 analysis](./step-zero-analysis.md) includes in-degree sorting as the first step.

---

## Cultural & Mnemonic Richness

Each animal-environment pair is chosen for:
- **Distinctiveness**: Eagle looks nothing like Pig; you can't confuse them
- **Vividness**: "Sharp eagle on a mountain peak" is more memorable than "important node at top level"
- **Cultural depth**: Georgian alphabet has history; the animals carry meaning
- **Emotional resonance**: you feel more when encoding a fierce Tiger than a generic "Node 8"

---

## Related Pages

- [Nodes & Edges](./nodes-and-edges.md) — how animals become part of the two-layer model
- Node Encoding — detailed four-slot system
- [Example: City Streets](./cast-example-city-streets.md) — see animals in a real graph
- [Step 0 Analysis](./step-zero-analysis.md) — in-degree calculation
- [Peg System](./peg-system.md) — modifiers using peg numbers


---

## U — See (CAST)
1. 33 Georgian animals — foundation of CAST node encoding
2. Each letter gets unique animal with environment + adjective

## D — Name (NEDF)
1. Georgian animals = CAST node alphabet
2. Distinguisher: in-degree ordering for deterministic assignment
3. Failure mode: re-inventing animal mapping per graph

## F — Do (SPEAR)
1. Pick node in CAST graph → assign Georgian animal
2. Follow in-degree ordering

## B — Watch (HEART)
1. Animal drift per graph
2. Skipping the ordering rule

## L — Predict (ORACLE)
1. Letter → predict animal
2. Graph → predict animal mix

## R — Act (GRACE)
1. CAST graph node → assign animal
2. Conflict → consult ordering rule