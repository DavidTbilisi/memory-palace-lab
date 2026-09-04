---
palace: meta-knowledge
level: 7
domain: 10
room: 25
semantic_mode: 5
wiki_source: wiki/logic/methods-of-deduction.md
---

# Methods of Deduction (Copi Ch 9 + Ch 10)

**Summary**: [Copi](./copi-introduction-to-logic.md)'s natural-deduction system for propositional and predicate logic — **19 atomic rules** (9 elementary inference rules + 10 replacement rules) + **conditional proof** + **reductio ad absurdum** + **4 quantification rules** (UI · UG · EI · EG). The Organism-tier pipeline in [logic-atomic-design](./logic-atomic-design.md) that turns the [truth-function](./truth-function-machine.md) atoms into a working *derivational* system — Copi's answer to: *given premises P₁, P₂, …, Pₙ, derive the conclusion C by a chain of inference rules*. Sister to [Zeitz's 4 strategy-level methods](./methods-of-mathematical-argument.md) (direct · contradiction · induction-standard · induction-strong) — the Zeitz methods *compose from* Copi's atomic rules.

**Sources**:
- [Copi/Cohen/McMahon](./copi-introduction-to-logic.md) *Introduction to Logic* 14th ed, Ch 9 *Methods of Deduction* + Ch 10 *Quantification Theory*.
- Gentzen 1934 *Untersuchungen über das logische Schließen* — the original natural-deduction system; Copi's presentation is the standard pedagogical version.
- [truth-function-machine](./truth-function-machine.md) — the propositional substrate; Copi's deduction is the *derivational* counterpart to truth-table evaluation.
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — sister at the strategy tier; Zeitz's 4 methods compose from these atoms.

**Last updated**: 2026-05-25

---

## One-line

> 19 atomic rules + conditional proof + reductio. Each rule has a *form* (a premise pattern) and produces a specific conclusion. Chain rules → derive any propositional-logic conclusion from any valid premises.

## Unlocks (lead, not footer)

1. **Atom-tier registry for the wiki's deductive substrate.** [logic-atomic-design](./logic-atomic-design.md) §Atoms→Rules registers all 19 deduction rules. This page is the *owner* — each rule has form, when-it-fires, and a worked example. The wiki's "Validity-Test Reflex" ([validity-vs-soundness](./validity-vs-soundness.md)) on deductive arguments works by chaining these rules; not chaining = guess + counterexample.

2. **The atoms beneath Zeitz's strategy methods.** [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) names 4 strategy-tier proof methods (Direct · Contradiction · Standard Induction · Strong Induction). Each *composes from* Copi's atomic rules: a direct proof is a chain of MP/MT/HS/DS + replacement rules; a contradiction proof adds the reductio strategy; induction adds UI/UG plus the induction principle. **Owning the atoms makes the strategies operationable rather than gestural.**

3. **The 10 replacement rules are bidirectional.** Unlike the 9 inference rules (which fire on *whole-line patterns*), replacement rules let you substitute one proposition for an equivalent one *anywhere* — including in subexpressions of a complex line. This bidirectional substitutability is what makes natural deduction more *practical* than truth-table validity-checking for arguments with 5+ atomic propositions (where 32+ truth-table rows become unwieldy).

4. **Conditional proof + reductio close the loop.** Without CP and RA, the 19 rules can derive most simple conclusions but stumble on hypothetical reasoning ("if P, then Q") and existence proofs. CP introduces the *sub-proof* (assume P, derive Q, discharge to P → Q); RA introduces the *contradiction strategy* (assume ¬conclusion, derive ⊥, discharge to conclusion). With these two strategies + the 19 rules, the system is **complete for propositional logic** (every truth-functional tautology is derivable).

## Mnemonic

**9 + 10 + 2 + 4** = *9 inference · 10 replacement · 2 strategies (CP + RA) · 4 quantification.*

For the 9 elementary rules: **MP-MT-HS-DS · CD-DD · S-C-A** = *[Modus Ponens](./per-rule-modus-ponens.md) · [Modus Tollens](./per-rule-modus-tollens.md) · [Hypothetical Syllogism](./per-rule-hypothetical-syllogism.md) · Disjunctive Syllogism · Constructive Dilemma · Destructive Dilemma · Simplification · Conjunction · Addition.*

For the 10 replacement rules: **DeM · Comm · Assoc · Dist · DN · Trans · Impl · Equiv · Exp · Taut** = *De Morgan · Commutation · Association · Distribution · Double Negation · Transposition · Implication · Equivalence · Exportation · Tautology.*

For the 4 quantification rules: **UI · UG · EI · EG** = *Universal Instantiation · Universal Generalization · Existential Instantiation · Existential Generalization.*

## Memory checksum

If you can answer these in <60 s each from memory, the page is encoded:

1. **State MP and its dark twin.** (MP: *P → Q; P; ∴ Q* — valid. Affirming the consequent: *P → Q; Q; ∴ P* — invalid.)
2. **State De Morgan's two laws.** (¬(P ∧ Q) ≡ ¬P ∨ ¬Q · ¬(P ∨ Q) ≡ ¬P ∧ ¬Q.)
3. **Define conditional proof.** (To prove P → Q, assume P as a hypothesis in a sub-proof, derive Q within the sub-proof, then discharge the sub-proof to conclude P → Q in the parent proof.)
4. **Define reductio ad absurdum.** (To prove C, assume ¬C as a hypothesis, derive a contradiction (P ∧ ¬P), discharge the sub-proof to conclude C via ¬¬C → C.)
5. **State the 4 quantification rules briefly.** (UI: ∀x.Fx ⟹ Fa for any constant a. UG: Fa ⟹ ∀x.Fx if a was arbitrary. EI: ∃x.Fx ⟹ Fa for a *new* constant a. EG: Fa ⟹ ∃x.Fx.)

## Visual — the 19 rules at a glance

**9 elementary inference rules** (whole-line patterns):

| Rule | Premise pattern | Conclusion |
|---|---|---|
| MP | P → Q ; P | ∴ Q |
| MT | P → Q ; ¬Q | ∴ ¬P |
| HS | P → Q ; Q → R | ∴ P → R |
| DS | P ∨ Q ; ¬P | ∴ Q |
| CD | (P → Q) ∧ (R → S) ; P ∨ R | ∴ Q ∨ S |
| DD | (P → Q) ∧ (R → S) ; ¬Q ∨ ¬S | ∴ ¬P ∨ ¬R |
| Simp | P ∧ Q | ∴ P |
| Conj | P ; Q | ∴ P ∧ Q |
| Add | P | ∴ P ∨ Q |

**10 replacement rules** (bidirectional, substitutable anywhere):

| Rule | Equivalence |
|---|---|
| DeM | ¬(P ∧ Q) ≡ ¬P ∨ ¬Q ; ¬(P ∨ Q) ≡ ¬P ∧ ¬Q |
| Comm | P ∧ Q ≡ Q ∧ P ; P ∨ Q ≡ Q ∨ P |
| Assoc | P ∧ (Q ∧ R) ≡ (P ∧ Q) ∧ R ; P ∨ (Q ∨ R) ≡ (P ∨ Q) ∨ R |
| Dist | P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R) ; dual |
| DN | P ≡ ¬¬P |
| Trans | P → Q ≡ ¬Q → ¬P |
| Impl | P → Q ≡ ¬P ∨ Q |
| Equiv | P ↔ Q ≡ (P → Q) ∧ (Q → P) ; ≡ (P ∧ Q) ∨ (¬P ∧ ¬Q) |
| Exp | (P ∧ Q) → R ≡ P → (Q → R) |
| Taut | P ≡ P ∨ P ; P ≡ P ∧ P |

