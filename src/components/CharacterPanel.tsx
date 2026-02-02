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
      className="card bg-base-100 hover:bg-base-200 cursor-pointer shadow-lg transition-colors"
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
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-base-content/70">Overskudd</span>
            <span className="font-mono">{Math.round(character.overskudd)}</span>
          </div>
          <OverskuddMeter value={character.overskudd} />
        </div>

        {/* Individual Needs - compact */}
        <div className="mt-2 space-y-1">
          {/* Energy */}
          <div className="flex items-center gap-2">
            <span className="text-base-content/70 w-12 text-xs">Energy</span>
            <div className="bg-base-300 h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-info h-full rounded-full transition-all duration-300"
                style={{ width: `${character.needs.energy}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono text-xs">
              {Math.round(character.needs.energy)}
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-2">
            <span className="text-base-content/70 w-12 text-xs">Social</span>
            <div className="bg-base-300 h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-300"
                style={{ width: `${character.needs.social}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono text-xs">
              {Math.round(character.needs.social)}
            </span>
          </div>

          {/* Purpose */}
          <div className="flex items-center gap-2">
            <span className="text-base-content/70 w-12 text-xs">Purpose</span>
            <div className="bg-base-300 h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-accent h-full rounded-full transition-all duration-300"
                style={{ width: `${character.needs.purpose}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono text-xs">
              {Math.round(character.needs.purpose)}
            </span>
          </div>
        </div>

        {/* Current Activity */}
        <div className="border-base-300 mt-2 border-t pt-2 text-xs">
          <span className="text-base-content/70">Activity: </span>
          <span className="font-medium">
            {character.currentActivity?.name ?? 'Idle'}
          </span>
        </div>

        {/* Skills Section */}
        <div className="border-base-300 mt-2 border-t pt-2">
          <h4 className="text-base-content/70 mb-1 text-xs font-medium">
            Skills
          </h4>
          <div className="space-y-1">
            {(['Practical', 'Creative', 'Social', 'Technical'] as const).map(
              (category) => {
                const skill = skillStore.getSkill(
                  character.id,
                  category as SkillCategory
                );
                return skill ? (
                  <SkillProgress key={category} skill={skill} compact />
                ) : null;
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
