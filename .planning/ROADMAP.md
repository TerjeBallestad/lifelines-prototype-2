# Roadmap: Before the Fall

**Created:** 2026-01-27
**Depth:** Standard
**Phases:** 5
**Requirements:** 24

## Phase Overview

| # | Name | Goal | Requirements | Success Criteria |
|---|------|------|--------------|------------------|
| 1 | Foundation | Game loop and character state run and are observable | TIME-01, TIME-02, TIME-03, TIME-04, CHAR-01, CHAR-05, CHAR-06, UI-01, UI-04 | 4 |
| 2 | Autonomous Behavior | Characters act on their own based on personality | CHAR-02, CHAR-03, CHAR-07, ACT-01, ACT-02 | 4 |
| 3 | Activity Loop | Activities produce resources and train skills | ACT-03, ACT-04, ACT-05, ACT-06, ACT-07, UI-02, UI-03 | 5 |
| 4 | Quest System | Player has direction through objectives | QUEST-01, QUEST-02, QUEST-03, QUEST-04 | 3 |
| 5 | Crisis Sequence | Day 10 crisis reveals skill gap consequences | CHAR-04, CRISIS-01, CRISIS-02, CRISIS-03, CRISIS-04 | 4 |

## Phase Details

### Phase 1: Foundation

**Goal:** Game loop and character state run and are observable

**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffolding, types, MobX stores
- [x] 01-02-PLAN.md — Game loop and time display
- [x] 01-03-PLAN.md — Character UI and visual verification

**Requirements:**
- TIME-01: Day/time progression with ~10 in-game days
- TIME-02: Consistent game loop tick rate
- TIME-03: Player can pause/play time
- TIME-04: Visual day counter and time indicator
- CHAR-01: Each character has 2 MTG colors with intensity values (0.0-1.0)
- CHAR-05: Overskudd (capacity) meter gates what characters can/will do
- CHAR-06: Needs (energy, etc.) affect overskudd regeneration
- UI-01: Player can click characters to view stats/skills
- UI-04: Character state visible (overskudd meter, current activity)

**Success Criteria:**
1. Player sees time advancing (day counter increments, hour/minute progress visible)
2. Player can pause and resume time, and game state stops/resumes accordingly
3. Player clicks a character and sees their MTG color profile (Blue 0.8, Green 0.4)
4. Overskudd meter visibly changes as needs decay over time

**Dependencies:** None (foundation phase)

**Research notes:** Timebox to 1 week. Use exaggerated color values (Elling = 1.0 Blue, not 0.75) to make differences obvious. Every character state must have visible UI representation.

---

### Phase 2: Autonomous Behavior

**Goal:** Characters act on their own based on personality

**Plans:** 3 plans

Plans:
- [x] 02-01-PLAN.md — Activity types, data definitions, Utility AI scoring
- [x] 02-02-PLAN.md — Character state machine and autonomous decision-making
- [x] 02-03-PLAN.md — UI components, movement animation, visual verification

**Requirements:**
- CHAR-02: Characters act autonomously based on color preferences
- CHAR-03: Color profile determines activity affinity (Blue prefers reading)
- CHAR-07: Characters with low overskudd refuse activities or retreat to comfort
- ACT-01: 6-8 activities available (reading, cooking, cleaning, etc.)
- ACT-02: Activities have color affinities that affect character preference

**Success Criteria:**
1. Without player input, Elling gravitates toward Blue-aligned activities (reading, thinking)
2. Without player input, Mother gravitates toward White/Green-aligned activities (cooking, cleaning)
3. When overskudd is low, characters refuse new activities and seek comfort behaviors
4. Player can watch for 5 minutes and articulate which activities each character prefers

**Dependencies:** Phase 1 (time loop running, character state exists, overskudd tracking)

**Research notes:** This phase validates the core thesis. Gate criteria: Can a player watch for 5 minutes and say "Elling prefers X, Mother prefers Y"? Color affinity formula needs design during planning.

