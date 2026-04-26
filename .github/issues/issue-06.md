## User Story

As a learner who just finished a walk,
I want to see a summary of what I reviewed and how I performed,
So that I get closure on the session and know what to do next.

## Background

Currently a walk ends silently — the Walk mode bar toggles off and nothing else happens. There is no recap, no performance data, no "next review in X days" message. This misses the habit loop and gives the user no sense of accomplishment.

## BDD Scenarios

### Scenario 1: Summary screen appears after walk completion
```gherkin
Given I am in walk mode
And I have stepped through all loci in the route
When the last locus is rated
Then a session summary screen appears (modal or inline card)
```

### Scenario 2: Summary shows loci reviewed and rating breakdown
```gherkin
Given I completed a walk of 8 loci
And my ratings were: 2 x Again, 1 x Hard, 4 x Good, 1 x Easy
When the summary screen renders
Then I see "8 loci reviewed"
And a breakdown: Again 2, Hard 1, Good 4, Easy 1
```

### Scenario 3: Summary shows next review date for the route
```gherkin
Given spaced repetition scheduling is active
When the session summary renders
Then I see "Next review for this route: in 3 days"
```

### Scenario 4: Summary shows streak progress
```gherkin
Given my streak was 4 days before this session
When the summary screen renders
Then I see "5-day streak!"
And my daily goal progress (e.g. "10/10 loci today")
```

### Scenario 5: Summary provides clear next actions
```gherkin
Given the summary screen is visible
When I look at the available actions
Then I see at least: "Review another route", "Back to palace", "Done"
```

## Acceptance Criteria
- [ ] WalkModeBar triggers summary on last locus rated
- [ ] Summary shows: loci count, rating breakdown, next review date, streak
- [ ] "Done" action dismisses summary and returns to normal canvas view
- [ ] Summary dismissible via Escape key
- [ ] Session summary logged as a `WalkCompleted` analytics event
