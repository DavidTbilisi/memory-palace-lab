import type { Editor } from "@tldraw/editor";
import { createMemoryArrow } from "../canvas/createMemoryShapes";
import { EXAMPLES, exampleById, type ExampleId } from "../content/lessons";
import {
  CAST_HOW,
  CAST_WHAT,
  CAST_WHEN,
  CAST_WHO,
  type Locus,
  type MemoryRoute,
} from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { createNamedNode } from "./materializeTheSystemPipeline";

type BlueprintNode = { key: string; x: number; y: number; title: string; content: string };

/** `cast` indexes into CAST_WHO / CAST_HOW / CAST_WHAT / CAST_WHEN. */
type BlueprintEdge = { from: string; to: string; cast: [number, number, number, number]; label: string };

export type ExampleBlueprint = {
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
  route: { name: string; loci: Array<{ key: string; label: string }> };
};

/** Data-only descriptions of the four example palaces offered during onboarding. */
export const EXAMPLE_BLUEPRINTS: Record<ExampleId, ExampleBlueprint> = {
  "api-architecture": {
    nodes: [
      { key: "gateway", x: 260, y: 220, title: "Gateway", content: "Ingress hub and policy gate." },
      { key: "auth", x: 560, y: 120, title: "Auth", content: "Identity and token verification." },
      { key: "router", x: 560, y: 220, title: "Router", content: "Dispatches to internal services." },
      { key: "cache", x: 560, y: 320, title: "Cache", content: "Hot-path read acceleration." },
      { key: "db", x: 830, y: 220, title: "DB", content: "Durable system-of-record storage." },
    ],
    edges: [
      { from: "gateway", to: "auth", cast: [0, 0, 2, 0], label: "authenticates" },
      { from: "gateway", to: "router", cast: [0, 2, 0, 1], label: "routes" },
      { from: "router", to: "cache", cast: [1, 1, 1, 1], label: "hydrates" },
      { from: "router", to: "db", cast: [0, 1, 0, 0], label: "persists" },
    ],
    route: {
      name: "Request path",
      loci: [
        { key: "gateway", label: "Gateway" },
        { key: "auth", label: "Auth" },
        { key: "router", label: "Router" },
        { key: "db", label: "DB" },
      ],
    },
  },
  "exam-revision": {
    nodes: [
      { key: "ch1", x: 260, y: 160, title: "Chapter 1", content: "Core definitions and symbols." },
      { key: "ch2", x: 520, y: 120, title: "Chapter 2", content: "Main theorem forms and proofs." },
      { key: "ch3", x: 780, y: 160, title: "Chapter 3", content: "Worked examples and traps." },
      { key: "ch4", x: 520, y: 310, title: "Chapter 4", content: "Synthesis, edge cases, timing." },
    ],
    edges: [
      { from: "ch1", to: "ch2", cast: [0, 1, 2, 1], label: "prerequisite" },
      { from: "ch2", to: "ch3", cast: [0, 2, 0, 2], label: "supports" },
      { from: "ch3", to: "ch4", cast: [0, 3, 3, 3], label: "stress-tests" },
    ],
    route: {
      name: "Exam order",
      loci: [
        { key: "ch1", label: "Warm-up" },
        { key: "ch2", label: "Core proof" },
        { key: "ch3", label: "Examples" },
        { key: "ch4", label: "Final pass" },
      ],
    },
  },
  "talk-prep": {
    nodes: [
      { key: "opening", x: 250, y: 170, title: "Opening", content: "Hook + framing promise." },
      { key: "problem", x: 500, y: 120, title: "Problem", content: "Why current approaches fail." },
      { key: "method", x: 780, y: 170, title: "Method", content: "Your 3-step proposal." },
      { key: "demo", x: 500, y: 300, title: "Demo", content: "Evidence and walkthrough." },
      { key: "close", x: 780, y: 300, title: "Close", content: "Recap and call to action." },
    ],
    edges: [
      { from: "opening", to: "problem", cast: [0, 2, 2, 1], label: "sets context" },
      { from: "problem", to: "method", cast: [0, 1, 0, 1], label: "motivates" },
      { from: "method", to: "demo", cast: [0, 3, 3, 2], label: "proves" },
      { from: "demo", to: "close", cast: [0, 1, 1, 0], label: "lands" },
    ],
    route: {
      name: "Talk flow",
      loci: [
        { key: "opening", label: "Hook" },
        { key: "problem", label: "Problem" },
        { key: "method", label: "Method" },
        { key: "demo", label: "Demo" },
        { key: "close", label: "Close" },
      ],
    },
  },
  solver: {
    nodes: [
      { key: "variables", x: 210, y: 150, title: "Variables", content: "What are the entities and states?" },
      { key: "relations", x: 470, y: 110, title: "Relations", content: "How entities connect or influence." },
      { key: "constraints", x: 760, y: 150, title: "Constraints", content: "What is legal or feasible." },
      { key: "dynamics", x: 210, y: 320, title: "Dynamics", content: "How state changes over time." },
      { key: "objective", x: 470, y: 350, title: "Objective", content: "What counts as success." },
      { key: "representation", x: 760, y: 320, title: "Representation", content: "Reframe when stuck." },
    ],
    edges: [
      { from: "variables", to: "relations", cast: [0, 1, 0, 1], label: "decompose" },
      { from: "relations", to: "constraints", cast: [0, 2, 2, 2], label: "restrict" },
      { from: "constraints", to: "dynamics", cast: [0, 3, 3, 2], label: "prune state space" },
      { from: "dynamics", to: "objective", cast: [0, 1, 1, 1], label: "evaluate" },
      { from: "objective", to: "representation", cast: [1, 2, 2, 1], label: "reframe if needed" },
    ],
    route: {
      name: "Compiler loop",
      loci: [
        { key: "variables", label: "V" },
        { key: "relations", label: "E" },
        { key: "constraints", label: "C" },
        { key: "dynamics", label: "D" },
        { key: "objective", label: "O" },
        { key: "representation", label: "R" },
      ],
    },
  },
};

