import { useEffect, useReducer, useState } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import { BookOpen, Sparkles, Wand2, X } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
};

const LESSONS: Lesson[] = [
  {
    id: "basics",
    title: "Lesson 1 · Build your first palace",
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
    title: "Lesson 2 · CAST edge relationships",
    summary: "Connect concepts with directed meaning.",
    steps: [
      "Switch to Connect tool in the top toolbar.",
      "Click source node, then target node.",
      "Pick WHO / HOW / WHAT / WHEN in the CAST dialog.",
      "Save to store edge + CAST slots.",
    ],
  },
  {
    id: "routes",
    title: "Lesson 3 · Walk memory routes",
    summary: "Turn graph nodes into an ordered recall journey.",
    steps: [
      "In the Routes bar, type a route name and click Add route.",
      "Choose that route from the Routes dropdown (top-center).",
      "Click a memory node on canvas, then click Add selected node to route.",
      "Repeat node selection + Add selected node to route for each next locus.",
      "Turn Walk on and use previous/next to step through loci order.",
    ],
  },
];

const EXAMPLES = [
  {
    title: "API Architecture Palace",
    details: "Nodes: Gateway, Auth, Router, Cache, DB. CAST edges describe flow and control.",
  },
  {
    title: "Exam Revision Route",
    details: "One node per chapter concept. Route order mirrors exam strategy from easy to hard.",
  },
  {
    title: "Talk Prep Memory Map",
    details: "Create one node per slide idea, then walk route to rehearse transitions.",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function OnboardingPanel({ open, onClose }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const setToolMode = usePalaceStore((s) => s.setToolMode);

  const [lessonId, setLessonId] = useState<string>(LESSONS[0].id);
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

  if (!open) return null;

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BookOpen className="h-4 w-4" />
          Onboarding
        </div>
        <Button size="icon" variant="ghost" type="button" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 overflow-y-auto p-3 text-sm">
        <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <Sparkles className="h-3.5 w-3.5" />
            Progress
          </div>
          <ul className="space-y-1">
            {checks.map((c) => (
              <li key={c.label} className={c.ok ? "text-emerald-300" : "text-zinc-400"}>
                {c.ok ? "✓" : "○"} {c.label}
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
                {lesson.title.split("·")[0].trim()}
              </Button>
            ))}
          </div>
          <div className="font-medium text-zinc-100">{selectedLesson.title}</div>
          <p className="mt-1 text-zinc-400">{selectedLesson.summary}</p>
          <ol className="mt-2 space-y-1 text-zinc-300">
            {selectedLesson.steps.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Examples</div>
          <div className="space-y-2">
            {EXAMPLES.map((example) => (
              <div key={example.title} className="rounded border border-zinc-800 bg-zinc-900/50 p-2">
                <div className="text-zinc-100">{example.title}</div>
                <div className="text-xs text-zinc-400">{example.details}</div>
              </div>
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
    </aside>
  );
}

