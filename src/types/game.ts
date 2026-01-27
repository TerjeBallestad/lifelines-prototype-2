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
