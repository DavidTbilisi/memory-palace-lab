---
palace: core-memory
level: 7
domain: 10
room: 1
semantic_mode: 5
wiki_source: wiki/learning-systems/mnemonic-methods-master.md
---

# Mnemonic Methods Master Reference

**Summary**: The canonical reference for which mnemonic method to use, when, and how to measure whether it's working. Ranks the methods Neural OS supports by their actual leverage per domain, lists the operational contract for each, and routes users to the right method based on what they are trying to remember rather than which method sounds clever. This is the answer to *"of all the mnemonic methods, which one fits this material?"*

**Sources**:
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [nedf-overview](./nedf-overview.md)
- [cast-overview](./cast-overview.md)
- [spear-overview](./spear-overview.md)
- [heart-overview](./heart-overview.md)
- [oracle-overview](./oracle-overview.md)
- [grace-overview](./grace-overview.md)
- [mnemonics](./mnemonics.md)
- [symbolic-encoding-systems](./symbolic-encoding-systems.md)
- [motoric-encoding-systems](./motoric-encoding-systems.md)
- Soroban Learning Method
- [georgian-animals](./georgian-animals.md)
- Design conversation, 2026-05-07

**Last updated**: 2026-08-21 — the Tier 2 [Peg System](./peg-system.md) row and the Major System's peg reference now link to their owner, which was named here as a method before it had a page; 2026-05-12

---

## Why This Page Exists

Neural OS's strongest historical claim is its mnemonic toolkit. That toolkit has grown to the point where the user has six encoders, two cross-cutting layers, eight motoric systems, two symbolic systems, a calendar / months / archetype overlay, and dozens of pattern libraries. The risk: paralysis by choice — a person facing material has no canonical guide for *which* method to reach for.

This page is that guide. It does three things:

1. **Ranks** the methods by leverage per domain
2. **Routes** material to method by question type
3. **Specifies** the operational contract for each method (what to encode, how to measure, when to retire)

Where other pages explain *how* a method works, this page explains *whether to use it at all*.

## The Tier 1 Spine — Use These First

These are the mnemonic methods that give the highest leverage for the broadest range of material. Master these before reaching for anything else.

| Rank | Method | Best for | Time to encoded | Time to fluent | Where to learn it |
|---|---|---|---|---|---|
| 1 | **Memory Palace + [NEDF](./nedf-overview.md)** | Concepts, terms, definitions, mental models | ~2 min/concept | ~7 days | [Memory Palace](./memory-palace-architecture-for-neural-os.md) + [nedf-overview](./nedf-overview.md) |
| 2 | **[CAST](./cast-overview.md)** | Systems, graphs, dependencies, flows | ~5 min/edge | ~14 days | [cast-overview](./cast-overview.md) |
| 3 | **[SPEAR](./spear-overview.md)** | Procedures, algorithms, workflows | ~5 min/step | ~14 days | [spear-overview](./spear-overview.md) |
| 4 | **[HEART](./heart-overview.md)** | People, behavioral patterns | ~10 min/person | ~30 days | [heart-overview](./heart-overview.md) |
| 5 | **[ORACLE](./oracle-overview.md)** | Predictive material (sequences, anomalies) | ~3 min/face | ~14 days | [oracle-overview](./oracle-overview.md) |
| 6 | **[GRACE](./grace-overview.md)** | Social moves on a gradient | ~5 min/card | ~30 days | [grace-overview](./grace-overview.md) |

**Discipline rule**: do not reach for Tier 2 or Tier 3 methods until the Tier 1 spine is fluent. Most failures of mnemonic technique come from skipping Tier 1 and trying to memorize a phone number with the major system before being able to memorize a concept with NEDF.

## The Tier 2 Encoder Primitives — Specialized Tools

These are sharper, more specialized tools. They are powerful but only for specific material types. Use them as inputs to Tier 1 methods, not as standalone systems.

