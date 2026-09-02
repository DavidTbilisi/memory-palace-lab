---
palace: meta-knowledge
level: 5
domain: 10
room: 8
semantic_mode: 5
wiki_source: wiki/problem-solving/creative-thinking-os.md
---

# Creative Thinking OS

**Summary**: Divergent-thinking drill ladder that depthens the Generate step in [frame-forge](./frame-forge.md). Routes through SCAMPER, analogical leap, and constraint-flipping; quality-gated by [bridge-load](./bridge-load.md) for analogy soundness.

**Sources**: Skill-list infographics shared 2026-05-17 — WEF Core Skills 2030 ("Creative thinking", "Curiosity and lifelong learning"), Quiet People = Powerful (Innovation, "out-of-the-box ideas", Critical Thinking).

**Last updated**: 2026-05-17 (stub)

---

## Premise

The wiki's existing problem-solving stack treats Generate (in FRAME FORGE) as a single box. That box hides three distinct moves: **vary** (SCAMPER-style transformations of an existing solution), **bridge** (analogical leap from a distant domain — see [bridge-load](./bridge-load.md)), and **flip** (constraint-removal or constraint-inversion). Trained separately, they recombine in the Generate slot.

This page covers: Creative Thinking · Innovation · Divergent thinking · Idea generation.

## Routing skeleton

- **Vary**: SCAMPER as a [NEDF](./nedf-overview.md) deck (Substitute · Combine · Adapt · Modify · Put-to-other-use · Eliminate · Reverse) — each with Distinguisher and Failure
- **Bridge**: [bridge-load](./bridge-load.md) BRIDGE templates — produce analogies under the existing LOAD scoring (so bad analogies don't enter Generate)
- **Flip**: constraint audit drill — list all assumed constraints, mark each "real vs habitual", remove or invert habitual ones
- **Procedure**: SPEAR — generation session as scene (prompt) → Preconditions (defer-judgment, quota = N ideas in M minutes) → Execution (Vary→Bridge→Flip sweep) → Alternatives → Repair
- **Convergence**: hand off to [decision-kernel](./decision-kernel.md) / [frame-forge](./frame-forge.md) Evaluate step — divergent ideas are raw material, not output
- **Measurement**: [METER](./meter-overview.md) — `idea_event` with technique-tag, idea-yield, downstream-keep-rate

## To expand

- 7-card SCAMPER NEDF deck
- 5-template BRIDGE-for-creativity pack (re-uses [bridge-load-templates](./bridge-load-templates.md) but seeded for ideation, not learning)
- Constraint-audit prompt list (assumed audience, assumed budget, assumed sequence, assumed material, assumed permission)
- Pass criteria (quota-hit rate; downstream-keep-rate >0 — generation that survives evaluation)
- Failure modes (idea-as-judgment-deferred-forever · novelty-as-end-not-means · solo-only · analogy-without-LOAD-score)

## Related pages

- [frame-forge](./frame-forge.md)
- [bridge-load](./bridge-load.md)
- [problem-solving-os](./problem-solving-os.md)
- [decision-kernel](./decision-kernel.md)
- [music-generation-frameworks](./music-generation-frameworks.md) — the SCAMPER deck reused as a prompt-mutation operator set for text-to-music models


---

## U — See (CAST)
1. Divergent-thinking drill ladder for Generate step
2. SCAMPER, analogical leap, constraint-flipping

## D — Name (NEDF)
1. Creative thinking OS = Generate-step depth layer
2. Distinguisher: quality-gated by BRIDGE LOAD for soundness
3. Failure mode: ungated brainstorming

## F — Do (SPEAR)
1. Generate phase → run SCAMPER + analogical + flip
2. Filter through BRIDGE LOAD

## B — Watch (HEART)
1. Skipping the quality gate
2. Anchoring on first idea

## L — Predict (ORACLE)
1. Method → predict idea class
2. Constraint flip → predict new pathway

## R — Act (GRACE)
1. Generate stage → run divergent set
2. Idea → gate through BRIDGE