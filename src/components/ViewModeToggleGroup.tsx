import { BookOpen, Columns3, Focus, PanelLeft, PanelRightOpen } from "lucide-react";
import { Button } from "./ui/button";

export type ViewMode = "balanced" | "focus";

export function ViewModeToggleGroup({
  viewMode,
  onApplyViewMode,
  onToggleSidebar,
  onToggleInspector,
  onToggleOnboarding,
  onHoverHintChange,
}: {
  viewMode: ViewMode;
  onApplyViewMode: (mode: ViewMode) => void;
  onToggleSidebar: () => void;
  onToggleInspector: () => void;
  onToggleOnboarding: () => void;
  onHoverHintChange: (hint: string | null) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant={viewMode === "balanced" ? "default" : "secondary"}
        type="button"
        onClick={() => onApplyViewMode("balanced")}
        title="Balanced layout"
        onMouseEnter={() => onHoverHintChange("Balanced mode: keeps side panels visible for editing and navigation.")}
        onMouseLeave={() => onHoverHintChange(null)}
      >
        <Columns3 className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant={viewMode === "focus" ? "default" : "secondary"}
        type="button"
        onClick={() => onApplyViewMode("focus")}
        title="Focus mode"
        onMouseEnter={() => onHoverHintChange("Focus mode: hides panels and maximizes canvas space.")}
        onMouseLeave={() => onHoverHintChange(null)}
      >
        <Focus className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        type="button"
        onClick={onToggleSidebar}
        title="Toggle palace sidebar"
        onMouseEnter={() => onHoverHintChange("Toggle palace sidebar: show or hide palace list and create controls.")}
        onMouseLeave={() => onHoverHintChange(null)}
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        type="button"
        onClick={onToggleInspector}
        title="Toggle inspector"
        onMouseEnter={() => onHoverHintChange("Toggle inspector: show or hide node title and content editor.")}
        onMouseLeave={() => onHoverHintChange(null)}
      >
        <PanelRightOpen className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="secondary"
        type="button"
        onClick={onToggleOnboarding}
        onMouseEnter={() => onHoverHintChange("Learn panel: onboarding guides plus theSystem pipelines.")}
        onMouseLeave={() => onHoverHintChange(null)}
      >
        <BookOpen className="h-4 w-4" />
        Learn
      </Button>
    </div>
  );
}
