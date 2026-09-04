---
palace: core-memory
level: 7
domain: 10
room: 7
semantic_mode: 5
wiki_source: wiki/learning-systems/semantic-reading-system.md
---

# Semantic Reading System

**Summary**: A staged semantic reading system that moves from easy extraction to advanced structural modeling. It defines what to tag, when to increase difficulty, how to route extracted material into other Neural OS frameworks, and which missing layers must be added so reading becomes a full learning workflow rather than colored highlighting.

**Sources**:
- raw/Neural OS Book/Semantic Reading.md
- raw/Neural OS Book/Text.md
- raw/Neural OS Book/Thinking.md
- raw/Neural OS Book/Webb's Depth of Knowledge.md
- raw/03 Tactical_Memory/RAPID Framework.md
- framework-comparison-matrix.md
- universal-mental-tagging-framework.md
- language-learning-protocol.md

**Last updated**: 2026-06-01 (L2 extension landed — see [semantic-reading-l2](./semantic-reading-l2.md) for the L2-aware tag family, frontmatter convention, and Krashen i+1 card filter that operationalizes this system as the 70% INPUT block of [language-learning-protocol](./language-learning-protocol.md)).

---

## What This Page Adds

The original semantic reading note establishes the core move: mark information by function while reading so text stops feeling flat. This page turns that idea into a full operating system with progression, diagnostics, outputs, and handoff rules. It is a synthesis layer built on top of the shorter source note rather than a replacement for it. (source: raw/Neural OS Book/Semantic Reading.md; raw/Neural OS Book/Text.md)

The main design judgment here is:

- keep the base method lightweight
- add difficulty only when the text structure demands it
- route extracted material into the correct downstream framework instead of forcing semantic reading to do every job

That keeps the method aligned with [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md): one tool for one job, open to extension, minimal interface by default, and explicit handoff when the problem changes. (source: framework-comparison-matrix.md; universal-mental-tagging-framework.md)

## Core Principle

Semantic reading is not "highlight more." It is functional classification during input.

The key question is:

> What kind of information is this, and what should happen to it next?

That turns reading into a pipeline:

1. detect
2. classify
3. compress
4. route
5. retrieve

The original note already covers detection and basic classification. The missing parts are progression, routing logic, review products, and advanced layers for difficult texts. (source: raw/Neural OS Book/Semantic Reading.md)

## Design Rule: Exponential Difficulty

Do not scale difficulty linearly by "add one more tag."

Scale it exponentially by increasing the structure you are required to perceive:

| Mode | Main demand | Typical cognitive jump |
|---|---|---|
| 1 | notice obvious facts | sentence-level extraction |
| 2 | distinguish function | sentence to paragraph structure |
| 3 | connect statements | local causal and conceptual graph |
| 4 | model hidden structure | delayed effects, constraints, tradeoffs |
| 5 | reconstruct and predict | chapter-level system model |

The jump from Mode 1 to 2 is small. The jump from 3 to 4 is much larger because the reader must stop tracking isolated items and start seeing invisible relations, delays, and bottlenecks. That is where difficulty becomes exponential. (source: raw/Neural OS Book/Semantic Reading.md; raw/Neural OS Book/Thinking.md)

## The Five Modes

### Mode 1: Easy Extraction

Goal:

- stop reading passively
- surface obvious anchors

Use only:

- `Def` definition
- `A` action
- `Q` question

Optional if the text is factual:

- `N` name
- `D` date
- `P` place

Reader task:

- identify what is being defined
- identify what the text says to do
- identify what you do not yet understand

Output:

- short margin tags
- 3-5 bullet recap
- one plain-language restatement

Best for:

- beginner reading
- familiar nonfiction
- short articles
- first pass on a new chapter

Failure mode:

- tagging too much and mistaking decoration for understanding

### Mode 2: Functional Reading

Goal:

- separate information by role, not just content

Core tag set:

- `Def` definition
- `R` relation
- `A` action
- `Q` question
- `M` measure

Reader task:

- identify what claims support what
- identify what the operational takeaway is
- identify how success would be measured

Output:

- tagged paragraph
- mini table with definition, relation, action, and metric columns
- 3 retrieval prompts

Best for:

- how-to text
- technical explanations
- chapters with many claims but low system complexity

Failure mode:

- seeing parts clearly but not the overall flow

### Mode 3: Structural Reading

Goal:

- make local structure visible

Core tag set:

- `Def`, `R`, `A`, `Q`, `M`
- add `Con` constraint
- add `B` bottleneck
- add `L` delay

Reader task:

