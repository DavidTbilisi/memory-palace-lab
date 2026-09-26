import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../../domain/entities/types";
import { buildEncodeTrend } from "../../domain/services/encodeSpeed";
import { EncodeSpeedBadge } from "./EncodeSpeedBadge";
import { EncodeSpeedTrend } from "./EncodeSpeedTrend";

const NOW = "2026-09-25T12:00:00.000Z";
const DAY = 24 * 60 * 60 * 1000;
let seq = 0;

function encode(eventType: "node_encoded" | "edge_encoded", activeMs: number, days: number, first = true): AnalyticsEvent {
  return {
    id: `e${seq++}`,
    palaceId: "p1",
    nodeId: "n1",
    eventType,
    eventGroup: "graph",
    createdAt: new Date(Date.parse(NOW) - days * DAY).toISOString(),
    payloadJson: JSON.stringify({ first, activeMs, edgeId: "e1" }),
  };
}

describe("EncodeSpeedTrend", () => {
  it("shows the recent medians and waits for four weeks before charting", () => {
    const trend = buildEncodeTrend([encode("node_encoded", 38_000, 2), encode("node_encoded", 42_000, 10)], NOW);
    render(<EncodeSpeedTrend trend={trend} thresholds={null} />);
    expect(screen.getByTestId("encode-tile-node")).toHaveTextContent("40s");
    expect(screen.getByTestId("encode-tile-node")).toHaveTextContent("median of 2 first encodes");
    expect(screen.getByTestId("encode-tile-edge")).toHaveTextContent("No timed edge encodes yet");
    expect(screen.getByTestId("encode-tile-bands")).toHaveTextContent("Bands appear after 12 timed node encodes");
    expect(screen.getByTestId("encode-trend-waiting")).toHaveTextContent("(10 of 28 days so far)");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("charts nodes and edges with first encodes and re-edits as separate lines", async () => {
    const trend = buildEncodeTrend(
      [
        encode("node_encoded", 90_000, 30),
        encode("node_encoded", 50_000, 2),
        encode("node_encoded", 6_000, 2, false),
        encode("edge_encoded", 12_000, 3),
      ],
      NOW,
    );
    render(<EncodeSpeedTrend trend={trend} thresholds={{ fastMs: 41_000, slowMs: 112_000, samples: 14 }} />);
    expect(screen.getByTestId("encode-tile-bands")).toHaveTextContent("Fast ≤ 41sSlow > 1m 52s");

    const nodes = screen.getByRole("img", { name: /Nodes: median encode time per week/ });
    expect(nodes.querySelectorAll('[data-series="first"] > g')).toHaveLength(2);
    expect(nodes.querySelectorAll('[data-series="reedit"] > g')).toHaveLength(1);
    expect(within(nodes).getByText(/Re-edit: 6s median of 1/)).toBeInTheDocument();
    const edges = screen.getByRole("img", { name: /Edges/ });
    expect(edges.querySelectorAll('[data-series="reedit"] > g')).toHaveLength(0);

    await userEvent.setup().click(screen.getByText("Show as a table"));
    const lastRow = screen.getAllByRole("row").at(-1)!;
    expect(within(lastRow).getAllByRole("cell").map((cell) => cell.textContent)).toEqual([
      expect.any(String),
      "50s",
      "6s",
      "12s",
      "–",
    ]);
  });
});

describe("EncodeSpeedBadge", () => {
  it("names the band in words, and says when there is not enough data for one", () => {
    const { rerender } = render(<EncodeSpeedBadge speed={{ activeMs: 38_000, band: "fast" }} />);
    expect(screen.getByTestId("encode-speed")).toHaveTextContent("38s· Fast");
    rerender(<EncodeSpeedBadge speed={{ activeMs: 38_000, band: null }} />);
    expect(screen.getByTestId("encode-speed")).toHaveTextContent("38s");
    expect(screen.getByTestId("encode-speed")).toHaveAttribute("title", expect.stringContaining("after 12 timed encodes"));
    rerender(<EncodeSpeedBadge speed={null} />);
    expect(screen.queryByTestId("encode-speed")).toBeNull();
  });
});