**2 proof strategies**:

| Strategy | Form |
|---|---|
| CP | Assume P; …derive Q; ∴ P → Q |
| RA | Assume ¬C; …derive contradiction; ∴ C |

**4 quantification rules** (Copi Ch 10):

| Rule | Form | Restriction |
|---|---|---|
| UI | ∀x.Fx ⟹ Fa | a any constant |
| UG | Fa ⟹ ∀x.Fx | a must be arbitrary |
| EI | ∃x.Fx ⟹ Fa | a a new constant |
| EG | Fa ⟹ ∃x.Fx | any constant a |

The 19 rules + 2 strategies are **complete for propositional logic**; adding the 4 quantification rules makes the system complete for first-order predicate logic.

---

## The 9 elementary inference rules

These fire on *whole-line patterns* — you can apply them only when a previous line in the proof matches the rule's premise pattern.

### Modus Ponens (MP)

```
Premise pattern:    P → Q
                    P
Conclusion:         ∴ Q
```

The first valid argument form Chrysippus (c. 250 BCE) cataloged. **The most-used rule in natural deduction**, and the one most commonly confused with [affirming the consequent](./fallacy-taxonomy.md) (*P → Q; Q; ∴ P* — invalid). Full treatment on [per-rule-modus-ponens](./per-rule-modus-ponens.md).

