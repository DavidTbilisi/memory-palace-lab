---
palace: tactical-memory
level: 4
domain: 10
room: 3
wiki_source: wiki/learning-systems/palace-classification-gym.md
---

# Palace Classification Gym

**Summary**: A pattern-recognition gym that trains the automatic 3-axis classification reflex from [the palace architecture](./memory-palace-architecture-for-neural-os.md) and [Mind Palace - Personal Layout](../raw/05 Meta_Knowledge/Mind Palace - Personal Layout.md). One prompt = one concept; user emits `Palace x Level x Domain?` in ≤12 seconds. Three nested sub-drills (Palace reflex 6s, Level discipline 6s, Domain restraint 4s) collapse into one mixed-mode round at the top. Sister to construct-recognition-gym and algorithm-pattern-gym.

**Sources**: [Mind Palace - Personal Layout](../raw/05 Meta_Knowledge/Mind Palace - Personal Layout.md); [Memory Palace](./memory-palace-architecture-for-neural-os.md); [rubiks-cube-palace](./rubiks-cube-palace.md); construct-recognition-gym; algorithm-pattern-gym; [web-gym-generation-schema](./web-gym-generation-schema.md); [red-queen-skill-gym](./red-queen-skill-gym.md); [oracle-overview](./oracle-overview.md); [meter-overview](./meter-overview.md); [automaticity-and-reflex-training](./automaticity-and-reflex-training.md); [drill-generator](./drill-generator.md); [practice-loop](./practice-loop.md).

**Last updated**: 2026-05-17

---

## Glyph

```p5 height=280
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 280); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const accent = '#5c7a54';
  p.background(p.isDark ? 30 : 245);
  p.noFill(); p.stroke(ink); p.strokeWeight(1.5);
  p.rect(20, 20, p.width - 40, p.height - 40, 6);

  p.noStroke(); p.fill(ink); p.textSize(13); p.textAlign(p.CENTER);
  p.text('12s ⏱', p.width / 2, 42);

  p.textAlign(p.LEFT); p.textSize(13);
  p.text('Concept: "Git rebase"', 36, 72);
  p.text('Palace  :  [Co] [St] [Ta] [Re] [Me] [Bu]', 36, 108);
  p.text('Level   :  [stay 1]  [earn → __]', 36, 140);
  p.text('Domain  :  [skip]  [1..10]', 36, 172);

  p.stroke(ink); p.strokeWeight(1);
  p.line(36, 196, p.width - 36, 196);

  p.noStroke(); p.fill(ink);
  p.text('Why-here: ______________________ (1 line)', 36, 222);

  p.fill(accent); p.textSize(11);
  p.text('One row per axis. Whole gesture is one address.', 36, 252);
};
```

## One-line

> Read a one-line concept, emit `Palace x Level x Domain?` in ≤12 seconds; gym tracks per-axis accuracy, the dominant confusion pair per palace, and the over-promote / over-domain rate.

---

## Concrete example: one round in the gym

```
Concept: "Git rebase"
[12s clock starts]

You pick:
  Palace  = Tactical
  Level   = stay 1
  Domain  = skip

Gym responds:

  ✓ Palace : Tactical                    (correct)
  ✓ Level  : stay 1                      (correct — newly captured)
  ✓ Domain : skip                        (correct — generic operational skill)
  Latency  : 5.8s

  Why this, not its neighbors:
  - vs Strategic   → it's a method, not a durable planning principle
  - vs Buffer      → it's a known, repeatable tool, not "I don't know yet"
  - vs Level 3+    → first capture; promotion comes from real use later

  Today's palace confusion : Tactical ↔ Strategic (3 of last 20 misses)
  Today's over-promote rate: 18%  (target ≤10%)
```

The feedback line *is* the discipline upgrade: every wrong palace adds to the confusion-pair tally; every "earned" call that wasn't earned adds to the over-promote rate; every reflexive domain pick on a generic note adds to the over-domain rate. The gym does not teach the palace system — it measures the *classification reflex* and points back to the page where the rule lives.

---

## The three sub-drills (the gym's axis grid)

