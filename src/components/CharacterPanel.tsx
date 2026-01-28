import { observer } from 'mobx-react-lite';
import { useGameStore } from '../stores/RootStore';
import { ColorBadge } from './ColorBadge';
import { OverskuddMeter } from './OverskuddMeter';
import { SkillProgress } from './SkillProgress';
import type { SkillCategory } from '../types/game';
import type { Character } from '../stores/CharacterStore';

interface CharacterPanelProps {
  character: Character;
  onClick?: () => void;
}

/**
 * CharacterPanel displays full character information
 *
 * Shows MTG colors, overskudd meter, individual needs, and current activity.
 * Always visible - accepts character as prop.
 * CRITICAL: Uses observer() for MobX reactivity.
 */
export const CharacterPanel = observer(function CharacterPanel({
  character,
  onClick,
}: CharacterPanelProps) {
  const { skillStore } = useGameStore();

  return (
    <div
      className="card bg-base-100 shadow-lg cursor-pointer hover:bg-base-200 transition-colors"
      onClick={onClick}
    >
      <div className="card-body p-3">
        {/* Header with name and colors */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{character.name}</h2>
          <div className="flex gap-1">
            <ColorBadge
              color={character.colors.primary.color}
              intensity={character.colors.primary.intensity}
            />
            {character.colors.secondary && (
              <ColorBadge
                color={character.colors.secondary.color}
                intensity={character.colors.secondary.intensity}
              />
            )}
          </div>
        </div>

        {/* Overskudd Meter */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-base-content/70">Overskudd</span>
            <span className="font-mono">{Math.round(character.overskudd)}</span>
          </div>
          <OverskuddMeter value={character.overskudd} />
        </div>

        {/* Individual Needs - compact */}
        <div className="mt-2 space-y-1">
          {/* Energy */}
          <div className="flex items-center gap-2">
            <span className="text-xs w-12 text-base-content/70">Energy</span>
            <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-info rounded-full transition-all duration-300"
                style={{ width: `${character.needs.energy}%` }}
              />
            </div>
            <span className="text-xs w-6 text-right font-mono">
              {Math.round(character.needs.energy)}
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            <span className="text-xs w-12 text-base-content/70">Social</span>
            <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-300"
                style={{ width: `${character.needs.social}%` }}
              />
            </div>
            <span className="text-xs w-6 text-right font-mono">
              {Math.round(character.needs.social)}
            </span>
          </div>

          {/* Purpose */}
          <div className="flex items-center gap-2">
            <span className="text-xs w-12 text-base-content/70">Purpose</span>
            <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${character.needs.purpose}%` }}
              />
            </div>
            <span className="text-xs w-6 text-right font-mono">
              {Math.round(character.needs.purpose)}
            </span>
          </div>
        </div>

        {/* Current Activity */}
        <div className="mt-2 pt-2 border-t border-base-300 text-xs">
          <span className="text-base-content/70">Activity: </span>
          <span className="font-medium">
            {character.currentActivity?.name ?? 'Idle'}
          </span>
        </div>

        {/* Skills Section */}
        <div className="mt-2 pt-2 border-t border-base-300">
          <h4 className="text-xs font-medium text-base-content/70 mb-1">Skills</h4>
          <div className="space-y-1">
            {(['Practical', 'Creative', 'Social', 'Technical'] as const).map(category => {
              const skill = skillStore.getSkill(character.id, category as SkillCategory);
              return skill ? (
                <SkillProgress key={category} skill={skill} compact />
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
