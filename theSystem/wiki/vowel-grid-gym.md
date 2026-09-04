---
palace: tactical-memory
level: 5
domain: 10
room: 14
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/vowel-grid-gym.md
---

# Vowel Grid

**Summary**: A runnable **articulatory map** of the vowel space — the reference layer under the drills. Two diagrams are driven by a single coordinate: a **vowel trapezoid** (tongue frontness × jaw openness) and a **sagittal cross-section of the mouth** whose tongue outline is *generated* from that same coordinate, so the dot on the chart literally **is** the tongue's constriction point rather than a symbol for it. Dragging anywhere in the trapezoid — including the empty space between labelled vowels — morphs the tongue continuously and plays that exact position through a **formant synthesizer** (F1 tracks jaw, F2 tracks tongue). Covers English (12 monophthongs + 8 diphthongs), French (oral + nasal, with the front-rounded set tied to its unrounded partners), and a **Georgian L1 overlay** that flags which targets have no native anchor to fall back on. It is the *map* companion to [l2-phonology-gym](./l2-phonology-gym.md)'s *drill*: that gym trains contrasts you can already hear as separate; this page shows where in the mouth they live and why they collide. **Status: BUILT** — [`gyms/vowel-grid-gym.html`](../../gyms/vowel-grid-gym.html), fully offline, keyword clips optional. This page is the canonical owner of the Vowel Grid in this wiki.

**Sources**:
- Design trigger (2026-07-21): Pronunciation Studio, ["Vowel Grid (explained)"](https://www.youtube.com/shorts/YmNO1JTAOjA) — a YouTube Short pairing an animated sagittal mouth with a dot moving in the vowel trapezoid
- Vowel inventories: RP English; standard French (FR/BE/CH, per the exclusion note in [`gyms/build-l2-phonology-audio.py`](../../gyms/build-l2-phonology-audio.py)); Georgian 5-vowel system
- `wiki/assets/confusion-map-fr-seed.json` — the French weak points this page maps (front rounded /y ø/, three-way nasals)

**Last updated**: 2026-07-22

---

## The one idea

A vowel is not a symbol; it is a **place in the mouth**. Two numbers locate it:

| Axis | Articulation | Acoustics |
|---|---|---|
| horizontal | how far **front** the tongue humps | F2 |
| vertical | how far the **jaw** drops | F1 |

Every other feature (lip rounding, nasality, length) rides on top of those two. The page takes this literally: one state object `{x, y, r, n}` feeds *both* diagrams, so they cannot disagree. This is the [single-source-of-truth](./software-design-principles-for-neural-os.md) rule applied to a diagram pair — the usual failure mode of a two-panel explainer is that the panels drift, because each is drawn by hand.

## Why the tongue is generated, not drawn

Hand-drawing 20+ tongue shapes would make the link between the panels a *claim* rather than a *mechanism*. Instead the tongue's surface is computed: a Gaussian bump pushed toward the palate, whose **position** comes from `x` and whose **height** comes from `1 − y`, blended between two fixed guide curves (palate above, mouth floor below).

Three consequences fall out for free, which is the test that the abstraction is the right one:

1. **Diphthongs are just tweens.** Interpolate the coordinate and the dot slides while the tongue morphs in step — no second animation system.
2. **The in-between positions are real.** Dragging to an unlabelled spot yields a genuine, sayable articulation, so the space reads as continuous rather than as 20 discrete buttons. This is the point most vowel charts lose.
3. **The link is visible.** A green marker rides the tongue's highest point and matches the dot on the chart — the lesson is drawn, not asserted.

## The three inventories

- **English (RP)** — 12 monophthongs + 8 diphthongs. Each diphthong draws its glide arrow only when selected; drawing all eight at once turns the chart into a ball of string.
- **French** — /y ø œ/ sit on **exactly** the same tongue position as /i e ɛ/ and differ only in the lips. That identity is the whole lesson, so plotting them on top of their partners would hide it; the page offsets the drawn dot and ties it back with a dotted line, while the synthesizer keeps using the true position. Nasals get a dashed halo, a lowered velum in the side view, and airflow marks through the nose.
- **Georgian** — the 5-vowel L1, usable as a ghost overlay on either target language.

## The L1-gap flag

The Georgian overlay is not decoration. For every target vowel the page finds the nearest Georgian anchor in articulatory space (frontness, openness, and rounding, since unrounding is the default L1 error) and flags one of three states: **close / will drift toward it / no anchor**. That last state is the useful one — it names the vowels with nothing native to fall back on, which is exactly the set worth drilling in [l2-phonology-gym](./l2-phonology-gym.md). Diphthongs are scored at both endpoints and reported on the worse one, since Georgian has no diphthongs at all and renders them as two separate vowels.

This makes the page a **targeting tool** for the drill, not just a reference: it answers *which contrasts deserve weight* from articulation, independently of the empirical re-weighting the confusion-map does from measured errors.

## Sound: two tiers

| Tier | Used for | Mechanism |
|---|---|---|
| recorded | the labelled vowels | one neural voice per language, keyword clips built by [`gyms/build-vowel-grid-audio.py`](../../gyms/build-vowel-grid-audio.py) |
| synthesized | everywhere else | Web Audio: a sawtooth glottal source through three bandpass resonators at F1/F2/F3, with a notch engaged for nasals |

The synthesizer is what makes free-dragging meaningful — the formant mapping *is* the acoustics, which is why sliding across the chart sounds like a vowel gliding rather than like a slideshow. Deliberately **one voice per language**, unlike [l2-phonology-gym](./l2-phonology-gym.md)'s four: many talkers are the active ingredient of [HVPT](./l2-phonology-gym.md), but a reference map wants a single steady voice. The page degrades cleanly to pure synthesis if the clips were never built.

## Relation to the other language tools

- [l2-phonology-gym](./l2-phonology-gym.md) — drills contrasts (ABX/HVPT) and measures which collapse. This page shows *why* a given pair collapses: they are neighbours in the space, or they share a tongue position and differ only in the lips.
- [intonation-fluency-gym](./intonation-fluency-gym.md) — the suprasegmental layer. Vowel Grid is segmental and static; that gym is prosodic and temporal.
- [language-learning-architecture](./language-learning-architecture.md) — names the phonology gap these three tools fill.

## Not done

- **No scoring, no SR, no [METER](./meter-overview.md) events.** This is a reference surface, not a gym; nothing here is measured, and it deliberately keeps no state. If a "find the vowel I just played" quiz is added later it becomes a gym and needs a METER contract.
- **Lip rounding is inferred while dragging** (back + close ⇒ rounded), because the chart has only two axes. Selecting a labelled vowel uses its true rounding value.
- **Nasality is French-only.** The velum animation exists but no other inventory uses it.

## Related pages

- [l2-phonology-gym](./l2-phonology-gym.md)
- [intonation-fluency-gym](./intonation-fluency-gym.md)
- [language-learning-architecture](./language-learning-architecture.md)
- [web-gym-generation-schema](./web-gym-generation-schema.md)
