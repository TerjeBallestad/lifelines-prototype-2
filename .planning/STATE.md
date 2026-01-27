# Project State

## Current Status

**Phase:** 2 of 5 (Autonomous Behavior) - COMPLETE
**Plan:** 3 of 3 complete
**Status:** Phase complete - ready for Phase 3
**Last activity:** 2026-01-27 - Completed 02-03-PLAN.md (Thought Bubble UI)

**Progress:** [======----] 6/6+ phase plans (~60%)

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-27)

**Core value:** Validate that MTG colors + minimal config create distinct, interesting character behavior
**Current focus:** Phase 2 COMPLETE - Ready for Phase 3: Activity Loop

## Phase Status

| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1 - Foundation | Complete | 3/3 | 100% |
| 2 - Autonomous Behavior | Complete | 3/3 | 100% |
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
| 02-02 | Blue deliberates 2000ms, others 800ms | Creates observable personality difference in decision time |
| 02-02 | Blue walks 30 px/min, others 50 px/min | Slower movement reflects contemplative nature |
| 02-02 | Walk speed scales with overskudd | Low wellbeing = slower movement (overskudd/100 * base) |
| 02-02 | Refusal: <20 always, 20-40 gradual | Clear threshold for comfort behavior activation |
| 02-02 | 2 game-minute decision cooldown | Prevents instant re-decision loop |
| 02-03 | Thought bubble above sprite with bottom-full | Clean positioning without overlap |
| 02-03 | Activity progress bar above sprite | Visible during performing state when thought bubble hidden |
| 02-03 | Debug controls pattern: collapsible gear icon | Essential for testing autonomous behavior |
| 02-03 | Winner highlight at 80% duration | Gives player time to see deliberation before decision |

### Patterns Established

- **useGameLoop:** Accumulator pattern for fixed-timestep simulation
- **Observer usage:** All MobX-connected components wrapped with observer()
- **ColorBadge:** Reusable MTG color display with letter and intensity
- **OverskuddMeter:** Spring-animated progress bar pattern for values 0-100
- **Game layout:** TimeDisplay top, spatial game world middle, CharacterPanel bottom
- **Utility AI scoring:** Calculate colorMatch and needSatisfaction separately, combine with weights
- **Activity data:** colorAffinities as Partial<Record<MTGColor, number>> for sparse definitions
- **Comfort behaviors:** isComfortBehavior flag for low-overskudd fallback activities
- **State machine pattern:** idle -> deciding -> walking -> performing -> idle cycle
- **Async MobX updates:** setTimeout with runInAction for safe state mutations
- **Character.update():** Called each tick for state machine processing
- **Spring animation positioning:** useSpring for smooth x/y position interpolation
- **Thought bubble decision viz:** Show top 3 candidates, highlight winner at 80% duration
- **Debug controls:** Collapsible panel for time speed and overskudd manipulation
- **Spatial game world:** Relative container with absolute-positioned children

### Open Questions

- Shadow state threshold: At what color health percentage does shadow trigger?

### Blockers

(None)

## Session Continuity

**Last session:** 2026-01-27
**Stopped at:** Completed Phase 2 (Autonomous Behavior) - all 3 plans done
**Resume file:** Ready for Phase 3 planning

---
*Last updated: 2026-01-27*
