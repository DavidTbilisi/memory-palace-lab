# CAST + Georgian Node System — Full Relational Encoding

**Relational knowledge is most of what learning is.** Codebases are graphs.
Math is dependency graphs. History is causal graphs. Arguments are graphs.
This system encodes graphs — nodes and edges — into vivid scenes.

CAST is now a **first-class system**, not an appendix. For any concept that
names a relationship, dependency, flow, or interaction, reach for CAST before
NEDF or SEM3+Major.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-cast-system) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## System Overview

A network has two kinds of objects:

- **Nodes** — the things (encoded via the Georgian node system, 4 slots)
- **Edges** — the relationships (encoded via CAST, 8 bits = 4 slots)

Each node is a scene. Each edge is a scene. The mind palace arranges them
spatially so proximity encodes connectivity.

---

## Part 1 — The Georgian Node System

Each node is a 4-slot scene built from a Georgian letter's associations.
The Georgian alphabet gives you a naturally ordered, phonetically-rich basis
with 33 entries — more than enough for most domain vocabularies.

### The 4 node slots

| Slot | Role | Encodes |
|------|------|---------|
| **Animal** | Identity | *Who* the node is — its name or function |
| **Environment** | Cluster | *Which group/layer/module* it belongs to |
| **Adjective** | State | Current *condition* (healthy, broken, active, dormant) |
| **Name-modifier** | (Optional) | Fine-grained disambiguation for multiple instances |

The first three are always filled. The fourth is reserved for cases where
you have multiple instances of the same type (e.g., three different controllers).

### Why Georgian letters?

- 33 letters = enough coverage without collisions
- You (the user) read Georgian, so the letters prime recall naturally
- Each letter has a fixed animal, person, adjective, and environment —
  all starting with the same letter sound (quadruple alliteration)

### The Georgian node table

**The canonical 33-letter table lives in `georgian-system.md`.** Each entry has
four slots all starting with the same Georgian letter:

1. **Animal** — node identity
2. **Person** — (optional) disambiguation when multiple same-type nodes exist
3. **Adjective** — node state
4. **Environment** — node cluster

Example:
- ა → Eagle (animal) / Anano (person) / exalted (adj) / balcony (env)
- ვ → Whale (animal) / Vika (person) / vast (adj) / fan (env)

See `georgian-system.md` for the full 33-entry table.

### Node encoding procedure

1. **Pick the Georgian letter** whose animal best matches the node's identity
   (by sound, meaning, or domain association).
2. **Use that letter's environment** as the node's cluster marker — unless the
   cluster is *given externally* (e.g., palace location), in which case the
   environment yields to the palace.
3. **Use that letter's adjective** as the node's current state.
4. **Place the animal in the environment** with the adjective active. That
   scene *is* the node.

**Example:** A database in a Laravel app.
- Letter: ვ (Whale) → identity = Whale
- Environment: Deep ocean → cluster = "data layer"
- Adjective: Vast → state = "stable, high-capacity"
- Scene: *A vast whale in the deep ocean, calm and dominant*

---

## Part 2 — CAST Edges (full reference)

CAST encodes every edge as an 8-bit string → one scene with 4 components.

### The name: **C**haracter · **A**ction · **S**tream · **T**ime

| Bits | Slot | Encodes | Answers |
|------|------|---------|---------|
| AB | Character | Source role + direction | WHO |
| CD | Action | Relationship type + strength | HOW |
| EF | Stream | What flows through | WHAT |
| GH | Time | Stability / conditionality | WHEN |

**Studio / tooling:** The learning app loads the same row-level lexicon from `src/data/castLexicon.js` (including short “when to pick” hints in the CAST playground). If you change a row’s meaning here, update that file so the playground and tests stay aligned.

**Beginners + bilingual gloss:** See **`cast-beginner-bilingual.md`** for *very* short English wordings plus **Georgian** and **Russian** columns aligned to the same four slots.

### C — Character (AB): source role + direction

