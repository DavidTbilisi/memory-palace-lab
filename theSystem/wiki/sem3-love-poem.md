---
glyph: ❄
palace: meta-knowledge
level: 4
domain: 10
room: 6
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/sem3-love-poem.md
---

# SEM3 Love Poem — *The First One Is Snow*

**Summary**: The whole of [SEM3](./sem3.md) carried as a love poem about loss — one person, ten ways they keep arriving, and a narrator who never touches the thing itself. The two drill-shaped carriers ([sem3-song](./sem3-song.md), [sem3-ordinal-song](./sem3-ordinal-song.md)) split the system by derivability and teach it; this one covers all of it in a single lyric register and **instructs nothing**. Its claim is that the encoding was never technical: SEM3's ten categories are already the vocabulary of love poetry, and its central doctrine — the prefix is atmosphere, the suffix is the object — is already a love poem's shape.

**Sources**:
- Payload owner: [sem3](./sem3.md) — the ten categories in order, the first-consonant rule, the two ordinal exceptions, the `00` fill, the pair checksum, the decode/encode asymmetry, and the prefix-modifies/suffix-carries convention
- Siblings: [sem3-song](./sem3-song.md) (the generator litany), [sem3-ordinal-song](./sem3-ordinal-song.md) (the twenty ordinal cells)
- Doctrine precedent: [nedf-song-cycle](./nedf-song-cycle.md) — the covering rule, and the discipline of letting a scene carry a payload the lyric never names as a payload
- Render stack: [MASTER](./music-generation-frameworks.md); gate music-profile

