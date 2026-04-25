# Concept Encoding Protocol

For turning **definitions, ideas, mental models, and abstract concepts** into retrievable scenes.
This is the missing non-numeric backbone of the mnemonic stack.

**⚠️ Prerequisite:** Don't encode a concept you haven't fully understood.
See `comprehension-protocol.md` — all 5 gates must pass before NEDF encoding,
or the scene stores confusion instead of understanding. The Failure slot
below should come from Gate 4 (Falsify), and the Essence from Gate 2 (Represent).

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-concept-encoding) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The Core Principle

A concept is not a number. It has no natural 2-digit chunking. But it does have
**four load-bearing attributes** that every good concept-encoding must capture:

1. **Name-hook** — what the concept is *called*
2. **Essence** — what it *is* at its core (one image, not a sentence)
3. **Distinguisher** — what separates it from the concept next to it
4. **Failure mode** — where it breaks, what it is *not*

If you encode all four into one scene, the concept becomes retrievable from any
angle: hearing the name, encountering the behavior, or hitting the failure mode.

This is the **NEDF protocol**: Name · Essence · Distinguisher · Failure.

---

## The Four Slots

### Slot 1 — Name-hook (N)
The concept's name, encoded via its sound.

- Use Major System if the name contains a usable consonant sequence
- Otherwise, pick a **rhyme, pun, or homophone** (closure → closer; monad → nomad; backpressure → back-pressure-cooker)
- The name-hook is the *door* to the scene — it must fire the instant you hear the word

**Test:** Say the concept's name aloud. Does one image pop up? If yes, that's your hook.

### Slot 2 — Essence (E)
What the concept *does* or *is*, in one animate image.

- Must be a **verb-like image** — something happening, not static
- Must be the *core mechanism*, not an example
- If you can't picture it moving, it's not an essence yet

**Example:** Closure's essence is *a function carrying a backpack of captured variables*. Not "a closure captures scope" (that's a definition). The backpack is the essence — it's visual, it's carried, it's *about* containment.

### Slot 3 — Distinguisher (D)
The one feature that separates this concept from its nearest neighbor.

- Ask: "What is this concept *not*?" — the nearest-neighbor concept
- Encode the contrast as a visible difference in the scene
- Without this, you'll confuse sibling concepts (closure vs. callback, precision vs. accuracy, covariance vs. contravariance)

**Example:** Closure (captures variables by reference) vs. Callback (just a function passed around). Distinguisher: closure's backpack is *tied by a string* to the outer function — the variables live elsewhere and are referenced. A callback has no string; it's just a passed-along function.

### Slot 4 — Failure mode (F)
Where the concept breaks, or what people get wrong about it.

- Encode as a **small disaster** or **bizarre consequence** inside the scene
- This is what makes the scene memorable AND teaches you the concept's edge
- Anki cards can test the failure mode directly — great for problem-solving recall

**Example:** Closure's classic failure: the loop-variable bug (all closures in a for-loop share the same captured `i`). Failure image: the backpacks are all *tied to the same string*, so when one variable changes, every backpack jerks together.

---

## The Full Scene Template

```
[Name-hook image] IS [Essence action]
                  WITH [Distinguisher feature]
                  BUT [Failure consequence]
```

This becomes one continuous scene, not four separate facts.

---

## Worked Example 1 — "Closure" (programming)

| Slot | Content | Image |
|------|---------|-------|
| Name | "closer" (homophone) | A door-closer device |
| Essence | Function carrying captured variables | Door-closer wearing a backpack |
| Distinguisher | Captured by reference, not copy | Backpack tied by string to outer room |
| Failure | Shared-reference loop bug | String pulls all backpacks together when one moves |

**Full scene:** *A door-closer (a pneumatic arm on a door) is walking around wearing a backpack. The backpack is tied by a long elastic string back to the room it came from. When someone in that room moves a cup, the string yanks and every backpack in every other closer jerks at the same time.*

Anki card front: "closure"
Back: the scene — which you'll recall as the mechanism + the bug.

---

## Worked Example 2 — "Backpressure" (systems)

| Slot | Content | Image |
|------|---------|-------|
| Name | Back-pressure-cooker | A pressure cooker with its nozzle facing backward |
| Essence | Downstream signals upstream to slow down | Steam hissing backward into the producer |
| Distinguisher | vs. buffering (which silently absorbs) | No buffer tank — direct push-back |
| Failure | Producer ignores signal → system explodes | Cooker ruptures when producer keeps pushing |

**Full scene:** *A chef (producer) is cramming food into a pressure cooker. The cooker's nozzle points backward and hisses steam into the chef's face every time it's overfull. There's no buffer bucket beside it. If the chef keeps shoving food in, the cooker explodes and covers the kitchen in sauce.*