The 3 axes of the palace system map onto 3 sub-drills, runnable in isolation (Lamp mode) or fused into one address-emission round (Sword mode).

| Sub-drill | Axis | Buttons | Timer | What it trains |
|---|---|---|---|---|
| **A — Palace reflex** | Horizontal: changeability | 6 (`Co`/`St`/`Ta`/`Re`/`Me`/`Bu`) | 6s | "How changeable is this?" — the only question that picks palace |
| **B — Level discipline** | Vertical: maturity | 2 (`stay 1` / `earn`); if `earn`, name 1 of 5 carriers | 6s | Resists inflation — defaults to 1 unless promotion is earned |
| **C — Domain restraint** | Optional 3rd dim: context | 11 (`skip` + 10 Wheel of Life numbers) | 4s | Resists over-attribution — defaults to `skip` unless retrieval needs it |

Each sub-drill is a single-axis classifier. The fused round (Mixed mode) emits all three for one concept in ≤12s.

### Why three sub-drills, not one

The three axes fail in different ways. Palace failure = the changeability question wasn't asked. Level failure = inflation (ego promotes early). Domain failure = over-attribution (decorating every note with a wing). Bundling them hides which one rotted; isolating them surfaces the broken reflex.

### Why the level button is binary (`stay 1` vs `earn`)

Per the source, every new concept starts at Level 1. The only operational question at capture time is "has this earned more than 1?" — almost always **no** on first capture. The `earn` branch then forces naming one of five carriers (`connectivity` · `dependency` · `reuse` · `explanatory power` · `stability`) per the source's promotion-score table. The 5-option carrier choice is the anti-inflation safeguard: you cannot promote without naming *which* dimension carries the load.

---

## Where this gym sits (2D placement in the training stack)

```p5 height=320
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 320); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const accent = '#5c7a54';
  p.background(p.isDark ? 30 : 245);

  const cx = p.width / 2, cy = p.height / 2 + 10;
  p.stroke(ink); p.strokeWeight(1);
  p.line(50, cy, p.width - 50, cy);
  p.line(cx, 45, cx, p.height - 45);

  p.noStroke(); p.fill(ink); p.textSize(11); p.textAlign(p.CENTER);
  p.text('blocked / one axis at a time', cx, 25);
  p.text('all three axes per round', cx, p.height - 15);
  p.textAlign(p.LEFT);
  p.text('single-axis', 52, cy - 8);
  p.textAlign(p.RIGHT);
  p.text('multi-axis', p.width - 52, cy - 8);

  p.textAlign(p.CENTER); p.fill(accent); p.textSize(12);
  p.text('Lamp', cx - 110, cy - 75);
  p.textSize(10);
  p.text('(one sub-drill)', cx - 110, cy - 60);
  p.fill(ink); p.textSize(12);
  p.text('Stage 3', cx + 110, cy - 75);
  p.textSize(10);
  p.text('(the source page)', cx + 110, cy - 60);

  p.fill(accent); p.textSize(12);
  p.text('Scale', cx - 110, cy + 55);
  p.textSize(10);
  p.text('(mixed across axes)', cx - 110, cy + 70);
  p.fill(ink); p.textSize(12);
  p.text('Sword', cx + 110, cy + 55);
  p.textSize(10);
  p.text('(mixed + decoys +', cx + 110, cy + 70);
  p.text('multi-valid items)', cx + 110, cy + 83);
};
```

**This gym covers the [Lamp / Scale / Sword](./automaticity-and-reflex-training.md) phases**, which align with stages 4–6 of the automaticity ladder in [skill-progression-stages](./skill-progression-stages.md):

- **Lamp** — one sub-drill at a time. 5 reps of Palace only, then Level only, then Domain only. Build each axis cue before fusing.
- **Scale** — mixed: a round randomly fires sub-drill A, B, or C alone. Build per-axis disambiguation under pressure without the cross-axis bundle.
- **Sword** — Mixed-mode: every round emits the full address. Includes multi-valid items (where the same concept legitimately lives in two palaces) and decoys (sounds Strategic, actually Tactical).

