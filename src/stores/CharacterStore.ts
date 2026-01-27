import { makeAutoObservable } from 'mobx';
import type { MTGColorProfile, Needs, CharacterData } from '../types/game';
import { CHARACTERS } from '../data/characters';
import type { RootStore } from './RootStore';

/**
 * Character class represents a single character's state
 *
 * Needs decay over time, overskudd is computed as average of all needs.
 * Lower overskudd means character is struggling and may exhibit shadow behaviors.
 */
export class Character {
  id: string;
  name: string;
  colors: MTGColorProfile;
  needs: Needs;
  currentActivity: string | null = null;

  readonly characterStore: CharacterStore;

  constructor(data: CharacterData, characterStore: CharacterStore) {
    this.id = data.id;
    this.name = data.name;
    this.colors = data.colors;
    this.needs = { ...data.initialNeeds };
    this.characterStore = characterStore;

    makeAutoObservable(this, {
      id: false,
      name: false,
      colors: false,
      characterStore: false,
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
      character.updateNeeds(gameMinutes);
    }
  }
}
