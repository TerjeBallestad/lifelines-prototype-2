import type { CrisisAction } from '../types/game';

/**
 * Actions available during the crisis
 * Phone is the critical action - success saves Mother
 * Other actions give hope bonus (+10% to next phone attempt)
 */
export const CRISIS_ACTIONS: CrisisAction[] = [
  {
    id: 'call-emergency',
    name: 'Call Emergency Services',
    icon: '📞',
    description: 'Dial 113 and explain the situation',
    skillCategory: 'Social',  // Phone skill is Social category
    baseDifficulty: 2,
  },
  {
    id: 'help-mother',
    name: 'Help Mother',
    icon: '🤲',
    description: 'Try to make her comfortable',
    skillCategory: 'Practical',
    baseDifficulty: 1,
    givesHopeBonus: true,
  },
  {
    id: 'run-neighbor',
    name: 'Run to Neighbor',
    icon: '🏃',
    description: 'Get help from next door',
    skillCategory: 'Social',
    baseDifficulty: 1,
    givesHopeBonus: true,
  },
];

/**
 * Epilogue text for each outcome
 */
export const EPILOGUE_TEXT = {
  saved: {
    title: 'Mother Saved',
    paragraphs: [
      'The ambulance arrived in time. Mother was rushed to the hospital, where doctors stabilized her condition.',
      'Elling sat in the waiting room, hands still trembling from the phone call. It had taken everything he had to dial those numbers, to speak to the stranger on the other end.',
      'But he had done it. When it mattered most, he had found the courage to act.',
      'Mother would need time to recover, and things would be different now. But they would face it together.',
    ],
  },
  lost: {
    title: 'Mother Lost',
    paragraphs: [
      'By the time help arrived, it was too late. Mother had slipped away quietly, lying on the floor where she had fallen.',
      'Elling sat beside her, frozen. He had tried to call, but his hands wouldn\'t stop shaking. The numbers blurred together. His voice wouldn\'t come.',
      'The phone skill he had neglected, the calls he had avoided - they had mattered more than he ever knew.',
      'Now he was alone, in the apartment that had been their whole world. And he would have to learn to survive in a world that had always terrified him.',
    ],
  },
};
