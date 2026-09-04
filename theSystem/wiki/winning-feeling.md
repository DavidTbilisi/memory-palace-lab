---
palace: core-memory
level: 9
domain: 10
room: 6
wiki_source: wiki/learning-systems/winning-feeling.md
---

# Winning Feeling

**Summary**: Maltz's name for the felt-thermostat of the [ASM](./automatic-success-mechanism.md) — the somatic state ("confident · courageous · sure of the outcome") that signals the mechanism is currently set for success. The winning feeling does not *cause* success; it *measures* and *primes* it. Operationally critical because the felt-state is **bidirectional**: recall a past stored success → re-evoke the winning feeling → it pulls forward the matching action-pattern. This makes [SPARK](./spark-overview.md)'s Trophy Palace bidirectional: emit-on-event (current SPARK design) AND recall-as-priming (new with this ingest). Canonical source: [psycho-cybernetics-maltz](./psycho-cybernetics-maltz.md) Ch 14.

**Sources**:
- `Clippings/Books/Learning/The New Psycho-Cybernetics by Maxwell Maltz-no-password.pdf` (Maltz 1960 / Kennedy 2001) Ch 14
- Dr. Cary Middlecoff, *Esquire Magazine* April 1956 (quoted in source) — winning feeling in championship golf
- Bower, G.H. (1981) "Mood and memory" — state-dependent learning literature
- [psycho-cybernetics-maltz](./psycho-cybernetics-maltz.md) — source-summary

**Last updated**: 2026-05-24 (initial ingest)

---

## Definition

The winning feeling is the integrated somatic-emotional state that accompanies the [ASM](./automatic-success-mechanism.md) running at full capacity toward an attainable target. Its components: self-confidence, courage, calm assurance that the outcome will be desirable, "everything moves right," felt sense of being *on the line*.

(source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14, "How to Get and Keep That Winning Feeling")

> "The winning feeling itself does not cause you to operate successfully, but it is more in the nature of a sign or symptom that we are geared for success. It is more like a thermostat, which does not cause the heat in the room but measures it. However, we can use this thermostat in a very practical way. Remember: When you experience that winning feeling, your internal machinery is set for success." (source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14)

The thermostat metaphor is exact: the winning feeling reads out the ASM's setting. But — crucially — reading the thermostat backward (deliberately re-evoking the feeling) primes the corresponding setting. The wiki's load-bearing claim: **the felt-state is bidirectional, and the recall direction is operationally exploitable.**

---

## The bidirectional mechanism

(source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14, "How Science Explains That Winning Feeling")

```
Forward (Maltz default):    ASM-success → winning feeling (the thermostat reads)
Backward (operational use): winning feeling recall → ASM-success priming
```

The forward direction is automatic. The backward direction is *deliberate practice*:

1. Pick a target action-pattern you want primed (a presentation, a difficult conversation, a workout, a creative session).
2. Recall a past stored success that featured the action-pattern operating at its best.
3. Hold the recall long enough for the winning feeling to surface in the body (5–15 seconds typically).
4. Carry the feeling into the present action.

The mechanism: state-dependent memory (Bower 1981). Material encoded in a given emotional state is more retrievable in that same state. Past successes were encoded with the winning feeling; re-evoking the feeling re-evokes the action-patterns that were stored under it.

Maltz used this for stage fright, exam performance, and athletic clutch moments. The wiki uses it as a general-purpose priming protocol.

---

## How to build a Winning Feeling library

(source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14, multiple cases)

The library is built from **stored successes** — specific past moments where the ASM ran at full capacity and you felt it. Each entry has:

| Slot | Content |
|---|---|
| Trigger | One-sentence cue: "the day I gave the talk to 300 people without notes" |
| Domain | What activity / role: speaking, coding, conversation, training, problem-solving |
| Sensory anchor | The most vivid sensory detail at the moment of the win — sound of applause, smell of the room, texture of the keyboard, the particular light |
| Somatic anchor | Where in the body the winning feeling sits — chest expansion, jaw release, shoulder calm |
| Action-pattern primed | What this win primes for future use — public speaking, sustained focus, social calm |

The library should be 5–15 entries spanning the major action-pattern domains. Fewer than 5 → priming is brittle (single point of failure). More than 15 → access time drops, defeats the purpose.

