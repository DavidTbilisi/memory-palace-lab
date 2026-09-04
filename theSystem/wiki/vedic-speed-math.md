---
palace: strategic-memory
level: 3
domain: 10
room: 7
wiki_source: wiki/learning-systems/vedic-speed-math.md
---

# Vedic Speed Math

**Summary**: Course-shaped notes for the Udemy course *"Learn Vedic Speed Mathematics Systematically & Step by Step"*. Organized to track the 7-section curriculum 1:1 so notes can be augmented in place as each lecture is watched. Vedic methods are complementary to Soroban Learning Method — soroban is bead-driven place-value arithmetic; Vedic is algebraic-identity arithmetic anchored to base-10 powers.

**Sources**:
- Udemy course *"Learn Vedic Speed Mathematics Systematically & Step by Step"* — `udemy.com/course/speedmaths` (4.7★, 1,510 students, 4.5 hours, last updated April 2025).
- `raw/01 Core_Memory/Vedic Math/` — user's incremental notes on Base Method foundations (Sections 2, 3, 5) plus full Overview extracted from the course.
- Bathia, D. (n.d.). *Vedic Mathematics Made Easy*. PDF at `raw/01 Core_Memory/Math/Books/bathia-vedic-mathematics-made-easy.pdf` (ingested 2026-05-22). Source for the extension pages [vedic-perfect-cube-roots](./vedic-perfect-cube-roots.md), [vedic-perfect-square-roots](./vedic-perfect-square-roots.md), [vedic-duplex-square-roots](./vedic-duplex-square-roots.md), [vedic-cubing-anurupya](./vedic-cubing-anurupya.md), [vedic-magic-squares](./vedic-magic-squares.md), [vedic-digit-sum-check](./vedic-digit-sum-check.md).
- Handley, B. (2003). *Speed Mathematics: Secret Skills for Quick Calculation*. Wiley. PDF at `raw/01 Core_Memory/Math/Books/handley-speed-mathematics-wiley-2003.pdf`. Western synthesis — see [handley-speed-mathematics](./handley-speed-mathematics.md) for the mapping between Handley's "Reference Number" vocabulary and the Vedic Working Base.

**Last updated**: 2026-05-22 (added Bathia + Handley as canonical sources; cross-linked extension pages for cube roots, square roots, magic squares, digit-sum check, Anurupya cubing).

---

## Course-wide conventions

Five definitions are the load-bearing vocabulary across every Section-2 case. They are the user's terminology from the raw note, confirmed against the course's lecture slides.

- **Base** — any positive integer ending in 0 (10, 40, 60, 80, 100, 500, 700, 1800, 3100, 6500, …). Used as a multiplication anchor. *Not* bases: 12, 88, 149, 1478, 3697, 47896.
- **Working base** — a base that is *specifically a power of 10* (10, 100, 1000, 10000, 100000). Every working base is a base; not every base is a working base. 60, 500, 1800 are bases but not working bases. Determines the right-part digit budget when the calculation uses a working base directly.
- **Complement** — `Number − Base` when the result is **negative**. Examples from the course: `8 − 10 = −2`, `93 − 100 = −7`, `87 − 100 = −13`, `974 − 1000 = −26`, `845 − 1000 = −155`, `57 − 60 = −3`, `1846 − 1900 = −54`, `1846 − 2000 = −154`. The choice of base matters — `1846` has complement `−54` from base 1900 but `−154` from base 2000. Closer base = smaller offset = easier arithmetic.
- **Surplus** — `Number − Base` when the result is **positive**. Examples: `12 − 10 = +2`, `107 − 100 = +7`, `1039 − 1000 = +39`, `1145 − 1000 = +145`, `12364 − 10000 = +2364`, `57 − 50 = +7`, `1846 − 1800 = +46`.
- **Base Multiple (BM)** — for a *non-working-base* (e.g. 60, 500), `BM = base / power-of-10`. Computed by discarding ending zeros: BM(60)=6, BM(80)=8, BM(500)=5, BM(4200)=42, BM(74800)=748. Used in Case 5 (sub-base method) to scale the left part back to the true magnitude.
- **Right-part digit budget** — the answer's right part must have exactly as many digits as there are zeros in the chosen base. Base 100 → 2 digits, base 1000 → 3 digits, base 60 → 1 digit, base 500 → 2 digits. Any overflow carries into the left part.

