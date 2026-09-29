import { useEffect, useRef, useState } from "react";
import { useSyncStore, type FolderCheck } from "../store/syncStore";
import { IS_TAURI_RUNTIME } from "../infrastructure/appUpdater";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SyncConflictList } from "./SyncConflictDialog";

const VAULT_SUBFOLDER = "Memory Palace Vault";

const primaryButton =
  "rounded border border-violet-500/60 px-2 py-1 text-xs font-medium text-violet-100 hover:bg-violet-900/40 disabled:opacity-50";
const secondaryButton =
  "rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50";

/**
 * The Sync card in Settings. Desktop only, like the METER bridge: the vault folder is
 * reached through Rust commands that the web build has no access to.
 *
 * Three states, one per question the user has: how do I set this up (no folder), why is it
 * asking me for a passphrase (locked), and did it work (unlocked).
 */
export function SettingsSyncSection() {
  const dir = useSyncStore((s) => s.dir);
  const unlocked = useSyncStore((s) => s.unlocked);
  const attention = useSyncStore((s) => s.attention);
  const cardRef = useRef<HTMLDivElement>(null);

  // The header's sync chip asks for this: bring the card into view and put the cursor where
  // the next thing to type goes.
  useEffect(() => {
    if (!attention || !cardRef.current) return;
    cardRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    cardRef.current
      .querySelector<HTMLInputElement>("input[type=password]")
      ?.focus();
  }, [attention]);

  if (!IS_TAURI_RUNTIME) {
    return (
      <div className="text-xs text-zinc-400">Available in the desktop app.</div>
    );
  }

  return (
    <div ref={cardRef}>
      {!dir ? <SyncSetup /> : !unlocked ? <SyncUnlock /> : <SyncConnected />}
    </div>
  );
}

function joinPath(dir: string, name: string): string {
  const separator = dir.includes("\\") && !dir.includes("/") ? "\\" : "/";
  return dir.replace(/[\\/]+$/, "") + separator + name;
}

function SyncSetup() {
  const status = useSyncStore((s) => s.status);
  const error = useSyncStore((s) => s.error);
  const connect = useSyncStore((s) => s.connect);
  const checkFolder = useSyncStore((s) => s.checkFolder);
  const syncNow = useSyncStore((s) => s.syncNow);

  const [folderDraft, setFolderDraft] = useState("");
  const [check, setCheck] = useState<FolderCheck | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const folder = folderDraft.trim();
  const busy = status === "working";

  // Say what is in the folder before anything is written to it: joining and creating need
  // different things from the user, and creating by mistake next to an existing vault is the
  // one error here that cannot be undone.
  useEffect(() => {
    setCheck(null);
    if (!folder) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void checkFolder(folder).then((result) => {
        if (!cancelled) setCheck(result);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [folder, checkFolder]);

  const chooseFolder = async () => {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const picked = await open({
      directory: true,
      multiple: false,
      title: "Choose a sync folder",
    });
    if (typeof picked === "string") setFolderDraft(picked);
  };

  const joining = check?.kind === "existing";
  const creating = check?.kind === "new";
  const crowded =
    check?.kind === "new" &&
    check.probe !== null &&
    check.probe.ignoredFiles > 0;
  const mismatch = creating && confirmation !== passphrase;
  const canSubmit =
    !busy && !!folder && !!passphrase && (joining || (creating && !mismatch));

  const submit = async () => {
    await connect(folder, passphrase);
    setPassphrase("");
    setConfirmation("");
    // Connecting without syncing leaves the user wondering whether anything happened.
    if (useSyncStore.getState().unlocked) await syncNow();
  };

  return (
    <div className="flex flex-col gap-3">
      <ol className="list-decimal space-y-1 pl-4 text-xs leading-5 text-zinc-400">
        <li>
          Pick a folder that Dropbox, iCloud Drive, Syncthing or a network share
          already copies to your other devices.
        </li>
        <li>
          On the first device, choose a passphrase. This creates the vault.
        </li>
        <li>
          On every other device, pick the same folder and type the same
          passphrase.
        </li>
        <li>
          Press <strong className="text-zinc-300">Sync</strong> on the device
          you worked on, let the folder app finish copying, then press it on the
          other one. Nothing moves in the background.
        </li>
      </ol>

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
          className={`shrink-0 ${secondaryButton}`}
        >
          Browse…
        </button>
      </div>

      {folder && check ? (
        <FolderVerdict
          check={check}
          onUseSubfolder={() =>
            setFolderDraft(joinPath(folder, VAULT_SUBFOLDER))
          }
          crowded={crowded}
        />
      ) : null}
      {folder && !check ? (
        <div className="text-xs text-zinc-500">Checking the folder…</div>
      ) : null}

      {joining || creating ? (
        <>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="sync-passphrase"
              className="w-36 shrink-0 text-xs text-zinc-400"
            >
              {joining ? "Vault passphrase" : "New passphrase"}
            </Label>
            <Input
              id="sync-passphrase"
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canSubmit) void submit();
              }}
              className="h-8 w-full max-w-xs text-xs"
            />
          </div>
          {creating ? (
            <div className="flex items-center gap-2">
              <Label
                htmlFor="sync-passphrase-confirm"
                className="w-36 shrink-0 text-xs text-zinc-400"
              >
                Type it again
              </Label>
              <Input
                id="sync-passphrase-confirm"
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && canSubmit) void submit();
                }}
                className="h-8 w-full max-w-xs text-xs"
              />
              {confirmation && mismatch ? (
                <span className="text-xs text-amber-200/80">
                  Does not match.
                </span>
              ) : null}
            </div>
          ) : null}
          {creating ? (
            <p className="text-xs leading-5 text-amber-200/80">
              Your palaces are encrypted with this passphrase before they are
              written to the folder, so whoever hosts it cannot read them.{" "}
              <strong>It cannot be recovered.</strong> If you lose it the vault
              is unreadable — keep a local backup from the Data section too.
            </p>
          ) : null}
          <div>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => void submit()}
              className={primaryButton}
            >
              {busy
                ? "Connecting…"
                : joining
                  ? "Join vault and sync"
                  : "Create vault and sync"}
            </button>
          </div>
        </>
      ) : null}
      {error ? <div className="text-xs text-red-300">{error}</div> : null}
    </div>
  );
}

