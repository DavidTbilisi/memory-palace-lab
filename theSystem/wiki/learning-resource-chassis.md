---
palace: strategic-memory
level: 7
domain: 10
room: 9
wiki_source: wiki/learning-systems/learning-resource-chassis.md
---

# Learning Resource Chassis

**Summary**: A modular framework for producing many learning resources (dictionaries, drill apps, reference handbooks, reading tools, pedagogical platforms) without rebuilding the wheel each time. Five archetypes carry every resource; one shared technical chassis carries common infrastructure; every resource declares its alignment with the Neural OS spine so the portfolio compounds into curriculum instead of fragmenting into noise.

**Sources**: Distillation of product-monetization-plans (TagManager, memory-palace-lab, SorobanMachine, georgian_ocr, dictionary bundle), financial-dictionary-seed (4th dictionary in the bundle), [composability-index](./composability-index.md) (unlock-ledger model), [framework-comparison-matrix](./framework-comparison-matrix.md) (encoder spine), [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) (SRP, OCP, composability), and direct observation that the existing portfolio of ~33 repos already converges on a handful of shapes.

**Last updated**: 2026-05-12

---

## Why this page exists

The Neural OS author has the **pedagogy** (the encoder spine [nedf-overview](./nedf-overview.md) · [cast-overview](./cast-overview.md) · [spear-overview](./spear-overview.md) · [heart-overview](./heart-overview.md) · [oracle-overview](./oracle-overview.md) · [grace-overview](./grace-overview.md), plus cross-cutting [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) · [pulse-overview](./pulse-overview.md) · [meter-overview](./meter-overview.md) · [spark-overview](./spark-overview.md)). What is missing is the **technical chassis** that operationalizes the pedagogy across many shippable artifacts.

Without a chassis, 10–20 resources cost 10–20× effort: incompatible JSON shapes, duplicated auth, no cross-link, no shared analytics, no shared brand, no compounding. With a chassis, each new resource costs roughly 1× after the chassis is paid for, and each resource raises the value of every other resource.

This page is the single doc that every future learning resource must conform to before it gets a repo.

---

## Five archetypes

Every resource picks exactly one. If a candidate doesn't fit any, the default answer is "reshape the candidate" not "invent a sixth archetype."

### 1. Lexicon

**Shape**: static JSON content + searchable HTML + DataTables-style table + multilingual columns + per-row definition.

**Examples in existing portfolio**: IT-Dictionary, mathdict, financial-dictionary, future Bible Hebrew dict, future Georgian etymology dict.

**Spine fit**: serves [nedf-overview](./nedf-overview.md) (each entry is a Name-hook). Optional drill layer on top is [spear-overview](./spear-overview.md) (use-the-word-in-a-scene).

**When to pick**: domain has a closed vocabulary of named things that need fast lookup, cross-language pairing, or first-class definitions.

### 2. Drill app

**Shape**: interactive task generator + scoring + spacing curve + per-attempt telemetry.

**Examples**: SorobanMachine, grep_train, candidate future drills (base60, typing, code-construct recognition).

**Spine fit**: serves the relevant gym — algorithm-pattern-gym, construct-recognition-gym, [red-queen-skill-gym](./red-queen-skill-gym.md) — and emits [meter-overview](./meter-overview.md) events on every attempt. Spacing comes from [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) level targets.

**When to pick**: skill is a reflex that needs repetition under timing or noise, not a fact that needs lookup.

### 3. Reference handbook

**Shape**: structured markdown + cross-links + full-text search + (optional) printable form.

**Examples**: cheatsheets-ka, learn_linux, learning_git, bash_scripting, nasm_learn.

**Spine fit**: serves [spear-overview](./spear-overview.md) (each command is a runnable Scene with Preconditions and Execution slots). Optional Anki layer via [anki-reflex-deck-builder](./anki-reflex-deck-builder.md).

**When to pick**: domain is a stable set of procedures the user needs to consult or memorize, not a vocabulary list and not a drill loop.

### 4. Reading tool

**Shape**: text loader + aligned / parallel / annotated rendering + bookmark and tag layer.

**Examples**: parallel-book-reader, Bible-ref-reader, semantic-reading.

**Spine fit**: serves [semantic-reading-system](./semantic-reading-system.md) and [semantic-listening-system](./semantic-listening-system.md) tag namespaces (Def, R, A, Q, M, …). Emits tags that downstream encoders consume.

**When to pick**: the unit of work is consuming long-form text with structure, not a discrete fact and not a reflex.

