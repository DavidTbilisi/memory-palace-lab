---
palace: meta-knowledge
level: 8
domain: 10
room: 58
semantic_mode: 5
wiki_source: wiki/learning-systems/metalearning.md
---

# Metalearning — Young

**Summary**: **Metalearning** is Scott Young's principle #1 from *[Ultralearning](./young-ultralearning.md)* (2019): **the research-and-mapping phase that runs before learning begins**. Its three components are the **Why-What-How method** (why am I learning this · what are its concepts, facts, and procedures · how will I structure the campaign), **expert interviews** (ask someone who has already done it, rather than deriving the map alone), and a budget — roughly **~10% of total project time** spent on mapping rather than studying. The claim is about *allocation*, not mechanism: it does not say mapping teaches you anything, it says that a campaign which skips mapping optimises a route it never checked. It is the one step in the learning canon with no competition — every other principle governs what happens *inside* a session; this one governs whether the sessions are aimed at the right thing.

**Sources**:
- Young, S. H. (2019). *Ultralearning*. HarperCollins/Thorsons. — principle #1; via [young-ultralearning](./young-ultralearning.md).
- Internal: [directness-principle](./directness-principle.md) (Young's principle #3, the constraint metalearning's output must satisfy), [frame-forge](./frame-forge.md) (the wiki's problem-side sibling of the mapping step), difficulty-estimator.
- **Provenance flag**: **data-loss reconstruction** (2026-08-23) — the original page was authored in the 2026-05-29 ingest and never committed. Rebuilt from the surviving [glossary](./glossary.md) row, which is the source of the Why-What-How / expert-interview / ~10% content stated above. The source text is no longer in `raw/`; no finer detail is claimed, and the 10% figure is Young's rule of thumb, not a measured optimum.

**Last updated**: 2026-08-23

---

## The three components

| Component | The question it answers | Failure if skipped |
|---|---|---|
| **Why** | Am I learning this instrumentally (to do a specific job) or intrinsically? | The finish line is undefined, so the project cannot end — only be abandoned |
| **What** | What are the **concepts** (need understanding), **facts** (need memorising), and **procedures** (need practising)? | Every item gets the same treatment; facts get drilled like procedures and concepts get memorised |
| **How** | What structure, sequence, and resources will the campaign use? | Method is chosen ad hoc per session, usually toward whatever is most comfortable |

The **What** row is doing the most work and is the least obvious. Splitting material into concepts / facts / procedures is a *routing* decision, and it is the same decision the wiki's encoder spine makes when it sends material to [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), or [SPEAR](./spear-overview.md) by asking what kind of thing it is. Young arrives at a three-way split where Neural OS uses six encoders; the shared move is that **the material's type determines the method**, and choosing method before typing the material is the error.

## Expert interviews — the cheapest step, most often skipped

The second component is a shortcut, not a technique: ask someone who has already completed the thing you are attempting what they would do differently. The reason it belongs inside a *learning* principle rather than being ordinary common sense is the asymmetry — a map costs the expert minutes to describe and costs the novice weeks to derive by walking the terrain. Skipping it is the highest-multiple mistake available in the whole framework.

## The ~10% budget

Young's rule of thumb is to spend on the order of **10% of projected project time** on metalearning — a 100-hour campaign gets ~10 hours of mapping. Two guards keep the number honest:

- **It is a proportion, not a duration.** A weekend project does not get ten hours; it gets a couple. Treating 10% as a fixed block turns mapping into procrastination with a justification.
- **It is a budget, not a gate.** The map is revised while the campaign runs, because early study reveals what the map got wrong. Front-loading *all* mapping assumes the novice can produce a correct map before knowing anything, which is precisely the state metalearning exists to escape.

The number is a heuristic from Young's own campaigns, not a measured optimum, and this page does not claim more for it than that.

## Why it has no competitor in the canon

Every other principle in the learning canon operates **inside** a chosen direction. [active-recall](./active-recall.md) makes retrieval durable; [spaced-repetition](./spaced-repetition.md) fights decay; [interleaving](./interleaving.md) forces discrimination; [deliberate-practice](./deliberate-practice.md) structures the session. All of them make you faster at whatever you have already decided to do. Metalearning is the only one that asks **whether the target is right** — and a well-executed session aimed at the wrong material is the single most expensive error in a self-directed project, because nothing inside the session reports it.

This is the learning-project instance of a pattern the wiki holds in several places: rate without direction is not progress. The systems-thinking statement of it is the placement of goals above self-organisation on meadows-12-leverage-points; the resource statement is idle-resource-is-adversarial §Why the endogenous slope is not the master variable. Metalearning is where that lands in a learning campaign.

## Relationship to directness

[directness-principle](./directness-principle.md) (Young's #3) is the **constraint metalearning's output must satisfy**. The **How** component chooses a campaign structure; directness says that structure must resemble the real performance context. Run in the wrong order — picking a comfortable structure first, then justifying it — and metalearning becomes rationalisation. The two principles are ordered for this reason, and the same ordering logic puts Drill after Directness in [the nine](./young-ultralearning.md).

## Failure modes

| Failure | What it produces |
|---|---|
| **Mapping as procrastination** | Weeks of resource-gathering and syllabus-comparing; the campaign never starts. The budget is a *cap*, not a target |
| **Mapping once and never revising** | The map is built at the point of least knowledge and then frozen; early study can no longer correct it |
| **Skipping the expert interview** | Weeks spent deriving what a conversation would have supplied — the highest-multiple avoidable cost |
| **Skipping the What split** | Concepts, facts, and procedures all get one method; the routing decision is never made |
| **Treating 10% as a duration** | A fixed block regardless of project size; small projects drown in planning |

## Visual

```
   BEFORE the first study session
   ═══════════════════════════════
        WHY  ──▶ what does "done" look like?
         │
        WHAT ──▶ ┌ concepts   → understand
         │        ├ facts      → memorise
         │        └ procedures → practise        ◀── the routing decision
         │
        HOW  ──▶ structure + sequence + resources
                        │
                        ▼  must satisfy DIRECTNESS (#3)
                 ┌──────────────┐
   ~10% ─────────│  the campaign │──────── revise the map as it runs
   of budget     └──────────────┘              (not a one-time gate)
```

## Mnemonic

**Map before you march.** Three questions — *why · what · how* — one phone call to someone who already went, and a tenth of the budget. Every other principle makes you faster; only this one checks the heading.

## Checksum

1. What are the three components, and which one is the routing decision? (Why-What-How; **What** — splitting material into concepts / facts / procedures decides the method for each.)
2. Why is the ~10% a cap rather than a target, and why must the map be revised? (A fixed block turns mapping into justified procrastination; and the map is built at the point of least knowledge, so early study is what corrects it.)
3. What does metalearning do that no other principle in the canon does? (Asks whether the target is right at all — every other principle optimises inside an already-chosen direction, and nothing inside a session reports a wrong target.)

## Related pages

- [young-ultralearning](./young-ultralearning.md) — the source book and the other eight principles
- [directness-principle](./directness-principle.md) — Young's #3; the constraint this principle's output must satisfy
- [frame-forge](./frame-forge.md) — the wiki's problem-side sibling; its Inventory step is the same move on resources
- difficulty-estimator — what the **What** split feeds: how hard is this, and in what order
- [nedf-overview](./nedf-overview.md) · [cast-overview](./cast-overview.md) · [spear-overview](./spear-overview.md) — the wiki's finer-grained version of the same material-type routing
- meadows-12-leverage-points — goals above self-organisation; the systems statement of "direction beats rate"
- idle-resource-is-adversarial — §Why the endogenous slope is not the master variable; the resource statement of the same
