---
palace: strategic-memory
level: 3
domain: 10
room: 17
wiki_source: wiki/learning-systems/vedic-duplex-square-roots.md
---

# Vedic Duplex Square Roots — General Method (Perfect and Imperfect)

**Summary**: Bathia's general square root method ([vedic-speed-math](./vedic-speed-math.md) extension, *Vedic Mathematics Made Easy* Ch 13) handles *any* number — perfect or imperfect, integer or decimal — using a long-division-style iteration with two simple rules. Group the input into 2-digit pairs from the right; start by extracting the largest single-digit root for the leftmost group. Then loop: **(R1)** after each step, add the quotient onto the divisor to form a new divisor; **(R2)** a new divisor can be multiplied only by the digit that gets suffixed to it. The quotient grows digit-by-digit; if the input is perfect the remainder reaches 0; if imperfect, switch to ordinary division at the end for decimal places. Unlike the perfect-cube/square methods, this works on all inputs but is slower (10-30 seconds for a 4-6 digit input) and requires actual digit-by-digit arithmetic rather than table lookup.

**Sources**:
- Bathia, D. (n.d.) *Vedic Mathematics Made Easy* — Chapter 13 "Square Roots of Imperfect Squares", pp. 113–125. PDF at `raw/01 Core_Memory/Math/Books/bathia-vedic-mathematics-made-easy.pdf`.

**Last updated**: 2026-05-22

![Duplex square root R1+R2 iteration](diagrams/math/duplex-square-root-iteration.png)

---

## Setup — grouping and digit count

Group the input into **2-digit pairs from the right**. The leftmost group may have 1 or 2 digits.

```
   65,536    →    6 | 55 | 36       (3 groups → 3-digit root)
   996,004   →   99 | 60 | 04       (3 groups → 3-digit root)
   529       →    5 | 29            (2 groups → 2-digit root)
   3249      →   32 | 49            (2 groups → 2-digit root)
```

**The root has as many digits as there are groups.** This is the structural fact that makes the iteration terminate.

### Decimal handling

For inputs with a decimal point: the *integer* part groups from right-to-left (as above). The *decimal* part groups from left-to-right starting just after the decimal point. If the decimal has an odd number of places, pad with a 0:

```
   538.7041  →   5 | 38 . 70 | 41        (integer: 2 groups; decimal: 2 groups)
   0.6       →   0 . 60                  (padded to even)
```

---

## The two rules

**R1 — quotient-into-divisor.** After every step, add the latest quotient digit onto the divisor to form a new divisor.

**R2 — suffix locks the multiplier.** A new divisor can only be multiplied by the digit that gets suffixed to it.

The divisor grows by adding the quotient (R1), and then a candidate digit is *appended* to the divisor, with the constraint that the divisor-after-suffix must equal the divisor-before-suffix × that digit (R2). This implicit equation determines what digit can be suffixed at each step.

---

## The algorithm

```
   1. Take the leftmost group. Find the largest n with n² ≤ leftmost group.
      → first quotient digit = n; first divisor = n; remainder = leftmost − n².
   2. Apply R1: new divisor = divisor + quotient (= 2n at this point).
   3. Bring down the next group; current dividend = (remainder concatenated with group).
   4. Apply R2: find digit d such that suffixing d to the new divisor and
      multiplying that whole number by d gives ≤ current dividend.
      → next quotient digit = d.
   5. Subtract; the new remainder feeds the next iteration.
   6. Repeat steps 2-5 until all groups consumed.
   7. If remainder ≠ 0 and you want decimal precision, switch to ordinary division.
```

The "suffix locks the multiplier" rule (R2) is what makes this Vedic-style and not just plain long division: in conventional methods you double the running root and then divide; here you treat the next quotient digit as both *appended to the divisor* and *the multiplier* simultaneously, giving a single algebraic equation per step.

---

## Worked examples

### √529 = 23

```
   Groups:               5 | 29
   Step 1: largest n with n² ≤ 5 → n = 2; n² = 4; remainder = 1
           Quotient so far: 2
   Step 2 (R1): new divisor = 2 + 2 = 4
   Step 3: bring down 29; current dividend = 129
   Step 4 (R2): find d such that 4d · d ≤ 129
                d=1: 41·1 = 41
                d=2: 42·2 = 84
                d=3: 43·3 = 129  ✓
   Step 5: 129 − 129 = 0
   Quotient: 23. Remainder 0. ✓
```

### √3249 = 57

```
   Groups:               32 | 49
   Step 1: n=5; 5² = 25; remainder = 7
   Step 2: new divisor = 5 + 5 = 10
   Step 3: bring down 49; current dividend = 749
   Step 4 (R2): find d such that 10d · d ≤ 749
                d=7: 107·7 = 749  ✓
   Step 5: 749 − 749 = 0
   Quotient: 57. Remainder 0. ✓
```

### √65,536 = 256

