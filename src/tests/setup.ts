import "@testing-library/jest-dom/vitest";

/**
 * Node 25+ ships its own Web Storage globals. Without `--localstorage-file` its `localStorage` is
 * undefined, and because it is already on the global, Vitest's jsdom environment does not replace
 * it with jsdom's. Put jsdom's storages back so tests see a working `localStorage` on any Node.
 */
const dom = (globalThis as { jsdom?: { window: Window } }).jsdom?.window;
if (dom) {
  for (const key of ["localStorage", "sessionStorage"] as const) {
    if (globalThis[key] === undefined) {
      Object.defineProperty(globalThis, key, { configurable: true, get: () => dom[key] });
    }
  }
}
