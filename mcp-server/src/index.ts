import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { assertDbExists, resolveDbPath, sentinelDirFor } from "./dbPath";
import { initDb, openDb } from "./palaceDb";
import {
  comprehensionProtocolPrompt,
  encodingAssistantPrompt,
  nineDiveDrillPrompt,
} from "./prompts";
import {
  listPalaceDslResources,
  listTheSystemDocs,
  readDslSpec,
  readPalaceDsl,
  readTheSystemDoc,
} from "./resources";
import * as analysis from "./tools/analysis";
import * as dsl from "./tools/dsl";
import * as edges from "./tools/edges";
import * as nodes from "./tools/nodes";
import * as palaces from "./tools/palaces";
import * as routes from "./tools/routes";
import { CAST_AXIS_VALUES, type ServerContext } from "./tools/shared";

const dbPath = resolveDbPath();
if (!process.env.MEMORY_PALACE_DB) {
  assertDbExists(dbPath);
}
const db = openDb(dbPath);
initDb(db); // no-op on the app's DB; creates schema for fresh override paths

const ctx: ServerContext = { db, sentinelDir: sentinelDirFor(dbPath) };

const server = new McpServer({ name: "memory-palace", version: "0.7.0" });

type ToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

function asResult(value: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

function tool<A>(fn: (ctx: ServerContext, args: A) => unknown | Promise<unknown>) {
  return async (args: A): Promise<ToolResult> => {
    try {
      return asResult(await fn(ctx, args));
    } catch (error) {
      return {
        content: [{ type: "text", text: error instanceof Error ? error.message : String(error) }],
        isError: true,
      };
    }
  };
}

const palaceArg = z
  .string()
  .describe("Palace reference: id, exact name, or alias (case-insensitive)");

const castShape = {
  who: z
    .enum(["", ...CAST_AXIS_VALUES.who])
    .optional()
    .describe("WHO/source role: Giant=hub/controller, Mermaid=peer/mutual (bidirectional), Mage=helper, Dragon=reactive"),
  how: z
    .enum(["", ...CAST_AXIS_VALUES.how])
    .optional()
    .describe("HOW/effect: Crushing=controls, Flowing=feeds, Spreading=influences, Exploding=transforms"),
  what: z
    .enum(["", ...CAST_AXIS_VALUES.what])
    .optional()
    .describe("WHAT flows: Rock=data/structure, Water=resources, Cloud=signals/info, Lightning=events"),
  when: z
    .enum(["", ...CAST_AXIS_VALUES.when])
    .optional()
    .describe("WHEN/stability: Red cave=permanent, Blue ocean=normally active, Green sky=conditional, Purple storm=temporary"),
};

// ── Palace tools ─────────────────────────────────────────────────────

server.registerTool(
  "palace_list",
  {
    description: "List all memory palaces (optionally including trashed ones).",
    inputSchema: { includeTrashed: z.boolean().optional() },
  },
  tool(palaces.palaceList),
);

server.registerTool(
  "palace_get",
  {
    description: "Get a palace's metadata, counts, and route names.",
    inputSchema: { palace: palaceArg },
  },
  tool(palaces.palaceGet),
);

server.registerTool(
  "palace_create",
  {
    description: "Create a new, empty memory palace.",
    inputSchema: {
      name: z.string().min(1),
      atlasPath: z.string().optional().describe("Atlas hierarchy path, e.g. /engineering/oop"),
    },
  },
  tool(palaces.palaceCreate),
);

server.registerTool(
  "palace_update_meta",
  {
    description: "Update a palace's name, alias, or atlas path.",
    inputSchema: {
      palace: palaceArg,
      name: z.string().optional(),
      alias: z.string().nullable().optional(),
      atlasPath: z.string().nullable().optional(),
    },
  },
  tool(palaces.palaceUpdateMeta),
);

server.registerTool(
  "palace_delete",
  {
    description: "Soft-delete a palace (restorable for 30 days via palace_restore).",
    inputSchema: { palace: palaceArg },
  },
  tool(palaces.palaceDelete),
);

server.registerTool(
  "palace_restore",
  {
    description: "Restore a soft-deleted palace from the trash.",
    inputSchema: { palace: z.string().describe("Trashed palace id or name") },
  },
  tool(palaces.palaceRestore),
);

server.registerTool(
  "palace_export_dsl",
  {
    description:
      "Export a palace as Palace DSL text (the canonical text format — see the spec://palace-dsl resource).",
    inputSchema: { palace: palaceArg },
  },
  tool(palaces.palaceExportDsl),
);

server.registerTool(
  "palace_export_json",
  {
    description: "Export a palace as the app's JSON bundle (version + full snapshot).",
    inputSchema: { palace: palaceArg },
  },
  tool(palaces.palaceExportJson),
);

// ── Node tools ───────────────────────────────────────────────────────

server.registerTool(
  "node_list",
  {
    description: "List nodes in a palace, optionally filtered by a search query over title/content/tags.",
    inputSchema: { palace: palaceArg, query: z.string().optional() },
  },
  tool(nodes.nodeList),
);

server.registerTool(
  "node_get",
  {
    description: "Get one node with its content, edges (in/out), and route memberships.",
    inputSchema: { palace: palaceArg, node: z.string().describe("Node id, title, or alias") },
  },
  tool(nodes.nodeGet),
);

server.registerTool(
  "node_create",
  {
    description: "Create a memory node on the palace canvas.",
    inputSchema: {
      palace: palaceArg,
      title: z.string().min(1),
      content: z
        .string()
        .optional()
        .describe(
          "Body content — the vivid encoding imagery. HTML allowed; when encoding from notes, end with a sources paragraph like <p>📖 <a href=\"obsidian://open?vault=Neural%20OS&file=path/to/note\">note</a></p>",
        ),
      tags: z.array(z.string()).optional(),
      position: z
        .object({ x: z.number(), y: z.number() })
        .optional()
        .describe("Canvas center point; omitted = auto-placed right of existing nodes"),
    },
  },
  tool(nodes.nodeCreate),
);

server.registerTool(
  "node_update",
  {
    description: "Update a node's title, content, alias, or tags.",
    inputSchema: {
      palace: palaceArg,
      node: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      alias: z.string().optional(),
      tags: z.array(z.string()).optional(),
    },
  },
  tool(nodes.nodeUpdate),
);

server.registerTool(
  "node_delete",
  {
    description: "Delete a node (its edges and route loci are removed too).",
    inputSchema: { palace: palaceArg, node: z.string() },
  },
  tool(nodes.nodeDelete),
);

// ── Edge tools ───────────────────────────────────────────────────────

server.registerTool(
  "edge_list",
  {
    description: "List all CAST edges in a palace.",
    inputSchema: { palace: palaceArg },
  },
  tool(edges.edgeList),
);

server.registerTool(
  "edge_create",
  {
    description: "Create a directed CAST edge between two nodes.",
    inputSchema: {
      palace: palaceArg,
      source: z.string().describe("Source node id, title, or alias"),
      target: z.string().describe("Target node id, title, or alias"),
      cast: z.object(castShape).optional(),
      label: z.string().optional().describe("Optional arrow label text"),
    },
  },
  tool(edges.edgeCreate),
);

server.registerTool(
  "edge_update",
  {
    description: "Update an edge's CAST values or alias (find ids with edge_list).",
    inputSchema: {
      palace: palaceArg,
      edge: z.string().describe("Edge id"),
      cast: z.object(castShape).optional(),
      alias: z.string().optional(),
    },
  },
  tool(edges.edgeUpdate),
);

server.registerTool(
  "edge_delete",
  {
    description: "Delete an edge by id.",
    inputSchema: { palace: palaceArg, edge: z.string() },
  },
  tool(edges.edgeDelete),
);

// ── Route & locus tools ──────────────────────────────────────────────

server.registerTool(
  "route_list",
  {
    description: "List routes with their ordered loci and spaced-repetition schedule state.",
    inputSchema: { palace: palaceArg },
  },
  tool(routes.routeList),
);

server.registerTool(
  "route_create",
  {
    description: "Create a walk route, optionally seeding ordered loci from node references.",
    inputSchema: {
      palace: palaceArg,
      name: z.string().min(1),
      nodes: z.array(z.string()).optional().describe("Ordered node ids/titles to add as loci"),
    },
  },
  tool(routes.routeCreate),
);

server.registerTool(
  "route_update",
  {
    description: "Rename a route.",
    inputSchema: { palace: palaceArg, route: z.string(), name: z.string().min(1) },
  },
  tool(routes.routeUpdate),
);

server.registerTool(
  "route_delete",
  {
    description: "Delete a route and its loci (the nodes stay).",
    inputSchema: { palace: palaceArg, route: z.string() },
  },
  tool(routes.routeDelete),
);

server.registerTool(
  "locus_add",
  {
    description: "Append a node to the end of a route as a new locus.",
    inputSchema: {
      palace: palaceArg,
      route: z.string(),
      node: z.string(),
      label: z.string().optional(),
    },
  },
  tool(routes.locusAdd),
);

server.registerTool(
  "locus_remove",
  {
    description: "Remove a locus from its route (find ids with route_list).",
    inputSchema: { palace: palaceArg, locus: z.string() },
  },
  tool(routes.locusRemove),
);

server.registerTool(
  "locus_reorder",
  {
    description: "Move a locus up or down within its route.",
    inputSchema: { palace: palaceArg, locus: z.string(), direction: z.enum(["up", "down"]) },
  },
  tool(routes.locusReorder),
);

// ── DSL tools ────────────────────────────────────────────────────────

server.registerTool(
  "palace_apply_dsl",
  {
    description:
      "Apply a Palace DSL document to an existing palace (diff-based: adds, updates, and deletes to match the DSL). Read spec://palace-dsl for syntax.",
    inputSchema: {
      palace: palaceArg,
      dsl: z.string(),
      force: z.boolean().optional().describe("Apply despite DSL errors"),
    },
  },
  tool(dsl.palaceApplyDsl),
);

server.registerTool(
  "palace_import_dsl",
  {
    description: "Create a brand-new palace from a Palace DSL document (name from its @header).",
    inputSchema: { dsl: z.string(), atlasPath: z.string().optional() },
  },
  tool(dsl.palaceImportDsl),
);

// ── Analysis tools ───────────────────────────────────────────────────

server.registerTool(
  "graph_analyze",
  {
    description:
      "Structural analysis of a palace graph: top betweenness/degree nodes, bridges, cycles, hub/leaf/isolate roles.",
    inputSchema: { palace: palaceArg },
  },
  tool(analysis.graphAnalyze),
);

server.registerTool(
  "graph_crux",
  {
    description:
      "Find the crux node — the single node that most gates the graph — plus the nine-dive drill questions for interrogating it.",
    inputSchema: { palace: palaceArg },
  },
  tool(analysis.graphCrux),
);

server.registerTool(
  "graph_motifs",
  {
    description:
      "Detect structural motifs (cascade, diamond, hub-spoke, feedback loop, bottleneck, bipartite) with suggested comprehension moves.",
    inputSchema: { palace: palaceArg },
  },
  tool(analysis.graphMotifs),
);

server.registerTool(
  "review_queue",
  {
    description: "Get the spaced-repetition review queue for a palace (overdue/due/fresh items).",
    inputSchema: { palace: palaceArg },
  },
  tool(analysis.reviewQueue),
);

server.registerTool(
  "analytics_list",
  {
    description: "List analytics events (palace activity, walks, recall ratings). Newest first.",
    inputSchema: {
      palace: palaceArg.optional(),
      eventType: z.string().optional().describe("e.g. node_created, walk_recall_rated"),
      limit: z.number().int().positive().optional().describe("Default 100"),
    },
  },
  tool(analysis.analyticsList),
);

// ── Resources ────────────────────────────────────────────────────────

server.registerResource(
  "palace-dsl-spec",
  "spec://palace-dsl",
  {
    title: "Palace DSL specification",
    description: "Syntax reference for the Palace DSL used by palace_apply_dsl / palace_import_dsl.",
    mimeType: "text/markdown",
  },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: readDslSpec() }] }),
);

