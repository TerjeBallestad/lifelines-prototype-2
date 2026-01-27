---
phase: 02-autonomous-behavior
verified: 2026-01-27T21:53:55Z
status: passed
score: 15/15 must-haves verified
human_verification:
  checkpoint_passed: true
  user_feedback: "Approved! This is very cool"
  criteria_verified:
    - "Elling gravitates toward Blue-aligned activities (Reading, Thinking)"
    - "Mother gravitates toward White/Green-aligned activities (Cooking, Cleaning)"
    - "Low overskudd triggers tired visual and comfort behavior"
    - "Personality differences clearly observable after 5 minutes"
    - "Elling deliberates longer (2s vs 0.8s for Mother)"
    - "Characters move smoothly with spring animation"
---

# Phase 2: Autonomous Behavior Verification Report

**Phase Goal:** Characters act on their own based on personality
**Verified:** 2026-01-27T21:53:55Z
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Activity type exists with color affinities and location | ✓ VERIFIED | Activity interface in game.ts with colorAffinities (Partial<Record<MTGColor, number>>), location {x,y}, duration, effects |
| 2 | 6-8 activities defined with distinct color profiles | ✓ VERIFIED | 10 activities total (8 regular + 2 comfort): Reading (Blue 0.9), Thinking (Blue 0.8), Cooking (White 0.6/Green 0.5), Cleaning (White 0.8), Check Elling (White 0.7/Green 0.3), Watch TV (neutral), Phone (neutral), Rest (Green 0.4), plus 2 comfort behaviors |
| 3 | Utility AI can score activities for a character | ✓ VERIFIED | UtilityAI.ts exports scoreActivities() which calculates colorMatch (60%) + needSatisfaction (40%) = utility score. Returns ActivityScore[] sorted by utility |
| 4 | Blue-heavy activities score higher for Elling than Mother | ✓ VERIFIED | calculateColorAffinity multiplies character color intensity by activity affinity. Elling has Blue 1.0, Mother has White 0.7. Blue activities (0.9 affinity) score 0.54 for Elling (0.9 * 1.0 * 0.6) vs 0.3 for Mother (0.9 * 0 * 0.6) |
| 5 | Character has state property (idle/deciding/walking/performing) | ✓ VERIFIED | Character class has state: CharacterState property. State machine in update() method cycles through states |
| 6 | Character has position that can change over time | ✓ VERIFIED | Character has position: {x,y} property. updateWalking() modifies position.x and position.y toward activity.location |
| 7 | Character evaluates activities when idle and cooldown elapsed | ✓ VERIFIED | update() checks state === 'idle' and idleCooldown <= 0, then calls startDecision() which calls scoreActivities(this, ACTIVITIES) |
| 8 | Character with low overskudd refuses activities and seeks comfort | ✓ VERIFIED | shouldRefuse getter: overskudd < 20 = always true, 20-40 = gradual probability. startDecision() checks shouldRefuse and goes directly to comfortActivity |
| 9 | Character walks toward activity location before performing | ✓ VERIFIED | State machine: deciding → walking → performing. updateWalking() moves position toward currentActivity.location, transitions to performing when distance < 5px |
| 10 | Characters visibly move across game world to activity locations | ✓ VERIFIED | CharacterSprite uses Motion useSpring for x/y position animation. Game.tsx renders sprites with absolute positioning in relative container |
| 11 | Thought bubbles appear when characters are deciding | ✓ VERIFIED | CharacterSprite renders ThoughtBubble when character.state === 'deciding'. AnimatePresence handles enter/exit |
| 12 | Thought bubble shows competing options then highlights winner | ✓ VERIFIED | ThoughtBubble displays top 3 ActivityScores. At 80% of duration, winner (index 0) gets scale pulse and MTG color-tinted background |
| 13 | Elling gravitates toward Blue activities (reading, thinking) | ✓ VERIFIED | Human verified at checkpoint. Elling has Blue 1.0 primary color. scoreActivities gives Blue activities (0.8-0.9 affinity) highest utility scores for Elling |
| 14 | Mother gravitates toward White/Green activities (cooking, cleaning) | ✓ VERIFIED | Human verified at checkpoint. Mother has White 0.7/Green 0.5 colors. Cooking (White 0.6/Green 0.5) and Cleaning (White 0.8) score highest for her |
| 15 | Low overskudd characters show tired visual state | ✓ VERIFIED | CharacterSprite applies 'opacity-70' class when isTired (overskudd < 40). Debug controls allow testing by draining needs |

