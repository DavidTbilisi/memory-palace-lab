---
palace: meta-knowledge
level: 8
domain: 10
room: 8
wiki_source: wiki/cross-cutting/lifecycle-manager.md
---

# Lifecycle Manager

**Summary**: The Lifecycle Manager is the layer that owns retirement, compression, and consolidation of memorized material. It closes the largest structural gap identified in [missing-encoding-layers](./missing-encoding-layers.md): the absence of a strategic forgetting and pruning system. It runs alongside the encoding frameworks ([NEDF](./nedf-overview.md), [CAST System](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md)) and operates on SR cards as its atomic unit.

**Sources**:
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md)
- Design conversation, 2026-05-06

**Last updated**: 2026-07-31 (§The Graduation Path — retirement by success, consuming [bedrock](./bedrock.md)); 2026-05-12 (`tools/meter-lifecycle/` v0.2.0 — sweep + AnkiConnect-based apply)

---

## Why This Layer Exists

Neural OS is built to acquire, encode, connect, and accelerate. Until now it had no first-class system for letting material die. That created a long-term bloat risk: every palace, deck, and HEART room only grew, never shed. The Lifecycle Manager is the counterweight. Its job is to keep the active surface of the system small, current, and high-value, while preserving a faithful breadcrumb trail for anything that gets retired.

The Lifecycle Manager is also where **consolidation** lives — the "sleep-like" rewriting that merges redundant cards, lifts patterns into stronger schemas, and compresses many siblings into one richer parent. Forgetting and consolidation are the same operation viewed from two angles: deciding what stops getting full attention, and deciding how the residue gets folded back in.

## Position In The Architecture

| Layer | Members | Role |
|---|---|---|
| Capture / scoping | [RAPID](./rapid-in-neural-os.md), [BRIDGE LOAD](./bridge-load.md), [ORIENT](./orient-method.md), [Semantic Input](./semantic-input-cheat-sheet.md) | Decide what gets encoded and where |
| Encoding | [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md) | Produce the durable artifact |
| Performance | [red-queen-skill-gym](./red-queen-skill-gym.md), [drill-generator](./drill-generator.md), [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) | Turn encoded knowledge into reflex |
| **Lifecycle** | **Lifecycle Manager (this page)** | **Retire, compress, consolidate** |
| Cross-cutting | [UMTF](./universal-mental-tagging-framework.md) | Shared tag taxonomy |

The Lifecycle Manager sits below performance because it operates on already-encoded material, not on incoming raw input.

## Tier Ladder

The Lifecycle Manager moves cards through four tiers in one direction:

```
Active  →  Cold  →  Archive  →  Drop
```

Descent is automatic via sweep. Ascent is manual only — you can pull a Cold card back to Active, but the system never promotes on its own.

| Tier | Anki state | Wiki state | Visible in normal review? |
|---|---|---|---|
| Active | Normal scheduled card | Full card content in source room | Yes |
| Cold | Suspended, tagged `lifecycle::cold` | Full card content retained | No (suspended) |
| Archive | Card deleted from Anki | Compressed summary (Name + Essence + breadcrumb) in parent room | No |
| Drop | Gone | Only an entry in log noting the card existed | No |

**Why suspend in place rather than move to a Cold deck**: keeps the deck topology of the original NEDF / CAST / SPEAR / HEART home intact. A card's parent context is part of its meaning; moving it severs that.

**Thaw path**: Cold → Active is one Anki action (unsuspend). Archive → Active requires reconstructing the card from the breadcrumb plus the original source. Drop → Active requires re-encoding from scratch.

## Atomic Unit

