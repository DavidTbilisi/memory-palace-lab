---
glyph: 🪝
palace: meta-knowledge
level: 6
domain: 10
room: TBD
para: resource
semantic_mode: 5
wiki_source: wiki/learning-systems/peg-system.md
---

# Peg System

**Summary**: The trunk method that this wiki's five peg sets are instances of — a fixed, pre-drilled set of ordered anchors installed *before* any material arrives, so encoding becomes a lookup into an existing structure instead of the construction of a new one. Its defining move is the inversion of effort: the expensive work is done once, in advance, on content-free anchors; at encode time only the binding remains. Sibling to [memory-palace](./memory-palace.md), and distinguished from it by **what carries the order** — a peg set carries order in its *index*, a palace carries it in a *route*.

**Sources**:
- `raw/Neural OS Book/Peg System.md` — the book chapter this page abstracts; supplies the structure-before-material framing, the automaticity requirement, and the Loci comparison
- [buzan-your-memory](./buzan-your-memory.md) — owner of the 12 principles; peg systems are identified there as running on Association (3), Order (10) and Number (7)
- [mnemonic-methods-master](./mnemonic-methods-master.md) §The Tier 2 Encoder Primitives — where Peg System is registered as a method ("ordered short lists with stable positions; memory palace seed")
- [soroban-learning-method](./soroban-learning-method.md) §Operation Pegs — where the principle is stated most plainly: *build the structure before the material arrives*
- The five instance pages listed in §Instances in this wiki, which supplied the shape of the abstraction rather than the reverse

**Last updated**: 2026-08-21 — page created to give the five existing peg sets a trunk; promoted from a ghost reference in [soroban-learning-method](./soroban-learning-method.md) and [georgian-animals](./georgian-animals.md); §Architecture fit records the validation pass (verdict **keep**).

---

## What a peg system is — structure before material

A peg is an anchor whose **identity is its position**. Peg 3 is not merely the third thing; it is a specific, permanent, concrete image that *means* three and nothing else. Install ten of them and you have a numbered rack. Material is then hung on the rack by binding one item to one peg, and retrieval is a lookup — "what is on peg 3?" — rather than a search.

The method's leverage comes from **when** the work happens. A peg set is drilled to reflex on content-free anchors, once, before there is anything to remember; from then on the per-item cost is a single binding. The source states the trade plainly: *"The peg is permanent. The new material is temporary"* — improvised imagery works for one-time memorization but demands fresh construction every time, and the peg set is what removes that recurring cost (source: raw/Neural OS Book/Peg System.md). This is why a peg set feels cheap in use and expensive to adopt, and why abandoning a half-drilled set is the characteristic way it fails: the cost has been paid and none of the benefit collected.

Three parts are present in every peg set, and a set missing any one of them is not yet a peg system:

1. **A fixed index** — the ordered slots (0–9, A–Z, 1–12, the six faces of a die). Fixed means never re-derived.
2. **A frozen image per slot** — one concrete percept per slot, chosen once and drilled to reflex. Freezing is what makes lookup faster than reconstruction.
3. **A binding rule** — how an item attaches to its peg. Most sets in this wiki bind through [remaps](./remaps.md) moves, which is what makes the resulting scene retrievable rather than merely present.

## Different from [memory-palace](./memory-palace.md) — index order vs route order

Both methods supply ordered anchors and are frequently used together. The source already marks the kinship and makes the first cut — *"both preserve order by creating stable structure. The difference is that pegs are usually symbolic or image-based anchors rather than locations in a route"* (source: raw/Neural OS Book/Peg System.md). This page sharpens that cut into the operational form: **the two differ in where the order lives.**

A palace carries order in a **route**. Locus 7 has no intrinsic meaning; it is simply the seventh place you reach by walking. Ask "what was seventh?" and you must walk to find out — the order is recovered by traversal, which is why palaces scale to long sequences and why they support insertion badly.

A peg set carries order in the **index**. Peg 7 means seven wherever you meet it, with no walk and no neighbours. Ask "what was seventh?" and you address it directly. That is why peg sets excel at short ordered lists and at **random access**, and why they run out at the size of their index — ten pegs hold ten things, and an eleventh needs a second set or a palace.

The practical consequence is the one [mnemonic-methods-master](./mnemonic-methods-master.md) already records: a peg set is a **palace seed**. Pegs give random access within a small numbered range; a palace gives unbounded length at sequential cost. Reach for the peg set when the list is short and the positions matter; reach for the palace when the list is long and the walk is cheap.

## Instances in this wiki — the five sets under this trunk

Each of these is a peg set in the sense above, and each owns its own index, image family and binding rule. This page owns none of their content; it names what they share.

