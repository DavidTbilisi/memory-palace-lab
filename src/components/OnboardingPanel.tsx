import { useEffect, useReducer, useState } from "react";
import { toRichText } from "@tldraw/tlschema";
import type { TLShapeId } from "@tldraw/tlschema";
import { BookOpen, Sparkles, Wand2, X } from "lucide-react";
import { createGeoMemoryNode, createMemoryArrow } from "../canvas/createMemoryShapes";
import { CAST_HOW, CAST_WHAT, CAST_WHO, CAST_WHEN } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import type { Locus, MemoryRoute } from "../domain/entities/types";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { ReviewQueuePanel } from "./ReviewQueuePanel";
import { TheSystemWorkbench } from "./TheSystemWorkbench";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

const LESSONS: Lesson[] = [
  {
    id: "basics",
    title: "Lesson 1 - Build your first palace",
    summary: "Create a palace, drop nodes, and edit node meaning.",
    steps: [
      "Create a palace from the left sidebar.",
      "Double-click empty canvas to summon node creatures.",
      "Select a node and edit title/content in the inspector.",
      "Press Save to persist into SQLite.",
    ],
  },
  {
    id: "cast",
    title: "Lesson 2 - CAST edge relationships",
    summary: "Connect concepts with directed meaning.",
    steps: [
      "Switch to Connect tool in the top toolbar.",
      "Click source node, then target node.",
      "Pick WHO / HOW / WHAT / WHEN in the CAST dialog.",
      "Save to store edge and CAST slots.",
    ],
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
  },
];

type ExampleBlueprint = {
  id: string;
  title: string;
  details: string;
};

