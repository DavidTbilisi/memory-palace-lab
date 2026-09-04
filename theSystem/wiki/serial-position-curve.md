---
palace: meta-knowledge
level: 8
domain: 10
room: 15
semantic_mode: 5
wiki_source: wiki/learning-systems/serial-position-curve.md
---

# Serial Position Curve

**Summary**: The serial position curve is the U-shaped recall function discovered by Hermann Ebbinghaus (1885) and formalized by Bennet Murdock (1962): when learners are asked to recall a list of items in any order, **items at the beginning** (primacy effect — long-term memory advantage) and **items at the end** (recency effect — working memory advantage) are recalled best, while items in the middle are recalled worst. The **Von Restorff effect** (Hedwig von Restorff, 1933) — also called the **isolation effect** — modifies this baseline: any item that **stands out** from its neighbors in any sensory or semantic dimension is recalled at primacy/recency strength regardless of position. The serial position + Von Restorff pair is one of the oldest and most replicated findings in memory research, and operationalizes one of the wiki's load-bearing design moves: **deliberately isolate the items you most want recalled, by visual / semantic / positional contrast**. This page is the canonical owner.

**Sources**:
- Ebbinghaus, H. (1885). *Über das Gedächtnis* — first systematic demonstration of position effects on nonsense-syllable recall.
- Murdock, B. B. (1962). "The Serial Position Effect of Free Recall." *Journal of Experimental Psychology*, 64(5), 482-488. — canonical free-recall curve.
- Glanzer, M., & Cunitz, A. R. (1966). "Two Storage Mechanisms in Free Recall." *Journal of Verbal Learning and Verbal Behavior*, 5, 351-360. — dissociation of primacy (LTM) and recency (STM) via delayed recall.
- Von Restorff, H. (1933). "Über die Wirkung von Bereichsbildungen im Spurenfeld." *Psychologische Forschung*, 18, 299-342.
- Brown, Roediger & McDaniel (2014). *Make It Stick* — popular synthesis.
- Internal: [memory-palace](./memory-palace.md), [chunking](./chunking.md), [active-recall](./active-recall.md).

**Last updated**: 2026-06-09

---

## The curve

```chart height=340
{
  "title": {
    "text": "Serial Position Curve",
    "subtext": "Middle items are forgotten the most — this trough is the operational problem to be designed around."
  },
  "xAxis": {
    "type": "category",
    "name": "Serial position",
    "data": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⋯", "N-2", "N-1", "N"]
  },
  "yAxis": {
    "type": "value",
    "name": "Recall probability",
    "min": 0,
    "max": 1
  },
  "series": [
    {
      "type": "line",
      "smooth": true,
      "data": [1.0, 0.82, 0.68, 0.55, 0.45, 0.38, 0.32, 0.28, 0.25, 0.22, 0.45, 0.7, 1.0],
      "itemStyle": {"color": "#5c7a54"},
      "areaStyle": {},
      "markPoint": {
        "data": [
          {"name": "Primacy effect (LTM)", "coord": ["1", 1.0]},
          {"name": "Recency effect (STM)", "coord": ["N", 1.0]}
        ]
      }
    }
  ]
}
```

## Two mechanisms, one curve

Glanzer & Cunitz (1966) showed primacy and recency come from **two separate memory stores**:

- **Primacy** comes from **long-term memory**: early items had more rehearsal opportunity, more attention, less interference. Removing rehearsal (filled-delay during encoding) attenuates primacy.
- **Recency** comes from **working memory** / short-term memory: late items are still in WM at recall. Inserting a brief distractor task between the last item and recall *eliminates recency* but leaves primacy intact.

The U-shape is therefore not one effect but the **sum of two**. This is also why the curve looks different across delays — immediate recall shows full U; delayed recall (after a distractor) shows only the primacy peak.

## The Von Restorff (isolation) effect

If one item in the middle of a list is **isolated** — by color, font, size, semantic category, or any salient dimension — it is recalled at primacy/recency strength regardless of position. A red word in a list of black words; an animal in a list of furniture; a CAPITALIZED item among lowercase; an item with weird spelling.

