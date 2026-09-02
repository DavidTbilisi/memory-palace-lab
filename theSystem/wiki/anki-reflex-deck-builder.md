---
palace: tactical-memory
level: 5
domain: 10
room: 6
semantic_mode: 5
wiki_source: wiki/learning-systems/anki-reflex-deck-builder.md
---

# Anki Reflex Deck Builder

**Summary**: A Python tool (`reflex-anki`) that generates Anki `.apkg` packages from YAML files. Covers the tool's architecture, the smart decisions for when/how to use Anki in the Neural OS pipeline, deck organization strategy, and integration with the gym system.

**Sources**: `tools/reflex-anki/` (tool implementation), user prompt (2026-05-06), [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) (theory)

**Last updated**: 2026-05-07

---

## Where Anki fits in the Neural OS pipeline

Anki covers **pipeline stages 3–4** of the skill pipeline (canonical numbering at [skill-progression-stages](./skill-progression-stages.md)). Not pipeline stages 1–2 (understanding/encoding). Not pipeline stages 5–8 (execution and transfer). Only the memory-to-reflex bridge.

| Pipeline stage | Tool |
|---|---|
| 1. Understand concept | Notes / Red Queen |
| 2. Encode concept | Mnemonics / CAST |
| **3. Remember cue→action** | **Anki reflex cards** |
| **4. Distinguish similar cases** | **Anki + mixed review** |
| 5. Execute action | Labs / exercises |
| 6. Execute fast | Gym timed drills (Blocked stage) |
| 7. Execute under pressure | Gym random drills / simulators |
| 8. Transfer | Projects / teaching / production |

The critical insight: **Anki is not the destination.** It is the bridge between encoding (pipeline stage 2) and execution (pipeline stage 5). When a card feels automatic — you know the answer before flipping — retire it from Anki and move the skill to the gym.

---

## The tool

**Location**: `tools/reflex-anki/`

**Install**:
```bash
cd tools/reflex-anki
pip install -e .
```

**Usage**:
```bash
reflex-anki build examples/aws_reflexes.yaml
reflex-anki build examples/aws_reflexes.yaml --output aws.apkg
reflex-anki validate examples/aws_reflexes.yaml --strict
```

**Example decks shipped**:
- `examples/aws_reflexes.yaml` — SQS vs SNS vs EventBridge service selection (9 cards)
- `examples/cybersecurity_reflexes.yaml` — attack classification and first response (8 cards)
- `examples/english_reflexes.yaml` — technical writing clarity reflexes (7 cards)

---

## Card format: the reflex atom

Every card is one reflex — no more:

```yaml
- id: sqs_buffering
  trigger: "A producer sends faster than a consumer processes. Messages must wait safely."
  classification: "Queue-based decoupling"
  action: "Use SQS"
  explanation: "SQS buffers durably. Messages persist until the consumer acks and deletes them."
  common_mistake: "Using direct Lambda-to-Lambda invocation or SNS when only one consumer is needed."
  contrast: "SNS fans out to many subscribers simultaneously. SQS holds for one consumer group."
  next_drill: "Draw producer -> SQS -> consumer with a DLQ. Label visibility timeout."
  time_target_seconds: 5
  tags: [sqs, decoupling, buffering]
```

**The wrong card format** (do not generate):
```yaml
trigger: "What is SQS?"
```

**The right card format** (cue → classification → action):
```yaml
trigger: "A producer sends jobs faster than a worker can process them..."
classification: "Queue-based decoupling"
action: "Use SQS"
```

This is the difference between memorization and automaticity training.

---

## Smart decisions for deck organization

### Decision 1: Deck granularity

**Rule**: One deck per topic cluster, not one deck per domain.

| Too broad | Too narrow | Correct |
|---|---|---|
| "AWS" | "SQS maxReceiveCount" | "AWS SQS vs SNS vs EventBridge" |
| "Security" | "IDOR in Django" | "OWASP Injection Classes" |
| "English" | "Passive voice" | "Technical Writing Clarity" |

A topic cluster contains 20–40 cards covering one discriminable concept space. Bigger than 40 = split. Smaller than 10 = merge into a related cluster.

### Decision 2: Anki deck hierarchy

Use Anki's nested structure:

```
Neural OS::
  AWS::
    SQS-SNS-EventBridge        ← topic cluster
    IAM-Policies
  Cybersecurity::
    Injection-Classes
    Auth-Authz
  English::
    Technical-Writing
```

Parent decks serve as folders only. All actual cards live in leaf decks.

### Decision 3: Tag strategy

Use two tag families on every card:

| Family | Examples | Purpose |
|---|---|---|
| **Stage** | `stage-3`, `stage-4` | Pipeline stage from [skill-progression-stages](./skill-progression-stages.md); track where the skill sits in the lifecycle |
| **Topic** | `sqs`, `sqli`, `passive-voice` | Filter by content for focused review |

Deck-level tags handle the stage tag (applied to all cards). Card-level tags handle the topic. Anki's custom study lets you drill only `stage-4` cards when working on discrimination.

### Decision 4: When to use Anki vs. gym

