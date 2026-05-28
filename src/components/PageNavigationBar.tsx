import type { ReactNode } from "react";
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
  return (
    <nav className="flex items-center justify-center gap-1">
      {PAGES.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "default" : "ghost"}
          onClick={() => onNavigate(page)}
          title={`Open ${LABELS[page]}`}
          onMouseEnter={() => onHoverHintChange(`${LABELS[page]} - ${pageHint(page) || "workspace area"}`)}
          onMouseLeave={() => onHoverHintChange(null)}
          className="gap-1.5"
        >
          {ICONS[page]}
          <span className="hidden sm:inline">{LABELS[page]}</span>
        </Button>
      ))}
    </nav>
  );
}
