---
palace: meta-knowledge
level: 5
domain: 10
room: 6
wiki_source: wiki/problem-solving/external-problem-solving-frameworks.md
---

# External Problem-Solving Frameworks — Compile, Map, and Fuse

**Summary**: Comprehensive catalog of externally-sourced problem-solving frameworks gathered in three passes — (1) ten user-provided clippings, (2) Round 1 web research across six traditions (consulting, engineering quality, design thinking, math/science, cognitive/decision, military/philosophy/Eastern/LLM), (3) Round 2 gap-fill across three more (systems thinking + soft OR + argument mapping; game theory + scenarios + risk; productivity + behavior change + org learning). Round 3 (software/agile/data-science, education/pedagogy, religious/spiritual discernment, qualitative research, intelligence-analysis) was attempted but hit a rate limit before completing; those clusters are flagged as a known gap below, not silently absorbed from training data. The fused catalog (~600 deduplicated named items) is then **mapped slot-by-slot onto the existing Neural OS stack** ([problem-solving-os](./problem-solving-os.md), [problem-type-classifier](./problem-type-classifier.md), [frame-forge](./frame-forge.md), [decision-kernel](./decision-kernel.md)) so every external technique routes to where it would actually be used, rather than being adopted as a parallel universal framework.

**Sources**:

*User-provided clippings (Round 0):*
- `Clippings/How to master the seven-step problem-solving process.md` (McKinsey Podcast, Conn + Sarrazin, 2019)
- `Clippings/8-Step Framework to Problem-Solving from McKinsey.md` (Stareva, summarizing *The McKinsey Mind*)
- `Clippings/How Top-Tier Consultants at McKinsey, Bain, and BCG Really Solve Problems.md` (Millerd / StrategyU, 2024)
- `Clippings/5 Problem-Solving Frameworks for Smarter Decision-Making.md` (KnowledgeCity, 2025)
- `Clippings/7 Effective Problem-Solving Techniques for Entrepreneurs (2025).md` (Shopify, 2025)
- `Clippings/Problem Solving Framework.md` (Kaplinsky student worksheet v7.3, 2016)
- `Clippings/Problem Solving  Universal Framework.md` (Skills Builder UF 2.0 — cookie-walled, only licence captured)
- `Clippings/I Compiled Every Problem-Solving Framework I Know- What's Your Favorite.md` (njwestburg, OpenAI community, 151 LLM-prompting patterns)
- `Clippings/Learning About Problem-Solving Frameworks.md` (Katy M, 3-insight essay)
- `Clippings/Wishful Thinking.md` (AoPS olympiad blog — misfiled; worked combinatorics/geometry problems, not a framework)

*Round 1 web research (6 parallel agents, 2026-05-17):*
- Consulting & business strategy (~58 items)
- Engineering quality & operations (~100 items)
- Design thinking, innovation, creativity (~80 items)
- Mathematical, scientific, computational (~95 items)
- Cognitive psychology & decision science (~120 items)
- Coaching, philosophy, military, cross-cultural, LLM-era (~78 items)

*Round 2 gap-fill (3 parallel agents, 2026-05-17):*
- Systems thinking, cybernetics, soft OR, argument mapping (~95 items)
- Game theory, scenario planning, risk management (~95 items)
- Productivity, behavior change, org learning (~115 items)

*Round 3 web research (2 parallel agents, re-run after rate-limit reset, 2026-05-17):*
- Software engineering / agile prioritization / data-science process + Education, pedagogy, learning science (~95 items)
- Religious / spiritual / wisdom-tradition discernment + Anthropological / qualitative-research + Final sweep including CIA SATs, legal IRAC, medical SOAP, journalism 5W1H, chess Kotov, Go heuristics, Alexander Pattern Language (~75 items)
- **Convergence achieved**: R3-2 explicitly flagged ">70% of search results already in our list" — stability reached.

**Last updated**: 2026-05-17

---

## Why this page exists

The user added ten problem-solving clippings to `Clippings/` and asked for a "new universal framework," then asked to "fetch all topics from the internet around problem solving, fuse them until [we] do not reach stability." Neural OS already has a universal framework — the [problem-solving-os](./problem-solving-os.md) sequences [S·E·C·T classification](./problem-type-classifier.md), [FRAME FORGE](./frame-forge.md), [attention-framework](./attention-framework.md), [decision-kernel](./decision-kernel.md), the [six-level maturity ladder](./problem-solving-maturity-levels.md), and the [recognition drill](./problem-type-recognition-drill-ladder.md) into a single METER-measured stack. Per CLAUDE.md §Idea validation + Consistency rule #2 (no parallel definitions on registered terms), building a second universal framework alongside it would cause framework drift, not progress.

This page is the right home: a **compile-and-map** that catalogs all the external work, maps every technique to the Neural OS slot it already occupies, and flags what is genuinely novel so it can be promoted into the existing pages by surgical edit (not by parallel structure).

---

## Stability analysis

Iteration was run with the convergence rule "until we do not reach stability." After three rounds:

| Round | New named items added (approx) | New items not already covered | Saturation indicator |
|---|---|---|---|
| R0 (clippings) | 30 | 30 | 100% new (baseline) |
| R1 (6 web agents) | 530 | ~500 | High novelty; many cross-tradition overlaps but most named items new |
| R2 (3 gap-fill web agents) | 305 | ~250 | Still meaningfully novel; systems thinking, game theory, risk, behavior change were genuine blind spots |
| R3 (2 sweep web agents, re-run) | 170 | ~100 | **R3-2 explicitly flagged convergence**: ">70% of search results already in our list" — stability signal |

**Operational stability call**: Reached after Round 3. Total raw catalog: ~1,035 named items deduplicating to ~700 unique. R3 added ~100 net new (the rest being items R1+R2 had already covered, found from different sources). R3-2's explicit convergence flag is the formal saturation signal: when an independent agent's web search returns >70% items already on the master list, the corpus has reached the point where further rounds would yield specialty refinements (e.g. more variants of Quaker discernment by sect, more obscure rabbinic hermeneutic schools, micro-extensions of MAUT) rather than new *kinds* of problem-solving framework.

**So: stability confirmed at the level of "named framework types across major traditions."** Future iteration would compound diminishing returns; the catalog is operationally complete for the purpose of mapping the external landscape onto Neural OS slots.

---

## The catalog of clipping sources (Round 0)

| # | Source | Core proposal | Type |
|---|---|---|---|
| 1 | McKinsey 7-step (Podcast) | Define · Disaggregate (logic tree, MECE) · Prioritize · Workplan · Analyze · Synthesize · Recommend | Linear pipeline |
| 2 | McKinsey *Mind* 8-step (Stareva) | Hypothesis-first · Intuition+facts · 80/20 research · Story behind data · **Prewire** · Start with conclusion · Hit singles · Respect-time | Delivery layer |
| 3 | StrategyU (Millerd) | The linear 7-step is a *facade* — real work oscillates between top-down (structuring, storylining) and bottom-up (digging, synthesis) modes | Process critique |
| 4 | KnowledgeCity 5 | SCQA · First Principles · Eisenhower Matrix · 5 Whys · TRIZ | Move catalog |
| 5 | Shopify 7 | RCA · Six Hats · Means-End · 5 Whys · SWOT · Cost-Benefit · Fishbone | Move catalog |
| 6 | Kaplinsky | 6-row student worksheet (problem / guesses / knowns / needed / conclusion / work) | Capture form |
| 7 | Skills Builder UF 2.0 | (Inaccessible — cookie wall) | — |
| 8 | OpenAI 151-list | LLM-prompting patterns bucketed in 8 categories — *not* human PS frameworks | LLM prompt catalog |
| 9 | Katy M | Pause · Redefine worry as problem · Deadlines for reflection not despair | Insight essay |
| 10 | AoPS *Wishful Thinking* | Misfiled — actually olympiad worked problems. "Wishful thinking" *is* a real heuristic (assume desired conclusion, work backward). | Worked examples |

---

## The fused master catalog (R0 + R1 + R2)

Organized by **function** (what the technique does), not by source tradition. Each entry: `**Name** (Originator, year if relevant) — 1-line description — Neural OS slot it fits into`. Items appearing across multiple traditions are merged with the canonical origin. Sources are cited inline; full URLs are in the per-round agent outputs (preserved in the wiki log entry for this page).

### Round-3 highlights — items the final sweep surfaced that strengthen the catalog

Most R3 items mapped into existing function bands (folded in below). A few stand out as either previously-missed-but-strong, or as triangulating existing extension candidates from new traditions:

- **ACH — Analysis of Competing Hypotheses** (Heuer, CIA) — matrix-based discipline scoring evidence × hypothesis for *disconfirmation* (not support); the gold-standard intelligence-analysis tool, structurally a formal version of Chamberlin/Platt multiple-working-hypotheses — strong N-list addition (now N36)
- **Cognitive Load Theory** (Sweller) — intrinsic / extraneous / germane load + worked-example effect + expertise-reversal effect + split-attention effect — major load-bearing theory not yet integrated into [representation-rules](./representation-rules.md) / [bridge-load](./bridge-load.md) (N29)
- **Learning Scientists 6 Strategies** — spaced practice + retrieval practice + interleaving + elaboration + dual coding + concrete examples — overlaps heavily with Neural OS's encoder spine and Red Queen Gym; perfect comparison-page candidate, not extension (clean validation that Neural OS is rediscovering canonical learning-science findings) (N30)
- **Threshold Concepts** (Meyer & Land) — troublesome / transformative / irreversible / integrative / bounded — gateway concepts that change identity; relevant to curriculum design and to [problem-solving-maturity-levels](./problem-solving-maturity-levels.md) (N31)
- **Backward Design / UbD** (Wiggins & McTighe) — Identify desired results → determine acceptable evidence → plan learning experiences — strong curriculum-design pattern for the Neural OS book / academy project (N32)
- **Domain-Driven Design + Event Storming** (Evans, Brandolini) — ubiquitous language + bounded contexts + context mapping — software-world analog of [BRIDGE LOAD](./bridge-load.md)'s "build a shared analogy" move (N33)
- **Architecture Decision Records (Nygard)** — Title / Status / Context / Decision / Consequences — single-decision-record format compatible with [decision-kernel](./decision-kernel.md) decision-record template (N34)
- **Continuous Discovery + Opportunity Solution Tree** (Torres) — weekly customer interviews by a Product Trio; tree links Outcome → Opportunities → Solutions → Experiments — pairs with [frame-forge](./frame-forge.md) step 3 + [problem-solving-os](./problem-solving-os.md) daily rhythm (N35)
- **IRAC / CREAC** (legal reasoning) — Issue / Rule / Application / Conclusion (with variants leading with Conclusion) — argument-formalization template for [frame-forge](./frame-forge.md) step 7 when the problem is argument-shaped (N37)
- **SOAP + ADPIE + OPQRST** (clinical/nursing) — Subjective/Objective/Assessment/Plan; Assess/Diagnose/Plan/Implement/Evaluate; structured patient-encounter formats — record templates for [problem-solving-os](./problem-solving-os.md) step 5 (N38)
- **Christopher Alexander Pattern Language** — 253 nested patterns (Towns → Buildings → Construction) each as context-problem-forces-solution; aims at "Quality Without a Name" (QWAN) — structural ancestor of glyph-grammar-pattern at a higher abstraction level; deserves explicit lineage citation (N39)
- **Grounded Theory** (Glaser, Strauss, Charmaz) — open/axial/selective coding + constant comparison + theoretical sampling + theoretical saturation + memoing — qualitative research method directly applicable to the wiki's own ingest workflow (N40)
- **Hermeneutic Circle / Fusion of Horizons** (Gadamer) — part↔whole interpretation; researcher's pre-understanding is a resource, not obstacle — relates directly to the wiki's Bible-study layer (bible-historicist-hermeneutic) and to CLAUDE.md §Idea validation (N41)
- **Prudence as decision art** (Aquinas) — counsel (inquire means) → judgment (choose means) → command (apply) — decision-making lens for the moral/ethical decisions [decision-kernel](./decision-kernel.md) doesn't currently address (N42)
- **Wesleyan Quadrilateral** — Scripture / Tradition / Reason / Experience — relates directly to the wiki's Bible-study layer; potential cross-link target for bible-davidson-hermeneutical-decalogue (N43)
- **Four Noble Truths as diagnostic-therapeutic template** — dukkha (problem) → samudaya (cause) → nirodha (cessation) → magga (path) — universal problem-solving structure inside Buddhism worth registering as a pattern (N44)
- **PEACE model** (UK police interviewing) — Preparation / Engage / Account / Closure / Evaluation — non-coercive structured interview; opposite-of-pattern to the controversial Reid Technique; relevant if the wiki ever extends into the [semantic-listening-system](./semantic-listening-system.md) family for interview contexts (N45)

