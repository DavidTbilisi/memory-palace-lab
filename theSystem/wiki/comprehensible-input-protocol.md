---
palace: meta-knowledge
level: 8
domain: 10
room: 11
semantic_mode: 5
glyph: 👂
wiki_source: wiki/learning-systems/comprehensible-input-protocol.md
---

# Comprehensible Input Protocol

**Summary**: The Comprehensible Input protocol is the operational form of Krashen's **Input Hypothesis** (see [krashen-sla-hypotheses](./krashen-sla-hypotheses.md)): second-language acquisition occurs when the learner consumes input that is **understandable in context** but contains structures **one step beyond** their current acquired level — the famous "**i+1**" — and consumes it in **volume**, with **low affective filter**. Stephen Krashen's secondary heuristic, the "**95% Rule**," operationalizes "comprehensible": text or speech is comprehensible when the learner recognizes ≥95% of running words; below ~90% comprehension collapses, above ~98% acquisition stalls because i+1 is missing. The protocol drives extensive reading methods, Sheltered Instruction, TPR, "free voluntary reading," and self-study tools like [Fluent Forever](./fluent-forever-wyner.md) and graded-reader stacks. This page is the canonical owner.

**Sources**:
- Krashen, S. D. (1982). *Principles and Practice in Second Language Acquisition*. Pergamon. Ch 3 (Input Hypothesis), Ch 4 (causative variables).
- Krashen, S. D. (1985). *The Input Hypothesis: Issues and Implications*. Longman.
- Krashen, S. D. (2004). *The Power of Reading* (2nd ed.). Heinemann. — extensive reading evidence base; free voluntary reading.
- Hu, M., & Nation, P. (2000). "Unknown vocabulary density and reading comprehension." *Reading in a Foreign Language*, 13(1), 403-430. — 95-98% coverage threshold for adequate comprehension.
- Schmitt, N., Jiang, X., & Grabe, W. (2011). "The Percentage of Words Known in a Text and Reading Comprehension." *Modern Language Journal*, 95(1), 26-43. — 95% as the working threshold.
- Ягодкин Н.А., Згода А.Н. (2023). *Учись учиться*. — rival text-work algorithm (pre-teach all unknowns → read at 100% comprehension) and the spoken frequency-coverage table; recorded as a contrast case below, not adopted.
- Internal: [krashen-sla-hypotheses](./krashen-sla-hypotheses.md), [fluent-forever-wyner](./fluent-forever-wyner.md), [language-learning-architecture](./language-learning-architecture.md).

**Last updated**: 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-07-16

---

## The three operational parameters

The protocol turns on three knobs the learner controls:

| Parameter | Target | What it controls |
|---|---|---|
| **Comprehensibility** | ≥95% word-recognition (Hu-Nation rule) | Whether input enters the LAD at all |
| **i+1** | One acquisition-step beyond current level | Whether anything new is being acquired |
| **Affective filter** | Low (relaxed, intrinsically motivated) | Throughput from input → acquired system |
| **Volume** | Large (hours per week, not minutes) | Acquisition rate compounds with exposure |

The 95% Rule is the load-bearing one operationally: it converts "comprehensible" from a subjective feeling into a measurable property. Count the unknown words per 100; if more than 5, the text is below threshold — either step down to easier material or scaffold the unknown words before reading.

## The 95% / i+1 trade-off

There's an internal tension between *comprehensibility* (favors familiar input) and *i+1* (favors slightly-unfamiliar input). The protocol resolves it via **input density**: comprehensible input must be ≥95% known, with the **remaining ≤5% being the i+1 material**.

| Component | Share | Role |
|---|---|---|
| known words | 95%+ | supplies the *context* that makes i+1 inferrable from situation |
| unknown i+1 | ≤5% | the *target* being acquired in this session |

Two failure modes from violating this balance:

- **All-known input (~100%)**: comfortable, no acquisition signal. The learner feels fluent but doesn't grow.
- **<90% known**: comprehension collapses; the brain stops trying to infer i+1 and starts using lookup-and-translate (which engages the *learning* system, not the acquisition system).

