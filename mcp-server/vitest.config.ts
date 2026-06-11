import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: fileURLToPath(new URL("..", import.meta.url)),
  test: {
    environment: "node",
    include: ["mcp-server/src/**/*.test.ts"],
    testTimeout: 30000,
    pool: "forks",
    maxWorkers: 1,
  },
});
