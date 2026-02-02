import { makeAutoObservable } from 'mobx';
import type { ResourceType } from '../types/game';
import type { RootStore } from './RootStore';

/**
 * ResourceStore manages global resource counts
 * Resources are produced by completing activities and consumed by various systems
 */
export class ResourceStore {
  resources: Map<ResourceType, number> = new Map();

  readonly rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });

    // Initialize all resources to 0
    const types: ResourceType[] = [
      'creativity',
      'food',
      'cleanliness',
      'comfort',
      'connection',
      'progress',
    ];
    for (const type of types) {
      this.resources.set(type, 0);
    }
  }

  /**
   * Get current amount of a resource
   */
  getResource(type: ResourceType): number {
    return this.resources.get(type) ?? 0;
  }

  /**
   * Add to a resource (can be negative to consume)
   */
  addResource(type: ResourceType, amount: number): void {
    const current = this.getResource(type);
    this.resources.set(type, current + amount);
  }

  /**
   * Set a resource to a specific value
   */
  setResource(type: ResourceType, amount: number): void {
    this.resources.set(type, amount);
  }

  /**
   * Get all resources as an object
   */
  get allResources(): Record<ResourceType, number> {
    return {
      creativity: this.getResource('creativity'),
      food: this.getResource('food'),
      cleanliness: this.getResource('cleanliness'),
      comfort: this.getResource('comfort'),
      connection: this.getResource('connection'),
      progress: this.getResource('progress'),
    };
  }

  /**
   * Reset for new game
   */
  reset(): void {
    this.resources.clear();
    // Reinitialize all resources to 0
    const types: ResourceType[] = [
      'creativity',
      'food',
      'cleanliness',
      'comfort',
      'connection',
      'progress',
    ];
    for (const type of types) {
      this.resources.set(type, 0);
    }
  }
}
