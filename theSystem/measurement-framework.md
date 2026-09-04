# Measurement Framework — Tracking Progress

You can't improve what you don't measure. This framework gives you
**six independent dimensions of progress** with **milestone belts** on top of
**raw numbers**, read from **METER's event log** plus a **30-second daily check-in**.

Design constraints:
- Daily cost ≤ 30 seconds (so you actually do it)
- Most metrics are passive: Anki reviews and palace walks stream into METER's event log by themselves (Anki bridge, `palace meter backfill`)
- Each dimension has 7 belt-ranks: **White → Yellow → Orange → Green → Blue → Purple → Brown → Black**
- One composite score (LPQ — Learning Performance Quotient) rolls the six up into a single trajectory number

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-measurement-framework) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## Measurement Layer: METER

Since 2026-05 the measurement layer of Neural OS is **METER** ([meter-overview](./meter-overview.md), mirrored at `theSystem/wiki/meter-overview.md`): one event schema, one append-only log (`meter-data/events.jsonl`), three reports (Daily Glance, Weekly Review, Monthly Trend), and the `meter` CLI. This framework no longer keeps a log of its own. It is the **belt rollup** that reads METER's events: METER answers *"what happened?"*, the belts answer *"where am I on the trajectory?"*, and the LPQ stays the single trajectory number.

| This framework used to own | Where it lives now |
|---|---|
| The daily six-number log | METER events. Two kinds of self-report remain (next section); every count arrives passively |
| The weekly Anki pull | The Anki bridge (`tools/meter-anki-addon/`) emits every review as a `hit`/`miss` event plus a `latency_ms` event |
| Palace walk logging | The desktop app's live bridge (Settings › METER bridge) mirrors walk recall, walk start/finish, and node/edge/route creation as they happen; `palace meter backfill` (Memory Palace Lab CLI, `docs/cli.md`) does the same for history |
| "Compute the metrics" | `meter report daily`, `meter report weekly`, `meter report monthly`, and `meter stats --days N` |
| Belt thresholds, belt tests, LPQ | Still here. METER deliberately does not prescribe which metric matters most; that is this framework's job |

---

## The Six Dimensions

| # | Dimension | What it measures | Primary source |
|---|-----------|------------------|----------------|
| 1 | **Speed** | How fast you encode and retrieve | Palace walk time, Anki median response time |
| 2 | **Accuracy** | Hit rate, error rate | Anki correct-first-try %, regeneration pass rate |
| 3 | **Depth** | Complexity you can handle | Max concept depth, formula complexity handled |
| 4 | **Durability** | Long-term retention | Anki mature retention, 30/90-day cold recall |
| 5 | **Application** | Real-world use | Apply-within-48h rate, applications per week |
| 6 | **Process** | Meta-level (system fidelity) | Protocol adherence, missed gates, self-deception catches |

The six are **deliberately independent**. You can be fast but inaccurate,
deep but not durable, accurate but never applying. Each belt advances
independently. The LPQ composite is the geometric mean (so lagging dimensions
hurt more than leading ones help — prevents lopsided progress).

---

## The Daily 30-Second Log

One check-in and at most three one-line emits. Everything else arrives passively.

### The check-in

```
meter pulse checkin -e 4 -s 2      # Energy 1=exhausted..5=fresh, Stress 1=calm..5=overwhelmed
```

That is the old "Energy (1–5)" line, now a PULSE state event, so Weekly Review can split every hit rate by state band.

### The self-reports (only when they happened)

Applied, triaged, and self-deception-caught are things only you can see. Each is one `meter emit`. The metric types are this framework's own: METER leaves `metric_type` open and each layer names its metrics.

```
meter emit -l performance -o produce     -t application          -v 1 --context '{"what":"used the CAST graph in a PR review"}'
meter emit -l governance  -o self-report -t triage               -v 1 --context '{"tool":"confusion-triage"}'
meter emit -l governance  -o self-report -t self-deception-catch -v 1 --context '{"check":"metacognitive-checklist"}'
```

Skip the emits on a day when none happened. Zero is a real number and Weekly Review will show it.

### What arrives on its own