| Method | Best for | Riding inside |
|---|---|---|
| **PAO (Person-Action-Object)** | Long number sequences, card sequences | NEDF Name-hook slot; CAST node identity |
| **Major System** | Exact numeric encoding | NEDF, [peg system](./peg-system.md) anchor. STEM users needing decimal points, exponents, signs, or repetition markers see the extension layer at [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) |
| **[Peg System](./peg-system.md)** | Ordered short lists with stable positions | Memory palace seed; CAST tier-1 anchor |
| **[Name-Face Fast-Encode](./name-face-fast-encode.md)** | A stranger's name + face at a first meeting (sub-5s live capture) | HEART Recognition doorway; promotes to a full HEART room if the person recurs |
| **[Georgian Animals](./georgian-animals.md)** | Identity layer for CAST nodes | CAST node encoding (33 mapped letters) |
| **[Braille / Morse](./symbolic-encoding-systems.md)** | Exact letter-level encoding | NEDF when name-hook needs exact spelling |
| **[Hand-to-letter](./hand-to-letter-system.md)** | Body-mapped alphabet for tactile fluency | NEDF; rapid silent encoding |
| **[Hand-to-number](./hand-to-number-system.md)** | Short exact numbers without paper | NEDF, peg backup |
| **Trigonometry compass palace** | Angle / quadrant / sign relationships | Math-domain CAST |
| **[Number Codec Ladder](./number-codec-ladder.md)** *(candidate)* | Numbers across the whole latency band — in-calculation state through large-number archival, self-verifying via its [Checksum Seal](./number-codec-ladder.md); wide-pack width adds sprint/archival modes at PAO-unit density | Soroban substrate + [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) cells + memory-palace loci; challenges the PAO + Major long-number ruling pending its 24h falsifier (+ speed gate) |
| **[Onset Peg Alphabet](./onset-peg-alphabet.md)** *(candidate)* | Vocabulary acquisition — freezes a fixed image per recurring word-onset (`sw`, `con`, `str`…) so encoding a new word is onset-lookup + rime-peg, not fresh decomposition | Feeds [Substitute Word](./substitute-word-system.md) as its cached onset layer; the Major System's lookup architecture applied to syllable onsets; promotes only if it beats fresh decomposition on the clock and survives its collision-recall test |

The principle: these don't replace the Tier 1 encoders. They feed Tier 1 encoders with sharper primitives. A NEDF card for a chemistry term might use Braille to encode the exact spelling and PAO to encode the atomic number — but the card itself is still a NEDF card.

## The Tier 3 Embodied / Motoric Layer — Hidden Bandwidth

Embodiment is bandwidth most users leave on the table. The hand alone is a 50-channel mnemonic surface. Use these when verbal/spatial encoding is saturated or when speed-of-recall matters more than precision.

| Method | Best for |
|---|---|
| [bigram-tap-system](./bigram-tap-system.md) | Compress letter pairs into single tap gestures (high-frequency English bigrams) |
| [finger-procedure-system](./finger-procedure-system.md) | Replay short procedures as thumb-to-pinky walks |
| [palm-zone-category-system](./palm-zone-category-system.md) | Use stable palm regions as category slots |
| [bilateral-contrast-system](./bilateral-contrast-system.md) | Encode paired contrasts with left-right body separation |
| [finger-rhythm-code](./finger-rhythm-code.md) | Minimal rhythm-based tap code for very short chunks |
| [hand-phonetic-system](./hand-phonetic-system.md) | Vowels / consonant families on the hands for sound-based rehearsal |
| [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md) | Gaze direction as embodied retrieval cue |
| [motoric-encoding-systems](./motoric-encoding-systems.md) | Parent page covering the full embodied toolkit |

Tier 3 is where Neural OS most clearly distinguishes itself from purely verbal mnemonic systems. But it is also the easiest tier to over-invest in — beautiful gestures don't compensate for absent NEDF cards. Use Tier 3 only after the Tier 1 spine is fluent.

## The Tier 4 Domain Overlays — Structure That Comes Pre-built

These are pre-built mnemonic structures usable as palaces or routes. Don't reinvent these — adopt them.

| Overlay | Pre-built structure | Use for |
|---|---|---|
| Calendar (days / weeks / months) | Day-week-month layered palace; month-archetype overlay | Time-anchored material; biographical / historical sequences |
| [jungian-12-archetypes-as-month-mnemonics](./jungian-12-archetypes-as-month-mnemonics.md) | January-December archetype mapping | Month memory; calendar memory chain |
| psychology-os-framework | Six-room behavior diagnostic palace | Psychology / behavior material |
| bible-canonical-palace | 66-locus canonical palace | Bible study, biblical history |
| [trigonometry-compass-palace](./trigonometry-compass-palace.md) | Compass direction → unit circle mapping | Trigonometry, angles, signs |
| aws-city-palace | AWS service families as a city geography | AWS / cloud architecture |
| [geography-mnemonic-route](./geography-mnemonic-route.md) · world-flags-deck | World Palace continent walls; flags as confusability-first cluster glyphs | Maps, countries, capitals, national flags |
| Soroban + mnemonic arithmetic | Bead positions + complement pegs | Mental arithmetic, base conversions |