### 5. Pedagogical platform

**Shape**: full app with users, accounts, decks, scheduling, longitudinal progress.

**Existing**: memory-palace-lab.

**Spine fit**: union of all encoders; the central runtime that Lexicons and Drill apps feed into.

**When to pick**: never, unless you are extending memory-palace-lab. The portfolio should contain **exactly one** pedagogical platform. Building a second is the most common way to kill the budget.

---

## Shared technical chassis

Build once, reuse for every resource. Treat each item below as a single decision the portfolio commits to.

| Concern | Decision | Rationale |
|---|---|---|
| Hosting | Static-first (GitHub Pages, Cloudflare Pages, Netlify) wherever possible | Lexicon, Reference handbook, and most Reading tool archetypes need zero backend. Free hosting eliminates a recurring cost line. |
| Content schema | One JSON shape per archetype, versioned at the top of the file | Cross-resource tooling (import, search index, cross-link) only works if shapes are predictable. |
| Brand namespace | One umbrella name (e.g. "Neural OS Library") + per-resource sub-brand | Each new resource raises trust for every other resource. Cross-promotion only works if the user knows they're in the same family. |
| Auth + payments | One stack reused only when monetizing (e.g. Stripe + magic-link auth) | Most resources should ship free → upsell. Auth is overhead; only pay it when there's a paid surface. |
| Analytics | One shared [meter-overview](./meter-overview.md) pipe, not per-resource Google Analytics | Without one pipe, you can't tell which 1 of 10 resources is actually used. |
| Search | One client-side full-text index per archetype (e.g. lunr.js for Lexicon, MiniSearch for Reference) | Same archetype = same search layer. |
| Repo scaffold | One generator per archetype (cookiecutter-style) | A new Lexicon should be "fill in JSON" — not "set up Vite + DataTables + i18n from scratch." |
| Brand & visual | One shared CSS / design-token set | Cosmetic divergence makes 10 resources look like 10 abandoned hobby projects instead of one product family. |

The chassis itself lives in **one** repo (working name: `neural-os-chassis` or `learning-kit`) and is consumed by each resource as a template fork or a published package. Chassis upgrades propagate by re-running the generator and merging the diff.

---

## Spine-alignment checklist

Every new resource must answer these questions **before code is written**. Save the answers in the resource's README under a `## Spine alignment` section.

1. **Which encoder does this serve?** Pick one of NEDF / CAST / SPEAR / HEART / ORACLE / GRACE, or explicitly "none — this is supporting infrastructure." If it's "all of them," reshape the resource — it's too broad.
2. **Which [UMTF](./universal-mental-tagging-framework.md) tag families does it produce or consume?** Spatial / Sensory / State / Relation / Pattern / Temporal / Priority. Most Lexicons produce Pattern + Relation; most Drill apps consume Priority + Temporal.
3. **What [METER](./meter-overview.md) signals does it emit?** Specify the event names and the fields. At minimum: open, attempt, correct, abandon. Without METER, you are flying blind on which resources earn their place.
4. **What [SPARK](./spark-overview.md) micro-loop does it offer?** Surprise / Progress / Autonomy / Reward / Knowing — pick at least one and say how the user notices the win. A resource with no SPARK loop is a reference book; a resource with SPARK is a habit.
5. **What does it explicitly NOT do?** Single responsibility per [SRP](./software-design-principles-for-neural-os.md). If you can't name three things it refuses, it isn't focused enough.
6. **Which target level on [skill-progression-stages](./skill-progression-stages.md) does it serve?** A Lexicon usually targets Knowledge ladder L1–L3 (recognition / recall); a Drill app targets L4–L7 (fluent / automatic). Mismatch = mis-shaped resource.

A resource that can't answer all six is not ready to be built — it's still a half-thought. Refine it before opening the editor.

---

## METER discipline (non-negotiable)

Telemetry ships with v0.1, not "we'll add it later." Three rules:

- **Event schema is set by [meter-overview](./meter-overview.md)**, not invented per resource. Reuse `open / attempt / correct / abandon / complete / share` before adding new event types.
- **Privacy posture**: opt-out, anonymized by default, no personally identifying fields. The point is to know which resources are alive, not who uses them.
- **Weekly read**: a single dashboard rolls up all resources together. If a resource has fewer than `N` unique opens per week after `M` weeks, it goes on the chopping block — kept in archive, removed from cross-promotion, not actively maintained. Without this rule, the portfolio bloats with zombies.

