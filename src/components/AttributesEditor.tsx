import { useEffect, useMemo, useState } from "react";
import type { TLShapeId } from "@tldraw/tlschema";
import { dissolveAttribute } from "../canvas/dissolveAttribute";
import type { MemoryPalaceMeta } from "../canvas/memoryMeta";
import { writeNodeAttributes } from "../canvas/writeNodeAttributes";
import {
  ATTRIBUTE_ROUTES,
  UMTF_CHANNELS,
  type AttributeRoute,
  type NodeAttribute,
  type UmtfChannel,
} from "../domain/entities/types";
import {
  ATTRIBUTE_ROUTE_HINTS,
  ATTRIBUTE_ROUTE_LABELS,
  UMTF_CHANNEL_LABELS,
  UMTF_CHANNEL_QUESTIONS,
  attributeWarnings,
  firstFreeChannel,
  normalizeAttributes,
} from "../domain/services/attributes";
import { usePalaceStore } from "../store/palaceStore";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Row = { name: string; channel: UmtfChannel; values: string; route: AttributeRoute | ""; count: string };

function toRows(attributes: NodeAttribute[] | null): Row[] {
  return (attributes ?? []).map((a) => ({
    name: a.name,
    channel: a.channel,
    values: a.values.join(" | "),
    route: a.route ?? "",
    count: a.count !== undefined ? String(a.count) : "",
  }));
}

function toAttribute(row: Row): NodeAttribute {
  const count = Number(row.count);
  return {
    name: row.name.trim(),
    channel: row.channel,
    values: row.values.split("|").map((v) => v.trim()).filter((v) => v !== ""),
    ...(row.route ? { route: row.route } : {}),
    ...(row.count.trim() && Number.isInteger(count) && count > 0 ? { count } : {}),
  };
}

const selectClass =
  "h-8 rounded-md border border-zinc-700 bg-zinc-950 px-1.5 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500";

/**
 * A node's attributes, each on one UMTF channel. Two attributes on one channel, a multi-valued
 * attribute with no route, and an enumerated set whose count is off are reported under the row.
 */
