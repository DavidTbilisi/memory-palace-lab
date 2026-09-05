---
palace: meta-knowledge
level: 4
domain: 10
room: 11
semantic_mode: 5
wiki_source: wiki/learning-systems/memory-atomic-design.md
---

# Memory Atomic Design

**Summary**: Brad Frost's five-tier *Atomic Design* spine — **Atoms · Molecules · Organisms · Templates · Pages** — applied to the memory layer of Neural OS. Atoms are irreducible memory primitives (single REMAPS moves · single CLAMP or [MASTER](./music-generation-frameworks.md) render slots · one locus · one recall modality · one substrate effect); molecules are the named tactic-grade combinations ([NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), [GRACE](./grace-overview.md) cards plus the [Major system](./major-system-for-mathematical-notation.md), peg-list, mnemonic-route, reflex-card, SM-2 scheduler); organisms are the pipelines ([Encoded SR](./encoded-spaced-repetition.md), [The Great Work](./automaticity-and-reflex-training.md), [Lifecycle Manager](./lifecycle-manager.md), [Red Queen Gym](./red-queen-skill-gym.md)); templates are the page-level schemas (the six encoder card-shapes, Memory Palace layout, Mind-Palace Personal Layout, Reflex card); pages are the worked instances (aws-city-palace, bible-canonical-palace, algorithm-pattern-nedf-deck, abraham-heart-room, …). Sister page to [problem-solving-atomic-design](./problem-solving-atomic-design.md) — same lens, different domain.

**Sources**:
- Brad Frost, *Atomic Design* (2016) — methodology source. Local clipping at `Clippings/Atomic Design Methodology  Atomic Design by Brad Frost.md`.
- [problem-solving-atomic-design](./problem-solving-atomic-design.md) — the sibling application of the lens; identical structure.
- [nedf-overview](./nedf-overview.md) · [cast-overview](./cast-overview.md) · [spear-overview](./spear-overview.md) · [heart-overview](./heart-overview.md) · [oracle-overview](./oracle-overview.md) · [grace-overview](./grace-overview.md) — the six encoder owners (molecule registry).
- [remaps](./remaps.md) · [clamp-render-lens](./clamp-render-lens.md) — atomic transformation and render registries.
- [memory-palace](./memory-palace.md) · [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) · mind-palace-personal-layout — palace template owners.
- [encoded-spaced-repetition](./encoded-spaced-repetition.md) · [spaced-repetition](./spaced-repetition.md) · [active-recall](./active-recall.md) · [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) · [lifecycle-manager](./lifecycle-manager.md) · [red-queen-skill-gym](./red-queen-skill-gym.md) — primary organism registry.
- [memory-paradox](./memory-paradox.md) · [memory-reconsolidation](./memory-reconsolidation.md) · [prospective-memory](./prospective-memory.md) · [tip-of-the-tongue](./tip-of-the-tongue.md) · [ok-plateau](./ok-plateau.md) · [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) · mind-diet · connection-for-protection · mild-cognitive-impairment · [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) · [growth-mindset](./growth-mindset.md) · [self-image](./self-image.md) — calibration and substrate atom owners.
- Design conversation, 2026-05-24.

**Last updated**: 2026-07-03 (MASTER render atoms + Image/Music Pipeline organisms added for the Render / Externalization layer; 37→43 atoms, 12→14 organisms; blue family renamed Transformation + Render). Earlier 2026-05-24

---

## Why this page exists

The memory layer of Neural OS has grown wider than the problem-solving layer — six encoders, two transformation lenses, a palace architecture, a spaced-repetition pipeline, a lifecycle manager, four recognition gyms, ~25 worked palace and deck instances, plus an entire substrate of biological calibration pages. What was missing is the *single shelf the kit lives on*. A learner could read each page but had no map of *which kind of thing each one is* and *how the things compose*.

Atomic Design is that shelf. The same lens that organizes the problem-solving inventory in [problem-solving-atomic-design](./problem-solving-atomic-design.md) organizes memory:

> *atoms combine together to form molecules, which further combine to form organisms.* — Frost

The five tiers compose strictly upward. Reading a memory page now answers the question "*what tier?*" first, and only then "*what content?*" That order is the discipline.

## The five-tier mapping (master table)

| Tier | Definition (Frost) | Memory instance | Catalog page |
|---|---|---|---|
| **Atom** | "Foundational building blocks; cannot be broken further without ceasing to be functional" | One specific encoding move, one transformation, one render slot, one recall modality, one substrate effect (Locus · Rotate · Camera · Free-recall · Spacing) | §Atoms below |
| **Molecule** | "Relatively simple groups of UI elements functioning together as a unit" | A *card-shape* or *tactic* — small bundle of atoms with its own trigger ([NEDF card](./nedf-overview.md) · [CAST graph](./cast-overview.md) · [SPEAR procedure](./spear-overview.md) · [Major system](./major-system-for-mathematical-notation.md) · mnemonic route · reflex card · SM-2 schedule) | §Molecules below |
| **Organism** | "Relatively complex components composed of molecules and atoms forming distinct sections" | A named *pipeline* — [Encoded SR](./encoded-spaced-repetition.md) · [The Great Work](./automaticity-and-reflex-training.md) · [Lifecycle Manager](./lifecycle-manager.md) · [Red Queen Gym](./red-queen-skill-gym.md) · construct/algorithm/palace recognition gyms · METER memory-event emitter | §Organisms below |
| **Template** | "Page-level objects that place components into a layout and articulate the underlying content structure" | A *schema* — the six encoder card-shapes, [Memory Palace layout](./memory-palace.md), Mind-Palace Personal Layout, Reflex-card template, Five-Elements grid, [Lifecycle tier slot](./lifecycle-manager.md), Daily/Weekly review | §Templates below |
| **Page** | "Specific instances of templates that show what a UI looks like with real representative content" | A *worked encoding* — aws-city-palace · bible-canonical-palace · algorithm-pattern-nedf-deck · abraham-heart-room · [rubiks-cube-palace](./rubiks-cube-palace.md) · programming-languages-mnemonic-route · cissp-d1-anki-deck | §Pages below |

