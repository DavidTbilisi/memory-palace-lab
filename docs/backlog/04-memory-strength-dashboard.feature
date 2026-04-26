# ROI: High
# Psych leverage: High, because visible weakness changes study behavior.
# Tech leverage: High, because it turns raw telemetry into decisions.

Feature: Memory strength dashboard
  In order to focus on weak and decaying knowledge
  As a learner
  I want a dashboard that shows memory strength, overdue review, and trend data

  Background:
    Given analytics and spaced review data exist

  Scenario: Show weak and overdue material
    Given nodes and routes have review history
    When the user opens the dashboard
    Then the app highlights weak, unstable, and overdue material first

  Scenario: Show palace-level health
    Given a palace contains many nodes and routes
    When the dashboard is rendered
    Then the user can see aggregate strength, review load, and failure hotspots for that palace

  Scenario: Show trend over time
    Given the user has completed multiple review sessions
    When the dashboard is rendered
    Then the user can see whether recall is improving, stagnating, or decaying

  Scenario: Show route friction
    Given a route consistently causes hesitation or failure
    When the dashboard is rendered
    Then the route is marked as cognitively expensive or unstable

  Scenario: Drive action
    Given weak or overdue material exists
    When the user clicks a dashboard item
    Then the app opens the related palace, node, or route and starts the appropriate review flow