The entire Section 2 ladder (Cases 1–5) is the same algebraic identity in five sign / scaling regimes:

`(B + a)(B + b)  =  B·(B + a + b)  +  a·b`

| Formula segment | Role |
|---|---|
| `B·(B + a + b)` | left part |
| `a·b` | right part |

`B` = base. `a`, `b` = signed offsets. *Cross-add* on the left when offsets are same-signed; *cross-subtract* when they differ (formally still cross-add because the offset is signed). For non-working bases (Case 5), multiply the left by `BM = B / 10ᵏ` to recover the true magnitude.

---

## Section 1: Introduction to Vedic Speed Mathematics (2 lectures, 3 min)

Lecture titles not yet captured — sidebar shows them collapsed. Typical content for an introductory section:

- **Lecture 1**: *[title pending]* — likely course intro, origin (Bharati Krishna Tirthaji, 16 sutras), motivation.
- **Lecture 2**: *[title pending]* — likely roadmap / "why this works."

> Fill in titles after watching.

---

## Section 2: Multiplication using Base Method (7 lectures, 35 min)

Foundational section. Five sign / scaling regimes of the identity above, plus the universal **carry rule** and the new **Base Multiple** concept introduced in Case 5.

### Carry rule (general, applies to all cases)

If the right part of the intermediate result has more digits than the digit budget, **transfer the leftmost excess digit(s) into the left part** as a carry. Examples:

```
   Base 100 (budget 2):    130 | 144  →  130+1 | 44  =  13144
   Base 1000 (budget 3):  1068 | -960 →  needs sign-conversion first (Case 3)
   Base 60   (budget 1):    71 | 24   →  71·6 + 2 | 4  =  4284 (Case 5)
```

### 3. Introduction to Base Method (3 min) — ✓ watched

General framing: when both factors lie close to a base, multiplication collapses into a tiny cross-addition plus a small product. Most efficient Vedic multiplication when both factors are close to a base; otherwise use Section 3's Criss-Cross.

### 4. Case 1: Both numbers below Working Base (7 min) — ✓ watched

Both offsets negative (both numbers are complements). Cross-add on the left (signed: number + other-offset). Multiply complements on the right.

**Worked example: 89 × 92** (base 100, both below)

```
   89  →  complement −11
   92  →  complement −8
   ──────────────────────────────────────
   Left   :  89 + (−8) = 81     ( = 92 + (−11) )
   Right  :  (−11)·(−8) = 88     (already 2 digits, no carry)
   ──────────────────────────────────────
   Answer :  81 | 88  =  8188
```

### 5. Case 2: Both numbers above Working Base (5 min)

Both offsets positive (both numbers are surpluses). Cross-add on the left; multiply surpluses on the right.

**Worked example: 112 × 108** (base 100, both above)

```
   112  →  surplus +12
   108  →  surplus +8
   ──────────────────────────────────────
   Left   :  112 + 8 = 120      ( = 108 + 12 )
   Right  :  12·8 = 96           (2-digit budget, no carry)
   ──────────────────────────────────────
   Answer :  120 | 96  =  12096
```

**Worked example with carry: 106 × 124** (base 100, both above, right overflows)

```
   106  →  surplus +6
   124  →  surplus +24
   ──────────────────────────────────────
   Left   :  106 + 24 = 130     ( = 124 + 6 )
   Right  :  6·24 = 144          (3 digits, budget 2 → transfer 1)
   Carry  :  130 + 1 | 44
   ──────────────────────────────────────
   Answer :  131 | 44  =  13144
```

### 6. Case 3: One below, one above Working Base (7 min)

Mixed signs → right part is **negative**. Convert to positive by borrowing one full base unit from the left.

**Worked example: 988 × 1080** (base 1000, mixed)

```
   988   →  complement  −12
   1080  →  surplus     +80
   ──────────────────────────────────────
   Left   :  988 + 80 = 1068    ( = 1080 + (−12) )
   Right  :  (−12)·80 = −960     (negative — must convert)
   Convert:  −960 + 1000 = +40,  AND subtract 1 from left → 1068 − 1 = 1067
   Pad    :  base 1000 budget is 3 digits → 040
   ──────────────────────────────────────
   Answer :  1067 | 040  =  1067040
```

