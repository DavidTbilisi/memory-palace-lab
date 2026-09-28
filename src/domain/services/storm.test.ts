import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../entities/types";
import {
  bestStormCount,
  clampStormTarget,
  firstReviewAfterSleep,
  isPersonalBest,
  parseWakeTime,
  stormRatePerHour,
} from "./storm";

/** A local time, so the tests hold in any time zone. */
const at = (day: number, hours: number, minutes = 0) => new Date(2026, 8, day, hours, minutes);

describe("firstReviewAfterSleep", () => {
  it("puts an evening encode at wake time the next morning, not 24 hours later", () => {
    expect(firstReviewAfterSleep(at(28, 22, 30), "07:00")).toEqual(at(29, 7));
    expect(firstReviewAfterSleep(at(28, 10), "07:00")).toEqual(at(29, 7));
  });

  it("treats an encode after midnight as part of the night before", () => {
    expect(firstReviewAfterSleep(at(29, 2), "07:00")).toEqual(at(29, 7));
    expect(firstReviewAfterSleep(at(29, 3, 59), "07:00")).toEqual(at(29, 7));
  });

  it("makes an early-morning encode wait for the night ahead", () => {
    expect(firstReviewAfterSleep(at(29, 4), "07:00")).toEqual(at(30, 7));
    expect(firstReviewAfterSleep(at(29, 6, 30), "07:00")).toEqual(at(30, 7));
  });

  it("follows the learner's wake time, and falls back to 07:00 for a bad one", () => {
    expect(firstReviewAfterSleep(at(28, 23), "05:45")).toEqual(at(29, 5, 45));
    expect(firstReviewAfterSleep(at(29, 1), "09:30")).toEqual(at(29, 9, 30));
    expect(firstReviewAfterSleep(at(28, 23), "25:00")).toEqual(at(29, 7));
  });

  it("crosses a month end", () => {
    expect(firstReviewAfterSleep(at(30, 21), "07:00")).toEqual(new Date(2026, 9, 1, 7));
  });
});

describe("storm helpers", () => {
  it("parses 24-hour wake times only", () => {
    expect(parseWakeTime("07:00")).toEqual({ hours: 7, minutes: 0 });
    expect(parseWakeTime("7:05")).toEqual({ hours: 7, minutes: 5 });
    expect(parseWakeTime("24:00")).toBeNull();
    expect(parseWakeTime("7am")).toBeNull();
  });

  it("clamps a target to a whole number from 1 to 5000", () => {
    expect([0, 12.6, 9000, Number.NaN].map(clampStormTarget)).toEqual([1, 13, 5000, 100]);
  });

  it("gives a rate per hour of active time, and none without it", () => {
    expect(stormRatePerHour(50, 30 * 60_000)).toBe(100);
    expect(stormRatePerHour(7, 40 * 60_000)).toBe(10.5);
    expect(stormRatePerHour(5, null)).toBeNull();
    expect(stormRatePerHour(5, 0)).toBeNull();
  });

  it("finds the best recorded count and marks a new best only when it is beaten", () => {
    const event = (eventType: string, payloadJson: string) => ({ eventType, payloadJson }) as AnalyticsEvent;
    const events = [
      event("storm_completed", '{"count":40}'),
      event("storm_completed", '{"count":120}'),
      event("walk_recall_rated", '{"count":999}'),
      event("storm_completed", "not json"),
    ];
    expect(bestStormCount(events)).toBe(120);
    expect(bestStormCount([])).toBe(0);
    expect(isPersonalBest(121, 120)).toBe(true);
    expect(isPersonalBest(120, 120)).toBe(false);
    expect(isPersonalBest(0, 0)).toBe(false);
    expect(isPersonalBest(1, 0)).toBe(true);
  });
});