Composition is strictly upward. A reflex card lives on a NEDF molecule lives on a Locus atom lives on a Sensations atom; you cannot strip the encoded-SR organism down to a single atom, and you cannot grow a single recall-modality atom into a pipeline.

---

## Atoms

> ![Visual atoms — Memory Periodic Table](../diagrams/15-memory-atomic-design-atoms.png)

An **atom** is irreducible: split it and the move stops working. Atoms cluster into four chemical families. Each cell has a 2- or 3-letter symbol; this is the wiki's working alphabet for memory-event annotation in METER.

### Encoding family (orange) — the verbs of encoding

| Symbol | Atom | Owner |
|---|---|---|
| **IMG** | Form one vivid image | [remaps](./remaps.md) (Sensations + Exaggerate); [nedf-overview](./nedf-overview.md) Name-hook |
| **LOC** | Place one item at one locus | [memory-palace](./memory-palace.md); one-item-per-locus rule |
| **CHK** | Chunk N items into 7 ± 2 (Miller) | [chunking](./chunking.md) |
| **ELAB** | Elaborate — connect new item to existing schema | [encoded-spaced-repetition](./encoded-spaced-repetition.md) |
| **BIND** | Bind item to a cue (trigger ↔ action) | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) Reflex card |
| **SUB** | Substitute concrete-for-abstract (Major-system digit→consonant→word) | [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) |
| **PEG** | Attach item to pre-learned peg | mnemonic-routes-master |
| **MARK** | Mark importance / category / order via [mental markers](./mental-markers-category-importance-order.md) | [mental-markers-category-importance-order](./mental-markers-category-importance-order.md) |

### Transformation + Render family (blue) — REMAPS transform + CLAMP / MASTER render

The transform atoms (REMAPS) make a scene *retrievable*; the render atoms (CLAMP visual, MASTER auditory) make it *external* — the two render-lens sets of the [Render / Externalization layer](./framework-comparison-matrix.md).

| Symbol | Atom | Owner |
|---|---|---|
| **ROT** | Rotate (REMAPS) | [remaps](./remaps.md) |
| **EXG** | Exaggerate (REMAPS) | [remaps](./remaps.md) |
| **MMM** | Modify-Merge-Move (REMAPS) | [remaps](./remaps.md) |
| **ASS** | Associate (REMAPS) | [remaps](./remaps.md) |
| **PPP** | Play-Palace-Path (REMAPS) | [remaps](./remaps.md) |
| **SNS** | Sensations (REMAPS) | [remaps](./remaps.md) |
| **CAM** | Camera angle / framing (CLAMP) | [clamp-render-lens](./clamp-render-lens.md) |
| **LGT** | Lighting (CLAMP) | [clamp-render-lens](./clamp-render-lens.md) |
| **ASP** | Aspect / use-mode (CLAMP) | [clamp-render-lens](./clamp-render-lens.md) |
| **MED** | Medium (CLAMP) | [clamp-render-lens](./clamp-render-lens.md) |
| **PRS** | Preserve / Proscribe (CLAMP) | [clamp-render-lens](./clamp-render-lens.md) |
| **TMP** | Meter / tempo — BPM, groove, time-feel (MASTER) | [music-generation-frameworks](./music-generation-frameworks.md) |
| **ARR** | Arrangement — instruments / voices / density (MASTER) | [music-generation-frameworks](./music-generation-frameworks.md) |
| **MIX** | Space & mix — reverb, stereo width, sub-bass (MASTER) | [music-generation-frameworks](./music-generation-frameworks.md) |
| **TMB** | Timbre & treatment — production texture + vocal delivery (MASTER) | [music-generation-frameworks](./music-generation-frameworks.md) |
| **NRG** | Energy arc — escalation / sustain dynamics (MASTER) | [music-generation-frameworks](./music-generation-frameworks.md) |
| **RST** | Restrict / Reserve — preserve invariants + proscribe negatives (MASTER) | [music-generation-frameworks](./music-generation-frameworks.md) |

### Storage + Retrieval family (purple) — the access modalities

