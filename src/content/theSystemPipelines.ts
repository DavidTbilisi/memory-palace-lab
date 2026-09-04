export type TheSystemPipelineCategory =
  | "Learning Loop"
  | "Comprehension"
  | "Problem Solving"
  | "Document";

export type TheSystemPipelineStep = {
  id: string;
  code: string;
  title: string;
  prompt: string;
  placeholder: string;
  hint: string;
  nextLabel?: string;
};

export type TheSystemPipelineTemplate = {
  id: string;
  category: TheSystemPipelineCategory;
  title: string;
  shortTitle: string;
  summary: string;
  recommendedFor: string;
  routeName: string;
  overviewLabel: string;
  docsSlug: string;
  steps: TheSystemPipelineStep[];
};

export const THE_SYSTEM_PIPELINES: TheSystemPipelineTemplate[] = [
  {
    id: "navigator",
    category: "Learning Loop",
    title: "NAVIGATOR",
    shortTitle: "NAVIGATOR",
    summary:
      "A project-scale loop for turning a topic into durable understanding, practice, transfer, and compression.",
    recommendedFor:
      "Courses, new domains, certification prep, codebases, and any long learning arc.",
    routeName: "NAVIGATOR run",
    overviewLabel: "Learning contract",
    docsSlug: "navigator",
    steps: [
      {
        id: "narrow",
        code: "N",
        title: "Narrow",
        prompt:
          "What exactly are you learning or solving, what depth is enough, and what is the stop rule?",
        placeholder:
          "Define the contract, stop rule, success test, constraints, and expected return.",
        hint: "Border the work so effort does not sprawl into vague study.",
        nextLabel: "sources",
      },
      {
        id: "acquire",
        code: "A",
        title: "Acquire",
        prompt:
          "Which sources, examples, and dependency map will you trust for this run?",
        placeholder:
          "List the primary source, contrasting source, practice source, and key prerequisites.",
        hint: "Pick signal, not volume.",
        nextLabel: "structure",
      },
      {
        id: "view",
        code: "V",
        title: "View",
        prompt:
          "How does the material break into claims, relations, patterns, and edge cases?",
        placeholder:
          "Write the rough map: primitives, operators, dependencies, failure points, canonical example.",
        hint: "View structure before encoding details.",
        nextLabel: "encode",
      },
      {
        id: "imprint",
        code: "I",
        title: "Imprint",
        prompt:
          "What should be encoded into durable retrieval objects right now?",
        placeholder:
          "Capture the concepts, procedures, formulas, or scenes that deserve memory support.",
        hint: "Only encode what already cleared comprehension.",
        nextLabel: "drill",
      },
      {
        id: "gym",
        code: "G",
        title: "Gym",
        prompt:
          "What drill isolates the current bottleneck and how will you log errors?",
        placeholder:
          "Define a short drill, pass rule, repetition count, and the failure pattern to track.",
        hint: "Train the weak link, not everything evenly.",
        nextLabel: "apply",
      },
      {
        id: "act",
        code: "A",
        title: "Act",
        prompt: "What concrete artifact or mission will prove transfer?",
        placeholder:
          "Describe the bugfix, explanation, proof, conversation, or output that shows this works in the real world.",
        hint: "Recognition is not transfer. Produce something external.",
        nextLabel: "connect",
      },
      {
        id: "thread",
        code: "T",
        title: "Thread",
        prompt:
          "Where does this connect to the larger graph of things you already know?",
        placeholder:
          "List adjacent domains, reusable primitives, and other nodes this should link to.",
        hint: "Thread the work into the rest of the palace.",
        nextLabel: "compress",
      },
      {
        id: "outline",
        code: "O",
        title: "Outline",
        prompt:
          "What compressed representation will let you review this fast later?",
        placeholder:
          "Create the cheat sheet, one-pager, atomic note set, or review route summary.",
        hint: "Compress without flattening the structure.",
        nextLabel: "tune",
      },
      {
        id: "recalibrate",
        code: "R",
        title: "Recalibrate",
        prompt:
          "What changed, what should be pruned, and what one variable will you adjust next?",
        placeholder:
          "Write the retro: what worked, what failed, what to stop, and the single next adjustment.",
        hint: "Change one variable at a time so you can tell what moved the needle.",
      },
    ],
  },
  {
    id: "comprehension",
    category: "Comprehension",
    title: "Comprehension Protocol",
    shortTitle: "Comprehension",
    summary:
      "A gate-based protocol for understanding a hard concept before you try to encode or memorize it.",
    recommendedFor:
      "Technical concepts, dense reading, lectures, proofs, and first-pass understanding.",
    routeName: "Comprehension run",
    overviewLabel: "Concept target",
    docsSlug: "comprehension-protocol",
    steps: [
      {
        id: "locate",
        code: "1",
        title: "Locate",
        prompt:
          "Where does this concept live, what problem does it solve, and what are its neighbors?",
        placeholder:
          "Place it on the map: field, subfield, parent idea, nearby ideas, and use-case.",
        hint: "If you cannot place it, you are probably missing prerequisites.",
        nextLabel: "represent",
      },
      {
        id: "represent",
        code: "2",
        title: "Represent",
        prompt: "Can you express this in at least three forms?",
        placeholder:
          "Write the verbal, symbolic, geometric, computational, adversarial, or extreme-case versions.",
        hint: "One representation is recognition. Multiple representations are understanding.",
        nextLabel: "minimize",
      },
      {
        id: "minimize",
        code: "3",
        title: "Minimize",
        prompt:
          "What is the minimum working example that still exhibits the phenomenon?",
        placeholder:
          "Find the smallest example and describe what breaks if you simplify one step further.",
        hint: "The minimum example exposes the essential mechanism.",
        nextLabel: "falsify",
      },
      {
        id: "falsify",
        code: "4",
        title: "Falsify",
        prompt:
          "How would this fail, where are the edges, and what almost-but-not-quite version looks similar?",
        placeholder:
          "Record counterexamples, boundary cases, wrong versions, and scope limits.",
        hint: "Failure modes sharpen the concept faster than passive rereading.",
        nextLabel: "regenerate",
      },
      {
        id: "regenerate",
        code: "5",
        title: "Regenerate",
        prompt: "Can you derive or rebuild it from scratch without looking?",
        placeholder:
          "Write the blank-page reconstruction path and note the exact step where you fail, if you fail.",
        hint: "Regeneration is the real comprehension test.",
        nextLabel: "apply",
      },
      {
        id: "apply",
        code: "6",
        title: "Apply",
        prompt:
          "What real task will you use within 48 hours so the concept does not decay?",
        placeholder:
          "Choose the exercise, proof, explanation, bugfix, or design decision where you will use it.",
        hint: "Application closes the loop and reveals whether the concept survived contact with reality.",
      },
    ],
  },
  {
    id: "heuristic-palace",
    category: "Problem Solving",
    title: "Heuristic Palace",
    shortTitle: "Heuristic Palace",
    summary:
      "A six-room problem-solving walk for when you understand the situation but do not yet see the next move.",
    recommendedFor:
      "Bugs, puzzles, proofs, strategy questions, and design decisions under uncertainty.",
    routeName: "Heuristic run",
    overviewLabel: "Problem target",
    docsSlug: "heuristic-palace",
    steps: [
      {
        id: "understand",
        code: "1",
        title: "Understand",
        prompt:
          "What is actually being asked, what are the givens, and what does done look like?",
        placeholder:
          "Restate the problem, list givens vs assumptions, define hard constraints, and define success.",
        hint: "Staring at a blurry problem only compounds waste.",
        nextLabel: "reframe",
      },
      {
        id: "reframe",
        code: "2",
        title: "Reframe",
        prompt: "How else could this be seen?",
        placeholder:
          "Invert it, find an analogy, zoom in/out, work backward, or steelman the opposite.",
        hint: "A different frame often collapses the search space.",
        nextLabel: "classify",
      },
      {
        id: "classify",
        code: "3",
        title: "Classify",
        prompt:
          "What genus of problem is this and which structural features dominate?",
        placeholder:
          "Name the class: search, optimization, proof, design, strategy, causal, constraint, etc.",
        hint: "Correct classification is usually faster than more brute force.",
        nextLabel: "plan",
      },
      {
        id: "plan",
        code: "4",
        title: "Plan",
        prompt:
          "Which moves are available and which one is the smallest credible next attempt?",
        placeholder:
          "Pick the patterns, invariants, simplifications, decompositions, or experiments you will try.",
        hint: "Choose a move, not a mood.",
        nextLabel: "execute",
      },
      {
        id: "execute",
        code: "5",
        title: "Execute",
        prompt:
          "How will you run the attempt cleanly and what checkpoints will you verify?",
        placeholder:
          "Define the smallest working version, checkpoints, timebox, and current error log.",
        hint: "Execution without checkpoints turns debugging into fog.",
        nextLabel: "review",
      },
      {
        id: "review",
        code: "6",
        title: "Review",
        prompt:
          "What actually worked, what failed, and what pattern should your future self remember?",
        placeholder:
          "Write the result, the graveyard of failed moves, the generalization, and the next-time delta.",
        hint: "A solved problem is wasted if it does not become a reusable pattern.",
      },
    ],
  },
  {
    id: "how-to-learn-a-language",
    category: "Comprehension",
    title: "How to Learn a Language",
    shortTitle: "How to Learn a Language",
    summary: "French, zero → B2 — and where Busuu fits",
    recommendedFor:
      'Spaced recall of "How to Learn a Language" — one locus per walkthrough step, in Bloom order.',
    routeName: "How to Learn a Language walk",
    overviewLabel: "Walkthrough spine",
    docsSlug: "how-to-learn-a-language",
    steps: [
      {
        id: "the-mental-model",
        code: "TM",
        title: "The mental model",
        prompt:
          'Recall "The mental model" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "A language is grown, not built like a wall. You supply the right conditions — input you can almost understand — and competence grows on its own. The whole system is one input engine feeding a stack of acquired skills; the apps are a side dish.",
        nextLabel: "understand",
      },
      {
        id: "acquisition-learning",
        code: "AL",
        title: "Acquisition ≠ learning",
        prompt:
          'Recall "Acquisition ≠ learning" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "A swimming textbook never keeps you afloat — only time in the pool does. Busuu is the textbook: explicit learning of words and rules, which lives in conscious memory and surfaces only when you have time to think. Fluent speech runs on acquired language — built silently from input. That gap is why Busuu alone stalls around A2/B1.",
        nextLabel: "understand",
      },
      {
        id: "the-goldilocks-window-i-1",
        code: "TG",
        title: "The Goldilocks window (i+1)",
        prompt:
          'Recall "The Goldilocks window (i+1)" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "Input has to be just right: you recognise 95–98% of the words, so the unknown ≤5% — the i+1 — is guessable from context. Below ~90% you are drowning and flip into slow lookup-translate (the wrong system); at 100% there is nothing new to absorb. A tool like meter iplus1 scores any French text against your known-word list and bands it.",
        nextLabel: "understand",
      },
      {
        id: "the-affective-filter",
        code: "TA",
        title: "The affective filter",
        prompt:
          'Recall "The affective filter" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "Think of a valve between the input and your brain. Stress, anxiety, and self-consciousness close it — input arrives but never reaches the acquisition system (stress suppresses BDNF, the growth signal). So on a high-stress day (PULSE S ≥ 4) the rule is: drop hard study, do low-stakes passive input you enjoy. A relaxed learner acquires; a tense one just suffers.",
        nextLabel: "understand",
      },
      {
        id: "70-30-and-volume-wins",
        code: "73",
        title: "70 / 30, and volume wins",
        prompt:
          'Recall "70 / 30, and volume wins" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "Mostly water, a little fertiliser. 70% of your time is comprehensible input; 30% is explicit encoding — the only slot Busuu fills. And one long soak beats six sprinkles: acquisition tracks hours, not number of sessions. 90 focused minutes of input outrun six 15-minute app streaks.",
        nextLabel: "understand",
      },
      {
        id: "one-stack-ten-layers",
        code: "OS",
        title: "One stack, ten layers",
        prompt:
          'Recall "One stack, ten layers" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "The competence you are growing is not one blob — it is a stack: phonology, lexicon, grammar, production, pragmatics, and more. The winning move is to compose, not replace: keep your frameworks and add the missing layers. Busuu covers lexicon + some grammar; the rest — especially phonology at the base — it never touches.",
        nextLabel: "apply",
      },
      {
        id: "predict-the-zone",
        code: "PT",
        title: "Predict the zone",
        prompt:
          'Recall "Predict the zone" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "You open a French article and recognise about 85% of the words. Which zone are you in?",
        nextLabel: "apply",
      },
      {
        id: "pick-the-missing-layer",
        code: "PI",
        title: "Pick the missing layer",
        prompt:
          'Recall "Pick the missing layer" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "You are stuck at A2 on Busuu (vocab + grammar covered). Of the layers Busuu never touches, which is the highest-value one to add first?",
        nextLabel: "apply",
      },
      {
        id: "the-hardest-french-sound",
        code: "TH",
        title: "The hardest French sound",
        prompt:
          'Recall "The hardest French sound" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "You start phonology training. Which contrast will most often collapse for an English ear — the one to drill first?",
        nextLabel: "analyze",
      },
      {
        id: "spend-the-hour",
        code: "ST",
        title: "Spend the hour",
        prompt:
          'Recall "Spend the hour" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "Trade-off time. You have 1 hour a day. Pour it all into Busuu, or split it 40 min comprehensible input + 20 min Busuu?",
        nextLabel: "analyze",
      },
      {
        id: "when-to-start-speaking",
        code: "WT",
        title: "When to start speaking",
        prompt:
          'Recall "When to start speaking" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "You want B2 speaking. Should you force daily output from week one, or bias hard toward input first and let speech emerge?",
        nextLabel: "synthesize",
      },
      {
        id: "where-this-generalizes",
        code: "WH",
        title: "Where this generalizes",
        prompt:
          'Recall "Where this generalizes" — what did this step teach, and what comes next?',
        placeholder: "Say it from memory, then reveal the cue to check.",
        hint: "The whole stack is one idea: [[comprehensible-input-protocol]] is the engine, justified by [[krashen-sla-hypotheses]]. It composes — not replaces — your existing frameworks in the [[language-learning-architecture]], and the first missing layer to build for French is the [[l2-phonology-gym]]. Keep Busuu — just demote it to the 30% slot and let input do the heavy lifting. Then export this route to your palace and review it cold.",
      },
    ],
  },
];
