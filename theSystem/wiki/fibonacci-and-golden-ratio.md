---
palace: meta-knowledge
level: 5
domain: 8
room: 9
wiki_source: wiki/problem-solving/fibonacci-and-golden-ratio.md
---

# Fibonacci Numbers and the Golden Ratio

**Summary**: Two deeply linked mathematical objects: the **Fibonacci sequence** (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ... — each term the sum of the previous two) and **φ (phi) ≈ 1.6180339887...** (the golden ratio, the unique positive root of x² = x + 1). The ratio of consecutive Fibonacci terms converges to φ; φ is the irrational root of `φ² = φ + 1`; the golden rectangle (dimensions 1 : φ) is the most aesthetically-celebrated rectangle in art and architecture. Burger and Starbird's [*Heart of Mathematics*](./burger-heart-of-mathematics.md) Ch 2.2 (pp. 105–120) and Ch 4.3 (pp. 301–319) treat both as illustrations of *"numerical patterns in nature."* The wiki cares about the pair because they are operational primitives in [memory-palace](./memory-palace.md) anchor selection, [remaps](./remaps.md) composition rules, and the [world-velvet-aeon](./world-velvet-aeon.md) visual-style spec.

**Sources**: [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) Ch 2.2 ("Numerical Patterns in Nature — Discovering the Beauty of the Fibonacci Numbers") and Ch 4.3 ("The Sexiest Rectangle — Finding Aesthetics in Life, Art, and Math Through the Golden Rectangle").

**Last updated**: 2026-05-27 — created during the Burger ingest.

---

## The Fibonacci sequence

Defined recursively: F₁ = F₂ = 1, and Fₙ = Fₙ₋₁ + Fₙ₋₂ for n ≥ 3.

First twelve terms: **1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144**.

**Burger's anchor story** (Heart of Math p. 106): Leonardo of Pisa (Fibonacci) posed a puzzle in *Liber Abaci* (1202) about idealized rabbit reproduction — each pair produces a new pair monthly after a one-month maturation. The pair count at month n is exactly Fₙ.

**Where Fibonacci appears in nature** (pp. 109–115):
- Phyllotaxis: sunflower seed spirals (typically 21 clockwise + 34 counterclockwise, or 34 + 55, or 55 + 89 — adjacent Fibonacci pairs)
- Pinecone scales (8 + 13)
- Pineapple hexagonal scales (8 + 13 + 21 in three directions)
- Branching patterns in plants (one branch per generation matures faster)
- Spiral arrangements in nautilus shells and galaxy arms (approximately, via the golden spiral)

The phyllotaxis mechanism is *not* "the plant knows Fibonacci" — it is that the golden-angle (137.508°) packing rule produces Fibonacci-numbered spiral counts as a consequence of densest non-overlapping arrangement. (See Vogel 1979 for the standard proof.)

---

## The golden ratio φ

φ = (1 + √5) / 2 ≈ 1.6180339887...

**The defining property** (Ch 4.3 pp. 302–305): φ is the unique positive number satisfying φ² = φ + 1. Equivalently: 1/φ = φ − 1 ≈ 0.6180... Equivalently: a length cut into two parts a > b such that (a + b) / a = a / b yields a / b = φ.

**The Fibonacci–φ link** (Ch 2.2 pp. 116–119): the ratio Fₙ₊₁ / Fₙ converges to φ. Concretely:

| n | Fₙ₊₁ / Fₙ |
|---|---|
| 1 | 1/1 = 1.000 |
| 2 | 2/1 = 2.000 |
| 3 | 3/2 = 1.500 |
| 5 | 8/5 = 1.600 |
| 8 | 34/21 = 1.6190... |
| 13 | 233/144 = 1.6180... |

The convergence is exponential — by F₁₀ the ratio matches φ to 4 decimal places.

**Binet's formula**: Fₙ = (φⁿ − ψⁿ) / √5, where ψ = (1 − √5) / 2 ≈ −0.618 is the conjugate. Closed-form, no recursion.

---

## The golden rectangle (Heart of Math Ch 4.3)

A rectangle is *golden* if its long-to-short side ratio equals φ. **Self-similarity property**: if you remove a square whose side equals the short side, the remaining rectangle is also a golden rectangle.

