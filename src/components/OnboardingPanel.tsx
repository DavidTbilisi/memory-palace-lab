import { useState } from "react";
import { BookOpen, Sparkles, Wand2, X } from "lucide-react";
import { EXAMPLES, LESSONS, lessonShortLabel, type ExampleId } from "../content/lessons";
import { createTutorialPalace, ensureExamplePalace } from "../system/examplePalaces";
import { usePalaceStore } from "../store/palaceStore";
import { useLearningProgress } from "./hooks/useLearningProgress";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * The Learn rail: a contextual companion showing first-session progress, the
 * current lesson, and example palaces. Content comes from `content/lessons`,
 * the same source the Library uses.
 */
export function OnboardingPanel({ open, onClose }: Props) {
  const setToolMode = usePalaceStore((s) => s.setToolMode);
  const { checks } = useLearningProgress();
  const [lessonId, setLessonId] = useState<string>(LESSONS[0].id);
  const [loadingExampleId, setLoadingExampleId] = useState<ExampleId | null>(null);

  const selectedLesson = LESSONS.find((lesson) => lesson.id === lessonId) ?? LESSONS[0];

  if (!open) return null;

  return (
    <aside className="flex h-full shrink-0 flex-col border-l border-zinc-800 bg-zinc-950 w-[360px]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <BookOpen className="h-4 w-4" />
          Learn
        </div>
        <Button size="icon" variant="ghost" type="button" aria-label="Close learn panel" onClick={onClose}>
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
            {checks.map((check) => (
              <li key={check.id} className={check.ok ? "text-emerald-300" : "text-zinc-400"}>
                {check.ok ? "✓" : "◦"} {check.label}
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
                {lessonShortLabel(lesson)}
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
                  void ensureExamplePalace(example.id).finally(() => setLoadingExampleId(null));
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
            void createTutorialPalace();
          }}
        >
          <Wand2 className="h-4 w-4" />
          Tutorial palace
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