| Symbol | Atom | Owner |
|---|---|---|
| **WLK** | Walk a pre-learned path through loci | [memory-palace](./memory-palace.md) |
| **IDX** | Index cue (search pointer into palace grid) | [palace-classification-gym](./palace-classification-gym.md) |
| **FRC** | Free recall — produce without cues | [active-recall](./active-recall.md) |
| **CRC** | Cued recall — produce given cue (flashcard) | [active-recall](./active-recall.md) |
| **RCG** | Recognition — confirm seen-before | [active-recall](./active-recall.md) |
| **PRD** | Production — generate full output, not just identify | [active-recall](./active-recall.md) |
| **SR** | SM-2 / FSRS interval (next = prev × ease) | [spaced-repetition](./spaced-repetition.md) |
| **LAP** | Lapse — interval reset on failed retrieval | [spaced-repetition](./spaced-repetition.md) |
| **LCH** | Leech — flag card with N consecutive failures | [lifecycle-manager](./lifecycle-manager.md) |
| **TOT** | Tip-of-tongue search (stop trying, let activation decay) | [tip-of-the-tongue](./tip-of-the-tongue.md) |

### Substrate + Calibration family (green) — biology and learning-science effects

| Symbol | Atom | Owner |
|---|---|---|
| **SPC** | Spacing effect (distributed > massed) | [spaced-repetition](./spaced-repetition.md) |
| **ITL** | Interleaving (mixed > blocked) | [encoded-spaced-repetition](./encoded-spaced-repetition.md) |
| **GEN** | Generation effect (produce > read) | [active-recall](./active-recall.md) |
| **TST** | Testing effect (retrieve > re-expose) | [active-recall](./active-recall.md) |
| **RCN** | Reconsolidation (every retrieval edits the trace) | [memory-reconsolidation](./memory-reconsolidation.md) |
| **BDNF** | BDNF uptick (aerobic, sleep, fast, sun, social) | [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) |
| **SLP** | Sleep spindle (overnight consolidation) | [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) |
| **MIND** | MIND-diet substrate (5-A · 5-B · 7-C lists) | mind-diet |

Why atoms matter: the atom is the smallest unit a **METER** memory-event can name. A lapse logged as `crux_atom: LCH` is queryable; a lapse logged as "card felt hard" is not. Atom-vocabulary coverage becomes the operational definition of *whether the memory layer is properly instrumented*.

---

## Molecules

> ![Visual molecules — atoms bonded into memory tactics](../diagrams/15-memory-atomic-design-molecules.png)

A **molecule** is a small bundle of atoms with its own trigger and its own characteristic shape. Memory molecules are the named *card-shapes* and *tactics* the wiki has been building since day one.

| Molecule | Atomic composition | Trigger | Owner |
|---|---|---|---|
| **NEDF card** | IMG + LOC + ELAB + REMAPS-polish (ROT · EXG · MMM · SNS) | Abstract concept; need retrieval from one image at four angles | [nedf-overview](./nedf-overview.md) |
| **CAST graph** | LOC + ANIM-nodes + VERB-edges + REMAPS at edges | Relational system; N-node graph with named edges | [cast-overview](./cast-overview.md) |
| **SPEAR procedure** | BIND + IMG + branch-decision atoms | Algorithm or workflow; need to execute under pressure | [spear-overview](./spear-overview.md) |
| **HEART room** | LOC (5 walls) + IMG per wall + IDX (doorway recognition cues) | Important repeated person; need falsifiable mental model | [heart-overview](./heart-overview.md) |
| **ORACLE card** | IMG + IDX + 6-slot template (mode-dependent) | Predictive material; next-step anticipation under time pressure | [oracle-overview](./oracle-overview.md) |
| **GRACE card** | IMG + 1-5 graded alternatives + culture-tag | Social move selection on gradient | [grace-overview](./grace-overview.md) |
| **Memory Palace** | Room + 10 LOC + WLK + IDX | Dense domain content needing fast retrieval | [memory-palace](./memory-palace.md) |
| **Major-system** | SUB (digit→consonant) + PEG + IMG | Numbers, dates, π digits, pin codes | [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) |
| **Mnemonic route** | PEG (26 alphabet · 12 month · 66 canonical · …) + WLK + IMG per peg | Ordered list with strong pre-learned anchor | mnemonic-routes-master |
| **Encoded-SR** | NEDF card → 4 derived card-templates (Name→Content · Content→Name · Discrimination · Diagnosis) → SR each | One concept, four retrieval angles, separate SR streams | [encoded-spaced-repetition](./encoded-spaced-repetition.md) |
| **Reflex card** | BIND + IMG + drill-protocol (Lamp · Scale · Sword) | Skill automation; need unconscious trigger-action under load | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |
| **SM-2 scheduler** | SR interval + LAP + ease-factor update | Every reviewed card; spacing-effect implementation | [spaced-repetition](./spaced-repetition.md) |
| **Foer metronome** | TST + RCN + 10-20% beyond-comfort forced-regression timer | OK-plateau detected; need to escape Coagulated automatism | [ok-plateau](./ok-plateau.md) |
| **ANTs counter-protocol** | identify-distortion + name-with-Burns/Beck-label + talk-back | Negative self-talk interfering with practice | [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) |
| **Bake-the-Baker** | SUB (proper-noun → occupation-noun) + IMG + LOC | Name memory; defeats the Baker/baker paradox | [tip-of-the-tongue](./tip-of-the-tongue.md) |
| **TOT recovery** | TOT + stop-trying + let-decay (no Ugly-Sister chase) | Tip-of-tongue blocking; near-miss capture | [tip-of-the-tongue](./tip-of-the-tongue.md) |
| **Implementation intention** | BIND + prospective-cue (time + place + exact action) | Future-time intention ("at noon: do yoga") | [prospective-memory](./prospective-memory.md) |

