import type { Editor } from "@tldraw/editor";
import type { MemoryPalaceMeta } from "../../../src/canvas/memoryMeta";
import { parseDsl } from "../../../src/domain/services/palaceDsl/parser";
import { reconcileRoutes } from "../../../src/domain/services/palaceDsl/routeSync";
import { applyDslToCanvas } from "../../../src/domain/services/palaceDsl/sync";
import type { DslDiagnostic } from "../../../src/domain/services/palaceDsl/types";
import { createPalace } from "../palaceDb";
import { withPalaceMutation } from "../palaceWriter";
import type { ServerContext } from "./shared";
import type { SnapshotEditor } from "../snapshotEditor";

function diagnosticView(d: DslDiagnostic) {
  return {
    code: d.numericCode,
    severity: d.severity,
    line: d.line,
    message: d.message,
  };
}

/** Mirrors the titleToNodeId construction in palaceStore.ts applyDslSnapshot. */
function titleToNodeIdFromShapes(editor: SnapshotEditor, palaceId: string): Map<string, string> {
  const titleToNodeId = new Map<string, string>();
  for (const shapeId of editor.getCurrentPageShapeIds()) {
    const shape = editor.getShape(shapeId);
    if (!shape || shape.type !== "geo") continue;
    const meta = (shape.meta ?? {}) as MemoryPalaceMeta;
    if (meta.mpPalaceId !== palaceId) continue;
    if (meta.mpTitle && meta.mpNodeId) titleToNodeId.set(meta.mpTitle, meta.mpNodeId);
  }
  return titleToNodeId;
}

export async function palaceApplyDsl(
  ctx: ServerContext,
  args: { palace: string; dsl: string; force?: boolean },
) {
  const parsed = parseDsl(args.dsl);
  const errors = parsed.diagnostics.filter((d) => d.severity === "error");
  if (errors.length > 0 && !args.force) {
    return {
      applied: false as const,
      reason: "DSL has errors. Fix them or pass force:true to apply anyway.",
      diagnostics: parsed.diagnostics.map(diagnosticView),
    };
  }

  const { result } = await withPalaceMutation(ctx.db, ctx.sentinelDir, args.palace, "palace_apply_dsl", (m) => {
    const canvasResult = applyDslToCanvas(m.editor as unknown as Editor, m.palace.id, parsed.snapshot);
    const reconciled = reconcileRoutes({
      palaceId: m.palace.id,
      currentRoutes: m.routes,
      currentLoci: m.loci,
      intent: parsed.snapshot.routes,
      titleToNodeId: titleToNodeIdFromShapes(m.editor, m.palace.id),
    });
    m.routes.splice(0, m.routes.length, ...reconciled.routes);
    m.loci.splice(0, m.loci.length, ...reconciled.loci);
    m.recordEvent("palace_saved", "palace", {
      payload: {
        action: "apply_dsl",
        added: { ...canvasResult.added, ...reconciled.added },
        deleted: { ...canvasResult.deleted, ...reconciled.deleted },
      },
    });
    return {
      added: { ...canvasResult.added, ...reconciled.added },
      updated: canvasResult.updated,
      deleted: { ...canvasResult.deleted, ...reconciled.deleted },
      errors: [...canvasResult.errors, ...reconciled.errors],
    };
  });

  return {
    applied: true as const,
    ...result,
    diagnostics: parsed.diagnostics.map(diagnosticView),
  };
}

export async function palaceImportDsl(ctx: ServerContext, args: { dsl: string; atlasPath?: string }) {
  const parsed = parseDsl(args.dsl);
  const errors = parsed.diagnostics.filter((d) => d.severity === "error");
  if (errors.length > 0) {
    return {
      created: false as const,
      reason: "DSL has errors; fix them first.",
      diagnostics: parsed.diagnostics.map(diagnosticView),
    };
  }
  const name = parsed.snapshot.palaceName?.trim();
  if (!name) {
    return {
      created: false as const,
      reason: "DSL has no @<name> palace header, so there is no palace name to create.",
      diagnostics: parsed.diagnostics.map(diagnosticView),
    };
  }

  const atlasPath = args.atlasPath ?? parsed.snapshot.atlasPath ?? null;
  const palace = createPalace(ctx.db, name, atlasPath);
  const applied = await palaceApplyDsl(ctx, { palace: palace.id, dsl: args.dsl });
  return {
    created: true as const,
    palaceId: palace.id,
    name,
    atlasPath: atlasPath ?? undefined,
    ...applied,
  };
}
