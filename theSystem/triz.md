# TRIZ — Condensed Practical Subset (Cross-Domain)

TRIZ (Teoriya Resheniya Izobretatelskikh Zadatch — "Theory of Inventive
Problem Solving") was built by Genrich Altshuller and colleagues from
analysis of ~200,000 patents. The core insight: **inventive problems recur,
and their solutions recur**. Most "new" solutions are re-applications of
a small set of principles.

This file is the **cross-domain condensed version**: the tools that apply
equally well to software, math, strategy, and physical systems. The full
canonical TRIZ (40 principles × 39 parameters, ARIZ-85 algorithm, Su-Field
analysis) is engineering-weighted; what follows is the portion that
generalizes.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-triz) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The Four TRIZ Moves

TRIZ gives you four qualitatively different things, in order of frequency-of-use:

1. **Ideality** — define the ideal final result; design toward it, not around current constraints
2. **Contradictions + Separation** — identify the conflicting requirements; separate them in time, space, condition, or level
3. **20 Inventive Principles** — pattern library of historically successful solution shapes
4. **Contradiction Matrix** — given a specific contradiction, lookup which principles historically solved it

Most problems need 1 + 2. Complex problems benefit from 3 + 4.

---

## Move 1 — Ideality (IFR)

**The Ideal Final Result** is the state where the desired function happens
by itself — with no system, no cost, no downside.

"The function is performed; the thing performing it disappears."

### How to use it

1. **State the desired function in one sentence.** "I want to [verb] [object] so that [goal]."
2. **Remove the system.** Who does it if there's no tool, no resource, no implementation?
3. **Remove the cost.** What if it had zero cost (money, time, effort, space, complexity)?
4. **Work backward** from that ideal to the nearest achievable version.

### Why this move matters

Most "solutions" are incremental improvements over the current system. Ideality
forces you to describe the destination *first*, then ask what the minimum viable
approach is. Often the answer is much simpler than the current system suggests.

### Worked examples across domains

**Software:** "I want cache invalidation to be correct."
- Ideal: the cache invalidates itself, automatically, without any code — because cached items know when they're stale.
- Work back: → event-driven invalidation → write-through cache → read-through + TTL
- Current system (manual invalidation) is maximally far from ideal

**Math:** "I want to prove this theorem in fewer steps."
- Ideal: the theorem proves itself — follows immediately from a known result
- Work back: find the strongest known result that subsumes this; can the theorem be reduced to it?

**Strategy:** "I want customers to know about the product."
- Ideal: customers tell each other — product markets itself because it creates a visible change in their lives that others ask about
- Work back: what feature/property makes the product generate its own word-of-mouth?

**Physical:** "I want to prevent ice forming on a windshield."
- Ideal: no ice forms because nothing freezes — the relevant property (freezing point) disappears
- Work back: lower the freezing point → salt mixture / coating → or keep the surface above freezing

### Ideality as a heuristic

In every problem, ask:
- **"What would this look like if it were trivial?"**
- **"What's doing the useful function, and can we delete it?"**
- **"Can the problem solve itself using resources already present?"**

The last question is the most powerful. Most good TRIZ solutions are
*resources-already-present* solutions.

---

## Move 2 — Contradictions and Separation

TRIZ's signature insight: most hard problems involve a **contradiction** —
improving one thing makes another worse.

### Two kinds of contradiction

**Technical contradiction:** improving parameter A worsens parameter B.
"Making the car faster makes it less fuel-efficient."

**Physical contradiction:** the *same parameter* needs two opposite values.
"The airplane wing must be large (for takeoff) AND small (for cruising)."

Physical contradictions are the sharper form — and usually the deeper problem.
The **Separation Principles** resolve them.

### The Four Separation Principles

When a property needs to be X AND ¬X, separate X and ¬X across some dimension:

#### 2.1 Separation in Time
**Different values at different times.**

