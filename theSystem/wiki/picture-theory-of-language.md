---
palace: meta-knowledge
level: 9
domain: 10
room: 17
wiki_source: wiki/logic/picture-theory-of-language.md
---

# Picture Theory of Language

**Summary**: Wittgenstein's [TLP](./tractatus-logico-philosophicus.md) central technical claim (propositions 2.1 – 4.06): *a proposition is a logical picture of a fact; what makes the picture able to represent the fact is the logical form they share*. **The philosophical antecedent of the wiki's entire encoder paradigm** — [NEDF](./nedf-overview.md) / [CAST](./cast-overview.md) / [SPEAR](./spear-overview.md) / [HEART](./heart-overview.md) / [ORACLE](./oracle-overview.md) / [GRACE](./grace-overview.md) are all picture theory operationalized as memory-craft moves. Confirmed unlock in [composability-index](./composability-index.md) (TLP picture-theory × NEDF encoder paradigm).

**Sources**:
- [Wittgenstein TLP](./tractatus-logico-philosophicus.md) (1921 German / 1922 English with Russell's introduction), propositions 2.1 – 4.06.
- Bertrand Russell, *Introduction to the Tractatus Logico-Philosophicus* (1922) — the standard scholarly entry-point.
- Klement side-by-side German + Ogden + Pears/McGuinness edition v0.69 (Sept 2025).

**Last updated**: 2026-05-25

---

## One-line

> *We make to ourselves pictures of facts.* — TLP 2.1

A proposition shares the *logical form* of the fact it represents. The shared form is what makes representation possible — and is itself something that can only be *shown*, not *said* (cross-link: [show-vs-say](./show-vs-say.md)).

## Unlocks (lead, not footer)

1. **The wiki's encoder paradigm IS operationalized picture theory.** Every encoder (NEDF, CAST, SPEAR, HEART, ORACLE, GRACE) instructs you to *build a vivid scene whose structure shares the logical form of the concept*. NEDF's *one vivid scene retrievable from four angles* literally instantiates TLP 2.13 (*to the objects correspond in the picture the elements of the picture*). The wiki has been doing TLP picture-theory for months without naming the root. **Confirmed unlock**.

2. **Logical form, not surface form, carries the work.** Two encodings of the same concept that differ in surface (palette · which loci in which palace · which animal · which verb) but agree in *logical form* (same number and kind of elements, same structural relations, same failure-point) are *equally good* picture-theoretically. Two encodings that match on surface but differ in logical form (e.g. one collapses a 3-element relation into a 2-element one) are *not equivalent*. The wiki's [REMAPS](./remaps.md) transformation moves preserve logical form while varying surface — that's why they work.

3. **The form cannot itself be put into words.** TLP 2.172: *The picture, however, cannot represent its form of representation; it shows it forth.* This is the bridge to [show-vs-say](./show-vs-say.md) — the *visual-per-concept* rule is the operational consequence. You can build a picture; you cannot write a proposition that asserts the picture's logical form, because such a proposition would itself have a form that would require another picture to assert, ad infinitum.

4. **Truth-functions are pictures too.** TLP 4.31 (the first published truth-table) is the picture theory applied to compound propositions: the truth-table *shows* the logical form of how the truth-value of *p ∧ q* depends on *p* and *q*. The truth-table is itself a picture in TLP's strict sense.

## Mnemonic

**O-E-F-S** = *Objects · Elements · Form · Show.*

The four atomic claims of picture theory in order:
- **O** *bjects* of the world → correspond to
- **E** *lements* of the picture → which are arranged in the
- **F** *orm* (logical form) of the fact → which the picture can only
- **S** *how*, not say.

Read it as *Objects-Elements-Form-Show* and you have the whole spine.

## Memory checksum

If you can answer these in <60 s each from memory, the page is encoded:

1. **State TLP 2.1.** (*We make to ourselves pictures of facts.*)
2. **State the correspondence claim** (TLP 2.13). (To the objects in reality correspond the elements of the picture.)
3. **What is the "form of representation"?** (What the picture and the fact must have in common in order for the picture to represent the fact — i.e., the logical form.)
4. **Why can a picture not represent its own form?** (Because doing so would require a meta-picture whose form would itself require a meta-meta-picture, ad infinitum. The form can be *shown* by the picture having that form; it cannot be *said* by the picture.)
5. **How does the wiki's NEDF encoder instantiate picture theory?** (NEDF's one-vivid-scene-retrievable-from-four-angles structure mirrors picture theory: the concept's *objects* (key entities) correspond to the scene's *elements*; the scene's *form* (arrangement, relations) shares the *logical form* of the concept; the scene *shows* what cannot be reduced to a textual list of properties.)

## Visual — the picture-theory glyph

```p5 height=320
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||640, 640), 320); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const bg = p.isDark ? 30 : 245;
  const green = '#5c7a54';
  const blue = '#7d8aa0';
  p.background(bg);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);

  p.noStroke(); p.fill(ink);
  p.text('WORLD', p.width*0.27, 20);
  p.text('LANGUAGE', p.width*0.73, 20);

  p.stroke(ink); p.strokeWeight(2); p.noFill();
  p.rect(p.width*0.08, 40, p.width*0.38, 140);
  p.rect(p.width*0.54, 40, p.width*0.38, 140);

  p.noStroke(); p.fill(ink); p.textSize(13);
  p.text('FACT', p.width*0.27, 60);
  p.text('PROPOSITION', p.width*0.73, 60);

  const fx = p.width*0.20, fy = 100;
  const fx2 = p.width*0.34, fy2 = 100;
  const fx3 = p.width*0.27, fy3 = 140;
  p.stroke(green); p.strokeWeight(2);
  p.line(fx, fy, fx2, fy2);
  p.line(fx, fy, fx3, fy3);
  p.line(fx2, fy2, fx3, fy3);
  p.noStroke(); p.fill(green);
  p.ellipse(fx, fy, 12, 12);
  p.ellipse(fx2, fy2, 12, 12);
  p.ellipse(fx3, fy3, 12, 12);

  const dx = p.width*0.66, dy = 100;
  const dx2 = p.width*0.80, dy2 = 100;
  const dx3 = p.width*0.73, dy3 = 140;
  p.stroke(blue); p.strokeWeight(2);
  p.line(dx, dy, dx2, dy2);
  p.line(dx, dy, dx3, dy3);
  p.line(dx2, dy2, dx3, dy3);
  p.noStroke(); p.fill(blue);
  p.quad(dx, dy-7, dx+7, dy, dx, dy+7, dx-7, dy);
  p.quad(dx2, dy2-7, dx2+7, dy2, dx2, dy2+7, dx2-7, dy2);
  p.quad(dx3, dy3-7, dx3+7, dy3, dx3, dy3+7, dx3-7, dy3);

  p.stroke(ink); p.strokeWeight(1.5);
  p.line(p.width*0.46, 100, p.width*0.54, 100);
  p.noStroke(); p.fill(ink); p.textSize(11);
  p.text('pictures', p.width*0.5, 88);

  p.textSize(12);
  p.text('objects arranged in\nlogical form', p.width*0.27, 200);
  p.text('elements arranged in\nSAME logical form', p.width*0.73, 200);

  p.textSize(13);
  p.text('The form is what is SHARED.', p.width*0.5, 250);
  p.text('The form is what is SHOWN, not said.', p.width*0.5, 270);
  p.text('(The form, drawn separately, would itself need a picture.)', p.width*0.5, 292);
};
```

The two boxes share *form*; they differ in *substance* (the world has objects, the picture has signs / sounds / scenes). The arrow between them is the *picturing* relation, which holds *because* the forms match.

---

## The propositions, in order

### TLP 2.1 — *We make to ourselves pictures of facts.*

The first move. The mind doesn't have direct access to facts; it has access to *pictures* of facts. The picture is itself a fact (TLP 2.141 — *the picture is a fact*) but it represents *another* fact by sharing its form.

### TLP 2.12 — *The picture is a model of reality.*

A model in the engineering sense: a structure whose parts and arrangements correspond to the parts and arrangements of the thing modeled. Not a *copy*; a *model*. A map is a model of terrain; a schematic is a model of a circuit; a NEDF card is a model of a concept.

### TLP 2.13 — *To the objects correspond in the picture the elements of the picture.*

The fundamental correspondence claim. Every object in the fact has a corresponding element in the picture. The picture has at least one element for every object; it doesn't have to use the same kind of substance (the picture's elements can be marks on paper, sounds, mental images, beads on an abacus, electrical states, scenes in a memory palace), but the *count* and *kind* of relations must match.

