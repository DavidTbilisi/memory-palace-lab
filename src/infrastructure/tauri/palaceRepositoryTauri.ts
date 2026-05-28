import { invoke } from "@tauri-apps/api/core";
import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { AnalyticsEvent, Palace, PalaceSnapshot } from "../../domain/entities/types";

/** Raw JSON matches Rust serde camelCase + `type` for canvas rows. */
type InvokePalaceSnapshot = {
  palace: Palace;
  canvasObjects: Array<{
    id: string;
    palaceId: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    payloadJson: string;
  }>;
  nodes: Array<{
    id: string;
    objectId: string;
    title: string;
    alias?: string;
    content: string;
    nodeKind?: string;
    nodeMetaJson?: string;
  }>;
  edges: Array<{
    id: string;
    objectId: string;
    sourceNodeId: string;
    targetNodeId: string;
    alias?: string;
    castAb: string;
    castCd: string;
    castEf: string;
    castGh: string;
  }>;
  routes: Array<{
    id: string;
    palaceId: string;
    name: string;
  }>;
  loci: Array<{
    id: string;
    routeId: string;
    nodeId: string;
    orderIndex: number;
    label?: string;
    interval?: number;
    easeFactor?: number;
    nextReviewAt?: string;
    repetitions?: number;
    lastReviewedAt?: string | null;
  }>;
};

type InvokeAnalyticsEvent = AnalyticsEvent;

function fromInvoke(raw: InvokePalaceSnapshot): PalaceSnapshot {
  return {
    palace: raw.palace,
    canvasObjects: raw.canvasObjects.map((c) => ({
      id: c.id,
      palaceId: c.palaceId,
      type: c.type as PalaceSnapshot["canvasObjects"][number]["type"],
      x: c.x,
      y: c.y,
      width: c.width,
      height: c.height,
      zIndex: c.zIndex,
      payloadJson: c.payloadJson,
    })),
    nodes: raw.nodes.map((n) => {
      let portal: PalaceSnapshot["nodes"][number]["portal"] = null;
      let imageUrl: string | null = null;
      if (n.nodeMetaJson) {
        try {
          const parsed = JSON.parse(n.nodeMetaJson) as Record<string, unknown>;
          if ("portal" in parsed) {
            portal = (parsed.portal ?? null) as PalaceSnapshot["nodes"][number]["portal"];
            imageUrl = typeof parsed.imageUrl === "string" ? parsed.imageUrl : null;
          } else {
            portal = parsed as PalaceSnapshot["nodes"][number]["portal"];
          }
        } catch {
          // ignore malformed json
        }
      }
      return {
        id: n.id,
        objectId: n.objectId,
        title: n.title,
        alias: n.alias ?? "",
        content: n.content,
        kind: n.nodeKind === "portal" ? "portal" : "memory",
        portal,
        imageUrl,
      };
    }),
    edges: raw.edges.map((e) => ({
      id: e.id,
      objectId: e.objectId,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
      alias: e.alias ?? "",
      castAb: e.castAb,
      castCd: e.castCd,
      castEf: e.castEf,
      castGh: e.castGh,
    })),
    routes: raw.routes.map((r) => ({
      id: r.id,
      palaceId: r.palaceId,
      name: r.name,
    })),
    loci: raw.loci.map((l) => ({
      id: l.id,
      routeId: l.routeId,
      nodeId: l.nodeId,
      orderIndex: l.orderIndex,
      label: l.label ?? "",
      interval: l.interval,
      easeFactor: l.easeFactor,
      nextReviewAt: l.nextReviewAt,
      repetitions: l.repetitions,
      lastReviewedAt: l.lastReviewedAt ?? null,
    })),
  };
}

function toInvoke(s: PalaceSnapshot): InvokePalaceSnapshot {
  return {
    palace: s.palace,
    canvasObjects: s.canvasObjects.map((c) => ({
      id: c.id,
      palaceId: c.palaceId,
      type: c.type,
      x: c.x,
      y: c.y,
      width: c.width,
      height: c.height,
      zIndex: c.zIndex,
      payloadJson: c.payloadJson,
    })),
    nodes: s.nodes.map((n) => ({
      id: n.id,
      objectId: n.objectId,
      title: n.title,
      alias: n.alias ?? "",
      content: n.content,
      nodeKind: n.kind,
      nodeMetaJson: JSON.stringify({ portal: n.portal ?? null, imageUrl: n.imageUrl ?? null }),
    })),
    edges: s.edges.map((e) => ({
      id: e.id,
      objectId: e.objectId,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
      alias: e.alias ?? "",
      castAb: e.castAb,
      castCd: e.castCd,
      castEf: e.castEf,
      castGh: e.castGh,
    })),
    routes: s.routes.map((r) => ({
      id: r.id,
      palaceId: r.palaceId,
      name: r.name,
    })),
    loci: s.loci.map((l) => ({
      id: l.id,
      routeId: l.routeId,
      nodeId: l.nodeId,
      orderIndex: l.orderIndex,
      label: l.label,
      interval: l.interval,
      easeFactor: l.easeFactor,
      nextReviewAt: l.nextReviewAt,
      repetitions: l.repetitions,
      lastReviewedAt: l.lastReviewedAt ?? null,
    })),
  };
}

export function createPalaceRepositoryTauri(): PalaceRepository {
  return {
    async listPalaces() {
      return invoke<Palace[]>("palace_list");
    },
    async listTrashedPalaces() {
      return invoke<Palace[]>("palace_list_trashed");
    },
    async createPalace(name: string, atlasPath?: string | null) {
      return invoke<Palace>("palace_create", { name, atlasPath: atlasPath?.trim() || null });
    },
    async loadPalace(palaceId: string) {
      const raw = await invoke<InvokePalaceSnapshot | null>("palace_load", { palaceId });
      return raw ? fromInvoke(raw) : null;
    },
    async savePalace(snapshot: PalaceSnapshot) {
      await invoke("palace_save", { snapshot: toInvoke(snapshot) });
    },
    async softDeletePalace(palaceId: string) {
      await invoke("palace_soft_delete", { palaceId });
    },
    async restorePalace(palaceId: string) {
      await invoke("palace_restore", { palaceId });
    },
    async purgePalace(palaceId: string) {
      await invoke("palace_purge", { palaceId });
    },
    async listAnalyticsEvents(limit) {
      return invoke<InvokeAnalyticsEvent[]>("analytics_list", { limit });
    },
    async appendAnalyticsEvents(events) {
      await invoke("analytics_append", { events });
    },
    async exportJson(snapshot: PalaceSnapshot) {
      return invoke<string>("palace_export_json", { snapshot: toInvoke(snapshot) });
    },
    async importJson(json: string) {
      const raw = await invoke<InvokePalaceSnapshot>("palace_import_json", { json });
      return fromInvoke(raw);
    },
  };
}
