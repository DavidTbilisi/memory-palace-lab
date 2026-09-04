---
palace: strategic-memory
level: 6
domain: 10
room: 1
semantic_mode: 5
wiki_source: wiki/learning-systems/language-learning-architecture.md
---

# Language Learning Architecture

**Summary**: A proposed language-learning architecture for Neural OS that composes existing frameworks rather than replacing them. It uses [NEDF](./nedf-overview.md) for concept knowledge, [CAST](./cast-overview.md) for relational structure, [SPEAR](./spear-overview.md) for production routines, and [UMTF](./universal-mental-tagging-framework.md) for phonological, prosodic, and salience design.

**Sources**:
- raw/06 Buffer/language_learning.md
- FRAMEWORK_OVERVIEW.md
- 03_NEDF_TEMPLATE.md
- 05_SPEAR_TEMPLATE.md
- CAST and Georgian Node System.md
- HEART_OVERVIEW.md
- PEOPLE_PALACE_STRUCTURE.md
- wiki/learning-systems/krashen-sla-hypotheses.md (acquisition layer)
- wiki/learning-systems/language-family-clustering.md (strategic sequencing layer)
- raw/05 Meta_Knowledge/Mnemonics/Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf §"Когнитивный подход в изучении иностранных языков" (curriculum sequencing layer — Advance course composition)

**Last updated**: 2026-07-16

---

## Load-bearing addition (2026-05-29): The Acquisition Layer

The original architecture (layers 1–9 below) is a strong *study* and *production* stack. The 2026-05-29 ingest from [Krashen](./krashen-sla-hypotheses.md) and [Wyner](./fluent-forever-wyner.md) reveals a critical structural gap: **the acquisition mechanism is not represented**.

