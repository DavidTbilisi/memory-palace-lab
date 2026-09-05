---
palace: meta-knowledge
level: 4
domain: 10
room: 10
semantic_mode: 5
wiki_source: wiki/problem-solving/problem-solving-atomic-design.md
---

# Problem-Solving Atomic Design

**Summary**: A structural classification of the wiki's problem-solving inventory along Brad Frost's five-tier *Atomic Design* spine — **Atoms · Molecules · Organisms · Templates · Pages**. Atoms are irreducible primitives (single techniques, single diagnostic signals); molecules are tactic-grade combinations (e.g. the four [universal tactics](./universal-mathematical-tactics.md)); organisms are the named pipelines ([FRAME FORGE](./frame-forge.md), [decision-kernel](./decision-kernel.md), the [crux-recognition-gym](./crux-recognition-gym.md)); templates are the page-level skeletons (the [Problem-Solving OS](./problem-solving-os.md) operating stack, [Pólya / McKinsey / DMAIC](./problem-solving-pipeline-equivalence.md)); pages are templates filled with real content (the four worked examples on [problem-solving-os](./problem-solving-os.md), the Hungarian-1926 problem, the de Bruijn rectangle). This page is a lens, not a new tool: it lets us *traverse between abstract and concrete*, see what is missing, and govern composition without inventing parallel definitions.

**Sources**:
- Brad Frost, *Atomic Design* (2016) — methodology source; the five-stage spine. Local clipping at `Clippings/Atomic Design Methodology  Atomic Design by Brad Frost.md`.
- [problem-solving-os](./problem-solving-os.md) — the sequencer this lens organizes.
- [problem-solving-three-levels](./problem-solving-three-levels.md) · [crux-move](./crux-move.md) · [universal-mathematical-tactics](./universal-mathematical-tactics.md) · [zeitz-startup-strategies](./zeitz-startup-strategies.md) · [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — atoms and molecules registry.
- [frame-forge](./frame-forge.md) · [decision-kernel](./decision-kernel.md) · [attention-framework](./attention-framework.md) · [red-queen-skill-gym](./red-queen-skill-gym.md) · [crux-recognition-gym](./crux-recognition-gym.md) · [Great Work](./automaticity-and-reflex-training.md) — organism registry.
- [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) — alternate template inventory (Pólya, McKinsey, DMAIC, 8D, CRISP-DM, SOAP/OPQRST).
- Design conversation, 2026-05-24.

**Last updated**: 2026-05-24

---

## Why this page exists

The wiki's problem-solving layer has been growing in two directions at once. **Down** into ever-finer techniques (linguistic crux, inclusion–exclusion, ceiling of log_b N) and **up** into ever-broader pipelines (FRAME FORGE, decision-kernel, the Crux-Recognition Gym, the Problem-Solving OS itself). What was missing is the *spine* — a single classification that tells you, for any given problem-solving asset, *what kind of thing* it is and *how it composes* with the other tiers.

Brad Frost's *Atomic Design* (2016) is that spine, transposed from UI design. The five tiers are well-known, hierarchical, and force the [single-responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) at each tier — exactly what the wiki's `software-design-principles-for-neural-os` page already asks of any new structural addition.

> *Atomic design is not a linear process, but rather a mental model to help us think of our user interfaces as both a cohesive whole and a collection of parts at the same time.* — Frost

The same is true here. A solved problem is *simultaneously* a page (a worked instance), a template (the operating-stack skeleton it followed), a sequence of organisms (the pipelines it invoked), a chain of molecules (the tactics that powered it), and a string of atoms (the specific techniques it used). This page is the dictionary.

## The five-tier mapping (master table)

| Tier | Definition (Frost) | Problem-solving instance | Catalog page |
|---|---|---|---|
| **Atom** | "Foundational building blocks; cannot be broken further without ceasing to be functional" | One specific technique, signal, or primitive (difference-of-two-squares · Gaussian pairing · *too-clean-answer* test) | §Atoms below |
| **Molecule** | "Relatively simple groups of UI elements functioning together as a unit" | A *tactic* — small combination of atoms that has its own trigger and shape (Pigeonhole · Extreme · Symmetry · Invariant · Zeitz startup-quartet · linguistic-crux protocol) | §Molecules below |
| **Organism** | "Relatively complex components composed of molecules and atoms forming distinct sections" | A named *pipeline* — [FRAME FORGE](./frame-forge.md), [decision-kernel](./decision-kernel.md), [attention-framework](./attention-framework.md), [crux-recognition-gym](./crux-recognition-gym.md), [Great Work](./automaticity-and-reflex-training.md) | §Organisms below |
| **Template** | "Page-level objects that place components into a layout and articulate the underlying content structure" | A *skeleton* with named slots — [PS-OS Operating Stack](./problem-solving-os.md), [Pólya / McKinsey / DMAIC / 8D / CRISP-DM](./problem-solving-pipeline-equivalence.md), the METER event-schema, the Daily Rhythm | §Templates below |
| **Page** | "Specific instances of templates that show what a UI looks like with real representative content" | A *worked solve* — the four worked examples on [problem-solving-os](./problem-solving-os.md) (Bellman-Ford / writing-avoidance / IC-vs-EM / study-time), the [1926 Hungarian contest](./problem-solving-three-levels.md) problem, the de Bruijn rectangle | §Pages below |

The five tiers compose strictly upward — a molecule is built of atoms; an organism of molecules and atoms; a template positions organisms; a page realizes a template. They do *not* compose downward — you cannot decompose an organism into a single atom, and you cannot strip the operating stack down to a tool.

The hierarchy is the discipline.

---

## Atoms

> ![Visual atoms — Problem-Solving Periodic Table](../diagrams/14-ps-atomic-design-atoms.png)

An **atom** is irreducible: split it and the move ceases to exist. Atoms cluster into four chemical families. Each cell has a two- or three-letter symbol; this is the wiki's working alphabet for tactic and crux annotation in METER events.

### Math family (yellow / orange) — manipulation primitives

| Symbol | Atom | Owner / first defined |
|---|---|---|
| **DOTS** | Difference of two squares | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Symmetry; [problem-solving-three-levels](./problem-solving-three-levels.md) §worked-example |
| **SUBu** | Substitution u := x + 1/x (and cyclic-substitution family) | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Symmetry |
| **PAIR** | Gaussian pairing (1+100 = 2+99 = …) | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Symmetry |
| **INC** | Inclusion–exclusion \|A∪B\|=\|A\|+\|B\|−\|A∩B\| | inclusion-exclusion-tool |
| **PIG** | ⌈p/h⌉ (intermediate-pigeonhole count) | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Pigeonhole |
| **LOG** | ⌈log_b N⌉ (information-theoretic minimum tests) | information-theoretic-minimum |
| **DIG** | n − digit_sum(n) ≡ 0 (mod 9) | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Invariants §4b |
| **PAR** | Parity flip (binary invariant) | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Invariants §4a |
| **CON** | Conway sum ζ^(distance to goal), ζ² + ζ − 1 = 0 | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §Invariants §4d |
| **REL** | Bellman–Ford relaxation | [problem-solving-os](./problem-solving-os.md) §Example-1 |

### Cognitive family (blue) — generic move primitives

| Symbol | Atom | Owner |
|---|---|---|
| **1S** | State the problem in one sentence | [problem-solving-os](./problem-solving-os.md) step 1 |
| **PEN** | Penultimate step — "what would yield the conclusion in one move?" | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **WT** | Wishful thinking — "what *would I want* to be true here?" | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **HD** | Get your hands dirty — small-case table, compute f(1..5) | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **EZ** | Make it easier — drop a constraint, lower the dimension | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **SV** | Smallest viable first action (≤ 90 s) | [attention-framework](./attention-framework.md) |
| **REC** | Recast — re-read with a deliberately different frame | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast |
| **PRE** | Pre-mortem — imagine the failure before executing | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) §N9 |

