import type { CharacterData } from '../types/game';

/**
 * Character definitions for "Before the Fall"
 *
 * Elling: Blue 1.0 (exaggerated, as per research notes), Green 0.4
 * - Blue represents his intellectual, analytical nature but also his anxiety and isolation
 * - Green secondary shows his underlying desire for natural order and simplicity
 *
 * Mother (Ella): White 0.7, Green 0.5
 * - White represents her nurturing, protective nature and adherence to routines
 * - Green secondary shows her connection to home and natural rhythms
 */
export const CHARACTERS: CharacterData[] = [
  {
    id: 'elling',
    name: 'Elling',
    colors: {
      primary: { color: 'blue', intensity: 1.0 },
      secondary: { color: 'green', intensity: 0.4 },
    },
    initialNeeds: {
      energy: 80,
      social: 60,
      purpose: 50,
    },
  },
  {
    id: 'mother',
    name: 'Mother',
    colors: {
      primary: { color: 'white', intensity: 0.7 },
      secondary: { color: 'green', intensity: 0.5 },
    },
    initialNeeds: {
      energy: 80,
      social: 60,
      purpose: 50,
    },
  },
];

export function getCharacterById(id: string): CharacterData | undefined {
  return CHARACTERS.find((c) => c.id === id);
}
