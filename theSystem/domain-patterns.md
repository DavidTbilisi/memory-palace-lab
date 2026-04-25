# Domain Patterns — Pattern Libraries for Fast Recognition

**Orientation:** pattern libraries should grow from the problems you actually face — including **life skills, digital literacy, everyday competence, and citizenship** (see **`design-orientation.md`**) and **STEAM / STEMM** lanes (Arts: representation and design; Medicine: procedures that must stay tied to authorized training).

Real problem-solving speed comes from **pattern recognition**, not from
general heuristics. Chess masters don't reason from first principles each
move — they recognize positions. Mathematicians don't derive each proof —
they recognize proof shapes. Programmers don't design each algorithm — they
recognize which algorithm fits.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-domain-patterns) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## How Pattern Libraries Work

A pattern has six slots:

```
Name          — retrieval key
Signature     — features that trigger recognition ("this is one of those")
Mechanism     — what it computes/achieves and why it works
Canonical use — the clearest single example
Variants      — 1–3 close neighbors (distinguish them!)
Failure mode  — when it breaks / doesn't apply
```

Each pattern → one Anki card (Signature → Name + Mechanism) + one scene
(NEDF-encoded) + one locus in the relevant Heuristic Palace Wing.

**The 30-pattern threshold:** below 30 patterns, you can't pattern-match
reliably — too many gaps. Above 30, diminishing returns set in. Target 25–35
per library, then stop growing and start using.

---

## Library 1 — Algorithm Patterns (CS)

26 patterns. Mature library — use as-is; add only if you hit a gap in real work.

### A1. Two-Pointer
- **Signature:** Array, looking for a pair/triplet, window, or partition. Often sorted.
- **Mechanism:** Two indices traverse the array, converging or sliding. Avoids O(n²) nested loop.
- **Canonical:** Two-sum on sorted array.
- **Variants:** Sliding window (A3), fast/slow pointer (cycle detection), three-pointer.
- **Failure:** No ordering or monotone property; duplicates handled incorrectly.

### A2. Binary Search
- **Signature:** Monotone property over ordered space. Looking for boundary or value.
- **Mechanism:** Halve search space each step → O(log n).
- **Canonical:** Find element in sorted array.
- **Variants:** lower_bound, upper_bound, binary-search-on-answer ("smallest X where P(X) holds").
- **Failure:** Non-monotone property; no random access (linked list).

### A3. Sliding Window
- **Signature:** Contiguous subarray/substring satisfying a constraint. Usually "longest" or "minimum."
- **Mechanism:** Expand right; shrink left when invariant breaks. Amortized O(n).
- **Canonical:** Longest substring without repeating characters.
- **Variants:** Fixed-size window, variable window, multi-pointer window.
- **Failure:** Non-contiguous subsequences; window invariant not monotone.

### A4. Dynamic Programming
- **Signature:** Optimal substructure + overlapping subproblems + sequence of choices.
- **Mechanism:** Memoize subproblem results; avoid recomputation.
- **Canonical:** 0-1 knapsack, LCS, edit distance.
- **Variants:** Top-down (memoization), bottom-up (tabulation), space-optimized (rolling array), interval DP, tree DP, bitmask DP.
- **Failure:** No optimal substructure; subproblems don't overlap (use divide & conquer).

### A5. Greedy
- **Signature:** Local optimal choice leads to global optimum. Often sortable.
- **Mechanism:** At each step, take locally best option without backtracking.
- **Canonical:** Activity selection, Huffman coding, Dijkstra.
- **Variants:** Exchange argument proof, matroid-based greedy.
- **Failure:** Local best ≠ global best (0-1 knapsack breaks this). Verify via exchange argument.

### A6. Divide and Conquer
- **Signature:** Problem splits into same-type smaller subproblems; results merge cleanly.
- **Mechanism:** Recurse on sub-problems, merge results. Often O(n log n).
- **Canonical:** Mergesort, quicksort, FFT.
- **Variants:** When sub-problems overlap → DP instead.
- **Failure:** Merge cost dominates; highly unbalanced splits (quicksort worst case).

### A7. BFS / Shortest Path (Unweighted)
- **Signature:** Reachability, connectivity, shortest *hop-count* path. Unweighted graph.
- **Mechanism:** Queue-based level-order traversal. First visit = shortest path.
- **Canonical:** Shortest path in unweighted graph, word ladder.
- **Variants:** Bidirectional BFS, 0-1 BFS (edges weight 0 or 1), multi-source BFS.
- **Failure:** Weighted edges → Dijkstra. Need DFS properties → use DFS.

### A8. DFS / Graph Exploration
- **Signature:** Connectivity, cycle detection, topological order, SCC, path existence.
- **Mechanism:** Stack/recursion depth-first. Records entry/exit times.
- **Canonical:** Cycle detection, topological sort, maze traversal.
- **Variants:** Iterative DFS, DFS on implicit graph, flood fill.
- **Failure:** Shortest path → BFS. Stack overflow on deep recursion without explicit stack.

### A9. Dijkstra
- **Signature:** Shortest path in weighted graph, non-negative weights.
- **Mechanism:** Priority queue (min-heap) + greedy relaxation. O((V+E) log V).
- **Canonical:** GPS routing, network latency.
- **Variants:** A* (heuristic-guided), Bidirectional Dijkstra, Dial's algorithm.
- **Failure:** Negative weights → Bellman-Ford. Dense graphs → Fibonacci heap variant.

### A10. Hashing
- **Signature:** O(1) lookup, frequency counting, dedup, fast existence check.
- **Mechanism:** Key → bucket via hash function.
- **Canonical:** Two-sum (unsorted), anagram detection.
- **Variants:** Hash set, hash map, rolling hash (Rabin-Karp), bloom filter, consistent hashing.
- **Failure:** Adversarial collision attacks; no ordering guarantee; poor hash function.

### A11. Union-Find (DSU)
- **Signature:** Dynamic connectivity, grouping, Kruskal's MST.
- **Mechanism:** Forest with path compression + union by rank. Near-O(1) amortized.
- **Canonical:** "Are these nodes connected as we add edges?"
- **Variants:** Weighted DSU, persistent DSU, small-to-large merging.
- **Failure:** Edge deletion; need actual path (not just connectivity).

