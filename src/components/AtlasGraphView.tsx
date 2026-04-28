import { useEffect, useRef, useState } from "react";
import { getPalaceRepository } from "../infrastructure/palaceRepositoryProvider";
import { usePalaceStore } from "../store/palaceStore";
import { splitAtlasPath } from "../domain/services/atlasHierarchy";
import type { Palace } from "../domain/entities/types";

type Props = {
  palaces: Palace[];
  currentPalaceId: string | null;
  onOpenPalace: (palaceId: string) => void;
};

type GNode = {
  id: string;
  label: string;
  atlasPath: string | null;
  nodeCount: number;
  x: number;
  y: number;
};

type GEdge = {
  from: string;
  to: string;
  portalTitle: string;
};

const repo = getPalaceRepository();

const NODE_R = 36;
const REPULSION = 4000;
const SPRING = 0.04;
const GRAVITY = 0.008;
const DAMPING = 0.82;
const ITERATIONS = 250;

function nodeColor(atlasPath: string | null): string {
  const depth = splitAtlasPath(atlasPath).length;
  if (depth === 0) return "#52525b"; // zinc-600
  if (depth === 1) return "#7c3aed"; // violet-600
  if (depth === 2) return "#2563eb"; // blue-600
  return "#0284c7"; // sky-600
}

function computeLayout(
  nodes: GNode[],
  edges: GEdge[],
  cx: number,
  cy: number,
): GNode[] {
  if (nodes.length === 0) return nodes;

  const spread = Math.min(cx, cy) * 0.6;
  const result = nodes.map((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    return { ...n, x: cx + spread * Math.cos(angle), y: cy + spread * Math.sin(angle), vx: 0, vy: 0 };
  }) as (GNode & { vx: number; vy: number })[];

  const idxById = new Map(result.map((n, i) => [n.id, i]));

  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Repulsion
    for (let a = 0; a < result.length; a++) {
      for (let b = a + 1; b < result.length; b++) {
        const na = result[a], nb = result[b];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.max(Math.hypot(dx, dy), 1);
        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        na.vx += fx; na.vy += fy;
        nb.vx -= fx; nb.vy -= fy;
      }
    }

    // Spring attraction
    for (const e of edges) {
      const ai = idxById.get(e.from);
      const bi = idxById.get(e.to);
      if (ai == null || bi == null) continue;
      const na = result[ai], nb = result[bi];
      const dx = nb.x - na.x;
      const dy = nb.y - na.y;
      na.vx += dx * SPRING; na.vy += dy * SPRING;
      nb.vx -= dx * SPRING; nb.vy -= dy * SPRING;
    }

    // Center gravity + integrate
    for (const n of result) {
      n.vx += (cx - n.x) * GRAVITY;
      n.vy += (cy - n.y) * GRAVITY;
      n.x += n.vx; n.y += n.vy;
      n.vx *= DAMPING; n.vy *= DAMPING;
    }
  }

  return result;
}