- Wing: large during takeoff (flaps extended), small during cruise (flaps retracted)
- Software: read-heavy at day, write-heavy at night → schedule batch writes
- Strategy: aggressive in early market phase, defensive once established
- Math: one parameter value during induction base case, another during step

#### 2.2 Separation in Space
**Different values at different locations.**

- Building wall: thick at the bottom (structural), thin at the top (light)
- Software: CPU-optimized code in one module, memory-optimized in another
- Organizational: centralized at HQ, decentralized in regions
- Math: different behavior in the interior vs. boundary of a domain

#### 2.3 Separation on Condition
**Different values under different conditions.**

- Umbrella: solid when open (sheds rain), flexible when closed (fits in bag)
- Software: cached when rarely changing, computed when volatile
- Strategy: explore when uncertain, exploit when confident
- Math: continuous on the interior, discrete on the boundary

#### 2.4 Separation Between System Levels
**Different values at sub-system, system, and super-system levels.**

- Chain link: rigid (sub-system) but chain is flexible (system)
- Software: individual functions pure, but the system has state
- Strategy: team members specialize (sub-system), team is versatile (system)
- Math: element-wise operations vs. set-wise properties

### How to use Separation

1. **State the contradiction as a physical contradiction:** "X must be A AND ¬A."
2. **Ask each separation principle in turn:** does A hold at one time and ¬A at another? At one location and ¬A elsewhere? Under one condition and ¬A elsewhere? At one level and ¬A at another?
3. **The first separation that fits** suggests a solution path.

### Why this matters

Most problem-solvers try to **compromise** between A and ¬A. TRIZ says:
don't compromise — separate. The contradiction dissolves when you realize
A and ¬A can coexist in different dimensions.

---

## Move 3 — The Top 20 Inventive Principles (Cross-Domain)

Altshuller's 40, condensed to the 20 that transfer cleanly across software,
math, strategy, and physical systems.

Each principle has:
- **Canonical name** (adapted for clarity)
- **Mechanism** (what it does)
- **Encoding scene** (NEDF-style for mnemonic retrieval)
- **Examples across domains**

### P1. Segmentation
**Mechanism:** Divide into independent parts. Make something more modular.
**Scene:** 🍫 A chocolate bar breaking into squares along its grooves — each piece works alone.
- Software: microservices, modules, functions
- Math: partition proof into cases
- Strategy: split a large deal into smaller stages
- Physical: flat-pack furniture

### P2. Extraction / Separation
**Mechanism:** Take out the interfering or problematic part; keep only the necessary.
**Scene:** 🔍 A surgeon lifting out one organ and leaving the rest.
- Software: extract method, extract interface
- Math: factor out a common term
- Strategy: divest non-core business unit
- Physical: noise-canceling extracts noise from signal

### P3. Local Quality
**Mechanism:** Let different parts have different properties; optimize each locally.
**Scene:** 🏠 A house with a steel frame, wooden floors, and glass windows — each where it works best.
- Software: polyglot persistence, different DBs per workload
- Math: piecewise-defined functions
- Strategy: different org structures per business unit
- Physical: composite materials

### P4. Asymmetry
**Mechanism:** Break symmetry. Make one side different from the other.
**Scene:** ⚓ An asymmetric anchor that catches on the seabed because it's off-balance.
- Software: master-replica replication (asymmetric roles)
- Math: break WLOG assumption to reveal structure
- Strategy: attack an unexpectedly asymmetric market niche
- Physical: screw threads

### P5. Merging / Consolidation
**Mechanism:** Combine similar/parallel parts. Do operations together.
**Scene:** 🧬 Two DNA strands twisting into one helix.
- Software: batch processing, SIMD
- Math: combine two sums into one
- Strategy: mergers, consolidation of overlapping teams
- Physical: combined heat-and-power plants

### P6. Universality / Multi-Function
**Mechanism:** Make one thing do the job of many.
**Scene:** 🗝️ A Swiss Army knife unfolding its blades.
- Software: generic/polymorphic interfaces
- Math: general theorem subsuming specific cases
- Strategy: multi-use asset (brand used across product lines)
- Physical: sofa-bed

