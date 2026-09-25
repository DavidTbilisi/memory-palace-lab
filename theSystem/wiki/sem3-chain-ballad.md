---
glyph: 🦕
palace: meta-knowledge
level: 4
domain: 10
room: 8
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/sem3-chain-ballad.md
---

# SEM3 Chain Ballad — *Out of the Snow*

**Summary**: The eight story-chains of [sem3-linking-chains](./sem3-linking-chains.md) sung as one English folk ballad — eight verses, ten cells each, **all eighty phonetic cells of [SEM3](./sem3.md) in one song**. Its load-bearing decision is that every verse takes the **same tune, unchanged**, because every band runs the same ten consonants down its column; the melody is therefore the Major mapping itself, and melodic position N is digit N.

**Sources**:
- Payload owner: [sem3-linking-chains](./sem3-linking-chains.md) — the eight chains, every noun of which is the frozen table's noun; the Vision chain is David's
- Rule owner: [sem3](./sem3.md) — the first-consonant derivation rule, the band structure, the two ordinal exceptions
- `/home/david/code/memory-palace-lab/theSystem/sem3-full.md` §Full Table — the canonical items behind both
- Precedent: [remaps-song](./remaps-song.md) (open litany carried whole, line-length checksum), [famous-clocks-mnemonic-song](./famous-clocks-mnemonic-song.md) (ordered payload in verses)
- Render stack: [MASTER](./music-generation-frameworks.md); gate music-profile

**Last updated**: 2026-09-07 — page created, rendered same day.

---

## Why it exists

[sem3-song](./sem3-song.md) carries the ten category labels. [sem3-ordinal-song](./sem3-ordinal-song.md) carries bands 8 and 9. [sem3-love-poem](./sem3-love-poem.md) carries the whole system in a lyric register. None of them carries a single **cell**. [sem3-linking-chains](./sem3-linking-chains.md) fixed that on the page, and this song is the same eighty cells in audio.

**Open litany, and the nouns are the payload.** *Snow · Dinosaur · Nobility · Moonlight…* — recall the words and you have the cells; there is no scene to fall back on, and nothing here can be paraphrased without destroying it. Every noun is the frozen table's noun.

## Design decisions (locked 2026-09-07)

- **One tune, eight times, unchanged — and this is the whole argument.** Every band runs the same ten consonants down its column (`S · D/T · N · M · R · L · CH/J · K/G · F/V · P/B`), so the verses must take one repeating melody. **The tune is the Major mapping**, and melodic position N is digit N. A verse that needed a different tune would assert the ladder differs between bands, which is false. It is also idiomatic rather than a compromise: an eight-verse ballad on one repeating tune is exactly what the Child tradition does, and [sem3-song](./sem3-song.md)'s register move to English folk had already put the cycle there.
- **Two items per line, five lines, ten cells.** The tightest checksum in the SEM3 set. A line carrying one item has dropped a cell, and you hear the short line before you could count the nouns.
- **Eight verses, then it stops.** Bands 8 and 9 are ordinal and have no chain ([sem3-linking-chains](./sem3-linking-chains.md) §8 and 9 — no chain, by construction). A ninth verse would be a payload error, and the refrain says so outright: *two at the end with no letters at all*, which hands off to [sem3-ordinal-song](./sem3-ordinal-song.md).
- **The sensory register shifts per verse and is named in the delivery tag** — *everything here is seen · heard · smelled · tasted · felt on the skin · felt under the skin*. The register **is** the category digit, so a verse staged in the wrong sense installs the wrong prefix. Bands 4 and 5 carry the discriminator explicitly: on the skin, then under it.
- **The refrain is the rule, not a feeling.** *Every one says its own first sound. The sound is the number. The number is the place.* Payload in the verses and payload in the refrain both — this is a litany throughout, and there is no emotional passage to protect.
- **Not filed onto [sem3-linking-chains](./sem3-linking-chains.md).** That page already runs past 260 lines and a song needs its own Suno block, payload map, MASTER spec and render table. Separate page, reciprocally linked.
- **No new [METER](./meter-overview.md) namespace.** [sem3](./sem3.md) §Measurement closes the spine, as with all three sibling carriers.

## The song (Suno-ready)

