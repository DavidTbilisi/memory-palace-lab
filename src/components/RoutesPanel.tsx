import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Camera,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Footprints,
  GripVertical,
  MoreHorizontal,
  MousePointerClick,
  Plus,
  SeparatorHorizontal,
  X,
} from "lucide-react";
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { captureStopView, memoryNodeCenter, selectedMemoryNodePoints } from "../canvas/routeCanvas";
import { ROUTE_COLORS, type Locus, type MemoryRoute, type RouteDirection } from "../domain/entities/types";
import { countDueLoci, isRouteInReview, nedfLookup } from "../domain/services/dueQueue";
import { SECTIONED_ROUTE_STOPS } from "../domain/services/routeSections";
import {
  ROUTE_COLOR_HEX,
  STOP_ORDER_LABELS,
  orderStops,
  routeColorHex,
  routeColorKey,
  stopLabel,
  type StopOrder,
} from "../domain/services/routeBuilder";
import { orderedLoci, routeIndexOfWalkStep } from "../domain/services/walkService";
import { usePalaceStore } from "../store/palaceStore";
import { cn } from "../utils/cn";
import { confirmDestructive } from "../utils/confirmDestructive";
import { useCanvasNodeTitles } from "./hooks/useCanvasNodeTitles";
import { Button } from "./ui/button";

const DIRECTION_LABELS: Record<RouteDirection, string> = {
  forward: "Forward",
  reverse: "Reverse",
  alternate: "Alternate each walk",
};
const STOP_ORDERS: StopOrder[] = ["selection", "left-to-right", "top-to-bottom", "nearest"];

const menuContentClass =
  "z-50 min-w-[10rem] rounded-md border border-zinc-700 bg-zinc-950 p-1 text-xs text-zinc-200 shadow-[0_12px_32px_rgba(0,0,0,0.5)]";
const menuItemClass =
  "flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 outline-none data-[disabled]:cursor-default data-[disabled]:opacity-40 data-[highlighted]:bg-zinc-800";

type StopInfo = { title: string | null; missing: boolean };

