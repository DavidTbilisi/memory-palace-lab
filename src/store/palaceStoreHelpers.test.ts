import { afterEach, describe, expect, it } from "vitest";
import type { Locus } from "../domain/entities/types";
import {
  DAILY_REVIEW_GOAL_STORAGE_KEY,
  DEFAULT_DAILY_REVIEW_GOAL,
  EMPTY_WALK_RATINGS,
  RECALL_RATING_VALUES,
  loadDailyReviewGoal,
  normalizeLoci,
  safeElapsedMs,
} from "./palaceStoreHelpers";

afterEach(() => {
  window.localStorage.clear();
});

describe("safeElapsedMs", () => {
  it("returns null for missing or invalid timestamps", () => {
    expect(safeElapsedMs(null, Date.now())).toBeNull();
    expect(safeElapsedMs("not-a-date", Date.now())).toBeNull();
  });

  it("returns elapsed milliseconds, clamped at zero", () => {
    const now = Date.parse("2026-05-28T00:00:10.000Z");
    expect(safeElapsedMs("2026-05-28T00:00:00.000Z", now)).toBe(10_000);
    // future timestamp clamps to 0
    expect(safeElapsedMs("2026-05-28T00:00:20.000Z", now)).toBe(0);
  });
});

describe("rating constants", () => {
  it("maps ratings to ascending values and starts counts at zero", () => {
    expect(RECALL_RATING_VALUES).toEqual({ again: 1, hard: 2, good: 3, easy: 4 });
    expect(EMPTY_WALK_RATINGS).toEqual({ again: 0, hard: 0, good: 0, easy: 0 });
  });
});

describe("normalizeLoci", () => {
  it("normalizes each locus's schedule against a shared now", () => {
    const loci = [
      { id: "a", routeId: "r", nodeId: "n", orderIndex: 0, label: "" },
      { id: "b", routeId: "r", nodeId: "m", orderIndex: 1, label: "" },
    ] as Locus[];
    const result = normalizeLoci(loci, "2026-05-28T00:00:00.000Z");
    expect(result).toHaveLength(2);
    for (const locus of result) {
      expect(locus.nextReviewAt).toBeTruthy();
      expect(typeof locus.interval).toBe("number");
    }
  });
});

describe("loadDailyReviewGoal", () => {
  it("defaults when unset", () => {
    expect(loadDailyReviewGoal()).toBe(DEFAULT_DAILY_REVIEW_GOAL);
  });

  it("reads and clamps a stored value to [1, 200]", () => {
    window.localStorage.setItem(DAILY_REVIEW_GOAL_STORAGE_KEY, "25");
    expect(loadDailyReviewGoal()).toBe(25);
    window.localStorage.setItem(DAILY_REVIEW_GOAL_STORAGE_KEY, "9999");
    expect(loadDailyReviewGoal()).toBe(200);
    window.localStorage.setItem(DAILY_REVIEW_GOAL_STORAGE_KEY, "0");
    expect(loadDailyReviewGoal()).toBe(1);
  });

  it("falls back on non-numeric input", () => {
    window.localStorage.setItem(DAILY_REVIEW_GOAL_STORAGE_KEY, "abc");
    expect(loadDailyReviewGoal()).toBe(DEFAULT_DAILY_REVIEW_GOAL);
  });
});
