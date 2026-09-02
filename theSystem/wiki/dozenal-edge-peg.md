---
palace: meta-knowledge
level: 6
domain: 10
room: TBD
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/dozenal-edge-peg.md
---

# Dozenal Edge-Peg — the 12 edges as self-addressing base-12 digits

**Summary**: A promoted spoke of [cube-as-calculator](./cube-as-calculator.md) Anchor 5. It fixes an *addressing* order on the cube's 12 edges so each dozenal digit **self-describes its own edge**: `digit = 4·axis + position`, where `axis = digit ÷ 4` names the direction the edge runs (0 = x / across, 1 = y / up, 2 = z / through) and `position = digit mod 4` is a 2-bit transverse address (the two coordinates the edge does *not* span). This is the retrieval/peg lens on the edges; it is **distinct from** the owner page's ring-walk order, which is the arithmetic lens (rotate one step = add one). Sibling to the vertex 3-bit encoding in [cube-as-calculator](./cube-as-calculator.md) Anchor 4.

**Sources**:
- User-proposed (2026-07-04 conversation) — started from "6 sides → dozenal?", corrected to "12 edges → dozenal", then designed as a self-addressing peg
- [cube-as-calculator](./cube-as-calculator.md) — owner of Anchor 5 (edges as dozenal) and the canonical arithmetic ring-walk order this page defers to
- [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) for V=8, E=12, F=6 and the Euler invariant V−E+F=2
- [rubiks-cube-palace](./rubiks-cube-palace.md) for the orientation-lock (Phase 0) convention reused here

**Last updated**: 2026-07-04 — initial page. Companion diagram `Excalidraw/Dozenal_Edge_Peg.excalidraw.md`.

---

## Why the edges, not the faces

The opening intuition ("a Rubik's cube has 6 sides, connect it to dozenal?") points at the wrong feature. **6 faces → base 6** (senary), not 12. The clean dozenal anchor is the cube's **12 edges**. The cube actually offers a small ladder of bases on one solid — cite [cube-as-calculator](./cube-as-calculator.md) for the full seven-anchor accounting:

| Feature | Count | Natural base |
|---|---|---|
| Faces | 6 | senary (base 6) |
| Vertices | 8 | octal (base 8) / 3-bit binary |
| **Edges** | **12** | **dozenal (base 12)** |

And **12 = 2²·3** is *why* dozenal is worth wanting — it divides by 2, 3, 4, and 6. The cube hands you that factorization physically: the 12 edges split into **3 axes × 4 parallel edges**. That `3 × 4` is the backbone of this page.

---

## The addressing rule — `digit = 4·axis + position`

Lock the same orientation convention as [cube-as-calculator](./cube-as-calculator.md) Phase 0 and [rubiks-cube-palace](./rubiks-cube-palace.md): **x = left→right, y = bottom→top, z = back→front**. Never re-derive per session.

Every edge runs parallel to exactly one axis, so it is fully specified by two things:

1. **Which axis it spans** — 3 choices → the high part of the digit (`4·axis`):
   - `axis 0` = **x-edges** (run *across*) → digits **0 1 2 3**
   - `axis 1` = **y-edges** (run *up*, the 4 vertical edges) → digits **4 5 6 7**
   - `axis 2` = **z-edges** (run *through*, front↔back) → digits **8 9 X E**
2. **Where it sits** — the two coordinates it does *not* span form a 2-bit **transverse address** `position = 2·c₁ + c₀ ∈ {0,1,2,3}` → the low part of the digit.

Read it back: given a digit `d`, `axis = d ÷ 4` tells you the direction, `position = d mod 4` tells you which of the four parallel edges. The digit **is** the edge's address — no lookup table.

`X` = **dek** (ten) and `E` = **el** (eleven) — the ASCII dozenal glyphs. (The owner page uses the Pitman `↊ ↋` for the same two values; this page uses `X E` for keyboard-drillability. Same values, cite [cube-as-calculator](./cube-as-calculator.md) §"Dozenal digit characters" open follow-up — glyph choice is still unsettled wiki-wide.)

This is the **edge-analogue of the vertex encoding**: [cube-as-calculator](./cube-as-calculator.md) Anchor 4 addresses each *vertex* by a 3-bit coordinate `(x,y,z)`; this page addresses each *edge* by `(spanning-axis, 2-bit transverse)`. One extra structural fact — an edge fixes 2 coordinates and frees 1 — turns the 12 edges into a clean mixed-radix `3×4` address space.

---

## Two orderings, two jobs — do not conflate

This is the load-bearing distinction, and the reason this page does **not** redefine the owner's ordering:

| Lens | Order | Optimized for | Owner |
|---|---|---|---|
| **Arithmetic ring** | top-ring → vertical-ring → bottom-ring (a 12-cycle walk) | *rotation IS addition* — step one edge = `+1`, carry fires crossing zero | [cube-as-calculator](./cube-as-calculator.md) Anchor 5 |
| **Address peg** (this page) | 3 axes × 4 transverse | *the digit names its own edge* — direct O(1) placement/retrieval of a pegged item | this page |

They **agree** on the vertical quartet (both call the 4 vertical edges digits 4–7) and **diverge** on the other eight: the ring-walk groups "the 4 edges bordering the top face" (which mix x- and z-directions), while the address peg groups "all 4 edges of one direction." Only the ring-walk can be the arithmetic order (a walk must be a single cycle); the address peg is not a cycle and makes no claim on carry semantics.

**Rule of use**: pegging content to edges (mnemonics, retrieval) → use this page's address peg. Doing base-12 arithmetic with carries → use [cube-as-calculator](./cube-as-calculator.md) Anchor 5's ring-walk. Same 12 edges, two coordinate systems, chosen by task.

