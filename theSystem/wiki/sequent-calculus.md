---
palace: meta-knowledge
level: 8
domain: 10
room: 44
semantic_mode: 5
wiki_source: wiki/logic/sequent-calculus.md
---

# Sequent Calculus (LJ / LK)

**Summary**: Gentzen's 1935 proof system in which the basic object is not a formula but a *sequent* Γ ⊢ Δ — read as "if all formulas in Γ are true, at least one formula in Δ is true." Each connective comes with a *left rule* (introducing the connective in the antecedent) and a *right rule* (introducing it in the succedent), plus structural rules (weakening, contraction, interchange) and the singular *cut* rule. LK = classical, allowing arbitrary Δ; LJ = intuitionistic, restricting Δ to at most one formula. Sequent calculus is the natural arena for the [cut-elimination theorem](./cut-elimination-hauptsatz.md) and yields the [sub-formula property](./sub-formula-property.md) more cleanly than [natural deduction](./natural-deduction.md).

**Sources**:
- [Mancosu, Galvan, Zach (2021)](./proof-theory-mancosu-galvan-zach.md) Ch 5.
- dokumen.pub_an-introduction-to-proof-theory...pdf (Mancosu, Galvan, Zach, *An Introduction to Proof Theory*, OUP 2021) Ch 5 §§5.7-5.9 — deepen pass (variable-replacement lemma, NJ↔LJ translation, multiple-conclusion classical ND).
- Gentzen, G. (1935c) "Untersuchungen über das logische Schließen II," *Math. Z.* 39: 405-431.
- Hertz, P. (1929) — origin of the sequent notation Gentzen adopted.
- Negri, S. and von Plato, J. (2001) *Structural Proof Theory*. Cambridge UP.
- Troelstra, A. S. and Schwichtenberg, H. (2000) *Basic Proof Theory*, 2nd ed. Cambridge UP.

**Last updated**: 2026-06-10

---

## Unlocks (lead, not footer)

1. **Left-right symmetry × production-reception grammar symmetry.** Sequent calculus exposes the symmetry between *what you assume* (left of ⊢) and *what you commit to* (right of ⊢). Every connective has left+right rules with mirror structure. The production-reception grammar pair pattern in the wiki — production protocols mirrored by reception protocols, sharing slot structure — is the social-pragmatic instance of sequent calculus symmetry.

2. **Cut rule × wiki *lemma* discipline.** The cut rule packages "use C as a lemma" formally: prove Γ ⊢ Δ, C from one branch, prove C, Π ⊢ Λ from another, conclude Γ, Π ⊢ Δ, Λ. The wiki's named-protocol discipline (every glossary-registered atom has one owner page, used as a lemma elsewhere) is structurally cut. The [Hauptsatz](./cut-elimination-hauptsatz.md) says this can always be unpacked into a direct proof — first formal grounding of the wiki's *directness* principle.

3. **LJ's right-singleton constraint × [GRACE](./grace-overview.md) commit-to-one-move.** LJ requires the succedent to be a *single* formula (or empty). This is the formal-logic instance of GRACE's "commit to one alternative" — intuitionistic logic disallows the classical option of saying "one of A, B, C, … is true without specifying which." GRACE forbids the analogous social hedge.

## Mnemonic

**SLICE** = *Sequents · Left+right rules · Identity axiom · Cut · Elimination (structural).*

Read as "slice through the proof" — sequent calculus *slices* every formula at its main connective with either a left rule or a right rule, and the cut rule is what gets *sliced away* by the Hauptsatz.

## Memory checksum

If you can answer these in <60 s each from memory, the page is encoded:

