import { makeAutoObservable } from 'mobx';
import type { Character } from './CharacterStore';
import type { RootStore } from './RootStore';
import { ACTIVITIES } from '../data/activities';

/**
 * InteractionStore manages player interaction state
 *
 * Tracks which character is selected for interaction and provides
 * computed access to the selected character.
 */
export class InteractionStore {
  selectedCharacterId: string | null = null;
  activityModalOpen: boolean = false;
  assigningCharacterId: string | null = null;

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

  /**
   * Open activity modal for a character
   * Also selects the character to show info panel
   */
  openActivityModal(characterId: string): void {
    this.selectedCharacterId = characterId;
    this.assigningCharacterId = characterId;
    this.activityModalOpen = true;
  }

  /**
   * Close activity modal
   */
  closeActivityModal(): void {
    this.activityModalOpen = false;
    this.assigningCharacterId = null;
  }

  /**
   * Force assign an activity to the currently selected character
   * If character is busy, the activity gets queued instead
   * Returns true if successful (assigned or queued)
   */
  forceAssignActivity(activityId: string): boolean {
    if (!this.assigningCharacterId) return false;

    const character = this.rootStore.characterStore.getCharacter(this.assigningCharacterId);
    if (!character) return false;

    // Find activity
    const activity = ACTIVITIES.find(a => a.id === activityId);
    if (!activity) return false;

    // Force the activity (will queue if busy)
    character.forceActivity(activity);

    this.closeActivityModal();
    return true;
  }
}
