import { makeAutoObservable, runInAction } from 'mobx';
import type { MTGColorProfile, Needs, CharacterData, Activity, ActivityScore, CharacterState } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ACTIVITIES } from '../data/activities';
import { scoreActivities, selectActivity } from '../systems/UtilityAI';
import { processActivityCompletion, type ActivityResult } from '../systems/SkillSystem';
import type { RootStore } from './RootStore';

/**
 * Character class represents a single character's state
 *
 * Needs decay over time, overskudd is computed as average of all needs.
 * Lower overskudd means character is struggling and may exhibit shadow behaviors.
 *
 * State machine: idle -> deciding -> walking -> performing -> idle
 * - idle: waiting for cooldown, then starts decision
 * - deciding: deliberating (Blue takes longer), shows thought bubble
 * - walking: moving toward activity location
 * - performing: executing activity, progress bar visible
 */
export class Character {
  id: string;
  name: string;
  colors: MTGColorProfile;
  needs: Needs;

  // State machine
  state: CharacterState = 'idle';
  position: { x: number; y: number };
  currentActivity: Activity | null = null;
  activityProgress: number = 0; // 0-1 completion
  queuedActivity: Activity | null = null; // Player-queued activity to perform next

  // Activity result (for UI feedback)
  lastActivityResult: ActivityResult | null = null;

  // Refusal state (for player intervention feedback)
  refusalMessage: string | null = null;
  refusalIcon: string | null = null;

  // Decision state
  pendingScores: ActivityScore[] = []; // Top 3 for thought bubble display
  decisionDuration: number; // Elling: 2000ms, Mother: 800ms
  decisionStartTime: number = 0; // When decision started (Date.now())

  // Cooldowns
  idleCooldown: number = 0; // Game-minutes until next decision

  readonly characterStore: CharacterStore;

  constructor(data: CharacterData, characterStore: CharacterStore) {
    this.id = data.id;
    this.name = data.name;
    this.colors = data.colors;
    this.needs = { ...data.initialNeeds };
    this.characterStore = characterStore;

    // Initialize position from data or default
    this.position = data.initialPosition
      ? { ...data.initialPosition }
      : { x: 100, y: 150 };

    // Decision duration based on primary color: Blue = deliberate (2000ms), else quick (800ms)
    this.decisionDuration = data.colors.primary.color === 'blue' ? 2000 : 800;

    makeAutoObservable(this, {
      id: false,
      name: false,
      colors: false,
      characterStore: false,
      decisionDuration: false,
    }, { autoBind: true });
  }

  /**
   * Overskudd ("surplus") is the average of all needs
   * Represents overall wellbeing (0-100)
   */
  get overskudd(): number {
    const { energy, social, purpose } = this.needs;
    return (energy + social + purpose) / 3;
  }

  /**
   * Should refuse normal activities and seek comfort?
   * Below 20 overskudd = always refuse
   * 20-40 overskudd = gradual probability of refusal
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
   * Get character's comfort activity (for low overskudd fallback)
   * Elling stares out window, Mother sits quietly
   */
  get comfortActivity(): Activity {
    const comfortId = this.id === 'elling' ? 'stare-window' : 'sit-quietly';
    const activity = ACTIVITIES.find(a => a.isComfortBehavior && a.id === comfortId);
    if (!activity) {
      // Fallback to any comfort behavior
      return ACTIVITIES.find(a => a.isComfortBehavior)!;
    }
    return activity;
  }

  /**
   * Is character in shadow state?
   * Blue shadow = paralysis under extreme stress
   * Triggers when: Blue primary color + crisis active + overskudd < 30
   */
  get inShadowState(): boolean {
    // Only Blue primary characters have shadow state
    if (this.colors.primary.color !== 'blue') return false;

    // Only during active crisis
    const crisisState = this.characterStore.rootStore.crisisStore?.crisisState;
    if (crisisState !== 'active') return false;

    // Shadow threshold: overskudd below 30
    return this.overskudd < 30;
  }

  /**
   * Shadow state penalty applied to crisis action success
   * -20% when in shadow state
   */
  get shadowPenalty(): number {
    return this.inShadowState ? 20 : 0;
  }

  /**
   * Base walking speed (pixels per game-minute)
   * Blue personality = slower (30 px/min), others = faster (50 px/min)
   */
  get baseWalkSpeed(): number {
    return this.colors.primary.color === 'blue' ? 30 : 50;
  }

  /**
   * Update needs based on time passing
   * Needs decay slowly over time (base rate: 1 point per game-hour)
   */
  updateNeeds(gameMinutes: number): void {
    const decayPerMinute = 1 / 60; // 1 point per hour = 1/60 per minute
    const decay = gameMinutes * decayPerMinute;

    this.needs.energy = Math.max(0, this.needs.energy - decay);
    this.needs.social = Math.max(0, this.needs.social - decay * 0.5); // Social decays slower
    this.needs.purpose = Math.max(0, this.needs.purpose - decay * 0.3); // Purpose decays slowest
  }

