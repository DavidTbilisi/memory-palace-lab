# Procedure Encoding Protocol

For encoding **ordered sequences** — algorithms, proofs, protocols, recipes,
rituals, processes — as retrievable, executable memory.

This is the gap between NEDF (concepts) and PAO (3-digit numbers). A procedure
is neither: it's a *sequence of actions* with internal logic, branching,
and dependency. Encoding it wrong produces a list you can recite but can't
execute under pressure.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-procedure-encoding) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The Core Problem with Procedures

Numbers are inert. Concepts are static. Procedures are **dynamic and
order-dependent** — and they fail in specific ways:

- **Forward recitation without execution ability:** you can list steps but
  freeze when you hit a real instance because you never encoded *what the
  step actually means to do*
- **Loss of branching:** most procedures have "if X then Y, else Z" — flat
  encoding erases this
- **Step-count inflation:** encoding every micro-step makes the procedure
  unwieldy; encoding too coarsely loses the executable detail
- **No error-recovery:** when you skip a step or do it wrong, there's no
  encoded repair move

A good procedure encoding solves all four.

---

## The SPEAR Framework

**S**cene · **P**reconditions · **E**xecution · **A**lternatives · **R**epair

Five slots per procedure, analogous to NEDF for concepts.

### Slot 1 — Scene (S)
The vivid image that *is* the procedure — what the whole thing looks like as
a single gestalt. This is the retrieval anchor.

- Must be a *moving* image, not static (procedures are actions)
- Should encode the procedure's **essence** — what it accomplishes, not how
- One image per procedure, regardless of step count

### Slot 2 — Preconditions (P)
What must be true *before* you can execute. What inputs, states, assumptions
are required?

- Encoded as a **doorway or gate** — you must pass through before entering
- If preconditions are wrong, the procedure will fail regardless of execution

### Slot 3 — Execution (E)
The steps themselves — but encoded as a **story chain**, not a list.

- Each step = one scene
- Scenes are **causally linked** — step N produces what step N+1 needs
- Branch points = **forks in the road** (two paths, both visible)
- Loop structures = **circular paths** (scene leads back to itself)
- Encoding style: PAO chain for short steps (3-digit image per step), or
  Major/SEM3 for numbered steps, or a spatial path through a sub-palace

### Slot 4 — Alternatives (A)
The branches, shortcuts, and variants. What changes when the standard path
fails or conditions are different?

- Encoded as **signposts at the fork** — each branch is a visible path
- At minimum: encode the one most-common variant and the one most-dangerous
  wrong turn

### Slot 5 — Repair (R)
What to do when a step fails or produces wrong output. The error-recovery
path.

- Encoded as a **rescue scene** — a character who fixes things appears
- Critical: most people skip this and then freeze when something goes wrong

---

## The Three Encoding Styles

Match the style to procedure length and complexity:

### Style A — Causal Chain (short, ≤7 steps)
Use for: algorithms with few steps, proof moves, command sequences.

Encode each step as a distinct scene linked by **physical cause-and-effect**:
step 1 produces an object that step 2 uses; step 2's action creates the
material that step 3 needs.

Scene template:
```
[Actor N] does [Action N] with [Object from Step N-1] → produces [Object N]
```

The chain is self-verifying: if you can't link N to N+1, you've mis-encoded.

### Style B — Spatial Path (medium, 8–20 steps)
Use for: long algorithms, multi-phase protocols, complex debugging sequences.

Lay the procedure out as a **walk through a space**:
- Each room/area = one phase
- Within each area, 2–4 loci = individual steps
- Transitions between areas = phase boundaries

The spatial memory does the ordering work — you can't remember a later step
without first walking through the earlier areas.

### Style C — Recursive Scene (recursive / iterative procedures)
Use for: divide-and-conquer algorithms, inductive proofs, any procedure that
calls itself.

Encode the **base case** and the **recursive step** as two scenes in one room:
- Base case = small, simple, calm (it terminates)
- Recursive step = a character picking something up and handing it to a
  *smaller version of itself*

The "handing to smaller self" image encodes recursion naturally. The base
case image is visually distinct (calm, small) — contrast prevents confusion.