Encoding (stage 3) is [Mind Palace - Personal Layout](../raw/05 Meta_Knowledge/Mind Palace - Personal Layout.md) itself. Live capture under real conditions (filing notes as they arrive during the day) is stage 7+ — outside this gym, owned by neural-os-daily-loop.

---

## Pass thresholds (METER integration)

| Metric | Pass | Floor |
|---|---|---|
| Palace classification accuracy | ≥85% | 70% |
| Level discipline (correct `stay 1` vs `earn`) | ≥90% | 80% |
| Domain restraint (correct `skip` vs domain pick) | ≥85% | 70% |
| Address-emission median latency (Mixed mode) | <12s | 18s |
| Per-palace accuracy floor | ≥75% on **each** palace | 60% |
| Over-promote rate (called `earn`, wasn't earned) | ≤10% | ≤20% |
| Over-domain rate (picked a domain on generic notes) | ≤15% | ≤25% |

Two metrics here are unique to this gym:

- **Over-promote rate.** Picks up ego-inflation that pure accuracy hides. A user can have 90% palace accuracy and still inflate every Level call to 7.
- **Over-domain rate.** Picks up decoration habit — adding a wing every time, against the source's "use the third dimension only when retrieval benefits" rule.

Floor breaches surface as red in the daily glance. The fix when a palace falls below floor is almost always re-reading that palace's row in the source's stability gradient (e.g. `Strategic` underwater → re-read "Strategic changes slowly" + the Git-rebase / Systems-thinking contrast examples).

---

## Item shape (one concept, one address)

```yaml
- id: pc-0042
  prompt: "Git rebase"
  correct_palace: Tactical
  acceptable_palaces: [Tactical]    # single-valid
  correct_level: 1
  level_carriers_if_earned: []      # empty = no earn branch valid for fresh capture
  correct_domain: skip
  acceptable_domains: [skip, 1]     # generic; #1 Career also acceptable
  near_miss_reason: |
    Confusable with Strategic because Git can feel "important"; the test is
    whether the note is operational (Tactical) or a durable planning
    principle (Strategic). Importance changes vertical Level, not horizontal Palace.
  multi_valid: false
  tags: [operational, tool, programming]
  difficulty: easy
  latency_target_ms: 8000
```

Required per item:

- **prompt** — one line, the concept name as it would appear in a notes inbox.
- **correct_palace** — primary palace (the home palace per the source).
- **acceptable_palaces** — list including primary + any legitimately-cross-palace homes (the source explicitly allows a domain to span palaces with different stability).
- **correct_level** — almost always `1` for fresh-capture items; gym also runs `promotion-judgment` items where the prompt presents a concept + a usage history + a claimed level.
- **level_carriers_if_earned** — when `earn` is the right answer, which of the 5 carriers must be named.
- **correct_domain** — `skip` or 1 of 10.
- **acceptable_domains** — accepts `skip` plus any legit domain wings if the item is multi-valid.
- **near_miss_reason** — exactly the line the gym shows on miss.
- **multi_valid** — `true` when both palaces or both domain choices are correct (e.g. "spaced repetition" → Meta primary, Tactical acceptable). Multi-valid items score as correct on any acceptable answer but still surface the choice in the post-round explanation.

---

## Boundary set

### What this gym is NOT

- Not a note-taking gym — you never write the note; you only **address** it.
- Not a palace-construction gym — you don't build the palace structure here; that's owned by [Memory Palace](./memory-palace-architecture-for-neural-os.md) and [rubiks-cube-palace](./rubiks-cube-palace.md).
- Not a memory-of-content gym — you classify the *concept*, not recall its definition. Content encoding is owned by NEDF / CAST / SPEAR / HEART.
- Not for inventing new palaces or new shapes — the 6 palaces and 7 shapes are fixed by the source. New domain numbers go through the source's extension protocol, not the gym.
- Not for the cube-internal `(face, cell)` address — that's a deeper drill, queued for a separate gym once palace-classification accuracy stabilizes.

### What breaks the gym

- **Speed without accuracy** (<6s, <60%) — gaming the timer; drop to Lamp.
- **Accuracy without speed** (≥85%, >18s) — deliberation, not reflex; more Scale-mode reps.
- **Importance-based palace picks** — choosing Strategic because the concept "feels important." Decoy items catch this; the source explicitly forbids it.
- **Inflate-by-default level picks** — calling `earn` on first capture. Tracked as over-promote rate.
- **Decorate-by-default domain picks** — picking a domain on every item. Tracked as over-domain rate.
- **Confusing the gym with the source** — gym measures, source encodes. If accuracy is low, re-read the source's stability gradient and the worked examples, not the gym mechanics.

### Adjacent but excluded (deliberate non-features)

- **Sideways movement decisions** ("does this concept need to move from Buffer to Tactical?") — that's a different reflex, queued for a future `palace-movement-gym` once the static classification reflex hits floor.
- **Cube `(face, cell)` placement** — the universal cube convention lives in [rubiks-cube-palace](./rubiks-cube-palace.md); that gym is queued.
- **Wing-anchor tagging** — assigning one of the wing's 6 anchors (e.g. Wealth's Door/Scale/Safe/Chain/Engine/Shield) to a cell. Operates one layer below this gym; not in scope for v1.

