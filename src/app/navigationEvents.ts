import type { NavigationTarget } from "./pages";

/**
 * One window-level navigation channel. Deeply nested components (inspector,
 * analytics widgets, dialogs) ask the shell to navigate without prop-drilling
 * `setCurrentPage` through every layer.
 */
export const NAVIGATION_EVENT = "mp-navigate";

export type NavigationDetail = {
  target: NavigationTarget;
  /** Library document to open when the target is the library. */
  librarySlug?: string;
  section?: string;
  anchor?: string;
};

export function requestNavigation(target: NavigationTarget, detail: Omit<NavigationDetail, "target"> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<NavigationDetail>(NAVIGATION_EVENT, { detail: { target, ...detail } }));
}

export function subscribeNavigation(handler: (detail: NavigationDetail) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<NavigationDetail>).detail;
    if (!detail || typeof detail.target !== "string") return;
    handler(detail);
  };
  window.addEventListener(NAVIGATION_EVENT, listener);
  return () => window.removeEventListener(NAVIGATION_EVENT, listener);
}
