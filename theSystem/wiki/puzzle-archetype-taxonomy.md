---
palace: strategic-memory
level: 6
domain: 10
room: 5
wiki_source: wiki/problem-solving/puzzle-archetype-taxonomy.md
---

# Puzzle Archetype Taxonomy (17 classes)

**Summary**: 17-class taxonomy of brain-teaser archetypes extracted from the [Livingstone-Thomson 211-puzzle corpus](./livingstone-thomson-brain-teasers.md) (2026-05-24 ingest). Each class is labeled A through R (Q-skip avoided; actually A–R, 17 letters). For each class: characteristic surface form, load-bearing tactic from the wiki, sample puzzles, the typical [crux](./crux-move.md) level (Strategy / Tactic / Tool), and the failure mode that distinguishes it from sibling archetypes. The taxonomy is the recognition alphabet of [crux-recognition-gym](./crux-recognition-gym.md): in Sword-phase the user must classify a new puzzle into one of these 17 in <60 s.

**Sources**:
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — 211 puzzles spanning all 17 archetypes
- Derived during the 2026-05-24 ingest stress-test

**Last updated**: 2026-05-24

---

## How to read the table

Each archetype row gives:
- **Surface signal**: the keyword pattern in the puzzle text that triggers recognition
- **Crux level**: where the crux usually lives ([S / T / X](./problem-solving-three-levels.md))
- **Load-bearing tool**: which wiki page carries the resolution
- **Sample puzzles**: which Livingstone-Thomson puzzle numbers instantiate it
- **Sibling confusion**: which other archetype it's most often misclassified as

---

## The 17 archetypes

### A — Inclusion-exclusion / Venn

| Field | Value |
|---|---|
| Surface signal | "X had A, Y had B, Z had both" — 2 or 3 sets with overlap |
| Crux level | Tool |
| Load-bearing tool | inclusion-exclusion-tool (\|A∪B\| = \|A\| + \|B\| − \|A∩B\|) |
| Sample puzzles | #3 Kids, #209 Evil Geniuses (TOUGH, 3-set with anchor) |
| Sibling confusion | Archetype L (logic grid) — both involve set reasoning |

### B — Lateral-thinking red herring

| Field | Value |
|---|---|
| Surface signal | Heavy narrative embellishment (Dark Lords, biographies, dates, prices, distances) attached to a simple question |
| Crux level | Tactic (recognize that the embellishment is irrelevant) |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast + [anti-tactic-detection](./anti-tactic-detection.md) |
| Sample puzzles | #16 Light Speed (rotation-not-light), #4 Hard Times (cigarettes), #20 Banquet (no ostrich), #80 Quick Q's (coin) |
| Sibling confusion | Archetype O (linguistic crux) — both involve "the puzzle isn't what it looks like" |

### C — Memorization games

| Field | Value |
|---|---|
| Surface signal | "You have 2 minutes to memorize these…" |
| Crux level | Tool (use of encoder stack vs raw recall) |
| Load-bearing tool | [remaps](./remaps.md) + [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) + [smashin-scope](./smashin-scope.md) |
| Sample puzzles | #2/#48/#182/#191 Remember Remember I-IV; #221/#232/#326 Gallery of Memories I-IV |
| Sibling confusion | None — purely orthogonal; the wiki's encoder stack outclasses raw recall by 3-5× |

### D — Number / letter sequences

