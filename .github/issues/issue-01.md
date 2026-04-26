## User Story

As a memory athlete,
I want to rate how well I recalled each locus during a walk (Again / Hard / Good / Easy),
So that the system can schedule the next review at the right interval.

## Background

Currently `REVIEW RATINGS` is always `0` in Insights because the rating UI is not wired up during walk sessions. The walk ends silently with no recall signal captured, making spaced repetition scheduling impossible.

## BDD Scenarios

### Scenario 1: Rating buttons appear at each locus during walk
```gherkin
Given I have a walk session in progress
And I am viewing a locus node
When the answer is revealed
Then I see four rating buttons: "Again", "Hard", "Good", "Easy"
And each button is visually distinct (red / orange / green / blue)
```

### Scenario 2: Selecting a rating advances the walk
```gherkin
Given I am on a revealed locus during a walk
When I click "Good"
Then a recall event is stored with rating=3 and the current timestamp
And the walk advances to the next locus
```

### Scenario 3: Ratings appear in Insights
```gherkin
Given I have completed a walk and rated at least one locus
When I navigate to the Insights page
Then "REVIEW RATINGS" shows a non-zero count
And the event log contains entries of type "Recall Rated"
```

### Scenario 4: Keyboard shortcuts for rating
```gherkin
Given I am on a revealed locus during walk
When I press "1", "2", "3", or "4"
Then the corresponding rating (Again/Hard/Good/Easy) is applied
And the walk advances automatically
```

## Acceptance Criteria
- [ ] Four rating buttons rendered after answer reveal in WalkModeBar
- [ ] Rating stored as analytics event with `rating` (1-4), `locusId`, `routeId`, `timestamp`
- [ ] Keyboard shortcuts 1-4 map to Again/Hard/Good/Easy
- [ ] `REVIEW RATINGS` count in Insights reflects completed ratings
- [ ] Walk does not advance until a rating is selected (or skipped explicitly)
