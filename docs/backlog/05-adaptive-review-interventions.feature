# ROI: Very High
# Psych leverage: Very High, because feedback only matters when it changes the next learning action.
# Tech leverage: Very High, because it uses analytics, review, routes, and node metadata that already exist.

Feature: Adaptive review interventions
  In order to turn analytics into better study behavior
  As a learner
  I want the app to recommend and launch the next best intervention when memory looks weak or unstable

  Background:
    Given analytics, recall ratings, review queue data, and dashboard signals already exist

  Scenario: Recommend re-encoding for weak material
    Given a node repeatedly scores again or hard
    When the dashboard evaluates that node
    Then the app recommends re-encoding instead of only repeating review

  Scenario: Recommend route surgery for unstable paths
    Given a route is cognitively expensive or has repeated hesitation
    When the dashboard evaluates that route
    Then the app recommends splitting, shortening, or reordering the route

  Scenario: Recommend contrast work for confusion hotspots
    Given failures cluster around similar concepts
    When the dashboard evaluates those failures
    Then the app recommends creating a contrast or confusion link

  Scenario: Launch the right intervention directly
    Given a recommendation exists
    When the user clicks the intervention
    Then the app opens the related node, route, or palace and starts the suggested workflow immediately

  Scenario: Measure whether the intervention helped
    Given a user accepted an intervention
    When later reviews are completed
    Then analytics can compare whether recall improved after that intervention
