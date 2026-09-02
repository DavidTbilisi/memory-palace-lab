---
palace: strategic-memory
level: 6
domain: 10
para: resource
semantic_mode: 5
wiki_source: wiki/logic/transition-to-proof-curriculum.md
---

# Transition-to-Proof Curriculum (Ernst)

**Summary**: Source-summary / spine page for Dana Ernst's *An Introduction to Proof via Inquiry-Based Learning* (NAU, OER LibreTexts, CC BY-SA 4.0) — a one-semester transition-to-proof text built end-to-end around inquiry-based learning, where students discover and prove the mathematics rather than mimic worked examples. This page maps the chapter spine and links out to the concept pages that own each idea, rather than redefining them here.

**Sources**:
- dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf — Dana Ernst, *An Introduction to Proof via Inquiry-Based Learning*, Northern Arizona University, LibreTexts (compiled 2023-10-01), CC BY-SA 4.0.

**Last updated**: 2026-06-10.

---

## What the book is

The book is a one-semester (or one-quarter) **introduction-to-proof course**, also called a *transition-to-proof course*: its purpose is to teach the reader to construct and write formal, rigorous mathematical proofs (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). The intended audience is mathematics majors and minors, though it is appropriate for anyone curious about mathematics; beyond familiarity with a few standard functions in Chapter 8, no calculus content is required (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

It is not a typical textbook. Discussion of new topics is deliberately kept to a minimum and there are very few worked examples — the omission is intentional, because the design goal is to put the student in *direct contact with mathematical phenomena* so they internalize concepts by producing them (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

## The pedagogy: inquiry-based learning

The entire book "adheres to an educational philosophy called inquiry-based learning (IBL)" — a student-centered method in which students engage in sense-making and are challenged to *create or discover* mathematics rather than receive it from an authority (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). Ernst cites Laursen and Rasmussen's **Four Pillars of IBL**: students engage deeply with coherent, meaningful tasks; students collaboratively process ideas; instructors inquire into student thinking; and instructors foster equity in design and facilitation (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). See ibl-pedagogy for the full method.

Crucially, the book frames the affective side of this as expected and necessary: the author tells students to "expect a cycle of victory and defeat," that they "will experience struggle and failure before [they] experience understanding," and that "productive struggle and mistakes provide opportunities for growth" (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). This is the same engine described in productive-struggle — the desirable difficulty is the point, not a defect. The recurring "mountaineering guidebook" metaphor (a list of summits to climb under your own power, sometimes via false summits and clouded trails) is Ernst's image for the same idea (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). The author also draws the explicit analogy to learning an instrument or a sport — skill comes from dedicated, patient practice through frustration — which is the [deliberate-practice](./deliberate-practice.md) framing applied to proof-writing (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

## Chapter spine

The book carries more content than one semester can cover, so the instructor picks a path; the core sections form the spine of a one-semester course (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

| Ch | Title | What it builds |
|----|-------|----------------|
| 1 | Introduction | The IBL contract, structure of the book, minimal guidance for writing a first proof |
| 2 | Mathematics and Logic | A taste of number theory, then propositional logic, then techniques for proving conditional propositions, then [quantification](./logic-atomic-design.md) |
| 3 | Set Theory | Sets, [Russell's Paradox](./russells-paradox.md), power sets, indexing sets, Cartesian products |
| 4 | Induction | Introduction to induction, more on induction, complete (strong) induction, the [Well-Ordering Principle](./universal-mathematical-tactics.md) |
| 5 | The Real Numbers | Axioms of the real numbers; standard topology of the real line |
| 6 | Three Famous Theorems | Fundamental Theorem of Arithmetic; irrationality of √2; infinitude of primes |
| 7 | Relations and Partitions | Relations, equivalence relations, partitions, modular arithmetic |
| 8 | Functions | Functions, injective/surjective, compositions/inverses, images/preimages, continuous real functions |
| 9 | Cardinality | Cardinality, finite sets, infinite sets, countable sets, uncountable sets |

(Chapter list and section breakdown: source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf.)

The chapters are ordered so that the **proof machinery is learned before the content that needs it**: Chapter 2 introduces the [proof techniques](./methods-of-mathematical-argument.md) — direct proof, contrapositive, contradiction, and proof by cases — and Chapter 4 adds induction (standard and complete/strong) plus the Well-Ordering Principle, before Chapters 5–9 deploy them on real numbers, the three famous theorems, relations, functions, and cardinality (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

The capstone is Chapter 9's treatment of infinite cardinality, culminating in **Cantor's [Diagonalization](./godels-incompleteness.md) Argument** — the proof (by contradiction) that the interval (0,1) is uncountable, and from there the "infinitely many sizes of infinity" via repeated power sets (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

## Item taxonomy: Definition / Example / Problem / Theorem / Corollary

The book labels every item, and the labels carry an action contract. Items labeled **Definition** and **Example** are to be read and digested. Items labeled **Problem**, **Theorem**, and **Corollary** require action: Problems are a mixed bag (compute, or find a counterexample, or supply a proof), while Theorems and Corollaries are facts the student is expected to prove for themselves (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). "Every task in this book can be done by you, the student. But it may not be on your first try, or even your second" (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

## Appendix A: Elements of Style for Proofs

Appendix A is a checklist of **23 numbered style guidelines** for writing proofs that read clearly and compellingly; the list runs from #1 "The burden of communication lies on you, not on your reader" through #23 "Use scratch paper" (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). (The count of 23 is a structural feature of this source's appendix — it is *not* a Neural-OS skill ladder and should not be cross-cited as one.)

The guidelines are prose-level discipline for the written artifact — e.g. "Use English words," "Use complete sentences," "Show the logical connections among your sentences," "Know the difference between statements and objects," "The symbol '=' means equals," "Do not write the proof backwards," "Introduce every symbol you use," "Do not prove by example" (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). This is exactly the layer that [math-proof-glyph-grammar](./math-proof-glyph-grammar.md) compresses: Appendix A governs how the *prose* of a proof should read, and the glyph grammar then freezes the resulting proof shape into a single silhouette. The original content of this appendix is credited to Anders Hendrickson, modified by Ernst (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

## Appendix D: the prescriptive-vs-descriptive definition distinction

Appendix D ("Definitions in Mathematics") makes a load-bearing point about how mathematical definitions differ from everyday ones. A dictionary (OED-style) definition is **descriptive** — it describes the common usage of a word, and a reader can paraphrase it freely and still be "right." A mathematical definition is **prescriptive** — it must prescribe the exact, correct meaning, every word is chosen carefully, and the order of the words is critical; changing "there exists" to "for all," swapping the order of quantifiers, or changing ℝ to ℤ would change the meaning entirely (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). The owner page for this distinction is [informal-logic-foundations](./informal-logic-foundations.md).

Ernst's concrete advice for beginners follows directly from this: **memorize the definitions word-for-word.** "Our recommendation is that at this stage you memorize the definitions word-for-word. It is the safest way to guarantee that you have it correct" — only with confidence and familiarity should a learner begin to paraphrase (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). He adds the caveat that memorization is necessary but not sufficient: the student must also build a conceptual understanding and learn to *work with* the definition (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf). The appendix closes with the 2003 German *Who Wants to Be a Millionaire?* rectangle/trapezoid question as a real-world case where a descriptive definition was not precise enough (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

The remaining appendices are B "Fancy Mathematical Terms" (a glossary of theorem/lemma/corollary/conjecture/axiom and friends) and C "Paradoxes" (Liar's, Berry, Librarian's, Euathlus-and-Protagoras, etc.) (source: dokumen.pub_an-introduction-to-proof-via-inquiry-based-learning.pdf).

## Why this source matters here

It is a worked, freely-licensed exemplar of three things this wiki already tracks separately: the IBL/productive-struggle pedagogy as the *delivery vehicle* for proof skill; the proof-technique catalog as the *content*; and an explicit prose-style discipline (Appendix A) sitting one layer above the [glyph](./math-proof-glyph-grammar.md) compression. The prescriptive-definition rule in Appendix D is a clean, citable anchor for why early proof learners should memorize before they paraphrase.

## Related pages

- ibl-pedagogy
- [methods-of-mathematical-argument](./methods-of-mathematical-argument.md)
- productive-struggle
- [math-proof-glyph-grammar](./math-proof-glyph-grammar.md)
- [deliberate-practice](./deliberate-practice.md)
- [informal-logic-foundations](./informal-logic-foundations.md)