**From Anki (the bridge, every review):** `hit`/`miss` per card, `latency_ms` per card, `mode` from `oracle::`/`grace::` tags, lifecycle tier. Mature-card count and mature retention still come from Anki's own stats screen; the lifecycle sweep (`tools/meter-lifecycle/`) reads the collection for retirement candidates.

**From palace walks (live from the app's Settings › METER bridge, or `palace meter backfill` for history):** `hit`/`miss` per rated locus (Again = miss), `latency_ms` from time-to-reveal, `walk.started` and `walk.completed` per session, all under `mode: palace::walk` with the palace name as `context.topic`.

**From encoding (same backfill):** `palace.node_created`, `palace.edge_created`, `palace.route_created`, `palace.created` on the encoding layer. That is your encodings-per-session count.

---

## Dimension 1 — Speed

Tracks how fast you convert input into encoded scenes and how fast you
retrieve from them.

### Raw metrics

- **Encoding speed (EPH):** encodings produced per hour of focused session
- **Anki median response time (ART):** median seconds per card (from Anki stats)
- **Palace walk time (PWT):** seconds to walk Heuristic Palace core end-to-end
- **Retrieval-under-stress (RUS):** seconds to go from problem symptom → matched heuristic locus

### Milestone belts

| Belt | EPH | ART (sec) | PWT (sec) | RUS (sec) |
|------|-----|-----------|-----------|-----------|
| White  | < 2 | > 15 | > 300 | n/a (can't retrieve) |
| Yellow | 2 | 10–15 | 240–300 | > 10 |
| Orange | 4 | 7–10 | 180–240 | 7–10 |
| Green  | 6 | 5–7 | 120–180 | 5–7 |
| Blue   | 8 | 4–5 | 90–120 | 3–5 |
| Purple | 10 | 3–4 | 75–90 | 2–3 |
| Brown  | 12 | 2.5–3 | 60–75 | 1.5–2 |
| Black  | 15+ | < 2.5 | < 60 | < 1.5 |

**Belt advancement rule:** sustain the threshold for 14 consecutive days (2 weeks).

---

## Dimension 2 — Accuracy

Tracks how often you hit, not just how fast.

### Raw metrics

- **Anki first-try correct % (AFC):** percentage of reviews correct on first attempt
- **Regeneration pass rate (RPR):** % of concepts passing Gate 5 of Comprehension Protocol on first attempt
- **Heuristic match rate (HMR):** % of times the *first* heuristic you tried from Room 3+4 worked
- **False-confidence catch rate (FCC):** rate at which the Metacognitive Checklist flags self-deception (per week)

### Milestone belts

| Belt | AFC | RPR | HMR | FCC/week |
|------|-----|-----|-----|----------|
| White  | < 60% | < 40% | < 20% | 0 (not catching) |
| Yellow | 60–70% | 40–55% | 20–35% | 1 |
| Orange | 70–78% | 55–65% | 35–50% | 2 |
| Green  | 78–84% | 65–75% | 50–60% | 2–3 |
| Blue   | 84–88% | 75–82% | 60–70% | 2–3 (catching habitually) |
| Purple | 88–92% | 82–88% | 70–80% | 2–4 |
| Brown  | 92–95% | 88–92% | 80–88% | 3–4 |
| Black  | 95%+ | 92%+ | 88%+ | 3–5 |

**Note on FCC:** both too low (missing self-deception) and too high (over-meta, seeing phantoms) are bad. Black belt = *calibrated* catching at 3–5/week, not maximum.

---

## Dimension 3 — Depth

Tracks the *complexity ceiling* of what you can handle. Speed and accuracy
at kindergarten material mean nothing; depth is about how hard the material
can be.

### Raw metrics

- **Max concept depth (MCD):** longest chain of prerequisites you can unfold for one concept
- **Max formula complexity (MFC):** most atoms × zones in a formula you can encode in one session
- **Max graph size (MGS):** largest CAST graph you can fully reconstruct a week later
- **Cross-domain transfer rate (CDT):** count of times you successfully transferred a pattern from one domain to another, per month

### Webb's Depth of Knowledge (DOK) — quick ladder

Use alongside raw depth metrics to catch **illusion of mastery** (fast recognition, no transfer):

| Level | What "passing" means |
|-------|----------------------|
| **DOK 1** | Recall terms, steps, core facts |
| **DOK 2** | Explain, compare, classify, organize |
| **DOK 3** | Choose and use under constraints (time, partial info) |
| **DOK 4** | Transfer to artifact, investigation, or new domain |

**Rule:** belts on this dimension should not advance on DOK 1 alone if your stated goal includes on-the-job use — require evidence at DOK 3+ via mini-missions (`navigator.md` **Act** phase).

### Milestone belts

| Belt | MCD | MFC (atoms) | MGS (nodes) | CDT/month |
|------|-----|-------------|-------------|-----------|
| White  | 1–2 | 3 | 3 | 0 |
| Yellow | 3 | 5 | 5 | 0–1 |
| Orange | 4 | 8 | 8 | 1 |
| Green  | 5 | 12 | 12 | 2 |
| Blue   | 6 | 16 | 18 | 3 |
| Purple | 7 | 20 | 25 | 4–5 |
| Brown  | 8 | 25 | 35 | 6–8 |
| Black  | 10+ | 30+ | 50+ | 10+ |

**Belt test:** once a month, attempt a depth challenge at your current +1 level. If you pass, advance.

---

## Dimension 4 — Durability

Tracks long-term retention. Encoding that decays in two weeks is storage, not learning.

### Raw metrics

- **Mature retention (MR):** Anki mature-card retention % (card interval > 21 days)
- **30-day cold recall (30CR):** % of content regenerated correctly 30 days after encoding, no recent review
- **90-day cold recall (90CR):** same, 90 days
- **Decay half-life (DH):** days until half of an encoded batch needs refreshing (derived)

### Milestone belts

| Belt | MR | 30CR | 90CR | DH (days) |
|------|-----|------|------|-----------|
| White  | < 70% | < 40% | < 20% | < 10 |
| Yellow | 70–80% | 40–55% | 20–30% | 10–20 |
| Orange | 80–85% | 55–65% | 30–40% | 20–35 |
| Green  | 85–88% | 65–72% | 40–50% | 35–60 |
| Blue   | 88–91% | 72–78% | 50–58% | 60–90 |
| Purple | 91–93% | 78–82% | 58–65% | 90–150 |
| Brown  | 93–95% | 82–87% | 65–72% | 150–250 |
| Black  | 95%+ | 87%+ | 72%+ | 250+ |

**Note:** Durability is the slowest-moving dimension. Don't expect belt advancement faster than once per 2–3 months.

---

## Dimension 5 — Application

Tracks whether you're *using* what you learn. This is the dimension most
learners ignore and it's the one that decides whether the rest matters.

### Raw metrics

- **Apply-within-48h rate (A48):** % of encoded concepts applied to a real problem within 48h
- **Applications per week (APW):** count of distinct real-world uses
- **Transfer applications (TA):** applications of a concept outside its original domain
- **Production impact (PI):** concrete external outcomes traceable to the learning (subjective but tracked)

### Milestone belts

| Belt | A48 | APW | TA/month | PI (self-rated 0–5) |
|------|-----|-----|----------|----------------------|
| White  | < 20% | < 2 | 0 | 0–1 |
| Yellow | 20–35% | 2–3 | 0–1 | 1 |
| Orange | 35–50% | 3–5 | 1–2 | 1–2 |
| Green  | 50–62% | 5–8 | 2–3 | 2 |
| Blue   | 62–72% | 8–12 | 3–5 | 2–3 |
| Purple | 72–80% | 12–18 | 5–8 | 3 |
| Brown  | 80–87% | 18–25 | 8–12 | 3–4 |
| Black  | 87%+ | 25+ | 12+ | 4–5 |

**Application is the dimension where self-honesty matters most.** "Ran through an example in my head" ≠ application. External feedback must occur.

---

## Dimension 6 — Process Quality

Tracks the meta-level: are you using the system correctly? High object-level
numbers with broken process = brittle and unsustainable.

### Raw metrics

- **Protocol adherence (PA):** % of difficult concepts that passed all 5 Comprehension gates before encoding
- **Missed-gate count (MGC):** times per week you encoded without full protocol
- **Triage usage (TU):** % of confusion events where you used Confusion Triage vs. grinding
- **Palace walk cadence (PWC):** % of scheduled walks completed
- **Weekly meta-review completion (WMR):** 0 or 1 per week (boolean)

### Milestone belts

| Belt | PA | MGC/week | TU | PWC | WMR |
|------|-----|----------|-----|-----|-----|
| White  | < 40% | > 5 | < 20% | < 40% | 0 |
| Yellow | 40–55% | 4–5 | 20–40% | 40–55% | 0–2/month |
| Orange | 55–68% | 2–4 | 40–60% | 55–68% | 2/month |
| Green  | 68–78% | 1–2 | 60–75% | 68–80% | 3/month |
| Blue   | 78–85% | 0–1 | 75–82% | 80–88% | 4/month (weekly) |
| Purple | 85–90% | 0–1 | 82–88% | 88–93% | weekly |
| Brown  | 90–93% | 0 | 88–93% | 93–96% | weekly |
| Black  | 95%+ | 0 | 93%+ | 96%+ | weekly, with pattern detection |

**Process is the leading indicator.** When other dimensions stall, Process
usually slipped 2 weeks earlier.

---

## The Composite Score — LPQ

The **Learning Performance Quotient** (LPQ) rolls the six belts into one
trajectory number. Use for long-term trend tracking; don't obsess daily.

### Formula

Map belts to integers: White=1, Yellow=2, Orange=3, Green=4, Blue=5,
Purple=6, Brown=7, Black=8.

```
LPQ = (Speed × Accuracy × Depth × Durability × Application × Process)^(1/6) × 125
```

Geometric mean × 125 normalizes to roughly 125–1000 (like chess Elo).

### LPQ ranges

| LPQ | Belt equivalent | Characterization |
|-----|-----------------|------------------|
| 125 | All white | Starting out |
| 250 | All yellow | Foundational |
| 375 | All orange | Developing |
| 500 | All green | Competent (median serious learner) |
| 625 | All blue | Proficient |
| 750 | All purple | Advanced |
| 875 | All brown | Expert |
| 1000 | All black | Elite |

Between-belt levels are fine (e.g., LPQ = 580 means you're between Green and Blue on average). Track the **trajectory**, not the absolute number.

### Why geometric mean

- Hides your weakest dimension less than arithmetic mean
- Prevents all-in-on-speed, ignoring-application strategy
- Matches how learning actually fails: one dimension rotten poisons the stack
- A 10% improvement across all six raises LPQ more than a 60% improvement in one

---

## Cadence

### Daily (30 sec)
`meter pulse checkin`, then at most three `meter emit` lines. `meter report daily` if you want the glance; don't linger.

### Weekly (5–10 min)
- `meter report weekly` — hit rates, latency, per-mode and per-state breakdowns, floor breaches
- Anki's stats screen for mature retention, the one number the bridge does not carry
- Compute the 4 primary metrics for each dimension from those two sources
- Check if any belt threshold was crossed (up or down)
- Answer the weekly meta-review questions (from metacognitive-checklist.md)

### Monthly (30–60 min)
- `meter report monthly` — trend, state-conditioned patterns, drift
- **Belt tests** — attempt a challenge at current +1 level for each dimension you feel ready to advance; record each result with one `meter emit`
- 30-day cold recall test: pick 20 random encodings from a month ago, regenerate without notes; record the rate (`-t 30cr`)
- Compute LPQ
- Retrospective: what do the numbers say? Where's the lagging dimension?

### Quarterly (2 hours)
- 90-day cold recall test: 30 random items
- Full dimension audit: is any metric gaming-prone in my current practice? (e.g., easy Anki cards inflating AFC)
- Belt test for everything unpassed
- Reset calibration: are thresholds still appropriate for my level?

---

## Gaming Resistance — Built-In Safeguards

Every metric is gameable. Safeguards:

- **Speed without accuracy is penalized** (geometric mean)
- **Accuracy without depth is penalized** (Depth dimension tracks ceiling, not floor)
- **Depth without durability is penalized** (Durability has long lag, catches ephemeral mastery)
- **Any metric without application is penalized** (Application is a full dimension)
- **FCC (self-deception catches) has optimum, not max** (over-meta is punished)
- **Cold recall tests use random sampling** (can't cherry-pick)

If you find yourself optimizing a single metric at the expense of others,
the LPQ geometric mean will stall. That's the signal.

---

## Where Each Dimension Reads From METER

| Dimension | Already in the event log | Still a self-report or a test you record |
|---|---|---|
| Speed | `latency_ms` review events from the Anki bridge (ART) and from palace walks (per-locus reveal time, the finer-grained successor of PWT); encode events per session (EPH) | RUS |
| Accuracy | `hit`/`miss` review events from Anki (AFC) and palace walks; per-mode hit rates from `oracle::`/`grace::` tags | RPR, HMR, FCC |
| Depth | `palace analyze` gives node counts for MGS candidates | MCD, MFC, CDT, the monthly belt test |
| Durability | Anki's stats screen for MR; the `tools/meter-lifecycle/` sweep flags retirement candidates | 30CR, 90CR cold-recall tests |
| Application | nothing yet | A48, APW, TA, PI via `meter emit -l performance -o produce` |
| Process | `walk.started`/`walk.completed` events (PWC); `meter gate` and `meter encoder` suggest-then-confirm events (`gate_suggestion_override_rate`, `encoder_override_rate`) | PA, MGC, TU, WMR |

Record a test result or a self-report with one `meter emit` on the `measurement` layer, naming the metric by its abbreviation so they list together later:

```
meter emit -l measurement -o self-report -t 30cr -v 0.62 --context '{"sampled":20,"correct":12}'
meter log since 30 --layer measurement
```

The framework reads from the systems you're already running. **You don't
add work — you add measurement over work that's already happening.**

---

## Starting Calibration — Week 1

Don't estimate your starting belts. Measure honestly for 7 days, then set
starting belts from the numbers. Resist the temptation to grade yourself high.

Typical starting state for someone with your current infrastructure:
- Speed: Yellow–Orange (the systems are fast; calibration takes practice)
- Accuracy: Orange–Green (Anki and protocols help here)
- Depth: White–Yellow (you haven't stress-tested yet)
- Durability: Yellow (new encodings haven't aged)
- Application: White–Yellow (the honest blind spot for most learners)
- Process: Yellow–Orange (you understand the system; adherence takes time)

First-month LPQ around 250–400 is normal. Black-belt LPQ in every dimension
takes 3–7 years of deliberate practice — this is not a one-month game.

---

## Red Flags to Watch For

Patterns that indicate something is wrong:

- **All dimensions advancing except Application.** You're learning as a hobby, not a skill. Force application within 48h.
- **Speed advancing, Accuracy stalling.** You're going faster at a lower-quality version of the work. Slow down.
- **Depth jumps, Durability drops.** You're encoding beyond your stable comprehension. Back off the depth; consolidate.
- **Process high, everything else stuck.** You're rule-following without results. The system is a tool, not a ritual.
- **Process low, everything else inflated.** You're gaming metrics without the scaffolding. Numbers will crash soon.
- **LPQ climbing steadily, one belt alone lagging badly.** That belt is about to become your permanent ceiling. Address it now.

---

## Anti-Patterns

- **Measuring without deciding.** Numbers that don't change your behavior are worthless. Every monthly review must produce at least one action.
- **Daily obsessing.** The daily log is 30 seconds. If you're checking dashboards daily, you've crossed into procrastination.
- **Comparing to others.** Belts are relative to *your* trajectory. Someone else's LPQ is meaningless.
- **Re-defining metrics when they stall.** If a metric stalls, improve the underlying skill, don't rewrite the metric.
- **Skipping monthly belt tests.** Without tests, the belts drift and become fake progress.

---

## Key Principles

1. **Six dimensions, independent. No single number captures learning quality.**
2. **Daily log ≤ 30 seconds or it won't happen.**
3. **METER's event log does most of the measuring.** Anki reviews and palace walks stream in by themselves; you add one check-in and a few one-line emits.
4. **Geometric mean prevents lopsided optimization.**
5. **Process is the leading indicator.** When it slips, others follow in 2 weeks.
6. **Application is the dimension most people ignore and it's the one that matters.**
7. **Cold recall beats familiar recall.** Random sampling prevents cherry-picking.
8. **Belts advance on sustained thresholds, not single good days.**
9. **Gaming a metric breaks the composite.** The LPQ punishes specialization.
10. **Measurement without decision is theater.** Every monthly review produces at least one action.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-measurement-framework)**.

