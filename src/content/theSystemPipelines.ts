export type TheSystemPipelineCategory = "Learning Loop" | "Comprehension" | "Problem Solving";

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
    recommendedFor: "Courses, new domains, certification prep, codebases, and any long learning arc.",
    routeName: "NAVIGATOR run",
    overviewLabel: "Learning contract",
    docsSlug: "navigator",
    steps: [
      {
        id: "narrow",
        code: "N",
        title: "Narrow",
        prompt: "What exactly are you learning or solving, what depth is enough, and what is the stop rule?",
        placeholder: "Define the contract, stop rule, success test, constraints, and expected return.",
        hint: "Border the work so effort does not sprawl into vague study.",
        nextLabel: "sources",
      },
      {
        id: "acquire",
        code: "A",
        title: "Acquire",
        prompt: "Which sources, examples, and dependency map will you trust for this run?",
        placeholder: "List the primary source, contrasting source, practice source, and key prerequisites.",
        hint: "Pick signal, not volume.",
        nextLabel: "structure",
      },
      {
        id: "view",
        code: "V",
        title: "View",
        prompt: "How does the material break into claims, relations, patterns, and edge cases?",
        placeholder: "Write the rough map: primitives, operators, dependencies, failure points, canonical example.",
        hint: "View structure before encoding details.",
        nextLabel: "encode",
      },
      {
        id: "imprint",
        code: "I",
        title: "Imprint",
        prompt: "What should be encoded into durable retrieval objects right now?",
        placeholder: "Capture the concepts, procedures, formulas, or scenes that deserve memory support.",
        hint: "Only encode what already cleared comprehension.",
        nextLabel: "drill",
      },
      {
        id: "gym",
        code: "G",
        title: "Gym",
        prompt: "What drill isolates the current bottleneck and how will you log errors?",
        placeholder: "Define a short drill, pass rule, repetition count, and the failure pattern to track.",
        hint: "Train the weak link, not everything evenly.",
        nextLabel: "apply",
      },
      {
        id: "act",
        code: "A",
        title: "Act",
        prompt: "What concrete artifact or mission will prove transfer?",
        placeholder: "Describe the bugfix, explanation, proof, conversation, or output that shows this works in the real world.",
        hint: "Recognition is not transfer. Produce something external.",
        nextLabel: "connect",
      },
      {
        id: "thread",
        code: "T",
        title: "Thread",
        prompt: "Where does this connect to the larger graph of things you already know?",
        placeholder: "List adjacent domains, reusable primitives, and other nodes this should link to.",
        hint: "Thread the work into the rest of the palace.",
        nextLabel: "compress",
      },
      {
        id: "outline",
        code: "O",
        title: "Outline",
        prompt: "What compressed representation will let you review this fast later?",
        placeholder: "Create the cheat sheet, one-pager, atomic note set, or review route summary.",
        hint: "Compress without flattening the structure.",
        nextLabel: "tune",
      },
      {
        id: "recalibrate",
        code: "R",
        title: "Recalibrate",
        prompt: "What changed, what should be pruned, and what one variable will you adjust next?",
        placeholder: "Write the retro: what worked, what failed, what to stop, and the single next adjustment.",
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
    recommendedFor: "Technical concepts, dense reading, lectures, proofs, and first-pass understanding.",
    routeName: "Comprehension run",
    overviewLabel: "Concept target",
    docsSlug: "comprehension-protocol",
    steps: [
      {
        id: "locate",
        code: "1",
        title: "Locate",
        prompt: "Where does this concept live, what problem does it solve, and what are its neighbors?",
        placeholder: "Place it on the map: field, subfield, parent idea, nearby ideas, and use-case.",
        hint: "If you cannot place it, you are probably missing prerequisites.",
        nextLabel: "represent",
      },
      {
        id: "represent",
        code: "2",
        title: "Represent",
        prompt: "Can you express this in at least three forms?",
        placeholder: "Write the verbal, symbolic, geometric, computational, adversarial, or extreme-case versions.",
        hint: "One representation is recognition. Multiple representations are understanding.",
        nextLabel: "minimize",
      },
      {
        id: "minimize",
        code: "3",
        title: "Minimize",
        prompt: "What is the minimum working example that still exhibits the phenomenon?",
        placeholder: "Find the smallest example and describe what breaks if you simplify one step further.",
        hint: "The minimum example exposes the essential mechanism.",
        nextLabel: "falsify",
      },
      {
        id: "falsify",
        code: "4",
        title: "Falsify",
        prompt: "How would this fail, where are the edges, and what almost-but-not-quite version looks similar?",
        placeholder: "Record counterexamples, boundary cases, wrong versions, and scope limits.",
        hint: "Failure modes sharpen the concept faster than passive rereading.",
        nextLabel: "regenerate",
      },
      {
        id: "regenerate",
        code: "5",
        title: "Regenerate",
        prompt: "Can you derive or rebuild it from scratch without looking?",
        placeholder: "Write the blank-page reconstruction path and note the exact step where you fail, if you fail.",
        hint: "Regeneration is the real comprehension test.",
        nextLabel: "apply",
      },
      {
        id: "apply",
        code: "6",
        title: "Apply",
        prompt: "What real task will you use within 48 hours so the concept does not decay?",
        placeholder: "Choose the exercise, proof, explanation, bugfix, or design decision where you will use it.",
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
    recommendedFor: "Bugs, puzzles, proofs, strategy questions, and design decisions under uncertainty.",
    routeName: "Heuristic run",
    overviewLabel: "Problem target",
    docsSlug: "heuristic-palace",
    steps: [
      {
        id: "understand",
        code: "1",
        title: "Understand",
        prompt: "What is actually being asked, what are the givens, and what does done look like?",
        placeholder: "Restate the problem, list givens vs assumptions, define hard constraints, and define success.",
        hint: "Staring at a blurry problem only compounds waste.",
        nextLabel: "reframe",
      },
      {
        id: "reframe",
        code: "2",
        title: "Reframe",
        prompt: "How else could this be seen?",
        placeholder: "Invert it, find an analogy, zoom in/out, work backward, or steelman the opposite.",
        hint: "A different frame often collapses the search space.",
        nextLabel: "classify",
      },
      {
        id: "classify",
        code: "3",
        title: "Classify",
        prompt: "What genus of problem is this and which structural features dominate?",
        placeholder: "Name the class: search, optimization, proof, design, strategy, causal, constraint, etc.",
        hint: "Correct classification is usually faster than more brute force.",
        nextLabel: "plan",
      },
      {
        id: "plan",
        code: "4",
        title: "Plan",
        prompt: "Which moves are available and which one is the smallest credible next attempt?",
        placeholder: "Pick the patterns, invariants, simplifications, decompositions, or experiments you will try.",
        hint: "Choose a move, not a mood.",
        nextLabel: "execute",
      },
      {
        id: "execute",
        code: "5",
        title: "Execute",
        prompt: "How will you run the attempt cleanly and what checkpoints will you verify?",
        placeholder: "Define the smallest working version, checkpoints, timebox, and current error log.",
        hint: "Execution without checkpoints turns debugging into fog.",
        nextLabel: "review",
      },
      {
        id: "review",
        code: "6",
        title: "Review",
        prompt: "What actually worked, what failed, and what pattern should your future self remember?",
        placeholder: "Write the result, the graveyard of failed moves, the generalization, and the next-time delta.",
        hint: "A solved problem is wasted if it does not become a reusable pattern.",
      },
    ],
  },
];