### A12. Monotonic Stack / Queue
- **Signature:** "Next greater/smaller element," largest rectangle, stock span.
- **Mechanism:** Stack maintains monotone invariant; pop when new element breaks it.
- **Canonical:** Next greater element, largest rectangle in histogram.
- **Variants:** Monotonic deque (sliding window max), increasing stack, decreasing stack.
- **Failure:** Need arbitrary element, not monotone neighbor.

### A13. Topological Sort
- **Signature:** DAG, need ordering where all dependencies come before dependents.
- **Mechanism:** Kahn's (BFS, indegree-based) or DFS post-order.
- **Canonical:** Build order, course prerequisites, task scheduling.
- **Variants:** Kahn's (detects cycle via remaining nodes), DFS (cycle via recursion stack).
- **Failure:** Graph has a cycle → no topological order exists.

### A14. Interval Scheduling / Merge
- **Signature:** Set of intervals; need to merge, find overlaps, or schedule non-overlapping.
- **Mechanism:** Sort by start (or end); sweep with current interval.
- **Canonical:** Merge overlapping intervals, activity selection.
- **Variants:** Meeting rooms (max simultaneous), calendar conflict, interval DP.
- **Failure:** Multi-dimensional intervals; weighted intervals → DP.

### A15. Prefix Sum / Difference Array
- **Signature:** Repeated range sum queries on static array; or range update + point query.
- **Mechanism:** Precompute cumulative sums → O(1) range query; difference array for range update.
- **Canonical:** Subarray sum queries, 2D range sum (2D prefix).
- **Variants:** 2D prefix sum, difference array, offline queries.
- **Failure:** Dynamic updates on the array → use segment tree or BIT.

### A16. Trie
- **Signature:** String prefix queries, autocomplete, dictionary lookup by prefix.
- **Mechanism:** Tree where each node = one character; path from root = prefix.
- **Canonical:** Autocomplete, word search, longest common prefix.
- **Variants:** Compressed trie, suffix trie, ternary search tree, bit trie (XOR problems).
- **Failure:** High alphabet size inflates memory; suffix problems → suffix array faster.

### A17. Segment Tree / BIT (Fenwick Tree)
- **Signature:** Dynamic range queries + point updates; or point queries + range updates.
- **Mechanism:** Segment tree: O(log n) build, query, update. BIT: simpler, same asymptotic.
- **Canonical:** Range sum with updates, range min/max, inversion count.
- **Variants:** Lazy propagation (range updates), persistent segment tree, merge sort tree.
- **Failure:** Static data → prefix sum is simpler. 2D → 2D segment tree (heavy).

### A18. Bit Manipulation
- **Signature:** Problems involving subsets, flags, parity, XOR properties, power-of-2 checks.
- **Mechanism:** Bitwise ops (AND, OR, XOR, shift) to exploit binary structure.
- **Canonical:** Subset enumeration via bitmask, XOR swap, lowest set bit.
- **Variants:** Bitmask DP, XOR basis (Gaussian elimination over GF(2)).
- **Failure:** Numbers too large for bitmask; logic complex → use explicit set.

### A19. Reservoir Sampling
- **Signature:** Sample k items uniformly from stream of unknown length.
- **Mechanism:** Keep first k; for item i > k, replace with probability k/i.
- **Canonical:** Random sample from database stream without knowing size.
- **Variants:** Weighted reservoir sampling, distributed sampling.
- **Failure:** Non-uniform probability desired; multiple passes allowed → simpler methods.

### A20. Meet in the Middle
- **Signature:** Exponential search space, n too large for full enumeration but n/2 feasible.
- **Mechanism:** Split problem in half; enumerate each half; combine (sort + binary search).
- **Canonical:** 4-sum, subset sum with large n, knapsack with large capacity.
- **Variants:** MITM with hashing, baby-step giant-step (discrete log).
- **Failure:** Can't split problem cleanly; merge step is expensive.

### A21. Line Sweep
- **Signature:** Geometric problems with intervals, rectangles, or events along an axis.
- **Mechanism:** Sort events by x-coordinate; process left-to-right with active set.
- **Canonical:** Counting rectangle overlaps, finding closest pair, area of union of rectangles.
- **Variants:** Rotational sweep, 2D sweep with segment tree.
- **Failure:** Non-planar geometry; events not sortable by single axis.

### A22. Convex Hull
- **Signature:** Smallest convex polygon enclosing a point set; or "farthest pair" problems.
- **Mechanism:** Graham scan or Monotone chain: O(n log n).
- **Canonical:** Computational geometry, collision detection outer boundary.
- **Variants:** Dynamic convex hull, 3D convex hull, convex hull trick (DP optimization).
- **Failure:** Points not in 2D; need interior structure, not just boundary.

### A23. String Matching — KMP / Z-Algorithm
- **Signature:** Find all occurrences of pattern in text; string period/border structure.
- **Mechanism:** Precompute failure function (KMP) or Z-array; linear-time scan.
- **Canonical:** Pattern search, finding repeated substrings.
- **Variants:** Rabin-Karp (hashing), Aho-Corasick (multi-pattern), suffix automaton.
- **Failure:** Multiple patterns → Aho-Corasick. Approximate matching → edit distance.

### A24. Randomized / QuickSelect
- **Signature:** k-th smallest element; median finding without full sort.
- **Mechanism:** Partition around pivot; recurse on relevant half. Expected O(n).
- **Canonical:** Median of medians, k-th largest in stream.
- **Variants:** Introselect (deterministic worst-case), weighted selection.
- **Failure:** Worst-case pivot selection → O(n²); use median-of-medians for guarantee.

### A25. Network Flow (Max-Flow / Min-Cut)
- **Signature:** Capacity-constrained flow, bipartite matching, min-cut problems.
- **Mechanism:** Ford-Fulkerson / Edmonds-Karp / Dinic's. Augment along paths.
- **Canonical:** Max bipartite matching, pipeline capacity, project selection.
- **Variants:** Min-cost max-flow, circulation with demands, multi-commodity.
- **Failure:** Non-integer capacities (irrational → non-termination); high-dimensional.

