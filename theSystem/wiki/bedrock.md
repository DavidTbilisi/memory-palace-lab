---
palace: meta-knowledge
level: 8
domain: 10
room: 49
semantic_mode: 5
wiki_source: wiki/learning-systems/bedrock.md
---

# Bedrock

**Summary**: **Bedrock** is the state a piece of learned material reaches when forgetting stops — the point past which decay flattens and the material persists for decades with little or no rehearsal. It is the wiki's name for the phenomenon Bahrick (1984) called *permastore* and Neisser (1984) explained as a **critical threshold**: material learned beyond a certain level of mastery becomes resistant to forgetting, while material below that level attrites away. Bedrock is domain-general — first measured in language retention, replicated in mathematics — and it is the finish line that [spaced-repetition](./spaced-repetition.md) exists to reach. This page owns the concept, the mechanism that produces it, **three routes for getting there** (collision-bridging · distributed relearning · use in the wild), a seven-condition **definition of done**, and the declaration protocol that lets a card leave the review system permanently. The dose for the default route is published: Bahrick et al. (1993) found 13 relearning sessions spaced 56 days apart matched 26 sessions spaced 14 days apart, across nine years — while Rohrer et al. (2005) found that extra drilling *within* a session is undetectable by four weeks. Gaps buy permanence; reps do not. The encode-time lever is **affordance**: an item reaches bedrock when it becomes something you *use*, not something you *keep* — so the design question is not "how do I make this memorable" but "what does this let me do today?" The complementary constraint is the **survival filter**: an item that duplicates a neighbour has no retrieval address of its own and will be pruned however much it is reviewed, which is why a cheap early map — the thing that makes neighbours visible enough to tell apart — does more for the details than more passes over them. Bedrock is the positive counterpart to [lifecycle-manager](./lifecycle-manager.md)'s four retirement triggers, all of which retire *failures*. This page is the canonical owner.

