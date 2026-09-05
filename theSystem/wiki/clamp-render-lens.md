---
palace: meta-knowledge
level: 7
domain: 10
room: 7
semantic_mode: 5
wiki_source: wiki/cross-cutting/clamp-render-lens.md
---

# CLAMP

> **Stage 2 of [image-pipeline](./image-pipeline.md)** — CLAMP is the render-direction half (Stage 2); [REMAPS](./remaps.md) is the transformation half (Stage 1). See [image-pipeline](./image-pipeline.md) for the unified workflow.

**Summary**: Five-slot render lens — Camera · Lighting · Aspect/use-mode · Medium · Preserve/Proscribe — that adapts a [REMAPS](./remaps.md)-encoded scene into a production-grade image-generation prompt for ChatGPT, DALL-E, Midjourney, and similar models. REMAPS makes a scene retrievable; CLAMP fixes the render. The two compose into one prompt template: scene-from-REMAPS + render-directives-from-CLAMP.

**Sources**:
- `imgen/GPT Image Generation Models Prompting Guide.md` (OpenAI cookbook, gpt-image-2, 2026)
- `imgen/Prompts for AI images 10 examples and tips for better results.md` (Meta AI, 2026)
- `imgen/Complete List of Styles for AI Image Generation (100+ Prompts).md` (Travis Nicholson, 2025)

**Last updated**: 2026-09-05 (§A — Aspect & use-mode: implementor leak flagged, from the [GoF Bridge](./software-design-principles-for-neural-os.md) adoption); 2026-05-22
%%  %%
---

## What CLAMP Is

