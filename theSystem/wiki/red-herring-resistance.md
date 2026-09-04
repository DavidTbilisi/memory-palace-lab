---
palace: meta-knowledge
level: 7
domain: 10
room: 5
wiki_source: wiki/problem-solving/red-herring-resistance.md
---

# Red-Herring Resistance

**Summary**: The **METER-tracked skill of not using irrelevant data the problem gave you**. Across the [Livingstone-Thomson 211-puzzle corpus](./livingstone-thomson-brain-teasers.md), ~50 puzzles include narrative or numerical embellishment that's *not load-bearing*; using it leads to plausible-but-wrong answers. This page registers red-herring resistance as a **first-class measurable skill** with a defined floor (≤1 false-positive per 10 puzzles with irrelevant data present). Sister to [anti-tactic-detection](./anti-tactic-detection.md) (the meta-skill) — this page is the *metric*; the other is the *operation*.

**Sources**:
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — corpus with ~50 red-herring instances
- Daniel Kahneman, *Thinking Fast and Slow* (2011) — Ch 3 on the lazy controller; System 1 reaches for *any* available data
- [representation-rules](./representation-rules.md) — closest existing wiki page; says "list load-bearing inputs" without naming the resistance skill

**Last updated**: 2026-05-24

---

## Why this needs its own page

The wiki has [representation-rules](./representation-rules.md) that says "minimize extraneous load" and [anti-tactic-detection](./anti-tactic-detection.md) that says "recognize priming". Neither is **measurable per puzzle**. Red-herring resistance is the operational, METER-tracked complement:

| Layer | What it does | Measurable? |
|---|---|---|
| [representation-rules](./representation-rules.md) | Prescribes representation discipline | Hard — qualitative |
| [anti-tactic-detection](./anti-tactic-detection.md) | Detects priming | Hard — multi-factor |
| **This page** | **Counts puzzles where irrelevant data was used** | **Yes — false-positive rate** |

Without this page, the wiki has no per-puzzle audit trail for the specific failure of *using* a red herring.

## The 4-step protocol (executed per puzzle)

