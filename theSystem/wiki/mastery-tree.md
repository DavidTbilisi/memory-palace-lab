---
palace: strategic-memory
level: 7
domain: 10
room: 8
wiki_source: wiki/learning-systems/mastery-tree.md
---

# Mastery Tree

**Summary**: The skill dependency graph for Neural OS. Lays out which skills depend on which, what counts as mastery at each node, and what the measurable next move is for any given user state. Together with [METER](./meter-overview.md), this turns the abstract idea of "getting better at thinking" into a navigable graph with explicit gates. Use this page to answer *"what should I work on next?"*

**Sources**:
- [mnemonic-methods-master](./mnemonic-methods-master.md)
- [meter-overview](./meter-overview.md)
- [problem-solving-os](./problem-solving-os.md)
- [problem-solving-maturity-levels](./problem-solving-maturity-levels.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- neural-os-daily-loop
- neural-os-30-day-rollout
- Design conversation, 2026-05-07

**Last updated**: 2026-05-07

---

## Why This Page Exists

Neural OS has many skills available to learn. Without a dependency graph, users either pick at random (low compounding) or follow surface-attractive rabbit holes (motoric encoding before NEDF is fluent). The Mastery Tree fixes that by making the prerequisite structure explicit: each node has incoming dependencies (you need this fluent first), outgoing dependencies (this enables that), and a measurable mastery gate.

Pair this page with [METER](./meter-overview.md) and you have an answer to the core operational question: *"given what I've already mastered, what's the highest-leverage next thing to work on?"*

## Reading The Tree

```
Each node has three properties:
  prereq:  what must be fluent before starting this
  gate:    the METER metric and threshold that defines mastery
  unlocks: what becomes accessible once mastered
```

Mastery is metric-confirmed, not self-declared. A skill is mastered when its METER gate has been held for ≥30 days at pass-threshold.

## The Tree (Top-Down, Most Foundational First)

### Layer 0 — Foundations (Days 1-14)

```
[Memory Palace]
  prereq:   none
  gate:     can walk a 10-locus palace from memory, retrieving placed items, ≥90% accuracy
  unlocks:  NEDF placement, CAST node placement, all spatial encoders

[NEDF]
  prereq:   Memory Palace
  gate:     ≥80% Distinguisher accuracy + ≥70% Failure-mode recall + <3000ms name-hook latency over 30 sessions
  unlocks:  CAST nodes, SPEAR scenes, HEART recognition slot, ORACLE faces, GRACE Read slot
            — every other Tier 1 encoder uses NEDF for its component-level identity

[Anki SR cycle]
  prereq:   any encoded artifact (NEDF cards are the typical first input)
  gate:     ≥85% accuracy on first-30-cards review for ≥7 consecutive days
  unlocks:  retention; performance gym workouts; lifecycle-manager standard ladder
```

### Layer 1 — Tier 1 Spine (Days 15-30)

```
[CAST]
  prereq:   Memory Palace + NEDF
  gate:     ≥85% edge-traversal accuracy on a 5+ node graph; redrawable from memory after 7 days
  unlocks:  systems thinking; relational material; ORACLE conditional faces over CAST temporal edges

[SPEAR]
  prereq:   Memory Palace + NEDF
  gate:     ≥90% happy-path step accuracy + ≥75% branch handling + ≥70% repair recall
  unlocks:  procedure encoding; algorithm tracks; ORACLE sequential faces over SPEAR steps

[HEART]
  prereq:   Memory Palace + NEDF
  gate:     ≥80% pattern-tag accuracy + ≥70% behavioral-loop prediction + falsifiability slot populated
  unlocks:  GRACE social_style integration; people-aware planning
```

### Layer 2 — Cross-Cutting Habits (Days 22+)

```
[PULSE self-report]
  prereq:   any daily session
  gate:     ≥5 days/week self-report logged for 4 consecutive weeks
  unlocks:  state-conditioned performance analysis; modulation effectiveness measurement

[Lifecycle Manager review]
  prereq:   ≥30 cards in active rotation
  gate:     monthly Cold→Archive sweep run for 3 consecutive months
  unlocks:  bloat-resistant long-term operation; consolidation acceptance

[METER reports]
  prereq:   any daily session
  gate:     Daily Glance composed ≥5 days/week + Weekly Review composed ≥3 weeks running
  unlocks:  calibration suggestions; cross-layer pattern detection
```

### Layer 3 — Predictive And Social (Days 31+)

```
[ORACLE sequential]
  prereq:   SPEAR fluent OR a sequential corpus
  gate:     ≥85% hit rate, <3000ms latency, on a 50+ card sequential deck
  unlocks:  semantic-listening prediction; semantic-reading prediction

[ORACLE distributional]
  prereq:   NEDF fluent + a multi-pattern domain (e.g., the [[algorithm-pattern-nedf-deck]])
  gate:     ≥80% top-1 on the pattern-classification gym ([[algorithm-pattern-gym]])
  unlocks:  pattern-recognition reflex; ranked-options decision-making

[ORACLE anomaly]
  prereq:   NEDF Failure-mode slots fluent
  gate:     ≥85% wrongness detection + <15% false-positive rate
  unlocks:  code review reflex; proofreading; security-style anomaly detection

[ORACLE conditional]
  prereq:   CAST temporal edges fluent
  gate:     ≥75% next-state hit rate
  unlocks:  systems-debugging reflex; behavioral prediction beyond HEART person-models

[GRACE]
  prereq:   HEART fluent + a culture context the user actually operates in
  gate:     per-mode read accuracy ≥80% + Choose accuracy ≥75% (gradient position ±1)
  unlocks:  social-pragmatic reflex in the tagged culture context
```

### Layer 4 — Performance And Reflex (Day 60+)

```
[Red Queen blocked-mode workouts]
  prereq:   any encoder above with ≥30 cards
  gate:     ≥90% accuracy on single-mode drills
  unlocks:  mixed-mode workouts

[Red Queen mixed-mode workouts]
  prereq:   blocked-mode mastered for that encoder
  gate:     ≥85% accuracy with stable latency
  unlocks:  random / adversarial workouts

[Red Queen random / adversarial workouts]
  prereq:   mixed-mode mastered
  gate:     ≥75% accuracy under noise
  unlocks:  pressure-stage / live performance

[Automaticity stage 6 (live performance)]
  prereq:   adversarial mastered
  gate:     ≥70% in a real-world scenario
  unlocks:  the skill is operational outside the gym; transfer becomes possible
```

### Layer 5 — Problem Solving (Day 30+, lifelong)

```
[Problem-Type Recognition]
  prereq:   read [[problem-type-classifier]] + 5+ classification attempts
  gate:     ≥85% classification accuracy + <30s time-to-classification on the [[problem-type-recognition-drill-ladder]]
  unlocks:  Tool routing; first-tool-correct rate measurement

[Problem-Solving OS daily rhythm]
  prereq:   problem-type recognition fluent
  gate:     ≥1 completed cycle per workday for 4 consecutive weeks
  unlocks:  Maturity-level progression measurement

[Maturity Level 2 → 3 → 4 → 5]
  prereq:   metric-confirmed at current level for ≥30 days
  gate:     all per-level pass thresholds in [[problem-solving-maturity-levels]] held simultaneously
  unlocks:  next level's training drills; tackle harder problem classes
```

### Layer 6 — Tier 2/3/4 Specializations (Day 60+, optional)

These are *unlocked* once Layer 1-2 is fluent. They are the sharper specialized tools — pursue them based on the domain you're working in, not as general-purpose levels.

```
[PAO + Major System]
  prereq:   NEDF fluent
  gate:     encode 50-card deck in <5 minutes with 100% retrieval
  unlocks:  numeric / sequence material; competitive memory tracks

[Hand-to-letter / Hand-to-number / Bigram-tap / Finger-procedure]
  prereq:   NEDF fluent + a domain that needs silent / tactile recall
  gate:     domain-specific (per [[motoric-encoding-systems]] subpages)
  unlocks:  embodied retrieval channels; bandwidth multipliers for specific situations

[Domain palace overlays — Calendar / Psychology / Bible / AWS / etc.]
  prereq:   the domain's source material absorbed at NEDF-card depth
  gate:     overlay walkable end-to-end in ≤2 minutes
  unlocks:  pre-built spatial structure for domain study
```

## How To Use This Page

### As a navigation aid

Open this page when asking *"what should I work on next?"* The first answer is whichever node is closest to its mastery gate but not yet over it. METER will surface this automatically once the event log has enough data; until then, eyeball the gate metrics against your most recent reports.

### As a prerequisite check

Before diving into a new specialization (e.g., GRACE), check the prereq list. If you don't yet have the prereq's METER gate confirmed, work on the prereq first.

### As a graduation map

The 30-day rollout produces Layer 0 mastery. Layer 1 takes another 30-60 days. Layer 2 is a habit that runs in parallel from Day 22 onward. Layer 3-6 are ongoing — most users are simultaneously training one or two Layer 3 nodes and one or two Layer 4 nodes. There is no "finished" — there is only "mastered enough to unlock the next thing."

### As a measurement contract

Every gate in this tree is a METER metric defined in [meter-overview](./meter-overview.md). The Mastery Tree is the dependency graph; METER is the measurement. They run as one system.

## Worked Example — Picking The Next Skill

User has completed 30-day rollout. Their Day-30 metrics look like:

```
NEDF:    distinguisher 87%, failure 75%, latency 2400ms — PASS, gate held 30 days
Memory Palace: 10-locus, 95% retrieval — PASS
Anki SR: 89% on 30-card deck — PASS
CAST:    edge accuracy 60% on a 5-node graph — BELOW GATE
SPEAR:   not yet attempted
HEART:   not yet attempted
PULSE:   logged 24/30 days — PASS
```

Mastery Tree readout: NEDF, Memory Palace, Anki, PULSE all passed gates. CAST is below gate but in progress. SPEAR and HEART are unattempted but their prereq (NEDF + Palace) is satisfied.

Next-skill picker:
- **Highest leverage**: pull CAST to the gate — it's already started and unlocks systems thinking + ORACLE conditional
- **Second highest**: start SPEAR — prereq satisfied, unlocks procedure encoding + ORACLE sequential
- **Defer**: HEART — prereq satisfied but lower leverage than CAST/SPEAR for the typical user

User's next month: 20 minutes/day on CAST gate-closing + 10 minutes/day starting SPEAR + standard daily loop continues.

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Tree-skipping** | Trying ORACLE before NEDF is gated | Prereq enforcement — ORACLE workouts won't schedule if NEDF gate not confirmed |
| **Self-declared mastery** | "I think I'm at maturity level 4" without metric evidence | Metric-confirmed only; self-report is an input, not the truth |
| **Gate gaming** | Optimizing the metric instead of the underlying skill | METER's Goodhart guard — qualitative prompts in reports surface this |
| **Single-track focus** | Only training one node, ignoring the rest | Daily loop forces breadth; weekly review surfaces neglected areas |
| **Tier 6 over-investment** | Spending months on PAO before NEDF is solid | Tier 6 prereq-locked behind Tier 1 mastery; the tree gates this explicitly |
| **Maturity stagnation** | Stuck at maturity level 2 for months without diagnosing why | Per-level pass criteria are explicit; failure to advance is itself a diagnostic signal |
| **Gate inflation** | Tightening gates so far that no skill ever passes | Gates are tunable but only with ≥30 sessions of evidence; suggested by METER, accepted/rejected by user |

## Calibration Defaults

- All gate thresholds inherit from the underlying layer pages ([meter-overview](./meter-overview.md#layer-specific-metric-definitions))
- Mastery confirmation window: ≥30 days at pass-threshold sustained
- Re-confirmation requirement: a previously-mastered gate must re-pass after 90 days of inactivity
- Maximum simultaneous active gates being trained: 3 (more dilutes; fewer underutilizes daily time)
- Tree depth review cadence: monthly during the Monthly Review window from neural-os-daily-loop

## What This Page Does Not Do

- doesn't replace any underlying layer page — it sequences and gates them
- doesn't enforce a single career path — the Layer 6 specializations are picked by domain, not by tree position
- doesn't claim that mastering everything in the tree makes someone an expert in any specific field — it makes them fluent with the *system*; domain expertise needs domain content
- doesn't account for natural variation — some users will gate CAST in 14 days, others in 60; the tree structure holds, the timing is personal
- doesn't replace neural-os-daily-loop — that page handles *when* to do the work; this page handles *which* work to do

## Bottom Line

Neural OS without the Mastery Tree is a list of methods. Neural OS with the Mastery Tree is a navigable, measured progression: every node has a prerequisite, a gate, and an unlock, with METER providing the measurement. The user's question *"what should I work on next?"* gets a metric-driven answer instead of a vibe-driven one. The combination of [mnemonic-methods-master](./mnemonic-methods-master.md) (which method), [meter-overview](./meter-overview.md) (how it's measured), neural-os-daily-loop (when to run), and this page (what to work on next) is the full operational stack for steering the system over months and years.

## Related Pages

- [mnemonic-methods-master](./mnemonic-methods-master.md)
- [meter-overview](./meter-overview.md)
- [problem-solving-os](./problem-solving-os.md)
- [problem-solving-maturity-levels](./problem-solving-maturity-levels.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- neural-os-daily-loop
- neural-os-30-day-rollout
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [nedf-overview](./nedf-overview.md)
- [cast-overview](./cast-overview.md)
- [spear-overview](./spear-overview.md)
- [heart-overview](./heart-overview.md)
- [oracle-overview](./oracle-overview.md)
- [grace-overview](./grace-overview.md)
- [pulse-overview](./pulse-overview.md)
- [wager-learning-unit](./wager-learning-unit.md) — the pre-commitment card filled in *before* consulting this tree: it decides whether a high-leverage node is worth starting and bounds the effort
- [lifecycle-manager](./lifecycle-manager.md)
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)


---

## U — See (CAST)
1. Skill dependency graph for Neural OS
2. Which skills depend on which + mastery criteria + next move

## D — Name (NEDF)
1. Mastery tree = skill dependency graph
2. Distinguisher: navigable graph with explicit gates
3. Failure mode: working on skills without dependency check

## F — Do (SPEAR)
1. Current state → consult tree
2. Identify next move

## B — Watch (HEART)
1. Skill-skipping
2. Self-assessment without gate

## L — Predict (ORACLE)
1. Current skill → predict prerequisites
2. Mastery → predict next branch

## R — Act (GRACE)
1. "What should I work on?" → consult tree
2. Stuck → check dependency