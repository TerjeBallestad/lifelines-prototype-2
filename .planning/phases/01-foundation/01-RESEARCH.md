# Phase 1: Foundation - Research

**Researched:** 2026-01-27
**Domain:** Game loop, time system, character state, observable UI (React + MobX + DaisyUI)
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational game loop and character state systems. The core challenge is building a fixed-timestep game loop that drives MobX observable state, with DaisyUI components displaying time progression and character status in real-time.

The project already has established stack decisions from prior research (`.planning/research/STACK.md` and `ARCHITECTURE.md`). This phase-specific research focuses on **implementation patterns** for the specific requirements: game loop mechanics, time display, character state modeling, overskudd meter visualization, and click-to-view interactions.

**Primary recommendation:** Build a minimal game loop hook with fixed timestep, a TimeStore and CharacterStore using MobX observable classes, and use DaisyUI's `progress`, `radial-progress`, and `stat` components with Motion spring animations for juicy feedback.

## Standard Stack

Already decided in project-level research. Phase 1 uses:

### Core (from STACK.md)
| Library | Version | Purpose | Phase 1 Role |
|---------|---------|---------|--------------|
| React | ^19.2.0 | UI framework | Component rendering |
| MobX | ^6.15.0 | State management | TimeStore, CharacterStore |
| mobx-react-observer | ^1.1.0 | React integration | Auto-observable components |
| DaisyUI | ^5.5.14 | UI components | Dark theme, progress bars, stats |
| Tailwind CSS | ^4.1.18 | Styling | Layout, spacing |
| Motion | ^12.27.0 | Animations | Spring physics for juice |
| TypeScript | ~5.9.3 | Type safety | Character/time interfaces |

### Phase 1 Specific Components

