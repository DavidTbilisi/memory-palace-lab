---
palace: meta-knowledge
level: 7
domain: 10
room: 1
semantic_mode: 5
wiki_source: wiki/encoders/framework-comparison-matrix.md
---

# Framework Comparison Matrix

**Summary**: A side-by-side comparison of the six Neural OS encoders ([NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), [GRACE](./grace-overview.md)) plus the [UMTF](./universal-mental-tagging-framework.md) cross-cutting taxonomy that runs through all of them.

**Sources**:
- FRAMEWORK_OVERVIEW.md
- 03_NEDF_TEMPLATE.md
- 04_CAST_TEMPLATE.md
- 05_SPEAR_TEMPLATE.md
- HEART_OVERVIEW.md
- PEOPLE_PALACE_STRUCTURE.md
- CAST and Georgian Node System.md
- Concept Encoding Protocol.md

**Last updated**: 2026-08-27 ([PRISM](./prism-pattern-discovery.md) added to the Capture / scoping row — `/validate-idea` keep-with-modification); 2026-08-20 (the six encoders drawn as their count-shape hexagon — [representation-rules](./representation-rules.md) Rule 10 declared instance); 2026-07-03 (Render / Externalization layer added — image-gen + music-gen canonized); 2026-05-12 (METER, Problem-Solving OS, Neural OS Daily Loop added)

---

## Purpose

This page is a synthesis map. Its job is to show what each framework is for, what kind of material it handles best, which [UMTF](./universal-mental-tagging-framework.md) dimensions dominate it, and where one framework hands off to another. It is derived from the existing framework sources rather than from one single source file. (source: FRAMEWORK_OVERVIEW.md; HEART_OVERVIEW.md; CAST and Georgian Node System.md)

## Architecture: Five Layers, Three Cross-Cutting, Three Operating Stacks, One Workspace Shell

Neural OS encoders do not stand alone. A **workspace shell** (PARA) underneath gives every page, file, and roadmap a lifecycle home. A **capture / scoping layer** runs above the encoders, a **render / externalization layer** turns encoded scenes into external sensory artifacts, a **performance layer** below, a **lifecycle layer** alongside owning retirement and consolidation, three cross-cutting layers (UMTF taxonomy, PULSE governance, METER measurement), and three operating stacks (Problem-Solving OS, Daily Loop, PARA) that sequence the layers into runnable rhythms.

- **Workspace shell** — PARA partitions every workspace item (page, file, clipping, roadmap) by actionability into Projects / Areas / Resources / Archives + Inbox. The capture layer above writes *into* PARA buckets; the encoders read *from* their PARA homes.
- **Capture / scoping layer** — controls when and what to encode, and turns raw situations into framework-ready notes
- **Encoding layer** — produces the durable memory artifact (concept, graph, procedure, person, prediction, social move)
- **Render / Externalization layer** — turns an encoded *mental* scene into an *external* sensory artifact (a real image or song) via a render-lens + generator, adding a retrieval channel parallel to the mental scene
- **Performance layer** — turns encoded knowledge into low-latency reflex
- **Lifecycle layer** — retires, compresses, and consolidates encoded material so the system stays small and current
- **Cross-cutting (taxonomy)** — UMTF gives every layer a shared tag vocabulary
- **Cross-cutting (governance)** — PULSE reads cognitive state and modulates every layer's intensity, volume, and gating
- **Cross-cutting (measurement)** — METER provides unified event schema, append-only log, and periodic reports
- **Operating stacks** — Problem-Solving OS, Neural OS Daily Loop, and PARA's weekly review sequence the layers into actionable rhythms

