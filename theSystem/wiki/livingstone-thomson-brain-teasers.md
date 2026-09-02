---
palace: strategic-memory
level: 5
domain: 10
room: 7
wiki_source: wiki/problem-solving/livingstone-thomson-brain-teasers.md
---

# Livingstone & Thomson — Brain Teasers (211 puzzles, 2009)

**Summary**: Ian Livingstone (Fighting Fantasy co-creator) + Jamie Thomson, *Brain Teasers — 211 Logic Puzzles, Lateral Thinking Games, Mondrians, Memorization Games, and Cryptomath Problems to Exercise Your Mind* (Skyhorse 2009; UK title *How big is your brain?*). 489 pp. **Choose-your-own-adventure** format: 211 timed puzzles + ~211 answer sections cross-linked by section number, not page number. Read order ≠ section order. **Structurally a [crux-recognition gym](./crux-recognition-gym.md)** — each puzzle compresses to one [crux-move](./crux-move.md) whose recognition is the load-bearing skill. The book itself uses a [fixed-mindset](./growth-mindset.md) "how big is your brain?" verdict frame that the wiki **flags and rejects**; the puzzles are kept, the frame is not.

**Sources**:
- Ian Livingstone & Jamie Thomson, *Brain Teasers* (Skyhorse 2009; UK 1st ed.) — `C:\Users\David\Documents\Brain Teasers - 211 Logic Puzzles - Lateral Thinking - Memorization Games - Exercise Your Mind.pdf`
- Decrypted copy at `C:\Users\David\Documents\Brain Teasers - 211 Logic Puzzles - no-password.pdf`
- Extracted text in `.tmp/brain-teasers/pages-01.txt` … `pages-10.txt` (50-page chunks, pdfplumber 2026-05-24)

**Last updated**: 2026-05-24

---

## Format

