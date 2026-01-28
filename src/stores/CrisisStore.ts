import { makeAutoObservable } from 'mobx';
import type { CrisisState, CrisisOutcome, CrisisAction, CrisisActionResult } from '../types/game';
import { CRISIS_ACTIONS } from '../data/crisis';
import { calculateSuccessChance } from '../systems/SkillSystem';
import type { RootStore } from './RootStore';

/**
 * CrisisStore manages the Day 10 crisis sequence
 *
 * State machine: inactive -> warning -> active -> resolved
 * - inactive: Normal gameplay, day < 10 or hour < 8
 * - warning: Day 10, hours 8-13, Mother shows warning signs
 * - active: Day 10, hour >= 14, crisis modal visible
 * - resolved: Outcome determined, showing epilogue
 *
 * Key features:
 * - Tracks action attempts for retry penalty
 * - Accumulates hope bonus from non-phone actions
 * - Determines outcome based on phone call success
 */
export class CrisisStore {
  crisisState: CrisisState = 'inactive';
  outcome: CrisisOutcome = null;

  // Track attempts per action for retry penalty (-15% per attempt)
  actionAttempts: Map<string, number> = new Map();

  // Hope bonus from helping actions (+10% each, max +20%)
  hopeBonus: number = 0;

  // Last action result for UI display
  lastActionResult: CrisisActionResult | null = null;

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  /**
   * Should crisis enter warning phase?
   * Day 10, hour >= 8, currently inactive
   */
  get shouldStartWarning(): boolean {
    const { day, hour } = this.rootStore.timeStore;
    return day === 10 && hour >= 8 && this.crisisState === 'inactive';
  }

  /**
   * Should crisis become active?
   * Day 10, hour >= 14, currently in warning
   */
  get shouldTrigger(): boolean {
    const { day, hour } = this.rootStore.timeStore;
    return day === 10 && hour >= 14 && this.crisisState === 'warning';
  }

  /**
   * Available crisis actions
   */
  get actions(): CrisisAction[] {
    return CRISIS_ACTIONS;
  }

  /**
   * Get success chance for an action
   * Base: calculateSuccessChance(skillLevel, difficulty)
   * Modifiers: -15% per retry, +hopeBonus, -shadowPenalty
   */
  getActionSuccessChance(actionId: string): number {
    const action = CRISIS_ACTIONS.find(a => a.id === actionId);
    if (!action) return 0;

    // Get Elling's skill level
    const skill = this.rootStore.skillStore.getSkill('elling', action.skillCategory);
    const skillLevel = skill?.level ?? 1;

    // Base chance from skill system
    let chance = calculateSuccessChance(skillLevel, action.baseDifficulty);

    // Retry penalty: -15% per previous attempt
    const attempts = this.actionAttempts.get(actionId) ?? 0;
    chance -= attempts * 15;

    // Hope bonus from helping actions (phone only benefits)
    if (actionId === 'call-emergency') {
      chance += this.hopeBonus;
    }

    // Shadow state penalty
    if (this.getEllingInShadowState()) {
      chance -= 20;
    }

    // Clamp to valid range
    return Math.max(5, Math.min(95, chance));
  }

  /**
   * Check if Elling is in shadow state during crisis
   * Blue shadow = paralysis when overskudd < 30 during active crisis
   */
  getEllingInShadowState(): boolean {
    const elling = this.rootStore.characterStore.getCharacter('elling');
    if (!elling) return false;

    return this.crisisState === 'active' && elling.overskudd < 30;
  }

  /**
   * Enter warning phase (Day 10 morning)
   */
  startWarning(): void {
    if (this.crisisState === 'inactive') {
      this.crisisState = 'warning';
    }
  }

  /**
   * Trigger active crisis (Mother collapses)
   */
  triggerCrisis(): void {
    if (this.crisisState === 'warning') {
      this.crisisState = 'active';
      this.rootStore.timeStore.pause();
    }
  }

  /**
   * Attempt a crisis action
   * Returns result and updates state
   */
  attemptAction(actionId: string): CrisisActionResult | null {
    const action = CRISIS_ACTIONS.find(a => a.id === actionId);
    if (!action || this.crisisState !== 'active') return null;

    const chance = this.getActionSuccessChance(actionId);
    const roll = Math.random() * 100;
    const succeeded = roll < chance;

    // Track attempt
    const attempts = this.actionAttempts.get(actionId) ?? 0;
    this.actionAttempts.set(actionId, attempts + 1);

    // Apply hope bonus if this action gives it
    if (action.givesHopeBonus && succeeded) {
      this.hopeBonus = Math.min(20, this.hopeBonus + 10);
    }

    const result: CrisisActionResult = {
      action,
      succeeded,
      roll,
      chance,
    };

    this.lastActionResult = result;

    // Check for resolution
    if (actionId === 'call-emergency' && succeeded) {
      this.resolveWith('saved');
    }

    return result;
  }

  /**
   * Clear last action result (after UI displays it)
   */
  clearLastActionResult(): void {
    this.lastActionResult = null;
  }

  /**
   * Resolve crisis with outcome
   */
  resolveWith(outcome: CrisisOutcome): void {
    this.outcome = outcome;
    this.crisisState = 'resolved';
  }

  /**
   * Give up (player chooses to accept loss)
   */
  giveUp(): void {
    this.resolveWith('lost');
  }

  /**
   * Reset for new game
   */
  reset(): void {
    this.crisisState = 'inactive';
    this.outcome = null;
    this.actionAttempts.clear();
    this.hopeBonus = 0;
    this.lastActionResult = null;
  }
}
