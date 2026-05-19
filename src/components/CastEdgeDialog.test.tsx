import { render, screen, within } from "@testing-library/react";
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

  it("warns when a Tier 1 verb collides with a sibling edge", async () => {
    const user = userEvent.setup();
    render(
      <CastEdgeDialog
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        siblingEdgeLabels={["feeds"]}
      />,
    );

    const input = screen.getByLabelText(/Tier 1 edge verb/i);
    await user.clear(input);
    await user.type(input, "supplies");

    const alert = await screen.findByRole("alert", { name: /tier 1 verb collision/i });
    expect(within(alert).getByText(/Supply verbs/i)).toBeInTheDocument();
    expect(within(alert).getByRole("button", { name: /promote this edge to tier 2/i })).toBeInTheDocument();
  });

  it("Promote button switches the dialog to Tier 2", async () => {
    const user = userEvent.setup();
    render(
      <CastEdgeDialog
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        siblingEdgeLabels={["feeds"]}
      />,
    );

    const input = screen.getByLabelText(/Tier 1 edge verb/i);
    await user.clear(input);
    await user.type(input, "supplies");
    await user.click(await screen.findByRole("button", { name: /promote this edge to tier 2/i }));

    expect(screen.getByRole("combobox", { name: /CAST character/i })).toBeInTheDocument();
  });

  it("does not warn when sibling verbs come from a different family", async () => {
    const user = userEvent.setup();
    render(
      <CastEdgeDialog
        open
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        siblingEdgeLabels={["blocks"]}
      />,
    );

    const input = screen.getByLabelText(/Tier 1 edge verb/i);
    await user.clear(input);
    await user.type(input, "supplies");

    expect(screen.queryByRole("alert", { name: /tier 1 verb collision/i })).toBeNull();
  });
});
