---
palace: meta-knowledge
level: 8
domain: 10
room: 50
semantic_mode: 5
para: resource
wiki_source: wiki/learning-systems/singapore-math.md
---

# Singapore Math — CPA, the model method, and the fading rule

**Summary**: "Singapore Math" is not a brand of worksheet — it is four separable mechanics from Singapore's national primary curriculum (MOE, from 1982): **CPA** (Concrete → Pictorial → Abstract), the **model method** (bar diagrams), **number bonds**, and **mastery-over-spiral** sequencing, all organised around a pentagon framework with problem solving at the centre. Three of the four are things this wiki already does under other names. The fourth — **concreteness fading**, the scheduled *withdrawal* of the concrete and pictorial supports — was the piece the wiki lacked, and it is the piece with the strongest independent evidence (Fyfe, McNeil, Son & Goldstone 2014). It shipped on 2026-08-13 as [representation-rules](./representation-rules.md) **Rule 9**, together with the **Type A addressing / Type B scaffold** visual split that resolving it required. This page owns "Singapore Math", "CPA", "model method / bar model", "number bonds", and "concreteness fading" in this wiki, maps the transferable mechanics onto the existing stack, and carries the honesty boundary that keeps the country's PISA ranking *out* of the evidence chain.

**Sources**:
- Kho Tek Hong / Primary Mathematics Project, Curriculum Development Institute of Singapore — the model method was developed in the early 1980s and entered the national curriculum in **1983** ([Kho interview, FutureLearn](https://www.futurelearn.com/info/courses/asian-maths-teaching-methods/0/steps/38711); [CDIS](https://en.wikipedia.org/wiki/Curriculum_Development_Institute_of_Singapore))
- Singapore MOE **pentagon framework** (introduced early 1990s, structurally stable since): Concepts · Skills · Processes · Attitudes · Metacognition, with **Problem Solving** at the centre (Toh & Chua 2025, [*Problem posing in the Singapore mathematics classroom*](https://journals.sagepub.com/doi/10.1177/27527263251339205))
- Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). "Concreteness Fading in Mathematics and Science Instruction: a Systematic Review." *Educational Psychology Review*, 26(1), 9–25. ([Springer](https://link.springer.com/article/10.1007/s10648-014-9249-3) · [ERIC EJ1036777](https://eric.ed.gov/?id=EJ1036777))
- Kaminski, J. A., Sloutsky, V. M., & Heckler, A. F. (2008). "The Advantage of Abstract Examples in Learning Math." *Science*. ([DOI](https://www.science.org/doi/10.1126/science.1154659)) — **and its retraction-by-replication**: Trninic, D. et al. (2020). "The Disappearing 'Advantage of Abstract Examples in Learning Math'." *Cognitive Science*. ([Wiley](https://onlinelibrary.wiley.com/doi/10.1111/cogs.12851)); De Bock et al., replication and elaboration ([Semantic Scholar](https://www.semanticscholar.org/paper/752d9f3c6c0feb93911f22327ee02db6cbbbda41))
- Ng, S. F., & Lee, K. (2009). "The Model Method: Singapore Children's Tool for Representing and Solving Algebraic Word Problems." *Journal for Research in Mathematics Education*, 40(3). ([NCTM](https://pubs.nctm.org/view/journals/jrme/40/3/article-p282.xml) · [ERIC EJ838947](https://eric.ed.gov/?id=EJ838947))
- Education Endowment Foundation (2015), independent RCT evaluations of **Ark Mathematics Mastery** — the Singapore-derived approach transplanted to English schools ([primary](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/mathematics-mastery-primary) · [secondary](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/mathematics-mastery-secondary) · [overarching summary](https://files.eric.ed.gov/fulltext/ED581180.pdf))
- Bruner, J. (1966). *Toward a Theory of Instruction* — the enactive / iconic / symbolic triad CPA operationalises. *Needs verification against the primary text if CPA's lineage ever becomes load-bearing rather than background.*
- Conversation with David, 2026-08-13 — "I discovered Singapore method of learning math, I suppose it's much like the things we were discussing lately." The mapping in §Where it lands is the answer to that.

**Last updated**: 2026-08-13

---

## The four mechanics, separated

The brand bundles four things. They are independently adoptable, and they are *not* equally novel to this wiki.

| # | Mechanic | One-line | Already in the wiki as… |
|---|---|---|---|
| 1 | **CPA** | Concrete object → pictorial diagram → abstract symbol, as a required and **faded** sequence | Was half of it. Concrete-first is [representation-rules](./representation-rules.md) Rule 5; the fading half **was missing** and shipped 2026-08-13 as Rule 9 |
| 2 | **Model method** | A controlled visual grammar of ~4 bar forms that composes into word-problem solutions | Nothing owns it. Nearest neighbours: [representation-rules](./representation-rules.md), [symbolic-encoding-systems](./symbolic-encoding-systems.md) |
| 3 | **Number bonds** | Part–whole decomposition of small numbers, automatised so later arithmetic composes instead of recomputing | [chunking](./chunking.md) + [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) + [sticker-number-sense-curriculum](./sticker-number-sense-curriculum.md) |
| 4 | **Mastery, not spiral** | Few topics per year, each to fluency, no scheduled re-teaching later | The french-1000 encode/learn gates + [red-queen-knowledge-ladder](./red-queen-knowledge-ladder.md) |

Mechanic 1's *second half* is the only genuinely new thing here. Everything else is convergent rediscovery — which is itself worth logging, in the same spirit as [learning-sciences-validation](./learning-sciences-validation.md).

## CPA — the real claim is fading, not pictures

The common misreading of CPA is "use manipulatives, then use pictures, then use symbols." That reading makes CPA a synonym for dual coding, which the wiki already has covered.

The actual claim is stronger and more falsifiable: **the concrete and pictorial supports must be explicitly and gradually withdrawn**, and it is the *withdrawal* that produces transfer. Fyfe et al.'s 2014 systematic review names four theoretical benefits of the faded sequence — it lets learners interpret otherwise-opaque abstract symbols, grounds abstract thinking in embodied perceptual experience, builds memorable images, and *strips away extraneous concrete properties* (source: Fyfe et al. 2014). The last one is the whole argument. A concrete representation carries features that are true of the example but false of the concept; keeping it forever means the learner never separates the two.

The failure mode has a name in the Singapore literature itself. Ng & Lee (2009) document that the transition from bar drawings to letter-symbolic algebra begins at Primary Four, and that it is a genuine structural break rather than a smooth extension: arithmetic word problems give the parts and ask for the whole, while algebraic-type problems give the whole and ask for the parts (source: Ng & Lee 2009). The bar model that carried a child through P1–P3 is precisely the thing that has to be given up. A scaffold with no exit becomes a ceiling — the representational sibling of what [ok-plateau](./ok-plateau.md) describes at the reflex layer.

**This was where the wiki had a hole.** [representation-rules](./representation-rules.md) Rule 1 requires every concept page to lead with a drawing, and [visual-thinking-evidence](./visual-thinking-evidence.md) refines the requirement from a quota to a quality gate. Neither had a **retirement condition**. A wiki diagram, once drawn, lived forever, and nothing tested whether the operator could still recover the concept without it — [lifecycle-manager](./lifecycle-manager.md) retires *pages*, nothing retired *scaffolds*. Closed 2026-08-13 by Rule 9 (below).

### Adopted — [representation-rules](./representation-rules.md) Rule 9

**Validated 2026-08-13 via `/validate-idea`: keep with modification.** The rule shipped as [representation-rules](./representation-rules.md) **Rule 9**:

> Every **Type B scaffold visual** declares the state at which the concept should be recoverable with the diagram covered. A scaffold with no declared exit is not a scaffold, it is a ceiling.

Three modifications the gate imposed, each worth carrying:

1. **Scope.** Not "every load-bearing visual" — the unrestricted form violates **ISP** (*"users should not be forced to use more framework than the task needs"*, [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §I) by forcing fading ceremony onto visuals that must never fade. It applies only to Type B.
2. **The collision was a type confusion, and resolving it is the real unlock.** [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) §C.4 and CPA are not in conflict; they govern **different objects**. An **addressing visual** (Type A) *is* the retrieval handle — fading it destroys the address. A **scaffold visual** (Type B) is a medium you reason *inside* — keeping it is the ceiling. [representation-rules](./representation-rules.md) Rule 1 had governed both undifferentiated since 2026-05-07; the split is now stated there, and registered as a confirmed unlock in [composability-index](./composability-index.md). The two tests turn out orthogonal, not competing: Rule 1 tests picture-*sufficiency* (hide the text), Rule 9 tests picture-*independence* (hide the picture).
3. **No new review surface.** The checksum runs as a conditional Type-B probe inside [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) §Stage R's existing interval falsifier, not as a standalone pass — a separate apparatus would be the ceremony §The Main Constraint rejects.

The gate also surfaced that **this is not new theory**: the mechanism is the **[expertise-reversal effect](./problem-solving-maturity-levels.md)** (Kalyuga, Ayres, Chandler & Sweller 2003+), already registered in [glossary](./glossary.md) and applied across the wiki's *drill* layer — but never to representations. It was the one Cognitive Load Theory effect on [representation-rules](./representation-rules.md)' own CLT table with no rule implementing it. Concreteness fading is its mathematics-instruction instance; Rule 9 is the general implementation.

## The model method — a controlled visual grammar

The bar model is not "draw a picture of the problem." It is a small, closed vocabulary of forms that compose, which is exactly what makes it teachable, checkable, and fast:

```
part–whole          ┌──────── 12 ────────┐
                    ├────5────┬─────?────┤

comparison          A  ├────8────┤
                    B  ├────8────┼──3──┤        B = A + 3

change              before ├──────7──────┤
(before / after)    after  ├──────7──────┼──4──┤

ratio / units       ├─u─┼─u─┼─u─┤   3 units = 18  →  1 unit = 6
                    ├─u─┼─u─┤       2 units = 12
```

Four forms, one drawing convention (equal-width units, aligned left edges, the unknown marked `?`), and they nest. That is a **glyph grammar** in this wiki's sense — the same design as code-glyph-grammar and the driving-sign grammar, applied to quantity relations.

Two consequences worth taking:

1. **It confirms the note-representations design.** A small fixed set of typed diagram schemas beats freeform illustration, because a typed schema can be *drawn wrong* and therefore *checked*. Freeform illustration cannot be graded.
2. **It names a gap in the rep set.** The current canvas representations (graph / flow / matrix / palace / scene) contain no **quantity / part–whole** representation. Every one of them encodes relations between *entities*; none encodes relations between *amounts*. The bar model is the missing sixth, and it is cheap — four forms, drawable in seconds, exact.

That second point is why this passes the [CAST](./cast-overview.md) mission criterion rather than failing it: a bar model is drawable in-head under live time pressure and admits no System-2 assembly step. It is a fast encode, not a slow one.

## Number bonds — the automaticity substrate

7 stored as {3,4} and {5,2} and {6,1}, retrieved rather than computed, so that later arithmetic is *composition* over known parts. This is structurally the same bet as [callan-method](./callan-method.md)'s: an answer window too short for System-2 assembly, applied to arithmetic facts instead of sentences. It is also, near-exactly, [sticker-number-sense-curriculum](./sticker-number-sense-curriculum.md)'s first ladder rung — pairs summing to 10, then trios summing to 10 — reached independently by Sticker in 1945 and by the Singapore curriculum forty years later.

Nothing new to adopt here. Log it as convergence, and note that Singapore reaches automaticity by *curriculum sequencing* while the wiki reaches it by *drill ladders and SR* ([spaced-repetition](./spaced-repetition.md), [active-recall](./active-recall.md)); the wiki's route is the better one for an adult self-learner, because it does not require a teacher to control the ordering.

## Mastery, not spiral

The US-typical spiral curriculum revisits every topic every year at increasing depth, on the assumption that partial mastery is acceptable because it will come around again. Singapore's sequencing is the opposite: fewer topics per year, each taken to fluency, and no scheduled re-teaching — the next year *assumes* it.

This is the french-1000 gate model, in a different domain: batches stay suspended until the previous batch is genuinely open, and the pipeline refuses to widen before it deepens. It is also the operational meaning of "no scheduled re-teaching" — which only works if something else guarantees retention. In a school that something is homework and the next year's assumption; in this wiki it is [spaced-repetition](./spaced-repetition.md) and, at the far end, [bedrock](./bedrock.md). **Mastery-without-spiral is only safe when a retention mechanism is doing the work the spiral used to do.** Adopting the sequencing without the retention layer is the predictable way to break it.

## Systematic variation

Singapore textbooks vary one dimension at a time across a problem set so the invariant becomes visible — the same problem structure with the surface swapped, or the same surface with one structural feature changed. The theoretical home is variation theory (Marton) and the Chinese *bianshi* teaching tradition. *Needs verification* — the attribution of Singapore's textbook variation specifically to Marton rather than to *bianshi* is contested in the literature and this page should not be cited for it.

The wiki-side neighbour is [interleaving](./interleaving.md), and they are **not the same thing**: interleaving mixes problem *types* to train discrimination; systematic variation holds the type fixed and varies one feature to make the invariant visible. Different mechanisms, different failure modes. Worth a page of its own if it ever earns one.

## Where it lands

Answering the question that generated this page — *is this like the things we've been discussing?*

- **Yes**, on representation: the model method is the strongest external confirmation the wiki has for typed, closed visual grammars over freeform illustration.
- **Yes**, on automaticity: number bonds and [callan-method](./callan-method.md) share one mechanism, expressed in arithmetic and in speech.
- **Yes**, on gating: mastery-over-spiral is the french-1000 encode/learn lifecycle in curriculum form.
- **No**, on one axis, and this is the useful part: nothing in the wiki withdraws a scaffold on a schedule. CPA does, and that is where its evidence lives.

**Does the method transfer to other subjects?** (David, 2026-08-13.) Three of the four mechanics do; the bar model does not, because it is arithmetic-specific — what transfers is its *design*, a closed set of typed forms, which the wiki already owns as glyph-grammar-pattern. The fading principle transfers furthest, but in procedural domains such as algorithms and proof the object withdrawn is not a picture: it is *how much of the solution is supplied*. That form has its own name and its own evidence base — see [faded-worked-examples](./faded-worked-examples.md), which is this page's solution-axis sibling and carries the transfer answer in full. The boundary is vocabulary: French, Georgian, and any word list have no abstract layer to fade *to*, the mnemonic there is the address rather than a scaffold, and CPA should not be retrofitted onto them.

## The honesty boundary

Do **not** put Singapore's PISA and TIMSS results into the evidence chain for CPA. The country's ranking is confounded by ability tracking, a large private tuition culture, teacher selection and training, and system homogeneity — none of which transplant with the textbook. The wiki has done this before with the "visual learner" myth ([visual-thinking-evidence](./visual-thinking-evidence.md)): a true claim sitting one inch from a dead one, and the fix is to cite the mechanism's own studies rather than the headline.

What the transplant evidence actually shows: the EEF's independent RCTs of Ark Mathematics Mastery in English schools found **+2 months' additional progress at primary** (5,108 pupils, 90 schools, security 3/5) and **+1 month at secondary** (7,712 pupils, 40 schools, security 4/5) (source: EEF 2015). Real, positive, small. That is the honest size of "adopt Singapore's approach wholesale."

The concreteness-fading literature is the load-bearing citation, and it carries its own caution. Kaminski, Sloutsky & Heckler's 2008 *Science* paper — the usual citation for "abstract beats concrete" — did not survive replication: De Bock et al. and Trninic et al. (2020) showed the abstract advantage disappears once the concrete condition uses well-designed rather than suboptimal examples (source: Trninic et al. 2020). So the defensible claim is **not** "abstract wins" and **not** "concrete wins." It is the sequence-with-withdrawal claim, and only that.

**Mnemonic**: *the ladder you climb, you kick away.* C-P-A is the climb; the kick is the part everyone forgets.

**Checksum** (24h, from the page name alone): name the four mechanics ≤10s · state which one the wiki lacks and why ≤10s · draw the four bar forms unaided ≤30s · name the reason PISA rank is inadmissible ≤5s. Failing axis 2 means the page was read as "Singapore uses pictures," which is the misreading it exists to prevent.

## METER

One measure, per [METER](./meter-overview.md) event conventions, live since Rule 9 was adopted:

- `repr.scaffold_independent` — on review of a page carrying a **Type B scaffold visual**, self-scored: did the concept's structure come back **with the diagram covered**? Scoring low here while the [OSNF](./once-seen-never-forget-protocol.md) image-axis scores high is the scaffold-dependence signature — the diagram is doing work the concept should be doing. **Floor**: ≥3 consecutive failing cycles routes to *re-encode*, not more review. Fires alongside `osnf::checkpoint` (see [once-seen-never-forget-protocol](./once-seen-never-forget-protocol.md) §Stage R). *(Renamed from the draft `repr.fade.recover` at validation — METER events name the measured quantity, not the mechanism.)*
- **Dead-letter clause on the rule itself — satisfied 2026-08-13**, four weeks early. The clause was: no Type B visuals declared by 2026-09-10 → drop Rule 9 rather than keep it as decoration. First declared population is the 12 diagrams of algorithm-pattern-nedf-deck, each with its own fading condition. Recorded, not re-armed.

## Related pages

- [faded-worked-examples](./faded-worked-examples.md) — the solution-axis sibling: same mechanism, procedural domains, its own evidence base
- [representation-rules](./representation-rules.md) — the rule set the fading condition would extend
- [visual-thinking-evidence](./visual-thinking-evidence.md) — the evidence layer under the visual rules, and the model for this page's honesty boundary
- [callan-method](./callan-method.md) — the same too-short-window mechanism, in speech
- [sticker-number-sense-curriculum](./sticker-number-sense-curriculum.md) — number bonds, reached independently in 1945
- [learning-sciences-validation](./learning-sciences-validation.md) — the convergence argument this page adds a row to
- ibl-pedagogy — the other externally-sourced math pedagogy page
- [interleaving](./interleaving.md) — the near-neighbour systematic variation is *not*
- [ok-plateau](./ok-plateau.md) — the reflex-layer twin of scaffold dependence
