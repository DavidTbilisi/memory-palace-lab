---
palace: meta-knowledge
level: 4
domain: 10
room: 12
semantic_mode: 5
wiki_source: wiki/learning-systems/money-atomic-design.md
---

# Money Atomic Design

**Summary**: Brad Frost's five-tier *Atomic Design* spine — **Atoms · Molecules · Organisms · Templates · Pages** — applied to the money layer of Neural OS. Atoms are irreducible money primitives (one accounting term · one ratio · one behavioral move · one structural slot like Door/Chain/E-quadrant); molecules are the named tactic-grade combinations (ESBI Quadrant · Six Anchors route · NECST · Thiel-7 · Offer Stack · Money Model · Profit equation · Wealth equation · Mr. Market parable · Margin of Safety); organisms are the pipelines (Money-Canon 8-gate · Business-evaluation flow · Drill Ladder · Buffer-waterfall · Anki/SR money pipeline · Tithe-first cycle · METER money-event emitter); templates are the page-level schemas (the six-anchor route schema · ESBI grid · NECST checklist · Thiel-7 grid · Phase-gate · Budget table · Investment positioning quadrant · LTV/CAC scorecard); pages are the worked instances (millionaire-fastlane · rich-dad-poor-dad · zero-to-one · e-myth-revisited · 100m-money-models · company-of-one · psychology-of-money · intelligent-investor · little-book-common-sense-investing · budget-allocation · teacher-training-program). Sister page to [memory-atomic-design](./memory-atomic-design.md) and [problem-solving-atomic-design](./problem-solving-atomic-design.md) — same lens, different domain.

**Sources**:
- Brad Frost, *Atomic Design* (2016) — methodology source. Local clipping at `Clippings/Atomic Design Methodology  Atomic Design by Brad Frost.md`.
- [memory-atomic-design](./memory-atomic-design.md) · [problem-solving-atomic-design](./problem-solving-atomic-design.md) — sister applications of the lens; identical structure.
- money-canon-synthesis — the 8-phase decision spine; the largest organism on this page.
- money-vocabulary · money-applied-judgment · money-learning-architecture — the term-level inventory most atoms point to.
- personal-finance-six-anchors · esbi-quadrant · necst-commandments · fastlane-roadmaps · offer-stack · room-for-error — primary molecule owners.
- millionaire-fastlane · rich-dad-poor-dad · zero-to-one · e-myth-revisited · 100m-money-models · company-of-one · psychology-of-money · intelligent-investor · little-book-common-sense-investing — page-tier book instances.
- business-foundations · budget-allocation · teacher-training-program · personal-finance-drill-ladder · product-monetization-plans — page-tier worked instances inside the money layer.
- Design conversation, 2026-05-24.

**Last updated**: 2026-05-24

---

## Why this page exists

The money layer of Neural OS now spans ~25 wiki pages and three reading rounds across nine books, with definitions, six-anchor mnemonics, an 8-phase synthesis, drill ladders, and budget operational tables. What was missing is the *single shelf the kit lives on*. A reader could open psychology-of-money and millionaire-fastlane without ever seeing that one is a *page* (worked book instance) and the other is *both* a page **and** the owner of two load-bearing molecules (Three-Roadmaps + Wealth-Equation).

Atomic Design is that shelf. The same lens that organizes the problem-solving and memory inventories in [problem-solving-atomic-design](./problem-solving-atomic-design.md) and [memory-atomic-design](./memory-atomic-design.md) organizes money:

> *atoms combine together to form molecules, which further combine to form organisms.* — Frost

