---
palace: meta-knowledge
level: 6
domain: 10
room: 7
glyph: 🏷️
wiki_source: wiki/cross-cutting/universal-mental-tagging-framework.md
---

# Universal Mental Tagging Framework (UMTF)

**Summary**: A synthesis layer that formalizes reusable mental tags across Neural OS. UMTF treats tags as perceptual retrieval dimensions rather than textual labels, and unifies spatial, sensory, state, relation, pattern, temporal, and priority cues already used across existing methods.

**Sources**:
- CAST and Georgian Node System.md
- PEOPLE_PALACE_STRUCTURE.md
- MULTIDIMENSIONAL_vs_UNIDIMENSIONAL_ENCODING.md
- FRAMEWORK_OVERVIEW.md
- Concept Encoding Protocol.md
- PATTERN_LIBRARY_TEMPLATE.md

**Last updated**: 2026-09-02 (lint — §Pattern Tags' first mention of the graph-structure pattern library now links its owner page, as does the Related Pages row); 2026-09-02 (`MULTIDIMENSIONAL_vs_UNIDIMENSIONAL_ENCODING.md`, long cited in Sources with no page behind it, ingested as [encoding-dimensionality](./encoding-dimensionality.md); §Default Encoding Order and §Related Pages point to it for the spend/decline decision this page does not make); 2026-09-02 (§Default Encoding Order and §Related Pages point to [multi-attribute-encoding](./multi-attribute-encoding.md), which spends this vocabulary on a single item and names the per-item channel budget); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (the seven tag types drawn as their count-shape ring — [representation-rules](./representation-rules.md) Rule 10 declared instance, n=7 at the scope ceiling); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-12

---

## What UMTF Is
![universal-tagging-v3](../images/universal-tagging-v3.png)
UMTF is a proposed unification layer for the wiki. It does not replace [CAST](./cast-overview.md), concept encoding, or palace methods. It names the recurring retrieval dimensions those methods already use, so the same tagging logic can be applied consistently across domains. This is a synthesis from the existing sources rather than a standalone source-native framework. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md; MULTIDIMENSIONAL_vs_UNIDIMENSIONAL_ENCODING.md; FRAMEWORK_OVERVIEW.md)

A **mental tag** in this framework is a stable retrieval dimension attached to information. The point is not to invent more labels. The point is to make recall ride on immediate perception: where something is, how it feels, what condition it is in, what it connects to, what pattern it matches, when it happens, and how much it matters. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md; Concept Encoding Protocol.md)

## Design Criteria

Good mental tags should be:

- **Instantly perceived** rather than decoded step by step. Size, position, motion, and sensory contrast are preferred over abstract symbols. (source: CAST and Georgian Node System.md)
- **Reusable** across domains so the same tag logic works for codebases, people, systems, and concepts. (source: FRAMEWORK_OVERVIEW.md; PATTERN_LIBRARY_TEMPLATE.md)
- **Orthogonal** so each tag type answers a different question instead of competing for the same slot. This orthogonality rule is a synthesis guideline introduced here. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md)
- **Low-effort** so the tag rides on existing perceptual machinery such as palace geometry, vivid imagery, and pattern recognition. (source: MULTIDIMENSIONAL_vs_UNIDIMENSIONAL_ENCODING.md; FRAMEWORK_OVERVIEW.md)
- **Emotionally or sensorily distinct** so collisions are less likely. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md)
- **Consistent** so the same cue keeps the same meaning once assigned. CAST's "assign once, never reassign" rule is the model here. (source: CAST and Georgian Node System.md)

## The 7 Universal Tag Types

**Seven members, so the count-shape is a ring** ([representation-rules](./representation-rules.md) Rule 10, declared instance 2026-08-20). Seven is the ceiling of the rule's scope — past it a polygon stops being pre-attentively readable and the right form is a ladder. Each type answers exactly one question, which is what §Orthogonality Rules means by "one tag type should answer one question only":

```
                          SPATIAL
                        "where is it?"
          PRIORITY   ·                   ·   SENSORY
      "how important                       "how does it
          is it?"                             feel?"
              ·                                   ·
       TEMPORAL                                    STATE
    "when does it                              "what condition
      happen?"                                   is it in?"
              ·                                   ·
            PATTERN    ·                 ·    RELATION
      "what larger structure           "what does it
       does this resemble?"             connect to?"
```

**The ring is deliberately unnumbered.** The seven types are a *taxonomy*, not a sequence — §Default Encoding Order below is a separate, explicitly optional traversal over *actions* ("use this order unless a specific framework already imposes a stronger one"), not an ordering of the set. A set with a recommended walk is still an unordered set; numbering the vertices here would assert a rank the taxonomy does not have, and would put this instance on the wrong side of Rule 10's ordered/unordered boundary.

