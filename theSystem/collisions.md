# Collision Resolution Rules

Some images legitimately appear in multiple canonical tables. This file states,
for each known collision, which system *wins* at encoding and retrieval time
based on context.

**The core principle:** a mnemonic system works if, at retrieval time, the
scene fires the correct *meaning*. Same-image collisions are only a problem
when two meanings compete *in the same context*. Different contexts → no
conflict.

This file lists every known cross-system image overlap and the rule that
disambiguates it. Consult when building scenes that mix multiple systems.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-collisions) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## Section A — Fixed Collisions (already corrected)

These were real conflicts. They've been resolved by swapping one side:

| Image | Was | Now |
|-------|-----|-----|
| Net | PAO-O 2 | **Needle** (PAO-O 2 swapped) |
| Map | PAO-O 3 | **Mask** (PAO-O 3 swapped) |
| Bomb | PAO-O 9 | **Bell** (PAO-O 9 swapped) |
| Ball | Peg-V 0 | **Donut** (Peg-V 0 swapped) |

**Follow-up note on Mask and Bell:**
- "Mask" also appears in formula θ (Theta theater mask). Different contexts: PAO Mask is in a 3-item phone-number scene; Greek mask is in a formula scene. Covered by B6.
- "Bell" also appears in physics constant k_B (Thermometer with bell). Same disambiguation: PAO Bell in number scenes; k_B bell is a small detail inside a formula scene. Covered by B6.

---

## Section B — Accepted Collisions (context disambiguates)

These remain as-is. The rule states when each image means what.

### B1 — SEM3 animals ↔ Georgian animals

Several animals appear in both SEM3 (as numeric prefixes) and the Georgian
system (as node identities):

| Animal | SEM3 | Georgian |
|--------|------|----------|
| Zebra | 60 | ზ |
| Deer | 61 | ი (also შ Roe deer) |
| Elephant | 65 | ს |
| Giraffe | 66 | ჟ |
| Flamingo | 78 | ფ |
| Dinosaur | 01 | დ |
| Bat | (Major 91) | ღ |
| Cat | (Major 71) | კ |

**The rule: SEM3 animals only appear in numeric scenes; Georgian animals only
appear in node/graph scenes.**

Context markers that tell you which system is active:
- **SEM3 scene** — has a sensory category modifier (smell, sound, touch, etc.) and a Major image following it. Always 4 digits being encoded.
- **Georgian scene** — has the quadruple-alliteration signature (animal + person + adjective + environment, all starting with the same Georgian letter). Usually appears inside a palace or a CAST edge context.

If you can't tell from context which system is active, your scene needs a
stronger system-marker. Fix: thicken the SEM3 sensory anchor, or add the
Georgian person slot for disambiguation.

### B2 — Elemental vocabulary in SEM3, Hex/Binary, and CAST

The words **rock, lightning, lava, mud, cloud, ocean, storm, wave, fire,
water, ice** appear across three systems:

- **SEM3** uses them as category items (e.g., Touch 44 = Rock, Vision 05 = Lightning)
- **Hex/Binary** uses them as element×state scenes (Hex 0 = Ember / fire-solid, Hex B = Lightning storm / water-plasma)
- **CAST** uses them as stream/time values (Stream 00 = rock, Time 11 = purple storm)

**The rule: role in the scene determines the system.**

| Role | System | How it appears |
|------|--------|----------------|
| An object being sensed/touched/seen | SEM3 | "the rock feels…" / "the lightning flashes…" |
| A setting or element state | Hex/Binary | "rock wall" / "lightning storm" — the scene backdrop |
| Something flowing through an edge or as an environmental type | CAST | "rock flows from A to B" / "in a purple storm cave" |

Concretely:
- **SEM3 rock** (touch 44) is held, felt, stepped on
- **Hex C (earth-solid)** is the rock wall — structural backdrop; **hex 0** is fire-solid (ember), not a wall
- **CAST rock** is data moving along an edge

If the scene has *multiple* rocks, add a distinguishing detail: sensory rock is
always pressed against a character; hex rock is a wall; CAST rock is in motion.

### B3 — Colors in SEM3 vs CAST Time

| Color | SEM3 | CAST Time |
|-------|------|-----------|
| Red | 80 | 00 (red cave) |
| Blue | 84 | 01 (blue ocean) |
| Green | 83 | 10 (green sky) |

