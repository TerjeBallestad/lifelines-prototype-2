# Features Research: Life-Sim Character Prototype

**Domain:** Systems testbed for MTG color personality validation
**Core question:** Does "MTG colors + minimal config" create interesting, watchable character behavior?
**Scope:** 2 characters, ~10 days, crisis ending

---

## Table Stakes

Features required to validate the core thesis. Without these, you cannot answer "do colors make characters interesting?"

### 1. Color-Driven Activity Preferences
**What:** Characters gravitate toward activities matching their colors (Blue Elling prefers reading) and resist mismatched activities.
**Complexity:** Medium
**Why table stakes:** This IS the core thesis. If colors don't visibly affect what characters choose to do, you're not testing anything.
**Minimum viable:** 5-6 activities with clear color affinities. Characters must autonomously choose differently based on color profiles.
**Success signal:** Watching Elling, player thinks "he always picks reading" — watching Mother, player thinks "she always cooks or helps."

### 2. Observable Autonomous Behavior
**What:** Characters act without player input, making decisions the player can observe and learn patterns from.
**Complexity:** High
**Why table stakes:** "Watchable" requires autonomy. If players must direct every action, they're not observing emergent behavior — they're just playing a command interface.
**Minimum viable:** Characters choose activities during free time. Player sees decisions happening.
**Success signal:** Player can predict "Elling will probably..." before he does it.

### 3. Shadow State Behavior Flip
**What:** When colors become "unhealthy" (low color health), character behavior visibly changes — not gradually, but as a distinct mode.
**Complexity:** Medium
**Why table stakes:** This tests whether the color system creates distinct behavioral states, not just preferences. Dwarf Fortress showed that visible personality-driven behavior patterns are what make characters feel alive.
**Minimum viable:** One observable behavior change per character when entering shadow state. Elling's Blue shadow = analysis paralysis (stops acting, just sits).
**Success signal:** Player recognizes "oh no, he's in shadow mode" from behavior alone.

### 4. Skill-Gated Actions
**What:** Characters can only do activities they have skills for. Elling can't cook (skill 0), Mother can't do what Elling can't.
**Complexity:** Low
**Why table stakes:** This creates the dependency dynamic and crisis stakes. If anyone can do anything, there's no tension.
**Minimum viable:** 3-4 skill levels visible in outcomes. Phone skill (0-2) determines crisis resolution.
**Success signal:** Player learns "Elling CAN'T do that" through failed attempts or refusals.

### 5. Resource Output with Juicy Feedback
**What:** Activities produce visible output (creativity numbers, food, etc.) with satisfying visual/audio feedback.
**Complexity:** Low-Medium
**Why table stakes:** "Arcade feel" requires feedback. This is what makes watching characters satisfying rather than boring. The Sims and idle games prove that watching numbers go up with good feedback is inherently satisfying.
**Minimum viable:** Numbers float up from activities. Color coding (good/bad). Screen shake or particle burst on big outputs.
**Success signal:** Player feels "yes!" when Mother produces 50 creativity, "aww" when Elling produces 5.

### 6. Overskudd/Energy System
**What:** Characters have limited capacity (overskudd) that gates what they can/will do.
**Complexity:** Low
**Why table stakes:** Creates rhythm and stakes. Without depletion, there's no management game.
**Minimum viable:** Visible overskudd meter. Low overskudd = refuses activities or retreats to comfort behaviors.
**Success signal:** Player learns to read "he's running low" from behavior before checking meter.

### 7. Day/Time Progression
**What:** Time passes, days advance, game has a ~10 day arc.
**Complexity:** Low
**Why table stakes:** Creates urgency and narrative structure. Without time, there's no "before the fall."
**Minimum viable:** Day counter. Time-of-day affects available activities. Day 10 triggers crisis.
**Success signal:** Player feels time pressure, thinks "I should have trained phone skill earlier."

### 8. Crisis Sequence with Skill Checks
**What:** Day 10 crisis where Mother collapses, Elling's skills determine outcome.
**Complexity:** Medium
**Why table stakes:** This is the payoff that validates whether the systems created meaningful stakes.
**Minimum viable:** Phone skill check. Player sees Elling try and fail (or succeed if trained).
**Success signal:** Player feels "the system showed me this would happen" — tragedy emerges from mechanics.

---

## Differentiators

Features that would strengthen the test but aren't required to answer the core question.

### 1. Player Intervention System
**What:** Player can push characters toward activities they wouldn't choose autonomously.
**Complexity:** Medium
**Why differentiating:** Tests whether player can "optimize" character growth — the intended satisfaction loop.
**Trade-off:** Adds UI complexity. Could test color system without this (pure observation mode).
**Recommendation:** Include. The thesis is "minimal config creates interesting characters" — intervention is how players interact with that.

### 2. Discoverable Stats (Watch First, Reveal Later)
**What:** Color values and skill levels hidden initially, revealed through observation or specific actions.
**Complexity:** Medium
**Why differentiating:** Creates mystery and discovery loop. Player becomes "personality detective."
**Trade-off:** Harder to debug/tune if stats are hidden. Could obscure whether system is working.
**Recommendation:** Defer for prototype. Show stats during testing, add discovery layer if core loop works.