| Bits | Person | Direction | Source role |
|------|--------|-----------|-------------|
| 00 | Giant 🗿 | → one-way | Hub / controller / dominates |
| 01 | Mermaid 🧜 | ↔ bidirectional | Peer / partner / equal exchange |
| 10 | Mage 🧙 | → one-way | Service / helper / subtle |
| 11 | Dragon 🐉 | ← reverse | Reactor / triggered by target |

**Rule:** The Person in the scene = the source node's role.

### A — Action (CD): type + strength

| Bits | Action | Meaning | Strength |
|------|--------|---------|----------|
| 00 | crushing | controls / owns | strong |
| 01 | flowing | feeds / supplies | medium |
| 10 | spreading | influences / affects | weak |
| 11 | exploding | transforms / breaks | critical |

### S — Stream (EF): what flows

| Bits | Object | Flows |
|------|--------|-------|
| 00 | 🧱 rock | data / structure |
| 01 | 💧 water | energy / resources |
| 10 | ☁️ cloud | information / signals |
| 11 | 🪨 stone | events / triggers |

### T — Time (GH): stability

| Bits | Environment | Stability |
|------|-------------|-----------|
| 00 | 🪨 red cave | permanent |
| 01 | 🌊 blue ocean | mostly active |
| 10 | ☁️ green sky | conditional |
| 11 | 🌋 purple storm | temporal |

---

## Part 3 — Reading and Writing CAST Scenes

### Writing a CAST scene from bits

**Bits:** `00 01 10 00`

1. C=00 → Giant, one-way →
2. A=01 → flowing (medium feed)
3. S=10 → cloud (information)
4. T=00 → red cave (permanent)

**Scene:** *A Giant in a red cave, flowing a cloud forward.*
**Meaning:** Source permanently feeds information to target, one-way, medium strength.

### Writing a CAST scene from a relationship

"The auth service permanently validates every request from the API gateway."

1. Auth is the *target* here; API gateway is the *source*. Source dominates? No — source asks, auth answers. Source is calling into auth. Character = **Mage (10)** — subtle service interaction, one-way.
2. Action = validation is strong/controlling? It's medium — it feeds validated results. **Flowing (01)**.
3. What flows? Data (the request + response). **Rock (00)**.
4. Stability? Every request → permanent. **Red cave (00)**.

Bits: `10 01 00 00` → *Mage in red cave, flowing a rock*.

---

## Part 4 — Worked Examples Across Domains

### Example 1 — Code (Laravel app)

Nodes (Georgian):
- ა Eagle = Router (Giant: hub)
- ბ Owl = Middleware (Mage: subtle gatekeeper)
- გ Pig = Controller (Giant: controls logic)
- ვ Whale = Database (Giant: data store)
- ე Raccoon = Model (Mermaid: bidirectional with DB)

Edges:
- Router → Middleware: `10 10 00 00` → Mage spreading rock in red cave (subtle permanent filter)
- Controller → Model: `00 00 00 00` → Giant crushing rock in red cave (controls data structure)
- Model ↔ Database: `01 01 00 01` → Mermaid flowing rock in blue ocean (bidirectional data, mostly active)

### Example 2 — Math (dependency graph for proving the Central Limit Theorem)

Nodes:
- Sample mean definition (Mage — helper concept)
- Law of Large Numbers (Giant — foundational theorem)
- Characteristic functions (Mage — tool)
- CLT itself (Giant — target theorem)

Edges:
- LLN → CLT: `00 01 10 00` → Giant flowing cloud in red cave (foundational information, permanent)
- Characteristic fn → CLT: `10 11 10 00` → Mage exploding cloud in red cave (critical tool, transforms the proof)

When you walk this graph in a palace, you *see* why CLT depends on LLN and
characteristic functions before you can write the proof. Problem-solving gold.

### Example 3 — History (causes of WWI)

Nodes:
- Alliance system (Giant — structural)
- Assassination of Franz Ferdinand (Dragon — trigger)
- Mobilization schedules (Mage — invisible procedural)
- Great powers (Mermaid — peer rivals)

