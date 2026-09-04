---
palace: meta-knowledge
level: 8
domain: 10
room: 5
wiki_source: wiki/problem-solving/anti-tactic-detection.md
---

# Anti-Tactic Detection

**Summary**: The **meta-skill of recognizing that a puzzle is structured to prime the wrong tactic** — and rejecting that priming before applying any tactic. Sits *above* [universal-mathematical-tactics](./universal-mathematical-tactics.md) and [zeitz-startup-strategies](./zeitz-startup-strategies.md) in the wiki framework stack; fires *before* tactic selection, not inside it. The load-bearing skill the [Livingstone-Thomson 211-puzzle corpus](./livingstone-thomson-brain-teasers.md) teaches across ~40 of its puzzles (archetype B). Sister to [red-herring-resistance](./red-herring-resistance.md) (the METER metric) and [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) (the 7-trap-class taxonomy).

**Sources**:
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — corpus that surfaces the meta-skill
- The general pattern observable across pop-culture lateral thinking ("brain teasers", "trick questions", "lateral thinking puzzles"), legal-loophole arguments, and tactical-deception literature

**Last updated**: 2026-05-24

---

## Why "meta" — the layer above tactic-selection

The wiki's existing problem-solving stack runs roughly:

```
1. ORIENT / FRAME FORGE (capture unfamiliar territory)
2. Classify problem type  (problem-type-classifier)
3. Apply startup strategy (zeitz-startup-strategies)
4. Apply tactic           (universal-mathematical-tactics)
5. Construct argument     (methods-of-mathematical-argument)
```

**Anti-tactic detection inserts itself between step 2 and step 3.** Before reaching for *any* startup strategy or tactic, ask:

> *Is this puzzle structured to make me reach for tactic X — and is that intended to mislead?*

If yes, the correct first move is **not** to apply X; it's to identify the alternative reading the puzzle is hiding.

## The detection signals

Three signals that a puzzle may have an anti-tactic structure:

### Signal 1 — Embellishment-to-arithmetic ratio is high

The puzzle contains substantial narrative detail (names, biographies, dates, distances, prices, professions) but the underlying math (if any) is *trivial*. Embellishment without matching computational complexity is a flag.

*Example*: #16 Light Speed gives Earth-Sun distance, light speed, doubled speed, sunrise time. Math is trivial (rotation = 24h). The 4 numbers are all decoration.

### Signal 2 — The "obvious" tactic produces an answer that's just-so

You compute the obvious answer; it falls out cleanly. *Too cleanly*. The puzzle is famous-style, the answer is rote. Suspect anti-tactic.

*Example*: #5 Cork and Bottle. Obvious answer: cork = 10¢. Falls out instantly. Too instant — flag for re-check. Correct: cork = 5¢ (the obvious answer fails the *other* constraint, "bottle costs $1 more than cork").

### Signal 3 — The framing is genre-aware

The puzzle's narrative is *itself* a "brain teaser / trick question" — Dark Lords, Wild Bill, lateral-thinking-puzzle props. The genre-awareness is a hint the puzzle is designed to subvert.

*Example*: any of the #103 / #327 Dark Lord's Journey puzzles. The genre signals "brain teaser"; expect a non-obvious crux (in this case: distances are alphabet-position-cipher encoded, not literal).

## The 3-step anti-tactic protocol

1. **Scan for signals 1-3** within the first 15 seconds of reading.
2. **Name the *obvious* tactic** out loud (or in writing). "If this were a straight problem, I would use tactic X."
3. **Explicitly question the obvious tactic** — "What if tactic X is wrong here? What's the alternative reading?" Try the alternative for 30 s; if it produces a clean answer, anti-tactic has fired.

Total time budget: ~60-90 s on top of the puzzle's normal solve time. For lateral puzzles this overhead is recovered many-fold; for non-lateral puzzles it's a 1-minute insurance premium.

## Cross-link to existing wiki layers

