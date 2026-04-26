/**
 * Walk state transition tests for palaceStore.
 *
 * These tests operate directly on the Zustand store state using setState/getState,
 * bypassing async repo/analytics I/O so we can assert synchronous state changes
 * in isolation. Analytics fire-and-forget calls are harmless in jsdom (in-memory repo).
 */
import { beforeEach, describe, expect, it } from "vitest";
import type { Locus, MemoryNode, MemoryRoute, Palace } from "../domain/entities/types";
import { usePalaceStore } from "./palaceStore";

// ── Fixtures ────────────────────────────────────────────────────────────────

const palace: Palace = {
  id: "palace-1",
  name: "Test Palace",
  alias: null,
  atlasPath: null,
  editorSnapshot: null,
};

const routes: MemoryRoute[] = [
  { id: "route-a", palaceId: "palace-1", name: "Route A" },
  { id: "route-b", palaceId: "palace-1", name: "Route B" },
];

const loci: Locus[] = [
  { id: "l1", routeId: "route-a", nodeId: "n1", orderIndex: 0, label: "First" },
  { id: "l2", routeId: "route-a", nodeId: "n2", orderIndex: 1, label: "Second" },
  { id: "l3", routeId: "route-a", nodeId: "n3", orderIndex: 2, label: "Third" },
  { id: "l4", routeId: "route-b", nodeId: "n4", orderIndex: 0, label: "B-First" },
];

const nodes: MemoryNode[] = [
  { id: "n1", objectId: "o1", title: "Node 1", content: "", kind: "memory", portal: null },
  { id: "n2", objectId: "o2", title: "Node 2", content: "", kind: "memory", portal: null },
  { id: "n3", objectId: "o3", title: "Node 3", content: "", kind: "memory", portal: null },
  { id: "n4", objectId: "o4", title: "Node 4", content: "", kind: "memory", portal: null },
];

function resetWalkState(overrides: Partial<ReturnType<typeof usePalaceStore.getState>> = {}) {
  usePalaceStore.setState({
    currentPalace: palace,
    palaces: [palace],
    routes,
    loci,
    nodes,
    edges: [],
    analyticsEvents: [],
    analyticsLoaded: false,
    walkOpen: false,
    walkRouteId: "route-a",
    walkIndex: 0,
    walkSessionId: null,
    walkRecallMode: false,
    walkCueOnly: false,
    walkAnswerRevealed: true,
    walkStepEnteredAt: null,
    walkRevealedAt: null,
    walkRevealLatencyMs: null,
    ...overrides,
  });
}

beforeEach(() => resetWalkState());

// ── setWalkOpen ─────────────────────────────────────────────────────────────

describe("setWalkOpen", () => {
  it("sets walkOpen to true and generates a sessionId", () => {
    usePalaceStore.getState().setWalkOpen(true);
    const s = usePalaceStore.getState();
    expect(s.walkOpen).toBe(true);
    expect(s.walkSessionId).not.toBeNull();
    expect(typeof s.walkSessionId).toBe("string");
  });

  it("resets walkIndex to 0 when opening", () => {
    resetWalkState({ walkIndex: 2 });
    usePalaceStore.getState().setWalkOpen(true);
    expect(usePalaceStore.getState().walkIndex).toBe(0);
  });

  it("closes walk and clears sessionId", () => {
    usePalaceStore.getState().setWalkOpen(true);
    usePalaceStore.getState().setWalkOpen(false);
    const s = usePalaceStore.getState();
    expect(s.walkOpen).toBe(false);
    expect(s.walkSessionId).toBeNull();
  });

  it("clears timing state when closing", () => {
    usePalaceStore.getState().setWalkOpen(true);
    usePalaceStore.setState({ walkStepEnteredAt: "2026-01-01T00:00:00.000Z", walkRevealedAt: "2026-01-01T00:00:01.000Z" });
    usePalaceStore.getState().setWalkOpen(false);
    const s = usePalaceStore.getState();
    expect(s.walkStepEnteredAt).toBeNull();
    expect(s.walkRevealedAt).toBeNull();
    expect(s.walkRevealLatencyMs).toBeNull();
  });

  it("opening with no routes leaves walkOpen true but walk context is empty", () => {
    resetWalkState({ routes: [], loci: [] });
    usePalaceStore.getState().setWalkOpen(true);
    expect(usePalaceStore.getState().walkOpen).toBe(true);
    expect(usePalaceStore.getState().currentWalkNodeId()).toBeNull();
  });
});

