---
phase: 05-crisis-sequence
plan: 02
subsystem: character
tags: [shadow-state, warning-signs, crisis, mobx, computed]

# Dependency graph
requires:
  - phase: 05-01
    provides: CrisisStore with crisisState machine
provides:
  - inShadowState computed property for Blue characters
  - shadowPenalty getter for crisis action success modification
  - currentWalkSpeed with Day 10 warning sign slowdown
  - isWorriedAboutMother for Elling concern detection
affects: [05-03-crisis-ui, 05-04-epilogue]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Cross-store computed observation (Character observes CrisisStore state)
    - Warning sign progression (time-based modifier stacking)

key-files:
  created: []
  modified:
    - src/stores/CharacterStore.ts

key-decisions:
  - "Shadow state at overskudd < 30 during active crisis"
  - "Mother slowdown progressive: 80% at 8am, 60% at 11am, 30% at 1pm"
  - "Elling worried detection based on hour >= 11 during warning phase"

patterns-established:
  - "Character-level crisis awareness via computed properties"
  - "Warning signs as observable behavioral changes"

# Metrics
duration: 2min
completed: 2026-01-28
---

# Phase 5 Plan 2: Character Crisis Behaviors Summary

**Shadow state for Elling (Blue paralysis) and progressive warning signs for Mother on Day 10**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T20:35:03Z
- **Completed:** 2026-01-28T20:37:04Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments

- Elling has `inShadowState` computed property triggering during active crisis when overskudd < 30
- `shadowPenalty` getter returns 20 (for -20% crisis action success) when in shadow
- Mother's `currentWalkSpeed` progressively reduces on Day 10: 80% at hour 8, 60% at hour 11, 30% at hour 13
- Elling's `isWorriedAboutMother` detects warning phase and hour >= 11 for concerned thought bubbles

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Shadow State to Character** - `3def93f` (feat)
2. **Task 2: Add Warning Sign Movement for Mother** - `0321d7d` (feat)
3. **Task 3: Add Elling Concern Thought** - `54d98af` (feat)

## Files Created/Modified

- `src/stores/CharacterStore.ts` - Added 4 new computed properties: inShadowState, shadowPenalty, currentWalkSpeed, isWorriedAboutMother

## Decisions Made

- Shadow state threshold confirmed at overskudd < 30 (matching STATE.md decision from 05-01)
- Warning sign progression uses hour thresholds (8, 11, 13) rather than continuous interpolation for clear visual steps
- Elling concern detection tied to same hour threshold as Mother's visible slowdown (hour 11)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Character crisis behaviors complete
- Ready for 05-03 (Crisis UI) to consume these computed properties:
  - `inShadowState` for visual shadow indicator
  - `shadowPenalty` for displaying action success chance
  - `currentWalkSpeed` animates Mother's slower movement
  - `isWorriedAboutMother` can trigger thought bubble content

---
*Phase: 05-crisis-sequence*
*Completed: 2026-01-28*
