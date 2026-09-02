---
palace: meta-knowledge
level: 6
domain: 10
room: 1
wiki_source: wiki/meta-wiki/5-gates-of-comprehension.md
---

# 5 Gates of Comprehension

**Summary**: Pre-encoding validation protocol. Five gates — **Locate · Represent · Minimize · Falsify · Regenerate** — that material must pass before being committed to [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), a [BRIDGE](./bridge-load.md), or a palace. If any gate fails, you don't understand the concept yet — fix the gap before encoding.

**Sources**:
- raw/templates/01_5GATES_TEMPLATE.md
- Used in: archetype-1-fixes-that-fail, archetype-2-success-to-the-successful, archetype-3-shifting-the-burden, archetype-4-escalation, archetype-5-limits-to-growth, archetype-6-addiction-eroding-goals, archetype-7-growth-and-underinvestment, archetype-8-tragedy-of-the-commons

**Last updated**: 2026-05-28

---

## Purpose

5 Gates sits between **reading a source** and **encoding it into memory**. It is a comprehension-validation protocol, not a memory framework. Its job is to catch the failure mode where you can recognize a concept but cannot regenerate it — the "I read it and it made sense" trap.

Pipeline position:

> **Read source → 5 Gates → BRIDGE (if analogy needed) → NEDF / CAST / SPEAR / Palace → Anki**

If any gate fails, do not proceed to encoding. Go back, fix the gap, retry.

## The Five Gates

### Gate 1 — LOCATE: "Where does this live?"

Place the concept in the larger landscape:

- **Field / Category** — what discipline, what kind of thing
- **Neighbors** — 3+ related concepts nearby
- **Prerequisites** — what must you understand first
- **Purpose** — what problem does it solve?

**Pass criteria:** you can name the field, list 3+ neighbors, identify 2+ prerequisites, and explain why the concept exists.

**Fail signal:** you can describe the concept but cannot situate it. → Read overviews/surveys that frame the surrounding territory.

### Gate 2 — REPRESENT: "Can you show it three different ways?"

Express the concept in at least three distinct forms:

- **Verbal** — plain language
- **Visual** — diagram or sketch
- **Symbolic** — formula or notation
- **Operational** — step-by-step procedure
- **Analogy** — comparison to something familiar (this is where [BRIDGE](./bridge-load.md) enters)
- **Code** — implementation
- **Adversarial** — what it is *not*

**Pass criteria:** 3+ forms, each distinct (not reworded), each revealing something different, smoothly switchable.

**Fail signal:** verbal-only understanding. → Strengthen the weak forms; common fix is adding a visual + an analogy.

### Gate 3 — MINIMIZE: "What is the smallest valid example?"

Find the tiniest case that still demonstrates the concept. Strip every decoration until only the essential structure remains.

**Pass criteria:** you can describe the minimal example, justify why you cannot remove anything further, and verify it still demonstrates the concept.

**Fail signal:** every example you can produce is bundled with unrelated complexity. → Find a smaller case or strip the current one further.

### Gate 4 — FALSIFY: "Where does it break?"

Map the failure surface:

- **Edge cases** — empty, full, zero, infinite
- **Boundary conditions** — assumptions that must hold
- **Counterexamples** — things that look like it but aren't
- **Common misuse** — how practitioners get it wrong
- **What it is NOT** — explicit contrasts with neighbors

**Pass criteria:** 3+ edge cases, 1+ counterexample, 2+ misuse patterns, clear "not X because…" contrasts.

**Fail signal:** you know the happy path but not the traps. → Read failure cases, edge cases, and common bugs before proceeding.

### Gate 5 — REGENERATE: "Can you rebuild it from scratch?"

Without notes or references, pick one and do it:

- **Rebuild** — implement / code it from scratch
- **Derive** — prove or re-derive the rule
- **Explain** — teach it to someone, no notes
- **Apply** — solve a new problem using it
- **Debug** — given a broken example, identify and fix

**Pass criteria:** you chose a regeneration method, executed it, the output is correct or very close, and you didn't look anything up.

**Fail signal:** recognition without internalization. → Revisit Gates 1-4 before retrying.

## Quick Checklist

```
Gate 1 LOCATE     [ ] Pass [ ] Fail
Gate 2 REPRESENT  [ ] Pass [ ] Fail
Gate 3 MINIMIZE   [ ] Pass [ ] Fail
Gate 4 FALSIFY    [ ] Pass [ ] Fail
Gate 5 REGENERATE [ ] Pass [ ] Fail

All pass → proceed to NEDF / CAST / SPEAR / BRIDGE
Any fail → revisit before encoding
```

## Time Budget

| Complexity | Time per concept |
|---|---|
| Simple (e.g. "list") | 5-10 min |
| Moderate (e.g. "recursion") | 10-15 min |
| Complex (e.g. "inheritance") | 15-25 min |
| Very complex (e.g. a system archetype) | 20-30 min |

First passes are slow. With practice, the protocol compresses to 3-5 minutes for moderate concepts.

## How 5 Gates Composes With Other Frameworks

5 Gates is **upstream of every encoder and every analogy builder**. Its job is to refuse to encode material that hasn't passed.

