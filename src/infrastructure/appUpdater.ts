/**
 * Desktop self-update via tauri-plugin-updater. Web builds report
 * "not supported" instead of throwing so Settings can render a plain message.
 */
export const IS_TAURI_RUNTIME = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export type UpdateCheckResult =
  | { status: "unsupported" }
  | { status: "up-to-date" }
  | { status: "available"; version: string; notes?: string };

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  if (!IS_TAURI_RUNTIME) return { status: "unsupported" };
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check();
  if (!update) return { status: "up-to-date" };
  return { status: "available", version: update.version, notes: update.body ?? undefined };
}

/**
 * Download, install, and relaunch. `onProgress` receives a percentage when
 * the server reports a content length, otherwise `null`.
 */
export async function downloadAndInstallUpdate(onProgress?: (percent: number | null) => void): Promise<void> {
  if (!IS_TAURI_RUNTIME) throw new Error("Updates are only available in the desktop app.");
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check();
  if (!update) throw new Error("Update no longer available.");
  onProgress?.(null);
  let total = 0;
  let received = 0;
  await update.downloadAndInstall((event) => {
    if (event.event === "Started") {
      total = event.data.contentLength ?? 0;
    } else if (event.event === "Progress") {
      received += event.data.chunkLength;
      onProgress?.(total > 0 ? Math.min(100, Math.round((received / total) * 100)) : null);
    }
  });
  const { relaunch } = await import("@tauri-apps/plugin-process");
  await relaunch();
}
