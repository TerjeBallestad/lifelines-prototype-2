# Stack Research

**Project:** Before the Fall - Life-sim prototype
**Domain:** React-based game prototype for web
**Researched:** 2026-01-27
**Confidence:** HIGH (versions verified via npm/official sources)

## Executive Summary

The existing mental-sine-waves stack is excellent and should be carried forward. The core additions needed are: (1) a game loop mechanism, (2) animation library for juice, and (3) sound effects. I recommend **against** adding a formal ECS library - MobX observable stores already provide entity-like patterns that integrate better with React.

---

## Recommended Stack

### Core Framework (Confirmed from mental-sine-waves)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| React | ^19.2.0 | UI framework | Latest stable with improved concurrent features, React Compiler support |
| TypeScript | ~5.9.3 | Type safety | Strong typing for game state, entity definitions |
| Vite (Rolldown) | rolldown-vite@7.2.5 | Build tool | 10-30x faster than Rollup, experimental but stable enough for prototypes |

**Note:** React 19.2.x is current stable (19.2.1 as of Dec 2025). The existing ^19.2.0 constraint is correct.

### State Management (Confirmed)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| MobX | ^6.15.0 | Reactive state | Automatic dependency tracking, mutable state ideal for game entities |
| mobx-react-observer | ^1.1.0 | React integration | Auto-wraps components via Babel/SWC plugin, cleaner than manual `observer()` |

**Why MobX over Zustand for games:**
- MobX's transparent reactive programming naturally models game entities as observable objects
- Computed values perfectly express derived game state (mood from needs, relationships from interactions)
- Fine-grained reactivity means only affected UI re-renders when one entity changes
- The project already uses it - zero learning curve

### Styling (Confirmed)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Tailwind CSS | ^4.1.18 | Utility styling | CSS-first config, 5x faster builds, native CSS variables |
| DaisyUI | ^5.5.14 | Component library | v5 fully compatible with Tailwind 4, zero dependencies |
| clsx | ^2.1.1 | Class merging | Tiny, fast conditional class composition |

---

### Game Systems (NEW)

#### Game Loop

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Custom hook | N/A | Game tick | Simple `useGameLoop` with `requestAnimationFrame` - see pattern below |

**Recommendation: Build a simple custom hook, not a library.**

For a life-sim prototype, you need a **logical tick** (game time progression), not a physics-accurate frame loop. Libraries like `@webgamelibs/ticker` or `react-game-kit` are overkill and add complexity.

```typescript
// Suggested pattern: useGameLoop.ts
import { useEffect, useRef } from 'react';

export function useGameLoop(
  onTick: (deltaMs: number) => void,
  targetFps: number = 60,
  paused: boolean = false
) {
  const lastTimeRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);
  const tickInterval = 1000 / targetFps;

  useEffect(() => {
    if (paused) return;

    let animationId: number;

    const loop = (currentTime: number) => {
      const deltaMs = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatorRef.current += deltaMs;

      // Fixed timestep for deterministic simulation
      while (accumulatorRef.current >= tickInterval) {
        onTick(tickInterval);
        accumulatorRef.current -= tickInterval;
      }

      animationId = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [onTick, targetFps, paused, tickInterval]);
}
```

**Why fixed timestep:** Deterministic simulation regardless of frame rate. A player on 120Hz monitor gets same game behavior as 60Hz.

#### Entity/Component Pattern

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| MobX classes | N/A | Entity modeling | Observable classes ARE your entities |

**Recommendation: Use MobX observable classes as entities - NO dedicated ECS library.**

Formal ECS (miniplex, ape-ecs, ecsy) solves cache-locality and system scheduling for high-entity-count games. For a 2-character prototype, this is massive over-engineering.

MobX observable classes naturally model game entities:

```typescript
// Character as MobX entity
import { makeAutoObservable, computed } from 'mobx';

class Character {
  name: string;
  // MTG color weights
  colors = { white: 0, blue: 0, black: 0, red: 0, green: 0 };
  // Needs (0-100)
  needs = { energy: 100, social: 100, purpose: 100 };
  // Current activity
  activity: Activity | null = null;

  constructor(name: string, colorProfile: ColorProfile) {
    this.name = name;
    this.colors = colorProfile;
    makeAutoObservable(this);
  }

  // Computed: dominant color affects behavior
  get dominantColor() {
    return Object.entries(this.colors)
      .sort(([,a], [,b]) => b - a)[0][0];
  }

  // Computed: mood from needs
  get mood(): Mood {
    const avg = (this.needs.energy + this.needs.social + this.needs.purpose) / 3;
    if (avg > 70) return 'content';
    if (avg > 40) return 'neutral';
    return 'stressed';
  }

  tick(deltaMs: number) {
    // Decay needs over time
    const decay = deltaMs / 1000 * 0.1; // 0.1 per second
    this.needs.energy = Math.max(0, this.needs.energy - decay);
    // ... activity effects
  }
}
```

