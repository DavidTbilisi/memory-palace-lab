---
palace: meta-knowledge
level: 6
domain: 10
room: 5
semantic_mode: 5
wiki_source: wiki/logic/math-proof-glyph-grammar.md
---

# Math Proof Glyph Grammar

**Summary**: Frozen-tableau encoding of a specific mathematical proof as a single non-destructive image. Eleven shape primitives ("alphabet pieces") plus four composition rules generate the **silhouette** of any proof at a glance. A hybrid slot architecture splits 12 mathematical-decision axes into four families (frame atmosphere / per-piece ornaments / header banner / dominance pattern) with the ambient/local fallback rule. Third instance of the glyph-grammar-pattern after code-glyph-grammar (code) and aws-glyph-grammar (AWS). Built by following the owner page's Step 1–8 recipe.

**Sources**: Synthesis page. Third application of glyph-grammar-pattern to a non-software domain. Draws on math-and-statistics-encoding (if it exists; if not, this page seeds it), [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) (sister freeze-on-choose pattern for numeric operators), [vedic-speed-math](./vedic-speed-math.md) · [trachtenberg-system](./trachtenberg-system.md) · [calendar-reflex](./calendar-reflex.md) (existing math memory work this page sits alongside), [representation-rules](./representation-rules.md), [UMTF](./universal-mental-tagging-framework.md), [composability-index](./composability-index.md).

**Last updated**: 2026-05-13

---

## What this page is

The **third instance** of the glyph-grammar-pattern, applied to mathematical proof structure. The pattern's invariants (finite alphabet + 4 primary + supplementary composition rules + hybrid slot architecture + ambient/local fallback) hold; only the **vocabulary** changes — alphabet pieces are proof constructs, composition meaning is logical dependency, slot fillers are mathematical-decision axes.

This page is the deliberate test of whether the glyph-grammar pattern survives a *non-system-architecture* domain. Code and AWS both encode system structure; mathematical proofs encode *logical structure*. If the pattern survives, the three invariants (provider-agnostic / scale-agnostic / rendering-agnostic, per glyph-grammar-pattern) extend to *domain-agnostic at the cross-domain level*.

**Use this page when** you want to memorize a specific proof (for an exam, for understanding, for reading-aloud at a math salon) such that you can identify *which proof method* and *which mathematical domain* the proof inhabits in one fixation. The existing math memory pages ([vedic-speed-math](./vedic-speed-math.md), [trachtenberg-system](./trachtenberg-system.md), [calendar-reflex](./calendar-reflex.md), [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md)) teach mental-arithmetic technique; this page teaches compression of a *specific proof* into a recallable silhouette.

---

## The eleven-piece proof alphabet

| # | Construct | Examples | Shape | Default color |
|---|---|---|---|---|
| 1 | **Axiom / definition** (foundational given) | Peano axioms; "let a Cauchy sequence be ..." | **▱** parallelogram | grey (foundational, immutable) |
| 2 | **Step** (algebraic / logical manipulation) | "Adding 1 to both sides ..."; "by definition of derivative ..." | **□** square | blue (derived value) |
| 3 | **Named result** (lemma / theorem / corollary / proposition) | Lemma 1.4; Theorem 3 | **◯** disk (small = lemma, medium = proposition, large = theorem, dotted-border = corollary) | green (established knowledge) |
| 4 | **Apply / cite** (reference a previous result) | "By Lemma 2 ..."; "Applying the inductive hypothesis ..." | **▷** right-arrow tile | green (matches result-color, points to caller) |
| 5 | **Case fork** | "Case 1: x > 0. Case 2: x ≤ 0." | **Y** fork (1, 2, or N arms) | yellow (branching) |
| 6 | **Induction** | "Base: P(0). Step: P(n) → P(n+1)." | **⟲** induction circle (closed loop with base case + inductive step inside) | orange (cyclic / closed) |
| 7 | **Contradiction / RAA** | "Suppose, for contradiction, that ..." | **⊥** bottom symbol (logical contradiction) | red (impossibility / failure) |
| 8 | **QED / conclusion** | "Therefore, x ≠ y." "□" or "■" at proof end | **▲** up-arrow / conclusion tile | green (returned result) |
| 9 | **Quantifier marker** | ∀x, ∃y | **∀ / ∃** literal symbol | purple (binding scope) |
| 10 | **Proof frame** | The proof's overall scope; sub-proofs of lemmas inside theorems | **▢** outer rounded rectangle | grey border |
| 11 | **External citation** | "By Cauchy-Schwarz ..."; "By the Banach Fixed-Point Theorem ..." | **⌬** cloud-with-arrow (external) | sky-blue (outside-the-current-frame) |