function IconButton({
  label,
  title,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string;
  title?: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={title ?? label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ColorMenu({ route, index }: { route: MemoryRoute; index: number }) {
  const setRouteColor = usePalaceStore((s) => s.setRouteColor);
  const current = routeColorKey(route, index);
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Color of ${route.name}: ${capitalize(current)}`}
          title="Change route color"
          className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/50 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          style={{ backgroundColor: ROUTE_COLOR_HEX[current] }}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          align="start"
          aria-label="Route color"
          className="z-50 grid grid-cols-4 gap-1.5 rounded-md border border-zinc-700 bg-zinc-950 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
        >
          {ROUTE_COLORS.map((color) => (
            <DropdownMenu.Item
              key={color}
              aria-label={capitalize(color)}
              onSelect={() => setRouteColor(route.id, color)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full outline-none ring-offset-2 ring-offset-zinc-950 data-[highlighted]:ring-2 data-[highlighted]:ring-zinc-300"
              style={{ backgroundColor: ROUTE_COLOR_HEX[color] }}
            >
              {color === current ? <Check className="h-3.5 w-3.5 text-zinc-950" aria-hidden="true" /> : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function RouteMenu({
  route,
  index,
  total,
  stopCount,
  onRename,
}: {
  route: MemoryRoute;
  index: number;
  total: number;
  stopCount: number;
  onRename: () => void;
}) {
  const moveRouteTo = usePalaceStore((s) => s.moveRouteTo);
  const deleteRoute = usePalaceStore((s) => s.deleteRoute);
  const setRouteDirection = usePalaceStore((s) => s.setRouteDirection);
  const setRouteInReview = usePalaceStore((s) => s.setRouteInReview);
  // Keep focus in the rename field instead of letting the menu hand it back to its trigger.
  const renameRequested = useRef(false);

  const confirmDelete = async () => {
    const ok = await confirmDestructive(
      `Delete route "${route.name}"${
        stopCount > 0 ? ` and its ${stopCount} ${stopCount === 1 ? "stop" : "stops"} (review schedules included)` : ""
      }? This cannot be undone.`,
    );
    if (ok) deleteRoute(route.id);
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`More actions for ${route.name}`}
          title="More actions"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="end"
          className={menuContentClass}
          onCloseAutoFocus={(event) => {
            if (!renameRequested.current) return;
            renameRequested.current = false;
            event.preventDefault();
          }}
        >
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => {
              renameRequested.current = true;
              onRename();
            }}
          >
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            disabled={index === 0}
            onSelect={() => moveRouteTo(route.id, index - 1)}
          >
            Move up
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            disabled={index >= total - 1}
            onSelect={() => moveRouteTo(route.id, index + 1)}
          >
            Move down
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-zinc-800" />
          <DropdownMenu.Label className="px-2 pb-0.5 pt-1 text-[10px] uppercase tracking-wide text-zinc-500">
            Walk direction
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={route.direction ?? "forward"}
            onValueChange={(value) => setRouteDirection(route.id, value as RouteDirection)}
          >
            {(Object.keys(DIRECTION_LABELS) as RouteDirection[]).map((direction) => (
              <DropdownMenu.RadioItem key={direction} value={direction} className={menuItemClass}>
                <span className="flex w-3.5 justify-center">
                  <DropdownMenu.ItemIndicator>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </DropdownMenu.ItemIndicator>
                </span>
                {DIRECTION_LABELS[direction]}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator className="my-1 h-px bg-zinc-800" />
          <DropdownMenu.CheckboxItem
            className={menuItemClass}
            checked={isRouteInReview(route)}
            onCheckedChange={(checked) => setRouteInReview(route.id, checked === true)}
          >
            <span className="flex w-3.5 justify-center">
              <DropdownMenu.ItemIndicator>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </DropdownMenu.ItemIndicator>
            </span>
            Include in review
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator className="my-1 h-px bg-zinc-800" />
          <DropdownMenu.Item
            className={cn(menuItemClass, "text-rose-300")}
            onSelect={() => void confirmDelete()}
          >
            Delete route
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function AddSelectedMenu({ routeId, stops }: { routeId: string; stops: Locus[] }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const addStopsToRoute = usePalaceStore((s) => s.addStopsToRoute);
  const showRouteNotice = usePalaceStore((s) => s.showRouteNotice);

  const addSelected = (order: StopOrder) => {
    if (!editorRef) return;
    const points = selectedMemoryNodePoints(editorRef);
    if (points.length === 0) {
      showRouteNotice("Select one or more nodes on the canvas first");
      return;
    }
    const lastStop = stops[stops.length - 1];
    const start = lastStop ? memoryNodeCenter(editorRef, lastStop.nodeId) : null;
    addStopsToRoute(routeId, orderStops(points, order, start));
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button size="sm" variant="secondary" type="button" className="h-7 flex-1 gap-1 px-2">
          Add selected
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={4} align="end" className={menuContentClass}>
          <DropdownMenu.Label className="px-2 py-1 text-[11px] text-zinc-500">
            Add the selected nodes
          </DropdownMenu.Label>
          {STOP_ORDERS.map((order) => (
            <DropdownMenu.Item key={order} className={menuItemClass} onSelect={() => addSelected(order)}>
              {STOP_ORDER_LABELS[order]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function StopLabelEditor({
  stop,
  number,
  placeholder,
  onDone,
}: {
  stop: Locus;
  number: number;
  placeholder: string;
  onDone: () => void;
}) {
  const updateLocusLabel = usePalaceStore((s) => s.updateLocusLabel);
  const [value, setValue] = useState(stop.label);
  const commit = () => {
    onDone();
    const next = value.trim();
    if (next !== stop.label.trim()) updateLocusLabel(stop.id, next);
  };
  return (
    <input
      autoFocus
      aria-label={`Label for stop ${number}`}
      value={value}
      placeholder={placeholder}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          event.preventDefault();
          setValue(stop.label);
          onDone();
        }
      }}
      className="h-6 min-w-0 flex-1 rounded border border-zinc-600 bg-zinc-900 px-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
    />
  );
}

/**
 * A stop's saved view. Without one, the camera button saves the current view; with one, it
 * opens a menu to show, replace, or remove it.
 */
function StopViewControl({
  stop,
  number,
  label,
  color,
  missing,
}: {
  stop: Locus;
  number: number;
  label: string;
  color: string;
  missing: boolean;
}) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const setStopView = usePalaceStore((s) => s.setStopView);
  const focusStop = usePalaceStore((s) => s.focusStop);
  const showRouteNotice = usePalaceStore((s) => s.showRouteNotice);
  const canCapture = !missing && editorRef !== null;

  const saveCurrentView = () => {
    if (!editorRef) return;
    const view = captureStopView(editorRef, stop.nodeId);
    if (view) setStopView(stop.id, view);
    else showRouteNotice(`Move the canvas so ${label} is in view, then save the view`);
  };
  const buttonClass =
    "rounded p-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-40";

  if (!stop.view) {
    return (
      <button
        type="button"
        aria-label={`Save the current view for stop ${number}, ${label}`}
        title="Save the current zoom and position for this stop. Walks return to it."
        disabled={!canCapture}
        onClick={saveCurrentView}
        className={cn(buttonClass, "text-zinc-600 hover:text-zinc-200")}
      >
        <Camera className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Saved view of stop ${number}, ${label}`}
          title="Walks show this stop in its saved view"
          className={buttonClass}
          style={{ color }}
        >
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={4} align="end" className={menuContentClass}>
          <DropdownMenu.Item className={menuItemClass} disabled={missing} onSelect={() => focusStop(stop.id)}>
            Show saved view
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} disabled={!canCapture} onSelect={saveCurrentView}>
            Replace with current view
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClass} onSelect={() => setStopView(stop.id, null)}>
            Remove saved view
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

type DragState = { locusId: string; from: number; slot: number };

/** Index a dragged stop ends up at when dropped into `slot` (0..n, before row `slot`). */
function dropIndex(drag: DragState) {
  return drag.slot > drag.from ? drag.slot - 1 : drag.slot;
}

function SectionHeader({
  stop,
  editing,
  onEdit,
  onDone,
}: {
  stop: Locus;
  editing: boolean;
  onEdit: () => void;
  onDone: () => void;
}) {
  const setStopSection = usePalaceStore((s) => s.setStopSection);
  const name = stop.section ?? "";
  const [value, setValue] = useState(name);
  useEffect(() => {
    if (editing) setValue(name);
  }, [editing, name]);
  const commit = () => {
    onDone();
    if (value.trim() && value.trim() !== name) setStopSection(stop.id, value);
  };
  return (
    <li data-section-header={stop.id} className="flex items-center gap-1 px-1 pb-0.5 pt-2 first:pt-0.5">
      {editing ? (
        <input
          autoFocus
          aria-label="Section name"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
            if (event.key === "Escape") {
              event.preventDefault();
              setValue(name);
              onDone();
            }
          }}
          className="h-6 min-w-0 flex-1 rounded border border-zinc-600 bg-zinc-900 px-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      ) : (
        <button
          type="button"
          title="Section. Click to rename."
          onClick={onEdit}
          className="min-w-0 flex-1 truncate rounded text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
        >
          {name}
        </button>
      )}
      <button
        type="button"
        aria-label={`Remove section ${name}`}
        title="Remove section (its stops join the one before)"
        onClick={() => setStopSection(stop.id, null)}
        className="rounded p-0.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </li>
  );
}