### 3. Quest System with Objectives
**What:** Explicit goals like "Produce 300 creativity" that teach mechanics.
**Complexity:** Medium
**Why differentiating:** Guides player attention, creates tutorial structure.
**Trade-off:** Quests aren't needed to test if colors create interesting behavior — that's observable without goals.
**Recommendation:** Include 3-4 simple quests. They provide structure for the ~10 day arc.

### 4. Multiple Endings
**What:** Mother saved (rare) vs Mother lost (default) based on phone skill training.
**Complexity:** Low
**Why differentiating:** Rewards mastery, creates replay value.
**Trade-off:** Requires hidden skill training path, more testing.
**Recommendation:** Include. The "hidden save path" validates that players learned the systems.

### 5. Relationship Dynamics (Between Elling and Mother)
**What:** Color interactions affect how characters relate — allied colors bond, enemy colors clash.
**Complexity:** Medium
**Why differentiating:** Creates emergent social dynamics, which is half of what makes life-sims interesting.
**Trade-off:** With only 2 characters, relationship dynamics are simpler. Full system matters more with multiple patients.
**Recommendation:** Basic version only. Mother/Elling have warm relationship baseline, tension when Elling is in shadow.

### 6. Thought Bubbles / Emotion Indicators
**What:** Sims-style visual indicators showing what characters want or feel.
**Complexity:** Low
**Why differentiating:** Makes internal state observable without revealing mechanics.
**Trade-off:** Could make behavior too obvious, reducing discovery.
**Recommendation:** Include minimal version. Icons for needs (hunger, tired), emotion faces. Not color indicators.

### 7. Activity Refusal with Personality Flavor
**What:** When characters refuse activities, the refusal reflects their colors (Blue: "What's the point?", Red: "Not again!").
**Complexity:** Low-Medium
**Why differentiating:** Makes color system feel alive in moments of conflict, not just preference.
**Trade-off:** Requires writing personality-flavored refusal text for each color.
**Recommendation:** Include for Elling only. 2-3 refusal variants based on Blue shadow state.

---

## Anti-Features

Features to deliberately NOT build. These add complexity without testing the core thesis.

### 1. Conversation System
**What:** Characters talking to each other with topic selection, dialog trees, emotional responses.
**Why anti-feature for prototype:** Already decided to skip. Conversation is a whole second system that doesn't test whether colors create interesting autonomous behavior. Colors affect what characters DO, not what they SAY. Test actions first.
**Risk if included:** Scope explosion. Conversation systems are infinitely deep.
**When to add:** After core activity loop validates colors, add conversation as expansion.

### 2. Full Skill Tree
**What:** Extensive skill progression with unlock paths, prerequisites, branching.
**Why anti-feature:** The demo needs 4-5 skills that matter for the crisis. A full tree obscures whether the color system is working.
**Risk if included:** Complexity hides signal. "Is the game interesting because of colors or because of skill tree?"
**When to add:** After color system validated, expand skills for full game.

### 3. Multiple Patients / Characters
**What:** More than Elling and Mother.
**Why anti-feature:** Two characters is the minimum to show color-driven behavior difference. Adding more multiplies complexity without testing anything new.
**Risk if included:** Lose focus on the core test. "Are colors interesting?" is answered with 2 characters.
**When to add:** After demo validates premise, expand to community home with multiple patients.

### 4. Building / Environment Customization
**What:** Player can modify the house, place furniture, decorate.
**Why anti-feature:** Tests nothing about character personalities. It's a separate game loop.
**Risk if included:** Players optimize environment instead of observing characters.
**When to add:** Maybe never. "Arcade feel" suggests fixed environments.

### 5. Meta-Progression / Roguelike Elements
**What:** Unlocks between runs, persistent progression, procedural generation.
**Why anti-feature:** The demo is one story. Meta-progression assumes the core loop is fun — you're still testing that.
**Risk if included:** Premature optimization of a loop that might not work.
**When to add:** After core loop validated, add meta-layer for replayability.

### 6. Realistic Simulation Depth
**What:** Detailed needs (hunger, hygiene, bladder, fun, social, room, environment), complex schedules, realistic time scales.
**Why anti-feature:** "NBA Street vs NBA2K" — arcade feel means simplified systems. The Sims' autonomy problems come from trying to simulate everything.
**Risk if included:** Characters spend all time eating and sleeping. Overskudd as single meter is intentionally abstract.
**When to add:** Never. This is a design philosophy, not a scope cut.

### 7. Audio System
**What:** Sound effects, music, ambient audio.
**Why anti-feature for prototype:** Can test core loop with visual feedback only. Audio is polish, not validation.
**Risk if included:** Audio work consumes time that should go to systems testing.
**When to add:** After core loop validated, add audio for juice/feel.

