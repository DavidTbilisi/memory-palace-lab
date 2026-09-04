---
name: mnemonic-systems
description: >
  This skill encodes the user's personal mnemonic ecosystem — including Major System,
  SEM3, Peg Matrix, PAO 10×10×10, Hex/Binary elemental systems, the NEDF concept
  encoding protocol, the CAST relational system with Georgian nodes, the Heuristic
  Palace for problem-solving, and Mind Palace structure. Design orientation: life
  skills & emotional intelligence, digital & future-ready skills, practical everyday
  skills, and global citizenship & ethics, with STEAM (STEM + Arts) and STEMM
  (+ Medicine) example lanes. Use this skill whenever the user asks to: memorize
  numbers, dates, codes, sequences, concepts, formulas, or relationships; choose
  which mnemonic system fits a task; encode a specific chunk of data or idea into
  images; design or extend a new memory system; plan a mind palace structure; or
  apply problem-solving heuristics. Trigger even for casual mentions like "how
  should I memorize this", "which system fits", "help me build a deck for X",
  "design a system for Y data type", or "I'm stuck on this problem".
---

# Mnemonic Systems Skill

This user has built an interconnected ecosystem for **learning, memorizing,
and problem-solving at maximum speed** across code, math, languages, and
domain knowledge.

**Design orientation (read first for *why*):** the stack is aimed at **(1) life skills & emotional intelligence**, **(2) digital & future-ready skills**, **(3) practical everyday skills**, and **(4) global citizenship & ethics** — with worked examples biased toward **STEAM** (STEM + **Arts**) and **STEMM** (STEM + **Medicine**) where high stakes demand extra care. See `design-orientation.md` for the mapping from those problems to specific protocols (gates, NAVIGATOR, NEDF, CAST, SPEAR, measurement).

The stack has **four tiers** for encoding and operations, plus an optional **NAVIGATOR** project wrap (`navigator.md`) for whole-unit learning — nine phases whose initials spell the word in order (**N**arrow → **A**cquire → **V**iew → **I**mprint → **G**ym → **A**ct → **T**hread → **O**utline → **R**ecalibrate).

1. **Comprehension & problem-solving** — how you *understand* and *solve* (not just store)
2. **Non-numeric encoding** — concepts, formulas, relational networks
3. **Numeric encoding** — numbers, dates, hex, binary, pegs
4. **Operational layer** — palaces, retrieval protocols, meta-monitoring

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-skill) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The Full Stack

```
Project-scale learning (optional)
  NAVIGATOR               — nine phases: Narrow…Recalibrate (navigator.md)

Comprehension & problem-solving
  Comprehension Protocol  — 5 gates before encoding anything difficult
  Confusion Triage        — 5 kinds of stuck; matched moves for each
  Heuristic Palace        — 6 rooms + wings; walked when stuck on solving
  Domain Patterns         — pattern libraries per domain (algorithms, proofs, debug)
  TRIZ (condensed)        — contradictions, separation, 20 principles, matrix
  Metacognitive Checklist — self-audit during learning

Non-numeric encoding
  NEDF                    — concepts (Name · Essence · Distinguisher · Failure)
  SPEAR                   — procedures (Scene · Preconditions · Execution · Alternatives · Repair)
  Formulas                — symbols + zones (Greek, operators, positional structure)
  CAST + Georgian         — networks (nodes + edges, full relational system)

Numeric encoding
  SEM3                    — sensory prefix for 4-digit chunks
      └── Major           — 2-digit core (00–99 → word/image)
  PAO 10×10×10            — 3-digit chunks (Person + Action + Object)
  Peg Matrix              — 2-digit fallback, lists, simple sequences
  Hex / Binary            — hex values, bitfields, binary data

Operational layer
  Mind Palace             — spatial container for encoded content (`mind-palace.md`)
  ZLP + FRS               — physical zero-loss + Today Core forced recall (`zero-loss-forced-recall.md`)
  Retrieval Protocol      — Anki templates + palace-walk cadence + repair
  Collisions              — cross-system disambiguation rules
  Measurement Framework   — 6 dimensions + belt ranks + LPQ composite
```

