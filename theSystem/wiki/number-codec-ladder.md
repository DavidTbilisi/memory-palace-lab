---
palace: strategic-memory
level: 4
domain: 10
room: 8
semantic_mode: 5
wiki_source: wiki/learning-systems/number-codec-ladder.md
---

# Number Codec Ladder

**Summary**: One substrate, four codecs, one verification layer — a unified number-memory architecture built on the soroban/cube substrate that spans everything from in-calculation state (register) to large-number archival (deep pack), with a self-verifying checksum seal no traditional mnemonic system has. Positioned as a *candidate challenger* to the standing [mnemonic-methods-master](./mnemonic-methods-master.md) ruling for long numbers ([PAO](./person-action-object-system.md) + Major System); it promotes only if it passes the 24-hour falsifier below.

**Sources**:
- Design conversation, 2026-07-02 (`/validate-idea` session on `Excalidraw/Soroban_PEG.excalidraw` → cube digit faces → fusion grammar → this ladder; verdict keep-with-modification)
- [soroban-learning-method](./soroban-learning-method.md) §Cube Digit Faces (owns L0/L1 grammar)
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) (the 100-cell vocabulary consumed by L3)
- [mnemonic-methods-master](./mnemonic-methods-master.md) (Tier discipline; the router row this page challenges)
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) (operator-icon discipline; angel-exponent hook)
- [REMAPS](./remaps.md) (binding moves), [Memory Palace](./memory-palace-architecture-for-neural-os.md) (loci)

**Last updated**: 2026-07-02 — added §Wide pack (L3W): 100-action matrix (backward-compatible, instrument 0 = bare), sprint/archival mode bit, hex-native 16×16 extension contract, Stage-3 Ben-class registered as gated candidate; erasure recovery + the journey-design (burst-error) rule added to the seal/L3 sections same day

---

## What this is

Every existing number-memory system picks one point on the latency/durability curve: the Major System and [PAO](./person-action-object-system.md) optimize for durable archival, digit-image pegs for quick single digits, and none of them can *compute*. The soroban substrate ([soroban-learning-method](./soroban-learning-method.md)) computes natively but its raw bead states are systematic rather than distinctive — good registers, bad archives.

The Number Codec Ladder covers the whole curve with **one image vocabulary**: the same cube faces and matrix cells appear at every level, so what you store can be loaded back into the mental soroban and operated on in place. Storage format = compute format. That load/store compatibility, plus the [REMAPS](./remaps.md)-bound checksum seal, are the two capabilities no traditional system offers.

## The ladder

Four levels, L0–L3 — a new ladder registered on this page, distinct from the progression ladders catalogued in [skill-progression-stages](./skill-progression-stages.md) (this one bands *storage latency*, not skill maturity):

| Level | Codec | Unit | Digits / locus | Holds for | Job | Status |
|---|---|---|---|---|---|---|
| **L0 Register** | Raw cube faces per column | face percept | n/a (live state) | seconds | mental-soroban calculation | built ([soroban-learning-method](./soroban-learning-method.md) §Cube Digit Faces; `tools/soroban-place-value-pegs.html`) |
| **L1 Scene** | Fusion grammar: earth-face actor acts on the food column, rose overlay = +5 | 1 scene / digit | — | minutes–hours | one working number (a running total, a number just heard) | designed |
| **L2 Tableau** | Whole soroban row snapshot as one composite image at one locus; food alphabet gives free intra-chunk order. Compact read: the **Merge variant** — one material-fused object per column (apple-fleshed taxi), see [soroban-learning-method](./soroban-learning-method.md) §Cube Digit Faces | 4–6 fused scenes or merged objects | 4–6 | hours–days | one important number, still loadable into the soroban | designed |
| **L3 Deep pack** | `[cell] [action] [cell]` scenes — two [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) cells (2 digits each) bound by a cube-face action (1 digit) | 5 digits / scene | 10 (2 scenes + seal) | days+ (journey-placed) | large numbers in one pass | **candidate** — see promotion gate |
| **L3W Wide pack** | Same scene, 2-digit action (narrow verb × wielded visual-peg instrument; instrument 0 = bare) — see §Wide pack | 6 digits / scene | 12 (+ seal in archival mode) | days+ (journey-placed) | maximum throughput; sprint (no seal) / archival (dual seal) modes | **candidate** — falsifier at 12 digits/locus + speed gate |