function FolderVerdict({
  check,
  crowded,
  onUseSubfolder,
}: {
  check: FolderCheck;
  crowded: boolean;
  onUseSubfolder: () => void;
}) {
  if (check.kind === "unreadable") {
    return (
      <div className="text-xs text-red-300">
        Could not look inside that folder: {check.message}
      </div>
    );
  }
  const undownloaded = check.probe?.undownloadedFiles ?? 0;
  return (
    <div className="flex flex-col gap-1 text-xs leading-5">
      {check.kind === "existing" ? (
        <span className="text-emerald-300/90">
          This folder already holds a vault. Enter its passphrase to join it —
          your palaces here are kept, and merged with the ones in the vault on
          the first sync.
        </span>
      ) : crowded ? (
        <span className="text-amber-200/80">
          This folder has other files in it. A vault is easier to find — and
          harder to delete by accident — in a folder of its own.{" "}
          <button
            type="button"
            onClick={onUseSubfolder}
            className="underline hover:text-amber-100"
          >
            Use “{VAULT_SUBFOLDER}” inside it
          </button>
        </span>
      ) : (
        <span className="text-zinc-400">
          No vault here yet
          {check.probe?.exists === false ? " (the folder will be created)" : ""}
          . Choose a passphrase to create one. On another device that already
          has a vault, pick that vault&apos;s folder instead.
        </span>
      )}
      {undownloaded > 0 ? (
        <span className="text-amber-200/80">
          {undownloaded} file(s) in it have not finished downloading. Let your
          sync app catch up before the first sync.
        </span>
      ) : null}
    </div>
  );
}

function SyncUnlock() {
  const status = useSyncStore((s) => s.status);
  const dir = useSyncStore((s) => s.dir);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const error = useSyncStore((s) => s.error);
  const unlock = useSyncStore((s) => s.unlock);
  const syncNow = useSyncStore((s) => s.syncNow);
  const disconnect = useSyncStore((s) => s.disconnect);
  const [passphrase, setPassphrase] = useState("");
  const busy = status === "working";

  const submit = async () => {
    await unlock(passphrase);
    setPassphrase("");
    if (useSyncStore.getState().unlocked) await syncNow();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs leading-5 text-zinc-400">
        Connected to <span className="text-zinc-200">{dir}</span>
        {lastSyncedAt
          ? ` · last synced ${new Date(lastSyncedAt).toLocaleString()}`
          : ""}
        .
        <br />
        Enter the vault passphrase to sync. It is asked once each time the app
        starts and is never saved on this device.
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
            if (event.key === "Enter" && passphrase && !busy) void submit();
          }}
          className="h-8 w-full max-w-xs text-xs"
        />
        <button
          type="button"
          disabled={busy || !passphrase}
          onClick={() => void submit()}
          className={primaryButton}
        >
          {busy ? "Unlocking…" : "Unlock and sync"}
        </button>
      </div>
      {error ? <div className="text-xs text-red-300">{error}</div> : null}
      <div className="flex items-center gap-2">
        <button type="button" onClick={disconnect} className={secondaryButton}>
          Disconnect
        </button>
        <span className="text-xs text-zinc-500">
          Forgets the folder on this device. The vault and your palaces are left
          alone.
        </span>
      </div>
    </div>
  );
}

