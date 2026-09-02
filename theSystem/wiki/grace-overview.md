---
palace: meta-knowledge
level: 7
domain: 10
room: 7
glyph: 🤝
wiki_source: wiki/encoders/grace-overview.md
---

# GRACE

**Summary**: GRACE is the social-pragmatic encoding layer for Neural OS. It owns the move-selection problem in social situations — the task of reading social signals (power, distance, face, affect) and choosing the right position on a graded scale of responses. Where [HEART](./heart-overview.md) models specific people and [ORACLE](./oracle-overview.md) conditional mode handles state transitions, GRACE encodes general graded moves usable across people and contexts. It closes gap #4 from [missing-encoding-layers](./missing-encoding-layers.md) — the last structurally-open layer.

**Sources**:
- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [heart-overview](./heart-overview.md)
- [oracle-overview](./oracle-overview.md)
- [pulse-overview](./pulse-overview.md)
- Design conversation, 2026-05-07

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-27 — added physical-distance slot in Read (pointer to proxemics-four-zones); the Hall 4-zone scale is now a load-bearing Read cue beside power/familiarity/urgency. 2026-05-07 (initial).

---

## Why This Layer Exists

The existing encoders cover specific people (HEART), specific procedures (SPEAR), and predicted state transitions (ORACLE conditional). None of them handle the general move-selection problem that dominates social practice: *"in this kind of situation, the right move sits somewhere on a gradient — pick a position."*

Most social mistakes are not picking the wrong move category. They are picking the wrong *position* on a scale the speaker already knew existed. Apologies that are too brief or too lavish. Disagreements pitched too softly to register or too sharply to land. Politeness that reads as cold formality or as falsely casual familiarity. The error is gradient calibration, not category selection.

GRACE is the layer that owns gradient calibration. It encodes graded move patterns paired with the cues that determine which position to pick. It is structurally different from HEART (which is person-specific) and ORACLE (which is single-prediction): GRACE cards always offer a *range* of responses with explicit selection criteria.

## The Six Modes

GRACE handles six distinct flavors of social-pragmatic move selection. Like ORACLE's four flavors, they share the same encoding contract but use the slots with different emphases.

| Mode | What gets selected | Typical situations |
|---|---|---|
| **Politeness** | Position on the deference scale | Requests, refusals, interruptions, addressing strangers |
| **Tone** | Emotional register and warmth | Bad news, condolences, celebrations, conflict |
| **Hierarchy** | Power-distance signaling | Meetings with mixed status, addressing seniors / juniors |
| **Subtext** | Reading and producing indirect meaning | Face-saving "no," soft refusals, hints, reading between the lines |
| **Apology / disagreement** | Graded transforms — softening or sharpening | Missed deadlines, conflicts, pushback, accountability |
| **Community** | Community-coded meaning and ritual | Church / family / cultural contexts where moves carry community significance |

Every GRACE card carries a `mode` field declaring which of the six it belongs to. Mode determines slot emphasis, gradient anchors, and which adjacent layers (HEART vs. ORACLE) are most relevant.

## GRACE Slot Structure

Each card has five slots whose initials spell the layer's name:

| Slot | Purpose | Required? |
|---|---|---|
| **G**round | The social situation that triggers move selection | Required |
| **R**ead | Cues to interpret — power, distance, face, affect signals | Required |
| **A**lternatives | The graded scale of responses (1-5, soft-to-hard or minimal-to-maximal) with explicit anchors | Required |
| **C**hoose | The position recommended for this card's situation, with the actual response | Required |
| **E**xit | Repair move if the chosen response lands wrong | Optional |

Unlike [ORACLE](./oracle-overview.md) where R/A/L are optional polish, GRACE requires Ground/Read/Alternatives/Choose — the gradient context (Alternatives) is load-bearing because the whole point of the layer is *position selection*. A card with only one response and no graded scale isn't a GRACE card; it's a SPEAR card miscategorized.

Exit is optional because not every social situation has a recoverable misstep, but populating it is strongly encouraged — most social wisdom lives in the repair, not the original move.

### Read slot — physical-distance cue (added 2026-05-27)

