# ROI: Very high
# Psych leverage: Very high — 4x retrieval pressure per concept at ~1x authoring cost.
# Tech leverage: High, because the scheduling machinery already exists; only the key changes.
# Wiki source: theSystem/wiki/encoded-spaced-repetition.md, theSystem/wiki/nedf-overview.md
# Note: NEDF appears in ten theSystem docs and zero lines of src/. This closes that gap.

Feature: NEDF slots on the node, four schedules per concept
  In order to drill a concept from four directions instead of one
  As a learner
  I want each NEDF slot to carry its own spaced-repetition schedule

  Background:
    Given a memory node currently stores a free-text title and content blob
    And a locus carries exactly one interval, ease factor, and repetition count

  Scenario: Encode a concept in four slots
    Given the user is editing a concept node
    When they open the NEDF view in the inspector
    Then they can fill Name-hook, Essence, Distinguisher, and Failure independently
    And a node with any slot filled is marked as NEDF-encoded

  Scenario: Each slot schedules independently
    Given a node has all four NEDF slots filled
    When the node is added to a route as a locus
    Then the locus tracks four separate schedules, one per slot
    And a slot the learner keeps failing comes due more often than its siblings

  Scenario: Walk mode asks the slot's own question
    Given a locus is due on its Distinguisher slot
    When the user reaches it in walk mode
    Then the prompt is a discrimination question, not a generic "what goes here"
    And Name-hook prompts recognition, Essence prompts recall, and Failure prompts diagnosis

  Scenario: Partial encoding degrades gracefully
    Given a node has only a Name-hook and an Essence
    When it is reviewed
    Then only the two filled slots are scheduled
    And the node reports which slots are unencoded rather than failing them

  Scenario: Existing nodes keep working
    Given a palace saved before this feature existed
    When it is opened
    Then every node still reviews on its single legacy schedule
    And no locus loses its interval, ease factor, or repetition history

  Scenario: Slot coverage is visible
    Given a palace contains NEDF-encoded and plain nodes
    When the user opens Insights
    Then per-slot retention is reported separately
    And nodes whose Failure slot is empty are listed, because that slot is the one most often skipped