| Downstream framework | What 5 Gates ensures before it runs |
|---|---|
| [NEDF](./nedf-overview.md) | The Essence slot will not collapse into vagueness — Gate 2 forced multiple representations, Gate 3 forced minimality |
| [CAST](./cast-overview.md) | Node identity and edge semantics are clear — Gate 1 forced neighbor distinction, Gate 4 forced boundary marking |
| [SPEAR](./spear-overview.md) | The procedure has real failure modes — Gate 4 surfaced them |
| [BRIDGE](./bridge-load.md) | The target is bounded before an analogy is built — Gate 1 located it, Gate 2 supplied multiple forms |
| Palace placement | The concept is distinct enough from neighbors not to collide — Gate 4 forced "what it is not" |

## Suggested Inputs (assist mode)

5 Gates is human-only on its *verdicts* — but several gates ask questions the wiki and source material can already answer, so the system can **suggest the inputs** while the human keeps every pass/fail. This is the same suggest-then-confirm contract used at the [RAPID](./rapid-in-neural-os.md) Encode step and in [BRIDGE LOAD](./bridge-load.md): *the system does the lookup, the human owns the decision.* Suggestion is never application.

The gates are not uniform. The split follows one seam — **retrieval vs. generation**: a gate answerable by looking something up is suggestable; a gate that requires the learner to *produce* something is not.

| Gate | What the system may suggest | What stays human (the pass/fail) | Suggestable? |
|---|---|---|---|
| 1 LOCATE | candidate field, 3+ neighbor concepts, prerequisite list (graph/wiki retrieval) | confirming the placement and explaining *why* the concept exists | yes — retrieval |
| 2 REPRESENT | *which* representation form is missing; an analogy draft (= [BRIDGE](./bridge-load.md)) | producing each form and verifying it reveals something new | gap-only |
| 3 MINIMIZE | candidate minimal examples pulled from sources | justifying "nothing further can be removed" | gap-only |
| 4 FALSIFY | edge-case checklist (empty/full/zero/∞), known misuse from sources | choosing which apply; producing real counterexamples | yes — retrieval |
| 5 REGENERATE | **nothing** | rebuild/derive/explain from scratch, unaided | **no — see invariant** |

### The Gate-5 invariant

Gate 5 (REGENERATE) must have **no suggestion path**. Its validity rests entirely on the learner producing the rebuild *unaided* (Gate 5 above: "Without notes or references"). A suggestion here does not remove friction — it deletes the signal, because you can no longer test whether *you* could regenerate. Measuring Gate-5 *pass/fail* (did the regeneration succeed) is fine and useful; *suggesting into* it is forbidden. Treat this as an invariant in any tool that implements the assist, not a default that can be toggled on.

### Measurement

Two metrics, with deliberately opposite polarity — mirroring the [METER](./meter-overview.md) §Capture / assist metrics rule that retrieval suggestions and comprehension acts read inversely:

| Metric | Covers | Healthy signal |
|---|---|---|
| `gate_suggestion_override_rate` | Gates 1 & 4 (retrieval suggestions) | **Low** — the retrieval is reliable; the suggestion is pure friction removal. High → the neighbor/edge-case retrieval is wrong for the material |
| `gate_scaffold_edit_rate` | Gates 2 & 3 (gap scaffolds) | **High** — the human is actively producing forms/examples. Near-zero is the alarm: gap-scaffolds are being rubber-stamped, so comprehension isn't happening |

The polarity split is the same one that separates `encoder_override_rate` (low=good, a deterministic lookup) from `analogy_edit_rate` (high=good, a comprehension act) in [METER](./meter-overview.md).

## When to Reach for 5 Gates

- Before encoding any non-trivial concept into long-term memory
- When a concept "feels clear" but you cannot teach it
- When two concepts keep getting confused — Gate 4 (contrasts) usually fixes this
- Before writing a wiki page that introduces a new concept — passing 5 Gates first makes the page sharp

## When Not to Use 5 Gates

- Trivial factual lookups (a name, a date, a constant) — overhead exceeds benefit
- Material that is purely procedural with no conceptual content — go straight to SPEAR
- Re-encoding material you have already passed through — once is enough; subsequent passes are review, not gating

## If You're Stuck

Use the **Confusion Guard** protocol (raw/templates/02_CONFUSION_GUARD_TEMPLATE.md):

1. Diagnose *why* you're stuck (failure type A-E)
2. Identify which gate is actually failing
3. Apply the targeted fix

## Related Pages

- [bridge-load](./bridge-load.md) — analogy-building protocol; runs *after* 5 Gates passes
- [remaps](./remaps.md) — vividness / retrievability moves; runs on individual encoded slots
- [nedf-overview](./nedf-overview.md) · [cast-overview](./cast-overview.md) · [spear-overview](./spear-overview.md) — primary encoders that receive 5-Gate-validated material
- [self-explanation](./self-explanation.md) — a different comprehension protocol (SEAL / WWHB / FAKE) targeting the same failure mode; 5 Gates is the structural cousin
- [prism-pattern-discovery](./prism-pattern-discovery.md) — PRISM, the case-set → rule protocol upstream of encoding; its R step is Gate 2 REPRESENT and its stress-test is Gates 4–5
- [rapid-in-neural-os](./rapid-in-neural-os.md) — the Encode step's suggest-then-confirm assist; 5 Gates' §Suggested Inputs reuses the same contract upstream
- [meter-overview](./meter-overview.md) — owns the `gate_suggestion_override_rate` / `gate_scaffold_edit_rate` polarity pair alongside the encoder/analogy metrics
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- index
