# Pitfalls Research

**Project:** Before the Fall
**Domain:** Life-sim/character-driven game prototype
**Researched:** 2026-01-27
**Confidence:** HIGH (based on established game design literature + project-specific context)

---

## Critical Pitfalls

These mistakes cause rewrites, abandoned prototypes, or fundamental failure to validate the thesis.

### 1. Simulation Fidelity Trap

- **The trap**: Building realistic human behavior simulation instead of *readable* character behavior. The color system document describes 50+ hidden stats, mood expressions across 5 colors x 5 states, decision-making formulas—this is exactly the kind of system that can balloon into complexity that players never perceive.

- **Warning signs**:
  - Spending more time on behavior edge cases than on player-visible feedback
  - Adding formulas "because it would be realistic"
  - The system produces correct behavior but players can't tell why
  - Characters feel random rather than consistent
  - Saying "the simulation is working" but unable to describe what the player experiences

- **Prevention**:
  - **Rule of Perception**: If the player can't observe the difference, don't calculate it. Every calculation must produce an observable output.
  - For this prototype: Start with 2 colors per character (dominant + secondary), not 5. Add complexity only if 2 proves insufficient.
  - Apply the RimWorld principle: "A simulation the player can observe and comprehend" (Tynan Sylvester).
  - Before implementing any behavior formula, ask: "What will the player see that tells them this is working?"

- **Recovery**: If you're deep in simulation complexity, list every hidden stat and ask "Does removing this change what the player sees?" Delete mercilessly.

- **Phase relevance**: Phase 1 (core behavior) must address this. If the minimal color system isn't readable, more complexity won't fix it.

### 2. Delayed Core Loop Validation

- **The trap**: Building supporting systems (UI, progression, quests) before confirming the core thesis works. The project's thesis is "MTG colors + minimal stats = interesting, distinct characters." Everything else is irrelevant if this doesn't work.

- **Warning signs**:
  - Working on quest systems, crisis sequences, or skill training before two characters behave distinctly
  - Building the "day 10 crisis" before knowing if days 1-9 are interesting to watch
  - Polishing visual feedback before having behavior worth watching
  - The scope creep disguised as "I need this to test properly"

- **Prevention**:
  - First playable milestone: Two characters, one activity type, visible behavior differences. That's it.
  - Timebox: If you can't see color-driven behavior differences in 2-3 days of work, the system design needs revision, not more features.
  - Test the thesis with "programmer art" (cubes and text) before any visual polish.
  - Apply the "one mechanic" rule: Focus on one thing. If it's not fun alone, more features won't save it.

- **Recovery**: Stop building. Create the minimal test case: Elling (Blue/Green) and Mother (White/Green) doing one activity. Can a player watching distinguish their behavior patterns? If no, iterate on the color system before adding anything else.

- **Phase relevance**: This is THE Phase 1 gate. Do not proceed to Phase 2 until a player can distinguish characters by watching behavior.

### 3. Opaque Systems = No Learning

- **The trap**: Hidden stats are intended as "discoverable" but become "unknowable." The GDD Evaluation already flags this: "What is the information hierarchy? With 50+ hidden stats: What does the player see at a glance?"

- **Warning signs**:
  - Player behavior is random because they have no feedback
  - Players can't form theories about characters (no "I think Elling prefers...")
  - "Correct" play requires external documentation or wikis
  - Players blame randomness instead of recognizing patterns

- **Prevention**:
  - **Feedback before mystery**: Show behavioral output clearly (text, animation, numbers) before hiding the inputs. The player must see *that* something happened before wondering *why*.
  - Characters should "telegraph" their color through repeated behavior patterns, not single actions.
  - Apply the transparency principle: Players can form coherent plans only if mechanics are observable. Hidden stats are fine; hidden *consequences* are not.
  - For this prototype: Every color-driven behavior should produce text ("Elling hesitates..." vs "Mother starts immediately...").

- **Recovery**: If players are confused, add more output visibility before reducing system complexity. Often the system is fine but the feedback is insufficient.

- **Phase relevance**: Phase 2 (feedback/juice) must ensure outputs are visible before Phase 3 adds more behavioral complexity.

### 4. Fun-Last Development

- **The trap**: Building systems that are "correct" but not enjoyable to watch. The user's stated goal is "arcade feel, not simulation"—but arcade feel requires *active design for fun*, not just simpler systems.