### P7. Nesting (Russian Doll)
**Mechanism:** Place one object inside another, inside another.
**Scene:** 🪆 Russian dolls, each holding the next.
- Software: closures, nested scopes, recursion
- Math: inductively defined structures
- Strategy: companies owning subsidiaries owning subsidiaries
- Physical: telescoping antenna

### P8. Counterweight / Compensation
**Mechanism:** Compensate for a deficiency by combining with something that provides what's missing.
**Scene:** 🎢 A crane with counterweight balancing the load.
- Software: redundancy, checksums, error-correcting codes
- Math: add and subtract the same term to rebalance
- Strategy: hedge positions
- Physical: ballast in ships

### P9. Prior Action (Preparation)
**Mechanism:** Do useful work before it's needed.
**Scene:** 📦 Pre-packed emergency kits ready on a shelf.
- Software: pre-computation, caching, lazy evaluation turned eager
- Math: lemmas proven first to support later theorems
- Strategy: build optionality (permits, relationships) before you need them
- Physical: pre-stressed concrete

### P10. Equipotentiality
**Mechanism:** Don't fight gravity/flow — work along the same level.
**Scene:** 🛶 A canoe drifting downstream instead of paddling up.
- Software: match the grain of the data/system; don't fight the platform
- Math: choose a representation where the problem has no slope
- Strategy: align with market tailwinds rather than fight trends
- Physical: conveyor belts at one level

### P11. Inversion / Do It the Other Way
**Mechanism:** Reverse the action, the direction, or the roles.
**Scene:** ↩️ A door that opens outward instead of inward.
- Software: callback inversion (dependency injection), pull vs push
- Math: contrapositive, contradiction, work backward from conclusion
- Strategy: disrupt an incumbent by doing the opposite
- Physical: submerge rather than float

### P12. Dynamics
**Mechanism:** Make the rigid flexible; let the system change its state.
**Scene:** 🐍 A rigid rod becoming a chain of segments, flexing.
- Software: runtime config over hardcoded, hot-reloadable
- Math: parameterize a constant; generalize
- Strategy: replace fixed plans with adaptive playbooks
- Physical: adjustable furniture

### P13. Partial / Excessive Action
**Mechanism:** Do slightly less or slightly more than needed.
**Scene:** 🎨 A painter who paints *over* the canvas edge, then trims.
- Software: overprovision capacity, then scale down
- Math: prove a stronger statement to make the proof easier
- Strategy: overcommit to signal intent, scale back later
- Physical: tolerances — machine to +/- and grind to spec

### P14. Sphericity / Curvature
**Mechanism:** Replace linear with curved; use rotation.
**Scene:** ⚙️ A wheel replacing a sliding block — motion becomes rotation.
- Software: polling → event loop (circular), iterative → recursive
- Math: change Cartesian to polar coordinates to exploit symmetry
- Strategy: continuous feedback loops instead of linear plans
- Physical: ball bearings replace sliding friction

### P15. Self-Service / Self-Action
**Mechanism:** Make the system perform supplementary functions on itself.
**Scene:** 🪞 A self-cleaning oven that uses its own heat to burn off residue.
- Software: self-healing systems, garbage collection, self-hosting compilers
- Math: bootstrap an argument using its own conclusion as a temporary premise
- Strategy: user-generated content, viral loops
- Physical: self-lubricating bearings

### P16. Copying / Mediation
**Mechanism:** Work on a copy, model, or intermediary — not the real thing.
**Scene:** 🎬 A stunt double performing a dangerous stunt while the actor watches safely.
- Software: sandboxing, test environments, CI/CD
- Math: model the problem in a different space (graph theory → linear algebra)
- Strategy: A/B test before committing
- Physical: crash-test dummies

### P17. Cheap Short-Living Objects
**Mechanism:** Replace expensive durable objects with cheap disposable ones.
**Scene:** 🧻 Paper cups at a coffee shop — no washing, just throw away.
- Software: ephemeral containers, serverless functions
- Math: temporary notation that gets discarded
- Strategy: MVPs, prototypes to throw away
- Physical: disposable medical tools

