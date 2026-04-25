# Confusion Triage Protocol

When you don't understand something, **don't grind**. Grinding on confusion
produces fatigue without comprehension. Instead, *triage*: identify what kind
of confusion you're in, then apply the matching move.

This is different from the Heuristic Palace (which handles "stuck on solving
a problem"). This protocol handles "stuck on understanding something."

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-confusion-triage) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The First Move — Name Your Confusion

Before doing anything else, write one sentence:

> "I don't understand [X] because [Y]."

If you can fill in Y, you're already halfway out. If you can't, that's your
first problem: **you don't know what you don't know.** Unnamed confusion is
the hardest to dissolve.

### The five kinds of "I don't understand"

| Kind | Symptom | Triage → |
|------|---------|----------|
| **A. Prerequisite gap** | Specific words or symbols feel opaque | Backfill |
| **B. Tangled concepts** | "I sort of get it but it slips" | Separate the parts |
| **C. Wrong mental model** | Things don't add up; contradictions appear | Find the broken assumption |
| **D. Missing representation** | I can read it but can't visualize/compute it | Add a representation |
| **E. Scale mismatch** | Too abstract OR too concrete for me right now | Zoom |

Diagnose which you're in before applying a move.

---

## A. Prerequisite Gap

**Symptom:** a specific term, symbol, or reference goes by and you feel an
abrupt drop in comprehension. The rest of the passage becomes noise.

### The backfill move

1. **Mark the exact sentence** where confusion started.
2. **Identify the unfamiliar atom** (a word, a symbol, an assumed fact, a reference).
3. **Resolve only that atom**, not more. Don't go on a tangent.
4. Return to the exact sentence and re-read.
5. If still confused, repeat — there may be 2–3 unknowns stacked.

### The "two levels down" rule

If you hit 3+ prerequisites in a single passage, **the current source is pitched above your level**. Drop two levels of difficulty:

- Textbook too advanced → intro textbook
- Intro textbook too dense → undergraduate lecture notes
- Undergraduate notes too dense → Wikipedia + a ChatGPT-style explainer

Then climb back up. Dropping levels is not failure — trying to learn above
your actual prerequisite base is.

### Anti-pattern: the prerequisite trap

Keeping going despite mounting gaps, hoping it'll "click." It won't. Each
subsequent unfamiliar term compounds the earlier gap. Triage early.

---

## B. Tangled Concepts

**Symptom:** the general shape feels familiar but specifics slip. You can
almost reproduce it, but there's a part that shifts each time you try to
pin it down.

### The separation move

1. **Name every distinct idea** in the passage. Not sentences — *ideas*. There are usually 2–5.
2. **Write each on its own line.**
3. **For each, test separately:** can you produce a representation? A minimum example?
4. The one that fails is the weak link.
5. Apply the Comprehension Protocol to *just that piece*.

### Worked example — "monads" (programming)

Student: "I don't get monads."

Separation:
- Part 1: what a monad *is* (a type + two operations)
- Part 2: the laws a monad must satisfy
- Part 3: why monads are useful (sequencing effects)
- Part 4: specific monad examples (Maybe, List, IO)

Usually one of these is fine and others aren't. The student often has
Part 1 and 4 but not Part 2 or 3, and conflates them.

### Anti-pattern: re-reading the whole thing

Re-reading the full passage doesn't help if only one sub-idea is weak. You'll
just re-encounter the weak point and slide past it again. Separate first.

---

## C. Wrong Mental Model

**Symptom:** you can follow the words but something feels *off*. Later
statements seem to contradict earlier ones. Claimed conclusions feel
unjustified. You're building an internal picture that doesn't match the
author's.

This is the most dangerous kind because you don't feel confused — you feel
*annoyed at the author*. Usually the author is right and your model is wrong.

### The broken-assumption move

1. **Notice the first place something felt off.** Not the first place you got confused — the first place you had a mild "wait, what?" reaction.
2. **Identify the assumption you were making** that didn't match.
3. **Drop it and re-read from that point.**

### Diagnostic questions

- "What does the author assume here that I'm not?"
- "What definition are they using that might differ from the one in my head?"
- "What am I *extending* from a similar-but-different concept I already know?"

### Worked example — "infinity in set theory"

Naive model: "infinity is just a really big number."
First-pass reading of Cantor: "wait, there are different sizes of infinity? But infinity is just... infinity?"

The wrong model is "infinity is a single concept." The right model is
"infinity is a property (uncountability, etc.), and there's a whole hierarchy."
Until you drop the old model, everything after is noise.

### Anti-pattern: fighting the author

"This book is badly written." Occasionally true; usually it's a wrong-mental-model
problem. Check this first before blaming the source.

---

## D. Missing Representation

