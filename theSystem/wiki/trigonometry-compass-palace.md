---
palace: strategic-memory
level: 2
domain: 10
room: 1
wiki_source: wiki/learning-systems/trigonometry-compass-palace.md
---

# Trigonometry Compass Palace

**Summary**: A spatial mnemonic for trigonometry that turns the unit circle into a compass, making angles, quadrant signs, and the cosine/sine coordinate rule easier to retrieve.

**Sources**:
- raw/01 Core_Memory/Math/Trigonometry.md
- eye-movement-and-compass-mnemonics.md

**Last updated**: 2026-04-30

---

## Core Idea

This source treats trigonometry as navigation rather than formula memorization. The unit circle becomes a compass with stable directional anchors, and the diagonals become the four quadrants. That gives one structure that can hold direction, angle, sign, and later special-angle values. (source: raw/01 Core_Memory/Math/Trigonometry.md)

The practical claim is simple: trig becomes easier when it is stored as a map you can walk instead of as disconnected symbolic facts. (source: raw/01 Core_Memory/Math/Trigonometry.md)

## Direction Anchors

The source fixes the cardinal directions first:

| Direction | Angle | Image |
|---|---|---|
| East | 0 deg | eat cookies |
| North | 90 deg | nose |
| West | 180 deg | wet milk |
| South | 270 deg | soup |

It then fixes the diagonals:

| Direction | Angle | Image |
|---|---|---|
| NE | 45 deg | straw |
| NW | 135 deg | sick nose |
| SW | 225 deg | man in soup |
| SE | 315 deg | cookie in milk |

These anchors are the base of the palace because they are spatially stable and emotionally distinct. (source: raw/01 Core_Memory/Math/Trigonometry.md)

For the reusable concept behind this mapping, see [unit-circle-as-compass](./unit-circle-as-compass.md). For quadrant sign behavior, see [quadrant-sign-patterns](./quadrant-sign-patterns.md).

## Quadrants as Sign Patterns

Once the compass is fixed, each quadrant inherits a sign pattern:

| Quadrant | Direction | sin | cos |
|---|---|---|---|
| Q1 | NE | + | + |
| Q2 | NW | + | - |
| Q3 | SW | - | - |
| Q4 | SE | - | + |

The source recommends using the emotional feel of each diagonal image to reinforce the sign pattern, instead of memorizing the pattern as an abstract table alone. (source: raw/01 Core_Memory/Math/Trigonometry.md)

## Coordinate Rule

The central structural fact in the note is:

`(x, y) = (cos theta, sin theta)`

That means horizontal position tracks cosine and vertical position tracks sine. East/west movement therefore encodes cosine polarity, and north/south movement encodes sine polarity. (source: raw/01 Core_Memory/Math/Trigonometry.md)

This is the bridge between the spatial mnemonic and formal trig. The compass is not replacing the math; it is providing a stable retrieval interface for the math. (source: raw/01 Core_Memory/Math/Trigonometry.md)

## Eye Movement Layer

A useful synthesis extension is to make the compass not only visual but **oculomotor**:

- look right for east / positive cosine
- look left for west / negative cosine
- look up for north / positive sine
- look down for south / negative sine
- use diagonal gaze for quadrant selection

That turns the compass into a small motor retrieval loop:

`center -> direction -> quadrant -> sign`

This does not replace the spatial mnemonic. It reinforces it with a light embodied cue, which is especially useful because embodied and sensorimotor encoding are currently underweighted elsewhere in the architecture. (source: eye-movement-and-compass-mnemonics.md; missing-encoding-layers.md)

## What This Helps You Retrieve

This structure supports at least four things at once:

- compass directions
- canonical unit-circle angles
- sine/cosine sign behavior
- equal-value intuition for diagonals like 45 deg

The source uses 45 deg as the example: NE is a perfect diagonal, so sine and cosine are both positive and equal there. (source: raw/01 Core_Memory/Math/Trigonometry.md)

## Recommended Palace Layout

The proposed permanent palace is:

| Location | Angle |
|---|---|
| East | 0 deg |
| NE | 45 deg |
| North | 90 deg |
| NW | 135 deg |
| West | 180 deg |
| SW | 225 deg |
| South | 270 deg |
| SE | 315 deg |

The source explicitly recommends using these fixed locations first, then later layering in special-angle values, tangent behavior, radians, identities, and graphs. (source: raw/01 Core_Memory/Math/Trigonometry.md)

## Why This Encoding Works

The note argues that this mnemonic is strong because it combines multiple representations at once: visual images, spatial directions, emotional polarity, and coordinate geometry. That matches the broader Neural OS preference for navigable retrieval structures over isolated facts. (source: raw/01 Core_Memory/Math/Trigonometry.md)

In practice, the retrieval loop becomes:

`direction -> angle -> sign pattern -> coordinate intuition`

That is a better entry path than starting from a formula sheet and trying to reconstruct spatial meaning afterward. (source: raw/01 Core_Memory/Math/Trigonometry.md)

## Drill Ladder Declaration

```yaml
skill: unit-circle compass retrieval
skill_type: discrimination
real_target: retrieve direction, angle, sine/cosine sign, and coordinate intuition from one stable compass map
real_use_case: trig sign recall, angle orientation, special-angle retrieval, exam support
time_horizon: 2-4 weeks
session_length: 10-20m
weekly_frequency: 5x
```

Stage map:

- `0 Orientation` -> cardinal directions and why the compass matters
- `1 Isolation` -> east, north, west, south anchors
- `2 Clean Repetition` -> add diagonals and quadrant sign patterns
- `3 Controlled Variation` -> move between direction, angle, sign, and coordinate prompts
- `4 Automaticity` -> answer sign and angle prompts quickly
- `5 Mixing` -> mix direction, angle, sign, and equal-value diagonals
- `6 Pressure And Noise` -> answer under time or after interruption
- `7 Transfer And Zenith` -> use the compass inside real trig problems

Primary failure modes:

- `cannot recognize`
- `cannot recall`
- `confuses neighbors`
- `too slow`

Minimum daily session:

1. review the 8 compass anchors
2. answer 8 angle <-> direction prompts
3. answer quadrant sign prompts
4. restate `(x, y) = (cos, sin)` from one chosen direction

Promotion rule:

- move up when all 8 anchors and quadrant signs are retrieved cleanly without table lookup

Fallback rule:

- if diagonals or signs blur, return to cardinals plus one diagonal pair only

## Related Pages

- [drill-readiness-audit](./drill-readiness-audit.md)
- [unit-circle-as-compass](./unit-circle-as-compass.md)
- [quadrant-sign-patterns](./quadrant-sign-patterns.md)
- [eye-movement-and-compass-mnemonics](./eye-movement-and-compass-mnemonics.md)
- [cast-overview](./cast-overview.md)
- [nedf-overview](./nedf-overview.md)
- [UMTF](./universal-mental-tagging-framework.md)


---

## U — See (CAST)
1. Trig as compass-palace mnemonic
2. Angles, quadrant signs, sine/cosine via compass

## D — Name (NEDF)
1. Trigonometry compass palace = compass-based trig mnemonic
2. Distinguisher: unit circle as compass
3. Failure mode: angle list without spatial anchor

## F — Do (SPEAR)
1. Trig question → walk compass
2. Read sign/coordinate from direction

## B — Watch (HEART)
1. Angle-list drift
2. Sign confusion

## L — Predict (ORACLE)
1. Angle → predict compass direction
2. Direction → predict sign/coordinate

## R — Act (GRACE)
1. Trig question → walk compass
2. Sign confusion → consult quadrant