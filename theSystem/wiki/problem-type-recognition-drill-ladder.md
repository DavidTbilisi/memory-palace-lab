---
palace: tactical-memory
level: 4
domain: 10
room: 4
wiki_source: wiki/problem-solving/problem-type-recognition-drill-ladder.md
---

# Problem-Type Recognition Drill Ladder

**Summary**: A worked drill-generator instantiation for learning to classify the dominant bottleneck in a problem before choosing a method, with emphasis on the four-way split: search, execution, constraint, and tradeoff.

**Sources**:
- math-learning-with-neural-os.md
- raw/01 Core_Memory/Problem Type Classifier.md
- raw/01 Core_Memory/Problem Solving Maturity Levels.md
- raw/01 Core_Memory/PELIA - problem solving.md
- drill-generator.md

**Last updated**: 2026-05-02

---

## Purpose

This page turns one narrow sub-skill from [math-learning-with-neural-os](./math-learning-with-neural-os.md) into a real drill ladder.

The skill is:

- identify what kind of problem gap dominates
- before choosing a move

This matters because many failed solutions are not caused by low effort.

They are caused by solving the wrong kind of problem.

## Skill Definition

```yaml
skill: problem-type recognition
skill_type: judgment
real_target: classify the dominant bottleneck before choosing tools or methods
real_use_case: math problems, proofs, studying, planning, debugging, decision-making
time_horizon: 2-6 weeks
session_length: 15-30m
weekly_frequency: 5x
```

## Real Target

Zenith for this skill is not:

- naming four categories from memory
- repeating the classifier verbally

Zenith means:

- seeing quickly whether the problem is mainly:
- search
- execution
- constraint
- tradeoff
- and then choosing the smallest useful response

## Core Four-Way Split

The classifier used here is:

1. `search gap`
2. `execution gap`
3. `constraint gap`
4. `tradeoff gap`

Compressed rule:

- `search` = I do not know the path
- `execution` = I know the path but do not carry it out reliably
- `constraint` = I know the path but something real blocks it
- `tradeoff` = several valid paths exist but optimize different costs or values

## Current-Stage Map

Use this mapping between drill stages and the recognition skill.

| Drill stage | Focus |
|---|---|
| `0 Orientation` | know that not all hard problems are search problems |
| `1 Isolation` | recognize one clean example of each type |
| `2 Clean Repetition` | classify short clean cases with one dominant type |
| `3 Controlled Variation` | classify the same goal under different dominant bottlenecks |
| `4 Automaticity` | classify quickly before overthinking |
| `5 Mixing` | handle ambiguous, mixed, or near-neighbor cases |
| `6 Pressure And Noise` | classify under time, interruption, or incomplete data |
| `7 Transfer And Zenith` | use the classifier inside real math and problem-solving work |

## Primary Failure Modes

Most learners fail for one of these reasons:

- `cannot recognize` -> the category names still feel abstract
- `cannot recall` -> the diagnostic questions do not fire at the moment of use
- `cannot execute` -> they know the classifier but do not apply it before acting
- `confuses neighbors` -> search, execution, constraint, and tradeoff blur together
- `too slow` -> they over-analyze simple cases
- `fails when mixed` -> multi-cause cases make them collapse back into “just try harder”
- `fails after disruption` -> one confusing detail breaks the classification
- `fails in real conditions` -> the classifier works on toy examples but not on actual work

## Stage 0: Orientation

Goal:

- understand that “hard problem” is not one thing

Best drills:

- compare two goals with different dominant bottlenecks
- explain why “more information” does not fix every problem
- answer the question: “Do I lack the path, execution, resources, or prioritization?”

Pass rule:

- one-sentence explanation of the four-way split
- 4 clean examples matched to the right type

Fallback rule:

- if every problem still looks like a search problem, stay here

## Stage 1: Isolation

Goal:

- own one clean prototype of each problem type

Best drills:

- one search example
- one execution example
- one constraint example
- one tradeoff example

Daily block:

- 5 min read 4 prototypes
- 5 min classify without looking
- 5 min explain why each is not one of the other three

Pass rule:

- 4 out of 4 clean prototypes classified and explained correctly

Common error owner:

- `cannot recognize`
- `confuses neighbors`

## Stage 2: Clean Repetition

Goal:

- stabilize the diagnostic questions on short clean cases

Best drills:

- classify 10 short cases
- justify the dominant bottleneck in one sentence
- choose one smallest next move after classification

Anchor drill:

- 10 single-paragraph cases with one dominant type

Stretch drill:

- 5 short math-study cases plus one best next move

Repair drill:

- rewrite every wrong answer using the fast diagnostic:
- do I know the next valid move
- if I know it, can I do it reliably
- if I can do it, is something external blocking it
- if several valid moves remain, is this a value conflict

Pass rule:

- 8 out of 10 clean cases classified correctly
- at least 4 out of 5 next moves fit the classification

Fallback rule:

- if explanations stay vague, return to prototypes

## Stage 3: Controlled Variation

Goal:

- see that the same goal can fail for different reasons

Best drills:

- take one goal and generate four versions:
- one search version
- one execution version
- one constraint version
- one tradeoff version