| Component | Use Case |
|-----------|----------|
| DaisyUI `progress` | Linear overskudd meter |
| DaisyUI `radial-progress` | Alternative meter design (Claude's discretion) |
| DaisyUI `stat` | Day counter, time display |
| DaisyUI `card` | Character info panel on click |
| DaisyUI `badge` | MTG color indicators |
| Motion `motion.div` | Animated state changes |
| Motion `useSpring` | Smooth number transitions |

**Installation:** (Already covered in project STACK.md)
```bash
# Dependencies already defined - no additional packages for Phase 1
```

## Architecture Patterns

### Recommended Project Structure (Phase 1)
```
src/
├── stores/
│   ├── RootStore.ts       # Root store pattern (creates all stores)
│   ├── TimeStore.ts       # Day/hour/minute, pause state
│   └── CharacterStore.ts  # Character instances with MTG colors, needs, overskudd
├── hooks/
│   └── useGameLoop.ts     # Fixed-timestep requestAnimationFrame loop
├── components/
│   ├── Game.tsx           # Main component, runs game loop
│   ├── TimeDisplay.tsx    # Day counter, clock, pause button
│   ├── CharacterPanel.tsx # Click-to-view character stats
│   └── OverskuddMeter.tsx # Visual overskudd bar with animation
├── data/
│   ├── characters.ts      # Elling, Mother static definitions
│   └── colors.ts          # MTG color constants
└── types/
    └── game.ts            # TypeScript interfaces
```

### Pattern 1: Fixed-Timestep Game Loop

**What:** Separates simulation time from render time for deterministic updates regardless of display refresh rate.

**When to use:** Always for game state simulation. Prevents faster machines running the game faster.

**Example:**
```typescript
// Source: Glenn Fiedler "Fix Your Timestep" + project STACK.md pattern
import { useEffect, useRef } from 'react';

export function useGameLoop(
  onTick: (deltaMs: number) => void,
  options: {
    targetFps?: number;
    paused?: boolean;
    maxFrameTime?: number;
  } = {}
) {
  const { targetFps = 60, paused = false, maxFrameTime = 250 } = options;
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const tickInterval = 1000 / targetFps;

  useEffect(() => {
    if (paused) return;

    let animationId: number;

    const loop = (currentTime: number) => {
      // Limit delta to prevent spiral of death after tab unfocus
      const deltaMs = Math.min(currentTime - lastTimeRef.current, maxFrameTime);
      lastTimeRef.current = currentTime;
      accumulatorRef.current += deltaMs;

      // Fixed timestep updates
      while (accumulatorRef.current >= tickInterval) {
        onTick(tickInterval);
        accumulatorRef.current -= tickInterval;
      }

      animationId = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [onTick, targetFps, paused, maxFrameTime, tickInterval]);
}
```

### Pattern 2: MobX Root Store with Domain Stores

**What:** Single root store holds references to domain-specific stores. Each domain store accesses siblings via root reference.

**When to use:** Always for multi-domain state like this game (time, characters, activities).

**Example:**
```typescript
// Source: MobX official docs "Defining Data Stores"
import { makeAutoObservable } from 'mobx';

class RootStore {
  timeStore: TimeStore;
  characterStore: CharacterStore;

  constructor() {
    this.timeStore = new TimeStore(this);
    this.characterStore = new CharacterStore(this);
  }

  tick(deltaMs: number) {
    this.timeStore.tick(deltaMs);
    this.characterStore.updateAll(deltaMs);
  }
}

class TimeStore {
  day = 1;
  hour = 7;
  minute = 0;
  isPaused = false;

  // Game speed: how many game-minutes pass per real-second
  gameSpeed = 10; // 10 game-min per real-sec = 1 game-hour per 6 real-sec

  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  get timeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (this.hour < 12) return 'morning';
    if (this.hour < 17) return 'afternoon';
    if (this.hour < 21) return 'evening';
    return 'night';
  }

  get formattedTime(): string {
    return `${this.hour.toString().padStart(2, '0')}:${Math.floor(this.minute).toString().padStart(2, '0')}`;
  }

  tick(deltaMs: number) {
    if (this.isPaused) return;

    // Convert real-time delta to game-time minutes
    const gameMinutes = (deltaMs / 1000) * this.gameSpeed;
    this.minute += gameMinutes;

    while (this.minute >= 60) {
      this.minute -= 60;
      this.hour++;
    }
    while (this.hour >= 24) {
      this.hour -= 24;
      this.day++;
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}

// Singleton export
const rootStore = new RootStore();
export const useGameStore = () => rootStore;
```

### Pattern 3: MobX Character Entity

**What:** Character as observable class with computed derived state.

**When to use:** For any entity with observable properties that derive other state.

**Example:**
```typescript
// Source: Project ARCHITECTURE.md + MTG Color Spec
import { makeAutoObservable } from 'mobx';

interface MTGColorProfile {
  primary: { color: 'white' | 'blue' | 'black' | 'red' | 'green'; intensity: number };
  secondary?: { color: 'white' | 'blue' | 'black' | 'red' | 'green'; intensity: number };
}

interface Needs {
  energy: number;    // 0-100
  social: number;    // 0-100
  purpose: number;   // 0-100
}

class Character {
  id: string;
  name: string;
  colors: MTGColorProfile;
  needs: Needs;
  currentActivity: string | null = null;

  constructor(data: CharacterData, private store: CharacterStore) {
    this.id = data.id;
    this.name = data.name;
    this.colors = data.colors;
    this.needs = { ...data.initialNeeds };
    makeAutoObservable(this);
  }

  // CHAR-05: Overskudd derived from needs
  get overskudd(): number {
    const base = (this.needs.energy + this.needs.social + this.needs.purpose) / 3;
    return Math.round(Math.max(0, Math.min(100, base)));
  }

  // CHAR-06: Needs affect overskudd via decay
  updateNeeds(deltaMs: number, timeOfDay: string) {
    const decayPerSecond = 0.5; // Tunable
    const decay = (deltaMs / 1000) * decayPerSecond;

    this.needs.energy = Math.max(0, this.needs.energy - decay);
    this.needs.social = Math.max(0, this.needs.social - decay * 0.5);
    this.needs.purpose = Math.max(0, this.needs.purpose - decay * 0.3);
  }
}
```

### Pattern 4: DaisyUI Dark Theme Setup

**What:** Enable dark theme via data-theme attribute.

**When to use:** Root HTML element setup.

**Example:**
```html
<!-- index.html -->
<html data-theme="dark">
```

Or in Tailwind CSS config for auto-detection:
```css
/* src/index.css */
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

For explicit dark-only:
```typescript
// In App.tsx or main.tsx
useEffect(() => {
  document.documentElement.setAttribute('data-theme', 'dark');
}, []);
```

### Pattern 5: Animated Progress Bar with Motion

**What:** Combine DaisyUI progress with Motion spring for smooth value transitions.

**When to use:** Any meter that changes over time (overskudd, needs).

**Example:**
```typescript
// Source: Motion docs + DaisyUI progress component
import { motion, useSpring, useTransform } from 'motion/react';

function OverskuddMeter({ value }: { value: number }) {
  // Spring-animated value for smooth transitions
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 30
  });

  // Transform to percentage string
  const width = useTransform(springValue, (v) => `${v}%`);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm">Overskudd</span>
        <motion.span className="text-sm">{Math.round(springValue.get())}</motion.span>
      </div>
      <div className="progress">
        <motion.div
          className="progress-bar bg-primary"
          style={{ width }}
        />
      </div>
    </div>
  );
}