function StopList({
  stops,
  color,
  currentIndex,
  reviewed,
  sectionable,
  infoFor,
}: {
  stops: Locus[];
  color: string;
  currentIndex: number | null;
  /** Draft routes show no due marks. */
  reviewed: boolean;
  /** Offer "start a section here" on each stop. */
  sectionable: boolean;
  infoFor: (nodeId: string) => StopInfo;
}) {
  const setStopSection = usePalaceStore((s) => s.setStopSection);
  const nodes = usePalaceStore((s) => s.nodes);
  const nedfOf = useMemo(() => nedfLookup(nodes), [nodes]);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const moveStop = usePalaceStore((s) => s.moveStop);
  const removeStop = usePalaceStore((s) => s.removeStop);
  const focusStop = usePalaceStore((s) => s.focusStop);
  const rowRefs = useRef(new Map<string, HTMLLIElement>());
  const [drag, setDrag] = useState<DragState | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refocusId, setRefocusId] = useState<string | null>(null);

  useEffect(() => {
    if (!refocusId) return;
    rowRefs.current.get(refocusId)?.querySelector<HTMLButtonElement>("[data-stop-grip]")?.focus();
    setRefocusId(null);
  }, [refocusId, stops]);

  if (stops.length === 0) {
    return (
      <p className="mt-2 rounded border border-dashed border-zinc-700 px-2 py-3 text-center text-[11px] leading-4 text-zinc-500">
        No stops yet. Turn on Add stops, then click nodes in the order you want to walk them.
      </p>
    );
  }

  const slotAt = (clientY: number) =>
    stops.reduce((slot, stop) => {
      const row = rowRefs.current.get(stop.id);
      if (!row) return slot;
      const rect = row.getBoundingClientRect();
      return clientY > rect.top + rect.height / 2 ? slot + 1 : slot;
    }, 0);
  const showDropLine = (slot: number) =>
    drag !== null && drag.slot === slot && dropIndex(drag) !== drag.from;
  const nowIso = new Date().toISOString();

  const onGripKeyDown = (event: ReactKeyboardEvent, stop: Locus, index: number) => {
    const target =
      event.key === "ArrowUp"
        ? index - 1
        : event.key === "ArrowDown"
          ? index + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? stops.length - 1
              : null;
    if (target === null) return;
    event.preventDefault();
    if (target < 0 || target >= stops.length || target === index) return;
    moveStop(stop.id, target);
    setRefocusId(stop.id);
  };

  return (
    <ol aria-label="Stops" className="mt-2 space-y-px">
      {stops.map((stop, index) => {
        const { title, missing } = infoFor(stop.nodeId);
        const label = stopLabel(stop, title);
        const custom = stop.label.trim().length > 0;
        const current = currentIndex === index;
        const due = reviewed && countDueLoci([stop], nowIso, nedfOf) > 0;
        const section = stop.section?.trim() ? stop : null;
        return (
          <Fragment key={stop.id}>
            {section ? (
              <SectionHeader
                stop={section}
                editing={editingSectionId === stop.id}
                onEdit={() => setEditingSectionId(stop.id)}
                onDone={() => setEditingSectionId(null)}
              />
            ) : null}
            <li
              ref={(element) => {
                if (element) rowRefs.current.set(stop.id, element);
                else rowRefs.current.delete(stop.id);
              }}
              data-stop-id={stop.id}
              className={cn(
                "relative flex items-center gap-1 rounded px-0.5 py-0.5 text-xs",
                current ? "bg-violet-900/40" : "hover:bg-zinc-900",
                drag?.locusId === stop.id && "opacity-40",
              )}
            >
              {showDropLine(index) ? (
                <span aria-hidden="true" className="absolute -top-px left-0 right-0 h-0.5 rounded bg-violet-400" />
              ) : null}
              <button
                type="button"
                data-stop-grip
                aria-label={`Move stop ${index + 1}, ${missing ? "missing node" : label}`}
                title="Drag, or use the arrow keys, to move this stop"
                className="cursor-grab touch-none rounded p-0.5 text-zinc-600 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500 active:cursor-grabbing"
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                  setDrag({ locusId: stop.id, from: index, slot: index });
                }}
                onPointerMove={(event) => {
                  if (drag?.locusId !== stop.id) return;
                  const slot = slotAt(event.clientY);
                  if (slot !== drag.slot) setDrag({ ...drag, slot });
                }}
                onPointerUp={() => {
                  if (drag?.locusId === stop.id && dropIndex(drag) !== drag.from) {
                    moveStop(stop.id, dropIndex(drag));
                  }
                  setDrag(null);
                }}
                onPointerCancel={() => setDrag(null)}
                onKeyDown={(event) => onGripKeyDown(event, stop, index)}
              >
                <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="w-5 shrink-0 text-right font-semibold tabular-nums" style={{ color }}>
                {index + 1}
              </span>
              {editingId === stop.id ? (
                <StopLabelEditor
                  stop={stop}
                  number={index + 1}
                  placeholder={title ?? "Stop label"}
                  onDone={() => setEditingId(null)}
                />
              ) : (
                <button
                  type="button"
                  className={cn(
                    "min-w-0 flex-1 truncate rounded px-1 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500",
                    missing ? "text-amber-300" : "text-zinc-200 hover:text-white",
                  )}
                  title={
                    missing
                      ? "This stop's node is not on the canvas. It is dropped when the palace is saved."
                      : `${label}${custom && title ? ` (node: ${title})` : ""}. Click to show it on the canvas${
                          stop.view ? " in its saved view" : ""
                        }, double-click to rename the stop.`
                  }
                  onClick={() => {
                    if (!missing) focusStop(stop.id);
                  }}
                  onDoubleClick={() => setEditingId(stop.id)}
                  onKeyDown={(event) => {
                    if (event.key === "F2") {
                      event.preventDefault();
                      setEditingId(stop.id);
                    }
                  }}
                >
                  {missing ? "Missing node" : label}
                  {custom && title && !missing ? <span className="ml-1 text-zinc-500">· {title}</span> : null}
                </button>
              )}
              {due ? (
                <span className="shrink-0 rounded bg-amber-500/15 px-1 text-[10px] font-medium text-amber-300">due</span>
              ) : null}
              {sectionable && !section ? (
                <button
                  type="button"
                  aria-label={`Start a section at stop ${index + 1}`}
                  title="Start a section here"
                  onClick={() => {
                    const sectionCount = stops.filter((candidate) => candidate.section?.trim()).length;
                    setStopSection(stop.id, `Section ${sectionCount + 1}`);
                    setEditingSectionId(stop.id);
                  }}
                  className="rounded p-0.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
                >
                  <SeparatorHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
              <StopViewControl
                stop={stop}
                number={index + 1}
                label={missing ? "missing node" : label}
                color={color}
                missing={missing}
              />
              <button
                type="button"
                aria-label={`Remove stop ${index + 1}, ${missing ? "missing node" : label}`}
                title="Remove stop"
                onClick={() => removeStop(stop.id)}
                className="rounded p-0.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          </Fragment>
        );
      })}
      {showDropLine(stops.length) ? <li aria-hidden="true" className="h-0.5 rounded bg-violet-400" /> : null}
    </ol>
  );
}

