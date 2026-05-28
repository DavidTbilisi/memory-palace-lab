import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DailyReviewPoint } from "../../domain/services/reviewMetrics";
import { RetentionChart } from "./RetentionChart";

function point(dayKey: string, averageScorePct: number): DailyReviewPoint {
  return { dayKey, date: `${dayKey}T00:00:00`, count: 3, averageScorePct, routeCount: 1 };
}

describe("RetentionChart", () => {
  it("shows an empty state when there are no points", () => {
    render(<RetentionChart series={[]} trendDown={false} />);
    expect(screen.getByText(/Review some loci/i)).toBeInTheDocument();
  });

  it("renders one data point circle per series entry", () => {
    const { container } = render(
      <RetentionChart series={[point("2026-05-01", 90), point("2026-05-02", 80)]} trendDown={false} />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(2);
  });

  it("shows the trend-down warning only when trendDown is true", () => {
    const series = [point("2026-05-01", 90)];
    const { rerender } = render(<RetentionChart series={series} trendDown={false} />);
    expect(screen.queryByText(/trending down/i)).not.toBeInTheDocument();
    rerender(<RetentionChart series={series} trendDown={true} />);
    expect(screen.getByText(/trending down/i)).toBeInTheDocument();
  });
});
