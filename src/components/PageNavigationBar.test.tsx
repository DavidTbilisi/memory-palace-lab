import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageNavigationBar } from "./PageNavigationBar";
import { PRIMARY_GROUPS, defaultPageForGroup, pageById, pagesInGroup } from "../app/pages";

const noop = () => undefined;

describe("PageNavigationBar", () => {
  it("renders one primary tab per page group in registry order", () => {
    const { container } = render(<PageNavigationBar currentPage="graph" onNavigate={noop} onHoverHintChange={noop} />);
    const primaries = Array.from(container.querySelectorAll("[data-nav-primary]"));
    expect(primaries.map((button) => button.getAttribute("data-nav-primary"))).toEqual([...PRIMARY_GROUPS]);
    for (const group of PRIMARY_GROUPS) {
      const label = pageById(defaultPageForGroup(group)).groupLabel;
      expect(screen.getByRole("button", { name: new RegExp(`^${label}`) })).toBeInTheDocument();
    }
  });

  it("shows the active group's pages as sub-tabs and navigates through them", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<PageNavigationBar currentPage="graph" onNavigate={onNavigate} onHoverHintChange={noop} />);
    const graphPages = pagesInGroup("graph");
    expect(screen.getAllByRole("tab")).toHaveLength(graphPages.length);
    expect(screen.getByRole("tab", { name: "Canvas" })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Atlas map" }));
    expect(onNavigate).toHaveBeenCalledWith("atlas");
  });

  it("hides sub-tabs for single-page groups and switches groups on click", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<PageNavigationBar currentPage="review" onNavigate={onNavigate} onHoverHintChange={noop} />);
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
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