  /**
   * Main update method - called each tick
   * Handles state machine transitions and updates
   */
  update(gameMinutes: number): void {
    this.updateNeeds(gameMinutes);

    switch (this.state) {
      case 'idle':
        this.idleCooldown -= gameMinutes;
        if (this.idleCooldown <= 0) {
          this.startDecision();
        }
        break;
      case 'deciding':
        // Handled by setTimeout in startDecision
        break;
      case 'walking':
        this.updateWalking(gameMinutes);
        break;
      case 'performing':
        this.updatePerforming(gameMinutes);
        break;
    }
  }

  /**
   * Start decision process
   * If low overskudd, go straight to comfort activity
   * Otherwise, score activities and deliberate
   */
  startDecision(): void {
    // Check if should refuse normal activities
    if (this.shouldRefuse) {
      // Go straight to comfort behavior
      this.currentActivity = this.comfortActivity;
      this.state = 'walking';
      return;
    }

    // Score activities using Utility AI
    const scores = scoreActivities(this, ACTIVITIES);
    this.pendingScores = scores.slice(0, 3); // Top 3 for thought bubble
    this.state = 'deciding';
    this.decisionStartTime = Date.now();

    // Deliberate for decisionDuration, then complete
    setTimeout(() => {
      runInAction(() => {
        this.completeDecision();
      });
    }, this.decisionDuration);
  }

  /**
   * Complete decision after deliberation
   * Select activity from pending scores
   */
  completeDecision(): void {
    // Guard: only complete if still deciding
    if (this.state !== 'deciding') return;

    if (this.pendingScores.length === 0) {
      // Fallback to comfort if no scores
      this.currentActivity = this.comfortActivity;
    } else {
      // Select from top candidates
      this.currentActivity = selectActivity(this.pendingScores);
    }

    this.state = 'walking';
    this.pendingScores = [];
  }

  /**
   * Update walking toward activity location
   */
  updateWalking(gameMinutes: number): void {
    if (!this.currentActivity) {
      this.state = 'idle';
      return;
    }

    const target = this.currentActivity.location;
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if arrived (within 5 pixels)
    if (distance < 5) {
      this.position.x = target.x;
      this.position.y = target.y;
      this.state = 'performing';
      this.activityProgress = 0;
      return;
    }

    // Move toward target
    // Speed scales with overskudd (low overskudd = slower)
    const speed = (this.overskudd / 100) * this.baseWalkSpeed * gameMinutes;

    // Normalize direction and move
    const dirX = dx / distance;
    const dirY = dy / distance;
    this.position.x += dirX * speed;
    this.position.y += dirY * speed;
  }

  /**
   * Update performing activity
   * Progress toward completion
   */
  updatePerforming(gameMinutes: number): void {
    if (!this.currentActivity) {
      this.state = 'idle';
      return;
    }

    // Progress rate: complete in (duration * 60) game-minutes
    // duration is in game-hours, so duration * 60 = game-minutes
    const progressRate = 1 / (this.currentActivity.duration * 60);
    this.activityProgress += progressRate * gameMinutes;

    if (this.activityProgress >= 1) {
      this.completeActivity();
    }
  }

  /**
   * Complete activity with skill/resource integration
   *
   * Processes activity through SkillSystem to determine:
   * - Success/failure based on skill level vs difficulty
   * - Output amounts modified by skill level
   * - XP gained for the relevant skill category
   *
   * Then applies need effects and adds resources to global pool.
   */
  completeActivity(): void {
    if (!this.currentActivity) return;

    const activity = this.currentActivity;

    // Get skill level if activity has a skill category
    let skillLevel = 1;
    if (activity.skillCategory) {
      const skill = this.characterStore.rootStore.skillStore.getSkill(
        this.id,
        activity.skillCategory
      );
      skillLevel = skill?.level ?? 1;
    }

    // Process activity with skill system
    const result = processActivityCompletion(activity, skillLevel);
    this.lastActivityResult = result;

    // Grant XP if skill was involved
    if (result.skillCategory && result.xpGained > 0) {
      this.characterStore.rootStore.skillStore.grantXP(
        this.id,
        result.skillCategory,
        result.xpGained
      );
    }

    // Add resources to global pool
    for (const output of result.outputs) {
      this.characterStore.rootStore.resourceStore.addResource(
        output.resource,
        output.amount
      );
    }

    // Apply effects to needs (clamp 0-100)
    const effects = activity.effects;
    if (effects.energy) {
      this.needs.energy = Math.max(0, Math.min(100, this.needs.energy + effects.energy));
    }
    if (effects.social) {
      this.needs.social = Math.max(0, Math.min(100, this.needs.social + effects.social));
    }
    if (effects.purpose) {
      this.needs.purpose = Math.max(0, Math.min(100, this.needs.purpose + effects.purpose));
    }

    // Reset state
    this.currentActivity = null;
    this.activityProgress = 0;
    this.state = 'idle';
    this.idleCooldown = 2; // 2 game-minutes until next decision

    // Check for queued activity from player
    if (this.queuedActivity) {
      const queued = this.queuedActivity;
      this.queuedActivity = null;
      this.forceActivity(queued);
    }
  }

