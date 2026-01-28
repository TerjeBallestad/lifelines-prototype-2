import { makeAutoObservable } from 'mobx';
import type { Quest } from '../types/game';
import { QUESTS } from '../data/quests';
import type { RootStore } from './RootStore';

/**
 * QuestStore manages quest state and tracks progress reactively
 *
 * Key features:
 * - currentQuestIndex tracks which quest is active
 * - pendingCompletion holds completed quest for celebration modal
 * - Progress is COMPUTED from ResourceStore/SkillStore (not stored)
 */
export class QuestStore {
  currentQuestIndex: number = 0;
  pendingCompletion: Quest | null = null;

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  /**
   * Current active quest (null if all quests complete)
   */
  get currentQuest(): Quest | null {
    return QUESTS[this.currentQuestIndex] ?? null;
  }

  /**
   * Check if all quests are complete
   */
  get allQuestsComplete(): boolean {
    return this.currentQuestIndex >= QUESTS.length;
  }

  /**
   * Computed: reactive progress 0-1 based on quest type
   * Automatically updates when ResourceStore or SkillStore changes
   */
  get currentQuestProgress(): number {
    const quest = this.currentQuest;
    if (!quest) return 0;

    switch (quest.type) {
      case 'resource':
        return this.getResourceQuestProgress(quest);
      case 'skill':
        return this.getSkillQuestProgress(quest);
      case 'composite':
        return this.getCompositeQuestProgress(quest);
      default:
        return 0;
    }
  }

  /**
   * Progress for resource-based quests
   */
  private getResourceQuestProgress(quest: Quest): number {
    if (!quest.resourceType || !quest.targetAmount) return 0;
    const current = this.rootStore.resourceStore.getResource(quest.resourceType);
    return Math.min(1, current / quest.targetAmount);
  }

  /**
   * Progress for skill-based quests
   */
  private getSkillQuestProgress(quest: Quest): number {
    if (!quest.characterId || !quest.skillCategory || !quest.targetLevel) return 0;
    const skill = this.rootStore.skillStore.getSkill(quest.characterId, quest.skillCategory);
    if (!skill) return 0;

    // If at or above target level, complete
    if (skill.level >= quest.targetLevel) return 1;

    // Otherwise, show progress within the target level
    // e.g., if target is level 2, and we're at level 1 with 50% progress to level 2,
    // that's 50% of the quest
    const levelsNeeded = quest.targetLevel - 1; // levels to gain from level 1
    const currentLevelGains = skill.level - 1;
    const levelFraction = currentLevelGains / levelsNeeded;
    const progressInCurrentLevel = skill.levelProgress / levelsNeeded;

    return Math.min(1, levelFraction + progressInCurrentLevel);
  }

  /**
   * Progress for composite quests (multiple conditions)
   */
  private getCompositeQuestProgress(quest: Quest): number {
    if (!quest.compositeConditions?.resources) return 0;

    const conditions = quest.compositeConditions.resources;
    let totalProgress = 0;

    for (const condition of conditions) {
      const current = this.rootStore.resourceStore.getResource(condition.type);
      const conditionProgress = Math.min(1, current / condition.amount);
      totalProgress += conditionProgress;
    }

    return totalProgress / conditions.length;
  }

  /**
   * Check if current quest is complete (progress >= 1)
   * Does NOT trigger if already showing completion modal
   */
  get isQuestComplete(): boolean {
    return this.currentQuestProgress >= 1 && !this.pendingCompletion && this.currentQuest !== null;
  }

  /**
   * Action: mark current quest as complete (triggers celebration)
   * Called by Game component when isQuestComplete becomes true
   */
  completeCurrentQuest(): void {
    if (this.currentQuest && !this.pendingCompletion) {
      this.pendingCompletion = this.currentQuest;
    }
  }

  /**
   * Action: advance to next quest after celebration dismissed
   */
  advanceQuest(): void {
    this.pendingCompletion = null;
    this.currentQuestIndex++;
  }

  /**
   * Total quests count
   */
  get totalQuests(): number {
    return QUESTS.length;
  }
}