export const TUTORIAL_PALACE_NAME = "Tutorial Palace";

export function examplePalaceName(id: ExampleId): string {
  return `Example - ${exampleById(id).title}`;
}

export type PopulatedExample = {
  route: MemoryRoute;
  loci: Locus[];
  createdNodeCount: number;
};

/**
 * Draw one example blueprint into `editor` for `palaceId`. Pure with respect
 * to the store: the caller decides what to do with the returned route/loci.
 */
export function populateExamplePalace(editor: Editor, palaceId: string, id: ExampleId): PopulatedExample {
  const blueprint = EXAMPLE_BLUEPRINTS[id];
  const created = new Map<string, { shapeId: string; nodeId: string }>();

  for (const node of blueprint.nodes) {
    created.set(node.key, createNamedNode(editor, palaceId, node.x, node.y, node.title, node.content));
  }

  for (const edge of blueprint.edges) {
    const from = created.get(edge.from);
    const to = created.get(edge.to);
    if (!from || !to) throw new Error(`Blueprint ${id} references unknown node ${edge.from} -> ${edge.to}`);
    const [who, how, what, when] = edge.cast;
    createMemoryArrow(editor, palaceId, from.shapeId, to.shapeId, from.nodeId, to.nodeId, {
      ab: CAST_WHO[who],
      cd: CAST_HOW[how],
      ef: CAST_WHAT[what],
      gh: CAST_WHEN[when],
      label: edge.label,
    });
  }

  const routeId = crypto.randomUUID();
  const route: MemoryRoute = { id: routeId, palaceId, name: blueprint.route.name };
  const loci: Locus[] = blueprint.route.loci.map((locus, index) => {
    const node = created.get(locus.key);
    if (!node) throw new Error(`Blueprint ${id} route references unknown node ${locus.key}`);
    return { id: crypto.randomUUID(), routeId, nodeId: node.nodeId, orderIndex: index, label: locus.label };
  });

  return { route, loci, createdNodeCount: created.size };
}

type WaitOptions = {
  /** Resolve only once this palace is the open one. */
  expectPalaceName?: string;
  /** Resolve only once a fresh editor (not this one) is mounted. */
  previousEditor?: Editor | null;
  timeoutMs?: number;
};

/**
 * Wait for the canvas editor of a freshly created/opened palace. Creating a
 * palace remounts the canvas, so the previous editor instance must be
 * excluded or drawing would land in the old palace.
 */
export async function waitForEditorReady(options: WaitOptions = {}): Promise<{ editor: Editor; palaceId: string }> {
  const timeoutMs = options.timeoutMs ?? 5000;
  const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 50));
  const expected = options.expectPalaceName?.trim().toLowerCase();
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const state = usePalaceStore.getState();
    const editor = state.editorRef;
    const palace = state.currentPalace;
    const nameMatches = !expected || palace?.name.trim().toLowerCase() === expected;
    const editorIsFresh = !options.previousEditor || editor !== options.previousEditor;
    if (editor && palace && nameMatches && editorIsFresh) return { editor, palaceId: palace.id };
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Editor did not become ready in time.");
}

/**
 * Open the example palace if it already exists, otherwise create, draw, and
 * checkpoint it. Resolves once the palace is open on the canvas.
 */
export async function ensureExamplePalace(id: ExampleId): Promise<{ palaceId: string; created: boolean }> {
  const name = examplePalaceName(id);
  const state = usePalaceStore.getState();
  const existing = state.palaces.find((palace) => palace.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    await state.openPalace(existing.id);
    return { palaceId: existing.id, created: false };
  }

  const previousEditor = state.editorRef;
  await state.createPalace(name);
  const { editor, palaceId } = await waitForEditorReady({ expectPalaceName: name, previousEditor });
  const populated = populateExamplePalace(editor, palaceId, id);
  usePalaceStore.getState().replaceRoutesAndLoci([populated.route], populated.loci);
  await usePalaceStore.getState().saveCurrent();
  return { palaceId, created: true };
}

/** The one helper behind every "Create tutorial palace" button. */
export async function createTutorialPalace(): Promise<void> {
  await usePalaceStore.getState().createPalace(TUTORIAL_PALACE_NAME);
}

export { EXAMPLES };
