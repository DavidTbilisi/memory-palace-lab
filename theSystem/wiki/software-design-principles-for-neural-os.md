---
palace: meta-knowledge
level: 7
domain: 10
room: 3
absorbing: true
semantic_mode: 5
wiki_source: wiki/meta-wiki/software-design-principles-for-neural-os.md
---

# Software Design Principles for Neural OS

**Summary**: A synthesis page that maps selected software architecture principles, especially `SOLID` and a small set of design patterns, onto the Neural OS framework family: [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), and [UMTF](./universal-mental-tagging-framework.md).

**Sources**:
- FRAMEWORK_OVERVIEW.md
- CAST Maturity Levels.md
- CAST and Georgian Node System.md
- HEART_OVERVIEW.md
- PEOPLE_PALACE_STRUCTURE.md
- 03_NEDF_TEMPLATE.md
- 05_SPEAR_TEMPLATE.md
- universal-mental-tagging-framework.md
- umtf-operational-template.md
- framework-comparison-matrix.md
- `Clippings/GOF-articulo.pdf` — Gamma, Helm, Johnson & Vlissides, *Design Patterns* (1994), via gof-design-patterns and design-pattern-intuition
- `Clippings/the-pragmatic-programmer.pdf` — Hunt & Thomas, *The Pragmatic Programmer* (1999), via pragmatic-programmer, dry-principle, orthogonality-principle

**Last updated**: 2026-09-05 (**§GoF Template Method adopted** — the spine-and-dialect contract, which had named only its selector. The pattern's abstract-vs-hook requirement immediately caught four sources drifting on *what a dialect supplies*, including the only implemented family conforming to none of them; resolved by ruling the content slots **hooks** and the three guardrails the abstract operations); 2026-09-05 (**§GoF Bridge adopted** — the render-lens × generator axis; the pattern's invariant *implementor-specific values do not live in lens slots* immediately catches CLAMP §A's gpt-image-2 pixel table. Registered qualified because the bare word is taken twice); 2026-09-05 (§The roster audit — GoF's 23 patterns filed against this page's 10, as the second instance of the [composability-index](./composability-index.md) audit method; coverage is 10-or-11 of 23 because the **Factory** heading collapses two GoF names, and three unclaimed patterns already run unnamed — Decorator *already flagged*, **Bridge** and **Template Method** new. All flagged, not adopted); 2026-09-04 (§Registries shard on their own retrieval axis gained a second worked instance — its first use as a *filter*, plus the falsifiable pre-build test: try filing the registry's existing entries under the proposed axis); 2026-09-03 (§Singleton gained its first worked instance — CAST-universalism rejected via `/validate-idea`; §L named as the deciding principle); 2026-08-07 (§Registries shard on their own retrieval axis added — the DRY+orthogonality corollary behind the log-views split); 2026-07-19 (Test-Pyramid Convergence / process-over-outcome section added — Unlock ③); 2026-06-09

---

## What This Page Is

This page is a **design synthesis**, not a claim that the source materials explicitly teach software architecture. The move here is to use software design principles as heuristics for making Neural OS more modular, extensible, and internally coherent. Framework-specific mappings are grounded in the current structure of the system. (source: FRAMEWORK_OVERVIEW.md; CAST and Georgian Node System.md; HEART_OVERVIEW.md; framework-comparison-matrix.md)

The practical question is:

> Can Neural OS frameworks be designed the way good software systems are designed?

The answer is yes, but selectively. The goal is not to force object-oriented dogma onto cognition. The goal is to borrow the parts that improve clarity, composability, and maintenance. This framing is a synthesis proposal. (source: FRAMEWORK_OVERVIEW.md; framework-comparison-matrix.md)

## The Main Constraint

Software principles should be used only when they improve:

- retrieval reliability
- separation of concerns
- extensibility
- testability
- reduction of collision and confusion

If a principle adds ceremony without improving cognition, it should be rejected. This rule is consistent with the broader system's emphasis on compression, vividness, and functional clarity. (source: FRAMEWORK_OVERVIEW.md; CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md)

## SOLID Mapped to Neural OS

### S — Single Responsibility Principle

Each framework should do one main job well:

- [NEDF](./nedf-overview.md) = concept encoding
- [CAST](./cast-overview.md) = relationship/system encoding
- [SPEAR](./spear-overview.md) = procedure encoding
- [HEART](./heart-overview.md) = people modeling
- [UMTF](./universal-mental-tagging-framework.md) = shared tag language

This mapping already exists implicitly in the framework family and should be preserved. When a framework starts trying to solve every problem type, clarity degrades. (source: FRAMEWORK_OVERVIEW.md; framework-comparison-matrix.md)

### O — Open/Closed Principle

The system should be open to extension but closed to constant redesign of core frameworks.

Good extension examples:

- domain-specific CAST variants
- domain-specific SPEAR examples
- new HEART pattern libraries
- specialized UMTF presets for codebases, math, history, or people

The core framework roles should remain stable while their applications expand. (source: FRAMEWORK_OVERVIEW.md; CAST and Georgian Node System.md; HEART_OVERVIEW.md)

### L — Liskov Substitution Principle

In Neural OS terms, a lighter or alternate method should replace a heavier one only if it preserves the same functional outcome.

Examples:

