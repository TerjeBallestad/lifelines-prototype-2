# Phase 5: Crisis Sequence - Research

**Researched:** 2026-01-28
**Domain:** Crisis event system, skill checks, modal UI, state management
**Confidence:** HIGH (based on existing codebase patterns)

## Summary

The crisis sequence builds on established patterns from the existing codebase. The primary challenge is implementing a new game state (crisis mode) that pauses normal gameplay and presents a sequential action-selection interface with skill-based outcomes. The existing modal patterns (QuestCelebration, LevelUpCelebration), skill check system (SkillSystem.ts), and state management (MobX stores) provide all the foundations needed.

Key implementation areas:
1. **Crisis trigger** - Day 10 detection via TimeStore observation, Mother collapse event
2. **Crisis modal UI** - Urgent overlay with action selection, skill check visualization, retry mechanics
3. **Shadow state behavior** - CHAR-04 requirement for Blue personality paralysis under stress
4. **Outcome resolution** - Two endings based on phone skill success/failure

**Primary recommendation:** Create a dedicated CrisisStore following QuestStore patterns, with a CrisisModal component following QuestCelebration patterns. Reuse existing SkillSystem for success/failure calculations with crisis-specific modifiers.

## Standard Stack

This phase uses the existing project stack. No new libraries needed.

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| mobx | ^6.15.0 | State management | Project standard, reactive computed properties |
| mobx-react-lite | ^4.1.0 | React bindings | observer() pattern established |
| motion | ^12.0.0 | Animations | AnimatePresence, useSpring patterns established |
| react | ^19.0.0 | UI framework | Project foundation |

### Supporting (Already in Project)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.469.0 | Icons | Alert icons for crisis UI |
| clsx | ^2.1.1 | Class merging | Conditional styling |
| daisyUI | ^5.0.0 | Components | Modal, buttons, alerts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom state machine lib | MobX observables | MobX already handles state transitions well, no need for XState complexity |
| New animation lib | motion/react (existing) | Already integrated, spring animations work well |

**Installation:**
```bash
# No new dependencies needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   └── CrisisStore.ts        # New: crisis state, actions, outcomes
├── components/
│   ├── CrisisModal.tsx       # New: main crisis UI overlay
│   ├── CrisisAction.tsx      # New: action button with skill check display
│   └── CrisisEpilogue.tsx    # New: ending text display
├── data/
│   └── crisis.ts             # New: crisis actions, epilogue text
├── types/
│   └── game.ts               # Extend: CrisisAction, CrisisState types
└── systems/
    └── SkillSystem.ts        # Extend: crisis-specific check functions
```

### Pattern 1: CrisisStore (Following QuestStore Pattern)
**What:** MobX store managing crisis state machine and action outcomes
**When to use:** Crisis triggering, action tracking, outcome determination

```typescript
// Pattern from existing QuestStore.ts
export class CrisisStore {
  crisisState: 'inactive' | 'warning' | 'active' | 'resolved' = 'inactive';
  selectedAction: CrisisAction | null = null;
  actionAttempts: Map<string, number> = new Map(); // Track retry counts
  outcome: 'saved' | 'lost' | null = null;

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  // Computed: should crisis trigger?
  get shouldTrigger(): boolean {
    return this.rootStore.timeStore.day === 10
      && this.rootStore.timeStore.hour >= 14  // Afternoon on day 10
      && this.crisisState === 'inactive';
  }

  // Computed: success chance with retry penalty
  getActionSuccessChance(actionId: string): number {
    const attempts = this.actionAttempts.get(actionId) ?? 0;
    const baseChance = this.calculateBaseChance(actionId);
    // Decrease by 15% per retry attempt
    return Math.max(10, baseChance - (attempts * 15));
  }
}
```

### Pattern 2: Crisis Modal (Following QuestCelebration Pattern)
**What:** Full-screen modal overlay that pauses game and presents crisis actions
**When to use:** When crisis becomes active

```typescript
// Pattern from existing QuestCelebration.tsx
export const CrisisModal = observer(function CrisisModal() {
  const { crisisStore, timeStore } = useGameStore();

  // Pause game when crisis appears
  useEffect(() => {
    if (crisisStore.crisisState === 'active') {
      timeStore.pause();
    }
  }, [crisisStore.crisisState, timeStore]);

  if (crisisStore.crisisState !== 'active') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      >
        {/* Crisis content with red urgent tones */}
      </motion.div>
    </AnimatePresence>
  );
});
```

### Pattern 3: Skill Check Display (Following ActivityModal Pattern)
**What:** Shows skill being tested and success chance before action
**When to use:** Each crisis action button