Read slot now carries an explicit `physical_distance` cue beside power/familiarity/urgency. See proxemics-four-zones for the 4-zone scale (intimate ≤50 cm / personal ≤1.5 m / social 1.5–4 m / public ≤7 m) and the violation symptoms. Operational implication: the Choose slot now includes whether to **close the distance, hold, or back off** — three default moves layered on top of the verbal position selection. Zone-violation repair (`Exit`) is *back off + brief acknowledgment*; do not over-apologize, which compounds the violation.

### Slot interpretation per mode

| Mode | G | R | A (gradient axis) | C | E |
|---|---|---|---|---|---|
| **Politeness** | Request situation | Power, familiarity, urgency cues | 1=blunt → 5=highly deferential | Chosen position + script | Softer reissue if too direct |
| **Tone** | Emotional context | Their state, your relationship distance | 1=restrained → 5=warm | Position + actual tone choice | Adjust register, acknowledge mismatch |
| **Hierarchy** | Mixed-status interaction | Status signals, who's deferring to whom | 1=peer-level → 5=high-deference | Position + form of address / posture | Recover from over- or under-deference |
| **Subtext** | Indirect-meaning context | What is *not* being said; politeness markers; cultural conventions | 1=literal-direct → 5=fully embedded subtext | Position + the actual indirect form | Make the meaning explicit if missed |
| **Apology / disagreement** | Conflict or accountability situation | Severity, your role, their stake | 1=minimal → 5=extensive | Position + script | Escalation or de-escalation move |
| **Community** | Community-coded situation | Community conventions, ritual context, role expectations | 1=secular-default → 5=fully community-coded | Position + the community-appropriate form | Recover from outsider-coded misstep |

The gradient axis rotates by mode but the structure is consistent: there is always a 1-5 scale, the Read slot determines which position to pick, and the Choose slot specifies the position and produces the move at that level.

## Cultural Tagging

You operate across multiple cultural contexts (Georgian family, English-professional, church / Christian community, broader Western, mixed). The right apology in a Georgian family context is structurally different from the right apology in a US corporate setting. To handle that without proliferating sublayers, GRACE uses **culture as a tag on each card**.

Tag conventions (extensible):

```
culture: georgian-family
culture: corporate-en
culture: church
culture: church-georgian
culture: peer-friend
culture: mixed-status-meeting
culture: neutral
```

A card can carry multiple culture tags if the move generalizes (`culture: corporate-en, peer-friend`) or be culture-specific (`culture: georgian-family` only). When training a card under a culture mismatch (e.g., reviewing a `georgian-family` card during a corporate-context session), the gym surfaces the mismatch as informational context, not as a failure.

Cards that don't carry a culture tag default to `neutral` — usable across contexts but offering less precision than tagged variants.

## Position In The Architecture

GRACE is a sixth encoder, sitting next to NEDF / CAST / SPEAR / HEART / ORACLE. Its primary class is encoder; its modest cross-layer touch is light HEART integration (HEART rooms can list person-specific GRACE move preferences).

| Layer | Members | Role |
|---|---|---|
| Capture / scoping | [RAPID](./rapid-in-neural-os.md), [BRIDGE LOAD](./bridge-load.md), [ORIENT](./orient-method.md), [Semantic Input](./semantic-input-cheat-sheet.md) | Decide what gets encoded |
| Encoding | [NEDF](./nedf-overview.md), [CAST](./cast-overview.md), [SPEAR](./spear-overview.md), [HEART](./heart-overview.md), [ORACLE](./oracle-overview.md), **GRACE (this page)** | Produce durable artifacts |
| Performance | [Red Queen Gym](./red-queen-skill-gym.md), [Drill Generator](./drill-generator.md), [Automaticity](./automaticity-and-reflex-training.md) | Turn correctness into reflex |
| Lifecycle | [Lifecycle Manager](./lifecycle-manager.md) | Retire and consolidate |
| Cross-cutting (taxonomy) | [UMTF](./universal-mental-tagging-framework.md) | Shared vocabulary |
| Cross-cutting (governance) | [PULSE](./pulse-overview.md) | State-conditioned modulation |