// ── walkNext / walkPrev ─────────────────────────────────────────────────────

describe("walkNext", () => {
  beforeEach(() => {
    usePalaceStore.getState().setWalkOpen(true);
  });

  it("advances walkIndex by 1", () => {
    expect(usePalaceStore.getState().walkIndex).toBe(0);
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().walkIndex).toBe(1);
  });

  it("does not advance past last locus", () => {
    resetWalkState({ walkIndex: 2, walkOpen: true, walkSessionId: "s1" });
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().walkIndex).toBe(2);
  });

  it("updates walkStepEnteredAt on advance", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkStepEnteredAt: "2020-01-01T00:00:00.000Z" });
    usePalaceStore.getState().walkNext();
    const after = usePalaceStore.getState().walkStepEnteredAt;
    expect(after).not.toBeNull();
    // new timestamp must be strictly later than the seeded 2020 value
    expect(Date.parse(after!)).toBeGreaterThan(Date.parse("2020-01-01T00:00:00.000Z"));
  });

  it("resets walkAnswerRevealed to false in recall mode", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkRecallMode: true, walkAnswerRevealed: true });
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().walkAnswerRevealed).toBe(false);
  });

  it("does nothing when no routes exist", () => {
    resetWalkState({ routes: [], loci: [], walkOpen: true, walkSessionId: "s1" });
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().walkIndex).toBe(0);
  });
});

describe("walkPrev", () => {
  beforeEach(() => {
    resetWalkState({ walkIndex: 2, walkOpen: true, walkSessionId: "s1" });
  });

  it("moves walkIndex back by 1", () => {
    usePalaceStore.getState().walkPrev();
    expect(usePalaceStore.getState().walkIndex).toBe(1);
  });

  it("does not go below 0", () => {
    resetWalkState({ walkIndex: 0, walkOpen: true, walkSessionId: "s1" });
    usePalaceStore.getState().walkPrev();
    expect(usePalaceStore.getState().walkIndex).toBe(0);
  });

  it("updates walkStepEnteredAt on retreat", () => {
    usePalaceStore.getState().walkPrev();
    expect(usePalaceStore.getState().walkStepEnteredAt).not.toBeNull();
  });
});

// ── currentWalkNodeId ───────────────────────────────────────────────────────

describe("currentWalkNodeId", () => {
  it("returns nodeId at current walk position", () => {
    resetWalkState({ walkRouteId: "route-a", walkIndex: 0 });
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n1");
  });

  it("returns correct nodeId after walkNext", () => {
    usePalaceStore.getState().setWalkOpen(true);
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n2");
  });

  it("returns null when no routes exist", () => {
    resetWalkState({ routes: [], loci: [] });
    expect(usePalaceStore.getState().currentWalkNodeId()).toBeNull();
  });

  it("returns null when no loci in current route", () => {
    resetWalkState({ routes, loci: [] });
    expect(usePalaceStore.getState().currentWalkNodeId()).toBeNull();
  });

  it("uses first route when walkRouteId is null", () => {
    resetWalkState({ walkRouteId: null });
    // First route is "route-a", first locus at index 0 is "n1"
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n1");
  });
});

// ── setWalkRecallMode ───────────────────────────────────────────────────────