- identify what limits the system
- identify what fails slowly rather than immediately
- identify which relation actually drives the paragraph

Output:

- local graph or chain
- 3-7 chunks
- one "if this changes, then that changes" set

Best for:

- systems text
- economics
- history with causality
- dense technical chapters

Failure mode:

- collecting tags without compressing them into a model

Handoff rule:

- if local relations dominate, route to [CAST](./cast-overview.md)
- if step order dominates, route to [SPEAR](./spear-overview.md)
- if one concept remains fuzzy, route to [NEDF](./nedf-overview.md)

### Mode 4: Advanced Systems Reading

Goal:

- perceive the structure the author does not fully state

Additional demands:

- infer hidden assumptions
- separate direct from delayed effects
- detect tradeoffs
- track competing constraints
- compare official explanation to actual mechanism

New tag layer:

- `Assump` hidden assumption
- `X` contradiction or tension
- `T` tradeoff

These are synthesis tags added here because the base semantic-reading note does not yet cover adversarial or systems-heavy reading. They should be used only when the text genuinely contains implicit structure. (inference from source: raw/Neural OS Book/Semantic Reading.md; raw/Neural OS Book/Thinking.md)

Reader task:

- ask what must be true for this paragraph to work
- ask what cost is being ignored
- ask what moves later than the prose makes it seem

Output:

- causal graph with constraints and delays
- contradiction list
- one-page chapter model
- weak-point list for discussion or review

Best for:

- policy
- strategy
- science explanations
- system design
- persuasive writing where assumptions matter

Failure mode:

- over-interpreting simple text and inventing structure that is not there

### Mode 5: Expert Regenerative Reading

Goal:

- reconstruct the chapter from structure and predict unseen consequences

Reader task:

- rebuild the text without looking
- convert the chapter into chunks, a graph, a route, or a pattern library
- generate transfer questions
- predict what the next section should say before reading it

Output:

- regeneration from blank page
- retrieval deck
- framework-routed notes
- one transfer or application exercise

Best for:

- books you intend to keep
- exam material
- research domains
- foundational chapters that will be reused

Failure mode:

- doing expert-level output on low-value material and creating maintenance debt

## Mode Selection Rule

Choose the lowest mode that matches the text.

| If the text mainly requires... | Use |
|---|---|
| basic orientation | Mode 1 |
| role separation | Mode 2 |
| local structure | Mode 3 |
| hidden system logic | Mode 4 |
| durable reuse and transfer | Mode 5 |

This follows the same minimal-interface logic used elsewhere in Neural OS: do not invoke a heavier framework unless the failure mode demands it. (source: framework-comparison-matrix.md; universal-mental-tagging-framework.md)

## Tag Families

The original note provides the core tag grammar. The useful refinement is to group the tags by job.

### Anchor Tags

- `N`
- `D`
- `P`

Job:

- factual indexing
- narrative orientation

### Meaning Tags

- `Def`
- `Q`

Job:

- concept identity
- uncertainty localization

### Structure Tags

- `R`
- `Con`
- `B`
- `L`
- `T`
- `X`

Job:

- causal, limiting, and diagnostic reading

### Execution Tags

- `A`
- `M`

Job:

- what to do
- how to know whether it worked

## Mark Vocabulary (operational layer)

The Tag Families above describe the *conceptual* layer (what kinds of information you tag). The operational layer is what lands on disk when the obsidian-semantic-reading plugin parses a page. Four terms compose it:

- **Mark** — a sigil-tagged span inside prose. Syntax: two opening curly braces, the sigil, a pipe, the content body, two closing curly braces. The body slot accepts wiki-links and an optional `note=` clause appended after a second pipe. Reserved characters: a closing curly brace cannot appear in a note clause; a closing square bracket cannot appear in wikilink display text. **For literal mark examples, see** `harsh-startup` **and** `RAP` **after the Phase 1 sweep** — the plugin parses any literal mark in any prose, including documentation, so this owner page describes the grammar in words only.
- **Sigil** — the tag code inside a mark (the part before the `|`). Sigils are organized into families: **Anchor** (`N D P`), **Meaning** (`Def Mn Ex An Q`), **Structure** (`R Ev C B L T X Opp Assump`), **Execution** (`A M`), and the optional **Language** family (`L2 Gloss Pron Pattern MissSnd MissWrd MissGrm MissPrg`) active only under `language: <code>` frontmatter.
- **Route** — the encoder framework where the mark authoritatively lands when downstream tooling aggregates it. Five plugin-canonical routes: **HEART** (people), **CAST** (graph: states, relations, evidence, delays, tradeoffs), **NEDF** (concept hub), **SPEAR** (procedure: actions, constraints, bottlenecks), **ORACLE** (measurement). One universal route: **`*`** (questions appear in every hub). Routes are first-class attributes on every builtin sigil in the plugin's `BUILTIN_TAGS` table — they are not separate metadata.
- **UMTF dimension** — the cross-cutting axis (from `[UMTF](./universal-mental-tagging-framework.md)`: Spatial · Sensory · State · Relation · Pattern · Temporal · Priority) carried by each mark as enrichment metadata. UMTF is orthogonal to sigils: the same Relation mark answers "what kind of claim" (sigil → R, Relation) AND "what dimension" (UMTF → Causal/Temporal/etc.).

