## User Story

As a learner tracking my progress,
I want to see a chart of my memory retention strength over time,
So that I have visceral evidence the system is working and can spot weak areas.

## Background

The Insights page currently shows only raw stat cards and a flat event log — no visualisations. A retention curve chart would make abstract analytics meaningful and motivating.

## BDD Scenarios

### Scenario 1: Retention curve chart renders in Insights
```gherkin
Given I have reviewed at least 5 loci across multiple sessions
When I navigate to the Insights page
Then I see a line chart titled "Memory Strength Over Time"
And the X axis shows dates (last 30 days by default)
And the Y axis shows average recall score (0-100%)
```

### Scenario 2: Chart updates after each review session
```gherkin
Given I complete a walk session today with average rating "Good" (3/4 = 75%)
When I open Insights
Then today's point on the retention curve shows approximately 75%
```

### Scenario 3: Chart can be filtered by palace or route
```gherkin
Given I select "Biology" palace from a filter dropdown on the chart
When the chart re-renders
Then only recall events for Biology loci are plotted
```

### Scenario 4: Hovering a data point shows a tooltip
```gherkin
Given the retention curve is rendered
When I hover over a data point for "2026-04-20"
Then a tooltip shows: date, average score, number of loci reviewed that day
```

### Scenario 5: Flat or declining curve triggers a contextual tip
```gherkin
Given my average recall score has declined for 3 consecutive days
When I open Insights
Then a tip card reads "Your retention is trending down — consider shorter, more frequent sessions"
```

## Acceptance Criteria
- [ ] Line chart added to AnalyticsPanel (Recharts or custom SVG)
- [ ] Data derived from analytics events with type "Recall Rated"
- [ ] X axis: last 30 days; Y axis: average rating x 25 (converted to %)
- [ ] Palace/route filter dropdown
- [ ] Tooltip on hover with date, score, count
- [ ] Graceful empty state: "Review some loci to see your retention curve"
