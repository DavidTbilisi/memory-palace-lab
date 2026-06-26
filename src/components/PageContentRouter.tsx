import { AnalyticsPanel } from "./AnalyticsPanel";
import { AtlasEditorPage } from "./AtlasEditorPage";
import { DifficultyPanel } from "./DifficultyPanel";
import { HelpCenterPage } from "./HelpCenterPage";
import { ReviewPage } from "./ReviewPage";
import { RouteEditorPage } from "./RouteEditorPage";
import { TheSystemWorkbench } from "./TheSystemWorkbench";
import type { AppPage } from "../app/memoryPalaceAppHelpers";

const PANEL_WRAP = "min-h-0 flex-1 overflow-y-auto p-5";
const PANEL_WRAP_HIDDEN = "min-h-0 flex-1 overflow-hidden p-5";
const PANEL_CARD = "h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5";

/**
 * Renders the non-graph page bodies for a given `currentPage`. The graph
 * workspace is owned by the app shell (it stays mounted and is toggled), so
 * this router only covers review/insights/system/atlas/routes/help.
 */
export function PageContentRouter({
  currentPage,
  onStartRouteReview,
  onNavigate,
  onOpenCommandPalette,
  onOpenPalaceFromAtlas,
}: {
  currentPage: AppPage;
  onStartRouteReview: (routeId: string) => void;
  onNavigate: (page: AppPage) => void;
  onOpenCommandPalette: () => void;
  onOpenPalaceFromAtlas: (palaceId: string) => void;
}) {
  if (currentPage === "review") {
    return <ReviewPage onStartRouteReview={onStartRouteReview} onOpenPalaceWorkspace={() => onNavigate("graph")} />;
  }

  if (currentPage === "insights") {
    return (
      <div className={PANEL_WRAP}>
        <div className={PANEL_CARD}>
          <AnalyticsPanel />
        </div>
      </div>
    );
  }

  if (currentPage === "system") {
    return (
      <div className={PANEL_WRAP}>
        <div className={PANEL_CARD}>
          <TheSystemWorkbench />
        </div>
      </div>
    );
  }

  if (currentPage === "difficulty") {
    return (
      <div className={PANEL_WRAP}>
        <div className={PANEL_CARD}>
          <DifficultyPanel />
        </div>
      </div>
    );
  }

  if (currentPage === "atlas") {
    return (
      <div className={PANEL_WRAP_HIDDEN}>
        <div className={PANEL_CARD}>
          <AtlasEditorPage onOpenPalace={onOpenPalaceFromAtlas} />
        </div>
      </div>
    );
  }

  if (currentPage === "routes") {
    return (
      <div className={PANEL_WRAP_HIDDEN}>
        <div className={PANEL_CARD}>
          <RouteEditorPage />
        </div>
      </div>
    );
  }

  if (currentPage === "help") {
    return (
      <HelpCenterPage
        onOpenPalaceWorkspace={() => onNavigate("graph")}
        onOpenSystem={() => onNavigate("system")}
        onOpenCommandPalette={onOpenCommandPalette}
      />
    );
  }

  return null;
}
