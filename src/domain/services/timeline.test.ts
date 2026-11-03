import { describe, expect, it } from "vitest";
import {
  NO_ERA_SECTION,
  TIMELINE_NODE_SIZE,
  dateImagePlaceholder,
  eraAt,
  eraSections,
  layoutTimeline,
  orderEvents,
  parseTimelineDate,
  resolveEras,
  type DatedEvent,
} from "./timeline";

const date = (text: string) => parseTimelineDate(text)!;
const event = (nodeId: string, text: string): DatedEvent => ({ nodeId, date: date(text) });

describe("parseTimelineDate", () => {
  it.each([
    ["1901", "1901", 1901],
    ["  1901 ", "1901", 1901],
    ["1901 CE", "1901", 1901],
    ["AD 33", "33", 33],
    ["1969-07", "1969-07", 1969 + 181 / 365],
    ["1969-07-20", "1969-07-20", 1969 + 200 / 365],
    ["490 BCE", "490 BCE", -489],
    ["490 bc", "490 BCE", -489],
    ["1 BCE", "1 BCE", 0],
  ])("reads %s as %s", (input, label, startKey) => {
    const parsed = date(input);
    expect(parsed.label).toBe(label);
    expect(parsed.end).toBeNull();
    expect(parsed.startKey).toBeCloseTo(startKey, 6);
  });

  it("ends a date at the end of its own unit", () => {
    expect(date("1901").endKey).toBe(1902);
    expect(date("1969-07").endKey).toBeCloseTo(1969 + 212 / 365, 6);
    expect(date("1969-07-20").endKey).toBeCloseTo(1969 + 201 / 365, 6);
    expect(date("2000-02").endKey).toBeCloseTo(2000 + 60 / 366, 6);
  });

  it.each([
    ["1910–1913", "1910–1913"],
    ["1910-1913", "1910–1913"],
    ["1910 - 1913", "1910–1913"],
    ["1910 to 1913", "1910–1913"],
    ["1914-07-28 – 1918-11-11", "1914-07-28–1918-11-11"],
    ["490–479 BCE", "490 BCE–479 BCE"],
  ])("reads the span %s", (input, label) => {
    const parsed = date(input);
    expect(parsed.label).toBe(label);
    expect(parsed.end).not.toBeNull();
    expect(parsed.endKey).toBeGreaterThan(parsed.startKey);
  });

  it("runs a span to the end of its last year", () => {
    expect(date("1910–1913")).toMatchObject({ startKey: 1910, endKey: 1914 });
  });

  it("treats a span from a date to itself as that date", () => {
    expect(date("1913–1913")).toMatchObject({ label: "1913", end: null });
  });

  it.each(["", "soon", "0", "0 BCE", "1969-13", "1969-02-30", "1913–1910", "1-2-3-4", "12345", "1910–1913–1920"])(
    "refuses %j",
    (input) => {
      expect(parseTimelineDate(input)).toBeNull();
    },
  );

  it("accepts 29 February only in a leap year", () => {
    expect(parseTimelineDate("2000-02-29")).not.toBeNull();
    expect(parseTimelineDate("1900-02-29")).toBeNull();
  });

  it("names the date image after the date", () => {
    expect(dateImagePlaceholder(date("1901").label)).toBe("1901 · image");
  });
});

describe("eras", () => {
  const eras = resolveEras([
    { id: "b", name: "Principia years", from: "1900", to: "1913" },
    { id: "a", name: "Youth", from: "1872", to: "1894" },
    { id: "x", name: "Broken", from: "1950", to: "soon" },
  ]);

  it("keeps the eras whose dates read, in axis order, from the start of `from` to the end of `to`", () => {
    expect(eras.map((era) => [era.name, era.startKey, era.endKey])).toEqual([
      ["Youth", 1872, 1895],
      ["Principia years", 1900, 1914],
    ]);
  });

  it("files an event under the era that holds its start", () => {
    expect(eraAt(eras, date("1901").startKey)?.name).toBe("Principia years");
    expect(eraAt(eras, date("1913-12-31").startKey)?.name).toBe("Principia years");
    expect(eraAt(eras, date("1914").startKey)).toBeNull();
  });

  it("starts a section at each era's first stop, and a 'No era' section in the gap after one", () => {
    const keys = ["1870", "1872", "1890", "1897", "1901", "1905", "1918"].map((t) => date(t).startKey);
    expect(eraSections(keys, eras)).toEqual([null, "Youth", null, NO_ERA_SECTION, "Principia years", null, NO_ERA_SECTION]);
  });

  it("names no section without eras", () => {
    expect(eraSections([1, 2, 3], [])).toEqual([null, null, null]);
  });
});

