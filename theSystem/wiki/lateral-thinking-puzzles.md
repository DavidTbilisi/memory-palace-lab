---
palace: strategic-memory
level: 6
domain: 10
room: 5
wiki_source: wiki/problem-solving/lateral-thinking-puzzles.md
---

# Lateral Thinking Puzzles — the 7 trap classes

**Summary**: Lateral thinking puzzles share a structural signature: they *deliberately prime the wrong tactic*. Solving them requires recognizing the priming and rejecting it. This page taxonomizes the 7 trap classes I extracted from the [Livingstone-Thomson 211-puzzle corpus](./livingstone-thomson-brain-teasers.md) and maps each trap to its defense from existing wiki layers. Lateral thinking is not a single skill — it's a **bundle of trap-recognition reflexes**, each measurable and drillable. Sits adjacent to [anti-tactic-detection](./anti-tactic-detection.md) (the meta-skill of *recognizing* trap-priming) and [red-herring-resistance](./red-herring-resistance.md) (the METER metric).

**Sources**:
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — ~25-40 lateral puzzles spanning the 7 trap classes
- Edward de Bono, *Lateral Thinking* (Harper Perennial 1970) — coined the term but treats lateral thinking as a unitary creative skill; this page splits it into measurable traps instead
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast + §Change Point of View — the named tools that fire against most trap classes

**Last updated**: 2026-05-24

---

## The 7 trap classes

### Trap 1 — Irrelevant numerical data

The puzzle gives N numbers; only k < N are load-bearing. The trap is using one of the (N − k) red herrings.

**Examples**:
- #3 Kids: "10 had juice, 8 had cake, 6 had both" — the only numbers; *no* trap, all 3 are load-bearing. But the *implicit* trap is asking for "how much juice" or "how many were boys" — the framing primes the wrong question.
- #16 Light Speed: gives Earth-Sun distance, light speed, doubled-light speed — *all 3 numbers irrelevant*. Sunrise = 6 am regardless. Crux: rotation, not light.
- #4 Hard Times: "Flynn has fallen on hard times, turned to drink, ended up homeless tramp" — narrative irrelevance + correct numeric facts about 8 butts → 1 cigarette + iterate.
- #20 Banquet: gives 22 dormice, 40 larks' tongues, 30 flamingos, 40 parrots → asks "how many ostriches?" Answer: 0 (no ostriches mentioned, so 0). Pure list-distractor.

**Defense**: [red-herring-resistance](./red-herring-resistance.md) METER metric ≤1 false-positive per 10. Drill: before computing, list which puzzle facts are load-bearing.

### Trap 2 — Embellishment-induced wrong tactic

Narrative embellishment matches a familiar archetype, priming the solver to apply that archetype's tactic — but the answer requires a *different* tactic.

**Examples**:
- #16 Light Speed (re-cited): the "speed of light" embellishment primes physics calculations; the answer is astronomy/rotation.
- #80 Quick Q's "head and tail no legs in his pocket": primes "what animal?" — the answer is a coin.
- #103 / #327 Dark Lord's Journey: gives "miles" distances; the trap is computing arithmetic; the answer is decoding A=1, B=2 from the place names.

**Defense**: [anti-tactic-detection](./anti-tactic-detection.md) meta-skill. Before applying the obvious tactic, ask: "is this puzzle structured to make me reach for tactic X? If so, what's the alternative reading?"

### Trap 3 — Linguistic / lexical assumption

The puzzle uses a word with a *specific* meaning that the solver re-reads with a *general* meaning (or vice versa).