```
[Intro]
[Sung, low and sustained, very close] [one drone, no pulse]
Every one says its own first sound.
Listen for the sound, and you have the number.

[Verse 1]
[Sung, the tune that will not change - everything here is seen]
Out of the snow, a dinosaur;
the nobility in moonlight;
they take a ravine for a pool - lightning
throws them into a church, a Concorde at the pulpit;
his underwear on fire, he's gone into the painting.

[Verse 2]
[Same tune - everything here is heard]
They sing till the floor is a drum;
the horse neighs, then moans;
a lion's roar, a great tongue lapping;
someone says shh - and a gong;
the violin bends, the piano comes through the ceiling.

[Verse 3]
[Same tune - everything here is smelled]
Seaweed rots on hot tar;
the steam is nutmeg, his breath is mint;
it frosts a rose on a leather coat;
the coat reeks of cheese, he spills the coffee;
out to a wet forest, where the bread is burning.

[Verse 4]
[Same tune - everything here is tasted]
Buried in spaghetti, he bites a tomato;
it fires nuts through a mango;
it splits on rhubarb, he sucks a lemon;
swallows a cherry, drinks the custard;
chokes on fudge, and slips on the banana.

[Chorus]
[Sung full, low women's close harmony in open fifths]
Every one says its own first sound.
The sound is the number. The number is the place.
Ten to a band, and eight bands lettered.
Two at the end with no letters at all.

[Verse 5]
[Same tune - everything here is felt on the skin]
Bare feet in scalding sand, down into the dump;
wet newspaper, then mud to the knee;
one burning rock, and lather that won't rinse;
it sets to jelly, you tear out onto grass;
velvet over the grass, then bark takes your palms.

[Verse 6]
[Same tune - everything here is felt under the skin]
Swimming with no water, dancing you didn't start;
something nuzzling the ribs, mingling with the pulse;
rubbing under the skin, and the rubbing turns to loving;
shaking you can't stop, climbing your own spine;
it lets go into flying - and at the top of it, peace.

[Verse 7]
[Same tune - the beasts]
A zebra scanned at the till, and out leaps a deer;
it sneezes a newt on a monkey;
the monkey rides a rhino into an elephant;
it sits on a giraffe; a kangaroo referees;
boxes out the fox, and the bear eats the cup.

[Verse 8]
[Same tune - the birds]
A seagull drops the chips on a duck;
the night-eagle takes it, the magpie loots the nest;
hands it to a robin, who drops it on a lark;
the lark falls in with the chickens; a kingfisher dives;
knocks the flamingo down onto a peacock.

[Chorus]
[Sung full, low women's close harmony in open fifths]
Every one says its own first sound.
The sound is the number. The number is the place.
Ten to a band, and eight bands lettered.
Two at the end with no letters at all.

[Outro]
[Sung, fading with the drone]
Every one says its own first sound.
Ten to a band. Eight bands, and no more.
```

## Line-to-payload map — eight verses, eighty cells

Each verse is five lines of two cells. The pairs are the checksum; the row count is the band count.

| Verse | Register | Cells `x0`–`x9` |
|---|---|---|
| 1 | seen | Snow · Dinosaur \| Nobility · Moonlight \| Ravine · Lightning \| Church · Concorde \| Fire · Painting |
| 2 | heard | Sing · Drum \| Neigh · Moan \| Roar · Lap \| Shh · Gong \| Violin · Piano |
| 3 | smelled | Seaweed · Tar \| Nutmeg · Mint \| Rose · Leather \| Cheese · Coffee \| Forest · Bread |
| 4 | tasted | Spaghetti · Tomato \| Nuts · Mango \| Rhubarb · Lemon \| Cherry · Custard \| Fudge · Banana |
| 5 | felt on the skin | Sand · Dump \| Newspaper · Mud \| Rock · Lather \| Jelly · Grass \| Velvet · Bark |
| 6 | felt under the skin | Swim · Dancing \| Nuzzling · Mingling \| Rubbing · Loving \| Shaking · Climbing \| Flying · Peace |
| 7 | the beasts | Zebra · Deer \| Newt · Monkey \| Rhino · Elephant \| Giraffe · Kangaroo \| Fox · Bear |
| 8 | the birds | Seagull · Duck \| Night-eagle · Magpie \| Robin · Lark \| Chicken · Kingfisher \| Flamingo · Peacock |

