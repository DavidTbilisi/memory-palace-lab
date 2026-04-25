# Comprehension Protocol

**Memory systems encode what you already understand. They don't produce
understanding.** This protocol is the missing layer: the sequence of moves
you make when *first encountering* a difficult topic, before any encoding.

**Rule:** Never encode a concept you haven't fully understood. Encoding
confusion produces confused retrieval.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-comprehension-protocol) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The Five Gates

You do not "understand" a topic until all five gates are open. Check each,
in order, before declaring comprehension.

```
Gate 1: Locate     — where does this sit in my knowledge map?
Gate 2: Represent  — can I express it in ≥3 distinct forms?
Gate 3: Minimize   — what's the smallest example that exhibits it?
Gate 4: Falsify    — what would break this? where are the edges?
Gate 5: Regenerate — can I derive it from scratch without notes?
```

Only after Gate 5 do you encode.

**Live lectures:** speech is faster than careful gates — use a **thin live pass** (Locate + Represent skeleton + tagged keywords) and schedule **Gate 5 soon after class** before heavy encoding. Playbook: **`lecture-listening-notes.md`**.

---

## Gate 1 — Locate

Before reading deeply, answer: **where does this concept live?**

- What field is it in? What subfield?
- What concepts are its *neighbors* (adjacent, related, similar)?
- What is it a *special case of*? What is a special case of *it*?
- What problem does it solve? Whose problem? Why did anyone invent this?

If you can't place the concept in at least a rough map after 5 minutes, your
background is too thin — **stop and backfill prerequisites** (see
confusion-triage.md) before continuing.

**Anti-pattern:** Starting to read a technical explanation of a concept before
knowing what category of thing it is. This produces the "reading with eyes
but not mind" failure mode.

**Tactic — The 1-minute map:** Before opening the source, write 2 sentences:
"This is a [category] that does [function] for [purpose]." If you can't write
it, locate it first.

---

## Gate 2 — Represent

A concept you understand can be expressed in **at least three distinct
representations**. One is recognition; three is understanding.

### The representation checklist

Force yourself to produce each of these before moving on:

1. **Verbal / prose** — explain in plain English, no jargon
2. **Symbolic / formal** — the mathematical/logical/code expression
3. **Geometric / visual** — a picture, diagram, or spatial metaphor
4. **Computational / operational** — what steps would you execute?
5. **Adversarial / counter** — a case that nearly breaks it but doesn't
6. **Extreme case** — what happens at the limits (0, ∞, trivial, boundary)

**Minimum bar:** at least 3 of the 6. Ideally 4+.

### Worked example — "continuity" (calculus)

1. **Verbal:** a function has no sudden jumps; you can trace it without lifting your pencil
2. **Symbolic:** ∀ε>0 ∃δ>0 such that |x-a|<δ ⇒ |f(x)-f(a)|<ε
3. **Geometric:** the graph has no gaps, holes, or jumps
4. **Computational:** given ε, can you produce a δ that works?
5. **Adversarial:** the Dirichlet function (1 on rationals, 0 on irrationals) is nowhere continuous — shows how strict the definition is
6. **Extreme case:** continuity at an isolated point of the domain is trivially true — shows the condition's dependence on neighborhoods

If you can only do 1–2 of these, you recognize the concept but don't understand it.

### Anti-pattern

Reading a textbook definition and thinking "yes I get it" without producing
*any* representation yourself. Recognition is not comprehension.

---

## Gate 3 — Minimize

For any concept, find the **smallest possible example that still exhibits
the phenomenon**.

This is Terence Tao's signature move and Feynman's as well. The minimum
example is where the concept's *essential mechanism* is visible, stripped of
complexity.

### How to minimize

1. Find any example of the concept.
2. Ask: "can I remove something and still have an example?"
3. Remove it. Verify you still have the concept.
4. Repeat until further removal breaks the example.
5. That's your **minimum working example** (MWE).

### Worked example — "recursion"