---

## Meta: Learning this ecosystem itself

The stack is large on purpose; **onboarding is a separate skill** from using any one subsystem.

- **Memorization helpers (NEDF / SPEAR per method):** `references/memorization-helpers.md` — for every stack doc and the main **book** workflows (`beating-the-red-queen.md`), a dedicated “how to memorize *this*” section: **NEDF** the protocol itself, **SPEAR** how to *run* it, **Comprehension** mapping, and a **15-minute first session**.
- **Onboarding path (minimal · mid · maximal):** `references/onboarding-path.md` — week-by-week depth, promotion criteria, **spacing defaults**, **pruning rules**, cadence tables, under-load policy, and monthly verification against real sources.
- **NAVIGATOR learning loop (optional):** `references/navigator.md` — when taking on a **whole unit** (course week, large feature, cert block): learning contract, nine ordered phases (acronym = sequence), DOK depth checks, quick-start sprint, tie-in to measurement.
- **Read SKILL for the map once**, then follow onboarding for **order and caps**; return to SKILL when choosing *which* encoder fits a new kind of data.

---

## System Reference

### Comprehension & Problem-Solving (Tier 1)

These are the moves you make *before* encoding and *when stuck*. Comprehension
protocols produce the understanding that encoding later stores. Problem-solving
protocols apply that understanding under pressure.

#### C1. Comprehension Protocol (5 gates)
- **5 gates before encoding any difficult concept:** Locate · Represent · Minimize · Falsify · Regenerate
- Full protocol: `references/comprehension-protocol.md`
- **Role:** produces the understanding that encoding stores. No encoding without passing all gates.
- **When to use:** any time you encounter a non-trivial new concept

#### C2. Confusion Triage Protocol
- **5 kinds of "stuck on understanding":** Prerequisite gap · Tangled concepts · Wrong mental model · Missing representation · Scale mismatch
- Each has a matched move
- Full protocol: `references/confusion-triage.md`
- **Role:** the stuck-path companion to the Comprehension Protocol. When you can't understand, triage which kind of stuck you're in.
- **When to use:** whenever a comprehension attempt stalls

#### C3. Heuristic Palace (6 rooms + 4 wings)
- Fixed, permanent palace walked when stuck on solving a problem
- 6 core rooms: Understand · Reframe · Classify · Plan · Execute · Review
- 4 expansion wings: Debug · Proof · Design · Strategy
- ~50 loci total
- Full palace: `references/heuristic-palace.md`
- **Role:** the speed layer for problem-solving. Never stuck at a blank wall.
- **When to use:** any problem where you don't immediately see the path

#### C4. Domain Pattern Libraries
- ~30 patterns per domain (algorithms, proofs, debug signatures, design patterns, cognitive biases)
- Each pattern: Name · Signature · Mechanism · Canonical use · Variants · Failure mode · Encoding
- Full library structure + seed content: `references/domain-patterns.md`
- **Role:** real problem-solving speed comes from pattern recognition. Library grows with your actual work.
- **When to use:** after Heuristic Palace Room 3 (Classify), match against domain patterns

#### C5. Metacognitive Checklist
- Self-audit questions at 4 checkpoints: before / mid-session / end / next day
- 9 named self-deception patterns to recognize
- Weekly meta-review protocol
- Full checklist: `references/metacognitive-checklist.md`
- **Role:** object-level work without meta-monitoring regresses to mediocrity. This is the active correction layer.
- **When to use:** transverse — runs above all other systems

