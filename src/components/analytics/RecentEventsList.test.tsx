import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AnalyticsEvent } from "../../domain/entities/types";
import { RecentEventsList } from "./RecentEventsList";

function event(id: string, title: string): AnalyticsEvent {
  return {
    id,
    eventType: "node_created",
    eventGroup: "graph",
    createdAt: "2026-05-01T10:00:00.000Z",
    payloadJson: JSON.stringify({ title }),
  };
}

describe("RecentEventsList", () => {
  it("shows an empty state when there are no events", () => {
    render(<RecentEventsList events={[]} />);
    expect(screen.getByText(/No analytics events yet/i)).toBeInTheDocument();
  });

  it("renders a row per event with its humanized type and detail", () => {
    render(<RecentEventsList events={[event("a", "Front Door"), event("b", "Kitchen")]} />);
    expect(screen.getByText("Front Door")).toBeInTheDocument();
    expect(screen.getByText("Kitchen")).toBeInTheDocument();
    expect(screen.getAllByText(/node created/i)).toHaveLength(2);
  });
});
