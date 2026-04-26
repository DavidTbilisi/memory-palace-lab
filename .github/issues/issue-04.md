## User Story

As a serious learner,
I want each locus to have a calculated next-review date based on my recall history,
So that I review weak items soon and strong items less often — without deciding myself.

## Background

The review queue currently surfaces items based on recency signals but has no interval scheduling algorithm. Without SM-2 or FSRS, users cannot trust the system to tell them *when* something is due — which is the core promise of spaced repetition.

## BDD Scenarios

### Scenario 1: New locus gets an initial review interval
```gherkin
Given I create a new locus in a route
When the locus is saved
Then it is assigned an initial nextReviewAt date of now + 1 day
And its easeFactor is initialised to 2.5 (SM-2 default)
```

### Scenario 2: "Good" rating increases interval
```gherkin
Given a locus has been reviewed once with rating "Good" (3)
And its current interval is 1 day
When I rate it "Good" again
Then the new interval is approximately 6 days (SM-2: interval x easeFactor)
And nextReviewAt is updated accordingly
```

### Scenario 3: "Again" rating resets interval
```gherkin
Given a locus has an interval of 10 days
When I rate it "Again" (1) during a walk
Then the interval resets to 1 day
And the ease factor decreases by 0.2 (floor: 1.3)
```

### Scenario 4: Due loci appear at the top of the review queue
```gherkin
Given three loci have nextReviewAt dates: yesterday, tomorrow, and last week
When I open the Review page
Then the locus due last week appears first
And the locus due tomorrow does not appear in today's queue
```

### Scenario 5: Next-review date is visible in the NodeInspector
```gherkin
Given I select a node that has been reviewed
When the NodeInspector renders
Then I see "Next review: in 6 days" (or a specific date)
```

## Acceptance Criteria
- [ ] Locus domain entity gains `interval`, `easeFactor`, `nextReviewAt`, `repetitions` fields
- [ ] SM-2 formula applied when updating after a rating
- [ ] `buildReviewQueue` filters to loci where `nextReviewAt <= now`
- [ ] NodeInspector shows next-review date for reviewed loci
- [ ] Insights shows average interval and total due count