- **Warning signs**:
  - Characters behave "realistically" but boringly
  - Activities resolve without any satisfying feedback
  - The player doesn't feel their interventions matter
  - Watching the simulation feels like watching a spreadsheet update

- **Prevention**:
  - **Juice every output**: Numbers appearing, character expressions, color flashes, satisfying sounds (even imagined sounds during prototype). The GDD Evaluation specifically calls out missing "juice."
  - Make behaviors *exaggerated*: "NBA Street vs NBA2K" means characters should overreact, have visible quirks, be fun to watch. A Blue character shouldn't just "prefer reading"—they should ignore everything else in comic fashion.
  - Test with the question: "Is this fun to watch if you do nothing?"
  - Apply the arcade design principle: exaggerated physics, simplified mechanics, instant gratification.

- **Recovery**: If the prototype is "working but boring," add feedback effects before changing behavior logic. Often the logic is fine but the presentation is dry.

- **Phase relevance**: Should be considered from Phase 1, but Phase 2 (juice/feedback) is the dedicated phase to address this.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or require significant iteration.

### 5. Feature Creep Disguised as Testing

- **The trap**: Adding features "to test properly" that aren't actually required for the core thesis. The scope document lists many systems: shadow state, overskudd, quests, crisis sequence, skill training, discoverable personality. Not all are needed to test "colors = distinct characters."

- **Warning signs**:
  - Adding systems to make the prototype "complete" rather than to answer specific questions
  - Building the skill training system before knowing if characters are interesting to train
  - Implementing day/night cycles, time progression, or environmental details before core behavior works
  - Scope growing week over week

- **Prevention**:
  - Use the MoSCoW method:
    - **Must have** (Phase 1): Color-driven activity preference, visible behavior output, two distinct characters
    - **Should have** (Phase 2): Overskudd gating, player intervention, feedback/juice
    - **Could have** (Phase 3): Shadow state, quests, crisis
    - **Won't have** (this prototype): Conversation system, multiple patients, skill trees
  - Before adding any feature, ask: "Does this help answer the thesis question?"

- **Recovery**: List every system being built. For each, state what thesis question it answers. Delete or defer anything that doesn't directly answer "do colors create distinct characters?"

- **Phase relevance**: Every phase. The scope boundary must be defended continuously.

### 6. Premature Architecture

- **The trap**: Building systems for the "real game" (Unreal) instead of for the prototype question. This is explicitly a "testbed before Unreal"—the goal is learning, not reusable code.

- **Warning signs**:
  - Spending time on code architecture instead of behavior iteration
  - Making systems "extensible" for future needs
  - Avoiding shortcuts that would speed up validation
  - Discussions about "how this will work in Unreal"

- **Prevention**:
  - Embrace "throwaway" code: This prototype's job is to answer questions, not to be ported.
  - Hardcode anything that can be hardcoded. Two characters? No character creation system needed.
  - Prefer readability over abstraction. Color formulas should be understandable at a glance.
  - Architecture is a premature optimization for a prototype.

- **Recovery**: When you find yourself building "infrastructure," stop and ask what question you're trying to answer. Build the minimal thing that answers the question.

- **Phase relevance**: All phases. Resist Unreal-thinking until the thesis is validated.

### 7. Testing in Isolation

- **The trap**: Testing systems separately (color affinity math, refusal patterns, mood expressions) without testing the combined player experience.

- **Warning signs**:
  - "Each system works in unit tests" but the combined experience is confusing
  - Building all systems before any integration
  - No playtest sessions where you watch the characters interact

- **Prevention**:
  - Integrate early: Get two characters doing one activity together within the first development session.
  - Playtest weekly (even if just yourself): Watch characters for 5 minutes without intervening. Are they interesting? Distinct? Readable?
  - Don't trust calculations—trust observations.

- **Recovery**: If systems are built but not integrated, stop adding and start combining. Integration often reveals the real design problems.

- **Phase relevance**: Phase 1 should end with an integrated playtest, not isolated system tests.

---

## Minor Pitfalls

Annoyances that are fixable but waste time if not anticipated.

### 8. Analysis Paralysis on Color Values

- **The trap**: Spending excessive time tuning exact color values (should Elling be 0.8 Blue or 0.75 Blue?) when the prototype hasn't proven colors matter at all.