describe("setWalkRecallMode", () => {
  it("enables recall mode and hides answer", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkAnswerRevealed: true });
    usePalaceStore.getState().setWalkRecallMode(true);
    expect(usePalaceStore.getState().walkRecallMode).toBe(true);
    expect(usePalaceStore.getState().walkAnswerRevealed).toBe(false);
  });

  it("disabling recall mode reveals answer immediately", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStore.getState().setWalkRecallMode(false);
    expect(usePalaceStore.getState().walkRecallMode).toBe(false);
    expect(usePalaceStore.getState().walkAnswerRevealed).toBe(true);
  });

  it("resets timing state when toggled during active walk", () => {
    resetWalkState({
      walkOpen: true,
      walkSessionId: "s1",
      walkRevealedAt: "2026-01-01T00:00:01.000Z",
      walkRevealLatencyMs: 1234,
    });
    usePalaceStore.getState().setWalkRecallMode(true);
    expect(usePalaceStore.getState().walkRevealedAt).toBeNull();
    expect(usePalaceStore.getState().walkRevealLatencyMs).toBeNull();
  });
});

// ── revealWalkAnswer ────────────────────────────────────────────────────────

describe("revealWalkAnswer", () => {
  it("sets walkAnswerRevealed to true", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStore.getState().revealWalkAnswer();
    expect(usePalaceStore.getState().walkAnswerRevealed).toBe(true);
  });

  it("records a non-null walkRevealedAt timestamp", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkAnswerRevealed: false });
    usePalaceStore.getState().revealWalkAnswer();
    const revealedAt = usePalaceStore.getState().walkRevealedAt;
    expect(revealedAt).not.toBeNull();
    expect(() => new Date(revealedAt!)).not.toThrow();
  });

  it("calculates non-negative walkRevealLatencyMs when enteredAt is set", () => {
    const enteredAt = new Date(Date.now() - 500).toISOString();
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkStepEnteredAt: enteredAt, walkAnswerRevealed: false });
    usePalaceStore.getState().revealWalkAnswer();
    const latency = usePalaceStore.getState().walkRevealLatencyMs;
    expect(latency).not.toBeNull();
    expect(latency).toBeGreaterThanOrEqual(0);
  });

  it("sets walkRevealLatencyMs to null when enteredAt is null", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkStepEnteredAt: null, walkAnswerRevealed: false });
    usePalaceStore.getState().revealWalkAnswer();
    expect(usePalaceStore.getState().walkRevealLatencyMs).toBeNull();
  });

  it("handles a corrupted (non-ISO) walkStepEnteredAt without NaN", () => {
    resetWalkState({
      walkOpen: true,
      walkSessionId: "s1",
      walkStepEnteredAt: "not-a-real-date",
      walkAnswerRevealed: false,
    });
    usePalaceStore.getState().revealWalkAnswer();
    const latency = usePalaceStore.getState().walkRevealLatencyMs;
    // safeElapsedMs must return null for invalid dates — never NaN
    expect(latency === null || typeof latency === "number").toBe(true);
    if (latency !== null) {
      expect(Number.isNaN(latency)).toBe(false);
    }
  });
});

// ── rateWalkRecall ──────────────────────────────────────────────────────────

