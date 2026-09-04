---
palace: buffer
level: 3
domain: 10
room: 1
wiki_source: wiki/learning-systems/tier3-motoric-backlog.md
---

# Tier 3 Motoric Backlog

**Summary**: Backlog of candidate Tier 3 motoric / embodied mnemonic systems that have been evaluated and KEPT but deliberately not yet written up as full wiki pages. Each entry has a promotion trigger — write the full page only when a real domain becomes blocked by missing this method's bandwidth.

**Sources**:
- Design conversation, 2026-05-07
- [motoric-encoding-systems](./motoric-encoding-systems.md)
- [mnemonic-methods-master](./mnemonic-methods-master.md)
- [red-queen-knowledge-ladder](./red-queen-knowledge-ladder.md)

**Last updated**: 2026-05-07

---

## Purpose

The wiki already has 7 Tier 3 motoric entries: [bigram-tap-system](./bigram-tap-system.md), [finger-procedure-system](./finger-procedure-system.md), [palm-zone-category-system](./palm-zone-category-system.md), [bilateral-contrast-system](./bilateral-contrast-system.md), [finger-rhythm-code](./finger-rhythm-code.md), [hand-phonetic-system](./hand-phonetic-system.md), [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md).

A brainstorm produced 5 additional candidates that pass the framework-validation rules in `CLAUDE.md` (separation of concerns, composability, retrieval clarity, no framework drift). They are KEPT but NOT promoted to full wiki pages, because the discipline rule in [mnemonic-methods-master](./mnemonic-methods-master.md) says *don't reach for Tier 2 or Tier 3 until the Tier 1 spine is fluent*, and the [red-queen-knowledge-ladder](./red-queen-knowledge-ladder.md) explicitly warns against expanding the surface area without a domain that's actually blocked.

This file is the backlog. It exists so the analysis isn't re-done when one of these candidates becomes load-bearing.

---

## Promotion criteria

Promote a backlog entry to a full wiki page only when ALL of the following hold:

1. There is a concrete domain where existing Tier 3 methods are insufficient.
2. The user has tried the closest existing method first and observed the specific failure that this candidate addresses.
3. The candidate's promotion is logged as a Weekly Review decision, not an ad-hoc impulse.

Otherwise leave it here.

---

## Active backlog (5 candidates)

### 1. Body-Track Walk — portable mini-palace on the body

- **Mechanism**: 7 fixed loci top-down — head, shoulders, chest, belly, hips, knees, feet. Walk attention top-to-bottom in fixed order.
- **When**: no external [palace](./memory-palace-architecture-for-neural-os.md) accessible (in transit, eyes closed, meditation), or short ad-hoc lists ≤7 items.
- **Composability**: parallel to Memory Palace at the substrate layer; UMTF.spatial axis.
- **Promotion trigger**: a recurring domain where the user repeatedly needs a palace but no external locus list is available (e.g., daily meditation review, prayer cycle, in-flight rehearsal).

### 2. Tongue-Position System — silent phonetic encoder

- **Mechanism**: 8–9 discrete tongue positions inside the mouth (tip-on-front-teeth, tip-on-palate front/mid/back, tip-on-cheek L/R, flat, raised, retracted) → phoneme map.
- **When**: silent rehearsal *during* live conversation when hands are visible / busy. Especially powerful for foreign-language pronunciation work and IPA.
- **Composability**: extends [hand-phonetic-system](./hand-phonetic-system.md) into a covert channel (mouth vs hand). Both feed [NEDF](./nedf-overview.md) Name-hook spelling slot.
- **Promotion trigger**: active foreign-language work where Hand-Phonetic alone is insufficient because hands are constrained (in meetings, while driving, while taking notes).

### 3. Hand-Shape Code — categorical, not positional

- **Mechanism**: 5–7 discrete hand shapes (fist, open palm, pinch, point, peace, rock, OK-circle). ASL-handshape-inspired but with personal mapping.
- **When**: category routing when both hands need to be visible but [Palm-Zone](./palm-zone-category-system.md) is too fine (e.g., standing in a meeting, walking).
- **Composability**: orthogonal to [hand-to-letter-system](./hand-to-letter-system.md) (position) and [palm-zone-category-system](./palm-zone-category-system.md) (region). Adds a third hand axis. Maps to UMTF.pattern + UMTF.priority.
- **Promotion trigger**: any sustained domain (5+ sessions/week) where category routing is needed in postures that don't allow palm-zone touching.