Three mapping notes:

- **Axioms vs definitions both use ▱.** The parallelogram is "foundational, given without proof." Axioms (filled) and definitions (hollow with the term inside) discriminate via fill style. They share a piece because they share a *role*: foundational truths the proof rests on.
- **Named results (◯) discriminate by size**, not by separate pieces. Small ◯ = lemma; medium ◯ = proposition; large ◯ = theorem; dotted-border ◯ = corollary. Same role (a proved claim), different importance. One piece, four sizes / outlines.
- **Quantifier marker (∀/∃) is one piece with two letters**, the same way the AWS `🛡` piece carries multiple internal icons. Universal and existential quantifiers play the same structural role (bind a variable across a scope) — the discriminating letter is the per-piece ornament.

---

## Composition rules

Four primary rules; three supplementary. All seven are pre-attentive.

**Primary:**

1. **Top-to-bottom = logical dependency.** Pieces at the top serve pieces at the bottom. Givens at the top; conclusion at the bottom. (Note: code uses left-to-right for sequence; AWS uses left-to-right for data flow; proofs use *top-to-bottom* because written math proofs flow downward — derivations cascade from premises to conclusions.)
2. **Adjacency = same logical scope.** Pieces in the same ▢ frame share the same set of assumptions, derived results, and free variables.
3. **Stacking = parallel sub-proofs.** Two stacked sub-frames = two independent cases that both contribute to the same conclusion (case analysis). Three stacked = three cases.
4. **Encapsulation by any container-piece = sub-scope.** ▢ encloses a sub-proof (proof of a lemma inside a theorem); ⟲ encloses an induction's base case + inductive step; ⊥ encloses a contradiction sub-derivation. Multiple container types can layer.

**Supplementary:**

5. **Solid arrow = direct implication (P ⟹ Q); dashed arrow = indirect (contrapositive, "Q false implies P false").**
6. **Double-line arrow = biconditional (P ⟺ Q).**
7. **Multiplicity collapse at N > 5.** Same rule as AWS: when a case-analysis has > 5 cases, collapse to a single Y-arm with a "×N" badge.

A complete proof is one outer ▢ frame containing everything; multi-theorem documents (e.g., a chapter proving 3 theorems) are multiple adjacent ▢ frames.

---

## The hybrid slot architecture

| Slot family | Spaces (count) | Where it lives | Visual rule |
|---|---|---|---|
| **Frame atmosphere** (ambient) | 5 — mathematical domain, foundational system, formality level, pedagogical stage, cardinality | Edges, texture, banding of the outer ▢ frame | One **atmospheric signature** per proof variant |
| **Per-piece ornaments** (local) | 4 — proof technique, constructivity, quantification depth, rigor source | Each individual piece carries them | **≤2 ornaments per piece** |
| **Header banner** (meta) | 2 — length / complexity, generality | Text/icon bar above the silhouette | Whole-proof facts |
| **Dominance pattern** (compositional) | 1 — dependence | Decides whether the silhouette is dominated by axiomatic deduction vs reference chains | Visible from silhouette geometry |

5 + 4 + 2 + 1 = 12 axes, each placed once.

### Frame atmosphere — the ambient spaces