- a simple Tier 1 relation scene can substitute for full CAST only if it still distinguishes the edge correctly
- Phase 1 HEART can substitute for Phase 2 only if the task requires quick prediction rather than deep treatment
- a lightweight concept cue can substitute for full NEDF only if the concept remains discriminable and usable

This is less about inheritance and more about preserving retrieval guarantees when simplifying. This application is a synthesis heuristic. (source: CAST and Georgian Node System.md; HEART_OVERVIEW.md; 03_NEDF_TEMPLATE.md)

### I — Interface Segregation Principle

Users should not be forced to use more framework than the task needs.

This is already aligned with:

- the decision tree in the framework overview
- the distinction between concept, relation, procedure, and person
- the UMTF rule not to tag everything with everything

Minimal interfaces in Neural OS mean: minimal required slots, minimal required tag layers, and minimal required review burden. (source: FRAMEWORK_OVERVIEW.md; umtf-operational-template.md)

### D — Dependency Inversion Principle

High-level workflow should depend on abstract problem types, not on one concrete framework.

The right abstraction layer is:

- thing
- relation
- procedure
- person
- mixed topic

Then the system selects `NEDF`, `CAST`, `SPEAR`, `HEART`, or a combination. That means the overall architecture depends on problem categories first, framework implementations second. (source: FRAMEWORK_OVERVIEW.md; framework-comparison-matrix.md)

## Domain Dialects: the spine-and-dialect extension contract

There is no single explanation that fits every domain. Some structure is invariant across domains, but the highest-leverage explanatory language is **domain-specific** — it bakes in the primitives, templates, and failure modes that only make sense inside one domain. This is not a new principle; it is **O — Open/Closed read from the explanation-tooling direction**, with **D — Dependency Inversion** underneath. The empirical floor is [factual-knowledge-precedes-skill](./factual-knowledge-precedes-skill.md): Willingham's result that "thinking skills do not exist independently of the domain in which they are applied" — a fully general explainer cannot exploit the domain schema that makes reasoning cheap, so it caps out. (source: factual-knowledge-precedes-skill.md; this page §O, §D)

The resolution is a **layered split**, not a choice between general and specific:

- **General spine (closed).** The invariant core every domain shares — the [UMTF](./universal-mental-tagging-framework.md) seven tag families and the encoder spine ([NEDF](./nedf-overview.md) · [CAST](./cast-overview.md) · [SPEAR](./spear-overview.md) · [HEART](./heart-overview.md) · [ORACLE](./oracle-overview.md) · [GRACE](./grace-overview.md)). This stays stable; domains do not redefine it.
- **Domain dialects (open).** Per-domain extensions that *add* domain primitives, sigils, and templates — what §O already calls "specialized UMTF presets for codebases, math, history, or people." A cybersecurity dialect adds attack-tree / CIA primitives; a networking dialect adds layered-stack / packet-walk primitives. The spine is reused unchanged; the dialect supplies what the spine cannot know.

Three registered patterns implement the split: **Strategy** selects the dialect for the domain at hand (the same selection logic as encoder choice), **Flyweight** is the shared spine vocabulary reused across every dialect, and **§GoF Template Method** (adopted 2026-09-05) governs what a dialect may change once selected — the spine is the skeleton, the dialect fills hooks, and guardrail 2 below is the skeleton-not-overridable constraint. The **content slots are hooks, not requirements**: a dialect may fill any of primitives, sigils, templates, failure-modes or aesthetic framing and leave the rest empty. What every dialect must satisfy is the three guardrails, and only those. Maximum leverage sits at neither pole — pure generality has no domain traction, pure specificity rebuilds the spine every time. It sits in the composition, which is the same lesson tools-over-intelligence §Primitives-not-products teaches: stock composable atoms (the spine) and fossilize per-domain tools (the dialects) on top of them.

### The legitimacy contract (three guardrails)

A dialect that ignores these turns the bottom two architecture axes — cognitive overhead and retrieval clarity — negative. They are the cost of the extension point:

1. **No new top-level framework, no new acronym.** A dialect is a preset hanging off the spine, not a sibling of NEDF/CAST/…. Minting a new code is the ceremony the §The Main Constraint rule rejects, and risks a [glossary](./glossary.md) collision.
2. **Orthogonality lock.** A dialect may add domain primitives but must never re-map an existing spine tag's meaning — the [UMTF](./universal-mental-tagging-framework.md) orthogonality rule. The spine stays closed; dialects only extend.
3. **Registration requirement.** Every dialect gets a [glossary](./glossary.md) / index entry. An unregistered dialect is the retrieval-clarity failure mode: a tool nobody can locate, which tools-over-intelligence notes is worse than no tool.

### Application: one /explain spine, many dialects

The `/explain` skill currently aims for one universal visual style across all domains, which is why its output is general but never maximally sharp for any one domain. Under this contract it keeps **one** general visual spine and selects a per-domain **explanation grammar** via Strategy — it is *not* forked per domain (that would violate DRY and re-open the spine). The dialect supplies the domain's load-bearing primitives; the spine supplies everything invariant.

### METER fit

