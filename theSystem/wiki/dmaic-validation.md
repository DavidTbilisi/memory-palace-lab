---
palace: meta-knowledge
level: 8
domain: 10
room: 11
wiki_source: wiki/learning-systems/dmaic-validation.md
---

# DMAIC Validation — Measure and Control as Load-Bearing Phases

**Summary**: Lean Six Sigma's DMAIC (Define → Measure → Analyze → Improve → Control) is already covered as a *pipeline-comparison* sibling in [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) — the skeleton is the same as FRAME FORGE, Pólya, McKinsey 7-step, 8D, and 10 others. This page does not repeat that argument. It extracts what DMAIC contributes *beyond* the equivalence claim: two phase names — **Measure** and **Control** — that the consulting / mathematical / clinical pipelines leave implicit. Measure validates [METER](./meter-overview.md) as architecturally required, not optional. Control validates that sustainment (regression-prevention) is a distinct phase distributed across [spaced-repetition](./spaced-repetition.md), [lifecycle-manager](./lifecycle-manager.md), neural-os-daily-loop, and METER's floor-breach escalations. The rest of DMAIC (project charters, SIPOC, fishbone diagrams, FMEA, SPC charts, DOE) is a manufacturing-flavored tool catalog that does not transfer to N=1 solo learning and is correctly absent from Neural OS.

**Sources**:
- ASQ DMAIC documentation — Six Sigma's 5-step define / measure / analyze / improve / control
- Imai, M. (1986). *Kaizen: The Key to Japan's Competitive Success* — already cited from genius-compass and [glossary](./glossary.md) § External canon for MURI / MURA / MUDA
- Five DMAIC infographic summaries supplied 2026-05-22 (Govind Tiwari PhD; Nikunj Bhoraniya) — cross-checked for tool-list consistency
- Internal: [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) (pipeline-skeleton equivalence) + [meter-overview](./meter-overview.md) (the Measure phase made architectural) + [learning-sciences-validation](./learning-sciences-validation.md) (validation-page pattern)

**Last updated**: 2026-05-22

---

## Why this page exists

[problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) already settled the cosmetic question — DMAIC is one of 14 named pipelines that all share the same skeleton, and "switch to DMAIC" is a category error like renaming rooms. But that page treats DMAIC's vocabulary as fungible. It is not. Two of DMAIC's letters carry weight that the other pipelines leave implicit:

- **M (Measure)** — most pipelines collapse measurement into Decompose / Probe / Diagnose. DMAIC names it as its own phase, with its own tools and its own pass criterion ("baseline established"). [METER](./meter-overview.md) is the Neural OS implementation of exactly this stance: measurement is a cross-cutting layer, not a sub-step of analysis.
- **C (Control)** — most pipelines stop at Implement / Recommend / Treat. DMAIC names a fifth phase whose entire purpose is *preventing regression after the gain*. Neural OS has the same function — but it is distributed across four pages and no single page names it. DMAIC's vocabulary surfaces that the function is load-bearing.

The other three letters (Define / Analyze / Improve) are the generic skeleton; they add nothing beyond what FRAME FORGE / Pólya / McKinsey already supply. The DMAIC tool catalog (SIPOC, VOC, fishbone, FMEA, DOE, SPC, control charts) is a manufacturing-flavored kit built for processes with N > 30 samples and shared operators — it is correctly absent from solo N=1 learning work.

This page is the symmetric counterpart to [learning-sciences-validation](./learning-sciences-validation.md): where that page validates the encoder spine against the Dunlosky six strategies, this page validates [METER](./meter-overview.md) and the distributed Control layer against DMAIC's phase naming.

---

## What DMAIC contributes — the two load-bearing letters

### M (Measure) → validates [METER](./meter-overview.md) as cross-cutting layer

DMAIC's Measure phase is not "collect some data for analysis." It is: *before you touch the process, establish a baseline you can later prove you improved against*. The phase has its own pass criteria — Measurement System Analysis (MSA) must confirm the gauges are accurate, the data plan must be operationalized, and the baseline distribution must be characterized. Skipping Measure is the canonical DMAIC failure mode ("we jumped to Improve and don't know if we actually fixed anything").

[METER](./meter-overview.md) is the Neural OS implementation of exactly this discipline:

| DMAIC Measure | METER analogue |
|---|---|
| Baseline distribution before intervention | Per-mode hit-rate baseline across last 30 sessions |
| Measurement System Analysis (gauges accurate?) | METER's "insufficient signal" rule (N<10 events → don't trust the number) |
| Data collection plan | Unified event schema; each layer declares what it tracks |
| Operational definitions | Per-layer floor / working / target thresholds |
| KPI selection | Per-mode pass criteria (`oracle::*`, `grace::*`, gym stage thresholds) |
| Gauge R&R discipline | Self-report vs inference agreement (PULSE metrics) |

