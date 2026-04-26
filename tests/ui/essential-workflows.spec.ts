import { expect, test } from "@playwright/test";

async function bootstrapTutorialPalace(page: import("@playwright/test").Page) {
  await page.goto("/");
  await expect(page.getByText("Memory Palace Lab")).toBeVisible();
  await page.getByRole("button", { name: /create tutorial palace/i }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
}

async function doubleClickCanvasAt(page: import("@playwright/test").Page, x: number, y: number) {
  await page.locator(".tl-background").first().dblclick({ position: { x, y } });
}

async function queuePendingCast(page: import("@playwright/test").Page, fromIndex: number, toIndex: number) {
  await page.evaluate(
    ([sourceIndex, targetIndex]) => {
      const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
      if (!store) throw new Error("missing dev store hook");
      const state = store.getState() as {
        editorRef: {
          getCurrentPageShapeIds: () => Iterable<string>;
          getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
        } | null;
        setPendingCast: (v: {
          fromShapeId: string;
          toShapeId: string;
          sourceNodeId: string;
          targetNodeId: string;
        }) => void;
      };
      const editor = state.editorRef;
      if (!editor) throw new Error("editor not ready");
      const nodes: Array<{ shapeId: string; nodeId: string }> = [];
      for (const shapeId of editor.getCurrentPageShapeIds()) {
        const shape = editor.getShape(shapeId);
        const nodeId = shape?.type === "geo" ? (shape.meta?.mpNodeId as string | undefined) : undefined;
        if (nodeId) nodes.push({ shapeId, nodeId });
      }
      const fromNode = nodes[sourceIndex];
      const toNode = nodes[targetIndex];
      if (!fromNode || !toNode) throw new Error("need at least two nodes");
      state.setPendingCast({
        fromShapeId: fromNode.shapeId,
        toShapeId: toNode.shapeId,
        sourceNodeId: fromNode.nodeId,
        targetNodeId: toNode.nodeId,
      });
    },
    [fromIndex, toIndex],
  );
}

test("palace save/load workflow", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Gateway Node");
  await page.getByRole("button", { name: "Apply" }).click();
  await page.getByRole("button", { name: /^Save$/ }).click();

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Second Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Second Palace" })).toBeVisible();

  await page.getByRole("button", { name: "Tutorial Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tutorial Palace" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tutorial Palace", exact: true })).toBeVisible();
});

test("draft autosave restores unsaved work after switching palaces", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Draft Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Draft Palace" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Draft Node");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("Draft saved")).toBeVisible();

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Other Palace");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Other Palace" })).toBeVisible();

  await page.getByRole("button", { name: "Draft Palace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Draft Palace" })).toBeVisible();
  await expect(page.getByText("Draft restored")).toBeVisible();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const restored = Array.from(editor.getCurrentPageShapeIds()).some((id) => {
      const shape = editor.getShape(id);
      return shape?.type === "geo" && shape.meta?.mpTitle === "Draft Node";
    });
    if (!restored) throw new Error("draft node was not restored");
  });
});

test("route and walk workflow", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();

  await page.getByPlaceholder("Route name").fill("Route 1");
  await page.getByRole("button", { name: "Add route" }).click();

  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await expect(page.getByLabel("Locus 1 label")).toBeVisible();
  await expect(page.getByLabel("Locus 2 label")).toBeVisible();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.getByText("Step 2/2")).toBeVisible();
  await page.getByRole("button", { name: "Previous step" }).click();
  await expect(page.getByText("Step 1/2")).toBeVisible();
});

test("analytics panel shows local review and graph telemetry", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Analytics Node");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByPlaceholder("Route name").fill("Telemetry Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();

  await page.getByRole("button", { name: "Toggle walk mode" }).click();
  await page.getByRole("button", { name: "Good" }).click();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
        if (!store) throw new Error("missing dev store hook");
        const state = store.getState() as { analyticsEvents: Array<{ eventType: string }> };
        return {
          nodeCreated: state.analyticsEvents.some((event) => event.eventType === "node_created"),
          routeCreated: state.analyticsEvents.some((event) => event.eventType === "route_created"),
          recallRated: state.analyticsEvents.some((event) => event.eventType === "walk_recall_rated"),
        };
      }),
    )
    .toMatchObject({
      nodeCreated: true,
      routeCreated: true,
      recallRated: true,
    });

  await page.getByRole("button", { name: "Analytics" }).click();
  await expect(page.getByText(/local-first telemetry for encoding and retrieval/i)).toBeVisible();
  await expect(page.getByText("Recent events")).toBeVisible();
  await expect(page.getByText(/walk recall rated/i)).toBeVisible();
  await expect(page.getByText(/graph work: node create\/update, edge create\/update/i)).toBeVisible();
});

