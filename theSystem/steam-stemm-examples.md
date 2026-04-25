# STEAM / STEMM examples — by method

Each section lists **three short scenarios per lane**: **S**cience, **T**echnology, **E**ngineering, **A**rts, **M**ath, **Med**icine (clinical and first-aid style; always verify against your course, clinician, or local protocol).

Use this file when teaching the stack or building decks so examples are not only “code and exams.”

## Memorizing this method

**Helper:** [memorization-helpers.md](./memorization-helpers.md#mh-steam-stemm-examples) — NEDF/SPEAR lens, minimal first session, stack placement.


---

## Appendix: Comprehension Protocol

### Science
- **Locate → Represent:** place *mitosis* in the cell-cycle map; draw chromosome → spindle → daughter cells; state in words.
- **Minimize:** one diploid cell, one chromosome pair, one division step as the smallest true example.
- **Falsify:** what observation would break “crossing-over always increases diversity in that locus”?

### Technology
- **Locate:** where does *JWT refresh* sit vs access token in your auth stack?
- **Represent:** sequence diagram + sample header JSON + one-sentence threat model.
- **Regenerate:** sketch refresh flow from blank without docs.

### Engineering
- **Locate:** beam bending vs buckling failure modes in the syllabus tree.
- **Represent:** free-body diagram + formula + verbal “what deflects.”
- **Falsify:** when does simple beam theory lie (large deflection, composite anisotropy)?

### Arts
- **Locate:** *chiaroscuro* among lighting techniques in art history.
- **Represent:** one Caravaggio crop + one sentence + label light vs shadow vectors.
- **Minimize:** single candle, single face, single plane — smallest real composition.

### Math
- **Locate:** *ε–δ continuity* under “limits → continuity → differentiability.”
- **Represent:** graph + formal definition + counterexample sketch (Dirichlet).
- **Regenerate:** prove continuity of \(f(x)=x^2\) at a point from scratch.

### Medicine
- **Locate:** *anaphylaxis* recognition within allergic reaction spectrum.
- **Represent:** airway/skin/GI signs list + IM epinephrine step + “when to call EMS” (per your protocol).
- **Falsify:** what mimics anaphylaxis but is not (vasovagal, panic, ACE-inhibitor angioedema)? **Always pair with certified training.**

---

## Appendix: Confusion Triage

### Science
- **Prereq gap:** trying PCR before DNA structure → backfill bases, primers, polymerase role.
- **Tangled:** mixing *power* vs *energy* in circuits → separate definitions on one diagram.
- **Wrong model:** treating ocean currents as only wind-driven → add density flow.

### Technology
- **Prereq gap:** async/await before event loop mental model.
- **Tangled:** REST vs RPC both called “API” → rename layers on a map.
- **Scale mismatch:** O(n²) surprise on “small” data at 10⁷ rows.

### Engineering
- **Missing representation:** fatigue life without S–N curve picture.
- **Wrong model:** rigid-joint assumption where pins exist.
- **Prereq gap:** control volumes before Bernoulli applications.

### Arts
- **Tangled:** “modernism” vs “modernity” in one blob → time-axis + one artwork anchor each.
- **Missing representation:** atonal music without hearing one short canonical clip mapped to features.
- **Prereq gap:** color wheel before complementary-harmony claims.

### Math
- **Prereq:** quantifiers before nested “for all / exists” proofs.
- **Tangled:** covariance vs correlation language → separate formulas + toy dataset.
- **Scale:** local linearization vs global curvature on same surface.

### Medicine
- **Prereq gap:** reading ABGs before acid–base primary disorder rules.
- **Tangled:** hypoglycemia vs seizure post-ictal state without glucose story.
- **Missing representation:** rash morphology words without side-by-side atlas images.

---

## Appendix: Heuristic Palace

### Science
- **Understand:** hypothesis unclear in ecology experiment → restate variables.
- **Classify:** is this a measurement problem or mechanism problem?
- **Review:** did we test the confounder we named in Plan?

### Technology
- **Reframe:** bug as race → as invariant violation.
- **Plan:** bisect with logging hypothesis list.
- **Review:** reproduce on clean branch?

### Engineering
- **Understand:** tolerance stack-up vs material creep confusion.
- **Execute:** FMEA row → one mitigation experiment.
- **Review:** safety factor assumptions explicit?

### Arts
- **Understand:** critique says “flat” — value vs composition vs color?
- **Reframe:** narrative problem as pacing vs character want.
- **Review:** one audience test (read-aloud) result logged.

### Math
- **Understand:** stuck proof — missing lemma vs wrong approach?
- **Classify:** construction vs contradiction vs induction pattern.
- **Review:** did we use all given constraints once?

### Medicine
- **Understand:** “short of breath” — onset, exertion, pleuritic features.
- **Plan:** oxygen, monitors, call criteria per protocol card.
- **Review:** revisit after intervention timeline.

---

## Appendix: Domain Patterns

### Science
- Hypothesis–falsification pattern library for lab reports.
- “Which variable is actually manipulated?” pattern for graphs in papers.
- Confounders vs controls pattern for observational claims.

### Technology
- Leak + retry + idempotency pattern for distributed writes.
- Cache stampede / TTL jitter pattern.
- Feature-flag kill-switch pattern for risky rollouts.

### Engineering
- Factor-of-safety + worst-case load combination pattern.
- DFM: tolerance vs cost tradeoff pattern.
- Redundancy vs single-point-of-failure pattern in systems diagrams.

### Arts
- Motif–variation pattern across movements.
- Color triad vs split-complement decision pattern.
- “Scene objective” pattern for blocking (want vs obstacle per beat).

### Math
- WLOG / symmetry reduction pattern in inequalities.
- “Lift to universal cover” pattern in topology intuition decks.
- Finite vs infinite descent pattern recognition in number theory drills.

### Medicine
- **Red flags** pattern deck (e.g., thunderclap headache) with **differential buckets** — pair with instructor review.
- **Vital-signs trend** pattern (rate of change matters more than one number) — sim-lab only.
- **Handoff ISBAR**-style pattern for communication errors — course-specific wording.

---

## Appendix: TRIZ

### Science
- Time separation: long integration vs fast transient capture in sensing.
- Condition separation: same instrument, different calibration regimes.
- Space separation: remote sensing swath vs point probe on the same variable (different physical locations).

### Technology
- Separation in space: hot cache near region A, cold archive far.
- Contradiction: throughput vs latency in API design.
- Condition separation: strict schema in prod, loose in sandbox.

### Engineering
- Separation in scale: macro model vs micro FEA in corners.
- Ideality: remove a part (merge bracket functions).
- Time separation: quick prototype weld vs slow certified weld process.

### Arts
- Time separation: fast sketch pass vs slow finish pass.
- Physical contradiction: high detail vs fast iteration in concept art.
- Space separation: gallery white-cube vs site-specific installation constraints.

### Math
- Separate object vs morphism levels in category confusion.
- Contradiction: readable notation vs fully formal proof.
- Condition separation: combinatorial proof for small n, generating function for general n.

### Medicine
- Separate acute vs maintenance therapy dosing schedules.
- Contradiction: sedation vs airway protection in specific scenarios — **protocol-first.**
- Time separation: STAT labs vs routine morning draw — **per hospital policy cards.**

---

## Appendix: Metacognitive Checklist

### Science
- Caught yourself “knowing” a graph axis without reading units?
- End-session: one claim you still cannot derive?
- Logged a “beautiful chart, wrong conclusion” near-miss this week?

### Technology
- Shipped a fix you cannot explain to a junior?
- Over-trusted autocomplete without reading doc diff?
- Merged without running the one test that would have caught it?

### Engineering
- Skipped units check on hand calculation?
- Confused “looks fine in CAD” with manufacturable?
- Signed off a tolerance stack you never recomputed after a change?

### Arts
- Defended a piece without naming one audience constraint?
- Avoided critique by adding ornament instead of fixing structure?
- Compared your draft only to masters, never to a peer rubric?

### Math
- Recognized template but cannot state hypotheses?
- Hid confusion behind symbol push?
- Finished a problem set but cannot state one counterexample?

### Medicine
- Anchoring on first diagnosis before vitals trend?
- Skipped “when would I be wrong?” after triage label?
- Felt “certain” after handoff without repeating critical number back?

---

## Appendix: NEDF

### Science
- **Entropy (stat-mech view):** Name-hook + disorder Essence + vs energy-only Distinguisher + “mixed up microstates” Failure.
- **Natural selection:** Essence as differential reproduction image; Failure = group selection myth.
- **Half-life / decay:** Essence as “probability per time”; Failure = confusing activity with number of atoms.

### Technology
- **Backpressure:** Essence as producer slowing; Failure = silent buffer bloat.
- **Idempotency key:** Distinguisher vs duplicate detection only.
- **CAP theorem pick:** Essence = pick two circle; Failure = pretending all three in one partition.

### Engineering
- **Safety factor:** Failure = ductile vs brittle regime confusion.
- **Critical path:** Essence = longest zero-float chain image.
- **Lean sigma “muda”:** Essence = motion without value; Failure = relabeling busywork as value.

### Arts
- **Negative space:** Essence = shapes implied by absence; Failure = “empty = nothing.”
- **Leitmotif:** Distinguisher vs mere repetition.
- **Chiaroscuro:** Essence = light–model rivalry; Failure = global brighten slider instead of designed light.

### Math
- **Uniform continuity:** Distinguisher vs continuity at a point; Failure = bad δ choice story.
- **Eigenvector:** Essence = direction preserved; Failure = mixing with eigenvalue magnitude only.
- **Bayesian update:** Essence = pile of chips slides; Failure = ignoring base rate in story.

### Medicine
- **Sepsis bundle timing:** four slots tied to **your hospital checklist** — Failure = treating “started antibiotics” as “completed bundle.”
- **Anaphylaxis recognition:** Essence = rapid systemic; Failure = treating all urticaria as “mild allergy” without airway plan.
- **Drug–drug interaction class:** Essence = competing pathway; Failure = same enzyme story for unrelated drugs.

---

## Appendix: SPEAR

### Science
- Lab: titration sequence with **Repair** when overshoot — alternatives: back-titration.
- Field sampling: Preconditions (sterile), Execution chain, **Repair** if chain-of-custody breaks.

### Technology
- Incident response: Scene = war room; **Repair** = rollback vs hotfix branch.
- Database migration: Preconditions backups; **Alternatives** blue-green vs expand-contract.
- Phishing on work laptop: **Preconditions** air-gap assessment; **Execution** report chain; **Repair** credential rotation.

### Engineering
- **Bolt torque sequence** on flange: Execution order + **Repair** if cross-thread detected.
- Startup checklist for CNC: Preconditions coolant, RPM ramp.
- Lock-out/tag-out: **Preconditions** zero energy; **Execution** sequence; **Repair** if someone removes tag early.

### Arts
- **Printmaking edition:** Preconditions ink viscosity; **Alternatives** if paper tears.
- Stage blocking rehearsal: Execution beats; **Repair** if cue missed.
- Film set safety: **Preconditions** stunt harness check; **Alternatives** second camera angle if weather fails.

### Math
- **Induction proof template:** base, hypothesis, step — **Repair** when wrong inequality used.
- Algorithm hand-simulation: **Alternatives** if pivot zero.
- Constructive compass–straightedge: **Execution** bisection steps; **Repair** when circle intersection undefined.

### Medicine
- **Adult BLS overview** (authorized course only): Scene, Preconditions (scene safe), Execution compressions–ventilations ratio per **current AHA/ERC**, **Repair** if AED says no shock — **never substitute deck for course.**
- **Five rights** medication check as SPEAR on ward corridor (course-specific wording).
- **Stroke code activation** phone tree: **Preconditions** last known well time; **Alternatives** if CT unavailable — **protocol-only.**

---

## Appendix: Formula encoding

### Science
- Schrödinger equation zones: operators vs wavefunction slot layout.
- Ideal gas law with unit-check story in zones.

### Technology
- Big-O recurrence on blackboard scene: Master theorem as spatial zones.
- Regex composition with delimiter atoms.
- JWT header·payload·signature as three labeled zones in one scene.

### Engineering
- Beam equation \(EI \frac{d^4w}{dx^4}=q\) zone-colored.
- Control transfer function blocks as left-to-right zones.
- Mohr’s circle: stress axes as rotated coordinate zones.

### Arts
- Golden ratio grid overlaid on canvas zones in scene.
- Twelve-tone row as cyclic positional operators.
- Color wheel complementary pairs as opposing zones with harmony vector.

### Math
- Stokes’ theorem: boundary vs bulk operators in separate zones.
- Bayes formula: posterior zone “pulls” prior zone.
- Chain rule: outer/inner function zones with derivative arrows.

### Medicine
- **Parkland burn fluid** estimate (if in your scope): symbols as measured zones + **double-check card** against protocol table.
- **A-a gradient** schematic (teaching): zones for inspired vs alveolar vs arterial — **simulation pairing only.**
- Pediatric growth chart percentile bands as horizontal zone stripes (public chart practice, not patient data).

---

## Appendix: CAST and Georgian nodes

### Science
- Food web: **Dragon** edge = sudden collapse cascade; **Mermaid** = mutualism loop.
- Gene regulatory network: activation vs repression edge types.

### Technology
- Microservices: gateway → auth → service edges with **Time** bits for cache TTL semantics.
- CI pipeline: test stage **feeds** build artifact edge.
- OAuth client **secret** rotation: old secret **Dragon** expires new flows (temporal edge).

### Engineering
- HAZOP-style cause–deviation as edge scenes between nodes.
- Supply chain: inventory node **flows** material edge.
- Power grid: generator **feeds** transmission **conditional** on breaker state.

### Arts
- Influence graph: Picasso → Braque cubism edge with **Stream** = pictorial fragmentation.
- Film plot: scene A **triggers** reversal in scene B (**Dragon** temporal edge).
- Choreography: dancer A **feeds** momentum to lift B (**Mermaid** bidirectional support edge).

### Math
- Theorem dependency DAG: lemma → theorem **feeds** proof step cloud.
- Category morphisms: compose edges with **Action** strength for isomorphism vs homomorphism.
- Numerical stability: explicit scheme **feeds** error to implicit corrector (**Time** = conditional).

### Medicine
- **Clinical pathway** versioned: triage node → lab node **conditional** edge; **update** when guideline changes — keep source date on card.
- **Infection chain:** portal of entry node → immune response node with **Stream** = inflammatory signal.
- **Referral path:** PCP **feeds** consult request; specialist **returns** plan edge — label billing vs clinical urgency separately.

---

## Appendix: Major System

### Science
- Avogadro’s number chunking into Major pegs for magnitude intuition drills.
- pH 7.4 vs 7.35 encoded as paired images for rapid compare.
- Gas constant **R** digits in unit-conversion games (toy drills).

### Technology
- Port numbers 443 vs 143 as Major images in infra palace.
- Error codes `404` / `500` as pegged scenes.
- HTTP status **301** vs **302** as contrasting Major scenes on same locus pair.

### Engineering
- Standard sizes (e.g., M6, M8 bolts) as Major pairs on shop pegboard locus.
- Gauge readings within tolerance windows as number→image.
- Pipe schedule numbers (e.g., **40** vs **80**) as Major images with wall-thickness story.

### Arts
- Opus numbers / K-numbers in catalog as Major-anchored loci.
- Canvas sizes 24×36 as digit chunks.
- Edition sizes in printmaking runs (e.g., **50**) as Major on press-room peg.

### Math
- Primes list drills: Major for two-digit residues mod exercises.
- Series coefficients index rehearsal.
- Binomial coefficient small values as Major-anchored Pascal row walks.

### Medicine
- **Drug strengths** you must not confuse (e.g., metoprolol tartrate vs succinate) — Major hooks **plus** explicit **Distinguisher** card; verify with pharmacist.
- **Insulin concentration** 100 vs **U-500** (if in scope) as non-interchangeable Major pair with alarm color.
- **Pediatric weight-band dosing** table indices as Major hooks on **public** training charts only.

---

## Appendix: PAO

### Science
- Atomic number **Z=79** for gold in a mineralogy walk.
- Year **1865** Mendeleev milestone as PAO chunk in timeline.
- **pKₐ** values for three common acids in titration drills (curriculum numbers only).

### Technology
- HTTP **503** as PAO mini-scene on server rack locus.
- IPv4 private block segments practice.
- **MTU 1500** vs **jumbo 9000** as contrasting PAO pair on network closet peg.

### Engineering
- Torque values **120** N·m on spec table PAO-encoded per bolt group.
- Flight **FL350** as PAO + context.
- **Rebar #4 vs #5** diameter codes (inches implied) on concrete pour checklist locus.

### Arts
- Catalog **Op. 67** Beethoven as PAO on composer route.
- Film release **1977** as PAO in cinema palace.
- **BPM 120** vs **140** for two dance pieces in rehearsal log PAO.

### Math
- Three-digit coefficients in characteristic polynomial drill.
- combinatorics **C(10,3)=120** as computed + PAO anchor for recall speed.
- **Fibonacci F(12)=144** as PAO anchor for discrete math warmups.

### Medicine
- **Dose in mg** three-digit emergency meds (only within training scope): PAO **plus** unit check ritual on card back.
- **Adult vs pediatric defibrillator energy** step codes (training manikin labels) as PAO scenes — **never** patient-specific.
- **Glasgow scale** total range practice (training scenario scores only, not real patient totals on cards).

---

## Appendix: SEM3 and Major

### Science
- Year **1915** general relativity paper: SEM3 prefix mood + Major tail on physics timeline.
- Measurement **273** K reference with sensory cold prefix.
- **Half-life** order-of-magnitude table indices (public textbook) as SEM3+Major.

### Technology
- Release **2024** split into 20|24 chunks with smell/touch prefix + Major.
- PIN segments for non-secret drill patterns (never real secrets in examples deck).
- **Semantic version** 2.7.1 as 02|07|01 chunks on release train peg.

### Engineering
- Part numbers **4732** four-digit as SEM3+Major on warehouse shelf locus.
- Error codes **0xDEAD** split via hex elsewhere; decimal chunks here.
- **Pressure rating class** 150 vs 300 on valve tags as paired SEM3 scenes.

### Arts
- Grant IDs / accession **1842** museum catalog.
- ISBN internal chunks for memorization games (not for fraud).
- **Opus + movement** combo (e.g., 104-II) split across two loci with bridge image.

### Math
- Matrix index drills **1024** FFT sizes as 10|24 style chunking practice.
- Constants **2997** (c×10⁻⁸ order game) as mnemonic exercise only with true value on back.
- **Eigenvalue** rounded to three decimals in textbook drill as SEM3+Major rehearsal object.

### Medicine
- **Timer digits** for compressions metronome practice (training manikin session), not patient data.
- **Lab value reference notepad** (e.g., training “normal ranges” whiteboard photo) chunked as SEM3+Major — **no PHI on cards.**
- **Shift handoff times** (public schedule pattern) as four-digit chunks for habit building, not patient identifiers.

---

## Appendix: Peg Matrix

### Science
- Ordered reagents shelf positions 00–09 on audio×visual peg grid.
- Geologic epochs index on peg matrix + story.
- **Taxonomy ranks** (KPCOFGS) pegged 00–07 on one row.

### Technology
- API version ordering 01–09 feature flags list.
- VLAN id short lists in peg cells.
- **OAuth grant type** short list (authorization_code, client_credentials, …) on pegs for interview prep.

### Engineering
- QC checklist 10 steps on first ten pegs.
- Torque-pass sequence peg grid.
- **LOTO** six-step generic sequence pegged (OSHA-style public outline, not site-specific).

### Arts
- Exhibition room order on pegs.
- Palette mixing order pegged.
- **Sonata form** sections (exposition → development → recapitulation) on three pegs.

### Math
- Proof case split into 9 subcases on peg positions.
- Algorithm step index 00–09.
- **Integration by parts** “LIATE” letter order on pegs (mnemonic only, with full rule card).

### Medicine
- **Primary survey** order pegged (only as memory aid next to formal algorithm card).
- **Sample type tubes** color order on pegs for phlebotomy class (curriculum photo deck).
- **Medication administration sequence** pegs for skills lab checklist — parallel paper checklist required.

---

## Appendix: Binary and hex

### Science
- Register bitfields for instrument status flags as 4-bit elemental scenes.
- Genetics bitmask punnett-style exercises (toy).
- **Spectral lines** “on/off” flags in public spectrum charts as bit patterns (conceptual).

### Technology
- File permission bits `rwx` as expanded nibble story.
- Color `#RRGGBB` as paired hex nibbles.
- **TCP flags** SYN/ACK/FIN as 6-bit story on one training diagram.

### Engineering
- CAN bus ID masks as bitfield scenes.
- PLC input bank as two-nibble stack.
- **Fault code** bit maps in public service manual tables (no live equipment).

### Arts
- **8-bit palette** constraints in pixel art challenge as elemental scenes.
- DMX channel blocks.
- **MIDI status nibbles** (note on/off, CC) as hex-element walk for music-tech class.

### Math
- Subset bitmask DP on small n as hex walk.
- Galois field toy tables.
- **Truth-table** rows 000–111 as 3-bit index for logic homework speed.

### Medicine
- **Monitor bitmask** alarms (training sim): which lights imply which action — **simulator-linked**, not self-invented.
- **Isolation precaution levels** toy bitmask for infection control exam (public MCQ deck).
- **Allergen warning icon flags** on packaged-food UI as nibble practice (consumer literacy, not diagnosis).

---

## Appendix: Mind Palace

### Science
- Museum wing = organic chemistry functional groups along windows.
- Lab bench left-to-right = protocol phases.
- **Field site** trail: outcrop order = stratigraphic units you studied on trip.

### Technology
- Office floorplan = microservice palace zones.
- Home office wall = CI stages.
- **Cable tray** path under desk = packet journey from NIC to router (conceptual).

### Engineering
- Shop floor real route = assembly order palace.
- Crane cab sequence = safety checks loci.
- **Pipeline corridor** walk = flange torque sequence on real maintenance route (authorized).

### Arts
- Gallery walk = art history periods per room.
- Theater backstage path = play act structure.
- **Recording studio** signal path: mic → pre → interface as room-to-room palace.

### Math
- Department corridor = courses per door; theorems inside offices.
- “Book shelf” palace = chapters left-to-right.
- **Whiteboard wall** in study room = lemma chain left-to-right for one exam topic.

### Medicine
- **Hospital unit layout** (only if HIPAA-safe / public schematic): med room → supply → charting as **non-PHI** procedural loci.
- **Skills lab bay** walk: PPE donning order on real bay layout you train in.
- **Home first-aid drawer** spatial map: gauze → tape → antiseptic as non-prescriptive organization drill.

---

## Appendix: Retrieval Protocol

### Science
- NEDF card + cloze on **Failure** slot for common misconception.
- Weekly palace walk of experiment sequence.
- **Interleaved** retrieval: alternate two lab methods same session to mimic exam mix.

### Technology
- CAST edge cards with timed **<5s** palace segment.
- Split card when two services share same animal image (**collision** repair).
- **Blind** recall: cover architecture diagram, redraw from palace in 2 minutes.

### Engineering
- Formula cards with reverse “symptom → equation.”
- Timed walk of torque SPEAR chain before audit.
- **Pre-flight** retrieval: verbalize entire checklist from memory before touching tools.

### Arts
- Portfolio review: random locus → piece statement in 10s.
- REMAPS repair: add sound layer to dim painting mnemonic.
- **Speed dating** critiques: 30s per piece from random peg without notes.

### Math
- Proof template cards + weekly regenerate pass.
- Error log tag `#weak-induction` batch repair day.
- **Mixed problem set** day: no topic tags on cards until after answer.

### Medicine
- **Skills checklists** as short-answer cards tied to **sim day**; suspend deck after expiry per policy.
- **Drug–drug interaction** class deck: retrieve mechanism class, then open reference — cards are cues, not prescribing authority.
- **Anatomy lab** structure retrieval from public atlas labels only (no donor photos on personal cards).

---

## Appendix: Collisions

### Science
- Same ram image for **R**am resistor vs RAM chip → role tag `#electronics` vs `#computing`.
- Shared volcano for eruption vs geothermal plant → palace partition.
- Same **mercury** for planet vs element → add thermometer vs telescope **Distinguisher**.

### Technology
- Duplicate docker whale vs DB whale → environment slot override per `collisions.md`.
- Same wizard for OAuth vs ML “wizard” → costume tweak.
- Same **key** icon for API key vs SSH key → label + color split on card back.

### Engineering
- Same bolt image for metric vs imperial thread → **Distinguisher** bolt head angle scene.
- Same **gauge** dial for pressure vs vacuum → add “PSI” vs “inHg” text prop in scene.
- Same **valve** wheel for isolation vs throttle → different handle color in mnemonic only.

### Arts
- Same sun motif for Impressionism vs solar physics → room boundary.
- Same **rose** for War of Roses history vs still-life genre → era costume on figure.
- Same **bridge** motif for Schenker graph vs civil engineering → staff paper texture overlay.

### Math
- Same “ring” for algebraic ring vs jewelry → notation card color.
- Same **graph** for graph theory vs chart plot → discrete nodes vs smooth curve silhouette.
- Same **norm** for vector norm vs social norm joke → double bar vs speech bubble.

### Medicine
- **Never** share props between **two drug classes** without strong disambiguator — use protocol color tags.
- Same **syringe** image for IM vs SubQ teaching → angle-of-entry diagram on **Distinguisher** side.
- Same **heart** icon for **CHF** teaching deck vs **MI** deck → add “preload” vs “ischemia” tag (curriculum-level only).

---

## Appendix: Measurement Framework

### Science
- **Depth:** max derivation chain you can cold-reconstruct for one law.
- **Application:** lab behavior change after concept deck.
- **Transfer:** explain same principle to a friend using a different domain analogy (record one paragraph).

### Technology
- **Speed:** median Anki time on CAST cards.
- **Process:** % sessions hitting comprehension gates before new NEDF.
- **Durability:** week-later bugfix without reopening notes for same subsystem.

### Engineering
- **Durability:** 30-day recall on tolerance stack cards.
- **Accuracy:** first-try pass on safety checklist walk.
- **Application:** one real assembly or inspection signed off after mnemonic-only rehearsal.

### Arts
- **Application:** pieces shipped / critiques integrated per month.
- **Process:** metacognitive catches of “pretty but empty.”
- **Depth:** articulate **one** intentional constraint (palette, form, meter) per finished piece.

### Math
- **Depth:** max theorem network size cold.
- **Speed:** palace walk time for proof skeleton.
- **Application:** solve **n** unseen problems tagged to that network per week.

### Medicine
- **Process:** % cards with `#needs-rewrite` after guideline update — **governance**, not ego.
- **Accuracy:** checklist verbalization matches **instructor** rubric on skills day, not self-grade alone.
- **Ethics:** zero PHI on personal devices; audit flashcard export quarterly if policy requires.

---

## Appendix: NAVIGATOR

### Science
- **Narrow:** “pass thermo midterm with B+ and ≤6h/week.” **Act:** timed past-paper artifact.
- **View:** diagram entropy balance for three standard cycles; **Imprint:** one SPEAR chain per cycle.

### Technology
- **Narrow:** ship feature X with rollback story. **Thread:** update cross-team architecture note.
- **Gym:** chaos day table-top; **Recalibrate:** postmortem doc linked from CAST root.

### Engineering
- **Narrow:** PE exam section mastery with stop rule. **Outline:** one-page formula sheet distilled.
- **Acquire:** source three worked failures from NCEES-style public problems; **Act:** timed set.

### Arts
- **Narrow:** solo recital program memorized + anxiety cap. **Act:** dress rehearsal recording.
- **Thread:** log which passages needed **Gym** repeats; **Outline:** one-page performance map.

### Math
- **Narrow:** qualify for olympiad section Y. **Gym:** daily inequality drill log.
- **View:** error taxonomy on last 20 misses; **Recalibrate:** swap one weak heuristic monthly.

### Medicine
- **Narrow:** pass ACLS renewal with ≥90% sim checks. **Act:** manikin timed scenario — **course outcome**, not self-graded fantasy.
- **Acquire:** guideline diffs from **published** updates only; **Imprint:** delta cards with effective dates.
- **Outline:** one-page **BLS + ACLS** flow merge for personal study sheet where course allows.

---

## Appendix: Onboarding path

### Science
- **Minimal:** 10 new cards/day + one lab-safety peg route.
- **Mid:** NEDF five real biology concepts + SEM3 chunk cold.
- **Maximal:** one measurement “depth week” per unit + retire cards that fail comprehension gate.

### Technology
- **Minimal:** one palace + Major bootstrap; CAST three real service edges mid-level.
- **Maximal:** CAST graph month + collision audit on shared props.
- **Mid:** retrieval protocol + comprehension gate on every new NEDF batch before scaling volume.

### Engineering
- **Mid:** binary-hex elemental 16 scenes + SPEAR one assembly SOP.
- **Maximal:** quarterly measurement LPQ + retire dead palace loci after refactor.
- **Minimal:** one peg matrix for **tool crib** IDs you actually touch weekly.

### Arts
- **Minimal:** memorize 8-locus critique vocabulary chain.
- **Mid:** domain pattern library for composition moves (25 patterns).
- **Maximal:** monthly **Act** artifact (recording, draft chapter, shipped design) tied to palace review.

### Math
- **Minimal:** Major 00–19 then expand; one proof SPEAR chain.
- **Maximal:** measurement depth challenge monthly.
- **Mid:** collision audit on overloaded symbols (Σ uses) across courses.

### Medicine
- **Minimal:** only **non-patient** generic facts until curriculum allows; freeze new cards during wards overload per onboarding under-load policy.
- **Mid:** procedure encoding for **skills lab** sequences you have actually practiced.
- **Maximal:** NAVIGATOR-aligned **sim week** with measurement rubric from course; no parallel unsanctioned “patient” decks.

---

## Appendix: Georgian system

### Science
- 33-letter peg for **33 amino acids** order drill (advanced biochem game).
- Month anchors for field season schedules.
- Elements **Z = 1 … 33** (hydrogen through arsenic) on a letter path for periodic-table “map of the table” drills — verify with standard table.

### Technology
- 33 modules in legacy codebase mapped to letters for CAST node identity.
- Release month + day Major combo for ship dates.
- **33 CLI flags** or config keys you actually ship, letter-tagged for on-call recall.

### Engineering
- 33 inspection stations on plant walk (if ≤33 stable stops).
- Rotating equipment checklist keyed to letters.
- **33 torque steps** on a documented multi-pass pattern (if real count matches; else use fewer letters honestly).

### Arts
- 33 scenes in anthology memory tour.
- Exhibition sequence keyed to alphabet mnemonic you already use.
- **33 shots** in storyboard act (if real) as Georgian path through film pre-viz.

### Math
- 33 proof lemmas list on letter path for one big theorem network.
- Contest problems bucketed to 33 heuristics.
- **33 special functions** or named inequalities in one reference sheet (public) as peg index.

### Medicine
- **Public teaching aid only:** e.g., 12 cranial nerves often taught as 12, not 33 — adapt count honestly; do not force 33 where anatomy does not.
- **Mnemonic acronyms** (public, e.g., **FAST** for stroke screen) mapped onto Georgian letters you already use for other decks — separate palace room.
- **Skills checklist ≤20 steps** letter-keyed when real procedure shorter than 33; pad with **non-clinical** meta-steps (e.g., “wash hands”) only if instructor approves.

---

## Appendix: Encoding examples

Cross-reference: when filling `encoding-examples.md` drills, use **all six lanes** — not only “random digits.”

### Science
- Encode **instrument readout** sequences from lab manual photos (no live patient data).
- **Weather station** logs: pressure/temp/humidity triples as digit chunks.
- **Star catalog** magnitudes for a small constellation as encoding warmups.

### Technology
- **Git SHA** prefixes (public repos) as hex/digit mixed encoding games.
- **Semver + build** strings from CI logs as procedure-encoding fodder.
- **MAC OUI** prefixes (vendor public lists) as six-hex pair drills.

### Engineering
- **Part + revision** stamps from datasheet photos as structured chunks.
- **Bolt callout** strings (diameter-length-grade) as mixed alphanumeric encoding.
- **Load tag** capacities from crane training posters (public).

### Arts
- **Opus / catalogue raisonné** numbers as numeric encoding chains.
- **Frame aspect ratios** (16:9, 2.39:1) as rational-number encoding practice.
- **Tempo + meter** pairs (120/4, 60/3) as small integer encoding sets.

### Math
- **Taylor coefficients** to fixed order as signed decimal encoding (textbook only).
- **OEIS** sequence IDs for puzzles as pure-number drills.
- **Matrix entries** from published worked examples as row-major encoding walks.

### Medicine
- **Manikin scenario timer** splits (e.g., 2:00 cycles) as time encoding only in class.
- **Synthetic vital** sets from exam prep books — label every card “synthetic.”
- **Public drug info** dosing *ranges* as structure practice — never encode a real person’s dose.

---

## Appendix: CAST beginner bilingual

Bilingual CAST rows memorize **edge vocabulary** (Subject–Verb–Object in two languages) while keeping **STEAM / STEMM** variety.

### Science
- Edge: **mitochondrion → produces → ATP** in L1 and L2 on the same card row.
- Edge: **chlorophyll → absorbs → photon** with color cue on the arrow.
- Edge: **neuron → releases → neurotransmitter** with synapse mini-diagram.

### Technology
- Edge: **client → requests → token** with OAuth grant type on arrow label.
- Edge: **cache → reduces → latency** with TTL note on object.
- Edge: **container → isolates → process** with namespace keyword on card.

### Engineering
- Edge: **beam → carries → moment** with simple diagram and units on edge.
- Edge: **valve → controls → flow** with CV vs travel note if syllabus uses it.
- Edge: **sensor → feeds → PLC** with analog vs digital tag.

### Arts
- Edge: **director → blocks → scene** with rehearsal vs performance note.
- Edge: **palette → limits → hue** with constraint name (e.g., “Zorn”).
- Edge: **motif → returns → finale** with measure range on arrow.

### Math
- Edge: **lemma → implies → theorem** with proof strategy tag on arrow.
- Edge: **matrix → maps → vector** with ℝⁿ dimension on object nodes.
- Edge: **series → converges → limit** with test name (ratio, root) on edge.

### Medicine
- Edge: **alveolus → exchanges → O₂** (teaching only) with diffusion direction arrow.
- Edge: **vaccine → presents → antigen** (immunology class) with APC note — **no patient identifiers**.
- Edge: **checklist → precedes → procedure** for **skills lab** only, parallel to instructor sheet.

---

## Appendix: Design orientation

Pair each pillar in `design-orientation.md` with one **Imprint** card and one **Act** per month. Hooks below are **STEAM / STEMM**-spaced so practice is not only “STEM trivia.”

### Science
- **Life/EQ:** log one stress cue (sleep, caffeine, breathing) before/after a hard study block — self-observation only.
- **Digital:** before sharing a health claim, add one link to a **primary** or institutional source in the post.
- **Practical:** fermentation or food-safety temperature band you actually use at home on one fridge card.

### Technology
- **Digital:** ship one privacy-preserving default in a personal project (no extra telemetry).
- **Practical:** automate one bill or backup reminder with a tool you can explain to a non-expert.
- **Global citizenship:** document data residency or jurisdiction on one CAST edge you maintain.

### Engineering
- **Practical:** one physical repair or build with a written tolerance or torque check you performed.
- **Life/EQ:** frustration stop rule — one palace walk before retrying a stuck assembly.
- **Digital:** semantic commit or change note on one CAD/config revision a teammate could follow.

### Arts
- **Life/EQ:** short journal **Act** after intense news or fiction — name one emotion + one boundary.
- **Practical:** finish one small piece under a declared constraint (time, palette, form).
- **Global:** credit or permission note for every sample/reference in that piece’s README or liner notes.

### Math
- **Digital:** verify axes, sample size, and units on one chart before reposting.
- **Practical:** household budget sensitivity table with parameters you actually control.
- **Global:** work one public-course fairness or allocation toy problem and state assumptions aloud.

### Medicine
- **Ethics / consent:** no recording in sim or clinic without written policy — memorize rule as CAST edge, not as gossip.
- **Practical:** restock home first-aid from a **public** checklist image; date the kit on the box.
- **Digital:** institution-approved channel only for anything clinical — card: **policy → constrains → channel**.