## Sources of comprehensibility (beyond word recognition)

Even at <95% raw word recognition, input can be comprehensibilized through:

- **Visual context** — pictures, gesture, scene; TPR (Total Physical Response) leverages this
- **Prior knowledge** — familiar topic, known story arc
- **Simplification** — "teacher talk" / "caretaker speech" / sheltered language
- **Negotiation of meaning** — interlocutor rephrases, gestures, defines
- **Redundancy** — same idea expressed several ways in one passage

A picture book about a topic the learner knows (the alphabet, a folk tale, soccer) can be 60% word-comprehensible and still functionally comprehensible because context fills the gaps. Without these scaffolds, raw text needs to hit ~95%.

## The canonical implementation stack

1. **Graded readers** — sequenced by vocabulary level (most major languages have full ladders, e.g. Cambridge English Readers Level 1-6, JLPT-graded readers, Penguin Easystart-Advanced).
2. **Dubbed or subtitled native media** — TL audio with TL subtitles is the standard self-study form; raw L1 subtitles defeat the protocol (they short-circuit acquisition into translation).
3. **Slow / sheltered podcasts** — News in Slow Spanish, Easy German, NHK Easy News.
4. **Conversation with patient native speakers** — Tandem partners, language exchanges, classroom interaction.
5. **Extensive reading** — Krashen's *free voluntary reading*; learner picks anything they enjoy and read it at volume.

The protocol is **volume-first**: small daily doses (15 min) underperform large sustained doses (90 min) by a wide margin. Acquisition rate is a function of input *hours*, not input *sessions*.

## Visual

```chart height=320
{"color":["#7d8aa0","#5c7a54"],
 "legend":{"data":["Comprehension","Acquisition rate"]},
 "xAxis":{"type":"category","data":["<85% known","85–94% known","95–98% known",">98% known"]},
 "yAxis":{"type":"value","name":"relative level","axisLabel":{"show":false}},
 "series":[
   {"name":"Comprehension","type":"bar","data":[1,2,4,4]},
   {"name":"Acquisition rate","type":"bar","data":[0.2,1.5,4,1]}
 ]}
```

| Known words | Comprehension | Acquisition rate |
|---|---|---|
| <85% | comprehension collapses | collapses to ~0 |
| 85–94% | partial comprehension | slow, stressful (filter rises) |
| 95–98% | full comprehension + i+1 present | FASTEST (the target zone) |
| >98% | fully fluent | stalls — i+1 missing |

## Protocol vs. method

The Comprehensible Input *protocol* is the abstract claim. Several **methods** instantiate it:

| Method | How it implements CI |
|---|---|
| **TPR (Total Physical Response)** — Asher | Commands+actions; gesture comprehensibilizes |
| **Sheltered Instruction** | Content-area teaching with linguistic accommodations |
| **Extensive Reading** / **Free Voluntary Reading** | Volume + learner-chosen for low filter |
| **[Fluent Forever](./fluent-forever-wyner.md)** | SR-driven vocab on top of CI substrate |
| **Dreaming in Spanish / Easy Spanish (CI-only YouTube)** | TPR + comprehensibilized native media |
| **ALG (Automatic Language Growth)** | Pure-CI immersion, no production for ~800 hours |
| **AI-generated songs** (gated) | TL songs generated at controllable i+1; earworm = involuntary [spaced-repetition](./spaced-repetition.md) — see §AI-generated songs below |

## AI-generated songs as comprehensible input

A song is target-language audio, so it is already a CI delivery vehicle. What an **AI-generated** song adds is *control of i+1*: you specify the exact vocabulary and one target structure, so the lyric lands inside the acquisition window on purpose rather than by luck. This solves the protocol's hardest knob — "one step beyond" is hard to set at the input-design stage (a logged critique on [krashen-sla-hypotheses](./krashen-sla-hypotheses.md)) — and the **earworm supplies involuntary rehearsal**, i.e. free [spaced-repetition](./spaced-repetition.md), while the enjoyment lowers the affective filter.

