import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  BookOpen,
  Cpu,
  Globe,
  LayoutDashboard,
  Layers,
  LibraryBig,
  Settings2,
} from "lucide-react";

/**
 * The single registry of app pages. Navigation, the content router, page
 * hints, and the command palette all derive from `PAGES`, so adding a page is
 * one entry here plus one body in `PageContentRouter`.
 */
export type AppPage =
  | "graph"
  | "review"
  | "insights"
  | "system"
  | "difficulty"
  | "atlas"
  | "library"
  | "settings";

export type PageGroup =
  | "graph"
  | "review"
  | "insights"
  | "system"
  | "library"
  | "settings";

export type PagePlacement = "primary" | "utility";

export type PageDefinition = {
  id: AppPage;
  /** Pages sharing a group render as sub-tabs of one primary nav entry. */
  group: PageGroup;
  label: string;
  groupLabel: string;
  icon: LucideIcon;
  /** One-line orientation hint shown in the header when the page is active or hovered. */
  hint: string | null;
  placement: PagePlacement;
  /** Library document that explains this page ("About this page"). */
  librarySlug?: string;
  palette: {
    subtitle: string;
    keywords?: string;
  };
};

export const PAGES: readonly PageDefinition[] = [
  {
    id: "graph",
    group: "graph",
    label: "Canvas",
    groupLabel: "Graph",
    icon: LayoutDashboard,
    hint: null,
    placement: "primary",
    librarySlug: "app-manual",
    palette: {
      subtitle: "Edit palace structure",
      keywords: "canvas workspace nodes edges",
    },
  },
  {
    id: "atlas",
    group: "graph",
    label: "Atlas map",
    groupLabel: "Graph",
    icon: Globe,
    hint: "Atlas organizes palaces by geography: domain, place, section. Build a hierarchy across multiple spaces.",
    placement: "primary",
    librarySlug: "app-manual",
    palette: {
      subtitle: "Organize palaces by geography",
      keywords: "hierarchy map palaces portals",
    },
  },
  {
    id: "review",
    group: "review",
    label: "Review",
    groupLabel: "Review",
    icon: BookOpen,
    hint: "Review turns routes and recall ratings into an attention queue instead of a loose reading habit.",
    placement: "primary",
    librarySlug: "retrieval-protocol",
    palette: {
      subtitle: "Spaced review queue",
      keywords: "queue walk recall due spaced repetition",
    },
  },
  {
    id: "insights",
    group: "insights",
    label: "Analytics",
    groupLabel: "Insights",
    icon: BarChart2,
    hint: "Insights shows the telemetry behind your graph and review behavior so weak spots become visible.",
    placement: "primary",
    librarySlug: "measurement-framework",
    palette: {
      subtitle: "Analytics and memory strength",
      keywords: "dashboard telemetry analytics stats",
    },
  },
  {
    id: "difficulty",
    group: "insights",
    label: "Difficulty",
    groupLabel: "Insights",
    icon: Layers,
    hint: "Difficulty estimates the learner-relative acquisition cost of each node and the whole palace — walls, order, and what's left to learn.",
    placement: "primary",
    librarySlug: "app-manual",
    palette: {
      subtitle: "Learner-relative difficulty per node",
      keywords: "difficulty acquisition cost walls",
    },
  },
  {
    id: "system",
    group: "system",
    label: "System",
    groupLabel: "System",
    icon: Cpu,
    hint: "System is where theSystem frameworks become runnable thinking pipelines and graph output.",
    placement: "primary",
    librarySlug: "navigator",
    palette: {
      subtitle: "Run frameworks as pipelines",
      keywords: "workbench pipelines navigator",
    },
  },
  {
    id: "library",
    group: "library",
    label: "Library",
    groupLabel: "Library",
    icon: LibraryBig,
    hint: "Library gathers lessons, the theSystem guides, the wiki, the glossary, and reference in one searchable place.",
    placement: "primary",
    librarySlug: "app-manual",
    palette: {
      subtitle: "Guides, wiki, glossary, and lessons",
      keywords: "help docs onboarding lessons tutorial wiki glossary reference",
    },
  },
  {
    id: "settings",
    group: "settings",
    label: "Settings",
    groupLabel: "Settings",
    icon: Settings2,
    hint: "Settings holds the review goal, AI key, idle tips, atlas terminology, backups, and updates.",
    placement: "utility",
    librarySlug: "app-manual",
    palette: {
      subtitle: "Goal, API key, tips, backup, updates",
      keywords: "settings preferences options api key backup restore update",
    },
  },
];

const PAGE_BY_ID: Record<AppPage, PageDefinition> = Object.fromEntries(
  PAGES.map((page) => [page.id, page]),
) as Record<AppPage, PageDefinition>;

export const PRIMARY_PAGES: readonly PageDefinition[] = PAGES.filter(
  (page) => page.placement === "primary",
);

export const PRIMARY_GROUPS: readonly PageGroup[] = PRIMARY_PAGES.reduce<
  PageGroup[]
>((groups, page) => {
  if (!groups.includes(page.group)) groups.push(page.group);
  return groups;
}, []);

export function pageById(id: AppPage): PageDefinition {
  return PAGE_BY_ID[id];
}

export function pagesInGroup(group: PageGroup): PageDefinition[] {
  return PAGES.filter((page) => page.group === group);
}

export function defaultPageForGroup(group: PageGroup): AppPage {
  return pagesInGroup(group)[0]?.id ?? "graph";
}

/** One-line orientation hint shown beneath each non-graph page header. */
export function pageHint(page: AppPage): string | null {
  return PAGE_BY_ID[page]?.hint ?? null;
}

export function isAppPage(value: unknown): value is AppPage {
  return typeof value === "string" && value in PAGE_BY_ID;
}

/**
 * Page ids that used to exist (or still do) and what they mean now. Stored
 * values such as palette recents and the persisted shell layout go through
 * here so a removed page never strands a user on a blank screen.
 */
const PAGE_ALIASES: Record<string, ResolvedNavigation> = {
  help: { page: "library" },
  routes: { page: "graph", openRoutePanel: true },
};

export type NavigationTarget = AppPage | "help" | "routes";

export type ResolvedNavigation = {
  page: AppPage;
  /** Open the in-canvas route panel after landing on the graph. */
  openRoutePanel?: boolean;
};

export function resolveNavigationTarget(target: string): ResolvedNavigation {
  if (isAppPage(target)) return { page: target };
  const alias = PAGE_ALIASES[target];
  if (alias) return alias;
  return { page: "graph" };
}

/** "Open Insights" for a group's default page, "Open Insights: Difficulty" for the others. */
export function pagePaletteTitle(page: PageDefinition): string {
  const isDefault = defaultPageForGroup(page.group) === page.id;
  return isDefault
    ? `Open ${page.groupLabel}`
    : `Open ${page.groupLabel}: ${page.label}`;
}

/** Command-palette command id for a page; stable so recents survive renames. */
export function pagePaletteId(page: AppPage): string {
  return `page-${page}`;
}
