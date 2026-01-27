import { makeAutoObservable } from 'mobx';
import type { Character } from './CharacterStore';
import type { RootStore } from './RootStore';

/**
 * InteractionStore manages player interaction state
 *
 * Tracks which character is selected for interaction and provides
 * computed access to the selected character.
 */
export class InteractionStore {
  selectedCharacterId: string | null = null;

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      rootStore: false,
    }, { autoBind: true });
  }

  get selectedCharacter(): Character | null {
    if (!this.selectedCharacterId) return null;
    return this.rootStore.characterStore.getCharacter(this.selectedCharacterId) ?? null;
  }

  selectCharacter(id: string): void {
    this.selectedCharacterId = id;
  }

  clearSelection(): void {
    this.selectedCharacterId = null;
  }
}
