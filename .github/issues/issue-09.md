## User Story

As a learner with multiple palaces,
I want a single review queue that surfaces due loci from all my palaces — not just the currently open one,
So that I don't have to manually switch between palaces to stay on top of review.

## Background

ReviewPage currently derives its queue from currentPalace only. A serious practitioner with 5-10 palaces must open each one and run review separately. Items in non-active palaces are never surfaced.

## BDD Scenarios

### Scenario 1: Global queue aggregates loci across all palaces
```gherkin
Given I have three palaces: "Biology", "History", "Languages"
And each has at least one locus due for review today
When I open the Review page
Then the queue shows due loci from all three palaces
And each queue item displays which palace it belongs to
```

### Scenario 2: Palace name and route name shown on each queue item
```gherkin
Given the global queue is displayed
When I see a queue item
Then it shows: palace name, route name, locus title, and next-review date
```

### Scenario 3: Starting a cross-palace walk auto-switches the active palace
```gherkin
Given I start a walk for a route in "Biology" palace
And my currently open palace is "History"
When the walk begins
Then the app automatically opens "Biology" palace
And the walk proceeds on the Biology canvas
```

### Scenario 4: Global queue can be filtered by palace
```gherkin
Given the global review queue is showing
When I select "Biology" from a palace filter dropdown
Then only Biology loci appear in the queue
```

### Scenario 5: Stats reflect global counts
```gherkin
Given I have 5 loci due in Biology and 3 in History
When I open the Review page
Then a "TOTAL DUE" stat card shows 8
```

## Acceptance Criteria
- [ ] `buildReviewQueue` accepts an array of palace snapshots (not just current palace ID)
- [ ] ReviewPage loads due items from all palaces via palaceRepo
- [ ] Each queue item includes palaceName, routeName, locusTitle, nextReviewAt
- [ ] Starting a review item for a non-active palace triggers openPalace() first
- [ ] Palace filter UI on Review page
- [ ] Stats cards updated to reflect global counts
