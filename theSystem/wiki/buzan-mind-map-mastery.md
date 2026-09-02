---
palace: meta-knowledge
level: 8
domain: 10
room: 18
semantic_mode: 5
wiki_source: wiki/learning-systems/buzan-mind-map-mastery.md
---

# Buzan: *Mind Map Mastery* / *The Mind Map Book*

**Summary**: Tony Buzan's *Mind Map* writings — *The Mind Map Book* (1996), *Mind Map Mastery* (2018) — formalize **Radiant Thinking** (every thought radiating from a central image into branching associative trees) as the externalization protocol that matches the brain's actual organization. The **7 Laws of Mind Mapping** (central image · single keyword per branch · curved organic branches · colour · imagery · radial hierarchy · personal style) operationalize Radiant Thinking into a drawable artifact. The mind-map is not a note-taking gimmick — Buzan's claim is that it is the *natural* form thinking takes, and that linear note-taking is the unnatural compression. Whether or not the strong claim survives empirical scrutiny (it largely does — concept-mapping research confirms structure-externalization benefits for comprehension, recall, and creative ideation), the operational form has been adopted broadly enough to be one of the most-recognized study tools globally. This page is the canonical owner.

**Sources**:
- Buzan, T. (1996). *The Mind Map Book*. BBC Books. — canonical presentation; original 7 Laws.
- Buzan, T. (2018). *Mind Map Mastery*. Watkins. — late-career restatement; the *Mind Map Mastery* certification curriculum.
- Buzan, T. (1974). *Use Both Sides of Your Brain*. — earlier presentation introducing the technique.
- Nesbit, J. C., & Adesope, O. O. (2006). "Learning with Concept and Knowledge Maps: A Meta-Analysis." *Review of Educational Research*, 76(3), 413-448. — empirical support for the genus (concept maps including but broader than mind maps).
- Internal: [buzan-your-memory](./buzan-your-memory.md), [mental-models-for-learning](./mental-models-for-learning.md), [chunking](./chunking.md), [mnemonic-methods-master](./mnemonic-methods-master.md).

**Last updated**: 2026-06-09

---

## Radiant Thinking

Buzan's foundational claim: thinking is **radiant**, not linear. From any node, association radiates outward in multiple directions simultaneously; tracing one line forward (the form a linear note takes) loses the parallel structure. The mind-map is the **artifact** that preserves the radial structure.

```p5 height=400
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 400); p.noLoop(); };
p.draw = () => {
  const W = p.width, H = p.height;
  p.background(p.isDark ? 30 : 245);
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const cx = W / 2, cy = H / 2;
  const cols = ['#5c7a54', '#7d8aa0', '#a08a5c', '#a07d78', '#808a90', '#6a8f86'];
  const nB = 6;
  const r1 = Math.min(W, H) * 0.30, r2 = Math.min(W, H) * 0.46;
  p.textAlign(p.CENTER, p.CENTER);
  for (let k = 0; k < nB; k++) {
    const ang = -Math.PI / 2 + k * (2 * Math.PI / nB);
    const bx = cx + r1 * Math.cos(ang), by = cy + r1 * Math.sin(ang);
    const col = cols[k % cols.length];
    p.noFill(); p.stroke(col); p.strokeWeight(3);
    const mx = cx + r1 * 0.55 * Math.cos(ang + 0.28), my = cy + r1 * 0.55 * Math.sin(ang + 0.28);
    p.bezier(cx, cy, mx, my, mx, my, bx, by);
    for (let s = -1; s <= 1; s += 2) {
      const sa = ang + s * 0.34;
      const sx = cx + r2 * Math.cos(sa), sy = cy + r2 * Math.sin(sa);
      p.noFill(); p.stroke(col); p.strokeWeight(1.6);
      const lx = bx + (sx - bx) * 0.5 + 6 * Math.cos(sa + 1.2);
      const ly = by + (sy - by) * 0.5 + 6 * Math.sin(sa + 1.2);
      p.bezier(bx, by, lx, ly, lx, ly, sx, sy);
      p.rectMode(p.CENTER); p.stroke(col); p.strokeWeight(1.4); p.fill(p.isDark ? 45 : 255);
      p.rect(sx, sy, 42, 18, 5);
      p.noStroke(); p.fill(ink); p.textSize(9); p.text('sub', sx, sy);
    }
    p.rectMode(p.CENTER); p.stroke(col); p.strokeWeight(1.8); p.fill(p.isDark ? 45 : 255);
    p.rect(bx, by, 60, 22, 6);
    p.noStroke(); p.fill(col); p.textStyle(p.BOLD); p.textSize(11); p.text('BRANCH', bx, by);
    p.textStyle(p.NORMAL);
  }
  p.rectMode(p.CENTER); p.stroke(ink); p.strokeWeight(2.5); p.fill(p.isDark ? 55 : 235);
  p.rect(cx, cy, 132, 54, 8);
  p.noStroke(); p.fill(ink); p.textStyle(p.BOLD); p.textSize(13); p.text('CENTRAL IMAGE', cx, cy - 8);
  p.textStyle(p.NORMAL); p.textSize(10); p.text('(one concept)', cx, cy + 12);
};
```

The central image is the **anchor**; branches are the major dimensions; sub-branches are detail. Hierarchy is *radial*, not stacked.

## The 7 Laws of Mind Mapping

