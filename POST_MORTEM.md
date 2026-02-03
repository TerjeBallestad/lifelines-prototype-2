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

### 8. Skill Progression System
**Description:** 6 skills with XP thresholds [0, 100, 300, 600, 1000]. Higher skills improve success chance and output.

**What Worked:**
- XP thresholds and exponential curve feel natural
- Failure granting 50% XP removes frustration
- Level-up celebration creates a real moment (game pauses)

**What Didn't Work:**
- Passive auto-leveling felt like "so what?" - no player investment
- No decision-making in progression
- Unclear which skills matter for the crisis

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Shift from passive auto-leveling to active skill point spending. Activities generate fungible XP into a shared pool; player chooses which skills to level. Creates meaningful decisions ("phone or cooking?") and makes level-ups feel earned. Fun over simulationism - don't worry about narrative logic of how XP transfers between domains.

---

### 9. Activity Success/Failure System
**Description:** Success chance: 50% + (level×10%) - ((difficulty-1)×15%). Failed activities produce 50% output.

**What Worked:**
- Formula is clean and learnable (50% + level bonus - difficulty penalty)
- Partial rewards on failure (50% output) removes frustration
- Difficulty tiers create meaningful risk/reward choices

**What Didn't Work:**
- No visual distinction between success and failure
- Couldn't tell when Elling succeeded vs failed
- Critical hits invisible/unfelt

**Evaluation:** `⚠️ SIMPLIFY`

**Reasoning:** The math is fine - keep the formula. The problem is feedback. Redesign floating numbers to communicate character state: slow/wobbly when struggling, burst/rapid when in flow. Resources land on floor for player pickup. Flow state becomes visually obvious through resource accumulation. Success/failure becomes "how smoothly" rather than binary pass/fail.

---

### 10. Player Intervention (Forcing Activities)
**Description:** Click character to open modal, force any activity. Character responds with personality-flavored refusal/acceptance.

**What Worked:**
- Personality-flavored refusal messages establish character voice
- Color-match affecting willingness creates learnable patterns
- 3-second auto-clear keeps UI clean

**What Didn't Work:**
- Forcing felt flat - no comedy or drama in the resistance/compliance cycle
- No visible struggle or reluctant compliance animations
- Refusals have no teeth - player quickly learns to ignore them

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** The Elling movie dynamic (Frank forcing Elling to practice phone calls) is the creative vision - caretaker pushing reluctant character outside comfort zone. The tension between "I don't want to" and "you need to anyway" is the core experience. Current implementation lacks texture: no comedic reactions, no visible struggle, no triumphant "that wasn't so bad" moments. Redesign to make forcing emotionally resonant and funny - reluctant compliance animations, grumbling thought bubbles, occasional real refusals at very low overskudd. Nice-to-have feature, not high priority; requires design work to manufacture comedic moments.

---

### 11. Floating Number Feedback
**Description:** Animated numbers rise from activity location showing resource gains. Color-coded by type, uses object pooling.

**What Worked:**
- Immediate visual feedback feels satisfying
- Color-coding by resource type creates learnable visual language
- Object pooling and motion values are solid technical foundation
- Staggered appearance for multiple resources avoids clutter

**What Didn't Work:**
- Numbers rise and fade quickly - easy to miss if not watching
- Basic implementation - lots of room for more juice

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Core feedback loop is working and feels satisfying. Solid technical foundation ready for enhancement. Future ideas: clickable resource drops for incremental game engagement, particle effects, screen shake on crits. Lots of juice potential built on this base.

---

### 12. Quest System
**Description:** 3-quest chain: Morning Routine → Creative Output → Stay Connected. Teaches mechanics implicitly.

**What Worked:**
- Quest chain creates natural tutorial without explicit instructions
- Computed progress updates reactively (MobX doing its job)
- Provides welcome direction and "todo list" satisfaction

**What Didn't Work:**
- Only 3 quests - no late-game direction
- No rewards for completion - quests feel like checkboxes
- Gap after completion feels aimless (crisis is a surprise, so no implicit goal to work toward)

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Quest system should be the "progression spine" of the game - continuous direction throughout play, not just tutorial. Add meaningful rewards (talent/facility unlocks) for completing quests. Creates organic skill-building and meaningful player choices without knowing why they'll need certain skills. Current 3 quests are proof of concept for a larger system with rewards that drive the whole session.