server.registerResource(
  "palace-dsl",
  new ResourceTemplate("palace://{palaceId}/dsl", {
    list: async () => ({
      resources: listPalaceDslResources(ctx).map((p) => ({
        uri: p.uri,
        name: p.name,
        description: `Palace "${p.name}" as Palace DSL`,
        mimeType: "text/plain",
      })),
    }),
  }),
  {
    title: "Palace as DSL",
    description: "A memory palace serialized as Palace DSL text.",
    mimeType: "text/plain",
  },
  async (uri, variables) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/plain",
        text: readPalaceDsl(ctx, String(variables.palaceId)),
      },
    ],
  }),
);

server.registerResource(
  "thesystem",
  new ResourceTemplate("thesystem://{slug}", {
    list: async () => ({
      resources: listTheSystemDocs().map((d) => ({
        uri: `thesystem://${d.slug}`,
        name: d.title,
        description: `Memory-science doc: ${d.title}`,
        mimeType: "text/markdown",
      })),
    }),
  }),
  {
    title: "theSystem memory-science docs",
    description: "The lab's memory-science knowledge base (CAST system, encoding, recall protocols, …).",
    mimeType: "text/markdown",
  },
  async (uri, variables) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/markdown",
        text: readTheSystemDoc(String(variables.slug)).text,
      },
    ],
  }),
);

