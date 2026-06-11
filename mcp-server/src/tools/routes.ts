import { randomUUID } from "node:crypto";
import {
  deleteLocus,
  moveLocus,
} from "../../../src/domain/services/routeEditing";
import { defaultLocusSchedule } from "../../../src/domain/services/spacedRepetition";
import { orderedLoci } from "../../../src/domain/services/walkService";
import { loadPalace, resolvePalace } from "../palaceDb";
import { withPalaceMutation } from "../palaceWriter";
import type { ServerContext } from "./shared";
import { resolveNodeRef, resolveRouteRef } from "./shared";

export function routeList(ctx: ServerContext, args: { palace: string }) {
  const palace = resolvePalace(ctx.db, args.palace);
  const snapshot = loadPalace(ctx.db, palace.id);
  if (!snapshot) throw new Error(`Palace "${args.palace}" not found.`);
  const titleOf = (id: string) => snapshot.nodes.find((n) => n.id === id)?.title ?? id;
  return {
    routes: snapshot.routes.map((r) => ({
      id: r.id,
      name: r.name,
      loci: orderedLoci(snapshot.loci.filter((l) => l.routeId === r.id)).map((l) => ({
        locusId: l.id,
        nodeId: l.nodeId,
        node: titleOf(l.nodeId),
        orderIndex: l.orderIndex,
        label: l.label || undefined,
        schedule: {
          interval: l.interval,
          easeFactor: l.easeFactor,
          repetitions: l.repetitions,
          nextReviewAt: l.nextReviewAt,
          lastReviewedAt: l.lastReviewedAt ?? undefined,
        },
      })),
    })),
  };
}

export async function routeCreate(
  ctx: ServerContext,
  args: { palace: string; name: string; nodes?: string[] },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "route_create", (m) => {
    if (m.routes.some((r) => r.name.toLowerCase() === args.name.toLowerCase())) {
      throw new Error(`A route named "${args.name}" already exists in this palace.`);
    }
    const route = { id: randomUUID(), palaceId: m.palace.id, name: args.name };
    m.routes.push(route);
    m.recordEvent("route_created", "graph", { routeId: route.id, payload: { name: route.name } });

    const lociAdded: string[] = [];
    for (const [index, nodeRef] of (args.nodes ?? []).entries()) {
      const node = resolveNodeRef(m.snapshot.nodes, nodeRef);
      const locus = {
        id: randomUUID(),
        routeId: route.id,
        nodeId: node.id,
        orderIndex: index,
        label: "",
        ...defaultLocusSchedule(),
      };
      m.loci.push(locus);
      lociAdded.push(node.title);
      m.recordEvent("locus_added", "graph", { routeId: route.id, nodeId: node.id });
    }
    return { routeId: route.id, lociAdded };
  });
  return { id: result.routeId, name: args.name, loci: result.lociAdded };
}

export async function routeUpdate(
  ctx: ServerContext,
  args: { palace: string; route: string; name: string },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "route_update", (m) => {
    const route = resolveRouteRef(m.routes, args.route);
    route.name = args.name;
    m.recordEvent("locus_updated", "graph", { routeId: route.id, payload: { action: "route_renamed", name: args.name } });
    return { routeId: route.id };
  });
  return { id: result.routeId, name: args.name, updated: true };
}

export async function routeDelete(ctx: ServerContext, args: { palace: string; route: string }) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "route_delete", (m) => {
    const route = resolveRouteRef(m.routes, args.route);
    m.routes.splice(0, m.routes.length, ...m.routes.filter((r) => r.id !== route.id));
    m.loci.splice(0, m.loci.length, ...m.loci.filter((l) => l.routeId !== route.id));
    // routeId goes in the payload: the FK column would reference a deleted row.
    m.recordEvent("locus_updated", "graph", {
      payload: { action: "route_deleted", routeId: route.id, name: route.name },
    });
    return { routeId: route.id, name: route.name };
  });
  return { id: result.routeId, name: result.name, deleted: true };
}

export async function locusAdd(
  ctx: ServerContext,
  args: { palace: string; route: string; node: string; label?: string },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "locus_add", (m) => {
    const route = resolveRouteRef(m.routes, args.route);
    const node = resolveNodeRef(m.snapshot.nodes, args.node);
    const maxIndex = m.loci
      .filter((l) => l.routeId === route.id)
      .reduce((max, l) => Math.max(max, l.orderIndex), -1);
    const locus = {
      id: randomUUID(),
      routeId: route.id,
      nodeId: node.id,
      orderIndex: maxIndex + 1,
      label: args.label ?? "",
      ...defaultLocusSchedule(),
    };
    m.loci.push(locus);
    m.recordEvent("locus_added", "graph", { routeId: route.id, nodeId: node.id });
    return { locusId: locus.id, node: node.title, orderIndex: locus.orderIndex };
  });
  return { id: result.locusId, node: result.node, orderIndex: result.orderIndex, added: true };
}

export async function locusRemove(ctx: ServerContext, args: { palace: string; locus: string }) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "locus_remove", (m) => {
    const locus = m.loci.find((l) => l.id === args.locus);
    if (!locus) throw new Error(`No locus found with id "${args.locus}". Use route_list to find ids.`);
    const next = deleteLocus(m.loci, locus.id);
    m.loci.splice(0, m.loci.length, ...next);
    m.recordEvent("locus_updated", "graph", {
      routeId: locus.routeId,
      nodeId: locus.nodeId,
      payload: { action: "removed" },
    });
    return { locusId: locus.id };
  });
  return { id: result.locusId, removed: true };
}

export async function locusReorder(
  ctx: ServerContext,
  args: { palace: string; locus: string; direction: "up" | "down" },
) {
  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "locus_reorder", (m) => {
    const locus = m.loci.find((l) => l.id === args.locus);
    if (!locus) throw new Error(`No locus found with id "${args.locus}". Use route_list to find ids.`);
    const next = moveLocus(m.loci, locus.id, args.direction);
    m.loci.splice(0, m.loci.length, ...next);
    m.recordEvent("locus_updated", "graph", {
      routeId: locus.routeId,
      nodeId: locus.nodeId,
      payload: { action: "reordered", direction: args.direction },
    });
    return { locusId: locus.id };
  });
  return { id: result.locusId, reordered: true };
}
