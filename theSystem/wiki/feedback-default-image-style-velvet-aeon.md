---
palace: meta-knowledge
level: 7
domain: 10
room: 12
wiki_source: wiki/cross-cutting/feedback-default-image-style-velvet-aeon.md
---

# Default-World Feedback — Velvet Aeon Unless Overridden

**Summary**: The binding policy that sets [Velvet Aeon](./world-velvet-aeon.md) as the **default world profile for every generated mnemonic image** — loaded automatically into the [CLAMP](./clamp-render-lens.md) slots unless a prompt explicitly overrides it. This page owns the *defaulting rule* (it is the auto-default; here is the override and sub-mode-selection semantics), not the world itself — [world-velvet-aeon](./world-velvet-aeon.md) is the owner of what Velvet Aeon *is*.

**Sources**:
- User image-style feedback (the `feedback_*` image-rule family).
- [world-velvet-aeon](./world-velvet-aeon.md) — the owner of the world profile this rule defaults to.
- [clamp-render-lens](./clamp-render-lens.md) §"David's default visual-style world" — where the default is applied to the M·L·C·A·P slots.
- Worked invocations: [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md), [scene-grammar](./scene-grammar.md), [theater-of-the-mind](./theater-of-the-mind.md), cissp-d1-stabilization-roadmap.

**Last updated**: 2026-06-05

---

## Why this page exists

A dozen pages say the same thing — "the default visual world is Velvet Aeon unless overridden" — and cite this rule. It was a ghost. The rule is worth owning separately from [world-velvet-aeon](./world-velvet-aeon.md) because it is a *policy*, not a *world*: it governs **what loads by default, how to override it, and which sub-mode to pick**. world-velvet-aeon describes the destination; this page is the routing rule that sends image work there automatically.

## The rule

For any scene-style mnemonic image, the world profile defaults to [Velvet Aeon](./world-velvet-aeon.md). The default is **loaded automatically** by the image tooling ([REMAPS](./remaps.md) / [CLAMP](./clamp-render-lens.md) / SMASHIN' SCOPE) — the prompt does not restate the full style each time. Specifically, unless overridden, the CLAMP **M · L · C · A** slots and the **P-slot** Preserve/Proscribe lists are pulled from the chosen Velvet Aeon sub-mode ([clamp-render-lens](./clamp-render-lens.md) §default world).

This is a **Flyweight / default-configuration** move: the shared style lives in one place (the world profile), and every image references it by default rather than carrying its own copy. It is what makes the other `feedback_*` rules cheap to apply — they extend a known baseline instead of re-specifying a world per prompt.

## Sub-mode selection

Velvet Aeon has registered sub-modes (defined in [world-velvet-aeon](./world-velvet-aeon.md)); this rule governs *which one fires for what kind of scene*:

- **Mortal / Cosmic / Environment** — the default fact-scene registers for concept encoding (palace loci, NEDF Name-hooks, atomic-design ateliers).
- **Identity sub-mode** — a *distinct register for identity scenes* (self-as-already-there rehearsal), not fact scenes. [theater-of-the-mind](./theater-of-the-mind.md) invokes this rule precisely to switch register: identity rehearsal needs the *sacred-memory* + *feminine-divinity* preserves and forbids *romantic-ruin* (which would prime the failure mechanism). Rendering an outcome scene instead of an operation-in-progress scene is the other identity-mode failure.

## When to override

The rule is *default*, not *mandatory*. Override when the scene type calls for a different register — the [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) Stage-C.4 image modes name three non-Velvet-Aeon alternatives: **meme** (failure-modes, punchline concepts), **found image** (concrete real-world subjects), **sketch/diagram** (topology, graphs, ladders). The override is explicit; absent it, Velvet Aeon loads.

## Relationship to the render stack

This is layer 1 of the `feedback_*` render doctrine — it fires after visual-per-concept (there must be a visual) and before the figure rules:

1. Visual-per-concept — there must be a visual, and it must show form.
2. **Default world** (this page) — render it in Velvet Aeon unless overridden.
3. [Figure rule](./feedback-image-figure-rule.md) → 4. Face & hair → 5. Noise reduction.

## Anti-patterns

- **Restating the world per prompt** — defeats the Flyweight purpose; the default exists so prompts stay short.
- **Wrong sub-mode** — rendering an identity scene in the fact-scene register (or with the *romantic-ruin* preserve) primes the failure mechanism instead of the identity update.
- **Overriding silently** — a non-Velvet-Aeon image without an explicit mode choice; the override must be deliberate.

## METER hooks

- `image.world_defaulted` — was Velvet Aeon loaded (or a deliberate override chosen) rather than an ad-hoc unspecified style?
- `image.submode_matched` — does the sub-mode (fact vs identity) match the scene's purpose?

## Related pages

- [world-velvet-aeon](./world-velvet-aeon.md) — the owner of the world profile this rule defaults to (3 sub-modes, 5 preserves, locked palette)
- [clamp-render-lens](./clamp-render-lens.md) — the CLAMP slots the default populates
- [remaps](./remaps.md) — the Stage-1 transformation lens that loads the default alongside CLAMP
- [theater-of-the-mind](./theater-of-the-mind.md) — the identity sub-mode invocation
- feedback_visual_per_concept — the top-of-stack rule this one follows
- [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) — the Stage-C.4 image modes that define the override alternatives