---

## One mental motion

> **Read → ask "how changeable?" → tap palace → default Level 1 → default `skip` → emit.** The default-heavy structure is the whole point. Each axis defaults to its safest answer; only override when the override is earned.

If the gesture stalls on the changeability question, re-read the source's stability gradient. If it stalls on the carrier choice (the `earn` branch), the user is reaching for promotion without a real reason — drop to Lamp on Level only.

---

## Failure modes (operational table)

| Failure | What it looks like | Mitigation |
|---|---|---|
| Palace neighbor collision | Confuses `Strategic ↔ Tactical` or `Reflective ↔ Meta` consistently | Re-read the source's two contrasting examples for each pair; rerun Lamp on just that pair |
| Ego inflation | Over-promote rate >20% across sessions | Two weeks Lamp-only on Level with the carrier-naming rule strictly enforced |
| Decoration habit | Over-domain rate >25% — picks a domain on every item | Lamp on Domain only with 80% `skip` items; user learns the default |
| Speed without accuracy | <6s Mixed latency, <60% per-axis accuracy | Drop to Scale; one axis per round |
| Accuracy without speed | ≥85% accuracy, >18s Mixed latency | More Sword reps; goal is reflex |
| Importance bias | High accuracy on operational concepts, low on emotionally-loaded ones | Decoy items that sound deep but are operational (e.g. "discipline" — Tactical, not Strategic) |
| Buffer overflow | Defaults everything to `Buffer` to dodge the question | Buffer is for "I genuinely don't know yet" — gym surfaces this with items that have unambiguous palaces |
| Multi-valid stall | Stalls on items where two palaces fit | The source allows cross-palace; gym accepts either answer; surface the multi-valid tag in post-round explanation |

---

## Relationship to ORACLE

This gym is distributional [ORACLE](./oracle-overview.md) training applied to a 3-class output (Palace × Level-bin × Domain). Per round: given the prompt (Observation), at the cue "classify" (Cue), rank the candidates per axis (Likelihood), pick top per axis (Estimate). The per-palace confusion matrix is the L-slot calibration data over time. The over-promote and over-domain rates are bias signals on the prior — both rates >0 mean the user's prior is shifted away from the source's defaults.

The relationship to construct-recognition-gym is **parallel, not nested** — both are recognition gyms over a fixed-size taxonomy, both are distributional ORACLE instances, both use the same Lamp / Scale / Sword phasing. The differences: construct-recognition is single-axis (12 buttons, one answer); this gym is 3-axis with defaults on two of them.

---

## Multi-resolution zoom

