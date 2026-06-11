// Stdio smoke test: spawns the real server against a temp DB, walks through
// initialize → tools/list → create/read tool calls → resources → prompt.
// Run: node mcp-server/smoke.mjs
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "mpl-mcp-smoke-"));
const child = spawn("npx", ["tsx", "mcp-server/src/index.ts"], {
  env: { ...process.env, MEMORY_PALACE_DB: join(dir, "smoke.sqlite3") },
  stdio: ["pipe", "pipe", "inherit"],
  shell: process.platform === "win32",
});

let buffer = "";
const pending = new Map();
let nextId = 1;

child.stdout.on("data", (chunk) => {
  buffer += chunk.toString();
  let idx;
  while ((idx = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});

function rpc(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, resolve);
    setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 30000);
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}

function notify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

function firstText(result) {
  return JSON.parse(result.content[0].text);
}

try {
  const init = await rpc("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "smoke", version: "0" },
  });
  console.log("✓ initialize:", init.result.serverInfo.name, init.result.serverInfo.version);
  notify("notifications/initialized", {});

  const tools = await rpc("tools/list", {});
  console.log(`✓ tools/list: ${tools.result.tools.length} tools`);

  const created = await rpc("tools/call", {
    name: "palace_create",
    arguments: { name: "Smoke Palace" },
  });
  const palace = firstText(created.result);
  console.log("✓ palace_create:", palace.id);

  await rpc("tools/call", {
    name: "node_create",
    arguments: { palace: "Smoke Palace", title: "Alpha", content: "first" },
  });
  await rpc("tools/call", {
    name: "node_create",
    arguments: { palace: "Smoke Palace", title: "Beta", content: "second" },
  });
  await rpc("tools/call", {
    name: "edge_create",
    arguments: {
      palace: "Smoke Palace",
      source: "Alpha",
      target: "Beta",
      cast: { who: "Giant", how: "Flowing", what: "Cloud", when: "Blue ocean" },
    },
  });
  console.log("✓ node_create ×2 + edge_create");

  const crux = await rpc("tools/call", {
    name: "graph_crux",
    arguments: { palace: "Smoke Palace" },
  });
  console.log("✓ graph_crux:", JSON.stringify(firstText(crux.result).crux));

  const dsl = await rpc("tools/call", {
    name: "palace_export_dsl",
    arguments: { palace: "Smoke Palace" },
  });
  console.log("✓ palace_export_dsl:\n" + firstText(dsl.result).dsl.split("\n").slice(0, 8).join("\n"));

  const resources = await rpc("resources/list", {});
  console.log(`✓ resources/list: ${resources.result.resources.length} resources`);

  const spec = await rpc("resources/read", { uri: "spec://palace-dsl" });
  console.log("✓ resources/read spec://palace-dsl:", spec.result.contents[0].text.length, "chars");

  const prompts = await rpc("prompts/list", {});
  console.log(`✓ prompts/list: ${prompts.result.prompts.map((p) => p.name).join(", ")}`);

  const drill = await rpc("prompts/get", {
    name: "nine-dive-drill",
    arguments: { palace: "Smoke Palace" },
  });
  console.log("✓ prompts/get nine-dive-drill:", drill.result.messages[0].content.text.length, "chars");

  console.log("\nALL SMOKE CHECKS PASSED");
} catch (error) {
  console.error("SMOKE FAILED:", error);
  process.exitCode = 1;
} finally {
  child.kill();
}
