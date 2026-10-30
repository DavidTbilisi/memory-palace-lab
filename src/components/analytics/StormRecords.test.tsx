import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StormRecords } from "./StormRecords";

describe("StormRecords", () => {
  it("shows the best count, the best rate, and recent Storms with their personal bests", () => {
    render(
      <StormRecords
        records={{
          bestCount: 120,
          bestRatePerHour: 160.4,
          storms: [
            { at: "2026-09-27T10:00:00.000Z", routeName: "Storm · 27 Sep", target: 200, count: 80, activeMs: 1_800_000, ratePerHour: 160.4, personalBest: false },
            { at: "2026-09-20T10:00:00.000Z", routeName: "Storm · 20 Sep", target: 100, count: 120, activeMs: 3_600_000, ratePerHour: 120, personalBest: true },
          ],
        }}
      />,
    );
    expect(screen.getByTestId("storm-best-count")).toHaveTextContent("120");
    expect(screen.getByTestId("storm-best-rate")).toHaveTextContent("160/h");
    const rows = within(screen.getByRole("table", { name: "Recent Storms" })).getAllByRole("row").slice(1);
    expect(rows.map((row) => row.textContent)).toEqual(["Storm · 27 Sep80 / 20030:00160/h", "Storm · 20 Sep120 / 1001:00:00120/h"]);
    expect(within(rows[1]!).getByLabelText("Personal best")).toBeInTheDocument();
  });

  it("points to the Review page before the first Storm", () => {
    render(<StormRecords records={{ bestCount: 0, bestRatePerHour: null, storms: [] }} />);
    expect(screen.getByText("No Storms yet. Start one from the Review page.")).toBeInTheDocument();
  });
});