Without DMAIC's vocabulary, "measure first" sounds like generic advice. With it, Measure is a named architectural slot with its own pass criteria. METER fills that slot. The skeptical "do you really need a separate measurement layer?" question is answered by pointing at DMAIC: every disciplined process-improvement tradition for 40+ years has put Measure on its own phase with its own pass gate.

### C (Control) → validates the distributed sustainment layer

DMAIC's Control phase is what separates *improvement projects that hold the gain* from *improvement projects that regress within 6 months*. The phase has its own tools — control charts, SOPs, training plans, periodic audits, mistake-proofing — and its own pass criterion (the gain is documented to hold for N control-chart periods after handoff).

Neural OS has the same function. It is *not* on a single page. It is distributed across:

| DMAIC Control element | Neural OS implementation |
|---|---|
| Control charts (regression detection) | [METER](./meter-overview.md) floor-breach escalations — fires when a metric drops ≥3 sessions below floor |
| Statistical Process Control (in-bounds detection) | METER weekly / monthly reports — surface drift before it becomes failure |
| Standard Operating Procedures (lock in the gain) | neural-os-daily-loop — the rhythm that prevents drift, codified as procedure |
| Periodic audits (verify the gain holds) | genius-compass weekly zone audit + METER monthly trend |
| Training plans (transfer the gain) | [red-queen-skill-gym](./red-queen-skill-gym.md) Lamp/Scale/Sword phases — "training" in DMAIC sense is reflex consolidation here |
| Mistake-proofing (poka-yoke) | [lifecycle-manager](./lifecycle-manager.md) auto-detection of Cold / leech cards before silent decay |
| Maintenance scheduling | [spaced-repetition](./spaced-repetition.md) — the substrate that *is* maintenance |

This is the load-bearing insight DMAIC supplies that the equivalence-page framing does not: *sustainment is its own phase*, and Neural OS has that phase even though no single page is named "Control." The architecture is correct; the vocabulary was hidden.

A non-trivial consequence: any future Neural OS page that argues "this artifact is encoded and the user can recall it" must also answer the Control-phase question — *how does this artifact stay above floor for the next 90 days, and what fires if it doesn't?* If the answer is "spaced repetition will handle it," that is a valid Control plan and should be explicit. If there is no Control plan, the artifact is at risk of silent regression even if it passes the Improve gate.

---

## What DMAIC does *not* contribute — the manufacturing tool catalog

DMAIC's Define / Analyze / Improve phases are generic problem-solving and add nothing beyond FRAME FORGE / Pólya / McKinsey. The associated tools are manufacturing-flavored and correctly absent from Neural OS:

| DMAIC tool | Why it does not transfer to N=1 learning |
|---|---|
| **SIPOC** (Supplier-Input-Process-Output-Customer) | Assumes a shared business process with explicit external stakeholders. For solo learning, the user is supplier, input, process owner, output, and customer simultaneously. Collapses to "what am I doing." |
| **Voice of the Customer (VOC)** | Same collapse; the user is the customer. neural-os-daily-loop qualitative prompts ("what felt hard this week?") cover the residue. |
| **Fishbone / Ishikawa diagram** | 6M categories (Man / Machine / Method / Material / Measurement / Mother-Nature) are manufacturing categories. [frame-forge](./frame-forge.md) step 6 (Evaluate) + [external-problem-solving-frameworks](./external-problem-solving-frameworks.md) § ACH cover root-cause analysis with categories that fit learning ("which encoder is failing?"). |
| **FMEA** (Failure Mode and Effects Analysis) | Pre-mortem analysis with severity × occurrence × detection scoring. Replaced by [nedf-overview](./nedf-overview.md) Failure slot + [spear-overview](./spear-overview.md) Repair slot + per-encoder failure-modes sections — failure modes are encoded *into the artifact*, not into a separate FMEA worksheet. |
| **Pareto analysis** | "80% of defects from 20% of causes" — useful in factories with high-N defect logs. Useless at N=1; the user does not have 100 wrong-answer events to Pareto-sort. |
| **Statistical Process Control (SPC) charts** | Assume IID samples from a stationary process. Learning is non-stationary by design; the goal is *to move the distribution*. METER uses rolling windows + state-conditioned baselines instead. |
| **Design of Experiments (DOE)** | Factorial designs require many treatment runs. The single-learner analogue is single-case experimental design (ABA, multiple-baseline) which is much lighter and is what [METER](./meter-overview.md)'s calibration loop implicitly approximates. |
| **5S / Kaizen / Standard Work** | Workplace-organization rituals. Not applicable to a knowledge base; the wiki-link discipline + [glossary](./glossary.md) are the analogue but they arrived from a different lineage ([representation-rules](./representation-rules.md) + Karpathy's LLM Wiki pattern). |

Importing these tools would be ceremony, not insight. The Define / Analyze / Improve middle of DMAIC is covered cleanly by [FRAME FORGE](./frame-forge.md) and the existing [Problem-Solving OS](./problem-solving-os.md) pipeline.

---

## Toyota Production System link

DMAIC has a sibling lineage in the Toyota Production System (Imai's *Kaizen*, Ohno's TPS) which is *already cited* from genius-compass and the [glossary](./glossary.md) § External canon citations as the source for **MURI** (overburden), **MURA** (unevenness), and **MUDA** (waste). The Lean Six Sigma synthesis joins Six Sigma's statistical-process discipline with TPS's waste-classification taxonomy. Neural OS already takes the 3M waste-class half (Compass breach events fire as MURI / MURA / MUDA in METER) without taking the statistical-process toolkit half. This page makes that split deliberate rather than accidental:

- **Kept from TPS**: MURI / MURA / MUDA taxonomy (cited from genius-compass)
- **Kept from Six Sigma**: Measure-as-named-phase (validates [METER](./meter-overview.md)), Control-as-named-phase (validates the distributed sustainment layer documented above)
- **Not kept from either**: the manufacturing tool catalog (SPC charts, FMEA, fishbone, DOE, SIPOC, VOC, 5S)

---

## Consequences for future pages

The two load-bearing extractions imply two operational disciplines:

1. **Any new encoder, gym, or layer page must declare its Measure plan.** "How will you know this is working?" should resolve to METER events with named pass criteria, not to a vibes-check. This is already the convention on most layer pages; DMAIC's vocabulary makes it explicit that it is *required*, not stylistic. Failure to declare Measure = the page is at the Improve-without-Measure failure mode.

2. **Any new encoder, gym, or layer page must declare its Control plan.** "What prevents this from silently regressing in 90 days?" should resolve to a named maintenance substrate ([spaced-repetition](./spaced-repetition.md), neural-os-daily-loop slot, [lifecycle-manager](./lifecycle-manager.md) sweep, or METER floor-breach escalation). Failure to declare Control = the page is at the Improve-without-Control failure mode (gain not held).

These two disciplines retire the implicit "we'll worry about measurement / sustainment later" mode that DMAIC was historically created to prevent.

---

## Related pages

- [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) — the cosmetic-equivalence argument this page deliberately does not repeat
- [meter-overview](./meter-overview.md) — the Measure-as-architectural-layer implementation
- [spaced-repetition](./spaced-repetition.md) — the substrate of the distributed Control layer
- [lifecycle-manager](./lifecycle-manager.md) — Control-phase retirement / regression detection
- neural-os-daily-loop — Control-phase rhythm
- genius-compass — Control-phase weekly audit + the TPS 3M waste-class taxonomy
- [learning-sciences-validation](./learning-sciences-validation.md) — symmetric validation page for the encoder spine vs Dunlosky six strategies
- [external-problem-solving-frameworks](./external-problem-solving-frameworks.md) — broader registry that surfaces DMAIC as one of 14+ pipeline siblings
- [frame-forge](./frame-forge.md) — the Define / Analyze / Improve middle Neural OS uses instead of DMAIC's manufacturing tools
- [glossary](./glossary.md) § External canon — registers MURI / MURA / MUDA from the TPS half of Lean Six Sigma

---

## U — See (CAST)
1. DMAIC = D-M-A-I-C, 5-letter pipeline
2. Only M and C carry weight beyond the equivalence-page skeleton

## D — Name (NEDF)
1. DMAIC Validation = extract Measure + Control as load-bearing phases
2. Distinguisher: not another pipeline comparison — extracts the two letters that name what other pipelines leave implicit
3. Failure mode: treating DMAIC as a fungible variant and missing that Measure / Control name architectural slots

## F — Do (SPEAR)
1. New encoder / gym / layer page? → declare Measure plan (METER events + pass criteria) + Control plan (maintenance substrate)
2. Pipeline-shopping question? → link to [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md), not here
3. "Is METER really architecturally required?" → link here

## B — Watch (HEART)
1. Importing the DMAIC tool catalog (SIPOC, fishbone, FMEA, DOE, SPC) — N=1 learning rejects manufacturing-N tools
2. Skipping Control plan on new pages — silent regression risk
3. Confusing this page with [problem-solving-pipeline-equivalence](./problem-solving-pipeline-equivalence.md) (which makes the opposite argument — that DMAIC's *non*-M/C content is cosmetic)

## L — Predict (ORACLE)
1. Pages with named Measure plan → above-floor performance stays detectable
2. Pages without Control plan → silently regress within 30–90 days even if Improve gate passed

## R — Act (GRACE)
1. Author wants to ship a new layer → require Measure plan + Control plan in the page
2. Reviewer sees no Measure or Control in a new page → flag as Improve-without-Measure or Improve-without-Control failure mode
