---
palace: core-memory
level: 7
domain: 10
room: 5
semantic_mode: 5
wiki_source: wiki/learning-systems/visualization-atomic-design.md
---

# Visualization Atomic Design

**Summary**: A five-level hierarchy for decomposing and constructing mental scenes — **Atoms** (single perceptual properties) · **Molecules** (2–3 atoms forming one recognizable perceptual unit) · **Organisms** (fully described objects or environments) · **Templates** (reusable Principle-driven composition schemas) · **Pages** (complete parameterized scene instances). Applies the Atomic Design pattern to mental imagery, giving a shared vocabulary for diagnosing visualization failures at the right level and a structured build-up sequence that maps 1:1 onto the [visualization-training](./visualization-training.md) stage ladder.

**Sources**: Derived from [visual-art-fundamentals](./scene-grammar.md), [remaps](./remaps.md), [clamp-render-lens](./clamp-render-lens.md), [visualization-training](./visualization-training.md), [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md).

**Last updated**: 2026-05-24

---

## Why Atomic Design for Visualization?

When a mental scene fails to stick, the diagnostic question is: *at which level did it fail?* A scene can be compositionally correct (Template level) but fail because the subject has no volume (missing Form molecule) or the light has no direction (Atom gap). Without a shared level vocabulary, every failure diagnosis collapses into the vague instruction "make it more vivid" — which is useless.

Atomic Design gives the vocabulary:

| Level | Unit | Build direction | Diagnostic question |
|---|---|---|---|
| **Atom** | Single perceptual property on one axis | Start here | What specific axis is missing or flat? |
| **Molecule** | 2–3 atoms with internal logic | Combine atoms | Which atom combination is incoherent? |
| **Organism** | Fully described object or environment | Assemble molecules | Which molecule is weak or missing? |
| **Template** | Reusable Principle-driven schema | Choose the composition rule | Which Principle governs — or is absent? |
| **Page** | Complete parameterized scene instance | Specify everything | Which slot is still at its default? |

**Build direction**: Atoms → Molecules → Organisms → Templates → Pages (bottom-up construction)
**Diagnostic direction**: Pages → Templates → Organisms → Molecules → Atoms (top-down failure triage)

**Mnemonic**: **A Man Often Takes Photographs** — Atoms · Molecules · Organisms · Templates · Pages
**Memory checksum**: 5 levels · build bottom-up · diagnose top-down · each level explained by the one below it

---

## Level 1 — Atoms

An Atom is a single perceptual property on a single axis. It cannot be decomposed further. Each Atom maps to one axis of one Element of Art from [visual-art-fundamentals](./scene-grammar.md).

### Complete Atom inventory

| Element | Atom axes | Example values |
|---|---|---|
| **Line** | Direction | vertical · horizontal · diagonal · curved |
| **Line** | Quality | thick · thin · sharp · fuzzy |
| **Line** | Type | actual (visible) · implied (alignment / eye movement) |
| **Shape** | Form type | geometric (circle, square, triangle) · organic (blob, leaf, silhouette) |
| **Shape** | Boundary | hard-edged · soft-edged · dissolving |
| **Form** | Light-source position | top-left · side · rim · bottom · overhead |
| **Form** | Shadow presence | cast shadow present · shadow absent |
| **Form** | Specular highlight | present · absent |
| **Value** | Lightness level | pure black → gray → pure white (one point on the scale) |
| **Color** | Hue | one hue family (red / gold / blue / green / neutral) |
| **Color** | Temperature | warm · cool · neutral |
| **Color** | Saturation | vivid · muted · gray |
| **Space** | Space type | positive (object) · negative (void) |
| **Space** | Depth cue | overlap · scale diminishment · atmospheric perspective · placement-high |
| **Texture** | Roughness | ultra-smooth → satin → rough → coarse → jagged |
| **Texture** | Reflectivity | matte → satin → glossy → mirror |
| **Texture** | Material grain | wood · fabric · stone · metal · skin · crystal |
| **Sensation** | Touch quality | cold · warm · wet · dry · heavy · weightless |
| **Sensation** | Ambient sound | silence · low hum · sharp crack · soft breath · distant roar |
| **Sensation** | Temperature | extreme cold · cool · body-warm · hot · burning |
| **Sensation** | Smell / taste | metallic · earthy · sweet · acid · sea-salt |