```typescript
// Pattern from existing ActivityModal.tsx calculateSuccessChance usage
const handleActionSelect = (action: CrisisAction) => {
  const skillLevel = skillStore.getSkill('elling', action.skillCategory)?.level ?? 1;
  const successChance = crisisStore.getActionSuccessChance(action.id);

  // Show skill check UI, then roll
  crisisStore.attemptAction(action, skillLevel);
};
```

### Pattern 4: Shadow State (Extending Character Class)
**What:** Blue personality enters paralysis when under extreme stress
**When to use:** During crisis when Elling's color health drops low

```typescript
// Extend Character class in CharacterStore.ts
get inShadowState(): boolean {
  // Shadow triggers when overskudd drops below threshold during crisis
  // Blue shadow = paralysis (can't take actions effectively)
  return this.colors.primary.color === 'blue'
    && this.characterStore.rootStore.crisisStore.crisisState === 'active'
    && this.overskudd < 30; // Shadow threshold
}

// During crisis, shadow state affects action success
get shadowPenalty(): number {
  return this.inShadowState ? 20 : 0; // -20% success if in shadow
}
```

### Anti-Patterns to Avoid
- **Don't create separate game loop for crisis:** Reuse existing pause mechanism, crisis is modal overlay
- **Don't store probability results in state:** Calculate on-demand using SkillSystem functions
- **Don't hard-code outcomes:** Use the established skill check formula with crisis modifiers
- **Don't skip animation:** Use established motion patterns for visual feedback

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill success calculation | Custom crisis formula | `calculateSuccessChance` from SkillSystem | Already handles level + difficulty, add modifier |
| Animation timing | setTimeout chains | motion useSpring, AnimatePresence | Consistent with project, better UX |
| State observation | Manual event handlers | MobX computed + observer | Project pattern, reactive updates |
| Modal backdrop | Custom overlay | daisyUI modal pattern | Existing pattern from QuestCelebration |
| Game pausing | Crisis-specific pause | `timeStore.pause()` | Already integrated with game loop |

**Key insight:** The crisis is mechanically similar to a quest completion + activity selection. The urgency comes from visuals and narrative, not new mechanics.

## Common Pitfalls

### Pitfall 1: Forgetting to Resume Game After Crisis
**What goes wrong:** Game stays paused after ending is shown
**Why it happens:** Multiple modal layers (crisis -> epilogue -> menu options)
**How to avoid:** Explicit resume call in final dismissal, or "Try Again" resets game
**Warning signs:** Game stuck on black screen after ending

### Pitfall 2: Retry Mechanic Not Tracking Properly
**What goes wrong:** Success chance doesn't decrease, or decreases too much
**Why it happens:** Map state not persisted correctly, or penalty applied multiple times
**How to avoid:** Use MobX Map, increment only on attempt, not on display
**Warning signs:** "Phone" showing different chance values inconsistently

