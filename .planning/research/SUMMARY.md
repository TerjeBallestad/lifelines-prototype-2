# Project Research Summary

**Project:** Before the Fall
**Domain:** Character-driven life-sim prototype (web-based testbed)
**Researched:** 2026-01-27
**Confidence:** HIGH

## Executive Summary

"Before the Fall" is a React-based prototype testing whether MTG color personalities create distinct, interesting character behavior. The recommended approach is deceptively simple: use the existing mental-sine-waves stack (React 19 + MobX + Vite + Tailwind), add a custom game loop hook, and focus ruthlessly on observable behavior differences rather than simulation depth. The key insight across all research is that this prototype succeeds or fails based on whether players can watch two characters (Elling and Mother) and immediately perceive personality-driven behavior patterns.

The architecture should follow a unidirectional data flow with MobX observable classes serving as a pseudo-ECS pattern. Time ticks drive everything, characters respond through color-filtered preferences, and the UI observes and reacts. Build order is critical: establish time and character systems first (Phase 1), add the activity loop second (Phase 2), layer on juice and feedback third (Phase 3), and save complex systems like shadow states and crisis sequences for later phases when the core thesis is validated.

The primary risk is over-engineering. The user has explicitly flagged a tendency to create "overcomplicated systems that focus too much on realistically simulating real humans." All research points to the same mitigation: exaggerate rather than simulate, make everything observable, and apply the arcade philosophy ("NBA Street vs NBA2K"). The mantra is: "If a player can't see it, don't simulate it." Success means distinct, readable character behavior in 30-45 minutes, not realistic human psychology.

## Key Findings

### Recommended Stack

The existing mental-sine-waves stack is excellent and should be carried forward wholesale. The only additions needed are game-specific tools for loops, animation, and feedback. The critical decision is to avoid formal ECS libraries—MobX observable classes already provide entity-like patterns that integrate better with React.

**Core technologies:**
- **React 19 + TypeScript**: UI framework with strong typing for game state and entity definitions. React Compiler provides automatic optimization.
- **MobX 6.15**: Reactive state management where observable classes become game entities, computed values derive state, and fine-grained reactivity ensures only affected UI re-renders.
- **Vite (Rolldown) 7.2.5**: Experimental but stable build tool that's 10-30x faster than Rollup.
- **Tailwind CSS 4 + DaisyUI 5**: Utility styling with component library for rapid UI development.
- **Custom game loop hook**: Fixed-timestep `useGameLoop` with requestAnimationFrame (pattern provided in STACK.md) for deterministic simulation.
- **Motion (Framer Motion) 12.27**: Physics-based animations for "juice"—spring physics, layout animations, gesture support.
- **use-sound 5.0**: Tiny sound effects library with Howler.js backend, audio sprite support for game feedback.
- **canvas-confetti 1.9.3**: Lightweight particle bursts for celebrations and critical moments.

**Key architecture decision:** MobX observable classes ARE the entity system. Do not add formal ECS libraries like miniplex or ape-ecs—they solve cache-locality problems irrelevant to a 2-character prototype and add massive complexity. Character instances are observable classes with computed values for derived state (mood from needs, dominant color from profile).

### Expected Features

The feature research identified a clear hierarchy that directly serves the thesis validation: "Do MTG colors create interesting, watchable characters?"

**Must have (table stakes):**
- **Color-driven activity preferences**: Characters gravitate toward color-matching activities (Blue Elling prefers reading, White/Green Mother prefers cooking/helping). This is THE core thesis.
- **Observable autonomous behavior**: Characters act without player input. Autonomy creates watchability—players observe patterns rather than command actions.
- **Shadow state behavior flip**: When color health drops below threshold, behavior visibly changes (Blue shadow = analysis paralysis, character stops acting).
- **Skill-gated actions**: Characters can only do what their skills allow. Creates dependency dynamics and crisis stakes.
- **Resource output with juicy feedback**: Activities produce visible output (creativity numbers, food) with satisfying feedback (floating numbers, color coding, particles).
- **Overskudd (energy) system**: Limited capacity gates behavior. Low overskudd = refuses activities or retreats to comfort behaviors.
- **Day/time progression**: Time passes, ~10 day arc creates urgency and narrative structure.
- **Crisis sequence with skill checks**: Day 10 crisis where Mother collapses, Elling's phone skill determines outcome. The payoff that validates stakes.

