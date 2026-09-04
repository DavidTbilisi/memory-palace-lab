---
palace: meta-knowledge
level: 6
domain: 10
room: 69
wiki_source: wiki/logic/per-rule-hypothetical-syllogism.md
---

# Hypothetical Syllogism (Per-Rule Page)

**Summary**: A **full standalone page** for the third atomic rule following the per-rule template established in [per-rule-modus-ponens](./per-rule-modus-ponens.md) + [per-rule-modus-tollens](./per-rule-modus-tollens.md). **Hypothetical Syllogism (HS)**: *P → Q ; Q → R ; ∴ P → R*. The conditional-chain rule — combines two conditionals sharing a middle term into a single longer conditional. **The structural ancestor of mathematical proof's transitivity chains**, scientific causal-chain reasoning, and computational pipeline-composition. Cataloged by Chrysippus c. 250 BCE; medieval Latin name unclear (different traditions used different names). **The third member of the MP/MT/HS valid-conditional trio**, completing the basic conditional-inference toolkit.

**Sources**:
- [Copi/Cohen/McMahon](./copi-introduction-to-logic.md) *Introduction to Logic* 14th ed, Ch 9.
- [methods-of-deduction](./methods-of-deduction.md) — collective treatment of the 19 rules.
- [per-rule-modus-ponens](./per-rule-modus-ponens.md) · [per-rule-modus-tollens](./per-rule-modus-tollens.md) — sister pages establishing the per-rule template.
- Chrysippus of Soli (c. 279-c. 206 BCE) — first systematic articulation; HS was implicit in his propositional logic system.

**Last updated**: 2026-05-25

---

## One-line

> *P → Q ; Q → R ; ∴ P → R*. Two conditionals sharing a middle term combine into one longer conditional. **The conditional-chain rule.**

## Unlocks (lead, not footer)

1. **HS is the rule of *transitivity for conditionals*.** Just as *=* is transitive (*a = b ; b = c ; ∴ a = c*), and *<* is transitive (*a < b ; b < c ; ∴ a < c*), the conditional *→* is transitive: *P → Q ; Q → R ; ∴ P → R*. **The conditional shares a fundamental property with mathematical equality + order relations** — chains compose. This makes HS the structural ancestor of countless reasoning patterns in mathematics, science, and computation.

2. **HS is derivable from MP + Conditional Proof.** As shown in [the worked natural-deduction proof](./methods-of-deduction.md), HS isn't *atomic* in the strictest sense — it's a *macro* combining MP + CP. The derivation:
   ```
   1. P → Q          Premise
   2. Q → R          Premise
   3. | P            Assume (for CP)
   4. | Q            1, 3, MP
   5. | R            2, 4, MP
   6. P → R          3-5, CP
   ```
   **HS is a single rule because the proof is mechanical + frequently needed.** Copi treats it as a basic rule for pedagogical clarity even though it's derivable.

3. **HS enables long causal-chain reasoning.** *"If X, then Y; if Y, then Z; if Z, then W"* → *"If X, then W"*. Used in:
   - **Scientific reasoning**: causal chains in biology (mutation → protein change → phenotype change → survival impact).
   - **Programming**: pipeline composition (input → step1 → step2 → step3 → output).
   - **Legal reasoning**: chains of liability + obligation.
   - **Mathematical proof**: transitivity of *<*, *≤*, *=*, *∼*; inheritance of properties through abstraction levels.
   - **Diagnostic reasoning**: symptom → condition → cause → treatment chains in medicine.

4. **No dark twin per se, but extension limits matter.** Unlike MP (with AC dark twin) + MT (with DA dark twin), HS doesn't have a clean dark twin. The relevant warning: **chains can lose strength** through accumulated uncertainty — a chain of conditionals each "70% likely" doesn't yield a 70%-likely conclusion; probability cascades down. **The deductive-validity of HS is exact; the inductive-strength of long chains degrades.** A practitioner needs to distinguish: deductive HS preserves validity exactly; informal-everyday "if X, then Y, then Z" chains often have probabilistic links that degrade.

## Mnemonic

***P → Q ; Q → R ; ∴ P → R*** = *"If P then Q. If Q then R. Therefore if P then R."*

**Drill to <8 second reflex** — same speed target as MP + MT.

## Memory checksum

