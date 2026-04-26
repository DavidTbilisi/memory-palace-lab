## User Story

As a daily learner,
I want to see my current review streak and progress toward a daily loci goal,
So that the habit of daily review is reinforced and I know when I have hit my target.

## Background

Memory palace practice requires daily consistency. Without a streak or goal indicator the app gives no positive feedback for showing up every day, and users have no signal for when a session is "done enough".

## BDD Scenarios

### Scenario 1: Streak increments on daily review completion
```gherkin
Given I reviewed at least 1 locus yesterday
When I complete a review session today (at least 1 locus rated)
Then my streak counter increments by 1
And the streak is displayed on the Review page as "N days"
```

### Scenario 2: Streak resets on missed day
```gherkin
Given I last reviewed 2 days ago
When I open the app today
Then the streak counter shows 0
And a gentle message reads "Start your streak again today"
```

### Scenario 3: Daily goal progress bar fills as loci are reviewed
```gherkin
Given my daily goal is set to 10 loci (default)
And I have reviewed 4 loci so far today
When I open the Review page
Then a progress bar shows "4 / 10 loci reviewed today"
And the bar is 40% filled
```

### Scenario 4: Completing the daily goal triggers a celebration state
```gherkin
Given my daily goal is 10 loci
When I rate the 10th locus of the day
Then the progress bar shows "10 / 10"
And a brief congratulatory message is shown
```

### Scenario 5: Daily goal is configurable
```gherkin
Given I am on the Insights or System page
When I change my daily loci goal to 20
Then the Review page progress bar updates its target to 20
And the new goal persists across sessions
```

## Acceptance Criteria
- [ ] Streak calculated from analytics events (consecutive days with 1+ rated locus)
- [ ] Streak displayed on Review page
- [ ] Daily goal defaults to 10, stored in localStorage / SQLite settings
- [ ] Progress bar on Review page showing today's reviewed / goal count
- [ ] Goal setting UI in Insights or Settings section
