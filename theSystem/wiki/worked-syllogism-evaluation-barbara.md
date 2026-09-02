---
palace: meta-knowledge
level: 6
domain: 10
room: 53
wiki_source: wiki/logic/worked-syllogism-evaluation-barbara.md
---

# Worked Syllogism Evaluation — Barbara (AAA-1)

**Summary**: A **full worked example** of evaluating a categorical syllogism using both the **Venn-diagram method** and the **six rules of syllogism**. The example uses **Barbara (AAA-1)** — *All M is P; All S is M; ∴ All S is P* — Aristotle's Figure 1 *dux*, the most-cited valid syllogism in the history of logic. The Page-tier in [logic-atomic-design](./logic-atomic-design.md): theory pages establish what the rules are; this page shows them in operation.

**Sources**:
- [Copi/Cohen/McMahon](./copi-introduction-to-logic.md) *Introduction to Logic* 14th ed, Ch 6 — categorical syllogism evaluation.
- [categorical-syllogism](./categorical-syllogism.md) — the rules + 15-form table.
- [validity-vs-soundness](./validity-vs-soundness.md) — what the evaluation produces.
- Aristotle, *Prior Analytics* (c. 350 BCE) — Barbara is Aristotle's Figure 1 *dux*.

**Last updated**: 2026-05-25

---

## One-line

> Take *"All humans are mortal. All Greeks are humans. Therefore all Greeks are mortal."* Apply Venn diagram → shows valid. Apply six rules → all 6 pass. **Conclusion: Barbara (AAA-1) is valid.** The classic.

## Unlocks (lead, not footer)

1. **Theory + operational walkthrough closes the gap.** [categorical-syllogism](./categorical-syllogism.md) explains *what* the rules are; this page shows *how* to apply them. The wiki's [logic-atomic-design](./logic-atomic-design.md) §Pages tier requires that worked instances exist for every Template + Organism — this page realizes the Template for Barbara.

2. **The Venn-diagram method is picture-theoretic.** Shading the regions that the premises declare empty *shows* the validity by exhibiting the geometric containment. The validity is *visible*, not inferred from rules. This is [TLP show-vs-say](./show-vs-say.md) operationalized at the syllogism-validity layer.

3. **The two methods agree.** Venn-diagram method (geometric/visual) and six-rules method (algorithmic/rule-checking) produce the same verdict for Barbara: valid. **The two methods are equivalent** but useful in different contexts: Venn for visual learners or when explaining; rules for fast algorithmic checking.

4. **METER target**: any practitioner should evaluate Barbara via either method in <60 seconds. Drilling on Barbara → drilling on other named syllogisms → reflexive evaluation of any standard-form syllogism in <60 s with ≥80% accuracy.

## Mnemonic

**A-A-A-1** = *Mood AAA · Figure 1.*

For Barbara's form: **M-P, S-M, ∴ S-P**.

## Memory checksum

1. **State Barbara in standard form.** (Major premise: All M is P. Minor premise: All S is M. Conclusion: All S is P. All three propositions are type A — universal affirmative.)
2. **What is the figure?** (Figure 1 — middle term M is the subject of the major premise and the predicate of the minor premise.)
3. **State the six rules of syllogism.** (1: Exactly 3 terms. 2: Middle term distributed in ≥1 premise. 3: Term distributed in conclusion must be distributed in its premise. 4: No 2 negative premises. 5: Negative premise → negative conclusion. 6: No universal-particular conclusion without existential import.)
4. **Why does Barbara pass all 6 rules?** (Rule 1: M, S, P each appear twice. Rule 2: M is distributed in P1 (A-prop subject). Rule 3: S is distributed in conclusion, also in P2 (A-prop subject). Rule 4: no negative premises. Rule 5: no negative premise, so no negative-conclusion requirement. Rule 6: conclusion is universal, both premises universal — ok.)
5. **What does the Venn diagram show?** (After shading S∩¬M and M∩¬P, the region S∩¬P is automatically shaded out — the conclusion "All S is P" is visible without further work. Validity is *shown* in the diagram.)

## Visual — Barbara fully diagrammed

