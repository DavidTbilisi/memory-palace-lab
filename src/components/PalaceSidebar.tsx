import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Image, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import type { Palace, PalaceSnapshot } from "../domain/entities/types";
import { insertBackgroundImageFromFile } from "../canvas/backgroundImageImport";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { composeAtlasPath, DEFAULT_ATLAS_LEVEL_LABELS, splitAtlasPath } from "../domain/services/atlasHierarchy";
import { usePalaceStore } from "../store/palaceStore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const repo = getPalaceRepository();

type BackupFile = { version: number; exportedAt: string; palaces: PalaceSnapshot[] };

type AtlasTreeNode = {
  key: string;
  label: string;
  children: AtlasTreeNode[];
  palaces: Palace[];
};

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
      {palace.alias?.trim() ? <div className="text-[11px] text-violet-300">Alias: {palace.alias}</div> : null}
      {palace.atlasPath?.trim() ? <div className="text-[11px] text-zinc-500">{palace.atlasPath}</div> : null}
    </button>
  );
}

function formatTrashLabel(palace: Palace) {
  if (!palace.purgeAt) return "Scheduled for permanent deletion";
  return `Purges on ${new Date(palace.purgeAt).toLocaleDateString()}`;
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

export function PalaceSidebar({ onOpenImport }: { onOpenImport?: () => void }) {
  const palaces = usePalaceStore((s) => s.palaces);
  const trashedPalaces = usePalaceStore((s) => s.trashedPalaces) ?? [];
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const deletePalace = usePalaceStore((s) => s.deletePalace);
  const restorePalace = usePalaceStore((s) => s.restorePalace);
  const purgePalace = usePalaceStore((s) => s.purgePalace);
  const saveCurrent = usePalaceStore((s) => s.saveCurrent);
  const setCurrentPalaceMeta = usePalaceStore((s) => s.setCurrentPalaceMeta);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const [name, setName] = useState("My palace");
  const [atlasPath, setAtlasPath] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentAlias, setCurrentAlias] = useState("");
  const [currentAtlasPath, setCurrentAtlasPath] = useState("");
  const [levelLabels, setLevelLabels] = useState(DEFAULT_ATLAS_LEVEL_LABELS);
  const [hierarchySegments, setHierarchySegments] = useState<string[]>([]);
  const [backupBusy, setBackupBusy] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadPalaces();
  }, [loadPalaces]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mp-atlas-level-labels");
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")) {
        setLevelLabels(parsed.length > 0 ? parsed : DEFAULT_ATLAS_LEVEL_LABELS);
      }
    } catch {
      setLevelLabels(DEFAULT_ATLAS_LEVEL_LABELS);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("mp-atlas-level-labels", JSON.stringify(levelLabels));
  }, [levelLabels]);

  useEffect(() => {
    setCurrentName(currentPalace?.name ?? "");
    setCurrentAlias(currentPalace?.alias ?? "");
    setCurrentAtlasPath(currentPalace?.atlasPath ?? "");
    setHierarchySegments(splitAtlasPath(currentPalace?.atlasPath));
  }, [currentPalace?.alias, currentPalace?.atlasPath, currentPalace?.name]);

  const groupedPalaces = useMemo(() => buildAtlasTree(palaces), [palaces]);
  const hierarchyRowCount = Math.max(levelLabels.length, hierarchySegments.length + 1, DEFAULT_ATLAS_LEVEL_LABELS.length);

  const handleExportBackup = async () => {
    setBackupBusy(true);
    try {
      const snapshots = await Promise.all(palaces.map((p) => repo.loadPalace(p.id)));
      const valid = snapshots.filter((s): s is PalaceSnapshot => s !== null);
      const backup: BackupFile = {
        version: 1,
        exportedAt: new Date().toISOString(),
        palaces: valid,
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memory-palace-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBackupBusy(false);
    }
  };

  const handleImportBackup = async (file: File) => {
    setBackupBusy(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as BackupFile;
      if (!Array.isArray(parsed.palaces)) throw new Error("Invalid backup file");
      for (const snapshot of parsed.palaces) {
        await repo.savePalace(snapshot);
      }
      await loadPalaces();
    } catch (err) {
      window.alert(`Import failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBackupBusy(false);
      if (importFileRef.current) importFileRef.current.value = "";
    }
  };

  const updateLevelLabel = (index: number, value: string) => {
    setLevelLabels((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const updateHierarchySegment = (index: number, value: string) => {
    setHierarchySegments((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

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
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-center"
            type="button"
            onClick={() => onOpenImport?.()}
            disabled={!currentPalace}
            title={currentPalace ? "Import notes into current palace" : "Open a palace first to import notes"}
          >
            Import notes
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="justify-center"
              type="button"
              disabled={backupBusy || palaces.length === 0}
              onClick={() => void handleExportBackup()}
              title="Download all palaces as a JSON backup"
            >
              <Download className="h-3.5 w-3.5" />
              Backup
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="justify-center"
              type="button"
              disabled={backupBusy}
              onClick={() => importFileRef.current?.click()}
              title="Restore palaces from a JSON backup file"
            >
              <Upload className="h-3.5 w-3.5" />
              Restore
            </Button>
          </div>
          <input
            ref={importFileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImportBackup(file);
            }}
          />
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
              aria-label="Current palace alias"
              value={currentAlias}
              onChange={(e) => setCurrentAlias(e.target.value)}
              placeholder="Alias"
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
                setCurrentPalaceMeta({ name: currentName, alias: currentAlias, atlasPath: currentAtlasPath });
                void saveCurrent();
              }}
            >
              <Save className="h-4 w-4" />
              Save details
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full justify-center"
              type="button"
              disabled={!editorRef || !currentPalace}
              onClick={() => {
                if (!editorRef || !currentPalace) return;
                void insertBackgroundImageFromFile(editorRef, currentPalace.id);
              }}
            >
              <Image className="h-4 w-4" />
              Set background
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center text-amber-200 hover:text-amber-100"
              type="button"
              onClick={() => {
                if (!currentPalace) return;
                if (!window.confirm(`Move "${currentPalace.name}" to trash for 30 days?`)) return;
                void deletePalace(currentPalace.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Move to trash
            </Button>
            <details className="rounded-md border border-zinc-800 bg-zinc-900/40 p-2">
              <summary className="cursor-pointer select-none text-xs font-medium uppercase tracking-wide text-zinc-500">
                Hierarchy editor
              </summary>
              <div className="mt-2 space-y-3">
                <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Terminology</div>
                  <div className="mt-2 space-y-2">
                    {Array.from({ length: hierarchyRowCount }).map((_, index) => (
                      <Input
                        key={`level-label-${index}`}
                        aria-label={`Atlas level ${index + 1} name`}
                        value={levelLabels[index] ?? ""}
                        onChange={(e) => updateLevelLabel(index, e.target.value)}
                        placeholder={`Level ${index + 1}`}
                        className="h-8 text-xs"
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 w-full justify-center"
                    type="button"
                    onClick={() => setLevelLabels((current) => [...current, `Level ${current.length + 1}`])}
                  >
                    Add level
                  </Button>
                </div>
                <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Current palace outline</div>
                  <div className="mt-2 space-y-2">
                    {Array.from({ length: hierarchyRowCount }).map((_, index) => {
                      const label = levelLabels[index]?.trim() || `Level ${index + 1}`;
                      return (
                        <div key={`hierarchy-segment-${index}`} className="grid grid-cols-[6rem_1fr] items-center gap-2">
                          <div className="truncate text-[11px] text-zinc-500" title={label}>
                            {label}
                          </div>
                          <Input
                            aria-label={`${label} segment`}
                            value={hierarchySegments[index] ?? ""}
                            onChange={(e) => updateHierarchySegment(index, e.target.value)}
                            placeholder={index === 0 ? "e.g. Course" : "Optional"}
                            className="h-8 text-xs"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 w-full justify-center"
                    type="button"
                    onClick={() => {
                      const atlasPath = composeAtlasPath(hierarchySegments);
                      setCurrentAtlasPath(atlasPath);
                      setCurrentPalaceMeta({ atlasPath });
                      void saveCurrent();
                    }}
                  >
                    Save hierarchy
                  </Button>
                </div>
              </div>
            </details>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-2">
        {groupedPalaces.map((group) => (
          <AtlasBranch key={group.key} node={group} currentPalaceId={currentPalace?.id ?? null} onOpen={(palaceId) => void openPalace(palaceId)} />
        ))}
        {trashedPalaces.length > 0 ? (
          <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-900/30 p-2">
            <div className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Trash</div>
            <div className="space-y-2">
              {trashedPalaces.map((palace) => (
                <div key={palace.id} className="rounded-md border border-zinc-800 bg-zinc-950/50 px-2 py-2">
                  <div className="text-sm text-zinc-200">{palace.name}</div>
                  {palace.atlasPath?.trim() ? <div className="text-[11px] text-zinc-500">{palace.atlasPath}</div> : null}
                  <div className="mt-1 text-[11px] text-zinc-500">{formatTrashLabel(palace)}</div>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      type="button"
                      onClick={() => void restorePalace(palace.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Permanently delete "${palace.name}" now?`)) return;
                        void purgePalace(palace.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
