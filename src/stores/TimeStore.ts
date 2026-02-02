import { makeAutoObservable } from 'mobx';
import type { TimeOfDay } from '../types/game';
import type { RootStore } from './RootStore';

/**
 * TimeStore manages game time state
 *
 * Game time runs at gameSpeed (default 10) game-minutes per real-second.
 * Day starts at 7:00 AM and progresses through morning, afternoon, evening, night.
 */
export class TimeStore {
  day = 1;
  hour = 7;
  minute = 0;
  isPaused = false;

  /** Game minutes per real second */
  gameSpeed = 10;

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get timeOfDay(): TimeOfDay {
    if (this.hour >= 6 && this.hour < 12) return 'morning';
    if (this.hour >= 12 && this.hour < 18) return 'afternoon';
    if (this.hour >= 18 && this.hour < 22) return 'evening';
    return 'night';
  }

  get formattedTime(): string {
    const h = this.hour.toString().padStart(2, '0');
    const m = Math.floor(this.minute).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  /**
   * Advance time by deltaMs real milliseconds
   * Only advances when not paused
   */
  tick(deltaMs: number): void {
    if (this.isPaused) return;

    // Convert real ms to game minutes
    const realSeconds = deltaMs / 1000;
    const gameMinutes = realSeconds * this.gameSpeed;

    this.minute += gameMinutes;

    // Handle minute overflow
    while (this.minute >= 60) {
      this.minute -= 60;
      this.hour += 1;
    }

    // Handle hour overflow (24-hour cycle)
    while (this.hour >= 24) {
      this.hour -= 24;
      this.day += 1;
    }
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  /**
   * Reset for new game
   */
  reset(): void {
    this.day = 1;
    this.hour = 6;
    this.minute = 0;
    this.isPaused = true;
  }
}