**Examples**:
- #100 Stringing Along: "Imagine a piece of string. Cut it. Two ends." The trap-reader thinks of a straight string (2 ends); the puzzle's setup is a *closed loop* (cut → 1 piece, 2 ends). The lexical pivot is "piece of string" — does it default open or closed?
- #417 Feet: "He has 14 feet of timber, takes 7 feet, leaves with…" Answer 9 because the lumberjack's own 2 feet count. Lexical pivot: "feet" as unit vs body part.
- #332 Divisions: "50 ÷ ½ + 5". Trap reads "half of 50 + 5 = 30". Correct: 50 / 0.5 = 100, +5 = 105. Lexical pivot: "divide by half" ≠ "halve".
- #393 Egg on Your Face: "The yolk of the egg are/is white." Pivot: subject-verb agreement, AND the factual question (yolks are yellow → both sentences are factually wrong; the answer is grammatical, not biological).

**Defense**: [linguistic-crux](./linguistic-crux.md) sub-class. Drill: any puzzle that pivots on a specific word, re-read with the alternate meaning before solving.

### Trap 4 — False precondition

The puzzle states a fact in the setup; the trap-reader treats it as a constraint when it's a misdirection.

**Examples**:
- #5 Cork and Bottle: "A bottle costs a dollar more than a cork. Together $1.10." Trap-reader: cork = 10¢. Correct: cork = 5¢, bottle = $1.05 (then bottle − cork = $1.00 ✓). The pre-condition "bottle costs a dollar more" is correct but the trap-reader fails to set it up algebraically.
- #195 Le Mans Go Carts: "1 mile track. Lap 1 at 30 mph. Average 60 mph for 2 laps requires lap 2 at…" Trap: 90 mph. Correct: *infinite* (already used 2 mins on lap 1 at 30 mph; 2 laps in 2 min total = no time left for lap 2).

