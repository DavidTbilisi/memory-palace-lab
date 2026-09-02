---
palace: meta-knowledge
level: 6
domain: 10
room: 8
wiki_source: wiki/meta-wiki/web-gym-generation-schema.md
---

# Web Gym Generation Schema

**Summary**: A generation contract for turning a Red Queen skill-gym design into a concrete web app. It tells AI what inputs to expect, what UI blocks to render, what runtime behavior to implement, and what metrics to track in `HTML`, `CSS`, `JS`, or similar frontend stacks.

**Sources**:
- red-queen-skill-gym.md
- drill-generator.md
- drill-ladder-patterns.md
- raw/Neural OS Book/Intensity.md
- raw/Neural OS Book/Isolation.md
- raw/Neural OS Book/Measurements.md
- User request in chat for AI-written web gyms, 2026-05-05

**Last updated**: 2026-07-09 — added [visualization-gym](./visualization-gym.md) as the 2nd runnable instance

---

## Purpose

`Red Queen Skill Gym` defines the training logic.

This page defines the **implementation contract** for AI that must generate a real gym interface.

That means the layers are:

- [red-queen-skill-gym](./red-queen-skill-gym.md) = pedagogy
- this schema = app-generation contract
- `HTML/CSS/JS` app = rendered gym

Without this contract, AI tends to produce attractive but underspecified training UIs. The point here is to force the generated app to preserve the reflex target, overload logic, scoring logic, and feedback loop rather than collapsing into a generic quiz. (source: red-queen-skill-gym.md; drill-generator.md)

## Core Rule

A web gym is not just a content viewer.

It must implement:

- one target reflex
- one gym mode
- one session loop
- one scoring model
- one progression rule
- one feedback model

If any of those are missing, the app is display-only, not a gym.

## Minimum Generation Contract

Every AI-generated web gym should be buildable from one spec object with these top-level sections:

```yaml
meta:
skill:
training:
session:
content:
ui:
logic:
metrics:
progression:
storage:
```

That is the minimum surface area needed to reliably generate a working frontend.

## Section Definitions

### `meta`

Defines app identity and rendering constraints.

Required fields:

- `title`
- `version`
- `author_mode`
- `target_platform`
- `offline_capable`

Example:

```yaml
meta:
  title: DP Recognition Gym
  version: 1
  author_mode: ai-generated
  target_platform: web
  offline_capable: true
```

### `skill`

Defines what is being trained.

Required fields:

- `name`
- `skill_type`
- `gym_mode`
- `target_reflex`
- `real_use_case`

The most important field is `target_reflex`. If that field is vague, the generated app will be vague.

### `training`

Defines the pedagogical layer inherited from [red-queen-skill-gym](./red-queen-skill-gym.md).

Required fields:

- `rise.reflex`
- `rise.intensity`
- `rise.sparring`
- `rise.evaluation`
- `current_stage`
- `failure_mode`
- `intensity_level`

This block tells AI what kind of session pressure to simulate.

### `session`

Defines one run of the gym.

Required fields:

- `length_minutes`
- `round_count`
- `prompt_per_round`
- `timer_seconds`
- `allow_pause`
- `show_feedback_immediately`
- `show_summary_at_end`

This prevents AI from inventing arbitrary session behavior.

### `content`

Defines the actual training items.

Required fields:

- `item_type`
- `prompt_shape`
- `answer_shape`
- `items`

Each item should minimally declare:

- `id`
- `prompt`
- `correct_answer`
- `explanation`
- `tags`
- `difficulty`

Optional fields:

- `near_miss_reason`
- `latency_target_ms`
- `branch_family`
- `hint`

### `ui`

Defines which visible blocks the app must render.

Recommended blocks:

- `header`
- `goal_panel`
- `stage_panel`
- `timer`
- `prompt_card`
- `answer_input`
- `submit_button`
- `feedback_panel`
- `score_panel`
- `progress_panel`
- `session_summary`

This is where the spec crosses from pedagogy into concrete frontend layout.

### `logic`

Defines behavior the app must implement.

Required fields:

- `answer_check`
- `latency_start_event`
- `latency_end_event`
- `scoring_model`
- `feedback_model`
- `failure_detection`
- `advance_rule`
- `fallback_rule`

This section matters because the gym is not just UI. It is UI plus runtime rules.

### `metrics`

Defines what the app measures.

Required fields:

- `accuracy`
- `latency`
- `branch_quality`
- `stability`
- `recovery`
- `transfer_proxy`

Recommended per metric:

- `enabled`
- `formula`
- `display_name`
- `target`

### `progression`

Defines how the app changes difficulty over time.

Required fields:

- `promote_when`
- `hold_when`
- `fallback_when`
- `next_stage`
- `previous_stage`

Without this, the app cannot act like a gym. It can only replay a fixed set.

### `storage`

Defines persistence.

Recommended fields:

- `save_local_results`
- `save_best_scores`
- `save_recent_sessions`
- `export_format`

For a static `HTML/CSS/JS` app, default to `localStorage`.

## Minimum UI Contract For AI

When generating a web gym, AI should render at least these visible zones:

1. `goal panel` - what reflex is being trained
2. `prompt panel` - the current rep
3. `response panel` - input or selection surface
4. `feedback panel` - correct, wrong, why, and repair cue
5. `metrics panel` - score, latency, streak, branch errors
6. `progress panel` - round count, stage, intensity level
7. `summary panel` - end-of-session diagnosis

If the generated app lacks these zones, it is usually missing either the gym purpose or the feedback loop.

## Generation Rules For AI

When AI receives a web-gym spec, it should follow these rules:

1. Treat `target_reflex` as the central design constraint.
2. Render only the UI needed for the declared `gym_mode`.
3. Use the declared `timer_seconds` and `latency_target_ms` rather than inventing defaults.
4. Separate `feedback_panel` from `summary_panel`.
5. Implement `advance_rule` and `fallback_rule` as actual runtime conditions.
6. Preserve the stage and intensity labels visibly in the UI.
7. Prefer local-first persistence unless the spec explicitly asks for backend storage.

## Gym Mode To UI Mapping

Different gym modes need different controls.

| Gym mode | Main UI emphasis |
|---|---|
| `recognition` | prompt card, rapid answer buttons, latency display |
| `execution` | workspace, step input, branch feedback, repair cues |
| `retrieval` | cue card, hidden-answer delay, recall timing, confidence input |
| `stress` | timer, interruption events, noisy variants, recovery tracking |

This keeps the generated app matched to the training problem instead of using one template for all skills.

## Prompt Contract For AI

If you want AI to generate a gym directly, the safest prompt shape is:

```text
Build a single-file web gym in HTML/CSS/JS from the attached YAML spec.

Rules:
- Treat the YAML as the source of truth.
- Implement all required UI blocks from ui.blocks.
- Implement scoring, latency, and progression from logic and metrics.
- Keep data local in browser storage unless the spec says otherwise.
- Do not invent new pedagogy; only implement the declared gym behavior.
- Output runnable code.
```

This sharply reduces drift.

## Minimal YAML Example

```yaml
meta:
  title: DP Recognition Gym
  version: 1
  author_mode: ai-generated
  target_platform: web
  offline_capable: true

skill:
  name: dynamic programming pattern recognition
  skill_type: judgment
  gym_mode: recognition
  target_reflex: recognize overlapping subproblems and likely state design within 3 seconds
  real_use_case: algorithm interviews and contest problem triage

training:
  current_stage: 4
  failure_mode: confuses neighbors
  intensity_level: 3
  rise:
    reflex: classify the problem shape immediately
    intensity: timed mixed prompts
    sparring: near-miss graph, greedy, and brute-force contrasts
    evaluation: latency plus classification accuracy

session:
  length_minutes: 15
  round_count: 20
  prompt_per_round: 1
  timer_seconds: 8
  allow_pause: true
  show_feedback_immediately: true
  show_summary_at_end: true

content:
  item_type: classification
  prompt_shape: short problem statement
  answer_shape: multiple choice
  items:
    - id: dp-01
      prompt: Count ways to reach step n using jumps of 1 or 2.
      correct_answer: dynamic programming
      explanation: repeated subproblems and reusable recurrence
      tags: [dp, recurrence]
      difficulty: easy
      latency_target_ms: 3000

ui:
  blocks:
    - header
    - goal_panel
    - timer
    - prompt_card
    - answer_input
    - feedback_panel
    - score_panel
    - progress_panel
    - session_summary

logic:
  answer_check: exact match
  latency_start_event: prompt_render
  latency_end_event: answer_submit
  scoring_model: accuracy_plus_latency_bonus
  feedback_model: immediate_with_explanation
  failure_detection: neighbor_confusion_and_slow_latency
  advance_rule: promote if accuracy >= 0.85 and median_latency_ms <= 3000
  fallback_rule: fallback if accuracy < 0.65 for 2 sessions

metrics:
  accuracy:
    enabled: true
    formula: correct / total
    target: 0.85
  latency:
    enabled: true
    formula: median response time in ms
    target: 3000
  branch_quality:
    enabled: false
    formula: not_used
    target: null
  stability:
    enabled: true
    formula: variance of recent round accuracy
    target: low
  recovery:
    enabled: false
    formula: not_used
    target: null
  transfer_proxy:
    enabled: false
    formula: not_used
    target: null

progression:
  promote_when: accuracy >= 0.85 and median_latency_ms <= 3000
  hold_when: accuracy between 0.65 and 0.84
  fallback_when: accuracy < 0.65 for 2 sessions
  next_stage: 5
  previous_stage: 3

storage:
  save_local_results: true
  save_best_scores: true
  save_recent_sessions: true
  export_format: json
```

## Recommended Output Shapes

Depending on the need, AI can compile the same schema into:

- one self-contained `index.html`
- `HTML + CSS + JS` split files
- a small React app
- a static site widget

The schema should stay stable while the rendering target changes.

## Bottom Line

If [red-queen-skill-gym](./red-queen-skill-gym.md) is the training framework, this page is the contract that lets AI generate exact gyms on the web.

Use this when you want:

- a skill described once
- a gym rendered consistently
- metrics preserved
- progression logic enforced
- frontend drift reduced

## Related Pages

- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [l2-phonology-gym](./l2-phonology-gym.md) — first runnable phonology instance of this schema
- [visualization-gym](./visualization-gym.md) — self-graded ladder-tracker instance (imagery vividness); no ground truth to auto-grade, so it follows the BeamNG-tracker shape rather than the classification-quiz template
- [drill-generator](./drill-generator.md)
- [drill-ladder-patterns](./drill-ladder-patterns.md)


---

## U — See (CAST)
1. Contract for turning gym design into web app
2. Inputs, UI blocks, runtime behavior, metrics

## D — Name (NEDF)
1. Web gym generation schema = AI-readable gym contract
2. Distinguisher: schema, not implementation
3. Failure mode: hand-coding gyms each time

## F — Do (SPEAR)
1. Gym design → fill schema
2. AI generates gym from schema

## B — Watch (HEART)
1. Schema drift across gyms
2. Skipping metric definitions

## L — Predict (ORACLE)
1. Schema filled → predict gym features
2. Metrics defined → predict measurement

## R — Act (GRACE)
1. New gym needed → write schema
2. Gym lacking metric → update schema