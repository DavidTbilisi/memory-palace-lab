import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePalaceStore } from "../store/palaceStore";

export function PalaceSidebar() {
  const palaces = usePalaceStore((s) => s.palaces);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const openPalace = usePalaceStore((s) => s.openPalace);
  const createPalace = usePalaceStore((s) => s.createPalace);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const [name, setName] = useState("My palace");

  useEffect(() => {
    void loadPalaces();
  }, [loadPalaces]);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-2">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">Palaces</div>
        <div className="mt-2 flex gap-1">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="h-8 text-xs" />
          <Button
            size="sm"
            className="shrink-0 px-2"
            type="button"
            aria-label="Create palace"
            onClick={() => void createPalace(name)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto p-1">
        {palaces.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => void openPalace(p.id)}
              className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
                currentPalace?.id === p.id ? "bg-violet-900/40 text-violet-100" : "text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