#### C6. TRIZ (Condensed Practical Subset)
- **The contradiction-specialist toolkit:** 4 moves — Ideality, Separation Principles, 20 Inventive Principles, 12×12 Contradiction Matrix
- Cross-domain (software, math, strategy, physical) — not engineering-only
- Full system: `references/triz.md`
- Integrated into Heuristic Palace: Ideality as Room 1 locus, 4 Separation loci in Room 2, Contradiction Matrix + 20 Principles in Design Wing
- **Role:** when a problem has a clear contradiction ("improving X worsens Y" or "must be A and ¬A"), this is the specialized tool
- **When to use:** after Heuristic Palace Room 1 reveals a contradiction; for design/invention problems; when generic heuristics aren't producing a breakthrough

### Numeric Systems

#### 1. Major System (foundation)
- Encodes **2-digit numbers (00–99)** into concrete words/images
- Consonant mapping: S/Z=0, D/T=1, N=2, M=3, R=4, L=5, J/SH/CH=6, K/G=7, F/V=8, B/P=9
- Full table: `references/major-system.md`
- **Role:** anchor for any numeric encoding — always present as the final 2-digit image

#### 2. PAO 10×10×10 (3-digit encoder)
- 10 People × 10 Actions × 10 Objects, phonetically aligned to Major
- One 3-digit number → one mini-story scene
- Full table: `references/pao.md`
- **Role:** natural fit for phone numbers and 3/6/9-digit chunks

#### 3. SEM3 (sensory-prefixed 4-digit encoder)
- First 2 digits of a 4-digit chunk → SEM3 category × item (sensory modifier)
- Last 2 digits → Major System image
- 10 categories × 10 items = 100 entries
- The category modifies *how* you experience the Major image (smell, sound, touch…)

**The 10 SEM3 Categories:**
| Digit | Category | Example items |
|-------|----------|---------------|
| 0 | Vision | Dinosaur, Moonlight, Concorde, Fire, Painting |
| 1 | Sound | Sing, Drum, Neigh, Roar, Gong, Piano |
| 2 | Smell | Seaweed, Nutmeg, Mint, Rose, Coffee, Bread |
| 3 | Taste | Spaghetti, Tomato, Mango, Lemon, Cherry, Banana |
| 4 | Touch | Sand, Mud, Rock, Jelly, Grass, Velvet |
| 5 | Sensation | Swim, Dancing, Flying, Climbing, Peace |
| 6 | Animals | Zebra, Deer, Monkey, Rhino, Elephant, Giraffe |
| 7 | Birds | Seagull, Duck, Magpie, Robin, Flamingo, Peacock |
| 8 | Rainbow (Colors) | Red, Orange, Yellow, Green, Blue, Indigo, Violet |
| 9 | Solar System | Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn |

**Key notation:** SEM3 keys are 4-digit strings in the format `CIXX`:
- **CI** = Category × 10 + Item (2 digits, the sensory prefix)
- **XX** = Major System suffix (2 digits, the visual anchor)

So `2743` decomposes as SEM3 prefix `27` (category 2 Smell, item 7 Coffee) +
Major suffix `43` (Ram) → *Ram in a coffee shop*.

Full 100-entry table: `references/sem3-full.md`

#### 4. Peg Matrix (audio × visual, 00–99)
- 10×10 grid combining two peg systems:
  - **Audio pegs** (tens digit, rhyme-based): 0=Hero, 1=Bun, 2=Shoe, 3=Tree, 4=Door, 5=Hive, 6=Sticks, 7=Heaven, 8=Gate, 9=Wine
  - **Visual pegs** (units digit, shape-based): 0=Donut, 1=Paintbrush, 2=Swan, 3=Heart, 4=Yacht, 5=Hook, 6=Bomb, 7=Axe, 8=Hourglass, 9=Balloon
- Answer: "AudioPeg + VisualPeg" e.g. 37 = Tree + Axe
- **Role:** simple 2-digit fallback for everyday lists and ordered sequences

