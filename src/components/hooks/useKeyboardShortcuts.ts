import { useEffect, useRef } from "react";

/**
 * Binds Ctrl/Cmd + <key> shortcuts to handlers. Keys are matched
 * case-insensitively (e.g. `{ k: openPalette }` fires on Cmd+K). Handlers are
 * read through a ref so callers can pass fresh closures each render without
 * rebinding the global listener.
 */
export function useKeyboardShortcuts(handlers: Record<string, () => void>): void {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const handler = handlersRef.current[event.key.toLowerCase()];
      if (!handler) return;
      event.preventDefault();
      handler();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
