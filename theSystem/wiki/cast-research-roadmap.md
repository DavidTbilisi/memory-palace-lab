---
palace: tactical-memory
level: 4
domain: 10
room: 1
para: project
semantic_mode: 5
glyph: 🔌
wiki_source: wiki/encoders/cast-research-roadmap.md
---

# CAST Research Roadmap: Critical Upgrades

**Summary**: Gap registry for the CAST system — what's missing, what to learn next, and how each upgrade plugs back into the framework. Sister page to [cast-ingest-summary](./cast-ingest-summary.md) (status snapshot).

**Sources**:
- wiki/cast-overview.md
- wiki/cast-ingest-summary.md
- wiki/systems-thinking-foundations.md

**Last updated**: 2026-08-20 (§Visual authored — diagram replaces the TODO stub); 2026-08-20 (§Checksum authored — 3 falsifiable retrieval questions replace the TODO stub); 2026-08-20 (§Mnemonic authored — TODO stub replaced with a real device); 2026-08-20 (`glyph:` re-picked 🧭 → 🔌 — the page's own words — “how each upgrade plugs back into the framework”; [representation-rules](./representation-rules.md) Rule 11); 2026-08-20 (`glyph:` assigned — [representation-rules](./representation-rules.md) Rule 11); 2026-05-27

**Purpose**: Identify gaps in current CAST system and prioritize research to fill them.

**Status**: Roadmap created 2026-04-30 | **Phase 1 COMPLETE** 2026-05-27 (Axenovich *Graph Theory* KIT ingest — 11 pages under `wiki/graph-theory/`) | Phases 2–5 remain open

---

## 1️⃣ Knowledge Graphs (CRITICAL)

**Why it matters**: CAST encodes graphs intuitively, but graph theory has formal tools we're missing.

**Learn**:
- **Node centrality** (degree, betweenness, closeness, eigenvector)
  - *CAST upgrade*: Identify which nodes matter most (beyond just in-degree)
  - *Application*: Know which nodes to memorize first, which to focus on
  
- **Clustering** (detecting communities/subgraphs)
  - *CAST upgrade*: Automatic cluster detection before Step 0
  - *Application*: Pre-chunk networks into natural groups
  
- **Graph traversal** (DFS, BFS, topological sort)
  - *CAST upgrade*: Optimal palace walk paths
  - *Application*: Which direction to walk a graph for best recall?
  
- **Bridges** (edges whose removal disconnects the graph)
  - *CAST already covers this* but formalize it
  - *Application*: Automatic bridge detection in Step 0
  
- **SCCs** (Strongly Connected Components — maximal cycles)
  - *CAST upgrade*: Formal cycle detection beyond simple feedback loops
  - *Application*: Handle complex multi-node feedback systems

**Impact on CAST**: 
- Automate Step 0 analysis
- Smarter node prioritization (not just in-degree)
- Better cluster detection (natural palace rooms)
- Formal cycle analysis (beyond "amplifying vs stabilizing")

**Research sources** (to ingest):
- Introduction to Algorithms (CLRS) — Chapters 22-26
- Graph databases research papers
- NetworkX documentation (Python library)

---

## 2️⃣ Systems Thinking (CRITICAL)

**Why it matters**: Feedback loops in CAST are encoded, but systems thinking provides the **language** for understanding them.

**Learn**:
- **Feedback loops** (reinforcing vs balancing, delays, polarities)
  - *CAST upgrade*: More nuanced loop encoding (not just amplifying/stabilizing)
  - *Application*: Encode time-delayed effects, multi-step feedback
  
- **Stocks and flows** (accumulation, depletion, rates)
  - *CAST upgrade*: Encode quantities and accumulation in edge scenes
  - *Application*: "How much flows through this edge per cycle?"
  
- **Delays** (in perception, decision, response)
  - *CAST upgrade*: Explicit delay encoding in palace geography
  - *Application*: Know when a system takes time to respond
  
- **System archetypes** (shifting the burden, tragedy of the commons, fixes that fail)
  - *CAST upgrade*: Pre-encoded templates for common system behaviors
  - *Application*: Recognize system patterns instantly

**Impact on CAST**:
- Deeper feedback loop understanding
- Formal time-delay encoding
- System archetype templates (like Lego Skill patterns but for behavior)
- Better biography encoding (causal chains with delays)

**Research sources** (to ingest):
- "Thinking in Systems" by Donella Meadows
- System Dynamics research papers
- Causal loop diagrams literature

---

## 3️⃣ Cognitive Load Theory (CRITICAL)

**Why it matters**: The entire CAST system exists to fight cognitive overload. Formalize it.

**Learn**:
- **Intrinsic load** (complexity of the graph itself)
  - *CAST upgrade*: Recognize unsolvable complexity (graph too big, too connected)
  - *Application*: Know when to simplify the graph vs. encode as-is
  
- **Extraneous load** (complexity from poor encoding)
  - *CAST upgrade*: Optimize scene vividness, palace placement, merge quality
  - *Application*: [REMAPS](./remaps.md) becomes systematic (not just "if weak, improve")
  
- **Germane load** (useful processing toward learning)
  - *CAST upgrade*: Deliberate practice that builds real schema
  - *Application*: Know which walk patterns build true understanding

- **Graph explosion** (dense graphs become unbearable)
  - *CAST upgrade*: Formal graph reduction techniques
  - *Application*: Know when to use sub-palaces vs. single palace

**Impact on CAST**:
- Systematic scene quality guidelines
- Graph reduction techniques (SCAMPER formalized)
- Optimal review strategies for different load types
- Deliberate practice design

**Research sources** (to ingest):
- "Cognitive Load Theory" research (Sweller, Paas, Ayres)
- "Peak" by Anders Ericsson (deliberate practice)
- Visual complexity research

---

## 4️⃣ Distributed Systems Visualization (SOURCE OF IDEAS)

**Why it matters**: Modern distributed systems face graph problems CAST solves. Their visualization techniques are inspiration.

**Learn**:
- Service mesh diagrams (Istio, Linkerd)
  - *Idea source*: How do they simplify 1000-node systems?
  - *Application*: Adapt their visualization hierarchy for CAST
  
- Dependency graphs (Maven, Gradle, Docker)
  - *Idea source*: How do they show causality and versioning?
  - *Application*: Timeline encoding, version evolution in palaces
  
- Traffic flow visualization (network monitoring tools)
  - *Idea source*: How do they show bottlenecks and loops?
  - *Application*: Dynamic edge encoding (showing load/stress)
  
- Tracing systems (Jaeger, Zipkin)
  - *Idea source*: How do they handle 10M-edge call graphs?
  - *Application*: Temporal encoding, path highlighting

**Impact on CAST**:
- Better hierarchical visualization patterns
- Dynamic edge encoding (showing flow intensity)
- Bottleneck visualization techniques
- Temporal path reconstruction

**Research sources** (to ingest):
- Istio architecture documentation
- System tracing research papers
- Open-source visualization libraries (D3.js, Cytoscape.js)

---

## 5️⃣ Graph Compression (VERY CRITICAL)

**Why it matters**: The biggest scaling problem for CAST is handling massive graphs. Compression is the answer.

**Learn**:
- **Subnetwork abstraction** (collapsing groups into single nodes)
  - *CAST already does this* with sub-palaces but formalize it
  - *Application*: Automatic subgraph detection, when to abstract
  
- **Recurring motifs** (patterns that repeat, encode once)
  - *CAST upgrade*: Beyond Lego Skills patterns, find repeated structures
  - *Application*: Pre-compressed encoding for common subgraph shapes
  
- **Hierarchical abstraction** (multi-level views of same graph)
  - *CAST upgrade*: [Zoom-in/zoom-out](./zoom-in-zoom-out.md) formalized (the [structure-first](./structure-first.md) method; CAST's own multi-resolution zoom table is the n=4 instance)
  - *Application*: Walk a 100-node graph by walking 5 abstractions
  
- **Lossy compression** (what can we drop without losing meaning?)
  - *CAST upgrade*: Formal rules for what edges can be ignored
  - *Application*: SCAMPER + Cognitive Load Theory integrated
  
- **Symmetry exploitation** (identical nodes/edges need encoding only once)
  - *CAST upgrade*: Detect and encode symmetric subgraphs
  - *Application*: Twins, clones, redundant paths

**Impact on CAST**:
- Handle 100+ node systems (current max ~50)
- Automatic motif detection
- Formal "what to remember" rules
- Compression techniques for non-engineers

**Research sources** (to ingest):
- Graph compression research papers
- Circuit simplification (EDA) techniques
- Data structure compression literature
- Knowledge graph summarization papers

---

## Integration Plan

### Phase 1: Knowledge Graphs Foundation
**Priority**: ✅ COMPLETE (2026-05-27 — Axenovich *Graph Theory* KIT 2020 ingest)
**Time**: DONE
**Output**: 
- Formal graph theory vocabulary for all CAST informal terms (graph-theory-overview)
- Connectivity theory: κ(G), λ(G), bridges, cut-vertices, blocks (graph-connectivity)
- Matching + flow theory: Hall's theorem, König, Ford-Fulkerson (matching-theory, network-flows)
- Extremal + random graph theory: Turán, Ramsey, G(n,p), probabilistic method (extremal-graph-theory, ramsey-theory, random-graphs)
- Planarity, coloring, Hamiltonicity (planar-graphs, graph-colorings, hamiltonian-cycles)

**Wiki pages created** (all under `wiki/graph-theory/`):
- `axenovich-graph-theory.md` — source summary hub
- `graph-theory-overview.md` — foundations hub; closes 7 broken DSA cross-links
- `graph-connectivity.md`
- `matching-theory.md`
- `planar-graphs.md`
- `graph-colorings.md`
- `network-flows.md`
- `hamiltonian-cycles.md`
- `extremal-graph-theory.md`
- `ramsey-theory.md`
- `random-graphs.md`

---

### Phase 2: Systems Thinking Language
**Priority**: 🔴 CRITICAL (complements Phase 1)
**Time**: 2-3 weeks
**Output**:
- Formal feedback loop taxonomy
- Stocks/flows encoding
- Delay formalization
- System archetype templates

**Wiki pages to create**:
- `systems-thinking-foundations.md`
- `feedback-loop-taxonomy.md`
- `stocks-and-flows.md`
- `system-delays.md`
- `system-archetypes.md`

---

### Phase 3: Cognitive Load Formalization
**Priority**: 🟠 HIGH (improves all CAST work)
**Time**: 2-3 weeks
**Output**:
- Scene quality guidelines (systematic REMAPS)
- Graph complexity assessment tool
- Deliberate practice design
- Optimal load balancing

**Wiki pages to create**:
- `cognitive-load-theory.md`
- `graph-complexity-assessment.md`
- `scene-quality-guidelines.md`
- `deliberate-practice-design.md`

---

### Phase 4: Distributed Systems Inspiration
**Priority**: 🟡 MEDIUM (source of techniques)
**Time**: 1-2 weeks
**Output**:
- Visualization hierarchy techniques
- Dynamic edge encoding
- Service mesh patterns (reusable)
- Bottleneck visualization

**Wiki pages to create**:
- `distributed-systems-patterns.md`
- `visualization-hierarchies.md`
- `dynamic-edge-encoding.md`

---

### Phase 5: Graph Compression (The Multiplier)
**Priority**: 🔴 CRITICAL (enables 10x scale)
**Time**: 3-4 weeks
**Output**:
- Automatic motif detection
- Subgraph abstraction rules
- Lossy compression guidelines
- Symmetry exploitation

**Wiki pages to create**:
- `graph-compression-foundations.md`
- `motif-detection-and-encoding.md`
- `hierarchical-abstraction.md`
- `lossy-compression-rules.md`
- `symmetry-exploitation.md`

---

## Proposed Research Schedule

### Week 1-3: Knowledge Graphs
- Read CLRS Chapters 22-26
- Read graph theory papers
- Experiment with NetworkX
- Create `graph-theory-foundations.md` and supporting pages

### Week 4-6: Systems Thinking
- Read "Thinking in Systems"
- Study system dynamics models
- Learn causal loop diagramming
- Create systems thinking pages
- **Integrate with CAST**: Enhance feedback loop encoding

### Week 7-9: Cognitive Load
- Read cognitive load research
- Study deliberate practice
- Analyze visual complexity
- Create cognitive load pages
- **Integrate with CAST**: Formalize REMAPS, practice design

### Week 10-11: Distributed Systems (lighter, inspiration-focused)
- Study service meshes
- Analyze visualization techniques
- Study tracing systems
- Create distributed systems pages
- **Extract patterns**: Adapt hierarchies, dynamic encoding

### Week 12-15: Graph Compression
- Read compression papers
- Study motif discovery algorithms
- Learn symmetry exploitation
- Create compression pages
- **Integrate with CAST**: Handle 100+ node graphs

---

## Impact Timeline

| Phase | Weeks | Current CAST Capability | Post-Research Capability |
|-------|-------|------------------------|--------------------------|
| Now | 0 | Encode 5-50 node graphs intuitively | Same |
| KG + ST | 6 | Encode 5-50 nodes with intuitive step 0 | Encode 5-50 nodes **with formal analysis** |
| + CLT | 9 | Manual scene optimization | **Systematic optimization** |
| + Compression | 15 | Hit overload at ~50 nodes | Encode **100+ node systems formally** |

---

## Questions for Direction

**Should we:**
1. **All five in sequence** (comprehensive, 15 weeks)
2. **KG + Systems first, then reassess** (6 weeks, see impact)
3. **Focus on Graph Compression first** (skip to scaling)
4. **Custom priority** (you choose order)

**Recommendation**: Start with **Knowledge Graphs + Systems Thinking** (Phases 1-2, weeks 1-6). These unlock formal analysis. Then assess if compression is urgent or if other phases matter more.

---

## Success Metrics

After each phase, we should be able to:

- **KG phase**: Automatically analyze any graph (centrality, bridges, cycles)
- **ST phase**: Encode feedback loops with formal timing and archetypes
- **CLT phase**: Design deliberate practice for any graph
- **Compression phase**: Handle 100-node systems efficiently

---

## Related Pages

- [CAST Overview](./cast-overview.md) — current system before upgrades
- [Maturity Levels](./maturity-levels-overview.md) — will evolve as research completes
- Step 0 Analysis — will be formalized with graph theory

---

## U — See (CAST)
1. Gap registry: what's missing in current CAST
2. Edges: gap → research item → expected upgrade

## D — Name (NEDF)
1. CAST Research Roadmap = gap analysis + priorities
2. Forward-looking; sister to CAST Ingest Summary (status)
3. What we know we don't know

## F — Do (SPEAR)
1. New gap surfaced → log here
2. Prioritize by impact × effort
3. Research lands → close item; update ingest summary

## B — Watch (HEART)
1. Gaps open for months without movement
2. Research items without exit criteria
3. New ideas added without prioritization

## L — Predict (ORACLE)
1. Gap density predicts where CAST will improve next
2. Stale roadmap → priorities have shifted

## R — Act (GRACE)
1. New CAST limitation hit → log gap here
2. Research lands → close item, surface delta

## Mnemonic

**"Five sockets, one board."** Each gap says both what plugs in *and where it plugs back* — a gap with no return path is a reading list, not a roadmap. That return path is what makes this a registry rather than a wish.

## Checksum

1. Besides naming the gap, what must every entry in this registry state?
2. Name two of the registered gaps.
3. What distinguishes this registry from a reading list?


## Visual

**Five sockets, one board** — every gap names what plugs in *and where it plugs back*.

```
        ┌─────────────────────── CAST ───────────────────────┐
        │                  (the board)                       │
        └──┬────────┬────────┬────────┬────────┬─────────────┘
           │        │        │        │        │
        ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
        │know-│  │systems│ │cogni-│ │distri│ │graph│
        │ledge│  │think- │ │tive  │ │buted │ │comp-│
        │graph│  │ing    │ │load  │ │ viz  │ │ress │
        └─────┘  └───────┘ └──────┘ └──────┘ └─────┘
          ▲                                      ▲
          └──── each has a return path ──────────┘
```

A gap with no return path is a **reading list**. The return path is what makes this a registry.

