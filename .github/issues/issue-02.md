## User Story

As a palace builder,
I want changes I type in the Node Inspector to save automatically when I click away,
So that I don't lose edits by forgetting to press "Apply".

## Background

The NodeInspector currently shows an explicit "Apply" button. This breaks the expectation set by every modern editor — changes should persist on blur. Users routinely type a new title, click back to the canvas, and find their changes lost.

## BDD Scenarios

### Scenario 1: Title saves on blur
```gherkin
Given I have a node selected in the inspector
And I type "Hippocampus" in the Title field
When I click anywhere outside the Title input (blur)
Then the node label on the canvas updates to "Hippocampus"
And no "Apply" button click is required
```

### Scenario 2: Alias saves on blur
```gherkin
Given I have a node selected
And I type "HC" in the Alias field
When I press Tab to move focus
Then the alias is persisted to the node metadata immediately
```

### Scenario 3: Content saves on blur
```gherkin
Given I have a node selected
And I type encoding notes in the Content textarea
When I click the canvas to deselect
Then the content is saved without pressing Apply
```

### Scenario 4: Apply button is removed
```gherkin
Given I am in the Node Inspector
When I look at the inspector panel
Then there is no "Apply" button visible
And a subtle auto-save indicator (e.g. "Saved") appears briefly after each blur
```

### Scenario 5: Edge label also auto-saves
```gherkin
Given I have an edge selected
And I edit the Label field
When I blur the input
Then the edge label on canvas updates immediately
```

## Acceptance Criteria
- [ ] `onBlur` handlers on Title, Alias, Content inputs call the `apply` logic
- [ ] "Apply" button removed from NodeInspector for both node and edge views
- [ ] Brief "Saved ✓" micro-confirmation appears after auto-save
- [ ] No regression: selecting a different node still loads correct values
