import { NINE_DIVE } from "../../src/domain/services/cast/nineDive";
import { selectCrux } from "../../src/domain/services/cast/crux";
import { analyzeGraph } from "../../src/domain/services/cast/graphAnalysis";
import { serializeDsl } from "../../src/domain/services/palaceDsl/serializer";
import { loadPalace, resolvePalace } from "./palaceDb";
import { readTheSystemDoc } from "./resources";
import { graphAnalyze } from "./tools/analysis";
import { resolveNodeRef, type ServerContext } from "./tools/shared";

function nineDiveText(): string {
  return NINE_DIVE.map(
    (layer) =>
      `${layer.label} layer (${layer.focus}):\n${layer.questions.map((q) => `  - ${q}`).join("\n")}`,
  ).join("\n\n");
}

/**
 * Nine-dive reflection drill on one node (default: the crux).
 * Mirrors the in-app Comprehend drill (ComprehendPanel).
 */
export function nineDiveDrillPrompt(ctx: ServerContext, args: { palace: string; node?: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);

  let node;
  let cruxNote = "";
  if (args.node) {
    node = resolveNodeRef(snapshot.nodes, args.node);
  } else {
    const crux = selectCrux(analyzeGraph({ nodes: snapshot.nodes, edges: snapshot.edges }));
    if (!crux) throw new Error("Palace has no crux (empty graph) — pass a node explicitly.");
    node = snapshot.nodes.find((n) => n.id === crux.nodeId)!;
    cruxNote = ` (selected as the palace crux, reason: ${crux.reason})`;
  }

  const titleOf = (id: string) => snapshot.nodes.find((n) => n.id === id)?.title ?? id;
  const edges = [
    ...snapshot.edges
      .filter((e) => e.sourceNodeId === node.id)
      .map((e) => `→ ${titleOf(e.targetNodeId)} [${e.castAb}|${e.castCd}|${e.castEf}|${e.castGh}]`),
    ...snapshot.edges
      .filter((e) => e.targetNodeId === node.id)
      .map((e) => `← ${titleOf(e.sourceNodeId)} [${e.castAb}|${e.castCd}|${e.castEf}|${e.castGh}]`),
  ];

  return [
    `Run the nine-dive reflection drill on the node "${node.title}"${cruxNote} from the memory palace "${palace.name}".`,
    ``,
    `Node content:\n${node.content || "(no body content)"}`,
    ``,
    `Connections:\n${edges.length > 0 ? edges.join("\n") : "(no edges)"}`,
    ``,
    `The drill has three layers of three questions (Mezirow's content/process/premise reflection):`,
    ``,
    nineDiveText(),
    ``,
    `Work through the layers in order, one question at a time. Ask me each question, wait for my answer, then probe my answer before moving on. The goal is for me to discover gaps in my understanding, not for you to lecture.`,
  ].join("\n");
}

/** Five-gate comprehension protocol applied to a palace. */
export function comprehensionProtocolPrompt(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  const protocol = readTheSystemDoc("comprehension-protocol");
  const analysis = graphAnalyze(ctx, { palace: palace.id });

  return [
    `Run the comprehension protocol below against my memory palace "${palace.name}".`,
    ``,
    `## The palace (DSL)`,
    "```",
    serializeDsl(snapshot),
    "```",
    ``,
    `## Graph analysis summary`,
    "```json",
    JSON.stringify(analysis, null, 2),
    "```",
    ``,
    `## Protocol`,
    protocol.text,
    ``,
    `Walk me through the gates in order, using the graph analysis to pick where to probe. Stop at the first gate I fail and help me repair it before continuing.`,
  ].join("\n");
}

/** Encoding assistant: design nodes/CAST edges/routes for a topic. */
export function encodingAssistantPrompt(ctx: ServerContext, args: { topic: string; palace?: string }) {
  const castSystem = readTheSystemDoc("cast-system");
  const conceptEncoding = readTheSystemDoc("concept-encoding");

  const sections = [
    `Help me encode the topic "${args.topic}" into a memory palace.`,
    ``,
    `## CAST system (how edges are encoded)`,
    castSystem.text.slice(0, 8000),
    ``,
    `## Concept encoding guide`,
    conceptEncoding.text.slice(0, 8000),
  ];

  if (args.palace) {
    const palace = resolvePalace(ctx.db, args.palace);
    const snapshot = loadPalace(ctx.db, palace.id);
    if (snapshot) {
      sections.push(
        ``,
        `## Existing palace "${palace.name}" (extend this, don't duplicate)`,
        "```",
        serializeDsl(snapshot),
        "```",
      );
    }
  }

  sections.push(
    ``,
    `Design the encoding: propose nodes (title + one-line vivid content), CAST edges between them, and one walk route.`,
    args.palace
      ? `Then realize it with the memory-palace MCP write tools (node_create, edge_create, route_create) or a single palace_apply_dsl call against "${args.palace}".`
      : `Then realize it with the memory-palace MCP tool palace_import_dsl (one DSL document with @header, nodes, edges, and a route).`,
    ``,
    `If the material comes from notes (Obsidian vault, wiki, docs), end each node's content with a sources paragraph linking back to them, e.g.:`,
    `<p>📖 <a href="obsidian://open?vault=Neural%20OS&file=wiki/<folder>/<note>">note-name</a></p>`,
    `(URL-encode spaces in the vault name; the file path is vault-relative without the .md extension. The app opens these with Ctrl+click.)`,
  );

  return sections.join("\n");
}