- **211 puzzles** + ~211 answer sections, all numbered 1–422; the reader is shuttled between them by the puzzle text ("turn to 192 for the answer; if you got it right, turn to 374 for the next puzzle, or to 327 for a TOUGH puzzle").
- **Timed scoring**: regular puzzle 2 pt ≤5 min, 1 pt >5 min, 0 pt wrong. TOUGH (skull-and-crossbones) 4 pt / 2 pt / 0. Sudoku-likes ("SPIDOKU") get 10 min. Max ≈ 875 pts.
- **No calculator allowed.** All arithmetic mental.
- **Outcome table** (book's own): 0 = "amoeba"; 1–50 = "ganglion of nerve cells"; 51–99 = "give book to chimpanzee"; 100–150 = "walnut-brain"; 151–200 = "apple-brain"; 251–450 = "good working human brain"; 451–500 = "is your head egg-shaped?"; 601–700 = "treat other humans with arrogant contempt"; 750+ = "god-like intelligence, take charge of everything"; 875 = "you cheated, only a god would score this".

## The 17-archetype taxonomy

I extracted from the 211 puzzles. See [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) for the full per-archetype mapping to wiki tools.

| # | Archetype | Sample puzzle # | Load-bearing wiki tool |
|---|---|---|---|
| A | Inclusion-exclusion / Venn | #3 Kids, #209 Evil Geniuses | inclusion-exclusion-tool (new) |
| B | Lateral-thinking red herring | #16 Light Speed, #4 Hard Times, #80 Quick Q's | [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast + [anti-tactic-detection](./anti-tactic-detection.md) |
| C | Memorization games (12 of them) | #2/#48/#182/#191 Remember Remember, #221/#232/#326 Gallery | [remaps](./remaps.md) + [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) + [smashin-scope](./smashin-scope.md) |
| D | Number / letter sequences | #181 R-O-Y-G-B-I-?, #205 M-A-M-J-J-A-S-O-N-?, #420 D-R-M-F-S-L-T-? | [universal-mathematical-tactics](./universal-mathematical-tactics.md) + [cultural-string-sequences](./cultural-string-sequences.md) (new) |
| E | Algebraic word problems | #11 Bird Long, #189 How Old, #255 Brothers & Sisters | Zeitz `Wishful Thinking` |
| F | Work-backward arithmetic | #119 Death in Desert, #407 Dark Lord's Bonus, #118 Gambler | Zeitz `Penultimate step` |
| G | Weighing / counterfeit | #274 Weighing Planets, #95 Weigh Anchor, #409 Alchemist's Jars | information-theoretic-minimum (new) |
| H | Pigeonhole / derangement | #306/#324 Action Figures | Universal Tactic #3 + derangement gap |
| I | Odd-one-out / similarities | #58/#251 Odd One Out, #116/#177 Similarities | Invariants (find broken) |
| J | Coin-state simulation | #148/#178/#188/#210/#288/#399 Heads in Your Head | Invariants (parity) + CAST |
| K | Geometric counting | #187 Square Bashing, #197 Dots & Squares, #396 Triangles & Squares | Systematic enumeration |
| L | Logic-grid constraint | #260 Spies, #68 Wizards' Hat, #328 Naval Gazing | Wishful Thinking case-elimination |
| M | Spatial / move-it-once | #13 Half Full Half Empty, #61 Cut a Cross, #277 Orc Pen, #303 Knight Moves | Zeitz `Get hands dirty` + `Draw a picture` + Symmetry |
| N | Constraint-propagation grids | Spidoku I-VI, Crossnumber I-III, Logi Place, Da Glyph Code, CryptoMath I-III | Get hands dirty + Invariants |
| O | Wordplay / linguistic crux | #393 yolk-is-white, #100 string-circle, #96 Sunrise-anywhere, #417 Feet | [linguistic-crux](./linguistic-crux.md) (new) |
| P | Family relations | #27 Hunting (3 people), #266/#308 It's All Relative, #394 Colonel=mother | Draw a picture (family tree) |
| Q | Probability | #118 Gambler, #306/#324 Action Figures | (gap — no probability page) |
| R | Cipher / position-encoded | #366/#289 CryptoMath, #103/#327 Dark Lord's Journey (A=1…Z=26) | Pigeonhole on digits + cipher recognition |

## Worked examples — five representative puzzles through the framework

### #3 Kids (Inclusion-exclusion, ~30 s)

> *At a children's party, 10 kids had juice, 8 kids had cake, and 6 kids had juice and cake. How many kids were there at the party?*

**Crux** (Tool level): apply |A∪B| = |A| + |B| − |A∩B| = 10 + 8 − 6 = 12. **Trap**: the "party" framing primes "ask for irrelevant facts (costs / ages / time)"; the answer ignores them. See inclusion-exclusion-tool.

### #16 Light Speed (Lateral red herring, ~60 s)

> *Distance Earth–Sun ≈ 100M miles; light = 186,000 mi/s; light takes 8 min from Sun to Earth. Sun rose at 6 am. Speed of light is suddenly doubled. What time will the Sun rise tomorrow?*

**Crux** (Tactic level): **recognize that all numerical embellishment is irrelevant.** Sunrise time depends on Earth's rotation, not light speed. Answer: 6 am. **Trap**: the puzzle deliberately primes the wrong tactic (compute time-of-flight). The wiki's [anti-tactic-detection](./anti-tactic-detection.md) page (new) names this skill.

### #4 Hard Times (Iteration, ~90 s)

> *Flynn collects cigarette butts; every 8 butts → 1 rolled cigarette. He has 64 butts. How many can he make?*

**Crux** (Tool level): 64/8 = 8 cigarettes; he then has 8 butts from those → 1 more = **9 total**. The biographical detail ("homeless tramp on the streets") is a red herring. Zeitz `Get hands dirty` (compute and re-feed the loop) closes it.

### #119 Death in the Desert (Work-backward, ~3 min)

> *Container leaks: hour 1 loses ½ + 1 L, hour 2 loses ½ of remainder + 1 L, hour 3 same, hour 4 same → empty. Starting volume?*

**Crux** (Strategy level): **Zeitz `Penultimate step`** — work backward from 0 L. End hour 4: 0 ⇒ before "+1 L" was 1 L; before "½ remainder" was 2 L. End hour 3: 2 ⇒ before "+1" was 3, before "½" was 6. End hour 2: 6 ⇒ 7 → 14. End hour 1: 14 ⇒ 15 → **30 L**. Direct hit on Penultimate-step strategy.

### #209 Evil Geniuses (Inclusion-exclusion ×3 + Kang anchor, ~5 min, TOUGH)

> *Three roles (Dark Lord, Supervillain, Galactic Overlord). Kang is all three. 9 Dark Lords drank Virgin's Blood; 7 Supervillains drank Anti-heroes Delight; 5 Galactic Overlords drank both. How many at the convention?*

**Crux** (Tactic level): 3-set inclusion-exclusion with one fully-instantiated triple intersection. |A∪B∪C| = |A| + |B| + |C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|. Need careful parsing of who's drinking what to identify the |A∩C| set. The trap is that the puzzle gives 4 numbers but tries to push you to add them naively.

## Strongest unlock surfaced

**The book is a [crux-recognition gym](./crux-recognition-gym.md).** Each of the 211 puzzles is one [crux-move](./crux-move.md) compressed into a paragraph; the load-bearing skill is *identifying which of ~12 tactics applies in <60 s*. Structurally identical to construct-recognition-gym (code-pattern recognition in 6 s) but on a different axis (problem-archetype recognition in 60 s). Promotes recognition-gym from candidate-pattern (1 instance) to **2 instances**; one more triggers owner-page promotion.

See [composability-index](./composability-index.md) §Confirmed unlocks for the registered row.

## What the framework gets right (5 of 17 archetypes are direct hits)

1. **Penultimate step** carries archetype F (work-backward arithmetic) — ~30 puzzles.
2. **Get hands dirty** carries archetypes M + N (spatial + grid puzzles) — ~50 puzzles.
3. **Recast + Change POV** carry archetype B (lateral thinking) — ~40 puzzles.
4. **4 Universal Tactics** (Symmetry · Extreme · Pigeonhole · Invariants) carry archetypes H + I + J + K (math-contest-style) — ~40 puzzles.
5. **The encoder stack** (REMAPS + peg-matrix + SMASHIN' SCOPE) crushes archetype C (memorization games) — 12 puzzles; the book treats memorization as raw capacity, the wiki's stack is a 5–10× improvement on raw recall.

## What the framework lacks (gaps closed by this ingest)

| Gap | Closed by | Affects |
|---|---|---|
| No Venn / |A∪B| tool | inclusion-exclusion-tool | Archetype A — 2 puzzles |
| No log_b(N) identification minimum | information-theoretic-minimum | Archetype G — 3 puzzles |
| No cultural-letter-sequence dictionary | [cultural-string-sequences](./cultural-string-sequences.md) | Archetype D — 8 puzzles |
| No "linguistic crux" sub-class | [linguistic-crux](./linguistic-crux.md) | Archetype O — 6 puzzles |
| No "anti-tactic detection" meta-skill named | [anti-tactic-detection](./anti-tactic-detection.md) | Archetype B — 40 puzzles |
| No "red-herring resistance" METER metric | [red-herring-resistance](./red-herring-resistance.md) | All red-herring archetypes — ~50 puzzles |

## Mandatory framing warning — fixed-mindset rejected

The book frames puzzle-solving as **brain-size measurement** ("Mission Accomplished — find out how big your brain is"). This is a [fixed-mindset](./growth-mindset.md) violation and a [LIE #1](./ants-and-lies-of-learning.md) instance ("intelligence is fixed"). Per CLAUDE.md citation rules (*"if a source contains incorrect claims, the wiki page must flag them — don't quietly absorb errors"*):

- **Keep**: the 211 puzzles as a [crux-recognition gym](./crux-recognition-gym.md) training set; the timing discipline; the "TOUGH puzzles score more" effort-rewarding structure.
- **Reject**: the brain-size verdict frame; the "ganglion of nerve cells / amoeba / give book to chimpanzee" outcome labels; the "treat other humans with arrogant contempt" 601–700-point label.
- **Reframe**: the 875-point ceiling is *current crux-recognition speed*, not *brain size*. Score improvement across re-attempts is the **growth-mindset reading** of the same data.

The book gets right **what to drill** (211 cruxes). It gets wrong **why** (verdict, not development). The wiki reads the puzzles, leaves the frame.

## METER additions surfaced

| Metric | Floor | Owner |
|---|---|---|
| Crux-identification within 60 s | ≥70% | [crux-recognition-gym](./crux-recognition-gym.md) |
| Named-tactic accuracy (which of 4 universal tactics) | ≥80% | [crux-recognition-gym](./crux-recognition-gym.md) |
| Red-herring false-positive (using irrelevant data) | ≤1/10 puzzles | [red-herring-resistance](./red-herring-resistance.md) |
| Encoder-gain vs raw recall on Gallery puzzles | ≥+5 items / 24 | [remaps](./remaps.md) §brain-teaser-benchmark |
| Lateral-trap detection on first read | ≥60% | [anti-tactic-detection](./anti-tactic-detection.md) |
| Linguistic-crux detection on pun-puzzles | ≥50% | [linguistic-crux](./linguistic-crux.md) |

## METER pass-floor for this page

| Test | Pass floor |
|---|---|
| Name authors + year | <4 s |
| Recall format (choose-your-own + timed) | <6 s |
| Recall total puzzle count | <3 s, exact (211) |
| Recall the 17-archetype count | <4 s, exact (17) |
| Recall the lead unlock (book = crux-recognition gym) | <8 s |
| Name the 6 gaps closed | <30 s |
| Recall the framing warning | <10 s |

## Mnemonic

Velvet Aeon Mode-Cosmic register: a **vast hall of 211 candle stubs**, each candle a single brain teaser, arranged in 17 rings (one ring per archetype). A **scholar** stands at the center holding a **stopwatch in one hand** and a **stack of 4 scroll-tactics in the other** (Symmetry · Extreme · Pigeonhole · Invariants). At each candle she must, in 60 seconds, *recognize* which scroll applies and *name* the crux. The candles she has lit form a constellation overhead — past wins — but the unlit ones are not failures, only future cycles. A **broken brain-size measuring stick** lies snapped on the floor by her feet (the rejected fixed-mindset frame). The scholar has the **STRONG** face archetype (angular jaw, piercing gaze) per feedback_image_face_and_hair; hair long and lifted in cold cosmic wind; preserve = **sacred memory** (each lit candle holds the crux-shape forever).

## Memory checksum

- **211** puzzles + ~211 answer sections (numbered 1–422)
- **17** archetypes mapping to **12** load-bearing wiki tools (5 hit, 6 newly-added, 1 partial gap)
- **5** strongest framework hits (Penultimate · Hands-dirty · Recast/POV · 4 Tactics · encoder stack)
- **6** gaps closed by this ingest (Venn · log_b · cultural-strings · linguistic-crux · anti-tactic · red-herring)
- **6** METER metrics added (crux-id · tactic-id · red-herring · encoder-gain · lateral-trap · linguistic-crux)
- **1** rejected frame (fixed-mindset brain-size verdict)
- **1** lead unlock (book = 2nd recognition-gym instance after construct-recognition-gym)

If you can recite 211-17-12-5-6-6-1-1 from "Livingstone-Thomson Brain Teasers" within 90 s, the page is encoded.

## Related pages

- [crux-recognition-gym](./crux-recognition-gym.md) — the load-bearing gym pattern this book instantiates
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — the 17-category map with full per-archetype detail
- [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) — the 7 trap-class taxonomy distilled from the 211
- inclusion-exclusion-tool — closes archetype A
- information-theoretic-minimum — closes archetype G
- [cultural-string-sequences](./cultural-string-sequences.md) — closes archetype D
- [linguistic-crux](./linguistic-crux.md) — closes archetype O
- [anti-tactic-detection](./anti-tactic-detection.md) — closes archetype B at the meta-tactic layer
- [red-herring-resistance](./red-herring-resistance.md) — the METER-tracked skill
- [crux-move](./crux-move.md) — every brain teaser has exactly one
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) — the discovery-layer toolkit the book exercises
- [universal-mathematical-tactics](./universal-mathematical-tactics.md) — the 4-tactic alphabet for ~40 of the puzzles
- [ok-plateau](./ok-plateau.md) — crux-recognition is exactly the per-problem-step the OK-Plateau page tells you to keep Cognitive
- construct-recognition-gym — sister recognition gym on the code axis
- [red-queen-skill-gym](./red-queen-skill-gym.md) — the parent gym pattern
- [growth-mindset](./growth-mindset.md) — the book's frame violates this; we keep puzzles, reject frame
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — LIE #1 (intelligence is fixed) instance flagged
- [composability-index](./composability-index.md) — new confirmed + candidate unlocks registered

---

## U — See (CAST)

1. 211 candles in 17 rings, scholar with stopwatch + 4 tactic-scrolls at center, broken brain-size stick on floor
2. Edges: candle → archetype → tool; scholar → crux-recognition reflex

## D — Name (NEDF)

1. Livingstone-Thomson 2009 = 211 timed puzzles, choose-your-own-adventure
2. 17 archetypes; 12 wiki tools (5 hit, 6 added, 1 gap)
3. Distinguisher: NOT a math drill — a crux-recognition gym disguised as one
4. Failure mode: absorbing the brain-size verdict frame instead of rejecting it

## F — Do (SPEAR)

1. Open the book → start at #1, run the choose-your-own sequence
2. Per puzzle: name the crux in <60 s, name the tactic in <30 s, then solve
3. Log METER event with `crux_identified` + `named_tactic` + `red_herring_present`
4. After 50-puzzle batch → review the 4 floor metrics; route weakest to drill

## B — Watch (HEART)

1. Solving without naming the crux (rote, doesn't build the gym skill)
2. Getting the right answer via the wrong tactic (lateral-puzzle-specific failure)
3. Internalizing the brain-size verdict frame
4. Reading the answer before exhausting the 5-min regular / 10-min SPIDOKU window

## L — Predict (ORACLE)

1. New puzzle in archetype seen before → predict tactic with ≥80% accuracy after 30-puzzle calibration
2. Red-herring rate drops with practice; lateral-trap detection plateaus around 70-80%

## R — Act (GRACE)

1. Read a puzzle → name its archetype and crux out loud before computing
2. Got it wrong → log which gap fired (red herring used? wrong tactic? linguistic miss?)
3. Coach another → name *their* crux for them when they stall, don't solve it
