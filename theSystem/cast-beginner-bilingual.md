# CAST — Very simple English + Georgian + Russian

This sheet is a **teaching aid**: tiny words first, then the **official CAST English** names (what the app and `cast-system.md` use). If a Georgian or Russian phrase sounds odd, treat the **CAST English column** as canonical and adjust the gloss to your own voice.

**How to use it:** pick one row in each block (AB, CD, EF, GH). Same bits as the main doc — only the first column is “extra simple.”

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-cast-beginner-bilingual) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## AB — WHO (Character)


| Bits | Very simple English     | CAST (official)  | ქართული (მოკლე)       | Русский (коротко)                  |
| ---- | ----------------------- | ---------------- | --------------------- | ---------------------------------- |
| 00   | **Boss.** One way.      | Giant → hub      | გიგანტი → ცენტრი      | Гигант → хозяин                    |
| 01   | **Friends.** Both ways. | Mermaid ↔ peer   | ზღვისქალი ↔ თანასწორი | Русалка ↔ равный обмен             |
| 10   | **Helper.** Out.        | Mage → service   | ჯადოქარი → დახმარება  | Маг → помощь                       |
| 11   | **Pushes back.**        | Dragon ← reverse | დრაკონი ← პასუხი      | Дракон ← ответ / обратное давление |


### Why AB (WHO) feels confusing — use **NEDF** on the source, then pick a mask

**NEDF** (see `concept-encoding.md`) encodes **one concept / thing** in four slots:


| Slot                | Means                                             |
| ------------------- | ------------------------------------------------- |
| **N** Name-hook     | What it’s *called* (sound image)                  |
| **E** Essence       | What it *does* at the core — **one moving image** |
| **D** Distinguisher | How it’s *not* its nearest confusing cousin       |
| **F** Failure       | Where it **breaks** or what people get wrong      |


**AB (Character)** is *not* a second NEDF. It answers a smaller question about **one directed edge** `Source → Target`:

> *Given the source is already fixed on the tail of this arrow, which **four-way mask** best describes how the source **shows up on this link** — boss, peer, helper, or reverse-pressure?*

So the usual confusion is: people try to stuff **NEDF Name** or the whole **Georgian node scene** into AB. That’s too much. **NEDF (and Georgian) = the node’s identity. AB = the source’s costume on this one edge.**

**Practical bridge (do this in order):**

1. **NEDF the source node** (at least **E** + **D**; **F** helps when the edge is “painful”).
2. **Ignore N for AB** — the Giant/Mermaid/Mage/Dragon image is *not* your name-hook; it’s a reusable **edge role** from the table above.
3. Ask only about **this arrow**:
  - From **Essence**: is the source’s core move here **one-way control**? → **Giant**  
  - From **Distinguisher** + symmetry: could you swap roles without lying about responsibility? → often **Mermaid**  
  - From **Essence**: is the source mainly **serving outward** without owning the target’s world? → **Mage**  
  - From **Failure** or dynamics: does the target **push back** or reverse the flow when stressed? → **Dragon**

**One-line example:** Edge `Router → Middleware`. Router’s NEDF essence might be “sorts traffic into lanes.” On *that* dependency edge the router **owns direction** → **Giant** (`00`). Same router on `Router ↔ Metrics` might be **Mermaid** (`01`) if the story is peer-like exchange of signals.

### Concrete arrow stories (same trick as **parent → child**)

Use **two named people or parts**, **one arrow**, same vibe you already liked — then map to AB.


| CAST (AB)     | Family-shaped story                                                         | Same shape in software                                                                                    |
| ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Giant** →   | **Parent → child** (rules, allowance, bedtime: one-way “house law”)         | **Owner → repo policy**, **framework → app** boot order, **router → pipeline** “you go through me.”       |
| **Mermaid** ↔ | **Co-parents ↔** handoffs (pickups, custody calendar: negotiated both ways) | **Service A ↔ service B** with a shared contract; **frontend ↔ API** when neither is “just a helper.”     |
| **Mage** →    | **Aunt → niece** (“I’ll help with homework; **you** still own the grade”)   | **Logger → app**, **helper lib → feature**, **lint rule → PR** (supports without owning the product).     |
| **Dragon** ←  | **Teenager ← parent** (“appeal / pushback” when the rule hits a wall)       | **Client ← rate limit**, **writer ← DB** when full, **downstream ← circuit breaker** “no, you slow down.” |


