## User Story

As a learner migrating from Anki, Obsidian, or a spreadsheet,
I want to import a list of facts as nodes into my palace,
So that I can get started without manually creating every node from scratch.

## Background

New user activation is highest when users can bring their existing material into the system. The blank canvas is intimidating. A simple import flow (paste a list / upload CSV) dramatically lowers the activation barrier.

## BDD Scenarios

### Scenario 1: Import option is accessible from the Graph empty state
```gherkin
Given no palace is open
When I view the Graph empty state
Then I see an "Import notes" button alongside "Create tutorial palace"
```

### Scenario 2: Pasting a plain Markdown list creates nodes
```gherkin
Given the import dialog is open
When I paste a list of items beginning with "- "
Then one node is created per line
And nodes are arranged in a grid layout
```

### Scenario 3: Importing a CSV with Title and Content columns
```gherkin
Given I upload a CSV file with columns: "title", "content"
When the import completes
Then one node is created per CSV row
And each node's Title and Content are set from the corresponding columns
```

### Scenario 4: Import preview before committing
```gherkin
Given I have pasted or uploaded content
When the parser finishes
Then a preview list shows the nodes that will be created
And I can deselect rows I do not want to import
```

### Scenario 5: Imported nodes are added to the current palace
```gherkin
Given I have "Biology" palace open
And I import 10 nodes
When the import confirms
Then all 10 nodes appear on the Biology canvas
And the palace auto-saves a checkpoint
```

## Acceptance Criteria
- [ ] Import dialog accessible from empty state and PalaceSidebar
- [ ] Markdown list parser: lines starting with "- " or "* " become node titles
- [ ] CSV parser: "title" and "content" columns mapped to node fields (header row required)
- [ ] Preview step before committing with row deselection
- [ ] Nodes auto-arranged in a grid via tldraw createShapes batch call
- [ ] Palace auto-saves checkpoint after import
- [ ] Max 200 nodes per import with warning if exceeded
