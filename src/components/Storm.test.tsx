import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Palace } from "../domain/entities/types";
import { usePalaceStore } from "../store/palaceStore";
import { StormBar, formatStormTime } from "./StormBar";
import { StormStartCard } from "./StormStartCard";
import { StormSummaryModal } from "./StormSummaryModal";

const palace: Palace = { id: "palace-1", name: "Test Palace", alias: null, atlasPath: null, editorSnapshot: null };

beforeEach(() => {
  act(() =>
    usePalaceStore.setState({
      currentPalace: palace,
      routes: [],
      loci: [],
      analyticsEvents: [],
      storm: null,
      stormSummary: null,
      stormTarget: 100,
    }),
  );
});

afterEach(() => {
  act(() => usePalaceStore.getState().stopStorm());
  act(() => usePalaceStore.setState({ stormSummary: null }));
});

describe("StormStartCard", () => {
  it("starts a Storm with a preset target and hands over to the canvas", async () => {
    const user = userEvent.setup();
    const onStarted = vi.fn();
    render(<StormStartCard onStarted={onStarted} />);
    expect(screen.getByLabelText("Target")).toHaveValue(100);
    await user.click(screen.getByRole("button", { name: "400" }));
    await user.click(screen.getByRole("button", { name: "Start Storm" }));
    expect(onStarted).toHaveBeenCalled();
    expect(usePalaceStore.getState().storm).toMatchObject({ target: 400 });
  });

  it("needs an open palace", () => {
    act(() => usePalaceStore.setState({ currentPalace: null }));
    render(<StormStartCard onStarted={() => undefined} />);
    expect(screen.getByRole("button", { name: "Start Storm" })).toBeDisabled();
    expect(screen.getByText("Open a palace first.")).toBeInTheDocument();
  });
});

describe("StormBar", () => {
  it("shows the count against the target and stops the Storm", async () => {
    const user = userEvent.setup();
    act(() => void usePalaceStore.getState().startStorm(5));
    render(<StormBar />);
    expect(screen.getByTestId("storm-count")).toHaveTextContent("0 / 5");
    expect(screen.getByRole("progressbar", { name: "Storm progress" })).toHaveAttribute("aria-valuenow", "0");
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(usePalaceStore.getState().storm).toBeNull();
    expect(usePalaceStore.getState().stormSummary).toMatchObject({ count: 0, endedBy: "stopped" });
  });

  it("formats time as m:ss, or h:mm:ss past an hour", () => {
    expect([0, 65_000, 3_725_000].map(formatStormTime)).toEqual(["0:00", "1:05", "1:02:05"]);
    expect(formatStormTime(null)).toBe("—");
  });
});

describe("StormSummaryModal", () => {
  it("shows the count, a personal best, and when the material is first reviewed", async () => {
    const user = userEvent.setup();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);
    act(() =>
      usePalaceStore.setState({
        stormSummary: {
          stormId: "s",
          routeId: "r",
          routeName: "Storm · 28 Sep",
          target: 100,
          count: 42,
          activeMs: 30 * 60_000,
          wallMs: 35 * 60_000,
          ratePerHour: 84,
          endedBy: "stopped",
          personalBest: true,
          firstReviewAt: tomorrow.toISOString(),
        },
      }),
    );
    render(<StormSummaryModal />);
    expect(screen.getByRole("dialog", { name: "Storm summary" })).toHaveTextContent("Storm ended");
    expect(screen.getByTestId("storm-summary-count")).toHaveTextContent("42 of 100 encoded");
    expect(screen.getByText("Personal best")).toBeInTheDocument();
    expect(screen.getByText("84 per hour")).toBeInTheDocument();
    expect(screen.getByText(/^tomorrow at/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(usePalaceStore.getState().stormSummary).toBeNull();
  });
});
