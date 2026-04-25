# Binary & Hex — Unified Elemental System

A single cross-matrix encodes **hex digits (0–F)**, **4-bit nibbles**, and
**8-bit bytes**. All three share the same elemental vocabulary, so learning
one unlocks the others.

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-binary-hex) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The Core 4-Bit Matrix

Every 4-bit value (hex 0–F) = **Element × State**.

- **High bits (3–2 of the nibble, MSB first): Element** — 00 Fire · 01 Air · 10 Water · 11 Earth
- **Low bits (1–0): State** — 00 Solid · 01 Liquid · 10 Gas · 11 Plasma

```
                    STATE →
                    00 Solid   01 Liquid   10 Gas      11 Plasma
ELEMENT ↓ (rows match studio matrix top → bottom)
00 Fire             0 (ember)  1 (lava)    2 (smoke)   3 (inferno)
01 Air              4 (crystal)5 (dew)     6 (breeze)  7 (aurora)
10 Water            8 (ice)    9 (ocean)   A (mist)    B (storm)
11 Earth            C (rock)   D (mud)     E (dust)    F (magma)
```

---

## Hex 0–F — Canonical Scenes

| Hex | Bits | Element | State | Scene |
|-----|------|---------|-------|-------|
| **0** | 0000 | Fire | Solid | 🧱 Ember (glowing coal) |
| **1** | 0001 | Fire | Liquid | 🌋 Lava flow |
| **2** | 0010 | Fire | Gas | 💨 Smoke column |
| **3** | 0011 | Fire | Plasma | 🔥 Inferno wall |
| **4** | 0100 | Air | Solid | 💎 Crystal |
| **5** | 0101 | Air | Liquid | 💧 Dew drop |
| **6** | 0110 | Air | Gas | 🌬️ Breeze |
| **7** | 0111 | Air | Plasma | 🌌 Aurora |
| **8** | 1000 | Water | Solid | 🧊 Ice block |
| **9** | 1001 | Water | Liquid | 🌊 Ocean wave |
| **A** | 1010 | Water | Gas | 💨 Mist veil |
| **B** | 1011 | Water | Plasma | ⛈️ Lightning storm |
| **C** | 1100 | Earth | Solid | 🪨 Rock wall |
| **D** | 1101 | Earth | Liquid | 🟫 Mud pit |
| **E** | 1110 | Earth | Gas | 🌫️ Dust cloud |
| **F** | 1111 | Earth | Plasma | 🌋 Magma flow |

**Note:** Some scenes collide visually (2 smoke vs E dust, A mist vs 6 breeze motion).
Disambiguate by the *high nibble* (00 Fire vs 10 Water gas, 01 Air vs 11 Earth):
- **2** = 00 Fire gas (hot rising smoke)
- **E** = 11 Earth gas (dry dust lifting)
- **A** = 10 Water gas (cool vapor bank)
- **6** = 01 Air gas (clear sky motion)

---

## 4-Bit Nibbles — Same Table, Binary Notation

A 4-bit value = one hex scene. Use when encoding binary directly:

- `1010` → A → Mist veil
- `0101` → 5 → Dew drop
- `1111` → F → Magma flow

Two nibbles chain to form a byte (see 8-bit section).

---

## 8-Bit Bytes — The Full Cross-Matrix

An 8-bit byte uses **two 4-bit matrices** stacked into one scene with four slots.
This is the same structure as CAST (which specializes for network edges).

### Bit layout

```
Bits:    A B  C D  E F  G H
Slot:    [ AB ][ CD ][ EF ][ GH ]
Matrix1: [Element][State]   = Character × Form
Matrix2: [Element][State]   = Object    × Setting
```

### Slot meanings

| Bits | Slot | Role | Element axis | State axis |
|------|------|------|--------------|------------|
| AB | Character (Person) | *Who* acts | 00 Giant (earth), 01 Mermaid (water), 10 Mage (air), 11 Dragon (fire) | — |
| CD | Form (Action) | *How* they act | — | 00 crushing (solid), 01 flowing (liquid), 10 spreading (gas), 11 exploding (plasma) |
| EF | Object | *What* is acted on | 00 rock, 01 water, 10 cloud, 11 stone (CAST stream; aligns with elemental bands) | — |
| GH | Setting (Environment) | *Where/when* | — | 00 red cave (solid), 01 blue ocean (liquid), 10 green sky (gas), 11 purple storm (plasma) |

### The cross-matrix insight

