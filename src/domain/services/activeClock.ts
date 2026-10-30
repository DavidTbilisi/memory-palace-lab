/**
 * Active time for timing an encode: wall-clock time minus the time the learner was away.
 * A gap with no input counts for at most IDLE_CAP_MS, and time with the app hidden counts
 * for nothing. A clock that runs backwards cannot be trusted, so it reads as unmeasured.
 */
export const IDLE_CAP_MS = 60_000;

export type ActiveClock = {
  startedAt: number;
  /** Last input, or the moment the app became visible again. */
  lastAt: number;
  activeMs: number;
  hidden: boolean;
  broken: boolean;
};

export type ClockReading = {
  /** Null when the timing cannot be trusted. */
  activeMs: number | null;
  wallMs: number;
};

export function startClock(now: number, hidden = false): ActiveClock {
  return { startedAt: now, lastAt: now, activeMs: 0, hidden, broken: false };
}

/** Input from the learner: the gap since the last input counts, up to the cap. */
export function tickClock(clock: ActiveClock, now: number, cap = IDLE_CAP_MS): ActiveClock {
  if (clock.broken) return clock;
  if (now < clock.lastAt) return { ...clock, broken: true };
  if (clock.hidden) return clock;
  return { ...clock, lastAt: now, activeMs: clock.activeMs + Math.min(now - clock.lastAt, cap) };
}

/** The app was hidden or shown. Time while hidden adds nothing. */
export function setClockHidden(clock: ActiveClock, hidden: boolean, now: number, cap = IDLE_CAP_MS): ActiveClock {
  if (hidden === clock.hidden) return clock;
  if (hidden) return { ...tickClock(clock, now, cap), hidden: true };
  if (clock.broken) return { ...clock, hidden: false };
  if (now < clock.lastAt) return { ...clock, hidden: false, broken: true };
  return { ...clock, hidden: false, lastAt: now };
}

/** The encode ends now; the tail since the last input counts like any other gap. */
export function readClock(clock: ActiveClock, now: number, cap = IDLE_CAP_MS): ClockReading {
  const final = tickClock(clock, now, cap);
  const wallMs = Math.max(0, now - clock.startedAt);
  return { activeMs: final.broken ? null : Math.round(final.activeMs), wallMs };
}
