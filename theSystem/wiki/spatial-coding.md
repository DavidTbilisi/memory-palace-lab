---
palace: meta-knowledge
level: 7
domain: 10
room: 45
para: resource
semantic_mode: 5
wiki_source: wiki/encoders/spatial-coding.md
---

# Spatial Coding

**Summary**: *Пространственное кодирование* (spatial coding) uses the **position** of an image inside a locus or association — top/bottom/left/right, reading direction, triangle geometry — as an extra information channel that rides *on top of* the images already there, so a datum can be stored without spending a new image on it (source: GMS_V.Kozarenko.pdf).

**Sources**: `GMS_V.Kozarenko.pdf`; [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md); [memory-palace](./memory-palace.md); [mnemonic-methods-master](./mnemonic-methods-master.md); [person-action-object-system](./person-action-object-system.md).

**Last updated**: 2026-07-10.

---

## What spatial coding is

Spatial coding is an **encoder primitive**, not a storage method. It stores nothing by itself; it adds a *positional* channel over the loci of a [memory-palace](./memory-palace.md) and the images produced by [word→image conversion](./method-of-guiding-associations.md) (source: GMS_V.Kozarenko.pdf). Kozarenko names three things that position can carry: the **order** in which information is read, a **piece of the remembered datum**, and the **order of arithmetic operations** (source: GMS_V.Kozarenko.pdf). It lives in the `encoders/` layer beside the other Giordano-school primitives catalogued in [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md), and its whole value is that geometry is free: the locus and the image are already paid for, so reading a coordinate off them costs no additional binding.

## Channel 1 — order (read/write sequence)

On the visible parts of an association base, information is written and read **left→right and top→bottom**, exactly as we habitually read and write (source: GMS_V.Kozarenko.pdf). Position alone fixes sequence, so a list stored across the parts of one base carries its own ordering without any extra ordinal images — the arrangement *is* the index (source: GMS_V.Kozarenko.pdf).

## Channel 2 — datum (the Компас card technique)

The **Компас** (compass) technique encodes the datum of a playing card by position. You prepare a sequence of 52 support-images (loci); each locus is split into four parts — **top, bottom, left, right** — and each part is assigned one of the four suits, a fixed personal convention (the source fixes only that each quadrant carries one suit, not which) (source: GMS_V.Kozarenko.pdf). The card's **rank** is then given by the number-image code from the [number-image / Major System](./mnemonic-methods-master.md) codes, with the picture cards mapped as ranks 11–14 → Jack, Queen, King, Ace (source: GMS_V.Kozarenko.pdf). The elegance is that you never memorise 52 bespoke card-images: the *quadrant* supplies the suit and the *number-image* supplies the rank, so two cheap channels reconstruct the whole card (source: GMS_V.Kozarenko.pdf).

This is a **different approach to the same task** solved by [PAO](./person-action-object-system.md), the wiki's other card-memory method: PAO gives every card a person/action/object triple and chunks three cards into one scene, whereas Компас gives every card a locus-quadrant plus a number-image and reads suit off geometry. Neither is claimed superior here — they are two encodings of the same problem, one image-heavy and scene-based, one position-based and image-light (source: GMS_V.Kozarenko.pdf).

The *same* positional trick generalises. In passwords it distinguishes uppercase from lowercase using one letter-image: with a **vertical** layout of image-codes, big letters go **right** and small letters **left**; with a **horizontal** layout, big letters go **top** and small **bottom** (source: GMS_V.Kozarenko.pdf). And in measures of length it records where the **decimal point** sits, by splitting the numbers into top/bottom and left/right parts on the association base (source: GMS_V.Kozarenko.pdf).

## Channel 3 — arithmetic (треугольные ассоциации)

A **треугольная ассоциация** (triangular association) codes a formula's operation into the *shape* of the association. Images hang on a central image from below in a triangle: the two **bottom** images are **multiplied** together, and the **top** image is **divided** by the bottom (source: GMS_V.Kozarenko.pdf). Because the arithmetic is read off the geometry, one small figure carries several formulas at once: a triangle of three letters codes 3 formulas, and a triangle of five letters codes 12 formulas — dense enough to hold a whole physics or trig formula set, where the letters are swapped for the image-codes of the physical quantities (source: GMS_V.Kozarenko.pdf). The book's worked case is the 12 formulas from a 7th-grade physics textbook — the "dry residue" (*сухой остаток*) you actually need to solve problems (source: GMS_V.Kozarenko.pdf).

