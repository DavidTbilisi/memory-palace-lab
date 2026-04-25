# Retrieval Protocol

A **thin layer on top of Anki**, not a replacement. Anki handles card-level
scheduling. This protocol handles what Anki can't: palace topology, scene
decay, retrieval speed under stress, and failure repair.

Three components:

1. **Encoding → Anki handoff** — consistent card templates per system
2. **Palace-walk cadence** — weekly end-to-end walks to test structural recall
3. **Weak-link repair** — what to do when a scene fails

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-retrieval-protocol) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## Component 1 — Encoding → Anki Handoff

Every encoding should generate **Anki-ready cards** in a standard template per
system. Consistency matters more than cleverness — you want the card format
to be automatic so encoding doesn't get held up by "what should the card look
like?"

### Templates by system

#### Major System (numbers)
- **Front:** `17`
- **Back:** `Dog`
- Direction: both (number→image AND image→number)

#### PAO (3-digit)
- **Front:** `598`
- **Back:** `Loki burning a flag`
- Cards: three per entry — number→scene, scene→number, and component recall

#### SEM3 + Major (4-digit)
- **Front:** `2743`
- **Back:** `Coffee (27) + Ram (43) = Ram charging through a coffee shop`
- Include the decomposition on the back — trains you to split chunks

#### Georgian (node / calendar)
- **Front:** Letter `ვ` OR node name OR month #6
- **Back:** Animal + Person + Adjective + Environment (full 4-slot)
- Extra card: Person-only for disambiguation practice

#### Binary / Hex
- **Front:** `F` or `1111`
- **Back:** Scene (e.g., inferno wall) + element + state
- Extra card: byte → two-scene pair

#### NEDF (concepts)
- **Front:** concept name
- **Back:** full 4-slot scene + N/E/D/F legend
- **Additional cards:** cloze deletions on each slot (4 cards per concept) + symptom→concept card (highest yield)

#### CAST (edges)
- **Front:** source → target (by node name)
- **Back:** 8-bit CAST + scene + CAST slot legend
- Extra card: scene → bits (bidirectional)

#### Formulas
- **Front:** formula
- **Back:** atom-by-atom scene with zones marked
- Extra: reverse (scene → formula) and symptom-based (what am I computing? → formula)

#### Heuristic Palace
- **Front:** locus ID (e.g., "Room 3, Locus 3.3")
- **Back:** heuristic + scene
- **High-yield extra:** symptom → locus (e.g., "I keep grinding without progress" → Stopwatch)

### Tagging

Tag every Anki card with:
- System (`#major`, `#sem3`, `#cast`, `#nedf`, `#formula`, etc.)
- Domain (`#code`, `#math`, `#physics`, `#history`, etc.)
- Palace name if palace-anchored (`#palace-university`, `#palace-heuristic`)

This lets you filter decks by system (drill all CAST cards) or by domain (drill
all math cards) when a palace walk reveals a weak area.

---

## Component 2 — Palace-Walk Cadence

**See also:** `mind-palace.md` — full definition of **palace vs locus**, **why spatial beats flat indexing** for large structured material, **benefits and weaknesses**, **real vs imagined** routes, and **diagrams** for nesting structure. This section only specifies **cadence, timing, and logging**.

Anki drills cards in isolation. A mind palace's value comes from **spatial
continuity** — walking room to room, locus to locus. Anki can't test this.
You must walk the palace deliberately.

### Schedule

| Palace | Walk frequency | Mode |
|--------|----------------|------|
| Heuristic Palace | **Daily** (once, ~60 sec) | Full start-to-finish |
| Active learning palaces (current domain) | **Every 2–3 days** | Full walk |
| Background palaces (consolidated domains) | **Weekly** | Spot-check (3 random loci) |
| Archive palaces (not actively used) | **Monthly** | Brief survey |

The Heuristic Palace is walked daily because it's the **problem-solving tool**
— you want it reflexive, not retrieved. After 4–6 weeks of daily walks it
becomes automatic and the frequency can drop to every few days.

### Walk procedure

1. **Enter the palace** — mentally step into the front door / entrance locus.
2. **Walk in canonical order** — same route every time. Don't randomize.
3. **At each locus, time yourself:**
   - **< 2 sec** to fire the scene → strong
   - **2–5 sec** → acceptable, consider reinforcement
   - **> 5 sec** → weak link, flag for repair
   - **fails entirely** → severe weak link, immediate repair needed
4. **Log weak links** — just the locus ID. Don't stop to repair during the walk; finish the walk first.
5. **After walk, queue repairs** — go back to flagged loci and apply the repair procedure (Component 3).

### Why timed walks matter

Anki reviews test recall with no time pressure. Real problem-solving demands
recall under stress. Timed palace walks train **retrieval speed**, which is
what your stated goal ("highest speed possible") actually requires.

### Palace metrics to track

Keep a light log (notebook or a simple spreadsheet column):
- Date of walk
- Walk duration (seconds)
- Number of weak-link flags
- Repair count

