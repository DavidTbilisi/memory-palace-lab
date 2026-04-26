# ROI: Very High
# Psych leverage: Very High, because spacing turns one good review into long-term retention.
# Tech leverage: High, because it creates the persistent review engine for the app.

Feature: Spaced review queue
  In order to revisit information at the right time
  As a learner
  I want the app to schedule reviews based on actual recall performance

  Background:
    Given recall-first ratings are stored
    And analytics history exists for each reviewed node

  Scenario: Compute next due date from recall quality
    Given a node was graded during review
    When the session is completed
    Then the app computes the next review date using that grade

  Scenario: Build a due queue
    Given multiple nodes and routes have next review dates
    When the user opens the review queue
    Then the app orders due and overdue items ahead of fresh or stable ones

  Scenario: Review at node and route levels
    Given some material is best reviewed as a route
    And some material is best reviewed as a single concept
    When the queue is generated
    Then the app can schedule both node-level and route-level review items

  Scenario: Prevent silent neglect
    Given a palace has overdue material
    When the user opens the app
    Then the interface makes overdue review visible without blocking normal graph work

  Scenario: Stay local and persistent
    Given spaced review data has been generated
    When the app restarts
    Then the queue and due dates persist