// Alternative: Using DaisyUI radial-progress
function RadialOverskudd({ value }: { value: number }) {
  const springValue = useSpring(value, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="radial-progress text-primary"
      style={{ '--value': springValue.get() } as React.CSSProperties}
      role="progressbar"
    >
      {Math.round(springValue.get())}%
    </motion.div>
  );
}
```

### Anti-Patterns to Avoid

- **Forgetting `observer()`:** Components reading MobX state MUST be wrapped in `observer()` or use `mobx-react-observer` auto-wrapping. Without it, components won't re-render on state changes.

- **Dereferencing observables too early:** Pass the observable object, not primitive values extracted from it. `<Component character={character} />` not `<Component energy={character.needs.energy} />`.

- **Variable timestep for game logic:** Never use raw deltaTime for game state. Always use fixed timestep to ensure deterministic simulation.

- **Putting UI state in game stores:** Selection state, hover state, modals go in a separate `InteractionStore`, not in `CharacterStore`.

- **Direct DOM manipulation for animations:** Use Motion's declarative API. Don't mix `requestAnimationFrame` for UI animations with the game loop.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Progress bars | Custom div width manipulation | DaisyUI `progress` + Motion | Accessibility, consistent styling, spring physics |
| Number animations | Manual interpolation | Motion `useSpring` | Handles spring physics, interruptions correctly |
| Dark theme | Custom CSS variables | DaisyUI `data-theme="dark"` | 35+ tested themes, consistent palette |
| Time formatting | String concatenation | Intl.DateTimeFormat or simple template | Locale support, edge cases handled |
| Click detection | Manual event handling | React onClick + MobX actions | Proper event delegation, state management |

**Key insight:** DaisyUI provides battle-tested UI patterns. Motion provides physics-based animation. Let them handle rendering concerns while MobX handles state.

## Common Pitfalls

### Pitfall 1: MobX Observer Not Updating

**What goes wrong:** Component renders initially but never updates when state changes.

**Why it happens:** Component not wrapped with `observer()`, or observable dereferenced outside render (in parent, in useEffect dependencies).

**How to avoid:**
1. Use `mobx-react-observer` Babel plugin for automatic observer wrapping
2. Always pass observable objects, not extracted primitives
3. Verify with `console.log` in render or MobX DevTools

**Warning signs:** UI shows initial values but freezes despite state changes in DevTools.

### Pitfall 2: Game Loop Spiral of Death

**What goes wrong:** Game freezes or becomes extremely slow after tab loses focus.

**Why it happens:** After tab regains focus, accumulated time creates hundreds of simulation steps to catch up.

**How to avoid:** Cap deltaTime to a maximum (e.g., 250ms). After cap is hit, simulation runs slower but doesn't freeze.

**Warning signs:** Game stutters or freezes when switching back from another tab.

### Pitfall 3: Time Advancing When Paused

**What goes wrong:** Game time continues even when pause button pressed.

**Why it happens:** Game loop still running, just not checking pause flag before each tick.

**How to avoid:** Check `isPaused` at the START of tick handler, return early if true. Also consider stopping the animation frame entirely when paused.

**Warning signs:** Day counter increments while pause icon is shown.

### Pitfall 4: Radial Progress CSS Variables Not Reactive

**What goes wrong:** DaisyUI `radial-progress` doesn't animate smoothly.

**Why it happens:** CSS `--value` variable updates don't trigger CSS transitions automatically.

**How to avoid:** Use Motion to animate a state value, then apply that to the CSS variable on each frame. Or use a linear progress bar which animates width more naturally.

**Warning signs:** Radial progress jumps between values instead of animating.

### Pitfall 5: Character Click Not Selecting

**What goes wrong:** Clicking character doesn't show info panel.

**Why it happens:** Click handler modifying state in CharacterStore instead of InteractionStore, or missing observer on parent component.

**How to avoid:** Keep selection state in InteractionStore. Ensure the clickable element has proper event handling and the display component observes selection state.

**Warning signs:** Click registers (console log works) but UI doesn't update.

## Code Examples

### TimeDisplay Component
```typescript
// Source: DaisyUI stat component + project patterns
import { observer } from 'mobx-react-lite'; // or auto via mobx-react-observer
import { useGameStore } from '../stores/RootStore';
import { Play, Pause } from 'lucide-react';

