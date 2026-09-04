import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePalaceStore, type PalaceStore } from "../store/palaceStore";
import { AI_KEY_STORAGE_KEY, SettingsPage } from "./SettingsPage";
import { DISMISSED_TIPS_STORAGE_KEY, TIPS_DISABLED_KEY } from "../domain/services/tipPreferences";

vi.mock("../store/palaceStore");
vi.mock("../infrastructure/palaceBackup", () => ({
  exportPalaceBackup: vi.fn(async () => ({ palaces: [] })),
  importPalaceBackup: vi.fn(async () => ({ palaces: 0, aarRecords: 0 })),
}));

const setDailyReviewGoal = vi.fn();
const setAtlasLevelLabels = vi.fn();

function mockStore(overrides: Record<string, unknown> = {}) {
  const state = {
    dailyReviewGoal: 10,
    setDailyReviewGoal,
    atlasLevelLabels: ["Domain", "Place", "Section"],
    setAtlasLevelLabels,
    loadPalaces: vi.fn(),
    loadAARRecords: vi.fn(),
    palaces: [],
    ...overrides,
  };
  vi.mocked(usePalaceStore).mockImplementation((selector) => selector(state as unknown as PalaceStore));
}

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    mockStore();
  });

  it("writes the daily goal to the store on blur", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    const goal = screen.getByLabelText("Daily loci goal");
    await user.clear(goal);
    await user.type(goal, "25");
    await user.tab();
    expect(setDailyReviewGoal).toHaveBeenCalledWith(25);
  });

  it("stores the API key under the key the inspector reads", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.type(screen.getByLabelText("Anthropic API key"), "sk-ant-test");
    expect(window.localStorage.getItem(AI_KEY_STORAGE_KEY)).toBe("sk-ant-test");
  });

  it("re-enables tips by clearing both tip keys", async () => {
    window.localStorage.setItem(TIPS_DISABLED_KEY, "true");
    window.localStorage.setItem(DISMISSED_TIPS_STORAGE_KEY, JSON.stringify(["a"]));
    const user = userEvent.setup();
    render(<SettingsPage />);
    expect(screen.getByLabelText("Show idle tips")).not.toBeChecked();
    await user.click(screen.getByRole("button", { name: "Re-enable all tips" }));
    expect(window.localStorage.getItem(TIPS_DISABLED_KEY)).toBeNull();
    expect(window.localStorage.getItem(DISMISSED_TIPS_STORAGE_KEY)).toBeNull();
    expect(screen.getByLabelText("Show idle tips")).toBeChecked();
  });

  it("edits atlas level names through the store", async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.type(screen.getByLabelText("Atlas level 1 name"), "s");
    expect(setAtlasLevelLabels).toHaveBeenCalledWith(["Domains", "Place", "Section"]);
  });

  it("lists shortcuts and explains that updates are desktop only on the web", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Command palette")).toBeInTheDocument();
    expect(screen.getByText(/desktop app only/)).toBeInTheDocument();
  });
});