test("connect workflow opens and applies CAST", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);
  await queuePendingCast(page, 0, 1);

  await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
  await expect(page.getByLabel("Tier 1 edge verb")).toHaveValue("links");
  await page.getByRole("button", { name: "Tier 2 (CAST)" }).click();
  await expect(page.getByText("C bits: 00")).toBeVisible();
  await page.getByLabel("CAST character").selectOption({ index: 1 });
  await expect(page.getByText("C bits: 01")).toBeVisible();
  await page.getByRole("button", { name: "?" }).click();
  await expect(page.getByRole("heading", { name: "CAST quick reference" })).toBeVisible();
  await expect(page.getByText(/Tier 1: one or more verb labels\./)).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: /create edge/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown>; props?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrows = Array.from(editor.getCurrentPageShapeIds())
      .map((id) => editor.getShape(id))
      .filter((shape) => shape?.type === "arrow");
    if (!arrows.length) throw new Error("no arrow created");
    const created = arrows.find((shape) => shape?.meta?.castAb === "Mermaid");
    if (!created) throw new Error("expected edge with selected C profile not found");
    if (created.props?.arrowheadStart !== "arrow" || created.props?.arrowheadEnd !== "arrow") {
      throw new Error("expected bidirectional arrowheads for C=01 Mermaid");
    }
  });

  const edgeProgress = page.locator("li", { hasText: "Connected nodes with CAST edges" }).first();
  await expect(edgeProgress).toContainText("✓");
});

test("connect workflow supports Tier 1 verb edge", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);
  await queuePendingCast(page, 0, 1);

  await expect(page.getByRole("heading", { name: "CAST edge" })).toBeVisible();
  await page.getByRole("button", { name: "triggers", exact: true }).click();
  await page.getByRole("button", { name: "depends on", exact: true }).click();
  await expect(page.getByLabel("Tier 1 edge verb")).toHaveValue("triggers; depends on");
  await expect(page.getByText("triggers · depends on")).toBeVisible();
  await page.getByLabel("Tier 1 direction").selectOption("two-way");
  await page.getByRole("button", { name: /create edge/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; props?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrows = Array.from(editor.getCurrentPageShapeIds())
      .map((id) => editor.getShape(id))
      .filter((shape) => shape?.type === "arrow");
    if (!arrows.length) throw new Error("no arrow created");
    const edge = arrows[arrows.length - 1];
    const richText = JSON.stringify(edge?.props?.richText ?? "");
    if (!richText.includes("triggers") || !richText.includes("depends on")) {
      throw new Error("tier1 multi-verb label was not written to the arrow");
    }
    if (edge?.props?.arrowheadStart !== "arrow" || edge?.props?.arrowheadEnd !== "arrow") {
      throw new Error("tier1 two-way should render bidirectional arrowheads");
    }
  });
});