**Should have (differentiators):**
- **Player intervention**: Player can push characters toward activities they wouldn't autonomously choose. Tests optimization loop.
- **Quest system (3-4 simple quests)**: Provides structure and teaches mechanics implicitly without tutorial overlays.
- **Two endings**: Mother saved (rare, requires hidden phone skill training) vs Mother lost (default). Rewards mastery.
- **Basic thought bubbles**: Sims-style icons for needs (hunger, tired) and emotions. Makes internal state observable without revealing mechanics.

**Defer to later/never (anti-features):**
- **Conversation system**: Whole second system, scope explosion. Colors affect actions first, speech later.
- **Full skill tree**: Obscures signal. Need 4-5 skills that matter for crisis, not extensive progression.
- **Multiple patients**: Two characters answers the question. More adds complexity without new validation.
- **Building/environment customization**: Tests nothing about personalities. Separate game loop.
- **Realistic simulation depth**: "Arcade feel" means simplified systems. Overskudd as single meter intentionally replaces hunger/hygiene/fun/social/etc.
- **Audio system**: Can test core loop with visual feedback only. Audio is polish after validation.
- **Save/load**: 30-45 minute demo plays in one sitting.

### Architecture Approach

The architecture follows a unidirectional data flow pattern with MobX observables. Time is the root—it drives all updates, characters respond through observable state changes, and React components automatically re-render via MobX observer pattern. The recommended structure uses a Root Store pattern connecting domain-specific stores (TimeStore, CharacterStore, ActivityStore, QuestStore, CrisisStore, InteractionStore).

**Major components:**
1. **TimeStore**: Central clock (day/hour/minute, pause state, time-of-day computed). Drives the game loop. Depends on nothing—root of data flow.
2. **CharacterStore**: Character entities with MTG colors, skills, needs, overskudd (computed), shadow state detection, current activity. Depends on Time for decay.
3. **ActivityStore**: Activity definitions, outcome calculation, duration tracking. Depends on Character (skills, color affinity) and Time (duration).
4. **QuestStore**: Quest definitions, objective tracking, unlock conditions. Depends on Time (day unlocks), Character (completion), Activity (resource tracking).
5. **CrisisStore**: Day 10 state machine (trigger/active/emergency_called/ambulance_arrived/aftermath phases). Depends on Time (triggers) and Character (skill checks).
6. **InteractionStore**: Player input routing, UI state (selected character, context menus), feedback queue for juice. Depends on all stores (routing layer).

**Data flow pattern:** Game loop calls TimeStore.tick → Time updates → CharacterStore.updateAll (decay needs, recalculate overskudd) → ActivityStore.updateActivities (progress, complete, apply effects) → QuestStore/CrisisStore check triggers → React components auto-update via MobX observer.

**Key pattern:** Lower layers don't know about higher layers. TimeStore knows nothing. CharacterStore knows Time. ActivityStore knows Character and Time. Quest/Crisis know their dependencies but not each other. InteractionStore knows everything (routing).

### Critical Pitfalls

Research identified ten pitfalls across three severity levels. The top five critical pitfalls that could cause prototype failure:

1. **Simulation Fidelity Trap**: Building realistic behavior simulation instead of readable character behavior. Warning signs: spending time on edge cases over feedback, adding formulas "because it's realistic," characters feel random rather than consistent. Prevention: "Rule of Perception"—if the player can't observe the difference, don't calculate it. Start with 2 colors per character (dominant + secondary), not 5. Apply RimWorld principle: "A simulation the player can observe and comprehend."

2. **Delayed Core Loop Validation**: Building supporting systems (UI, quests, crisis) before confirming the core thesis works. Warning signs: working on day 10 crisis before knowing if days 1-9 are interesting. Prevention: First playable milestone is two characters, one activity type, visible behavior differences—that's it. Timebox to 2-3 days. If you can't see color-driven behavior differences, the system design needs revision, not more features. Test with programmer art before polish.