### TLP 2.14 — *The picture consists in the fact that its elements are combined with one another in a definite way.*

The picture isn't just a *list* of elements — it's a *structured arrangement* of them. The arrangement is what makes the picture a picture rather than a heap.

### TLP 2.15 — *That the elements of the picture are combined with one another in a definite way represents that the things are so combined with one another. This connection of the elements of the picture is called its structure, and the possibility of this structure is called the form of representation of the picture.*

The picture's *structure* = how its elements are actually arranged.
The picture's *form of representation* = the *possibility* of that structure — what kinds of arrangements are allowed.

The fact's *structure* and *form* are analogous. The picture and the fact must share *form*; they happen to share *structure* when the picture is true.

### TLP 2.161 — *In the picture and the pictured there must be something identical in order that the one can be a picture of the other at all.*

The non-trivial claim: there must be *something identical* between them. That something is the form. Without the shared form, the picture wouldn't be of *this* fact rather than some other.

### TLP 2.17 — *What the picture must have in common with reality in order to be able to represent it after its manner — rightly or falsely — is its form of representation.*

The form is what enables representation *at all*. Even a *false* picture has to share form with reality to be a false picture *of* anything in particular.

### TLP 2.172 — *The picture, however, cannot represent its form of representation; it shows it forth.*

The pivot proposition. A picture cannot include its own form *as* an element; it has the form *by being structured that way*. The form is *displayed*, not *stated*. This is the seed of [show-vs-say](./show-vs-say.md).