**Pass-floor (METER metric)**: re-evoke any entry's winning feeling within 5 seconds. Drilled like a [spaced-repetition deck](./spaced-repetition.md).

---

## Connection to SPARK — bidirectional priming

(this is the load-bearing unlock from this ingest — see [composability-index](./composability-index.md) confirmed-unlock row)

[SPARK](./spark-overview.md) currently emits ceremony when wins happen (T0 Glance → T1 Spark → T2 Trophy → T3 Knowing). The ceremony places the win into the Trophy Palace as a locus.

This ingest adds: **the Trophy Palace can be walked backward.** Each Trophy locus is a stored success — exactly the substrate the Winning Feeling library requires. Walking a Trophy locus *deliberately* (not during ceremony, but during priming) re-evokes the winning feeling stored with the original event.

| SPARK direction | Trigger | Effect |
|---|---|---|
| **Emit** (current) | Win occurs | Ceremony places Trophy in Palace |
| **Recall** (new) | Upcoming high-stakes attempt | Walk matching Trophy → re-evoke winning feeling → prime ASM |

The Trophy Palace becomes a **two-way temple**: a witness to past wins AND a priming substrate for future ones. This is the kind of compositional unlock the [composability-index](./composability-index.md) is designed to capture.

Failure mode: priming with the wrong scale of past win (T0 glance memory primes a T2 attempt) → mismatch breaks the felt analogy. Match tier-to-tier: a Trophy-tier upcoming attempt deserves Trophy-tier (T2) priming, not Glance-tier.

---

## The conditioned-reflex variant (Maltz Ch 14, Brock case)

(source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14, Brock-the-medical-student case)

Brock's case: a medical student who froze under oral examination but performed brilliantly when alone with a microscope. He noticed the difference, and *deliberately conditioned* the winning feeling from the microscope-state to override the oral-examination state. By semester's end, the previously-paralysing oral exam *became a cue* for the winning feeling rather than for panic.

This is operant conditioning of a felt-state across contexts. The wiki adds it as a deliberate technique:

1. Identify a domain where you have a stable Winning Feeling stored (Maltz example: microscope).
2. Identify the failure-domain where you want it transferred (oral exams).
3. Each time you enter the failure-domain, deliberately recall the winning-feeling-domain.
4. Hold both states overlapping until the failure-domain cue *itself* starts to evoke the winning feeling.
5. ~3–4 weeks under daily exposure produces durable cross-domain transfer.

This is mechanistically the same as the bidirectional priming above, but with the deliberate aim of re-binding a stress-cue to the success-state. Closely related to the wiki's [5-gates-of-comprehension](./5-gates-of-comprehension.md) discipline of *not encoding while panicking*.

---

## The deeper claim — "I am the kind of person who…"

(source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14, near end)

> "The phrase 'I am the kind of person who [fill in the blank]' is incredibly revealing and incredibly powerful. It reveals what is at the core, not the circumference, of the self-image, to which all other thought, feeling, action, and outcome must conform. It also reveals exactly how you can lock in and assure the emergence of a winning feeling whenever it is appropriate." (source: pscyho-cybernetics-book-maxwell-maltz.pdf Ch 14)

The winning feeling and the [self-image](./self-image.md) are tightly coupled. The feeling is the *somatic readout* of the self-image's authorisation. A self-image that says "I am the kind of person who closes this deal" produces the winning feeling at the moment of the close — the ASM is authorised; the somatic system relaxes into the action.

This means winning-feeling work is identity work in disguise. Building a Winning Feeling library *is* building a [self-image](./self-image.md) inventory of attested capacities. The two protocols compose.

---

## What the Winning Feeling is **not**

1. **Not euphoria.** It is calm, expansive, easy — not high-arousal excitement. High-arousal states clamp the ASM's corrective loop ([ASM](./automatic-success-mechanism.md) §RELAX).
2. **Not confidence in the sense of swagger.** It is confidence in the sense of *the question is already settled.* No performance of confidence; the felt-state itself.
3. **Not "I will win this."** It is "I am the kind of person who is currently doing the thing." Present-tense, operation-in-progress, not future-tense outcome.
4. **Not a hack around poor preparation.** The winning feeling primes the action-pattern; the action-pattern still has to exist. Trying to re-evoke the feeling without the underlying competence produces brittle false-confidence.
5. **Not permanent.** It is state-dependent. It returns when re-evoked; it does not stay on.

