import { beforeEach, describe, expect, it } from "vitest";
import { createInMemoryPalaceRepository } from "./inMemoryPalaceRepository";
import { createAnalyticsEvent } from "../../domain/services/analyticsService";

describe("createInMemoryPalaceRepository", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates, loads, and saves a palace snapshot", async () => {
    const r = createInMemoryPalaceRepository();
    const p = await r.createPalace("Hall", "Georgia/Tbilisi");
    const loaded = await r.loadPalace(p.id);
    expect(loaded?.palace.name).toBe("Hall");
    expect(loaded?.palace.atlasPath).toBe("Georgia/Tbilisi");
    if (!loaded) throw new Error("missing");
    const updated = {
      ...loaded,
      palace: { ...loaded.palace, name: "Renamed", atlasPath: "Georgia/Tbilisi/Vake" },
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
          kind: "memory" as const,
          portal: null,
        },
      ],
    };
    await r.savePalace(updated);
    const again = await r.loadPalace(p.id);
    expect(again?.palace.name).toBe("Renamed");
    expect(again?.palace.atlasPath).toBe("Georgia/Tbilisi/Vake");
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

  it("persists analytics events in browser storage fallback", async () => {
    const first = createInMemoryPalaceRepository();
    await first.appendAnalyticsEvents([
      createAnalyticsEvent({
        eventType: "palace_opened",
        eventGroup: "palace",
        sessionId: "session-1",
        palaceId: "palace-1",
        createdAt: "2026-04-26T09:00:00.000Z",
      }),
    ]);

    const second = createInMemoryPalaceRepository();
    const events = await second.listAnalyticsEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.sessionId).toBe("session-1");
    expect(events[0]?.eventType).toBe("palace_opened");
  });

  it("persists palace snapshots across repository instances", async () => {
    const first = createInMemoryPalaceRepository();
    const palace = await first.createPalace("Persistent Palace", "Earth/Library");
    const snapshot = await first.loadPalace(palace.id);
    if (!snapshot) throw new Error("missing snapshot");

    await first.savePalace({
      ...snapshot,
      palace: { ...snapshot.palace, name: "Persistent Palace v2" },
      nodes: [
        {
          id: "n1",
          objectId: "o1",
          title: "Stored node",
          content: "Survives reload",
          kind: "memory",
          portal: null,
        },
      ],
    });

    const second = createInMemoryPalaceRepository();
    const palaces = await second.listPalaces();
    const loaded = await second.loadPalace(palace.id);

    expect(palaces).toHaveLength(1);
    expect(palaces[0]?.name).toBe("Persistent Palace v2");
    expect(loaded?.nodes[0]?.title).toBe("Stored node");
  });

  it("supports soft delete, trash listing, and restore", async () => {
    const r = createInMemoryPalaceRepository();
    const p = await r.createPalace("Trash Me");

    await r.softDeletePalace(p.id);

    const active = await r.listPalaces();
    const trashed = await r.listTrashedPalaces();
    const loaded = await r.loadPalace(p.id);

    expect(active).toHaveLength(0);
    expect(trashed).toHaveLength(1);
    expect(trashed[0]?.deletedAt).toBeTruthy();
    expect(trashed[0]?.purgeAt).toBeTruthy();
    expect(loaded).toBeNull();

    await r.restorePalace(p.id);

    const restored = await r.listPalaces();
    const trashedAfterRestore = await r.listTrashedPalaces();
    expect(restored).toHaveLength(1);
    expect(trashedAfterRestore).toHaveLength(0);
  });

  it("purges trashed palaces permanently", async () => {
    const r = createInMemoryPalaceRepository();
    const p = await r.createPalace("Purge Me");
    await r.softDeletePalace(p.id);
    await r.purgePalace(p.id);

    expect(await r.listPalaces()).toHaveLength(0);
    expect(await r.listTrashedPalaces()).toHaveLength(0);
  });
});