  /**
   * Clear last activity result (for UI to call after displaying feedback)
   */
  clearLastActivityResult(): void {
    this.lastActivityResult = null;
  }

  /**
   * Get character's attitude toward an activity
   * Returns: 'eager' | 'neutral' | 'reluctant' | 'refusing'
   * Note: Busy state no longer returns 'refusing' since activities can be queued
   */
  getAttitudeToward(activity: Activity): 'eager' | 'neutral' | 'reluctant' | 'refusing' {
    // Low overskudd = reluctant or refusing
    if (this.overskudd < 20) return 'refusing';
    if (this.overskudd < 40) return 'reluctant';

    // Check color affinity
    const colorMatch = this.calculateColorMatch(activity);
    if (colorMatch > 0.6) return 'eager';
    if (colorMatch < 0.3) return 'reluctant';
    return 'neutral';
  }

  /**
   * Helper to calculate color match (reuse Utility AI logic)
   */
  private calculateColorMatch(activity: Activity): number {
    const affinities = activity.colorAffinities;
    if (Object.keys(affinities).length === 0) return 0.5; // Neutral

    let totalMatch = 0;
    let totalWeight = 0;

    // Check primary color
    const primaryAffinity = affinities[this.colors.primary.color] ?? 0;
    totalMatch += primaryAffinity * this.colors.primary.intensity;
    totalWeight += this.colors.primary.intensity;

    // Check secondary if exists
    if (this.colors.secondary) {
      const secondaryAffinity = affinities[this.colors.secondary.color] ?? 0;
      totalMatch += secondaryAffinity * this.colors.secondary.intensity;
      totalWeight += this.colors.secondary.intensity;
    }

    return totalWeight > 0 ? totalMatch / totalWeight : 0.5;
  }

  /**
   * Force character to do an activity (player intervention)
   * If character is busy, queues the activity instead.
   * May cause refusal message based on context.
   */
  forceActivity(activity: Activity): void {
    // If busy, queue instead of refusing
    if (this.state === 'walking' || this.state === 'performing') {
      this.queuedActivity = activity;
      return;
    }

    const attitude = this.getAttitudeToward(activity);

    // Generate refusal message based on personality and reason
    if (attitude === 'refusing' || attitude === 'reluctant') {
      this.generateRefusalMessage(activity, attitude);
    } else {
      this.refusalMessage = null;
      this.refusalIcon = null;
    }

    // Set activity and start walking
    this.currentActivity = activity;
    this.state = 'walking';
    this.pendingScores = [];

    // Clear decision state
    this.decisionStartTime = 0;
  }

  /**
   * Generate personality-flavored refusal/reluctance message
   */
  private generateRefusalMessage(activity: Activity, _attitude: 'refusing' | 'reluctant'): void {
    const isBlue = this.colors.primary.color === 'blue';
    const isWhite = this.colors.primary.color === 'white';

    if (this.overskudd < 20) {
      // Exhaustion refusal
      this.refusalIcon = '😫';
      this.refusalMessage = isBlue
        ? "I can't... I just can't right now."
        : "I'm too tired for this.";
    } else if (this.overskudd < 40) {
      // Low energy reluctance
      this.refusalIcon = '😓';
      this.refusalMessage = isBlue
        ? "Must I? I'm not sure I have it in me..."
        : "I suppose I can try...";
    } else if (this.calculateColorMatch(activity) < 0.3) {
      // Personality mismatch
      this.refusalIcon = '😕';
      this.refusalMessage = isBlue
        ? "That's not really my thing..."
        : isWhite
          ? "If you think it's important..."
          : "I'd rather not.";
    }

    // Auto-clear after 3 seconds
    setTimeout(() => {
      runInAction(() => {
        this.refusalMessage = null;
        this.refusalIcon = null;
      });
    }, 3000);
  }

  /**
   * Clear refusal message manually
   */
  clearRefusal(): void {
    this.refusalMessage = null;
    this.refusalIcon = null;
  }

  /**
   * Debug: Drain all needs to trigger low overskudd behavior
   * Sets each need to a low value to test comfort/refusal behaviors
   */
  drainNeeds(): void {
    this.needs.energy = 15;
    this.needs.social = 15;
    this.needs.purpose = 15;
  }

  /**
   * Debug: Restore all needs to healthy levels
   */
  restoreNeeds(): void {
    this.needs.energy = 80;
    this.needs.social = 80;
    this.needs.purpose = 80;
  }
}

/**
 * CharacterStore manages all characters in the game
 */
export class CharacterStore {
  characters: Map<string, Character> = new Map();

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false,
    }, { autoBind: true });

    // Initialize characters from data
    for (const data of CHARACTERS) {
      this.characters.set(data.id, new Character(data, this));
    }
  }

  getCharacter(id: string): Character | undefined {
    return this.characters.get(id);
  }

  get allCharacters(): Character[] {
    return Array.from(this.characters.values());
  }

  /**
   * Update all characters based on time passing
   */
  updateAll(gameMinutes: number): void {
    for (const character of this.characters.values()) {
      character.update(gameMinutes);
    }
  }
}
