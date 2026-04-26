## User Story

As a palace builder,
I want the Routes panel to be collapsed by default,
So that the tldraw canvas fills as much vertical space as possible when I am not actively managing routes.

## Background

The stacked header → PalaceToolbar → RoutePanel → WalkModeBar consumes ~160px above the canvas on a typical window. The canvas is the primary work surface but is buried under UI chrome. The RoutePanel should be collapsed unless the user is actively building routes.

## BDD Scenarios

### Scenario 1: Routes panel is collapsed on palace open
```gherkin
Given I open a palace for the first time
When the Graph page renders
Then the Routes panel is collapsed (not visible)
And the canvas occupies the maximum available height
```

### Scenario 2: User can expand the Routes panel
```gherkin
Given the Routes panel is collapsed
When I click the "Route" button in PalaceToolbar
Then the Routes panel expands showing the route dropdown and locus controls
```

### Scenario 3: Routes panel stays expanded while in route-building mode
```gherkin
Given I expanded the Routes panel
And I have selected a route from the dropdown
When I click "Add selected node to route"
Then the Routes panel remains visible
```

### Scenario 4: Routes panel auto-collapses when switching tools
```gherkin
Given the Routes panel is expanded
When I click "Select", "Node", "Portal", or "Connect" in PalaceToolbar
Then the Routes panel collapses automatically
```

### Scenario 5: Panel collapsed state persists across navigation
```gherkin
Given I collapsed the Routes panel
When I navigate to Insights and return to Graph
Then the Routes panel remains collapsed
```

## Acceptance Criteria
- [ ] RoutePanel is hidden by default
- [ ] "Route" toolbar button toggles RoutePanel visibility
- [ ] Collapsed state is visually indicated on the Route button
- [ ] Instruction text only shows when panel is expanded
- [ ] Canvas height increases measurably when panel is collapsed