Examples:

- “learn calculus”
- “finish the proof”
- “write the project”
- “prepare for the exam”

Pass rule:

- can reclassify the same surface goal under different dominant gaps
- can explain why the correct fix changes with the type

Common error owner:

- `cannot execute`
- `confuses neighbors`

## Stage 4: Automaticity

Goal:

- classify early instead of after wasting effort

Best drills:

- 30-second case classification
- one-sentence dominant bottleneck label
- one-sentence next move

Target metrics:

- faster classification
- less defaulting to “I need more theory”
- smaller delay between noticing friction and naming the type

Pass rule:

- 8 out of 10 medium cases classified inside the time budget

Fallback rule:

- if speed destroys accuracy, remove timing and return to Stage 3

## Stage 5: Mixing

Goal:

- handle near-neighbor and mixed cases without collapsing

Best drills:

- mixed cases where two bottlenecks are present
- choose the dominant type first and secondary type second
- compare similar cases that differ only by one real blocker

Anchor drill:

- label dominant and secondary bottleneck

Stretch drill:

- mixed math-study packet: classify 10 cases and route each one

Repair drill:

- explain why the wrong chosen type looked tempting

Pass rule:

- dominant type is correct in at least 8 out of 10 mixed cases
- secondary type is reasonable in most remaining cases

This is where the classifier stops being a toy.

## Stage 6: Pressure And Noise

Goal:

- classify under incomplete, messy, or time-pressured conditions

Best drills:

- quick verbal cases
- interrupted case descriptions
- partial information first, more information later
- classify before the full story is known, then update

Good pressure variants:

- time limit
- noisy wording
- emotionally charged case
- unclear or misleading surface detail

Pass rule:

- can hold a provisional classification and revise it without confusion
- can avoid jumping straight into the wrong tool

Common error owner:

- `fails after disruption`
- `fails in real conditions`

## Stage 7: Transfer And Zenith

Goal:

- use the classifier inside real study and problem-solving work

Best drills:

- classify a real stuck point from current math study
- classify a proof failure
- classify a planning failure
- classify a repeated execution collapse
- reclassify five past failures

Zenith tests:

- classify before choosing tools in live work
- route search problems toward representation and probing
- route execution problems toward drills and follow-through
- route constraint problems toward feasibility changes
- route tradeoff problems toward explicit criteria and decision review

Pass rule:

- five real cases classified with plausible corrective action

## First Two Weeks

Use this if you are starting almost from zero.

### Week 1

- Day 1: read the four types and match one prototype each
- Day 2: classify 8 clean cases
- Day 3: explain why each case is not one of the other three
- Day 4: add one next-move recommendation per case
- Day 5: classify five math-study or learning cases

Exit test:

- 8 out of 10 clean cases classified correctly
- can state the fast diagnostic from memory

### Week 2

- Day 1: same goal, four bottlenecks exercise
- Day 2: mixed cases with dominant plus secondary type
- Day 3: 30-second classification set
- Day 4: classify three real current failures
- Day 5: reclassify five old failures

Exit test:

- same-goal variation is clear
- real cases no longer default automatically to search gap

## Minimum Daily Session

If time is limited, do only this:

1. classify 5 short cases
2. justify each in one sentence
3. choose one next move
4. rework the weakest wrong answer

That is enough to keep the classifier active.

## Worked Drill-Generator Snapshot

```yaml
skill: problem-type recognition
skill_type: judgment
real_target: classify the dominant bottleneck before choosing tools
current_stage: 2
failure_mode: confuses neighbors

anchor_drill:
  family: discrimination
  prompt_shape: classify 10 clean cases into search, execution, constraint, or tradeoff
  reps: 10
  constraint: one dominant type only
  pass_rule: 8/10 correct

stretch_drill:
  family: controlled variation
  prompt_shape: rewrite one goal into four different bottleneck versions
  reps: 4
  constraint: each version needs a different next move
  pass_rule: 4/4 distinct and plausible

repair_drill:
  family: explanation repair
  prompt_shape: take each wrong answer and run the fast diagnostic again
  reps: 3
  constraint: explain why the first classification was wrong
  pass_rule: 3/3 corrected with clear reasoning
```

## Bottom Line

The right order for this skill is:

1. learn the four types cleanly
2. classify short cases
3. vary the same goal across different bottlenecks
4. classify faster
5. handle mixed and ambiguous cases
6. use it on real failures

That is the first real drill ladder for problem-type recognition in Neural OS.


---

## U — See (CAST)
1. Drill for classifying dominant bottleneck before tool choice
2. 4-way split: search · execution · constraint · tradeoff

## D — Name (NEDF)
1. Problem type recognition drill ladder = bottleneck-classification ladder
2. Distinguisher: classify before tool
3. Failure mode: tool-first instead of class-first

## F — Do (SPEAR)
1. Problem → classify in 4 types
2. Pick method by class

## B — Watch (HEART)
1. Tool-bias
2. Misclassification

## L — Predict (ORACLE)
1. Symptom → predict class
2. Class → predict method

## R — Act (GRACE)
1. Problem appears → classify first
2. Stuck → re-classify