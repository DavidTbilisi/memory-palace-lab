import { invoke } from "@tauri-apps/api/core";
import type { PalaceRepository } from "../../domain/repositories/palaceRepository";
import type { Palace, PalaceSnapshot } from "../../domain/entities/types";

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
    content: string;
  }>;
  edges: Array<{
    id: string;
    objectId: string;
    sourceNodeId: string;
    targetNodeId: string;
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
  }>;
};

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
    nodes: raw.nodes.map((n) => ({
      id: n.id,
      objectId: n.objectId,
      title: n.title,
      content: n.content,
    })),
    edges: raw.edges.map((e) => ({
      id: e.id,
      objectId: e.objectId,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
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
      content: n.content,
    })),
    edges: s.edges.map((e) => ({
      id: e.id,
      objectId: e.objectId,
      sourceNodeId: e.sourceNodeId,
      targetNodeId: e.targetNodeId,
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
    })),
  };
}

export function createPalaceRepositoryTauri(): PalaceRepository {
  return {
    async listPalaces() {
      return invoke<Palace[]>("palace_list");
    },
    async createPalace(name: string) {
      return invoke<Palace>("palace_create", { name });
    },
    async loadPalace(palaceId: string) {
      const raw = await invoke<InvokePalaceSnapshot | null>("palace_load", { palaceId });
      return raw ? fromInvoke(raw) : null;
    },
    async savePalace(snapshot: PalaceSnapshot) {
      await invoke("palace_save", { snapshot: toInvoke(snapshot) });
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