Trend the duration and flag count over weeks. Duration should decrease, flags
should trend toward zero. If duration *grows* or flags plateau above zero, the
palace has too much content and needs to be split.

---

## Component 3 — Weak-Link Repair

When a locus fails or lags, apply this decision tree:

```
Did the scene fire at all?
│
├── NO (complete blank)
│   └── Scene is broken or wrong locus
│       → Re-encode from scratch, possibly at a new locus
│
└── YES but slow (3+ sec) or partial
    │
    ├── I can see the scene but can't retrieve what it encodes
    │   → The encoding link is weak
    │   → Re-encode with stronger sensory layer (add SEM3 category)
    │
    ├── I can retrieve what it encodes but the scene is dim
    │   → The scene is fading
    │   → Re-visit and re-vivify: add emotion, bizarre detail, motion
    │
    ├── Two nearby loci are bleeding into each other
    │   → Spatial ambiguity
    │   → Relocate one scene to a clearly different locus
    │
    └── I confuse this scene with a sibling concept elsewhere
        → Nearest-neighbor collision
        → Add the Distinguisher (NEDF slot 3) more explicitly
```

### Repair tactics (in order of cost)

1. **Vivify** (1 min) — re-imagine the scene with more emotion, motion, bizarre detail. Cheapest fix.
   - **REMAPS checklist** (pick 2–3 before re-testing): **R**otate / reverse / relocate · **E**xaggerate or eliminate noise · **M**odify, merge, or add motion · **A**ssociate to a stronger anchor · **P**lay (humor/absurdity) or move to a clearer palace locus · **S**enses / symbols (sound, smell, temperature, shorthand glyph).
2. **Re-sensory** (2 min) — add SEM3 sensory layer (smell, sound, touch) to make the scene multi-modal.
3. **Relocate** (5 min) — move the scene to a new locus if spatial ambiguity is the cause.
4. **Re-encode** (10 min) — start over with a new scene if the original is fundamentally broken.
5. **Split** (30+ min) — if multiple loci are weak in the same palace, the palace may have too much in it; split it into two.

Always try tactics 1–2 before 3–4. Most weak links are low-vividness, not structurally wrong.

**Mnemonic checksum:** scenes where elements **interact in one continuous picture** fail *loudly* when a part is missing (the story cannot run). Prefer connected composites over parallel isolated hooks when reliability matters.

---

## When to Encode New Content

Don't encode everything you read. Encode when:

- **The concept has a classic failure mode you've personally hit** (high retention value)
- **You've encountered the concept 2+ times and still had to look it up** (frequency threshold)
- **The concept is load-bearing for a larger structure** (foundational, referenced by other concepts)
- **The information has long-term value** (not ephemeral project-specific trivia)

Don't encode when:

- You only needed the info once
- It's trivial to derive from first principles
- You'll forget it naturally without penalty
- You haven't understood it yet (encode only what you can explain — otherwise you memorize confusion)

### The "explain it to the rubber duck" gate

Before encoding: can you explain the concept aloud without notes? If no, go back and understand first. Encoding confusion produces confused scenes that retrieve as confusion.

---

## Component 4 (Optional) — Anki Deck Organization

If you want to align your Anki decks to this system:

```
Root deck: Memory Systems
├── Numeric
│   ├── Major 00–99
│   ├── PAO (people / actions / objects)
│   ├── SEM3 (100 entries)
│   └── Binary/Hex (16 hex scenes)
├── Domain
│   ├── CS concepts (NEDF cards)
│   ├── Math formulas (formula cards)
│   ├── Language vocab (varies)
│   └── Physics
├── Networks
│   ├── Georgian 33 entries
│   └── CAST edge library
└── Heuristic Palace (20 loci)
```

Under each domain, tag cards by `#nedf`, `#cast`, `#formula` as appropriate.
This lets you pull, e.g., "all math formula cards I got wrong this week" with one filter.

---

## Integration Rules

- **Anki handles card-level spacing.** Don't try to manually schedule reviews.
- **Palace walks handle structural integrity.** Anki can't do this; you must.
- **Weak-link repair is human-judgment only.** No automation — the question "is this scene vivid enough?" requires you.
- **Log but don't obsess.** One line per walk is enough; tracking matters less than walking.

---

## Time Budget

With your stated 90+ min/day:

- Anki reviews: 30–50 min (whatever the queue demands)
- New encoding: 20–30 min (3–8 new concepts/formulas/edges depending on complexity)
- Palace walks: 5–10 min
- Weak-link repair: 5–10 min (rolling, as walks surface problems)

Remaining time → deliberate practice on the domain (solve problems, write code, derive formulas). **Encoding without application is just storage; application is what consolidates.**

---

## Key Principles

1. **Anki + palace walks, not Anki alone.** They test different things.
2. **Timed walks train speed.** Untimed review trains recognition, not retrieval.
3. **Repair cheaply before re-encoding.** Vivify, then re-sensory, then relocate, then re-encode.
4. **Explain before encoding.** Encoding confusion stores confusion.
5. **Application consolidates.** Use what you encode, or it fades regardless of review.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-retrieval-protocol)**.