### Modus Tollens (MT)

```
Premise pattern:    P → Q
                    ¬Q
Conclusion:         ∴ ¬P
```

The contrapositive of MP. Drives reductio strategy (assume hypothesis; show its consequence is false; conclude hypothesis is false). Mirror invalid form: [denying the antecedent](./fallacy-taxonomy.md) (*P → Q; ¬P; ∴ ¬Q* — invalid). Full treatment on [per-rule-modus-tollens](./per-rule-modus-tollens.md).

### Hypothetical Syllogism (HS)

```
Premise pattern:    P → Q
                    Q → R
Conclusion:         ∴ P → R
```

Conditional chaining. The valid form analog of categorical Barbara: chain conditionals through. Full treatment on [per-rule-hypothetical-syllogism](./per-rule-hypothetical-syllogism.md).

### Disjunctive Syllogism (DS)

```
Premise pattern:    P ∨ Q
                    ¬P
Conclusion:         ∴ Q
```

Elimination by negation. The premise *"either P or Q"* combined with *"not P"* yields Q.

### Constructive Dilemma (CD)

```
Premise pattern:    (P → Q) ∧ (R → S)
                    P ∨ R
Conclusion:         ∴ Q ∨ S
```

Two conditionals + a disjunction of antecedents → disjunction of consequents.

### Destructive Dilemma (DD)

```
Premise pattern:    (P → Q) ∧ (R → S)
                    ¬Q ∨ ¬S
Conclusion:         ∴ ¬P ∨ ¬R
```

Mirror of CD via MT applied to each conditional.

### Simplification (Simp)

```
Premise pattern:    P ∧ Q
Conclusion:         ∴ P
```

(Or ∴ Q.) Conjunction-elimination.

### Conjunction (Conj)

```
Premise pattern:    P
                    Q
Conclusion:         ∴ P ∧ Q
```

Conjunction-introduction. The "and" rule.

### Addition (Add)

```
Premise pattern:    P
Conclusion:         ∴ P ∨ Q
```

Disjunction-introduction. Any P proves P ∨ anything; useful as a step toward DS or CD.

## The 10 replacement rules

Unlike inference rules, replacement rules are **bidirectional** and apply **inside subexpressions**. If P ≡ Q is a replacement rule and Q appears anywhere (even nested), you can substitute P, and vice versa.

### De Morgan's Laws (DeM)

```
¬(P ∧ Q)  ≡  ¬P ∨ ¬Q
¬(P ∨ Q)  ≡  ¬P ∧ ¬Q
```

Negation distributes over conjunction/disjunction by *flipping* the connective. The single most-useful replacement rule in non-trivial derivations.

### Commutation (Comm) · Association (Assoc) · Distribution (Dist) · Double Negation (DN) · Transposition (Trans) · Implication (Impl) · Equivalence (Equiv) · Exportation (Exp) · Tautology (Taut)

See the visual table above; each is a standard propositional equivalence used to rewrite subexpressions into more-useful forms.

