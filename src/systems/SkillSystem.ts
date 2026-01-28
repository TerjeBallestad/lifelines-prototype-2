import type { Activity, SkillCategory, ResourceType } from '../types/game';
import { getOutputModifier } from '../data/skills';

/**
 * ActivityResult represents the outcome of completing an activity
 * Captures success/failure, outputs, and XP earned
 */
export interface ActivityResult {
  succeeded: boolean;
  critical: boolean;
  outputs: Array<{ resource: ResourceType; amount: number }>;
  xpGained: number;
  skillCategory?: SkillCategory;
}

/**
 * Calculate success chance for an activity based on skill level and difficulty
 *
 * Formula: 50 + (skillLevel * 10) - ((difficulty - 1) * 15)
 * Clamped between 10 and 95
 *
 * Examples:
 * - Level 1 vs Difficulty 1 = 60%
 * - Level 3 vs Difficulty 2 = 65%
 * - Level 1 vs Difficulty 3 = 30%
 */
export function calculateSuccessChance(skillLevel: number, difficulty: number): number {
  const baseChance = 50 + (skillLevel * 10) - ((difficulty - 1) * 15);
  return Math.max(10, Math.min(95, baseChance));
}

/**
 * Calculate output amount based on skill level and success/critical status
 *
 * - Failed: 50% of base amount
 * - Critical: 150% of normal output
 * - Normal: base amount * output modifier for level
 */
export function calculateOutput(
  baseAmount: number,
  skillLevel: number,
  succeeded: boolean,
  critical: boolean
): number {
  if (!succeeded) {
    return Math.floor(baseAmount * 0.5);
  }
  if (critical) {
    return Math.floor(baseAmount * getOutputModifier(skillLevel) * 1.5);
  }
  return Math.floor(baseAmount * getOutputModifier(skillLevel));
}

/**
 * Calculate XP gained from completing an activity
 *
 * Base XP: 10 * difficulty
 * Failed: 50% (still learn from failure)
 * Succeeded: full amount
 */
export function calculateXPGain(difficulty: number, succeeded: boolean): number {
  const baseXP = 10 * difficulty;
  if (!succeeded) {
    return Math.floor(baseXP * 0.5);
  }
  return baseXP;
}

/**
 * Roll for success based on success chance percentage
 */
export function rollForSuccess(successChance: number): boolean {
  return Math.random() * 100 < successChance;
}

/**
 * Roll for critical success (only called on successful activities)
 *
 * Critical chance: 5 + (skillLevel * 5)%
 */
export function rollForCritical(skillLevel: number): boolean {
  const criticalChance = 5 + (skillLevel * 5);
  return Math.random() * 100 < criticalChance;
}

/**
 * Process activity completion and generate result
 *
 * Determines success/failure, calculates outputs, and XP gained
 * Pure function that doesn't mutate state - caller handles state updates
 */
export function processActivityCompletion(
  activity: Activity,
  skillLevel: number
): ActivityResult {
  const difficulty = activity.difficulty ?? 1;
  const successChance = calculateSuccessChance(skillLevel, difficulty);
  const succeeded = rollForSuccess(successChance);
  const critical = succeeded && rollForCritical(skillLevel);

  const outputs = (activity.outputs ?? []).map(output => ({
    resource: output.resource,
    amount: calculateOutput(output.baseAmount, skillLevel, succeeded, critical),
  }));

  const xpGained = activity.skillCategory
    ? calculateXPGain(difficulty, succeeded)
    : 0;

  return {
    succeeded,
    critical,
    outputs,
    xpGained,
    skillCategory: activity.skillCategory,
  };
}
