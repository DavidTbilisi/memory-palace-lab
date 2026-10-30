import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/ui",
  timeout: 60_000,
  fullyParallel: false,
  retries: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: {
    // A built app serves a few bundled chunks per page load instead of hundreds of on-demand dev modules.
    // NODE_ENV=development keeps import.meta.env.DEV on, which exposes the __mp_store hook the specs read;
    // --base / overrides the GitHub Pages base vite.config.ts picks under Actions.
    command:
      "npx vite build --base / --outDir dist-e2e --emptyOutDir && npx vite preview --base / --outDir dist-e2e --host 127.0.0.1 --port 4173 --strictPort",
    env: { NODE_ENV: "development" },
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

