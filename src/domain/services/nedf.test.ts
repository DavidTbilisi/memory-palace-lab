import { describe, expect, it } from "vitest";
import type { Locus, NedfEncoding } from "../entities/types";
import {
  decodeSlotSchedules,
  dueStopCards,
  filledNedfSlots,
  isNedfEncoded,
  nedfCardText,
  normalizeNedf,
  rateStopCard,
  stopCards,
  stopNextReviewAt,
  unencodedNedfSlots,
  walkCardFor,
} from "./nedf";
import { decodeStopSettings, encodeStopSettings } from "./routeSettings";

const NOW = "2026-09-25T12:00:00.000Z";
const DAY = 24 * 60 * 60 * 1000;
const at = (days: number) => new Date(Date.parse(NOW) + days * DAY).toISOString();

const full: NedfEncoding = {
  nameHook: "Bouncer Frisks Slowly",
  essence: "Explores a graph layer by layer with a FIFO queue",
  distinguisher: { prompt: "Why a queue and not a stack?", reason: "FIFO gives layer order; a stack dives deep" },
  failure: { scenario: "Search used a stack and went depth-first", correction: "BFS needs a queue" },
};

const locus = (extra: Partial<Locus> = {}): Locus => ({
  id: "l1",
  routeId: "r1",
  nodeId: "n1",
  orderIndex: 0,
  label: "",
  interval: 6,
  easeFactor: 2.5,
  repetitions: 2,
  nextReviewAt: at(3),
  lastReviewedAt: at(-3),
  ...extra,
});

describe("NEDF encoding", () => {
  it("trims slots, drops empty ones, and reads nothing as null", () => {
    expect(normalizeNedf({ nameHook: "  Hook ", essence: "   ", failure: { scenario: " s ", correction: "" } })).toEqual({
      nameHook: "Hook",
      failure: { scenario: "s", correction: "" },
    });
    expect(normalizeNedf({ essence: "" })).toBeNull();
    expect(normalizeNedf("nope")).toBeNull();
    expect(normalizeNedf(null)).toBeNull();
  });

  it("counts a pair as filled only with both halves", () => {
    const partial: NedfEncoding = { nameHook: "Hook", essence: "Does", distinguisher: { prompt: "Which?", reason: "" } };
    expect(filledNedfSlots(partial)).toEqual(["nameHook", "essence"]);
    expect(unencodedNedfSlots(partial)).toEqual(["distinguisher", "failure"]);
    expect(isNedfEncoded(partial)).toBe(true);
    expect(isNedfEncoded({ distinguisher: { prompt: "Which?", reason: "" } })).toBe(false);
    expect(filledNedfSlots(full)).toEqual(["nameHook", "essence", "distinguisher", "failure"]);
  });
});

