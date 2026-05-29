import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAssessHint } from "./useAssessHint";
import { usePalaceStore, type PalaceStore } from "../../store/palaceStore";
import { analyzeGraph, type GraphAnalysisInput } from "../../domain/services/cast/graphAnalysis";
import { detectMotifs, groupMotifs, type MotifKind } from "../../domain/services/cast/castMotifs";
import { extractMotifInstances } from "../../domain/services/cast/motifInstances";
import { palaceSignature } from "../../domain/services/cast/palaceSimilarity";
import {
  buildAARRecord,
  type AARRecord,
  type AARSignatureSnapshot,
} from "../../domain/services/cast/aarRecords";

vi.mock("../../store/palaceStore");
vi.mock("../../infrastructure/palaceRepositoryProvider", () => ({
  getPalaceRepository: () => ({ loadPalace: vi.fn() }),
}));

type StoreNode = { id: string; title: string };
type StoreEdge = { sourceNodeId: string; targetNodeId: string };

// A hub-spoke graph — reliably detected as a motif and produces a signature.
const HUB_NODES: StoreNode[] = [
  { id: "h", title: "CAP" },
  { id: "s1", title: "Availability" },
  { id: "s2", title: "Consistency" },
  { id: "s3", title: "Partition" },
];
const HUB_EDGES: StoreEdge[] = [
  { sourceNodeId: "h", targetNodeId: "s1" },
  { sourceNodeId: "h", targetNodeId: "s2" },
  { sourceNodeId: "h", targetNodeId: "s3" },
];

// A 3-node cascade with disjoint titles — different motif kind + no shared
// anchors, so it scores below the 0.7 Assess threshold against the hub graph.
const CASCADE_NODES: StoreNode[] = [
  { id: "x", title: "Ingest" },
  { id: "y", title: "Transform" },
  { id: "z", title: "Load" },
];
const CASCADE_EDGES: StoreEdge[] = [
  { sourceNodeId: "x", targetNodeId: "y" },
  { sourceNodeId: "y", targetNodeId: "z" },
];

/** Build an AAR signature snapshot from a graph, the way the app does at close time. */
function snapshotFor(palaceId: string, palaceName: string, nodes: StoreNode[], edges: StoreEdge[]): AARSignatureSnapshot {
  const input: GraphAnalysisInput = {
    nodes: nodes.map((n) => ({ id: n.id })),
    edges,
  };
  const analysis = analyzeGraph(input);
  const motifs = detectMotifs(input);
  const groups = groupMotifs(motifs);
  const titleById = new Map(nodes.map((n) => [n.id, n.title]));
  const sig = palaceSignature(palaceId, palaceName, analysis, groups);
  const motifCounts = (Object.keys(groups) as MotifKind[]).reduce(
    (acc, kind) => {
      acc[kind] = groups[kind].length;
      return acc;
    },
    {} as Record<MotifKind, number>,
  );
  return {
    nodeCount: sig.nodeCount,
    edgeCount: sig.edgeCount,
    motifKindsPresent: [...sig.motifKindsPresent],
    motifCounts,
    features: sig.features,
    motifInstances: extractMotifInstances(motifs, titleById),
  };
}

function aarFrom(
  palaceId: string,
  palaceName: string,
  nodes: StoreNode[],
  edges: StoreEdge[],
): AARRecord {
  return buildAARRecord({
    palaceId,
    palaceName,
    signature: snapshotFor(palaceId, palaceName, nodes, edges),
    fields: {
      intent: "ship it",
      outcome: "shipped",
      gap: "slow",
      adjustment: "cache",
      takeaway: "hub-spoke, not cascade",
    },
  });
}

const CURRENT = { id: "current", name: "OOP", createdAt: "2026-01-01" };

function mockStore(overrides: Partial<Record<keyof PalaceStore, unknown>> = {}) {
  const state: Record<string, unknown> = {
    currentPalace: CURRENT,
    palaces: [CURRENT],
    nodes: HUB_NODES,
    edges: HUB_EDGES,
    aarRecords: [],
    aarRecordsLoaded: true,
    loadAARRecords: vi.fn(),
    dismissedAssessByPalaceId: [],
    dismissAssessForPalace: vi.fn(),
    ...overrides,
  };
  vi.mocked(usePalaceStore).mockImplementation((selector) => selector(state as unknown as PalaceStore));
}

describe("useAssessHint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("returns null when no palace is open", () => {
    mockStore({ currentPalace: null });
    const { result } = renderHook(() => useAssessHint(vi.fn()));
    expect(result.current).toBeNull();
  });

  it("surfaces a high-scoring AAR from another palace", () => {
    const record = aarFrom("other", "DistributedSystems", HUB_NODES, HUB_EDGES);
    mockStore({
      aarRecords: [record],
      palaces: [CURRENT, { id: "other", name: "DistributedSystems", createdAt: "x" }],
    });
    const { result } = renderHook(() => useAssessHint(vi.fn()));
    expect(result.current).not.toBeNull();
    expect(result.current?.record.id).toBe(record.id);
    expect(result.current?.score).toBeGreaterThanOrEqual(0.7);
    expect(result.current?.sourcePalaceName).toBe("DistributedSystems");
  });

  it("returns null when the best match scores below the 0.7 threshold", () => {
    const record = aarFrom("other", "Pipelines", CASCADE_NODES, CASCADE_EDGES);
    mockStore({ aarRecords: [record], palaces: [CURRENT, { id: "other", name: "Pipelines", createdAt: "x" }] });
    const { result } = renderHook(() => useAssessHint(vi.fn()));
    expect(result.current).toBeNull();
  });

  it("returns null when the current palace has been dismissed", () => {
    const record = aarFrom("other", "DistributedSystems", HUB_NODES, HUB_EDGES);
    mockStore({ aarRecords: [record], dismissedAssessByPalaceId: [CURRENT.id] });
    const { result } = renderHook(() => useAssessHint(vi.fn()));
    expect(result.current).toBeNull();
  });

  it("excludes AARs belonging to the current palace", () => {
    const ownRecord = aarFrom(CURRENT.id, CURRENT.name, HUB_NODES, HUB_EDGES);
    mockStore({ aarRecords: [ownRecord] });
    const { result } = renderHook(() => useAssessHint(vi.fn()));
    expect(result.current).toBeNull();
  });

  it("falls back to the record's palace name when the source palace is unknown", () => {
    const record = aarFrom("ghost", "ArchivedPalace", HUB_NODES, HUB_EDGES);
    mockStore({ aarRecords: [record], palaces: [CURRENT] });
    const { result } = renderHook(() => useAssessHint(vi.fn()));
    expect(result.current?.sourcePalaceName).toBe("ArchivedPalace");
  });

  it("wires dismiss and jump to the store action and the injected callback", () => {
    const record = aarFrom("other", "DistributedSystems", HUB_NODES, HUB_EDGES);
    const dismissAssessForPalace = vi.fn();
    const onJump = vi.fn();
    mockStore({ aarRecords: [record], dismissAssessForPalace });
    const { result } = renderHook(() => useAssessHint(onJump));
    result.current?.dismiss();
    expect(dismissAssessForPalace).toHaveBeenCalledWith(CURRENT.id);
    result.current?.jump();
    expect(onJump).toHaveBeenCalledWith(record);
  });

  it("loads AAR records when they have not been loaded yet", () => {
    const loadAARRecords = vi.fn();
    mockStore({ aarRecordsLoaded: false, loadAARRecords });
    renderHook(() => useAssessHint(vi.fn()));
    expect(loadAARRecords).toHaveBeenCalledTimes(1);
  });
});