export const TimeDisplay = observer(() => {
  const { timeStore } = useGameStore();

  return (
    <div className="stats shadow bg-base-200">
      <div className="stat">
        <div className="stat-title">Day</div>
        <div className="stat-value text-primary">{timeStore.day}</div>
        <div className="stat-desc">of 10</div>
      </div>

      <div className="stat">
        <div className="stat-title">Time</div>
        <div className="stat-value">{timeStore.formattedTime}</div>
        <div className="stat-desc capitalize">{timeStore.timeOfDay}</div>
      </div>

      <div className="stat place-items-center">
        <button
          className="btn btn-circle btn-primary"
          onClick={() => timeStore.togglePause()}
        >
          {timeStore.isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
      </div>
    </div>
  );
});
```

### MTG Color Badge
```typescript
// Source: DaisyUI badge + MTG color spec
const MTG_COLORS = {
  white: { bg: 'bg-amber-50', text: 'text-amber-900', label: 'W' },
  blue: { bg: 'bg-blue-600', text: 'text-white', label: 'U' },
  black: { bg: 'bg-gray-900', text: 'text-white', label: 'B' },
  red: { bg: 'bg-red-600', text: 'text-white', label: 'R' },
  green: { bg: 'bg-green-600', text: 'text-white', label: 'G' },
} as const;

function ColorBadge({ color, intensity }: { color: keyof typeof MTG_COLORS; intensity: number }) {
  const { bg, text, label } = MTG_COLORS[color];

  return (
    <div className={`badge ${bg} ${text} gap-1`}>
      <span className="font-bold">{label}</span>
      <span className="opacity-75">{intensity.toFixed(1)}</span>
    </div>
  );
}
```

### Character Panel (Click to View)
```typescript
// Source: DaisyUI card + observer pattern
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/RootStore';

export const CharacterPanel = observer(() => {
  const { characterStore, interactionStore } = useGameStore();
  const selectedId = interactionStore.selectedCharacterId;
  const character = selectedId ? characterStore.getCharacter(selectedId) : null;

  return (
    <AnimatePresence>
      {character && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="card bg-base-200 shadow-xl"
        >
          <div className="card-body">
            <h2 className="card-title">{character.name}</h2>

            {/* MTG Colors */}
            <div className="flex gap-2">
              <ColorBadge
                color={character.colors.primary.color}
                intensity={character.colors.primary.intensity}
              />
              {character.colors.secondary && (
                <ColorBadge
                  color={character.colors.secondary.color}
                  intensity={character.colors.secondary.intensity}
                />
              )}
            </div>

            {/* Overskudd Meter */}
            <OverskuddMeter value={character.overskudd} />

            {/* Current Activity */}
            <div className="stat-desc">
              {character.currentActivity || 'Idle'}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
```

### Main Game Component
```typescript
// Source: Project patterns + game loop hook
import { useCallback } from 'react';
import { useGameStore } from '../stores/RootStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { TimeDisplay } from './TimeDisplay';
import { CharacterPanel } from './CharacterPanel';
import { CharacterSprite } from './CharacterSprite';

export function Game() {
  const store = useGameStore();

  const handleTick = useCallback((deltaMs: number) => {
    store.tick(deltaMs);
  }, [store]);

  useGameLoop(handleTick, {
    paused: store.timeStore.isPaused,
  });

  return (
    <div className="min-h-screen bg-base-100 p-4">
      {/* Time controls at top */}
      <TimeDisplay />

      {/* Game world area */}
      <div className="relative mt-4 h-96 bg-base-200 rounded-lg">
        {store.characterStore.allCharacters.map(char => (
          <CharacterSprite
            key={char.id}
            character={char}
            onClick={() => store.interactionStore.selectCharacter(char.id)}
          />
        ))}
      </div>

      {/* Selected character panel */}
      <CharacterPanel />
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion package | `motion` package | 2024 (v11+) | Import from `motion/react` not `framer-motion` |
| `observer()` HOC wrapping | `mobx-react-observer` Babel plugin | 2023 | Automatic observer, cleaner code |
| Tailwind config.js | Tailwind CSS-first (@plugin) | Tailwind v4 (Jan 2025) | Config in CSS, 5x faster builds |
| DaisyUI v4 | DaisyUI v5 | 2025 | Tailwind 4 native support |
| setInterval game loops | requestAnimationFrame + fixed timestep | Always was best practice | Smooth 60fps, deterministic simulation |

**Deprecated/outdated:**
- `framer-motion` import path: Use `motion/react` instead
- `tailwind.config.js`: Use CSS `@plugin "daisyui"` syntax in Tailwind 4
- `observer()` manual wrapping: Use `mobx-react-observer` auto plugin

## Open Questions

1. **Optimal game speed tuning**
   - What we know: 10 game-minutes per real-second means 1 in-game hour = 6 real seconds, full 24-hour day = ~2.5 minutes
   - What's unclear: Is this too fast or slow for player experience?
   - Recommendation: Make `gameSpeed` configurable, start with 10, tune during playtesting

2. **Need decay balance**
   - What we know: Needs drive overskudd which gates activities
   - What's unclear: Exact decay rates to make ~10 days feel right
   - Recommendation: Start with visible but not overwhelming decay (0.5/sec energy), tune with exaggerated values per research notes

3. **Single-screen layout specifics**
   - What we know: Everything visible at once, no scrolling (CONTEXT.md decision)
   - What's unclear: Exact component arrangement for optimal information density
   - Recommendation: Use flexbox/grid layout, iterate during implementation

## Sources

### Primary (HIGH confidence)
- Project STACK.md - Verified stack decisions with versions
- Project ARCHITECTURE.md - MobX patterns, store structure
- DaisyUI official docs - [components/progress](https://daisyui.com/components/progress/), [components/stat](https://daisyui.com/components/stat/), [themes](https://daisyui.com/docs/themes/)
- MobX official docs - [react-integration](https://mobx.js.org/react-integration.html), [defining-data-stores](https://mobx.js.org/defining-data-stores.html)
- Glenn Fiedler "Fix Your Timestep" - [gafferongames.com](https://gafferongames.com/post/fix_your_timestep/)

### Secondary (MEDIUM confidence)
- Motion docs (partial fetch) - [motion.dev](https://motion.dev/docs/react-transitions), [useSpring](https://motion.dev/docs/react-use-spring)
- Reference project `mental-sine-waves` - GameState.ts, Characters.ts patterns

### Tertiary (LOW confidence)
- WebSearch results for game loop patterns - Multiple sources agree on fixed timestep approach

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already decided in project research, verified
- Architecture: HIGH - Based on MobX official docs + reference project
- Game loop: HIGH - Well-documented pattern (Glenn Fiedler), used in reference project
- DaisyUI components: HIGH - Official documentation verified
- Pitfalls: HIGH - Official MobX docs + common issues documented

**Research date:** 2026-01-27
**Valid until:** 60 days (stable libraries, well-documented patterns)

---

*Phase: 01-foundation*
*Research completed: 2026-01-27*