| Frame-level slot | Spaces it carries | Example signatures |
|---|---|---|
| **Frame edge texture** | Mathematical domain | Geometry = ruled-line edges; algebra = solid edges; analysis = wavy edges (continuous); topology = dotted edges (open sets); number theory = numbered tick-marks at edges; combinatorics = lattice-pattern edges |
| **Frame opacity** | Foundational system | ZFC = opaque grey; type theory = translucent purple; category theory = arrow-marked edges; NBG = double-line edges |
| **Frame tint** | Formality level | Informal sketch = pencil-grey wash; semi-formal = solid colors; fully formal = sharp black-and-white; machine-checked = cyan-cyber-grid texture |
| **Corner badge** | Pedagogical stage | Undergrad = "U"; grad = "G"; research = "R"; high school = "HS" |
| **Frame banding** | Cardinality | Finite proofs = no bands; countable = single horizontal band; uncountable = double horizontal band (separating "below ω" from "above ω") |

### Per-piece ornaments — the local spaces

| Per-piece slot | Space it carries | Example signatures |
|---|---|---|
| **Internal arrow direction** (◯ only) | Proof technique | "By direct construction" = ↓ arrow inside; "by contradiction" = ⊥ inside the disk; "by induction" = ⟲ inside; "by contrapositive" = ↗ inside; "by case analysis" = Y inside |
| **Border style** (any piece) | Constructivity | Solid border = constructive; dashed = non-constructive (uses AC or excluded middle); dotted = computable (witness can be extracted) |
| **Top ornament** (◯ and ▱ only) | Quantification depth | First-order = no ornament; second-order = small ∀ stamp; higher-order = stacked ∀∀ stamp |
| **Bottom ornament** (□ only) | Rigor source | Synthetic = blank; axiomatic = small "A" stamp; computational = small calculator icon (computed result) |

### Header banner stylings

| Space | Banner signature |
|---|---|
| **Length / complexity** | One-liner = single dot; short proof = solid bar; medium = double bar; long = triple bar; monograph = stacked rectangles |
| **Generality** | Specific instance = no badge; general = "∀" banner badge; universal = "∀∀" banner badge |

### Dominance pattern

| Space | Effect on the silhouette |
|---|---|
| **Dependence** | Self-contained = silhouette dominated by ▱ axioms + □ steps + ▲; reference-heavy = silhouette dominated by ▷ (apply) + ⌬ (external citation) with few ▱ |

### Ambient/local fallback rule

