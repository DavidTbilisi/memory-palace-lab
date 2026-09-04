---
palace: meta-knowledge
level: 8
domain: 10
room: 52
para: resource
semantic_mode: 5
wiki_source: wiki/logic/curry-howard-correspondence.md
---

# Curry-Howard Correspondence

**Summary**: The **Curry-Howard isomorphism** (also called the *propositions-as-types* or *proofs-as-programs* correspondence) is the discovery that a constructive logic and a typed functional programming language are *the same formal object* viewed from two sides: [propositions](./argument-anatomy.md) are types, proofs are programs, and proof-simplification is program-evaluation. It holds cleanly only for the **intuitionistic / constructive** fragment ([NJ](./natural-deduction.md) / [LJ](./sequent-calculus.md)); classical logic (NK / LK) breaks the plain correspondence and must be rescued with double-negation or continuation tricks. This is the math → programming bridge page, and the gateway to the type systems of Coq, Agda, and Haskell.

**Sources**:
- [Mancosu, Galvan, Zach (2021)](./proof-theory-mancosu-galvan-zach.md) §1.3 ("Proof theory after Gentzen", pp. 10–12) and Ch. 4 (Normal deductions) — primary source for this page.
- The §1.3 survey points the reader, for the propositions-as-types literature, to Wadler (2015) "Propositions as Types" and Sørensen & Urzyczyn (2006) *Lectures on the Curry-Howard Isomorphism*.

**Last updated**: 2026-06-10.

---

## The bridge in one sentence

Gentzen built [natural deduction](./natural-deduction.md) and the [sequent calculus](./sequent-calculus.md) to study certain *canonical* forms for proofs — proofs with no needless detours (source: dokumen.pub_an-introduction-to-proof-theory...pdf, §1.2). In the 1970s logicians discovered that this study of detour-free proofs is *literally* the study of how typed programs compute: "to every proof in normal form (i.e., without detours) there corresponds a functional in normal form and vice versa" (source: dokumen.pub_an-introduction-to-proof-theory...pdf, §1.3, p. 12). The correspondence was established "by means of the λ-calculus" — proofs are λ-terms, and stripping a proof's detours *is* running the program (source: dokumen.pub_an-introduction-to-proof-theory...pdf, §1.3, p. 12).

That single observation, generalized, is the Curry-Howard isomorphism. It is an *isomorphism*, not a loose analogy: the two structures are interchangeable line-for-line, so a theorem proved on the logic side is automatically a theorem on the programming side.

## The four-row correspondence (the core)

The whole bridge compresses into a four-row table mapping the logic column to the programming column — a four-row ladder in the spirit of the wiki's registered counted systems (see [skill-progression-stages](./skill-progression-stages.md) for the discipline of citing such ladders). The two-column table below *is* the Visual for this page.

| # | Logic side (proof theory) | Programming side (typed λ-calculus) |
|---|---------------------------|-------------------------------------|
| 1 | **Proposition** A | **Type** A |
| 2 | **Proof** of A | **Term / program** of type A |
| 3 | **Normalization** — detour / [cut](./cut-elimination-hauptsatz.md) elimination | **β-reduction** (evaluating the program) |
| 4 | **(Strong) normalization** — every proof reduces to a unique normal form, and the process terminates | **Type safety + termination** — well-typed programs don't go wrong and halt |

Reading the rows:

- **Row 1 (propositions = types).** Implication A → B is the function type A → B; conjunction A ∧ B is the product (pair) type; disjunction A ∨ B is the sum (tagged-union) type; ⊥ (falsum) is the empty type. A type is *inhabited* exactly when its proposition is *provable*.
- **Row 2 (proofs = programs).** Each [natural-deduction](./natural-deduction.md) inference rule is a term-former. Implication-introduction (discharge an assumption A, derive B, conclude A → B) is λ-abstraction; implication-elimination ([modus ponens](./logic-atomic-design.md)) is function application. A proof tree *is* a typed program's syntax tree.
- **Row 3 (normalization = β-reduction).** A *detour* — introducing a connective only to immediately eliminate it — is exactly a *redex*: a λ-abstraction applied to an argument, `(λx.t) u`. Removing the detour (the [normalization](./normalization-theorem.md) conversion) is performing the β-reduction `(λx.t) u → t[u/x]`. Gentzen's [cut-elimination](./cut-elimination-hauptsatz.md) in the sequent calculus is the same move expressed in the [LJ](./sequent-calculus.md) presentation.
- **Row 4 (strong normalization = type safety / termination).** The proof-theoretic fact that normalization *always terminates* and lands on a unique normal form (source: dokumen.pub_an-introduction-to-proof-theory...pdf, Ch. 4) becomes, on the programming side, the guarantee that every well-typed program halts and never reaches a stuck (type-error) state. The [sub-formula property](./sub-formula-property.md) of normal proofs is the static-analysis fact that a normal program mentions no types beyond those in its interface.

## The intuitionistic caveat (read this before using the bridge)

The plain correspondence is **constructive only**. It maps the intuitionistic systems NJ / LJ onto the standard typed λ-calculus, because a constructive proof already *is* a construction — an algorithm — and that is what a program is.