**Benefits over ECS:**
- React components just observe MobX - no query systems needed
- Computed values replace "systems" that derive state
- TypeScript gives full type safety on entity shape
- Debugging: just inspect objects in DevTools

#### Time Simulation

| Approach | Purpose |
|----------|---------|
| Game clock store | Track in-game time (day/hour), time scale |
| Event scheduler | Queue future events (quest triggers, crises) |

```typescript
// Suggested: GameClock store
class GameClock {
  day = 1;
  hour = 8; // Start at 8 AM
  timeScale = 1; // 1 = normal, 0 = paused, 2 = fast-forward

  constructor() {
    makeAutoObservable(this);
  }

  tick(deltaMs: number) {
    const gameMinutes = (deltaMs / 1000) * this.timeScale * 10; // 10 game-min per real-sec
    this.hour += gameMinutes / 60;
    while (this.hour >= 24) {
      this.hour -= 24;
      this.day += 1;
    }
  }

  get timeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (this.hour < 12) return 'morning';
    if (this.hour < 17) return 'afternoon';
    if (this.hour < 21) return 'evening';
    return 'night';
  }
}
```

---

### UI/Feedback ("Juice") (NEW)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| motion | ^12.27.0 | Animations | Rebranded Framer Motion, physics-based springs, gesture support |
| use-sound | ^5.0.0 | Sound effects | Tiny (~1kb), Howler.js backend, audio sprites for games |
| canvas-confetti | ^1.9.3 | Celebrations | Lightweight particle bursts, no React wrapper needed |

#### Motion (formerly Framer Motion)

**Install:** `npm install motion`

Motion provides the "juice" for satisfying feedback:

```typescript
import { motion, useSpring } from 'motion/react';

// Bouncy button press
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Do Activity
</motion.button>

// Number counter with spring physics
function AnimatedStat({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  return <motion.span>{spring}</motion.span>;
}

// Layout animations for list changes
<motion.div layout layoutId={character.id}>
  {character.name}
</motion.div>
```

**Key features for game feel:**
- Spring physics (not bezier curves) for natural motion
- `layout` prop for automatic FLIP animations
- `AnimatePresence` for enter/exit animations
- Gesture recognition (drag, hover, tap)

#### use-sound

**Install:** `npm install use-sound && npm install -D @types/howler`

```typescript
import useSound from 'use-sound';

// Basic usage
const [playClick] = useSound('/sounds/click.mp3');
const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });

// With options for game feedback
const [playPop] = useSound('/sounds/pop.mp3', {
  playbackRate: 1.2,  // Slightly faster = punchier
  interrupt: true,    // Allow rapid re-triggering
});
```

**Audio sprite pattern for games:**
```typescript
// Single file with multiple sounds
const [play] = useSound('/sounds/ui-sprites.mp3', {
  sprite: {
    click: [0, 100],      // start ms, duration ms
    success: [100, 500],
    error: [600, 300],
    levelUp: [900, 1000],
  }
});

// Play specific sound
play({ id: 'success' });
```

#### canvas-confetti

**Install:** `npm install canvas-confetti`

No React wrapper needed - call imperatively for celebrations:

```typescript
import confetti from 'canvas-confetti';

function onQuestComplete() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// MTG-themed: color-specific confetti
function celebrateColor(color: 'white' | 'blue' | 'black' | 'red' | 'green') {
  const colorMap = {
    white: ['#F8F6F0', '#FFFEF5'],
    blue: ['#0E68AB', '#4A90D9'],
    black: ['#1A1A1A', '#4A4A4A'],
    red: ['#D32029', '#F05A28'],
    green: ['#00733E', '#4CB963'],
  };

  confetti({
    colors: colorMap[color],
    particleCount: 50,
    spread: 60,
  });
}
```

#### Screen Shake (CSS-only pattern)

No library needed - CSS animation with Motion:

```typescript
// Shake effect for crisis events
const shakeVariants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

<motion.div
  variants={shakeVariants}
  animate={isInCrisis ? 'shake' : undefined}
>
  {/* Game container */}
</motion.div>
```

---

### Development Tools

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| @vitejs/plugin-react | ^5.1.1 | React transform | Fast Refresh, JSX transform |
| babel-plugin-react-compiler | ^1.0.0 | Auto-optimization | React 19 compiler for automatic memoization |
| ESLint | ^9.39.1 | Linting | Already configured in mental-sine-waves |
| Prettier | ^3.7.4 | Formatting | With tailwindcss plugin for class sorting |
| lucide-react | ^0.562.0 | Icons | Already in use, tree-shakeable |

#### Debugging Game State

MobX DevTools extension works in browser. For game-specific debugging:

```typescript
// Debug panel component (dev only)
if (import.meta.env.DEV) {
  // Expose game state to window for console debugging
  (window as any).__GAME__ = {
    clock: gameClockStore,
    characters: characterStore,
  };
}
```

---

## Complete Installation

```bash
# From mental-sine-waves base, add game-specific packages:

# Animation & Juice
npm install motion use-sound canvas-confetti

# TypeScript types
npm install -D @types/howler
```

