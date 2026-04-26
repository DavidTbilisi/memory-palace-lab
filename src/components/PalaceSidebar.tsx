import { useEffect, useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import type { Palace } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type AtlasTreeNode = {
  key: string;
  label: string;
  children: AtlasTreeNode[];
  palaces: Palace[];
};

function splitAtlasPath(path: string | null | undefined) {
  return (path ?? "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function buildAtlasTree(palaces: Palace[]): AtlasTreeNode[] {
  type MutableNode = AtlasTreeNode & { childMap: Map<string, MutableNode> };
  const root: MutableNode = {
    key: "root",
    label: "root",
    children: [],
    palaces: [],
    childMap: new Map<string, MutableNode>(),
  };

  for (const palace of palaces) {
    const segments = splitAtlasPath(palace.atlasPath);
    if (segments.length === 0) {
      root.palaces.push(palace);
      continue;
    }

    let cursor = root;
    const path: string[] = [];
    for (const segment of segments) {
      path.push(segment);
      let child = cursor.childMap.get(segment);
      if (!child) {
        child = {
          key: path.join("/"),
          label: segment,
          children: [],
          palaces: [],
          childMap: new Map<string, MutableNode>(),
        };
        cursor.childMap.set(segment, child);
      }
      cursor = child;
    }
    cursor.palaces.push(palace);
  }

  const finalize = (node: MutableNode): AtlasTreeNode => {
    const children = [...node.childMap.values()]
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(finalize);
    const palaces = node.palaces.slice().sort((a, b) => a.name.localeCompare(b.name));
    return {
      key: node.key,
      label: node.label,
      children,
      palaces,
    };
  };

  const finalized = finalize(root);
  const groups = finalized.children;
  if (finalized.palaces.length > 0) {
    groups.unshift({
      key: "ungrouped",
      label: "Ungrouped",
      children: [],
      palaces: finalized.palaces,
    });
  }
  return groups;
}

function PalaceListItem({
  palace,
  currentPalaceId,
  onOpen,
}: {
  palace: Palace;
  currentPalaceId: string | null;
  onOpen: (palaceId: string) => void;
}) {
  const active = currentPalaceId === palace.id;
  return (
    <button
      type="button"
      onClick={() => onOpen(palace.id)}
      className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
        active ? "bg-violet-900/40 text-violet-100" : "text-zinc-300 hover:bg-zinc-900"
      }`}
    >
      <div>{palace.name}</div>
      {palace.atlasPath?.trim() ? <div className="text-[11px] text-zinc-500">{palace.atlasPath}</div> : null}
    </button>
  );
}

function AtlasBranch({
  node,
  currentPalaceId,
  onOpen,
}: {
  node: AtlasTreeNode;
  currentPalaceId: string | null;
  onOpen: (palaceId: string) => void;
}) {
  return (
    <details open className="rounded-md">
      <summary className="cursor-pointer select-none rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500 hover:bg-zinc-900">
        {node.label}
      </summary>
      <div className="ml-2 mt-1 space-y-1 border-l border-zinc-800 pl-2">
        {node.children.map((child) => (
          <AtlasBranch key={child.key} node={child} currentPalaceId={currentPalaceId} onOpen={onOpen} />
        ))}
        {node.palaces.map((palace) => (
          <PalaceListItem key={palace.id} palace={palace} currentPalaceId={currentPalaceId} onOpen={onOpen} />
        ))}
      </div>
    </details>
  );
}

export function PalaceSidebar() {
  const palaces = usePalaceStore((s) => s.palaces);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const setCurrentPalaceMeta = usePalaceStore((s) => s.setCurrentPalaceMeta);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const [name, setName] = useState("My palace");
  const [atlasPath, setAtlasPath] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentAtlasPath, setCurrentAtlasPath] = useState("");

  useEffect(() => {
    void loadPalaces();
  }, [loadPalaces]);

  useEffect(() => {
    setCurrentName(currentPalace?.name ?? "");
    setCurrentAtlasPath(currentPalace?.atlasPath ?? "");
  }, [currentPalace?.atlasPath, currentPalace?.name]);

  const groupedPalaces = useMemo(() => buildAtlasTree(palaces), [palaces]);

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-2">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Atlas</div>
        <div className="mt-2 space-y-2">
          <Input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Palace name"
            className="h-8 text-xs"
          />
          <Input
            aria-label="Atlas path"
            value={atlasPath}
            onChange={(e) => setAtlasPath(e.target.value)}
            placeholder="Atlas path: Country/City/District"
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            className="w-full justify-center"
            type="button"
            aria-label="Create palace"
            onClick={() => void createPalace(name, atlasPath)}
          >
            <Plus className="h-4 w-4" />
            Create palace
          </Button>
        </div>
      </div>

      {currentPalace ? (
        <div className="border-b border-zinc-800 p-2">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Current palace</div>
          <div className="mt-2 space-y-2">
            <Input
              aria-label="Current palace name"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="Palace name"
              className="h-8 text-xs"
            />
            <Input
              aria-label="Current atlas path"
              value={currentAtlasPath}
              onChange={(e) => setCurrentAtlasPath(e.target.value)}
              placeholder="Atlas path"
              className="h-8 text-xs"
            />
            <Button
              size="sm"
              variant="secondary"
              className="w-full justify-center"
              type="button"
              onClick={() => {
                setCurrentPalaceMeta({ name: currentName, atlasPath: currentAtlasPath });
                void saveCurrent();
              }}
            >
              <Save className="h-4 w-4" />
              Save details
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-2">
        {groupedPalaces.map((group) => (
          <AtlasBranch key={group.key} node={group} currentPalaceId={currentPalace?.id ?? null} onOpen={(palaceId) => void openPalace(palaceId)} />
        ))}
      </div>
    </aside>
  );
}
