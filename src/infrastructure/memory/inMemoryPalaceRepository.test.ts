import { describe, expect, it } from "vitest";
import { createInMemoryPalaceRepository } from "./inMemoryPalaceRepository";

describe("createInMemoryPalaceRepository", () => {
  it("creates, loads, and saves a palace snapshot", async () => {
    const r = createInMemoryPalaceRepository();
    const p = await r.createPalace("Hall");
    const loaded = await r.loadPalace(p.id);
    expect(loaded?.palace.name).toBe("Hall");
    if (!loaded) throw new Error("missing");
    const updated = {
      ...loaded,
      palace: { ...loaded.palace, name: "Renamed" },
      loci: [
        {
          id: "l1",
          routeId: "r1",
          nodeId: "n1",
          orderIndex: 0,
          label: "Front Door",
        },
      ],
      nodes: [
        {
          id: "n1",
          objectId: "o1",
          title: "A",
          content: "",
        },
      ],
    };
    await r.savePalace(updated);
    const again = await r.loadPalace(p.id);
    expect(again?.palace.name).toBe("Renamed");
    expect(again?.nodes[0]?.title).toBe("A");
    expect(again?.loci[0]?.label).toBe("Front Door");
  });

  it("exports and imports JSON", async () => {
    const r = createInMemoryPalaceRepository();
    const p = await r.createPalace("X");
    const snap = await r.loadPalace(p.id);
    if (!snap) throw new Error("missing");
    const json = await r.exportJson(snap);
    const imported = await r.importJson(json);
    expect(imported.palace.id).toBe(p.id);
  });
});
