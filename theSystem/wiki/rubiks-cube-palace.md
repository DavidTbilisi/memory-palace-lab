---
palace: meta-knowledge
level: 8
domain: 10
room: 6
semantic_mode: 5
wiki_source: wiki/learning-systems/rubiks-cube-palace.md
---

# Rubik's Cube Palace

**Summary**: Aphantasia-native palace architecture that replaces "invent a new furnished room per topic" with "every room is the same 3×3 grid, only the color and topic differ." 6 face-rooms × 8 shelves per room = 48 storage cells + 6 topic-anchor centers. Loci are uniform across rooms, the center cell holds the topic context, the corner/edge geometry gives a free 2-tier importance ranking, and cubie adjacency gives free cross-references between rooms. Built as a child of [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) and as a peer architecture to [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) (different shape, different material — not a replacement).

**Sources**:
- User-proposed architecture (2026-05-16 conversation)
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) for the "bare floor-plan over furnished room" principle
- [trigonometry-compass-palace](./trigonometry-compass-palace.md) / [unit-circle-as-compass](./unit-circle-as-compass.md) / [quadrant-sign-patterns](./quadrant-sign-patterns.md) for the per-face compass composition
- Standard cubing notation (R/L/U/D/F/B; cubie-as-corner/edge/center taxonomy)

**Last updated**: 2026-05-16

---

## Why this palace exists

Standard memory-palace literature pushes *furnished, distinctive* rooms — doorway, window, painting, fireplace — because typical imagers get free sensory hooks from the visual variety. For aphantasic users that backfires: you can't render the furniture anyway, so the "distinctiveness" is wasted overhead and you have to remember *both* the items and *where the doorway is* in each room. Per-room layout invention is pure cognitive tax.

The Rubik's cube replaces "invent a new floor plan per room" with **one uniform layout repeated six times**, where the variability is moved out of geometry (which an aphantasic can't render) into face identity (a color label + a topic word). This is the [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) "bare floor-plan over furnished room" principle taken to its logical limit.

Three structural properties make the cube specifically aphantasia-native, not just incidentally usable:

1. **Uniform 3×3 grid per room** — no per-room layout to memorize.
2. **Center cell as context switcher** — centers are the only stable cells on a real cube; reserving them for topic-identity matches the underlying geometry.
3. **Finger-trackable** — spatial cognition is preserved in aphantasia (Dawes et al. 2020); finger-on-grid is the strongest available retrieval cue, and it works without imagining anything.

## Architecture overview

```
            [ Up   face ]
            5.1  5.2  5.3      ← top row of Up face
            5.4  5.5  5.6
            5.7  5.8  5.9
[L][L][L]  [F][F][F]  [R][R][R]  [B][B][B]
[L][L][L]  [F][F][F]  [R][R][R]  [B][B][B]
[L][L][L]  [F][F][F]  [R][R][R]  [B][B][B]
            [ Down face ]
            6.x ...
```

- **6 face-rooms**, each addressed by a face label (U / D / L / R / F / B) or a color (white / yellow / orange / red / green / blue) or a topic word — all three address the same room.
- **9 cells per face**, numbered 1–9 in reading order (left-to-right, top-to-bottom).
- **Center cell = 5** = topic anchor (one per face, fixed, never holds an item).
- **8 outer cells** = storage shelves, split into:
    - **Corners** (cells 1, 3, 7, 9) — primary items (4 per room)
    - **Edges** (cells 2, 4, 6, 8) — supporting items (4 per room)
- **Address format**: `face.cell` (e.g. `R.3` = right face, top-right corner; `U.5` = up face, topic).

Total capacity: **48 storage cells + 6 topic anchors** per cube. Past the 48-item cap, you spin up a second cube (chapter palace) rather than overpacking.

## Encoding rules

### Phase 0 — one-time setup

