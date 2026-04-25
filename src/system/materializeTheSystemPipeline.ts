import type { Editor } from "@tldraw/editor";
import type { TLShapeId } from "@tldraw/tlschema";
import { toRichText } from "@tldraw/tlschema";
import { createGeoMemoryNode, createMemoryArrow } from "../canvas/createMemoryShapes";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import {
  CAST_HOW,
  CAST_WHAT,
  CAST_WHEN,
  CAST_WHO,
  type Locus,
  type MemoryRoute,
} from "../domain/entities/types";
import type { TheSystemPipelineTemplate } from "../content/theSystemPipelines";

type PipelineAnswers = {
  focus: string;
  outcome: string;
  notesByStepId: Record<string, string>;
};

type MaterializeTheSystemPipelineArgs = {
  editor: Editor;
  palaceId: string;
  selectedShapeId: string | null;
  template: TheSystemPipelineTemplate;
  sessionTitle: string;
  answers: PipelineAnswers;
};

type MaterializedPipelineResult = {
  overviewShapeId: string;
  overviewNodeId: string;
  route: MemoryRoute;
  loci: Locus[];
  createdNodeCount: number;
};

type CreatedNode = {
  shapeId: string;
  nodeId: string;
  title: string;
};

const GRID_COLUMNS = 3;
const STEP_COLUMN_GAP = 260;
const STEP_ROW_GAP = 170;
const OVERVIEW_OFFSET_X = 320;

function formatSection(label: string, value: string) {
  return `${label}:\n${value.trim() || "Pending"}`;
}

function createNamedNode(
  editor: Editor,
  palaceId: string,
  x: number,
  y: number,
  title: string,
  content: string,
): CreatedNode {
  const { shapeId, nodeId } = createGeoMemoryNode(editor, palaceId, { x, y });
  const shape = editor.getShape(shapeId as TLShapeId);
  const prev = (shape?.meta ?? {}) as MemoryPalaceMeta;
  editor.updateShape({
    id: shapeId as TLShapeId,
    type: "geo",
    meta: { ...prev, mpTitle: title, mpContent: content },
    props: { ...(shape?.props ?? {}), richText: toRichText(title) },
  });
  return { shapeId, nodeId, title };
}

function resolveAnchor(editor: Editor, selectedShapeId: string | null) {
  if (selectedShapeId) {
    const shape = editor.getShape(selectedShapeId as TLShapeId);
    const meta = (shape?.meta ?? {}) as MemoryPalaceMeta;
    const bounds = editor.getShapePageBounds(selectedShapeId as TLShapeId);
    if (shape?.type === "geo" && meta.mpNodeId && bounds) {
      return {
        x: bounds.x + bounds.w + 140,
        y: bounds.y + 10,
        targetShapeId: selectedShapeId,
        targetNodeId: meta.mpNodeId,
      };
    }
  }

  const viewport = editor.getViewportPageBounds();
  return {
    x: viewport.x + Math.max(180, viewport.w * 0.2),
    y: viewport.y + Math.max(140, viewport.h * 0.18),
    targetShapeId: null,
    targetNodeId: null,
  };
}

function buildOverviewContent(template: TheSystemPipelineTemplate, title: string, answers: PipelineAnswers) {
  return [
    `${template.title} session`,
    "",
    formatSection("Session", title),
    "",
    formatSection("Focus", answers.focus),
    "",
    formatSection("Desired outcome", answers.outcome),
    "",
    formatSection("Framework", template.summary),
    "",
    formatSection("When to use", template.recommendedFor),
  ].join("\n");
}

function buildStepContent(step: TheSystemPipelineTemplate["steps"][number], answers: PipelineAnswers) {
  return [
    `${step.code} - ${step.title}`,
    "",
    formatSection("Prompt", step.prompt),
    "",
    formatSection("Working notes", answers.notesByStepId[step.id] ?? ""),
    "",
    formatSection("Heuristic", step.hint),
  ].join("\n");
}

function castPreset(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("review") || normalized.includes("recalibrate")) {
    return { ab: CAST_WHO[1], cd: CAST_HOW[3], ef: CAST_WHAT[3], gh: CAST_WHEN[3], label };
  }
  if (normalized.includes("apply") || normalized.includes("act") || normalized.includes("execute")) {
    return { ab: CAST_WHO[2], cd: CAST_HOW[0], ef: CAST_WHAT[0], gh: CAST_WHEN[0], label };
  }
  return { ab: CAST_WHO[0], cd: CAST_HOW[2], ef: CAST_WHAT[2], gh: CAST_WHEN[1], label };
}

export function materializeTheSystemPipeline({
  editor,
  palaceId,
  selectedShapeId,
  template,
  sessionTitle,
  answers,
}: MaterializeTheSystemPipelineArgs): MaterializedPipelineResult {
  const anchor = resolveAnchor(editor, selectedShapeId);
  const effectiveSessionTitle = sessionTitle.trim() || answers.focus.trim() || template.shortTitle;

  const overview = createNamedNode(
    editor,
    palaceId,
    anchor.x,
    anchor.y,
    `${template.shortTitle}: ${effectiveSessionTitle}`,
    buildOverviewContent(template, effectiveSessionTitle, answers),
  );

  const stepNodes = template.steps.map((step, index) => {
    const row = Math.floor(index / GRID_COLUMNS);
    const column = index % GRID_COLUMNS;
    return createNamedNode(
      editor,
      palaceId,
      anchor.x + OVERVIEW_OFFSET_X + column * STEP_COLUMN_GAP,
      anchor.y + row * STEP_ROW_GAP,
      `${step.code}. ${step.title}`,
      buildStepContent(step, answers),
    );
  });

  if (anchor.targetShapeId && anchor.targetNodeId) {
    createMemoryArrow(editor, palaceId, overview.shapeId, anchor.targetShapeId, overview.nodeId, anchor.targetNodeId, {
      ...castPreset("focuses on"),
    });
  }

  if (stepNodes.length > 0) {
    createMemoryArrow(editor, palaceId, overview.shapeId, stepNodes[0].shapeId, overview.nodeId, stepNodes[0].nodeId, {
      ...castPreset("starts"),
    });
  }

  for (let index = 0; index < stepNodes.length - 1; index += 1) {
    const from = stepNodes[index];
    const to = stepNodes[index + 1];
    const label = template.steps[index]?.nextLabel ?? "next";
    createMemoryArrow(editor, palaceId, from.shapeId, to.shapeId, from.nodeId, to.nodeId, {
      ...castPreset(label),
    });
  }

  const route: MemoryRoute = {
    id: crypto.randomUUID(),
    palaceId,
    name: `${template.routeName}: ${effectiveSessionTitle}`,
  };

  const loci: Locus[] = stepNodes.map((node, index) => ({
    id: crypto.randomUUID(),
    routeId: route.id,
    nodeId: node.nodeId,
    orderIndex: index,
    label: node.title,
  }));

  return {
    overviewShapeId: overview.shapeId,
    overviewNodeId: overview.nodeId,
    route,
    loci,
    createdNodeCount: stepNodes.length + 1,
  };
}
