import { AlertTriangle, Loader2, Lock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSyncStore } from "../store/syncStore";
import { IS_TAURI_RUNTIME } from "../infrastructure/appUpdater";
import { Button } from "./ui/button";

function ago(iso: string, now: number): string {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

/**
 * Sync's state in the header, so it is never a mystery whether this device is connected,
 * locked, or behind. Hidden until a vault is connected: sync is optional, and a chip for a
 * feature nobody turned on is noise.
 *
 * Clicking syncs when that is the obvious next step; otherwise it opens the Sync card, which
 * is where the passphrase, the conflicts and any error are dealt with.
 */
export function SyncStatusChip({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const status = useSyncStore((s) => s.status);
  const dir = useSyncStore((s) => s.dir);
  const unlocked = useSyncStore((s) => s.unlocked);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const conflicts = useSyncStore((s) => s.conflicts.length);
  const error = useSyncStore((s) => s.error);
  const syncNow = useSyncStore((s) => s.syncNow);
  const requestAttention = useSyncStore((s) => s.requestAttention);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!IS_TAURI_RUNTIME || !dir) return null;

  const openCard = () => {
    onOpenSettings?.();
    // After the page switch, so the card exists to scroll to.
    setTimeout(requestAttention, 0);
  };

  let icon = <RefreshCw className="h-4 w-4" />;
  let label: string;
  let title: string;
  let tone = "text-zinc-300";
  let onClick: () => void = () => void syncNow();

  if (status === "working") {
    icon = <Loader2 className="h-4 w-4 animate-spin" />;
    label = "Syncing…";
    title = `Syncing with ${dir}`;
    onClick = () => undefined;
  } else if (!unlocked) {
    icon = <Lock className="h-4 w-4" />;
    label = "Unlock sync";
    title = "Sync is locked until you enter the vault passphrase — asked once per launch";
    tone = "text-amber-200";
    onClick = openCard;
  } else if (conflicts > 0) {
    icon = <AlertTriangle className="h-4 w-4" />;
    label = `${conflicts} to resolve`;
    title = "Some palaces changed on both devices. Choose which version to keep.";
    tone = "text-amber-200";
    onClick = openCard;
  } else if (status === "error") {
    icon = <AlertTriangle className="h-4 w-4" />;
    label = "Sync failed";
    title = error ?? "The last sync failed";
    tone = "text-red-300";
    onClick = openCard;
  } else {
    label = lastSyncedAt ? `Synced ${ago(lastSyncedAt, now)}` : "Sync now";
    title = `Sync now with ${dir}`;
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      type="button"
      onClick={onClick}
      disabled={status === "working"}
      title={title}
      aria-label={label}
      className={`gap-1.5 ${tone}`}
    >
      {icon}
      <span className="hidden text-xs leading-none lg:inline">{label}</span>
    </Button>
  );
}