### TLP 2.18 — *What every picture, of whatever form, must have in common with reality in order to be able to represent it at all — rightly or falsely — is the logical form, that is, the form of reality.*

The logical form is the *minimal* shared structure required for representation. Spatial pictures share spatial form. Color pictures share color form. *Logical* pictures share logical form, which is the most general — the form any picture must have in common with the world to picture *anything*.

### TLP 3 — *The logical picture of the facts is the thought.*

The bridge from picture to thought. A *thought* is just a *logical picture* — a picture whose form of representation is logical (not merely spatial or chromatic). This identifies thought with picture-making at the logical level.

### TLP 4.01 — *The proposition is a picture of reality. The proposition is a model of the reality as we think it is.*

The bridge from thought to proposition. A *proposition* is a *thought* with *sense* — a logical picture expressed in language (or symbol).

---

## How the wiki's encoders instantiate picture theory

| Encoder | Picture-theory operationalization |
|---|---|
| **[NEDF](./nedf-overview.md)** | One vivid scene whose elements correspond to the concept's objects; four retrieval angles (Name-hook · Essence · Distinguisher · Failure) are four windows onto the same scene. The scene *shares logical form* with the concept; the four angles are four projections of the form. |
| **[CAST](./cast-overview.md)** | Graph encoder: palace = world; animal-nodes = objects; verb-edges = relations. The graph's *structure* mirrors the concept's *structure*. CAST is picture-theory's correspondence claim made into a navigational substrate. |
| **[SPEAR](./spear-overview.md)** | One runnable scene with five slots (Scene · Preconditions · Execution · Alternatives · Repair). The scene shares the *procedural* form of the underlying procedure; running through SPEAR is walking through the picture-of-the-procedure. |
| **[HEART](./heart-overview.md)** | One room per person. The room's *furnishings* correspond to the person's *traits*; the room's *layout* corresponds to the person's *operating shape*. Picture theory applied to people-models. The 2026-05-24 aux-view / dom-confirmed flag is a picture-theoretic disclaimer: this room is currently a picture of the person's *auxiliary* function, not their *dominant*. |
| **[ORACLE](./oracle-overview.md)** | Prediction encoder: the six-slot card *shows* the prediction's form (sequential / conditional / distributional / anomaly) rather than narrates it. |
| **[GRACE](./grace-overview.md)** | Social-pragmatic encoder: graded social moves on 1-5 scales. The scales are pictures of the social form (each 1-5 axis is a picture of a dimension of social space). |
| **[REMAPS](./remaps.md)** | The six transformation moves preserve logical form while varying surface — exactly the picture-theoretic move (vary the picture's elements while keeping its form). |
| **[CLAMP](./clamp-render-lens.md)** | Render-direction lens — chooses *which* of the many possible surfaces to use while leaving form invariant. |

The wiki's entire encoder stack is picture-theory rendered into operational rules. This is the load-bearing claim.

## What picture theory cannot do (the limits)

- **Cannot represent its own form.** TLP 2.172 + 4.121. This is the regress that motivates [show-vs-say](./show-vs-say.md).
- **Cannot picture logical form *as such*.** You can't make a picture *of* logic. You can make pictures *in* logic.
- **Cannot picture ethics, aesthetics, the meaning of life.** TLP 6.42, 6.421. These lie outside the world of facts; they can be shown (in lived action) but not pictured (in propositions). The *mystical* (TLP 6.44+).
- **Cannot handle Gödel-undecidable propositions.** True-but-unprovable propositions are *not* truth-functions of elementary propositions (TLP 5's claim that they must be), so TLP's specific truth-function machine fails for them. Picture theory survives the philosophical layer; the truth-function reduction does not.

See [tractatus-logico-philosophicus](./tractatus-logico-philosophicus.md) §What Gödel did to TLP for the full account.

## Common confusions

- **"Picture" doesn't mean visual image.** TLP uses *picture* (German *Bild*) in a generalized sense — any structured representation whose elements correspond to the elements of what it represents. A musical score, a phonograph record, a sentence in symbols — TLP 4.014 makes this explicit. The wiki's encoder scenes (often visual) are pictures in this sense, but so are formulas, diagrams, and structured prose.
- **"Form" doesn't mean shape.** Form is the *possibility* of arrangement — the structural pattern, not the surface look. A scene in your memory palace and a paragraph of text can share form without sharing shape.
- **"Logical form" doesn't mean *formal logic*.** Logical form is the most-general form any picture shares with the world — the structural skeleton. Formal logic *studies* logical form via symbols, but logical form itself is broader than formal logic.

## METER integration

| Drill | Pass floor | Source | Owner |
|---|---|---|---|
| TLP fragment → encoder mapping (given a TLP fragment, name the wiki encoder slot it grounds) | <30 s | TLP 2.1-4.06 + wiki encoder pages | this page |
| Form-vs-surface diagnostic (given two encodings, declare same-form / different-form) | <60 s | wiki existing concept cards | this page |
| Picture-theory checksum (given a wiki concept card, state which TLP proposition grounds the move) | <60 s | this page's encoder table | this page |

## Cross-links to existing wiki layers

- **[show-vs-say](./show-vs-say.md)** — the immediate consequence; the form cannot be said, only shown
- **[nedf-overview](./nedf-overview.md)** + [cast-overview](./cast-overview.md) + [spear-overview](./spear-overview.md) + [heart-overview](./heart-overview.md) + [oracle-overview](./oracle-overview.md) + [grace-overview](./grace-overview.md) — the six encoders this theory grounds
- **[remaps](./remaps.md)** + [clamp-render-lens](./clamp-render-lens.md) — surface-variation moves that preserve form
- **[memory-palace](./memory-palace.md)** — palaces as picture-theoretic substrates
- **[scene-grammar](./scene-grammar.md)** — operational rules for building scenes; the picture-theoretic counterpart at the construction layer
- **[representation-rules](./representation-rules.md)** — wiki-internal rules for representations; should cross-link to picture theory as the philosophical foundation
- **bible-study-hebrews-11-1** — Hebrews 11:1's *substance (hypostasis) / evidence (elenchos)* pairing shares picture theory's show-vs-say structure

## Proof-theoretic-semantics successor (added 2026-05-27 from Mancosu-Galvan-Zach ingest)

TLP picture-theory is the *static* version: meaning is given by structural correspondence between proposition and fact (the picture mirrors the structure). [Proof-theoretic semantics](./proof-theoretic-semantics.md) (Dummett 1973; Prawitz 1965, 1971) — surfaced by the 2026-05-27 [Mancosu, Galvan, Zach (2021)](./proof-theory-mancosu-galvan-zach.md) ingest — is the *dynamic* successor: meaning is given by *rules of use*, where the introduction rules *define* the connective and the elimination rules are constrained by **harmony**.

Both are anti-truth-conditional. Both locate meaning in something other than reference to a model. The wiki adopts both:

- **Static layer (TLP picture-theory)**: a concept's structural form is shown via the encoder's slots; the [show-vs-say](./show-vs-say.md) boundary is enforced.
- **Dynamic layer (PT semantics)**: a concept's meaning-in-use is given by what its slots license; the harmony condition forbids overclaim.

The wiki's [NEDF](./nedf-overview.md) (and [GRACE](./grace-overview.md), [METER](./meter-overview.md)) cards instantiate *both* simultaneously: NEDF's slots *show* the concept's structural form (TLP) AND *govern* its rules of use (PT semantics). The wiki has been doing both since the encoder pages were authored; the Mancosu-Galvan-Zach ingest makes the dynamic-layer ancestor explicit.

## Related pages

- [tractatus-logico-philosophicus](./tractatus-logico-philosophicus.md) — source primary text (propositions 2.1 – 4.06 are this page's home territory)
- [show-vs-say](./show-vs-say.md) — sister concept; the consequence of picture theory's regress
- [nedf-overview](./nedf-overview.md) — the wiki encoder whose paradigm this theory grounds
- [copi-introduction-to-logic](./copi-introduction-to-logic.md) — symbolic-logic chapters (Ch 8-10) develop the truth-function side of picture theory
- [proof-theory-mancosu-galvan-zach](./proof-theory-mancosu-galvan-zach.md) · [proof-theoretic-semantics](./proof-theoretic-semantics.md) · [sub-formula-property](./sub-formula-property.md) — the *dynamic* proof-theoretic successor of picture theory's static-meaning account (added 2026-05-27)
- [normalization-theorem](./normalization-theorem.md) · [cut-elimination-hauptsatz](./cut-elimination-hauptsatz.md) — the formal-logic theorems that ground "a normal proof shows its sub-structure"
- [logicomix-graphic-novel](./logicomix-graphic-novel.md) — narrative context for Wittgenstein writing TLP
- [logic-atomic-design](./logic-atomic-design.md) — the hub; picture theory sits at the Atom-tier philosophical foundation
- [glossary](./glossary.md) — Logic layer registration (picture-theory · logical-form · atomic-fact · state-of-affairs · fact · truth-function · tautology · proof-theoretic-semantics · harmony)
