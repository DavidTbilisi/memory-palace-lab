## User Story

As a learner who struggles to make facts memorable,
I want an AI assistant that suggests a vivid memory image or story for a node's content,
So that I can encode dry information into the palace more effectively.

## Background

The most common failure point in memory palace practice is encoding. Users know *what* to remember but not *how* to make it stick. An AI suggestion that transforms "mitochondria produce ATP via oxidative phosphorylation" into a vivid scene dramatically lowers this barrier.

## BDD Scenarios

### Scenario 1: "Help me encode" button appears in NodeInspector
```gherkin
Given I have a node selected with a non-empty Title or Content field
When the NodeInspector renders
Then I see a "Help me encode this" button below the Content textarea
```

### Scenario 2: Clicking the button requests an encoding suggestion
```gherkin
Given I have a node with Title "Mitochondria" and Content "Produces ATP via oxidative phosphorylation"
When I click "Help me encode this"
Then a loading state appears ("Generating encoding...")
And the app calls the AI API with the node title and content
```

### Scenario 3: Suggestion is shown as a non-destructive proposal
```gherkin
Given the AI has returned an encoding suggestion
When the suggestion renders
Then it appears in a card below the Content field (not replacing it)
And I see "Use this encoding" and "Dismiss" buttons
```

### Scenario 4: Accepting the suggestion appends it to the Content field
```gherkin
Given a suggestion is displayed
When I click "Use this encoding"
Then the suggestion text is appended to the Content field (prefixed with "Encoding: ")
And the suggestion card is dismissed
```

### Scenario 5: AI is unavailable gracefully
```gherkin
Given the AI API key is not configured
When I click "Help me encode this"
Then a message reads "AI encoding requires an API key. Add it in Settings."
And a link to the settings area is shown
```

## Acceptance Criteria
- [ ] "Help me encode this" button in NodeInspector (only when title or content is non-empty)
- [ ] Integration with Claude API using node title + content as prompt
- [ ] Suggestion rendered as a dismissible proposal card, not overwriting content
- [ ] "Use this" appends to content, "Dismiss" removes the card
- [ ] Graceful error handling when API is unavailable or key is missing
- [ ] API key stored in app settings (not hardcoded)