The convert-and-borrow step generalises: **`−r → (base − r)` and subtract 1 from left part**. This is exactly subtracting `base` from the left, then adding back `base − r` to the right (same magnitude, no algebra change).

### 7. Case 4: Two Different Working Bases (7 min)

Two factors near *different* working bases (e.g. 94 near 100, 988 near 1000). Method: **scale the smaller-base factor up by 10 (or 100…) to bring both factors to a common base, solve, then divide the final answer by the same factor.**

**Worked example: 94 × 988**

```
   94   is near base 100
   988  is near base 1000
   Bases differ by factor 10.
   ──────────────────────────────────────
   Multiply 94 by 10  →  940.  Now both factors share base 1000.
   Solve 940 × 988 with Case 3 (940 = −60 from 1000, 988 = −12 from 1000).
   At the end, cut one zero from the answer to recover 94 × 988.
```

### 8. Case 5: Not nearer to Working Base (6 min) — *sub-base via Base Multiple*

When neither number is near a power of 10, pick a **non-working base** that *is* near both numbers (e.g. 60 for 63 and 68, or 500 for 484 and 470). The cross-step uses this base; then **multiply the left part by the Base Multiple (BM)** to recover true magnitude.

**Worked example: 63 × 68** (base 60, BM = 6)

```
   63   →  surplus +3
   68   →  surplus +8
   Base =  60  (not a working base)
   BM   =  6   (60 / 10)
   ──────────────────────────────────────
   Cross :  68 + 3 = 71         ( = 63 + 8 )
   Right :  3 · 8 = 24
   Scale :  Left × BM  →  71 · 6 = 426
   Budget:  base 60 has 1 zero → right needs 1 digit; have 24 (2 digits) → transfer 2
   Carry :  426 + 2 | 4
   ──────────────────────────────────────
   Answer:  428 | 4  =  4284
```

**Worked example: 484 × 470** (base 500, BM = 5)

```
   484  →  complement  −16
   470  →  complement  −30
   Base =  500  (not a working base)
   BM   =  5    (500 / 100)
   ──────────────────────────────────────
   Cross :  484 − 30 = 454      ( = 470 − 16 )
   Right :  (−16)·(−30) = 480
   Scale :  Left × BM  →  454 · 5 = 2270
   Budget:  base 500 has 2 zeros → right needs 2 digits; have 480 (3 digits) → transfer 4
   Carry :  2270 + 4 | 80
   ──────────────────────────────────────
   Answer:  2274 | 80  =  227480
```

**Instructor's note on Case 5**: *"Case 5 is little tricky as compared to other cases (1 to 4). There is an alternative for Case 5 (as well as to all other Cases). Alternative method is Criss-Cross Method. You can prefer Criss-Cross over Base Method (Case 5 or any other cases)."* Criss-Cross is universal; Base Method is faster only when both numbers are genuinely near a base.

### Assignment 1: Multiplication using Base Method

Practice problem set — log results and any patterns of error here when completed.

---

## Section 3: Multiplication using Criss-Cross Method (5 lectures, 33 min)

**Core sutra**: *Urdhva-Tiryagbhyam* — "Vertically and Crosswise." The instructor's framing: *"You can apply Criss-Cross Method to any Numbers. In Criss-Cross Method, you no need to remember any formula. You need to remember simple Pattern. Using the pattern we can easily solve any complex problem."*

When to use: numbers not close to a base. Base Method is preferred for near-base; Criss-Cross is universal and always works.

### The 2-digit × 2-digit pattern — 3 parts

For `ab × cd`, the answer has **three parts**: First, Middle (Second), Last.

