---
palace: core-memory
level: 8
domain: 10
room: 4
wiki_source: wiki/learning-systems/self-explanation.md
---

# Self-Explanation Protocol

**Summary**: A proactive comprehension gate that sits between reading and encoding. Uses SEAL (four-step protocol), WWHB (four-part explanation skeleton), and FAKE (four gap signals) to verify real understanding before material enters NEDF, CAST, SPEAR, or a palace.

**Sources**:
- [bridge-load](./bridge-load.md)
- [semantic-reading-system](./semantic-reading-system.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [NEDF](./nedf-overview.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)

**Last updated**: 2026-05-03

---

## Purpose

Semantic reading classifies what you read. BRIDGE LOAD handles concepts that already feel unclear. Neither guards against the most common comprehension failure: the illusion of knowing — you followed the text, the words made sense, but you cannot explain the mechanism.

Self-explanation is the proactive quality gate between input and encoding. You close the source and explain the concept from scratch. Where you stall, handwave, or fall back on jargon, you have found the real gap.

**Pipeline placement:**

```
Semantic Reading → SELF-EXPLAIN → [BRIDGE LOAD if needed] → encode (NEDF / CAST / SPEAR)
```

---

## The SEAL Protocol

`SEAL = Seal source, Explain, Audit gaps, Land it`

**Scene to encode it:** You are sealing an envelope. You close it (S), write the address (E), stamp it with a quality sticker (A), lock it in the mailbox (L).

### S — Seal the source

Close or hide everything. No visible text, no notes. This step is non-negotiable. If you can see the source, you will read rather than explain.

### E — Explain using WWHB

Speak or write the explanation — do not only think it. Thinking allows gaps to pass silently. Speaking or writing forces every gap into the open.

Use the four-part WWHB skeleton (see below).

### A — Audit for the 4 FAKE moves

While explaining, watch for the four gap signals (see FAKE below). Mark each occurrence. Do not fix them mid-explanation — finish first, then count.

### L — Land it

Apply the routing rule and confirm pass. Encode only after the pass condition is met.

---

## The WWHB Skeleton

`WWHB = What, Why, How, Breaks`

**Scene to encode it:** Two wrestlers (WW = What + Why) shake hands (H = How it works), then someone swings a bat at them to test if they fall (B = Breaks).

| Part | Starter phrase | What it forces |
|---|---|---|
| **W — What** | "X is a [type/category] that [does/is]..." | You name what kind of thing it is |
| **W — Why** | "It exists to solve [problem]..." | You state the reason it exists |
| **H — How** | "Mechanically, it works by [steps, no jargon]..." | You describe the actual mechanism |
| **B — Breaks** | "It fails or doesn't apply when [condition]..." | You mark the boundary |

Every explanation must cover all four parts. A partial explanation (What + How only, or Why with no mechanism) is an incomplete pass.

**Listener level:** Default to smart non-specialist — intelligent person, no domain knowledge, would stop you the moment you use jargon. This forces mechanism without being theatrical.

**WWHB maps naturally onto [NEDF](./nedf-overview.md):**
- What → Name-hook + Essence
- How → Distinguisher (mechanism in operation)
- Breaks → Failure mode

This means a clean WWHB explanation is already half-way to a NEDF encoding.

---

## The 4 FAKE Moves

`FAKE = Freeze, Approximate, Keyword, Echo`

**Scene to encode it:** A bad stage actor performs all four: freezes on stage, waves vaguely at the props, reads from a hidden script, then just repeats the last thing the director said.

| Letter | Signal | What it looks like | What it means |
|---|---|---|---|
| **F — Freeze** | 3+ second stall, cannot continue | "...uh...it's..." | Mechanism is missing |
| **A — Approximate** | Vague phrase: "kind of...", "somehow...", "it processes..." | "It kind of handles the request..." | You don't have it precisely |
| **K — Keyword** | Technical term you couldn't define further if asked | "It uses asymmetric encryption" (but can't explain asymmetric) | Label without mechanism |
| **E — Echo** | Verbatim repetition of the definition from memory | "TCP ensures reliable, ordered delivery of packets" (word for word) | Recognition, not understanding |

Every FAKE move is a gap marker, not a failure. The point is to find gaps before encoding, not to perform perfectly.

---

## Routing Rule (inside L)

| FAKE count | Action |
|---|---|
| 🟢 0 FAKE moves | Encode directly into NEDF / CAST / SPEAR / palace |
| 🟡 1–2 FAKE moves | Return to source only for those gaps → re-explain once → encode |
| 🔴 3+ FAKE moves | Trigger [BRIDGE LOAD](./bridge-load.md) → rebuild analogy → re-explain → encode |
| Cannot start (no category) | Return to [semantic reading](./semantic-reading-system.md) Mode 2 first |

