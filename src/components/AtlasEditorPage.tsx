import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { usePalaceStore } from "../store/palaceStore";
import { splitAtlasPath } from "../domain/services/atlasHierarchy";
import { Button } from "./ui/button";

type Props = {
  onOpenPalace: (palaceId: string) => void;
};

type AtlasNode = {
  path: string;
  label: string;
  level: number;
  palaceCount: number;
  children: AtlasNode[];
};

export function AtlasEditorPage({ onOpenPalace }: Props) {
  const palaces = usePalaceStore((s) => s.palaces);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"outline" | "graph">("outline");

  const atlasTree = useMemo(() => {
    const nodeMap = new Map<string, AtlasNode>();

    // Build all unique paths
    const paths = new Set<string>();
    for (const palace of palaces) {
      const segments = splitAtlasPath(palace.atlasPath);
      let currentPath = "";
      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        paths.add(currentPath);
      }
    }

    // Count palaces per path
    const pathCounts = new Map<string, number>();
    for (const palace of palaces) {
      const segments = splitAtlasPath(palace.atlasPath);
      let currentPath = "";
      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        pathCounts.set(currentPath, (pathCounts.get(currentPath) ?? 0) + 1);
      }
    }

    // Create nodes
    for (const path of paths) {
      const segments = splitAtlasPath(path);
      const label = segments[segments.length - 1];
      const parentPath = segments.slice(0, -1).join("/");

      nodeMap.set(path, {
        path,
        label,
        level: segments.length,
        palaceCount: pathCounts.get(path) ?? 0,
        children: [],
      });
    }

    // Build hierarchy
    const roots: AtlasNode[] = [];
    for (const [path, node] of nodeMap) {
      const segments = splitAtlasPath(path);
      if (segments.length === 1) {
        roots.push(node);
      } else {
        const parentPath = segments.slice(0, -1).join("/");
        const parent = nodeMap.get(parentPath);
        if (parent) {
          parent.children.push(node);
        }
      }
    }

    return roots.sort((a, b) => a.label.localeCompare(b.label));
  }, [palaces]);

  const toggleExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderOutlineNode = (node: AtlasNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedPaths.has(node.path);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.path} className="select-none">
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-zinc-800/50 rounded cursor-pointer"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          data-atlas-level={node.level}
        >
          {hasChildren && (
            <button
              type="button"
              className="shrink-0"
              onClick={() => toggleExpanded(node.path)}
              aria-expanded={isExpanded}
              data-expand-button
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          <button
            type="button"
            onClick={() => {
              // Find palaces at this path and open the first one
              const palaceAtPath = palaces.find((p) => p.atlasPath === node.path);
              if (palaceAtPath) {
                onOpenPalace(palaceAtPath.id);
              }
            }}
            className={`flex-1 text-sm text-left flex items-center gap-2 ${
              currentPalace?.atlasPath === node.path ? "text-violet-300 font-semibold" : "text-zinc-300"
            }`}
            data-active-palace={currentPalace?.atlasPath === node.path ? "true" : undefined}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            {node.label}
            {node.palaceCount > 0 && (
              <span className="text-xs text-zinc-500 ml-auto">({node.palaceCount})</span>
            )}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderOutlineNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-zinc-800 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Atlas Hierarchy</h2>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Organize palaces by geography: domain, place, section
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "outline" ? "default" : "secondary"}
              onClick={() => setViewMode("outline")}
            >
              Outline
            </Button>
            <Button
              size="sm"
              variant={viewMode === "graph" ? "default" : "secondary"}
              onClick={() => setViewMode("graph")}
            >
              Graph
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "outline" ? (
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {atlasTree.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-zinc-500">
              No palaces yet. Create one to build your atlas.
            </div>
          ) : (
            <div>
              {atlasTree.map((root) => renderOutlineNode(root, 0))}
            </div>
          )}
        </div>
      ) : (
        <div data-graph-view className="flex-1 overflow-auto bg-zinc-900/20 rounded-md m-3 p-4 flex items-center justify-center text-sm text-zinc-500">
          Graph view coming soon — interactive hierarchy visualization with drag-to-rearrange
        </div>
      )}
    </div>
  );
}
