---
palace: core-memory
level: 7
domain: 10
room: 5
glyph: 🔦
wiki_source: wiki/cross-cutting/attention-framework.md
---

# Attention Framework

**Summary**: A resource-allocation model for managing focus. Treats attention as a finite, recoverable asset — not a moral trait — and provides an operating protocol for deep work blocks, abort conditions, and daily minimums.

**Sources**: raw/01 Core_Memory/Attention.md

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-04

---

## Core Claim

```
HQ Work = Time Spent × Intensity of Focus
```

Attention is not a moral trait. It is a resource allocation problem. Your default system should optimize for: depth over task-switching, energy-fit over clock-fit, one active target over many open loops, recovery before collapse.

This framework is the primary tool for **execution problems** — when you know what to do but are not doing it reliably. See [problem-type-classifier](./problem-type-classifier.md).

---

## Default Mode: Energy-Based Focus Blocks

Do not use rigid time theater. Use energy-based focus blocks:

1. Choose one clear target
2. Remove alternate tasks from sight
3. Work until quality drops sharply
4. Stop, recover, and decide whether to run another block

---

## Before Each Block

Write this before starting:

```
Target:
Output:
Block type: [deep / admin / shallow]
Likely distractor:
```

If the output is vague, the block will leak.

Ask:
1. What is the single most valuable task now?
2. What concrete output should exist at the end of this block?
3. What is likely to break my attention?

---

## Block Types

### Deep Block
Use for: writing, coding, hard learning, problem solving.

Rules: one target only, phone away, unrelated tabs closed, no inbox or chat unless required. If blocked, write the exact blocker before switching context.

### Admin Block
Use for: email, scheduling, cleanup, low-cognitive tasks.

Rule: batch them. Do not let them invade deep time.

---

## Abort Conditions

Stop or reset the block if:
- rereading the same line without progress
- switched tasks three times in a few minutes
- consuming inputs to avoid producing output
- the task is actually underspecified

When this happens, **diagnose the cause** before continuing:
- unclear goal
- missing prerequisite
- wrong representation
- low energy
- emotional resistance

Fix the cause. Do not grind.

---

## Recovery Protocol

When block quality drops:
1. Stand up
2. Walk briefly
3. Water
4. Breathe
5. Decide whether the next block should be deep, shallow, or stop for the day

Avoid pseudo-rest: random scrolling, tab wandering, low-grade input grazing. These burn attention without restoring it.

---

## Daily Minimum

A good day does not require perfection:
- 1 real deep block
- 1 important output
- 1 logged distraction pattern
- 1 clean shutdown note for tomorrow

---

## Weekly Review Questions

- What time / context produced my best blocks?
- What repeatedly fragmented me?
- Which tasks deserve protected depth next week?
- Which open loops should be killed, delegated, or deferred?

---

## Attention Rules

- Protect the first high-energy block for the hardest work
- Never begin with reactive noise if you need depth that day
- If the task is emotionally heavy, shrink the entry step
- If focus keeps failing, reduce scope before increasing force
- If a task repeatedly causes avoidance, rewrite the task definition

---

## Integration With Neural OS

The Attention Framework solves **execution problems**. When the [problem-type-classifier](./problem-type-classifier.md) identifies that the bottleneck is not knowledge but follow-through, this is the tool.

Attention is also the upstream gate the entire memory stack depends on: material that never received a genuine attention pass cannot be encoded, no matter which mnemonic technique is applied afterward. See [memory-is-residue-of-thought](./memory-is-residue-of-thought.md) for that precondition and its "junk attic" failure mode — vivid imagery bolted onto unattended material, which fails silently because the encoder still runs.

Abort condition diagnosis links directly back to the problem-solving stack:
- "unclear goal" → return to [frame-forge](./frame-forge.md) Frame step
- "missing prerequisite" → return to [frame-forge](./frame-forge.md) Inventory or use [NEDF](./nedf-overview.md)
- "wrong representation" → return to [frame-forge](./frame-forge.md) Represent step
- "emotional resistance" → reduce entry cost, shrink the first action

---

## Related Pages

- [problem-type-classifier](./problem-type-classifier.md)
- [decision-kernel](./decision-kernel.md)
- [frame-forge](./frame-forge.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [memory-is-residue-of-thought](./memory-is-residue-of-thought.md) — the memory-encoding precondition this framework's attention lever operationalizes


---

## U — See (CAST)
1. Attention as finite, recoverable resource
2. Operating protocol with deep work blocks + daily minimums

## D — Name (NEDF)
1. Attention framework = resource-allocation model for focus
2. Distinguisher: not moral trait — recoverable asset
3. Failure mode: treating fatigue as discipline failure

## F — Do (SPEAR)
1. Daily → schedule deep work blocks
2. Abort conditions → respect them

## B — Watch (HEART)
1. Pushing past abort conditions
2. Skipping daily minimums

## L — Predict (ORACLE)
1. State → predict attention capacity
2. Block schedule → predict output

## R — Act (GRACE)
1. Day start → set blocks
2. Abort signal → switch to recovery

## Mnemonic

**"A torch, not a virtue."** Attention is a battery you point, not a character trait you have: it runs down, it recharges on a schedule, and aiming it is a decision. The whole reframe lives in one consequence — **aborting a block is a reading, not a failure.**

## Checksum

1. What is the core reframe — attention is what kind of thing, and explicitly not what?
2. Name three abort conditions.
3. A block aborts. What does the page say to do instead of pushing through?


## Visual

**A block, and the abort branch that makes it honest.**

```
   ┌─────────────────────────────────────────────┐
   │  BEFORE   name the one output of this block │
   └──────────────────────┬──────────────────────┘
                          ▼
                   ┌─────────────┐
                   │   RUN       │◀───────────┐
                   └──────┬──────┘            │
                          │                   │
              abort condition met?            │
                    ╱          ╲              │
                  no            yes           │
                  ╱               ╲           │
           ┌─────▼─────┐    ┌──────▼──────┐   │
           │  finish   │    │  DIAGNOSE   │   │
           └───────────┘    │ then recover│───┘
                            └─────────────┘
```

Aborting is a **reading**, not a failure — the battery is low, or the task was underspecified. Pushing through discards the reading.