Edges:
- Assassination → Alliance cascade: `11 11 11 11` → Dragon exploding stone in purple storm (trigger, critical, event, temporal)
- Mobilization → War: `10 11 11 00` → Mage exploding stone in red cave (subtle but permanent transform)
- Great powers ↔ each other: `01 10 10 01` → Mermaid spreading cloud in blue ocean (bidirectional signaling, mostly active)

### Example 4 — Argument structure (philosophy paper)

Nodes:
- Premise 1 (Mage — supporting)
- Premise 2 (Mage — supporting)
- Inference rule (Giant — controlling the move)
- Conclusion (Dragon — emerges from trigger)
- Counterexample (Dragon — attacks conclusion)

Edges:
- Premises → Conclusion via Inference: chain of CAST scenes
- Counterexample → Conclusion: `11 11 11 11` → Dragon explosion (critical attack)

This is how you memorize a philosophical argument so you can reconstruct it
under questioning — not as words, but as a graph you walk.

---

## Part 5 — Decision Rule: CAST vs. NEDF vs. Major+SEM3

| You're encoding | Use |
|-----------------|-----|
| A number | Major / SEM3 / PAO (existing stack) |
| A concept (thing) | NEDF (concept-encoding.md) |
| A relationship, flow, dependency | **CAST** |
| A network of things + relationships | **Georgian nodes + CAST edges** |
| A procedure / algorithm | PAO-style mini-story chain |
| A formula | Symbolic encoding (see formulas.md when built) |

**When unsure:** ask "is the learning-load in the *thing* or in *how it connects*?"
If connections → CAST. If the thing itself → NEDF.

---

## Part 6 — Building a Network from Scratch (learning a codebase / theorem / system)

1. **Find the nodes.** Folder structure, entity list, concept glossary, chapter titles.
2. **Classify each node.** Giant / Mermaid / Mage / Dragon based on role in the network.
3. **Assign Georgian letters.** Match by sound/meaning where possible.
4. **Trace one full path end to end.** One feature, one proof chain, one causal sequence.
5. **Encode each edge along that path** as a CAST scene.
6. **Ask three questions per node:** What calls this? What does this call? What breaks if removed?
7. **Let gaps pull you forward.** Unknown edges are your next learning target.
8. **Feel the shape.** After 3–4 paths, step back. Which nodes have surprising centrality? Those are your real hubs.

---

## Part 7 — Graph Mind Palace Principle

Canonical companion for vocabulary, tradeoffs, and **palace vs indexing**: **`mind-palace.md`**.

- High-connectivity nodes (hubs) → prominent locations (entrance halls, central rooms)
- Clusters → different buildings or neighborhoods
- Edges → physical interactions between locations (paths, doors, pipes)
- The spatial layout *is* the topology
- Walking the palace *is* traversing the graph

**For Anki:** each edge is a card. Front = source + target names. Back = CAST bits + scene. Each node is also a card. Front = Georgian letter or concept name. Back = animal + environment + adjective.

---

## Part 8 — Quick Reference Card

```
NODE (Georgian, 4 slots):
  Animal     — who (identity)
  Environment— cluster (layer/module)
  Adjective  — state (condition)
  [Modifier] — optional disambiguation

CAST EDGE (8 bits, 4 slots):
  AB = C = Character  00 Giant→  01 Mermaid↔  10 Mage→  11 Dragon←
  CD = A = Action     00 crush   01 flow      10 spread  11 explode
  EF = S = Stream     00 rock    01 water     10 cloud   11 stone
  GH = T = Time       00 cave    01 ocean     10 sky     11 volcano

READING ORDER: WHO / HOW / WHAT / WHEN
```

---

## Representation atlas — every surface in this app

