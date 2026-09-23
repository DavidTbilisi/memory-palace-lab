import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryPalaceApp } from "./app/MemoryPalaceApp";
import { usePalaceStore } from "./store/palaceStore";
import { useSyncStore } from "./store/syncStore";
import "./index.css";

if (import.meta.env.DEV) {
  (window as { __mp_store?: typeof usePalaceStore }).__mp_store = usePalaceStore;
  // Sync is driven from Settings by hand, which makes the two-device check in
  // scripts/two-device-sync/ unrunnable without a handle on the store: the vault folder and
  // passphrase have to be typed into a native dialog that no test can reach.
  (window as { __mp_sync_store?: typeof useSyncStore }).__mp_sync_store = useSyncStore;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MemoryPalaceApp />
  </React.StrictMode>,
);
