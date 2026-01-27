# Phase 2: Autonomous Behavior - Research

**Researched:** 2026-01-27
**Domain:** Utility AI, character autonomy, activity selection, state machines, animation
**Confidence:** HIGH

## Summary

Phase 2 implements autonomous character behavior using a Utility AI system inspired by The Sims. Characters evaluate available activities based on their MTG color affinities and current needs, then select activities with weighted randomness to create emergent, observable personality differences. The core challenge is designing a color affinity formula that produces visibly different behavior between Elling (Blue) and Mother (White/Green).

The implementation requires three interlocking systems: (1) an activity scoring system using Utility AI principles, (2) a character state machine for idle/walking/performing transitions, and (3) Motion-based animations for movement and thought bubbles that visualize the decision process.

The CONTEXT.md decisions from `/gsd:discuss-phase` lock in several key choices: thought bubbles show the decision process (not just outcomes), activities have spatial locations requiring character movement, and personality differences should accumulate over time rather than being immediately obvious.

**Primary recommendation:** Implement a simple Utility AI scorer where activity utility = (color affinity match * 0.6) + (need satisfaction * 0.4), then select from top-scoring activities with weighted randomness. Characters should deliberate visibly via thought bubbles before acting.

## Standard Stack

Already established in Phase 1. Phase 2 adds patterns, not packages.

### Core (from Phase 1)
| Library | Version | Purpose | Phase 2 Role |
|---------|---------|---------|--------------|
| MobX | ^6.15.0 | State management | Activity scores as computed values |
| mobx-react-lite | ^4.1.0 | React integration | Observer components for UI |
| motion | ^12.0.0 | Animations | Character movement, thought bubbles |
| React | ^19.0.0 | UI framework | Component rendering |

### Phase 2 Specific Usage

| Pattern | Use Case |
|---------|----------|
| MobX `computed` | Activity utility scores, available activities list |
| MobX `action` | State transitions (idle -> walking -> performing) |
| Motion `animate` | Character x/y position movement |
| Motion `AnimatePresence` | Thought bubble enter/exit |
| Motion `useSpring` | Smooth position interpolation |

**Installation:**
```bash
# No new packages needed - Phase 1 stack is sufficient
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)
```
src/
├── stores/
│   ├── ActivityStore.ts      # NEW: Activity definitions + decision logic
│   └── CharacterStore.ts     # EXTENDED: State machine, position, currentActivity
├── data/
│   └── activities.ts         # NEW: Static activity definitions with color affinities
├── components/
│   ├── CharacterSprite.tsx   # EXTENDED: Position, movement animation
│   ├── ThoughtBubble.tsx     # NEW: Decision visualization
│   └── ActivityLocation.tsx  # NEW: Spatial activity targets
├── systems/
│   └── UtilityAI.ts          # NEW: Activity scoring logic
└── types/
    └── game.ts               # EXTENDED: Activity, CharacterState types
```

### Pattern 1: Utility AI Activity Scoring

**What:** Score each activity based on character's color affinity match and need satisfaction, then select with weighted randomness.

**When to use:** Every decision cycle when character is idle.

**Example:**
```typescript
// Source: The Sims utility AI design + game AI literature
interface ActivityScore {
  activity: Activity;
  utility: number;      // 0-1 normalized
  colorMatch: number;   // How well activity colors match character
  needSatisfaction: number; // How much activity helps current needs
}

function scoreActivity(character: Character, activity: Activity): ActivityScore {
  // Color affinity score: how well activity's colors match character's
  const colorMatch = calculateColorAffinity(character.colors, activity.colorAffinities);

  // Need satisfaction: does this activity help current low needs?
  const needSatisfaction = calculateNeedSatisfaction(character.needs, activity.effects);

  // Weighted combination - color personality dominates (60%), needs secondary (40%)
  // This ensures Elling gravitates to Blue activities even when needs are equal
  const utility = (colorMatch * 0.6) + (needSatisfaction * 0.4);

  return { activity, utility, colorMatch, needSatisfaction };
}

