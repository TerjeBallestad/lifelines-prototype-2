# Before the Fall - Prototype Post-Mortem

## Overview

| Attribute | Value |
|-----------|-------|
| **Project Type** | Web-based life simulation game prototype |
| **Tech Stack** | React 19 + MobX + Vite + Tailwind 4 + TypeScript |
| **Purpose** | Validate MTG color personality system creates distinct character behavior |
| **Scope** | ~3,900 LOC, 18 components, 6 stores |
| **Duration** | 2 days (Jan 27-28, 2026) |
| **Milestone** | v1.0 Complete |

**Core Thesis:** MTG colors + minimal configuration create distinct, interesting character behavior without needing complex AI systems.

---

## Feature Evaluation

### 1. Time System
**Description:** Day/night cycle with 10 game-minutes per real-second, pause/resume control, fixed 60 FPS timestep

**What Worked:**
- Clean separation of game time from real time
- Fixed timestep prevents simulation issues after tab unfocus
- Pause/resume feels natural for player control

**What Didn't Work:**
- Time-of-day preferences were designed but never integrated into AI

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Controls and separation of in-game vs real time worked well. Time-of-day representation ("afternoon", "night", etc.) was appreciated.

---

### 2. MTG Color Personality System
**Description:** Characters have 2 MTG colors with intensity values (0.0-1.0) that drive behavior preferences. Elling is Blue 1.0/Green 0.4, Mother is White 0.7/Green 0.5.

**What Worked:**
- Exaggerated color values (1.0 vs 0.75) create obviously distinct behavior
- Colors map naturally to activity affinities (Blue→Reading, White→Cleaning)
- Observable differences emerge without explicit explanation

**What Didn't Work:**
- Only 2 characters tested; unclear if system scales
- Black and Red colors underutilized in current activity set

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Core concept is good, though not fully fleshed out in prototype. Open question: should colors be explicit UI for player or just manifest through behavior? For a cozy-style game (vs simulation-heavy life-sim), this simple system works well and is fun to interact with.

---

### 3. Overskudd (Wellbeing) System
**Description:** Single unified wellbeing metric: (energy + social + purpose) / 3. Drives behavior thresholds and activity refusal.

**What Worked:**
- Simple average is easy to reason about
- Clear thresholds: <20 refusing, <40 reluctant, >40 willing
- Visual meter with spring animation feels responsive

**What Didn't Work:**
- Averaging hides which specific need is depleted
- No visual feedback for individual need states

**Evaluation:** `⚠️ SIMPLIFY`

**Reasoning:** Single energy resource is good for player simplicity. Balance was off and thresholds didn't work well - needs tuning but core concept of unified wellbeing metric is sound.

---

### 4. Utility AI Behavior System
**Description:** Scores activities using 60% color match + 40% needs satisfaction. Characters autonomously choose activities based on personality.

**What Worked:**
- Characters exhibit learnable preferences (Elling→reading, Mother→cooking)
- Formula balances personality with survival needs
- Top-3 candidate selection adds believable variety

**What Didn't Work:**
- No inter-character awareness (Mother doesn't react to Elling's state)
- Time-of-day preferences never integrated

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Watching characters move and seeing three options pop up with one chosen was very fun and visually pleasing - keep that. However, AI didn't always pick sensible options (possibly due to limited activities). Averaging utility score isn't the right approach. Instead, use a tiered/hierarchical structure: prioritize basic needs first, then color preferences, then activity difficulty - progressively refined choices moving up the hierarchy of need satisfaction.

---

### 5. Character State Machine
**Description:** States: idle → deciding → walking → performing → idle. Blue characters deliberate longer (2000ms vs 800ms).

**What Worked:**
- Observable personality through deliberation time
- Walk speed varies with overskudd (visible wellbeing impact)
- Thought bubbles show decision process

**What Didn't Work:**
- No walk animation (static sprite slides)
- Limited state variations (no emotes/expressions)

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Surprisingly effective for communicating internal character state. Elling walking slower and thinking slower said a lot about him. Keep this approach - pacing as personality expression.

---

### 6. Comfort Behaviors
**Description:** Fallback activities when overskudd is low. Elling stares out window (Blue withdrawal), Mother sits quietly (White stillness).

**What Worked:**
- Personality-flavored recovery behaviors
- Creates observable "sad state" pattern
- Triggers refusal messages with character voice

**What Didn't Work:**
- Only 3 comfort activities total
- No escalation (same behavior at 20% vs 5%)

**Evaluation:** `⚠️ SIMPLIFY`

**Reasoning:** Selecting different activities based on mood is definitely wanted. The idea of comfort behaviors is good. However, the cutoff was too harsh and behavior too extreme. Needs more nuanced, gradual behavior rather than hard thresholds.

---

### 7. Resource Production System
**Description:** 6 resource types (creativity, food, cleanliness, comfort, connection, progress) produced by activities.