Each molecule passes the [single-responsibility test](https://en.wikipedia.org/wiki/Single_responsibility_principle): one trigger, one shape. The wiki resists adding a molecule that overlaps an existing one's trigger — e.g. "image-based memorization" is not its own molecule because it lives *inside* every encoder molecule.

---

## Organisms

An **organism** is a relatively complex section of the memory layer — a named pipeline that runs as a unit, with its own internal sequence of molecules and atoms.

| Organism | What it does | Composition | Owner |
|---|---|---|---|
| **The Great Work** | Seven-stage acquisition pipeline (Calcination → Coagulation) routing per Five-Element skill type | All five card-molecules + reflex card + drill protocol | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |
| **Encoded Spaced Repetition** | One NEDF concept → four derived card-templates → independent SR streams | NEDF molecule + 4 derivation rules + SM-2 + lifecycle | [encoded-spaced-repetition](./encoded-spaced-repetition.md) |
| **Red Queen Skill Gym (RISE)** | Reflex · Intensity · Sparring · Evaluation; turn encoded knowledge into reflex under pressure | Reflex card + Lamp/Scale/Sword + performance telemetry | [red-queen-skill-gym](./red-queen-skill-gym.md) |
| **Lifecycle Manager** | Retire / compress / consolidate low-value cards; preserve breadcrumb trail | Active → Cold → Archive → Drop tier ladder + 4 trigger families | [lifecycle-manager](./lifecycle-manager.md) |
| **Construct-Recognition Gym** | 6-second code-construct identification under time pressure | NEDF construct cards + 6-s timer + forced classification | construct-recognition-gym |
| **Algorithm-Pattern Gym** | 8-second algorithm pattern recognition reflex | NEDF algorithm cards + 8-s timer + forced recall | algorithm-pattern-gym |
| **Palace-Classification Gym** | 12-second forced palace-address emission (layer × domain × room) | Palace-address NEDF + 12-s timer + coordinate emission | [palace-classification-gym](./palace-classification-gym.md) |
| **Semantic Reading / Listening Gym** | Tag emission while reading / listening; forced production at passage end | Passage + tag taxonomy + production drill | [semantic-reading-system](./semantic-reading-system.md) · [semantic-listening-system](./semantic-listening-system.md) |
| **Method-of-Loci palace construction** | Build 10–50-locus palace from real or imagined architecture; pre-learn walks; index loci | Real-building walk + room enumeration + mental rehearsal + IDX | [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) |
| **Anki / SR deck builder** | Ingest domain content → auto-generate encoder cards → schedule with SM-2 / FSRS → export to Anki | Semantic ingest + card-template generation + scheduler | [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) |
| **Image Pipeline** | Render an encoded scene into an external image (visual retrieval channel) | REMAPS transform (upstream) + CLAMP render atoms (CAM·LGT·ASP·MED·PRS) + world-profile Flyweight + image-gen | [image-pipeline](./image-pipeline.md) |
| **Music Pipeline** | Render a seed or encoded scene into an external song (auditory retrieval channel) | REMAPS / SCAMPER transform (upstream) + MASTER render atoms (TMP·ARR·MIX·TMB·NRG·RST) + world-profile Flyweight + music-gen | [music-generation-frameworks](./music-generation-frameworks.md) |
| **METER memory-event emitter** | Log encode · place · review · success/fail · lifecycle-transition events with atom annotations | Event trigger + context capture + crux atom + structured log | [meter-overview](./meter-overview.md) |
| **BDNF / neurogenesis substrate organism** | Run the 5 lifestyle levers (aerobic · sleep · IF · stress reduction · sun) to keep substrate primed | BDNF + SLP + MIND + aerobic + social atoms | [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) · mind-diet · connection-for-protection |

Each organism owns one responsibility. The encoded-SR organism owns "concept → multi-angle reviews"; the Great Work owns "skill exposure → proceduralization"; the lifecycle manager owns "card retirement." Overlap between organisms is the diagnostic for an over-broad pipeline.

---

## Templates

A **template** is a page-level skeleton with named slots — a layout that defines *which organisms run on which slots of content*. Templates are content-agnostic.

| Template | Slots | Owner |
|---|---|---|
| **NEDF card schema** | Name-hook · Essence · Distinguisher · Failure · Notes | [nedf-overview](./nedf-overview.md) |
| **CAST graph schema** | Palace-anchor + {animal-node: (name, vivid-scene)} + {verb-edge: (source, dest, action)} | [cast-overview](./cast-overview.md) |
| **SPEAR procedure schema** | Scene · Preconditions · Execution · Alternatives · Repair | [spear-overview](./spear-overview.md) |
| **HEART person schema** | Doorway · Left (history) · Center (essence) · Right (architecture) · Back (treatment) · Ceiling (pattern tag) | [heart-overview](./heart-overview.md) |
| **ORACLE card schema** | Observation · Reading · Anomaly · Cue · Likelihood · Estimate (mode: sequential / conditional / distributional / anomaly) | [oracle-overview](./oracle-overview.md) |
| **GRACE card schema** | Ground · Read · Alternatives (1-5 gradient) · Choose · Exit (mode: politeness / tone / hierarchy / subtext / apology / community) | [grace-overview](./grace-overview.md) |
| **Memory Palace layout** | Districts (layer × domain) · Rooms · Loci with IDX cues · Walk order | [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) |
| **Mind-Palace Personal Layout** | David's authored palace — specific real-world rooms with sensory anchors | mind-palace-personal-layout |
| **Reflex card** | Trigger · Classification · Action · Success test · Common mistakes · Drills (blocked / mixed / random / pressure) | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |
| **Five-Elements skill grid** | Dominant element (Water / Air / Earth / Fire / Aether) × Great Work operations | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |
| **Lifecycle tier slot** | Anki state · Wiki state · Tier · Trigger family · Age · Performance metrics | [lifecycle-manager](./lifecycle-manager.md) |
| **Daily / Weekly memory review** | Morning SR block · Working gym block · Evening consolidation · Prospective-intention capture | neural-os-daily-loop |
| **Trophy Palace slot** (SPARK reward layer) | Peg-matrix location · earned-on date · unlock conditions | [spark-overview](./spark-overview.md) |

The encoder template tier is where the wiki's *cognitive single-responsibility* hardens. NEDF owns "concept"; CAST owns "graph"; SPEAR owns "procedure"; HEART owns "person"; ORACLE owns "prediction"; GRACE owns "social move." Cross-cutting moves (Reflex card · SR card · Lifecycle slot) sit beside the encoder templates, not above or below.

---

## Pages

A **page** is a *worked instance* — a template populated with the real organisms, molecules, and atoms of a specific encoding. The page is what users actually run with.

### Palace-instance pages (worked Memory Palace layouts)

| Page | Template realized | Lead molecule | Domain |
|---|---|---|---|
| aws-city-palace | Memory Palace layout | NEDF + WLK | Cloud computing |
| bible-canonical-palace | Memory Palace layout | 66-locus mnemonic route | Bible / scripture |
| exodus-book-palace | Memory Palace layout | Book-palace molecule | Single Bible book |
| genesis-book-palace | Memory Palace layout | Book-palace molecule | Single Bible book |
| [rubiks-cube-palace](./rubiks-cube-palace.md) | Memory Palace layout | 54-locus geometric grid | Spatial puzzle |
| [trigonometry-compass-palace](./trigonometry-compass-palace.md) | Memory Palace layout | Compass-grid molecule | Mathematics |
| x86-memory-palace | Memory Palace layout | Architectural-room molecule | Computer architecture |
| university-semester-palace | Memory Palace layout | Calendar-palace molecule | Academic calendar |

### Encoder-instance pages (worked NEDF / HEART / CAST / SR decks)

| Page | Template realized | Lead molecule | Domain |
|---|---|---|---|
| algorithm-pattern-nedf-deck | NEDF card schema | NEDF | 30+ algorithms |
| graph-network-nedf-deck | NEDF card schema | NEDF | Graph algorithms |
| java-vocabulary-nedf | NEDF card schema | NEDF | Java language |
| [vedic-multiplication-nedf-deck](./vedic-multiplication-nedf-deck.md) | NEDF card schema | NEDF + Major-system | Mental math |
| claude-code-nedf | NEDF card schema | NEDF | Single tool concept |
| abraham-heart-room | HEART person schema | HEART | Biblical figure |
| moses-heart-room | HEART person schema | HEART | Biblical figure |
| archetype-encoding-in-cast | CAST graph schema | CAST | Systems-thinking archetypes |
| cissp-d1-anki-deck | Encoded-SR deck | NEDF × Encoded-SR | Security certification |

### Mnemonic-route instance pages

| Page | Template realized | Lead molecule | Domain |
|---|---|---|---|
| aws-syllabus-mnemonic-route | Memory Palace layout | 26-letter alphabet route | AWS cert |
| programming-languages-mnemonic-route | Memory Palace layout | 26-letter alphabet route | Programming languages |
| computer-vision-mnemonic-route | Memory Palace layout | Mnemonic-route molecule | Computer vision |
| it-services-and-projects-management-mnemonic-route | Memory Palace layout | Mnemonic-route molecule | IT management |
| software-modeling-and-design-patterns-mnemonic-route | Memory Palace layout | Mnemonic-route molecule | Design patterns |
| [jungian-12-archetypes-as-month-mnemonics](./jungian-12-archetypes-as-month-mnemonics.md) | Memory Palace layout | 12-month route + archetypes | Personality |

Per Frost: "pages are essential for testing the effectiveness of the underlying design system." When a worked encoding cannot be cleanly decomposed into one template + one organism + one molecule + named atoms, the bug is in the design system — usually a missing molecule (e.g., the *book-palace molecule* surfaced as a real pattern after Exodus and Genesis both shipped under the generic Memory Palace layout).

---

## Routing rule — when to think at which tier

| Symptom | Think at tier |
|---|---|
| Need to log this encoding in METER with a `crux_atom` field another encoder could match against | **Atom** |
| Asking "which card-shape do I use?" or "is this a NEDF or a SPEAR situation?" | **Molecule** |
| Asking "which gym do I drill this in?" or "which pipeline retires this card?" | **Organism** |
| Asking "what is the schema?" or "what slots does this card have?" | **Template** |
| Asking "has anyone encoded this domain; can I copy their layout?" | **Page** (worked instance) |
| Designing a *new* encoding tactic that doesn't fit existing molecules | Check first: is it really new, or is it a parameterization of an existing molecule? |
| Designing a *new* gym | First check overlap with existing gyms (Construct / Algorithm / Palace / Crux / Red-Queen-generic); if genuinely new, name the responsibility-boundary before deploying |

Tier-conflation is the most common operational error: treating a molecule as an organism ("I'll just *run NEDF* on this domain" — no, NEDF is the card shape; the organism is *Encoded SR* or *Anki deck builder*), or treating a template as a molecule (a memory-palace layout is not a tactic, it's a schema for one).

---

## METER hooks per tier

The atomic-design lens tightens the memory-event schema. Each tier contributes one field group:

```yaml
event_id: <uuid>
event_type: <encode|place|review|retrieval|lifecycle_transition>

# Atom-tier: which named primitives fired
atoms_used: [IMG, LOC, ROT, BIND]
crux_atom: BIND

# Molecule-tier: which card-shape / tactic
molecule_lead: NEDF             # or CAST, SPEAR, HEART, ORACLE, GRACE, Major-system, …
molecule_secondary: [Palace, Major-system]

# Organism-tier: which pipeline this event is inside
organism: Encoded-SR             # or Great-Work, Lifecycle-Manager, Red-Queen-Gym, …
organism_phase: stage4-Conjunction   # if Great-Work

# Template-tier: which schema the encoded artifact uses
template: NEDF card schema       # or Memory-Palace-layout, HEART-room, …
template_slot_at_event: name-hook   # which slot of the template was at issue

# Page-tier: the instance the event belongs to
page_id: aws-city-palace
page_template_match: true        # false ⇒ the page broke the template; investigate
```

New dashboard metrics layered on the standard memory dashboard:

| Metric | Definition | Pass / floor |
|---|---|---|
| **Atom-vocabulary coverage** | % of memory events with a registered `crux_atom` | Pass ≥80%, floor 50% |
| **Molecule-name accuracy** | % of events where `molecule_lead` matches retrospective audit | Pass ≥80%, floor 60% |
| **Organism-fit rate** | % of card lifecycles that stayed inside one organism without being migrated mid-life | Pass ≥75%, floor 50% |
| **Template-match rate** | % of pages with `page_template_match: true` | Pass ≥90%, floor 70% |
| **Tier-conflation rate** | % of events where the user logged a molecule as an organism | Pass <10%, floor 25% |

---

## Anti-patterns

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| **Atom-without-molecule** | Logging `crux_atom: ROT` without naming the molecule it served (NEDF / CAST / palace …) | Always log molecule-then-atom |
| **Molecule-as-organism** | "I'll run NEDF on the whole semester" — NEDF is a card shape, not a pipeline | Run *Encoded SR* or *Anki deck builder*; NEDF fills slots inside them |
| **Template-without-organism** | Memory Palace layout filled with loci but no SR / gym / lifecycle running on top | A template alone gathers dust; pair with an organism on day one |
| **Page-without-template** | An ad-hoc palace with no underlying schema | Either retrofit a template or name a new one and register |
| **Inventing parallel atoms** | Naming "vivid-color-saturation-boost" as a new atom when it's *Sensations (SNS) parameterized for color* | Atoms are domain-irreducible; this one is a SNS parameter, not a new atom |
| **Skipping the atom layer** | Logging only molecule + organism, no atom | Atom is the indexing key for METER; without it, transfer fails |
| **Coagulating the crux atom** | Running ROT or BIND as reflex on material whose *exact* transformation is still the open question | Crux atoms (per [crux-move](./crux-move.md)) must stay in the [Cognitive stage](./automaticity-and-reflex-training.md); do not drill them to autopilot |

---

## How this composes with existing principles

| Existing principle | Atomic-design contribution |
|---|---|
| **Single-responsibility** (SRP, [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md)) | Each tier enforces SRP at its level — one molecule = one trigger; one organism = one pipeline responsibility |
| **Open-closed** (OCP) | New encoding moves enter as new atoms or molecules; existing organisms and templates unchanged |
| **[UMTF](./universal-mental-tagging-framework.md)** | Atomic-design tier is the *Pattern* tag's structural axis, orthogonal to UMTF's 7-tag taxonomy |
| **[Memory Paradox](./memory-paradox.md)** | Take the tiers seriously enough to label every encoding; hold loosely enough to refactor when the system creaks |
| **[skill-progression-stages](./skill-progression-stages.md)** | Atomic-design tier and skill stage are orthogonal — a molecule can be at any stage; an atom can be Coagulated or Cognitive |
| **[problem-solving-atomic-design](./problem-solving-atomic-design.md)** | Sister lens; identical structure, different domain. Atoms / Molecules / … mean the same five things; only the inventory differs |
| **[composability-index](./composability-index.md)** | This page is a *load-bearing composability claim* — that the memory layer's ~50 pages compose cleanly into 5 strict tiers |

The page passes Idea Validation: improves separation of concerns, composes with all six encoders + cross-cutting layers, adds retrieval clarity (you can grep `crux_atom`), extends without drift (organizes existing pages without rewriting), reduces cognitive overhead by replacing scattered taxonomy with one spine.

---

## Visual — the five-tier ladder

> ![Memory Atomic Design Ladder](../diagrams/15-memory-atomic-design-ladder.png)

The ladder reads bottom-up: each rung composes from the one below. The arrows on the side mark *Frost's painter* — the dance between concrete and abstract that any encoder practitioner does dozens of times in a single encoding session. Zoom in to choose the atom, zoom out to confirm the molecule fits the encoder template, zoom further out to confirm the page can host it.

## Visual — full hierarchy (every tier, every atom)

> ![Memory Atomic Design — full hierarchy](../diagrams/16-memory-atomic-design-full.png)

The thin ladder above shows one path; this diagram shows the whole grid as first rendered — 37 atoms; the registry is now **43** (the 6 MASTER render atoms added 2026-07-03 await the next regeneration). They belong in four family rows (encoding orange · transformation + render blue · storage-retrieval purple · substrate green). Above them: 7 representative molecules, 5 organism pipelines, 4 template schemas, 3 worked palace pages. Solid arrows mark explicit composition (IMG + ELAB → NEDF card; WLK + IDX → Memory Palace; NEDF + CAST → Encoded-SR; Memory Palace → Memory Palace layout → bible-canonical-palace). Dashed arrows mark the same template realizing as multiple page instances.

---

## Excalidraw libraries (drag-and-drop Lego pieces)

Three `.excalidrawlib` v2 files live under `diagrams/lib/`. Import via Library panel → three-dot menu → **Open**.

| Library file | Items | Use it when |
|---|---|---|
| [memory-atoms.excalidrawlib](../diagrams/lib/memory-atoms.excalidrawlib) | 37 atoms in 4 family colors (Encoding · REMAPS+CLAMP/MASTER render · Storage+Retrieval · Substrate+Calibration) — 6 MASTER render atoms pending in the lib; registry now 43 | Sketching a new molecule, organism, or palace page — drop atom-cells in place rather than redrawing |
| [memory-molecules.excalidrawlib](../diagrams/lib/memory-molecules.excalidrawlib) | 6 hub-and-spoke molecule clusters (NEDF · CAST · Palace · Major-system · Reflex-card · Encoded-SR) | Building an organism or page diagram — drop the whole molecule as one unit |
| [memory-tiers.excalidrawlib](../diagrams/lib/memory-tiers.excalidrawlib) | 5 blank tier-shells with canonical color per tier | Starting a new memory ladder, palace, deck, or page-decomposition diagram |

Generator: [`tools/excalidraw_libs/build_memory_libraries.py`](../tools/excalidraw_libs/build_memory_libraries.py). Same deterministic-seed pattern as the PS generator. To add an atom, append a row to the `ATOMS` table in the script and re-run; same for molecules.

The PS and memory atom families use *different* color assignments per family — memory's families are orange (Encoding) · blue (Transformations) · purple (Storage+Retrieval) · green (Substrate). Together with the PS palette (orange = Math, blue = Cognitive, purple = Diagnostic, green = Communicative), the wiki has a 4×2 = 8-family color matrix; intentional overlap is rare because the family-names are different at the tier-name layer.

---

## Calibration defaults

- Atom registry: **8–17 per family** (Transformation + Render is largest at 17 — 6 REMAPS + 5 CLAMP + 6 MASTER), 4 families. Current: 43.
- Molecule registry: **10–18 molecules**. Current: 17.
- Organism registry: **10–14 organisms**. Current: 14.
- Template registry: **10–14 templates**. Current: 13.
- Page registry: unbounded; this is the worked-example library and it should grow.
- Atom-coverage pass-floor: ≥80% of memory events with registered `crux_atom`.
- Tier-conflation pass-floor: <10% of memory events.

---

## Mnemonic

A **mnemonist's atelier** in [Velvet Aeon](./world-velvet-aeon.md) Mode-Environment register, pale-gold late-afternoon light through tall windows onto a workbench. A **STRONG** archetype woman (per [feedback-image-face-and-hair](./feedback-image-face-and-hair.md) — angular jaw, piercing gaze, milky-white skin, waist-length shining hair) stands at the bench, a **glowing brass oil-lamp** (the Lamp recognition phase) lifted in one hand. On the wall behind her: a **periodic-table grid** of atoms in four colors — orange (the Encoding verbs), blue (REMAPS transforms + CLAMP / MASTER render slots), purple (Storage + Retrieval), green (Substrate + Calibration). On the bench in front: six **glass molecule-vessels**, each carrying its own colored cluster — the NEDF four-slot vessel, the CAST graph vessel with little brass animal-figures and wire edges, the SPEAR vessel with a runnable scene inside, the HEART room-vessel with five walls, the ORACLE prediction vessel, the GRACE 1-5 gradient vessel. To the right, on a low shelf: a **stack of palace blueprints** (the templates) — the canonical Memory Palace layout, the personal Mind-Palace layout, the Reflex-card schema. At her feet: a **single open page** — a worked palace instance, bible-canonical-palace, with all 66 books placed on 66 loci, the brass lamp casting one warm shadow across the whole. The Velvet Aeon preserve is **sacred memory** — the atelier is where the encoding work itself becomes a remembered place, and the place remembers what was encoded there.

Sub-scene callout for the atom glyph: a **single chalk-stroke** on the workbench leaves the symbol **LOC** in mono-font, and from that symbol a thin ribbon of chalk-dust forms the NEDF molecule-vessel, then the Encoded-SR pipeline organism, then the Memory Palace layout template, then the Bible canonical palace page — the same chalk-stroke compresses the entire 5-tier ascent.

## Memory checksum

- **5** tiers (Atoms · Molecules · Organisms · Templates · Pages)
- **4** atom families (Encoding · Transformation + Render [REMAPS+CLAMP+MASTER] · Storage+Retrieval · Substrate+Calibration)
- **43** registered atoms · **17** registered molecules · **14** organisms · **13** templates · **20+** worked pages
- **1** strict composition order (upward only)
- **5** new METER fields (atoms_used · crux_atom · molecule_lead · organism · template_slot_at_event)
- **5** new dashboard metrics (atom-vocab-coverage · molecule-name-accuracy · organism-fit · template-match · tier-conflation)
- **1** anti-pattern family (tier-conflation) with **7** named sub-instances
- **3** visuals (atoms periodic table · molecules bonding · 5-tier ladder)
- **3** Excalidraw libraries (atoms · molecules · tier shells)

If you can recite 5-4-43/17/14/13/20+-1-5-5-1/7-3-3 from "memory atomic design" within 60 seconds, the page is encoded.

---

## Related pages

- atomic-design — Brad Frost's canonical five-tier methodology; owner of the Atoms · Molecules · Organisms · Templates · Pages spine
- [problem-solving-atomic-design](./problem-solving-atomic-design.md) — sister application of the lens; identical structure, problem-solving inventory
- [money-atomic-design](./money-atomic-design.md) — third sister application of the lens; same five tiers, money inventory (40 atoms · 20 molecules · 12 organisms · 13 templates · the canonical nine money books as page-tier instances)
- [nedf-overview](./nedf-overview.md) · [cast-overview](./cast-overview.md) · [spear-overview](./spear-overview.md) · [heart-overview](./heart-overview.md) · [oracle-overview](./oracle-overview.md) · [grace-overview](./grace-overview.md) — encoder molecule owners
- [remaps](./remaps.md) · [clamp-render-lens](./clamp-render-lens.md) — transformation and render atom owners
- [memory-palace](./memory-palace.md) · [memory-palace-architecture-for-neural-os](./memory-palace-architecture-for-neural-os.md) · mind-palace-personal-layout — palace template owners
- [encoded-spaced-repetition](./encoded-spaced-repetition.md) · [spaced-repetition](./spaced-repetition.md) · [active-recall](./active-recall.md) — learning-science core organism + atoms
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — the Great Work organism + Reflex card template + Five Elements grid
- [lifecycle-manager](./lifecycle-manager.md) — tier-ladder organism
- [red-queen-skill-gym](./red-queen-skill-gym.md) · construct-recognition-gym · algorithm-pattern-gym · [palace-classification-gym](./palace-classification-gym.md) · [crux-recognition-gym](./crux-recognition-gym.md) — gym organisms
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) · mnemonic-routes-master — Major-system + route molecules
- [memory-paradox](./memory-paradox.md) · [memory-reconsolidation](./memory-reconsolidation.md) · [prospective-memory](./prospective-memory.md) · [tip-of-the-tongue](./tip-of-the-tongue.md) — calibration atoms
- [ok-plateau](./ok-plateau.md) · [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) · [growth-mindset](./growth-mindset.md) · [self-image](./self-image.md) — failure-mode + counter-protocol molecules
- [bdnf-and-neurogenesis](./bdnf-and-neurogenesis.md) · mind-diet · connection-for-protection · mild-cognitive-impairment — substrate atom owners
- [meter-overview](./meter-overview.md) — receiver of the new field group
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) — orthogonal Pattern-tag axis
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) — SRP/OCP/ISP this lens passes
- [composability-index](./composability-index.md) — wiki-wide composability dashboard this lens feeds

