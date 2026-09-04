import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  /** Minimum number of rows to show (the sidebar aligns rows with the current path). */
  minRows?: number;
  compact?: boolean;
};

/**
 * Names for atlas hierarchy levels ("Domain / Place / Section" by default).
 * Reads and writes the store slice, so the sidebar and Settings stay in sync.
 */
export function AtlasLevelLabelsEditor({ minRows = 0, compact = false }: Props) {
  const levelLabels = usePalaceStore((s) => s.atlasLevelLabels);
  const setAtlasLevelLabels = usePalaceStore((s) => s.setAtlasLevelLabels);
  const rowCount = Math.max(levelLabels.length, minRows);

  const updateLevelLabel = (index: number, value: string) => {
    const next = [...levelLabels];
    while (next.length <= index) next.push("");
    next[index] = value;
    setAtlasLevelLabels(next);
  };

  return (
    <div>
      <div className={compact ? "space-y-2" : "grid gap-2 sm:grid-cols-2"}>
        {Array.from({ length: rowCount }).map((_, index) => (
          <Input
            key={`level-label-${index}`}
            aria-label={`Atlas level ${index + 1} name`}
            value={levelLabels[index] ?? ""}
            onChange={(event) => updateLevelLabel(index, event.target.value)}
            placeholder={`Level ${index + 1}`}
            className="h-8 text-xs"
          />
        ))}
      </div>
      <Button
        size="sm"
        variant="ghost"
        className={compact ? "mt-2 w-full justify-center" : "mt-2"}
        type="button"
        onClick={() => setAtlasLevelLabels([...levelLabels, `Level ${levelLabels.length + 1}`])}
      >
        Add level
      </Button>
    </div>
  );
}
