# Requirements: Before the Fall

**Defined:** 2026-01-27
**Core Value:** Validate that MTG colors + minimal config create distinct, interesting character behavior

## v1 Requirements

Requirements for initial prototype. Each maps to roadmap phases.

### Character System

- [ ] **CHAR-01**: Each character has 2 MTG colors with intensity values (0.0-1.0)
- [ ] **CHAR-02**: Characters act autonomously based on color preferences
- [ ] **CHAR-03**: Color profile determines activity affinity (Blue prefers reading)
- [ ] **CHAR-04**: Shadow state flips behavior when color health drops (Blue -> paralysis)
- [ ] **CHAR-05**: Overskudd (capacity) meter gates what characters can/will do
- [ ] **CHAR-06**: Needs (energy, etc.) affect overskudd regeneration
- [ ] **CHAR-07**: Characters with low overskudd refuse activities or retreat to comfort

### Activity System

- [ ] **ACT-01**: 6-8 activities available (reading, cooking, cleaning, etc.)
- [ ] **ACT-02**: Activities have color affinities that affect character preference
- [ ] **ACT-03**: Activities produce resources (creativity, food, cleanliness)
- [ ] **ACT-04**: Skills improve through activity repetition
- [ ] **ACT-05**: Skill level affects activity success/output
- [ ] **ACT-06**: Characters refuse activities with personality-flavored responses
- [ ] **ACT-07**: Low-skill attempts can fail or produce reduced output

### Time & Progression

- [ ] **TIME-01**: Day/time progression with ~10 in-game days
- [ ] **TIME-02**: Consistent game loop tick rate
- [ ] **TIME-03**: Player can pause/play time
- [ ] **TIME-04**: Visual day counter and time indicator

### Quest System

- [ ] **QUEST-01**: Simple objectives tracking ("Produce 300 creativity")
- [ ] **QUEST-02**: Quest completion triggers next quest
- [ ] **QUEST-03**: Visual quest panel showing active objectives
- [ ] **QUEST-04**: Progress indicators for resource-gathering quests

### Crisis Sequence

- [ ] **CRISIS-01**: Day 10 crisis trigger (Mother collapses)
- [ ] **CRISIS-02**: Player can attempt actions during crisis
- [ ] **CRISIS-03**: Phone skill determines emergency call success
- [ ] **CRISIS-04**: Elling's behavior reflects skill limitations during crisis

### Interaction & UI

- [ ] **UI-01**: Player can click characters to view stats/skills
- [ ] **UI-02**: Player can assign activities to characters (intervention)
- [ ] **UI-03**: Visual feedback when activities complete
- [ ] **UI-04**: Character state visible (overskudd meter, current activity)

## v2 Requirements

Deferred to future iteration. Tracked but not in current roadmap.

### Visual Feedback ("Juice")

- **JUICE-01**: Resource numbers fly out when activities complete
- **JUICE-02**: Sound effects for activity completion
- **JUICE-03**: Character expressions/animations for emotional states
- **JUICE-04**: Screen effects for dramatic moments (crisis)

### Endings & Polish

- **END-01**: Two endings (Mother saved vs Mother lost)
- **END-02**: Ending text cards explaining outcome
- **END-03**: "Hidden save path" for players who trained phone skill

### Discoverable Systems

- **DISC-01**: Stats hidden initially, revealed through observation
- **DISC-02**: Diagnosis mechanic to reveal character stats
- **DISC-03**: Thought bubbles showing character intentions

### Advanced Behavior

- **BEHAV-01**: Time-of-day affects activity preferences
- **BEHAV-02**: Characters interact with each other's activities

## Out of Scope

| Feature | Reason |
|---------|--------|
| Conversation system | Focus on activity loop first; add social layer later |
| Multiple patients | 2-character demo only |
| Facility building | Single fixed environment |
| Meta-progression | No roguelike layer for prototype |
| Realistic simulation | Arcade feel over accuracy |
| Full skill tree | Only skills needed for demo |
| Audio system | Visual feedback first |
| Save/load | Prototype testing only |
| Character creation | Fixed characters (Elling, Mother) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CHAR-01 | Phase 1 | Pending |
| CHAR-02 | Phase 2 | Pending |
| CHAR-03 | Phase 2 | Pending |
| CHAR-04 | Phase 5 | Pending |
| CHAR-05 | Phase 1 | Pending |
| CHAR-06 | Phase 1 | Pending |
| CHAR-07 | Phase 2 | Pending |
| ACT-01 | Phase 2 | Pending |
| ACT-02 | Phase 2 | Pending |
| ACT-03 | Phase 3 | Pending |
| ACT-04 | Phase 3 | Pending |
| ACT-05 | Phase 3 | Pending |
| ACT-06 | Phase 3 | Pending |
| ACT-07 | Phase 3 | Pending |
| TIME-01 | Phase 1 | Pending |
| TIME-02 | Phase 1 | Pending |
| TIME-03 | Phase 1 | Pending |
| TIME-04 | Phase 1 | Pending |
| QUEST-01 | Phase 4 | Pending |
| QUEST-02 | Phase 4 | Pending |
| QUEST-03 | Phase 4 | Pending |
| QUEST-04 | Phase 4 | Pending |
| CRISIS-01 | Phase 5 | Pending |
| CRISIS-02 | Phase 5 | Pending |
| CRISIS-03 | Phase 5 | Pending |
| CRISIS-04 | Phase 5 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |
| UI-04 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-01-27*
*Last updated: 2026-01-27 after roadmap creation*