Read the table **down a column** instead of across and the derivation rule appears: every first column is S or Z, every second D or T, and so on to P or B. That vertical identity is what licenses one tune for all eight verses.

The refrain adds four members the verses cannot carry: the rule itself, position-as-digit, ten-per-band, and the two unlettered bands at the end.

## Render spec (MASTER)

| Slot | Value |
|---|---|
| **M** Meter | slow and grave, **completely beatless**; one fingerpicked mountain-dulcimer figure carries the pulse; the tune repeats identically for all eight verses |
| **A** Arrangement | deep female alto in a low contralto register; hurdy-gurdy and fiddle drones, Northumbrian smallpipes, English concertina held long, wooden flute; a low women's close-harmony chorus in open fifths **only on the refrain**, so the refrain is audibly a different kind of thing from the verses |
| **S** Space/mix | voice close and clear against cavernous stone-church reverb; low end from drone, never a synth kick |
| **T** Timbre | fully sung throughout, strong sustained melody, long legato lines, every word carried on pitch; tape warmth; ancient and severe |
| **E** Energy-arc | Mode B sustained across all eight verses — **deliberately no peak**, because no band outranks another; the only lift is the choir entering on each refrain |
| **R** Restrict | no drums, percussion, beat, rhythm section, 808, hi-hats, bodhran, tabor or tambourine; **and nothing merry** — jig, reel, hornpipe, sea shanty, pub singalong, drinking song, which is English trad's own way of failing the darkness gate; no new-age or celtic-new-age; no spoken word, recitation or narration; no pop polish, belted vocal, rap, autotune |

**Style prompt:**

```
English traditional folk ballad, in the unaccompanied Child-ballad manner, slow and grave, one repeating tune sung identically for every verse, completely beatless with no drums or percussion, the pulse carried by one fingerpicked mountain-dulcimer figure, deep female alto voice in a low contralto register, close and very clear, fully sung throughout with a strong sustained melody and long legato lines, every word carried on pitch, Dorian and Aeolian modal harmony, hurdy-gurdy and fiddle drones, Northumbrian smallpipes drone, English concertina held long, wooden flute, a low women's close-harmony chorus in open fifths on the refrain, cavernous stone-church reverb, tape warmth, ancient and severe, a supernatural ballad and never a merry one
```

**Exclude:** `drums, percussion, beat, rhythm section, 808, hi-hats, bodhran, tabor, tambourine, jig, reel, hornpipe, sea shanty, pub singalong, drinking song, upbeat, cheerful, jaunty, new age, celtic new age, spa, relaxation, wellness ambient, pop, EDM, bright synths, belted vocals, rap, autotune, spoken word, spoken vocals, recitation, narration, monologue, talking, whispering`

**The known risk on this one.** At 2,872 characters it is by far the longest lyric in the catalogue, and Suno may rush or clip the later verses. **Verses 7 and 8 are the exposed ones**, and they hold four of the deck's ten worst-lapsing cells — Kangaroo, Fox, Duck, Kingfisher. If the render truncates, the fix is two ballads on the same tune, bands 0–3 and 4–7, at one more submission. Check the tail before anything else.

## Render table

Status: **rendered, listen pending.** **Nothing has passed the music-profile gate.**

