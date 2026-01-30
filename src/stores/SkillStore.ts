import { makeAutoObservable } from 'mobx';
import type { SkillCategory, MTGColorProfile } from '../types/game';
import {
  getLevelFromXP,
  getXPToNextLevel,
  getLevelProgress,
} from '../data/skills';
import type { RootStore } from './RootStore';

/**
 * CharacterSkill represents a single skill for a character
 * Tracks XP and computes level from thresholds
 */
export class CharacterSkill {
  category: SkillCategory;
  xp: number = 0;

  // Observable for pending level-up notification
  pendingLevelUp: { skill: SkillCategory; newLevel: number } | null = null;

  constructor(category: SkillCategory, startingXP: number = 0) {
    this.category = category;
    this.xp = startingXP;
    makeAutoObservable(this);
  }

  /**
   * Computed: level from XP using thresholds
   * Returns 1-5 based on accumulated XP
   */
  get level(): number {
    return getLevelFromXP(this.xp);
  }

  /**
   * Computed: XP needed to reach next level
   */
  get xpToNextLevel(): number {
    return getXPToNextLevel(this.xp, this.level);
  }

  /**
   * Computed: progress 0-1 within current level
   */
  get levelProgress(): number {
    return getLevelProgress(this.xp, this.level);
  }

  /**
   * Action: grant XP to this skill
   * Detects level-ups and sets pendingLevelUp for UI celebration
   */
  grantXP(amount: number): void {
    const oldLevel = this.level;
    this.xp += amount;
    const newLevel = this.level;

    if (newLevel > oldLevel) {
      this.pendingLevelUp = { skill: this.category, newLevel };
    }
  }

  /**
   * Clear level-up notification after celebration displayed
   */
  clearLevelUp(): void {
    this.pendingLevelUp = null;
  }
}

/**
 * SkillStore manages skills for all characters
 * Skills are initialized based on MTG color profile
 */
export class SkillStore {
  // Map of characterId -> Map of SkillCategory -> CharacterSkill
  characterSkills: Map<string, Map<SkillCategory, CharacterSkill>> = new Map();

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  /**
   * Initialize skills for a character with MTG color bonuses
   *
   * Color -> Starting skill bonus:
   * - Blue primary: Creative starts at level 2 (100 XP)
   * - White primary: Practical starts at level 2 (100 XP)
   * - Green primary: Practical starts at level 2 (100 XP)
   * - Red primary: Social starts at level 2 (100 XP)
   * - Black primary: Technical starts at level 2 (100 XP)
   */
  initializeCharacterSkills(
    characterId: string,
    colors: MTGColorProfile
  ): void {
    const skills = new Map<SkillCategory, CharacterSkill>();
    const categories: SkillCategory[] = [
      'Practical',
      'Creative',
      'Social',
      'Technical',
    ];

    // Determine which category gets the bonus based on primary color
    let bonusCategory: SkillCategory | null = null;
    switch (colors.primary.color) {
      case 'blue':
        bonusCategory = 'Creative';
        break;
      case 'white':
      case 'green':
        bonusCategory = 'Practical';
        break;
      case 'red':
        bonusCategory = 'Social';
        break;
      case 'black':
        bonusCategory = 'Technical';
        break;
    }

    // Create skills for each category
    for (const category of categories) {
      const startingXP = category === bonusCategory ? 100 : 0;
      skills.set(category, new CharacterSkill(category, startingXP));
    }

    this.characterSkills.set(characterId, skills);
  }

  /**
   * Get skill for a character
   */
  getSkill(
    characterId: string,
    category: SkillCategory
  ): CharacterSkill | undefined {
    return this.characterSkills.get(characterId)?.get(category);
  }

  /**
   * Get all skills for a character
   */
  getCharacterSkills(
    characterId: string
  ): Map<SkillCategory, CharacterSkill> | undefined {
    return this.characterSkills.get(characterId);
  }

  /**
   * Grant XP to a character's skill
   */
  grantXP(characterId: string, category: SkillCategory, amount: number): void {
    const skill = this.getSkill(characterId, category);
    if (skill) {
      skill.grantXP(amount);
    }
  }

  /**
   * Computed: check if any character has pending level-up
   * Returns first found level-up for UI to display
   */
  get anyPendingLevelUp(): {
    characterId: string;
    skill: SkillCategory;
    newLevel: number;
  } | null {
    for (const [characterId, skills] of this.characterSkills) {
      for (const [category, skill] of skills) {
        if (skill.pendingLevelUp) {
          return {
            characterId,
            skill: category,
            newLevel: skill.pendingLevelUp.newLevel,
          };
        }
      }
    }
    return null;
  }

  /**
   * Clear specific character's level-up notification
   */
  clearLevelUp(characterId: string, category: SkillCategory): void {
    const skill = this.getSkill(characterId, category);
    if (skill) {
      skill.clearLevelUp();
    }
  }

  /**
   * Reset for new game
   */
  reset(): void {
    this.characterSkills.clear();
  }
}