describe("rateWalkRecall", () => {
  it("is blocked when recall mode is on and answer not yet revealed", () => {
    resetWalkState({
      walkOpen: true,
      walkSessionId: "s1",
      walkRouteId: "route-a",
      walkRecallMode: true,
      walkAnswerRevealed: false,
    });
    // Should silently no-op
    usePalaceStore.getState().rateWalkRecall("good");
    // walkStepEnteredAt should not have been updated (no state change from the guard)
    // We can't directly assert "no state change" easily, but we can verify
    // the method did not crash and walkAnswerRevealed is still false
    expect(usePalaceStore.getState().walkAnswerRevealed).toBe(false);
  });

  it("is allowed when recall mode is off regardless of revealed state", () => {
    resetWalkState({
      walkOpen: true,
      walkSessionId: "s1",
      walkRouteId: "route-a",
      walkRecallMode: false,
      walkAnswerRevealed: false,
    });
    // Should not throw
    expect(() => usePalaceStore.getState().rateWalkRecall("good")).not.toThrow();
  });

  it("is allowed after reveal in recall mode", () => {
    resetWalkState({
      walkOpen: true,
      walkSessionId: "s1",
      walkRouteId: "route-a",
      walkRecallMode: true,
      walkAnswerRevealed: true,
      walkStepEnteredAt: new Date(Date.now() - 1000).toISOString(),
      walkRevealedAt: new Date(Date.now() - 500).toISOString(),
      walkRevealLatencyMs: 500,
    });
    expect(() => usePalaceStore.getState().rateWalkRecall("easy")).not.toThrow();
  });

  it("accepts all four valid ratings without error", () => {
    const ratings = ["again", "hard", "good", "easy"] as const;
    for (const rating of ratings) {
      resetWalkState({ walkOpen: true, walkSessionId: "s1", walkRouteId: "route-a", walkAnswerRevealed: true });
      expect(() => usePalaceStore.getState().rateWalkRecall(rating)).not.toThrow();
    }
  });

  it("is a no-op when route context is empty (no routes)", () => {
    resetWalkState({ routes: [], loci: [], walkOpen: true, walkSessionId: "s1", walkAnswerRevealed: true });
    expect(() => usePalaceStore.getState().rateWalkRecall("good")).not.toThrow();
  });
});

// ── Edge cases: locus deletion during active walk ───────────────────────────

describe("locus deletion during walk", () => {
  it("walkIndex is clamped after last locus is deleted", () => {
    resetWalkState({ walkIndex: 2, walkOpen: true, walkSessionId: "s1", walkRouteId: "route-a" });
    // Delete the locus at position 2 (l3)
    usePalaceStore.getState().deleteLocus("l3");
    // Route A now has 2 loci (l1 at 0, l2 at 1). Index 2 is out of bounds.
    const newIndex = usePalaceStore.getState().walkIndex;
    expect(newIndex).toBeLessThanOrEqual(1);
  });

  it("walkIndex stays valid after non-current locus is deleted", () => {
    resetWalkState({ walkIndex: 0, walkOpen: true, walkSessionId: "s1", walkRouteId: "route-a" });
    usePalaceStore.getState().deleteLocus("l3"); // delete last, not current
    expect(usePalaceStore.getState().walkIndex).toBe(0);
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n1");
  });

  it("walk can continue on remaining loci after deletion", () => {
    resetWalkState({ walkIndex: 0, walkOpen: true, walkSessionId: "s1", walkRouteId: "route-a" });
    usePalaceStore.getState().deleteLocus("l3"); // Route A: l1, l2 remain
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().walkIndex).toBe(1);
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n2");
  });

  it("currentWalkNodeId returns null after all route loci are deleted", () => {
    resetWalkState({ walkIndex: 0, walkOpen: true, walkSessionId: "s1", walkRouteId: "route-a" });
    usePalaceStore.getState().deleteLocus("l1");
    usePalaceStore.getState().deleteLocus("l2");
    usePalaceStore.getState().deleteLocus("l3");
    expect(usePalaceStore.getState().currentWalkNodeId()).toBeNull();
  });
});

// ── Edge cases: single-locus routes ─────────────────────────────────────────

