import type { Activity } from '../types/game';

/**
 * Activity definitions for "Before the Fall"
 *
 * Each activity has:
 * - colorAffinities: MTG colors that match this activity (higher = stronger match)
 * - location: spatial position in game world
 * - duration: game hours to complete
 * - effects: how it changes character needs
 *
 * Activities are scored by the Utility AI based on character color profile
 * and current needs state.
 */

// Location constants for spatial layout
const LOCATIONS = {
  desk: { x: 100, y: 150 },      // Reading/thinking area
  window: { x: 200, y: 100 },    // Window for gazing
  kitchen: { x: 300, y: 200 },   // Cooking/cleaning
  living: { x: 200, y: 180 },    // TV/phone area
  rest: { x: 180, y: 220 },      // Resting spot
  hallway: { x: 250, y: 150 },   // Check on Elling path
} as const;

/**
 * Regular activities - chosen by Utility AI based on color match and needs
 */
const REGULAR_ACTIVITIES: Activity[] = [
  // Blue activities - Elling's domain
  {
    id: 'reading',
    name: 'Reading',
    icon: '📖',
    colorAffinities: { blue: 0.9 },
    location: LOCATIONS.desk,
    duration: 1.0,
    effects: {
      energy: -5,
      purpose: 15,
    },
  },
  {
    id: 'thinking',
    name: 'Deep Thought',
    icon: '💭',
    colorAffinities: { blue: 0.8 },
    location: LOCATIONS.window,
    duration: 0.5,
    effects: {
      energy: -3,
      purpose: 10,
    },
  },

  // White activities - Mother's domain
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '🍳',
    colorAffinities: { white: 0.6, green: 0.5 },
    location: LOCATIONS.kitchen,
    duration: 1.0,
    effects: {
      energy: -10,
      purpose: 20,
    },
  },
  {
    id: 'cleaning',
    name: 'Tidy Up',
    icon: '🧹',
    colorAffinities: { white: 0.8 },
    location: LOCATIONS.kitchen,
    duration: 0.5,
    effects: {
      energy: -8,
      purpose: 12,
    },
  },
  {
    id: 'check-elling',
    name: 'Check on Elling',
    icon: '👀',
    colorAffinities: { white: 0.7, green: 0.3 },
    location: LOCATIONS.hallway,
    duration: 0.25,
    effects: {
      energy: -2,
      social: 5,
      purpose: 8,
    },
  },

  // Neutral activities - no strong color preference
  {
    id: 'watch-tv',
    name: 'Watch TV',
    icon: '📺',
    colorAffinities: {},
    location: LOCATIONS.living,
    duration: 1.0,
    effects: {
      energy: 5,
      social: 3,
    },
  },
  {
    id: 'phone',
    name: 'Use Phone',
    icon: '📱',
    colorAffinities: {},
    location: LOCATIONS.living,
    duration: 0.5,
    effects: {
      energy: 2,
      social: 8,
    },
  },

  // Green-influenced recovery activity
  {
    id: 'rest',
    name: 'Rest',
    icon: '😌',
    colorAffinities: { green: 0.4 },
    location: LOCATIONS.rest,
    duration: 0.5,
    effects: {
      energy: 15,
    },
  },
];

/**
 * Comfort behaviors - fallback activities for low overskudd
 * These are simpler, less demanding activities characters retreat to
 * when they're struggling.
 */
const COMFORT_BEHAVIORS: Activity[] = [
  // Elling's comfort - Blue withdrawal
  {
    id: 'stare-window',
    name: 'Stare Out Window',
    icon: '🪟',
    colorAffinities: { blue: 0.5 },
    location: LOCATIONS.window,
    duration: 0.25,
    effects: {
      energy: 3,
    },
    isComfortBehavior: true,
  },
  // Mother's comfort - White stillness
  {
    id: 'sit-quietly',
    name: 'Sit Quietly',
    icon: '🪑',
    colorAffinities: { white: 0.3 },
    location: LOCATIONS.living,
    duration: 0.25,
    effects: {
      energy: 5,
    },
    isComfortBehavior: true,
  },
];

/**
 * All activities combined
 * Use this for the Utility AI to score all possible activities
 */
export const ACTIVITIES: Activity[] = [
  ...REGULAR_ACTIVITIES,
  ...COMFORT_BEHAVIORS,
];

/**
 * Get activities by type
 */
export function getRegularActivities(): Activity[] {
  return ACTIVITIES.filter((a) => !a.isComfortBehavior);
}

export function getComfortBehaviors(): Activity[] {
  return ACTIVITIES.filter((a) => a.isComfortBehavior);
}

export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
