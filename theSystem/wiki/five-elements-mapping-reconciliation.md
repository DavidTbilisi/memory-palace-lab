---
palace: meta-knowledge
level: 8
domain: 10
room: 2
wiki_source: wiki/learning-systems/five-elements-mapping-reconciliation.md
---

# Five Elements — Mapping Reconciliation

**Summary**: The wiki uses the names **Water · Air · Earth · Fire · Aether** in **two distinct senses** that share only the classical-element vocabulary. Sense A ([Burger 2012](./burger-5-elements-effective-thinking.md)): the 5 *habits* of effective thinking — Earth=Understand-Deeply, Fire=Fail-to-Succeed, Air=Raise-Questions, Water=Flow-of-Ideas, Aether=Change. Sense B ([wiki since pre-2026](./automaticity-and-reflex-training.md)): the 5 *skill-types* — Water=Perceptual, Air=Conceptual, Earth=Procedural, Fire=Generative, Aether=Strategic. The two readings are **not interchangeable** — they answer different questions and have different operational consequences. This page is the registry-of-record so future pages don't silently mix them.

**Sources**: [burger-5-elements-effective-thinking](./burger-5-elements-effective-thinking.md) (Burger & Starbird 2012); [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) (wiki's pre-existing skill-type taxonomy); [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) (Burger & Starbird 2009 textbook, where the habits live operationally before being named).

**Last updated**: 2026-05-27 — created during the 2026-05-27 Burger ingest.

---

## The collision in one table

| Name | Sense A — **Burger habits** | Sense B — **Wiki skill-types** | Conflict? |
|---|---|---|---|
| **Earth** | Understand deeply (foundations · clutter · what's there · what's missing) | Procedural skill (sequenced doing — debugging, soroban, configuring servers) | Partial agreement — "understanding the basics" is procedural-adjacent |
| **Fire** | Fail to succeed (mistakes as ignition · right Q to wrong A · fail by intent) | Generative skill (creating new outputs — writing, designing, composing) | Misaligned — Burger's Fire is *anti-fragile error*; wiki's Fire is *generation* |
| **Air** | Raise questions (Be Your Own Socrates · real-question audit · official questioner) | Conceptual skill (abstraction, model-building, definition-construction) | Misaligned — Burger's Air is *interrogation*; wiki's Air is *abstraction* |
| **Water** | Follow the flow of ideas (lineage · look-back/look-forward · iterate from old to new) | Perceptual skill (signal recognition — error logs, code patterns, accents) | **Direct contradiction** — Burger's Water is *temporal/historical flow*; wiki's Water is *spatial/perceptual reading* |
| **Aether** | Engaging change (transform yourself · do a different task, not the same task better) | Strategic skill (prioritization · planning · tradeoffs) | Partial — both are meta-level, but Burger's is *identity-change*; wiki's is *domain-strategy* |

---

## Why the two senses are not the same

The two readings are answering different questions.

- **Burger's habits** answer: *"What are the moves an effective thinker makes, regardless of what they're working on?"* — habits are domain-general practices a person *enacts*.
- **The wiki's skill-types** answer: *"What kind of cognitive load does this specific skill impose, so we know how to train it?"* — skill-types are domain-specific *categories* a skill belongs to.

A single concrete activity sits at one *skill-type* (e.g., "debugging" is Earth=Procedural in Sense B) but is improved by enacting *all 5 habits* on it (Earth=understand-deeply the bug · Fire=intentionally-fail-to-reproduce · Air=ask-the-real-question · Water=trace-the-lineage · Aether=become-someone-who-debugs-by-default). One activity, one skill-type, five habits.

**Conclusion**: the two are orthogonal layers, not competing definitions. The wiki has been using a name collision since pre-2026 by accident.

---

## Which sense does each page use?

| Page | Sense used | How to read |
|---|---|---|
| [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) | **Sense B** (skill-types) | All "Five Elements" mentions are about cognitive load categories |
| [burger-5-elements-effective-thinking](./burger-5-elements-effective-thinking.md) | **Sense A** (habits) | All "Five Elements" mentions are about Burger's habits |
| [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) | **Sense A** (habits) | The textbook *enacts* the habits across math chapters |
| [understand-deeply-habit](./understand-deeply-habit.md) · [fail-to-succeed-habit](./fail-to-succeed-habit.md) · [socratic-question-generation](./socratic-question-generation.md) · [flow-of-ideas-habit](./flow-of-ideas-habit.md) · [transformative-change-habit](./transformative-change-habit.md) | **Sense A** (habits) | Per-habit concept pages |
| [glossary](./glossary.md) | **Both, separately registered** | Burger habits and skill-types are listed under different headings |
| index | **Either, named inline** | When the wiki narrates, it should name the sense ("Burger habits" vs "skill-types") on first mention |

**Linting rule** (proposed): any new page that uses "Earth/Fire/Air/Water/Aether" must name the sense **once, on first mention**. Inferring from context is allowed; staying silent is not. Reviewers should reject pages that mix the two senses without flagging the switch.

---

## Cross-references — which habits empower which skill-types?

Not all 5×5 = 25 cells are interesting. The load-bearing ones:

- **Earth-habit × Procedural-skill-type** — debugging benefits enormously from understanding-deeply (Sense A) the system you're debugging (Sense B procedural skill).
- **Fire-habit × Generative-skill-type** — writing/designing/composing benefits enormously from intentional-failure (Sense A) since the Generative skill-type's outputs are open-ended (Sense B).
- **Air-habit × Conceptual-skill-type** — building abstractions benefits enormously from asking-the-real-question (Sense A) — the wrong concept-level is the most common Conceptual failure mode (Sense B).
- **Water-habit × Perceptual-skill-type** — signal recognition benefits enormously from tracing-lineage (Sense A) — knowing *why* a signal exists makes it more memorable in the perceptual register (Sense B).
- **Aether-habit × Strategic-skill-type** — strategy is fundamentally about choosing-to-become (Sense A) the kind of decision-maker who handles tradeoffs in this domain (Sense B).

These five diagonal pairs are the *natural* alignments. Burger's pedagogy is sharpest on the diagonal; the wiki's taxonomy is sharpest off-diagonal (other 20 cells — e.g., Earth-habit applied to Generative-skill-type is non-trivial and powerful).

---

## Was the wiki "wrong" before?

No. Both readings are defensible:

- **The wiki's Sense B mapping** was internally consistent and load-bearing for the Great Work pipeline ([automaticity-and-reflex-training](./automaticity-and-reflex-training.md) uses skill-type to choose which Great Work operations carry the most weight for a given skill). Replacing it now would break dozens of downstream pages.
- **Burger's Sense A mapping** is the historically prior public use of these names for thinking-skill purposes (Burger and Starbird 2012; the textbook 2009 implicitly).

The fix is **registration**, not replacement: register both senses under distinct headings in the [glossary](./glossary.md), add this reconciliation page as the authoritative cross-walk, and require new pages to name the sense on first mention.

---

## Visual — Habits × Skill-types as orthogonal layers

```p5 height=360
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 360); p.noLoop(); };
p.draw = () => {
  const dark = p.isDark;
  const ink = dark ? '#ECE4D3' : '#2B2620';
  const sub = dark ? '#b7ad98' : '#6b6355';
  const green = '#5c7a54', greenF = dark ? '#2a301f' : '#e8efe6';
  const blue = '#7d8aa0', blueF = dark ? '#232a33' : '#eef1f5';
  p.background(dark ? 30 : 245);
  const W = p.width, m = 12;

  // HABITS axis — horizontal (Sense A)
  p.noStroke(); p.fill(ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.LEFT, p.TOP);
  p.text('HABITS (Sense A) — Burger 2012', m, 6);
  p.textStyle(p.NORMAL);
  const habits = ['Earth', 'Fire', 'Air', 'Water', 'Æther'];
  const hw = (W - 2 * m) / 5;
  for (let i = 0; i < 5; i++) {
    const x = m + i * hw;
    p.stroke(green); p.strokeWeight(1.3); p.fill(greenF); p.rect(x + 2, 24, hw - 4, 26, 4);
    p.noStroke(); p.fill(ink); p.textAlign(p.CENTER, p.CENTER); p.textSize(12);
    p.text(habits[i], x + hw / 2, 37);
    p.fill(sub); p.textSize(11); p.text('▼', x + hw / 2, 59);
  }

  // SKILL-TYPES axis — vertical (Sense B)
  p.noStroke(); p.fill(ink); p.textStyle(p.BOLD); p.textSize(12); p.textAlign(p.LEFT, p.TOP);
  p.text('SKILL-TYPES (Sense B)', m, 70);
  p.textStyle(p.NORMAL);
  const rows = [
    ['Water · Perceptual', 'signal recog'],
    ['Air · Conceptual', 'abstraction'],
    ['Earth · Procedural', 'sequenced do'],
    ['Fire · Generative', 'open-create'],
    ['Aether · Strategic', 'prioritize'],
  ];
  const by = 90, bh = 32, bw = W - 2 * m;
  for (let i = 0; i < 5; i++) {
    const y = by + i * (bh + 4);
    p.stroke(blue); p.strokeWeight(1.3); p.fill(blueF); p.rect(m, y, bw, bh, 5);
    p.noStroke(); p.fill(ink); p.textAlign(p.LEFT, p.CENTER); p.textStyle(p.BOLD); p.textSize(12);
    p.text(rows[i][0], m + 10, y + bh / 2);
    p.textStyle(p.NORMAL); p.fill(sub); p.textAlign(p.RIGHT, p.CENTER); p.textSize(11);
    p.text('←  ' + rows[i][1], m + bw - 10, y + bh / 2);
  }

  // captions — the two senses
  const cy = by + 5 * (bh + 4) + 6;
  p.textAlign(p.LEFT, p.TOP); p.textSize(10.5);
  p.fill(blue);
  p.text('Sense B mapping is INTERNAL to the wiki skill-type taxonomy (automaticity-and-reflex-training).', m, cy, bw, 40);
  p.fill(green);
  p.text('Sense A mapping is what an effective thinker DOES on any of the skill-types.', m, cy + 24, bw, 40);
};
```

The vertical and horizontal labels share the *same five names* but represent perpendicular axes. The 25-cell grid is mostly populated (you can ask Habit×Skill-Type for any pair); only the diagonal is privileged because Burger's pedagogy is sharpest there.

---

## Mnemonic — *"Same Letters, Different Lanes"*

The 5 letters E-F-A-W-Æ stay constant; what changes is which *lane* (habits or skill-types) the page is talking about. The mnemonic is a permanent reminder to read the lane label before reading the letter.

---

## Memory Checksum

Numbered inventory (recite in ≤30 s):

1. **Two senses** of the same five names: A (habits, Burger 2012) and B (skill-types, wiki)
2. **5 habits** (Sense A): Earth=understand-deeply · Fire=fail-to-succeed · Air=raise-questions · Water=flow-of-ideas · Aether=change
3. **5 skill-types** (Sense B): Water=perceptual · Air=conceptual · Earth=procedural · Fire=generative · Aether=strategic
4. **5 diagonal alignments** (the load-bearing diagonals): Earth-habit×Procedural · Fire-habit×Generative · Air-habit×Conceptual · Water-habit×Perceptual · Aether-habit×Strategic
5. **1 linting rule**: name the sense on first mention; mixed pages get flagged

**Counts**: 2 senses · 5 elements per sense · 25 Habit×Skill-Type cells · 5 privileged diagonals · 1 linting rule.

**Recite floor**: ≤30 s.

---

## Related pages

- [burger-5-elements-effective-thinking](./burger-5-elements-effective-thinking.md) — source of Sense A (habits)
- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — source of Sense B (skill-types)
- [burger-heart-of-mathematics](./burger-heart-of-mathematics.md) — Sense A enacted across math
- [glossary](./glossary.md) — both senses registered under distinct headings
- [understand-deeply-habit](./understand-deeply-habit.md) · [fail-to-succeed-habit](./fail-to-succeed-habit.md) · [socratic-question-generation](./socratic-question-generation.md) · [flow-of-ideas-habit](./flow-of-ideas-habit.md) · [transformative-change-habit](./transformative-change-habit.md) — per-habit pages (Sense A)
- [skill-progression-stages](./skill-progression-stages.md) — uses Sense B exclusively
- [red-queen-skill-gym](./red-queen-skill-gym.md) — uses Sense B exclusively
