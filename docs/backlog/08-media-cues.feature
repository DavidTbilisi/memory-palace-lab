# ROI: Medium to High
# Psych leverage: High through dual coding, but only after review and analytics are already in place.
# Tech leverage: Medium, because storage and playback add complexity.

Feature: Media cues for dual coding
  In order to strengthen memory through multiple channels
  As a learner
  I want nodes and palaces to support image and audio cues

  Background:
    Given the user has already encoded concepts into nodes and routes

  Scenario: Attach an image cue to a node
    Given a node benefits from visual reinforcement
    When the user adds an image cue
    Then the image is attached, persisted, and available during review

  Scenario: Attach an audio cue to a node
    Given pronunciation, rhythm, or emotional tone matters
    When the user adds an audio cue
    Then the cue can be played during review and persists across restarts

  Scenario: Use media selectively
    Given a palace contains many nodes
    When media cues are added
    Then the user can keep media on only the highest-value concepts instead of cluttering everything

  Scenario: Integrate media into review
    Given a node has media cues
    When the user reviews that node
    Then the review flow can reveal media as an optional reinforcement layer

  Scenario: Keep performance and storage reasonable
    Given many media assets exist
    When the palace loads
    Then the app remains responsive and does not degrade into asset management overhead

