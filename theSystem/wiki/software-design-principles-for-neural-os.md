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

**Last updated**: 2026-09-05 (**the roster audit's third pass — all eight remaining GoF patterns assessed, the catalog now exhausted at 17 named · 3 present-but-declined · 3 no-fit**. **§GoF Iterator** adopted for the [memory-palace](./memory-palace.md) walk and immediately made rule 3 conditional — a fixed walk order is owed by *walked* palaces, not all of them, since a coordinate-addressed palace is subscripted rather than traversed. **§GoF Visitor** adopted to name the **inverse** this wiki runs — six encoder operations inlined into ~472 page elements — which surfaced that the face block is not a complete partition (472 vs 458) and has no completeness contract, the empty corner [representation-rules](./representation-rules.md) Rule 10 exists to catch. Proxy · Chain of Responsibility · Mediator declined as present-but-owned, with reasons recorded so they are not re-opened; Prototype · Command · Memento no fit. Hit rate for the pass: **2 of 8**); 2026-09-05 (**§GoF Decorator adopted** — the CAST modifier lattice, the audit's **last outstanding flag**, now closed; coverage is **15 of 23 named · 0 flagged · 8 unassessed**. The pattern supplies what §O did not — the cost of refusing additivity — marks the deliberate divergence (no recursion: a mark is a picture position and renders one value, which also puts GoF's *lots of little objects* liability out of reach), and its identity drawback immediately catches [nodes-and-edges](./nodes-and-edges.md) §Edge codes serializing the *undecorated* edge. Record now **3 of 4**, still a tendency; the sharper lesson is at *What the fourth check changed* — flagging records a resemblance, adopting imports the invariants); 2026-09-05 (the bare **Factory** heading split into §GoF Abstract Factory · GoF Factory Method — it was not a GoF name and collapsed two of the 23, leaving this page unable to state its own coverage; the count is now determinate at **14 named · 1 flagged · 8 unassessed**, and the caution now says why both sit here — §Builder already owns template instantiation); 2026-09-05 (**§GoF Interpreter adopted**, on explanatory grounds only — it derives glyph-grammar-pattern's three independently-stated size caps from one applicability clause, and **returned no defect**, which corrects the audit method's claim from a rule to a tendency; recorded at §The roster audit → *What the third check changed*); 2026-09-05 (**§GoF Template Method adopted** — the spine-and-dialect contract, which had named only its selector. The pattern's abstract-vs-hook requirement immediately caught four sources drifting on *what a dialect supplies*, including the only implemented family conforming to none of them; resolved by ruling the content slots **hooks** and the three guardrails the abstract operations); 2026-09-05 (**§GoF Bridge adopted** — the render-lens × generator axis; the pattern's invariant *implementor-specific values do not live in lens slots* immediately catches CLAMP §A's gpt-image-2 pixel table. Registered qualified because the bare word is taken twice); 2026-09-05 (§The roster audit — GoF's 23 patterns filed against this page's 10, as the second instance of the [composability-index](./composability-index.md) audit method; coverage is 10-or-11 of 23 because the **Factory** heading collapses two GoF names, and three unclaimed patterns already run unnamed — Decorator *already flagged*, **Bridge** and **Template Method** new. All flagged, not adopted); 2026-09-04 (§Registries shard on their own retrieval axis gained a second worked instance — its first use as a *filter*, plus the falsifiable pre-build test: try filing the registry's existing entries under the proposed axis); 2026-09-03 (§Singleton gained its first worked instance — CAST-universalism rejected via `/validate-idea`; §L named as the deciding principle); 2026-08-07 (§Registries shard on their own retrieval axis added — the DRY+orthogonality corollary behind the log-views split); 2026-07-19 (Test-Pyramid Convergence / process-over-outcome section added — Unlock ③); 2026-06-09

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

### GoF Interpreter

*Adopted 2026-09-05, from §The roster audit below — and adopted on **explanatory** grounds only. Unlike §GoF Bridge and §GoF Template Method above, this one **returned no defect**; that result is recorded rather than buried, because it is the evidence that corrects the audit method's claim. See §The roster audit, "What the third check changed."*

**The grammar is the glyph grammar; the sentence is a silhouette.** The correspondence is the most complete of the three adoptions:

| GoF Interpreter | glyph-grammar-pattern |
|---|---|
| TerminalExpression | alphabet pieces (`▢ ◆ ⟲ ⊥ …`), ≤11 per instance |
| NonterminalExpression | container pieces that enclose others — "depth = nesting hierarchy; multiple container types can layer" |
| Grammar productions, with precedence | 4 primary + 2–4 supplementary rules, and an explicit conflict rule: *"supplementary rules are clarifications of the primary four… if a new rule contradicts a primary rule, the primary wins"* |
| Context | the **frame-atmosphere (ambient)** slot family, plus the ambient/local fallback rule that decides which level a given axis reads from in a given instance |
| Traversal order | **reading direction** — "pick *one* direction per rendering and freeze it" |
| `Interpret()` | read a silhouette back into its meaning — the operation the whole pattern exists to make cheap |

**Not Composite, though Composite is inside it.** GoF's own note is that an Interpreter's abstract syntax tree *is* an instance of Composite, and that is exactly the relationship here: Composite accounts for pieces nesting into a silhouette and stops there. What it cannot account for is a **grammar with precedence**, a **context** that changes what a piece means, or a **frozen traversal order** — the three things that make a silhouette readable rather than merely well-formed.

**What the name buys: the reason behind three caps.** glyph-grammar-pattern carries three separate size ceilings, each arrived at by pressure-test and each stated as bare discipline — ≤11 alphabet pieces, 4 primary + 2–4 supplementary rules, ≤15 pieces in one silhouette before [chunking](./chunking.md) fails. GoF's applicability clause for Interpreter is *use it when the grammar is simple; for complex grammars the rule hierarchy becomes large and unmanageable.* The three caps are that one clause, discovered three times. Recorded at glyph-grammar-pattern §The three invariants → *Why the size ceilings exist*.

**METER.**

- `glyph_grammar.rule_count` — primary + supplementary composition rules per instance. **Floor: ≤8** (4 + up to 4), the cap the pattern already sets, now with a stated reason rather than a convention.
- `glyph_grammar.silhouette_read_time` — the operation this pattern exists to make cheap. No new floor is proposed; the [Lamp / Scale / Sword](./automaticity-and-reflex-training.md) ladder already owns the timings, and inventing a rival number would be the ceremony §The Main Constraint rejects.

### GoF Decorator

*Adopted 2026-09-05, from §The roster audit below — the **last outstanding flag** to close, and the fourth pattern adopted from the audit. Unlike its three siblings this one needed no registry work: **GoF Decorator (Wrapper)** was already in the [glossary](./glossary.md) with a full concept page at decorator-pattern-gof, and [composability-index](./composability-index.md) flagged it against this structure on 2026-09-04. What was missing here was never the name. It was the claim that this page's framework runs the pattern — and the invariants that come attached to saying so.*

**Component: an edge. Decorators: the three modifiers.** [nodes-and-edges](./nodes-and-edges.md) §Modifier composition already states the structure, and files it under §O (additivity) and §I (cheapest mark that discriminates) above. Every GoF role has an occupant:

| GoF Decorator | The CAST modifier lattice |
|---|---|
| **Component** — the interface responsibilities attach to | a CAST edge: *source → verb → target*, readable on its own |
| **ConcreteComponent** | an unmarked [Tier 1](./nodes-and-edges.md) verb, or a four-slot Tier 2 scene |
| **ConcreteDecorator** | [sign](./edge-sign.md) (target end) · [quantity](./encoding-quantities-in-cast.md) (stream body) · [delay](./delay-encoding-in-cast.md) (air time) |
| **Transparency** — clients cannot tell a decorated component from an undecorated one | *"Marking one never invalidates an unmarked edge"* — the graph walk, the bundle limit and the loop-sign multiply all run on a marked edge unchanged |
| **Responsibilities can be withdrawn** (applicability clause 2) | strip any mark and a valid edge remains; depth is opt-in **per edge**, never per graph |

**What the name supplies that §O did not: why the alternative is worse.** §O gives additivity as a *permission* — new modifiers may be added without reopening the old ones. Decorator's third applicability clause gives the **cost of refusing it**: extension by subclassing is impractical when "a large number of independent extensions would produce an *explosion of subclasses* to cover every combination." Three independent modifiers is 2³ = **eight** named edge types just to cover presence and absence, and each future modifier doubles it — a floor, not a ceiling, since quantity alone has three renderings. That is the number §Modifier composition was avoiding without stating, and it is the concrete argument against the nested-ladder proposal that page rejected on 2026-09-04: a ladder does not remove the explosion, it just orders it.

**Where the pattern stops: no recursion, and it is a trade rather than an oversight.** GoF's first listed benefit is that you may attach the *same* decorator twice — "two `BorderDecorator`s = a double border" — and nest without limit. CAST cannot, and must not pretend to: a modifier here is a **position in a picture**, and a picture position renders one value. There is no second thickness for a stream that is already thick. So the lattice is Decorator **minus recursion**: transparent, withdrawable, combinable in any subset — but bounded at three, because the positions are the bound. The compensation is exact, and it is why this is the right trade. GoF's chief liability is *"lots of little objects… hard to learn and debug"*; finite positions make that liability **structurally unreachable**. One constraint buys away the pattern's worst failure mode and costs its most-advertised feature, and the wiki was already on the correct side of it.

**The invariant this buys, and what it catches immediately.** GoF's chief drawback is stated as a warning about identity: *a decorated component is not identical to the component — you should not rely on object identity when using decorators.* §Edge codes, on the same page as the lattice, declares an identity for edges and relies on it — the slot-option index, rendered as `Gi-Ex-Cl-Bl` for humans and as one byte per edge "for packing, sorting, or **diffing** edges in external tooling." That identity is built from the four Tier 2 slots, which are the **ConcreteComponent**. Of the three decorators, exactly one reached it: [edge-sign](./edge-sign.md) appends a suffix (`Gi-Ex-Cl-Bl−`). **Quantity and delay have no written form at all** — not in §Edge codes, not on their own pages, and the `Q0·Q1·Q2` / `D0·D1·D2` names are mechanism tiers (*which move did you use*) rather than values (*what does this edge carry*).

The consequence is sharp enough to state as one sentence: **the page's own worst-edge example does not survive its own serializer.** *Thick stream, long gap, interceptor* — the high-volume, slow, inhibitory edge §Modifier composition says to find first — writes as `Gi-Ex-Cl-Bl−`, which is character-identical to a thin, instant, inhibitory one. Two of the three dimensions the lattice exists to carry vanish on write, so a diff over codes reports **no change** across exactly the contrast the modifiers were built to make visible. §Edge codes' scope sentence, *"Codes serialize an edge,"* is true of a Tier 2 scene and false of a decorated one. Flagged at [nodes-and-edges](./nodes-and-edges.md) §Edge codes; the sentence is corrected there today, and the notation itself is left open, because a written form is vocabulary and vocabulary is the operator's pick, not the audit's.

**One constraint on that future notation does follow from the pattern, and is recorded rather than designed.** Transparency is what makes decorators nestable in any subset, and §Edge codes already prizes the written analogue of it — "the code decodes without knowing which slot you are in." Any modifier notation must therefore be **self-delimiting**: readable without knowing in advance which modifiers are present, since any subset is legal. The sign suffix has that property by accident (one trailing character, absent by default); a bare appended number would not. That is a real constraint on the design space, derived from the pattern rather than from taste — the same kind of payoff §GoF Interpreter gave glyph-grammar-pattern's size caps.

**METER.**

- `cast.edge_serialization_lossy` — count of registered modifiers the written form cannot express, per notation. **Floor: 0.** Currently **2** (quantity, delay). This is the defect above made countable, and it is the number that closes when the notation question is answered.
- `cast.modifier_required` — fires when any procedure, checksum or tool cannot run on an *unmarked* edge. **Floor: 0.** This is Decorator's transparency clause made falsifiable: the day a reading needs a mark to work, the modifier stopped being additive and became a fifth slot, which is the failure all three modifier pages are written to avoid.

### GoF Iterator

*Adopted 2026-09-05, from §The roster audit's third pass below. Prefix form as with its siblings; neither *iterator* nor *visitor* was registered or otherwise live in wiki prose, so no collision warning was needed.*

**Aggregate: a palace. Iterator: the walk.** [memory-palace](./memory-palace.md) states the structure and never names it. Its rule 3 is the contract in wiki words — *"a fixed walk order. Loci are visited in a deterministic sequence."* And the benefit GoF claims is what that page's own palace-types table demonstrates: **one traversal interface over four unrelated internal representations.**

| Palace family | Internal representation |
|---|---|
| Building-route | rooms of a real building, walked in sequence |
| Domain-grid | a regular grid — 3×3, or [6 faces × 9 cells](./rubiks-cube-palace.md) |
| Body-palace | body parts |
| Calendar / curriculum | weeks, lectures, days |

Retrieval is *"a walk rather than a search"* in all four, and no step of the walk depends on which family you are standing in. That is the entire content of the pattern.

**The invariant this buys, and the tension it catches immediately.** Rule 3 is stated as a law of palaces — *"if the order is ambiguous, retrieval becomes unordered and the palace degrades into a tag cloud."* The same page's table then blesses the domain-grid family as *"Geometry-first; **no narrative walk required**."* Both cannot be read literally, and the two shipped instances resolve it in opposite directions: [rubiks-cube-palace](./rubiks-cube-palace.md) declares an explicit fixed walk (its rule 8 — corners clockwise, then edges), while [trigonometry-compass-palace](./trigonometry-compass-palace.md) declares none at all and does not need one, because it is **addressed rather than traversed** — you go to 90°, you do not walk to the third locus.

Iterator settles it: **rule 3 governs iteration, not palaces.** A palace subscripted by coordinate is not being iterated, so the fixed-order requirement does not reach it, and rule 3's honest form is conditional on the access mode. Corrected at [memory-palace](./memory-palace.md) today. The distinction is not cosmetic — it decides whether a new palace design owes a walk order before it can ship.

**METER.**

- `palace.access_mode` — declared per registered palace: `walk` or `address`. **Floor: every palace declares one, and every `walk` palace declares its order.** The failure this makes visible is the real one — a palace that declares *neither*, which is the tag cloud rule 3 was written to forbid and which the current wording cannot distinguish from a legitimate grid.

### GoF Visitor

*Adopted 2026-09-05, from the third pass below — and adopted because this wiki runs the pattern's **inverse**. Being able to say that, precisely, is the payoff; there is no proposal here to restructure anything.*

**Elements: every page. Operations: the six encoders.** The structure filed against here is the [six-face block](./representation-rules.md) — owned, defined and now contract-bound at [representation-rules](./representation-rules.md) §The six-face block. What matters for *this* page is only its shape as a pattern instance: each of ~472 elements carries six operations in its own body, one per encoder.

**GoF puts the operations in their own class so that adding one touches no element. This wiki inlined them into all ~472 elements, and the trade inverts exactly.** Adding an *element* is cheap and correct-by-template; adding or completing an *operation* is O(pages). That is not a mistake — it is the right call for a corpus read one page at a time, since a page must carry its own six faces to be useful alone. But it has GoF's stated liability with the roles swapped, and the liability is measurable.

**Counted 2026-09-05:**

| Face | Encoder | Pages carrying it |
|---|---|---|
| U — See | [CAST](./cast-overview.md) | 472 |
| D — Name | [NEDF](./nedf-overview.md) | 471 |
| F — Do | [SPEAR](./spear-overview.md) | 465 |
| B — Watch | [HEART](./heart-overview.md) | 463 |
| L — Predict | [ORACLE](./oracle-overview.md) | 463 |
| R — Act | [GRACE](./grace-overview.md) | 458 |

**14 pages carry the CAST face and not the GRACE face.** [delay-encoding-in-cast](./delay-encoding-in-cast.md) and archetype-encoding-in-cast stop after five; theme-covenant carries two of six. The decay is monotonic in the block's written order, so truncation and later-added-encoder are confounded and neither is proven — ORACLE and GRACE were added to the family after the other four (§Singleton above), and `R` is also simply last. What is *not* confounded: the block does **not** form a complete partition, and nothing on any page says whether it should.

**Rule 10 explains why nobody noticed.** [representation-rules](./representation-rules.md) Rule 10 exists for this: *"A bulleted list of three cannot show you that a fourth bullet is missing; a square with one empty corner shows it before a single label is read."* The six encoders are a **declared hexagon instance** ([framework-comparison-matrix](./framework-comparison-matrix.md) §The six encoders — count-shape, 2026-08-20). The footer renders those same six as **an ordered list of headings** — the one form Rule 10 says cannot carry a completeness checksum. The wiki's most-replicated six-member set is the single place its own count-shape rule is not applied, and 14 pages have been missing corners invisibly.

**What was open, and how it closed.** The finding was never "write 14 missing sections" — it was that the block had **no completeness contract**, so a deliberate omission and a truncation were indistinguishable and 458-versus-472 could not be read as a defect count at all. Written the same day at [representation-rules](./representation-rules.md) §The six-face block, and the two populations turned out to need **opposite** treatments, which is the argument for the declaration rather than a tidy-up: **five were truncations** (the CAST modifier pages, 5 of 6 with `room:` set and every folder sibling at six) and were completed; **nine were deliberate** — all eight of `wiki/spirituality/bible/`, a family with its own frontmatter dialect and no social-move face to fill, plus one `palace: buffer` working document — and now declare `faces:` in frontmatter. Eight of eight is a convention, not decay, and nothing on the pages had said so.

**That is the adoption's payoff, and it is worth being precise about.** Visitor did not write any of that content. What it did was force the question *where do the operations live?* — and the answer (inlined in every element) predicts both the decay and the fact that nobody could see it. The count came from asking the question; the contract came from the count.

**METER.**

- `wiki.encoder_face_coverage` — faces present per page, out of 6. **Floor: 6 of 6, or an explicitly declared `faces:` exemption.** As of 2026-09-05 the floor is met — 463 complete, 9 declared, 0 undeclared partials — and it is enforced by `check_face_block_complete` rather than asserted.
- `wiki.operation_add_cost` — pages touched when an encoder is added or completed. **No floor proposed.** This is the inverted-Visitor cost stated so it is not rediscovered as a surprise the next time a seventh encoder is considered; §Singleton above already records that ORACLE and GRACE arrived as later peers.

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

### GoF Abstract Factory · GoF Factory Method

*Split from a single bare **Factory** heading 2026-09-05. That heading was not a GoF name — the catalog carries two factories — so this page's own coverage count was unreadable from this page. The caution below is shared; the names are not.*

Both can help when generating standardized templates or presets, and both should remain an authoring convenience rather than a conceptual burden. **The specific reason they sit here rather than in §Best-Fit: §Builder above already owns template instantiation** — *fill slots · integrate scene · place in palace · verify retrieval* — so reaching for a factory on top of it usually duplicates a pattern the system already runs well. The wiki's "presets" are likewise spoken for: a preset here means a [Domain Dialect](./glossary.md), and §Domain Dialects claims Strategy for its selection, Flyweight for the shared spine, and §GoF Template Method for what a dialect may change.

**Keep the two distinct if either is ever adopted**, because collapsing them is what caused the ambiguity: **Abstract Factory** produces *families of related objects* configured to go together; **Factory Method** defers *which single class to instantiate* to a subtype. Neither is claimed as a Neural OS structure today.

*(Concrete uses do exist one layer down, in tooling rather than in the framework family — soroban-cnn-roadmap names Factory/Registry for its generators. That is a tool architecture and out of scope for this page, which is about the encoder spine.)*

### Singleton

Usually a bad instinct here. If too much depends on one master abstraction, the system becomes brittle and hard to evolve.

**Worked instance — CAST-universalism** (`/validate-idea` 2026-09-03, verdict **reject**). The proposal: make [CAST](./cast-overview.md) the single encoder and read the other five as special cases of a graph — a concept as a one-node graph, a procedure as a path, a person as a subgraph. It is representationally sound, since every structure *can* be drawn as a graph, and that is precisely why representational adequacy is the wrong test. What an encoder buys is not expressive power but **slot discipline**: the empty slots that refuse to close until the operator supplies what they would otherwise skip. Nothing in a graph demands NEDF's *Distinguisher* / *Failure*, SPEAR's *Alternatives* / *Repair*, HEART's *Treatment*, ORACLE's firing trigger, or GRACE's gradient position — so the collapse loses exactly the information no amount of graph-drawing recovers.

Three principles above decide it. **§L (Liskov)** is the deciding one, because the claim *is* a substitution claim: a lighter method may replace a heavier one only if it "preserves the same functional outcome," and CAST-as-NEDF does not preserve discriminability. **§D (DIP)** is inverted — the workflow would depend on one concrete implementation rather than on abstract problem types, the inversion §D exists to forbid; the evidence this is not theoretical is that [ORACLE](./oracle-overview.md) and [GRACE](./grace-overview.md) were added later *as peers* and would have had nowhere to land. **§S (SRP)** then applies verbatim: "when a framework starts trying to solve every problem type, clarity degrades." The counterintuitive cost lands on cognitive overhead — one encoder *looks* cheaper to learn, but every encode then needs a palace, an animal, and edge-verbs even for a single term, plus an invention step ("how do I re-express this non-graph thing as a graph?") that is pure System-2 assembly.

**The keepable half is the composition, not the collapse: HAS-A, not IS-A.** §Adapter above already has a NEDF scene *becoming* a node inside CAST and a SPEAR procedure *attaching* to a CAST edge — so CAST already sits at the centre of the encoder hexagon as the integrating substrate, without occupying the other five seats. That is the second GoF generative principle (*favor object composition over class inheritance*) read at the framework layer: "everything IS-A graph" is the inheritance version and loses; "everything CAN-BE-PLACED-IN a graph" is the composition version and already ships. Registered in [composability-index](./composability-index.md); the boundary is stated on [cast-overview](./cast-overview.md) §Adjacent but excluded.

## The roster audit — GoF's 23 filed against this page's 10

Run 2026-09-05 as the **second instance** of the audit method registered in [composability-index](./composability-index.md) (the first was Meadows' 12 rungs filed against [CAST](./cast-overview.md)'s boundary). The method: take a mature external roster that enumerates its domain completely, file it against a wiki framework's declared boundary, and see which entries land unowned. The roster here is the **23 GoF patterns** catalogued at gof-design-patterns; the boundary is §Best-Fit Design Patterns plus §Patterns to Use Carefully above.

**Coverage: 10 or 11 of 23, and the ambiguity was the first finding — since fixed (2026-09-05); see the count below.** §Best-Fit names seven (Strategy · Composite · Facade · Adapter · Builder · State · Flyweight); §Use Carefully names three (Observer · Factory · Singleton). But **Factory** is not a GoF pattern name — the catalog has *Abstract Factory* (families of related objects) and *Factory Method* (subclass decides the class), and gof-design-patterns lists them separately. The bare heading collapsed two of the 23 into one, so this page's own coverage count was unreadable from this page. **Resolved 2026-09-05** by splitting it into §GoF Abstract Factory · GoF Factory Method above — shared caution prose, separate names, determinate count.

**Coverage after three passes: 17 of 23 named · 3 present but not adopted · 3 assessed and declined · 0 unassessed.**

- ***Named*** (17, catalog order) — Abstract Factory · Builder · Factory Method · Singleton · Adapter · Bridge · Composite · Decorator · Facade · Flyweight · Interpreter · Iterator · Observer · State · Strategy · Template Method · Visitor.
- ***Structurally present, deliberately not adopted*** (3) — **Proxy** · **Chain of Responsibility** · **Mediator**. Each really does run here; each was declined because the invariant it would buy is already owned by a section above. Reasons at §The third pass.
- ***Assessed and declined, no fit*** (3) — **Prototype** · **Command** · **Memento**.

**The roster is exhausted.** Every one of GoF's 23 has been filed against this page's boundary and carries a verdict, which is the state §The roster audit was opened to reach.

**Three of the twelve unclaimed patterns already ran in this wiki unnamed.** All three were filed **flagged, not adopted** — the same disposition [composability-index](./composability-index.md) gave Decorator on 2026-09-04, and for the same reason: naming a pattern is an architecture claim and belongs to whoever owns the structure, not to the audit that spotted it. **All three have since been adopted by that owner** (this page), on the dates in the table.

| Pattern | The structure already running | Status |
|---|---|---|
| **Decorator** — attach responsibilities dynamically; a flexible alternative to subclassing | The CAST modifier lattice: [sign](./edge-sign.md) · [quantity](./encoding-quantities-in-cast.md) · [delay](./delay-encoding-in-cast.md) wrap an unmarked Tier 1 edge additively, on disjoint positions, in any subset and any order ([nodes-and-edges](./nodes-and-edges.md) §Modifier composition) | **already flagged** 2026-09-04, by designing forward rather than by audit → **adopted 2026-09-05**, §GoF Decorator above |
| **Bridge** — decouple an abstraction from its implementation so the two vary independently | The Render layer's **render-lens × generator** axis. [image-pipeline](./image-pipeline.md) §The transform → render abstraction states the abstraction as `seed → transform → render → generator` — *four* stages — then says "its two middle stages are pluggable" and drops the generator column from its own table. The generator varies too: one lens ([CLAMP](./clamp-render-lens.md)) already serves gpt-image, DALL-E and Midjourney | **new** → **adopted 2026-09-05**, §GoF Bridge above |
| **Template Method** — algorithm skeleton fixed, steps deferred, skeleton not overridable | The spine-and-dialect contract at §Domain Dialects: the spine is closed, dialects supply domain primitives, and guardrail 2 (*"may add domain primitives but must never re-map an existing spine tag"*) is the skeleton-stays-fixed constraint stated in wiki terms | **new** → **adopted 2026-09-05**, §GoF Template Method above |

**Why the two new ones are defects and not just missing labels.** Both currently sit under **Strategy**, and Strategy describes *one* axis of variation. Under Strategy, adding Midjourney to the visual channel looks like authoring a new strategy; under Bridge it is free, because the generator was never the thing the lens selects. The same collapse at §Domain Dialects hides that a dialect cannot fork the spine — a constraint the page states in prose (guardrail 2) and then names with a pattern that does not carry it. The wiki already holds the discriminator that catches both: gof-pattern-song-cycle files Template Method as *"vs Strategy — inheritance, not composition."*

**What the third check changed.** The Interpreter candidate was run on 2026-09-05 and **adopted with no defect found** — see §GoF Interpreter above. That result matters more than a fourth finding would have, because it corrects a claim this page and [composability-index](./composability-index.md) had both started to repeat after the first two adoptions: *the roster finds the missing name, and the name finds the leak.* Two for two is not a rule. Three checks in, the record is **two names that caught a defect ([Bridge](./image-pipeline.md), Template Method) and one that only explained an existing rule (Interpreter)** — so the audit reliably surfaces *unnamed structure*, and whether a name then pays a second time is a tendency rather than a property. The freshness drift the Interpreter pass turned up on glyph-grammar-pattern — four items, including a refinement recorded as propagated three months before it was — is **not** credited to Interpreter: any staleness check would have found it, and crediting it to the pattern would inflate exactly the method this section exists to keep honest.

**What the fourth check changed, and what it deliberately does not.** §GoF Decorator was adopted 2026-09-05 and **did** catch a defect — §Edge codes at [nodes-and-edges](./nodes-and-edges.md) serializes the *undecorated* edge, silently dropping two of the three modifiers — so the running record is **three of four**. That does not restore the rule the paragraph above retired. A tendency measured four times is still a tendency; the honest reading is that it went from 2-of-3 to 3-of-4, not from *maybe* to *yes*.

**The fourth check is evidence about a different claim, and the more useful one.** Decorator is the only one of the four the audit did not *find* — [composability-index](./composability-index.md) had flagged it a day earlier by designing forward, and this section used that re-find as calibration rather than as a finding. So its defect says nothing about whether rosters surface structure. It says something about whether **flagging is enough**: the name was known, written up in full at decorator-pattern-gof, registered in the [glossary](./glossary.md) since long before, and correctly matched to the lattice — and the serialization gap still sat in §Edge codes from 2026-08-31 until the pattern was adopted and its consequences list actually run against the structure. **Flagging a pattern records a resemblance; adopting one imports the invariants.** That is the argument for closing flags rather than letting them accumulate, and it is the reason the eight unassessed below are a real backlog rather than a formality.

**What the audit did not do.** Eight of the twelve unclaimed patterns — Prototype · Proxy · Chain of Responsibility · Command · Iterator · Mediator · Memento · Visitor — were not assessed in this pass. **Interpreter** was named here as an unassessed candidate with an obvious target and **has since been run** — see §GoF Interpreter above and *What the third check changed* above. An audit that reports twelve verdicts after checking four would be the failure mode this page's §The Main Constraint rejects.

## The third pass — the eight unassessed, all eight assessed

Run 2026-09-05, closing the backlog §What the audit did not do had left standing. Same method, same boundary. The distribution is the point: **two adopted, three present but declined, three no fit.** An audit that returned eight adoptions would have been the failure mode this section exists to prevent.

| Pattern | Structure filed against | Verdict |
|---|---|---|
| **Iterator** — sequential access to an aggregate without exposing its representation | [memory-palace](./memory-palace.md)'s **walk**: rule 3's fixed order, over four unrelated palace representations (building-route · domain-grid · body · calendar) | **adopted**, §GoF Iterator — **defect found** |
| **Visitor** — an operation on an object structure, without changing the elements' classes | The **six-encoder face block** (`U`·`D`·`F`·`B`·`L`·`R`) on ~472 pages — six operations per element | **adopted**, §GoF Visitor — **defect found** (the wiki runs the inverse) |
| **Proxy** — a surrogate controlling access to another object | The derived compact views: [glossary](./glossary.md)'s registry rows over owner pages, `wiki/_meta/page-catalog.md`, the two `.tsv` registries (157KB standing in for 998KB), `.log-views/`, the split index | **present, not adopted** |
| **Chain of Responsibility** — pass a request along a chain until something handles it | The cost-ordered ladders: `Q0→Q1→Q2`, `D0→D1→D2`, `Dyn0→Dyn1→Dyn2`, Tier 1 → Tier 2 — each link asking *can you discriminate this?* | **present, not adopted** |
| **Mediator** — encapsulate how a set of objects interact | [composability-index](./composability-index.md), whose own summary is Mediator's intent: the pairwise question has *"a single discoverable answer rather than requiring full-wiki re-derivation"*, so framework pages need no n² knowledge of each other | **present, not adopted** |
| **Prototype** — create objects by copying a prototypical instance | — | **no fit** |
| **Command** — encapsulate a request as an object (queue · log · undo) | — | **no fit** |
| **Memento** — capture and externalize an object's internal state without exposing its internals | — | **no fit** |

**Why the three present ones were declined, which is a different verdict from "no fit."** All three genuinely run here. Each was declined for the same reason: **the invariant it would buy is already owned by a section above, and a second name for an owned constraint is the ceremony §The Main Constraint rejects.**

- **Proxy** would assert *a surrogate must be indistinguishable from its subject and never hand-maintained.* §Registries shard on their own retrieval axis already states it — *"One authoritative mapping, two views… Do not maintain the two by hand as separate tables"* — and the derived files carry the guard in their own headers (*"DERIVED — do not edit"*). Tested rather than assumed: regenerating every derived view on 2026-09-05 produced **zero diff**, so the invariant holds and Proxy has nothing to add.
- **Chain of Responsibility** would assert *a chain needs a terminal handler, or a request falls off the end unhandled.* That is a real and pleasing account of the two open gaps — **loop gain** and **structural doubt** are exactly requests no link accepted ([nodes-and-edges](./nodes-and-edges.md) §Open, unclaimed). But it only re-describes two gaps already named, where §GoF Interpreter's comparable explanatory adoption **unified three independently-discovered caps into one clause**. Re-labelling is below that bar. It becomes adoptable the day a third property falls off the same end, because three would make it a pattern rather than a coincidence.
- **Mediator** would warn that *the mediator centralizes complexity and can become a monolith.* [composability-index](./composability-index.md) is 761 lines and 361 rows, so the warning is live — and the remedy is already written one section up (shard on a retrieval axis). Adopting Mediator would add a name to a diagnosis this page can already make.

**Why the three no-fits are no fits.** Stated so the next pass does not re-open them:

- **Prototype** — nothing here creates an instance by cloning a configured exemplar. Palaces are the *opposite* case: *"loci are pre-learned, not invented at encoding time"* — you reuse an environment you already have rather than copy a prototype. Template instantiation is §Builder's, as §GoF Abstract Factory · GoF Factory Method already records. [МегаЛоция](./vocabulary-word-type-routing.md)'s "re-skin" signals class membership; it clones nothing.
- **Command** — [METER](./meter-overview.md) encapsulates **observations**, not invocations, and `palace meter backfill` replays *records* to rebuild a log rather than commands to re-perform actions. [SPEAR](./spear-overview.md)'s **R — Repair** slot is error recovery, not undo of a completed operation. No queue, no undo, no invoker/receiver split anywhere in the encoder family.
- **Memento** — the closest structure is the [nodes-and-edges](./nodes-and-edges.md) **edge code**: capture an edge's state, externalize it, restore later. That is already §GoF Decorator's territory, and the defect there — a capture too lossy to restore its originator — is already recorded. Naming Memento would file **one finding under two patterns**, inflating the count this page keeps precisely to stay honest. Recording the near-miss is worth more than the row.

**What the third pass does to the record.** Six adoptions now, five of which found a further defect: [Bridge](./image-pipeline.md), Template Method, [Decorator](./nodes-and-edges.md), [Iterator](./memory-palace.md) and [Visitor](./representation-rules.md) did; Interpreter did not. **5 of 6** — and the honest note is the same one the third check forced: a tendency measured six times is a better-measured tendency, not a law. The more load-bearing number is the other one. **Eight candidates checked in this pass produced two adoptions**, so the audit's *hit rate* is roughly a quarter, not the near-certainty the first two findings suggested. A roster is worth filing because a quarter of it lands, not because most of it does.

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