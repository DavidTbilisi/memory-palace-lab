---
palace: core-memory
level: 7
domain: 10
room: 6
semantic_mode: 5
wiki_source: wiki/problem-solving/decision-kernel.md
---

# Decision Kernel

**Summary**: A structured framework for making good decisions — clear about goals, explicit about uncertainty, aware of tradeoffs, and proportional to reversibility. Covers the canonical decision formula, 7 questions, decision types, values hierarchy, and a decision record template.

**Sources**: raw/01 Core_Memory/Decision/Decision.md

**Last updated**: 2026-05-04

---

## Core Claim

Good decisions are not the same as good outcomes.

A good decision is: clear about the goal, explicit about uncertainty, aware of tradeoffs, proportional to reversibility, tied to a review point.

If a choice has no decision rule, you will re-decide it every week.

This framework handles **tradeoff problems** and **constraint problems** — when you know a path exists but are choosing between competing costs or values, or when real external limits need to be named. See [problem-type-classifier](./problem-type-classifier.md).

---

## Canonical Formula

```
Decision =
  Goal
+ Options
+ Constraints
+ Values
+ Uncertainty
+ Reversibility
+ Expected upside / downside
+ Review point
```

---

## The 7 Questions

When a decision matters, answer these in writing:

1. What problem am I actually deciding?
2. What would count as success?
3. What are the real options?
4. What constraints or non-negotiables exist?
5. What matters most in this case: speed, truth, money, learning, peace, reputation, leverage?
6. What is uncertain, and what could I learn cheaply before committing?
7. When will I review whether this was working?

If you cannot answer these, you are not deciding yet. You are circling.

Question 6 is bounded: it asks what is worth learning before the decision closes, not whether the residual unknown can be tolerated afterward. That second question — sitting with a gap this framework has correctly decided not to close — belongs to intolerance-of-uncertainty, not here.

---

## Decision Types

### Type 1: Reversible
- Cheap to undo, short time horizon, low downside, high learning value
- **Rule:** Decide fast. Bias toward action and information gain.
- Examples: try a new note structure, test a workflow for one week, run a small automation

### Type 2: Hard to Reverse
- Expensive to undo, long time horizon, identity or financial impact, high opportunity cost
- **Rule:** Slow down. Increase evidence. Write the tradeoff explicitly.
- Examples: move countries, commit to a career track for a year, large financial commitment

---

## Default Rules

**1. Reversibility decides speed**
- Reversible → fast
- Irreversible → slower

**2. Downside protection before upside fantasy**
- What is the worst realistic downside?
- Can I survive it?
- How do I cap it?

**3. Cheap tests before large commitments**
- What 1-week or 30-day experiment gives real evidence?

**4. One active reason is better than ten vague reasons**
- One dominant benefit, one dominant risk, one dominant uncertainty

**5. Put stop rules in advance**
- If you do not define exit criteria early, emotion will hijack the review

---

## Values Hierarchy

Use when tradeoffs are muddy.

| Tier | Values |
|---|---|
| **Tier 1: Non-negotiables** | truth, integrity, stewardship, health |
| **Tier 2: Strategic priorities** | leverage, compounding skill, peace of mind, transferability, financial resilience |
| **Tier 3: Nice-to-have** | comfort, novelty, aesthetics, status |

Do not let Tier 3 beat Tier 1 or Tier 2 by accident.

---

## Decision Record Template

```markdown
Decision:
Date:
Owner:

Problem:
Success criterion:
Decision type: [reversible / hard-to-reverse]
Time horizon:

Options:
- A
- B
- C

Non-negotiables:

Most important values:

Known facts:

Key uncertainties:

Cheap test before full commitment:

Dominant upside:
Dominant downside:

Why this option wins:

Stop / kill criteria:

Review date:
```

---

## Fast Decision Rules

- If reversible and downside is bounded → act
- If irreversible and evidence is thin → delay and test
- If two options are similar → choose the one with better learning value
- If one option protects focus and energy → it usually beats the noisier one
- If a choice creates chronic complexity → charge it a heavy tax
- If you keep revisiting the same decision → convert it into a rule

---

## Anti-Patterns

- Solving mood instead of solving the problem
- Collecting reasons without ranking them
- Pretending uncertainty is knowledge
- Waiting for total certainty
- Treating all decisions as equally important
- Failing to define review date or kill criteria
- Optimizing for image instead of long-term value

---

## Timing-Kernel Integration

The Decision Kernel handles *what to choose*. [timing-operative](./timing-operative.md) handles *when to move*. They compose via the **2×3 reversibility-timing matrix** — the most common failure (irreversible decision made too early) is exactly what happens when the Kernel is run without a named Timing Window.

| | **Too Early** | **Sweet Spot** | **Too Late** |
|---|---|---|---|
| **Reversible** | Test cheaply; confirm signal | Act with speed | Learn; spot the next cycle |
| **Irreversible** | Wait; validate further | Move decisively | Do not force; wait |

**Integration rule**: before running the 7 Questions, identify the Timing Window zone and dominant signal (see [timing-operative](./timing-operative.md) §5 High-Leverage Timing Signals). The zone determines how much evidence the Kernel needs before reaching DECIDE: Too Early → "what 1-week or 30-day experiment gives real evidence?" (Question 6); Sweet Spot → "reversibility decides speed" (Default Rule 1); Too Late → apply the kill-criteria and redirect to next cycle.

---

## Output Standard

A decision is complete when you can state:
1. What I chose
2. Why I chose it
3. What would make me change my mind
4. When I will review it

---

## Integration With Neural OS

The Decision Kernel handles two problem types from [problem-type-classifier](./problem-type-classifier.md):

- **Tradeoff problems** — use the 7 Questions + Values Hierarchy to make the winning criterion explicit
- **Constraint problems** — use the Non-negotiables field + Canonical Formula to separate real limits from fake ones

For search problems that require structural analysis before a decision can be made, run [frame-forge](./frame-forge.md) first to clarify the option space, then bring the output into the Decision Kernel.

---

## Related Pages

- [problem-type-classifier](./problem-type-classifier.md)
- [attention-framework](./attention-framework.md)
- [frame-forge](./frame-forge.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [truth-vs-effectiveness](./truth-vs-effectiveness.md) — the values hierarchy declares the *ends*; that page argues a correctness verdict has no jurisdiction over them, only over means
- intolerance-of-uncertainty — the affective mirror of this page's epistemic uncertainty; owns what happens when the residual unknown can't be sat with


---

## U — See (CAST)
1. Decision formula + 7 questions + decision types + record template
2. Proportional to reversibility

## D — Name (NEDF)
1. Decision kernel = structured decision framework
2. Distinguisher: explicit uncertainty + reversibility
3. Failure mode: same process for reversible and irreversible

## F — Do (SPEAR)
1. Decision needed → run 7 questions
2. Record decision in template

## B — Watch (HEART)
1. Skipping reversibility check
2. Decision without record

## L — Predict (ORACLE)
1. Type → predict process weight
2. Reversibility → predict deliberation depth

## R — Act (GRACE)
1. Decision → run kernel
2. Outcome → close loop via record