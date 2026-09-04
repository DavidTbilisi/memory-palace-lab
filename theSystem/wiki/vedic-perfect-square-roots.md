---
palace: strategic-memory
level: 3
domain: 10
room: 16
wiki_source: wiki/learning-systems/vedic-perfect-square-roots.md
---

# Vedic Perfect Square Roots — Two-Glance With Tie-Break

**Summary**: Bathia's perfect square root method ([vedic-speed-math](./vedic-speed-math.md) extension, *Vedic Mathematics Made Easy* Ch 5) finds the root of a 3-to-6-digit perfect square in 3-5 seconds. The last digit of the square gives a *disjunctive* candidate set (2 possibilities) via the same last-digit pattern as squaring; the value of the input brackets the root between two consecutive 10n values, yielding 1 candidate from each tens-range; and a closer-to-which-boundary tie-break picks between the two. The disjunction is the structural difference vs. cube roots ([vedic-perfect-cube-roots](./vedic-perfect-cube-roots.md)): cubing is *injective* mod 10, but squaring is *2-to-1* mod 10. Most cube-root last-digits have one inverse; most square-root last-digits have two.

**Sources**:
- Bathia, D. (n.d.) *Vedic Mathematics Made Easy* — Chapter 5 "Square Roots of Perfect Squares", pp. 41–50. PDF at `raw/01 Core_Memory/Math/Books/bathia-vedic-mathematics-made-easy.pdf`.

**Last updated**: 2026-05-22

![Square root disjunctive last-digit map](diagrams/math/square-root-disjunctive-map.png)

---

## Prerequisites — the last-digit table

Memorise squares of 1 through 10:

```
   1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49, 8²=64, 9²=81, 10²=100
```

The last-digit pattern of squares:

```
   1² = 01 → ends in 1            6² = 36 → ends in 6
   2² = 04 → ends in 4            7² = 49 → ends in 9
   3² = 09 → ends in 9            8² = 64 → ends in 4
   4² = 16 → ends in 6            9² = 81 → ends in 1
   5² = 25 → ends in 5           10² = 100 → ends in 0
```

The disjunctive inverse map (square ending in → root ends in):

| Square ends in | Root ends in |
|---|---|
| 0 | 0 |
| 1 | 1 or 9 |
| 4 | 2 or 8 |
| 5 | 5 |
| 6 | 4 or 6 |
| 9 | 3 or 7 |

### The forbidden last digits

```
   2, 3, 7, 8  →  no perfect square ever ends in these digits
```

If the input ends in 2, 3, 7, or 8, it is not a perfect square — abort. This is a fast prefilter.

---

## The algorithm

```
   1. Read the last digit of the square N → 1 or 2 candidate last digits for the root
   2. Find the unique k such that (10k)² ≤ N < (10(k+1))²
      → the root is in [10k, 10(k+1)]; both candidate last digits give a
        full two-digit candidate root
   3. Tie-break: is N closer to (10k)² or to (10(k+1))²?
      → if closer to lower: take the candidate with the smaller last digit
      → if closer to upper: take the candidate with the larger last digit
   4. The selected candidate is the root
```

For inputs ending in 0 or 5, step 1 already gives a unique answer; no tie-break needed.

### Worked: √7744

```
   Last digit:          4 → root ends in 2 or 8
   Bracket:             80² = 6400 ≤ 7744 < 8100 = 90²  →  root in [80, 90]
   Candidates:          82 or 88
   Tie-break:           7744 is closer to 8100 (upper)  →  take 88
   Root = 88            ✓ (88² = 7744)
```

### Worked: √9801

```
   Last digit:          1 → root ends in 1 or 9
   Bracket:             90² = 8100 ≤ 9801 < 10000 = 100²  →  root in [90, 100]
   Candidates:          91 or 99
   Tie-break:           9801 is closer to 10000 (upper)  →  take 99
   Root = 99            ✓ (99² = 9801)
```

### Worked: √5184

```
   Last digit:          4 → root ends in 2 or 8
   Bracket:             70² = 4900 ≤ 5184 < 6400 = 80²  →  root in [70, 80]
   Candidates:          72 or 78
   Tie-break:           5184 is closer to 4900 (lower)  →  take 72
   Root = 72            ✓ (72² = 5184)
```

### Worked: √529

```
   Last digit:          9 → root ends in 3 or 7
   Bracket:             20² = 400 ≤ 529 < 900 = 30²  →  root in [20, 30]
   Candidates:          23 or 27
   Tie-break:           529 is closer to 400 (lower)  →  take 23
   Root = 23            ✓ (23² = 529)
```

---

## Three-digit roots — extension

For 5-to-6-digit squares (roots in 100..999 range), the bracketing step uses the squares of multiples of 10: `100², 110², 120², …`. The book extends the memorized key to include `11² = 121, 12² = 144, …, 20² = 400` to support this.

