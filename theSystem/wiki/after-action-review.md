---
palace: meta-knowledge
level: 8
domain: 10
room: 7
wiki_source: wiki/problem-solving/after-action-review.md
---

# After-Action Review (AAR)

**Summary**: The US Army's structured **5-question retrospective protocol** for experiential learning, adopted by Sloan as one of two recommended techniques for the [Reevaluation stage](./sloan-three-stage-learning-model.md) (the other is coding surf/dive questions). The 5 questions: **(1) What was the intent?** **(2) What actually happened?** **(3) Why did it happen?** **(4) How can we do better?** **(5) What do we do now?** Sister to the wiki's [ARC Close](./arc-framework.md) phase; importable directly into any strategy or operation post-mortem. Discipline: blame-free, fact-first, action-oriented.

**Sources**:
- [sloan-learning-to-think-strategically](./sloan-learning-to-think-strategically.md) — source summary
- Sloan, *Learning to Think Strategically* (4th ed., 2020), Ch 10 §"Learning to dialogue" — AAR description
- Bender, *Operation Excellence: Succeeding in Business and Life — The U.S. Military Way* (Sloan's cited primary source for the AAR protocol)

**Last updated**: 2026-05-27

---

## The 5 questions

| # | Question | What it does | Reflection type |
|---|---|---|---|
| 1 | **What was the intent?** | Re-states the strategy at the time the action began. The desired outcome. How the strategy was expected to be achieved. | Premise |
| 2 | **What actually happened?** | Factual chronology — who did what, where, how, when, reactions. Pieced together collaboratively. **No blame.** | Content |
| 3 | **Why did it happen?** | Diagnostic. Possible reasons the outcome diverged from intent (or matched it). | Premise + Process |
| 4 | **How can we do better?** | What was learned? What changes per next iteration? | Process |
| 5 | **What do we do now?** | The action commitment. The Reevaluation closes with a forward step. | Process + Content |

## When to run an AAR

- **Immediately after a decision or major action** — the Army practice
- **After surprise outcomes** — pleasant or unpleasant; surprise marks learning opportunity per [the transformative domain](./surf-dive-learning-domains.md)
- **As a routine meeting closer** — every quarterly strategy review; every project milestone
- **After failure** — non-negotiable; failure without AAR is wasted failure

## Who attends

The Army's practice: at least three leadership levels involved in the action, plus others who participated. The diversity matters — junior participants surface details senior leaders missed, and vice versa.

**Trained facilitator**: not optional. The facilitator's job is to ensure the review stays honest and candid, and members respect each other. Without facilitation, AARs degrade into blame sessions or polite theater.

## The discipline — blame-free, fact-first

The Army's protocol is **blame-free**. Q2 ("What actually happened?") is constructed as a factual chronology, **not** as an attribution exercise. The reason: blame collapses dialogue (per [critical-dialogue-discussion-debate](./critical-dialogue-discussion-debate.md)); without dialogue, no learning surfaces.

The discipline (translation for civilian contexts):
- **No "you should have"** during Q2 — those belong (if anywhere) in Q3
- **No exit until Q5 is named** — an AAR without a forward commitment is half an AAR
- **No editing the chronology** — Q2's facts stand even if they're embarrassing
- **No skipping Q1** — re-stating the original intent is the move that lets Q3 and Q4 do their work

## AAR and the 3 reflection types

The 5 questions traverse [all 3 types](./content-process-premise-reflection.md):

- Q1 (intent) = **premise**
- Q2 (what happened) = **content**
- Q3 (why) = **premise + process**
- Q4 (how to improve) = **process**
- Q5 (what now) = **process + content**

This is a feature, not a coincidence. AAR is structured to ensure premise gets named (Q1, Q3) before improvement is discussed (Q4) and before commitment (Q5). Skipping Q1 or Q3 collapses the protocol to a content-only meeting that produces nothing strategic.

## AAR vs other retrospective protocols

| Protocol | Domain | Key difference |
|---|---|---|
| **AAR** | US Army | Blame-free chronology in Q2; trained facilitator required; immediate post-action |
| **Scrum retrospective** | Software | Periodic (sprint-end); often informal; team-only |
| **Pre-mortem** | Decision science | Run *before* the action — imagines failure to surface risks |
| **5-Whys** | Lean / quality | Cause-chasing; single causal chain |
| **Post-mortem** (engineering) | SRE / incident response | Blame-free chronology; written report; published |
| **[ARC Close](./arc-framework.md)** | This wiki | Same 5-question shape; AAR can serve as ARC Close's structured implementation |
| **Fishbone / Ishikawa** | Quality | Cause categorization, not chronology-first |

The wiki adopts AAR as the **default Reevaluation protocol** because:
- It includes the affective room (the chronology can include "and the team felt panicked at that point") without demanding it
- It's import-ready (well-documented externally; minimal wiki-specific tailoring needed)
- It pairs naturally with [the 3-stage model](./sloan-three-stage-learning-model.md) Reevaluation stage

## AAR and the [nine-dive-question-drill](./nine-dive-question-drill.md)

The drill fires especially in Q3 ("Why did it happen?"). Run the 9 dive questions on the gap between Q1's intent and Q2's actual chronology. Six rounds of the 9 questions × 1 AAR = ~54 questions × 1, which produces the premise-shift the AAR is designed to catch.

## Variants

### Mini-AAR (5 minutes)

For low-stakes decisions: a 1-line answer per question. Useful for daily-loop reviews (neural-os-daily-loop).

### Written AAR

For high-stakes decisions: written answers per question, circulated for review, published. The discipline of writing surfaces details that verbal AARs miss.

### Pre-mortem variant

Run Q1, Q2, Q3, Q4 **before** the action — imagining a future failure. "Imagine this strategy has failed 18 months from now. What happened? Why? How could we have done better?" The fifth question becomes "What do we change now to avoid that failure?"

## METER

- `aar_completed_flag` — boolean per major decision / project milestone; pass ≥90%
- `aar_time_to_q1` — minutes from session-open to Q1 being explicitly asked; pass ≤2 min (delays are usually defensiveness)
- `aar_blame_event_count` — incidents of blame-language during Q2; pass ≤0/session
- `aar_q5_committed_action` — boolean; did Q5 produce a named action with owner + date? Pass ≥90%
- `aar_premise_shift_count` — count of premise-shifts surfaced during Q1 or Q3; pass ≥1 per major AAR

## Failure modes

1. **Skipped AAR** — most common; the team moves on without explicit reevaluation. Defense: mandatory on major decisions; calendar-anchored.
2. **Q2-as-blame** — chronology degenerates into "who did wrong". Defense: trained facilitator; explicit blame-free rule named at open.
3. **Q5-skipped** — discussion happens, no commitment made. Defense: facilitator enforces named action + owner + date.
4. **Q1-skipped** — assumes everyone remembers the original intent; usually false. Defense: written intent re-stated at start.
5. **Premature-AAR** — running it before enough has happened to learn from. Defense: at least one full action cycle's worth of data before AAR.
6. **AAR-theater** — going through the questions for compliance without dive-domain engagement. Defense: METER tracks premise-shift count; theater scores 0.

## Mnemonic

A Velvet Aeon Mortal-mode **circular war-room**. **Five stone tablets** ring the room, each carved with one question. A **woman in officer's coat** (the facilitator) stands at the center, holding a **bronze ledger**. Around the perimeter, **soldiers and aides** sit on equal-height stools — no hierarchy of seating, per the AAR's blame-free discipline.

The five tablets glow in sequence as the woman points to each:

1. **Tablet 1 (Intent)** — a glowing **arrow inscribed in flame** (where we were aiming)
2. **Tablet 2 (Happened)** — a glowing **chronology scroll**, words appearing as the room contributes them
3. **Tablet 3 (Why)** — a **dark mirror** reflecting the audience back at themselves (the diagnostic)
4. **Tablet 4 (Better)** — a **forge with a half-shaped tool** (improvement being hammered)
5. **Tablet 5 (Now)** — a **single drawn sword** in the floor — the commitment

A **bell** at the room's apex rings only after Tablet 5 has been read. If the bell hasn't rung, the AAR isn't complete. The facilitator's coat is plain; her face is strong, hair lifted; single overhead torch as light. No atmospheric noise.

## Memory checksum

- **5** questions (Intent · Happened · Why · Better · Now)
- **3** reflection types touched (content · process · premise)
- **1** blame-free rule (Q2)
- **1** mandatory commitment (Q5 named action)
- **6** failure modes
- **3** variants (mini · written · pre-mortem)
- **3** leadership levels (Army practice for full AAR)

If you can recite **5-3-1-1-6-3-3** in 25 seconds and *name a recent decision you haven't yet AAR'd*, the page is encoded.

## Related pages

- [sloan-learning-to-think-strategically](./sloan-learning-to-think-strategically.md) — source summary
- [sloan-three-stage-learning-model](./sloan-three-stage-learning-model.md) — AAR operationalizes the Reevaluation stage
- [arc-framework](./arc-framework.md) — AAR can serve as ARC Close's structured implementation
- [nine-dive-question-drill](./nine-dive-question-drill.md) — fires especially in Q3
- [content-process-premise-reflection](./content-process-premise-reflection.md) — the 5 questions traverse all 3 types
- [critical-dialogue-discussion-debate](./critical-dialogue-discussion-debate.md) — AAR uses dialogue (Q1-Q4) + discussion (Q5)
- neural-os-daily-loop — mini-AAR fires daily; full AAR at quarterly review
- [meter-overview](./meter-overview.md) — aar_completed_flag + aar_premise_shift_count as metrics
- [failure-mechanism](./failure-mechanism.md) — without proper AAR, failures fossilize as identity damage rather than learning
- [memory-reconsolidation](./memory-reconsolidation.md) — AAR opens the labile window for the experience's trace
