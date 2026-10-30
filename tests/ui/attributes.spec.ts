/**
 * Attribute channels: put a node's attributes on UMTF channels, see a collision reported and
 * cleared, and dissolve a multi-valued attribute into separate linked nodes.
 */
import { expect, test, type Page } from "@playwright/test";
import { addNode, editSelectedNode, openNodeTab } from "./nodeHelpers";
import { openTutorialPalace } from "./routeHelpers";

type Saved = { attributes: unknown; nodeTitles: string[]; edgesFromMutex: string[] };

function saved(page: Page): Promise<Saved> {
  return page.evaluate(() => {
    type State = {
      nodes: { id: string; title: string; attributes?: unknown }[];
      edges: { sourceNodeId: string; targetNodeId: string }[];
    };
    const state = (window as { __mp_store?: { getState: () => State } }).__mp_store!.getState();
    const mutex = state.nodes.find((node) => node.title === "Mutex");
    const titleOf = new Map(state.nodes.map((node) => [node.id, node.title]));
    return {
      attributes: mutex?.attributes ?? null,
      nodeTitles: state.nodes.map((node) => node.title),
      edgesFromMutex: state.edges
        .filter((edge) => edge.sourceNodeId === mutex?.id)
        .map((edge) => titleOf.get(edge.targetNodeId) ?? ""),
    };
  });
}

test("attributes go on UMTF channels, a collision is reported, and a dissolved attribute splits into nodes", async ({ page }) => {
  test.setTimeout(90_000);
  await openTutorialPalace(page);
  await addNode(page);
  await editSelectedNode(page, { title: "Mutex" });
  await openNodeTab(page);

  const section = page.getByRole("region", { name: "Attributes" });
  await section.getByRole("button", { name: "Add attribute" }).click();
  await expect(section.getByLabel("Attribute 1 channel")).toHaveValue("spatial");
  await section.getByLabel("Attribute 1 name").fill("where");
  await section.getByLabel("Attribute 1 values").fill("north tower");

  // A second attribute starts on the next free channel; moving it onto Spatial is a collision.
  await section.getByRole("button", { name: "Add attribute" }).click();
  await expect(section.getByLabel("Attribute 2 channel")).toHaveValue("sensory");
  await section.getByLabel("Attribute 2 name").fill("room");
  await section.getByLabel("Attribute 2 values").fill("kitchen");
  await section.getByLabel("Attribute 2 channel").selectOption("spatial");
  await expect(section.getByTestId("attribute-warning")).toHaveText(/"where" and "room" are both on Spatial/);
  await section.getByLabel("Attribute 2 channel").selectOption("state");
  await expect(section.getByTestId("attribute-warning")).toHaveCount(0);

  // Several values ask for a route; dissolve offers to split them into separate nodes.
  await section.getByRole("button", { name: "Add attribute" }).click();
  await section.getByLabel("Attribute 3 name").fill("uses");
  await section.getByLabel("Attribute 3 channel").selectOption("relation");
  await section.getByLabel("Attribute 3 values").fill("locks | queues | pools");
  await section.getByLabel("Attribute 3 name").click();
  await expect(section.getByTestId("attribute-warning")).toHaveText(/has 3 values/);
  await section.getByLabel("Attribute 3 route").selectOption("dissolve");
  await expect(section.getByTestId("attribute-warning")).toHaveCount(0);
  await expect.poll(async () => (await saved(page)).attributes).toEqual([
    { name: "where", channel: "spatial", values: ["north tower"] },
    { name: "room", channel: "state", values: ["kitchen"] },
    { name: "uses", channel: "relation", values: ["locks", "queues", "pools"], route: "dissolve" },
  ]);

  await section.getByRole("button", { name: "Split into 3 separate nodes" }).click();
  await expect(section.getByLabel("Attribute 3 name")).toHaveCount(0);
  await expect.poll(async () => saved(page)).toEqual({
    attributes: [
      { name: "where", channel: "spatial", values: ["north tower"] },
      { name: "room", channel: "state", values: ["kitchen"] },
    ],
    nodeTitles: expect.arrayContaining(["Mutex", "locks", "queues", "pools"]),
    edgesFromMutex: ["locks", "queues", "pools"],
  });

  // One undo takes back the split, and only the split.
  await page.evaluate(() => {
    (window as { __mp_store?: { getState: () => { editorRef: { undo: () => void } } } }).__mp_store!.getState().editorRef.undo();
  });
  await expect
    .poll(() =>
      page.evaluate(() => {
        type Shape = { meta?: { mpNodeId?: string; mpTitle?: string; mpAttributes?: unknown[] } };
        type Editor = { getCurrentPageShapes: () => Shape[] };
        const editor = (window as { __mp_store?: { getState: () => { editorRef: Editor } } }).__mp_store!.getState().editorRef;
        const nodes = editor.getCurrentPageShapes().filter((shape) => shape.meta?.mpNodeId);
        return {
          titles: nodes.map((shape) => shape.meta!.mpTitle),
          attributes: nodes.find((shape) => shape.meta!.mpTitle === "Mutex")?.meta!.mpAttributes?.length,
        };
      }),
    )
    .toEqual({ titles: expect.not.arrayContaining(["locks"]), attributes: 3 });
});