The architecture was optimized for encoding, retrieval, and production speed — but [Krashen's Acquisition-Learning Distinction](./krashen-sla-hypotheses.md) establishes that only *acquired* (not *learned*) language produces automatic fluent output. The acquisition mechanism runs on **comprehensible input at i+1**, not on drill. The 9 layers below handle the *learning* side excellently; the acquisition side requires a 10th layer and a governing protocol.

**Layer 10 (new): Comprehensible Input and Acquisition**

This layer is not a drill loop — it is the engine. See [comprehensible-input-protocol](./comprehensible-input-protocol.md) for the full operational spec. Summary:
- 70% of daily SLA time = comprehensible input (reading + listening at 95% known-words rate)
- 30% = explicit encoding + Anki review (the nine study layers below)
- Pre-check PULSE before each session: if S≥4, route to passive input only (stress suppresses [BDNF](./bdnf-and-neurogenesis.md) and raises [Affective Filter](./krashen-sla-hypotheses.md))

The architecture was also missing a **strategic sequencing** layer — which language to learn next and why. This is covered by [language-family-clustering](./language-family-clustering.md), which provides transfer-based sequencing rules that compress 10-language acquisition from ~10,000 to ~4,100 hours.

---

## Load-bearing addition (2026-07-16): The Curriculum Sequencing Layer

Layers 1–10 are a taxonomy of **skill types**. They answer *what capability is needed* — phonology, lexicon, grammar, production, prediction, pragmatics, automaticity, transfer, governance, acquisition. None of them answers **in what order, and interleaved how**. Sequencing was left as an implementation detail inside each layer, which means the architecture had nowhere to hold the decision every real course must make: what comes first, what gets chained to what, and what happens at the boundary between two sessions.

The 2026-07-16 ingest of Advance's course-composition model supplies that missing meta-layer. It is not another skill type and does not belong *inside* the stack — it is the composition rule that **operates on** the stack. It sits above layers 1–10.

**Layer 11 (new): Curriculum Sequencing**

Advance's mnemonic lineage and underlying theory are owned by [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md); its repetition scheduling is owned by [storm-and-siege-protocol](./storm-and-siege-protocol.md). This section covers only the composition model — how the layers get ordered and interleaved into lessons and courses.

### Vocabulary-first sequencing

Advance courses do not open with greeting phrases. The source argues against the standard "Hello, how are you?" opening on encoding grounds: greeting phrases are built from abstract, low-imagery words, so they can only be learned by repetition-drilling, decay per the Ebbinghaus curve after the session, and are often stored unsegmented — the student hears one card, `Howareyou`, and defends with another, `Iamfinethanks`, without ever parsing the words. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

Instead, courses open with mnemonic encoding of roughly **200 image-bearing nouns** plus the most easily visualised verbs and adjectives (needs verification — Advance-internal). Grammar is taught **natively** — embedded into vocabulary work rather than delivered as isolated theory — and formal grammatical constructions are introduced only once the learner holds roughly **200–400 words**, starting with the simplest constructions and no exceptions; abstract vocabulary and grammatical exceptions arrive later (needs verification — Advance-internal). (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

Every **20–30 new words**, the vocabulary is worked on **lexical patterns**: short texts composed *entirely* of words the learner already knows (needs verification — Advance-internal). Because the earliest words are all high-imagery, these texts come out surreal — the source's own comparison is "strange, like paintings by Salvador Dalí, only in words" — and treats the strangeness as a feature: having to visualise an odd scene substitutes for the missing conversation partner, in the author's experience more effectively than rote-learning ritual phrases. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

The source is explicit that this schema applies to **basic levels only**; at upper levels vocabulary is absorbed much faster on the strength of prior encoding experience, and the work shifts to nuance and shades of meaning. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

### Three course blocks

Each course is split into three blocks. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

- **Вводный** (intro) — governed by the principle of «занятие высоты», *taking altitude*: get up to a high working speed on basic vocabulary and the simplest constructions for the level, so the learner acclimatises to the language and feels successful early. Emphasis is on words and expressions; grammar here is native only.
- **Основной** (main) — comprehensive study to the declared level, driven to automaticity. Lessons **chain**: you study vocabulary on top of previously learned grammar, and practise grammar using freshly activated vocabulary. The stated purpose of the chaining is isolation — the brain concentrates on the target material and never has to retrieve non-target content mid-drill.
- **Дополнительный** (additional) — easy lexico-grammatical topics whose real purpose is self-study skill: the learner applies the tools without prompting, consolidating the habit of using them.

The altitude gained in the intro block is what makes the harder main-block topics workable. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

### Six-part lesson structure

Nearly every lesson has the same interlocking parts. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

1. **Когнитивно-разгонный блок** (cognitive warm-up) — finger gymnastics, mental arithmetic, Schulte tables, proofreading tasks, word-search puzzles, timed search. This is not language work: it trains memory, attention, and intellectual endurance. It is also re-used *between* phases of the lesson as an activity switch that sheds fatigue and holds working capacity. (Substrate-before-subject ordering; compare [cognitive-house-model](./cognitive-house-model.md).)
2. **Material study** — vocabulary via foreign-word memorisation techniques (paired/sequential-information encoding, phonetic coding); grammar via mind maps; phonetics and reading rules via the образный алфавит (image alphabet), which builds the letter→sound link directly.
3. **Drilling on тренажёры** (trainers) — the "funnel" algorithm, Spritz, and patterns. The source calls these the bridge between theory and communicative practice, usable outside the lesson too, and part of the repetition system that moves material into long-term memory. The drill types themselves are owned by [pattern-drilling](./pattern-drilling.md); the repetition scheduling by [spaced-repetition](./spaced-repetition.md) and [storm-and-siege-protocol](./storm-and-siege-protocol.md).
4. **Communicative application** — using the material in context, switching between aspects of the topic.
5. **Additional block** — reading and listening skills.
6. **Knowledge check** — results stored in the learner's account, framed as self-feedback rather than punishment.

The mind-map step carries one of the book's few externally-cited claims: Advance cites **Cunningham, Glennis Edge (2005), _Mindmapping: Its Effects on Student Achievement in High School Biology_, PhD thesis, The University of Texas at Austin**, reporting that more than 80% of subjects showed improved understanding of science concepts when using mind maps. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf) The technique and its calibration are owned by [buzan-mind-map-mastery](./buzan-mind-map-mastery.md).

### Принцип декомпозиции — decomposition before mixing

The foundational course-design principle: split any skill into its component parts and stages and drill each **in isolation** before mixing, on the "eat the elephant in pieces" logic — attempting the whole complex at once slows skill formation. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

The worked illustration is the English letter *a*, which has **seven** pronunciation realisations depending on position, environment, and dialect — /æ/ *cat* · /ɑː/ *car* · /eɪ/ *fate* · /ɔː/ *talk* · /ɪ/ *wallet* · /ə/ *woman* · /ɒ/ *climate*. A beginner confuses even two of them, because stress and the following letters all bear on the outcome at once; decomposed within the lesson *and* across the course, each realisation is drilled alone and the reading of the letter can be automatised. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf) The same decomposition governs how patterns are built — form first, then situations of use, then mixed and extended — which is [pattern-drilling](./pattern-drilling.md)'s territory, not this page's.

### «Сытый удав» — the sieve at every lesson boundary

The most distinctive piece of the model, and the one with no equivalent anywhere else in this architecture.

Every lesson carries **audio-patterns in its introduction and its conclusion**. The introductory audio-pattern replays material from prior lessons *and* phrases containing material that will be formally taught later in the same lesson. The closing audio-pattern carries words, expressions, and constructions belonging to the **next** lesson. Worked passively (listening) or actively (speaking along), these form a «сито» — a *sieve*: the brain lets most of it through but retains fragments. When the material is then formally taught, the «механизм узнавания» (recognition mechanism) fires — "ah, so *that's* what that was" — and the material lands more easily. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

The name is a *Le Petit Prince* reference: the classical introduction / main part / conclusion shape of a lesson is drawn as the boa constrictor that has swallowed the elephant. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

Structurally this is **pre-exposure priming installed at every lesson boundary** — a scheduled first encounter that carries no retention demand, whose only job is to make the real encounter a *re*-encounter. It exploits the failure of a prior weak trace (the sieve leaking) as the mechanism rather than treating it as loss.

### The failure mode this layer names

Advance states its own justification as a failure mode: skipping the «занятие высоты» intro block and front-loading grammar theory before vocabulary overloads the learner with theory and is a significant cause of communication **blocks** — the learner knows the rule but cannot use it, because there is no vocabulary to hang it on and no developed reflex for deploying the construction in a real situation of communication. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf)