The full set of 10 is **complete enough** that, together with the 9 inference rules + CP + RA, every truth-functional tautology is derivable.

## The two proof strategies

### Conditional Proof (CP)

When the target conclusion is a conditional *P → Q*, you can:

1. Open a **sub-proof** by assuming P.
2. Derive Q within the sub-proof using any rules.
3. Close the sub-proof and **discharge** the assumption: conclude P → Q in the parent proof.

CP is essential for deriving conditionals when the consequent doesn't appear in the existing premises. Without CP, the 19 rules can prove some conditionals (via Impl + Add + Simp tricks) but not all.

### Reductio ad Absurdum (RA)

When you want to prove C and the direct derivation is stuck:

1. Open a sub-proof by assuming ¬C.
2. Derive a contradiction P ∧ ¬P (for some P) within the sub-proof.
3. Discharge the assumption: conclude ¬¬C in the parent proof.
4. By DN, ¬¬C ≡ C, so ∴ C.

RA is the operational form of [Zeitz's Argument by Contradiction](./methods-of-mathematical-argument.md). The strategy is the same; the atoms-level Copi rules supply the *steps inside* the contradiction derivation.

## The 4 quantification rules (Ch 10)

### Universal Instantiation (UI)

```
∀x.Fx
─────
∴ Fa     (for any specific constant a)
```

From "for all x, Fx" infer Fa for any particular a. Drops the universal.

### Universal Generalization (UG)

```
Fa
─────
∴ ∀x.Fx  (if a was arbitrary — not specifically defined to satisfy F)
```

If you proved Fa for an *arbitrary* a (no special properties), conclude ∀x.Fx. **The arbitrariness restriction is load-bearing**: if a was introduced by EI (existential instantiation), it has special properties and UG cannot fire on it.

### Existential Instantiation (EI)

```
∃x.Fx
─────
∴ Fa     (where a is a NEW constant — never used in the proof before)
```

From "there exists an x such that Fx" introduce a name *a* for that x. **The new-constant restriction is load-bearing**: re-using an existing name might collide with prior facts.

### Existential Generalization (EG)

```
Fa
─────
∴ ∃x.Fx  (for any specific constant a)
```

From Fa infer ∃x.Fx. The "weakening" direction: if a particular a is F, certainly *some* x is F.

The four rules together (with the restrictions) make first-order predicate logic derivable. The restrictions on UG and EI are the load-bearing safety constraints; violating them produces invalid arguments.

## Worked example — Modus Tollens chain

Prove: *(A → B) ∧ (B → C); ¬C ⊢ ¬A.*

```
1.  (A → B) ∧ (B → C)       Premise
2.  ¬C                       Premise
3.  A → B                    1, Simp
4.  B → C                    1, Simp
5.  A → C                    3, 4, HS
6.  ¬A                       5, 2, MT
∴   ¬A
```

Six lines using Simp + HS + MT. The structure of the derivation *is* the proof.

## Worked example — Conditional Proof

Prove: *A → B ⊢ ¬B → ¬A.* (Transposition, derived without using Trans replacement rule.)

```
1.  A → B                    Premise
2.  | ¬B                     Assume (for CP)
3.  | | A                    Assume (for inner CP / RA?)
4.  | | B                    1, 3, MP
5.  | | B ∧ ¬B               4, 2, Conj                  ← contradiction!
6.  | ¬A                     3-5, RA
7.  ¬B → ¬A                  2-6, CP
∴   ¬B → ¬A
```

Outer CP discharges the assumption ¬B → ¬A. Inner RA discharges the assumption A → contradiction → ¬A. Both strategies cooperate.

## Completeness

The 19 rules + CP + RA form a **complete system for propositional logic**:

> **Theorem** (Gödel completeness theorem, 1929 — for first-order logic; analog for propositional logic is standard). *Every truth-functional tautology is derivable from the 19 rules + CP + RA. Every truth-functional valid argument is derivable from its premises using these rules.*

With the 4 quantification rules (UI, UG, EI, EG), the system extends to first-order predicate logic; Gödel's *first* major result (the 1929 completeness theorem) shows this extension remains complete.

But *complete for first-order logic* is not *complete for arithmetic-augmented systems* — that's what Gödel's 1931 *incompleteness* theorems show (the "negative Gödel"). See [godels-incompleteness](./godels-incompleteness.md) for the limit.

## Cross-link to [Zeitz's 4 strategy methods](./methods-of-mathematical-argument.md)

| Zeitz strategy method | Copi atoms it composes from |
|---|---|
| **Direct deduction** | MP, MT, HS, DS, Conj, Add, Simp + 10 replacement rules |
| **Argument by contradiction** | All Direct atoms + RA strategy |
| **Standard induction** | Direct atoms + UI/UG/EI/EG + the Peano induction axiom (added at the theory level) |
| **Strong induction** | Standard induction + the strong-induction principle (use ALL P(k), k ≤ n, not just P(n)) |

The Zeitz methods name *strategies*; Copi names *atomic moves*. Strategy = sequence of atoms in a particular shape. **The 4 Zeitz methods are 4 ways of organizing Copi atoms into longer derivations.**

## METER integration

| Drill | Pass floor | Source | Owner |
|---|---|---|---|
| Apply MP / MT / HS / DS reflexively | <8 s each, ≥95% | Copi Ch 9 single-line drills | this page |
| Apply DeM bidirectionally | <15 s, ≥90% | Copi Ch 9 replacement drills | this page |
| Construct a 3-5 step propositional derivation | <120 s | Copi Ch 9 short proofs | this page |
| Identify when CP is required (target = conditional) | <15 s | Copi Ch 9 proof set-up | this page |
| Identify when RA is the strategy (direct stuck) | <30 s | Copi Ch 9 proof set-up | this page |
| Apply UI / EG correctly | <15 s, ≥95% | Copi Ch 10 exercises | this page |
| Avoid UG / EI restriction violations | <30 s per check | Copi Ch 10 restriction examples | this page |

## Not to be confused with "Holmesian deduction"

The colloquial "deduction" of Sherlock Holmes — and of [Konnikova's *Mastermind*](./observation-before-deduction.md) — is **not** this system. What Holmes calls deduction is mostly **abduction / inference to the best explanation** (reasoning from observed effects to their most likely cause), which is *ampliative* and *defeasible* — the conclusion can be wrong even when the premises are true. Konnikova's own endnote 3 concedes this. (source: Maria Konnikova - Mastermind How to Think Like Sherlock Holmes - 2013.epub)

Copi's natural deduction here is the opposite: **truth-preserving** — if the premises hold and the rules are applied correctly, the conclusion *cannot* be false. Keep the two senses of "deduction" separate: the [observation-before-deduction](./observation-before-deduction.md) page owns the observational/abductive discipline; this page owns the formal, truth-preserving one. They are complementary skills, not the same operation under one word.

## Related pages

- [copi-introduction-to-logic](./copi-introduction-to-logic.md) — source textbook (Ch 9 + Ch 10)
- [observation-before-deduction](./observation-before-deduction.md) — the *observational/abductive* sense of "deduction" (Konnikova/Holmes); disambiguated above
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — sister page at the strategy tier (Zeitz)
- [truth-function-machine](./truth-function-machine.md) — propositional substrate; truth-tables are the *semantic* validity-test; this page is the *derivational* validity-test
- [validity-vs-soundness](./validity-vs-soundness.md) — what the derivations are testing for
- [fallacy-taxonomy](./fallacy-taxonomy.md) §Formal — the two dark twins (affirming consequent, denying antecedent) that mirror MP and MT
- [godels-incompleteness](./godels-incompleteness.md) — the limit: this system is complete for first-order logic; not for arithmetic-augmented systems
- [categorical-syllogism](./categorical-syllogism.md) — the Aristotelian sister (categorical-logic deduction)
- [logic-atomic-design](./logic-atomic-design.md) — Atom-tier registry; this page is the owner of the 23 Rules-family atoms
- [glossary](./glossary.md) — Logic layer registration
