# Project State

## Current Status

**Phase:** 2 of 5 (Autonomous Behavior) - IN PROGRESS
**Plan:** 1 of 3 complete
**Status:** In progress
**Last activity:** 2026-01-27 - Completed 02-01-PLAN.md (Utility AI & Activity System)

**Progress:** [====------] 4/6+ phase plans (~40%)

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-27)

**Core value:** Validate that MTG colors + minimal config create distinct, interesting character behavior
**Current focus:** Phase 2: Autonomous Behavior - Utility AI scoring complete, next: Thought Bubble UI

## Phase Status

| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1 - Foundation | Complete | 3/3 | 100% |
| 2 - Autonomous Behavior | In Progress | 1/3 | 33% |
| 3 - Activity Loop | Pending | 0/? | 0% |
| 4 - Quest System | Pending | 0/? | 0% |
| 5 - Crisis Sequence | Pending | 0/? | 0% |

## Accumulated Context

### Key Decisions

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-01 | RootStore singleton pattern | Central store creates child stores with `this` reference for cross-store access |
| 01-01 | Overskudd = (energy + social + purpose) / 3 | Simple average captures overall wellbeing |
| 01-01 | 10 game-minutes per real-second | Allows ~2 real-minutes per game-hour for 30-45 min playthrough |
| 01-01 | Needs decay: energy 1/hr, social 0.5/hr, purpose 0.3/hr | Energy depletes fastest, purpose most stable |
| 01-01 | Elling Blue 1.0, Mother White 0.7 | Elling's color exaggerated per research for distinct behavior |
| 01-02 | Fixed timestep at 60fps (16.67ms) | Deterministic simulation regardless of frame rate |
| 01-02 | maxFrameTime = 250ms | Prevents spiral of death after tab unfocus |
| 01-02 | useCallback for tick handler | Prevents useGameLoop effect from re-running unnecessarily |
| 01-03 | useSpring for overskudd animation | motion/react's useSpring provides smooth interpolation |
| 01-03 | ColorBadge shows letter + intensity | Compact "U 1.0" format for MTG color display |
| 01-03 | AnimatePresence for panel transitions | Smooth enter/exit when selecting characters |
| 02-01 | Utility formula: 60% color + 40% needs | Personality drives behavior but survival needs still matter |
| 02-01 | Weighted random from top 3 within 80% | Adds variety without sacrificing quality |
| 02-01 | Comfort behaviors scored separately | Reserved for low overskudd fallback |
| 02-01 | Need normalization: energy/20, social/10, purpose/20 | Scales effects to 0-1 for fair comparison |

### Patterns Established

- **useGameLoop:** Accumulator pattern for fixed-timestep simulation
- **Observer usage:** All MobX-connected components wrapped with observer()
- **ColorBadge:** Reusable MTG color display with letter and intensity
- **OverskuddMeter:** Spring-animated progress bar pattern for values 0-100
- **Game layout:** TimeDisplay top, game world middle, CharacterPanel bottom
- **Utility AI scoring:** Calculate colorMatch and needSatisfaction separately, combine with weights
- **Activity data:** colorAffinities as Partial<Record<MTGColor, number>> for sparse definitions
- **Comfort behaviors:** isComfortBehavior flag for low-overskudd fallback activities

### Open Questions

- ~~Color affinity formula: How exactly do color weights combine with character profile to produce preference scores?~~ RESOLVED in 02-01
- Shadow state threshold: At what color health percentage does shadow trigger?

### Blockers

(None)

## Session Continuity

**Last session:** 2026-01-27T21:26:40Z
**Stopped at:** Completed 02-01-PLAN.md - Utility AI & Activity System
**Resume file:** Ready for 02-02-PLAN.md (Thought Bubble UI)

---
*Last updated: 2026-01-27*