| Render | Date | Spec | Clips |
|---|---|---|---|
| **English folk ballad, one tune ×8** — current | 2026-09-07 | Child-ballad register, beatless, fully sung, Vocal Gender Female | [a](https://suno.com/song/8d3b6dc8-e645-49c2-9479-dd21d06f62eb) · [b](https://suno.com/song/026008b3-0858-4c0d-8f45-e23f7a5ce061) |

## Falsifier

Two weeks cold, without opening this page, [sem3-linking-chains](./sem3-linking-chains.md) or the deck: **hum the tune, then decode ten keys spread across all eight bands** — `04`, `17`, `26`, `35`, `41`, `59`, `62`, `70`, `78`, `13`.

Pass = eight or better, with the answer arriving as the item rather than as a recital of the verse up to it.

Four failures it separates, the first two specific to a sung carrier:

1. **The early bands return and the late ones do not.** The render truncated or rushed, and Animals and Birds were never installed. This is the predicted failure of the length risk above, and it is checkable on first listen rather than at two weeks.
2. **The tune returns and the words do not.** A melody installed with no payload on it — the pure-carrier failure, and the one a song can produce that a page cannot.
3. **The item returns in the wrong register** — `40` yields Sand staged visually rather than felt. The category digit will drift, because the register is the digit.
4. **First consonant right, word wrong** — `40` returns *Sponge*. The residue is still uninstalled, which is the only thing the chains and this ballad exist to fix.

Measured through the existing instrumentation per [sem3](./sem3.md) §Measurement — decks `001 Memory::015 Beyond 100 (SEM3)` and `017 SEM3 + Major`, whose reviews reach [METER](./meter-overview.md) through `tools/meter-anki-addon`. The signal is the same lapse leaderboard [sem3-linking-chains](./sem3-linking-chains.md) names: `Mint · Nuts · Forest · Kangaroo · Fox · Duck · Kingfisher · Rose · Shaking · Robin`, every one of which is sung here.

## Mnemonic

*One tune, eight times, and the tune is the alphabet.* Wherever you are in the melody, that is the digit — first note S, second note D or T, and on down to P or B at the end of the line. The words change and the sense changes; the tune never does. It stops after eight because the last two bands have no letters to hang a tune on.

## Checksum

1. Why must every verse take the same tune — and what would a changed tune wrongly assert?
2. Five lines, two items each. What does a short line mean, and why do you catch it before counting?
3. Why exactly eight verses, and what does the refrain's last line hand off to?
4. Which two verses are most at risk from the render, and which four high-lapse cells sit in them?

## Visual

Eight verses down, ten cells across — and the rule is the **vertical** axis, which is why one tune serves all eight rows.

```
              melodic position ->   1   2   3   4   5   6   7   8   9  10
              digit            ->   0   1   2   3   4   5   6   7   8   9
              consonant        ->   S  D/T  N   M   R   L CH/J K/G F/V P/B
   verse                           ----------------------------------------
    1  seen                        Sno Din Nob Moo Rav Lig Chu Con Fir Pai
    2  heard                       Sin Dru Nei Moa Roa Lap Shh Gon Vio Pia
    3  smelled                     Sea Tar Nut Min Ros Lea Che Cof For Bre
    4  tasted                      Spa Tom Nut Man Rhu Lem Che Cus Fud Ban
    5  felt ON skin                San Dum New Mud Roc Lat Jel Gra Vel Bar
    6  felt UNDER skin             Swi Dan Nuz Min Rub Lov Sha Cli Fly Pea
    7  the beasts                  Zeb Dee New Mon Rhi Ele Gir Kan Fox Bea
    8  the birds                   Sea Duc Nig Mag Rob Lar Chi Kin Fla Pea
   .........................................................................
    -  rainbow                     -- no verse: ordinal, no letters --
    -  solar system                -- no verse: ordinal, no letters --

   the chain runs ACROSS a row      the rule runs DOWN a column
   one tune serves every row because every column is the same letter
   two blank rows at the foot = where the letters stop
```

Read across for the story; read down for the rule. The ballad sings the rows, and the tune is the columns.

## Related pages

- [sem3-linking-chains](./sem3-linking-chains.md) — the payload owner; these eight verses are its eight chains
- [sem3](./sem3.md) — the derivation rule the tune encodes, and the band structure
- [sem3-ordinal-song](./sem3-ordinal-song.md) — carries the two bands this ballad stops short of, and the refrain hands off to it
- [sem3-song](./sem3-song.md) · [sem3-love-poem](./sem3-love-poem.md) — the category-level carriers; this is the cell-level one
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — owner of the digit-consonant mapping the melody stands in for
- [peg-system](./peg-system.md) — the no-relabelling rule every noun here obeys
- [music-generation-frameworks](./music-generation-frameworks.md) — MASTER slots and the Music Pipeline
- music-profile — the taste gate
- [representation-rules](./representation-rules.md) — the count-shape and glyph rules the Visual and 🦕 answer to
- lyrebrook-radio-rotation — where a passing render is filed