| Size | Representation |
|---|---|
| **Glyph** | 3-row classification panel: Palace / Level / Domain |
| **Line** | "Emit a `Palace x Level x Domain?` address for a one-line concept in ≤12 seconds; track per-axis accuracy and ego-inflation rates." |
| **Paragraph** | A 3-axis classification gym for the [palace system](./memory-palace-architecture-for-neural-os.md). Three sub-drills (Palace 6s / Level 6s / Domain 4s) train each axis in isolation; Mixed mode fuses them into one address-emission round in ≤12s. Tracks per-palace accuracy, over-promote rate, over-domain rate; flags multi-valid items rather than scoring them wrong. Operationally a distributional ORACLE instance covering Lamp / Scale / Sword phases. Drives re-reading of the source's stability gradient when a palace falls below floor. |
| **Page** | This page |

---

## Minimal YAML spec

Compatible with [web-gym-generation-schema](./web-gym-generation-schema.md):

```yaml
meta:
  title: Palace Classification Gym
  version: 1
  author_mode: ai-generated
  target_platform: web
  offline_capable: true

skill:
  name: palace classification
  skill_type: judgment
  gym_mode: recognition
  target_reflex: emit a 3-axis address (Palace, Level, Domain) for any concept in 12 seconds; defaults are Level=1 and Domain=skip
  real_use_case: filing notes from inbox; deciding where a fresh concept belongs in the wiki

training:
  current_stage: lamp
  failure_mode: importance-bias on palace + ego-inflation on level + decoration on domain
  intensity_level: 2
  rise:
    reflex: pick palace by changeability only; default level 1; default skip on domain
    intensity: timed 12s rounds with multi-valid and decoy items
    sparring: neighbor pairs (Strategic ↔ Tactical, Reflective ↔ Meta, Core ↔ Strategic)
    evaluation: per-axis accuracy, per-palace floor, over-promote rate, over-domain rate, latency

session:
  length_minutes: 12
  round_count: 20
  prompt_per_round: 1
  timer_seconds: 12          # Mixed mode; sub-drills use 4-6s
  allow_pause: false
  show_feedback_immediately: true
  show_summary_at_end: true

content:
  item_type: classification
  prompt_shape: one-line concept name
  answer_shape: 3-axis emission (Palace + Level + Domain)
  items: [...]               # see Item shape above
  seed_size_target: 200
  mix:
    synthetic_pct: 70
    mined_from_raw_pct: 30
    multi_valid_pct: 15
    decoy_pct: 20

ui:
  blocks:
    - header
    - goal_panel
    - stage_panel             # Lamp / Scale / Sword
    - timer
    - prompt_card             # one-line concept
    - palace_row              # 6 buttons
    - level_row               # stay-1 / earn → 5 carrier sub-buttons
    - domain_row              # skip + 10 buttons
    - feedback_panel          # per-axis correctness + near-miss reason + confusion pair
    - score_panel             # per-axis accuracy + over-promote + over-domain
    - progress_panel
    - session_summary

logic:
  answer_check: per-axis acceptable-set membership
  latency_start_event: prompt_render
  latency_end_event: address_submit
  scoring_model: per-axis accuracy + latency bonus + inflation penalty
  feedback_model: immediate_with_explanation
  failure_detection: palace_floor_breach OR over_promote_high OR over_domain_high OR slow_latency
  advance_rule: promote if palace_acc >= 0.85 and level_acc >= 0.90 and domain_acc >= 0.85 and over_promote <= 0.10 and over_domain <= 0.15 and median_latency_ms <= 12000
  fallback_rule: fallback if palace_acc < 0.65 for 2 sessions OR over_promote > 0.25 for 2 sessions

metrics:
  palace_accuracy:    { enabled: true, formula: correct_palace / total, target: 0.85 }
  level_accuracy:     { enabled: true, formula: correct_level / total, target: 0.90 }
  domain_accuracy:    { enabled: true, formula: correct_domain / total, target: 0.85 }
  latency:            { enabled: true, formula: median address-emit time in ms, target: 12000 }
  per_palace_floor:   { enabled: true, formula: per-palace accuracy floor, target: 0.75 }
  over_promote_rate:  { enabled: true, formula: false_earn_calls / total, target: 0.10 }
  over_domain_rate:   { enabled: true, formula: false_domain_picks / total, target: 0.15 }
  stability:          { enabled: true, formula: variance of recent round accuracy, target: low }
  recovery:           { enabled: false }
  transfer_proxy:     { enabled: false }

progression:
  promote_when: all six pass thresholds met simultaneously
  hold_when: any single threshold between floor and pass
  fallback_when: any threshold below floor for 2 sessions
  next_stage: scale
  previous_stage: encoding

storage:
  save_local_results: true
  save_best_scores: true
  save_recent_sessions: true
  export_format: json
```