3. **Opaque Systems = No Learning**: Hidden stats become unknowable rather than discoverable. Warning signs: players can't form theories about characters, correct play requires documentation, players blame randomness. Prevention: Feedback before mystery. Show behavioral output clearly (text, animation, numbers) before hiding inputs. Characters telegraph colors through repeated behavior patterns. Add output visibility before reducing system complexity.

4. **Fun-Last Development**: Building "correct" but not enjoyable systems. Warning signs: characters behave realistically but boringly, activities resolve without satisfying feedback, watching feels like spreadsheet updates. Prevention: Juice every output (numbers, expressions, color flashes). Make behaviors exaggerated ("Elling ONLY wants to read"). Test with "Is this fun to watch if you do nothing?" Apply arcade design: exaggerated, simplified, instant gratification.

5. **Feature Creep Disguised as Testing**: Adding systems "to test properly" that aren't required for thesis validation. Warning signs: adding features to make prototype "complete," building skill training before characters are interesting to train. Prevention: MoSCoW method—Must have (color preferences, visible behavior), Should have (overskudd, intervention, feedback), Could have (shadow state, quests, crisis), Won't have (conversation, multiple patients, skill trees). Before adding any feature, ask: "Does this help answer whether colors create distinct characters?"

**Specific user mitigation (over-engineering tendency):**
- The 2-Color Rule: Each character starts with 2 colors only. Add third only if proven insufficient.
- The Observable Behavior Test: Before implementing any calculation, write what the player will see.
- The Removal Test: After implementing, ask "If I removed this, would prototype still answer thesis?" If yes, consider removing.
- The Complexity Budget: Allow 3 "complex" systems total—(1) Color-to-activity preference, (2) Overskudd gating, (3) Shadow state flip. That's it.
- The Mantra: "If a player can't see it, don't simulate it."

## Implications for Roadmap

Based on system dependencies, architectural patterns, and pitfall avoidance, the recommended phase structure follows a strict build order that validates the core thesis before adding complexity.

### Phase 1: Foundation — Core Loop Validation
**Rationale:** Time is the root of all data flow. Character needs decay demonstrates the loop. Can test with simple UI showing numbers change. This phase MUST answer the question: "Do MTG colors create distinct, watchable behavior?" Nothing else matters if this fails.

**Delivers:**
- TimeStore with day/hour/minute progression
- CharacterStore with 2 characters (Elling: Blue/Green, Mother: White/Green)
- Basic needs (energy, social, purpose) that decay over time
- Overskudd computed value (visible meter)
- Simple game loop running at fixed timestep
- Observable behavior differences when characters idle

**Addresses (features):**
- Day/time progression (table stakes)
- Overskudd/energy system (table stakes)
- Foundation for autonomous behavior (table stakes)

**Avoids (pitfalls):**
- Simulation Fidelity Trap: Use exaggerated values (Elling = 1.0 Blue, not 0.75). Make differences obvious.
- Delayed Core Loop Validation: Timebox to 1 week maximum. If behavior isn't distinct by end of week, iterate on design before Phase 2.
- Observable Behavior Test: Every character state must have visible UI representation.

**Gate criteria:** Can a player watching two idle characters for 2 minutes perceive personality differences? If no, do not proceed.

### Phase 2: Gameplay Loop — Activity System
**Rationale:** Activities are the primary player interaction and the mechanism through which colors manifest. This phase implements the color-driven preference system—the core thesis mechanic.

**Delivers:**
- ActivityStore with 5-6 activities (read, cook, practice phone, etc.)
- Color affinity system (activities have color weights, characters prefer matching colors)
- Skill requirements (cooking requires skill 1+, phone requires none but is uncomfortable)
- Activity duration tracking and completion
- Resource output (creativity, food production)
- Characters autonomously choosing activities based on color preferences
- Player intervention system (push toward activities)

**Addresses (features):**
- Color-driven activity preferences (table stakes—THE CORE)
- Observable autonomous behavior (table stakes)
- Skill-gated actions (table stakes)
- Player intervention (should have)

**Uses (stack):**
- MobX computed values for available activities filtering
- Activity definitions from data files
- Character skills map