- Large example: a recursive tree traversal of a filesystem
- Smaller: recursive Fibonacci
- Smaller: `f(n) = 1 if n=0 else f(n-1)` — counts down
- **Minimum:** `f(n) = f(n)` — pure self-reference (and it hangs; good — shows you *need* a base case)

The minimum both reveals the mechanism AND reveals what goes wrong when you
remove the supporting structure.

### Why this gate matters

- If you can't produce an MWE, you don't actually know what's essential about the concept.
- MWEs compress to a single retrievable image — ideal for encoding.
- Debugging is often "find the MWE of the bug."

---

## Gate 4 — Falsify

**Actively try to break the concept.** Don't wait for reality to test your
understanding — test it yourself, now.

### The falsification checklist

Ask for each concept:

- **Counterexample:** is there a case where the claim fails? If claimed to be true, where does it not apply?
- **Edge cases:** what about zero, empty, infinity, negative, one element, all elements the same?
- **Nearest neighbor:** what's the *almost-but-not-quite* version? What distinguishes them?
- **Wrong version:** what would the concept look like if it were wrong? Can you describe that clearly?
- **Scope:** what's *outside* the scope of this concept? When does it stop applying?

### Worked example — "pure function" (programming)

- Counterexample: `Math.random()` — no input change, different output → not pure
- Edge case: a function that throws on certain inputs — is it still pure? (arguably yes if deterministic)
- Nearest neighbor: referentially transparent expressions — broader than pure functions
- Wrong version: "pure function = no side effects" misses determinism requirement
- Scope: doesn't apply to interactive systems at the top level; applies to interior computations

### The failure-mode as encoding anchor

Whatever breaks the concept is your **NEDF Failure slot**. This gate directly
feeds the encoding step. If Gate 4 produces nothing, the encoding will be
weaker — no clear Failure to anchor it.

---

## Gate 5 — Regenerate

**Can you derive the concept from scratch, without looking?**

Not explain — *derive*. Given the setup but not the answer, can you produce
the result? This is the only real comprehension test; recognition is not.

### The regeneration test

1. Close the source.
2. Take a blank page.
3. Write down the minimum setup that leads to the concept.
4. Derive the concept from that setup.
5. Compare to the original.

If you can't do this cleanly, you haven't understood — you've absorbed.

### What to do when regeneration fails

Go back to the specific step where you couldn't continue. That's the weak
link. Either:
- A prerequisite is missing → backfill (confusion-triage)
- A representation isn't there → redo Gate 2 with that representation
- The minimum example wasn't minimum enough → redo Gate 3

### Worked example — "variance"

Setup: we want to measure how spread out a random variable is.

Derivation:
1. Natural first try: average the deviation from the mean. But E[X - μ] = 0 by definition of mean. Dead end.
2. Fix: make deviations positive. Two options: absolute value or square.
3. Square is analytically cleaner (differentiable, behaves well algebraically).
4. So: Var(X) = E[(X - μ)²]

If you can't walk this argument, you have the formula but not the concept.

---

## The Full Protocol — Walk-Through

For any difficult topic:

```
1. Locate      — 2 minutes, place it on the map
2. Represent   — 10–30 minutes, produce 3+ representations
3. Minimize    — 5–15 minutes, find the MWE
4. Falsify     — 10–20 minutes, attack it
5. Regenerate  — 5–10 minutes, derive without notes
                 If fails → loop back to the gate that broke
6. Encode      — NEDF + CAST + formula-system as applicable
7. Apply       — use it on a real problem within 48h (otherwise it fades)
```

**Total budget for a hard concept:** 30–90 minutes before encoding. This is
the real cost of understanding, and no shortcut exists. The memory systems
speed up the "encode and retrieve" portion — the comprehension cost stays.

---

## When to Use the Full Protocol vs. Abbreviated

### Full protocol (all 5 gates):
- Load-bearing concepts you'll use repeatedly
- Foundational concepts in a new domain
- Concepts where you've previously had the illusion of understanding but got burned
- Anything you intend to teach

