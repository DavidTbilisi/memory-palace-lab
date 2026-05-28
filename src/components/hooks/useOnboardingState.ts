import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const LEARN_PANEL_STORAGE_KEY = "mp-learn-panel-open";

/**
 * Tracks whether the Learn/onboarding panel is open, persisted to
 * localStorage. Defaults to open on a first-ever visit so onboarding lessons
 * surface, then honors the stored choice thereafter.
 */
export function useOnboardingState(): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(LEARN_PANEL_STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LEARN_PANEL_STORAGE_KEY, showOnboarding ? "true" : "false");
  }, [showOnboarding]);

  return [showOnboarding, setShowOnboarding];
}