**Rule of thumb:** draw **one** arrow. Write who is **source** (tail). Ask only: *on this link*, is the tail **bossing**, **peer‑ing**, **helping out**, or **getting pushed back on**?

### Same family picture for **CD · EF · GH** (optional)

Keep **parent → child** (or any one edge you like) and vary only the other slots:


| Slot   | Example angle on *parent → child*                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CD** | **crushing** = non‑negotiable curfew; **flowing** = default allowance rhythm; **spreading** = soft nudges; **exploding** = “we’re changing the whole deal tonight.”      |
| **EF** | **rock** = written house rules; **water** = money/time budget; **cloud** = texts/reminders; **stone** = one‑off events (“grounded this weekend”).                        |
| **GH** | **red cave** = “always in this house”; **blue ocean** = “usually, unless we’re traveling”; **green sky** = “if grades slip”; **purple storm** = “only during exam week.” |


You can swap the domain (school, team, code) — keep **two nodes, one arrow**, and the **representation** stays easy to sketch.

---

## CD — HOW (Action)


| Bits | Very simple English | CAST (official) | ქართული (მოკლე)  | Русский (коротко)    |
| ---- | ------------------- | --------------- | ---------------- | -------------------- |
| 00   | **Holds hard.**     | crushing        | ძლიერი კონტროლი  | Сильный контроль     |
| 01   | **Feeds / runs.**   | flowing         | რბილი დინება     | Питает / течёт       |
| 10   | **Nudges only.**    | spreading       | სუსტი გავლენა    | Слабо влияет         |
| 11   | **Big change.**     | exploding       | მკვეთი გარდაქმნა | Резкий сдвиг / взрыв |


---

## EF — WHAT (Stream)


| Bits | Very simple English  | CAST (official) | ქართული (მოკლე)   | Русский (коротко)  |
| ---- | -------------------- | --------------- | ----------------- | ------------------ |
| 00   | **Shape / layout.**  | rock            | ქვა · სტრუქტურა   | Камень · структура |
| 01   | **Power / fuel.**    | water           | წყალი · ენერგია   | Вода · ресурсы     |
| 10   | **Messages / info.** | cloud           | ქლაუდი · სიგნალი  | Облако · сигналы   |
| 11   | **Events / ticks.**  | stone           | მოვლენა · იმპულსი | События · триггер  |


*Note:* In tech Georgian, “cloud” is often **ქლაუდი** (loanword), which is fine for this layer.

---

## GH — WHEN (Time)


| Bits | Very simple English | CAST (official) | ქართული (მოკლე)                  | Русский (коротко)           |
| ---- | ------------------- | --------------- | -------------------------------- | --------------------------- |
| 00   | **Always.**         | red cave        | წითელი გამოქვაბული · სამუდამო    | Красная пещера · всегда     |
| 01   | **Mostly on.**      | blue ocean      | ლურჯი ოკეანე · თითქმის ყოველთვის | Синий океан · почти всегда  |
| 10   | **Only if…**        | green sky       | მწვანე ცა · პირობითი             | Зелёное небо · если условие |
| 11   | **Short burst.**    | purple storm    | იისფერი შტორმი · მოკლე დრო       | Буря · короткий срок        |


---

## One-line pattern (all four slots)

**English (baby steps):**  
`WHO` + `HOW` + `WHAT` + `WHEN` — each from the “Very simple” column.

**Example:**  
*Boss one-way · holds hard · shape · always* → same bits as *Giant, crushing, rock, red cave* (`00 00 00 00`).

**ქართული:** აირჩიე თითო სტრიქონი თითო ბლოკიდან; შემდეგ გადაიყვანე ოფიციალურ CAST ინგლისურ სახელებში.

**Русский:** выбери по одной строке из каждого блока; затем сопоставь с официальными английскими именами CAST.

---

## STEAM / STEMM examples

Three scenarios each for **Science, Technology, Engineering, Arts, Math, and Medicine** using this method: **[steam-stemm-examples.md](./steam-stemm-examples.md#appendix-cast-beginner-bilingual)**.

