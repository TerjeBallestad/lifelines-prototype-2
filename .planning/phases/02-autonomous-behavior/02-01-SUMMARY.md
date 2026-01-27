---
phase: 02-autonomous-behavior
plan: 01
subsystem: ai
tags: [utility-ai, mtg-colors, activities, scoring]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Character class with MTGColorProfile and Needs
provides:
  - Activity type with colorAffinities and location
  - 10 activity definitions (8 regular + 2 comfort behaviors)
  - Utility AI scoring system for activity selection
affects: [02-02, 02-03, activity-loop, quest-system]

# Tech tracking
tech-stack:
  added: []
  patterns: [utility-ai-scoring, color-affinity-matching, weighted-random-selection]

key-files:
  created:
    - src/data/activities.ts
    - src/systems/UtilityAI.ts
  modified:
    - src/types/game.ts

key-decisions:
  - "utility = (colorMatch * 0.6) + (needSatisfaction * 0.4) - personality dominates but needs still matter"
  - "Weighted random from top 3 candidates within 80% of best score - adds variety without sacrificing quality"
  - "Comfort behaviors excluded from main scoring - reserved for low overskudd fallback"
  - "Neutral activities (no color affinities) return 0.5 colorMatch - neither preferred nor avoided"

patterns-established:
  - "Utility AI scoring: calculate colorMatch and needSatisfaction separately, then combine with weights"
  - "Activity data: colorAffinities as Partial<Record<MTGColor, number>> for sparse color definitions"
  - "Comfort behaviors: isComfortBehavior flag for low-overskudd fallback activities"

# Metrics
duration: 3min
completed: 2026-01-27
---

# Phase 02 Plan 01: Utility AI & Activity System Summary

**Utility AI scoring system with 10 activities that ranks Blue activities (Reading, Thinking) for Elling and White activities (Cooking, Cleaning) for Mother based on MTG color personality profiles**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-27T21:23:27Z
- **Completed:** 2026-01-27T21:26:40Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Activity and CharacterState types defined in game.ts
- 10 activities with MTG color affinities (8 regular + 2 comfort behaviors)
- Utility AI scoring system that correctly prefers personality-matched activities
- Verified: Elling prefers Reading/Thinking (Blue), Mother prefers Cooking/Cleaning (White)

## Task Commits

Each task was committed atomically:

1. **Task 1: Define Activity and CharacterState types** - `daef72f` (feat)
2. **Task 2: Create activity definitions data** - `1029465` (feat)
3. **Task 3: Implement Utility AI scoring system** - `ebb025d` (feat)

## Files Created/Modified

- `src/types/game.ts` - Added Activity, CharacterState, ActivityScore interfaces
- `src/data/activities.ts` - 10 activity definitions with color affinities
- `src/systems/UtilityAI.ts` - calculateColorAffinity, calculateNeedSatisfaction, scoreActivities, selectActivity

## Decisions Made

1. **Utility formula weights (60% color, 40% needs):** Personality drives behavior but survival needs still matter. This answers the open question from STATE.md about color affinity formula.

2. **Weighted random selection:** Top 3 candidates within 80% of best score prevents always picking #1, adds believable variety to character behavior.

3. **Separate comfort behavior scoring:** Comfort behaviors are scored by color match only (no need satisfaction) since they're fallback activities for struggling characters.

4. **Need normalization factors:** energy/20, social/10, purpose/20 - scales effects to 0-1 range for fair comparison.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for Phase 02-02 (Thought Bubble UI):
- Activity type available for rendering
- scoreActivities returns ActivityScore[] with activity details for display
- selectActivity provides chosen activity for thought bubble

Ready for Phase 02-03 (Decision Loop):
- Utility AI scoring system complete
- Can integrate into character update loop to select activities

---
*Phase: 02-autonomous-behavior*
*Completed: 2026-01-27*