A second spatial-arithmetic convention handles addition and subtraction: images placed **vertically** mean **addition**, images placed **horizontally** mean **subtraction**, with the equals sign dropped because it follows logically after the association base (source: GMS_V.Kozarenko.pdf). This is the trick Kozarenko uses to compress the trigonometric addition formulas into image-associations (source: GMS_V.Kozarenko.pdf).

## METER fit

The measurable for spatial coding is **read latency**: the time to go locus + quadrant → card image → rank/suit decode (or triangle → operation). The pass condition is that the coordinate fires as a *single automatic glance* rather than a computed lookup — i.e. reading the position must not cost more than reading the image it rides on. The threshold that separates "automatic read" from "reconstructed answer" is the automaticity ladder owned by [skill-progression-stages](./skill-progression-stages.md); this page does not restate a bare number, it defers to that ladder (source: GMS_V.Kozarenko.pdf). Track it through [METER](./meter-overview.md) as encode-and-decode speed per positional channel: order-read, quadrant→suit, triangle→operation. A channel that slows the encode below the image's own binding window is failing, not helping (source: GMS_V.Kozarenko.pdf).

## Mnemonic

Lay a **compass rose** over every locus. Its needle sweep gives you **order** (read left→right, top→bottom). Its four points give you the **datum** — the four suits, big/small case, decimal side. And hang a **triangle** beneath it for **arithmetic** — bottom two points multiply, apex divides. Compass + triangle = *Компас* и *треугольник*: position is a free byte on furniture you already own.

## Memory checksum

1. In the Компас technique, does the quadrant (top/bottom/left/right) encode a card's **suit** or its **rank**? Suit. If you said rank → wrong: rank rides the number-image code from the [Major System](./mnemonic-methods-master.md); the quadrant carries the suit (source: GMS_V.Kozarenko.pdf).
2. In a triangular association, what does the **top** image do — multiply or divide? It is **divided** by the bottom; the two bottom images multiply each other. If you said the top multiplies, you inverted the geometry (source: GMS_V.Kozarenko.pdf).
3. For a **vertical** password layout, where do the big (uppercase) letters go — left or right? **Right** (small = left); horizontal layout flips this to top/bottom. If you swapped them, you lost the case channel — the same split that also stores the decimal point in measures of length (source: GMS_V.Kozarenko.pdf).

## Visual

