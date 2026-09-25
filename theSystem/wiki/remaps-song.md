---
palace: tactical-memory
level: 5
domain: 10
room: 6
semantic_mode: 5
para: resource
glyph: 🔁
wiki_source: wiki/cross-cutting/remaps-song.md
---

# REMAPS Song — *Never the Same*

**Summary**: A carrier song over [REMAPS](./remaps.md) whose chorus is the **complete sixteen-move litany** — Rotate·Reverse·Relocate · Exaggerate·Eliminate · Modify·Merge·Move · Associate·Adapt·Aesthetic · Play·Palace·Path · Sensations·Symbols. It returns three times, growing 5 → 11 → 16 words, each pass ending in a recall test. That growth **is** the practical rule. Verses are clipped to fragments so nothing competes with the litany.

**Sources**:
- Payload owner: [remaps](./remaps.md) (the six moves with full sub-move triads, the four failure tests, the practical rule; ultimately `raw/Neural OS Book/REMAPS.md`)
- Precedent: [nedf-song-cycle](./nedf-song-cycle.md) (covering rule, render table), [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) (payload in verses, feeling in refrains)
- Render stack: [MASTER](./music-generation-frameworks.md); gate music-profile; vocals vocal-range-profile

**Last updated**: 2026-09-08 — constraint 5 enforced on the page that shipped it: the **T** slot's *half-spoken incantation* and `[Whispered]` verdicts were exactly what `/suno` §5 forbids, so both are now sung directions, and Exclude Styles gained the spoken-word terms; 2026-09-07

---

## Why it exists

[remaps](./remaps.md) is a checklist you run on a failing image. Its handle is the acronym; its rule is *change 2–3 dimensions, then test again*. A litany installs the words. A chorus that returns three times, larger each time, installs the rule by being it.

[nedf-song-cycle](./nedf-song-cycle.md) is bare because its scene is a hallway that stops. Here the M move says static is weak, so the song has to move — but it moves on **strings, never percussion**. A pizzicato cello enters at chorus 1, a bowed ostinato joins at chorus 2, the low ensemble fills chorus 3. The arrangement is the checklist run on the song.

## Design decisions (locked 2026-09-07)

- **All sixteen sub-moves.** Six words would leave letters you cannot expand — an index with no entries.
- **Line lengths are a checksum: 3 · 2 · 3 · 3 · 3 · 2 = 16.** A short line in the wrong place means a lost sub-move; the rhythm says so before the words do.
- **The grammar turns at A.** R·E·M are verbs ending in *it* — done **to** the image. A drops the *it*; P·S are bare nouns — **given** to it. Acts, then gifts.
- **Three passes of two letters.** Chorus 1 = R·E, chorus 2 adds M·A, chorus 3 all six. Each ends *Now say it* + a verdict: *still thin* → *closer* → *there you are*.
- **Verses are fragments, not sentences.** Minimal words, no connective tissue. Full lines pulled attention off the litany; clipped ones leave the chant the only thing with grammar.
- **Latinate words are the feature.** *Exaggerate · Eliminate · Associate · Aesthetic · Sensations* are incantatory. Plain one-syllable stand-ins were the weaker choice.
- **Four words open the song.** *Too thin. Too plain. Too still. Too far.* = weak · ordinary · static · abstract.
- **The scene is a name that will not stay.** Never spoken, so the listener's own goes in the slot.
- **One escalation.** Mode B plateau; the only [Crescendo] is into chorus 3, dropping to a whisper on the verdict.
- **Beatless — the pulse is plucked and bowed.** No drums or percussion of any kind (standing constraint across the catalogue). Each pass adds a layer instead: bare drone → plucked chonguri and pizzicato cello → arco ostinato → full ensemble. The growth argument survives intact; only the instrument changes.
- **A woman's voice, folk instruments, mystical register.** Deep female alto in a low contralto register; chonguri, panduri, viola and hurdy-gurdy drones, wooden flute, cello spine, low female folk choir in open fifths; ancient modal harmony, overtone texture under the drones, wordless vocalise beneath the words, singing bowls as sustained decay and never as a pulse. Standing across the catalogue, and the register is *ancient and severe* — the new-age reading fails music-profile. Note this song does **not** cite vocal-range-profile — that page measures what David can sing, a different question from what the render should sound like.