export function AttributesEditor({ nodeId }: { nodeId: string }) {
  const editorRef = usePalaceStore((s) => s.editorRef);
  const selectedShapeId = usePalaceStore((s) => s.selectedShapeId);
  const palaceId = usePalaceStore((s) => s.currentPalace?.id ?? null);
  const stored = useMemo(() => {
    const shape = selectedShapeId ? editorRef?.getShape(selectedShapeId as TLShapeId) : undefined;
    return normalizeAttributes((shape?.meta as MemoryPalaceMeta | undefined)?.mpAttributes);
  }, [editorRef, selectedShapeId]);
  const [rows, setRows] = useState<Row[]>(() => toRows(stored));
  const [open, setOpen] = useState(() => stored !== null);

  useEffect(() => {
    setRows(toRows(stored));
    setOpen(stored !== null);
  }, [nodeId, stored]);

  const current = useMemo(() => rows.map(toAttribute), [rows]);
  const warnings = useMemo(() => attributeWarnings(current), [current]);
  const channelsInUse = new Set(current.filter((a) => a.name || a.values.length > 0).map((a) => a.channel)).size;

  const commit = (next: Row[] = rows) => {
    if (!editorRef || !selectedShapeId) return;
    const attributes = normalizeAttributes(next.map(toAttribute));
    // Compare with the shape as it is now: `stored` is only read when the selection changes.
    const live = normalizeAttributes((editorRef.getShape(selectedShapeId as TLShapeId)?.meta as MemoryPalaceMeta)?.mpAttributes);
    if (JSON.stringify(attributes) === JSON.stringify(live)) return;
    writeNodeAttributes(editorRef, nodeId, attributes);
  };

  const update = (index: number, patch: Partial<Row>, commitNow = false) => {
    const next = rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
    setRows(next);
    if (commitNow) commit(next);
  };

  const add = () => {
    setRows((prev) => [...prev, { name: "", channel: firstFreeChannel(prev.map(toAttribute)), values: "", route: "", count: "" }]);
    setOpen(true);
  };

  const remove = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    setRows(next);
    commit(next);
  };

  const split = (index: number) => {
    if (!editorRef || !palaceId) return;
    commit();
    const target = toAttribute(rows[index]);
    const saved = normalizeAttributes(rows.map(toAttribute)) ?? [];
    const savedIndex = saved.findIndex((a) => a.name === target.name && a.channel === target.channel);
    if (savedIndex < 0) return;
    if (dissolveAttribute(editorRef, palaceId, nodeId, savedIndex)) setRows(rows.filter((_, i) => i !== index));
  };

  // A collision outlines every row it names, but its message is shown once, under the first.
  const rowWarnings = (index: number) => warnings.filter((w) => w.kind !== "channel-budget" && w.attributes[0] === index);
  const rowFlagged = (index: number) => warnings.some((w) => w.kind !== "channel-budget" && w.attributes.includes(index));
  const budget = warnings.find((w) => w.kind === "channel-budget");

  return (
    <section aria-label="Attributes" className="rounded-md border border-zinc-800 bg-zinc-900/40">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-500"
      >
        <span className="flex-1">Attributes</span>
        {warnings.length > 0 ? (
          <span data-testid="attribute-warning-count" className="rounded bg-amber-900/60 px-1.5 text-[10px] font-medium text-amber-200">
            {warnings.length} to check
          </span>
        ) : null}
        <span className="text-[10px] text-zinc-500">
          {channelsInUse > 0 ? `${channelsInUse} ${channelsInUse === 1 ? "channel" : "channels"}` : "none"}
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-zinc-800 px-2 pb-2 pt-2">
          <p className="text-[11px] leading-4 text-zinc-500">
            One attribute per channel. If two answer the same question, one is mis-assigned. Three or four channels
            is plenty.
          </p>
          {rows.map((row, index) => {
            const valueCount = current[index].values.length;
            const problems = rowWarnings(index);
            const label = `Attribute ${index + 1}`;
            return (
              <fieldset
                key={index}
                aria-label={label}
                className={cn("min-w-0 space-y-1.5 rounded border p-1.5", rowFlagged(index) ? "border-amber-700/70" : "border-zinc-800")}
              >
                <div className="flex min-w-0 gap-1.5">
                  <Input
                    aria-label={`${label} name`}
                    placeholder="Name, e.g. where"
                    className="h-8 min-w-0 flex-1 text-xs"
                    value={row.name}
                    onChange={(e) => update(index, { name: e.target.value })}
                    onBlur={() => commit()}
                  />
                  <Button type="button" size="sm" variant="ghost" aria-label={`Remove ${label.toLowerCase()}`} onClick={() => remove(index)}>
                    ×
                  </Button>
                </div>
                <select
                  aria-label={`${label} channel`}
                  title={UMTF_CHANNEL_QUESTIONS[row.channel]}
                  className={cn(selectClass, "w-full min-w-0")}
                  value={row.channel}
                  onChange={(e) => update(index, { channel: e.target.value as UmtfChannel }, true)}
                >
                  {UMTF_CHANNELS.map((channel) => (
                    <option key={channel} value={channel}>
                      {UMTF_CHANNEL_LABELS[channel]} · {UMTF_CHANNEL_QUESTIONS[channel]}
                    </option>
                  ))}
                </select>
                <Input
                  aria-label={`${label} values`}
                  placeholder="Value, or several separated by |"
                  className="h-8 text-xs"
                  value={row.values}
                  onChange={(e) => update(index, { values: e.target.value })}
                  onBlur={() => commit()}
                />
                {valueCount > 1 || row.route ? (
                  <div className="space-y-1">
                    <label className="block text-[11px] text-zinc-400" htmlFor={`mp-attribute-route-${index}`}>
                      Will anything ever ask you for all of them?
                    </label>
                    <div className="flex min-w-0 items-center gap-1.5">
                      <select
                        id={`mp-attribute-route-${index}`}
                        aria-label={`${label} route`}
                        className={cn(selectClass, "min-w-0 flex-1")}
                        value={row.route}
                        onChange={(e) => update(index, { route: e.target.value as AttributeRoute | "" }, true)}
                      >
                        <option value="">Choose a route</option>
                        {ATTRIBUTE_ROUTES.map((route) => (
                          <option key={route} value={route}>
                            {ATTRIBUTE_ROUTE_LABELS[route]}
                          </option>
                        ))}
                      </select>
                      {row.route === "enumerate" ? (
                        <Input
                          aria-label={`${label} count`}
                          type="number"
                          min={1}
                          placeholder="Count"
                          className="h-8 w-16 text-xs"
                          value={row.count}
                          onChange={(e) => update(index, { count: e.target.value })}
                          onBlur={() => commit()}
                        />
                      ) : null}
                    </div>
                    {row.route ? <p className="text-[10px] leading-4 text-zinc-500">{ATTRIBUTE_ROUTE_HINTS[row.route]}</p> : null}
                    {row.route === "dissolve" && valueCount > 1 && palaceId ? (
                      <Button type="button" size="sm" variant="secondary" onClick={() => split(index)}>
                        Split into {valueCount} separate nodes
                      </Button>
                    ) : null}
                  </div>
                ) : null}
                {problems.map((warning) => (
                  <p key={warning.kind} data-testid="attribute-warning" className="text-[11px] leading-4 text-amber-300">
                    {warning.message}
                  </p>
                ))}
              </fieldset>
            );
          })}
          {budget ? (
            <p data-testid="attribute-warning" className="text-[11px] leading-4 text-amber-300">
              {budget.message}
            </p>
          ) : null}
          <Button type="button" size="sm" variant="secondary" onClick={add}>
            Add attribute
          </Button>
        </div>
      ) : (
        <div className="border-t border-zinc-800 px-2 py-1.5">
          <Button type="button" size="sm" variant="ghost" onClick={add}>
            Add attribute
          </Button>
        </div>
      )}
    </section>
  );
}