A dialect must earn its keep or it becomes sprawl. Candidate event `explain.dialect_used` fires whenever a dialect is invoked; proposed **reuse floor**: a domain dialect not reused ≥3 times within ~4 weeks demotes (the same disposable-tier logic [UMTF](./universal-mental-tagging-framework.md) §Priority value classes applies to speculative cards). Without the floor, guardrail #1 has no teeth — dialects accumulate faster than they are used. *(Floor value is a default; tune against real /explain usage.)*

## The Two GoF Generative Principles — and a wiki self-application

Underneath SOLID sit the two principles the Gang of Four state explicitly, owned by design-pattern-intuition: *program to an interface, not an implementation* and *favor object composition over class inheritance*. They are listed here because the first one turns out to describe **the wiki's own governance**, not just software.

**Unlock ① (convergence).** The CLAUDE.md §Consistency rule that a non-owner page must never redefine a registered term — it links to the owner instead — *is* "program to an interface, not an implementation" applied to prose. A page depends on the [glossary](./glossary.md)'s **interface** (term name + owner pointer), never on another page's **implementation** (its full definition). The GoF even define **abstract coupling** ("class A maintains a reference to abstract class B") — which is precisely what an owner-page link is. So a parallel definition is "implementation coupling between pages," and the fix is "abstract-couple via the glossary." The wiki derived this rule empirically; GoF derived it for OO design in 1994 — independent re-derivation is evidence the rule is real, not arbitrary. Registered in [composability-index](./composability-index.md). *Failure mode:* over-literalizing — citing the principle to justify under-linking until pages can't be read without round-trips. (source: GOF-articulo.pdf p.18; CLAUDE.md §Consistency rules)

The second principle ("favor composition over inheritance") is already visible in the system's preference for **composing** frameworks (Composite/Adapter below) over building god-pages that inherit every concern — the SRP discipline above is its structural twin.

## The Two Pragmatic Principles — DRY and Orthogonality, the layer beneath SOLID

Beneath SOLID and the GoF principles sit the two principles Hunt & Thomas put first in The Pragmatic Programmer: DRY and orthogonality. They are the most general of the design rules this page collects, and — like the GoF principle above — both describe the **wiki itself**, not just software.

**DRY — one authoritative representation.** DRY ("every piece of knowledge must have a single, unambiguous, authoritative representation within a system") is the *general parent* of the GoF "program to an interface" unlock above. Program-to-interface is DRY for *behavioral contracts*; the [glossary](./glossary.md)'s `no-parallel-definitions` rule is DRY for *definitions*. Strikingly, the book recommends both DRY (Tip 11) and a single project glossary (Tip 54) — the wiki has built both, and they are one mechanism. Registered as a re-parented convergence unlock in [composability-index](./composability-index.md). (source: the-pragmatic-programmer.pdf, p.27)

**Orthogonality — eliminate effects between unrelated things.** Orthogonality is the design bet underneath the four-axis `palace × level × domain × para` addressing (para-method): changing one axis should not ripple into the others. The book even supplies the self-test — the measurable `cross_axis_ripple_count` (when one axis is re-tagged, how many *unrelated* pages had to change? target 0). (source: the-pragmatic-programmer.pdf, p.35)

Where SRP asks "does this page do one job?", DRY asks "is this knowledge stated exactly once?" and orthogonality asks "can I change this without breaking unrelated things?" The three are the foundational filter beneath the SOLID and GoF layers.

### Registries shard on their own retrieval axis

An operational corollary of DRY + orthogonality, recorded from the 2026-08-07 "modularize the project" pass (`/validate-idea` → keep-with-modification): when a shared registry grows past readability, **partition it along the axis its readers actually query — and derive, rather than hand-maintain, any views along other axes.** The registry keeps exactly one authoritative copy (DRY), and each shard answers one retrieval question without rippling into the others (orthogonality). The worked instances: `wiki/index.md` shards by **topic** (13 per-area files — its query is "where does topic X live?"); `wiki/log.md` shards by **time** (quarterly rotation — its query is "what happened, when?"), with per-area **derived** views in `wiki/_meta/.log-views/` (`tools/log_views.py`, regenerated at pre-commit) because log entries are cross-module by design — mean 1.8 areas per entry on the real corpus — so a hand-split by topic would force either duplicating entries or fragmenting one operation's record; the glossary remains the unsharded monolith and the open candidate. The anti-pattern this rule names: sharding a registry on a *foreign* axis — it looks modular, but every write then requires a classification decision and every cross-axis entry needs a single home it doesn't have. (source: strategy conversation 2026-08-07, validated via `/validate-idea`)

**Second worked instance — the corollary used as a filter (2026-09-04).** Its first use was constructive: split a registry that had outgrown readability. Its second was a rejection. A `/validate-idea` proposal re-filed CAST's three additive edge modifiers ([edge-sign](./edge-sign.md) · [encoding-quantities-in-cast](./encoding-quantities-in-cast.md) · [delay-encoding-in-cast](./delay-encoding-in-cast.md)) onto a nine-rung *depth* ladder. That registry's real retrieval axis is **which position on the edge does this mark** — stream body, air time, target end — and depth is foreign to it. The anti-pattern's prediction held exactly: none of the three modifiers has a single rung (sign's mechanism and payoff sit at different depths, quantity rides *inside* the rung meant to contain it, delay is defined by not being the **T** slot), which is "every cross-axis entry needs a single home it doesn't have" in its purest form. **The operational upgrade: this corollary is falsifiable before anything is built — take the registry's existing entries and try to file them under the proposed axis. Entries landing in more than one place mean the axis is foreign.** Verdict recorded at [nodes-and-edges](./nodes-and-edges.md) §Modifier composition and [cast-overview](./cast-overview.md) §Adjacent but excluded.