1. State the **shape of a sequent** and its **intuitive meaning**. (*Γ ⊢ Δ where Γ = A₁, …, Aₘ and Δ = B₁, …, Bₙ are finite lists of formulas. Means: if all Aᵢ are true, then at least one Bⱼ is true. Empty succedent: at least one Aᵢ is false. Empty antecedent: at least one Bⱼ is true (a theorem).*)
2. What distinguishes **LJ from LK**? (*LJ restricts the succedent Δ to at most one formula; LK allows any finite list. Classical reasoning (excluded middle, double-negation elimination) requires the succedent freedom.*)
3. State the **cut rule** and what its formula is called. (*Γ ⊢ Δ, C and C, Π ⊢ Λ together yield Γ, Π ⊢ Δ, Λ; C is the **cut-formula** and it disappears in the conclusion.*)
4. State the **right-rule for →**. (*From Γ, A ⊢ B, Δ conclude Γ ⊢ A → B, Δ. (Note: A moves from antecedent to inside the conditional in the succedent — same shape as ND's →I, but rendered as a rule on sequents.))*
5. Name the three **structural rules** and what each does. (*Weakening (add a formula to either side); contraction (collapse two copies of the same formula on one side into one); interchange/exchange (swap two neighboring formulas on one side). Plus cut, sometimes counted as structural.*)

## Visual — the rule schema

```
                    SEQUENT CALCULUS RULES (LK)
                    ───────────────────────────

  AXIOMS                                 CUT

  ───── id                       Γ ⊢ Δ, C       C, Π ⊢ Λ
  A ⊢ A                        ─────────────────────────  cut
                                       Γ, Π ⊢ Δ, Λ


  STRUCTURAL (each has L and R versions)

         Γ ⊢ Δ   wL                  Γ ⊢ Δ    wR
       ──────                       ──────
       A, Γ ⊢ Δ                     Γ ⊢ Δ, A

   A, A, Γ ⊢ Δ   cL              Γ ⊢ Δ, A, A   cR
   ──────────                    ──────────
    A, Γ ⊢ Δ                     Γ ⊢ Δ, A


  LOGICAL (one ∧ pair shown; others analogous)

    Γ, A ⊢ Δ                       Γ ⊢ A, Δ      Π ⊢ B, Λ
   ─────────── ∧L1                ──────────────────────  ∧R
    Γ, A∧B ⊢ Δ                          Γ, Π ⊢ A∧B, Δ, Λ

    Γ, B ⊢ Δ
   ─────────── ∧L2
    Γ, A∧B ⊢ Δ
```

The left rule for ∧ has *two* versions (use A from the conjunction, or use B). The right rule for ∧ requires *both* A and B to be derivable. Compare with ND's intro/elim duality for ∧: ND's ∧I needs both, ND's ∧E1/∧E2 extracts one — same shape, different presentation.

```
                  EXAMPLE: ⊢ A → (B → A)
                  ─────────────────────

                       A ⊢ A    id
                     ─────────── wL
                      B, A ⊢ A
                     ─────────── →R
                      A ⊢ B → A
                     ───────────── →R
                      ⊢ A → (B → A)
```

Compare with the ND proof of the same formula in [natural deduction](./natural-deduction.md) — they're structurally the same; the sequent calculus version makes the antecedent-management explicit (weakening adds B; →R discharges it back).

---

## What sequents are (and aren't)

A sequent is *not* a formula. It's a *judgment* — an assertion about a logical relation between two lists of formulas. Gentzen took the notation from Hertz (1929), but Hertz didn't have rules for connectives. Gentzen added them.

Three common variations after Gentzen:
- **Sequents as pairs of lists** (Gentzen): order matters; need interchange rule.
- **Sequents as pairs of multisets**: order doesn't matter; no interchange rule needed.
- **Sequents as pairs of sets**: no order, no duplicates; no contraction needed.

The wiki uses Gentzen's original (pairs of lists) following Mancosu et al., because pedagogically the structural rules are *load-bearing* — they expose what the calculus needs to manage and what it doesn't.

## The two systems

### LK (Classical)

Sequent Γ ⊢ Δ with both sides arbitrary lists. All structural rules. All logical rules with their L and R versions. The classical rule for negation:

```
   Γ ⊢ A, Δ                A, Γ ⊢ Δ
  ──────────── ¬L         ──────────── ¬R
  ¬A, Γ ⊢ Δ                Γ ⊢ ¬A, Δ
```

These are perfectly symmetric — exactly the symmetry that breaks in LJ.

### LJ (Intuitionistic)

Sequent Γ ⊢ Δ with the constraint |Δ| ≤ 1. The negation rules become:

```
   Γ ⊢ A                A, Γ ⊢
  ──────── ¬L         ──────── ¬R
  ¬A, Γ ⊢              Γ ⊢ ¬A
```

The right rule for ¬ now forces the succedent to *empty* (because A on the right would crowd ¬A out under the |Δ| ≤ 1 rule). This single restriction blocks excluded middle: ⊢ A ∨ ¬A is unprovable in LJ.

The structural rules likewise restrict: weakening on the right (wR) can only add to an empty succedent.

### The other connectives

| Connective | L rule shape | R rule shape |
|---|---|---|
| ∧ | one-from-conjunction (two versions) | needs both conjuncts |
| ∨ | needs both disjuncts handled (two [premises](./argument-anatomy.md)) | one-from-disjunction (two versions) |
| → | needs A on right + B on left (two premises) | move A from left to inside conditional |
| ¬ | move A from succedent | move A from antecedent (LJ: emptying) |
| ∀ | instantiate | uniform (eigenvariable side-condition) |
| ∃ | uniform (eigenvariable side-condition) | instantiate |

Symmetry pattern: introduction on left ≈ elimination on right, and vice versa. This is *the* observation that makes sequent calculus more tractable than natural deduction for cut-elimination.

## Why sequents beat ND for cut-elimination

Natural deduction's intro/elim rules involve discharging assumptions and tracking dependencies through the proof tree. The detour-elimination procedure for ND (normalization) has to carefully manage these.

Sequent calculus puts *all* the dependency information in the sequent itself — antecedent says "what's assumed," succedent says "what's concluded." The cut-elimination algorithm can transform proofs locally without tracking external dependencies. The symmetry of left and right rules means every cut-elimination step has an obvious mirror.

Result: Gentzen *proved* cut-elimination for LK in 1935. The analog for ND (normalization) wasn't fully proved until Prawitz 1965 (NJ) and Andou 1995 (NK), and the proof is significantly harder. See [cut-elimination-hauptsatz](./cut-elimination-hauptsatz.md) and [normalization-theorem](./normalization-theorem.md).

## Translations LJ ↔ NJ

Mancosu et al. Ch 5.8 and 5.9 give explicit translations both directions. Sketch:

**NJ → LJ**: each ND inference becomes one or more sequent-calculus inferences. ND's →I becomes LJ's →R. ND's →E becomes a cut followed by trivialization.

**LJ → NJ**: each sequent rule becomes an ND derivation. The cut rule translates to a cut-formula being introduced and eliminated in ND, which after normalization disappears.

The translations preserve provability and approximately preserve proof structure. They don't preserve *length*: sequent-calculus proofs can be exponentially longer than NJ proofs of the same theorem and vice versa, depending on the formula.

## The variable-replacement lemma (§5.7)

Before either translation or cut-elimination can be set up, the source proves a small but load-bearing housekeeping lemma about eigenvariables. It is the kind of result that is invisible in the headline theorems yet silently used in almost every later proof transformation (source: dokumen.pub_an-introduction-to-proof-theory...pdf).

**Lemma 5.19 (variable replacement).** Suppose π(a) is a proof, t is a term not containing any eigenvariable of π(a), and a is a variable that is *not used as an eigenvariable* of any inference in π(a). Then π(t) — the result of replacing every occurrence of a by t throughout π(a) — is again a correct proof (source: dokumen.pub_an-introduction-to-proof-theory...pdf). The two side-conditions are exactly what protect the ∀R / ∃L eigenvariable conditions: if a were an eigenvariable somewhere, the substitution could violate the "proper variable does not occur in the side formulas" requirement; if t carried an eigenvariable, the substitution could create a fresh clash.

**Why it matters: regularity.** The lemma's payoff is the notion of a **regular** proof — Definition 5.22: a proof in LK is *regular* if every eigenvariable is the eigenvariable of a *single* ∀R or ∃L inference and occurs only above that one inference (source: dokumen.pub_an-introduction-to-proof-theory...pdf). Proposition 5.23 then uses Lemma 5.19 (via Corollary 5.21, which renames a sub-proof's eigenvariable to a fresh one) to show that **every proof can be transformed into a regular proof of the same end-sequent by renaming eigenvariables only** (source: dokumen.pub_an-introduction-to-proof-theory...pdf). Regularity is the standing assumption that lets the [cut-elimination](./cut-elimination-hauptsatz.md) double induction and the mid-sequent argument freely permute inferences without two distinct quantifier rules fighting over the same variable — so §5.7 is the quiet prerequisite for Ch 6.

## NJ ↔ LJ translation (§5.8-5.9)

The summary already notes that sequent calculus and [natural deduction](./natural-deduction.md) present the same logic; §§5.8-5.9 make the correspondence a pair of explicit, structure-revealing maps. The shape of the maps is itself the lesson: **introduction rules correspond to right rules, and elimination rules correspond to cut** (source: dokumen.pub_an-introduction-to-proof-theory...pdf).

**NJ → LJ (Theorem 5.28).** A mapping P sends each NJ-deduction δ of A from undischarged assumptions Γ to an LJ-proof of Γ ⊢ A. Walking the cases (source: dokumen.pub_an-introduction-to-proof-theory...pdf):

- Each **introduction rule maps to the matching right rule**: ∧I → ∧R, ∨I → ∨R, ⊃I → ⊃R (the discharged assumption B becomes the antecedent formula that ⊃R moves inside the conditional), ∀I → ∀R, ∃I → ∃R.
- Each **elimination rule maps to a cut**. ∧E becomes a cut of the translated sub-proof against an axiom `A ∧ B ⊢ A`; ⊃E becomes a cut whose other premise is built with ⊃L; ∀E and ∃E likewise become cuts (∀E cuts against `∀x B(x) ⊢ B(t)`). The intuition is exact: *an elimination consumes a lemma, and consuming a lemma is what cut formalizes.*
- The ⊥-introduction (intuitionistic absurdity ⊥ᵢ) maps to a right-weakening on the empty succedent.

**LJ → NJ (Theorem 5.31).** The reverse map D first regularizes π (Proposition 5.23, above), then sends each LJ-proof to an NJ-deduction (source: dokumen.pub_an-introduction-to-proof-theory...pdf):

- Each **right rule maps to the matching introduction rule** (∧R → ∧I, ⊃R → ⊃I with discharge, ∀R → ∀I, …).
- Each **left rule maps to the matching elimination rule**, applied with the major premise standing as an open assumption that the rule's translation then discharges (∧L → ∧E, ∨L → ∨E with two discharges, ⊃L → ⊃E, ∀L → ∀E, ∃L → ∃E).
- **The cut rule maps to a substitution that creates a detour.** When π ends in a cut of `Γ ⊢ B` against `B, Δ ⊢ A`, the translation grafts the deduction D(θ) ending in B *into* every open assumption B of D(λ) — i.e. it forms `D(λ)[D(θ)/B]` — and the source notes this is licensed by the substitution lemma (their Lemma 4.8) provided no eigenvariable clashes, which regularity guarantees (source: dokumen.pub_an-introduction-to-proof-theory...pdf).

This last clause is the punchline and worth stating plainly: **cut → detour → normalization.** A cut in LJ does not translate to a clean NJ inference; it translates to a *detour* (an introduction of B immediately feeding an elimination of B). The detour is exactly what [normalization](./normalization-theorem.md) removes. So the two metatheorems line up perfectly — eliminating a cut on the sequent side *is* removing the detour its translation produces on the deduction side, which is why the page elsewhere calls cut-elimination and normalization "equivalent in content."

## Multiple-conclusion classical ND — an alternative framing

The page's framing throughout is: LK earns classical logic by letting the **succedent hold many formulas**, while [natural deduction](./natural-deduction.md) (NK) stays **single-conclusion**. The source flags, in a footnote to the NJ↔LJ translation, that this is not the only way to draw the classical/intuitionistic line — and the alternative is illuminating (source: dokumen.pub_an-introduction-to-proof-theory...pdf).

The relationship NJ ↔ LJ (single succedent both sides) is clean. The relationship **NK ↔ LK is messier** precisely because LK-sequents can carry more than one formula on the right while NK-deductions are still deductions of a *single* formula (source: dokumen.pub_an-introduction-to-proof-theory...pdf). The translation has to bridge that mismatch — e.g. the source's Problem 5.30 asks the reader to extend the translation to NK's classical absurdity rule (⊥ₖ) and observes that doing so *forces* the use of inferences that are LK but not LJ; that is where the extra succedent room is spent (source: dokumen.pub_an-introduction-to-proof-theory...pdf).

The reframing this suggests: **succedent multiplicity is the dial that turns intuitionistic logic into classical logic.** A single-conclusion classical natural deduction (NK) buys the same classical theorems by adding a *rule* (classical absurdity / double-negation), whereas the multi-succedent sequent calculus (LK) buys them *structurally*, by relaxing the `|Δ| ≤ 1` constraint that defines LJ (a constraint this page already traces through the ¬R rule). Same destination, two different knobs: NK turns a rule-knob, LK turns a structural-knob. Problems 5.33-5.35 in the source make this precise via the calculus **LJ + ¬¬** — intuitionistic sequents plus a double-negation rule — showing that the multi-succedent freedom of LK can be simulated by a single extra rule on otherwise-intuitionistic single-succedent sequents (source: dokumen.pub_an-introduction-to-proof-theory...pdf). This is the formal-logic root of the wiki's recurring observation that classical and intuitionistic systems share one architecture and differ only at a single commitment point — the same move the page's [cross-tradition-convergence-pattern](./cross-tradition-convergence-pattern.md) note records.

## The cut rule in detail

```
   Γ ⊢ Δ, C       C, Π ⊢ Λ
  ────────────────────────── cut
       Γ, Π ⊢ Δ, Λ
```

Intuitively: we proved "Γ implies (Δ or C)" and "C with Π implies Λ"; we conclude "Γ, Π implies (Δ or Λ)." The formula C is the *cut-formula* and disappears in the conclusion.

Cut is the formal expression of *using a lemma*. To prove the goal Γ, Π ⊢ Δ, Λ we first prove (and discard) the lemma C.

Cut is also the rule that *breaks the sub-formula property*: the cut-formula C can be *any* formula whatsoever — not necessarily a sub-formula of anything in Γ, Π, Δ, Λ. The whole point of [the Hauptsatz](./cut-elimination-hauptsatz.md) is that cut can always be removed, restoring the sub-formula property.

When cut is removed:
- Every formula in the proof is a sub-formula of the end-sequent.
- Proof search becomes decidable in the propositional case.
- Witness extraction works (for ∃ in LJ).
- Consistency follows by inspection (the empty sequent has no cut-free proof).

## Why the cut rule is included anyway

If cut can always be eliminated, why include it? Three reasons:

1. **Conceptual completeness**: cut formalizes lemma-use, which is how mathematicians actually argue. A calculus without cut is less natural.
2. **Proof brevity**: cut-free proofs can be *non-elementarily* longer than proofs with cut (Statman 1979). For practical proof representation, cut is essential.
3. **Categorical semantics**: cut corresponds to function composition in categorical models of logic. Removing it removes composition.

The Hauptsatz says cut is *theoretically* eliminable, not that it should be eliminated in every concrete proof.

## Connection to the wiki

- **[copi-introduction-to-logic](./copi-introduction-to-logic.md) Ch 9 conditional proof** is informally LJ's →R. Copi handles it informally; sequent calculus formalizes the management of conditional-proof assumptions through the antecedent.
- **[methods-of-mathematical-argument](./methods-of-mathematical-argument.md) (Zeitz)** treats direct proof / contradiction as macro-tactics. Sequent calculus exposes their micro-structure: direct = build the succedent; contradiction = build empty succedent from ¬-augmented antecedent.
- **[cross-tradition-convergence-pattern](./cross-tradition-convergence-pattern.md)** instance: classical (LK) and intuitionistic (LJ) traditions both yield sequent calculi with the same structure, differing only in succedent multiplicity. Same logic-architecture, different metaphysical commitments.

## Related pages

- [proof-theory-mancosu-galvan-zach](./proof-theory-mancosu-galvan-zach.md) — source textbook (Ch 5)
- [gentzens-proof-theory](./gentzens-proof-theory.md) — historical context
- [natural-deduction](./natural-deduction.md) — dual presentation of the same logic
- [cut-elimination-hauptsatz](./cut-elimination-hauptsatz.md) — the Hauptsatz
- [sub-formula-property](./sub-formula-property.md) — payoff of cut-elimination
- [normalization-theorem](./normalization-theorem.md) — ND analog of cut-elimination
- [consistency-of-peano-arithmetic](./consistency-of-peano-arithmetic.md) — uses cut-elimination on LK+arithmetic
- [godel-gentzen-translation](./godel-gentzen-translation.md) — proves Cl-PA conservative over Int-PA via the symmetric LJ translation
- [copi-introduction-to-logic](./copi-introduction-to-logic.md) · [methods-of-deduction](./methods-of-deduction.md) — informal-logic on-ramp
- production-reception-grammar-pair — social-pragmatic instance of left-right symmetry
- [glossary](./glossary.md) — Logic layer registrations
