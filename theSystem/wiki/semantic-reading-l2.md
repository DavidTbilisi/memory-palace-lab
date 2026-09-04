---
palace: tactical-memory
level: 5
domain: 10
room: 7
para: resource
semantic_mode: 4
wiki_source: wiki/learning-systems/semantic-reading-l2.md
---

# Semantic Reading — L2 Extension

**Summary**: L2-aware extension to the [semantic-reading-system](./semantic-reading-system.md) Obsidian plugin and MCP server. Adds a Language tag family (L2 · Gloss · Pron · Pattern · MissSnd · MissWrd · MissGrm · MissPrg), wires `language:` frontmatter through the vault index, and adds an `sr_l2_due_cards` MCP tool that filters FSRS-due cards by Krashen's 95%-known-vocabulary rule (i+1). This is the operational substrate the wiki's [language-learning-protocol](./language-learning-protocol.md) 70% INPUT block previously lacked.

**Sources**:
- semantic-reading-system.md (parent — staged reading framework)
- language-learning-protocol.md (70/30 INPUT/DRILL spec — INPUT·PPP·PT)
- language-learning-architecture.md (10-layer L2 architecture)
- semantic-listening-system.md (Pron/Word/Gram/Prag miss taxonomy — borrowed verbatim)
- production-reception-grammar-pair.md (semantic-reading-system is the reception sister of persuasive-writing-and-influence)
- ~/code/obsidian-semantic-reading/ — canonical plugin source (branch `l2-extension`)

**Last updated**: 2026-06-01

---

## What this page adds

The wiki's [language-learning-protocol](./language-learning-protocol.md) specifies that 70% of session time is comprehensible input. The [semantic-reading-system](./semantic-reading-system.md) is the reading-side reception protocol. But the protocol describes *what* the reader does, not *what surfaces in front of them*. Until this extension, the SR plugin's tag palette (Def, Q, R, …) was language-agnostic and the FSRS scheduler treated every paragraph the same — there was no operational floor enforcing Krashen's i+1 rule on the L2 card queue.

This extension makes three concrete additions to the SR plugin so the daily protocol becomes measurable rather than described:

1. **A Language tag family** — 8 new sigils for vocabulary atoms (L2 · Gloss · Pron · Pattern) and listening/reading miss signals (MissSnd · MissWrd · MissGrm · MissPrg).
2. **A frontmatter convention** — `language: <iso-code>` on the source note opts it into L2 study and threads the code through every Mention.
3. **An i+1 due-cards tool** — `sr_l2_due_cards(language, minCoverage)` returns only cards whose surrounding paragraph the reader can already parse at the threshold (default 0.95).

## The Language tag family

| Sigil | Name | Role | Route |
|---|---|---|---|
| **L2** | Target-language span | Anchors a flashcard. The vocabulary atom you want to remember. | NEDF |
| **Gloss** | L1 meaning | The native-language meaning. Usually attached to L2 as `note=`, occasionally standalone. | NEDF |
| **Pron** | Pronunciation | IPA or phonetic note. | NEDF |
| **Pattern** | Grammar pattern instance | A reusable grammar structure (case ending, slot frame, verb form). | NEDF |
| **MissSnd** | Pron miss | Heard but could not decode. | ORACLE |
| **MissWrd** | Word miss | Decoded but did not know. | ORACLE |
| **MissGrm** | Grammar miss | Knew words but missed structure. | ORACLE |
| **MissPrg** | Pragmatic miss | Decoded literal meaning but missed intent. | ORACLE |

The four Miss sigils are the same diagnostic taxonomy [semantic-listening-system](./semantic-listening-system.md) uses for spoken comprehension failures — making them shared sigils means reading and listening drills produce comparable METER signals.

L2/Gloss/Pron/Pattern route to NEDF because they're vocabulary/concept atoms (same family as Def/Mn/Ex/An). The Miss sigils route to ORACLE because they're measurement signals — comprehension-failure counts feed the dashboard.

## The frontmatter convention

A note becomes an L2 source by adding to its frontmatter:

```yaml
language: de  # ISO code; any non-empty string opts the note in
```