CAST is intentionally mirrored across modalities so you can choose the channel that matches how you think day-to-day.
The markdown body is the canonical prose specification with tables, worked domains, and quick reference cards.
The atlas map places this file on the concept tier so you can see which neighbors to open next — binary-hex for the shared
bit vocabulary, georgian-system for node identity, retrieval-protocol for how decks consume edges, and collisions for
disambiguation rules. The weight spectrum treats the document as a signal about how central relational encoding is to
your current study session. On the document route, the orbit widget renders related files as a small graph so you can
jump outward without losing the CAST frame. Finally, the learning studio compresses the same story into a walkthrough
that follows headings, guided examples that rehearse forward and backward prompts, and a playground that adds live
composition plus decode drills. Use every representation once during onboarding, then lean on the two that stick.

---

## Matrix view — CAST as a specialized 8-bit grid

Treat the four two-bit pairs as the rows of a mental matrix: Character versus Action versus Stream versus Time.
Each row has exactly four legal states, which keeps combinatorics bounded while still expressive enough for real software
graphs, proof nets, and causal histories. When you are unsure which row is wrong during recall, compare against the
generic elemental matrix in binary-hex.md — the bits are the same even when the labels change. CAST simply renames the
axes so the first pair always answers who the source behaves as, the second pair names the relationship verb family,
the third names what substance moves, and the fourth names how durable the dependency feels. Matrix thinking helps when
you are debugging a stuck edge: rotate through the four rows and ask which answer feels false compared to the codebase.

---

## List representation — CAST decision checklist

Work the edge through this ordered list before you freeze a palace location: (1) Confirm the endpoints already have
Georgian node scenes so the hop is anchored. (2) Decide whether the source acts as hub, peer, helper, or reactor for
this specific hop — that pins Character. (3) Classify the interaction as control, feed, influence, or rupture — that
pins Action strength. (4) Name whether structure, resources, signals, or discrete events move — that pins Stream. (5)
State permanence, active maintenance, conditionality, or volatility — that pins Time. (6) Speak the full scene aloud in
WHO then HOW then WHAT then WHEN order to catch awkward grammar early. (7) Write the eight bits on the Anki back beside
a one-line natural language gloss. Lists complement tables because they give you a repeatable audit path under stress.

---

## Diagram vocabulary — spatial graph mnemonics

Even without drawing on paper, you should be able to narrate a diagram: hubs occupy architectural centers, satellites
ring them, bottlenecks become narrow chokepoints, and bidirectional edges borrow symmetrical props such as bridges with
two-way lanterns. CAST bytes decorate each connector object in that diagram — a door, cable, river, or contract scroll —
so the visual metaphor stays consistent with the bitstring. When you promote an edge from temporary sketch to long-term
memory, upgrade the prop fidelity instead of inventing a second scene. Spatial vocabulary also explains why CAST pairs
naturally with measurement frameworks that track graph size and retrieval decay: if the palace no longer matches the
topology, the bytes will not retrieve cleanly either.

---

## Narrative arc — story-first encoding order

Some learners prefer to start from a plot beat and only then derive bits. Tell the relationship as a micro-story with a
named protagonist drawn from the Character roster, give them an Action verb that matches emotional torque, let Stream
supply the prop they manipulate, and let Time set the weather or lighting that signals stability. Once the story feels
honest, peel off the four pairs in reading order and confirm the byte matches what you would have chosen analytically.
Narrative-first encoding is slower at first but reduces collisions when two different edges want similar verbs because
the plot beat forces disambiguation. The learning studio playground exists to rapid-fire this arc without opening the
full document.

---

## Key Principles

1. **Nodes before edges.** Classify and encode nodes first, then draw edges between them.
2. **One edge = one scene = 8 bits.** Never split an edge across multiple scenes.
3. **Direction lives in Character.** The Person's stance encodes the arrow.
4. **Strength lives in Action.** The verb encodes the line weight.
5. **Content lives in Stream.** The object encodes what flows.
6. **Stability lives in Time.** The environment encodes permanence.
7. **Spatial arrangement matters.** Palace layout must mirror topology — otherwise you're paying for a graph and using it as a list.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-cast-and-georgian-nodes)**.