| Layer | Relationship |
|---|---|
| [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) | The 7 trap classes are *instances* of what anti-tactic detection generalizes |
| [red-herring-resistance](./red-herring-resistance.md) | The METER metric this skill produces |
| [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast | The startup-strategy execution after anti-tactic detection fires |
| [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Change POV | Alternative execution if Recast doesn't suffice |
| [crux-move](./crux-move.md) | Anti-tactic detection is itself a tactic-level crux for lateral puzzles |
| [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) | Every anti-tactic fire is a triggered ANT; the 3-step protocol is the puzzle-domain Amen-Cancel cycle |
| [memory-paradox](./memory-paradox.md) | Calibration: take seriously enough to scan, hold lightly enough to not see traps in every puzzle |
| [crux-recognition-gym](./crux-recognition-gym.md) | Where this is drilled |

## The meta-skill IS a Coagulation-resistant operation

Per [ok-plateau](./ok-plateau.md) §Crux-routing rule, the crux move should *never* be Coagulated. Anti-tactic detection is a *meta-crux* — a process that decides whether the per-puzzle crux is structural or anti-tactic. It must also stay in the Cognitive stage.

This is why [crux-recognition-gym](./crux-recognition-gym.md) tracks anti-tactic detection as a separate metric — Coagulating "I always re-read for traps" becomes its own failure (over-detection of traps that aren't there). The skill is to *fire the scan*, not to *default to suspicion*.

## Failure modes

1. **Over-firing (cynicism)** — running the scan on every puzzle, including straight arithmetic. Defense: archetype classification first ([puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md)); only run anti-tactic scan for archetypes B + O.
2. **Under-firing (rote)** — never running the scan, just defaulting to obvious tactics. Defense: per-session METER target — at least 1 scan per 10 puzzles.
3. **False-positive (suspicion-induced over-correction)** — anti-tactic detection fires, but the *original* obvious tactic was actually correct. Defense: verify alternative reading produces a *cleaner* answer; if both readings are equally valid, the puzzle is ambiguous, not anti-tactic.
4. **Coagulation of the scan** — automating the scan to fire without conscious engagement loses the cognitive stage benefit. Defense: METER tracks scan-conscious-engagement separately.

## Cross-domain transfer

The skill generalizes far beyond brain teasers:

| Domain | Anti-tactic instance |
|---|---|
| Engineering | "We need to scale this database" → maybe the load is unrealistic and the right answer is to reduce load, not scale |
| Security | "We need to encrypt this data" → maybe the data shouldn't be collected at all (privacy-by-design) |
| Product | "We need to add feature X" → maybe the right answer is to remove a different feature blocking X's use |
| Personal | "I need to drill harder" → maybe the [snap-back-effect](./snap-back-effect.md) is pulling me down; [theater-of-the-mind](./theater-of-the-mind.md) is the upstream fix, not more drilling |
| Bible study | "What does this passage *literally* mean?" → for apocalyptic genre the right tactic is symbolic-decoding (bible-apocalyptic-symbol-key); literal-defaulting is anti-tactic |

The wiki should register anti-tactic detection as **horizontal infrastructure**, not just a puzzle-solving tool.

## METER pass-floors

| Test | Pass floor |
|---|---|
| Recite the 3 signals | <10 s |
| Recite the 3-step protocol | <8 s |
| Anti-tactic detection rate on archetype B puzzles | ≥60% within 60 s |
| False-positive rate (anti-tactic-fired-but-obvious-was-correct) | ≤20% |
| Scan time overhead per puzzle | ≤90 s |
| Cross-domain identification (named 1 non-puzzle instance) | <30 s |

## Mnemonic

Velvet Aeon Mode-Identity register: a **scholar before a chess board** that doesn't look like a chess board — the squares have *narrative scenes* painted on them (a Dark Lord here, a Roman emperor there, a lumberjack with timber). Beneath each painted square is the actual board square. The scholar's task is **not** to play the chess move the surface paintings suggest, but to **scrape away the paint** (the embellishment) and see the actual board geometry beneath. She holds a **small silver scraping tool**, applied to one square at a time. Behind her stands a **mirror** showing her the painted-over board reversed — the alternative reading. The scholar has the **STRONG** face archetype (anti-tactic detection requires the power to resist the puzzle's pull); preserve = **sorrow as guidance** (every scraped-away painting is a tiny loss but reveals truth). Long shining hair drapes the chess board. Single warm light from above, no other glow.

## Memory checksum

- **3** detection signals (embellishment/math ratio · too-clean obvious answer · genre-aware framing)
- **3** protocol steps (scan in 15 s · name obvious tactic · question + try alternative)
- **4** failure modes (over-fire · under-fire · false-positive · Coagulation-of-scan)
- **5** cross-domain transfers (engineering · security · product · personal · Bible study)
- **1** position rule (between problem-classification and startup-strategy selection)
- **1** Coagulation rule (the scan stays Cognitive — never automated)

If you can recite 3-3-4-5-1-1 from "anti-tactic detection" within 50 s, the page is encoded.

## Relation to Copi's general fallacy taxonomy (2026-05-25)

Anti-tactic detection is the **puzzle-domain instance** of the general [Copi fallacy taxonomy](./fallacy-taxonomy.md) (added 2026-05-25 from the [Copi/Cohen/McMahon *Introduction to Logic* 14th ed](./copi-introduction-to-logic.md) ingest):

| This page's puzzle-specific signal | Copi-taxonomy family the signal targets |
|---|---|
| Signal 1: *embellishment-to-arithmetic ratio is high* | **Fallacy of Relevance** — irrelevant data presented as if it bears on the answer; sister to [red herring](./red-herring-resistance.md) |
| Signal 2: *the obvious tactic produces a too-clean answer* | **Fallacy of Presumption** — the puzzle is structured to make you presuppose the unwarranted-but-obvious reading |
| Signal 3: *genre-aware framing pressure* | **Fallacy of Ambiguity** (mostly) — the genre cues a meaning that the puzzle's literal wording does not support |
| All 7 lateral-thinking trap classes ([lateral-thinking-puzzles](./lateral-thinking-puzzles.md)) | Map onto specific Copi fallacies — primarily Relevance (1, 5) and Ambiguity (3, 6) |

**Anti-tactic detection is *not* a redefinition of fallacy taxonomy** — it's a *narrower, puzzle-specific* detector that fires on the same underlying argument-shapes Copi catalogues. The wiki's stance: when you're solving puzzles, use the 3 signals; when you're evaluating any other kind of argument (op-ed, scientific claim, security argument, money argument, Bible-study reading), use the general [fallacy taxonomy](./fallacy-taxonomy.md).

Cross-link: the [Fallacy-Recognition Gym](./fallacy-taxonomy.md) is the *general* gym; the [Crux-Recognition Gym](./crux-recognition-gym.md) is the *puzzle-specific* gym; both are instances of the **recognition-gym pattern** in [composability-index](./composability-index.md) (N=3 as of 2026-05-25 — pattern promotion eligible).

## Related pages

- [lateral-thinking-puzzles](./lateral-thinking-puzzles.md) — 7 trap-class taxonomy
- [red-herring-resistance](./red-herring-resistance.md) — METER metric
- [livingstone-thomson-brain-teasers](./livingstone-thomson-brain-teasers.md) — corpus
- [puzzle-archetype-taxonomy](./puzzle-archetype-taxonomy.md) — archetype B
- [crux-move](./crux-move.md) — anti-tactic-detection IS a meta-crux for lateral puzzles
- [crux-recognition-gym](./crux-recognition-gym.md) — where this is drilled (puzzle-specific)
- [fallacy-taxonomy](./fallacy-taxonomy.md) — the *general* superset of this page; ~25 named fallacies in 3 families; added 2026-05-25
- [copi-introduction-to-logic](./copi-introduction-to-logic.md) — fallacy taxonomy source (Ch 4)
- [logic-atomic-design](./logic-atomic-design.md) — hub registering fallacy taxonomy at Molecule tier
- [ok-plateau](./ok-plateau.md) — Coagulation-resistance rule
- [zeitz-startup-strategies](./zeitz-startup-strategies.md) §Recast + §Change POV — execution after detection
- [problem-solving-os](./problem-solving-os.md) — gains an "anti-tactic detection" sub-step in step 3
- [ants-and-lies-of-learning](./ants-and-lies-of-learning.md) — counter-protocol layer
- [memory-paradox](./memory-paradox.md) — calibration against over-firing
- [universal-mathematical-tactics](./universal-mathematical-tactics.md) — what fires *after* anti-tactic detection clears

---

## U — See (CAST)

1. Scholar before painted chess board, scraping tool in hand, mirror behind showing alternative reading
2. Edges: paint → scrape → real geometry; obvious move ⇒ alternative move

## D — Name (NEDF)

1. Anti-tactic detection = recognize that a puzzle is priming the wrong tactic; reject before applying
2. Meta-skill above tactic-selection
3. Distinguisher: fires *before* tactic, not inside it
4. Failure mode: cynicism (over-firing) or rote (under-firing)

## F — Do (SPEAR)

1. Read puzzle → 15 s scan for 3 signals
2. Signal detected → name obvious tactic out loud
3. Question obvious tactic → try alternative for 30 s
4. Verify alternative produces cleaner answer; log scan_fired in METER event

## B — Watch (HEART)

1. Scanning every puzzle (cynicism)
2. Never scanning (rote)
3. False-positive when obvious was right
4. Automating the scan (losing Cognitive engagement)

## L — Predict (ORACLE)

1. Archetype B + O puzzles → anti-tactic likely
2. After 30 puzzles with mixed archetypes, scan-fire-accuracy stabilizes

## R — Act (GRACE)

1. Detected signal → name "this might be anti-tactic"
2. Try alternative reading explicitly
3. Coach another → ask "what's the obvious move here, and what if it's wrong?"