**Atom drill**: isolate one axis, run its full range of values on a seed object, observe the perceptual difference between each step. No combining yet. This is the Stage 1–2 work in [visualization-training](./visualization-training.md).

**Atom failure mode**: the axis is left at its default zero — the light source has no named direction, the texture has no roughness value, the color has no temperature. Every un-specified Atom is a retrieval gap.

---

## Level 2 — Molecules

A Molecule is 2–3 Atoms combined with **internal logic** — the atoms do not just coexist, they explain each other. The light-source Atom determines which side the shadow falls on. The roughness Atom determines whether the reflectivity Atom produces sharp or diffuse highlights.

### Standard Molecules

| Molecule | Constituent atoms | Internal logic | What it answers |
|---|---|---|---|
| **Surface** | Material grain + Roughness + Reflectivity | Roughness and reflectivity are co-constrained: rough surfaces diffuse reflections regardless of chosen material | *How does this surface behave?* |
| **Light** | Source direction + Color temperature + Intensity | Temperature and intensity define shadow color and contrast ratio together | *Where does the light come from and what character does it have?* |
| **Form** | Shape silhouette + Light position + Shadow side + Specular apex | Light position determines shadow side and specular position — three atoms with one cause | *Does this object have volume?* |
| **Space** | Subject scale + Distance + Depth cue type | Scale and chosen depth cue must agree (large objects use overlap; small distant objects use atmospheric haze) | *How is the subject positioned in space?* |
| **Atmosphere** | Background color temperature + Value range + Ambient medium | Temperature and value range constrain each other; the medium (fog, clear air, dusk) determines both | *What is the world made of?* |
| **Sensation** | Touch quality + Sound quality + Temperature | Multi-sensory molecules: cold + dripping sound + wet cloth → one coherent scene-presence even without imagery | *What does it feel like to be inside this scene?* |

**Molecule drill**: Stage 3 in [visualization-training](./visualization-training.md) — cross-axis chains. Take the Form molecule: pick a Shape (circle), pick a light-source direction (top-left), then the shadow falls (bottom-right), then the specular highlight appears (top-left edge). All three steps follow from one choice. This is the Stage 3 "cross-domain pairs" work.

**Molecule failure mode**: atoms combined without internal logic (warm light casting a cool shadow; rough surface with a mirror-sharp reflection). The molecule is incoherent — the visual system feels the contradiction even if the viewer cannot name it.

---

## Level 3 — Organisms

An Organism is a fully described object or environment — all relevant Molecules present, all atoms specified within them, resulting in a complete perceptual entity that can be placed in a scene without further ambiguity.

### Subject Organism

The complete description of the central figure or object:

```
Subject Organism = Form molecule (volume + light)
                 + Surface molecule (material + texture + reflectivity)
                 + Color (hue + temperature + saturation)
                 + Sensation molecule (touch + sound + temperature of this object)
                 + State (active / passive — what is it doing?)
                 + Spatial position (where relative to viewer)
```

A Subject Organism without Form molecule is flat. Without Surface molecule it is generic. Without State it is static (the REMAPS M-Move failure).

### Environment Organism

The complete description of the space surrounding the subject:

```
Environment Organism = Space molecule (scale + distance + depth cues)
                     + Atmosphere molecule (background temperature + value range + medium)
                     + Horizon / boundary (where does the world end?)
                     + Lighting environment (which Light molecule governs the whole scene)
```

### Relationship Organism

