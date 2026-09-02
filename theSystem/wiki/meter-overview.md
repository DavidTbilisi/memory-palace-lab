---
palace: meta-knowledge
level: 7
domain: 10
room: 9
semantic_mode: 5
glyph: 📊
wiki_source: wiki/cross-cutting/meter-overview.md
---

# METER

**Summary**: METER is the measurement layer for Neural OS. It defines a unified event schema, append-only event log, pass/fail evaluation rules, and periodic reports that turn the rest of the system from "structurally complete" into "measurable, governed, and improvable." METER is the layer that lets the user answer the question *"how am I actually doing?"* across encoding, retrieval, prediction, reflex, social, state, and problem-solving — with numbers, not vibes.

**Sources**:
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [web-gym-generation-schema](./web-gym-generation-schema.md)
- [lifecycle-manager](./lifecycle-manager.md)
- [oracle-overview](./oracle-overview.md)
- [pulse-overview](./pulse-overview.md)
- [grace-overview](./grace-overview.md)
- Design conversation, 2026-05-07

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-07 (v0.1.0 tooling at `tools/meter/` + Anki bridge at `tools/meter-anki-addon/`)

---

## Why This Layer Exists

Neural OS now has six encoders, capture protocols, a performance gym, a lifecycle manager, and two cross-cutting layers (UMTF taxonomy, PULSE governance). All of them claim measurability — every layer page has a "Calibration Knobs" section, a failure-mode table, and references to hit/miss tracking. But measurement was scattered across layers with no shared schema, no shared event log, no unified report.

That meant:
- the user could not answer *"am I actually getting better?"* with numbers
- calibration knobs stayed at default values forever because there was no signal to tune from
- patterns spanning layers (e.g., "every time my Energy drops, my GRACE accuracy spikes downward") were invisible
- the whole system was structurally complete but operationally opaque

METER is the layer that closes that opacity. It is structurally a third cross-cutting layer, sibling to UMTF (taxonomy) and PULSE (governance), with its own role: **measurement**.

## The Five Functions

METER's name encodes its five responsibilities:

| Function | Job |
|---|---|
| **M**easure | Define what gets tracked per layer / skill / artifact, with units and thresholds |
| **E**mit | Every operation in Neural OS produces a structured event |
| **T**rack | Events accumulate into an append-only log; aggregations roll up by time, layer, mode, skill |
| **E**valuate | Apply pass/fail rules, threshold checks, calibration logic; surface signals from noise |
| **R**eport | Periodic summaries — daily glance, weekly review, monthly trend, on-demand drilldown |

Like [PULSE](./pulse-overview.md), METER's letters are layer functions, not card slots. METER is governance over measurement, not an encoder.

## Position In The Architecture

| Layer | Members | Role |
|---|---|---|
| Capture / scoping | [RAPID](./rapid-in-neural-os.md), [BRIDGE LOAD](./bridge-load.md), [ORIENT](./orient-method.md), [Semantic Input](./semantic-input-cheat-sheet.md) | Decide what gets encoded |
| Encoding | [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), [GRACE](./grace-overview.md) | Produce durable artifacts |
| Performance | [Red Queen Gym](./red-queen-skill-gym.md), [Drill Generator](./drill-generator.md), [Automaticity](./automaticity-and-reflex-training.md) | Turn correctness into reflex |
| Lifecycle | [Lifecycle Manager](./lifecycle-manager.md) | Retire and consolidate |
| Cross-cutting (taxonomy) | [UMTF](./universal-mental-tagging-framework.md) | Shared vocabulary |
| Cross-cutting (governance) | [PULSE](./pulse-overview.md) | State-conditioned modulation |
| **Cross-cutting (measurement)** | **METER (this page)** | **Unified measurement schema and reporting** |

## The Unified Event Schema

Every operation in Neural OS that produces signal emits a METER event. The schema is deliberately minimal:

```yaml
event_id: <uuid>
timestamp: <ISO-8601>
session_id: <uuid>          # ties events from one session together
layer: <encoding|capture|performance|lifecycle|governance|measurement|problem-solving>
operation: <encode|review|gym-rep|sweep|self-report|read|produce|classify|...>
artifact_id: <card-id|room-id|palace-id|ladder-position|null>
metric_type: <hit|miss|latency_ms|state-self-report|state-inferred|tier-transition|...>
metric_value: <number|categorical|tuple>
mode: <oracle::sequential|grace::politeness|...|null>
context:                    # optional, layer-specific
  state: E:N S:N            # PULSE state at event
  workout: <gym-stage|null>
  cue_to_response: <ms|null>
  ...
```

All events are stored in an append-only log at `wiki/meter-event-log.md` (or, more practically, a JSON or CSV file for machine processing — the wiki page is the human-readable rollup).

## Layer-Specific Metric Definitions

Each layer declares what it tracks. METER's job is to provide the schema; each layer owns its metrics.

### Encoding metrics

| Layer | Metrics | Pass criteria |
|---|---|---|
| NEDF | Distinguisher accuracy (%), failure-mode recall (%), name-hook latency (ms) | ≥80% / ≥70% / <3000ms |
| CAST | Edge-traversal accuracy (%), node-name recall (%), graph-completion latency (s) | ≥85% / ≥90% / size-dependent |
| SPEAR | Procedure step accuracy (%), branch-handling accuracy (%), repair-recall accuracy (%) | ≥90% happy path / ≥75% branches / ≥70% repair |
| HEART | Pattern-tag accuracy (%), behavioral-loop prediction accuracy (%), falsifiability score | ≥80% / ≥70% / required not-null |
| ORACLE | Hit rate per mode (%), latency (ms), state-conditioned hit rate | mode-specific (see below) |
| GRACE | Read-cue accuracy (%), gradient-position accuracy (%), repair-applied count | ≥80% / ≥70% / ≥1 per missed Choose |

### Capture / assist metrics

These track the **suggest-then-confirm** assist behaviors in the capture layer, where the system proposes a default and the user accepts, edits, or overrides. The metrics exist to keep suggestion from silently replacing judgment.

| Behavior | Metric | Healthy signal |
|---|---|---|
| [RAPID](./rapid-in-neural-os.md) suggested encoder | `encoder_override_rate` — % of suggested encoders the user overrides | Low (≤5%) → deterministic rule is reliable; high → the [framework-comparison-matrix](./framework-comparison-matrix.md) selection rule is wrong for the user's material mix and needs revising |
| [BRIDGE LOAD](./bridge-load.md) suggested source + draft mapping | `analogy_edit_rate` — % of suggested analogies the user edits before accepting | **High is the goal here** (inverse of override-rate). Near-zero is the alarm: it signals rubber-stamping rather than active comprehension, which erodes the human-in-the-loop gate |
| [5 Gates](./5-gates-of-comprehension.md) Gates 1 & 4 suggested neighbors + edge-cases | `gate_suggestion_override_rate` — % of suggested LOCATE-neighbors / FALSIFY edge-cases the user discards | Low → the retrieval is reliable (like encoder-override); high → the neighbor/failure-mode retrieval is wrong for the material |
| [5 Gates](./5-gates-of-comprehension.md) Gates 2 & 3 gap scaffolds | `gate_scaffold_edit_rate` — % of suggested representation-gaps / minimal-examples the user reworks before accepting | **High is the goal** (like analogy-edit). Near-zero = rubber-stamping the comprehension scaffold. Gate 5 REGENERATE has no suggestion and no edit-rate, by design |

These metrics are deliberately split by polarity along one seam — **retrieval vs. comprehension**. For deterministic lookups (`encoder_override_rate`, `gate_suggestion_override_rate`), low override means the suggestion is trustworthy. For comprehension acts (`analogy_edit_rate`, `gate_scaffold_edit_rate`), low edit means the user has stopped doing the comprehension. METER reports all four, but flags the edit-rate metrics below floor as a degradation, not a success. Gate 5 (REGENERATE) is deliberately uninstrumented on the assist side — suggesting into it would contaminate the test it performs (see [5-gates-of-comprehension](./5-gates-of-comprehension.md) §Suggested Inputs).

### Performance metrics (Red Queen Gym)