## The song (Suno-ready)

```
[Intro]
[Sung, low and sustained, very close] [low drone, rain on stone, no pulse]
Your name. A thousand times. The same way.
Every time, further off.
Too thin. Too plain. Too still. Too far.

[Verse 1]
[Sung low and sustained, close] [drone only, no drum]
Turned it over. Hung it upside down.
Let it hold me instead.
Carried it to the room we never left.
Tall as the stairwell.
Burned the page. Just the name.

[Chorus]
[Chanted, deep, ceremonial] [plucked chonguri and pizzicato cello enter, marking the pulse]
Rotate it. Reverse it. Relocate it.
Exaggerate it. Eliminate.
Now say it.
[Sung, hushed]
...Still thin.

[Verse 2]
[Low, pizzicato underneath, a second voice doubling]
Made it ice.
Set it swinging. Cracks the door.
Name and door — one thing.
Tied it to my mother's kitchen.
Shaped like a song I knew by heart.
Terrible and bright.
Not beautiful. It stays.

[Chorus]
[Chanted, two voices, bowed cello ostinato joins]
Rotate it. Reverse it. Relocate it.
Exaggerate it. Eliminate.
Modify it. Merge it. Move it.
Associate. Adapt. Aesthetic.
Now say it.
[Sung, hushed]
...Closer. Not yet.

[Bridge]
[Sung, low and sustained, close] [rain louder, a low hum under everything]
Third stair. Its address.
Trips me every morning. Wearing my coat.
Stairs climb. The order keeps itself.
[Build]
Rain on hot stone. Hums under my hand. Cold.
A mark on my wrist.

[Chorus]
[Full chant, low choir, full low strings and drones] [Crescendo]
Rotate it. Reverse it. Relocate it.
Exaggerate it. Eliminate.
Modify it. Merge it. Move it.
Associate. Adapt. Aesthetic.
Play. Palace. Path.
Sensations. Symbols.
Now say it.
[Sung, hushed, everything drops out]
...There you are.

[Outro]
[Sung, low and sustained, drone fading, rain]
If it thins again — not the same.
Turn it. Turn it again.
[Sung, hushed]
Never the same.
```

## Line-to-move map — all sixteen

| # | Lyric | Letter | Sub-move |
|---|---|---|---|
| — | *Too thin · plain · still · far* | — | the four failure tests |
| — | *not the same · turn it again* | — | do not repeat it unchanged |
| 1 | *turned it over* | **R** | Rotate |
| 2 | *let it hold me instead* | **R** | Reverse — invert the relation |
| 3 | *the room we never left* | **R** | Relocate — stronger locus |
| 4 | *tall as the stairwell* | **E** | Exaggerate scale |
| 5 | *burned the page* | **E** | Eliminate background |
| 6 | *made it ice* | **M** | Modify material |
| 7 | *name and door — one thing* | **M** | Merge (see [image-merging](./image-merging.md)) |
| 8 | *set it swinging · cracks the door* | **M** | Move — collision |
| 9 | *tied it to my mother's kitchen* | **A** | Associate with a drilled anchor |
| 10 | *shaped like a song I knew* | **A** | Adapt a familiar pattern |
| 11 | *terrible and bright · not beautiful* | **A** | Aesthetic — grotesque counts |
| 12 | *trips me · wearing my coat* | **P** | Play |
| 13 | *third stair. its address* | **P** | Palace |
| 14 | *stairs climb · the order keeps itself* | **P** | Path |
| 15 | *rain on hot stone · hums · cold* | **S** | Sensations |
| 16 | *a mark on my wrist* | **S** | Symbols |
| — | choruses of 5 · 11 · 16 words, each *Now say it* | — | change 2–3 per pass, then test |

Verse 1 discharges R·E, verse 2 M·A, the bridge P·S — each chorus arrives having earned its new letters.

## Render spec (MASTER)