1. **Fix the orientation.** Pick which color sits on each face and lock it. Standard Western: white=U, yellow=D, green=F, blue=B, red=R, orange=L. Any orientation works; consistency is the point.
2. **Work from the unfolded net, not the 3D cube.** All 54 cells visible at once on a flat layout. Aphantasia preserves spatial cognition but not mental rotation — a flat net keeps every cell visible without rotating an imagined object. Print it on paper if needed; the palace is allowed to be a physical artifact.
3. **Assign one topic per face. Six topics maximum.** If your domain has more than 6 sub-topics, you need a second cube, not a bigger one. Treat the cap as a forcing function for clean decomposition.
4. **Write the topic name into each center cell.** Center is the context switcher.

### Phase 1 — addressing (learn once)

5. **Number every face the same way**, reading order:

```
1 2 3
4 5 6     ← cell 5 is always the topic
7 8 9
```

  - Corners: 1, 3, 7, 9
  - Edges: 2, 4, 6, 8
  - Center: 5 (topic)

6. **Address every item as `face.cell`.** Dotted-decimal is unambiguous, parseable, and the face token already carries color + topic context for free.

### Phase 2 — corner/edge convention

7. **Corners hold primary items. Edges hold supporting items.** Free 2-tier ranking baked into the geometry. Stops over-packing.
8. **Use a fixed walk order, same across every room.** Recommended: corners clockwise from top-left (1 → 3 → 9 → 7), then edges clockwise from top (2 → 6 → 8 → 4). Same walk in every room means you build one habit, not six.

### Phase 3 — placing an item

9. **To encode an item:** pick its home face → decide corner or edge → take the next empty cell in your fixed walk order → write the label at `face.cell` → rehearse by **pointing at the cell** with your finger while saying the label aloud.

10. **Don't rearrange. Ever.** New items go into the next empty cell. Rearranging breaks every retrieval path built so far.

### Phase 4 — retrieval

11. **To recall a topic:** name the face → land on center (verbalize topic) → walk the 8 cells in your fixed order, finger-pointing at each, retrieving the label at each cell.
12. **To recall a specific item:** address it directly by `face.cell`. No walk needed when you already know the address.

### Phase 5 — cross-topic items (advanced)

13. **Items belonging to 2 topics live on edge-cubies.** An edge-cubie has 2 stickers on 2 adjacent faces. Place the item where it's reachable from both rooms.
14. **Items belonging to 3 topics live on corner-cubies.** A corner-cubie has 3 stickers on 3 adjacent faces — free 3-way cross-link.

### Phase 6 — growth and failure

15. **8 items per room cap.** When a room fills, options: (a) sub-cube (the cell becomes a pointer to another cube), (b) promote to a different cube, or (c) cull the least load-bearing item.
16. **If a room consistently fails retrieval, the assignment is wrong.** Run [METER](./meter-overview.md) per-face. If one face's recall is <70% after fair rehearsal, re-split — the topic was probably too broad.

---

## Composition with NEDF

The cube composes with [NEDF](./nedf-overview.md) in two distinct ways depending on item density:

### Mode A: one cell = one NEDF card (compact)

Each corner or edge cell holds **one complete NEDF card**. The face provides the topic context (Essence backdrop); the cell position provides the Name-hook (location *is* the perceptual anchor — no scene needs to be imagined). The Distinguisher and Failure ride on the cell's notes, or on the adjacent cells' relationships:

| NEDF slot     | Cube binding                                                                |
| ------------- | --------------------------------------------------------------------------- |
| Name-hook     | `face.cell` location (spatial, finger-trackable)                            |
| Essence       | Item label + face topic context (cell text + color + center word)           |
| Distinguisher | Corner-vs-edge tag + neighbor cell's content (the next item in walk order)  |
| Failure       | Note attached to the cell, retrievable on the same finger-point             |

This is the basic mode. 48 NEDF cards per cube.

### Mode B: one cubie = one NEDF composite locus (rich)

This is the **distinct unlock** that flat palaces don't offer. A corner cubie has **3 face-stickers** at one physical position. Place an NEDF card's slots across the 3 stickers:

| Sticker                | NEDF slot                                |
| ---------------------- | ---------------------------------------- |
| Sticker on face A      | Name-hook (in face-A's topic context)    |
| Sticker on face B      | Essence (in face-B's topic context)      |
| Sticker on face C      | Distinguisher (in face-C's topic context)|
| Cubie itself           | Failure (the cubie's identity)           |

The same NEDF card is now reachable from any of 3 face-walks. 8 corner-cubies per cube = 8 "rich" cards with built-in 3-way cross-linking. Edges (12 cubies × 2 stickers) work the same way with the 2-slot version (Name-hook + Essence on the two stickers, Distinguisher/Failure as cell notes).

**When to pick A vs B:** Mode A for high-volume material (48 cards, one topic each). Mode B for high-cross-cutting material where the same concept legitimately lives in multiple topics (e.g. *recursion* appears in OOP, algorithms, and type theory rooms simultaneously).

---

## Composition with the compass palace

This is the strongest cross-encoder unlock the cube produces.

**Each face is a complete 8-direction compass + origin.**

| Cube position | Compass binding              | [trigonometry-compass-palace](./trigonometry-compass-palace.md) anchor |
| ------------- | ---------------------------- | -------------------------------------- |
| Cell 5 (center) | Origin                     | (0, 0) / unit circle's center          |
| Cell 2 (top edge)    | North / 90°            | "nose"                                 |
| Cell 6 (right edge)  | East / 0°              | "eat cookies"                          |
| Cell 8 (bottom edge) | South / 270°           | "soup"                                 |
| Cell 4 (left edge)   | West / 180°            | "wet milk"                             |
| Cell 3 (top-right corner)    | NE / 45° / Q1   | "straw"                                |
| Cell 1 (top-left corner)     | NW / 135° / Q2  | "sick nose"                            |
| Cell 7 (bottom-left corner)  | SW / 225° / Q3  | "man in soup"                          |
| Cell 9 (bottom-right corner) | SE / 315° / Q4  | "cookie in milk"                       |

The mapping is exact: 1 center + 4 edges + 4 corners = 1 origin + 4 cardinals + 4 diagonals = a complete 9-point compass. **No leftover cells, no missing directions.** The cube's 3×3 face geometry and the compass's 9-point structure are the same shape.

This means **6 independent compasses** are available per cube — one per face. Worked example below uses one face for the unit circle; subsequent faces can hold derived trig functions (sin / cos / tan / cot / sec / csc), or angle tables at special values, or hyperbolic functions, etc.

**Sign-pattern inheritance**: the 4 corner cells already carry their quadrant identity from the compass mapping. [quadrant-sign-patterns](./quadrant-sign-patterns.md)'s (++ / −+ / −− / +−) signs ride on corners 3 / 1 / 7 / 9 with no extra encoding work.

**Eye-movement layer**: [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) adds gaze direction as an embodied retrieval channel. On a physical cube held in the hand, gazing at a corner *is* the retrieval move — three aphantasia-intact channels (finger + gaze + spatial position) stack on one cell.

**Status**: this is the first **confirmed composition** the cube produces, by structural fit alone. Promoting from candidate to confirmed in [composability-index](./composability-index.md) after the first worked instance below.

---

## Composition with CAST

The cube's **cubie-adjacency graph** is a free 26-node, ~96-edge graph substrate ready to host [CAST](./cast-overview.md) structures:

- 26 cubies = 26 [node](./georgian-animals.md) slots (8 corners + 12 edges + 6 centers)
- Adjacency = edge sharing between cubies (each corner cubie has 3 edge-cubie neighbors; each edge cubie has 2 corner + 2 corner neighbors across the face; centers connect to 4 edges)
- Direction = the cube's face-color convention provides direction tags for free

This is most useful when a CAST graph has natural 3-/2-/1-tier node importance (matches corner/edge/center) and ≤26 nodes. For larger graphs, the cube becomes a constraint that drives clean decomposition — same effect as the 6-topic face cap.

**Failure mode specific to this composition**: trying to force an arbitrary graph onto the cube's fixed topology. The cube's adjacency is not user-chosen; it's a fixed structure. If your graph's natural shape doesn't roughly match cube topology, use a free-form palace instead.

---

## Composition with SPEAR

Cube notation (R, U, F, L, D, B + ′ + 2) is itself a procedure grammar — a small, standardized move vocabulary. For [SPEAR](./spear-overview.md) procedure encoding, a sequence of cube-notation moves becomes a **walk path** through the palace:

| SPEAR slot    | Cube binding                                                |
| ------------- | ----------------------------------------------------------- |
| Scene         | The starting face + cell                                    |
| Preconditions | The cells visited *before* this step (the path-so-far)      |
| Execution     | The move sequence (e.g. `R.3 → U.1 → F.7`)                  |
| Alternatives  | Branching at a face-edge (turn left vs right)               |
| Repair        | Backtrack one move; the path is reversible                  |

The unlock: procedures encoded this way are **finger-walkable** — you can rehearse a procedure by physically tracing the path on a printed net or a physical cube, no scene-rendering required. Aphantasia-native procedure encoding.

---

## Composition with the Major System

Every `face.cell` address is a 2-digit number (11 through 69 — really 1.1 through 6.9, treated as 11, 12, ..., 19, 21, ..., 69). That's **54 distinct 2-digit numbers**, each of which the Major System encodes as a phonetic word.

Example mappings (using standard Major: 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=ch/j/sh, 7=k/g, 8=f/v, 9=p/b):

| Address  | Major number | Phonetic word example   |
| -------- | ------------ | ----------------------- |
| `F.1`    | 31           | "mat" / "mud"           |
| `F.5`    | 35           | "mail" / "mole"         |
| `R.3`    | 43           | "ram" / "room"          |
| `U.7`    | 57           | "lock"                  |
| `B.9`    | 69           | "ship" / "chip"         |

This gives **every cell a free verbal mnemonic** derived from its address. Combined with face color + topic word, every cell has three independent identity channels — color, topic, phonetic word — none of which require visual imagery. **Strong aphantasia composition**; consider building this into a permanent Major-word overlay for the cube once an instance is in use.

**Status**: candidate, worth building. Register in [composability-index](./composability-index.md).

---

## Composition with the peg-audio-visual matrix

[peg-audio-visual-matrix](./peg-audio-visual-matrix.md) gives a pre-encoded image for every 2-digit number 00–99 (audio rhyme-peg × visual peg). Since `face.cell` = 2-digit number, every cube cell can **inherit a pre-encoded peg image** without inventing new content.

| `face.cell` | Number | Inherits peg-matrix image |
| ----------- | ------ | -------------------------- |
| `F.1`       | 31     | matrix cell `31`           |
| `R.5`       | 45     | matrix cell `45`           |
| `B.9`       | 69     | matrix cell `69`           |

This is a free **shared-substrate** move: the cube borrows the existing peg-matrix's image library instead of building its own. Items placed at `face.cell` can be encoded as scenes between the peg image and the item label — saving the encoding cost of inventing 48 fresh location-images.

**Note**: cells with units digit 0 (none in cube — cells are 1–9) and tens digit 0 (none — faces are 1–6) are unused, so only 54 of 100 peg-matrix cells get borrowed. The other 46 stay available for non-cube use.

**Status**: candidate, worth building. Register in [composability-index](./composability-index.md).

---

## Compositions that do NOT fit cleanly

For completeness, encoders that don't compose well with the cube and why:

| Encoder    | Why no fit                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------- |
| [HEART](./heart-overview.md)   | 4 rooms per person doesn't match 8 cells per face or 6 faces per cube. Force-fit only.              |
| [GRACE](./grace-overview.md)   | 5 slots vs 6 faces / 8 cells — off-by-one in every dimension. Force-fit only.                       |
| [calendar-memory](./calendar-memory.md)         | 12 months, 24 hours, 60 minutes — none of these divisors match 6, 8, 9, or 48.                      |
| [REMAPS](./remaps.md)          | 6 moves × 6 faces is tempting, but Sensations is degraded under aphantasia — the user this palace is built for. Use REMAPS independently rather than face-bound. |

Don't force these. The cube is one tool, not all tools.

---

## Worked example: Unit Circle on the green face

Concrete instance of the compass composition. Pick the green face (F = front) and assign topic "Unit Circle." This is your first compass.

```
F.1: NW / 135°    F.2: N / 90°     F.3: NE / 45°
  Q2: (sin>0,        sin=1,           Q1: (sin>0,
       cos<0)        cos=0             cos>0)
  "sick nose"       "nose"           "straw"
   (-√2/2, √2/2)   (0, 1)           (√2/2, √2/2)

F.4: W / 180°     F.5: ORIGIN      F.6: E / 0°
  sin=0,           "Unit             sin=0,
  cos=-1            Circle"          cos=1
  "wet milk"                         "eat cookies"
   (-1, 0)         (0, 0)            (1, 0)

F.7: SW / 225°    F.8: S / 270°    F.9: SE / 315°
  Q3: (sin<0,       sin=-1,          Q4: (sin<0,
       cos<0)       cos=0             cos>0)
  "man in soup"    "soup"           "cookie in milk"
   (-√2/2, -√2/2)  (0, -1)          (√2/2, -√2/2)
```

Reading rules:
- Cell 5 is always the topic; never holds a data point.
- 4 edges (2, 4, 6, 8) hold the four cardinal angles — exact values, axis-aligned, sign pattern is "one zero, one ±1".
- 4 corners (1, 3, 7, 9) hold the four diagonal angles — `(±√2/2, ±√2/2)`, sign pattern matches the quadrant.

To recall sign behavior at 225°: finger lands on `F.7` (bottom-left corner) → quadrant Q3 → both negative → `(−√2/2, −√2/2)`. No formula needed, no imagery needed, just spatial-position + label retrieval.

**Next faces extend the same compass to derived functions**: yellow face (D, "Sine Function") holds sin values at the same 8 angles; red face (R, "Cosine Function") holds cos values; blue face (B, "Tangent Function") holds tan values; orange face (L, "Special Triangles") holds 30° / 45° / 60° reference triangles; white face (U, "Identities") holds the core identities (sin²+cos²=1, double-angle, sum-difference).

One cube = a full trig fact base, retrievable by finger-walk, zero scene-imagery required.

---

## Failure modes

1. **Rearranging cells.** Breaks every existing retrieval path. Hard-rule: once placed, never moved.
2. **Treating the cube as scrambled instead of fixed.** A scrambled cube is not a palace — only the *solved* (canonical) cube is. Cubies' positions must be stable to act as loci.
3. **Forcing a 7th topic.** When a domain has 7+ natural sub-topics, the temptation is to merge two onto one face. Don't — use a second cube. The 6-cap is a feature.
4. **Skipping the center.** Tempting to use all 9 cells for items. Don't — the center's job is context-switching, and recall accuracy on the surrounding 8 drops measurably when the center isn't reserved for the topic.
5. **Mismatched orientation between rehearsals.** If you sometimes have white-up and sometimes have green-up, addresses become ambiguous. Lock orientation in Phase 0 and never re-orient.
6. **Wrong taxonomy on the corners.** Putting equally-weighted items on corners *and* edges defeats the free 2-tier ranking. If everything is "primary," nothing is. Force the corner/edge distinction even when it feels arbitrary — the constraint surfaces real importance asymmetries.
7. **Over-using cubie cross-linking before the basic palace works.** Phase 5 is advanced. The basic 48-cell version must be retrieval-fluent before adding cubie cross-links, or you'll lose track of which mode each item is in.

---

## When NOT to use the cube palace

- **Raw 0–99 indexed lists** (π digits, phone numbers, atomic numbers up to 100) — [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) dominates on every axis. 100 cells > 48, and pure-numeric addressing matches the material.
- **Single large flat ontology** (e.g. all 4000 Greek New Testament words) — the 6-topic cap is the wrong shape. Use a chapter-based palace.
- **Procedures with >8 steps and no natural sub-procedures** — would have to span multiple faces, breaking the walk-as-procedure property. Use MPL / [SPEAR](./spear-overview.md) standalone.
- **Material that explicitly requires vivid sensory scenes** — full-imagery users may prefer furnished palaces. The cube's whole point is to skip scene-rendering; users who *can* render scenes lose a recall channel they'd otherwise have.

The cube is for **structured material that decomposes into 6 topics × 8 items with a clean 4-primary / 4-supporting split per topic, where the user is aphantasic or wants finger-trackable retrieval**.

---

## Open follow-ups

1. **Major System overlay**: build a permanent table of `face.cell → Major word` for all 54 cells, file as sub-page. (composition #5 above)
2. **Peg-matrix overlay**: build a permanent table of `face.cell → peg-matrix cell` for the 54 borrowed cells. (composition #6)
3. **Sub-cube pointers**: define the syntax for "this cell points to another cube." First instance once any face hits the 8-item cap.
4. **Physical cube vs printed net vs mental cube**: practitioner write-up of which mode wins under which condition. Hypothesis: printed net for encoding (everything visible), physical cube for retrieval drills (motoric channel active), mental cube only after both are fluent.
5. **Cube-notation SPEAR drills**: drill ladder for treating a sequence of cube moves as a runnable procedure. (composition #4)
6. **First non-trig worked instance**: pick a second domain (Java vocabulary? AWS service families? Bible book groupings?) and lay it out to test whether the 6×8 shape generalizes. The trig instance fits suspiciously well — needs at least one harder fit to confirm the architecture isn't trig-specific.
7. **Aphantasia-friendly center-cell convention**: the center holds *a word*, not a scene. But should it also hold a color name? An emoji? A Major word for the face-number? Settle this on the first concrete instance.

---

## Related pages

- [number-codec-ladder](./number-codec-ladder.md) — the *other* cube system: cube-as-digit (soroban column-state percepts for numbers), orthogonal to this page's cube-as-palace (storage geometry); the disambiguation lives there. Its deep-pack journeys can be hosted in this palace's cells without the roles mixing
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) — parent constraint-aware reading; this page is a concrete instantiation
- [Memory Palace](./memory-palace-architecture-for-neural-os.md) — general palace architecture; this is one specific shape under it
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — peer architecture (different shape, different material); composition #6 borrows its image library
- [trigonometry-compass-palace](./trigonometry-compass-palace.md) — the compass palace that composes one-to-one with each cube face
- [unit-circle-as-compass](./unit-circle-as-compass.md) — owner of the 8-direction compass concept
- [quadrant-sign-patterns](./quadrant-sign-patterns.md) — sign-pattern inheritance on the 4 corner cells
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) — adds gaze as a third aphantasia-intact retrieval channel
- [NEDF](./nedf-overview.md) — Mode A and Mode B composition; cubie-as-composite-locus is the distinct unlock
- [CAST](./cast-overview.md) — cubie-adjacency graph as substrate
- [SPEAR](./spear-overview.md) — cube notation as procedure grammar
- mpl-syntax — alternative palace description language; cube palace expressible in MPL
- [motoric-encoding-systems](./motoric-encoding-systems.md) — finger-on-grid is the motoric retrieval channel this palace relies on
- [representation-rules](./representation-rules.md) — the "how to fill the slots" rules underneath all framework slots
- [composability-index](./composability-index.md) — registry where the compass × cube and other compositions are entered
- [METER](./meter-overview.md) — per-face accuracy measurement; pass-floor 70%
- [skill-progression-stages](./skill-progression-stages.md) — drill ladder placement for cube-walk automaticity (Lamp / Scale / Sword phases)
- [observer-inside-method](./observer-inside-method.md) — the egocentric/interior spatial frame; this palace independently takes its *fixed-landmark* half (Phase 0 orientation lock) but works from the flat net to skip the interior-rotation half (aphantasia-native)


---

## U — See (CAST)
1. 6-face Rubik's cube as a palace with 9 cells per face
2. 54 loci with rotation as traversal

## D — Name (NEDF)
1. Rubik's cube palace = 6-face × 9-cell palace
2. Distinguisher: rotations as traversal moves
3. Failure mode: treating faces as flat lists

## F — Do (SPEAR)
1. Pick face → assign domain
2. Walk by rotating cube mentally

## B — Watch (HEART)
1. Face-content collision
2. Rotation order drift

## L — Predict (ORACLE)
1. Domain → predict face
2. Cell → predict rotation path

## R — Act (GRACE)
1. New domain → assign face
2. Recall → rotate to face