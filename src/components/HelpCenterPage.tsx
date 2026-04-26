import { useEffect, useMemo, useReducer, useState } from "react";
import { toRichText } from "@tldraw/tlschema";
import type { TLShapeId } from "@tldraw/tlschema";
import { BookOpen, Compass, Sparkles, Wand2 } from "lucide-react";
import { createGeoMemoryNode, createMemoryArrow } from "../canvas/createMemoryShapes";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import type { Locus, MemoryRoute } from "../domain/entities/types";
import { CAST_HOW, CAST_WHAT, CAST_WHO, CAST_WHEN } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

type ExampleBlueprint = {
  id: string;
  title: string;
  details: string;
};

const LESSONS: Lesson[] = [
  {
    id: "basics",
    title: "Lesson 1 - Build your first palace",
    summary: "Create a palace, drop nodes, and edit node meaning.",
    steps: [
      "Create a palace from the left sidebar or quick actions.",
      "Double-click empty canvas or use Add Node to create anchors.",
      "Select a node and edit title/content in the inspector.",
      "Save when the draft becomes a checkpoint you want to trust.",
    ],
  },
  {
    id: "cast",
    title: "Lesson 2 - Connect with CAST",
    summary: "Edges should encode meaning, not just adjacency.",
    steps: [
      "Switch to Connect in the toolbar.",
      "Click source node, then target node.",
      "Pick WHO / HOW / WHAT / WHEN in the CAST dialog.",
      "Use labels only when they clarify the edge, not as a crutch.",
    ],
  },
  {
    id: "routes",
    title: "Lesson 3 - Turn graphs into walks",
    summary: "Routes and loci create recall order.",
    steps: [
      "Create a route from the route strip.",
      "Select nodes and add them as loci in the order you want to rehearse.",
      "Turn Walk on only after the sequence exists.",
      "Rate recall honestly to feed later review and analytics.",
    ],
  },
];

const EXAMPLES: ExampleBlueprint[] = [
  {
    id: "api-architecture",
    title: "API Architecture Palace",
    details: "Gateway, Auth, Router, Cache, and DB connected by causal edges and one request-path route.",
  },
  {
    id: "exam-revision",
    title: "Exam Revision Route",
    details: "A simple ordered revision path from foundations to traps and final pass.",
  },
  {
    id: "talk-prep",
    title: "Talk Prep Memory Map",
    details: "Opening, problem, method, demo, close. Good for rehearsal and transitions.",
  },
  {
    id: "solver",
    title: "Universal Solver Scratchpad",
    details: "Variables, relations, constraints, dynamics, objective, and representation in one route.",
  },
];

type Props = {
  onOpenPalaceWorkspace: () => void;
  onOpenSystem: () => void;
  onOpenCommandPalette: () => void;
};

