---
palace: tactical-memory
level: 5
domain: 10
room: 15
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/callan-method.md
---

# Callan Method — forced-production speaking drills

**Summary**: The Callan Method, stripped of its classroom, is one mechanism: **force full-sentence production before System-2 can assemble one**. The teacher speaks ~240 wpm, asks each question twice, and demands an immediate full-sentence answer — the gap is too short for translation through L1, so only reflex production fits. This page owns the term in this wiki and maps the transferable pieces onto the existing stack; the runnable instance is `tools/wordbase/callan_drill.py`, which renders per-theme drill MP3s (question ×2 fast → 2.5 s gap → model answer) from the wordbase `drills` table. **Status: BUILT** — 370 drills over the 19 curated french-1000 themes.

**Sources**:
- This session's design dialogue (2026-08-07): David's question "how can we use Callan's method for fast speaking"
- General knowledge of the Callan Method (Robin Callan, 1960; ~240 wpm teacher speech, question asked twice, immediate full-sentence answers, ~4/5 of class time systematic revision) — needs verification against a primary source if the method itself ever becomes a study object rather than a donor of mechanics
- tools/french-1000/callan-drills.tsv — the 370 authored Q/A pairs
- tools/wordbase/ — schema (`drills` table) + `callan_drill.py` generator

**Last updated**: 2026-08-07

---

## The mechanism, isolated

Callan classrooms bundle four things: fast teacher speech, forced immediate answers, constant revision, and controlled vocabulary. The last two we already have better versions of — [spaced-repetition](./spaced-repetition.md) beats Callan's fixed lesson-revisit schedule, and the french-1000 tier ladder is a controlled vocabulary. What the stack *lacked* is the first two, and they reduce to a single design constraint:

**The answer window must be too short for assembly.** Given ~2–3 seconds, either the full sentence comes out as a reflex, or it doesn't come out at all — there is no time to translate from Georgian/Russian, conjugate deliberately, and glue the pieces. That makes every rep a direct test of reflex production, the same quality [language-production-drill-ladder](./language-production-drill-ladder.md)'s Stage 4 (Automaticity — stage numbering per [skill-progression-stages](./skill-progression-stages.md)) is climbing toward, and the [речевой штамп](./phrase-based-acquisition.md) exit test operationalizes.

Full-sentence answers are the second half of the trick. Callan never accepts "bleu" — always "Non, le stylo n'est pas rouge, il est bleu." That smuggles grammar reps (negation, gender agreement, frame inversion) inside every vocabulary rep, which is what makes it a *speaking* method rather than recall practice.

## The audio drill unit

The solo-learner clone of the classroom is a fixed-gap audio unit:

1. **Question** — fast voice (fr-FR-Denise, +25 % rate), asked **twice**, Callan-style
2. **Gap** — 2.5 s of silence. *This is the drill.* Speak the full-sentence answer into it.
3. **Model answer** — a different voice (fr-FR-Henri, conversational rate). Hearing it right after your own attempt is the echo-correction.

Questions are authored so the answer is **predictable** from the question plus world knowledge ("Est-ce qu'on mange l'eau ?" → "Non, on ne mange pas l'eau, on boit l'eau") — otherwise the gap tests clairvoyance, not production. Repeated frames across themes are deliberate revision, not sloppiness.

The 370 Q/A pairs live in `tools/french-1000/callan-drills.tsv` (canonical, git-diffable, keyed on the wordbase lemma exactly like `mnemonics.tsv`); `import_french1000.py` loads them into the wordbase `drills` table; `tools/wordbase/callan_drill.py` reads **only the database** and renders one MP3 per theme into `tools/wordbase/.drills/fr/`. That makes it the first real consumer of wordbase under its promotion gate (`tools/wordbase/README.md`).

## What transfers, what doesn't

Transfers to the existing stack:

- **Fixed-gap audio drills** — the generator above; one walk ≈ two themes.
- **Say-cards + timer** — the French deck's say-direction cards test production but nothing punishes slow assembly; polyswipe's encode-speed timer pointed at say cards with a ~3 s budget turns ordinary reviews into Callan reps.
- **Speed above comfort on input** — Callan teachers speak fast so normal speech feels slow; mpv at 1.3–1.5× on French audio with dual-subs gives this for free, ten minutes before a drill session recalibrates "fast".

Does **not** transfer solo: live diagnosis of errors the model answer doesn't surface (a wrong gender you didn't notice yourself). That needs an occasional tutor session run Callan-style, or a voice-mode AI conversation. The MP3s buy automaticity, not diagnosis. The input side of the pipeline stays owned by [comprehensible-input-protocol](./comprehensible-input-protocol.md); segmentation stays owned by [dictee-gym](./dictee-gym.md) — this drill assumes you already *hear* the question.

## Why it passes the CAST test

The [CAST](./cast-overview.md) mission criterion rejects features that add System-2 assembly steps in live settings. Callan is an *anti*-System-2 protocol by construction: the fixed gap is a live encode-speed judge that structurally cannot reward slow assembly. It is the production-side twin of what the polyswipe reviewer timer already does on the encoding side.

## METER

Two measures, per [METER](./meter-overview.md) event conventions:

- `sla.speak.callan` — per session, self-scored: fraction of gaps where the full sentence landed *before* the model answer started (target ≥ 80 % per theme before moving on; a theme below 50 % means the vocabulary isn't encoded yet — send it back to the Anki/mnemonic layer, the drill can't fix that).
- The existing polyswipe time-tier trend on French say-cards, which should drift down as drilled frames automatize.

## Related pages

- [language-production-drill-ladder](./language-production-drill-ladder.md)
- [phrase-based-acquisition](./phrase-based-acquisition.md)
- [dictee-gym](./dictee-gym.md)
- [comprehensible-input-protocol](./comprehensible-input-protocol.md)
- [spaced-repetition](./spaced-repetition.md)