**Implements (architecture):**
- ActivityStore component
- Activity-to-Character relationship
- Color affinity calculation logic

**Avoids (pitfalls):**
- Feature Creep: Only 5-6 activities. Resist adding more until these prove interesting.
- Analysis Paralysis: Use extreme color values initially. Tune toward subtlety only after obvious differences work.

**Gate criteria:** Can a player watch for 5 minutes and say "Elling prefers X, Mother prefers Y"? Do characters feel distinct?

### Phase 3: Juice & Feedback — Arcade Feel
**Rationale:** The research consistently emphasizes that "arcade feel" requires active design for fun. This phase addresses the "Fun-Last Development" pitfall by adding satisfying feedback before expanding systems.

**Delivers:**
- Motion animations for activity starts/completions (spring physics, scale effects)
- Floating numbers on resource output (animated with physics)
- Sound effects for key actions (activity start, completion, success/failure)
- Visual feedback for color affinity (highlight preferred activities)
- Thought bubbles for needs states (hungry, tired icons)
- Context menu with juicy hover/selection states
- Particle effects for major events (canvas-confetti)
- Screen shake for critical moments

**Addresses (features):**
- Resource output with juicy feedback (table stakes)
- Basic thought bubbles (should have)

**Uses (stack):**
- motion (Framer Motion) for all animations
- use-sound for audio feedback
- canvas-confetti for particle bursts
- Tailwind utilities for color coding

**Implements (architecture):**
- InteractionStore feedback queue
- Animation trigger system
- Sound cue coordination

**Avoids (pitfalls):**
- Fun-Last Development: This phase exists specifically to address it. Juice serves readability—exaggerate, don't just prettify.
- Opaque Systems: Visible feedback makes internal state observable without revealing mechanics.

**Gate criteria:** Does watching activities feel satisfying? Do players respond emotionally to outcomes ("yes!" vs "aww")?

### Phase 4: Shadow State — Behavioral Depth
**Rationale:** Shadow states add behavioral variation without adding new core systems. Only tackle this after core loop proves interesting. This tests whether color states (healthy vs shadow) create meaningful gameplay tension.

**Delivers:**
- Color health tracking (decays when acting against color, recovers when aligned)
- Shadow state detection (color health < 30% threshold)
- Shadow behavior modifications (Blue shadow = analysis paralysis, stops acting)
- Recovery mechanics (aligned activities restore color health)
- Visual indicators for shadow state (character appearance change, UI warnings)

**Addresses (features):**
- Shadow state behavior flip (table stakes)

**Implements (architecture):**
- Character shadow state computed
- Behavior modification system
- Color health decay/recovery

**Avoids (pitfalls):**
- Designing for Edge Cases First: Ignore what happens when all colors are equal. Handle the 80% case (clear dominant color).
- Complexity Budget: This is complex system #3 (final one allowed).

**Gate criteria:** Do players recognize shadow state from behavior alone ("oh no, he's stuck")? Is recovery clear?

### Phase 5: Direction & Stakes — Quest + Crisis
**Rationale:** Requires all other systems functional. Quests provide player direction. Crisis is the climax that validates whether the systems created meaningful stakes. This phase tests whether training phone skill (uncomfortable for Blue Elling) pays off in the emergency.

**Delivers:**
- QuestStore with 3-4 simple quests (morning routine, produce 50 creativity, train phone)
- Quest objective tracking (activity completion, resource totals, skill levels)
- Day-based quest unlocking
- CrisisStore with state machine (trigger → active → phone attempt → outcome)
- Phone skill check during crisis (level 0-1 = fail, level 2+ = success)
- Two endings (Mother saved vs lost)
- Crisis UI overlays
- Ending screens

**Addresses (features):**
- Quest system (should have)
- Crisis sequence with skill checks (table stakes)
- Two endings (should have)

**Implements (architecture):**
- QuestStore component
- CrisisStore state machine
- Day 10 trigger system

**Avoids (pitfalls):**
- Testing in Isolation: This phase integration-tests all prior systems working together.
- False Positive Risk: Get external playtest before concluding "it works."

