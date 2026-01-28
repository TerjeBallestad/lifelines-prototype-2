import type { Quest } from '../types/game';

/**
 * Quest definitions for "Before the Fall"
 *
 * 3 quests in fixed sequence:
 * 1. Morning Routine - composite quest (food + cleanliness thresholds)
 * 2. Creative Output - produce 100 creativity
 * 3. Stay Connected - train Phone skill to level 2
 */
export const QUESTS: Quest[] = [
  {
    id: 'morning-routine',
    title: 'Morning Routine',
    description: 'Get the day started - prepare some food and tidy up',
    type: 'composite',
    compositeConditions: {
      resources: [
        { type: 'food', amount: 20 },
        { type: 'cleanliness', amount: 15 },
      ],
    },
  },
  {
    id: 'creative-output',
    title: 'Creative Output',
    description: 'Produce 100 creativity through reading and thinking',
    type: 'resource',
    resourceType: 'creativity',
    targetAmount: 100,
  },
  {
    id: 'stay-connected',
    title: 'Stay Connected',
    description: 'Train Phone skill to level 2',
    type: 'skill',
    characterId: 'elling',
    skillCategory: 'Social',
    targetLevel: 2,
  },
];

export function getQuestById(id: string): Quest | undefined {
  return QUESTS.find(q => q.id === id);
}