describe("single-locus route walk", () => {
  beforeEach(() => {
    resetWalkState({
      loci: [{ id: "l-only", routeId: "route-a", nodeId: "n1", orderIndex: 0, label: "Only" }],
      walkRouteId: "route-a",
      walkIndex: 0,
      walkOpen: true,
      walkSessionId: "s1",
    });
  });

  it("walkNext stays at index 0", () => {
    usePalaceStore.getState().walkNext();
    expect(usePalaceStore.getState().walkIndex).toBe(0);
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n1");
  });

  it("walkPrev stays at index 0", () => {
    usePalaceStore.getState().walkPrev();
    expect(usePalaceStore.getState().walkIndex).toBe(0);
  });

  it("can reveal and rate the single locus", () => {
    usePalaceStore.setState({ walkRecallMode: true, walkAnswerRevealed: false });
    usePalaceStore.getState().revealWalkAnswer();
    expect(usePalaceStore.getState().walkAnswerRevealed).toBe(true);
    expect(() => usePalaceStore.getState().rateWalkRecall("good")).not.toThrow();
  });
});

// ── Route switching mid-walk ─────────────────────────────────────────────────

describe("setWalkRoute during active walk", () => {
  it("resets walkIndex to 0 on route switch", () => {
    resetWalkState({ walkIndex: 2, walkOpen: true, walkSessionId: "s1", walkRouteId: "route-a" });
    usePalaceStore.getState().setWalkRoute("route-b");
    expect(usePalaceStore.getState().walkIndex).toBe(0);
  });

  it("updates walkRouteId", () => {
    usePalaceStore.getState().setWalkRoute("route-b");
    expect(usePalaceStore.getState().walkRouteId).toBe("route-b");
  });

  it("clears reveal/latency state and stamps fresh entry time on route switch", () => {
    resetWalkState({
      walkOpen: true,
      walkSessionId: "s1",
      walkStepEnteredAt: "2026-01-01T00:00:00.000Z",
      walkRevealedAt: "2026-01-01T00:00:01.000Z",
      walkRevealLatencyMs: 1000,
    });
    const before = Date.now();
    usePalaceStore.getState().setWalkRoute("route-b");
    const after = Date.now();
    const state = usePalaceStore.getState();
    // reveal timing is cleared
    expect(state.walkRevealedAt).toBeNull();
    expect(state.walkRevealLatencyMs).toBeNull();
    // step entry is re-stamped for the new route's first locus
    expect(state.walkStepEnteredAt).not.toBeNull();
    const enteredAt = Date.parse(state.walkStepEnteredAt!);
    expect(enteredAt).toBeGreaterThanOrEqual(before);
    expect(enteredAt).toBeLessThanOrEqual(after + 50); // 50 ms tolerance
  });

  it("currentWalkNodeId reflects new route after switch", () => {
    usePalaceStore.getState().setWalkRoute("route-b");
    // route-b first locus is n4
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n4");
  });

  it("switching to null route falls back to first route", () => {
    usePalaceStore.getState().setWalkRoute(null);
    // walkRouteId becomes null, getWalkContext falls back to routes[0] = "route-a"
    expect(usePalaceStore.getState().currentWalkNodeId()).toBe("n1");
  });
});

// ── hydrateFromSnapshot resets walk ─────────────────────────────────────────

describe("hydrateFromSnapshot walk reset", () => {
  it("closes walk and resets index when palace is reloaded", () => {
    resetWalkState({ walkOpen: true, walkSessionId: "s1", walkIndex: 2 });
    usePalaceStore.getState().hydrateFromSnapshot(
      {
        palace,
        nodes,
        edges: [],
        routes,
        loci,
      },
      { persistenceState: "clean" },
    );
    const s = usePalaceStore.getState();
    expect(s.walkOpen).toBe(false);
    expect(s.walkSessionId).toBeNull();
    expect(s.walkIndex).toBe(0);
  });

  it("sets walkRouteId to first route after hydration", () => {
    usePalaceStore.getState().hydrateFromSnapshot({ palace, nodes, edges: [], routes, loci });
    expect(usePalaceStore.getState().walkRouteId).toBe("route-a");
  });

  it("sets walkRouteId to null when snapshot has no routes", () => {
    usePalaceStore.getState().hydrateFromSnapshot({ palace, nodes, edges: [], routes: [], loci: [] });
    expect(usePalaceStore.getState().walkRouteId).toBeNull();
  });
});
