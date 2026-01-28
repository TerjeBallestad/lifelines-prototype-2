import type { SkillData, SkillCategory } from '../types/game';

/**
 * XP thresholds for skill levels 1-5
 * Index 0 = level 1, index 4 = level 5
 */
export const XP_THRESHOLDS = [0, 100, 300, 600, 1000] as const;

/**
 * Output modifiers by skill level
 * Index 0 unused, index 1-5 for levels 1-5
 * Higher level = more resource output from activities
 */
export const OUTPUT_MODIFIERS = [1.0, 1.0, 1.2, 1.5, 1.8, 2.0] as const;

/**
 * Skill definitions
 * Each skill belongs to a category and has an associated activity
 */
export const SKILLS: SkillData[] = [
  // Practical skills
  {
    id: 'cooking',
    name: 'Cooking',
    category: 'Practical',
    description: 'Preparing food efficiently',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    category: 'Practical',
    description: 'Maintaining living spaces',
  },

  // Creative skills
  {
    id: 'reading',
    name: 'Reading',
    category: 'Creative',
    description: 'Deep comprehension and focus',
  },
  {
    id: 'thinking',
    name: 'Thinking',
    category: 'Creative',
    description: 'Problem solving and analysis',
  },

  // Social skills
  {
    id: 'phone',
    name: 'Phone',
    category: 'Social',
    description: 'Communication and calling for help',
  },
  {
    id: 'socializing',
    name: 'Socializing',
    category: 'Social',
    description: 'Connecting with others',
  },
];

/**
 * Get skill level from total XP
 * Returns 1-5 based on thresholds
 */
export function getLevelFromXP(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * Get XP needed to reach next level
 * Returns 0 if at max level
 */
export function getXPToNextLevel(xp: number, level: number): number {
  if (level >= XP_THRESHOLDS.length) {
    return 0; // Max level
  }
  return XP_THRESHOLDS[level] - xp;
}

/**
 * Get progress (0-1) within current level
 */
export function getLevelProgress(xp: number, level: number): number {
  if (level >= XP_THRESHOLDS.length) {
    return 1; // Max level
  }
  const currentThreshold = XP_THRESHOLDS[level - 1];
  const nextThreshold = XP_THRESHOLDS[level];
  const xpInLevel = xp - currentThreshold;
  const xpForLevel = nextThreshold - currentThreshold;
  return Math.min(1, xpInLevel / xpForLevel);
}

/**
 * Get output modifier for a skill level
 * Higher levels produce more resources
 */
export function getOutputModifier(level: number): number {
  if (level < 1) return OUTPUT_MODIFIERS[1];
  if (level > 5) return OUTPUT_MODIFIERS[5];
  return OUTPUT_MODIFIERS[level];
}

/**
 * Get skill definition by ID
 */
export function getSkillById(id: string): SkillData | undefined {
  return SKILLS.find(s => s.id === id);
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: SkillCategory): SkillData[] {
  return SKILLS.filter(s => s.category === category);
}