Classical logic (NK / LK) does **not** fit the plain table. Principles such as excluded middle (A ∨ ¬A) and double-negation elimination (¬¬A → A) assert *that* a proof exists without exhibiting the construction, so they have no direct program reading. Two repairs are standard, and they are repairs, not the original isomorphism:

1. **Gödel-Gentzen double-negation translation.** Translate the classical proposition into an intuitionistically-provable one, then apply Curry-Howard to the translated (constructive) proof. Mancosu, Galvan, and Zach cover exactly this translation of classical into intuitionistic logic as a structural-proof-theory result (source: dokumen.pub_an-introduction-to-proof-theory...pdf, Preface / §2). This is the wiki's [Gödel-Gentzen translation](./godel-gentzen-translation.md).
2. **Continuations (control operators).** Extend the λ-calculus with call/cc-style control; classical axioms then correspond to operators that capture and reinstate the evaluation context. The bridge survives, but the programming side now needs first-class continuations.

The headline to keep: **constructive logic ≅ ordinary typed programs; classical logic needs a detour through translation or continuations.** Stating the correspondence without the caveat is the single most common way to get it wrong.

## Why this matters — the gateway

Because proofs *are* programs, a proof checker *is* a type checker, and a programming language with a rich enough type system *is* a proof assistant:

- **Coq** and **Agda** are dependently-typed languages built directly on the correspondence: you write a program whose *type is the theorem*, and the type checker verifies it as a proof.
- **Haskell**'s type system is a (weaker, non-dependent) instance: many type-level guarantees are propositions that the compiler discharges as proofs.
- The discipline flows back the other way too: termination-checking a total-functional language is the programming-side face of proving strong normalization.

This page is therefore the hinge between the wiki's logic cluster and its programming cluster — it tells you that the type-system concept-space and [Gentzen's proof theory](./gentzens-proof-theory.md) are not two subjects but one.

## Relation to proof-theoretic semantics

The correspondence is the operational backbone of [proof-theoretic semantics](./proof-theoretic-semantics.md): if the *meaning* of a connective is its rules of use, and those rules *are* term-formers, then the meaning of a proposition is the set of programs that inhabit its type. Harmony between introduction and elimination rules is the logic-side statement that evaluation (β-reduction) neither loses nor invents information — the same content as type safety.

## Mnemonic

**PTNT** — *Propositions, Terms, Normalize, Terminate* — read aloud as **"Pretend it":**

> **P**ropositions are types · proofs are **T**erms · **N**ormalization is β-reduction · strong **N**ormalization is **T**ermination.

And the guard-rail rhyme for the caveat: **"Constructive fits; classical needs a translate-or-continuation trick."**

## Memory checksum

If you can answer these in <60 s each from memory, the page is encoded:

1. State the four rows of the correspondence in order. (*Propositions = types · proofs = terms/programs · normalization (detour/cut elimination) = β-reduction · strong normalization = type safety + termination.*)
2. What logical fragment does the *plain* correspondence cover, and why not the rest? (*Intuitionistic / constructive (NJ, LJ) — a constructive proof is already an algorithm. Classical NK/LK fails because excluded middle and double-negation elimination assert a proof exists without building it, so they have no direct program.*)
3. What is a *detour* on the programming side? (*A redex — a λ-abstraction applied to an argument `(λx.t) u`; eliminating the detour is the β-reduction `t[u/x]`.*)
4. Name the two repairs that recover a classical reading. (*The [Gödel-Gentzen](./godel-gentzen-translation.md) double-negation translation; continuations / control operators.*)
5. Name two systems that are simultaneously programming languages and proof assistants because of this. (*Coq, Agda — also Haskell as a weaker instance.*)
6. Why is it an *isomorphism* and not an analogy? (*The two structures are interchangeable line-for-line: each inference rule is a term-former, each proof tree is a typed program's syntax tree, so a theorem on one side is automatically a theorem on the other.*)

## Related pages

- [normalization-theorem](./normalization-theorem.md) — the proof-theory side of Row 3/4; detour elimination *is* β-reduction.
- [cut-elimination-hauptsatz](./cut-elimination-hauptsatz.md) — the [sequent-calculus](./sequent-calculus.md) presentation of the same normalization move.
- [natural-deduction](./natural-deduction.md) — the inference rules that become the term-formers (λ-abstraction, application, pairing).
- [sequent-calculus](./sequent-calculus.md) — LJ (intuitionistic) is the fragment that maps cleanly; LK (classical) needs the repairs.
- [sub-formula-property](./sub-formula-property.md) — the static-analysis face of normal-form proofs/programs.
- [proof-theoretic-semantics](./proof-theoretic-semantics.md) — meaning-as-use, of which proofs-as-programs is the operational backbone.
- [gentzens-proof-theory](./gentzens-proof-theory.md) — Gentzen built the normal-form machinery the correspondence rides on.
- [godel-gentzen-translation](./godel-gentzen-translation.md) — the classical → intuitionistic translation that rescues the classical case.
- programming-language-type-system-space — the programming-cluster page this bridges into.
- [proof-theory-mancosu-galvan-zach](./proof-theory-mancosu-galvan-zach.md) — source text (§1.3, Ch. 4).
