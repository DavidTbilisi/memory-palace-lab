/**
 * Onboarding content shared by the Learn rail and the Library "Start here"
 * view. This is the only place lessons, example blueprints, and progress
 * checks are defined, so the two surfaces can never drift apart again.
 */
export type Lesson = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  /** Library document that goes deeper on this lesson. */
  librarySlug: string;
};

export const LESSONS: readonly Lesson[] = [
  {
    id: "basics",
    title: "Lesson 1 - Build your first palace",
    summary: "Create a palace, drop nodes, and edit node meaning.",
    steps: [
      "Create a palace from the left sidebar.",
      "Double-click empty canvas to summon node creatures.",
      "Select a node and edit title/content in the inspector.",
      "Let auto-save protect drafts, then press Save Checkpoint when you want an intentional durable save.",
    ],
    librarySlug: "app-manual",
  },
  {
    id: "cast",
    title: "Lesson 2 - CAST edge relationships",
    summary: "Connect concepts with directed meaning.",
    steps: [
      "Switch to Connect tool in the top toolbar.",
      "Click source node, then target node.",
      "Pick WHO / HOW / WHAT / WHEN in the CAST dialog.",
      "Use Save Checkpoint after the edge means what you want, not after every tiny move.",
    ],
    librarySlug: "cast-system",
  },
  {
    id: "routes",
    title: "Lesson 3 - Walk memory routes",
    summary: "Turn graph nodes into an ordered recall journey.",
    steps: [
      "In the Routes bar, type a route name and click Add route.",
      "Choose that route from the Routes dropdown.",
      "Click a memory node on canvas, then click Add selected node to route.",
      "Repeat node selection plus Add selected node to route for each next locus.",
      "Turn Walk on and use previous and next to step through loci order.",
    ],
    librarySlug: "retrieval-protocol",
  },
  {
    id: "compiler",
    title: "Lesson 4 - Universal problem-solving compiler",
    summary: "Take any problem: decompose -> choose operations -> execute -> verify.",
    steps: [
      "Classify quickly: static, dynamic, optimization, or uncertain.",
      "Extract structure explicitly: V, E, C, D, O.",
      "Choose dominant layer: relations->graph, dynamics->DP or simulation, constraints->CSP, objective->optimize.",
      "Reduce problem size: remove irrelevant variables, simplify constraints, compress state.",
      "Match pattern trigger: DAG, monotonicity, overlap, combinations, shortest-path.",
      "Execute and verify: enforce constraints, test edge cases, check objective, and run reverse checks.",
    ],
    librarySlug: "heuristic-palace",
  },
];

/** "Lesson 1 - Build your first palace" → "Lesson 1". */
export function lessonShortLabel(lesson: Lesson): string {
  return lesson.title.split("-")[0]?.trim() || lesson.title;
}

export type ExampleId = "api-architecture" | "exam-revision" | "talk-prep" | "solver";

export type ExampleSummary = {
  id: ExampleId;
  title: string;
  details: string;
};

export const EXAMPLES: readonly ExampleSummary[] = [
  {
    id: "api-architecture",
    title: "API Architecture Palace",
    details: "Nodes: Gateway, Auth, Router, Cache, DB. CAST edges describe flow and control.",
  },
  {
    id: "exam-revision",
    title: "Exam Revision Route",
    details: "One node per chapter concept. Route order mirrors exam strategy from easy to hard.",
  },
  {
    id: "talk-prep",
    title: "Talk Prep Memory Map",
    details: "Create one node per slide idea, then walk route to rehearse transitions.",
  },
  {
    id: "solver",
    title: "Universal Solver Scratchpad",
    details:
      "Use one node for V/E/C/D/O, connect edges for dependencies, and keep a route: classify -> decompose -> choose technique -> execute -> verify.",
  },
];

export function exampleById(id: ExampleId): ExampleSummary {
  const found = EXAMPLES.find((example) => example.id === id);
  if (!found) throw new Error(`Unknown example: ${id}`);
  return found;
}

export type ProgressInput = {
  palaceCount: number;
  hasOpenPalace: boolean;
  nodeCount: number;
  edgeCount: number;
  routeCount: number;
  locusCount: number;
};

export type ProgressCheck = {
  id: string;
  label: string;
  ok: boolean;
};

/** The five first-session milestones, in the order a new user meets them. */
export function buildProgressChecks(input: ProgressInput): ProgressCheck[] {
  return [
    { id: "palace", label: "Created at least one palace", ok: input.palaceCount > 0 },
    { id: "open", label: "Opened a palace", ok: input.hasOpenPalace },
    { id: "nodes", label: "Added memory nodes", ok: input.nodeCount > 0 },
    { id: "edges", label: "Connected nodes with CAST edges", ok: input.edgeCount > 0 },
    { id: "route", label: "Created route and loci", ok: input.routeCount > 0 && input.locusCount > 0 },
  ];
}
