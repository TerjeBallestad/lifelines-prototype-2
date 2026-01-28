# Phase 4: Quest System - Research

**Researched:** 2026-01-28
**Domain:** MobX state management + React UI for quest tracking
**Confidence:** HIGH

## Summary

The Quest System implementation is a straightforward application of existing codebase patterns. The project already has all necessary infrastructure: MobX stores for state management, motion/react for animations, and established patterns for progress bars, modals, and reactive UI updates.

The core challenge is designing a QuestStore that reactively tracks quest progress by observing changes in ResourceStore and SkillStore. The three quest types (morning routine, resource accumulation, skill leveling) each require different completion condition logic but share the same UI and celebration patterns.

No new libraries are needed. All patterns exist in the codebase and can be directly applied.

**Primary recommendation:** Create QuestStore following RootStore child pattern with computed progress, observable completion state, and celebration popup using LevelUpCelebration as template.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| MobX | 6.15.0 | Quest state management | Already used for all game state |
| mobx-react-lite | 4.1.0 | React integration | observer() pattern established |
| motion/react | 12.0.0 | Progress bar animation | Spring patterns from SkillProgress |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 4.0.0 | Panel styling | All UI components |
| DaisyUI | 5.0.0 | Component classes | btn, card, modal patterns |
| lucide-react | 0.469.0 | Icons | Collapse/expand chevron |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| MobX reaction | MobX autorun | reaction() preferred for targeted observation of specific values |
| motion useSpring | CSS transitions | useSpring matches existing XP bar pattern, spring physics feels better |

**Installation:**
```bash
# No new packages needed - all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   └── QuestStore.ts        # Quest state management
├── data/
│   └── quests.ts            # Quest definitions (static data)
├── components/
│   ├── QuestPanel.tsx       # Collapsible side panel
│   ├── QuestProgress.tsx    # Progress bar component
│   └── QuestCelebration.tsx # Completion modal
└── types/
    └── game.ts              # Quest type definitions (extend existing)
```

### Pattern 1: MobX Computed Progress from Observed State

**What:** Quest progress computed from other stores' observable state
**When to use:** Tracking resource accumulation or skill levels as quest objectives
**Example:**
```typescript
// Source: Existing codebase patterns (ResourceStore, SkillStore)
export class QuestStore {
  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  // Computed: reactive progress based on quest type
  get currentQuestProgress(): number {
    const quest = this.currentQuest;
    if (!quest) return 0;

    switch (quest.type) {
      case 'resource':
        const current = this.rootStore.resourceStore.getResource(quest.resourceType);
        return Math.min(1, current / quest.targetAmount);
      case 'skill':
        const skill = this.rootStore.skillStore.getSkill(quest.characterId, quest.skillCategory);
        return skill ? (skill.level >= quest.targetLevel ? 1 : skill.levelProgress * (skill.level / quest.targetLevel)) : 0;
      default:
        return 0;
    }
  }
}
```

### Pattern 2: Auto-Chain with MobX Reaction

**What:** Detect quest completion and automatically advance to next quest
**When to use:** Quest auto-chaining after completion celebration dismissed
**Example:**
```typescript
// Source: Adapted from SkillStore pendingLevelUp pattern
export class QuestStore {
  currentQuestIndex: number = 0;
  pendingCompletion: Quest | null = null;

  // Computed: detect when current quest reaches 100%
  get isQuestComplete(): boolean {
    return this.currentQuestProgress >= 1 && !this.pendingCompletion;
  }

  // Action: mark quest complete (called when progress hits 100%)
  completeCurrentQuest(): void {
    if (this.currentQuest && !this.pendingCompletion) {
      this.pendingCompletion = this.currentQuest;
    }
  }

  // Action: advance to next quest (called when celebration dismissed)
  advanceQuest(): void {
    this.pendingCompletion = null;
    this.currentQuestIndex++;
  }
}
```

### Pattern 3: Spring-Animated Progress Bar