| Stage | Primary metric | Pass threshold |
|---|---|---|
| Blocked (single-mode) | Accuracy | ≥90% |
| Mixed (rotating modes) | Accuracy + latency | ≥85% / latency stable |
| Random (adversarial) | Accuracy under noise | ≥75% |
| Pressure (real conditions) | Accuracy + observation-log hit rate | ≥70% live |
| Transfer | Cross-context hit rate | ≥60% on novel domain |

### Lifecycle metrics

| Operation | Metric | Healthy range |
|---|---|---|
| Retirement candidate flagging | Candidates per week per palace | 0–10 (above 10 → palace likely overcaptured) |
| Confirmation rate | % of `lifecycle::candidate-cold` confirmed | 60–90% (below 60% → too aggressive; above 90% → too lax) |
| Thaw rate | % of Cold cards pulled back to Active within 30 days | <5% (above 5% → retirement criteria need rewriting) |
| Consolidation acceptance | % of merge drafts accepted | 30–70% |

### PULSE metrics

| Metric | Healthy range |
|---|---|
| Self-report vs. inference agreement | ≥70% across last 10 sessions |
| Modulation effectiveness | Performance under modulated state ≥ 80% of unmodulated baseline |
| Daily check-in compliance | ≥5 of 7 days |
| State decay accuracy | Auto-decayed estimate within ±1 of self-reported on next session start, ≥60% of the time |

### ORACLE metrics

| Mode | Latency target (fluent) | Hit rate target |
|---|---|---|
| Sequential | <3000ms | ≥85% |
| Conditional | <5000ms | ≥75% |
| Distributional | <8000ms | ≥80% top-1 |
| Anomaly | <4000ms | ≥85% (false-positive rate <15%) |

### GRACE metrics

| Mode | Read accuracy | Choose accuracy | Exit-applied rate |
|---|---|---|---|
| Politeness | ≥80% | ≥75% gradient position ±1 | n/a |
| Tone | ≥80% | ≥75% | n/a |
| Hierarchy | ≥85% | ≥80% | n/a |
| Subtext | ≥75% | ≥70% | ≥1 per missed Read |
| Apology / disagreement | ≥80% | ≥75% | ≥1 per missed Choose |
| Community | ≥75% | ≥70% | n/a |

### Problem-solving metrics ([problem-solving-os](./problem-solving-os.md))

| Metric | Definition | Threshold |
|---|---|---|
| Classification accuracy | % correct on problem-type-classifier | ≥85% |
| Time-to-classification | Latency from problem statement to type-tag | <30s |
| Solution correctness | % solved correctly | domain-specific |
| Solution latency | Time to first viable solution | maturity-level-specific |
| Transfer rate | % of patterns applied successfully on novel problems | ≥60% |
| Maturity progression | Level on [problem-solving-maturity-levels](./problem-solving-maturity-levels.md) | tracked monthly |

## The Three Reports

METER produces three periodic reports.

### Daily Glance (1-line per layer)

Generated at session end. Surfaces the day's signal in 7 lines:

```
2026-05-07 — Daily Glance
  Capture:     5 new artifacts (3 NEDF, 1 CAST, 1 GRACE)
  Encoding:    avg distinguisher accuracy 78% (down 4% week-on-week)
  Performance: gym session 23min, mixed-mode hit rate 81% (in range)
  Lifecycle:   2 cards confirmed cold, 0 archived, 1 thaw
  PULSE:       session E:4→3 S:2→3 (mild fatigue drift)
  ORACLE:      3 sequential workouts, 87% hit, latency stable
  Problem:     1 classification drill, 9/10 correct in 4m
```

### Weekly Review (~1 page)

Generated Sunday. Trends, threshold breaches, calibration suggestions, top 3 things to fix.

### Monthly Trend (~3 pages)

Generated end of month. Mastery progression, retired-card audit, consolidation summary, state-conditioned performance patterns, drift detection.

All three reports live at `wiki/meter-reports/<date>.md` and roll up the underlying event log.

## Pass / Fail Evaluation Rules

Every metric has three thresholds:

- **Floor** — below this, the artifact / layer is broken; surfaces as red in reports
- **Working range** — between floor and target; functional but not mastered
- **Target** — at or above; mastered for this skill

