---
palace: core-memory
level: 8
domain: 10
room: 9
para: resource
wiki_source: wiki/learning-systems/word-knowledge-links.md
---

# Word-Knowledge Links — what "knowing a word" decomposes into

**Summary**: A lens for auditing vocabulary material. [tip-of-the-tongue](./tip-of-the-tongue.md) establishes that a word is stored as an association across three neuron populations rather than as one entry; this page takes the operational consequence — three stores admit **six directed links**, each link is a separate memory drilled in one direction only, and "knowing a word" is however many of the six you actually trained. The audit it supports: lay a deck's card templates over the six links and read off which are unimplemented. Not a framework, not an encoder, no acronym — a coverage check that composes with [encoded-spaced-repetition](./encoded-spaced-repetition.md)'s retrieval operations.

**Sources**: Synthesis page — derived from existing wiki pages rather than from one raw source. Store model and its psycholinguistic evidence: [tip-of-the-tongue](./tip-of-the-tongue.md) (Genova *Remember* Ch 8; Brown & McNeill 1966). Link-counting for word types: [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) (Ягодкин/Згода, *Учись учиться*, 2023). Phonology-first ordering and PSSC: [fluent-forever-wyner](./fluent-forever-wyner.md). Scaffold-drop criterion: [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md). Worked instance: `tools/french-1000/` (deck build, 2026-07-20).

**Last updated**: 2026-07-20

---

## The rule

A word is not one memory. It is three stores joined by **directed links**, and a link exists only in the direction it was drilled.

The three stores — visual, conceptual, phonological — are defined and owned by [tip-of-the-tongue](./tip-of-the-tongue.md); that page is where the mechanism and its evidence live, and this page does not restate them. What it adds is the arithmetic: three stores admit six directed links, and the wiki's existing vocabulary pages each train some subset without naming which.

Tip-of-the-tongue is the proof that the links are separately stored rather than being one lump. In a TOT state the cue is present, recognition would succeed, and production still fails — one link is down while the others are intact. That is only possible if the links are independent memories.

**The six links are a set, not a ladder.** They have no inherent order and no level numbers; where any drilled link sits on an ordered progression is [skill-progression-stages](./skill-progression-stages.md)'s call, and this page assigns none.

## The six links

| Link | The ability it *is* | Fails as |
|---|---|---|
| visual → conceptual | read the word | can't read |
| phonological → conceptual | understand it heard | can't follow speech |
| conceptual → phonological | say it | tip-of-the-tongue |
| conceptual → visual | write it from meaning | can't compose in writing |
| phonological → visual | write it from dictation | can't spell what you can say |
| visual → phonological | read it aloud correctly | can't pronounce what you can read |

Two properties make the table worth having.

**Links are directional, and drilling one does not install its inverse.** [tip-of-the-tongue](./tip-of-the-tongue.md) gives the mechanism: recognition requires only matching incoming input against a stored pattern, while production requires generating that pattern from scratch. The two directions are not the same operation and do not train together.

**Different word types need different numbers of links.** [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) makes this concrete for function words: there is no firm native-word-to-image link to build on, so you must memorise both the sound-to-meaning link and a meaning-to-image link — "two links where other words need one." This is the real argument for tiering a vocabulary list. Function words are not skipped because they are unimportant; they are skipped because cold-drilling them costs double.

## Where the mnemonic sits

A phonetic-bridge mnemonic ([fluent-forever-wyner](./fluent-forever-wyner.md), [substitute-word-system](./substitute-word-system.md)) is not a seventh link. It is a **temporary scaffold on the conceptual↔phonological pair**, and it has a documented drop criterion: [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md)'s *recall overtakes image* — drill until the word is recalled faster than the image attached to it. [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) says the same of phonetic image-codes, calling them explicitly a scaffold dropped once the direct link forms.

This has a consequence that the audit exists to catch: **a strong phonetic mnemonic routes around the visual store entirely.** It binds sound to meaning and never touches letters. The better the mnemonic, the more completely a deck can appear to teach a word while leaving half its links at zero reps.