```p5 height=300
p.setup = () => { p.createCanvas(Math.min(el.clientWidth || 460, 460), 300); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54';
  const gold = '#a08a5c';
  const rose = '#a07d78';
  p.background(p.isDark ? 30 : 245);

  const xL = p.width / 2 - 50, xR = p.width / 2 + 50;
  const topY = 50, botY = 130;

  p.textAlign(p.CENTER, p.CENTER);
  p.noStroke();
  p.fill(ink);
  p.textSize(22);
  p.text('a', xL, topY);
  p.text('b', xR, topY);
  p.text('c', xL, botY);
  p.text('d', xR, botY);
  p.textSize(13);
  p.text('(first number: a b)', p.width / 2, topY - 22);
  p.text('(second number: c d)', p.width / 2, botY + 22);

  p.stroke(green);
  p.strokeWeight(2);
  p.line(xL, topY + 14, xL, botY - 14);

  p.stroke(rose);
  p.line(xR, topY + 14, xR, botY - 14);

  p.stroke(gold);
  p.line(xL + 10, topY + 10, xR - 10, botY - 10);
  p.line(xR - 10, topY + 10, xL + 10, botY - 10);

  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(14);
  let y = botY + 60;
  p.fill(green);
  p.text('First  =  a·c   (leftmost digits)', 20, y); y += 24;
  p.fill(gold);
  p.text('Middle =  a·d + b·c   (the criss-cross)', 20, y); y += 24;
  p.fill(rose);
  p.text('Last   =  b·d   (rightmost digits)', 20, y);
};
```

- **First Part** = leftmost digits multiplied: `a · c`
- **Last Part** = rightmost digits multiplied: `b · d`
- **Middle (Second) Part** = the criss-cross: `a·d + b·c`

Then apply the **digit-budget rule**: each part *except First* must have only **one digit**. Transfer leftmost excess digits to the immediate left part.

**Worked example: 65 × 29**

```p5 height=380
p.setup = () => { p.createCanvas(Math.min(el.clientWidth || 520, 520), 380); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54';
  const gold = '#a08a5c';
  const rose = '#a07d78';
  p.background(p.isDark ? 30 : 245);

  const xL = p.width / 2 - 50, xR = p.width / 2 + 50;
  const topY = 40, botY = 110;

  p.textAlign(p.CENTER, p.CENTER);
  p.noStroke();
  p.fill(ink);
  p.textSize(24);
  p.text('6', xL, topY);
  p.text('5', xR, topY);
  p.text('2', xL, botY);
  p.text('9', xR, botY);

  p.stroke(green);
  p.strokeWeight(2);
  p.line(xL, topY + 16, xL, botY - 16);
  p.stroke(rose);
  p.line(xR, topY + 16, xR, botY - 16);
  p.stroke(gold);
  p.line(xL + 10, topY + 12, xR - 10, botY - 12);
  p.line(xR - 10, topY + 12, xL + 10, botY - 12);

  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(13);
  let y = botY + 40;
  p.fill(green);
  p.text('First:  6·2 = 12', 20, y); y += 22;
  p.fill(gold);
  p.text('Middle: (6·9)+(5·2) = 54+10 = 64', 20, y); y += 22;
  p.fill(rose);
  p.text('Last:   5·9 = 45', 20, y); y += 30;

  p.fill(ink);
  p.text('Initial assembly:            12 | 64 | 45', 20, y); y += 22;
  p.text('Transfer 4 (from 45) left:   12 | 64+4 | 5   →   12 | 68 | 5', 20, y); y += 22;
  p.text('Transfer 6 (from 68) left:   12+6 | 8 | 5   →   18 | 8 | 5', 20, y); y += 30;

  p.textStyle(p.BOLD);
  p.textSize(16);
  p.text('Answer: 1885', 20, y);
  p.textStyle(p.NORMAL);
};
```

The transfers cascade right-to-left, exactly like normal addition carries.

### The 3-digit × 3-digit pattern — 5 parts

For `abc × def`, the answer has **five parts**:

```p5 height=360
p.setup = () => { p.createCanvas(Math.min(el.clientWidth || 520, 520), 360); p.noLoop(); };
p.draw = () => {
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54', blue = '#7d8aa0', gold = '#a08a5c', rose = '#a07d78', slate = '#808a90';
  p.background(p.isDark ? 30 : 245);

  const midX = p.width / 2;
  const x0 = midX - 90, x1 = midX, x2 = midX + 90;
  const topY = 50, botY = 160;

  const pts = {
    a: [x0, topY], b: [x1, topY], c: [x2, topY],
    d: [x0, botY], e: [x1, botY], f: [x2, botY]
  };

  p.textAlign(p.CENTER, p.CENTER);
  p.noStroke();
  p.fill(ink);
  p.textSize(24);
  for (const k of ['a', 'b', 'c', 'd', 'e', 'f']) {
    p.text(k, pts[k][0], pts[k][1]);
  }

  const lineFn = (p1, p2, col) => {
    p.stroke(col);
    p.strokeWeight(2);
    const inset = 16;
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    p.line(p1[0] + ux * inset, p1[1] + uy * inset, p2[0] - ux * inset, p2[1] - uy * inset);
  };

  lineFn(pts.a, pts.d, green);   // 1st: a·d
  lineFn(pts.a, pts.e, gold);    // 2nd: a·e
  lineFn(pts.b, pts.d, gold);    // 2nd: b·d
  lineFn(pts.a, pts.f, slate);   // 3rd: a·f
  lineFn(pts.b, pts.e, slate);   // 3rd: b·e
  lineFn(pts.c, pts.d, slate);   // 3rd: c·d
  lineFn(pts.b, pts.f, rose);    // 4th: b·f
  lineFn(pts.c, pts.e, rose);    // 4th: c·e
  lineFn(pts.c, pts.f, blue);    // 5th: c·f

  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(13);
  let y = botY + 40;
  p.fill(green); p.text('1st = a·d', 20, y); y += 20;
  p.fill(gold);  p.text('2nd = a·e + b·d', 20, y); y += 20;
  p.fill(slate); p.text('3rd = a·f + b·e + c·d', 20, y); y += 20;
  p.fill(rose);  p.text('4th = b·f + c·e', 20, y); y += 20;
  p.fill(blue);  p.text('5th = c·f', 20, y); y += 26;

  p.fill(ink);
  p.text('Column k (0-indexed from left) = sum of all pairs whose digit-indices sum to k.', 20, y);
};
```

Pattern: at column `k` from the right (0-indexed), sum *all* pairs whose digit-indices sum to `k`. This is exactly **polynomial multiplication** with the digits as coefficients — Criss-Cross IS the schoolbook polynomial-product algorithm with the lines drawn as criss-crosses instead of columns.

For an `m`-digit × `n`-digit product, the answer has `m + n − 1` parts. 2×2 → 3 parts; 3×3 → 5 parts; 4×4 → 7 parts; 2×3 → 4 parts.

### General digit-budget rule

Every part except the First (leftmost) must have one digit. Transfer cascades rightmost-to-leftmost, parallel to standard addition-carry semantics.

For Vedic-trained mental work this carries an extra benefit: the parts can be computed **in any order**. Compute Last first (easy), then Middle (the cross), then First (also easy), then walk the transfers. The mental procedure is steady — no need to hold every column in working memory simultaneously.

> Lecture titles 9–13 (specific titles): to backfill when sidebar is expanded.

---

## Section 4: Multiplication — Special Cases (8 lectures, 31 min)

Likely covers standard pattern-shortcuts (instructor may sequence differently):

- Multiplication by 11 (write outer digits, fill middle with running pairwise sums)
- Squaring numbers ending in 5 — `(n5)² = n·(n+1) | 25`
- Same tens digit, units summing to 10 — e.g. `43 × 47 = 4·5 | 3·7 = 2021`
- Multiplication by 9, 99, 999 (complement-based)
- Multiplication by 5 or powers of 5 (multiply by 10 then halve)
- Squaring near 50 or near 100 (uses Base Method as a special case)

> Confirm against lecture titles as watched.

---

## Section 5: Introduction to Division (1 lecture, 1 min)

One-minute framing lecture — likely introduces *why* division has two distinct Vedic methods (proximity-to-base vs. general) and signposts to Sections 6 and 7.

---

## Section 6: Division using Transpose and Apply (5 lectures, 39 min)

**Nikhilam-derived division.** Mirror image of the Base Method for multiplication: when the divisor is close to (but below) a power of 10 (e.g. 89, 98, 996), division collapses into repeated addition of the divisor's complement to running digits.

