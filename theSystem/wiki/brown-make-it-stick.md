---
palace: meta-knowledge
level: 8
domain: 10
room: 13
semantic_mode: 5
wiki_source: wiki/learning-systems/brown-make-it-stick.md
---

# Make It Stick (Brown, Roediger & McDaniel)

**Summary**: *Make It Stick: The Science of Successful Learning* (Brown, Roediger & McDaniel, Belknap/Harvard University Press 2014) is the trade-book synthesis of ~40 years of cognitive-psychology research on durable learning, written by science writer Peter C. Brown with two leading memory researchers — Henry L. Roediger III and Mark A. McDaniel (Washington University in St. Louis). Its single thesis: **learning that feels easy is usually shallow; effortful retrieval plus spaced, interleaved, and varied practice feel harder but produce durable, flexible mastery** — the [desirable-difficulty](./desirable-difficulties.md) principle. The book is the wiki's primary-source backstop for [retrieval practice](./active-recall.md), [spaced-repetition](./spaced-repetition.md), [interleaving](./interleaving.md), [elaboration](./elaboration.md), [generation](./generation-effect.md), and the [fluency-illusion](./fluency-illusion.md). This page is the source-summary / routing owner — each technique it popularized is *defined on its own concept page*, not here.

**Sources**:
- Brown, P. C., Roediger, H. L., III, & McDaniel, M. A. (2014). *Make It Stick: The Science of Successful Learning*. Belknap Press of Harvard University Press.
- Underlying research: Roediger & Karpicke (2006), "Test-Enhanced Learning," *Psychological Science*; Bjork & Bjork (2011) desirable-difficulties framework.
- Internal concept owners: [active-recall](./active-recall.md), [spaced-repetition](./spaced-repetition.md), [interleaving](./interleaving.md), [desirable-difficulties](./desirable-difficulties.md), [elaboration](./elaboration.md), [generation-effect](./generation-effect.md), [fluency-illusion](./fluency-illusion.md), [mental-models-for-learning](./mental-models-for-learning.md).

**Last updated**: 2026-06-30

---

## What the book is

A T1-canonical scientific spine for the wiki's `learning-systems/` cluster. Before this source was ingested the cluster cited these principles secondarily; *Make It Stick* is the primary, peer-research-backed statement of them in one place. Its job in Neural OS is **citation backstop + routing**: it is the named source behind retrieval practice, spacing, interleaving, and the fluency illusion, but it does not own their operational definitions — the concept pages do.

## The central claim — effortful = durable

The book's load-bearing argument: the *feeling* of fluency during study (produced by re-reading, highlighting, massed cramming) is a poor and often inverted signal of actual learning. Conditions that introduce **[desirable difficulty](./desirable-difficulties.md)** — making retrieval effortful, spacing sessions apart, mixing problem types — depress in-the-moment performance while *raising* long-term retention and transfer. "Learning is deeper and more durable when it's effortful." (source: Make It Stick, Ch 1–2)

## The core techniques — each owned elsewhere

This table *routes*; it does not redefine. Each row gives only the book's framing of a concept whose full definition lives on the linked owner page.

| Brown's framing | Owner page |
|---|---|
| **Retrieval practice / the testing effect** — the book's headline move; producing an answer from memory strengthens it far more than re-reading | [active-recall](./active-recall.md) |
| **Spacing** — let some forgetting happen between sessions so retrieval is effortful again | [spaced-repetition](./spaced-repetition.md) |
| **Interleaving** — alternate related-but-distinct problem types instead of blocking; improves discrimination and transfer | [interleaving](./interleaving.md) |
| **Elaboration** — re-express new material in your own words and tie it to what you know | [elaboration](./elaboration.md) |
| **Generation** — try to answer/solve *before* being shown how | [generation-effect](./generation-effect.md) |
| **Calibration** — use objective feedback to correct the [illusion of knowing](./fluency-illusion.md) | [fluency-illusion](./fluency-illusion.md) |
| **Building mental models** — knowledge assembled into structures, not isolated facts | [mental-models-for-learning](./mental-models-for-learning.md) |

## What it debunks

