import type { ReactNode } from "react";
import { CircleHelp } from "lucide-react";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { AtlasEditorPage } from "./AtlasEditorPage";
import { DifficultyPanel } from "./DifficultyPanel";
import { LibraryPage, type LibraryTarget } from "./LibraryPage";
import { ReviewPage } from "./ReviewPage";
import { SettingsPage } from "./SettingsPage";
import { TheSystemWorkbench } from "./TheSystemWorkbench";
import { pageById, type AppPage } from "../app/pages";
import type { LibrarySection } from "../content/library";

const PANEL_WRAP = "min-h-0 flex-1 overflow-y-auto p-5";
const PANEL_WRAP_HIDDEN = "min-h-0 flex-1 overflow-hidden p-5";
const PANEL_CARD =
  "relative h-full rounded-[30px] border border-zinc-800 bg-zinc-950/45 p-5";

export type OpenLibraryTarget = {
  section?: LibrarySection;
  slug?: string;
  anchor?: string;
};

export type PageContentRouterProps = {
  currentPage: AppPage;
  libraryTarget: LibraryTarget | null;
  onNavigate: (page: AppPage) => void;
  onOpenCommandPalette: () => void;
  onOpenPalaceFromAtlas: (palaceId: string) => void;
  onOpenLibrary: (target: OpenLibraryTarget) => void;
};

type BodyProps = Omit<PageContentRouterProps, "currentPage">;

function AboutPageLink({
  page,
  onOpenLibrary,
}: {
  page: AppPage;
  onOpenLibrary: BodyProps["onOpenLibrary"];
}) {
  const slug = pageById(page).librarySlug;
  if (!slug) return null;
  return (
    <button
      type="button"
      aria-label="About this page"
      title="About this page (opens the Library)"
      onClick={() => onOpenLibrary({ slug })}
      className="absolute right-4 top-4 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-400 transition hover:border-violet-500/60 hover:text-violet-200"
    >
      <CircleHelp className="h-4 w-4" />
    </button>
  );
}

function card(
  page: AppPage,
  children: ReactNode,
  props: BodyProps,
  wrap = PANEL_WRAP,
) {
  return (
    <div className={wrap}>
      <div className={PANEL_CARD}>
        <AboutPageLink page={page} onOpenLibrary={props.onOpenLibrary} />
        {children}
      </div>
    </div>
  );
}

/**
 * Page bodies keyed by page id. The graph workspace is owned by the app shell
 * (it stays mounted and is toggled), so every other page in the registry must
 * have an entry here — a missing one is a type error.
 */
const PAGE_BODIES: Record<
  Exclude<AppPage, "graph">,
  (props: BodyProps) => ReactNode
> = {
  review: ({ onNavigate }) => <ReviewPage onOpenPalaceWorkspace={() => onNavigate("graph")} />,
  insights: (props) => card("insights", <AnalyticsPanel />, props),
  system: (props) =>
    card(
      "system",
      <TheSystemWorkbench
        onOpenGuide={(slug) => props.onOpenLibrary({ section: "guides", slug })}
      />,
      props,
    ),
  difficulty: (props) => card("difficulty", <DifficultyPanel />, props),
  atlas: (props) =>
    card(
      "atlas",
      <AtlasEditorPage onOpenPalace={props.onOpenPalaceFromAtlas} />,
      props,
      PANEL_WRAP_HIDDEN,
    ),
  settings: (props) => card("settings", <SettingsPage />, props),
  library: ({ libraryTarget, onNavigate, onOpenCommandPalette }) => (
    <LibraryPage
      target={libraryTarget}
      onOpenPalaceWorkspace={() => onNavigate("graph")}
      onOpenSystem={() => onNavigate("system")}
      onOpenCommandPalette={onOpenCommandPalette}
    />
  ),
};

/** Renders the non-graph page body for `currentPage`; nothing for the graph. */
export function PageContentRouter({
  currentPage,
  ...props
}: PageContentRouterProps) {
  if (currentPage === "graph") return null;
  const body = PAGE_BODIES[currentPage];
  return body ? <>{body(props)}</> : null;
}
