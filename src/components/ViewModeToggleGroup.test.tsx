import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ViewModeToggleGroup } from "./ViewModeToggleGroup";

vi.mock("../store/palaceStore", () => ({
  usePalaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) =>
    selector({ appMode: "encode", setAppMode: vi.fn() }),
  ),
}));

function setup(overrides: Partial<Parameters<typeof ViewModeToggleGroup>[0]> = {}) {
  const props = {
    viewMode: "balanced" as const,
    onApplyViewMode: vi.fn(),
    onToggleSidebar: vi.fn(),
    onToggleInspector: vi.fn(),
    onToggleOnboarding: vi.fn(),
    onOpenSettings: vi.fn(),
    onHoverHintChange: vi.fn(),
    ...overrides,
  };
  render(<ViewModeToggleGroup {...props} />);
  return props;
}

describe("ViewModeToggleGroup", () => {
  it("applies balanced and focus view modes", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTitle("Focus mode"));
    expect(props.onApplyViewMode).toHaveBeenCalledWith("focus");
    await user.click(screen.getByTitle("Balanced layout"));
    expect(props.onApplyViewMode).toHaveBeenCalledWith("balanced");
  });

  it("hosts the Encode/Comprehend switch and disables it off the graph page", () => {
    setup();
    expect(screen.getByRole("radio", { name: "Encode" })).toBeEnabled();
    setup({ modeToggleDisabled: true });
    expect(screen.getAllByRole("radio", { name: "Encode" })[1]).toBeDisabled();
  });

  it("toggles sidebar, inspector, and onboarding", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByTitle("Toggle palace sidebar"));
    await user.click(screen.getByTitle("Toggle inspector"));
    await user.click(screen.getByRole("button", { name: /Learn/ }));
    expect(props.onToggleSidebar).toHaveBeenCalledTimes(1);
    expect(props.onToggleInspector).toHaveBeenCalledTimes(1);
    expect(props.onToggleOnboarding).toHaveBeenCalledTimes(1);
  });

  it("opens settings from the gear button", async () => {
    const user = userEvent.setup();
    const props = setup();
    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(props.onOpenSettings).toHaveBeenCalledTimes(1);
  });
});
