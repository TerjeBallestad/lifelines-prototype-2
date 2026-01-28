---
phase: 05-crisis-sequence
plan: 01
subsystem: crisis
tags: [mobx, state-machine, crisis, day-10]

# Dependency graph
requires:
  - phase: 03-activity-loop
    provides: SkillSystem with calculateSuccessChance
  - phase: 04-quest-system
    provides: QuestStore pattern for reactive state management
provides:
  - CrisisStore with state machine (inactive -> warning -> active -> resolved)
  - Crisis action definitions with skill requirements
  - Action attempt tracking for retry penalties
  - Epilogue text for both endings
affects: [05-crisis-sequence]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Crisis state machine pattern following QuestStore approach
    - Hope bonus accumulation for assisting actions
    - Shadow state penalty integration with character overskudd

key-files:
  created:
    - src/stores/CrisisStore.ts
    - src/data/crisis.ts
  modified:
    - src/types/game.ts
    - src/stores/RootStore.ts

key-decisions:
  - "Phone action (call-emergency) is critical path - success saves Mother"
  - "Helper actions give hope bonus (+10% each, max +20%) to phone attempt"
  - "Retry penalty: -15% per previous attempt on same action"
  - "Shadow state threshold: overskudd < 30 during active crisis = -20% penalty"
  - "Social skill category for phone calls (requires communication training)"

patterns-established:
  - "Crisis state machine: inactive -> warning -> active -> resolved"
  - "Action attempt tracking: Map<string, number> for retry penalties"
  - "Hope bonus accumulation: limited to +20% max from helper actions"

# Metrics
duration: 2 min
completed: 2026-01-28
---

# Phase 5 Plan 1: Crisis Store Foundation Summary

**CrisisStore with state machine, action tracking, retry penalties, and hope bonus system for Day 10 crisis sequence**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-28T20:30:48Z
- **Completed:** 2026-01-28T20:32:37Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Crisis types defined (CrisisState, CrisisOutcome, CrisisAction, CrisisActionResult)
- Crisis data with 3 actions and epilogue narratives for both endings
- CrisisStore with full state machine and success chance calculation
- RootStore integration providing crisisStore access

## Task Commits

Each task was committed atomically:

1. **Task 1: Define Crisis Types** - `a46f58c` (feat)
2. **Task 2: Create Crisis Data** - `51f6f1c` (feat)
3. **Task 3: Create CrisisStore** - `8af8d98` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `src/types/game.ts` - Added CrisisState, CrisisOutcome, CrisisAction, CrisisActionResult types
- `src/data/crisis.ts` - CRISIS_ACTIONS array and EPILOGUE_TEXT for both endings
- `src/stores/CrisisStore.ts` - Full crisis state machine with action tracking
- `src/stores/RootStore.ts` - Added crisisStore import and instantiation

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Social skill for phone calls | Communication/phone skills align with social training activities |
| -15% retry penalty per attempt | Creates urgency without making repeated attempts completely useless |
| +10% hope bonus from helpers | Rewards diverse strategy (help mother/run to neighbor before calling) |
| Shadow penalty at overskudd < 30 | Matches Blue character's paralysis theme when overwhelmed |
| Max +20% hope bonus cap | Prevents stacking to guaranteed success, maintains tension |

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CrisisStore is wired and ready for UI integration
- Crisis triggers (shouldStartWarning, shouldTrigger) available for Game component
- Action success calculation ready with skill, retry, hope, and shadow modifiers
- Ready for 05-02: Crisis UI implementation

---
*Phase: 05-crisis-sequence*
*Completed: 2026-01-28*