---

### 13. Quest Celebration UI
**Description:** Full-screen modal on completion with trophy animation, pauses game, shows new quest introduction.

**What Worked:**
- Pause during celebration creates focused moment
- Spring animation on trophy feels polished
- Auto-dismiss popup (3s) doesn't block play

**What Didn't Work:**
- Fanfare feels excessive because player wasn't aware they had a quest (weak quest introduction)
- Same celebration for all quests regardless of difficulty

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Celebration concept is right - quest completion should feel like an event. Current "too much fanfare" feeling is caused by weak quest introduction, not excessive celebration. When player consciously knows they're working toward a quest, the celebration becomes earned payoff. Becomes essential when reward/upgrade selection is added to quest system.

---

### 14. Crisis Sequence (Day 10)
**Description:** Mother collapses on Day 10. Player directs Elling through skill-checked crisis actions. Two endings based on phone skill.

**What Worked:**
- Warning signs build tension (slower movement, worry bubbles)
- Real skill checks with failure possibility - stakes feel real
- Hope bonus system rewards preparation
- Designed as "boss fight you're meant to lose" - failure is the intended first-playthrough experience

**What Didn't Work:**
- Single crisis point (no earlier tests to foreshadow)
- Warning signs may be too subtle for players to notice

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Crisis is working exactly as designed. Player is meant to fail - Elling isn't ready for independence, and that's the narrative truth. Failure creates the hook: "what happens to Elling?" leads to buying the full game to see the institution/redemption arc. The "unfairness" of not knowing to level phone is intentional - it mirrors Elling's unpreparedness. Demo ends at the right emotional beat.

---

### 15. Shadow State (Crisis Penalty)
**Description:** Elling enters shadow state when overskudd <30 during crisis. Manifests as -20% penalty to crisis actions.

**What Worked:**
- Concept of tying personal state to crisis outcome is sound

**What Didn't Work:**
- Completely invisible to player - no visual indicator
- Only affects crisis, which is designed to fail anyway
- Hidden complexity that doesn't change outcomes
- Confused with "comfort behaviors" (Feature 6) which serve similar purpose more visibly

**Evaluation:** `❌ CUT`

**Reasoning:** This is invisible complexity. The -20% penalty during crisis has no visual feedback and doesn't meaningfully change outcomes since the crisis is designed to be failed. Comfort behaviors (Feature 6) already handle the "low overskudd = different behavior" concept more visibly during normal gameplay. If color-flavored shadow states are wanted, they should be a visible system throughout gameplay, not a hidden crisis modifier.

---

### 16. Two-Ending System
**Description:** Mother Saved (phone skill ≥2 + success) vs Mother Lost. Epilogue text differs based on outcome.

**What Worked:**
- Endings reflect actual mechanical decisions (phone skill level)
- "Mother Lost" is the intended demo ending - clean emotional hook
- "Mother Saved" works as secret ending for replayers
- Distinct emotional tone per ending