export function HelpCenterPage({ onOpenPalaceWorkspace, onOpenSystem, onOpenCommandPalette }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const replaceRoutesAndLoci = usePalaceStore((s) => s.replaceRoutesAndLoci);
  const [lessonId, setLessonId] = useState<string>(LESSONS[0]?.id ?? "");
  const [loadingExampleId, setLoadingExampleId] = useState<string | null>(null);
  const [, bumpSceneRevision] = useReducer((value: number) => value + 1, 0);

  useEffect(() => {
    if (!editorRef) return;
    const unsubscribe = editorRef.store.listen(
      () => {
        bumpSceneRevision();
      },
      { source: "all", scope: "all" },
    );
    return unsubscribe;
  }, [editorRef]);

  const selectedLesson = LESSONS.find((lesson) => lesson.id === lessonId) ?? LESSONS[0];

  const shapeStats = useMemo(() => {
    if (!editorRef) return { nodes: 0, edges: 0 };
    let nodes = 0;
    let edges = 0;
    for (const shapeId of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(shapeId as TLShapeId);
      if (!shape) continue;
      if (shape.type === "geo" && (shape.meta as { mpNodeId?: string }).mpNodeId) nodes += 1;
      if (shape.type === "arrow" && (shape.meta as { mpEdgeId?: string }).mpEdgeId) edges += 1;
    }
    return { nodes, edges };
  }, [editorRef]);

  const checks = [
    { label: "Created at least one palace", ok: palaces.length > 0 },
    { label: "Opened a palace", ok: !!currentPalace },
    { label: "Added memory nodes", ok: shapeStats.nodes > 0 },
    { label: "Connected nodes with CAST edges", ok: shapeStats.edges > 0 },
    { label: "Created route and loci", ok: routes.length > 0 && loci.length > 0 },
  ];

  const waitForEditorReady = async (timeoutMs = 5000) => {
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 50));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const state = usePalaceStore.getState();
      if (state.editorRef && state.currentPalace) return { editor: state.editorRef, palaceId: state.currentPalace.id };
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error("Editor did not become ready in time.");
  };

  const createNamedNode = (
    targetPalaceId: string,
    x: number,
    y: number,
    title: string,
    content: string,
  ): { shapeId: string; nodeId: string } => {
    const state = usePalaceStore.getState();
    if (!state.editorRef) throw new Error("Editor not ready");
    const { shapeId, nodeId } = createGeoMemoryNode(state.editorRef, targetPalaceId, { x, y });
    const shape = state.editorRef.getShape(shapeId as TLShapeId);
    const previous = (shape?.meta ?? {}) as MemoryPalaceMeta;
    state.editorRef.updateShape({
      id: shapeId as TLShapeId,
      type: "geo",
      meta: { ...previous, mpTitle: title, mpContent: content },
      props: { ...(shape?.props ?? {}), richText: toRichText(title) },
    });
    return { shapeId, nodeId };
  };

  const setRoutesAndLoci = (nextRoutes: MemoryRoute[], nextLoci: Locus[]) => {
    replaceRoutesAndLoci(nextRoutes, nextLoci);
  };

  const populateExample = async (exampleId: string) => {
    const { editor, palaceId } = await waitForEditorReady();

    if (exampleId === "api-architecture") {
      const gateway = createNamedNode(palaceId, 260, 220, "Gateway", "Ingress hub and policy gate.");
      const auth = createNamedNode(palaceId, 560, 120, "Auth", "Identity and token verification.");
      const router = createNamedNode(palaceId, 560, 220, "Router", "Dispatches to internal services.");
      const cache = createNamedNode(palaceId, 560, 320, "Cache", "Hot-path read acceleration.");
      const db = createNamedNode(palaceId, 830, 220, "DB", "Durable system-of-record storage.");
      createMemoryArrow(editor, palaceId, gateway.shapeId, auth.shapeId, gateway.nodeId, auth.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[0],
        ef: CAST_WHAT[2],
        gh: CAST_WHEN[0],
        label: "authenticates",
      });
      createMemoryArrow(editor, palaceId, gateway.shapeId, router.shapeId, gateway.nodeId, router.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[2],
        ef: CAST_WHAT[0],
        gh: CAST_WHEN[1],
        label: "routes",
      });
      createMemoryArrow(editor, palaceId, router.shapeId, cache.shapeId, router.nodeId, cache.nodeId, {
        ab: CAST_WHO[1],
        cd: CAST_HOW[1],
        ef: CAST_WHAT[1],
        gh: CAST_WHEN[1],
        label: "hydrates",
      });
      createMemoryArrow(editor, palaceId, router.shapeId, db.shapeId, router.nodeId, db.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[1],
        ef: CAST_WHAT[0],
        gh: CAST_WHEN[0],
        label: "persists",
      });
      const routeId = crypto.randomUUID();
      setRoutesAndLoci(
        [{ id: routeId, palaceId, name: "Request path" }],
        [
          { id: crypto.randomUUID(), routeId, nodeId: gateway.nodeId, orderIndex: 0, label: "Gateway" },
          { id: crypto.randomUUID(), routeId, nodeId: auth.nodeId, orderIndex: 1, label: "Auth" },
          { id: crypto.randomUUID(), routeId, nodeId: router.nodeId, orderIndex: 2, label: "Router" },
          { id: crypto.randomUUID(), routeId, nodeId: db.nodeId, orderIndex: 3, label: "DB" },
        ],
      );
      return;
    }

    if (exampleId === "exam-revision") {
      const chapter1 = createNamedNode(palaceId, 260, 160, "Chapter 1", "Core definitions and symbols.");
      const chapter2 = createNamedNode(palaceId, 520, 120, "Chapter 2", "Main theorem forms and proofs.");
      const chapter3 = createNamedNode(palaceId, 780, 160, "Chapter 3", "Worked examples and traps.");
      const chapter4 = createNamedNode(palaceId, 520, 310, "Chapter 4", "Synthesis, timing, edge cases.");
      createMemoryArrow(editor, palaceId, chapter1.shapeId, chapter2.shapeId, chapter1.nodeId, chapter2.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[1],
        ef: CAST_WHAT[2],
        gh: CAST_WHEN[1],
        label: "prerequisite",
      });
      createMemoryArrow(editor, palaceId, chapter2.shapeId, chapter3.shapeId, chapter2.nodeId, chapter3.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[2],
        ef: CAST_WHAT[0],
        gh: CAST_WHEN[2],
        label: "supports",
      });
      createMemoryArrow(editor, palaceId, chapter3.shapeId, chapter4.shapeId, chapter3.nodeId, chapter4.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[3],
        ef: CAST_WHAT[3],
        gh: CAST_WHEN[3],
        label: "stress-tests",
      });
      const routeId = crypto.randomUUID();
      setRoutesAndLoci(
        [{ id: routeId, palaceId, name: "Exam order" }],
        [
          { id: crypto.randomUUID(), routeId, nodeId: chapter1.nodeId, orderIndex: 0, label: "Warm-up" },
          { id: crypto.randomUUID(), routeId, nodeId: chapter2.nodeId, orderIndex: 1, label: "Core proof" },
          { id: crypto.randomUUID(), routeId, nodeId: chapter3.nodeId, orderIndex: 2, label: "Examples" },
          { id: crypto.randomUUID(), routeId, nodeId: chapter4.nodeId, orderIndex: 3, label: "Final pass" },
        ],
      );
      return;
    }

    if (exampleId === "talk-prep") {
      const opening = createNamedNode(palaceId, 250, 170, "Opening", "Hook plus framing promise.");
      const problem = createNamedNode(palaceId, 500, 120, "Problem", "Why current approaches fail.");
      const method = createNamedNode(palaceId, 780, 170, "Method", "Your 3-step proposal.");
      const demo = createNamedNode(palaceId, 500, 300, "Demo", "Evidence and walkthrough.");
      const close = createNamedNode(palaceId, 780, 300, "Close", "Recap and call to action.");
      createMemoryArrow(editor, palaceId, opening.shapeId, problem.shapeId, opening.nodeId, problem.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[2],
        ef: CAST_WHAT[2],
        gh: CAST_WHEN[1],
        label: "sets context",
      });
      createMemoryArrow(editor, palaceId, problem.shapeId, method.shapeId, problem.nodeId, method.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[1],
        ef: CAST_WHAT[0],
        gh: CAST_WHEN[1],
        label: "motivates",
      });
      createMemoryArrow(editor, palaceId, method.shapeId, demo.shapeId, method.nodeId, demo.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[3],
        ef: CAST_WHAT[3],
        gh: CAST_WHEN[2],
        label: "proves",
      });
      createMemoryArrow(editor, palaceId, demo.shapeId, close.shapeId, demo.nodeId, close.nodeId, {
        ab: CAST_WHO[0],
        cd: CAST_HOW[1],
        ef: CAST_WHAT[1],
        gh: CAST_WHEN[0],
        label: "lands",
      });
      const routeId = crypto.randomUUID();
      setRoutesAndLoci(
        [{ id: routeId, palaceId, name: "Talk flow" }],
        [
          { id: crypto.randomUUID(), routeId, nodeId: opening.nodeId, orderIndex: 0, label: "Hook" },
          { id: crypto.randomUUID(), routeId, nodeId: problem.nodeId, orderIndex: 1, label: "Problem" },
          { id: crypto.randomUUID(), routeId, nodeId: method.nodeId, orderIndex: 2, label: "Method" },
          { id: crypto.randomUUID(), routeId, nodeId: demo.nodeId, orderIndex: 3, label: "Demo" },
          { id: crypto.randomUUID(), routeId, nodeId: close.nodeId, orderIndex: 4, label: "Close" },
        ],
      );
      return;
    }

    const variables = createNamedNode(palaceId, 210, 150, "Variables", "What are the entities and states?");
    const relations = createNamedNode(palaceId, 470, 110, "Relations", "How entities connect or influence.");
    const constraints = createNamedNode(palaceId, 760, 150, "Constraints", "What is legal or feasible.");
    const dynamics = createNamedNode(palaceId, 210, 320, "Dynamics", "How state changes over time.");
    const objective = createNamedNode(palaceId, 470, 350, "Objective", "What counts as success.");
    const representation = createNamedNode(palaceId, 760, 320, "Representation", "Reframe when stuck.");
    createMemoryArrow(editor, palaceId, variables.shapeId, relations.shapeId, variables.nodeId, relations.nodeId, {
      ab: CAST_WHO[0],
      cd: CAST_HOW[1],
      ef: CAST_WHAT[0],
      gh: CAST_WHEN[1],
      label: "decompose",
    });
    createMemoryArrow(editor, palaceId, relations.shapeId, constraints.shapeId, relations.nodeId, constraints.nodeId, {
      ab: CAST_WHO[0],
      cd: CAST_HOW[2],
      ef: CAST_WHAT[2],
      gh: CAST_WHEN[2],
      label: "restrict",
    });
    createMemoryArrow(editor, palaceId, constraints.shapeId, dynamics.shapeId, constraints.nodeId, dynamics.nodeId, {
      ab: CAST_WHO[0],
      cd: CAST_HOW[3],
      ef: CAST_WHAT[3],
      gh: CAST_WHEN[2],
      label: "prune state space",
    });
    createMemoryArrow(editor, palaceId, dynamics.shapeId, objective.shapeId, dynamics.nodeId, objective.nodeId, {
      ab: CAST_WHO[0],
      cd: CAST_HOW[1],
      ef: CAST_WHAT[1],
      gh: CAST_WHEN[1],
      label: "evaluate",
    });
    createMemoryArrow(
      editor,
      palaceId,
      objective.shapeId,
      representation.shapeId,
      objective.nodeId,
      representation.nodeId,
      {
        ab: CAST_WHO[1],
        cd: CAST_HOW[2],
        ef: CAST_WHAT[2],
        gh: CAST_WHEN[1],
        label: "reframe if needed",
      },
    );
    const routeId = crypto.randomUUID();
    setRoutesAndLoci(
      [{ id: routeId, palaceId, name: "Compiler loop" }],
      [
        { id: crypto.randomUUID(), routeId, nodeId: variables.nodeId, orderIndex: 0, label: "V" },
        { id: crypto.randomUUID(), routeId, nodeId: relations.nodeId, orderIndex: 1, label: "E" },
        { id: crypto.randomUUID(), routeId, nodeId: constraints.nodeId, orderIndex: 2, label: "C" },
        { id: crypto.randomUUID(), routeId, nodeId: dynamics.nodeId, orderIndex: 3, label: "D" },
        { id: crypto.randomUUID(), routeId, nodeId: objective.nodeId, orderIndex: 4, label: "O" },
        { id: crypto.randomUUID(), routeId, nodeId: representation.nodeId, orderIndex: 5, label: "R" },
      ],
    );
  };

  const ensureExamplePalace = async (example: ExampleBlueprint) => {
    const palaceName = `Example - ${example.title}`;
    const existing = usePalaceStore
      .getState()
      .palaces.find((palace) => palace.name.toLowerCase() === palaceName.toLowerCase());
    if (existing) {
      await openPalace(existing.id);
      return;
    }
    await createPalace(palaceName);
    await populateExample(example.id);
    await saveCurrent();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BookOpen className="h-4 w-4" />
          Help Center
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Use guides and example palaces when you want structure fast. Help should accelerate the first useful graph,
          then get out of the way.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              void createPalace("Tutorial Palace").then(() => onOpenPalaceWorkspace());
            }}
          >
            <Wand2 className="h-4 w-4" />
            Create tutorial palace
          </Button>
          <Button type="button" variant="secondary" onClick={onOpenPalaceWorkspace}>
            <Compass className="h-4 w-4" />
            Open palace workspace
          </Button>
          <Button type="button" variant="outline" onClick={onOpenSystem}>
            Open System
          </Button>
          <Button type="button" variant="outline" onClick={onOpenCommandPalette}>
            Open command palette
          </Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              <Sparkles className="h-3.5 w-3.5" />
              Progress
            </div>
            <ul className="space-y-2 text-sm">
              {checks.map((check) => (
                <li key={check.label} className={check.ok ? "text-emerald-300" : "text-zinc-400"}>
                  {check.ok ? "✓" : "◦"} {check.label}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Lessons</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {LESSONS.map((lesson) => (
                <Button
                  key={lesson.id}
                  size="sm"
                  type="button"
                  variant={lesson.id === selectedLesson.id ? "default" : "secondary"}
                  onClick={() => setLessonId(lesson.id)}
                >
                  {lesson.title.split("-")[0]?.trim() ?? lesson.title}
                </Button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Current lesson</div>
            <h2 className="mt-3 text-xl font-semibold text-zinc-100">{selectedLesson.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{selectedLesson.summary}</p>
            <ol className="mt-4 space-y-2 text-sm text-zinc-300">
              {selectedLesson.steps.map((step) => (
                <li key={step}>- {step}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Example palaces</div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => {
                      setLoadingExampleId(example.id);
                    void ensureExamplePalace(example)
                      .then(() => onOpenPalaceWorkspace())
                      .finally(() => setLoadingExampleId(null));
                  }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-left transition hover:border-violet-500/50 hover:bg-zinc-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-medium text-zinc-100">{example.title}</div>
                    {loadingExampleId === example.id ? <span className="text-xs text-violet-300">Loading...</span> : null}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-zinc-400">{example.details}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