Phonology is likewise **not** one of the six. Per [fluent-forever-wyner](./fluent-forever-wyner.md), grapheme-to-sound correspondence (PSSC) is a *prerequisite layer* drilled before vocabulary work, on the argument that "until phonology comes online, comprehensible input doesn't fully parse and vocabulary doesn't fully bind." In link terms PSSC is sub-lexical: it installs visual→phonological for *graphemes*, so that the same link at the *word* level has rules to run on.

## The audit

Lay a deck's card templates over the six links; unimplemented links are the finding. Two rules keep it honest:

- **A revealed answer is not a trained link.** A card that shows the written form on the back trains recognition of it at best. Unless the link's output is *produced and checked*, score it untrained.
- **Score per link, not per card.** One card can train two links (audio prompt + written prompt), and one link can be split across several cards.

**Worked instance — `tools/french-1000/` (2026-07-20).** A 697-word French deck with trilingual phonetic mnemonics and native TTS audio, carrying two card templates:

| Template | Links trained |
|---|---|
| FR → meaning (word shown + audio) | visual→conceptual, phonological→conceptual |
| EN → FR (self-graded) | conceptual→phonological |

Three of six. The **entire visual store had no production path**, and the deck's greatest strength hid it: 353 hand-authored phonetic bridges all bound sound to meaning. French is the worst language to lose that link in, because its spelling is near-deterministic when read and many-to-one when written (the sound /o/ is written `o`, `au`, `eau`, `ot`, `aut` — the ear cannot pick).

The repair maps one-to-one onto the missing links: a **dictation card** (audio → type the word, machine-checked) for phonological→visual, and a **grapheme rules deck** for visual→phonological at the PSSC level. `conceptual→visual` — write the word from meaning alone, unaided by sound — remains untrained, and is recorded here as a known gap rather than quietly closed.

## METER fit

- `vocab.link_coverage {deck, links_trained, links_total}` — logged when a deck is built or audited. A deck below 4/6 is flagged, not failed; the missing links may be deliberate (a reading-only deck legitimately skips production).
- Per-link pass-floor: **recall overtakes image** ([yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md)) — no new floor is minted here, and the rep-count in that source is an empirical observation, not a standard.
- Falsifier: the lens earns its place while auditing a real deck surfaces at least one untrained link its owner had not already named. Satisfied once (`french-1000`, phonological→visual). A second independent instance promotes it from lens to something the wiki cites by default; zero further instances in ~3 months demotes it to a paragraph on [vocabulary-word-type-routing](./vocabulary-word-type-routing.md).

## Composition with retrieval operations

This lens is orthogonal to [encoded-spaced-repetition](./encoded-spaced-repetition.md)'s four retrieval operations (Recognition · Recall · Discrimination · Diagnosis), and the two must not be collapsed. ESR answers *which cognitive operation* a card drills; this answers *between which two stores*. Every card carries both coordinates — the French dictation card is `phonological→visual × Recall`. A deck can be complete on one axis and empty on the other, which is why both are needed to describe what a card actually trains.

## Failure modes

1. **Adding a store.** The stores are owned by [tip-of-the-tongue](./tip-of-the-tongue.md); bolting on a fourth (motor, collocational, orthographic) breaks the arithmetic and forks a registered definition. Collocation is handled as sentence-mining ([fluent-forever-wyner](./fluent-forever-wyner.md)), not as a store.
2. **Treating a sense as a link.** A second meaning of the same word is a separate address, not another link on the first — [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) is explicit that identical words with different meanings are stored in different places and reproduce as different words. One meaning per sitting.
3. **Counting a revealed answer as a trained link.** The most common way an audit lies to you.
4. **Chasing 6/6 on every word.** Coverage is a design decision, not a target. A recognition-only deck for reading is a legitimate 2/6; the lens exists to make the choice explicit, not to demand completeness.
5. **Reading the six as a sequence.** They are unordered; see [skill-progression-stages](./skill-progression-stages.md).

## Mnemonic