### 4. Body-Quadrant Anchors — macro 2×2 grid on torso

- **Mechanism**: divide torso into UL / UR / LL / LR quadrants. Each quadrant = one category.
- **When**: walking, standing, when palm isn't free or visible. Bigger movements than [Palm-Zone](./palm-zone-category-system.md), more discoverable.
- **Composability**: same role as Palm-Zone but coarser scope and more visible. Use Palm-Zone for fine 5-slot routing, Body-Quadrant for coarse 4-slot routing when seated/walking.
- **Promotion trigger**: a domain where 4 macro categories carry more weight than 5+ fine ones AND palm isn't reliably accessible (e.g., walking commutes, standing meetings).

### 5. Air-Trace Glyph — finger-drawn letters in air or on table

- **Mechanism**: draw the *shape* of a letter / symbol with one finger (in air, on thigh, on table). Different from [hand-to-letter-system](./hand-to-letter-system.md) (touching) — this is *writing*.
- **When**: writers / mathematicians / language learners. Especially for kanji / Cyrillic / Hebrew / Georgian where the letter shape itself is the memory anchor.
- **Composability**: feeds [NEDF](./nedf-overview.md) Name-hook for written-language-heavy domains. Pairs with [trigonometry-compass-palace](./trigonometry-compass-palace.md) (both involve directional tracing). Could extend [georgian-animals](./georgian-animals.md) node identity for Georgian-script work.
- **Promotion trigger**: active study of a script-heavy language (Hebrew biblical study, Georgian script fluency, Chinese / Japanese kanji) where letter-shape itself is what's being learned.

---

## Keep-with-modification (integrate into existing pages, not standalone)

### Chest-Tap Time-Map

Tap left chest = past, center = now, right chest = future. Useful for temporal encoding.

**Modification**: scope as a worked example *under* [bilateral-contrast-system](./bilateral-contrast-system.md) — it's bilateral applied to time, not a new top-level system. Add as a section to that page when bilateral-contrast next gets a content pass.

### Touch-Pressure Code

Same finger, three pressures (light / medium / heavy) = three states. Adds intensity to existing [hand-to-letter-system](./hand-to-letter-system.md).

**Modification**: integrate as an *optional intensity slot* on Hand-Letter, not a standalone system. Avoids framework drift. Add as a section to hand-to-letter when needed.

---

## Rejected — do not re-propose

| Candidate | Why rejected |
|---|---|
| Breath / heartbeat sync as encoder | Conflicts with [pulse-overview](./pulse-overview.md) — breath is a state-monitoring signal, not an encoding channel. SRP violation. |
| Foot / step encoding | Overlaps [hand-to-number-system](./hand-to-number-system.md) domain; narrower band; loud / discoverable in social settings. |
| Walking-tempo code | Disrupted by terrain, fatigue, conversation; PULSE already varies it as state-output, not as encoder-input. |
| Jaw / lip posture | Too socially visible, can't be used covertly. |
| Shoulder tension asymmetry | Perceptual discrimination too poor for reliable encoding. |
| Pen-grip variations | Too narrow (writers only) and overlaps Hand-Shape Code. |
| Postural stance | Too gross / visible; conflicts with Body-Quadrant Anchors (which is finer and less obvious). |

---

## Related pages

- [motoric-encoding-systems](./motoric-encoding-systems.md) — parent page for all motoric Tier 3 entries
- [mnemonic-methods-master](./mnemonic-methods-master.md) — discipline rules, tier ranking
- [red-queen-knowledge-ladder](./red-queen-knowledge-ladder.md) — yak-shaving warning that motivates this backlog
- [missing-encoding-layers](./missing-encoding-layers.md) — original gap analysis


---

## U — See (CAST)
1. Backlog of Tier 3 motoric mnemonic systems
2. Evaluated, kept, but not yet written up

## D — Name (NEDF)
1. Tier 3 motoric backlog = candidate-systems backlog
2. Distinguisher: explicit promotion triggers per entry
3. Failure mode: promoting before trigger fires

## F — Do (SPEAR)
1. Domain blocked → check backlog for fit
2. Trigger fires → promote to full wiki page

## B — Watch (HEART)
1. Premature promotion
2. Forgetting to consult when blocked

## L — Predict (ORACLE)
1. Blockage type → predict backlog fit
2. Trigger → predict promotion ETA

## R — Act (GRACE)
1. New blockage → check backlog
2. Trigger met → promote