Two Subject Organisms with their relational properties specified:

```
Relationship Organism = Subject A + Subject B
                      + Contrast (which Element axis is opposite between them?)
                      + Balance (does their visual weight feel equal?)
                      + Space between (what is the negative space doing?)
```

**Organism drill**: Stage 4 in [visualization-training](./visualization-training.md) — hub building. A hub scene IS an Organism: one subject fully described, placed in an environment, with enough internal logic to hold stable for 1+ week. The 5-anchor stability test = the Organism is complete.

**Organism failure mode**: a required Molecule is missing. Most common: the Form molecule is absent (flat subject with no volume — Shape without Form). Second most common: the Atmosphere molecule is absent (subject floats in a void with no environmental logic).

---

## Level 4 — Templates

A Template is a reusable **Principle-driven composition schema** — a named arrangement rule that specifies how Organisms relate to each other to produce a specific compositional effect. Templates are not instances; they are schemas. The same Template can be filled with different Organisms to produce different scenes with the same compositional logic.

Each Template maps to one governing [Principle of Design](./scene-grammar.md).

### Standard Templates

| Template | Governing Principle | Schema | Diagnostic signature |
|---|---|---|---|
| **Emphasis** | Emphasis / Contrast | One Subject Organism at maximum contrast (max Value + max Saturation + largest Scale) · surrounded by muted Environment Organism · all other elements neutral | The eye goes immediately to one point and cannot leave |
| **Harmony** | Harmony | Multiple Subject Organisms sharing one Color temperature · unified Atmosphere molecule across all · no individual element claims priority | Scene feels like one coherent world |
| **Tension** | Contrast | Two Relationship Organisms with opposing Atoms (warm vs cool · rough vs smooth · lit vs shadow) · Space between them is the composition's load-bearing element | The negative space between them *charges* |
| **Narrative** | Rhythm / Movement | Three or more Subject Organisms along a progressive path · each smaller/darker/further than the last · path leads to one destination | Eye follows a route through the scene |
| **Mnemonic** | All REMAPS moves | Subject Organism + all 6 REMAPS moves applied · Palace dock address specified · REMAPS A-move applies one Principle as the Aesthetic target | Scene is distinctive, vivid, addressed, retrievable |
| **Render-ready** | Mnemonic + CLAMP | Mnemonic template + all 5 CLAMP slots filled (C · L · A · M · P) · P block (Preserve + Proscribe + Verbatim) written | Scene can be sent to image generator as a production prompt |

**Template drill**: Stages 5–6 in [visualization-training](./visualization-training.md) — image streaming. When Image Streaming is running, Templates emerge spontaneously. The exercise is to name which Template each streamed scene instantiates and then call the same Template deliberately.

**Template failure mode**: no governing Principle — the Organisms are present but the arrangement rule is absent. The scene has content but no composition. Every scene should have one dominant Template; additional Templates may support but not compete.

---

## Level 5 — Pages

A Page is a **complete parameterized instance** of a Template — every Atom is specified, every Molecule is coherent, every Organism is fully built, and the Template has been chosen and filled. A Page is stable under retrieval pressure: it does not degrade into vague impressions.

Pages in different contexts:

| Page type | Completion criterion | Retrieval test |
|---|---|---|
| **Palace locus page** | Subject Organism + Mnemonic Template complete + REMAPS all 6 moves checked + palace dock address named | Can be retrieved from the palace address alone in ≤ 3 seconds |
| **NEDF concept page** | Name-hook scene = Subject Organism with Emphasis Template applied · Distinguisher = Contrast atom identifying the key difference · Failure = State atom showing the failure mode | All 4 NEDF slots retrievable in ≤ 6 seconds |
| **Image generation page** | Render-ready Template complete · P block written · Velvet Aeon world profile loaded as default M + L defaults | Sends to ChatGPT / gpt-image-2; production output in 1–2 rounds |
| **Peg-matrix cell page** | 100 cells each = Subject Organism (audio peg merged with visual peg via REMAPS M-Merge) + Emphasis Template | Any cell retrieved in ≤ 3 seconds from number cue alone |

