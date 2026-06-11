import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import { confirmDestructive } from "../utils/confirmDestructive";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
export function RouteEditorPage() {
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const addRoute = usePalaceStore((s) => s.addRoute);
  const updateRouteName = usePalaceStore((s) => s.updateRouteName);
  const moveRoute = usePalaceStore((s) => s.moveRoute);
  const deleteRoute = usePalaceStore((s) => s.deleteRoute);
  const updateLocusLabel = usePalaceStore((s) => s.updateLocusLabel);
  const moveLocus = usePalaceStore((s) => s.moveLocus);
  const deleteLocus = usePalaceStore((s) => s.deleteLocus);

  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const [routeNameEdits, setRouteNameEdits] = useState<Record<string, string>>({});
  const [newRouteName, setNewRouteName] = useState("");

  useEffect(() => {
    const edits: Record<string, string> = {};
    for (const route of routes) {
      edits[route.id] = route.name;
    }
    setRouteNameEdits(edits);
  }, [routes]);

  const routeSteps = useMemo(() => {
    const map = new Map<string, typeof loci>();
    for (const locus of loci) {
      if (!map.has(locus.routeId)) {
        map.set(locus.routeId, []);
      }
      map.get(locus.routeId)!.push(locus);
    }
    for (const steps of map.values()) {
      steps.sort((a, b) => a.orderIndex - b.orderIndex);
    }
    return map;
  }, [loci]);

  const handleAddRoute = () => {
    if (newRouteName.trim()) {
      addRoute(newRouteName.trim());
      setNewRouteName("");
    }
  };

  const handleCommitRouteName = (routeId: string) => {
    const newName = routeNameEdits[routeId]?.trim();
    if (newName && newName !== routes.find((r) => r.id === routeId)?.name) {
      updateRouteName(routeId, newName);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-4 py-3 shrink-0">
        <h2 className="text-lg font-semibold text-zinc-100">Routes</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-400">
          Organize memory palaces as ordered sequences of loci. Each route is a walk through your palace.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          {routes.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-zinc-500">
              No routes yet. Create one to begin organizing loci.
            </div>
          ) : (
            routes.map((route, index) => {
              const steps = routeSteps.get(route.id) ?? [];
              const isExpanded = expandedRouteId === route.id;

              return (
                <div
                  key={route.id}
                  className="rounded-md border border-zinc-800 bg-zinc-950/50 overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => setExpandedRouteId(isExpanded ? null : route.id)}
                      aria-expanded={isExpanded}
                      className="shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-zinc-400" />
                      )}
                    </button>

                    <Input
                      aria-label={`Route ${index + 1} name`}
                      className="h-8 flex-1 text-sm"
                      value={routeNameEdits[route.id] ?? ""}
                      onChange={(e) =>
                        setRouteNameEdits((prev) => ({
                          ...prev,
                          [route.id]: e.target.value,
                        }))
                      }
                      onBlur={() => handleCommitRouteName(route.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCommitRouteName(route.id);
                          e.currentTarget.blur();
                        }
                      }}
                    />

                    <span className="text-xs text-zinc-500 shrink-0">
                      {steps.length} {steps.length === 1 ? "step" : "steps"}
                    </span>

                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        disabled={index === 0}
                        aria-label={`Move route ${index + 1} up`}
                        onClick={() => moveRoute(route.id, "up")}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        disabled={index === routes.length - 1}
                        aria-label={`Move route ${index + 1} down`}
                        onClick={() => moveRoute(route.id, "down")}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        aria-label={`Delete route ${index + 1}`}
                        onClick={() => {
                          void (async () => {
                            const stepCount = routeSteps.get(route.id)?.length ?? 0;
                            const ok = await confirmDestructive(
                              `Delete route "${route.name}"${stepCount > 0 ? ` and its ${stepCount} loci (review schedules included)` : ""}? This cannot be undone.`,
                            );
                            if (ok) deleteRoute(route.id);
                          })();
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && steps.length > 0 && (
                    <div className="border-t border-zinc-800 bg-zinc-900/40 p-3 space-y-2">
                      {steps.map((locus, stepIndex) => (
                        <div
                          key={locus.id}
                          className="flex items-center gap-2 text-xs bg-zinc-950/50 rounded p-2"
                          data-locus-label={locus.label}
                        >
                          <span className="w-6 text-zinc-500 shrink-0">{stepIndex + 1}.</span>
                          <Input
                            className="h-6 flex-1 text-xs"
                            value={locus.label || ""}
                            onChange={(e) => updateLocusLabel(locus.id, e.target.value)}
                            aria-label={`Step ${stepIndex + 1} label`}
                          />
                          <div className="flex gap-1 shrink-0">
                            <Button
                              size="sm"
                              type="button"
                              variant="ghost"
                              className="h-6 px-2"
                              disabled={stepIndex === 0}
                              onClick={() => moveLocus(locus.id, "up")}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              type="button"
                              variant="ghost"
                              className="h-6 px-2"
                              disabled={stepIndex === steps.length - 1}
                              onClick={() => moveLocus(locus.id, "down")}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              type="button"
                              variant="ghost"
                              className="h-6 px-2"
                              aria-label={`Delete step ${stepIndex + 1}`}
                              onClick={() => deleteLocus(locus.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950/95 p-3 shrink-0">
        <div className="flex gap-2">
          <Input
            className="flex-1 h-8 text-sm"
            placeholder="Route name"
            value={newRouteName}
            onChange={(e) => setNewRouteName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddRoute();
              }
            }}
          />
          <Button
            size="sm"
            type="button"
            onClick={handleAddRoute}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add route
          </Button>
        </div>
      </div>
    </div>
  );
}