### A26. Backtracking
- **Signature:** Generate all solutions / find first solution in combinatorial space; pruning available.
- **Mechanism:** Try choices recursively; undo and try next when constraint violated.
- **Canonical:** N-queens, Sudoku, permutations, subset generation.
- **Variants:** Constraint propagation (arc consistency), branch and bound.
- **Failure:** Pruning too weak → exponential blowup. DP covers overlapping subproblems better.

---

## Library 2 — Proof Patterns (Math)

27 patterns. Organized by strategy family.

### Direct Proof Family

#### P1. Direct Proof
- **Signature:** "Show P ⇒ Q." Standard if-then.
- **Mechanism:** Assume P, derive Q via valid inference steps.
- **Canonical:** Proving sum of two even numbers is even.
- **Variants:** Constructive (exhibit witness), non-constructive (existence without witness).
- **Failure:** Direct chain too long/tangled → try contradiction or contrapositive.

#### P2. Contrapositive
- **Signature:** "Show P ⇒ Q" but direct approach is hard; ¬Q ⇒ ¬P is easier.
- **Mechanism:** Prove the logically equivalent contrapositive.
- **Canonical:** If n² is odd then n is odd.
- **Variants:** Often cleaner for number-theoretic claims.
- **Failure:** ¬Q ⇒ ¬P isn't easier than P ⇒ Q; try contradiction.

#### P3. Contradiction
- **Signature:** Impossibility claims, irrationality, "no such X exists."
- **Mechanism:** Assume ¬Q; derive absurdity. Therefore Q.
- **Canonical:** √2 irrational, infinitely many primes.
- **Failure:** Non-constructive — gives no witness for existence claims. Need construction for that.

### Induction Family

#### P4. Weak Induction
- **Signature:** Claim about all naturals. P(n) proven using only P(n-1).
- **Mechanism:** Base case P(0) or P(1) + step P(k) ⇒ P(k+1).
- **Canonical:** Sum formulas, simple divisibility results.
- **Failure:** Inductive hypothesis too weak → can't complete the step. Strengthen claim.

#### P5. Strong Induction
- **Signature:** Claim about all naturals. Step needs P(0)…P(k), not just P(k).
- **Mechanism:** Assume all previous cases; prove P(k+1).
- **Canonical:** Fundamental theorem of arithmetic, Fibonacci bounds.
- **Failure:** Usually preferred over weak induction — use strong induction by default.

#### P6. Structural Induction
- **Signature:** Claim about recursively defined structures (trees, lists, expressions).
- **Mechanism:** Base cases on atoms; inductive step on constructors.
- **Canonical:** Proving properties of parse trees, term validity.
- **Failure:** Structure not well-founded; unbounded branching.

#### P7. Infinite Descent
- **Signature:** "No positive integer solution exists." Or well-foundedness argument.
- **Mechanism:** From any solution, construct a strictly smaller one — impossible in ℕ.
- **Canonical:** Fermat's method, √2 irrational via descent.
- **Failure:** Non-integer or non-well-ordered domain.

### Existence/Construction Family

#### P8. Direct Construction
- **Signature:** "There exists X with property P." Build it explicitly.
- **Mechanism:** Exhibit X; verify it satisfies P.
- **Canonical:** Constructive existence proofs, counterexample construction.
- **Failure:** Construction is impossible or opaque → use probabilistic or fixed-point existence.

#### P9. Probabilistic Argument
- **Signature:** Existence claim where explicit construction is hard; non-constructive is fine.
- **Mechanism:** Show a random object has property P with positive probability → ∃ object with P.
- **Canonical:** Erdős method, random graph properties.
- **Failure:** Needs careful probability space; non-constructive — no specific witness.

#### P10. Pigeonhole Principle
- **Signature:** "Among N items there must be two with property P." More items than slots.
- **Mechanism:** n+1 items in n slots → at least one slot has ≥2.
- **Canonical:** Among 13 people, two share birth month. Combinatorics bounds.
- **Variants:** Generalized pigeonhole (⌈n/k⌉ per slot), continuous pigeonhole.
- **Failure:** Need exact collision, not just existence → more structure required.

#### P11. Fixed-Point Argument
- **Signature:** Existence of self-consistent state; equilibrium; recursively-defined object.
- **Mechanism:** Banach, Brouwer, or Kleene fixed-point theorem.
- **Canonical:** Nash equilibrium existence, solution to recursive type equation.
- **Failure:** Conditions not met (non-contraction, non-convex space).

### Counting / Bijection Family

#### P12. Bijection / Counting Two Ways
- **Signature:** Prove two counts are equal; combinatorial identity.
- **Mechanism:** Exhibit explicit bijection OR count one set in two ways.
- **Canonical:** Binomial identities, lattice path counting.
- **Variants:** Double counting, generating function proofs.
- **Failure:** Bijection hard to construct → use generating functions.

#### P13. Generating Functions
- **Signature:** Combinatorial identity, recurrence relation, count of sequences.
- **Mechanism:** Encode sequence as power series; manipulate algebraically.
- **Canonical:** Fibonacci closed form, partition function.
- **Variants:** Ordinary, exponential, Dirichlet generating functions.
- **Failure:** Overkill for simple recurrences; numerical approximation needed.

#### P14. Inclusion-Exclusion
- **Signature:** Count elements with at least one property when direct count is hard.
- **Mechanism:** |A∪B| = |A| + |B| - |A∩B|. Generalize to n sets.
- **Canonical:** Derangements, Euler's totient function.
- **Failure:** Intersections complex → exponential blowup in number of terms.

### Extremal / Geometric Family

#### P15. Extremal Principle
- **Signature:** "Consider the element with the max/min of some quantity."
- **Mechanism:** The extremal element constrains the structure — derive the result from it.
- **Canonical:** Proofs about graphs using max-degree vertex; combinatorial extremal.
- **Failure:** No well-defined extremum; infinite sets without bound.

#### P16. Symmetry / WLOG
- **Signature:** Problem has permutation, reflection, or rotation symmetry.
- **Mechanism:** Fix canonical arrangement; prove just that case. Symmetry covers the rest.
- **Canonical:** Geometry proofs, symmetric combinatorics.
- **Failure:** Symmetry broken by problem constraints; WLOG assumption unjustified.