test("reverse-direction edges curve away from each other", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);

  await queuePendingCast(page, 0, 1);
  await page.getByLabel("Tier 1 edge verb").fill("feeds");
  await page.getByRole("button", { name: /create edge/i }).click();

  await queuePendingCast(page, 1, 0);
  await page.getByLabel("Tier 1 edge verb").fill("depends on");
  await page.getByRole("button", { name: /create edge/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown>; props?: Record<string, unknown> } | undefined;
      } | null;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrows = Array.from(editor.getCurrentPageShapeIds())
      .map((id) => editor.getShape(id))
      .filter((shape) => shape?.type === "arrow");
    if (arrows.length < 2) throw new Error("expected two arrows");

    const [edgeA, edgeB] = arrows.slice(-2);
    const sourceA = edgeA?.meta?.mpSourceNodeId as string | undefined;
    const targetA = edgeA?.meta?.mpTargetNodeId as string | undefined;
    const sourceB = edgeB?.meta?.mpSourceNodeId as string | undefined;
    const targetB = edgeB?.meta?.mpTargetNodeId as string | undefined;
    if (!sourceA || !targetA || !sourceB || !targetB) throw new Error("edge metadata missing");
    if (sourceA !== targetB || targetA !== sourceB) {
      throw new Error("latest arrows are not opposite directions of the same pair");
    }

    const bendA = Number(edgeA?.props?.bend ?? 0);
    const bendB = Number(edgeB?.props?.bend ?? 0);
    if (bendA === 0 || bendB === 0) throw new Error("reverse-direction edges should both be curved");
    if (bendA !== -bendB) throw new Error(`expected opposite bends, got ${bendA} and ${bendB}`);
  });
});

test("selected edge metadata appears in inspector", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);

  await queuePendingCast(page, 0, 1);
  await page.getByLabel("Tier 1 edge verb").fill("feeds");
  await page.getByRole("button", { name: /create edge/i }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string } | undefined;
        setSelectedShapes: (ids: string[]) => void;
      } | null;
      setSelectedShapeId: (id: string | null) => void;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrowId = Array.from(editor.getCurrentPageShapeIds()).find((id) => editor.getShape(id)?.type === "arrow");
    if (!arrowId) throw new Error("no arrow found");
    editor.setSelectedShapes([arrowId]);
    state.setSelectedShapeId(arrowId);
  });

  await expect(page.locator("#mp-edge-label")).toHaveValue("feeds");
  await expect(page.locator("#mp-edge-source")).not.toBeEmpty();
  await expect(page.locator("#mp-edge-target")).not.toBeEmpty();
  await expect(page.locator("#mp-edge-c")).toContainText("Giant");
  await expect(page.locator("#mp-edge-a")).toContainText("Spreading");
  await expect(page.locator("#mp-edge-s")).toContainText("Cloud");
  await expect(page.locator("#mp-edge-t")).toContainText("Blue ocean");
});

test("edge inspector falls back to stored graph data when arrow meta is incomplete", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await doubleClickCanvasAt(page, 180, 140);

  await queuePendingCast(page, 0, 1);
  await page.getByLabel("Tier 1 edge verb").fill("feeds");
  await page.getByRole("button", { name: /create edge/i }).click();
  await page.getByRole("button", { name: /^Save$/ }).click();

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown> } | undefined;
        updateShape: (shape: { id: string; type: string; meta: Record<string, unknown> }) => void;
        setSelectedShapes: (ids: string[]) => void;
      } | null;
      setSelectedShapeId: (id: string | null) => void;
    };
    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const arrowId = Array.from(editor.getCurrentPageShapeIds()).find((id) => editor.getShape(id)?.type === "arrow");
    if (!arrowId) throw new Error("no arrow found");
    const arrow = editor.getShape(arrowId);
    if (!arrow?.meta?.mpObjectId) throw new Error("expected arrow object id");

    editor.updateShape({
      id: arrowId,
      type: "arrow",
      meta: {
        mpPalaceId: arrow.meta.mpPalaceId as string,
        mpObjectId: arrow.meta.mpObjectId as string,
      },
    });
    editor.setSelectedShapes([arrowId]);
    state.setSelectedShapeId(arrowId);
  });

  await expect(page.locator("#mp-edge-label")).toHaveValue("feeds");
  await expect(page.locator("#mp-edge-source")).not.toBeEmpty();
  await expect(page.locator("#mp-edge-target")).not.toBeEmpty();
  await expect(page.locator("#mp-edge-c")).toContainText("Giant");
  await expect(page.locator("#mp-edge-a")).toContainText("Spreading");
  await expect(page.locator("#mp-edge-s")).toContainText("Cloud");
  await expect(page.locator("#mp-edge-t")).toContainText("Blue ocean");
});

