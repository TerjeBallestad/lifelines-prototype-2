# Phase 3: Activity Loop - Research

**Researched:** 2026-01-28
**Domain:** Game feedback systems, skill progression, resource production
**Confidence:** HIGH

## Summary

This phase adds the "juice" to the activity system: visible resource production, skill progression with XP bars, floating number feedback, and player intervention. The existing codebase already has a solid foundation with MobX stores, motion/react animations, and a working activity state machine.

The key research areas are:
1. **Floating number animations** - Using motion's `useMotionValue`, `useTransform`, and `animate` for performant pop-up numbers
2. **Skill progression system** - XP curves, level calculations, and computed values for skill-based output modifiers
3. **Player intervention UI** - DaisyUI modal patterns with the native `<dialog>` element
4. **Resource system expansion** - Adding new resource types beyond the 3 core needs

**Primary recommendation:** Extend the existing MobX/motion architecture with a new `SkillStore` for skill state, computed values for skill-modified activity output, and a `FloatingNumber` component using motion values for high-performance animations.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.0.0 | Animations, springs, number interpolation | Already used for character movement and thought bubbles |
| mobx | ^6.15.0 | State management, computed values | RootStore pattern already established |
| mobx-react-lite | ^4.1.0 | React bindings | observer() pattern used throughout |
| daisyui | ^5.0.0 | UI components | Modal, progress bars, buttons |

### Supporting (May Add)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource/press-start-2p | latest | Pixel font for floating numbers | If Google Fonts CDN is unacceptable |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom floating numbers | react-animated-numbers | Custom gives more control for game-specific styling |
| Press Start 2P font | VT323 or another pixel font | Press Start 2P is most recognizable 8-bit aesthetic |

**No new packages needed.** The existing stack (motion, MobX, DaisyUI) handles all requirements.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── stores/
│   ├── RootStore.ts          # Existing - add SkillStore and ResourceStore
│   ├── CharacterStore.ts     # Existing - extend with skills
│   ├── SkillStore.ts         # NEW - skill levels, XP, progression
│   └── ResourceStore.ts      # NEW - global resource tracking
├── components/
│   ├── FloatingNumber.tsx    # NEW - pop-up feedback component
│   ├── ResourceBar.tsx       # NEW - top bar with resource counters
│   ├── SkillProgress.tsx     # NEW - XP bar with level display
│   ├── ActivityModal.tsx     # NEW - player intervention UI
│   └── CharacterSprite.tsx   # Existing - extend for failure animations
├── systems/
│   ├── UtilityAI.ts          # Existing - no changes needed
│   └── SkillSystem.ts        # NEW - XP calculations, success chance
├── types/
│   └── game.ts               # Existing - add Skill, Resource types
└── data/
    ├── activities.ts         # Existing - add skill/resource mappings
    └── skills.ts             # NEW - skill definitions, XP curves
```

### Pattern 1: Computed Values for Skill-Modified Output
**What:** Use MobX computed values to derive activity output from skill level
**When to use:** Any value that depends on skill level (output amount, success chance, completion speed)
**Example:**
```typescript
// Source: MobX official docs + existing CharacterStore pattern
export class CharacterSkill {
  skillId: string;
  xp: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed: level derived from XP
  get level(): number {
    // Shallow curve for max 5 levels
    // Level 1: 0 XP, Level 2: 100 XP, Level 3: 300 XP, Level 4: 600 XP, Level 5: 1000 XP
    if (this.xp >= 1000) return 5;
    if (this.xp >= 600) return 4;
    if (this.xp >= 300) return 3;
    if (this.xp >= 100) return 2;
    return 1;
  }

  // Computed: XP needed for next level
  get xpToNextLevel(): number {
    const thresholds = [0, 100, 300, 600, 1000];
    if (this.level >= 5) return 0;
    return thresholds[this.level] - this.xp;
  }

