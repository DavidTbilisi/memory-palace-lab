import { useState } from "react";
import { useSyncStore } from "../store/syncStore";
import { IS_TAURI_RUNTIME } from "../infrastructure/appUpdater";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SyncConflictList } from "./SyncConflictDialog";

/**
 * The Sync card in Settings. Desktop only, like the METER bridge: the vault folder is
 * reached through Rust commands that the web build has no access to.
 */
export function SettingsSyncSection() {
  const status = useSyncStore((s) => s.status);
  const dir = useSyncStore((s) => s.dir);
  const deviceName = useSyncStore((s) => s.deviceName);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const conflicts = useSyncStore((s) => s.conflicts);
  const report = useSyncStore((s) => s.report);
  const error = useSyncStore((s) => s.error);
  const connect = useSyncStore((s) => s.connect);
  const unlock = useSyncStore((s) => s.unlock);
  const disconnect = useSyncStore((s) => s.disconnect);
  const setDeviceName = useSyncStore((s) => s.setDeviceName);
  const syncNow = useSyncStore((s) => s.syncNow);

  const [folderDraft, setFolderDraft] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [nameDraft, setNameDraft] = useState(deviceName);

  if (!IS_TAURI_RUNTIME) {
    return <div className="text-xs text-zinc-400">Available in the desktop app.</div>;
  }

  const busy = status === "working";

  const chooseFolder = async () => {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const picked = await open({ directory: true, multiple: false, title: "Choose a sync folder" });
    if (typeof picked === "string") setFolderDraft(picked);
  };

  if (status === "disconnected" || (status === "error" && !dir)) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Input
            aria-label="Sync folder"
            value={folderDraft}
            onChange={(event) => setFolderDraft(event.target.value)}
            placeholder="A folder your other devices can see"
            className="h-8 w-full max-w-md text-xs"
          />
          <button
            type="button"
            onClick={() => void chooseFolder()}
            className="shrink-0 rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
          >
            Browse…
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sync-passphrase" className="text-xs text-zinc-400">
            Passphrase
          </Label>
          <Input
            id="sync-passphrase"
            type="password"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            className="h-8 w-full max-w-xs text-xs"
          />
        </div>
        <p className="text-xs leading-5 text-amber-200/80">
          Your palaces are encrypted with this passphrase before they are written to the folder,
          so whoever hosts it cannot read them. <strong>It cannot be recovered.</strong> If you
          lose it the vault is unreadable — keep a local backup from the Data section too.
        </p>
        <div>
          <button
            type="button"
            disabled={busy || !folderDraft.trim() || !passphrase}
            onClick={() => void connect(folderDraft.trim(), passphrase).then(() => setPassphrase(""))}
            className="rounded border border-violet-500/60 px-2 py-1 text-xs font-medium text-violet-100 hover:bg-violet-900/40 disabled:opacity-50"
          >
            {busy ? "Connecting…" : "Connect"}
          </button>
        </div>
        {error ? <div className="text-xs text-red-300">{error}</div> : null}
      </div>
    );
  }

  if (status === "locked" || (status === "error" && dir && !lastSyncedAt)) {
    return (
      <div className="flex flex-col gap-3">
        <div className="text-xs text-zinc-400">
          Connected to <span className="text-zinc-200">{dir}</span>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sync-unlock" className="text-xs text-zinc-400">
            Passphrase
          </Label>
          <Input
            id="sync-unlock"
            type="password"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void unlock(passphrase).then(() => setPassphrase(""));
            }}
            className="h-8 w-full max-w-xs text-xs"
          />
          <button
            type="button"
            disabled={busy || !passphrase}
            onClick={() => void unlock(passphrase).then(() => setPassphrase(""))}
            className="rounded border border-violet-500/60 px-2 py-1 text-xs font-medium text-violet-100 hover:bg-violet-900/40 disabled:opacity-50"
          >
            Unlock
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Asked once per launch — the passphrase is never written to this device.
        </p>
        {error ? <div className="text-xs text-red-300">{error}</div> : null}
        <div>
          <button
            type="button"
            onClick={disconnect}
            className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-zinc-400">
        Syncing with <span className="text-zinc-200">{dir}</span>
        {lastSyncedAt ? ` · last synced ${new Date(lastSyncedAt).toLocaleString()}` : " · not synced yet"}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="sync-device-name" className="text-xs text-zinc-400">
          Device name
        </Label>
        <Input
          id="sync-device-name"
          value={nameDraft}
          onChange={(event) => setNameDraft(event.target.value)}
          onBlur={() => setDeviceName(nameDraft.trim() || "This device")}
          className="h-8 w-40 text-xs"
        />
        <span className="text-xs text-zinc-500">Shown when this device wins a conflict.</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void syncNow()}
          className="rounded border border-violet-500/60 px-2 py-1 text-xs font-medium text-violet-100 hover:bg-violet-900/40 disabled:opacity-50"
        >
          {busy ? "Syncing…" : "Sync now"}
        </button>
        <button
          type="button"
          onClick={disconnect}
          className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          Disconnect
        </button>
      </div>

      {conflicts.length > 0 ? <SyncConflictList /> : null}

      {report ? <SyncReportSummary /> : null}
      {error ? <div className="text-xs text-red-300">{error}</div> : null}
    </div>
  );
}

function SyncReportSummary() {
  const report = useSyncStore((s) => s.report);
  const dismiss = useSyncStore((s) => s.dismissReport);
  if (!report) return null;

  const parts: string[] = [];
  if (report.pushed.length) parts.push(`${report.pushed.length} sent`);
  if (report.pulled.length) parts.push(`${report.pulled.length} received`);
  if (report.forked.length) parts.push(`${report.forked.length} kept as a copy`);
  if (report.deletedLocally.length) parts.push(`${report.deletedLocally.length} removed here`);
  if (report.deletedRemotely.length) parts.push(`${report.deletedRemotely.length} removed from the vault`);
  if (report.assetsPushed || report.assetsPulled) {
    parts.push(`${report.assetsPushed + report.assetsPulled} images`);
  }
  if (report.analyticsPulled) parts.push(`${report.analyticsPulled} events`);
  if (report.aarPulled) parts.push(`${report.aarPulled} reviews`);

  return (
    <div className="rounded border border-zinc-700 bg-zinc-900/60 p-2 text-xs text-zinc-300">
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          {parts.length > 0 ? parts.join(", ") + "." : "Everything was already up to date."}
          {report.skipped.length > 0 ? (
            // Never silent: a file that could not be read is not a file that is not there.
            <span className="block text-amber-200/80">
              {report.skipped.length} file(s) could not be read and were left alone — if your sync
              app is still downloading, try again shortly.
            </span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded border border-zinc-600 px-1.5 py-0.5 text-[11px] text-zinc-400 hover:bg-zinc-800"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