**Symptom:** you can read the prose and recite the formula, but can't
picture it, can't compute a specific case, can't manipulate it.

### The representation move

Ask which representations you have:

- Verbal ✓/✗
- Symbolic ✓/✗
- Geometric ✓/✗
- Computational ✓/✗

You probably have 1–2. **Build the missing one.**

Common patterns:
- Symbolic-only → build the geometric (draw it)
- Verbal-only → build the symbolic (write the equation)
- Geometric-only → build the computational (work a specific case)

### The computational fallback

When no other representation works: **just compute an example by hand**.
Pick concrete numbers. Grind through. The specific case often illuminates
the general case by forcing every step into the open.

---

## E. Scale Mismatch

**Symptom:** the explanation feels *either* too abstract (you can't ground it)
or too concrete (you can't see the pattern).

### The zoom move

**Too abstract** → zoom in: find a concrete instance, work it through in detail.
**Too concrete** → zoom out: ask "what's the general pattern here?"

### The abstraction ladder

Every concept lives on a ladder:

```
   Meta-principle         (the rule behind the rules)
        ↑
   General pattern        (the abstract form)
        ↑
   Specific theorem       (the named result)
        ↑
   Worked example         (a concrete case)
        ↑
   Numerical instance     (actual values computed)
```

When stuck, move **one rung at a time** toward the concrete until things click.
Then climb back up.

### Anti-pattern: stuck at the wrong rung

Trying to understand a "general pattern" when you haven't grounded it in
any specific theorem. Or memorizing specific theorems without ever asking
"what's the pattern?" Both fail. Oscillate.

---

## The Triage Flowchart

```
I don't understand this.
│
├── Can I name the confusion? ("I don't get X because Y")
│   │
│   ├── NO → Re-read slowly, paragraph by paragraph, until something
│   │       specific trips you up. That's your first atom.
│   │
│   └── YES → What kind?
│            │
│            ├── Prerequisite gap      → BACKFILL (section A)
│            ├── Tangled concepts      → SEPARATE (section B)
│            ├── Wrong mental model    → FIND BROKEN ASSUMPTION (section C)
│            ├── Missing representation → BUILD NEW REPRESENTATION (section D)
│            └── Scale mismatch        → ZOOM (section E)
```

---

## Stopping Rules — When to Abandon

Not every confusion is worth dissolving *right now*.

### Abandon for the session if:
- You've triaged through 3+ levels and the gap is still widening
- You've spent > 90 minutes on a single concept with no progress
- You're fatigued (willpower is a variable, and it runs out)

### Abandon the topic (temporarily) if:
- The prerequisite stack is 3+ levels deep — you'll learn faster by going back and building up
- The topic assumes a domain you don't have — learn that domain first
- Multiple attempts on different days have failed — something structural is missing

**Rule:** abandonment is a rational move, not a failure. Return in a week
with the gap filled. Don't turn comprehension into willpower-grinding.

---

## Advanced Moves

### The explain-to-a-child test

Try to explain the confusing thing to a bright 12-year-old. Forcing
simplification reveals exactly where your understanding is glued together
with jargon.

### The Feynman technique

Write the concept out as if teaching it. Every time you reach for jargon to
paper over a gap, mark that spot. Those are your real confusion points.

### The steelman-the-counter move

Construct the *strongest possible argument* against the concept. If you
can't, you don't understand the concept well enough to know why it's right.

### The "wait, so…" probe

After reading a paragraph, say out loud: "Wait, so you're saying [X]?"
Forcing a paraphrase reveals whether you actually parsed it or just
pattern-matched on words.

### The opposite-direction derivation

Instead of reading forward to the conclusion, **start from the conclusion and work backward** to the premises. This reveals *which* premises are doing the work.

---

## Integration with Other Systems

- **Heuristic Palace** handles "stuck on solving." **This protocol** handles "stuck on understanding."
- **Comprehension Protocol** is the happy-path (you're making progress). **This** is the stuck-path.
- **NEDF encoding** requires a successful comprehension-protocol run. If triage keeps firing, don't encode yet.

**When in doubt:** if you're making progress, use Comprehension Protocol. If you're not, use this.

---

## Key Principles

1. **Name your confusion before acting.** Unnamed confusion can't be triaged.
2. **There are 5 kinds of confusion.** Apply the matching move, not a generic "try harder."
3. **Prerequisite gaps compound.** Fix early or drop levels.
4. **Wrong mental models feel like annoyance, not confusion.** This is the dangerous one.
5. **Representations are cheap to try.** If one isn't working, build another.
6. **Abandonment is rational.** Return with prerequisites built.
7. **Don't grind.** Grinding on confusion trains *being confused*, not understanding.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-confusion-triage)**.