**A word is a triangle, and every side is a one-way street.** Three corners (the stores), six one-way streets between them. You can drive a street a thousand times and the opposite direction stays unpaved — which is exactly what tip-of-the-tongue feels like from inside the car.

## Checksum

1. Six links, not three — every store pair is two separate memories. Naming three is the error the lens exists to catch.
2. The stores belong to [tip-of-the-tongue](./tip-of-the-tongue.md); this page owns only the links and the audit.
3. A phonetic mnemonic is a scaffold on one pair, dropped at *recall overtakes image* — not a link, and it hides the visual store while it stands.
4. The six are a set, not a ladder; ordering questions go to [skill-progression-stages](./skill-progression-stages.md).

## Visual

A triangle labelled at its corners, with doubled arrows on each side — twelve arrowheads for six streets. Shade the streets a given deck actually paves; the unshaded ones are the audit result. For `french-1000` at the moment of the audit, the entire bottom edge and both approaches to the visual corner sat unshaded while the sound-meaning edge was worn smooth from 353 mnemonics.

---

## U — See (CAST)

1. Three-corner triangle; six directed edges; each edge is an independently scheduled memory
2. Edges to [tip-of-the-tongue](./tip-of-the-tongue.md) (stores), [encoded-spaced-repetition](./encoded-spaced-repetition.md) (orthogonal operation axis), [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) (per-type link counts)

## D — Name (NEDF)

1. The decomposition of "knowing a word" the wiki previously had scattered across five pages
2. A lens for auditing decks, not an encoder and not a framework
3. Reach for it when a vocabulary deck feels complete but performance is lopsided

## F — Do (SPEAR)

1. List the deck's card templates
2. Map each to the links it trains — output produced and checked, or it doesn't count
3. Read off the unimplemented links
4. Decide per link: implement, or record as a deliberate gap
5. Log `vocab.link_coverage`

## B — Watch (HEART)

1. A deck with rich mnemonics and no typing anywhere → visual store almost certainly untrained
2. "I know this word but can't spell/say/write it" → name the link, don't re-drill the word
3. Someone proposing a fourth store → route to [tip-of-the-tongue](./tip-of-the-tongue.md)
4. An audit that returns 6/6 on first pass → the scoring was too generous, re-check rule 1

## L — Predict (ORACLE)

1. Adding a missing link to N mature words feels disproportionately hard — that link is at zero reps while its neighbours are mature
2. Mnemonic-heavy decks will under-train the visual store specifically
3. Languages with opaque orthography (French, English) pay the highest cost for a missing phonological→visual link; transparent ones (Georgian, Spanish) pay almost none
4. Function words will need roughly double the reps of concrete words at equal frequency

## R — Act (GRACE)

1. Building a vocabulary deck → run the audit before generating cards, not after
2. Lopsided performance in an L2 → audit links before adding volume
3. Choosing what to skip → skip by link, and write down which

---

## Related pages

- [tip-of-the-tongue](./tip-of-the-tongue.md) — owner of the three-store model this page's links run between
- [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) — per-word-type link counts; the function-word "two links where others need one" case
- [fluent-forever-wyner](./fluent-forever-wyner.md) — PSSC as the sub-lexical prerequisite layer; phonology-first ordering
- [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md) — the *recall overtakes image* scaffold-drop floor reused here
- [substitute-word-system](./substitute-word-system.md) · [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) — the scaffold that sits on the conceptual↔phonological pair
- [encoded-spaced-repetition](./encoded-spaced-repetition.md) — the orthogonal retrieval-operation axis; every card carries both coordinates
- [language-learning-architecture](./language-learning-architecture.md) — §Layer 2 Lexicon and Concept Layer is this lens's home in the skill-type taxonomy
- [comprehensible-input-protocol](./comprehensible-input-protocol.md) — governs which words are worth linking at all
- [skill-progression-stages](./skill-progression-stages.md) — owns all stage and level numbering; the six links carry none
- [active-recall](./active-recall.md) — the produced-and-checked requirement rule 1 depends on