  // Computed: progress percentage within current level
  get levelProgress(): number {
    const thresholds = [0, 100, 300, 600, 1000];
    if (this.level >= 5) return 1;
    const prevThreshold = thresholds[this.level - 1];
    const nextThreshold = thresholds[this.level];
    return (this.xp - prevThreshold) / (nextThreshold - prevThreshold);
  }
}
```

### Pattern 2: Motion Value Number Animation
**What:** Use `useMotionValue` + `useTransform` + `animate` for floating numbers
**When to use:** Pop-up resource feedback that doesn't trigger React re-renders
**Example:**
```typescript
// Source: motion.dev documentation + buildui.com patterns
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';

function FloatingNumber({ value, x, y, onComplete }: Props) {
  const opacity = useMotionValue(1);
  const posY = useMotionValue(0);
  const displayValue = useTransform(posY, () => value);

  useEffect(() => {
    // Animate upward and fade out
    const controls = animate(posY, -50, { duration: 1 });
    const fadeControls = animate(opacity, 0, { duration: 1, delay: 0.5 });

    const timer = setTimeout(onComplete, 1000);
    return () => {
      controls.stop();
      fadeControls.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      className="absolute text-2xl font-pixel pointer-events-none"
      style={{ left: x, top: y, y: posY, opacity }}
    >
      +{value}
    </motion.div>
  );
}
```

### Pattern 3: DaisyUI Dialog Modal
**What:** Native HTML `<dialog>` element with DaisyUI styling for activity selection
**When to use:** Full-screen activity menu when clicking a character
**Example:**
```typescript
// Source: DaisyUI modal documentation
function ActivityModal({ character, onSelect, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (character) {
      dialogRef.current?.showModal();
    }
  }, [character]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Assign Activity to {character?.name}</h3>
        <div className="py-4 grid gap-2">
          {activities.map(activity => (
            <button
              key={activity.id}
              className="btn btn-outline justify-start"
              onClick={() => { onSelect(activity); dialogRef.current?.close(); }}
            >
              <span>{activity.icon}</span>
              <span>{activity.name}</span>
              <span className="ml-auto text-sm opacity-70">
                {calculateSuccessChance(character, activity)}% success
              </span>
            </button>
          ))}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
```

### Pattern 4: Object Pool for Floating Numbers
**What:** Reuse floating number components instead of creating/destroying
**When to use:** High-frequency feedback (many activities completing)
**Example:**
```typescript
// Source: Game development best practices
class FloatingNumberPool {
  private pool: FloatingNumberData[] = [];
  private active: FloatingNumberData[] = [];

  spawn(value: number, x: number, y: number): FloatingNumberData {
    const item = this.pool.pop() || { id: crypto.randomUUID(), value: 0, x: 0, y: 0, active: false };
    item.value = value;
    item.x = x;
    item.y = y;
    item.active = true;
    this.active.push(item);
    return item;
  }

  recycle(item: FloatingNumberData): void {
    item.active = false;
    const idx = this.active.indexOf(item);
    if (idx >= 0) this.active.splice(idx, 1);
    this.pool.push(item);
  }
}
```

### Anti-Patterns to Avoid
- **Setting React state for every animation frame:** Use motion values instead
- **Creating new floating number components on every activity completion:** Use object pooling
- **Storing derived values as observable state:** Use MobX computed instead (e.g., level from XP)
- **Calculating skill modifiers inline in render:** Use computed values

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Number animation | Custom setInterval counter | motion `animate()` + `useTransform()` | Handles easing, cancellation, performance |
| Spring physics | Manual velocity calculations | motion `useSpring()` | Already used in CharacterSprite |
| Modal accessibility | Custom focus trap | Native `<dialog>` + DaisyUI | ESC key, focus management built-in |
| Pixel font | Custom bitmap rendering | CSS @font-face + Press Start 2P | Works with all text features |

**Key insight:** The project already uses motion for animations. Extending its use to number animations is more consistent than adding a new library.

## Common Pitfalls

### Pitfall 1: Expensive Computeds Running Every Frame
**What goes wrong:** Computed values that depend on time or frame count recompute constantly
**Why it happens:** MobX computeds rerun when any dependency changes
**How to avoid:** Skill/resource computeds should only depend on XP/count values, not time
**Warning signs:** Performance degradation as character count increases

### Pitfall 2: Floating Numbers Accumulating in DOM
**What goes wrong:** Hundreds of floating number elements created during long play sessions
**Why it happens:** Creating new components for each feedback without cleanup
**How to avoid:** Use object pooling, remove completed animations
**Warning signs:** DOM node count increasing in DevTools over time

### Pitfall 3: Modal Blocking Game Loop
**What goes wrong:** Game pauses unexpectedly when modal opens
**Why it happens:** Modal steals focus, useGameLoop might pause
**How to avoid:** Keep game loop running, only pause character decisions during intervention
**Warning signs:** Time stops advancing when activity modal is open

### Pitfall 4: XP Curve Too Steep or Too Shallow
**What goes wrong:** Players max skills in 5 minutes OR never level up
**Why it happens:** XP curve not tuned to activity frequency
**How to avoid:** Start with simple thresholds, tune based on playtest (100/300/600/1000 for 5 levels)
**Warning signs:** All skills at max after 1 game-day, or still at level 1 after 5 game-days

### Pitfall 5: Refusal Messages Unclear
**What goes wrong:** Player doesn't understand why character won't do activity
**Why it happens:** Generic "refuses" message without context
**How to avoid:** Include reason icon + brief text: "Too tired", "Not skilled enough"
**Warning signs:** Playtesters repeatedly clicking refused activities

## Code Examples

Verified patterns from project codebase and official sources:

### Adding Skills to Character Store
```typescript
// Extension of existing CharacterStore pattern
export class Character {
  // ... existing properties ...

  skills: Map<SkillCategory, CharacterSkill> = new Map();

  constructor(data: CharacterData, characterStore: CharacterStore) {
    // ... existing constructor ...

    // Initialize skills based on MTG colors
    this.initializeSkills(data.colors);

    makeAutoObservable(this, { /* ... */ });
  }

  private initializeSkills(colors: MTGColorProfile): void {
    // Blue characters start with Creative skill
    // White characters start with Practical skill
    const primaryBonus = colors.primary.color;
    const skillMap: Record<MTGColor, SkillCategory> = {
      blue: 'Creative',
      white: 'Practical',
      green: 'Practical',
      red: 'Social',
      black: 'Technical',
    };

    for (const category of ['Practical', 'Creative', 'Social', 'Technical'] as SkillCategory[]) {
      const skill = new CharacterSkill(category);
      if (skillMap[primaryBonus] === category) {
        skill.grantXP(100); // Start at level 2
      }
      this.skills.set(category, skill);
    }
  }

  getSkill(category: SkillCategory): CharacterSkill | undefined {
    return this.skills.get(category);
  }
}
```

### Success Chance Calculation
```typescript
// Skill-based success chance following game balance principles
export function calculateSuccessChance(
  character: Character,
  activity: Activity
): number {
  const skill = character.getSkill(activity.skillCategory);
  const skillLevel = skill?.level ?? 1;
  const baseDifficulty = activity.difficulty ?? 1;

  // Formula: 50% base + 10% per skill level - 15% per difficulty above 1
  // Level 1 vs Difficulty 1: 60%
  // Level 3 vs Difficulty 2: 80%
  // Level 1 vs Difficulty 3: 30%
  const chance = 50 + (skillLevel * 10) - ((baseDifficulty - 1) * 15);
  return Math.max(10, Math.min(95, chance)); // Clamp 10-95%
}

// Output modifier based on skill
export function calculateOutputModifier(skillLevel: number): number {
  // Level 1: 1.0x, Level 2: 1.2x, Level 3: 1.5x, Level 4: 1.8x, Level 5: 2.0x
  const modifiers = [1.0, 1.0, 1.2, 1.5, 1.8, 2.0];
  return modifiers[skillLevel] ?? 1.0;
}
```

### Resource Types Extension
```typescript
// Extending the existing types/game.ts
export type ResourceType =
  | 'creativity'   // Blue-adjacent, from reading/thinking
  | 'food'         // Green/White, from cooking
  | 'cleanliness'  // White, from cleaning
  | 'comfort'      // Green, from resting
  | 'connection'   // Social activities
  | 'progress';    // General accomplishment feeling

export interface ActivityOutput {
  resource: ResourceType;
  baseAmount: number;
}

// Activity extension
export interface Activity {
  // ... existing fields ...
  outputs?: ActivityOutput[];
  skillCategory: SkillCategory;
  difficulty?: number; // 1-3, default 1
}
```

### Pixel Font Integration
```css
/* Add to global CSS or component */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-pixel {
  font-family: 'Press Start 2P', cursive;
}

.floating-number {
  font-family: 'Press Start 2P', cursive;
  font-size: 16px;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  color: #ffcc00; /* Gold for positive */
}

.floating-number-negative {
  color: #ff4444; /* Red for negative */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion package | 2024 | Same API, new name, smaller bundle |
| Custom springs | useSpring from motion | 2023+ | Built-in physics, better perf |
| CSS keyframe counters | Motion value animations | 2024+ | No React re-renders |
| Checkbox modals | Native dialog element | 2023+ | Better accessibility, ESC support |

**Deprecated/outdated:**
- `framer-motion` package: Renamed to `motion`, project already uses correct version

## Open Questions

Things that couldn't be fully resolved:

1. **Exact XP curve tuning**
   - What we know: Standard formulas exist (linear, exponential, Fibonacci)
   - What's unclear: Which curve feels right for 10 game-day playthrough
   - Recommendation: Start with simple thresholds [0, 100, 300, 600, 1000], tune in playtesting

2. **Critical success trigger**
   - What we know: Higher skill = occasional bonus
   - What's unclear: Exact probability and bonus amount
   - Recommendation: 5% + (skillLevel * 5)% chance for +50% output

3. **Forcing reluctant character consequences**
   - What we know: Context matters (fear vs exhaustion)
   - What's unclear: How to detect "pushing through fear" vs "burning out"
   - Recommendation: Tag activities with `challengeType: 'fear' | 'effort'`, different consequences per type

## Sources

### Primary (HIGH confidence)
- Project codebase: `/Users/godstemning/projects-local/lifelines-prototype-2/src/` - existing patterns
- MobX official docs: https://mobx.js.org/computeds.html - computed value patterns
- DaisyUI docs: https://daisyui.com/components/modal/ - dialog modal pattern
- motion.dev docs: https://motion.dev/docs/react-use-transform - motion value animation

### Secondary (MEDIUM confidence)
- RPG leveling guide: https://howtomakeanrpg.com/r/a/how-to-make-an-rpg-levels.html - XP formulas
- Game math blog: https://www.davideaversa.it/blog/gamedesign-math-rpg-level-based-progression/ - curve types
- Build UI patterns: https://buildui.com/recipes/animated-counter - motion counter recipe

### Tertiary (LOW confidence)
- WebSearch: Game balance formulas - general principles, needs validation in context
- WebSearch: Pixel fonts - aesthetic choice, verify rendering quality

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - using existing project libraries
- Architecture: HIGH - extending established patterns
- XP/skill formulas: MEDIUM - formulas are standard, tuning is context-specific
- Pitfalls: HIGH - based on motion/MobX official docs

**Research date:** 2026-01-28
**Valid until:** 60 days (stable domain, no breaking changes expected)