## Reading And Producing — One Layer

GRACE handles both directions in one card: Read slot trains reception (recognizing the face-saving "no," the soft refusal, the indirect request); Choose+Exit slots train production (issuing the calibrated response). Splitting them would create paired artifacts that always need to be co-trained anyway — reading a soft refusal exists *because* you need to choose how to respond to it.

The same card thus supports two workout modes:

- **Read-mode workout**: show Ground only, hide Read; user identifies the cues; reveal; mark hit/miss
- **Produce-mode workout**: show Ground+Read, show full Alternatives scale, hide the Choose position; user picks position and writes the response; reveal; compare

The gym defaults to mixed read/produce sessions, mirroring real social practice where reading and producing alternate within seconds.

## Integration With Existing Layers

| Adjacent layer | Relationship |
|---|---|
| [HEART](./heart-overview.md) | HEART rooms get an optional `social_style` field listing preferred GRACE moves with this person ("Maria responds well to Apology mode at position 2-3, never 4-5"). Light integration; HEART structure unchanged. |
| [ORACLE](./oracle-overview.md) | GRACE cards can grow ORACLE faces on demand: anomaly mode (recognize when your chosen move is going to land wrong), conditional mode (predict their reaction to your move), distributional mode (given context, what move are they expecting?). Standard ORACLE auto-generation rules apply. |
| [PULSE](./pulse-overview.md) | Under high stress, PULSE Steers GRACE workouts toward familiar (high-mastery) moves only; under low energy, PULSE Limits new high-load social production (no extensive apologies, no complex disagreements requiring multi-step framing). |
| [lifecycle-manager](./lifecycle-manager.md) | GRACE cards descend through the same Active → Cold → Archive → Drop ladder. Culture-context retirement (e.g., leaving a community) cascades to all `culture:`-tagged cards in that context, mirroring the AWS palace cascade pattern. |
| [red-queen-skill-gym](./red-queen-skill-gym.md) | GRACE workouts run as a new workout type using existing gym machinery — read-mode, produce-mode, and mixed-mode drills with latency tracking and per-mode accuracy breakdown. |
| [NEDF](./nedf-overview.md) | Social concepts (face, deference, register, etc.) get NEDF cards; GRACE cards reference them by name in the Read slot rather than re-defining. |
| [UMTF](./universal-mental-tagging-framework.md) | GRACE's gradient axis is a new sub-taxonomy under the Pattern tag family — politeness-scale, tone-scale, etc. are pattern shapes. |

## Failure Modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Mode confusion** | Encoding an apology pattern as a politeness card, or a hierarchy cue as a tone cue | Mode field is required at capture; gym refuses to schedule cards whose Alternatives scale doesn't match the declared mode's gradient axis |
| **Gradient collapse** | Alternatives slot lists only 2-3 positions instead of a 1-5 scale, losing the calibration training the layer is for | Capture lint: cards with fewer than 4 distinct gradient positions are flagged; 5 positions strongly encouraged |
| **Single-answer framing** | Card is written as if there is one correct move, with Alternatives as throwaway distractors | Choose slot must include selection criteria explaining *why* this position over its neighbors; if criteria are absent, the card is a SPEAR procedure miscategorized |
| **Read miscalibration** | User trains the right Choose move but on the wrong cues — produces deferential moves at peer interactions because the Read slot misidentifies hierarchy signals | Cross-check observation log: persistent miss patterns flag Read-slot rewriting as the priority repair |
| **Culture tag stale** | Card carries `culture: georgian-family` but conventions have shifted, or the user has left the context | Culture-context retirement cascade (Lifecycle Manager `context: retired` on a culture tag retires all child cards) |
| **Empty Exit slot** | User never populates the repair move; first-attempt failures have no recovery script and become rumination | Exit is optional but cards lacking Exit get a `grace::needs-exit` tag after first miss in the wild; populating Exit becomes a maintenance task |
| **Right-answer rumination** | Treating the gradient as a math problem with one optimal position; freezing in the moment trying to compute it | The layer's purpose is reflex, not optimization. Workouts emphasize speed; over-precision gets gym latency penalties |
| **Cross-culture transfer assumed** | A move that works in `culture: corporate-en` is assumed to work in `culture: georgian-family` without verification | Cards default to `culture: neutral` only when explicitly verified; otherwise the system expects the tag |