- **Warning signs**:
  - Debating exact numbers before seeing behavior
  - Creating spreadsheets for character configurations before the first playtest
  - Adjusting thresholds without player observation

- **Prevention**:
  - Start with exaggerated values (Elling = 1.0 Blue, 0.0 everything else) to make differences obvious.
  - Tune toward subtlety only after obvious differences work.
  - Values are cheap to change; architecture is expensive to change.

- **Recovery**: If stuck on numbers, make them extreme and observe. You'll learn more from watching than calculating.

- **Phase relevance**: Phase 1 should use extreme values. Phase 3 or later can tune.

### 9. Designing for Edge Cases First

- **The trap**: Building systems to handle unusual situations before the common case works well.

- **Warning signs**:
  - Discussing what happens when all colors are equal before distinct colors work
  - Building shadow state before normal state is interesting
  - Handling refusal edge cases before basic activity acceptance

- **Prevention**:
  - Ignore edge cases for Phase 1. If 80% of cases work well, that's enough to validate the thesis.
  - Document edge cases for later, don't implement them now.

- **Recovery**: When you find yourself handling rare cases, defer them to a "later" list and return to the main path.

- **Phase relevance**: All phases, but especially Phase 1.

### 10. Perfectionism Before Feedback

- **The trap**: Delaying playtests because the prototype "isn't ready."

- **Warning signs**:
  - Hesitating to show work-in-progress
  - Adding polish before core validation
  - Saying "I'll test it when X is done"

- **Prevention**:
  - Schedule regular playtests on a calendar, not based on completion.
  - The purpose is learning, not impressing. Ugly prototypes teach more.
  - A prototype that's "not ready" may reveal that the whole approach needs changing.

- **Recovery**: Show it today. Whatever state it's in. Feedback on broken prototypes is still valuable.

- **Phase relevance**: Every phase. Regular playtests are non-negotiable.

---

## Prototype-Specific Risks

Unique to the "testbed before Unreal" context.

### Risk: Prototype Scope Becomes Game Scope

- **The trap**: The prototype answers "yes, colors work" and then transforms into the full game development, abandoning the Unreal plan.
- **Mitigation**: Define clear prototype end criteria before starting. When those criteria are met, the prototype is DONE. Write findings and move to Unreal.
- **Phase relevance**: Define end criteria in Phase 1.

### Risk: Web Tech Limitations Bias Results

- **The trap**: Behaviors that seem uninteresting in web prototype might be compelling with full animation, sound, and visual polish in Unreal.
- **Mitigation**: Evaluate the *concept* ("Blue characters prefer solitary activities"), not the *implementation* ("text that says 'Elling reads'"). Be generous about what good implementation could do.
- **Phase relevance**: All evaluation should consider "would this be interesting with full production?"

### Risk: False Negative on Core Thesis

- **The trap**: Concluding "colors don't work" when actually the implementation was flawed, feedback was insufficient, or values weren't tuned.
- **Mitigation**: Before concluding "it doesn't work," iterate on implementation at least 3 times. Check: Are colors exaggerated enough? Is feedback visible enough? Are players given enough observation time?
- **Phase relevance**: Phase 1 should iterate on the core before moving to Phase 2.

### Risk: False Positive on Core Thesis

- **The trap**: Concluding "colors work" because you (the designer) can see the patterns, but external players cannot.
- **Mitigation**: Get at least one external playtest where you watch silently. Don't explain. See if they form theories about characters.
- **Phase relevance**: Before exiting Phase 2, get external eyes.

---

## The Over-Engineering Trap

**Specific guidance for the user's stated tendency: "My tendency is to create an overcomplicated system that focuses too much on realistically simulating real humans."**

### Why This Tendency Exists

Over-engineering often comes from:
1. **Intellectual satisfaction**: Building elegant systems is more fun than testing if players care
2. **Fear of simplicity**: Worry that simple systems produce shallow experiences
3. **Delayed validation**: Avoiding the moment of truth when the system is tested with real users

### The Counter-Model: RimWorld

RimWorld's Tynan Sylvester explicitly designed his character system to be *observable and comprehensible*, not deeply realistic. Traits are simple (1-3 per character), effects are visible, and players can predict behavior. The depth comes from *combinations and situations*, not from individual character complexity.

### Concrete Guardrails for This Project

1. **The 2-Color Rule**: Each character starts with 2 colors only (dominant + secondary). Add a third only if 2 is proven insufficient. Never implement all 5 for Phase 1.