```
   Groups:               6 | 55 | 36
   Step 1: n=2; 2² = 4; remainder = 2; quotient = 2
   Step 2: divisor = 2 + 2 = 4
   Step 3: bring down 55; dividend = 255
   Step 4 (R2): find d such that 4d · d ≤ 255
                d=5: 45·5 = 225  ✓
                d=6: 46·6 = 276  ✗
   Step 5: 255 − 225 = 30; quotient so far = 25
   Step 6 (R1 again): divisor = 45 + 5 = 50
   Step 7: bring down 36; dividend = 3036
   Step 8 (R2): find d such that 50d · d ≤ 3036
                d=6: 506·6 = 3036  ✓
   Step 9: 3036 − 3036 = 0
   Quotient: 256. Remainder 0. ✓
```

### √792 ≈ 28.14 (imperfect)

```
   Groups:               7 | 92
   Step 1: n=2; remainder = 3; quotient = 2
   Step 2: divisor = 4; bring down 92 → dividend = 392
   Step 4 (R2): find d: 4d · d ≤ 392
                d=8: 48·8 = 384  ✓
   Step 5: 392 − 384 = 8; quotient = 28
   Continue: divisor = 48 + 8 = 56
            no more groups → switch to plain division
   8 / 56 ≈ 0.14   (or continue Vedic style by suffixing zeros)
   Quotient: 28.14 (approximate). 28² = 784, 29² = 841 → 792 is indeed between, closer to 28.14²
```

### √538.7041 = 23.21 (decimal input)

```
   Groups:               5 | 38 . 70 | 41
   Step 1: n=2; remainder = 1; divisor = 4
   Step 4: bring down 38 → 138; 4d·d ≤ 138 → d=3: 43·3 = 129 ✓; remainder = 9
   Step 6: divisor = 43 + 3 = 46; bring down 70 → 970
           crossed decimal point in dividend → put decimal in quotient: 23.
   Step 7: 46d·d ≤ 970 → d=2: 462·2 = 924 ✓; remainder = 46
   Step 8: divisor = 462 + 2 = 464; bring down 41 → 4641
   Step 9: 464d·d ≤ 4641 → d=1: 4641·1 = 4641 ✓; remainder = 0
   Quotient: 23.21. Remainder 0. ✓
```

---

## Why R1 and R2 work — algebraic identity

The classical long-division-style square root iterates the identity:

```
   (q + d)² = q² + 2qd + d² = q² + d(2q + d)
```

where `q` is the root-so-far and `d` is the next digit. At each step, you subtract `d(2q + d)` from the current remainder.

Bathia's recipe encodes this as:
- **R1** maintains `2q` (the quotient gets added to itself, which is the doubling)
- **R2** suffixes `d` to get `(2q)·10 + d = 2q+d` in the place-value sense, then multiplies by `d` to get `d(2q+d)`

So R1 and R2 together compute `d(2q+d)` per step, exactly matching the algebraic identity. The phrasing is a Vedic mnemonic that hides the algebra behind a procedural rule.

---

## Speed comparison

| Method | Speed for √7744 (perfect) | Speed for √500 (imperfect) | Constraint |
|---|---|---|---|
| [vedic-perfect-square-roots](./vedic-perfect-square-roots.md) (two-glance) | 3-5 s | N/A | Perfect only |
| Duplex (this page) | 10-20 s | 15-30 s | None |
| Conventional long division | 30-60 s | 30-60 s | None |
| [trachtenberg-squares-and-roots](./trachtenberg-squares-and-roots.md) | 8-15 s | 12-25 s | None |

The two-glance method is fastest *when applicable*; Duplex is the general fallback.

---

## Related pages

- [vedic-speed-math](./vedic-speed-math.md) — parent system
- [vedic-perfect-square-roots](./vedic-perfect-square-roots.md) — faster method when input is known-perfect
- [vedic-perfect-cube-roots](./vedic-perfect-cube-roots.md) — analogous two-glance method for cubes (no Duplex equivalent for cube roots in this book; see Newton's method)
- [trachtenberg-squares-and-roots](./trachtenberg-squares-and-roots.md) — alternative general algorithm
- [vedic-digit-sum-check](./vedic-digit-sum-check.md) — verify perfect-square cases by squaring back

---

## U — See (CAST)
1. 2-digit groups with running quotient and divisor
2. Suffix-and-multiply step: divisor + d, then × d

## D — Name (NEDF)
1. Duplex square root = two-rule iteration on 2-digit groups
2. Distinguisher: R1 (add quotient) + R2 (suffix locks multiplier) encode `d(2q+d)`
3. Failure mode: violating R2 (multiplying by a non-suffixed digit)

## F — Do (SPEAR)
1. Group from right; first digit by largest n with n² ≤ group
2. Loop R1 → R2 → subtract per group; continue past decimal if needed

## B — Watch (HEART)
1. Choosing too-large d in R2 (subtract fails)
2. Decimal grouping direction (left-to-right after the point)

## L — Predict (ORACLE)
1. Perfect square → predict remainder 0 at terminal group
2. n groups → predict n-digit root

## R — Act (GRACE)
1. New square root → check pre-filter for perfect-only fast method
2. Imperfect → run Duplex, continue past decimal to desired precision