### P18. Feedback
**Mechanism:** Introduce feedback — let the output influence the input.
**Scene:** 🎛️ A thermostat reading temperature and adjusting the heater.
- Software: PID controllers, autoscaling, reactive programming
- Math: fixed-point iteration, iterative solvers
- Strategy: customer feedback loops, OKRs with regular review
- Physical: cruise control

### P19. Intermediary
**Mechanism:** Insert a third entity between two interacting ones.
**Scene:** 🤝 A notary sitting between two parties, verifying the contract.
- Software: message brokers, API gateways, middleware
- Math: introduce an auxiliary variable or function
- Strategy: third-party brokers, escrow agents
- Physical: catalyst in a chemical reaction

### P20. Composite Materials (Heterogeneity)
**Mechanism:** Replace a uniform with a combination of dissimilar materials/components.
**Scene:** 🪵 Plywood — layers of wood with grain crossed for strength.
- Software: polyglot stack (different languages for different needs)
- Math: hybrid method combining algebraic and analytic tools
- Strategy: diversified portfolio
- Physical: carbon-fiber composites

---

## Move 4 — The Contradiction Matrix (Condensed 12×12)

When you have a technical contradiction — improving parameter A worsens
parameter B — the matrix tells you which principles historically resolved
that kind of conflict.

### The 12 Cross-Domain Parameters

| # | Parameter | In software | In math | In strategy |
|---|-----------|-------------|---------|-------------|
| 1 | **Speed** | latency, throughput | complexity (big-O) | time to market |
| 2 | **Size / Volume** | memory, code size | dimensions, cardinality | org size |
| 3 | **Cost** | infra $, dev hours | computational cost | budget |
| 4 | **Power / Energy** | CPU/battery | proof strength | effort required |
| 5 | **Reliability** | uptime, correctness | proof soundness | execution certainty |
| 6 | **Accuracy** | precision | tightness of bound | decision quality |
| 7 | **Complexity** | architectural complexity | conceptual complexity | organizational complexity |
| 8 | **Flexibility / Adaptability** | configurability | generality | strategic agility |
| 9 | **Information / Knowledge** | data available | information content | market intelligence |
| 10 | **Stability** | robustness | invariance | resilience |
| 11 | **Waste / Loss** | resource waste | redundancy in proof | inefficiency |
| 12 | **Maintainability** | ease of update | extensibility of proof | ease of change |

### The Matrix (row improves → column worsens)

Rows = what you want to improve. Columns = what tends to get worse. Cell = principles that historically resolved that conflict.