```p5 height=360
p.setup = () => {
  const w = Math.min(el.clientWidth || 600, 600);
  p.createCanvas(w, 360);
  p.noLoop();
};
p.draw = () => {
  const dark = p.isDark;
  p.background(dark ? 30 : 245);
  const ink = dark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54';
  const gold = '#a08a5c';
  const phi = 1.6180339887;

  p.textAlign(p.CENTER, p.CENTER);

  const marginX = 48, top = 26;
  let rectH = 190;
  let rectW = rectH * phi;
  const maxW = p.width - 2 * marginX;
  if (rectW > maxW) { rectW = maxW; rectH = rectW / phi; }
  const x0 = (p.width - rectW) / 2;
  const y0 = top;
  const s = rectH; // left square side = short side = "1"

  // nested recursion inside the remaining golden rectangle
  const remX = x0 + s, remW = rectW - s;
  drawNest(remX, y0, remW, rectH, 1, 0);

  // outer golden rectangle
  p.noFill(); p.stroke(ink); p.strokeWeight(2);
  p.rect(x0, y0, rectW, rectH);

  // primary square (side = 1) on the left
  p.fill(dark ? 'rgba(92,122,84,0.20)' : 'rgba(92,122,84,0.13)');
  p.stroke(green); p.strokeWeight(1.5);
  p.rect(x0, y0, s, s);

  p.noStroke(); p.fill(ink);
  p.textSize(13); p.text('φ-square', x0 + s / 2, y0 + s / 2 - 9);
  p.textSize(11); p.text('(side = 1)', x0 + s / 2, y0 + s / 2 + 9);

  // label the smaller golden rectangle (with a chip so it reads over the nesting)
  const lx = remX + remW / 2, ly = y0 + rectH * 0.66;
  p.noStroke(); p.fill(dark ? 30 : 245);
  p.rect(lx - remW / 2 + 4, ly - 20, remW - 8, 40);
  p.fill(gold); p.textSize(10.5);
  p.text('smaller', lx, ly - 12);
  p.text('golden', lx, ly);
  p.text('rectangle', lx, ly + 12);

  // dimension labels
  p.noStroke(); p.fill(ink); p.textSize(12);
  p.text('1', x0 + s / 2, y0 + rectH + 14);        // square width
  p.text('φ−1', remX + remW / 2, y0 + rectH + 14); // remaining width
  p.text('1', x0 + rectW + 16, y0 + rectH / 2);    // height

  // full-width brace for φ
  const by = y0 + rectH + 30;
  p.stroke(ink); p.strokeWeight(1);
  p.line(x0, by, x0 + rectW, by);
  p.line(x0, by - 4, x0, by + 4);
  p.line(x0 + rectW, by - 4, x0 + rectW, by + 4);
  p.noStroke(); p.fill(dark ? 30 : 245);
  p.rect(x0 + rectW / 2 - 11, by - 8, 22, 16);
  p.fill(ink); p.textSize(13); p.text('φ', x0 + rectW / 2, by);

  // caption
  p.textAlign(p.CENTER, p.TOP);
  p.fill(ink); p.textSize(11);
  p.text('Remove the square of side 1 → remaining rectangle is golden, sides 1 : (φ−1) = 1 : 1/φ.', p.width / 2, by + 16);
  p.text('The recursion can continue forever inward.', p.width / 2, by + 32);

  function drawNest(x, y, w, h, dir, depth) {
    if (depth > 5 || w < 4 || h < 4) return;
    p.noFill();
    p.stroke(dark ? 'rgba(160,138,92,0.55)' : 'rgba(160,138,92,0.5)');
    p.strokeWeight(1);
    let sq, rx, ry, rw, rh;
    if (dir === 0) { sq = h; p.rect(x, y, sq, sq); rx = x + sq; ry = y; rw = w - sq; rh = h; }
    else if (dir === 1) { sq = w; p.rect(x, y, sq, sq); rx = x; ry = y + sq; rw = w; rh = h - sq; }
    else if (dir === 2) { sq = h; p.rect(x + w - sq, y, sq, sq); rx = x; ry = y; rw = w - sq; rh = h; }
    else { sq = w; p.rect(x, y + h - sq, sq, sq); rx = x; ry = y; rw = w; rh = h - sq; }
    drawNest(rx, ry, rw, rh, (dir + 1) % 4, depth + 1);
  }
};
```

**The golden spiral**: connecting opposite corners of each nested square with quarter-arcs produces the golden spiral — an approximation of the equiangular logarithmic spiral with growth factor φ per quarter-turn.

**Aesthetic claims** (which Burger treats with appropriate skepticism, pp. 308–313): the Parthenon, Mona Lisa, *Vitruvian Man*, and the United Nations building have all been claimed to embody φ. Burger and Starbird note the claims are often overstated — the Parthenon's facade *can* be inscribed in many rectangles approximately equal to a golden one — but the cultural persistence of the golden rectangle as "the most pleasing" rectangle is itself a fact about *us*, even if specific historical attributions are weak.

---

## Why the wiki cares

**Memory palace anchor selection** ([memory-palace](./memory-palace.md)): the golden rectangle has the unique property that you can subdivide it indefinitely while preserving the aspect ratio. This makes it a *fractal palace primitive* — one rectangular room can host an infinite-depth nested palace hierarchy without geometric distortion.

