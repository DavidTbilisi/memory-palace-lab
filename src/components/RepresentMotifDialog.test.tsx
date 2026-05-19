import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RepresentMotifDialog } from "./RepresentMotifDialog";

describe("RepresentMotifDialog", () => {
  it("highlights the cascade chip when the statement matches cascade keywords", async () => {
    const user = userEvent.setup();
    render(<RepresentMotifDialog open onOpenChange={vi.fn()} onInsert={vi.fn()} />);
    const textarea = screen.getByLabelText(/Problem statement/i);
    await user.type(textarea, "build a pipeline with sequential steps");
    const status = await screen.findByRole("status", { name: /motif suggestion/i });
    expect(within(status).getByText(/Cascade/i)).toBeInTheDocument();
  });

  it("flips selection when the user clicks a different motif chip", async () => {
    const user = userEvent.setup();
    render(<RepresentMotifDialog open onOpenChange={vi.fn()} onInsert={vi.fn()} />);
    const diamondChip = screen.getByRole("button", { name: /^Diamond/i });
    await user.click(diamondChip);
    expect(diamondChip).toHaveAttribute("aria-pressed", "true");
    // Node title placeholders should now be diamond defaults
    expect(screen.getByPlaceholderText("Source")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sink")).toBeInTheDocument();
  });

  it("calls onInsert with the chosen scaffold when Insert is pressed", async () => {
    const onInsert = vi.fn();
    const user = userEvent.setup();
    render(<RepresentMotifDialog open onOpenChange={vi.fn()} onInsert={onInsert} />);
    await user.click(screen.getByRole("button", { name: /^Hub-spoke/i }));
    await user.click(screen.getByRole("button", { name: /Insert into palace/i }));
    expect(onInsert).toHaveBeenCalledTimes(1);
    const scaffold = onInsert.mock.calls[0]![0];
    expect(scaffold.kind).toBe("hubSpoke");
    expect(scaffold.nodes.length).toBeGreaterThanOrEqual(4);
  });

  it("shows a 'no signal' hint when the statement has no matching keywords", async () => {
    const user = userEvent.setup();
    render(<RepresentMotifDialog open onOpenChange={vi.fn()} onInsert={vi.fn()} />);
    await user.type(screen.getByLabelText(/Problem statement/i), "xyzzy plover");
    expect(screen.getByText(/No strong keyword signal/i)).toBeInTheDocument();
  });
});