This is the same failure [pattern-drilling](./pattern-drilling.md) exists to defeat ("knows the rule, can't deploy it in real time") — but named one level up, as a property of **curriculum order** rather than of drill design.

### Tension with Layer 10 — rival account, noted not resolved

Advance's vocabulary-first, drill-dominant composition is a **rival account** of the acquisition question that Layer 10 answers with [Krashen](./krashen-sla-hypotheses.md): it places mnemonic encoding and pattern work at the centre of the beginner's course and files reading and listening under the *additional* block, where Krashen holds that only comprehensible input at i+1 produces acquisition and drill merely feeds the Monitor. (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf; wiki/learning-systems/krashen-sla-hypotheses.md)

This page does not resolve that dispute. The 70% input / 30% explicit-study split stands unchanged, [comprehensible-input-protocol](./comprehensible-input-protocol.md) remains the acquisition engine, and the rival account is recorded on [krashen-sla-hypotheses](./krashen-sla-hypotheses.md). What Layer 11 contributes *independently* of the dispute is the sequencing machinery itself — block structure, lesson chaining, decomposition, and the sieve — which is compatible with either weighting of input against explicit study.

---

## Verdict

The current KMS can support a much stronger language-learning system, but it should not be redesigned as one monolithic language framework. The better move is to keep the existing framework family stable and compose a language-specific architecture on top of it. This is a synthesis judgment based on the framework split already present in the system and the critique in `language_learning.md`. (source: raw/06 Buffer/language_learning.md; FRAMEWORK_OVERVIEW.md)

