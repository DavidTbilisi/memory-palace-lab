---
palace: meta-knowledge
level: 7
domain: 10
room: 12
glyph: 🛤️
wiki_source: wiki/cross-cutting/pipeline-overview.md
---

# Pipeline Overview

**Summary**: A one-screen Facade for the Neural OS learning pipeline — the comprehension→encoding→measurement spine, the suggest-then-confirm assist layer that hangs off it, and the METER metrics it emits. This page defines nothing; it links to the owner page for every stage and shows how they connect.

**Sources**:
- [5-gates-of-comprehension](./5-gates-of-comprehension.md)
- [bridge-load](./bridge-load.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [meter-overview](./meter-overview.md)
- neural-os-daily-loop

**Last updated**: 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-28

---

This page is a **front door**, not an owner. Every stage below is defined on its own page; the value here is seeing the *whole machine* and the two axes that govern it:

- **Left → right is the gate order.** [Comprehension](./5-gates-of-comprehension.md) comes first and is human-owned; encoding is downstream. Nothing is encoded before comprehension passes.
- **Top → bottom is the assist seam.** The suggest-then-confirm assist proposes *inputs*, never verdicts — and splits by polarity: retrieval-shaped suggestions read **low = good**, comprehension-shaped suggestions read **high = good**.

## The machine

The **spine** (solid arrows) is human-owned — every pass/fail stays human. The **assist layer** (dashed arrows) proposes inputs, never applies them.

```mermaid
graph TD
    R["📄 Read source"]
    G["<b>5 Gates of Comprehension</b><br/>comprehension gate FIRST<br/>Locate · Represent · Minimize<br/>Falsify · Regenerate"]
    B["<b>BRIDGE</b><br/>if analogy"]
    E["<b>ENCODE step</b><br/>NEDF · CAST · SPEAR<br/>HEART · ORACLE · GRACE"]
    A["<b>Anki</b><br/>SR"]

    R --> G --> B --> E --> A

    GA["<b>5-Gates suggested inputs</b> — candidate (validated, pending build)<br/>G1 Locate → neighbors (retrieval)<br/>G4 Falsify → edge-cases (retrieval)<br/>G2 Represent — which form missing (gap-only)<br/>G3 Minimize — min example (gap-only)<br/>G5 Regenerate → ❌ nothing · invariant: no suggest"]
    BA["<b>BRIDGE LOAD assist</b> — validated, pending build<br/>Retrieve source + draw mapping = suggestable<br/>Isolate · Guard · LOAD test = human-authored"]
    EA["<b>encoder_select.py</b> ✅ built + tested<br/>classify() keyword scoring (transparent)<br/>suggest() kernel (Strategy + tie-break)<br/>record_decision() · override_rate()<br/>CLI: meter encoder suggest / rate"]

    G -. "suggest, never apply" .-> GA
    B -. "suggest, never apply" .-> BA
    E -. "suggest, never apply" .-> EA

    M["<b>METER · §Capture / assist metrics</b><br/>append-only JSONL · Event(layer=capture)"]
    GA --> M
    BA --> M
    EA --> M

    classDef spine fill:#e8efe6,stroke:#5c7a54,color:#20301c;
    classDef assist fill:#eef1f5,stroke:#7d8aa0,color:#26303f;
    classDef meter fill:#f3ece0,stroke:#a08a5c,color:#3a3020;
    class R,G,B,E,A spine;
    class GA,BA,EA assist;
    class M meter;
```

The METER capture layer collects the assist metrics below. Polarity splits by shape: retrieval-shaped suggestions read **low = good**; comprehension-shaped suggestions read **high = good**.

| Metric | Covers | Healthy | Polarity |
|---|---|---|---|
| `encoder_override_rate` | encoder suggestion | LOW ↓ | retrieval |
| `gate_suggestion_override_rate` | 5-Gates G1 & G4 | LOW ↓ | retrieval |
| `analogy_edit_rate` | BRIDGE draft mapping | HIGH ↑ | comprehension |
| `gate_scaffold_edit_rate` | 5-Gates G2 & G3 | HIGH ↑ | comprehension |

> **G5 REGENERATE** is uninstrumented on the assist side — a suggestion would contaminate the measurement.

## Stage owners

| Stage | Owner page | What it does | Assist status |
|---|---|---|---|
| Comprehension gate | [5-gates-of-comprehension](./5-gates-of-comprehension.md) | refuses to encode material that hasn't passed; [self-explanation](./self-explanation.md) is the sibling protocol | candidate (validated, pending build) |
| Analogy | [bridge-load](./bridge-load.md) | builds a bounded analogy after comprehension; the `LOAD` test stays human | validated, pending build |
| Encode-step routing | [rapid-in-neural-os](./rapid-in-neural-os.md) / [framework-comparison-matrix](./framework-comparison-matrix.md) | picks the encoder per material type (Strategy rule) | ✅ built — `tools/meter/meter/encoder_select.py` |
| Measurement | [meter-overview](./meter-overview.md) | one append-only log; owns `encoder_override_rate` + `analogy_edit_rate`, and the gate metrics' polarity rule | live |

## The one rule that ties it together

A stage is **suggestable** only when its question is answerable by *retrieval* (look something up). A stage that requires the learner to *generate* something is human-only. That single seam decides all of it: the encoder rule is suggestable (it's a written lookup); the [BRIDGE](./bridge-load.md) `LOAD` test is not (it's the learner's comprehension); and inside [5 Gates](./5-gates-of-comprehension.md) the same seam splits the gates — retrieval gates get suggestions, generation gates (especially REGENERATE) do not.

## Related pages

- [5-gates-of-comprehension](./5-gates-of-comprehension.md) — comprehension gate; owns the gate assist + Gate-5 invariant
- [bridge-load](./bridge-load.md) — analogy protocol; owns the analogy assist
- [rapid-in-neural-os](./rapid-in-neural-os.md) — the Encode step's suggested-encoder assist
- [framework-comparison-matrix](./framework-comparison-matrix.md) — the material-type → encoder Strategy rule
- [meter-overview](./meter-overview.md) — measurement layer; owns the assist-metric polarity pair
- neural-os-daily-loop — the concrete daily/weekly rhythm that runs this pipeline
- [composability-index](./composability-index.md) — registry of the unlocks this pipeline composes
- index
