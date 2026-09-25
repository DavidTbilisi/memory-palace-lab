---
glyph: 🌫
palace: meta-knowledge
level: 4
domain: 10
room: 4
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/sem3-song.md
---

# SEM3 Song — *Ten Kinds of Air*

**Summary**: A carrier song over [SEM3](./sem3.md) whose chorus is the ten sensory categories in order — Vision · Sound · Smell · Taste · Touch · Sensation / Animals · Birds / Rainbow · Solar system — grouped 6 · 2 · 2 and **returning three times unchanged**. That refusal to grow is the payload: the prop does not change, only the air around it. Told as a story rather than a lesson, and the one deliberate omission is the hundred cells, which the owner page says are derivable output rather than content.

**Sources**:
- Payload owner: [sem3](./sem3.md) (the ten categories and their rhyme-peg bindings, the first-consonant derivation rule, the two ordinal exceptions, the `00` fill, the pair checksum and its repeated-pair corollary, the decode/encode asymmetry)
- Precedent: [remaps-song](./remaps-song.md) (litany carried openly, line-length checksum, render table), [nedf-song-cycle](./nedf-song-cycle.md) (covering rule, superseded-take discipline), [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) (ordered peg list)
- Render stack: [MASTER](./music-generation-frameworks.md); gate music-profile

