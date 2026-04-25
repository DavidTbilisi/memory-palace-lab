# SEM3 — Full 100-Item Reference

SEM3 encodes the first 2 digits of a 4-digit chunk as a sensory/conceptual
category. The last 2 digits are the Major System suffix (the visual anchor).

## Key Format

Keys are **4-digit strings** in the format `CIXX`:
- **C** = category (0–9) — the sensory class
- **I** = item (0–9) — specific item within category
- **XX** = reserved for Major System suffix (this file lists all entries with XX=00)

So `2700` means "SEM3 category 2 (Smell), item 7 (Coffee)" — the Major slot is
empty. To encode the 4-digit number `2743`, you combine:
- SEM3 prefix `27` → Coffee
- Major suffix `43` → Ram
- Scene: *A ram charging through a coffee shop, coffee smell everywhere*

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-sem3-full) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## The 10 Categories

| C | Category |
|---|----------|
| 0 | Vision |
| 1 | Sound |
| 2 | Smell |
| 3 | Taste |
| 4 | Touch |
| 5 | Sensation |
| 6 | Animals |
| 7 | Birds |
| 8 | Rainbow (Colors) |
| 9 | Solar System |

---

## Full Table (100 entries)

### 0 — Vision
| Key | Item | Key | Item |
|-----|------|-----|------|
| 0100 | Dinosaur | 0200 | Nobility |
| 0300 | Moonlight | 0400 | Ravine |
| 0500 | Lightning | 0600 | Church |
| 0700 | Concorde | 0800 | Fire |
| 0900 | Painting | | |

### 1 — Sound
| Key | Item | Key | Item |
|-----|------|-----|------|
| 1000 | Sing | 1100 | Drum |
| 1200 | Neigh | 1300 | Moan |
| 1400 | Roar | 1500 | Lap |
| 1600 | Shh | 1700 | Gong |
| 1800 | Violine | 1900 | Piano |

### 2 — Smell
| Key | Item | Key | Item |
|-----|------|-----|------|
| 2000 | Seaweed | 2100 | Tar |
| 2200 | Nutmeg | 2300 | Mint |
| 2400 | Rose | 2500 | Leather |
| 2600 | Cheese | 2700 | Coffee |
| 2800 | Forest | 2900 | Bread |

### 3 — Taste
| Key | Item | Key | Item |
|-----|------|-----|------|
| 3000 | Spaghetti | 3100 | Tomato |
| 3200 | Nuts | 3300 | Mango |
| 3400 | Rhubarb | 3500 | Lemon |
| 3600 | Cherry | 3700 | Custard |
| 3800 | Fudge | 3900 | Banana |

### 4 — Touch
| Key | Item | Key | Item |
|-----|------|-----|------|
| 4000 | Sand | 4100 | Dump |
| 4200 | Newspaper | 4300 | Mud |
| 4400 | Rock | 4500 | Lather |
| 4600 | Jelly | 4700 | Grass |
| 4800 | Velvet | 4900 | Bark |

### 5 — Sensation
| Key | Item | Key | Item |
|-----|------|-----|------|
| 5000 | Swim | 5100 | Dancing |
| 5200 | Nuzzling | 5300 | Mingling |
| 5400 | Rubbing | 5500 | Loving |
| 5600 | Shaking | 5700 | Climbing |
| 5800 | Flying | 5900 | Peace |

### 6 — Animals
| Key | Item | Key | Item |
|-----|------|-----|------|
| 6000 | Zebra | 6100 | Deer |
| 6200 | Newt | 6300 | Monkey |
| 6400 | Rhino | 6500 | Elephant |
| 6600 | Giraffe | 6700 | Kangaroo |
| 6800 | Fox | 6900 | Bear |

### 7 — Birds
| Key | Item | Key | Item |
|-----|------|-----|------|
| 7000 | Seagull | 7100 | Duck |
| 7200 | Nighteagle | 7300 | Magpie |
| 7400 | Robin | 7500 | Lark |
| 7600 | Chicken | 7700 | Kingfisher |
| 7800 | Flamingo | 7900 | Peacock |

### 8 — Rainbow (Colors)
| Key | Item | Key | Item |
|-----|------|-----|------|
| 8000 | Red | 8100 | Orange |
| 8200 | Yellow | 8300 | Green |
| 8400 | Blue | 8500 | Indigo |
| 8600 | Violet | 8700 | Black |
| 8800 | Gray | 8900 | White |

### 9 — Solar System
| Key | Item | Key | Item |
|-----|------|-----|------|
| 9000 | Sun | 9100 | Mercury |
| 9200 | Venus | 9300 | Earth |
| 9400 | Mars | 9500 | Jupiter |
| 9600 | Saturn | 9700 | Uranus |
| 9800 | Neptune | 9900 | Pluto |

---

## Phonetic Alignment with Major System

The items are phonetically tuned to Major consonants. The second digit (I) of
the SEM3 key matches the Major consonant for that digit:

- `21` Tar (T=1) · `22` Nutmeg (N=2) · `23` Mint (M=3) · `24` Rose (R=4)…
- `61` Deer (D=1) · `62` Newt (N=2) · `63` Monkey (M=3) · `64` Rhino (R=4)…

This double-encoding means you can *recover* the digits from either the
sensory category OR the Major consonant — great for error-correction during recall.

---

## Usage Rules

### For 4-digit encoding
- Split number as `[SEM3 prefix: 2 digits][Major suffix: 2 digits]`
- Look up SEM3 prefix in this table (ignore the 00 suffix)
- Look up Major suffix in `major-system.md`
- Weave into one scene: the sensory category *modifies* the Major image

### For multi-chunk numbers
- 8 digits = two 4-digit chunks = two SEM3+Major scenes placed at two loci
- 12 digits = three chunks at three loci
- Chain loci through a mind palace walk

### When to reach for SEM3 vs. PAO
- **SEM3 + Major (4 digits):** when you want a sensory-charged static scene, ideal for dates, codes, account numbers
- **PAO (3 digits):** when you want a narrative action scene, ideal for phone numbers

### When NOT to use SEM3
- For binary or hex data → use the Binary/Hex elemental system
- For non-numeric concepts → use NEDF
- For relational data → use CAST

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-sem3-and-major)**.