| Instance | Index | Image family | Distinctive move |
|---|---|---|---|
| [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) | `00`–`99` | rhyme peg (audio, tens) × visual peg (units) | two peg sets multiplied into 100 single percepts at zero new-vocabulary cost |
| [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) | `00`–`99` | the matrix above, materialized | the binding rule made explicit — 100 scenes generated by [remaps](./remaps.md) moves |
| [dozenal-edge-peg](./dozenal-edge-peg.md) | the cube's 12 edges | self-describing addresses | the peg *computes* its own slot: `digit = 4·axis + position` |
| [braille-face-peg](./braille-face-peg.md) | the cube's 6 faces | one index, four skins | a built-in checksum — opposite faces sum to 7 |
| [onset-peg-alphabet](./onset-peg-alphabet.md) | recurring word-onsets | one frozen image per onset | a peg set over a *linguistic* index rather than a numeric one |

Two neighbours are peg-*adjacent* but are not peg sets. [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) is a **phonetic encoding**, not an index — it converts digits to sounds and so generates images on demand rather than storing a fixed one per slot; peg sets are commonly built *on top of* it. [PAO](./person-action-object-system.md) is a **slot grammar** for compressing three digits into one scene, and it composes with a peg set rather than replacing it.

## When a peg set is the wrong tool

- **The list is longer than the index.** Ten pegs hold ten items. Past that the set silently overwrites, and the failure looks like forgetting when it is really collision. Use a palace, or multiply two indices as [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) does.
- **The material is unordered.** Pegs pay for order. If position carries no information, the ordering work is wasted and a plain association or a [substitute-word-system](./substitute-word-system.md) bridge is cheaper.
- **The set is not yet drilled.** A half-installed peg set is slower than no peg set, because lookup falls back to reconstruction while still costing a decision — *"if you have to pause and 'try to remember your peg', the system is still fragile"* (source: raw/Neural OS Book/Peg System.md). The target is the automaticity of a native word, not recall-on-effort; the stage ladder for that is owned by [skill-progression-stages](./skill-progression-stages.md). Finish the install or do not start it.
- **The pegs were picked for looks.** An image chosen because it is vivid rather than permanent creates a fragile new memory rather than borrowing an existing one — the anchor-permanence rule owned by [bedrock](./bedrock.md). Vividness is not the selection criterion.

## Mnemonic

*The coat rack in the hallway.* It is screwed to the wall before anyone owns a coat — that is the whole trick. The hooks are numbered, they never move, and each is a different shape you would recognise blindfolded. Guests arrive and each hangs one coat on one hook. To fetch a coat you do not search the hallway and you do not retrace anyone's steps: you go to hook 3, because hook 3 is *where three lives*. Add an eleventh guest to a ten-hook rack and a coat hits the floor — which is the honest limit, not a flaw.

## Memory checksum

Recall is correct if all four close:

1. **Three parts, or it is not a peg set** — fixed index · frozen image per slot · binding rule. Name a set and name its three; a missing part is the diagnosis.
2. **The palace split runs one way** — order lives in the *index* for pegs, in the *route* for a palace. If you had to walk to answer "what was seventh?", you were using a palace.
3. **Five instances hang under this trunk** — the two matrix pages, the two cube pegs, the onset alphabet. Fewer than five means one has been forgotten; more means a new one was added and this table was not updated.
4. **Capacity equals index size** — a set holds exactly as many items as it has slots. If a claimed capacity exceeds the index, two indices are being multiplied, and you should be able to name both.

## Visual

Draw the trunk relation as a **pentagon**, per [representation-rules](./representation-rules.md) Rule 10 — five instances, five vertices, this page's 🪝 at the centre with a spoke to each. An empty vertex is then the checksum: a peg set that exists in the wiki but has not been hung here shows as a gap in the outline before any label is read.

Inside the centre node, the three parts sit as a **triangle** — index · image · binding — the count-shape at n=3, so the two cardinalities are legible at a glance and never merge into one blob.

The palace distinction is drawn as the one contrast that carries it: a numbered rack of hooks (all slots visible at once, arrows landing directly on any hook) beside a footpath through rooms (one arrow, threaded, no shortcuts). Random access versus traversal, in the geometry rather than in a caption.

## Measurement

This page mints **no new [METER](./meter-overview.md) namespace**. A peg set is measured through the instance that owns it — the drill ladders and promotion gates already defined on the five pages above, all of which cite [skill-progression-stages](./skill-progression-stages.md) for their stage counts. Adding a `peg::*` event stream here would make a trunk page pretend to be a framework; per the closed-spine rule this page is a **concept**, not a new encoder.

## Architecture fit — validated 2026-08-21, verdict **keep**

