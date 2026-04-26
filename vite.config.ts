import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_DEV_HOST;

function sanitizeChunkName(value: string) {
  return value.replace(/^@/, "").replace(/[\\/]/g, "-").replace(/[^a-zA-Z0-9-_]/g, "-");
}

function vendorChunkName(id: string) {
  const normalized = id.replace(/\\/g, "/");
  const nodeModulesIndex = normalized.lastIndexOf("/node_modules/");
  if (nodeModulesIndex === -1) return null;

  const packagePath = normalized.slice(nodeModulesIndex + "/node_modules/".length);
  const parts = packagePath.split("/");
  const packageName = parts[0]?.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];

  if (!packageName) return null;
  if (packageName === "react" || packageName === "react-dom" || packageName === "scheduler") {
    return "vendor-react";
  }
  if (packageName === "tldraw") {
    return "vendor-tldraw";
  }
  if (packageName.startsWith("@tldraw/")) {
    return `vendor-${sanitizeChunkName(packageName)}`;
  }
  if (packageName.startsWith("@radix-ui/")) {
    return "vendor-radix";
  }
  if (packageName.startsWith("@tauri-apps/")) {
    return "vendor-tauri";
  }
  if (packageName === "lucide-react") {
    return "vendor-icons";
  }
  return null;
}

export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, "/");
          return vendorChunkName(normalized);
        },
      },
    },
  },
}));
