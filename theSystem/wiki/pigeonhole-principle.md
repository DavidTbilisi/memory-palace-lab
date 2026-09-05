---
palace: meta-knowledge
level: 5
domain: 8
room: 8
semantic_mode: 5
wiki_source: wiki/problem-solving/pigeonhole-principle.md
---

# Pigeonhole Principle

**Summary**: If n+1 pigeons are placed into n pigeonholes, at least one hole contains ≥2 pigeons. A foundational counting principle that powers a vast range of *existence proofs* — most have nothing to do with pigeons or holes. Registered as a wiki Tool-level [crux-move](./crux-move.md) at [problem-solving-three-levels](./problem-solving-three-levels.md); this is the owner page. Burger and Starbird's [*Heart of Mathematics*](./burger-heart-of-mathematics.md) Ch 2.1 treats it as the canonical introductory rigorous-thinking primitive (pp. 95–104).

**Sources**: [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) Ch 2.1 (pp. 95–104, "Counting — How the Pigeonhole Principle Leads to Precision Through Estimation"); [problem-solving-three-levels](./problem-solving-three-levels.md) (Zeitz S/T/T registry where pigeonhole appears as a tactic).

**Last updated**: 2026-09-05 (automaticity ladder count corrected — 10 levels, 0–9); 2026-05-27 — created during the Burger ingest as the owner page for the previously-named-but-orphan tactic.

---

## The principle in three forms

**Simple form**: if you have more objects than containers, some container has ≥2 objects.

**Generalized form**: if n objects are placed into k containers and n > k·m, some container has ≥m+1 objects.

**Continuous form** (Lebesgue): if a measurable set in [0,1] has measure > k/n for integer k, n, then it must contain some interval of size > 1/n where it has density > k/n. *(This is the analytic strengthening used in measure-theoretic proofs.)*

---

## Canonical Burger examples (Heart of Math Ch 2.1)

**Hairs on heads** (pp. 96–97): are there two non-bald people in New York City with exactly the same number of hairs on their heads? The average human head has 100,000 hairs; the maximum recorded is under 200,000. NYC has ~8 million people. With ~200,001 pigeonholes (0 to 200,000 possible hair counts) and 8,000,000 pigeons, by pigeonhole there must be at least ⌈8,000,000 / 200,001⌉ = 40 people sharing any one hair-count. *In fact ≥40 people in NYC have the exact same number of head hairs* — without measuring a single person.

**Two people with the same birthday in a room of 367**: 366 possible birthdays (including Feb 29) → 367 pigeons must share a hole.

**Five points in a 2×2 square**: any five points in a 2×2 unit square must contain two points within √2 of each other. (Divide the square into four 1×1 cells. By pigeonhole, two of the five points share a cell; the longest distance within a 1×1 cell is the diagonal √2.)

---

## Wiki-cross-domain instances

The principle is *substrate-independent*. Some load-bearing wiki uses:

| Domain | Pigeonhole instance |
|---|---|
| **[crux-recognition-gym](./crux-recognition-gym.md)** | Among any 17 puzzles drawn at random from the 211-puzzle [Livingstone-Thomson corpus](./livingstone-thomson-brain-teasers.md), at least 2 share an archetype (there are exactly 16 archetypes A–R, no Q-skip). |
| **[memory-palace](./memory-palace.md)** | If a palace has N loci and you encode N+1 distinct items in it, some locus carries 2+ items — a collision in the encoding-overlay sense. (Counter: keep N > items-encoded by ≥30%.) |
| **[spaced-repetition](./spaced-repetition.md)** | In any 7-day window, an Anki deck with k cards/day at SM-2 default intervals will repeat at least one card-class twice if k > 7 — useful when designing leech-detection thresholds. |
| **network-fundamentals / osi-7-layer-model** | With n+1 hosts contending for n MAC-address slots in a CAM table, at least one slot must be reused or evicted — drives ARP cache aging policy. |
| **[automaticity-and-reflex-training](./automaticity-and-reflex-training.md)** | Across the wiki's 10 automaticity levels (0–9) and 5 skill-types (Sense B of [five-elements-mapping-reconciliation](./five-elements-mapping-reconciliation.md)), 46 slot-pairs exist; pigeonhole guarantees that drilling 47+ skills must reuse at least one (level × skill-type) slot. |

---

## When pigeonhole is the crux move

The wiki's [crux-recognition-gym](./crux-recognition-gym.md) uses pigeonhole as a Tool-level recognition target. The recognition signal: a problem asks for the *existence* of two-or-more-of-something-with-shared-property *without asking who or where*. If the problem says *"show that there must be"* or *"prove there exist two ... such that they share ..."*, pigeonhole is in the top-3 candidate tactics. Recognition floor: ≤30 s; named-tactic accuracy ≥80% when crux is correctly identified.

The trap: pigeonhole tells you the shared-property *exists* but never tells you *which* objects share it. A correct pigeonhole proof feels unsatisfying — it is non-constructive. This is the principle's *signature feature*, not a bug.

---

## Counter-tactic: when pigeonhole doesn't fit

- **Constructive existence required** — pigeonhole only proves existence, never identifies the witness. If the problem demands a specific example, look for a different tactic (information-theoretic-minimum or direct construction).
- **N exactly equals k** — if pigeons exactly equal holes, the simple form gives *nothing* (each hole could have exactly 1 pigeon). You need n > k strictly.
- **Continuous quantities without natural discretization** — the principle requires a finite-or-countable container set. For real-line problems, you typically need the Lebesgue strengthening or a different tool (intermediate value theorem · Brouwer fixed-point).

