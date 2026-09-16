import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { usePalaceStore } from "../store/palaceStore";
import { cn } from "../utils/cn";
import { NodeInspector } from "./NodeInspector";
import { RoutesPanel } from "./RoutesPanel";

function Tab({
  id,
  selected,
  onSelect,
  onKeyDown,
  tabRef,
  children,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  tabRef: (element: HTMLButtonElement | null) => void;
  children: ReactNode;
}) {
  return (
    <button
      ref={tabRef}
      id={`side-tab-${id}`}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls="side-tabpanel"
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={cn(
        "-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500",
        selected ? "border-violet-400 text-zinc-50" : "border-transparent text-zinc-400 hover:text-zinc-200",
      )}
    >
      {children}
    </button>
  );
}

/** Right-hand column beside the canvas: the node inspector and the Routes tab. */
export function RightPanel() {
  const routesOpen = usePalaceStore((s) => s.routePanelOpen);
  const setRoutePanelOpen = usePalaceStore((s) => s.setRoutePanelOpen);
  const routeCount = usePalaceStore((s) => s.routes.length);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextRoutes = event.key === "End" || (event.key !== "Home" && !routesOpen);
    setRoutePanelOpen(nextRoutes);
    tabs.current[nextRoutes ? "routes" : "node"]?.focus();
  };

  return (
    <aside
      aria-label="Side panel"
      className="flex w-72 shrink-0 flex-col border-l border-zinc-800 bg-zinc-950"
    >
      <div role="tablist" aria-label="Side panel" className="flex shrink-0 items-end gap-1 border-b border-zinc-800 px-2 pt-1">
        <Tab
          id="node"
          selected={!routesOpen}
          onSelect={() => setRoutePanelOpen(false)}
          onKeyDown={onKeyDown}
          tabRef={(element) => {
            tabs.current.node = element;
          }}
        >
          Node
        </Tab>
        <Tab
          id="routes"
          selected={routesOpen}
          onSelect={() => setRoutePanelOpen(true)}
          onKeyDown={onKeyDown}
          tabRef={(element) => {
            tabs.current.routes = element;
          }}
        >
          Routes
          {routeCount > 0 ? (
            <span className="rounded-full bg-zinc-800 px-1.5 text-[10px] leading-4 text-zinc-300">{routeCount}</span>
          ) : null}
        </Tab>
      </div>
      <div
        id="side-tabpanel"
        role="tabpanel"
        aria-labelledby={routesOpen ? "side-tab-routes" : "side-tab-node"}
        className="flex min-h-0 flex-1 flex-col"
      >
        {routesOpen ? <RoutesPanel /> : <NodeInspector />}
      </div>
    </aside>
  );
}
