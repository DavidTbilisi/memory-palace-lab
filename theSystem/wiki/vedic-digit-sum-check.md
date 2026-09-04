---
palace: strategic-memory
level: 3
domain: 10
room: 14
wiki_source: wiki/learning-systems/vedic-digit-sum-check.md
---

# Vedic Digit-Sum Check (Casting Out Nines)

**Summary**: The digit-sum method is a one-direction error filter for arithmetic results — convert every number in an arithmetical statement to its digit-sum (sum digits repeatedly until single-digit, or equivalently reduce mod 9), then check that the operation holds on the digit-sums. If the reduced statement is *false*, the original is definitely wrong. If the reduced statement is *true*, the original is *probably* right but not guaranteed. The asymmetry is the load-bearing fact: this catches additive/multiplicative errors at ~89% probability with near-zero overhead, but does not detect digit-swap errors that preserve the digit-sum. The trick that makes this fast is **casting out nines**: any 9 or any subset of digits summing to 9 can be ignored when computing the digit-sum.

**Sources**:
- Bathia, D. (n.d.) *Vedic Mathematics Made Easy* — Chapter 8 "Digit-Sum Method", pp. 71–80. PDF at `raw/01 Core_Memory/Math/Books/bathia-vedic-mathematics-made-easy.pdf`.
- Also cited (with same algorithm) in [trachtenberg-system](./trachtenberg-system.md) (Trachtenberg 1960 ch 5 and ch 7) and [vedic-speed-math](./vedic-speed-math.md) (Udemy course §14).

**Last updated**: 2026-05-22

![Digit-sum mod-9 check](diagrams/math/digit-sum-mod9-check.png)

---

## The reduction primitive

```
   digit_sum(n)   =   single-digit value obtained by repeatedly
                       summing the digits of n until 1 digit remains
                   =   n mod 9 (with the convention digit_sum(9·k) = 9, not 0,
                       though for arithmetic it works either way)
```

Examples:
- `2467539` → `2+4+6+7+5+3+9 = 36` → `3+6 = 9`. Digit-sum = 9.
- `56768439` → `5+6+7+6+8+4+3+9 = 48` → `4+8 = 12` → `1+2 = 3`. Digit-sum = 3.

### Casting out nines — the speed trick

While summing, **discard any 9 and any subset of digits that sums to 9**. The final digit-sum is unchanged.

```
   637281995
   ─────────
   discard 9, 9
   discard pairs that sum to 9:   (6,3) (7,2) (8,1)
   remaining digits:              2, 3
   digit-sum = 2 + 3 = 5
```

This makes 7–10 digit numbers reducible in 1–2 seconds with practice. The structural reason: subtracting 9 from a number doesn't change its `mod 9` value (and the digit-sum equals `n mod 9` for `n` not divisible by 9, and equals 9 for `n` divisible by 9).

---

## The four operation rules

For any arithmetic statement, the digit-sums must satisfy the same operation:

| Operation | Digit-sum rule |
|---|---|
| `A + B = C` | `ds(A) + ds(B) = ds(C)` (reduce LHS to single digit) |
| `A − B = C` | `ds(A) − ds(B) = ds(C)` (may need to add 9 to keep positive) |
| `A × B = C` | `ds(A) × ds(B) = ds(C)` (reduce LHS to single digit) |
| `A / B = C remainder R` | `ds(A) = ds(B) × ds(C) + ds(R)` |

The division rule is the most useful one for verification: it embeds the relationship `dividend = divisor × quotient + remainder`, which holds at the digit-sum level too.

### Worked example — multiplication check

`467,532 × 107,777 = 50,389,196,364` — is this right?

```
   ds(467,532)            = 4+6+7+5+3+2 = 27 → 9
   ds(107,777)            = 1+0+7+7+7+7 = 29 → 11 → 2
   ds(LHS digit-product)  = 9 × 2 = 18 → 9
   ds(50,389,196,364)     = (casting nines: 9, 9, 6+3, 5+4 already-9, 1+8, leftover digit-sum = 9)
   ─────────────────────────────────────
   LHS digit-sum = 9  ;  RHS digit-sum = 9  → check passes
```

### Worked example — division check

`2,308,682,040 ÷ 36,524 = 63,210` (remainder 0) — is this right?