**What:** Smooth progress bar updates using useSpring
**When to use:** Quest progress display, consistent with XP bar
**Example:**
```typescript
// Source: SkillProgress.tsx existing pattern
import { motion, useSpring, useTransform } from 'motion/react';

export const QuestProgress = observer(function QuestProgress({ progress }: { progress: number }) {
  const springProgress = useSpring(progress, {
    stiffness: 100,
    damping: 20,
  });
  const widthPercent = useTransform(springProgress, v => `${v * 100}%`);

  return (
    <div className="h-2 bg-base-300 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-secondary"
        style={{ width: widthPercent }}
      />
    </div>
  );
});
```

### Pattern 4: Celebration Modal with Game Pause

**What:** Full-screen modal that pauses game on quest completion
**When to use:** Quest completion feedback
**Example:**
```typescript
// Source: LevelUpCelebration.tsx existing pattern
export const QuestCelebration = observer(function QuestCelebration() {
  const { questStore, timeStore } = useGameStore();
  const completedQuest = questStore.pendingCompletion;

  useEffect(() => {
    if (completedQuest) {
      timeStore.pause();
    }
  }, [completedQuest, timeStore]);

  if (!completedQuest) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => {
          questStore.advanceQuest();
          timeStore.resume();
        }}
      >
        {/* Modal content */}
      </motion.div>
    </AnimatePresence>
  );
});
```

### Pattern 5: Collapsible Panel State

**What:** Local component state for panel expansion
**When to use:** Quest panel collapse/expand
**Example:**
```typescript
// Source: Common React pattern, consistent with existing component state usage
export const QuestPanel = observer(function QuestPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { questStore } = useGameStore();

  return (
    <div className={`fixed right-4 top-1/2 -translate-y-1/2 transition-all ${isExpanded ? 'w-72' : 'w-16'}`}>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronRight /> : <ChevronLeft />}
      </button>
      {isExpanded ? <ExpandedContent /> : <CollapsedContent />}
    </div>
  );
});
```

### Anti-Patterns to Avoid
- **Polling for progress:** Don't use setInterval to check quest state. MobX computed values are reactive and automatically update.
- **Storing derived state:** Don't store progress percentage in state. Compute it from ResourceStore/SkillStore values.
- **Manual subscription cleanup:** Use MobX reaction() with disposer pattern in useEffect cleanup.
- **State duplication:** Don't copy resource values into QuestStore. Reference them via rootStore.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Progress animation | Custom requestAnimationFrame | motion/react useSpring | Already proven in SkillProgress, spring physics |
| Modal overlay | Custom portal/z-index | Existing LevelUpCelebration pattern | Consistent UX, proven approach |
| State observation | Manual event emitters | MobX reaction/computed | Already the project standard |
| Quest persistence | localStorage logic | Not needed | Game restarts from beginning, no persistence required |

**Key insight:** Every pattern needed already exists in the codebase. The quest system is composition of existing patterns, not invention of new ones.

## Common Pitfalls

### Pitfall 1: Quest Progress Flicker

**What goes wrong:** Progress bar jumps to 100% then back when resources are spent/gained
**Why it happens:** Quest tracks cumulative total, but resources can decrease (if consumed by future systems)
**How to avoid:** Track "high water mark" for progress - once reached, don't decrease. Or track cumulative production instead of current total.
**Warning signs:** Progress bar going backwards when player observes it

### Pitfall 2: Celebration Modal Interrupting Queued Actions

**What goes wrong:** Player queues activity, quest completes, game pauses, queued action is lost
**Why it happens:** Activity queue is on Character, but game pause stops all updates
**How to avoid:** Quest completion pause should preserve game state including queued actions. Resume simply continues from where it left off.
**Warning signs:** Player reports activity disappeared after quest popup

### Pitfall 3: Multiple Quest Completions at Once

**What goes wrong:** Two quests complete in same tick, only one celebration shows
**Why it happens:** Fixed sequence means this shouldn't happen, but edge case with instant completion
**How to avoid:** Only one quest active at a time. pendingCompletion must be cleared before next quest activates.
**Warning signs:** Quest skipped without celebration

### Pitfall 4: Spring Animation Overshooting

**What goes wrong:** Progress bar bounces past 100% visually
**Why it happens:** Spring physics can overshoot target
**How to avoid:** Use `clamp: true` in spring config or CSS `max-width: 100%` on progress bar
**Warning signs:** Progress bar exceeding container bounds