Targeted re-reading: go back only to the sections that caused FAKE moves. Do not re-read the whole chapter.

---

## Pass Rule

You pass when:
- All four WWHB parts come out without a FAKE move
- If an imaginary listener asked *"but how does that actually work?"* you can answer without re-quoting

**Optional upgrade:** After passing, generate 2–3 concrete examples of your own (not the book's). If you can explain + give novel examples, encoding will be durable.

---

## How to Memorize the Protocol

Use the protocol on itself. One session:

1. Close this page
2. SEAL: name target = "Self-Explanation Protocol"
3. Explain WWHB — What is SEAL? Why does it exist? How does each step work? Where does SEAL break or not apply?
4. Audit: mark every Freeze, Approximate, Keyword, Echo
5. Return only to the letters you stalled on

That is one rep. The protocol encodes itself.

---

## How to Check It (Daily Card)

30-second self-check:

1. What does **SEAL** stand for? — say all 4
2. What does **WWHB** stand for? — say all 4 questions
3. What does **FAKE** stand for? — say all 4 signals
4. What are the **3 routing gates**? — 0 / 1–2 / 3+

If you stall on any letter, that is the one to re-explain — not the whole thing.

**Mastery check:** Pick any concept you think you know. SEAL it in real time. If you hit zero FAKE moves across all four WWHB parts, the protocol is solid.

---

## When to Use SEAL

Use it when:
- You finished a section and want to encode it
- You built a BRIDGE analogy and want to test whether it holds
- You can repeat a definition but sense the mechanism is fuzzy
- You are about to put something into a palace and want to make sure the content is right

Do not use it on every sentence. Apply it at section or concept level. Material that is genuinely simple (facts, dates, names) does not need WWHB — route directly to NEDF or a palace locus.

---

## External grounding — Elaboration (Learning Sciences strategy #4)

Self-explanation is the canonical operational form of the **elaboration** strategy from Dunlosky et al.'s 2013 meta-review (one of the six high-utility strategies synthesized by the Learning Scientists framework). Chi et al. (1989, 1994) showed that learners who self-explained worked examples while studying outperformed those who studied silently by ~30% on transfer problems — even when total study time was equated. The mechanism is elaborative interrogation: explaining *why* something is true forces connection-building between new material and existing schemas, which is what produces durable, transferable knowledge.

The SEAL / WWHB / FAKE protocols on this page are the Neural OS-flavored implementation: SEAL is the rigorous form (Statement-Evidence-Analogy-Limit), WWHB is the lightweight check (What-Why-How-But), FAKE is the failure-mode-surfacing form. All three implement Chi's "self-explanation effect" via structured prompts rather than free-form prose.

The complementary elaboration moves in Neural OS:
- [BRIDGE LOAD](./bridge-load.md) — elaboration via *load-bearing analogy construction*; turns new domain into a structural mapping of an existing one
- [NEDF](./nedf-overview.md) Distinguisher slot — elaboration via *contrastive specification* (why X differs from its neighbors)
- [CAST](./cast-overview.md) verb-edges — elaboration via *named relations* (why nodes connect this way)
- [SPEAR](./spear-overview.md) Repair slot — elaboration via *failure-recovery* (what goes wrong and how to fix it)

See [learning-sciences-validation](./learning-sciences-validation.md) for the full mapping. Self-explanation is the canonical citation; the encoder slots are the per-encoder operational implementations.

---

## Related Pages

- [bridge-load](./bridge-load.md)
- [semantic-reading-system](./semantic-reading-system.md)
- [semantic-listening-system](./semantic-listening-system.md)
- [rapid-in-neural-os](./rapid-in-neural-os.md)
- [NEDF](./nedf-overview.md)
- [framework-comparison-matrix](./framework-comparison-matrix.md)
- [missing-encoding-layers](./missing-encoding-layers.md)
- [learning-sciences-validation](./learning-sciences-validation.md)


---

## U — See (CAST)
1. SEAL protocol + WWHB skeleton + FAKE gap signals
2. Proactive comprehension gate before encoding

## D — Name (NEDF)
1. Self-explanation = comprehension gate before encoding
2. Distinguisher: sits between reading and encoding
3. Failure mode: encoding before understanding

## F — Do (SPEAR)
1. Read → SEAL (Skim · Explain · Anchor · Link)
2. Use WWHB to structure explanation

## B — Watch (HEART)
1. FAKE gap signals ignored
2. Bypass to encoding

## L — Predict (ORACLE)
1. FAKE signal → predict comprehension gap
2. SEAL pass → predict encoding readiness

## R — Act (GRACE)
1. Pre-encoding → run SEAL
2. FAKE signal → return to source