| Layer | Members | Output |
|---|---|---|
| Workspace shell | PARA (P · A · R · X + Inbox) | Every item has a lifecycle home; classified by `para:` frontmatter + folder location |
| Capture / scoping | [RAPID](./rapid-in-neural-os.md), [BRIDGE LOAD](./bridge-load.md), [ORIENT](./orient-method.md), [Semantic Input](./semantic-input-cheat-sheet.md), [PRISM](./prism-pattern-discovery.md) | Structured notes routed to the right encoder; PRISM turns a designed case set into one graded rule |
| Encoding | [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), [GRACE](./grace-overview.md) | Durable memory artifact |
| Render / Externalization | [Image Pipeline](./image-pipeline.md) (visual), [Music Pipeline](./music-generation-frameworks.md) (auditory) | External sensory artifact (image / song) + one extra retrieval channel per encoded scene |
| Performance | [Red Queen Gym](./red-queen-skill-gym.md), [Drill Generator](./drill-generator.md), [Automaticity](./automaticity-and-reflex-training.md) | Low-latency reflex on encoded material |
| Lifecycle (encoded artifacts) | [Lifecycle Manager](./lifecycle-manager.md) | Retired, compressed, or consolidated artifacts (microscopic — per card) |
| Cross-cutting (taxonomy) | [UMTF](./universal-mental-tagging-framework.md) | Tag vocabulary used by all layers |
| Cross-cutting (governance) | [PULSE](./pulse-overview.md) | State-conditioned modulation of all layers |
| Cross-cutting (measurement) | [METER](./meter-overview.md) | Unified events, append-only log, periodic reports |
| Operating stack (problems) | [Problem-Solving OS](./problem-solving-os.md) | Routed-and-measured problem-solving rhythm |
| Operating stack (daily) | Neural OS Daily Loop | Daily / weekly / monthly governance rhythm |
| Operating stack (workspace) | PARA weekly review | Sunday inbox-drain + project triage + archive sweep |

Capture members decide *what is worth encoding and where it goes*. Encoding members decide *how the artifact is shaped for retention and retrieval*. Render / Externalization members decide *whether and how an encoded scene becomes a real artifact the operator can look at or play* — the optional step that converts a mental image into a second retrieval channel. Performance members turn correct retrieval into fluent execution. Lifecycle decides *when and how an artifact stops getting full attention*. UMTF gives every layer a shared vocabulary. PULSE reads the user's state and modulates *how hard the system pushes* across every layer. METER turns every operation into measurable signal. The two operating stacks turn the architecture into a rhythm the user can actually run.

## The Render / Externalization layer