| # | Law | What it enforces |
|---|---|---|
| 1 | **Central image** | Anchor the map on one vivid drawing, not a word — image is the load-bearing memory hook |
| 2 | **Single keyword per branch** | One word, not a phrase — keywords are the recall units; phrases obscure structure |
| 3 | **Curved organic branches** | Avoid straight lines — curves match cortical biology and signal organic structure |
| 4 | **Colour** | One colour per major branch — colour codes structure and engages Buzan principle #9 |
| 5 | **Imagery throughout** | Sub-images at branch-ends — engages [Buzan's principle 6 Imagination](./buzan-your-memory.md) |
| 6 | **Radial hierarchy** | Thickness of branches decreases outward; main branches thick, leaves thin |
| 7 | **Personal style** | Idiosyncratic; the map must be the maker's, not a template — increases recall via personal-meaning binding |

Violating any one law weakens the map; violating 4+ produces what Buzan calls a "**spider diagram**" — branching but not radiant-thinking-grade.

## What mind maps are good for

- **Brainstorming / ideation** — radial structure encourages divergent branches before convergent selection
- **Lecture/book note-taking** — captures structure faster than linear notes; better recall on delayed tests (Nesbit & Adesope 2006)
- **Pre-writing** — externalizing argument structure before drafting prose
- **Curriculum mapping** — chapter-and-section structure of a domain
- **Meeting summaries** — capturing decisions + threads in a glance-readable form
- **Memory recall aid** — the [12 Principles](./buzan-your-memory.md) applied at full-map scale

## What mind maps are NOT good for

- **Linear narrative or argument** — sequence is poorly served by radial form
- **Quantitative comparison** — tables / charts are better
- **Dense reference material** — keywords lose precision required for technical reference
- **Inheriting someone else's structure** — mind maps work because the *act of making* installs the structure; copying a finished one captures less than half the value

## Comparison to concept maps (Novak)

Joseph Novak's **concept maps** (1972, predating Buzan's published mind-map work) share the externalization-of-structure goal but differ:

| | Concept map (Novak) | Mind map (Buzan) |
|---|---|---|
| Structure | Network — nodes can link to multiple parents | Tree — each node has one parent |
| Connections | Labeled (propositional verbs on every link) | Implicit (proximity + branch carries meaning) |
| Form | Linear, boxed | Radial, organic, image-rich |
| Best for | Conceptual analysis, ontology-style mapping | Brainstorming, recall, personal study notes |

Both are concept-mapping-research-supported (Nesbit & Adesope 2006); they serve different surfaces. The wiki's [mental-models-for-learning](./mental-models-for-learning.md) page treats them as members of the same intervention class.

## Mind Map Mastery's BOI (Basic Ordering Idea) protocol

Buzan's 2018 restatement adds the **BOI** concept: before drawing, identify the 5-9 *Basic Ordering Ideas* that will become major branches. The BOI selection step prevents the common failure mode of branching ad hoc and ending up with a sprawl. Procedure:

1. Read source material once for full sweep.
2. List 5-9 BOIs that cover the conceptual territory.
3. Each BOI becomes one major branch.
4. Detail enters as sub-branches off each BOI.

The BOI step is the discipline that distinguishes a Mind-Map-Mastery-grade map from a freeform sprawl.

## Failure modes

| Failure | Symptom | Mitigation |
|---|---|---|
| **Phrase-per-branch (Law 2 violation)** | Long captions; recall reads paragraphs not keywords | Single keyword; expand mentally during recall |
| **No central image (Law 1 violation)** | Map reads as outline; recall anchor weak | Replace title-text with a drawing |
| **No BOI step** | Sprawl, redundant branches | List 5-9 BOIs before drawing |
| **Borrowed map** | Inherited from teacher / Internet; low retention | Re-draw from memory in your own style |
| **Pure linear domain** | Sequence-critical content squeezed into radial form | Use timeline / outline / sequence diagram instead |

## Neural OS implementations

- mind-mapping — practical wiki-page for mind-mapping as study technique (paginated separately from Buzan's source presentation)
- [mental-models-for-learning](./mental-models-for-learning.md) — concept-mapping genus; mind maps are one form
- [chunking](./chunking.md) — BOI step IS chunking applied to source material
- [buzan-your-memory](./buzan-your-memory.md) — sister Buzan book; the 12 Principles are the encoding levers mind-maps deploy
- obsidian-plugin-stack — the wiki's digital graph view (alexw00/obsidian-3d-graph) is a high-fidelity mind-map at wiki scale
- [mnemonic-methods-master](./mnemonic-methods-master.md)

## Related pages

- [buzan-your-memory](./buzan-your-memory.md)
- mind-mapping
- [mental-models-for-learning](./mental-models-for-learning.md)
- [chunking](./chunking.md)
- [mnemonic-methods-master](./mnemonic-methods-master.md)
- [memory-palace](./memory-palace.md)
- obsidian-plugin-stack

---

## U — See (CAST)
1. Radial > linear: thinking is radiant; the map is the natural artifact
2. 7 Laws: central image · single keyword · curved · colour · imagery · radial hierarchy · personal style

## D — Name (NEDF)
1. Mind Map = central image + radial branches + 7 Laws applied
2. Distinguisher: tree (Buzan) vs network (Novak concept-map)
3. Failure mode: spider-diagram (branches without radiant-thinking discipline)

## F — Do (SPEAR)
1. Read source → identify 5-9 BOIs → central image → branch on BOIs → add curves + colour + imagery
2. Re-draw from memory to install structure (don't copy)

## B — Watch (HEART)
1. Phrase-per-branch creep → enforce single keyword
2. Sprawl after 5 minutes → BOI step was skipped

## L — Predict (ORACLE)
1. BOI-disciplined map → recall stays high for weeks
2. Sprawl map → recall fades like linear notes

## R — Act (GRACE)
1. New chapter / talk / book → mind map at end of pass (not during)
2. Stuck brainstorming → drop to central image + BOI list, then branch