---

### Phase 3: Activity Loop

**Goal:** Activities produce resources and train skills

**Plans:** 5 plans

Plans:
- [ ] 03-01-PLAN.md — Types, skills store, resource store (foundation)
- [ ] 03-02-PLAN.md — Character skills integration, success/failure logic
- [ ] 03-03-PLAN.md — Floating number feedback, resource bar UI
- [ ] 03-04-PLAN.md — Player intervention modal, refusal messaging
- [ ] 03-05-PLAN.md — Skill progress display, level-up celebration

**Requirements:**
- ACT-03: Activities produce resources (creativity, food, cleanliness)
- ACT-04: Skills improve through activity repetition
- ACT-05: Skill level affects activity success/output
- ACT-06: Characters refuse activities with personality-flavored responses
- ACT-07: Low-skill attempts can fail or produce reduced output
- UI-02: Player can assign activities to characters (intervention)
- UI-03: Visual feedback when activities complete

**Success Criteria:**
1. Completing an activity shows visible resource output (creativity +10 appears on screen)
2. Repeated activities increase skill level, and higher skill produces more output
3. Player can force Elling to cook (intervention), and he resists with personality-appropriate response
4. Low-skill activity attempts visibly fail or produce less than skilled attempts
5. Activity completion feels satisfying (animation, feedback, clear outcome)

**Dependencies:** Phase 2 (autonomous behavior, activities exist, color preferences work)

**Research notes:** This is where "juice" matters. Apply arcade philosophy - exaggerated feedback, floating numbers, satisfying completion sounds/animations. Test with "Is this fun to watch if you do nothing?"

---

### Phase 4: Quest System

**Goal:** Player has direction through objectives

**Requirements:**
- QUEST-01: Simple objectives tracking ("Produce 300 creativity")
- QUEST-02: Quest completion triggers next quest
- QUEST-03: Visual quest panel showing active objectives
- QUEST-04: Progress indicators for resource-gathering quests

**Success Criteria:**
1. Quest panel shows current objective with clear description
2. Progress bar or counter shows how close player is to completing current quest
3. Completing a quest triggers the next quest without player needing to do anything

**Dependencies:** Phase 3 (resource production tracked, activities complete successfully)

**Research notes:** 3-4 simple quests maximum. Quests teach mechanics implicitly (first quest: "morning routine", then "produce 50 creativity", then "train phone skill").

---

### Phase 5: Crisis Sequence

**Goal:** Day 10 crisis reveals skill gap consequences

**Requirements:**
- CHAR-04: Shadow state flips behavior when color health drops (Blue -> paralysis)
- CRISIS-01: Day 10 crisis trigger (Mother collapses)
- CRISIS-02: Player can attempt actions during crisis
- CRISIS-03: Phone skill determines emergency call success
- CRISIS-04: Elling's behavior reflects skill limitations during crisis

**Success Criteria:**
1. On day 10, Mother collapses and crisis UI appears
2. Player can direct Elling to attempt actions (call emergency, help Mother)
3. If phone skill is low, Elling fails to call successfully (visible failure, anxiety behavior)
4. Crisis outcome reflects whether player trained the right skills during days 1-9

**Dependencies:** Phase 4 (quests have guided skill training, time reaches day 10, skills tracked)

**Research notes:** This phase integration-tests all prior systems. Shadow state (CHAR-04) is placed here because it matters most during crisis - Blue shadow = analysis paralysis when Elling needs to act. Two endings possible: Mother saved (phone skill 2+) vs Mother lost (phone skill 0-1).

---

## Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1 - Foundation | Complete | 100% |
| 2 - Autonomous Behavior | Complete | 100% |
| 3 - Activity Loop | Planned | 0% |
| 4 - Quest System | Pending | 0% |
| 5 - Crisis Sequence | Pending | 0% |

---
*Roadmap created: 2026-01-27*
*Phase 1 completed: 2026-01-27*
*Phase 2 completed: 2026-01-27*
