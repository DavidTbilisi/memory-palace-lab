# ROI: High
# Psych leverage: High — the walk order is the retrieval scaffold, so a route that is slow to build,
#   invisible on the canvas, or silently corrupted costs recall directly. The method also calls
#   reverse walks non-optional and asks for long routes to be split into rooms.
# Tech leverage: Medium; one route overlay, one settings column, and pure route-building services
#   replace a form panel whose Route mode did nothing.
# Wiki source: memory-palace, mind-palace, neighborhood-palace (reverse walks),
#   geography-mnemonic-route (split long routes)
# Status: in progress. Part 1 (builder: panel, canvas paths, click-to-add, saved views per
#   stop, color and visibility, reliability fixes) is delivered with this file; part 2
#   (@part-2) is next.

Feature: Route builder
  In order to turn a palace into a walk I can rehearse without fighting the tool
  As a learner
  I want to build routes by clicking nodes, see them on the canvas, and tune each route

  Background:
    Given the route panel sat above the canvas and listed only the active route
    And building a route took two clicks per stop: select a node, then "Add selected node to route"
    And Route mode changed nothing on the canvas, and routes were never drawn there

  @part-1
  Scenario: Build a route by clicking nodes in order
    Given a palace with memory nodes
    When the user presses Route in the toolbar
    Then Route mode is on for the active route, creating "Route 1" first if the palace has none
    And each memory node the user clicks becomes the next stop
    And the path and its stop numbers appear on the canvas as the stops are added
    When the user presses Done or Escape
    Then Route mode ends and ordinary selection resumes

  @part-1
  Scenario: Frame each stop while building, like the scenes of a film
    Given Route mode is on and saving the view with each stop is on, as it is by default
    When the user zooms and pans the canvas and then clicks a node
    Then the new stop keeps that view: the visible area, placed relative to the node
    And the message says the stop was added with this view
    When the user walks the route
    Then the canvas moves to each stop's saved view, fitted to the canvas as it is then
    And a stop without a saved view zooms to its node, as before
    When the user turns saving views off in the Route mode banner
    Then stops added from then on have no saved view, and the choice is remembered

  @part-1
  Scenario: Change a stop's saved view later
    Given a stop in the Routes tab
    When the user presses its camera button
    Then the current view is saved for that stop, if its node is in sight
    And for a stop with a saved view, the camera button offers to show the view, replace it with the current view, or remove it
    And replacing or removing a view can be undone from the message that follows
    And a node that moved takes its stop's view along with it

  @part-1
  Scenario: A node is not added to the same route twice by accident
    Given "Kitchen sink" is stop 3 of the active route
    When the user clicks "Kitchen sink" in Route mode
    Then no stop is added
    And the user is told that "Kitchen sink" is already stop 3

  @part-1
  Scenario: Add several selected nodes at once
    Given the user has selected four memory nodes on the canvas
    When the user chooses "Add selected" with an order of selection, left to right, top to bottom, or shortest walk
    Then the nodes that are not yet in the route are appended in that order
    And nodes already in the route are skipped and counted in the message

  @part-1
  Scenario: A new route is ready to use
    When the user creates a route from the Routes tab
    Then it gets a unique name and its own color
    And it becomes the active route and Route mode starts for it

  @part-1
  Scenario: Routes live in a tab beside the inspector
    When the user opens the Routes tab
    Then every route in the palace is listed with its color, stop count, and due count
    And the active route is expanded to show its stops
    And the canvas keeps its full height

  @part-1
  Scenario: Edit a route's stops in place
    Given the active route is expanded
    Then the user can drag a stop, or use the arrow keys on its handle, to move it to any position
    And clicking a stop selects its node and shows the stop's saved view, or else zooms to the node
    And a stop shows its node's current title unless the user gave the stop its own label
    And removing a stop can be undone from the message that follows

  @part-1
  Scenario: See routes on the canvas
    Given a palace with two routes
    Then each shown route is drawn as arrows between its stops in the route's color
    And each stop shows its number in the route's color
    When the user hides one route
    Then only the other route is drawn
    And the choice of color and visibility is kept after the palace is saved and reopened

  @part-1
  Scenario: The node inspector knows a node's routes
    Given a node is a stop in two routes
    When the user selects the node
    Then the inspector lists both routes with the node's stop number
    And the user can add the node to another route from there

  @part-1
  Scenario: Pick the route to walk from the walk bar
    Given a palace with several routes
    When the user picks a route in the walk bar before starting a walk
    Then that route becomes the active route
    And turning Walk on starts from its first stop

  @part-1
  Scenario: Route data stays intact
    Then routes keep the order the user gave them after the desktop app reloads a palace
    And deleting a node removes its stops, and undoing the delete brings them back
    And stops whose node no longer exists are not saved
    And editing the palace in the DSL keeps the active route and leaves an unaffected walk running
    And a node listed twice in a DSL route gets two distinct stops
    And edits made through MCP keep each route's color, visibility, and order, and each stop's saved view
    And the last rating of a walk is recorded with its walk session

  @part-2
  Scenario: Walk a route backwards
    Given a route whose walk direction is set to reverse or alternate
    When the user starts a walk
    Then the stops are visited from last to first, or in the opposite direction from the previous walk

  @part-2
  Scenario: Keep a draft route out of the review queue
    Given a route marked "not in review"
    Then its stops are never listed as due
    And turning review back on schedules them again

  @part-2
  Scenario: Describe a route
    When the user adds notes to a route
    Then the notes are shown with the route and kept with the palace

  @part-2
  Scenario: Split a long route into sections
    Given a route with more than twelve stops
    When the user starts a section at a stop and names it
    Then the stops are grouped under their section in the Routes tab and during a walk

  @part-2
  Scenario: Route settings in the DSL and MCP
    When a route is written in the DSL or read through MCP
    Then its color, visibility, walk direction, review setting, and notes are included
    And applying the DSL or an MCP update changes them
