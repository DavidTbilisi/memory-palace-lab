---
palace: tactical-memory
level: 5
domain: 10
room: 15
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/dictee-gym.md
---

# Dictée Gym

**Summary**: A runnable web gym that trains **listening word segmentation** — hearing where one French word ends and the next begins. It is the sibling of [l2-phonology-gym](./l2-phonology-gym.md) and covers the gap that gym structurally cannot: ABX minimal pairs test a contrast inside *one isolated word*, but segmentation only fails in *connected speech*, where liaison, elision and [enchaînement](./french-coda-loss.md) delete the boundaries the learner is listening for — all three the same mechanism, owned by that page. The drill is classical dictation — hear a line, type it — with a word-level diff and, critically, **two separate scores**: *segmentation* (did you recover the words, accents ignored) and *orthography* (did you spell them exactly). Collapsing those into one number hides which skill actually failed. **Status: BUILT** — [`gyms/dictee-gym.html`](../../gyms/dictee-gym.html) runs offline against 260 lines cut from the 27 French song units, at two speeds each. This page is the canonical owner of the Dictée Gym in this wiki.

**Sources**:
- This session's design dialogue (2026-07-22): the /difficulty gauge of French from zero, which ranked `listening-word-segmentation` a wall (step 20) with no instrument in the stack
- wiki/_data/difficulty-batches/french-from-zero.json — the batch the wall ranking comes from
- wiki/learning-systems/l2-phonology-gym.md — the perception gym whose scope this extends
- wiki/learning-systems/comprehensible-input-protocol.md — the input block this feeds
- wiki/learning-systems/language-learning-architecture.md — the layer map
- tools/french-music-drill/ — the lyric corpus and audio the item bank is built from

**Last updated**: 2026-08-28 — the open gap named in §Why this gym exists is closed: liaison/elision/enchaînement now own [french-coda-loss](./french-coda-loss.md), and the resyllabification this page describes is that page's RE-ATTACH corner; 2026-08-07

---

## Why this gym exists

The difficulty-estimator gauge of French from zero put four walls in the language. Three of them — spontaneous production, clitic syntax, and **listening word segmentation** — had no instrument anywhere in the stack. Mnemonics, song generation and [spaced-repetition](./spaced-repetition.md) are all *encoding and retention* tools; they attack the cheap half of the difficulty table and touch none of the walls.

Segmentation is the wall this gym takes. The failure is specific and worth stating precisely: a learner who knows every word in a sentence, and can pass an ABX test on every phoneme in it, still hears an undifferentiated stream. That is not a vocabulary problem or a phoneme problem. French marks prosodic prominence at the **end of the breath group**, not on each word, and liaison resyllabifies a final consonant onto the next word's vowel — so the acoustic cue English listeners use to find word onsets is simply absent. The ruleset itself lives in [`tools/french-music-drill/reading-rules.md`](../../tools/french-music-drill/reading-rules.md); **the gap this paragraph flagged is now closed** — liaison/elision/enchaînement own [french-coda-loss](./french-coda-loss.md) as of 2026-08-28, which states why they are one mechanism rather than three rules: a consonant surfaces when it can occupy an onset and is deleted in coda position, so linking is onset-supply machinery. The resyllabification described just above is that page's RE-ATTACH corner, and it is why segmentation is the wall.

This is also why the existing song corpus does not train it on its own. The per-line drill clips are cut at −25%, and a slow careful reading *restores* the boundaries: it pulls liaisons apart and pronounces the `ne` that spoken French drops. Shadowing those clips trains production, not segmentation. So the gym required a second audio tier at conversational speed — the thing that had to be built before the gym could exist at all.

## What it does

Three modes, escalating toward the real-world condition:

| Mode | Speed | Plays | Trains |
|---|---|---|---|
| **Slow** | −25% | unlimited | the sound→spelling mapping; boundaries still audible |
| **Natural** | +0% | 3 | segmentation proper — the boundaries are gone |
| **One shot** | +0% | 1 | transfer; no second pass, as in conversation |

