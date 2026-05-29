import { Pencil, Telescope } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import type { AppMode } from "../store/palaceStore";
import { cn } from "../utils/cn";

const MODES: { id: AppMode; label: string; icon: typeof Pencil; hint: string }[] = [
  { id: "encode", label: "Encode", icon: Pencil, hint: "Encode: build the palace — add, connect, and arrange nodes." },
  {
    id: "comprehend",
    label: "Comprehend",
    icon: Telescope,
    hint: "Comprehend: read the structure, find the crux, and interrogate what you don't yet get.",
  },
];

type Props = {
  onHoverHintChange?: (hint: string | null) => void;
};

/** Segmented Encode ⇄ Comprehend switch. The higher-level lens above the canvas tools. */
export function AppModeToggle({ onHoverHintChange }: Props) {
  const appMode = usePalaceStore((s) => s.appMode);
  const setAppMode = usePalaceStore((s) => s.setAppMode);

  return (
    <div
      role="radiogroup"
      aria-label="Editor mode"
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-900/70 p-0.5"
    >
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const active = appMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={mode.label}
            onClick={() => setAppMode(mode.id)}
            onMouseEnter={() => onHoverHintChange?.(mode.hint)}
            onMouseLeave={() => onHoverHintChange?.(null)}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold transition",
              active
                ? mode.id === "comprehend"
                  ? "bg-violet-500 text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  : "bg-zinc-200 text-zinc-950"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