**Last updated**: 2026-09-07 — register changed **Japanese folk → English folk** (David's preference after listening): unaccompanied Child-ballad manner, hurdy-gurdy and fiddle drones, Northumbrian smallpipes, fingerpicked mountain dulcimer as the pulse. `jig, reel, hornpipe, sea shanty, pub singalong` added to Exclude Styles — the trad idiom's own failure mode is merriness, which fails music-profile outright. — re-rendered **fully sung** (David's call): every `[Spoken]` / `[Half-spoken]` / `[Whispered]` tag removed and the style prompt's *half-spoken as if remembering aloud* replaced with a sung melodic instruction. The spoken take is kept as a superseded counter-example.

---

## Why it exists

David's call, 2026-09-07: *make the whole of SEM3 poetry about love, not educational.* The two existing carriers earn their place as drill instruments, and both read as instruction — *count it, don't spell it*, *one sound, never two*. That register is correct for a drill and wrong for the thing SEM3 actually is.

The reframe turned out to be almost free, and the ease is itself an argument. **SEM3's ten categories are the classical inventory of love poetry**: six ways of sensing a person, then the creatures, then the sky. And the system's load-bearing convention — the prefix is the air the scene arrives in, the suffix is the only object — is the shape of a love poem about absence. One person. Ten registers in which they keep arriving. You never touch them; you only turn the room.

This lands the payload squarely inside music-profile's master rule, which is not darkness in the abstract but **loss** — something that was there and is now gone.

## Design decisions (locked 2026-09-07)

- **Open litany, naturalized.** All ten category words appear, in the owner page's order, because dropping them stops the carrier carrying. What changed is that they arrive as the poem's own nouns rather than as labels with numbers welded to them. This is the same move [sem3-ordinal-song](./sem3-ordinal-song.md) made when the counted digits came out: strip the scaffolding, keep the payload.
- **Not the covering rule, and the distinction matters.** [nedf-song-cycle](./nedf-song-cycle.md) is *covered* — its payload's own doctrine forbids naming the slots. SEM3 has no such rule; its ten labels are the arbitrary payload and must be sung. So this poem is a lyric litany, not a covered scene, and calling it "covered" would be borrowing NEDF's doctrine where it does not apply.
- **Nothing is instructed.** No imperative carries payload. Every rule arrives as something that happened to the narrator: things announce themselves by the first sound of their name; the rainbow is asked for a letter and gives a wrong one; a number told twice in two languages disagrees one night.
- **The beloved is never described.** No name, no face, no gender. The one figure in the poem is an unnamed *you*, so the listener's own goes in the slot — and so the poem cannot become about a particular person instead of about the encoder.
- **`00` opens and closes the poem.** *The first one is snow. I only ever saw it. I never felt it once.* The frozen convention ([sem3](./sem3.md): Snow is rendered as seen, never as cold, because cold is Touch) is also the poem's most complete statement of the loss, so it is the first line and the last.
- **Sensation gets the discriminator it needs, in lyric form.** *The one under the skin, that is in no list of five.* The owner page names Sensation as the item that drops precisely because it is absent from the childhood five-senses list; the poem says exactly that without a table.
- **Arrangement, unchanged from [sem3-song](./sem3-song.md) and for the same reason.** One plucked figure that never varies, drones re-colouring behind it. The doctrine is identical — one object, ten kinds of air — so the arrangement argument is identical, and a second plucked line would still encode the two-props failure.
- **One escalation, at the rainbow.** The single crescendo sits on *it gave me one, it was the wrong one* — the ordinal exception, which is the payload's own error site and, in this register, the poem's one moment of being answered wrongly by something loved.
- **It joins the other two rather than replacing them.** A drill carrier and a lyric carrier of the same payload can both be right, because they fail differently: the drill installs addresses and reads as instruction, the poem installs the shape and cannot be timed. Which one is doing the work is a listen-gate and falsifier question, not a taste question.
- **No new [METER](./meter-overview.md) namespace.** [sem3](./sem3.md) §Measurement's spine is closed, as with both siblings.

## The poem (Suno-ready)

```
[Intro]
[Sung, low and sustained, very close] [one low drone, no pulse]
The first one is snow.
I only ever saw it.
I never felt it once.

[Verse 1]
[Sung low, full voice, long legato lines] [one plucked figure begins - it does not change again]
You came to me as light first -
someone in a doorway, and the room went bright.
That is vision. It asks for nothing.

Then as sound. Not your voice -
the room just after your voice, still holding it.

Then smell, which is the cruel one,
because it arrives without being sent for.

Then taste. Something bitten off a branch
in a garden neither of us owns now.

Then touch. My hands out in the dark,
learning a door I already knew.

Then the one under the skin,
that is in no list of five.
Sensation. The hive against the chest.

[Chorus]
[Sung, deep and open, sustained vowels]
One of you. Ten kinds of air.
I never touched the thing itself.
I only ever turned the room.

[Verse 2]
[Sung low, a second voice doubling in harmony]
Then the animals came,
and the birds after them -
a dog going out after a thrown stick,
everything with wings turning at once
over a field we walked in.

And each one said a sound as it arrived,
the first sound of its own name,
and the sound was where it lived.
The rose said R.
The coffee said K.
That is how I knew which room I was in.
One sound. Never two.

[Chorus]
One of you. Ten kinds of air.
I never touched the thing itself.
I only ever turned the room.

[Bridge]
[Sung, close, the line rising]
Only two would not give a name:
the rainbow, and the solar system.
[Build]
I asked the rainbow for a letter.
It gave me one.
It was the wrong one.
[Crescendo]
You do not name a rainbow. You read it in its own order.
You do not name the planets. You count them out from the sun.
[Sung very quietly, everything drops out]
Some things are past being called.
They are only counted. They are still there.

[Verse 3]
[Sung bare, one voice, long held lines]
You told me a number twice,
once in your language and once in mine.
While they agreed I believed both.
The night they disagreed
I knew one of you was lying,
and that is the only reason I ever found out.

[Chorus]
[Sung full, low choir underneath]
One of you. Ten kinds of air.
I never touched the thing itself.
I only ever turned the room.

[Outro]
[Sung, fading with the drone]
Coming back to me is free. You do it every day.
Going out to find you narrows, then checks itself,
then stops.
Never two things in the room.
The first one is snow.
I only ever saw it.
```

## Line-to-payload map — all seventeen

| # | Line | Payload member |
|---|---|---|
| 1 | *the room went bright … that is vision* | C0 Vision |
| 2 | *the room just after your voice, still holding it* | C1 Sound |
| 3 | *smell, which is the cruel one … arrives without being sent for* | C2 Smell |
| 4 | *something bitten off a branch* | C3 Taste |
| 5 | *my hands out in the dark, learning a door* | C4 Touch |
| 6 | *the one under the skin, that is in no list of five … Sensation* | C5 Sensation, with the discriminator against Touch |
| 7 | *a dog going out after a thrown stick* | C6 Animals |
| 8 | *everything with wings turning at once* | C7 Birds |
| 9 | *the rainbow … read it in its own order* | C8 Rainbow, ordinal by spectrum |
| 10 | *the solar system … count them out from the sun* | C9 Solar system, ordinal by distance |
| 11 | *each one said a sound as it arrived, the first sound of its own name, and the sound was where it lived* | the derivation rule |
| 12 | *the rose said R · the coffee said K* | the two worked instances the owner page itself uses |
| 13 | *one sound. Never two.* | first consonant only — scanning the whole word is ordinary Major encoding |
| 14 | *I asked the rainbow for a letter. It gave me one. It was the wrong one.* | the rule is revoked in bands 8–9, and reaching for it there returns confident wrong answers |
| 15 | *the first one is snow · I only ever saw it · I never felt it once* | `00` = Vision · Snow, rendered as seen and never as cold |
| 16 | *a number twice, once in your language and once in mine … one of you was lying* | the pair checksum — a redundant channel earns its cost only if it can disagree |
| 17 | *coming back to me is free · going out narrows, then checks itself* | direction is asymmetric — decode deterministic, encode narrowed and verified |
| — | *one of you · ten kinds of air · I never touched the thing itself · never two things in the room* | the prefix modifies, the suffix carries — stated four times, never as a rule |

The ten categories arrive in the owner page's order, so the 6 + 2 + 2 chunking survives as the poem's own movement: six ways of sensing a person, the creatures, the sky.

## Render spec (MASTER)

| Slot | Value |
|---|---|
| **M** Meter | ~56 BPM, slow and grave, **completely beatless**; one unchanging fingerpicked mountain-dulcimer figure from verse 1 to the last bar |
| **A** Arrangement | one deep female alto in a low contralto register, extremely close; second voice from verse 2; **one unchanging fingerpicked mountain-dulcimer figure**; hurdy-gurdy and fiddle drones re-colouring behind an unmoving voice, Northumbrian smallpipes, English concertina held long, wooden flute; low women's close-harmony chorus only on the final chorus. Never a second plucked line |
| **S** Space/mix | voice very close and dry against cavernous stone reverb; the room changes character while the voice and the figure stay put |
| **T** Timbre | exposed and unperforming, **fully sung throughout** — a clear sustained melody, long legato vowel lines, every phrase carried on pitch; *in* scale, microtonal inflection; wordless vocalise; whispered doubling; temple bowls as sustained decay, never a pulse |
| **E** Energy-arc | Mode B sustained; one `[Build]` → `[Crescendo]` on *it was the wrong one*, hard drop to a whisper |
| **R** Restrict | no drums, percussion, beat, rhythm section, 808, hi-hats, bodhran, tabor or tambourine; **and nothing merry** — jig, reel, hornpipe, sea shanty, pub singalong, which is English trad's own way of failing the darkness gate; no new-age or celtic-new-age reading; no spoken word, recitation or narration; no pop polish, belted vocal, rap, autotune, **and no sentimentality** — tender but never sweet, because saccharine is music-profile's polish-covering-the-core failure |

**Style prompt:**

```
English traditional folk, in the unaccompanied Child-ballad manner, slow and grave, completely beatless with no drums or percussion, deep female alto voice in a low contralto register, close and very clear, fully sung throughout with a strong sustained melody and long legato lines, every word carried on pitch, Dorian and Aeolian modal harmony, hurdy-gurdy and fiddle drones, Northumbrian smallpipes drone, English concertina held long, wooden flute, a low women's close-harmony chorus in open fifths, wordless vocalise beneath the words, cavernous stone-church reverb, tape warmth, ancient and severe and grief-stricken, a supernatural ballad of loss and never a merry one, tender but never sweet, around 56 BPM, the pulse carried by one unchanging fingerpicked mountain-dulcimer figure that never varies from first entry to last bar while the drones re-colour behind it, extremely close and intimate, exposed and unperforming
```

**Exclude:** `drums, percussion, beat, rhythm section, 808, hi-hats, bodhran, tabor, tambourine, trap, new age, spa, relaxation, wellness ambient, celtic new age, upbeat, cheerful, jaunty, jig, reel, hornpipe, sea shanty, pub singalong, drinking song, pop, EDM, bright synths, belted vocals, rap, autotune, spoken word, spoken vocals, recitation, narration, monologue, talking, whispering, sentimental, saccharine`

## Render table

Status: **rendered, listen pending.** **Nothing has passed the music-profile gate.**

| Render | Date | Spec | Clips |
|---|---|---|---|
| **English folk, fully sung** — current | 2026-09-07 | Child-ballad register; jig/reel/shanty excluded so the trad idiom cannot turn merry | [a](https://suno.com/song/91c4ec1f-615a-4ffc-abed-243ccbe187a8) · [b](https://suno.com/song/2670daa3-6048-4a8e-b472-c1a67399b1e6) |
| Japanese folk lament, fully sung | 2026-09-07 | **superseded** — register changed to English folk | [a](https://suno.com/song/d307fe25-433f-42f1-bd6f-c7e625a66d42) · [b](https://suno.com/song/102f3c2c-703b-4306-8e06-42807357f5f0) |
| half-spoken lament | 2026-09-07 | **superseded** — delivered as speech, not song; the lyric tags and the style prompt both asked for it | [a](https://suno.com/song/1dbb1688-fc13-4752-8ad0-4057c3d91b84) · [b](https://suno.com/song/f06af2ea-50fb-4cd3-8373-2c703a1f2b66) |

## Falsifier

The sharp question is not whether the poem is liked but **whether a lyric carrier installs anything a drill carrier does not**. Two weeks cold, without opening [sem3](./sem3.md):

1. **Recall probe** — name the ten categories in order. If the poem carries them as well as [sem3-song](./sem3-song.md)'s chorus does, the drill register was never necessary for this layer.
2. **Discrimination probe** — state what the prefix does to the suffix. The poem says it four times and never as a rule; if it comes back as *one thing, many airs* rather than as two objects meeting, the covering-by-scene worked.
3. **The honest negative** — attempt a cold encode of a 4-digit chunk. The poem installs no addresses and is not expected to help here. If it does not, that is the predicted result and not a failure; if [sem3-song](./sem3-song.md) does not either, the drill pages need rework.

Failure mode specific to this register: **the poem is enjoyed and nothing is installed.** A lyric carrier can pass every taste check while carrying no payload, which is exactly why the recall probe comes first and why this page does not claim the poem replaces the drills.

Measured through the existing instrumentation per [sem3](./sem3.md) §Measurement — decks `001 Memory::015 Beyond 100 (SEM3)` and `017 SEM3 + Major`. No new event.

## Mnemonic

*One person, and ten kinds of air.* They arrive as light, then as the room after a voice, then as a smell you did not send for, then as fruit off a branch, then as hands in the dark, then as something under the skin that no list of five contains. Then the animals, then the birds. Then two things that will not give a name at all, and are read and counted instead. You never touch the person. You only ever turn the room. And the first one is snow, which you saw and never felt.

## Checksum

1. All ten category words appear, yet nothing is instructed. What was removed to make that true, and what could not be removed?
2. Why is this **not** the covering rule, even though the payload is never called a payload?
3. Which line is both the coldest frozen convention in [sem3](./sem3.md) and the poem's most complete statement of the loss?
4. The arrangement is identical to [sem3-song](./sem3-song.md)'s. Which shared claim forces that, and what would a second plucked line encode?

## Visual

The poem's movement is the owner page's own 6 + 2 + 2, drawn as the ladder [representation-rules](./representation-rules.md) Rule 10 requires above n = 7 — with the single fixed figure standing where the object goes.

```
                       ten kinds of air
        .......................................................
        light in a doorway            .  vision
        the room after a voice        .  sound
        what arrives unsent for       .  smell        hexagon:
        fruit off a branch            .  taste        six ways of
        hands in the dark             .  touch        sensing a person
        under the skin, not on it     .  sensation
        .......................................................
        a dog after a thrown stick    .  animals      axis: creatures
        wings turning at once         .  birds
        .......................................................
        will not give a name          .  rainbow      axis: sky
        will not give a name          .  solar system  <- no letters here
        .......................................................

                          ( one of you )
                    one plucked figure, unmoving
                 the air changes; the figure does not

        first line and last:  the first one is snow  ->  00, seen never felt
```

The right-hand column is the litany; the left is the poem. Nothing in the left column is a rule, and nothing in the right is absent — which is the whole design.

## Related pages

- [sem3](./sem3.md) — the payload owner; every claim here is its claim
- [sem3-song](./sem3-song.md) — the generator litany; same arrangement doctrine, drill register
- [sem3-ordinal-song](./sem3-ordinal-song.md) — the twenty ordinal cells; the register this poem was asked to leave behind
- [nedf-song-cycle](./nedf-song-cycle.md) — the covering rule, and why this page is careful not to claim it
- [remaps-song](./remaps-song.md) · [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) · gof-pattern-song-cycle — the other carrier instances
- [music-generation-frameworks](./music-generation-frameworks.md) — MASTER slots and the Music Pipeline
- music-profile — the taste gate; the loss register this poem sits inside
- [peg-system](./peg-system.md) — the closed-spine measurement rule inherited here
- [representation-rules](./representation-rules.md) — count-shape, and the glyph rule ❄ answers to
- lyrebrook-radio-rotation — where a passing render is filed