Run against the three architecture pages CLAUDE.md §Idea validation names, because a trunk page that merely renames what five other pages already say would be exactly the ceremony [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §The Main Constraint rejects.

**The five axes.** *Separation of concerns* — improves: this page owns one thing (what a peg set is) and no instance content; the five sets keep their indices, images and gates. *Composability* — neutral by design: no encoder is touched, no acronym minted, no event namespace opened (see §Measurement). *Retrieval clarity* — improves: five sets that were reachable only by name now have one roof, and the term resolves to an owner instead of to three partial descriptions. *Extensibility* — improves with one caveat: a sixth peg set extends the trunk without altering it, but the §Instances table is a maintained list that can drift, which is why §Memory checksum item 3 makes its length a checked invariant. *Cognitive overhead* — small net add: one more page in an already dense cluster, paid down by the [memory-palace](./memory-palace.md) distinguisher and the two deliberate exclusions.

**The guardrails hold.** §Domain Dialects guardrail 1 — *"No new top-level framework, no new acronym"* — is satisfied: this is a concept page, not a sibling of the encoder spine. It is correctly absent from [framework-comparison-matrix](./framework-comparison-matrix.md), which scopes to the six encoders plus [UMTF](./universal-mental-tagging-framework.md); [memory-palace](./memory-palace.md) is likewise not in that matrix, and this page is its sibling in kind. Against UMTF it opens no tag namespace and defines no sigil. It in fact *instantiates* one of UMTF's orthogonality rules rather than bending it — *"keep mappings stable after assignment"* is precisely the freezing requirement in this page's part 2.

**SOLID.** Leans hardest on **SRP** (one responsibility, instance content pushed down) and **DIP**: consumers now depend on this abstraction rather than each carrying its own account of the method. **OCP** holds for the concept and only partially for the instance table, as noted above.

**Pattern fit — Flyweight, not Composite.** [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §Flyweight covers *"reusable pattern libraries, tag vocabularies, and shared scene conventions… the same compact structure reused across many concrete cases"*, which is exactly a frozen peg image reused across unlimited bindings. **Composite is *not* the fit** despite the trunk-and-leaves shape: on that page Composite is reserved for *"complex topics that require multiple frameworks at once"* — composing encoders — and this page composes nothing. Naming it Composite would import the generic GoF sense over the wiki's registered one, which is the parallel-definition error in pattern clothing.

**The structural payoff** is Unlock ① on that page: the rule that a non-owner never redefines a registered term *is* program to an interface, not an implementation, and an owner-page link *is* GoF abstract coupling. Before this page, [mnemonic-methods-master](./mnemonic-methods-master.md) carried an inline description of a method with no owner behind it — implementation coupling by that reading. Registering the term and linking the row converts it to abstract coupling, which is the concrete architectural gain, over and above killing the ghost that surfaced it.

**Filed deliberately as non-actions**: no [framework-comparison-matrix](./framework-comparison-matrix.md) row (not an encoder), and no [composability-index](./composability-index.md) entry (this is a trunk, not an unlock-shaped composition between two frameworks).

## Related pages

- [memory-palace](./memory-palace.md) — the sibling ordered-anchor method; order in the route rather than the index, and the standard partner once a list outgrows a peg index
- [mnemonic-methods-master](./mnemonic-methods-master.md) — the registry that routes material to a method; registers Peg System as a Tier 2 encoder primitive
- [buzan-your-memory](./buzan-your-memory.md) — owner of the 12 principles; supplies the Association / Order / Number reading of what a peg set actually exploits
- [remaps](./remaps.md) — owner of the transformation moves most instances use as their binding rule
- [peg-audio-visual-matrix](./peg-audio-visual-matrix.md) · [peg-matrix-remaps-scenes](./peg-matrix-remaps-scenes.md) · [dozenal-edge-peg](./dozenal-edge-peg.md) · [braille-face-peg](./braille-face-peg.md) · [onset-peg-alphabet](./onset-peg-alphabet.md) — the five instances
- [soroban-learning-method](./soroban-learning-method.md) — states the principle at §Operation Pegs and applies it to move types rather than to digits
- [georgian-animals](./georgian-animals.md) — uses peg numbers as modifiers; an applied consumer of the method
- [calendar-reflex](./calendar-reflex.md) — runs on an existing peg set as substrate rather than defining its own
- [major-system-for-mathematical-notation](./major-system-for-mathematical-notation.md) — the phonetic encoding peg sets are often built on; an encoder, not an index
- [PAO](./person-action-object-system.md) — the slot grammar that composes with a peg set rather than replacing it
- [number-codec-ladder](./number-codec-ladder.md) — treats a peg set as one adopted layer among several for numeric material
- [representation-rules](./representation-rules.md) — owner of the count-shape rule the §Visual follows
- [skill-progression-stages](./skill-progression-stages.md) — owner of the drill and automaticity stage counts the instances cite