#### 5. Hex System (elemental cross-matrix)
- Encodes **hex digits 0–F** as Element × State combinations
- Elements: 00 Fire, 01 Air, 10 Water, 11 Earth (high nibble of the 4-bit hex digit)
- States: 00 Solid, 01 Liquid, 10 Gas, 11 Plasma
- Examples: `0`=rock wall, `5`=dew drop, `A`=mist veil, `F`=mantle flare
- Full table: `references/binary-hex.md`
- **Role:** hex values, color codes, memory addresses

#### 6. Binary System (4-bit / 8-bit)
- **4-bit:** same 16 scenes as hex (one nibble = one hex digit)
- **8-bit:** two 4-bit matrices stacked → one scene with 4 slots (AB Character, CD Form, EF Object, GH Setting)
- Cross-matrix insight: core scene = AB × GH; CD and EF add variation
- Full system: `references/binary-hex.md`
- **Role:** binary data, bitfields, flags
- **Note:** the 8-bit scheme is the general form of CAST — CAST just assigns semantic roles (source role, relationship type, stream, stability) to the same 4 slots

### Non-Numeric Systems

#### 7. NEDF — Concept Encoding
- Encodes **definitions, ideas, and mental models** via 4 slots:
  - **N**ame-hook · **E**ssence · **D**istinguisher · **F**ailure
- Full protocol + worked examples: `references/concept-encoding.md`
- **Role:** anything that is a *thing* (concept, term, model, principle)
- **When to use:** the concept has a name you need to retrieve from, and it has a classic failure mode worth knowing

#### 8. SPEAR — Procedure Encoding
- Encodes **algorithms, proof sequences, protocols, and any ordered process** via 5 slots:
  - **S**cene · **P**reconditions · **E**xecution · **A**lternatives · **R**epair
- Three execution styles: causal chain (≤7 steps), spatial path (8–20 steps), recursive scene
- Full protocol + worked examples: `references/procedure-encoding.md`
- **Role:** anything with steps and order-dependency (algorithms, debugging procedures, proof templates, heuristic sequences)
- **When to use:** if the learning-load is in *how to do something*, not *what something is* (NEDF) or *how things connect* (CAST)

#### 9. CAST + Georgian Node System — Relational Encoding
- **Nodes** encoded via Georgian letters (Animal + Person + Adjective + Environment — all starting with the same Georgian letter sound)
- **Edges** encoded via CAST (8 bits = 4 slots):
  - **C**haracter (source role + direction) · **A**ction (type + strength) · **S**tream (what flows) · **T**ime (stability)
- Georgian node table: `references/georgian-system.md` (full 33-entry canonical table)
- CAST edge system: `references/cast-system.md`
- **Role:** anything relational — codebases, math dependencies, historical causation, argument structures
- **When to use:** the learning-load is in the *connections*, not the things

#### 10. Formula System — Symbolic Encoding
- Encodes **Greek letters, operators, quantifiers, and structural positions** into scenes
- Three layers: atom library (Greek + operators as images), structural zones (up/down/left/right/center of scene), composition (sequential / structural / hybrid modes)
- Full system: `references/formulas.md`
- **Role:** math formulas, logic expressions, statistical notation, physics equations
- **When to use:** encoding any expression built from symbols beyond Arabic digits

### Operational Layer

#### 11. Mind Palace
- **Spatial container** — organizes encoded images; it does **not** replace NEDF/CAST/SPEAR/Major (those are the *payloads*; the palace is the *geography + order + optional proximity semantics*)
- **Palace vs locus:** the **palace** is the named whole (routes, wings, rules); a **locus** is **one stop** on a route where a scene is mounted
- Bind a palace to a **stable** place (real, imagined, or hybrid) with semantic fit for the domain; freeze the **canonical walk order**
- Palace = *context prefix*; loci inherit meaning from **neighborhood** and **direction**, not only from a slot number — that is why it beats “just indexing” for large structured material (full spec: `references/mind-palace.md`)

