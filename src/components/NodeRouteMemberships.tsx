import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { routeColorHex, routesContainingNode } from "../domain/services/routeBuilder";
import { usePalaceStore } from "../store/palaceStore";

const itemClass =
  "flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 outline-none data-[disabled]:cursor-default data-[disabled]:opacity-40 data-[highlighted]:bg-zinc-800";

/** The inspector's list of routes that stop at a node, plus "Add to route". */
export function NodeRouteMemberships({ nodeId }: { nodeId: string }) {
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const setRoutePanelOpen = usePalaceStore((s) => s.setRoutePanelOpen);
  const addStopsToRoute = usePalaceStore((s) => s.addStopsToRoute);
  const createRoute = usePalaceStore((s) => s.createRoute);

  const memberships = useMemo(() => routesContainingNode(routes, loci, nodeId), [routes, loci, nodeId]);
  const positionsByRoute = new Map(memberships.map((membership) => [membership.route.id, membership.positions]));

  const openRoute = (routeId: string) => {
    // Switching routes mid-walk would restart the walk, so only show the tab then.
    if (!walkOpen) setWalkRoute(routeId);
    setRoutePanelOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <span id="mp-node-routes" className="text-sm font-medium text-zinc-300">
          Routes
        </span>
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
              Add to route
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              align="end"
              className="z-50 min-w-[11rem] max-w-[16rem] rounded-md border border-zinc-700 bg-zinc-950 p-1 text-xs text-zinc-200 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
            >
              {routes.map((route, index) => {
                const positions = positionsByRoute.get(route.id);
                return (
                  <DropdownMenu.Item
                    key={route.id}
                    className={itemClass}
                    disabled={!!positions}
                    onSelect={() => addStopsToRoute(route.id, [nodeId])}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: routeColorHex(route, index) }}
                    />
                    <span className="min-w-0 flex-1 truncate">{route.name}</span>
                    {positions ? <span className="text-zinc-500">stop {positions[0]}</span> : null}
                  </DropdownMenu.Item>
                );
              })}
              {routes.length > 0 ? <DropdownMenu.Separator className="my-1 h-px bg-zinc-800" /> : null}
              <DropdownMenu.Item
                className={itemClass}
                onSelect={() => {
                  const routeId = createRoute();
                  if (routeId) addStopsToRoute(routeId, [nodeId]);
                }}
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                New route starting here
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      {memberships.length === 0 ? (
        <p className="mt-1 text-[11px] text-zinc-500">Not a stop on any route yet.</p>
      ) : (
        <ul aria-labelledby="mp-node-routes" className="mt-1 flex flex-wrap gap-1">
          {memberships.map(({ route, routeIndex, positions }) => (
            <li key={route.id} className="max-w-full">
              <button
                type="button"
                title={`Open ${route.name} in the Routes tab`}
                onClick={() => openRoute(route.id)}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-200 hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: routeColorHex(route, routeIndex) }}
                />
                <span className="truncate">{route.name}</span>
                <span className="shrink-0 text-zinc-500">
                  {positions.length > 1 ? `stops ${positions.join(", ")}` : `stop ${positions[0]}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