1. **List all puzzle facts** in writing. Numbers, names, professions, dates, distances, units.
2. **For each fact, classify**: `load-bearing` (the answer changes if removed) or `decorative` (the answer doesn't change).
3. **Solve using only load-bearing facts.** If you reach for a decorative fact mid-solve, log it.
4. **At end-of-puzzle**: if any decorative fact was used in the solve, log `red_herring_used=true` in the METER event.

The protocol's cost is ~30 seconds per puzzle. The gain is per-puzzle visibility into the specific failure mode.

## Worked example — #16 Light Speed

> *Distance Earth-Sun = 100M miles. Speed of light = 186,000 mi/s. Light takes 8 min to reach Earth. Sun rose at 6 am. Speed of light suddenly doubles to 372,000 mi/s. What time will the Sun rise tomorrow?*

**Step 1 — List facts**: distance=100M mi · speed₁=186k mi/s · time₁=8 min · sunrise₀=6am · speed₂=372k mi/s · day-shift=24h

**Step 2 — Classify**:
- distance: **decorative**
- speed₁, speed₂: **decorative**
- time₁ (8 min from Sun to Earth): **decorative**
- sunrise₀ (6 am): **load-bearing** (sunrise tomorrow same as today, given Earth rotation unchanged)
- day-shift (24h): **load-bearing**

**Step 3 — Solve with load-bearing only**: tomorrow's sunrise = today's sunrise = **6 am**.

**Step 4 — Log**: `red_herring_present=true`, `red_herring_used=false` (if you didn't reach for distance/speed/time).

If you did reach: `red_herring_used=true`. METER event records the specific fact used (which feeds the per-puzzle audit for the gym).

## Per-archetype red-herring density

From the [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) corpus:

| Archetype | Red-herring density | Note |
|---|---|---|
| B — lateral red herring | ~95% (by definition) | The archetype |
| E — algebraic | ~30% | Often gives extra numbers as distractor |
| F — work-backward | ~40% | Narrative embellishment common |
| C — memorization | ~0% | All shown items are load-bearing |
| N — constraint grids | ~5% | Constraint puzzles minimize fluff |
| K — geometric counting | ~10% | Some distractors in figure |
| Speedy math | ~0% | Just arithmetic |

So ~75 of the 211 puzzles have red-herring potential. The METER metric should be normalized to puzzles where `red_herring_present=true`.

## METER schema

Per-puzzle event field additions:

```yaml
red_herring_present: <true|false>
red_herring_used: <true|false>
red_herring_fact: <string|null>   # which decorative fact was used, if any
load_bearing_listed: <true|false> # did the solver actually list facts before solving
list_time_seconds: <number|null>  # how long the listing step took
```

Per-session rollup:
- `red_herring_false_positive_rate` = uses ÷ presents
- `load_bearing_listing_compliance` = (listed AND present) ÷ presents

Pass floor: false-positive rate **≤10%** (i.e., ≤1 per 10 red-herring-present puzzles); listing compliance **≥80%**.

## Cross-link to Kahneman System 1

Kahneman (Ch 3): System 1 is *lazy*; it reaches for any available data without distinguishing relevance. Red herrings work *because* System 1 grabs them. The 4-step protocol is a System-2 deliberate override: by forcing a fact-listing step, you slow System 1 enough for System 2 to engage.

This connects to:
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — System 1 reach is exactly an Automatic Negative (here positive) Thought
- [pulse-overview](./pulse-overview.md) — high-stress state worsens System 1 reach (more red-herring use)
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Get Hands Dirty — the listing-step disguised as a startup strategy

## Failure modes

1. **Skipping the listing step under time pressure** — the protocol takes 30 s; under a 5-min puzzle budget that feels like 10%. Defense: METER tracks listing-compliance as a separate metric; skipping is visible.
2. **Listing but not classifying** — writing all facts without marking load-bearing vs decorative misses the discipline. Defense: require both columns on the list.
3. **Misclassifying a decorative fact as load-bearing (cautious over-inclusion)** — leads to confusion but rarely wrong answers; the answer just takes longer.
4. **Misclassifying a load-bearing fact as decorative (cautious under-inclusion)** — leads to wrong answers because a needed fact is dropped. Defense: when in doubt, mark load-bearing.
5. **Cross-session decay** — without daily-loop integration, the listing-discipline atrophies. Defense: bind to neural-os-daily-loop §puzzle-session block.

## Cross-domain transfer

| Domain | Red-herring instance |
|---|---|
| Debugging | "The error message mentions module X" — but module X is just where the error surfaces; the bug is in Y. Listing call-chain load-bearing-facts catches this. |
| Diagnosis (medical) | "Patient mentions chest pain" — could be cardiac, GI, musculoskeletal, anxiety; pattern-completion grabs the first hypothesis. Differential discipline = load-bearing-fact listing. |
| Security incident response | "The alert mentions IP X.Y.Z.W" — that IP is the *target*, not the attacker; the load-bearing fact is the *source* IP. |
| Business decision | "Revenue is up 10% this quarter" — but customer count dropped 20%; the 10% is decorative if the question is about retention. |
| Argumentation | Most rhetorical fallacies are red-herring-deployment. Detection is the listing of which premises actually support which conclusions. |

## METER pass-floors

| Test | Pass floor |
|---|---|
| Recite the 4-step protocol | <8 s |
| Apply to a 5-fact puzzle | <30 s |
| False-positive rate across 30 red-herring puzzles | ≤10% (≤3 in 30) |
| Listing compliance | ≥80% of red-herring puzzles |
| Cross-domain identification (1 non-puzzle instance) | <30 s |
| Decorative-vs-load-bearing classification accuracy | ≥85% |

## Mnemonic

Velvet Aeon Mode-Mortal register: a **scholar at a long oak table covered in scattered scrolls, jewels, coins, dried flowers, and a single gold key**. Most of the items are *decoration* placed by the puzzle-maker; only the **gold key** opens the chamber that holds the answer. The scholar must, in 30 seconds, **list each item and decide which one is the key**. The decorative items are visually richer than the key — gleaming, ornate, eye-catching. The key is plain. Her **non-dominant hand** holds a quill that strikes through decorative items as she identifies them; her dominant hand grips the key. The scholar has the **FRAGILE** face archetype (resistance to seduction is a fragile, not a power, skill — it requires the patience to *not* reach); long hair shines under a single warm candle; preserve = **sorrow as guidance** (each over-reach is mourned). Hair tips trail into shallow water at her feet (the feedback_image_face_and_hair water effect — dissolving the temptation of decoration).

## Memory checksum

- **4** protocol steps (list · classify · solve-with-load-bearing · log)
- **5** failure modes (skip listing · list without classify · over-inclusion · under-inclusion · cross-session decay)
- **5** cross-domain transfers (debugging · diagnosis · IR · business · argument)
- **2** primary metrics (false-positive rate ≤10% · listing compliance ≥80%)
- **~75** of 211 puzzles in the corpus have red-herring potential
- **1** Kahneman link (System 1 grabs available data; System 2 override = listing step)

If you can recite 4-5-5-2-75-1 from "red-herring resistance" within 60 s, the page is encoded.

## Related pages

- [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) — trap class 1 + 5
- [anti-tactic-detection](./anti-tactic-detection.md) — meta-skill sibling
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — archetype B + E + F have density
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — corpus
- [crux-recognition-gym](./crux-recognition-gym.md) — drilled here
- [representation-rules](./representation-rules.md) — closest prior page; this operationalizes it
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — System 1 reach = ANT
- [pulse-overview](./pulse-overview.md) — stress worsens red-herring use
- neural-os-daily-loop — listing discipline binds to daily puzzle-session
- [meter-overview](./meter-overview.md) — the measurement layer this metric feeds

---

## U — See (CAST)

1. Scholar at table strewn with decoy scrolls/jewels/coins/flowers + single plain gold key, quill striking through decoys
2. Edges: list → classify → load-bearing-only solve → log

## D — Name (NEDF)

1. Red-Herring Resistance = METER-tracked skill of not using irrelevant data
2. Operationalized by 4-step list-classify-solve-log protocol
3. Distinguisher: per-puzzle measurable (not qualitative like representation-rules)
4. Failure mode: skip listing under time pressure

## F — Do (SPEAR)

1. Read puzzle → list all facts (30 s budget)
2. Classify each as load-bearing / decorative
3. Solve using only load-bearing
4. Log: `red_herring_used` + `red_herring_fact` in METER event

## B — Watch (HEART)

1. Skipping the listing step
2. Listing without classifying
3. Over- vs under-inclusion errors
4. Cross-session discipline decay

## L — Predict (ORACLE)

1. Archetype B + E + F → red-herring likely
2. Listing compliance predicts false-positive rate

## R — Act (GRACE)

1. Read puzzle → list facts before computing
2. Strike through decorative items explicitly
3. Coach another → ask "which of these facts changes the answer if removed?"