When this is present, the indexer:
- Marks every Mention from that note with `mention.language = "de"`
- Caches the plain-text per paragraph in `index.languageParagraphs` (only for opted-in notes — memory cost stays bounded)
- The AI prompt's Language-family section becomes operationally relevant (the family is always documented in the prompt; the frontmatter signals it actually applies)

## The i+1 due-cards filter

`sr_l2_due_cards` runs four passes:

1. **Build** Def + Q + L2 + Pattern cards from the index
2. **Filter by FSRS** — only cards whose due date ≤ now
3. **Filter by language** — only cards whose source note has the matching ISO code
4. **Filter by coverage** — for each remaining card, tokenize the source paragraph, canonicalize each token, count how many map to a "seen Def" (any concept the user has tagged at least once anywhere in the vault). Coverage = known/total. Drop cards below threshold (default 0.95).

The fourth pass is the i+1 enforcement. A card whose paragraph is mostly unknown vocabulary asks the reader to learn multiple new items at once — below i+1, which Krashen identifies as the comprehension floor for acquisition. Surfacing such cards burns sessions; suppressing them is the substrate's job.

### Why "seen anywhere" is the V1 predicate

The predicate maps to Krashen's *exposure* model rather than a retention model: the bar is "you've encountered this morpheme in context," not "you've memorized it." Consequences:
- The filter gets *more permissive* as the reading corpus grows, mirroring real comprehension growth.
- Cross-language leakage is accepted: a word tagged once in German counts as seen during English sessions too. For one active language at a time this is near-zero impact.
- The predicate is stateless w.r.t. FSRS, so it doesn't couple to scheduler internals.

Future tightening (deferred): a per-language predicate (seen *in this language*) or an FSRS-stability-based predicate (actually retained). Both are signaled in the code comment at the relevant function.

## METER integration

The plugin emits at MCP call time:

```
event: sla.l2_card_due
{
  language, minCoverage,
  totalDue,          // before coverage filter
  belowCoverage,     // dropped by i+1
  coverageMedian,    // of surfaced cards
  missByType: { MissSnd, MissWrd, MissGrm, MissPrg },
  returned, cards
}
```

`belowCoverage` is the i+1 signal itself: large values mean the reader is staring at material that's still beyond their floor; small values mean the corpus has matured into i+1 territory. The four miss-type counts feed [semantic-listening-system](./semantic-listening-system.md)'s diagnostic stack identically.

Reuses already-defined METER events: `sla.input_zone_check` (95%-rule passes) and `sla.affective_filter_breached` (deferred — wiring depends on PULSE/tracker integration not in this slice).

## What this slice does NOT do

Deferred to follow-up extensions (each their own decision):

- **Production-reception co-training loop** — auto-spawn a SPEAR drill from an L2 session
- **Polyglot dashboard** — cross-language summary view aggregating multiple language hubs
- **Replacing tools/wiki_morning_queue.py's homegrown SR** — its `SR_INTERVALS_DAYS = [1,3,7,14,30,60,120,240]` parallels FSRS but doesn't call it; convergence is a separate change
- **Affective-filter gate** — PULSE S≥4 suppresses production drills (requires plumbing tracker into the scheduler)
- **Auto-glossing via dictionary API** — Gloss tags are entered manually for now

## Related pages

- [semantic-reading-system](./semantic-reading-system.md) — parent staged-reading framework
- [semantic-listening-system](./semantic-listening-system.md) — reception sister, source of the Miss taxonomy
- [language-learning-protocol](./language-learning-protocol.md) — INPUT·PPP·PT 70/30 daily protocol
- [language-learning-architecture](./language-learning-architecture.md) — 10-layer L2 architecture
- production-reception-grammar-pair — pattern that pairs SR with persuasive writing
- [krashen-sla-hypotheses](./krashen-sla-hypotheses.md) — i+1 source theory
- [comprehensible-input-protocol](./comprehensible-input-protocol.md) — i+1 operational doc
- [glossary](./glossary.md) §Reading / listening tag namespace — registry of all 8 L2 sigils