### Worked: √12,544

```
   Last digit:          4 → root ends in 2 or 8
   Bracket:             110² = 12,100 ≤ 12,544 < 14,400 = 120²  →  root in [110, 120]
   Candidates:          112 or 118
   Tie-break:           12,544 is closer to 12,100 (lower)  →  take 112
   Root = 112           ✓ (112² = 12,544)
```

### Worked: √25,281

```
   Last digit:          1 → root ends in 1 or 9
   Bracket:             150² = 22,500 ≤ 25,281 < 25,600 = 160²  →  root in [150, 160]
   Candidates:          151 or 159
   Tie-break:           25,281 is closer to 25,600 (upper)  →  take 159
   Root = 159           ✓ (159² = 25,281)
```

---

## Why this works — modular structure of squaring

`n² mod 10` depends only on `n mod 10`. The map `n mod 10 → n² mod 10` is:

```
   0→0   1→1   2→4   3→9   4→6   5→5   6→6   7→9   8→4   9→1
```

Notice:
- `0` and `5` each have a unique inverse (the only fixed points where squaring mod 10 is injective)
- All others come in pairs: `{1, 9} → 1`, `{2, 8} → 4`, `{3, 7} → 9`, `{4, 6} → 6`
- The digits `2, 3, 7, 8` never appear in the image — hence no perfect square ends in these

This is the *quadratic residues mod 10*. The structural fact is that squaring is a 2-to-1 map on the multiplicative group of integers mod 10 (excluding 5 and 0 which are 1-to-1).

The bracketing step localises the root to a 10-wide range, leaving exactly the disjunctive pair from the modular structure as candidates. The closer-to-boundary heuristic resolves the disjunction by *quadratic interpolation* — within a tens-range, the squares are not evenly spaced, and the midpoint between `(10k)²` and `(10(k+1))²` falls closer to `(10k)²` for larger `k`. The book's heuristic ("closer to lower boundary → smaller root") works because squares grow superlinearly, so the gap widens at the top of each tens-range.

---

## Hard constraint — perfect squares only

Like [vedic-perfect-cube-roots](./vedic-perfect-cube-roots.md), this method only works on perfect squares. For imperfect squares (general inputs), use [vedic-duplex-square-roots](./vedic-duplex-square-roots.md) which handles both.

**Pre-filter check:**
- Input ends in 2, 3, 7, or 8 → not a perfect square; abort
- Input ends in 0 → must end in an *even* number of zeros to be a perfect square
- Input passes prefilter → run the algorithm, then verify by squaring the result

---

## Composing with [vedic-perfect-cube-roots](./vedic-perfect-cube-roots.md)

| Property | Cube root | Square root |
|---|---|---|
| Last-digit map | Injective (single inverse) | 2-to-1 (disjunctive inverse) |
| Tie-break needed? | No | Yes (when last digit ≠ 0, 5) |
| Bracket | Cubes of 1..10 | Squares of multiples of 10 |
| Forbidden last digits | None (all 0-9 appear) | 2, 3, 7, 8 |
| Speed (2-digit answer) | 2-3 seconds | 3-5 seconds |

The cube-root method is structurally simpler because cubing mod 10 is injective. Squaring mod 10 fails to be injective, so the square-root method requires the additional tie-break step.

---

## Related pages

- [vedic-speed-math](./vedic-speed-math.md) — parent system
- [vedic-perfect-cube-roots](./vedic-perfect-cube-roots.md) — companion method; structurally simpler (no tie-break)
- [vedic-duplex-square-roots](./vedic-duplex-square-roots.md) — general method for imperfect squares
- [trachtenberg-squares-and-roots](./trachtenberg-squares-and-roots.md) — alternative algorithm (Trachtenberg's structural method)
- [vedic-digit-sum-check](./vedic-digit-sum-check.md) — verify by squaring the result and digit-sum-matching

---

## U — See (CAST)
1. Last digit gives 1 or 2 candidates; bracket gives tens-range
2. Closer-to-boundary picks between candidates

## D — Name (NEDF)
1. Vedic perfect square root = last-digit map + bracket + tie-break
2. Distinguisher: disjunctive last-digit map (vs. injective for cube root)
3. Failure mode: skipping tie-break and just picking smaller candidate

## F — Do (SPEAR)
1. Last-digit lookup → candidate set
2. Bracket → tens-range; tie-break by which boundary is closer

## B — Watch (HEART)
1. Mis-bracketing (off-by-one in tens)
2. Forgetting that 2/3/7/8 endings disqualify

## L — Predict (ORACLE)
1. Last digit 0 or 5 → predict no tie-break needed
2. Closer to lower bracket → predict smaller last-digit candidate

## R — Act (GRACE)
1. See square → check last digit for forbidden set
2. Run two-glance + tie-break
