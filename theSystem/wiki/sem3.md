---
glyph: 📡
palace: meta-knowledge
level: 4
domain: 10
room: 3
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/sem3.md
---

# SEM3

**Summary**: The sensory-prefix encoder for 4-digit chunks — the first two digits pick *how the scene is experienced* (`CI`, a sensory category × item), the last two supply the concrete prop as a Major image (`XX`). Its non-obvious property, and the reason this page exists, is that **the 100 prefix items are generated rather than stored**: the item digit `I` is recoverable from the item word's own first Major consonant, so decoding is deterministic and encoding is self-checking. Sibling to [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — both multiply two 10-item indices into 100 single percepts — and distinguished from it by *what the two axes do*: the matrix's axes are two co-equal pegs, SEM3's are a modifier and a prop.

**Sources**:
- `raw/Neural OS Book/SEM3.md` — the spec this page abstracts; supplies the `CI` + `XX` format, the ten category labels, the `2743` worked example, and the SEM3-vs-PAO routing rule
- `/home/david/code/memory-palace-lab/theSystem/sem3-full.md` §Phonetic Alignment with Major System — the canonical 100-item table and the derivation rule; a sibling repo, deliberately not vendored here (see §The table is not the content)
- `Clippings/36 Best Memory Techniques for Studying.md` — external provenance: the Art of Memory "SEM Cubed" technique, 10×10 cells × 100 Major images = 10,000 pegs
- `/home/david/code/memory-palace-lab/theSystem/memorization-helpers.md#mh-sem3-full` — the existing [NEDF](./nedf-overview.md) card and first-session drill for installing SEM3
- Anki decks `001 Memory::015 Beyond 100 (SEM3)` (99 cards) and `001 Memory::017 SEM3 + Major` (100 cards) — read live 2026-09-03; the lapse distribution in §Why the drill was backwards is measured from their review logs

