---
palace: tactical-memory
level: 5
domain: 10
room: 5
wiki_source: wiki/learning-systems/vedic-multiplication-nedf-deck.md
---

# Vedic Multiplication — NEDF + REMAPS Deck

**Summary**: Sixteen [NEDF](./nedf-overview.md) cards encoding every load-bearing concept from [vedic-speed-math](./vedic-speed-math.md)'s Sections 2 and 3 (Base Method Cases 1–5 + Criss-Cross). Each card uses [REMAPS](./remaps.md) moves to make the operation scene memorable, named distinguishers against the most-confused neighbour, and a failure mode tied to a specific calculation mistake the user is likely to make. Sister deck to java-vocabulary-nedf, algorithm-pattern-nedf-deck, graph-network-nedf-deck. Primary migration target for [encoded-spaced-repetition](./encoded-spaced-repetition.md) — 16 cards × 4 retrieval angles = 64 SR cards once the schema refactor is applied.

**Sources**:
- `raw/01 Core_Memory/Vedic Math/Section 2 multiplication.md` (with embedded course screenshots, 17 frames)
- `raw/01 Core_Memory/Vedic Math/Section 3 criss cross method.md` (with embedded course screenshots, 10 frames)
- Course "Learn Vedic Speed Mathematics Systematically & Step by Step" on Udemy
- Composes downstream of [vedic-speed-math](./vedic-speed-math.md), [nedf-overview](./nedf-overview.md), [remaps](./remaps.md)
- Architectural primitive: [substrate-algorithm-composition](./substrate-algorithm-composition.md)

**Last updated**: 2026-05-11

---

## How to read this deck

Each card uses the compact NEDF format with REMAPS moves baked into the Name-hook scene:

```
term — "name-hook scene with REMAPS moves applied"
   E:  Essence (1–2 sentences)
   D:  Distinguisher — vs the most-confused neighbour
   F:  Failure — concrete calculation mistake + correction
```

Cards are grouped into **three palace-rooms** mirroring the conceptual layers:

1. **Foundations Room** — the six terms every case relies on
2. **Cases Room** — the five Base Method cases and the carry rule
3. **Criss-Cross Room** — the universal alternative and its patterns

The **cross-cutting compression** section at the bottom collapses the 16 cards into 4 recurring scene-clusters so the whole deck can be held in working memory using just 4 anchor scenes.

---

## Room 1 — Foundations (6 cards)

### BASE — "stone pedestal with a zero carved at its bottom"
A cold stone pedestal, the height of a building (Exaggerate). At the base of the pedestal a round 0 is carved into the granite. Tap the carving and it rings like a bell (Sensations). Numbers like 40, 100, 700, 6500 climb the pedestal; numbers like 12, 47896 bounce off because they have no zero-foot.