Mechanism: the isolated item gets **enhanced attention at encoding** (it stands out, attention dwells) and **enhanced cue distinctiveness at retrieval** (its unique feature is its own retrieval handle). Both effects multiply.

The Von Restorff effect is the **designable lever** on the otherwise-fixed serial-position curve. The curve says "middle items are weak." Von Restorff says "isolate the middle items you care about, and they become strong."

## Operational consequences

For any list, deck, lesson, talk, or palace tour:

1. **Front-load the most important items** — primacy is free.
2. **End-load the call-to-action / takeaway** — recency is free.
3. **Isolate the middle items you care most about** — visual / semantic / positional contrast.
4. **Chunk long lists** to add more "starts" and "ends." Murdock's U is one curve; eight chunks of five items each give eight Us, with the worst-recalled items being 8 × middle-of-five, not 1 × middle-of-forty.
5. **Insert a distractor before evaluating retention** — if you only care about durable (LTM) memory, plan a delay so recency illusion doesn't inflate your assessment.

## In the wiki / Neural OS

The serial position curve is operationally present in:

- [memory-palace](./memory-palace.md) — palace tours benefit from primacy/recency at tour start/end; mid-tour loci use [chunking](./chunking.md) + Von Restorff isolation
- [chunking](./chunking.md) — chunk boundaries create new primacy/recency anchors; long lists become many short Us
- [active-recall](./active-recall.md) — drill cards naturally interleave, but a study session's card order still produces a serial-position pattern
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — new-card position in daily session matters; place high-leverage items first or last
- Lesson/lecture/talk design — the "tell them what you'll tell them, tell them, tell them what you told them" structure leverages primacy + recency
- [mnemonic-methods-master](./mnemonic-methods-master.md) — chapter/page layout for memorability

## Failure modes (in design)

| Failure | What it produces |
|---|---|
| **Uniformly-formatted long list** | Middle items lost; learner remembers item 1, item N, nothing in between |
| **Important content buried in the middle** | Predictably the *least* memorable position; either move it or isolate it |
| **Evaluating retention immediately after exposure** | Recency inflates apparent retention; add a delay before measuring |
| **No chunking** | One long U with deep middle trough |
| **Over-isolation** | Too many "standouts" cancel out (everything that's different stops being different) |

## Failure modes (in retrieval interpretation)

- **"I remember the beginning and end of the meeting, the middle is gone"** — that is the curve, not your memory failing
- **"I remember the bullet points but not the prose between"** — bullets isolate (Von Restorff); prose homogenizes (middle trough)
- **"This list of 20 names feels impossible"** — without chunking + isolation, it is roughly so; design before delivery

## Related pages

- [memory-palace](./memory-palace.md) — palace tours and chunking interaction
- [chunking](./chunking.md) — adds chunk boundaries → more starts/ends
- [active-recall](./active-recall.md)
- [spaced-repetition](./spaced-repetition.md) — operates per-item independent of position
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — session-order matters
- [mnemonic-methods-master](./mnemonic-methods-master.md)
- [mental-markers-category-importance-order](./mental-markers-category-importance-order.md) — explicit isolation lever
- [encoded-spaced-repetition](./encoded-spaced-repetition.md)

---

## U — See (CAST)
1. U-shape: first and last items remembered, middle lost
2. Isolation rescues middle items (Von Restorff)

## D — Name (NEDF)
1. Serial position curve = primacy + recency + middle trough
2. Distinguisher: primacy from LTM, recency from STM (two stores)
3. Von Restorff: isolated item → primacy/recency strength regardless of position

## F — Do (SPEAR)
1. Front-load + end-load the most important items
2. Isolate middle items you care about (visual / semantic / positional contrast)
3. Chunk long lists; each chunk gets its own start/end

## B — Watch (HEART)
1. "Middle of the talk is hazy" → predicted by curve
2. Long uniform list → middle will fall off

## L — Predict (ORACLE)
1. Important content in middle without isolation → it will be forgotten
2. Isolated middle item → recalled with first/last

## R — Act (GRACE)
1. Designing a lesson → place high-stakes at start/end or isolate
2. Reviewing notes → predict middle gaps; quiz that span first
