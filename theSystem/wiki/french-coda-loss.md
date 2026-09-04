---
palace: tactical-memory
level: 5
domain: 10
room: 17
para: resource
glyph: 🔗
wiki_source: wiki/learning-systems/french-coda-loss.md
---

# French Coda Loss — liaison, elision and enchaînement as one mechanism

**Summary**: French spelling keeps consonants that French speech deleted. One historical event — the loss of the word-final syllable coda — explains four systems the learner normally memorises separately: silent final letters, nasal vowels, the mute agreement `-e`, and the whole linking apparatus (liaison · elision · enchaînement). The operative rule is positional: **a consonant surfaces when it can occupy an onset, and is deleted in coda position** — so every "linking rule" is machinery for supplying an onset, and the nasal vowel is what a deleted nasal coda left behind on the vowel in front of it. This page is the canonical owner of liaison, elision, enchaînement and *h aspiré* in this wiki — the gap [dictee-gym](./dictee-gym.md) flagged as open.

**Sources**:
- `tools/french-music-drill/reading-rules.md` — the 441-line spelling→sound ruleset this page unifies (§1 silent letters, §5 nasals, §7 linking); its Module-0 song units `unit00a-silent-letters.md`, `unit00b-nasals.md`, `unit00c-digraphs.md`
- 2026-08-28-prism-run4-french-phonology — the [PRISM](./prism-pattern-discovery.md) run that extracted the mechanism (rule `coda-loss-onset-repair`, ladder level 5)
- `wiki/assets/confusion-map-fr-seed.json` — the nine French contrasts of [l2-phonology-gym](./l2-phonology-gym.md)
- Diachronic claims (Old French final-consonant loss, intervocalic voicing, final devoicing) are standard historical phonology but have **no source document in this repo** — marked *needs-verification* against a historical-phonology reference before being taught as fact.

**Last updated**: 2026-08-28 — page created from PRISM run #4.

---

## The one event

The ruleset this page draws on opens by saying French spelling does three things to written letters: it **deletes** final consonants, **fuses** vowel + `n`/`m` into a nasal vowel, and **glues** words together in speech (source: `reading-rules.md` §"The one big idea"). Those are not three habits. They are one event with three repair strategies — three unordered members, so a triangle:

```
                    WORD-FINAL CODA
                     (the deletion)
                           ▲
                          ╱ ╲
                         ╱   ╲
                        ╱     ╲
       DELETE          ╱       ╲        TRANSFER
   petit → /pəti/     ▲─────────▲    pain → /pɛ̃/
   nothing kept            │         nasality moves onto
                           │         the vowel; the n goes
                      RE-ATTACH
              les_amis → /le.za.mi/
        the consonant finds an onset next door
```

Cover the labels: if a French "rule" you are learning does not sit at one of these corners, check whether it is really the same corner in disguise. Elision (`l'ami`) and *h aspiré* (`le héros`) are the RE-ATTACH corner seen from the vowel side — one supplies an onset, the other blocks the slot.

## The four systems are one system

| Written form | What the learner is told | What is actually happening |
|---|---|---|
| `petit` /pəti/, `chats` /ʃa/, `ils parlent` /il paʁl/ | "final consonants are silent" | coda deleted; the letter survives as a grammar marker for the eye only |
| `pain` /pɛ̃/, `bon` /bɔ̃/ | "vowel + n/m makes a nasal vowel" | the nasal coda deleted and left its nasality on the vowel — compensatory, not additive |
| `vert` /vɛʁ/ → `verte` /vɛʁt/ | "the mute `-e` wakes the consonant before it" | the `-e` removes the consonant from final position, so the deletion never applies |
| `les_amis` /le.za.mi/, `elle est` /ɛ.lɛ/ | "liaison and enchaînement link words" | a following vowel supplies an onset, so the consonant has somewhere to live |

The corpus's own decision procedure for nasals — *"what is written immediately after the `n`/`m`? a vowel → not nasal; a consonant or word-end → nasal"* (source: `reading-rules.md` §5a(iii)) — is this rule restricted to one letter. Its song unit generalises the heuristic one step further to *"the next letter decides… read one letter ahead"* (source: `unit00b-nasals.md`), which is the shallow, synchronic form of what this page states positionally.