// ── Prompts ──────────────────────────────────────────────────────────

function promptResult(text: string) {
  return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
}

server.registerPrompt(
  "nine-dive-drill",
  {
    description:
      "Interrogate one node (default: the palace crux) with the nine-dive content/process/premise drill.",
    argsSchema: {
      palace: z.string().describe("Palace id, name, or alias"),
      node: z.string().optional().describe("Node id or title; omitted = the crux node"),
    },
  },
  (args) => promptResult(nineDiveDrillPrompt(ctx, args)),
);

server.registerPrompt(
  "comprehension-protocol",
  {
    description: "Run the five-gate comprehension protocol against a palace.",
    argsSchema: { palace: z.string().describe("Palace id, name, or alias") },
  },
  (args) => promptResult(comprehensionProtocolPrompt(ctx, args)),
);

server.registerPrompt(
  "encoding-assistant",
  {
    description: "Design nodes, CAST edges, and a route for a topic, then build them via the write tools.",
    argsSchema: {
      topic: z.string().describe("What to encode, e.g. 'TCP handshake'"),
      palace: z.string().optional().describe("Existing palace to extend; omitted = create a new one"),
    },
  },
  (args) => promptResult(encodingAssistantPrompt(ctx, args)),
);

// ── Start ────────────────────────────────────────────────────────────

await server.connect(new StdioServerTransport());
console.error(`memory-palace MCP server ready (db: ${dbPath})`);