**Test** (Rule 10): cover the labels. Seven seats are visible, and a missing type shows as an empty one before a single word is read.

### 1. Spatial Tags
![tagging1](../images/Tagging1.png)
Spatial tags answer: **Where is it?**

Location carries category, hierarchy, neighborhood, and traversal order. In Neural OS this already appears as rooms, walls, doorways, nested palaces, sibling order, and placement rules such as hubs in central positions and bridges in doorways. (source: PEOPLE_PALACE_STRUCTURE.md; CAST and Georgian Node System.md)

Typical forms:
- room = major category
- wall = subcategory or functional slice
- shelf/cluster = local grouping
- doorway = bridge or transition
- staircase/depth = progression or hierarchy
- center = hub
- corner = leaf or edge case

Best use:
- large knowledge systems
- hierarchies
- long-term stable organization

### 2. Sensory Tags
![tagging2](../images/Tagging2.png)
Sensory tags answer: **How does it feel?**

Neural OS already uses sound hooks, smell, texture, temperature-like sensations, and vivid multisensory reinforcement. These cues act as metadata channels that help separate similar items without needing new symbolic structure. (source: PEOPLE_PALACE_STRUCTURE.md; CAST and Georgian Node System.md; Concept Encoding Protocol.md)

Typical forms:
- sound = language, names, phonetic hooks
- smell = chemistry, atmosphere, version signatures
- texture = topology, surface character, graph feel
- temperature = urgency, danger, safety
- brightness = importance
- color = coarse category, if kept consistent within a subdomain
- weight/pressure = complexity or load

Best use:
- fast classification
- collision reduction
- subconscious indexing

### 3. State Tags
![tagging3](../images/Tagging3.png)
State tags answer: **What condition is it in?**

This is already explicit in CAST node encoding, where adjectives and modifiers show current condition, and in existing modifiers such as chained/caged for disabled or deprecated, glowing/on fire for hot or critical, and size for depth. (source: CAST and Georgian Node System.md)

Typical forms:
- glowing = important or active
- cracked = unstable
- frozen = inactive or outdated
- armored = protected
- burning = critical bottleneck
- chained = disabled
- tiny = helper, subordinate, or clone
- gigantic = hub, root, or dominant structure

Best use:
- debugging
- prioritization
- dynamic systems
- versioned knowledge

### 4. Relation Tags
![tagging4](../images/Tagging4.png)
Relation tags answer: **What does it connect to?**

This is the core of [CAST](./cast-overview.md). The relation itself becomes the tag: commands, feeds, blocks, transforms, amplifies, depends on, and so on. The scene encodes not just that two things are linked, but what kind of link it is. (source: CAST and Georgian Node System.md; FRAMEWORK_OVERVIEW.md)

Typical forms:
- pushing = causes
- wall/block = prevents
- pipe/flow = feeds or supplies
- chain/tether = depends on
- machine = transforms
- megaphone/spread = amplifies or broadcasts

Best use:
- systems
- codebases
- causal reasoning
- architecture

### 5. Pattern Tags
![tagging5](../images/Tagging5.png)
Pattern tags answer: **What larger structure does this resemble?**

Neural OS already uses pattern libraries in two places: [Lego Skills](./lego-skills-patterns.md) for graph structures and HEART pattern tags for people. A recurring structure can be chunked into one familiar shape such as spiral, bottleneck, cascade, bridge, hub-spoke, or "explosion-regret." (source: CAST and Georgian Node System.md; PATTERN_LIBRARY_TEMPLATE.md; PEOPLE_PALACE_STRUCTURE.md)

Typical forms:
- spiral = recursion or amplifying loop
- narrowing corridor = binary search or progressive elimination
- circle = feedback loop
- choke point = bottleneck
- tree = hierarchy
- domino line = cascade
- bridge = single fragile connection between clusters

Best use:
- expertise
- transfer learning
- rapid recognition
- compression of complex structures

### 6. Temporal Tags
![tagging6](../images/Tagging6.png)
Temporal tags answer: **When does it happen?**

Neural OS already encodes time through ordered routes, biography, timeline walks, delay placement, and state changes over time. Moving deeper into a palace can mean moving later in history or process evolution. (source: CAST and Georgian Node System.md; Concept Encoding Protocol.md)

Typical forms:
- left to right = sequence
- deeper into palace = later in time
- rising = growth
- falling = decay
- circular return = cycle
- delayed echo or long path = lag
- pulsing = repeated trigger

Best use:
- history
- algorithms
- process tracking
- systems with delays