/** A route's metadata from the DSL (`#difficulty:advanced #prereq:…`), on every card that has any. */
function RouteMetadataList({ route }: { route: MemoryRoute }) {
  if (!route.metadata?.length) return null;
  return (
    <ul
      aria-label={`Metadata for ${route.name}`}
      title="Route metadata. Edit it under the route in the DSL editor."
      className="flex flex-wrap gap-1 px-2 pb-1.5"
    >
      {route.metadata.map(({ key, value }, i) => (
        <li
          key={`${key}-${i}`}
          title={value ? `${key}: ${value}` : key}
          className="inline-flex min-w-0 max-w-full items-baseline gap-1 rounded-full bg-zinc-800/80 px-2 py-0.5 text-[11px] leading-4"
        >
          <span className="shrink-0 text-zinc-500">
            {key}
            {value ? ":" : ""}
          </span>
          {value ? <span className="truncate text-zinc-200">{value}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** A route's notes: read-only on a closed card, editable on the active one. */
function RouteNotes({ route, editable }: { route: MemoryRoute; editable: boolean }) {
  const setRouteNotes = usePalaceStore((s) => s.setRouteNotes);
  const [value, setValue] = useState(route.notes ?? "");
  useEffect(() => setValue(route.notes ?? ""), [route.notes]);
  if (!editable) {
    if (!route.notes) return null;
    return (
      <p
        data-route-notes={route.id}
        className="line-clamp-2 whitespace-pre-line px-2 pb-1.5 text-[11px] leading-4 text-zinc-400"
      >
        {route.notes}
      </p>
    );
  }
  return (
    <textarea
      aria-label={`Notes for ${route.name}`}
      data-route-notes={route.id}
      rows={value ? 3 : 1}
      value={value}
      placeholder="Notes for this route"
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => {
        if (value !== (route.notes ?? "")) setRouteNotes(route.id, value);
      }}
      className="mt-1.5 block w-full resize-y rounded border border-zinc-800 bg-zinc-950/60 px-1.5 py-1 text-[11px] leading-4 text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
    />
  );
}

function RouteCard({
  route,
  index,
  total,
  active,
  stops,
  infoFor,
}: {
  route: MemoryRoute;
  index: number;
  total: number;
  active: boolean;
  stops: Locus[];
  infoFor: (nodeId: string) => StopInfo;
}) {
  const setWalkRoute = usePalaceStore((s) => s.setWalkRoute);
  const setWalkOpen = usePalaceStore((s) => s.setWalkOpen);
  const walkOpen = usePalaceStore((s) => s.walkOpen);
  const walkIndex = usePalaceStore((s) => s.walkIndex);
  const walkDirection = usePalaceStore((s) => s.walkDirection);
  const building = usePalaceStore((s) => s.toolMode === "route");
  const saveStopViews = usePalaceStore((s) => s.saveStopViews);
  const setRouteBuilding = usePalaceStore((s) => s.setRouteBuilding);
  const setRouteHidden = usePalaceStore((s) => s.setRouteHidden);
  const updateRouteName = usePalaceStore((s) => s.updateRouteName);
  const [renaming, setRenaming] = useState(false);
  const [draftName, setDraftName] = useState(route.name);

  const color = routeColorHex(route, index);
  const reviewed = isRouteInReview(route);
  const nodes = usePalaceStore((s) => s.nodes);
  const dueCount = reviewed ? countDueLoci(stops, undefined, nedfLookup(nodes)) : 0;
  const hasSections = stops.some((stop) => stop.section?.trim());
  const sectionable = hasSections || stops.length > SECTIONED_ROUTE_STOPS;
  const startRename = () => {
    setDraftName(route.name);
    setRenaming(true);
  };
  const commitRename = () => {
    setRenaming(false);
    if (draftName.trim() && draftName.trim() !== route.name) updateRouteName(route.id, draftName);
  };

  return (
    <section
      aria-label={`Route ${route.name}`}
      data-route-card={route.id}
      data-active={active}
      className={cn(
        "rounded-md border transition-colors",
        active ? "border-zinc-600 bg-zinc-900/70" : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700",
      )}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <ColorMenu route={route} index={index} />
        {renaming ? (
          <input
            autoFocus
            aria-label="Route name"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
              if (event.key === "Escape") {
                event.preventDefault();
                setDraftName(route.name);
                setRenaming(false);
              }
            }}
            className="h-6 min-w-0 flex-1 rounded border border-zinc-600 bg-zinc-900 px-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        ) : (
          <button
            type="button"
            aria-expanded={active}
            title={active ? "Active route. Double-click to rename." : "Open this route. Double-click to rename."}
            onClick={() => {
              if (!active) setWalkRoute(route.id);
            }}
            onDoubleClick={startRename}
            onKeyDown={(event) => {
              if (event.key === "F2") {
                event.preventDefault();
                startRename();
              }
            }}
            className={cn(
              "min-w-0 flex-1 truncate rounded text-left text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500",
              active ? "font-semibold text-zinc-50" : "text-zinc-300",
            )}
          >
            {route.name}
          </button>
        )}
        {reviewed ? null : (
          <span
            className="shrink-0 rounded bg-zinc-800 px-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400"
            title="Draft: not in review, so its stops are never due. Turn review on from the route's menu."
          >
            Draft
          </span>
        )}
        <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
          {stops.length}
          {dueCount > 0 ? <span className="ml-1 text-amber-300">· {dueCount} due</span> : null}
        </span>
        <IconButton
          label={`Show ${route.name} on the canvas`}
          title={route.hidden ? "Hidden on the canvas. Click to show." : "Shown on the canvas. Click to hide."}
          pressed={!route.hidden}
          onClick={() => setRouteHidden(route.id, !route.hidden)}
        >
          {route.hidden ? (
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </IconButton>
        <IconButton
          label={`Walk ${route.name}`}
          disabled={stops.length === 0}
          onClick={() => {
            setWalkRoute(route.id);
            setWalkOpen(true);
          }}
        >
          <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
        </IconButton>
        <RouteMenu route={route} index={index} total={total} stopCount={stops.length} onRename={startRename} />
      </div>
      <RouteMetadataList route={route} />
      {active ? null : <RouteNotes route={route} editable={false} />}
      {active ? (
        <div className="border-t border-zinc-800 px-2 pb-2 pt-1.5">
          <div className="flex gap-1.5">
            <Button
              size="sm"
              type="button"
              variant={building ? "default" : "secondary"}
              aria-pressed={building}
              className="h-7 flex-1 gap-1 px-2"
              title={building ? "Stop adding stops (Esc)" : "Click nodes on the canvas to append them"}
              onClick={() => setRouteBuilding(!building)}
            >
              <MousePointerClick className="h-3.5 w-3.5" aria-hidden="true" />
              {building ? "Adding stops" : "Add stops"}
            </Button>
            <AddSelectedMenu routeId={route.id} stops={stops} />
          </div>
          {building ? (
            <p className="mt-1.5 text-[11px] leading-4 text-violet-200/80">
              Click nodes on the canvas in walk order
              {saveStopViews ? "; each stop keeps the view you add it in" : ""}. Press Esc or Done to finish.
            </p>
          ) : null}
          <RouteNotes route={route} editable />
          <StopList
            stops={stops}
            color={color}
            currentIndex={walkOpen ? routeIndexOfWalkStep(walkIndex, stops.length, walkDirection) : null}
            reviewed={reviewed}
            sectionable={sectionable}
            infoFor={infoFor}
          />
          {sectionable && !hasSections ? (
            <p className="mt-2 text-[11px] leading-4 text-zinc-500">
              Long routes are easier to rehearse in sections of 12 to 25 stops. Use the divider on a stop to start
              one there.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function RouteNoticeBar() {
  const notice = usePalaceStore((s) => s.routeNotice);
  const dismiss = usePalaceStore((s) => s.dismissRouteNotice);
  const undo = usePalaceStore((s) => s.undoRouteChange);
  if (!notice) return null;
  return (
    <div
      role="status"
      className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-200"
    >
      <span className="min-w-0 flex-1 truncate" title={notice.message}>
        {notice.message}
      </span>
      {notice.canUndo ? (
        <button type="button" onClick={undo} className="shrink-0 font-medium text-violet-300 hover:text-violet-200">
          Undo
        </button>
      ) : null}
      <IconButton label="Dismiss message" onClick={dismiss}>
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </IconButton>
    </div>
  );
}

/** The Routes tab: every route in the palace, with the active one open for editing. */
export function RoutesPanel() {
  const routes = usePalaceStore((s) => s.routes);
  const loci = usePalaceStore((s) => s.loci);
  const walkRouteId = usePalaceStore((s) => s.walkRouteId);
  const editorRef = usePalaceStore((s) => s.editorRef);
  const snapshotNodes = usePalaceStore((s) => s.nodes);
  const currentPalace = usePalaceStore((s) => s.currentPalace);
  const createRoute = usePalaceStore((s) => s.createRoute);

  const activeRouteId = walkRouteId ?? routes[0]?.id ?? null;
  const canvasTitles = useCanvasNodeTitles(editorRef);
  const snapshotTitles = useMemo(
    () => new Map(snapshotNodes.map((node) => [node.id, node.title])),
    [snapshotNodes],
  );
  const stopsByRoute = useMemo(() => {
    const byRoute = new Map<string, Locus[]>();
    for (const route of routes) byRoute.set(route.id, []);
    for (const locus of loci) byRoute.get(locus.routeId)?.push(locus);
    for (const [routeId, list] of byRoute) byRoute.set(routeId, orderedLoci(list));
    return byRoute;
  }, [routes, loci]);
  // With a canvas mounted, a node it does not show is gone; otherwise trust the saved titles.
  const infoFor = (nodeId: string): StopInfo => {
    const live = canvasTitles.get(nodeId);
    if (live !== undefined) return { title: live, missing: false };
    return { title: snapshotTitles.get(nodeId) ?? null, missing: editorRef !== null };
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="routes-panel">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
        <div className="text-xs text-zinc-400">
          {routes.length === 0
            ? "No routes yet"
            : `${routes.length} ${routes.length === 1 ? "route" : "routes"}`}
        </div>
        <Button
          size="sm"
          type="button"
          variant="secondary"
          className="h-7 gap-1 px-2"
          disabled={!currentPalace}
          onClick={() => createRoute({ startBuilding: true })}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New route
        </Button>
      </div>
      <RouteNoticeBar />
      <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2">
        {routes.length === 0 ? (
          <div className="rounded-md border border-dashed border-zinc-700 p-3 text-xs leading-5 text-zinc-400">
            <p className="font-medium text-zinc-200">Walk this palace in order</p>
            <p className="mt-1">
              A route is the order you rehearse your nodes in. Create one, then click nodes on the canvas in the
              order you want to recall them.
            </p>
            <Button
              size="sm"
              type="button"
              className="mt-2 gap-1"
              disabled={!currentPalace}
              onClick={() => createRoute({ startBuilding: true })}
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Create route
            </Button>
          </div>
        ) : (
          routes.map((route, index) => (
            <RouteCard
              key={route.id}
              route={route}
              index={index}
              total={routes.length}
              active={route.id === activeRouteId}
              stops={stopsByRoute.get(route.id) ?? []}
              infoFor={infoFor}
            />
          ))
        )}
      </div>
    </div>
  );
}
