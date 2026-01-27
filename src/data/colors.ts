import type { MTGColor } from '../types/game';

export interface MTGColorConfig {
  bg: string;
  text: string;
  label: string;
  name: string;
}

export const MTG_COLORS: Record<MTGColor, MTGColorConfig> = {
  white: { bg: 'bg-amber-50', text: 'text-amber-900', label: 'W', name: 'White' },
  blue: { bg: 'bg-blue-600', text: 'text-white', label: 'U', name: 'Blue' },
  black: { bg: 'bg-gray-900', text: 'text-white', label: 'B', name: 'Black' },
  red: { bg: 'bg-red-600', text: 'text-white', label: 'R', name: 'Red' },
  green: { bg: 'bg-green-600', text: 'text-white', label: 'G', name: 'Green' },
} as const;
