---
palace: strategic-memory
level: 3
domain: 10
room: 22
wiki_source: wiki/learning-systems/speed-math-unifying-generator.md
---

# Speed-Math Unifying Generator — Base-Anchored Offset Arithmetic

**Summary**: A single algebraic identity — `(B+a)(B+b) = B·(B+a+b) + a·b` — is the deep generator behind the multiplication, squaring, and root methods of [Vedic](./vedic-speed-math.md), [Handley](./handley-speed-mathematics.md), and [Trachtenberg](./trachtenberg-system.md). Those three are *not* three systems to learn separately; they are one generator plus per-system deltas (which base `B`, which sign/scaling regime, whether the identity is pre-expanded into digit-walk rules). [Soroban](./soroban-learning-method.md) is deliberately **not** unified here: it runs on a different substrate (a visuospatial bead board), so it shares only one atom — the complement — by *link*, not by merge. This page is the compressed core; the per-system pages remain as delta sheets.

**Sources**: Synthesis across [vedic-speed-math](./vedic-speed-math.md), [handley-speed-mathematics](./handley-speed-mathematics.md), [trachtenberg-system](./trachtenberg-system.md) (+ [trachtenberg-addition](./trachtenberg-addition.md), [trachtenberg-squares-and-roots](./trachtenberg-squares-and-roots.md)), [soroban-learning-method](./soroban-learning-method.md), [vedic-digit-sum-check](./vedic-digit-sum-check.md). No new raw source — this is a cross-page compression produced by the batch-compression method (collect similar materials → align at surface/structural/deep levels → extract one generator → learn generator + deltas).

**Last updated**: 2026-07-22 — [squaring-reflexes](./squaring-reflexes.md) adds the opposite-offset (`a = −b`) row to the delta sheet, mirroring the equal-offset squaring case already listed

---

## The one generator

```
   (B + a)(B + b)  =  B·(B + a + b)  +  a·b
                      └── left part ──┘   └ right ┘
```

- `B` — a **convenient base**: a power of 10, a multiple of 10, or the number's own leading part. Choosing `B` close to the operands keeps `a` and `b` small.
- `a`, `b` — **signed offsets** of each operand from `B` (negative below the base, positive above).
- The left part is `B × (cross-sum)`; the right part is the product of the offsets, sized to the base's digit budget, with overflow carried left.

That is the whole core. Everything below is a delta on it.

## What every "system" actually is

| System | Delta from the generator |
|---|---|
| [Vedic](./vedic-speed-math.md) Base Method | `B` = power of 10; Cases 1–5 just enumerate the sign/scaling regimes of `a`, `b` (both below, both above, mixed, two bases, non-working base via Base Multiple). |
| [Handley](./handley-speed-mathematics.md) | the identity *verbatim* with friendlier vocabulary; his "Reference Number" **is** the Vedic Working Base (see [vedic-speed-math](./vedic-speed-math.md) for both terms). |
| [Trachtenberg](./trachtenberg-system.md) ×3–×12 | single-digit multiplier; the identity *pre-expanded* into per-digit, right-to-left digit-walk rules to bound working memory (no pen, no paper). |
| [Squaring](./trachtenberg-squares-and-roots.md) | the special case `a = b`: `(ab)² = [a²][2ab][b²]` is `(10a+b)² = 100a² + 20ab + b²`. |
| [squaring-reflexes](./squaring-reflexes.md) (**base-snap**) | the *other* symmetric case, `a = −b`: with `B = n`, the identity gives `(n+d)(n−d) = n² − d²`, i.e. `n² = (n+d)(n−d) + d²`. The two squaring routes are the equal-offset and opposite-offset specialisations of one line. |
| Square / cube roots | the **inverse** direction: group into base-`Bᵏ` blocks and peel one answer digit per block. |

Read the table as: *if you hold the generator, the only new information in each system is the contents of its right-hand cell.* That is the compression — the marginal cost of the next system is one row, not a new chapter.

## Regeneration test (5-Gates · Gate 5)

The claim "these collapse to one generator" is only true if you can **rebuild a specific case from the generator without consulting its page**. That is exactly Gate 5 of [5-gates-of-comprehension](./5-gates-of-comprehension.md) (REGENERATE). If you cannot regenerate it, you have not compressed it — you have merely filed it next to the others.

