---
palace: meta-knowledge
level: 8
domain: 10
room: 11
para: area
semantic_mode: 5
wiki_source: wiki/cross-cutting/originality-scoring.md
---

# Originality Scoring

**Summary**: Per-construct scoring system that ranks every Neural OS named construct on three axes — Originality, Operationalization, and Integration — and surfaces the score as a one-line badge on the owner page, plus a sortable board at originality-board. The system answers "how much of Neural OS is genuinely novel, how much is well-imported substrate, and how load-bearing is each piece" in a way that is always visible and refreshable.

**Sources**:
- Design conversation, 2026-06-01
- [glossary](./glossary.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)

**Last updated**: 2026-06-01

**Originality**: 🟢 7/9 · defensible-ip · O:3 OP:3 I:1 (3 inbound) · [board](../_meta/originality-board.md)

---

## Why this exists

Neural OS now spans 718 pages, 691 glossary terms, and 8,692 link edges. Casual claims about "what's novel" or "what's just imported" don't survive that scale — too easy to overclaim the recombinations and underclaim the substrate. This scoring system replaces vibes with a per-construct score that is always visible (on the page itself), always refreshable (the Integration axis recomputes from the live link graph), and always comparable (a single 0–9 scale with three named bands).

The system is also a precondition for several downstream uses: publication prioritization (lead with the defensible-IP items), visa or grant evidence packets (cite the highest-scoring constructs with their prior-art notes), and self-audit (a 🟢 9/9 score with thin operationalization notes is a falsifiable claim that someone can challenge).

## The three axes

| Axis | Source | Scale | Meaning |
|---|---|---|---|
| **Originality** | manual, reviewed quarterly | 0-3 | Has this construct been named/published before? |
| **Operationalization** | manual, reviewed when surface changes | 0-3 | Does it actually run, or is it a sketch? |
| **Integration** | auto, recomputed every run | 0-3 | How load-bearing inside the wiki graph? |

### Originality anchors

- **0** — direct import (term used unchanged from a published source)
- **1** — recombination with a named lens (e.g., applying Frost's Atomic Design to memory)
- **2** — significant extension of a named precedent (slot composition / naming / integration is novel)
- **3** — no published prior found (genuinely novel construct)

### Operationalization anchors

- **0** — sketch only (wiki page exists, no further surface)
- **1** — page + one of {recall pack, tool, METER metric}
- **2** — page + two of those
- **3** — page + three or more of those

### Integration thresholds (auto)

- **0** — 0 inbound (orphan)
- **1** — 1–9 inbound (low)
- **2** — 10–39 inbound (above median)
- **3** — 40+ inbound (top quartile)

The Integration axis is computed by counting inbound `wiki-link` references from non-meta pages, using the same parsing as `tools/wiki_link_graph.py`. Meta pages (index, log, [glossary](./glossary.md)) are excluded as sources so they don't inflate every construct's integration score uniformly.

## Bands

| Band | Glyph | Total | Use |
|---|---|---|---|
| **defensible-ip** | 🟢 | 7–9 | What publication, talks, or visa/grant evidence packets should lead with |
| **distinctive-supporting** | 🟡 | 4–6 | Distinctive recombinations or load-bearing imports; strong supporting evidence, not the lead |
| **substrate-or-sketch** | ⚪ | 0–3 | Imported substrate or unfinished sketches; useful, not original |

## How it surfaces

- **Source of truth**: [`wiki/_meta/originality-ledger.json`](../_meta/originality-ledger.json) — one entry per scored construct, with notes per axis and the `reviewed` date.
- **Per-page badge**: a one-line **Originality** marker inserted directly after the **Last updated** line on every owner page. The script syncs this on every run.
- **Sortable board**: originality-board — full ledger sorted by total descending, plus tier histogram and per-band detail with notes.

## How to maintain it

### Adding a new construct

1. Add the entry to `wiki/_meta/originality-ledger.json` under `terms`, keyed by short slug. Required fields: `name`, `expansion`, `owner_page`, `originality`, `originality_note`, `operationalization`, `operationalization_note`, `reviewed`.
2. Run `python tools/originality_score.py` — the script fills in `integration_inbound`, `integration`, `total`, `band`, and inserts the badge on the owner page.
3. The badge updates automatically on subsequent runs as the wiki graph evolves.

### Revising a score

- **Originality + Operationalization**: edit the `_note` field with the reason for the change, bump the score, update `reviewed` to today. These don't change mechanically; trust your latest judgement.
- **Integration**: don't touch — the script will recompute from the live graph. If the auto-computed score feels wrong, the bug is in the graph (orphan, broken link, missing inbound), not in the score.

### When to re-run

- After editing the ledger.
- Nightly (candidate for inclusion in `tools/wiki_morning_queue.py`).
- Before publication / evidence-packet work.

### When to re-review

- Quarterly for the Originality axis (literature may have caught up or you may have found a published prior).
- Whenever a construct's operational surface materially changes (new tool, new METER metric, retired recall pack).
- When a construct's band shifts on auto-recompute — that's a signal to re-read the notes and confirm they still hold.

## Honest caveats

- **Originality is judgement, not search.** The Originality score reflects what I (or the curator) couldn't find as a published prior. It is falsifiable — every `originality_note` is structured so someone can challenge it with a citation. The `defensible-ip` band is a hypothesis, not a verdict.
- **Operationalization rewards surface, not quality.** A page + tool + recall pack scores 3 even if the tool barely runs. Operationalization is a coarse "does this exist as more than text" check, not an evaluation of execution quality.
- **Integration rewards graph centrality, not importance.** A page can be load-bearing without many backlinks (a foundational definition with one inbound link from a hub) or be centrally linked without being important (a frequently-cited glossary term). Read the score with that caveat in mind.
- **The bands are coarse on purpose.** Three bands instead of nine prevents over-precision. The point is to triage publication and evidence work, not to rank every construct against every other.

## Pilot scope (2026-06-01)

Initial pilot scored 30 constructs:

- All 6 encoders (NEDF · CAST · SPEAR · HEART · ORACLE · GRACE)
- All 4 cross-cutting layers (UMTF · PULSE · METER · SPARK)
- Image pipeline (REMAPS · CLAMP · Velvet Aeon)
- 2 atomic-design ports (Memory · Money · Problem-Solving)
- Operating stacks (Problem-Solving OS · Neural OS Daily Loop · PARA)
- Performance layer (Red Queen Skill Gym · The Great Work · Skill Progression Stages · Drill Generator)
- Capture methods (BRIDGE LOAD · ORIENT · FRAME FORGE)
- Gym instances (Construct Recognition Gym · Crux Recognition Gym)
- Synthesis pages (Framework Comparison Matrix · Composability Index)

Expansion to the full ~691 glossary terms is intentionally deferred — scoring 30 with calibrated anchors first means the later scores are comparable. See originality-board for the live results.

## Related pages

- originality-board — the live sortable view
- [glossary](./glossary.md) — the term registry the ledger keys against
- [framework-comparison-matrix](./framework-comparison-matrix.md) — the synthesis map the scoring system measures
- [composability-index](./composability-index.md) — pattern detection that surfaces new candidates for the ledger
