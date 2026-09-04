import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LibraryEntry } from "../content/library";

const guideLoad = vi.fn(async () => "Guide intro.\n\n## Narrow\n\nSee [wiki page](./active-recall.md).");
const wikiLoad = vi.fn(async () => "Wiki body text.");

vi.mock("../content/library", async () => {
  const actual = await vi.importActual<typeof import("../content/library")>("../content/library");
  return {
    ...actual,
    loadLibraryIndex: vi.fn(async (): Promise<LibraryEntry[]> => [
      ...actual.COMPONENT_ENTRIES,
      {
        id: "start:app-manual",
        section: "start",
        slug: "app-manual",
        title: "App manual",
        summary: "How the app works.",
        origin: "lab",
        kind: "markdown",
        load: async () => "Manual body.",
      },
      {
        id: "guides:navigator",
        section: "guides",
        slug: "navigator",
        title: "NAVIGATOR",
        summary: "A learning loop.",
        category: "Getting Started",
        origin: "lab",
        kind: "markdown",
        searchText: "acronym = order",
        load: guideLoad,
      },
      {
        id: "wiki:active-recall",
        section: "wiki",
        slug: "active-recall",
        title: "Active Recall",
        summary: "Retrieval practice.",
        origin: "wiki",
        kind: "markdown",
        load: wikiLoad,
      },
    ]),
  };
});
vi.mock("./hooks/useLearningProgress", () => ({
  useLearningProgress: () => ({ checks: [], allDone: false, nodeCount: 0, edgeCount: 0 }),
}));
const setSystemDraftTemplate = vi.fn();
const storeState: Record<string, unknown> = { currentPalace: null, editorRef: null, setSystemDraftTemplate };
vi.mock("../store/palaceStore", () => ({
  usePalaceStore: vi.fn((selector: (state: Record<string, unknown>) => unknown) => selector(storeState)),
}));
vi.mock("../app/navigationEvents", () => ({ requestNavigation: vi.fn() }));
vi.mock("../system/examplePalaces", () => ({
  createTutorialPalace: vi.fn(async () => undefined),
  ensureExamplePalace: vi.fn(async () => ({ palaceId: "p", created: true })),
}));

import { requestNavigation } from "../app/navigationEvents";
import { LibraryPage } from "./LibraryPage";

function setup(target: Parameters<typeof LibraryPage>[0]["target"] = null) {
  const props = {
    target,
    onOpenPalaceWorkspace: vi.fn(),
    onOpenSystem: vi.fn(),
    onOpenCommandPalette: vi.fn(),
  };
  render(<LibraryPage {...props} />);
  return props;
}

describe("LibraryPage", () => {
  beforeEach(() => {
    guideLoad.mockClear();
    wikiLoad.mockClear();
  });

  it("opens on Start here with lessons and does not load any markdown body", async () => {
    setup();
    expect(await screen.findByRole("heading", { name: "Library" })).toBeInTheDocument();
    expect(await screen.findByText("Lesson 1 - Build your first palace")).toBeInTheDocument();
    expect(guideLoad).not.toHaveBeenCalled();
    expect(wikiLoad).not.toHaveBeenCalled();
  });

  it("browses a section and lazily loads the selected document once", async () => {
    const user = userEvent.setup();
    setup();
    await screen.findByRole("heading", { name: "Library" });
    await user.click(screen.getByRole("tab", { name: "Guides" }));
    expect(await screen.findByText("Guide intro.")).toBeInTheDocument();
    expect(guideLoad).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("tab", { name: "Start here" }));
    await user.click(screen.getByRole("tab", { name: "Guides" }));
    await screen.findByText("Guide intro.");
    expect(guideLoad).toHaveBeenCalledTimes(1);
  });

  it("follows a deep-link target to the right section, entry, and anchor", async () => {
    setup({ section: "guides", slug: "navigator", anchor: "narrow", version: 1 });
    expect(await screen.findByText("Narrow", { selector: "h3" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Narrow" })).toHaveAttribute("aria-selected", "true");
  });

  it("navigates in-document links across sections", async () => {
    const user = userEvent.setup();
    setup({ section: "guides", slug: "navigator", anchor: "narrow", version: 1 });
    await screen.findByText("Narrow", { selector: "h3" });
    await user.click(screen.getByRole("link", { name: "wiki page" }));
    expect(await screen.findByText("Wiki body text.")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Wiki" })).toHaveAttribute("aria-selected", "true");
  });

  it("searches across every section", async () => {
    const user = userEvent.setup();
    setup();
    await screen.findByRole("heading", { name: "Library" });
    await user.type(screen.getByLabelText("Search the Library"), "acronym");
    await waitFor(() => expect(screen.getByText("1 matches across all sections.")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /NAVIGATOR/ })).toBeInTheDocument();
  });

  it("disables Encode this without a palace and runs a document as a pipeline with one", async () => {
    const user = userEvent.setup();
    storeState.currentPalace = null;
    const first = render(<LibraryPage target={{ section: "guides", slug: "navigator", version: 1 }} onOpenPalaceWorkspace={vi.fn()} onOpenSystem={vi.fn()} onOpenCommandPalette={vi.fn()} />);
    await screen.findByText("Guide intro.");
    expect(screen.getByRole("button", { name: "Run as pipeline" })).toBeDisabled();
    first.unmount();

    storeState.currentPalace = { id: "p1", name: "Palace" };
    storeState.editorRef = {};
    render(<LibraryPage target={{ section: "guides", slug: "navigator", version: 2 }} onOpenPalaceWorkspace={vi.fn()} onOpenSystem={vi.fn()} onOpenCommandPalette={vi.fn()} />);
    await screen.findByText("Guide intro.");
    await user.click(screen.getByRole("button", { name: "Run as pipeline" }));
    expect(setSystemDraftTemplate).toHaveBeenCalledWith(expect.objectContaining({ id: "doc:navigator", docsSlug: "navigator" }));
    expect(requestNavigation).toHaveBeenCalledWith("system");
  });
});
