# ROI: Very High
# Psych leverage: High, because it tells us which encoding and retrieval behaviors actually help.
# Tech leverage: Very High, because later review, personalization, and dashboards depend on it.

Feature: Analytics foundation for memory outcomes
  In order to improve memorization with evidence instead of guesswork
  As a serious learner
  I want the app to capture meaningful learning and review telemetry

  Background:
    Given the app already supports palaces, nodes, routes, walk mode, and draft recovery

  Scenario: Track retrieval outcome per step
    Given a user is reviewing a route in walk mode
    When the user reveals an answer and rates recall quality
    Then the app records the route, node, timestamp, recall quality, and time to reveal

  Scenario: Track encoding effort
    Given a user creates or edits nodes and edges
    When the user spends time encoding and restructuring material
    Then the app records session-level counts for nodes, edges, routes, edits, and review actions

  Scenario: Preserve privacy and local-first behavior
    Given analytics are enabled
    When telemetry is written
    Then the data stays local by default
    And the user can inspect what is being tracked

  Scenario: Support later analytics features
    Given review telemetry exists
    When later features request strength, weak zones, overdue items, or theme effectiveness
    Then the analytics model supports those queries without schema rewrites

  Scenario: Survive app restarts
    Given a user has prior review history
    When the app restarts
    Then analytics history remains available for dashboards and scheduling