describe("stop cards", () => {
  it("keeps a stop without NEDF slots on its single schedule", () => {
    expect(stopCards(locus(), null, NOW)).toEqual([
      { slot: null, schedule: { interval: 6, easeFactor: 2.5, repetitions: 2, nextReviewAt: at(3), lastReviewedAt: at(-3) } },
    ]);
  });

  it("gives each filled slot a card, and only filled slots", () => {
    const cards = stopCards(locus(), { nameHook: "Hook", essence: "Does" }, NOW);
    expect(cards.map((card) => card.slot)).toEqual(["nameHook", "essence"]);
    // Never rated, so both start from the stop's own schedule and keep its history.
    expect(cards.every((card) => card.schedule.interval === 6 && card.schedule.nextReviewAt === at(3))).toBe(true);
  });

  it("schedules each slot independently, so a slot you keep failing comes due more often", () => {
    let stop = locus({ nextReviewAt: at(-1) });
    for (let day = 0; day < 4; day++) {
      stop = rateStopCard(stop, "failure", "again", at(day));
      stop = rateStopCard(stop, "essence", "good", at(day));
    }
    const failure = stop.slotSchedules!.failure!;
    const essence = stop.slotSchedules!.essence!;
    expect(failure.repetitions).toBe(0);
    expect(failure.interval).toBe(1);
    expect(essence.interval).toBeGreaterThan(failure.interval);
    expect(Date.parse(essence.nextReviewAt)).toBeGreaterThan(Date.parse(failure.nextReviewAt));
    // The siblings and the stop's own schedule are untouched.
    expect(stop.slotSchedules!.nameHook).toBeUndefined();
    expect(stop).toMatchObject({ interval: 6, repetitions: 2, nextReviewAt: at(-1) });
  });

  it("rates a stop without slots on its own schedule, as before", () => {
    const rated = rateStopCard(locus(), null, "good", NOW);
    expect(rated.repetitions).toBe(3);
    expect(rated.slotSchedules).toBeUndefined();
  });

  it("asks the most overdue card on a walk, or the soonest when nothing is due", () => {
    const stop = locus({
      slotSchedules: {
        nameHook: { interval: 1, easeFactor: 2.5, repetitions: 1, nextReviewAt: at(-1), lastReviewedAt: at(-2) },
        essence: { interval: 1, easeFactor: 2.5, repetitions: 1, nextReviewAt: at(-4), lastReviewedAt: at(-5) },
        distinguisher: { interval: 9, easeFactor: 2.5, repetitions: 3, nextReviewAt: at(9), lastReviewedAt: at(0) },
      },
    });
    // Failure has no entry of its own, so it follows the stop's schedule (due in 3 days).
    expect(dueStopCards(stop, full, NOW).map((card) => card.slot)).toEqual(["essence", "nameHook"]);
    expect(walkCardFor(stop, full, NOW).slot).toBe("essence");
    expect(stopNextReviewAt(stop, full, NOW)).toBe(at(-4));

    const later = { distinguisher: full.distinguisher, failure: full.failure };
    expect(dueStopCards(stop, later, NOW)).toEqual([]);
    expect(walkCardFor(stop, later, NOW).slot).toBe("failure");
  });

  it("ignores the schedule of a slot that was emptied", () => {
    const stop = locus({
      slotSchedules: {
        essence: { interval: 1, easeFactor: 2.5, repetitions: 0, nextReviewAt: at(-4), lastReviewedAt: null },
      },
    });
    expect(dueStopCards(stop, { nameHook: "Hook" }, NOW)).toEqual([]);
  });
});

describe("slot schedule storage", () => {
  const schedule = { interval: 6, easeFactor: 2.36, repetitions: 2, nextReviewAt: at(6), lastReviewedAt: NOW };

  it("round-trips through the stop settings JSON next to a view and section", () => {
    const view = { x: 0, y: 0, w: 100, h: 50 };
    const json = encodeStopSettings({ view, section: "Hall", slotSchedules: { failure: schedule } });
    expect(JSON.parse(json)).toEqual({ view, section: "Hall", slotSchedules: { failure: schedule } });
    expect(decodeStopSettings(json)).toEqual({ view, section: "Hall", slotSchedules: { failure: schedule } });
    expect(encodeStopSettings({ slotSchedules: {} })).toBe("{}");
  });

  it("drops unknown slots and malformed schedules", () => {
    expect(
      decodeSlotSchedules({
        essence: schedule,
        bogus: schedule,
        failure: { ...schedule, nextReviewAt: "soon" },
        nameHook: { ...schedule, interval: "6" },
      }),
    ).toEqual({ essence: schedule });
    expect(decodeSlotSchedules("x")).toBeUndefined();
    expect(decodeStopSettings('{"slotSchedules":[1,2]}')).toEqual({});
  });
});

describe("card text", () => {
  it("asks each slot's own question and names the concept in every answer", () => {
    expect(nedfCardText("nameHook", full, "BFS")).toEqual({
      cue: "Bouncer Frisks Slowly",
      prompt: expect.stringMatching(/^Recognition/),
      answer:
        "BFS · Explores a graph layer by layer with a FIFO queue · Not to confuse: FIFO gives layer order; a stack dives deep · Watch for: BFS needs a queue",
    });
    expect(nedfCardText("essence", full, "BFS")).toMatchObject({
      cue: full.essence,
      prompt: expect.stringMatching(/^Recall/),
      answer: "BFS · Bouncer Frisks Slowly",
    });
    expect(nedfCardText("distinguisher", full, "BFS")).toMatchObject({
      cue: "Why a queue and not a stack?",
      prompt: expect.stringMatching(/^Discrimination/),
      answer: "BFS, because FIFO gives layer order; a stack dives deep",
    });
    expect(nedfCardText("failure", full, "BFS")).toMatchObject({
      cue: "Search used a stack and went depth-first",
      prompt: expect.stringMatching(/^Diagnosis/),
      answer: "BFS: BFS needs a queue",
    });
  });

  it("leaves unfilled slots out of the recognition answer", () => {
    expect(nedfCardText("nameHook", { nameHook: "Mute-X" }, "Mutex").answer).toBe("Mutex");
  });
});
