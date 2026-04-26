# ROI: Very High
# Psych leverage: Very High, because forced retrieval beats passive rereading.
# Tech leverage: High, because it creates the rating events needed for adaptive review.

Feature: Recall-first walk mode
  In order to strengthen retrieval instead of recognition
  As a learner
  I want walk mode to test me before showing the answer

  Background:
    Given analytics foundation exists
    And a route contains ordered loci

  Scenario: Hide answer until reveal
    Given the user starts recall-first mode
    When a step is shown
    Then the app shows only the cue, locus, and minimal prompt
    And the full answer stays hidden until reveal

  Scenario: Grade recall after reveal
    Given the user reveals the answer
    When the user grades recall as fail, hard, good, or easy
    Then the result is stored for the current node and route step

  Scenario: Support cue-only mode
    Given a node has title and content
    When cue-only mode is active
    Then the app shows the cue first
    And the full explanation appears only after reveal

  Scenario: Preserve step stability
    Given the user is stepping through a route
    When recall-first controls are rendered
    Then the controls stay spatially stable and easy to click

  Scenario: Feed later scheduling
    Given the user has completed a recall-first session
    When the session ends
    Then the graded results are available to the spaced review queue