The five tiers compose strictly upward. Reading a money page now answers the question "*what tier?*" first, and only then "*what content?*" That order is the discipline. It is also what unmasks the canonical money-domain failure mode: applying a Phase-7 organism (Bogle's index-fund discipline) to a Phase-0 atom (E-quadrant income from a job) without ever building the intervening Engine-anchor molecule.

## The five-tier mapping (master table)

| Tier | Definition (Frost) | Money instance | Catalog page |
|---|---|---|---|
| **Atom** | "Foundational building blocks; cannot be broken further without ceasing to be functional" | One specific term, ratio, behavioral move, or structural slot (Income · ROI · Reasonable-over-Rational · Door anchor · E-quadrant) | §Atoms below |
| **Molecule** | "Relatively simple groups of UI elements functioning together as a unit" | A *named tactic* with its own trigger — ESBI classifier · Six-Anchor route · NECST · Thiel-7 · Offer Stack · Profit equation · Wealth equation · Mr. Market parable · Margin of Safety · LTV/CAC test | §Molecules below |
| **Organism** | "Relatively complex components composed of molecules and atoms forming distinct sections" | A named *pipeline* — Money-Canon 8-gate decision sequence · Business-evaluation flow · Personal-Finance Drill Ladder · Buffer-build waterfall · Anki/SR money pipeline · Tithe-first allocation cycle · Producer-reorientation loop · METER money-event emitter | §Organisms below |
| **Template** | "Page-level objects that place components into a layout and articulate the underlying content structure" | A *schema* — Six-anchor route schema · ESBI grid · NECST checklist · Thiel-7 grid · Phase-gate schema · Profit/Wealth equation schema · Offer-stack 4-layer schema · Budget allocation table · Investment positioning quadrant · LTV/CAC scorecard · Margin-of-Safety calc schema · Daily/Weekly money review | §Templates below |
| **Page** | "Specific instances of templates that show what a UI looks like with real representative content" | A *worked encoding* — the nine canonical books · budget-allocation · teacher-training-program · product-monetization-plans · the Money Canon synthesis · the user-specific Engine bets | §Pages below |

Composition is strictly upward. The Six-Anchor route lives on a Door + Scale + Safe + Chain + Engine + Shield atom stack; the Money-Canon 8-gate organism lives on ESBI + NECST + Thiel-7 + Franchise-Prototype + Offer-Stack + Enough + Margin-of-Safety + Mr.-Market molecules; the worked-book page lives on the Phase-gate template. You cannot strip the Money-Canon organism down to a single atom, and you cannot grow a single behavioral atom into a pipeline.

---

## Atoms

An **atom** is irreducible: split it and the move stops working. Atoms cluster into four chemical families. Each cell has a 2- or 3-letter symbol; this is the wiki's working alphabet for money-event annotation in METER. Same color palette as the [memory](./memory-atomic-design.md) and [problem-solving](./problem-solving-atomic-design.md) periodic tables — orange · blue · purple · green — with money-specific family names.

### Definition family (orange) — primitive money objects and states

| Symbol | Atom | Owner |
|---|---|---|
| **INC** | Income — money entering the system | money-vocabulary; personal-finance-six-anchors §Door |
| **EXP** | Expense — money leaving the system | money-vocabulary |
| **AST** | Asset (Kiyosaki cash-flow def — puts money in pocket) | money-vocabulary §Asset (Kiyosaki); rich-dad-poor-dad |
| **LIA** | Liability — claim against future money | money-vocabulary |
| **CSH** | Cash flow — money movement over time | money-vocabulary |
| **BUF** | Buffer — emergency reserve (3-6 mo) | money-vocabulary; personal-finance-six-anchors §Safe |
| **DEB** | Debt — borrowed obligation with interest | money-vocabulary |
| **REV** | Revenue — top-line customer payments | money-vocabulary; business-foundations |
| **PRF** | Profit — what remains after costs | money-vocabulary; business-foundations |
| **CST** | Cost — fixed + variable × volume | money-vocabulary; business-foundations |

### Metric / Formula family (blue) — ratio and equation primitives

| Symbol | Atom | Owner |
|---|---|---|
| **ROI** | (gained − spent) / spent × 100 | money-vocabulary §ROI |
| **NPV** | Net Present Value of future cash flows | money-vocabulary §NPV |
| **LTV** | Lifetime Value of one customer | 100m-money-models; offer-stack |
| **CAC** | Customer Acquisition Cost | 100m-money-models |
| **LvC** | LTV / CAC ratio (pass-floor > 3) | 100m-money-models; money-canon-synthesis §Phase-4 |
| **SR** | Savings Rate = savings / income | money-vocabulary §Savings Rate; psychology-of-money Ch.10 |
| **DTI** | Debt-to-Income ratio | money-vocabulary §DTI |
| **NW** | Net Worth = assets − liabilities | money-vocabulary §Net Worth |
| **MoS** | Margin of Safety = (intrinsic − price) / intrinsic | intelligent-investor; room-for-error |
| **WEQ** | Wealth Equation — Fastlane: Net Profit + Asset Value; Slowlane: Intrinsic Value × Time | fastlane-roadmaps; millionaire-fastlane |

### Behavioral family (purple) — psychology and orientation atoms

| Symbol | Atom | Owner |
|---|---|---|
| **ENO** | "Enough" — pre-committed success threshold (written, specific) | company-of-one; money-vocabulary §Enough |
| **REA** | Reasonable > Rational — emotionally sustainable beats optimal-on-paper | psychology-of-money Ch.11; room-for-error |
| **VAF** | Volatility as fee (not fine) — drawdowns are the admission price | psychology-of-money Ch.15 |
| **LCK** | Luck & Risk — same coin; attribute outcomes proportionally | psychology-of-money Ch.2 |
| **MGP** | Moving Goalposts — every milestone replaced by a higher one | money-vocabulary §Moving Goalposts; psychology-of-money Ch.3 |
| **WLT** | Wealth (unseen) — assets accumulated, not yet converted to spending | money-vocabulary §Wealth (Housel); psychology-of-money Ch.9 |
| **TAI** | Tails-you-win — small number of events drive most outcomes | psychology-of-money Ch.6 |
| **PRO** | Producer-orientation — "how does this make money?" (vs Consumer mode) | business-foundations; millionaire-fastlane §Switch Teams |
| **MIR** | Mr. Market — daily price-quotes are an irrational partner's offer, not a value signal | intelligent-investor Ch.8 |
| **SEC** | Secret — proprietary insight nobody else believes is true | zero-to-one; money-canon-synthesis §Phase-2 |

### Structural family (green) — anchor, quadrant, and structural-slot atoms

| Symbol | Atom | Owner |
|---|---|---|
| **DOR** | Door — income source slot | personal-finance-six-anchors §Door |
| **SCA** | Scale — budget-split slot | personal-finance-six-anchors §Scale |
| **SAF** | Safe — buffer slot | personal-finance-six-anchors §Safe |
| **CHN** | Chain — debt slot | personal-finance-six-anchors §Chain |
| **ENG** | Engine — business / value-creation slot | personal-finance-six-anchors §Engine |
| **SHL** | Shield — risk-protection slot | personal-finance-six-anchors §Shield |
| **EmQ** | E-quadrant — Employee (time × wage; left side) | esbi-quadrant |
| **SeQ** | S-quadrant — Self-Employed (owns the job; left side) | esbi-quadrant |
| **BuQ** | B-quadrant — Business Owner (system produces income; right side) | esbi-quadrant |
| **InQ** | I-quadrant — Investor (capital produces income; right side) | esbi-quadrant |

Why atoms matter: the atom is the smallest unit a **METER** money-event can name. A budget-overshoot logged as `crux_atom: SCA` (Scale anchor mis-tuned) is queryable; logged as "spent too much this month" is not. A panic-sell logged as `crux_atom: VAF` (treated volatility as fine, not fee) tells you exactly which Housel chapter to re-read; logged as "I sold at the bottom" tells you nothing reusable.

---

## Molecules

A **molecule** is a small bundle of atoms with its own trigger and its own characteristic shape. Money molecules are the named *tactics* the wiki has been building since the money-canon read.

| Molecule | Atomic composition | Trigger | Owner |
|---|---|---|---|
| **ESBI Quadrant** | EmQ + SeQ + BuQ + InQ + INC | Need to classify any income source by mechanism (left vs right) | esbi-quadrant |
| **Six-Anchor Route** | DOR + SCA + SAF + CHN + ENG + SHL | Place any new money concept; diagnose weakest anchor | personal-finance-six-anchors |
| **NECST Commandments** | Need + Entry + Control + Scale + Time (5 yes/no diagnostics on a business road) | Evaluating any candidate business road | necst-commandments |
| **Thiel-7 Questions** | Technology + Timing + Monopoly + People + Distribution + Durability + Secret | Confirming a business idea is *durable*, not just viable | zero-to-one |
| **Three Roadmaps** | WEQ-Sidewalk vs WEQ-Slowlane vs WEQ-Fastlane | Classifying the wealth strategy a person is on | fastlane-roadmaps |
| **Profit equation** | REV − CST − RSK − TAX | Computing real margin on any business unit | business-foundations |
| **Wealth equation (Fastlane)** | WEQ = Net Profit + Asset Value (multiple × NP) | Comparing total wealth produced by a road | fastlane-roadmaps; business-foundations |
| **Three Personalities** | Entrepreneur + Manager + Technician | Diagnosing why a small business is stuck | e-myth-revisited |
| **Franchise Prototype** | "Stranger can produce core product from documentation" test | Phase-3 system-readiness check | e-myth-revisited; money-canon-synthesis §Phase-3 |
| **Money Model (Offer Stack)** | Attraction + Upsell + Downsell + Continuity | Designing a business's full customer-lifecycle revenue | offer-stack; 100m-money-models |
| **LTV/CAC > 3 test** | LTV / CAC; pass-floor 3× | Phase-4 unit-economics check; self-funding acquisition | 100m-money-models; money-canon-synthesis §Phase-4 |
| **Enough threshold** | ENO + written-specific-number | Pre-committing the stop-growing line before reaching it | company-of-one |
| **Mr. Market parable** | MIR + MoS + REA | Right relationship with daily price quotes | intelligent-investor Ch.8 |
| **Margin of Safety** | MoS + intrinsic-value-estimate + buy-below | Phase-7 enterprising-investor purchase rule | intelligent-investor Ch.20; room-for-error |
| **Donate-Hold-Spend-Invest** | 4-way cash allocation choice | Any cash entering the Door | personal-finance-six-anchors §Scale |
| **50/30/20 split** | SCA + Needs + Wants + Savings | Default Scale-anchor tuning | personal-finance-six-anchors §Scale; budget-allocation |
| **Buffer-first defense** | SAF + 3-to-6-months-expenses + liquid-first | Before any Chain optimization or Engine investment | personal-finance-six-anchors §Safe |
| **Chain leverage rule** | If ROI > borrowing-cost → accelerator; else → value-destroyer | Any debt decision | personal-finance-six-anchors §Chain |
| **Investment positioning quadrant** | Passive × Active × Lend × Own | Classifying any investment instrument | money-applied-judgment §Investment positioning |
| **Decoy / Anchor / Menu Upsell** | 3 pricing-architecture sub-tactics | Phase-4 offer design | offer-stack; 100m-money-models |

Each molecule passes the [single-responsibility test](https://en.wikipedia.org/wiki/Single_responsibility_principle): one trigger, one shape. The wiki resists adding a molecule that overlaps an existing one's trigger — e.g. "value investing" is not its own molecule because it lives *inside* Margin of Safety + Mr. Market + MoS-formula.

---

## Organisms

An **organism** is a relatively complex section of the money layer — a named pipeline that runs as a unit, with its own internal sequence of molecules and atoms.

| Organism | What it does | Composition | Owner |
|---|---|---|---|
| **Money-Canon 8-Gate Decision Sequence** | Mindset → Road → Differentiation → System → Revenue → Calibration → Survival → Investing, with explicit gate question per phase | ESBI + NECST + Thiel-7 + Franchise-Prototype + Offer-Stack + Enough + Reasonable-over-Rational + Margin-of-Safety molecules in sequence | money-canon-synthesis |
| **Business-Evaluation Flow** | New-idea → NECST → Thiel-7 → 7-Core-Questions → Decision-Kernel commit/drop | NECST + Thiel-7 + Profit equation + Franchise Prototype molecules | business-foundations; necst-commandments |
| **Personal-Finance Drill Ladder** | Vocabulary → recognition → scenario-routing → applied-judgment under pressure | Vocabulary + Six-Anchor + ESBI + recognition shortcuts | personal-finance-drill-ladder |
| **Buffer-Waterfall** | Income → tithe → needs → buffer-to-3mo → debt-payoff-above-borrowing-cost → invest | Tithe + 50/30/20 + Buffer-first + Chain-leverage + Margin-of-Safety | personal-finance-six-anchors; budget-allocation |
| **Anki/SR Money Pipeline** | Vocab + diagram + scenario SR decks routed through encoder choice + SR scheduler | Money-vocab molecule + NEDF/SPEAR/CAST encoders + SM-2 | personal-finance-drill-ladder; money-vocabulary |
| **Tithe-First Allocation Cycle** | 20% gross off the top (above Scale) → post-tithe income through Scale → repeat monthly. Doctrinal floor and routing rules at tithe-doctrine-sda | Donate-Hold-Spend-Invest + 50/30/20 + tithe-doctrine (Conference-as-storehouse, three permitted uses, EGW 9-item exclusion list) | personal-finance-six-anchors §Scale; tithe-doctrine-sda |
| **Producer-Reorientation Loop** | Every product / ad / service encountered → "how does this make money?" → systems-mode | Producer-orientation + Money Model + Profit equation | business-foundations; millionaire-fastlane §Switch Teams |
| **Lifestyle-Servitude Diagnosis** | Spot the Work→Income→Lifestyle→Work loop; route to Sidewalk → Slowlane → Fastlane reorientation | Three-Roadmaps + Moving-Goalposts + Enough | fastlane-roadmaps |
| **Five-Layer Learning Routing** | Vocabulary → Comprehension → Diagram → Mnemonic → Business; route money source through each | Money-vocab + comprehension gates + CAST encoder + Six-Anchor + Business-foundations | money-learning-architecture |
| **Investment-Path Selector** | 10-hr/wk + emotional discipline → Graham; else → Bogle | Margin-of-Safety + Mr.-Market vs. index-fund discipline + Expense-Ratio gate | money-canon-synthesis §Phase-7 |
| **METER Money-Event Emitter** | Log decision · classification · purchase · sale · review with atom + molecule + organism annotations | Event trigger + crux_atom + molecule_lead + phase_gate | [meter-overview](./meter-overview.md) |
| **Cross-Book Recognition Reflex** | Hear any money/business statement → classify which canonical phase + which book in <5s | Money-Canon 8-gate organism + recognition shortcuts table | money-canon-synthesis §Cross-book recognition shortcuts |

Each organism owns one responsibility. The 8-Gate Decision Sequence owns "from-zero-to-investing path"; the Drill Ladder owns "vocab-to-judgment training"; the Buffer-Waterfall owns "monthly cash allocation." Overlap between organisms is the diagnostic for an over-broad pipeline.

---

## Templates

A **template** is a page-level skeleton with named slots — a layout that defines *which organisms run on which slots of content*. Templates are content-agnostic.

| Template | Slots | Owner |
|---|---|---|
| **Six-Anchor Route schema** | Door · Scale · Safe · Chain · Engine · Shield (fixed order; each protects/feeds the next) | personal-finance-six-anchors |
| **ESBI Quadrant grid** | E · S · B · I (2 axes: time-for-money vs systems; lend vs own) | esbi-quadrant |
| **NECST Checklist** | N-Need · E-Entry · C-Control · S-Scale · T-Time (5 yes/no rows per road) | necst-commandments |
| **Thiel-7 Question grid** | Technology · Timing · Monopoly · People · Distribution · Durability · Secret | zero-to-one |
| **Phase-Gate schema** | Phase-0 Mindset · Phase-1 Road · Phase-2 Diff · Phase-3 System · Phase-4 Revenue · Phase-5 Calibration · Phase-6 Survival · Phase-7 Investing — each with one gate question | money-canon-synthesis |
| **Profit equation schema** | Revenue − Cost − Risk − Tax = Profit; each variable expanded | business-foundations |
| **Wealth equation (Fastlane) schema** | Wealth = Net Profit + Asset Value; Asset Value = Net Profit × Multiple | fastlane-roadmaps; business-foundations |
| **Offer Stack 4-layer schema** | Attraction · Upsell · Downsell · Continuity (each with mechanism + example slots) | offer-stack |
| **Budget Allocation table** | Needs · Wants · Savings rows; each row carries line-items + sum + allocation + headroom | budget-allocation |
| **Investment Positioning quadrant** | Passive × Active × Lend × Own — 4 cells, each with instrument examples | money-applied-judgment §Investment positioning |
| **Margin-of-Safety calculation schema** | Intrinsic value estimate · Market price · Gap · Pass/Fail at ≥ 20–30% | intelligent-investor Ch.20 |
| **LTV/CAC Scorecard** | LTV · CAC · Ratio · Pass-floor 3× · By-channel breakdown | 100m-money-models; offer-stack |
| **Daily / Weekly money review** | Cash check · budget variance · buffer status · debt status · investment review · prospective income capture | personal-finance-drill-ladder |

The molecule-template-page distinction in money: the **Six-Anchor route** is a molecule (one trigger: place a new money concept); the **Six-Anchor route schema** is the template that any money topic-page realizes (Door slot has content, Scale slot has content, etc.); a **page** is what fills those slots with real numbers — budget-allocation is the canonical worked instance of the Scale slot at the user's actual income.

---

## Pages

A **page** is a *worked instance* — a template populated with the real organisms, molecules, and atoms of a specific money domain or book. The page is what users actually run with.

### Book-instance pages (the canonical nine)

| Page | Phase | Lead molecule(s) | Template realized |
|---|---|---|---|
| rich-dad-poor-dad | 0 — Mindset | ESBI Quadrant + Asset (Kiyosaki cash-flow) | ESBI grid + AST/LIA classification |
| millionaire-fastlane | 1 — Road | Three Roadmaps + Wealth Equation + NECST | Phase-gate (introduces) + Wealth equation schema |
| fastlane-roadmaps | 1 — Road (sub-page) | Three Roadmaps + Wealth Equation | Wealth equation schema |
| necst-commandments | 1 — Road (gate) | NECST | NECST Checklist |
| zero-to-one | 2 — Differentiation | Thiel-7 Questions + Secret + Monopoly | Thiel-7 grid |
| e-myth-revisited | 3 — System | Three Personalities + Franchise Prototype | Three-personalities schema + Phase-of-business |
| 100m-money-models | 4 — Revenue | Money Model (Offer Stack) + LTV/CAC > 3 | Offer-stack 4-layer + LTV/CAC scorecard |
| offer-stack | 4 — Revenue (sub-page) | Money Model + Decoy/Anchor/Menu | Offer-stack 4-layer schema |
| company-of-one | 5 — Calibration | Enough threshold + Resilience-first | Enough-threshold schema |
| psychology-of-money | 6 — Survival | Reasonable > Rational + Room-for-Error + Volatility-as-Fee + 19 behavioral insights | 19-chapter behavioral schema |
| room-for-error | 6 — Survival (sub-page) | Margin of Safety + Reasonable + Optionality | Margin-of-Safety schema |
| intelligent-investor | 7 — Investing (active) | Mr. Market parable + Margin of Safety | Margin-of-Safety calc schema |
| little-book-common-sense-investing | 7 — Investing (passive) | Expense Ratio < 0.05% + total-market index | LTV-style cost scorecard, inverted (cost-of-fund) |
| money-canon-synthesis | All 8 — synthesis | Money-Canon 8-Gate organism | Phase-Gate schema (canonical) |

### Owner-page money instances (wiki-native, not book summaries)

| Page | Template realized | Lead molecule | Domain slice |
|---|---|---|---|
| money-vocabulary | NEDF card schema (×17) | NEDF + contrast-pairs | Term-level definitions |
| money-applied-judgment | Recognition-shortcut table + Investment positioning quadrant | Cue→judgment 1-clause mapping | Pattern-level applied judgment |
| money-learning-architecture | Five-Layer Learning template | Vocab→Comprehension→Diagram→Mnemonic→Business routing | Spine page |
| personal-finance-six-anchors | Six-Anchor Route schema | Six-Anchor Route molecule | Mnemonic layer |
| business-foundations | Profit equation + Seven Core Questions templates | Profit equation + Wealth equation + Seven Questions | Business layer |
| budget-allocation | Budget Allocation table | 50/30/20 split (user-tuned 54/24/22 post-tithe) | Operational Scale-anchor instance |
| teacher-training-program | Franchise Prototype + curriculum-as-system | Franchise Prototype | Engine-anchor bet (academy) |
| product-monetization-plans | Asset-Value × Multiple template | Wealth equation (Asset Value side) | Engine-anchor inventory |
| personal-finance-drill-ladder | Drill Generator template | Vocabulary + Six-Anchor + recognition shortcuts | Training layer |
| esbi-quadrant | ESBI Quadrant grid | ESBI Quadrant molecule | Phase-0 classifier owner |
| law-of-effection | Impact ≈ Income scaling law | Producer-orientation + scale-impact equation | Phase-2 / Phase-5 sub-page |

Per Frost: "pages are essential for testing the effectiveness of the underlying design system." When a worked book or domain page cannot be cleanly decomposed into one template + one organism + one molecule + named atoms, the bug is in the design system. The book psychology-of-money *almost* failed this test: 19 chapter-essays don't map to one molecule. The decomposition that fit was: it is a *page* whose template is "behavioral schema" (a multi-essay collection), whose organism is "behavioral survival pipeline," and whose load-bearing molecules are Reasonable > Rational + Room for Error + Volatility-as-Fee. Spotting that no single molecule held the whole book is exactly the diagnostic this lens is for.

---

## Routing rule — when to think at which tier

| Symptom | Think at tier |
|---|---|
| Need to log this money event in METER with a `crux_atom` field a future audit could match against | **Atom** |
| Asking "what's the right test for this situation?" or "is this a NECST or a Thiel-7 question?" | **Molecule** |
| Asking "which pipeline am I in right now?" or "which gate am I stuck at?" | **Organism** |
| Asking "what is the schema?" or "what slots does this checklist have?" | **Template** |
| Asking "has anyone in the canon worked through this; can I copy their decomposition?" | **Page** (book or worked instance) |
| Designing a *new* money tactic that doesn't fit existing molecules | Check first: is it really new, or is it a parameterization of an existing molecule? |
| Designing a *new* phase or gate | First check overlap with the 8-gate organism; if genuinely new, name the responsibility-boundary before deploying |

Tier-conflation is the most common operational error: treating a molecule as an organism ("I'll just *run NECST* on my financial life" — no, NECST is a 5-question test for one road; the organism is the *8-Gate Decision Sequence* with NECST at Gate 1), or treating a template as a molecule (the Six-Anchor route schema is not a tactic, it's a schema for one).

---

## METER hooks per tier

The atomic-design lens tightens the money-event schema. Each tier contributes one field group:

```yaml
event_id: <uuid>
event_type: <budget|purchase|sale|decision|investment|business-evaluation|review>

# Atom-tier: which named primitives fired
atoms_used: [INC, SCA, ENO, REA]
crux_atom: ENO     # "Enough" threshold violation in this event

# Molecule-tier: which named tactic
molecule_lead: Six-Anchor-Route            # or ESBI · NECST · Thiel-7 · Margin-of-Safety …
molecule_secondary: [Buffer-first, 50/30/20]

# Organism-tier: which pipeline this event is inside
organism: Money-Canon-8-Gate              # or Buffer-Waterfall · Business-Evaluation-Flow …
organism_phase: Phase-5-Calibration       # if 8-Gate

# Template-tier: which schema the decision artifact uses
template: Phase-Gate-schema                # or Six-Anchor-Route · NECST-Checklist · Offer-Stack …
template_slot_at_event: Enough-threshold   # which slot of the template was at issue

# Page-tier: the canonical instance the event belongs to
page_id: company-of-one                    # or millionaire-fastlane · psychology-of-money …
page_template_match: true                  # false ⇒ the page broke the template; investigate
```

New dashboard metrics layered on the standard money dashboard:

| Metric | Definition | Pass / floor |
|---|---|---|
| **Atom-vocabulary coverage** | % of money events with a registered `crux_atom` | Pass ≥80%, floor 50% |
| **Molecule-name accuracy** | % of events where `molecule_lead` matches retrospective audit | Pass ≥80%, floor 60% |
| **Phase-gate alignment** | % of business decisions where `organism_phase` matches the actual gate the user was stuck at | Pass ≥75%, floor 50% |
| **Template-match rate** | % of decisions with `page_template_match: true` | Pass ≥90%, floor 70% |
| **Tier-conflation rate** | % of events where the user logged a molecule as an organism (e.g. "running NECST" instead of "running the 8-Gate with NECST at Gate 1") | Pass <10%, floor 25% |
| **Phase-skip rate** | % of decisions where the user applied a Phase-N organism without passing Phase-N−1 gate (Bogle without Engine, etc.) | Pass <5%, floor 15% |

---

## Anti-patterns

| Anti-pattern | What it looks like | Fix |
|---|---|---|
| **Atom-without-molecule** | Logging `crux_atom: VAF` without naming the molecule it served (Margin of Safety / Mr. Market / Three Roadmaps …) | Always log molecule-then-atom |
| **Molecule-as-organism** | "I'll run NECST on my whole financial life" — NECST is a 5-question test for one road, not a life pipeline | Run the *8-Gate Decision Sequence*; NECST sits at Gate 1 |
| **Template-without-organism** | Six-Anchor route filled with one-liner content but no SR / drill / monthly review running on top | A template alone gathers dust; pair with an organism on day one |
| **Page-without-template** | An ad-hoc personal-finance page with no underlying schema | Either retrofit a template or name a new one and register |
| **Inventing parallel molecules** | Naming "value-investing protocol" as a new molecule when it's *Margin of Safety + Mr. Market + MoS-formula composed* | Molecules are domain-irreducible; this one is a 3-molecule composition, not a new molecule |
| **Skipping the atom layer** | Logging only molecule + organism, no atom | Atom is the indexing key for METER; without it, cross-event transfer fails |
| **Phase-skipping** | Reading Bogle and starting to invest E-quadrant salary before any B/I-quadrant Engine exists | The arithmetic is right; deploying it from the wrong phase produces correct execution of the wrong strategy |
| **Phase-conflation** | Applying Phase-6 ("don't take big risks") to Phase-1 (road selection, which requires calculated asymmetric risk) | Housel's behavioral discipline protects what you've built; it is the wrong framework for deciding whether to build |
| **Double-S trap** | Business passes NECST-T (income survives absence) on paper but the documentation Gerber required was never completed | The Time Commandment is a compliance test, not a design guarantee — the Franchise Prototype is the design test |
| **Enough-without-LTV** | Defining "Enough" (Phase-5) before the offer architecture (Phase-4) generates self-funding LTV/CAC | A deliberately-small company that doesn't cover its CAC is a hobby, not a Company of One |

---

## How this composes with existing principles

| Existing principle | Atomic-design contribution |
|---|---|
| **Single-responsibility** (SRP, [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md)) | Each tier enforces SRP at its level — one molecule = one trigger; one organism = one pipeline responsibility |
| **Open-closed** (OCP) | New money tactics enter as new atoms or molecules; existing organisms and templates unchanged |
| **[UMTF](./universal-mental-tagging-framework.md)** | Atomic-design tier is the *Pattern* tag's structural axis, orthogonal to UMTF's 7-tag taxonomy |
| **[Memory Paradox](./memory-paradox.md)** | Take the tiers seriously enough to label every decision; hold loosely enough to refactor when the system creaks |
| **[skill-progression-stages](./skill-progression-stages.md)** | Atomic-design tier and money-strategic-ladder stage (Ignorance → Literacy → Strategy → Systems → Leverage → Autonomy) are orthogonal — a molecule can be at any stage; an atom can be Coagulated reflex or Cognitive |
| **[memory-atomic-design](./memory-atomic-design.md)** | Sister lens; identical structure, different domain. Atoms / Molecules / … mean the same five things; only the inventory differs |
| **[problem-solving-atomic-design](./problem-solving-atomic-design.md)** | Sister lens; the lens family now covers all three meta-knowledge domains the wiki is most active in |
| **[composability-index](./composability-index.md)** | This page is a *load-bearing composability claim* — that the money layer's ~25 pages compose cleanly into 5 strict tiers |

The page passes Idea Validation: improves separation of concerns, composes with all nine canonical money books + cross-cutting layers, adds retrieval clarity (you can grep `crux_atom` and `organism_phase`), extends without drift (organizes existing pages without rewriting), reduces cognitive overhead by replacing scattered taxonomy with one spine.

---

## Visual — full hierarchy (every tier, every atom)

> ![Money Atomic Design — full hierarchy](../diagrams/17-money-atomic-design-full.png)

All 40 atoms appear in their four family rows (definition orange · metric/formula blue · behavioral purple · structural green). Above them: representative molecules, the named organism pipelines, the page-level schemas, and the worked book/wiki pages. Solid arrows mark explicit composition (DOR + SCA + SAF + CHN + ENG + SHL → Six-Anchor Route; NECST + Thiel-7 + Franchise-Prototype + Offer-Stack + Enough + Margin-of-Safety → 8-Gate Decision Sequence; ESBI → Phase-0; Money-Canon synthesis page realizes the Phase-Gate template). Dashed arrows mark the same template realizing as multiple page instances (Phase-Gate template → nine canonical books).

---

## Excalidraw libraries (drag-and-drop Lego pieces)

Three `.excalidrawlib` v2 files live under `diagrams/lib/`. Import via Library panel → three-dot menu → **Open**.

| Library file | Items | Use it when |
|---|---|---|
| [money-atoms.excalidrawlib](../diagrams/lib/money-atoms.excalidrawlib) | 40 atoms in 4 family colors (Definition · Metric/Formula · Behavioral · Structural) | Sketching a new molecule, organism, or worked-decision page — drop atom-cells in place rather than redrawing |
| [money-molecules.excalidrawlib](../diagrams/lib/money-molecules.excalidrawlib) | 7 hub-and-spoke molecule clusters (ESBI · Six-Anchor Route · NECST · Thiel-7 · Offer Stack · Wealth Equation · Margin of Safety) | Building an organism or page diagram — drop the whole molecule as one unit |
| [money-tiers.excalidrawlib](../diagrams/lib/money-tiers.excalidrawlib) | 5 blank tier-shells with canonical color per tier | Starting a new money ladder, phase-gate, or page-decomposition diagram |

Generator: [`tools/excalidraw_libs/build_money_libraries.py`](../tools/excalidraw_libs/build_money_libraries.py). Same deterministic-seed pattern as the memory and PS generators. To add an atom, append a row to the `ATOMS` table in the script and re-run; same for molecules.

The PS, memory, and money atom families use *different* color assignments per family name even though all three palettes draw from the same 4-color set — money's families are orange (Definition) · blue (Metric/Formula) · purple (Behavioral) · green (Structural). Together with the PS palette (orange = Math, blue = Cognitive, purple = Diagnostic, green = Communicative) and memory's (orange = Encoding, blue = Transformation, purple = Storage+Retrieval, green = Substrate+Calibration), the wiki has a 4×3 = 12-family color matrix; intentional overlap is rare because the family-names are different at the tier-name layer.

---

## Calibration defaults

- Atom registry: **10 per family**, 4 families = **40 atoms**. Current: 40.
- Molecule registry: **15–22 molecules**. Current: 20.
- Organism registry: **8–14 organisms**. Current: 12.
- Template registry: **10–14 templates**. Current: 13.
- Page registry: unbounded; the canonical nine books anchor it; wiki-native worked instances grow it.
- Atom-coverage pass-floor: ≥80% of money events with registered `crux_atom`.
- Tier-conflation pass-floor: <10% of money events.
- Phase-skip pass-floor: <5% of money decisions.

---

## Mnemonic

A **money-changer's atelier** in [Velvet Aeon](./world-velvet-aeon.md) Mode-Environment register, pale-gold late-afternoon light through tall windows onto a workbench made of dark walnut. A **STRONG** archetype woman (per [feedback-image-face-and-hair](./feedback-image-face-and-hair.md) — angular jaw, piercing gaze, milky-white skin, waist-length shining hair) stands at the bench in a long charcoal coat, holding a small **brass balance-scale** (the Scale anchor) with two pans: one pan holds a single golden coin (income from the Door), the other holds three small stone weights labelled *needs · wants · savings*. On the wall behind her: a **periodic-table grid** of money atoms in four colors — orange (the Definition atoms: Income, Expense, Asset, Liability, Cash-flow, Buffer, Debt, Revenue, Profit, Cost), blue (the Metric atoms: ROI, NPV, LTV, CAC, LvC, SR, DTI, NW, MoS, WEQ), purple (the Behavioral atoms: Enough, Reasonable, Volatility-as-Fee, Luck, Moving-Goalposts, Wealth-Unseen, Tails, Producer, Mr.-Market, Secret), green (the Structural atoms: Door, Scale, Safe, Chain, Engine, Shield, E, S, B, I). On the bench in front: six **glass molecule-vessels** clustered by trigger — the ESBI 4-quadrant vessel with brass figurines on either side of a dividing wire (left = time-for-money, right = systems), the NECST vessel with five inscribed-glass commandments, the Thiel-7 vessel with seven small obsidian discs, the Offer-Stack vessel with four nested cones (attraction → upsell → downsell → continuity), the Wealth-Equation vessel with the inscription *NP + AV*, the Margin-of-Safety vessel with a horizontal water-line marking the intrinsic-value gap. To the right, on a low shelf: a **stack of eight gate-blueprints** (the 8-Gate Decision Sequence organism) numbered 0 through 7, each with a single gate question carved into its top edge. At her feet: a **single open codex** — the worked-canon instance, money-canon-synthesis, spread to the master-decision-sequence diagram, the brass balance-scale's shadow falling exactly across Phase-5 (Calibration: *Have I defined enough?*). The Velvet Aeon preserve is **sacred stewardship** — the atelier is where the math becomes a moral act, and the balance never tilts on its own.

Sub-scene callout for the atom glyph: a **single drop of molten gold** on the workbench cools into the symbol **DOR** in mono-font, and from that symbol a thin gold-leaf line traces the Six-Anchor route to SCA → SAF → CHN → ENG → SHL, then ascends to the 8-Gate Decision Sequence organism, then to the Phase-Gate template, then to the money-canon-synthesis page — the same drop compresses the entire 5-tier ascent.

## Memory checksum

- **5** tiers (Atoms · Molecules · Organisms · Templates · Pages)
- **4** atom families (Definition · Metric/Formula · Behavioral · Structural)
- **40** registered atoms · **20** registered molecules · **12** organisms · **13** templates · **20+** worked pages
- **1** strict composition order (upward only)
- **6** new METER fields (atoms_used · crux_atom · molecule_lead · organism · organism_phase · template_slot_at_event)
- **6** new dashboard metrics (atom-vocab-coverage · molecule-name-accuracy · phase-gate-alignment · template-match · tier-conflation · phase-skip)
- **1** anti-pattern family (tier-conflation) with **10** named sub-instances (incl. phase-skipping, phase-conflation, double-S trap, enough-without-LTV)
- **1** visual (17-money-atomic-design-full)
- **8** sequential gates in the canonical 8-Gate organism
- **9** canonical book-pages anchoring the page tier
- **3** sister atomic-design pages in the wiki ([memory-atomic-design](./memory-atomic-design.md) · [problem-solving-atomic-design](./problem-solving-atomic-design.md) · this)
- **3** Excalidraw libraries (atoms · molecules · tier shells), generated deterministically from `build_money_libraries.py`

If you can recite 5-4-40/20/12/13/20+-1-6-6-1/10-1-8-9-3 from "money atomic design" within 60 seconds, the page is encoded.

---

## Related pages

- atomic-design — Brad Frost's canonical five-tier methodology; owner of the Atoms · Molecules · Organisms · Templates · Pages spine
- [memory-atomic-design](./memory-atomic-design.md) — sister application of the lens; memory inventory
- [problem-solving-atomic-design](./problem-solving-atomic-design.md) — sister application of the lens; problem-solving inventory
- money-canon-synthesis — the 8-gate decision organism this page catalogues
- money-learning-architecture — the spine the canon hangs off
- money-vocabulary · money-applied-judgment — vocabulary atoms + recognition-shortcut molecules
- personal-finance-six-anchors — the Six-Anchor Route molecule + schema
- esbi-quadrant — the ESBI Quadrant molecule + schema
- necst-commandments · fastlane-roadmaps · millionaire-fastlane · law-of-effection — Phase-1 inventory
- zero-to-one — Phase-2 differentiation molecule
- e-myth-revisited — Phase-3 system molecule + Three-Personalities
- 100m-money-models · offer-stack — Phase-4 revenue mechanics
- company-of-one — Phase-5 calibration molecule (Enough)
- psychology-of-money · room-for-error — Phase-6 behavioral survival inventory
- intelligent-investor · little-book-common-sense-investing — Phase-7 capital-allocation pages
- business-foundations · teacher-training-program · product-monetization-plans — Engine-anchor pages
- budget-allocation · personal-finance-drill-ladder — operational worked instances
- [meter-overview](./meter-overview.md) — receiver of the new field group
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) — orthogonal Pattern-tag axis
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) — SRP/OCP/ISP this lens passes
- [composability-index](./composability-index.md) — wiki-wide composability dashboard this lens feeds

---

## U — See (CAST)

1. Money-changer's atelier with a periodic-table grid of money atoms behind the workbench, six glass molecule-vessels on the bench (ESBI · NECST · Thiel-7 · Offer-Stack · Wealth-Equation · Margin-of-Safety), a stack of 8 gate-blueprints on the shelf, the money-canon-synthesis codex open at the feet, brass balance-scale shadow falling on Phase-5 — single gold-drop compresses the 5-tier ascent
2. Edges: atom → bonds-to → molecule; molecule → fires-inside → organism; organism → slots-into → template; template → realizes-as → page

## D — Name (NEDF)

1. Five tiers = Atoms · Molecules · Organisms · Templates · Pages
2. Atoms = irreducible money primitives (4 families · 40 registered)
3. Distinguisher: a *classification lens* for the money layer, not new financial tools
4. Failure mode: phase-skipping (deploying a Phase-7 organism from a Phase-0 standing)

## F — Do (SPEAR)

1. New money asset → ask "what tier?" before adding it
2. Logging a money event → fill atoms_used + crux_atom + molecule_lead + organism + organism_phase + template_slot_at_event
3. Stuck on a money decision → traverse the 8-Gate organism; the bottleneck is the lowest gate not yet passed
4. Designing a new money tactic → enforce single-responsibility at the right tier; reject if it overlaps an existing molecule

## B — Watch (HEART)

1. Atom-without-molecule logging
2. Molecule-as-organism conflation (running NECST as if it were the whole pipeline)
3. Template-without-organism (a Six-Anchor route filled in once and never reviewed)
4. Page-without-template (an ad-hoc money page with no schema)
5. Phase-skipping (Bogle from a Phase-0 standing; Graham without Phase-6 emotional discipline)
6. Phase-conflation (Housel discipline applied to road selection)
7. Atom registry sprawl (>50) or molecule registry sprawl (>30)

## L — Predict (ORACLE)

1. New money situation → predict (phase, organism, molecule, atom) tuple before deciding
2. Decision going sideways → predict which gate the bottleneck is at
3. Worked book that can't be tier-decomposed → predict a missing molecule definition in the wiki

## R — Act (GRACE)

1. Encounter a money decision → label it by phase + tier as you go (atom → molecule → organism → phase → page)
2. New tactic appears → register at molecule tier with trigger + composition + name before deploying
3. New financial product or vehicle → place it in the Investment Positioning quadrant (Passive×Active × Lend×Own) before evaluating
