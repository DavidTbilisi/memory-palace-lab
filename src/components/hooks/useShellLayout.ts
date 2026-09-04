import { useCallback, useEffect, useState } from "react";
import { isAppPage, resolveNavigationTarget, type AppPage } from "../../app/pages";

export const SHELL_LAYOUT_STORAGE_KEY = "mp-shell-layout";

export type ViewMode = "balanced" | "focus";

export type ShellLayout = {
  currentPage: AppPage;
  viewMode: ViewMode;
  showSidebar: boolean;
  showInspector: boolean;
};

const DEFAULT_LAYOUT: ShellLayout = {
  currentPage: "graph",
  viewMode: "balanced",
  showSidebar: true,
  showInspector: true,
};

type StoredLayout = Partial<{
  version: number;
  currentPage: string;
  viewMode: string;
  showSidebar: boolean;
  showInspector: boolean;
}>;

/** Read the persisted layout, tolerant of missing, malformed, or stale values. */
export function loadShellLayout(): ShellLayout {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const raw = window.localStorage.getItem(SHELL_LAYOUT_STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return DEFAULT_LAYOUT;
    const stored = parsed as StoredLayout;
    const currentPage = isAppPage(stored.currentPage)
      ? stored.currentPage
      : typeof stored.currentPage === "string"
        ? resolveNavigationTarget(stored.currentPage).page
        : DEFAULT_LAYOUT.currentPage;
    return {
      currentPage,
      viewMode: stored.viewMode === "focus" ? "focus" : "balanced",
      showSidebar: typeof stored.showSidebar === "boolean" ? stored.showSidebar : DEFAULT_LAYOUT.showSidebar,
      showInspector:
        typeof stored.showInspector === "boolean" ? stored.showInspector : DEFAULT_LAYOUT.showInspector,
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

function persist(layout: ShellLayout) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SHELL_LAYOUT_STORAGE_KEY, JSON.stringify({ version: 1, ...layout }));
  } catch {
    // Storage can be unavailable (private mode, quota); the app still works.
  }
}

/**
 * Shell layout state (active page, view preset, side panels) persisted to
 * localStorage so the app reopens where the user left it.
 */
export function useShellLayout() {
  const [layout, setLayout] = useState<ShellLayout>(() => loadShellLayout());

  useEffect(() => {
    persist(layout);
  }, [layout]);

  const setCurrentPage = useCallback((page: AppPage) => {
    setLayout((prev) => (prev.currentPage === page ? prev : { ...prev, currentPage: page }));
  }, []);

  const setShowSidebar = useCallback((update: boolean | ((prev: boolean) => boolean)) => {
    setLayout((prev) => {
      const next = typeof update === "function" ? update(prev.showSidebar) : update;
      return next === prev.showSidebar ? prev : { ...prev, showSidebar: next };
    });
  }, []);

  const setShowInspector = useCallback((update: boolean | ((prev: boolean) => boolean)) => {
    setLayout((prev) => {
      const next = typeof update === "function" ? update(prev.showInspector) : update;
      return next === prev.showInspector ? prev : { ...prev, showInspector: next };
    });
  }, []);

  /** Apply a view preset: balanced shows both side panels, focus hides them. */
  const applyViewMode = useCallback((mode: ViewMode) => {
    setLayout((prev) => ({
      ...prev,
      viewMode: mode,
      showSidebar: mode === "balanced",
      showInspector: mode === "balanced",
    }));
  }, []);

  return {
    currentPage: layout.currentPage,
    viewMode: layout.viewMode,
    showSidebar: layout.showSidebar,
    showInspector: layout.showInspector,
    setCurrentPage,
    setShowSidebar,
    setShowInspector,
    applyViewMode,
  };
}
