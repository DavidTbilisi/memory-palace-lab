import { Button } from "./ui/button";
import {
  PRIMARY_GROUPS,
  defaultPageForGroup,
  pageById,
  pageHint,
  pagesInGroup,
  type AppPage,
} from "../app/pages";
import { useDueQueue } from "./hooks/useDueQueue";
import { cn } from "../utils/cn";

/**
 * Primary navigation: one button per page group. The active group shows its
 * pages as an inline pill strip so secondary views never cost a second row.
 */
export function PageNavigationBar({
  currentPage,
  onNavigate,
  onHoverHintChange,
}: {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onHoverHintChange: (hint: string | null) => void;
}) {
  // Due loci across every palace; nudges the user toward Review without
  // having to remember to check.
  const { dueCountAll: dueCount } = useDueQueue();

  const activeGroup = pageById(currentPage).group;

  return (
    <nav className="flex items-center justify-center gap-1">
      {PRIMARY_GROUPS.map((group) => {
        const pages = pagesInGroup(group);
        const primary = pageById(defaultPageForGroup(group));
        const Icon = primary.icon;
        const active = group === activeGroup;
        const label = primary.groupLabel;
        return (
          <div key={group} className="flex items-center gap-1">
            <Button
              data-nav-primary={group}
              size="sm"
              variant={active ? "default" : "ghost"}
              onClick={() => onNavigate(active ? currentPage : primary.id)}
              title={
                group === "review" && dueCount > 0
                  ? `Open Review — ${dueCount} loci due across all palaces`
                  : `Open ${label}`
              }
              onMouseEnter={() =>
                onHoverHintChange(
                  `${label} - ${pageHint(primary.id) || "workspace area"}`,
                )
              }
              onMouseLeave={() => onHoverHintChange(null)}
              className="relative gap-1.5"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              {group === "review" && dueCount > 0 ? (
                <span
                  aria-label={`${dueCount} loci due for review`}
                  className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-semibold leading-none text-zinc-950"
                >
                  {dueCount > 99 ? "99+" : dueCount}
                </span>
              ) : null}
            </Button>
            {active && pages.length > 1 ? (
              <div
                role="tablist"
                aria-label={`${label} views`}
                className="flex items-center gap-0.5 rounded-md border border-zinc-800 bg-zinc-900/60 p-0.5"
              >
                {pages.map((page) => {
                  const selected = page.id === currentPage;
                  return (
                    <button
                      key={page.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      title={`Open ${label}: ${page.label}`}
                      onClick={() => onNavigate(page.id)}
                      onMouseEnter={() =>
                        onHoverHintChange(
                          `${page.label} - ${pageHint(page.id) || "workspace area"}`,
                        )
                      }
                      onMouseLeave={() => onHoverHintChange(null)}
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-medium transition",
                        selected
                          ? "bg-zinc-200 text-zinc-950"
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                      )}
                    >
                      {page.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