## Why the Current System Is Strong

The source argues that the current architecture is already unusually strong at:

- symbolic compression
- structured retrieval
- conceptual encoding
- graph reasoning
- long-term retention

These strengths align closely with the current roles of concept encoding, relational encoding, and structured retrieval in the framework family. (source: raw/06 Buffer/language_learning.md; FRAMEWORK_OVERVIEW.md; CAST and Georgian Node System.md)

## Where the Current System Is Weak

The source identifies the main weak spots as:

- sensorimotor learning
- automaticity
- probabilistic intuition
- emotional and social cognition
- high-speed real-world execution

For language learning, this means the current system is likely better at "knowing about language" than at fluent perception and production under pressure. (source: raw/06 Buffer/language_learning.md)

## Core Design Rule

Do not replace `NEDF`, `CAST`, `SPEAR`, or `HEART` with a single language mega-framework.

Doing that would harm separation of concerns and increase framework drift. The stronger design is a `Composite` architecture: stable core frameworks, plus language-specific modules layered on top. This follows the system's existing framework split and the software-design guidance already adopted for Neural OS. This is a synthesis inference from the current architecture. (source: FRAMEWORK_OVERVIEW.md; raw/06 Buffer/language_learning.md)

## Recommended Language Stack

### 1. Phonology Layer

Purpose:

- phoneme acquisition
- minimal-pair discrimination
- accent adaptation
- rapid auditory parsing
- prosodic chunking

This is the highest-priority missing layer in the source. It is underrepresented in the current KMS and needs dedicated handling. (source: raw/06 Buffer/language_learning.md)

Recommended framework usage:

- `CAST` for phoneme confusion graphs and correction mappings
- `UMTF` for auditory, rhythm, stress, and intonation tagging
- `SPEAR` for shadowing and repetition drills

### 2. Lexicon and Concept Layer

Purpose:

- vocabulary meaning
- sense distinctions
- grammatical concepts
- high-value usage differences

Recommended framework usage:

- `NEDF` for lexical items, grammar terms, and contrastive meanings
- `UMTF` sensory and state tagging for stronger discrimination

This layer is one of the areas where the current architecture is already strong. (source: raw/06 Buffer/language_learning.md; 03_NEDF_TEMPLATE.md)

**Coverage inside the layer.** "Vocabulary meaning" is not one capability: [word-knowledge-links](./word-knowledge-links.md) decomposes it into six directed links between the three word-stores owned by [tip-of-the-tongue](./tip-of-the-tongue.md), and supplies the audit for which links a given deck actually trains. The layer says *lexicon is needed*; that page says *which part of the lexicon skill you have so far*.

### 3. Grammar and Transformation Layer

Purpose:

- how forms change
- what depends on what
- how sentence structures map onto meaning

Recommended framework usage:

- `CAST` for dependency structure, grammar transformations, tense/aspect relations, politeness transforms, and discourse links

This takes language out of isolated flashcards and into a relational system. (source: CAST and Georgian Node System.md; raw/06 Buffer/language_learning.md)

### 4. Procedure and Production Layer

Purpose:

- speaking routines
- response-generation procedures
- shadowing
- turn-taking habits
- repair behavior during conversation

Recommended framework usage:

- `SPEAR` for executable drills and speaking routines

This is where "hear -> translate -> speak" should be replaced with faster "hear -> speak" response loops. (source: raw/06 Buffer/language_learning.md; 05_SPEAR_TEMPLATE.md)

### 5. Prediction Layer

Purpose:

- next-word anticipation
- sentence completion
- dialogue continuation
- subtitle-hide prediction

This is a major missing component in the current system according to the source. It is essential because high-level language fluency depends heavily on probabilistic anticipation. (source: raw/06 Buffer/language_learning.md)

Recommended framework usage:

- `SPEAR` for predictive drills
- `CAST` for expectation networks
- `UMTF` temporal and pattern tagging for completion sequences

### 6. Pragmatics and Social Layer

Purpose:

- politeness gradients
- apology structures
- disagreement softeners
- hesitation patterns
- emotional tone
- indirectness and subtext

This is where many advanced learners sound robotic. They know semantics but not the social mechanics of the language. (source: raw/06 Buffer/language_learning.md)

Recommended framework usage:

- `CAST` for transform relations such as direct -> softened -> indirect
- `HEART` only as a supporting model when interaction dynamics or person-patterns matter
- `UMTF` sensory, pattern, and priority tags for social salience

### 7. Automaticity and Reaction-Time Layer

Purpose:

- procedural overlearning
- latency collapse
- reduced hesitation
- faster repair

The source argues that the current stack optimizes accurate retrieval more than production speed. This layer closes that gap. (source: raw/06 Buffer/language_learning.md)

Recommended additions:

- translation latency tracking
- grammar selection latency tracking
- hesitation frequency tracking
- repair latency tracking
- constraint drills under time pressure

A mnemonic accelerant into this layer is [phrase-based-acquisition](./phrase-based-acquisition.md) — the [GMS](./kozarenko-mnemotechnics.md) phrase-level protocol (encode the phrase's meaning as an image, then automatize the exact string over ~4 days into a reflexive *речевой штамп*). It front-loads high-frequency chunks toward automaticity fast, but it is a proceduralization/Monitor-feeding accelerant, not a substitute for the Layer 10 comprehensible-input acquisition engine.

### 8. Transfer and Robustness Layer

Purpose:

- noise tolerance
- interruption recovery
- stress handling
- partial comprehension recovery
- real-world speaking resilience

This is where many knowledge systems fail: they work in clean conditions and collapse in hostile ones. (source: raw/06 Buffer/language_learning.md)

Recommended framework usage:

- `SPEAR` for noisy and interrupted procedure drills
- `UMTF` state and priority tagging for hostile conditions

### 9. Governance and Forgetting Layer

Purpose:

- prevent overencoding
- protect high-frequency items
- retire low-value memory
- accept decay where utility is low

The source explicitly warns that this architecture can over-encode low-value information. That makes governance a required component, not a nice-to-have. (source: raw/06 Buffer/language_learning.md)

Recommended filters:

- Is it high-frequency?
- Is it reusable?
- Is it foundational?
- Is it hard to reconstruct?
- Is it externally searchable?

## Framework Mapping

| Language problem | Primary framework | Supporting framework |
|---|---|---|
| Vocabulary meaning | `NEDF` | `UMTF` |
| Grammar relation | `CAST` | `NEDF` |
| Speaking routine | `SPEAR` | `UMTF` |
| Phoneme confusion | `CAST` | `UMTF` |
| Prosody and rhythm | `UMTF` | `SPEAR` |
| Social-pragmatic transform | `CAST` | `HEART`, `UMTF` |
| Prediction drill | `SPEAR` | `CAST` |
| Real-world robustness | `SPEAR` | `UMTF` |

## Highest-Value Additions

If only a few components are added, the highest-value sequence is:

1. phonological acquisition — ✅ **BUILT**, runnable as the [l2-phonology-gym](./l2-phonology-gym.md) (perception loop: ABX + HVPT)
2. shadowing plus latency measurement — ✅ **BUILT**, runnable as the [intonation-fluency-gym](./intonation-fluency-gym.md) (pitch-contour shadowing + rate/pause scoring)
3. prediction drills
4. pragmatic and politeness transform libraries
5. noisy, stressful, real-world transfer training

This ordering follows the source's emphasis on the most underweighted loops. (source: raw/06 Buffer/language_learning.md)

**Build status (2026-06-24).** The input/acquisition engine is operational too: the Krashen 95%-rule i+1 filter runs as `meter iplus1` over a personal known-word floor (see [comprehensible-input-protocol](./comprehensible-input-protocol.md)), driven by the learner profile in [semantic-reading-l2](./semantic-reading-l2.md) (`wiki/assets/learner-profile-en.json`). So of the originally-missing loops, **phonology (#1), shadowing/prosody (#2), and comprehensible-input are built**; prediction (#3), pragmatics (#4), and noisy-transfer (#5) remain the open frontier.

## What Not to Do

- Do not turn `HEART` into the main language framework.
- Do not fold all language handling into one giant pattern system.
- Do not over-encode low-frequency material with high mnemonic cost.
- Do not confuse explicit knowledge with fluent performance.

These constraints follow directly from the source critique and from the current framework architecture. (source: raw/06 Buffer/language_learning.md; FRAMEWORK_OVERVIEW.md)

## Red Queen v2 Direction

The source proposes a broader progression:

- Comprehension
- Compression
- Encoding
- Retrieval
- Automaticity
- Prediction
- Intuition
- Adaptation

Within language learning, the current system is strongest in the early stages and weakest in the later ones. That suggests the next major gains come from layers that improve speed, prediction, and adaptation rather than additional static memory structure. (source: raw/06 Buffer/language_learning.md)

## Bottom Line

Yes, the language-learning architecture can be improved substantially using what already exists in the KMS.

The correct move is:

- keep the framework family stable
- compose a language-specific stack on top of it
- add missing phonological, automaticity, prediction, pragmatic, transfer, and governance layers

That gives a cleaner and more extensible design than inventing a brand-new all-purpose language framework. This conclusion is a synthesis judgment from the current system and the new source. (source: raw/06 Buffer/language_learning.md; FRAMEWORK_OVERVIEW.md)

## Related Pages

- [language-learning-protocol](./language-learning-protocol.md)
- [pattern-drilling](./pattern-drilling.md)
- [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md)
- [storm-and-siege-protocol](./storm-and-siege-protocol.md)
- [cognitive-house-model](./cognitive-house-model.md)
- [buzan-mind-map-mastery](./buzan-mind-map-mastery.md)
- [spaced-repetition](./spaced-repetition.md)
- [l2-phonology-gym](./l2-phonology-gym.md)
- [intonation-fluency-gym](./intonation-fluency-gym.md)
- [comprehensible-input-protocol](./comprehensible-input-protocol.md)
- [phrase-based-acquisition](./phrase-based-acquisition.md)
- [polyglot-architecture](./polyglot-architecture.md)
- [language-family-clustering](./language-family-clustering.md)
- [krashen-sla-hypotheses](./krashen-sla-hypotheses.md)
- [fluent-forever-wyner](./fluent-forever-wyner.md)
- [substitute-word-system](./substitute-word-system.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [umtf-operational-template](./umtf-operational-template.md)
- [NEDF](./nedf-overview.md)
- [CAST System](./cast-overview.md)
- [SPEAR](./spear-overview.md)
- [HEART](./heart-overview.md)
- [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md)
- [pulse-overview](./pulse-overview.md)
- [Visual walkthrough →](../../pages/language-learning.html)
- [French-through-song curriculum (tool) →](../../tools/french-music-drill/CURRICULUM.md) — a concrete [pattern-drilling](./pattern-drilling.md) / prosody artifact for the Procedure & Production layer: one song per ordered A1→A2 grammar target, each a bilingual earworm with a `fr-FR` TTS pronunciation reference.


---

## U — See (CAST)
1. Composes NEDF/CAST/SPEAR/UMTF for language learning
2. Phonology, automaticity, prediction, pragmatics layers

## D — Name (NEDF)
1. Language learning architecture = composed-framework approach
2. Distinguisher: composition over replacement
3. Failure mode: building parallel language frameworks

## F — Do (SPEAR)
1. New language → route layers through existing frameworks
2. UMTF for phonological/prosodic design
3. Course design → vocabulary before grammar; sieve at every lesson boundary (Layer 11)

## B — Watch (HEART)
1. Replacement-bias
2. Skipping UMTF design step
3. Grammar theory front-loaded before vocabulary → "knows the rule, can't speak"

## L — Predict (ORACLE)
1. Language type → predict layer emphasis
2. Layer → predict framework choice

## R — Act (GRACE)
1. New language → apply architecture
2. Skill gap → check layer