describe("orderEvents", () => {
  it("orders by date, keeps the previous order on the same date, and puts new events last on theirs", () => {
    const events = [event("new", "1913"), event("b", "1913"), event("c", "1872"), event("a", "1913")];
    expect(orderEvents(events, ["c", "a", "b"]).map((e) => e.nodeId)).toEqual(["c", "a", "b", "new"]);
  });
});

describe("layoutTimeline", () => {
  it("places each event's left edge at its date, so wider gaps draw wider", () => {
    const layout = layoutTimeline([event("a", "1872"), event("b", "1894"), event("c", "1901")], []);
    const left = (id: string) => {
      const p = layout.events.find((e) => e.nodeId === id)!;
      return p.event.x - p.event.w / 2;
    };
    expect(left("b") - left("a")).toBeGreaterThan(left("c") - left("b"));
    expect((left("b") - left("a")) / (left("c") - left("b"))).toBeCloseTo(22 / 7, 6);
  });

  it("stacks events on the same date into lanes, the date image above each event", () => {
    const layout = layoutTimeline([event("a", "1913"), event("b", "1913")], []);
    const [a, b] = layout.events;
    expect(a!.event.x).toBe(b!.event.x);
    expect([a!.lane, b!.lane]).toEqual([0, 1]);
    expect(b!.dateImage.y).toBeGreaterThan(a!.event.y + TIMELINE_NODE_SIZE.event.h / 2);
    expect(a!.dateImage.y).toBeLessThan(a!.event.y);
    expect(a!.dateImage.x).toBe(a!.event.x);
  });

  it("returns to the first lane once there is room", () => {
    const layout = layoutTimeline([event("a", "1800"), event("b", "1800"), event("c", "1900")], []);
    expect(layout.events.map((e) => e.lane)).toEqual([0, 1, 0]);
  });

  it("draws a span's bar from its start to its end, and keeps the lane busy until then", () => {
    const layout = layoutTimeline([event("pm", "1910–1913"), event("next", "1912"), event("after", "1950")], []);
    const [pm, next, after] = layout.events;
    expect(pm!.span!.x2 - pm!.span!.x1).toBeCloseTo(4 * layout.pxPerYear, 6);
    expect(next!.lane).toBe(1);
    expect(after!.lane).toBe(0);
    expect(next!.span).toBeNull();
  });

  it("draws eras as bands on the same scale, and ticks at round years", () => {
    const eras = resolveEras([{ id: "e", name: "Principia years", from: "1900", to: "1913" }]);
    const layout = layoutTimeline([event("a", "1872"), event("b", "1970")], eras);
    expect(layout.eras).toHaveLength(1);
    expect(layout.eras[0]!.x2 - layout.eras[0]!.x1).toBeCloseTo(14 * layout.pxPerYear, 6);
    expect(layout.ticks.length).toBeGreaterThan(2);
    expect(layout.ticks.every((t) => Number(t.label) % 10 === 0)).toBe(true);
  });

  it("labels ticks before the common era in BCE", () => {
    const layout = layoutTimeline([event("a", "490 BCE"), event("b", "300")], []);
    const labels = layout.ticks.map((t) => t.label);
    expect(labels.some((label) => label.endsWith("BCE"))).toBe(true);
    expect(labels.some((label) => !label.endsWith("BCE"))).toBe(true);
    const xs = layout.ticks.map((t) => t.x);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
  });

  it("lays out an empty timeline without failing", () => {
    const layout = layoutTimeline([], []);
    expect(layout.events).toEqual([]);
    expect(layout.axis.x2).toBeGreaterThan(layout.axis.x1);
  });
});