export function AtlasGraphView({ palaces, currentPalaceId, onOpenPalace }: Props) {
  const nodes = usePalaceStore((s) => s.nodes);
  const [gNodes, setGNodes] = useState<GNode[]>([]);
  const [gEdges, setGEdges] = useState<GEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const didMoveRef = useRef(false);

  // Observe container size
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(() => {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDims({ w: rect.width, h: rect.height });
      }
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  // Load all palace snapshots to find portal edges
  useEffect(() => {
    if (palaces.length === 0) {
      setGNodes([]);
      setGEdges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    void (async () => {
      const rawNodes: GNode[] = [];
      const rawEdges: GEdge[] = [];
      const palaceIds = new Set(palaces.map((p) => p.id));

      await Promise.all(
        palaces.map(async (palace) => {
          const snap = await repo.loadPalace(palace.id);
          const nodeCount = snap?.nodes.length ?? 0;
          rawNodes.push({
            id: palace.id,
            label: palace.alias ?? palace.name,
            atlasPath: palace.atlasPath ?? null,
            nodeCount,
            x: 0,
            y: 0,
          });
          if (snap) {
            for (const node of snap.nodes) {
              if (
                node.kind === "portal" &&
                node.portal?.targetPalaceId &&
                palaceIds.has(node.portal.targetPalaceId)
              ) {
                rawEdges.push({
                  from: palace.id,
                  to: node.portal.targetPalaceId,
                  portalTitle: node.title,
                });
              }
            }
          }
        }),
      );

      const cx = dims.w / 2;
      const cy = dims.h / 2;
      setGNodes(computeLayout(rawNodes, rawEdges, cx, cy));
      setGEdges(rawEdges);
      setLoading(false);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palaces, nodes, dims.w, dims.h]);

  const toSVGPoint = (e: React.MouseEvent): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: e.clientX, y: e.clientY };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const onNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const { x, y } = toSVGPoint(e);
    const node = gNodes.find((n) => n.id === id);
    if (!node) return;
    dragRef.current = { id, ox: x - node.x, oy: y - node.y };
    didMoveRef.current = false;
  };

  const onSVGMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    didMoveRef.current = true;
    const { x, y } = toSVGPoint(e);
    const { id, ox, oy } = dragRef.current;
    setGNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: x - ox, y: y - oy } : n)),
    );
  };

  const onSVGMouseUp = () => {
    dragRef.current = null;
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        Loading atlas…
      </div>
    );
  }

  if (gNodes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        No palaces yet. Create one to build your atlas.
      </div>
    );
  }

  const MARKER_ID = "atlas-arrow";

  return (
    <svg
      ref={svgRef}
      className="flex-1 w-full h-full"
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      style={{ background: "transparent" }}
      onMouseMove={onSVGMouseMove}
      onMouseUp={onSVGMouseUp}
      onMouseLeave={onSVGMouseUp}
    >
      <defs>
        <marker
          id={MARKER_ID}
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#52525b" />
        </marker>
      </defs>

      {/* Edges */}
      {gEdges.map((e, i) => {
        const from = gNodes.find((n) => n.id === e.from);
        const to = gNodes.find((n) => n.id === e.to);
        if (!from || !to) return null;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.max(Math.hypot(dx, dy), 1);
        // Shorten line so arrowhead sits on the circle edge
        const sx = from.x + (dx / dist) * NODE_R;
        const sy = from.y + (dy / dist) * NODE_R;
        const ex = to.x - (dx / dist) * (NODE_R + 4);
        const ey = to.y - (dy / dist) * (NODE_R + 4);

        return (
          <line
            key={i}
            x1={sx} y1={sy}
            x2={ex} y2={ey}
            stroke="#3f3f46"
            strokeWidth={1.5}
            markerEnd={`url(#${MARKER_ID})`}
          />
        );
      })}

      {/* Nodes */}
      {gNodes.map((n) => {
        const isCurrent = n.id === currentPalaceId;
        const color = nodeColor(n.atlasPath);
        const depth = splitAtlasPath(n.atlasPath).length;
        const label = n.label.length > 14 ? n.label.slice(0, 13) + "…" : n.label;
        const sublabel = depth > 0 ? splitAtlasPath(n.atlasPath).slice(-1)[0] : null;
        const showSub = sublabel && sublabel !== n.label;

        return (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            onMouseDown={(e) => onNodeMouseDown(e, n.id)}
            onClick={() => { if (!didMoveRef.current) onOpenPalace(n.id); }}
            style={{ cursor: dragRef.current?.id === n.id ? "grabbing" : "grab" }}
            role="button"
            aria-label={`Open palace ${n.label}`}
          >
            {/* Outer ring for current palace */}
            {isCurrent && (
              <circle r={NODE_R + 5} fill="none" stroke="#7c3aed" strokeWidth={2} opacity={0.7} />
            )}
            <circle r={NODE_R} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={isCurrent ? 2 : 1.5} />

            {/* Palace name */}
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              y={showSub ? -7 : 0}
              fontSize={11}
              fill="#e4e4e7"
              fontWeight={isCurrent ? 700 : 400}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {label}
            </text>

            {/* Atlas path last segment as subtitle */}
            {showSub && (
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                y={8}
                fontSize={9}
                fill="#71717a"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {sublabel!.length > 16 ? sublabel!.slice(0, 15) + "…" : sublabel}
              </text>
            )}

            {/* Node count badge */}
            {n.nodeCount > 0 && (
              <g transform={`translate(${NODE_R - 6}, ${-NODE_R + 6})`}>
                <circle r={9} fill="#18181b" stroke={color} strokeWidth={1} />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={8}
                  fill={color}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {n.nodeCount > 99 ? "99+" : n.nodeCount}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
