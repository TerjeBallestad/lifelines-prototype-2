export type MTGColor = 'white' | 'blue' | 'black' | 'red' | 'green';

export interface ColorIntensity {
  color: MTGColor;
  intensity: number; // 0.0 - 1.0
}

export interface MTGColorProfile {
  primary: ColorIntensity;
  secondary?: ColorIntensity;
}

export interface Needs {
  energy: number;    // 0-100
  social: number;    // 0-100
  purpose: number;   // 0-100
}

export interface CharacterData {
  id: string;
  name: string;
  colors: MTGColorProfile;
  initialNeeds: Needs;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Character behavioral state
export type CharacterState = 'idle' | 'deciding' | 'walking' | 'performing';

// Activity definition for the Utility AI system
export interface Activity {
  id: string;
  name: string;
  icon?: string;                                    // Emoji or single char for thought bubble
  colorAffinities: Partial<Record<MTGColor, number>>; // 0-1 per color
  location: { x: number; y: number };               // Spatial position in game world
  duration: number;                                 // Game hours to complete
  effects: {
    energy?: number;                                // Positive = restore, negative = consume
    social?: number;
    purpose?: number;
  };
  isComfortBehavior?: boolean;                      // For low-overskudd fallback
}

// Result of scoring an activity for a character
export interface ActivityScore {
  activity: Activity;
  utility: number;      // 0-1 normalized total score
  colorMatch: number;   // How well activity colors match character
  needSatisfaction: number; // How much activity helps current needs
}