const EXAMPLES: ExampleBlueprint[] = [
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

export type LearnPanelTab = "guides" | "system" | "analytics" | "review";

type Props = {
  open: boolean;
  onClose: () => void;
  preferredTab?: LearnPanelTab;
};

export function OnboardingPanel({ open, onClose, preferredTab }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const replaceRoutesAndLoci = usePalaceStore((s) => s.replaceRoutesAndLoci);
  const setToolMode = usePalaceStore((s) => s.setToolMode);

  const [lessonId, setLessonId] = useState<string>(LESSONS[0].id);
  const [panelTab, setPanelTab] = useState<LearnPanelTab>(preferredTab ?? "guides");
  const [loadingExampleId, setLoadingExampleId] = useState<string | null>(null);
  const [, bumpSceneRevision] = useReducer((v: number) => v + 1, 0);

  useEffect(() => {
    if (!editorRef) return;
    const unlisten = editorRef.store.listen(
      () => {
        bumpSceneRevision();
      },
      { source: "user", scope: "document" },
    );
    return () => {
      unlisten();
    };
  }, [editorRef]);

  useEffect(() => {
    if (!preferredTab) return;
    setPanelTab(preferredTab);
  }, [preferredTab]);

  const selectedLesson = LESSONS.find((x) => x.id === lessonId) ?? LESSONS[0];

  const shapeStats = (() => {
    if (!editorRef) return { nodes: 0, edges: 0 };
    let nodes = 0;
    let edges = 0;
    for (const id of editorRef.getCurrentPageShapeIds()) {
      const shape = editorRef.getShape(id as TLShapeId);
      if (!shape) continue;
      if (shape.type === "geo" && (shape.meta as { mpNodeId?: string }).mpNodeId) nodes += 1;
      if (shape.type === "arrow" && (shape.meta as { mpEdgeId?: string }).mpEdgeId) edges += 1;
    }
    return { nodes, edges };
  })();

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
      await new Promise((r) => setTimeout(r, 50));
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
    const prev = (shape?.meta ?? {}) as MemoryPalaceMeta;
    state.editorRef.updateShape({
      id: shapeId as TLShapeId,
      type: "geo",
      meta: { ...prev, mpTitle: title, mpContent: content },
      props: { ...(shape?.props ?? {}), richText: toRichText(title) },
    });
    return { shapeId, nodeId };
  };

  const setRoutesAndLoci = (nextRoutes: MemoryRoute[], nextLoci: Locus[]) => {
    replaceRoutesAndLoci(nextRoutes, nextLoci);
  };

  const populateExample = async (exampleId: string) => {
    const ready = await waitForEditorReady();
    const { editor, palaceId } = ready;

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
      const chapter4 = createNamedNode(palaceId, 520, 310, "Chapter 4", "Synthesis, edge cases, timing.");
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
      const opening = createNamedNode(palaceId, 250, 170, "Opening", "Hook + framing promise.");
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
    createMemoryArrow(editor, palaceId, objective.shapeId, representation.shapeId, objective.nodeId, representation.nodeId, {
      ab: CAST_WHO[1],
      cd: CAST_HOW[2],
      ef: CAST_WHAT[2],
      gh: CAST_WHEN[1],
      label: "reframe if needed",
    });
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
      .palaces.find((p) => p.name.toLowerCase() === palaceName.toLowerCase());
    if (existing) {
      await openPalace(existing.id);
      return;
    }
    await createPalace(palaceName);
    await populateExample(example.id);
    await saveCurrent();
  };

  if (!open) return null;

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-l border-zinc-800 bg-zinc-950 ${
        panelTab === "guides" ? "w-[360px]" : "w-[min(760px,72vw)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BookOpen className="h-4 w-4" />
          Learn
        </div>
        <Button size="icon" variant="ghost" type="button" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-b border-zinc-800 px-3 py-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            type="button"
            variant={panelTab === "guides" ? "default" : "secondary"}
            onClick={() => setPanelTab("guides")}
          >
            Guides
          </Button>
          <Button
            size="sm"
            type="button"
            variant={panelTab === "system" ? "default" : "secondary"}
            onClick={() => setPanelTab("system")}
          >
            theSystem
          </Button>
          <Button
            size="sm"
            type="button"
            variant={panelTab === "review" ? "default" : "secondary"}
            onClick={() => setPanelTab("review")}
          >
            Review
          </Button>
          <Button
            size="sm"
            type="button"
            variant={panelTab === "analytics" ? "default" : "secondary"}
            onClick={() => setPanelTab("analytics")}
          >
            Analytics
          </Button>
        </div>
      </div>

      {panelTab === "guides" ? (
        <>
          <div className="space-y-4 overflow-y-auto p-3 text-sm">
            <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                <Sparkles className="h-3.5 w-3.5" />
                Progress
              </div>
              <ul className="space-y-1">
                {checks.map((c) => (
                  <li key={c.label} className={c.ok ? "text-emerald-300" : "text-zinc-400"}>
                    {c.ok ? "\u2713" : "\u25E6"} {c.label}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Lessons</div>
              <div className="mb-3 flex flex-wrap gap-1">
                {LESSONS.map((lesson) => (
                  <Button
                    key={lesson.id}
                    size="sm"
                    type="button"
                    variant={lesson.id === selectedLesson.id ? "default" : "secondary"}
                    onClick={() => setLessonId(lesson.id)}
                  >
                    {lesson.title.split("-")[0].trim()}
                  </Button>
                ))}
              </div>
              <div className="font-medium text-zinc-100">{selectedLesson.title}</div>
              <p className="mt-1 text-zinc-400">{selectedLesson.summary}</p>
              <ol className="mt-2 space-y-1 text-zinc-300">
                {selectedLesson.steps.map((step) => (
                  <li key={step}>- {step}</li>
                ))}
              </ol>
            </section>

            <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Examples</div>
              <div className="space-y-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.id}
                    type="button"
                    className="w-full rounded border border-zinc-800 bg-zinc-900/50 p-2 text-left transition hover:border-violet-500/60 hover:bg-zinc-900"
                    onClick={() => {
                      setLoadingExampleId(example.id);
                      void ensureExamplePalace(example).finally(() => setLoadingExampleId(null));
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-zinc-100">{example.title}</div>
                      {loadingExampleId === example.id ? (
                        <span className="text-[11px] text-violet-300">Loading...</span>
                      ) : null}
                    </div>
                    <div className="text-xs text-zinc-400">{example.details}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 p-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                void createPalace("Tutorial Palace");
              }}
            >
              <Wand2 className="h-4 w-4" />
              Create tutorial palace
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setToolMode("connect");
              }}
            >
              Try connect tool
            </Button>
          </div>
        </>
      ) : panelTab === "system" ? (
        <div className="min-h-0 flex-1 p-3">
          <TheSystemWorkbench />
        </div>
      ) : panelTab === "review" ? (
        <div className="min-h-0 flex-1 p-3">
          <ReviewQueuePanel />
        </div>
      ) : (
        <div className="min-h-0 flex-1 p-3">
          <AnalyticsPanel />
        </div>
      )}
    </aside>
  );
}