#### 12. Zero-Loss Protocol (ZLP) + Forced Recall System (FRS)
- **ZLP** — keys, bag, gear: **one anchor each**, **drop marker** (spoken line + exaggerated flash) every placement, **identity amplification** so objects are never visually neutral; loss means “no encoding,” not “weak memory”
- **FRS** — deadlines and critical tasks: **Today Core** (≤5 loci only for hard dates/must-do), **triple triggers** (wake / door / sleep, 2–3 alarms labeled CHECK SYSTEM, overwhelm → “Check palace”), **10-second rule** per trigger, **reset protocol** when drift returns
- Full spec: `references/zero-loss-forced-recall.md`
- **Role:** operational attention hygiene — **matter** (ZLP) and **time** (FRS) — orthogonal to encoders; pairs with Mind Palace + Retrieval cadence

#### 13. Retrieval Protocol
- Thin layer on top of Anki: card templates per system + palace-walk cadence + weak-link repair
- Anki handles card-level scheduling; this protocol handles what Anki can't (palace topology, speed training, scene decay repair)
- Full protocol: `references/retrieval-protocol.md`
- **Role:** the consolidation layer — what actually turns encoded scenes into durable, fast recall

#### 14. Measurement Framework
- **6 dimensions:** Speed · Accuracy · Depth · Durability · Application · Process
- Each has 7 belt ranks (White → Black) with quantitative thresholds
- **METER's event log** does the measuring (Anki bridge, `palace meter backfill`); daily 30-second check-in + monthly belt tests + quarterly audits
- **LPQ composite** (geometric mean × 125) for trajectory tracking — range 125–1000
- Full framework: `references/measurement-framework.md`
- **Role:** answers "am I actually improving?" with numbers, not vibes. Catches lagging dimensions early.
- **When to use:** daily log always on; weekly review; monthly belt tests; quarterly recalibration

---

## Decision Logic: Which System to Use?

### Master rule

| What you're doing | System |
|-------------------|--------|
| **Planning a study sprint / whole learning unit** (scope, sources, transfer) | **NAVIGATOR** (`navigator.md`) — then default encoders below |
| **Encountering a new difficult concept** | **Comprehension Protocol** (5 gates) |
| **Stuck on understanding** | **Confusion Triage** (identify kind of stuck) |
| **Stuck on solving a problem** | **Heuristic Palace** (6 rooms, walk in order) |
| **Problem has a clear contradiction** (improving X worsens Y) | **TRIZ** (contradiction matrix + separation principles) |
| **Need to redefine the problem, not solve the current one** | **TRIZ Ideality** (work backward from ideal final result) |
| **Pattern-matching a problem** | **Domain Patterns** (after Room 3 of palace) |
| **Auditing my learning process** | **Metacognitive Checklist** |
| Encoding a **number** | Numeric stack (see table below) |
| Encoding a **thing / concept / definition** | **NEDF** (concept-encoding.md) |
| Encoding a **relationship / flow / dependency** | **CAST** (cast-system.md) |
| Encoding a **network of things + relationships** | **Georgian nodes + CAST edges** |
| Encoding a **procedure / algorithm** (ordered steps) | **SPEAR** (procedure-encoding.md) — Scene · Preconditions · Execution · Alternatives · Repair |
| Encoding a **formula / symbolic expression** | **Formula system** (formulas.md) |
| Encoding a **date** (month + day) | Georgian letter (month) + **Major** image (day) — *optional:* weekday ↔ **7 spectrum colors** (ROYGBIV) with **object banks per color** (not bare hues), day 1–31 ↔ **Georgian rows 1–31**; see `georgian-system.md` **Optional calendar pegs** |
| Encoding a **full calendar line** (year-month-day + weekday + headline) or **clock hours** (`HH:MM`) on a palace ring | **`calendar-time-memorization.md`** — ISO log template, hour loci, famous-clocks example deck |
| Encoding a **fixed-order sacred or classical list** (e.g. **Bible books**) | **`bible-memorization.md`** — segmented palace + full 66-book teaching table; swap canon explicitly |
| **Live lecture / talk / friend monologue** — structure while listening (notes if allowed, else silent STREAM + loop-backs) | **`lecture-listening-notes.md`** (§9 no-notes social) — semantic tags + STREAM + post-class regeneration where applicable |
| Encoding a **33-item ordered list** | Georgian letter sequence |
| **Long-term organization** of any of the above | **Mind Palace** as container (`mind-palace.md` — vs flat indexing, palace vs locus, real vs imagined) |
| **Consolidating encoded scenes** | **Retrieval Protocol** (Anki + palace walks) |
| **Losing physical objects** (keys, bag) despite “knowing better” | **ZLP** (`zero-loss-forced-recall.md` Part A) — anchors + drop markers + identity amplification |
| **Missing deadlines** even when material is encoded | **FRS** (`zero-loss-forced-recall.md` Part B) — Today Core + triple triggers + forced access |
| **Tracking whether I'm actually improving** | **Measurement Framework** (6 dimensions + belts + LPQ) |