**What Didn't Work:**
- Epilogue is text-only, no visual variation
- Secret ending might be too hidden (no hints that it's possible)

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Binary ending structure works for the demo. "Mother Lost" provides the intended emotional hook leading to the full game. "Mother Saved" as a secret ending rewards players who replay or figure out the phone skill importance - adds replay value without undermining the demo's purpose. Very unlikely to discover on first playthrough, which is the desired behavior.

---

### 17. Debug Controls
**Description:** Collapsible gear icon with time speed adjustment (0.1x-5x) and overskudd manipulation.

**What Worked:**
- Essential for testing/development
- Collapsed by default (non-intrusive)
- Time speed adjustment is useful for players (fast-forward slow moments)

**What Didn't Work:**
- Debug cheats (overskudd manipulation) break immersion if discovered
- No separation between player features and dev tools
- No way to disable debug stuff for release builds

**Evaluation:** `⚠️ SIMPLIFY`

**Reasoning:** Split into two distinct features: (1) Time speed controls as a proper player-facing UI element - many sim games have this and it improves QoL. (2) Debug/cheat tools hidden behind dev flag or removed entirely for release builds. Don't bundle legitimate player features with dev cheats.

---

### 18. Character Panel UI
**Description:** Click character to open detailed stats panel showing color profile, overskudd meter, current activity.

**What Worked:**
- Clean DaisyUI styling looks polished
- Spring animations on expand/collapse feel good
- Quick access to character info

**What Didn't Work:**
- Most info is debug data dressed as UI - not designed for player needs
- All stats visible from start - no progressive revelation
- No activity history or behavioral context
- Risk of cognitive overload showing everything at once

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Current panel is prototype debugging info, not a designed player experience. Needs redesign with clear purpose: what does the player actually need to know, and when? Balance "gamey" information display with cognitive load management. Consider: progressive stat reveal, activity history, mood indicators, hiding debug-only data. Show the right information at the right time rather than everything always.

---

## Features NOT Implemented (But Designed)

### A. Time-of-Day Activity Preferences
**Description:** Characters would prefer different activities based on morning/afternoon/evening/night.

**Status:** Type defined (TimeOfDay), never integrated into Utility AI

**Evaluation:** `📋 DEFER`

**Reasoning:** Realism polish, not core to the game's thesis. MTG colors driving behavior is the main differentiator - time-of-day is secondary texture. Could add believable daily rhythms in the full game for longer play sessions, but not needed for the demo.

---

### B. Inter-Character Dynamics
**Description:** Characters would react to each other's states. Mother would show concern when Elling's overskudd is low.

**Status:** Not implemented. Characters operate independently.

**Evaluation:** `📋 DEFER`

**Reasoning:** The isolation is narratively appropriate for the demo. Mother and Elling existing in the same space but not truly connecting is part of why he's underdeveloped - they're both isolated people. Inter-character dynamics belong in the institution arc (full game) where Elling is forced to learn to relate to others. Save this feature for when it's thematically relevant.

---

### C. Discoverable Stats
**Description:** Stats hidden initially, revealed as player observes behavior. "Watch first, reveal later" philosophy.

**Status:** Not implemented for testing convenience. All stats visible from start.

**Evaluation:** `❌ CUT` (as separate feature)

**Reasoning:** Not a distinct feature - fold into existing redesigns. Character Panel REDESIGN covers what stats to show and when. Quest/Upgrade System REDESIGN covers how to unlock them (e.g., hire a psychiatrist to see purpose stat). Discoverable stats is the *intersection* of these systems, not its own thing. Upgrades unlocking understanding (not just stat boosts) is a thematic win.

---

### D. Sound Effects
**Description:** Audio feedback for skill level-up, quest completion, activity completion, crisis urgency.

**Status:** Entirely deferred. Visual feedback only.

**Evaluation:** `✅ INCLUDE`

**Reasoning:** High impact-to-effort ratio for game feel. Key moments need audio: level-up fanfare, quest complete chime, crisis urgency. Sound during the crisis is especially important - transition from cozy ambient to tense audio would sell the emotional moment. Needed for demo to feel polished.

---

### E. Character Animations
**Description:** Walk animations, facial expressions, pose changes based on emotional state.

**Status:** Static sprites only. Characters slide between positions. Some animations already created.

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Animations already exist and are ready to integrate - the effort is integration, not creation. Walk animations would replace the "sliding" prototype jank. Facial expressions and poses could communicate emotional state visually. High impact for making characters feel alive. Include for demo.

---

### F. Screen Effects (Juice)
**Description:** Screen shake on critical hits, particle bursts on level-up, red flash during crisis.

**Status:** Basic floating numbers only. Advanced effects deferred.

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Design principle: "Every interaction should have a reaction." The game should feel responsive and alive. Key juice moments: crisis tension effects (red tint, urgency pulse), level-up celebration (particles, flash), activity completion feedback, critical hit impact. Combined with Sound Effects (Feature D), audio + visual juice together make moments land. Don't hold back on game feel.

---

### G. Save/Load System
**Description:** Persist game state for longer sessions or returning players.

**Status:** Intentionally omitted. 30-45 minute single-session design.

**Evaluation:** `✅ INCLUDE` (dev-only)

**Reasoning:** Demo is single-session (30-45 min) so player-facing save/load isn't needed. However, a simple dev-only save system (localStorage dump) would speed up testing - jump to pre-crisis, test different skill levels, verify edge cases. Quick to build, high testing utility. No polish burden of player-facing UI. Full save/load with proper UI can wait for full game.

---

### H. Conversation System
**Description:** Characters would have dialogue, conversations would affect relationships.

**Status:** Explicitly declared out-of-scope. Actions over dialogue philosophy.

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Full dialogue system is still out of scope, but reframe as "story prompts with reactions." Player can trigger story beats ("ask about dad") and get character reactions - visual/behavioral responses, not dialogue trees. Mom gets sad, changes behavior, shows a thought bubble. Reveals backstory through reactions, not exposition. Minimal writing, maximum flavor. Maintains "actions over dialogue" philosophy while adding narrative spice.

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
| 8 | Skill Progression System | Yes | `🔄 REDESIGN` |
| 9 | Activity Success/Failure System | Yes | `⚠️ SIMPLIFY` |
| 10 | Player Intervention | Yes | `🔄 REDESIGN` |
| 11 | Floating Number Feedback | Yes | `✅ INCLUDE` |
| 12 | Quest System | Yes | `🔄 REDESIGN` |
| 13 | Quest Celebration UI | Yes | `✅ INCLUDE` |
| 14 | Crisis Sequence | Yes | `✅ INCLUDE` |
| 15 | Shadow State (Crisis Penalty) | Yes | `❌ CUT` |
| 16 | Two-Ending System | Yes | `✅ INCLUDE` |
| 17 | Debug Controls | Yes | `⚠️ SIMPLIFY` |
| 18 | Character Panel UI | Yes | `🔄 REDESIGN` |
| A | Time-of-Day Preferences | No | `📋 DEFER` |
| B | Inter-Character Dynamics | No | `📋 DEFER` |
| C | Discoverable Stats | No | `❌ CUT` |
| D | Sound Effects | No | `✅ INCLUDE` |
| E | Character Animations | No | `✅ INCLUDE` |
| F | Screen Effects (Juice) | No | `✅ INCLUDE` |
| G | Save/Load System | No | `✅ INCLUDE` |
| H | Conversation System | No | `🔄 REDESIGN` |

## Key Decisions Needed

1. **Skill System Pivot:** Shift from passive auto-leveling to active skill point spending. Activities generate XP into shared pool; player chooses which skills to level. Creates meaningful decisions.

2. **Quest Reward System:** Quests should unlock talents/facility upgrades, not just be checkboxes. Makes progression purposeful and drives the whole session.

3. **Utility AI Hierarchy:** Replace weighted average with tiered priorities: basic needs first → color preferences → activity difficulty. Progressive refinement up the hierarchy.

4. **Demo Narrative:** Crisis is designed to fail. "Mother Lost" is the intended ending that hooks players into buying the full game (institution arc). Secret "Mother Saved" ending rewards replayers.

5. **Forcing Mechanic:** Keep forcing but make it emotionally resonant. Frank/Elling dynamic - humor in reluctant compliance, visible struggle, occasional triumph.

6. **Information Architecture:** Upgrades unlock understanding (hire psychiatrist → see purpose stat). Tie discoverable stats to the talent/upgrade system.

7. **Juice Philosophy:** "Every interaction should have a reaction." Don't hold back on audio/visual feedback.

8. **Character Isolation:** Isolation between Mother and Elling is narratively intentional - explains Elling's underdevelopment. Inter-character dynamics belong in the institution arc.

## Summary Counts

| Evaluation | Count |
|------------|-------|
| ✅ INCLUDE | 13 |
| ⚠️ SIMPLIFY | 4 |
| 🔄 REDESIGN | 6 |
| ❌ CUT | 2 |
| 📋 DEFER | 2 |
| **Evaluated** | 26 |
| **Remaining** | 0 |

---

*Post-mortem created: 2026-02-02*
*Evaluation completed: 2026-02-03*
