import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageContentRouter } from "./PageContentRouter";

vi.mock("./AnalyticsPanel", () => ({ AnalyticsPanel: () => <div data-testid="insights" /> }));
vi.mock("./TheSystemWorkbench", () => ({ TheSystemWorkbench: () => <div data-testid="system" /> }));
vi.mock("./RouteEditorPage", () => ({ RouteEditorPage: () => <div data-testid="routes" /> }));
vi.mock("./AtlasEditorPage", () => ({
  AtlasEditorPage: ({ onOpenPalace }: { onOpenPalace: (id: string) => void }) => (
    <button type="button" onClick={() => onOpenPalace("p9")}>
      atlas-open
    </button>
  ),
}));
vi.mock("./ReviewPage", () => ({
  ReviewPage: ({ onStartRouteReview }: { onStartRouteReview: (id: string) => void }) => (
    <button type="button" onClick={() => onStartRouteReview("r1")}>
      review-start
    </button>
  ),
}));
vi.mock("./HelpCenterPage", () => ({
  HelpCenterPage: ({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) => (
    <button type="button" onClick={onOpenCommandPalette}>
      help-palette
    </button>
  ),
}));

function setup(currentPage: Parameters<typeof PageContentRouter>[0]["currentPage"], overrides = {}) {
  const props = {
    currentPage,
    onStartRouteReview: vi.fn(),
    onNavigate: vi.fn(),
    onOpenCommandPalette: vi.fn(),
    onOpenPalaceFromAtlas: vi.fn(),
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
        onStartRouteReview={vi.fn()}
        onNavigate={vi.fn()}
        onOpenCommandPalette={vi.fn()}
        onOpenPalaceFromAtlas={vi.fn()}
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

  it("forwards review start and help command-palette callbacks", async () => {
    const user = userEvent.setup();
    const review = setup("review");
    await user.click(screen.getByText("review-start"));
    expect(review.onStartRouteReview).toHaveBeenCalledWith("r1");
  });
});
