import { describe, expect, it } from "vitest";
import { IDLE_CAP_MS, readClock, setClockHidden, startClock, tickClock } from "./activeClock";

const S = 1000;

describe("active clock", () => {
  it("counts steady input in full", () => {
    let clock = startClock(0);
    clock = tickClock(clock, 8 * S);
    clock = tickClock(clock, 11 * S);
    expect(readClock(clock, 16 * S)).toEqual({ activeMs: 16 * S, wallMs: 16 * S });
  });

  it("counts a long pause as the cap, not its length", () => {
    let clock = startClock(0);
    clock = tickClock(clock, 8 * S);
    clock = tickClock(clock, 8 * S + 3 * 60 * S);
    expect(readClock(clock, 8 * S + 3 * 60 * S + 5 * S)).toEqual({
      activeMs: 8 * S + IDLE_CAP_MS + 5 * S,
      wallMs: 8 * S + 3 * 60 * S + 5 * S,
    });
  });

  it("caps the tail after the last input too", () => {
    expect(readClock(startClock(0), 60 * 60 * S).activeMs).toBe(IDLE_CAP_MS);
  });

  it("adds nothing while the app is hidden", () => {
    let clock = startClock(0);
    clock = tickClock(clock, 10 * S);
    clock = setClockHidden(clock, true, 20 * S);
    clock = tickClock(clock, 30 * 60 * S); // input while hidden does not count
    clock = setClockHidden(clock, false, 60 * 60 * S);
    expect(readClock(clock, 60 * 60 * S + 4 * S).activeMs).toBe(24 * S);
  });

  it("starts paused when the app is hidden at the start", () => {
    let clock = startClock(0, true);
    clock = setClockHidden(clock, false, 10 * 60 * S);
    expect(readClock(clock, 10 * 60 * S + 3 * S).activeMs).toBe(3 * S);
  });

  it("reads as unmeasured when the clock runs backwards", () => {
    let clock = startClock(10 * S);
    clock = tickClock(clock, 5 * S);
    expect(readClock(clock, 20 * S).activeMs).toBeNull();
    expect(readClock(startClock(10 * S), 5 * S).activeMs).toBeNull();
  });
});