### 8. Save/Load System
**What:** Persistent game state across sessions.
**Why anti-feature for prototype:** 30-45 minute demo can be played in one sitting. Save/load adds testing complexity.
**Risk if included:** Edge cases in state restoration obscure whether systems work.
**When to add:** When demo extends beyond single session.

### 9. Character Creation / Customization
**What:** Player defines character colors, skills, appearance.
**Why anti-feature:** The demo tests specific characters (Elling, Mother) with known color profiles. Customization adds variance that makes testing harder.
**Risk if included:** "Is the system broken or did I create a bad character?"
**When to add:** After color system proven, add for full game variety.

### 10. Tutorial Overlays / Hand-Holding
**What:** Explicit tutorial popups, arrows pointing to UI, forced sequences.
**Why anti-feature:** Breaks "discoverable" design philosophy. Quests provide implicit guidance.
**Risk if included:** Players learn from tutorial, not from observing characters.
**When to add:** Only if playtesting shows players completely lost.

---

## Feature Dependencies

What must exist before what can work.

```
Time System ─────────────────────────────────────────┐
     │                                               │
     v                                               │
Needs/Overskudd ──────────────────────────────────┐  │
     │                                            │  │
     v                                            v  v
Character State ──> Shadow State Detection ──> Crisis Trigger
     │
     v
Activity System ──> Color-Driven Preferences ──> Autonomous Behavior
     │                    │
     v                    v
Skill System ────> Skill-Gated Activities ──> Resource Output
     │
     v
Skill Checks ────> Crisis Resolution ──> Endings
```

**Build order implication:**
1. Time + Needs + Character State (the tick)
2. Activities + Skills (the actions)
3. Color preferences + Autonomy (the personality)
4. Shadow state + Crisis (the payoff)

---

## MVP Feature Set (Recommended)

To test "do MTG colors create interesting characters?" with minimum effort:

**MUST HAVE:**
- 2 characters with distinct color profiles (Elling: Blue/Green, Mother: White/Green/Blue)
- 5-6 activities with color affinities
- Autonomous behavior (characters choose activities)
- Overskudd system gating behavior
- Shadow state behavior flip (1 observable change each)
- Day progression (10 days)
- Crisis sequence with phone skill check
- Resource output with basic juice (floating numbers)

**SHOULD HAVE:**
- Player intervention (push toward activities)
- 3-4 quests for structure
- Basic thought bubbles (needs icons)
- Two endings (save/don't save)

**SHOULD NOT HAVE:**
- Conversation system
- Discoverable stats (show stats for testing)
- Full skill tree
- Audio
- Save/load

**DEFINITELY NOT:**
- Multiple patients
- Building system
- Meta-progression
- Realistic simulation depth

---

## Sources

**Life-sim design patterns:**
- [Paralives development approach](https://store.steampowered.com/app/1118520/Paralives/) - character AI as differentiator
- [Idle game design principles](https://machinations.io/articles/idle-games-and-how-to-design-them) - autonomous progression, observation satisfaction

**Character personality systems:**
- [Dwarf Fortress personality traits](https://dwarffortresswiki.org/index.php/DF2014:Personality_trait) - beliefs, facets, emergent behavior
- [Dwarf Fortress emergent narrative research](https://www.researchgate.net/publication/356686095_Characterization_and_Emergent_Narrative_in_Dwarf_Fortress) - how personality creates story

**MTG color system:**
- [Duncan Sabien's MTG color wheel analysis](https://homosabiens.substack.com/p/the-mtg-color-wheel) - colors as personality framework
- [MTG color pie explained](https://draftsim.com/mtg-color-wheel/) - allied/enemy relationships

**The Sims autonomy:**
- [Better Autonomy mod analysis](https://www.patreon.com/posts/better-autonomy-62529639) - what default autonomy gets wrong
- [Deeper Social Autonomy mod](https://www.curseforge.com/sims4/mods/deeper-social-autonomy) - traits should affect behavior

**Game juice and feel:**
- [Making games juicy](https://medium.com/@yemidigitalcash/when-you-play-a-great-game-it-feels-good-d23761b6eccf) - feedback without complexity
- [Game Analytics on juice](https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design) - polish as core, not afterthought

**Scope management:**
- [Avoiding scope creep in indie games](https://www.wayline.io/blog/scope-creep-indie-games-avoiding-development-hell) - define core loop first
- [Feature prioritization](https://www.codecks.io/blog/2025/how-to-avoid-scope-creep-in-game-development/) - must-have vs nice-to-have

**Shadow/personality psychology:**
- [Shadow self in games](https://www.gamedeveloper.com/design/the-role-of-the-shadow-self-in-games) - Jungian archetype as game mechanic

**AI behavior patterns:**
- [Utility AI vs Behavior Trees](https://www.gamedeveloper.com/programming/indie-ai-programming-from-behaviour-trees-to-utility-ai) - utility AI for personality-driven decisions
- [Game AI planning comparison](https://tonogameconsultants.com/game-ai-planning/) - when to use which approach

---

*Researched: 2026-01-27*
*Confidence: HIGH for table stakes/anti-features (clear design constraints), MEDIUM for differentiators (depends on testing)*