| Field | Value |
|---|---|
| Surface signal | "What's next in the series: a, b, c, ?" |
| Crux level | Tool (recognize the encoding) |
| Load-bearing tool | [universal-mathematical-tactics](./universal-mathematical-tactics.md) (Invariants) + [cultural-string-sequences](./cultural-string-sequences.md) |
| Sample puzzles | #181 R-O-Y-G-B-I-? (rainbow), #205 M-A-M-J-J-A-S-O-N-? (months from March), #420 D-R-M-F-S-L-T-? (solfège), #270 F-T-F-T-T-T-T-F-F-F-F-S-S-S-S-E-E-N-? (Five-Ten-Fifteen…), #416 U-B-R-C-? (UN Security Council) |
| Sibling confusion | Pure number sequence (#22, #316) is purely Invariants; mixed letter sequence needs cultural-string dictionary |

### E — Algebraic word problems

| Field | Value |
|---|---|
| Surface signal | Two-variable system embedded in narrative ("X is twice Y; X+Y=…") |
| Crux level | Tactic |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Wishful Thinking (set up the unknowns) |
| Sample puzzles | #11 Bird Long (recursive substitution), #189 / #198 How Old, #255 Brothers and Sisters |
| Sibling confusion | Archetype F (work-backward) — algebraic problems can also be solved by penultimate-step |

### F — Work-backward arithmetic

| Field | Value |
|---|---|
| Surface signal | A sequence of operations terminating in a known final state ("…and then it was empty") |
| Crux level | Strategy (decide to work backward) |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Penultimate step |
| Sample puzzles | #119 Death in the Desert (30 L), #407 Dark Lord's Bonus Scheme, #118 Gambler |
| Sibling confusion | Archetype E (algebraic) — both can be solved either way; work-backward is typically faster |

### G — Weighing / counterfeit identification

| Field | Value |
|---|---|
| Surface signal | "Using a balance/scale, what's the minimum number of weighings to find the odd-weight one?" |
| Crux level | Tool |
| Load-bearing tool | information-theoretic-minimum (⌈log_b N⌉ for b-ary tests) |
| Sample puzzles | #274 Weighing Planets (9 planets, 2 weighings), #95 Weigh Anchor (substitution), #409 Alchemist's Jars |
| Sibling confusion | Archetype L (logic grid) — both involve sequential elimination |

### H — Pigeonhole / derangement / combinatorial certainty

| Field | Value |
|---|---|
| Surface signal | "What's the chance / what's the minimum to guarantee X?" with combinatorial constraint |
| Crux level | Tactic |
| Load-bearing tool | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Pigeonhole + derangement (gap) |
| Sample puzzles | #306 Action Figures (P(all 4 right) = 1/24), #324 Action Figures II (P(exactly 3 right) = 0) |
| Sibling confusion | Archetype I (odd-one-out) — both involve "something doesn't fit" |

### I — Odd-one-out / similarities

| Field | Value |
|---|---|
| Surface signal | "Which is the odd one out?" / "Which is least like the other four?" |
| Crux level | Tactic (find the broken invariant) |
| Load-bearing tool | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Invariants |
| Sample puzzles | #58 / #251 Odd One Out I/II (3 circles vs 2 — invariant of count), #116 / #177 Similarities (semantic categories) |
| Sibling confusion | Archetype D (sequence) — sequences ARE invariants applied recursively |

### J — Coin-state / sequence-of-operations simulation

| Field | Value |
|---|---|
| Surface signal | "Imagine N coins in a row, all heads. Now do operations 1, 2, 3, 4. What's the state?" |
| Crux level | Tool (track parity or full state) |
| Load-bearing tool | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Invariants (parity) + CAST graph traversal |
| Sample puzzles | #148 / #178 / #188 / #210 / #288 / #399 Heads in Your Head I-IV |
| Sibling confusion | Pure simulation can also fall under M (spatial); the distinguisher is "state lives in coins/tokens" vs "state lives in geometry" |

### K — Geometric counting (squares, triangles)

| Field | Value |
|---|---|
| Surface signal | "How many squares of all possible sizes can you make from this grid?" |
| Crux level | Tool (systematic enumeration by size class) |
| Load-bearing tool | [universal-mathematical-tactics](./universal-mathematical-tactics.md) (composite) — Σ over size classes |
| Sample puzzles | #187 Square Bashing (18), #197 Dots & Squares (16), #200 Dots & Triangles, #396 Triangles & Squares (12 squares, 24 triangles) |
| Sibling confusion | Archetype M (spatial) — counting puzzles are spatial but specifically combinatorial |

### L — Logic-grid constraint satisfaction

| Field | Value |
|---|---|
| Surface signal | N agents × N attributes with conditional constraints ("X is not Y", "the agent with Z said W") |
| Crux level | Tactic (case-by-case elimination) |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Wishful Thinking (assume case A, derive contradiction) |
| Sample puzzles | #260 Spies (3 agents × 3 badges), #68 Wizards' Hat (4 wizards × 4 colors), #328 Naval Gazing (6 ships × 6 attributes), #358 Handbags at Dawn |
| Sibling confusion | Archetype A (inclusion-exclusion) — both involve set reasoning, but logic grids are conditional |

### M — Spatial / move-it-once

| Field | Value |
|---|---|
| Surface signal | "Rearrange / fold / divide / move N objects to achieve X" — physical manipulation |
| Crux level | Strategy (often: see the puzzle from a different angle) |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Get Hands Dirty + Draw a Picture + Symmetry |
| Sample puzzles | #13 Half Full Half Empty (pour the contents, don't move the glass), #61 Cut a Cross, #277 Orc Pen (concentric pens, 4 odd via overlapping rings), #303 Knight Moves, #313 Conjunction of Planets (add a star at intersection), #318 Triangle of Coins (move 3 to invert) |
| Sibling confusion | Archetype K (geometric counting) — both are spatial but K is enumerative |

### N — Constraint-propagation grids

| Field | Value |
|---|---|
| Surface signal | Sudoku / crossword / glyph-grid with row/column/region rules |
| Crux level | Tool (constraint propagation) |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Get Hands Dirty + Invariants (each row contains 1-N exactly once) |
| Sample puzzles | Spidoku I-VI (spiderweb-shaped, 8×8), Crossnumber I-III, Logi Place (5×5), Da Glyph Code (sudoku with symbols), CryptoMath I-III |
| Sibling confusion | None — visually distinct |

### O — Wordplay / linguistic crux

| Field | Value |
|---|---|
| Surface signal | A grammatically-loaded question whose answer pivots on a single word's meaning |
| Crux level | Tool (re-examine the lexical assumption) |
| Load-bearing tool | [linguistic-crux](./linguistic-crux.md) |
| Sample puzzles | #393 Egg-Yolk (yolks ARE white as an egg part; "yellow" is convention) — actually: yolks are yellow, the trick is singular/plural agreement; #100 Stringing Along (cut a closed loop → 1 piece with 2 ends), #96 Sunrise (anywhere, due to seasonal shift), #417 Feet (lumberjack's own 2 + 7 = 9), #332 Divisions (50 ÷ ½ = 100, not 25) |
| Sibling confusion | Archetype B (lateral red herring) — both subvert reading; B subverts via irrelevance, O subverts via lexical ambiguity |

### P — Family relations

| Field | Value |
|---|---|
| Surface signal | "X is Y's mother's brother-in-law's son — what relation is X to Y?" |
| Crux level | Tool (draw family tree) |
| Load-bearing tool | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Draw a Picture |
| Sample puzzles | #27 Hunting (2 fathers + 2 sons = 3 people: grandfather/father/son), #266 / #308 It's All Relative, #394 Colonel-not-father (mother), #418 (daughter or niece) |
| Sibling confusion | Some family puzzles overlap with B (lateral) when they exploit gendered assumptions ("colonel" assumed male) |

### Q — Probability

| Field | Value |
|---|---|
| Surface signal | "What's the chance / probability that…" |
| Crux level | Tool (combinatorial formula) |
| Load-bearing tool | — (**gap**: no probability page exists in the wiki) |
| Sample puzzles | #118 Gambler (lost 3 hands, each ¾ loss; $1.50 left = $96 lost), #306 / #324 Action Figures (P-of-derangement) |
| Sibling confusion | Often miscategorized as F (work-backward) or H (combinatorial) |

### R — Cipher / position-encoded

| Field | Value |
|---|---|
| Surface signal | Letters mapped to numbers, or numbers in a non-obvious base |
| Crux level | Tool (recognize the cipher rule) |
| Load-bearing tool | Pigeonhole on digit assignments + position-in-alphabet recognition |
| Sample puzzles | #366 / #289 CryptoMath, #103 / #327 Dark Lord's Journey (A=1, B=2 … Z=26 → distance = sum of letter positions) |
| Sibling confusion | Archetype N (constraint grids) — CryptoMath is a hybrid of N + R |

---

## Per-archetype distribution in the 211-puzzle corpus

Rough count from the table-of-contents scan (some puzzles span 2 archetypes; counted in the primary):

| Archetype | Approx count | % |
|---|---|---|
| N — constraint grids | ~40 (incl. all Spidoku, Crossnumber, Sign of the Times, Jumbled Equation, CryptoMath) | 19% |
| Speedy math / arithmetic | ~30 (Speedy Math I-IV, Speedy Word Problems, Speedy Unpleasant Divisions) | 14% |
| B — lateral red herring | ~25 | 12% |
| F — work-backward | ~15 | 7% |
| E — algebraic | ~15 | 7% |
| D — sequences | ~15 | 7% |
| C — memorization | 12 | 6% |
| M — spatial | ~12 | 6% |
| I — odd-one-out | ~12 | 6% |
| J — coin-state | 6 | 3% |
| L — logic grid | ~6 | 3% |
| K — geometric counting | ~5 | 2% |
| A — inclusion-exclusion | ~5 | 2% |
| O — linguistic | ~5 | 2% |
| P — family relations | ~5 | 2% |
| R — cipher | ~4 | 2% |
| G — weighing | ~3 | 1% |
| H — pigeonhole/derangement | ~2 | 1% |
| Q — probability | ~3 | 1% |

The 3 most-frequent archetypes (N + speedy math + B) account for ~45% of the corpus. The 14 less-frequent archetypes are the *recognition challenge* — each shows up only 3-15 times across 211 puzzles, so identifying them quickly requires having all 17 alphabetized in working memory.

## Why 17, not 7 or 30?

I tried compressing to 7 (the "magical number") and lost archetypes G + Q + R + O. I tried expanding to 25 by separating Spidoku from Crossnumber from Sudoku-variants and the splits weren't load-bearing — they all share the same load-bearing tool (constraint propagation + invariants).

**17 is the level where each archetype has a distinct load-bearing wiki tool.** Compressing further forces aliasing (G + L both become "elimination"); expanding further repeats tools. 17 is the operational frontier.

## How to use this taxonomy

1. **In [crux-recognition-gym](./crux-recognition-gym.md)**: archetype identification is the first 30 seconds of the 60 s recognition window. Then 30 s for tactic + crux-level prediction.
2. **In [problem-solving-os](./problem-solving-os.md) step 3**: archetype lookup is the entry to tactic selection. The mapping `archetype → tactic` is mostly 1:1, but a few archetypes (M, B, E) have multiple valid tactics.
3. **In new-puzzle ingest**: when reading any puzzle source (Zeitz Ch 1-3 exercises, Putnam, IBM Ponder This), tag each puzzle with its archetype letter. This produces per-source distribution data for future stress-tests.

## METER pass-floors

| Test | Pass floor |
|---|---|
| Recall all 17 archetype letters | <20 s, 100% |
| Recall the 6 most-frequent archetypes' names | <12 s, 100% |
| Given a puzzle, identify the archetype | <30 s, ≥75% accuracy across mixed batch of 20 |
| Distinguish sibling-confusion pairs (B vs O, E vs F, K vs M) | <15 s per pair, ≥80% |
| Map archetype → load-bearing wiki tool | <8 s per archetype, 100% |

## Mnemonic

Velvet Aeon Mode-Cosmic register: a **vast library** with **17 alcoves arranged in a great horseshoe**. Each alcove is dim except for one **central tome** lit by a single warm spotlight — the load-bearing wiki tool for that archetype. The alcoves are color-keyed by archetype-family: **gold** for set/logic (A, L), **green** for spatial (K, M, N), **silver** for narrative-trap (B, O), **bronze** for arithmetic-search (E, F, H), **deep blue** for memory/cipher (C, D, R), **rose** for relations (P), **black** for probability (Q — the empty alcove, marking the wiki gap). At the horseshoe's center stands a **scholar with 17 keys on a single ring**, each key the shape of an archetype letter. She must, given a new puzzle, **select the right key in <30 s** and unlock that alcove. The scholar has the **STRONG** face archetype, hair flowing past the keys; preserve = **sacred memory** (each correctly-classified puzzle joins a constellation overhead).

## Memory checksum

- **17** archetypes (A through R, no Q-skip; actually letters A B C D E F G H I J K L M N O P Q R)
- **3** most-frequent (N + speedy math + B ≈ 45% of corpus)
- **5** new wiki tools added to cover gaps (A · D · G · O via [cultural-string-sequences](./cultural-string-sequences.md) + inclusion-exclusion-tool + information-theoretic-minimum + [linguistic-crux](./linguistic-crux.md) — plus archetype-B's meta-tool [anti-tactic-detection](./anti-tactic-detection.md))
- **1** confirmed gap (Q — probability page is missing)
- **6** color families in the mnemonic library (gold/green/silver/bronze/deep blue/rose/black)
- **3** sibling-confusion pairs that need explicit distinguisher drilling (B↔O, E↔F, K↔M)

If you can recite 17-3-5-1-6-3 from "puzzle archetype taxonomy" within 60 s, the page is encoded.

## Related pages

- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — the 211-puzzle corpus
- [crux-recognition-gym](./crux-recognition-gym.md) — uses this taxonomy as the 17-class alphabet
- [crux-move](./crux-move.md) — every archetype's crux lives at S/T/X
- [problem-solving-three-levels](./problem-solving-three-levels.md) — the level annotations come from here
- [universal-mathematical-tactics](./universal-mathematical-tactics.md) — load-bearing for H, I, J, K
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — load-bearing for E, F, L, M
- inclusion-exclusion-tool — load-bearing for A
- information-theoretic-minimum — load-bearing for G
- [cultural-string-sequences](./cultural-string-sequences.md) — load-bearing for D
- [linguistic-crux](./linguistic-crux.md) — load-bearing for O
- [anti-tactic-detection](./anti-tactic-detection.md) — meta-tool for B
- [red-herring-resistance](./red-herring-resistance.md) — METER metric for B-archetype performance
- [remaps](./remaps.md) / [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) / [smashin-scope](./smashin-scope.md) — load-bearing for C

---

## U — See (CAST)

1. Horseshoe library with 17 alcoves, color-keyed by family, scholar with 17-key ring at center
2. Edges: alcove → archetype → load-bearing tool

## D — Name (NEDF)

1. Puzzle Archetype Taxonomy = 17 classes that exhaust brain-teaser surface forms
2. Each class has one load-bearing wiki tool (some shared, none duplicated)
3. Distinguisher: 17 (not 7, not 30) because that's the level at which 1:1 tool mapping holds
4. Failure mode: archetype-aliasing (forcing 2 archetypes into 1) loses the discriminating tactic

## F — Do (SPEAR)

1. New puzzle → first 30 s = classify archetype
2. Archetype identified → 30 s = pick tool + tactic + crux level
3. After solving → log archetype_actual vs archetype_predicted in METER event
4. Per-archetype accuracy table updates → drill weakest archetype's distinguisher

## B — Watch (HEART)

1. Defaulting to N (constraint grid) for anything that looks visual — masks K and M
2. Defaulting to B (lateral) for anything with narrative — masks E, F, P
3. Misclassifying linguistic crux (O) as lateral red herring (B)
4. Missing archetype Q (probability) entirely — wiki has no page yet

## L — Predict (ORACLE)

1. After 50 puzzles, per-archetype confusion matrix stabilizes; predict weakest archetype from session-5 data
2. Sword-phase performance on a new source predicts archetype distribution of that source

## R — Act (GRACE)

1. Read puzzle → declare archetype out loud before computing
2. Archetype unclear → run [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Get Hands Dirty for 30 s to surface signal
3. Coach another → run them through 3 sibling-confusion pairs first (B↔O, E↔F, K↔M) before mixed batch
