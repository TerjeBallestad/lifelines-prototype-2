# Architecture Research

**Project:** Before the Fall
**Domain:** Character-driven life-sim prototype
**Stack:** React 19 + MobX + Vite + Tailwind/DaisyUI + TypeScript
**Researched:** 2026-01-27
**Confidence:** HIGH (based on reference project + official MobX patterns + design docs)

---

## System Overview

```
                            ┌─────────────────┐
                            │   GameStore     │
                            │   (Root Store)  │
                            └────────┬────────┘
                                     │
         ┌───────────────┬───────────┼───────────┬─────────────────┐
         │               │           │           │                 │
         ▼               ▼           ▼           ▼                 ▼
    ┌─────────┐    ┌──────────┐ ┌─────────┐ ┌─────────┐    ┌─────────────┐
    │  Time   │    │Character │ │Activity │ │  Quest  │    │  Crisis     │
    │ Store   │    │  Store   │ │  Store  │ │  Store  │    │  Store      │
    └────┬────┘    └────┬─────┘ └────┬────┘ └────┬────┘    └──────┬──────┘
         │              │            │           │                │
         │              ▼            │           │                │
         │      ┌───────────────┐    │           │                │
         │      │   Character   │◄───┘           │                │
         │      │   Instances   │                │                │
         │      │  (Elling,     │                │                │
         │      │   Mother)     │                │                │
         │      └───────┬───────┘                │                │
         │              │                        │                │
         └──────────────┼────────────────────────┘                │
                        │                                         │
                        ▼                                         │
                ┌───────────────┐                                 │
                │    Needs/     │◄────────────────────────────────┘
                │  Overskudd    │
                │   (derived)   │
                └───────────────┘

Data Flow Direction: Time drives updates → Characters respond → UI observes
```

**Key Principle:** Unidirectional data flow with MobX observables. Time ticks drive state updates. Components observe and react.

---

## Core Systems

### 1. Time System

**Purpose:** Central clock that drives the game loop. All other systems respond to time progression.

**Owns:**
- Current day (1-10)
- Current hour (0-23)
- Current minute (0-59)
- Time scale (real seconds per game hour)
- Pause state
- Time of day (morning/afternoon/evening/night)

**Depends on:** Nothing (root of data flow)

**Exposes:**
- `tick(deltaTime)` action for game loop
- `currentDay`, `currentHour` observables
- `timeOfDay` computed
- `isPaused` observable

**Implementation Pattern (from mental-sine-waves):**
```typescript
class TimeStore {
  day = 1;
  hour = 7;
  minute = 0;
  isPaused = false;

  constructor(private root: GameStore) {
    makeAutoObservable(this);
  }

  get timeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (this.hour < 12) return 'morning';
    if (this.hour < 17) return 'afternoon';
    if (this.hour < 21) return 'evening';
    return 'night';
  }

  tick(deltaHours: number) {
    if (this.isPaused) return;
    this.minute += deltaHours * 60;
    while (this.minute >= 60) {
      this.minute -= 60;
      this.hour++;
    }
    while (this.hour >= 24) {
      this.hour -= 24;
      this.day++;
    }
  }
}
```

**Build Order Implication:** Build FIRST. Everything else depends on time.

---

### 2. Character System

**Purpose:** Represents characters with MTG colors, skills, needs, and behavioral state.

**Owns:**
- Character identity (name, id)
- MTG color profile (intensities + health)
- Skills dictionary (name -> level 0-5)
- Needs (energy, social, purpose)
- Overskudd (derived from needs + color health)
- Current state (idle, performing, conversing, crisis, hidden)
- Current activity reference
- Shadow state flag

**Depends on:**
- Time (for need decay)
- Activity definitions (for current activity)

**Exposes:**
- `overskudd` computed (core gameplay value)
- `isInShadow` computed (color health < threshold)
- `doActivity(activity)` action
- `updateNeeds(deltaHours)` action
- `getSkillLevel(skill)` method
- `canDoActivity(activity)` computed