function calculateColorAffinity(
  characterColors: MTGColorProfile,
  activityColors: Partial<Record<MTGColor, number>>
): number {
  let matchScore = 0;
  let totalWeight = 0;

  // For each color the activity has affinity for
  for (const [color, activityAffinity] of Object.entries(activityColors)) {
    const characterAffinity = getCharacterColorIntensity(characterColors, color as MTGColor);
    // Multiply: high character color + high activity color = high match
    matchScore += characterAffinity * activityAffinity;
    totalWeight += activityAffinity;
  }

  // Normalize to 0-1
  return totalWeight > 0 ? matchScore / totalWeight : 0.5; // Neutral if no color affinity
}
```

### Pattern 2: Character State Machine

**What:** Simple finite state machine for character behavior states.

**When to use:** Track whether character is idle, deciding, walking, or performing activity.

**Example:**
```typescript
// Source: Game Programming Patterns + TypeScript state machine patterns
type CharacterState = 'idle' | 'deciding' | 'walking' | 'performing';

class Character {
  state: CharacterState = 'idle';
  currentActivity: Activity | null = null;
  targetPosition: { x: number; y: number } | null = null;
  activityProgress: number = 0; // 0-1

  // Decision timing (from CONTEXT.md: Elling deliberates longer)
  decisionDuration: number; // ms - varies by personality
  decisionStartTime: number = 0;

  constructor(data: CharacterData, characterStore: CharacterStore) {
    // ...existing constructor
    // Elling (Blue) deliberates longer, Mother (White) decides quickly
    this.decisionDuration = data.colors.primary.color === 'blue' ? 2000 : 800;
    makeAutoObservable(this);
  }

  // State transitions as MobX actions
  startDeciding(scores: ActivityScore[]): void {
    this.state = 'deciding';
    this.pendingScores = scores;
    this.decisionStartTime = Date.now();
  }

  finishDeciding(): Activity {
    const selected = selectWeightedRandom(this.pendingScores);
    this.state = 'walking';
    this.currentActivity = selected;
    this.targetPosition = selected.location;
    return selected;
  }

  arriveAtLocation(): void {
    this.state = 'performing';
    this.activityProgress = 0;
  }

  finishActivity(): void {
    this.state = 'idle';
    this.currentActivity = null;
    this.activityProgress = 0;
  }
}
```

### Pattern 3: Weighted Random Selection

**What:** Select from top-scoring activities with probability proportional to utility score.

**When to use:** Final activity selection after scoring all candidates.

**Example:**
```typescript
// Source: The Sims design (pick from top scorers, not always #1)
function selectWeightedRandom(scores: ActivityScore[]): Activity {
  // Filter to top 3 (or within 20% of best score)
  const sorted = [...scores].sort((a, b) => b.utility - a.utility);
  const threshold = sorted[0].utility * 0.8; // Within 20% of best
  const candidates = sorted.filter(s => s.utility >= threshold).slice(0, 3);

  // Weighted random selection
  const totalWeight = candidates.reduce((sum, s) => sum + s.utility, 0);
  let random = Math.random() * totalWeight;

  for (const candidate of candidates) {
    random -= candidate.utility;
    if (random <= 0) {
      return candidate.activity;
    }
  }

  return candidates[0].activity; // Fallback
}
```

### Pattern 4: Overskudd-Based Refusal

**What:** Characters with low overskudd refuse activities and seek comfort behaviors.

**When to use:** Before activity selection, check if character should refuse.

**Example:**
```typescript
// Source: CONTEXT.md decision - gradual reluctance 40-20, always refuse below 20
function shouldRefuseActivity(character: Character): boolean {
  const overskudd = character.overskudd;

  if (overskudd < 20) {
    return true; // Always refuse below 20
  }

  if (overskudd < 40) {
    // 20-40 range: probability of refusal scales linearly
    // At 20: 100% refuse, at 40: 0% refuse
    const refusalChance = (40 - overskudd) / 20;
    return Math.random() < refusalChance;
  }

  return false; // Above 40: never refuse
}

function getComfortBehavior(character: Character): Activity {
  // CONTEXT.md: Elling stares out window, Mother sits with hands folded
  if (character.id === 'elling') {
    return ACTIVITIES.find(a => a.id === 'stare_window')!;
  } else {
    return ACTIVITIES.find(a => a.id === 'sit_rest')!;
  }
}
```

### Pattern 5: Motion-Animated Character Movement

**What:** Smooth position animation as character walks to activity location.

**When to use:** When character state is 'walking'.

**Example:**
```typescript
// Source: Motion docs + project pattern from OverskuddMeter
import { motion, useSpring, useTransform } from 'motion/react';

interface CharacterSpriteProps {
  character: Character;
  // ...other props
}