## What This Layer Does Not Do

GRACE explicitly does **not**:

- replace [HEART](./heart-overview.md) (HEART models specific people; GRACE models general moves; both are needed)
- replace [ORACLE](./oracle-overview.md) conditional mode (ORACLE predicts state transitions; GRACE selects responses on a gradient — different shapes)
- handle non-verbal moves as primary outputs (gesture, posture, silence accepted as Read inputs but production is verbal/textual in v1)
- manage your own internal emotional state (that is [PULSE](./pulse-overview.md) territory; GRACE is outward-facing)
- handle long-form rhetorical strategy or extended persuasion (those are SPEAR procedures with social adjustments, not GRACE cards)
- prescribe ethics or correctness (it encodes what *lands* in a context, not what is right; ethical judgment stays with the user)
- enforce cultural authenticity (the user owns culture tags and content; the layer is structure, not authority)
- replace lived practice (it is a calibration aid; real fluency still requires real practice)

## Worked Examples

### Example 1: Politeness — Request to a senior colleague

```
mode: politeness
culture: corporate-en
G: Need a senior colleague's review on a draft document; deadline is 48 hours; they are not your direct manager and have their own load
R: Power-distance moderate (senior but not authority-line); your urgency is real but not crisis; their face requires not assuming priority
A:
  1. "Review my doc by Friday." (blunt, peer-only — wrong here)
  2. "Could you review my doc by Friday?" (direct request, low deference)
  3. "Would you have time to review my doc by Friday? Happy to walk through it with you." (mid deference, opens dialogue)
  4. "I'd really appreciate your eyes on a doc if you have bandwidth this week — Friday would be ideal but flexible." (high deference, escape hatch)
  5. "I know you're swamped, but if there's any chance you could glance at this when you get a moment, I'd be very grateful — no rush, whenever works." (maximal deference, no real ask)
C: Position 3. Mid deference matches the moderate power gap; the dialogue opener acknowledges their judgment; "by Friday" preserves your real need without making it sound mandatory
E: If they push back on timing, drop to position 4 ("totally understand — whenever works") rather than re-asserting the deadline
```

Workout: hide C, show G+R+A, user picks position. Then hide A, show G+R, user writes Choose from scratch.

### Example 2: Tone — Responding to bad news from a friend

```
mode: tone
culture: peer-friend
G: Friend tells you they didn't get a job they really wanted
R: Their state is disappointed but not devastated; relationship is close; they want acknowledgment first, not advice
A:
  1. "That sucks. Their loss." (restrained, dismissive of their disappointment — wrong here)
  2. "Damn. I'm sorry, that's rough." (settled, brief acknowledgment)
  3. "Oh no — that really sucks. I know how much you wanted that one. How are you feeling?" (warm, opens space)
  4. "I'm so sorry. That's just brutal — you put so much into it. Want to talk?" (high warmth, validates the effort)
  5. (extensive consoling, multiple paragraphs about how it'll work out, forward-looking) (over-warm, can feel performative)
C: Position 3. Acknowledgment + invitation to feel; doesn't rush to fix it; doesn't perform
E: If they shift toward processing rather than venting, move toward position 4. If they shift to "whatever, next thing," move to position 2 — match their register
```

Workout: read-mode tests recognition of their state from minimal cues; produce-mode tests gradient selection.

### Example 3: Apology — Missed deadline at work