On save, the plugin syncs marks into the page's frontmatter as `semantic_tags:` (a YAML list of `{tag, text, para}` entries) and writes `semantic_mode: <1–5>` for the active reading mode. The frontmatter is the index; the inline marks are the input; per-framework `_meta/*.js` files are the derived views.

### Plugin route × wiki framework

The plugin's five routes map onto the wiki's six encoder frameworks (see `[glossary](./glossary.md)` §Encoder spine):

| Plugin route | Wiki framework | Owner page |
|---|---|---|
| **HEART** | HEART (people-model encoder) | `[heart-overview](./heart-overview.md)` |
| **CAST** | CAST (graph encoder) | `[cast-overview](./cast-overview.md)` |
| **NEDF** | NEDF (concept encoder) | `[nedf-overview](./nedf-overview.md)` |
| **SPEAR** | SPEAR (procedure encoder) | `[spear-overview](./spear-overview.md)` |
| **ORACLE** | ORACLE (prediction encoder + measurement bridge to `[METER](./meter-overview.md)`) | `[oracle-overview](./oracle-overview.md)` |
| **`*`** (questions) | wiki-side specialization: a Q mark also feeds `[GRACE](./grace-overview.md)` (social-pragmatic encoder) when its page's frontmatter `semantic_domain:` is in the social-pragmatic set (`relational`, `social-engineering`, `communication`, plus any future profile that declares `routes_q_to_grace: true` in its domain-profiles.json entry — Phase 4). All other Q marks stay universal. Routing is page-level, not per-mark — author overhead is zero; the page's domain identity decides | `[grace-overview](./grace-overview.md)` |

The plugin does not natively route to GRACE; the wiki indexer (`tools/mark_indexer.py`, Phase 2) specializes the `*` route by inspecting `Q` mark content. This is the one place the wiki overlays the plugin's routing.

### Per-sigil routing

Mirrors `BUILTIN_TAGS` in `.obsidian/plugins/semantic-reading/main.js:70` exactly:

| Sigil | Family | Plugin Route | Default UMTF | Parent |
|---|---|---|---|---|
| `N` | Anchor | HEART | Spatial | — |
| `D` | Anchor | CAST | Temporal | — |
| `P` | Anchor | CAST | Spatial | — |
| `Def` | Meaning | NEDF | (text-derived) | — |
| `Mn` | Meaning | NEDF | — | `Def` |
| `Ex` | Meaning | NEDF | — | `Def` |
| `An` | Meaning | NEDF | Pattern | `Def` |
| `Q` | Meaning | `*` (universal; wiki→GRACE on social Qs) | Priority | — |
| `R` | Structure | CAST | Relation | — |
| `Ev` | Structure | CAST | — | `R` |
| `C` | Structure | SPEAR | State | — |
| `B` | Structure | SPEAR | State | — |
| `L` | Structure | CAST | Temporal | — |
| `T` | Structure | CAST | Pattern | — |
| `X` | Structure | CAST | Pattern | — |
| `Opp` | Structure | CAST | Priority | `X` |
| `Assump` | Structure | CAST | (text-derived) | — |
| `A` | Execution | SPEAR | Pattern | — |
| `M` | Execution | ORACLE | (text-derived) | — |