The chopping rule is the discipline that lets you ship 10–20 resources without drowning in maintenance. Better to retire and consolidate than to maintain 18 dead pages.

---

## Cross-pollination hooks (the compounding part)

A resource that just sits alone earning a trickle is a curiosity. The portfolio only compounds when each resource feeds another. Every new resource must do **at least one** of the following:

- **(a) Export to memory-palace-lab.** Lexicon entries become decks; Drill app sessions become longitudinal records; Reading tool tags become palace nodes. memory-palace-lab is the gravitational center; everything else feeds it.
- **(b) Advertise the book / academy.** Footer or sidebar mention, with a single link. Doesn't have to be loud. Has to be present.
- **(c) Earn directly.** Paid tier, license, sponsorship, or referral revenue. If a resource earns, it justifies its own maintenance.

A resource that does none of those three is **noise** and should not be built. Better to spend the week on the chassis than on a thirteenth orphan repo.

---

## How to add a new resource (workflow)

1. **Pick the archetype.** From the five above. If none fits, the resource is mis-shaped — go back to scoping.
2. **Fill the spine-alignment checklist.** Six questions. Save them in the candidate README before code.
3. **Pick the cross-pollination hook.** At least one of (a), (b), (c). Write it down.
4. **Run the chassis generator** for that archetype. You get repo skeleton, content schema, search, METER pipe, brand assets, and deploy config.
5. **Fill in content.** This is the only step that should take real time. The infrastructure is already done.
6. **Ship v0.1 with METER on.** Public from the start. Tell people. No "stealth mode."
7. **Add a row to [composability-index](./composability-index.md)** under "Resources" so the unlock-ledger reflects the new artifact.
8. **Append to product-monetization-plans if monetized**, or just to the portfolio inventory if free.

If any step doesn't have a clear answer, the resource isn't ready. Stop and refine.

---

## The trap (state it explicitly)

Launching resources before deciding the chassis. Symptom: 10 incompatible JSON shapes, 10 auth implementations, 10 deploy pipelines, 10 abandoned analytics dashboards, zero cross-linking, zero compounding.

Two paths from here:

- **Wrong path** (familiar, painful): "I'll figure out the chassis as I go." → 6-month death march per resource, portfolio fragments, maintenance bleeds, the book + academy starve of attention.
- **Right path**: 1–2 weeks of chassis work first (generator + schema + METER pipe + shared brand). Then 10 resources at ~1 week each is plausible because each one is "fill in content" not "set up infrastructure."

The chassis is the lever. Without it, "10–20 resources" is a wish. With it, it is a schedule.

---

## What this page is not

- Not a content plan. Which resources to build is a separate decision driven by product-monetization-plans, audience demand, and [meter-overview](./meter-overview.md) signal.
- Not pedagogy. The pedagogy is already specified by the encoder spine and gyms. This page is purely how to package and ship.
- Not a monetization plan. Some resources monetize, most don't. The plan for each one lives in product-monetization-plans.

---

## Related pages

- product-monetization-plans — which Tier S resources earn and how
- financial-dictionary-seed — Lexicon-archetype example in active development
- [composability-index](./composability-index.md) — unlock-ledger that tracks resources as they ship
- [framework-comparison-matrix](./framework-comparison-matrix.md) — the encoder spine each resource must align with
- [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) — SRP, OCP, composability rules referenced in checklist
- [meter-overview](./meter-overview.md) — telemetry layer every resource emits into
- [spark-overview](./spark-overview.md) — reward layer every resource should offer at least one of
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md) — shared tag namespace across archetypes
- [skill-progression-stages](./skill-progression-stages.md) — target-level mapping for resource scoping
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md) — chassis-compatible export target for Lexicon and Drill archetypes


---

## U — See (CAST)
1. Modular framework for many learning resources
2. Five archetypes + shared technical chassis

## D — Name (NEDF)
1. Learning resource chassis = modular framework for resources
2. Distinguisher: portfolio compounds into curriculum
3. Failure mode: building resources without chassis — fragmented portfolio

## F — Do (SPEAR)
1. New resource → identify archetype
2. Apply shared chassis + Neural OS alignment

## B — Watch (HEART)
1. Skipping chassis
2. Resource fragmentation

## L — Predict (ORACLE)
1. Resource type → predict archetype
2. Archetype → predict chassis fit

## R — Act (GRACE)
1. New resource design → use chassis
2. Drift → re-align to chassis