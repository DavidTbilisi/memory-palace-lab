---
palace: meta-knowledge
level: 6
domain: 10
room: TBD
para: resource
semantic_mode: 5
status: candidate
wiki_source: wiki/learning-systems/braille-face-peg.md
---

# Braille Face-Peg — the 6 faces as a Braille / die / cube Rosetta

**Summary**: A face-level peg that binds one index to four skins on the cube's six faces: **Braille dot N = die face N = cube face N = a peg image**. It is the *face* sibling of [dozenal-edge-peg](./dozenal-edge-peg.md) (which addresses the 12 edges) under [cube-as-calculator](./cube-as-calculator.md)'s Anchor 3 (6 faces → base-6 senary). Its one new move is showing that **two pairings of the six slots coexist without conflict**: Braille's reading columns `{1,2,3}|{4,5,6}` (how a finger scans) and the die's 7-complement `{1,6}{2,5}{3,4}` (how the cube turns) — the latter being exactly the cube's three rotation axes. Companion diagram: `Excalidraw/Braille_Die_Cube_Merge.excalidraw.md`. **Status: candidate** — peg images and the promotion gate are unfrozen (see §Open decisions).

**Sources**:
- Design conversation, 2026-07-05 (David) — "what would be if we try to merge Braille, Die and Rubik's cube?"; resolved to a four-skin face peg with two coexisting pairings.
- `Excalidraw/Rubik's_Cube_Die.excalidraw.md` — the die/cube net this page reads its face→number→colour→peg mapping from.
- `Excalidraw/Braille_alphabet.excalidraw.md` — the Braille 2×3 dot cell and the alphabet progression.
- `Excalidraw/Braille_Die_Cube_Merge.excalidraw.md` — the merged Rosetta this page annotates (built this session).
- [cube-as-calculator](./cube-as-calculator.md) — owner of Anchor 3 (6 faces = base-6 senary) and of "opposite-face pair sum = 7 is Nikhilam in base 6"; this page defers to it on what the faces *are*.
- [dozenal-edge-peg](./dozenal-edge-peg.md) — the edge-level self-addressing peg; this page is its face-level twin.
- [observer-inside-method](./observer-inside-method.md) — owner of the die "opposite faces sum to 7" reasoning frame this page reuses.

**Last updated**: 2026-07-05 — initial draft.

---

## Why the faces, and why all three at once

The cube offers a whole ladder of bases on one solid — see [cube-as-calculator](./cube-as-calculator.md) for the seven-anchor accounting. The **6 faces are its base-6 (senary) anchor**, and [dozenal-edge-peg](./dozenal-edge-peg.md) already showed that the clean way to *use* a cube substrate for retrieval is to fix a self-describing address on its parts. That page did it for the 12 edges. This page does it for the 6 faces — and notices that three familiar 6-slot objects are the *same six slots* seen three ways:

| object | the six are… | what varies across the object |
|---|---|---|
| **Braille cell** | 6 dot positions (2×3) | *which subset* is raised → a letter |
| **die** | 6 faces | nothing — the canonical, solved arrangement |
| **cube** | 6 face-colours | a permutation you scramble and solve |

Because all three are the number 6 wearing different clothes, one index threads through all of them.

## The key: dot N = die face N = cube face N

The die net in `Rubik's_Cube_Die.excalidraw.md` already numbers the faces so that **opposite faces sum to 7** — the physical die constraint. Reusing those numbers as Braille dot indices gives one address with four skins:

| # | face | cube colour | Braille dot | peg *(provisional)* |
|---|------|-------------|-------------|---------------------|
| 1 | T (up)    | white  | dot 1 | car |
| 2 | R (right) | red    | dot 2 | rose |
| 3 | B (back)  | blue   | dot 3 | wave |
| 4 | F (front) | green  | dot 4 | alien |
| 5 | L (left)  | orange | dot 5 | orange |
| 6 | D (down)  | yellow | dot 6 | mountain |