**`C` sigil disambiguation**: in reading-domain marks, `C` = Constraint (per plugin's builtin). The wiki's legacy `Con` for Constraint (registered in `[glossary](./glossary.md)`) is **deprecated for new marks** — use plugin's `C` going forward. The `C` = Continuity from SCREAM (`[semantic-listening-system](./semantic-listening-system.md)`) is reserved exclusively for the listening domain and never appears in reading marks; per-domain sigil sets prevent the collision at the plugin level.

## Missing Parts the Base Method Needed

The short semantic reading note is good as a seed, but it leaves several operational gaps.

### 1. Difficulty progression

Without explicit modes, beginners either under-tag or over-tag. The five-mode ladder fixes that. (source: raw/Neural OS Book/Semantic Reading.md)

### 2. Routing logic

The base note says semantic reading is a bridge to chunks, diagrams, and prompts, but it does not define when to hand off to `NEDF`, `CAST`, or `SPEAR`. This page makes that explicit. (source: raw/Neural OS Book/Semantic Reading.md; framework-comparison-matrix.md)

### 3. Output contracts

A reading method should end in artifacts, not in colorful margins only. This page therefore requires outputs by mode: recap, chunks, graph, retrieval prompts, transfer task. (source: raw/Neural OS Book/Text.md; raw/03 Tactical_Memory/RAPID Framework.md)

### 4. Diagnostics

If semantic reading fails, the reader needs to know why:

- concept unclear
- relation unclear
- hidden constraint missed
- too much tagging
- wrong mode selected

### 5. Review loop

A chapter should not remain a one-time annotation. The system needs regeneration, retrieval prompts, and promotion rules for stable knowledge. (source: raw/03 Tactical_Memory/RAPID Framework.md)

### 6. Performance layers

Semantic reading still does not solve phonology, speed, prediction, or pragmatics by itself. Those remain separate layers, especially in language work. This keeps semantic reading from framework drift. (source: language-learning-protocol.md)

## Routing Table

Once a passage is tagged, send the hard part to the correct subsystem.

| If the difficulty is mainly... | Route to | Why |
|---|---|---|
| concept identity | [NEDF](./nedf-overview.md) | one term or idea is still fuzzy |
| relation structure | [CAST](./cast-overview.md) | connections, constraints, or loops dominate |
| execution order | [SPEAR](./spear-overview.md) | the text is procedural |
| cross-framework tag design | [UMTF](./universal-mental-tagging-framework.md) | you are designing the annotation layer itself |

Semantic reading should stay the ingest layer. It is not the final storage format for every problem. (source: framework-comparison-matrix.md)

## Reading Algorithm

Use this operational sequence.

1. Pre-scan the page or section.
2. Choose the likely mode.
3. Read one paragraph.
4. Mark only the tags that matter for that mode.
5. Stop after the paragraph and compress it into one sentence.
6. Every 2-4 paragraphs, build a chunk or local structure.
7. At section end, route the hard part to the right framework.
8. Regenerate from memory before review is over.

This sequence keeps semantic reading tied to compression and retrieval rather than letting annotation become an end in itself. (source: raw/Neural OS Book/Semantic Reading.md; raw/03 Tactical_Memory/RAPID Framework.md)

## Compression Outputs by Mode

| Mode | Minimum output | Strong output |
|---|---|---|
| 1 | 3-5 bullets | one short recap paragraph |
| 2 | function table | 3 retrieval prompts |
| 3 | chunk list | local graph or chain |
| 4 | chapter model | contradiction and tradeoff map |
| 5 | blank-page regeneration | routed note set plus transfer task |

## Diagnostic Questions

When the reading feels hard, ask:

- Is the problem factual density or hidden structure?
- Am I tagging anchors when I really need relations?
- Am I doing Mode 4 work on a Mode 1 text?
- Which sentence actually changes the model?
- What is delayed, constrained, or unstated?
- What note artifact should exist by the end of this section?

## Drill Ladder

### Beginner Drill

- take one paragraph
- mark only `Def`, `A`, `Q`
- restate it in plain language

### Intermediate Drill

- take one page
- mark `Def`, `R`, `A`, `M`
- convert into 3 chunks and 3 prompts

### Advanced Drill

- take one argumentative or systems-heavy page
- mark `R`, `Con`, `B`, `L`, `Assump`, `T`
- draw one causal map and one contradiction list

### Expert Drill

- read one short chapter
- predict the next section before reading
- regenerate the finished chapter from memory
- route the result into the right framework

For a full zero-to-hero progression with pass rules, daily blocks, and failure-mode routing, use [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md).

## Example Progression

Source sentence:

`Industrialization increased factory output, but overcrowded cities created sanitation bottlenecks whose health effects appeared years later.`

Mode 1:

- `[A: industrialization increased factory output]`
- `[Q: why did cities become bottlenecks?]`

Mode 2:

- `[R: industrialization -> factory output increase]`
- `[B: overcrowded cities]`
- `[Q: what mechanism links crowding to health?]`

Mode 3:

- `[R: industrialization -> urban crowding]`
- `[B: sanitation capacity]`
- `[L: health effects appear years later]`

Mode 4:

- `[C: sanitation infrastructure grows slower than population]`
- `[Assump: production growth is treated as net progress]`
- `[T: output gain vs public-health degradation]`

Mode 5:

- chapter model: growth pressure -> urban density -> sanitation lag -> delayed health cost
- transfer question: what modern systems show the same "growth outruns infrastructure" pattern?

## Relationship to Webb's Depth and RAPID

Semantic reading is one of the cleanest upgrades for middle-depth comprehension.

- At lower difficulty, it helps with noticing and classifying.
- At medium difficulty, it supports chunking and structured understanding.
- At high difficulty, it becomes a front-end for model-building, retrieval, and transfer.

That makes it especially compatible with higher-depth learning tasks in [rapid-in-neural-os](./rapid-in-neural-os.md) and with the progression logic described in Webb's depth notes. (source: raw/Neural OS Book/Webb's Depth of Knowledge.md; raw/03 Tactical_Memory/RAPID Framework.md)

