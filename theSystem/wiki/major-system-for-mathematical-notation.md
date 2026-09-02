---
wiki_source: wiki/learning-systems/major-system-for-mathematical-notation.md
---

---
palace: strategic-memory
level: 3
domain: 10
room: 6
semantic_mode: 5
---

# Major System for Mathematical Notation

**Summary**: The Major System encodes digits only. Real-world quantities (Avogadro's number, the mass of the electron, the fine-structure constant, repeating decimals) carry structure beyond digits — decimal points, exponents, signs, units, and repetition markers. This page captures the two-camp debate on how to handle that structural overhead inside a Major-System workflow, proposes a small reserved-icon vocabulary for the cases context cannot supply, and names the trade-off: every reserved icon removes that image from the digit pool. The Major System itself is owned by [mnemonic-methods-master](./mnemonic-methods-master.md); this page is an *extension layer*, not a redefinition.

**Sources**:
- Clippings/Extending the Major System for Mathematical Notation.md (artofmemory forum thread, 2022-11-08; OP: `zvuv`, principal counterargument: `Daniel_360`)
- [mnemonic-methods-master](./mnemonic-methods-master.md) for the Major System's registered position (Tier 2, exact numeric encoding)

**Last updated**: 2026-05-13

---

## The gap

The Major System maps each consonant sound to a digit 0–9 and encodes numbers as memorable words formed from those consonants (with vowels and h/w/y as filler). This works well for arbitrary digit strings — phone numbers, dates, PIN codes. It does **not** natively encode:

- **Decimal points** — `17.6` vs `176` vs `1.76` all collapse to the same digit string `1·7·6`
- **Exponents** — `10⁻³¹` vs `10²³` are not digits at all; they are scaling operators
- **Sign** — negative quantities have no native Major-System representation
- **Repeating digit markers** — `0.333…` vs `0.333` exactly
- **Units** — `9.11 × 10⁻³¹ kg` vs `9.11 × 10⁻³¹ s` are different empirical facts about different brute properties of nature
- **Equals / approximation** — `=` vs `≈` distinguishes exact identities from empirical approximations

For most everyday mnemonic use this gap doesn't matter. For STEM users who need to recall physical constants, engineering tables, or repeated-fraction-to-decimal conversions, it does — these are the cases that motivated the source thread.

## The two camps

### Camp A — Context-elision (Daniel_360 in the source thread)

*"Only memorize the parts that are not obvious from context. Decimal placement, sign, and exponent can be reconstructed from domain knowledge."*

Worked examples from the source:

- Avogadro's number `6.022 × 10²³` — domain knowledge already tells you this is a *large* number of atoms in a mole, so memorizing only the digit string `60223` suffices; standard form fills the rest.
- Electron mass `9.11 × 10⁻³¹` — domain knowledge already tells you this is a *small* number relative to a household object, so memorizing only `91131` suffices.
- Repeating decimals — domain knowledge already tells you which fractions terminate vs repeat (only denominators whose prime factorization is `2ᵃ × 5ᵇ` terminate). So `1/9` encoded as digits `111` is unambiguously `0.111…`, not `0.111` exact.

When this camp works: the user has the domain understanding to reconstruct the missing structure on retrieval. The mnemonic stores only the empirical-brute-fact portion; understanding does the rest.

When this camp fails: when the user needs the constant for *calculation* and the calculation requires the operators to be present in working memory, not reconstructed from context. From zvuv's response in the source: *"In physics and engineering these values are used in calculations to derive other facts. The mass of an electron is a brute fact of nature whose value is obtained empirically. There is nothing more to understand about the number."*

### Camp B — Operator icons (zvuv's proposal)

*"Reserve a small set of distinctive images for operators and weave them into the encoded digit sequence."*

zvuv's worked example: choose **bullet** (`•`) for the decimal point. `17.6` then encodes as:

```
   1     ·     7    6
   D     •     T    CH       (Major System consonants + reserved icon)
   DoG · watCH                (the bullet-decimal cleanly separates the two digit chunks)
```

The trade-off is structural: once **bullet** is reserved for decimal point, the user **cannot also use** *bullet* as the Major-System scene for `951` (or whatever digit string the user normally encoded with that image). Every reserved operator icon removes one image from the digit-encoding pool.

This is a direct application of the substrate-cost reasoning that runs through [substrate-algorithm-composition](./substrate-algorithm-composition.md) and the [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the encoding substrate has finite capacity, and every special-purpose reservation reduces the digit-encoding capacity by one cell.

## The recommended hybrid for Neural OS

Neither camp is correct unconditionally. The Neural OS recommendation is:

| Memorization goal | Use |
|---|---|
| Recall the *value* of a constant for a written calculation (user has paper) | Camp A — context-elision. Encode only the digit string. |
| Recall the *value* of a constant for mental calculation under speed | Camp B — operator icons. The reconstruction cost during retrieval kills speed. |
| Store empirical brute facts where the order of magnitude is iconic of the domain (Avogadro is "molar", electron-mass is "subatomic") | Camp A — context-elision. The order-of-magnitude *is* the [NEDF](./nedf-overview.md) Distinguisher. |
| Store repeated decimals or exact fractions where the structure is the load-bearing claim | Camp B — operator icons. The "repeating" marker is information, not redundancy. |
| Store units (kg, m, s, J, …) | Camp A always — units are domain-typed, never confusable for digits. Bind the unit as a separate NEDF slot, not as an operator icon. |
| Store sign on values where sign is iconic (probabilities can't be negative, exponents of decimals are negative by convention) | Camp A — context. |
| Store sign on values where sign is genuinely ambiguous (electric charge, work, force projections) | Camp B — reserve a "minus" icon. |

This is structurally a [NEDF](./nedf-overview.md) design decision applied per constant. The Distinguisher slot is where context-elision lives ("this is the electron mass, not the proton mass — household-object scale"). The Name-hook is where the digit string goes. The Failure slot captures the operator-encoding choice ("if you reconstruct the exponent from context, mind that this is one of the rare negatives — most household-scale facts are positive exponents").

## A small operator vocabulary proposal

If the user does adopt Camp B for some constants, the operator set should be **small** (≤6 reserved icons) and the chosen images should be ones the user does *not* heavily use as digit-encoding scenes already. Suggested starter set:

| Operator | Reserved icon (placeholder — user picks own) | Rationale |
|---|---|---|
| `·` (decimal point) | bullet, pebble, period-shape | most common operator; deserves the cheapest icon |
| `−` (minus / negative) | dash, bandage, tally-mark | second-most-common operator |
| `×10ⁿ` (positive exponent) | upward arrow, balloon, tower | mnemonically "scaled up" |
| `×10⁻ⁿ` (negative exponent) | downward arrow, well, anchor | mnemonically "scaled down" |
| `…` (repeating decimal) | ouroboros, loop, ribbon | mnemonically "cycles back" |
| `≈` (approximation, not equality) | fuzzy edge, smoke, halo | mnemonically "not sharp" |

**Discipline**: once the user picks an icon for an operator, that icon is removed from the digit pool *permanently for that user's system*. Document the choices in a personal-system page (similar to how [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) documents one specific filled instance of [peg-audio-visual-matrix](./peg-audio-visual-matrix.md)). Do not re-use across contexts.

## Routing into Neural OS

- **[NEDF](./nedf-overview.md)** — each physical constant is one NEDF card. Name-hook = the digit string (with or without operator icons depending on Camp choice). Essence = the one-sentence physical meaning. Distinguisher = the order-of-magnitude and the nearest confusable constant ("electron mass vs proton mass"). Failure = the operator-reconstruction trap (negative exponent assumed, sign forgotten, decimal misplaced).
- **[peg-audio-visual-matrix](./peg-audio-visual-matrix.md)** — each operator icon reserved is one cell of the 10×10 matrix removed from the digit pool. Practical bound: don't reserve more than 6 cells across the full operator vocabulary, or the digit-encoding capacity degrades unacceptably.
- **[remaps](./remaps.md)** — operator icons benefit especially from the **A** (Associate / Aesthetic) and **E** (Exaggerate) moves because they are abstract concepts being forced into concrete images. The bullet for decimal point becomes more retrievable if it is a *specific, recurring* bullet (a particular shotgun shell, a specific bullet-train) rather than a generic dot.
- **[trachtenberg-system](./trachtenberg-system.md) / [vedic-speed-math](./vedic-speed-math.md) / Soroban Learning Method** — orthogonal layer. The mental-arithmetic substrates operate on digit streams in the moment; Major System extension is about *durable storage* of constants for later retrieval into the calculation. These complement each other; they do not compete.
- **[number-codec-ladder](./number-codec-ladder.md)** — the candidate challenger for the durable-storage role itself (matrix-cell deep pack + checksum seal). Two touchpoints: its retired 😇 Angel face is a natural candidate for the exponent icons in the operator vocabulary above (angel ascending = `×10⁺ⁿ`, falling = `×10⁻ⁿ`), and its seal protocol makes Camp-B-style structure *verifiable* rather than merely stored. Until its promotion gate is passed, this page's Camp A/B hybrid remains the ruling for constants.

## Failure modes

- **Reserving too many operator icons.** Each reservation removes an image from the digit pool. Past ~6 reservations the digit-encoding capacity degrades noticeably. Discipline: ≤6.
- **Mixing Camp A and Camp B inconsistently across constants.** If half your constants encode the decimal point and half don't, retrieval becomes a guessing game. Pick the Camp per constant *and write it in the NEDF card's Failure slot*.
- **Forgetting which icon means which operator.** The icon set itself is a small set of NEDF cards that needs maintenance. Drill it before relying on it for STEM constants.
- **Treating units as operators.** Units (kg, m, s) are domain-typed and rarely confusable; treating them as reserved icons wastes pool capacity. Keep units in a separate NEDF slot, not in the operator vocabulary.
- **Encoding exponents as digit strings.** `10⁻³¹` is not the digit string `1031` — it is "10 to the negative 31." If the user encodes `1031` they have eliminated the operator from working memory entirely. Either commit to an operator icon for the exponent or rely on context to reconstruct the sign.

## Open questions

- Is there empirical data on which Camp produces better long-term retention for STEM users? The source thread is opinion-based; no controlled comparison surfaced.
- Should there be a `personal-operator-vocabulary.md` page where the user documents their actual chosen icons? Defer until the user starts memorizing STEM constants at volume.
- Does the operator vocabulary need a parallel for *operations* (`+`, `−`, `×`, `÷`, `∫`, `Σ`)? The source thread does not discuss this. Probably yes for users doing formula memorization, not just constant memorization — defer until that use case surfaces.
- Connection to code-memorization's freeze-on-choose visual grammar (room=function, door=call, fork=if, …) — that page applies the same "reserve a small image vocabulary for structural operators" pattern to code. The two pages could share a common parent ("reserved-icon pattern") if a third instance appears.

## Related pages

- georgian-driving-exam-b-numeric-table — worked consumer: units/context-elision (Camp A) applied to exam numbers
- [mnemonic-methods-master](./mnemonic-methods-master.md) — registered owner of the Major System (Tier 2: exact numeric encoding)
- [nedf-overview](./nedf-overview.md) — per-constant NEDF card structure with operator handling in Distinguisher and Failure slots
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — finite-capacity digit pool that operator icons subtract from
- [remaps](./remaps.md) — moves for making abstract operator icons retrievable
- code-memorization — sister "reserved-icon vocabulary" pattern applied to code structure
- [trachtenberg-system](./trachtenberg-system.md) — uses the half-table and complement reflexes; orthogonal storage layer
- [vedic-speed-math](./vedic-speed-math.md) — operand-shape-dependent; constants stored via Major-System extension feed Vedic calculations
- [substrate-algorithm-composition](./substrate-algorithm-composition.md) — the trade-off named here (operator-icon-reservation reduces digit-pool capacity) is one instance of the substrate-cost pattern


---

## U — See (CAST)
1. Major system adapted for mathematical symbols
2. Maps digits/operators to consonants → words/scenes

## D — Name (NEDF)
1. Major system for math notation = phonetic encoder for math symbols
2. Distinguisher: extends Major beyond numbers to math
3. Failure mode: collision with classical Major usage

## F — Do (SPEAR)
1. Math expression → map digits + operators to consonants
2. Form word or scene

## B — Watch (HEART)
1. Collision with classical numbers
2. Operator-mapping drift

## L — Predict (ORACLE)
1. Expression → predict encoding word
2. Symbol → predict consonant

## R — Act (GRACE)
1. Math notation → encode via system
2. Drift → re-anchor mappings