**REMAPS composition** ([remaps](./remaps.md)): the *Modify-Merge-Move* transformation has a natural golden-ratio variant — scaling source-image elements by φ produces aesthetically-stable but visibly-altered output. The wiki's [scene-grammar](./scene-grammar.md) spec already references φ implicitly in its 1.618 default aspect-ratio guideline.

**Velvet Aeon visual style** ([world-velvet-aeon](./world-velvet-aeon.md)): "cosmic loneliness" sub-mode uses golden-spiral nautilus / galaxy-arm motifs as architectural anchors. The Fibonacci → φ pattern is the wiki's *named example* of *order emerging from a simple rule* — exactly the substrate-algorithm composition pattern at [substrate-algorithm-composition](./substrate-algorithm-composition.md).

**Cross-domain unlocks**:
- meadows-12-leverage-points §Rung 9 ("structure of feedback loops"): the Fibonacci recursion is a 1-rung structural change (`Fₙ = Fₙ₋₁ + Fₙ₋₂` vs `Fₙ = c · Fₙ₋₁`) that produces fundamentally different behavior.
- atomic-design family: the golden rectangle's self-similar nesting is a literal fractal — fits the "same structure at every scale" claim of [memory-atomic-design](./memory-atomic-design.md) / [problem-solving-atomic-design](./problem-solving-atomic-design.md) / [money-atomic-design](./money-atomic-design.md) / [logic-atomic-design](./logic-atomic-design.md) / [visualization-atomic-design](./visualization-atomic-design.md).

---

## METER integration

| Event | Operational form | Pass floor |
|---|---|---|
| `fibonacci_recall` | Recite F₁ through F₁₂ from memory | ≤6 s |
| `phi_value_recall` | Cued recall of φ to 4 decimal places | ≤4 s |
| `golden_recursive_property` | Explain "remove a square → remaining rectangle is golden" without notes | ≤30 s |
| `phi_cultural_overclaim_detection` | When shown a claimed φ-attribution (Parthenon, Mona Lisa), name the specific weakness | binary; recognition gym |

---

## Mnemonic — *"One, one, fold and grow — phi appears wherever spirals go"*

The first words encode the recurrence (1, 1, then *fold and grow* = add previous two). The second clause encodes the consequence: φ shows up in any recursive growth pattern with rule `next = prev + prev-prev`.

For φ ≈ 1.618: *"One six one eight — golden gate."*

---

## Memory Checksum

Numbered inventory (recite in ≤20 s):

1. **Fibonacci sequence**: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144 — recursion Fₙ = Fₙ₋₁ + Fₙ₋₂
2. **φ defining property**: φ² = φ + 1; equivalently 1/φ = φ − 1; numerically ≈ 1.6180339887
3. **Fibonacci–φ link**: Fₙ₊₁ / Fₙ → φ (exponentially fast)
4. **Binet's formula**: closed-form Fₙ = (φⁿ − ψⁿ) / √5
5. **Golden rectangle**: ratio 1 : φ; remove a square → smaller golden rectangle (self-similar)
6. **Phyllotaxis**: sunflower spirals (21 + 34, 34 + 55) emerge from golden-angle (137.508°) packing
7. **Cultural overclaim**: Parthenon / Mona Lisa attributions weaker than commonly told (Burger & Starbird p. 312)

**Counts**: 12 Fibonacci terms · 4 properties of φ · 1 closed-form · 1 self-similarity · 2 natural instances · 1 cultural-claim caveat.

**Recite floor**: ≤20 s for full inventory; ≤6 s for the Fibonacci sequence; ≤4 s for φ ≈ 1.618.

---

## Related pages

- [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) — Ch 2.2 and Ch 4.3 source
- [pigeonhole-principle](./pigeonhole-principle.md) · [cantor-infinities-and-power-set](./cantor-infinities-and-power-set.md) · [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) · [expected-value-and-arrows-theorem](./expected-value-and-arrows-theorem.md) — sibling Heart-of-Math concepts
- [memory-palace](./memory-palace.md) — golden rectangle as fractal palace primitive
- [remaps](./remaps.md) · [scene-grammar](./scene-grammar.md) — φ aspect-ratio in composition rules
- [world-velvet-aeon](./world-velvet-aeon.md) — "cosmic loneliness" sub-mode uses golden-spiral motifs
- [substrate-algorithm-composition](./substrate-algorithm-composition.md) — Fibonacci/φ is the canonical "order from simple rule" example
- [memory-atomic-design](./memory-atomic-design.md) · [problem-solving-atomic-design](./problem-solving-atomic-design.md) · [money-atomic-design](./money-atomic-design.md) · [logic-atomic-design](./logic-atomic-design.md) · [visualization-atomic-design](./visualization-atomic-design.md) — fractal self-similarity link
