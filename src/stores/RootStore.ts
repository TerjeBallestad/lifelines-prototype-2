import { createContext, useContext } from 'react';
import { TimeStore } from './TimeStore';
import { CharacterStore } from './CharacterStore';
import { InteractionStore } from './InteractionStore';
import { SkillStore } from './SkillStore';
import { ResourceStore } from './ResourceStore';

/**
 * RootStore is the central store that creates and connects all other stores
 *
 * Provides:
 * - Cross-store access via `this` reference
 * - Unified tick() for game loop
 * - Singleton instance for app
 */
export class RootStore {
  timeStore: TimeStore;
  characterStore: CharacterStore;
  interactionStore: InteractionStore;
  skillStore: SkillStore;
  resourceStore: ResourceStore;

  constructor() {
    this.timeStore = new TimeStore(this);
    this.characterStore = new CharacterStore(this);
    this.interactionStore = new InteractionStore(this);
    this.skillStore = new SkillStore(this);
    this.resourceStore = new ResourceStore(this);

    // Initialize skills for all characters based on their MTG colors
    for (const character of this.characterStore.allCharacters) {
      this.skillStore.initializeCharacterSkills(character.id, character.colors);
    }
  }

  /**
   * Main game loop tick
   * Called each frame with deltaMs (real milliseconds since last tick)
   */
  tick(deltaMs: number): void {
    // First advance time
    this.timeStore.tick(deltaMs);

    // Then update characters based on how much game time passed
    if (!this.timeStore.isPaused) {
      const realSeconds = deltaMs / 1000;
      const gameMinutes = realSeconds * this.timeStore.gameSpeed;
      this.characterStore.updateAll(gameMinutes);
    }
  }
}

// Singleton instance
export const rootStore = new RootStore();

// React context
const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

/**
 * Hook to access the game store from React components
 * Usage: const { timeStore, characterStore } = useGameStore();
 */
export function useGameStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error('useGameStore must be used within RootStoreProvider');
  }
  return store;
}