**Last updated**: 2026-09-03 — §Prefixing to six digits added: `CIXX` can be prefixed with a [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) percept (`PP·CI·XX`) to carry six digits at one locus at PAO density; `676767` is the repeated-pair corollary at full stretch, all three alphabets stating `67`. §The pair checksum gains its repeated-pair corollary: when a chunk repeats its pair (`CICI`), the Major peg is the cell's own checksum word, so the object spells the actor's address (`6767` = Kangaroo + Check). §Installing the ten and §The pair checksum added after the first install session. The ten categories are now bound to the rhyme peg set rather than learned as a list (David's call, and the better one — ordered recall arrived free, which the list version had failed); the pair checksum is a finding from that session, verified 80/80 against the merged deck. Earlier same day — page created. SEM3 had been referenced across eleven pages with no owner behind it, and the one fact that makes it cheap to learn — the phonetic derivation rule — existed only in a sibling repo. Registers the rule, the two ordinal exceptions, and the `00` fill.

---

## What SEM3 is — a modifier on a prop, not two props

A 4-digit chunk splits as `CI` + `XX`. The suffix `XX` is an ordinary Major image: the concrete object everything else attaches to. The prefix `CI` is **not** a second object — it is the sensory register the whole scene arrives in.

`2743` → `27` = category 2 (Smell), item 7 (Coffee) + Major `43` (Ram) → *a ram charging through a coffee shop, coffee smell everywhere* (source: raw/Neural OS Book/SEM3.md).

The ram is the thing. The coffee is the air it moves through. Getting this backwards — staging two objects that meet — is the characteristic encoding failure, because two props compete for the same slot and the scene loses its subject. The prefix modifies; the suffix carries. This is why the system reduces collisions: two chunks sharing a Major suffix stay distinct because they are *sensed* differently, and sensory channels are orthogonal to object identity under [UMTF](./universal-mental-tagging-framework.md).

## The address is two multiplied indices

`CI` = category digit `C` (0–9) × 10 + item digit `I` (0–9), giving 100 cells. This is the same construction [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) uses — two 10-item indices multiplied into 100 percepts at zero new-vocabulary cost — and by the three-part test on [peg-system](./peg-system.md) the prefix grid qualifies as a peg set in its own right: a fixed index (`00`–`99`), a frozen item per slot, and a binding rule (the item modifies the Major prop rather than standing beside it).

The ten categories, which are the only genuinely arbitrary payload in the whole system:

| C | Category | | C | Category |
|---|---|---|---|---|
| 0 | Vision | | 5 | Sensation |
| 1 | Sound | | 6 | Animals |
| 2 | Smell | | 7 | Birds |
| 3 | Taste | | 8 | Rainbow (colours) |
| 4 | Touch | | 9 | Solar system |

They chunk 6 + 2 + 2: **six sensory channels** (0–5), **two creature sets** (6–7), **two cosmic ladders** (8–9). Ten labels, three groups — that is the install.

## Installing the ten — bind to a frozen index, do not memorize a list

The ten labels are the whole arbitrary payload, and the cheapest way to install them is not to learn them as a list at all. Hang them on the **rhyme peg set** already drilled to reflex for the tens digit — the one [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) owns and the `peg audio` deck carries.

The fit is structural rather than convenient: **`C` is the tens digit of `CI`, and the rhyme peg is the tens peg.** Same slot. Nothing is being repurposed.

| C | peg | category | binding scene |
|---|---|---|---|
| 0 | Hero | 👁 Vision | a hero firing lasers from his eyes |
| 1 | Sun | 👂 Sound | the sun's rays arrive as sound waves, the sky humming |
| 2 | Shoe | 👃 Smell | a stinking sneaker, green fumes rolling off it |
| 3 | Tree | 👅 Taste | biting fruit straight off the branch |
| 4 | Door | ✋ Touch | pitch dark, both hands feeling over a door for the handle |
| 5 | Hive | 🫀 Sensation | a hive pressed to the chest, the buzz felt *under* the skin |
| 6 | Sticks | 🦓 Animals | a dog launching after a thrown stick |
| 7 | Heaven | 🦅 Birds | birds wheeling through the clouds of heaven |
| 8 | Gate | 🌈 Rainbow | the gate *is* a rainbow arch |
| 9 | Vine | 🪐 Solar system | planets hanging off the vine like grapes |

The peg column is a **pointer, not a definition** — [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) owns those images and this page must not restate them. What is owned here is the binding: the scene in the fourth column, frozen 2026-09-03, and subject to the same no-relabelling rule as any peg image.

Four bindings are nearly free because the peg and the category already mean the same thing — `2` (a shoe *is* a smell), `7` (heaven is sky, sky is birds), `8` (a rainbow is an arch, an arch is a gate), `9` (a vine bears round bodies). The four that need a real scene are `1`, `4`, `5`, `6`.

**Why bind rather than memorize.** Installed as a bare list, the ten give random access but not order — the failure is reciting the block of six, and the item that drops is Sensation, the one absent from the childhood five-senses list. Installed on the rhyme pegs, order arrives free, because the rhyme sequence already carries it. This is [peg-system](./peg-system.md)'s own principle turned on SEM3's last un-pegged layer: bind to a frozen index instead of building a new one.


## The derivation rule — the item digit is its own Major consonant

Every item word in categories 0–7 begins with the Major consonant of its own item digit. The rule is stated at `sem3-full.md:137`: *"The items are phonetically tuned to Major consonants. The second digit (I) of the SEM3 key matches the Major consonant for that digit… This double-encoding means you can recover the digits from either the sensory category OR the Major consonant."*

The mapping is the standard one owned by [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — 0 S/Z · 1 T/D · 2 N · 3 M · 4 R · 5 L · 6 CH/J/SH · 7 K/G · 8 F/V · 9 P/B — applied to the word's **first consonant sound only**. One category read across shows it:

| I | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Smell** | **S**eaweed | **T**ar | **N**utmeg | **M**int | **R**ose | **L**eather | **Ch**eese | **C**offee | **F**orest | **B**read |
| **Animals** | **Z**ebra | **D**eer | **N**ewt | **M**onkey | **R**hino | e**l**ephant | **G**iraffe | **K**angaroo | **F**ox | **B**ear |

It holds for **all 80 cells across the eight phonetic categories** — Vision, Sound, Smell, Taste, Touch, Sensation, Animals, Birds — including the cases that look like exceptions and are not: *elephant* (vowel is filler, first consonant sound L = 5), *Rhubarb* (silent h, R = 4), *Shh* (SH = 6), *Nighteagle* (first consonant N = 2, the rest of the word is not scanned), and *Giraffe* (**soft** g = dʒ = 6, against *Gong* and *Grass* where hard g = 7 — the soft/hard split is the one place a careless check misreads the rule as broken).

This was verified mechanically against the live deck rather than by eye: a first-consonant decoder run over all 100 cells returns 80/80 in categories 0–7 and correctly declines the 20 ordinal cells. The eightieth is `00` itself — Snow was chosen to fill the hole and satisfies S = 0, so the fill is rule-consistent rather than merely plausible.

**What the rule does and does not buy.** It fixes the first consonant, not the word, so the two directions are not symmetric:

- **Decoding is deterministic.** Given the item — Rose, in the smell register — the digits fall out with no recall at all: category 2, R = 4, therefore `24`. There is nothing to remember.
- **Encoding is narrowed and self-checking.** Given `24` you still choose *which* R-word smells; the rule cuts the field to R-words in one sensory channel and then verifies the answer. If a recalled item's first consonant does not match the digit, the decode was wrong — the error is caught at the point it is made rather than downstream in a wrong number.

This is why the honest description is *generated, not stored*, with the qualifier that generation runs clean in one direction and as error-correction in the other.

## The two exceptions — 8 and 9 are ordinal

Categories 8 and 9 break the phonetic rule completely, and knowing *that* is the whole of learning them:

- **8 Rainbow** — Red, Orange, Yellow, Green, Blue, Indigo, Violet, then Black, Gray, White. ROYGBIV in spectral order plus three achromatics.
- **9 Solar system** — Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto. Ordered outward by distance.

Both are sequences already known cold from outside the system, so twenty cells cost nothing — provided the exception itself is installed, because reaching for the consonant rule in category 8 produces confident wrong answers (Red would decode to 4, not 0). The exception is the memory item; the twenty cells are free.

`9000` Sun happens to satisfy S = 0 as well. Coincidence, not structure — do not generalise from it.

## The pair checksum — one digit in two alphabets

A prefix has two independent spellings, and they overlap. The **Major word** for `CI` encodes `C` then `I` as its consonants; the **SEM3 item** encodes `I` as its first consonant. So both name the item digit:

```
  27   Coffee   K = 7        Nag     N=2  G=7        both say 7
  43   Mud      M = 3        Ram     R=4  M=3        both say 3
  61   Deer     D = 1        Sheet  Sh=6  T=1        both say 1
```

Checked against the `017 SEM3 + Major` deck: **80/80 in categories 0–7**. Every Major word in the deck agrees with its SEM3 item on the item digit.

One subtlety the check surfaced. In **category 0** the leading zero is not voiced, so the Major word carries a *single* consonant rather than two — `04` is *Ra*, not a two-consonant word. The agreement still holds; it is simply the word's only consonant instead of its second. Stating the rule as "the second consonant" is therefore wrong at the top row. The correct form: **the consonant that encodes the item digit is the one that matches**, wherever it falls.

It breaks in exactly the same twenty cells the derivation rule does. In categories 8 and 9 the item is positional, so there is no consonant to agree with — Red and *Face* share nothing.

**Why the redundancy earns its cost.** [multi-attribute-encoding](./multi-attribute-encoding.md) sets the bar for a duplicate channel: it pays only if it can *disagree*. This one can. If the item and the Major word give different digits, one of them is misremembered, and the pair has caught it before the number leaves your head. That is the job the merged deck exists to do — it is not two facts on one card, it is one digit stated twice in different alphabets.

**A corollary — a repeated pair spells its own address.** When a four-digit chunk repeats its pair — `CICI`, the Major suffix equal to the prefix — the peg you draw *is* the checksum word. Normally `Major(CI)` is a check you run in your head against the item; here it walks onto the scene as the object. `6767` is a Kangaroo (cell `67`) at a **Check** — and *Check* spells `Ch·K = 6·7`, the cell's own address. `4343` is Mud under a **Ram**, and *Ram* spells `R·M = 4·3`. The object names the actor's cell, so a repeated-pair chunk is the most error-proof class in the system: the prefix is recoverable from the actor alone — its category and its item consonant — and again from the peg alone — its two consonants — and the two must agree. It inherits the checksum's domain: in categories 8 and 9 the peg still spells the prefix, but the ordinal item has no consonant to agree with, so the second recovery is gone.


## Prefixing to six digits — stack the audio×visual matrix

SEM3 addresses four digits. To carry six in one scene, prefix `CIXX` with a percept from the [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — its sibling construction, which crosses the rhyme peg (tens) over the visual peg (units) into one multimodal cell. [peg-system](./peg-system.md) registers the two as the same shape — both multiply two ten-indices into a hundred percepts — so they stack without friction, and stacking them is a rung up the [number-codec-ladder](./number-codec-ladder.md): four digits per locus become six.

```
  PP   audio × visual   rhyme-peg[tens] fused with visual-peg[units]   2 digits
  CI   SEM3 sensory     the category tints it, the item is I           2 digits
  XX   Major            the carried prop                               2 digits
```

The percept leads — it is the loudest thing in the scene, a sound and a shape the brain fuses into one object — and the SEM3 pair follows as the sensory-tinted prop it acts on. Six digits at one locus, the density of [PAO](./person-action-object-system.md), but assembled from three peg alphabets already drilled to reflex rather than a fourth learned vocabulary. Whether to reach for this, for PAO, or for the deep pack on a given number is a routing call the [number-codec-ladder](./number-codec-ladder.md) owns; this page only records that the prefix slot exists.

**676767 — the corollary at full stretch.** The number where every pair repeats sends all three alphabets to the same cell, `67`:

| slot | alphabet | image | says |
|---|---|---|---|
| `PP` 67 | audio × visual | an **Axe** (visual 7) splitting a bundle of **Sticks** (rhyme 6) | 6 · 7 |
| `CI` 67 | SEM3 sensory | a **Kangaroo** — Animals (6), item K (7) | 6 · 7 |
| `XX` 67 | Major | a **Check** — Ch (6), K (7) | 6 · 7 |

One scene — *a kangaroo splitting a bundle of sticks with an axe, a giant check stamped over it* — and every element independently spells `67`. The pair checksum states one digit in two alphabets; the repeated-pair corollary raised that to the whole pair in two; `676767` raises it to the pair in **three**. Lose any two of the images and the third rebuilds all six digits — the most over-determined number the stack can hold.

## Why the drill was backwards

Deck `015 Beyond 100 (SEM3)` accumulated 75 lapses over 734 reviews. Its ten weakest cells by lapse count, read live from the collection on 2026-09-03:

`Mint` (M=3) · `Nuts` (N=2) · `Forest` (F=8) · `Kangaroo` (K=7) · `Fox` (F=8) · `Duck` (D=1) · `Kingfisher` (K=7) · `Rose` (R=4) · `Shaking` (SH=6) · `Robin` (R=4)

**Every one is rule-derivable.** The lapses are the cost of rote-storing a table that regenerates itself — the exact failure [table-memorization](./table-memorization.md) Step 0 exists to prevent: *shrink the table before encoding anything*. A hundred cells were being drilled at uniform cost when ten labels, one rule and two exceptions cover the set.

The operative sequence, therefore, is **rule-first, not cell-first**: install the ten categories, the consonant rule, and the two exceptions before touching the card pile. Re-running a cold backlog without the rule installed simply rebuys the same lapses on the same cells. Cadence for the residue that genuinely is arbitrary is the Siege half of [storm-and-siege-protocol](./storm-and-siege-protocol.md) — this is a relearn, not an install, so the Storm ramp does not apply.

The falsifier is sharp and worth keeping: after the rule is installed, those ten cells should be among the *easiest* in the deck. If they still lapse, the rule is not carrying the load and this page is wrong.

## Frozen conventions

Per [peg-system](./peg-system.md) part 2, an item is chosen once and then not relabelled — the whole value of the index is that it never moves. Three conventions are load-bearing:

- **`00` = Vision · Snow.** The source table began at `0100`, leaving Vision-0 undefined and the grid one cell short of its own count-shape; the sibling deck carried the hole as a literal `—`. Snow fills it under the rule (S = 0). **It must be rendered visually — a white snowfield, snow seen falling — never as cold**, because cold is Touch (category 4) and a sensory item that bleeds into a neighbouring category defeats the point of a sensory index.
- **The prefix is atmosphere, the suffix is the object.** Stated above; restated here because it is the convention most likely to erode under time pressure.
- **First consonant only.** The rule reads the item's opening consonant sound and stops. Scanning the whole word for Major digits is a different operation — that is ordinary Major encoding, and confusing the two produces four digits where two belong.

## The table is not the content

This page deliberately does not inline the 100 items. [calendar-memory](./calendar-memory.md) already fixed that rule for SEM3 consumers — *never inline SEM3 prefix tables; always link to the deck* — and this page inherits it for a sharper reason: **the table is derivable output, and the rule is the source.** A page that reprints 100 cells invites them to be memorised as 100 cells, which is the defect §Why the drill was backwards documents. The canonical table lives at `memory-palace-lab/theSystem/sem3-full.md`; the two Anki decks are the drill surface; this page owns the rule that generates them.

## When SEM3 is the wrong tool

- **Three-digit chunks** — [PAO](./person-action-object-system.md) is denser, because a triple wants to be one actor beat rather than a modifier plus a prop (source: raw/Neural OS Book/SEM3.md).
- **The Major suffix is not yet fluent.** SEM3 is a prefix *on* a Major image. Without a drilled `XX`, every encode stalls on the half that carries the scene, and the prefix has nothing to modify.
- **Non-numeric material** — the sensory categories are an addressing scheme for digits, not a general tagging vocabulary; that job belongs to [UMTF](./universal-mental-tagging-framework.md).

## Mnemonic

*The radio and the object on the table.* The object is whatever the Major suffix says — a ram, a saw, a nag. It sits there, solid, and it is the only thing in the room you could pick up. The radio has ten stations and you never touch the object to change them: station 2 fills the room with smell, station 7 fills it with birdsong, station 9 puts planets in the window. Tuning the radio does not add a second object; it changes the air the first one stands in. And every station's dial position is written on the station itself — turn to the R-marked slot in the smell band and what comes through is a rose, because that is what R smells like. Two bands only, 8 and 9, are painted rather than lettered: you read those off the spectrum and the sky, not off the dial.

## Memory checksum

Recall is correct if all six close:

1. **Prefix modifies, suffix carries.** If the scene has two objects meeting, the encode is wrong — `CI` is the register, `XX` is the thing.
2. **The item digit is its own first consonant** — in eight of the ten categories, for all 80 cells. If a recalled item's opening consonant does not match the digit, the decode failed; that mismatch is the error signal, not a coincidence.
3. **Two categories are ordinal, and they are 8 and 9.** Reaching for the phonetic rule in Rainbow or Solar System yields confident wrong answers. Naming the exceptions is the item; the twenty cells are free.
4. **The grid is complete at 100.** Ten categories × ten items, `00` = Vision · Snow. A missing cell is a broken checksum, not a rounding detail — the hole at `00` went unnoticed for the life of two decks.
5. **Direction is asymmetric.** Decode is deterministic; encode is narrowed and verified. Claiming both are free overstates the rule and hides the residue that still needs drilling.
6. **The pair agrees on the item digit.** The Major word for a prefix and its SEM3 item both encode `I`. A disagreement is not noise — it means one of the two is wrong, and the pair has caught it. Like the rule itself, this covers 80 cells and is silent in the ordinal twenty.

## Visual

Ten categories exceed the count-shape ceiling, so per [representation-rules](./representation-rules.md) Rule 10 the top level is drawn as an **ordered ladder, not a decagon** — the rule's own instruction above n=7. The ladder's internal grouping is where the shapes live: rungs 0–5 bracket as a **hexagon** (six sensory channels), 6–7 as an **axis** (two creature sets), 8–9 as a second **axis** (two cosmic ladders), so the 6+2+2 chunking is legible as geometry before any label is read.

The derivation rule is drawn as the one thing it is: a **letter printed on the rung itself**. Each item cell carries its opening consonant in the corner, and the digit column carries the same letter — so a correct cell is one where two marks agree, and an error is a visible mismatch rather than a fact you have to know. Categories 8 and 9 are drawn with those corners **empty and hatched**, which is the exception rendered as absence: the eye finds the two ordinal bands without reading a caption.

The scene relation stays a single figure — one solid prop, one wash of sensory colour over the whole frame, never two objects side by side. Two drawn objects would encode the failure mode as if it were the method.

## Measurement

This page mints **no new [METER](./meter-overview.md) namespace**, per the closed-spine rule [peg-system](./peg-system.md) §Measurement states for peg sets: a set is measured through the instance that owns it. SEM3's instrumentation is the two existing Anki decks, whose review events already reach METER through `tools/meter-anki-addon`. The metric that matters is not review count but the falsifier in §Why the drill was backwards — whether the ten rule-derivable high-lapse cells drop out of the lapse leaderboard once the rule is installed. Stage numbering for any drill built on this page cites [skill-progression-stages](./skill-progression-stages.md); no ladder is defined here.

## Related pages

- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the sibling 10×10 multiplied index; same construction, co-equal axes instead of modifier-and-prop
- [multi-attribute-encoding](./multi-attribute-encoding.md) — owner of the rule that a redundant channel earns its cost only if it can disagree, which is what makes the pair a checksum rather than repetition
- [peg-system](./peg-system.md) — the trunk this prefix grid instantiates; owner of the three-part test and the freezing rule
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — owner of the digit↔consonant mapping the derivation rule runs on, and the encoder that supplies `XX`
- [calendar-memory](./calendar-memory.md) — the main consumer; a year is a 4-digit chunk and goes through SEM3 unchanged
- [table-memorization](./table-memorization.md) — Step 0 (*shrink the table before encoding*) is the principle this page applies to its own 100 cells
- [PAO](./person-action-object-system.md) — the three-digit alternative; the routing rule between them lives in the source spec
- [storm-and-siege-protocol](./storm-and-siege-protocol.md) — Siege cadence for the residue that is genuinely arbitrary
- [nedf-overview](./nedf-overview.md) — the concept-encoder used by the existing SEM3 install helper
- [remaps](./remaps.md) — the transformation moves that bind an item into its scene
- [representation-rules](./representation-rules.md) — owner of the count-shape rule the §Visual follows, and of the one-concept-one-glyph rule this page's 📡 answers to
- [skill-progression-stages](./skill-progression-stages.md) — owner of the stage counts any SEM3 drill ladder must cite
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) — why a sensory prefix stays orthogonal to object identity
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — the builder for the production-shaped drill deck
