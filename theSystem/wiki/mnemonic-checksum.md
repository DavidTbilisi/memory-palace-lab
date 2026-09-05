---
palace: strategic-memory
level: 7
domain: 10
room: TBD
para: resource
semantic_mode: 5
glyph: 💥
wiki_source: wiki/encoders/mnemonic-checksum.md
---

# Mnemonic Checksum — graph integrity at four nested levels

**Summary**: The principle that **a well-built scene breaks obviously when a piece is missing**, applied at four nested levels of a [CAST](./cast-overview.md) graph — scene · bundle · cluster · graph. Each level makes one class of loss *visible at recall time* rather than silently absent. This page is the owner of the four levels; [image-merging](./image-merging.md) implements Level 1 and [edge-sign](./edge-sign.md)'s loop-sign check joins the family without renumbering it.

**Sources**:
- `raw/Neural OS Book/CAST and Georgian Node System.md` §Mnemonic Checksum — graph integrity at four levels (lines 1139–1158) — the four levels, the peg-per-bundle mechanism, and the palace-entrance node count
- [image-merging](./image-merging.md) §Incoherence is the checksum — the Level 1 implementation, written before this owner page existed
- [edge-sign](./edge-sign.md) §The unlock: loop-sign checksum — the graph-level check that complements these four
- 2026-09-04 session: page written to close a four-month orphan-by-omission (cited as owner from two live pages, never authored)

**Last updated**: 2026-09-04 — page created.

---

## The principle

> A merged scene that is missing an element does not come back *slightly wrong*. It comes back **incoherent** — and incoherence is loud.

That is the whole mechanism. A checksum in software detects corruption because the check value stops matching; a mnemonic checksum detects loss because the *image stops making sense*. Both work for the same reason: the redundancy was built in at write time, not bolted on at read time.

The failure this defends against is the one that gives no symptom. Per [image-merging](./image-merging.md), stacked-but-unfused attributes fail **silently** — the surviving elements still make the item feel recalled. A checksum's only job is to convert a silent loss into a noisy one.

## The four levels

They are **nested**, not parallel: each level checks a larger container than the one below it, and a graph can pass every level below and still fail the one above. Because they are ordered, they take a ladder rather than a count-shape ([representation-rules](./representation-rules.md) Rule 10). These four are *not* one of the registered stage axes — see [skill-progression-stages](./skill-progression-stages.md) for those.

| Level | Container | What is encoded as the check | How a loss announces itself |
|---|---|---|---|
| **1 — Scene** | one node·edge·node image | the merge itself — no element removable | animals no longer interacting; a stream with nowhere to go |
| **2 — Bundle** | one node's outgoing edges | a [peg](./peg-system.md) object for the **count**, fused to the node's animal | you recall 3 entries but the peg-4 door is still there |
| **3 — Cluster** | one room of tightly-connected nodes | the group image — all animals interacting at once | a missing animal leaves a visible hole in the room |
| **4 — Graph** | the whole palace | total node count at the palace entrance, in Major system | the walk's tally does not match the entrance number |

### Level 1 — Scene integrity

Owned in full by [image-merging](./image-merging.md). If any element is removed from a merged node-edge-node image, the scene becomes incoherent. The finishing test is stated there: *can you remove one element without the image collapsing?* If yes, keep merging. (source: CAST and Georgian Node System.md)

### Level 2 — Bundle integrity

Encode the **count** of outgoing edges explicitly as part of the node scene, using a [peg](./peg-system.md) object physically attached to the node's animal — 1 bun · 2 shoe · 3 tree · 4 door · 5 hive. *An eagle perched on a door* = this node has four outgoing edges.

This is the level that catches the most common real loss. Walking a bundle, you retrieve three edges and stop; nothing about three edges feels wrong on its own. The peg-4 door is what makes the fourth edge's absence a *present* sensation rather than an absent one. Note the division of labour with [nodes-and-edges](./nodes-and-edges.md) §Bundle Size Limit: that page caps how many edges a bundle may hold, this level verifies how many it actually held. (source: CAST and Georgian Node System.md)