**METER pass criterion for a Page**: all 7 Elements specified (even if most are "neutral"), 2+ REMAPS moves applied, one governing Template named, retrieval time within target for the page type.

---

## Build Protocol — Bottom-Up Construction

When constructing a new scene from scratch:

```
1. ATOMS      — list which axes you will specify. Leave nothing at default.
                Start with: Value (how dark?), Color temp (warm/cool?),
                Form (light source direction?), Texture (rough or smooth?).

2. MOLECULES  — check internal logic. Does the light direction match the shadow?
                Does the roughness match the reflectivity behavior?
                Does the color temperature match the atmosphere molecule?

3. ORGANISMS  — is the Subject fully built? Form mol + Surface mol + Color + State.
                Is the Environment present? Space mol + Atmosphere mol.
                Is the Relationship (if any) defined? Contrast + Balance + Space between.

4. TEMPLATE   — pick one governing Principle. Which Template schema applies?
                Apply REMAPS A-move: the chosen Principle becomes the Aesthetic target.
                Apply the remaining 5 REMAPS moves to strengthen the Organism.

5. PAGE       — fill every remaining slot. Name the palace dock address.
                Fill CLAMP if generating an image (C · L · A · M · P).
                Run the retrieval test. Does it pass the time target?
```

---

## Diagnostic Protocol — Top-Down Failure Triage

When a scene fails to retrieve or feels weak:

```
1. PAGE failure?     — Is any slot still at its default or unspecified?
                       Fill it. If all slots are filled, go to Template.

2. TEMPLATE failure? — Is there a governing Principle? Name it.
                       If no Principle is driving the composition, add it.
                       If the Principle is present but weak, apply REMAPS E (Exaggerate)
                       to the focal element.

3. ORGANISM failure? — Is the Subject fully built?
                       Missing Form mol → run the 4-step inflation (light + shadow + specular + occlusion).
                       Missing Surface mol → name the material + roughness + reflectivity.
                       Static State → add REMAPS M-Move (active verb).

4. MOLECULE failure? — Are the atoms internally coherent?
                       Light direction vs shadow side — do they agree?
                       Roughness vs reflectivity — are they co-constrained?
                       Fix the atom that contradicts its molecule partner.

5. ATOM failure?     — Which axis is at its default zero?
                       Name a specific value for it. Run that axis through
                       its full range to find the right value.
```

---

## Mapping to Visualization Training Stages

| Stage | Visualization Training | Atomic Design level | Primary work |
|---|---|---|---|
| 0–2 | Kinesthetic seed · Afterimage · Object observation | **Atom** | One axis at a time; hold one property reliably |
| 3 | Object manipulation (8 domains) | **Molecule** | Cross-axis chains; Form mol + Surface mol + Light mol |
| 4 | Hub building | **Organism** | Full multi-molecule stable scene held for 1+ week |
| 5–6 | Intensity intervals · Image streaming | **Template** | Named schemas emerge; call Templates deliberately |
| 7–8 | Passive integration | **Page** | Spontaneous full-scene generation; all slots filled automatically |

---

## Mapping to the 3-Framework Image Pipeline

| Pipeline stage | Framework | Atomic Design scope |
|---|---|---|
| Stage 1 — *What's in the scene?* | [Visual Art Fundamentals](./scene-grammar.md) | Atoms (Element axes) + Template choice (Principle selection) |
| Stage 2 — *Does it stick?* | [REMAPS](./remaps.md) | Organisms (6 moves strengthen each object) + Mnemonic Template completion |
| Stage 3 — *How is it captured?* | [CLAMP](./clamp-render-lens.md) | Page completion (every slot specified; Render-ready Template → Page instance) |