---

## How to run it (once built)

```
1. Open gyms/palace-classification-gym.html in a browser
2. Pick session length: 20 / 40 / 60 concepts
3. Pick mode: Lamp (one axis) / Scale (mixed axes) / Sword (full address)
4. Pick filter: synthetic-only | mined-from-raw | mixed
5. Run; localStorage saves the run
6. Review per-axis accuracy + per-palace floor + over-promote + over-domain at end
7. If a palace is below floor → jump to its row in [Mind Palace - Personal Layout](../raw/05 Meta_Knowledge/Mind Palace - Personal Layout.md)
8. If over-promote is high → Lamp-only on Level for a week
9. If over-domain is high → Lamp-only on Domain for a week with 80% skip items
```

Offline-first; writes nothing to a server.

---

## Build queue

Status: **spec only**. The runtime `gyms/palace-classification-gym.html` is not yet built.

Required before build:

1. Seed deck of ≥200 one-line concept prompts with addresses, 30+ per palace. Source candidates: existing wiki pages (mined for palace-tagged content), the source's worked examples, common daily-life captures (Git commands, money rules, EGW quotes, hobbies, news items).
2. ≥15% multi-valid items + ≥20% decoy items in the seed. Multi-valid surfaces the cross-palace allowance; decoys catch importance-bias.
3. Per-palace neighbor-confusion pair list: `Strategic ↔ Tactical` (importance vs operationality), `Reflective ↔ Meta` (self-interpretation vs learning-architecture), `Core ↔ Strategic` (immutable vs slowly-revisable), `Buffer ↔ Tactical` (unknown vs known-tool).
4. Two-reader agreement test on the seed: drop any single-valid item where two readers disagree on the primary palace; convert it to multi-valid if both palaces are defensible.
5. Sister concept: the per-palace `Why-here` line should be reusable as a one-sentence rationale on the file itself (per the source's classification template), making each gym round double as content for the eventual note.

Target: first runnable Lamp version in ≤ 1 week of build effort once seed deck exists.

---

## Related pages

- [palace-classification-drill-ladder](./palace-classification-drill-ladder.md) — drill-ladder companion (stages 0–7)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md) — the architecture this gym classifies into
- [rubiks-cube-palace](./rubiks-cube-palace.md) — the in-room structure beneath each cell (not classified here)
- construct-recognition-gym — sister gym; same Lamp/Scale/Sword template
- algorithm-pattern-gym — sister gym; the runnable reference build
- [web-gym-generation-schema](./web-gym-generation-schema.md) — the implementation contract
- [red-queen-skill-gym](./red-queen-skill-gym.md) — host gym doctrine
- [oracle-overview](./oracle-overview.md) — the predictive layer this gym is an instance of
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — Lamp / Scale / Sword phases
- [skill-progression-stages](./skill-progression-stages.md) — automaticity ladder this gym covers stages 4–6 of
- [meter-overview](./meter-overview.md) — measurement contract
- [practice-loop](./practice-loop.md) — the single-session micro-cycle this gym runs inside
- [drill-generator](./drill-generator.md) — the system-level pattern this gym instantiates


---

## U — See (CAST)
1. Live gym for palace classification reflex
2. Runtime: gyms/palace-classification-gym.html

## D — Name (NEDF)
1. Palace classification gym = live address-reflex gym
2. Distinguisher: runtime tool, paired with drill ladder
3. Failure mode: running without ladder context

## F — Do (SPEAR)
1. Open gym → emit address per concept
2. Log score + confusion pairs

## B — Watch (HEART)
1. Confusion pair drift
2. Score inflation

## L — Predict (ORACLE)
1. Concept → predict score
2. Confusion → predict targeted drill

## R — Act (GRACE)
1. Reflex prep → run gym
2. Confusion → targeted drill