Worked proof that the generator regenerates a Vedic case:

<!-- TODO(human): pick ONE Vedic Base-Method case (e.g. Case 1, both operands below the working base — try 97 × 94) and show it falling straight out of (B+a)(B+b) = B(B+a+b) + ab. State B, a, b; compute the left part B(a+b)... and the right part a·b; show the carry/digit-budget step; land on the answer. ~4–8 lines. This is the load-bearing demonstration of the whole page. -->

If that derivation lands cleanly, Vedic Case 1 was never a separate fact — it is the generator with `B = 100` and two negative offsets.

## Why Soroban is not on this page

[Soroban](./soroban-learning-method.md) also "anchors to a base and works with the offset" (its friend-of-5 / friend-of-10 complements), so it is tempting to fold it in. Resist that.

The generator above is **symbolic** — it lives in [NEDF](./nedf-overview.md) / [SPEAR](./spear-overview.md) working memory (hold `B`, `a`, `b`; apply algebra). Soroban's generator is **complement-on-a-place-value-substrate** — it lives on a visuospatial/motoric bead board, [CAST](./cast-overview.md) territory. Soroban builds multiplication *on top of* bead addition; it never routes through `(B+a)(B+b)`. Forcing it onto this page would make a symbolic learner carry bead machinery they do not need.

So the cluster has **two generators**, sharing exactly one atom:

- **Generator A** (this page): base-anchored offset arithmetic — symbolic — Vedic, Handley, Trachtenberg.
- **Generator B**: complement-on-a-bead-substrate — visuospatial — Soroban (its own page).

The shared atom is `complement = Base − Number`: Vedic's *Complement* and Soroban's *Friend-of-10* are the same fact reached on two substrates. That relationship is a [BRIDGE](./bridge-load.md) link between the two pages, **not** a merge. The general rule this enforces: **merge within a substrate; link across substrates** — over-merging across a modality boundary is lossy compression. See [substrate-algorithm-composition](./substrate-algorithm-composition.md).

## The reflexes that stay standalone

Two items are derivable from Generator A yet earn their own cards, for different reasons:

- **Casting out nines / [digit-sum check](./vedic-digit-sum-check.md)** — kept because it is an orthogonal *verification*, not an operation. Trachtenberg, Vedic, and Handley all reuse it.
- **Ends-in-5 squaring** (`(n5)² = n·(n+1)|25`) — derivable from the `a = b` case, but cached as a 0-second reflex because it fires constantly. [squaring-reflexes](./squaring-reflexes.md) is the page that owns this card and its siblings.

Trachtenberg's per-digit ×3–×12 rules are *not* kept standalone: they collapse into Generator A (they are the identity pre-expanded for a no-pen constraint you do not have).

## Compression payoff

Read across the cluster, these pages present roughly **35 separately-memorized items** (Vedic's 5 cases + criss-cross + ~8 special cases + 2 division methods; Trachtenberg's 10 digit-rules + addition + squares + roots; Handley; Soroban's stages). After compression the load is:

**1 generator (A) · a 5-row delta sheet · 1 standalone generator (B, Soroban) · 1 cross-substrate complement link · 2 reflex cards.**

That is the point of batching similar materials and learning them at once: you pay the shared structure once, and each additional system costs a single row.

## Related pages

- [vedic-speed-math](./vedic-speed-math.md) · [handley-speed-mathematics](./handley-speed-mathematics.md) · [trachtenberg-system](./trachtenberg-system.md) — the delta sheets this page compresses
- [trachtenberg-addition](./trachtenberg-addition.md) — the one method in the cluster on a *different* generator (bounded running-sum, not base-offset)
- [soroban-learning-method](./soroban-learning-method.md) — Generator B; linked by the complement atom, not merged
- [5-gates-of-comprehension](./5-gates-of-comprehension.md) — the REGENERATE gate that validates the compression
- [bridge-load](./bridge-load.md) · [substrate-algorithm-composition](./substrate-algorithm-composition.md) — why the Soroban relationship is a link, not a merge