---

## Worked Example 3 — "Bayes' theorem" (math/reasoning)

| Slot | Content | Image |
|------|---------|-------|
| Name | "Baize" (green card-table felt) | A green felt card table |
| Essence | Updating belief with evidence | Dealer flipping cards, moving chips between two piles labeled H and ¬H |
| Distinguisher | vs. frequentist (fixed probability) | The chips *move* — probabilities aren't fixed |
| Failure | Ignoring base rate → base-rate neglect | Dealer forgets to check the big pile before betting; goes bust |

**Full scene:** *On a green baize table, a dealer flips evidence cards. Each card makes chips slide between two piles (H and ¬H). The dealer who ignores the starting size of the piles always goes bust — the table is littered with base-rate-neglect corpses.*

---

## Worked Example 4 — "Covariance vs. Contravariance" (types)

Sibling concepts → encode them together as a contrastive pair.

| Concept | Name-hook | Essence | Distinguisher | Failure |
|---------|-----------|---------|---------------|---------|
| Covariance | "Co-vary" (co-worker) | Two workers moving the same direction | Subtype relation preserved | Mutable container breaks it |
| Contravariance | "Contra" (opposing soldier) | Two soldiers facing opposite ways | Subtype relation reversed | Using it for inputs is the gotcha |

**Scene:** *Two co-workers on a conveyor belt drift the same direction (covariance). Next to them, two soldiers point rifles at each other (contravariance). The co-workers can only carry read-only boxes — if the box is mutable, they drop it and it shatters. The soldiers are the rule for function arguments — reverse the direction or you get shot.*

---

## How to Apply This

### Step-by-step encoding procedure

1. **Write the concept name.** Read the definition twice.
2. **Fill the NEDF table** — four rows, one per slot. Force yourself to complete all four before imagining anything.
3. **Pick a name-hook** — 30 seconds. If nothing comes, use a rhyme.
4. **Distill the essence to one action** — what is happening? (Not what it is — what it *does*.)
5. **Find the nearest neighbor** — what concept do people confuse this with? That's your distinguisher.
6. **Find the classic failure** — Google "[concept] common mistake" if you don't know it yet. This is *crucial* for problem-solving, not just memorization.
7. **Weave the four into one scene.** Must be one continuous visual, not four fragments.
8. **Place in a domain palace locus.** (See palace guidance below.)
9. **Anki card:** Front = concept name. Back = the scene + the four slots written out.

### Time budget
- With practice, 2–4 minutes per concept.
- First 20 encodings will be slower (5–8 min). After that you'll have muscle memory for the NEDF pattern.

---

## Integration with Existing Systems

- **Major System / PAO:** Use for the name-hook when the concept's name has clear consonants (e.g., "monad" → M-N-D could feed into Major imagery).
- **SEM3:** If a concept has a natural sensory anchor (a smell, a sound, a texture), use SEM3 to charge the essence image. Great for bio/chem/medical concepts.
- **CAST:** When a concept *is* a relationship (e.g., "inheritance," "composition," "dependency injection"), encode it as a CAST edge instead. NEDF is for things; CAST is for relations.
- **Mind Palace:** Group concepts by domain into palaces. NEDF scenes are the *content*; the palace is the *address book*.

**Decision rule:** If the concept names a *thing* → NEDF. If it names a *relationship* → CAST. If it names a *procedure* → PAO-style mini-story (Person + Action + Object per step).

---

## Anki Card Formats (recommended)

### Format A — Concept front, scene back
- Front: `{concept name}`
- Back: NEDF table + full scene

### Format B — Cloze deletions (best for retrieval)
Front: *A door-closer walks around wearing a {{c1::backpack tied by string to the outer room}}, and when someone moves a cup there, {{c2::every other closer's backpack jerks}}.*

One card per slot = 4 cards per concept = tests each slot independently.

### Format C — Failure-mode prompt (problem-solving)
- Front: "You see a bug where all closures in a loop share the same variable. What concept?"
- Back: Closure + the loop-variable failure mode

Format C is the highest-leverage for problem-solving speed — it trains you to recognize the concept *from the symptom*, which is how real debugging works.

---

## Key Principles

1. **All four slots, always.** Skipping failure mode is the #1 mistake — it's what makes scenes sticky.
2. **One scene, not four.** If you can't weave the slots together, the concept isn't fully understood yet.
3. **Nearest-neighbor contrast is mandatory** for any concept that has a confusing sibling. Encode them as a pair, not separately.
4. **Name-hook must be instant.** If you have to think for 3+ seconds to decode the name, the hook is bad — redo it.
5. **Essence must move.** Static images don't encode *what a concept does*.
6. **Anki the failure mode separately** — it's the single highest-yield card per concept.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-nedf)**.