**What Worked:**
- Resources tie activities to tangible outcomes
- Floating number feedback feels satisfying
- Multiple resources per activity creates depth

**What Didn't Work:**
- Resources only matter for quest completion
- No spending/consumption mechanics

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Floating numbers are satisfying. Future idea: resources could land on the ground and player clicks to collect them - cozy/incremental game vibes. Need more use-cases for resources beyond quest completion (spending, consumption, crafting?).

---

---

> **📌 BOOKMARK: Evaluation paused here (2026-02-02)**
> Resume with Feature 8: Skill Progression System

---

### 8. Skill Progression System
**Description:** 6 skills with XP thresholds [0, 100, 300, 600, 1000]. Higher skills improve success chance and output.

**What Worked:**
- Exponential XP curve feels natural
- Failure still grants 50% XP (learning from failure)
- Output modifiers create visible progression
- Level-up celebration pauses game appropriately

**What Didn't Work:**
- No skill specialization/branching
- Critical hits feel underutilized

**Evaluation:** `[ PENDING ]`

---

### 9. Activity Success/Failure System
**Description:** Success chance: 50% + (level×10%) - ((difficulty-1)×15%). Failed activities produce 50% output.

**What Worked:**
- Clear formula creates predictable progression
- Failure isn't devastating (partial rewards)
- Difficulty tiers matter

**What Didn't Work:**
- No visual distinction between failure and success (just lower numbers)
- Critical hits don't feel special

**Evaluation:** `[ PENDING ]`

---

### 10. Player Intervention (Forcing Activities)
**Description:** Click character to open modal, force any activity. Character responds with personality-flavored refusal/acceptance.

**What Worked:**
- Refusal messages have distinct character voice
- Color-match affects willingness (high affinity = eager)
- 3-second auto-clear prevents UI clutter

**What Didn't Work:**
- No consequence for forcing unwilling characters
- Can always force, even when refusing

**Evaluation:** `[ PENDING ]`

---

### 11. Floating Number Feedback
**Description:** Animated numbers rise from activity location showing resource gains. Color-coded by type, uses object pooling.

**What Worked:**
- Immediate visual feedback for every activity
- Motion values prevent React re-renders
- Staggered appearance for multiple resources

**What Didn't Work:**
- No particle effects or screen shake
- Numbers disappear quickly, easy to miss

**Evaluation:** `[ PENDING ]`

---

### 12. Quest System
**Description:** 3-quest chain: Morning Routine → Creative Output → Stay Connected. Teaches mechanics implicitly.

**What Worked:**
- Quests guide early gameplay naturally
- Computed progress updates reactively
- Celebration flow feels rewarding

**What Didn't Work:**
- Only 3 quests; no late-game objectives
- No optional/side quests
- Quest completed = no more direction

**Evaluation:** `[ PENDING ]`

---

### 13. Quest Celebration UI
**Description:** Full-screen modal on completion with trophy animation, pauses game, shows new quest introduction.

**What Worked:**
- Pause during celebration creates focused moment
- Spring animation on trophy feels polished
- Auto-dismiss popup (3s) doesn't block play

**What Didn't Work:**
- Same celebration for all quests regardless of difficulty
- No fanfare escalation

**Evaluation:** `[ PENDING ]`

---

### 14. Crisis Sequence (Day 10)
**Description:** Mother collapses on Day 10. Player directs Elling through skill-checked crisis actions. Two endings based on phone skill.

**What Worked:**
- Consequence emerges from player's training choices
- Warning signs build tension (slower movement, worry bubbles)
- Real skill checks with failure possibility
- Hope bonus system allows strategic preparation

**What Didn't Work:**
- Single crisis point (no earlier tests)
- Success requires specific skill (phone) - feels prescribed
- Limited replay value once solution known

**Evaluation:** `[ PENDING ]`

---

### 15. Shadow State
**Description:** Elling enters shadow state when overskudd <30 during crisis. Manifests as -20% penalty to crisis actions.

**What Worked:**
- Clear mode switch (not gradual degradation)
- Creates observable behavior change
- Ties personal state to crisis outcome

**What Didn't Work:**
- Only visible during crisis, not normal gameplay
- No visual indicator beyond warning signs
- -20% penalty feels arbitrary

**Evaluation:** `[ PENDING ]`

---

### 16. Two-Ending System
**Description:** Mother Saved (phone skill ≥2 + success) vs Mother Lost. Epilogue text differs based on outcome.

**What Worked:**
- Endings reflect actual mechanical decisions
- Distinct emotional tone per ending
- Clear "Try Again" option for replay

**What Didn't Work:**
- Binary outcome (no middle ground)
- Epilogue is text-only, no visual variation
- Only 2 endings feels limited

**Evaluation:** `[ PENDING ]`

---

### 17. Debug Controls
**Description:** Collapsible gear icon with time speed adjustment (0.1x-5x) and overskudd manipulation.

**What Worked:**
- Essential for testing/development
- Collapsed by default (non-intrusive)
- Time manipulation useful for players too