## The proof it is about slots, not sounds — *h aspiré*

`h` is never pronounced in Modern French. Yet the two kinds of `h` behave oppositely at the boundary: **h muet** allows elision and liaison (`l'homme`, `les_hommes` /le.zɔm/), while **h aspiré** blocks both (`le héros`, not *l'héros*; `les / héros` with no /z/) (source: `reading-rules.md` §1d).

A letter with no sound cannot block a *sound* rule. It can only block a *position* rule. *H aspiré* occupies the onset slot without filling it — which is why the linking machinery has nothing to attach to. This is the case that decides between "French deletes silent letters" and "French fills onsets": only the second account survives it.

*(Historically these are the words whose `h` was once a real Germanic/Frankish consonant — `honte`, `hache`, `haricot` — with orthographic outliers like `huit`, whose `h` exists to stop the eye reading `vit`. **Needs-verification** against an etymological source.)*

## The liaison inventory is a fossil record

The linking consonants are usually taught as an arbitrary list: `s·x·z` → /z/, `d` → /t/, `f` → /v/, `n` → /n/, `t` → /t/ (source: `reading-rules.md` §7b). They are not arbitrary. Each preserves the consonant's value *at the moment the loss happened*, not its modern spelling value:

| Spelled | Links as | Why |
|---|---|---|
| `s`, `x`, `z` | /z/ | intervocalic voicing — the same rule that makes `rose` /ʁoz/ and `poison` /pwazɔ̃/ |
| `d` | /t/ | the Old French final was already devoiced; `d` is an etymological spelling (`grand_arbre` /ɡʁɑ̃taʁbʁ/) |
| `f` | /v/ | intervocalic voicing again (`neuf_ans` /nœvɑ̃/) |
| `g` | **/k/** | the same devoicing as `d` — *un long hiver*, *sang impur*. **This row is absent from the source ruleset**; it is derived here from the mechanism and is *needs-verification* against a prescriptive grammar |

That the linking form disagrees with the modern letter is the strongest single piece of evidence for the diachronic account: a purely synchronic "wake the silent letter" rule would wake it as itself.

## What this does not derive

Recorded honestly — a rule is only as good as its stated boundary.

- **CaReFuL.** Final `c r f l` usually *are* sounded (`sac`, `mer`, `chef`, `sel`) with no following vowel at all (source: `reading-rules.md` §1b). This is a lexical retention the mechanism does not predict. It is a list to memorise, not a rule to derive — and its own exceptions (all `-er` verbs; `gentil`, `outil`, `fusil`) are cases where the loss *did* apply.
- **`et` never links.** A consonant stands before a vowel and nothing happens. Modern liaison's obligatoriness is morphosyntactically gated — obligatory after determiners and pronouns, forbidden after `et` and after a singular noun, optional elsewhere (source: `reading-rules.md` §7b). The mechanism explains the *inventory* and the *sound values*; it does not explain which liaisons a modern speaker must make.
- **Retained finals in short and borrowed words.** `bus` /bys/, `week-end`, `gaz` are cleanly predicted — they entered French after the deletion. `fils` /fis/, `ours` /uʁs/, `sens` /sɑ̃s/ are not; they are learned or irregular retentions the mechanism leaves unexplained.

## What it predicts for drilling

The mechanism is not decoration — it changes what to practise, and it predicts an asymmetry the wiki's own gyms already show.

- **Reading is recoverable; dictation is not.** Going letters→sound, the deleted material is visible on the page and the rule fires deterministically. Going sound→letters, the coda is simply absent from the signal, so the writer must reconstruct it from grammar. That is why the dictée direction is one-to-many and hard, and why [dictee-gym](./dictee-gym.md) scores *segmentation* and *orthography* separately rather than blending them.
- **Word boundaries disappear because consonants move.** [dictee-gym](./dictee-gym.md) states it independently: liaison resyllabifies a final consonant onto the next word's vowel, so the acoustic cue English listeners use to find word onsets is gone. Segmentation failure is not a vocabulary problem — it is this mechanism heard from the outside.
- **Drill the nasal contrast as a vowel, not as an n.** The consonant is deleted; the contrast lives entirely in the vowel. [l2-phonology-gym](./l2-phonology-gym.md)'s French map does exactly this — its key item is labelled *"bon (nasal, no /n/)"* with the cue *"Nasal = air through the nose and NO consonant follows"* — and three of its nine contrasts are nasal.
- **Practise breath-groups, not words.** Because the operative boundary is the breath-group, shadowing word-by-word trains a unit French does not have.

## METER

Emits nothing of its own — it is a knowledge page, and the drills that test it already emit. Its pass-floor is a *reading* floor, in the sense of [skill-progression-stages](./skill-progression-stages.md):

**Pass-floor**: given an unseen written phrase, mark every deleted coda, every nasalised vowel and every link site, and read it aloud correctly, in **under fifteen seconds** for a phrase of about eight words. Consumers: `sla.listen.dictee` (segmentation at One shot, [dictee-gym](./dictee-gym.md)) and `sla.phon.abx` on the nasal contrasts ([l2-phonology-gym](./l2-phonology-gym.md)).

## Mnemonic

**French threw away the ends of its words and kept the spelling as a receipt.** Everything else is the language trying to give a homeless consonant somewhere to stand: a mute `-e` behind it, a vowel next door, or a nose to hide in.

Short form: **no onset, no consonant.**

## Memory checksum

If you can answer these from recall in under sixty seconds each, the page is encoded:

1. **Name the one event and its three repairs.** (Word-final coda loss → delete outright · transfer nasality to the vowel and delete · re-attach across the boundary to an onset.)
2. **Why does `bonne` have an audible /n/ and `bon` not?** (The mute `-e` gives the `n` an onset, so it surfaces as a plain consonant and the vowel de-nasalises. Without it the `n` is a coda: deleted, nasality left behind.)
3. **What does *h aspiré* prove?** (That the rule is about syllable *slots*, not sounds — a letter with no sound can only block a position rule, and it does.)
4. **Why does `grand` link as /t/ and not /d/?** (The linking form preserves the Old French value; the `d` is an etymological spelling. Same logic predicts `g` → /k/.)
5. **Name two things the mechanism does not derive.** (CaReFuL retentions; the modern obligatoriness of liaison — `et` never links though a consonant sits before a vowel.)

## Visual

The count-shape above is the page's diagram: one apex (the deletion) over three repair corners, with elision and *h aspiré* filed under RE-ATTACH as the vowel-side pair. An empty corner in a learner's model is the diagnostic — most learners hold DELETE and TRANSFER and never connect RE-ATTACH to either, which is exactly the shape of the segmentation wall.

## Related pages

- [dictee-gym](./dictee-gym.md) — the gym this page's gap was flagged by; segmentation is this mechanism heard from outside
- [l2-phonology-gym](./l2-phonology-gym.md) — the perception gym whose French contrasts are the nasal half of this page
- 2026-08-28-prism-run4-french-phonology — the PRISM run that extracted the rule, its counterexamples and its ladder placement
- [prism-pattern-discovery](./prism-pattern-discovery.md) — the protocol; `coda-loss-onset-repair` is a row in its §Rule register
- [vowel-grid-gym](./vowel-grid-gym.md) — the vowel-space drill the nasal contrasts sit inside
- [fluent-forever-wyner](./fluent-forever-wyner.md) — phonology-before-vocabulary; this is the French instance of the sound-spelling layer
- [comprehensible-input-protocol](./comprehensible-input-protocol.md) — the input block the drills feed
- [language-learning-architecture](./language-learning-architecture.md) — the layer map that puts phonology at the frontier
- [word-knowledge-links](./word-knowledge-links.md) — why hearing a word and spelling it are separately trained, which this mechanism explains for French
- [callan-method](./callan-method.md) — the production twin
- [skill-progression-stages](./skill-progression-stages.md) — the ladders the pass-floor is stated against
- [meter-overview](./meter-overview.md) — the event layer the consuming gyms emit into