**Original argument**:
- Premise 1 (major): All humans are mortal.
- Premise 2 (minor): All Greeks are humans.
- Conclusion: All Greeks are mortal.

**Standard form**: Subject term S = Greeks, predicate term P = mortals (mortal-things), middle term M = humans.

- All M is P (All humans are mortal)
- All S is M (All Greeks are humans)
- &there4; All S is P (All Greeks are mortal)

Mood: AAA. Figure: 1 (M is subject of major, predicate of minor).

**Venn-diagram method** — step 0: draw three overlapping circles labeled S, M, P. Step 1: apply Premise 1 ("All M is P") by shading the region M ∩ ¬P (parts of M outside P) — this region is declared empty by P1. Step 2: apply Premise 2 ("All S is M") by shading the region S ∩ ¬M (parts of S outside M) — declared empty by P2. Step 3: check the conclusion ("All S is P") by asking whether S ∩ ¬P is already shaded: parts of S outside M are shaded (by P2); parts of S inside M are inside P too (because P1 shaded M∩¬P, leaving S∩M ⊆ P). So S ∩ ¬P is fully shaded out — "All S is P" is shown in the diagram. Barbara is VALID.

```p5 height=420
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 420); p.noLoop(); };
p.draw = () => {
  const dark = p.isDark;
  p.background(dark ? 30 : 245);
  const ink = dark ? '#ECE4D3' : '#2B2620';
  const gold = '#a08a5c', rose = '#a07d78';
  const cx = p.width/2, cy = 190, r = 95;
  const S = { x: cx - r*0.62, y: cy + r*0.5 };
  const M = { x: cx, y: cy - r*0.55 };
  const P = { x: cx + r*0.62, y: cy + r*0.5 };
  const inCircle = (x,y,c) => p.dist(x,y,c.x,c.y) < r;

  p.noStroke();
  for (let i = 0; i < 7000; i++) {
    const x = cx - r*1.9 + p.random(r*3.8);
    const y = (cy - r*1.6) + p.random(r*3.3);
    const inS = inCircle(x,y,S), inM = inCircle(x,y,M), inP = inCircle(x,y,P);
    if (inM && !inP) { p.fill(gold); p.circle(x,y,2.4); }
    else if (inS && !inM) { p.fill(rose); p.circle(x,y,2.4); }
  }

  p.noFill(); p.stroke(ink); p.strokeWeight(1.5);
  p.circle(S.x, S.y, r*2);
  p.circle(M.x, M.y, r*2);
  p.circle(P.x, P.y, r*2);

  p.noStroke(); p.fill(ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(16);
  p.text('S', S.x - r*0.9, S.y + r*0.3);
  p.text('M', M.x, M.y - r*1.05);
  p.text('P', P.x + r*0.9, P.y + r*0.3);

  p.textSize(12); p.textAlign(p.LEFT, p.TOP);
  p.fill(gold); p.text('shaded (P1: All M is P) -- M and not-P is empty', 10, p.height - 66);
  p.fill(rose); p.text('shaded (P2: All S is M) -- S and not-M is empty', 10, p.height - 48);
  p.fill(ink); p.text('Result: S and not-P is fully shaded out, so All S is P is shown. Barbara is VALID.', 10, p.height - 28);
};
```

**Six-rules method**:

- Rule 1 — Exactly 3 terms? Terms: M, S, P. Each appears twice. Pass.
- Rule 2 — Middle term distributed in &ge;1 premise? M is subject of "All M is P" (A-prop &rarr; subject distributed). Pass.
- Rule 3 — Any term distributed in conclusion must be distributed in its premise? Conclusion "All S is P" &rarr; S distributed (A-prop subject), P undistributed. S in P2 "All S is M" &rarr; S distributed (A-prop subject). Pass. P in conclusion not distributed, so no requirement. Pass.
- Rule 4 — No two negative premises? Both premises are A (affirmative). Pass.
- Rule 5 — Negative premise &rarr; negative conclusion? No negative premise; no negative-conclusion requirement. Pass.
- Rule 6 — Two universal premises &rarr; universal conclusion? Both premises universal (A), conclusion universal (A). Pass.

ALL 6 RULES PASS. &there4; Barbara is VALID.

**Both methods agree: Barbara (AAA-1) is valid.**

