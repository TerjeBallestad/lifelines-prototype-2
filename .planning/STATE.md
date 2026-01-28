# Project State

## Current Status

**Phase:** 3 of 5 (Activity Loop)
**Plan:** 5 of 5 complete
**Status:** Phase complete
**Last activity:** 2026-01-28 - Completed 03-05-PLAN.md (Skill Progress & Level-Up)

**Progress:** [===========] 11/11 phase plans (100%)

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-27)

**Core value:** Validate that MTG colors + minimal config create distinct, interesting character behavior
**Current focus:** Phase 3 COMPLETE - Ready for Phase 4: Quest System

## Phase Status

| Phase | Status | Plans | Progress |
|-------|--------|-------|----------|
| 1 - Foundation | Complete | 3/3 | 100% |
| 2 - Autonomous Behavior | Complete | 3/3 | 100% |
| 3 - Activity Loop | Complete | 5/5 | 100% |
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
| 03-01 | XP thresholds [0, 100, 300, 600, 1000] | Exponential curve with achievable early levels |
| 03-01 | Output modifiers [1.0, 1.0, 1.2, 1.5, 1.8, 2.0] | Level 1-2 same output, scaling after |
| 03-01 | MTG color to skill mapping | Blue->Creative, White/Green->Practical, Red->Social, Black->Technical |
| 03-01 | Starting skill bonus = 100 XP | Characters start at level 2 in color-associated skill |
| 03-02 | Success formula: 50 + (level*10) - ((difficulty-1)*15) | Base 50%, +10%/level, -15%/difficulty tier, clamped 10-95 |
| 03-02 | Failed = 50% output, 50% XP | Failure isn't total loss, learning from failure encouraged |
| 03-02 | Critical: 5 + (level*5)% chance, 150% output | Higher skill = more crits, meaningful but not OP reward |
| 03-02 | lastActivityResult on Character | Stores completion result for UI feedback display |
| 03-03 | useMotionValue for animation performance | Avoids React re-renders during animation |
| 03-03 | MobX reaction for cross-component observation | Watches all characters' lastActivityResult |
| 03-03 | 100ms stagger for multiple outputs | Visual clarity when activity produces multiple resources |
| 03-03 | Resource pulse 0.3s duration | Visible but not distracting feedback |
| 03-04 | Click opens modal (not selection) | More direct player intervention UX |
| 03-04 | Attitude thresholds: <20 refusing, <40 reluctant | Consistent with existing refusal thresholds |
| 03-04 | colorMatch >0.6 eager, <0.3 reluctant | Activity affinity affects willingness |
| 03-04 | 3-second auto-clear for refusal messages | Keeps UI uncluttered |
| 03-05 | XP bar uses useSpring for smooth fill animation | Spring physics creates satisfying visual feedback |
| 03-05 | Level-up tracked with pendingLevelUp observable | Enables reactive level-up detection across components |
| 03-05 | Activity queuing during level-up | Better UX than disabling - player intent isn't lost |
| 03-05 | Game pauses during celebration | Focuses attention on achievement moment |

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
- **CharacterSkill class:** MobX observable with computed level from XP thresholds
- **Color-based skill initialization:** MTG primary color determines starting skill bonus
- **Resource tracking:** Map<ResourceType, number> pattern in ResourceStore
- **SkillSystem pure functions:** Calculation functions exported for testability (calculateSuccessChance, calculateOutput, etc.)
- **processActivityCompletion:** Pure orchestration function for activity result generation
- **Activity completion integration:** completeActivity() calls SkillSystem, SkillStore, and ResourceStore
- **FloatingNumber:** Motion values (useMotionValue + animate) for DOM-efficient animation
- **Pool pattern:** Spawn/remove with crypto.randomUUID for unique keys
- **Cross-component observation:** MobX reaction in useEffect with cleanup disposers
- **Value-change detection:** useRef to track previous value for pulse trigger
- **Modal state pattern:** observable open/characterId in store, dialog ref in component
- **Attitude calculation:** combine overskudd thresholds with color affinity match
- **Personality-flavored text:** switch on primary color for different responses
- **Event tracking pattern:** pendingLevelUp observable with anyPendingLevelUp computed for reactive detection
- **Activity queuing:** queuedActivity field on Character for deferred action execution
- **Game state coupling:** UI modals can control game pause state for focused experiences

### Open Questions

- Shadow state threshold: At what color health percentage does shadow trigger?

### Blockers

(None)

## Session Continuity

**Last session:** 2026-01-28
**Stopped at:** Phase 3 Activity Loop complete and verified
**Resume file:** Ready for Phase 4 Quest System planning

---
*Last updated: 2026-01-28*
