---
palace: meta-knowledge
level: 7
domain: 10
room: 10
glyph: 👁️
wiki_source: wiki/cross-cutting/feedback-visual-per-concept.md
---

# Visual-Per-Concept Feedback — Every Concept Page Ships a Visual

**Summary**: The most load-bearing rule of the `feedback_*` family and the one the others presuppose: **every concept page must ship a visual** (a generated scene, meme, diagram, glyph, timeline, map, or formula), and that visual is *structural, not decorative*. Its philosophical home is the [show-vs-say](./show-vs-say.md) boundary (Wittgenstein, TLP 4.121–4.1212): prose can *say about* structure but cannot *show* it — only a picture that shares the concept's form can. A text-only concept page does not merely fall short of a style preference; it violates show-vs-say.

**Sources**:
- User feedback ("if I don't see it visually I will surely forget it") — the `feedback_*` image-rule family.
- [show-vs-say](./show-vs-say.md) (TLP 4.121–4.1212) — the philosophical home; structure is *shown*, not *said*.
- [visual-thinking-evidence](./visual-thinking-evidence.md) — the empirical sibling; the verified cognitive-science grounding (and the quota→quality refinement below).
- [picture-theory-of-language](./picture-theory-of-language.md) (TLP 2.1–4.06) — the antecedent of the wiki's whole encoder paradigm.
- [composability-index](./composability-index.md) §"visual-per-concept rule has its 1922 home" — the confirmed unlock this page consolidates.
- [representation-rules](./representation-rules.md) — the operational sibling (what makes a representation load-bearing).

**Last updated**: 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-06-29

---

## Why this page exists

The other `feedback_*` render rules — [figure rule](./feedback-image-figure-rule.md), [face/hair](./feedback-image-face-and-hair.md), [noise reduction](./feedback-image-noise-reduction.md), [default world](./feedback-default-image-style-velvet-aeon.md) — all answer "*how do we draw the image?*" This rule answers the prior question: **why is there an image at all?** It sits at the top of the render stack; the others only matter once this one has fired.

## The rule

Every concept page in the wiki must include a visual. Acceptable forms span the whole range — a [Velvet Aeon](./world-velvet-aeon.md) generated scene, a meme, a diagram, a glyph, a timeline, a map, a formula — but the page is incomplete without one. The visual is **load-bearing infrastructure, not optional polish**; on encoder cards the file path is part of the encoding.

## Why it is structural, not decoration — the show-vs-say home

The rule's justification is not "pictures are nice." It is an epistemic claim owned by [show-vs-say](./show-vs-say.md):

- **TLP 4.121** — propositions *show* the logical form of reality; they display it.
- **TLP 4.1212** — *what can be shown cannot be said.*

Prose can make assertions *about* a structure ("the pipeline has four stages, and stage two feeds stage three") but it cannot *display* the structure the way a diagram does. The structure is **shown**, and showing requires a visual. This is why the rule is non-negotiable: a text-only concept page is trying to *say* what can only be *shown*.

The rule applies **recursively** — every meta-level needs its own visual; there is no level at which "just describe it" becomes adequate (which is also why Russell's hierarchy-of-languages escape doesn't help operationally; see [composability-index](./composability-index.md)).

## The failure mode — decoration that doesn't share form

The rule has one sharp anti-pattern, and it is the inverse of skipping the visual: **adding a picture that does not share form with the concept.** A stock photo of a brain on a memory page *shows* nothing about memory's structure — it is decoration wearing the costume of a visual, and it satisfies the letter of the rule while violating its point. The test is [show-vs-say](./show-vs-say.md) §"Picture as decoration": does the image's *form* mirror the concept's *form*? If you could swap it for any other pretty image without loss, it fails.

This is the same discipline the [figure rule](./feedback-image-figure-rule.md) states as "architecture over identity" and the [face/hair rule](./feedback-image-face-and-hair.md) states as "the archetype is a Distinguisher" — in all three, the visual element must *encode*, not merely *adorn*.

## Empirical grounding & the quota→quality refinement (2026-06-29)