Per glyph-grammar-pattern discipline: if an axis is ambient in proof A but local in proof B, encode at both levels and let whichever is non-empty win. The canonical case for proofs: **cardinality** is ambient when the proof is *about* cardinality (e.g., Cantor's diagonal), but local when it appears only inside a single step (e.g., "the set of rationals is countable, therefore ..."). The fallback rule renders ambient when the proof's whole subject is cardinality; per-piece corner tag when cardinality is invoked only in selected steps.

---

## Worked example: induction proof of `Σᵢ₌₁ⁿ i = n(n+1)/2` across three formality levels

The shared silhouette (the induction structure — identical across all formality levels):

```p5 height=400
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 400); p.noLoop(); };
p.draw = () => {
  p.background(p.isDark ? 30 : 245);
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54', gold = '#a08a5c', slate = '#7d8aa0';
  const W = p.width;
  p.textAlign(p.LEFT, p.TOP); p.textSize(12);

  const outerX = 20, outerY = 20, outerW = W - 40, outerH = 360;
  p.noFill(); p.stroke(slate); p.strokeWeight(2);
  p.rect(outerX, outerY, outerW, outerH, 14);
  p.noStroke(); p.fill(slate); p.textStyle(p.BOLD);
  p.text('▢ proof frame (piece #10)', outerX + 10, outerY + 6);
  p.textStyle(p.NORMAL); p.fill(green);
  p.text('▱ "Let n ∈ ℕ"   (given, piece #1)', outerX + 16, outerY + 32);

  const indX = outerX + 16, indY = outerY + 56, indW = outerW - 32, indH = 250;
  p.noFill(); p.stroke(gold); p.strokeWeight(2);
  p.rect(indX, indY, indW, indH, 10);
  p.noStroke(); p.fill(gold); p.textStyle(p.BOLD);
  p.text('⟲ induction (piece #6)', indX + 8, indY + 6);
  p.textStyle(p.NORMAL); p.fill(ink);

  const lines = [
    ['▱ base: n = 1', 'base case'],
    ['□  1 = 1·2/2 ✓', 'verify base'],
    ['▱ step: assume P(k)', 'inductive hypothesis'],
    ['□  Σᵢ₌₁ᵏ⁺¹ i = ...', 'algebraic manipulation'],
    ['□  = k(k+1)/2 + (k+1)', 'use IH'],
    ['□  = (k+1)(k+2)/2', 'simplify'],
    ['▲  P(k+1) shown', '']
  ];
  let ly = indY + 30;
  for (const [main, note] of lines) {
    p.fill(ink);
    p.text(main, indX + 16, ly);
    if (note) { p.fill(slate); p.text(note, indX + 230, ly); }
    ly += 30;
  }

  p.fill(green); p.textStyle(p.BOLD);
  p.text('▲ Therefore Σ = n(n+1)/2   (conclusion, piece #8)', outerX + 16, indY + indH + 14);
  p.textStyle(p.NORMAL);
};
```

Three formality stylings:

| Slot | Undergrad informal sketch | Grad-level rigorous | Fully formal (Coq notation) |
|---|---|---|---|
| **Frame tint** (formality) | Pencil-grey wash | Solid colors | Sharp B&W + cyan grid (machine-checked) |
| **Frame edge texture** (domain) | Solid (algebra) | Solid (algebra) | Solid (algebra) |
| **Frame banding** (cardinality) | None (finite, doesn't matter) | None (finite) | Single band (formally over ω) |
| **Corner badge** (stage) | "U" (undergrad) | "G" (grad) | "R" (research / Coq) |
| **◯ internal arrow** (technique) | ⟲ inside (induction) | ⟲ inside (induction) | ⟲ inside (induction) |
| **Border style** (constructivity) | Solid (constructive) | Solid (constructive) | Solid (constructive) |
| **□ bottom ornament** (rigor) | Blank (synthetic) | Small "A" stamps on each step (axiomatic) | Calculator icon on each step (computational, every step machine-verified) |
| **Length banner** | Single dot (short) | Solid bar (medium) | Triple bar (long, full Coq script) |
| **Generality banner** | "∀" (general, for all n) | "∀" | "∀" |

Same silhouette in all three. The proof method (induction) is read from the silhouette; the formality level is read from the frame tint + per-step ornaments + length banner. Both in one fixation.

---

## Proof silhouette battery

Six classical proof methods with distinct silhouette fingerprints:

| Proof method | Silhouette fingerprint | Canonical example |
|---|---|---|
| **Direct proof** | Top-to-bottom chain of □ steps + ▲ tail | "If a \| b and b \| c then a \| c" |
| **Proof by contradiction** | ▱ "assume not-P" at top + chain of □ + **⊥ piece** + ▲ | "√2 is irrational" |
| **Proof by induction** | ▱ given + **⟲ closed loop** containing base + inductive step + ▲ | "Σᵢ₌₁ⁿ i = n(n+1)/2" |
| **Proof by case analysis** | ▱ given + **Y multi-arm fork** + parallel sub-proofs + ▲ joining all arms | "\| x \|² ≥ 0 for all real x" (case x ≥ 0, case x < 0) |
| **Constructive existence** | ▱ statement of existence + □ explicit construction + □ verification + ▲ | "Infinitude of primes" (Euclid: construct N = p₁p₂...pₖ + 1) |
| **Diagonal argument** | ▱ enumeration assumption + ▢ sub-frame containing self-referential ◯ + ⊥ + ▲ | "Real numbers are uncountable" (Cantor) |

Pre-attentive discriminators: presence of ⟲ (induction), presence of ⊥ (contradiction), presence of Y multi-arm fork (case analysis), self-referential ◯ inside a sub-frame (diagonal), explicit construction-then-verify two-step pattern (constructive existence).

### Visual reference

ChatGPT-generated reference card showing both the **polished digital rendering** (top half — dark background) and the **pen-sketch notebook rendering** (bottom half — cream paper, hand-drawn) of the same induction proof × three formality stylings (UNDERGRAD informal / GRAD rigorous / COQ formal), plus the 11-piece proof alphabet reference chart in both styles.

![Math-proof glyph grammar reference — induction proof × {undergrad, grad, Coq-formal} in polished + pen-sketch renderings, with 11-piece proof alphabet chart](../diagrams/math-proof-glyph/induction-proof-formality-modes-and-alphabet.png)

Same content in both styles makes the encoding's invariance to rendering visible: the induction silhouette is the same in polished and sketch; only the medium changes. Use the **sketch** for first-encounter memorization (imperfect linework adds discrimination cues); the **polished** for documentation; the **alphabet chart** is canonical regardless of rendering style.

What to look for in the worked example:

- **Column A — UNDERGRAD informal** (corner badge "U", pencil-grey wash frame): single-dot length banner; blank ornaments on each step (no per-step rigor stamps); ▱ axioms and □ steps look hand-written; ⟲ induction circle in orange.
- **Column B — GRAD rigorous** (corner badge "G", solid-color frame): solid-bar length banner; each □ step has a small "A" stamp (axiomatic-rigor source); same induction silhouette inside.
- **Column C — COQ formal** (corner badge "R", sharp-B&W + cyan-cyber grid frame): triple-bar length banner; single horizontal band inside the frame ("formal over ω = countable" cardinality cue); each □ step has a small calculator-icon (computational rigor — every step machine-verified).

Same silhouette (▱ given + ⟲ containing [base, step, derivation chain, P(k+1) ▲] + ▲ conclusion) in all three columns. The proof method (induction) is read from the silhouette; the formality level is read from the frame tint + per-step ornaments + length banner. Both in one fixation.

The visual reference also exercises both **refinements that propagated back to glyph-grammar-pattern**: (a) top-to-bottom reading direction (logical dependency flows downward inside each proof frame, distinct from code/AWS left-to-right); (b) container generalization — `⟲` encloses the induction's base + step + derivation, demonstrating that container-pieces beyond `▢` work cleanly.

---

## Pressure-test: what survived from the recipe

Following glyph-grammar-pattern's Step 6 — pressure-tested against the 6 proof silhouettes in the battery. Outcome: **alphabet survives at 11 pieces; no new pieces; one composition-rule refinement surfaced (top-to-bottom direction, vs left-to-right in code/AWS).** The recipe held under domain-change.

What stress-tested cleanly:
- Direct proof — minimal pieces, clean top-to-bottom chain
- Induction — ⟲ as a container-piece, encapsulation rule generalizes from `▢`/`◆` to `⟲`
- Contradiction — ⊥ as a distinct shape (mirrors AWS `↯`, code `↯`); no confusion
- Case analysis — Y fork with N arms; same as code/AWS
- Constructive existence — two-step construct-then-verify; chain of □
- Diagonal argument — self-referential ◯ inside a ▢; encapsulation handles recursion-into-self

What surfaced as a refinement:
- **Reading direction is domain-dependent.** Code = left-to-right (sequence); AWS = left-to-right (data flow); proofs = **top-to-bottom** (logical dependency). The composition rule #1 should be re-stated at the glyph-grammar-pattern level as *"reading direction = primary semantic flow, which varies by domain"* rather than committing to left-to-right. This is a refinement of the *pattern*, not just this instance.
- **Container generalization extends further than originally documented.** aws-glyph-grammar generalized encapsulation from `▢` to `◆`. This instance generalizes further: `⟲`, `⊥`, and `▢` are all container-pieces with different semantics (cyclic, contradiction-scope, proof-scope). The pattern's container-piece set is open, not closed at two.

Both refinements should propagate back to glyph-grammar-pattern (see *Open questions* below).

---

## What this fusion buys

- **Two facts in one fixation.** The silhouette names the proof method; the styling names the formality level / domain. Currently this is two separate retrievals when reading any proof.
- **Cross-proof-method transfer becomes diff-spotting.** A direct proof and a proof-by-contradiction of the same theorem differ only at the silhouette level (presence of ⊥). The styling layer carries domain + formality.
- **Bridges to existing math memory work.** [vedic-speed-math](./vedic-speed-math.md), [trachtenberg-system](./trachtenberg-system.md), [calendar-reflex](./calendar-reflex.md) teach mental-arithmetic *technique*; this page lets you compress a *specific proof* (theorem + method) into a recallable silhouette. Together they give you the catalog (techniques) + the encoding (specific proofs).
- **Third instance validates the glyph-grammar pattern's domain-portability.** Two prior instances (code-glyph-grammar, aws-glyph-grammar) were both system-architecture domains; this one is logical structure. The pattern survives cleanly with one refinement (reading direction) that propagates back to the owner page.

---

## What this fusion costs

- **~60 visual conventions to freeze** (12 axes × ~5 cells). Same magnitude as code/AWS.
- **Visual budget per piece capped at ≤2 ornaments** (typically 1). Same cap as the owner pattern.
- **Frozen tableau can't capture proof timing or step-by-step derivation.** The silhouette captures the method's *shape* but not the actual algebraic moves. For step-by-step replay (rehearsing a proof), walk into a [SPEAR](./spear-overview.md) scene — the glyph is L1+L2 of the proof; SPEAR carries L3.
- **Proof-method drift.** Some proofs use mixed methods (e.g., "by induction on n, with case analysis at the inductive step"). The silhouette has to render the *primary* method as the dominant shape and the secondary method as a nested piece — discipline of "what's primary" is per-proof and can drift across encodings.

---

## Anti-patterns

- **Adding a 12th piece for a new "proof technique."** Every additional technique (probabilistic, double-counting, pigeonhole, generating-functions) folds into existing pieces: probabilistic = "by contradiction with measure-zero" = ⊥; double-counting = "two ways of counting" = case analysis Y; pigeonhole = ▷ apply pigeonhole; generating-functions = ⌬ external citation + chain of □.
- **Drawing every named result as a separate ◯.** A proof of Theorem 1 might cite Lemma 2 + Theorem 3 + Corollary 4 + Theorem 5. Drawing each as a full ◯ clutters the silhouette. The discipline: **own** named results (the ones being proved in this proof) get ◯ pieces; **cited** named results get ▷ (apply) or ⌬ (external citation) only.
- **Encoding every quantifier.** A proof might have 5+ universal quantifiers nested. Encoding each as ∀ piece is overload. Render only *load-bearing* quantifiers (the ones whose scope-change drives the proof structure).
- **Drawing the algebraic steps individually.** A long algebraic manipulation might have 10+ steps. Collapse with multiplicity-collapse rule (composition rule #7): "×N algebraic steps" as a single □ with "×N" badge.
- **Confusing the glyph with the proof.** The glyph is *recognition* (what kind of proof is this?); the actual proof goes in a notebook or textbook. Don't try to encode the full proof in the glyph — encode its *shape*.

---

## Training the alphabet

Lamp / Scale / Sword (per [skill-progression-stages](./skill-progression-stages.md)):

1. **Lamp**: given a short proof (5–10 named steps), sketch the silhouette using only the 11 pieces. Pass: ≥85% accuracy on a 20-proof drill, no piece-invention.
2. **Scale**: given two silhouettes of the *same* theorem in two different proof methods (e.g., infinitude of primes by Euclid construction vs by contradiction), identify which slot-stylings differ. Pass: ≥80% on mixed-method drills.
3. **Sword**: given a published proof (textbook or paper) under a 120 s timer, draw the silhouette including the formality + domain stylings. Pass: silhouette regenerates the proof method with no missing pieces and the styling layer matches the proof's declared formality / domain.

Composes with existing math memory pages: this page teaches *proof-recognition reflex*; [vedic-speed-math](./vedic-speed-math.md) and siblings teach *technique-execution reflex*. Use both in parallel for full math memory.

---

## Composition with existing layers

- **glyph-grammar-pattern** — the owner pattern this page instantiates. This page is the third worked example of the Step 1–8 recipe.
- **code-glyph-grammar** · **aws-glyph-grammar** — sister instances; first and second worked examples.
- **[vedic-speed-math](./vedic-speed-math.md)** · **[trachtenberg-system](./trachtenberg-system.md)** · **[calendar-reflex](./calendar-reflex.md)** · **Soroban** — adjacent math memory pages. Those teach *technique*; this page teaches *specific proof encoding*. Together they cover math memorization at two layers.
- **[major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md)** — sister freeze-on-choose pattern for *numeric operators* (single-icon-per-operator); this page applies a richer pattern (full glyph-grammar) at the proof level.
- **[NEDF](./nedf-overview.md)** — each proof in the silhouette battery can become a NEDF card (Name-hook = silhouette + theorem-name; Essence = method's structural intent; Distinguisher = nearest confusable proof method; Failure = misencoding trap).
- **[SPEAR](./spear-overview.md)** — when L3 (step-by-step procedure) is needed (rehearsing a proof aloud), walk the proof as a SPEAR scene. The glyph captures L1+L2; SPEAR carries L3.
- **[CAST](./cast-overview.md)** — proofs with many cross-references (number theory papers, category theory proofs with diagram-chasing) can be rendered as CAST graphs at the next zoom level out.
- **[representation-rules](./representation-rules.md)** — the 9 rules underneath the alphabet.
- **[chunking](./chunking.md)** — the floor. Proofs with >15 named steps need chunking via lemma-extraction before the alphabet is usable.

---

## Zeitz tactic-icons — discovery-method ornament family (added 2026-05-24)

The 2026-05-24 [Zeitz ingest](./zeitz-art-and-craft.md) adds a **fifth slot family** to the hybrid slot architecture: **tactic fingerprint**. The proof glyph already captures the proof's *shape* (silhouette = method) and *flavor* (atmosphere = formality / domain). The tactic fingerprint captures *which discovery tactic was used* — the wiki's first proof-shape encoding of methodology, not just structure.

Per [universal-mathematical-tactics](./universal-mathematical-tactics.md), the four cross-domain tactics each have a visual fingerprint:

| Tactic | Fingerprint glyph | Where it rides |
|---|---|---|
| **Symmetry** | Mirror-axis line bisecting the ▢ frame; matched pieces reflect across | Frame-level, marked by a dashed axis through the silhouette |
| **Extreme Principle** | A piece visibly *larger* (max) or *smaller* (min) than its siblings — typically a marked ▷ or ▲ with explicit "max" / "min" label | Per-piece; the extreme piece carries a corner tag |
| **Pigeonhole** | N pieces forced into <N slots; visual overlap or stack with "⌈N/h⌉" badge | Frame-level fringe; the pigeon-hole partition shows as a small lattice next to the relevant step |
| **Invariant** | A labeled counter at the frame margin: parity bit (●/○), mod-m residue (m=3, ≡1), color tally (3R/3B), monovariant arrow (↓) | Frame margin; the counter is the *fingerprint of the invariance argument* |

The tactic fingerprint is **optional** — many proofs use no special tactic and have no fingerprint. When present, it sharpens silhouette discrimination: two proofs of the same theorem (one by contradiction + symmetry; one by induction + invariant) produce visibly different fingerprints even though their primary silhouettes (⊥ vs ⟲) already differ.

Candidate composability-index row (currently `candidate`, pending one worked proof per tactic): [composability-index](./composability-index.md) §"[universal-mathematical-tactics](./universal-mathematical-tactics.md) × [math-proof-glyph-grammar](./math-proof-glyph-grammar.md)." Promoting requires four worked examples — one per tactic — rendered as glyphs with fingerprints, validated against the silhouette battery.

The fingerprint family is **read after** the silhouette: silhouette names the *argument method* (direct / contradiction / induction); fingerprint names the *discovery tactic* that *found* the argument. Both in one fixation, plus the formality atmosphere — three facts per glance.

## Open questions

- **Should the glyph-grammar-pattern owner page generalize its reading-direction rule?** Currently it commits to "left-to-right = data flow" implicitly (per code and AWS examples). The proof instance surfaces *top-to-bottom = logical dependency*. The right move is to restate composition rule #1 at the pattern level as *"reading direction = primary semantic flow, which varies by domain (left-to-right for sequence/data, top-to-bottom for logical dependency, possibly other directions for other domains)."* This propagates back to the pattern.
- **Should the container-piece set be documented as open?** code-glyph-grammar uses ▢; aws-glyph-grammar uses ▢ + ◆; this page uses ▢ + ⟲ + ⊥. The container set grows per-instance. The pattern's "encapsulation = sub-scope" rule should be restated as *"any container-piece encloses a sub-scope; the container set is per-instance and open."*
- **Does the alphabet survive on extremely-long proofs (research papers, monographs)?** Six classical proofs are short. Long proofs (Wiles's FLT, Perelman's Poincaré) have hundreds of named results and many sub-proofs. The chunking rule applies but at what depth? Defer until a long-proof use case lands.
- **How does this interact with `Coq` / `Lean` / `Agda` formal proof languages?** Their proof trees have a finite construct set (`apply`, `exact`, `intro`, `destruct`, `rewrite`, etc.). Worth a mapping section in a future revision — likely the alphabet pieces map directly to tactic categories.
- **Should there be a per-school styling palette (Bourbaki vs Russian vs combinatorial vs constructive)?** Different mathematical traditions favor different proof styles (Bourbaki's abstract-axiomatic vs Erdős's combinatorial flair). The pedagogical-stage axis partly covers this but tradition might warrant its own per-piece ornament.

---

## Related pages

- glyph-grammar-pattern — owner pattern; this page is the third worked instance
- code-glyph-grammar — first instance: code domain
- aws-glyph-grammar — second instance: AWS architecture domain
- [composability-index](./composability-index.md) — the registered owner pattern row should be updated to "3 instances"
- [vedic-speed-math](./vedic-speed-math.md) · [vedic-speed-math-skill-ceiling](./vedic-speed-math-skill-ceiling.md) · [vedic-multiplication-nedf-deck](./vedic-multiplication-nedf-deck.md) — adjacent math memory: Vedic technique
- [trachtenberg-system](./trachtenberg-system.md) — adjacent math memory: Trachtenberg technique
- [calendar-reflex](./calendar-reflex.md) — adjacent math memory: day-of-week algorithm
- Soroban Learning Method — adjacent math memory: soroban/abacus
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — adjacent freeze-on-choose pattern for numeric-operator icons
- [representation-rules](./representation-rules.md) — the 9 rules underneath the alphabet
- [chunking](./chunking.md) — compression layer
- [UMTF](./universal-mental-tagging-framework.md) — channel allocation per slot family
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — Lamp / Scale / Sword training ladder
- [skill-progression-stages](./skill-progression-stages.md) — gym-phase axis citation
- [NEDF](./nedf-overview.md) · [CAST](./cast-overview.md) · [SPEAR](./spear-overview.md) — encoder spine this page sits beside


---

## U — See (CAST)
1. Visual alphabet for proof constructs
2. Each shape maps to a proof move (induction, contradiction, etc.)

## D — Name (NEDF)
1. Math proof glyph grammar = visual alphabet for proofs
2. Distinguisher: shape-driven proof encoding
3. Failure mode: collapsing distinct proof types into one shape

## F — Do (SPEAR)
1. Read proof → identify move
2. Map to glyph → encode

## B — Watch (HEART)
1. Move misclassification
2. Glyph collision

## L — Predict (ORACLE)
1. Proof type → predict glyph
2. Glyph seen → predict move

## R — Act (GRACE)
1. Proof to memorize → run glyph grammar
2. Proof confusion → check glyph