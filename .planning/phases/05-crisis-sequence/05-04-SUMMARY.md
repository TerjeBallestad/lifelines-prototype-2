---
phase: 05-crisis-sequence
plan: 04
subsystem: ui
tags: [react, mobx, framer-motion, daisyui, game-loop, epilogue]

# Dependency graph
requires:
  - phase: 05-03
    provides: CrisisModal component and CrisisStore action system
provides:
  - CrisisEpilogue component with two narrative endings
  - Game reset functionality for replay loop
  - Complete crisis gameplay sequence
  - Crisis difficulty balancing (panic penalty, attempt limits)
affects: [future-phases, game-loop]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Store reset pattern for game state cycling"
    - "Epilogue pattern with staggered text animation"

key-files:
  created:
    - src/components/CrisisEpilogue.tsx
  modified:
    - src/stores/RootStore.ts
    - src/stores/TimeStore.ts
    - src/stores/QuestStore.ts
    - src/stores/ResourceStore.ts
    - src/stores/SkillStore.ts
    - src/stores/CharacterStore.ts
    - src/stores/CrisisStore.ts
    - src/components/Game.tsx
    - src/components/CrisisModal.tsx
    - src/components/CrisisActionButton.tsx
    - src/data/crisis.ts

key-decisions:
  - "Max 3 total attempts before Mother dies automatically"
  - "-25% crisis panic penalty makes crisis genuinely difficult"
  - "Visual attempts-remaining indicator provides urgency feedback"
  - "Game reset reinitializes all stores and character skills"

patterns-established:
  - "Store reset pattern: each store has reset() method, RootStore.resetGame() coordinates"
  - "Epilogue outcome pattern: conditional rendering based on store outcome state"

# Metrics
duration: 58min
completed: 2026-01-28
---

# Phase 5 Plan 4: Crisis Epilogue Summary

**Epilogue screen with two narrative endings (saved/lost), complete game reset for replay, and crisis difficulty balancing with attempt limits**

## Performance

- **Duration:** 58 min
- **Started:** 2026-01-28T20:44:03Z
- **Completed:** 2026-01-28T21:41:58Z
- **Tasks:** 4 (3 auto + 1 checkpoint)
- **Files modified:** 11

## Accomplishments

- CrisisEpilogue component with outcome-appropriate Heart/Skull icons and staggered paragraph animation
- Two distinct narrative endings: "Mother Saved" (hopeful) and "Mother Lost" (somber with skill tip)
- Complete game reset system via RootStore.resetGame() coordinating all store resets
- Crisis difficulty balanced: -25% panic penalty, difficulty 3 phone call, max 3 attempts
- Visual attempts-remaining indicator in crisis modal provides clear urgency
- "Try Again" and "Return to Menu" buttons complete the gameplay loop

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CrisisEpilogue Component** - `2d33eef` (feat)
2. **Task 2: Add Game Reset Function** - `bac6fea` (feat)
3. **Task 3: Integrate CrisisEpilogue in Game.tsx** - `a979f78` (feat)
4. **Balance Changes** - `a031e8b` (fix) - Post-checkpoint tuning

## Files Created/Modified

- `src/components/CrisisEpilogue.tsx` - Epilogue screen with animated paragraphs and action buttons
- `src/stores/RootStore.ts` - Added resetGame() coordinator method
- `src/stores/TimeStore.ts` - Added reset() to return to day 1
- `src/stores/QuestStore.ts` - Added reset() to clear quest progress
- `src/stores/ResourceStore.ts` - Added reset() to clear and reinitialize resources
- `src/stores/SkillStore.ts` - Added reset() to clear character skills
- `src/stores/CharacterStore.ts` - Added reset() and Day 10 decay/speed changes
- `src/stores/CrisisStore.ts` - Added totalAttempts, maxAttempts, panic penalty
- `src/components/Game.tsx` - Integrated CrisisEpilogue render
- `src/components/CrisisModal.tsx` - Added attempts-remaining visual indicator
- `src/components/CrisisActionButton.tsx` - Fixed text overflow, responsive layout
- `src/data/crisis.ts` - Increased difficulties, shortened text

## Decisions Made

- **Max 3 attempts total:** Creates genuine tension - player can't indefinitely retry
- **-25% panic penalty:** Combined with difficulty 3 for phone call, makes crisis genuinely difficult without Social skill training
- **Mother's rapid deterioration on Day 10:** 3x/6x/10x overskudd decay and 0.4/0.2/0.05 speed multipliers make warning signs unmistakable
- **Visual attempts indicator:** Three colored bars provide immediate feedback on remaining chances
- **Store reset pattern:** Each store has its own reset() method, RootStore coordinates - clean separation of concerns

## Deviations from Plan

### Post-Checkpoint Balance Tuning

**1. [Rule 1 - Bug] Mother's warning signs too subtle**
- **Found during:** Checkpoint verification
- **Issue:** Mother's slowdown on Day 10 wasn't noticeable enough (0.8/0.6/0.3)
- **Fix:** Increased to dramatic slowdown (0.4/0.2/0.05) plus rapid overskudd decay
- **Files modified:** src/stores/CharacterStore.ts
- **Committed in:** a031e8b

**2. [Rule 1 - Bug] Crisis too easy to survive**
- **Found during:** Checkpoint verification
- **Issue:** Players could retry indefinitely and eventually succeed
- **Fix:** Added max 3 attempts, -25% panic penalty, difficulty 3 phone call
- **Files modified:** src/stores/CrisisStore.ts, src/data/crisis.ts
- **Committed in:** a031e8b

**3. [Rule 1 - Bug] Button text overflow on mobile**
- **Found during:** Checkpoint verification
- **Issue:** Long action names/descriptions overflowed button boundaries
- **Fix:** Added truncation, shortened text, responsive layout
- **Files modified:** src/components/CrisisActionButton.tsx, src/data/crisis.ts
- **Committed in:** a031e8b

---

**Total deviations:** 3 auto-fixed (3 bugs)
**Impact on plan:** Balance tuning essential for intended difficulty curve. No scope creep.

## Issues Encountered

None - plan executed smoothly with post-checkpoint balance refinement.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Crisis sequence complete:** Full gameplay loop from Day 1 through crisis resolution to restart
- **Phase 5 complete:** All crisis-related functionality implemented
- **Game playable:** Warning signs, crisis modal, skill-based actions, epilogue, and restart all functional
- **Ready for:** Polish, audio, additional content, or release preparation

---
*Phase: 05-crisis-sequence*
*Completed: 2026-01-28*