### 7. Priority Tags
![tagging7](../images/Tagging7.png)
Priority tags answer: **How important is it?**

This dimension is present in CAST but not yet named as a general tag family. Bridges receive stronger encoding, hubs get central placement and stronger exaggeration, and review schedules prioritize hubs and bridges over leaves. UMTF generalizes that into a first-class salience layer. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md)

Typical forms:
- giant = crucial
- bright/glowing = high priority
- loud = urgent
- centered = foundational
- repeated = frequent use
- gold/crown = core or primary instance
- doorway placement = structurally critical bridge

Best use:
- triage
- review scheduling
- system diagnosis
- deciding what deserves full encoding

#### Priority value classes

For lifecycle purposes, Priority is also discretized into four named tiers. These tiers are read by the [Lifecycle Manager](./lifecycle-manager.md) to decide retirement behavior, and they sit on top of the perceptual cues above (e.g. `core` cards still get crown / centered / glowing imagery; `disposable` cards get faint / peripheral / fading imagery).

| Tier | Meaning | Lifecycle behavior |
|---|---|---|
| `core` | Crucial, foundational, frequently used | Never auto-cools. Manual retirement only. |
| `standard` | Default value, normal SR cycle | Subject to all retirement triggers normally. |
| `low` | Useful but not central | Subject to all triggers; faster supersedence threshold. |
| `disposable` | Captured speculatively, may not retain | 14-day Active window, then auto-cools to Cold unless upgraded. |

The `disposable` tier is a deliberate addition to support speculative capture without committing to long-term retention. See [lifecycle-manager](./lifecycle-manager.md) for the full retirement contract.

## Mapping UMTF Back to Existing Neural OS Frameworks

This table is a synthesis map showing which tag families dominate each existing method. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md; FRAMEWORK_OVERVIEW.md; Concept Encoding Protocol.md)

| Framework | Dominant tag types | What it mainly solves |
|---|---|---|
| Memory Palace | Spatial, Temporal, Priority | Stable placement, traversal, hierarchy, order |
| Concept encoding / NEDF | Sensory, State, Priority | Making a single concept vivid and discriminable |
| [CAST](./cast-overview.md) | Relation, Spatial, State, Temporal, Priority | Encoding systems, graphs, dependencies, flows |
| SPEAR / ordered route methods | Temporal, Spatial, State | Encoding procedures, algorithms, and sequences |
| HEART / People Palace | Spatial, Sensory, Pattern, Priority | Organizing people, traits, behavioral loops |
| Pattern libraries | Pattern, Priority | Fast recognition and transfer across cases |

## Default Encoding Order

Use this order unless a specific framework already imposes a stronger one. This ordering is a synthesis guideline introduced here. (source: FRAMEWORK_OVERVIEW.md; CAST and Georgian Node System.md)

1. **Choose the spatial anchor first** if the material has more than one part.
2. **Assign the primary representation** for the thing itself.
3. **Add state** so the item is not generic.
4. **Add relation or pattern** depending on whether the difficulty is interaction or structure.
5. **Add temporal meaning** if order, history, or delay matters.
6. **Add priority cues** to hubs, bridges, roots, bottlenecks, and frequently used items.
7. **Add sensory polish last** when the image is weak or collides with another.

The count of channels spent is itself a decision, owned by [encoding-dimensionality](./encoding-dimensionality.md): this vocabulary makes a second dimension *available*, and that page says when spending one is worth it and when a list is the correct call. This order says what to assign and in what sequence; it does not say **how many** channels one item can carry before the scene stops being one percept, nor which channels survive a *backward* question. [multi-attribute-encoding](./multi-attribute-encoding.md) takes that up — it is the per-item application of this vocabulary, and it adds the working budget (three to four assigned channels) plus the sorted/unsorted split that decides which channel an inverse-lookup attribute belongs on.

## Orthogonality Rules

These rules are the main discipline UMTF adds on top of the existing methods. They are synthesis guidelines, not direct source language. (source: CAST and Georgian Node System.md; PEOPLE_PALACE_STRUCTURE.md)

- One tag type should answer one question only.
- Do not let the same cue mean two different things inside the same local system.
- Use spatial tags for structure before inventing extra symbolic tags.
- Use state tags for condition, not identity.
- Use priority tags sparingly. If everything glows, nothing glows.
- Use sensory tags to separate collisions, not as decoration.
- Keep mappings stable after assignment unless you are deliberately rebuilding the whole encoding.

## Decision Guide

If you are unsure which tag family to emphasize, ask which retrieval failure is most likely. (source: FRAMEWORK_OVERVIEW.md; CAST and Georgian Node System.md; MULTIDIMENSIONAL_vs_UNIDIMENSIONAL_ENCODING.md)