```
mode: apology
culture: corporate-en
G: You promised a deliverable for Tuesday; it is now Thursday; you have not communicated
R: Severity moderate (no production impact, but trust hit); your role was committed; their stake includes their own downstream commitments
A:
  1. "Sorry it's late — here it is." (minimal, treats it as routine)
  2. "Apologies for the delay on this. I should have flagged earlier when I saw it slipping." (brief acknowledgment + cause)
  3. "Sorry this is late. I underestimated the X part of it and didn't loop you in soon enough — that's on me. Here's where it is now and what's left." (acknowledgment + accountability + status)
  4. "I owe you an apology — this was due Tuesday and I didn't communicate when I knew it would slip. That's the part that's not OK. The work is here; I want to also walk you through the timing failure so it doesn't repeat." (full accountability, addresses the real failure — the silence)
  5. (extensive, multi-paragraph contrition focused on you rather than them) (over-apology, recenters the apologizer)
C: Position 4. The communication failure is the real harm, not the lateness; addressing it explicitly preserves trust better than addressing the deliverable alone
E: If they brush it off ("no big deal, thanks"), drop to position 2-3 in your follow-up — don't insist on the apology
```

### Example 4: Subtext — Reading a face-saving "no"

```
mode: subtext
culture: corporate-en
G: You proposed an idea in a meeting; senior colleague responded with "Interesting — I'll need to think about that more"
R: Tone polite but not warm; "think about more" is a delay that's not paired with a follow-up commitment; eye contact dropped during the line
A: (this card is read-mode primary; the gradient applies to your *response*)
  1. (Take it at face value — "Great, look forward to your thoughts.") (literal, misses the subtext)
  2. (Mild test — "Happy to send some background if that helps the thinking.") (offers but doesn't push)
  3. (Direct check — "If there's a concern with the approach, I'd rather hear it now while it's fresh.") (invites the real signal)
  4. (Frame the alternative — "I think it's fair to say we're not going forward with this — let me come back with a different angle.") (reads the no, acts on it)
  5. (Withdraw entirely — "Got it, I'll let it go.") (over-reads, may abandon a viable idea prematurely)
C: Position 3 if you have standing for the direct check; position 4 if you don't. The face-saving "no" wants to be honored, but you can offer one channel for it to become explicit
E: If they take the channel and surface a real objection, address it; if they decline the channel ("no, just need time"), accept that and let it die
```

### Example 5: Hierarchy — Address conventions in a Georgian-family context

```
mode: hierarchy
culture: georgian-family
G: Speaking with an elder relative in a multi-generational gathering; multiple younger family members present; topic is personal advice
R: Generational power-distance high; presence of younger members raises stakes (you're modeling); content is personal-advice-receiving, not peer
A:
  1. (First-name address, casual register) (peer-level, breaks convention)
  2. (Respectful first-name + standard polite forms) (standard but flat)
  3. (Honorific + warmth + acknowledgment of their experience) (mid-deference, feels right for adult-to-elder peer)
  4. (Full traditional address + active deference markers + listening posture) (high deference, traditional)
  5. (Maximal deference, formal-only, no warmth) (formal but cold, can feel distancing)
C: Position 3-4 depending on closeness of relation and their own register. Read their level of formality first; match or step one notch up
E: If they explicitly invite less formality ("call me X"), accept the invitation but maintain the underlying register; never drop to position 1 even if invited
```

### Example 6: Community — Joining a Christian community gathering

```
mode: community
culture: church-georgian
G: First time visiting a small group / Bible study; you are a known member of the broader church but new to this group
R: Group dynamics: established intimacy, shared rituals (greeting, opening prayer, food), one or two people in informal leadership; you do not yet know the local conventions
A:
  1. (Secular-default behavior — late arrival, casual entry, no greeting ritual) (outsider-coded, signals lack of familiarity with church culture entirely)
  2. (Standard polite entry — greet host, sit down) (correct for any small group, no community coding)
  3. (Acknowledge the community — greet others with church-context greeting, accept whatever ritual is offered) (community-aware, follows their lead)
  4. (Active community participation — initiate church-context greeting, offer to participate in ritual as appropriate) (full community engagement, fits if you are confident in the conventions)
  5. (Over-claim familiarity — lead a ritual you don't know the local form of) (over-coded, can land as performance)
C: Position 3 for a first visit; position 4 once you've observed one cycle of conventions. The principle is *follow their lead* — community moves are not for asserting your belonging but for honoring theirs
E: If you mis-step a convention (e.g., wrong greeting form), brief acknowledgment ("first time in this group — lead me through") opens the convention rather than papering over the gap
```

