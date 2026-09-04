import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageContentRouter } from "./PageContentRouter";

vi.mock("./AnalyticsPanel", () => ({ AnalyticsPanel: () => <div data-testid="insights" /> }));
vi.mock("./TheSystemWorkbench", () => ({ TheSystemWorkbench: () => <div data-testid="system" /> }));
vi.mock("./AtlasEditorPage", () => ({
  AtlasEditorPage: ({ onOpenPalace }: { onOpenPalace: (id: string) => void }) => (
    <button type="button" onClick={() => onOpenPalace("p9")}>
      atlas-open
    </button>
  ),
}));
vi.mock("./ReviewPage", () => ({
  ReviewPage: ({ onOpenPalaceWorkspace }: { onOpenPalaceWorkspace: () => void }) => (
    <button type="button" onClick={onOpenPalaceWorkspace}>
      review-back
    </button>
  ),
}));
vi.mock("./LibraryPage", () => ({
  LibraryPage: ({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) => (
    <button type="button" onClick={onOpenCommandPalette}>
      library-palette
    </button>
  ),
}));

function setup(currentPage: Parameters<typeof PageContentRouter>[0]["currentPage"], overrides = {}) {
  const props = {
    currentPage,
    onNavigate: vi.fn(),
    onOpenCommandPalette: vi.fn(),
    onOpenPalaceFromAtlas: vi.fn(),
    libraryTarget: null,
    onOpenLibrary: vi.fn(),
    ...overrides,
  };
  render(<PageContentRouter {...props} />);
  return props;
}

describe("PageContentRouter", () => {
  it("renders nothing for the graph page", () => {
    const { container } = render(
      <PageContentRouter
        currentPage="graph"
        onNavigate={vi.fn()}
        onOpenCommandPalette={vi.fn()}
        onOpenPalaceFromAtlas={vi.fn()}
        libraryTarget={null}
        onOpenLibrary={vi.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the matching page body for each non-graph page", () => {
    setup("insights");
    expect(screen.getByTestId("insights")).toBeInTheDocument();
  });

  it("forwards the atlas open-palace callback", async () => {
    const user = userEvent.setup();
    const props = setup("atlas");
    await user.click(screen.getByText("atlas-open"));
    expect(props.onOpenPalaceFromAtlas).toHaveBeenCalledWith("p9");
  });

  it("forwards the review page's back-to-palace navigation", async () => {
    const user = userEvent.setup();
    const review = setup("review");
    await user.click(screen.getByText("review-back"));
    expect(review.onNavigate).toHaveBeenCalledWith("graph");
  });

  it("renders the library page and exposes an About-this-page link on card pages", async () => {
    const user = userEvent.setup();
    const library = setup("library");
    await user.click(screen.getByText("library-palette"));
    expect(library.onOpenCommandPalette).toHaveBeenCalled();

    const insights = setup("insights");
    await user.click(screen.getByRole("button", { name: "About this page" }));
    expect(insights.onOpenLibrary).toHaveBeenCalledWith({ slug: "measurement-framework" });
  });
});