> **Open decision (flagged for the user, not yet resolved)**: whether to unify on a single edge ordering wiki-wide, or keep the arithmetic-ring / address-peg split permanently. Kept as an explicit fork per the collaboration convention that adopted schemes earn promotion through a deliberate falsifiable gate rather than by silent default (the same discipline [cube-as-calculator](./cube-as-calculator.md) uses for its candidate anchors).

---

## Worked placement

Peg the four items *apple · book · cup · drum* onto x-edges (digits 0–3), reading them off later by address:

- `apple` → digit **0** → axis 0 (x/across), position 0 = transverse `(y,z)=(0,0)` → the front-bottom across-edge
- `drum` → digit **3** → axis 0, position 3 = `(y,z)=(1,1)` → the back-top across-edge

To retrieve "what did I peg at digit 9?": `9 ÷ 4 = 2` → z-edge (through); `9 mod 4 = 1` → transverse `(x,y)=(1,0)` → the front-right through-edge. Walk your eye straight to it; no scan.

---

## METER integration

Two events under the `edge_peg::*` namespace, logged alongside PULSE state per [meter-overview](./meter-overview.md). These are *addressing* events — arithmetic events stay under `cube_calc::*` in [cube-as-calculator](./cube-as-calculator.md), keeping the two lenses measured separately.

| Event | Operational form | Floor | Working | Target |
|---|---|---|---|---|
| `edge_peg::digit_to_edge` | Given digit `d` (0–E), point at its edge on a physical cube via `axis = d÷4`, `position = d mod 4` | ≤3s / ≥90% | ≤5s / ≥80% | ≤2s / ≥95% |
| `edge_peg::edge_to_digit` | Given a physical edge, name its dozenal digit by reading its axis + 2-bit transverse | ≤4s / ≥85% | ≤6s / ≥75% | ≤3s / ≥95% |

**Escalation**: floor breach on either event for ≥3 consecutive sessions → the orientation lock (Phase 0) has drifted; re-anchor before drilling. Persistent `edge_to_digit` breach with clean `digit_to_edge` → the transverse-bit convention (`position = 2·c₁ + c₀`) is inconsistent between sessions; write it on the cube.

---

## Mnemonic

**Phrase**: *"Across the floor (0–3), Up the walls (4–7), Through the deep (8–E)."*

Three verbs bind the three axes to the three digit-quartets in order: **Across** = x-edges = 0–3, **Up** = y-edges (vertical) = 4–7, **Through** = z-edges (depth) = 8–E. The verb recovers the quartet; the `4·axis` offset falls out of the quartet index (across = 0th, up = 1st, through = 2nd → ×4).

---

## Memory checksum

Recite cold in ≤15s:

1. **Edges, not faces** — 12 edges → dozenal; 6 faces would only be senary (cite [cube-as-calculator](./cube-as-calculator.md)).
2. **The rule** — `digit = 4·axis + position`; invert as `axis = digit ÷ 4`, `position = digit mod 4`.
3. **Axis map** — 0 = across (x), 1 = up (y), 2 = through (z); quartets 0–3 / 4–7 / 8–E.
4. **Transverse** — position is the 2-bit code of the two coordinates the edge does *not* span.
5. **Two orderings** — this is the *address* peg; arithmetic uses the *ring-walk* in [cube-as-calculator](./cube-as-calculator.md); they agree only on 4–7.

**Cold self-test** (physical cube, no notes, ≤45s): (a) point at digit `E`'s edge; (b) name the digit of the front-bottom across-edge (answer 0); (c) state why the cube's 6 faces are *not* the dozenal anchor. All three inside 45s → encoded.

---

## Visual

Companion diagram: **`Excalidraw/Dozenal_Edge_Peg.excalidraw.md`** (open in the Obsidian Excalidraw view). An isometric cube with all 12 edges color-coded by axis (x = red 0–3, y = blue 4–7, z = green 8–E), each edge badged with its dozenal digit; the three edges occluded at the back corner are drawn dashed. The legend panel prints the `digit = 4·axis + position` rule and the 6→8→12 (senary → octal → dozenal) ladder.

Cold-recall ASCII glyph:

```
            3 (E)···········
           /:               /|
        X /  :            E / |
         /   : 7          /  7
        ·····1············   |
        |    :           |   |
        4    ·····2·····  5   ·
        |   / (6)        |  / 9
        | 8/  (dashed)   | /
        ·······0··········
      x-edges 0-3 (red)   across
      y-edges 4-7 (blue)  up
      z-edges 8-E (green) through
      digit = 4*axis + position
```

Glyph self-test: shown only the image, the reader should reconstruct the three quartet assignments (0–3 across, 4–7 up, 8–E through) and the `4·axis+position` rule. If either is not recoverable from the glyph, redesign.

---

## Related pages

- [cube-as-calculator](./cube-as-calculator.md) — parent hub; owner of Anchor 5 (edges as dozenal) and the arithmetic ring-walk order this page defers to; also owner of the sibling vertex 3-bit encoding (Anchor 4)
- [rubiks-cube-palace](./rubiks-cube-palace.md) — shares the orientation-lock (Phase 0); uses the same cube as sticker-grid storage rather than an edge address space
- [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) — owner of V/E/F counts (8/12/6) and Euler V−E+F=2
- [braille-face-peg](./braille-face-peg.md) — the face-level sibling of this page; addresses the 6 faces (Braille dot / die / cube / peg) as this addresses the 12 edges
- [mnemonic-methods-master](./mnemonic-methods-master.md) — peg-system family this addressing scheme joins
- [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) — related peg-remapping technique
- [METER](./meter-overview.md) — owner of the measurement schema; `edge_peg::*` namespace registered here
- [skill-progression-stages](./skill-progression-stages.md) — owner of the drill/automaticity stage counts
