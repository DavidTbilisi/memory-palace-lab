# ROI: High
# Psych leverage: Very High, because vivid self-generated imagery sticks better than flat text.
# Tech leverage: Medium, because it needs good UX more than deep infrastructure.

Feature: Encoding assistant
  In order to turn dry facts into memorable material
  As a learner
  I want the app to help transform plain notes into vivid memory cues

  Background:
    Given a user can create or edit memory nodes

  Scenario: Suggest vivid encodings
    Given a node contains abstract or dry text
    When the user invokes the encoding assistant
    Then the app suggests image, action, emotion, exaggeration, and place cues

  Scenario: Generate multiple styles
    Given the same source concept
    When the user requests encoding help
    Then the app can offer serious, bizarre, and highly visual variants

  Scenario: Preserve user authorship
    Given the app suggests an encoding
    When the user chooses one
    Then the user can edit and personalize it before saving

  Scenario: Connect encoding to palace placement
    Given a user selects a palace locus
    When the encoding assistant generates suggestions
    Then the suggestions can reference that place explicitly

  Scenario: Improve later recall
    Given a generated encoding is used in review
    When analytics compare encoded vs non-encoded material
    Then the app can later show whether the encoding style is helping