|  | 1 Spd | 2 Size | 3 Cost | 4 Pwr | 5 Rel | 6 Acc | 7 Cplx | 8 Flex | 9 Info | 10 Stb | 11 Wst | 12 Mnt |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **1 Speed** | — | 1,15,19 | 9,10,18 | 2,5,8 | 11,15,18 | 6,13,16 | 1,5,7 | 10,12,15 | 18,19 | 11,15 | 2,9,13 | 7,12,15 |
| **2 Size** | 1,7,15 | — | 2,5,6 | 3,10,15 | 3,11 | 2,6,20 | 1,7 | 6,12,17 | 16,19 | 2,10,20 | 2,11 | 1,6,20 |
| **3 Cost** | 9,10,17 | 6,17,20 | — | 10,13,15 | 5,11,13 | 6,13,16 | 1,2,5 | 10,15,17 | 9,16 | 2,10,11 | 11,17 | 1,17,20 |
| **4 Power** | 2,8,15 | 5,9,15 | 15,17 | — | 8,13,18 | 6,13 | 2,5 | 10,12,15 | 18,19 | 8,18 | 2,11 | 8,15 |
| **5 Reliability** | 11,15,19 | 3,11,20 | 11,13,17 | 18 | — | 6,10,18 | 1,3 | 11,12,15 | 16,18,19 | 10,11 | 2,11,16 | 11,17,20 |
| **6 Accuracy** | 6,13,16 | 2,6,20 | 6,13,16 | 6,13 | 6,10,18 | — | 3,6,16 | 6,12,16 | 16,18,19 | 10,18 | 2,6,16 | 6,12,20 |
| **7 Complexity** | 1,5,7,15 | 1,3,7 | 1,2,5,17 | 2,5 | 1,3,11 | 3,6,16 | — | 1,6,7,17 | 9,16,19 | 1,10,11 | 1,2,11 | 1,5,7,12 |
| **8 Flexibility** | 10,15,17 | 6,15,17 | 15,17,20 | 10,12,15 | 11,12,18 | 6,12,16 | 1,6,17 | — | 16,19 | 11,12,18 | 2,6,11 | 6,12,17 |
| **9 Information** | 18,19 | 16,19 | 9,16,19 | 18,19 | 16,18,19 | 16,18,19 | 9,16,19 | 16,19 | — | 10,18,19 | 2,11,16 | 16,19 |
| **10 Stability** | 10,11,15 | 2,10,11 | 2,10,11 | 8,10,18 | 10,11,18 | 10,18 | 1,10,11 | 11,12,18 | 10,18,19 | — | 2,10,11 | 10,11,20 |
| **11 Waste** | 2,9,13 | 2,6,20 | 2,5,13 | 2,9,11 | 2,11,16 | 2,6,16 | 1,2,11 | 2,11,17 | 2,11 | 2,10,11 | — | 1,2,11 |
| **12 Maintainability** | 1,7,12 | 1,6,20 | 1,17,20 | 5,15 | 1,11,20 | 6,12,20 | 1,5,7,12 | 1,6,12 | 16,19 | 10,11,20 | 1,2,11 | — |

### How to use the matrix

1. **Identify the contradiction:** "Improving X worsens Y."
2. **Find both X and Y in the 12-parameter list.**
3. **Look up the cell** (row X, column Y).
4. **The cell lists 2–4 principles** from the top 20 most historically successful at resolving this contradiction.
5. **Try each principle** as a solution candidate.

### Worked example — Software

**Contradiction:** "I need faster response time, but adding a cache adds complexity."
- X = Speed (1), Y = Complexity (7)
- Cell [1, 7] = principles 1, 5, 7
  - P1 Segmentation: cache only the slow paths, not everything
  - P5 Merging: merge related requests into one cached query
  - P7 Nesting: hierarchical cache (L1 in process, L2 shared)

### Worked example — Math

**Contradiction:** "Tightening the bound requires more complexity in the proof."
- X = Accuracy (6), Y = Complexity (7)
- Cell [6, 7] = principles 3, 6, 16
  - P3 Local Quality: tight bound only where it matters; loose bound elsewhere
  - P6 Universality: find a general theorem whose specialization gives tight bound easily
  - P16 Copying/Mediation: prove the bound in a different space (transform, then invert)

### Worked example — Strategy

**Contradiction:** "Being flexible reduces decision speed."
- X = Flexibility (8), Y = Speed (1)
- Cell [8, 1] = principles 10, 15, 17
  - P10 Equipotentiality: align with a trend so flexibility is cheap
  - P15 Self-Service: system adapts itself without central decisions
  - P17 Cheap Short-Living Objects: reversible decisions; try/discard rapidly

### When the matrix doesn't have an answer

The matrix is based on statistical patterns — it's not exhaustive. If a cell's
suggestions don't fit your problem, fall back to:
- Separation Principles (physical contradiction resolution)
- Ideality (redefine the problem around the ideal)
- Full 40 Inventive Principles (the 20 missing from this condensed list)

---

## Integration with Your System

### Heuristic Palace additions

TRIZ adds these loci to your existing palace:

**New loci in Room 1 (Understand):**
- **1.6 — The Ideality Portrait:** a painting showing the ideal final result, hanging above your desk. *Move: what would this look like with no system, no cost, no downside?*