When a metric crosses below floor for ≥3 consecutive sessions, METER fires an `escalation` event. Escalations route by layer:

- Encoding floor breach → rewrite the artifact (NEDF Distinguisher slot, CAST edge label, etc.)
- Performance floor breach → drop one drill ladder rung; rerun lower-pressure stage
- Lifecycle floor breach (e.g., thaw rate too high) → tighten retirement criteria
- ORACLE / GRACE floor breach → rewrite mode-specific slot (Read for Read-mode, A for Anomaly mode, etc.)

The exact thresholds per metric are listed in each layer's page; METER aggregates them into the report.

## Calibration Loop

Every calibration knob in the four 2026-05 layer pages (Lifecycle, ORACLE, PULSE, GRACE) has a default value. METER's job is to surface when those defaults are wrong:

```
If, over the last 30 sessions, metric X has stayed above target while threshold Y is at default,
   then suggest tightening threshold Y by one notch
   (and vice-versa for floor breaches)
```

This is the explicit feedback loop that turns the system from spec to operational. Calibration is not a one-time setup; it is continuous tuning driven by the event log.

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Goodhart drift** | User starts optimizing the metric instead of the underlying skill | Reports include qualitative "what felt hard this week" prompts; metrics are signals, not scoreboards |
| **Event log bloat** | Every keystroke logs an event; log becomes unworkable | Events are emitted only at meaningful operation boundaries; sub-operation steps don't log |
| **False precision** | Metrics presented to 2 decimals when noise is 20% | Reports show ranges and trends, not point estimates; CIs displayed where applicable |
| **Single-day overreaction** | One bad session triggers calibration changes | Rolling windows: 7-day for floor breach, 30-day for calibration suggestions |
| **Layer-blind aggregation** | Reporting "overall accuracy 78%" when this masks ORACLE-anomaly at 50% and ORACLE-sequential at 95% | Reports break down by layer and mode by default; aggregate-only views require explicit drill-up |
| **State-blind comparison** | Comparing performance across sessions without state-conditioning | All metrics are reported alongside PULSE state; cross-state comparisons use state-conditioned baselines from [PULSE state-history](./pulse-overview.md) |
| **Premature escalation** | Floor breach fires after one bad day | Escalations require ≥3 consecutive sessions below floor |
| **Calibration churn** | Thresholds change every week | Calibration suggestions require ≥30 sessions of evidence; user accepts/defers, doesn't auto-apply |

## What This Layer Does Not Do

METER explicitly does **not**:

- **encode new material** (no artifacts beyond the event log and reports)
- **modify Anki, the gym, or any other tool's internal scheduler** (it observes; tools own their own runtime)
- **prescribe which metric matters most** (each layer owns its metrics; METER provides schema and aggregation)
- **replace user judgment** (escalations are suggestions; the user accepts, defers, or rejects)
- **collect biometric or external data** (deferred indefinitely; self-report and tool-emitted events only)
- **gamify learning** (no points, no streaks, no leaderboards — these are user-extensible if desired but not part of the core layer)
- **produce shareable scores** (the event log is private; reports are personal)
- **make claims that exceed the data** (a metric with N<10 events is shown as "insufficient signal")

## Worked Examples

### Example 1: Daily glance after a normal session

User completes a 25-minute morning session: 30 Anki reviews, one ORACLE sequential workout, one GRACE produce-mode workout. Self-reports E:4 S:2 at start. Inference at session end: E:3 S:2.

Daily Glance produced:

```
2026-05-07 — Daily Glance
  Capture:     0 new
  Encoding:    NEDF distinguisher 84% (target ≥80% ✓), CAST 92% (✓)
  Performance: 25min total; SR 30 cards 87%; ORACLE-seq 12 prompts 91%; GRACE-prod 8 prompts 75%
  Lifecycle:   1 leech flagged (lifecycle::candidate-cold), no actions taken
  PULSE:       E 4→3 (mild drift), S 2→2 (stable)
  ORACLE:      sequential mode: 91% / 1.8s avg latency (✓ both)
  GRACE:       politeness mode: read 85% / choose 70% (read ✓, choose at floor)
  ⚠ ESCALATION: GRACE politeness Choose has been ≤72% for 3 sessions; suggest rewriting Alternatives gradient anchors
```

