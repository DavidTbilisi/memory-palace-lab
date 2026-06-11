import { useMemo, type ReactNode } from "react";
import {
  BarChart2,
  BookOpen,
  Cpu,
  Globe,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
} from "lucide-react";
import { Button } from "./ui/button";
import { pageHint, type AppPage } from "../app/memoryPalaceAppHelpers";
import { normalizeLocusSchedule } from "../domain/services/spacedRepetition";
import { usePalaceStore } from "../store/palaceStore";

const PAGES = ["graph", "review", "insights", "system", "atlas", "routes", "help"] as const;

const ICONS: Record<AppPage, ReactNode> = {
  graph: <LayoutDashboard className="h-4 w-4" />,
  review: <BookOpen className="h-4 w-4" />,
  insights: <BarChart2 className="h-4 w-4" />,
  system: <Cpu className="h-4 w-4" />,
  atlas: <Globe className="h-4 w-4" />,
  routes: <ListOrdered className="h-4 w-4" />,
  help: <HelpCircle className="h-4 w-4" />,
};

const LABELS: Record<AppPage, string> = {
  graph: "Graph",
  review: "Review",
  insights: "Insights",
  system: "System",
  atlas: "Atlas",
  routes: "Routes",
  help: "Help",
};

export function PageNavigationBar({
  currentPage,
  onNavigate,
  onHoverHintChange,
}: {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onHoverHintChange: (hint: string | null) => void;
}) {
  const loci = usePalaceStore((s) => s.loci);
  // Due loci for the open palace; nudges the user toward Review without
  // having to remember to check.
  const dueCount = useMemo(() => {
    const nowIso = new Date().toISOString();
    const nowMs = Date.parse(nowIso);
    return loci
      .map((locus) => normalizeLocusSchedule(locus, nowIso))
      .filter((locus) => Date.parse(locus.nextReviewAt ?? nowIso) <= nowMs).length;
  }, [loci]);

  return (
    <nav className="flex items-center justify-center gap-1">
      {PAGES.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "default" : "ghost"}
          onClick={() => onNavigate(page)}
          title={
            page === "review" && dueCount > 0
              ? `Open Review — ${dueCount} loci due now`
              : `Open ${LABELS[page]}`
          }
          onMouseEnter={() => onHoverHintChange(`${LABELS[page]} - ${pageHint(page) || "workspace area"}`)}
          onMouseLeave={() => onHoverHintChange(null)}
          className="relative gap-1.5"
        >
          {ICONS[page]}
          <span className="hidden sm:inline">{LABELS[page]}</span>
          {page === "review" && dueCount > 0 ? (
            <span
              aria-label={`${dueCount} loci due for review`}
              className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-semibold leading-none text-zinc-950"
            >
              {dueCount > 99 ? "99+" : dueCount}
            </span>
          ) : null}
        </Button>
      ))}
    </nav>
  );
}
