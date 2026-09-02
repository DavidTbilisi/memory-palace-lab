---
palace: meta-knowledge
level: 9
domain: 10
room: 39
wiki_source: wiki/logic/limits-of-language-tlp.md
---

# Limits of Language (TLP 5.6–5.641)

**Summary**: [TLP](./tractatus-logico-philosophicus.md) propositions 5.6–5.641: **the limits of my language are the limits of my world**. What lies beyond the limit is *simply nonsense* — not a different kind of thing, but no-thing-at-all. Plus the TLP treatment of **solipsism**: what solipsism *means to say* is correct, but cannot be said; it can only be shown by the fact that *"the world is my world"*. The proposition layer linking [picture theory](./picture-theory-of-language.md), [truth-function machinery](./truth-function-machine.md), and the [mystical](./the-mystical-tlp.md).

**Sources**:
- [Wittgenstein TLP](./tractatus-logico-philosophicus.md) propositions 5.6 – 5.641 (German + Ogden + Pears/McGuinness).
- Russell's introduction to TLP — discussion of the solipsism passage and the *metaphysical subject*.
- [godels-incompleteness](./godels-incompleteness.md) — Gödel makes "limits of language" technically precise via the Gödel sentence.

**Last updated**: 2026-05-25

---

## One-line

> *The limits of my language mean the limits of my world.* — TLP 5.6

Whatever can be said falls inside the limit. Whatever lies beyond is *not* a different domain of facts; it is **nonsense** in TLP's strict sense — not the popular "absurd" sense but the technical sense of *no-sense / no-content / no-truth-conditions*.

## Unlocks (lead, not footer)

1. **Limit is *internal*, not external.** TLP doesn't claim there's a *larger* reality outside the limits of language — that would itself be a proposition about something outside language, which TLP forbids. The limit is *internal* to language: language reaches its own edge from inside; what lies beyond is *not another thing* but *no-thing*. This is hard to grasp but load-bearing.

2. **Solipsism shown, not said.** TLP 5.62: *what solipsism means is quite correct, only it cannot be said, but it shows itself*. The solipsist is right that *the world is my world* (TLP 5.62) — but stating it as a proposition fails because the propositional form requires distinguishing "my" world from "the" world, and the very point is that they are identical. **Solipsism is shown by the structure of language and experience; not said by the solipsist as a proposition.**

3. **Gödel makes the limit technical.** TLP's *philosophical* limit becomes, via Gödel 1931, a *technical mathematical* limit. Every sufficiently powerful consistent formal system has internal limits — true propositions about itself that it cannot prove. Gödel doesn't refute TLP's limit-of-language thesis; **he vindicates it at a deeper technical layer**.

4. **The *metaphysical subject* is the limit, not an inhabitant of the world.** TLP 5.633: *the metaphysical subject does not belong to the world but is a boundary of the world*. The "I" who experiences the world is not *in* the world as one fact among others — it is *the limit* through which the world is constituted. **This is the deepest move in TLP** — and it's also why TLP is largely an *anti-philosophy* book: trying to say *who I am* runs into the limit-of-language wall.

## Mnemonic

**5.6 → 5.633 → 5.641** = *limit · metaphysical subject as boundary · solipsism shown.*

Three anchor propositions in the 5.6 sub-range. Read sequentially they unfold TLP's limit-of-language thesis from general claim → metaphysical structure → operational consequence.

## Memory checksum

1. **State TLP 5.6.** (*The limits of my language are the limits of my world.* (Ogden) / *The limits of my language mean the limits of my world.* (Pears/McGuinness))
2. **State the nonsense claim.** (TLP: what lies beyond the limit is *nonsense* (Unsinn) — not "absurd" in the popular sense, but technical: no truth-conditions, no propositional content. It's not *false*; it's *not a proposition*.)
3. **State the solipsism move.** (TLP 5.62: what solipsism *means to say* is correct, but cannot be said; it shows itself by the fact that "the world is my world".)
4. **State TLP 5.633 on the metaphysical subject.** (*The metaphysical subject does not belong to the world but is a boundary of the world.* The "I" is not in the world as a fact; it is the limit through which the world is constituted.)
5. **Cross-link to Gödel.** (TLP's *philosophical* limit becomes Gödel's *technical mathematical* limit: every sufficiently powerful consistent formal system has internal limits. Gödel vindicates TLP at a deeper technical layer.)

## Visual — the limit structure

