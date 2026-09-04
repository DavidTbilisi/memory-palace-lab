---
palace: meta-knowledge
level: 8
domain: 10
room: 23
wiki_source: wiki/logic/truth-function-machine.md
---

# Truth-Function Machine (TLP 5–6)

**Summary**: Wittgenstein's central technical machinery in [TLP](./tractatus-logico-philosophicus.md) propositions 5–6. *Every proposition is a truth-function of elementary propositions* (TLP 5); the *general form of a truth-function* (TLP 6) is *[p̄, ξ̄, N(ξ̄)]* — the recursive operation of applying joint negation (N, the Sheffer-stroke-equivalent) to a selection of propositions and iterating. **TLP 4.31 contains the first published truth-table** — the notation that now appears in every introductory logic textbook (including [Copi](./copi-introduction-to-logic.md) Ch 8). The machinery survives intact for the propositions it covers; **Gödel 1931 proved it doesn't cover all propositions** of arithmetic-augmented systems. Picture theory (TLP 2–4) survives; the truth-function *reduction* of TLP 5 does not.

**Sources**:
- [Wittgenstein TLP](./tractatus-logico-philosophicus.md) (1921 German / 1922 English), propositions 4.3 – 4.46, 5 – 5.476, 6 – 6.13.
- Henry Sheffer (1913), "A Set of Five Independent Postulates for Boolean Algebras", *Transactions of the American Mathematical Society* 14, 481–488 — the Sheffer stroke; the foundation Wittgenstein generalized to the N-operator.
- [Copi](./copi-introduction-to-logic.md) Ch 8 — the modern textbook treatment of truth-tables.
- [godels-incompleteness](./godels-incompleteness.md) — what demolished TLP 5's scope claim.

**Last updated**: 2026-05-25

---

## One-line

> TLP 5: *every proposition is a truth-function of elementary propositions*.
> TLP 6: the general form is *[p̄, ξ̄, N(ξ̄)]* — apply joint negation, iterate.
> TLP 4.31: the first truth-table in published mathematics.

## Unlocks (lead, not footer)

1. **Wittgenstein literally invented the truth-table.** TLP 4.31 prints the two-, four-, and eight-row matrices for compound propositions of one, two, three elementary propositions. The notation that now appears in every logic textbook *originated here*, in 1921 German, as a proof move — Wittgenstein presents the truth-table as a *picture* (per picture theory) of the logical form of the compound proposition. Pedagogically, the truth-table is *the* canonical example of show-vs-say: it *displays* the truth-functional dependency without *asserting* it.

2. **The N-operator unifies all connectives.** Modern logic uses ∧, ∨, →, ¬, ↔ as separate connectives. Wittgenstein shows that *one* operation — N(ξ̄), joint negation ("neither of these") — generates all of them by repeated application. ¬p = N(p); p ∧ q = N(N(p), N(q)); p ∨ q = N(N(p, q)); and so on. The Sheffer stroke (NAND) does the same; Wittgenstein's N is its more-general sibling. **One connective is enough.** This is the most-compressed possible expressive basis for propositional logic.