The Lifecycle Manager operates on **SR cards** as its smallest unit. Rooms, palaces, and HEART rooms are not retired directly — they are retired by retiring all their cards. The two exceptions are explicit context retirement (see [[#Trigger F: Emergent Irrelevance]]) and inferred room-level retirement when most child cards have already retired.

## The Four Triggers

A card becomes a retirement candidate when at least one of these signals fires.

### Trigger B: Low Recall

The card has hit Anki's leech threshold (default 8 lapses). This signals that the card is failing to encode despite repeated relearning attempts — the encoding itself is broken, not the spacing. Leeches are surfaced as `lifecycle::candidate-cold` so the user can decide between fixing the encoding (rewrite the NEDF, change the hook) or retiring the card.

### Trigger C: Declared Value Class

The card was tagged `Priority: disposable` at capture time (the new fourth tier of the [UMTF](./universal-mental-tagging-framework.md) Priority family — see [[#UMTF Priority Extension]]). Disposable cards get a 14-day window in Active SR to prove they should stick around. After 14 days, they auto-cool to Cold unless the user has explicitly upgraded their priority.

### Trigger D: Supersedence

A newer card B covers the same conceptual ground as an older card A, well enough that A no longer adds value. Detection is **hybrid**:

1. **Automatic flag** — when a new card is created with NEDF essence overlap above a threshold against an existing card in the same palace, both are tagged `lifecycle::supersedence-suspected::<other-card-id>`.
2. **Manual confirm** — the user reviews the suspected pair, picks the survivor, and tags the loser `lifecycle::supersedes::<survivor-card-id>`. The next sweep then moves the loser to Cold.

Pure automatic supersedence is dangerous (false positives erase useful nuance). Pure manual supersedence is brittle (the user forgets to mark replacements during fast capture). The hybrid keeps the user in the loop on the actual decision, but the system does the work of finding the candidates.

### Trigger F: Emergent Irrelevance

The surrounding domain has stopped mattering. This trigger fires two ways:

**Explicit (F-explicit)**: the user marks a palace, room, or HEART room as `context: retired`. All child cards immediately move to Cold (not just candidate-tagged — the user has made a clear decision). However, the user retains the option to pull individual cards back to Active for ones that still generalize. Example: marking the AWS city palace as retired after the cert lapses, but pulling the binary-search NEDF card back because it generalizes beyond AWS.

**Inferred (F-inferred)**: when more than 50% of a room's cards have already retired (Cold, Archive, or Drop), the room itself becomes a `lifecycle::candidate-cold` at the room level. The user confirms or defers the cascade.

## The Graduation Path: Retirement By Success

All four triggers above retire **failures** — cards that will not encode, were never worth keeping, have been superseded, or belong to a dead context. Until 2026-07-30 this layer had no way to say the opposite: *this card is retired because it was learned too well to need reviewing again.*

That exit is **graduation**, and its criterion is owned by [bedrock](./bedrock.md). This layer does not say what that state is or decide when it has been reached; it consumes the verdict and performs the transition.

```
Active  →  Graduated        (terminal; parallel to the retirement ladder, not a rung on it)
```

Graduation is **not** a fifth rung on Active → Cold → Archive → Drop. It is a separate terminal exit taken directly from Active, and the distinction is load-bearing: a Cold card is one you stopped paying for because it was not worth the cost, while a Graduated card is one you stopped paying for because the debt is settled. Collapsing them would lose exactly the signal that makes graduation worth tracking.

| | Retirement ladder | Graduation |
|---|---|---|
| Reason | Card failed, expired, was superseded, or went irrelevant | Card succeeded past the [bedrock](./bedrock.md) threshold |
| Anki state | Suspended, then deleted | Suspended, tagged `lifecycle::graduated`; card content retained |
| Breadcrumb | Compressed summary in parent room | Full card retained — nothing is compressed away |
| Reversal | Thaw from Cold, or rebuild from breadcrumb | Spot-check failure returns it to Active automatically |

**Why the card is retained rather than archived.** A graduated card is the *evidence* for a bedrock claim, and the claim is falsifiable (see [bedrock](./bedrock.md) §Measurement). Deleting it would make the spot-check impossible and turn a testable assertion into an article of faith.

### The gate

The criterion is **owned by [bedrock](./bedrock.md) §Definition of done** and is not restated here — that page decides what "learned permanently" means; this layer only implements the transition. The monthly sweep proposes on the provisional tier; the quarterly spot-check below tests the confirmed one. Both tiers are defined there, not here.

What this layer contributes is the **mechanical detection**, since most of bedrock's conditions are not readable from Anki's scheduler state:

| Condition (owner: [bedrock](./bedrock.md)) | How the sweep detects it |
|---|---|
| Dose — 8+ retrievals at ≥1-month intervals | Count review-log entries whose *preceding* interval was ≥30 days. Ease factor is **not** a proxy and must not be substituted |
| Terminal gap ≥6 months | Current interval ≥180 days with the most recent answer correct |
| Zero lapses across the dose window | No `again` grade since the first qualifying deep pass |
| Latency below the deck's automaticity floor | Answer time on the most recent review |
| Cold (no same-domain exposure in 24 h) | **Not machine-detectable** — the sweep cannot know what you read yesterday. Surfaced as a user-confirmed checkbox on the proposal, never auto-passed |
| Direction | One card = one direction; a reversed card is a separate item with its own dose |

The last two rows are why graduation stays a **proposal** rather than an automatic transition. A sweep that auto-graduated on the machine-readable conditions alone would systematically over-declare, because the coldness condition — the one most often violated — is exactly the one it cannot see.

Failing any condition leaves the card in Active on its normal schedule.

### Spot-check, and revocation

Graduation is **provisional, not permanent**. The quarterly sweep unsuspends a random sample of graduated cards — default 5% — and serves them once. A card that comes back slow or wrong is **revoked**: it returns to Active at a reset interval, its `lifecycle::graduated` tag is replaced with `lifecycle::graduation-revoked`, and a `bedrock.revoked` event fires.

The revocation rate is the falsifier for the whole mechanism, and the threshold lives on [bedrock](./bedrock.md) §Measurement rather than here: past it, the criterion is too loose and the gate above must be tightened. A graduation path with no measured revocation rate is indistinguishable from silently dropping cards you liked.

### New tags

| Tag | Meaning |
|---|---|
| `lifecycle::candidate-graduate` | System proposes Active → Graduated. Awaiting user response. |
| `lifecycle::graduated` | Currently graduated (suspended, content retained, in the spot-check pool). |
| `lifecycle::graduation-revoked` | Failed a spot-check; returned to Active. Not re-proposable for 12 months. |

### Sweep cadence addition

| Transition | Cadence | What runs |
|---|---|---|
| Active → Graduated | Monthly | Tag cards meeting all four gate conditions as `lifecycle::candidate-graduate` |
| Graduated spot-check | Quarterly | Unsuspend a 5% sample, serve once, revoke failures |

## UMTF Priority Extension

This layer requires extending [UMTF](./universal-mental-tagging-framework.md)'s Priority tag family with a fourth tier:

| Tier | Meaning | Lifecycle behavior |
|---|---|---|
| `core` | Crucial, foundational, frequently used | Never auto-cools. Manual retirement only. |
| `standard` | Default value, normal SR cycle | Subject to all four triggers normally. |
| `low` | Useful but not central | Subject to all four triggers; faster supersedence threshold. |
| `disposable` | Captured speculatively, may not retain | 14-day Active window, then auto-cools to Cold unless upgraded. |

The fourth tier is the smallest possible UMTF extension. The first three were already implicit in CAST node weighting and review scheduling; `disposable` is the new addition that gives capture a way to say "I'm not sure this is worth keeping, but I want it written down."

## Compressed Summary Format (Cold → Archive)

When a card moves from Cold to Archive, the Anki card is deleted, but a one-paragraph summary is left in the parent room's wiki page. The format is:

```
**Archived**: <NEDF Name> — <NEDF Essence>
  • Archived: <YYYY-MM-DD>
  • Original card-id: <anki-id>
  • Source: <source-file or source-conversation>
```

The breadcrumb is what makes the descent reversible. With these three lines you can rebuild the card, or at minimum recognize "I once knew this" and choose to thaw it from the source. Without the breadcrumb, Archive is just a polite Drop.

## Sweep Cadence

Each tier transition runs on its own cadence. The cadence is asymmetric on purpose: Active → Cold needs to be responsive (catch leeches and disposables quickly), while Archive → Drop needs to be slow (the breadcrumb is cheap and the cost of premature deletion is high).

| Transition | Cadence | What runs |
|---|---|---|
| Active → Cold | Weekly (Sunday) | Tag leeches, expired disposables, confirmed-supersedence losers, and explicit-retirement children as `lifecycle::candidate-cold` |
| Cold → Archive | Monthly | Promote `lifecycle::confirm`'d Cold cards to Archive: delete from Anki, write breadcrumb to parent room |
| Archive → Drop | Quarterly | Drop breadcrumbs that have been in Archive for >12 months and have no inbound wiki links |

Each sweep also runs the consolidation pass (see [[#Consolidation]]) at the same cadence.

## Suggestion Queue: Anki Tags

The Lifecycle Manager surfaces all proposals as Anki tags rather than as a separate queue file. This keeps the user inside the tool they already use for review. The tag scheme:

| Tag | Meaning |
|---|---|
| `lifecycle::candidate-cold` | System proposes Active → Cold. Awaiting user response. |
| `lifecycle::candidate-archive` | System proposes Cold → Archive. Awaiting user response. |
| `lifecycle::candidate-drop` | System proposes Archive → Drop. Awaiting user response. |
| `lifecycle::cold` | Currently in Cold tier (suspended). |
| `lifecycle::confirm` | User accepts the proposed transition. Next sweep applies it. |
| `lifecycle::defer` | User defers the proposed transition. Skipped this sweep, re-evaluated next. |
| `lifecycle::keep` | User rejects retirement. Card returns to Active and the underlying trigger is suppressed for 90 days. |
| `lifecycle::supersedence-suspected::<card-id>` | System suspects this card and the referenced card cover the same ground. |
| `lifecycle::supersedes::<card-id>` | User confirms this card supersedes the referenced one. |
| `lifecycle::merge::<group-id>` | This card is part of a consolidation cluster (see below). |

## Source Of Truth

Anki and the wiki will drift. The contract:

- **Anki wins for state** — current tier, lifecycle tags, suspended/active status, lapse counts, supersedence relationships.
- **Wiki wins for content** — NEDF Name, Essence, archived summaries, room membership, framework slot data.

Neither overwrites the other's domain. The sweep reads both and only writes to its own side: lifecycle tags and Anki state get updated by the sweep on the Anki side; archived summaries and breadcrumbs get appended to the wiki on the wiki side.

This is the same separation logic [framework-comparison-matrix](./framework-comparison-matrix.md) already uses for capture vs. encoding: each layer owns one thing and hands off cleanly.

## Consolidation

Consolidation is the constructive half of the Lifecycle Manager. Where retirement removes cards, consolidation rewrites clusters of redundant cards into one stronger card.

### Consolidation Triggers

Three triggers fire automatically; one is user-driven.

1. **Essence overlap** (auto): three or more cards in the same room have NEDF essence similarity above threshold. They get tagged `lifecycle::merge::<group-id>` and surfaced as a cluster.
2. **Locus reuse** (auto): the same locus or anchor is referenced by multiple cards that could plausibly be one richer card. Tagged the same way.
3. **Manual command** (user): `tm lifecycle consolidate <room>` walks every card in a room and proposes clusters.

### Consolidation Output

When a cluster is identified, the Lifecycle Manager **auto-drafts a merged card** in a `lifecycle/proposals/` Anki deck (and a mirror file at `wiki/lifecycle-proposals/<group-id>.md`). The draft uses:

- Most-cited NEDF Name from the cluster as the working name
- Union of Essences as the essence draft
- Strongest hooks from the cluster
- Inbound and outbound edges from all merged cards
- A `replaces:` list of the original card-ids

The user accepts, edits, or rejects the draft. On accept, the originals are tagged `lifecycle::supersedes::<merged-card-id>` and flow through the Cold → Archive path on the next sweep. On reject, the cluster is marked dismissed for 90 days.

Auto-drafting is the most ambitious consolidation strategy and the most useful when it works. It will sometimes produce bad drafts. The 90-day dismissal cooldown keeps the system from re-pestering the user about the same cluster.

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| Premature retirement | Cards retire that the user actually still values | Manual `lifecycle::keep` returns to Active and suppresses the trigger for 90 days |
| Bloat resistance | User defers everything, nothing actually gets retired | Sweep surfaces deferred-count metrics; persistent deferral past 3 sweeps escalates to a manual review prompt |
| Bad merge drafts | Auto-drafted consolidation cards lose nuance | Drafts are proposals, never auto-applied; rejected drafts cool for 90 days; the user can always merge manually instead |
| Cascade overshoot | Marking a palace `context: retired` retires cards that still generalize | Cascade moves children to Cold (not Archive). Generalizable cards can be pulled back to Active before the next monthly sweep promotes them to Archive |
| Tag drift between Anki and wiki | Source-of-truth violations | Each side only writes to its own domain. Drift detection runs in the weekly sweep and flags inconsistencies for manual reconciliation |
| `core` cards getting auto-flagged | High-value cards getting candidate-tagged by triggers | `core` priority is exempt from auto-cooling. Only manual retirement applies |

## What This Layer Does Not Do

To prevent framework drift, the Lifecycle Manager explicitly does **not**:

- replace any encoding framework
- decide what to encode (that's [RAPID](./rapid-in-neural-os.md) and capture-layer territory)
- tune SR intervals (that's Anki's scheduler)
- judge whether a card is well-encoded (that's the encoding framework's failure-mode contract)
- model fatigue, stress, or state-aware retrieval (that's a separate gap — see [missing-encoding-layers](./missing-encoding-layers.md))

It only owns the lifecycle of an already-encoded card from active rotation through retirement or consolidation.

## Worked Example

A card from the AWS city palace: `RDS-Multi-AZ — synchronous standby in a different AZ for HA`. Captured 9 months ago, tagged `Priority: standard`. After the user passed the AWS cert and stopped working with AWS:

1. **Day 0**: User marks the AWS palace `context: retired`. F-explicit cascade fires. The RDS-Multi-AZ card moves immediately to Cold, suspended in Anki, tagged `lifecycle::cold`.
2. **Day 0**: User reviews the cascade and decides to pull `Binary-Search-Pattern` back to Active because it generalizes. RDS-Multi-AZ is left in Cold — it doesn't generalize beyond AWS.
3. **Day 30**: Monthly sweep runs. The card is still in Cold, no `lifecycle::keep` applied. It gets tagged `lifecycle::candidate-archive`.
4. **Day 30**: User confirms with `lifecycle::confirm`.
5. **Day 60**: Next monthly sweep promotes it to Archive. The Anki card is deleted. A breadcrumb is written into the AWS palace wiki page:

```
**Archived**: RDS Multi-AZ — synchronous standby in a different AZ for HA
  • Archived: 2026-07-05
  • Original card-id: 1714e2f8a01
  • Source: aws-syllabus-sr.md
```

6. **Day 425** (~14 months later): Quarterly Archive → Drop sweep runs. The breadcrumb has had no inbound link and no thaw events for >12 months. It is dropped. A single line is appended to log recording the deletion.

Total user actions: one cascade decision, one keep-or-let-go decision, one confirm. Total system maintenance: zero ongoing review burden once retired.

## Calibration Defaults

All numeric defaults in one place; tune via [METER](./meter-overview.md) over time:

| Knob | Default | Tunable when |
|---|---|---|
| Lapse threshold for trigger B | 8 (Anki leech default) | Persistent over-flagging or under-flagging |
| Disposable Active window | 14 days | If disposable cards rarely or always upgrade, adjust window |
| Inferred room-level retirement threshold | 50% of children retired | Adjust if rooms cascade-retire too eagerly or too late |
| Sweep cadence (Active→Cold) | Weekly (Sunday) | Match to user's actual review rhythm |
| Sweep cadence (Cold→Archive) | Monthly (last day) | Same |
| Sweep cadence (Archive→Drop) | Quarterly | Same |
| Drop-after-archive duration | 12 months without inbound link or thaw | Lengthen if thaws occur after >12 months |
| Essence-overlap threshold for supersedence flag | 0.6 cosine similarity | Tighten if false positives noisy; loosen if real pairs missed |
| Essence-overlap threshold for consolidation cluster | 0.7 across 3+ cards same room | Same |
| Rejection cooldown (consolidation, supersedence) | 90 days | Lengthen if same clusters keep re-proposing |
| Deferral escalation threshold | 3 consecutive sweeps | Trigger for manual review prompt |

## Integration With METER

Every tier transition emits a METER event with the schema in [meter-overview](./meter-overview.md). Health metrics METER tracks for this layer:

- Retirement candidate flagging rate (target 0–10/week per palace)
- Confirmation rate (target 60–90%)
- Thaw rate (target <5% within 30 days)
- Consolidation acceptance (target 30–70%)

Floor breaches trigger calibration suggestions in the Weekly Review. The user accepts, defers, or rejects.

## Tooling: `tools/meter-lifecycle/` (v0.1.0)

The sweep half of the Lifecycle Manager is implemented as a Python CLI at [`tools/meter-lifecycle/`](../tools/meter-lifecycle/). It opens the Anki collection.anki2 in **read-only** SQLite URI mode (safe to run while Anki is open, never modifies cards), evaluates two of the four retirement triggers (low-recall + disposable-aged), and produces:

- a human-readable proposal at `meter-data/lifecycle-proposals/<date>-<type>.md`
- a machine-readable JSON sibling
- one METER event per candidate plus a sweep-summary event

Install with `pip install -e tools/meter-lifecycle`. CLI surface:

```
meter-lifecycle find-anki                    # locate collection.anki2 files
meter-lifecycle sweep --type weekly          # run a sweep (auto-detects DB if singular)
meter-lifecycle sweep --db <path> --lapse-threshold 6 --disposable-age-days 7
meter-lifecycle proposal show                # display the most recent proposal
meter-lifecycle status                       # tier counts + most recent proposal
```

What v0.1.0 implements:
- Trigger B (low recall) using the configurable lapse threshold (default 8)
- Trigger C (disposable aged) using the configurable age window (default 14 days)

### v0.2.0 (apply transitions via AnkiConnect — shipped 2026-05-07)

After a sweep produces a proposal and the user reviews candidates in Anki, they tag each note with one of three response tags: `lifecycle::confirm`, `lifecycle::keep`, or `lifecycle::defer`. Then:

```
meter-lifecycle apply [--dry-run] [--url http://127.0.0.1:8765]
```

This queries Anki for the response tags via AnkiConnect, plans the transitions (confirm + candidate-cold → promote-to-cold; keep + candidate-* → cancel flag; defer → no-op), prints a summary, and applies them. Each affected card emits a `tier-transition` METER event. AnkiConnect is required for `apply` (not for `sweep`).

What's still deferred:
- Trigger D (supersedence) — needs NEDF essence comparison (v0.3.0)
- Trigger F (emergent irrelevance) — needs palace context tagging in Anki (v0.4.0)
- Cold→Archive and Archive→Drop transitions including breadcrumb generation (v0.5.0)

Tested with 50 unit + integration tests including end-to-end SQLite reading against a hand-built fixture `.anki2` file plus mocked AnkiConnect for the apply path.

## Diagrams

Four-tier descent ladder (Active → Cold → Archive → Drop) fed by four triggers, with sweep cadence on the right and the consolidation half across the bottom:

![lifecycle-manager schematic](../diagrams/15-lifecycle-manager.png)

Hero — the archive chamber metaphor: four descending shelves of differential brightness, a librarian on a sliding ladder carrying a scroll downward, four brass-trimmed inbox slots feeding the topmost shelf, a consolidation table merging three scrolls into one:

![lifecycle-manager hero](../diagrams/heroes/lifecycle-manager.png)

## Related Pages

- [bedrock](./bedrock.md) — owner of the graduation criterion this layer consumes; the positive counterpart to the four retirement triggers
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)
- [anki-reflex-deck-builder](./anki-reflex-deck-builder.md)
- [Memory Palace](./memory-palace-architecture-for-neural-os.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [meter-overview](./meter-overview.md)
- [pulse-overview](./pulse-overview.md)
- neural-os-daily-loop
- [problem-solving-os](./problem-solving-os.md)


---

## U — See (CAST)
1. Layer that owns retirement, compression, consolidation
2. Closes the largest gap from missing-encoding-layers

## D — Name (NEDF)
1. Lifecycle manager = strategic-forgetting/pruning layer
2. Distinguisher: operates on SR cards as atomic unit
3. Failure mode: only adding, never retiring

## F — Do (SPEAR)
1. Periodic sweep → mark cards for retirement
2. Consolidate duplicates → compress overlapping cards

## B — Watch (HEART)
1. Deck inflation
2. Skipping the sweep

## L — Predict (ORACLE)
1. Card age + grade → predict retirement candidate
2. Overlap detection → predict consolidation

## R — Act (GRACE)
1. Weekly → run sweep
2. Deck bloat → prune