**The rule: SEM3 colors appear as *the thing itself* (a red object, a blue
object). CAST colors are always *environmental* — a cave, ocean, or sky.**

If you need a red object inside a CAST scene, make it a non-red *object* that
happens to glow red (distinction: object with color vs color-as-environment).

### B4 — Major ↔ Georgian shared words (fan, chair, tree, forest, bread, gate)

These are environment words that appear as Major 2-digit images AND as
Georgian environments:

| Word | Major | Georgian |
|------|-------|----------|
| Fan | 82 | ვ env |
| Chair | 64 | ს env |
| Tree | (Peg 3) | ხ env |
| Forest | (SEM3 28) | ნ env |
| Bread | (SEM3 29) | პ env |
| Gate | (Peg 8) | ჭ env / Γ |

**The rule: Major images appear in number-chunk scenes; Georgian
environments appear in node/palace scenes.**

A Georgian environment is always "[animal] doing [adjective] something in
[environment]" — part of the quadruple alliteration. A Major image is always
part of a number decomposition. If your scene is a full Georgian 4-slot
sentence, the "fan" is the Georgian ვ environment. Otherwise it's Major 82.

### B5 — Heuristic Palace loci vs other systems

Palace loci reuse common words (duck, case, base, door, scale, window,
painting). These never conflict because the Heuristic Palace is *always
walked as a palace*, not recalled as an encoding.

**The rule: you only encounter Heuristic Palace images when you deliberately
walk the palace. They don't interfere with encoding-time recall.**

### B6 — Greek uppercase/lowercase pairs

Ψ and ψ both relate to "psi." Ω and ω both relate to "omega." Σ and ∑ are the
same symbol used in different contexts.

**The rule: uppercase = structural/aggregate operation (Σ summation, Π
product). Lowercase = variable/constant (σ std dev, π ≈ 3.14).**

This is the standard math convention; the mnemonic system just mirrors it.
Not a collision — a feature.

### B7 — Operators that reuse Greek imagery

- Σ (Greek uppercase) = Sigma stacker = ∑ operator = Stacker crane
- Ψ trident ≈ ∇ downward trident

**The rule: Σ and ∑ are intentionally the same image — they're the same
symbol in math, and the mnemonic reflects reality.** For Ψ vs ∇, the
difference is orientation: Ψ is upright (3 prongs up), ∇ points downward.

### B8 — Cross-system elemental words

Words like **giant, dragon, mage, mermaid** appear only in CAST (as Character
roles). They might seem to collide with Δ "giant triangle mountain" but don't:
CAST giants are person-shaped; Δ giant is a mountain. Different image shapes
despite shared word.

**The rule: CAST characters are always humanoid. Formula "giants" are always
geometric (Δ mountain, etc.).**

---

## Section C — The General Disambiguation Algorithm

When you're building a scene that might mix systems, ask in order:

1. **What kind of thing am I encoding?** (number / concept / relationship / formula)
2. **Which system does that type belong to?** (Major / NEDF / CAST / Formula)
3. **Do I need a second system layered on top?** (e.g., a CAST edge whose weight is a number needs CAST + Major)
4. **If yes — do the images of both systems clash in this scene?** Check this table.
5. **If they clash — apply the rule above (role differentiation or scene markers).**

---

## Section D — How to Add a New Collision Rule

When you discover a new collision during encoding:

1. **Note the image, both systems it appears in, and both meanings.**
2. **Ask: does the context naturally separate them?** (90% of the time yes)
3. **If not, decide:**
   - Add a role-differentiation rule (like B2)
   - Swap one side (like Section A — rare)
   - Add a scene marker (special object that flags which system is active)
4. **Append the new rule to Section B of this file.**

---

## Key Principles

1. **Most collisions are fine.** Context does the disambiguating work.
2. **Same-role collisions are NOT fine** — swap one side immediately.
3. **SEM3 and Georgian share animals by design** — phonetic alignment means convergent choices. Accept and differentiate by context.
4. **System-markers help** — always include the signature element of each system (SEM3 sensory anchor, Georgian quadruple-alliteration, CAST edge flow) so scenes self-identify.
5. **If a scene can't self-identify which system is active, the scene is under-specified.** Fix by adding a system-marker, not by renaming imagery.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-collisions)**.