**Gate criteria:** Do players feel time pressure? Does the crisis feel like natural consequence rather than arbitrary event? Do endings reflect player understanding of systems?

### Phase 6: Polish & Validation — Playtest Iteration
**Rationale:** After all systems integrated, focus on playtesting, edge case handling, and validation that prototype answers the thesis question.

**Delivers:**
- External playtests (minimum 3 observers)
- Bug fixes and edge case handling
- Tuning of numbers (color values, decay rates, time scales)
- Final juice pass (additional animations, sound polish)
- Documentation of findings (what worked, what didn't, insights for Unreal)

**Avoids (pitfalls):**
- Perfectionism Before Feedback: Show early and often. Ugly prototypes teach more.
- False Negative: Before concluding "colors don't work," iterate implementation 3 times. Check: colors exaggerated enough? Feedback visible? Enough observation time?
- Prototype Scope Becomes Game Scope: Define clear end criteria. When answered, prototype is DONE. Document and move to Unreal.

**Gate criteria:** Can external players (not you) distinguish character personalities by watching? Do they form theories? Can they predict behavior?

### Phase Ordering Rationale

This order follows three principles discovered in research:

1. **Dependency hierarchy**: Time → Character → Activity → Quest/Crisis. Lower layers can't depend on higher layers. Build from root upward.

2. **Thesis validation first**: Phases 1-3 must prove "colors create distinct behavior" before Phases 4-5 add complexity. If core fails, complex systems won't save it.

3. **Pitfall avoidance strategy**: Build observable outputs (Phase 1-2), add satisfying feedback (Phase 3), then layer complexity (Phase 4-5) only after core validated. This sequence prevents simulation fidelity trap and fun-last development.

The architecture research explicitly provides this build order in Phase sections. The features research dependency diagram shows Time/Needs/State as foundation, Activity/Skills as layer 2, Color preferences/Autonomy as layer 3, Shadow/Crisis as layer 4. The stack research confirms MobX computed values work best when basic observables are established first.

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 2 (Activity System)**: Color affinity calculation formula needs design. How exactly do color weights (0.0-1.0) combine with character color profile to produce preference scores? Research suggests approaches but doesn't provide exact formula.
- **Phase 4 (Shadow State)**: Color health decay/recovery curves need tuning. What decay rate creates tension without frustration? Research identifies the mechanic but not the numbers.
- **Phase 5 (Crisis)**: State machine timing needs careful design. How long should each phase last for dramatic tension? Research provides structure but not specific timings.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation)**: Time system is straightforward requestAnimationFrame loop with delta accumulation. Pattern provided in STACK.md.
- **Phase 3 (Juice)**: Motion, use-sound, and canvas-confetti have clear documentation. Implementation is applying library APIs.
- **Phase 6 (Polish)**: Playtesting is observational, not research-based.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | Versions verified via npm/official sources. mental-sine-waves reference project validates the approach. All technologies are current stable releases. Custom patterns (game loop, entity as observable class) are well-documented. |
| Features | **HIGH** | Table stakes vs anti-features are clearly delineated based on thesis validation needs. Feature dependencies mapped to architecture build order. Life-sim design patterns and MTG color system research provide strong foundation. |
| Architecture | **HIGH** | Based on official MobX patterns, verified reference project (mental-sine-waves), and established game architecture principles. Root Store pattern is proven. Component boundaries are clear. Build order follows dependency hierarchy. |
| Pitfalls | **HIGH** | Grounded in established game design literature (RimWorld, Dwarf Fortress analysis), prototyping best practices, and user's self-identified tendency (over-engineering). Context-specific warnings address project philosophy ("arcade not simulation"). |

**Overall confidence:** **HIGH**

All four research areas converged on consistent recommendations. The stack supports the architecture, the architecture enables the features, the features validate the thesis, and the pitfalls warn against the specific ways this could fail. The user's over-engineering tendency is well-documented and directly addressed with concrete guardrails.

### Gaps to Address

Despite high overall confidence, several areas need validation during implementation:

- **Color affinity formula**: Research identifies the concept (activities have color weights, characters have color profiles) but doesn't provide the exact calculation. During Phase 2 planning, design the preference scoring function. Consider simple weighted dot product vs more complex formulas. Start simple.

