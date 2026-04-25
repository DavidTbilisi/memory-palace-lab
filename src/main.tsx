import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryPalaceApp } from "./app/MemoryPalaceApp";
import { usePalaceStore } from "./store/palaceStore";
import "./index.css";

if (import.meta.env.DEV) {
  (window as { __mp_store?: typeof usePalaceStore }).__mp_store = usePalaceStore;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MemoryPalaceApp />
  </React.StrictMode>,
);