**Full package.json dependencies (merged):**

```json
{
  "dependencies": {
    "canvas-confetti": "^1.9.3",
    "clsx": "^2.1.1",
    "lucide-react": "^0.562.0",
    "mobx": "^6.15.0",
    "mobx-react-observer": "^1.1.0",
    "motion": "^12.27.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "use-sound": "^5.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.1.18",
    "@types/howler": "^2.2.11",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "babel-plugin-react-compiler": "^1.0.0",
    "daisyui": "^5.5.14",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "prettier": "^3.7.4",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "npm:rolldown-vite@7.2.5"
  },
  "resolutions": {
    "vite": "npm:rolldown-vite@7.2.5"
  }
}
```

---

## Alternatives Considered

### State Management

| Considered | Why Not |
|------------|---------|
| Zustand | Simpler API but less automatic reactivity; MobX computed values better for derived game state |
| Redux Toolkit | Overkill for prototype, more boilerplate, less natural for mutable game entities |
| Jotai | Atomic model doesn't fit entity-centric game design as well as MobX classes |

### Entity Systems

| Considered | Why Not |
|------------|---------|
| miniplex | Last release 2+ years ago, maintenance inactive; overkill for 2-character game |
| ape-ecs | Performance-focused for high entity counts we don't need; adds complexity |
| ecsy | Experimental, "highly experimental" per docs; framework opinions don't fit React patterns |
| bitECS | Extreme performance focus with typed arrays; completely wrong tool for UI-heavy prototype |

**Conclusion:** MobX observable classes provide 90% of ECS benefits (composition, reactive updates, computed derivations) with 10% of the complexity.

### Animation

| Considered | Why Not |
|------------|---------|
| React Spring | Similar to Motion but smaller community, less documentation |
| GSAP | More powerful but imperative API; overkill for UI animations, licensing concerns for games |
| CSS animations only | Lacks spring physics, harder to coordinate complex sequences |
| Rive/Lottie | Great for pre-designed animations, but we need programmatic/dynamic feedback |

### Game Loop

| Considered | Why Not |
|------------|---------|
| @webgamelibs/ticker | Adds dependency for ~20 lines of code we can write ourselves |
| react-game-kit | Unmaintained (last update 3+ years), tied to matter-js physics we don't need |
| pixi.js / three.js | 2D/3D rendering engines - massive overkill for DOM-based life sim |

---

## Anti-Recommendations

### DO NOT Use

| Technology | Why Avoid |
|------------|-----------|
| Redux | Boilerplate overhead, immutability ceremonies slow game dev iteration |
| Any ECS library | Over-engineering for 2 characters; MobX classes are simpler and sufficient |
| react-game-kit | Abandoned, pulls in physics engine you don't need |
| Phaser/PixiJS | Full game engines - you want React UI, not canvas rendering |
| CSS-only animations | Lack physics-based springs that create satisfying "juice" |
| mobx-react (over mobx-react-observer) | Manual `observer()` wrapping on every component is tedious |

### Patterns to Avoid

| Anti-Pattern | Why | Instead |
|--------------|-----|---------|
| Global animation timers | Creates sync issues | Per-component animation state via Motion |
| Polling MobX state in loops | Defeats reactivity | Let MobX computed values derive state |
| Sound loading on mount | Delays interaction | Preload critical sounds, lazy-load others |
| requestAnimationFrame for UI updates | React handles this | Use rAF only for game simulation tick |

---

## Key Architecture Decisions

1. **MobX as pseudo-ECS**: Observable classes = entities, computed = derived state, reactions = side effects
2. **Fixed timestep simulation**: Deterministic game logic independent of render framerate
3. **Motion for all animations**: Consistent spring physics across UI
4. **Imperative juice**: Sound/confetti called imperatively on events, not declaratively rendered
5. **Prototype-first**: Minimal dependencies, easy to understand, fast to iterate

---

## Sources

### Versions Verified
- [React Releases](https://github.com/facebook/react/releases) - React 19.2.1 current
- [MobX npm](https://www.npmjs.com/package/mobx) - MobX 6.15.0 current
- [Vite Releases](https://vite.dev/releases) - Vite 7.3.1 current, rolldown-vite experimental
- [Tailwind CSS Blog](https://tailwindcss.com/blog/tailwindcss-v4) - v4 released Jan 2025
- [DaisyUI v5](https://daisyui.com/docs/v5/) - Tailwind 4 compatible
- [Motion npm](https://www.npmjs.com/package/framer-motion) - v12.27.0 current
- [use-sound npm](https://www.npmjs.com/package/use-sound) - v5.0.0 current

### Patterns Referenced
- [Fix Your Timestep](https://gafferongames.com/post/fix_your_timestep/) - Game loop fundamentals
- [MobX React Integration](https://mobx.js.org/react-integration.html) - Official patterns
- [Motion Documentation](https://motion.dev/docs) - Animation API

---

*Researched: 2026-01-27*