3. **What survives Gödel.** The truth-function machine *correctly* describes how truth-values compose for *truth-functional* compound propositions. It *does not* describe all propositions of arithmetic-augmented systems (Gödel's G is not in its scope). The mistake is not the machinery; it's the scope claim of TLP 5 (*all* propositions). Picture theory survives; the truth-function machine survives in its proper scope; the universal-reduction claim doesn't.

4. **Truth-tables as TLP-picture-theory operationalized.** A truth-table is itself a *picture* in TLP's strict sense: its elements (rows, columns, T/F cells) correspond to the logical structure of the compound proposition; the *form* of the truth-table is the *logical form* of the compound. This is why truth-tables are pedagogically irreplaceable: they *show* what the prose explanation can only *say*.

## Mnemonic

**TLP 5 = ALL** · **TLP 6 = N** · **TLP 4.31 = the table**

- **5** (one digit): *all* propositions are truth-functions.
- **6** (one digit): the general form is *N* applied recursively.
- **4.31** (the table number): the truth-table notation invented.

Three numbers, three claims. The whole truth-function machine compresses to *5 → 6 → 4.31*.

## Memory checksum

If you can answer these in <60 s each from memory, the page is encoded:

1. **State TLP 5.** (*A proposition is a truth-function of elementary propositions.*)
2. **State TLP 6's general form.** (*[p̄, ξ̄, N(ξ̄)]* — the result of taking any selection of elementary propositions, applying N to that selection, and iterating.)
3. **Where was the first truth-table published?** (TLP 4.31, Wittgenstein 1921 German / 1922 English.)
4. **State the N-operator.** (N(ξ̄) = joint negation of the propositions in ξ̄; the proposition that is true iff *none* of the ξ̄ are true.)
5. **What did Gödel prove about TLP 5?** (Gödel's first incompleteness theorem produces a true proposition G — about arithmetic — that is *not* a truth-function of the elementary propositions of the system. So TLP 5's universal claim is false for arithmetic-augmented systems. The machinery survives in its proper scope; the universal-reduction claim doesn't.)

## Visual — the truth-table for the four basic connectives

**Original Wittgenstein truth-table form (TLP 4.31)**:

| p | q | p∧q | p∨q | p→q | p↔q |
|---|---|---|---|---|---|
| T | T | T | T | T | T |
| T | F | F | T | F | F |
| F | T | F | T | T | F |
| F | F | F | F | T | T |

**The N-operator generates them all**:

- ¬p = N(p) — negation
- p∧q = N(N(p), N(q)) — conjunction
- p∨q = N(N(p, q)) — disjunction
- p→q = N(p, N(q)) — implication, equivalent to ¬p ∨ q
- p↔q = N(N(p, N(q)), N(N(p), q)) — biconditional

**The general form of proposition (TLP 6)**:

> [p̄, ξ̄, N(ξ̄)]

where p̄ = all elementary propositions, ξ̄ = any set of propositions, N = joint negation.

Every proposition of propositional logic is in the orbit of N applied to elementary propositions. The truth-table *displays* the resulting truth-functional dependency; the N-operator *generates* it.

---

## TLP 4.3–4.46 — the construction of the truth-table

The propositions of TLP that develop the truth-table:

| TLP # | Proposition (compressed) |
|---|---|
| 4.3 | Truth-possibilities of elementary propositions = the conditions of truth and falsehood of compound propositions |
| 4.31 | The truth-possibilities can be displayed in schemata of the following kind (truth-table follows) |
| 4.4 | A proposition is the expression of agreement and disagreement with truth-possibilities |
| 4.41 | The truth-possibilities of the elementary propositions are the conditions of the truth and falsehood of the propositions |
| 4.42 | A proposition's possibilities of agreement/disagreement = the proposition's truth-conditions |
| 4.43 | Agreement with truth-possibilities can be expressed by coordinating their truth-table marks with the proposition |
| 4.431 | The expression of agreement and disagreement with the truth-possibilities of elementary propositions is the proposition's truth-conditions |
| 4.46 | Two extreme cases: agreement with *all* truth-possibilities = **tautology**; agreement with *no* truth-possibilities = **contradiction** |
| 4.461 | Tautology and contradiction are senseless (sinnlos) but not nonsensical (unsinnig) — they say nothing about the world |
| 4.464 | Tautology is true for all truth-possibilities; contradiction is false for all |
| 4.466 | A determinate logical combination of *signs* corresponds to a determinate logical combination of *meanings*; lack of combination = lack of meaning |

TLP 4.46 is load-bearing: **tautologies and contradictions are limit cases**. They are not propositions in the world-describing sense; they are the boundaries of the logical space. Cross-link: TLP 6.1 — *the propositions of logic are tautologies*.

## TLP 5 — the universal claim

> *A proposition is a truth-function of elementary propositions.* — TLP 5

This is the load-bearing reductionist claim. Every proposition reduces to a function of elementary propositions; the function is determined entirely by the truth-values of those elementary propositions.

Consequences (TLP 5.0+):

- **5.01** Elementary propositions are the truth-arguments of propositions.
- **5.101** All propositional functions (truth-functions) can be enumerated as truth-tables.
- **5.1311** When we infer *q* from *p ∨ q* and *¬p*, the form of the truth-function is hidden by the notation; if we wrote out the truth-table, the inference would be transparent.
- **5.4** There are no "logical objects" — logic is not a domain populated by mysterious entities; it is the form propositions share with each other and with the world.
- **5.43** From an atomic fact, *no* other atomic fact follows — atomic facts are logically independent.

## TLP 6 — the general form

> *The general form of a truth-function is [p̄, ξ̄, N(ξ̄)].* — TLP 6

The notation:
- **p̄** = the totality of elementary propositions.
- **ξ̄** = any selection of propositions (already constructed at some stage).
- **N(ξ̄)** = the joint negation of all propositions in ξ̄ ("none of these").

The procedure:
1. Start with elementary propositions p̄.
2. Apply N to a selection — get new propositions.
3. Apply N again to a selection of the propositions now available (including originals).
4. Iterate.

Every truth-function is reachable by this procedure. TLP 6's notation is the recursive *generation rule* for the entire space of truth-functional propositions.

Consequences (TLP 6.0+):

- **6.1** The propositions of logic are tautologies.
- **6.11** Tautologies say nothing — they are analytical.
- **6.12** Logical propositions show that they are tautologies.
- **6.13** Logic is not a theory but a reflection of the world.

## The N-operator vs the Sheffer stroke

| | Sheffer stroke (1913) | TLP N-operator (1921) |
|---|---|---|
| Notation | p \| q | N(ξ̄) |
| Reading | "not both p and q" (NAND) | "none of the ξ̄" (joint denial / NOR-generalized) |
| Arity | Binary | Variadic (any number of arguments) |
| Generates | All truth-functions of binary inputs | All truth-functions of any inputs |
| Wittgenstein's claim | (he cites Sheffer) | "more general than Sheffer's" |

Russell's introduction to TLP credits Sheffer explicitly: *"It has been shown by Dr. Sheffer (Trans. Am. Math. Soc., Vol. XIV. pp. 481–488) that all truth-functions of a given set of propositions can be constructed out of either of the two functions 'not-p or not-q' or 'not-p and not-q'. Wittgenstein makes use of the latter…"*. Wittgenstein generalizes from binary to variadic, which is what makes the recursive *[p̄, ξ̄, N(ξ̄)]* form possible.

## What Gödel did

Gödel's first incompleteness theorem (1931) demolishes TLP 5's *scope* (not its machinery):

- **TLP 5 says**: *every proposition* is a truth-function of elementary propositions.
- **Gödel produces**: a proposition G of arithmetic-augmented logic that is *not* a truth-function of the elementary propositions of the system — G asserts its own unprovability via arithmetical encoding.
- **Conclusion**: TLP 5's universal claim fails for arithmetic-augmented systems. The truth-function machinery is *correct in its scope* (truth-functional propositional logic) but does not cover propositions like G.

What survives:
- **TLP 4.31's truth-table notation**: alive in every logic textbook.
- **TLP 6's recursive generation**: correct for the truth-functions it generates.
- **TLP 4.46's tautology/contradiction limit cases**: alive in modern propositional logic.
- **Picture theory** (TLP 2–4): unaffected by Gödel.

What dies:
- **TLP 5's universal-reduction claim**: false post-Gödel.
- **TLP 6's claim that *all* propositions live in the N-orbit**: false post-Gödel.

The wiki's stance: cite TLP 4.31 + 4.46 + 6 as canonical for *propositional* logic; use [Copi](./copi-introduction-to-logic.md) Ch 8 + Ch 10 + [godels-incompleteness](./godels-incompleteness.md) for the broader picture.

## Tautology and contradiction as TLP's "limit cases"

TLP 4.46 introduces two propositions that are *senseless* (sinnlos) but not *nonsensical* (unsinnig):

- **Tautology**: true under every assignment. *p ∨ ¬p*. Says nothing about the world.
- **Contradiction**: false under every assignment. *p ∧ ¬p*. Says nothing about the world.

Both are *limit cases* of meaningful proposition. They have *truth-conditions* (always true / always false) but *say nothing* — they don't distinguish one world-state from another. TLP 6.1 makes the deep claim: *the propositions of logic are tautologies*. Logic is not a domain of substantive truths; it is the form of any possible substantive proposition.

This connects to [show-vs-say](./show-vs-say.md): tautologies *show* the logical form of propositions; they don't *say* anything.

## Modern truth-table use (Copi tradition)

[Copi](./copi-introduction-to-logic.md) Ch 8 develops truth-tables as the standard validity-test for propositional arguments:

1. List all atomic propositions as columns.
2. Enumerate all 2^n assignments as rows.
3. Add columns for each compound subexpression and the premises + conclusion.
4. **An argument is valid iff every row where all premises are true also has the conclusion true.**

This is *Wittgenstein's procedure* renamed and operationalized. The notation persists; the philosophical claims of TLP 5–6 do not need to be endorsed to use the truth-table.

## Cross-link to [picture theory](./picture-theory-of-language.md)

A truth-table is a *picture* in TLP's strict sense:
- Its **elements** (rows, columns, T/F cells) correspond to the **objects** of the compound proposition (atomic propositions, their truth-values).
- Its **form** (the row-column arrangement) shares the **logical form** of the proposition's truth-functional structure.
- It **shows** the truth-functional dependency rather than **saying** it.

This is why truth-tables are the canonical pedagogical demonstration of show-vs-say: prose says *"p ∧ q is true iff both p and q are true"*; the truth-table *displays* the dependency by being structured that way.

The wiki cross-links: every concept page that includes a truth-table-style or matrix-style visual is implicitly invoking the picture-theory ↔ truth-function correspondence.

## METER integration

| Drill | Pass floor | Source | Owner |
|---|---|---|---|
| State TLP 5 + 6 + 4.31 from memory | <30 s | this page §Mnemonic | this page |
| Construct a truth-table for a given compound proposition (≤3 atomics) | <90 s | this page §Modern use | [copi-introduction-to-logic](./copi-introduction-to-logic.md) Ch 8 |
| Express ∧, ∨, →, ↔ in terms of N alone | <60 s | this page §Visual | this page |
| Identify tautology / contradiction / contingency by truth-table | <30 s | TLP 4.46 + Copi Ch 8 | this page |
| Name what Gödel killed in scope and what survived | <60 s | this page §What Gödel did | this page |

## Related pages

- [tractatus-logico-philosophicus](./tractatus-logico-philosophicus.md) — source primary text; propositions 4.3-4.46, 5, 6
- [picture-theory-of-language](./picture-theory-of-language.md) — TLP 2-4 grounding; truth-tables are pictures in TLP's strict sense
- [show-vs-say](./show-vs-say.md) — tautologies show logical form; they don't say anything
- [godels-incompleteness](./godels-incompleteness.md) — what demolished TLP 5's scope
- [copi-introduction-to-logic](./copi-introduction-to-logic.md) — modern textbook use of truth-tables (Ch 8)
- [logic-atomic-design](./logic-atomic-design.md) — Atom-tier (Connectives) family + truth-function as Organism-tier pipeline
- [validity-vs-soundness](./validity-vs-soundness.md) — truth-table is the validity-test for propositional arguments
- [fallacy-taxonomy](./fallacy-taxonomy.md) — affirming-the-consequent / denying-the-antecedent are truth-table-detectable invalid forms
- [glossary](./glossary.md) — Logic layer registration