**Defense**: [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Wishful Thinking — write the unknowns explicitly. Algebraic setup catches the false precondition.

### Trap 5 — Counterfactual irrelevance

The puzzle includes a counterfactual or hypothetical that the trap-reader treats as load-bearing.

**Examples**:
- #16 Light Speed (re-cited): "by some freak of physics the speed of light is doubled" — counterfactual. Trap-reader recomputes light-travel time. Correct: ignore (sunrise depends on rotation).
- #18 Speedy Math: time-pressure framing that primes guessing; actually all arithmetic is exact.

**Defense**: Read-only-load-bearing-facts reflex. Drill: any "imagine if…" preface, ask "does the answer depend on the counterfactual? If not, ignore it."

### Trap 6 — Category-error setup

The puzzle's surface form belongs to category A; the answer requires reading it as category B.

**Examples**:
- #100 Stringing Along (re-cited): topology problem disguised as a physical-string puzzle.
- #313 Conjunction of the Planets: "5 stars make 2 rows of 3; add 1 star so there are 4 rows of 3" — geometric/combinatorial puzzle disguised as astronomy. Solution: add the star at an intersection of imaginary diagonals so it's part of 4 rows.
- #318 Triangle of Coins: physical-rearrangement puzzle whose solution is *visual-symmetry* (move 3 corner coins to invert the triangle).

**Defense**: [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast — explicitly try converting to a different category (geometric ↔ algebraic ↔ combinatorial ↔ topological).

### Trap 7 — Perspective-shift required

The puzzle is solvable in the obvious reference frame *but trivial in a different one*. Trap-reader stays in obvious frame, computes correctly, but takes 10× the time.

**Examples**:
- #266 / #308 It's All Relative: "X's father is my mother's mother-in-law" — solvable by translating literally; *trivial* by drawing the family tree from a fixed root.
- #27 Hunting: "2 fathers + 2 sons went hunting, took 3 rabbits, 1 each" — solvable by enumeration; *trivial* by recognizing that grandfather + father + son = 3 people, where father is both son and father.
- #308 It's All Relative I: "Brothers and sisters have I none, but this man's father is my father's son" — solvable by translation; *trivial* from the "my father's son" = me observation.

**Defense**: [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Change Point of View. Drill: after attempting a problem the obvious way and finding it tedious, ask: "is there a frame in which this becomes one-line?"

## How the 7 traps map onto wiki defenses

| Trap | Defense layer | Primary tool | Secondary tool |
|---|---|---|---|
| 1 — Irrelevant numerical data | METER | [red-herring-resistance](./red-herring-resistance.md) | [representation-rules](./representation-rules.md) (list load-bearing inputs) |
| 2 — Embellishment-induced wrong tactic | Meta-tactic | [anti-tactic-detection](./anti-tactic-detection.md) | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast |
| 3 — Linguistic / lexical assumption | Crux-sub-class | [linguistic-crux](./linguistic-crux.md) | [crux-move](./crux-move.md) §Linguistic crux variant |
| 4 — False precondition | Algebraic discipline | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Wishful Thinking | [representation-rules](./representation-rules.md) (write the unknowns) |
| 5 — Counterfactual irrelevance | Reading discipline | Read-only-load-bearing reflex | [anti-tactic-detection](./anti-tactic-detection.md) |
| 6 — Category-error setup | Tactic | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast | [crux-move](./crux-move.md) §Crux interactions with universal tactics |
| 7 — Perspective-shift required | Tactic | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Change Point of View | (no other tool needed) |

## Cross-link to Psycho-Cybernetics

Every trap fires by installing an *unwarranted assumption* in working memory. The Maltz [F·A·I·L·U·R·E.](./failure-mechanism.md) mechanism includes "Uncertainty" — but a more precise mapping is to **[ants-and-lies-of-learning](./ants-and-lies-of-learning.md) ANTs** (Automatic Negative Thoughts) at the cognitive layer: each trap installs an automatic *positive* assumption ("this is a light-speed problem"; "feet means lumber"; "the string is straight") that's actually wrong.

The Amen identify-name-rebut counter-protocol applies:

1. **Identify**: feel the assumption fire (notice you've reached for a specific tactic)
2. **Name**: name which of the 10 [Burns/Beck distortions](./ants-and-lies-of-learning.md) applies — most often "jumping to conclusions" (the puzzle-cognitive equivalent of fortune-telling) or "mental filter" (ignoring puzzle facts that don't fit the assumed tactic)
3. **Rebut**: explicitly check the alternative reading before committing

This is the wiki's first concrete operational mapping of ANT-discipline → puzzle solving. The connection isn't decorative; the [memory-reconsolidation](./memory-reconsolidation.md) mechanism is the same — every uninterrupted assumption rumination strengthens the trace, including in puzzle-solving sessions.

## METER pass-floors

| Test | Pass floor |
|---|---|
| Name all 7 trap classes | <10 s, 100% |
| Given a lateral puzzle, identify which trap class | <30 s, ≥60% accuracy |
| Red-herring false-positive rate | ≤1 per 10 puzzles with irrelevant data |
| Lateral-trap detection on first read of a new puzzle | ≥60% catches before computing |
| Trap-to-defense mapping (recall the tool for each trap) | <8 s per trap, 100% |

## Failure modes

1. **Overcorrecting** — after one lateral puzzle, reading *every* puzzle as having a trap. ~30% of brain teasers have *no* lateral element; they're straight arithmetic or constraint propagation. Defense: archetype classification (per [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md)) before trap-hunting.
2. **Linguistic over-application** — treating every puzzle as a [linguistic-crux](./linguistic-crux.md). Most aren't. Defense: trap 3 specifically requires a *pivoting* word; if no word is doing double duty, trap 3 doesn't apply.
3. **Perspective-shift addiction** — trying alternative frames before exhausting the obvious frame. Per [zeitz-startup-strategies](./zeitz-startup-strategies.md) anti-pattern catalog: change POV is a *late* move, not an opener.
4. **Internalizing the trap-detection as cynicism** — reading every problem (including non-puzzles) as a trick. Defense: the [memory-paradox](./memory-paradox.md) dual-stance — take seriously enough to drill, hold lightly enough to not see traps where none exist.

## Mnemonic

Velvet Aeon Mode-Identity register: a **scholar in a hall of mirrors**. **7 mirrors** ring the room — each reflects a *false image* of the puzzle the scholar is trying to read. **Mirror 1** shows *too many objects* in the puzzle's room (the irrelevant-data trap — extra furniture appears that isn't really there). **Mirror 2** shows the *wrong tool* in the scholar's hand (embellishment-induced wrong tactic). **Mirror 3** shows *two words sharing one mouth* (linguistic). **Mirror 4** shows an *unspoken constraint* drawn as a chain (false precondition). **Mirror 5** shows a *hypothetical world* with weight added (counterfactual). **Mirror 6** shows the puzzle's silhouette *replaced by a different geometric shape* (category error). **Mirror 7** shows the scholar *upside-down* — same room, different gravity (perspective shift). The scholar's strong jaw is set; she has a **single warm candle** to navigate by — the puzzle's actual structure, distinct from the 7 reflections. Preserve = **sorrow as guidance** (each broken assumption is mourned but used to navigate). The scholar's hair is long and shines under the candle.

## Memory checksum

- **7** trap classes (irrelevant data · embellishment-induced · linguistic · false precondition · counterfactual · category error · perspective-shift)
- **7** primary defenses, mostly from [zeitz-startup-strategies](./zeitz-startup-strategies.md) + [anti-tactic-detection](./anti-tactic-detection.md) + [linguistic-crux](./linguistic-crux.md) + [red-herring-resistance](./red-herring-resistance.md)
- **4** failure modes (overcorrection · linguistic over-application · POV-addiction · cynicism)
- **3** Amen counter-protocol steps (identify · name · rebut)
- **1** cross-link to [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) (trap = ANT in puzzle context)

If you can recite 7-7-4-3-1 from "lateral thinking puzzles" within 45 s, the page is encoded.

## Related pages

- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — corpus
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — archetype B (lateral red herring)
- [anti-tactic-detection](./anti-tactic-detection.md) — meta-skill
- [red-herring-resistance](./red-herring-resistance.md) — METER metric
- [linguistic-crux](./linguistic-crux.md) — sub-class
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — Recast + Change POV defenses
- [crux-move](./crux-move.md) — the crux is in detecting the trap
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — counter-protocol layer
- [memory-reconsolidation](./memory-reconsolidation.md) — why uninterrupted assumptions ossify
- [representation-rules](./representation-rules.md) — listing load-bearing inputs disarms most traps
- [memory-paradox](./memory-paradox.md) — calibration against trap-addiction
- [crux-recognition-gym](./crux-recognition-gym.md) — drills trap-detection at sword-phase pressure

---

## U — See (CAST)

1. Scholar in hall of 7 mirrors with single warm candle, each mirror showing one trap-class distortion
2. Edges: trap → defense; trap → ANT instance; ANT → Amen rebut

## D — Name (NEDF)

1. Lateral thinking puzzles = 7 distinct trap classes, not a single creative skill
2. Each trap has a specific defense from existing wiki layers
3. Distinguisher: lateral ≠ "creative"; lateral = trap-recognition reflex
4. Failure mode: reading every puzzle as containing a trap (cynicism)

## F — Do (SPEAR)

1. Read puzzle → classify archetype first (per [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md))
2. If archetype B → run 7-trap scan in ≤30 s
3. Trap identified → apply matching defense; log METER trap_class field
4. Solve; verify whether the trap-class diagnosis was correct

## B — Watch (HEART)

1. Reaching for an obvious tactic without 30 s trap-scan
2. Reading the trap as ambient creativity instead of a named class
3. Over-applying linguistic-crux when only embellishment fired
4. Treating all puzzles as containing traps (cynicism)

## L — Predict (ORACLE)

1. Source with high lateral count (Livingstone-Thomson ~25-40 of 211) → trap-scan accuracy stabilizes around session 15
2. Cross-source transfer to Zeitz / Putnam: lower lateral-density; expect over-firing in early sessions

## R — Act (GRACE)

1. Detected trap → name the class before solving
2. Solver coaching: ask "which of the 7 traps fires here?"
3. After session → review per-trap-class accuracy; route weakest to drill