- **Time scale tuning**: What real-time duration should equal one game hour? Research suggests "10 game-minutes per real-second" but doesn't validate this feels right for ~10 day arc in 30-45 minute playthrough. Expect iteration in Phase 1.

- **Shadow state threshold**: At what color health percentage does shadow state trigger? Research suggests 30% but this needs playtesting validation. May vary by color (Blue might shadow earlier, Red later).

- **Activity duration balance**: How long should activities take? Research provides "1 hour" baseduration for reading/cooking but doesn't address how many activities should fit in a game day or whether durations should vary significantly.

- **External playtest accessibility**: The prototype must be testable by non-experts. Plan for simple deployment (localhost? hosted somewhere?) so external observers can actually playtest without development environment.

- **Prototype success criteria**: Define explicit "thesis validated" vs "thesis rejected" criteria before Phase 1. What observable outcomes mean success? Prevents false positive/negative risks identified in pitfalls.

## Sources

### Primary (HIGH confidence)

**Stack Research:**
- React Releases (https://github.com/facebook/react/releases) — React 19.2.1 verified current
- MobX npm (https://www.npmjs.com/package/mobx) — MobX 6.15.0 verified current
- Tailwind CSS Blog (https://tailwindcss.com/blog/tailwindcss-v4) — v4 released Jan 2025
- Motion npm (https://www.npmjs.com/package/framer-motion) — v12.27.0 verified
- Fix Your Timestep (https://gafferongames.com/post/fix_your_timestep/) — Game loop fundamentals
- MobX React Integration (https://mobx.js.org/react-integration.html) — Official patterns

**Features Research:**
- Dwarf Fortress personality traits (https://dwarffortresswiki.org/index.php/DF2014:Personality_trait) — Emergent behavior from simple traits
- Duncan Sabien's MTG color wheel analysis (https://homosabiens.substack.com/p/the-mtg-color-wheel) — Colors as personality framework
- Idle game design principles (https://machinations.io/articles/idle-games-and-how-to-design-them) — Autonomous progression satisfaction
- Game juice resources (https://medium.com/@yemidigitalcash/when-you-play-a-great-game-it-feels-good-d23761b6eccf) — Feedback without complexity

**Architecture Research:**
- MobX Official Documentation (https://mobx.js.org/defining-data-stores.html) — Root Store pattern
- Reference project: mental-sine-waves (local codebase) — Singleton gameState pattern validation
- MobX Best Practices (https://tillitsdone.com/blogs/mobx-best-practices-for-react/) — React integration patterns

**Pitfalls Research:**
- How RimWorld fleshes out the Dwarf Fortress formula (https://www.gamedeveloper.com/design/how-i-rimworld-i-fleshes-out-the-i-dwarf-fortress-i-formula) — Comprehensible simulation (Tynan Sylvester)
- Game Design Principle: Transparency (https://www.gamedeveloper.com/design/game-design-principle-transparency) — Making mechanics observable
- 5 Common Game Prototyping Mistakes (https://www.gs-studio.eu/blog/game-prototyping-5-common-mistakes-game-developers-make-and-how-to-avoid-them) — Test one thing at a time
- Scope Creep in Indie Games (https://www.wayline.io/blog/scope-creep-indie-games-avoiding-development-hell) — Statistics on scope failures

### Secondary (MEDIUM confidence)

- Paralives development approach (Steam store page) — Character AI as differentiator
- Better Autonomy mod analysis (Patreon) — What default Sims autonomy gets wrong
- Game AI planning comparison (https://tonogameconsultants.com/game-ai-planning/) — When to use which approach
- Arcade vs Simulation philosophy (https://simtorque.wordpress.com/2013/01/22/arcade-vs-simulation-what-does-it-all-really-mean/)

### Tertiary (Project-specific context)

- GDD Evaluation & Open Questions (project file) — Identified experiential gaps
- Hidden Color System document (project file) — Current system complexity baseline
- Demo Systems Specification (TypeScript) (project file) — Design constraints

---
*Research completed: 2026-01-27*
*Ready for roadmap: YES*