## Listening Counterpart

The live-speech counterpart to this page is [semantic-listening-system](./semantic-listening-system.md).

Use that page when:

- the input is spoken rather than written
- the structure is disappearing while you process it
- speaker shifts, repair, prediction, or noise matter
- you need `SCREAM` rather than paragraph-based extraction

The relationship is simple:

- semantic reading = classify and compress a stable page
- semantic listening = classify and compress a moving stream

They share function tags, chunking, routing, and regeneration, but listening adds prediction, recovery, and thread preservation because the medium is less forgiving. (source: raw/Neural OS Book/Active Listening.md; language-learning-protocol.md)

## Governance Rules

- Do not tag everything.
- Do not use advanced tags when simple tags already expose the structure.
- Do not keep semantic-reading output in margin form only if the material matters long term.
- Do not let semantic reading absorb jobs that belong to NEDF, CAST, SPEAR, or language-performance loops.
- Promote only high-value passages into durable artifacts.

## Bottom Line

Semantic reading should start simple and become harder only as structure demands it.

The progression is:

- easy extraction
- functional reading
- structural reading
- advanced systems reading
- expert regenerative reading

That gives the method a clean maturity ladder without violating separation of concerns. Semantic reading stays the ingest and triage layer. Other frameworks still handle deep storage, execution, or graph structure. This page's main synthesis judgment is that such a split is both cognitively lighter and architecturally cleaner than trying to make one reading method do everything. (source: framework-comparison-matrix.md; universal-mental-tagging-framework.md; raw/Neural OS Book/Semantic Reading.md)

## Relationship To ORACLE

The expert regenerative reading mode at the top of this page's progression involves anticipating the next paragraph, the missing argument, the unstated assumption — that anticipation is the runtime user of [ORACLE](./oracle-overview.md) sequential mode over text corpora. ORACLE owns the encoding and training of those predictions; semantic reading is one of the live consumers that uses them during real reading. The split mirrors the [semantic-listening-system](./semantic-listening-system.md) / ORACLE relationship: the encoder side (ORACLE) handles graded prediction structure; the capture side (this page) handles routing and output once material is read.

## Related Pages

- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [semantic-reading-drill-ladder](./semantic-reading-drill-ladder.md)
- [semantic-input-cheat-sheet](./semantic-input-cheat-sheet.md)
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [semantic-listening-system](./semantic-listening-system.md)
- [language-learning-protocol](./language-learning-protocol.md)
- [NEDF](./nedf-overview.md)
- [CAST System](./cast-overview.md)
- [SPEAR](./spear-overview.md)
- [ORACLE](./oracle-overview.md)
- persuasive-writing-and-influence — **production-side sibling**; this page (written reception) + persuasive-writing (written production) = **Instance 3 of production-reception-grammar-pair**. The persuasive-writing page already self-identified as "the output equivalent of semantic listening" before the pattern was named.
- production-reception-grammar-pair — pattern owner (confirmed N=3 on 2026-05-27)


---

## U — See (CAST)
1. Staged semantic reading from easy extraction to advanced structural modeling
2. Defines what to tag, when to increase difficulty, how to route

## D — Name (NEDF)
1. Semantic reading system = staged reading workflow
2. Distinguisher: reading as full learning workflow, not highlighting
3. Failure mode: colored highlighting without tagging

## F — Do (SPEAR)
1. Pick text → tag function
2. Route extracted material into other Neural OS frameworks

## B — Watch (HEART)
1. Highlighting drift
2. Skipping routing

## L — Predict (ORACLE)
1. Stage → predict tag depth
2. Tag → predict routing

## R — Act (GRACE)
1. Reading task → run system
2. Stuck → consult stage