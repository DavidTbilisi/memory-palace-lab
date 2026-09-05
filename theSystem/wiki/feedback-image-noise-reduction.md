---
palace: meta-knowledge
level: 7
domain: 10
room: 11
wiki_source: wiki/cross-cutting/feedback-image-noise-reduction.md
---

# Noise-Reduction Feedback — Single Light Source, Empty Sky

**Summary**: The signal-to-noise discipline for every generated mnemonic image: **one definite light source** (a single lamp, moon, candle, or dawn — never two, never chaotic atmosphere) and an **empty sky** (no storms, particles, or atmospheric clutter). The purpose is encoding hygiene — atmospheric noise competes with the features that carry meaning, so every photon and pixel should be load-bearing. It is the [render stack](./feedback-image-figure-rule.md)'s extraneous-load reducer, the visual analogue of the [cognitive-load](./working-memory.md) discipline.

**Sources**:
- User image-style feedback (the `feedback_*` image-rule family).
- [world-velvet-aeon](./world-velvet-aeon.md) §L-slot — the single-warm-light discipline this rule generalizes.
- [image-pipeline](./image-pipeline.md) · [clamp-render-lens](./clamp-render-lens.md) — the L-slot in the CLAMP render lens.
- Worked invocations: [six-framing-traps](./six-framing-traps.md), [seven-strategic-thinking-dimensions](./seven-strategic-thinking-dimensions.md), [zeitz-startup-strategies](./zeitz-startup-strategies.md), [strategic-thinking-cognitive-cluster](./strategic-thinking-cognitive-cluster.md), verse-memorization.

**Last updated**: 2026-06-05

---

## Why this page exists

Image-prompts across the wiki end with the same two clauses — "single light source," "empty sky," "no atmospheric noise" — each citing `feedback_image_noise_reduction` as if it were a settled rule. It was a ghost. This page owns it, as the bottom layer of the `feedback_*` render stack: after the figure and its face are set, this rule cleans the frame.

## The two clauses

| Clause | Rule | Forbidden |
|---|---|---|
| **Single light source** | Exactly one definite source — lamp · moon · candle · dawn-through-window · single warm overhead | Two light sources ("one moon, not two"), conflicting sources, ambiguous lighting |
| **Empty sky** | The background sky is clear and uncluttered — a vast empty nebula, plain dawn, dark void | Storms, swirling particles, "chaotic atmosphere," weather drama, busy backgrounds |

The wiki's own prompts state it directly:
- [six-framing-traps](./six-framing-traps.md) → "The chamber's single light source comes from above; no atmospheric noise; the sky outside is empty."
- [strategic-thinking-cognitive-cluster](./strategic-thinking-cognitive-cluster.md) → "the lighting is single-source warm (one moon, not two)."
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) → "single warm light, otherwise empty sky."
- verse-memorization → "a light source (single, definite — avoid chaotic atmosphere)."

## Why it is an encoding rule, not an aesthetic

The justification is signal-to-noise, not taste. A mnemonic image earns its keep by carrying *retrievable features* — the Distinguisher face ([feedback-image-face-and-hair](./feedback-image-face-and-hair.md)), the encoding architecture ([feedback-image-figure-rule](./feedback-image-figure-rule.md)), the specific props. Atmospheric noise — extra light sources, particle storms, busy weather — adds pixels that carry **no concept information** while competing for attention with the pixels that do. It is extraneous [cognitive load](./working-memory.md) rendered into the image itself.

So the rule is the visual twin of the wiki's extraneous-load discipline: just as [representation-rules](./representation-rules.md) strips notation that doesn't earn its place, noise-reduction strips photons that don't. A second light source is the visual equivalent of a redundant clause.

A secondary effect, owned by [world-velvet-aeon](./world-velvet-aeon.md): the calm single-warm-light register also primes the [winning feeling](./winning-feeling.md)'s somatic state — chaotic lighting primes anxiety, calm lighting primes focus.

## Interaction with the hair-and-water effect

Noise-reduction and the [hair-and-water sorrow effect](./feedback-image-face-and-hair.md) can both touch the same frame without conflict: the water effect is a *single, intentional* element (hair-tips in a still pool, one tear on wet stone), not atmospheric noise. The test is the same — every added element must be load-bearing. A still reflecting pool that encodes "sorrow-as-guidance" passes; a rainstorm that encodes nothing fails.

## Anti-patterns

- **Two light sources** — the canonical violation; ambiguous shadow direction and no single anchor for the eye.
- **Weather drama** — storms/fog/particles added "for mood" that carry no concept information.
- **Busy background** — a detailed sky or scene behind the subject that competes with the encoding-bearing foreground.

## METER hooks

- `image.single_light` — does the prompt specify exactly one definite light source?
- `image.empty_sky` — is the background free of atmospheric noise (no storms/particles/clutter)?

## Related pages

- [feedback-visual-per-concept](./feedback-visual-per-concept.md) — the top-of-stack rule (there must be a visual at all)
- [feedback-image-figure-rule](./feedback-image-figure-rule.md) · [feedback-image-face-and-hair](./feedback-image-face-and-hair.md) — the figure rules this cleans the frame around
- [world-velvet-aeon](./world-velvet-aeon.md) — the L-slot single-warm-light discipline this generalizes
- [clamp-render-lens](./clamp-render-lens.md) — the CLAMP L-slot where this rule is applied
- [representation-rules](./representation-rules.md) · [working-memory](./working-memory.md) — the extraneous-load discipline this is the visual twin of