### Pitfall 3: Shadow State Not Visually Distinct
**What goes wrong:** Player doesn't realize Elling is in shadow state during crisis
**Why it happens:** Only affects behind-the-scenes calculations
**How to avoid:** Visual indicator in crisis modal (Elling's portrait grayed, text about paralysis)
**Warning signs:** Player confused why actions fail more during crisis

### Pitfall 4: Day 10 Detection Fires Multiple Times
**What goes wrong:** Crisis triggers repeatedly
**Why it happens:** Computed property re-evaluates, state not guarded
**How to avoid:** Guard with `crisisState === 'inactive'` in trigger condition
**Warning signs:** Multiple crisis modals appearing, or re-triggering after resolution

### Pitfall 5: Epilogue Text Not Fitting Modal
**What goes wrong:** Long epilogue text overflows or gets cut off
**Why it happens:** Fixed modal height, variable text length
**How to avoid:** Scrollable content area, or paginated text
**Warning signs:** Text cut off mid-sentence

## Code Examples

Verified patterns from existing codebase:

### Crisis Trigger Detection (Following Quest Completion Pattern)
```typescript
// In Game.tsx, following quest completion detection pattern
useEffect(() => {
  if (store.crisisStore.shouldTrigger) {
    store.crisisStore.triggerCrisis();
  }
}, [store.crisisStore.shouldTrigger, store]);
```

### Crisis Action with Skill Check
```typescript
// Following ActivityModal skill check display pattern
interface CrisisActionProps {
  action: CrisisAction;
  onSelect: (action: CrisisAction) => void;
}

const CrisisActionButton = observer(({ action, onSelect }: CrisisActionProps) => {
  const { crisisStore, skillStore } = useGameStore();

  const skillLevel = skillStore.getSkill('elling', action.skillCategory)?.level ?? 1;
  const successChance = crisisStore.getActionSuccessChance(action.id);
  const attempts = crisisStore.actionAttempts.get(action.id) ?? 0;

  return (
    <button className="btn btn-error btn-outline" onClick={() => onSelect(action)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{action.icon}</span>
        <div className="flex-1 text-left">
          <div className="font-medium">{action.name}</div>
          <div className="text-xs opacity-70">
            {action.skillCategory} (Lv.{skillLevel})
            {attempts > 0 && <span className="ml-2 text-warning">Retry #{attempts}</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{successChance}%</div>
          <div className="text-xs opacity-70">success</div>
        </div>
      </div>
    </button>
  );
});
```

### Crisis Outcome Determination
```typescript
// Following SkillSystem pattern for skill checks
attemptAction(action: CrisisAction): ActionResult {
  const character = this.rootStore.characterStore.getCharacter('elling')!;
  const skillLevel = this.rootStore.skillStore.getSkill('elling', action.skillCategory)?.level ?? 1;

  // Get base success chance with retry penalty
  let successChance = this.getActionSuccessChance(action.id);

  // Apply shadow state penalty if applicable
  if (character.inShadowState) {
    successChance -= 20;
  }

  // Clamp to valid range
  successChance = Math.max(5, Math.min(95, successChance));

  // Roll for success
  const roll = Math.random() * 100;
  const succeeded = roll < successChance;

  // Track attempt
  const attempts = this.actionAttempts.get(action.id) ?? 0;
  this.actionAttempts.set(action.id, attempts + 1);

  return {
    succeeded,
    action,
    roll,
    chance: successChance,
  };
}
```

### Mother Movement Speed Modification (Warning Sign)
```typescript
// In Character class or a computed property
get currentMoveSpeed(): number {
  let speed = this.baseWalkSpeed;

  // On day 10, Mother shows warning signs with slower movement
  if (this.id === 'mother' && this.characterStore.rootStore.timeStore.day === 10) {
    const hour = this.characterStore.rootStore.timeStore.hour;
    // Progressively slower as day goes on
    if (hour >= 8) speed *= 0.8;
    if (hour >= 11) speed *= 0.6;
    if (hour >= 13) speed *= 0.3;
  }

  // Scale with overskudd
  return (this.overskudd / 100) * speed;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| XState for FSM | MobX computed | Project decision | Simpler, fewer dependencies |
| Custom animation | motion/react useSpring | Phase 1 | Consistent spring physics |
| Event emitters | MobX reactions | Phase 3 | Automatic cleanup, reactive |

**Deprecated/outdated:**
- None for this phase - using established patterns

## Open Questions

Things to resolve during implementation:

1. **Shadow state threshold: At what overskudd does shadow trigger?**
   - What we know: Low overskudd < 40 triggers reluctant behavior already
   - What's unclear: Crisis-specific threshold (lower? same?)
   - Recommendation: Use 30 as shadow threshold (more severe than reluctant)

2. **Warning sign timing: How long before collapse?**
   - What we know: Collapse on day 10 afternoon, warning signs in morning
   - What's unclear: Exact hours (e.g., warning 8am-2pm, collapse 2pm)
   - Recommendation: Warning signs start at hour 8, collapse triggers at hour 14

3. **Retry penalty amount: How much per attempt?**
   - What we know: Decreasing success chance on retry
   - What's unclear: -10%? -15%? -20%?
   - Recommendation: -15% per attempt (matches existing difficulty tier penalty)

4. **Can other actions prevent total failure?**
   - What we know: "Help Mother" and "Run to neighbor" buy time
   - What's unclear: Mechanical effect (increase phone success? delay timer?)
   - Recommendation: Non-phone actions give +10% to next phone attempt (hope bonus)

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis:
  - `/src/stores/QuestStore.ts` - Modal trigger pattern
  - `/src/stores/CharacterStore.ts` - Character state machine
  - `/src/systems/SkillSystem.ts` - Success chance formula
  - `/src/components/QuestCelebration.tsx` - Modal UI pattern
  - `/src/components/ActivityModal.tsx` - Skill check display

### Secondary (MEDIUM confidence)
- [Game Developer: Probability Problems](https://www.gamedeveloper.com/design/probability-problems-in-game-design) - Transparency in probability systems
- [State Machines in Game Development](https://jessewarden.com/2012/07/finite-state-machines-in-game-development.html) - Event-driven state patterns

### Tertiary (LOW confidence)
- General React state machine patterns (validated against project decisions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, all patterns established
- Architecture: HIGH - Direct extension of existing QuestStore/QuestCelebration patterns
- Pitfalls: MEDIUM - Based on common modal/state patterns, not crisis-specific experience

**Research date:** 2026-01-28
**Valid until:** Indefinite (internal patterns, no external API dependencies)
