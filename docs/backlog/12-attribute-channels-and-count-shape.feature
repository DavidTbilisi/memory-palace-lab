# ROI: High
# Psych leverage: High — a single content blob is unidimensional by construction, which is
#   exactly the failure the wiki names: the list reads back perfectly and dies under time pressure.
# Tech leverage: Medium-high; the count-shape half is a canvas layout command, which is the
#   app's native medium and something no markdown page can do.
# Wiki source: theSystem/wiki/multi-attribute-encoding.md, theSystem/wiki/multi-valued-attributes.md,
#   theSystem/wiki/encoding-dimensionality.md, theSystem/wiki/representation-rules.md (Rules 10-11),
#   theSystem/wiki/universal-mental-tagging-framework.md

Feature: Attribute channels and count-shape layout
  In order to hold several attributes of one item without collapsing them into a list
  As a learner
  I want attributes assigned to orthogonal channels, and sets laid out as the polygon of their own size

  Background:
    Given a node stores its encoding as one free-text content field
    And UMTF supplies the channel vocabulary that the wiki treats as canonical

  Scenario: Assign an attribute to a channel
    Given an item carries several attributes at once
    When the user encodes it
    Then each attribute can be placed on a named channel
    And the channel set offered is UMTF's, not one invented in the app

  Scenario: Catch a channel collision
    Given two attributes of the same node are assigned to the same channel
    When the node is validated
    Then the collision is reported, because two values on one channel is the failure this feature exists to prevent

  Scenario: Route a multi-valued attribute
    Given one attribute of an item has several values
    When the user encodes it
    Then the app asks what retrieval will demand and offers dissolve, address, or enumerate
    And only the enumerate route requires a completeness checksum

  Scenario: Lay a set out as its own polygon
    Given a node has between two and seven children
    When the user runs the count-shape layout
    Then the children are placed at the vertices of the polygon of that size
    And the polygon itself is not drawn as a node

  Scenario: Read an empty corner as a checksum
    Given a set was laid out as a pentagon and one member is missing
    When the user looks at the arrangement
    Then the empty vertex is visible before any label is read

  Scenario: Refuse to draw a nonagon
    Given a set has more than seven members
    When the user runs the count-shape layout
    Then the app lays them out as an ordered ladder instead
    And it says why, because above seven the polygon stops being a checksum
