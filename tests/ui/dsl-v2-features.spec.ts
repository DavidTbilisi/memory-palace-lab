/**
 * DSL v2.0 feature coverage.
 *
 * Tests every language feature introduced in the v2.0 epic:
 *   - Stable node identifiers  [id] Title
 *   - Edge semantic aliases    ~alias:cast description
 *   - Structured tags          #key:value
 *   - Route metadata           #key:value before first locus
 *   - Portal nodes             @portal /palaces/<name>
 *   - Query declarations       ?verb args
 *   - Inline node refs         {#id} in body text
 *   - Normalization            canonical hash stability
 *   - Formal diagnostics       errors + warnings with numeric codes
 *
 * All tests run against the Vite dev server with the in-memory repository.
 * They exercise the same code path (parseDsl → applyDslSnapshot) that runs
 * in the Tauri desktop build.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const THIS_DIR = fileURLToPath(new URL(".", import.meta.url));

function fixture(name: string) {
  return readFileSync(
    resolve(THIS_DIR, "../../src/domain/services/palaceDsl/fixtures", name),
    "utf8",
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type SceneCounts = { nodes: number; edges: number; routes: number; loci: number };

async function readSceneCounts(page: import("@playwright/test").Page): Promise<SceneCounts> {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
      routes: Array<{ name: string }>;
      loci: Array<unknown>;
    };
    const editor = state.editorRef;
    if (!editor) return { nodes: 0, edges: 0, routes: state.routes.length, loci: state.loci.length };
    let nodes = 0;
    let edges = 0;
    for (const id of editor.getCurrentPageShapeIds()) {
      const shape = editor.getShape(id);
      const meta = (shape?.meta ?? {}) as Record<string, unknown>;
      if (shape?.type === "geo" && meta.mpNodeId) nodes++;
      if (shape?.type === "arrow" && meta.mpEdgeId) edges++;
    }
    return { nodes, edges, routes: state.routes.length, loci: state.loci.length };
  });
}

async function readStoreNodes(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    const state = store.getState() as {
      nodes: Array<{
        id: string;
        title: string;
        kind: string;
        tags?: string[];
        portal: unknown | null;
      }>;
    };
    return state.nodes.map((n) => ({
      id: n.id,
      title: n.title,
      kind: n.kind,
      tagCount: n.tags?.length ?? 0,
      hasPortal: n.portal !== null,
    }));
  });
}

async function readStoreEdges(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    const state = store.getState() as {
      edges: Array<{
        id: string;
        sourceNodeId: string;
        targetNodeId: string;
        castAb: string;
        castCd: string;
        castEf: string;
        castGh: string;
      }>;
    };
    return state.edges;
  });
}

async function readStoreRoutes(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing store hook");
    const state = store.getState() as {
      routes: Array<{ id: string; name: string }>;
      loci: Array<{ routeId: string; nodeId: string; orderIndex: number; label: string }>;
    };
    return {
      routes: state.routes.map((r) => r.name),
      loci: state.loci.map((l) => ({
        routeId: l.routeId,
        nodeId: l.nodeId,
        orderIndex: l.orderIndex,
        label: l.label,
      })),
    };
  });
}

async function openDslEditor(page: import("@playwright/test").Page) {
  await page.keyboard.press("Control+E");
  await expect(page.getByTestId("palace-dsl-editor")).toBeVisible();
}

async function typeDsl(page: import("@playwright/test").Page, dsl: string) {
  const cm = page.locator(".cm-content").first();
  await cm.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Delete");
  await cm.pressSequentially(dsl, { delay: 2 });
  await page.locator("body").click();
  await page.waitForTimeout(700);
}

async function bootstrapPalace(page: import("@playwright/test").Page, _name = "DSL Test Palace") {
  await page.goto("/");
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
}

// ── MAX-COMPLEXITY DSL ────────────────────────────────────────────────────────

const COMPLEX_DSL = `@Complex Palace
@atlas /engineering/patterns

~dep:0001 depends on
~leads:1000 leads to
~both:1001 interacts with

[gate] Gate of Patterns
: The central hub of the palace.
: Navigate from here to all districts.
#architecture #hub #difficulty:intermediate #domain:engineering
>Single Responsibility dep
>Open Closed leads

[srp] Single Responsibility
: Each module has exactly one reason to change.
#cohesion #maintenance #difficulty:beginner
>Change Hydra leads

[ocp] Open Closed
: Open for extension, closed for modification.
#extensibility #ocp #difficulty:advanced
>Plugin System leads

Change Hydra
: Too many responsibilities create chaotic dependencies.
#anti-pattern #coupling

Plugin System
: Extension points allow capability growth without modification.
#composition #extension

Portal Node
@portal /palaces/standards
#portal-hub

/Main Route
#difficulty:intermediate #prereq:Gate of Patterns
1 Gate of Patterns
2 Single Responsibility
3 Open Closed
4 Change Hydra
5 Plugin System

/Violations Route
#difficulty:beginner
1 Change Hydra
2 Plugin System

?all
?tag difficulty:intermediate
?path Gate of Patterns Plugin System
`;

test.describe("DSL v2 — max-complexity palace syncs to canvas", () => {
  test("all nodes, edges, routes, and loci sync correctly", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, COMPLEX_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 15000 })
      .toMatchObject({ nodes: 6, edges: 4, routes: 2, loci: 7 });
  });

  test("diagnostics show 0 errors and 0 warnings", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, COMPLEX_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ nodes: 6 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 warnings/i);
  });

  test("portal node has kind portal", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, COMPLEX_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ nodes: 6 });

    const nodes = await readStoreNodes(page);
    const portalNode = nodes.find((n) => n.title === "Portal Node");
    expect(portalNode).toBeDefined();
    expect(portalNode!.kind).toBe("portal");
    expect(portalNode!.hasPortal).toBe(true);
  });

  test("route names are preserved", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, COMPLEX_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ routes: 2 });

    const { routes } = await readStoreRoutes(page);
    expect(routes).toContain("Main Route");
    expect(routes).toContain("Violations Route");
  });

  test("main route has 5 loci in declaration order", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, COMPLEX_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ routes: 2, loci: 7 });

    const { loci } = await readStoreRoutes(page);
    const routeNames = await page.evaluate(() => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing store hook");
      return (store.getState() as { routes: Array<{ id: string; name: string }> }).routes;
    });
    const mainRouteId = routeNames.find((r) => r.name === "Main Route")?.id;
    expect(mainRouteId).toBeDefined();
    const mainLoci = loci
      .filter((l) => l.routeId === mainRouteId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    expect(mainLoci).toHaveLength(5);
    expect(mainLoci[0]!.label).toBe("Gate of Patterns");
    expect(mainLoci[4]!.label).toBe("Plugin System");
  });
});

// ── STABLE NODE IDENTIFIERS ───────────────────────────────────────────────────

test.describe("DSL v2 — stable node identifiers [id]", () => {
  const ID_DSL = `@ID Palace

[auth] Authentication
: The auth module.

[login] Login Flow
: Handles user sign-in.
>Authentication 1000
`;

  test("explicit id nodes sync to canvas", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, ID_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, edges: 1 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
  });

  test("reserved id [palace] emits E103 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\n[palace] Auth\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("duplicate node id emits E102 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\n[auth] Authentication\n\n[auth] Authorization\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("malformed node id emits E101 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\n[auth node!] Authentication\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });
});

// ── EDGE SEMANTIC ALIASES ─────────────────────────────────────────────────────

test.describe("DSL v2 — edge semantic aliases ~alias:cast", () => {
  const ALIAS_DSL = `@Alias Palace

~dep:0001 depends on
~causes:1000 causes

Alpha
: First node.
>Beta dep
>Gamma causes

Beta
: Second node.

Gamma
: Third node.
`;

  test("alias edges sync with correct CAST values", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, ALIAS_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 3, edges: 2 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);

    const edges = await readStoreEdges(page);
    expect(edges).toHaveLength(2);

    // ~dep:0001 → ab="", cd="", ef="", gh="Red cave"
    const depEdge = edges.find((e) => e.castGh === "Red cave" && e.castAb === "");
    expect(depEdge).toBeDefined();

    // ~causes:1000 → ab="Giant", cd="", ef="", gh=""
    const causesEdge = edges.find((e) => e.castAb === "Giant" && e.castGh === "");
    expect(causesEdge).toBeDefined();
  });

  test("unknown alias emits W305 warning", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n>Beta undeclared\n\nBeta\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 warnings/i);
  });

  test("duplicate alias declaration emits E303 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n~dep:0001 depends on\n~dep:1000 leads to\n\nAlpha\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("malformed alias emits E301 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n~nodotcolon Alpha\n\nNode\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("alias with invalid cast emits E302 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n~dep:XXXX depends on\n\nNode\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });
});

// ── STRUCTURED TAGS ───────────────────────────────────────────────────────────

test.describe("DSL v2 — structured tags #key:value", () => {
  const TAG_DSL = `@Tag Palace

Alpha
: First node.
#difficulty:beginner #domain:logic #plain-tag #another-plain

Beta
: Second node.
#difficulty:advanced #domain:math

/Tag Route
#difficulty:beginner
1 Alpha
2 Beta
`;

  test("structured tags parse without errors", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, TAG_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, routes: 1, loci: 2 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 warnings/i);
  });

  test("nodes carry tags from DSL", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, TAG_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2 });

    const nodes = await readStoreNodes(page);
    const alpha = nodes.find((n) => n.title === "Alpha");
    expect(alpha).toBeDefined();
    expect(alpha!.tagCount).toBeGreaterThan(0);
  });
});

// ── ROUTE METADATA ────────────────────────────────────────────────────────────

test.describe("DSL v2 — route metadata #key:value before loci", () => {
  const ROUTE_META_DSL = `@Route Meta Palace

Alpha
: First node.

Beta
: Second node.

/Advanced Route
#difficulty:advanced #prereq:Alpha
1 Alpha
2 Beta

/Beginner Route
#difficulty:beginner
1 Alpha
`;

  test("route metadata parses without errors", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, ROUTE_META_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, routes: 2, loci: 3 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 warnings/i);
  });

  test("unresolved prereq emits W701 warning", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n\n/Route\n#prereq:NonExistent\n1 Alpha\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 warnings/i);
  });
});

// ── PORTAL NODES ──────────────────────────────────────────────────────────────

test.describe("DSL v2 — portal nodes @portal", () => {
  const PORTAL_DSL = `@Portal Palace

Gateway Node
: Entry to the inner palace.
@portal /palaces/inner

Targeted Portal
: Opens at a specific route.
@portal /palaces/inner#fast-walk

Deep Portal
: Opens at a specific route and node.
@portal /palaces/inner#fast-walk@start

Plain Memory
: Not a portal.
`;

  test("portal nodes sync with kind portal", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, PORTAL_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 4 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);

    const nodes = await readStoreNodes(page);
    const portals = nodes.filter((n) => n.kind === "portal");
    expect(portals).toHaveLength(3);

    const plain = nodes.find((n) => n.title === "Plain Memory");
    expect(plain?.kind).toBe("memory");
  });

  test("portal nodes carry portal metadata", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, PORTAL_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 4 });

    const nodes = await readStoreNodes(page);
    const gateway = nodes.find((n) => n.title === "Gateway Node");
    expect(gateway?.hasPortal).toBe(true);
  });

  test("malformed portal target emits E005 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nGateway\n@portal not-a-valid-path\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });
});

// ── QUERY DECLARATIONS ────────────────────────────────────────────────────────

test.describe("DSL v2 — query language ?verb args", () => {
  const QUERY_DSL = `@Query Palace

Alpha
: First node.
#difficulty:beginner

Beta
: Second node.
#difficulty:advanced

/Alpha Route
1 Alpha

?all
?tag difficulty:beginner
?node Alpha
?neighbors Alpha
?route Alpha Route
?depends Alpha
?path Alpha Beta
?filter #difficulty:beginner
`;

  test("all 8 query verbs parse without errors", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, QUERY_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, routes: 1 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 warnings/i);
  });

  test("unknown query verb emits E801 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n\n?unknownverb foo\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("?path missing second arg emits E802 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n\n?path Alpha\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("query referencing unknown node emits W803 warning", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n\n?node NonExistentNode\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 warnings/i);
  });

  test("?route referencing unknown route emits W804 warning", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n\n?route NoSuchRoute\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 warnings/i);
  });
});

// ── ATLAS PATH ────────────────────────────────────────────────────────────────

test.describe("DSL v2 — atlas path @atlas", () => {
  test("@atlas path parses without error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@Deep Palace\n@atlas /science/physics/quantum\n\nAtom\n: A particle.\n");

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 1 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
  });
});

// ── IMPORT DECLARATIONS ───────────────────────────────────────────────────────

test.describe("DSL v2 — import declarations !import", () => {
  test("malformed import emits E401 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n!import missing-as-clause\n\nNode\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("duplicate namespace emits E402 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n!import a.dsl as sec\n!import b.dsl as sec\n\nNode\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });
});

// ── CORE DIAGNOSTIC CODES ────────────────────────────────────────────────────

test.describe("DSL v2 — core diagnostic codes", () => {
  test("missing palace header emits E001 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "Node Title\n: body\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("duplicate node title emits E002 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAuth\n: first\n\nAuth\n: duplicate\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("malformed CAST token emits E003 error", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n>Beta XXXX\n\nBeta\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 errors/i);
  });

  test("unknown edge target emits W007 warning", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, "@P\n\nAlpha\n>NonExistent 1000\n");

    await expect(page.getByTestId("palace-dsl-status")).not.toContainText(/0 warnings/i);
  });
});

// ── NORMALIZATION & CANONICAL HASH ────────────────────────────────────────────

test.describe("DSL v2 — normalization and canonical hash", () => {
  const SRC_A = "@P\n\nAuth\n#zebra #apple\n\nLogin\n>Auth 1000\n\n/Walk\n1 Auth\n2 Login\n";
  // Same logical content, different source order
  const SRC_B = "@P\n\nLogin\n>Auth 1000\n\nAuth\n#apple #zebra\n\n/Walk\n1 Auth\n2 Login\n";

  test("mechanics fixture produces 0 errors, 0 warnings", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, fixture("mechanics.dsl"));

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 warnings/i);
  });

  test("SOLID fixture: 14 nodes, 15 edges, 2 routes, 12 loci", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, fixture("solid-citadel.dsl"));

    await expect
      .poll(() => readSceneCounts(page), { timeout: 15000 })
      .toMatchObject({ nodes: 14, edges: 15, routes: 2, loci: 12 });
  });

  test("re-typing same DSL replaces the palace cleanly (no ghost nodes)", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, SRC_A);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, edges: 1 });

    await typeDsl(page, SRC_B);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, edges: 1 });
  });

  test("adding a node increases count by exactly 1", async ({ page }) => {
    const base = "@P\n\nAlpha\n\nBeta\n>Alpha 1000\n";
    const extended = "@P\n\nAlpha\n\nBeta\n>Alpha 1000\n\nGamma\n>Beta 0100\n";

    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, base);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2, edges: 1 });

    await typeDsl(page, extended);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 3, edges: 2 });
  });

  test("removing a node decreases count by exactly 1", async ({ page }) => {
    const full = "@P\n\nAlpha\n\nBeta\n\nGamma\n";
    const reduced = "@P\n\nAlpha\n\nBeta\n";

    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, full);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 3 });

    await typeDsl(page, reduced);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 10000 })
      .toMatchObject({ nodes: 2 });
  });
});

// ── EDGE CAST SEMANTICS ───────────────────────────────────────────────────────

test.describe("DSL v2 — CAST edge profiles", () => {
  const CAST_DSL = `@CAST Palace

Alpha
: Source node.
>Beta 0000
>Gamma 1000
>Delta 0100
>Epsilon 0010
>Zeta 0001
>Eta 1111

Beta
: 0000 — no cast.

Gamma
: 1000 — who: Giant.

Delta
: 0100 — how: Crushing.

Epsilon
: 0010 — what: Rock.

Zeta
: 0001 — when: Red cave.

Eta
: 1111 — full cast.
`;

  test("varied CAST tokens sync without errors", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, CAST_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ nodes: 7, edges: 6 });

    await expect(page.getByTestId("palace-dsl-status")).toContainText(/0 errors/i);
  });

  test("1111 cast encodes all four axes", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, CAST_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ nodes: 7 });

    const edges = await readStoreEdges(page);
    const fullEdge = edges.find((e) => e.castAb === "Giant" && e.castCd === "Crushing" && e.castEf === "Rock" && e.castGh === "Red cave");
    expect(fullEdge).toBeDefined();
  });

  test("0000 cast leaves all axes empty", async ({ page }) => {
    await bootstrapPalace(page);
    await openDslEditor(page);
    await typeDsl(page, CAST_DSL);

    await expect
      .poll(() => readSceneCounts(page), { timeout: 12000 })
      .toMatchObject({ nodes: 7 });

    const edges = await readStoreEdges(page);
    const emptyEdge = edges.find((e) => e.castAb === "" && e.castCd === "" && e.castEf === "" && e.castGh === "");
    expect(emptyEdge).toBeDefined();
  });
});
