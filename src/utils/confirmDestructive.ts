/**
 * Confirmation for irreversible actions. Uses the native Tauri dialog in the
 * desktop app (window.confirm is a no-op inside the Tauri webview) and falls
 * back to window.confirm in web mode.
 */
export async function confirmDestructive(message: string): Promise<boolean> {
  const hasTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  if (hasTauri) {
    const { confirm } = await import("@tauri-apps/plugin-dialog");
    return confirm(message, { title: "Memory Palace Lab", kind: "warning" });
  }
  return window.confirm(message);
}