test("portal node opens a linked palace and route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Portal Source");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Portal Source" })).toBeVisible();

  await page.getByRole("textbox", { name: "Name", exact: true }).fill("Portal Target");
  await page.getByRole("textbox", { name: "Atlas path", exact: true }).fill("Georgia/Tbilisi");
  await page.getByRole("button", { name: "Create palace" }).click();
  await expect(page.getByRole("heading", { name: "Portal Target" })).toBeVisible();

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Arrival");
  await page.getByRole("button", { name: "Apply" }).click();
  await page.getByPlaceholder("Route name").fill("Entry Route");
  await page.getByRole("button", { name: "Add route" }).click();
  await page.getByRole("button", { name: /add selected node to route/i }).click();
  await page.getByRole("button", { name: /^Save$/ }).click();

  await page.getByRole("button", { name: "Portal Source", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Portal Source" })).toBeVisible();

  await page.getByRole("button", { name: /^Portal$/ }).click();
  await expect(page.locator("#mp-node-kind")).toHaveValue("portal");
  await page.locator("#mp-title").fill("Jump to target");
  await page.getByLabel("Target palace").selectOption({ label: "Georgia/Tbilisi / Portal Target" });
  await expect(page.getByLabel("Target route")).toContainText("Entry Route");
  await page.getByLabel("Target route").selectOption({ label: "Entry Route" });
  await page.getByRole("button", { name: "Apply" }).click();
  await page.getByRole("button", { name: "Open linked palace" }).click();

  await expect(page.getByRole("heading", { name: "Portal Target" })).toBeVisible();
  await expect(page.getByText("Step 1/1")).toBeVisible();
});

test("theSystem pipeline materializes into graph workflow state", async ({ page }) => {
  await bootstrapTutorialPalace(page);

  await page.getByRole("button", { name: /^Node$/ }).click();
  await page.locator("#mp-title").fill("Closures");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByRole("button", { name: "theSystem" }).click();
  await expect(page.getByText("graph-native thinking workflows")).toBeVisible();
  await page.getByRole("button", { name: "Comprehension Protocol" }).click();

  await expect(page.locator("#system-session-focus")).toHaveValue("Closures");
  await page.locator("#system-session-title").fill("Understanding closures");
  await page.locator("#system-session-outcome").fill("Explain closures from scratch and debug them in code.");
  await page.getByLabel("Locate notes").fill("JavaScript scope, lexical environment, and function factories.");
  await page.getByLabel("Represent notes").fill("Plain language, code example, and scope chain diagram.");
  await page.getByRole("button", { name: /materialize to graph/i }).click();

  await expect(page.getByText(/graph run with 7 nodes/i)).toBeVisible();
  await expect(page.getByLabel("Active route")).toContainText("Comprehension run: Understanding closures");

  await page.evaluate(() => {
    const store = (window as { __mp_store?: { getState: () => unknown } }).__mp_store;
    if (!store) throw new Error("missing dev store hook");
    const state = store.getState() as {
      routes: Array<{ id: string; name: string }>;
      loci: Array<{ routeId: string }>;
      editorRef: {
        getCurrentPageShapeIds: () => Iterable<string>;
        getShape: (id: string) => { type?: string; meta?: Record<string, unknown>; props?: Record<string, unknown> } | undefined;
      } | null;
    };

    const route = state.routes.find((candidate) => candidate.name === "Comprehension run: Understanding closures");
    if (!route) throw new Error("comprehension route missing");
    const routeLoci = state.loci.filter((locus) => locus.routeId === route.id);
    if (routeLoci.length !== 6) throw new Error(`expected 6 loci for comprehension run, got ${routeLoci.length}`);

    const editor = state.editorRef;
    if (!editor) throw new Error("editor not ready");
    const shapes = Array.from(editor.getCurrentPageShapeIds()).map((id) => editor.getShape(id));
    const overview = shapes.find((shape) => shape?.type === "geo" && shape?.meta?.mpTitle === "Comprehension: Understanding closures");
    if (!overview) throw new Error("overview node missing");
    const focusEdge = shapes.find(
      (shape) => shape?.type === "arrow" && JSON.stringify(shape?.props?.richText ?? "").includes("focuses on"),
    );
    if (!focusEdge) throw new Error("selected-node attachment edge missing");
  });
});

