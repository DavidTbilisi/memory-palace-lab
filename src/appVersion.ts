// Single source of truth for the version shown in the UI. A plain JSON import
// (not a vite `define`) so it resolves identically under vite build, vitest,
// and any other runner; Vite tree-shakes the named export so only the version
// string lands in the bundle.
import { version } from "../package.json";

export const APP_VERSION: string = version;