**Implementation Pattern:**
```typescript
class Character {
  id: string;
  name: string;
  colors: ColorProfile;
  skills: Map<SkillId, number> = new Map();
  needs: Needs = { energy: 80, social: 50, purpose: 50 };
  state: CharacterState = 'idle';
  currentActivityId: string | null = null;

  constructor(data: CharacterData, private characterStore: CharacterStore) {
    makeAutoObservable(this);
    Object.assign(this, data);
  }

  get overskudd(): number {
    const base = (this.needs.energy + this.needs.social + this.needs.purpose) / 3;
    const avgColorHealth = this.calculateAvgColorHealth();
    return Math.min(100, Math.max(0, base * (0.8 + avgColorHealth * 0.4)));
  }

  get isInShadow(): boolean {
    return this.colors.primary.health < 0.3;
  }
}
```

**Build Order Implication:** Build SECOND. Needs Time for decay, but Activity needs Character.

---

### 3. Activity System

**Purpose:** Defines what characters can do, calculates outcomes, tracks progress.

**Owns:**
- Activity definitions (static data)
- Activity instances (when in progress)
- Duration tracking
- Outcome calculation logic

**Depends on:**
- Character (skills, color affinity for outcome calculation)
- Time (for activity duration)

**Exposes:**
- `availableActivities(character)` computed
- `startActivity(character, activityId)` action
- `completeActivity(character)` action
- `calculateOutcome(character, activity)` method

**Key Activities for Demo:**
```typescript
const activities: Activity[] = [
  {
    id: 'read_book',
    name: 'Read Book',
    colorAffinities: { blue: 0.8 },
    baseDuration: 1, // hours
    effects: {
      needs: { energy: -5, purpose: +10 },
      skillGain: { reading: 0.1 },
    },
    requiredSkill: null,
  },
  {
    id: 'cook_meal',
    name: 'Cook Meal',
    colorAffinities: { green: 0.6, white: 0.4 },
    baseDuration: 1,
    effects: {
      needs: { energy: -10 },
      resourceOutput: { type: 'food', amount: 1 },
    },
    requiredSkill: { skill: 'cooking', minLevel: 1 },
  },
  {
    id: 'practice_phone',
    name: 'Practice Phone Calls',
    colorAffinities: {}, // No affinity - uncomfortable for Elling
    baseDuration: 0.5,
    effects: {
      needs: { energy: -15, social: -5 },
      skillGain: { phoneUse: 0.2 },
    },
    requiredSkill: null,
  },
  // ... more activities
];
```

**Build Order Implication:** Build THIRD. Core gameplay loop lives here.

---

### 4. Quest System

**Purpose:** Provides player direction through objectives. Tracks completion.

**Owns:**
- Quest definitions
- Quest status (locked/active/completed/failed)
- Objective progress tracking
- Unlock conditions

**Depends on:**
- Time (day-based unlocks)
- Character (skill checks, activity completion)
- Activity (resource production tracking)

**Exposes:**
- `activeQuests` computed
- `checkObjective(questId, objectiveId)` action
- `completeQuest(questId)` action
- `unlockQuest(questId)` action

**Demo Quests:**
```typescript
const quests: Quest[] = [
  {
    id: 'morning_routine',
    title: 'Morning Routine',
    unlockCondition: { type: 'immediate' },
    objectives: [
      { type: 'activity_complete', activityId: 'eat_breakfast', count: 1 }
    ],
  },
  {
    id: 'small_creativity',
    title: 'Small Steps',
    unlockCondition: { type: 'day', day: 2 },
    objectives: [
      { type: 'resource_total', resource: 'creativity', amount: 50 }
    ],
  },
  // ... more quests
];
```

**Build Order Implication:** Build FOURTH. Adds direction but game works without it.

---

### 5. Crisis System

**Purpose:** Day 10 emergency sequence. State machine for the climax.

**Owns:**
- Crisis phase (none/trigger/active/emergency_called/ambulance_arrived/aftermath)
- Time in phase
- Phone attempt tracking
- Mother saved flag
- Elling panic state

