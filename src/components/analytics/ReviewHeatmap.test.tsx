import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { HeatmapCell } from "../../domain/services/reviewMetrics";
import { ReviewHeatmap } from "./ReviewHeatmap";

function cell(dayKey: string, count: number, isToday = false): HeatmapCell {
  return { dayKey, count, routeCount: count > 0 ? 1 : 0, isToday };
}

describe("ReviewHeatmap", () => {
  it("shows an empty state with a Start reviewing action when all cells are zero", () => {
    render(<ReviewHeatmap cells={[cell("2026-05-01", 0), cell("2026-05-02", 0)]} />);
    expect(screen.getByText(/review history will appear here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start reviewing/i })).toBeInTheDocument();
  });

  it("renders a button per day cell when there is review activity", () => {
    render(<ReviewHeatmap cells={[cell("2026-05-01", 5), cell("2026-05-02", 0)]} />);
    expect(screen.getByLabelText("2026-05-01: 5 reviewed")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-05-02: 0 reviewed")).toBeInTheDocument();
  });

  it("updates the hover caption when a cell is hovered", async () => {
    const user = userEvent.setup();
    render(<ReviewHeatmap cells={[cell("2026-05-01", 5)]} />);
    expect(screen.getByText(/Hover a day to inspect/i)).toBeInTheDocument();
    await user.hover(screen.getByLabelText("2026-05-01: 5 reviewed"));
    expect(screen.getByText(/5 loci reviewed across 1 routes/i)).toBeInTheDocument();
  });
});
