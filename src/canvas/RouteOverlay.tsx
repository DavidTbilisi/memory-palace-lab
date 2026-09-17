import { useMemo } from "react";
import { usePalaceStore } from "../store/palaceStore";
import {
  STOP_BADGE_SIZE,
  buildRouteOverlay,
  type NodeBox,
  type RouteSegment,
} from "./routeOverlayGeometry";

const ARROW_LENGTH = 8;
const ARROW_HALF_WIDTH = 4.5;

function arrowHead({ x1, y1, x2, y2 }: RouteSegment): string {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / length;
  const uy = (y2 - y1) / length;
  const baseX = x2 - ux * ARROW_LENGTH;
  const baseY = y2 - uy * ARROW_LENGTH;
  return [
    `${x2},${y2}`,
    `${baseX - uy * ARROW_HALF_WIDTH},${baseY + ux * ARROW_HALF_WIDTH}`,
    `${baseX + uy * ARROW_HALF_WIDTH},${baseY - ux * ARROW_HALF_WIDTH}`,
  ].join(" ");
}

/**
 * Route paths and numbered stops drawn over the canvas. Purely visual: it never takes pointer
 * events, so clicks reach the nodes underneath (Route mode relies on that).
 */
export function RouteOverlay({ boxes }: { boxes: ReadonlyMap<string, NodeBox> }) {
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const building = usePalaceStore((s) => s.toolMode === "route");

  const activeRouteId = walkRouteId ?? routes[0]?.id ?? null;
  const overlay = useMemo(
    () =>
      buildRouteOverlay({
        routes,
        loci,
        boxes,
        activeRouteId,
        walk: walkOpen && activeRouteId ? { routeId: activeRouteId, index: walkIndex } : null,
      }),
    [routes, loci, boxes, activeRouteId, walkOpen, walkIndex],
  );

  if (overlay.paths.length === 0) return null;
  const radius = STOP_BADGE_SIZE / 2;

  return (
    <svg
      aria-hidden="true"
      data-testid="route-overlay"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
    >
      {overlay.paths.map((path) => {
        const emphasized = path.active && (building || walkOpen || overlay.paths.length === 1);
        return (
          <g
            key={path.routeId}
            data-route-path={path.routeId}
            opacity={path.active ? 0.95 : 0.5}
            stroke={path.color}
            fill={path.color}
          >
            {path.segments.map((segment, index) => (
              <g key={index}>
                <line
                  x1={segment.x1}
                  y1={segment.y1}
                  x2={segment.x2}
                  y2={segment.y2}
                  strokeWidth={emphasized ? 3 : path.active ? 2.25 : 1.5}
                  strokeLinecap="round"
                  strokeDasharray={path.active ? undefined : "6 5"}
                />
                <polygon points={arrowHead(segment)} stroke="none" />
              </g>
            ))}
          </g>
        );
      })}
      {overlay.badges.map((badge) => (
        <g
          key={badge.key}
          data-route-stop={badge.routeId}
          data-stop-number={badge.number}
          opacity={badge.active ? 1 : 0.7}
        >
          <circle
            cx={badge.x + radius}
            cy={badge.y + radius}
            r={radius}
            fill={badge.color}
            stroke={badge.current ? "#fafafa" : "#09090b"}
            strokeWidth={badge.current ? 2.5 : 1}
          />
          <text
            x={badge.x + radius}
            y={badge.y + radius}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={badge.number > 99 ? 8 : 10}
            fontWeight={700}
            fill="#09090b"
          >
            {badge.number}
          </text>
        </g>
      ))}
    </svg>
  );
}