export const CharacterSprite = observer(function CharacterSprite({
  character,
}: CharacterSpriteProps) {
  // Spring-animated position for smooth movement
  const springX = useSpring(character.position.x, { stiffness: 50, damping: 20 });
  const springY = useSpring(character.position.y, { stiffness: 50, damping: 20 });

  // Update springs when position changes
  useEffect(() => {
    springX.set(character.position.x);
    springY.set(character.position.y);
  }, [character.position.x, character.position.y, springX, springY]);

  return (
    <motion.div
      className="absolute"
      style={{ x: springX, y: springY }}
    >
      {/* Character visual */}
      <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          {character.name.charAt(0)}
        </div>
      </div>

      {/* Thought bubble when deciding */}
      <AnimatePresence>
        {character.state === 'deciding' && (
          <ThoughtBubble
            scores={character.pendingScores}
            duration={character.decisionDuration}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});
```

### Pattern 6: Thought Bubble Decision Visualization

**What:** Comic-style thought bubble showing competing activity options, then settling on winner.

**When to use:** When character is in 'deciding' state.

**Example:**
```typescript
// Source: CONTEXT.md decision - bubbles show decision process, winner gets color pulse
import { motion, AnimatePresence } from 'motion/react';

interface ThoughtBubbleProps {
  scores: ActivityScore[];
  duration: number; // How long to show deliberation
}

export function ThoughtBubble({ scores, duration }: ThoughtBubbleProps) {
  const [showWinner, setShowWinner] = useState(false);
  const topScores = scores.slice(0, 3); // Show top 3 candidates

  useEffect(() => {
    // After deliberation time, highlight winner
    const timer = setTimeout(() => setShowWinner(true), duration * 0.8);
    return () => clearTimeout(timer);
  }, [duration]);

  const winner = topScores[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: -40 }}
      exit={{ opacity: 0, scale: 0.5, y: -10 }}
      className="absolute -top-12 left-1/2 -translate-x-1/2"
    >
      {/* Bubble shape with tail */}
      <div className="bg-base-100 rounded-2xl p-2 shadow-lg relative">
        <div className="flex gap-1">
          {topScores.map((score, i) => (
            <motion.div
              key={score.activity.id}
              animate={showWinner && score === winner ? {
                scale: [1, 1.2, 1],
                opacity: 1,
              } : {
                opacity: showWinner ? 0.3 : 1,
              }}
              className="p-1 rounded text-xs"
              style={{
                // Faint color hint of activity's color affinity
                backgroundColor: showWinner && score === winner
                  ? getActivityColor(score.activity) + '30' // 30 = low opacity hex
                  : undefined
              }}
            >
              {score.activity.icon || score.activity.name.charAt(0)}
            </motion.div>
          ))}
        </div>

        {/* Bubble tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
          border-l-8 border-r-8 border-t-8
          border-l-transparent border-r-transparent border-t-base-100" />
      </div>
    </motion.div>
  );
}
```

### Anti-Patterns to Avoid

- **Always picking highest score:** Creates robotic, predictable behavior. Use weighted random from top candidates.

- **Color affinity as only factor:** Characters should still respond to needs. Balance color (personality) with needs (urgency).

- **Instant state transitions:** Characters should visibly move and deliberate. Abrupt teleportation breaks immersion.

- **Hardcoded activity selection:** Put color affinities in data, not code. Makes tuning easier.

- **Forgetting MobX observer:** All components rendering character state must be wrapped in `observer()`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Position interpolation | Manual lerp in game loop | Motion `useSpring` | Handles interruptions, spring physics |
| Enter/exit animations | Manual opacity tweening | Motion `AnimatePresence` | Proper lifecycle management |
| Random selection | Naive Math.random | Weighted random with cumulative sums | Proper probability distribution |
| State machine | Ad-hoc boolean flags | Explicit state enum + transitions | Impossible states become impossible |
| Timer management | setInterval | setTimeout with cleanup / game time | Cleaner, no memory leaks |

**Key insight:** Motion handles the "juice" of animations. MobX handles the "truth" of state. The game loop handles the "tick" of time. Don't mix these concerns.

## Common Pitfalls

### Pitfall 1: Decision Loop - Character Never Stops Deciding

**What goes wrong:** Character continuously evaluates activities every tick, creating flickering thought bubbles.

**Why it happens:** No cooldown between decisions, or state machine doesn't enforce minimum time in 'deciding' state.

**How to avoid:**
- Enforce minimum decision duration (CONTEXT.md: Elling 2s, Mother 0.8s)
- Only start new decision when state is 'idle' AND idle cooldown elapsed
- Clear pending scores after selection

**Warning signs:** Thought bubble flickers rapidly, character never commits to activity.

### Pitfall 2: Character Stuck in Walking State

**What goes wrong:** Character starts walking but never arrives at destination.

**Why it happens:** Position check uses floating point equality, or target position doesn't match actual activity location.

**How to avoid:**
- Use distance threshold (e.g., < 5 pixels) not exact equality
- Verify activity locations are valid before walking
- Add timeout: if walking > 10 seconds, force arrival

**Warning signs:** Character walks forever in one direction.

### Pitfall 3: Activities Have No Visible Difference

**What goes wrong:** Both characters pick same activities, player can't see personality.

**Why it happens:** Color affinity weights too low, or need satisfaction dominates formula.

**How to avoid:**
- Weight color affinity heavily (60%+)
- Exaggerate color values: Elling Blue 1.0, not 0.7
- Use activities with strong single-color affinities (Reading = Blue 0.9)
- Playtest: watch 5 minutes, can you predict which character does what?

**Warning signs:** After 5 minutes, both characters have similar activity histories.

### Pitfall 4: Overskudd Refusal Feels Broken

**What goes wrong:** Characters refuse activities but don't show why, or refusal feels random.

**Why it happens:** No visual feedback for low overskudd, or refusal probability math is wrong.

**How to avoid:**
- Show visual tired state (CONTEXT.md: slumped posture, slower movement)
- Occasionally show dialogue ("I need to rest...")
- Make refusal probability deterministic at thresholds (< 20 = always, > 40 = never)

**Warning signs:** Player confused why character won't do activity.

### Pitfall 5: MobX Computed Values Recalculating Excessively

**What goes wrong:** Activity scores recalculate every tick, causing performance issues.

**Why it happens:** Computed depends on something that changes every tick (like game time).

**How to avoid:**
- Compute scores only when entering 'deciding' state, store result
- Use `reaction()` to trigger recomputation only when relevant state changes
- Don't make utility score a `get computed` - make it a stored value

**Warning signs:** Dev tools show repeated computed recalculations, frame drops.

## Code Examples

### Activity Definition Data

```typescript
// src/data/activities.ts
export interface Activity {
  id: string;
  name: string;
  icon?: string;
  colorAffinities: Partial<Record<MTGColor, number>>; // 0-1
  location: { x: number; y: number }; // Spatial position
  duration: number; // Game hours
  effects: {
    energy?: number;   // Positive = restore, negative = consume
    social?: number;
    purpose?: number;
  };
  isComfortBehavior?: boolean; // For low-overskudd fallback
}

export const ACTIVITIES: Activity[] = [
  // Blue-aligned (Elling prefers)
  {
    id: 'reading',
    name: 'Read Book',
    colorAffinities: { blue: 0.9 },
    location: { x: 100, y: 150 }, // Desk area
    duration: 1,
    effects: { energy: -5, purpose: 15 },
  },
  {
    id: 'thinking',
    name: 'Deep Thought',
    colorAffinities: { blue: 0.8 },
    location: { x: 200, y: 100 }, // Window area
    duration: 0.5,
    effects: { energy: -3, purpose: 10 },
  },

  // White/Green-aligned (Mother prefers)
  {
    id: 'cooking',
    name: 'Cook Meal',
    colorAffinities: { white: 0.6, green: 0.5 },
    location: { x: 300, y: 200 }, // Kitchen
    duration: 1,
    effects: { energy: -10, purpose: 20 },
  },
  {
    id: 'cleaning',
    name: 'Tidy Up',
    colorAffinities: { white: 0.8 },
    location: { x: 250, y: 150 }, // Living area
    duration: 0.5,
    effects: { energy: -8, purpose: 10 },
  },
  {
    id: 'check_elling',
    name: 'Check on Elling',
    colorAffinities: { white: 0.7, green: 0.3 },
    location: { x: 100, y: 150 }, // Near Elling
    duration: 0.25,
    effects: { social: 5, purpose: 5 },
  },

  // Neutral activities
  {
    id: 'watch_tv',
    name: 'Watch TV',
    colorAffinities: {}, // No strong affinity
    location: { x: 200, y: 180 },
    duration: 1,
    effects: { energy: 5, purpose: -5 },
  },
  {
    id: 'phone',
    name: 'Use Phone',
    colorAffinities: {},
    location: { x: 150, y: 150 },
    duration: 0.5,
    effects: { social: 10, energy: -3 },
  },
  {
    id: 'rest',
    name: 'Rest',
    colorAffinities: { green: 0.4 },
    location: { x: 180, y: 200 },
    duration: 1,
    effects: { energy: 20 },
  },

  // Comfort behaviors (for low overskudd)
  {
    id: 'stare_window',
    name: 'Stare Out Window',
    colorAffinities: { blue: 0.5 },
    location: { x: 200, y: 100 },
    duration: 0.5,
    effects: { energy: 3 },
    isComfortBehavior: true,
  },
  {
    id: 'sit_rest',
    name: 'Sit Quietly',
    colorAffinities: { white: 0.3 },
    location: { x: 180, y: 200 },
    duration: 0.5,
    effects: { energy: 5 },
    isComfortBehavior: true,
  },
];
```

### Utility AI Scorer

```typescript
// src/systems/UtilityAI.ts
import type { Character } from '../stores/CharacterStore';
import type { Activity, MTGColor } from '../types/game';

export interface ActivityScore {
  activity: Activity;
  utility: number;
  colorMatch: number;
  needSatisfaction: number;
}

/**
 * Calculate how well an activity matches a character's color profile
 */
function calculateColorAffinity(
  characterColors: MTGColorProfile,
  activityColors: Partial<Record<MTGColor, number>>
): number {
  const colorEntries = Object.entries(activityColors) as [MTGColor, number][];

  if (colorEntries.length === 0) {
    return 0.5; // Neutral for activities with no color affinity
  }

  let matchScore = 0;
  let totalWeight = 0;

  for (const [color, activityAffinity] of colorEntries) {
    // Get character's intensity for this color
    let characterIntensity = 0;
    if (characterColors.primary.color === color) {
      characterIntensity = characterColors.primary.intensity;
    } else if (characterColors.secondary?.color === color) {
      characterIntensity = characterColors.secondary.intensity;
    }

    // Multiply intensities: high character + high activity = high match
    matchScore += characterIntensity * activityAffinity;
    totalWeight += activityAffinity;
  }

  return totalWeight > 0 ? matchScore / totalWeight : 0.5;
}

/**
 * Calculate how much an activity helps the character's current needs
 */
function calculateNeedSatisfaction(
  needs: Needs,
  effects: Activity['effects']
): number {
  let satisfaction = 0;
  let count = 0;

  // Higher satisfaction when need is low AND activity restores it
  if (effects.energy !== undefined && effects.energy > 0) {
    // How badly do we need energy? (inverted: low energy = high need)
    const energyNeed = 1 - (needs.energy / 100);
    satisfaction += energyNeed * (effects.energy / 20); // Normalize effect
    count++;
  }

  if (effects.social !== undefined && effects.social > 0) {
    const socialNeed = 1 - (needs.social / 100);
    satisfaction += socialNeed * (effects.social / 10);
    count++;
  }

  if (effects.purpose !== undefined && effects.purpose > 0) {
    const purposeNeed = 1 - (needs.purpose / 100);
    satisfaction += purposeNeed * (effects.purpose / 20);
    count++;
  }

  return count > 0 ? satisfaction / count : 0.5;
}

/**
 * Score all available activities for a character
 */
export function scoreActivities(
  character: Character,
  activities: Activity[]
): ActivityScore[] {
  return activities
    .filter(a => !a.isComfortBehavior) // Exclude comfort behaviors from normal selection
    .map(activity => {
      const colorMatch = calculateColorAffinity(character.colors, activity.colorAffinities);
      const needSatisfaction = calculateNeedSatisfaction(character.needs, activity.effects);

      // Weight: 60% color (personality), 40% needs (urgency)
      const utility = (colorMatch * 0.6) + (needSatisfaction * 0.4);

      return { activity, utility, colorMatch, needSatisfaction };
    })
    .sort((a, b) => b.utility - a.utility);
}

/**
 * Select activity using weighted random from top candidates
 */
export function selectActivity(scores: ActivityScore[]): Activity {
  // Take top 3 candidates (or all within 80% of best)
  const threshold = scores[0].utility * 0.8;
  const candidates = scores.filter(s => s.utility >= threshold).slice(0, 3);

  // Weighted random selection
  const totalWeight = candidates.reduce((sum, s) => sum + s.utility, 0);
  let random = Math.random() * totalWeight;

  for (const candidate of candidates) {
    random -= candidate.utility;
    if (random <= 0) {
      return candidate.activity;
    }
  }

  return candidates[0].activity;
}
```

### Extended Character Store

```typescript
// src/stores/CharacterStore.ts (additions for Phase 2)
import { makeAutoObservable, runInAction } from 'mobx';
import { scoreActivities, selectActivity, ActivityScore } from '../systems/UtilityAI';
import { ACTIVITIES } from '../data/activities';

type CharacterState = 'idle' | 'deciding' | 'walking' | 'performing';

export class Character {
  // ... existing fields from Phase 1 ...

  // Phase 2 additions
  state: CharacterState = 'idle';
  position: { x: number; y: number } = { x: 100, y: 150 };
  currentActivity: Activity | null = null;
  activityProgress: number = 0;
  pendingScores: ActivityScore[] = [];
  decisionDuration: number;
  idleCooldown: number = 0; // Prevents immediate re-decision

  constructor(data: CharacterData, characterStore: CharacterStore) {
    // ... existing setup ...

    // Set decision duration based on personality (CONTEXT.md)
    this.decisionDuration = data.colors.primary.color === 'blue' ? 2000 : 800;
    this.position = data.initialPosition || { x: 100, y: 150 };

    makeAutoObservable(this, {
      id: false,
      name: false,
      colors: false,
      characterStore: false,
      decisionDuration: false,
    }, { autoBind: true });
  }

  /**
   * Should character refuse new activities due to low overskudd?
   */
  get shouldRefuse(): boolean {
    if (this.overskudd < 20) return true;
    if (this.overskudd < 40) {
      const refusalChance = (40 - this.overskudd) / 20;
      return Math.random() < refusalChance;
    }
    return false;
  }

  /**
   * Get comfort behavior for this character
   */
  get comfortActivity(): Activity {
    return ACTIVITIES.find(a =>
      a.isComfortBehavior &&
      (this.id === 'elling' ? a.id === 'stare_window' : a.id === 'sit_rest')
    )!;
  }

  /**
   * Update method called each game tick
   */
  update(gameMinutes: number): void {
    // Update needs (existing logic)
    this.updateNeeds(gameMinutes);

    // State machine logic
    switch (this.state) {
      case 'idle':
        this.idleCooldown -= gameMinutes;
        if (this.idleCooldown <= 0) {
          this.startDecision();
        }
        break;

      case 'deciding':
        // Decision handled by ThoughtBubble component timing
        break;

      case 'walking':
        this.updateWalking(gameMinutes);
        break;

      case 'performing':
        this.updatePerforming(gameMinutes);
        break;
    }
  }

  startDecision(): void {
    // Check for refusal
    if (this.shouldRefuse) {
      this.state = 'walking';
      this.currentActivity = this.comfortActivity;
      return;
    }

    // Score all activities
    const scores = scoreActivities(this, ACTIVITIES);

    runInAction(() => {
      this.pendingScores = scores.slice(0, 3); // Top 3 for display
      this.state = 'deciding';
    });

    // After decision duration, complete the decision
    setTimeout(() => {
      this.completeDecision();
    }, this.decisionDuration);
  }

  completeDecision(): void {
    if (this.state !== 'deciding') return;

    const selected = selectActivity(this.pendingScores);

    runInAction(() => {
      this.currentActivity = selected;
      this.state = 'walking';
      this.pendingScores = [];
    });
  }

  updateWalking(gameMinutes: number): void {
    if (!this.currentActivity) {
      this.state = 'idle';
      return;
    }

    const target = this.currentActivity.location;
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      // Arrived
      runInAction(() => {
        this.position = { ...target };
        this.state = 'performing';
        this.activityProgress = 0;
      });
      return;
    }

    // Move toward target (speed varies by personality)
    const baseSpeed = this.colors.primary.color === 'blue' ? 30 : 50; // pixels per game-minute
    const speed = (this.overskudd / 100) * baseSpeed; // Slower when tired
    const moveDistance = speed * gameMinutes;

    runInAction(() => {
      this.position.x += (dx / distance) * Math.min(moveDistance, distance);
      this.position.y += (dy / distance) * Math.min(moveDistance, distance);
    });
  }

  updatePerforming(gameMinutes: number): void {
    if (!this.currentActivity) {
      this.state = 'idle';
      return;
    }

    // Progress activity
    const progressRate = 1 / (this.currentActivity.duration * 60); // per game-minute
    this.activityProgress += progressRate * gameMinutes;

    if (this.activityProgress >= 1) {
      this.completeActivity();
    }
  }

  completeActivity(): void {
    if (!this.currentActivity) return;

    const effects = this.currentActivity.effects;

    runInAction(() => {
      // Apply effects
      if (effects.energy) this.needs.energy = Math.min(100, Math.max(0, this.needs.energy + effects.energy));
      if (effects.social) this.needs.social = Math.min(100, Math.max(0, this.needs.social + effects.social));
      if (effects.purpose) this.needs.purpose = Math.min(100, Math.max(0, this.needs.purpose + effects.purpose));

      // Reset state
      this.currentActivity = null;
      this.activityProgress = 0;
      this.state = 'idle';
      this.idleCooldown = 2; // 2 game-minutes before next decision
    });
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Behavior Trees for NPCs | Utility AI scoring | The Sims (2000) pioneered | More emergent, less hand-authored |
| Fixed activity schedules | Need-driven selection | Standard since Sims | Characters feel alive |
| Instant teleportation | Position animation | Always best practice | Visible, predictable movement |
| Silent decisions | Thought bubble visualization | Novel for this project | Player understands character |

**Current best practices:**
- Utility AI with weighted random selection (not always best)
- Color/personality as major factor in scoring (60%+)
- Visual feedback for internal state (thought bubbles)
- State machine for character behavior phases

## Open Questions

1. **Exact activity location coordinates**
   - What we know: Activities need spatial positions for movement
   - What's unclear: Best screen layout for 6-8 activities
   - Recommendation: Start with simple grid, tune based on visual appeal

2. **Decision duration tuning**
   - What we know: Elling deliberates longer (Blue = analysis)
   - What's unclear: Exact ms values that feel right
   - Recommendation: Start with 2000ms Elling, 800ms Mother, tune during playtest

3. **Movement speed balance**
   - What we know: Slower when tired, personality affects base speed
   - What's unclear: Pixel/second values that look natural
   - Recommendation: Start with 30-50 pixels/game-minute, adjust to screen size

4. **Activity duration scaling with game time**
   - What we know: 10 game-minutes per real-second from Phase 1
   - What's unclear: Do 1-hour activities feel too long/short?
   - Recommendation: Monitor in playtest, may need to speed up activity completion

## Sources

### Primary (HIGH confidence)
- [The Sims AI Design](https://gmtk.substack.com/p/the-genius-ai-behind-the-sims) - Utility AI fundamentals
- [Utility AI Introduction](https://shaggydev.com/2023/04/19/utility-ai/) - Scoring implementation
- [MobX Official Docs](https://mobx.js.org/computeds.html) - Computed values pattern
- Phase 1 RESEARCH.md - Established patterns
- Project ARCHITECTURE.md - Store patterns

### Secondary (MEDIUM confidence)
- [MobX State Machines](https://benmccormick.org/2018/05/14/mobx-state-machines-and-flags) - State enum pattern
- [Motion Documentation](https://motion.dev/) - Animation APIs
- [Game AI Pro - Utility Theory](http://www.gameaipro.com/GameAIPro/GameAIPro_Chapter09_An_Introduction_to_Utility_Theory.pdf) - Scoring math

### Tertiary (LOW confidence)
- WebSearch results for weighted random selection - Algorithm confirmed across multiple sources
- WebSearch results for thought bubble UI - CSS patterns, no single authoritative source

## Metadata

**Confidence breakdown:**
- Utility AI scoring: HIGH - Well-documented pattern from The Sims, multiple authoritative sources
- State machine: HIGH - Standard pattern, MobX docs confirm approach
- Color affinity formula: MEDIUM - Novel formula for this project, based on sound principles
- Animation patterns: HIGH - Motion docs + Phase 1 established patterns
- Thought bubble UI: MEDIUM - Novel implementation, based on CSS/Motion best practices

**Research date:** 2026-01-27
**Valid until:** 30 days (stable patterns, game design may evolve during implementation)

---

*Phase: 02-autonomous-behavior*
*Research completed: 2026-01-27*
