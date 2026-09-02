---
palace: meta-knowledge
level: 6
domain: 10
room: TBD
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/cube-as-calculator.md
---

# Cube as Calculator — Seven Bases on One Physical Substrate

**Summary**: A single physical cube hosts seven independent base-N digit substrates — anchored on its 3 face-pair axes (ternary), 4 space diagonals (quaternary), 6 faces (senary), 8 vertices (octal / 3-bit binary), 12 edges (dozenal), 24 rotations (mod-24 / S₄-action), and 48 full symmetries (octahedral group with reflections) — all unified by one operation grammar: **rotation IS addition; composition IS multiplication**. Sister to [rubiks-cube-palace](./rubiks-cube-palace.md) (procedural storage on the 54-sticker grid), but operates the cube algebraically rather than freezing it. Carry semantics generalize one base-parameterized rule across all anchors; two cubes stack into positional notation in any chosen base.

**Sources**:
- User-proposed architecture (2026-06-02 conversation) — started from a dozenal 2-cube register with edge-12 ring, generalized after cube-framing audit
- [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) for V/E/F counts (8/12/6), Euler V−E+F=2, cube↔octahedron duality
- [rubiks-cube-palace](./rubiks-cube-palace.md) for orientation-locking discipline (Phase 0) and the disambiguator on what substrate this page does NOT touch
- [vedic-multiplication-nikhilam](./vedic-multiplication-nikhilam.md) for the complement-method substrate (opposite-face pair sum = 7 is Nikhilam in base 6)
- [hand-to-number-system](./hand-to-number-system.md) for the base-10 hand-bridge (the cube cannot host base 10 natively)
- [soroban-learning-method](./soroban-learning-method.md) for multi-rod positional notation as an alternate substrate
- Standard group-theory of the cube: rotation group of order 24 acts on 4 space diagonals as S₄; full symmetry group of order 48 is the octahedral group with reflections

**Last updated**: 2026-08-21 — §Bases that do NOT fit cleanly names [tile-as-calculator](./tile-as-calculator.md) as the uncontrived base-10 recovery, and states the trunk/branch partition from this side; 2026-06-02 — initial ingest. Anchor 7 (48 full symmetries) flagged advanced; isometric polyomino glyph drafted with Euler checksum on the glyph itself.

---

## Different from [rubiks-cube-palace](./rubiks-cube-palace.md) — one-paragraph disambiguator

The cube palace freezes the 6-face × 9-cell sticker grid in a fixed orientation, places memory items in cells, and **never rotates the cube** — orientation is locked in Phase 0 and the cube is a static storage frame. This page goes the other way: it ignores the 54 stickers entirely and anchors on the cube's 7 invariant feature-sets (axes, diagonals, faces, vertices, edges, rotations, full symmetries). Rotation is the *operation*, not a forbidden move. Same physical cube, **disjoint substrates** — neither page pulls on the other's grid. If you want to put items somewhere and walk to them, use [rubiks-cube-palace](./rubiks-cube-palace.md). If you want to do arithmetic in any base, use this page.

---

## The seven anchors

| # | Anchor | Count | Natural base | Role |
|---|---|---|---|---|
| 1 | Face-pair axes | 3 | Ternary (base 3) | 3-state digit per axis (x · y · z) |
| 2 | Space diagonals | 4 | Quaternary (base 4) | 4-state digit on corner-to-corner diagonals |
| 3 | Faces | 6 | Senary (base 6) / die | 6-state digit; opposite-face-pair sum = 7 supplies the Nikhilam complement |
| 4 | Vertices | 8 | Octal (base 8) / 3-bit binary | (x,y,z) ∈ {0,1}³ — vertex address *is* a 3-bit binary number; the 8 vertices *are* the digits 0–7 |
| 5 | Edges | 12 | Dozenal (base 12) | 12-position ring: top-4 → vertical-4 → bottom-4 |
| 6 | Rotations | 24 | Mod-24 / S₄-action | The 24 rotational symmetries; acts as S₄ on the 4 diagonals |
| 7 | Full symmetries | 48 | Octahedral group (advanced) | 24 rotations × 2 (with reflections) |

Cite [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) for V=8, E=12, F=6 and **Euler invariant V − E + F = 2** — the cube's structural self-test that ties three of the seven counts together.

---

## Anchor 1 — Face-pair axes as ternary (base 3)

The cube has **3 face-pair axes**: x (left↔right), y (bottom↔top), z (back↔front). Each axis has 3 states (one face on, opposite face on, both off / neutral) → one ternary digit per axis. Three axes → a 3-trit register (max value 26 in base 10).