When you start a new domain, check if a Tier 4 overlay exists before building a fresh palace. The overlays are usually load-bearing — they get the spatial and pattern work done so you can focus on the domain content.

## Method Selection By Question Type

The fastest router. Given what you're trying to remember, run this:

| If your material is... | Reach for... | Don't use... |
|---|---|---|
| A definition or abstract concept | NEDF | CAST (overkill for one node) |
| A relationship between concepts | CAST | NEDF (loses the structure) |
| A procedure or algorithm | SPEAR | NEDF (wrong shape) |
| A person or behavior pattern | HEART | NEDF (loses falsifiability) |
| A name + face at a first meeting | [Name-Face Fast-Encode](./name-face-fast-encode.md) (Tier-2) → HEART if they recur | HEART full room (too heavy for a stranger seen once) |
| A predictable next step / sequence | ORACLE sequential | SPEAR (different shape) |
| A wrongness sense / anomaly | ORACLE anomaly | NEDF Failure slot alone |
| A graded social move | GRACE | HEART (person-specific only) |
| A long number | PAO + Major System — standing ruling; candidate challenger: [number-codec-ladder](./number-codec-ladder.md) (promotes only if it passes its 24h falsifier) | NEDF (no precision) |
| Card sequences | PAO | Memory palace alone (no identity) |
| An ordered short list | Peg system + memory palace | Pure list (no anchors) |
| Exact spelling | Braille or Hand-to-letter | NEDF name-hook (loses precision) |
| A short procedure to run silently | Finger walk + SPEAR | NEDF (wrong shape) |
| Bilateral / contrastive material | Bilateral contrast system | Linear list |
| Time / dates / months | Calendar overlay + archetype mnemonic | Pure date strings |

## Operational Contract Per Method

Each method should be used with the same operational discipline. The contract:

1. **Encoding**: artifact created in the canonical encoder format (NEDF card, CAST graph, etc.)
2. **Review schedule**: SR via Anki (default Anki scheduler unless overridden)
3. **Performance gate**: passes through [red-queen-skill-gym](./red-queen-skill-gym.md) for the appropriate workout type
4. **Retirement**: subject to [lifecycle-manager](./lifecycle-manager.md) standard tier ladder
5. **Measurement**: emits METER events; pass/floor thresholds per [meter-overview](./meter-overview.md#layer-specific-metric-definitions)
6. **State modulation**: PULSE-modulated (low-state sessions skip new high-load encoding, prefer mature-card review)

If a mnemonic method does not fit this contract, it is a personal trick rather than part of Neural OS. That's fine — keep it personal — but don't expect the system to measure or retire it.

## What "Best" Means In This Page

"Best" is operationally defined as: **highest leverage per minute invested**, measured by:

- Time-to-fluent for the typical user (lower is better)
- Coverage breadth (how many domains it works for)
- Compatibility with the rest of Neural OS
- Floor / pass thresholds achievable in [METER](./meter-overview.md)
- Retirement compatibility with [lifecycle-manager](./lifecycle-manager.md)

This is why the Tier 1 spine ranks above Tier 2 / 3 / 4 — not because the others are weaker individually, but because their leverage is narrower. A skilled PAO practitioner can encode a deck of cards in 60 seconds; the same person cannot encode an algorithm or a person model with PAO. Generality compounds.

## Common Mnemonic Anti-Patterns

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| **Method tourism** | Trying every method on the same material; never going deep on one | Pick the Tier 1 method that fits; commit for 30 days; measure via METER |
| **Tier-skipping** | Reaching for PAO before NEDF is fluent | Tier 1 first; Tier 2/3 only after Tier 1 hits pass thresholds |
| **Vivid-without-discriminable** | Memorable image but can't tell two cards apart | NEDF Distinguisher slot is required; vivid alone is not enough |
| **Palace inflation** | Building palaces for material that doesn't need spatial structure | Use NEDF without palace if the material is flat; palace only when ≥5 related concepts |
| **Overlay collisions** | Using the calendar palace for both biographical memory and a course schedule | One palace = one organizing principle; create a sibling overlay if reuse collides |
| **Embodiment overload** | Encoding everything as gestures because gestures are fun | Tier 3 is sparingly used; one body-channel at a time per domain |
| **No retirement** | All mnemonic content stays Active forever; bloat compounds | [lifecycle-manager](./lifecycle-manager.md) is mandatory; review the Cold tier monthly |
| **No measurement** | Encoding without ever testing whether retrieval works | METER events are emitted on every review; absence of testing is the failure |

## How To Pick Your First Method (For New Users)

If you've never used a mnemonic system, the order is:

1. **Memory palace** — pick a familiar building, walk it, place 5 things, retrieve them tomorrow
2. **NEDF** — encode 5 concepts as NEDF cards, place them in the palace
3. **SR via Anki** — review the 5 cards on Anki's default schedule for 7 days
4. **CAST** — pick 5 concepts that are connected, encode the connections as edges
5. **SPEAR** — pick one procedure, encode it as a story-chain

Five concepts, five days each, ~25 days. At that point you have hands-on experience with four Tier 1 encoders and the SR cycle. Everything else builds on that foundation.

See neural-os-30-day-rollout for the full week-by-week schedule.

## Failure Modes Specific To Mnemonic Method Selection

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Wrong-tier escalation** | "I want to memorize a phone number — let me build a palace for it" | Phone numbers want PAO + Major System (Tier 2), not a palace (Tier 1 spatial structure for ≥5 related items) |
| **Domain-method mismatch** | Using HEART for an algorithm or SPEAR for a person | Run the question-type router above before encoding |
| **Single-method monoculture** | Using NEDF for everything because it was the first method learned | A single method handles ~60% of material; the other 40% needs the right shape |
| **Pre-mature method invention** | Building a custom mnemonic before exhausting Tier 1-4 | Almost no real material falls outside Tier 1-4 once domain overlays are considered |
| **Measurement absence** | "I think I remember this" without ever testing | METER mandates testing; if a method doesn't emit measurable events, it's not part of Neural OS |

## Calibration Defaults

- Tier 1 fluency before Tier 2: ≥85% accuracy on Tier 1 NEDF / CAST / SPEAR cards over 30 sessions
- Tier 2/3/4 introduction: only after Tier 1 fluency confirmed via METER
- Method monoculture detection: if >70% of cards in a palace use one method, METER flags as `monoculture-suspected`
- New domain default: check Tier 4 overlays before building fresh
- Retirement compatibility check: every new method must produce events that fit METER's schema

**External Major-System floors (Giordano/[GMS](./kozarenko-mnemotechnics.md) calibration).** The [Giordano school](./kozarenko-mnemotechnics.md) runs the most measured mnemonics curriculum in the corpus and supplies hard, externally-drilled floors for the Tier-2 Major System / number-code work above (source: GMS_V.Kozarenko.pdf; see [giordano-graded-curriculum](./giordano-graded-curriculum.md) for the graded rubric):

- Number-image code recognition: **≤0.5s per item** to automaticity (no hesitation).
- Bulk number encoding: **100 two-digit numbers in 10 minutes at ≤10% error** (shown once, exam-mode).
- Association formation: **~6s to bind one image-pair** (trainable toward 4s).
- Long-digit recall: a Pi-digit drill at **~100 lines/hour** as a "low but good" reference throughput.

**Cross-school view.** The router above is the Neural OS column only. For the same routing decision with the two Russian schools' answers beside it — Advance ([yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md)) and Giordano ([kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md)) — indexed by material rather than by method, see [cross-school-encoding-router](./cross-school-encoding-router.md). That page also carries the merged pass-floor shelf (absolute floors from Giordano, the relative floor from Advance, METER thresholds here).

## Bottom Line

Neural OS's mnemonic toolkit is wider than what any one user needs day-to-day. The Tier 1 spine — Memory Palace + NEDF + CAST + SPEAR + HEART + ORACLE + GRACE — covers ~80% of all material. Tier 2 primitives sharpen specific slots inside Tier 1 cards. Tier 3 embodied methods are bandwidth multipliers once the spine is fluent. Tier 4 domain overlays save the spatial-and-pattern work when entering a known domain. Use this page as the canonical router; commit to one method per material type long enough for METER to measure whether it's working.

## Diagrams

Four-tier hierarchy — Tier 1 spine (the six encoders), Tier 2 encoder primitives, Tier 3 embodied/motoric layer, Tier 4 domain overlays — with a "given material → reach for" routing table at the bottom:

![mnemonic-methods-master schematic](../diagrams/20-mnemonic-methods-master.png)

Hero — the four-floor craftsman's tower metaphor: top floor (most prominent) holds the six spine anvils; second floor a tool-primitives workshop; third floor an embodied-craft studio with hand-shaped molds; bottom floor a domain-overlay map room. A routing clerk at the ground level points incoming material to the right floor:

![mnemonic-methods-master hero](../diagrams/heroes/mnemonic-methods-master.png)

## Related Pages

- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [nedf-overview](./nedf-overview.md)
- [cast-overview](./cast-overview.md)
- [spear-overview](./spear-overview.md)
- [heart-overview](./heart-overview.md)
- [oracle-overview](./oracle-overview.md)
- [grace-overview](./grace-overview.md)
- [symbolic-encoding-systems](./symbolic-encoding-systems.md)
- [motoric-encoding-systems](./motoric-encoding-systems.md)
- [hand-to-letter-system](./hand-to-letter-system.md)
- [hand-to-number-system](./hand-to-number-system.md)
- [bigram-tap-system](./bigram-tap-system.md)
- [finger-procedure-system](./finger-procedure-system.md)
- [bilateral-contrast-system](./bilateral-contrast-system.md)
- [finger-rhythm-code](./finger-rhythm-code.md)
- [palm-zone-category-system](./palm-zone-category-system.md)
- [hand-phonetic-system](./hand-phonetic-system.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)
- [peg-system](./peg-system.md) — the trunk method the five peg sets in this wiki instantiate; order in the index rather than in a route
- [dozenal-edge-peg](./dozenal-edge-peg.md) — the cube's 12 edges as self-addressing base-12 pegs
- [georgian-animals](./georgian-animals.md)
- Soroban Learning Method
- [vedic-speed-math](./vedic-speed-math.md) — algebraic-identity arithmetic; mental-math sister of Soroban
- [trachtenberg-system](./trachtenberg-system.md) — digit-walking arithmetic; mental-math sister of Soroban and Vedic; works with no substrate beyond working memory itself
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — extension layer for the Tier 2 Major System; handles operators (decimal point, exponent, sign, repetition marker) for STEM users
- [spatial-coding](./spatial-coding.md) — Tier 2 positional-channel primitive; reads order/datum/arithmetic off the geometry of a locus or association at no extra encoding cost
- [table-of-support-images](./table-of-support-images.md) · [four-level-blocks](./four-level-blocks.md) — Kozarenko's two self-generating addressable-loci stores (global ~900-cell number table vs. per-topic 125-cell Matryoshka block)
- [prose-memorization](./prose-memorization.md) — routing guide for expository/textbook prose (the third case beside code and verse memorization)
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) — constraint-aware reading of the encoder spine; promotes the Tier 3 motoric family to first-line under aphantasia
- [trigonometry-compass-palace](./trigonometry-compass-palace.md)
- psychology-os-framework
- bible-canonical-palace
- aws-city-palace
- [jungian-12-archetypes-as-month-mnemonics](./jungian-12-archetypes-as-month-mnemonics.md)
- [mnemonics](./mnemonics.md)
- [meter-overview](./meter-overview.md)
- [lifecycle-manager](./lifecycle-manager.md)
- neural-os-30-day-rollout
- neural-os-daily-loop
- [mastery-tree](./mastery-tree.md)


---

## U — See (CAST)
1. Canonical reference for which mnemonic method to use
2. Ranks methods by leverage per domain

## D — Name (NEDF)
1. Mnemonic methods master = method-selection oracle
2. Distinguisher: answers "which method for this material?"
3. Failure mode: picking method by familiarity, not fit

## F — Do (SPEAR)
1. Material to memorize → consult this page
2. Match material class to method

## B — Watch (HEART)
1. Method-tribal drift
2. Skipping the contract per method

## L — Predict (ORACLE)
1. Material class → predict best method
2. Method → predict leverage

## R — Act (GRACE)
1. New material → consult master
2. Method failing → re-route via this page

## Related pages

- **2026-05-29 learning-canon cross-links**: [buzan-your-memory](./buzan-your-memory.md) (canonical taxonomy: 5 systems + 12 Secret Principles) · [person-action-object-system](./person-action-object-system.md) (championship-tier digit encoding) · [foer-moonwalking-with-einstein](./foer-moonwalking-with-einstein.md) · [buzan-mind-map-mastery](./buzan-mind-map-mastery.md) · [serial-position-curve](./serial-position-curve.md) (Von Restorff vividness multiplier)