The escalation surfaces the layer that needs attention without requiring the user to scan all the metrics.

### Example 2: Calibration suggestion in weekly review

After 30+ sessions:

```
Calibration suggestion 2026-05-07:
  Layer: ORACLE
  Mode: anomaly
  Current latency target: <4000ms
  Observed: median 2400ms across 47 sessions, P95 3800ms
  Suggestion: tighten target to <3000ms
  Reason: current target exceeded by ≥1000ms median; user is consistently fluent below target
```

User reviews, accepts or defers. If accepted, the calibration value in `wiki/oracle-overview.md` is updated and the new threshold takes effect for future sessions.

### Example 3: State-conditioned performance pattern

Monthly trend report surfaces:

```
Pattern detected (last 90 days, 78 sessions):
  GRACE apology-mode hit rate when E≥4: 82%
  GRACE apology-mode hit rate when E≤2: 41%
  Gap: 41 points
  This is the largest state-conditioned gap across all layers/modes.
  Suggestion: GRACE apology workouts should be PULSE-gated to E≥3 sessions until gap closes.
```

This is the kind of cross-layer pattern that no single layer's logs would surface — it requires the unified event schema.

## Integration With Other Layers

| Layer | What METER consumes | What METER produces for that layer |
|---|---|---|
| All encoders | Hit/miss/latency events from review | Per-layer pass/fail status; floor-breach escalations |
| [Red Queen Gym](./red-queen-skill-gym.md) | Workout events (rep, accuracy, latency, stage) | Stage-progression suggestions; calibration hints |
| [lifecycle-manager](./lifecycle-manager.md) | Tier-transition events; thaw events; consolidation accept/reject | Retirement-rate health; thaw-rate signal for criteria tuning |
| [PULSE](./pulse-overview.md) | State-self-report and inference events | Cross-state performance patterns; modulation-effectiveness signal |
| [ORACLE](./oracle-overview.md) | Prediction hit/miss events; observation log entries | Per-mode hit rate; latency target tuning |
| [GRACE](./grace-overview.md) | Read-mode and produce-mode events | Per-mode read/choose accuracy; gradient calibration signal |
| [problem-solving-os](./problem-solving-os.md) | Classification, solution, transfer events | Maturity-level progression; per-archetype performance |
| genius-compass | Per-activity Energy-delta (PULSE), stage-trajectory (drill ladder + automaticity), bandwidth share | Weekly zone-coordinate audit; Excellence Trap / Hidden Genius / Genius erosion threshold breaches |

## Genius Compass events

The genius-compass is a reflective-memory instrument that emits one event per recurring activity per weekly audit. Schema extension on the base event format:

```yaml
layer: measurement
operation: genius-audit
artifact_id: <activity-name>
metric_type: zone-coordinate
metric_value:
  track: <tech-lead|cybersec|neural-os|operational|personal>
  zone: <incompetence|competence|excellence|genius>
  trajectory: <+|0|->
  energy_delta: <signed int>
  leverage: <high|med|low>
  verdict: <protect|promote|cash|diagnose|investigate|cap|drop|delegate>
  bandwidth_pct: <float>
context:
  weeks_in_current_zone: <int>
  threshold_breach: <excellence-trap|hidden-genius|genius-erosion|null>
```

Audit cadence: weekly (Sunday review block). Threshold-breach events route to [problem-solving-os](./problem-solving-os.md) as tradeoff-type problems per [problem-type-classifier](./problem-type-classifier.md). See genius-compass for the eight decision cells, the three named failure modes, and the calibration knobs.

The genius-audit breach events register **Kaizen 3M waste-classes** (Toyota Production System lineage): `genius-erosion-overproduction` is **MURI** (overburden), `excellence-trap` is **MUDA** (waste), and the instrument-side `single-track-bias` event is **MURA** (unevenness). The 3M mapping makes Compass breaches discoverable by the standard process-design vocabulary; full mapping table and the two-sub-type split of *Genius erosion* live on genius-compass. Glossary entries: [glossary](./glossary.md) § External canon citations.

