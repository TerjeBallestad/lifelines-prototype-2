---
phase: 03-activity-loop
plan: 01
subsystem: game-systems
tags: [mobx, typescript, skills, resources, xp-system]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: [RootStore singleton pattern, CharacterStore with MTG color profiles]
  - phase: 02-autonomous-behavior
    provides: [Activity system, Utility AI scoring]
provides:
  - SkillCategory and ResourceType type definitions
  - SkillStore with XP tracking and computed levels
  - ResourceStore for global resource counts
  - Activity definitions with skillCategory and outputs
  - XP thresholds and output modifiers for skill progression
affects: [03-02, 03-03, 04-quest-system, 05-crisis-sequence]

# Tech tracking
tech-stack:
  added: []
  patterns: [CharacterSkill observable class, color-based skill initialization]

key-files:
  created:
    - src/stores/SkillStore.ts
    - src/stores/ResourceStore.ts
    - src/data/skills.ts
  modified:
    - src/types/game.ts
    - src/data/activities.ts
    - src/stores/RootStore.ts

key-decisions:
  - "XP thresholds: [0, 100, 300, 600, 1000] for levels 1-5"
  - "Output modifiers: [1.0, 1.0, 1.2, 1.5, 1.8, 2.0] for level-based resource scaling"
  - "MTG color to skill mapping: Blue->Creative, White/Green->Practical, Red->Social, Black->Technical"
  - "Starting bonus: Primary color grants 100 XP (level 2) in associated skill category"

patterns-established:
  - "CharacterSkill class: MobX observable with computed level from XP"
  - "Color-based initialization: MTG primary color determines starting skill bonus"
  - "Resource tracking: Map<ResourceType, number> pattern in ResourceStore"

# Metrics
duration: 12min
completed: 2026-01-28
---

# Phase 3 Plan 1: Skills and Resources Types Summary

**SkillCategory/ResourceType types with MobX stores for XP-based skill progression and global resource tracking**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-28T07:42:15Z
- **Completed:** 2026-01-28T07:54:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Created type system for skills (4 categories) and resources (6 types)
- Built SkillStore with XP tracking, computed levels, and MTG color-based initialization
- Built ResourceStore for global resource counts
- Extended Activity interface with skillCategory, outputs, and difficulty
- Created helper functions for XP/level calculations

## Task Commits

Each task was committed atomically:

1. **Task 1: Add skill and resource types** - `62ca0f9` (feat)
2. **Task 2: Create skill definitions and activity mappings** - `a4a2a34` (feat)
3. **Task 3: Create SkillStore and ResourceStore** - `92d7331` (feat)

## Files Created/Modified

- `src/types/game.ts` - Added SkillCategory, ResourceType, ActivityOutput, SkillData types; extended Activity
- `src/data/skills.ts` - XP thresholds, output modifiers, skill definitions, helper functions
- `src/data/activities.ts` - Added skillCategory, outputs, difficulty to all activities
- `src/stores/SkillStore.ts` - CharacterSkill class with XP tracking, SkillStore with color-based init
- `src/stores/ResourceStore.ts` - Resource tracking with Map<ResourceType, number>
- `src/stores/RootStore.ts` - Integrated new stores, character skill initialization

## Decisions Made

1. **XP thresholds [0, 100, 300, 600, 1000]** - Exponential curve with achievable early levels
2. **Output modifiers [1.0, 1.0, 1.2, 1.5, 1.8, 2.0]** - Level 1-2 same output, then scaling
3. **MTG color to skill mapping** - Blue->Creative, White/Green->Practical, Red->Social, Black->Technical
4. **Starting skill bonus = 100 XP** - Characters start at level 2 in their color-associated skill

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- SkillStore and ResourceStore ready for integration with activity completion
- Next plan should wire activity completion to grant XP and produce resources
- Output modifiers ready to scale resource production by skill level

---
*Phase: 03-activity-loop*
*Completed: 2026-01-28*