## The Test-Pyramid Convergence — process base, thin outcome apex

Above SOLID sits a third "software concept → wiki self-application" convergence, in the same family as the GoF *program-to-interface* unlock (① above) and its DRY parent: the **test pyramid**.

**Unlock ③ (convergence).** The testing pyramid says a healthy suite is a *broad base of fast, automated unit tests* and a *thin apex of slow end-to-end tests* — you buy correctness cheaply by verifying each unit in isolation, so the expensive whole-system check can stay small. Read as a governance principle for any goal-directed system, that *is* **optimize (and automate) the controllable process; keep only a thin check on the outcome.** The lagging outcome ("did I win?") is the e2e test — expensive, slow, and mostly redundant *if* the leading-indicator process (the units) is measured and automatic. Concentrating effort on the process the operator controls *now*, rather than on the distant result, is where the probability of the result actually moves. The wiki already runs this: [METER](./meter-overview.md) logs frequent **process events** (leading indicators) and only periodic **outcome reports** (lagging); genius-compass audits process signals (Energy-delta, stage-trajectory) *weekly* instead of the outcome *annually*; a BRICK automates a process so the result follows regardless of operator. (source: strategy conversation 2026-07-19, validated via `/validate-idea`)

**The load-bearing correction: thin, not zero.** "Perfect units → e2e doesn't matter" is only true *when the units compose correctly*. The classic failure is 100% unit coverage with a broken integration seam — every unit green, the contract between them wrong. Its exact analog is a beautifully automated process optimizing the *wrong* leading indicator: flawless execution, no win. So the apex goes **thin, never to zero** — a small, periodic outcome check whose only job is to catch when the process has drifted from the goal. That thin apex already has a name here: the **falsifier / METER pass-floor**. Dropping it entirely is the same over-literalizing mistake the ① and DRY unlocks warn about (using the principle to justify *under*-checking), inverted onto outcomes.

**The base unit: measure the slope, not the position — and sample it *now*.** For a person, the leading indicator is not a stored state but a *rate* — **effectiveness-now**, the instantaneous slope of progress `d(progress)/dt` sampled at `t = now`. The win is its integral (`∫ effectiveness dt`) — *position*, readable only at the finish, which is why "let's wait and see" attends to the one quantity you cannot act on. You cannot steer position, only slope: at any instant the outcome is already fixed by the integral of past slopes, so the present slope is the sole available lever. This is the finest layer of the temporal substrate stack — 1s slope → session Δ ([PULSE](./pulse-overview.md)) → weekly genius-compass trajectory → the integral (the win) — and the only layer that is a *rate* rather than a *level*; each coarser layer is the running integral of the finer. Two guards keep the slope honest: a **window > 0** (a true single-instant read is noise; "1s" means finest *actionable* grain, not a point sample), and **direction, not just magnitude** — a steep slope up the *wrong* hill is the broken-seam failure in derivative form, which is exactly what the thin outcome apex checks (the slope asks *am I moving fast?*; the apex asks *toward the right summit?*).

**The ratio, as a METER floor.** Give the principle teeth with a falsifiable rule: a roadmap's automated **process-measurement** events should dominate; its **outcome-checks** should be thin but present. Candidate event pairing — `process.leading_indicator_logged` (base, frequent, automated) vs `outcome.check` (apex, periodic, seam-verifying); the person-grain base event is `effectiveness.slope_sample {value, activity, ts}` (an experience-sampling *am-I-effective-right-now?* ping), whose running integral is the Compass's weekly trajectory. If outcome-checking exceeds process-measurement, the roadmap is *outcome-anxious* and refactors toward process. The built weekly instance is genius-compass (Energy-delta + trajectory = the broad process base; Strategic Leverage + threshold-breach checks = the thin outcome apex); registered in [composability-index](./composability-index.md). Per §The Main Constraint this earns **no new acronym** — it is a lens, not a framework.

## Best-Fit Design Patterns

Not all software design patterns belong in Neural OS. These are the best fits.

### Strategy

Pick the encoding strategy based on the problem:

- concept → [NEDF](./nedf-overview.md)
- relation/system → [CAST](./cast-overview.md)
- procedure → [SPEAR](./spear-overview.md)
- person → [HEART](./heart-overview.md)

This is the clearest pattern already present in the system. (source: FRAMEWORK_OVERVIEW.md; framework-comparison-matrix.md)

### Composite

Complex topics often require multiple frameworks at once.

Examples:

- an algorithm can need `NEDF` for the core idea and `SPEAR` for execution
- a system can need `CAST` for structure and `NEDF` for important nodes
- a person model can use `HEART` plus `NEDF` for formative events

This is how the unified template logic already behaves. (source: FRAMEWORK_OVERVIEW.md; HEART_OVERVIEW.md)

### Facade

Some pages act as simplified front doors to the system:

- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [umtf-operational-template](./umtf-operational-template.md)

They hide the internal complexity of the framework family and provide a simpler entry surface. (source: framework-comparison-matrix.md; umtf-operational-template.md)