```p5 height=430
p.setup = () => { p.createCanvas(Math.min(el.clientWidth||600, 600), 430); p.noLoop(); };
p.draw = () => {
  const W = p.width;
  p.background(p.isDark ? 30 : 245);
  const ink = p.isDark ? '#ECE4D3' : '#2B2620';
  const green = '#5c7a54', gold = '#a08a5c', slate = '#7d8aa0';
  const bx = 50, by = 26, bw = W - 100, bh = 196;
  p.noFill(); p.stroke(green); p.strokeWeight(2);
  p.rect(bx, by, bw, bh, 20);
  p.noStroke(); p.fill(ink);
  p.textAlign(p.CENTER, p.TOP); p.textSize(15);
  p.text('"MY WORLD"', W/2, by + 16);
  p.textSize(12);
  p.text('= facts\n= sayable propositions\n= atomic facts + truth-functions thereof', W/2, by + 44);
  p.fill(slate); p.textStyle(p.ITALIC);
  p.text('◀── INSIDE THE LIMIT ──▶', W/2, by + bh - 30);
  p.textStyle(p.NORMAL);
  const my = by + bh;
  p.fill(gold); p.noStroke();
  p.circle(W/2, my, 12);
  p.fill(ink); p.textAlign(p.LEFT, p.TOP); p.textSize(11);
  p.text('← The METAPHYSICAL SUBJECT is HERE\n   (boundary, not inhabitant)', W/2 + 12, my - 6);
  p.fill(gold); p.textAlign(p.CENTER, p.TOP); p.textSize(14);
  p.text('NONSENSE (Unsinn)', W/2, my + 42);
  p.fill(ink); p.textSize(11);
  p.text('What lies beyond — but NOT as another domain.\nNot "things outside the world" but "not-things at all".\n\nIncludes: solipsist propositions,\nethical propositions (transcendental),\npropositions about the limit itself.\n\nAll show themselves; none can be said.', W/2, my + 66);
};
```

The limit is the *edge* of language, not a *fence* with a different domain beyond. What's "beyond" is *not*. The metaphysical subject is the limit-as-perspective.

---

## The propositions of TLP 5.6

| TLP # | Proposition (Pears/McGuinness) |
|---|---|
| **5.6** | The limits of my language mean the limits of my world. |
| **5.61** | Logic pervades the world: the limits of the world are also its limits. So we cannot say in logic, "The world has this in it, and this, but not that." For that would appear to presuppose that we were excluding certain possibilities, and this cannot be the case, since it would require that logic should go beyond the limits of the world; for only in that way could it view those limits from the other side as well. We cannot think what we cannot think; so what we cannot think we cannot say either. |
| **5.62** | This remark provides the key to the question, to what extent solipsism is a truth. In fact what solipsism means is quite correct, only it cannot be said, but it shows itself. The fact that the world is my world shows itself in the fact that the limits of the language (the language which I understand) mean the limits of my world. |
| **5.621** | The world and life are one. |
| **5.63** | I am my world. (The microcosm.) |
| **5.631** | The thinking, presenting subject; there is no such thing. If I wrote a book "The world as I found it", I should also have therein to report on my body and say which members obey my will and which do not, etc. This then would be a method of isolating the subject or rather of showing that in an important sense there is no subject: that is to say, of it alone in this book mention could not be made. |
| **5.632** | The subject does not belong to the world but it is a limit of the world. |
| **5.633** | Where in the world is a metaphysical subject to be noted? You say that this case is altogether like that of the eye and the field of sight. But you do not really see the eye. And from nothing in the field of sight can it be concluded that it is seen from an eye. |
| **5.6331** | For the field of sight has not a form like this: [diagram of an oval with an eye marked at the edge]. |
| **5.634** | This is connected with the fact that no part of our experience is also a priori. Everything we see could also be otherwise. Everything we can describe at all could also be otherwise. There is no order of things a priori. |
| **5.64** | Here we see that solipsism strictly carried out coincides with pure realism. The I in solipsism shrinks to an extensionless point and there remains the reality co-ordinated with it. |
| **5.641** | There is therefore really a sense in which the philosophy can speak of an I in a non-psychological sense. The I occurs in philosophy through the fact that the "world is my world". The philosophical I is not the man, not the human body or the human soul of which psychology treats, but the metaphysical subject, the limit — not a part of the world. |

The structure: limit (5.6, 5.61) → solipsism (5.62) → the subject (5.62-5.641) → metaphysical subject as limit (5.633, 5.641).

## The limit as internal, not external

TLP 5.61 contains the load-bearing logical claim:

> *We cannot say in logic, "The world has this in it, and this, but not that." For that would appear to presuppose that we were excluding certain possibilities, and this cannot be the case, since it would require that logic should go beyond the limits of the world; for only in that way could it view those limits from the other side as well.*

The argument:
1. To say *"X is excluded from the world"* presupposes a vantage point from which the exclusion can be observed.
2. Such a vantage point would be *outside* the world.
3. But logic (= the limit) cannot get outside the world.
4. Therefore, exclusions can't be *said* — they can only be *shown* by the fact that some descriptions are nonsense.

This is the *internal* nature of the limit. The limit isn't *a wall with a different region beyond*; it's *the edge of describability seen from inside*.

The wiki cross-links this to the *show-vs-say* boundary ([show-vs-say](./show-vs-say.md)) and to TLP's anti-philosophy stance ([the-mystical-tlp](./the-mystical-tlp.md) §TLP 6.53).

## Solipsism — what shows itself

TLP 5.62: **solipsism is correct in what it means, but cannot say it.**

The solipsist tries to assert: *"the world is my world"*. But the proposition fails because:
- It presupposes a distinction between *"my world"* and *"the world"*.
- The whole point is that the two are identical.
- So the proposition's terms collapse: there's no contrast to anchor the meaning.

