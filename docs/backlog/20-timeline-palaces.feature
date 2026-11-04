# ROI: High
# Psych leverage: High — dates are the classic weak spot of a palace: the event is vivid, the year
#   is not. Giving the year its own image and its own card in both directions, and drilling order
#   as order, attacks the three ways a timeline is forgotten (when, what, and before/after).
# Tech leverage: High — a third generated store on the machinery from 14 (palaces.store_json,
#   addressed store nodes, a store route), and a second card family beside NEDF slots.
# Wiki source: theSystem/wiki/memory-palace-architecture-for-neural-os.md (Reflective district:
#   "timeline / biography palace"), theSystem/calendar-time-memorization.md (date log format),
#   theSystem/mind-palace.md ("order matters: ... timeline"), and the dated mnemonics on
#   biography pages such as theSystem/wiki/bertrand-russell.md.
# Status: planned 2026-11. Two sequential PRs off main:
#   PR 1 — the timeline store: events, scaled axis, eras as rooms, date images, date-ordered route.
#     Built 2026-11-03. A timeline is a store of kind "timeline" whose eras live in store_json;
#     an event's date is its node's address, and its date image points back at it with
#     mpPairNodeId. The axis, ticks, era rooms and span bars are locked decor shapes
#     (mpTimelineDecor), redrawn by every layout. Go to date finds the nearest event.
#   PR 2 — the drills: event -> date and date -> event cards, and the order drill.

Feature: Timeline palaces
  In order to remember when things happened and in what order, not only what happened
  As a learner
  I want a special palace that lays dated events out along a time axis and drills them as a timeline

  Background:
    Given generated loci stores exist and are marked by palaces.store_json
    And a timeline palace is a store of kind "timeline"
    And the app makes the axis, the eras' rooms and the placeholders; every image is the learner's

  # ---------- PR 1: the timeline store ----------

  Scenario: Create a timeline palace
    Given the learner names a timeline "Bertrand Russell"
    When they create a timeline palace
    Then a palace "Bertrand Russell · timeline" is created and opened
    And it is marked as a timeline store and shows the store badge in the atlas and sidebar
    And it has an empty axis and an empty route in date order that is visible and in review

  Scenario: Add a dated event
    Given a timeline palace is open
    When the learner adds the event "Discovers the paradox" dated 1901
    Then an event node is placed on the axis at 1901
    And a date-image node with the placeholder "1901 · image" sits beside it, linked to the event
    And the event becomes a route stop between the events dated before and after it
    And stops already on the route keep their schedules

  Scenario Outline: Dates the timeline accepts
    When the learner dates an event "<entered>"
    Then the event sorts as "<sorts as>" and its date-image placeholder reads "<placeholder>"

    Examples:
      | entered              | sorts as      | placeholder              |
      | 1901                 | 1901          | 1901 · image             |
      | 1969-07              | 1969-07       | 1969-07 · image          |
      | 1969-07-20           | 1969-07-20    | 1969-07-20 · image       |
      | 1910–1913            | 1910 (span)   | 1910–1913 · image        |
      | 490 BCE              | -489          | 490 BCE · image          |

  Scenario: Position follows the date
    Given events dated 1872, 1894 and 1901 are on the axis
    Then the gap between 1872 and 1894 is drawn wider than the gap between 1894 and 1901
    And an event with an end date is drawn with a span bar to its end

  Scenario: Events on the same date stack
    Given two events are dated 1913
    Then they stack at the same point on the axis instead of overlapping
    And they keep the order the learner added them in on the route

  Scenario: Eras are rooms along the axis
    Given the learner names an era "Principia years" from 1900 to 1913
    Then a named band is drawn behind the axis from 1900 to 1913
    And the route list groups its stops into sections by era
    And events outside every era sit in an unnamed gap between rooms

  Scenario: Re-dating an event moves it
    Given the event "Prison" is dated 1916 by mistake
    When the learner changes its date to 1918
    Then the event and its date image move to 1918 on the axis
    And its stop moves to its new place in the route with its schedule kept
    And a date-image node still showing its placeholder is renamed to "1918 · image"
    But a date-image node the learner has renamed is left as they named it

  Scenario: Removing an event never removes a filled date image silently
    Given an event's date-image node has been renamed by the learner
    When the learner deletes the event
    Then the app asks before deleting the date image too

  # ---------- PR 2: the drills ----------

  Scenario: A timeline stop has two cards
    Given a timeline event with a date
    Then its stop reviews on two cards with their own schedules: "Event → date" and "Date → event"
    And NEDF slots filled on the event node add their own cards as on any stop

  Scenario: Event → date card
    When an "Event → date" card is reviewed
    Then the event node is shown
    And the date-image node and the date stay hidden until Reveal

  Scenario: Date → event card
    When a "Date → event" card is reviewed
    Then the date and its date-image node are shown
    And the event node stays hidden until Reveal

  Scenario: Order drill
    Given a timeline has at least three dated events
    When the learner starts an order drill
    Then the app shows a run of up to five neighbouring events in shuffled order, without dates
    And the learner puts them back in order
    And the app shows which events were out of place, with their dates
    And events dated the same day count as correct in either order

  Scenario: A misplaced event is pulled forward
    Given an event was out of place in an order drill
    Then its "Event → date" card becomes due now
    And the drill is logged as an analytics event with how many events were out of place

  Scenario: The order drill aims at weak spots
    Given some events on the timeline have weak or overdue cards
    When the learner starts an order drill
    Then the run is centred on the weakest event rather than chosen at random

  # ---------- Left out ----------
  # - Fixed calendar rings (24-hour compass ring, months, days, weekdays) — a separate store kind.
  # - Importing a wiki page's mermaid `timeline` block as events — good follow-up; the biography
  #   pages already carry one.
  # - MCP, CLI and DSL verbs for timeline events — follow-up once the store's shape has settled.
  # - Year images suggested by the app or taken from a support table — the learner types them.
