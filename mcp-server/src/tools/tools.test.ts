import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { parseDsl } from "../../../src/domain/services/palaceDsl/parser";
import { initDb, listAnalyticsEvents, loadPalace, openDb } from "../palaceDb";
import { SENTINEL_FILE_NAME } from "../sentinel";
import * as analysis from "./analysis";
import * as dsl from "./dsl";
import * as edges from "./edges";
import * as nodes from "./nodes";
import * as palaces from "./palaces";
import * as routes from "./routes";
import type { ServerContext } from "./shared";

describe("MCP tools (end to end on a temp DB)", () => {
  let dir: string;
  let ctx: ServerContext;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "mpl-mcp-tools-"));
    const db = openDb(join(dir, "test.sqlite3"));
    initDb(db);
    ctx = { db, sentinelDir: dir };
  });

  afterEach(() => {
    ctx.db.close();
    rmSync(dir, { recursive: true, force: true });
  });

  it("create palace → nodes → edge → route → analyze → export round-trip", async () => {
    const palace = palaceCreateHelper();

    const alpha = await nodes.nodeCreate(ctx, {
      palace: palace.id,
      title: "Alpha",
      content: "the start",
      tags: ["intro"],
    });
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "Beta", content: "the end" });
    expect(alpha.id).toBeTruthy();

    const edge = await edges.edgeCreate(ctx, {
      palace: palace.id,
      source: "Alpha",
      target: "Beta",
      cast: { who: "Giant", how: "Crushing", what: "Rock", when: "Red cave" },
    });
    expect(edge.created).toBe(true);

    const route = await routes.routeCreate(ctx, {
      palace: palace.id,
      name: "Main walk",
      nodes: ["Alpha", "Beta"],
    });
    expect(route.loci).toEqual(["Alpha", "Beta"]);

    // Reads see everything, by name reference too.
    const got = palaces.palaceGet(ctx, { palace: "Test Palace" });
    expect(got.nodeCount).toBe(2);
    expect(got.edgeCount).toBe(1);
    expect(got.routeCount).toBe(1);
    expect(got.locusCount).toBe(2);

    const nodeDetail = nodes.nodeGet(ctx, { palace: palace.id, node: "Alpha" });
    expect(nodeDetail.outgoing).toHaveLength(1);
    expect(nodeDetail.outgoing[0]!.target).toBe("Beta");
    expect(nodeDetail.routes).toHaveLength(1);

    const crux = analysis.graphCrux(ctx, { palace: palace.id });
    expect(crux.crux).not.toBeNull();

    // The DSL export parses cleanly back.
    const exported = palaces.palaceExportDsl(ctx, { palace: palace.id });
    const reparsed = parseDsl(exported.dsl);
    expect(reparsed.diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    expect(reparsed.snapshot.nodes).toHaveLength(2);
    expect(reparsed.snapshot.routes).toHaveLength(1);

    // Analytics carry the mcp source marker.
    const events = listAnalyticsEvents(ctx.db, { palaceId: palace.id });
    expect(events.some((e) => e.eventType === "node_created" && e.payloadJson.includes('"mcp"'))).toBe(
      true,
    );

    // Sentinel was written for the live app to pick up.
    const sentinelPath = join(dir, SENTINEL_FILE_NAME);
    expect(existsSync(sentinelPath)).toBe(true);
    const sentinel = JSON.parse(readFileSync(sentinelPath, "utf8"));
    expect(sentinel.palaceId).toBe(palace.id);
  });

  it("node update and delete cascade through edges and loci", async () => {
    const palace = palaceCreateHelper();
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "Alpha" });
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "Beta" });
    await edges.edgeCreate(ctx, { palace: palace.id, source: "Alpha", target: "Beta" });
    await routes.routeCreate(ctx, { palace: palace.id, name: "Walk", nodes: ["Alpha", "Beta"] });

    await nodes.nodeUpdate(ctx, { palace: palace.id, node: "Alpha", title: "Alpha Prime", content: "renamed" });
    let snap = loadPalace(ctx.db, palace.id)!;
    expect(snap.nodes.map((n) => n.title).sort()).toEqual(["Alpha Prime", "Beta"]);

    await nodes.nodeDelete(ctx, { palace: palace.id, node: "Alpha Prime" });
    snap = loadPalace(ctx.db, palace.id)!;
    expect(snap.nodes).toHaveLength(1);
    expect(snap.edges).toHaveLength(0);
    expect(snap.loci).toHaveLength(1); // Alpha's locus dropped, Beta's stays
  });

  it("rejects invalid CAST values", async () => {
    const palace = palaceCreateHelper();
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "A" });
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "B" });
    await expect(
      edges.edgeCreate(ctx, {
        palace: palace.id,
        source: "A",
        target: "B",
        cast: { who: "Wizard" },
      }),
    ).rejects.toThrow(/Invalid CAST who/);
  });

  it("palace_apply_dsl applies and is idempotent; import_dsl creates a palace", async () => {
    const doc = [
      "@Imported Realm",
      "@atlas /test/realm",
      "",
      "[gate] The Gate",
      ": A glowing entry arch",
      ">The Hall 1110",
      "",
      "[hall] The Hall",
      ": Vast and echoing",
      "",
      "/Entry Walk",
      "1 The Gate",
      "2 The Hall",
    ].join("\n");

    const imported = await dsl.palaceImportDsl(ctx, { dsl: doc });
    expect(imported.created).toBe(true);
    if (!imported.created) return;
    expect(imported.name).toBe("Imported Realm");

    const snap = loadPalace(ctx.db, imported.palaceId as string)!;
    expect(snap.nodes).toHaveLength(2);
    expect(snap.edges).toHaveLength(1);
    expect(snap.routes).toHaveLength(1);
    expect(snap.loci).toHaveLength(2);
    expect(snap.palace.editorSnapshot).toBeTruthy();

    // Import creates the palace the same way palace_create does: one
    // palace_created event, tagged with the writing surface.
    const created = listAnalyticsEvents(ctx.db, { palaceId: imported.palaceId as string, eventType: "palace_created" });
    expect(created).toHaveLength(1);
    expect(JSON.parse(created[0]!.payloadJson)).toMatchObject({ name: "Imported Realm", source: "mcp" });

    // Re-applying the same DSL changes nothing.
    const again = await dsl.palaceApplyDsl(ctx, { palace: imported.palaceId as string, dsl: doc });
    expect(again.applied).toBe(true);
    if (!again.applied) return;
    expect(again.added).toMatchObject({ nodes: 0, edges: 0, routes: 0, loci: 0 });
    expect(again.deleted).toMatchObject({ nodes: 0, edges: 0, routes: 0, loci: 0 });
  });

  it("apply_dsl refuses documents with errors unless forced", async () => {
    const palace = palaceCreateHelper();
    const bad = ["@Bad", "", "Node A", "", "Node A"].join("\n"); // duplicate title (E002)
    const result = await dsl.palaceApplyDsl(ctx, { palace: palace.id, dsl: bad });
    expect(result.applied).toBe(false);
    expect(result.diagnostics.some((d) => d.severity === "error")).toBe(true);
  });

  it("reports a corrupt editor_snapshot with palace name instead of a JSON stack", async () => {
    const palace = palaceCreateHelper();
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "A" });
    ctx.db.prepare("UPDATE palaces SET editor_snapshot = ? WHERE id = ?").run("{not json", palace.id);
    await expect(nodes.nodeCreate(ctx, { palace: palace.id, title: "B" })).rejects.toThrow(
      /Test Palace.*corrupt canvas snapshot/,
    );
  });

  it("soft delete hides the palace and restore brings it back", () => {
    const palace = palaceCreateHelper();
    palaces.palaceDelete(ctx, { palace: palace.id });
    expect(palaces.palaceList(ctx, {}).palaces.find((p) => p.id === palace.id)).toBeUndefined();
    palaces.palaceRestore(ctx, { palace: "Test Palace" });
    expect(palaces.palaceList(ctx, {}).palaces.find((p) => p.id === palace.id)).toBeDefined();
  });

  it("locus add/reorder/remove maintain order", async () => {
    const palace = palaceCreateHelper();
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "A" });
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "B" });
    await nodes.nodeCreate(ctx, { palace: palace.id, title: "C" });
    await routes.routeCreate(ctx, { palace: palace.id, name: "Walk", nodes: ["A", "B"] });
    await routes.locusAdd(ctx, { palace: palace.id, route: "Walk", node: "C" });

    let listed = routes.routeList(ctx, { palace: palace.id }).routes[0]!;
    expect(listed.loci.map((l) => l.node)).toEqual(["A", "B", "C"]);

    const cLocus = listed.loci[2]!.locusId;
    await routes.locusReorder(ctx, { palace: palace.id, locus: cLocus, direction: "up" });
    listed = routes.routeList(ctx, { palace: palace.id }).routes[0]!;
    expect(listed.loci.map((l) => l.node)).toEqual(["A", "C", "B"]);

    await routes.locusRemove(ctx, { palace: palace.id, locus: cLocus });
    listed = routes.routeList(ctx, { palace: palace.id }).routes[0]!;
    expect(listed.loci.map((l) => l.node)).toEqual(["A", "B"]);
  });

  function palaceCreateHelper() {
    return palaces.palaceCreate(ctx, { name: "Test Palace" });
  }
});