### Adapter

One framework's output can be adapted into another framework's input.

Examples:

- a `NEDF` concept scene becomes a node inside `CAST`
- a `SPEAR` procedure can be attached to a `CAST` edge or node when operation matters
- HEART history scenes reuse NEDF structure inside a people room

This pattern is already structurally visible in the current system. (source: CAST and Georgian Node System.md; HEART_OVERVIEW.md; 03_NEDF_TEMPLATE.md; 05_SPEAR_TEMPLATE.md)

### GoF Bridge

*Adopted 2026-09-05, from §The roster audit below. Registered as **GoF Bridge** — the prefix form the [glossary](./glossary.md) already uses for GoF Strategy · GoF Observer · GoF Composite · GoF Decorator — because the bare word is taken twice over: [BRIDGE LOAD](./bridge-load.md) the analogy protocol, and the graph-theoretic bridge / cut edge. Three senses, one word; see [glossary](./glossary.md) §Collision warnings.*

**Abstraction: the render-lens. Implementor: the generator.** The Render / Externalization layer ([framework-comparison-matrix](./framework-comparison-matrix.md)) has two hierarchies that vary independently:

| | Members | Varies when |
|---|---|---|
| **Abstraction** — render-lens | [CLAMP](./clamp-render-lens.md) (visual) · MASTER (auditory) | the *direction* vocabulary improves — a new slot, a sharper recipe |
| **Implementor** — generator | gpt-image · DALL-E · Midjourney · Suno | a vendor ships, deprecates, or is swapped for cost or quality |

Neither hierarchy has to move when the other does. Adding a fourth image generator needs no lens work; sharpening a CLAMP slot needs no generator work. The medium *types* the pairing — CLAMP does not drive Suno — but within a medium the two sides are free, which is the whole content of the pattern.

**Why not Strategy, which this was filed under until today.** Strategy varies *one* axis: pick the algorithm. It describes lens selection correctly — CLAMP or MASTER, chosen by output medium — and then has nothing to say about the generator, so the second axis went unnamed and the generator column fell out of [image-pipeline](./image-pipeline.md)'s own table even though the abstraction that page declares (`seed → transform → render → generator`) has four stages. The practical cost of the missing name: under Strategy, adding a generator looks like authoring a new strategy; under Bridge it is free by construction.

**Why not Adapter, which [clamp-render-lens](./clamp-render-lens.md) already claims.** Both hold, at different scopes, and GoF's own discrimination separates them: *Adapter makes things work after they are designed; Bridge makes them work before.* CLAMP-as-Adapter is what the lens **does to one scene** — converts an internal REMAPS scene into an external prompt string. Bridge is how the **layer is shaped** — two hierarchies designed to move independently, evidenced by the fact that a second clean implementation (audio) dropped in without reopening the first.

**The sharpest evidence is the null implementor.** The [aphantasia scene builder](./memory-palace-for-aphantasia.md) runs CLAMP's five slots with **no generator at all** — C, L, A, M, P filled as spatial parameters for mental construction, nothing rendered. An abstraction that still functions against an empty implementor hierarchy is decoupled in the strict sense; that is not something a Strategy over generators could do.

**The invariant this buys, and what it catches immediately.** Adopting Bridge asserts: *implementor-specific values do not live in lens slots.* [clamp-render-lens](./clamp-render-lens.md) states the rule itself — "CLAMP is tool-agnostic" — and one slot already breaks it. §A — Aspect & use-mode enumerates five **gpt-image-2 pixel dimensions** (`1024×1536`, `2560×1440`, …) as the slot's content; Midjourney expresses the same intent as `--ar 2:3` and has no pixel grid. The slot's *concept* (what shape is the output) is abstraction; the *five numbers* are one implementor's dialect sitting inside it. Flagged on that page; the fix is the owner's call, and the point here is that an adopted pattern earned its keep on the first pass rather than relabelling something.

**METER.**

- `render.generator_swapped` — fires when a scene is re-rendered on a different generator. Payload `{lens, from, to, lens_edits_required}`. **Pass-floor**: `lens_edits_required = 0` on ≥9 of 10 swaps. A swap that forces lens edits is the Bridge leaking.
- `render.lens_implementor_leak` — count of implementor-specific values sitting in lens slots, per lens. **Floor**: ≤1 per lens. CLAMP is at 1 (the §A pixel table). Rising means the abstraction is absorbing its implementor, which is the failure this adoption exists to make visible.

### GoF Template Method

*Adopted 2026-09-05, from §The roster audit below. Registered as **GoF Template Method** — prefix form, per the sibling rows — because bare **Template** is taken four times over as the [atomic-design](./memory-atomic-design.md) tier (Template (Memory) · (Money) · (PS) · (Logic)). That collision is a near-miss rather than a coincidence and is disambiguated below.*

**Skeleton: the spine. Deferred steps: what a dialect supplies.** §Domain Dialects above already describes the pattern in full and names only half of it. The spine is closed and drives; a dialect fills what the spine cannot know and never reshapes it. Guardrail 2 — the [orthogonality lock](./glossary.md), *"may add domain primitives but must never re-map an existing spine tag's meaning"* — **is** Template Method's defining constraint written in wiki vocabulary: a subclass overrides hooks, never the algorithm's structure. The control direction matches too: `/explain` runs its own spine and consults the dialect at the points it reaches, which is GoF's Hollywood principle, *don't call us, we'll call you*.