## Reflexive measurement: the `absorption-audit` loop

Everything above measures *learning artifacts* — cards, workouts, predictions. The `absorption-audit` operation turns METER **one level up, onto the wiki's own growth process**. It is the first reflexive METER loop: the measurement layer measuring the system that produces the measured artifacts.

The signal already exists. `tools/wiki_scores.py` emits `wiki/_meta/dashboard-scores.json`, which carries a per-domain **Absorbed-%** = Acquirement ÷ Complexity. Across the whole wiki this currently sits near 11% — knowledge is being *authored* roughly an order of magnitude faster than it is *internalized*. That gap is a loud open loop: it is displayed but nothing acts on it.

`absorption-audit` closes it as a **soft-route** escalation (advisory; the user accepts or defers — never an auto-actuator, per the [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §Observer caution against over-literalizing feedback patterns):

- **Trigger (trend, not level).** An *absolute* Absorbed-% floor degenerates because the entire wiki sits at one low baseline — a fixed threshold fires on every domain or none. Instead the audit fires when a domain is **both** gaining complexity (Δcomplexity > 0, i.e. active authoring) **and** flat-or-falling on Absorbed-% (Δabsorbed% ≤ 0) over an N-refresh window. That targets the actual pathology — authoring outrunning absorption — rather than a uniformly-failed static number.
- **State.** Per-domain prior (complexity, absorbed%) and a consecutive-breach counter persist in `.claude/queue-state.json` (the file that already persists streaks across refreshes).
- **Escalation window.** ≥2 consecutive breaching refreshes before surfacing — the refresh-cadence analog of the ≥3-session floor-breach window used elsewhere on this page.
- **Action sink.** A `⚠` block in `wiki/_meta/queue.md` ("domain X is over-built relative to absorption — drill/recall before authoring") plus an emitted event, both read by `/goal` and the morning queue.

Event schema (extends the base format):

```yaml
layer: measurement
operation: absorption-audit
artifact_id: <domain-key>          # e.g. "2" (Wealth/Money)
metric_type: absorption-rate-breach
metric_value:
  domain: <domain-label>
  d_complexity: <signed float>     # over the window
  d_absorbed_pct: <signed float>
context:
  window_refreshes: <int>
  consecutive: <int>
  absorbed_pct: <float>            # current level, for the report line
```

Run cadence: once per tracker refresh, inside the `tools/wiki_morning_queue.py` orchestrator (03:00 nightly + on-demand `/refresh-tracker`). Registered as a candidate unlock (`wiki_scores × METER → reflexive measurement`) in [composability-index](./composability-index.md); glossary entry under [glossary](./glossary.md) § cross-cutting layers. Validated 2026-06-16 via `/validate-idea` (keep-with-modification: trend-trigger, history persistence, operation registration).

## Calibration Defaults (METER itself)

- **Event emission cadence**: at meaningful operation boundaries only (review-end, sweep-end, workout-rep-end), not sub-operation steps
- **Daily Glance**: produced at session end if any events were emitted in the session
- **Weekly Review**: produced Sunday end-of-day
- **Monthly Trend**: produced last day of month
- **Floor-breach escalation window**: ≥3 consecutive sessions below floor
- **Calibration suggestion window**: ≥30 sessions of evidence required
- **Insufficient-signal threshold**: metrics with N<10 events shown as "insufficient" rather than as numbers
- **Goodhart guard**: every report includes one qualitative prompt ("what felt hard this week?") to surface issues metrics miss
- **Event log retention**: full retention for 12 months; rolled up to weekly summaries thereafter

## Tooling: `tools/meter/` (v0.1.0)

The METER spec is implemented as a Python CLI at [`tools/meter/`](../tools/meter/). Install with `pip install -e tools/meter` and the `meter` console script becomes available. Subcommands:

```
meter pulse checkin           # PULSE state self-report (interactive or via -e/-s)
meter pulse status            # show latest state and current modulation
meter emit ...                # record a single event (layer/operation/metric_type/metric_value/mode/...)
meter report daily            # today's Daily Glance
meter report weekly           # trailing 7-day Weekly Review
meter report monthly          # trailing 30-day Monthly Trend
meter stats [--days N]        # aggregate stats over a window
meter log tail -n N           # last N events as JSONL
meter log since N [filters]   # events from the last N days, with --layer/--mode filters
meter where                   # show data dir and event-log path
```

Storage: append-only JSONL at `<project-root>/meter-data/events.jsonl` by default; override via `METER_DATA_DIR`. Floor-breach escalations fire automatically in Daily Glance when a mode's hit rate is below floor (default: pass-threshold − 15 percentage points). State-conditioned hit-rate breakdowns surface in Weekly Review and Monthly Trend, including state-band gaps ≥20pt that flag PULSE-coupled performance patterns.

The CLI is the foundational primitive. Future tooling (Lifecycle sweep automation, ORACLE auto-generation) writes events through this same JSONL log.

### Anki bridge: `tools/meter-anki-addon/` (v0.1.0)

The Anki add-on at [`tools/meter-anki-addon/`](../tools/meter-anki-addon/) emits events automatically on every card review. It hooks `reviewer_did_show_question` (for latency baseline) and `reviewer_did_answer_card` (writes the event), pulls `mode` from `oracle::*` / `grace::*` tags, and surfaces lifecycle state from `lifecycle::*` tags. The bridge writes the same JSONL schema as the `meter` CLI, so reports include Anki review events alongside manual `meter emit` and `meter pulse checkin` events.

Install: copy the directory into Anki's add-ons folder (Tools → Add-ons → "View Files..."), edit `config.json` to point at your METER `data_dir`, and restart Anki. The add-on is read-only with respect to your collection — it never modifies cards, notes, or decks. Verified end-to-end: 27 logic tests pass; events written by the add-on are read by the `meter` CLI without any conversion; per-mode floor-breach escalations fire correctly.

## Related Pages

- georgian-driving-exam-b-drill-ladder — per-rung METER floors + the 27/30×3 verdict gate (gde-b namespace)
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [pulse-overview](./pulse-overview.md)
- [lifecycle-manager](./lifecycle-manager.md)
- [oracle-overview](./oracle-overview.md)
- [grace-overview](./grace-overview.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [problem-solving-os](./problem-solving-os.md)
- 2026-06-05-single-home-kappa — first applied κ-measurement report: the Single-Home Rule falsifier run on a 20-item sample (κ ≈ 0.41, below floor)
- neural-os-daily-loop
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)
- [web-gym-generation-schema](./web-gym-generation-schema.md)
- genius-compass


---

## U — See (CAST)
1. Measurement layer with unified event schema
2. Append-only event log, pass/fail rules, reports

## D — Name (NEDF)
1. METER = measurement layer
2. Distinguisher: numbers, not vibes
3. Failure mode: progress assessment without measurement

## F — Do (SPEAR)
1. Each session → emit METER events
2. Periodic → read reports → adjust

## B — Watch (HEART)
1. Skipping event emission
2. Ignoring reports

## L — Predict (ORACLE)
1. Event log → predict progress trajectory
2. Pass rate → predict mastery

## R — Act (GRACE)
1. Any work → emit METER event
2. Weak signal → adjust based on report

## Mnemonic

**"Decide · stamp · keep · judge · tell."** M Measure, E Emit, T Track, E Evaluate, R Report — one event's entire life, in order. Nothing here produces learning material; METER only turns what already happened into signal.

## Checksum

1. Name the five functions and what each one does.
2. METER produces no learning material. What does it produce instead, and what is that for?
3. What is Goodhart drift here, and what mitigates it?


## Visual

**One event's whole life**, left to right. Nothing here makes learning material.

```
   define        stamp         keep          judge         tell
  ┌───────┐   ┌───────┐   ┌─────────┐   ┌─────────┐   ┌────────┐
  │   M   │──▶│   E   │──▶│    T    │──▶│    E    │──▶│   R    │
  │measure│   │ emit  │   │  track  │   │evaluate │   │ report │
  └───────┘   └───────┘   └─────────┘   └─────────┘   └────────┘
   units +     every op    append-only    pass-floor    periodic
  thresholds   emits one      log           rules        digest
```

The log is **append-only** — evaluation reads it, never rewrites it.