1. **State the form of Hypothetical Syllogism.** (*P → Q ; Q → R ; ∴ P → R*. Two conditionals sharing a middle term (Q) combine into one longer conditional from P to R.)
2. **State HS as transitivity for conditionals.** (HS is the rule of transitivity for the conditional relation: *→* is transitive in the same way *=* and *<* are transitive. *P → Q ; Q → R ; ∴ P → R* is structurally identical to *a < b ; b < c ; ∴ a < c*.)
3. **Show that HS is derivable from MP + CP.** (1. *P → Q* premise; 2. *Q → R* premise; 3. assume *P*; 4. *Q* by MP from 1+3; 5. *R* by MP from 2+4; 6. *P → R* by CP discharging assumption 3. Six lines using MP + CP.)
4. **Name three application domains.** (Scientific causal chains; programming pipeline composition; legal liability chains; mathematical proof transitivity; diagnostic reasoning chains in medicine.)
5. **State the warning about chain length.** (Deductive HS preserves validity exactly. But long chains of conditionals each with uncertainty (probabilistic links rather than logical implications) lose strength through accumulated uncertainty. Distinguish: deductive validity of HS is exact; informal "if X then Y then Z" chains often degrade probabilistically.)

## Visual — HS chain example

**Hypothetical Syllogism (HS) — valid**:

| Case | Premise 1 | Premise 2 | Conclusion |
|---|---|---|---|
| Abstract schema | P → Q | Q → R | ∴ P → R |
| Example 1 (math) | If n is even, then n² is even. | If n² is even, then n² + 4 is even. | ∴ If n is even, then n² + 4 is even. |
| Example 2 (debugging) | If input has trailing whitespace, parser produces malformed token. | If parser produces malformed token, application throws ParseError. | ∴ If input has trailing whitespace, application throws ParseError. |
| Example 3 (causal chain, partial) | If sleep < 6 hours, cognitive function decreases. | If cognitive function decreases, work errors increase. | ∴ If sleep < 6 hours, work errors increase. |