| Slot | Value |
|---|---|
| **M** Meter | ~60 BPM ceremonial, **completely beatless**; pulse carried by plucked chonguri and pizzicato cello from chorus 1, bowed ostinato from chorus 2 |
| **A** Arrangement | one deep female alto lead in a low contralto register; second voice from chorus 2; low female folk choir in open fifths only on chorus 3; chonguri, panduri, viola and hurdy-gurdy drones, wooden flute, cello spine; no percussion |
| **S** Space/mix | voice close and dry against stone-chamber reverb; rain bed throughout; low end from bowed cello and drones, never a synth kick |
| **T** Timbre | sung incantation throughout — never spoken or half-spoken — melody low and sustained; tape warmth; overtone and throat-singing colour on the drones; wordless vocalise under the words; distant singing bowls as sustained decay, never a pulse; `[Sung, hushed]` on every verdict |
| **E** Energy-arc | Mode B plateau thickening per pass **by string layers**; one `[Build]` → `[Crescendo]` into chorus 3, hard drop on *There you are* |
| **R** Restrict | no drums, percussion, beat, rhythm section, 808 or hi-hats; no new-age, spa or wellness-ambient reading of the mysticism; no bright synths, pop polish, belted vocal, rap, autotune, upbeat; never fast enough to blur a word |

**Style prompt (primary — ritual drone):**

```
Georgian and Eastern European sacred folk ritual, slow ceremonial tempo around 60 BPM, completely beatless with no drums or percussion, the pulse carried by plucked chonguri and pizzicato cello over a bowed cello ostinato that grows layer by layer, deep female alto voice in a low contralto register, close and very clear, sung incantation, melody low and sustained, every word distinct, ancient modal harmony with Phrygian colour and microtonal vocal inflection, overtone and throat-singing texture under the drones, wordless vocalise beneath the words, whispered doubling at the edge of audibility, distant singing bowls as sustained texture never as a beat, traditional folk instruments only — chonguri, panduri, viola and hurdy-gurdy drones, wooden flute, low female folk choir in open-fifth harmony at the end, cavernous stone-chapel reverb, rain, tape warmth, thickening verse by verse from one bare voice to full rite, ancient and severe and grief-stricken, fully sung
```

**Exclude:** `spoken word, spoken vocals, recitation, narration, monologue, talking, whispering, drums, percussion, beat, rhythm section, 808, hi-hats, trap, new age, spa, relaxation, wellness ambient, upbeat, cheerful, pop, EDM, bright synths, belted vocals, rap, autotune`

**Variant (solo cello and voice, for A/B):**

```
solo cello and voice only, slow free tempo with no fixed pulse, classically played cello moving between sustained low drones and a sparse pizzicato figure that marks time, one deep female contralto voice very close and exposed, unperforming and devastating, minor modal, natural room ambience, utterly sparse and intimate, completely beatless, no drums, no percussion, no synth, fully sung
```

The variant is the strictest reading of the constraint: one instrument doing both the harmony and the pulse. Queued for A/B against the primary.

Passes music-profile on emotional gravity, voice-as-event, load-bearing production (the thickening arrangement *is* the checklist), Mode B with one peak, and the cultural-resonance axis — traditional source material amplifying the darkness rather than decorating it. Beatless, female-led and folk-instrumented per the standing catalogue constraints. No artist name in either prompt.

## Production pipeline

1. **Seed** — the litany + the four-word diagnosis.
2. **Transform** — none. The song already carries three passes; do not add a fourth.
3. **Render** — primary prompt, `Vocal Gender: Male` toggled (the prompt alone does not hold the baritone).
4. **Gate** — music-profile. Reject anything that reads as a list rather than a rite.
5. **File** — on a pass, into rotation per lyrebrook-radio-rotation.

Status: **rendered, listen pending.** **Nothing has passed the music-profile gate** — the listen has not happened, so no clip is a pass.