Core scene = **AB × GH** (Character × Setting).
CD (Form) and EF (Object) add variation and detail.

This means you can *read a byte at a glance* by just checking the outer 4 bits
(AB + GH) for the scene skeleton, and use the inner 4 bits (CD + EF) to refine.

### Full 8-bit lookup rules

```
Scene template: "[AB emoji] [AB name] [CD action] [EF emoji] [EF object] in [GH setting]"

AB (Character):
  00 🗿 Giant    01 🧜 Mermaid   10 🧙 Mage    11 🐉 Dragon
CD (Action):
  00 crushing   01 flowing      10 spreading  11 exploding
EF (Object):
  00 🧱 rock    01 💧 water     10 ☁️ cloud    11 🪨 stone
GH (Setting):
  00 🪨 red cave    01 🌊 blue ocean
  10 ☁️ green sky   11 🌋 purple storm volcano
```

### Example encodings

| Byte | AB | CD | EF | GH | Scene |
|------|----|----|----|----|-------|
| `00000000` | Giant | crushing | rock | red cave | *Giant crushing rock in red cave* |
| `01011010` | Mermaid | flowing | cloud | green sky | *Mermaid flowing cloud in green sky* |
| `10110011` | Mage | exploding | rock | purple storm | *Mage exploding rock in purple storm* |
| `11111111` | Dragon | exploding | stone | purple storm | *Dragon exploding stone in purple storm* |

---

## Reading Speed Drill

To hit recall speed targets:

1. **Single hex digit** → scene in < 1 second (16 scenes to memorize)
2. **Hex pair (byte)** → two scenes in < 2 seconds
3. **Full 8-bit byte (CAST-style composite scene)** → < 3 seconds

Practice path:
- Week 1: Drill hex 0–F → scene (front) and scene → hex (back). Anki both directions.
- Week 2: Drill hex pairs (00–FF) as two-scene pairs.
- Week 3: Drill 8-bit composite scenes for CAST and binary data.

---

## Relationship to CAST

CAST is the **specialized version** of the 8-bit system for network edges:

| 8-bit generic | CAST specialization |
|---------------|---------------------|
| AB = Character | AB = Source role + direction |
| CD = Form/Action | CD = Relationship type + strength |
| EF = Object | EF = Stream (what flows) |
| GH = Setting | GH = Time (stability) |

The imagery is identical. CAST just assigns **semantic roles** to each slot
for the graph-encoding use case. If you know the 8-bit system, you know CAST.

### Explicit slot-value mapping

The elemental "state" axis maps to CAST action verbs, and the elemental
"element" axis maps to CAST objects. Same 4 values per slot, different names:

| Bits | State (elemental) | Action (CAST) |
|------|-------------------|---------------|
| 00 | Solid | crushing |
| 01 | Liquid | flowing |
| 10 | Gas | spreading |
| 11 | Plasma | exploding |

| Bits | Element (elemental nibble) | Stream (CAST) |
|------|------------------------------|----------------|
| 00 | Fire | rock |
| 01 | Air | cloud |
| 10 | Water | water |
| 11 | Earth | stone |

So "solid fire" (hex 0, ember) lines up with the same **state** slot as CAST "crushing" (solid); the stream image (rock / cloud / water / stone) still names what moves. The verb form is what changes when you shift from binary-value thinking to edge-relationship thinking.

---

## Decision Rule: When to Use Which

| Data | Use |
|------|-----|
| A single hex digit (color value, single nibble) | 4-bit / hex table |
| A binary nibble | 4-bit table |
| A hex pair / byte (file header, memory value) | 8-bit byte |
| A binary byte | 8-bit byte |
| A network edge property bundle | CAST (same bits, semantic roles) |
| **Wall time** — compass + quarter-hour in one nibble; hour/minute bytes | `calendar-time-memorization.md` §2.26 (same 4-bit table) |
| Longer binary (16-bit, 32-bit) | Chain of bytes, one per locus in palace |

---

## Key Principles

1. **One matrix, three uses.** Hex, binary, and CAST all draw from the same elemental vocabulary. Learn once, use everywhere.
2. **Element = identity, State = behavior.** Every 4-bit scene is "what thing, in what form."
3. **AB × GH is the skeleton.** For 8-bit, get the outer bits first for the scene shape, then fill in CD and EF for detail.
4. **Elements are emotional anchors.** Earth is heavy/permanent, Water is fluid/change, Air is subtle/invisible, Fire is transformation/destruction. These associations help recall under stress.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-binary-and-hex)**.

