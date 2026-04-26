## User Story

As a learner with a large palace,
I want to search for nodes by title or content using Ctrl+K,
So that I can quickly find and jump to any memory node without scrolling the canvas.

## Background

The CommandPalette already exists and handles page navigation (Ctrl+K). It should be extended to search node titles and content across all palaces. With 50+ nodes, manual canvas scanning becomes impractical.

## BDD Scenarios

### Scenario 1: Typing in command palette searches node titles
```gherkin
Given I press Ctrl+K to open the command palette
When I type "hippo"
Then nodes whose titles contain "hippo" (case-insensitive) appear in the results
And each result shows: node title, palace name, route membership (if any)
```

### Scenario 2: Search results are scoped to the current palace by default
```gherkin
Given my current palace is "Biology"
And I type a search term in the command palette
Then Biology nodes appear first in results
And a separator labeled "Other palaces" groups results from other palaces below
```

### Scenario 3: Selecting a node result navigates to it on the canvas
```gherkin
Given I see a node result for "Hippocampus" in Biology palace
When I click or press Enter on it
Then the Biology palace opens (if not already open)
And the canvas pans and zooms to center on the Hippocampus node
And the node is selected (inspector opens)
```

### Scenario 4: Search also matches node content and alias
```gherkin
Given a node has Title "HC" and Content "Hippocampus — memory formation"
When I type "memory formation" in the command palette
Then that node appears in the search results
```

### Scenario 5: Empty search shows recent nodes
```gherkin
Given I open the command palette with no existing search term
When the palette renders
Then a "Recent nodes" section shows the last 5 nodes I interacted with
```

## Acceptance Criteria
- [ ] CommandPalette searches MemoryNode titles, aliases, and content across loaded palaces
- [ ] Results grouped: current palace then other palaces then pages then docs
- [ ] Selecting a node result calls openPalace() + editor.zoomToShapeId()
- [ ] Search debounced (200ms)
- [ ] Recent nodes section shown when query is empty
- [ ] Result items show palace name and route name as subtitle