#### P17. Compactness / Continuity
- **Signature:** Topological/analytic claim; limits, accumulation points, extreme values.
- **Mechanism:** Bolzano-Weierstrass, Heine-Borel, intermediate value theorem.
- **Canonical:** Extreme value theorem, existence of limit points.
- **Failure:** Discrete setting; non-Hausdorff spaces.

### Algebraic / Analytic Family

#### P18. Cauchy-Schwarz / AM-GM / Jensen Family
- **Signature:** Inequality between sums, products, or expectations.
- **Mechanism:** Named inequality directly, or as consequence of convexity.
- **Canonical:** Cauchy-Schwarz: |⟨x,y⟩|² ≤ ‖x‖²‖y‖². AM-GM: (a+b)/2 ≥ √(ab).
- **Variants:** Power mean inequality, rearrangement inequality, Chebyshev sum.
- **Failure:** Strict inequality needed; equality cases must be tracked.

#### P19. Diagonalization
- **Signature:** "Not everything is captured by this system." Self-reference / cardinality.
- **Mechanism:** Construct object by differing from every element of an enumeration.
- **Canonical:** Cantor's diagonal argument, Gödel incompleteness (sketch), halting problem.
- **Failure:** Non-countable case; argument requires actual enumeration.

#### P20. Reduction to Known Result
- **Signature:** Problem looks like a known solved problem, or is a special case.
- **Mechanism:** Transform problem into known form; apply known result; transform back.
- **Canonical:** Reducing to linear algebra, reducing to graph problem.
- **Failure:** Transformation loses essential properties; reduction overhead is too high.

#### P21. Duality
- **Signature:** Optimization or geometric problem with a natural dual.
- **Mechanism:** Strong duality: optimal primal = optimal dual. Dual often easier to solve.
- **Canonical:** Linear programming duality, min-cut/max-flow, Legendre transform.
- **Failure:** Duality gap exists (weak duality only); non-convex problems.

### Information-Theoretic / Adversarial Family

#### P22. Information-Theoretic Lower Bound
- **Signature:** Prove a problem *requires* Ω(f(n)) steps/bits; no algorithm can do better.
- **Mechanism:** Count the number of distinct outputs; each requires distinguishing input → log lower bound.
- **Canonical:** Comparison-based sorting requires Ω(n log n).
- **Failure:** Information-theoretic bound not tight (algorithm-specific lower bounds needed).

#### P23. Adversary Argument
- **Signature:** Prove an algorithm must ask ≥ k queries / take ≥ k steps.
- **Mechanism:** Define adversary who answers consistently but forces many queries.
- **Canonical:** Finding max in unsorted array requires n-1 comparisons.
- **Failure:** Adversary strategy hard to formalize; randomized algorithms escape deterministic adversary.

#### P24. Potential / Amortized Analysis
- **Signature:** Individual operations expensive but average cost is low.
- **Mechanism:** Define a potential function; amortized cost = actual cost + ΔΦ.
- **Canonical:** Dynamic array doubling → O(1) amortized. Splay trees.
- **Variants:** Aggregate, accounting, potential methods.
- **Failure:** Potential function hard to find; worst-case bounds needed instead.

#### P25. Probabilistic / Randomized Analysis
- **Signature:** Expected performance of randomized algorithm; average case.
- **Mechanism:** Take expectation over random choices; linearity of expectation.
- **Canonical:** Quicksort expected O(n log n), randomized BST.
- **Failure:** High-probability bounds needed; distribution assumptions wrong.

#### P26. Category-Theoretic / Universal Property
- **Signature:** Object uniquely characterized by how everything else relates to it.
- **Mechanism:** Prove existence and uniqueness via universal property.
- **Canonical:** Products, coproducts, adjoint functors, limits/colimits.
- **Failure:** Category structure not present; uniqueness up to isomorphism is sufficient.

#### P27. Invariant / Monovariant
- **Signature:** Prove something is unreachable; or that a process terminates.
- **Mechanism:** Invariant: quantity preserved each step — impossible state ≠ preserved. Monovariant: strictly monotone bounded → terminates.
- **Canonical:** Puzzle reachability (checkerboard coloring), algorithm termination.
- **Failure:** Invariant/monovariant hard to find; non-discrete processes.

---

## Library 3 — Debug Signatures (Code / Systems)

25 patterns. Organized by symptom family.

### Visibility Failures

#### D1. "Works on my machine"
- **Signature:** Passes locally, fails in CI/staging/prod.
- **Likely causes:** Environment difference (OS, library version, timezone, locale, config, permissions).
- **First move:** Diff environments systematically. Print every env variable that could differ.

#### D2. "Flaky test"
- **Signature:** Passes sometimes, fails sometimes, same code, same inputs.
- **Likely causes:** Race condition, timing-sensitive assertion, test ordering dependency, external state, random seed.
- **First move:** Run 100× in a loop; measure failure rate. Identify what's non-deterministic.

#### D3. "Silent failure"
- **Signature:** Expected output missing, no error, no exception.
- **Likely causes:** Exception swallowed, wrong branch taken, feature flag off, log level too high, async not awaited, event not fired.
- **First move:** Add logging at every branch decision. Verify the execution path actually runs.

