import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  Database,
  Info,
  KeyRound,
  Lightbulb,
  Map,
  Settings2,
  Target,
} from "lucide-react";
import { APP_VERSION } from "../appVersion";
import { SHORTCUTS, formatShortcut } from "../content/shortcuts";
import {
  IS_TAURI_RUNTIME,
  checkForUpdate,
  downloadAndInstallUpdate,
} from "../infrastructure/appUpdater";
import {
  exportPalaceBackup,
  importPalaceBackup,
} from "../infrastructure/palaceBackup";
import {
  DEFAULT_IDLE_DELAY_MS,
  areTipsDisabled,
  loadIdleDelayMs,
  resetTipPreferences,
  saveIdleDelayMs,
  setTipsDisabled,
} from "../domain/services/tipPreferences";
import {
  loadMeterBridgePreference,
  loadMeterDataDir,
  saveMeterBridgePreference,
  saveMeterDataDir,
} from "../domain/services/meterPreferences";
import {
  meterBridge,
  type MeterBridgeStatus,
  type MeterDataDirSource,
} from "../infrastructure/meterBridge";
import { usePalaceStore } from "../store/palaceStore";
import { AtlasLevelLabelsEditor } from "./AtlasLevelLabelsEditor";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const AI_KEY_STORAGE_KEY = "mp-ai-anthropic-key";
export const LEARN_PANEL_STORAGE_KEY = "mp-learn-panel-open";

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function Section({
  icon: Icon,
  title,
  blurb,
  children,
}: {
  icon: typeof Settings2;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4"
      aria-labelledby={`settings-${title}`}
    >
      <h3
        id={`settings-${title}`}
        className="flex items-center gap-2 text-sm font-semibold text-zinc-100"
      >
        <Icon className="h-4 w-4 text-violet-300" />
        {title}
      </h3>
      <p className="mt-1 text-xs leading-5 text-zinc-400">{blurb}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function describeMeterVia(via: MeterDataDirSource): string {
  switch (via) {
    case "setting":
      return "from Settings";
    case "env":
      return "from METER_DATA_DIR";
    case "project":
      return "project root, like the meter CLI";
    default:
      return "~/.neural-os/meter fallback";
  }
}

type UpdateUi =
  | { phase: "idle" }
  | { phase: "checking" }
  | { phase: "up-to-date" }
  | { phase: "available"; version: string }
  | { phase: "downloading"; percent: number | null }
  | { phase: "error"; message: string };

/** Every user preference in one place; storage keys are unchanged from where they used to live. */
export function SettingsPage() {
  const dailyReviewGoal = usePalaceStore((s) => s.dailyReviewGoal);
  const setDailyReviewGoal = usePalaceStore((s) => s.setDailyReviewGoal);
  const loadPalaces = usePalaceStore((s) => s.loadPalaces);
  const loadAARRecords = usePalaceStore((s) => s.loadAARRecords);
  const palaces = usePalaceStore((s) => s.palaces);

  const [goalDraft, setGoalDraft] = useState(String(dailyReviewGoal));
  const [apiKey, setApiKey] = useState(
    () => readStorage(AI_KEY_STORAGE_KEY) ?? "",
  );
  const [tipsOff, setTipsOff] = useState(() => areTipsDisabled());
  const [idleSeconds, setIdleSeconds] = useState(() =>
    String(Math.round(loadIdleDelayMs() / 1000)),
  );
  const [learnOnStartup, setLearnOnStartup] = useState(
    () => readStorage(LEARN_PANEL_STORAGE_KEY) !== "false",
  );
  const [dataMessage, setDataMessage] = useState<string | null>(null);
  const [meterPreference, setMeterPreference] = useState(() => loadMeterBridgePreference());
  const [meterDir, setMeterDir] = useState(() => loadMeterDataDir() ?? "");
  const [meterStatus, setMeterStatus] = useState<MeterBridgeStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [update, setUpdate] = useState<UpdateUi>({ phase: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setGoalDraft(String(dailyReviewGoal)), [dailyReviewGoal]);

  useEffect(() => {
    if (!IS_TAURI_RUNTIME) return;
    let cancelled = false;
    void meterBridge.status().then((status) => {
      if (!cancelled) setMeterStatus(status);
    });
    return () => {
      cancelled = true;
    };
  }, [meterPreference, meterDir]);

  const commitMeterEnabled = (enabled: boolean) => {
    const next = enabled ? "on" : "off";
    saveMeterBridgePreference(next);
    meterBridge.settingsChanged();
    setMeterPreference(next);
  };

  const commitMeterDir = () => {
    saveMeterDataDir(meterDir);
    meterBridge.settingsChanged();
    setMeterDir(loadMeterDataDir() ?? "");
  };

  const commitGoal = () => {
    const parsed = Number(goalDraft);
    if (Number.isFinite(parsed)) setDailyReviewGoal(parsed);
    else setGoalDraft(String(dailyReviewGoal));
  };

  const commitApiKey = (value: string) => {
    setApiKey(value);
    writeStorage(AI_KEY_STORAGE_KEY, value.trim() || null);
  };

  const commitIdleSeconds = () => {
    const seconds = Number(idleSeconds);
    if (!Number.isFinite(seconds) || seconds <= 0) {
      saveIdleDelayMs(DEFAULT_IDLE_DELAY_MS);
      setIdleSeconds(String(Math.round(DEFAULT_IDLE_DELAY_MS / 1000)));
      return;
    }
    saveIdleDelayMs(Math.round(seconds * 1000));
  };

  const runBackup = async () => {
    setBusy(true);
    setDataMessage(null);
    try {
      const backup = await exportPalaceBackup();
      setDataMessage(`Backup downloaded: ${backup.palaces.length} palaces.`);
    } catch (error) {
      setDataMessage(
        `Backup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const runRestore = async (file: File) => {
    setBusy(true);
    setDataMessage(null);
    try {
      const result = await importPalaceBackup(await file.text());
      await loadPalaces();
      loadAARRecords();
      setDataMessage(
        `Restored ${result.palaces} palaces and ${result.aarRecords} new AAR records.`,
      );
    } catch (error) {
      setDataMessage(
        `Restore failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const runUpdateCheck = async () => {
    setUpdate({ phase: "checking" });
    try {
      const result = await checkForUpdate();
      if (result.status === "available")
        setUpdate({ phase: "available", version: result.version });
      else if (result.status === "up-to-date")
        setUpdate({ phase: "up-to-date" });
      else
        setUpdate({
          phase: "error",
          message: "Updates are only available in the desktop app.",
        });
    } catch (error) {
      setUpdate({
        phase: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const runInstall = () => {
    setUpdate({ phase: "downloading", percent: null });
    void downloadAndInstallUpdate((percent) =>
      setUpdate({ phase: "downloading", percent }),
    ).catch((error: unknown) => {
      setUpdate({
        phase: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-800 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-violet-200">
          <Settings2 className="h-4 w-4" />
          Settings
        </h2>
        <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
          Review goals, the AI key, idle tips, atlas terminology, backups, and
          updates. Everything saves as you change it.
        </p>
      </div>

      <div className="grid gap-4 overflow-y-auto pt-4 lg:grid-cols-2">
        <Section
          icon={Target}
          title="Review"
          blurb="How many loci you aim to review per day. The Review page tracks progress against it."
        >
          <div className="flex items-center gap-2">
            <Label
              htmlFor="settings-daily-goal"
              className="text-xs text-zinc-400"
            >
              Daily loci goal
            </Label>
            <Input
              id="settings-daily-goal"
              type="number"
              min={1}
              max={200}
              value={goalDraft}
              onChange={(event) => setGoalDraft(event.target.value)}
              onBlur={commitGoal}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitGoal();
              }}
              className="h-8 w-24 text-xs"
            />
          </div>
        </Section>

        <Section
          icon={KeyRound}
          title="AI"
          blurb="Used by the node inspector's encoding suggestions. Stored only on this device."
        >
          <div className="flex items-center gap-2">
            <Label htmlFor="settings-api-key" className="text-xs text-zinc-400">
              Anthropic API key
            </Label>
            <Input
              id="settings-api-key"
              type="password"
              value={apiKey}
              onChange={(event) => commitApiKey(event.target.value)}
              placeholder="sk-ant-..."
              className="h-8 w-64 text-xs"
            />
          </div>
        </Section>

        <Section
          icon={Lightbulb}
          title="Tips"
          blurb="Idle suggestions appear as a corner toast after a period of inactivity."
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={!tipsOff}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setTipsDisabled(!enabled);
                  setTipsOff(!enabled);
                }}
              />
              Show idle tips
            </label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="settings-idle-seconds"
                className="text-xs text-zinc-400"
              >
                After (seconds)
              </Label>
              <Input
                id="settings-idle-seconds"
                type="number"
                min={5}
                value={idleSeconds}
                onChange={(event) => setIdleSeconds(event.target.value)}
                onBlur={commitIdleSeconds}
                className="h-8 w-24 text-xs"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => {
                resetTipPreferences();
                setTipsOff(false);
              }}
            >
              Re-enable all tips
            </Button>
          </div>
        </Section>

        <Section
          icon={BookOpen}
          title="Learn rail"
          blurb="The side panel with first-session progress and lessons."
        >
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={learnOnStartup}
              onChange={(event) => {
                setLearnOnStartup(event.target.checked);
                writeStorage(
                  LEARN_PANEL_STORAGE_KEY,
                  event.target.checked ? "true" : "false",
                );
              }}
            />
            Open the Learn rail on startup
          </label>
        </Section>

        <Section
          icon={Map}
          title="Atlas terminology"
          blurb="Names for the levels of the atlas path, e.g. Domain / Place / Section or Subject / Topic / Lesson."
        >
          <AtlasLevelLabelsEditor />
        </Section>

        <Section
          icon={Database}
          title="Data"
          blurb="Backup every palace and after-action review to one JSON file, or restore from one."
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              type="button"
              disabled={busy || palaces.length === 0}
              onClick={() => void runBackup()}
            >
              Backup all palaces
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              Restore from backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              aria-label="Backup file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void runRestore(file);
              }}
            />
          </div>
          {dataMessage ? (
            <div className="mt-2 text-xs text-zinc-400">{dataMessage}</div>
          ) : null}
        </Section>

        <Section
          icon={Activity}
          title="METER bridge"
          blurb="Mirror walks and encoding into METER's events.jsonl as they happen, so palace work shows up in Daily Glance beside Anki reviews. Older events: palace meter backfill."
        >
          {IS_TAURI_RUNTIME ? (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={meterStatus?.enabled ?? meterPreference === "on"}
                  onChange={(event) => commitMeterEnabled(event.target.checked)}
                />
                Mirror events to METER
                {meterPreference === "auto" && meterStatus?.enabled ? (
                  <span className="text-zinc-500">(on because METER_DATA_DIR is set)</span>
                ) : null}
              </label>
              <div className="flex items-center gap-2">
                <Label htmlFor="settings-meter-dir" className="text-xs text-zinc-400">
                  Data directory
                </Label>
                <Input
                  id="settings-meter-dir"
                  value={meterDir}
                  onChange={(event) => setMeterDir(event.target.value)}
                  onBlur={commitMeterDir}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") commitMeterDir();
                  }}
                  placeholder="empty = METER_DATA_DIR, then project root, then ~/.neural-os/meter"
                  className="h-8 w-full max-w-md text-xs"
                />
              </div>
              <div className="text-xs text-zinc-400">
                {meterStatus === null
                  ? "Checking…"
                  : meterStatus.enabled && meterStatus.target
                    ? `Writing to ${meterStatus.target.dir}/events.jsonl (${describeMeterVia(meterStatus.target.via)}). ${meterStatus.emitted} event(s) this session.`
                    : "Off. Events stay in the app; run palace meter backfill to catch up later."}
              </div>
              {meterStatus?.lastError ? (
                <div className="text-xs text-red-300">Last error: {meterStatus.lastError}</div>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-zinc-400">Available in the desktop app.</div>
          )}
        </Section>

        <Section
          icon={Info}
          title="About"
          blurb={`Memory Palace Lab v${APP_VERSION}.`}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            {IS_TAURI_RUNTIME ? (
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => void runUpdateCheck()}
                disabled={
                  update.phase === "checking" || update.phase === "downloading"
                }
              >
                Check for updates
              </Button>
            ) : (
              <span>Updates are available in the desktop app only.</span>
            )}
            {update.phase === "checking" ? <span>Checking...</span> : null}
            {update.phase === "up-to-date" ? (
              <span>You are on the latest version.</span>
            ) : null}
            {update.phase === "available" ? (
              <>
                <span>v{update.version} is available.</span>
                <Button size="sm" type="button" onClick={runInstall}>
                  Install and restart
                </Button>
              </>
            ) : null}
            {update.phase === "downloading" ? (
              <span>
                Downloading
                {update.percent !== null ? ` ${update.percent}%` : "..."}
              </span>
            ) : null}
            {update.phase === "error" ? (
              <span className="text-rose-300">{update.message}</span>
            ) : null}
          </div>
        </Section>

        <Section
          icon={Settings2}
          title="Keyboard shortcuts"
          blurb="Global shortcuts. The Library lists them too."
        >
          <table className="w-full border-collapse text-xs">
            <tbody>
              {SHORTCUTS.map((shortcut) => (
                <tr key={shortcut.id} className="border-t border-zinc-800">
                  <td className="py-1.5 pr-3 font-mono text-violet-200">
                    {formatShortcut(shortcut)}
                  </td>
                  <td className="py-1.5 pr-3 text-zinc-100">
                    {shortcut.label}
                  </td>
                  <td className="py-1.5 text-zinc-400">
                    {shortcut.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
}