### Numeric decision table

| Length | Decomposition |
|--------|---------------|
| 2 digits | Major |
| 3 digits | PAO |
| 4 digits | SEM3 (2) + Major (2) |
| 6 digits | **Default:** PAO × 2. **Use SEM3+Major+Peg** (2+2+2) only when the middle chunk benefits from sensory coding. |
| 8 digits | SEM3+Major × 2 |
| 9 digits (phone numbers) | PAO × 3 |
| 10 digits | SEM3+Major × 2 + Peg remainder |
| 12 digits | Peg + SEM3+Major × 2 (or SEM3+Major × 3) |
| Ordered lists / to-do | Peg Matrix |
| Hex values | Hex system |
| Binary / bitfields | Binary 4-bit or 8-bit |

### Decision questions to ask the user
1. **Is the learning-load in the thing or the connections?** → NEDF vs. CAST
2. **What data type?** (number / concept / relation / procedure / formula)
3. **How long?** (determines chunk stacking for numeric data)
4. **How permanent?** (long-term → Mind Palace; everyday → Peg Matrix)
5. **Does context matter?** (yes → anchor to a domain Mind Palace)

---

## Designing a New System

When the user wants to create a new deck or encoding scheme:

### Step 1 — Identify the data type
- Numbers, words, symbols, concepts, relationships, procedures?
- Natural structure: pairs, triples, ordered sequences, grids, graphs?

### Step 2 — Find the natural chunk size
- 2 items → Major / Peg
- 3 items → PAO structure
- 4 items → SEM3 + Major, or NEDF for concepts
- Grid / matrix → cross-matrix approach (row × column = scene)
- Graph → Georgian nodes + CAST edges

### Step 3 — Choose an imagery theme
- Pick a domain the user finds vivid (fiction characters, elements, animals, sensory categories)
- Each item must be: visually distinct, emotionally engaging, easy to animate mentally

### Step 4 — Align first characters with Major System where possible
- Double-encode: image AND sound reinforce the same digit

### Step 5 — Define the scene template
- Fixed output format so every combination yields a unique scene
- Test: can you close your eyes and see it?

### Step 6 — Build the JS data file (if computational)
- Pattern: `DATA` object + `META` array + `IMAGES` object
- Zero-padded string keys
- Export: `{ DECK_DATA, DECK_META, DECK_IMAGES }`

---

## Key Principles