Levels substitute downward only when the retrieval guarantee holds (each level's [METER](./meter-overview.md) floor below) — the same preservation rule [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §L states for lighter methods replacing heavier ones.

## L3 Deep Pack specification

**Scene grammar** (typed slots — slots never swap, which structurally prevents within-scene transpositions):

- **Object slots** (2 digits each): a [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) cell — the audio peg carries the tens, the visual peg the units, retrieved as one multimodal percept at the matrix's own pass floors.
- **Action slot** (1 digit): a 10-item action vocabulary derived from the cube faces:

| Digit | Action | Digit | Action |
|---|---|---|---|
| `0` | none (static contact) | `5` | thorn-wrap (rose's action) |
| `1` | drive-through (taxi) | `6` | **flaming** drive-through |
| `2` | splatter (tangerine) | `7` | **flaming** splatter |
| `3` | abduct (alien) | `8` | **flaming** abduct |
| `4` | drench (wave) | `9` | **flaming** drench |

**Flame is the action slot's +5 overlay** — deliberately distinct from the actor slot's rose so the two `+5` marks can never be confused in one scene. This is a registered trap slot: rose = +5 *on an actor/state*, flame = +5 *on an action*. Drill the discrimination before relying on L3 (floor below).

**Worked example** — `42175 83906` at one locus:

> *The Door-Swan (42) is driven through (1) into the Heaven-Hook (75)* · *the Gate-Heart (83) is flaming-drenched (9) into the Hero-Bomb (06)* — and a rose+wave **seal** (digit-sum 45 → 9) floats above the locus.

Encode rate when fluent: ~20–30s per 10 digits including the seal. A 50-digit number is 5 loci, one walk.

**Journey-design rule (burst-error protection): similar numbers never take adjacent loci.** Interference is memory's burst error, and coding theory's answer is [interleaving](./interleaving.md) — scatter correlated content so one failure can't take out a cluster. Two phone numbers, or two constants from the same domain, go to separated stretches of the journey (or different journeys). This is the storage-layout twin of the practice-scheduling rule the owner page describes.

## The Checksum Seal

The substrate computes, so memory can verify itself — a capability absent from every traditional number system, which all fail silently.

**Protocol**: per locus (or per number for short numbers), compute the digit-sum mod 9 on the mental soroban — casting out nines is a native soroban drill. Write remainder `0` as `9` so the seal always has a face percept (rose+wave = 9, etc.). Render the seal as a cube-grammar percept *floating over* the locus, visually apart from the scenes.

**Verify loop on recall**: decode scenes → digits → digit-sum on the soroban → compare to the recalled seal. Mismatch = a digit is wrong *and you know it* before acting on the number.

**Scope rule** (anti-ceremony, per [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §The Main Constraint): seals are for **≥8 digits or high-stakes numbers** (accounts, keys, constants). Sealing a 4-digit PIN is over-tagging — the [UMTF](./universal-mental-tagging-framework.md) "if everything glows, nothing glows" rule applied to verification.

**Erasure recovery — the seal repairs, not just detects.** Coding theory distinguishes *errors* (a digit is wrong, position unknown) from *erasures* (a known slot is blank) — and most recall failures are erasures: "the third digit is just gone." A single erasure against the seal is solvable on the soroban: **missing digit ≡ seal − sum of the remaining digits (mod 9)**. Forget any one digit of a sealed locus and you reconstruct it in seconds; no new install, the seal was already paying for this. One honest gap: `0` and `9` are congruent mod 9, so a recovered blank that computes to 0 reads "0 or 9" — the position-weighted mod-11 seal below disambiguates, since 11 exceeds the digit alphabet.

**Advanced tier**: mod-9 is order-blind — it misses transpositions, and its erasure repair has the 0-vs-9 ambiguity. Slot typing prevents swaps within a scene and loci anchor scene order, but for maximum-stakes numbers a position-weighted sum (1·d₁ + 2·d₂ + … mod 11) catches transpositions, resolves 0-vs-9, and — combined with the mod-9 seal — locates *and* corrects one unknown-position error (a miniature Reed–Solomon, run entirely on the soroban). Costs one more pass and one more percept; reserve it deliberately.

**Base-general form (registered 2026-07-02) — the seal in any radix.** For base *b*, the seal is the digit-sum **mod (b−1)** — the "casting out" identity holds in every base — with remainder 0 written as the top digit so the seal always has a percept. The two instances in use:

| Base | Seal | 0 written as | Erasure ambiguity | Weighted modulus (first prime > b) | Seal percepts |
|---|---|---|---|---|---|
| Decimal (10) | digit-sum **mod 9** | `9` | 0 vs 9 | **11** | cube grammar (1–9) |
| Hex (16) | nibble-sum **mod 15** (casting out fifteens) | `F` | 0 vs F | **17** | cube grammar for 1–9; **letterform pegs** for A–F (seal `E` = 🔱 trident) |

The whole structure transports: single-erasure repair = seal − sum of the rest (mod b−1); the ambiguity is always 0 vs b−1 (congruent); the weighted seal's modulus must exceed the digit alphabet, which is why decimal takes 11 and hex takes 17. Implemented live in `tools/soroban-place-value-pegs.html` hex mode (4 bytes + seal per locus; `0xDEADBEEF` seals to `E`).

## What each world contributed (and what was rejected)

| Borrowed from | Contribution | Status |
|---|---|---|
| Soroban substrate | Computability; checksums; complement-cheap state transitions | core |
| [PAO](./person-action-object-system.md) | Typed role grammar (object · action · object) | adopted |
| [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) | 100 pre-built, pass-floored 2-digit percepts — Major-scale vocabulary at zero new install | adopted (registered consumer) |
| Peg system (A–Z foods) | Positional anchors; free intra-tableau digit order | adopted (L2) |
| [Memory palace](./memory-palace-architecture-for-neural-os.md) loci | Episodic separation between numbers — the mechanism that makes PAO durable in the first place | adopted unchanged |
| [REMAPS](./remaps.md) | Scene binding (impossible interaction, motion, sensation) | adopted |
| Major System | Per-chunk phonetic uniqueness | demoted to optional title layer for pre-composed constants — live word-finding is its known encode bottleneck |
| [observer-inside-method](./observer-inside-method.md) die-corner view (3 faces = 3 digits) | Higher static density | parked as experimental L3b — static structure binds worse than action scenes |
| Ben-system route (1000+ images, 3 digits/image) | Highest per-image density | rejected — ~2700-image install violates the main-constraint rule; buys neither compute nor verify |

## Honest scorecard

| System | Digits/locus | Encode speed (fluent) | New images to install | Computes? | Verifies? | Decimals / sign / hex? |
|---|---|---|---|---|---|---|
| Major System | ~2–3 per word | ~0.3–0.5 digit/s live (word-finding is the bottleneck; faster with pre-composed words) | ~0 | no | no | needs reserved icons ([major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md)) |
| [PAO](./person-action-object-system.md) | 6 | ~1+ digit/s trained (competition standard) | ~300 | no | no | no |
| Ben system | ~9 | ~2–3 digits/s elite | ~2700 | no | no | no |
| **L3 Deep pack** | **10** (incl. seal) | ~0.3–0.5 digit/s with seal; ceiling ≈ PAO × 5/6 without it | **~6** (4 actions + flame + seal rule) | **yes** | **yes** | **yes** — flip = decimals, angel = sign/exponent (candidate icon, see [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md)), soroban binary/hex overlays |
| **L3W Wide pack** (sprint mode) | **12** | targets ~1+ digit/s at PAO-unit density — claim held only after the speed gate | wielding discipline + drill volume (+12 pegs for the hex extension) | **yes** | **yes** (archival mode: dual seal) | **yes** — plus byte-native hex once the 16×16 pegs are chosen |

Where the claim caps out: Ben-system athletes still win digits-per-image — purchasable only at their install cost, and it buys neither compute nor verify. For every real-world number use (calculation, working numbers, phone numbers, constants, decimals, hex), the ladder dominates on capability per install.

### Not a sprint system

The speed column is a designed trade, not an accident, and three of its costs are structural:

1. **Density: 5 digits per scene vs PAO's 6.** Both bind 3 units per scene, but PAO's units carry 2 digits each (100-item vocabularies per slot) while the action slot here carries 1. ~17% more scenes for the same digits, at any skill level.
2. **The seal is anti-speed by construction.** A digit-sum mid-encode costs ~10s per locus that a competitor would never spend — the scope rule exists because the seal is for numbers where being *wrong* costs more than being *slow*. A speed event is the opposite trade.
3. **Composition depth.** A drilled PAO pair is one reflex retrieval; a deep-pack scene is two cell retrievals + an action + a [REMAPS](./remaps.md) bind. Overlearning closes most of this gap (the cells converge toward PAO-unit reflex) — but the ceiling stays ≈ PAO × 5/6, minus the seal.

Ruling: **rapid capture of dictated digits and memory-sport events stay with PAO** — that case is out of the *narrow* pack's scope, which is why the promotion falsifier tests 24-hour *accuracy*, not encode time. The ladder's raw-speed home turf is L0 only: in-calculation state transitions, where bead-isomorphic moves genuinely are fast.

*Scope note (2026-07-02):* §Wide pack revises this boundary deliberately — sprint-mode L3W matches PAO's 2-digit unit density and *challenges* the speed ruling, but holds no speed claim until its gate (40 digits ≤ 60s at ≥95%) is passed. Until then, this section's ruling stands for every codec on the page.

## Wide pack (L3W) — the maximum-throughput revision

*Added 2026-07-02 (`/validate-idea` keep-with-modification) after the user dropped the minimal-install constraint: "fastest and most capable," install cost explicitly not a concern.* The physics: **digits per retrieval unit = log₁₀(vocabulary size)** — 10 images/slot = 1 digit, 100 = 2, 1000 = 3. The narrow pack's bottleneck is its 1-digit action slot; L3W widens it.

**The 100-action matrix (zero new verbs).** A wide action is a 2-digit pair: **tens = the existing narrow action** (0 contact · 1 drive · 2 splatter · 3 abduct · 4 drench · 5 thorn-wrap · 6–9 flaming 1–4), **units = the instrument** — the visual peg *wielded* by the action, with **instrument `0` = bare hands**. So action `37` = *abducts with an axe-beam*; action `30` = plain abduct. Backward compatibility is exact: **the narrow pack is the units-0 column of the wide matrix** — nothing already drilled is invalidated. Scene becomes `[cell 2][action 2][cell 2]` = **6 digits per 3 units (PAO density), 12 digits + seal per locus — double PAO's per-locus capacity**, and decode stays mechanical (tens/units read off every slot), so soroban-load, seals, and erasure repair all survive.

**Registered trap slot — instrument vs object.** The same visual-peg image can now appear as a *wielded instrument* (action units) and *fused inside a cell* (object slot) in one scene. Role-typing is the guard, same pattern as rose/flame: instruments are **held/swung**, cell components are **merged into the percept**. Discrimination gets its own drill floor before L3W counts as usable.

**Sprint vs archival mode (explicit mode bit).** *Sprint*: no seal, maximum rate — for speed runs and dictated capture. *Archival*: **dual seal standard** (mod 9 + position-weighted mod 11) — locate-and-correct, transposition detection, 0/9 erasure disambiguation. The seal-scope rule becomes a mode choice instead of a digit-count heuristic; the §Not a sprint system ruling below applies to the narrow pack and to archival mode, while sprint-mode L3W *aims at* trained-PAO territory and holds that claim only after the speed gate is passed.

**Hex-native cells (Stage 1b, structure now, images pending).** Extending the peg matrix to **16 audio × 16 visual = 256 cells** gives one percept per **byte** `00–FF` — addresses, hashes, MAC prefixes at 2 scenes = 4 bytes + seal per locus, loadable through the soroban's existing hex overlay. Contract (per the matrix page's freeze): the 10×10 core is **untouched**; indices `A–F` on each axis are OCP extension slots; **cells encode symbol pairs — the radix is carried by the mode, never by the image** (cell `47` is decimal forty-seven in decimal mode and 0x47 in hex mode, exactly as soroban rods hold digits while base is an overlay). The 12 extension pegs were chosen and frozen 2026-07-02 (audio `A–F` = NATO phonetic, visual `A–F` = letterform objects — full tables and guards in [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) §16×16 extension contract); the extension is usable once they're drilled to the atomic floors.

**Stage 3 — the Ben-class ceiling (registered candidate, not adopted).** 1000-item object vocabulary → 3 digits/unit, ~16–18 digits + seal per locus, ~2–3 digits/s elite. Two routes (arbitrary images: fastest, 1000 installs, lookup decode · structured triples: zero installs, 3-way binding load). Gated on Stage 2 telemetry showing the limiter is vocabulary, not composition reflex — registered in [composability-index](./composability-index.md), no build before that data exists.

## Not the other cube system

Two cube systems now exist in the wiki and must not blur:

- **Cube-as-digit** (this ladder / [soroban-learning-method](./soroban-learning-method.md) §Cube Digit Faces): the cube face is a *column-state percept* — it names which digit a soroban column holds.
- **Cube-as-palace** ([rubiks-cube-palace](./rubiks-cube-palace.md)): the cube is *storage geometry* — 6 face-rooms × 8 shelves of loci for arbitrary material.

Same physical object, orthogonal roles: one is a numeral, the other is a building. The [rubiks-cube-palace](./rubiks-cube-palace.md) can even *host* deep-pack journeys — its cells are loci like any others — without the roles mixing.

## Failure modes

- **Flame/rose confusion** — the two +5 overlays land on the wrong slots and a digit shifts by 5 in the wrong place. Drill the discrimination in isolation; the seal usually catches the damage, but detection is not prevention.
- **Skipping the tier gate** — L3 leans on matrix-cell fluency; composing scenes from cells you still have to *reconstruct* is the [mnemonic-methods-master](./mnemonic-methods-master.md) tier-skipping failure verbatim. Cells must clear the matrix's own pass floors first.
- **Over-sealing** — checksum ceremony on every trivial number until the whole practice is abandoned. Respect the scope rule.
- **Cross-system cell interference** — matrix cells also serve [calendar-memory](./calendar-memory.md)'s minute slot; a phone number and a calendar scene both containing cell `47` can blur if stored in the *same* spatial context. Mitigation: deep-pack journeys are dedicated journeys, never shared with calendar or other cell consumers.
- **Action-vocabulary decay** — 4 base actions + flame are the only newly installed items, which makes them the least-rehearsed. Fold them into the L1 fusion grammar's daily use so they stay warm.

## METER pass-floors and promotion gate

Measurement per [METER](./meter-overview.md) convention:

| Skill | Pass-floor |
|---|---|
| Action ↔ digit (incl. flame discrimination vs rose) | <1s |
| L3 scene compose, live (cell + action + cell) | <8s |
| L3 scene decode → 5 digits | <3s |
| 10 digits one pass (2 scenes + seal) | <30s |
| Seal verify of a recalled 10-digit number | <15s |
| Erasure repair: recover one forgotten digit of a sealed locus (position known) | <20s |
| 24h recall of two 10-digit numbers (journey-placed, sealed) | ≥90% digits, and the seal flags any locus containing an error |
| Hex seal: nibble-sum mod 15 of a 4-byte locus (on the soroban hex overlay) | <20s |
| **L3W**: wielded-instrument vs cell-object discrimination | <1s |
| **L3W**: wide scene compose, live (6 digits) | <4s |
| **L3W sprint gate**: 40 digits, no seal | ≤60s at ≥95% |
| **L3W archival**: 12-digit locus + dual seal | <35s |

**Promotion gate (the falsifier)**: encode two 10-digit numbers with L3 + seals and two with [PAO](./person-action-object-system.md) + Major, same day, matched effort. Recall all four after 24 hours. L3 promotes from *candidate* — and the [mnemonic-methods-master](./mnemonic-methods-master.md) long-number router flips — only if it **beats or ties** PAO + Major on digit accuracy *and* the seals catch the errors they claim to catch. Until then PAO + Major remain the standing ruling. Log the result either way.

## Visual walkthrough

Step-by-step deep-pack pipeline on the worked example — number → digit string → chunks → `[cell][action][cell]` scenes → locus → seal → verify:

![Number Codec Ladder step-by-step](../diagrams/number-codec-ladder-steps.svg)

Editable source: `wiki/diagrams/number-codec-ladder-steps.excalidraw` (opens on excalidraw.com or in the Obsidian Excalidraw plugin).

## Mnemonic

**"Register, Scene, Tableau, Pack — and the Seal checks your back."** Climb the ladder by how long the number must live; stamp the seal when it matters.

## Memory checksum

- **4 levels** (L0–L3), each owning one latency band — if two levels claim the same band, the ladder has drifted.
- **5 digits per L3 scene** (2+1+2), **10 per locus** (two scenes + seal).
- **Two +5 overlays, never on the same slot**: rose marks actors/states, flame marks actions.
- **Seal remainder 0 is written as 9** — a seal always has a face percept.
- **Narrow pack: ~6 newly installed items**; everything else is reuse — the minimal-install point on the frontier. **Wide pack deliberately leaves that point** (user decision 2026-07-02: throughput over install economy); its own checksum is: wide action = narrow verb × wielded instrument, **instrument 0 = bare hands**, so the narrow pack is exactly the units-0 column of the wide matrix.

## Related pages

- [soroban-learning-method](./soroban-learning-method.md) — the substrate; §Cube Digit Faces owns L0/L1
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) — the L3 vocabulary (registered consumer of the full 100 cells)
- [PAO](./person-action-object-system.md) — the challenged incumbent; also the source of the role-grammar idea
- [mnemonic-methods-master](./mnemonic-methods-master.md) — tier discipline and the long-number router this page challenges
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — operator-icon discipline; the angel-exponent candidate lives in both pages
- [rubiks-cube-palace](./rubiks-cube-palace.md) — the *other* cube system (cube-as-palace); disambiguation above
- [REMAPS](./remaps.md) — scene binding moves
- [substrate-algorithm-composition](./substrate-algorithm-composition.md) — the pattern family this composition belongs to
- [observer-inside-method](./observer-inside-method.md) — experimental L3b die-corner codec
- [calendar-memory](./calendar-memory.md) — sibling consumer of the matrix cells; interference mitigation above

---

## U — See (CAST)
1. Four codecs on one substrate; seal as cross-cutting verifier
2. Edges: matrix cells feed L3; L2 snapshots L0; loci hold L2/L3

## D — Name (NEDF)
1. Number Codec Ladder = latency-banded number memory on the soroban substrate
2. Distinguisher: the only number system whose stored form computes and self-verifies
3. Failure mode: flame/rose overlay confusion; tier-skipping into L3

## F — Do (SPEAR)
1. Pick level by how long the number must live
2. ≥8 digits or high-stakes → stamp the seal
3. Recall → decode → digit-sum → compare seal

## B — Watch (HEART)
1. Sealing everything (ceremony creep)
2. L3 attempted before matrix cells are fluent

## L — Predict (ORACLE)
1. Seal mismatch on recall → a digit is wrong, locate before use
2. Candidate loses the 24h falsifier → PAO + Major ruling stands

## R — Act (GRACE)
1. Long number task → this ladder, not ad-hoc rehearsal
2. Falsifier result → update mnemonic-methods-master router accordingly