**Use case**: cleanest base for compressed state where 0/+/− is natural (Knuth's balanced ternary). One cube = one base-3 register of 3 trits.

## Anchor 2 — Space diagonals as quaternary (base 4)

The cube has **4 space diagonals**, each running corner-to-corner through the cube's center. The rotation group acts on these 4 diagonals as S₄ (see Anchor 6) — meaning the diagonals form a natural index set for base-4 arithmetic. One cube = one base-4 digit.

**Use case**: any quaternary code (DNA bases A/C/G/T map naturally onto the 4 diagonals).

## Anchor 3 — Faces as senary (base 6, with Nikhilam complement)

The cube has **6 faces**. Label them 0..5 in any fixed orientation; one cube = one base-6 digit, like a die.

**Free Nikhilam structure**: on a standard die, opposite faces sum to 7 (1↔6, 2↔5, 3↔4). That's exactly the [Nikhilam complement](./vedic-multiplication-nikhilam.md) in base 6 (base − 1 = 5; the "complement of all from 5" applied to faces 0..5 wraps as 6 = 7−1). To get the complement of a face value, **read the opposite face**. Free fast-mental-math at the substrate level.

**Retrieval lens on this anchor**: [braille-face-peg](./braille-face-peg.md) fixes a self-describing address on these 6 faces (Braille dot N = die face N = cube face N = a peg), the face-level twin of [dozenal-edge-peg](./dozenal-edge-peg.md)'s edge address. It shows the 7-complement pairing here *is* the cube's three rotation axes, and coexists with Braille's reading-column pairing.

## Anchor 4 — Vertices as octal / 3-bit binary

This is the load-bearing anchor. The cube has **8 vertices**; placing the cube at the origin with vertices at (±½, ±½, ±½) and re-coordinating to {0,1}³ gives each vertex an address (x, y, z) ∈ {0,1}³. That address *is* a 3-bit binary number 000..111. Reading the same number as a single decimal digit gives octal 0..7.

| Vertex coord | Binary | Octal |
|---|---|---|
| (0,0,0) | 000 | 0 |
| (1,0,0) | 001 | 1 |
| (0,1,0) | 010 | 2 |
| (1,1,0) | 011 | 3 |
| (0,0,1) | 100 | 4 |
| (1,0,1) | 101 | 5 |
| (0,1,1) | 110 | 6 |
| (1,1,1) | 111 | 7 |

**Phase 0 — lock the convention** (matches [rubiks-cube-palace](./rubiks-cube-palace.md) Phase 0): x = left→right, y = bottom→top, z = back→front. Do not rederive per session.

**Consequence**: binary↔octal base conversion is free on this anchor — the same vertex *is* both representations. **Hex** is one extra bit beyond the cube; either pair two cubes (8 × 8 = 16 vertices addressable with one extra bit selecting which cube) or use a vertex + a parity flag.

## Anchor 5 — Edges as dozenal (base 12, with carry rule)

> Promoted spoke: [dozenal-edge-peg](./dozenal-edge-peg.md) owns the **addressing** view of these same 12 edges (`digit = 4·axis + position`, the digit self-describes its edge). This anchor keeps the **arithmetic** view below (the ring-walk, where rotating one edge = +1). Two orderings, two jobs — see that page's §"Two orderings, two jobs".

The cube has **12 edges**, naturally split into three rings of 4:
- **Top ring** (4 edges around the top face): top-N, top-E, top-S, top-W
- **Vertical ring** (4 edges connecting top corners to bottom corners): vertical-NE, vertical-SE, vertical-SW, vertical-NW
- **Bottom ring** (4 edges around the bottom face): bottom-N, bottom-E, bottom-S, bottom-W

**Canonical traversal order** (lock and stick): top-N → top-E → top-S → top-W → vertical-NE → vertical-SE → vertical-SW → vertical-NW → bottom-N → bottom-E → bottom-S → bottom-W → wrap back to top-N. That's a 12-position ring = one dozenal digit.

This is the user's original 2-cube register, generalized: D (low cube) holds the units digit; U (high cube) holds the twelves digit; carry fires when D crosses the zero-mark (top-N) clockwise.

**Worked example** (from the original session): `39₁₂ + 26₁₂`. D=9, add 6: 9→↊→↋→0→1→2→3 (D crosses zero once → carry 1). D ends at 3. U=3, add carry 1 then 2: 3→4→5→6. Final: **63₁₂** ✓ (45+30=75 decimal; 75 = 6·12 + 3).

## Anchor 6 — Rotations as mod-24 / S₄-action on the 4 diagonals

The cube's **rotation group has order 24**: identity (1) + face-rotations through 6 face-pairs × 3 non-trivial angles each (... but we double-count, so actually 6 × 3 = 18 rotations through face axes, but only 9 are distinct from the 3 axis families ...) — the standard accounting gives 24:

| Rotation type | Count |
|---|---|
| Identity | 1 |
| 90°, 180°, 270° about 3 face-axes | 3 × 3 = 9 |
| 180° about 6 edge-axes | 6 |
| 120°, 240° about 4 vertex-axes (the diagonals) | 4 × 2 = 8 |
| **Total** | **24** |

This group **acts on the 4 space diagonals as S₄** (the symmetric group on 4 letters) — the rotation group of the cube is isomorphic to S₄, with the diagonals as the permuted set. Important distinction (do not conflate): "S₄ acts on 4 diagonals" is **the action**; "rotation group is S₄ as an abstract group of order 24" is **the group**. Both correct framings; the action is what makes Anchor 2 (diagonals as quaternary) clickably linked to Anchor 6.

**Use case**: any mod-24 clock arithmetic (hours of day; days of dozenal-half-month; permutation calculus on 4-element sets).

## Anchor 7 — Full symmetries as 48 (octahedral group, *advanced*)

Adding **reflections** doubles the group: 48 = 24 × 2. The full octahedral group O_h includes the 24 rotations plus 24 improper symmetries (rotation × reflection). This anchor is **advanced** — reach for it only when Anchors 1–6 are retrieval-fluent, because reflections require committing to a chirality convention that doesn't compose with the right-handed coordinate Phase 0 above without explicit care.

**Use case**: when you need a 48-element index set (Boolean-cube symmetries, certain crystallographic groups).

---

## Operation grammar — rotation IS addition; composition IS multiplication

One unifying rule across all anchors:

- **Addition in base N**: rotate by k positions on the chosen ring → digit becomes `(d + k) mod N`
- **Multiplication in base N**: compose k rotations → digit becomes `(d × k) mod N`
- **Negation / complement**: rotate to the opposite element (for face-pair-sum-to-7, this is the antipodal face; for the 12-edge ring, it's the edge 6 steps around — i.e. the antipodal edge)
- **Group composition** (Anchors 6–7): the cube's own group multiplication table *is* the multiplication table of mod-24 / S₄ / O_h, depending on anchor

Because rotation is the cube's natural action, addition is *free* on any anchor — you don't learn a new operation per base, only a new ring.

---

## Carry semantics — one base-parameterized protocol

Same machine across every anchor; the only base-dependent parameter is the ring size N:

```
For cube position D operating in base N on a ring of size N:
  D' := (D + k) mod N
  carry := floor((D + k) / N)
  Propagate carry to the next-higher cube U with the same rule (base N).
```

The user's original dozenal register is `N=12` on the edge ring. Binary is `N=2` on a single vertex's chosen coordinate. Senary is `N=6` on the face ring. Octal is `N=8` on the vertices. Hex (`N=16`) requires either two cubes stacked (two octal digits) or a cube-plus-parity-bit.

**Carry-direction convention** (lock and stick): low cube on the **left**, high cube on the **right**, carry flows **leftward** (low→high reading right-to-left as positional notation). Same convention as decimal place-value.

---

## Base conversion — switch anchor on same substrate

The cleanest base conversions become **switch which feature you read**, not a new algorithm:

- **Binary ↔ Octal**: free, identical substrate. A vertex *is* both `xyz` (binary) and the single digit `4z + 2y + x` (octal). To convert, read the same vertex through the other lens.
- **Octal ↔ Hex**: pair two cubes. Two octal digits = 6 bits = 1.5 hex digits; 8 cubes' worth of vertex addresses = 64 = 2⁶ distinct addresses; with one extra parity bit you reach 128. For clean hex (4 bits), use one vertex (3 bits) + one face-pair-axis state (1 bit picking + vs −) = 4 bits = 1 hex digit per cube.
- **Senary ↔ Dozenal**: not free, but related — 12 = 2 × 6. One dozenal edge maps to (face, parity) = (senary digit, binary bit). Two cubes' worth of senary digits cover 36; a base-12 register on edges covers 12; the relationship is direct multiplication, not a substrate identity.
- **Ternary ↔ Senary**: 6 = 2 × 3, so similar splitting: one senary face maps to (parity, ternary axis-state).

---

## Composition with [vedic-multiplication-nikhilam](./vedic-multiplication-nikhilam.md) — opposite-face complement

The Nikhilam sutra computes complements from a base — "all from 9 and the last from 10" in decimal. On Anchor 3 (faces as senary), **the complement is free**: the opposite face. Looking at any face and reading the one directly across gives `(base − 1) − digit = 5 − digit` in base 6, plus 1 from the "last from 10" correction → effectively the Nikhilam pairing. No mental subtraction; the cube's own geometry hands you the complement.

This lets you run Nikhilam-style fast multiplication in base 6 by reading two cubes' opposite faces — no need to compute deficiencies in your head. See [vedic-multiplication-nikhilam](./vedic-multiplication-nikhilam.md) for the full multiplication algorithm.

## Composition with [hand-to-number-system](./hand-to-number-system.md) — base-10 hand-bridge

The cube **cannot host base 10 natively** (see "Bases that do NOT fit" below). Recovery: pair one cube on Anchor 4 (vertex octal, 0–7) with two fingers from [hand-to-number-system](./hand-to-number-system.md) (the bilateral flag bits 8 and 9). Vertex address gives 0–7; raising one finger flags +8; raising two flags +9. One cube + one hand = base-10 digit. Two cube+hand pairs = a 2-digit decimal number.

## Composition with [soroban-learning-method](./soroban-learning-method.md) — multi-rod multi-base overlay

A soroban has multiple rods, each holding a digit in base 10. The cube generalizes this: instead of "each rod is base 10," use **each cube is base N for some N picked at the anchor layer**. A multi-cube stack mixes bases freely — bottom cube edge-dozenal (base 12 for time-of-day), middle cube vertex-octal (base 8 for file permissions), top cube face-senary (base 6 for dice odds). The carry rule from §"Carry semantics" handles any per-cube base. The soroban becomes a special case where every rod is base 10 on hand-bridged cubes.

## Composition with [vedic-magic-squares](./vedic-magic-squares.md) — toroidal modular wrap parallel

The 12-edge ring on Anchor 5 wraps around the cube exactly the way the magic-square's "southeast walk" wraps around the toroidal grid. Both are mod-N cycles on a connected surface. The cube-edge ring is **mod-12 on a hexahedral surface**; the magic-square wrap is **mod-n on a torus**. The carry rule is structurally identical to the magic-square wrap rule. See [vedic-magic-squares](./vedic-magic-squares.md) for the toroidal version.

## Composition with [rubiks-cube-palace](./rubiks-cube-palace.md) — same cube, disjoint anchors

The palace owns the **54-cell sticker grid** (6 faces × 9 cells). This page owns the **invariant feature-sets** (vertices, edges, face-pairs, diagonals, rotation group). The substrates are disjoint: a sticker is not an edge; a cell is not a vertex; the palace never rotates the cube; this page rotates it constantly. You can run *both* on the same physical cube without collision — palace items live in cells, calculator state lives on edges/vertices/faces. The only shared element is the orientation lock (Phase 0), and both pages adopt the same convention (white-up, green-front).

---

## Bases that do NOT fit cleanly

Honesty matters more than completeness. Two important bases have no native cube slot:

- **Base 10**: 10 = 2 × 5. The cube has no symmetric set of size 10. The cube cannot host base 10 directly. **Recovery**: pair Anchor 4 (vertex octal) with two fingers from [hand-to-number-system](./hand-to-number-system.md) (see composition above). Or pair two cubes (Anchor 5 dozenal + Anchor 3 senary read modularly) — works but is contrived. The uncontrived recovery is to leave the cube: [tile-as-calculator](./tile-as-calculator.md) hosts base 10 as a 2×5 decomino, because a tile's base is simply its cell count and 10 factors cleanly. Read the substrate partition that way — this page is the specialized **branch** for math that genuinely needs 3D structure (the vertex-octal/binary identity, the order-24 rotation group, the Euler invariant); the tile substrate is the **trunk** that carries every base the cube cannot.
- **Base 7**: 7 is prime; the cube has no symmetric set of size 7. **Recovery**: use a single soroban rod or external counting. The cube does not pretend to host base 7.

The "one cube hosts every base" claim is **false**. The honest claim is "one cube hosts seven specific bases natively; other bases require a bridge."

---

## METER integration

Five events under the `cube_calc::*` namespace. All log alongside PULSE state per [meter-overview](./meter-overview.md).

| Event | Operational form | Floor | Working | Target |
|---|---|---|---|---|
| `cube_calc::base_anchor_id` | Given a digit-count requirement N, name the cube anchor that hosts base-N (or name the missing-base bridge) | ≤3s / ≥90% accuracy | ≤4s / ≥80% | ≤2s / ≥95% |
| `cube_calc::digit_to_position` | Given a digit value `d` in base N, name the position on the chosen ring (e.g. "octal 5 → vertex (1,0,1) → top-back-right corner") | ≤4s / ≥85% | ≤6s / ≥75% | ≤3s / ≥95% |
| `cube_calc::add_with_carry` | 2-cube addition in any of {binary, senary, octal, dozenal, hex}, single-carry case | ≤8s / ≥90% | ≤12s / ≥80% | ≤6s / ≥95% |
| `cube_calc::base_conversion` | Convert a 6-bit number between binary and octal using the 8 vertices | ≤10s / ≥85% | ≤15s / ≥70% | ≤6s / ≥95% |
| `cube_calc::nikhilam_via_opposite_faces` | State the complement of a senary digit by reading its opposite face | ≤3s / ≥95% | ≤5s / ≥85% | ≤2s / ≥99% |

**Escalation routes**:
- Floor breach on `digit_to_position` for ≥3 consecutive sessions → rewrite that anchor's glyph segment (likely orientation drift)
- Floor breach on `add_with_carry` for ≥3 consecutive sessions → drop to single-cube drills before re-attempting carry
- Floor breach on `base_anchor_id` ever → the mnemonic phrase is broken; rewrite

---

## Mnemonic

**Phrase**: *"Three axes, four diagonals, six faces; eight vertices, twelve edges, twenty-four turns — Euler keeps the score: eight minus twelve plus six is two."*

**Counts roll-up** (back-pocket): `3 · 4 · 6 · 8 · 12 · 24 · 48 → Euler 2`

The phrase encodes the seven anchors in ascending count order (3, 4, 6, 8, 12, 24, 48 — though 48 is mentioned only in advanced contexts, since reflections require chirality convention). The Euler refrain provides a structural anchor that ties three of the counts (8, 12, 6) together via [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md): V − E + F = 8 − 12 + 6 = 2. Two independent retrieval paths (ascending counts + Euler invariant) make the seven-item list reconstructable from either starting point.

---

## Memory checksum

Seven items, recite cold in ≤20s. Cite [pipeline stage 3 (Remember cue → action)](./skill-progression-stages.md) for the recall move; cite [automaticity level 5](./skill-progression-stages.md) for the floor target.

1. **Seven anchors**: 3 face-pair axes (ternary) · 4 space diagonals (quaternary) · 6 faces (senary) · 8 vertices (octal / 3-bit binary) · 12 edges (dozenal) · 24 rotations (mod-24 / S₄-action) · 48 full symmetries (octahedral group, advanced)
2. **Euler invariant**: V − E + F = 8 − 12 + 6 = 2 (cite [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md))
3. **Opposite-face complement**: paired faces sum to 7 → senary Nikhilam (cite [vedic-multiplication-nikhilam](./vedic-multiplication-nikhilam.md))
4. **Vertex coordinate rule**: each vertex is (x,y,z) ∈ {0,1}³; vertex address = 3-bit binary number 000–111; same vertex *is* the octal digit 0–7
5. **Operation grammar**: addition in base N = rotate by k on the chosen ring; carry fires when rotation crosses the zero-mark
6. **Two-cube positional notation**: low cube left, high cube right, carry flows leftward; same rule works for any anchor by parameterizing N
7. **What does NOT fit**: base 10 (no symmetric set of size 10; bridge via [hand-to-number-system](./hand-to-number-system.md)) · base 7 (prime; external rod)

**Cold self-test** (≤60s, with a physical cube in hand and no notes):
1. Point at one representative slot for binary anchor (any vertex)
2. Point at one representative slot for senary anchor (any face)
3. Point at one representative slot for octal anchor (any vertex)
4. Point at one representative slot for dozenal anchor (any edge)
5. Count V − E + F = 2 by inspection

If all five steps complete inside 60s, the page is encoded. If any one anchor cannot be physically located, the corresponding mnemonic segment is broken — fix that segment before drilling further.

---

## Visual — the frozen polyomino cube glyph

**Interactive companion**: open `cube-as-calculator.html` (sister file in this folder) in any browser for a draggable 3D cube with toggle-able anchor highlights (axes / diagonals / faces / vertices / edges / rotations / all-visible), the Euler self-test displayed live, **and a working operations demo** — pick base 2 / 6 / 8 / 12, type two operands, hit Run, and watch a yellow marker walk around the active ring with the result panel flashing orange on each carry event. The demo is the user's original 2-cube register made physical: rotation IS addition, the marker is the digit pointer, the flash is the carry signal that would propagate to the high cube. Pure HTML + Three.js via CDN; no build step; opens from `file://`. The static glyph below is the cold-recall anchor; the interactive page is the drill-and-explore companion.

The glyph is **static** — a single isometric polyomino-style cube with anchor markers overlaid and the Euler checksum printed on the glyph itself. No walk arrows, no animation cues. Read at a glance.

```p5 height=560
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 560); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const dim = '#8a8272';
  const gold = '#a08a5c';
  const rose = '#a07d78';
  const green = '#5c7a54';
  p.background(p.isDark ? 30 : 245);

  const cx = p.width/2, cy = 190, s = 90;
  const cos30 = Math.cos(Math.PI/6), sin30 = Math.sin(Math.PI/6);
  const iso = (x,y,z) => [ cx + (x - z) * cos30 * s, cy + (x + z) * sin30 * s - y * s ];

  const V = {
    '000':[0,0,0], '100':[1,0,0], '010':[0,1,0], '110':[1,1,0],
    '001':[0,0,1], '101':[1,0,1], '011':[0,1,1], '111':[1,1,1]
  };
  const P = {}; for (const k in V) P[k] = iso(...V[k]);

  const edges = [
    ['000','100'],['010','110'],['001','101'],['011','111'],
    ['000','010'],['100','110'],['001','011'],['101','111'],
    ['000','001'],['100','101'],['010','011'],['110','111']
  ];
  const faceCenters = {
    'x0':[0,0.5,0.5], 'x1':[1,0.5,0.5],
    'y0':[0.5,0,0.5], 'y1':[0.5,1,0.5],
    'z0':[0.5,0.5,0], 'z1':[0.5,0.5,1]
  };
  const diagonals = [ ['000','111'], ['100','011'], ['010','101'], ['001','110'] ];

  // 3 face-pair axes, through center (A)
  p.stroke(gold); p.strokeWeight(1.5);
  p.drawingContext.setLineDash([4,3]);
  [['x0','x1'],['y0','y1'],['z0','z1']].forEach(([a,b]) => {
    const pa = iso(...faceCenters[a]), pb = iso(...faceCenters[b]);
    p.line(pa[0], pa[1], pb[0], pb[1]);
  });
  p.drawingContext.setLineDash([]);

  // 4 space diagonals, corner-to-corner through center (D)
  p.stroke(rose); p.strokeWeight(1.2);
  p.drawingContext.setLineDash([2,4]);
  diagonals.forEach(([a,b]) => { p.line(P[a][0], P[a][1], P[b][0], P[b][1]); });
  p.drawingContext.setLineDash([]);

  // 12 cube edges (E)
  p.stroke(ink); p.strokeWeight(1.8);
  edges.forEach(([a,b]) => { p.line(P[a][0], P[a][1], P[b][0], P[b][1]); });

  // 8 vertices (V)
  p.textAlign(p.CENTER, p.CENTER); p.textSize(12);
  for (const k in P) {
    const [x,y] = P[k];
    p.stroke(ink); p.strokeWeight(1); p.fill(p.isDark ? '#1c1a16' : '#f5f5f0');
    p.circle(x, y, 15);
    p.noStroke(); p.fill(ink); p.text('V', x, y);
  }

  // 6 faces (F) - 3 visible faces drawn bright, 3 hidden faces dimmed
  p.textSize(13);
  const visibleFaces = ['x1','y1','z1'];
  for (const f in faceCenters) {
    const [x,y] = iso(...faceCenters[f]);
    p.noStroke(); p.fill(visibleFaces.includes(f) ? green : dim);
    p.text('F', x, y);
  }

  // axis + diagonal labels
  p.textSize(11);
  p.fill(gold);
  [['x0','x1'],['y0','y1'],['z0','z1']].forEach(([a]) => {
    const pa = iso(...faceCenters[a]);
    p.text('A', pa[0] + 10, pa[1] - 6);
  });
  p.fill(rose);
  diagonals.forEach(([a]) => { p.text('D', P[a][0] - 10, P[a][1] + 10); });

  // Euler self-test, printed on the glyph
  p.fill(ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(15);
  p.text('V − E + F = 8 − 12 + 6 = 2', cx, cy + 170);

  // legend
  p.textAlign(p.LEFT, p.TOP); p.textSize(12); p.fill(ink);
  p.text('Legend', 20, cy + 200);
  const legend = [
    'V = 8 vertices → octal / 3-bit binary (Anchor 4)',
    'E = 12 edges → dozenal (Anchor 5)',
    'F = 6 faces → senary, Nikhilam (Anchor 3)',
    'A = 3 face-pair axes (through center) → ternary (Anchor 1)',
    'D = 4 space diagonals (corner-corner) → quaternary (Anchor 2)',
    'R = 24 rotations (not drawn; group) → mod-24 / S₄ (Anchor 6)',
    'S = 48 full symmetries (advanced) → O_h (Anchor 7)'
  ];
  p.textSize(11);
  legend.forEach((line, i) => { p.text(line, 20, cy + 222 + i*18); });
};
```

The Euler checksum lives **on the glyph**, not in a separate caption — the visual encodes its own self-test. Reading the glyph reads the checksum.

Glyph self-test: shown only this image with no surrounding text, the reader should reconstruct **at least 6 of the 7 anchor counts** (the 48-symmetry anchor is legitimately glyph-absent because reflections cannot be drawn on a static cube without a chirality marker). If <6 are reconstructable from the glyph alone, the glyph is doing less work than it should — redesign.

---

## Drill ladder

Cites [skill-progression-stages](./skill-progression-stages.md) by axis name throughout (per the wiki's number-citation rule).

| Rung | Operational form | Stage axis |
|---|---|---|
| 0 — Orientation | Read the page top-to-bottom once; locate each anchor on a physical cube | [drill stage 0 (orientation)](./skill-progression-stages.md) |
| 1 — Isolation | Per anchor, recite count + base + one slot in ≤5s | [drill stage 1 (isolation)](./skill-progression-stages.md) |
| 2 — Clean rep | All seven anchors recited in mnemonic order in ≤20s; Euler self-test ≤2s | [drill stage 2 (clean rep)](./skill-progression-stages.md) |
| 3 — Variation | Cold prompt "show me base-N" → name anchor + point at slot, all N ∈ {2, 3, 4, 6, 8, 12} in <60s | [drill stage 3 (variation)](./skill-progression-stages.md) |
| 4 — Automaticity | METER `cube_calc::add_with_carry` event lands inside the working band (≤12s / ≥80%) | [drill stage 4 (automaticity)](./skill-progression-stages.md) · [automaticity level 5](./skill-progression-stages.md) |
| 5 — Mixing | Mixed-base session: 10 problems randomly drawn from {binary, senary, octal, dozenal} arithmetic; ≥80% correct ≤90s total | [drill stage 5 (mixing)](./skill-progression-stages.md) |
| 6 — Pressure | Same as Rung 5 but under PULSE-degraded state (E ≤ 2 or S ≥ 4); still ≥70% correct | [drill stage 6 (pressure)](./skill-progression-stages.md) · [automaticity level 7](./skill-progression-stages.md) |
| 7 — Transfer | Use the cube live to solve a real arithmetic problem outside the drill (e.g. octal Unix permissions, dozenal time addition, hex byte arithmetic) | [drill stage 7 (transfer-zenith)](./skill-progression-stages.md) · [automaticity level 8](./skill-progression-stages.md) |

---

## Failure modes

1. **Anchor confusion** — trying to add octally while reading edges, or trying to do Nikhilam complement on vertices. Mitigation: name the anchor out loud before every operation. If you can't name it, you can't operate.
2. **Carry-direction drift** — carry sometimes flows leftward, sometimes rightward. Mitigation: low cube on the left, high cube on the right, carry leftward. Lock and stick — same as decimal positional notation.
3. **Orientation drift** — Phase 0 convention (x = L→R, y = B→T, z = back→front) gets re-derived per session. Mitigation: written on a sticky note attached to the physical cube. Never re-derive.
4. **Edge-ring traversal ambiguity** — the 12 edges have no single canonical cycle; if you mix orderings between sessions, the ring becomes incoherent. Mitigation: canonical order is **top-N → top-E → top-S → top-W → vertical-NE → vertical-SE → vertical-SW → vertical-NW → bottom-N → bottom-E → bottom-S → bottom-W**. Lock and stick.
5. **S₄-action vs rotation group conflation** (Anchor 6) — calling "S₄ on 4 diagonals" the same as "the rotation group" is loose. They are the same abstract group but live at different levels: the action is what's *visible*, the group is what's *composed*. Don't pretend they're the same when teaching the anchor.
6. **Base-10 false-fit** — assuming the cube hosts every base will silently produce wrong arithmetic when you try to do base 10 natively. Mitigation: bases-that-don't-fit section is mandatory reading before any drill above Rung 3.
7. **Reflexion-induced chirality bug** (Anchor 7) — using reflections without locking a chirality convention turns "left-handed" rotations into "right-handed" ones silently. Mitigation: skip Anchor 7 until Anchors 1–6 are at Rung 5+.

---

## Open follow-ups

1. **Per-anchor spoke pages** — promote any anchor section to its own page (`cube-vertex-octal-encoder.md`, `cube-face-senary-die.md`, `cube-rotation-clock.md`, etc.) when that section exceeds ~150 lines of its own worked drills. Until then, hub-only. **Done for Anchor 5**: [dozenal-edge-peg](./dozenal-edge-peg.md) now owns the edge *addressing* view (the arithmetic ring stays here).
2. **Printable flat-net glyph** — flat unfoldable cube net annotated with V/E/F/A/D markers as a printable appendix for physical-cube drills. Pair with the isometric glyph for full coverage.
3. **Dozenal digit characters** — the page uses `↊` and `↋` for 10 and 11 in dozenal (Pitman characters). Consider also documenting Hammond's `χ` and `ε` as alternates. Pick one for canonical drill prompts.
4. **Cube-group-theory sibling page** — a future `cube-group-theory.md` could own the algebraic depth (S₄ isomorphism, 48-element O_h with character tables) that Anchor 7 currently flags as advanced. Migrate Anchor 7 there if the algebra grows past 50 lines.
5. **Worked instance in another base** — the dozenal worked example (`39₁₂ + 26₁₂ = 63₁₂`) is the only worked carry example in the page. Add one each in binary (vertex anchor), senary (face anchor), and octal (vertex anchor) once the first 24h checksum passes.
6. **Room assignment** — meta-knowledge palace L6/D10 room number TBD; check the room-allocation index and lock.
7. **Composability-index entry** — register the confirmed unlock (Cube invariants × multi-base positional notation = same physical cube hosts 7 base-N calculators sharing one rotation-as-addition operation grammar) after the first 24h checksum passes. Per the wiki's convention, confirmed unlocks land only after the owner page stabilizes.

---

## Related pages

- [dozenal-edge-peg](./dozenal-edge-peg.md) — promoted spoke of Anchor 5; the *addressing* view of the 12 edges (`digit = 4·axis + position`), complementary to this page's arithmetic ring-walk
- [rubiks-cube-palace](./rubiks-cube-palace.md) — sibling architecture using the same cube as memory storage rather than algebraic substrate; disjoint anchor sets
- [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) — owner of cube V/E/F counts (8/12/6), Euler V−E+F=2, cube↔octahedron duality
- [vedic-multiplication-nikhilam](./vedic-multiplication-nikhilam.md) — owner of the complement method; opposite-face-pair sum=7 is its base-6 instance
- [vedic-magic-squares](./vedic-magic-squares.md) — toroidal modular wrap; structurally parallel to the 12-edge ring carry
- [hand-to-number-system](./hand-to-number-system.md) — base-10 hand-bridge for the base the cube cannot host natively
- [tile-as-calculator](./tile-as-calculator.md) — the general-purpose trunk this page is a specialized branch of; hosts base 10 and every other base with no symmetric cube set
- [soroban-learning-method](./soroban-learning-method.md) — multi-rod positional notation; cube generalizes by mixing bases per rod
- [METER](./meter-overview.md) — owner of measurement schema; `cube_calc::*` namespace registered here
- [UMTF](./universal-mental-tagging-framework.md) — owner of 7 tag axes; this page scores Spatial+Relation+Pattern as dominant
- [skill-progression-stages](./skill-progression-stages.md) — owner of pipeline / drill / automaticity stage counts cited in the drill ladder
- [framework-comparison-matrix](./framework-comparison-matrix.md) — registry where this framework is scored against the encoder spine
- [motoric-encoding-systems](./motoric-encoding-systems.md) — finger-on-cube is the motoric retrieval channel for the physical-pointing self-test
- [glossary](./glossary.md) — registers Cube-as-Calculator, Cube anchor, Vertex octal, Edge dozenal, Face senary, Rotation-as-addition, Generalized carry protocol, EVE-2 checksum