#### D4. "Heisenbug" (disappears under observation)
- **Signature:** Fails normally, works when debugging / adding logs / attaching profiler.
- **Likely causes:** Race condition (debugger slows timing), optimization-dependent behavior, printing has side effects, dangling pointer.
- **First move:** Use post-mortem logging (write to disk, don't slow execution). Avoid interactive debuggers.

#### D5. "Works until it doesn't"
- **Signature:** Runs fine for hours/days, then suddenly fails or degrades.
- **Likely causes:** Resource leak (memory, file handles, connections), unbounded cache growth, log rotation issue, epoch/timestamp overflow.
- **First move:** Track resource usage over time. Memory and file descriptor counts.

### Data / State Failures

#### D6. "Memory keeps growing"
- **Signature:** Process memory climbs monotonically.
- **Likely causes:** Leak (objects held by long-lived reference), unbounded cache, event listener not removed, circular reference.
- **First move:** Heap snapshot at t=0 and t=10min. Diff to find growers.

#### D7. "Wrong answer, off by a constant"
- **Signature:** Result consistently wrong by a fixed amount or factor.
- **Likely causes:** Off-by-one, fencepost error, wrong initial value, unit mismatch (cents/dollars, radians/degrees).
- **First move:** Check edge cases at 0, 1, and n. Check units at every boundary.

#### D8. "Wrong answer, totally wrong"
- **Signature:** Result is nonsense — not slightly off but radically wrong.
- **Likely causes:** Integer overflow, wrong variable used, logic error in branch, uninitialized variable.
- **First move:** Trace through a minimal example by hand. Compare every intermediate value.

#### D9. "Prod-only data-shape bug"
- **Signature:** Works on sample data; fails on real production data.
- **Likely causes:** Null in unexpected field, unicode, very long strings, unusual characters, duplicate keys, extreme timestamp values.
- **First move:** Describe the distribution of real data. Find what sample lacks.

#### D10. "Stale data / cache poisoning"
- **Signature:** Correct logic, wrong result — data is old or corrupted.
- **Likely causes:** Cache not invalidated, CDN not cleared, event replay not idempotent, database read replica lag.
- **First move:** Force bypass the cache. If result corrects, invalidation is broken.

### Performance Failures

#### D11. "Correct but slow"
- **Signature:** Right output, unacceptable latency or throughput.
- **Likely causes:** Quadratic hidden in abstraction, N+1 query, unnecessary serialization, cache miss, GC pressure.
- **First move:** Profile before optimizing. Never guess hot paths.

#### D12. "Slow only under load"
- **Signature:** Fast single-threaded; degrades under concurrent use.
- **Likely causes:** Lock contention, connection pool exhaustion, thundering herd, database lock escalation.
- **First move:** Load test with gradually increasing concurrency. Find the inflection point.

#### D13. "Intermittent timeout"
- **Signature:** Request occasionally hangs or times out.
- **Likely causes:** Deadlock, connection pool starvation, slow downstream, retry storm, GC pause.
- **First move:** Add timing logs to every external call. Find the outlier.

#### D14. "CPU pegged"
- **Signature:** One CPU core at 100%, system unresponsive.
- **Likely causes:** Infinite loop, tight spin-wait, hot regex, JSON parsing huge document repeatedly.
- **First move:** CPU profiler (flame graph). Find the loop.

### Concurrency Failures

#### D15. "Race condition"
- **Signature:** Data corruption or wrong result when concurrent operations run; not reproducible consistently.
- **Likely causes:** Missing lock, non-atomic read-modify-write, wrong memory ordering.
- **First move:** Add explicit locking around shared state. Use thread sanitizer.

#### D16. "Deadlock"
- **Signature:** Two threads wait indefinitely; system hangs; no progress.
- **Likely causes:** Two locks acquired in opposite order, circular dependency, lock not released on exception.
- **First move:** Dump thread stacks. Look for circular wait. Enforce lock ordering.

#### D17. "Livelock"
- **Signature:** Threads busy but no progress; CPU high; neither waiting.
- **Likely causes:** Retry logic where both retriers trigger each other; resource starvation with yield.
- **First move:** Add exponential backoff with jitter to retry logic.

### Integration Failures

#### D18. "Works in isolation, breaks integrated"
- **Signature:** Component passes unit tests; fails in integration.
- **Likely causes:** Interface contract mismatch, shared state contamination, timing dependency between components.
- **First move:** Write integration test that isolates the pair of components. Find the contract break.

#### D19. "Third-party API changed"
- **Signature:** Was working; now broken; nothing in your code changed.
- **Likely causes:** External API breaking change, deprecation, auth token expired, rate limit lowered.
- **First move:** Test the API directly (curl/Postman). Read the changelog.

#### D20. "SSL / Auth failure"
- **Signature:** Connection refused or auth error where credentials haven't changed.
- **Likely causes:** Expired certificate, rotated secret not propagated, clock skew (JWT), IP whitelist change.
- **First move:** Check cert expiry. Check secret rotation logs. Check clock sync.

### Configuration / Environment Failures

#### D21. "Config not applied"
- **Signature:** Changed a config value; no effect.
- **Likely causes:** Service not restarted, config file overridden by env var, wrong config file path, caching of old config at startup.
- **First move:** Log the effective config at startup. Verify service actually reloaded.

#### D22. "Works in container, not locally" (inverse of D1)
- **Signature:** Passes in Docker/CI; fails on bare machine.
- **Likely causes:** Missing system dependency, different PATH, OS-specific behavior, different Python/Node version.
- **First move:** Run the container locally. Extract and run the same environment.

#### D23. "Encoding / character corruption"
- **Signature:** Garbled text, mojibake, wrong special characters.
- **Likely causes:** UTF-8/Latin-1 mismatch, missing encoding declaration, binary data treated as text.
- **First move:** Inspect raw bytes. Trace encoding at every boundary (read, write, DB, network).

### Build / Dependency Failures

#### D24. "Works after clean build, fails incrementally"
- **Signature:** Fails after code change; clean build fixes it; fails again after next change.
- **Likely causes:** Build cache poisoned, dependency on deleted/moved artifact, non-hermetic build.
- **First move:** Add `--no-cache` or equivalent. Find what's being cached incorrectly.

#### D25. "Dependency version conflict"
- **Signature:** Import errors, `undefined symbol`, wrong method signature, behavior regressed after `npm install`/`pip install`.
- **Likely causes:** Transitive dependency upgraded breaking API, diamond dependency, lock file out of sync.
- **First move:** Pin to known-good versions. Diff lock file before and after. Use dependency audit tools.

---

## Library 4 — Design Patterns (Architecture)

25 patterns. Organized by problem family.

### Structural Patterns

#### X1. Layered Architecture
- **Signature:** System has clear levels of abstraction (UI, logic, data). Need to enforce separation.
- **Mechanism:** Each layer communicates only with adjacent layers. Dependencies point downward.
- **Canonical:** MVC, three-tier web app.
- **Failure:** Leaky abstractions; "lasagna" — too many thin layers.

#### X2. Hexagonal / Ports & Adapters
- **Signature:** Core business logic should be independent of frameworks, DBs, UIs.
- **Mechanism:** Define ports (interfaces); adapters implement them for specific technologies.
- **Canonical:** Domain logic with swappable DB/UI.
- **Failure:** Over-abstraction for simple CRUD; adds indirection cost.

#### X3. Pipe and Filter
- **Signature:** Data transformation in stages; each stage independent and composable.
- **Mechanism:** Each filter has one input, one output. Filters connect via pipes.
- **Canonical:** Unix command chains, ETL pipelines, stream processing.
- **Failure:** Shared state between filters; non-linear data flow.

#### X4. Event-Driven / Event Sourcing
- **Signature:** State changes as events; subscribers react asynchronously; audit log needed.
- **Mechanism:** Events immutably recorded; current state derived by replaying.
- **Canonical:** Financial ledgers, CQRS systems, Kafka-based architectures.
- **Failure:** Event schema evolution is hard; eventual consistency requires careful design.

#### X5. CQRS (Command Query Responsibility Segregation)
- **Signature:** Read and write patterns differ significantly; scaling them together is wasteful.
- **Mechanism:** Separate models for reads (queries) and writes (commands).
- **Canonical:** High-read, low-write systems; event sourcing often paired.
- **Failure:** Increased complexity for simple CRUD; eventual consistency complexity.

### Behavioral Patterns

#### X6. Circuit Breaker
- **Signature:** External dependency can fail; want to fail fast instead of cascading.
- **Mechanism:** After N failures, open circuit (fast-fail). After timeout, probe. Reset on success.
- **Canonical:** Microservice calls, third-party API integration.
- **Failure:** Threshold tuning is hard; half-open state logic complex.

#### X7. Retry with Backoff
- **Signature:** Transient failures expected; immediate retry would overwhelm.
- **Mechanism:** Retry with exponential backoff + jitter. Cap at max retries.
- **Canonical:** Network calls, database connections, message processing.
- **Failure:** Retry storms (need jitter); non-idempotent operations (don't retry).

#### X8. Bulkhead
- **Signature:** One failing component should not drain resources from others.
- **Mechanism:** Isolate resource pools (thread pools, connection pools) per component.
- **Canonical:** Separate connection pools for critical vs. non-critical paths.
- **Failure:** Over-partitioning wastes resources; adds operational complexity.

#### X9. Saga Pattern
- **Signature:** Long-running distributed transaction; no 2PC available.
- **Mechanism:** Sequence of local transactions with compensating transactions for rollback.
- **Canonical:** Order fulfillment across services (payment, inventory, shipping).
- **Failure:** Compensating transaction logic complex; partial failure visibility.

#### X10. Outbox Pattern
- **Signature:** Need to publish an event atomically with a database write.
- **Mechanism:** Write event to local "outbox" table in same transaction; relay publishes asynchronously.
- **Canonical:** Ensuring event published if-and-only-if transaction commits.
- **Failure:** Relay is a single point of failure; at-least-once delivery requires idempotency downstream.

### State Management Patterns

#### X11. State Machine
- **Signature:** Object behavior depends on state; transitions are explicit and constrained.
- **Mechanism:** Define states, events, and transition functions. Only valid transitions allowed.
- **Canonical:** Order lifecycle (pending → confirmed → shipped → delivered).
- **Failure:** State explosion for complex domains; hierarchical state needed (Statecharts).

#### X12. Immutable Data / Value Objects
- **Signature:** Shared mutable state causing bugs; need thread safety; audit trail needed.
- **Mechanism:** Once created, objects don't change. Updates produce new objects.
- **Canonical:** Functional programming, Redux state, persistent data structures.
- **Failure:** Performance cost for large objects; copying overhead.

#### X13. Repository Pattern
- **Signature:** Need to abstract data access; want to swap storage backends.
- **Mechanism:** Repository interface provides collection-like API; implementation handles persistence.
- **Canonical:** Domain model + multiple storage backends.
- **Failure:** Leaky abstraction (ORM specifics bleed through); over-engineered for simple CRUD.

### Observability Patterns

#### X14. Structured Logging
- **Signature:** Logs need to be queried/filtered; human-readable alone insufficient.
- **Mechanism:** Log as key-value pairs (JSON). Include correlation ID, trace ID, user ID.
- **Canonical:** Production services, distributed systems.
- **Failure:** Log volume explodes if not sampled; PII in logs.

#### X15. Distributed Tracing
- **Signature:** Request spans multiple services; need to see end-to-end flow.
- **Mechanism:** Propagate trace context (trace ID, span ID) across service boundaries.
- **Canonical:** Microservice architectures; finding latency in distributed calls.
- **Failure:** High overhead if sampling not configured; context propagation bugs.

#### X16. Health Check / Readiness / Liveness
- **Signature:** Orchestrator needs to know if service is alive and ready to serve.
- **Mechanism:** Two endpoints: liveness (is process alive?), readiness (is it ready for traffic?).
- **Canonical:** Kubernetes deployments; load balancer health checks.
- **Failure:** Health check itself becomes a failure point; liveness check too aggressive kills healthy processes.

### Caching Patterns

#### X17. Cache-Aside (Lazy Loading)
- **Signature:** Read-heavy; cache miss is acceptable; DB is authoritative.
- **Mechanism:** Check cache first; on miss, load from DB, populate cache, return.
- **Canonical:** Read-heavy web applications.
- **Failure:** Cache stampede on cold start; stale data if invalidation not handled.

#### X18. Write-Through Cache
- **Signature:** Need cache to always be consistent with DB; write latency acceptable.
- **Mechanism:** Every write goes to cache AND DB synchronously.
- **Canonical:** Frequently read, occasionally written reference data.
- **Failure:** Write latency added; unused cached data wastes space.

#### X19. Read-Through / Write-Behind
- **Signature:** Want cache to abstract the DB completely; eventual consistency acceptable for writes.
- **Mechanism:** Cache handles DB interaction; write-behind queues writes asynchronously.
- **Canonical:** High-write throughput with eventual consistency.
- **Failure:** Data loss on cache crash before write-behind flushes.

### Security Patterns

#### X20. Defense in Depth
- **Signature:** No single security control is sufficient; multiple overlapping controls.
- **Mechanism:** Apply controls at every layer (network, application, data, host).
- **Canonical:** WAF + auth + input validation + encryption + least privilege.
- **Failure:** Security theater if layers aren't independently meaningful.

#### X21. Principle of Least Privilege
- **Signature:** Components/users should have only the access they need.
- **Mechanism:** Minimum permissions per identity; scoped tokens; short-lived credentials.
- **Canonical:** IAM roles, API scopes, database user permissions.
- **Failure:** Overly restrictive breaks functionality; privilege creep over time.

#### X22. Token / Session Management
- **Signature:** Stateless auth across services; session revocation needed.
- **Mechanism:** Short-lived tokens (JWT) with refresh. Stateless validation. Revocation list for immediate revoke.
- **Canonical:** OAuth2/OIDC, API authentication.
- **Failure:** Long-lived tokens are a security risk; token revocation is hard with pure JWT.

### API / Integration Patterns

#### X23. API Gateway
- **Signature:** Multiple services need consistent auth, rate limiting, routing, logging.
- **Mechanism:** Single entry point handles cross-cutting concerns; routes to backends.
- **Canonical:** Microservice API surface, mobile backends.
- **Failure:** Single point of failure; bottleneck; too much logic in gateway.

#### X24. Strangler Fig
- **Signature:** Need to migrate a monolith to new architecture incrementally.
- **Mechanism:** Intercept calls at the facade; route to new system for migrated features; route to old for rest.
- **Canonical:** Monolith-to-microservices migration.
- **Failure:** Facade becomes a long-lived dependency; state synchronization between old and new.

#### X25. Anti-Corruption Layer (ACL)
- **Signature:** Integrating with a legacy or external system with a different domain model.
- **Mechanism:** Translation layer between your domain model and theirs. Prevents their model from leaking in.
- **Canonical:** Legacy system integration, third-party API wrappers.
- **Failure:** ACL becomes thick and complex; translation loses fidelity.

---

## Library 5 — Cognitive Biases (Decision-Making)

25 patterns. Organized by bias family.

### Perception / Judgment Biases

#### B1. Anchoring
- **Signature:** First number seen dominates estimate, even if irrelevant.
- **Mechanism:** Cognitive system adjusts from initial value but insufficiently.
- **Canonical:** Salary negotiation, price display.
- **Counter:** Generate your own estimate before seeing anchor. Use reference classes.

#### B2. Availability Heuristic
- **Signature:** Frequency/probability estimated by ease of recall, not base rates.
- **Mechanism:** Memorable events (dramatic, recent, personal) inflate perceived frequency.
- **Canonical:** Fear of plane crash vs. car crash; recent news distorts risk.
- **Counter:** Always ask "what's the base rate?" before using anecdotes.

#### B3. Representativeness
- **Signature:** Probability assessed by how typical something seems, ignoring priors.
- **Mechanism:** Pattern matching overrides statistical reasoning.
- **Canonical:** Linda problem (conjunction fallacy), stereotyping.
- **Counter:** Apply Bayes explicitly. Compute P(A) × P(B|A), not just "seems like."

#### B4. Framing Effect
- **Signature:** Choice changes depending on how options are presented (gain vs. loss frame).
- **Mechanism:** Loss aversion + reference dependence makes same quantity feel different.
- **Canonical:** "90% survival rate" vs. "10% mortality rate."
- **Counter:** Reframe decision multiple ways before choosing. What would the other frame say?

#### B5. Sunk-Cost Fallacy
- **Signature:** Continuing a failing course because of past investment.
- **Mechanism:** Treating past costs as relevant to future decisions.
- **Canonical:** Finishing a bad book/movie/project because "I've already invested."
- **Counter:** Ask: "If I started fresh today, would I choose this?" If no, stop.

### Memory / Recall Biases

#### B6. Hindsight Bias
- **Signature:** After learning outcome, believing you "knew it all along."
- **Mechanism:** Memory reconstructs past beliefs to match current knowledge.
- **Canonical:** "I knew the market would crash." Post-hoc certainty.
- **Counter:** Record predictions before outcomes. Compare to remembered predictions.

#### B7. Recency Bias
- **Signature:** Recent events weighted too heavily; distant events underweighted.
- **Mechanism:** Availability + temporal discounting.
- **Canonical:** Investment decisions after market runs; hiring after recent failures.
- **Counter:** Explicitly survey the full history, not just recent months.

#### B8. Peak-End Rule
- **Signature:** Judgment of past experience determined by peak moment and end, not average.
- **Mechanism:** Memory doesn't integrate; it samples selectively.
- **Canonical:** Medical procedures: cold pressor test, colonoscopy study (Kahneman).
- **Counter:** Average ratings taken in real time. Diary studies beat retrospective recall.

### Social / Self Biases

#### B9. Confirmation Bias
- **Signature:** Seeking, interpreting, and remembering information that confirms existing beliefs.
- **Mechanism:** Motivated reasoning + selective attention.
- **Canonical:** The most pervasive bias. Affects all domains.
- **Counter:** Actively seek disconfirming evidence. Steelman opposing view. Pre-mortem.

#### B10. Dunning-Kruger Effect
- **Signature:** Low competence → high confidence; high competence → more uncertainty.
- **Mechanism:** Meta-cognitive skill is a skill; incompetent lack the skill to recognize incompetence.
- **Canonical:** Beginner experts, early-stage learning.
- **Counter:** Seek external feedback. Track prediction accuracy. Domain knowledge calibration.

#### B11. Overconfidence
- **Signature:** Confidence intervals too narrow; probability of being right overestimated.
- **Mechanism:** Substitutes ease of constructing explanation for actual probability.
- **Canonical:** Planning fallacy, 90% confidence interval studies (only ~50% contain truth).
- **Counter:** Use reference class forecasting. Explicitly consider "how have similar projects gone?"

#### B12. Status Quo Bias
- **Signature:** Preference for current state; change requires extra justification.
- **Mechanism:** Loss aversion + omission bias (inaction feels safer).
- **Canonical:** Default options in policy, product design, personal decisions.
- **Counter:** Treat status quo as just another option. Would you actively choose it fresh?

#### B13. In-Group Bias
- **Signature:** Favoring members of own group; attributing better traits to in-group.
- **Mechanism:** Evolved tribal heuristic; activated by any group membership cue.
- **Canonical:** Hiring, performance reviews, political attribution.
- **Counter:** Blind review where possible. Explicit criteria before seeing candidates.

### Planning / Prediction Biases

#### B14. Planning Fallacy
- **Signature:** Estimates systematically optimistic; projects take longer and cost more.
- **Mechanism:** Inside view dominates; base rates ignored; optimism about execution.
- **Canonical:** Software projects, construction, research timelines.
- **Counter:** Reference class forecasting: how long did similar projects actually take?

#### B15. Optimism Bias
- **Signature:** Believing you're less likely than average to experience negative events.
- **Mechanism:** Self-serving attribution; above-average effect.
- **Canonical:** Entrepreneur survival rates, health risk assessment.
- **Counter:** Pre-mortem. Explicitly ask: "What's the base rate for this failing?"

#### B16. Neglect of Probability
- **Signature:** Treating all risks as equally serious regardless of probability.
- **Mechanism:** Affect heuristic; identifiable victim effect; dread overrides calibration.
- **Canonical:** Fear of rare catastrophic events vs. common mundane risks.
- **Counter:** Expected value calculations. Separate probability from severity explicitly.

#### B17. Scope Insensitivity
- **Signature:** Willingness to pay/act doesn't scale with the magnitude of the problem.
- **Mechanism:** Mental image of the problem doesn't scale; emotional response saturates.
- **Canonical:** Environmental donation studies: same WTP for 2K vs. 200K birds.
- **Counter:** Use unit costs and explicit scaling. "How many of X is Y worth?"

### Attribution / Causal Biases

#### B18. Fundamental Attribution Error
- **Signature:** Attributing others' behavior to character; own behavior to circumstance.
- **Mechanism:** Actor-observer asymmetry; situation invisible from outside.
- **Canonical:** "He's late (lazy) vs. I'm late (traffic)."
- **Counter:** Assume situational causes first. What constraints might they be under?

#### B19. Halo / Horn Effect
- **Signature:** One positive/negative trait colors perception of all other traits.
- **Mechanism:** Cognitive consistency drive; affect generalizes.
- **Canonical:** Attractive people seen as smarter; bad first impression → global judgment.
- **Counter:** Evaluate traits independently. Structured interviews. Blind assessment.

#### B20. Narrative Fallacy
- **Signature:** Constructing causal stories from coincidental sequences; past looks inevitable.
- **Mechanism:** Story comprehension is automatic; statistical thinking is effortful.
- **Canonical:** Business history books explaining success/failure with neat stories.
- **Counter:** Ask for base rates and counterfactuals. What happened to companies that did the same thing?

### Action / Decision Biases

#### B21. Omission Bias
- **Signature:** Harmful action judged worse than equally harmful inaction.
- **Mechanism:** Action feels like greater causal responsibility.
- **Canonical:** Trolley problem intuitions; vaccine hesitancy (action vs. inaction).
- **Counter:** Treat inaction as an action with its own consequences.

#### B22. Loss Aversion
- **Signature:** Losses loom larger than equivalent gains (~2× by typical estimate).
- **Mechanism:** Prospect theory value function — steeper for losses.
- **Canonical:** Investment decisions, negotiation, default option design.
- **Counter:** Reframe as: "What is the opportunity cost of not doing this?"

#### B23. Zero-Risk Bias
- **Signature:** Preferring to eliminate one small risk completely over reducing a larger risk substantially.
- **Mechanism:** Certainty effect; zero has special psychological status.
- **Canonical:** Preferring removal of a 1% risk to halving a 50% risk.
- **Counter:** Expected value calculation. Focus on expected harm reduction, not certainty.

#### B24. Decoy Effect
- **Signature:** A third option changes preference between the original two.
- **Mechanism:** Asymmetric dominance makes one option look better by contrast.
- **Canonical:** Pricing strategy (small/medium/large), subscription tiers.
- **Counter:** Evaluate options in pairs without the decoy. Identify which option the decoy is designed to promote.

#### B25. Survivorship Bias
- **Signature:** Studying only the survivors leads to wrong conclusions about what causes success.
- **Mechanism:** Failed examples are invisible; success looks more systematic than it is.
- **Canonical:** Investment fund performance, startup advice, WWII aircraft armor (Wald).
- **Counter:** Explicitly ask: "What does the graveyard look like?" Find the missing data.

---

## Growing a Library

When you encounter a new pattern in real work:

1. **Recognize** the shape — "I've seen this before" or "I'll see this again."
2. **Name it.** Standard name if it exists; coin one if not.
3. **Fill the six slots** (Name, Signature, Mechanism, Canonical, Variants, Failure).
4. **NEDF-encode** the scene.
5. **Anki card:** Signature → Name + Mechanism.
6. **Locus** in the relevant Heuristic Palace Wing.
7. **Apply within 48h** to cement.

Once a library hits 30 patterns, stop adding and start using. Depth of use
matters more than breadth of coverage.

---

## Using Libraries During Problem-Solving

After Heuristic Palace Room 3 (Classify) identifies the problem genus:

1. **Match the signature** against your library.
2. **First 2–3 matches** → try those patterns.
3. **Check failure modes** before committing — does one of them apply?
4. **No match** → back to generic Heuristic Palace heuristics; consider adding a new pattern after you solve it.

Pattern recognition before reasoning. Reasoning only when no pattern fits.

---

## Key Principles

1. **30 patterns per library is the target.** Below 30, recognition is unreliable. Above 30, diminishing returns.
2. **Signature is what you pattern-match on.** The signature must be specific enough to fire the right pattern.
3. **Failure modes are as valuable as mechanisms.** Knowing when NOT to apply a pattern is half the value.
4. **Real work grows the library.** Don't pre-build patterns you haven't encountered.
5. **Variants distinguish cousins.** The hardest part is separating A from B when they both seem to fit.
6. **Patterns compose.** Most real solutions combine 2–3 patterns. Learn to see the joints.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-domain-patterns)**.

