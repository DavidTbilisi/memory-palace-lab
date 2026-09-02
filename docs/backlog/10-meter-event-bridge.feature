# ROI: Very high
# Psych leverage: Medium directly, high indirectly — it makes palace work count toward the
#   same trajectory numbers as everything else the learner does.
# Tech leverage: Very high, and the cheapest item on this list: a mapping, not a subsystem.
# Wiki source: theSystem/wiki/meter-overview.md; schema at Neural-OS-Research/tools/meter/meter/schema.py
# Note: an Anki bridge already feeds METER (tools/meter-anki-addon/). Palace work does not.

Feature: METER event bridge
  In order to see palace work in the same reports as every other Neural OS activity
  As a learner
  I want the app's analytics events mirrored into the METER append-only log

  Background:
    Given the app records AnalyticsEvent rows in its own SQLite table
    And METER reads an append-only JSONL log of events with layer, operation, metric_type, and metric_value
    And palace walks are currently invisible to Daily Glance, Weekly Review, and LPQ

  Scenario: Map an app event onto the METER schema
    Given a walk_recall_rated event is recorded
    When the bridge emits it
    Then layer is "performance" and operation is "review"
    And session_id carries the walk session and artifact_id carries the node
    And the app's payloadJson lands in METER's context field

  Scenario: Respect the METER data directory
    Given METER_DATA_DIR is set in the environment
    When the bridge writes events
    Then they append to that directory's events.jsonl
    And when the variable is unset the bridge resolves the project root the same way the meter CLI does

  Scenario: Never mutate history
    Given events have already been written
    When the bridge runs again
    Then it only appends
    And an event already emitted is not emitted twice

  Scenario: Survive a missing METER install
    Given the METER log directory does not exist or is not writable
    When the app records an event
    Then the app keeps working and stores the event locally as it does today
    And the failure is surfaced once, not on every event

  Scenario: Backfill what is already recorded
    Given the app has months of analytics events predating the bridge
    When the user runs the backfill
    Then those events are emitted in their original chronological order with their original timestamps

  Scenario: Reconcile the stale measurement doc
    Given theSystem/measurement-framework.md still describes the six-dimension belt model
    When the bridge ships
    Then that doc points at METER as the current measurement layer rather than competing with it