- **Re-reading and highlighting** feel productive but are among the weakest study methods — they manufacture fluency without retrieval (source: Ch 1).
- **Massed practice ("cramming")** produces fast gains that decay fast; spacing wins on durability (source: Ch 4).
- **"Learning styles"** lack supporting evidence — matching instruction to a claimed visual/auditory/kinesthetic style does not improve outcomes; the wiki owns this debunk at [learning-styles-myth](./learning-styles-myth.md) (source: Ch 6).

## How it sits in Neural OS

*Make It Stick* converges with the wiki's other two T1 learning-science spines: its **mental models** (Ch 1) are the same construct as [Ericsson's](./ericsson-peak.md) *mental representations* (single owner: [mental-models-for-learning](./mental-models-for-learning.md)), and its desirable-difficulty stance is the encoding-side twin of Ericsson's "push past the comfort zone." Willingham's domain-knowledge thesis ([factual-knowledge-precedes-skill](./factual-knowledge-precedes-skill.md)) supplies the precondition: retrieval practice only has something to retrieve once factual knowledge is in place. Operationally, the book is the research floor under the [red-queen-skill-gym](./red-queen-skill-gym.md) (difficulty-by-design) and [spaced-repetition](./spaced-repetition.md) scheduling; the [fluency-illusion](./fluency-illusion.md) is the failure mode every drill in the wiki is built to defeat.

## Visual

| EASY (feels like learning) | EFFORTFUL (is learning) |
|---|---|
| reread · highlight · cram | retrieve · space · interleave |
| fast fluency, fast decay | slow gain, durable hold |
| the FLUENCY ILLUSION | DESIRABLE DIFFICULTY |

```chart height=300
{"color":["#a07d78","#5c7a54"],
 "legend":{"data":["EASY — fluency illusion (spikes then fades)","EFFORTFUL — desirable difficulty (climbs and stays)"]},
 "xAxis":{"type":"category","data":["1","2","3","4","5","6","7","8","9","10"],"name":"time / practice →","nameLocation":"middle","nameGap":22,"axisLabel":{"show":false}},
 "yAxis":{"type":"value","name":"retained mastery","axisLabel":{"show":false}},
 "series":[
   {"name":"EASY — fluency illusion (spikes then fades)","type":"line","smooth":true,"data":[7,9,8,4,2,1,1,1,1,1]},
   {"name":"EFFORTFUL — desirable difficulty (climbs and stays)","type":"line","smooth":true,"data":[1,1,2,3,4,5,6,7,8,8]}
 ]}
```

## Mnemonic

**STICK** — the five moves that make learning *stick*: **S**pace · **T**est (retrieve) · **I**nterleave · **C**onnect (elaborate / generate) · **K**now-your-gaps (calibrate against the fluency illusion). If a study session uses none of the five, it is manufacturing fluency, not learning.

## Checksum

1. Which technique does *Make It Stick* put first, and why does re-reading lose to it? (Retrieval practice / the testing effect; re-reading produces the fluency illusion — familiarity is not recall.)
2. What does "desirable difficulty" mean, and name two of its forms. (Practice that feels harder in the moment but produces more durable learning; any two of spacing · interleaving · variation · generation.)
3. Which single concept does Brown share with Ericsson's *Peak* under one wiki owner? (Mental models = mental representations → [mental-models-for-learning](./mental-models-for-learning.md).)

## Related pages

- [ericsson-peak](./ericsson-peak.md) — T1 sister spine; comfort-zone-exit + mental representations
- [active-recall](./active-recall.md) · [spaced-repetition](./spaced-repetition.md) · [interleaving](./interleaving.md) · [elaboration](./elaboration.md) · [generation-effect](./generation-effect.md) — the techniques it popularized
- [desirable-difficulties](./desirable-difficulties.md) — the Bjork principle the whole book operationalizes
- [fluency-illusion](./fluency-illusion.md) — the failure mode it is built to defeat
- [mental-models-for-learning](./mental-models-for-learning.md) — shared owner of "mental models / mental representations"
- [learning-styles-myth](./learning-styles-myth.md) — the debunk it supports
- [factual-knowledge-precedes-skill](./factual-knowledge-precedes-skill.md) — Willingham's precondition for retrieval to work
- [red-queen-skill-gym](./red-queen-skill-gym.md) — where desirable difficulty becomes drill design