**Why not Strategy, which this was filed under until today.** Both hold, at different questions. **Strategy selects which dialect** — that is the sentence §Domain Dialects already has, and it is correct. **Template Method governs what a dialect may change once selected** — the part that had no name. GoF separates them on exactly this axis and gof-pattern-song-cycle carries the discriminator card: *Template Method vs Strategy — inheritance, not composition.* Strategy swaps a whole algorithm by delegation; here the structure is fixed and only steps vary, which is why the contract can forbid forking (*"it is **not** forked per domain — that would violate DRY and re-open the spine"*) while a Strategy would have no grounds to.

**Not the atomic-design Template tier, though they rhyme.** An [atomic-design](./memory-atomic-design.md) **Template** is a page-level *schema with named slots*, a tier in a granularity hierarchy (atoms → molecules → organisms → templates → pages). GoF **Template Method** is a behavioral pattern about inverted control and which steps a subtype may redefine. Both are "a skeleton with variable parts," which is precisely why the two must not be allowed to blur: one classifies *how big an asset is*, the other constrains *who is allowed to change what*.

**The invariant this buys, and the drift it immediately catches.** GoF's stated design goal for the pattern is *to minimize the number of primitive operations a subclass must override* — which presupposes the contract distinguishes **abstract operations** (must fill) from **hook operations** (may fill; default is empty). The dialect contract never drew that line, and four sources have drifted apart as a result:

| Source | What it says a dialect supplies |
|---|---|
| §Domain Dialects above (the owner) | primitives · **sigils** · templates |
| [glossary](./glossary.md) **Domain Dialect** row | primitives · templates · **failure-modes** |
| [glossary](./glossary.md) **Orthogonality lock** row | primitives · templates · **failure-modes** |
| operative-dialect — the *only* implemented family, 5 instances | **framing only**, and its METER floor `wiki.dialect_substrate_drift_check` = 0 violations actively **forbids** adding substrate content |

Read as requirement lists, the four are mutually incompatible and the shipped family conforms to none of them. Read as **hook** lists they agree completely, and the resolution follows: **the abstract operations are the three guardrails — every dialect must satisfy 1, 2 and 3 — while every content slot (primitives, sigils, templates, failure-modes, aesthetic framing) is a hook a dialect may leave empty.** Under that reading operative-dialect is conforming *by contract* rather than by exception, which is what it always was in practice; the glossary rows stop contradicting the owner because they were never requirement lists; and the parent contract's own example — *"a cybersecurity dialect adds attack-tree / CIA primitives"* — becomes an illustration of one filled hook rather than a rule the register family silently breaks.

**METER.**

- `dialect.skeleton_touched` — fires when a dialect re-maps a spine tag rather than extending it. **Floor: 0.** This is the orthogonality lock made countable, and it is the Template Method invariant: hooks are open, the skeleton is not.
- `dialect.hooks_filled` — payload `{dialect, hooks:[…]}`. Deliberately **no floor on count** — a dialect filling exactly one hook is legitimate, which is the whole point of the abstract/hook split. The floor sits on the guardrails instead: **3 of 3 satisfied** on every registered dialect, which is the assertion this adoption actually makes checkable.

### Builder

The templates are builder-style workflows:

- fill slots
- integrate scene
- place in palace
- verify retrieval

This is one of the strongest software-pattern analogies in the whole system. (source: 03_NEDF_TEMPLATE.md; 05_SPEAR_TEMPLATE.md; FRAMEWORK_OVERVIEW.md)

### State

Several frameworks have meaningful phases or modes:

- HEART Phase 1 vs Phase 2
- CAST maturity levels
- timeline and evolving system states inside CAST

The same item may legitimately move through states over time rather than remaining fixed. (source: HEART_OVERVIEW.md; CAST and Georgian Node System.md; CAST Maturity Levels.md)

### Flyweight

Reusable pattern libraries, tag vocabularies, and shared scene conventions behave like flyweights.

Examples:

- HEART pattern tags
- Lego Skills patterns in CAST
- shared UMTF tag meanings

The same compact structure is reused across many concrete cases. (source: HEART_OVERVIEW.md; CAST and Georgian Node System.md; universal-mental-tagging-framework.md)

## Patterns to Use Carefully

These patterns are not bad, but they should be used cautiously.

### Observer

Useful for thinking about feedback, monitoring, and triggers, but easy to over-literalize in a human memory system.

### Factory

Can help when generating standardized templates or presets, but should remain an authoring convenience rather than a conceptual burden.

### Singleton

Usually a bad instinct here. If too much depends on one master abstraction, the system becomes brittle and hard to evolve.

**Worked instance — CAST-universalism** (`/validate-idea` 2026-09-03, verdict **reject**). The proposal: make [CAST](./cast-overview.md) the single encoder and read the other five as special cases of a graph — a concept as a one-node graph, a procedure as a path, a person as a subgraph. It is representationally sound, since every structure *can* be drawn as a graph, and that is precisely why representational adequacy is the wrong test. What an encoder buys is not expressive power but **slot discipline**: the empty slots that refuse to close until the operator supplies what they would otherwise skip. Nothing in a graph demands NEDF's *Distinguisher* / *Failure*, SPEAR's *Alternatives* / *Repair*, HEART's *Treatment*, ORACLE's firing trigger, or GRACE's gradient position — so the collapse loses exactly the information no amount of graph-drawing recovers.