What the solipsist is right about: the world *is* given to me through my language and experience; there's no view-from-nowhere; the limits of my language *are* the limits of my world.

How this shows itself: *the limits of my language structurally coincide with the limits of my world* — this isn't a proposition I assert; it's a structural feature of any case in which language and experience exist together.

Russell's introduction calls this *"a somewhat curious discussion of Solipsism"*. Russell never fully accepted the move; he suspected a hierarchy-of-languages could be developed where solipsism could be *said* in a meta-language. Wittgenstein rejected this throughout his life.

## The metaphysical subject (5.633, 5.641)

> *The subject does not belong to the world but it is a limit of the world.* — TLP 5.632

This is one of the deepest moves in 20th-century philosophy. The "I" — the experiencing subject — is *not* one fact among others *in* the world. The "I" is *the limit*, through which the world appears as a world.

Russell's analogy in TLP 5.633: **the eye and the field of sight**. You don't *see* the eye in the field of sight; the eye is the *origin* from which the field is seen. Similarly, you don't find the *I* among the contents of experience; the *I* is the origin from which experience is structured.

The metaphysical subject is *not* the empirical "I" (which is a body, a brain, a psychology — those are facts in the world). The metaphysical subject is the *boundary* — the *perspective* — through which all this is given.

This connects TLP to:
- **Kant's transcendental unity of apperception** (the "I think" that must be able to accompany all my representations — not an empirical fact, but a structural condition).
- **Husserl's transcendental ego** (the founding subject of phenomenology).
- **Heidegger's *Dasein*** (the being-there that is the *opening* in which beings come to presence).

TLP's specific formulation — the metaphysical subject as *limit*, not *thing* — is its distinctive contribution.

## Cross-link to Gödel

TLP's *philosophical* claim — that every formal/language system has internal limits — became, via Gödel 1931, a *technical mathematical* result. Gödel's first incompleteness theorem produces, for any sufficiently powerful consistent formal system, a true proposition the system cannot prove.

The Gödel sentence is precisely the *limit* of the system — a fact about the system that the system itself cannot say. **The Gödel sentence shows itself in the system's structure (we can see it from outside) but cannot be said inside.**

This is TLP's show-vs-say boundary made technical. The wiki cross-links: TLP's 5.6 and 6.522 are philosophically what Gödel's 1931 is mathematically.

What this means for TLP's limit thesis:
- The thesis *survives* and is *vindicated* at the technical layer.
- The thesis is *broader* than Gödel proved — TLP claims it about *language as such*; Gödel proved it about *sufficiently-powerful consistent formal systems*. The broader thesis is harder to defend rigorously.
- The thesis's specific TLP 5 *machinery* (every proposition is a truth-function of elementary propositions) is what Gödel killed in scope; the limit-thesis itself isn't refuted.

## The structural shape — internal vs external limits

Wiki cross-domain pattern: many systems have *internal* limits (boundaries seen from inside) rather than *external* limits (walls beyond which lies another domain).

| Domain | Internal limit |
|---|---|
| Language (TLP) | What can be said vs what shows itself |
| Mathematics (Gödel) | What can be proven within the system vs what is true |
| Computation (Turing) | What is computable vs what is well-defined but uncomputable |
| Physics (relativity) | The speed of light as boundary of causal influence — internal to causal structure |
| Phenomenology (Husserl/Heidegger) | The horizon of experience — internal to consciousness, not a wall beyond which consciousness ends |

This is a candidate META-pattern: **internal limits as structural features of any sufficiently expressive system**. The wiki queues this as a cross-domain pattern worth tracking.

## METER integration

| Drill | Pass floor | Source |
|---|---|---|
| State TLP 5.6 | <15 s | this page §Mnemonic |
| Explain the internal-vs-external limit distinction | <60 s | this page §Internal not external |
| State the solipsism-shown-not-said move | <60 s | this page §Solipsism |
| State the metaphysical-subject-as-limit (5.633) with the eye analogy | <60 s | this page §Metaphysical subject |
| Cross-link TLP 5.6 to Gödel's incompleteness | <60 s | this page §Cross-link to Gödel |

## Related pages

- [tractatus-logico-philosophicus](./tractatus-logico-philosophicus.md) — source primary text
- [picture-theory-of-language](./picture-theory-of-language.md) — what can be said inside the limit
- [show-vs-say](./show-vs-say.md) — the limit is shown, not said
- [the-mystical-tlp](./the-mystical-tlp.md) — what lies "beyond" the limit (= not-things)
- [atomic-fact-tlp](./atomic-fact-tlp.md) — the smallest sayable units
- [truth-function-machine](./truth-function-machine.md) — the construction of sayable propositions
- [godels-incompleteness](./godels-incompleteness.md) — TLP's limit thesis made technical
- [wittgenstein-ludwig](./wittgenstein-ludwig.md) — author biography
- bible-study-hebrews-11-1 — sister epistemic structure (faith of things not seen)
- [glossary](./glossary.md) — Logic layer registration