**Sources**:
- Bahrick, H. P. (1984). "Semantic memory content in permastore: Fifty years of memory for Spanish learned in school." *Journal of Experimental Psychology: General*, 113(1), 1-29.
- Bahrick, H. P. & Hall, L. K. (1991). "Lifetime maintenance of high school mathematics content." *Journal of Experimental Psychology: General*, 120(1), 20-33.
- Bahrick, H. P., Bahrick, L. E., Bahrick, A. S., & Bahrick, P. E. (1993). "Maintenance of foreign language vocabulary and the spacing effect." *Psychological Science*, 4(5), 316-321. — the nine-year, 300-word-pair, 13-vs-26-session dose study behind Route B.
- Rohrer, D., Taylor, K., Pashler, H., Wixted, J. T., & Cepeda, N. J. (2005). "The effect of overlearning on long-term retention." *Applied Cognitive Psychology*, 19(3), 361-374. — the finding that retracts the overlearning half of this page's earlier slow-route framing.
- Neisser, U. (1984). "Interpreting Harry Bahrick's discovery: What confers immunity against forgetting?" *Journal of Experimental Psychology: General*, 113(1), 32-35.
- MacKay, D. G., Shafto, M., Taylor, J. K., Marian, D. E., Abrams, L., & Dyer, J. R. (2004). "Relations between emotion, memory, and attention: Evidence from taboo Stroop, lexical decision, and immediate memory tasks." *Memory & Cognition*, 32(3), 474-488.
- McDaniel, M. A. & Einstein, G. O. (1986). "Bizarre imagery as an effective memory aid: The importance of distinctiveness." *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 12(1), 54-65.
- Luiten, J., Ames, W., & Ackerson, G. (1980). "A meta-analysis of the effects of advance organizers on learning and retention." *American Educational Research Journal*, 17(2), 211-218. — 135 studies; the *small* effect that stops §The survival filter from being grounded on advance organizers.
- Vaughn, K. E. & Rawson, K. A. (2016). "Effects of prior retrieval practice on retrieval routes and memory retention." *Acta Psychologica*, 169, 1-8. — retrieval-route count as the operative elaboration variable behind §Affordance.
- Huff, M. J. & Bodner, G. E. (2014). "All varieties of encoding variability are not created equal: Separating variable processing from variable tasks." *Journal of Memory and Language*, 73, 43-58. — the found-versus-manufactured caveat.
- Atkinson, R. C. & Raugh, M. R. (1975). "An application of the mnemonic keyword method to the acquisition of a Russian vocabulary." *Journal of Experimental Psychology: Human Learning and Memory*, 104(2), 126-133.
- Conversation, 2026-07-30 — the Russian *точка невозврата* framing, the two one-shot French items, and the anchor-permanence reframe.
- Conversation, 2026-07-31 — the usability/affordance reframe ("solved a problem, or several at once"), and the survival-filter observation: active pruning of redundant items, and the full picture as what makes the saving nuance visible.
- Internal: [spaced-repetition](./spaced-repetition.md) (Bjork's storage-vs-retrieval strength), [substitute-word-system](./substitute-word-system.md) (the keyword-method substrate), [fluency-illusion](./fluency-illusion.md) (the adversary), [lifecycle-manager](./lifecycle-manager.md) (the operational consumer).

**Last updated**: 2026-07-31 (french-1000 falsifier attempted — not runnable, both variables absent; Route B step 3 corrected: cap the max interval, uncapped expansion makes the dose unreachable); 2026-07-31 (§The survival filter added — active pruning, the ambiguous-address reframe, map-first grounded on discrimination rather than advance organizers; condition 4 generalized from unique anchor to distinct niche); 2026-07-31 (§Affordance added — usability promoted to the schedulable lever on condition 2, Route C promoted from accelerator to primary lever, time-to-first-use metric + falsifier); 2026-07-30 (§The three routes + §Definition of done added; the overlearning half of the original slow-route framing retracted per Rohrer et al. 2005)

---

## Core claim

Forgetting is not uniform over time. For material learned to a sufficient level, the retention curve **decays for a few years and then goes flat** — and stays flat for decades without rehearsal. Bahrick tested 773 people on Spanish learned in high school and college, at intervals from immediately after the course to fifty years later. Retention dropped over roughly the first three to six years, then held essentially stable out to the end of the measured range (source: Bahrick 1984). He named the stable residue **permastore**, by analogy with permafrost.

The wiki's name for that stable state is **bedrock**. The name carries the operational picture: decay digs downward until it strikes a layer it cannot cut, and stops there. What matters is not how much you learned but **how far down the bedrock line sits** — everything above it erodes, everything below it stays.

Neisser's reading of Bahrick's data supplies the threshold: material learned *beyond a critical level of mastery* enters the immune state, and material short of that level does not (source: Neisser 1984). This is the mechanism behind the Russian *точка невозврата* and the English "it's like riding a bike" — a real, measured discontinuity, not a figure of speech.

## Why it is not a language phenomenon

Languages are where the effect was first measured carefully, not where it lives. Bahrick and Hall ran the same design on high-school **algebra and geometry** and found the same shape across fifty years (source: Bahrick & Hall 1991). The strongest predictor in both studies was the same: **level of original learning**, not elapsed time, not rehearsal in the interval, not grades.

That makes bedrock a property of *learning*, so it applies across the wiki's encoder spine rather than to vocabulary decks alone — a [CAST](./cast-overview.md) graph, a [SPEAR](./spear-overview.md) procedure, and a [NEDF](./nedf-overview.md) concept card can each be above or below the line.

## The mechanism: four conditions

Bedrock is not produced by encoding strength alone. Four conditions have to hold together, and the fourth is the one that separates permanent items from merely well-encoded ones.

### 1. The anchor is already at bedrock

You do not push a new item to bedrock. You **weld it to something already there**, and it inherits the stability. This is the single most useful design consequence on this page:

> The quality of a mnemonic is the permanence of its **anchor**, not the vividness of its **image**.

An invented peg image is itself a new and fragile memory, so it cannot confer permanence on anything — you now have two things to keep alive instead of one. A childhood word, a family name, a body or taboo term, your own street, a song you cannot stop hearing: these have had decades of zero decay and are already below the line. This reframes [substitute-word-system](./substitute-word-system.md)'s substitution move — the standard keyword method (source: Atkinson & Raugh 1975) specifies *how* to build a sound bridge but says nothing about *which anchors are worth building onto*.

### 2. Retrieval is involuntary

The load-bearing condition. An ordinary mnemonic must be *invoked* — you choose to run it, which means it is rehearsed only when the scheduler says so, and it decays when the schedule stops. An involuntary bridge fires whether you want it to or not, so **every encounter with the item anywhere becomes a free rehearsal, forever, at zero scheduling cost.**

The engine of permanence is therefore not encoding strength but **unstoppable retrieval frequency**. Involuntary items self-rehearse; voluntary ones do not.

Worked instance (source: conversation 2026-07-30): French *clé* (key) collides with a Georgian obscenity, and French *con* collides with an anatomical term. Both were acquired in a single exposure and have not been reviewed since. The operative property is not that the collisions are vivid — it is that the learner **cannot hear the French word without the native word firing.** Compare a deliberately constructed image for a neutral word, which must be searched for on every retrieval.

### 3. Arousal tags the trace for consolidation

Taboo and emotionally arousing material is prioritized for consolidation through arousal rather than through effort. MacKay et al. found taboo words recalled better than neutral words matched for familiarity, length, and category, and — the counter-intuitive part — that **taboo and emotional words benefit *less* from deep processing than neutral words do**, their advantage arriving even under shallow encoding (source: MacKay et al. 2004).

So the taboo route is not "elaborative encoding, but stronger." It is a **separate path that bypasses the effort requirement**, which is exactly why a single exposure can suffice. Under MacKay's binding-theory account, taboo items capture the context-binding machinery — with a cost noted in §Failure modes below.

The consolidation itself still has to happen, which is why the earliest honest declaration is the next day: see [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md).

### 4. The item occupies a distinct niche

If two targets map to the same anchor you get retrieval competition and **both** break. This is [CAST](./cast-overview.md)'s existing "assign once, never reassign" rule, applied to bridges rather than to loci.

The anchor case is the narrow one. The general condition is that **the item needs a retrieval address nothing else already occupies** — distinct cue, distinct meaning, distinct use context. An item that duplicates a neighbour on all three has no address of its own, and no amount of review will save it. See §The survival filter below, which is where this condition does most of its work.

## The rationing constraint

Bedrock-by-collision **cannot be applied to a whole deck**, and this is an empirical limit rather than a matter of taste.

The bizarreness advantage appears in **mixed lists** — bizarre and ordinary material studied together — and **disappears in pure lists**, whether all-bizarre or all-ordinary (source: McDaniel & Einstein 1986). Distinctiveness is *relative* to its background. A deck in which every card is a shocking pun has no background left to stand out against, and the effect falls to baseline.

Distinctiveness is therefore a **budget, not a technique**. The operational rule that follows: spend it on items that have already failed normal review, never on items that are working. Rare shocking cards stay shocking precisely because they are rare.

## Affordance — the lever you can pull on every item

The rationing constraint above is a real limit on arousal, and it invites a wrong conclusion: that the fast route is simply unavailable most of the time. It is not. **Arousal is one way to buy condition 2 (involuntary retrieval); it is not the only way, and it is the one you cannot schedule.**

### The reframe

Reconsider what actually happened with *clé*. The account in §2 above emphasised the taboo collision — but taboo is not what made it usable. What the collision handed over was **an artifact you could deploy**: a bilingual joke, a social move ("I meant the key, not the thing you thought"), a thing that is *fun to own*. The word did not arrive as one more item of vocabulary debt. It arrived having already paid for itself.

This suggests the sharper statement of the mechanism:

> **An item reaches bedrock when it becomes something you use, not something you keep.** Taboo collisions are a frequent *special case* of immediately-usable — not the mechanism itself.

The reframe explains cases the arousal account struggles with. Plenty of shocking collisions are never retained, and the ones that fail are reliably the ones there was never an occasion to deploy. Conversely, entirely unarousing items become permanent quickly when they are load-bearing in something you do daily — no taboo required.

### Where this does *not* replace the arousal account

Honesty about the boundary: MacKay et al.'s subjects never *used* the taboo words at all — the recall advantage appeared in a lab task with no deployment whatsoever (source: MacKay et al. 2004). So arousal does independent work and §3 stands as written. The difference between the two is **schedulability**, and that is what makes affordance the more valuable of the pair operationally:

| | Arousal (§3) | Affordance (this section) |
|---|---|---|
| Available for | A small minority of items | **Every item, in principle** |
| Can you plan it? | No — collisions are found, not made | **Yes — it is a design decision at encode time** |
| Constrained by | The rationing constraint (pure lists kill it) | Nothing structural; more usable is monotonically better |
| Buys condition 2 by | Making retrieval intrusive | Making retrieval *useful*, so it happens on purpose |

### Why multiple domains, mechanically

Binding an item into several domains is not decoration — each connection is an additional **retrieval route**. The encoding-variability literature is direct on this: the more cues encoded and the broader their range, the more likely some cue matches the unknown circumstances of a future retrieval, and [elaboration](./elaboration.md) is characterised precisely by the *number of retrieval routes* the mediators provide ([Vaughn & Rawson](https://www.sciencedirect.com/science/article/abs/pii/S0001691816301093); [Nairne et al.](https://link.springer.com/article/10.3758/s13421-024-01603-x)).

Two consequences follow, and they are what make the "several domains" instinct correct rather than merely appealing:

- **More routes raise the daily probability of retrieval.** An item bound only to a flashcard is reachable from one cue that appears when the scheduler says so. An item bound to a sound, a joke, a person, and a task is reachable from four cues that appear unbidden. That is condition 2 again, arrived at by design rather than by luck.
- **Routes degrade independently.** Losing one binding does not lose the item. A single-route item has a single point of failure.

### The trap: found routes versus manufactured ones

This is where the instinct can go wrong, and the caveat is load-bearing. Not all encoding variability is equal — the literature separates genuinely variable *processing* from merely variable *tasks* ([Huff & Bodner](https://www.sciencedirect.com/science/article/abs/pii/S0749596X14000151)), and only the former reliably pays.

**Manufacturing four connections per item is a cost, not a strategy.** An invented link is itself a fragile new memory (the same objection as §1's young-anchor rule), it consumes encode time that Route B says is better spent on gaps, and an arbitrary route is one you will never actually traverse. The rule:

> **Record the routes that are already there. Do not invent routes to hit a number.** Two found connections beat six manufactured ones.

"Already there" includes: a sound collision in any language you speak, a person it reminds you of, a place, a task you were doing when you met it, a joke it makes possible, a problem it solves. Ten seconds of noticing, not a worksheet.

### The steps

1. **Acquire inside a use-context, not a list.** Take the item from something you were already doing — a text you wanted to read, a conversation you were in, a problem you were stuck on. Items acquired this way arrive with an affordance already attached and need no retrofit. This single change does more than any downstream technique.
2. **Run the unlock test.** Finish the sentence out loud: *"Now I can ___."* If you cannot finish it, you have acquired a fact rather than a tool, and you should expect to pay full review price for it. This is the encode-time counterpart of the involuntary-fire test below.
3. **Deploy within 24 hours.** Say it, write it, make the joke, use the procedure on something real. One real use is worth several scheduled reviews because the retrieval cue is unrehearsed and the context is not the deck's.
4. **Note the routes that already exist** — sound, person, place, task, joke, problem solved. Ten seconds. Do not manufacture.
5. **Prefer items that close a live gap.** Something you *needed yesterday and did not have* is worth several items chosen because they appeared on a frequency list. Acquisition triggered by a real deficit arrives pre-loaded with both a use-context and the generation effect (see [generation-effect](./generation-effect.md)).

### Measurement, and a falsifiable prediction

Track **time-to-first-use**: days between first encounter and first unprompted deployment outside the review context. The naming follows the wiki's existing `time-to-first-correct` / `time-to-first-merged-pr` family; no acronym is minted.

This yields a prediction the wiki can test against data it already has:

> **Items with a short time-to-first-use should require fewer deep passes to clear §Definition of done than items matched for difficulty with a long one.**

**This test was attempted on 2026-07-31 and could not be run.** Recording that here rather than leaving the claim looking checkable:

- **The independent variable was never instrumented.** Nothing in `tools/french-1000/` records real-world deployment of a word — `status.json` carries `interval_days` and `lapses` only. Time-to-first-use cannot be recovered retrospectively; it has to be collected prospectively, starting whenever collection starts.
- **The dependent variable does not exist yet either.** Across 688 words the deck's **longest interval is 37 days**, only 6 cards (0.9%) have crossed even one deep pass, and **zero** are within reach of the ≥180-day terminal gap. 90% of the deck is still new or locked. There is no retention outcome to correlate anything against.
- **Earliest possible test: roughly 12 months out** for a first provisional declaration (a card must reach a ≥180-day interval *and then* survive that gap in silence), and about 24 months for the confirmed tier.

**Instrumentation shipped the same day** (`tools/french-1000/usage.py`). One note-level Anki tag, `used::YYYY-MM-DD`, applied on the day of first real deployment; the earliest such tag wins, so extra tags are harmless. First-encounter is anchored to the **first review-log entry** rather than card creation, because cards here are built in bulk and unlocked in stages — a card can exist for months before it is first seen. The report refuses to compute a correlation below 30 usable pairs instead of printing small-n noise.

So the falsifier stands, unchanged and still able to kill this section — but it is **pending instrumentation**, not pending analysis. If time-to-first-use shows no relationship to eventual retention once both variables exist, this section is wrong and should be cut, and §3's arousal account would stand alone.

## The survival filter — why the map is what saves the details

### The observation

Learners report that the mind runs an **active deletion process**, not merely passive decay: given two words with the same meaning, one is kept and the other quietly disposed of. An item survives if there is a nuance that makes it *worth* knowing and a place where it is the best available choice; otherwise it is dropped as redundant, however much it was reviewed (source: conversation 2026-07-31).

This is condition 4 above, doing its real work. The mechanism is **retrieval competition**: items sharing a cue compete for it, and an item with no distinguishing feature has no address of its own. The failure looks like weak memory and is not — it is an **ambiguous address**. That distinction inverts the obvious remedy:

> **You do not save an item by studying it more. You save it by giving it a distinction.**

For a synonym pair, drilling both harder makes the competition worse, because you are strengthening two claimants to one address. The move that works is learning the *difference* — register, collocation, connotation, the context where this one and not the other is correct.

### This is the NEDF Distinguisher slot

The wiki already owns this. [NEDF](./nedf-overview.md)'s **D** slot is separation from the nearest confusing neighbour, and its documented failure mode is the **distant distinguisher** — distinguishing an item against something unrelated, which feels like work and blocks no real collision. Bedrock adds only the survival claim: an item whose Distinguisher slot is empty or distant will not reach bedrock no matter how many deep passes it accumulates, because the passes are not the binding constraint.

### Why the full picture is load-bearing

The connection between the two halves is the point. **You cannot see the nuance that saves a word unless you can see what it is competing with** — and that requires the neighbours to be in the same frame. A detail met in isolation has no visible contrast set, so no distinction can be drawn, so it stays redundant and gets pruned. A detail met inside a map arrives with its neighbours already visible, and the distinction comes almost free.

That is why the map-first instinct is correct, and it is the same argument [CAST](./cast-overview.md) makes structurally: encode the graph, and the nodes acquire meaning from their edges rather than needing to carry it alone.

### The correction: it is the contrast, not the overview

Grounding this on **advance organizers would oversell it**, and the page will not do that. Luiten, Ames & Ackerson's meta-analysis of 135 studies found advance organizers produce only a **small** facilitative effect, and for retention specifically the results are mixed — initial learning rose, but intermediate and long-term retention were not significantly higher ([Luiten et al. 1980](https://eric.ed.gov/?id=EJ233231)).

The resolution is that *being handed* a picture and *building and using* one are different operations:

| | Weak version | Strong version |
|---|---|---|
| Where the map comes from | Handed to you as text, read passively | **Built by you** — [generation-effect](./generation-effect.md) |
| What you do with it | Comprehend it | **Contrast neighbours inside it** — [interleaving](./interleaving.md) |
| Evidence | Small, retention mixed (Luiten et al. 1980) | Strong and replicated |
| Risk | Feels comprehensible → [fluency-illusion](./fluency-illusion.md) | Feels harder; that is the [desirable difficulty](./desirable-difficulties.md) |

So the operative ingredient is **the discrimination the map enables**, not the overview itself. A map you read is nearly free of retention value; a map you draw and then use to separate confusables is doing two well-evidenced things at once.

This also resolves the apparent tension with §Affordance's "use it within 24 hours." The map is meant to be **cheap and early, not complete** — ten minutes of rough structure, not a week of scholarship. Its job is to make neighbours visible, and it does that long before it is finished. A map pursued to completeness before any use is the [fluency-illusion](./fluency-illusion.md) with extra steps.

### The steps

1. **Sketch the territory before the details, and time-box it.** Ten minutes. The deliverable is a frame with neighbours in it, not a complete or correct picture — it will be revised, and being wrong early costs nothing.
2. **On meeting an item, name its nearest neighbour and the difference.** One line. This is the NEDF **D** slot, and per that page's failure mode it must be the *nearest* confusable, not a convenient distant one.
3. **On a synonym collision, do not drill both.** Pick the one you will actually deploy and demote the other to recognition-only. This is the pruning instinct, made deliberate instead of leaving it to run unsupervised — and it is a legitimate coverage decision, not a gap (see [word-knowledge-links](./word-knowledge-links.md)).
4. **Record the distinction as a use-rule**, not as a definition: *this one in writing · this one with that collocation · this one only to people who will catch it.* A use-rule is an affordance (§Affordance), so this step pays twice.
5. **Study confusables together, deliberately.** Separating them is the entire job, and they can only be separated in contact — see [interleaving](./interleaving.md).

### Register and identity as a legitimate affordance

Wanting a precise word in order to express something exactly — and to mark oneself as educated — is a real **affordance** in §Affordance's sense, and one of the more durable ones: it supplies a standing motive to deploy, which is the free-rehearsal engine of condition 2. It belongs on the route census as a *register/identity* route, alongside sound, person, place, task, joke, and problem-solved.

One honest caveat, and it is communicative rather than mnemonic. The wiki already models the risk: under CAT, vocabulary chosen for display can read as **divergence** — marking distance rather than precision — depending on the interlocutor, and over-adjustment in either direction is the theory's central failure. For retention the display motive is straightforwardly good, because it gets the word used. For communication, the use-rule from step 4 should include *who will catch it*.

## The involuntary-fire test

The declaration criterion. It replaces "does this feel unforgettable?" — which is the [fluency-illusion](./fluency-illusion.md) wearing a different hat and must never be trusted — with something falsifiable:

> Meet the item cold, with no warning and no attempt to recall the bridge. **Did the anchor fire on its own, or did you have to go looking for it?**

If you had to search, it is an ordinary mnemonic: route it to normal [spaced-repetition](./spaced-repetition.md). If it fired unbidden, it is a bedrock *candidate* — still a candidate, because the test is necessary but not sufficient until the cold probe in step 7 below confirms it.

## The declaration protocol

A procedure, **not a stage ladder** — no rung numbers are minted here and none are implied; ordered stage numbering stays owned by [skill-progression-stages](./skill-progression-stages.md).

1. **Search for a collision before inventing one.** Say the target aloud and listen for what it hits in your native languages — taboo, a person's name, something personally loaded. Time-box it to about ten seconds. You are *finding*, not *building*: a found collision already exists and is free, an invented image is a second memory you now have to maintain.
2. **Reject young anchors.** Prefer anchors you have held for more than ten years. If the anchor itself is not obviously below the bedrock line, the bridge cannot inherit permanence from it.
3. **Check the anchor is unopened** — not already bound to another target (condition 4).
4. **Apply the involuntary-fire test** at a ten-minute delay. Search → ordinary card. Unbidden → candidate.
5. **Spend the budget on leeches only.** Reserve collision-bridging for items that have already failed review at least twice. The payoff is highest there, and the scarcity that makes the effect work is preserved.
6. **Sleep once before declaring anything.** Arousal biases *what* gets consolidated overnight, but consolidation still takes a night. Never declare on the same day.
7. **Probe cold, then hold it to the same gate as everything else.** A collision bridge is *evidence for a candidate*, not a declaration. Route A shortens the road; it does not skip the gate. The item still has to clear §Definition of done below — including the ≥6-month terminal gap — before it graduates via [lifecycle-manager](./lifecycle-manager.md). What Route A buys is a much higher pass rate at that gate, not exemption from it.

Most items will never qualify for Route A at all, and that is the expected outcome rather than a failure of the protocol — see §The three routes below.

## The three routes

Collision-bridging (§The declaration protocol above) is **Route A**, and it is the *minority* path — it is available only where a native collision happens to exist, and most targets collide with nothing. It is also the only one of the three that is fast. The other two carry almost all the volume.

### The overlearning correction

An earlier draft of this page named the slow route "overlearning plus spaced retrieval." **The overlearning half is wrong and is retracted here.** Rohrer, Taylor, Pashler & Wixted (2005) manipulated degree of learning through repeated test-with-feedback trials in 218 subjects and tested at 1 to 9 weeks: overlearners recalled far more at one week, but the advantage of the 10-trial condition was **undetectable by four weeks** (source: Rohrer et al. 2005). Their own conclusion is that overlearning is an inefficient strategy for retention over meaningful periods.

The correction matters because it inverts the intuitive effort allocation:

> **Drilling an item harder *within* a session does almost nothing for bedrock. Meeting it again *across* long gaps is nearly the whole mechanism.**

Extra repetitions inside one sitting buy retrieval strength, which decays. Gaps buy storage strength, which does not — see [spaced-repetition](./spaced-repetition.md) §Core claim for the Bjork distinction this rests on.

### Route B — distributed relearning (the default; covers everything)

This is the route with the best evidence and the only one with a published dose. Bahrick, Bahrick, Bahrick & Bahrick (1993) ran a **nine-year** study: four subjects learned and relearned 300 English–foreign word pairs across either 13 or 26 relearning sessions, spaced 14, 28, or 56 days apart, with retention tested 1, 2, 3 and 5 years *after training stopped* (source: Bahrick et al. 1993).

Two findings drive the protocol:

- **13 sessions spaced 56 days apart produced retention comparable to 26 sessions spaced 14 days apart.** Half the total work, same result. Wider gaps slowed acquisition slightly, and that cost was more than repaid in retention.
- **Session count and spacing help independently.** More sessions helps; wider spacing helps; they do not substitute for each other, so you want both rather than trading one off.

The steps:

1. **Count spaced passes, not hours.** The dose variable is *successful retrievals separated by long gaps*. Define one **deep pass** as a correct unaided retrieval at an interval of **≥1 month**. Hours studied, cards reviewed, and reps within a session are all the wrong unit and should not be tracked as progress toward bedrock.
2. **Stop drilling within the session once you get it right.** After the first clean retrieval, additional immediate reps are near-worthless for this purpose (Rohrer et al. 2005). Move on; the next gap is where the value is.
3. **Widen the intervals to about two months — then cap them.** This step was wrong in an earlier draft, which said only "push wider than feels comfortable." Wider beats narrow (Bahrick's 56-day condition beat the 14-day one per unit of work), but **unbounded** widening silently makes the dose unreachable, which is the constraint the next step exists for. Feeling like you have half-forgotten it at review time is still the mechanism working, not a scheduling error (see [desirable-difficulties](./desirable-difficulties.md)).

   **Set a maximum interval.** Bahrick's design was *fixed* 56-day spacing, not expanding spacing — 13 sessions × 56 days is a **2.0-year** program. Anki's default expanding schedule (ease 2.5) does not behave that way at all:

   | Schedule | Time to accumulate 8 deep passes |
   |---|---|
   | Anki default, uncapped expanding from 30 d | **83.6 years** |
   | Capped at 90 days | 1.8 years |
   | Capped at 60 days | 1.2 years |
   | Bahrick's fixed 56 days (13 passes) | 2.0 years |

   Under uncapped expansion the fourth pass alone lands at a 469-day interval and the eighth at 18,311 days, so the dose is not merely slow to reach — it is unreachable in a human lifetime. **For material you have decided is bedrock-bound, set Anki's maximum interval to roughly 60–90 days** (deck options → maximum interval) rather than raising the interval modifier. That reproduces Bahrick's actual design instead of an extrapolation from it, and nothing in his data suggests a 469-day gap would beat a 56-day one — 56 days is simply the widest spacing that was tested and won.
4. **Target roughly 8–13 deep passes**, with Bahrick's 13-at-56-days as the gold reference and 8 as the pragmatic floor. At ~2-month spacing this is a **1.5–2 year** program per item, running in the background at near-zero daily cost — not a sprint.
5. **Drive the terminal interval past 6 months.** The last passes are the ones that carry the evidence. An item whose longest successful gap is 3 weeks has not been tested at the timescale the claim is about.
6. **Never reset the ladder for convenience.** Rebuilding a deck, re-importing cards, or "starting fresh" destroys the accumulated interval history, which *is* the dose. This is the most common way people quietly restart a two-year program at zero.

### Route C — use in the wild

**Read §Affordance first; that section is the design half of this route.** Route C is not a bonus lane for items that happen to come up in conversation — it is where the affordance designed at encode time gets spent, and it is the route that most directly buys condition 2.

Bahrick's highest retainers were not people who studied harder; they were people who had **taken more courses** and used the language across more varied contexts (source: Bahrick 1984). Real use supplies what a deck structurally cannot: varied contexts, unpredictable cues, and retrieval under load.

1. **Get the item into a real context within its first month** — a conversation, a text you actually wanted to read, something you write. One real use is worth several reviews because the retrieval cue is unrehearsed.
2. **Vary the context deliberately** rather than repeating the same sentence frame. Same item, different surroundings, is what produces cue-independent retrieval.
3. **Log unprompted production.** When an item comes out in real use *without* you reaching for it, that is a free, high-quality deep pass — record it as one. It is also the strongest leading indicator in §Definition of done below.
4. **You cannot schedule the *encounters*, but you can engineer the *affordance*.** This is the correction §Affordance makes to an earlier draft of this page, which wrote Route C off as unschedulable. Wild encounters are indeed unplannable — but whether an item is *deployable when one arrives* is decided at encode time, and that is fully under your control. Increase exposure surface, and make sure each item arrives with something it lets you do.

The three routes are complements, not rivals:

- **Route B is the floor** — the only route that works for every item and the only one with a published dose. Nothing replaces it.
- **Route C is the lever** — where affordance converts into unscheduled retrievals. It does the most per unit of effort, and unlike Route A it is available for every item.
- **Route A is opportunistic** — a shortcut that must stay rare to keep working, and a special case of Route C rather than a separate thing.

## Definition of done

Bedrock is claimed **per item and per direction**, never per deck and never per word. A French word can be bedrock for recognition while being entirely absent for production — those are different trained links, and [word-knowledge-links](./word-knowledge-links.md) owns the six-way decomposition. "I know *clé*" is not a well-formed claim; "*clé* → key is bedrock, key → *clé* is not" is.

### Provisional bedrock — all five must hold

| # | Condition | Why it is on the list |
|---|---|---|
| 1 | **Dose**: ≥8 deep passes (correct unaided retrievals at ≥1-month intervals) | The Bahrick 1993 dose variable; below this there is no evidential basis for the claim |
| 2 | **Terminal gap**: the most recent success came after **≥6 months** with no review | The claim is about long delays, so it must be tested at one |
| 3 | **Cold**: no same-domain exposure in the preceding 24 hours — no deck reviewed, no content consumed in that language or subject | Warm-up primes retrieval and invalidates the probe; this is the condition most often violated |
| 4 | **Unaided and fast**: correct *production* (no multiple choice, no first letter, no cue beyond the prompt), within the deck's automaticity floor — around 2 s for a vocabulary item | Slow-but-correct means reconstructed, not stored; reconstruction is what decays |
| 5 | **Clean**: zero lapses across the whole dose window | A lapsed item is one whose ladder restarted; the dose count restarts with it |

### Confirmed bedrock — provisional, plus both

| # | Condition | Why |
|---|---|---|
| 6 | **Repeat probe at ≥12 months** after the provisional one, still passing | One probe can be luck; two, a year apart, cannot |
| 7 | **Interference-resistant**: passes immediately after a confusable neighbour was reviewed | Bedrock items are retrieved, not disambiguated; a near-neighbour should not be able to knock it over |

Bahrick's own marker — the curve going flat between three and six *years* — remains the gold standard, and the twelve-month tier is still a proxy for it. That gap is the reason confirmed bedrock is revocable rather than final, and why the graduated pool stays under spot-check in [lifecycle-manager](./lifecycle-manager.md).

### Leading indicators — how you know you are on track before the gate

None of these declare bedrock. They tell you the item is heading there, which is what you actually need month to month:

- **Short time-to-first-use.** Days from first encounter to first unprompted deployment outside review. The earliest signal available — it arrives within a week, long before any interval evidence exists (§Affordance).
- The interval ladder clears **1 month → 3 months → 6 months** with no lapse.
- **Latency falls across successive reviews**, not merely accuracy holding. Flat accuracy with flat latency means you are maintaining, not consolidating.
- The item is retrieved correctly when it appears **out of context** — in reading, in speech, somewhere the deck did not put it.
- **Unprompted production in real use** (Route C, step 3). The single best free signal available.
- It survives a **confusable-neighbour check** informally.

### Anti-signals — what feels like done and is not

- **A high ease factor.** That records an absence of lapses, not a tested delay. Ease is a scheduling parameter, not evidence.
- **Recognising it while reading.** Recognition is a different link from production and clears at a much lower bar; treating it as evidence for production is the most common overclaim.
- **Fast recall shortly after a review.** That is retrieval strength, which is exactly the parameter that decays. The probe must be cold for this reason.
- **"I could never forget this."** [fluency-illusion](./fluency-illusion.md), in its permanence form.
- **The deck being "finished."** Decks do not reach bedrock; individual directed links do.

### The one-line version

> An item is done when it has survived **eight or more widely-spaced correct retrievals**, the **last of them after half a year of silence**, produced **cold, unaided, and fast, in the direction you are claiming** — and confirmed when it does it again a **year later**.

## Failure modes

| Failure | What it looks like | Mitigation |
|---|---|---|
| **Vibes declaration** | "I'll never forget this one" — declared on felt confidence | The [fluency-illusion](./fluency-illusion.md) exactly; only the involuntary-fire test plus the ≥3-month cold probe may declare |
| **Budget blowout** | Collision-bridging applied deck-wide; distinctiveness collapses to baseline | Pure-list finding (McDaniel & Einstein 1986); step 5 restricts spending to twice-failed leeches |
| **Neighbour damage** | A taboo item impairs encoding of the cards studied next to it — the documented cost of binding capture (source: MacKay et al. 2004) | Do not cluster arousing items within a session; interleave with neutral material |
| **Redundant item** | A near-synonym drilled alongside its twin; both weaken because two claimants share one retrieval address | §The survival filter — learn the *difference*, or demote one to recognition-only. More review makes this worse, not better |
| **Distant distinguisher** | The item is separated from something unrelated rather than from its nearest confusable; feels like work, blocks no real collision | [NEDF](./nedf-overview.md)'s documented **D**-slot failure; the neighbour must be the nearest one |
| **Map pursued to completeness** | The "full picture" becomes a research project that delays all use | §The survival filter — the map is cheap and early (ten minutes), and a complete map read passively is [fluency-illusion](./fluency-illusion.md) with extra steps |
| **Manufactured routes** | Inventing connections to several domains per item to hit a number; each invented link is itself fragile and will never be traversed | §Affordance — record found routes only; two real beat six invented (source: Huff & Bodner 2014) |
| **Learning facts instead of tools** | Item acquired with no answer to *"now I can ___"*; pays full review price forever | §Affordance step 2 — either acquire it inside a use-context or accept it is a Route B-only item |
| **Drilling instead of spacing** | Hammering an item repeatedly within a session and counting it as progress | The benefit is undetectable by four weeks (source: Rohrer et al. 2005); Route B step 2 — stop at the first clean retrieval and bank the gap instead |
| **Uncapped expanding intervals** | Letting Anki's default schedule run unbounded on bedrock-bound material; the dose becomes unreachable (8 deep passes = **83.6 years**) while every card still looks healthy | Route B step 3 — set maximum interval to ~60–90 days, reproducing Bahrick's *fixed* spacing rather than extrapolating past it |
| **Ladder reset** | A deck rebuild, re-import, or "fresh start" wipes interval history — silently restarting a two-year program at zero | Route B step 6; `bedrock.ladder_reset` exists to make this loud rather than invisible |
| **Warm probe** | Testing right after reviewing the same deck or consuming that language | Condition 3 — 24 hours of no same-domain exposure, the most frequently violated condition on the list |
| **Deck-level claims** | "My French deck is at bedrock" | Bedrock is per item **per direction** ([word-knowledge-links](./word-knowledge-links.md)); decks do not have the property |
| **Young anchor** | Bridge built onto an image invented last week; both decay together | Step 2 — anchors older than ten years only |
| **Anchor collision** | Two targets share one anchor; both break through retrieval competition | Step 3; "assign once, never reassign" |
| **Same-day declaration** | Declared before a consolidation window has passed | Step 6 — sleep at least once |
| **Premature graduation** | Card leaves the deck and is silently lost | The probe is a *gate*, not a formality; revocation returns the card to Active |
| **Treating bedrock as a goal for everything** | Every card chased to permanence; review burden explodes | Bedrock is worth buying for load-bearing material; peripheral facts should retire through [lifecycle-manager](./lifecycle-manager.md)'s existing triggers instead |

## Measurement ([METER](./meter-overview.md))

| Event | Fires when | Carries |
|---|---|---|
| `bedrock.deep_pass` | A correct unaided retrieval at an interval ≥1 month | item id · direction · interval days · latency · running dose count |
| `bedrock.wild_pass` | Unprompted production in real use (Route C) | item id · direction · context |
| `bedrock.time_to_first_use` | First unprompted deployment outside review | item id · days since first encounter · context type |
| `bedrock.routes_noted` | Encode-time route census (§Affordance step 4) | item id · count · kinds (sound/person/place/task/joke/problem/**register-identity**) · **found vs manufactured** |
| `bedrock.distinguisher_set` | Nearest confusable named and the difference recorded | item id · neighbour id · distance (**nearest vs distant** — distant is the failure) |
| `bedrock.synonym_demoted` | One of a redundant pair sent to recognition-only | kept id · demoted id — the pruning decision, made deliberate |
| `bedrock.candidate_flagged` | Involuntary-fire test passes (Route A) | item id · anchor language · anchor age band |
| `bedrock.declared_provisional` | All five provisional conditions met | item id · direction · dose count · terminal gap days · latency |
| `bedrock.declared_confirmed` | Repeat probe at ≥12 months plus interference check | item id · direction |
| `bedrock.probe_failed` | Cold probe slow or wrong | item id · direction · dose count reset |
| `bedrock.ladder_reset` | Interval history destroyed by a rebuild/re-import | deck · items affected — the silent-restart alarm |
| `bedrock.revoked` | A previously declared item later fails a spot-check | item id · days held |
| `bedrock.budget_share` | Weekly | share of the deck carrying collision bridges (watch for drift upward) |

**Falsifier.** The declaration criterion is a claim about the world and can be wrong. If **more than 1 in 10** bedrock-declared items fails a later spot-check, the criterion is too loose: raise the involuntariness bar or extend the probe horizon beyond three months. If the failure rate stays at zero across ≥50 declarations, the horizon may be shortened. Bahrick's own marker — the curve going flat at three to six years — is the gold standard, but it is too slow to operate on, so the cold probe stands in as its proxy and is answerable to this gate.

## Relation to the rest of the system

- **[spaced-repetition](./spaced-repetition.md)** — bedrock is the *finish line* of the SR schedule. Bjork's storage-strength parameter is what spacing raises; bedrock is the asymptote where storage strength stops needing maintenance. This is the argument that SRS is not a life sentence.
- **[lifecycle-manager](./lifecycle-manager.md)** — supplies the missing **positive** retirement trigger. All four existing triggers retire failures (leeches, disposables, superseded cards, dead contexts); bedrock retires successes.
- **[fluency-illusion](./fluency-illusion.md)** — the direct adversary. "Feels like bedrock" is precisely the illusion of knowing, which is why declaration is gated on behaviour at a long delay rather than on confidence.
- **[substitute-word-system](./substitute-word-system.md)** — supplies the bridge-building move; this page supplies the **selection criteria** (anchor permanence, involuntariness) that the standard keyword method leaves unspecified.
- **[desirable-difficulties](./desirable-difficulties.md)** — the slow route to bedrock runs entirely through these; the collision route is the rare case where a difficulty is *not* required.

## Mnemonic

A drill bites downward through soft soil, throwing up dust, and then **rings** — it has struck grey stone and stops dead, bit spinning uselessly. Everything above the stone has already washed away; everything at the stone is still there fifty years on. The drill is forgetting. It cannot cut the layer.

## Checksum

- Bedrock = the state where **decay flattens**, not where mastery feels complete
- Threshold is about **level of original learning**, not elapsed time
- Domain-general: measured in Spanish **and** algebra, fifty years each
- Dose is **spaced passes, not hours**: 13 sessions @ 56 days ≈ 26 @ 14 days (Bahrick 1993)
- Bahrick's spacing was **fixed, not expanding** — **cap the max interval at ~60–90 d** or the dose takes 83.6 years
- Overlearning within a session is **gone by four weeks** (Rohrer 2005) — gaps, not reps
- Anchor permanence beats image vividness
- **Involuntary** retrieval is the engine — free rehearsal forever
- **Usable, not memorable**: an item sticks when you *use* it, not when you *keep* it
- Arousal is rationed and unschedulable; **affordance is available for every item**
- Each domain an item touches is one more **retrieval route** — but **find them, don't manufacture them**
- Failure to stick is usually an **ambiguous address**, not weak memory — save an item by giving it a *distinction*, not more reps
- The map earns its keep by making **neighbours visible** so they can be told apart — not by being an overview
- Distinctiveness is **rationed**; pure lists kill the effect
- Done = **8+ deep passes · ≥6-month terminal gap · cold · unaided · fast · per direction**
- Declared by delayed cold probe, never by feel

## Visual

A geological cross-section. Loose topsoil at the surface labelled *last week*, thinning bands below it labelled *year 1 · year 3 · year 6*, and beneath them one unbroken grey stratum running off both edges of the frame, labelled *fifty years*. Two anchors are drawn as iron pitons: one hammered into the topsoil, tilting; one driven into the grey stratum, holding a rope taut.

## Related pages

- [spaced-repetition](./spaced-repetition.md) — the schedule bedrock is the finish line of
- [lifecycle-manager](./lifecycle-manager.md) — the graduation trigger this page supplies
- [fluency-illusion](./fluency-illusion.md) — why declaration cannot be made on confidence
- [substitute-word-system](./substitute-word-system.md) — the bridge-building substrate; this page adds the selection criteria
- [sleep-dependent-memory-consolidation](./sleep-dependent-memory-consolidation.md) — why the earliest declaration is the next day
- [desirable-difficulties](./desirable-difficulties.md) — the slow route to bedrock
- [active-recall](./active-recall.md) — the retrieval that raises storage strength toward the line
- [NEDF](./nedf-overview.md) — owner of the **Distinguisher** slot that §The survival filter runs on, and of the distant-distinguisher failure mode
- [interleaving](./interleaving.md) — the operative half of map-first: confusables can only be separated in contact
- [generation-effect](./generation-effect.md) — why a map you *build* beats a map you are handed
- [structure-first](./structure-first.md) — the principle map-first is one case of; supplies the four input-mode methods
- [zoom-in-zoom-out](./zoom-in-zoom-out.md) — the text/course method that operationalizes map-first
- CAT — the register risk attached to identity-motivated vocabulary
- [skill-progression-stages](./skill-progression-stages.md) — owner of stage numbering; the protocol above is a procedure, not a ladder
- [phrase-based-acquisition](./phrase-based-acquisition.md) — vocabulary-side neighbour
- [vocabulary-word-type-routing](./vocabulary-word-type-routing.md) — routes word types to encoding routes; collision-bridging is one such route
- [word-knowledge-links](./word-knowledge-links.md) — which links were trained; orthogonal to whether they are below the line
- [learning-sciences-validation](./learning-sciences-validation.md) — the canonical-strategy frame this sits inside

---

## U — See (CAST)
1. Cross-section: eroding topsoil above, one unbroken grey stratum below
2. Edge: anchor (already below the line) → target (inherits stability)

## D — Name (NEDF)
1. Bedrock = the state where forgetting flattens and stops
2. Distinguisher: a threshold of *original learning level*, not of elapsed time or felt confidence
3. Failure mode: declaring it by feel — that is the fluency illusion
4. Contested: the ≥3-month probe is a proxy for Bahrick's 3–6 year flattening, and is answerable to its own falsifier

## F — Do (SPEAR)
0. At encode time: acquire inside a use-context → finish *"now I can ___"* → deploy within 24 h → note the routes already there
1. Default (Route B): stop drilling at the first clean retrieval; widen the gap; count deep passes at ≥1 month
2. Accelerate (Route C): put the item into one real, varied context early; log unprompted production as a deep pass
3. Opportunistic (Route A): 10 s collision search → reject young anchors → involuntary-fire test at 10 min
4. Gate: 8+ deep passes → ≥6-month silence → cold, unaided, fast, one direction → provisional
5. Re-probe at ≥12 months + interference check → confirmed; graduate via [lifecycle-manager](./lifecycle-manager.md)

## B — Watch (HEART)
1. "I'll never forget this" said out loud — nothing has been tested
2. Extra reps inside a session logged as progress — gone by four weeks
3. A deck rebuild that silently wipes interval history and restarts the dose at zero
4. Probing while warm — same deck reviewed, or that language consumed, in the last 24 h
5. Collision bridges creeping past a small share of the deck; arousing cards clustered
6. An anchor quietly reused for a second target

## L — Predict (ORACLE)
1. Anchor age predicts bridge survival better than image vividness does
2. Involuntary firing at 10 min predicts passing the 3-month probe
3. Rising collision-bridge share predicts the distinctiveness advantage decaying

## R — Act (GRACE)
1. Item fails review twice → consider spending distinctiveness budget on it
2. Probe passes → graduate the card out of the deck via [lifecycle-manager](./lifecycle-manager.md)
3. Probe fails → revoke candidacy, return to Active, do not re-declare