(Example 3's conditionals are probabilistic, not strict; the conclusion holds with uncertainty accumulated across both links.)

**HS chain — iterated** (HS applied 4 times in sequence):

```mermaid
graph LR
  A --> B -->|HS| C -->|HS| D -->|HS| E -->|HS| F
```

Premises: A → B, B → C, C → D, D → E, E → F. Conclusion: ∴ A → F.

**HS derivation from MP + CP** (HS is derivable; Copi treats it as a primary rule for pedagogical clarity):

1. P → Q — Premise
2. Q → R — Premise
3. | P — Assume (for CP)
4. | Q — 1, 3, MP
5. | R — 2, 4, MP
6. P → R — 3-5, CP
∴ P → R

**No dark twin — but a chain-length warning**: HS doesn't have a clean dark twin like MP/AC or MT/DA. The conditional → is genuinely transitive; the inference is sound.

Warning: long chains can lose **strength** through accumulated uncertainty. A chain of probabilistic conditionals (informal everyday "if X then Y") has its uncertainty multiplied across links — e.g. P(A→B) = P(B→C) = P(C→D) = 0.9 each:

```chart height=260
{"xAxis":{"type":"category","name":"chain links","data":["1","2","3"]},
 "yAxis":{"type":"value","name":"reliability","min":0,"max":1},
 "series":[{"type":"bar","name":"P(chain holds)","data":[0.9,0.81,0.729],"itemStyle":{"color":"#a07d78"}}]}
```

P(A → D | A) ≈ 0.9 × 0.9 × 0.9 ≈ 0.729 (NOT 0.9). Deductive HS preserves validity exactly; informal-everyday chains degrade probabilistically. Distinguish them.

The transitivity is the structural insight. The chain-length warning is the practical insight.

---

## The historical context

### Chrysippus and the propositional revolution

[MP](./per-rule-modus-ponens.md) and [MT](./per-rule-modus-tollens.md) cover the historical context for Chrysippus's foundational role in propositional logic. **HS was implicit in Chrysippus's 5 basic argument forms** — not explicitly listed as a separate form but used throughout his analytical work.

Diogenes Laertius's catalog of Chrysippus's 5 forms (VII.79-81) doesn't list HS as a separate form. **The reason**: HS is structurally the *iteration of MP* + the *recognition that conditionals are transitive*. Chrysippus understood the transitivity but didn't formalize HS as a separate basic rule.

### Medieval Latin tradition

The medieval Latin tradition formalized HS as a basic rule (sometimes called *syllogismus hypotheticus* or *conditional syllogism*). Petrus Hispanus's *Summulae Logicales* (13th c.) treats it as basic.

The name **"hypothetical syllogism"** distinguishes HS from **categorical syllogism** (Aristotelian). Both are syllogisms (three propositions: two premises + one conclusion). Categorical syllogism has subject-predicate structure; hypothetical syllogism has if-then structure.

### Modern symbolic logic

Modern symbolic logic (post-Frege 1879) treats HS as one of the standard inference rules. Copi presents HS as the 3rd elementary inference rule (after MP + MT). Natural deduction systems include HS as either primitive or derivable.

The contemporary debate: should HS be primitive or derivable? **The pragmatic answer**: derivable from MP + CP, but useful enough as a frequently-needed pattern that pedagogical clarity favors treating it as primitive.

## When HS fires

HS fires whenever you have:
- A **conditional proposition** *P → Q*.
- Another **conditional proposition** *Q → R* sharing the middle term *Q*.

The conclusion is **the compound conditional** *P → R*.

### Recognition cues

- *"If P then Q"* + *"If Q then R"* → HS, deriving *"If P then R"*.
- Causal chains: *"X causes Y"* + *"Y causes Z"* → *"X causes Z"* (informal HS).
- Logical chains: *A → B → C → D* — HS applied repeatedly.
- Pipeline composition: *input → transform1 → transform2 → output* — HS structure for stages.

### Examples in different fields

**Mathematics — transitivity proofs**:
> *"If n is even, then n² is even. (Because n=2k → n²=4k²=2(2k²).) If n² is even, then n²+4 is even. (Sum of two evens.) ∴ If n is even, then n²+4 is even."*
> 
> HS fires; the proof has the structural shape of two conditionals chained.

**Programming — pipeline composition**:
> *"If `parse(input)` succeeds, then we have a valid AST. If we have a valid AST, then `analyze(AST)` produces a result. ∴ If `parse(input)` succeeds, then `analyze(AST)` produces a result."*
> 
> HS structure for pipeline stages.

**Legal reasoning — chains of liability**:
> *"If the contractor was negligent, the client suffered damages. If the client suffered damages, the contractor is liable. ∴ If the contractor was negligent, the contractor is liable."*
> 
> HS chains used to establish liability claims.

**Mathematical proof — transitivity of relations**:
> *"If a < b and b < c, then a < c."* — this is HS applied to the *<* relation (when *<* is transitive).
> *"If a = b and b = c, then a = c."* — HS applied to *=*.
> *"If A ⊆ B and B ⊆ C, then A ⊆ C."* — HS applied to *⊆*.
> 
> Transitivity of mathematical relations IS HS specialized to that relation.

**Diagnostic reasoning — symptom-to-condition chains**:
> *"Patient has fever + headache + neck stiffness. → Possible meningitis. If meningitis, then specific CSF profile expected. ∴ If patient has fever + headache + neck stiffness, expect specific CSF profile."*
> 
> HS in diagnostic reasoning chains (informal; uncertainty accumulates).

## HS chains iterated

HS can be **iterated** through long chains of conditionals:

```
1. A → B          Premise
2. B → C          Premise
3. C → D          Premise
4. D → E          Premise
5. E → F          Premise
6. A → C          1, 2, HS
7. A → D          6, 3, HS
8. A → E          7, 4, HS
9. A → F          8, 5, HS
∴ A → F
```

This 5-link chain compresses 4 HS applications into a single end-to-end conditional. **For any chain of n conditionals sharing successive middle terms, HS compresses to a single conditional from start to end.**

### The chain-length warning

Deductively, HS preserves validity exactly across any chain length. **But informal everyday "if X then Y, then Z" chains** often have probabilistic rather than strictly-implicative links. **Uncertainty accumulates multiplicatively across links**.

If each link is 90% reliable, a 3-link chain is ~72.9% reliable; a 5-link chain is ~59% reliable; a 10-link chain is ~35% reliable. **Long informal chains are unreliable even when each individual link seems strong.**

**Operational implication**: when you encounter a 5+ link reasoning chain in a public-policy argument, scientific argument, legal argument, or business analysis, **explicitly check each link's certainty + multiply**. The chain's reliability is the product, not the minimum.

## HS in mathematical proof

Mathematical proofs make extensive use of HS through transitivity chains:

### Equality chains

> *Proof that 2 + 2 = 4 (informally):*
> *2 + 2 = 2 + (1 + 1) = (2 + 1) + 1 = 3 + 1 = 4.*
> 
> Each step is an HS-style application of transitivity:
> *a = b ; b = c ; ∴ a = c.*

### Inequality chains

> *Proof that 0 < 1 (in a partially-ordered field):*
> *1 - 0 = 1 > 0 (since 1 is a positive element).*
> *Therefore 1 > 0.*
> 
> Strict-inequality transitivity applies across chains.

### Implication chains in pure proof

> *Proof of a typical theorem: If A, then ... long chain ... then Z.*
> 
> Most non-trivial proofs proceed via HS chains: assume hypothesis → derive intermediate result 1 → derive intermediate result 2 → ... → derive conclusion. The CP discharge produces a final conditional theorem.

**HS is structurally embedded in nearly every mathematical proof.** This makes it the most-used inference rule in mathematics, even though MP is the most-used inference rule in everyday logic.

## HS in programming

Pipeline composition in functional programming is structurally HS:

```python
result = pipe(input,
              parse,    # P → Q
              analyze,  # Q → R  
              format)   # R → S
# Equivalent to: P → S (HS chained 3 times)
```

**Function composition** *f ∘ g ∘ h* is the categorical formalization of HS chains. **Category theory** generalizes this to morphism composition: *f: A → B; g: B → C* gives *g ∘ f: A → C*. **The categorical composition law IS HS at a higher abstraction level.**

This is why functional programming + category theory + classical propositional logic share deep structural connections. **HS is the entry-level case of a much broader composition principle.**

## HS in everyday + informal reasoning

Everyday reasoning often uses informal HS chains:

> *"If I leave at 7 AM, I'll catch the 7:15 bus. If I catch the 7:15 bus, I'll arrive at work by 8 AM. ∴ If I leave at 7 AM, I'll arrive at work by 8 AM."*

This **assumes** that each conditional holds reliably. In practice, traffic + bus delays + work-arrival variability mean each link is probabilistic. **The chain-length warning applies**: a 5-link "if-then" everyday-reasoning chain may be only ~60% reliable even if each link is 90%.

**Operational reflex**: when constructing or evaluating an informal HS chain, ask:
- How reliable is each link?
- How does uncertainty propagate?
- Is the conclusion's claimed certainty consistent with the multiplied uncertainty?

This is partial Bayesian thinking — see [bayesian-probability-primer](./bayesian-probability-primer.md) for the formal treatment.

## Common errors in applying HS

### Error 1 — Confusing the middle term

HS requires that the second premise's antecedent be the *same* as the first premise's consequent. **Sloppy reasoning**:
> *"If P, then Q. If R, then S. ∴ If P, then S."* — INVALID. The middle term *Q* and *R* are different; HS doesn't apply.

**The reflex**: explicitly check that the antecedent of P2 matches the consequent of P1.

### Error 2 — Forgetting transitivity may fail

Some relations are *not* transitive, even though they look conditional-shaped:
- *"likes"*: A likes B; B likes C; does A like C? Not necessarily.
- *"is the father of"*: A is father of B; B is father of C; A is *grandfather* of C, NOT father.
- *"prefers to"*: A prefers Coke to Pepsi; A prefers Pepsi to Sprite. Does A prefer Coke to Sprite? Often yes (transitive preferences), but not always (intransitive preferences are well-documented).

**HS applies to logical conditionals (truth-functional →), not to all "if-then-shaped" relations.**

### Error 3 — Chain-length unreliability ignored

Long chains of informal conditionals can be unreliable even when each link looks strong. **Probabilistic uncertainty cascades multiplicatively**.

### Error 4 — Backward chain direction confused

If you have *Q → R* and *P → Q*, the chain runs *P → Q → R*. HS conclusion: *P → R*.

If instead you have *Q → R* and *R → S*, the chain runs *Q → R → S*. HS conclusion: *Q → S*.

**Don't confuse the directions.** The middle term is fixed; the chain direction follows.

## Cross-link to the wiki

| Wiki layer | HS's contribution |
|---|---|
| [methods-of-deduction](./methods-of-deduction.md) | HS is the 3rd elementary inference rule (or derived from MP + CP) |
| [per-rule-modus-ponens](./per-rule-modus-ponens.md) · [per-rule-modus-tollens](./per-rule-modus-tollens.md) | Sister per-rule pages; completes the MP/MT/HS valid-conditional trio |
| [validity-vs-soundness](./validity-vs-soundness.md) | HS is a canonical valid form |
| [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) | Mathematical proofs use HS extensively (transitivity chains) |
| [science-and-hypothesis](./science-and-hypothesis.md) | Causal chains in scientific reasoning use HS structure |
| [bayesian-probability-primer](./bayesian-probability-primer.md) | Long chains of probabilistic conditionals require Bayesian treatment (uncertainty propagation) |
| [truth-function-machine](./truth-function-machine.md) | HS justified by the truth-table for *→* + transitivity property |
| [worked-natural-deduction-proof](./worked-natural-deduction-proof.md) | HS appears in chained derivations |
| [copi-introduction-to-logic](./copi-introduction-to-logic.md) | Ch 9 source |
| [picture-theory-of-language](./picture-theory-of-language.md) | HS chains preserve logical form across composition |
| [modal-logic-primer](./modal-logic-primer.md) | Modal logic preserves HS structure for *□ → □* style chains |

## METER integration

| Drill | Pass floor | Source |
|---|---|---|
| Apply HS to a 2-conditional chain | <8 s, ≥95% | this page §Examples |
| Derive HS from MP + CP | <60 s | this page §Derivation |
| Identify HS chain in a mathematical proof | <30 s | this page §HS in mathematical proof |
| Compute chain-length unreliability (5 links @ 90% each) | <60 s | this page §Chain-length warning |
| Distinguish strict deductive HS from probabilistic informal chains | <30 s | this page §Errors |
| Apply iterated HS through a 5-link chain | <90 s | this page §Iteration |

## Per-rule template — exemplar continued

This page is the **third per-rule page** following the template established in [per-rule-modus-ponens](./per-rule-modus-ponens.md) + [per-rule-modus-tollens](./per-rule-modus-tollens.md). **The MP/MT/HS valid-conditional trio is now complete.**

**Future per-rule pages would extend further**:
- *per-rule-disjunctive-syllogism* (DS): *P ∨ Q ; ¬P ; ∴ Q*. Elimination via negation.
- *per-rule-constructive-dilemma* (CD) and *per-rule-destructive-dilemma* (DD): dual rules for disjunctions of conditionals.
- *per-rule-simplification* (Simp), *per-rule-conjunction* (Conj), *per-rule-addition* (Add): three simple rules for conjunction + disjunction.
- 10 replacement rules + 4 quantification rules.

**Decision**: with MP + MT + HS complete, the conditional-inference toolkit is operationally sufficient for most reasoning. **Further per-rule pages are valuable but represent diminishing returns**; future per-rule work should focus on rules most-frequently-misapplied in everyday reasoning (DS + simp possibly worth pages) rather than completing the full 23-rule inventory.

## Related pages

- [per-rule-modus-ponens](./per-rule-modus-ponens.md) · [per-rule-modus-tollens](./per-rule-modus-tollens.md) — sister pages; completes the MP/MT/HS trio
- [methods-of-deduction](./methods-of-deduction.md) — collective treatment of all 19 + 4 atomic rules
- [copi-introduction-to-logic](./copi-introduction-to-logic.md) — Ch 9 source
- [validity-vs-soundness](./validity-vs-soundness.md) — HS is a canonical valid form
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md) — mathematical proofs use HS extensively
- [science-and-hypothesis](./science-and-hypothesis.md) — causal chains use HS structure
- [bayesian-probability-primer](./bayesian-probability-primer.md) — chain-length uncertainty
- [truth-function-machine](./truth-function-machine.md) — HS justified by truth-table + transitivity
- [picture-theory-of-language](./picture-theory-of-language.md) — HS chains preserve logical form
- [modal-logic-primer](./modal-logic-primer.md) — modal HS structure
- [worked-natural-deduction-proof](./worked-natural-deduction-proof.md) — HS in chained derivations
- [logic-atomic-design](./logic-atomic-design.md) §Atoms → Rules → HS — the atom this page owns
- [glossary](./glossary.md) — Logic layer registration (Hypothetical Syllogism · transitivity for conditionals · MP/MT/HS trio · chain-length warning)
