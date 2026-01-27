---
phase: 02-autonomous-behavior
plan: 02
subsystem: behavior
tags: [mobx, state-machine, autonomous-agents, utility-ai]

# Dependency graph
requires:
  - phase: 02-01
    provides: Utility AI scoring system, Activity definitions, ActivityScore type
  - phase: 01-01
    provides: Character class with needs, overskudd, CharacterStore
provides:
  - Character state machine (idle/deciding/walking/performing)
  - Autonomous decision-making using Utility AI
  - Position tracking and movement
  - Low overskudd refusal and comfort behavior
affects: [02-03-thought-bubble-ui, 03-activity-loop]

# Tech tracking
tech-stack:
  added: []
  patterns: [state-machine-pattern, autonomous-agents, time-based-callbacks]

key-files:
  created: []
  modified:
    - src/stores/CharacterStore.ts
    - src/types/game.ts
    - src/data/characters.ts
    - src/components/CharacterPanel.tsx

key-decisions:
  - "Blue personality deliberates 2000ms, others 800ms"
  - "Blue personality walks at 30 px/game-min, others at 50 px/game-min"
  - "Walking speed scales with overskudd (overskudd/100 * baseSpeed)"
  - "Overskudd < 20 always refuses, 20-40 gradual refusal probability"
  - "2 game-minute cooldown between decisions"

patterns-established:
  - "State machine pattern: idle -> deciding -> walking -> performing -> idle"
  - "setTimeout with runInAction for MobX-safe async state updates"
  - "Character.update() called each tick for state machine processing"

# Metrics
duration: 8min
completed: 2026-01-27
---

# Phase 2 Plan 2: Character State Machine Summary

**Character state machine with idle/deciding/walking/performing states, autonomous Utility AI-driven decisions, and low-overskudd comfort behavior fallback**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-27
- **Completed:** 2026-01-27
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Character state machine cycles through idle -> deciding -> walking -> performing
- Utility AI integration for personality-driven activity selection
- Position tracking with movement toward activity locations
- Low overskudd detection triggers comfort behavior fallback
- Blue personality (Elling) deliberates and walks slower than White (Mother)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add initialPosition to CharacterData and character data** - `5e8ac0d` (feat)
2. **Task 2: Extend Character class with state machine and autonomous behavior** - `0904586` (feat)

## Files Created/Modified

- `src/types/game.ts` - Added initialPosition field to CharacterData interface
- `src/data/characters.ts` - Added initial positions for Elling (100, 150) and Mother (280, 180)
- `src/stores/CharacterStore.ts` - Extended Character class with state machine, position, decision logic, walking, performing
- `src/components/CharacterPanel.tsx` - Fixed to render activity.name instead of Activity object

## Decisions Made

- **Decision duration by color:** Blue personality = 2000ms deliberation, others = 800ms. Creates observable difference in thought bubble display time.
- **Walk speed by color:** Blue = 30 px/game-min base, others = 50 px/game-min. Elling moves slower, more contemplatively.
- **Speed scales with overskudd:** Actual speed = (overskudd/100) * baseSpeed. Low wellbeing = slower movement.
- **Refusal thresholds:** < 20 overskudd = always refuse normal activities; 20-40 = gradual probability ((40-overskudd)/20 chance)
- **Cooldown period:** 2 game-minutes between decisions to prevent instant re-decision loop

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed CharacterPanel rendering Activity object**
- **Found during:** Task 2 (after changing currentActivity type from string to Activity)
- **Issue:** CharacterPanel tried to render `character.currentActivity` directly as ReactNode, but type changed from `string | null` to `Activity | null`
- **Fix:** Changed to `character.currentActivity?.name ?? 'Idle'`
- **Files modified:** src/components/CharacterPanel.tsx
- **Verification:** TypeScript compiles, build succeeds
- **Committed in:** 0904586 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary for type compatibility. No scope creep.

## Issues Encountered

None - plan executed smoothly with one type fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Character state machine complete and functional
- Ready for 02-03: Thought Bubble UI to visualize decision process
- pendingScores array populated during 'deciding' state for thought bubble display
- activityProgress available during 'performing' state for progress indicators

---
*Phase: 02-autonomous-behavior*
*Completed: 2026-01-27*
