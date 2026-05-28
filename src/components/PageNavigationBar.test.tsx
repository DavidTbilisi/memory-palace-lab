import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageNavigationBar } from "./PageNavigationBar";

const noop = () => undefined;

describe("PageNavigationBar", () => {
  it("renders all seven page tabs", () => {
    render(<PageNavigationBar currentPage="graph" onNavigate={noop} onHoverHintChange={noop} />);
    for (const label of ["Graph", "Review", "Insights", "System", "Atlas", "Routes", "Help"]) {
      expect(screen.getByRole("button", { name: new RegExp(label) })).toBeInTheDocument();
    }
  });

  it("calls onNavigate with the page key when a tab is clicked", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<PageNavigationBar currentPage="graph" onNavigate={onNavigate} onHoverHintChange={noop} />);
    await user.click(screen.getByRole("button", { name: /Insights/ }));
    expect(onNavigate).toHaveBeenCalledWith("insights");
  });

  it("publishes a hover hint on enter and clears it on leave", async () => {
    const onHoverHintChange = vi.fn();
    const user = userEvent.setup();
    render(<PageNavigationBar currentPage="graph" onNavigate={noop} onHoverHintChange={onHoverHintChange} />);
    const reviewTab = screen.getByRole("button", { name: /Review/ });
    await user.hover(reviewTab);
    expect(onHoverHintChange).toHaveBeenLastCalledWith(expect.stringContaining("Review -"));
    await user.unhover(reviewTab);
    expect(onHoverHintChange).toHaveBeenLastCalledWith(null);
  });
});
