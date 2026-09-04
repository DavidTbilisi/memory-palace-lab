# ROI: Medium-high
# Psych leverage: High — the app currently implements only half of a two-phase strategy,
#   and it is the half that cannot get you to volume.
# Tech leverage: Medium; a session mode over the existing review queue.
# Wiki source: theSystem/wiki/storm-and-siege-protocol.md,
#   theSystem/wiki/sleep-dependent-memory-consolidation.md

Feature: Storm and Siege sessions
  In order to accumulate volume as well as preserve it
  As a learner
  I want a Storm session mode alongside the daily Siege drip the review queue already runs

  Background:
    Given the review queue schedules a due-based daily drip
    And that drip is the Siege phase
    And there is no way to run the Storm phase, the single massive accumulation push

  Scenario: Run a Storm session
    Given the user wants one large memorization push
    When they start a Storm session with a target count
    Then the session runs until the target is hit or the user stops
    And progress against the target is visible throughout

  Scenario: Record a day of records
    Given a Storm session finishes
    When the results are written
    Then the session's count, duration, and rate are recorded
    And a personal best is marked when one is set

  Scenario: Hand off to Siege
    Given a Storm session encoded a batch of new material
    When the session closes
    Then that material enters the normal review queue
    And Storm is treated as the accumulation phase, not a replacement for scheduling

  Scenario: Schedule against sleep
    Given new material was encoded in a Storm session
    When the app proposes the first review
    Then the proposal accounts for the sleep-consolidation window rather than a fixed hour offset

  Scenario: Do not let Storm corrupt the metrics
    Given a Storm session produced a large burst of events
    When retention statistics are computed
    Then Storm-phase reviews are distinguishable from Siege-phase reviews
    And the daily review goal is not reported as met purely by a Storm burst