The Venn diagram *shows* validity; the six rules *verify* it algorithmically. Both methods produce the same verdict.

---

## Step-by-step walkthrough

### Step 1 — Translate to standard form

The English argument:
> *All humans are mortal. All Greeks are humans. Therefore all Greeks are mortal.*

Already in close-to-standard form. Identify:
- **Conclusion**: "All Greeks are mortal." → S = Greeks (subject), P = mortals (predicate).
- **Premise 1 (major, since it contains P)**: "All humans are mortal." → M = humans, P = mortals.
- **Premise 2 (minor, since it contains S)**: "All Greeks are humans." → S = Greeks, M = humans.

**Major term**: P = mortals.
**Minor term**: S = Greeks.
**Middle term**: M = humans.

(Note: in formal categorical syllogism, the predicate must be a class-name. "Mortal" becomes "mortals" or "mortal-things". Wiki [Ch 7](./copi-syllogisms-in-ordinary-language.md) handles this translation.)

### Step 2 — Identify mood + figure

**Mood** = the three letters from {A, E, I, O} for the three propositions in order (major, minor, conclusion).

- Major premise "All M is P" → A.
- Minor premise "All S is M" → A.
- Conclusion "All S is P" → A.

**Mood = AAA**.

**Figure** = the position of the middle term M:

- M is **subject** of major premise.
- M is **predicate** of minor premise.

**Figure 1** (middle is subject of major, predicate of minor).

**Form = AAA-1 = Barbara**.

### Step 3 — Venn-diagram method

Draw three overlapping circles labeled S, M, P (using the standard 3-circle Venn diagram).

The 8 regions of the 3-circle diagram:
1. S only (S ∩ ¬M ∩ ¬P)
2. S ∩ M only (S ∩ M ∩ ¬P)
3. S ∩ M ∩ P (center)
4. S ∩ P only (S ∩ ¬M ∩ P)
5. M only (M ∩ ¬S ∩ ¬P)
6. M ∩ P only (M ∩ ¬S ∩ P)
7. P only (P ∩ ¬S ∩ ¬M)
8. Outside all three

**Apply Premise 1 ("All M is P")**: P1 declares that any M is also a P. So the parts of M *outside* P must be empty. Shade regions 5 and 2 (M ∩ ¬P).

After step 1, regions 5 and 2 are shaded:
- Region 5 (M only) — shaded.
- Region 2 (S ∩ M ∩ ¬P) — shaded.

**Apply Premise 2 ("All S is M")**: P2 declares that any S is also an M. So the parts of S *outside* M must be empty. Shade regions 1 and 4 (S ∩ ¬M).

After step 2, regions 1, 2, 4, 5 are all shaded:
- Region 1 (S only) — shaded.
- Region 2 — shaded (already from P1).
- Region 4 (S ∩ ¬M ∩ P) — shaded.
- Region 5 — shaded (already from P1).

**Check conclusion ("All S is P")**: the conclusion requires that any S is also a P. So if the diagram has correctly absorbed both premises, the parts of S *outside* P should be empty.

S ∩ ¬P comprises regions 1 and 2:
- Region 1: shaded (by P2). ✓
- Region 2: shaded (by P1). ✓

**Both regions of S ∩ ¬P are shaded out.** The diagram *shows* "All S is P".

**Verdict**: Barbara is **valid**.

### Step 4 — Six-rules method

Apply each of [the six rules](./categorical-syllogism.md):

**Rule 1 — Exactly three terms.**
- Terms: S (Greeks), M (humans), P (mortals).
- Each term appears in exactly two propositions:
  - S in P2 and conclusion.
  - M in P1 and P2.
  - P in P1 and conclusion.
- **3 terms, each appearing twice. Pass.** ✓

**Rule 2 — Middle term must be distributed in at least one premise.**
- M appears as subject of P1 ("All M is P") and predicate of P2 ("All S is M").
- A-proposition subject is distributed; A-proposition predicate is undistributed.
- So M is distributed in P1 (subject).
- **M is distributed in at least one premise. Pass.** ✓

