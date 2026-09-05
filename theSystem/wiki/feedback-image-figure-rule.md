---
palace: meta-knowledge
level: 7
domain: 10
room: 9
wiki_source: wiki/cross-cutting/feedback-image-figure-rule.md
---

# Figure Rule Feedback — the Woman-and-Creature Figure Doctrine

**Summary**: The parent render rule for *how a human figure is constructed at all* in a Neural OS mnemonic image — the umbrella above its face/hair specialization [feedback-image-face-and-hair](./feedback-image-face-and-hair.md). Three load-bearing conventions: (1) **fusion** — a figure is a woman archetype fused with an animal/creature, never a plain neutral human; (2) **never neutral** — every figure carries affect (STRONG or FRAGILE), there is no affect-less figure; (3) **architecture over identity** — the scene's structure carries the encoding, the figure's specific identity is secondary. This is the owner of the rule that image-prompts cite as `feedback-image-figure-rule`.

**Sources**:
- User feedback during the visual-encoding design conversations (the `feedback_*` image-rule family).
- [world-velvet-aeon](./world-velvet-aeon.md) §Figure rules — the compact prior statement this page consolidates.
- [image-pipeline](./image-pipeline.md) §Stage 2 — the figure rules are injected into the CLAMP slots automatically.
- Worked invocations: [scene-grammar](./scene-grammar.md) (mermaid-figure), [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) (woman+animal fusion, STRONG/FRAGILE, never neutral), [theater-of-the-mind](./theater-of-the-mind.md) (mode-alternation).

**Last updated**: 2026-06-05

---

## Why this page exists

`feedback_image_face_and_hair` got its owner page first because it was the most-cited member of the family. But that page governs only the *face and hair*; it explicitly defers "the rest of the figure" to **this** rule. The whole figure — what kind of body it is, whether it carries affect, and how it relates to the scene around it — was still a ghost. This page holds it, and the two pages together fully specify a Neural OS figure: figure-rule is the umbrella, face/hair is the specialization.

## Convention 1 — Fusion (woman + creature)

A mnemonic figure is **a woman archetype fused with an animal or creature**, not a plain human. The wiki's own prompts default to this:

- [scene-grammar](./scene-grammar.md) → "a **mermaid-figure** standing at a half-flooded stone arch."
- [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) → "Figures **fuse animal/creature with a woman archetype** (the figure-rule convention)."

The fusion is itself an encoding move: the creature half is a [NEDF](./nedf-overview.md) hook that ties the abstract concept to a concrete, memorable chimera. A plain human figure would carry no such hook — it would be forgettable in exactly the way the doctrine forbids.

## Convention 2 — Never neutral

Every figure is rendered with affect — **STRONG or FRAGILE, never neutral.** The choice and its specs are owned by [feedback-image-face-and-hair](./feedback-image-face-and-hair.md); this rule's contribution is the *prohibition*: there is no affect-less figure. An expressionless, mode-neutral figure is a figure-rule violation, because a neutral face caches no property of the concept.

The two archetypes may **both appear within a single identity** if the rehearsal alternates modes:

- [theater-of-the-mind](./theater-of-the-mind.md) → "Strong-jaw archetype for ASM-active self / luminous-porcelain for relax-substrate self; **both allowed in one identity if the rehearsal alternates modes**."
- [world-velvet-aeon](./world-velvet-aeon.md) §Figure rules → the same allowance for decisive-in-public / quiet-in-study identities.

## Convention 3 — Architecture over subject identity

The encoding load is carried by the **scene's architecture** — the arch, the well, the periodic-table board, the bridge — not by *who* the figure specifically is.

- [scene-grammar](./scene-grammar.md) → "architecture matters more than the subject identity … each Element is anchored to a specific visible feature."

The figure is a *carrier of affect and a Distinguisher*, not the payload. This is why the worked atelier scenes ([problem-solving-atomic-design](./problem-solving-atomic-design.md), [money-atomic-design](./money-atomic-design.md), [memory-atomic-design](./memory-atomic-design.md)) spend their detail budget on the board/bench/grid and keep the figure archetypal: the structure is what must be retrievable, the figure is what makes it *want* to be looked at.

## Where it runs in the pipeline

The figure rules are not a Stage-1 transformation; they are **Stage-2 render direction**, injected into the [CLAMP](./clamp-render-lens.md) slots automatically alongside the [Velvet Aeon](./world-velvet-aeon.md) style profile:

- [image-pipeline](./image-pipeline.md) §Stage 2 → "Velvet Aeon is loaded automatically into the CLAMP slots (M = medium; L = single-light; **figure rules**; etc.)."

So the rule does not change *what* a scene depicts (Stage 1 / [REMAPS](./remaps.md)); it constrains *how the figure inside it is drawn* (Stage 2).

## Relationship to the face/hair rule

| | **Figure rule** (this page) | **Face & Hair rule** ([feedback-image-face-and-hair](./feedback-image-face-and-hair.md)) |
|---|---|---|
| Scope | the whole figure — fusion, affect-presence, scene-relationship | the face archetype + the hair |
| Core claim | woman+creature fusion · never neutral · architecture > identity | STRONG/FRAGILE as a Distinguisher · long hair · hair-and-water sorrow effect |
| Pattern role | the umbrella | the specialization it delegates to |

Reading order: a figure prompt satisfies the figure rule first (what kind of figure, carrying affect, subordinate to architecture), then the face/hair rule (which affect, rendered how).

## Anti-patterns

- **Plain-human figure** — dropping the creature fusion removes the NEDF hook and makes the figure forgettable.
- **Neutral affect** — an expressionless figure caches no property; pick STRONG or FRAGILE.
- **Identity over architecture** — lavishing detail on *who* the figure is while leaving the encoding-bearing structure vague; inverts the load.

## METER hooks

- `image.figure_fused` — does the figure fuse a woman archetype with a creature (vs a plain human)?
- `image.architecture_primary` — is the encoding anchored to scene structure rather than to the figure's identity?

## Related pages

- [feedback-image-face-and-hair](./feedback-image-face-and-hair.md) — the face/hair specialization this rule delegates to
- [world-velvet-aeon](./world-velvet-aeon.md) — the world/style profile loaded alongside these rules
- [image-pipeline](./image-pipeline.md) — the two-stage pipeline; figure rules are Stage-2 CLAMP direction
- [clamp-render-lens](./clamp-render-lens.md) · [remaps](./remaps.md) — the render and transformation lenses
- [scene-grammar](./scene-grammar.md) · [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) · [theater-of-the-mind](./theater-of-the-mind.md) — worked invocations
