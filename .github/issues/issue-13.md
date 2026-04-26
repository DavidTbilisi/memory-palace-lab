## User Story

As a learner building a daily review habit,
I want to see a GitHub-style calendar heatmap of my review days,
So that I can see my consistency at a glance and be motivated to maintain my streak.

## Background

Habit visualisation is one of the most effective behavioural interventions for building consistency. A heatmap makes the review habit tangible. Proven pattern: GitHub, Duolingo, Anki statistics.

## BDD Scenarios

### Scenario 1: Calendar heatmap renders on the Insights page
```gherkin
Given I have reviewed loci on at least 3 different days
When I navigate to the Insights page
Then I see a calendar heatmap covering the last 52 weeks
And days with review activity are shaded green (darker = more loci reviewed)
And days with no activity are shown as empty squares
```

### Scenario 2: Heatmap colour intensity reflects volume reviewed
```gherkin
Given on Monday I reviewed 2 loci and on Tuesday I reviewed 15 loci
When the heatmap renders
Then Monday's square is a lighter shade of green than Tuesday's
```

### Scenario 3: Hovering a square shows a tooltip
```gherkin
Given the heatmap is rendered
When I hover over a day square
Then a tooltip shows: "April 20 - 8 loci reviewed across 2 routes"
```

### Scenario 4: Today's square is highlighted with a border
```gherkin
Given today is April 26
When the heatmap renders
Then April 26 has a visible border or ring to indicate the current day
```

### Scenario 5: Empty heatmap shows an encouraging onboarding message
```gherkin
Given I have never completed a review session
When I view the heatmap area on Insights
Then I see "Your review history will appear here after your first walk session"
And a "Start reviewing" button is shown
```

## Acceptance Criteria
- [ ] Calendar heatmap component added to AnalyticsPanel
- [ ] Covers last 52 weeks rendered as a grid of day squares
- [ ] Colour scale: 0 = empty, 1-3 = light green, 4-9 = mid green, 10+ = dark green
- [ ] Tooltip on hover: date + loci count + routes reviewed
- [ ] Today highlighted with a border/ring
- [ ] Data derived from WalkStepped or Recall Rated analytics events grouped by date
- [ ] Scrollable horizontally on smaller viewports