These additions bring the surgical-extension queue from 28 to **45 candidates**. The full updated N-list is in the **"Surgical extensions worth queueing"** table below.

---

### Function 1 — Capture & framing the problem

Determining what the problem actually is, with enough precision to act on.

- **Problem statement (concise, verb-precise)** (McKinsey) — Debate "what, specifically, are we trying to uncover" in the first meeting — [problem-solving-os](./problem-solving-os.md) step 1; [frame-forge](./frame-forge.md) step 1
- **SCQA / SCQ / SCR** (Minto, McKinsey) — Situation · Complication · Question · Answer; "why we are here" — [frame-forge](./frame-forge.md) step 1
- **Issue tree / Hypothesis tree** (McKinsey) — Disaggregated open questions / candidate answers — [frame-forge](./frame-forge.md) step 3
- **MECE** (Minto) — Mutually Exclusive, Collectively Exhaustive — decomposition rule on issue trees — [frame-forge](./frame-forge.md) step 3
- **Logic tree / Profit tree** (McKinsey) — Standard disaggregation pattern — [frame-forge](./frame-forge.md) step 3
- **CATWOE** (Checkland) — Customers · Actors · Transformation · Weltanschauung · Owner · Environment — SSM root-definition checklist — [frame-forge](./frame-forge.md) step 1 + step 3
- **Rich Pictures** (Checkland SSM) — Cartoon-style sketches capturing structure/process/climate/conflicts — [frame-forge](./frame-forge.md) step 3 (representation move)
- **Root Definitions** (Checkland SSM) — "A system to do X by Y to achieve Z" — [frame-forge](./frame-forge.md) step 1
- **CSH 12 boundary questions** (Ulrich) — "Is" and "ought" boundary critique for stakeholder/value framing — [frame-forge](./frame-forge.md) step 1
- **Cognitive Mapping** (Eden, SODA) — Node-link maps of beliefs / means-ends chains — [frame-forge](./frame-forge.md) step 3
- **Wicked Problems** (Rittel & Webber 1973) — 10 properties of social problems with no stopping rule / no true-false — recognition that [S·E·C·T](./problem-type-classifier.md) is insufficient at societal scale; novel for our wiki
- **Tame vs Wicked** (Rittel) — Distinction; wicked problems require IBIS/dialogue rather than analysis — extension candidate
- **Cynefin** (Snowden 1999) — Clear / Complicated / Complex / Chaotic / Confused; each domain demands different response (sense-categorize-respond vs probe-sense-respond vs act-sense-respond) — **extension candidate** for [problem-type-classifier](./problem-type-classifier.md) (sister axis to S·E·C·T)
- **Mess** (Ackoff) — Interacting system of problems that resist clean decomposition — concept worth registering
- **Type III error** (Ackoff/Mitroff) — Precise answer to the wrong question — [problem-solving-os](./problem-solving-os.md) step 1 failure mode
- **5W1H** (Journalism) — Who/What/When/Where/Why/How — [frame-forge](./frame-forge.md) step 1 checklist
- **Redefine worry as problem** (Katy M; D'Zurilla & Nezu PST) — Pre-classifier hygiene — [problem-solving-os](./problem-solving-os.md) step 1
- **Pause before solving** (Katy M) — 60-second budget on capture — [problem-solving-os](./problem-solving-os.md) step 1
- **Drucker's 5 questions** — Mission? Customer? Customer value? Results? Plan? — [frame-forge](./frame-forge.md) step 1 (org context)
- **Marketing Myopia** (Levitt) — Define business by customer need, not product — [frame-forge](./frame-forge.md) step 1 reframe
- **Rectification of Names / zhengming** (Confucius) — Make names match realities before acting — [frame-forge](./frame-forge.md) step 1 (philosophical anchor)
- **Beginner's Mind / shoshin** (Suzuki) — Approach the problem as if for the first time — pre-step-1 stance
- **Bracketing / epoché** (Husserl) — Suspend presuppositions to inspect appearances — [frame-forge](./frame-forge.md) step 1
- **Kaplinsky 6-row worksheet** — Problem / guesses / knowns / needed / conclusion / work — capture form for [level 0-1 learners](./problem-solving-maturity-levels.md)
- **Empathy Map** (says/thinks/does/feels) — User-research synthesis — [frame-forge](./frame-forge.md) step 2 (Inventory)
- **Persona development** — Archetype profile for design framing — [frame-forge](./frame-forge.md) step 1
- **Jobs-to-be-Done** (Christensen / Ulwick) — Frame by progress customer is hiring product for — [frame-forge](./frame-forge.md) step 1 reframe
- **HMW (How Might We)** (Basadur → P&G → IDEO) — Convert insight to opportunity question — [frame-forge](./frame-forge.md) step 1
- **POV statement** ("[user] needs to [verb] because [insight]" — d.school) — [frame-forge](./frame-forge.md) step 1
- **Genchi Genbutsu** (Toyota) — "Go and see for yourself" before diagnosing — [problem-solving-os](./problem-solving-os.md) step 1 + capture discipline
- **DILO (Day-in-the-Life-Of)** — Time-stamped observation to split value-add from waste — [frame-forge](./frame-forge.md) step 4 (Probe)
- **STEEP / PESTLE / PESTEL** — Macro-environment scanning — [frame-forge](./frame-forge.md) step 2 (Inventory, contextual)
- **CLA (Causal Layered Analysis)** (Inayatullah) — Litany / system / worldview / myth-metaphor layers — **extension candidate** (depth axis on framing)
- **STICC briefing** (Weick → Klein) — Situation/Task/Intent/Concerns/Calibrate — [frame-forge](./frame-forge.md) step 1 (handoff form)
- **METT-TC** (US Army) — Mission/Enemy/Terrain/Troops/Time/Civil — [frame-forge](./frame-forge.md) step 2 checklist
- **SMEAC five-paragraph order** — Situation/Mission/Execution/Admin&Logistics/Command&Signal — [problem-solving-os](./problem-solving-os.md) step 4 (handoff)

### Function 2 — Classification & routing

Deciding *what kind of problem* this is so the right tool can be selected.

- **[S·E·C·T](./problem-type-classifier.md)** (Neural OS) — Search / Execution / Constraint / Tradeoff — owner of this slot
- **Cynefin** (Snowden) — Orthogonal axis: Clear / Complicated / Complex / Chaotic — **extension candidate**; pairs with S·E·C·T to disambiguate "complex" tradeoffs from analyzable ones
- **Tame vs Wicked** (Rittel) — Whether the problem can be cleanly bounded at all — extension candidate
- **Type III error filter** (Ackoff/Mitroff) — "Am I solving the wrong problem?" before classification
- **Stages of Change / Transtheoretical** (Prochaska & DiClemente) — Precontemplation→Contemplation→Preparation→Action→Maintenance — sub-classifier for execution problems where the user is the obstacle
- **Strategy Palette** (BCG / Reeves) — Classical / Adaptive / Visionary / Shaping / Renewal — environment-style classifier for strategy problems
- **Dual-process classifier** (Kahneman) — System 1 (intuitive) vs System 2 (deliberate); which mode does the problem call for? — meta-classifier inside [PULSE](./pulse-overview.md)
- **Decision Type (Decision Kernel)** — Reversible / Irreversible — already covered in [decision-kernel](./decision-kernel.md)

### Function 3 — Decomposition & analysis

Breaking the problem apart to make it tractable.

- **Logic tree / Issue tree / Hypothesis tree** (McKinsey) — Tree decomposition — [frame-forge](./frame-forge.md) step 3
- **MECE decomposition rule** (Minto/McKinsey) — No overlaps / no gaps — [frame-forge](./frame-forge.md) step 3 quality test
- **Profit tree** (McKinsey canonical example) — Revenue · Cost · Asset — [frame-forge](./frame-forge.md) step 3 template
- **5 Whys** (Toyota / Ohno) — Iterative root-cause regression along one chain — [frame-forge](./frame-forge.md) step 4 (Probe)
- **Fishbone / Ishikawa diagram** — 6Ms cause categorization — [frame-forge](./frame-forge.md) step 3 (representation move)
- **Apollo RCA** (Gano) — Causal-tree from cause-and-effect principle pairs — [frame-forge](./frame-forge.md) steps 3+4
- **Kepner-Tregoe Problem Analysis** — Is/Is-not analysis across What/Where/When/Extent — [frame-forge](./frame-forge.md) steps 1+3
- **Pareto Principle / 80-20** (Juran) — Small number of causes drive most defects; chart and attack first — [frame-forge](./frame-forge.md) step 6 evaluation heuristic
- **FMEA** — Severity × Occurrence × Detection (RPN) — [frame-forge](./frame-forge.md) step 4 + [ORACLE](./oracle-overview.md) anomaly mode
- **FTA (Fault Tree Analysis)** — Top-down Boolean decomposition of failure events — [frame-forge](./frame-forge.md) step 3
- **HAZOP** — Guideword-driven node-by-node hazard analysis — [frame-forge](./frame-forge.md) step 4 (systematic probe)
- **LOPA (Layer of Protection Analysis)** — Count independent protection layers — [frame-forge](./frame-forge.md) step 6 (evaluation)
- **Bowtie analysis** — Threats → top event → consequences with barriers — [frame-forge](./frame-forge.md) step 3
- **STAMP / STPA / CAST** (Leveson) — Systems-theoretic accident analysis as control-loop failures — **extension candidate** for system-level RCA (richer than 5 Whys)
- **FRAM** (Hollnagel) — Functional resonance analysis — extension candidate
- **AcciMap** (Rasmussen) — Socio-technical accident causation across levels — extension candidate
- **Swiss Cheese Model** (Reason) — Aligned holes across defense layers — explanatory frame for [frame-forge](./frame-forge.md) step 4
- **Active vs Latent failures** (Reason) — Sharp-end errors vs system conditions — failure-mode lens
- **Means-End Analysis** (Newell & Simon, GPS) — Pick operator reducing largest goal-state difference — [frame-forge](./frame-forge.md) step 5 (Generate Moves)
- **Decomposition / Recombination** (Polya) — [frame-forge](./frame-forge.md) step 3
- **Functional Decomposition** — Split function into sub-functions — [frame-forge](./frame-forge.md) step 3
- **Drake Equation pattern** — Multiplicative factorization of unknown — [frame-forge](./frame-forge.md) step 3 template
- **Fermi estimation** — Chain order-of-magnitude estimates — [frame-forge](./frame-forge.md) step 4
- **Value Stream Mapping (VSM)** — End-to-end material + information flow — [frame-forge](./frame-forge.md) step 3
- **Service Blueprint** — Journey map + line of visibility + backstage — [frame-forge](./frame-forge.md) step 3
- **Customer Journey Map** — Time-ordered touchpoints + emotions — [frame-forge](./frame-forge.md) step 3
- **System Dynamics CLD / SFD** (Forrester) — Causal Loop / Stock-and-Flow diagrams — **extension candidate** (system-level decomposition not yet in our stack)
- **System Archetypes** (Senge/Meadows/Kim) — Limits to Growth, Shifting the Burden, Fixes that Fail, Tragedy of the Commons, Drifting Goals, Escalation, Success to the Successful, Growth and Underinvestment, Accidental Adversaries — **strong extension candidate** for pattern library
- **12 Leverage Points** (Meadows) — Ranked intervention points from parameters (weak) to paradigm (strong) — extension candidate
- **Functional analysis (ABC)** — Antecedent / Behavior / Consequence — [frame-forge](./frame-forge.md) step 3 for behavioral problems
- **SCAMPER** (Eberle) — Substitute/Combine/Adapt/Modify/Put to other use/Eliminate/Reverse — [frame-forge](./frame-forge.md) step 5 (Generate Moves)
- **Morphological analysis** (Zwicky) — Parameters × values matrix; combine via cross-consistency — [frame-forge](./frame-forge.md) step 3 (representation)
- **Mind Mapping** (Buzan) — Radial single-parent tree — [frame-forge](./frame-forge.md) step 3
- **Concept Mapping** (Novak) — Labeled-relation graph with multiple parents — [frame-forge](./frame-forge.md) step 3
- **Stakeholder Mapping** — Power/interest grid — [frame-forge](./frame-forge.md) step 1+2 (context)
- **Force Field Analysis** (Lewin) — Driving vs restraining forces — [decision-kernel](./decision-kernel.md) question 4
- **SWOT** — Strengths/Weaknesses/Opportunities/Threats — [decision-kernel](./decision-kernel.md) questions 4+6 (capture template)
- **SWOT-TOWS Matrix** — Pair SWOT cells to generate strategies — [decision-kernel](./decision-kernel.md) extension
- **Porter's 5 Forces** — Industry structure (entrants, suppliers, buyers, substitutes, rivalry) — [frame-forge](./frame-forge.md) step 2 (Inventory, industry context)
- **Porter's Value Chain** — Primary + support activities — [frame-forge](./frame-forge.md) step 3 (decomposition template)
- **Business Model Canvas** (Osterwalder) — 9-block business model — [frame-forge](./frame-forge.md) step 3
- **Value Proposition Canvas** (Osterwalder) — Customer Profile × Value Map — [frame-forge](./frame-forge.md) step 3
- **Wardley Mapping** — Value-chain components × evolution axis — [frame-forge](./frame-forge.md) step 3 (situational awareness)

### Function 4 — Hypothesis & probe

Generating and testing candidate explanations before committing.

- **Hypothesis-driven approach** (McKinsey) — Start with candidate answer, design analyses to falsify — [frame-forge](./frame-forge.md) step 5
- **Day-One Answer / One-Day Answer** (McKinsey) — Articulate best-current hypothesis on day one — [problem-solving-os](./problem-solving-os.md) step 1 + [frame-forge](./frame-forge.md) step 5
- **Hypothetico-deductive method** — Form falsifiable H, deduce predictions, test — [frame-forge](./frame-forge.md) steps 4+5
- **Strong inference** (Platt 1964) — Enumerate alternative Hs, design crucial experiment — [frame-forge](./frame-forge.md) step 5
- **Multiple Working Hypotheses** (Chamberlin 1897) — Hold competing Hs in parallel; avoid ego-attachment — [frame-forge](./frame-forge.md) step 5
- **Conjectures-and-refutations** (Popper) — Bold conjecture + severe falsifying test — [frame-forge](./frame-forge.md) steps 5+6
- **Inference to the Best Explanation** (Lipton, Harman) — Generate explanations, infer the loveliest/likeliest — [frame-forge](./frame-forge.md) step 6
- **Peircean abduction** — Surprising C, hypothesize A would predict C, suspect A — [frame-forge](./frame-forge.md) step 5
- **Crucial experiment** (Bacon → Platt) — Test whose outcomes distinguish competing Hs — [frame-forge](./frame-forge.md) step 4
- **Bayesian updating** — Posterior = (likelihood × prior) / evidence — [frame-forge](./frame-forge.md) steps 4+6 + [ORACLE](./oracle-overview.md)
- **NHST (Null Hypothesis Significance Testing)** — H₀/H₁, p-value, reject/fail-to-reject — [frame-forge](./frame-forge.md) step 6 (formalize)
- **Probe** (Cynefin complex-domain action) — Safe-to-fail experiments before knowing the answer — [frame-forge](./frame-forge.md) step 4
- **A/B testing** — Randomized comparison — [frame-forge](./frame-forge.md) step 4
- **RAT (Riskiest Assumption Test)** — Test the highest-risk belief before building an MVP — [frame-forge](./frame-forge.md) step 4
- **Assumption Mapping** — 2×2 importance × uncertainty — [frame-forge](./frame-forge.md) step 6
- **First Principles thinking** (Aristotle → Musk) — Decompose to fundamental truths, rebuild without analogy — [frame-forge](./frame-forge.md) step 4
- **5 Whys** (Toyota) — Cause-chain regression — [frame-forge](./frame-forge.md) step 4
- **Pre-mortem** (Klein) — "Assume project has failed; brainstorm why" — [ORACLE](./oracle-overview.md) anomaly mode + [problem-solving-os](./problem-solving-os.md) novel: **extension candidate** (formally adopt as pre-execution step)
- **Red Team** — Adversarial cell attacks the plan — [frame-forge](./frame-forge.md) step 6 + extension candidate
- **Pareto / 80-20 research** (McKinsey) — Quick wins first — [frame-forge](./frame-forge.md) step 6
- **Counterargument generation** — [frame-forge](./frame-forge.md) step 5 ("assume the opposite")
- **Inversion** (Munger/Jacobi) — "What would guarantee failure?" as design heuristic — [frame-forge](./frame-forge.md) step 5
- **Steelmanning** — Strengthen opponent's argument before rebuttal — [frame-forge](./frame-forge.md) step 5
- **Wishful thinking** (Polya / SICP) — Assume the desired conclusion holds; work backward — [frame-forge](./frame-forge.md) step 5
- **Work Backward** (Polya) — Start from goal, regress to current state — [frame-forge](./frame-forge.md) step 5
- **Special cases / Small cases** (Polya, olympiad) — Solve concrete before general — [frame-forge](./frame-forge.md) step 4
- **Extremal Principle** (olympiad) — Consider largest/smallest/extreme element — [frame-forge](./frame-forge.md) step 4
- **Pigeonhole Principle** — n+1 in n holes → some has ≥2 — [frame-forge](./frame-forge.md) step 4 (logical move)
- **Generalize** (Polya) — Embed in richer problem with more structure — [frame-forge](./frame-forge.md) step 5
- **Analogy / Bridge** (Polya) — Find an isomorphic solved problem — [BRIDGE LOAD](./bridge-load.md) + [frame-forge](./frame-forge.md) step 5
- **Auxiliary problem** (Polya) — Introduce helper construction — [frame-forge](./frame-forge.md) step 5
- **Draw a Figure** (Polya) — Externalize structure spatially — [frame-forge](./frame-forge.md) step 3
- **Look for a Pattern** (Polya) — Tabulate small cases, conjecture rule — [frame-forge](./frame-forge.md) step 4
- **Guess and Check** (Polya) — Trial value + verify — [frame-forge](./frame-forge.md) step 4
- **Make an Orderly List** (Polya) — Systematic enumeration — [frame-forge](./frame-forge.md) step 4
- **Solve a Simpler Problem** (Polya) — Drop constraint, lower dimension — [frame-forge](./frame-forge.md) step 5
- **Mental Simulation** (Klein) — Run candidate course of action forward — [frame-forge](./frame-forge.md) step 6
- **Reference Class Forecasting** (Kahneman/Lovallo) — Outside view via comparable prior cases — [ORACLE](./oracle-overview.md) + [decision-kernel](./decision-kernel.md) question 6

### Function 5 — Divergence & ideation

Generating candidate solutions / moves before evaluation.

- **Brainstorming** (Osborn) — Classic divergent rules — [frame-forge](./frame-forge.md) step 5
- **IDEO 7 brainstorm rules** — Defer judgment / go for quantity / wild ideas welcome / build on others / one at a time / be visual / stay on topic — [frame-forge](./frame-forge.md) step 5 discipline
- **Brainwriting 6-3-5** (Rohrbach) — 6 × 3 × 5 silent — [frame-forge](./frame-forge.md) step 5 (anti-dominance)
- **Nominal Group Technique** (Delbecq & Van de Ven) — Silent generation → round-robin → discussion → vote — [frame-forge](./frame-forge.md) step 5
- **Crazy 8s** (GV Sprint) — 8 sketches in 8 minutes — [frame-forge](./frame-forge.md) step 5 timeboxing
- **Reverse Brainstorming / Worst Possible Idea** — Generate failure paths, invert — [frame-forge](./frame-forge.md) step 5
- **Six Thinking Hats** (de Bono) — Parallel-thinking protocol; white/red/black/yellow/green/blue — **extension candidate** for [frame-forge](./frame-forge.md) step 5 as divergence drill
- **Lateral Thinking** (de Bono) — Pattern-breaking moves — [frame-forge](./frame-forge.md) step 5
- **PO (Provocation Operation)** (de Bono) — Deliberately absurd stepping-stone — [frame-forge](./frame-forge.md) step 5
- **Random Entry / Random Word** (de Bono) — Inject unrelated stimulus — [frame-forge](./frame-forge.md) step 5
- **CoRT tools** (de Bono) — PMI, C&S, AGO, OPV — [frame-forge](./frame-forge.md) step 5 micro-moves
- **Synectics** (Gordon & Prince) — Direct/Personal/Symbolic/Fantasy analogies; "make the familiar strange" — [bridge-load](./bridge-load.md) + [frame-forge](./frame-forge.md) step 5
- **Walt Disney Method** (Dilts NLP) — Dreamer → Realist → Critic rooms in sequence — [frame-forge](./frame-forge.md) step 5 (separate divergence from critique)
- **Bisociation** (Koestler) — Creative act = joining two incompatible frames — [bridge-load](./bridge-load.md) anchor
- **TRIZ 40 Inventive Principles** (Altshuller) — Catalog of segmentation, asymmetry, nested doll, prior counteraction etc. — **extension candidate** for [bridge-load-templates](./bridge-load-templates.md)
- **TRIZ Contradiction Matrix** — 39×39 mapping improving/worsening parameters to recommended principles — extension candidate
- **ARIZ** (Altshuller) — ~85-step procedure when 40 Principles fail — extension candidate (advanced)
- **Su-Field Analysis** (TRIZ) — Substance-Field problem modeling — extension candidate
- **Ideal Final Result (IFR)** (TRIZ) — Imagine function delivered with zero cost/harm — [frame-forge](./frame-forge.md) step 5 anchor
- **Levels of Invention 1-5** (Altshuller) — From routine to scientific-discovery innovation — taxonomy
- **Means-Ends Analysis** (Newell & Simon) — [frame-forge](./frame-forge.md) step 5
- **"How Might We" reframing** — [frame-forge](./frame-forge.md) step 1 → step 5
- **Standard moves catalog** (Polya / FRAME FORGE step 5) — Already covered in owner page
- **Generate counter-examples** — [frame-forge](./frame-forge.md) step 5
- **Storyboarding** — Frame-by-frame scenario — [frame-forge](./frame-forge.md) step 5
- **Walking skeleton / Tracer bullet** (Hunt & Thomas) — Minimal end-to-end implementation — [frame-forge](./frame-forge.md) step 7 + [problem-solving-os](./problem-solving-os.md) step 4 (execution probe)
- **"Yes, and" (improv)** — Accept-and-build — [frame-forge](./frame-forge.md) step 5 conversational mode
- **Convergent vs Divergent thinking** — Alternate between generating and selecting — [frame-forge](./frame-forge.md) phase split intent

### Function 6 — Evaluation & convergence

Selecting among alternatives.

- **Cost-Benefit Analysis** — Sum benefits − costs in dollar terms — [decision-kernel](./decision-kernel.md) question 4
- **Pros and Cons list** — Classic capture form — [decision-kernel](./decision-kernel.md) question 4
- **Eisenhower Matrix** — Urgent × Important — [decision-kernel](./decision-kernel.md) for task selection
- **MoSCoW** — Must / Should / Could / Won't *(R3 gap — software/agile, not freshly researched here)* — [decision-kernel](./decision-kernel.md) prioritization
- **RICE scoring** — Reach × Impact × Confidence ÷ Effort *(R3 gap)* — [decision-kernel](./decision-kernel.md) for product prioritization
- **WSJF** — Weighted Shortest Job First (SAFe) *(R3 gap)* — [decision-kernel](./decision-kernel.md)
- **ICE scoring** — Impact / Confidence / Ease *(R3 gap)* — [decision-kernel](./decision-kernel.md)
- **Kano model** — Basic / Performance / Excitement / Indifferent / Reverse *(R3 gap)* — [decision-kernel](./decision-kernel.md) feature evaluation
- **Decision matrix / weighted scoring** — Multi-criteria score grid — [decision-kernel](./decision-kernel.md) question 5
- **AHP (Analytic Hierarchy Process)** (Saaty) — Hierarchical pairwise comparison with consistency ratio — [decision-kernel](./decision-kernel.md) formal extension
- **TOPSIS** — Distance to ideal / anti-ideal — [decision-kernel](./decision-kernel.md) MCDM tool
- **ELECTRE** — Outranking via concordance/discordance — [decision-kernel](./decision-kernel.md) MCDM
- **PROMETHEE** — Outranking via preference functions — [decision-kernel](./decision-kernel.md) MCDM
- **MAUT (Multi-Attribute Utility Theory)** — Utility-based aggregation under risk — [decision-kernel](./decision-kernel.md) MCDM
- **PrOACT** (Hammond/Keeney/Raiffa) — Problem/Objectives/Alternatives/Consequences/Tradeoffs + uncertainty/risk/linked — extension to [decision-kernel](./decision-kernel.md) (much wider scope than Eisenhower)
- **Vroom-Yetton-Jago decision tree** — Leadership style selector A1/A2/C1/C2/G2 — extension candidate (governance axis)
- **FOR-DEC** (Lufthansa) — Facts/Options/Risks/–/Decision/Execution/Check (hyphen = mandatory pause) — extension candidate
- **DECIDE** — Define/Establish/Consider/Identify/Develop/Evaluate — duplicate of [decision-kernel](./decision-kernel.md) 7-questions; not novel
- **Howard Decision Analysis** — Decision trees + utility + value of information — extension candidate (formal)
- **Influence Diagrams** — Nodes for decisions/uncertainties/values + influence arrows — extension candidate
- **Pareto Frontier / Efficiency** — Non-dominated alternatives — [decision-kernel](./decision-kernel.md) question 4
- **BATNA / ZOPA** (Fisher & Ury) — Best Alternative To Negotiated Agreement; Zone Of Possible Agreement — [decision-kernel](./decision-kernel.md) question 6 (for negotiation)
- **3D Negotiation** (Lax & Sebenius) — Tactics / deal design / pre-negotiation setup — extension candidate
- **Dual Concern / Thomas-Kilmann** — Competing / Accommodating / Avoiding / Collaborating / Compromising — extension candidate (conflict-mode classifier)
- **Robustness Analysis** (Rosenhead) — Evaluate by proportion of desirable future states kept reachable — extension candidate (uncertainty-aware [decision-kernel](./decision-kernel.md))
- **Wind tunneling** — Test each strategy against each scenario — extension candidate
- **Real Options Analysis** — Treat strategic choices as options with deferral value — extension candidate

### Function 7 — Synthesis & solution formalization

Turning the analysis into the answer.

- **Synthesize** (McKinsey 7-step step 6) — Weave analysis into story — [frame-forge](./frame-forge.md) step 7 + [problem-solving-os](./problem-solving-os.md) step 5
- **Bulletproof Problem Solving** (Conn & McLean) — Updated McKinsey 7: define/disaggregate/prioritize/workplan/analyze/synthesize/communicate — superset of [problem-solving-os](./problem-solving-os.md)
- **Pyramid Principle (Vertical Logic)** (Minto) — Each level answers a question raised by the level above — extension candidate
- **Pyramid Principle (Horizontal Logic)** (Minto) — Sibling points form deductive/inductive set — extension candidate
- **Backcasting** (Robinson, Holmberg) — Define future end-state, derive present actions — [frame-forge](./frame-forge.md) step 7 (planning)
- **Formalize** (FRAME FORGE step 7) — Already owned
- **Distill** (FRAME FORGE step 8 / [problem-solving-os](./problem-solving-os.md) step 6) — Already owned
- **Look-Back / Reflection** (Polya stage 4) — Reverify + extract reusable lesson — [problem-solving-os](./problem-solving-os.md) step 6
- **A3 Report** (Toyota) — Single 11×17 sheet: background→current→goal→root-cause→countermeasures→plan→follow-up — extension candidate (canonical single-page format)
- **OGSM** — Objectives/Goals/Strategies/Measures cascade — extension candidate (strategy-to-execution)
- **Hoshin Kanri / X-Matrix** — Cascading strategic alignment with catchball — extension candidate
- **Balanced Scorecard** (Kaplan & Norton) — Strategy map across 4 perspectives — extension candidate
- **Strategy Canvas + ERRC Grid** (Blue Ocean) — Eliminate/Reduce/Raise/Create — [decision-kernel](./decision-kernel.md) strategic
- **Playing to Win choice cascade** (Lafley & Martin) — Aspiration→where-to-play→how-to-win→capabilities→management systems — extension candidate

### Function 8 — Delivery / communication / stakeholder

The biggest gap in the current Neural OS stack. Treated separately because McKinsey *Mind* (8-step) is essentially a delivery framework, and StrategyU's critique says "meta-process matters more than the steps."

**Strong-extension cluster**: items here are candidates for a *new layer* (call it `DELIVER` or absorb into [problem-solving-os](./problem-solving-os.md) as step 5.5).

- **Prewire** (McKinsey *Mind*) — Walk decision-makers through findings 1:1 before the formal meeting — **N1 extension** (already flagged in Round 0; now strengthened by R1+R2 corroboration)
- **Start with the conclusion** (McKinsey) — Inductive presentation: answer first, support second — **N1**
- **Elevator Test** (McKinsey) — Compress recommendation to 30 seconds — **N1**
- **One message per slide** (McKinsey) — Simplicity as discipline — **N1**
- **"So What?" test** — Every slide/finding must answer "what should the client do differently?" — **N1** evaluation
- **Pyramid Principle** (Minto) — Top-down communication with grouped MECE arguments — **N1**
- **Ghost Deck / Dot-Dash Storyline** — Slide titles + stub charts before any design — **N1**
- **STAR / SAR (Situation–[Task]–Action–Result)** — Episode-narration template — **N1** + interview prep
- **Catchball** (Hoshin) — Iterative up-down alignment until consensus — **N1** for org-scale problems
- **Obligation to Dissent** (McKinsey value) — Required to voice disagreement — meta-discipline
- **Hit Singles** (McKinsey) — Small reliable wins over swing-for-the-fences — **N1** execution discipline
- **Respect Your Time** (Parkinson, McKinsey) — Train mouth to say no — [PULSE](./pulse-overview.md) Limit function
- **SBAR** (Leonard / Kaiser Permanente) — Situation/Background/Assessment/Recommendation — extension candidate (handoff format)
- **DESC script** (CRM) — Describe/Express/Specify/Consequences — extension candidate (assertiveness up authority gradient)
- **Crew Resource Management (CRM)** — Aviation communication+leadership+assertiveness+decision+SA+workload — extension candidate (multi-role coordination)
- **Innovation Theater** — Anti-pattern: rituals without outcome change — failure mode
- **Burying the Lede** — Anti-pattern: saving recommendation for the last slide — N1 failure mode

### Function 9 — Execution & implementation

Doing the thing once decided.

- **[attention-framework](./attention-framework.md)** (Neural OS) — Energy-based focus blocks — owner of execution slot
- **GTD (Getting Things Done)** (Allen) *(R3 gap clarified)* — Capture/Clarify/Organize/Reflect/Engage; 5-step workflow with contexts, Someday/Maybe, weekly review, 2-minute rule — extension candidate (personal execution OS)
- **Pomodoro** (Cirillo) — 25/5 cycles — extension candidate (timeboxing pattern in [attention-framework](./attention-framework.md))
- **Deep Work** (Newport) — Deep vs shallow; 4 disciplines of execution — extension candidate
- **Time Blocking** — Assign every minute to a block — extension candidate
- **Maker's vs Manager's Schedule** (Graham) — Half-day vs hour-grid — relevant to [PULSE](./pulse-overview.md) modulation
- **Eat the Frog** (Tracy) — Hardest task first — execution heuristic
- **MITs / 1-3-5 / Ivy Lee 6** — Daily prioritization — extension candidates
- **Bullet Journal** (Carroll) — Rapid logging + monthly migration — extension candidate
- **Personal Kanban** (Benson & Barry) — Visualize + limit WIP — extension candidate
- **Zettelkasten** (Luhmann) — Atomic notes + linking — overlaps with Neural OS encoder spine; comparison worth a dedicated page
- **PARA + CODE** (Forte) — Projects/Areas/Resources/Archives + Capture/Organize/Distill/Express — comparison candidate
- **Inbox Zero** (Mann) — Delete/Delegate/Respond/Defer/Do — extension candidate
- **Don't Break the Chain** (Seinfeld) — Calendar X-streak — habit-formation pattern
- **WOOP / MCII** (Oettingen) — Wish/Outcome/Obstacle/Plan + mental contrasting — already touched
- **Implementation Intentions** (Gollwitzer) — If-then planning — strong pattern; [SPEAR](./spear-overview.md) Preconditions slot anchor
- **Tiny Habits / Fogg Behavior Model** (Fogg) — B=MAP; anchor + behavior + celebration — extension candidate
- **Atomic Habits 4 Laws** (Clear) — Obvious/Attractive/Easy/Satisfying + identity-based — extension candidate
- **Habit Loop** (Duhigg) — Cue/Routine/Reward — extension candidate
- **COM-B / Behavior Change Wheel** (Michie) — Capability/Opportunity/Motivation + 9 intervention functions — formal extension candidate
- **Transtheoretical / Stages of Change** (Prochaska) — Precontemplation→…→Maintenance — extension candidate (sub-classifier for execution problems)
- **Motivational Interviewing OARS** (Miller & Rollnick) — Open questions / Affirmations / Reflective listening / Summaries — extension candidate
- **Spike / Tracer bullet / Walking skeleton** — Timeboxed investigation / minimal end-to-end — execution heuristics
- **TDD red-green-refactor** *(R3 gap)* — Test-driven execution — software-specific pattern
- **Continuous Delivery** *(R3 gap)* — Trunk-based development as execution OS
- **DORA metrics** — Deployment frequency / lead time / change-fail rate / MTTR — execution measurement
- **Recognition-Primed Decision (RPD)** (Klein) — Expert pattern-match + simulate first option; skip option-comparison — extension candidate ("for expert-level execution, [decision-kernel](./decision-kernel.md) is wrong tool")
- **OODA Loop** (Boyd) — Observe/Orient/Decide/Act; Orient is schwerpunkt — extension candidate (especially adversarial-domain version)
- **Toyota Practical Problem Solving (PPS)** — Clarify/breakdown/target/root-cause/countermeasures/evaluate/standardize — pipeline variant
- **8D (Eight Disciplines)** (Ford) — D0–D8 team-based corrective-action — pipeline variant
- **DMAIC / DMADV / IDOV / DMADOV** (Six Sigma) — Define-Measure-Analyze-Improve-Control + design variants — pipeline variants
- **PDCA / PDSA / OPDCA** (Shewhart/Deming) — Plan-Do-Check/Study-Act ± Observe — execution loop (already implicit in neural-os-daily-loop)
- **Toyota Kata** (Rother) — Improvement Kata + Coaching Kata — extension candidate (target-condition + experiment cadence)
- **Kepner-Tregoe Decision Analysis + Potential Problem Analysis** — Decision under structured options + risk lookahead — extension candidates

### Function 10 — Iteration, reflection, learning

Closing the loop so the next problem benefits from this one.

- **Distill** ([problem-solving-os](./problem-solving-os.md) step 6) — Already owned
- **Look-Back** (Polya) — Already owned via FRAME FORGE step 8
- **After-Action Review (AAR)** (US Army) — What was intended / what happened / why / what next — extension candidate (formal retro pattern)
- **Blameless Postmortem** (Google SRE) — Timeline + impact + root cause + actions, no individual blame — extension candidate (debugging/incident pattern)
- **Just Culture** (Dekker) — Honest error / at-risk / reckless distinction — failure-mode framework
- **Hansei** (Toyota) — Disciplined self-reflection even on success — [problem-solving-os](./problem-solving-os.md) step 6 + [METER](./meter-overview.md)
- **Yokoten** (Toyota) — Lateral sharing of effective countermeasures — extension candidate (cross-team transfer)
- **Nemawashi** (Toyota) — Quiet pre-decision consensus-building — pairs with Prewire under N1
- **PDCA / PDSA cycle** (Deming) — Already implicit in neural-os-daily-loop
- **Toyota Kata loop** — Already noted
- **Sprint Retrospective formats** *(R3 gap)* — Start-Stop-Continue / Mad-Sad-Glad / Sailboat / 4Ls / Plus-Delta — extension candidates (retrospective varieties)
- **Lessons Learned database** — KM artifact — known anti-pattern when not retrieved (see failures below)
- **Single-loop / Double-loop / Triple-loop Learning** (Argyris & Schön) — Fix actions / question governing variables / change learning context — **strong extension candidate** (depth of reflection axis)
- **Ladder of Inference** (Argyris) — Data → selected data → meanings → assumptions → conclusions → beliefs → actions; test each rung — extension candidate
- **Left-Hand Column** (Argyris & Schön) — Compare what-I-thought vs what-I-said — extension candidate (introspection move)
- **Espoused theory vs Theory-in-use** (Argyris) — Words vs action gap — failure-mode lens
- **Reflective Practitioner** (Schön) — Reflection-in-action vs reflection-on-action — naming distinction
- **SECI** (Nonaka & Takeuchi) — Socialization / Externalization / Combination / Internalization knowledge spiral — extension candidate (KM cycle)
- **Ba** (Nonaka & Konno) — Shared context for knowledge creation — concept
- **Tacit vs Explicit knowledge** (Polanyi / Nonaka) — distinction underlying SECI
- **Communities of Practice** (Lave & Wenger) — Legitimate peripheral participation — extension candidate (community-level learning)
- **DIKW Pyramid** (Ackoff) — Data / Information / Knowledge / Wisdom — extension candidate (epistemic ladder)
- **Sensemaking** (Weick) — Enactment / Selection / Retention — extension candidate (post-hoc framing)
- **Boundary Objects** (Star & Griesemer) — Artifacts robust across groups but plastic locally — concept
- **Transactive Memory** (Wegner) — Group-level "who knows what" — concept
- **Organizational Ambidexterity** (March) — Exploration vs Exploitation balance — extension candidate
- **70-20-10 development** — Experience / social / formal training split — extension candidate
- **Action Learning** (Revans) — L = P + Q (Programmed + Questioning) — extension candidate
- **Working Out Loud** (Stepper) — Narrate work openly in 12-week circle — extension candidate
- **Wallas 4-stage creative process** — Preparation / Incubation / Illumination / Verification — extension candidate (esp. incubation as deliberate step)
- **Hadamard's mathematical invention model** — Empirical confirmation of Wallas — supporting reference

### Function 11 — Cross-cutting heuristics & meta-principles

Things that apply across all functions.

- **Bounded Rationality / Satisficing** (Simon) — Take first option meeting aspiration — meta-principle
- **Ecological Rationality** (Gigerenzer) — Heuristics fit to environment beat optimization — meta-principle
- **Fast & Frugal Heuristics** (Gigerenzer / ABC group) — Take-the-best, recognition — meta-principle
- **Outside View > Inside View** (Kahneman/Lovallo) — Base rates beat narrative planning — meta-principle
- **Calibration over accuracy** (Tetlock) — Well-calibrated probabilities matter more than point predictions — meta-principle
- **Decision quality ≠ outcome quality** (Duke) — Defeat "resulting" bias — meta-principle
- **Probabilistic thinking** — Graded uncertainty over binary opinions — meta-principle
- **Latticework of mental models** (Munger) — Multi-discipline triangulation prevents "man with a hammer" — meta-principle
- **Inversion** (Munger / Jacobi) — Solve the inverse — meta-move
- **Second-order thinking** — Effects of effects — meta-move
- **Reference class forecasting** — Already noted
- **Decision journal** (Duke / Parrish) — Pre-register decision + reasoning to defeat hindsight bias — extension candidate (pairs with [METER](./meter-overview.md))
- **Law of Requisite Variety** (Ashby) — Regulator must match variety of regulated — meta-principle (informs PULSE)
- **Good Regulator Theorem** (Conant & Ashby) — Good regulator is/contains a model of system — meta-principle
- **Falsifiability** (Popper) — Must forbid some observation — meta-principle (epistemic hygiene)
- **Pragmatic maxim** (Peirce) — Meaning = sum of practical effects — meta-principle
- **Economy of Research** (Peirce) — Prefer cheapest-to-test hypotheses first — meta-principle
- **Schoenfeld's metacognitive control** — Monitor, regulate, switch strategies — meta-principle for [problem-solving-os](./problem-solving-os.md)
- **Schoenfeld: belief systems shape solutions** — Worldview gates which moves get tried — meta-principle
- **Speed of OODA cycling beats prediction** (Boyd) — Getting inside opponent's loop disrupts orientation — adversarial-domain principle
- **Orient as schwerpunkt** (Boyd) — Mental models dominate decision quality — meta-principle
- **Match response to domain** (Cynefin) — Sense-categorize-respond / sense-analyze-respond / probe-sense-respond / act-sense-respond per domain — meta-principle
- **HRO 5 principles** (Weick & Sutcliffe) — Preoccupation with failure / reluctance to simplify / sensitivity to ops / commitment to resilience / deference to expertise — meta-principle for high-stakes
- **Mindfulness of weak signals** — HRO sub-principle
- **Reluctance to simplify** — HRO sub-principle (resists premature MECE)
- **Deference to expertise, not authority** — HRO sub-principle (overrides Vroom-Yetton hierarchy)
- **Treat patterns as patterns, not rules** — TRIZ + design pattern wisdom

### Function 12 — Named anti-patterns / failure modes

The clippings + research surface a substantial catalog of failure modes. Many already match Neural OS [failure-modes-in-encoding](./failure-modes-in-encoding.md) philosophy; novel ones are extension candidates for a `wiki/problem-solving-failure-modes.md` page.

**Framing failures**:
- **Boiling the Ocean** — Analyze everything, prune nothing
- **Solving the wrong problem / Type III error** (Ackoff/Mitroff) — Precise answer to misframed question
- **Wicked-as-tame error** — Apply analytic methods to a wicked problem
- **Premature closure** — Settle on first plausible H
- **Solutionism / falling in love with the solution** — Skip framing phase

**Decomposition failures**:
- **Not MECE** — Overlaps / gaps in tree
- **Treating a mess as a problem** (Ackoff) — Decomposing destroys what matters
- **Reductionist analysis of a system** (Ackoff) — Optimizing parts degrades whole
- **Investigator-knowledge ceiling** (in 5 Whys) — Cannot surface causes you don't already know
- **Single-cause fixation** (5 Whys) — Linear chain misses interacting roots
- **Non-repeatable RCA** (5 Whys) — Different analysts get different "roots"

**Hypothesis failures**:
- **Confirmation bias** — Seek only corroborating evidence
- **Single-Hypothesis Attachment** (Chamberlin/Platt) — Ego-investment blocks alternatives
- **Affirming the consequent** — Treat prediction success as proof
- **Unfalsifiable theory** (Popper) — Compatible with every possible observation
- **Ad-hoc rescue / degenerating programme** (Lakatos) — Auxiliaries save core without new predictions
- **HARKing / p-hacking** — Multiple-comparison / post-hoc hypothesis abuse
- **Base-rate neglect** — Ignore prior in Bayesian updating

**Cognitive biases (Kahneman/Tversky family)**:
- **Availability** — Ease of recall = frequency
- **Representativeness** — Similarity to prototype overrides base rates
- **Anchoring & Adjustment** — Initial value insufficiently moved from
- **Framing effect** — Gain vs loss flips choice
- **Sunk cost fallacy** — Past investment drives continuation
- **Hindsight bias** — "I knew it all along"
- **Narrative fallacy** (Taleb) — Coherent story on noisy data
- **Conjunction fallacy** (Linda) — P(A∧B) judged > P(A)
- **Overconfidence / planning fallacy** — Underestimate own time/cost/risk
- **Status quo / default bias** — Disproportionate stick with current state
- **Loss aversion** — Losses loom 2× gains
- **Endowment effect** — Own = more valuable
- **Affect heuristic** — Emotion substitutes for analysis

**Execution failures**:
- **Functional Fixedness** (Duncker) — Object can't be used outside conventional role
- **Einstellung effect** (Luchins) — Prior solution blocks better one
- **Premature optimization** — Code before understanding algorithm
- **Brute-force-first** — Ignore heuristic structure
- **Local optimum trap** — Hill climbing without restart
- **Heuristic without admissibility (A*)** — Overestimating destroys optimality
- **Stopping the 5 Whys too early** — First plausible answer is a symptom
- **Solution jumping** (Toyota PPS) — Skip clarification phase
- **Containment without permanent fix (8D D3 stuck)** — Interim becomes "solution"
- **Skipping "Look Back"** (Polya) — No transferable lesson

**Communication / delivery failures**:
- **Burying the lede / detective-story deck** — Recommendation last
- **Analysis paralysis** — Endless data without hypothesis
- **HiPPO** (Highest-Paid Person's Opinion) — Seniority overrides evidence
- **Unclear decision rights** (Bain "who has the D?") — Decisions stall, get re-litigated
- **Action items without owners/due dates** — Guarantees recurrence
- **Risk-register theater** — Maintained but never consulted

**Group / org failures**:
- **Groupthink** (Janis) — Consensus pressure suppresses dissent
- **Abilene paradox** — Group acts against everyone's private preference
- **Risky shift / polarization** — Groups push positions to extremes
- **Defensive routines / skilled incompetence** (Argyris) — Face-saving blocks learning
- **Espoused-vs-in-use gap** (Argyris) — Words diverge silently from actions
- **Single-loop trap** (Argyris) — Optimize within wrong frame
- **Lessons-learned-not-learned** — Files exist, never retrieved
- **NIH (Not-Invented-Here)** — Rejecting external knowledge
- **Innovation theater** — Sticky notes without changed outcomes
- **Feature factory** (Cutler) — Output volume over outcomes
- **Hero culture / firefighting** — Reward heroics, perpetuate outages
- **Blame-and-train** — Close incident by "retraining the operator"
- **Pilot purgatory** — Prototypes that never scale

**Systems failures (Senge/Meadows archetypes)**:
- **Shifting the Burden / Addiction** — Symptomatic fix erodes capacity for fundamental solution
- **Fixes that Fail / Backfire** — Short-term fix produces long-term worsening
- **Limits to Growth** — Reinforcing engine hits unanticipated balancing loop
- **Tragedy of the Commons** — Individual rationality destroys shared resource
- **Eroding / Drifting Goals** — Standards quietly lowered when gap persists
- **Escalation** — "Defensive" responses mutually amplify (arms race)
- **Success to the Successful** — Allocation creates winner-take-all
- **Growth and Underinvestment** — Demand grows but capacity lags
- **Accidental Adversaries** — Partners' local optimizations undermine each other
- **Seeking the Wrong Goal** — Goodhart-style metric gaming
- **Rule Beating** — Letter-of-the-law violating spirit
- **Policy Resistance** — System internal goals counteract intervention

**Cybernetic / VSM failures**:
- **Violating Requisite Variety** — Regulator simpler than environment
- **Bad Regulator** — Regulator without accurate model of system
- **Algedonic blindness** (Beer) — Hierarchy filters out pain before S5
- **Missing S4 (Intelligence)** — No future-scanning subsystem
- **Double Bind** (Bateson) — Contradictory injunctions across logical levels
- **Treating complex as complicated** (Cynefin) — Apply best-practice / expert analysis where probe-sense-respond is required
- **Category error of domain** (Cynefin) — Misdiagnose chaos as complex
- **Boundary blindness** (Ulrich/CSH) — Fail to ask whose interests/knowledge/values bound the system
- **Joint sub-optimization** (Trist/Emery STS) — Optimize technical while ignoring social (or vice versa)

**Safety / accident failures**:
- **Component-blame accident analysis** (STAMP/CAST critique of RCA) — Stop at "operator error" or "broken part"
- **Safety-I overreach** — Over-proceduralize where adaptive capacity is needed
- **Single-layer defense / no defense-in-depth** — One barrier failure = total loss
- **Heat-map illusion of precision** — Qualitative scores treated as numeric

**Risk-class failures**:
- **Gray Rhino denial** (Wucker) — Ignore obvious, high-probability, well-signaled threats
- **Black Swan over-attribution** — Label foreseeable Gray Rhinos as Black Swans for accountability dodge

**Game-theory failures**:
- **Equilibrium ≠ Pareto-optimal** — PD: stable doesn't mean good
- **TFT noise trap** — Plain Tit-for-Tat → endless retaliation spirals under noise
- **Non-credible threat** — Threats backward-induction discards
- **Winner's curse** — Common-value auctions: winner systematically overpays
- **Lemons problem** (Akerlof) — Adverse selection collapses market for quality
- **Agent moral hazard** — Once insured, agents shift to riskier behavior
- **Pure value-claiming** — Treat negotiation as zero-sum; destroy joint surplus

**Foresight failures**:
- **Trend-extrapolation tunnel vision** — Confuse present's push with only possible future
- **Litany-only response** (CLA) — Solve only surface symptom; miss systemic/worldview/myth layers

**Modeling failures**:
- **Premature convergence on solutions** (IBIS/Conklin) — Jump to ideas before questions surface
- **Opinion-trading without warrants** (Toulmin/van Gelder) — Claims asserted without data/warrant/backing
- **Linear waterfall on wicked** (Conklin) — Treat wicked problem as tame
- **Methodological monism** (Mingers) — Force one paradigm onto intervention needing many
- **Command-and-control on service work** (Seddon/Vanguard) — Manage by activity/cost instead of value-demand and flow; creates "failure demand"

---

## Master map back to Neural OS slots

The fused catalog reduces to a small number of recommendations against the existing stack:

### A. Already covered (no action needed)

The bulk of the catalog already has a home. [frame-forge](./frame-forge.md)'s 8-step pipeline is structurally equivalent to McKinsey's 7-step, Polya's 4-stage (Polya step 1 ≈ FRAME phase steps 1+2+3; Polya step 2 ≈ FORGE phase step 5; Polya step 3 ≈ FORGE phase step 7; Polya step 4 ≈ FORGE phase step 8), and the Toyota PPS / Six Sigma DMAIC / 8D family with cosmetic differences. [decision-kernel](./decision-kernel.md)'s 7 questions cover the Hammond-Keeney-Raiffa PrOACT slot, the FOR-DEC slot, the Eisenhower / RICE / MoSCoW / ICE prioritization slot, the BATNA/ZOPA negotiation slot, and the SWOT/cost-benefit capture-template slot. [S·E·C·T](./problem-type-classifier.md) occupies the classification slot.

The McKinsey delivery layer, Polya's "Look Back," Toyota's *hansei*, AAR, blameless postmortem, and the Senge double-loop reflection cluster all map to [problem-solving-os](./problem-solving-os.md) steps 5 (Record) and 6 (Distill) plus [METER](./meter-overview.md).

### B. Surgical extensions worth queueing (the genuinely-novel cluster)

Items below are *strong candidates* — they appeared independently across multiple traditions or fill a structural gap the existing stack doesn't address. Each is an extension to an existing page, not a new top-level framework.

| # | Extension | Target page | Why | Originator(s) |
|---|---|---|---|---|
| **N1** | **Stakeholder / Delivery layer** — Prewire + Conclusion-first + Pyramid Principle + Elevator test + Catchball + SBAR + DESC + Hit Singles + "So What?" + Ghost Deck | [problem-solving-os](./problem-solving-os.md) step 5.5 *or* new named sibling protocol | The McKinsey *Mind* 8-step is essentially this layer; Pyramid Principle (Minto) + Nemawashi/Catchball (Toyota) + SBAR (Kaiser) + DESC + CRM (aviation) all corroborate. Current OS step 5 ("Record") doesn't address persuading the stakeholders the solution serves. | McKinsey, Minto, Toyota, Kaiser, aviation CRM |
| **N2** | **TRIZ inventive-principle catalog** (40 principles + Contradiction Matrix + Ideal Final Result + Su-Field) | [bridge-load-templates](./bridge-load-templates.md) | TRIZ is a *catalog* of cross-domain analogy moves; [bridge-load](./bridge-load.md) is the right home (analogy construction). Adds named principles BRIDGE form can stub against. | Altshuller |
| **N3** | **Six Thinking Hats** as divergence drill | [frame-forge](./frame-forge.md) step 5 (add to standard moves) + new [red-queen-skill-gym](./red-queen-skill-gym.md) drill | Parallel-thinking 6-perspective rotation is a named divergence move not currently in step 5's list. | de Bono |
| **N4** | **Top-down ↔ bottom-up oscillation Modes** | [frame-forge](./frame-forge.md) (new "Modes" section) | StrategyU's critique: linear pipelines hide that real work oscillates. FRAME ⇄ FORGE phase split partly encodes; calling it out as first-class behaviour finishes the job. | Millerd / StrategyU |
| **N5** | **Cynefin** as orthogonal classifier | [problem-type-classifier](./problem-type-classifier.md) (add sister axis) | S·E·C·T classifies the gap; Cynefin classifies the *kind of cause/effect relationship* — clear / complicated / complex / chaotic. The two compose: a tradeoff in a complex domain takes a different tool than the same tradeoff in a complicated one (probe-sense-respond vs sense-analyze-respond). | Snowden |
| **N6** | **System Archetypes & 12 Leverage Points** | New page `wiki/system-archetypes.md` linked from [frame-forge](./frame-forge.md) step 3 | Senge/Meadows archetypes (Shifting the Burden, Fixes that Fail, Limits to Growth, Tragedy of the Commons, etc.) are pattern-library entries the encoder spine has no analog for. High-leverage pattern recognition at system level. | Senge, Meadows, Kim, Braun |
| **N7** | **Single-/Double-/Triple-loop Learning** | [problem-solving-os](./problem-solving-os.md) step 6 (Distill) — add reflection-depth axis | Argyris' depth-of-reflection axis. Step 6 currently extracts patterns; this names *what level of pattern* — action fix / governing-variable fix / learning-context fix. | Argyris & Schön |
| **N8** | **Ladder of Inference + Left-Hand Column** | New page or section in psychology-os-framework | Argyris' introspection moves for surfacing jumps from data to belief. Pairs with [problem-solving-os](./problem-solving-os.md) when problems stall on team mental-model mismatch. | Argyris (popularized by Senge) |
| **N9** | **Pre-mortem** | New step in [problem-solving-os](./problem-solving-os.md) (after step 4 Solve, before step 5 Record) | Klein's pre-execution failure-imagination. Sister to post-execution reflection; surfaces failure modes [ORACLE](./oracle-overview.md) would otherwise have to derive empirically. | Klein |
| **N10** | **Recognition-Primed Decision (RPD)** | [decision-kernel](./decision-kernel.md) (add as expert-mode skip) | Klein's finding: experts pattern-match + simulate, skipping multi-option comparison. For [level-4-5 users](./problem-solving-maturity-levels.md) in their domain, decision-kernel's 7 questions are wrong tool. | Klein |
| **N11** | **OODA Loop** | New page or [rapid-in-neural-os](./rapid-in-neural-os.md) integration | For adversarial / fast-changing domains (debugging, competitive play, negotiation under time pressure). Boyd's Orient-as-schwerpunkt finding informs [PULSE](./pulse-overview.md) mental-model maintenance. | Boyd |
| **N12** | **PrOACT** | [decision-kernel](./decision-kernel.md) (expanded form) | Hammond/Keeney/Raiffa structured form. Already partially overlaps with [decision-kernel](./decision-kernel.md); full PrOACT adds uncertainty/risk/linked-decisions sub-questions. | Hammond, Keeney, Raiffa |
| **N13** | **AAR / Blameless Postmortem template** | New page `wiki/after-action-review.md` linked from [problem-solving-os](./problem-solving-os.md) step 6 | US Army + Google SRE both converged on similar 4-question structure; gives [problem-solving-os](./problem-solving-os.md) step 6 a canonical form. | US Army, Google SRE |
| **N14** | **Hoshin Kanri X-Matrix + Catchball** | New page `wiki/hoshin-kanri.md` linked from neural-os-daily-loop | Multi-level strategic-alignment pattern. Pairs with monthly calibration for personal strategy. | Toyota Lean tradition |
| **N15** | **Toyota Kata (Improvement + Coaching)** | Extension of [red-queen-skill-gym](./red-queen-skill-gym.md) | Rother's target-condition + small experiments cadence is a sibling pattern to Red Queen Gym; explicit comparison worth documenting. | Rother |
| **N16** | **A3 Report format** | New page `wiki/a3-report.md` linked from [problem-solving-os](./problem-solving-os.md) step 5 | Canonical single-page problem narrative; gives [problem-solving-os](./problem-solving-os.md) step 5 a richer format than a METER event. | Toyota |
| **N17** | **Implementation Intentions / WOOP** | [SPEAR](./spear-overview.md) Preconditions slot | Gollwitzer + Oettingen's "if-then" specification of when/where/how a planned behaviour will trigger. Strong empirical support; SPEAR Preconditions is the right slot. | Gollwitzer, Oettingen |
| **N18** | **COM-B / Behavior Change Wheel** | psychology-os-framework extension | Michie's Capability/Opportunity/Motivation diagnostic for execution problems when the person is the obstacle. Pairs with Stages of Change as sub-classifier. | Michie |
| **N19** | **IBIS / Dialogue Mapping** | New page for [bridge-load](./bridge-load.md) family or stand-alone | Conklin's notation for shared-understanding on wicked / multi-stakeholder problems. The right tool when [frame-forge](./frame-forge.md) is wrong tool. | Kunz & Rittel, Conklin |
| **N20** | **Inversion** (Munger / Jacobi) | [frame-forge](./frame-forge.md) step 5 (add to standard moves) | "What would guarantee failure?" as design heuristic. One-line addition. | Munger |
| **N21** | **Outside View / Reference Class Forecasting** | [ORACLE](./oracle-overview.md) + [decision-kernel](./decision-kernel.md) question 6 | Kahneman/Lovallo's correction to inside-view planning. Already partially in ORACLE distributional mode; explicit naming helps. | Kahneman, Lovallo |
| **N22** | **Just Culture distinction** (honest error / at-risk / reckless) | New page or extension of [failure-modes-in-encoding](./failure-modes-in-encoding.md) | Dekker's three-way classification preserves blameless-postmortem culture while still discriminating reckless behaviour. | Dekker |
| **N23** | **HRO 5 principles** | [PULSE](./pulse-overview.md) extension | Weick & Sutcliffe's high-reliability operating principles align well with PULSE state-aware governance. | Weick & Sutcliffe |
| **N24** | **CRISP-DM / OSEMN / KDD / SEMMA / TDSP data-science pipelines** | New page `wiki/data-science-process.md` | Pipeline templates for the "this problem is a data analysis" sub-classifier. CRISP-DM is the most widely used in industry. | CRISP-DM consortium, Mason & Wiggins, Fayyad, SAS, Microsoft |
| **N25** | **MoSCoW / RICE / WSJF / ICE / Kano prioritization** | [decision-kernel](./decision-kernel.md) extension | Software/agile prioritization formulas. Pair with [decision-kernel](./decision-kernel.md) question 5. MoSCoW for stakeholder negotiation; RICE for product backlog; WSJF for SAFe time-criticality; ICE for growth-experiment ranking; Kano for feature-class classification. | Various agile traditions |
| **N26** | **Kolb experiential learning cycle** | Comparison page vs [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) | Concrete experience → reflective observation → abstract conceptualization → active experimentation; corroborates the Great Work seven operations. | Kolb |
| **N27** | **Ignatian Discernment of Spirits + Daily Examen + Quaker Clearness Committee + Sense of the Meeting + Lectio Divina** | New page `wiki/spiritual-discernment.md` | Structured vocational/moral decision methods. Quaker clearness-committee in particular (focus person + question-only committee + silence + no follow-up) is a notable group-decision protocol absent from corporate canon. Ignatian Rules give consolation/desolation diagnostics for emotional-state decisions. | Ignatius Loyola, Religious Society of Friends, Guigo II |
| **N28** | **CIA Structured Analytic Techniques** — ACH (Heuer), Key Assumptions Check, Quality of Information Check, Indicators/Signposts, Devil's Advocacy, Red Team, High-Impact/Low-Probability, "What If?", Outside-In Thinking, Structured Brainstorming, Cross-Impact Matrix | [frame-forge](./frame-forge.md) step 6 extension | Heuer's ACH formalizes Chamberlin/Platt multi-hypothesis discipline with a matrix scoring evidence × hypothesis for **disconfirmation** (not support). Strong sister to FRAME FORGE step 6 (Evaluate). The other SATs each map cleanly to existing FRAME FORGE steps. | Heuer / CIA Tradecraft Primer, Pherson |
| **N29** | **Cognitive Load Theory** (intrinsic / extraneous / germane + worked-example, split-attention, modality, expertise-reversal effects) | [representation-rules](./representation-rules.md) + [bridge-load](./bridge-load.md) | Sweller's CLT is a load-bearing learning-science theory currently absent from the Neural OS encoder spine. Worked-example effect in particular justifies why the wiki's filled-out examples beat blank templates for novices; expertise-reversal effect explains why advanced learners need different scaffolding. | Sweller |
| **N30** | **Learning Scientists 6 strategies** — spaced practice, retrieval practice, interleaving, elaboration, dual coding, concrete examples | Comparison page vs Neural OS encoder spine + [red-queen-skill-gym](./red-queen-skill-gym.md) | These are *exactly* what Neural OS already does via NEDF/CAST/SPEAR + spaced repetition + drill ladders + REMAPS. Clean validation page showing Neural OS rediscovers canonical learning science, not extension. | Weinstein, Sumeracki, et al. |
| **N31** | **Threshold Concepts** (Meyer & Land) — troublesome / transformative / irreversible / integrative / bounded | New mini-page or [problem-solving-maturity-levels](./problem-solving-maturity-levels.md) extension | Gateway concepts whose passage changes the learner's identity. Maps onto the wiki's level-3→4 maturity transitions where "seeing hidden structure" is the gateway. | Meyer & Land |
| **N32** | **Backward Design / Understanding by Design** (Wiggins & McTighe) | New page `wiki/curriculum-design.md` for the Neural OS book / academy project | Identify desired results → determine acceptable evidence → plan learning experiences. Strong curriculum-design pattern for the user's stated life goal (academy → school → university). | Wiggins & McTighe |
| **N33** | **Domain-Driven Design + Event Storming** (Evans, Brandolini) | [bridge-load](./bridge-load.md) sister page | Ubiquitous language + bounded contexts + context mapping. The software-world analog of [bridge-load](./bridge-load.md)'s "build a shared analogy" move at organizational scale. Event Storming is the workshop variant. | Evans, Brandolini |
| **N34** | **Architecture Decision Records (ADRs — Nygard format)** | [decision-kernel](./decision-kernel.md) extension | Title / Status / Context / Decision / Consequences as a single-page record format. Compatible with [decision-kernel](./decision-kernel.md) decision-record template; more compact for tactical decisions. | Nygard |
| **N35** | **Continuous Discovery + Opportunity Solution Tree** (Torres) | [frame-forge](./frame-forge.md) step 3 + [problem-solving-os](./problem-solving-os.md) daily rhythm | Weekly customer interviews by a Product Trio; tree links Outcome → Opportunities → Solutions → Experiments. Operational pattern for the "search problem under ongoing user contact" sub-case. | Torres |
| **N36** | **ACH — Analysis of Competing Hypotheses** (Heuer) (broken out separately because of its centrality) | [frame-forge](./frame-forge.md) step 6 (Evaluate) extension | Single most-cited intelligence-analysis technique. Matrix-based scoring of evidence × hypothesis for *disconfirmation*. Pairs with [ORACLE](./oracle-overview.md) anomaly mode. | Heuer |
| **N37** | **IRAC / CREAC / TREAC / MIRAT** (legal argument-structure) | [frame-forge](./frame-forge.md) step 7 (Formalize) extension | Standard structure for legal analysis and memos when the problem is argument-shaped. CREAC (Conclusion-first) corroborates N1's "start with the conclusion" principle from a third tradition (legal writing). | US/UK/AUS legal academia |
| **N38** | **SOAP + ADPIE + OPQRST + SBAR** (clinical templates) | [problem-solving-os](./problem-solving-os.md) step 5 (Record) extensions | Structured templates for clinical patient encounters. SOAP is the canonical progress-note. ADPIE is the nursing-process loop. OPQRST is the pain-history checklist. SBAR is the high-stakes verbal handoff. All four are mature, validated record formats. | Medical/nursing canon, US Navy submarine fleet |
| **N39** | **Christopher Alexander Pattern Language** (253 nested patterns + Quality Without a Name) | Cite as ancestor in glyph-grammar-pattern | Alexander's context-problem-forces-solution pattern format is the structural ancestor of every pattern-language tradition since (GoF design patterns, organizational patterns, learning patterns). glyph-grammar-pattern is functionally a Pattern Language at the visual-grammar level — deserves explicit lineage. | Christopher Alexander |
| **N40** | **Grounded Theory** (Glaser, Strauss, Charmaz) — open/axial/selective coding + constant comparison + theoretical sampling + theoretical saturation + memoing | Apply to Neural OS ingest workflow + new comparison page | Qualitative-research method directly applicable to the wiki's own ingest pipeline (CLAUDE.md §Ingest workflow). The "theoretical saturation" criterion is the qualitative analog of the stability criterion this very page demonstrates. | Glaser & Strauss, Charmaz |
| **N41** | **Hermeneutic Circle / Fusion of Horizons** (Gadamer) | Cross-link target for bible-historicist-hermeneutic + bible-davidson-hermeneutical-decalogue | Part↔whole interpretation; researcher's pre-understanding as resource not obstacle. Directly relevant to the wiki's Bible-study layer. Also informs CLAUDE.md §Idea validation — judgment necessarily moves between local edit and whole-architecture view. | Gadamer (Heidegger lineage) |
| **N42** | **Prudence as decision art** (Aquinas — counsel / judgment / command) | [decision-kernel](./decision-kernel.md) extension for moral/ethical problems | Aquinas' three acts of prudence give a decision-making spine for moral decisions [decision-kernel](./decision-kernel.md) doesn't address. Pairs with Wesleyan Quadrilateral (N43) and Double Effect for the moral-decision sub-class. | Aquinas |
| **N43** | **Wesleyan Quadrilateral** — Scripture / Tradition / Reason / Experience | Cross-link target for bible-davidson-hermeneutical-decalogue | Outler's reconstruction of Wesley's method; ranks Scripture as primary with Tradition/Reason/Experience as tests. Directly relevant to the wiki's Bible-study layer; sits alongside Davidson's *sola Scriptura* + *tota Scriptura* with explicit role for the three secondary sources. | Wesley (via Outler reconstruction) |
| **N44** | **Four Noble Truths as diagnostic-therapeutic template** — dukkha (problem) → samudaya (cause) → nirodha (cessation) → magga (path) | Pattern-library entry | Universal problem-solving structure within Buddhism: name the problem, trace the cause, posit cessation, prescribe the path. Structurally identical to RCA → countermeasure cycles; cross-tradition triangulation. | Buddhist canon |
| **N45** | **PEACE model** (UK police investigative interviewing) — Preparation/Planning → Engage/Explain → Account, Clarify, Challenge → Closure → Evaluation | Cite in [semantic-listening-system](./semantic-listening-system.md) when extended to interview contexts | Non-coercive structured interview protocol; designed specifically against the false-confession failure mode of the controversial Reid Technique. Relevant to any wiki extension that covers semi-structured interviewing as a capture method. | UK Home Office |

### C. Comparison candidates (not extensions, but worth a dedicated comparison page)

These external frameworks overlap meaningfully with Neural OS pages and would benefit from a side-by-side rather than absorption:

- **Zettelkasten** (Luhmann) vs Neural OS encoder spine — atomic-note + linking discipline
- **PARA + CODE** (Forte) vs Neural OS lifecycle / encoder spine — knowledge-management architecture
- **GTD** (Allen) vs [problem-solving-os](./problem-solving-os.md) + neural-os-daily-loop — execution-OS comparison
- **Polya's How to Solve It** vs [frame-forge](./frame-forge.md) — explicit one-to-one stage mapping
- **DMAIC / 8D / PPS / Polya / FRAME FORGE** — single comparison table showing they're variants of the same skeleton

### D. Honest "do not absorb" list

Some categories should NOT enter the wiki even though they're in the catalog:

- **OpenAI 151-list** — Mostly LLM prompting (CoT, ToT, few-shot, etc.). Belongs in a future `wiki/llm-prompting-patterns.md` if/when the wiki grows there, not in problem-solving.
- **AoPS Wishful Thinking blog** — Olympiad worked problems, not a framework. If olympiad heuristics deserve coverage, write `wiki/olympiad-heuristics.md` under [frame-forge](./frame-forge.md) as a domain-specific move-set.
- **Skills Builder UF 2.0** — Cookie-walled and CC-BY-NC-ND licensed; respect the licence and only quote/summarize sparingly if reaccessed.
- **Most of the 151 LLM-prompting patterns** — same reason as the OpenAI list.
- **The vast majority of cognitive biases** — these belong in a `wiki/cognitive-biases-catalog.md`, not in the PS pages directly.

---

## Open follow-ups

1. ~~Re-run Round 3~~ — **DONE 2026-05-17**; convergence achieved at ~1,035 raw / ~700 deduped items. N24–N28 confirmed; N29–N45 added.
2. **Decide N1 architecture**: Is "Delivery" a new step 5.5 in [problem-solving-os](./problem-solving-os.md), or a new named protocol sibling to PULSE/METER/SPARK? If the latter, glossary must register a name (candidates: `PREWIRE`, `DELIVER`, or something Neural-OS-flavored). **R3 triangulation note**: legal CREAC (conclusion-first) joins the McKinsey/Minto/Toyota/Kaiser/CRM cluster, making this a **6-tradition convergence** — even stronger signal that N1 is the highest-leverage extension.
3. **Decide N5 (Cynefin)**: Add as orthogonal axis to [problem-type-classifier](./problem-type-classifier.md) (cleanest) or as a separate sub-page? Either way, register `Cynefin` in [glossary](./glossary.md) when the page lands.
4. **N6 system archetypes** is the strongest pattern-library candidate — schedule its page.
5. **Comparison page on PS pipelines** (DMAIC = 8D = PPS = Polya = FRAME FORGE) would defang any future "why don't we use the McKinsey 7-step?" question with a single link. **R3 addition**: also include CRISP-DM (N24), Toyota PPS, KDD/SEMMA/TDSP, and the medical SOAP/ADPIE cycle in the comparison — five more variants of the same skeleton.
6. **NEW R3 follow-up — Bible-study cross-link**: N41 (Hermeneutic Circle / Fusion of Horizons — Gadamer) and N43 (Wesleyan Quadrilateral) deserve cross-link mentions in bible-davidson-hermeneutical-decalogue and bible-historicist-hermeneutic as ecumenical/philosophical companions to the Adventist historicist hermeneutic.
7. **NEW R3 follow-up — Christopher Alexander lineage**: cite Alexander's Pattern Language (N39) in glyph-grammar-pattern as structural ancestor — every pattern-language tradition since (GoF design patterns, organizational patterns) descends from this one root.
8. **NEW R3 follow-up — Cognitive Load Theory integration**: N29 (Sweller CLT) is the strongest learning-science integration opportunity. The worked-example effect and expertise-reversal effect should be cited from [representation-rules](./representation-rules.md) and [problem-solving-maturity-levels](./problem-solving-maturity-levels.md) respectively.
9. **NEW R3 follow-up — Learning Scientists comparison**: N30 deserves a dedicated comparison page showing Neural OS independently rediscovered the canonical 6 strategies (spaced practice → spaced repetition; retrieval practice → drill ladders; interleaving → mixed problem sets in [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md); elaboration → NEDF Distinguisher slot; dual coding → REMAPS; concrete examples → REMAPS Concrete-first rule). This is the strongest validation argument for the Neural OS book.

## What this page deliberately does **not** do

- Does **not** propose a new universal framework parallel to [problem-solving-os](./problem-solving-os.md) — that would violate CLAUDE.md §Consistency rule #2
- Does **not** edit any existing problem-solving pages (extensions N1–N28 are flagged and queued, not applied)
- Does **not** add new glossary entries — extensions get glossary rows when they land as owner pages
- ~~Does **not** silently fill the R3 gap from training data~~ — R3 has now been run; categories N24–N45 are freshly web-researched
- Does **not** treat every external named technique as a wiki-promotion candidate — most route into existing slots; only the **45 N items** (post-R3) are worth surgical work

## Related pages

- [problem-solving-os](./problem-solving-os.md)
- [problem-type-classifier](./problem-type-classifier.md)
- [frame-forge](./frame-forge.md)
- [decision-kernel](./decision-kernel.md)
- [attention-framework](./attention-framework.md)
- [problem-solving-maturity-levels](./problem-solving-maturity-levels.md)
- [problem-type-recognition-drill-ladder](./problem-type-recognition-drill-ladder.md)
- [bridge-load](./bridge-load.md)
- [bridge-load-templates](./bridge-load-templates.md)
- [meter-overview](./meter-overview.md)
- [pulse-overview](./pulse-overview.md)
- [oracle-overview](./oracle-overview.md)
- [grace-overview](./grace-overview.md)
- [spear-overview](./spear-overview.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- neural-os-daily-loop
- psychology-os-framework
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [failure-modes-in-encoding](./failure-modes-in-encoding.md)


---

## U — See (CAST)
1. Catalog of external problem-solving frameworks
2. How each maps to the unified pipeline

## D — Name (NEDF)
1. External problem-solving frameworks = catalog of outside frameworks
2. Distinguisher: imports + maps, doesn't re-invent
3. Failure mode: treating each framework as independent

## F — Do (SPEAR)
1. Encounter external framework → map to unified pipeline
2. Use mapping rather than learn independently

## B — Watch (HEART)
1. Framework re-invention
2. Missing the mapping step

## L — Predict (ORACLE)
1. Framework → predict pipeline equivalent
2. Pipeline gap → predict useful import

## R — Act (GRACE)
1. New framework → run mapping
2. Pipeline gap → import compatible framework