**Rule 3 — Any term distributed in the conclusion must also be distributed in its premise.**
- Conclusion: "All S is P" (A-proposition).
- S is distributed in the conclusion (subject of A-prop).
- P is undistributed in the conclusion (predicate of A-prop).
- Check S: is S distributed in P2? P2 = "All S is M" (A-prop, S is subject). **Yes, S is distributed in P2.** ✓
- P is undistributed in conclusion, so no requirement on its distribution in P1.
- **Pass.** ✓

**Rule 4 — No two negative premises.**
- Both premises are A (universal affirmative).
- **No negative premises. Pass.** ✓

**Rule 5 — If either premise is negative, the conclusion must be negative.**
- No negative premise → no constraint applies.
- **Vacuously pass.** ✓

**Rule 6 — If both premises are universal, the conclusion must not be particular (modern logic, no existential import).**
- Both premises universal (A).
- Conclusion universal (A).
- **Pass.** ✓

**All 6 rules pass. Barbara is valid.**

### Step 5 — Cross-check

Both methods agree: Barbara (AAA-1) is **valid**.

Additional verification: Barbara appears in the [15 unconditionally valid forms](./categorical-syllogism.md) table — listed for Figure 1.

**The argument is also sound** in the worked example: "All humans are mortal" is true (modulo claims about cryonic preservation, religious afterlife, etc.; we use it as a paradigm truth); "All Greeks are humans" is true; therefore "All Greeks are mortal" is **necessarily true** (because the argument is valid + premises are true).

## Why Barbara is the canonical example

Aristotle in *Prior Analytics* (c. 350 BCE) treated Figure 1 as primary; Barbara as its prototypical valid form. Medieval logicians reduced all other valid syllogisms to Figure 1 forms via transformations (conversion, obversion, contraposition), so **Barbara serves as the *anchor* of the entire syllogistic system**.

The Latin name *Barbara* has a memnonic structure:
- **B**: position-marker indicating it's the first Figure-1 form.
- **A**: vowel for the major proposition (A-type).
- **A**: vowel for the minor proposition (A-type).
- **A**: vowel for the conclusion (A-type).

The 3 A's give the mood AAA. The first consonant (B) signals Figure 1 reduction (Barbara is *itself* a Figure 1 form, requiring no reduction).

**Drilling Barbara to reflex (<30s evaluation)** is the first move in mastering syllogism evaluation. From Barbara, the other 14 unconditionally-valid forms can be drilled.

## METER integration

| Drill | Pass floor | Source |
|---|---|---|
| Identify Barbara's mood + figure given the English argument | <30 s | this page §Step 2 |
| Apply Venn-diagram method to Barbara | <60 s | this page §Step 3 |
| Apply six-rules method to Barbara | <60 s | this page §Step 4 |
| Verify both methods agree | <30 s | this page §Step 5 |
| Distinguish valid form from invalid (Barbara vs an invalid mood-figure) | <60 s | [categorical-syllogism](./categorical-syllogism.md) §15 forms |

## Related pages

- [categorical-syllogism](./categorical-syllogism.md) — the rules + 15-form table this page operationalizes
- [copi-introduction-to-logic](./copi-introduction-to-logic.md) — Ch 5-6 source
- [copi-syllogisms-in-ordinary-language](./copi-syllogisms-in-ordinary-language.md) — Ch 7; translating English to standard form (the step before this evaluation)
- [validity-vs-soundness](./validity-vs-soundness.md) — what the evaluation produces
- [fallacy-taxonomy](./fallacy-taxonomy.md) — what invalid syllogism forms look like
- [methods-of-deduction](./methods-of-deduction.md) — Copi Ch 9 derivation system; alternative to syllogism for symbolic logic
- [picture-theory-of-language](./picture-theory-of-language.md) — Venn diagrams as picture-theoretic exhibitions of class relations
- [show-vs-say](./show-vs-say.md) — validity *shown* by the Venn diagram, not *said* by prose
- [logic-atomic-design](./logic-atomic-design.md) §Pages — this page realizes the Template for Barbara
- [worked-natural-deduction-proof](./worked-natural-deduction-proof.md) — sister worked example for symbolic logic
- [worked-argument-extraction](./worked-argument-extraction.md) — sister worked example for argument anatomy
- [glossary](./glossary.md) — Logic layer registration
