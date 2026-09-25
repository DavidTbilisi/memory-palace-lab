---
palace: meta-knowledge
level: 7
domain: 10
room: 204
semantic_mode: 5
glyph: 🪛
wiki_source: wiki/logic/diagram-rendering-defaults.md
---

# Diagram Rendering Defaults

**Summary**: For a hand-authored concept diagram the default production path is **SVG-first** — write the file, do not open a canvas. This page owns *which path is the default and on what evidence*; the four-path taxonomy itself belongs to [representation-rules](./representation-rules.md) §Rendering path. Promoted 2026-09-06 from a frontier hypothesis opened 2026-06-08, on four verified renders in four different shape vocabularies.

**Sources**:
- `wiki/_meta/frontier/hypotheses.md` — hypothesis *SVG-first beats Excalidraw-default*, opened 2026-06-08, promotion-ready 2026-09-06
- `wiki/_meta/frontier/anomalies.md` — the canvas-server anomaly, 2026-06-08, resolved 2026-09-06
- [ARC](./arc-framework.md) loop `slv-20260906-1` (the promotion check) and `slv-20260905-2` (the sibling anomaly)
- [representation-rules](./representation-rules.md) §Rendering path — owner of the path taxonomy
- The four rendered artifacts named in §The evidence

**Last updated**: 2026-09-06 (page created on promotion of the 2026-06-08 hypothesis)

---

## The default

**Write the SVG. Do not open a canvas.**

A hand-authored concept diagram is a text file that happens to draw. Producing it through an interactive canvas costs a server on port 3000, a browser tab, a desktop interruption, and a silent failure in any headless context — for an artifact of thirty lines that a text editor could have produced directly.

The default holds under all four of these conditions at once:

- **≤10 shapes**
- **labels only** — no freehand annotation, no sketch texture
- **no animation**
- **no by-eye iteration** — you know roughly where things go before you start

Miss one and the default is off; see §When the canvas still wins.

**Boundary**: the four production paths (hand-authored SVG · generator script · `mcp-draw` · interactive canvas MCP) and their routing are defined once, in [representation-rules](./representation-rules.md) §Rendering path. This page adds only the default among them and the evidence for it.

## The evidence

The hypothesis set its own bar: three more successful SVG-first renders in domains with **different shape vocabularies**. Four cleared it, each verified free of the `svg-source:excalidraw` export signature — an Excalidraw export is not evidence for hand-authoring:

| Artifact | Shape vocabulary |
|---|---|
| `wiki/diagrams/french-b1-skill-dependencies.svg` | dependency network |
| `wiki/diagrams/number-codec-ladder-steps.svg` | ordered ladder |
| `wiki/assets/observer-inside-method.svg` | spatial frame |
| `wiki/diagrams/first-million-timeline.svg` | timeline |

Four vocabularies matter more than four files: a method that works only for boxes-and-arrows is a trick, not a default.

## What the evidence is not

The first pass at this promotion nearly used the wrong number. Repo-wide counts since 2026-06-08 read **74 new SVGs against 47 Excalidraw files** — an apparently decisive win. **56 of those SVGs are video assets** under `media/texts`. Counted where the claim actually applies, inside the wiki, it is **15 versus 15**, and the vault's own `Excalidraw/` folder gained 31 files in the same window.

So volume says the opposite of what it first appeared to say: **neither format has displaced the other**, and this page's claim rests entirely on the four renders above. The correction is recorded here rather than quietly dropped, because a default adopted on a confounded count is a default that will be re-litigated the first time someone re-runs the count honestly.

This is the second instance of one failure mode in two [ARC](./arc-framework.md) loops — a headline number that reverses when disaggregated by the population it claims to describe. The other was a 2,746-line diffstat that turned out to be 2 real insertions under CRLF churn.

## When the canvas still wins

The interactive canvas is the fallback, not the enemy. Reach for it when:

- **the layout is discovered by eye** — you are moving things until the picture reads, which is exactly what a canvas is for
- **the diagram is large or organic** — beyond ~10 shapes, hand-writing coordinates stops being cheaper than dragging them
- **the hand-drawn register is the point** — Excalidraw's sketch texture carries a deliberate informality that clean SVG does not
- **it already lives there** — the `Excalidraw/` library is a real corpus; editing an existing scene beats re-authoring it

A diagram that outgrows SVG mid-flight is not a failure of the default. Export what exists, open the canvas, and note the crossing — repeated crossings are the signal that the ≤10-shape threshold is set wrong.

## Refutation

The hypothesis's refutation criterion survives promotion and stays live: **any case where SVG hand-authoring takes >3× the time of an Excalidraw round-trip, or where the SVG output is visibly worse than what Excalidraw would have produced.** Two such cases inside the stated conditions and this page's default is wrong, not merely inconvenient.

Log a crossing where it will be counted — the frontier register, as a dead-end entry — rather than absorbing it silently. A default nobody can falsify is a habit with a page.

## Related pages

- [representation-rules](./representation-rules.md) — Rule 1 diagram-first, the diagram-type routing table, and §Rendering path, which owns the four-path taxonomy this page picks a default from
- tools-over-intelligence — the artifact-over-effort principle this default is an instance of: a diagram frozen into a text file stops needing a running server
- [arc-framework](./arc-framework.md) — the loop that ran the promotion check
- glyph-grammar-pattern — the other consumer of hand-authored SVG in this wiki, where the alphabet primitives are drawn

---

## U — See (CAST)
1. Four production paths; three need no server
2. SVG-first is the default node, canvas the fallback edge

## D — Name (NEDF)
1. Diagram rendering default = write the SVG, don't open a canvas
2. Distinguisher: about the *path*, not the *diagram type* ([representation-rules](./representation-rules.md) owns that)
3. Failure mode: adopting it on a confounded volume count instead of the four renders

## F — Do (SPEAR)
1. Check the four conditions (≤10 shapes · labels only · no animation · no by-eye iteration)
2. All four hold → write the SVG; one fails → route via [representation-rules](./representation-rules.md) §Rendering path

## B — Watch (HEART)
1. Reaching for the canvas out of habit on a 6-shape diagram
2. Hand-writing coordinates past the point where dragging would be cheaper

## L — Predict (ORACLE)
1. Diagram ≤10 shapes → predict SVG finishes before a canvas would have started
2. Repeated threshold crossings → predict the ≤10 figure is set wrong

## R — Act (GRACE)
1. Concept diagram needed → write the SVG
2. Layout resists being written → export, open the canvas, log the crossing

## Mnemonic

**"Write it, don't draw it — unless you have to see it to place it."** The condition and the exception in one line: text for what you already know the shape of, canvas for what you are still finding.

## Checksum

1. Name the four conditions that must hold together for the SVG-first default to apply.
2. What promoted this — the file counts or the four renders? State the number that does *not* support it and why.
3. What is the refutation criterion, and where does a crossing get logged?

## Visual

**Four paths, two questions** — the count-shape for four is a square ([representation-rules](./representation-rules.md) Rule 10), and the two axes are exactly the two questions worth asking:

```
                   NEEDS A SERVER
                    no        yes
                ┌─────────┬──────────┐
      written   │  SVG    │          │
    (you know   │  first  │    —     │  ← nothing here: a server
     the shape) │ DEFAULT │          │     buys you nothing when
                ├─────────┼──────────┤     the shape is known
     generated  │mcp-draw │interactive
     / placed   │generator│  canvas  │  ← the fallback corner
     by eye     │ scripts │ FALLBACK │
                └─────────┴──────────┘
```

The empty corner is the finding: **paying a server for a diagram whose shape you already know buys nothing.** Three of four paths run unattended; the one that does not is the one that was documented as the default for three months.
