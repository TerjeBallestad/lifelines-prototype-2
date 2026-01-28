export type MTGColor = 'white' | 'blue' | 'black' | 'red' | 'green';

// Skill categories - each MTG color has affinity for certain categories
export type SkillCategory = 'Practical' | 'Creative' | 'Social' | 'Technical';

// Resources produced by activities
export type ResourceType =
  | 'creativity'   // Blue-adjacent, from reading/thinking
  | 'food'         // Green/White, from cooking
  | 'cleanliness'  // White, from cleaning
  | 'comfort'      // Green, from resting
  | 'connection'   // Social activities
  | 'progress';    // General accomplishment feeling

// Output produced when completing an activity
export interface ActivityOutput {
  resource: ResourceType;
  baseAmount: number;
}

// Skill definition for the skill system
export interface SkillData {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

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
  initialPosition?: { x: number; y: number }; // Starting position in game world
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
  skillCategory?: SkillCategory;                    // Which skill this activity trains
  outputs?: ActivityOutput[];                       // Resources produced on completion
  difficulty?: number;                              // 1-3, default 1
}

// Result of scoring an activity for a character
export interface ActivityScore {
  activity: Activity;
  utility: number;      // 0-1 normalized total score
  colorMatch: number;   // How well activity colors match character
  needSatisfaction: number; // How much activity helps current needs
}

// Quest types for tracking player objectives
export type QuestType = 'resource' | 'skill' | 'composite';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  // For resource quests
  resourceType?: ResourceType;
  targetAmount?: number;
  // For skill quests
  characterId?: string;
  skillCategory?: SkillCategory;
  targetLevel?: number;
  // For composite quests - custom completion check
  compositeConditions?: {
    resources?: { type: ResourceType; amount: number }[];
  };
}