**Depends on:**
- Time (triggers on day 10)
- Character (Elling's skills determine outcome)

**Exposes:**
- `triggerCrisis()` action
- `attemptPhoneCall(character)` action
- `advancePhase()` action
- `phase` observable
- `outcome` computed

**Crisis State Machine:**
```
none ──[day 10]──► trigger ──[2 min]──► active
                                           │
                    ┌──────────────────────┤
                    │                      │
                    ▼                      ▼
            emergency_called         [timeout]
                    │                      │
                    ▼                      ▼
            ambulance_arrived        aftermath
                    │               (mother_lost)
                    ▼
               aftermath
            (mother_saved)
```

**Build Order Implication:** Build FIFTH. Requires all other systems to be functional.

---

### 6. Interaction System

**Purpose:** Handles player input, click targets, UI feedback, juicy responses.

**Owns:**
- Selected character
- Hover state
- Context menu state
- Recent actions (for feedback)
- Animation triggers

**Depends on:**
- All other systems (routes player actions to appropriate system)

**Exposes:**
- `selectCharacter(id)` action
- `showContextMenu(target, position)` action
- `executeAction(action)` action
- `selectedCharacter` observable
- `feedbackQueue` observable (for juice/animations)

**Build Order Implication:** Build LAST (UI layer). But build incrementally alongside other systems for testing.

---

## Data Flow

### Primary Loop (Every Tick)

```
1. Game Loop calls TimeStore.tick(deltaTime)
       │
       ▼
2. TimeStore updates day/hour/minute
       │
       ▼
3. CharacterStore.updateAllCharacters(deltaTime)
   - Decay needs based on time
   - Recalculate overskudd (MobX computed, automatic)
   - Check for shadow state transitions
       │
       ▼
4. ActivityStore.updateActivities(deltaTime)
   - Progress ongoing activities
   - Complete activities when duration reached
   - Apply effects to characters
       │
       ▼
5. QuestStore.checkAllObjectives()
   - MobX reactions auto-trigger on relevant changes
       │
       ▼
6. CrisisStore.checkTriggers()
   - Day 10? Trigger crisis
   - In crisis? Advance state machine
       │
       ▼
7. React components auto-update via MobX observer
```

### Player Action Flow

```
Player Click ──► InteractionStore.executeAction()
                        │
                        ├──► "Start Activity"
                        │         │
                        │         ▼
                        │    ActivityStore.startActivity(character, activityId)
                        │         │
                        │         ▼
                        │    Character.state = 'performing'
                        │    Character.currentActivityId = activityId
                        │
                        ├──► "Select Character"
                        │         │
                        │         ▼
                        │    InteractionStore.selectedCharacter = character
                        │
                        └──► "Call Emergency"
                                  │
                                  ▼
                             CrisisStore.attemptPhoneCall(elling)
```

---

## MobX Store Structure

### Recommended: Root Store Pattern

Based on MobX official documentation and the mental-sine-waves reference project.

```typescript
// src/stores/RootStore.ts
export class RootStore {
  timeStore: TimeStore;
  characterStore: CharacterStore;
  activityStore: ActivityStore;
  questStore: QuestStore;
  crisisStore: CrisisStore;
  interactionStore: InteractionStore;

  constructor() {
    this.timeStore = new TimeStore(this);
    this.characterStore = new CharacterStore(this);
    this.activityStore = new ActivityStore(this);
    this.questStore = new QuestStore(this);
    this.crisisStore = new CrisisStore(this);
    this.interactionStore = new InteractionStore(this);
  }

  // Main game loop - called from useEffect in Game component
  tick(deltaTime: number) {
    this.timeStore.tick(deltaTime);
    this.characterStore.updateAll(deltaTime);
    this.activityStore.updateAll(deltaTime);
    this.crisisStore.update(deltaTime);
  }
}

// Singleton instance (matches mental-sine-waves pattern)
const rootStore = new RootStore();

export const useGameStore = () => rootStore;
export const getGameStore = () => rootStore;
```

### Store-to-Store Communication

Stores access each other through root store reference:

```typescript
class CharacterStore {
  characters: Map<string, Character> = new Map();

  constructor(private root: RootStore) {
    makeAutoObservable(this);
    this.initializeCharacters();
  }

  updateAll(deltaHours: number) {
    // Access time from sibling store
    const timeOfDay = this.root.timeStore.timeOfDay;

    for (const character of this.characters.values()) {
      character.updateNeeds(deltaHours, timeOfDay);
    }
  }
}
```

### Computed Values Strategy

Use MobX `computed` liberally - they're memoized and efficient:

```typescript
class Character {
  // Frequently accessed derived state = computed
  get overskudd(): number { /* calc */ }
  get isInShadow(): boolean { /* calc */ }
  get availableActivities(): Activity[] { /* calc */ }
  get dominantColor(): Color { /* calc */ }

  // Avoid: Methods that could be computed
  // Bad: getOverskudd() { return calc... }
  // Good: get overskudd() { return calc... }
}
```

---

## Build Order

Based on system dependencies and testability.

### Phase 1: Foundation (Week 1)
**Build:** Time + Character (basic)

```
TimeStore ◄── CharacterStore (needs only)
```

**Why first:**
- Time is the root of all data flow
- Character needs decay demonstrates the core loop
- Can test with simple UI: just showing numbers change

**Deliverable:**
- Characters with needs that decay over time
- Overskudd calculation working
- Basic game loop running

### Phase 2: Gameplay Loop (Week 2)
**Build:** Activity + Character (skills)

```
TimeStore ◄── CharacterStore ◄── ActivityStore
```

**Why second:**
- Activities are the primary player interaction
- Skills gate activities = core gameplay
- Resource output demonstrates character differences

**Deliverable:**
- Characters can perform activities
- Activities affect needs and produce resources
- Skill requirements working

### Phase 3: Direction (Week 3)
**Build:** Quest + Interaction (basic)

```
QuestStore observes ActivityStore + CharacterStore
InteractionStore routes to all stores
```

**Why third:**
- Quests give player purpose
- Interaction system makes game playable
- Can be simple: click character, click activity

**Deliverable:**
- Day 1-3 quests functional
- Basic click-to-interact working
- Context menus for activity selection

### Phase 4: Color/Shadow System (Week 4)
**Build:** MTG Colors + Shadow states

```
Character.colors ──► behavior modifications
Character.shadow ──► activity restrictions
```

**Why fourth:**
- Adds depth to character system
- Shadow states create tension
- Color affinities make characters feel different

**Deliverable:**
- Elling prefers Blue activities
- Mother handles Green/White activities easily
- Shadow state triggers behavioral changes

### Phase 5: Crisis (Week 5)
**Build:** Crisis state machine

```
CrisisStore ◄── TimeStore (trigger)
CrisisStore ──► CharacterStore (state changes)
CrisisStore ◄── CharacterStore (skill checks)
```

**Why fifth:**
- Requires all other systems working
- Most complex state machine
- The climax of the demo

**Deliverable:**
- Day 10 triggers crisis
- Phone skill check determines outcome
- Two endings working

### Phase 6: Polish (Week 6)
**Build:** Juice + feedback + edge cases

**Focus:**
- Animation triggers in InteractionStore
- Sound cue triggers
- Edge case handling
- Playtesting feedback

---

## Component Boundaries

### Stores (src/stores/)

| Store | Can Access | Cannot Access |
|-------|-----------|---------------|
| TimeStore | Nothing | Everything |
| CharacterStore | TimeStore | QuestStore, CrisisStore |
| ActivityStore | CharacterStore, TimeStore | QuestStore, CrisisStore |
| QuestStore | ActivityStore, CharacterStore, TimeStore | CrisisStore |
| CrisisStore | CharacterStore, TimeStore | QuestStore |
| InteractionStore | All stores | N/A (routing layer) |

**Principle:** Lower layers don't know about higher layers. Prevents circular dependencies.

### Data (src/data/)

Static definitions, not MobX stores:

```
src/data/
├── characters.ts    # Elling, Mother definitions
├── activities.ts    # Activity definitions
├── quests.ts        # Quest definitions
├── colors.ts        # MTG color system constants
└── skills.ts        # Skill definitions
```

### Components (src/components/)

```
src/components/
├── Game.tsx              # Main component, game loop
├── World/
│   ├── Character.tsx     # Character sprite/representation
│   └── Room.tsx          # Environment (simple for prototype)
├── UI/
│   ├── HUD.tsx           # Time, overskudd displays
│   ├── QuestPanel.tsx    # Active quests
│   ├── ContextMenu.tsx   # Activity selection
│   └── NeedsDisplay.tsx  # Character needs bars
└── Narrative/
    ├── CrisisOverlay.tsx # Crisis sequence UI
    └── EndingScreen.tsx  # Demo endings
```

---

## Anti-Patterns to Avoid

### 1. Putting UI State in Game Stores

**Bad:**
```typescript
class CharacterStore {
  selectedCharacterId: string; // UI concern!
  isContextMenuOpen: boolean;  // UI concern!
}
```

**Good:**
```typescript
class InteractionStore {
  // UI state lives here
  selectedCharacterId: string;
  contextMenu: { isOpen: boolean; position: Point; target: string };
}
```

### 2. Direct Component-to-Component Communication

**Bad:**
```typescript
// In QuestPanel.tsx
function handleQuestComplete() {
  characterRef.current.addExperience(100); // Direct mutation
}
```

**Good:**
```typescript
// In QuestPanel.tsx
function handleQuestComplete() {
  questStore.completeQuest(questId); // Store handles side effects
}
```

### 3. Computed Values in Components

**Bad:**
```typescript
function CharacterCard({ character }) {
  const overskudd = (character.needs.energy + character.needs.social + character.needs.purpose) / 3;
  // Recalculates every render!
}
```

**Good:**
```typescript
// In Character class
get overskudd(): number {
  // MobX memoizes this
  return (this.needs.energy + this.needs.social + this.needs.purpose) / 3;
}

function CharacterCard({ character }) {
  // Just access the computed
  return <div>{character.overskudd}</div>;
}
```

### 4. Forgetting to Use observer()

**Bad:**
```typescript
function NeedsDisplay({ character }) {
  return <div>{character.needs.energy}</div>; // Won't update!
}
```

**Good:**
```typescript
const NeedsDisplay = observer(({ character }) => {
  return <div>{character.needs.energy}</div>; // Updates automatically
});
```

### 5. Massive Monolithic Store

**Bad:**
```typescript
class GameStore {
  time = 0;
  characters = [];
  activities = [];
  quests = [];
  crisis = {};
  selectedCharacter = null;
  // 500 more properties...
}
```

**Good:** Root store pattern with domain-specific stores (as shown above).

---

## Prototype Simplifications

For a prototype, explicitly skip:

1. **Persistence** - No save/load needed
2. **Undo/Redo** - Not worth the complexity
3. **Multiplayer** - Single player only
4. **Complex animations** - CSS transitions sufficient
5. **Pathfinding** - Characters don't move spatially
6. **Full collision** - No physics needed

Keep it simple. The goal is validating the character system, not building an engine.

---

## Sources

- MobX Official Documentation: [Defining Data Stores](https://mobx.js.org/defining-data-stores.html)
- [MobX Root Store Pattern with React Hooks](https://dev.to/ivandotv/mobx-root-store-pattern-with-react-hooks-318d)
- [MobX Architecture in Production](https://esuca.hashnode.dev/mobx-architecture-in-production)
- [MobX Best Practices for React](https://tillitsdone.com/blogs/mobx-best-practices-for-react/)
- Reference project: `/Users/godstemning/projects-local/mental-sine-waves` (singleton gameState pattern)
- Design doc: `Demo Systems Specification (TypeScript)` in project folder

---

*Researched: 2026-01-27*