CLAMP is a render-direction lens, not a scene encoder. It does not decide *what* is in the image (that is [REMAPS](./remaps.md)'s job — and upstream, the encoder that built the scene: [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), etc.). CLAMP only supplies the *render directives* that a modern image generator needs but that REMAPS does not name: camera/lens choice, named lighting recipes, output aspect and use-mode, rendering medium + era anchor, and the constraints (invariants + negatives + verbatim text) that prevent drift.

Reach for CLAMP when you need to push a REMAPS scene through an image generator and want production-grade output on the first or second try, not the tenth.

## Why REMAPS Alone Is Not Enough

REMAPS' six moves cover viewpoint (Rotate), intensity (Exaggerate), morphology / motion (Modify-Merge-Move), anchoring (Associate), placement (Play-Palace-Path), and sensory channels (Sensations). What it does *not* cover, surfaced by the three imgen-tagged ingest sources:

| Image-gen axis | REMAPS coverage | CLAMP slot |
|---|---|---|
| Capture geometry — 35mm, anamorphic, macro, fisheye | partial via Rotate (viewpoint only, not lens character) | **C** |
| Lighting recipe — golden hour, chiaroscuro, softbox, neon, candlelit | partial via Sensations (mood, not named recipe) | **L** |
| Output aspect + use-mode register — `1024×1536`, ad, slide, infographic, UI mock | none | **A** |
| Rendering medium + era anchor — oil paint, 3D render, anime cel, 1970s pulp, Studio Ghibli | none (REMAPS is medium-agnostic) | **M** |
| Constraints — invariants ("preserve identity"), negatives ("no watermark"), verbatim text | none (REMAPS does not address generation drift) | **P** |

Of these, **P (Preserve/Proscribe)** is the highest-leverage axis in practice. Every production prompt in the OpenAI cookbook has an invariants line + a negatives line; iteration prompts re-state them on every round to prevent drift. (source: imgen/GPT Image Generation Models Prompting Guide.md §2 Prompting Fundamentals → "Constraints (what to change vs preserve)")

## The Five Slots

### C — Camera / Lens

Specifies *how the image was captured*, not what is in it.

Common values:
- **Lens** — 35mm film · 50mm portrait · macro · fisheye · anamorphic · telephoto compression
- **Distance / framing** — extreme close-up · close-up · medium · wide · establishing wide
- **Capture style** — iPhone candid · DSLR studio · disposable-camera 90s · drone aerial
- **Depth** — shallow depth of field · everything in focus · tilt-shift miniature

Detailed camera specs are interpreted loosely (they set the *look*, not exact physical simulation). Use them for high-level look and composition rather than as a literal physics spec. (source: imgen/GPT Image Generation Models Prompting Guide.md)

### L — Lighting recipe

Named lighting setups carry more information than generic mood words.

Common values:
- **Time-of-day** — golden hour · blue hour · noon overhead · twilight · moonlit
- **Studio** — softbox · rim lighting · backlit silhouette · dramatic side lighting · high-key · low-key
- **Atmosphere** — chiaroscuro · candlelit · neon glow · overcast diffuse · volumetric god rays
- **Direction** — top-down · side-light · backlight · under-lit (horror cue)

Where [REMAPS](./remaps.md) Sensations supplies "heat, stickiness, smell" as retrieval hooks, CLAMP Lighting supplies the *named photographic recipe* that gpt-image and Midjourney recognize as a learned token.

### A — Aspect & use-mode

Two coupled questions: what shape is the output, and what artifact is it?

**Aspect / size** (gpt-image-2 popular sizes — source: imgen/GPT Image Generation Models Prompting Guide.md §1.1):
- `1024×1024` — square, general-purpose default
- `1024×1536` — HD portrait (most common for character / scene)
- `1536×1024` — HD landscape (slides, banners, infographics)
- `1536×864` — pitch-deck slide
- `2560×1440` — 2K reliability ceiling

> **Implementor leak, flagged 2026-09-05.** These five values are gpt-image-2's pixel grid, not the slot's concept. Midjourney expresses the same intent as `--ar 2:3` and has no pixel grid at all, so a lens that declares itself tool-agnostic (§When Not to Use CLAMP) is carrying one implementor's dialect inside an abstraction slot. Surfaced by adopting [GoF Bridge](./software-design-principles-for-neural-os.md), whose invariant is *implementor-specific values do not live in lens slots*; it is the sole counted instance in that pattern's `render.lens_implementor_leak` floor. The A slot's **question** — what shape is the output, and what artifact is it — is abstraction and stays; whether to keep the numbers as a worked gpt-image-2 example or lift them to ratios is this page's call.

**Use-mode** (sets polish register):
- Ad / campaign · UI mock · infographic · slide · product shot · portrait · concept art · storyboard · logo

The use-mode is what OpenAI calls "intended use" — it sets the model's polish mode and level of finish. (source: imgen/GPT Image Generation Models Prompting Guide.md §2)

### M — Medium + era anchor

The visual medium plus an optional era/genre anchor that lets the model lock onto a recognizable aesthetic.

**Medium** (rendering style):
- Photography — photorealistic · documentary · editorial · candid · 35mm film
- Painting — oil painting · watercolor · gouache · acrylic · fresco
- Illustration — line art · ink illustration · pencil sketch · children's-book watercolor · storybook fantasy
- 3D — realistic 3D render · stylized 3D · low-poly · isometric 3D · clay-style · voxel
- Print — engraving · woodcut · halftone comic · retro magazine flash
- Animation — anime cel · cartoon modern · 2D Disney · Studio Ghibli

**Era anchor** (optional — fuses medium + world):
- 1970s sci-fi pulp paperback · 1980s synthwave · 1990s magazine flash · Renaissance painting · Baroque · Impressionist · Art Nouveau · medieval manuscript · vaporwave · cyberpunk · neo-noir

A single phrase like "Studio Ghibli forest" or "1970s sci-fi pulp paperback cover" carries both medium and world simultaneously and is more compact than naming both separately.

### P — Preserve / Proscribe

The constraints layer. Has three sub-parts; all three are load-bearing for editing and iteration workflows.

**Preserve** — invariants that must not change:
- Identity (face, body shape, hair, expression)
- Geometry / layout / camera angle / framing
- Background / surrounding objects
- Brand elements / logos / typography
- "Change only X, keep everything else the same"

**Proscribe** — negatives:
- No watermark · no extra text · no unrelated logos · no trademarks
- No glamorization · no heavy retouching · no cinematic grading (when documentary look is wanted)
- No clip art · no gradients · no decorative clutter (when minimal is wanted)

**Text in image** (verbatim string + typography):
- Put literal text in **quotes** or **ALL CAPS**
- Specify font style, size, color, placement
- For tricky words, spell letter-by-letter
- `Text (verbatim): "Yours to Create"` — clean sans-serif, centered, no extra characters

(source: imgen/GPT Image Generation Models Prompting Guide.md §2 + §4.5 + §5.5)

## Prompt Template

```
[REMAPS scene sentence — subject + action + viewpoint + materials + motion + sensory hooks],
[Medium + era anchor], [Lighting recipe], [Camera/lens], [Aspect/use-mode].

Preserve: [invariants — identity, layout, background, brand elements]
No: [negatives — watermark, extra text, logos, unwanted styling]
Text (verbatim): "[exact string]" — [typography directives]
```

Order matters: OpenAI's cookbook recommends `background/scene → subject → key details → constraints`, with the use-mode set early to lock the model's polish register. (source: imgen/GPT Image Generation Models Prompting Guide.md §2)

## REMAPS × CLAMP Composition

| Slot | REMAPS supplies | CLAMP supplies |
|---|---|---|
| Subject identity | Modify · Sensations (texture, material, smell) | Preserve (lock face/body/hair on edit passes) |
| Viewpoint | Rotate (orientation, side, upside-down) | Camera (lens, distance, depth of field) |
| Mood | Sensations (heat, stickiness, sound) | Lighting (golden hour, chiaroscuro, neon) |
| Composition | Play-Palace-Path (locus, route) | Aspect (output size + use-mode register) |
| Distinctiveness | Exaggerate (100× the key feature) | Medium (named genre that disambiguates) |
| Drift control | none — REMAPS does not address generation | Preserve / Proscribe + verbatim Text |

The composition is additive, not overlapping: REMAPS describes the *scene*, CLAMP describes the *capture and constraints*. A finished prompt strings the REMAPS scene sentence first, then the four CLAMP attribute slots (M·L·C·A), then the P block.

## Worked Example — Genesis Image Prompt

Starting from bible-book-image-prompts Genesis seed:

> A vast cosmic dawn breaking over a primordial garden, two human silhouettes beneath a fruit-laden tree, a serpent coiled in the branches, oil painting, dramatic chiaroscuro.

This already mixes scene + medium + lighting. Refactored explicitly through REMAPS×CLAMP:

**REMAPS scene** (Rotate, Exaggerate, Modify-Merge-Move, Sensations applied):
> A vast cosmic dawn breaking over a primordial garden — two silhouetted human figures, small against the scale of creation, beneath a fruit-laden tree whose ripe fruit catches the first horizontal light; a serpent coiled in the branches above them, its scales reflecting dawn-light. Mist rising from dew-soaked grass; the silence before first breath.

**CLAMP block:**
- **M** — Renaissance oil painting, Caravaggio influence
- **L** — Dramatic chiaroscuro; warm horizontal dawn light from frame-left; deep shadow on the right
- **C** — Wide establishing shot, eye-level, slight low angle to emphasize the tree's scale; everything in focus
- **A** — `1024×1536` HD portrait; concept art for a Bible-locus encoding asset
- **P**:
  - Preserve: composition (two figures beneath tree, serpent in branches) — these three elements must be unambiguously legible
  - No: text · no watermark · no modern dress · no logos · no cinematic color grading
  - Text (verbatim): none

**Final prompt:**

> A vast cosmic dawn breaking over a primordial garden — two silhouetted human figures, small against the scale of creation, beneath a fruit-laden tree whose ripe fruit catches the first horizontal light; a serpent coiled in the branches above them, scales reflecting dawn-light. Mist rising from dew-soaked grass. Renaissance oil painting, Caravaggio influence, dramatic chiaroscuro with warm horizontal dawn light from frame-left and deep shadow on the right. Wide establishing shot, eye-level with slight low angle. `1024×1536` HD portrait, concept art for a Bible-locus encoding asset.
>
> Preserve composition: two figures beneath the tree, serpent in branches — all three unambiguously legible.
> No text · no watermark · no modern dress · no logos · no cinematic color grading.

Same pattern applies to the other 65 book seeds in bible-book-image-prompts: keep the seed line as the REMAPS scene, then standardize the CLAMP block per book or per arc (Pentateuch, prophets, gospels, epistles, apocalyptic each get a stable CLAMP profile).

## Iteration Discipline — A Tension With REMAPS

[REMAPS](./remaps.md) practical rule: when an encoded card isn't sticking, *change 2–3 dimensions per revision pass*. This breaks stuck encodings by maximizing the perceptual delta on each retry.

OpenAI's image-gen rule (source: imgen/GPT Image Generation Models Prompting Guide.md §2 "Iterate instead of overloading"): when refining an image, *change one thing per round* — `"make lighting warmer"`, `"remove the extra tree"`, `"restore the original background"` — so you can isolate what each change did and prevent drift on the elements you want preserved.

Both rules are right; they apply in different modes:

| Mode | Rule | Why |
|---|---|---|
| Memory encoding (REMAPS) | Change 2–3 dimensions per pass | Goal is *break-through* on a stuck card; perceptual delta matters more than diagnosability |
| Image-gen edit pass (CLAMP) | Change one thing per round | Goal is *identity preservation*; diagnosability matters more than perceptual delta |

When you are *generating a new image*, full REMAPS+CLAMP prompt is fine. When you are *editing an existing image*, single-attribute edit is the rule, and the P block is restated in full on every round to prevent drift on invariants. (source: imgen/GPT Image Generation Models Prompting Guide.md §5)

## When to Reach for CLAMP

- Generating a new image from a REMAPS-encoded scene (peg-matrix cell, code-glyph, Bible-book locus, palace room visual)
- Producing illustration assets for a wiki page or palace locus
- Generating infographics, diagrams, slides, or UI mockups where the use-mode matters
- Editing an existing image where identity / layout / brand elements must be preserved
- Any prompt where text must appear *in* the image (verbatim string + typography)

## When Not to Use CLAMP

- Pure encoding work where the scene will never be rendered — REMAPS is sufficient on its own
- One-off throwaway images where polish does not matter — minimum viable prompt is fine
- Prompts targeting image models with their own DSL (Midjourney `--ar` / `--style`) — CLAMP is tool-agnostic but you may shadow a slot with the tool's native syntax

## How CLAMP Composes With Other Frameworks

CLAMP sits one layer downstream of [REMAPS](./remaps.md) and operates in the render-direction concern only. Composition order from a scene to a finished image:

1. **Encoder** ([NEDF](./nedf-overview.md) / [CAST](./cast-overview.md) / [SPEAR](./spear-overview.md) / [HEART](./heart-overview.md) / [ORACLE](./oracle-overview.md) / [GRACE](./grace-overview.md)) builds the slot-filled scene
2. **REMAPS** transforms it for retrievability (rotate, exaggerate, merge, animate, place, sense)
3. **CLAMP** adapts it for rendering (camera, lighting, aspect/use-mode, medium, preserve/proscribe)
4. **Image model** ingests the composed prompt

This is an instance of the [Adapter pattern](./software-design-principles-for-neural-os.md): CLAMP adapts an internal-format scene (REMAPS output) to an external-format prompt (gpt-image-2 / Midjourney input).

Per the [UMTF](./universal-mental-tagging-framework.md) taxonomy, CLAMP slots route to Sensory (M, L), Spatial (C, A), and Pattern (P invariants) tag families — but UMTF is the input taxonomy for *encoding*, not for *rendering*, so the routing is informational rather than load-bearing.

CLAMP slots also function as **structural scaffolding** in non-rendering contexts. In the [aphantasia mental scene builder](./memory-palace-for-aphantasia.md) protocol (see that page §3-Framework Mental Scene Builder), C (viewpoint angle), L (light-source direction and quality), A (scene scale / closeness), M (stylistic register), and P (invariants + explicit absences) are filled as explicit spatial parameters for top-down mental scene construction — not as image-generator directives. The five slots give an aphantasic user a parameterized container the mind can navigate without spontaneous imagery.

## Default World Profile

David's default visual-style world for all CLAMP invocations is [Velvet Aeon](./world-velvet-aeon.md) — a photoreal-with-painterly-soul world with three sub-modes (Mortal · Cosmic · Environment) and a locked palette. Unless overridden, CLAMP M·L·C·A defaults are pulled from the chosen Velvet Aeon sub-mode, and the P-slot Preserve / No lists are loaded from the world profile. See [world-velvet-aeon](./world-velvet-aeon.md) for the full template and worked examples.

## Related Pages

- [world-velvet-aeon](./world-velvet-aeon.md) — the default visual-style world profile for all CLAMP invocations in this wiki
- [remaps](./remaps.md) — the upstream scene-transformation companion; CLAMP runs *after* REMAPS on the same scene
- bible-book-image-prompts — 66-book canonical worked-example application of REMAPS+CLAMP (each book seed = REMAPS scene; per-arc CLAMP profile)
- [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) — 100 REMAPS scenes that can each be pushed through CLAMP into a rendered peg image
- code-glyph-remaps-scenes — REMAPS scenes for the 14 code-glyph shapes; candidate CLAMP profile is `M: 3D render or line art · L: studio softbox · C: square macro · A: 1024×1024 icon · P: no text, no background`
- [representation-rules](./representation-rules.md) — upstream "what to put in slots" rules; both REMAPS and CLAMP are downstream of representation choices
- [music-generation-frameworks](./music-generation-frameworks.md) — MASTER, the audio twin of CLAMP (render half of the music pipeline); the same `transform→render` split for a different output medium. Provisional until a text-to-music prompting source is ingested
- [glossary](./glossary.md) — registry entry under cross-cutting layers
