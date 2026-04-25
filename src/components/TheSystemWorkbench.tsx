import { useEffect, useMemo, useState } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import { BookOpen, GitBranchPlus, RotateCcw, Route, Target, Wand2 } from "lucide-react";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { resolveMemoryNodeTitle } from "../canvas/readShapeText";
import { THE_SYSTEM_PIPELINES } from "../content/theSystemPipelines";
import { materializeTheSystemPipeline } from "../system/materializeTheSystemPipeline";
import { usePalaceStore } from "../store/palaceStore";
import { TheSystemLibrary } from "./TheSystemLibrary";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type WorkbenchTab = "pipelines" | "docs";

export function TheSystemWorkbench() {
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);

  const [tab, setTab] = useState<WorkbenchTab>("pipelines");
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(THE_SYSTEM_PIPELINES[0]?.id ?? "");
  const [sessionTitle, setSessionTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notesByStepId, setNotesByStepId] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error">("success");
  const [isMaterializing, setIsMaterializing] = useState(false);

  const template = useMemo(
    () => THE_SYSTEM_PIPELINES.find((candidate) => candidate.id === selectedPipelineId) ?? THE_SYSTEM_PIPELINES[0],
    [selectedPipelineId],
  );

  const selectedNodeContext = useMemo(() => {
    if (!editorRef || !selectedShapeId) return null;
    const shape = editorRef.getShape(selectedShapeId as TLShapeId);
    const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
    if (shape?.type !== "geo" || !meta.mpNodeId) return null;
    return {
      shapeId: selectedShapeId,
      nodeId: meta.mpNodeId,
      title: resolveMemoryNodeTitle(shape),
    };
  }, [editorRef, selectedShapeId]);

  useEffect(() => {
    if (!selectedNodeContext?.title) return;
    setFocus((current) => current.trim() || selectedNodeContext.title);
  }, [selectedNodeContext?.title]);

  useEffect(() => {
    setNotesByStepId({});
    setStatusMessage(null);
  }, [selectedPipelineId]);

  if (!template) return null;

  const edgesCreated = template.steps.length + (selectedNodeContext ? 1 : 0);
  const graphSummary = `Will create 1 overview node, ${template.steps.length} step nodes, ${edgesCreated} edges, and 1 route.`;

  const handleMaterialize = () => {
    if (!currentPalace || !editorRef) return;
    setIsMaterializing(true);
    setStatusMessage(null);
    setStatusTone("success");

    try {
      const result = materializeTheSystemPipeline({
        editor: editorRef,
        palaceId: currentPalace.id,
        selectedShapeId,
        template,
        sessionTitle,
        answers: {
          focus,
          outcome,
          notesByStepId,
        },
      });

      const state = usePalaceStore.getState();
      usePalaceStore.setState({
        routes: [...state.routes, result.route],
        loci: [...state.loci, ...result.loci],
        walkRouteId: result.route.id,
        walkIndex: 0,
        walkOpen: false,
        selectedShapeId: result.overviewShapeId,
      });

      editorRef.setSelectedShapes([result.overviewShapeId as TLShapeId]);
      editorRef.zoomToSelectionIfOffscreen(120, { animation: { duration: 240 } });

      const label = sessionTitle.trim() || focus.trim() || template.shortTitle;
      setStatusTone("success");
      setStatusMessage(
        `Added "${label}" as a ${template.shortTitle} graph run with ${result.createdNodeCount} nodes. Use Save to persist it.`,
      );
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(error instanceof Error ? error.message : "Failed to materialize the graph run.");
    } finally {
      setIsMaterializing(false);
    }
  };

  const resetAnswers = () => {
    setSessionTitle("");
    setFocus(selectedNodeContext?.title ?? "");
    setOutcome("");
    setNotesByStepId({});
    setStatusMessage(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Wand2 className="h-4 w-4" />
          theSystem Workbench
        </div>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Turn theSystem into graph-native thinking workflows. Run a framework, capture working notes, and materialize
          the session into nodes, CAST edges, and a walk route inside the current palace.
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            type="button"
            variant={tab === "pipelines" ? "default" : "secondary"}
            onClick={() => setTab("pipelines")}
          >
            Pipelines
          </Button>
          <Button size="sm" type="button" variant={tab === "docs" ? "default" : "secondary"} onClick={() => setTab("docs")}>
            Docs
          </Button>
        </div>
      </div>

      {tab === "docs" ? (
        <div className="min-h-0 flex-1 pt-3">
          <TheSystemLibrary preferredSlug={template.docsSlug} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 gap-3 pt-3">
          <section className="flex w-72 shrink-0 flex-col rounded-md border border-zinc-800 bg-zinc-900/40">
            <div className="border-b border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <Route className="h-4 w-4 text-violet-300" />
                Pipelines
              </div>
              <p className="mt-1 text-xs leading-5 text-zinc-400">
                Start with a fixed framework, then turn the run into graph structure.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-2">
                {THE_SYSTEM_PIPELINES.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => setSelectedPipelineId(candidate.id)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      candidate.id === template.id
                        ? "border-violet-500/60 bg-violet-900/20"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-wide text-zinc-500">{candidate.category}</div>
                    <div className="mt-1 text-sm font-medium text-zinc-100">{candidate.title}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-400">{candidate.summary}</div>
                    <div className="mt-2 text-[11px] text-zinc-500">{candidate.steps.length} steps</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex min-w-0 flex-1 flex-col rounded-md border border-zinc-800 bg-zinc-900/40">
            <div className="border-b border-zinc-800 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">{template.category}</div>
              <h2 className="mt-1 text-lg font-semibold text-zinc-100">{template.title}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{template.summary}</p>
              <div className="mt-2 text-xs text-zinc-500">Best for: {template.recommendedFor}</div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                    <Target className="h-4 w-4 text-violet-300" />
                    Session target
                  </div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <Label htmlFor="system-session-title">Session title</Label>
                      <Input
                        id="system-session-title"
                        className="mt-1"
                        value={sessionTitle}
                        onChange={(event) => setSessionTitle(event.target.value)}
                        placeholder={`${template.shortTitle} run for this topic`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="system-session-focus">Topic or problem</Label>
                      <Textarea
                        id="system-session-focus"
                        className="mt-1 min-h-[92px]"
                        value={focus}
                        onChange={(event) => setFocus(event.target.value)}
                        placeholder="What are you trying to understand, solve, or build?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="system-session-outcome">Desired outcome</Label>
                      <Textarea
                        id="system-session-outcome"
                        className="mt-1 min-h-[92px]"
                        value={outcome}
                        onChange={(event) => setOutcome(event.target.value)}
                        placeholder="What does good output look like for this run?"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                    <GitBranchPlus className="h-4 w-4 text-violet-300" />
                    Graph output
                  </div>
                  <div className="mt-3 space-y-3 text-sm text-zinc-300">
                    <p>{graphSummary}</p>
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-xs leading-5 text-zinc-400">
                      {selectedNodeContext ? (
                        <>
                          Selected node anchor: <span className="text-zinc-200">{selectedNodeContext.title}</span>. The
                          generated overview node will attach to it with a `focuses on` edge.
                        </>
                      ) : (
                        <>Select a node first if you want the run attached to an existing concept or problem node.</>
                      )}
                    </div>
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-xs leading-5 text-zinc-400">
                      {currentPalace ? (
                        <>
                          Current palace: <span className="text-zinc-200">{currentPalace.name}</span>. Route name will
                          start with <span className="text-zinc-200">{template.routeName}</span>.
                        </>
                      ) : (
                        <>Create or open a palace first. The pipeline engine only emits into an active graph.</>
                      )}
                    </div>
                    <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-xs leading-5 text-zinc-400">
                      Reference doc available in the <span className="text-zinc-200">Docs</span> tab if you need the full
                      rationale while filling the run.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {template.steps.map((step) => (
                  <section key={step.id} className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="rounded-full border border-violet-500/60 bg-violet-900/20 px-2 py-0.5 text-[11px] font-semibold text-violet-200">
                        {step.code}
                      </div>
                      <div className="text-sm font-medium text-zinc-100">{step.title}</div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{step.prompt}</p>
                    <div className="mt-2 text-xs leading-5 text-zinc-500">{step.hint}</div>
                    <Textarea
                      aria-label={`${step.title} notes`}
                      className="mt-3 min-h-[108px]"
                      value={notesByStepId[step.id] ?? ""}
                      onChange={(event) =>
                        setNotesByStepId((current) => ({
                          ...current,
                          [step.id]: event.target.value,
                        }))
                      }
                      placeholder={step.placeholder}
                    />
                  </section>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 px-4 py-3">
              <div className="text-xs text-zinc-500">
                {statusMessage ? (
                  <span className={statusTone === "success" ? "text-emerald-300" : "text-rose-300"}>{statusMessage}</span>
                ) : (
                  graphSummary
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={resetAnswers}>
                  <RotateCcw className="h-4 w-4" />
                  Reset answers
                </Button>
                <Button type="button" variant="secondary" onClick={() => setTab("docs")}>
                  <BookOpen className="h-4 w-4" />
                  Open docs
                </Button>
                <Button type="button" onClick={handleMaterialize} disabled={!currentPalace || !editorRef || isMaterializing}>
                  <Wand2 className="h-4 w-4" />
                  {isMaterializing ? "Materializing..." : "Materialize to graph"}
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