function SyncConnected() {
  const status = useSyncStore((s) => s.status);
  const dir = useSyncStore((s) => s.dir);
  const deviceName = useSyncStore((s) => s.deviceName);
  const lastSyncedAt = useSyncStore((s) => s.lastSyncedAt);
  const conflicts = useSyncStore((s) => s.conflicts);
  const report = useSyncStore((s) => s.report);
  const error = useSyncStore((s) => s.error);
  const disconnect = useSyncStore((s) => s.disconnect);
  const setDeviceName = useSyncStore((s) => s.setDeviceName);
  const syncNow = useSyncStore((s) => s.syncNow);
  const reclaimSpace = useSyncStore((s) => s.reclaimSpace);
  const garbage = useSyncStore((s) => s.garbage);
  const [nameDraft, setNameDraft] = useState(deviceName);
  const busy = status === "working";

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs leading-5 text-zinc-400">
        Syncing with <span className="text-zinc-200">{dir}</span>
        {lastSyncedAt
          ? ` · last synced ${new Date(lastSyncedAt).toLocaleString()}`
          : " · not synced yet"}
        <br />A sync sends what changed here and takes what changed on your
        other devices. It runs only when you press Sync — here or in the header.
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void syncNow()}
          className={primaryButton}
        >
          {busy ? "Syncing…" : "Sync now"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void reclaimSpace()}
          title="Delete images in the folder that no palace uses any more"
          className={secondaryButton}
        >
          Reclaim space
        </button>
        <button type="button" onClick={disconnect} className={secondaryButton}>
          Disconnect
        </button>
      </div>

      {conflicts.length > 0 ? <SyncConflictList /> : null}

      {garbage ? <GarbageSummary /> : null}
      {report ? <SyncReportSummary /> : null}
      {error ? <div className="text-xs text-red-300">{error}</div> : null}

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
        <span className="text-xs text-zinc-500">
          Shown when this device wins a conflict.
        </span>
      </div>
    </div>
  );
}

/**
 * What reclaiming space did — or why it declined. A refusal is stated as "could not check",
 * never as "nothing to do": telling someone their vault is tidy when it was merely
 * unreadable is the one outcome here that would mislead.
 */
function GarbageSummary() {
  const garbage = useSyncStore((s) => s.garbage);
  const dismiss = useSyncStore((s) => s.dismissReport);
  if (!garbage) return null;

  const body =
    garbage.refused === "undownloaded" ? (
      <span className="text-amber-200/80">
        Your sync app has not finished downloading the folder, so nothing was
        deleted. Try again once it has caught up.
      </span>
    ) : garbage.refused === "unreadable" ? (
      <span className="text-amber-200/80">
        Some files in the folder could not be read, so nothing was deleted — an
        image that looks unused might belong to one of them.
      </span>
    ) : garbage.removed.length === 0 ? (
      <>
        Nothing to reclaim.
        {garbage.keptRecent > 0
          ? ` ${garbage.keptRecent} recently added image(s) were left for now, in case a palace using them is still on its way.`
          : ""}
      </>
    ) : (
      <>
        Removed {garbage.removed.length} unused image(s), freeing{" "}
        {Math.max(1, Math.round(garbage.reclaimedBytes / 1024))} KB.
        {garbage.keptRecent > 0
          ? ` ${garbage.keptRecent} more were too recent to remove yet.`
          : ""}
      </>
    );

  return (
    <div className="rounded border border-zinc-700 bg-zinc-900/60 p-2 text-xs text-zinc-300">
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">{body}</span>
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

function SyncReportSummary() {
  const report = useSyncStore((s) => s.report);
  const dismiss = useSyncStore((s) => s.dismissReport);
  if (!report) return null;

  const parts: string[] = [];
  if (report.pushed.length) parts.push(`${report.pushed.length} sent`);
  if (report.pulled.length) parts.push(`${report.pulled.length} received`);
  if (report.forked.length)
    parts.push(`${report.forked.length} kept as a copy`);
  if (report.deletedLocally.length)
    parts.push(`${report.deletedLocally.length} removed here`);
  if (report.deletedRemotely.length)
    parts.push(`${report.deletedRemotely.length} removed from the vault`);
  if (report.assetsPushed || report.assetsPulled) {
    parts.push(`${report.assetsPushed + report.assetsPulled} images`);
  }
  if (report.analyticsPulled) parts.push(`${report.analyticsPulled} events`);
  if (report.aarPulled) parts.push(`${report.aarPulled} reviews`);

  return (
    <div className="rounded border border-zinc-700 bg-zinc-900/60 p-2 text-xs text-zinc-300">
      <div className="flex items-start gap-2">
        <span className="min-w-0 flex-1">
          {parts.length > 0
            ? parts.join(", ") + "."
            : "Everything was already up to date."}
          {report.skipped.length > 0 ? (
            // Never silent: a file that could not be read is not a file that is not there.
            <span className="block text-amber-200/80">
              {report.skipped.length} file(s) could not be read and were left
              alone — if your sync app is still downloading, try again shortly.
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
