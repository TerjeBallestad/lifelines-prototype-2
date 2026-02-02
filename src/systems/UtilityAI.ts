import type {
  MTGColor,
  MTGColorProfile,
  Needs,
  Activity,
  ActivityScore,
} from '../types/game';
import type { Character } from '../stores/CharacterStore';

/**
 * Utility AI System
 *
 * Scores activities based on character personality (MTG colors) and current needs.
 * Formula: utility = (colorMatch * 0.6) + (needSatisfaction * 0.4)
 *
 * Color match dominates (60%) so personality drives behavior,
 * but needs (40%) still matter for survival.
 */

// Weights for the utility formula
const COLOR_WEIGHT = 0.6;
const NEED_WEIGHT = 0.4;

// Maximum candidates for weighted random selection
const MAX_CANDIDATES = 3;
const CANDIDATE_THRESHOLD = 0.8; // Within 80% of best score

/**
 * Calculate how well activity colors match character's color profile
 *
 * For each color in the activity, multiply:
 * - Activity's affinity for that color (0-1)
 * - Character's intensity for that color (0-1)
 *
 * Returns 0.5 (neutral) if activity has no color affinities.
 */
export function calculateColorAffinity(
  characterColors: MTGColorProfile,
  activityColors: Partial<Record<MTGColor, number>>
): number {
  const colorEntries = Object.entries(activityColors) as [MTGColor, number][];

  // No color affinities = neutral activity
  if (colorEntries.length === 0) {
    return 0.5;
  }

  // Build character's color intensity map
  const characterIntensities: Partial<Record<MTGColor, number>> = {
    [characterColors.primary.color]: characterColors.primary.intensity,
  };
  if (characterColors.secondary) {
    characterIntensities[characterColors.secondary.color] =
      characterColors.secondary.intensity;
  }

  // Calculate weighted match
  let totalMatch = 0;
  let totalWeight = 0;

  for (const [color, affinity] of colorEntries) {
    const characterIntensity = characterIntensities[color] ?? 0;
    totalMatch += characterIntensity * affinity;
    totalWeight += affinity;
  }

  // Normalize to 0-1
  return totalWeight > 0 ? totalMatch / totalWeight : 0.5;
}

/**
 * Calculate how much activity satisfies character's current needs
 *
 * Considers:
 * - How badly each need is needed (1 - current/100)
 * - How much the activity restores that need
 *
 * Returns 0.5 if no positive effects.
 */
export function calculateNeedSatisfaction(
  needs: Needs,
  effects: Activity['effects']
): number {
  // Normalization factors for effects (to get to 0-1 scale)
  const normFactors = {
    energy: 20, // Max expected energy gain per activity
    social: 10, // Max expected social gain
    purpose: 20, // Max expected purpose gain
  };

  let totalSatisfaction = 0;
  let totalWeight = 0;

  // Energy
  if (effects.energy && effects.energy > 0) {
    const needLevel = 1 - needs.energy / 100; // How badly needed (0 = full, 1 = empty)
    const effectStrength = effects.energy / normFactors.energy;
    totalSatisfaction += needLevel * effectStrength;
    totalWeight += effectStrength;
  }

  // Social
  if (effects.social && effects.social > 0) {
    const needLevel = 1 - needs.social / 100;
    const effectStrength = effects.social / normFactors.social;
    totalSatisfaction += needLevel * effectStrength;
    totalWeight += effectStrength;
  }

  // Purpose
  if (effects.purpose && effects.purpose > 0) {
    const needLevel = 1 - needs.purpose / 100;
    const effectStrength = effects.purpose / normFactors.purpose;
    totalSatisfaction += needLevel * effectStrength;
    totalWeight += effectStrength;
  }

  // No positive effects = neutral
  if (totalWeight === 0) {
    return 0.5;
  }

  return Math.min(1, totalSatisfaction / totalWeight);
}

/**
 * Score all activities for a character
 *
 * Filters out comfort behaviors (those are selected separately when overskudd is low).
 * Returns activities sorted by utility score (highest first).
 */
export function scoreActivities(
  character: Character,
  activities: Activity[]
): ActivityScore[] {
  // Filter out comfort behaviors - those are for low overskudd fallback
  const regularActivities = activities.filter((a) => !a.isComfortBehavior);

  const scores: ActivityScore[] = regularActivities.map((activity) => {
    const colorMatch = calculateColorAffinity(
      character.colors,
      activity.colorAffinities
    );
    const needSatisfaction = calculateNeedSatisfaction(
      character.needs,
      activity.effects
    );

    // Combine with weights
    const utility = colorMatch * COLOR_WEIGHT + needSatisfaction * NEED_WEIGHT;

    return {
      activity,
      utility,
      colorMatch,
      needSatisfaction,
    };
  });

  // Sort by utility descending
  return scores.sort((a, b) => b.utility - a.utility);
}

/**
 * Select an activity from scored candidates
 *
 * Uses weighted random selection from top candidates (within 80% of best score).
 * This adds variety while still preferring high-utility activities.
 */
export function selectActivity(scores: ActivityScore[]): Activity {
  if (scores.length === 0) {
    throw new Error('No activities to select from');
  }

  if (scores.length === 1) {
    return scores[0].activity;
  }

  const bestScore = scores[0].utility;
  const threshold = bestScore * CANDIDATE_THRESHOLD;

  // Get candidates within threshold, max 3
  const candidates = scores
    .filter((s) => s.utility >= threshold)
    .slice(0, MAX_CANDIDATES);

  // Weighted random selection based on utility
  const totalWeight = candidates.reduce((sum, s) => sum + s.utility, 0);
  let random = Math.random() * totalWeight;

  for (const candidate of candidates) {
    random -= candidate.utility;
    if (random <= 0) {
      return candidate.activity;
    }
  }

  // Fallback to first (shouldn't happen due to floating point)
  return candidates[0].activity;
}

/**
 * Score comfort behaviors for a character
 *
 * Used when character has low overskudd and needs simpler activities.
 */
export function scoreComfortBehaviors(
  character: Character,
  activities: Activity[]
): ActivityScore[] {
  const comfortBehaviors = activities.filter((a) => a.isComfortBehavior);

  const scores: ActivityScore[] = comfortBehaviors.map((activity) => {
    const colorMatch = calculateColorAffinity(
      character.colors,
      activity.colorAffinities
    );
    // Comfort behaviors don't need to satisfy needs, just match personality
    const utility = colorMatch;

    return {
      activity,
      utility,
      colorMatch,
      needSatisfaction: 0,
    };
  });

  return scores.sort((a, b) => b.utility - a.utility);
}