```p5 height=380
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 380); p.noLoop(); };
p.draw = () => {
  const dark = p.isDark;
  p.background(dark ? 30 : 245);
  const ink = dark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54';
  const gold = dark ? '#c4a86a' : '#a08a5c';
  const w = p.width;
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(ink); p.textStyle(p.BOLD); p.textSize(12);
  p.text('ONE LOCUS as a compass rose', w * 0.27, 24);
  p.text('TRIANGULAR ASSOCIATION', w * 0.75, 24);
  p.textStyle(p.ITALIC); p.textSize(10);
  p.text('quadrant = suit; rank = code', w * 0.27, 40);
  p.text('geometry = operation', w * 0.75, 40);
  const lx = w * 0.27, ly = 150, rad = 66;
  p.stroke(green); p.strokeWeight(1.5); p.noFill();
  p.circle(lx, ly, rad * 2);
  p.line(lx - rad, ly, lx + rad, ly);
  p.line(lx, ly - rad, lx, ly + rad);
  p.noStroke(); p.fill(ink); p.textStyle(p.NORMAL); p.textSize(15);
  p.text('♠', lx, ly - rad - 14);
  p.text('♥', lx, ly + rad + 14);
  p.text('♣', lx - rad - 16, ly);
  p.text('♦', lx + rad + 16, ly);
  p.textSize(9);
  p.text('top', lx, ly - rad + 14);
  p.text('bottom', lx, ly + rad - 14);
  p.text('left', lx - rad + 16, ly - 12);
  p.text('right', lx + rad - 16, ly - 12);
  p.fill(gold); p.textStyle(p.BOLD); p.textSize(10);
  p.text('RANK =', lx, ly - 6);
  p.text('number-image', lx, ly + 8);
  const ax = w * 0.75, ay = 92, blx = w * 0.75 - 64, brx = w * 0.75 + 64, by = 214;
  p.stroke(green); p.strokeWeight(1.5); p.noFill();
  p.triangle(ax, ay, blx, by, brx, by);
  p.noStroke(); p.fill(ink);
  p.textStyle(p.BOLD); p.textSize(11); p.text('apex', ax, ay - 14);
  p.textStyle(p.NORMAL); p.textSize(10); p.text('top ÷ bottom', ax, ay + 18);
  p.fill(gold); p.textStyle(p.BOLD); p.textSize(12); p.text('×', (blx + brx) / 2, by);
  p.fill(ink); p.textStyle(p.NORMAL); p.textSize(9);
  p.text('bottom', blx, by + 14);
  p.text('bottom', brx, by + 14);
  p.text('the two bottoms multiply', ax, by + 30);
  p.textStyle(p.ITALIC); p.textSize(10);
  p.text('vertical = +   |   horizontal = −', ax, by + 48);
  p.fill(ink); p.textStyle(p.NORMAL); p.textSize(11); p.textAlign(p.LEFT, p.CENTER);
  const nx = 24, ny = 300;
  p.text('quadrant → suit (your fixed convention)', nx, ny);
  p.text('card rank 11·12·13·14 → J·Q·K·A', nx, ny + 20);
  p.text('big letters: right (vert) / top (horiz)  ·  small: opposite', nx, ny + 40);
};
```

## Related pages

- [kozarenko-mnemotechnics](./kozarenko-mnemotechnics.md) — the Giordano-school source hub; catalogues spatial coding among Kozarenko's encoder primitives
- [memory-palace](./memory-palace.md) — the loci that spatial coding adds a positional channel on top of
- [mnemonic-methods-master](./mnemonic-methods-master.md) — number-image / Major System codes that supply the Компас card ranks
- [person-action-object-system](./person-action-object-system.md) — PAO, the wiki's other card-memory method; Компас is a different, position-based approach to the same task
- [method-of-guiding-associations](./method-of-guiding-associations.md) — produces the images whose position this primitive then reads
- [remaps](./remaps.md) — transforms an image once placed; spatial coding fixes *where* it sits
- [meter-overview](./meter-overview.md) — measures read latency per positional channel
- [skill-progression-stages](./skill-progression-stages.md) — owner of the automaticity threshold the METER pass-floor defers to

---

## U — See (CAST)
1. One locus, three position channels: needle-sweep order, four-point datum, triangle arithmetic
2. Edges feed loci, number-image codes, and PAO's rival card encoding — geometry read as free data

## D — Name (NEDF)
1. Spatial coding = using position within a locus/image as an added information channel
2. Distinguisher: it stores nothing alone — a channel ON TOP of loci and images, not a rival encoder
3. Failure mode: reading a quadrant as rank (it is suit), or inverting the triangle (top divides)

## F — Do (SPEAR)
1. Split the locus into four parts; assign quadrants (suit/case) and reading order once, as a fixed convention
2. Hang bottom-multiply / top-divide triangles for formulas; vertical=add, horizontal=subtract

## B — Watch (HEART)
1. Inventing a suit→quadrant mapping the source does not fix — set your own and keep it constant
2. A positional channel that slows the encode below the image's binding window (it should be free)
3. Claiming Компас beats PAO — they are alternatives, not a ranking

## L — Predict (ORACLE)
1. Automatic quadrant→suit read → whole deck reconstructs image-light, no 52 bespoke card-images
2. Wobbly convention (which point is which suit) → decode ambiguity, cards collide on recall

## R — Act (GRACE)
1. Memorising a deck → Компас (locus + quadrant + number-image), not new per-card images
2. Formula set → triangular associations; case-sensitive password → big/small by top-bottom/left-right