Three principles above decide it. **§L (Liskov)** is the deciding one, because the claim *is* a substitution claim: a lighter method may replace a heavier one only if it "preserves the same functional outcome," and CAST-as-NEDF does not preserve discriminability. **§D (DIP)** is inverted — the workflow would depend on one concrete implementation rather than on abstract problem types, the inversion §D exists to forbid; the evidence this is not theoretical is that [ORACLE](./oracle-overview.md) and [GRACE](./grace-overview.md) were added later *as peers* and would have had nowhere to land. **§S (SRP)** then applies verbatim: "when a framework starts trying to solve every problem type, clarity degrades." The counterintuitive cost lands on cognitive overhead — one encoder *looks* cheaper to learn, but every encode then needs a palace, an animal, and edge-verbs even for a single term, plus an invention step ("how do I re-express this non-graph thing as a graph?") that is pure System-2 assembly.

**The keepable half is the composition, not the collapse: HAS-A, not IS-A.** §Adapter above already has a NEDF scene *becoming* a node inside CAST and a SPEAR procedure *attaching* to a CAST edge — so CAST already sits at the centre of the encoder hexagon as the integrating substrate, without occupying the other five seats. That is the second GoF generative principle (*favor object composition over class inheritance*) read at the framework layer: "everything IS-A graph" is the inheritance version and loses; "everything CAN-BE-PLACED-IN a graph" is the composition version and already ships. Registered in [composability-index](./composability-index.md); the boundary is stated on [cast-overview](./cast-overview.md) §Adjacent but excluded.

## The roster audit — GoF's 23 filed against this page's 10

Run 2026-09-05 as the **second instance** of the audit method registered in [composability-index](./composability-index.md) (the first was Meadows' 12 rungs filed against [CAST](./cast-overview.md)'s boundary). The method: take a mature external roster that enumerates its domain completely, file it against a wiki framework's declared boundary, and see which entries land unowned. The roster here is the **23 GoF patterns** catalogued at gof-design-patterns; the boundary is §Best-Fit Design Patterns plus §Patterns to Use Carefully above.

**Coverage: 10 or 11 of 23, and the ambiguity is the first finding.** §Best-Fit names seven (Strategy · Composite · Facade · Adapter · Builder · State · Flyweight); §Use Carefully names three (Observer · Factory · Singleton). But **Factory** is not a GoF pattern name — the catalog has *Abstract Factory* (families of related objects) and *Factory Method* (subclass decides the class), and gof-design-patterns lists them separately. The bare heading collapses two of the 23 into one, so this page's own coverage count is unreadable from this page. Fixing the heading is a naming call left to the owner; naming the ambiguity is not.

**Three of the twelve unclaimed patterns already run in this wiki unnamed.** All three are **flagged, not adopted** — the same disposition [composability-index](./composability-index.md) gave Decorator on 2026-09-04, and for the same reason: naming a pattern is an architecture claim and belongs to whoever owns the structure, not to the audit that spotted it.

| Pattern | The structure already running | Status |
|---|---|---|
| **Decorator** — attach responsibilities dynamically; a flexible alternative to subclassing | The CAST modifier lattice: [sign](./edge-sign.md) · [quantity](./encoding-quantities-in-cast.md) · [delay](./delay-encoding-in-cast.md) wrap an unmarked Tier 1 edge additively, on disjoint positions, in any subset and any order ([nodes-and-edges](./nodes-and-edges.md) §Modifier composition) | **already flagged** 2026-09-04, by designing forward rather than by audit |
| **Bridge** — decouple an abstraction from its implementation so the two vary independently | The Render layer's **render-lens × generator** axis. [image-pipeline](./image-pipeline.md) §The transform → render abstraction states the abstraction as `seed → transform → render → generator` — *four* stages — then says "its two middle stages are pluggable" and drops the generator column from its own table. The generator varies too: one lens ([CLAMP](./clamp-render-lens.md)) already serves gpt-image, DALL-E and Midjourney | **new** → **adopted 2026-09-05**, §GoF Bridge above |
| **Template Method** — algorithm skeleton fixed, steps deferred, skeleton not overridable | The spine-and-dialect contract at §Domain Dialects: the spine is closed, dialects supply domain primitives, and guardrail 2 (*"may add domain primitives but must never re-map an existing spine tag"*) is the skeleton-stays-fixed constraint stated in wiki terms | **new** → **adopted 2026-09-05**, §GoF Template Method above |

**Why the two new ones are defects and not just missing labels.** Both currently sit under **Strategy**, and Strategy describes *one* axis of variation. Under Strategy, adding Midjourney to the visual channel looks like authoring a new strategy; under Bridge it is free, because the generator was never the thing the lens selects. The same collapse at §Domain Dialects hides that a dialect cannot fork the spine — a constraint the page states in prose (guardrail 2) and then names with a pattern that does not carry it. The wiki already holds the discriminator that catches both: gof-pattern-song-cycle files Template Method as *"vs Strategy — inheritance, not composition."*

