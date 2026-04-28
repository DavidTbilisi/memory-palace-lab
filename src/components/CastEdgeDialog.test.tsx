import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CastEdgeDialog } from "./CastEdgeDialog";

describe("CastEdgeDialog", () => {
  it("decodes Tier 2 CAST mnemonics inline", async () => {
    const user = userEvent.setup();
    render(<CastEdgeDialog open onOpenChange={vi.fn()} onConfirm={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /tier 2 \(decoded cast\)/i }));

    expect(screen.getAllByText(/Giant means hub\/controller/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("option", { name: /Mermaid - peer\/mutual \(01\)/i })).toBeInTheDocument();
    expect(screen.getByText(/what is moving across the edge/i)).toBeInTheDocument();
  });
});