Each round plays one line and takes typed input. The answer is aligned against the reference with a word-level edit distance, and the diff is rendered word by word: correct, right-word-wrong-accent, substituted, dropped, invented.

## The two scores

The load-bearing design decision. **Segmentation** normalizes away accents, case and punctuation and asks only whether the right words were recovered in the right order. **Orthography** re-checks the exact form. A line scoring **100 / 60 is a win** — every word was found, the accents were not. Reporting one blended number would make that look like a partial failure and would route the learner to the wrong drill.

This mirrors the split [word-knowledge-links](./word-knowledge-links.md) makes between stores: hearing a word and spelling it are different directed links, separately trained, and an audit that merges them overstates coverage.

## The teaching half

A diff alone says *what* was missed. The item bank additionally carries, per line, the sites where the word boundary stops being audible — liaison pairs (classified obligatory vs optional), and elisions where the vowel is already gone in the spelling. When a miss lands on one of those sites the gym names it: *`vous êtes` is an obligatory liaison — the final consonant of `vous` is pronounced onto `êtes`, so there is no gap where you expect the word to end.*

Across the 260-line bank: **119 liaison sites, 51 of them obligatory, and 65 elisions.**

The liaison classifier is a **heuristic, not a liaison grammar** — doing it properly needs part-of-speech tagging. It uses two buckets so it never teaches something false: the closed function-word classes (determiner / pronoun / preposition / number + vowel) are labelled obligatory; everything else phonetically linkable is labelled optional, since real speakers vary. Liaison across punctuation and after *et* is dropped entirely rather than downgraded, because those are forbidden, not variable.

## Pipeline

```
tools/french-music-drill/*.md          lyrics — the single source of truth
  ├─ build-audio.py --natural   ──►    audio/<slug>/{,natural/}<clip>.mp3
  └─ build-dictee-data.py       ──►    gyms/data/dictee-fr.json
                                          └─►  gyms/dictee-gym.html
```

Both builders share one parser, so a clip name has exactly one definition. Editing a lyric and re-running regenerates only that song. MP3s are gitignored; the builders are what is committed.

## METER

Emits `sla.listen.dictee` per line — `{item, unit, mode, seg, orth, plays, latency_ms, liaison_sites}` — buffered to localStorage with a JSON export, the same offline pattern the phonology gym uses for `sla.phon.*`. The metric that matters is **segmentation at One shot**, which is the operational form of the architecture's "hard tail of listening" target.

**Gate**: ≥90% segmentation on One shot for a unit's lines means the wall is behind you *for that material* — the cue to move to unseen input rather than to keep drilling the songs. Drilling a bank you have memorized measures recall, not hearing, which is the gym's main failure mode.

## Known limits

- **The bank is memorizable.** 260 lines from songs the learner is also singing. Recall will eventually substitute for hearing, and the gym cannot detect that. It is an on-ramp to real input, not a destination.
- **One voice.** All clips are `fr-FR-DeniseNeural`. There is no high-variability talker set as in [l2-phonology-gym](./l2-phonology-gym.md), so robustness across speakers is untrained.
- **TTS is not connected speech.** Neural TTS at natural rate still under-applies the reductions of casual speech. It closes part of the gap, not all of it.

## Related pages

- [french-coda-loss](./french-coda-loss.md) — the mechanism behind the vanishing boundaries: liaison, elision and enchaînement as one onset-supply system
- [l2-phonology-gym](./l2-phonology-gym.md) — the perception gym this extends; phoneme contrasts, isolated words
- [callan-method](./callan-method.md) — the production twin: this gym trains hearing the question, that drill trains answering it inside a fixed gap
- [comprehensible-input-protocol](./comprehensible-input-protocol.md) — the input block this is an on-ramp to
- [language-learning-protocol](./language-learning-protocol.md) — the daily loop this drill sits inside
- difficulty-estimator — the gauge that identified segmentation as a wall
- [word-knowledge-links](./word-knowledge-links.md) — why hearing and spelling are scored separately
- [meter-overview](./meter-overview.md) — the event layer