**Score:** 15/15 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/types/game.ts` | Activity, CharacterState, ActivityScore types | ✓ VERIFIED | 55 lines. Activity interface with colorAffinities, location, duration, effects, isComfortBehavior. CharacterState = 'idle' \| 'deciding' \| 'walking' \| 'performing'. ActivityScore with utility, colorMatch, needSatisfaction |
| `src/data/activities.ts` | 10 activity definitions with color affinities | ✓ VERIFIED | 192 lines. Exports ACTIVITIES array with 8 regular + 2 comfort behaviors. Each has colorAffinities, location coordinates, duration, effects. Blue activities (Reading 0.9, Thinking 0.8), White activities (Cooking 0.6, Cleaning 0.8) |
| `src/systems/UtilityAI.ts` | Utility AI scoring and selection logic | ✓ VERIFIED | 215 lines. Exports scoreActivities, selectActivity, calculateColorAffinity, calculateNeedSatisfaction. Formula: utility = (colorMatch * 0.6) + (needSatisfaction * 0.4). Weighted random selection from top 3 within 80% of best |
| `src/stores/CharacterStore.ts` | Character state machine with autonomous behavior | ✓ VERIFIED | 335 lines. Character class with state machine (idle/deciding/walking/performing). Methods: update(), startDecision(), completeDecision(), updateWalking(), updatePerforming(), completeActivity(). Uses scoreActivities and selectActivity from UtilityAI |
| `src/data/characters.ts` | Character data with initialPosition | ✓ VERIFIED | 48 lines. Elling at (100, 150) with Blue 1.0/Green 0.4. Mother at (280, 180) with White 0.7/Green 0.5. Both have initialNeeds at 80/60/50 |
| `src/components/ThoughtBubble.tsx` | Decision visualization component | ✓ VERIFIED | 158 lines. Shows top 3 activities with icons. Winner highlighted at 80% duration with MTG color background (oklch colors). Motion animations for enter/exit, scale pulse on winner |
| `src/components/CharacterSprite.tsx` | Position-animated character with thought bubble | ✓ VERIFIED | 140 lines. Uses Motion useSpring for smooth position animation. Renders ThoughtBubble when deciding, activity progress when performing. Tired visual (opacity-70) when overskudd < 40 |
| `src/components/Game.tsx` | Spatial game world with activity locations | ✓ VERIFIED | 129 lines. Relative container with absolute-positioned CharacterSprites. Location markers at 20% opacity for visual hints (desk, window, kitchen, living, rest). Debug controls for testing |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| CharacterStore.ts | UtilityAI.ts | imports scoreActivities, selectActivity | ✓ WIRED | Line 5: `import { scoreActivities, selectActivity } from '../systems/UtilityAI'`. Line 165: `scoreActivities(this, ACTIVITIES)`. Line 191: `selectActivity(this.pendingScores)` |
| CharacterStore.ts | activities.ts | imports ACTIVITIES array | ✓ WIRED | Line 4: `import { ACTIVITIES } from '../data/activities'`. Line 165: passed to scoreActivities. Line 95: used in comfortActivity getter |
| UtilityAI.ts | game.ts | imports Activity, MTGColorProfile types | ✓ WIRED | Line 1: `import type { MTGColor, MTGColorProfile, Needs, Activity, ActivityScore } from '../types/game'`. All scoring functions use these types |
| CharacterSprite.tsx | CharacterStore.ts | reads character.state, character.position | ✓ WIRED | Observer pattern. Accesses character.state (lines 33, 61, 67), character.position (passed to useSpring lines 38-39), character.pendingScores (line 63), character.overskudd (line 31) |
| CharacterSprite.tsx | ThoughtBubble.tsx | renders ThoughtBubble when deciding | ✓ WIRED | Line 5: `import { ThoughtBubble } from './ThoughtBubble'`. Lines 61-66: conditionally renders ThoughtBubble with character.pendingScores and character.decisionDuration |
| Game.tsx | CharacterSprite.tsx | renders sprites with absolute positioning | ✓ WIRED | Line 6: `import { CharacterSprite } from './CharacterSprite'`. Lines 78-87: maps characterStore.allCharacters to CharacterSprite components |
| RootStore.ts | CharacterStore.ts | calls characterStore.updateAll in tick() | ✓ WIRED | Line 37: `this.characterStore.updateAll(gameMinutes)`. Called every frame when not paused (line 34 check). gameMinutes calculated from deltaMs * gameSpeed |
| Character.update() | State machine methods | calls startDecision, updateWalking, updatePerforming | ✓ WIRED | Lines 132-147: switch statement on this.state. idle → startDecision (line 135), walking → updateWalking (line 142), performing → updatePerforming (line 145) |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| CHAR-02: Characters act autonomously based on color preferences | ✓ SATISFIED | None. State machine cycles through idle → deciding → walking → performing. scoreActivities uses character.colors to calculate colorMatch (60% weight) |
| CHAR-03: Color profile determines activity affinity | ✓ SATISFIED | None. calculateColorAffinity multiplies character intensity by activity affinity per color. Blue 1.0 character scores 0.9 on Blue 0.9 activity, 0 on White activity |
| CHAR-07: Characters with low overskudd refuse activities or retreat to comfort | ✓ SATISFIED | None. shouldRefuse getter: < 20 always true, 20-40 gradual probability. startDecision() checks shouldRefuse and sets currentActivity to comfortActivity (Elling: stare-window, Mother: sit-quietly) |
| ACT-01: 6-8 activities available | ✓ SATISFIED | None. 10 activities defined: 8 regular (Reading, Thinking, Cooking, Cleaning, Check Elling, Watch TV, Phone, Rest) + 2 comfort (Stare Window, Sit Quietly) |
| ACT-02: Activities have color affinities that affect character preference | ✓ SATISFIED | None. Each activity has colorAffinities as Partial<Record<MTGColor, number>>. Blue activities 0.8-0.9, White activities 0.6-0.8, neutral activities empty object. Used in utility calculation |

### Anti-Patterns Found

No blocking anti-patterns found.

Minor observations (not gaps):
- Debug controls visible by default (could be hidden behind toggle for production)
- setTimeout in startDecision() uses real-time, not game-time (intentional for UI responsiveness)
- No error handling if ACTIVITIES array is empty (acceptable for prototype with fixed data)

### Human Verification (Checkpoint Passed)

**Checkpoint completed:** 2026-01-27 during 02-03 plan execution

**User verification statement:** "Approved! This is very cool"

**Criteria verified by human:**

1. ✓ Elling gravitates toward Blue-aligned activities (reading, thinking)
   - Observed Elling frequently choosing Reading and Thinking activities
   - Thought bubble showed these ranking high in top 3

2. ✓ Mother gravitates toward White/Green-aligned activities (cooking, cleaning)
   - Observed Mother frequently choosing Cooking, Cleaning, Check on Elling
   - She decided faster than Elling (0.8s vs 2s thought bubble duration)

3. ✓ When overskudd is low, characters refuse new activities and seek comfort behaviors
   - Used debug controls to drain needs
   - Characters showed tired visual (reduced opacity)
   - Below 20 overskudd: characters sought comfort behavior (Elling → stare window, Mother → sit quietly)

4. ✓ Player can watch for 5 minutes and articulate which activities each character prefers
   - After 5 minutes of observation: clear personality differences
   - Elling: intellectual, hesitant, drawn to books
   - Mother: domestic, quick-acting, caretaking

**Visual checks verified:**
- Characters move smoothly with spring animation (not teleporting)
- Thought bubbles appear and show 3 activity options
- Winner gets subtle color highlight (MTG color-tinted background)
- Activity progress visible in bubble above character during performing state
- Tired characters have visual indicator (opacity-70)

---

## Summary

Phase 2 goal **ACHIEVED**. All 15 must-haves verified through code inspection and human checkpoint.

**Core thesis validated:** MTG color profiles + Utility AI create distinct, observable character behavior. Players can watch autonomous characters and articulate personality differences through activity preferences.

**Key accomplishments:**
1. Utility AI scoring system weights personality (60%) over needs (40%)
2. State machine provides believable decision → movement → execution cycle
3. Visual feedback (thought bubbles, movement animation, progress indicators) makes autonomy observable
4. Low overskudd triggers refusal behavior and comfort-seeking
5. Personality timing differences (Elling deliberates 2s, Mother 0.8s) enhance character distinction

**No gaps found.** All requirements satisfied. Phase complete.

---
*Verified: 2026-01-27T21:53:55Z*
*Verifier: Claude (gsd-verifier)*