---

## Failure modes

1. **Empty library** — no stored successes to recall. Common in users with chronically low [self-image](./self-image.md). Fix: build the library from *small* past wins first; scale up. A clean shave under pressure counts.
2. **Tier mismatch** — priming a Trophy-tier attempt with a Glance-tier memory. The felt-state doesn't match the demand; the priming fails.
3. **Forcing the feeling** — willing it to appear. The feeling arises from recall + sensory + somatic anchors; forcing it produces a brittle counterfeit that snaps under pressure.
4. **No body anchor** — the recall stays cognitive ("I remember winning") but doesn't surface in the body. Without somatic re-entry, no priming effect.
5. **Stale library** — entries older than 5 years lose vividness. Refresh the library by adding new entries from current life.
6. **Recall as nostalgia** — using past-win recall to escape current discomfort, not to prime present action. The feeling needs forward connection to a current attempt; otherwise it's just memory.

---

## Mnemonic and checksum

**Mnemonic**: a brass thermostat dial on the wall of the Velvet-Aeon temple, mounted next to the [Trophy Palace](./spark-overview.md) door — turn the dial backward and the dial's reading itself produces the heat. A small library of brass plaques below it, each engraved with one past-win cue; touch a plaque, the temperature settles into that win's range, and the [missile](./automatic-success-mechanism.md) in the next room aligns to fire.

**Checksum**: (a) name 3 entries from your Winning Feeling library by trigger + somatic anchor; (b) recall one entry now and notice (within 5 seconds) where in the body the feeling settles; (c) name the upcoming attempt you'd prime with it. If all three answer cleanly, the library is operational.

---

## Related pages

- [psycho-cybernetics-maltz](./psycho-cybernetics-maltz.md) — source-summary
- [automatic-success-mechanism](./automatic-success-mechanism.md) — what the winning feeling measures
- [self-image](./self-image.md) — what the winning feeling depends on; tight coupling
- [theater-of-the-mind](./theater-of-the-mind.md) — produces winning-feeling library entries when scenes resolve well
- [spark-overview](./spark-overview.md) §Bidirectional priming — Trophy Palace as priming substrate
- [snap-back-effect](./snap-back-effect.md) — when the winning feeling collapses mid-attempt, the rubber band fired
- [failure-mechanism](./failure-mechanism.md) — F·A·I·L·U·R·E. signals are the *absence* of the winning feeling
- [active-recall](./active-recall.md) — winning feeling recall is a special-case retrieval-practice (somatic, not propositional)
- [pulse-overview](./pulse-overview.md) — winning feeling correlates with high-Energy / low-Stress states; PULSE conditions support its recall

---

## U — See (CAST)

1. Winning feeling = somatic readout of ASM-success authorisation
2. Edges (forward): self-image OK → ASM runs → winning feeling reads
3. Edges (backward): recall past win → re-evoke feeling → prime current ASM

## D — Name (NEDF)

1. Winning feeling = felt-thermostat of the ASM
2. Bidirectional: reads forward, primes backward
3. Library of 5–15 stored-success entries with sensory + somatic anchors

## F — Do (SPEAR)

1. Build library — 5–15 entries with trigger + sensory + somatic anchors
2. Before high-stakes attempt → recall matching entry; hold 5–15 s; carry forward
3. Tier-match: Trophy-tier attempt → Trophy-tier entry
4. Refresh library — add entries from new wins; retire stale ones

## B — Watch (HEART)

1. Empty library (no stored wins to recall)
2. Tier mismatch (Glance memory priming Trophy attempt)
3. Forcing the feeling (counterfeit; snaps under pressure)
4. Recall without body anchor (cognitive only, no priming effect)
5. Recall as nostalgia, not as forward priming

## L — Predict (ORACLE)

1. Library well-built → high-stakes attempts run with calm assurance
2. Library empty → ASM unprimed; high snap-back risk
3. T3 Knowing event after recall-then-attempt sequence → register as confirmed unlock

## R — Act (GRACE)

1. New domain to prime → file the first Winning Feeling library entry now
2. Before upcoming attempt → 5-min priming session, matching tier
3. Win occurs → file new Winning Feeling entry same day