### Level 3 — Cluster integrity

A cluster should feel like one coherent scene that breaks if a node is removed — all the animals in one room interacting simultaneously, not standing in a line. This is Level 1's rule applied one container up, and it is why [chunking](./chunking.md)'s cluster collapse and this level are the same move seen from two sides: a cluster tight enough to chunk is a cluster tight enough to checksum. (source: CAST and Georgian Node System.md)

### Level 4 — Graph integrity

After a full walk, count the nodes visited. If the count does not match the encoded total, a node is missing. Encode that total in the **palace entrance scene** using the Major system, so the check is the first thing you see on entering and the last thing you compare on leaving. (source: CAST and Georgian Node System.md)

## What the levels do *not* cover

Each level verifies **presence**, never **correctness**. A graph can pass all four with every element intact and every relation wrong — the scene is coherent, the peg matches, the room is full, the tally is right, and the edges still point the wrong way. That gap is exactly what [edge-sign](./edge-sign.md)'s **loop-sign checksum** closes: walk a cycle, multiply the signs, and an even count of − must land on the spiral (amplifying), an odd count on the leash (stabilizing). A mismatch means either a sign or a pattern choice is wrong.

That check is *graph-level but orthogonal* — it verifies the semantics of what is present rather than the completeness of what should be. It joins the family without renumbering these four.

## Failure modes

- **Encoding the check as a label instead of a percept.** "Remember: four edges" is not a checksum; a door fused to the eagle is. A check you have to *recall separately* fails at the same moment the thing it checks fails.
- **Running the check only at encode time.** These are recall-time instruments. A checksum never consulted during a walk is decoration.
- **Treating a passed checksum as understanding.** See §What the levels do not cover — presence is not correctness.
- **Skipping Level 2 because the bundle is small.** Small bundles are exactly where the missing entry is least conspicuous.

## METER

- `checksum.level_used` — which of the four fired on a given walk
- `checksum.catch_rate` — losses caught by a check ÷ losses found by any means (pass floor 60%, floor 40%)
- `checksum.false_alarm_rate` — incoherence reported where nothing was actually missing (pass < 15%)

## Related pages

- [image-merging](./image-merging.md) — implements Level 1; the merge *is* the scene checksum
- [nodes-and-edges](./nodes-and-edges.md) — the bundle Level 2 counts, and §Modifier composition for the additive modifier family
- [edge-sign](./edge-sign.md) — the loop-sign check that verifies correctness where these four verify presence
- [peg-system](./peg-system.md) — supplies the Level 2 count objects
- [chunking](./chunking.md) — cluster collapse, the same tightness Level 3 tests
- [CAST](./cast-overview.md) — the encoder these levels protect
- [REMAPS](./remaps.md) — the repair checklist to run once a check fires
- [skill-progression-stages](./skill-progression-stages.md) — registry for the wiki's numbered stage axes; these four levels are not one of them

---

## U — See (CAST)
1. Four nested containers: scene ⊂ bundle ⊂ cluster ⊂ graph
2. Each container carries its own redundancy, fused as a percept

## D — Name (NEDF)
1. Mnemonic checksum = built-in redundancy that makes loss visible at recall
2. Distinguisher: verifies **presence**, not correctness — that is the loop-sign check
3. Failure mode: the check stored as a label instead of a percept

## F — Do (SPEAR)
1. Merging an edge → can one element be removed? (L1)
2. Closing a node → fuse the peg for its out-degree (L2)
3. Leaving the palace → compare the walk tally to the entrance number (L4)

## B — Watch (HEART)
1. Bundles walked without ever consulting the peg
2. Clusters encoded as lines of animals rather than one interacting room
3. "It felt complete" accepted in place of a count

## L — Predict (ORACLE)
1. Large-bundle nodes → Level 2 pays off first there
2. Catch rate below floor for 4 weeks → the checks are being run at encode time only

## R — Act (GRACE)
1. Incoherent scene on a walk → repair via [REMAPS](./remaps.md), do not re-derive
2. Tally mismatch → re-walk before re-encoding; the node is usually present but unvisited