The six encoders produce a *mental* artifact — a scene, graph, procedure, or person-room held in the mind. The **Render / Externalization layer** is the optional step that turns that mental scene into an **external sensory artifact**: a real image you can look at, or a song you can play. Its payoff is a **second retrieval channel** running parallel to the mental scene — and where the two channels have complementary blind spots they cover each other (the [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) installs an ordered forward chain the Anki deck can't train, while the deck keeps reverse lookup fast).

**Two confirmed channels, one abstraction.** The layer depends on the *render-lens* abstraction ([Dependency Inversion](./software-design-principles-for-neural-os.md)); each channel is a concrete Strategy selected by output medium, with a Flyweight world-profile as its auto-loaded default:

| Channel | Render-lens | Generator | Default world profile | Pipeline |
|---|---|---|---|---|
| **Visual** | [CLAMP](./clamp-render-lens.md) (Camera · Lighting · Aspect · Medium · Preserve) | image-gen (gpt-image / DALL-E / Midjourney) | [Velvet Aeon](./world-velvet-aeon.md) | [image-pipeline](./image-pipeline.md) |
| **Auditory** | [MASTER](./music-generation-frameworks.md) (Meter · Arrangement · Space · Timbre · Energy-arc · Restrict) | music-gen (Suno) | music-profile | [music-generation-frameworks](./music-generation-frameworks.md) |

**REMAPS stays upstream, not inside this layer.** [REMAPS](./remaps.md) is the shared *transform* that makes a scene retrievable; it serves pure mental encoding too (where no artifact is produced), so it is not part of the Render layer. The layer begins at the render-lens. This keeps each layer single-responsibility: Transform (REMAPS) makes the scene *hold*; Render (CLAMP / MASTER + generator) makes it *external*. See [image-pipeline](./image-pipeline.md) for the transform→render composition and [memory-atomic-design](./memory-atomic-design.md) for the atom / organism decomposition.

**Falsifier (why it stays canonical).** A channel earns its place only while it has ≥1 worked instance where the externalized artifact adds a retrieval path the mental scene lacked, and is invoked ≥3× in ~4 weeks; otherwise it demotes to a cross-cutting utility. Auditory is satisfied ([famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) — "sing forward and the hours fall out in order," a chain the deck doesn't train); **visual is now satisfied too** ([clocks24-visual-render](./clocks24-visual-render.md) — see→recall recognition + the founding year fused into the image, retrieval paths the deck and song lack). METER: `render.channel_invoked {channel, encoder_slot, world_profile}` plus per-channel `image_gen.*` / `music_gen.*` events. Registered in [composability-index](./composability-index.md).

## Quick Matrix

| Framework | Main job | Best for | Core unit | Dominant UMTF stack | Primary output |
|---|---|---|---|---|---|
| [NEDF](./nedf-overview.md) | Encode a concept | Terms, definitions, ideas, mental models | One concept scene | Sensory + State + Priority | One vivid integrated concept scene |
| [CAST](./cast-overview.md) | Encode relations | Systems, graphs, dependencies, flows | Nodes + edges in a palace | Relation + Spatial + State + Priority | Walkable graph structure |
| [SPEAR](./spear-overview.md) | Encode execution | Algorithms, workflows, procedures | Executable story-chain | Temporal + Spatial + State + Priority | Runnable procedural memory |
| [HEART](./heart-overview.md) | Encode a person model | Children, students, family, colleagues | One person room | Spatial + Sensory + Pattern + Relation + Priority | Falsifiable people model |
| [ORACLE](./oracle-overview.md) | Encode prediction | Sequential / conditional / distributional / anomaly | One prediction card (O/R/A/C/L/E) | Pattern + Temporal + State + Priority | Anticipation that fires before deliberation |
| [GRACE](./grace-overview.md) | Encode social move selection on a gradient | Politeness / tone / hierarchy / subtext / apology-disagreement / community | One graded move card (G/R/A/C/E) with 1-5 scale | Pattern + Sensory + State + Relation + Priority | Calibrated social move at the right gradient position |
| [UMTF](./universal-mental-tagging-framework.md) | Unify tag logic | Cross-framework design and analysis | Tag dimension | Spatial + Sensory + State + Relation + Pattern + Temporal + Priority | Shared tagging language |

## The six encoders — count-shape

**Six members, so the count-shape is a hexagon** ([representation-rules](./representation-rules.md) Rule 10, declared instance 2026-08-20). The encoders are *peers*, selected by what the material is (§By Material Type) rather than run in sequence — an unordered set, so a polygon and not a ladder:

```
              NEDF 🧩  ─────────────  CAST 🕸️
                ╱                         ╲
               ╱                           ╲
      GRACE 🤝              six              SPEAR 🎬
     social move          encoders          procedure
               ╲                           ╱
                ╲                         ╱
             ORACLE 🔭  ───────────  HEART 🪪
             prediction               person
```

Reading around the hexagon: **NEDF** one concept · **CAST** a graph · **SPEAR** a procedure · **HEART** a person · **ORACLE** a prediction · **GRACE** a social move.

**Test** (Rule 10): cover the labels. Six seats are visible, so "which encoder am I forgetting?" is answered by looking rather than by recalling — the question this page exists to answer.

## By Question Type

| If your question is... | Use | Why |
|---|---|---|
| "What is this?" | [NEDF](./nedf-overview.md) | The difficulty is concept identity and meaning |
| "What connects to what?" | [CAST](./cast-overview.md) | The difficulty is structure, dependency, or flow |
| "How do I do it?" | [SPEAR](./spear-overview.md) | The difficulty is execution order and branching |
| "How does this person tend to work?" | [HEART](./heart-overview.md) | The difficulty is recognition, pattern, treatment, and history |
| "What comes next / what would feel wrong?" | [ORACLE](./oracle-overview.md) | The difficulty is anticipation before deliberation |
| "What is the right move on this social gradient?" | [GRACE](./grace-overview.md) | The difficulty is graded position selection under social cues |
| "Which tag dimensions am I using?" | [UMTF](./universal-mental-tagging-framework.md) | The difficulty is framework design or alignment |

## By Material Type

| Material | Default framework | Typical secondary framework |
|---|---|---|
| Definition or abstract term | [NEDF](./nedf-overview.md) | [CAST](./cast-overview.md) if the concept's neighbors matter |
| Technical system | [CAST](./cast-overview.md) | [NEDF](./nedf-overview.md) for node concepts, [SPEAR](./spear-overview.md) for procedures |
| Algorithm | [SPEAR](./spear-overview.md) | [NEDF](./nedf-overview.md) for core ideas, [CAST](./cast-overview.md) for system context |
| Historical or dynamic process | [CAST](./cast-overview.md) or [SPEAR](./spear-overview.md) | [NEDF](./nedf-overview.md) for key terms |
| Important person | [HEART](./heart-overview.md) | [NEDF](./nedf-overview.md) for history scenes |
| Mixed complex topic | Combined approach | Usually NEDF + CAST + SPEAR |

## Structural Comparison

| Framework | Internal structure | Memory shape | Typical scale |
|---|---|---|---|
| [NEDF](./nedf-overview.md) | N + E + D + F | Single integrated scene | One concept at a time |
| [CAST](./cast-overview.md) | Nodes + edges + palace + tiers | Network or hierarchy you can walk | 5-node graph to large system |
| [SPEAR](./spear-overview.md) | S + P + E + A + R | Story-chain or route | One procedure or algorithm |
| [HEART](./heart-overview.md) | Recognition + History + Essence + Architecture + Treatment + Pattern tag | One room per person | One person or people palace |
| [ORACLE](./oracle-overview.md) | O + R + A + C + L + E (mode-tagged) | Trigger-and-prediction pair, optionally with face on existing card | One prediction card or face on any other encoder card |
| [GRACE](./grace-overview.md) | G + R + A + C + E (mode-tagged, culture-tagged) | Graded scale of responses with selection criteria | One social-situation card per graded move pattern |
| [UMTF](./universal-mental-tagging-framework.md) | 7 tag families | Analysis layer, not a standalone scene | Any framework |

## Dominant Failure Modes

| Framework | Common failure if misused |
|---|---|
| [NEDF](./nedf-overview.md) | Strong hook, weak meaning; memorable image without operational distinction |
| [CAST](./cast-overview.md) | Memorizing nodes without readable edges; overencoding low-value structure |
| [SPEAR](./spear-overview.md) | Memorizing happy-path steps without preconditions, branches, or repair |
| [HEART](./heart-overview.md) | Projection, vague trait lists, or unfalsifiable behavioral stories |
| [ORACLE](./oracle-overview.md) | Mode confusion; missing C (no firing trigger); faked Anomaly slot; over-precise Likelihood |
| [GRACE](./grace-overview.md) | Mode confusion; gradient collapse (only 2-3 positions); single-answer framing; Read miscalibration; stale culture tag; empty Exit; right-answer rumination |
| [UMTF](./universal-mental-tagging-framework.md) | Over-tagging or confusing dimensions that should stay orthogonal |

## Handoff Rules

| If you notice... | Shift toward |
|---|---|
| The concept is clear, but its neighbors are confusing | [CAST](./cast-overview.md) |
| The concept is clear, but you cannot perform it | [SPEAR](./spear-overview.md) |
| The procedure is clear, but the core idea is fuzzy | [NEDF](./nedf-overview.md) |
| The system is clear, but you forget what each node means | [NEDF](./nedf-overview.md) for the nodes |
| The people model lacks pattern transfer | [HEART](./heart-overview.md) pattern library work |
| The framework design feels inconsistent | [UMTF](./universal-mental-tagging-framework.md) |

## UMTF Emphasis Matrix

| Framework | Spatial | Sensory | State | Relation | Pattern | Temporal | Priority |
|---|---|---|---|---|---|---|---|
| [NEDF](./nedf-overview.md) | Low-Med | High | High | Low | Med | Low | High |
| [CAST](./cast-overview.md) | High | Low-Med | High | High | Med-High | Med-High | High |
| [SPEAR](./spear-overview.md) | High | Med | High | Low | Med | High | High |
| [HEART](./heart-overview.md) | High | High | Med-High | Med-High | High | Med | High |
| [ORACLE](./oracle-overview.md) | Low | Low | High | Low | High | High | High |
| [GRACE](./grace-overview.md) | Low | High | High | Med-High | High | Low | High |
| [UMTF](./universal-mental-tagging-framework.md) | High | High | High | High | High | High | High |

These are comparative emphasis levels, not absolute scores. They are synthesis judgments based on the current framework pages and the Dominant UMTF Stack column of the Quick Matrix above. (source: FRAMEWORK_OVERVIEW.md; HEART_OVERVIEW.md; CAST and Georgian Node System.md; oracle-overview.md; grace-overview.md)

## Practical Selection Rule

Use this compressed decision rule:

- if the problem is a **thing**, start with [NEDF](./nedf-overview.md)
- if the problem is a **connection structure**, start with [CAST](./cast-overview.md)
- if the problem is a **process**, start with [SPEAR](./spear-overview.md)
- if the problem is a **person**, start with [HEART](./heart-overview.md)
- if the problem is **anticipating what comes next or sensing wrongness**, use [ORACLE](./oracle-overview.md)
- if the problem is **picking the right social move on a gradient**, use [GRACE](./grace-overview.md)
- if the problem is **how to design the encoding itself**, use [UMTF](./universal-mental-tagging-framework.md)

## Diagrams

Layered architecture — the encoding layers, three cross-cutting layers, operating stacks *(schematic predates the Render / Externalization layer added 2026-07-03)*:

![framework-comparison-matrix schematic](../diagrams/09-framework-comparison-matrix.png)

Hero — the alchemist's atelier metaphor: seven chambers radiating around a central cataloger who stamps every artifact with the shared UMTF taxonomy:

![framework-comparison-matrix hero](../diagrams/heroes/framework-comparison-matrix.png)

## Related Pages

- [NEDF](./nedf-overview.md)
- [CAST System](./cast-overview.md)
- [SPEAR](./spear-overview.md)
- [HEART](./heart-overview.md)
- [ORACLE](./oracle-overview.md)
- [GRACE](./grace-overview.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [umtf-operational-template](./umtf-operational-template.md)
- [prism-pattern-discovery](./prism-pattern-discovery.md) — capture / scoping member (added 2026-08-27): extracts a rule from a designed case set, grades it on the Pattern confidence ladder, then hands it to NEDF + ORACLE
- [image-pipeline](./image-pipeline.md) — visual channel of the Render / Externalization layer
- [music-generation-frameworks](./music-generation-frameworks.md) — auditory channel of the Render / Externalization layer
- [lifecycle-manager](./lifecycle-manager.md)
- [PULSE](./pulse-overview.md)
- [METER](./meter-overview.md)
- [problem-solving-os](./problem-solving-os.md)
- neural-os-daily-loop
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [missing-encoding-layers](./missing-encoding-layers.md)
- [sloan-triad-model](./sloan-triad-model.md) — strategy-mode meta-frame *above* the encoder spine (added 2026-05-27 from [sloan-learning-to-think-strategically](./sloan-learning-to-think-strategically.md) ingest); picks the cognitive cluster that runs the encoders, not the encoders themselves
- [strategic-thinking-cognitive-cluster](./strategic-thinking-cognitive-cluster.md) — the cluster split that the [sloan-triad-model](./sloan-triad-model.md) selects between

---

## U — See (CAST)
1. Seven-column comparison: 6 encoders + UMTF
2. Edges between frameworks: shared slots, handoffs

## D — Name (NEDF)
1. Master comparison of all Neural OS encoders, side-by-side
2. Single screen, scannable
3. Used when picking which encoder for a new topic

## F — Do (SPEAR)
1. New topic? Scan matrix → pick encoder
2. Confused about CAST vs NEDF? Compare row by row
3. UMTF cuts across all → use as cross-link layer

## B — Watch (HEART)
1. Two encoders fighting for the same job
2. Topic forced into wrong encoder → friction
3. UMTF tags missing from rows

## L — Predict (ORACLE)
1. Matrix predicts which encoder will hold the topic
2. Mismatch predicts recall failure

## R — Act (GRACE)
1. Encoder selection → consult this matrix
2. Framework drift → update the matrix first