---

## Worked Examples

### Example 1 — Binary Search (Style A, 6 steps)

**Scene (S):** A librarian cutting a stack of books exactly in half every time
they search, until one book remains.

**Preconditions (P):** Doorway labeled "SORTED" — you must pass through it
before entering the library. If the array isn't sorted, the door is locked.

**Execution (E) — Causal Chain:**
1. Librarian holds the full stack (= the search space). Sets left=0, right=n-1.
2. Cuts the stack in half — picks the middle book (= mid = (left+right)//2).
3. Reads the middle book's title. Compares to target.
4. Three outcomes (fork in the road):
   - Target = mid → *pulls it out and holds it up* (return mid)
   - Target < mid → *drops the right half on the floor* (right = mid-1)
   - Target > mid → *drops the left half on the floor* (left = mid+1)
5. Returns to step 1 with the remaining stack. (Loop back.)
6. Empty stack (left > right) → *librarian shrugs* (return -1, not found)

**Alternatives (A):** Signpost: "left-biased mid?" → use `left + (right-left)//2`
to avoid integer overflow. Different path through the same library.

**Repair (R):** *An inspector appears* when the loop doesn't terminate —
checks if left/right are updating. Classic bug: using `mid-1`/`mid+1` but
forgetting to update one side.

---

### Example 2 — Proof by Induction (Style A, 4 steps)

**Scene (S):** A chain of dominoes — tipping the first one topples all of them.

**Preconditions (P):** Doorway labeled "CLAIM ABOUT ℕ" — only enter if the
claim is about all natural numbers (or some infinite well-ordered set).

**Execution (E):**
1. *First domino standing* — prove the base case P(0) or P(1). Find the
   smallest case and verify directly.
2. *Place a hand on domino N* — assume P(k) holds (inductive hypothesis).
   This is what you're *given*, not what you prove.
3. *Watch domino N fall onto domino N+1* — prove P(k+1) using P(k). This is
   the hard step.
4. *All dominoes fall* — conclude ∀n, P(n) by induction. QED.

**Alternatives (A):**
- Signpost "STRONG INDUCTION": instead of step 2, assume P(0)…P(k) all hold.
  The domino hand covers all previous dominoes.
- Signpost "STRUCTURAL INDUCTION": dominoes are a tree, not a line. Base case
  is leaves; step handles internal nodes.

**Repair (R):** *Inspector checks* whether you used the inductive hypothesis in
step 3. If not, you didn't do induction — you proved P(k+1) directly, which
is a different proof.

---

### Example 3 — Debugging a Failing Test (Style B, 12 steps, 3 phases)

**Scene (S):** A detective arriving at a crime scene — the test is the body,
the bug is the killer.

**Preconditions (P):** You have a *reproducible failure*. If it's intermittent,
stop — go to flaky-test debugging first (different procedure).

**Phase 1 room — Understand the failure:**
- Locus 1: Read the full error message, literally. Don't skim.
- Locus 2: Identify what was expected vs. what was returned.
- Locus 3: Ask "where in the call stack did this originate?" — read the trace
  bottom-up.

**Phase 2 room — Isolate the cause:**
- Locus 4: Form a hypothesis about cause in one sentence.
- Locus 5: Find the minimum reproducer — smallest input that still fails.
- Locus 6: Add one log statement at the point of suspected failure.
- Locus 7: Verify the hypothesis. If wrong, return to locus 4.

**Phase 3 room — Fix and verify:**
- Locus 8: Make the smallest possible code change that would fix the cause.
- Locus 9: Run the failing test. Does it pass?
- Locus 10: Run the full test suite. Does anything new break?
- Locus 11: Remove debug logging.
- Locus 12: Write a regression test if none existed.

**Alternatives (A):** Signpost "FLAKY TEST" → different room entirely (race
condition procedure). Signpost "PASSES LOCALLY" → environment-diff procedure.

**Repair (R):** *Inspector appears* if locus 7 keeps failing (hypothesis keeps
being wrong) — after 3 failed hypotheses, stop theorizing and use bisection
(git bisect or comment-out halves).

---

### Example 4 — Merge Sort (Style C, recursive)

**Scene (S):** A sorceress who can only sort 1-element arrays (trivially),
and solves everything else by splitting in two, giving each half to a smaller
version of herself, and then merging the results.

**Base Case:** *A tiny sorceress* holding one item — it's already sorted. She
smiles and hands it back. Nothing to do.

**Recursive Step:** *Full-size sorceress* receives an array:
1. Cuts it in half — hands left half to *a slightly smaller sorceress*
2. Cuts it in half — hands right half to *another slightly smaller sorceress*
3. Waits for both to return sorted halves
4. *Merges* the two sorted halves by comparing front elements, taking the
   smaller each time, until one is empty, then appending the rest.
5. Returns the merged, sorted result upward.

**Alternatives (A):** Signpost "BOTTOM-UP": start with the tiny sorceress and
work up — no recursion, just iteration over doubling lengths.

**Repair (R):** *Inspector checks* the merge step — the most common bug is
forgetting to append the remaining elements after one half is exhausted.

---

## The Step-Count Decision

| Steps | Style | Notes |
|-------|-------|-------|
| ≤ 7 | **A — Causal Chain** | Fastest to encode; natural for simple algorithms |
| 8–20 | **B — Spatial Path** | Use a sub-palace with 3–4 phases |
| 20+ | **B + chunking** | Group steps into phases first; ≤7 phases × ≤7 steps |
| Recursive | **C — Recursive Scene** | Base case + recursive step; always separate visually |
| Branching-heavy | **A or B + colored forks** | Each branch = a different-colored path |

Never try to fit 20+ steps into a single causal chain. The chain will break
at the first retrieval under pressure.

---

## Integration with Existing Systems

- **NEDF for concepts, SPEAR for procedures.** If something has steps and
  order matters, use SPEAR. If it's a definition or model, use NEDF.
- **PAO for step images.** Each step in a causal chain can use PAO encoding
  for the actor (Person), the action (Action), and the output (Object).
- **Mind Palace for spatial paths (Style B).** The palace *is* the sequence
  — steps are loci, phases are rooms.
- **Heuristic Palace.** Every wing in the Heuristic Palace is a procedure
  (the debug wing, proof wing, etc.). These should be SPEAR-encoded, not
  just listed.
- **CAST.** A procedure has a *flow graph* — you can encode the branching
  structure as a CAST network, with steps as nodes and control flow as edges.
  Use this for complex procedures where the dependency structure matters as
  much as the sequence.

---

## Anki Cards for Procedures

### Format A — Retrieval by name
Front: `Binary Search`
Back: Scene + Preconditions + causal chain (all 6 steps)

### Format B — Execution prompt (highest yield)
Front: `You need to search a sorted array of 10M elements for a target. You are at step 3 — what do you do?`
Back: Compare mid to target, branch accordingly

### Format C — Error recovery
Front: `Your binary search loops forever. What do you check?`
Back: Repair scene — are left and right updating on both branches?

### Format D — Precondition failure
Front: `When should you NOT use binary search?`
Back: The locked doorway — unsorted array, no random access

Format B is the highest-yield card type: it forces you to *locate yourself*
in the procedure and execute from there, which is exactly what real use demands.

---

## Key Principles

1. **Scene first, steps second.** The gestalt image is the retrieval trigger.
   If you can't picture the whole procedure as one image, break it down more.
2. **Causal links are the sequence.** Don't memorize order; memorize what
   each step *produces* and what the next step *needs*. Order follows causally.
3. **Encode branches explicitly.** Unbranched procedures are rarely real.
4. **Repair is mandatory.** Procedures fail. Encode the failure before you
   need to recover from it.
5. **Style matches complexity.** A 20-step procedure encoded as a chain will
   break. A 4-step procedure encoded as a palace is over-engineered.
6. **Execution cards beat recognition cards.** "What is step 3?" is a weak
   card. "You're at step 3, what do you do?" is a strong card.
7. **Test under pressure.** Procedures that work in calm review often fail
   under time pressure or interruption. Test by walking through with a timer.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-spear)**.