- If you lose **where things belong**, strengthen spatial tags.
- If items feel **same-ish**, strengthen sensory and state tags.
- If you know parts but not **interactions**, strengthen relation tags.
- If the problem repeats in many forms, strengthen pattern tags.
- If you forget **order, lag, or evolution**, strengthen temporal tags.
- If you study too much low-value detail, strengthen priority tags.

## Why This Matters

The main gain from UMTF is not more complexity. It is consistency. Instead of treating palace geometry, adjectives, verb scenes, pattern libraries, and urgency markers as separate tricks, UMTF treats them as one reusable tagging language. That makes it easier to design new encodings, compare methods, and extend Neural OS without inventing fresh conventions every time. (source: CAST and Georgian Node System.md; FRAMEWORK_OVERVIEW.md; MULTIDIMENSIONAL_vs_UNIDIMENSIONAL_ENCODING.md)

## Domain Dialects: spine plus presets

UMTF's seven families are the **general spine** — the part of the tagging language that is invariant across codebases, people, systems, and concepts. But no single tag vocabulary fully fits every domain: each domain has primitives the spine cannot name (a cybersecurity attack tree, a networking packet-walk, a proof's inference step). The [software-design-principles-for-neural-os](./software-design-principles-for-neural-os.md) §Domain Dialects contract resolves this without bloating the spine: domains add **dialects** — presets that extend the seven families with domain-specific primitives, sigils, and templates — while the seven families themselves stay closed. This is the Open/Closed split applied to the tag language, and it is why UMTF is described as reusable *across* domains rather than identical *in* every domain. The Orthogonality Rules above are the lock that keeps it safe: a dialect may add primitives but must not re-map an existing family's meaning. The cognitive-science floor under "no one tag set fits all domains" is [factual-knowledge-precedes-skill](./factual-knowledge-precedes-skill.md). (source: software-design-principles-for-neural-os.md §Domain Dialects; factual-knowledge-precedes-skill.md)

## Operational Use

For a step-by-step application checklist, use [umtf-operational-template](./umtf-operational-template.md). That page converts the tag taxonomy here into a minimal encoding procedure. This workflow link is a synthesis convenience added for practical use. (source: CAST and Georgian Node System.md; FRAMEWORK_OVERVIEW.md)

## Diagrams

Seven universal tag families arranged around the central UMTF hub:

![umtf schematic](../diagrams/10-universal-mental-tagging-framework.png)

Hero — the craftsman's atelier metaphor: a single artifact projected through seven hand-cast lenses, each tinted a different color and producing a different aspectual reading on the wall behind:

![umtf hero](../diagrams/heroes/universal-mental-tagging-framework.png)

## Related Pages

- [umtf-operational-template](./umtf-operational-template.md)
- [encoding-dimensionality](./encoding-dimensionality.md)
- [multi-attribute-encoding](./multi-attribute-encoding.md)
- [CAST System](./cast-overview.md)
- [nodes-and-edges](./nodes-and-edges.md)
- Memory Palace
- [Lego Skills Patterns](./lego-skills-patterns.md)
- [lifecycle-manager](./lifecycle-manager.md)
- system-delays-and-lags
- [dynamic-edge-encoding](./dynamic-edge-encoding.md)
- Encoding Mechanisms
- Mnemonics


---

## U — See (CAST)
1. Tags as perceptual retrieval dimensions
2. Unifies spatial/sensory/state/relation/pattern/temporal/priority cues

## D — Name (NEDF)
1. UMTF = universal mental tagging framework
2. Distinguisher: tags as perception, not text labels
3. Failure mode: treating tags as keywords

## F — Do (SPEAR)
1. Encoding → assign tag dimensions
2. Retrieval → cue via tags

## B — Watch (HEART)
1. Tag-as-text drift
2. Missing perceptual binding

## L — Predict (ORACLE)
1. Material → predict tag dimensions
2. Tag set → predict retrieval cues

## R — Act (GRACE)
1. Encoding → apply UMTF
2. Retrieval failing → check tag perception

## Mnemonic

**Seven types, seven questions — one each.** *Where* is it (Spatial) · *how does it feel* (Sensory) · *what condition* (State) · *what does it touch* (Relation) · *what does it resemble* (Pattern) · *when* (Temporal) · *how important* (Priority). The whole discipline compresses to one line: **if two tags answer the same question, one of them is wrong.**

## Checksum

1. Name the seven tag types and the single question each one answers.
2. State the orthogonality rule in one line.
3. You keep losing track of where things belong. Which tag family does the decision guide send you to strengthen, and which would it send you to for "items feel same-ish"?

