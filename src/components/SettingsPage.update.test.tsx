import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UpdateCheckResult } from "../infrastructure/appUpdater";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";
import { SettingsPage } from "./SettingsPage";

// A separate file from SettingsPage.test.tsx, which renders the page as the web build.
const checkForUpdate = vi.fn<() => Promise<UpdateCheckResult>>();

vi.mock("../store/palaceStore");
vi.mock("../infrastructure/appUpdater", () => ({
  IS_TAURI_RUNTIME: true,
  checkForUpdate: () => checkForUpdate(),
  downloadAndInstallUpdate: vi.fn(),
}));

describe("SettingsPage update check", () => {
  beforeEach(() => {
    checkForUpdate.mockReset();
    const state = {
      dailyReviewGoal: 10,
      setDailyReviewGoal: vi.fn(),
      atlasLevelLabels: ["Domain", "Place", "Section"],
      setAtlasLevelLabels: vi.fn(),
      loadPalaces: vi.fn(),
      loadAARRecords: vi.fn(),
      palaces: [],
    };
    vi.mocked(usePalaceStore).mockImplementation((selector) => selector(state as unknown as PalaceStore));
  });

  it("SettingsPage shows the release notes of an available update", async () => {
    checkForUpdate.mockResolvedValue({
      status: "available",
      version: "0.15.0",
      notes: "### Routes\n\n- **Faster walks.**",
    });
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Check for updates" }));
    const notes = await screen.findByRole("region", { name: "What's new in v0.15.0" });
    expect(within(notes).getByRole("heading", { name: "Routes" })).toBeInTheDocument();
    expect(within(notes).getByText("Faster walks.").tagName).toBe("STRONG");
  });

  it("SettingsPage shows no notes panel when the update has none", async () => {
    checkForUpdate.mockResolvedValue({ status: "available", version: "0.15.0" });
    const user = userEvent.setup();
    render(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Check for updates" }));
    expect(await screen.findByText("v0.15.0 is available.")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /What's new/ })).not.toBeInTheDocument();
  });
});