**What the audit did not do.** Eight of the twelve unclaimed patterns — Prototype · Proxy · Chain of Responsibility · Command · Iterator · Mediator · Memento · Visitor — were not assessed in this pass. **Interpreter** is an unassessed candidate with an obvious target (the domain glyph grammars, glyph-grammar-pattern) and is named here so the next pass has somewhere to start. An audit that reports twelve verdicts after checking four would be the failure mode this page's §The Main Constraint rejects.

## Where This Helps Most

The strongest use cases for software-style architecture in Neural OS are:

- keeping frameworks from bleeding into each other
- deciding when to compose multiple frameworks
- creating extension points without destabilizing the core
- making the wiki easier to navigate and maintain
- making future framework proposals easier to evaluate

This is an architecture benefit more than a mnemonic benefit. (source: FRAMEWORK_OVERVIEW.md; framework-comparison-matrix.md)

## Bottom Line

Neural OS can and should borrow from software architecture, but only at the level of **clean structure and composability**.

Good transfer:

- clear responsibilities
- stable abstractions
- composable modules
- explicit handoff rules
- reusable patterns

Bad transfer:

- unnecessary formalism
- object-model worship
- patterns with no cognitive payoff

The test is simple: if the borrowed principle makes encoding, retrieval, extension, or revision cleaner, keep it. If not, drop it. This conclusion is a synthesis judgment based on the current architecture of the framework family. (source: FRAMEWORK_OVERVIEW.md; framework-comparison-matrix.md; universal-mental-tagging-framework.md)

## Diagrams

Two-layer alignment — five SOLID principles mapped to the encoder family, seven best-fit patterns below, with the filter rule between them and a "use with care" panel for over-reach patterns:

![software-design-principles schematic](../diagrams/12-software-design-principles-for-neural-os.png)

Hero — the craftsman's workshop metaphor: five stone pillars topped with brass instruments (level, compass, plumb-bob, vernier caliper, architect's square) standing behind a cabinet-of-curiosities being assembled, with a brass-stamped pattern-mold apothecary on the wall and rejected tools in a corner bin:

![software-design-principles hero](../diagrams/heroes/software-design-principles-for-neural-os.png)

## Related Pages

- gof-design-patterns — the canonical GoF catalog (source of the patterns mapped above)
- design-pattern-intuition — owner of the two generative principles and the "encapsulate what varies" heuristic
- pragmatic-programmer — DRY + orthogonality, the foundational layer beneath SOLID; owner of the 70 Tips
- dry-principle · orthogonality-principle · knowledge-portfolio — the three Pragmatic Programmer concept pages
- strategy-pattern-gof · composite-pattern-gof · decorator-pattern-gof · observer-pattern-gof — the four worked patterns
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [UMTF](./universal-mental-tagging-framework.md)
- [umtf-operational-template](./umtf-operational-template.md)
- [NEDF](./nedf-overview.md)
- [CAST System](./cast-overview.md)
- [SPEAR](./spear-overview.md)
- [HEART](./heart-overview.md)
- neural-os-research-thesis — applies this page's SRP and main-constraint rules to the "Neural OS as research program" framing; verdict keep-with-modification
- brick-method — cross-domain unlock: the abstraction barrier (information hiding) applied to *labor*. A BRICK is a well-documented function — interface (Blueprint+Checklist) + boolean test (Pass/Fail) + hidden body; the S-trap is a leaky abstraction
- difficulty-estimator - applies this page's SRP (artifact-complexity vs learner-acquisition-cost are separate responsibilities) and orthogonality (difficulty is computed against the absorbed set, never stored on the page) rules
- genius-compass — operational home of Unlock ③ (the test-pyramid convergence): a weekly leading-indicator process-audit with a thin outcome apex
- unfamiliar-codebase-protocol — validated against this page 2026-07-20; verdict **keep**. Leans hardest on §D (phases named by load type, encoder selection strictly downstream) and is a Facade over the encoder spine. Two notes worth carrying: it lands on the §O "specialized presets for **codebases**" extension point while minting a mnemonic, so it is the worked test of where §Domain Dialects guardrail #1 ("no new acronym") stops — a phase mnemonic in an operating stack is not an encoder sibling. And its gate structure (four process gates under one thin G-ship outcome check) instantiates Unlock ③ independently, from the onboarding side rather than from the principle

---

## U — See (CAST)
1. SOLID + design-pattern grid mapped onto NEDF/CAST/SPEAR/HEART/UMTF
2. Edges: each principle constrains how frameworks compose

## D — Name (NEDF)
1. SOLID applied to Neural OS frameworks
2. Patterns kept: Strategy, Composite, Adapter, Facade, Builder, State, Flyweight
3. Patterns rejected: any that add ceremony without payoff

## F — Do (SPEAR)
1. New framework idea? Run through SOLID fit
2. SRP violation? Split into two pages
3. OCP violation? Refactor to an extension point

## B — Watch (HEART)
1. God-pages owning too many concerns (SRP)
2. Tight coupling between frameworks (DIP)
3. Interface bloat (ISP)

## L — Predict (ORACLE)
1. SRP-violating page → drift accelerates
2. OCP-compliant framework → extensible without rewrite

## R — Act (GRACE)
1. Idea validation → check SOLID fit
2. Pattern choice → consult registered list, reject ceremony