Rough sketch (instructor's worked recipe to fill in):

```
   dividend / 89    (complement of 89 from 100 is 11)
   ────────────────────────────────────────────────
   bring down digits; for each quotient digit produced,
   add (quotient_digit · complement) into the next
   dividend digits before producing the next quotient.
```

> Capture exact procedure and a worked example from each of the 5 lectures.

---

## Section 7: Division using Flag Method (2 lectures, 10 min)

**Dhvajanka — "Flag" method.** General-purpose division for any divisor — analogue of Criss-Cross for division. Treat the divisor as a small main-divisor plus a "flag digit" (its trailing part). Each quotient digit, once produced, has (quotient · flag) subtracted from the next dividend digit before the next quotient is taken.

Example shape (capture instructor's worked recipe):

```
   dividing by 47:  main = 4, flag = 7
   each step:  trial quotient ← next dividend ÷ 4
               adjusted dividend ← (next chunk) − (quotient · 7)
               repeat
```

---

## When to use which method (decision table)

| Situation | Method | Why |
|---|---|---|
| Both factors near a power of 10 | Base Method (§2 Case 1–3) | Cross step is one addition; right part is a tiny product |
| Both factors near the same sub-base (50, 60, 250…) | Base Method Case 5 (§2.8) | Same identity, scaling factor on the left |
| Factors near *different* bases | Base Method Case 4 (§2.7) | Same identity, scaling factor on the offset |
| Factors far from any base | Criss-Cross (§3) | General; scales digit-by-digit; no proximity condition |
| Patterned factors (×11, ×99, ends-in-5, halves to 10…) | Special Cases (§4) | Pattern-specific shortcut beats Criss-Cross |
| Divisor near a power of 10 | Transpose & Apply (§6) | Mirror of Base Method |
| Any divisor | Flag Method (§7) | General; scales like Criss-Cross |

---

## How this complements Soroban and Trachtenberg

The three mental-arithmetic substrates in the wiki are not interchangeable; they trade off against substrate cost, prerequisite, and operand-shape sweet spot. Use them together:

- Soroban Learning Method is **place-value bead arithmetic** with friend-of-5 / friend-of-10 complements; it excels at *streaming accumulation* — long columns of additions, subtractions, and chained operations where state is held on the rods. Requires a bead substrate (real or mental).
- **Vedic** is **algebraic-identity arithmetic** anchored to base-10 powers; it excels at *single-shot compact products and quotients* of numbers close to round anchors, where the answer arrives in one cross-step plus one small product. Requires the algebraic prior and a peg-image substrate.
- [trachtenberg-system](./trachtenberg-system.md) is **digit-walking arithmetic** with rules per single-digit multiplier (×3..×12) plus a general two-finger method for arbitrary `a × b`. It excels at *uniform-speed multiplication across any operand shape* and is the only one of the three that works with **no substrate beyond working memory itself** — no bead visualisation, no algebraic prior. It is the minimal-substrate extreme in [substrate-algorithm-composition](./substrate-algorithm-composition.md) and the recommended mental-math system under the [memory-palace-for-aphantasia](./memory-palace-for-aphantasia.md) constraint.

The three systems are not redundant. A serious mental-calculation stack uses all three: soroban for ledger-style sums, Vedic for one-off product/quotient finishing moves near a clean base, Trachtenberg for uniform-speed arbitrary-shape multiplication and pen-and-paper-free settings. See [trachtenberg-system](./trachtenberg-system.md) §"Trachtenberg vs Vedic vs Soroban" for the 11-property comparison table.

---

## Analogies — make the operations stick

Each Vedic-math operation maps onto a familiar mental image. Use these as scaffolds before the encoded NEDF scenes ([vedic-multiplication-nedf-deck](./vedic-multiplication-nedf-deck.md)) take over.

| Operation | Familiar analogy |
|---|---|
| **Base** | A magnetic *anchor point* — numbers near it "snap" to it for easy reasoning. Like timezones snapping to noon. |
| **Working base** | A *power outlet* — the universal anchor (10, 100, 1000…); base-method's most efficient socket. |
| **Complement** (negative offset) | The number's *debt* to the base. 89 owes 11 to reach 100. |
| **Surplus** (positive offset) | The number's *credit* over the base. 108 has +8 in its account vs 100. |
| **Cross-add for left part** | A *swap-and-pay* — A pays B's debt and the total comes out the same as B paying A's debt. Both yield the same left part. |
| **Right part (offset product)** | A *side-bet* — only the small offsets get multiplied; the big base stays out of it. |
| **Carry rule** | A *fixed-width display* — the right part is a slot of fixed digit-width; any overflow tips into the slot to its left, like cash drawer overflow into the next bill. |
| **Sign conversion in Case 3** | A *borrow* — exactly like subtraction: when the right is "in the red," borrow one base unit from the left to put the right back in the black. |
| **Base Multiple (BM)** in Case 5 | A *currency conversion rate* — base 60 is "minute-currency," 1 minute = 6 of the underlying 10-unit. Multiply left by 6 to convert back. Base 500 = "half-thousand-currency," BM = 5. |
| **Criss-Cross** | *X marks the spot* — literally draw X's between columns; each X is one cross-product. For 3-digit × 3-digit, the X-pattern grows into a diamond. Equivalent to polynomial multiplication with digits as coefficients. |
| **Choice of base** | *Choosing your gym* — you pick the base that's closest to your numbers, just like picking the gym closest to your house. Closer = less commute (smaller offsets) = less effort. |
| **Case-1-vs-Case-2-vs-Case-3** | *Both broke / both rich / mixed wallets* — Case 1: both numbers owe the base. Case 2: both have credit. Case 3: one owes, one has credit; net out the difference. |

---

## Open items to backfill

1. Section 1 lecture titles (both lectures collapsed in sidebar at last capture).
2. Section 4 (Special Cases), Section 6 (Transpose & Apply), Section 7 (Flag) lecture titles.
3. Section 4 sub-topic ordering — confirm which patterned shortcuts the instructor selected and in what order.
4. Each of the 5 Transpose-and-Apply lectures and 2 Flag-method lectures — worked examples and the precise digit-routing recipe.
5. Section 3 (Criss-Cross) lecture-by-lecture: instructor likely sequences as 2×2 → 3×3 → 4×4 → carry mechanics → mixed examples; confirm sequence.

---

## Related pages

- [vedic-multiplication-nedf-deck](./vedic-multiplication-nedf-deck.md) — full NEDF+REMAPS encoded deck for every concept on this page (Base, Working Base, Complement, Surplus, Base Multiple, Cases 1–5, Carry rule, Criss-Cross 3-part and 5-part patterns)
- [vedic-speed-math-skill-ceiling](./vedic-speed-math-skill-ceiling.md) — calibrated speed numbers, areas of impact, and decision frame for whether to invest the ~100–1,000 hours
- [calendar-reflex](./calendar-reflex.md) — downstream unlock riding on the Vedic substrate (day-of-week reflex via Doomsday)
- [substrate-algorithm-composition](./substrate-algorithm-composition.md) — names the architectural primitive Vedic+pegs is an instance of
- [composability-index](./composability-index.md) — Vedic+pegs is one confirmed unlock; the page lists more candidates involving Vedic
- Soroban Learning Method
- [soroban-drill-ladder](./soroban-drill-ladder.md)
- [trachtenberg-system](./trachtenberg-system.md) — third mental-arithmetic substrate; minimal-substrate extreme; uniform-speed across any operand shape
- [math-learning-with-neural-os](./math-learning-with-neural-os.md)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md)
- [symbolic-fluency-drill-ladder](./symbolic-fluency-drill-ladder.md)


---

## U — See (CAST)
1. Course-shaped notes for 7-section Vedic course
2. Algebraic-identity arithmetic anchored to base-10 powers

## D — Name (NEDF)
1. Vedic speed math = course-notes spine for Vedic methods
2. Distinguisher: algebraic identities, not bead arithmetic
3. Failure mode: confusing with soroban approach

## F — Do (SPEAR)
1. Section by section → study + drill
2. Apply sutra to actual problems

## B — Watch (HEART)
1. Soroban-method drift
2. Skipping the sutra contract

## L — Predict (ORACLE)
1. Multiplication shape → predict sutra
2. Section → predict skill gain

## R — Act (GRACE)
1. Course week → study section
2. Calculation → recall sutra