2. **The Observable Behavior Test**: Before implementing any internal calculation, write down what the player will *see*. If you can't describe the observable output, don't implement the input.

3. **The Removal Test**: After implementing a feature, ask "If I removed this, would the prototype still answer the thesis question?" If yes, consider removing it.

4. **The Arcade Smell Test**: Would NBA Street implement this? If a system requires explanation, it's not arcade. Arcade systems are immediately legible.

5. **The 10-Minute Rule**: If you spend more than 10 minutes designing a system without implementing observable behavior, stop designing and start building something testable.

6. **The Complexity Budget**: Allow yourself 3 "complex" systems total. Everything else must be simple. Currently suggested: (1) Color-to-activity preference, (2) Overskudd gating, (3) Shadow state flip. That's the budget. No more complex systems.

### What "Arcade Feel" Actually Means

| Simulation (avoid) | Arcade (target) |
|-------------------|-----------------|
| Gradual mood changes | Visible mood states with clear transitions |
| Realistic decision weights | Exaggerated preferences ("Elling ONLY wants to read") |
| Complex refusal conditions | Simple binary: willing or refusing |
| Hidden stat interactions | Observable behavior patterns |
| Emergent complexity | Designed "characters" that feel consistent |
| Realistic time scales | Compressed/satisfying time (lots happens per "day") |

### The Mantra

**"If a player can't see it, don't simulate it."**

This project's success depends on *readable* characters, not *realistic* ones. A character that players can predict ("Elling will definitely choose reading") is more valuable than one that's realistically complex but opaque.

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| Phase 1 (Core) | Simulation Fidelity Trap, Delayed Validation | Timebox to 1 week. Must produce observable color-driven behavior. |
| Phase 2 (Feedback) | Fun-Last Development, Over-polishing | Juice must serve readability. Exaggerate, don't just prettify. |
| Phase 3 (Expansion) | Feature Creep, Premature Architecture | Every addition must answer a new question. Resist "completeness." |
| Evaluation | False Negative/Positive | External playtest required before conclusions. |

---

## Summary: The Three Questions

Before any development decision, ask:

1. **"Does this help answer whether colors create distinct characters?"** (thesis relevance)
2. **"Will the player see the result?"** (observability)
3. **"Is this arcade or simulation?"** (philosophy check)

If the answer to any of these is unclear, stop and reconsider before building.

---

## Sources

### Game Design Literature
- [The Complexity Fallacy](https://www.gamedeveloper.com/design/the-complexity-fallacy) - Gamasutra article on why complexity doesn't equal depth
- [Game Design Principle: Transparency](https://www.gamedeveloper.com/design/game-design-principle-transparency) - On making mechanics observable
- [How RimWorld fleshes out the Dwarf Fortress formula](https://www.gamedeveloper.com/design/how-i-rimworld-i-fleshes-out-the-i-dwarf-fortress-i-formula) - Tynan Sylvester on comprehensible simulation
- [Scope Creep in Indie Games](https://www.wayline.io/blog/scope-creep-indie-games-avoiding-development-hell) - Statistics on scope-related failures

### Prototyping Best Practices
- [5 Common Game Prototyping Mistakes](https://www.gs-studio.eu/blog/game-prototyping-5-common-mistakes-game-developers-make-and-how-to-avoid-them) - On testing one thing at a time
- [Game Prototyping: How to Test Ideas Before You Build](https://tonogameconsultants.com/prototyping/) - On minimal prototypes
- [How to Avoid Scope Creep in Game Development](https://www.codecks.io/blog/2025/how-to-avoid-scope-creep-in-game-development/) - MoSCoW method for games

### Arcade vs Simulation Philosophy
- [Arcade vs Simulation - What does it all really mean?](https://simtorque.wordpress.com/2013/01/22/arcade-vs-simulation-what-does-it-all-really-mean/) - Design philosophy
- [How Arcade Game Design Still Shapes Interactive Entertainment](https://game-ace.com/blog/arcade-game-design/) - Arcade constraints as features

### Project-Specific Context
- GDD Evaluation & Open Questions (project file) - Identified gaps in experiential definition
- Hidden Color System document (project file) - Current system complexity to watch for

---
*Researched: 2026-01-27*
*Confidence: HIGH - Based on established game design literature, verified with project context*