1. **Comprehension precedes encoding. Always.** Encoding a concept you don't understand stores confusion. Pass all 5 gates of the Comprehension Protocol first.
2. **Images before words** — always translate to a concrete visual scene first.
3. **Multi-sensory beats single-sensory** — SEM3 exists so scenes have smell, sound, touch.
4. **Emotion = retention** — vivid, bizarre, emotionally charged wins.
5. **Major is the anchor** — when in doubt for numeric content, fall back to 2-digit Major and build from there.
6. **NEDF for things, CAST for relations.** If the learning-load is in connections, encode the graph.
7. **Classify before plan.** Room 3 of the Heuristic Palace (problem genus) is the highest-leverage move. Pattern recognition beats generic reasoning.
8. **Regeneration is the only real test.** If you can't derive it from scratch, you don't understand it — you recognize it.
9. **Metacognition runs above everything.** Object-level work without meta-audit regresses. Checkpoint at start, mid, end, next-day.
10. **Mind Palace = context, not content** — palace organizes; systems encode.
11. **Active recall over review** — Anki is the retrieval layer; encodings should be Anki-ready.
12. **Failure modes belong in scenes** — NEDF slot 4 is mandatory; the Heuristic Palace Graveyard stores failed approaches.
13. **Collisions are managed, not eliminated** — same-image cross-system overlaps resolve by context and role differentiation (see `collisions.md`). Only same-role collisions require swaps.
14. **Measure the trajectory, not the day.** The Measurement Framework's 6 dimensions + LPQ composite track direction. Daily numbers are noise; monthly trends are signal. What doesn't get measured doesn't improve reliably.
15. **Don't compromise — separate.** When a problem contains a contradiction (must be A *and* ¬A), TRIZ says the answer isn't a middle ground. Separate A and ¬A across time, space, condition, or system level. Use Ideality to redefine the problem before accepting the contradiction as fundamental.
16. **Define the stop rule before the sprint.** Undefined "mastery" expands until it consumes every hour; NAVIGATOR's **Narrow** phase + ROI check prevents studying past diminishing returns.

---

## Reference Files

### Project-scale learning
- `references/design-orientation.md` — four life/citizenship problem clusters + STEAM / STEMM lanes; maps stack tools to resilience, digital safety, finances, emergencies, sustainability, culture
- `references/navigator.md` — NAVIGATOR nine phases (Narrow…Recalibrate), learning contract, DOK ladder, diagram, 80/20 companion habits, memory-gym rotation
- `references/steam-stemm-examples.md` — **three worked examples per lane** (Science, Technology, Engineering, Arts, Math, Medicine) for almost every subsystem; use when building decks or teaching
- `references/memorization-helpers.md` — **how to memorize each method itself**: NEDF + SPEAR + comprehension mapping + first session, for every `theSystem` spec and major **book** workflow (`beating-the-red-queen.md`)

### Comprehension & Problem-Solving
- `references/comprehension-protocol.md` — 5 gates for understanding before encoding (Locate, Represent, Minimize, Falsify, Regenerate)
- `references/confusion-triage.md` — 5 kinds of stuck + matched moves
- `references/heuristic-palace.md` — 6 rooms + 4 wings, ~50 loci for problem-solving (now integrates TRIZ Ideality + 4 Separation loci + matrix lookup)
- `references/domain-patterns.md` — pattern libraries for algorithms, proofs, debug, design, biases
- `references/triz.md` — Condensed TRIZ (Ideality + 4 Separation Principles + top 20 Inventive Principles + 12×12 Contradiction Matrix)
- `references/metacognitive-checklist.md` — self-audit at 4 checkpoints + 9 self-deception patterns

### Numeric
- `references/major-system.md` — Full 00–99 Major System table
- `references/pao.md` — PAO 10×10×10 (people / actions / objects)
- `references/sem3-full.md` — Full 100-entry SEM3 table (all categories × items)
- `references/binary-hex.md` — Unified elemental system for hex 0–F, 4-bit, and 8-bit
- `references/encoding-examples.md` — Worked examples for numeric encoding