**New loci in Room 2 (Reframe):**
- **2.7 — The Time Splitter:** a clock cut in half, one side showing A, the other ¬A. *Move: separate the contradiction across time.*
- **2.8 — The Space Splitter:** a room divided by a wall, A on one side, ¬A on the other. *Move: separate across space.*
- **2.9 — The Condition Switch:** a lightswitch with position A or ¬A. *Move: separate by condition.*
- **2.10 — The Russian Doll:** nested dolls, each with different properties. *Move: separate across system levels.*

**New loci in Room 4 (Plan) — Design Wing:**
- **4.X9 — The Contradiction Matrix Lookup:** a large matrix chart on the wall. *Move: identify the contradiction; look up the cell; try the principles.*
- The 20 Principles live in the Design Wing as individual loci (P1–P20).

### Pattern Library addition

The 20 Principles go into `domain-patterns.md` as a new library — the **TRIZ Pattern Library**. Each principle gets:
- NEDF encoding (name-hook, essence, distinguisher, failure mode)
- Anki card (symptom → principle, principle → mechanism)
- Cross-domain examples

### Decision rule — when to use TRIZ vs. other tools

| Problem shape | Use |
|---------------|-----|
| "I'm stuck and don't know what to try" | Heuristic Palace (generic) |
| "I have a clear contradiction — X improves but Y worsens" | **TRIZ Contradiction Matrix** |
| "Something needs to be A and not-A at once" | **TRIZ Separation Principles** |
| "I want to redefine the problem, not solve the current one" | **TRIZ Ideality** |
| "I need a creative re-pattern for a known problem class" | Domain Patterns Library |
| "I'm stuck on understanding, not solving" | Confusion Triage |

TRIZ is **the tool for contradictions**. Use it when the problem has a clear
"but X also needs to be Y" structure. For everything else, the existing
Heuristic Palace and pattern libraries are faster.

---

## Anti-Patterns

- **Forcing TRIZ on non-contradiction problems.** If there's no clear contradiction, TRIZ is overkill. Use the regular Heuristic Palace.
- **Treating the 20 principles as complete.** They're a starting library; some problems require principles outside this subset. Know the subset's edges.
- **Mechanical matrix lookup.** The matrix suggests; you still have to creatively apply. The principle is a hint, not an answer.
- **Ignoring Ideality.** Most TRIZ failures come from skipping the ideality move and going straight to principle lookup. Ideality reframes the problem; sometimes the contradiction dissolves.
- **Over-formalizing.** Don't bureaucratize the use of TRIZ. State the contradiction in one sentence, look up, try something.

---

## What's NOT in this file

Reserved for later, if you hit the edge of the condensed version:

- **The remaining 20 principles** (P21–P40) — preliminary anti-action, parameter change, phase transitions, thermal expansion, inert atmosphere, etc. Most are physically specific.
- **The full 39-parameter set** — more precise for engineering but overkill for cross-domain work.
- **Su-Field analysis** — specialized for physical/technical systems with substance-field interactions.
- **Laws of Technical Evolution** — useful for predicting where a product category is headed; advanced.
- **ARIZ-85** — the full algorithmic approach. Complex, better approached after you've internalized the top 20 and the separation principles.

Ask when you hit a problem that needs these.

---

## Key Principles

1. **Ideality first.** Before reaching for the matrix, define the ideal final result and work backward.
2. **Contradictions are the signal.** Hard problems almost always contain a contradiction. Find and name it.
3. **Don't compromise — separate.** Physical contradictions resolve by separation in time, space, condition, or level.
4. **Pattern-match before inventing.** Most solutions are re-applications. Check the matrix and principles first.
5. **The 20 principles transfer across domains.** The mechanism is the same; the examples differ.
6. **TRIZ complements, doesn't replace.** Use it for contradictions; use the Heuristic Palace for everything else.
7. **Resources already present > new inventions.** The best TRIZ solutions use what's already in the system.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-triz)**.