### Pitfall 5: Quest Panel Blocking Game Interaction

**What goes wrong:** Quest panel overlays characters or important UI
**Why it happens:** Fixed positioning conflicts with game world layout
**How to avoid:** Position panel in sidebar area, ensure game world has clear boundaries. Use pointer-events-none where appropriate.
**Warning signs:** Can't click on characters when panel is near them

## Code Examples

Verified patterns from existing codebase:

### Quest Data Definition
```typescript
// Source: Adapted from Activity type pattern in types/game.ts
export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'resource' | 'skill' | 'composite';
  // For resource quests
  resourceType?: ResourceType;
  targetAmount?: number;
  // For skill quests
  characterId?: string;
  skillCategory?: SkillCategory;
  targetLevel?: number;
}

export const QUESTS: Quest[] = [
  {
    id: 'morning-routine',
    title: 'Morning Routine',
    description: 'Complete a full morning - eat breakfast and tidy up',
    type: 'composite',
    // Custom completion logic
  },
  {
    id: 'produce-creativity',
    title: 'Creative Output',
    description: 'Produce 100 creativity through reading and thinking',
    type: 'resource',
    resourceType: 'creativity',
    targetAmount: 100,
  },
  {
    id: 'phone-skill',
    title: 'Stay Connected',
    description: 'Train Phone skill to level 2',
    type: 'skill',
    characterId: 'elling', // or any character
    skillCategory: 'Social',
    targetLevel: 2,
  },
];
```

### QuestStore Integration with RootStore
```typescript
// Source: Pattern from RootStore.ts
// In RootStore constructor:
this.questStore = new QuestStore(this);

// In RootStore tick():
// Quest progress is computed, no tick needed
// But could add: this.questStore.checkCompletion();
```

### Near-Complete Visual Emphasis
```typescript
// Source: CONTEXT.md requirement, adapted from resource-pulse pattern
// In QuestProgress component:
const isNearComplete = progress >= 0.8;

<motion.div
  className={clsx(
    "h-full bg-gradient-to-r from-primary to-secondary",
    isNearComplete && "animate-pulse shadow-lg shadow-primary/50"
  )}
  style={{ width: widthPercent }}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion | motion/react | 2024 | Package renamed, same API |
| MobX 5 | MobX 6 | 2020 | makeAutoObservable preferred |

**Deprecated/outdated:**
- None for this domain - patterns are stable

## Open Questions

Things that couldn't be fully resolved:

1. **Quest 1 "Morning Routine" completion criteria**
   - What we know: CONTEXT says "Morning routine basics"
   - What's unclear: Exact completion condition (time-based? activity-based? resource threshold?)
   - Recommendation: Define as composite quest requiring food + cleanliness above thresholds (e.g., 20 food AND 15 cleanliness)

2. **Quest thresholds for resource/skill quests**
   - What we know: Example "Produce 300 creativity" in requirements
   - What's unclear: Exact values for prototype
   - Recommendation: Start with 100 creativity (achievable in ~10 game-hours), Phone level 2 (100 XP) - balance during testing

3. **Quest introduction popup timing**
   - What we know: CONTEXT says "Separate introduction popup for next quest after completion popup closes"
   - What's unclear: Should intro popup also pause game? Or just brief toast?
   - Recommendation: Brief animated panel highlight + auto-expansion rather than modal pause (save modals for achievements)

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis - RootStore.ts, SkillStore.ts, ResourceStore.ts patterns
- Existing codebase analysis - LevelUpCelebration.tsx, SkillProgress.tsx UI patterns
- 04-CONTEXT.md - User decisions for quest system implementation

### Secondary (MEDIUM confidence)
- MobX documentation - computed values, reaction patterns (training data, verified against codebase usage)
- motion/react API - useSpring (training data, verified against SkillProgress.tsx usage)

### Tertiary (LOW confidence)
- None - all patterns verified against existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, no new dependencies
- Architecture: HIGH - All patterns exist in codebase (stores, animations, modals)
- Pitfalls: MEDIUM - Theoretical edge cases, will validate during implementation

**Research date:** 2026-01-28
**Valid until:** Indefinite - patterns are stable and codebase-specific