The show-vs-say justification above is philosophical. [visual-thinking-evidence](./visual-thinking-evidence.md) supplies the *measured* backing — and it both **arms** the anti-decoration stance and **corrects** one phrasing in this rule.

**What the evidence confirms.** The "decoration that doesn't share form" failure mode is not a soft preference — decoration is **net-negative**, not neutral filler: illustrations promoting deep processing run d > 0.50, decorative illustrations run **d < 0.00** (Levin, Anglin & Carney 1987, via Mayer 2011). Redundant added media *hurt* learning (d = 0.72 favouring removal); interesting-but-irrelevant visuals depress retention and transfer (Rey 2012). The field-level pooled multimedia effect is only **g = 0.37** (Cromley & Chen 2025) — visuals pay off through *relevance and integration*, not *count*.

**What the evidence corrects.** This page's original phrasing — *every* concept page must ship a visual — is a **quota**, and a strict quota manufactures decoration *by policy* whenever a concept admits no form-sharing visual. The fix is a **quality gate**:

> Every concept that admits a **content-bearing, form-sharing, integrated** visual must ship one; decorative or quota-filler visuals are **banned**; and **no visual is preferable to a decorative one.**

So `concept.has_visual` is now **subordinate** to `concept.visual_shows_form`. A page with no visual beats a page with a decorative one. (Expertise-reversal — Kalyuga et al. 1998/2003 — adds that the ideal visual degrades as the reader climbs the [automaticity ladder](./skill-progression-stages.md): integrated-text for novices, diagram-alone for experts.)

**The boundary it must not cross.** The evidence also quarantines the myth nearest this rule: there is *no* "visual learner" effect (Pashler et al. 2008; aphantasics reason fine — Zeman 2015/2020), and the famous "we remember X% of what we see" numbers are fabricated (Subramony et al. 2014). This rule is about **the encoding's form**, never about a learner *type*. See [visual-thinking-evidence](./visual-thinking-evidence.md) §"The boundary statement" for the canonical claim/anti-claim wording.

## Relationship to the render stack

This rule is layer 0 of the `feedback_*` render doctrine:

1. **Visual-per-concept** (this page) — *there must be a visual, and it must show form.*
2. [Default world](./feedback-default-image-style-velvet-aeon.md) — *render it in Velvet Aeon unless overridden.*
3. [Figure rule](./feedback-image-figure-rule.md) — *if it has a figure: woman+creature, never neutral, subordinate to architecture.*
4. [Face & hair](./feedback-image-face-and-hair.md) — *which affect the face carries (STRONG/FRAGILE Distinguisher).*
5. [Noise reduction](./feedback-image-noise-reduction.md) — *single light source, empty sky; every pixel load-bearing.*

## METER hooks

These hooks feed [METER](./meter-overview.md):

- `concept.visual_shows_form` — does the visual's form mirror the concept's structure? (the show-vs-say test — **primary gate**)
- `concept.has_visual` — does the page ship a visual at all? (**subordinate**: only counts when `visual_shows_form` passes; a visual that fails the form test scores worse than no visual)
- `concept.decoration_by_mandate` — a visual added to satisfy the quota but failing the form test (**defect signal; lower = better**, proposed floor = 0 across the corpus). See [visual-thinking-evidence](./visual-thinking-evidence.md) §METER.

## Related pages

- [show-vs-say](./show-vs-say.md) — the philosophical home (TLP 4.121–4.1212); owner of the show/say boundary
- [visual-thinking-evidence](./visual-thinking-evidence.md) — the empirical sibling; verified studies + the quota→quality refinement + the claim/anti-claim boundary statement
- [picture-theory-of-language](./picture-theory-of-language.md) — the antecedent of the whole encoder paradigm
- [representation-rules](./representation-rules.md) — what makes a representation load-bearing rather than decorative
- [feedback-default-image-style-velvet-aeon](./feedback-default-image-style-velvet-aeon.md) · [feedback-image-figure-rule](./feedback-image-figure-rule.md) · [feedback-image-face-and-hair](./feedback-image-face-and-hair.md) · [feedback-image-noise-reduction](./feedback-image-noise-reduction.md) — the rest of the render stack this rule sits atop