---

## Visual — pigeonhole as the simplest counting axiom

```p5 height=380
p.setup = () => {
  const w = Math.min(el.clientWidth || 600, 600);
  p.createCanvas(w, 380);
  p.noLoop();
};
p.draw = () => {
  const dark = p.isDark;
  p.background(dark ? 30 : 245);
  const ink = dark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54';
  const gold = '#a08a5c';
  const w = p.width;
  const marginX = 34, availW = w - 2 * marginX;
  const holeTop = 96, holeH = 52, holeBot = holeTop + holeH, pigY = 44;

  const hx = [];
  for (let j = 0; j < 7; j++) hx.push(marginX + (j + 0.5) * availW / 7);
  const boxW = (availW / 7) * 0.66;

  p.noStroke(); p.fill(ink); p.textAlign(p.LEFT, p.BOTTOM); p.textSize(11);
  p.text('n + 1 = 8 pigeons', marginX, pigY - 14);
  p.textAlign(p.LEFT, p.TOP);
  p.text('n = 7 holes', marginX, holeBot + 6);

  // pigeon → hole assignment: hole 0 receives two pigeons, holes 1..6 one each
  const pigs = [[hx[0] - 13, 0], [hx[0] + 13, 0]];
  for (let j = 1; j < 7; j++) pigs.push([hx[j], j]);

  // holes (crowded hole 0 highlighted)
  for (let j = 0; j < 7; j++) {
    p.stroke(ink); p.strokeWeight(1.5);
    p.fill(j === 0
      ? (dark ? 'rgba(160,138,92,0.45)' : 'rgba(160,138,92,0.30)')
      : (dark ? 'rgba(236,228,211,0.06)' : 'rgba(43,38,32,0.04)'));
    p.rect(hx[j] - boxW / 2, holeTop, boxW, holeH, 3);
  }

  // arrows pigeon → hole
  for (const pg of pigs) {
    const px = pg[0], tx = hx[pg[1]];
    p.stroke(green); p.strokeWeight(1.4);
    p.line(px, pigY + 7, tx, holeTop - 4);
    const ang = Math.atan2((holeTop - 4) - (pigY + 7), tx - px), ah = 5;
    p.line(tx, holeTop - 4, tx - ah * Math.cos(ang - 0.4), (holeTop - 4) - ah * Math.sin(ang - 0.4));
    p.line(tx, holeTop - 4, tx - ah * Math.cos(ang + 0.4), (holeTop - 4) - ah * Math.sin(ang + 0.4));
  }
  // pigeons
  for (const pg of pigs) { p.noStroke(); p.fill(ink); p.circle(pg[0], pigY, 13); }

  // annotations
  p.noStroke(); p.textAlign(p.LEFT, p.TOP);
  const ty = holeBot + 34;
  p.fill(ink); p.textStyle(p.BOLD); p.textSize(12.5);
  p.text('8 pigeons into 7 holes → at least one hole has ≥2 pigeons.', marginX, ty);
  p.textStyle(p.NORMAL); p.textSize(11.5);
  p.text('Generalized:  ⌈n / k⌉ pigeons in the most-crowded hole, minimum.', marginX, ty + 26);
  p.fill(gold);
  p.text('e.g.  ⌈8,000,000 / 200,001⌉ = 40 people in NYC share the same number of head hairs.', marginX, ty + 44);
  p.fill(ink);
  p.text('The principle GUARANTEES existence — but never tells you WHICH', marginX, ty + 70);
  p.text("pigeons share WHICH hole. That's pigeonhole's signature.", marginX, ty + 86);
};
```

---

## Mnemonic — *"More pigeons than holes → some hole's full"*

The line stands alone. The principle is one of the few math results whose statement IS its mnemonic.

For the generalized form: *"⌈n/k⌉ minimum in the most-crowded hole."* Recall as a tight ceiling-function pattern.

---

## Memory Checksum

Numbered inventory (recite in ≤15 s):

1. **Simple form**: n+1 pigeons into n holes → ≥1 hole has ≥2
2. **Generalized form**: n > k·m → ≥1 hole has ≥m+1
3. **Continuous (Lebesgue) strengthening**: measure-theoretic version for analysis
4. **Burger canonical examples**: NYC head-hairs (40-people minimum) · birthday paradox (367 in room) · 5 points in 2×2 square (√2 distance)
5. **Recognition signal**: "must be" / "there exist ... share" without demanding *who*
6. **The trap**: non-constructive; proves existence, hides identity

**Counts**: 3 forms · 3 canonical examples · 1 recognition signal · 1 signature trap.

**Recite floor**: ≤15 s; tactic-named accuracy ≥80% within 30 s recognition.

---

## Related pages

- [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) — Ch 2.1 source
- [problem-solving-three-levels](./problem-solving-three-levels.md) — Zeitz S/T/T tactic registry
- [crux-recognition-gym](./crux-recognition-gym.md) — recognition gym uses pigeonhole as a Tool-level target
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) · [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — corpus where pigeonhole appears as named tactic
- information-theoretic-minimum — sister principle for minimum-test problems
- [fibonacci-and-golden-ratio](./fibonacci-and-golden-ratio.md) · [cantor-infinities-and-power-set](./cantor-infinities-and-power-set.md) · [penrose-tilings-and-platonic-solids](./penrose-tilings-and-platonic-solids.md) · [expected-value-and-arrows-theorem](./expected-value-and-arrows-theorem.md) — sibling Heart-of-Math chapter concepts