| Render | Date | Spec | Clips |
|---|---|---|---|
| **female alto, folk, beatless, mystical** — current | 2026-09-07 | + ancient modal, overtone, vocalise, bowls-as-texture | [a](https://suno.com/song/fd0adcdb-097e-4a5c-838f-a5a624c0d97e) · [b](https://suno.com/song/4b99d91a-e620-40a1-97af-f6c77d75acdb) |
| female alto, folk, beatless | 2026-09-07 | **superseded** — before the mystical constraint | [a](https://suno.com/song/22c34470-9cb2-4212-bae5-a0deff910b7f) · [b](https://suno.com/song/9848d4ee-fc53-4528-b4da-bc46b23f7bc6) |
| minimal-words litany, frame drum | 2026-09-07 | **superseded** — percussion; beatless is a standing constraint | [a](https://suno.com/song/e20aac8a-ed21-4054-bb76-d8e402c14030) · [b](https://suno.com/song/294b9693-7000-459d-96a6-20874e653428) |
| full litany, prose verses | 2026-09-07 | **superseded** — verses too wordy, competed with the chant | [a](https://suno.com/song/d889bbac-7088-44a3-83b6-5d157a59292c) · [b](https://suno.com/song/30015dcd-04b6-4a34-a62d-ead8e56987fc) |
| six-verb acrostic | 2026-09-07 | **superseded** — one plain verb per letter, ten sub-moves missing | [a](https://suno.com/song/096e3c14-14b4-436d-898e-1fa0562c829f) · [b](https://suno.com/song/cf431125-c190-4c25-a46b-83100c6f38e7) |
| variant — solo cello and voice | pending | — | — |

Superseded takes are kept as recorded counter-examples, per the [nedf-song-cycle](./nedf-song-cycle.md) *Four Fingers* precedent.

## Falsifier

Two weeks cold: **hum the last chorus, write all sixteen sub-moves grouped under their letters, then run a timed pass on a real failing image.** Pass = sixteen in order, correct 3·2·3·3·3·2 grouping, pass started under thirty seconds without opening [remaps](./remaps.md). Distinguish three failures: a triad comes back short (rhythm did not carry the count), words come back ungrouped (welded a list, not a ladder), moves return but the pass-then-test loop does not (installed a checklist, not a rule). Emit `remaps.song_checklist_recall` with `submoves_recalled`, `order_ok`, `pass_started_s`.

## Mnemonic

**Three passes, two letters each, then say it.** Lengths run 3 · 2 · 3 · 3 · 3 · 2. The *it* falls away at Associate: before it, things done **to** the image; after, things **given** to it.

## Checksum

1. The M move says static is weak, so this song moves. What carries the motion, given that percussion is not available?
2. What do the six line lengths encode, and which two are short?
3. Where does the grammar turn from verbs to nouns, and what does the turn mark?
4. Which four words open the song, and which failure test is each?

## Visual

Six members → hexagon ([representation-rules](./representation-rules.md) Rule 10). Each vertex carries its triad; the counts are the checksum.

```
                      R (3)  Rotate · Reverse · Relocate
                     /                                  \
   S (2)            /                                    \            E (2)
   Sensations      /                                      \      Exaggerate
   Symbols        |             ( the name )               |     Eliminate
                   \                                      /
   P (3)            \                                    /            M (3)
   Play              \                                  /        Modify · Merge
   Palace             \                                /          · Move
   Path                 A (3)  Associate · Adapt · Aesthetic

   3 · 2 · 3 · 3 · 3 · 2  =  16              <- line-length checksum
   verbs ending "it"  |  bare nouns          <- grammar turns at A

   pass 1:  R E          -> "Now say it."  ...still thin
   pass 2:  R E M A      -> "Now say it."  ...closer
   pass 3:  R E M A P S  -> "Now say it."  ...there you are
```

## Related pages

- [remaps](./remaps.md) — the payload owner; every word in the litany is its word
- [nedf-song-cycle](./nedf-song-cycle.md) — sister carrier; the beatless rule this inverts, and the render-table format
- gof-pattern-song-cycle · [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) — the other carrier instances
- [music-generation-frameworks](./music-generation-frameworks.md) — MASTER slots and the Music Pipeline
- music-profile — the taste gate
- vocal-range-profile — the vocal slots the litany is written into
- [image-merging](./image-merging.md) — the Merge sub-move as a CAST edge upgrade
- [smashin-scope](./smashin-scope.md) — REMAPS's ancestor; *terrible and bright* is the dropped Positive-Images constraint
- lyrebrook-radio-rotation — where a passing render is filed
