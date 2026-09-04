import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DocReader } from "./DocReader";

const BODY = [
  "Intro paragraph with a [link](./cast-system.md#tier-2) and an [outside link](https://example.com).",
  "",
  "## Narrow",
  "",
  "Narrow the scope.",
  "",
  "### Success criteria",
  "",
  "Criteria text.",
  "",
  "## Phases",
  "",
  "Phase text.",
].join("\n");

describe("DocReader", () => {
  it("renders section tabs, switches sections, and supports arrow keys", async () => {
    const user = userEvent.setup();
    render(<DocReader title="NAVIGATOR" body={BODY} />);
    expect(screen.getByRole("tablist", { name: "Document sections" })).toBeInTheDocument();
    expect(screen.getByText("Intro paragraph with a", { exact: false })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Narrow" }));
    expect(screen.getByText("Narrow the scope.")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Phases" })).toHaveAttribute("aria-selected", "true");
  });

  it("routes relative markdown links through onNavigateLink and leaves external links alone", async () => {
    const user = userEvent.setup();
    const onNavigateLink = vi.fn();
    render(<DocReader title="Doc" body={BODY} onNavigateLink={onNavigateLink} />);
    await user.click(screen.getByRole("link", { name: "link" }));
    expect(onNavigateLink).toHaveBeenCalledWith({ slug: "cast-system", anchor: "tier-2" });
    expect(screen.getByRole("link", { name: "outside link" })).toHaveAttribute("target", "_blank");
  });

  it("jumps to the section owning an anchor, including nested headings", () => {
    render(<DocReader title="Doc" body={BODY} anchor="success-criteria" anchorVersion={1} />);
    expect(screen.getByRole("tab", { name: "Narrow" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Criteria text.")).toBeInTheDocument();
  });

  it("falls back to a dropdown for very long documents and shows a loading state", () => {
    const long = Array.from({ length: 20 }, (_, index) => `## Section ${index + 1}\n\nBody ${index + 1}.`).join("\n\n");
    const { rerender } = render(<DocReader title="Long" body={long} />);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Document sections" })).toBeInTheDocument();

    rerender(<DocReader title="Long" body={null} />);
    expect(screen.getByText("Loading document...")).toBeInTheDocument();
  });

  it("renders Encode this actions and disables them with a reason", async () => {
    const user = userEvent.setup();
    const onAddAsNode = vi.fn();
    const onRunAsPipeline = vi.fn();
    const { rerender } = render(
      <DocReader title="Doc" body={BODY} encodeActions={{ onAddAsNode, onRunAsPipeline, disabledReason: "Open a palace first" }} />,
    );
    expect(screen.getByRole("group", { name: "Encode this" })).toHaveAttribute("title", "Open a palace first");
    expect(screen.getByRole("button", { name: "Add as node" })).toBeDisabled();

    rerender(<DocReader title="Doc" body={BODY} encodeActions={{ onAddAsNode, onRunAsPipeline, disabledReason: null }} />);
    await user.click(screen.getByRole("button", { name: "Add as node" }));
    await user.click(screen.getByRole("button", { name: "Run as pipeline" }));
    expect(onAddAsNode).toHaveBeenCalledTimes(1);
    expect(onRunAsPipeline).toHaveBeenCalledTimes(1);
  });
});