## Calibration Defaults

Defaults set; tune via [METER](./meter-overview.md) over time. Per-mode pass/floor thresholds in [meter-overview](./meter-overview.md#grace-metrics).

| Knob | Default | Tunable when |
|---|---|---|
| Default gradient depth | 5 positions | Some modes may want 3 (binary-ish hierarchy) or 7 (apology); per-card override allowed |
| Position 3 baseline rule | Moderate sits at 3; gradient anchors are mode-specific | Adjust if specific modes feel asymmetric |
| Cross-culture transfer threshold | Requires explicit re-tagging — no implicit reuse | Stays binary |
| Read-accuracy retirement threshold | <40% over 10 attempts → rewrite Read slot rather than retire whole card | Tune if Read failures cluster on cue-set rather than card |
| Choose-accuracy retirement threshold | <50% over 10 attempts → rewrite Alternatives gradient anchors | Same |
| Mixed-mode workout balance | 50/50 read/produce | Tilt toward produce-mode if production lags; toward read-mode if reception is the gap |
| Exit-slot enforcement | `grace::needs-exit` tag after first miss in the wild | Loosen to ≥3 misses if first-miss tagging proves noisy |
| Rejection cooldown (consolidation) | 90 days | Same as lifecycle-manager pattern |
| HEART `social_style` schema | Free-text in v1; structured later if usage reveals shape | Refine when ≥10 HEART rooms have populated the field |

## Integration With METER

Every read-mode and produce-mode workout rep emits a METER event including mode, culture tag, hit/miss, gradient position chosen, and PULSE state. Standard reports surface per-mode read/choose accuracy, gradient calibration patterns ("you systematically choose one position too soft"), and culture-specific performance. Floor breach (per-mode pass thresholds in [meter-overview](./meter-overview.md)) triggers the targeted slot-rewrite escalation rather than full-card retirement.

## Related Pages

- [missing-encoding-layers](./missing-encoding-layers.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [heart-overview](./heart-overview.md)
- [oracle-overview](./oracle-overview.md)
- [pulse-overview](./pulse-overview.md)
- [lifecycle-manager](./lifecycle-manager.md)
- [red-queen-skill-gym](./red-queen-skill-gym.md)
- [universal-mental-tagging-framework](./universal-mental-tagging-framework.md)
- [nedf-overview](./nedf-overview.md)
- psychology-os-framework
- [meter-overview](./meter-overview.md)
- neural-os-daily-loop
- [problem-solving-os](./problem-solving-os.md)


---

## U — See (CAST)
1. Trigger-action reflex layer
2. Closes the action gap

## D — Name (NEDF)
1. GRACE = act-on-trigger layer
2. Distinguisher: encodes "when X → do Y", not knowledge
3. Failure mode: knowledge without action triggers

## F — Do (SPEAR)
1. Encoded knowledge → derive trigger-action pair
2. Drill until reflex

## B — Watch (HEART)
1. Knowledge with no action
2. Trigger ambiguity

## L — Predict (ORACLE)
1. New skill → expect GRACE layer
2. Trigger → predict action

## R — Act (GRACE)
1. Knowledge pass → add GRACE
2. Trigger spotted → fire action

## Mnemonic

**"Feet first · eyes second · options third · move fourth · door last."** G Ground, R Read, A Alternatives, C Choose, E Exit. The exit is a *slot*, not an afterthought — you decide how you leave before you decide how you move.

## Checksum

1. Name the five slots in order.
2. Why is Exit a slot rather than something you improvise on the way out?
3. What is mode confusion here, and what stops a mis-moded card from being scheduled?


## Visual

**Five slots, and the last one is decided first.**

```
   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
   │  G   │──▶│  R   │──▶│  A   │──▶│  C   │──▶│  E   │
   │ground│   │ read │   │ alts │   │choose│   │ exit │
   └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
      feet       eyes      options     move       door
       │                                            ▲
       └──── you know how you leave ────────────────┘
              before you decide how you move
```

Exit is a **slot**, not an improvisation. The loop-back is the whole discipline.

