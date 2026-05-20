import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AssessBanner } from "./AssessBanner";

const baseProps = {
  palaceName: "OOP",
  sourcePalaceName: "DistributedSystems",
  score: 0.74,
  takeaway: "CAP → hub-spoke, not cascade",
  adjustment: "Surface bottlenecks first",
  onJump: () => undefined,
  onDismiss: () => undefined,
};

describe("AssessBanner", () => {
  it("AssessBanner renders takeaway, source palace, and rounded score", () => {
    render(<AssessBanner {...baseProps} />);
    expect(screen.getByText(/CAP → hub-spoke/)).toBeInTheDocument();
    expect(screen.getByText(/DistributedSystems/)).toBeInTheDocument();
    expect(screen.getByText(/74%/)).toBeInTheDocument();
  });

  it("AssessBanner Jump button fires onJump", async () => {
    const onJump = vi.fn();
    const user = userEvent.setup();
    render(<AssessBanner {...baseProps} onJump={onJump} />);
    await user.click(screen.getByRole("button", { name: /Jump to source/i }));
    expect(onJump).toHaveBeenCalledTimes(1);
  });

  it("AssessBanner dismiss button fires onDismiss", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<AssessBanner {...baseProps} onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: /Dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("AssessBanner renders without adjustment when not provided", () => {
    render(<AssessBanner {...baseProps} adjustment={undefined} />);
    expect(screen.queryByText(/Next time:/i)).toBeNull();
  });
});