**Last updated**: 2026-09-07 — register changed **Japanese folk → English folk** (David's preference after listening): unaccompanied Child-ballad manner, hurdy-gurdy and fiddle drones, Northumbrian smallpipes, fingerpicked mountain dulcimer as the pulse. `jig, reel, hornpipe, sea shanty, pub singalong` added to Exclude Styles — the trad idiom's own failure mode is merriness, which fails music-profile outright. — re-rendered **fully sung** (David's call): the spoken and half-spoken delivery tags and the style prompt's *half-spoken narrative recitation* produced speech rather than song. Spoken take kept as a superseded counter-example.

---

## Why it exists

[sem3](./sem3.md)'s arbitrary payload is ten labels. Everything else on that page — a hundred cells across ten categories — regenerates from one rule and two exceptions, and the page's own §Why the drill was backwards measures what happens when you forget that: 75 lapses over 734 reviews, every one of the ten weakest cells rule-derivable. A song that chanted cells would rebuy those lapses in a nicer format.

So this is an **open litany of the generator, never of the table**. The ten labels, the consonant rule, the two ordinal exceptions and the checksum are sung. The hundred cells are not.

## Design decisions (locked 2026-09-07)

- **Open litany, at the level of the generator.** If the listener recalls only the chorus — Vision · Sound · Smell · Taste · Touch · Sensation · Animals · Birds · Rainbow · Solar system — they have the arbitrary payload. That is the litany test, so the words are carried openly. The hundred cells fail the same test in the other direction: recalling them buys nothing the rule does not already give.
- **The chorus never changes.** [remaps-song](./remaps-song.md) grows its chorus 5 → 11 → 16 because REMAPS's rule is *change and re-test*. SEM3's rule is the opposite — the prefix is atmosphere and the suffix is the object — so three identical returns are the argument. A chorus that grew would encode the anti-pattern.
- **Every category arrives with its rhyme-peg binding, not just its label.** Hero·Vision, Sun·Sound, Shoe·Smell, Tree·Taste, Door·Touch, Hive·Sensation, Sticks·Animals, Heaven·Birds, Gate·Rainbow, Vine·Solar system. A bare label chant would hand the singer ten words with no order, which is exactly the failure [sem3](./sem3.md) §Installing the ten exists to prevent; the peg sequence is where the order comes from.
- **Sensation is given its own discriminator.** *Under the skin, not on it* — the owner page names Sensation as the item that drops, because it is the one absent from the childhood five-senses list, and its nearest neighbour is Touch.
- **Three cells do appear, and they are the owner page's own worked instances.** Rose (`24`), Coffee (`27`) and Kangaroo (`67`) are sung, because a rule needs a worked instance to be learnable and those are the three [sem3](./sem3.md) itself inlines. Three demonstrations is not a table; the boundary is that no fourth cell was added for colour.
- **The grammar turns at 8, and that is where the one escalation sits.** Verse 2 states the letter rule immediately after category 7 completes the lettered range; the bridge revokes it at the Gate. *I asked it for a letter. It gave me one. It was the wrong one.* — the owner page's *confident wrong answers*, as an event rather than a warning.
- **Neither ordinal sequence is recited.** ROYGBIV and the planets are known cold from outside the system; [sem3](./sem3.md) says the twenty cells cost nothing **provided the exception itself is installed**. So the bridge names the two ordering principles — *read the gate the way you read a rainbow*, *count the vine out from the sun* — and stops.
- **Story, not lesson (David's call, 2026-09-07).** The first draft stated the rules in teacher voice (*every item wears its number in front · first sound only, then stop · eight and nine are painted, not spelled*). Rewritten so the rules happen to someone: things announce themselves as they come through the dial, and the gate answers a question wrongly. The litany survives because a chant is not a lecture.
- **Arrangement as argument: one plucked line, ever.** A single fingerpicked mountain-dulcimer figure enters in verse 1 and never varies — the object on the table. The drones re-colour behind it — the air. If a second plucked voice ever answered the first, the arrangement would encode the characteristic encoding failure ([sem3](./sem3.md): two props competing for the same slot, and the scene loses its subject).
- **English folk register — a deliberate per-song deviation, arrived at in two steps.** The `/suno` skill fixes Georgian and Eastern European as the catalogue's home register. This cycle first traded it for Japanese folk (David's call at the gate, on the argument that shakuhachi *is* breath so the ten kinds of air become an instrument), then for **English folk** after he heard the takes — unaccompanied Child-ballad manner, hurdy-gurdy and fiddle drones, Northumbrian smallpipes, fingerpicked mountain dulcimer as the pulse. Worth stating plainly: unlike the Japanese lane, **English folk is not a confirmed axis in music-profile** — its cultural axes are Georgian, post-Soviet, Japanese dark-epic, Bulgarian/Balkan choral and Norse/Germanic. So this render is a **probe** that may add a sixth, and the listen gate decides. The idiom's own failure mode is *merriness* — jigs, reels, shanties, pub singalong — which fails the darkness gate outright, so all of it is named in Exclude Styles. The other four standing constraints (female alto, beatless, ancient-and-severe, fully sung) are unchanged.
- **No new [METER](./meter-overview.md) namespace.** [sem3](./sem3.md) §Measurement closes its spine: a peg set is measured through the instance that owns it, and SEM3's instrumentation is its two Anki decks. This song inherits that and mints nothing, which is a deliberate divergence from [remaps-song](./remaps-song.md).
- **The twenty ordinal cells are carried by [sem3-ordinal-song](./sem3-ordinal-song.md), not lost.** This song refuses cells because the rule generates them; bands 8 and 9 are the only cells the rule does *not* reach, so they get their own track. The two songs partition SEM3 by derivability — eighty generated, twenty not — with no overlap and no gap.
- **Out of scope: the six-digit stack.** `PP·CI·XX` is named on the owner page only to record that the prefix slot exists; the routing call belongs to [number-codec-ladder](./number-codec-ladder.md). Omitted on purpose, not dropped.

## The song (Suno-ready)

```
[Intro]
[Sung, low and sustained, very close] [low drone, no pulse]
One room. One table. One thing on it.
Ten stations on the dial.
All night I turn it.
I never touch the thing.

[Verse 1]
[Sung low, full voice, long legato lines] [one plucked figure begins - it does not change again]
First the hero. Light comes out of his eyes. Vision.
Then the sun, and the rays arrive as sound.
Then the shoe. Green fume off the leather. Smell.
Then the tree, and I bite it off the branch. Taste.
Then the door. Dark. Both hands. Touch.
Then the hive at my chest - under the skin, not on it. Sensation.

[Chorus]
[Sung, deep and open, sustained vowels]
Vision. Sound. Smell. Taste. Touch. Sensation.
Animals. Birds.
Rainbow. Solar system.
One thing on the table. Ten kinds of air.

[Verse 2]
[Sung low, a second voice doubling in harmony]
Then the sticks, and the dog goes after them. Animals.
Then heaven, and the birds turn in the cloud.
Everything that comes through says one sound before it says anything.
The rose comes in saying R.
The coffee comes in saying K.
One sound. Never two.
If it says the wrong sound, it isn't the thing I asked for.

[Chorus]
Vision. Sound. Smell. Taste. Touch. Sensation.
Animals. Birds.
Rainbow. Solar system.
One thing on the table. Ten kinds of air.

[Bridge]
[Sung, close, the line rising] [Build]
Then the gate. And the gate says nothing.
I asked it for a letter.
[Crescendo]
It gave me one.
It was the wrong one.
Read the gate the way you read a rainbow.
Count the vine out from the sun.
[Sung very quietly, everything drops out]
And the first one is snow.
I only ever saw it.
Never felt it. The cold is the door.

[Chorus]
[Sung full, low choir underneath]
Vision. Sound. Smell. Taste. Touch. Sensation.
Animals. Birds.
Rainbow. Solar system.
One thing on the table. Ten kinds of air.

[Outro]
[Sung, fading with the drone]
The thing on the table says a number.
The air says the same number back.
When they say different numbers, one of them is lying to me.
A kangaroo standing at a check -
the thing spells out where the air lives.
Coming home is free.
Going out, it narrows. Then it checks.
Never two things on the table.
Turn the dial. It's still there.
```

## Line-to-payload map — all twenty-two

Ten categories, then twelve rule members. The row count is the completeness check.

| # | Lyric | Payload member |
|---|---|---|
| 1 | *the hero. Light comes out of his eyes. Vision* | C0 Vision — rhyme peg **Hero** |
| 2 | *the sun, and the rays arrive as sound* | C1 Sound — peg **Sun** |
| 3 | *the shoe. Green fume off the leather. Smell* | C2 Smell — peg **Shoe** |
| 4 | *the tree, and I bite it off the branch. Taste* | C3 Taste — peg **Tree** |
| 5 | *the door. Dark. Both hands. Touch* | C4 Touch — peg **Door** |
| 6 | *the hive at my chest — under the skin, not on it* | C5 Sensation — peg **Hive**, with the Touch discriminator |
| 7 | *the sticks, and the dog goes after them. Animals* | C6 Animals — peg **Sticks** |
| 8 | *heaven, and the birds turn in the cloud* | C7 Birds — peg **Heaven** |
| 9 | *Then the gate… read the gate the way you read a rainbow* | C8 Rainbow — peg **Gate**; ordinal, spectral order |
| 10 | *Count the vine out from the sun* | C9 Solar system — peg **Vine**; ordinal, outward by distance |
| 11 | *says one sound before it says anything* | the derivation rule — the item digit is the item's own first Major consonant |
| 12 | *The rose comes in saying R* | worked instance — Smell · R = 4 |
| 13 | *The coffee comes in saying K* | worked instance — Smell · K = 7, the `2743` example's own item |
| 14 | *One sound. Never two.* | first consonant only; scanning the whole word is ordinary Major encoding |
| 15 | *if it says the wrong sound, it isn't the thing I asked for* | the rule is self-checking — a consonant mismatch is the error signal |
| 16 | *I asked it for a letter. It gave me one. It was the wrong one.* | the exception **is** the memory item; reaching for the rule in 8–9 yields confident wrong answers |
| 17 | *the first one is snow. I only ever saw it. Never felt it. The cold is the door.* | `00` = Vision · Snow, rendered white and never cold — cold is Touch (C4), the Door |
| 18 | *the thing says a number · the air says the same number back · one of them is lying* | the pair checksum — Major word and SEM3 item both encode `I`; a duplicate channel earns its cost only if it can disagree |
| 19 | *a kangaroo standing at a check — the thing spells out where the air lives* | repeated-pair corollary — `6767`, the peg spells the cell's own address |
| 20 | *coming home is free · going out, it narrows, then it checks* | direction is asymmetric — decode deterministic, encode narrowed and verified |
| 21 | *one thing on the table · ten kinds of air · I never touch the thing · never two things* | the prefix modifies, the suffix carries; two props meeting is the characteristic failure |
| 22 | chorus phrased **six · two · two** | the 6 + 2 + 2 chunking — six sensory channels, two creature sets, two cosmic ladders |

Verse 1 discharges C0–C5, verse 2 C6–C7 plus the rule that governs exactly those eight, the bridge C8–C9 plus the rule's revocation. The ladder is never broken.

## Render spec (MASTER)

| Slot | Value |
|---|---|
| **M** Meter | ~58 BPM, slow and grave, **completely beatless**; the pulse is one fingerpicked mountain-dulcimer figure, unchanged from its verse-1 entry to the last bar |
| **A** Arrangement | one deep female alto lead in a low contralto register, second voice from verse 2; **one unchanging fingerpicked mountain-dulcimer figure** as the pulse; hurdy-gurdy and fiddle drones re-colouring behind an unmoving voice, Northumbrian smallpipes drone, English concertina held long, wooden flute; low women's close-harmony chorus in open fifths on the final chorus. Never a second plucked line |
| **S** Space/mix | voice close and dry against cavernous stone reverb; the room changes character while the voice and the plucked figure stay put; low end from drone, never a synth kick |
| **T** Timbre | **fully sung throughout** — a strong sustained melody, long legato lines, every word carried on pitch; *in* scale and microtonal vocal inflection; wordless vocalise beneath the words; whispered doubling; temple bowls as sustained decay, never a pulse |
| **E** Energy-arc | Mode B plateau — the chorus is identical all three times; one `[Build]` → `[Crescendo]` into *It was the wrong one*, hard drop to a whisper on the snow lines |
| **R** Restrict | no drums, percussion, beat, rhythm section, 808, hi-hats, bodhran, tabor or tambourine; **and nothing merry** — jig, reel, hornpipe, sea shanty, pub singalong, which is English trad's own way of failing the darkness gate; no new-age or celtic-new-age reading; no spoken word, recitation or narration; no pop polish, belted vocal, rap, autotune |

**Style prompt:**

```
English traditional folk, in the unaccompanied Child-ballad manner, slow and grave, completely beatless with no drums or percussion, deep female alto voice in a low contralto register, close and very clear, fully sung throughout with a strong sustained melody and long legato lines, every word carried on pitch, Dorian and Aeolian modal harmony, hurdy-gurdy and fiddle drones, Northumbrian smallpipes drone, English concertina held long, wooden flute, a low women's close-harmony chorus in open fifths, wordless vocalise beneath the words, cavernous stone-church reverb, tape warmth, ancient and severe and grief-stricken, a supernatural ballad and never a merry one, around 58 BPM, the pulse carried by one unchanging fingerpicked mountain-dulcimer figure that never varies from first entry to last bar while the drones re-colour behind it
```

**Exclude:** `drums, percussion, beat, rhythm section, 808, hi-hats, bodhran, tabor, tambourine, trap, new age, spa, relaxation, wellness ambient, celtic new age, upbeat, cheerful, jaunty, jig, reel, hornpipe, sea shanty, pub singalong, drinking song, pop, EDM, bright synths, belted vocals, rap, autotune, spoken word, spoken vocals, recitation, narration, monologue, talking, whispering`

Reads against music-profile as Mode B sustained with one peak, voice-as-event, load-bearing production (the unmoving plucked figure under changing air **is** the payload claim), and a **candidate** English-folk cultural axis — not yet confirmed in that page, which the listen gate settles. No artist name in the prompt.

## Render table

Status: **rendered, listen pending.** **Nothing has passed the music-profile gate** — the listen has not happened, so no clip is a pass.

| Render | Date | Spec | Clips |
|---|---|---|---|
| **English folk, fully sung** — current | 2026-09-07 | Child-ballad register; jig/reel/shanty excluded so the trad idiom cannot turn merry | [a](https://suno.com/song/5243e3bd-2f27-472e-9de9-09494fe114e3) · [b](https://suno.com/song/ec194ba0-f424-46c6-8d80-f6db033ef809) |
| Japanese folk, fully sung | 2026-09-07 | **superseded** — register changed to English folk | [a](https://suno.com/song/5d12d6dd-004b-452b-b451-6f79e04ead33) · [b](https://suno.com/song/a22abf40-9adb-449c-a064-f23d2b636e57) |
| half-spoken story lyric | 2026-09-07 | **superseded** — delivered as speech, not song | [a](https://suno.com/song/9d22786e-5648-4546-9b47-c02092fa0464) · [b](https://suno.com/song/3cdf99a4-0c1f-4659-b3b7-64248039d4d2) |

## Falsifier

Two weeks cold: **hum the chorus, write the ten categories in order, then the rule, then the two exceptions — before opening [sem3](./sem3.md).** Pass = ten in order with the 6 · 2 · 2 grouping intact, the consonant rule stated with a worked instance, and 8–9 named as ordinal without reaching for a letter.

Three failures it separates: the chant returns but the pegs do not (the labels welded to each other rather than to the frozen index, so ordered recall is borrowed from the song instead of the peg set); the ten return but the rule does not (a list installed, which is the defect the owner page measures); the rule returns but 8–9 are lettered anyway (the exception never installed, which is the one that produces confident wrong answers).

Measured through the existing instrumentation, not a new event: the owner page's own falsifier is whether the ten rule-derivable high-lapse cells drop out of the lapse leaderboard in Anki decks `001 Memory::015 Beyond 100 (SEM3)` and `017 SEM3 + Major`, whose reviews already reach METER through `tools/meter-anki-addon`. Per [sem3](./sem3.md) §Measurement the spine is closed; this page mints nothing.

## Mnemonic

*One room, one table, one thing on it, and a dial with ten stations.* You turn the dial all night and never touch the thing. Six stations are senses, two are creatures, two are skies. Everything that comes through the dial says one sound as it arrives, and that sound is its number — except at the last two stations, which say nothing, and will hand you a letter anyway if you ask for one.

## Checksum

1. The chorus returns three times without changing. Which payload claim does the refusal to grow encode, and which sister song does it invert?
2. Why is exactly one plucked instrument allowed, and what would a second one accidentally encode?
3. Where does the one crescendo sit, and which failure of the owner page is it dramatising?
4. Three cells are sung by name. Which three, and what is the rule that lets them in when the other ninety-seven stay out?

## Visual

Ten members exceed the count-shape ceiling, so per [representation-rules](./representation-rules.md) Rule 10 the top level is an **ordered ladder, not a decagon** — and the grouping inside it carries the shapes. The song's phrasing is the same figure heard rather than seen.

```
   the object            the air                        sung as
  ------------   ------------------------------   ------------------

                 0 Hero    -> Vision      (S)
                 1 Sun     -> Sound       (T)
                 2 Shoe    -> Smell       (N)      hexagon: six senses
      [ XX ]     3 Tree    -> Taste       (M)      one breath, six names
   one prop      4 Door    -> Touch       (R)
   never moves   5 Hive    -> Sensation   (L)
        |        ..............................
        |        6 Sticks  -> Animals     (CH)     axis: two creatures
        |        7 Heaven  -> Birds       (K)
        |        ..............................
        |        8 Gate    -> Rainbow      -       axis: two skies
        |        9 Vine    -> Solar system -       <- letters stop here
        |
        +-- one plucked line, unchanging      6 . 2 . 2 = 10
            drones re-colour around it        <- chorus checksum

   letters printed on rungs 0-7   |   rungs 8-9 hatched, no letter
                                  ^
                          the grammar turn, and the one crescendo
```

The letter column is the derivation rule drawn as itself: a correct rung is one where two marks agree, and an error is a visible mismatch rather than a fact you must know. Rungs 8 and 9 are hatched — the exception rendered as absence, findable without reading a caption. The left column never varies, which is the arrangement.

## Related pages

- [sem3](./sem3.md) — the payload owner; every claim in the litany is its claim
- [sem3-love-poem](./sem3-love-poem.md) — the same payload in a lyric register: the whole system as a love poem about loss, instructing nothing
- [sem3-ordinal-song](./sem3-ordinal-song.md) — the other half of this cycle; the twenty ordinal cells this song deliberately walks past, sung with their digits because the consonant rule cannot reach them
- [remaps-song](./remaps-song.md) — sister carrier; the growing chorus this one deliberately inverts, and the render-table format
- [nedf-song-cycle](./nedf-song-cycle.md) — the covering rule this payload does not take, and the superseded-take discipline
- [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) · gof-pattern-song-cycle — the other carrier instances
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — owner of the rhyme-peg images the ten bindings point at
- [peg-system](./peg-system.md) — the freezing rule the bindings answer to, and the closed-spine measurement rule
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — owner of the digit-consonant mapping the rule runs on
- [table-memorization](./table-memorization.md) — Step 0, *shrink the table before encoding*, is why the hundred cells are not sung
- [music-generation-frameworks](./music-generation-frameworks.md) — MASTER slots and the Music Pipeline
- music-profile — the taste gate; owner of the cultural-resonance axes, which this render probes to extend with English folk
- [representation-rules](./representation-rules.md) — owner of the count-shape rule the Visual follows and the glyph rule 🌫 answers to
- lyrebrook-radio-rotation — where a passing render is filed