```
   ds(dividend)  = 2+3+0+8+6+8+2+0+4+0 = 33 → 6
   ds(divisor)   = 3+6+5+2+4 = 20 → 2
   ds(quotient)  = 6+3+2+1+0 = 12 → 3
   ds(remainder) = 0
   ─────────────────────────────────────
   check:  ds(divisor) × ds(quotient) + ds(remainder)  =  2 × 3 + 0  =  6
   ds(dividend) = 6 ✓
```

---

## The asymmetry — what this catches, what it misses

**Always catches:** any error that changes the digit-sum of the result. Most calculation mistakes do.

**Misses (false negatives):**
- **Digit-swap errors**: writing `1024` instead of `1240` (both have digit-sum 7)
- **Adding/subtracting 9 from one position**: writing `99,900,021` vs. `99,900,012` (Bathia's example, p. 78) — both digit-sum to 3
- **Adding 9 to one digit while subtracting from another**: same digit-sum, different number

The miss-rate is structural, not random: there are exactly 1-in-9 results that look right under this test for any given correct answer. So digit-sum check is an ~89% filter, not a proof.

**Use case implication:** for *multiple-choice problems* (competitive exams, etc.), the digit-sum check **becomes near-deterministic** — you compute `ds(LHS)` once and reject all alternatives whose `ds` doesn't match. Bathia (Ch 8 §Applications) emphasizes this is the most leveraged use of the method.

---

## Why this works — mod-9 arithmetic

`digit_sum(n) ≡ n (mod 9)`. This is because `10 ≡ 1 (mod 9)`, so any number `d_k d_{k-1} ... d_0` in base 10 equals `Σ d_i · 10^i ≡ Σ d_i (mod 9)`.

Arithmetic operations are well-defined mod 9: if `A ≡ a (mod 9)` and `B ≡ b (mod 9)`, then `A+B ≡ a+b`, `A·B ≡ a·b`, and so on. So the digit-sum check is a homomorphism from arithmetic-on-integers to arithmetic-on-digit-sums.

The "9" appears in two roles:
- **Modulus**: arithmetic is preserved mod 9
- **Casting out**: subtract 9 (or any multiple of 9) from running digit-sum without changing the mod-9 class

---

## Composing with other methods

This check is *upstream* of any other arithmetic technique:
- [vedic-speed-math](./vedic-speed-math.md) — every Base Method or Criss-Cross result should pass digit-sum check
- [trachtenberg-system](./trachtenberg-system.md) — both addition and division methods build this in as a parallel column
- [trachtenberg-division](./trachtenberg-division.md) — uses digit-sum check on the table-build step, then again on the final quotient
- [trachtenberg-addition](./trachtenberg-addition.md) — alternative to the per-column tick verification, less powerful (only checks the total, not per-column)

The methods are complementary: tick-count and digit-sum catch *different* error classes. Use both for high-stakes arithmetic.

---

## Related pages

- [vedic-speed-math](./vedic-speed-math.md) — parent system; this is one of the cross-cutting checks
- [trachtenberg-system](./trachtenberg-system.md) — uses digit-sum across multiple methods
- [trachtenberg-division](./trachtenberg-division.md) — applies this check at multiple stages
- vedic-divisibility-tests — mod-9 is one specific divisibility test; the digit-sum check generalises beyond divisibility into operation verification
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — digit-sum reduction should be reflexive (1–2 seconds for 8-digit numbers)

---

## U — See (CAST)
1. Two parallel statements: original arithmetic, and digit-sum arithmetic
2. Casting out: pairs summing to 9 vanish

## D — Name (NEDF)
1. Digit-sum check = mod-9 verification of any arithmetic
2. Distinguisher: catches ~89% of errors, misses digit-swaps
3. Failure mode: over-trusting a pass; digit-swap silent failure

## F — Do (SPEAR)
1. Compute ds(each operand) by casting nines
2. Apply same operation; compare to ds(claimed result)

## B — Watch (HEART)
1. Forgetting that pass ≠ proof
2. Mis-reducing 9→0 vs 9→9 in some operations

## L — Predict (ORACLE)
1. Random arithmetic mistake → ds-check catches with ~89% probability
2. Competitive exam with 4 alternatives → ds-check usually decides uniquely

## R — Act (GRACE)
1. Multi-step calculation → ds-check at the end
2. Multiple-choice problem → ds-filter alternatives first
