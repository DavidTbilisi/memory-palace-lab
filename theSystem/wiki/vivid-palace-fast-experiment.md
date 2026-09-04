---
palace: buffer
level: 4
domain: 10
room: 1
wiki_source: wiki/learning-systems/vivid-palace-fast-experiment.md
---

# Vivid Palace Fast — 7-Day Experiment Log

**Summary**: Operational experiment testing the *Vivid Palace Fast* candidate unlock from [composability-index](./composability-index.md): Image Streaming (Stage 6 of [visualization-training](./visualization-training.md)) × hub building (Stage 4) run concurrently against a fixed real-world location. Goal: move the hub from floor-plan-level to experientially-present within 7 days.

**Hub**: Childhood room (deep spatial memory, not visited daily — mapping phase required on Day 1).

**Started**: 2026-05-15

**Sources**: Self-experiment log. Draws on [visualization-training](./visualization-training.md) (Image Streaming, Stage 6), [composability-index](./composability-index.md) (Vivid Palace Fast candidate unlock), [Memory Palace](./memory-palace-architecture-for-neural-os.md) (hub-and-room palace structure), [METER](./meter-overview.md) (telemetry schema).

**Last updated**: 2026-05-15

**METER event log**: `meter-data/events.jsonl` — append one `viz_*` block per session.

---

## Why This Experiment Exists

Every encoder in Neural OS — [nedf-overview](./nedf-overview.md) Name-hook scenes, [spear-overview](./spear-overview.md) Scene slots, [cast-overview](./cast-overview.md) palace nodes, [heart-overview](./heart-overview.md) face-rooms — deposits its material into palace loci. If those loci feel like floor-plan notation rather than lived space, retrieval is shallow. This experiment tests whether Image Streaming against a fixed spatial hub can flip that within one week, as practitioner reports suggest.

Failure would be: hub still feels schematic after 7 sessions. Success: felt presence ≥3/5, spontaneous details appearing without effort.

---

## Session Structure

**Total time per session**: 20–30 minutes. Non-negotiable daily.

### Phase A — Warm-up (3 minutes)
1. Sit comfortably, close eyes.
2. Do 3 intensity intervals: generate the clearest image you can for 1–2 seconds, then fully relax. Repeat.
3. Take 5 slow breaths. Let the scalp un-tense (strain is the enemy).

### Phase B — Hub entry (5 minutes)
1. Place yourself at the entrance of the childhood room — doorway, threshold, wherever you first see it.
2. Describe aloud, present tense, what you notice. *Not what you remember — what you notice right now.*
   - "The door is wooden, slightly scratched near the handle. The handle is cold metal. The room smells faintly of..."
3. Move slowly. Don't rush to map everything. Stay at the entrance until it feels spatial, not verbal.

### Phase C — Streaming walk (15–20 minutes)
1. Begin moving through the room in image-streaming mode: narrate continuously, present tense, aloud.
2. Rules:
   - **Don't guide.** If a detail appears that wasn't in the original room, describe it anyway.
   - **Don't correct.** Wrong details are fine — they signal the generation channel is open.
   - **Don't evaluate.** "That's not right" kills the stream. Just narrate.
   - **Touch everything.** Run hands along surfaces, pick things up, smell them, knock on walls.
   - **Look at your hands** when uncertain — this grounds you in the space (Jessenstein technique).
3. If the stream dies (you run out of things to say): call a **[REMAPS](./remaps.md) stall-rescue move** aloud and narrate the result:
   - **E** (Exaggerate): "What if this wall were 100 feet tall?"
   - **M** (Modify/Move): "The floor becomes water. I feel it underfoot..."
   - **S** (Sensations): "I notice a smell in this corner. It's..."
   - **P** (Play): "Something absurd happens at the desk..."
   - **R** (Rotate): "I view the room from the ceiling, looking down..."
   
   Note which move you reached for — it's diagnostic of your strongest imagery channel right now.

### Phase D — Close (2 minutes)
1. Note 1–3 spontaneous details that appeared *without you deciding them* — the stream added them.
2. Rate felt presence: 1 = floor plan only / 2 = faint impressions / 3 = spatially real / 4 = multi-sensory / 5 = nearly indistinguishable from memory of being there.
3. Log to METER (see below).

---

## The 7-Day Arc

| Day | Focus | Special instruction |
|---|---|---|
| **1** | Hub mapping | No streaming yet. Spend the full 25 min just reconstructing the room: where is everything? Sketch it mentally, describe it aloud, find the gaps. Identify your 5 anchor loci (bed, desk, window, door, one more). |
| **2** | Hub mapping + first stream | Map the 5 anchors again, then begin streaming from the entrance. 10 min mapping, 10 min streaming. |
| **3** | Full streaming session | Standard Phase A–D. First time running the full protocol. Don't worry about vividness — just keep narrating. |
| **4** | Full streaming + sensory emphasis | During Phase C: every surface you touch, linger. Force a smell, a temperature, a sound. Add sensory mass to every locus. |
| **5** | Full streaming + spontaneous additions | Actively *invite* the stream to add new details. If a bookshelf appears with books you didn't choose, describe their spines. |
| **6** | Silent walkthrough first, then stream | Start with 5 min eyes-closed silent walk — no narration, just presence. Then stream for 15 min against what you experienced. |
| **7** | Test day | Silent walkthrough for 10 minutes. No narration. Just inhabit the space. Rate felt presence. Log. This is the experiment's outcome measure. |

