# ROI: Very High
# Psych leverage: Very High, because feedback only matters when it changes the next learning action.
# Tech leverage: Very High, because it uses analytics, review, routes, and node metadata that already exist.
# Status: delivered 2026-11, as two sequential PRs off main (#125, PR 2):
#   PR 1 — suggestions and the ones that launch directly: re-encode a failing node (which restarts
#     its schedule), link an unlinked confusion pair, add a missing Distinguisher. The full list is
#     on Insights › Strength; the most urgent one is a card at the top of the Review page. Each
#     accepted suggestion is logged as an analytics event.
#     Built 2026-11-04. A node is failing at Again or Hard on 3 of its last 5 Siege ratings; ratings
#     before it was last re-encoded through a suggestion do not count. Re-encode opens the node in
#     Encode mode under a banner whose Done gives every stop of the node a new stop's schedule (NEDF
#     and timeline cards included). Linking happens where the learner is; adding a Distinguisher
#     opens the node. Accepted suggestions are `intervention_accepted` events.
#   PR 2 — route surgery the app proposes and the learner applies (split at the slowest stop or a
#     section boundary, or move the weakest stops into a short route of their own), with Undo; and
#     before/after recall for each accepted intervention once 3 or more later ratings exist.
#     Built 2026-11-04. A route the Strength tab marks unstable or cognitively expensive gets one
#     proposal: 8+ stops split at the section boundary nearest the middle (else before the slowest
#     stop in the middle half); shorter routes move their stops last rated Again or Hard (2 to 5)
#     into "<route> · weak spots". Fix route shows the proposal; Apply changes it; Undo puts the
#     stops back where they were, keeping reviews made since. A fixed route is not proposed again
#     until 5 ratings land on it. "Did it help?" on the Strength tab compares Good-or-Easy recall
#     over the 5 ratings before and after each accepted intervention, once 3 follow it.
# Decisions (David, 2026-11-04): Strength tab + Review page; re-encoding restarts the node's
#   schedule; route changes are proposed and confirmed, never made silently; before/after is shown
#   per intervention.

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