### Abbreviated (Gates 1, 2, 5):
- Auxiliary concepts used once
- Concepts clearly subordinate to a deeper idea you've already mastered
- Under time pressure

### Minimal (Gate 1 only, then encode):
- Vocabulary terms with no conceptual depth
- Factual information (names, dates, constants)

**Rule of thumb:** if the concept has a Wikipedia article longer than 3
screens, use the full protocol. If it's a paragraph, Gate 1 + encode.

---

## Integration with the Rest of the System

- **Gate 1 (Locate)** → uses your existing CAST graph. Find the neighbors. If no neighbors → you need prerequisites first.
- **Gate 2 (Represent)** → the verbal and symbolic representations feed NEDF's Essence slot. Geometric feeds the image. Computational feeds a PAO chain.
- **Gate 3 (Minimize)** → the MWE is often the single best encoding image.
- **Gate 4 (Falsify)** → the strongest failure feeds NEDF's Failure slot directly.
- **Gate 5 (Regenerate)** → this is the Anki card (Format C in concept-encoding.md): "given setup, produce concept."

The protocol and the encoding system are complementary: comprehension produces
the raw material; encoding stores it. Without comprehension, encoding is
storage of confusion. Without encoding, comprehension decays.

---

## Anti-Patterns — What to Watch For

These are the comprehension failure modes. Learn to notice them in yourself:

### 1. Fake-reading
Eyes move, pages turn, nothing sticks. Test: stop and try to summarize. If you can't, you weren't reading, you were scanning.

### 2. Illusion of explanatory depth
Feeling you understand because the explanation made sense *to read*. Different from being able to *produce* it. Gate 5 catches this.

### 3. Confabulation
Filling gaps with plausible-sounding but unverified logic. Happens under social pressure or time pressure. Test: can you point to the source for each claim?

### 4. Jargon substitution
Using the technical term as if it were an explanation. "It's a closure" instead of explaining how it works. Gate 2 prose-representation catches this.

### 5. Premature encoding
Trying to compress a concept into a mnemonic before understanding it. The scene will be weak and retrieval will fail. All five gates must precede encoding.

### 6. Teaching-the-test
Understanding only the specific examples given, not the general pattern. Gate 3 (minimum example) and Gate 4 (falsify at edges) catch this.

---

## Key Principles

1. **Understanding precedes encoding. Always.** If a gate fails, don't encode.
2. **Representation plurality is non-negotiable.** One form = recognition, not understanding.
3. **Minimum examples are disproportionately valuable.** One MWE is worth ten complex examples.
4. **Falsification is constructive.** Breaking a concept strengthens your grasp of it.
5. **Regeneration is the only real test.** Recognition lies; regeneration doesn't.
6. **Time cost is real and unavoidable.** Difficult concepts cost 30–90 min of protocol work. No system reduces this below a floor.
7. **Apply within 48 hours.** Comprehension without application decays faster than encoded-but-applied.

---

## End-to-end failure map (which layer broke?)

When output is wrong but you are unsure *where*, walk this stack top-down (from *Beating the Red Queen* (`beating-the-red-queen.md`) Master System Map, adapted to this ecosystem):

1. **Attention** — never selected the load-bearing idea (noise, passive skim).
2. **Representation** — wrong form for the material (needs diagram, map, or decomposition before encoding).
3. **Encode** — skipped gates, weak NEDF/CAST/SPEAR, or rushed scene.
4. **Retrieve** — no spaced retrieval, no palace walk, or cards never drilled both directions.
5. **Apply** — no mini-mission / real task; stayed at recognition (`navigator.md` DOK check; **Act** phase).
6. **Maintain** — deck/palace drifted from source truth; prune and verify (`onboarding-path.md` verification cadence).

Fix the **first** layer that failed; re-running later layers without fixing the root layer wastes cycles.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-comprehension-protocol)**.