---

## METER Schema

Append one entry per session to `meter-data/events.jsonl`. Format:

```json
{
  "event": "viz_session",
  "date": "2026-05-15",
  "day": 1,
  "session_duration_min": 25,
  "stream_duration_min": 0,
  "spontaneous_details": [],
  "felt_presence": 1,
  "remaps_stall_rescue": ["S", "M"],
  "notes": "Day 1 mapping only. Found gaps: can't recall what's on the desk surface or what's on the walls."
}
```

Fields:

| Field | Type | Meaning |
|---|---|---|
| `event` | string | Always `"viz_session"` |
| `date` | ISO date | Session date |
| `day` | int 1–7 | Experiment day |
| `session_duration_min` | int | Total session time |
| `stream_duration_min` | int | Minutes of continuous narration |
| `spontaneous_details` | string[] | Details that appeared without being decided |
| `felt_presence` | int 1–5 | See rating scale above |
| `remaps_stall_rescue` | string[] | Which REMAPS moves were called to break stalls (e.g. `["S","E"]`) — diagnostic of strongest channel |
| `notes` | string | Gaps found, surprises, failure modes hit |

**Pass floor for the experiment**: Day 7 `felt_presence` ≥ 3, `spontaneous_details` total ≥ 10 across all 7 sessions.

---

## Failure Modes to Watch

| Mode | Sign | Fix |
|---|---|---|
| Narrating from memory | "The room has a bed and a desk" (declarative) | Re-ask: *what do I notice right now?* Describe surfaces, not objects |
| Stream dies early | Silence after 5 min | Zoom in. What is the texture of the nearest thing? What does it smell like? |
| Trying to fix wrong details | Internal correction → image collapse | Wrong details are fine. Narrate them. Correct nothing during streaming. |
| Scalp tension / strain | Forced effort, no generation | Full relax. Intensity intervals make this clear: burst then release, never sustain. |
| Entering a blank space instead of the hub | No anchor, scenes evaporate | Always enter at the same door/threshold. The entrance is the anchor. |

---

## Daily Log

### Day 1 — 2026-05-__

**Duration**: __ min | **Stream**: __ min | **Felt presence**: __/5

**Spontaneous details**:
-

**Gaps found** (things you couldn't recall):
-

**Notes**:

---

### Day 2 — 2026-05-__

**Duration**: __ min | **Stream**: __ min | **Felt presence**: __/5

**Spontaneous details**:
-

**Notes**:

---

### Day 3 — 2026-05-__

**Duration**: __ min | **Stream**: __ min | **Felt presence**: __/5

**Spontaneous details**:
-

**Notes**:

---

### Day 4 — 2026-05-__

**Duration**: __ min | **Stream**: __ min | **Felt presence**: __/5

**Spontaneous details**:
-

**Notes**:

---

### Day 5 — 2026-05-__

**Duration**: __ min | **Stream**: __ min | **Felt presence**: __/5

**Spontaneous details**:
-

**Notes**:

---

### Day 6 — 2026-05-__

**Duration**: __ min | **Stream**: __ min | **Felt presence**: __/5

**Spontaneous details**:
-

**Silent walk** (before streaming): what was the first thing you noticed?

**Notes**:

---

### Day 7 — Test Day — 2026-05-__

**Silent walkthrough duration**: __ min | **Felt presence**: __/5

**Total spontaneous details across 7 days**: __

**Pass?** (felt presence ≥3 AND spontaneous details ≥10): YES / NO

**Outcome notes**:

---

## Post-Experiment Decision

If **passed**: promote *Vivid Palace Fast* from `candidate` to `confirmed` in [composability-index](./composability-index.md). Create a T2 SPARK trophy entry. Begin extending the hub (add rooms, or move to a second palace).

If **failed**: record the specific failure mode. Most likely causes: hub too abstract (virtual palace works worse than physical room), or stream duration too short (need ≥10 min of narration per session to reach generation threshold). Adjust and retry.

---

## Related Pages

- [visualization-training](./visualization-training.md) — the 8-stage ladder this experiment runs Stage 4 + Stage 6 of
- [composability-index](./composability-index.md) — where this unlock is registered as `candidate`
- [Memory Palace](./memory-palace-architecture-for-neural-os.md) — what the hub grows into
- [vivid-imagery](./vivid-imagery.md) — the science of why this works
- [remaps](./remaps.md) — next layer to apply once the hub is experientially present


---

## U — See (CAST)
1. Vivid Palace Fast unlock experiment
2. Image Streaming × hub building, 7-day target

## D — Name (NEDF)
1. Vivid palace fast experiment = unlock-test experiment
2. Distinguisher: testing composability-index candidate
3. Failure mode: declaring unlock without 7-day measurement

## F — Do (SPEAR)
1. Day 1 → start protocol
2. Daily run for 7 days → measure

## B — Watch (HEART)
1. Skipping daily measurement
2. Confirmation bias

## L — Predict (ORACLE)
1. Day → predict palace vividness
2. Result → predict unlock confirmation

## R — Act (GRACE)
1. Experiment day → run protocol
2. Day 7 → confirm or reject unlock