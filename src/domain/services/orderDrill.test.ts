import { describe, expect, it } from "vitest";
import type { Locus } from "../entities/types";
import {
  drillRun,
  eventToDateCard,
  isInDateOrder,
  misplacedEvents,
  pullEventsForward,
  shuffleForDrill,
  weakestEventIndex,
} from "./orderDrill";
import { parseTimelineDate, type DatedEvent } from "./timeline";

const NOW = "2026-11-04T12:00:00.000Z";
const DAY = 24 * 60 * 60 * 1000;
const at = (days: number) => new Date(Date.parse(NOW) + days * DAY).toISOString();
const event = (nodeId: string, date: string): DatedEvent => ({ nodeId, date: parseTimelineDate(date)! });
const stop = (nodeId: string, extra: Partial<Locus> = {}): Locus => ({
  id: `l-${nodeId}`,
  routeId: "r1",
  nodeId,
  orderIndex: 0,
  label: "",
  interval: 6,
  easeFactor: 2.5,
  repetitions: 2,
  nextReviewAt: at(3),
  lastReviewedAt: at(-3),
  ...extra,
});

describe("misplacedEvents", () => {
  it("marks the events not where date order allows", () => {
    expect(misplacedEvents([event("a", "1872"), event("b", "1894"), event("c", "1901")])).toEqual([]);
    expect(misplacedEvents([event("b", "1894"), event("a", "1872"), event("c", "1901")])).toEqual(["b", "a"]);
  });

  it("accepts events on the same date in either order", () => {
    const answer = [event("y", "1913"), event("x", "1913"), event("z", "1922")];
    expect(misplacedEvents(answer)).toEqual([]);
    expect(isInDateOrder(answer)).toBe(true);
    expect(misplacedEvents([event("z", "1922"), event("x", "1913"), event("y", "1913")])).toEqual(["z", "y"]);
  });
});

describe("drillRun", () => {
  const events = ["a", "b", "c", "d", "e", "f", "g", "h"];

  it("takes five neighbours centred on the weakest, kept inside the timeline", () => {
    expect(drillRun(events, 4)).toEqual(["c", "d", "e", "f", "g"]);
    expect(drillRun(events, 0)).toEqual(["a", "b", "c", "d", "e"]);
    expect(drillRun(events, 7)).toEqual(["d", "e", "f", "g", "h"]);
    expect(drillRun(["a", "b", "c"], 1)).toEqual(["a", "b", "c"]);
  });
});

describe("weakestEventIndex", () => {
  const events = [event("a", "1872"), event("b", "1894"), event("c", "1901")];

  it("picks the most overdue Event → date card", () => {
    const stops = new Map([
      ["a", stop("a", { nextReviewAt: at(-1) })],
      ["b", stop("b", { slotSchedules: { eventToDate: { interval: 1, easeFactor: 2.5, repetitions: 1, nextReviewAt: at(-5), lastReviewedAt: at(-6) } } })],
      ["c", stop("c")],
    ]);
    expect(weakestEventIndex(events, (id) => stops.get(id), NOW)).toBe(1);
  });

  it("falls back to the lowest ease when nothing is overdue, and counts an event without a stop weakest", () => {
    const stops = new Map([["a", stop("a")], ["b", stop("b")], ["c", stop("c", { easeFactor: 1.6 })]]);
    expect(weakestEventIndex(events, (id) => stops.get(id), NOW)).toBe(2);
    stops.delete("a");
    expect(weakestEventIndex(events, (id) => stops.get(id), NOW)).toBe(0);
    expect(weakestEventIndex([], () => undefined, NOW)).toBeNull();
  });
});

describe("shuffleForDrill", () => {
  const run = [event("a", "1872"), event("b", "1894"), event("c", "1901")];

  it("never hands back the right order", () => {
    for (let seed = 0; seed < 10; seed++) {
      let n = seed;
      const random = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
      expect(isInDateOrder(shuffleForDrill(run, isInDateOrder, random))).toBe(false);
    }
    // Even a random source that never moves anything.
    expect(isInDateOrder(shuffleForDrill(run, isInDateOrder, () => 0.999))).toBe(false);
  });

  it("returns events that cannot be out of order as they are", () => {
    const same = [event("a", "1913"), event("b", "1913")];
    expect(shuffleForDrill(same, isInDateOrder).map((e) => e.nodeId).sort()).toEqual(["a", "b"]);
  });
});

describe("pullEventsForward", () => {
  it("brings only the Event → date card due now, only forward, and only on routes in review", () => {
    const loci = [stop("a"), stop("b", { routeId: "draft" }), stop("c", { nextReviewAt: at(-2) })];
    const routes = [{ id: "r1" }, { id: "draft", inReview: false }];
    const { loci: next, pulledLocusIds } = pullEventsForward(loci, routes, ["a", "b", "c"], NOW);
    expect(pulledLocusIds).toEqual(["l-a"]);
    expect(next[0]!.slotSchedules?.eventToDate).toMatchObject({ nextReviewAt: NOW, interval: 6, easeFactor: 2.5 });
    expect(next[0]!.nextReviewAt).toBe(at(3));
    expect(next[1]).toBe(loci[1]);
    expect(next[2]).toBe(loci[2]);
    expect(eventToDateCard(next[0]!, NOW).schedule.nextReviewAt).toBe(NOW);
  });
});