**What Didn't Work:**
- Breaks immersion if discovered
- No way to disable for "release" builds

**Evaluation:** `[ PENDING ]`

---

### 18. Character Panel UI
**Description:** Click character to open detailed stats panel showing color profile, overskudd meter, current activity.

**What Worked:**
- Clean DaisyUI styling
- Spring animations on expand/collapse
- Always-visible sidebar for quick reference

**What Didn't Work:**
- All stats visible from start (no discovery)
- No history/log of recent activities

**Evaluation:** `[ PENDING ]`

---

## Features NOT Implemented (But Designed)

### A. Time-of-Day Activity Preferences
**Description:** Characters would prefer different activities based on morning/afternoon/evening/night.

**Status:** Type defined (TimeOfDay), never integrated into Utility AI

**Evaluation:** `[ PENDING ]`

---

### B. Inter-Character Dynamics
**Description:** Characters would react to each other's states. Mother would show concern when Elling's overskudd is low.

**Status:** Not implemented. Characters operate independently.

**Evaluation:** `[ PENDING ]`

---

### C. Discoverable Stats
**Description:** Stats hidden initially, revealed as player observes behavior. "Watch first, reveal later" philosophy.

**Status:** Not implemented for testing convenience. All stats visible from start.

**Evaluation:** `[ PENDING ]`

---

### D. Sound Effects
**Description:** Audio feedback for skill level-up, quest completion, activity completion, crisis urgency.

**Status:** Entirely deferred. Visual feedback only.

**Evaluation:** `[ PENDING ]`

---

### E. Character Animations
**Description:** Walk animations, facial expressions, pose changes based on emotional state.

**Status:** Static sprites only. Characters slide between positions.

**Evaluation:** `[ PENDING ]`

---

### F. Screen Effects (Juice)
**Description:** Screen shake on critical hits, particle bursts on level-up, red flash during crisis.

**Status:** Basic floating numbers only. Advanced effects deferred.

**Evaluation:** `[ PENDING ]`

---

### G. Save/Load System
**Description:** Persist game state for longer sessions or returning players.

**Status:** Intentionally omitted. 30-45 minute single-session design.

**Evaluation:** `[ PENDING ]`

---

### H. Conversation System
**Description:** Characters would have dialogue, conversations would affect relationships.

**Status:** Explicitly declared out-of-scope. Actions over dialogue philosophy.

**Evaluation:** `[ PENDING ]`

---

## Summary Table

| # | Feature | Implemented | Evaluation |
|---|---------|-------------|------------|
| 1 | Time System | Yes | `✅ INCLUDE` |
| 2 | MTG Color Personality System | Yes | `✅ INCLUDE` |
| 3 | Overskudd (Wellbeing) System | Yes | `⚠️ SIMPLIFY` |
| 4 | Utility AI Behavior System | Yes | `🔄 REDESIGN` |
| 5 | Character State Machine | Yes | `✅ INCLUDE` |
| 6 | Comfort Behaviors | Yes | `⚠️ SIMPLIFY` |
| 7 | Resource Production System | Yes | `✅ INCLUDE` |
| 8 | Skill Progression System | Yes | `[ PENDING ]` |
| 9 | Activity Success/Failure System | Yes | `[ PENDING ]` |
| 10 | Player Intervention | Yes | `[ PENDING ]` |
| 11 | Floating Number Feedback | Yes | `[ PENDING ]` |
| 12 | Quest System | Yes | `[ PENDING ]` |
| 13 | Quest Celebration UI | Yes | `[ PENDING ]` |
| 14 | Crisis Sequence | Yes | `[ PENDING ]` |
| 15 | Shadow State | Yes | `[ PENDING ]` |
| 16 | Two-Ending System | Yes | `[ PENDING ]` |
| 17 | Debug Controls | Yes | `[ PENDING ]` |
| 18 | Character Panel UI | Yes | `[ PENDING ]` |
| A | Time-of-Day Preferences | No | `[ PENDING ]` |
| B | Inter-Character Dynamics | No | `[ PENDING ]` |
| C | Discoverable Stats | No | `[ PENDING ]` |
| D | Sound Effects | No | `[ PENDING ]` |
| E | Character Animations | No | `[ PENDING ]` |
| F | Screen Effects (Juice) | No | `[ PENDING ]` |
| G | Save/Load System | No | `[ PENDING ]` |
| H | Conversation System | No | `[ PENDING ]` |

## Key Decisions Needed

*(To be filled during evaluation)*

## Summary Counts

| Evaluation | Count |
|------------|-------|
| ✅ INCLUDE | 5 |
| ⚠️ SIMPLIFY | 2 |
| 🔄 REDESIGN | 1 |
| ❌ CUT | 0 |
| 📋 DEFER | 0 |
| **Evaluated** | 7 |
| **Remaining** | 19 |

---

*Post-mortem created: 2026-02-02*
