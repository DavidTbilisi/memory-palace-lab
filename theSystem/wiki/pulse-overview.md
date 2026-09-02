---
palace: meta-knowledge
level: 2
domain: 10
room: 5
glyph: 🎚️
wiki_source: wiki/cross-cutting/pulse-overview.md
---

# PULSE

**Summary**: PULSE is the state-aware governance layer for Neural OS. It reads the user's cognitive state (energy and stress) and modulates how every other layer behaves — caps SR session length when tired, switches gym workouts to isolation when stressed, postpones lifecycle sweeps under fatigue, conditions retrieval expectations on state. It closes gap #7 from [missing-encoding-layers](./missing-encoding-layers.md).

**Sources**:
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [lifecycle-manager](./lifecycle-manager.md)
- [oracle-overview](./oracle-overview.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- Design conversation, 2026-05-06

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-07

---

## Why This Layer Exists

The encoders, the gym, the lifecycle manager, and ORACLE all assume the user is operating at a relatively constant baseline. They don't ask whether the user slept four hours last night, whether they just came out of a hard meeting, or whether they're 90 minutes deep into a session and degrading silently. Without that, the system makes the same demands on a fresh Monday morning as on an exhausted Friday evening, and the same retrieval expectations of a card mastered on a great day as one due during a terrible week.

PULSE is the layer that closes that loop. It is structurally different from every other layer in Neural OS: it is not an encoder, not a capture protocol, not a performance gym, not a lifecycle manager. It is a **governor** — it reads runtime signals about the user's state and writes modulation signals to every other layer. Its only artifact contribution is a thin per-card state-history line that lets retrieval expectations be conditioned on the state under which a card was actually mastered.

## The Five Functions

PULSE's name encodes its five responsibilities. Unlike [ORACLE](./oracle-overview.md) where the slot letters are card slots, PULSE's letters are layer functions:

| Function | Job |
|---|---|
| **P**erceive | Read state signals — explicit self-report at session start, plus latency / accuracy drift inferred during the session |
| **U**pdate | Integrate new signals into a running state model; decay old signals over time |
| **L**imit | Apply caps when state is low (cap session length, block new high-load material, halt lifecycle promotions) |
| **S**teer | Actively redirect ongoing behavior (switch gym workout type, prefer familiar material in ORACLE, suppress hard cards) |
| **E**xpect | Condition retrieval expectations on state-history per card (this card has only ever been mastered under E≥4 — don't expect it to perform under E:2) |

Limit and Steer are both modulation, but they differ in shape: Limit *removes* options (you can't do X right now); Steer *redirects* (you'll do X instead of Y). Both fire from the same state model.

## Position In The Architecture

PULSE sits cross-cutting alongside [UMTF](./universal-mental-tagging-framework.md), but with a different cross-cutting role: UMTF provides shared *vocabulary* across all layers; PULSE provides shared *governance* across all layers.

| Layer | Members | Role |
|---|---|---|
| Capture / scoping | [RAPID](./rapid-in-neural-os.md), [BRIDGE LOAD](./bridge-load.md), [ORIENT](./orient-method.md), [Semantic Input](./semantic-input-cheat-sheet.md) | Decide what gets encoded |
| Encoding | [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md) | Produce durable artifacts |
| Performance | [Red Queen Gym](./red-queen-skill-gym.md), [Drill Generator](./drill-generator.md), [Automaticity](./automaticity-and-reflex-training.md) | Turn correctness into reflex |
| Lifecycle | [Lifecycle Manager](./lifecycle-manager.md) | Retire and consolidate |
| Cross-cutting (taxonomy) | [UMTF](./universal-mental-tagging-framework.md) | Shared tag vocabulary |
| **Cross-cutting (governance)** | **PULSE (this page)** | **State-conditioned modulation of all other layers** |

## The State Model

PULSE models state on **two axes**, each scored 1-5 (RPE-style self-report).

### Energy axis (E)

| E | Self-report |
|---|---|
| 1 | Exhausted; cannot focus |
| 2 | Tired; effort feels heavy |
| 3 | Average; functional but unremarkable |
| 4 | Good; sharp and engaged |
| 5 | Fresh; peak capacity |

### Stress axis (S)

| S | Self-report |
|---|---|
| 1 | Calm; spacious |
| 2 | Settled; light load |
| 3 | Average; some pressure |
| 4 | Pressured; agitated |
| 5 | Overwhelmed; reactive |

The two axes are separate because they modulate differently. **Low energy** says "easier work, smaller volume." **High stress** says "more familiar work, less novelty." A fatigued-but-calm state (E:2 S:2) calls for short sessions of well-mastered material. A fresh-but-stressed state (E:4 S:4) calls for normal volume but no new high-load encoding.

## State Signals

PULSE reads state from two sources:

### 1. Self-report (baseline)

A two-question prompt fires at the start of each session:

```
Energy (1-5): _
Stress (1-5): _
```

Two keystrokes. The current values are stored in `wiki/pulse-state-log.md` as the session baseline.

### 2. Performance inference (drift detection)

During a session, PULSE tracks two rolling metrics:

- **Latency drift** — moving average of response latency vs. session baseline. If drift exceeds +30% sustained, energy is decremented by 1.
- **Miss-rate spike** — sliding window of accuracy. If miss-rate jumps from baseline to elevated, stress is incremented by 1.

Inferred adjustments are logged separately from self-report so disagreement between the two becomes visible over time. Persistent disagreement (e.g., user always reports E:5 but latency suggests E:3) flags a self-report calibration issue.

### State log format

`wiki/pulse-state-log.md` is append-only:

```
2026-05-08 09:00 | session-start | E:4 S:2 | self-report
2026-05-08 09:35 | inference | E:3 S:2 | latency-drift +34%
2026-05-08 10:15 | session-end | E:3 S:3 | inference
2026-05-09 09:00 | session-start | E:5 S:1 | self-report
```

State decays after 4 hours without an update — if the user logged 9am state and is still working at 2pm without a refresh, the model auto-degrades by 1 on each axis (capped at 3, the average). This prevents stale baselines from gating modulation incorrectly.

## What Gets Modulated

Six layers read PULSE state and adjust behavior. Each table row is the contract.

| Layer | Low E (≤2) | High S (≥4) |
|---|---|---|
| **SR scheduler (Anki)** | Cap session at 30 cards; defer cards with lapse-count ≥3 | Skip new cards; review only mature cards |
| **Red Queen Gym** | Switch mixed-mode workouts to single-mode isolation; reduce volume by 50%; skip [RISE](./red-queen-skill-gym.md) workouts | Avoid time-pressure workouts; switch to format-only drills |
| **Lifecycle sweeps** | Postpone all promotions (Cold→Archive, Archive→Drop). Decision quality matters — never retire under fatigue | Same — postpone |
| **Capture quality** | Tag captures with `state_at_capture: low_energy`; schedule a 48h follow-up review prompt for accuracy | Tag with `state_at_capture: high_stress`; same follow-up |
| **ORACLE workouts** | Skip distributional and anomaly modes (high cognitive load); favor sequential and conditional | Prefer familiar material; suppress auto-generated drafts |
| **Onboarding / new material** | Block introduction of new high-load material; defer to next session | Same — block |

Modulation only fires when state crosses the threshold (E≤2 or S≥4). Moderate state (E:3, S:3) behaves like baseline — no modulation. This prevents over-governance from blocking momentum on average days.

## State-History On Cards

Each card carries a `state_history` field with the last 10 review entries plus the capture entry:

```
state_history:
  capture: 2026-04-30 E5/S1
  reviews:
    - 2026-05-08 E4/S2 hit
    - 2026-05-09 E2/S4 miss
    - 2026-05-12 E5/S1 hit
    - 2026-05-15 E3/S3 hit
    - 2026-05-19 E4/S2 hit
```

PULSE reads this trail to compute **state-conditioned mastery claims**:

- "Card has 5 successful reviews, all under E≥4 — never tested under low energy."
- "Card has hit/miss pattern correlating with stress — likely encoding-stress coupling."
- "Card was captured under E:1 S:5 — flag for capture-quality review."

When a card is due for review under low state, the gym surfaces a one-line warning if the card has never been mastered under similar conditions: *"This card has never been recalled successfully under E:2. Expect a miss; this is calibration data, not failure."*

The history list caps at 10 entries because the marginal value of older entries is low and bloat compounds over hundreds of cards. Older entries are summarized into a `state_history_summary` line: *"7 hits / 2 misses, all hits under E≥3."*

## State Check Granularity

| When | What fires |
|---|---|
| Session start | Two-keystroke self-report (E and S, 1-5 each) |
| Continuously during session | Latency-drift and miss-rate-spike inference; state model updated live |
| Session end | Final state estimate logged; used to set tomorrow's expected baseline |
| 4 hours since last update | Auto-decay toward 3 on both axes if no refresh |
| Daily | Optional morning check-in (bound to `tm pulse checkin` command); persists baseline across sessions |

The session-start prompt is the load-bearing input. Continuous inference is the silent-slide catcher. Daily check-in is optional polish for users who want chronic-state tracking.

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Self-report dishonesty** | User always reports E:5 regardless of actual state — modulations never fire when needed | Cross-check inferred state vs. reported state; persistent disagreement (≥7 of last 10 sessions) flags a calibration prompt |
| **Over-modulation** | PULSE defers, blocks, or caps everything at moderate state — user makes no progress | Modulation only fires below thresholds (E≤2 or S≥4); E:3/S:3 behaves like baseline |
| **Stale state** | User logged at 9am, working at 6pm without update — model assumes 9am state still applies | Auto-decay toward 3 on each axis after 4 hours without refresh |
| **Single-bad-day pollution** | One terrible session halts lifecycle and onboarding for days | State model uses moving average over recent sessions, not single sample |
| **State-history bloat** | Every card carries a 10-entry log — wiki bloat at scale | Cap at 10 entries; older summarized into one line; state_history can also live in a separate index file referenced by card-id, not embedded, if scale demands |
| **Inferred-only modulation** | User skips self-report; system relies entirely on inference; can't tell if low latency means tired or just thinking | Self-report is required to start a session; skip results in baseline E:3/S:3 |
| **Cross-layer modulation conflict** | SR says "review this hard card now"; PULSE says "skip hard cards under low state" — which wins? | PULSE wins on Limit operations; SR's scheduler still owns Steer (interval, ordering) |
| **State-conditioning becomes excuse** | User reads "this card has never been mastered under low E" as permission to skip rather than calibration data | Warning is informational only; the card still appears for review. Skipping it is a separate manual decision |

## What This Layer Does Not Do

PULSE explicitly does **not**:

- encode new material (no artifacts beyond the state-history line on existing cards)
- replace medical advice, fitness tracking, or sleep coaching (it observes self-reported state, doesn't diagnose)
- model long-term burnout or chronic state issues (it tracks moving averages, not multi-month trends)
- modify Anki's interval scheduler (PULSE skips or defers cards but doesn't reschedule them — Anki's scheduler still owns intervals)
- enforce sleep, rest, or breaks (it observes; it doesn't prescribe)
- replace user judgment when state model and felt experience disagree (the user always wins on conflict — modulations are defaults, not laws)
- collect biometric data (HRV, sleep tracking, etc. are deferred indefinitely; self-report + performance inference is the v1 contract)

It only owns: reading state, modulating other layers' behavior based on state, and conditioning retrieval expectations on per-card state-history.

## Worked Examples

### Example 1: Low-energy morning

User reports `E:2 S:2` at session start. PULSE Limit fires:

- SR scheduler caps session at 30 cards
- High-lapse-count cards deferred to next session
- Red Queen Gym switches today's mixed-mode ORACLE workout to single-mode sequential-only isolation
- Lifecycle sweep (was scheduled for this morning) postponed until next session at E≥3
- New ORACLE face generation blocked
- Captures during this session get tagged `state_at_capture: low_energy` with 48h follow-up

User completes 22 cards in 18 minutes, ends at `E:2 S:2`. Tomorrow's expected baseline = E:3 (mean reversion).

### Example 2: High-stress workday

User reports `E:4 S:5` at session start. PULSE Steer fires:

- SR scheduler skips new cards; only mature reviews
- Gym switches from time-pressure workout to format-only drill
- ORACLE prefers sequential and conditional modes; auto-generated drafts suppressed
- New high-load material blocked from introduction
- Lifecycle sweep postponed

User reviews 40 mature cards comfortably, ends at `E:4 S:3`. Stress-axis decline confirms the modulation worked — familiar material was the right call.

### Example 3: State-conditioned retrieval warning

A card is due. Its state_history shows 5 hits under E≥4, 0 reviews under E≤2. User is in session at E:2. Card surfaces with a one-line warning:

```
[This card: 5/5 hits under E≥4, never tested under E≤2. Expect miss as calibration.]
```

User attempts the card. Misses. The miss is logged to state_history as `2026-05-20 E2/S2 miss`. Next time this card is due under low E, the same warning fires — but now backed by 1 actual miss, sharpening the calibration claim. Over time, the system learns whether the card's mastery is truly state-coupled or just under-tested.

### Example 4: Mid-session drift

User starts at `E:5 S:1` — fresh. By minute 35, latency moving average is +42% over baseline and miss-rate has doubled. PULSE Update fires: inferred state shifts to `E:3 S:1`. Limit kicks in:

- Session is auto-capped at the next 5 cards
- A prompt fires: *"Latency drift detected. Continue, or end session?"*
- User chooses end. Session-end log records `E:3 S:1 | inference | latency-drift +42%`.

Next session, PULSE compares: user self-reported E:5 at start but inference said E:3 by minute 35. If this pattern repeats over multiple sessions, a calibration prompt suggests recalibrating self-report.

## Calibration Defaults

Defaults set; tune via [METER](./meter-overview.md) when self-report-vs-inference disagreement persists or modulation effectiveness drifts.

| Knob | Default | Tunable when |
|---|---|---|
| Latency drift threshold for inferred E decrement | +30% over session baseline | Persistent over- or under-firing |
| Miss-rate spike threshold for inferred S increment | Doubled-from-baseline | Same |
| State decay rate (no update >4 hours) | -1 per axis, floor 3 | If late-day modulation feels stale or premature |
| Self-report-vs-inference disagreement | ≥7 of last 10 sessions triggers calibration prompt | Tighten if user is well-calibrated; loosen if noisy |
| State-history retention depth (per card) | Last 10 reviews + capture entry | Per-palace override possible |
| Modulation threshold (low energy) | E≤2 fires Limit | Adjust if dead-zone too narrow / wide |
| Modulation threshold (high stress) | S≥4 fires Steer | Same |
| Volume reduction under low state | 50% gym volume; SR cap 30 cards | Tune if reduced volume still pushes user past floor |
| Daily check-in cadence | Optional morning prompt; required at session start | Hard rule on session-start |

## Integration With METER

PULSE is one of METER's primary data sources (state events) AND one of METER's primary clients (state-conditioned reports). Every state-self-report and inferred-state event is a METER event; every report breaks down performance by state range. Modulation effectiveness — does low-state modulation actually preserve performance? — is itself a METER metric (target: performance under modulated state ≥80% of unmodulated baseline). Floor breach triggers a "modulation isn't working" escalation.

## Stress-side diagnostic — F·A·I·L·U·R·E. scan (added 2026-05-24 from Psycho-Cybernetics ingest)

PULSE's Stress reading detects *that* something is wrong but does not name *what*. The [F·A·I·L·U·R·E. signals](./failure-mechanism.md) from Maxwell Maltz's *Psycho-Cybernetics* (1960) supply the missing diagnostic — a 7-letter scan that names the *type* of failure-mode currently active.

**Trigger**: PULSE Stress reading S ≥ 4, OR three+ failed pass-floor attempts in one session, OR snap-back fired (see [snap-back-effect](./snap-back-effect.md)).

**Scan** (target <60 s, METER pass-floor):

1. Quiet sit, eyes closed
2. Recite the 7 letters: F · A · I · L · U · R · E.
3. For each letter, ask: "is this firing for me right now?" Mark yes / no
4. The yes-marks identify the failure-mode signature

**The 7 letters** (full definitions in [failure-mechanism](./failure-mechanism.md)):

| Letter | Signal | PULSE response |
|---|---|---|
| **F**rustration | Action pursues mis-conceived target | Re-AIM the target before continuing |
| **A**ggressiveness misdirected | Energy diverted away from goal | Re-route energy to actual goal; defer drill |
| **I**nsecurity | Self-image rejecting work-order | Defer drill; route to [theater-of-the-mind](./theater-of-the-mind.md) |
| **L**oneliness | Hostile field — Charity-trait failure | Restore via unilateral connection; defer high-stakes |
| **U**ncertainty | AIM letter missing | Pick imperfect target; act |
| **R**esentment | Externalised agency | Reclaim authorship; drop case against world |
| **E**mptiness | No live target; system idling | Supply target — even a small one |

### PULSE × F·A·I·L·U·R·E. routing

The combined diagnostic decides between PULSE's existing modulations:

| Signature | PULSE action |
|---|---|
| Single letter firing | Apply matching fix; resume with reduced demand (Limit by 30%) |
| 2–3 letters firing | Defer pressure-drills; switch to blocked single-mode; run mini-Theater session if Insecurity or [snap-back](./snap-back-effect.md) history present |
| 4+ letters firing persistent | Halt session; route to recovery; if persistent across multiple sessions (especially Emptiness + Loneliness + Resentment), professional support — not a wiki-protocol problem |

This converts PULSE from "something is wrong" to "*X* is wrong, here's the fix." The composition is registered in [composability-index](./composability-index.md) as a candidate unlock.

## Sleep state + substance modifiers (added 2026-05-24, sleep ingest)

The 2026-05-24 sleep ingest (walker-why-we-sleep + jacobs-say-goodnight-to-insomnia) promotes sleep state from a background variable to a **first-class PULSE input**, and registers a substance-modifier table for the state-modulation logic.

### Sleep state as a primary PULSE signal

Sleep loss specifically:
- ↓ prefrontal cortex (rational control) by measurable margins
- ↑ amygdala reactivity by ~60% (Walker p. 30)
- Disables [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md) for the prior day's encoding (40% deficit per Walker p. 666)
- Compounds glymphatic-clearance debt (glymphatic-system)

Operational rule: **if total sleep last night < 6h**, downgrade Energy and upgrade Stress thresholds *automatically* in the daily-loop check. Cancel encoding work; switch to recall-only / maintenance mode. Walker-dose-response from sleep-architecture says 6h × 10 days = 24h-deprivation equivalent — chronic moderate restriction is *invisible* to subjective fatigue assessment but produces real cognitive decay. PULSE has to catch what the user can't feel.

### Substance modifier table

| Substance | PULSE-relevant effect | Rebound cost | Timing guidance |
|---|---|---|---|
| **Caffeine** | Masks Process S (adenosine block); does NOT add energy | Adenosine crash at clearance; sleep-onset delay if late | Cutoff after ~13:00; half-life 5–7h |
| **Alcohol** | Sedates onset; **fragments REM**; suppresses deep NREM | Hidden — wake "rested" but skipped consolidation | Avoid within 4h of bed; ideally none |
| **Nicotine** | Stimulant; worsens maintenance insomnia | Withdrawal-driven awakenings | Avoid evening; avoid near bed |
| **Cannabis (THC)** | **Suppresses REM**; tolerance develops | **REM rebound** on cessation: ~2 weeks of vivid often-disturbing dreams | Recognise cost; flag in PULSE state |
| **Benzodiazepines** | Suppress deep NREM; tolerance 4–6 weeks | Rebound insomnia (often worse than baseline); psych dependence | Only acute / situational per cbt-i-program §Pills |
| **SSRIs / SNRIs** | Suppress REM; dampen recall + lucid potential | Months-long shift | Medical decision; flag the effect |
| **Melatonin** | Timer signal, not sleep-producer | None at low dose; supraphysiological doses → grogginess | Use for timing-shift (jet lag) only |

The full table is mirrored in sleep-hygiene-protocol §Substance reference. PULSE's job is to **read substance-load into the state model** (e.g., "last 24h: alcohol + late caffeine → expect compressed REM tonight → tomorrow's procedural-skill ceiling is lowered → don't schedule novel motor drilling").

### Cross-link

- sleep-architecture — biology behind the rules
- circadian-rhythm-and-chronotypes — chronotype as a long-running PULSE constraint (forcing an owl to a lark schedule = chronic high-stress / low-energy input)
- [the-8-hour-myth-tension](./the-8-hour-myth-tension.md) — population-routing for dosage thresholds

## Related Pages

- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)
- [lifecycle-manager](./lifecycle-manager.md)
- [oracle-overview](./oracle-overview.md)
- [grace-overview](./grace-overview.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [meter-overview](./meter-overview.md)
- neural-os-daily-loop
- [problem-solving-os](./problem-solving-os.md)
- [failure-mechanism](./failure-mechanism.md) — Stress-side diagnostic added 2026-05-24
- [psycho-cybernetics-maltz](./psycho-cybernetics-maltz.md) — source for the F·A·I·L·U·R·E. layer
- [snap-back-effect](./snap-back-effect.md) — fires when PULSE doesn't catch the build-up early
- sleep-and-cognition — sleep ingest topic spine (added 2026-05-24)
- sleep-architecture — biological substrate (PULSE reads sleep state)
- sleep-hygiene-protocol — substance-modifier source table
- circadian-rhythm-and-chronotypes — chronotype as a long-running constraint
- [the-8-hour-myth-tension](./the-8-hour-myth-tension.md) — population-routing for dosage


---

## U — See (CAST)
1. State-aware governance layer
2. Reads energy + stress → modulates all layers

## D — Name (NEDF)
1. PULSE = state-aware governor
2. Distinguisher: modulates other layers based on user state
3. Failure mode: fixed-cadence work ignoring state

## F — Do (SPEAR)
1. Daily → tag energy + stress
2. PULSE adjusts cadence accordingly

## B — Watch (HEART)
1. Skipping state check
2. Pushing through low-state

## L — Predict (ORACLE)
1. Low state → predict reduced session length
2. High stress → predict isolation drills

## R — Act (GRACE)
1. Start session → check PULSE
2. State change → re-route work

## Mnemonic

**"Read the room · hold a running read · cap it · bend it · plan for it."** P Perceive, U Update, L Limit, S Steer, E Expect. Every verb acts on *another layer* — PULSE makes nothing of its own, it only changes how hard the rest of the system pushes.

## Checksum

1. Name the five functions.
2. Name two things PULSE modulates when state reads low.
3. What does self-report dishonesty look like, and how is the reported state cross-checked?


## Visual

**A loop, not a line** — PULSE never finishes, it keeps a running read and bends the other layers with it.

```
              ┌──────────────────────────────┐
              ▼                              │
         ┌─────────┐                    ┌─────────┐
         │    P    │  perceive          │    E    │  expect
         │ signals │                    │ ahead   │
         └────┬────┘                    └────▲────┘
              │                              │
         ┌────▼────┐    ┌─────────┐    ┌─────┴───┐
         │    U    │───▶│    L    │───▶│    S    │
         │ update  │    │  limit  │    │  steer  │
         └─────────┘    └─────────┘    └─────────┘
            running        caps on        route to
             model         volume        easier work
```

Every box acts on **another layer**. PULSE produces nothing of its own.