- **E**: Any positive integer ending in 0 — used as a multiplication anchor. Examples: 10, 40, 80, 100, 500, 700, 1800, 3100, 6500.
- **D**: vs **Working Base** — every working base is a base, but 60, 500, 1800 are bases that are NOT working bases (they're not powers of 10).
- **F**: Treating "round-looking" numbers as bases. *47896 is NOT a base*. The last digit must be 0. *12 has no zero-foot — bounces off the pedestal.*

### WORKING BASE — "row of Roman columns labelled 10¹, 10², 10³…"
A long colonnade reaching to the sky (Exaggerate). Each column is exactly 10× taller than the previous — column 1 is shoulder-height, column 5 disappears into the clouds. The capital of each column is labelled with its power-of-10 exponent in glowing gold (Sensations: warm light).

- **E**: A base that is *specifically* a power of 10. Only: 10, 100, 1000, 10000, 100000…
- **D**: vs **Base** — bases like 60, 80, 500, 1800 climb the pedestal but cannot enter the colonnade. Working bases are the strictest subset.
- **F**: Using "base 60" with Cases 1–3 directly. You need **Case 5** (Base Multiple) because 60 isn't a working base.

### COMPLEMENT — "IOU note pinned to a number, owing to the base"
A creased paper IOU note is pinned to the chest of a number-figure shorter than the base-pedestal next to it (Associate: debt). The IOU shows a *negative* sum with red ink (Sensations). 89 owes 11 to reach 100; 87 owes 13. The pin smells of dust.

- **E**: `Number − Base` when the result is **negative**. The signed offset for numbers *below* the base.
- **D**: vs **Surplus** — same formula `Number − Base`, opposite sign. Complement is negative (number < base); surplus is positive (number > base).
- **F**: Writing "complement of 89 is 11" without the negative sign. Collapses Cases 1 and 2 visually. *Complement is signed*: −11.

### SURPLUS — "plus-sign halo over a number wearing a credit-card crown"
A glowing yellow "+" halo hovers above a number-figure taller than the base-pedestal beside it (Associate: profit/credit). The figure wears a crown made of credit cards (Exaggerate). 107 carries +7 of credit; 1145 carries +145. Halo hums.

- **E**: `Number − Base` when the result is **positive**. The signed offset for numbers *above* the base.
- **D**: vs **Complement** — see complement card. Same operation, opposite sign of result.
- **F**: In Case 2 (both above), cross-*subtracting* instead of cross-adding. Both surpluses → both add.

### BASE MULTIPLE (BM) — "zero-stripping currency-exchange coin"
A vending-machine coin slot accepts the base coin (60, 500, 4200…); the machine strips the trailing zeros and spits out a smaller coin labelled BM (6, 5, 42…) (Modify-Merge-Move). The coin clinks (Sensations). The machine sits between the cross-step and the final answer in Case 5 (Palace).

- **E**: For non-working-base, BM = base ÷ (nearest power of 10) = base with trailing zeros stripped. BM(60)=6, BM(500)=5, BM(4200)=42, BM(74800)=748.
- **D**: vs **Working Base** — working base needs no BM (BM is implicitly 1 because the base *is* the power of 10). Non-working bases need BM as a scaling factor on the left part.
- **F**: Forgetting to multiply Left by BM in Case 5. Answer comes out roughly `base/10^k` × too small (≈6× too small for base 60).

### RIGHT-PART DIGIT BUDGET — "narrow fixed-width window with water overflowing left"
A wall-mounted window has a fixed-width slot (1 digit wide for base 60, 2 digits for 100, 3 for 1000) (Exaggerate). Water (digits) pours into the window; any excess overflows the *left* edge as a waterfall, splashing into the next compartment (Sensations: rushing water).

- **E**: Right part of the answer must have exactly as many digits as there are zeros in the chosen base. Base 100 → 2 digits. Base 60 → 1 digit.
- **D**: vs **Carry Rule** — budget is the *constraint*; carry is the *response* when budget is exceeded.
- **F**: *Padding instead of carrying*. If right = 7 and budget = 2, pad to 07 (correct). If right = 144 and budget = 2, carry the leftmost 1 → 130+1 | 44, NOT 130|144.

---

## Room 2 — Base Method Cases + Carry Rule (7 cards)

### CASE 1 — "Debtors Unite: two figures with IOU notes embracing"
Two number-figures both wearing complement IOU notes, embracing in front of the base-pedestal. Both shorter than the pedestal. Their IOUs touch and a glowing "−×−=+" sparks between them, producing the right-part product (Associate: union of debtors; Sensations: sparks).

- **E**: Both numbers < base. Both offsets negative. Cross-add gives left; multiply complements (signs cancel → positive product) on right. Example: 89 × 92 → 81 | 88 = 8188.
- **D**: vs **Case 2** — same arithmetic shape, signs flipped. Both-below: signs negative, cross-add lands *below* base. Both-above: signs positive, cross-add lands *above* base.
- **F**: Putting the negative sign in the right part. (−11)(−8) = +88, *positive*. The right part of complement × complement is always positive.

### CASE 2 — "Millionaires Unite: two crowned figures with + halos"
Two number-figures both with credit-card crowns and yellow "+" halos, embracing taller than the base-pedestal. Their halos overlap and produce a small positive product on the right (Exaggerate: enormous halos).

- **E**: Both numbers > base. Both offsets positive. Cross-add, multiply surpluses on right. Example: 112 × 108 → 120 | 96 = 12096. With carry: 106 × 124 → 130|144 → 131|44 = 13144.
- **D**: vs **Case 1** — same mechanics, opposite offset sign.
- **F**: Forgetting that the right part can still overflow the digit budget — 106×124's 6×24=144 needs the carry rule. The budget doesn't care which case you're in.

### CASE 3 — "Robin Hood Borrow: rich figure hands a base-coin to poor figure"
A surplus-figure (crown, +halo) hands one full base-coin to a complement-figure (IOU). The complement figure uses that base-coin to convert the negative right-part into a positive one (Associate: Robin Hood; Palace: the borrow happens in the *answer*, not before).

- **E**: One number above, one below base. Right part = negative × positive = **negative**. Convert: `−r → (base − r)` *and* subtract 1 from the left part. Example: 988 × 1080 → 1068 | −960 → 1067 | 040 = 1067040.
- **D**: vs **Cases 1, 2** — the sign-conversion borrow happens *only* in Case 3. Cases 1 and 2 always have positive right parts naturally.
- **F**: Two specific errors: (a) forgetting the −1 borrow from the left → answer too big by exactly *base*; (b) doing the convert (`base − r`) without subtracting 1 → same magnitude error.

### CASE 4 — "Two Timezones: shift one clock to match the other"
Two clocks on a wall showing different timezones (base 100 clock, base 1000 clock). You grab the base-100 clock and *spin its hands forward* by a factor of 10 to match the base-1000 zone (Associate: timezone shift; Modify: scale by 10). Do the calculation in the unified timezone, then *cut back one zero* at the end to recover the original answer.

- **E**: Factors near different working bases (e.g. 94 near 100, 988 near 1000). Multiply the smaller-base factor by 10 (or 100…) to share a base. Solve as Case 1/2/3. Cut the same number of zeros off the final answer. Example: 94 × 988 → solve 940 × 988 → cut one zero.
- **D**: vs **Cases 1–3** — those assume a single base. Case 4 is the bridge: base-match first, then collapse to a Case 1/2/3.
- **F**: Cutting too many or too few zeros at the end. The cut count must equal the shift count.

### CASE 5 — "Currency Exchange Booth: BM-coin converts sub-base answer to true magnitude"
A currency-exchange booth (Palace) sits between the cross-step output and the final answer. The clerk takes the sub-base answer, multiplies the Left part by the BM coin (Associate: exchange rate), and outputs true magnitude. The clerk has a stern voice that reminds you of the digit budget (Sensations).

- **E**: Numbers near a non-working base (60, 500, 250, …). Cross-step uses this base; multiply Left by BM = (base ÷ 10ᵏ); apply digit-budget = `k`. Example: 63 × 68 (base 60, BM 6) → 71 | 24 → 71·6 + 2 | 4 = 4284. Example: 484 × 470 (base 500, BM 5) → 454 | 480 → 454·5 + 4 | 80 = 227480.
- **D**: vs **Cases 1–3** — those use working bases (BM = 1 implicit). vs **Case 4** — Case 4 has two bases; Case 5 has one base that's just not a power of 10. Instructor: *"You can prefer Criss-Cross over Base Method (Case 5 or any other cases)."*
- **F**: (a) Forgetting to multiply Left by BM. (b) Using wrong BM — BM(60) = 6 not 10. (c) Wrong digit budget — base 60 has *one* zero, so right part has *one* digit (not two).

### CARRY RULE — "overflow waterfall cascading right-to-left"
A column of cups (Palace), each with fixed width matching the digit budget. The rightmost cup overflows its left edge into the next cup; if that cup now overflows, it spills further left. The waterfall sound is constant (Sensations). Exaggerate: cups stacked to the ceiling.

- **E**: If a part exceeds its digit budget, transfer the leftmost excess digit(s) into the immediate left part. Universal — applies to every Base Method case and every Criss-Cross part.
- **D**: vs **digit budget** — budget is the constraint; carry is the response. vs **Case 3 sign conversion** — sign conversion handles negative rights; carry handles oversized positive rights.
- **F**: Writing oversized right-part directly into the answer. 106 × 124 → "130|144" is wrong; it must become "131|44" = 13144.

### TRANSFER CASCADE — "domino chain falling right-to-left"
A long chain of dominoes (Exaggerate) standing in a row. The rightmost domino tips left; it knocks the next one; the cascade continues right-to-left until no further transfer is needed. The dominoes clack (Sensations).

- **E**: A single transfer can cause the next part to overflow, triggering another transfer. The cascade direction is *always* right-to-left and continues until the leftmost part absorbs the remainder.
- **D**: vs **Carry Rule** — Carry Rule is the per-part operation; Cascade is what happens when carries chain across multiple parts. Common in Criss-Cross 65 × 29 (two transfers).
- **F**: Stopping the cascade too early. 65 × 29 needs *two* transfers: 45 → 64 + 4 | 5, then 68 → 12 + 6 | 8 | 5 = 1885.

---

## Room 3 — Criss-Cross (3 cards)

### CRISS-CROSS 2×2 — "X marks the spot: two number-line riders crossing paths"
Two pairs of digits ride a number-line; the upper pair (6 5) rides right, the lower pair (2 9) rides right beneath. Where the cross happens (between the inner digits), an X-shape sparks (Sensations) and ejects the Middle product (Associate: treasure-map X). Three parts: First-zone left, X-zone middle, Last-zone right.

- **E**: For `ab × cd`: First = a·c, Middle = a·d + b·c, Last = b·d. Three parts. Each part except First → one digit; carry the rest. Example: 65 × 29 → 12 | 64 | 45 → 12 | 68 | 5 → 18 | 8 | 5 = 1885.
- **D**: vs **Base Method** — Criss-Cross works for any pair regardless of proximity to a base. Base Method faster when both are near a base. vs **3-digit Criss-Cross** — 2-digit has 3 parts; 3-digit has 5 parts.
- **F**: Computing only `a·d` for the Middle (missing the `+ b·c`). The Middle is the SUM of both crosses — both diagonal products.

### CRISS-CROSS 3×3 — "diamond chandelier with five light-zones"
A ballroom (Palace) ceiling hung with a diamond-shaped chandelier (Exaggerate). The chandelier has five vertical light-strips: outer two are dim (one product each), inner three are bright (the middle is brightest with three products) (Sensations: warm chandelier glow). Light intensity = number of cross-products.

- **E**: For `abc × def`: 1st = a·d, 2nd = a·e + b·d, 3rd = a·f + b·e + c·d, 4th = b·f + c·e, 5th = c·f. Five parts. Three terms in the middle, two in the next-out, one at each edge.
- **D**: vs **2-digit Criss-Cross** — three more parts and the middle part has three terms not one. vs **General rule** — same shape, larger.
- **F**: Missing a cross-term in the 3rd part (writing `a·f + c·d` only). The full middle sum for 3×3 has *three* products: `a·f + b·e + c·d`.

### GENERAL CRISS-CROSS RULE — "pyramid growing then shrinking: 1→2→3→2→1"
A pyramid (Exaggerate) in a desert (Palace), made of stacked stones. For `m`-digit × `n`-digit, the pyramid has `m + n − 1` levels; the stone count rises symmetrically to the middle then falls. 2×2 → 1,2,1 (three levels). 3×3 → 1,2,3,2,1 (five levels). 4×4 → 1,2,3,4,3,2,1 (seven levels) (Sensations: stones warm in the sun).

- **E**: For `m`-digit × `n`-digit, answer has `m + n − 1` parts. Part `k` is the sum of all digit-pair products `aᵢ · bⱼ` where `i + j = k`. This is **polynomial multiplication** with the digits as polynomial coefficients.
- **D**: vs **specific cases** — this is the general formula. 2×2 and 3×3 are instances.
- **F**: Miscounting parts. 2×2 = 3 parts. 3×3 = 5 parts. 4×4 = 7 parts. Always `m + n − 1`; always symmetric in count.

---

## Cross-cutting compression — 4 anchor scenes

When working memory has room for only four anchors, collapse the 16 cards into these four recurring scenes:

1. **Pedestal-and-colonnade** — anchors *Base*, *Working Base*, and the *digit-budget window*. The pedestal stands for any-base anchor; the colonnade for the strict working-base subset; the narrow window for the right-part constraint.
2. **IOU vs Halo figures** — anchors *Complement*, *Surplus*, and (when paired) Cases 1, 2, 3 via Debtors-Unite, Millionaires-Unite, Robin-Hood-Borrow. The relationship between the two figures determines the case.
3. **Currency Exchange Booth** — anchors *Base Multiple*, *Case 5*, and *Case 4* (timezone-clock variant: same exchange logic, different direction). All scaling between sub-base and true magnitude lives in this scene.
4. **Waterfall + Domino chain** — anchors *Carry Rule* and *Transfer Cascade*. Waterfall for the single transfer; domino chain for multi-part cascade.

Test of compression: from these four anchors alone, can you regenerate all 16 cards? If yes, the deck is held in 4 working-memory slots. If a card is missing, that's where the next REMAPS reinforcement should go.

---

## Drill notes

- **Initial encoding (Lamp phase)**: walk all 16 cards in palace order — Foundations Room → Cases Room → Criss-Cross Room. Each card 30–60 seconds. Goal: every scene retrievable on cue from the card name.
- **Mid-encoding (Scale phase)**: drill the 4 anchor scenes from the compression section. Each anchor should produce its 3–5 associated cards in under 5 seconds. This is the test that the compression is working.
- **Reflex (Sword phase)**: random card-name → full N/E/D/F reproduction in under 4 seconds. Plus reverse direction: given a calculation mistake, name which card's Failure slot it matches.

When [encoded-spaced-repetition](./encoded-spaced-repetition.md) is applied, each of these 16 NEDF cards generates 4 SR cards (recognition, recall, discrimination, diagnosis) = **64 SR cards** total — enough to lock the entire Vedic-multiplication conceptual layer into long-term memory at moderate review cost.

---

## Related pages

- [vedic-speed-math](./vedic-speed-math.md) — operational reference for what each card encodes; this deck is the encoded substrate
- [nedf-overview](./nedf-overview.md) — the encoding scheme
- [remaps](./remaps.md) — the encoder-reinforcer moves applied to every Name-hook scene
- [encoded-spaced-repetition](./encoded-spaced-repetition.md) — the SR scheduling that turns these 16 cards into 64 drill cards across 4 retrieval angles
- [vedic-speed-math-skill-ceiling](./vedic-speed-math-skill-ceiling.md) — quantifies the reflex speed these cards aim to support
- [substrate-algorithm-composition](./substrate-algorithm-composition.md) — names the architectural primitive (Vedic algorithm × peg/NEDF substrate)
- [composability-index](./composability-index.md) — Vedic + NEDF + REMAPS is a chained composition; logged there
- java-vocabulary-nedf — sister deck; same NEDF+REMAPS format applied to a different domain
- algorithm-pattern-nedf-deck — sister deck; same format
- graph-network-nedf-deck — sister deck; same format
- [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) — REMAPS-encoded peg matrix that could host the digit-images used in this deck's worked examples


---

## U — See (CAST)
1. NEDF deck for Vedic multiplication shortcuts
2. Each sutra as a card with scene + distinguisher

## D — Name (NEDF)
1. Vedic multiplication NEDF deck = sutra reflex deck
2. Distinguisher: algebraic-identity arithmetic
3. Failure mode: confusing sutras for similar inputs

## F — Do (SPEAR)
1. Drill sutra recognition
2. Apply to mental multiplication

## B — Watch (HEART)
1. Sutra mis-selection
2. Slow trigger recognition

## L — Predict (ORACLE)
1. Multiplication shape → predict sutra
2. Sutra → predict next step

## R — Act (GRACE)
1. Multiplication problem → recall sutra
2. Trigger spotted → apply sutra