It is a **method, not a framework**: no new encoder, no acronym. It sits under this protocol as a Strategy/Adapter (it *adapts* the structure you want to acquire into singable comprehensible input). Validated 2026-06-29 via `/validate-idea` (keep-with-modification).

A song counts as **acquisition** input only if it clears all three gates; otherwise log it as *phonology / affective-filter* input — still useful, not credited as acquisition:

1. **Comprehensibility gate.** Lyrics must clear the 95% rule above. A catchy song you cannot understand is `i+0` phonological drill at best, not acquisition — it trains the *learned* surface store, not the *acquired* system ([krashen-sla-hypotheses](./krashen-sla-hypotheses.md) §Acquisition–Learning).
2. **Correctness gate.** AI-generated TL lyrics can be ungrammatical, unidiomatic, or hallucinated — worst in low-resource languages (e.g. Georgian). **Verify with a native or high-quality reference before the song becomes input.** Unverified bad lyrics poison input the way [Wyner's](./fluent-forever-wyner.md) translation cards contaminate fluency.
3. **Decoupling gate.** Melody-bound recall is state-dependent: you may *sing* the conjugation yet not deploy it in spontaneous speech (the verse-memorization context-bound risk). Re-test the target structure **melody-free** in the automaticity layer ([language-learning-architecture](./language-learning-architecture.md) Layer 7), and pair with spoken shadowing — sung phonology ≠ spoken phonology (vowels stretched, stress bent to the beat), or it is karaoke, not fluency.

The prosody-first logic is borrowed from verse-memorization §SING ("encode prosody before semantics"); the spoken-frontier pairing routes through [l2-phonology-gym](./l2-phonology-gym.md). Indexed as a spoken/audio-first method on [polyglot-architecture](./polyglot-architecture.md).

**[METER](./meter-overview.md).** Emit `song.session` with: `lyric_comprehension_pct` (gate 1), `target_structures` (the i+1 items the song was built to deliver), `verified` (gate 2 boolean), `reps` (voluntary + involuntary), `usable_offmelody` (gate 3 test). **Pass-floor (acquisition credit):** `lyric_comprehension_pct ≥ 95` **and** `verified = true` **and** `usable_offmelody = true`. Any floor unmet → reclassify as phonology / affective-filter input.

## Failure modes

| Failure | Symptom | Mitigation |
|---|---|---|
| **Below-95% input** | Lookup-translate mode engages | Step down level; scaffold target vocab first |
| **Above-98% input** | Comfortable but no growth | Step up; introduce slightly-harder material |
| **Low-volume sessions** | Months of "studying" with little gain | Replace short sessions with longer; aim for hours/week |
| **High affective filter** | Anxiety mid-listening; comprehension shuts down | Lower-stakes input; topic the learner enjoys |
| **L1 subtitles** | "Reading" instead of listening | TL subtitles only; or no subtitles + context |
| **Production-first emphasis** | Stuck in basic phrases | Bias input until acquired competence supports output |
| **Unverified AI lyrics** | Memorizing a fluent-sounding error; worst in low-resource langs | Native/quality-check lyrics before use (correctness gate) |
| **Melody-bound recall** | Can sing the structure, can't deploy it in speech | Re-test melody-free in automaticity layer; pair with spoken shadowing |

## Counterpoint from the memorize pole

A different-lineage method sits on the opposite pole from this protocol: [phrase-based-acquisition](./phrase-based-acquisition.md) (Kozarenko's [GMS](./kozarenko-mnemotechnics.md) phrase layer) holds that fluent output is *retrieved* from memorized, over-learned phrases (эталонные фразы), not assembled from grammar or acquired purely through input. The wiki deliberately holds both poles open rather than resolving the tension: mnemonic phrase-memorization is treated as a proceduralization/Monitor-feeding accelerant that front-loads high-frequency chunks, while this protocol's comprehensible input remains the acquisition engine proper. Kozarenko's own observation — that memorized phrases make the brain start *segmenting* known chunks out of the live speech stream — is the comprehension side handing off to acquisition, which is exactly what this protocol measures.

## Contrast case: Yagodkin's pre-teach-then-read algorithm

A second rival, from a different lineage again, instructs the **opposite procedure** on this page's central knob. Nikolai Yagodkin's Advance school (the method itself is owned by [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md)) prescribes a **text-work algorithm** in three steps (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf):

1. **Scan, don't read.** Pass over the text only to find and highlight the unknown words — highlighter, not pencil, which loses itself against the text (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).
2. **Learn all of them.** Every highlighted word is translated (the topic usually picks the sense; if several fit, read the whole sentence) and memorized *before reading* — on cards, or straight off the text if recall is good (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). The encoding runs through mnemonic image-pairing, the technique owned by [substitute-word-system](./substitute-word-system.md).
3. **Read to 100% comprehension.** Read until the text is fully understood *at speed*. Residual gaps come from grammar not yet known and from multi-word items — *go on* survives the scan precisely because both words are individually known — and get cleared with a dictionary, the internet, a friend or a teacher. Re-read worked texts at native reading speed (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

Yagodkin's own case: asked to lecture on mathematics in English in South Korea, he highlighted every unknown word in the textbook, learned them, and read the required chapters three times (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). He notes simultaneous interpreters prepare for unfamiliar subject matter the same way (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). The same algorithm is offered for TL subtitles, whole books, and professional jargon (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

### The tension, stated precisely

Under **this page's own rule**, Yagodkin's target text has **no i+1 left in it by construction**. Every unknown has been pre-taught before reading begins, so the reading pass starts at ~100% known — the `>98%` band this page marks *acquisition stalls — i+1 missing* (§The 95% / i+1 trade-off, §Visual). His algorithm does not approach the acquisition window from below and stop at 95%; it deliberately **overshoots to 100% and then reads**. That is not a calibration quibble. It is the opposite instruction on the same knob.

### The strongest reading of Yagodkin's position

Stated at its best, his case may not be a contradiction at all:

- **Different pass, different variable.** He never claims the *text* teaches the vocabulary — in his model the **encoding pass** teaches it, and the reading pass is for consolidation, fluency and speed: re-reading is done at native reading speed, repeating all the words and grammar in context so the brain gets used to taking the foreign language in fast (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). In this wiki's vocabulary that is closer to a **fluency/automaticity drill** than to an acquisition input session — and this page's ">98% stalls" verdict is a claim about *acquisition rate*, not a claim that high-known-density reading is worthless. The two protocols may simply be optimising different variables.
- **The claim is narrower than it looks.** Advance's own text opens by naming the objection it expects — *«запоминание слов — это ещё не изучение языка»* ("memorizing words is not yet learning a language") — and answers that it is ready for it (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). Their headline throughput results are largely about **vocabulary acquisition rate**: a component of language competence, not the whole of it.

### But the conflict does not dissolve

Yagodkin *also* rejects passive input as a primary engine outright. Active reproduction builds far more neural connections than passive perception, so — his reframing of the proverb — **better to reproduce actively three times than to perceive passively a hundred times** (three being, he says, the minimum reps for a stable connection) (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf). He states plainly that many beginners believe listening to a native speaker — in a film or in real conversation — significantly improves their knowledge, and that **this is not so**: one must act — learn words, build phrases, speak (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

That is a genuine challenge to this protocol's central premise, which holds *volume of comprehensible input* to be the acquisition engine proper. Both claims cannot be fully right about the same variable. This page does not adjudicate; the fuller form of the argument is being kept on [krashen-sla-hypotheses](./krashen-sla-hypotheses.md) §Rival account rather than duplicated here.

**Gate decision for this ingest: rival account — noted, not resolved.** The 95% rule and the 70/30 split are unchanged; nothing above amends the protocol.

**What would settle it.** Hold total time constant and separate the passes: for matched learners on matched texts, does (a) *pre-teach every unknown → read at 100% known* or (b) *read at 95% known, inferring the unknown ≤5% from context* produce more durable retention **of those same target words** at delay, and more comprehension gain on **texts never pre-taught**? Discriminator (b) is the load-bearing one — it separates "this method taught these words" from "this method built the acquisition system." Until such a comparison exists, this page keeps its 95% rule and logs the Advance algorithm as a rival account of the same terrain, not a refutation of it. A near-neighbour test already lives in the wiki: [storm-and-siege-protocol](./storm-and-siege-protocol.md) runs the same pre-teach-then-consume shape against an intensive-siege timebox, so its logs are the closest available evidence surface.

### Precision trap: two different 98%s

Advance publishes a frequency-coverage table (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf) **(needs verification — no in-source citation given for the figures)**:

| Vocabulary | Recognition of *casual speech* |
|---|---|
| 100 words | 30% |
| 400 | 65% |
| 1,000 | 82% |
| 2,000 | **98%** |

— read by the authors as diminishing marginal utility: the first thousand words buy 82%, the second thousand add only 16% (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

**This 98% is not this page's 98%.** Advance's column is explicitly *распознавание бытовой речи* — casual **spoken** recognition. The Nation-lineage 98% in this page's Sources is **text** coverage, which takes roughly **8,000–9,000 word families**, not 2,000:

| Figure | Register | Vocabulary required |
|---|---|---|
| Advance's 98% | casual **spoken** recognition | 2,000 words (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf) *(needs verification)* |
| Nation-style 98% | **text** coverage | ~8,000–9,000 word families *(needs verification — this figure is Nation 2006,* How large a vocabulary is needed for reading and listening?*, which is not yet among this page's Sources; Hu & Nation 2000 and Schmitt et al. 2011 establish the 95–98% threshold, not the family count)* |

Same number, different register, wildly different requirement. **Any 98% cited on this page or its neighbours must name its register**, or "2,000 words gets you to 98%" silently licenses reading material it cannot support. The two figures are roughly 4× apart in vocabulary.

Advance's CEFR **active**-vocabulary targets sharpen the point: A1=500, A2=1,000, B1=2,000, B1+=3,000, B2=4,000, C1=8,000, C2=16,000 (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf) **(needs verification — no in-source citation)**. By Advance's own two tables, the vocabulary that delivers 98% of casual speech (2,000) is its **B1** figure — and B1 is nobody's definition of reading native text unaided. Note also that these are *active* counts while the coverage table is a *recognition* measure, so the two tables are not directly commensurable even within the source. Advance's own text elsewhere puts native speakers at ten to twenty thousand words and says two to three thousand suffices for a conversational level (source: Ягодкин Н.А., Згода А.Н. - Учись учиться - 2023.pdf).

Note that [language-family-clustering](./language-family-clustering.md)'s cognate discount cuts across both columns unevenly — cognates raise text recognition faster than they raise ear-recognition of fast casual speech — which is a further reason to keep the registers apart rather than average them.

## Neural OS implementations

- **`meter iplus1`** (`tools/meter/meter/iplusone.py`) — the operational 95%-rule check. Scores any text's word-recognition coverage against a personal known-word floor (`wiki/assets/known-words-en.txt`, e.g. the 8,871-word WordUp export in [semantic-reading-l2](./semantic-reading-l2.md)'s profile), bands it (too-hard <85% · frontier <95% · **i+1 95–98%** · too-easy >98%), surfaces the unknown ≤5% as sentence-mining targets, and emits a `sla.input_zone_check` [METER](./meter-overview.md) event. Lemma floor + morphological de-inflection; conservative lower bound on true coverage.
- [krashen-sla-hypotheses](./krashen-sla-hypotheses.md) — theoretical parent
- [fluent-forever-wyner](./fluent-forever-wyner.md) — Krashen-aligned operational protocol
- [language-learning-architecture](./language-learning-architecture.md) — wiki's stack-design for L2
- [language-learning-protocol](./language-learning-protocol.md) — daily-loop variant
- [language-family-clustering](./language-family-clustering.md) — typological proximity provides "free" comprehensibility via cognates
- [language-instinct-pinker](./language-instinct-pinker.md) — nativist substrate that makes CI work biologically
- verse-memorization — §SING (prosody-before-semantics) — the cross-domain prior art the song method borrows
- [l2-phonology-gym](./l2-phonology-gym.md) — spoken-frontier pairing for the decoupling gate
- [dictee-gym](./dictee-gym.md) — the runnable form of the decoupling gate for French: the song lines re-tested **melody-free at conversational speed**, typed rather than sung. Sung phonology ≠ spoken phonology, and a line you can sing but cannot transcribe at natural speed is the melody-bound-recall failure mode caught in the act.
- [polyglot-architecture](./polyglot-architecture.md) — cluster index where AI-generated songs are listed as a spoken/audio method

## Related pages

- [krashen-sla-hypotheses](./krashen-sla-hypotheses.md)
- [fluent-forever-wyner](./fluent-forever-wyner.md)
- [language-learning-architecture](./language-learning-architecture.md)
- [language-learning-protocol](./language-learning-protocol.md)
- [language-family-clustering](./language-family-clustering.md)
- [language-instinct-pinker](./language-instinct-pinker.md)
- [active-recall](./active-recall.md)
- [spaced-repetition](./spaced-repetition.md)
- [desirable-difficulties](./desirable-difficulties.md)
- verse-memorization
- [l2-phonology-gym](./l2-phonology-gym.md)
- [polyglot-architecture](./polyglot-architecture.md)
- [phrase-based-acquisition](./phrase-based-acquisition.md) — the memorize-pole counterpoint held in tension with this protocol
- [yagodkin-advance-mnemonics](./yagodkin-advance-mnemonics.md) — the pre-teach-then-read rival recorded above (noted, not resolved)
- [substitute-word-system](./substitute-word-system.md) — the encoding technique Yagodkin's step 2 runs on
- [storm-and-siege-protocol](./storm-and-siege-protocol.md) — nearest available evidence surface for the pre-teach-then-consume shape

---

## U — See (CAST)
1. 95% known + i+1 unknown + low filter = the acquisition window
2. Volume of input > sessions of input

## D — Name (NEDF)
1. Comprehensible Input Protocol = i+1 input ≥95% comprehensible at high volume
2. Distinguisher: input-side protocol (not output-driven)
3. Failure mode: production-first / lookup-translate / L1 subtitles

## F — Do (SPEAR)
1. Find input → check 95% rule → check i+1 → consume in volume
2. Lower affective filter; pick enjoyed topics

## B — Watch (HEART)
1. Reading-not-listening when subtitles on → switch off
2. "I understand everything" → step up (i+1 missing)
3. A bare "98%" with no register named → ask *speech or text?* (2,000 words vs ~8,000–9,000 families)

## L — Predict (ORACLE)
1. 95% + i+1 + volume + low filter → measurable monthly progress
2. Any of those four missing → stall

## R — Act (GRACE)
1. Stall on plateau → audit which of the four is missing
2. Filter rising → switch to lower-stakes input

## Mnemonic

**CIAV** — say it "ciao." The four input knobs that decide whether input enters the acquisition device: **C**omprehensible (≥95% known) · **I+1** (one step beyond) · **A**ffective filter low · **V**olume (hours, not minutes). Drop any one and acquisition stalls.

## Checksum

1. What word-recognition % marks "comprehensible," and what happens *above* ~98%? (≥95%; above ~98% acquisition stalls — i+1 is missing.)
2. i+1 and the 95% rule pull in opposite directions — how does the protocol resolve it? (By density: the ≤5% unknown words *are* the i+1; the 95% known supply the context that makes them inferable.)
3. Which failure engages the *learning* (not acquisition) system, and what triggers it? (Lookup-and-translate, triggered below ~90% known.)
4. Advance says 2,000 words = 98%; Nation-lineage work says 98% needs ~8,000–9,000 word families. Both right — why? (Different registers: 98% of *casual speech* vs 98% of *text*. Same number, ~4× the vocabulary.)
5. Yagodkin pre-teaches every unknown word, then reads at 100% comprehension. Why is that not simply a violation of this page's rule? (It may be optimising a different variable — his *encoding* pass does the acquiring; the reading pass is a fluency drill. Noted as a rival account, not resolved.)