### Non-numeric
- `references/concept-encoding.md` — NEDF protocol for concepts and definitions
- `references/procedure-encoding.md` — SPEAR protocol for algorithms, processes, proof sequences (5 slots: Scene, Preconditions, Execution, Alternatives, Repair; 3 styles: causal chain, spatial path, recursive)
- `references/formulas.md` — Formula / symbolic encoding (Greek letters, operators, structural zones)
- `references/georgian-system.md` — 33-letter Georgian system (nodes, calendar, 33-slot peg)
- `references/calendar-time-memorization.md` — Full date + weekday + event lines; hour-of-day rings; worked clock-timeline deck
- `references/bible-memorization.md` — Scripture **book order** (worked 66-book palace example; canon-aware)
- `references/lecture-listening-notes.md` — **Live lectures:** semantic listening + note template + delayed encoding (links Semantic Reading + Active Listening)
- `references/cast-system.md` — CAST edges + graph encoding across domains (code, math, history, argument)

### Operational
- `references/mind-palace.md` — **Domain memory palaces**: palace vs locus, real vs imagined, benefits/weaknesses, when to use vs flat indexing, structure diagrams, CAST graph embedding, lifecycle (Heuristic Palace stays separate: `references/heuristic-palace.md`)
- `references/zero-loss-forced-recall.md` — **ZLP + FRS**: physical zero-loss (encode on every drop) + forced recall for obligations (Today Core + triggers)
- `references/retrieval-protocol.md` — Anki card templates + palace-walk cadence + weak-link repair
- `references/collisions.md` — Cross-system image-collision rules and disambiguation policy
- `references/measurement-framework.md` — 6 dimensions + 7 belt ranks + LPQ composite, read from METER's event log + daily/weekly/monthly/quarterly cadence

---

## STEAM / STEMM examples (quick index)

**Mind palace (domain storage):** [mind-palace.md](./mind-palace.md) · STEAM drill rows: [steam-stemm-examples.md — Mind Palace](./steam-stemm-examples.md#appendix-mind-palace).

Subsystem appendices (each section has **3× Science, Technology, Engineering, Arts, Math, Medicine**): [Comprehension](./steam-stemm-examples.md#appendix-comprehension-protocol) · [Confusion triage](./steam-stemm-examples.md#appendix-confusion-triage) · [Heuristic Palace](./steam-stemm-examples.md#appendix-heuristic-palace) · [Domain patterns](./steam-stemm-examples.md#appendix-domain-patterns) · [TRIZ](./steam-stemm-examples.md#appendix-triz) · [Metacognitive checklist](./steam-stemm-examples.md#appendix-metacognitive-checklist) · [NEDF](./steam-stemm-examples.md#appendix-nedf) · [SPEAR](./steam-stemm-examples.md#appendix-spear) · [Formula encoding](./steam-stemm-examples.md#appendix-formula-encoding) · [CAST + Georgian](./steam-stemm-examples.md#appendix-cast-and-georgian-nodes) · [Georgian system](./steam-stemm-examples.md#appendix-georgian-system) · [Major](./steam-stemm-examples.md#appendix-major-system) · [PAO](./steam-stemm-examples.md#appendix-pao) · [SEM3 + Major](./steam-stemm-examples.md#appendix-sem3-and-major) · [Peg matrix](./steam-stemm-examples.md#appendix-peg-matrix) · [Binary / hex](./steam-stemm-examples.md#appendix-binary-and-hex) · [Encoding examples](./steam-stemm-examples.md#appendix-encoding-examples) · [Retrieval protocol](./steam-stemm-examples.md#appendix-retrieval-protocol) · [Collisions](./steam-stemm-examples.md#appendix-collisions) · [Measurement](./steam-stemm-examples.md#appendix-measurement-framework) · [NAVIGATOR](./steam-stemm-examples.md#appendix-navigator) · [Onboarding](./steam-stemm-examples.md#appendix-onboarding-path) · [CAST beginner bilingual](./steam-stemm-examples.md#appendix-cast-beginner-bilingual) · [Design orientation](./steam-stemm-examples.md#appendix-design-orientation).