---

## U — See (CAST)

1. Mnemonist's atelier with a periodic-table grid behind the workbench, six glass molecule-vessels on the bench, a stack of palace blueprints on the shelf, and one worked palace page on the floor — single chalk-stroke compresses the 5-tier ascent
2. Edges: atom → bonds-to → molecule; molecule → fires-inside → organism; organism → slots-into → template; template → realizes-as → page

## D — Name (NEDF)

1. Five tiers = Atoms · Molecules · Organisms · Templates · Pages
2. Atoms = irreducible memory primitives (4 families · 43 registered)
3. Distinguisher: a *classification lens* for the memory layer, not new encoding tools
4. Failure mode: tier-conflation (running a card-shape as a pipeline, or a layout as a tactic)

## F — Do (SPEAR)

1. New memory asset → ask "what tier?" before adding it
2. Logging a memory event → fill atoms_used + crux_atom + molecule_lead + organism + template_slot_at_event
3. Stuck on an encoding → traverse the ladder both directions; the missing piece is at the tier you haven't named
4. Designing new content → enforce single-responsibility at the right tier

## B — Watch (HEART)

1. Atom-without-molecule logging
2. Molecule-as-organism conflation (running NEDF as if it were the pipeline)
3. Template-without-organism (an empty palace with no SR / gym running on it)
4. Page-without-template (ad-hoc encoding with no schema)
5. Atom registry sprawl (>50) or molecule registry sprawl (>25)

## L — Predict (ORACLE)

1. New domain to encode → predict (organism, molecule, atom) triple before placing a single locus
2. Card going to leech → predict the molecule mismatch (probably NEDF where SPEAR fits, or vice-versa)
3. Worked encoding that can't be tier-decomposed → predict a missing molecule definition in the wiki

## R — Act (GRACE)

1. Encounter an encoding → label it by tier as you go (atom → molecule → organism → template → page)
2. New tactic appears → register at molecule tier with trigger + composition + name before deploying
3. New gym appears → register at organism tier with responsibility-boundary before deploying; verify no overlap with existing organisms