The peg lives in the **centre sticker** of each cube face (the centre is what fixes a face's identity, so it is the natural anchor slot). Peg choices are David's to freeze — see §Open decisions.

A **Braille letter is a chord of faces**: not one face but the *subset* that is "pressed". So the same object that is a die when solved becomes a letter when you name which faces are active — the encoding layer ([symbolic-encoding-systems](./symbolic-encoding-systems.md), [hand-to-letter-system](./hand-to-letter-system.md)) rides on top of the addressing layer for free.

## The unlock: two pairings that coexist

The six slots carry **two independent pairings at once**, and they do not fight because they answer different questions.

- **Braille reading columns** — `left {1,2,3} = T,R,B` and `right {4,5,6} = F,L,D`. This is the *scan* order: how a finger reads a cell top-to-bottom, column by column. Grouping for **reading**.
- **Die 7-complement** — `{1,6} {2,5} {3,4}`, each pair summing to 7. Geometrically these are the two diagonals plus the middle row of the cell — the **X-and-bar** signature. Each pair is one **cube rotation axis**: 1+6 = U/D, 2+5 = R/L, 3+4 = F/B. Grouping for **turning**.

So "opposite faces sum to 7" (the die fact, framed by [observer-inside-method](./observer-inside-method.md)) and "the cube has three axes" (the cube fact) are revealed to be the *same statement* about these six slots. Columns group them for the eye; complements group them for the hand.

## Mnemonic

*One skeleton, four skins.* Hold a die: it is already solved (canonical), already numbered, already six-faced. Press some faces in → you have spelled a Braille letter. Twist it → you are running a cube move. The centre of each face wears its peg. To check yourself, cover a face and name its hidden back: the two must sum to 7.

## Checksum

Built-in, from the die: **any face + its opposite = 7**. This is the base-6 Nikhilam complement owned by [cube-as-calculator](./cube-as-calculator.md), and it doubles as a self-verifying peg — misremember a face's number and its 7-complement will not close. For multi-face codes the general digit-sum verification is the [number-codec-ladder](./number-codec-ladder.md)'s Checksum Seal (base-6 → mod-5 seal); this page inherits it rather than defining a new one.

## Visual

Six colour-chipped tiles left→right in die order 1–6, each with its peg in the face centre and its single Braille dot filled; below them the master 2×3 cell carrying both pairings — purple brackets down the reading columns, orange dashes forming the X-and-bar of the 7-complements. The full plate is `Excalidraw/Braille_Die_Cube_Merge.excalidraw.md`.

## Open decisions

Per the mnemonic-design contract, this page stays **candidate** until:

1. **Peg images frozen** — the six centre pegs (provisionally car · rose · wave · alien · orange · mountain, carried from the pasted net) are David's personal pick; a collision check against [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) and the existing scene pegs should run before freezing.
2. **Promotion gate passed** — a falsifiable recall test (name face → colour + dot + peg + 7-complement, and reverse) at target accuracy/speed, mirroring the gate pattern used for [number-codec-ladder](./number-codec-ladder.md) vs PAO. Until then this is an addressing lens offered alongside, not above, the existing face uses in [cube-as-calculator](./cube-as-calculator.md).
3. **Move-language tie-in confirmed** — the syllable notation on the die net (consonant = face, vowel = operation) spells cube algorithms; whether it should also spell Braille letters through this shared index is an open extension, not yet specified.

## Related pages

- [cube-as-calculator](./cube-as-calculator.md) — owner of the 6-faces-as-senary anchor and the opposite-sum-7 complement this page reuses
- [dozenal-edge-peg](./dozenal-edge-peg.md) — the edge-level self-addressing peg; this page is its face-level sibling
- [observer-inside-method](./observer-inside-method.md) — the interior frame that makes "opposite faces sum to 7" a body-axis fact
- [number-codec-ladder](./number-codec-ladder.md) — the Checksum Seal this page inherits for multi-face codes
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the peg pool the centre-sticker images must be collision-checked against
- [symbolic-encoding-systems](./symbolic-encoding-systems.md) · [hand-to-letter-system](./hand-to-letter-system.md) — the Braille-letter (chord-of-faces) encoding layer
- [mnemonic-methods-master](./mnemonic-methods-master.md) — where this routes as a face-addressing option on the cube substrate