The pipeline IS the bottom-up build protocol applied to image generation: VAF sets the Atom + Template vocabulary, REMAPS builds the Organism, CLAMP fills the Page.

---

## Aphantasia Adaptation

For aphantasic users, the five levels are *parameterized knowledge* rather than *visual experience*. The hierarchy works because spatial navigation (intact per Dawes et al. 2020) operates at the Organism and Template levels — the mind can navigate a parameterized container without seeing it.

| Level | Aphantasia mode |
|---|---|
| **Atom** | Named property: "I know the light is top-left" — not seen, known |
| **Molecule** | Logical dependency: "top-left light → bottom-right shadow" — reasoned, not seen |
| **Organism** | Spatial container: navigable by position + material + spatial relation without holistic imagery |
| **Template** | Named schema: "this is the Emphasis template" — held as a procedural fact |
| **Page** | Complete parameter set: all slots named; the scene is fully specified even if not seen |

The CLAMP-as-scaffolding mode from [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) §3-Framework Mental Scene Builder directly implements the Organism + Page levels for aphantasics: C=viewpoint Atom, L=Light molecule, A=Space molecule, M=Surface molecule register, P=Page invariants.

---

## Diagrams

Five-level hierarchy — Atoms at base, Pages at apex, with build direction (↑) and diagnostic direction (↓):

![visualization-atomic-design schematic](../diagrams/visualization-atomic-design.png)

---

## Related Pages

- atomic-design — Brad Frost's canonical five-tier methodology; owner of the Atoms · Molecules · Organisms · Templates · Pages spine
- [Visual Art Fundamentals](./scene-grammar.md) — owner of the Atom vocabulary (7 Elements as axes) and Template grammar (9 Principles as schema types)
- [visualization-training](./visualization-training.md) — Stage ladder that maps 1:1 to Atomic Design levels (Stage 0–2 = Atom, Stage 3 = Molecule, Stage 4 = Organism, Stage 5–6 = Template, Stage 7–8 = Page)
- [remaps](./remaps.md) — operates at Organism + Template level; the 6 moves strengthen Organisms and complete the Mnemonic Template
- [clamp-render-lens](./clamp-render-lens.md) — operates at Page level; fills the Render-ready Template into a complete Page instance
- [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) — Organism + Page levels adapted for parameterized spatial navigation without imagery
- [color-theory-mental-model](./color-theory-mental-model.md) — depth extension of the Color Atom (Hue/Value/Saturation) and the Color Molecule (harmony patterns)
- [vivid-imagery](./vivid-imagery.md) — phenomenological goal of a complete Page; what it feels like when all levels are filled

---

## U — See (CAST)
1. Five-level hierarchy: Atom → Molecule → Organism → Template → Page
2. Build direction ↑, diagnostic direction ↓

## D — Name (NEDF)
1. Visualization Atomic Design = 5-level scene decomposition framework
2. Distinguisher: levels explain *why* a scene fails, not just *that* it fails
3. Failure mode: diagnosing "vague scene" without naming the level — every fix lands at the wrong depth

## F — Do (SPEAR)
1. Scene fails → run diagnostic top-down: Page → Template → Organism → Molecule → Atom
2. Building new scene → run bottom-up: Atom → Molecule → Organism → Template → Page
3. Image generation → Pipeline maps: VAF (Atoms+Template) → REMAPS (Organism) → CLAMP (Page)

## B — Watch (HEART)
1. Skipping Molecule level — combining Atoms without checking internal logic
2. Missing Form molecule — flat scenes with no light direction (most common Organism failure)
3. Template absent — content present, composition absent

## L — Predict (ORACLE)
1. Missing Light molecule → flat scene even after REMAPS
2. No governing Template → compositional entropy under CLAMP

## R — Act (GRACE)
1. Weak scene → name the level → apply the fix at that level only
2. Strong scene → name the Template → it becomes a reusable schema