### Diagnostic family (purple / red) — recognition signals

| Symbol | Atom | Owner |
|---|---|---|
| **ETA** | Embellishment-to-arithmetic ratio (anti-tactic signal #1) | [anti-tactic-detection](./anti-tactic-detection.md) |
| **TC** | Too-clean obvious answer (anti-tactic signal #2) | [anti-tactic-detection](./anti-tactic-detection.md) |
| **GA** | Genre-aware framing (anti-tactic signal #3) | [anti-tactic-detection](./anti-tactic-detection.md) |
| **DR** | Disproportionate resistance (crux signal #1) | [crux-move](./crux-move.md) §"How to detect in real time" |
| **WG** | Wishful-thinking gradient (crux signal #2) | [crux-move](./crux-move.md) |
| **PP** | Plateau pattern (crux signal #3) | [crux-move](./crux-move.md) |
| **RH** | Red-herring fact filter | [red-herring-resistance](./red-herring-resistance.md) |
| **LP** | Linguistic pivot check | [linguistic-crux](./linguistic-crux.md) |

### Communicative family (green) — delivery primitives

These are the *N1 delivery-layer* atoms surfaced by [external-problem-solving-frameworks](./external-problem-solving-frameworks.md). They are still candidate-atoms pending the architecture decision on whether to extend [problem-solving-os](./problem-solving-os.md) with a step 5.5 (Communicate) or to spin a sibling protocol.

| Symbol | Atom | Source |
|---|---|---|
| **CF1** | Conclusion-first (Minto Pyramid Principle) | McKinsey / Minto |
| **SBAR** | Situation–Background–Assessment–Recommendation | Kaiser / clinical handoff |
| **DESC** | Describe–Explain–Specify–Consequence | Aviation CRM |
| **NEM** | Nemawashi (pre-wire stakeholders) | Toyota TPS |
| **AAR** | After-Action Review | US Army; Google SRE blameless postmortem |
| **CREAC** | Conclusion–Rule–Explanation–Application–Conclusion | Legal writing |

Why atoms matter: an atom is the smallest unit the **METER** event can name. A crux logged as `crux_atom: SUBu` is searchable; a crux logged as "I did some clever algebra" is not.

---

## Molecules

> ![Visual molecules — atoms bonded into tactics](../diagrams/14-ps-atomic-design-molecules.png)

A **molecule** is a small bundle of atoms with its own trigger condition, its own characteristic shape, and a name worth remembering. Molecules are *tactics* — the mid-level abstraction in [problem-solving-three-levels](./problem-solving-three-levels.md).

| Molecule | Atomic composition | Trigger | Owner |
|---|---|---|---|
| **Symmetry** | DOTS + SUBu + PAIR + cyclic-Σ + 3-detection-Qs | object/expression has rotational, reflectional, cyclic, or pairing structure | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §1 |
| **Extreme** | well-ordering + max-derived + smallest-counter + geometric-extreme | finite set; "assume in order" produces free information | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §2 |
| **Pigeonhole** | PIG + recognize + decide-pigeons-and-holes + after-work | "show some two share…", "must exist…" + finite cases | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §3 |
| **Invariant** | PAR + DIG + coloring + monovariant + CON | repeated operation; "can we reach state X?" question | [universal-mathematical-tactics](./universal-mathematical-tactics.md) §4 |
| **Get-hands-dirty** | HD + 1S + small-case-table | first 5 minutes; no traction | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **Penultimate-step** | PEN + WT + backward-chain | the goal is precise; want to know "the last move" | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **Wishful-thinking** | WT + assume-true + see-what-fits | structure is dense; conjecture-from-pattern | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **Make-it-easier** | EZ + drop-constraint + lower-dimension + symmetrize | parameters are too many; reduce to base case | [zeitz-startup-strategies](./zeitz-startup-strategies.md) |
| **Anti-tactic scan** | ETA + TC + GA → if any fires: REC | puzzle / designed-to-confuse problem; ≤ 30 s budget | [anti-tactic-detection](./anti-tactic-detection.md) |
| **Linguistic-crux** | LP + detect-pivot + list-senses + check-primed + try-alternative | wordplay archetype (O); answer hinges on one word | [linguistic-crux](./linguistic-crux.md) |
| **Red-herring resistance** | RH + list-facts + classify load-bearing-vs-decorative + log | problem includes irrelevant precise numbers | [red-herring-resistance](./red-herring-resistance.md) |
| **Smallest-viable-start** (execution) | SV + 90s-timer + open-doc-paste-edit-one | execution-problem; first-action paralysis | [attention-framework](./attention-framework.md) |
| **Direct argument** | structural-direct-chain (no negation, no induction) | hypothesis → conclusion is one-step | [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) |
| **Contradiction** | assume-conclusion-fails + extreme + smallest-counter | conclusion is "no X exists" or "X is impossible" | [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) |
| **Induction** (standard / strong) | base-case + step + (strong: ∀k≤n hypothesis) | claim parameterized over N | [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) |

Each molecule passes the [single-responsibility test](https://en.wikipedia.org/wiki/Single_responsibility_principle): it has *one* trigger condition and *one* characteristic move-shape. The wiki resists adding a molecule that overlaps two existing molecules' triggers; *systematic-enumeration* was rejected on exactly this ground (it lives *inside* Invariant + Pigeonhole, not beside them; see [universal-mathematical-tactics](./universal-mathematical-tactics.md) §"Systematic enumeration").

---

## Organisms

An **organism** is a relatively complex section of the problem-solving system — a named pipeline that can be invoked as a unit and that has its own internal sequence of molecules and atoms.

| Organism | What it does | Composition (molecules + atoms it draws on) | Owner |
|---|---|---|---|
| **FRAME FORGE** | 8-step search-problem pipeline (Frame · Inventory · Represent · Probe · Generate · Evaluate · Formalize · Distill) | Wishful-thinking + Get-hands-dirty + REL + 4-tactic-molecules | [frame-forge](./frame-forge.md) |
| **Decision Kernel** | Constraint + tradeoff 7-question protocol | Extreme + Pre-mortem + reversibility-axis | [decision-kernel](./decision-kernel.md) |
| **Attention Framework** | Execution-problem fix: energy → first-action → start-timer | SV + 90s-timer + smallest-viable-start molecule | [attention-framework](./attention-framework.md) |
| **Anti-Tactic Scan** | 30-s gate between Classify and Route in PS-OS | ETA + TC + GA + REC | [anti-tactic-detection](./anti-tactic-detection.md) |
| **Crux-Recognition Gym** | Lamp/Scale/Sword drill on per-puzzle crux recognition in <60 s | DR + WG + PP + 17-archetype-recognition | [crux-recognition-gym](./crux-recognition-gym.md) |
| **Construct-Recognition Gym** | Sister 6-s gym on code-construct recognition | (parallel atoms, code-domain) | construct-recognition-gym |
| **Red Queen Skill Gym (RISE)** | General gym for Reflex · Intensity · Sparring · Evaluation | (drives any molecule into reflex via Lamp/Scale/Sword) | [red-queen-skill-gym](./red-queen-skill-gym.md) |
| **The Great Work** | 7-stage acquisition pipeline (Calcination → Coagulation) | All tiers — operates orthogonal to atomic design | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |
| **BRIDGE LOAD** | Analogy-construction protocol | Source-mapping + structural-similarity molecules | [bridge-load](./bridge-load.md) |
| **ORIENT** | Capture/scoping for unfamiliar environments | Objects + Roles + Indexes + Edges + Norms + Threads | [orient-method](./orient-method.md) |
| **ARC** | Wraps S·E·C·T + type-specific pipeline + AAR | Assess · Run · Close | [arc-framework](./arc-framework.md) |
| **SCREAM** | Listening organism (transcript / live audio) | Subjects + Continuity + Roles + Events + Assertions + Measures | [semantic-listening-system](./semantic-listening-system.md) |
| **METER event emitter** | Per-problem event-emission organism | yaml-schema + dashboard-feed | [meter-overview](./meter-overview.md) |

The organism tier is where the *single-responsibility principle* hardens. FRAME FORGE owns search-problems; decision-kernel owns tradeoffs; attention-framework owns execution. The PS-OS Routing Table's "Don't use" column is enforced exactly at this tier — running FRAME FORGE on a tradeoff is a tier violation.

---

## Templates

A **template** is a page-level skeleton with named slots — a layout that defines *which* organisms run *in what order* on *which slots of input*. The template is content-agnostic; a worked problem is what fills the slots.

| Template | Slots / sequence | Provenance | Owner |
|---|---|---|---|
| **PS-OS Operating Stack** | 1.Pause · 2.Classify · 2.5 Anti-tactic · 3.Route · 4.Solve (4a Startup · 4b Tactic · 4c Crux · 4d Argument) · 5.Record · 6.Distill | Neural OS canonical | [problem-solving-os](./problem-solving-os.md) |
| **Pólya 4-stage** | Understand · Plan · Carry-out · Look-back | Pólya 1945 | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **McKinsey 7-step** | Define · Disaggregate · Prioritize · Workplan · Analyze · Synthesize · Recommend | Consulting | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **Toyota Practical PS** | 7-step (Clarify · Break-down · Target · Root-cause · Countermeasure · Implement · Standardize) | TPS | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **DMAIC** | Define · Measure · Analyze · Improve · Control | Six Sigma | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **8D** | 8 disciplines | Ford | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **CRISP-DM** | Business-Understanding · Data-Understanding · Data-Prep · Modeling · Evaluation · Deployment | Data science | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **SOAP / ADPIE / OPQRST** | Clinical reasoning skeletons | Medicine | [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) |
| **METER event schema** | yaml fields (problem_id · classified_type · classification_latency_s · …) | Neural OS | [problem-solving-os](./problem-solving-os.md) §Measurement Contract |
| **Daily Rhythm** | Morning warm-up · Working block · End-of-session · Weekly review | Neural OS | [problem-solving-os](./problem-solving-os.md) §Daily Rhythm; neural-os-daily-loop |
| **Maturity-Progression Ladder** | Levels 0 Lost → 5 Expert | Dreyfus-derived | [problem-solving-maturity-levels](./problem-solving-maturity-levels.md) |
| **Lamp / Scale / Sword** | 3-phase gym progression template | Neural OS | [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) |

The 11 sibling templates (PS-OS · Pólya · McKinsey · Toyota · DMAIC · 8D · CRISP-DM · SOAP · ADPIE · OPQRST · SBAR-handoff) are shown by [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) to be **cosmetic variants of the same skeleton**. Atomic design names *why* they look identical: they are all templates over the same organism set.

---

## Pages

A **page** is a *worked instance* — a template populated with the real organisms, molecules, and atoms of a specific solve.

| Page (worked instance) | Template | Lead organism | Lead molecule | Crux atom |
|---|---|---|---|---|
| **Bellman-Ford / shortest-path search** | PS-OS Operating Stack | FRAME FORGE | (search-pipeline-distill) | REL |
| **Writing-avoidance / first-action** | PS-OS Operating Stack | Attention Framework | Smallest-viable-start | SV + 90s-timer |
| **IC vs EM career** | PS-OS Operating Stack | Decision Kernel | (7-question protocol) | reversibility-axis |
| **Study-time constraint** | PS-OS Operating Stack | Decision Kernel | (constraint-mapping) | pre-work-focus-block |
| **1926 Hungarian contest — n(n+1)(n+2)(n+3) not square** | PS-OS Operating Stack | FRAME FORGE | Get-hands-dirty → Symmetry | DOTS (via SUBu = n²+3n+1) |
| **de Bruijn rectangle (Zeitz 3.4.11)** | PS-OS Operating Stack | FRAME FORGE | Invariant + Coloring | parity-of-lattice-corner-count |
| **Affirmative Action (Zeitz 2.1.9)** | PS-OS Operating Stack | FRAME FORGE | Extreme | max-balanced-wires |
| **Four-bug rotational frame** | PS-OS Operating Stack | FRAME FORGE | Symmetry (strategic) | rotating-reference-frame |
| **x⁴+x³+x²+x+1=0** | PS-OS Operating Stack | FRAME FORGE | Symmetry (tool-crux) | SUBu |
| **Pólya's mouse (escape-via-wider-opening)** | Pólya 4-stage | (raw recognition) | (none — pure perception) | DR signal |
| **211-puzzle Livingstone-Thomson corpus** | PS-OS × Crux-Recognition Gym | Crux-Recognition Gym | Anti-tactic scan + Linguistic-crux + Red-herring resistance | per-puzzle |

The page tier is the *quality control* tier. Per Frost: "pages are essential for testing the effectiveness of the underlying design system." When a worked solve cannot be cleanly decomposed into one-template / one-organism / one-molecule / named-atoms, the bug is in the design system — usually a missing molecule (under-named tactic) or a leaking organism (pipeline doing two jobs).

---

## Routing rule — when to think at which tier

| Symptom | Think at tier |
|---|---|
| Need to log this solve in METER with a `crux_atom` field that another person could re-run | **Atom** |
| Asking "which tactic powers this?" or "what is the named move?" | **Molecule** |
| Asking "which pipeline applies to this problem-type?" | **Organism** |
| Asking "what is the overall sequence; what step am I on?" | **Template** |
| Asking "has anyone solved a problem like this; what did they do step-by-step?" | **Page** (worked instance) |
| Designing a *new* tactic that doesn't fit existing molecules | First check: does it really not fit, or is it a sub-tactic? If new molecule: define trigger + composition + name before adding |
| Designing a *new* pipeline | First check: does it overlap an existing organism's responsibility? If genuinely new: name it, register in glossary, define entry/exit |

The user's most common operational error is *tier-conflation*: treating a molecule as if it were an organism (running Pigeonhole as if it were a full pipeline), or treating a template as if it were a molecule (running the operating stack on a sub-step).

The *visual atoms* and *visual molecules* diagrams above are the antidote — once you can *see* the chemistry, you stop conflating the tiers.

---

## METER hooks per tier

Atomic design tightens the METER event schema. Each tier contributes one field-group:

```yaml
problem_id: <uuid>

# Atom-tier: which named primitives fired
atoms_used: [SUBu, DOTS, PEN]
crux_atom: SUBu

# Molecule-tier: which tactic powered the solve
molecule_lead: Symmetry        # or Pigeonhole, Extreme, Invariant, …
molecule_secondary: [Get-hands-dirty]

# Organism-tier: which pipeline was invoked
organism: FRAME FORGE          # or Decision-Kernel, Attention-Framework, Crux-Recognition-Gym, …

# Template-tier: which skeleton structured the solve
template: PS-OS Operating Stack    # or Polya-4-stage, DMAIC, …
template_step_at_crux: 4c-Crux

# Page-tier: the instance identifier and its lineage
page_id: <ulid>
page_template_match: true       # false ⇒ the template needs revision
```

This is a strict super-set of the existing schema at [problem-solving-os](./problem-solving-os.md) §Measurement Contract; the additions are `atoms_used`, `crux_atom`, `molecule_lead`, `molecule_secondary`, `organism`, `template_step_at_crux`, `page_template_match`. Old events remain valid; new events gain queryability per tier.

New dashboard metrics:

| Metric | Definition | Pass / floor |
|---|---|---|
| **Atom-vocabulary coverage** | % of solves where `crux_atom` resolves to a registered atom | Pass ≥80%, floor 50% |
| **Molecule-name accuracy** | % of solves where `molecule_lead` matches independent retrospective audit | Pass ≥80%, floor 60% |
| **Organism-fit rate** | % of solves where the chosen organism didn't need to be swapped mid-solve | Pass ≥75%, floor 50% (subset of existing first-tool-correct-rate) |
| **Template-match rate** | % of solves with `page_template_match: true` | Pass ≥90%, floor 70% |
| **Tier-conflation rate** | % of solves where the user logged a molecule as an organism (or vice-versa) | Pass <10%, floor 25% |

---

## Anti-patterns

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| **Atom-without-molecule** | Logging `crux_atom: SUBu` without naming the molecule (Symmetry) it served | Always log molecule-then-atom in the event |
| **Molecule-as-organism** | Running "Pigeonhole" as if it were a pipeline | Molecules don't take input; they're *moves inside* a pipeline. If you can't say which organism it lives in, you haven't routed |
| **Template-without-organism** | Following PS-OS Operating Stack steps without invoking any organism in step 3 → 4 | The template has slots; if a slot is empty, the solve is going to grind |
| **Page-without-template** | A worked solve with no clear underlying template; ad-hoc | Either retrofit a template post-hoc, or name a *new* template and register it |
| **Inventing parallel atoms** | Naming "balance-wire-maximization" as an atom when it's *Extreme molecule fired on a specific page* | Atoms are domain-irreducible; this one is a page-level instance, not an atom |
| **Skipping the atom layer** | Logging only template + organism, no molecule, no atom | Retrieval and transfer both fail — the atom layer is the indexing layer for METER |

---

## How this composes with existing principles

The five-tier spine slots cleanly into the wiki's existing structural rules:

| Existing principle | Atomic-design contribution |
|---|---|
| **Single-responsibility** (SRP, [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md)) | Each tier enforces SRP at its level — one molecule = one trigger; one organism = one problem-type |
| **Open-closed** (OCP) | New problem-solving moves enter as new atoms or new molecules; existing organisms and templates do not need to change |
| **Interface-segregation** (ISP) | Atoms are the smallest interface unit; an organism that requires *all* atoms is over-broad and likely two organisms |
| **Strategy / Composite / Adapter / Facade** patterns | Templates are *strategies*; organisms are *facades* over molecules; molecules are *composites* of atoms |
| **[Three levels — Strategy / Tactic / Tool](./problem-solving-three-levels.md)** (Zeitz) | Strategy ≈ Organism-selection; Tactic ≈ Molecule; Tool ≈ Atom. The 5-tier extends Zeitz upward (Template, Page) without collision |
| **[UMTF](./universal-mental-tagging-framework.md)** | Atomic-design tier is the *Pattern* tag's structural axis; orthogonal to UMTF's 7-tag taxonomy |
| **[remaps](./remaps.md) / [CLAMP](./clamp-render-lens.md)** | When a molecule needs a visual, REMAPS produces an atom-glyph; CLAMP renders the molecule's bonding picture |
| **[Memory Paradox](./memory-paradox.md)** | Take the tiers seriously enough to label every solve; hold loosely enough to refactor when the system creaks |

The page passes the Idea Validation checks: it improves separation of concerns, composes cleanly with NEDF/CAST/SPEAR/HEART/UMTF, adds retrieval clarity (you can grep `crux_atom`), extends without drift (it organizes existing pages without rewriting them), and reduces cognitive overhead by replacing scattered taxonomy with one spine.

---

## Visual — the five-tier ladder

> ![Atomic Design Ladder applied to Problem-Solving](../diagrams/14-ps-atomic-design-ladder.png)

The ladder reads bottom-up: each rung composes from the one below. The arrows on the side mark *traversal* — the painter's pitter-patter between abstract and concrete that Frost describes. A well-run solve traverses *all five* during step 4–6 of [problem-solving-os](./problem-solving-os.md): zoom in to pick the atom, zoom out to confirm it serves the molecule, zoom further out to confirm the organism fits, etc.

---

## Excalidraw libraries (drag-and-drop Lego pieces)

Three `.excalidrawlib` v2 files live under `diagrams/lib/`. Import them once into the Excalidraw Library panel (three-dot menu → **Open** → pick the file) and every atom / molecule / tier shell becomes a draggable preset on the side panel.

| Library file | Items | Use it when |
|---|---|---|
| [problem-solving-atoms.excalidrawlib](../diagrams/lib/problem-solving-atoms.excalidrawlib) | 32 atoms in 4 family colors (Math · Cognitive · Diagnostic · Communicative) | Sketching a new molecule, organism, or worked-page — drop the atom-cells in place rather than redrawing |
| [problem-solving-molecules.excalidrawlib](../diagrams/lib/problem-solving-molecules.excalidrawlib) | 6 hub-and-spoke tactics (Symmetry · Pigeonhole · Extreme · Invariant · Anti-Tactic Scan · Linguistic Crux) | Building an organism or page diagram — drop the whole tactic cluster as one unit |
| [problem-solving-tiers.excalidrawlib](../diagrams/lib/problem-solving-tiers.excalidrawlib) | 5 blank tier-shells (Atom · Molecule · Organism · Template · Page) with the canonical color per tier | Starting a new ladder, framework map, or page-decomposition — drag the right-tier shell and edit the label |

Generator: [`tools/excalidraw_libs/build_ps_libraries.py`](../tools/excalidraw_libs/build_ps_libraries.py). Re-run whenever the atom or molecule registry changes; the seed is deterministic so library item IDs stay stable and diffs are clean. Library colors match the diagram-guide palette so a library-drop drops into existing diagrams without restyling.

**Import workflow** (one-time per machine):
1. Open the Excalidraw canvas (the local one at `http://127.0.0.1:3000/`, or excalidraw.com).
2. Click the **Library** icon in the right toolbar.
3. Click the **three-dot menu** in the panel → **Open**.
4. Select all three `.excalidrawlib` files in turn. Each library appears as its own tab in the panel.
5. Drag any item onto the canvas. Bound text moves with the shape; bonds stay connected.

**Authoring rule**: when adding a new atom to the wiki registry ([problem-solving-atomic-design](./problem-solving-atomic-design.md) §Atoms), append it to the `ATOMS` table in the generator and re-run. Same for molecules — add to `MOLECULES`, re-run. The library is the canonical visual vocabulary; the table is its index.

## Calibration defaults

- Atom registry size: **8–12 per family**, **4 families** = 32–48 atoms. Larger means under-compressed; smaller means under-vocabularized.
- Molecule registry size: **10–18 molecules**. Larger means tactic-bloat; smaller means missing molecules.
- Organism registry size: **8–12 organisms** total. Larger means pipeline-overlap (run code-review of organism responsibilities); smaller likely means a molecule is masquerading as an organism.
- Template registry size: bounded by the 11 known sibling templates; new template requires a real architectural reason (e.g. a new domain like clinical reasoning).
- Page registry: unbounded; this is the worked-example library and it should grow.

---

## Mnemonic

A **chemistry-class blackboard** in [Velvet Aeon](./world-velvet-aeon.md) Mode-Environment register, pale-gold dawn light slanting through tall windows onto polished slate. A **STRONG** archetype woman (per [feedback-image-face-and-hair](./feedback-image-face-and-hair.md) — angular jaw, piercing gaze, milky-white skin, waist-length shining hair) stands at the board, chalk in hand. The board shows a **periodic-table grid** lit from above by a single warm lamp — yellow cells (math atoms), blue cells (cognitive atoms), purple cells (diagnostic atoms), green cells (communicative atoms). Below the grid, **three molecule diagrams**: two hydrogens bonded to an oxygen (Symmetry); a pigeon-hole sketch (Pigeonhole); a moebius-strip-like loop with arrows (Invariant). Below the molecules, **a beating organism** — a glowing heart-shaped diagram labeled *FRAME FORGE*. Below the organism, **a blueprint** of the [problem-solving-os](./problem-solving-os.md) Operating Stack — a tall thin scaffold with six rungs. At the very bottom of the board, **a single solved page** — the 1926 Hungarian contest proof, hand-written, with one move circled in red chalk: *u := n²+3n+1*. The woman points to the circled move with the chalk. The Velvet Aeon preserve here is **sacred memory** — the chemistry classroom from Frost's own anecdote (Mr Rae's class), restored as the wiki's atelier.

Sub-scene callout for the cognitive atom glyph: the chalk leaves a **two-letter symbol** on the board — *SU* with a small subscript *u* — and from that symbol a thin ribbon of chalk-dust forms the molecule, then the organism, then the template, then the page. The single chalk-stroke compresses the entire 5-tier ascent.

## Memory checksum

- **5** tiers (Atoms · Molecules · Organisms · Templates · Pages)
- **4** atom families (Math · Cognitive · Diagnostic · Communicative)
- **~30+** registered atoms · **~15** registered molecules · **~12** registered organisms · **~11** sibling templates
- **1** strict composition order (upward only)
- **5** new METER fields (atoms_used · crux_atom · molecule_lead · organism · template_step_at_crux)
- **5** new dashboard metrics (atom-coverage · molecule-accuracy · organism-fit · template-match · tier-conflation)
- **1** anti-pattern family (tier-conflation) with **6** named sub-instances
- **3** visuals (atoms periodic table · molecules bonding · 5-tier ladder)

If you can recite 5-4-30/15/12/11-1-5-5-1/6-3 from "problem-solving atomic design" within 60 seconds, the page is encoded.

---

## Related pages

- atomic-design — Brad Frost's canonical five-tier methodology; owner of the Atoms · Molecules · Organisms · Templates · Pages spine
- [memory-atomic-design](./memory-atomic-design.md) — sister application of the lens to the memory layer (37 atoms · 17 molecules · 12 organisms · 13 templates · 20+ worked palace and deck pages)
- [money-atomic-design](./money-atomic-design.md) — third sister application of the lens to the money layer (40 atoms · 20 molecules · 12 organisms · 13 templates · canonical nine money books anchoring the page tier)
- [problem-solving-os](./problem-solving-os.md) — the operating sequencer (a template); gains the new METER tier-fields
- [problem-solving-three-levels](./problem-solving-three-levels.md) — Strategy / Tactic / Tool, the Zeitz-axis that this page extends upward into Template + Page
- [crux-move](./crux-move.md) — the named breakthrough; flag at any tier
- [universal-mathematical-tactics](./universal-mathematical-tactics.md) — molecule registry for the math domain
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — 4 startup molecules
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — 4 argument molecules
- [frame-forge](./frame-forge.md) · [decision-kernel](./decision-kernel.md) · [attention-framework](./attention-framework.md) · [red-queen-skill-gym](./red-queen-skill-gym.md) · [crux-recognition-gym](./crux-recognition-gym.md) — primary organism registry
- [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) — template registry (11 sibling skeletons)
- [external-problem-solving-frameworks](./external-problem-solving-frameworks.md) — atom/molecule candidates from external traditions; gates the N1 delivery-layer atoms
- [anti-tactic-detection](./anti-tactic-detection.md) · [red-herring-resistance](./red-herring-resistance.md) · [linguistic-crux](./linguistic-crux.md) · inclusion-exclusion-tool · information-theoretic-minimum · [cultural-string-sequences](./cultural-string-sequences.md) — diagnostic and tool atom owners
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) — SRP/OCP/ISP/DIP this page passes
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) — orthogonal Pattern-tag axis
- [meter-overview](./meter-overview.md) — receiver of the new field-group
- [composability-index](./composability-index.md) — the wiki-wide composability dashboard this lens feeds into

---

## U — See (CAST)

1. Chemistry-class blackboard with a periodic-table grid of colored atom-cells, three molecule diagrams below, a beating organism, a blueprint template, and one solved page at the bottom — chalk-line ascends through all five tiers
2. Edges: atom → bonds-to → molecule; molecule → fires-inside → organism; organism → slots-into → template; template → realizes-as → page

## D — Name (NEDF)

1. Five tiers = Atoms · Molecules · Organisms · Templates · Pages
2. Atoms = irreducible primitives (4 families, ~30+ registered)
3. Distinguisher: a *classification lens*, not a new tool — it organizes existing PS inventory
4. Failure mode: tier-conflation (running a molecule as an organism, or a template as a molecule)

## F — Do (SPEAR)

1. New problem-solving asset → ask "what tier?" before adding it
2. Logging a solve in METER → fill atoms_used + crux_atom + molecule_lead + organism + template_step_at_crux
3. Stuck on a solve → traverse the ladder up *and* down; the missing piece is at a tier you haven't named
4. Designing new content → enforce single-responsibility *at the right tier*

## B — Watch (HEART)

1. Atom-without-molecule logging
2. Molecule-as-organism conflation
3. Template-without-organism (empty slot in step 3–4 of PS-OS)
4. Page-without-template (ad-hoc solve with no skeleton)
5. Atom registry sprawl (>50) or molecule registry sprawl (>20)

## L — Predict (ORACLE)

1. New problem in a familiar archetype → predict (organism, molecule, atom) triple before solving
2. METER event missing an atom → predict the solve will not transfer to the next instance
3. Worked solve that can't be tier-decomposed → predict a missing molecule definition in the wiki

## R — Act (GRACE)

1. Encounter a solve → label it by tier as you go (atom → molecule → organism → template → page)
2. New tactic appears → register at molecule tier with trigger + composition + name before deploying
3. New pipeline appears → register at organism tier with responsibility-boundary before deploying; verify no overlap with existing organisms