| Signal | Use Anki | Use Gym |
|---|---|---|
| Skill level | You know what to do but have to think | You can act but too slowly |
| Learning stage | Pipeline stage 3–4 | Pipeline stage 5–7 |
| What you need | Cue-action binding, discrimination | Speed, pressure, randomization |
| Time available | 5–15 min sessions | 10–20 min sessions |

**Critical rule**: Do not skip Anki stages and go straight to the gym if you can't reliably classify the problem type first. The gym is fast twitch. Anki is the prerequisite.

### Decision 5: Graduation — when to stop a card

Stop reviewing a card when:
- You respond before the answer appears
- You've been correct 5 sessions in a row
- The response feels like a reflex, not a recall

After graduation: open the gym and find the corresponding skill. If no gym exists, use `reflex-anki` + `gym-template.html` to build one.

### Decision 6: The discrimination rule (pipeline stage 4)

Pipeline stage 4 requires near-confusable pairs. Every deck should include at least one card for each confusable boundary:

- SQS vs SNS: same domain, different fan-out semantics
- SQLi vs XSS: both injection, different contexts
- 401 vs 403: both HTTP errors, different meanings

The `contrast` field is what enables discrimination training. Never omit it.

---

## Integration with the gym system

The gym YAML format (`gyms/data/*.yaml`) and the reflex-anki YAML format are complementary:

| Format | Purpose | Stage |
|---|---|---|
| `reflex-anki YAML` | Anki cards — cue→action memory | Pipeline 3–4 |
| `gym YAML` | Timed discrimination drill — HTML gym | Pipeline 5–7 |

A common authoring workflow:

1. Write reflex-anki YAML for a new skill cluster
2. Build Anki deck → drill until stage-4 graduation
3. Extract the groups and items into gym YAML format
4. Build gym HTML with `gyms/build.ps1`
5. Run gym drills (Blocked → Mixed → Random)

The content is essentially the same — the gym YAML just needs `groups` (the classification categories) and `items` (the trigger + correct + explanation). These map directly from the reflex-anki card fields.

---

## Generating card YAML with AI

Use the prompt from `tools/reflex-anki/README.md`. The key constraint:

> Cards must follow **cue → classification → first action**.  
> Never generate cards like "What is X?".  
> Generate cards like "When you see X, what kind of problem is it and what do you do first?"

Generate 30 cards per topic. Use the `--strict` flag to catch missing `contrast` and `common_mistake` fields before the deck enters review.

---

## Tag schemes consumed by other layers

Anki tags are the runtime channel for two of the 2026-05 layer additions. The reflex-anki tool produces decks that interoperate with both:

- **Lifecycle Manager tags** — `lifecycle::candidate-cold`, `::candidate-archive`, `::candidate-drop`, `::cold`, `::confirm`, `::defer`, `::keep`, `::supersedes::*`, `::supersedence-suspected::*`, `::merge::*`. These drive the four-tier descent ladder (Active → Cold → Archive → Drop) and the consolidation pass. See [lifecycle-manager](./lifecycle-manager.md) for the full contract.
- **ORACLE tags** — `oracle::sequential`, `::conditional`, `::distributional`, `::anomaly` (mode tags); `oracle::draft`, `::accept`, `::reject` (auto-generated face lifecycle); `oracle::skip` (suppress auto-generation). Faces minted from SPEAR or CAST cards via `tm oracle generate` carry these tags. See [oracle-overview](./oracle-overview.md) for slot structure (O/R/A/C/L/E) and the on-demand generation rules.

When generating new decks, leave room for these tags rather than reusing the same namespace. Anki tag namespacing is the cheap version of source-of-truth separation: lifecycle and ORACLE tags are state owned by the Anki side; card content (NEDF Name, Essence, etc.) remains owned by the wiki side.

## Related pages

- [automaticity-and-reflex-training](./automaticity-and-reflex-training.md) — the theory this tool implements
- [red-queen-skill-gym](./red-queen-skill-gym.md) — execution layer (stages 5–7)
- [drill-generator](./drill-generator.md) — drill ladder and progression
- [failure-modes-in-encoding](./failure-modes-in-encoding.md) — what happens when encoding stops at pipeline stage 2
- [skill-progression-stages](./skill-progression-stages.md) — canonical numbering for pipeline stages, drill ladder stages, and automaticity levels
- [lifecycle-manager](./lifecycle-manager.md) — retirement ladder consuming the `lifecycle::*` tags
- [oracle-overview](./oracle-overview.md) — predictive layer consuming the `oracle::*` tags
- [cast-anki-requirements](./cast-anki-requirements.md) — applies the deck-granularity rule to CAST: no encoder-level deck, route cards to topic decks


---

## U — See (CAST)
1. Python tool that generates Anki .apkg from YAML
2. Reflex deck creation pipeline

## D — Name (NEDF)
1. Anki reflex deck builder = YAML → Anki package generator
2. Distinguisher: programmatic deck creation, not manual
3. Failure mode: manual deck creation drift

## F — Do (SPEAR)
1. Write YAML → run reflex-anki
2. Import .apkg into Anki

## B — Watch (HEART)
1. YAML schema drift
2. Skipping deck organization

## L — Predict (ORACLE)
1. YAML → predict deck size
2. Pipeline → predict deck quality

## R — Act (GRACE)
1. New deck need → write YAML
2. Update needed → regenerate